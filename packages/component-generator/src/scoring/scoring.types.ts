/**
 * Scoring Type Definitions
 * TAG: SPEC-LAYER3-001 Section 5.4
 *
 * Types for the Semantic Scoring Algorithm
 */

import type {
  ComponentKnowledge,
  ComponentCategory,
} from "@tekton/component-knowledge";

/**
 * Blueprint intent modes defining the purpose of the generated layout
 */
export type IntentMode =
  | "read-only"
  | "interactive"
  | "data-entry"
  | "dashboard";

/**
 * Complexity levels for layout generation
 */
export type IntentComplexity = "simple" | "moderate" | "complex";

/**
 * Blueprint Intent - Defines the purpose and characteristics of the target layout
 * SPEC-LAYER3-001 Section 5.4
 */
export interface BlueprintIntent {
  /**
   * The primary mode of the layout
   * - read-only: Display-focused layouts (reports, articles)
   * - interactive: Action-heavy layouts (forms with actions)
   * - data-entry: Input-focused layouts (forms, wizards)
   * - dashboard: Data visualization layouts
   */
  mode: IntentMode;

  /**
   * Keywords that describe the layout purpose
   * Used for matching against component semanticDescription.purpose
   */
  keywords: string[];

  /**
   * Complexity level affecting component selection
   */
  complexity: IntentComplexity;
}

/**
 * Scoring Context - Environmental factors for score calculation
 * SPEC-LAYER3-001 Section 5.4
 */
export interface ScoringContext {
  /**
   * Components already placed in sibling slots
   * Used for conflict detection
   */
  siblingComponents: string[];

  /**
   * Constraint tags from the target slot definition
   * Used for category matching
   */
  slotConstraints: string[];

  /**
   * Additional requirements for this slot
   */
  requirements: string[];
}

/**
 * Input for the Semantic Scoring Algorithm
 * SPEC-LAYER3-001 Section 5.4
 */
export interface ScoringInput {
  /**
   * Component knowledge from Layer 2
   */
  component: ComponentKnowledge;

  /**
   * Target slot identifier
   */
  targetSlot: string;

  /**
   * Blueprint intent defining the layout purpose
   */
  intent: BlueprintIntent;

  /**
   * Environmental context for scoring
   */
  context: ScoringContext;
}

/**
 * Detailed scoring breakdown
 */
export interface ScoringBreakdown {
  /**
   * Base affinity score (weight: 0.5)
   * From component.slotAffinity[targetSlot]
   */
  baseAffinity: number;

  /**
   * Intent match score (weight: 0.3)
   * Based on mode, category, and keyword matching
   */
  intentMatch: number;

  /**
   * Context penalty score (weight: 0.2)
   * Based on conflicts and constraint violations
   */
  contextPenalty: number;

  /**
   * Final calculated score
   */
  finalScore: number;
}

/**
 * Result of semantic scoring
 */
export interface ScoringResult {
  /**
   * Component name
   */
  componentName: string;

  /**
   * Target slot
   */
  targetSlot: string;

  /**
   * Final clamped score (0.0 to 1.0)
   */
  score: number;

  /**
   * Detailed score breakdown
   */
  breakdown: ScoringBreakdown;

  /**
   * Reasons for score adjustments
   */
  reasons: string[];
}

/**
 * Weights for the scoring formula
 * Score = (BaseAffinity * 0.5) + (IntentMatch * 0.3) + (ContextPenalty * 0.2)
 */
export const SCORING_WEIGHTS = {
  BASE_AFFINITY: 0.5,
  INTENT_MATCH: 0.3,
  CONTEXT_PENALTY: 0.2,
} as const;

/**
 * Intent mode score adjustments
 */
export const INTENT_MODE_ADJUSTMENTS: Record<
  IntentMode,
  Partial<Record<ComponentCategory, number>>
> = {
  "read-only": {
    action: -0.3,
  },
  interactive: {
    action: 0.2,
  },
  "data-entry": {
    input: 0.2,
  },
  dashboard: {
    display: 0.2,
  },
};

/**
 * Keyword match bonus per match
 */
export const KEYWORD_MATCH_BONUS = 0.1;

/**
 * Context penalty values
 */
export const CONTEXT_PENALTIES = {
  CONFLICT_WITH_SIBLING: -0.5,
  CATEGORY_MISMATCH: -0.3,
} as const;

/**
 * Default affinity score when slot is not in affinity map
 */
export const DEFAULT_AFFINITY = 0.5;

/**
 * Intent match baseline score
 */
export const INTENT_MATCH_BASELINE = 0.5;

/**
 * No penalty score (full context score)
 */
export const NO_PENALTY = 1.0;
