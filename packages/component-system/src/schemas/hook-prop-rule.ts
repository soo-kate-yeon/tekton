/**
 * Hook Prop Rule Schema
 * Defines the structure for mapping hooks to prop objects and base styles
 *
 * @module schemas/hook-prop-rule
 */

/**
 * Base style definition for a prop object
 */
export interface BaseStyle {
  /**
   * The prop object name (e.g., "buttonProps", "inputProps")
   */
  propObject: string;

  /**
   * CSS properties mapped to Token Contract CSS variables
   * All values must use var(--tekton-*) format
   */
  cssProperties: Record<string, string>;
}

/**
 * Hook Prop Rule
 * Complete mapping from hook to prop objects and styling
 */
export interface HookPropRule {
  /**
   * Hook name (e.g., "useButton", "useTextField")
   */
  hookName: string;

  /**
   * List of prop objects and state values returned by the hook
   */
  propObjects: string[];

  /**
   * Base style definitions for each prop object
   */
  baseStyles: BaseStyle[];

  /**
   * Required CSS variables from Token Contract
   * Must reference only existing variables
   */
  requiredCSSVariables: string[];
}

/**
 * Collection of all hook prop rules
 */
export interface HookPropRuleCollection {
  version: string;
  hooks: HookPropRule[];
}

/**
 * Type guard to check if a value is a valid HookPropRule object
 */
export function isHookPropRule(value: any): value is HookPropRule {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.hookName === 'string' &&
    Array.isArray(value.propObjects) &&
    Array.isArray(value.baseStyles) &&
    Array.isArray(value.requiredCSSVariables)
  );
}
