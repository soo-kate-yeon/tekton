import { z } from 'zod';

/**
 * Children Rule Definitions
 *
 * This module defines schemas for validating child component structure.
 * These rules ensure components have the correct children in the correct order.
 *
 * @module contracts/rules/children
 */

// ============================================================================
// Children Rule Schema
// ============================================================================

/**
 * Children rule for component validation
 *
 * Defines requirements for child components including which children are
 * required, allowed, or forbidden, and their ordering.
 *
 * @example
 * ```typescript
 * const rule: ChildrenRule = {
 *   type: 'children',
 *   required: ['DialogTitle', 'DialogContent'],
 *   allowed: ['DialogTitle', 'DialogDescription', 'DialogContent', 'DialogFooter'],
 *   order: ['DialogTitle', 'DialogDescription', 'DialogContent', 'DialogFooter'],
 *   strict: false,
 *   minCount: 2,
 *   maxCount: 4
 * };
 * ```
 */
export const childrenRuleSchema = z.object({
  /** Rule type identifier */
  type: z.literal('children'),

  /** Child components that must be present */
  required: z.array(z.string()).optional(),

  /** Child components that are allowed (whitelist) */
  allowed: z.array(z.string()).optional(),

  /** Child components that are forbidden (blacklist) */
  forbidden: z.array(z.string()).optional(),

  /** Minimum number of children required */
  minCount: z.number().int().nonnegative().optional(),

  /** Maximum number of children allowed */
  maxCount: z.number().int().positive().optional(),

  /** Exact number of children required */
  exactCount: z.number().int().positive().optional(),

  /** Expected order of child components */
  order: z.array(z.string()).optional(),

  /** Whether order must be strictly followed (no other children between) */
  strict: z.boolean().optional(),
});

export type ChildrenRule = z.infer<typeof childrenRuleSchema>;
