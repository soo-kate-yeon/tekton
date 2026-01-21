/**
 * Hallucination Check
 * TAG: SPEC-LAYER3-001 Section 5.5.2
 *
 * Validates component names against Layer 2 catalog with fuzzy matching
 */

import {
  COMPONENT_CATALOG,
  getComponentByName,
} from "@tekton/component-knowledge";
import {
  SAFETY_ERROR_CODES,
  type HallucinationCheckResult,
} from "./safety.types";

/**
 * HallucinationChecker - Validates component existence in catalog
 * SPEC-LAYER3-001 Section 5.5.2
 */
export class HallucinationChecker {
  /**
   * Check if a component name exists in the Layer 2 catalog
   *
   * @param componentName - Component name to validate
   * @returns Hallucination check result with validity and suggestions
   */
  checkComponent(componentName: string): HallucinationCheckResult {
    // Add null/undefined check BEFORE trim()
    if (!componentName || typeof componentName !== 'string') {
      return {
        isValid: false,
        componentName: componentName || '<undefined>',
        error: 'Component name is required',
        errorCode: SAFETY_ERROR_CODES.HALLUCINATION,
      };
    }

    // Trim whitespace for comparison
    const trimmedName = componentName.trim();

    // Empty string check (after trim, so both '' and '   ' are handled)
    if (trimmedName === '') {
      return {
        isValid: false,
        componentName,
        error: 'Component name cannot be empty',
        errorCode: SAFETY_ERROR_CODES.HALLUCINATION,
      };
    }

    // Check if component exists in catalog
    const component = getComponentByName(trimmedName);

    if (component) {
      return {
        isValid: true,
        componentName,
      };
    }

    // Component not found - generate suggestions
    const suggestions = this.getSuggestions(trimmedName, 3);

    return {
      isValid: false,
      componentName,
      error: `Component "${componentName}" not found in catalog. Available components: ${this.getAllComponentNames().join(", ")}`,
      errorCode: SAFETY_ERROR_CODES.HALLUCINATION,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    };
  }

  /**
   * Get fuzzy match suggestions for a component name
   *
   * @param componentName - Component name to match
   * @param maxSuggestions - Maximum number of suggestions to return
   * @returns Array of suggested component names
   */
  getSuggestions(componentName: string, maxSuggestions: number = 3): string[] {
    const allComponents = COMPONENT_CATALOG.map((c) => c.name);
    const distances: Array<{ name: string; distance: number }> = [];

    for (const name of allComponents) {
      const distance = this.calculateLevenshteinDistance(
        componentName.toLowerCase(),
        name.toLowerCase(),
      );
      distances.push({ name, distance });
    }

    // Sort by distance (closest first) and filter by threshold
    // For very short strings (1-3 chars), allow more distance
    const maxDistance =
      componentName.length <= 3
        ? 3
        : Math.min(4, Math.ceil(componentName.length / 2));

    const suggestions = distances
      .filter((d) => d.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, maxSuggestions)
      .map((d) => d.name);

    return suggestions;
  }

  /**
   * Check if a component name is valid
   *
   * @param componentName - Component name to validate
   * @returns True if component exists in catalog
   */
  isComponentValid(componentName: string): boolean {
    // Add null/undefined check BEFORE trim()
    if (!componentName || typeof componentName !== 'string') {
      return false;
    }

    const trimmedName = componentName.trim();
    if (trimmedName === '') {
      return false;
    }

    return getComponentByName(trimmedName) !== undefined;
  }

  /**
   * Get all component names from the catalog
   *
   * @returns Array of all component names
   */
  private getAllComponentNames(): string[] {
    return COMPONENT_CATALOG.map((c) => c.name);
  }

  /**
   * Calculate Levenshtein distance between two strings
   * Simple implementation without external dependencies
   *
   * @param str1 - First string
   * @param str2 - Second string
   * @returns Levenshtein distance
   */
  private calculateLevenshteinDistance(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;

    // Create a 2D array for dynamic programming
    const matrix: number[][] = Array(len1 + 1)
      .fill(null)
      .map(() => Array(len2 + 1).fill(0));

    // Initialize first column and row
    for (let i = 0; i <= len1; i++) {
      matrix[i][0] = i;
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + cost, // substitution
        );
      }
    }

    return matrix[len1][len2];
  }
}
