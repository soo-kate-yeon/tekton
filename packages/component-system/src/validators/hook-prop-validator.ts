/**
 * Hook Prop Rule Validator
 * Validates hook prop rules against Token Contract CSS variables
 *
 * @module validators/hook-prop-validator
 */

import type { HookPropRule } from '../schemas/hook-prop-rule';

/**
 * Validation result
 */
export interface ValidationResult {
  success: boolean;
  errors: string[];
}

/**
 * Known Token Contract CSS variables
 * This should be dynamically loaded from @tekton/token-contract in production
 */
const KNOWN_CSS_VARIABLES = new Set([
  // Colors
  '--tekton-primary-50',
  '--tekton-primary-100',
  '--tekton-primary-200',
  '--tekton-primary-300',
  '--tekton-primary-400',
  '--tekton-primary-500',
  '--tekton-primary-600',
  '--tekton-primary-700',
  '--tekton-primary-800',
  '--tekton-primary-900',
  '--tekton-neutral-50',
  '--tekton-neutral-100',
  '--tekton-neutral-200',
  '--tekton-neutral-300',
  '--tekton-neutral-400',
  '--tekton-neutral-500',
  '--tekton-neutral-600',
  '--tekton-neutral-700',
  '--tekton-neutral-800',
  '--tekton-neutral-900',
  '--tekton-error-500',
  '--tekton-warning-500',
  // Spacing
  '--tekton-spacing-xs',
  '--tekton-spacing-sm',
  '--tekton-spacing-md',
  '--tekton-spacing-lg',
  '--tekton-spacing-xl',
  // Typography
  '--tekton-font-size-xs',
  '--tekton-font-size-sm',
  '--tekton-font-size-base',
  '--tekton-font-size-lg',
  '--tekton-font-size-xl',
  '--tekton-font-weight-normal',
  '--tekton-font-weight-medium',
  '--tekton-font-weight-semibold',
  '--tekton-font-weight-bold',
  // Borders
  '--tekton-border-width',
  '--tekton-border-radius',
  '--tekton-border-radius-sm',
  '--tekton-border-radius-lg',
  // Shadows
  '--tekton-shadow-sm',
  '--tekton-shadow-md',
  '--tekton-shadow-lg',
]);

/**
 * Validates a hook prop rule
 */
export function validateHookPropRule(rule: HookPropRule): ValidationResult {
  const errors: string[] = [];

  // Validate propObjects not empty
  if (rule.propObjects.length === 0) {
    errors.push('propObjects cannot be empty');
  }

  // Validate no hardcoded color values
  for (const baseStyle of rule.baseStyles) {
    for (const [, value] of Object.entries(baseStyle.cssProperties)) {
      // Check for hardcoded hex colors
      if (value.match(/#[0-9a-fA-F]{3,8}/)) {
        errors.push('Hardcoded color values not allowed');
        break;
      }
      // Check for hardcoded rgb/rgba colors
      if (value.match(/rgba?\([^)]+\)/)) {
        errors.push('Hardcoded color values not allowed');
        break;
      }
      // Check for hardcoded hsl/hsla colors
      if (value.match(/hsla?\([^)]+\)/)) {
        errors.push('Hardcoded color values not allowed');
        break;
      }
    }
  }

  // Validate CSS variable references exist in Token Contract
  for (const variable of rule.requiredCSSVariables) {
    if (!KNOWN_CSS_VARIABLES.has(variable)) {
      errors.push(`CSS variable ${variable} does not exist in Token Contract`);
    }
  }

  // Validate CSS variables in baseStyles
  for (const baseStyle of rule.baseStyles) {
    for (const value of Object.values(baseStyle.cssProperties)) {
      const match = value.match(/var\((--tekton-[^)]+)\)/g);
      if (match) {
        for (const varUsage of match) {
          const varName = varUsage.match(/var\((--tekton-[^)]+)\)/)?.[1];
          if (varName && !KNOWN_CSS_VARIABLES.has(varName)) {
            errors.push(`CSS variable ${varName} does not exist in Token Contract`);
          }
        }
      }
    }
  }

  return {
    success: errors.length === 0,
    errors,
  };
}

/**
 * Validates hook name follows naming conventions
 */
export function validateHookName(hookName: string): boolean {
  return /^use[A-Z][a-zA-Z]+$/.test(hookName);
}

/**
 * Extracts CSS variables from a CSS property value
 */
export function extractCSSVariables(value: string): string[] {
  const matches = value.match(/var\((--tekton-[^)]+)\)/g);
  if (!matches) {
    return [];
  }

  return matches.map((match) => {
    const varName = match.match(/var\((--tekton-[^)]+)\)/)?.[1];
    return varName || '';
  }).filter(Boolean);
}
