/**
 * @file variant-branching.ts
 * @description TypeScript schema for variant branching system that defines conditional styling
 * logic based on hook configuration options
 */

/**
 * Configuration option types supported by hooks
 */
export type VariantOptionType = 'boolean' | 'string' | 'enum';

/**
 * Style rule with condition and CSS properties
 */
export interface VariantStyleRule {
  /**
   * Conditional expression to evaluate (e.g., "variant === 'primary'")
   */
  condition: string;

  /**
   * CSS properties to apply when condition is met
   * All values must reference Token Contract CSS variables
   */
  cssProperties: Record<string, string>;
}

/**
 * Configuration option definition for a hook
 */
export interface VariantConfigurationOption {
  /**
   * Name of the configuration option (e.g., "variant", "toggle", "disabled")
   */
  optionName: string;

  /**
   * Type of the option value
   */
  optionType: VariantOptionType;

  /**
   * Possible values for this option
   */
  possibleValues: any[];

  /**
   * Style rules that apply based on option value
   */
  styleRules: VariantStyleRule[];
}

/**
 * Variant branching rules for a hook
 */
export interface VariantBranching {
  /**
   * Name of the hook (e.g., "useButton", "useTextField")
   */
  hookName: string;

  /**
   * Configuration options available for this hook
   */
  configurationOptions: VariantConfigurationOption[];
}

/**
 * Type guard to check if a value is a valid VariantBranching object
 */
export function isVariantBranching(value: any): value is VariantBranching {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.hookName === 'string' &&
    Array.isArray(value.configurationOptions)
  );
}
