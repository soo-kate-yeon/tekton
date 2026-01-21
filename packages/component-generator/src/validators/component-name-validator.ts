/**
 * Component Validator
 * Validates component names against Layer 2 catalog
 * SPEC-LAYER3-MVP-001 M1-TASK-002
 */

import { HallucinationChecker } from '../safety/hallucination-check';
import type { HallucinationCheckResult } from '../safety/safety.types';

/**
 * Validates component names against the component catalog
 * Returns LAYER3-E002 error for invalid components
 * Provides suggestions using Levenshtein distance
 */
export class ComponentValidator {
  private checker: HallucinationChecker;

  constructor() {
    this.checker = new HallucinationChecker();
  }

  /**
   * Validate a single component name
   *
   * @param componentName - Component name to validate
   * @returns Validation result with error code LAYER3-E002 if invalid
   */
  validateComponent(componentName: string): HallucinationCheckResult {
    return this.checker.checkComponent(componentName);
  }

  /**
   * Check if a component name is valid (simple boolean check)
   *
   * @param componentName - Component name to validate
   * @returns True if component exists in catalog
   */
  isValid(componentName: string): boolean {
    return this.checker.isComponentValid(componentName);
  }

  /**
   * Validate multiple components at once
   *
   * @param componentNames - Array of component names to validate
   * @returns Array of validation results
   */
  validateBatch(componentNames: string[]): HallucinationCheckResult[] {
    return componentNames.map(name => this.validateComponent(name));
  }

  /**
   * Get suggestions for a component name using Levenshtein distance
   *
   * @param componentName - Component name to get suggestions for
   * @param maxSuggestions - Maximum number of suggestions (default: 3)
   * @returns Array of suggested component names
   */
  getSuggestions(componentName: string, maxSuggestions: number = 3): string[] {
    return this.checker.getSuggestions(componentName, maxSuggestions);
  }
}
