import { z } from 'zod';

/**
 * Composition Rule Definitions
 *
 * This module defines schemas for validating component composition patterns.
 * These rules ensure components are properly composed with related components.
 *
 * @module contracts/rules/composition
 */

// ============================================================================
// Component Relationship Schema
// ============================================================================

/**
 * Defines relationships between components in a composition
 *
 * @example
 * ```typescript
 * {
 *   source: 'Label',
 *   target: 'Input',
 *   type: 'associates',
 *   via: 'htmlFor'
 * }
 * ```
 */
export const componentRelationshipSchema = z.object({
  /** Source component in the relationship */
  source: z.string(),

  /** Target component in the relationship */
  target: z.string(),

  /** Type of relationship (contains, wraps, associates, etc.) */
  type: z.enum(['contains', 'wraps', 'associates', 'references']),

  /** How the relationship is established (optional, e.g., 'htmlFor', 'aria-labelledby') */
  via: z.string().optional(),
});

export type ComponentRelationship = z.infer<typeof componentRelationshipSchema>;

// ============================================================================
// Composition Rule Schema
// ============================================================================

/**
 * Composition rule for component validation
 *
 * Defines how components should be composed together, including required
 * and optional components, and their relationships.
 *
 * @example
 * ```typescript
 * const rule: CompositionRule = {
 *   type: 'composition',
 *   requiredComponents: ['FormLabel', 'FormControl'],
 *   optionalComponents: ['FormDescription', 'FormMessage'],
 *   relationships: [
 *     {
 *       source: 'FormLabel',
 *       target: 'FormControl',
 *       type: 'associates',
 *       via: 'htmlFor'
 *     }
 *   ]
 * };
 * ```
 */
export const compositionRuleSchema = z.object({
  /** Rule type identifier */
  type: z.literal('composition'),

  /** Components that must be present in the composition */
  requiredComponents: z.array(z.string()).optional(),

  /** Components that may be present in the composition */
  optionalComponents: z.array(z.string()).optional(),

  /** Relationships between components in the composition */
  relationships: z.array(componentRelationshipSchema).optional(),
});

export type CompositionRule = z.infer<typeof compositionRuleSchema>;
