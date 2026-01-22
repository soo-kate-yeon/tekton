/**
 * Layout Class Generator
 * SPEC-LAYOUT-001 - TASK-008
 *
 * Generates Tailwind CSS classes from layout configuration.
 */

import {
  GRID_DEFAULTS,
  ENVIRONMENT_GRID_PRESETS,
  type EnvironmentType,
} from '@tekton/theme';
import type { BlueprintLayout } from '../types/layout-schema.js';
import type { Environment } from '../types/knowledge-schema.js';

/**
 * Map Environment to EnvironmentType
 */
function mapEnvironment(env: Environment | undefined): EnvironmentType {
  if (!env) {
    return 'responsive';
  }
  return env as EnvironmentType;
}

/**
 * Generate Tailwind CSS classes for layout configuration
 *
 * Produces an array of Tailwind utility classes based on the layout configuration
 * and environment. When specific layout values are not provided, environment-appropriate
 * defaults are used.
 *
 * @param layout - Optional blueprint layout configuration
 * @param environment - Target environment (defaults to 'responsive')
 * @returns Array of Tailwind CSS class names
 *
 * @example
 * generateLayoutClasses({ container: 'fixed', maxWidth: 'xl' }, 'web')
 * // ['container', 'mx-auto', 'max-w-xl', 'grid', ...]
 */
export function generateLayoutClasses(
  layout?: BlueprintLayout,
  environment?: Environment
): string[] {
  const classes: string[] = [];
  const envType = mapEnvironment(environment);
  const activeBreakpoints = ENVIRONMENT_GRID_PRESETS[envType];

  // Container classes
  if (layout?.container !== 'none') {
    classes.push('container');
    classes.push('mx-auto');
  }

  // Max width
  if (layout?.maxWidth) {
    classes.push(`max-w-${layout.maxWidth}`);
  }

  // Padding
  if (layout?.padding !== undefined) {
    classes.push(`px-${layout.padding}`);
  } else {
    // Apply responsive padding from defaults
    classes.push('px-4', 'sm:px-6', 'md:px-8', 'lg:px-12', 'xl:px-16');
  }

  // Grid display
  classes.push('grid');

  // Grid columns (responsive)
  if (layout?.grid) {
    const { grid } = layout;
    if (grid.default !== undefined) {
      classes.push(`grid-cols-${grid.default}`);
    }
    if (grid.sm !== undefined) {
      classes.push(`sm:grid-cols-${grid.sm}`);
    }
    if (grid.md !== undefined) {
      classes.push(`md:grid-cols-${grid.md}`);
    }
    if (grid.lg !== undefined) {
      classes.push(`lg:grid-cols-${grid.lg}`);
    }
    if (grid.xl !== undefined) {
      classes.push(`xl:grid-cols-${grid.xl}`);
    }
    if (grid['2xl'] !== undefined) {
      classes.push(`2xl:grid-cols-${grid['2xl']}`);
    }
  } else {
    // Apply environment-based defaults
    for (const bp of activeBreakpoints) {
      const cols = GRID_DEFAULTS[bp].columns;
      if (bp === 'default') {
        classes.push(`grid-cols-${cols}`);
      } else {
        classes.push(`${bp}:grid-cols-${cols}`);
      }
    }
  }

  // Gap
  if (layout?.gap !== undefined) {
    if (typeof layout.gap === 'number') {
      classes.push(`gap-${layout.gap}`);
    } else {
      if (layout.gap.x !== undefined) {
        classes.push(`gap-x-${layout.gap.x}`);
      }
      if (layout.gap.y !== undefined) {
        classes.push(`gap-y-${layout.gap.y}`);
      }
    }
  } else {
    // Default responsive gap
    classes.push('gap-4', 'sm:gap-4', 'md:gap-6', 'lg:gap-6', 'xl:gap-8');
  }

  return classes;
}

/**
 * Join layout classes into a single className string
 *
 * @param layout - Optional blueprint layout configuration
 * @param environment - Target environment
 * @returns Space-separated className string
 */
export function getLayoutClassName(
  layout?: BlueprintLayout,
  environment?: Environment
): string {
  return generateLayoutClasses(layout, environment).join(' ');
}
