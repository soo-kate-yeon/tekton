/**
 * Slot Constraint Validator
 * SPEC-LAYER3-001 Phase 1
 */

import type { SlotType } from '../types/slot-types';
import type {
  ValidationResult,
  ValidationError,
  SlotValidationOptions,
} from '../types/validation-types';
import type { GlobalSlotRegistry } from '../registry/global-slot-registry';
import type { LocalSlotRegistry } from '../registry/local-slot-registry';

/**
 * Validator for slot constraints
 */
export class SlotValidator {
  constructor(
    private globalRegistry: GlobalSlotRegistry,
    private localRegistry: LocalSlotRegistry
  ) {}

  /**
   * Validate maximum children constraint
   */
  validateMaxChildren(
    slotName: SlotType,
    childrenCount: number
  ): ValidationResult {
    const errors: ValidationError[] = [];

    // Get slot constraints
    const constraints = this.getConstraints(slotName);

    // Check maxChildren constraint
    if (constraints?.maxChildren !== undefined) {
      if (childrenCount > constraints.maxChildren) {
        errors.push({
          code: 'LAYER3-E003',
          message: `Slot '${slotName}' exceeds maxChildren limit. Got ${childrenCount}, max allowed is ${constraints.maxChildren}.`,
          context: {
            slotName,
            childrenCount,
            maxChildren: constraints.maxChildren,
          },
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate allowed components constraint
   */
  validateAllowedComponents(
    slotName: SlotType,
    componentTypes: string[]
  ): ValidationResult {
    const errors: ValidationError[] = [];

    // Get slot constraints
    const constraints = this.getConstraints(slotName);

    // Check allowedComponents constraint
    if (constraints?.allowedComponents && constraints.allowedComponents.length > 0) {
      const notAllowed = componentTypes.filter(
        type => !constraints.allowedComponents?.includes(type)
      );

      if (notAllowed.length > 0) {
        errors.push({
          code: 'LAYER3-E003',
          message: `Slot '${slotName}' contains disallowed components: ${notAllowed.join(', ')}. Allowed components: ${constraints.allowedComponents.join(', ')}.`,
          context: {
            slotName,
            notAllowed,
            allowedComponents: constraints.allowedComponents,
          },
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate excluded components constraint
   */
  validateExcludedComponents(
    slotName: SlotType,
    componentTypes: string[]
  ): ValidationResult {
    const errors: ValidationError[] = [];

    // Get slot constraints
    const constraints = this.getConstraints(slotName);

    // Check excludedComponents constraint
    if (constraints?.excludedComponents && constraints.excludedComponents.length > 0) {
      const excluded = componentTypes.filter(
        type => constraints.excludedComponents?.includes(type)
      );

      if (excluded.length > 0) {
        errors.push({
          code: 'LAYER3-E003',
          message: `Slot '${slotName}' contains excluded components: ${excluded.join(', ')}.`,
          context: {
            slotName,
            excludedComponents: excluded,
          },
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Comprehensive slot validation
   */
  validateSlot(
    slotName: SlotType,
    options: SlotValidationOptions
  ): ValidationResult {
    const allErrors: ValidationError[] = [];

    // Validate maxChildren
    if (options.childrenCount !== undefined) {
      const result = this.validateMaxChildren(slotName, options.childrenCount);
      allErrors.push(...result.errors);
    }

    // Validate component types
    if (options.componentTypes && options.componentTypes.length > 0) {
      // Check allowed components
      const allowedResult = this.validateAllowedComponents(
        slotName,
        options.componentTypes
      );
      allErrors.push(...allowedResult.errors);

      // Check excluded components
      const excludedResult = this.validateExcludedComponents(
        slotName,
        options.componentTypes
      );
      allErrors.push(...excludedResult.errors);
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
    };
  }

  /**
   * Get constraints for a slot (checks both global and local registries)
   */
  private getConstraints(slotName: SlotType) {
    // Try global registry first
    if (this.globalRegistry.hasSlot(slotName as any)) {
      return this.globalRegistry.getSlotConstraints(slotName as any);
    }

    // Try local registry
    if (this.localRegistry.hasSlot(slotName as any)) {
      return this.localRegistry.getSlotConstraints(slotName as any);
    }

    return undefined;
  }
}
