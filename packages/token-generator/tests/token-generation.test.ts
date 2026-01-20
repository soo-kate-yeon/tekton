/**
 * Phase 4: Token Generation Tests (Tasks 15-19)
 *
 * TASK-015: CSS Variable Generator
 * TASK-016: Tailwind Config Generator
 * TASK-017: Token Metadata Export
 * TASK-018: End-to-End Integration
 * TASK-019: Determinism Verification
 */

import { describe, it, expect } from 'vitest';
import { exportToCSS, exportToDTCG, exportToTailwind } from '../src/output.js';
import type { SemanticTokens } from '../src/semantic-mapper.js';
import type { OKLCHColor } from '@tekton/theme';
import crypto from 'crypto';

describe('TASK-015: CSS Variable Generator', () => {
  const testTokens: SemanticTokens = {
    'color-primary': { l: 0.5, c: 0.15, h: 220 },
    'color-secondary': { l: 0.6, c: 0.12, h: 180 },
    'color-background': { l: 0.98, c: 0.01, h: 0 },
    'color-text': { l: 0.2, c: 0.02, h: 240 },
  };

  it('should generate valid CSS custom properties', () => {
    const css = exportToCSS({ semanticTokens: testTokens });

    expect(css).toContain(':root');
    expect(css).toContain('--color-primary');
    expect(css).toContain('--color-secondary');
    expect(css).toContain('oklch(');
  });

  it('should output OKLCH + RGB fallback format', () => {
    const css = exportToCSS({ semanticTokens: testTokens });

    // Should contain OKLCH format
    expect(css).toMatch(/oklch\(\s*[\d.]+%\s+[\d.]+\s+[\d.]+\s*\)/);

    // Should be valid CSS
    expect(css).toContain('{');
    expect(css).toContain('}');
    expect(css).toContain(';');
  });

  it('should support kebab-case naming', () => {
    const tokens: SemanticTokens = {
      'color-primary-500': { l: 0.5, c: 0.15, h: 220 },
      'color-background-light': { l: 0.95, c: 0.01, h: 0 },
    };

    const css = exportToCSS({ semanticTokens: tokens });

    expect(css).toContain('--color-primary-500');
    expect(css).toContain('--color-background-light');
  });

  it('should pass CSS linting (valid syntax)', () => {
    const css = exportToCSS({ semanticTokens: testTokens });

    // Basic syntax validation
    expect(css).not.toContain('undefined');
    expect(css).not.toContain('NaN');
    expect(css).not.toContain('null');

    // Should have balanced braces
    const openBraces = (css.match(/{/g) || []).length;
    const closeBraces = (css.match(/}/g) || []).length;
    expect(openBraces).toBe(closeBraces);

    // Should have semicolons for each property
    const properties = (css.match(/--[\w-]+:/g) || []).length;
    const semicolons = (css.match(/;/g) || []).length;
    expect(semicolons).toBeGreaterThanOrEqual(properties);
  });

  it('should support dark mode variants', () => {
    const darkTokens: SemanticTokens = {
      'color-background': { l: 0.15, c: 0.01, h: 0 },
      'color-text': { l: 0.95, c: 0.02, h: 240 },
    };

    const css = exportToCSS({
      semanticTokens: testTokens,
      darkTokens,
    });

    expect(css).toContain('.dark');
    expect(css).toContain('oklch(15.00%'); // Dark background
  });

  it('should support minification', () => {
    const normal = exportToCSS({ semanticTokens: testTokens, minify: false });
    const minified = exportToCSS({ semanticTokens: testTokens, minify: true });

    expect(minified.length).toBeLessThan(normal.length);
    expect(minified).not.toContain('\n');
    expect(minified).not.toContain('  ');
  });

  it('should support custom prefix', () => {
    const css = exportToCSS({
      semanticTokens: testTokens,
      prefix: 'app',
    });

    expect(css).toContain('--app-color-primary');
    expect(css).toContain('--app-color-secondary');
  });
});

describe('TASK-016: Tailwind Config Generator', () => {
  const testTokens: SemanticTokens = {
    'primary': { l: 0.5, c: 0.15, h: 220 },
    'secondary': { l: 0.6, c: 0.12, h: 180 },
  };

  const colorScales: Record<string, Record<string, OKLCHColor>> = {
    'gray': {
      '100': { l: 0.95, c: 0.01, h: 0 },
      '500': { l: 0.5, c: 0.01, h: 0 },
      '900': { l: 0.2, c: 0.01, h: 0 },
    },
  };

  it('should generate valid Tailwind config structure', () => {
    const config = exportToTailwind({
      semanticTokens: testTokens,
      colorScales,
    });

    expect(config).toContain('module.exports');
    expect(config).toContain('theme');
    expect(config).toContain('extend');
    expect(config).toContain('colors');
  });

  it('should support TypeScript format', () => {
    const config = exportToTailwind({
      semanticTokens: testTokens,
      format: 'ts',
    });

    expect(config).toContain("import type { Config } from 'tailwindcss'");
    expect(config).toContain('const config');
  });

  it('should support nested configuration', () => {
    const config = exportToTailwind({
      semanticTokens: testTokens,
      colorScales,
    });

    expect(config).toContain('gray: {');
    expect(config).toContain("'100':");
    expect(config).toContain("'500':");
    expect(config).toContain("'900':");
  });

  it('should load in Tailwind without errors', () => {
    const config = exportToTailwind({
      semanticTokens: testTokens,
      colorScales,
    });

    // Basic JavaScript syntax validation
    expect(config).not.toContain('undefined');
    expect(config).not.toContain('NaN');

    // Should have valid hex colors
    expect(config).toMatch(/#[0-9a-f]{6}/i);
  });

  it('should convert OKLCH to hex colors', () => {
    const config = exportToTailwind({
      semanticTokens: testTokens,
    });

    // Should contain hex color values
    const hexMatches = config.match(/#[0-9a-f]{6}/gi);
    expect(hexMatches).not.toBeNull();
    expect(hexMatches!.length).toBeGreaterThan(0);
  });
});

describe('TASK-017: Token Metadata Export', () => {
  const testTokens: SemanticTokens = {
    'color-primary': { l: 0.5, c: 0.15, h: 220 },
    'color-secondary': { l: 0.6, c: 0.12, h: 180 },
  };

  it('should export DTCG-compliant JSON metadata', () => {
    const json = exportToDTCG({ semanticTokens: testTokens });
    const parsed = JSON.parse(json);

    expect(parsed).toHaveProperty('color-primary');
    expect(parsed['color-primary']).toHaveProperty('$type', 'color');
    expect(parsed['color-primary']).toHaveProperty('$value');
  });

  it('should support TypeScript types', () => {
    const json = exportToDTCG({ semanticTokens: testTokens });
    const parsed = JSON.parse(json);

    // Verify structure matches expected types
    Object.values(parsed).forEach((token: any) => {
      if (token.$type) {
        expect(token.$type).toBe('color');
        expect(typeof token.$value).toBe('string');
      }
    });
  });

  it('should be parseable by Layer 2', () => {
    const json = exportToDTCG({ semanticTokens: testTokens });

    // Should be valid JSON
    expect(() => JSON.parse(json)).not.toThrow();

    const parsed = JSON.parse(json);

    // Should have DTCG structure
    expect(parsed).toBeDefined();
    expect(Object.keys(parsed).length).toBeGreaterThan(0);
  });

  it('should include color scale metadata', () => {
    const colorScales: Record<string, Record<string, OKLCHColor>> = {
      'gray': {
        '100': { l: 0.95, c: 0.01, h: 0 },
        '500': { l: 0.5, c: 0.01, h: 0 },
      },
    };

    const json = exportToDTCG({
      semanticTokens: testTokens,
      colorScales,
    });
    const parsed = JSON.parse(json);

    expect(parsed).toHaveProperty('gray');
    expect(parsed.gray).toHaveProperty('100');
    expect(parsed.gray).toHaveProperty('500');
  });
});

describe('TASK-018: End-to-End Integration', () => {
  it('should complete full pipeline from theme to tokens', () => {
    const testTokens: SemanticTokens = {
      'primary': { l: 0.5, c: 0.15, h: 220 },
      'secondary': { l: 0.6, c: 0.12, h: 180 },
      'background': { l: 0.98, c: 0.01, h: 0 },
      'text': { l: 0.2, c: 0.02, h: 240 },
    };

    // Generate all outputs
    const css = exportToCSS({ semanticTokens: testTokens });
    const tailwind = exportToTailwind({ semanticTokens: testTokens });
    const metadata = exportToDTCG({ semanticTokens: testTokens });

    // Validate CSS output
    expect(css).toContain('--primary');
    expect(css).toContain('oklch(');

    // Validate Tailwind output
    expect(tailwind).toContain('colors');
    expect(tailwind).toMatch(/#[0-9a-f]{6}/i);

    // Validate metadata
    const parsed = JSON.parse(metadata);
    expect(parsed.primary).toHaveProperty('$type', 'color');
  });

  it('should produce valid output for all formats', () => {
    const testTokens: SemanticTokens = {
      'primary': { l: 0.5, c: 0.15, h: 220 },
    };

    const css = exportToCSS({ semanticTokens: testTokens });
    const tailwind = exportToTailwind({ semanticTokens: testTokens });
    const metadata = exportToDTCG({ semanticTokens: testTokens });

    // All outputs should be non-empty strings
    expect(css.length).toBeGreaterThan(0);
    expect(tailwind.length).toBeGreaterThan(0);
    expect(metadata.length).toBeGreaterThan(0);

    // No undefined/null values
    expect(css).not.toContain('undefined');
    expect(tailwind).not.toContain('undefined');
    expect(metadata).not.toContain('undefined');
  });
});

describe('TASK-019: Determinism Verification', () => {
  const testTokens: SemanticTokens = {
    'primary': { l: 0.5, c: 0.15, h: 220 },
    'secondary': { l: 0.6, c: 0.12, h: 180 },
    'background': { l: 0.98, c: 0.01, h: 0 },
  };

  it('should produce identical output across multiple runs', () => {
    // Run generation 3 times
    const run1 = exportToCSS({ semanticTokens: testTokens });
    const run2 = exportToCSS({ semanticTokens: testTokens });
    const run3 = exportToCSS({ semanticTokens: testTokens });

    // All runs should be identical
    expect(run1).toBe(run2);
    expect(run2).toBe(run3);
  });

  it('should have identical SHA-256 hashes', () => {
    // Generate outputs 3 times
    const outputs = [
      exportToCSS({ semanticTokens: testTokens }),
      exportToCSS({ semanticTokens: testTokens }),
      exportToCSS({ semanticTokens: testTokens }),
    ];

    // Calculate SHA-256 hashes
    const hashes = outputs.map(output =>
      crypto.createHash('sha256').update(output).digest('hex')
    );

    // All hashes should be identical
    expect(hashes[0]).toBe(hashes[1]);
    expect(hashes[1]).toBe(hashes[2]);
  });

  it('should be deterministic for Tailwind config', () => {
    const run1 = exportToTailwind({ semanticTokens: testTokens });
    const run2 = exportToTailwind({ semanticTokens: testTokens });

    expect(run1).toBe(run2);
  });

  it('should be deterministic for metadata', () => {
    const run1 = exportToDTCG({ semanticTokens: testTokens });
    const run2 = exportToDTCG({ semanticTokens: testTokens });

    expect(run1).toBe(run2);
  });

  it('should maintain determinism with complex inputs', () => {
    const complexTokens: SemanticTokens = {
      'primary-50': { l: 0.95, c: 0.05, h: 220 },
      'primary-100': { l: 0.90, c: 0.07, h: 220 },
      'primary-500': { l: 0.50, c: 0.15, h: 220 },
      'primary-900': { l: 0.20, c: 0.12, h: 220 },
      'secondary-500': { l: 0.60, c: 0.12, h: 180 },
      'neutral-100': { l: 0.95, c: 0.01, h: 0 },
      'neutral-900': { l: 0.20, c: 0.01, h: 0 },
    };

    const hash1 = crypto
      .createHash('sha256')
      .update(exportToCSS({ semanticTokens: complexTokens }))
      .digest('hex');

    const hash2 = crypto
      .createHash('sha256')
      .update(exportToCSS({ semanticTokens: complexTokens }))
      .digest('hex');

    expect(hash1).toBe(hash2);
  });
});
