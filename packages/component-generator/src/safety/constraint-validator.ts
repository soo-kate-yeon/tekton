/**
 * Constraint Validator
 * TAG: SPEC-LAYER3-001 Section 5.5.3
 *
 * Enforces excluded slot constraints from component definitions
 */

import { getComponentByName } from "@tekton/component-knowledge";
import type { ExcludedSlotResult } from "./safety.types.js";

/**
 * ConstraintValidator - Validates excluded slot constraints
 * SPEC-LAYER3-001 Section 5.5.3
 */
export class ConstraintValidator {
  /**
   * Check if a component is allowed in a target slot based on excluded slots
   *
   * @param componentName - Component name to validate
   * @param targetSlot - Target slot identifier
   * @param originalScore - Original score (will be 0.0 if excluded)
   * @returns Excluded slot check result
   */
  checkExcludedSlot(
    componentName: string,
    targetSlot: string,
    originalScore: number = 1.0,
  ): ExcludedSlotResult {
    // Get component from catalog
    const component = getComponentByName(componentName);

    // If component not found, allow (hallucination check handles this)
    if (!component) {
      return {
        isAllowed: true,
        componentName,
        targetSlot,
        score: originalScore,
      };
    }

    // Check if slot is in excluded list
    const excludedSlots = component.constraints?.excludedSlots ?? [];
    const isExcluded = excludedSlots.includes(targetSlot);

    if (isExcluded) {
      return {
        isAllowed: false,
        componentName,
        targetSlot,
        score: 0.0,
        reason: `Component "${componentName}" is excluded from slot "${targetSlot}" by component constraints`,
      };
    }

    return {
      isAllowed: true,
      componentName,
      targetSlot,
      score: originalScore,
    };
  }

  /**
   * Quick check if component is allowed in slot
   *
   * @param componentName - Component name to validate
   * @param targetSlot - Target slot identifier
   * @returns True if component is allowed in slot
   */
  isComponentAllowedInSlot(componentName: string, targetSlot: string): boolean {
    const result = this.checkExcludedSlot(componentName, targetSlot);
    return result.isAllowed;
  }

  /**
   * Get all excluded slots for a component
   *
   * @param componentName - Component name
   * @returns Array of excluded slot names
   */
  getExcludedSlots(componentName: string): string[] {
    const component = getComponentByName(componentName);

    if (!component) {
      return [];
    }

    return component.constraints?.excludedSlots ?? [];
  }
}
