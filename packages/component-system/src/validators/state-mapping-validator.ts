/**
 * State-Style Mapping Validator
 * Validates state-style mappings against Token Contract and accessibility standards
 *
 * @module validators/state-mapping-validator
 */

import type { StateStyleMapping } from '../schemas/state-style-mapping.js';

/**
 * Validation result
 */
export interface ValidationResult {
  success: boolean;
  errors: string[];
}

/**
 * Known Token Contract CSS variables
 * Reusing from hook-prop-validator for consistency
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
 * Valid easing functions
 */
const VALID_EASING_FUNCTIONS = new Set([
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'linear',
]);

/**
 * Valid state types
 */
const VALID_STATE_TYPES = new Set(['boolean', 'numeric', 'composite']);

/**
 * Validates a state-style mapping
 */
export function validateStateStyleMapping(mapping: StateStyleMapping): ValidationResult {
  const errors: string[] = [];

  // Validate transitions
  if (!validateTransitionDuration(mapping.transitions.duration)) {
    errors.push('Invalid transition duration format');
  }

  if (!validateEasingFunction(mapping.transitions.easing)) {
    // Allow custom cubic-bezier, so only error if it's not a valid preset and not a cubic-bezier
    if (!mapping.transitions.easing.startsWith('cubic-bezier(')) {
      errors.push('Invalid transition easing function');
    }
  }

  if (!mapping.transitions.reducedMotion) {
    errors.push('Reduced motion support is required for accessibility');
  }

  // Validate states
  for (const state of mapping.states) {
    // Validate state type
    if (!VALID_STATE_TYPES.has(state.stateType)) {
      errors.push(`Invalid state type: ${state.stateType}`);
    }

    // Validate visual feedback is not empty
    if (Object.keys(state.visualFeedback.cssProperties).length === 0) {
      errors.push('Visual feedback cannot be empty');
    }

    // Validate no hardcoded color values in visual feedback
    for (const [, value] of Object.entries(state.visualFeedback.cssProperties)) {
      // Check for hardcoded hex colors
      if (value.match(/#[0-9a-fA-F]{3,8}/)) {
        errors.push('Hardcoded color values not allowed in visual feedback');
        break;
      }
      // Check for hardcoded rgb/rgba colors
      if (value.match(/rgba?\([^)]+\)/)) {
        errors.push('Hardcoded color values not allowed in visual feedback');
        break;
      }
      // Check for hardcoded hsl/hsla colors
      if (value.match(/hsla?\([^)]+\)/)) {
        errors.push('Hardcoded color values not allowed in visual feedback');
        break;
      }
    }

    // Validate CSS variables in visual feedback
    for (const value of Object.values(state.visualFeedback.cssProperties)) {
      const variables = extractCSSVariables(value);
      for (const variable of variables) {
        if (!KNOWN_CSS_VARIABLES.has(variable)) {
          errors.push(`CSS variable ${variable} does not exist in Token Contract`);
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
 * Validates transition duration follows CSS spec
 */
function validateTransitionDuration(duration: string): boolean {
  return /^\d+(\.\d+)?(ms|s)$/.test(duration);
}

/**
 * Validates easing function
 */
function validateEasingFunction(easing: string): boolean {
  return VALID_EASING_FUNCTIONS.has(easing) || easing.startsWith('cubic-bezier(');
}

/**
 * Extracts CSS variables from a CSS property value
 */
function extractCSSVariables(value: string): string[] {
  const matches = value.match(/var\((--tekton-[^)]+)\)/g);
  if (!matches) {
    return [];
  }

  return matches
    .map((match) => {
      const varName = match.match(/var\((--tekton-[^)]+)\)/)?.[1];
      return varName || '';
    })
    .filter(Boolean);
}
