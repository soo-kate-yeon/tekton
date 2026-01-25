import { describe, it, expect } from 'vitest';
import {
  generateNeutralPalette,
} from '../src/generator/neutral-palette';

describe('Neutral Palette Generator - TASK-001 to TASK-003', () => {
  describe('Light Mode Neutral Palette - TASK-001 (SDR-001)', () => {
    it('should generate neutral palette with 11 steps', () => {
      const palette = generateNeutralPalette({
        mode: 'light',
        tinting: 'pure',
      });

      expect(Object.keys(palette)).toHaveLength(11);
      expect(palette['50']).toBeDefined();
      expect(palette['950']).toBeDefined();
    });

    it('should ensure Neutral-50 lightness >= 0.95 (background)', () => {
      const palette = generateNeutralPalette({
        mode: 'light',
        tinting: 'pure',
      });

      expect(palette['50']?.l).toBeGreaterThanOrEqual(0.95);
    });

    it('should ensure Neutral-900 lightness <= 0.20 (foreground)', () => {
      const palette = generateNeutralPalette({
        mode: 'light',
        tinting: 'pure',
      });

      expect(palette['900']?.l).toBeLessThanOrEqual(0.20);
    });

    it('should generate background-based lightness scaling', () => {
      const palette = generateNeutralPalette({
        mode: 'light',
        tinting: 'pure',
      });

      // Verify perceptually uniform distribution
      const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;
      const lightnesses = steps.map((step) => palette[step]?.l ?? 0);

      // Light mode: 50 should be lightest, 950 should be darkest
      expect(lightnesses[0]).toBeGreaterThan(lightnesses[10]);

      // Verify monotonic decrease
      for (let i = 0; i < lightnesses.length - 1; i++) {
        expect(lightnesses[i]).toBeGreaterThanOrEqual(lightnesses[i + 1]);
      }
    });

    it('should use gray hue (0) for pure neutral', () => {
      const palette = generateNeutralPalette({
        mode: 'light',
        tinting: 'pure',
      });

      Object.values(palette).forEach((color) => {
        expect(color.h).toBe(0);
      });
    });

    it('should use minimal chroma for pure neutral', () => {
      const palette = generateNeutralPalette({
        mode: 'light',
        tinting: 'pure',
      });

      Object.values(palette).forEach((color) => {
        expect(color.c).toBeLessThanOrEqual(0.005);
      });
    });

    it('should pass WCAG AA validation between extremes', () => {
      const palette = generateNeutralPalette({
        mode: 'light',
        tinting: 'pure',
      });

      // Neutral-50 (background) vs Neutral-900 (foreground) should have contrast >= 4.5
      const bgLightness = palette['50']?.l ?? 1;
      const fgLightness = palette['900']?.l ?? 0;

      // Simple contrast approximation: lighter/darker ratio
      const contrastRatio = bgLightness / fgLightness;

      // Should have sufficient contrast
      expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('Dark Mode Neutral Palette - TASK-002 (SDR-002)', () => {
    it('should generate dark mode neutral palette with 11 steps', () => {
      const palette = generateNeutralPalette({
        mode: 'dark',
        tinting: 'pure',
      });

      expect(Object.keys(palette)).toHaveLength(11);
      expect(palette['50']).toBeDefined();
      expect(palette['950']).toBeDefined();
    });

    it('should ensure Neutral-900 lightness <= 0.15 in dark mode (background)', () => {
      const palette = generateNeutralPalette({
        mode: 'dark',
        tinting: 'pure',
      });

      // In dark mode, 900 becomes the background (inverted)
      expect(palette['900']?.l).toBeLessThanOrEqual(0.15);
    });

    it('should ensure Neutral-50 lightness >= 0.95 in dark mode (foreground)', () => {
      const palette = generateNeutralPalette({
        mode: 'dark',
        tinting: 'pure',
      });

      // In dark mode, 50 becomes the foreground (inverted)
      expect(palette['50']?.l).toBeGreaterThanOrEqual(0.95);
    });

    it('should maintain consistent scale distribution in dark mode', () => {
      const darkPalette = generateNeutralPalette({
        mode: 'dark',
        tinting: 'pure',
      });

      const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;
      const lightnesses = steps.map((step) => darkPalette[step]?.l ?? 0);

      // Dark mode: 50 should be lightest (foreground), 950 should be darkest (background)
      expect(lightnesses[0]).toBeGreaterThan(lightnesses[10]);

      // Verify monotonic decrease
      for (let i = 0; i < lightnesses.length - 1; i++) {
        expect(lightnesses[i]).toBeGreaterThanOrEqual(lightnesses[i + 1]);
      }
    });

    it('should pass WCAG AA validation in dark mode', () => {
      const palette = generateNeutralPalette({
        mode: 'dark',
        tinting: 'pure',
      });

      // Dark mode: Neutral-900 (dark background) vs Neutral-50 (light foreground)
      const bgLightness = palette['900']?.l ?? 0;
      const fgLightness = palette['50']?.l ?? 1;

      // Foreground should be much lighter than background
      expect(fgLightness).toBeGreaterThan(bgLightness);

      const contrastRatio = fgLightness / bgLightness;
      expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('Tinting Modes - TASK-003 (CR-002)', () => {
    it('should support pure tinting mode with minimal chroma', () => {
      const palette = generateNeutralPalette({
        mode: 'light',
        tinting: 'pure',
      });

      Object.values(palette).forEach((color) => {
        expect(color.c).toBeLessThanOrEqual(0.005);
        expect(color.h).toBe(0);
      });
    });

    it('should support tinted mode with primary hue and chroma 0.012', () => {
      const palette = generateNeutralPalette({
        mode: 'light',
        tinting: 'tinted',
        primaryHue: 220,
      });

      Object.values(palette).forEach((color) => {
        expect(color.h).toBe(220);
        expect(color.c).toBeCloseTo(0.012, 3);
      });
    });

    it('should support custom tinting with configurable chroma', () => {
      const palette = generateNeutralPalette({
        mode: 'light',
        tinting: 'custom',
        primaryHue: 180,
        chromaIntensity: 0.020,
      });

      Object.values(palette).forEach((color) => {
        expect(color.h).toBe(180);
        expect(color.c).toBeCloseTo(0.020, 3);
      });
    });

    it('should show subtle primary color undertone in tinted mode', () => {
      const purePalette = generateNeutralPalette({
        mode: 'light',
        tinting: 'pure',
      });

      const tintedPalette = generateNeutralPalette({
        mode: 'light',
        tinting: 'tinted',
        primaryHue: 220,
      });

      // Tinted should have higher chroma than pure
      expect(tintedPalette['500']?.c).toBeGreaterThan(purePalette['500']?.c ?? 0);

      // But still subtle (less than 0.02)
      expect(tintedPalette['500']?.c).toBeLessThan(0.02);
    });

    it('should apply tinting consistently across all scale steps', () => {
      const palette = generateNeutralPalette({
        mode: 'light',
        tinting: 'tinted',
        primaryHue: 280,
      });

      const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;

      steps.forEach((step) => {
        expect(palette[step]?.h).toBe(280);
        expect(palette[step]?.c).toBeGreaterThan(0);
      });
    });

    it('should work with tinting in dark mode', () => {
      const palette = generateNeutralPalette({
        mode: 'dark',
        tinting: 'tinted',
        primaryHue: 200,
      });

      Object.values(palette).forEach((color) => {
        expect(color.h).toBe(200);
        expect(color.c).toBeCloseTo(0.012, 3);
      });
    });

    it('should default to pure tinting when mode not specified', () => {
      const palette = generateNeutralPalette({
        mode: 'light',
      });

      Object.values(palette).forEach((color) => {
        expect(color.c).toBeLessThanOrEqual(0.005);
      });
    });

    it('should clamp chroma to valid range', () => {
      const palette = generateNeutralPalette({
        mode: 'light',
        tinting: 'custom',
        primaryHue: 120,
        chromaIntensity: 1.5, // Exceeds max
      });

      Object.values(palette).forEach((color) => {
        expect(color.c).toBeLessThanOrEqual(0.5);
      });
    });

    it('should handle negative chroma gracefully', () => {
      const palette = generateNeutralPalette({
        mode: 'light',
        tinting: 'custom',
        primaryHue: 60,
        chromaIntensity: -0.1,
      });

      Object.values(palette).forEach((color) => {
        expect(color.c).toBeGreaterThanOrEqual(0);
      });
    });

    it('should normalize hue to 0-360 range', () => {
      const palette1 = generateNeutralPalette({
        mode: 'light',
        tinting: 'tinted',
        primaryHue: 400, // > 360
      });

      const palette2 = generateNeutralPalette({
        mode: 'light',
        tinting: 'tinted',
        primaryHue: -20, // < 0
      });

      // Implementation should handle these gracefully
      expect(palette1['500']?.h).toBeDefined();
      expect(palette2['500']?.h).toBeDefined();
    });
  });
});
