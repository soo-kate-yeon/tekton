/**
 * Class Merge Utility
 * SPEC-LAYOUT-001 - TASK-010
 *
 * Provides utilities for merging Tailwind CSS classes with conflict resolution
 * using tailwind-merge library.
 */

import { twMerge } from 'tailwind-merge';

/**
 * Type for class value input - can be string, undefined, null, or array
 */
type ClassValue = string | undefined | null | ClassValue[];

/**
 * Flatten nested class values into a single array of strings
 */
function flattenClasses(classes: ClassValue[]): string[] {
  const result: string[] = [];

  for (const cls of classes) {
    if (cls === undefined || cls === null || cls === '') {
      continue;
    }
    if (Array.isArray(cls)) {
      result.push(...flattenClasses(cls));
    } else {
      result.push(cls);
    }
  }

  return result;
}

/**
 * Merge multiple class strings with Tailwind conflict resolution
 *
 * Uses tailwind-merge to intelligently resolve conflicting Tailwind classes.
 * Later classes override earlier ones when conflicts occur.
 *
 * @param classes - Variable number of class strings, arrays, or undefined values
 * @returns Merged class string with conflicts resolved
 *
 * @example
 * mergeClasses('px-4', 'px-6')
 * // Returns 'px-6' (later wins)
 *
 * @example
 * mergeClasses('container mx-auto', 'px-4', undefined, 'py-2')
 * // Returns 'container mx-auto px-4 py-2'
 *
 * @example
 * mergeClasses('md:px-4', 'md:px-8')
 * // Returns 'md:px-8' (same breakpoint conflict resolved)
 */
export function mergeClasses(...classes: ClassValue[]): string {
  const flattened = flattenClasses(classes);
  const joined = flattened.join(' ');
  return twMerge(joined);
}

/**
 * Merge layout classes with component classes
 *
 * Specifically designed for merging generated layout classes with
 * component-specific classes. Component classes take precedence
 * over layout classes when conflicts occur.
 *
 * @param layoutClasses - Classes generated from layout configuration
 * @param componentClasses - Classes from component props
 * @returns Merged class string with component classes taking precedence
 *
 * @example
 * mergeLayoutClasses('container mx-auto grid grid-cols-4', 'bg-white rounded-lg')
 * // Returns 'container mx-auto grid grid-cols-4 bg-white rounded-lg'
 *
 * @example
 * mergeLayoutClasses('px-4 py-2', 'px-8')
 * // Returns 'py-2 px-8' (component px-8 overrides layout px-4)
 */
export function mergeLayoutClasses(
  layoutClasses: string,
  componentClasses: string
): string {
  // Handle empty strings
  if (!layoutClasses && !componentClasses) {
    return '';
  }
  if (!layoutClasses) {
    return componentClasses;
  }
  if (!componentClasses) {
    return layoutClasses;
  }

  // Use twMerge to resolve conflicts (later wins)
  return twMerge(layoutClasses, componentClasses);
}
