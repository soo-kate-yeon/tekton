/**
 * Adapters - Decoupling layer for external dependencies
 *
 * Purpose: Isolate studio-mcp from direct coupling to:
 * - @tekton/component-generator
 * - @tekton/component-knowledge
 *
 * Benefits:
 * - API stability (external changes don't break MCP tools)
 * - Testability (easy to mock adapters)
 * - Maintainability (changes localized to adapters)
 */

export { ComponentAdapter } from './component-adapter.js';
export { CatalogAdapter } from './catalog-adapter.js';
export type {
  GenerateCodeOptions,
  GenerateCodeResult,
  ComponentInfo,
  AdapterResult,
} from './types.js';
