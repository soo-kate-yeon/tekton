/**
 * @tekton/core - Responsive Token Definitions
 * Concrete Responsive Token implementations for viewport breakpoints
 * [SPEC-LAYOUT-001] [PHASE-6]
 */

import type { ResponsiveToken } from './types.js';

// ============================================================================
// Responsive Token Definitions (Tailwind CSS Standard)
// ============================================================================

/**
 * Small devices breakpoint (mobile landscape, 640px and up)
 * Suitable for mobile landscape orientation and small tablets
 */
export const BREAKPOINT_SM: ResponsiveToken = {
  id: 'breakpoint.sm',
  minWidth: 640,
  description: 'Small devices (mobile landscape, 640px and up)',
};

/**
 * Medium devices breakpoint (tablets, 768px and up)
 * Suitable for tablet portrait orientation
 */
export const BREAKPOINT_MD: ResponsiveToken = {
  id: 'breakpoint.md',
  minWidth: 768,
  description: 'Medium devices (tablets, 768px and up)',
};

/**
 * Large devices breakpoint (desktops, 1024px and up)
 * Suitable for desktop and laptop screens
 */
export const BREAKPOINT_LG: ResponsiveToken = {
  id: 'breakpoint.lg',
  minWidth: 1024,
  description: 'Large devices (desktops, 1024px and up)',
};

/**
 * Extra large devices breakpoint (large desktops, 1280px and up)
 * Suitable for large desktop monitors
 */
export const BREAKPOINT_XL: ResponsiveToken = {
  id: 'breakpoint.xl',
  minWidth: 1280,
  description: 'Extra large devices (large desktops, 1280px and up)',
};

/**
 * Extra extra large devices breakpoint (wide screens, 1536px and up)
 * Suitable for wide screen monitors and ultra-wide displays
 */
export const BREAKPOINT_2XL: ResponsiveToken = {
  id: 'breakpoint.2xl',
  minWidth: 1536,
  description: 'Extra extra large devices (wide screens, 1536px and up)',
};

// ============================================================================
// Breakpoint Values Map
// ============================================================================

/**
 * Map of breakpoint names to pixel values
 * Provides convenient access to breakpoint values by name
 *
 * @example
 * ```typescript
 * const mdWidth = BREAKPOINT_VALUES.md; // 768
 * ```
 */
export const BREAKPOINT_VALUES: Record<string, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// ============================================================================
// Internal Token Map
// ============================================================================

/**
 * Internal map for quick responsive token lookups by ID
 * Used by getResponsiveToken() for O(1) access
 */
const RESPONSIVE_TOKENS_MAP: Record<string, ResponsiveToken> = {
  'breakpoint.sm': BREAKPOINT_SM,
  'breakpoint.md': BREAKPOINT_MD,
  'breakpoint.lg': BREAKPOINT_LG,
  'breakpoint.xl': BREAKPOINT_XL,
  'breakpoint.2xl': BREAKPOINT_2XL,
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get a responsive token by its ID
 *
 * @param breakpointId - Breakpoint ID (e.g., "breakpoint.md")
 * @returns ResponsiveToken if found, undefined otherwise
 *
 * @example
 * ```typescript
 * const mdBreakpoint = getResponsiveToken('breakpoint.md');
 * if (mdBreakpoint) {
 *   console.log(`Min width: ${mdBreakpoint.minWidth}px`);
 * }
 * ```
 */
export function getResponsiveToken(breakpointId: string): ResponsiveToken | undefined {
  return RESPONSIVE_TOKENS_MAP[breakpointId];
}

/**
 * Get all available responsive tokens
 *
 * @returns Array of all ResponsiveTokens
 *
 * @example
 * ```typescript
 * const allBreakpoints = getAllResponsiveTokens();
 * console.log(`Available breakpoints: ${allBreakpoints.length}`);
 * ```
 */
export function getAllResponsiveTokens(): ResponsiveToken[] {
  return Object.values(RESPONSIVE_TOKENS_MAP);
}

/**
 * Get breakpoint value by breakpoint name
 *
 * @param breakpoint - Breakpoint name ('sm', 'md', 'lg', 'xl', '2xl')
 * @returns Pixel value for the breakpoint
 *
 * @example
 * ```typescript
 * const mdWidth = getBreakpointValue('md'); // 768
 * const lgWidth = getBreakpointValue('lg'); // 1024
 * ```
 */
export function getBreakpointValue(breakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl'): number {
  return BREAKPOINT_VALUES[breakpoint];
}

/**
 * Generate CSS media query string for a breakpoint
 *
 * @param breakpoint - Breakpoint name ('sm', 'md', 'lg', 'xl', '2xl')
 * @returns CSS media query string
 *
 * @example
 * ```typescript
 * const query = getBreakpointMediaQuery('md');
 * // Returns: "@media (min-width: 768px)"
 * ```
 */
export function getBreakpointMediaQuery(breakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl'): string {
  return `@media (min-width: ${BREAKPOINT_VALUES[breakpoint]}px)`;
}

/**
 * Sort breakpoints by size (ascending order)
 *
 * @param breakpoints - Array of ResponsiveTokens to sort
 * @returns Sorted array (smallest to largest)
 *
 * @example
 * ```typescript
 * const unsorted = [BREAKPOINT_XL, BREAKPOINT_SM, BREAKPOINT_MD];
 * const sorted = sortBreakpointsBySize(unsorted);
 * // Returns: [BREAKPOINT_SM, BREAKPOINT_MD, BREAKPOINT_XL]
 * ```
 */
export function sortBreakpointsBySize(breakpoints: ResponsiveToken[]): ResponsiveToken[] {
  return [...breakpoints].sort((a, b) => a.minWidth - b.minWidth);
}
