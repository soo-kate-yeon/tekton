/**
 * State Completeness Checker
 * TAG: SPEC-LAYER2-001
 *
 * Verifies all required states are present in ComponentKnowledge
 * REQ-LAYER2-003: Ensure complete state coverage for all components
 * REQ-LAYER2-014: Reject incomplete state coverage
 */

import type {
  ComponentKnowledge,
  ComponentState,
  ValidationResult,
} from '../types/knowledge.types.js';

/**
 * Required states that must be present in all ComponentKnowledge entries
 */
const REQUIRED_STATES: ComponentState[] = ['default', 'hover', 'focus', 'active', 'disabled'];

/**
 * StateCompletenessChecker validates state coverage
 */
export class StateCompletenessChecker {
  /**
   * Validates that all required states are present
   *
   * REQ-LAYER2-003: All hooks must have bindings for all 5 states
   * REQ-LAYER2-014: Incomplete state coverage creates UX bugs
   *
   * @param knowledge - ComponentKnowledge entry to validate
   * @returns Validation result
   */
  validate(knowledge: ComponentKnowledge): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const presentStates = Object.keys(knowledge.tokenBindings.states);
    const missingStates = REQUIRED_STATES.filter(state => !presentStates.includes(state));

    // REQ-LAYER2-014: Reject missing states
    if (missingStates.length > 0) {
      errors.push(
        `Component '${knowledge.name}' is missing required states: ${missingStates.join(', ')}. ` +
        `All components must define: ${REQUIRED_STATES.join(', ')}`
      );
    }

    // Warn about empty state definitions
    for (const state of REQUIRED_STATES) {
      const stateBindings = knowledge.tokenBindings.states[state];
      if (stateBindings && Object.keys(stateBindings).length === 0) {
        if (state !== 'default') {
          // Empty non-default states are acceptable but worth noting
          warnings.push(
            `State '${state}' has no token bindings defined (empty object). ` +
            `Consider adding bindings or inheriting from default.`
          );
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Calculates state coverage percentage
   *
   * @param knowledge - ComponentKnowledge entry
   * @returns Coverage percentage (0-100)
   */
  calculateCoverage(knowledge: ComponentKnowledge): number {
    let coveredStates = 0;

    for (const state of REQUIRED_STATES) {
      const stateBindings = knowledge.tokenBindings.states[state];
      if (stateBindings && Object.keys(stateBindings).length > 0) {
        coveredStates++;
      }
    }

    return Math.round((coveredStates / REQUIRED_STATES.length) * 100);
  }

  /**
   * Gets list of required states
   *
   * @returns Array of required state names
   */
  getRequiredStates(): ComponentState[] {
    return [...REQUIRED_STATES];
  }
}
