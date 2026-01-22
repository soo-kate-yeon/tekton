/**
 * Responsive Class Generator
 * SPEC-LAYOUT-001 - TASK-011
 *
 * Utilities for generating responsive Tailwind CSS classes
 * with breakpoint prefixes.
 */

/**
 * Breakpoint keys in mobile-first order
 */
const BREAKPOINT_ORDER = ['default', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

/**
 * Type for breakpoint keys
 */
type BreakpointKey = (typeof BREAKPOINT_ORDER)[number];

/**
 * Type for responsive values - maps breakpoints to values
 */
type ResponsiveValues<T> = Partial<Record<BreakpointKey, T>>;

/**
 * Generate responsive Tailwind classes for a given property
 *
 * Creates an array of Tailwind utility classes with appropriate breakpoint
 * prefixes. The 'default' breakpoint generates an unprefixed class.
 *
 * @param property - The Tailwind property prefix (e.g., 'p', 'gap', 'grid-cols')
 * @param values - Object mapping breakpoints to values
 * @returns Array of Tailwind classes with breakpoint prefixes
 *
 * @example
 * generateResponsiveClasses('p', { default: 4, md: 6, lg: 8 })
 * // Returns ['p-4', 'md:p-6', 'lg:p-8']
 *
 * @example
 * generateResponsiveClasses('w', { default: 'auto', md: 'full' })
 * // Returns ['w-auto', 'md:w-full']
 */
export function generateResponsiveClasses<T extends string | number>(
  property: string,
  values: ResponsiveValues<T>
): string[] {
  const classes: string[] = [];

  for (const breakpoint of BREAKPOINT_ORDER) {
    const value = values[breakpoint];
    if (value === undefined) {
      continue;
    }

    if (breakpoint === 'default') {
      classes.push(`${property}-${value}`);
    } else {
      classes.push(`${breakpoint}:${property}-${value}`);
    }
  }

  return classes;
}

/**
 * Generate responsive grid column classes
 *
 * Creates grid-cols-{n} classes for each specified breakpoint.
 *
 * @param config - Object mapping breakpoints to column counts
 * @returns Array of grid-cols classes with breakpoint prefixes
 *
 * @example
 * generateResponsiveGridClasses({ default: 1, md: 2, lg: 4 })
 * // Returns ['grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4']
 */
export function generateResponsiveGridClasses(
  config: ResponsiveValues<number>
): string[] {
  return generateResponsiveClasses('grid-cols', config);
}

/**
 * Generate responsive horizontal padding classes
 *
 * Creates px-{n} classes for each specified breakpoint.
 *
 * @param config - Object mapping breakpoints to padding values
 * @returns Array of px classes with breakpoint prefixes
 *
 * @example
 * generateResponsivePaddingClasses({ default: 4, md: 6, lg: 12 })
 * // Returns ['px-4', 'md:px-6', 'lg:px-12']
 */
export function generateResponsivePaddingClasses(
  config: ResponsiveValues<number>
): string[] {
  return generateResponsiveClasses('px', config);
}

/**
 * Generate responsive gap classes
 *
 * Creates gap-{n}, gap-x-{n}, or gap-y-{n} classes for each specified breakpoint.
 *
 * @param config - Object mapping breakpoints to gap values
 * @param axis - Optional axis ('x' | 'y') for directional gap
 * @returns Array of gap classes with breakpoint prefixes
 *
 * @example
 * generateResponsiveGapClasses({ default: 4, md: 6 })
 * // Returns ['gap-4', 'md:gap-6']
 *
 * @example
 * generateResponsiveGapClasses({ default: 4, md: 6 }, 'x')
 * // Returns ['gap-x-4', 'md:gap-x-6']
 */
export function generateResponsiveGapClasses(
  config: ResponsiveValues<number>,
  axis?: 'x' | 'y'
): string[] {
  const property = axis ? `gap-${axis}` : 'gap';
  return generateResponsiveClasses(property, config);
}
