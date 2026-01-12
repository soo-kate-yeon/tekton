import { z } from 'zod';

/**
 * Accessibility Rule Definitions
 *
 * This module defines schemas and types for accessibility-related validation rules.
 * These rules ensure components meet WCAG standards and accessibility best practices.
 *
 * @module contracts/rules/accessibility
 * @see {@link https://www.w3.org/WAI/WCAG21/quickref/} - WCAG Quick Reference
 */

// ============================================================================
// WCAG Level Enumeration
// ============================================================================

/**
 * WCAG (Web Content Accessibility Guidelines) conformance levels
 *
 * - `A`: Minimum level of conformance (Level A)
 * - `AA`: Mid-range level (Level AA) - recommended for most websites
 * - `AAA`: Highest level of conformance (Level AAA)
 *
 * @see {@link https://www.w3.org/WAI/WCAG21/Understanding/conformance#levels}
 */
export const wcagLevelSchema = z.enum(['A', 'AA', 'AAA']);
export type WCAGLevel = z.infer<typeof wcagLevelSchema>;

// ============================================================================
// Focus Management Schema
// ============================================================================

/**
 * Focus management configuration for interactive components
 */
export const focusManagementSchema = z.object({
  /** Whether to trap focus within the component (e.g., modals, dialogs) */
  trapFocus: z.boolean().optional(),

  /** Whether to restore focus to the trigger element when component closes */
  restoreFocus: z.boolean().optional(),

  /** Where to place initial focus when component opens */
  initialFocus: z.string().optional(),
});

export type FocusManagement = z.infer<typeof focusManagementSchema>;

// ============================================================================
// Color Contrast Schema
// ============================================================================

/**
 * Color contrast requirements per WCAG guidelines
 */
export const colorContrastSchema = z.object({
  /** Minimum contrast ratio (e.g., 4.5:1 for normal text, 3:1 for large text) */
  minimumRatio: z.number().positive(),

  /** Whether this applies to large text (14pt bold or 18pt regular) */
  largeText: z.boolean().optional(),
});

export type ColorContrast = z.infer<typeof colorContrastSchema>;

// ============================================================================
// Accessibility Rule Schema
// ============================================================================

/**
 * Accessibility rule for component validation
 *
 * Defines accessibility requirements including ARIA attributes, roles,
 * keyboard navigation, and WCAG compliance criteria.
 *
 * @example
 * ```typescript
 * const rule: AccessibilityRule = {
 *   type: 'accessibility',
 *   requiredProps: ['aria-label'],
 *   requiredRole: 'button',
 *   keyboardNavigation: true,
 *   wcagLevel: 'AA',
 *   wcagCriteria: ['4.1.2']
 * };
 * ```
 */
export const accessibilityRuleSchema = z.object({
  /** Rule type identifier */
  type: z.literal('accessibility'),

  /** Props that must be present (e.g., ['aria-label', 'role']) */
  requiredProps: z.array(z.string()).optional(),

  /** Props that must not be present */
  forbiddenProps: z.array(z.string()).optional(),

  /** Required ARIA role for the component */
  requiredRole: z.string().optional(),

  /** Required ARIA states/properties (e.g., ['aria-expanded', 'aria-controls']) */
  requiredAriaStates: z.array(z.string()).optional(),

  /** Whether keyboard navigation is required */
  keyboardNavigation: z.boolean().optional(),

  /** Focus management requirements */
  focusManagement: focusManagementSchema.optional(),

  /** Color contrast requirements */
  colorContrast: colorContrastSchema.optional(),

  /** WCAG conformance level required */
  wcagLevel: wcagLevelSchema,

  /** Specific WCAG success criteria (e.g., ['2.1.1', '4.1.2']) */
  wcagCriteria: z.array(z.string()).optional(),
});

export type AccessibilityRule = z.infer<typeof accessibilityRuleSchema>;
