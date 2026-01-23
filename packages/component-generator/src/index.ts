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
} from "./types/slot-types.js";

export type {
  ValidationError,
  ValidationResult,
  SlotValidationOptions,
} from "./types/validation-types.js";

// Registry exports
export { GlobalSlotRegistry } from "./registry/global-slot-registry.js";
export { LocalSlotRegistry } from "./registry/local-slot-registry.js";

// Validator exports
export { SlotValidator } from "./validators/slot-validator.js";
export { ComponentValidator } from "./validators/component-validator.js";
export type {
  ValidationError as ComponentValidationError,
  ValidationResult as ComponentValidationResult,
} from "./validators/component-validator.js";

// Resolver exports
export { SlotResolver } from "./resolvers/slot-resolver.js";

// Safety exports
export type {
  ThresholdCheckResult,
  HallucinationCheckResult,
  ExcludedSlotResult,
  FluidFallbackResult,
  FallbackMetadata,
  SlotRole as SafetySlotRole,
  LevenshteinOptions,
} from "./safety/safety.types.js";

export {
  SCORE_THRESHOLD,
  SAFETY_ERROR_CODES,
  FALLBACK_COMPONENTS,
} from "./safety/safety.types.js";

export { ThresholdChecker } from "./safety/threshold-check.js";

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
} from "./types/knowledge-types.js";

// Safety exports (M1-TASK-002)
export { HallucinationChecker } from "./safety/hallucination-check.js";

// Generator exports (TASK-003 to TASK-006 + M1-TASK-006)
export { ASTImportGenerator } from "./generators/ast-import-generator.js";
export { ASTJSXGenerator } from "./generators/ast-jsx-generator.js";
export { ASTBuilder } from "./generators/ast-builder.js";
export { JSXGenerator as LegacyJSXGenerator } from "./generators/jsx-generator.js";
export { JSXGenerator } from "./generator/jsx-generator.js";
export type { ImportInfo } from "./generators/ast-import-generator.js";
export type { PrettierOptions } from "./generators/jsx-generator.js";
export type { GenerationResult } from "./generator/jsx-generator.js";

// Knowledge Schema exports (Layer 3)
export type {
  SlotRole as KnowledgeSlotRole,
  ComponentNode,
  BlueprintResult,
  BlueprintResultV2,
  Environment,
} from "./types/knowledge-schema.js";
export {
  BlueprintResultSchema,
  blueprintResultV2Schema,
  environmentValues,
} from "./types/knowledge-schema.js";

// Layout Schema exports (SPEC-LAYOUT-001)
export type {
  BlueprintLayout,
  ContainerType,
  MaxWidthPreset,
  GridBreakpointKey,
  GridConfig,
  GapConfig,
} from "./types/layout-schema.js";
export {
  blueprintLayoutSchema,
  containerValues,
  maxWidthValues,
  gridBreakpointKeys,
} from "./types/layout-schema.js";

// Class merge utilities (SPEC-LAYOUT-001 TASK-010)
export { mergeClasses, mergeLayoutClasses } from "./utils/class-merge.js";

// Responsive class generator utilities (SPEC-LAYOUT-001 TASK-011)
export {
  generateResponsiveClasses,
  generateResponsiveGridClasses,
  generateResponsivePaddingClasses,
  generateResponsiveGapClasses,
} from "./utils/responsive-class-generator.js";
