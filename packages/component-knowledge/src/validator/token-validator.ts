/**
 * Token Validator
 * TAG: SPEC-LAYER2-001
 *
 * Validates token references against Layer 1 metadata
 * REQ-LAYER2-001: Validate all referenced tokens exist in Layer 1 metadata
 */

import type {
  Layer1TokenMetadata,
  TokenBindings,
  ComponentKnowledge,
  ValidationResult,
} from '../types/knowledge.types.js';

/**
 * TokenValidator validates token references against Layer 1 metadata
 */
export class TokenValidator {
  private tokenNames: Set<string>;

  constructor(layer1Metadata: Layer1TokenMetadata) {
    this.tokenNames = new Set(layer1Metadata.tokens.map(t => t.name));
  }

  /**
   * Validates a single token reference
   *
   * @param tokenName - Token name to validate
   * @returns Validation result with suggestions if invalid
   */
  validateToken(tokenName: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!this.tokenNames.has(tokenName)) {
      errors.push(`Token '${tokenName}' not found in Layer 1 metadata`);

      // Provide suggestions for typos
      const suggestions = this.suggestSimilarTokens(tokenName);
      if (suggestions.length > 0) {
        warnings.push(`Did you mean: ${suggestions.join(', ')}?`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validates all token references in a TokenBindings object
   *
   * @param bindings - TokenBindings to validate
   * @returns Validation result
   */
  validateTokenBindings(bindings: TokenBindings): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const [property, tokenName] of Object.entries(bindings)) {
      if (tokenName) {
        const result = this.validateToken(tokenName);
        if (!result.valid) {
          errors.push(`Property '${property}': ${result.errors.join(', ')}`);
          warnings.push(...result.warnings);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Resolves all unique token references from ComponentKnowledge
   *
   * @param knowledge - ComponentKnowledge entry
   * @returns Array of unique token names referenced
   */
  resolveTokenReferences(knowledge: ComponentKnowledge): string[] {
    const references = new Set<string>();

    // Collect from all states
    for (const stateBindings of Object.values(knowledge.tokenBindings.states)) {
      for (const tokenName of Object.values(stateBindings)) {
        if (tokenName) {
          references.add(tokenName);
        }
      }
    }

    // Collect from variants
    if (knowledge.tokenBindings.variants) {
      for (const variantStates of Object.values(knowledge.tokenBindings.variants)) {
        for (const stateBindings of Object.values(variantStates)) {
          if (stateBindings) {
            for (const tokenName of Object.values(stateBindings)) {
              if (tokenName) {
                references.add(tokenName);
              }
            }
          }
        }
      }
    }

    return Array.from(references).sort();
  }

  /**
   * Suggests similar token names using Levenshtein distance
   *
   * @param input - Token name to find suggestions for
   * @returns Array of up to 3 similar token names
   */
  suggestSimilarTokens(input: string): string[] {
    const suggestions: Array<{ name: string; distance: number }> = [];

    for (const tokenName of this.tokenNames) {
      const distance = this.levenshteinDistance(input, tokenName);
      // Only suggest if distance is small enough (max 3 edits)
      if (distance <= 3) {
        suggestions.push({ name: tokenName, distance });
      }
    }

    // Sort by distance and return top 3
    return suggestions
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
      .map(s => s.name);
  }

  /**
   * Calculates Levenshtein distance between two strings
   *
   * @param a - First string
   * @param b - Second string
   * @returns Edit distance
   */
  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }
}
