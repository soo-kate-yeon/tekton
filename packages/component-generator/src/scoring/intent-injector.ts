/**
 * Intent Injector
 * TAG: SPEC-LAYER3-001 Section 5.4
 *
 * Provides intent-based score adjustments for the Semantic Scoring Algorithm
 */

import type {
  BlueprintIntent,
  IntentMode,
  ScoringContext,
} from "./scoring.types.js";

import type { ComponentCategory } from "@tekton/component-knowledge";

import {
  INTENT_MODE_ADJUSTMENTS,
  KEYWORD_MATCH_BONUS,
  INTENT_MATCH_BASELINE,
} from "./scoring.types.js";

/**
 * IntentInjector - Calculates intent-based score adjustments
 * SPEC-LAYER3-001 Section 5.4
 */
export class IntentInjector {
  /**
   * Get the mode adjustment for a component category
   *
   * @param mode - Blueprint intent mode
   * @param category - Component category
   * @returns Score adjustment value
   */
  getModeAdjustment(mode: IntentMode, category: ComponentCategory): number {
    const adjustments = INTENT_MODE_ADJUSTMENTS[mode];
    return adjustments[category] ?? 0;
  }

  /**
   * Calculate keyword match bonus
   *
   * @param keywords - Intent keywords
   * @param purpose - Component semantic description purpose
   * @returns Total keyword bonus
   */
  calculateKeywordBonus(keywords: string[], purpose: string): number {
    const lowerPurpose = purpose.toLowerCase();
    let matchCount = 0;

    for (const keyword of keywords) {
      if (lowerPurpose.includes(keyword.toLowerCase())) {
        matchCount++;
      }
    }

    return matchCount * KEYWORD_MATCH_BONUS;
  }

  /**
   * Calculate the complete intent match score
   *
   * @param intent - Blueprint intent
   * @param category - Component category
   * @param purpose - Component semantic description purpose
   * @returns Intent match score and reasons
   */
  calculateIntentScore(
    intent: BlueprintIntent,
    category: ComponentCategory,
    purpose: string,
  ): { score: number; reasons: string[] } {
    const reasons: string[] = [];
    let score = INTENT_MATCH_BASELINE;

    // Apply mode adjustment
    const modeAdjustment = this.getModeAdjustment(intent.mode, category);
    if (modeAdjustment !== 0) {
      score += modeAdjustment;
      const direction = modeAdjustment > 0 ? "boost" : "penalty";
      reasons.push(
        `${intent.mode} mode ${direction} for ${category} category: ${modeAdjustment > 0 ? "+" : ""}${modeAdjustment}`,
      );
    }

    // Apply keyword bonus
    const keywordBonus = this.calculateKeywordBonus(intent.keywords, purpose);
    if (keywordBonus > 0) {
      score += keywordBonus;
      const matchCount = keywordBonus / KEYWORD_MATCH_BONUS;
      reasons.push(`Keyword matches (${matchCount}): +${keywordBonus}`);
    }

    return { score, reasons };
  }

  /**
   * Create a default BlueprintIntent
   *
   * @param mode - Intent mode
   * @returns Default BlueprintIntent with empty keywords and simple complexity
   */
  static createDefaultIntent(mode: IntentMode): BlueprintIntent {
    return {
      mode,
      keywords: [],
      complexity: "simple",
    };
  }

  /**
   * Create a BlueprintIntent with keywords
   *
   * @param mode - Intent mode
   * @param keywords - Keywords for matching
   * @param complexity - Complexity level
   * @returns BlueprintIntent
   */
  static createIntent(
    mode: IntentMode,
    keywords: string[],
    complexity: "simple" | "moderate" | "complex" = "simple",
  ): BlueprintIntent {
    return {
      mode,
      keywords,
      complexity,
    };
  }

  /**
   * Create a default ScoringContext
   *
   * @returns Empty ScoringContext
   */
  static createDefaultContext(): ScoringContext {
    return {
      siblingComponents: [],
      slotConstraints: [],
      requirements: [],
    };
  }
}
