/**
 * Markdown Exporter
 * TAG: SPEC-LAYER2-001
 *
 * Exports component knowledge catalog as Markdown for AI context injection
 * REQ-LAYER2-009: Generate both JSON and Markdown formats
 */

import type { ComponentKnowledge } from '../types/knowledge.types.js';

/**
 * MarkdownExporter exports component catalog as Markdown documentation
 */
export class MarkdownExporter {
  /**
   * Exports component catalog as Markdown
   *
   * REQ-LAYER2-009: Markdown for AI context injection
   *
   * @param components - Array of ComponentKnowledge entries
   * @returns Markdown string
   */
  exportCatalog(components: ComponentKnowledge[]): string {
    const lines: string[] = [];

    // Header
    lines.push('# Component Knowledge Catalog');
    lines.push('');
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push('');
    lines.push('---');
    lines.push('');

    // Export each component
    for (const component of components) {
      lines.push(...this.exportComponent(component));
      lines.push('');
      lines.push('---');
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Exports a single component as Markdown
   *
   * @param component - ComponentKnowledge entry
   * @returns Array of Markdown lines
   */
  private exportComponent(component: ComponentKnowledge): string[] {
    const lines: string[] = [];

    // Component header
    lines.push(`## ${component.name}`);
    lines.push('');

    // Metadata
    lines.push(`- **Type:** ${this.capitalize(component.type)}`);
    lines.push(`- **Category:** ${this.capitalize(component.category)}`);
    lines.push(`- **Purpose:** ${component.semanticDescription.purpose}`);
    lines.push(`- **Visual Impact:** ${this.capitalize(component.semanticDescription.visualImpact)}`);
    lines.push(`- **Complexity:** ${this.capitalize(component.semanticDescription.complexity)}`);
    lines.push('');

    // Slot Affinity
    lines.push('### Slot Affinity');
    lines.push('');
    lines.push('| Slot | Affinity | Recommendation |');
    lines.push('|------|----------|----------------|');

    for (const [slot, affinity] of Object.entries(component.slotAffinity)) {
      const recommendation = this.getAffinityRecommendation(affinity);
      lines.push(`| ${slot} | ${affinity.toFixed(2)} | ${recommendation} |`);
    }

    lines.push('');

    // Constraints
    lines.push('### Constraints');
    lines.push('');

    if (component.constraints.excludedSlots && component.constraints.excludedSlots.length > 0) {
      lines.push(`- **Excluded Slots:** ${component.constraints.excludedSlots.join(', ')}`);
    } else {
      lines.push('- **Excluded Slots:** None');
    }

    if (component.constraints.requires && component.constraints.requires.length > 0) {
      lines.push(`- **Requires:** ${component.constraints.requires.join(', ')}`);
    } else {
      lines.push('- **Requires:** None');
    }

    if (component.constraints.conflictsWith && component.constraints.conflictsWith.length > 0) {
      lines.push(`- **Conflicts With:** ${component.constraints.conflictsWith.join(', ')}`);
    } else {
      lines.push('- **Conflicts With:** None');
    }

    return lines;
  }

  /**
   * Gets recommendation text based on affinity score
   *
   * @param affinity - Affinity score (0.0-1.0)
   * @returns Recommendation text
   */
  private getAffinityRecommendation(affinity: number): string {
    if (affinity >= 0.9) return 'Highly Recommended';
    if (affinity >= 0.7) return 'Recommended';
    if (affinity >= 0.5) return 'Suitable';
    if (affinity > 0.0) return 'Possible';
    return 'Not Recommended';
  }

  /**
   * Capitalizes first letter of string
   *
   * @param str - String to capitalize
   * @returns Capitalized string
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
