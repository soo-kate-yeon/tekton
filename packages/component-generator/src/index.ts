/**
 * Component Generator - Slot Semantic Registry
 * SPEC-LAYER3-001 Phase 1
 *
 * @packageDocumentation
 */

// Type exports
export type {
  SlotType,
  SlotScope,
  SlotRole,
  SlotDefinition,
  SlotConstraints,
  GlobalSlotType,
  LocalSlotType,
} from './types/slot-types';

export type {
  ValidationError,
  ValidationResult,
  SlotValidationOptions,
} from './types/validation-types';

// Registry exports
export { GlobalSlotRegistry } from './registry/global-slot-registry';
export { LocalSlotRegistry } from './registry/local-slot-registry';

// Validator exports
export { SlotValidator } from './validators/slot-validator';

// Resolver exports
export { SlotResolver } from './resolvers/slot-resolver';
