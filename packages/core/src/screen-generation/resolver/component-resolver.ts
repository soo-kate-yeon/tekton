/**
 * @tekton/core - Component Resolver
 * Resolves component definitions to complete component structures with token bindings
 * [SPEC-LAYOUT-002] [PHASE-2]
 */

import { getComponentSchema, type ComponentSchema } from '../../component-schemas.js';
import type { ComponentDefinition } from '../types.js';
import {
  resolveBindings,
  type TokenBindingContext,
  type ResolvedTokenBindings,
} from './token-resolver.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Resolved component with complete schema and token bindings
 * Ready for rendering with all properties and styles resolved
 */
export interface ResolvedComponent {
  /** Component type (e.g., "Button", "Input") */
  type: string;

  /** Component schema with props definition and a11y requirements */
  schema: ComponentSchema;

  /** Original component props from definition */
  props: Record<string, unknown>;

  /** Resolved props with defaults and validation */
  resolvedProps: Record<string, unknown>;

  /** Resolved token bindings (property → CSS variable) */
  tokenBindings: ResolvedTokenBindings;

  /** Child components (recursively resolved) or text content */
  children?: (ResolvedComponent | string)[];

  /** Layout slot assignment (for section positioning) */
  slot?: string;
}

/**
 * Component resolution context
 * Provides theme and screen information for resolution
 */
export interface ComponentContext {
  /** Theme ID for token resolution */
  theme: string;

  /** Screen ID for error messages */
  screenId: string;

  /** Section ID for error messages (if resolving within section) */
  sectionId?: string;
}

// ============================================================================
// Cache
// ============================================================================

/**
 * Component resolution cache
 * Key: `${type}:${JSON.stringify(props)}:${theme}`
 */
const componentCache = new Map<string, ResolvedComponent>();

/**
 * Clear component resolution cache
 * Useful for testing or when component schemas change
 *
 * @example
 * ```typescript
 * clearComponentCache();
 * ```
 */
export function clearComponentCache(): void {
  componentCache.clear();
}

// ============================================================================
// Props Resolution
// ============================================================================

/**
 * Merge component props with defaults from schema
 *
 * Process:
 * 1. Start with default values from schema
 * 2. Override with user-provided props
 * 3. Validate required props
 *
 * @param props - User-provided component props
 * @param schema - Component schema with prop definitions
 * @returns Merged props with defaults applied
 * @throws Error if required prop is missing
 *
 * @example
 * ```typescript
 * const schema = {
 *   props: [
 *     { name: 'variant', defaultValue: 'primary', required: false },
 *     { name: 'children', required: true }
 *   ]
 * };
 *
 * mergePropsWithDefaults({ children: 'Click me' }, schema);
 * // → { variant: 'primary', children: 'Click me' }
 * ```
 */
function mergePropsWithDefaults(
  props: Record<string, unknown>,
  schema: ComponentSchema
): Record<string, unknown> {
  const merged: Record<string, unknown> = {};

  // Apply defaults first
  for (const propDef of schema.props) {
    if (propDef.defaultValue !== undefined) {
      merged[propDef.name] = propDef.defaultValue;
    }
  }

  // Override with user props
  Object.assign(merged, props);

  // Validate required props
  for (const propDef of schema.props) {
    if (propDef.required && merged[propDef.name] === undefined) {
      throw new Error(
        `Required prop '${propDef.name}' is missing for component '${schema.type}'. ` +
          `Description: ${propDef.description}`
      );
    }
  }

  return merged;
}

// ============================================================================
// Core Resolution Functions
// ============================================================================

/**
 * Resolve component definition to complete resolved component
 *
 * Process:
 * 1. Validate component type exists
 * 2. Get component schema
 * 3. Merge props with defaults
 * 4. Resolve token bindings with template variables
 * 5. Recursively resolve children
 *
 * @param component - Component definition to resolve
 * @param context - Resolution context with theme and screen info
 * @returns Resolved component with schema, props, and token bindings
 * @throws Error if component type not found or resolution fails
 *
 * @example
 * ```typescript
 * const definition = {
 *   type: 'Button',
 *   props: { variant: 'primary', children: 'Click me' }
 * };
 *
 * const context = {
 *   theme: 'default',
 *   screenId: 'dashboard-screen'
 * };
 *
 * const resolved = resolveComponent(definition, context);
 * console.log(resolved.schema.type); // → 'Button'
 * console.log(resolved.tokenBindings.background); // → 'var(--component-button-primary-background)'
 * ```
 */
export function resolveComponent(
  component: ComponentDefinition,
  context: ComponentContext
): ResolvedComponent {
  // Generate cache key (include slot for uniqueness)
  const cacheKey = `${component.type}:${JSON.stringify(component.props)}:${component.slot || ''}:${context.theme}`;

  // Check cache (skip for components with children as they need recursive resolution)
  if (!component.children && componentCache.has(cacheKey)) {
    return componentCache.get(cacheKey)!;
  }

  // Get component schema
  const schema = getComponentSchema(component.type);

  if (!schema) {
    throw new Error(
      `Unknown component type '${component.type}' in screen '${context.screenId}'. ` +
        `Available types: Button, Input, Text, Heading, Checkbox, Radio, Switch, Slider, ` +
        `Badge, Avatar, Card, Modal, Tabs, Table, Link, List, Image, Form, Dropdown, Progress`
    );
  }

  // Merge props with defaults and validate
  // Special handling: if component has children array, map to props.children
  const propsWithChildren = { ...component.props };
  if (component.children && component.children.length > 0 && !propsWithChildren.children) {
    // For components that accept children as prop (Card, Modal, etc.)
    // Map ComponentDefinition.children to props.children
    propsWithChildren.children = component.children;
  }

  let resolvedProps: Record<string, unknown>;
  try {
    resolvedProps = mergePropsWithDefaults(propsWithChildren, schema);
  } catch (error) {
    const sectionInfo = context.sectionId ? ` in section '${context.sectionId}'` : '';
    throw new Error(
      `Failed to resolve props for component '${component.type}'${sectionInfo}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  // Resolve token bindings
  const tokenBindingContext: TokenBindingContext = {
    props: resolvedProps,
    theme: context.theme,
  };

  let tokenBindings: ResolvedTokenBindings;
  try {
    tokenBindings = resolveBindings(schema.tokenBindings, tokenBindingContext);
  } catch (error) {
    const sectionInfo = context.sectionId ? ` in section '${context.sectionId}'` : '';
    throw new Error(
      `Failed to resolve token bindings for component '${component.type}'${sectionInfo}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  // Recursively resolve children
  let children: (ResolvedComponent | string)[] | undefined;
  if (component.children && component.children.length > 0) {
    children = resolveChildren(component.children, context);
  }

  const resolved: ResolvedComponent = {
    type: component.type,
    schema,
    props: component.props,
    resolvedProps,
    tokenBindings,
    children,
    slot: component.slot,
  };

  // Cache result (skip components with children as they contain references)
  if (!component.children) {
    componentCache.set(cacheKey, resolved);
  }

  return resolved;
}

/**
 * Resolve children components recursively
 *
 * Handles both component definitions and text content.
 * Maintains order and structure from original definition.
 *
 * @param children - Array of component definitions or strings
 * @param context - Resolution context
 * @returns Array of resolved components or strings
 *
 * @example
 * ```typescript
 * const children = [
 *   { type: 'Text', props: { children: 'Label' } },
 *   { type: 'Button', props: { variant: 'primary', children: 'Submit' } }
 * ];
 *
 * const context = { theme: 'default', screenId: 'form-screen' };
 * const resolved = resolveChildren(children, context);
 * // → [ResolvedComponent<Text>, ResolvedComponent<Button>]
 * ```
 */
export function resolveChildren(
  children: (ComponentDefinition | string)[],
  context: ComponentContext
): (ResolvedComponent | string)[] {
  return children.map((child, index) => {
    if (typeof child === 'string') {
      // Text content
      return child;
    } else {
      // Component definition - resolve recursively
      try {
        return resolveComponent(child, context);
      } catch (error) {
        throw new Error(
          `Failed to resolve child component at index ${index}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
  });
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validate component definition structure
 *
 * Checks:
 * - type field is present and string
 * - props field is present and object
 * - children field (if present) is array
 * - slot field (if present) is string
 *
 * @param component - Component definition to validate
 * @returns True if valid, false otherwise
 *
 * @example
 * ```typescript
 * isValidComponentDefinition({
 *   type: 'Button',
 *   props: { variant: 'primary' }
 * }); // → true
 *
 * isValidComponentDefinition({
 *   props: { variant: 'primary' }
 * }); // → false (missing type)
 * ```
 */
export function isValidComponentDefinition(component: unknown): component is ComponentDefinition {
  if (typeof component !== 'object' || component === null) {
    return false;
  }

  const obj = component as Record<string, unknown>;

  // Check required fields
  if (typeof obj.type !== 'string' || typeof obj.props !== 'object' || obj.props === null) {
    return false;
  }

  // Check optional fields
  if (obj.children !== undefined && !Array.isArray(obj.children)) {
    return false;
  }

  if (obj.slot !== undefined && typeof obj.slot !== 'string') {
    return false;
  }

  return true;
}

/**
 * Extract all component types from component tree
 *
 * Recursively traverses component tree and collects unique types.
 * Useful for validation and dependency analysis.
 *
 * @param component - Root component definition
 * @returns Set of unique component types
 *
 * @example
 * ```typescript
 * const component = {
 *   type: 'Card',
 *   props: {},
 *   children: [
 *     { type: 'Heading', props: { children: 'Title' } },
 *     { type: 'Text', props: { children: 'Content' } }
 *   ]
 * };
 *
 * extractComponentTypes(component);
 * // → Set(['Card', 'Heading', 'Text'])
 * ```
 */
export function extractComponentTypes(component: ComponentDefinition): Set<string> {
  const types = new Set<string>();
  types.add(component.type);

  if (component.children) {
    for (const child of component.children) {
      if (typeof child !== 'string') {
        const childTypes = extractComponentTypes(child);
        childTypes.forEach(type => types.add(type));
      }
    }
  }

  return types;
}
