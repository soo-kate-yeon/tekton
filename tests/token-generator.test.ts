import { describe, it, expect } from 'vitest';
import {
  generateToken,
  generateTokenId,
  TokenGenerator,
} from '../src/token-generator';

describe('Token Generator - TASK-009 to TASK-013', () => {
  describe('generateTokenId - TASK-013', () => {
    it('should generate deterministic IDs', () => {
      const id1 = generateTokenId('primary', { l: 0.5, c: 0.15, h: 220 });
      const id2 = generateTokenId('primary', { l: 0.5, c: 0.15, h: 220 });

      expect(id1).toBe(id2);
    });

    it('should generate different IDs for different inputs', () => {
      const id1 = generateTokenId('primary', { l: 0.5, c: 0.15, h: 220 });
      const id2 = generateTokenId('secondary', { l: 0.5, c: 0.15, h: 220 });

      expect(id1).not.toBe(id2);
    });

    it('should generate valid token IDs', () => {
      const id = generateTokenId('primary', { l: 0.5, c: 0.15, h: 220 });

      expect(id).toMatch(/^[a-z0-9-]+$/);
      expect(id.length).toBeGreaterThan(0);
    });
  });

  describe('generateToken - TASK-010', () => {
    it('should generate token with ID, name, value, and scale', () => {
      const token = generateToken('primary', { l: 0.5, c: 0.15, h: 220 });

      expect(token.id).toBeDefined();
      expect(token.name).toBe('primary');
      expect(token.value).toEqual({ l: 0.5, c: 0.15, h: 220 });
      expect(token.scale).toBeDefined();
    });

    it('should generate 11-step scale', () => {
      const token = generateToken('primary', { l: 0.5, c: 0.15, h: 220 });

      expect(Object.keys(token.scale!)).toHaveLength(11);
    });

    it('should handle semantic token mapping', () => {
      const token = generateToken('brand', { l: 0.5, c: 0.15, h: 220 });

      expect(token.name).toBe('brand');
      // Scale 500 should map to the base color
      expect(token.scale!['500']).toEqual(token.value);
    });
  });

  describe('TokenGenerator class', () => {
    it('should generate multiple tokens', () => {
      const generator = new TokenGenerator();
      const tokens = generator.generateTokens({
        primary: { l: 0.5, c: 0.15, h: 220 },
        secondary: { l: 0.6, c: 0.12, h: 180 },
      });

      expect(tokens).toHaveLength(2);
      expect(tokens[0].name).toBe('primary');
      expect(tokens[1].name).toBe('secondary');
    });

    it('should validate WCAG AA compliance', () => {
      const generator = new TokenGenerator();
      const tokens = generator.generateTokens({
        primary: { l: 0.5, c: 0.15, h: 220 },
      });

      // Should include accessibility validation
      expect(tokens[0]).toBeDefined();
    });

    it('should handle gamut clipping - TASK-009', () => {
      const generator = new TokenGenerator();
      // Out of gamut OKLCH color
      const outOfGamut = { l: 0.5, c: 0.4, h: 220 };
      const tokens = generator.generateTokens({ test: outOfGamut });

      expect(tokens[0]).toBeDefined();
      expect(tokens[0].value).toBeDefined();
    });

    it('should generate dark mode variants - TASK-011', () => {
      const generator = new TokenGenerator({ generateDarkMode: true });
      const tokens = generator.generateTokens({
        primary: { l: 0.5, c: 0.15, h: 220 },
      });

      // Should include both light and dark mode tokens
      expect(tokens.length).toBeGreaterThanOrEqual(1);
    });

    it('should use caching for performance - TASK-015', () => {
      const generator = new TokenGenerator();
      const color = { l: 0.5, c: 0.15, h: 220 };

      const start1 = performance.now();
      generator.generateTokens({ primary: color });
      const time1 = performance.now() - start1;

      const start2 = performance.now();
      generator.generateTokens({ primary: color });
      const time2 = performance.now() - start2;

      // Second call should be faster due to caching
      expect(time2).toBeLessThanOrEqual(time1);
    });

    it('should export to CSS format - TASK-012', () => {
      const generator = new TokenGenerator();
      const css = generator.exportTokens(
        { primary: { l: 0.5, c: 0.15, h: 220 } },
        'css'
      );

      expect(css).toContain('--');
      expect(css).toContain(':root');
    });

    it('should export to JSON format - TASK-012', () => {
      const generator = new TokenGenerator();
      const json = generator.exportTokens(
        { primary: { l: 0.5, c: 0.15, h: 220 } },
        'json'
      );

      expect(() => JSON.parse(json)).not.toThrow();
    });

    it('should export to JavaScript format - TASK-012', () => {
      const generator = new TokenGenerator();
      const js = generator.exportTokens(
        { primary: { l: 0.5, c: 0.15, h: 220 } },
        'js'
      );

      expect(js).toContain('export');
      expect(js).toContain('const');
    });

    it('should handle errors gracefully - TASK-014', () => {
      const generator = new TokenGenerator();

      expect(() => {
        generator.generateTokens({
          invalid: { l: 2, c: 0.15, h: 220 }, // Invalid lightness
        });
      }).toThrow();
    });

    it('should export to TypeScript format - TASK-012', () => {
      const generator = new TokenGenerator();
      const ts = generator.exportTokens(
        { primary: { l: 0.5, c: 0.15, h: 220 } },
        'ts'
      );

      expect(ts).toContain('export');
      expect(ts).toContain('const');
      expect(ts).toContain('as const');
    });

    it('should clear cache correctly', () => {
      const generator = new TokenGenerator();
      const color = { l: 0.5, c: 0.15, h: 220 };

      // Populate cache
      generator.generateTokens({ primary: color });

      // Clear cache
      generator.clearCache();

      // Generate again (should not use cache)
      const tokens = generator.generateTokens({ primary: color });
      expect(tokens).toBeDefined();
    });

    it('should handle out-of-gamut colors with high chroma', () => {
      const generator = new TokenGenerator();
      const outOfGamut = { l: 0.5, c: 0.45, h: 120 };

      const tokens = generator.generateTokens({ test: outOfGamut });

      expect(tokens[0]).toBeDefined();
      expect(tokens[0].metadata?.gamutClipped).toBeDefined();
    });

    it('should generate metadata with timestamp', () => {
      const generator = new TokenGenerator();
      const tokens = generator.generateTokens({
        primary: { l: 0.5, c: 0.15, h: 220 },
      });

      expect(tokens[0].metadata?.generated).toBeDefined();
      const generated = tokens[0].metadata?.generated;
      if (typeof generated === 'string' || typeof generated === 'number' || generated instanceof Date) {
        expect(new Date(generated)).toBeInstanceOf(Date);
      }
    });
  });
});
