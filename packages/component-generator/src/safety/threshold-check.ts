/**
 * Threshold Check
 * TAG: SPEC-LAYER3-001 Section 5.5.1
 *
 * Enforces minimum score threshold (≥ 0.4) for component placement
 */

import {
  SCORE_THRESHOLD,
  SAFETY_ERROR_CODES,
  type ThresholdCheckResult,
} from "./safety.types.js";

/**
 * ThresholdChecker - Validates scores against minimum threshold
 * SPEC-LAYER3-001 Section 5.5.1
 */
export class ThresholdChecker {
  /**
   * Check if a score meets the minimum threshold
   *
   * @param score - Score to validate (0.0 to 1.0)
   * @returns Threshold check result with pass/fail status
   */
  checkThreshold(score: number): ThresholdCheckResult {
    const passes = score >= SCORE_THRESHOLD;

    if (!passes) {
      return {
        passes: false,
        score,
        warning: `Score ${score} below threshold ${SCORE_THRESHOLD}. Consider using fluid fallback mechanism.`,
        errorCode: SAFETY_ERROR_CODES.BELOW_THRESHOLD,
      };
    }

    return {
      passes: true,
      score,
    };
  }

  /**
   * Get the configured threshold value
   *
   * @returns Current threshold value
   */
  getThreshold(): number {
    return SCORE_THRESHOLD;
  }

  /**
   * Quick check if score is acceptable
   *
   * @param score - Score to validate
   * @returns True if score meets threshold
   */
  isScoreAcceptable(score: number): boolean {
    return score >= SCORE_THRESHOLD;
  }
}
