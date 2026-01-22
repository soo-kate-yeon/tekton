/**
 * Semantic Mapper Tests
 *
 * TASK-004: Semantic token mapping for shadcn/ui convention
 *
 * Tests comprehensive coverage for:
 * - Light mode semantic token mapping
 * - Dark mode semantic token mapping (lightness adjustments)
 * - All semantic token names (background, foreground, primary, etc.)
 * - Optional color overrides (secondary, destructive, accent)
 * - Default values when optional colors not provided
 * - Scale generation from base colors
 * - Mode-specific adjustments
 * - Valid OKLCH output format
 * - Edge cases: extreme lightness/chroma values
 */

import { describe, it, expect } from 'vitest';
import {
  mapSemanticTokens,
  type SemanticTokenConfig,
  type SemanticTokens,
} from '../src/semantic-mapper.js';
import type { OKLCHColor } from '@tekton/theme';

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
    c.h >= 0 &&
    c.h <= 360
  );
}

/**
 * All semantic token keys expected in the output
 */
const SEMANTIC_TOKEN_KEYS: (keyof SemanticTokens)[] = [
  'background',
  'foreground',
  'primary',
  'secondary',
  'muted',
  'accent',
  'destructive',
  'border',
  'input',
  'ring',
  'card',
  'popover',
];

describe('Semantic Mapper', () => {
  // Standard test configuration for light mode
  const lightModeConfig: SemanticTokenConfig = {
    mode: 'light',
    primary: { l: 0.5, c: 0.15, h: 220 },
    neutral: { l: 0.5, c: 0.01, h: 0 },
  };

  // Standard test configuration for dark mode
  const darkModeConfig: SemanticTokenConfig = {
    mode: 'dark',
    primary: { l: 0.5, c: 0.15, h: 220 },
    neutral: { l: 0.5, c: 0.01, h: 0 },
  };

  describe('mapSemanticTokens - Basic Functionality', () => {
    it('should return an object with all required semantic token keys', () => {
      const result = mapSemanticTokens(lightModeConfig);

      SEMANTIC_TOKEN_KEYS.forEach((key) => {
        expect(result).toHaveProperty(key);
      });
    });

    it('should return valid OKLCH colors for all semantic tokens', () => {
      const result = mapSemanticTokens(lightModeConfig);

      SEMANTIC_TOKEN_KEYS.forEach((key) => {
        expect(
          isValidOKLCH(result[key]),
          `${key} should be a valid OKLCH color`,
        ).toBe(true);
      });
    });

    it('should produce deterministic output for same input', () => {
      const result1 = mapSemanticTokens(lightModeConfig);
      const result2 = mapSemanticTokens(lightModeConfig);

      SEMANTIC_TOKEN_KEYS.forEach((key) => {
        expect(result1[key]).toEqual(result2[key]);
      });
    });
  });

  describe('Light Mode Semantic Token Mapping', () => {
    it('should have very light background in light mode', () => {
      const result = mapSemanticTokens(lightModeConfig);

      // Light mode background should be very light (high lightness)
      expect(result.background.l).toBeGreaterThanOrEqual(0.95);
    });

    it('should have very dark foreground in light mode', () => {
      const result = mapSemanticTokens(lightModeConfig);

      // Light mode foreground should be very dark (low lightness)
      expect(result.foreground.l).toBeLessThanOrEqual(0.2);
    });

    it('should have card same as background in light mode', () => {
      const result = mapSemanticTokens(lightModeConfig);

      expect(result.card).toEqual(result.background);
    });

    it('should have popover same as background in light mode', () => {
      const result = mapSemanticTokens(lightModeConfig);

      expect(result.popover).toEqual(result.background);
    });

    it('should use primary color at 500 scale for primary token', () => {
      const result = mapSemanticTokens(lightModeConfig);

      // Primary should maintain the base lightness in light mode
      expect(result.primary.l).toBeCloseTo(lightModeConfig.primary.l, 1);
      expect(result.primary.c).toBe(lightModeConfig.primary.c);
      expect(result.primary.h).toBe(lightModeConfig.primary.h);
    });

    it('should have subtle muted background in light mode', () => {
      const result = mapSemanticTokens(lightModeConfig);

      // Muted should be a subtle light background (neutral-100 level)
      expect(result.muted.l).toBeGreaterThanOrEqual(0.9);
    });

    it('should have subtle border in light mode', () => {
      const result = mapSemanticTokens(lightModeConfig);

      // Border should be a subtle light gray (neutral-200 level)
      expect(result.border.l).toBeGreaterThanOrEqual(0.8);
    });

    it('should have input same as border in light mode', () => {
      const result = mapSemanticTokens(lightModeConfig);

      expect(result.input).toEqual(result.border);
    });

    it('should have ring matching primary in light mode', () => {
      const result = mapSemanticTokens(lightModeConfig);

      expect(result.ring.h).toBe(result.primary.h);
      expect(result.ring.c).toBe(result.primary.c);
    });
  });

  describe('Dark Mode Semantic Token Mapping', () => {
    it('should have very dark background in dark mode', () => {
      const result = mapSemanticTokens(darkModeConfig);

      // Dark mode background should be very dark (low lightness)
      expect(result.background.l).toBeLessThanOrEqual(0.15);
    });

    it('should have very light foreground in dark mode', () => {
      const result = mapSemanticTokens(darkModeConfig);

      // Dark mode foreground should be very light (high lightness)
      expect(result.foreground.l).toBeGreaterThanOrEqual(0.95);
    });

    it('should have card same as background in dark mode', () => {
      const result = mapSemanticTokens(darkModeConfig);

      expect(result.card).toEqual(result.background);
    });

    it('should have popover same as background in dark mode', () => {
      const result = mapSemanticTokens(darkModeConfig);

      expect(result.popover).toEqual(result.background);
    });

    it('should have lighter primary for visibility in dark mode', () => {
      const result = mapSemanticTokens(darkModeConfig);

      // Primary should be lightened for dark mode visibility (+0.15 max 0.75)
      const expectedLightness = Math.min(
        darkModeConfig.primary.l + 0.15,
        0.75,
      );
      expect(result.primary.l).toBeCloseTo(expectedLightness, 2);
      expect(result.primary.c).toBe(darkModeConfig.primary.c);
      expect(result.primary.h).toBe(darkModeConfig.primary.h);
    });

    it('should have subtle dark muted background in dark mode', () => {
      const result = mapSemanticTokens(darkModeConfig);

      // Muted should be a subtle dark background (neutral-800 level)
      expect(result.muted.l).toBeLessThanOrEqual(0.3);
    });

    it('should have subtle dark border in dark mode', () => {
      const result = mapSemanticTokens(darkModeConfig);

      // Border should be a subtle dark gray (neutral-800 level)
      expect(result.border.l).toBeLessThanOrEqual(0.3);
    });

    it('should have input same as border in dark mode', () => {
      const result = mapSemanticTokens(darkModeConfig);

      expect(result.input).toEqual(result.border);
    });

    it('should have lighter ring for visibility in dark mode', () => {
      const result = mapSemanticTokens(darkModeConfig);

      const expectedLightness = Math.min(
        darkModeConfig.primary.l + 0.15,
        0.75,
      );
      expect(result.ring.l).toBeCloseTo(expectedLightness, 2);
      expect(result.ring.h).toBe(darkModeConfig.primary.h);
    });
  });

  describe('Mode Comparison - Light vs Dark', () => {
    it('should invert background/foreground lightness between modes', () => {
      const lightResult = mapSemanticTokens(lightModeConfig);
      const darkResult = mapSemanticTokens(darkModeConfig);

      // Light mode: light background, dark foreground
      expect(lightResult.background.l).toBeGreaterThan(
        lightResult.foreground.l,
      );

      // Dark mode: dark background, light foreground
      expect(darkResult.background.l).toBeLessThan(darkResult.foreground.l);
    });

    it('should adjust primary lightness for dark mode visibility', () => {
      const lightResult = mapSemanticTokens(lightModeConfig);
      const darkResult = mapSemanticTokens(darkModeConfig);

      // Dark mode primary should be lighter than light mode primary
      expect(darkResult.primary.l).toBeGreaterThan(lightResult.primary.l);
    });

    it('should adjust accent lightness for dark mode visibility', () => {
      const lightResult = mapSemanticTokens(lightModeConfig);
      const darkResult = mapSemanticTokens(darkModeConfig);

      // Dark mode accent should be adjusted for visibility
      expect(darkResult.accent.l).toBeGreaterThan(0.5);
    });

    it('should adjust destructive lightness for dark mode visibility', () => {
      const lightResult = mapSemanticTokens(lightModeConfig);
      const darkResult = mapSemanticTokens(darkModeConfig);

      // Dark mode destructive should be lighter than light mode
      expect(darkResult.destructive.l).toBeGreaterThan(
        lightResult.destructive.l,
      );
    });
  });

  describe('Optional Color Overrides', () => {
    it('should use provided secondary color when specified', () => {
      const customSecondary: OKLCHColor = { l: 0.6, c: 0.12, h: 180 };
      const config: SemanticTokenConfig = {
        ...lightModeConfig,
        secondary: customSecondary,
      };

      const result = mapSemanticTokens(config);

      expect(result.secondary).toEqual(customSecondary);
    });

    it('should use provided destructive color when specified', () => {
      const customDestructive: OKLCHColor = { l: 0.45, c: 0.2, h: 15 };
      const config: SemanticTokenConfig = {
        ...lightModeConfig,
        destructive: customDestructive,
      };

      const result = mapSemanticTokens(config);

      expect(result.destructive).toEqual(customDestructive);
    });

    it('should use provided accent color when specified', () => {
      const customAccent: OKLCHColor = { l: 0.55, c: 0.18, h: 280 };
      const config: SemanticTokenConfig = {
        ...lightModeConfig,
        accent: customAccent,
      };

      const result = mapSemanticTokens(config);

      expect(result.accent).toEqual(customAccent);
    });

    it('should allow all optional colors to be specified together', () => {
      const customSecondary: OKLCHColor = { l: 0.6, c: 0.12, h: 180 };
      const customDestructive: OKLCHColor = { l: 0.45, c: 0.2, h: 15 };
      const customAccent: OKLCHColor = { l: 0.55, c: 0.18, h: 280 };

      const config: SemanticTokenConfig = {
        ...lightModeConfig,
        secondary: customSecondary,
        destructive: customDestructive,
        accent: customAccent,
      };

      const result = mapSemanticTokens(config);

      expect(result.secondary).toEqual(customSecondary);
      expect(result.destructive).toEqual(customDestructive);
      expect(result.accent).toEqual(customAccent);
    });

    it('should use custom colors in dark mode when specified', () => {
      const customSecondary: OKLCHColor = { l: 0.65, c: 0.1, h: 200 };
      const config: SemanticTokenConfig = {
        ...darkModeConfig,
        secondary: customSecondary,
      };

      const result = mapSemanticTokens(config);

      expect(result.secondary).toEqual(customSecondary);
    });
  });

  describe('Default Values When Optional Colors Not Provided', () => {
    it('should generate desaturated secondary from primary when not specified', () => {
      const result = mapSemanticTokens(lightModeConfig);

      // Secondary should be desaturated primary (30% chroma)
      expect(result.secondary.l).toBe(lightModeConfig.primary.l);
      expect(result.secondary.c).toBeCloseTo(lightModeConfig.primary.c * 0.3, 3);
      expect(result.secondary.h).toBe(lightModeConfig.primary.h);
    });

    it('should use default red destructive color when not specified', () => {
      const result = mapSemanticTokens(lightModeConfig);

      // Default destructive is red (hue ~25)
      expect(result.destructive.h).toBe(25);
      expect(result.destructive.c).toBe(0.18);
    });

    it('should use default red destructive color in dark mode with adjusted lightness', () => {
      const result = mapSemanticTokens(darkModeConfig);

      // Dark mode default destructive is lighter (0.6 vs 0.5)
      expect(result.destructive.l).toBe(0.6);
      expect(result.destructive.h).toBe(25);
    });

    it('should use lighter primary as accent in light mode when not specified', () => {
      const result = mapSemanticTokens(lightModeConfig);

      // Accent should be from primary scale 400 (lighter)
      expect(result.accent.h).toBe(lightModeConfig.primary.h);
      expect(result.accent.c).toBe(lightModeConfig.primary.c);
      expect(result.accent.l).toBe(0.65); // Scale 400 lightness
    });

    it('should generate lighter accent for dark mode when not specified', () => {
      const result = mapSemanticTokens(darkModeConfig);

      // Dark mode accent should be lightened (+0.2, max 0.8)
      const expectedLightness = Math.min(
        darkModeConfig.primary.l + 0.2,
        0.8,
      );
      expect(result.accent.l).toBeCloseTo(expectedLightness, 2);
      expect(result.accent.h).toBe(darkModeConfig.primary.h);
    });
  });

  describe('OKLCH Output Format Validation', () => {
    it('should have lightness values between 0 and 1', () => {
      const result = mapSemanticTokens(lightModeConfig);

      SEMANTIC_TOKEN_KEYS.forEach((key) => {
        expect(result[key].l).toBeGreaterThanOrEqual(0);
        expect(result[key].l).toBeLessThanOrEqual(1);
      });
    });

    it('should have non-negative chroma values', () => {
      const result = mapSemanticTokens(lightModeConfig);

      SEMANTIC_TOKEN_KEYS.forEach((key) => {
        expect(result[key].c).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have hue values between 0 and 360', () => {
      const result = mapSemanticTokens(lightModeConfig);

      SEMANTIC_TOKEN_KEYS.forEach((key) => {
        expect(result[key].h).toBeGreaterThanOrEqual(0);
        expect(result[key].h).toBeLessThanOrEqual(360);
      });
    });

    it('should preserve primary hue in derived colors', () => {
      const result = mapSemanticTokens(lightModeConfig);

      // Primary, secondary (derived), accent (derived), and ring should share primary hue
      expect(result.primary.h).toBe(lightModeConfig.primary.h);
      expect(result.secondary.h).toBe(lightModeConfig.primary.h);
      expect(result.ring.h).toBe(lightModeConfig.primary.h);
    });
  });

  describe('Edge Cases', () => {
    it('should handle primary with zero chroma', () => {
      const config: SemanticTokenConfig = {
        mode: 'light',
        primary: { l: 0.5, c: 0, h: 0 },
        neutral: { l: 0.5, c: 0, h: 0 },
      };

      const result = mapSemanticTokens(config);

      expect(result.primary.c).toBe(0);
      expect(result.secondary.c).toBe(0); // 30% of 0 is 0
    });

    it('should handle primary with maximum chroma', () => {
      const config: SemanticTokenConfig = {
        mode: 'light',
        primary: { l: 0.5, c: 0.4, h: 220 },
        neutral: { l: 0.5, c: 0.01, h: 0 },
      };

      const result = mapSemanticTokens(config);

      expect(result.primary.c).toBe(0.4);
      expect(result.secondary.c).toBeCloseTo(0.12, 3); // 30% of 0.4
    });

    it('should handle primary with minimum lightness', () => {
      const config: SemanticTokenConfig = {
        mode: 'light',
        primary: { l: 0.1, c: 0.15, h: 220 },
        neutral: { l: 0.5, c: 0.01, h: 0 },
      };

      const result = mapSemanticTokens(config);

      expect(result.primary.l).toBeCloseTo(0.1, 2);
    });

    it('should handle primary with maximum lightness', () => {
      const config: SemanticTokenConfig = {
        mode: 'light',
        primary: { l: 0.95, c: 0.1, h: 220 },
        neutral: { l: 0.5, c: 0.01, h: 0 },
      };

      const result = mapSemanticTokens(config);

      expect(result.primary.l).toBeCloseTo(0.95, 2);
    });

    it('should cap dark mode primary lightness at 0.75', () => {
      const config: SemanticTokenConfig = {
        mode: 'dark',
        primary: { l: 0.7, c: 0.15, h: 220 }, // 0.7 + 0.15 = 0.85, should cap at 0.75
        neutral: { l: 0.5, c: 0.01, h: 0 },
      };

      const result = mapSemanticTokens(config);

      expect(result.primary.l).toBe(0.75);
    });

    it('should cap dark mode accent lightness at 0.8', () => {
      const config: SemanticTokenConfig = {
        mode: 'dark',
        primary: { l: 0.7, c: 0.15, h: 220 }, // 0.7 + 0.2 = 0.9, should cap at 0.8
        neutral: { l: 0.5, c: 0.01, h: 0 },
      };

      const result = mapSemanticTokens(config);

      expect(result.accent.l).toBe(0.8);
    });

    it('should cap dark mode ring lightness at 0.75', () => {
      const config: SemanticTokenConfig = {
        mode: 'dark',
        primary: { l: 0.7, c: 0.15, h: 220 },
        neutral: { l: 0.5, c: 0.01, h: 0 },
      };

      const result = mapSemanticTokens(config);

      expect(result.ring.l).toBe(0.75);
    });

    it('should handle different hue values correctly', () => {
      const hues = [0, 30, 60, 90, 120, 180, 240, 300, 360];

      hues.forEach((hue) => {
        const config: SemanticTokenConfig = {
          mode: 'light',
          primary: { l: 0.5, c: 0.15, h: hue },
          neutral: { l: 0.5, c: 0.01, h: 0 },
        };

        const result = mapSemanticTokens(config);

        expect(result.primary.h).toBe(hue);
        expect(result.secondary.h).toBe(hue);
      });
    });
  });

  describe('Shadcn/ui Convention Compliance', () => {
    it('should generate all required shadcn/ui semantic token names', () => {
      const result = mapSemanticTokens(lightModeConfig);

      // These are the standard shadcn/ui semantic token names
      const shadcnTokens = [
        'background',
        'foreground',
        'card',
        'popover',
        'primary',
        'secondary',
        'muted',
        'accent',
        'destructive',
        'border',
        'input',
        'ring',
      ];

      shadcnTokens.forEach((token) => {
        expect(result).toHaveProperty(token);
      });
    });

    it('should have appropriate contrast between background and foreground', () => {
      const lightResult = mapSemanticTokens(lightModeConfig);
      const darkResult = mapSemanticTokens(darkModeConfig);

      // Light mode: high contrast (background ~0.98, foreground ~0.15)
      const lightContrast =
        lightResult.background.l - lightResult.foreground.l;
      expect(Math.abs(lightContrast)).toBeGreaterThan(0.7);

      // Dark mode: high contrast (background ~0.10, foreground ~0.98)
      const darkContrast = darkResult.foreground.l - darkResult.background.l;
      expect(Math.abs(darkContrast)).toBeGreaterThan(0.7);
    });

    it('should have muted color be subtle variation of background', () => {
      const lightResult = mapSemanticTokens(lightModeConfig);
      const darkResult = mapSemanticTokens(darkModeConfig);

      // Light mode: muted should be slightly darker than background
      expect(lightResult.muted.l).toBeLessThan(lightResult.background.l);
      expect(lightResult.muted.l).toBeGreaterThan(0.85);

      // Dark mode: muted should be slightly lighter than background
      expect(darkResult.muted.l).toBeGreaterThan(darkResult.background.l);
      expect(darkResult.muted.l).toBeLessThan(0.3);
    });
  });

  describe('Scale Generation', () => {
    it('should generate primary scale with correct lightness progression', () => {
      // The generateScale function is internal, but we can verify its effects
      // through the primary token which uses scale['500']
      const result = mapSemanticTokens(lightModeConfig);

      // Primary should be at scale 500, which uses base lightness
      expect(result.primary.l).toBeCloseTo(lightModeConfig.primary.l, 1);
    });

    it('should use scale 400 for light mode accent', () => {
      const result = mapSemanticTokens(lightModeConfig);

      // Scale 400 has lightness of 0.65
      expect(result.accent.l).toBe(0.65);
    });
  });

  describe('Performance', () => {
    it('should complete mapping in under 5ms', () => {
      const startTime = performance.now();

      for (let i = 0; i < 100; i++) {
        mapSemanticTokens(lightModeConfig);
      }

      const endTime = performance.now();
      const avgTime = (endTime - startTime) / 100;

      expect(avgTime).toBeLessThan(5);
    });
  });

  describe('Type Safety', () => {
    it('should accept valid SemanticTokenConfig', () => {
      const config: SemanticTokenConfig = {
        mode: 'light',
        primary: { l: 0.5, c: 0.15, h: 220 },
        neutral: { l: 0.5, c: 0.01, h: 0 },
      };

      // Should not throw
      expect(() => mapSemanticTokens(config)).not.toThrow();
    });

    it('should return SemanticTokens type', () => {
      const result = mapSemanticTokens(lightModeConfig);

      // Type assertion - if this compiles, the types are correct
      const _: SemanticTokens = result;
      expect(result).toBeDefined();
    });
  });
});
