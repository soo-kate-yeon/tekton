/**
 * @tekton/core - Token Resolution Engine
 * Resolves token references to final values with fallback chain support
 * [SPEC-COMPONENT-001-A] [TOKEN-RESOLUTION]
 */

import type { ThemeWithTokens } from './tokens.js';

// ============================================================================
// Type Definitions
// ============================================================================

/** Token reference in dot notation: "atomic.color.blue.500" */
export type TokenReference = string;

// ============================================================================
// Token Resolution Functions
// ============================================================================

/**
 * Resolves a token reference to its final value
 *
 * Supports:
 * - Dot-notation references: "atomic.color.blue.500"
 * - Multi-level references: "component.button.primary.background" → "semantic.foreground.accent" → "atomic.color.blue.500"
 * - Direct values: "#3b82f6" (returned as-is)
 * - Circular reference detection
 *
 * @param ref - Token reference or direct value
 * @param tokens - Theme token structure
 * @param visited - Internal tracking for circular reference detection
 * @returns Resolved token value
 * @throws Error if token not found or circular reference detected
 *
 * @example
 * ```typescript
 * resolveToken('atomic.color.blue.500', tokens) // → '#3b82f6'
 * resolveToken('semantic.background.page', tokens) // → '#f9fafb' (via atomic.color.neutral.50)
 * resolveToken('#3b82f6', tokens) // → '#3b82f6' (direct value)
 * ```
 */
export function resolveToken(
  ref: TokenReference,
  tokens: ThemeWithTokens['tokens'],
  visited: Set<string> = new Set()
): string {
  // Prevent circular references
  if (visited.has(ref)) {
    throw new Error(`Circular token reference detected: ${ref}`);
  }
  visited.add(ref);

  // If not a reference (doesn't contain dot or doesn't start with layer name), return as-is
  if (!ref.includes('.')) {
    return ref;
  }

  // Check if it's a token reference (starts with atomic, semantic, or component)
  const startsWithLayer =
    ref.startsWith('atomic.') || ref.startsWith('semantic.') || ref.startsWith('component.');
  if (!startsWithLayer) {
    return ref; // Return direct value like "#3b82f6"
  }

  // Parse reference path
  const parts = ref.split('.');
  const [layer, ...path] = parts;

  // Navigate token tree
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = tokens;
  for (const part of [layer, ...path]) {
    value = value?.[part];
    if (value === undefined) {
      throw new Error(`Token not found: ${ref}`);
    }
  }

  // If value is another reference, resolve recursively
  if (
    typeof value === 'string' &&
    (value.startsWith('atomic.') || value.startsWith('semantic.') || value.startsWith('component.'))
  ) {
    return resolveToken(value, tokens, visited);
  }

  return value;
}

/**
 * Resolves token with fallback chain: Component → Semantic → Atomic
 *
 * Attempts to resolve tokens in order of specificity:
 * 1. Component-level token (most specific)
 * 2. Semantic-level token (medium specificity)
 * 3. Atomic-level token (least specific, guaranteed to exist)
 *
 * This enables graceful degradation when component or semantic tokens are missing.
 *
 * @param componentRef - Component-level token reference
 * @param semanticRef - Semantic-level token reference (fallback)
 * @param atomicRef - Atomic-level token reference (final fallback)
 * @param tokens - Theme token structure
 * @returns Resolved token value from first successful resolution
 * @throws Error if all fallback attempts fail
 *
 * @example
 * ```typescript
 * // Returns component token if exists
 * resolveWithFallback(
 *   'component.button.primary.background',
 *   'semantic.foreground.accent',
 *   'atomic.color.blue.500',
 *   tokens
 * ) // → '#3b82f6'
 *
 * // Falls back to semantic if component missing
 * resolveWithFallback(
 *   'component.button.nonexistent.background',
 *   'semantic.foreground.accent',
 *   'atomic.color.blue.500',
 *   tokens
 * ) // → '#3b82f6' (via semantic)
 * ```
 */
export function resolveWithFallback(
  componentRef: string,
  semanticRef: string,
  atomicRef: string,
  tokens: ThemeWithTokens['tokens']
): string {
  // Try component token first
  try {
    return resolveToken(componentRef, tokens);
  } catch {
    // Fallback to semantic token
    try {
      return resolveToken(semanticRef, tokens);
    } catch {
      // Final fallback to atomic token
      try {
        return resolveToken(atomicRef, tokens);
      } catch {
        throw new Error(
          `Failed to resolve token with fallback: ${componentRef} → ${semanticRef} → ${atomicRef}`
        );
      }
    }
  }
}
