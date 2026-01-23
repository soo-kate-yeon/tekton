/**
 * Constraint Validator
 * TAG: SPEC-LAYER2-001
 *
 * Validates component constraints and slot affinity consistency
 */

import type {
  SlotAffinity,
  ComponentConstraints,
  ValidationResult,
} from '../types/knowledge.types.js';

/**
 * Validates slot affinity values are within valid range (0.0 - 1.0)
 *
 * REQ-LAYER2-006: Warn if any slot affinity > 0.95 or sum < 0.5
 * REQ-LAYER2-015: Reject slotAffinity values outside 0.0-1.0 range
 *
 * @param slotAffinity - Slot affinity scores to validate
 * @returns Validation result
 */
export function validateSlotAffinity(slotAffinity: SlotAffinity): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  let totalAffinity = 0;

  for (const [slot, affinity] of Object.entries(slotAffinity)) {
    // REQ-LAYER2-015: Validate range 0.0-1.0
    if (affinity < 0.0 || affinity > 1.0) {
      errors.push(
        `slotAffinity['${slot}'] = ${affinity} is outside valid range [0.0, 1.0]`
      );
    }

    // REQ-LAYER2-006: Warn if affinity exceeds 0.95
    if (affinity > 0.95) {
      warnings.push(
        `slotAffinity['${slot}'] = ${affinity} exceeds 0.95, may cause over-selection`
      );
    }

    totalAffinity += affinity;
  }

  // REQ-LAYER2-006: Warn if total affinity sum is low
  if (totalAffinity < 0.5) {
    warnings.push(
      `Total slotAffinity sum (${totalAffinity.toFixed(2)}) is below 0.5, component may be under-utilized`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates component constraints for consistency
 *
 * REQ-LAYER2-010: excludedSlots must have 0.0 affinity
 * REQ-LAYER2-011: Required components must exist in catalog
 * REQ-LAYER2-016: No self-referential conflicts
 *
 * @param slotAffinity - Slot affinity scores
 * @param constraints - Component constraints
 * @param componentName - Name of component being validated
 * @param catalog - Optional list of all component names for requires validation
 * @returns Validation result
 */
export function validateConstraints(
  slotAffinity: SlotAffinity,
  constraints: ComponentConstraints,
  componentName?: string,
  catalog?: string[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // REQ-LAYER2-010: Validate excludedSlots have 0.0 affinity
  if (constraints.excludedSlots && constraints.excludedSlots.length > 0) {
    for (const slot of constraints.excludedSlots) {
      const affinity = slotAffinity[slot];
      if (affinity !== undefined && affinity !== 0.0) {
        errors.push(
          `excludedSlots includes '${slot}' but slotAffinity['${slot}'] = ${affinity} (must be 0.0)`
        );
      }
    }
  }

  // REQ-LAYER2-016: Validate no self-referential conflicts
  if (constraints.conflictsWith && componentName) {
    if (constraints.conflictsWith.includes(componentName)) {
      errors.push(
        `Component '${componentName}' cannot conflict with itself in conflictsWith constraint`
      );
    }
  }

  // REQ-LAYER2-011: Validate requires references exist in catalog
  if (constraints.requires && constraints.requires.length > 0 && catalog) {
    for (const required of constraints.requires) {
      if (!catalog.includes(required)) {
        errors.push(
          `constraints.requires includes '${required}' but it does not exist in component catalog`
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
