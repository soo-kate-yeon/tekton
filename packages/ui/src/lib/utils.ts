/**
 * @tekton/ui - Utility Functions
 * [SPEC-COMPONENT-001-C]
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper precedence
 *
 * Combines clsx for conditional classes and tailwind-merge for deduplication.
 * This ensures that conflicting Tailwind classes are properly resolved.
 *
 * @param inputs - Class values to merge (strings, objects, arrays)
 * @returns Merged class string with proper Tailwind precedence
 *
 * @example
 * ```tsx
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4'
 * cn('text-red-500', condition && 'text-blue-500') // => 'text-blue-500' if condition is true
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
