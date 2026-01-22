/**
 * Grid System Defaults
 * SPEC-LAYOUT-001 - TASK-002
 *
 * Provides default grid configurations for each Tailwind CSS breakpoint
 * and environment-based preset mappings.
 */

import { BREAKPOINTS, type Breakpoint } from './breakpoints.js';

/**
 * Grid system configuration interface
 * Compatible with @tekton/contracts GridSystem
 */
export interface GridSystem {
  columns: number;
  gutter: number;
  margin: number;
  breakpoint: {
    min: number;
    max: number;
  };
}

/**
 * Valid grid configuration keys (default + Tailwind breakpoints)
 */
export type GridConfigKey = 'default' | Breakpoint;

/**
 * Default grid configuration per breakpoint
 *
 * These values provide sensible defaults for responsive grid layouts:
 * - Mobile (default/sm): 4 columns for simple layouts
 * - Tablet (md): 8 columns for intermediate layouts
 * - Desktop (lg/xl/2xl): 12 columns for complex layouts
 *
 * Gutter and margin values increase with screen size for better readability.
 */
export const GRID_DEFAULTS: Record<GridConfigKey, GridSystem> = {
  default: {
    columns: 4,
    gutter: 16,
    margin: 16,
    breakpoint: { min: 0, max: BREAKPOINTS.sm - 1 },
  },
  sm: {
    columns: 4,
    gutter: 16,
    margin: 24,
    breakpoint: { min: BREAKPOINTS.sm, max: BREAKPOINTS.md - 1 },
  },
  md: {
    columns: 8,
    gutter: 24,
    margin: 32,
    breakpoint: { min: BREAKPOINTS.md, max: BREAKPOINTS.lg - 1 },
  },
  lg: {
    columns: 12,
    gutter: 24,
    margin: 48,
    breakpoint: { min: BREAKPOINTS.lg, max: BREAKPOINTS.xl - 1 },
  },
  xl: {
    columns: 12,
    gutter: 32,
    margin: 64,
    breakpoint: { min: BREAKPOINTS.xl, max: BREAKPOINTS['2xl'] - 1 },
  },
  '2xl': {
    columns: 12,
    gutter: 32,
    margin: 80,
    breakpoint: { min: BREAKPOINTS['2xl'], max: Infinity },
  },
};

/**
 * Environment type for grid preset selection
 */
export type EnvironmentType =
  | 'mobile'
  | 'tablet'
  | 'web'
  | 'responsive'
  | 'tv'
  | 'kiosk';

/**
 * Environment to grid preset mapping
 *
 * Maps each environment type to the appropriate breakpoints:
 * - mobile: Small screens only (default, sm)
 * - tablet: Small to medium screens (default, sm, md)
 * - web/responsive: All breakpoints for full responsiveness
 * - tv: Large screens only (lg, xl, 2xl)
 * - kiosk: Large screens without extreme sizes (lg, xl)
 */
export const ENVIRONMENT_GRID_PRESETS: Record<
  EnvironmentType,
  readonly GridConfigKey[]
> = {
  mobile: ['default', 'sm'] as const,
  tablet: ['default', 'sm', 'md'] as const,
  web: ['default', 'sm', 'md', 'lg', 'xl', '2xl'] as const,
  responsive: ['default', 'sm', 'md', 'lg', 'xl', '2xl'] as const,
  tv: ['lg', 'xl', '2xl'] as const,
  kiosk: ['lg', 'xl'] as const,
};

/**
 * Get the grid configuration for a specific breakpoint key
 *
 * @param key - The grid configuration key (default or breakpoint)
 * @returns The grid system configuration
 *
 * @example
 * getGridConfig('lg') // { columns: 12, gutter: 24, margin: 48, breakpoint: {...} }
 */
export function getGridConfig(key: GridConfigKey): GridSystem {
  return GRID_DEFAULTS[key];
}
