import { z } from 'zod';

/**
 * Core Contract Type Definitions
 *
 * This module defines the foundational types and Zod schemas for the component
 * contract validation system. All contract definitions must conform to these schemas.
 *
 * @module contracts/types
 * @see {@link ComponentContract} - Main contract interface
 * @see {@link Constraint} - Individual constraint definition
 */

// ============================================================================
// Severity and Category Enums
// ============================================================================

/**
 * Severity levels for constraint violations
 *
 * - `error`: Critical violation that must be fixed (blocks merge/deploy)
 * - `warning`: Important issue that should be addressed (allows merge with review)
 * - `info`: Informational suggestion for improvement (does not block)
 */
export const severitySchema = z.enum(['error', 'warning', 'info']);
export type Severity = z.infer<typeof severitySchema>;

/**
 * Component categories for organizational purposes
 *
 * Categories help group related components and apply category-specific rules:
 * - `form`: Input elements, buttons, selects, checkboxes
 * - `layout`: Cards, containers, grids
 * - `navigation`: Menus, tabs, breadcrumbs
 * - `feedback`: Alerts, toasts, notifications
 * - `display`: Tables, lists, badges
 * - `overlay`: Dialogs, modals, popovers
 */
export const categorySchema = z.enum([
  'form',
  'layout',
  'navigation',
  'feedback',
  'display',
  'overlay',
]);
export type Category = z.infer<typeof categorySchema>;

// ============================================================================
// Rule Definitions
// ============================================================================

/**
 * Rule definition for constraint validation
 *
 * Rules are flexible objects that contain validation logic specifications.
 * The structure depends on the rule type (accessibility, prop-combination, etc.).
 *
 * @example
 * ```typescript
 * const accessibilityRule = {
 *   type: 'accessibility',
 *   requiredProps: ['aria-label'],
 *   wcagLevel: 'AA'
 * };
 * ```
 */
export const ruleSchema = z.record(z.unknown());
export type Rule = z.infer<typeof ruleSchema>;

// ============================================================================
// Constraint Schema
// ============================================================================

/**
 * Constraint definition for component validation
 *
 * Constraints define specific rules that components must follow. Each constraint
 * includes validation logic, severity level, and optional auto-fix capabilities.
 *
 * @example
 * ```typescript
 * const constraint: Constraint = {
 *   id: 'BTN-A01',
 *   severity: 'error',
 *   description: 'Icon-only buttons must have aria-label',
 *   rule: {
 *     type: 'accessibility',
 *     requiredProps: ['aria-label']
 *   },
 *   message: 'Icon-only buttons require aria-label for screen readers',
 *   autoFixable: true,
 *   fixSuggestion: 'Add aria-label="descriptive text" to the button'
 * };
 * ```
 */
export const constraintSchema = z.object({
  /** Unique identifier for the constraint (e.g., "BTN-A01") */
  id: z.string().min(1),

  /** Rule definition for validation logic */
  rule: ruleSchema,

  /** Rationale explaining why this constraint exists */
  rationale: z.string().optional(),

  /** Severity level of the violation */
  severity: severitySchema,

  /** Human-readable description of the constraint */
  description: z.string().min(1).optional(),

  /** Error/warning message to display when constraint is violated */
  message: z.string().min(1).optional(),

  /** Whether this constraint can be automatically fixed */
  autoFixable: z.boolean().optional(),

  /** Optional suggestion for fixing the violation */
  fixSuggestion: z.string().optional(),
});

export type Constraint = z.infer<typeof constraintSchema>;

// ============================================================================
// Component Contract Schema
// ============================================================================

/**
 * Component contract definition
 *
 * A contract defines all validation rules and best practices for a specific
 * shadcn/ui component. Contracts ensure consistent usage patterns and
 * accessibility compliance across the application.
 *
 * @example
 * ```typescript
 * const buttonContract: ComponentContract = {
 *   component: 'Button',
 *   version: '1.0.0',
 *   category: 'form',
 *   constraints: [
 *     {
 *       id: 'BTN-A01',
 *       severity: 'error',
 *       description: 'Icon-only buttons must have aria-label',
 *       rule: { type: 'accessibility', requiredProps: ['aria-label'] },
 *       message: 'Icon-only buttons require aria-label',
 *       autoFixable: true,
 *       fixSuggestion: 'Add aria-label attribute'
 *     }
 *   ],
 *   bestPractices: [
 *     'Use semantic HTML button element',
 *     'Provide clear button text or aria-label'
 *   ]
 * };
 * ```
 */
export const componentContractSchema = z.object({
  /** Component ID (e.g., "button", "input") */
  id: z.string().min(1),

  /** Contract version (semantic versioning) */
  version: z.string().regex(/^\d+\.\d+\.\d+$/),

  /** Human-readable description of the component contract */
  description: z.string().optional(),

  /** Component category */
  category: categorySchema.optional(),

  /** Array of constraints for this component */
  constraints: z.array(constraintSchema),

  /** Optional array of best practice recommendations */
  bestPractices: z.array(z.string()).optional(),
});

export type ComponentContract = z.infer<typeof componentContractSchema>;
