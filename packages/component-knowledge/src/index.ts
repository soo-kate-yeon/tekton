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
} from './types/knowledge.types.js';

// Validator exports
export {
  validateComponentKnowledge,
  validateSlotAffinity,
  validateConstraints,
} from './catalog/component-knowledge.js';

export { TokenValidator } from './validator/token-validator.js';
export { StateCompletenessChecker } from './validator/state-completeness.js';

// Catalog exports
export {
  COMPONENT_CATALOG,
  getComponentByName,
  getAllComponents,
  getComponentsByType,
  getComponentsByCategory,
} from './catalog/component-catalog.js';

// Schema and CSS-in-JS exports
export { ZodSchemaGenerator } from './schema/zod-schema-generator.js';
export { VanillaExtractGenerator } from './css-in-js/vanilla-extract-generator.js';

// Export utilities
export { JSONExporter } from './export/json-exporter.js';
export { MarkdownExporter } from './export/markdown-exporter.js';
export { Layer3RegistryBuilder } from './export/registry-builder.js';

// Export types
export type { JSONExportFormat, Layer2Output } from './types/export.types.js';
