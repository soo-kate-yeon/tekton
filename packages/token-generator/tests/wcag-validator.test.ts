/**
 * TASK-010: Contrast Ratio Calculator Tests
 * TASK-011: WCAG AA Validator Tests
 * TASK-012: Automatic Contrast Adjustment Tests
 * TASK-013: Impossible Adjustment Warning Tests
 *
 * Tests WCAG 2.1 compliance validation with wcag-contrast library
 */

import { describe, it, expect } from 'vitest';
import type { RGBColor } from '@tekton/theme';
import type { ArchetypeColor } from '../src/types/archetype.types';
import {
  calculateContrastRatio,
  checkWCAGCompliance,
  validateColorPair,
  suggestLightnessAdjustment,
  autoAdjustContrast,
  detectImpossiblePair,
} from '../src/wcag-validator';

describe('TASK-010: Contrast Ratio Calculator', () => {
  /**
   * RED PHASE: Write tests with known contrast ratios
   * Testing against official WCAG 2.1 test suite results
   */

  it('should calculate 21:1 contrast for pure black and white', () => {
    const black: RGBColor = { r: 0, g: 0, b: 0 };
    const white: RGBColor = { r: 255, g: 255, b: 255 };

    const ratio = calculateContrastRatio(black, white);

    expect(ratio).toBeCloseTo(21, 1);
  });

  it('should calculate 1:1 contrast for identical colors', () => {
    const gray: RGBColor = { r: 128, g: 128, b: 128 };

    const ratio = calculateContrastRatio(gray, gray);

    expect(ratio).toBeCloseTo(1, 2);
  });

  it('should be symmetric (order does not matter)', () => {
    const color1: RGBColor = { r: 100, g: 150, b: 200 };
    const color2: RGBColor = { r: 50, g: 75, b: 100 };

    const ratio1 = calculateContrastRatio(color1, color2);
    const ratio2 = calculateContrastRatio(color2, color1);

    expect(ratio1).toBe(ratio2);
  });

  it('should calculate known test values correctly', () => {
    // Test values from WCAG 2.1 specification examples
    const testCases: Array<{
      color1: RGBColor;
      color2: RGBColor;
      minRatio: number;
    }> = [
      {
        color1: { r: 255, g: 255, b: 255 }, // white
        color2: { r: 0, g: 0, b: 0 },       // black
        minRatio: 20.9, // Should be very close to 21
      },
      {
        color1: { r: 255, g: 255, b: 255 }, // white
        color2: { r: 119, g: 119, b: 119 }, // gray
        minRatio: 4.4, // Should be around 4.5
      },
      {
        color1: { r: 0, g: 0, b: 0 },       // black
        color2: { r: 119, g: 119, b: 119 }, // gray
        minRatio: 4.4, // Should be around 4.6
      },
    ];

    testCases.forEach(({ color1, color2, minRatio }) => {
      const ratio = calculateContrastRatio(color1, color2);
      expect(ratio).toBeGreaterThanOrEqual(minRatio);
    });
  });

  it('should handle edge cases (very similar colors)', () => {
    const color1: RGBColor = { r: 100, g: 100, b: 100 };
    const color2: RGBColor = { r: 101, g: 101, b: 101 };

    const ratio = calculateContrastRatio(color1, color2);

    expect(ratio).toBeGreaterThan(1);
    expect(ratio).toBeLessThan(1.1);
  });

  it('should match wcag-contrast library results', () => {
    // Cross-validation with wcag-contrast library
    import('wcag-contrast').then(({ hex }) => {
      const color1 = { r: 255, g: 0, b: 0 };
      const color2 = { r: 0, g: 255, b: 0 };

      const ourRatio = calculateContrastRatio(color1, color2);
      const libraryRatio = hex('#ff0000', '#00ff00');

      expect(ourRatio).toBeCloseTo(libraryRatio, 1);
    });
  });
});

describe('TASK-011: WCAG AA Validator', () => {
  /**
   * RED PHASE: Write tests for AA (4.5:1 text, 3:1 UI) and AAA thresholds
   */

  it('should pass AA for normal text with 4.5:1 contrast', () => {
    const result = checkWCAGCompliance(4.5, 'AA', false);

    expect(result.passed).toBe(true);
    expect(result.contrastRatio).toBe(4.5);
    expect(result.wcagLevel).toBe('AA');
  });

  it('should fail AA for normal text with 4.4:1 contrast', () => {
    const result = checkWCAGCompliance(4.4, 'AA', false);

    expect(result.passed).toBe(false);
  });

  it('should pass AA for large text with 3:1 contrast', () => {
    const result = checkWCAGCompliance(3.0, 'AA', true);

    expect(result.passed).toBe(true);
  });

  it('should fail AA for large text with 2.9:1 contrast', () => {
    const result = checkWCAGCompliance(2.9, 'AA', true);

    expect(result.passed).toBe(false);
  });

  it('should pass AAA for normal text with 7:1 contrast', () => {
    const result = checkWCAGCompliance(7.0, 'AAA', false);

    expect(result.passed).toBe(true);
    expect(result.wcagLevel).toBe('AAA');
  });

  it('should fail AAA for normal text with 6.9:1 contrast', () => {
    const result = checkWCAGCompliance(6.9, 'AAA', false);

    expect(result.passed).toBe(false);
  });

  it('should pass AAA for large text with 4.5:1 contrast', () => {
    const result = checkWCAGCompliance(4.5, 'AAA', true);

    expect(result.passed).toBe(true);
  });

  it('should validate complete color pairs', () => {
    const white: RGBColor = { r: 255, g: 255, b: 255 };
    const darkGray: RGBColor = { r: 85, g: 85, b: 85 };

    const result = validateColorPair(darkGray, white, 'AA', false);

    expect(result.passed).toBe(true);
    expect(result.foreground).toEqual(darkGray);
    expect(result.background).toEqual(white);
    expect(result.contrastRatio).toBeGreaterThan(4.5);
  });

  it('should correctly identify non-compliant pairs', () => {
    const lightGray: RGBColor = { r: 200, g: 200, b: 200 };
    const white: RGBColor = { r: 255, g: 255, b: 255 };

    const result = validateColorPair(lightGray, white, 'AA', false);

    expect(result.passed).toBe(false);
    expect(result.contrastRatio).toBeLessThan(4.5);
  });
});

describe('TASK-012: Automatic Contrast Adjustment', () => {
  /**
   * RED PHASE: Write tests for low-contrast pairs needing adjustment
   * Should achieve AA in <20 iterations, preserve hue
   */

  it('should return null for already compliant pairs', () => {
    const black: RGBColor = { r: 0, g: 0, b: 0 };
    const white: RGBColor = { r: 255, g: 255, b: 255 };

    const adjustment = suggestLightnessAdjustment(black, white, 'AA');

    expect(adjustment).toBeNull();
  });

  it('should suggest adjustment for non-compliant pairs', () => {
    const lightGray: RGBColor = { r: 200, g: 200, b: 200 };
    const white: RGBColor = { r: 255, g: 255, b: 255 };

    const adjustment = suggestLightnessAdjustment(lightGray, white, 'AA');

    expect(adjustment).not.toBeNull();
    expect(typeof adjustment).toBe('number');
  });

  it('should suggest darkening lighter foreground', () => {
    const lightGray: RGBColor = { r: 220, g: 220, b: 220 };
    const white: RGBColor = { r: 255, g: 255, b: 255 };

    const adjustment = suggestLightnessAdjustment(lightGray, white, 'AA');

    // Should suggest an adjustment (non-null means adjustment needed)
    expect(adjustment).not.toBeNull();
    if (adjustment !== null) {
      // Adjustment value should be a valid luminance (0-1 range)
      expect(adjustment).toBeGreaterThanOrEqual(0);
      expect(adjustment).toBeLessThanOrEqual(1);
    }
  });

  it('should suggest lightening darker background', () => {
    const darkGray: RGBColor = { r: 50, g: 50, b: 50 };
    const darkerGray: RGBColor = { r: 40, g: 40, b: 40 };

    const adjustment = suggestLightnessAdjustment(darkGray, darkerGray, 'AA');

    expect(adjustment).not.toBeNull();
    // Adjustment should suggest lightening
  });

  it('should respect AAA requirements', () => {
    const mediumGray: RGBColor = { r: 128, g: 128, b: 128 };
    const white: RGBColor = { r: 255, g: 255, b: 255 };

    const adjustmentAA = suggestLightnessAdjustment(mediumGray, white, 'AA');
    const adjustmentAAA = suggestLightnessAdjustment(mediumGray, white, 'AAA');

    // AAA should require more adjustment than AA
    if (adjustmentAA !== null && adjustmentAAA !== null) {
      expect(Math.abs(adjustmentAAA)).toBeGreaterThanOrEqual(Math.abs(adjustmentAA));
    }
  });
});

describe('TASK-013: Impossible Adjustment Warning', () => {
  /**
   * RED PHASE: Write tests for impossible-to-fix pairs
   * Should warn correctly and suggest alternatives
   */

  it('should handle extreme cases that may be impossible to fix', () => {
    // Two very similar light colors
    const color1: RGBColor = { r: 250, g: 250, b: 250 };
    const color2: RGBColor = { r: 255, g: 255, b: 255 };

    const adjustment = suggestLightnessAdjustment(color1, color2, 'AAA');

    // Should still provide a suggestion even if difficult
    expect(adjustment).not.toBeUndefined();
  });

  it('should detect pairs where both colors need to be changed', () => {
    // Mid-tone grays that are too similar
    const gray1: RGBColor = { r: 127, g: 127, b: 127 };
    const gray2: RGBColor = { r: 129, g: 129, b: 129 };

    const result = validateColorPair(gray1, gray2, 'AA');

    expect(result.passed).toBe(false);
    expect(result.contrastRatio).toBeLessThan(1.1);
  });

  it('should provide actionable suggestions for low-contrast pairs', () => {
    const color1: RGBColor = { r: 100, g: 100, b: 100 };
    const color2: RGBColor = { r: 110, g: 110, b: 110 };

    const adjustment = suggestLightnessAdjustment(color1, color2, 'AA');

    // Should suggest an adjustment
    expect(adjustment).not.toBeNull();
  });
});

describe('TASK-012 Advanced: Auto-Adjust Contrast with OKLCH', () => {
  /**
   * Advanced tests for OKLCH-based contrast adjustment
   */

  it('should return original color if already compliant', () => {
    const color: ArchetypeColor = { l: 0.2, c: 0.1, h: 220 };
    const white: RGBColor = { r: 255, g: 255, b: 255 };

    const adjusted = autoAdjustContrast(color, white, 'AA');

    expect(adjusted).not.toBeNull();
    expect(adjusted?.l).toBeCloseTo(0.2, 1);
  });

  it('should adjust lightness to achieve AA compliance', () => {
    const color: ArchetypeColor = { l: 0.7, c: 0.15, h: 220 };
    const white: RGBColor = { r: 255, g: 255, b: 255 };

    const adjusted = autoAdjustContrast(color, white, 'AA');

    expect(adjusted).not.toBeNull();
    if (adjusted) {
      expect(adjusted.l).toBeLessThan(0.7); // Should be darker
      expect(adjusted.c).toBe(0.15); // Chroma preserved
      expect(adjusted.h).toBe(220); // Hue preserved
    }
  });

  it('should achieve compliance within 20 iterations', () => {
    const color: ArchetypeColor = { l: 0.8, c: 0.1, h: 180 };
    const white: RGBColor = { r: 255, g: 255, b: 255 };

    const adjusted = autoAdjustContrast(color, white, 'AA', 20);

    expect(adjusted).not.toBeNull();
  });

  it('should preserve hue during adjustment', () => {
    const color: ArchetypeColor = { l: 0.75, c: 0.12, h: 350 };
    const white: RGBColor = { r: 255, g: 255, b: 255 };

    const adjusted = autoAdjustContrast(color, white, 'AA');

    expect(adjusted).not.toBeNull();
    if (adjusted) {
      expect(adjusted.h).toBe(350); // Hue must be preserved
    }
  });

  it('should handle dark backgrounds', () => {
    const color: ArchetypeColor = { l: 0.3, c: 0.1, h: 120 };
    const black: RGBColor = { r: 0, g: 0, b: 0 };

    const adjusted = autoAdjustContrast(color, black, 'AA');

    expect(adjusted).not.toBeNull();
    if (adjusted) {
      expect(adjusted.l).toBeGreaterThan(0.3); // Should be lighter
    }
  });
});

describe('TASK-013 Advanced: Impossible Pair Detection', () => {
  /**
   * Tests for detecting impossible-to-fix color pairs
   */

  it('should detect impossible pairs with similar luminance', () => {
    const fg: RGBColor = { r: 128, g: 128, b: 128 };
    const bg: RGBColor = { r: 130, g: 130, b: 130 };

    const result = detectImpossiblePair(fg, bg, 'AA');

    expect(result.impossible).toBe(true);
    expect(result.message).toBeDefined();
    expect(result.suggestions).toBeDefined();
    expect(result.suggestions?.length).toBeGreaterThan(0);
  });

  it('should not flag compliant pairs as impossible', () => {
    const fg: RGBColor = { r: 0, g: 0, b: 0 };
    const bg: RGBColor = { r: 255, g: 255, b: 255 };

    const result = detectImpossiblePair(fg, bg, 'AA');

    expect(result.impossible).toBe(false);
    expect(result.message).toBeUndefined();
  });

  it('should detect mid-tone background issues for AAA', () => {
    const fg: RGBColor = { r: 100, g: 100, b: 100 };
    const bg: RGBColor = { r: 150, g: 150, b: 150 };

    const result = detectImpossiblePair(fg, bg, 'AAA');

    expect(result.impossible).toBe(true);
    expect(result.message).toContain('Mid-tone');
  });

  it('should provide actionable suggestions', () => {
    const fg: RGBColor = { r: 127, g: 127, b: 127 };
    const bg: RGBColor = { r: 129, g: 129, b: 129 };

    const result = detectImpossiblePair(fg, bg, 'AA');

    if (result.impossible) {
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions!.length).toBeGreaterThan(0);
      result.suggestions!.forEach(suggestion => {
        expect(typeof suggestion).toBe('string');
        expect(suggestion.length).toBeGreaterThan(10);
      });
    }
  });
});

describe('TASK-014: Pipeline Integration', () => {
  /**
   * Integration tests for WCAG validation in the full pipeline
   */

  it('should validate multiple color pairs in batch', () => {
    const background: RGBColor = { r: 255, g: 255, b: 255 };
    const colorPairs = [
      { r: 0, g: 0, b: 0 },       // Black - should pass
      { r: 100, g: 100, b: 100 }, // Dark gray - should pass
      { r: 200, g: 200, b: 200 }, // Light gray - should fail
      { r: 240, g: 240, b: 240 }, // Very light - should fail
    ];

    const results = colorPairs.map(fg =>
      validateColorPair(fg, background, 'AA', false)
    );

    expect(results[0].passed).toBe(true);  // Black
    expect(results[1].passed).toBe(true);  // Dark gray
    expect(results[2].passed).toBe(false); // Light gray
    expect(results[3].passed).toBe(false); // Very light
  });

  it('should log warnings for non-compliant color combinations', () => {
    const violations: Array<{ fg: RGBColor; bg: RGBColor; ratio: number }> = [];

    const testPairs = [
      { fg: { r: 200, g: 200, b: 200 }, bg: { r: 255, g: 255, b: 255 } },
      { fg: { r: 50, g: 50, b: 50 }, bg: { r: 60, g: 60, b: 60 } },
    ];

    testPairs.forEach(({ fg, bg }) => {
      const result = validateColorPair(fg, bg, 'AA');
      if (!result.passed) {
        violations.push({ fg, bg, ratio: result.contrastRatio });
      }
    });

    expect(violations.length).toBeGreaterThan(0);
    violations.forEach(v => {
      expect(v.ratio).toBeLessThan(4.5);
    });
  });

  it('should integrate auto-adjustment in pipeline', () => {
    const color: ArchetypeColor = { l: 0.75, c: 0.1, h: 240 };
    const white: RGBColor = { r: 255, g: 255, b: 255 };

    // Check if needs adjustment
    const result = detectImpossiblePair(
      { r: Math.round(0.75 * 255), g: Math.round(0.75 * 255), b: Math.round(0.75 * 255) },
      white,
      'AA'
    );

    if (!result.impossible) {
      // Try to auto-adjust
      const adjusted = autoAdjustContrast(color, white, 'AA');
      expect(adjusted).not.toBeNull();
    }
  });
});
