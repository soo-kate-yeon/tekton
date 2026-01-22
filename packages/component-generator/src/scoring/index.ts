/**
 * Scoring Module Exports
 * TAG: SPEC-LAYER3-001 Section 5.4
 */

// Type exports
export type {
  BlueprintIntent,
  IntentMode,
  IntentComplexity,
  ScoringContext,
  ScoringInput,
  ScoringResult,
  ScoringBreakdown,
} from "./scoring.types.js";

// Constants exports
export {
  SCORING_WEIGHTS,
  DEFAULT_AFFINITY,
  INTENT_MATCH_BASELINE,
  NO_PENALTY,
  INTENT_MODE_ADJUSTMENTS,
  KEYWORD_MATCH_BONUS,
  CONTEXT_PENALTIES,
} from "./scoring.types.js";

// Class exports
export { SemanticScorer } from "./semantic-scorer.js";
export { IntentInjector } from "./intent-injector.js";
