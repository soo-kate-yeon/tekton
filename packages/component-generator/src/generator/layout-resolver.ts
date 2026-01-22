/**
 * Layout Resolver
 * SPEC-LAYOUT-001 - TASK-007
 *
 * Resolves layout configuration by merging blueprint layout with environment defaults.
 */

import {
  GRID_DEFAULTS,
  ENVIRONMENT_GRID_PRESETS,
  type GridConfigKey,
  type EnvironmentType,
} from '@tekton/theme';
import type { BlueprintLayout } from '../types/layout-schema.js';
import type { Environment } from '../types/knowledge-schema.js';

/**
 * Resolved layout configuration with all values populated
 */
export interface ResolvedLayout {
  /** Container behavior */
  container: 'fluid' | 'fixed' | 'none';
  /** Maximum width preset */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'prose';
  /** Horizontal padding */
  padding: number;
  /** Grid columns per breakpoint */
  grid: Record<GridConfigKey, number>;
  /** Gap configuration */
  gap: number | { x?: number; y?: number };
  /** Active breakpoints for this environment */
  activeBreakpoints: readonly GridConfigKey[];
  /** Resolved environment */
  environment: EnvironmentType;
}

/**
 * Default layout values when none specified
 */
const DEFAULT_LAYOUT: Omit<ResolvedLayout, 'grid' | 'activeBreakpoints' | 'environment'> = {
  container: 'fluid',
  padding: 4,
  gap: 4,
};

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
 * Build grid configuration from environment defaults
 */
function buildGridFromEnvironment(_envType: EnvironmentType): Record<GridConfigKey, number> {
  const grid: Record<GridConfigKey, number> = {
    default: GRID_DEFAULTS.default.columns,
    sm: GRID_DEFAULTS.sm.columns,
    md: GRID_DEFAULTS.md.columns,
    lg: GRID_DEFAULTS.lg.columns,
    xl: GRID_DEFAULTS.xl.columns,
    '2xl': GRID_DEFAULTS['2xl'].columns,
  };

  return grid;
}

/**
 * Resolve layout configuration
 *
 * Merges explicit blueprint layout with environment-appropriate defaults.
 * When no layout is provided, returns environment-specific defaults.
 *
 * @param layout - Optional blueprint layout configuration
 * @param environment - Target environment (defaults to 'responsive')
 * @returns Fully resolved layout configuration
 *
 * @example
 * // With explicit layout
 * const resolved = resolveLayout({ maxWidth: 'xl' }, 'web');
 *
 * // With environment defaults only
 * const defaults = resolveLayout(undefined, 'mobile');
 */
export function resolveLayout(
  layout: BlueprintLayout | undefined,
  environment: Environment | undefined
): ResolvedLayout {
  const envType = mapEnvironment(environment);
  const activeBreakpoints = ENVIRONMENT_GRID_PRESETS[envType];

  // Build base grid from environment defaults
  const baseGrid = buildGridFromEnvironment(envType);

  // Merge with explicit grid overrides
  const resolvedGrid: Record<GridConfigKey, number> = { ...baseGrid };
  if (layout?.grid) {
    for (const [key, value] of Object.entries(layout.grid)) {
      if (value !== undefined) {
        resolvedGrid[key as GridConfigKey] = value;
      }
    }
  }

  return {
    container: layout?.container ?? DEFAULT_LAYOUT.container,
    maxWidth: layout?.maxWidth,
    padding: layout?.padding ?? DEFAULT_LAYOUT.padding,
    grid: resolvedGrid,
    gap: layout?.gap ?? DEFAULT_LAYOUT.gap,
    activeBreakpoints,
    environment: envType,
  };
}
