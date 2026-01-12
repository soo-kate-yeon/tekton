import { z } from 'zod';

/**
 * Context Rule Definitions
 *
 * This module defines schemas for validating component usage context.
 * These rules ensure components are used in appropriate parent/container contexts.
 *
 * @module contracts/rules/context
 */

// ============================================================================
// Context Rule Schema
// ============================================================================

/**
 * Context rule for component validation
 *
 * Defines the allowed, forbidden, or required parent contexts in which
 * a component can be used.
 *
 * @example
 * ```typescript
 * const rule: ContextRule = {
 *   type: 'context',
 *   required: ['SelectRoot'],
 *   allowed: ['Dialog', 'Popover'],
 *   forbidden: ['Table', 'List']
 * };
 * ```
 */
export const contextRuleSchema = z.object({
  /** Rule type identifier */
  type: z.literal('context'),

  /** Parent contexts where this component is allowed */
  allowed: z.array(z.string()).optional(),

  /** Parent contexts where this component is forbidden */
  forbidden: z.array(z.string()).optional(),

  /** Parent contexts that must be present (component must be nested within these) */
  required: z.array(z.string()).optional(),
});

export type ContextRule = z.infer<typeof contextRuleSchema>;
