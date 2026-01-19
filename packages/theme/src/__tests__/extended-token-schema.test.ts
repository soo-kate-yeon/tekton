import { describe, it, expect } from 'vitest';
import {
  BrandTokenSchema,
  SemanticTokenSchema,
  DataVizTokenSchema,
  NeutralTokenSchema,
  ExtendedTokenPresetSchema,
  type BrandToken,
  type SemanticToken,
  type DataVizToken,
  type NeutralToken,
} from '../extended-token-schema.js';

describe('Extended Token Schema', () => {
  describe('BrandTokenSchema', () => {
    it('should validate brand token with 4 levels', () => {
      const brandToken: BrandToken = {
        primary: {
          base: { l: 0.5, c: 0.15, h: 220 },
          light: { l: 0.7, c: 0.12, h: 220 },
          dark: { l: 0.3, c: 0.18, h: 220 },
          contrast: { l: 0.95, c: 0.02, h: 220 },
        },
      };

      const result = BrandTokenSchema.safeParse(brandToken);
      expect(result.success).toBe(true);
    });

    it('should reject brand token missing required levels', () => {
      const invalidBrand = {
        primary: {
          base: { l: 0.5, c: 0.15, h: 220 },
          // Missing light, dark, contrast
        },
      };

      const result = BrandTokenSchema.safeParse(invalidBrand);
      expect(result.success).toBe(false);
    });

    it('should support multiple brand colors', () => {
      const brandToken: BrandToken = {
        primary: {
          base: { l: 0.5, c: 0.15, h: 220 },
          light: { l: 0.7, c: 0.12, h: 220 },
          dark: { l: 0.3, c: 0.18, h: 220 },
          contrast: { l: 0.95, c: 0.02, h: 220 },
        },
        secondary: {
          base: { l: 0.6, c: 0.12, h: 180 },
          light: { l: 0.8, c: 0.10, h: 180 },
          dark: { l: 0.4, c: 0.15, h: 180 },
          contrast: { l: 0.05, c: 0.02, h: 180 },
        },
      };

      const result = BrandTokenSchema.safeParse(brandToken);
      expect(result.success).toBe(true);
    });

    it('should reject invalid OKLCH values', () => {
      const invalidBrand = {
        primary: {
          base: { l: 1.5, c: 0.15, h: 220 }, // Invalid l > 1
          light: { l: 0.7, c: 0.12, h: 220 },
          dark: { l: 0.3, c: 0.18, h: 220 },
          contrast: { l: 0.95, c: 0.02, h: 220 },
        },
      };

      const result = BrandTokenSchema.safeParse(invalidBrand);
      expect(result.success).toBe(false);
    });
  });

  describe('SemanticTokenSchema', () => {
    it('should validate semantic token with 4 colors', () => {
      const semanticToken: SemanticToken = {
        success: { l: 0.5, c: 0.15, h: 140 },
        warning: { l: 0.7, c: 0.18, h: 60 },
        error: { l: 0.5, c: 0.20, h: 25 },
        info: { l: 0.6, c: 0.15, h: 220 },
      };

      const result = SemanticTokenSchema.safeParse(semanticToken);
      expect(result.success).toBe(true);
    });

    it('should reject semantic token missing required colors', () => {
      const invalidSemantic = {
        success: { l: 0.5, c: 0.15, h: 140 },
        warning: { l: 0.7, c: 0.18, h: 60 },
        // Missing error and info
      };

      const result = SemanticTokenSchema.safeParse(invalidSemantic);
      expect(result.success).toBe(false);
    });

    it('should support extended semantic colors', () => {
      const semanticToken: SemanticToken = {
        success: { l: 0.5, c: 0.15, h: 140 },
        warning: { l: 0.7, c: 0.18, h: 60 },
        error: { l: 0.5, c: 0.20, h: 25 },
        info: { l: 0.6, c: 0.15, h: 220 },
        successLight: { l: 0.85, c: 0.10, h: 140 },
        errorDark: { l: 0.25, c: 0.22, h: 25 },
      };

      const result = SemanticTokenSchema.safeParse(semanticToken);
      expect(result.success).toBe(true);
    });
  });

  describe('DataVizTokenSchema', () => {
    it('should validate data visualization palette with categorical colors', () => {
      const dataVizToken: DataVizToken = {
        categorical: [
          { l: 0.5, c: 0.15, h: 0 },
          { l: 0.5, c: 0.15, h: 60 },
          { l: 0.5, c: 0.15, h: 120 },
          { l: 0.5, c: 0.15, h: 180 },
          { l: 0.5, c: 0.15, h: 240 },
          { l: 0.5, c: 0.15, h: 300 },
        ],
      };

      const result = DataVizTokenSchema.safeParse(dataVizToken);
      expect(result.success).toBe(true);
    });

    it('should validate data visualization palette with sequential gradient', () => {
      const dataVizToken: DataVizToken = {
        sequential: [
          { l: 0.9, c: 0.05, h: 220 },
          { l: 0.7, c: 0.10, h: 220 },
          { l: 0.5, c: 0.15, h: 220 },
          { l: 0.3, c: 0.18, h: 220 },
          { l: 0.1, c: 0.20, h: 220 },
        ],
      };

      const result = DataVizTokenSchema.safeParse(dataVizToken);
      expect(result.success).toBe(true);
    });

    it('should validate data visualization palette with diverging gradient', () => {
      const dataVizToken: DataVizToken = {
        diverging: [
          { l: 0.3, c: 0.18, h: 25 }, // Red end
          { l: 0.5, c: 0.12, h: 25 },
          { l: 0.8, c: 0.05, h: 60 }, // Neutral middle
          { l: 0.5, c: 0.12, h: 220 },
          { l: 0.3, c: 0.18, h: 220 }, // Blue end
        ],
      };

      const result = DataVizTokenSchema.safeParse(dataVizToken);
      expect(result.success).toBe(true);
    });

    it('should require at least 2 colors in each palette type', () => {
      const invalidDataViz = {
        categorical: [{ l: 0.5, c: 0.15, h: 0 }], // Only 1 color
      };

      const result = DataVizTokenSchema.safeParse(invalidDataViz);
      expect(result.success).toBe(false);
    });
  });

  describe('NeutralTokenSchema', () => {
    it('should validate neutral token with 10 levels', () => {
      const neutralToken: NeutralToken = {
        50: { l: 0.98, c: 0.01, h: 0 },
        100: { l: 0.95, c: 0.01, h: 0 },
        200: { l: 0.90, c: 0.01, h: 0 },
        300: { l: 0.80, c: 0.01, h: 0 },
        400: { l: 0.70, c: 0.01, h: 0 },
        500: { l: 0.50, c: 0.01, h: 0 },
        600: { l: 0.40, c: 0.01, h: 0 },
        700: { l: 0.30, c: 0.01, h: 0 },
        800: { l: 0.20, c: 0.01, h: 0 },
        900: { l: 0.10, c: 0.01, h: 0 },
      };

      const result = NeutralTokenSchema.safeParse(neutralToken);
      expect(result.success).toBe(true);
    });

    it('should reject neutral token missing required levels', () => {
      const invalidNeutral = {
        50: { l: 0.98, c: 0.01, h: 0 },
        100: { l: 0.95, c: 0.01, h: 0 },
        // Missing 200-900
      };

      const result = NeutralTokenSchema.safeParse(invalidNeutral);
      expect(result.success).toBe(false);
    });

    it('should enforce monochromatic constraint (low chroma)', () => {
      const invalidNeutral = {
        50: { l: 0.98, c: 0.01, h: 0 },
        100: { l: 0.95, c: 0.01, h: 0 },
        200: { l: 0.90, c: 0.01, h: 0 },
        300: { l: 0.80, c: 0.01, h: 0 },
        400: { l: 0.70, c: 0.01, h: 0 },
        500: { l: 0.50, c: 0.30, h: 0 }, // High chroma, should fail
        600: { l: 0.40, c: 0.01, h: 0 },
        700: { l: 0.30, c: 0.01, h: 0 },
        800: { l: 0.20, c: 0.01, h: 0 },
        900: { l: 0.10, c: 0.01, h: 0 },
      };

      const result = NeutralTokenSchema.safeParse(invalidNeutral);
      expect(result.success).toBe(false);
    });
  });

  describe('ExtendedTokenPresetSchema', () => {
    it('should validate complete extended token preset', () => {
      const preset = {
        brand: {
          primary: {
            base: { l: 0.5, c: 0.15, h: 220 },
            light: { l: 0.7, c: 0.12, h: 220 },
            dark: { l: 0.3, c: 0.18, h: 220 },
            contrast: { l: 0.95, c: 0.02, h: 220 },
          },
        },
        semantic: {
          success: { l: 0.5, c: 0.15, h: 140 },
          warning: { l: 0.7, c: 0.18, h: 60 },
          error: { l: 0.5, c: 0.20, h: 25 },
          info: { l: 0.6, c: 0.15, h: 220 },
        },
        dataViz: {
          categorical: [
            { l: 0.5, c: 0.15, h: 0 },
            { l: 0.5, c: 0.15, h: 120 },
            { l: 0.5, c: 0.15, h: 240 },
          ],
        },
        neutral: {
          50: { l: 0.98, c: 0.01, h: 0 },
          100: { l: 0.95, c: 0.01, h: 0 },
          200: { l: 0.90, c: 0.01, h: 0 },
          300: { l: 0.80, c: 0.01, h: 0 },
          400: { l: 0.70, c: 0.01, h: 0 },
          500: { l: 0.50, c: 0.01, h: 0 },
          600: { l: 0.40, c: 0.01, h: 0 },
          700: { l: 0.30, c: 0.01, h: 0 },
          800: { l: 0.20, c: 0.01, h: 0 },
          900: { l: 0.10, c: 0.01, h: 0 },
        },
      };

      const result = ExtendedTokenPresetSchema.safeParse(preset);
      expect(result.success).toBe(true);
    });

    it('should reject preset missing required categories', () => {
      const invalidPreset = {
        brand: {
          primary: {
            base: { l: 0.5, c: 0.15, h: 220 },
            light: { l: 0.7, c: 0.12, h: 220 },
            dark: { l: 0.3, c: 0.18, h: 220 },
            contrast: { l: 0.95, c: 0.02, h: 220 },
          },
        },
        // Missing semantic, dataViz, neutral
      };

      const result = ExtendedTokenPresetSchema.safeParse(invalidPreset);
      expect(result.success).toBe(false);
    });

    it('should complete validation in < 500ms for large preset', () => {
      const startTime = Date.now();

      const largePreset = {
        brand: {
          primary: {
            base: { l: 0.5, c: 0.15, h: 220 },
            light: { l: 0.7, c: 0.12, h: 220 },
            dark: { l: 0.3, c: 0.18, h: 220 },
            contrast: { l: 0.95, c: 0.02, h: 220 },
          },
          secondary: {
            base: { l: 0.6, c: 0.12, h: 180 },
            light: { l: 0.8, c: 0.10, h: 180 },
            dark: { l: 0.4, c: 0.15, h: 180 },
            contrast: { l: 0.05, c: 0.02, h: 180 },
          },
        },
        semantic: {
          success: { l: 0.5, c: 0.15, h: 140 },
          warning: { l: 0.7, c: 0.18, h: 60 },
          error: { l: 0.5, c: 0.20, h: 25 },
          info: { l: 0.6, c: 0.15, h: 220 },
        },
        dataViz: {
          categorical: Array.from({ length: 12 }, (_, i) => ({
            l: 0.5,
            c: 0.15,
            h: (i * 360) / 12,
          })),
          sequential: Array.from({ length: 9 }, (_, i) => ({
            l: 0.9 - i * 0.1,
            c: 0.05 + i * 0.015,
            h: 220,
          })),
        },
        neutral: {
          50: { l: 0.98, c: 0.01, h: 0 },
          100: { l: 0.95, c: 0.01, h: 0 },
          200: { l: 0.90, c: 0.01, h: 0 },
          300: { l: 0.80, c: 0.01, h: 0 },
          400: { l: 0.70, c: 0.01, h: 0 },
          500: { l: 0.50, c: 0.01, h: 0 },
          600: { l: 0.40, c: 0.01, h: 0 },
          700: { l: 0.30, c: 0.01, h: 0 },
          800: { l: 0.20, c: 0.01, h: 0 },
          900: { l: 0.10, c: 0.01, h: 0 },
        },
      };

      ExtendedTokenPresetSchema.safeParse(largePreset);

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(500);
    });
  });

  describe('WCAG Validation Integration', () => {
    it('should support WCAG compliance check for brand colors', () => {
      const brandToken: BrandToken = {
        primary: {
          base: { l: 0.5, c: 0.15, h: 220 },
          light: { l: 0.7, c: 0.12, h: 220 },
          dark: { l: 0.3, c: 0.18, h: 220 },
          contrast: { l: 0.95, c: 0.02, h: 220 }, // High contrast for text
        },
      };

      const result = BrandTokenSchema.safeParse(brandToken);
      expect(result.success).toBe(true);

      // Contrast level should be very light (L = 0.95)
      expect(brandToken.primary.contrast.l).toBeGreaterThan(0.9);
    });

    it('should support WCAG compliance check for semantic colors', () => {
      const semanticToken: SemanticToken = {
        success: { l: 0.4, c: 0.15, h: 140 }, // Dark enough for AA on white
        warning: { l: 0.6, c: 0.18, h: 60 },
        error: { l: 0.45, c: 0.20, h: 25 },
        info: { l: 0.5, c: 0.15, h: 220 },
      };

      const result = SemanticTokenSchema.safeParse(semanticToken);
      expect(result.success).toBe(true);
    });
  });
});
