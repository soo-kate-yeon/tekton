import { describe, it, expect } from 'vitest';
import {
  calculateContrastRatio,
  checkWCAGCompliance,
  getContrastResult,
  getComplianceBadge,
  getComplianceColorClass,
  WCAG_THRESHOLDS,
} from '@/lib/token-editor/contrast-calculator';
import type { ColorToken } from '@tekton/token-contract';

describe('contrast-calculator', () => {
  // Test colors
  const white: ColorToken = { l: 1, c: 0, h: 0 };
  const black: ColorToken = { l: 0, c: 0, h: 0 };
  const midGray: ColorToken = { l: 0.5, c: 0, h: 0 };

  describe('calculateContrastRatio', () => {
    it('returns 21:1 for black on white', () => {
      const ratio = calculateContrastRatio(black, white);
      expect(ratio).toBeGreaterThanOrEqual(20);
    });

    it('returns 1:1 for same colors', () => {
      const ratio = calculateContrastRatio(white, white);
      expect(ratio).toBe(1);
    });

    it('returns same ratio regardless of order', () => {
      const ratio1 = calculateContrastRatio(black, white);
      const ratio2 = calculateContrastRatio(white, black);
      expect(ratio1).toBe(ratio2);
    });
  });

  describe('checkWCAGCompliance', () => {
    it('returns AAA for ratio >= 7', () => {
      const result = checkWCAGCompliance(7.5);
      expect(result.level).toBe('AAA');
      expect(result.passesAAA).toBe(true);
      expect(result.passesAA).toBe(true);
    });

    it('returns AA for ratio >= 4.5 and < 7', () => {
      const result = checkWCAGCompliance(5.0);
      expect(result.level).toBe('AA');
      expect(result.passesAAA).toBe(false);
      expect(result.passesAA).toBe(true);
    });

    it('returns FAIL for ratio < 4.5', () => {
      const result = checkWCAGCompliance(3.0);
      expect(result.level).toBe('FAIL');
      expect(result.passesAA).toBe(false);
      expect(result.passesAALarge).toBe(true); // 3:1 passes AA Large
    });

    it('checks AA Large threshold (3:1)', () => {
      const result = checkWCAGCompliance(3.5);
      expect(result.passesAALarge).toBe(true);
    });
  });

  describe('getContrastResult', () => {
    it('combines ratio calculation and compliance check', () => {
      const result = getContrastResult(black, white);

      expect(result.ratio).toBeGreaterThanOrEqual(20);
      expect(result.level).toBe('AAA');
      expect(result.passesAA).toBe(true);
      expect(result.passesAAA).toBe(true);
    });

    it('returns appropriate level for mid contrast', () => {
      const result = getContrastResult(midGray, white);

      expect(result.ratio).toBeGreaterThan(1);
      expect(result.ratio).toBeLessThan(21);
    });
  });

  describe('getComplianceBadge', () => {
    it('returns AAA for AAA passing result', () => {
      const result = { ratio: 8, level: 'AAA' as const, passesAA: true, passesAAA: true, passesAALarge: true, passesAAALarge: true };
      expect(getComplianceBadge(result)).toBe('AAA');
    });

    it('returns AA for AA passing result', () => {
      const result = { ratio: 5, level: 'AA' as const, passesAA: true, passesAAA: false, passesAALarge: true, passesAAALarge: true };
      expect(getComplianceBadge(result)).toBe('AA');
    });

    it('returns AA Large for only large text passing', () => {
      const result = { ratio: 3.5, level: 'FAIL' as const, passesAA: false, passesAAA: false, passesAALarge: true, passesAAALarge: false };
      expect(getComplianceBadge(result)).toBe('AA Large');
    });

    it('returns Fail for failing result', () => {
      const result = { ratio: 2, level: 'FAIL' as const, passesAA: false, passesAAA: false, passesAALarge: false, passesAAALarge: false };
      expect(getComplianceBadge(result)).toBe('Fail');
    });
  });

  describe('getComplianceColorClass', () => {
    it('returns green class for AAA', () => {
      const result = { ratio: 8, level: 'AAA' as const, passesAA: true, passesAAA: true, passesAALarge: true, passesAAALarge: true };
      expect(getComplianceColorClass(result)).toContain('green');
    });

    it('returns blue class for AA', () => {
      const result = { ratio: 5, level: 'AA' as const, passesAA: true, passesAAA: false, passesAALarge: true, passesAAALarge: true };
      expect(getComplianceColorClass(result)).toContain('blue');
    });

    it('returns red class for fail', () => {
      const result = { ratio: 2, level: 'FAIL' as const, passesAA: false, passesAAA: false, passesAALarge: false, passesAAALarge: false };
      expect(getComplianceColorClass(result)).toContain('red');
    });
  });

  describe('WCAG_THRESHOLDS', () => {
    it('has correct AA normal threshold', () => {
      expect(WCAG_THRESHOLDS.AA_NORMAL).toBe(4.5);
    });

    it('has correct AA large threshold', () => {
      expect(WCAG_THRESHOLDS.AA_LARGE).toBe(3.0);
    });

    it('has correct AAA normal threshold', () => {
      expect(WCAG_THRESHOLDS.AAA_NORMAL).toBe(7.0);
    });

    it('has correct AAA large threshold', () => {
      expect(WCAG_THRESHOLDS.AAA_LARGE).toBe(4.5);
    });
  });
});
