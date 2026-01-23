/**
 * ComponentKnowledge Validator
 * TAG: SPEC-LAYER2-001
 *
 * Validates ComponentKnowledge entries for completeness and correctness
 */

import type {
  ComponentKnowledge,
  ComponentState,
  ValidationResult,
} from '../types/knowledge.types.js';
import { validateSlotAffinity, validateConstraints } from './constraint-validator.js';

/**
 * Required states that must be present in all ComponentKnowledge entries
 */
const REQUIRED_STATES: ComponentState[] = ['default', 'hover', 'focus', 'active', 'disabled'];

/**
 * Validates a ComponentKnowledge entry
 *
 * @param knowledge - ComponentKnowledge entry to validate
 * @param catalog - Optional component catalog for constraint validation
 * @returns Validation result with errors and warnings
 */
export function validateComponentKnowledge(
  knowledge: ComponentKnowledge,
  catalog?: string[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate name is present and non-empty
  if (!knowledge.name || knowledge.name.trim().length === 0) {
    errors.push('Component name is required and cannot be empty');
  }

  // Validate semantic description purpose has minimum length
  if (
    !knowledge.semanticDescription?.purpose ||
    knowledge.semanticDescription.purpose.length < 20
  ) {
    errors.push('semanticDescription.purpose must be at least 20 characters');
  }

  // Validate all required states are present
  const stateValidation = validateRequiredStates(knowledge);
  errors.push(...stateValidation.errors);
  warnings.push(...stateValidation.warnings);

  // Validate slotAffinity scores
  const affinityValidation = validateSlotAffinity(knowledge.slotAffinity);
  errors.push(...affinityValidation.errors);
  warnings.push(...affinityValidation.warnings);

  // Validate constraints
  const constraintValidation = validateConstraints(
    knowledge.slotAffinity,
    knowledge.constraints,
    knowledge.name,
    catalog
  );
  errors.push(...constraintValidation.errors);
  warnings.push(...constraintValidation.warnings);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates that all required states are present in tokenBindings
 *
 * @param knowledge - ComponentKnowledge entry
 * @returns Validation result
 */
function validateRequiredStates(knowledge: ComponentKnowledge): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const presentStates = Object.keys(knowledge.tokenBindings.states);
  const missingStates = REQUIRED_STATES.filter(state => !presentStates.includes(state));

  if (missingStates.length > 0) {
    errors.push(
      `Missing required states: ${missingStates.join(', ')}. All components must define: ${REQUIRED_STATES.join(', ')}`
    );
  }

  // Check for empty state definitions
  for (const state of REQUIRED_STATES) {
    const stateBindings = knowledge.tokenBindings.states[state];
    if (stateBindings && Object.keys(stateBindings).length === 0 && state === 'default') {
      warnings.push(`State '${state}' has no token bindings defined`);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

export { validateSlotAffinity, validateConstraints };
