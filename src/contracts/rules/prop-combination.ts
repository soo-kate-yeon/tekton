import { z } from 'zod';

/**
 * Prop Combination Rule Definitions
 *
 * This module defines schemas for prop combination validation rules.
 * These rules ensure props are used correctly together, preventing
 * conflicting or invalid combinations.
 *
 * @module contracts/rules/prop-combination
 */

// ============================================================================
// Prop Combination Schemas
// ============================================================================

/**
 * Forbidden prop combination
 *
 * Defines props that cannot be used together.
 *
 * @example
 * ```typescript
 * {
 *   props: ['disabled', 'loading'],
 *   reason: 'Cannot have both disabled and loading states simultaneously'
 * }
 * ```
 */
export const forbiddenCombinationSchema = z.object({
  /** Array of prop names that cannot be used together */
  props: z.array(z.string()).min(2),

  /** Explanation of why this combination is forbidden */
  reason: z.string(),
});

export type ForbiddenCombination = z.infer<typeof forbiddenCombinationSchema>;

/**
 * Required prop combination
 *
 * Defines props that must be used together.
 *
 * @example
 * ```typescript
 * {
 *   props: ['id', 'aria-labelledby'],
 *   reason: 'Input requires both id and aria-labelledby for label association'
 * }
 * ```
 */
export const requiredCombinationSchema = z.object({
  /** Array of prop names that must all be present together */
  props: z.array(z.string()).min(2),

  /** Explanation of why this combination is required */
  reason: z.string(),
});

export type RequiredCombination = z.infer<typeof requiredCombinationSchema>;

/**
 * Mutually exclusive props
 *
 * Defines props where only one can be used at a time.
 *
 * @example
 * ```typescript
 * {
 *   props: ['href', 'onClick'],
 *   reason: 'Use Link component for href, Button for onClick'
 * }
 * ```
 */
export const mutuallyExclusiveSchema = z.object({
  /** Array of prop names where only one should be present */
  props: z.array(z.string()).min(2),

  /** Explanation of the mutual exclusivity */
  reason: z.string(),
});

export type MutuallyExclusive = z.infer<typeof mutuallyExclusiveSchema>;

/**
 * Conditional prop requirement
 *
 * Defines props that are required when a condition prop is present.
 *
 * @example
 * ```typescript
 * {
 *   if: 'asChild',
 *   then: ['children'],
 *   else: ['label'],
 *   reason: 'asChild requires children, otherwise label is required'
 * }
 * ```
 */
export const conditionalRequirementSchema = z.object({
  /** Prop name that triggers the condition */
  if: z.string(),

  /** Props required when condition is true */
  then: z.array(z.string()),

  /** Props required when condition is false (optional) */
  else: z.array(z.string()).optional(),

  /** Explanation of the conditional requirement */
  reason: z.string(),
});

export type ConditionalRequirement = z.infer<typeof conditionalRequirementSchema>;

// ============================================================================
// Prop Combination Rule Schema
// ============================================================================

/**
 * Prop combination rule for component validation
 *
 * Defines various types of prop combination constraints including
 * forbidden combinations, required combinations, mutual exclusivity,
 * and conditional requirements.
 *
 * @example
 * ```typescript
 * const rule: PropCombinationRule = {
 *   type: 'prop-combination',
 *   forbidden: [
 *     {
 *       props: ['disabled', 'loading'],
 *       reason: 'Cannot be disabled and loading simultaneously'
 *     }
 *   ],
 *   mutuallyExclusive: [
 *     {
 *       props: ['variant', 'customStyle'],
 *       reason: 'Use either variant prop or customStyle, not both'
 *     }
 *   ]
 * };
 * ```
 */
export const propCombinationRuleSchema = z.object({
  /** Rule type identifier */
  type: z.literal('prop-combination'),

  /** Prop combinations that are forbidden */
  forbidden: z.array(forbiddenCombinationSchema).optional(),

  /** Prop combinations that are required */
  required: z.array(requiredCombinationSchema).optional(),

  /** Props that are mutually exclusive */
  mutuallyExclusive: z.array(mutuallyExclusiveSchema).optional(),

  /** Conditional prop requirements */
  conditional: z.array(conditionalRequirementSchema).optional(),
});

export type PropCombinationRule = z.infer<typeof propCombinationRuleSchema>;
