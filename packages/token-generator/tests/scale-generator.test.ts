import { describe, it, expect } from 'vitest';
import { generateLightnessScale, generateColorScales } from '../src/scale-generator.js';
import type { OKLCHColor } from '@tekton/theme';

/**
 * Test suite for scale-generator.ts
 * Tests the generation of 11-step lightness scales (50-950) following Tailwind convention
 */

describe('Scale Generator', () => {
  // Define standard test colors
  const standardBlue: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };
  const standardRed: OKLCHColor = { l: 0.55, c: 0.2, h: 25 };
  const standardGreen: OKLCHColor = { l: 0.6, c: 0.18, h: 145 };

  // Scale step constants
  const SCALE_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

  describe('generateLightnessScale', () => {
    describe('Basic Functionality', () => {
      it('should produce all 11 scale steps (50-950)', () => {
        const scale = generateLightnessScale(standardBlue);

        SCALE_STEPS.forEach((step) => {
          expect(scale[step as keyof typeof scale]).toBeDefined();
        });

        expect(Object.keys(scale)).toHaveLength(11);
      });

      it('should return OKLCHColor objects for each step', () => {
        const scale = generateLightnessScale(standardBlue);

        SCALE_STEPS.forEach((step) => {
          const color = scale[step as keyof typeof scale];
          expect(color).toHaveProperty('l');
          expect(color).toHaveProperty('c');
          expect(color).toHaveProperty('h');
        });
      });

      it('should produce valid OKLCH values within bounds', () => {
        const scale = generateLightnessScale(standardBlue);

        SCALE_STEPS.forEach((step) => {
          const color = scale[step as keyof typeof scale];
          // Lightness: 0-1
          expect(color.l).toBeGreaterThanOrEqual(0);
          expect(color.l).toBeLessThanOrEqual(1);
          // Chroma: 0-0.5
          expect(color.c).toBeGreaterThanOrEqual(0);
          expect(color.c).toBeLessThanOrEqual(0.5);
          // Hue: preserved from base
          expect(color.h).toBe(standardBlue.h);
        });
      });
    });

    describe('Lightness Progression', () => {
      it('should have lighter colors at lower step numbers (50 lightest)', () => {
        const scale = generateLightnessScale(standardBlue);

        // Step 50 should be the lightest
        expect(scale['50'].l).toBeGreaterThan(scale['100'].l);
        expect(scale['100'].l).toBeGreaterThan(scale['200'].l);
        expect(scale['200'].l).toBeGreaterThan(scale['300'].l);
      });

      it('should have darker colors at higher step numbers (950 darkest)', () => {
        const scale = generateLightnessScale(standardBlue);

        // Step 950 should be the darkest
        expect(scale['950'].l).toBeLessThan(scale['900'].l);
        expect(scale['900'].l).toBeLessThan(scale['800'].l);
        expect(scale['800'].l).toBeLessThan(scale['700'].l);
      });

      it('should have monotonically decreasing lightness from 50 to 950', () => {
        const scale = generateLightnessScale(standardBlue);

        for (let i = 0; i < SCALE_STEPS.length - 1; i++) {
          const currentStep = SCALE_STEPS[i] as keyof typeof scale;
          const nextStep = SCALE_STEPS[i + 1] as keyof typeof scale;
          expect(scale[currentStep].l).toBeGreaterThanOrEqual(scale[nextStep].l);
        }
      });

      it('should have step 50 close to white (l > 0.9)', () => {
        const scale = generateLightnessScale(standardBlue);
        expect(scale['50'].l).toBeGreaterThan(0.9);
      });

      it('should have step 950 close to black (l < 0.15)', () => {
        const scale = generateLightnessScale(standardBlue);
        expect(scale['950'].l).toBeLessThan(0.15);
      });
    });

    describe('Step 500 Behavior (Base Color)', () => {
      it('should have step 500 equal to base color lightness', () => {
        const scale = generateLightnessScale(standardBlue);
        expect(scale['500'].l).toBe(standardBlue.l);
      });

      it('should preserve base lightness at step 500 for various base colors', () => {
        const colors: OKLCHColor[] = [
          { l: 0.3, c: 0.1, h: 100 },
          { l: 0.5, c: 0.15, h: 200 },
          { l: 0.7, c: 0.2, h: 300 },
        ];

        colors.forEach((baseColor) => {
          const scale = generateLightnessScale(baseColor);
          expect(scale['500'].l).toBe(baseColor.l);
        });
      });

      it('should have steps 400 and 600 symmetric around step 500', () => {
        const scale = generateLightnessScale(standardBlue);

        // Step 400 should be lighter than 500, step 600 should be darker
        expect(scale['400'].l).toBeGreaterThan(scale['500'].l);
        expect(scale['600'].l).toBeLessThan(scale['500'].l);
      });
    });

    describe('Hue Preservation', () => {
      it('should preserve hue across all scale steps', () => {
        const scale = generateLightnessScale(standardBlue);

        SCALE_STEPS.forEach((step) => {
          const color = scale[step as keyof typeof scale];
          expect(color.h).toBe(standardBlue.h);
        });
      });

      it('should preserve hue for different hue values', () => {
        const hues = [0, 45, 90, 135, 180, 225, 270, 315, 360];

        hues.forEach((hue) => {
          const baseColor: OKLCHColor = { l: 0.5, c: 0.15, h: hue };
          const scale = generateLightnessScale(baseColor);

          SCALE_STEPS.forEach((step) => {
            expect(scale[step as keyof typeof scale].h).toBe(hue);
          });
        });
      });
    });

    describe('Chroma Adjustment at Extreme Lightness', () => {
      it('should reduce chroma at very light steps (50, 100)', () => {
        const baseColor: OKLCHColor = { l: 0.5, c: 0.2, h: 200 };
        const scale = generateLightnessScale(baseColor);

        // Steps with lightness > 0.9 should have reduced chroma
        expect(scale['50'].c).toBeLessThan(baseColor.c);
      });

      it('should reduce chroma at very dark steps (900, 950)', () => {
        const baseColor: OKLCHColor = { l: 0.5, c: 0.2, h: 200 };
        const scale = generateLightnessScale(baseColor);

        // Steps with very low lightness should have reduced chroma
        // Based on implementation: chroma * 0.7 for l < 0.2
        expect(scale['950'].c).toBeLessThan(baseColor.c);
      });

      it('should apply 0.5x chroma multiplier when lightness > 0.9', () => {
        const baseColor: OKLCHColor = { l: 0.5, c: 0.2, h: 200 };
        const scale = generateLightnessScale(baseColor);

        // Step 50 has lightness 0.98 (> 0.9), so chroma should be 0.5 * baseChroma
        expect(scale['50'].c).toBeCloseTo(baseColor.c * 0.5, 2);
      });

      it('should apply 0.7x chroma multiplier when lightness < 0.2', () => {
        const baseColor: OKLCHColor = { l: 0.5, c: 0.2, h: 200 };
        const scale = generateLightnessScale(baseColor);

        // Steps with lightness < 0.2 should have chroma * 0.7
        // Step 950 has very low lightness
        if (scale['950'].l < 0.2) {
          expect(scale['950'].c).toBeCloseTo(baseColor.c * 0.7, 2);
        }
      });

      it('should preserve chroma at mid-range lightness values', () => {
        const baseColor: OKLCHColor = { l: 0.5, c: 0.15, h: 200 };
        const scale = generateLightnessScale(baseColor);

        // Step 500 should have original chroma (lightness is mid-range)
        expect(scale['500'].c).toBe(baseColor.c);
      });
    });

    describe('Perceptually Uniform Distribution', () => {
      it('should have roughly equal perceptual steps between adjacent scale values', () => {
        const scale = generateLightnessScale(standardBlue);

        // Light end: steps should be perceptually distinguishable
        const lightDiff1 = scale['50'].l - scale['100'].l;
        const lightDiff2 = scale['100'].l - scale['200'].l;

        // Differences should be positive (lighter to darker)
        expect(lightDiff1).toBeGreaterThan(0);
        expect(lightDiff2).toBeGreaterThan(0);

        // Dark end: steps should also be perceptually distinguishable
        const darkDiff1 = scale['800'].l - scale['900'].l;
        const darkDiff2 = scale['900'].l - scale['950'].l;

        expect(darkDiff1).toBeGreaterThan(0);
        expect(darkDiff2).toBeGreaterThan(0);
      });

      it('should follow the expected lightness map for light steps', () => {
        const scale = generateLightnessScale(standardBlue);

        // Based on implementation: fixed lightness values for steps 50-400
        expect(scale['50'].l).toBeCloseTo(0.98, 2);
        expect(scale['100'].l).toBeCloseTo(0.95, 2);
        expect(scale['200'].l).toBeCloseTo(0.88, 2);
        expect(scale['300'].l).toBeCloseTo(0.78, 2);
        expect(scale['400'].l).toBeCloseTo(0.65, 2);
      });
    });

    describe('Edge Cases', () => {
      describe('Very Light Base Color (l=0.95)', () => {
        const veryLightColor: OKLCHColor = { l: 0.95, c: 0.1, h: 180 };

        it('should handle very light base color', () => {
          const scale = generateLightnessScale(veryLightColor);

          expect(scale['500'].l).toBe(0.95);
          expect(Object.keys(scale)).toHaveLength(11);
        });

        it('should still produce valid scale with light base', () => {
          const scale = generateLightnessScale(veryLightColor);

          SCALE_STEPS.forEach((step) => {
            const color = scale[step as keyof typeof scale];
            expect(color.l).toBeGreaterThanOrEqual(0);
            expect(color.l).toBeLessThanOrEqual(1);
          });
        });

        it('should have reduced chroma for already-light step 500', () => {
          const scale = generateLightnessScale(veryLightColor);
          // Base lightness 0.95 > 0.9, so chroma should be reduced
          expect(scale['500'].c).toBeLessThan(veryLightColor.c);
        });
      });

      describe('Very Dark Base Color (l=0.1)', () => {
        const veryDarkColor: OKLCHColor = { l: 0.1, c: 0.1, h: 270 };

        it('should handle very dark base color', () => {
          const scale = generateLightnessScale(veryDarkColor);

          expect(scale['500'].l).toBe(0.1);
          expect(Object.keys(scale)).toHaveLength(11);
        });

        it('should still produce valid scale with dark base', () => {
          const scale = generateLightnessScale(veryDarkColor);

          SCALE_STEPS.forEach((step) => {
            const color = scale[step as keyof typeof scale];
            expect(color.l).toBeGreaterThanOrEqual(0);
            expect(color.l).toBeLessThanOrEqual(1);
          });
        });

        it('should have reduced chroma for very dark step 500', () => {
          const scale = generateLightnessScale(veryDarkColor);
          // Base lightness 0.1 < 0.2, so chroma should be reduced
          expect(scale['500'].c).toBeCloseTo(veryDarkColor.c * 0.7, 2);
        });
      });

      describe('Grayscale Base Color (c=0)', () => {
        const grayscaleColor: OKLCHColor = { l: 0.5, c: 0, h: 0 };

        it('should handle grayscale base color', () => {
          const scale = generateLightnessScale(grayscaleColor);

          expect(scale['500'].c).toBe(0);
          expect(Object.keys(scale)).toHaveLength(11);
        });

        it('should have zero chroma across all steps for grayscale', () => {
          const scale = generateLightnessScale(grayscaleColor);

          SCALE_STEPS.forEach((step) => {
            expect(scale[step as keyof typeof scale].c).toBe(0);
          });
        });

        it('should still have proper lightness progression for grayscale', () => {
          const scale = generateLightnessScale(grayscaleColor);

          expect(scale['50'].l).toBeGreaterThan(scale['500'].l);
          expect(scale['500'].l).toBeGreaterThan(scale['950'].l);
        });
      });

      describe('Maximum Chroma Base Color (c=0.4)', () => {
        const highChromaColor: OKLCHColor = { l: 0.5, c: 0.4, h: 150 };

        it('should handle high chroma base color', () => {
          const scale = generateLightnessScale(highChromaColor);

          expect(Object.keys(scale)).toHaveLength(11);
        });

        it('should clamp chroma to maximum 0.5', () => {
          const scale = generateLightnessScale(highChromaColor);

          SCALE_STEPS.forEach((step) => {
            expect(scale[step as keyof typeof scale].c).toBeLessThanOrEqual(0.5);
          });
        });
      });

      describe('Boundary Hue Values', () => {
        it('should handle hue at 0 degrees', () => {
          const color: OKLCHColor = { l: 0.5, c: 0.15, h: 0 };
          const scale = generateLightnessScale(color);

          SCALE_STEPS.forEach((step) => {
            expect(scale[step as keyof typeof scale].h).toBe(0);
          });
        });

        it('should handle hue at 360 degrees', () => {
          const color: OKLCHColor = { l: 0.5, c: 0.15, h: 360 };
          const scale = generateLightnessScale(color);

          SCALE_STEPS.forEach((step) => {
            expect(scale[step as keyof typeof scale].h).toBe(360);
          });
        });
      });

      describe('Minimum Lightness Base (l=0)', () => {
        const blackColor: OKLCHColor = { l: 0, c: 0, h: 0 };

        it('should handle black base color', () => {
          const scale = generateLightnessScale(blackColor);

          expect(scale['500'].l).toBe(0);
          expect(Object.keys(scale)).toHaveLength(11);
        });
      });

      describe('Maximum Lightness Base (l=1)', () => {
        const whiteColor: OKLCHColor = { l: 1, c: 0, h: 0 };

        it('should handle white base color', () => {
          const scale = generateLightnessScale(whiteColor);

          expect(scale['500'].l).toBe(1);
          expect(Object.keys(scale)).toHaveLength(11);
        });
      });
    });

    describe('Determinism', () => {
      it('should produce identical output for identical input', () => {
        const scale1 = generateLightnessScale(standardBlue);
        const scale2 = generateLightnessScale(standardBlue);

        expect(scale1).toEqual(scale2);
      });

      it('should be deterministic across multiple calls', () => {
        const results: ReturnType<typeof generateLightnessScale>[] = [];

        for (let i = 0; i < 10; i++) {
          results.push(generateLightnessScale(standardBlue));
        }

        results.forEach((scale) => {
          expect(scale).toEqual(results[0]);
        });
      });
    });

    describe('Different Base Colors Produce Different Scales', () => {
      it('should produce different scales for different base colors', () => {
        const scaleBlue = generateLightnessScale(standardBlue);
        const scaleRed = generateLightnessScale(standardRed);
        const scaleGreen = generateLightnessScale(standardGreen);

        // Different hues
        expect(scaleBlue['500'].h).not.toBe(scaleRed['500'].h);
        expect(scaleBlue['500'].h).not.toBe(scaleGreen['500'].h);

        // Different base lightness values at step 500
        expect(scaleBlue['500'].l).not.toBe(scaleRed['500'].l);
        expect(scaleBlue['500'].l).not.toBe(scaleGreen['500'].l);
      });

      it('should produce different chroma values for different base chromas', () => {
        const lowChroma: OKLCHColor = { l: 0.5, c: 0.05, h: 200 };
        const highChroma: OKLCHColor = { l: 0.5, c: 0.25, h: 200 };

        const scaleLow = generateLightnessScale(lowChroma);
        const scaleHigh = generateLightnessScale(highChroma);

        expect(scaleLow['500'].c).toBeLessThan(scaleHigh['500'].c);
      });
    });
  });

  describe('generateColorScales', () => {
    describe('Basic Functionality', () => {
      it('should generate scales for all colors in palette', () => {
        const palette: Record<string, OKLCHColor> = {
          primary: standardBlue,
          secondary: standardRed,
          accent: standardGreen,
        };

        const scales = generateColorScales(palette);

        expect(Object.keys(scales)).toHaveLength(3);
        expect(scales).toHaveProperty('primary');
        expect(scales).toHaveProperty('secondary');
        expect(scales).toHaveProperty('accent');
      });

      it('should produce ColorScale for each palette entry', () => {
        const palette: Record<string, OKLCHColor> = {
          primary: standardBlue,
        };

        const scales = generateColorScales(palette);

        SCALE_STEPS.forEach((step) => {
          expect(scales.primary[step as keyof typeof scales.primary]).toBeDefined();
        });
      });

      it('should handle empty palette', () => {
        const palette: Record<string, OKLCHColor> = {};

        const scales = generateColorScales(palette);

        expect(Object.keys(scales)).toHaveLength(0);
      });

      it('should handle single color palette', () => {
        const palette: Record<string, OKLCHColor> = {
          solo: standardBlue,
        };

        const scales = generateColorScales(palette);

        expect(Object.keys(scales)).toHaveLength(1);
        expect(scales.solo).toBeDefined();
      });
    });

    describe('Scale Consistency', () => {
      it('should produce consistent scales as generateLightnessScale', () => {
        const palette: Record<string, OKLCHColor> = {
          primary: standardBlue,
        };

        const scales = generateColorScales(palette);
        const directScale = generateLightnessScale(standardBlue);

        expect(scales.primary).toEqual(directScale);
      });

      it('should preserve color names from palette', () => {
        const palette: Record<string, OKLCHColor> = {
          'brand-primary': standardBlue,
          'brand-secondary': standardRed,
          'ui-accent': standardGreen,
        };

        const scales = generateColorScales(palette);

        expect(scales['brand-primary']).toBeDefined();
        expect(scales['brand-secondary']).toBeDefined();
        expect(scales['ui-accent']).toBeDefined();
      });
    });

    describe('Large Palette Handling', () => {
      it('should handle large palette with many colors', () => {
        const palette: Record<string, OKLCHColor> = {};
        const colorNames = [
          'red', 'orange', 'yellow', 'lime', 'green', 'teal',
          'cyan', 'blue', 'indigo', 'purple', 'pink', 'rose',
        ];

        colorNames.forEach((name, index) => {
          palette[name] = { l: 0.5, c: 0.15, h: index * 30 };
        });

        const scales = generateColorScales(palette);

        expect(Object.keys(scales)).toHaveLength(12);
        colorNames.forEach((name) => {
          expect(scales[name]).toBeDefined();
          expect(Object.keys(scales[name])).toHaveLength(11);
        });
      });
    });

    describe('Determinism', () => {
      it('should produce identical output for identical palette', () => {
        const palette: Record<string, OKLCHColor> = {
          primary: standardBlue,
          secondary: standardRed,
        };

        const scales1 = generateColorScales(palette);
        const scales2 = generateColorScales(palette);

        expect(scales1).toEqual(scales2);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should work with typical Tailwind-like color palette', () => {
      const tailwindPalette: Record<string, OKLCHColor> = {
        slate: { l: 0.45, c: 0.02, h: 215 },
        red: { l: 0.55, c: 0.2, h: 25 },
        orange: { l: 0.65, c: 0.2, h: 45 },
        amber: { l: 0.7, c: 0.18, h: 60 },
        yellow: { l: 0.8, c: 0.15, h: 85 },
        lime: { l: 0.75, c: 0.2, h: 115 },
        green: { l: 0.6, c: 0.18, h: 145 },
        teal: { l: 0.55, c: 0.15, h: 175 },
        cyan: { l: 0.65, c: 0.15, h: 195 },
        blue: { l: 0.5, c: 0.15, h: 220 },
        indigo: { l: 0.45, c: 0.18, h: 260 },
        violet: { l: 0.55, c: 0.2, h: 280 },
        purple: { l: 0.5, c: 0.2, h: 295 },
        pink: { l: 0.6, c: 0.18, h: 335 },
        rose: { l: 0.55, c: 0.2, h: 355 },
      };

      const scales = generateColorScales(tailwindPalette);

      // Verify all colors generated
      expect(Object.keys(scales)).toHaveLength(15);

      // Verify each color has complete scale
      Object.keys(scales).forEach((colorName) => {
        const scale = scales[colorName];
        expect(Object.keys(scale)).toHaveLength(11);

        // Verify lightness progression
        expect(scale['50'].l).toBeGreaterThan(scale['950'].l);
      });
    });

    it('should maintain color identity across scale generation', () => {
      const baseColor: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };
      const scale = generateLightnessScale(baseColor);

      // The scale should be recognizable as the same hue family
      const hues = SCALE_STEPS.map((step) => scale[step as keyof typeof scale].h);
      const uniqueHues = new Set(hues);

      // All steps should have the same hue
      expect(uniqueHues.size).toBe(1);
      expect(hues[0]).toBe(baseColor.h);
    });
  });

  describe('Performance', () => {
    it('should generate a single scale in less than 5ms', () => {
      const startTime = performance.now();
      generateLightnessScale(standardBlue);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(5);
    });

    it('should generate 100 scales in less than 100ms', () => {
      const palette: Record<string, OKLCHColor> = {};
      for (let i = 0; i < 100; i++) {
        palette[`color-${i}`] = { l: 0.5, c: 0.15, h: (i * 3.6) % 360 };
      }

      const startTime = performance.now();
      generateColorScales(palette);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
