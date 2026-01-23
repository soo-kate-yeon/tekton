/**
 * JSON Exporter
 * TAG: SPEC-LAYER2-001
 *
 * Exports component knowledge catalog as JSON
 * REQ-LAYER2-009: Generate both JSON and Markdown formats
 */

import type { ComponentKnowledge } from '../types/knowledge.types.js';
import type { JSONExportFormat } from '../types/export.types.js';

/**
 * JSONExporter exports component catalog as JSON
 */
export class JSONExporter {
  /**
   * Exports component catalog as JSON format
   *
   * REQ-LAYER2-009: JSON for programmatic use
   *
   * @param components - Array of ComponentKnowledge entries
   * @returns JSON export object
   */
  exportCatalog(components: ComponentKnowledge[]): JSONExportFormat {
    const componentsMap: Record<string, ComponentKnowledge> = {};

    for (const component of components) {
      componentsMap[component.name] = component;
    }

    return {
      schemaVersion: '2.0.0',
      generatedAt: new Date().toISOString(),
      components: componentsMap,
    };
  }

  /**
   * Exports catalog as JSON string
   *
   * @param components - Array of ComponentKnowledge entries
   * @param pretty - Whether to format JSON with indentation
   * @returns JSON string
   */
  exportAsString(components: ComponentKnowledge[], pretty: boolean = true): string {
    const data = this.exportCatalog(components);
    return JSON.stringify(data, null, pretty ? 2 : 0);
  }
}
