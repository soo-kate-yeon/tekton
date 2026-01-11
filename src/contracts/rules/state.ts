import { z } from 'zod';

/**
 * State Rule Definitions
 *
 * This module defines schemas for validating component state management.
 * These rules ensure components handle state transitions correctly.
 *
 * @module contracts/rules/state
 */

// ============================================================================
// State Transition Schema
// ============================================================================

/**
 * Defines a valid state transition
 *
 * @example
 * ```typescript
 * {
 *   from: 'idle',
 *   to: 'loading',
 *   trigger: 'submit'
 * }
 * ```
 */
export const stateTransitionSchema = z.object({
  /** Source state */
  from: z.string(),

  /** Target state */
  to: z.string(),

  /** Event or action that triggers the transition */
  trigger: z.string(),
});

export type StateTransition = z.infer<typeof stateTransitionSchema>;

// ============================================================================
// State Rule Schema
// ============================================================================

/**
 * State rule for component validation
 *
 * Defines valid states, initial state, allowed transitions, and
 * mutually exclusive state combinations.
 *
 * @example
 * ```typescript
 * const rule: StateRule = {
 *   type: 'state',
 *   validStates: ['idle', 'loading', 'success', 'error'],
 *   initialState: 'idle',
 *   transitions: [
 *     { from: 'idle', to: 'loading', trigger: 'submit' },
 *     { from: 'loading', to: 'success', trigger: 'resolve' },
 *     { from: 'loading', to: 'error', trigger: 'reject' }
 *   ],
 *   mutuallyExclusive: [['loading', 'success'], ['loading', 'error']]
 * };
 * ```
 */
export const stateRuleSchema = z.object({
  /** Rule type identifier */
  type: z.literal('state'),

  /** All valid states for this component */
  validStates: z.array(z.string()).min(1),

  /** Initial state (must be one of validStates) */
  initialState: z.string().optional(),

  /** Valid state transitions */
  transitions: z.array(stateTransitionSchema).optional(),

  /** Groups of states that cannot be active simultaneously */
  mutuallyExclusive: z.array(z.array(z.string())).optional(),
});

export type StateRule = z.infer<typeof stateRuleSchema>;
