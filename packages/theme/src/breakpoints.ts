/**
 * Tailwind CSS Breakpoint Constants
 * SPEC-LAYOUT-001 - TASK-001
 *
 * Provides standard Tailwind CSS breakpoint definitions and helper functions
 * for responsive design integration.
 *
 * @see https://tailwindcss.com/docs/responsive-design
 */

/**
 * Tailwind CSS default breakpoints
 *
 * These values match the default Tailwind CSS v3.4+ breakpoint configuration.
 * All values are in pixels and represent the minimum width for each breakpoint.
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Type representing valid breakpoint keys
 */
export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Generate a min-width media query string for a breakpoint
 *
 * @param breakpoint - The breakpoint key
 * @returns CSS media query string for min-width
 *
 * @example
 * minWidth('lg') // "(min-width: 1024px)"
 */
export function minWidth(breakpoint: Breakpoint): string {
  return `(min-width: ${BREAKPOINTS[breakpoint]}px)`;
}

/**
 * Generate a max-width media query string for a breakpoint
 *
 * The max-width is calculated as one pixel less than the breakpoint value,
 * following Tailwind CSS conventions for responsive design.
 *
 * @param breakpoint - The breakpoint key
 * @returns CSS media query string for max-width
 *
 * @example
 * maxWidth('md') // "(max-width: 767px)"
 */
export function maxWidth(breakpoint: Breakpoint): string {
  return `(max-width: ${BREAKPOINTS[breakpoint] - 1}px)`;
}

/**
 * Get the pixel value for a breakpoint
 *
 * @param breakpoint - The breakpoint key
 * @returns The pixel value for the breakpoint
 *
 * @example
 * getBreakpointValue('lg') // 1024
 */
export function getBreakpointValue(breakpoint: Breakpoint): number {
  return BREAKPOINTS[breakpoint];
}
