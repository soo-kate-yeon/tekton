/**
 * @tekton/core - Token Binding Resolver
 * Resolves token bindings with template variable substitution
 * [SPEC-LAYOUT-002] [PHASE-2]
 */

import type { TokenBindings } from '../../component-schemas.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Token binding resolution context
 * Contains component props and theme for template variable substitution
 */
export interface TokenBindingContext {
  /** Component props for template variable substitution */
  props: Record<string, unknown>;

  /** Theme ID for token resolution */
  theme: string;
}

/**
 * Resolved token bindings map
 * Maps property names to CSS variable references
 */
export type ResolvedTokenBindings = Record<string, string>;

// ============================================================================
// Cache
// ============================================================================

/**
 * Token binding cache for performance optimization
 * Key: `${binding}:${JSON.stringify(props)}:${theme}`
 */
const bindingCache = new Map<string, string>();

/**
 * Clear token binding cache
 * Useful for testing or when token definitions change
 *
 * @example
 * ```typescript
 * clearBindingCache();
 * ```
 */
export function clearBindingCache(): void {
  bindingCache.clear();
}

// ============================================================================
// Template Variable Substitution
// ============================================================================

/**
 * Substitute template variables in token binding
 *
 * Template syntax: `{variableName}`
 * Variables are resolved from component props
 *
 * @param binding - Token binding with template variables (e.g., "component.button.{variant}.background")
 * @param props - Component props (e.g., { variant: "primary" })
 * @returns Token reference with substituted variables (e.g., "component.button.primary.background")
 * @throws Error if required template variable is missing from props
 *
 * @example
 * ```typescript
 * substituteTemplateVariables(
 *   'component.button.{variant}.background',
 *   { variant: 'primary' }
 * ); // → 'component.button.primary.background'
 *
 * substituteTemplateVariables(
 *   'atomic.spacing.{size}',
 *   { size: 'large' }
 * ); // → 'atomic.spacing.large'
 * ```
 */
export function substituteTemplateVariables(
  binding: string,
  props: Record<string, unknown>
): string {
  // Match template variables: {variableName}
  const templateVarRegex = /\{([^}]+)\}/g;
  const matches = [...binding.matchAll(templateVarRegex)];

  if (matches.length === 0) {
    // No template variables, return as-is
    return binding;
  }

  let result = binding;

  for (const match of matches) {
    const variableName = match[1];
    const variableValue = props[variableName];

    if (variableValue === undefined) {
      throw new Error(
        `Template variable '${variableName}' not found in props. ` +
          `Available props: ${Object.keys(props).join(', ')}`
      );
    }

    if (typeof variableValue !== 'string' && typeof variableValue !== 'number') {
      throw new Error(
        `Template variable '${variableName}' must be string or number, ` +
          `got ${typeof variableValue}`
      );
    }

    // Replace template variable with prop value
    result = result.replace(`{${variableName}}`, String(variableValue));
  }

  return result;
}

// ============================================================================
// Token Reference to CSS Variable Conversion
// ============================================================================

/**
 * Convert token reference to CSS variable reference
 *
 * Converts dot notation to CSS custom property format:
 * - "atomic.spacing.16" → "var(--atomic-spacing-16)"
 * - "semantic.color.primary" → "var(--semantic-color-primary)"
 *
 * @param tokenRef - Token reference in dot notation
 * @returns CSS variable reference in var() format
 *
 * @example
 * ```typescript
 * tokenRefToCSSVar('atomic.spacing.16'); // → 'var(--atomic-spacing-16)'
 * tokenRefToCSSVar('semantic.color.primary'); // → 'var(--semantic-color-primary)'
 * ```
 */
export function tokenRefToCSSVar(tokenRef: string): string {
  // Convert dot notation to CSS variable format
  // "atomic.spacing.16" → "--atomic-spacing-16"
  const cssVarName = `--${tokenRef.replace(/\./g, '-')}`;

  // Wrap in var() function
  return `var(${cssVarName})`;
}

// ============================================================================
// Core Resolution Functions
// ============================================================================

/**
 * Resolve single token binding with caching
 *
 * Process:
 * 1. Check cache for previously resolved binding
 * 2. Substitute template variables from props
 * 3. Convert to CSS variable reference
 * 4. Cache the result
 *
 * @param binding - Token binding (may contain template variables)
 * @param context - Resolution context with props and theme
 * @returns CSS variable reference
 * @throws Error if template variable substitution fails
 *
 * @example
 * ```typescript
 * const context = {
 *   props: { variant: 'primary', size: 'medium' },
 *   theme: 'default'
 * };
 *
 * resolveBinding('component.button.{variant}.background', context);
 * // → 'var(--component-button-primary-background)'
 *
 * resolveBinding('atomic.spacing.{size}', context);
 * // → 'var(--atomic-spacing-medium)'
 * ```
 */
export function resolveBinding(binding: string, context: TokenBindingContext): string {
  // Generate cache key
  const cacheKey = `${binding}:${JSON.stringify(context.props)}:${context.theme}`;

  // Check cache
  const cached = bindingCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Substitute template variables
  const tokenRef = substituteTemplateVariables(binding, context.props);

  // Convert to CSS variable
  const cssVar = tokenRefToCSSVar(tokenRef);

  // Cache result
  bindingCache.set(cacheKey, cssVar);

  return cssVar;
}

/**
 * Resolve all token bindings for a component
 *
 * Processes all token bindings in the component schema,
 * substituting template variables and converting to CSS variables.
 *
 * @param bindings - Token bindings from component schema
 * @param context - Resolution context with props and theme
 * @returns Resolved token bindings map (property → CSS variable)
 *
 * @example
 * ```typescript
 * const bindings = {
 *   background: 'component.button.{variant}.background',
 *   foreground: 'component.button.{variant}.foreground',
 *   padding: 'atomic.spacing.{size}'
 * };
 *
 * const context = {
 *   props: { variant: 'primary', size: 'medium' },
 *   theme: 'default'
 * };
 *
 * const resolved = resolveBindings(bindings, context);
 * // {
 * //   background: 'var(--component-button-primary-background)',
 * //   foreground: 'var(--component-button-primary-foreground)',
 * //   padding: 'var(--atomic-spacing-medium)'
 * // }
 * ```
 */
export function resolveBindings(
  bindings: TokenBindings,
  context: TokenBindingContext
): ResolvedTokenBindings {
  const resolved: ResolvedTokenBindings = {};

  for (const [propName, binding] of Object.entries(bindings)) {
    try {
      resolved[propName] = resolveBinding(binding, context);
    } catch (error) {
      // Provide helpful error message with context
      throw new Error(
        `Failed to resolve token binding for property '${propName}': ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  return resolved;
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validate token binding format
 *
 * Checks if a token binding string is valid:
 * - Must be in dot notation (e.g., "atomic.spacing.16")
 * - May contain template variables (e.g., "component.button.{variant}.background")
 * - Must start with valid layer (atomic, semantic, component)
 *
 * @param binding - Token binding to validate
 * @returns True if valid, false otherwise
 *
 * @example
 * ```typescript
 * isValidTokenBinding('atomic.spacing.16'); // → true
 * isValidTokenBinding('component.button.{variant}.background'); // → true
 * isValidTokenBinding('invalid-format'); // → false
 * ```
 */
export function isValidTokenBinding(binding: string): boolean {
  // Check if binding starts with valid layer
  const startsWithLayer =
    binding.startsWith('atomic.') ||
    binding.startsWith('semantic.') ||
    binding.startsWith('component.');

  if (!startsWithLayer) {
    return false;
  }

  // Check if binding contains at least one dot
  if (!binding.includes('.')) {
    return false;
  }

  // Check if template variables are properly formatted
  const templateVarRegex = /\{([^}]+)\}/g;
  const matches = [...binding.matchAll(templateVarRegex)];

  for (const match of matches) {
    const variableName = match[1];
    // Variable name should be alphanumeric with underscores
    if (!/^[a-zA-Z0-9_]+$/.test(variableName)) {
      return false;
    }
  }

  return true;
}

/**
 * Extract template variable names from binding
 *
 * @param binding - Token binding with template variables
 * @returns Array of template variable names
 *
 * @example
 * ```typescript
 * extractTemplateVariables('component.button.{variant}.{size}.background');
 * // → ['variant', 'size']
 *
 * extractTemplateVariables('atomic.spacing.16');
 * // → []
 * ```
 */
export function extractTemplateVariables(binding: string): string[] {
  const templateVarRegex = /\{([^}]+)\}/g;
  const matches = [...binding.matchAll(templateVarRegex)];
  return matches.map(match => match[1]);
}
