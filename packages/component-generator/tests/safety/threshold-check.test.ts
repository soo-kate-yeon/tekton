/**
 * Threshold Check Tests
 * TAG: SPEC-LAYER3-001 Section 5.5.1
 *
 * Tests for score threshold enforcement (≥ 0.4)
 */

import { describe, it, expect } from 'vitest';
import { ThresholdChecker } from '../../src/safety/threshold-check';
import { SCORE_THRESHOLD, SAFETY_ERROR_CODES } from '../../src/safety/safety.types';

describe('ThresholdChecker', () => {
  const checker = new ThresholdChecker();

  describe('checkThreshold', () => {
    it('should pass for score exactly at threshold (0.4)', () => {
      const result = checker.checkThreshold(0.4);

      expect(result.passes).toBe(true);
      expect(result.score).toBe(0.4);
      expect(result.warning).toBeUndefined();
      expect(result.errorCode).toBeUndefined();
    });

    it('should pass for score above threshold', () => {
      const result = checker.checkThreshold(0.75);

      expect(result.passes).toBe(true);
      expect(result.score).toBe(0.75);
      expect(result.warning).toBeUndefined();
      expect(result.errorCode).toBeUndefined();
    });

    it('should pass for maximum score (1.0)', () => {
      const result = checker.checkThreshold(1.0);

      expect(result.passes).toBe(true);
      expect(result.score).toBe(1.0);
      expect(result.warning).toBeUndefined();
      expect(result.errorCode).toBeUndefined();
    });

    it('should fail for score below threshold', () => {
      const result = checker.checkThreshold(0.3);

      expect(result.passes).toBe(false);
      expect(result.score).toBe(0.3);
      expect(result.warning).toBeDefined();
      expect(result.warning).toContain('Score 0.3 below threshold');
      expect(result.errorCode).toBe(SAFETY_ERROR_CODES.BELOW_THRESHOLD);
    });

    it('should fail for very low score (0.0)', () => {
      const result = checker.checkThreshold(0.0);

      expect(result.passes).toBe(false);
      expect(result.score).toBe(0.0);
      expect(result.warning).toBeDefined();
      expect(result.errorCode).toBe(SAFETY_ERROR_CODES.BELOW_THRESHOLD);
    });

    it('should fail for slightly below threshold (0.39)', () => {
      const result = checker.checkThreshold(0.39);

      expect(result.passes).toBe(false);
      expect(result.score).toBe(0.39);
      expect(result.warning).toContain('0.39');
      expect(result.warning).toContain('0.4');
      expect(result.errorCode).toBe(SAFETY_ERROR_CODES.BELOW_THRESHOLD);
    });

    it('should handle edge case near threshold', () => {
      const result = checker.checkThreshold(0.4001);

      expect(result.passes).toBe(true);
      expect(result.score).toBeCloseTo(0.4001, 4);
      expect(result.warning).toBeUndefined();
    });

    it('should include threshold value in warning message', () => {
      const result = checker.checkThreshold(0.2);

      expect(result.warning).toContain('0.4');
      expect(result.warning).toContain('threshold');
    });

    it('should suggest Fluid Fallback in warning message', () => {
      const result = checker.checkThreshold(0.1);

      expect(result.warning).toContain('fallback');
    });
  });

  describe('getThreshold', () => {
    it('should return the configured threshold value', () => {
      const threshold = checker.getThreshold();

      expect(threshold).toBe(SCORE_THRESHOLD);
      expect(threshold).toBe(0.4);
    });
  });

  describe('isScoreAcceptable', () => {
    it('should return true for acceptable scores', () => {
      expect(checker.isScoreAcceptable(0.4)).toBe(true);
      expect(checker.isScoreAcceptable(0.5)).toBe(true);
      expect(checker.isScoreAcceptable(1.0)).toBe(true);
    });

    it('should return false for unacceptable scores', () => {
      expect(checker.isScoreAcceptable(0.0)).toBe(false);
      expect(checker.isScoreAcceptable(0.3)).toBe(false);
      expect(checker.isScoreAcceptable(0.39)).toBe(false);
    });

    it('should handle boundary cases precisely', () => {
      expect(checker.isScoreAcceptable(0.4)).toBe(true);
      expect(checker.isScoreAcceptable(0.3999999)).toBe(false);
      expect(checker.isScoreAcceptable(0.4000001)).toBe(true);
    });
  });
});
