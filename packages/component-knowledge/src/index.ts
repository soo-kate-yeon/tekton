/**
 * Component Knowledge System - Layer 2
 * TAG: SPEC-LAYER2-001
 *
 * Main entry point for the Component Knowledge System
 */

// Type exports
export type {
  ComponentKnowledge,
  ComponentType,
  ComponentCategory,
  VisualImpact,
  Complexity,
  ComponentState,
  TokenBindings,
  SlotAffinity,
  SemanticDescription,
  ComponentConstraints,
  StateTokenBindings,
  ValidationResult,
  Layer1TokenMetadata,
} from './types/knowledge.types';

// Validator exports
export {
  validateComponentKnowledge,
  validateSlotAffinity,
  validateConstraints,
} from './catalog/component-knowledge';

export { TokenValidator } from './validator/token-validator';
export { StateCompletenessChecker } from './validator/state-completeness';

// Catalog exports
export {
  COMPONENT_CATALOG,
  getComponentByName,
  getAllComponents,
  getComponentsByType,
  getComponentsByCategory,
} from './catalog/component-catalog';

// Schema and CSS-in-JS exports
export { ZodSchemaGenerator } from './schema/zod-schema-generator';
export { VanillaExtractGenerator } from './css-in-js/vanilla-extract-generator';

// Export utilities
export { JSONExporter } from './export/json-exporter';
export { MarkdownExporter } from './export/markdown-exporter';
export { Layer3RegistryBuilder } from './export/registry-builder';

// Export types
export type { JSONExportFormat, Layer2Output } from './types/export.types';
