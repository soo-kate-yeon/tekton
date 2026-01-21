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
} from "./types/slot-types";

export type {
  ValidationError,
  ValidationResult,
  SlotValidationOptions,
} from "./types/validation-types";

// Registry exports
export { GlobalSlotRegistry } from "./registry/global-slot-registry";
export { LocalSlotRegistry } from "./registry/local-slot-registry";

// Validator exports
export { SlotValidator } from "./validators/slot-validator";

// Resolver exports
export { SlotResolver } from "./resolvers/slot-resolver";

// Safety exports
export type {
  ThresholdCheckResult,
  HallucinationCheckResult,
  ExcludedSlotResult,
  FluidFallbackResult,
  FallbackMetadata,
  SlotRole as SafetySlotRole,
  LevenshteinOptions,
} from "./safety/safety.types";

export {
  SCORE_THRESHOLD,
  SAFETY_ERROR_CODES,
  FALLBACK_COMPONENTS,
} from "./safety/safety.types";

export { ThresholdChecker } from "./safety/threshold-check";
export { HallucinationChecker } from "./safety/hallucination-check";
export { ConstraintValidator } from "./safety/constraint-validator";
export { FluidFallback } from "./safety/fluid-fallback";

// Generator exports (M1-TASK-006)
export { JSXGenerator } from "./generator/jsx-generator";
export type { GenerationResult } from "./generator/jsx-generator";

// Knowledge Schema exports (Layer 3)
export type {
  SlotRole as KnowledgeSlotRole,
  ComponentNode,
  BlueprintResult,
} from "./types/knowledge-schema";
export { BlueprintResultSchema } from "./types/knowledge-schema";
