/**
 * TASK-009: Gamut Clipping Handler Tests
 * TASK-010: Semantic Token Mapping Tests
 * TASK-011: Dark Mode Auto-generation Tests
 * TASK-012: Token Format Conversion Tests
 * TASK-013: Deterministic ID Generation Tests
 * TASK-015: Performance Optimization Tests
 *
 * Comprehensive test suite for token-generator.ts
 * Target: 85% coverage minimum
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { OKLCHColor, TokenDefinition, ColorScale } from '@tekton/theme';
import {
  generateTokenId,
  generateToken,
  TokenGenerator,
} from '../src/token-generator';

// ============================================================================
// TASK-013: Deterministic Token ID Generation
// ============================================================================

describe('TASK-013: generateTokenId', () => {
  describe('Deterministic ID Generation', () => {
    it('should generate the same ID for the same input', () => {
      const color: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };
      const name = 'primary';

      const id1 = generateTokenId(name, color);
      const id2 = generateTokenId(name, color);

      expect(id1).toBe(id2);
    });

    it('should generate different IDs for different colors', () => {
      const color1: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };
      const color2: OKLCHColor = { l: 0.6, c: 0.15, h: 220 };
      const name = 'primary';

      const id1 = generateTokenId(name, color1);
      const id2 = generateTokenId(name, color2);

      expect(id1).not.toBe(id2);
    });

    it('should generate different IDs for different names', () => {
      const color: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };

      const id1 = generateTokenId('primary', color);
      const id2 = generateTokenId('secondary', color);

      expect(id1).not.toBe(id2);
    });

    it('should produce lowercase IDs', () => {
      const color: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };
      const name = 'PRIMARY';

      const id = generateTokenId(name, color);

      expect(id).toBe(id.toLowerCase());
    });

    it('should replace invalid characters with hyphens', () => {
      const color: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };
      const name = 'my color!@#';

      const id = generateTokenId(name, color);

      expect(id).toMatch(/^[a-z0-9-]+$/);
    });

    it('should include color values in the ID', () => {
      const color: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };
      const name = 'test';

      const id = generateTokenId(name, color);

      // ID should contain formatted lightness, chroma, and hue
      expect(id).toContain('0-500');
      expect(id).toContain('0-150');
      expect(id).toContain('220');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero lightness', () => {
      const color: OKLCHColor = { l: 0, c: 0, h: 0 };
      const name = 'black';

      const id = generateTokenId(name, color);

      expect(id).toBeDefined();
      expect(id.length).toBeGreaterThan(0);
    });

    it('should handle maximum lightness', () => {
      const color: OKLCHColor = { l: 1, c: 0, h: 0 };
      const name = 'white';

      const id = generateTokenId(name, color);

      expect(id).toBeDefined();
      expect(id.length).toBeGreaterThan(0);
    });

    it('should handle boundary hue values', () => {
      const color1: OKLCHColor = { l: 0.5, c: 0.1, h: 0 };
      const color2: OKLCHColor = { l: 0.5, c: 0.1, h: 360 };

      const id1 = generateTokenId('test', color1);
      const id2 = generateTokenId('test', color2);

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
    });

    it('should handle empty name', () => {
      const color: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };

      const id = generateTokenId('', color);

      expect(id).toBeDefined();
    });
  });
});

// ============================================================================
// TASK-010: generateToken (Semantic Token Mapping)
// ============================================================================

describe('TASK-010: generateToken', () => {
  describe('Token Definition Structure', () => {
    it('should return a valid TokenDefinition structure', () => {
      const color: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };
      const name = 'primary';

      const token = generateToken(name, color);

      expect(token).toHaveProperty('id');
      expect(token).toHaveProperty('name');
      expect(token).toHaveProperty('value');
      expect(token).toHaveProperty('scale');
      expect(token).toHaveProperty('metadata');
    });

    it('should preserve the token name', () => {
      const color: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };
      const name = 'accent';

      const token = generateToken(name, color);

      expect(token.name).toBe(name);
    });

    it('should generate a deterministic ID', () => {
      const color: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };
      const name = 'primary';

      const token1 = generateToken(name, color);
      const token2 = generateToken(name, color);

      expect(token1.id).toBe(token2.id);
    });

    it('should include timestamp in metadata', () => {
      const color: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };
      const name = 'primary';

      const token = generateToken(name, color);

      expect(token.metadata).toHaveProperty('generated');
      expect(typeof token.metadata?.generated).toBe('string');
    });
  });

  describe('Color Scale Generation', () => {
    it('should generate a complete color scale', () => {
      const color: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };
      const name = 'primary';

      const token = generateToken(name, color);
      const scale = token.scale;

      expect(scale).toBeDefined();
      expect(scale).toHaveProperty('50');
      expect(scale).toHaveProperty('100');
      expect(scale).toHaveProperty('200');
      expect(scale).toHaveProperty('300');
      expect(scale).toHaveProperty('400');
      expect(scale).toHaveProperty('500');
      expect(scale).toHaveProperty('600');
      expect(scale).toHaveProperty('700');
      expect(scale).toHaveProperty('800');
      expect(scale).toHaveProperty('900');
      expect(scale).toHaveProperty('950');
    });

    it('should preserve hue across all scale steps', () => {
      const color: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };
      const name = 'primary';

      const token = generateToken(name, color);
      const scale = token.scale!;

      Object.values(scale).forEach((step) => {
        expect(step.h).toBe(color.h);
      });
    });

    it('should have lighter values at lower scale numbers', () => {
      const color: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };
      const name = 'primary';

      const token = generateToken(name, color);
      const scale = token.scale!;

      expect(scale['50'].l).toBeGreaterThan(scale['500'].l);
      expect(scale['100'].l).toBeGreaterThan(scale['500'].l);
      expect(scale['200'].l).toBeGreaterThan(scale['500'].l);
    });

    it('should have darker values at higher scale numbers', () => {
      const color: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };
      const name = 'primary';

      const token = generateToken(name, color);
      const scale = token.scale!;

      expect(scale['700'].l).toBeLessThan(scale['500'].l);
      expect(scale['800'].l).toBeLessThan(scale['500'].l);
      expect(scale['900'].l).toBeLessThan(scale['500'].l);
    });
  });

  describe('TASK-009: Gamut Clipping', () => {
    it('should clip out-of-gamut colors to valid RGB range', () => {
      // High chroma color that may be out of gamut
      const color: OKLCHColor = { l: 0.5, c: 0.4, h: 180 };
      const name = 'vibrant';

      const token = generateToken(name, color);

      // Value should be clipped - chroma may be reduced
      expect(token.value.c).toBeLessThanOrEqual(0.4);
      expect(token.value.l).toBe(color.l); // Lightness preserved
      expect(token.value.h).toBe(color.h); // Hue preserved
    });

    it('should mark gamut-clipped tokens in metadata', () => {
      // High chroma color that will need clipping
      const color: OKLCHColor = { l: 0.5, c: 0.45, h: 180 };
      const name = 'extreme';

      const token = generateToken(name, color);

      expect(token.metadata).toHaveProperty('gamutClipped');
      // gamutClipped should be true if chroma was reduced
      if (token.value.c < color.c) {
        expect(token.metadata?.gamutClipped).toBe(true);
      }
    });

    it('should not modify colors already in gamut', () => {
      // Low chroma color that should be in gamut
      const color: OKLCHColor = { l: 0.5, c: 0.1, h: 220 };
      const name = 'subtle';

      const token = generateToken(name, color);

      // Value should be unchanged
      expect(token.metadata?.gamutClipped).toBe(false);
    });
  });

  describe('Input Validation', () => {
    it('should throw error for invalid lightness', () => {
      const invalidColor = { l: 1.5, c: 0.15, h: 220 } as OKLCHColor;

      expect(() => generateToken('test', invalidColor)).toThrow();
    });

    it('should throw error for negative lightness', () => {
      const invalidColor = { l: -0.1, c: 0.15, h: 220 } as OKLCHColor;

      expect(() => generateToken('test', invalidColor)).toThrow();
    });

    it('should throw error for invalid chroma', () => {
      const invalidColor = { l: 0.5, c: 0.6, h: 220 } as OKLCHColor;

      expect(() => generateToken('test', invalidColor)).toThrow();
    });

    it('should throw error for invalid hue', () => {
      const invalidColor = { l: 0.5, c: 0.15, h: 400 } as OKLCHColor;

      expect(() => generateToken('test', invalidColor)).toThrow();
    });
  });
});

// ============================================================================
// TASK-011: TokenGenerator Class - Dark Mode Auto-generation
// ============================================================================

describe('TASK-011: TokenGenerator Class', () => {
  describe('Constructor and Configuration', () => {
    it('should create instance with default config', () => {
      const generator = new TokenGenerator();

      expect(generator).toBeInstanceOf(TokenGenerator);
    });

    it('should accept custom configuration', () => {
      const generator = new TokenGenerator({
        generateDarkMode: true,
        validateWCAG: true,
        wcagLevel: 'AAA',
      });

      expect(generator).toBeInstanceOf(TokenGenerator);
    });
  });

  describe('generateTokens', () => {
    let generator: TokenGenerator;

    beforeEach(() => {
      generator = new TokenGenerator();
    });

    it('should generate tokens from a palette', () => {
      const palette: Record<string, OKLCHColor> = {
        primary: { l: 0.5, c: 0.15, h: 220 },
        secondary: { l: 0.6, c: 0.1, h: 180 },
      };

      const tokens = generator.generateTokens(palette);

      expect(tokens).toHaveLength(2);
      expect(tokens[0].name).toBe('primary');
      expect(tokens[1].name).toBe('secondary');
    });

    it('should generate dark mode variants when enabled', () => {
      const generator = new TokenGenerator({ generateDarkMode: true });
      const palette: Record<string, OKLCHColor> = {
        primary: { l: 0.5, c: 0.15, h: 220 },
      };

      const tokens = generator.generateTokens(palette);

      // Should have both light and dark versions
      expect(tokens).toHaveLength(2);
      expect(tokens.some(t => t.name === 'primary')).toBe(true);
      expect(tokens.some(t => t.name === 'primary-dark')).toBe(true);
    });

    it('should return empty array for empty palette', () => {
      const tokens = generator.generateTokens({});

      expect(tokens).toHaveLength(0);
    });
  });

  describe('Dark Mode Variant Generation', () => {
    let generator: TokenGenerator;

    beforeEach(() => {
      generator = new TokenGenerator({ generateDarkMode: true });
    });

    it('should invert lightness for dark mode', () => {
      const palette: Record<string, OKLCHColor> = {
        test: { l: 0.3, c: 0.15, h: 220 },
      };

      const tokens = generator.generateTokens(palette);
      const lightToken = tokens.find(t => t.name === 'test');
      const darkToken = tokens.find(t => t.name === 'test-dark');

      expect(lightToken?.value.l).toBeCloseTo(0.3, 1);
      expect(darkToken?.value.l).toBeCloseTo(0.7, 1); // 1 - 0.3 = 0.7
    });

    it('should preserve hue in dark mode variant', () => {
      const palette: Record<string, OKLCHColor> = {
        test: { l: 0.5, c: 0.15, h: 220 },
      };

      const tokens = generator.generateTokens(palette);
      const lightToken = tokens.find(t => t.name === 'test');
      const darkToken = tokens.find(t => t.name === 'test-dark');

      expect(darkToken?.value.h).toBe(lightToken?.value.h);
    });

    it('should preserve chroma in dark mode variant', () => {
      const palette: Record<string, OKLCHColor> = {
        test: { l: 0.5, c: 0.15, h: 220 },
      };

      const tokens = generator.generateTokens(palette);
      const lightToken = tokens.find(t => t.name === 'test');
      const darkToken = tokens.find(t => t.name === 'test-dark');

      expect(darkToken?.value.c).toBe(lightToken?.value.c);
    });

    it('should invert scale lightness values for dark mode', () => {
      const palette: Record<string, OKLCHColor> = {
        test: { l: 0.5, c: 0.15, h: 220 },
      };

      const tokens = generator.generateTokens(palette);
      const lightToken = tokens.find(t => t.name === 'test');
      const darkToken = tokens.find(t => t.name === 'test-dark');

      if (lightToken?.scale && darkToken?.scale) {
        // Each scale step should have inverted lightness
        const lightScale50 = lightToken.scale['50'].l;
        const darkScale50 = darkToken.scale['50'].l;

        expect(darkScale50).toBeCloseTo(1 - lightScale50, 1);
      }
    });

    it('should include darkMode flag in metadata', () => {
      const palette: Record<string, OKLCHColor> = {
        test: { l: 0.5, c: 0.15, h: 220 },
      };

      const tokens = generator.generateTokens(palette);
      const darkToken = tokens.find(t => t.name === 'test-dark');

      expect(darkToken?.metadata?.darkMode).toBe(true);
    });

    it('should generate dark ID with -dark suffix', () => {
      const palette: Record<string, OKLCHColor> = {
        test: { l: 0.5, c: 0.15, h: 220 },
      };

      const tokens = generator.generateTokens(palette);
      const darkToken = tokens.find(t => t.name === 'test-dark');

      expect(darkToken?.id).toContain('-dark');
    });
  });

  describe('TASK-015: Caching', () => {
    let generator: TokenGenerator;

    beforeEach(() => {
      generator = new TokenGenerator();
    });

    it('should cache generated tokens', () => {
      const palette: Record<string, OKLCHColor> = {
        primary: { l: 0.5, c: 0.15, h: 220 },
      };

      const tokens1 = generator.generateTokens(palette);
      const tokens2 = generator.generateTokens(palette);

      // Same reference means it was cached
      expect(tokens1[0]).toBe(tokens2[0]);
    });

    it('should clear cache when clearCache is called', () => {
      const palette: Record<string, OKLCHColor> = {
        primary: { l: 0.5, c: 0.15, h: 220 },
      };

      const tokens1 = generator.generateTokens(palette);
      generator.clearCache();
      const tokens2 = generator.generateTokens(palette);

      // Different references after cache clear
      expect(tokens1[0]).not.toBe(tokens2[0]);
    });

    it('should cache dark mode variants separately', () => {
      const generator = new TokenGenerator({ generateDarkMode: true });
      const palette: Record<string, OKLCHColor> = {
        primary: { l: 0.5, c: 0.15, h: 220 },
      };

      const tokens = generator.generateTokens(palette);

      // Light and dark tokens should be different objects
      const lightToken = tokens.find(t => t.name === 'primary');
      const darkToken = tokens.find(t => t.name === 'primary-dark');

      expect(lightToken).not.toBe(darkToken);
    });
  });
});

// ============================================================================
// TASK-012: Export Formats (CSS, JSON, JS, TS)
// ============================================================================

describe('TASK-012: exportTokens', () => {
  let generator: TokenGenerator;
  const testPalette: Record<string, OKLCHColor> = {
    primary: { l: 0.5, c: 0.15, h: 220 },
  };

  beforeEach(() => {
    generator = new TokenGenerator();
  });

  describe('CSS Export', () => {
    it('should export tokens to CSS format', () => {
      const css = generator.exportTokens(testPalette, 'css');

      expect(css).toContain(':root {');
      expect(css).toContain('}');
    });

    it('should use CSS custom property syntax', () => {
      const css = generator.exportTokens(testPalette, 'css');

      expect(css).toContain('--primary:');
    });

    it('should export scale steps as CSS variables', () => {
      const css = generator.exportTokens(testPalette, 'css');

      expect(css).toContain('--primary-50:');
      expect(css).toContain('--primary-100:');
      expect(css).toContain('--primary-500:');
      expect(css).toContain('--primary-900:');
    });

    it('should produce valid hex color values', () => {
      const css = generator.exportTokens(testPalette, 'css');

      // Match hex colors like #AABBCC
      const hexPattern = /#[0-9A-Fa-f]{6}/g;
      const hexColors = css.match(hexPattern);

      expect(hexColors).not.toBeNull();
      expect(hexColors!.length).toBeGreaterThan(0);
    });

    it('should format CSS with proper indentation', () => {
      const css = generator.exportTokens(testPalette, 'css');

      // Check for 2-space indentation
      expect(css).toContain('  --primary:');
    });
  });

  describe('JSON Export', () => {
    it('should export tokens to valid JSON', () => {
      const json = generator.exportTokens(testPalette, 'json');

      expect(() => JSON.parse(json)).not.toThrow();
    });

    it('should include token name as key', () => {
      const json = generator.exportTokens(testPalette, 'json');
      const parsed = JSON.parse(json);

      expect(parsed).toHaveProperty('primary');
    });

    it('should include hex value for each token', () => {
      const json = generator.exportTokens(testPalette, 'json');
      const parsed = JSON.parse(json);

      expect(parsed.primary).toHaveProperty('value');
      expect(parsed.primary.value).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should include OKLCH values for each token', () => {
      const json = generator.exportTokens(testPalette, 'json');
      const parsed = JSON.parse(json);

      expect(parsed.primary).toHaveProperty('oklch');
      expect(parsed.primary.oklch).toHaveProperty('l');
      expect(parsed.primary.oklch).toHaveProperty('c');
      expect(parsed.primary.oklch).toHaveProperty('h');
    });

    it('should include scale values', () => {
      const json = generator.exportTokens(testPalette, 'json');
      const parsed = JSON.parse(json);

      expect(parsed.primary).toHaveProperty('scale');
      expect(parsed.primary.scale).toHaveProperty('50');
      expect(parsed.primary.scale).toHaveProperty('500');
      expect(parsed.primary.scale).toHaveProperty('900');
    });

    it('should be formatted with 2-space indentation', () => {
      const json = generator.exportTokens(testPalette, 'json');

      // Formatted JSON will have newlines
      expect(json).toContain('\n');
      // And indentation
      expect(json).toContain('  ');
    });
  });

  describe('JavaScript Export', () => {
    it('should export tokens to JS format', () => {
      const js = generator.exportTokens(testPalette, 'js');

      expect(js).toContain('export const');
    });

    it('should export base color as named constant', () => {
      const js = generator.exportTokens(testPalette, 'js');

      expect(js).toContain("export const primary = '");
    });

    it('should export scale as object', () => {
      const js = generator.exportTokens(testPalette, 'js');

      expect(js).toContain('export const primaryScale = {');
      expect(js).toContain("'50':");
      expect(js).toContain("'500':");
    });

    it('should include comment header', () => {
      const js = generator.exportTokens(testPalette, 'js');

      expect(js).toContain('// Generated design tokens');
    });
  });

  describe('TypeScript Export', () => {
    it('should export tokens to TS format', () => {
      const ts = generator.exportTokens(testPalette, 'ts');

      expect(ts).toContain('export const');
    });

    it('should use const assertions for type safety', () => {
      const ts = generator.exportTokens(testPalette, 'ts');

      expect(ts).toContain('as const');
    });

    it('should export base color with const assertion', () => {
      const ts = generator.exportTokens(testPalette, 'ts');

      expect(ts).toContain("export const primary = '");
      expect(ts).toContain("' as const;");
    });

    it('should export scale with const assertion', () => {
      const ts = generator.exportTokens(testPalette, 'ts');

      expect(ts).toContain('} as const;');
    });

    it('should include comment header', () => {
      const ts = generator.exportTokens(testPalette, 'ts');

      expect(ts).toContain('// Generated design tokens');
    });
  });

  describe('Unsupported Format', () => {
    it('should throw error for unsupported format', () => {
      expect(() => {
        // @ts-expect-error Testing invalid format
        generator.exportTokens(testPalette, 'yaml');
      }).toThrow('Unsupported format');
    });
  });

  describe('Multiple Tokens Export', () => {
    it('should export multiple tokens correctly', () => {
      const palette: Record<string, OKLCHColor> = {
        primary: { l: 0.5, c: 0.15, h: 220 },
        secondary: { l: 0.6, c: 0.1, h: 180 },
        accent: { l: 0.7, c: 0.2, h: 30 },
      };

      const css = generator.exportTokens(palette, 'css');

      expect(css).toContain('--primary:');
      expect(css).toContain('--secondary:');
      expect(css).toContain('--accent:');
    });

    it('should export dark mode tokens when enabled', () => {
      const generator = new TokenGenerator({ generateDarkMode: true });
      const palette: Record<string, OKLCHColor> = {
        primary: { l: 0.5, c: 0.15, h: 220 },
      };

      const css = generator.exportTokens(palette, 'css');

      expect(css).toContain('--primary:');
      expect(css).toContain('--primary-dark:');
    });
  });
});

// ============================================================================
// Performance Tests
// ============================================================================

describe('Performance', () => {
  describe('Token Generation Performance', () => {
    it('should generate a single token in under 10ms', () => {
      const color: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };

      const start = performance.now();
      generateToken('test', color);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(10);
    });

    it('should generate 100 tokens in under 500ms', () => {
      const generator = new TokenGenerator();
      const palette: Record<string, OKLCHColor> = {};

      for (let i = 0; i < 100; i++) {
        palette[`color${i}`] = {
          l: Math.random(),
          c: Math.random() * 0.3,
          h: Math.random() * 360,
        };
      }

      const start = performance.now();
      generator.generateTokens(palette);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(500);
    });

    it('should benefit from caching on repeated calls', () => {
      const generator = new TokenGenerator();
      const palette: Record<string, OKLCHColor> = {
        primary: { l: 0.5, c: 0.15, h: 220 },
        secondary: { l: 0.6, c: 0.1, h: 180 },
      };

      // First call (uncached)
      const start1 = performance.now();
      generator.generateTokens(palette);
      const duration1 = performance.now() - start1;

      // Second call (cached)
      const start2 = performance.now();
      generator.generateTokens(palette);
      const duration2 = performance.now() - start2;

      // Cached call should be faster (or at least not significantly slower)
      expect(duration2).toBeLessThanOrEqual(duration1 + 1);
    });
  });

  describe('Export Performance', () => {
    it('should export to CSS in under 50ms', () => {
      const generator = new TokenGenerator();
      const palette: Record<string, OKLCHColor> = {
        primary: { l: 0.5, c: 0.15, h: 220 },
        secondary: { l: 0.6, c: 0.1, h: 180 },
        accent: { l: 0.7, c: 0.2, h: 30 },
      };

      const start = performance.now();
      generator.exportTokens(palette, 'css');
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(50);
    });
  });
});

// ============================================================================
// Edge Cases and Error Handling
// ============================================================================

describe('Edge Cases', () => {
  describe('Extreme Lightness Values', () => {
    it('should handle pure black (l=0)', () => {
      const black: OKLCHColor = { l: 0, c: 0, h: 0 };

      const token = generateToken('black', black);

      expect(token.value.l).toBe(0);
    });

    it('should handle pure white (l=1)', () => {
      const white: OKLCHColor = { l: 1, c: 0, h: 0 };

      const token = generateToken('white', white);

      expect(token.value.l).toBe(1);
    });

    it('should generate valid scale for extreme lightness', () => {
      const white: OKLCHColor = { l: 1, c: 0, h: 0 };

      const token = generateToken('white', white);

      // All scale values should be valid
      Object.values(token.scale!).forEach((step) => {
        expect(step.l).toBeGreaterThanOrEqual(0);
        expect(step.l).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('Zero Chroma', () => {
    it('should handle grayscale colors (c=0)', () => {
      const gray: OKLCHColor = { l: 0.5, c: 0, h: 0 };

      const token = generateToken('gray', gray);

      expect(token.value.c).toBe(0);
    });

    it('should preserve zero chroma across scale', () => {
      const gray: OKLCHColor = { l: 0.5, c: 0, h: 0 };

      const token = generateToken('gray', gray);

      // Scale steps at extreme lightness may have adjusted chroma,
      // but middle steps should have zero chroma
      expect(token.scale!['500'].c).toBe(0);
    });
  });

  describe('Boundary Hue Values', () => {
    it('should handle hue at 0 (red)', () => {
      const red: OKLCHColor = { l: 0.5, c: 0.15, h: 0 };

      const token = generateToken('red', red);

      expect(token.value.h).toBe(0);
    });

    it('should handle hue at 360 (also red)', () => {
      const red: OKLCHColor = { l: 0.5, c: 0.15, h: 360 };

      const token = generateToken('red', red);

      expect(token.value.h).toBe(360);
    });

    it('should preserve hue across scale for all boundary values', () => {
      const testHues = [0, 90, 180, 270, 360];

      testHues.forEach((h) => {
        const color: OKLCHColor = { l: 0.5, c: 0.15, h };
        const token = generateToken(`test-${h}`, color);

        Object.values(token.scale!).forEach((step) => {
          expect(step.h).toBe(h);
        });
      });
    });
  });

  describe('Large Palette', () => {
    it('should handle palette with many colors', () => {
      const generator = new TokenGenerator();
      const palette: Record<string, OKLCHColor> = {};

      // Create a large palette
      for (let i = 0; i < 50; i++) {
        palette[`color-${i}`] = {
          l: 0.5,
          c: 0.15,
          h: (i * 7.2) % 360, // Distribute hues
        };
      }

      const tokens = generator.generateTokens(palette);

      expect(tokens).toHaveLength(50);
    });
  });

  describe('Special Characters in Names', () => {
    it('should handle names with spaces', () => {
      const color: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };

      const token = generateToken('my color', color);

      // ID should be sanitized
      expect(token.id).toMatch(/^[a-z0-9-]+$/);
    });

    it('should handle names with special characters', () => {
      const color: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };

      const token = generateToken('color@#$%', color);

      // ID should be sanitized
      expect(token.id).toMatch(/^[a-z0-9-]+$/);
    });

    it('should handle unicode names', () => {
      const color: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };

      const token = generateToken('색상', color);

      // Should not throw and produce valid token
      expect(token).toBeDefined();
      expect(token.id).toBeDefined();
    });
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe('Integration', () => {
  it('should support complete token generation workflow', () => {
    // Step 1: Create generator with config
    const generator = new TokenGenerator({
      generateDarkMode: true,
      validateWCAG: true,
      wcagLevel: 'AA',
    });

    // Step 2: Define palette
    const palette: Record<string, OKLCHColor> = {
      primary: { l: 0.5, c: 0.15, h: 220 },
      secondary: { l: 0.6, c: 0.1, h: 180 },
    };

    // Step 3: Generate tokens
    const tokens = generator.generateTokens(palette);

    // Step 4: Export to multiple formats
    const css = generator.exportTokens(palette, 'css');
    const json = generator.exportTokens(palette, 'json');
    const js = generator.exportTokens(palette, 'js');
    const ts = generator.exportTokens(palette, 'ts');

    // Verify
    expect(tokens.length).toBe(4); // 2 colors x 2 (light + dark)
    expect(css).toContain(':root');
    expect(() => JSON.parse(json)).not.toThrow();
    expect(js).toContain('export const');
    expect(ts).toContain('as const');
  });

  it('should maintain consistency between token generation and export', () => {
    const generator = new TokenGenerator();
    const palette: Record<string, OKLCHColor> = {
      primary: { l: 0.5, c: 0.15, h: 220 },
    };

    // Generate tokens
    const tokens = generator.generateTokens(palette);

    // Export to JSON
    const json = generator.exportTokens(palette, 'json');
    const parsed = JSON.parse(json);

    // Token name in JSON should match generated token
    expect(parsed).toHaveProperty(tokens[0].name);
  });

  it('should handle re-export after cache clear', () => {
    const generator = new TokenGenerator();
    const palette: Record<string, OKLCHColor> = {
      primary: { l: 0.5, c: 0.15, h: 220 },
    };

    // First export
    const css1 = generator.exportTokens(palette, 'css');

    // Clear cache
    generator.clearCache();

    // Second export
    const css2 = generator.exportTokens(palette, 'css');

    // Results should be identical
    expect(css1).toBe(css2);
  });
});
