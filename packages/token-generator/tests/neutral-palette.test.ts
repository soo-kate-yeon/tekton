/**
 * Neutral Palette Tests
 *
 * TASK-001: Light mode neutral palette
 * TASK-002: Dark mode neutral palette
 * TASK-003: Tinting modes (pure, tinted, custom)
 *
 * Tests comprehensive coverage for:
 * - Light mode neutral palette generation
 * - Dark mode neutral palette generation (inverted semantics)
 * - All tinting modes: 'pure', 'tinted', 'custom'
 * - ChromaIntensity effects on tinting
 * - All 11 scale steps present (50, 100, 200...900, 950)
 * - Lightness progression validation
 * - Valid OKLCH output format
 * - SDR-001/SDR-002 specification compliance
 * - Default values for optional config params
 * - Edge cases: boundary hue values, zero/max chroma intensity
 */

import { describe, it, expect } from 'vitest';
import {
  generateNeutralPalette,
  type NeutralPaletteConfig,
} from '../src/neutral-palette.js';
import type { ColorScale, OKLCHColor } from '@tekton/theme';

/**
 * All 11 scale steps matching Tailwind convention
 */
const SCALE_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;

/**
 * Helper function to validate OKLCH color structure
 */
function isValidOKLCH(color: unknown): color is OKLCHColor {
  if (typeof color !== 'object' || color === null) return false;
  const c = color as Record<string, unknown>;
  return (
    typeof c.l === 'number' &&
    typeof c.c === 'number' &&
    typeof c.h === 'number' &&
    c.l >= 0 &&
    c.l <= 1 &&
    c.c >= 0 &&
    c.c <= 0.5 &&
    c.h >= 0 &&
    c.h <= 360
  );
}

describe('Neutral Palette Generator', () => {
  // Standard light mode configuration
  const lightModeConfig: NeutralPaletteConfig = {
    mode: 'light',
  };

  // Standard dark mode configuration
  const darkModeConfig: NeutralPaletteConfig = {
    mode: 'dark',
  };

  describe('generateNeutralPalette - Basic Functionality', () => {
    it('should return an object with all 11 scale steps', () => {
      const result = generateNeutralPalette(lightModeConfig);

      SCALE_STEPS.forEach((step) => {
        expect(result).toHaveProperty(step);
      });
    });

    it('should return exactly 11 scale steps', () => {
      const result = generateNeutralPalette(lightModeConfig);
      const keys = Object.keys(result);

      expect(keys.length).toBe(11);
    });

    it('should return valid OKLCH colors for all scale steps', () => {
      const result = generateNeutralPalette(lightModeConfig);

      SCALE_STEPS.forEach((step) => {
        expect(
          isValidOKLCH(result[step]),
          `Step ${step} should be a valid OKLCH color`,
        ).toBe(true);
      });
    });

    it('should produce deterministic output for same input', () => {
      const result1 = generateNeutralPalette(lightModeConfig);
      const result2 = generateNeutralPalette(lightModeConfig);

      SCALE_STEPS.forEach((step) => {
        expect(result1[step]).toEqual(result2[step]);
      });
    });
  });

  describe('Light Mode Neutral Palette Generation', () => {
    it('should generate palette with high lightness at step 50', () => {
      const result = generateNeutralPalette(lightModeConfig);

      expect(result['50'].l).toBe(0.98);
    });

    it('should generate palette with low lightness at step 950', () => {
      const result = generateNeutralPalette(lightModeConfig);

      expect(result['950'].l).toBe(0.10);
    });

    it('should have decreasing lightness from step 50 to step 950', () => {
      const result = generateNeutralPalette(lightModeConfig);

      for (let i = 0; i < SCALE_STEPS.length - 1; i++) {
        const currentStep = SCALE_STEPS[i];
        const nextStep = SCALE_STEPS[i + 1];
        expect(
          result[currentStep].l,
          `Step ${currentStep} should have greater lightness than step ${nextStep}`,
        ).toBeGreaterThan(result[nextStep].l);
      }
    });

    it('should have middle gray at step 500', () => {
      const result = generateNeutralPalette(lightModeConfig);

      expect(result['500'].l).toBe(0.50);
    });

    it('should have correct lightness values for all light mode steps', () => {
      const result = generateNeutralPalette(lightModeConfig);

      const expectedLightness: Record<string, number> = {
        '50': 0.98,
        '100': 0.95,
        '200': 0.88,
        '300': 0.78,
        '400': 0.65,
        '500': 0.50,
        '600': 0.40,
        '700': 0.30,
        '800': 0.22,
        '900': 0.15,
        '950': 0.10,
      };

      SCALE_STEPS.forEach((step) => {
        expect(result[step].l).toBe(expectedLightness[step]);
      });
    });
  });

  describe('Dark Mode Neutral Palette Generation', () => {
    it('should generate palette with high lightness at step 50', () => {
      const result = generateNeutralPalette(darkModeConfig);

      // Dark mode step 50 is foreground (very light)
      expect(result['50'].l).toBe(0.98);
    });

    it('should generate palette with very low lightness at step 950', () => {
      const result = generateNeutralPalette(darkModeConfig);

      // Dark mode step 950 is darker than light mode
      expect(result['950'].l).toBe(0.05);
    });

    it('should have decreasing lightness from step 50 to step 950', () => {
      const result = generateNeutralPalette(darkModeConfig);

      for (let i = 0; i < SCALE_STEPS.length - 1; i++) {
        const currentStep = SCALE_STEPS[i];
        const nextStep = SCALE_STEPS[i + 1];
        expect(
          result[currentStep].l,
          `Step ${currentStep} should have greater lightness than step ${nextStep}`,
        ).toBeGreaterThan(result[nextStep].l);
      }
    });

    it('should have correct lightness values for all dark mode steps', () => {
      const result = generateNeutralPalette(darkModeConfig);

      const expectedLightness: Record<string, number> = {
        '50': 0.98,
        '100': 0.95,
        '200': 0.88,
        '300': 0.78,
        '400': 0.65,
        '500': 0.50,
        '600': 0.40,
        '700': 0.30,
        '800': 0.22,
        '900': 0.10, // Different from light mode (0.15)
        '950': 0.05, // Different from light mode (0.10)
      };

      SCALE_STEPS.forEach((step) => {
        expect(result[step].l).toBe(expectedLightness[step]);
      });
    });
  });

  describe('SDR-001 Specification Compliance (Light Mode)', () => {
    it('should have Neutral-50 lightness >= 0.95', () => {
      const result = generateNeutralPalette(lightModeConfig);

      expect(result['50'].l).toBeGreaterThanOrEqual(0.95);
    });

    it('should have Neutral-900 lightness <= 0.20', () => {
      const result = generateNeutralPalette(lightModeConfig);

      expect(result['900'].l).toBeLessThanOrEqual(0.20);
    });
  });

  describe('SDR-002 Specification Compliance (Dark Mode)', () => {
    it('should have Neutral-900 lightness <= 0.15 for dark backgrounds', () => {
      const result = generateNeutralPalette(darkModeConfig);

      expect(result['900'].l).toBeLessThanOrEqual(0.15);
    });

    it('should have Neutral-50 lightness >= 0.95 for light foregrounds', () => {
      const result = generateNeutralPalette(darkModeConfig);

      expect(result['50'].l).toBeGreaterThanOrEqual(0.95);
    });
  });

  describe('Mode Comparison - Light vs Dark', () => {
    it('should have same structure for both modes', () => {
      const lightResult = generateNeutralPalette(lightModeConfig);
      const darkResult = generateNeutralPalette(darkModeConfig);

      SCALE_STEPS.forEach((step) => {
        expect(lightResult).toHaveProperty(step);
        expect(darkResult).toHaveProperty(step);
      });
    });

    it('should have darker step 900 in dark mode than light mode', () => {
      const lightResult = generateNeutralPalette(lightModeConfig);
      const darkResult = generateNeutralPalette(darkModeConfig);

      expect(darkResult['900'].l).toBeLessThan(lightResult['900'].l);
    });

    it('should have darker step 950 in dark mode than light mode', () => {
      const lightResult = generateNeutralPalette(lightModeConfig);
      const darkResult = generateNeutralPalette(darkModeConfig);

      expect(darkResult['950'].l).toBeLessThan(lightResult['950'].l);
    });
  });

  describe('Tinting Modes', () => {
    describe('Pure Tinting (Default)', () => {
      it('should use pure neutral with minimal chroma when tinting is not specified', () => {
        const result = generateNeutralPalette(lightModeConfig);

        SCALE_STEPS.forEach((step) => {
          // Pure neutral has minimal chroma (0.002)
          expect(result[step].c).toBe(0.002);
          // Pure neutral has zero hue
          expect(result[step].h).toBe(0);
        });
      });

      it('should use pure neutral when tinting is explicitly set to pure', () => {
        const config: NeutralPaletteConfig = {
          mode: 'light',
          tinting: 'pure',
        };
        const result = generateNeutralPalette(config);

        SCALE_STEPS.forEach((step) => {
          expect(result[step].c).toBe(0.002);
          expect(result[step].h).toBe(0);
        });
      });

      it('should ignore primaryHue when tinting is pure', () => {
        const config: NeutralPaletteConfig = {
          mode: 'light',
          tinting: 'pure',
          primaryHue: 220, // Should be ignored
        };
        const result = generateNeutralPalette(config);

        SCALE_STEPS.forEach((step) => {
          expect(result[step].h).toBe(0);
        });
      });

      it('should ignore chromaIntensity when tinting is pure', () => {
        const config: NeutralPaletteConfig = {
          mode: 'light',
          tinting: 'pure',
          chromaIntensity: 0.05, // Should be ignored
        };
        const result = generateNeutralPalette(config);

        SCALE_STEPS.forEach((step) => {
          expect(result[step].c).toBe(0.002);
        });
      });
    });

    describe('Tinted Mode', () => {
      it('should apply primaryHue to all scale steps when tinting is tinted', () => {
        const config: NeutralPaletteConfig = {
          mode: 'light',
          tinting: 'tinted',
          primaryHue: 220,
        };
        const result = generateNeutralPalette(config);

        SCALE_STEPS.forEach((step) => {
          expect(result[step].h).toBe(220);
        });
      });

      it('should use default chromaIntensity when not specified in tinted mode', () => {
        const config: NeutralPaletteConfig = {
          mode: 'light',
          tinting: 'tinted',
          primaryHue: 220,
        };
        const result = generateNeutralPalette(config);

        SCALE_STEPS.forEach((step) => {
          // Default chromaIntensity is 0.012
          expect(result[step].c).toBe(0.012);
        });
      });

      it('should apply custom chromaIntensity in tinted mode', () => {
        const config: NeutralPaletteConfig = {
          mode: 'light',
          tinting: 'tinted',
          primaryHue: 180,
          chromaIntensity: 0.025,
        };
        const result = generateNeutralPalette(config);

        SCALE_STEPS.forEach((step) => {
          expect(result[step].c).toBe(0.025);
          expect(result[step].h).toBe(180);
        });
      });

      it('should use default primaryHue of 0 when not specified in tinted mode', () => {
        const config: NeutralPaletteConfig = {
          mode: 'light',
          tinting: 'tinted',
        };
        const result = generateNeutralPalette(config);

        SCALE_STEPS.forEach((step) => {
          expect(result[step].h).toBe(0);
        });
      });
    });

    describe('Custom Mode', () => {
      it('should apply primaryHue to all scale steps when tinting is custom', () => {
        const config: NeutralPaletteConfig = {
          mode: 'light',
          tinting: 'custom',
          primaryHue: 300,
        };
        const result = generateNeutralPalette(config);

        SCALE_STEPS.forEach((step) => {
          expect(result[step].h).toBe(300);
        });
      });

      it('should use default chromaIntensity when not specified in custom mode', () => {
        const config: NeutralPaletteConfig = {
          mode: 'light',
          tinting: 'custom',
          primaryHue: 300,
        };
        const result = generateNeutralPalette(config);

        SCALE_STEPS.forEach((step) => {
          expect(result[step].c).toBe(0.012);
        });
      });

      it('should apply custom chromaIntensity in custom mode', () => {
        const config: NeutralPaletteConfig = {
          mode: 'light',
          tinting: 'custom',
          primaryHue: 60,
          chromaIntensity: 0.03,
        };
        const result = generateNeutralPalette(config);

        SCALE_STEPS.forEach((step) => {
          expect(result[step].c).toBe(0.03);
          expect(result[step].h).toBe(60);
        });
      });

      it('should work with dark mode in custom tinting', () => {
        const config: NeutralPaletteConfig = {
          mode: 'dark',
          tinting: 'custom',
          primaryHue: 120,
          chromaIntensity: 0.02,
        };
        const result = generateNeutralPalette(config);

        SCALE_STEPS.forEach((step) => {
          expect(result[step].c).toBe(0.02);
          expect(result[step].h).toBe(120);
        });

        // Verify dark mode lightness values are used
        expect(result['900'].l).toBe(0.10);
        expect(result['950'].l).toBe(0.05);
      });
    });
  });

  describe('ChromaIntensity Effects', () => {
    it('should produce more saturated neutrals with higher chromaIntensity', () => {
      const lowChroma: NeutralPaletteConfig = {
        mode: 'light',
        tinting: 'tinted',
        primaryHue: 220,
        chromaIntensity: 0.005,
      };
      const highChroma: NeutralPaletteConfig = {
        mode: 'light',
        tinting: 'tinted',
        primaryHue: 220,
        chromaIntensity: 0.03,
      };

      const lowResult = generateNeutralPalette(lowChroma);
      const highResult = generateNeutralPalette(highChroma);

      SCALE_STEPS.forEach((step) => {
        expect(highResult[step].c).toBeGreaterThan(lowResult[step].c);
      });
    });

    it('should clamp chromaIntensity at maximum of 0.5', () => {
      const config: NeutralPaletteConfig = {
        mode: 'light',
        tinting: 'custom',
        primaryHue: 220,
        chromaIntensity: 0.6, // Exceeds max
      };
      const result = generateNeutralPalette(config);

      SCALE_STEPS.forEach((step) => {
        expect(result[step].c).toBeLessThanOrEqual(0.5);
      });
    });

    it('should handle zero chromaIntensity', () => {
      const config: NeutralPaletteConfig = {
        mode: 'light',
        tinting: 'custom',
        primaryHue: 220,
        chromaIntensity: 0,
      };
      const result = generateNeutralPalette(config);

      SCALE_STEPS.forEach((step) => {
        expect(result[step].c).toBe(0);
      });
    });
  });

  describe('OKLCH Output Format Validation', () => {
    it('should have lightness values between 0 and 1', () => {
      const result = generateNeutralPalette(lightModeConfig);

      SCALE_STEPS.forEach((step) => {
        expect(result[step].l).toBeGreaterThanOrEqual(0);
        expect(result[step].l).toBeLessThanOrEqual(1);
      });
    });

    it('should have chroma values between 0 and 0.5', () => {
      const result = generateNeutralPalette(lightModeConfig);

      SCALE_STEPS.forEach((step) => {
        expect(result[step].c).toBeGreaterThanOrEqual(0);
        expect(result[step].c).toBeLessThanOrEqual(0.5);
      });
    });

    it('should have hue values between 0 and 360', () => {
      const config: NeutralPaletteConfig = {
        mode: 'light',
        tinting: 'tinted',
        primaryHue: 180,
      };
      const result = generateNeutralPalette(config);

      SCALE_STEPS.forEach((step) => {
        expect(result[step].h).toBeGreaterThanOrEqual(0);
        expect(result[step].h).toBeLessThanOrEqual(360);
      });
    });

    it('should return correct OKLCH object structure', () => {
      const result = generateNeutralPalette(lightModeConfig);

      SCALE_STEPS.forEach((step) => {
        const color = result[step];
        expect(color).toHaveProperty('l');
        expect(color).toHaveProperty('c');
        expect(color).toHaveProperty('h');
        expect(typeof color.l).toBe('number');
        expect(typeof color.c).toBe('number');
        expect(typeof color.h).toBe('number');
      });
    });
  });

  describe('Default Values', () => {
    it('should use pure tinting as default when not specified', () => {
      const withDefault = generateNeutralPalette({ mode: 'light' });
      const withPure = generateNeutralPalette({ mode: 'light', tinting: 'pure' });

      SCALE_STEPS.forEach((step) => {
        expect(withDefault[step]).toEqual(withPure[step]);
      });
    });

    it('should use primaryHue of 0 as default when not specified', () => {
      const result = generateNeutralPalette({ mode: 'light', tinting: 'tinted' });

      SCALE_STEPS.forEach((step) => {
        expect(result[step].h).toBe(0);
      });
    });

    it('should use chromaIntensity of 0.012 as default when not specified', () => {
      const result = generateNeutralPalette({
        mode: 'light',
        tinting: 'tinted',
        primaryHue: 220,
      });

      SCALE_STEPS.forEach((step) => {
        expect(result[step].c).toBe(0.012);
      });
    });
  });

  describe('Edge Cases', () => {
    describe('Boundary Hue Values', () => {
      it('should handle hue value of 0', () => {
        const config: NeutralPaletteConfig = {
          mode: 'light',
          tinting: 'tinted',
          primaryHue: 0,
        };
        const result = generateNeutralPalette(config);

        SCALE_STEPS.forEach((step) => {
          expect(result[step].h).toBe(0);
        });
      });

      it('should handle hue value of 360', () => {
        const config: NeutralPaletteConfig = {
          mode: 'light',
          tinting: 'tinted',
          primaryHue: 360,
        };
        const result = generateNeutralPalette(config);

        SCALE_STEPS.forEach((step) => {
          expect(result[step].h).toBe(360);
        });
      });

      it('should handle hue value of 180 (cyan)', () => {
        const config: NeutralPaletteConfig = {
          mode: 'light',
          tinting: 'tinted',
          primaryHue: 180,
        };
        const result = generateNeutralPalette(config);

        SCALE_STEPS.forEach((step) => {
          expect(result[step].h).toBe(180);
        });
      });

      it('should handle various hue values correctly', () => {
        const hues = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360];

        hues.forEach((hue) => {
          const config: NeutralPaletteConfig = {
            mode: 'light',
            tinting: 'tinted',
            primaryHue: hue,
          };
          const result = generateNeutralPalette(config);

          expect(result['500'].h).toBe(hue);
        });
      });
    });

    describe('Extreme Lightness Clamping', () => {
      it('should clamp lightness to minimum of 0', () => {
        const result = generateNeutralPalette(lightModeConfig);

        SCALE_STEPS.forEach((step) => {
          expect(result[step].l).toBeGreaterThanOrEqual(0);
        });
      });

      it('should clamp lightness to maximum of 1', () => {
        const result = generateNeutralPalette(lightModeConfig);

        SCALE_STEPS.forEach((step) => {
          expect(result[step].l).toBeLessThanOrEqual(1);
        });
      });
    });

    describe('Extreme Chroma Values', () => {
      it('should handle very small positive chroma intensity', () => {
        const config: NeutralPaletteConfig = {
          mode: 'light',
          tinting: 'custom',
          primaryHue: 220,
          chromaIntensity: 0.001,
        };
        const result = generateNeutralPalette(config);

        SCALE_STEPS.forEach((step) => {
          expect(result[step].c).toBe(0.001);
          expect(result[step].c).toBeGreaterThanOrEqual(0);
        });
      });

      it('should handle maximum chroma intensity', () => {
        const config: NeutralPaletteConfig = {
          mode: 'light',
          tinting: 'custom',
          primaryHue: 220,
          chromaIntensity: 0.5,
        };
        const result = generateNeutralPalette(config);

        SCALE_STEPS.forEach((step) => {
          expect(result[step].c).toBe(0.5);
        });
      });

      it('should clamp negative chroma intensity to 0', () => {
        const config: NeutralPaletteConfig = {
          mode: 'light',
          tinting: 'custom',
          primaryHue: 220,
          chromaIntensity: -0.01, // Negative value
        };
        const result = generateNeutralPalette(config);

        SCALE_STEPS.forEach((step) => {
          expect(result[step].c).toBeGreaterThanOrEqual(0);
        });
      });
    });

    describe('Minimal Configuration', () => {
      it('should work with only mode specified for light', () => {
        const result = generateNeutralPalette({ mode: 'light' });

        expect(Object.keys(result).length).toBe(11);
        SCALE_STEPS.forEach((step) => {
          expect(isValidOKLCH(result[step])).toBe(true);
        });
      });

      it('should work with only mode specified for dark', () => {
        const result = generateNeutralPalette({ mode: 'dark' });

        expect(Object.keys(result).length).toBe(11);
        SCALE_STEPS.forEach((step) => {
          expect(isValidOKLCH(result[step])).toBe(true);
        });
      });
    });
  });

  describe('Performance', () => {
    it('should complete palette generation in under 5ms', () => {
      const startTime = performance.now();

      for (let i = 0; i < 100; i++) {
        generateNeutralPalette(lightModeConfig);
      }

      const endTime = performance.now();
      const avgTime = (endTime - startTime) / 100;

      expect(avgTime).toBeLessThan(5);
    });

    it('should complete tinted palette generation in under 5ms', () => {
      const config: NeutralPaletteConfig = {
        mode: 'light',
        tinting: 'tinted',
        primaryHue: 220,
        chromaIntensity: 0.015,
      };
      const startTime = performance.now();

      for (let i = 0; i < 100; i++) {
        generateNeutralPalette(config);
      }

      const endTime = performance.now();
      const avgTime = (endTime - startTime) / 100;

      expect(avgTime).toBeLessThan(5);
    });
  });

  describe('Type Safety', () => {
    it('should accept valid NeutralPaletteConfig', () => {
      const config: NeutralPaletteConfig = {
        mode: 'light',
        tinting: 'tinted',
        primaryHue: 220,
        chromaIntensity: 0.012,
      };

      expect(() => generateNeutralPalette(config)).not.toThrow();
    });

    it('should return ColorScale type', () => {
      const result = generateNeutralPalette(lightModeConfig);

      // Type assertion - if this compiles, the types are correct
      const _: ColorScale = result;
      expect(result).toBeDefined();
    });
  });

  describe('Integration with Semantic Mapper', () => {
    it('should produce palette suitable for semantic token mapping in light mode', () => {
      const result = generateNeutralPalette(lightModeConfig);

      // Background should use light steps (50-100)
      expect(result['50'].l).toBeGreaterThanOrEqual(0.95);
      expect(result['100'].l).toBeGreaterThanOrEqual(0.90);

      // Foreground should use dark steps (900-950)
      expect(result['900'].l).toBeLessThanOrEqual(0.20);
      expect(result['950'].l).toBeLessThanOrEqual(0.15);

      // Border should use mid-light steps (200-300)
      expect(result['200'].l).toBeGreaterThanOrEqual(0.80);

      // Muted should use very light steps (100-200)
      expect(result['100'].l).toBeGreaterThanOrEqual(0.90);
    });

    it('should produce palette suitable for semantic token mapping in dark mode', () => {
      const result = generateNeutralPalette(darkModeConfig);

      // In dark mode, background uses dark steps (900-950)
      expect(result['900'].l).toBeLessThanOrEqual(0.15);
      expect(result['950'].l).toBeLessThanOrEqual(0.10);

      // Foreground uses light steps (50-100)
      expect(result['50'].l).toBeGreaterThanOrEqual(0.95);

      // Border should use darker mid steps (700-800)
      expect(result['700'].l).toBeLessThanOrEqual(0.35);

      // Muted should use dark steps (800)
      expect(result['800'].l).toBeLessThanOrEqual(0.25);
    });
  });

  describe('Consistency Across Configurations', () => {
    it('should maintain consistent structure regardless of tinting mode', () => {
      const pureResult = generateNeutralPalette({ mode: 'light', tinting: 'pure' });
      const tintedResult = generateNeutralPalette({ mode: 'light', tinting: 'tinted', primaryHue: 220 });
      const customResult = generateNeutralPalette({ mode: 'light', tinting: 'custom', primaryHue: 180 });

      SCALE_STEPS.forEach((step) => {
        // All should have the same structure
        expect(pureResult[step]).toHaveProperty('l');
        expect(pureResult[step]).toHaveProperty('c');
        expect(pureResult[step]).toHaveProperty('h');

        expect(tintedResult[step]).toHaveProperty('l');
        expect(tintedResult[step]).toHaveProperty('c');
        expect(tintedResult[step]).toHaveProperty('h');

        expect(customResult[step]).toHaveProperty('l');
        expect(customResult[step]).toHaveProperty('c');
        expect(customResult[step]).toHaveProperty('h');
      });
    });

    it('should maintain same lightness values regardless of tinting mode', () => {
      const pureResult = generateNeutralPalette({ mode: 'light', tinting: 'pure' });
      const tintedResult = generateNeutralPalette({
        mode: 'light',
        tinting: 'tinted',
        primaryHue: 220,
        chromaIntensity: 0.02,
      });

      // Lightness should be the same regardless of tinting
      SCALE_STEPS.forEach((step) => {
        expect(pureResult[step].l).toBe(tintedResult[step].l);
      });
    });
  });
});
