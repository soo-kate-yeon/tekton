/**
 * @file variant-validator.ts
 * @description Validation logic for variant branching rules
 */

import type { VariantBranching } from '../schemas/variant-branching.js';

/**
 * Validation result for variant branching rules
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validator for variant branching rules
 * Ensures rules comply with Token Contract CSS variable requirements
 */
export class VariantValidator {
  /**
   * Validate a variant branching rule
   */
  validate(rule: VariantBranching): ValidationResult {
    const errors: string[] = [];

    // Check required fields
    if (!rule.hookName || typeof rule.hookName !== 'string') {
      errors.push('hookName is required and must be a string');
    }

    if (!Array.isArray(rule.configurationOptions)) {
      errors.push('configurationOptions must be an array');
      return { valid: false, errors };
    }

    // Validate each configuration option
    for (const option of rule.configurationOptions) {
      // Check option name
      if (!option.optionName || typeof option.optionName !== 'string') {
        errors.push(
          `Configuration option must have a valid optionName (hook: ${rule.hookName})`
        );
      }

      // Check option type
      if (
        !option.optionType ||
        !['boolean', 'string', 'enum'].includes(option.optionType)
      ) {
        errors.push(
          `Configuration option ${option.optionName} must have a valid optionType (hook: ${rule.hookName})`
        );
      }

      // Check possible values
      if (!Array.isArray(option.possibleValues)) {
        errors.push(
          `Configuration option ${option.optionName} must have possibleValues array (hook: ${rule.hookName})`
        );
      }

      // Check style rules
      if (!Array.isArray(option.styleRules)) {
        errors.push(
          `Configuration option ${option.optionName} must have styleRules array (hook: ${rule.hookName})`
        );
        continue;
      }

      // Validate each style rule
      for (const styleRule of option.styleRules) {
        // Check condition
        if (!styleRule.condition || typeof styleRule.condition !== 'string') {
          errors.push(
            `Style rule must have a valid condition (hook: ${rule.hookName}, option: ${option.optionName})`
          );
        }

        // Check CSS properties
        if (!styleRule.cssProperties || typeof styleRule.cssProperties !== 'object') {
          errors.push(
            `Style rule must have cssProperties object (hook: ${rule.hookName}, option: ${option.optionName})`
          );
          continue;
        }

        // Validate CSS properties - check for hardcoded color values
        for (const [prop, value] of Object.entries(styleRule.cssProperties)) {
          if (typeof value !== 'string') {
            errors.push(
              `CSS property ${prop} must be a string (hook: ${rule.hookName}, option: ${option.optionName})`
            );
            continue;
          }

          // Check for hardcoded hex colors
          if (value.match(/#[0-9a-fA-F]{3,8}/)) {
            errors.push(
              `CSS property ${prop} contains hardcoded hex color value. Use Token Contract CSS variables instead (hook: ${rule.hookName}, option: ${option.optionName})`
            );
          }

          // Check for hardcoded rgb/rgba colors
          if (value.match(/rgba?\([^)]+\)/)) {
            errors.push(
              `CSS property ${prop} contains hardcoded rgb/rgba color value. Use Token Contract CSS variables instead (hook: ${rule.hookName}, option: ${option.optionName})`
            );
          }

          // Check for hardcoded hsl/hsla colors
          if (value.match(/hsla?\([^)]+\)/)) {
            errors.push(
              `CSS property ${prop} contains hardcoded hsl/hsla color value. Use Token Contract CSS variables instead (hook: ${rule.hookName}, option: ${option.optionName})`
            );
          }

          // If it's a CSS variable, ensure it's from Token Contract
          if (value.includes('var(') && !value.includes('var(--tekton-')) {
            errors.push(
              `CSS property ${prop} uses non-Token Contract CSS variable. All variables must start with --tekton- (hook: ${rule.hookName}, option: ${option.optionName})`
            );
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate all variant branching rules
   */
  validateAll(rules: VariantBranching[]): ValidationResult {
    const allErrors: string[] = [];

    for (const rule of rules) {
      const result = this.validate(rule);
      if (!result.valid) {
        allErrors.push(...result.errors);
      }
    }

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
    };
  }
}
