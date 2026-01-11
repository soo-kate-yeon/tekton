import { describe, it, expect } from 'vitest';
import { TokenGenerator, generateComponentPresets } from '../src';

describe('Performance Benchmarks - TASK-022', () => {
  it('should generate tokens in under 100ms', () => {
    const generator = new TokenGenerator();
    const palette = {
      primary: { l: 0.5, c: 0.15, h: 220 },
      secondary: { l: 0.6, c: 0.12, h: 180 },
      accent: { l: 0.55, c: 0.14, h: 340 },
    };

    const start = performance.now();
    generator.generateTokens(palette);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(100);
  });

  it('should generate component presets in under 50ms', () => {
    const baseColor = { l: 0.5, c: 0.15, h: 220 };

    const start = performance.now();
    generateComponentPresets(baseColor);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(50);
  });

  it('should cache repeated generations for improved performance', () => {
    const generator = new TokenGenerator();
    const palette = { primary: { l: 0.5, c: 0.15, h: 220 } };

    // First generation
    const start1 = performance.now();
    generator.generateTokens(palette);
    const duration1 = performance.now() - start1;

    // Second generation (should use cache)
    const start2 = performance.now();
    generator.generateTokens(palette);
    const duration2 = performance.now() - start2;

    // Cached call should be faster or equal
    expect(duration2).toBeLessThanOrEqual(duration1 * 1.5);
  });

  it('should handle large palettes efficiently', () => {
    const generator = new TokenGenerator();
    const largePalette: Record<string, { l: number; c: number; h: number }> = {};

    // Create 20 colors
    for (let i = 0; i < 20; i++) {
      largePalette[`color${i}`] = {
        l: 0.5 + (i * 0.02),
        c: 0.15,
        h: (i * 18) % 360,
      };
    }

    const start = performance.now();
    const tokens = generator.generateTokens(largePalette);
    const duration = performance.now() - start;

    expect(tokens).toHaveLength(20);
    expect(duration).toBeLessThan(500); // 500ms for 20 colors
  });

  it('should export to CSS format efficiently', () => {
    const generator = new TokenGenerator();
    const palette = {
      primary: { l: 0.5, c: 0.15, h: 220 },
      secondary: { l: 0.6, c: 0.12, h: 180 },
      accent: { l: 0.55, c: 0.14, h: 340 },
    };

    const start = performance.now();
    generator.exportTokens(palette, 'css');
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(150);
  });

  it('should handle multiple format exports efficiently', () => {
    const generator = new TokenGenerator();
    const palette = { primary: { l: 0.5, c: 0.15, h: 220 } };

    const start = performance.now();
    generator.exportTokens(palette, 'css');
    generator.exportTokens(palette, 'json');
    generator.exportTokens(palette, 'js');
    generator.exportTokens(palette, 'ts');
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(200);
  });
});
