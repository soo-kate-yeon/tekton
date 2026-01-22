/**
 * Semantic Scoring Algorithm
 * TAG: SPEC-LAYER3-001 Section 5.4
 *
 * Calculates optimal component placement scores using weighted factors
 * Score = (BaseAffinity * 0.5) + (IntentMatch * 0.3) + (ContextPenalty * 0.2)
 */

import type {
  ScoringInput,
  ScoringResult,
  ScoringBreakdown,
} from "./scoring.types.js";

import {
  SCORING_WEIGHTS,
  DEFAULT_AFFINITY,
  INTENT_MATCH_BASELINE,
  NO_PENALTY,
  INTENT_MODE_ADJUSTMENTS,
  KEYWORD_MATCH_BONUS,
  CONTEXT_PENALTIES,
} from "./scoring.types.js";

/**
 * SemanticScorer - Main scoring algorithm implementation
 * SPEC-LAYER3-001 Section 5.4
 */
export class SemanticScorer {
  /**
   * Calculate the semantic score for a component in a target slot
   *
   * @param input - Scoring input containing component, slot, intent, and context
   * @returns Scoring result with final score and breakdown
   */
  calculateScore(input: ScoringInput): ScoringResult {
    const reasons: string[] = [];

    // Calculate base affinity (weight: 0.5)
    const baseAffinity = this.calculateBaseAffinity(input);

    // Calculate intent match (weight: 0.3)
    const intentResult = this.calculateIntentMatch(input);
    const intentMatch = intentResult.score;
    reasons.push(...intentResult.reasons);

    // Calculate context penalty (weight: 0.2)
    const contextResult = this.calculateContextPenalty(input);
    const contextPenalty = contextResult.score;
    reasons.push(...contextResult.reasons);

    // Apply formula: Score = (BaseAffinity * 0.5) + (IntentMatch * 0.3) + (ContextPenalty * 0.2)
    const rawScore =
      baseAffinity * SCORING_WEIGHTS.BASE_AFFINITY +
      intentMatch * SCORING_WEIGHTS.INTENT_MATCH +
      contextPenalty * SCORING_WEIGHTS.CONTEXT_PENALTY;

    // Clamp to valid range
    const finalScore = this.clampScore(rawScore);

    const breakdown: ScoringBreakdown = {
      baseAffinity,
      intentMatch,
      contextPenalty,
      finalScore,
    };

    return {
      componentName: input.component.name,
      targetSlot: input.targetSlot,
      score: finalScore,
      breakdown,
      reasons,
    };
  }

  /**
   * Calculate base affinity score from component.slotAffinity
   * Weight: 0.5
   *
   * @param input - Scoring input
   * @returns Base affinity score (0.0 to 1.0)
   */
  calculateBaseAffinity(input: ScoringInput): number {
    const { component, targetSlot } = input;
    const affinity = component.slotAffinity[targetSlot];

    // Return the affinity value if defined, otherwise use default
    if (affinity !== undefined) {
      return affinity;
    }

    return DEFAULT_AFFINITY;
  }

  /**
   * Calculate intent match score based on mode and keywords
   * Weight: 0.3
   *
   * @param input - Scoring input
   * @returns Intent match score and reasons
   */
  calculateIntentMatch(input: ScoringInput): {
    score: number;
    reasons: string[];
  } {
    const { component, intent } = input;
    const reasons: string[] = [];
    let score = INTENT_MATCH_BASELINE;

    // Get mode adjustment for the component category
    const modeAdjustments = INTENT_MODE_ADJUSTMENTS[intent.mode];
    const categoryAdjustment = modeAdjustments[component.category] ?? 0;

    if (categoryAdjustment !== 0) {
      score += categoryAdjustment;
      const direction = categoryAdjustment > 0 ? "boost" : "penalty";
      reasons.push(
        `${intent.mode} mode ${direction} for ${component.category} category: ${categoryAdjustment > 0 ? "+" : ""}${categoryAdjustment}`,
      );
    }

    // Calculate keyword bonus
    const purpose = component.semanticDescription.purpose;
    let matchCount = 0;

    for (const keyword of intent.keywords) {
      if (this.matchesKeyword(keyword, purpose)) {
        matchCount++;
      }
    }

    if (matchCount > 0) {
      const keywordBonus = matchCount * KEYWORD_MATCH_BONUS;
      score += keywordBonus;
      reasons.push(`Keyword matches (${matchCount}): +${keywordBonus}`);
    }

    return { score, reasons };
  }

  /**
   * Calculate context penalty based on conflicts and constraints
   * Weight: 0.2
   *
   * @param input - Scoring input
   * @returns Context penalty score and reasons
   */
  calculateContextPenalty(input: ScoringInput): {
    score: number;
    reasons: string[];
  } {
    const { component, context } = input;
    const reasons: string[] = [];
    let score = NO_PENALTY;

    // Get constraints, handling undefined case
    const constraints = component.constraints ?? {};
    const conflictsWith = constraints.conflictsWith ?? [];

    // Check for conflicts with siblings
    if (
      this.hasConflictWithSiblings(conflictsWith, context.siblingComponents)
    ) {
      score += CONTEXT_PENALTIES.CONFLICT_WITH_SIBLING;
      const conflictingComponents = conflictsWith.filter((c) =>
        context.siblingComponents.includes(c),
      );
      reasons.push(
        `Conflict with sibling components: ${conflictingComponents.join(", ")} (${CONTEXT_PENALTIES.CONFLICT_WITH_SIBLING})`,
      );
    }

    // Check for category mismatch with slot constraints
    if (
      !this.categoryMatchesConstraints(
        component.category,
        context.slotConstraints,
      )
    ) {
      score += CONTEXT_PENALTIES.CATEGORY_MISMATCH;
      reasons.push(
        `Category mismatch: ${component.category} not in slot constraints [${context.slotConstraints.join(", ")}] (${CONTEXT_PENALTIES.CATEGORY_MISMATCH})`,
      );
    }

    return { score, reasons };
  }

  /**
   * Clamp a score to the valid range [0.0, 1.0]
   *
   * @param score - Raw score
   * @returns Clamped score
   */
  clampScore(score: number): number {
    return Math.max(0.0, Math.min(1.0, score));
  }

  /**
   * Check if a keyword matches the component's semantic purpose
   *
   * @param keyword - Keyword to match
   * @param purpose - Component's semantic description purpose
   * @returns True if keyword matches
   */
  matchesKeyword(keyword: string, purpose: string): boolean {
    return purpose.toLowerCase().includes(keyword.toLowerCase());
  }

  /**
   * Check if component conflicts with any sibling components
   *
   * @param componentConflicts - Component's conflictsWith array
   * @param siblingComponents - Sibling component names
   * @returns True if there is a conflict
   */
  hasConflictWithSiblings(
    componentConflicts: string[],
    siblingComponents: string[],
  ): boolean {
    if (componentConflicts.length === 0 || siblingComponents.length === 0) {
      return false;
    }

    return componentConflicts.some((conflict) =>
      siblingComponents.includes(conflict),
    );
  }

  /**
   * Check if component category matches slot constraints
   *
   * @param category - Component category
   * @param slotConstraints - Slot constraint tags
   * @returns True if category matches constraints
   */
  categoryMatchesConstraints(
    category: string,
    slotConstraints: string[],
  ): boolean {
    // Empty constraints means no restrictions
    if (slotConstraints.length === 0) {
      return true;
    }

    return slotConstraints.includes(category);
  }
}
