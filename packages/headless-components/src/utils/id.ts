import { useId } from 'react';

/**
 * Generate a unique ID for component accessibility
 * Uses React's built-in useId hook for stable IDs
 */
export function useUniqueId(id?: string, prefix?: string): string {
  const generatedId = useId();

  // If ID is provided, use it
  if (id) {
    return id;
  }

  // If prefix is provided, prepend it to generated ID
  if (prefix) {
    return `${prefix}-${generatedId}`;
  }

  return generatedId;
}
