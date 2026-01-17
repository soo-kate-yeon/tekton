/**
 * Preset Override Tests
 * Tests for custom token overrides with validation
 */

import { describe, it, expect } from 'vitest';
import {
  overridePresetTokens,
  validateOverride,
  mergeTokens,
} from '../../src/utils/override.js';
import type { SemanticToken } from '../../src/schemas/index.js';

describe('Preset Override', () => {
  const baseTokens: SemanticToken = {
    primary: {
      '50': 'oklch(0.95 0.05 220)',
      '100': 'oklch(0.90 0.08 220)',
      '200': 'oklch(0.85 0.10 220)',
      '300': 'oklch(0.80 0.12 220)',
      '400': 'oklch(0.70 0.14 220)',
      '500': 'oklch(0.60 0.15 220)',
      '600': 'oklch(0.50 0.15 220)',
      '700': 'oklch(0.40 0.14 220)',
      '800': 'oklch(0.30 0.12 220)',
      '900': 'oklch(0.20 0.10 220)',
    },
    neutral: {
      '50': 'oklch(0.98 0.01 220)',
      '100': 'oklch(0.95 0.01 220)',
      '200': 'oklch(0.90 0.01 220)',
      '300': 'oklch(0.85 0.01 220)',
      '400': 'oklch(0.70 0.01 220)',
      '500': 'oklch(0.60 0.01 220)',
      '600': 'oklch(0.50 0.01 220)',
      '700': 'oklch(0.40 0.01 220)',
      '800': 'oklch(0.30 0.01 220)',
      '900': 'oklch(0.20 0.01 220)',
    },
    success: {
      '50': 'oklch(0.95 0.05 140)',
      '100': 'oklch(0.90 0.08 140)',
      '200': 'oklch(0.85 0.10 140)',
      '300': 'oklch(0.80 0.12 140)',
      '400': 'oklch(0.70 0.14 140)',
      '500': 'oklch(0.60 0.15 140)',
      '600': 'oklch(0.50 0.15 140)',
      '700': 'oklch(0.40 0.14 140)',
      '800': 'oklch(0.30 0.12 140)',
      '900': 'oklch(0.20 0.10 140)',
    },
    warning: {
      '50': 'oklch(0.95 0.05 60)',
      '100': 'oklch(0.90 0.08 60)',
      '200': 'oklch(0.85 0.10 60)',
      '300': 'oklch(0.80 0.12 60)',
      '400': 'oklch(0.70 0.14 60)',
      '500': 'oklch(0.60 0.15 60)',
      '600': 'oklch(0.50 0.15 60)',
      '700': 'oklch(0.40 0.14 60)',
      '800': 'oklch(0.30 0.12 60)',
      '900': 'oklch(0.20 0.10 60)',
    },
    error: {
      '50': 'oklch(0.95 0.05 20)',
      '100': 'oklch(0.90 0.08 20)',
      '200': 'oklch(0.85 0.10 20)',
      '300': 'oklch(0.80 0.12 20)',
      '400': 'oklch(0.70 0.14 20)',
      '500': 'oklch(0.60 0.15 20)',
      '600': 'oklch(0.50 0.15 20)',
      '700': 'oklch(0.40 0.14 20)',
      '800': 'oklch(0.30 0.12 20)',
      '900': 'oklch(0.20 0.10 20)',
    },
  };

  describe('overridePresetTokens', () => {
    it('should override specific token values', () => {
      const overrides: Partial<SemanticToken> = {
        primary: {
          '500': 'oklch(0.65 0.15 200)',
        } as any,
      };

      const result = overridePresetTokens(baseTokens, overrides);

      expect(result.primary['500']).toBe('oklch(0.65 0.15 200)');
      expect(result.primary['600']).toBe('oklch(0.50 0.15 220)'); // Unchanged
    });

    it('should add new semantic tokens', () => {
      const overrides: Partial<SemanticToken> = {
        secondary: {
          '50': 'oklch(0.95 0.05 300)',
          '100': 'oklch(0.90 0.08 300)',
          '200': 'oklch(0.85 0.10 300)',
          '300': 'oklch(0.80 0.12 300)',
          '400': 'oklch(0.70 0.14 300)',
          '500': 'oklch(0.60 0.15 300)',
          '600': 'oklch(0.50 0.15 300)',
          '700': 'oklch(0.40 0.14 300)',
          '800': 'oklch(0.30 0.12 300)',
          '900': 'oklch(0.20 0.10 300)',
        },
      };

      const result = overridePresetTokens(baseTokens, overrides);

      expect(result.secondary).toBeDefined();
      expect(result.secondary?.['500']).toBe('oklch(0.60 0.15 300)');
    });

    it('should preserve unmodified tokens', () => {
      const overrides: Partial<SemanticToken> = {
        primary: {
          '500': 'oklch(0.65 0.15 200)',
        } as any,
      };

      const result = overridePresetTokens(baseTokens, overrides);

      expect(result.neutral).toEqual(baseTokens.neutral);
      expect(result.success).toEqual(baseTokens.success);
      expect(result.warning).toEqual(baseTokens.warning);
      expect(result.error).toEqual(baseTokens.error);
    });

    it('should handle empty overrides', () => {
      const result = overridePresetTokens(baseTokens, {});
      expect(result).toEqual(baseTokens);
    });

    it('should handle multiple token overrides', () => {
      const overrides: Partial<SemanticToken> = {
        primary: {
          '500': 'oklch(0.65 0.15 200)',
          '600': 'oklch(0.55 0.15 200)',
        } as any,
        success: {
          '500': 'oklch(0.65 0.15 150)',
        } as any,
      };

      const result = overridePresetTokens(baseTokens, overrides);

      expect(result.primary['500']).toBe('oklch(0.65 0.15 200)');
      expect(result.primary['600']).toBe('oklch(0.55 0.15 200)');
      expect(result.success['500']).toBe('oklch(0.65 0.15 150)');
    });
  });

  describe('validateOverride', () => {
    it('should validate correct override structure', () => {
      const override: Partial<SemanticToken> = {
        primary: {
          '500': 'oklch(0.65 0.15 200)',
        } as any,
      };

      const result = validateOverride(override);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid color values', () => {
      const override: Partial<SemanticToken> = {
        primary: {
          '500': 'invalid-color',
        } as any,
      };

      const result = validateOverride(override);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate complete color scales', () => {
      const override: Partial<SemanticToken> = {
        accent: {
          '50': 'oklch(0.95 0.05 300)',
          '100': 'oklch(0.90 0.08 300)',
          '200': 'oklch(0.85 0.10 300)',
          '300': 'oklch(0.80 0.12 300)',
          '400': 'oklch(0.70 0.14 300)',
          '500': 'oklch(0.60 0.15 300)',
          '600': 'oklch(0.50 0.15 300)',
          '700': 'oklch(0.40 0.14 300)',
          '800': 'oklch(0.30 0.12 300)',
          '900': 'oklch(0.20 0.10 300)',
        },
      };

      const result = validateOverride(override);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid step numbers', () => {
      const override = {
        primary: {
          '999': 'oklch(0.5 0.1 220)',
        },
      };

      const result = validateOverride(override as any);
      expect(result.valid).toBe(false);
    });

    it('should handle empty overrides as valid', () => {
      const result = validateOverride({});
      expect(result.valid).toBe(true);
    });

    it('should detect multiple validation errors', () => {
      const override = {
        primary: {
          '500': 'invalid',
          '999': 'oklch(0.5 0.1 220)',
        },
      };

      const result = validateOverride(override as any);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('mergeTokens', () => {
    it('should merge partial scales into complete scales', () => {
      const partial = {
        primary: {
          '500': 'oklch(0.65 0.15 200)',
        } as any,
      };

      const result = mergeTokens(baseTokens.primary, partial.primary);

      expect(result['500']).toBe('oklch(0.65 0.15 200)');
      expect(result['600']).toBe('oklch(0.50 0.15 220)');
      expect(result['50']).toBe('oklch(0.95 0.05 220)');
    });

    it('should handle empty partial scales', () => {
      const result = mergeTokens(baseTokens.primary, {} as any);
      expect(result).toEqual(baseTokens.primary);
    });

    it('should replace all steps if provided', () => {
      const newScale = {
        '50': 'oklch(0.99 0.01 300)',
        '100': 'oklch(0.95 0.02 300)',
        '200': 'oklch(0.90 0.03 300)',
        '300': 'oklch(0.85 0.04 300)',
        '400': 'oklch(0.75 0.05 300)',
        '500': 'oklch(0.65 0.06 300)',
        '600': 'oklch(0.55 0.07 300)',
        '700': 'oklch(0.45 0.06 300)',
        '800': 'oklch(0.35 0.05 300)',
        '900': 'oklch(0.25 0.04 300)',
      };

      const result = mergeTokens(baseTokens.primary, newScale);

      Object.keys(newScale).forEach((step) => {
        expect(result[step as keyof typeof newScale]).toBe(newScale[step as keyof typeof newScale]);
      });
    });

    it('should handle undefined base scale', () => {
      const partial = {
        '500': 'oklch(0.65 0.15 200)',
      };

      const result = mergeTokens(undefined as any, partial);
      expect(result['500']).toBe('oklch(0.65 0.15 200)');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null overrides gracefully', () => {
      const result = overridePresetTokens(baseTokens, null as any);
      expect(result).toEqual(baseTokens);
    });

    it('should handle undefined overrides gracefully', () => {
      const result = overridePresetTokens(baseTokens, undefined as any);
      expect(result).toEqual(baseTokens);
    });

    it('should validate null values correctly', () => {
      const result = validateOverride(null as any);
      expect(result.valid).toBe(false);
    });

    it('should handle circular reference protection', () => {
      const override: any = {
        primary: {
          '500': 'oklch(0.5 0.1 220)',
        },
      };
      override.primary.circular = override;

      // Should not throw
      const result = overridePresetTokens(baseTokens, override);
      expect(result.primary['500']).toBe('oklch(0.5 0.1 220)');
    });
  });
});
