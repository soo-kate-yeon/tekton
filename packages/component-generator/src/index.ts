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
  GlobalSlotRole,
  LocalSlotRole,
  ConstraintTag,
  GlobalSlot,
  LocalSlot,
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
export { ComponentValidator } from "./validators/component-validator";
export type {
  ValidationError as ComponentValidationError,
  ValidationResult as ComponentValidationResult,
} from "./validators/component-validator";

// Resolver exports
export { SlotResolver } from "./resolvers/slot-resolver";

// Knowledge Schema exports (TASK-001)
export type {
  ComponentCategory,
  SlotDefinitionKnowledge,
  PropDefinitionKnowledge,
  ComponentKnowledge,
  SlotMapping,
  PropMapping,
  ComponentBlueprint,
  KnowledgeSchema,
} from "./types/knowledge-types";

// Scoring exports
export type {
  BlueprintIntent,
  IntentMode,
  IntentComplexity,
  ScoringContext,
  ScoringInput,
  ScoringResult,
  ScoringBreakdown,
} from "./scoring/scoring.types";

export {
  SCORING_WEIGHTS,
  INTENT_MODE_ADJUSTMENTS,
  KEYWORD_MATCH_BONUS,
  CONTEXT_PENALTIES,
  DEFAULT_AFFINITY,
  INTENT_MATCH_BASELINE,
  NO_PENALTY,
} from "./scoring/scoring.types";

export { SemanticScorer } from "./scoring/semantic-scorer";
export { IntentInjector } from "./scoring/intent-injector";

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

// Generator exports (TASK-003 to TASK-006 + M1-TASK-006)
export { ASTImportGenerator } from "./generators/ast-import-generator";
export { ASTJSXGenerator } from "./generators/ast-jsx-generator";
export { ASTBuilder } from "./generators/ast-builder";
export { JSXGenerator as LegacyJSXGenerator } from "./generators/jsx-generator";
export { JSXGenerator } from "./generator/jsx-generator";
export type { ImportInfo } from "./generators/ast-import-generator";
export type { PrettierOptions } from "./generators/jsx-generator";
export type { GenerationResult } from "./generator/jsx-generator";

// Knowledge Schema exports (Layer 3)
export type {
  SlotRole as KnowledgeSlotRole,
  ComponentNode,
  BlueprintResult,
} from "./types/knowledge-schema";
export { BlueprintResultSchema } from "./types/knowledge-schema";
