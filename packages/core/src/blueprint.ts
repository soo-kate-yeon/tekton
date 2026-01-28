/**
 * @tekton/core - Blueprint Module
 * Define and validate screen blueprints
 * Target: 150 LOC
 */

import type { Blueprint, ComponentNode, LayoutType } from './types.js';
import { resolveLayout } from './layout-resolver.js';

// ============================================================================
// Layout Definitions
// ============================================================================

export interface LayoutSlot {
  name: string;
  required: boolean;
  allowedComponents?: string[];
}

export const LAYOUTS: Record<LayoutType, LayoutSlot[]> = {
  'single-column': [
    { name: 'header', required: false },
    { name: 'main', required: true },
    { name: 'footer', required: false },
  ],
  'two-column': [
    { name: 'header', required: false },
    { name: 'left', required: true },
    { name: 'right', required: true },
    { name: 'footer', required: false },
  ],
  'sidebar-left': [
    { name: 'header', required: false },
    { name: 'sidebar', required: true },
    { name: 'main', required: true },
    { name: 'footer', required: false },
  ],
  'sidebar-right': [
    { name: 'header', required: false },
    { name: 'main', required: true },
    { name: 'sidebar', required: true },
    { name: 'footer', required: false },
  ],
  dashboard: [
    { name: 'header', required: true },
    { name: 'sidebar', required: true },
    { name: 'main', required: true },
    { name: 'footer', required: false },
  ],
  landing: [
    { name: 'hero', required: true },
    { name: 'features', required: false },
    { name: 'cta', required: false },
    { name: 'footer', required: false },
  ],
};

// ============================================================================
// Component Catalog
// ============================================================================

export const COMPONENT_CATALOG = [
  'Button',
  'Input',
  'Card',
  'Text',
  'Heading',
  'Image',
  'Link',
  'List',
  'Form',
  'Modal',
  'Tabs',
  'Table',
  'Badge',
  'Avatar',
  'Dropdown',
  'Checkbox',
  'Radio',
  'Switch',
  'Slider',
  'Progress',
] as const;

export type ComponentType = (typeof COMPONENT_CATALOG)[number];

// ============================================================================
// Blueprint Creation
// ============================================================================

export interface CreateBlueprintInput {
  name: string;
  description?: string;
  themeId: string;
  layout: LayoutType;
  layoutToken?: string; // NEW: Optional layout token ID
  components: ComponentNode[];
}

/**
 * Validate layout token ID format
 * Must match: "shell.*.*" OR "page.*" OR "section.*"
 */
function validateLayoutToken(layoutToken: string): void {
  const shellPattern = /^shell\.[a-z0-9-]+\.[a-z0-9-]+$/;
  const pagePattern = /^page\.[a-z0-9-]+$/;
  const sectionPattern = /^section\.[a-z0-9-]+$/;

  if (
    !shellPattern.test(layoutToken) &&
    !pagePattern.test(layoutToken) &&
    !sectionPattern.test(layoutToken)
  ) {
    throw new Error(
      `Invalid layoutToken format: "${layoutToken}". Must match "shell.*.*", "page.*", or "section.*"`
    );
  }
}

/**
 * Create a new blueprint with validation
 * Supports optional layoutToken for advanced layout configuration
 */
export function createBlueprint(input: CreateBlueprintInput): Blueprint {
  const id = `bp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // Handle layoutToken if provided
  let layoutConfig;
  if (input.layoutToken) {
    // Validate layoutToken format
    validateLayoutToken(input.layoutToken);

    // Resolve layoutToken to get layoutConfig
    try {
      layoutConfig = resolveLayout(input.layoutToken);
    } catch (error) {
      throw new Error(
        `Failed to resolve layoutToken "${input.layoutToken}": ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  return {
    id,
    name: input.name,
    description: input.description,
    themeId: input.themeId,
    layout: input.layout,
    layoutToken: input.layoutToken,
    layoutConfig,
    components: input.components,
  };
}

// ============================================================================
// Blueprint Validation
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate blueprint structure
 */
export function validateBlueprint(blueprint: Blueprint): ValidationResult {
  const errors: string[] = [];

  // Check required fields
  if (!blueprint.id) {
    errors.push('Missing blueprint id');
  }
  if (!blueprint.name) {
    errors.push('Missing blueprint name');
  }
  if (!blueprint.themeId) {
    errors.push('Missing themeId');
  }
  if (!blueprint.layout) {
    errors.push('Missing layout');
  }

  // Check layout validity
  if (blueprint.layout && !LAYOUTS[blueprint.layout]) {
    errors.push(`Invalid layout: ${blueprint.layout}`);
  }

  // Check components
  if (!blueprint.components || !Array.isArray(blueprint.components)) {
    errors.push('Components must be an array');
  } else {
    for (const comp of blueprint.components) {
      if (!comp.type) {
        errors.push('Component missing type');
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if component type is in catalog
 */
export function isValidComponent(type: string): boolean {
  return COMPONENT_CATALOG.includes(type as ComponentType);
}

/**
 * Get layout slots for a layout type
 */
export function getLayoutSlots(layout: LayoutType): LayoutSlot[] {
  return LAYOUTS[layout] || [];
}
