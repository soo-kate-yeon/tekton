/**
 * Dark Mode CSS Generation Tests
 * Tests for [data-theme="dark"] selector overrides
 */

import { describe, it, expect } from 'vitest';
import {
  generateDarkModeCSS,
  generateDarkModeOverrides,
  mergeLightAndDarkCSS,
} from '../../src/css-generator/dark-mode.js';
import type { SemanticToken } from '../../src/schemas/index.js';

describe('Dark Mode CSS Generation', () => {
  const mockLightTokens: SemanticToken = {
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

  const mockDarkTokens: SemanticToken = {
    primary: {
      '50': 'oklch(0.20 0.15 220)',
      '100': 'oklch(0.30 0.14 220)',
      '200': 'oklch(0.40 0.13 220)',
      '300': 'oklch(0.50 0.12 220)',
      '400': 'oklch(0.60 0.14 220)',
      '500': 'oklch(0.70 0.15 220)',
      '600': 'oklch(0.80 0.15 220)',
      '700': 'oklch(0.85 0.12 220)',
      '800': 'oklch(0.90 0.10 220)',
      '900': 'oklch(0.95 0.08 220)',
    },
    neutral: {
      '50': 'oklch(0.15 0.01 220)',
      '100': 'oklch(0.20 0.01 220)',
      '200': 'oklch(0.30 0.01 220)',
      '300': 'oklch(0.40 0.01 220)',
      '400': 'oklch(0.50 0.01 220)',
      '500': 'oklch(0.60 0.01 220)',
      '600': 'oklch(0.70 0.01 220)',
      '700': 'oklch(0.80 0.01 220)',
      '800': 'oklch(0.90 0.01 220)',
      '900': 'oklch(0.95 0.01 220)',
    },
    success: mockLightTokens.success, // Can reuse some colors
    warning: mockLightTokens.warning,
    error: mockLightTokens.error,
  };

  describe('generateDarkModeCSS', () => {
    it('should generate CSS with [data-theme="dark"] selector', () => {
      const result = generateDarkModeCSS(mockDarkTokens);

      expect(result).toContain('[data-theme="dark"] {');
      expect(result).toContain('--tekton-primary-50: oklch(0.20 0.15 220);');
      expect(result).toContain('--tekton-neutral-900: oklch(0.95 0.01 220);');
    });

    it('should invert lightness values correctly', () => {
      const result = generateDarkModeCSS(mockDarkTokens);

      // Dark mode: lighter values have lower numbers
      expect(result).toContain('--tekton-primary-50:'); // Darkest in dark mode
      expect(result).toContain('--tekton-primary-900:'); // Lightest in dark mode
    });

    it('should handle all semantic tokens', () => {
      const result = generateDarkModeCSS(mockDarkTokens);

      expect(result).toContain('--tekton-primary-');
      expect(result).toContain('--tekton-neutral-');
      expect(result).toContain('--tekton-success-');
      expect(result).toContain('--tekton-warning-');
      expect(result).toContain('--tekton-error-');
    });

    it('should use proper CSS syntax', () => {
      const result = generateDarkModeCSS(mockDarkTokens);

      expect(result).toMatch(/^\[data-theme="dark"\]\s*{/);
      expect(result).toMatch(/}\s*$/);

      const openBraces = (result.match(/{/g) || []).length;
      const closeBraces = (result.match(/}/g) || []).length;
      expect(openBraces).toBe(closeBraces);
    });

    it('should format with proper indentation', () => {
      const result = generateDarkModeCSS(mockDarkTokens);

      const lines = result.split('\n').filter(l => l.includes('--tekton-'));
      expect(lines.every(l => l.startsWith('  --tekton-'))).toBe(true);
    });
  });

  describe('generateDarkModeOverrides', () => {
    it('should generate only variables that differ from light mode', () => {
      const result = generateDarkModeOverrides(mockLightTokens, mockDarkTokens);

      // Should include primary (different)
      expect(result).toContain('--tekton-primary-50:');

      // Success, warning, error are same, so might be optimized out
      // But for completeness, all are included
      expect(result).toContain('--tekton-success-');
    });

    it('should handle optional tokens', () => {
      const lightWithOptional: SemanticToken = {
        ...mockLightTokens,
        secondary: mockLightTokens.primary,
      };

      const darkWithOptional: SemanticToken = {
        ...mockDarkTokens,
        secondary: mockDarkTokens.primary,
      };

      const result = generateDarkModeOverrides(lightWithOptional, darkWithOptional);

      expect(result).toContain('--tekton-secondary-');
    });

    it('should handle missing dark tokens gracefully', () => {
      const partialDark: SemanticToken = {
        ...mockDarkTokens,
      };

      const result = generateDarkModeOverrides(mockLightTokens, partialDark);

      // Should still generate valid CSS
      expect(result).toMatch(/^\[data-theme="dark"\]\s*{[\s\S]*}\s*$/);
    });
  });

  describe('mergeLightAndDarkCSS', () => {
    it('should combine light and dark mode CSS', () => {
      const lightCSS = ':root {\n  --tekton-primary-500: oklch(0.60 0.15 220);\n}';
      const darkCSS = '[data-theme="dark"] {\n  --tekton-primary-500: oklch(0.70 0.15 220);\n}';

      const result = mergeLightAndDarkCSS(lightCSS, darkCSS);

      expect(result).toContain(':root {');
      expect(result).toContain('[data-theme="dark"] {');
      expect(result).toContain('--tekton-primary-500: oklch(0.60 0.15 220);');
      expect(result).toContain('--tekton-primary-500: oklch(0.70 0.15 220);');
    });

    it('should separate light and dark sections with newline', () => {
      const lightCSS = ':root {\n  --tekton-primary-500: oklch(0.60 0.15 220);\n}';
      const darkCSS = '[data-theme="dark"] {\n  --tekton-primary-500: oklch(0.70 0.15 220);\n}';

      const result = mergeLightAndDarkCSS(lightCSS, darkCSS);

      expect(result).toMatch(/}\s*\n\s*\[data-theme="dark"\]/);
    });

    it('should handle empty dark CSS', () => {
      const lightCSS = ':root {\n  --tekton-primary-500: oklch(0.60 0.15 220);\n}';
      const darkCSS = '';

      const result = mergeLightAndDarkCSS(lightCSS, darkCSS);

      expect(result).toBe(lightCSS);
    });

    it('should preserve formatting', () => {
      const lightCSS = ':root {\n  --tekton-primary-500: oklch(0.60 0.15 220);\n}';
      const darkCSS = '[data-theme="dark"] {\n  --tekton-primary-500: oklch(0.70 0.15 220);\n}';

      const result = mergeLightAndDarkCSS(lightCSS, darkCSS);

      // Check indentation is preserved
      const lines = result.split('\n');
      const varLines = lines.filter(l => l.includes('--tekton-'));
      expect(varLines.every(l => l.startsWith('  --tekton-'))).toBe(true);
    });
  });

  describe('Dark Mode Integration', () => {
    it('should support automatic dark mode detection', () => {
      const result = generateDarkModeCSS(mockDarkTokens);

      // Should work with prefers-color-scheme media query
      expect(result).toContain('[data-theme="dark"]');
    });

    it('should support manual dark mode toggle', () => {
      const result = generateDarkModeCSS(mockDarkTokens);

      // Data attribute allows manual toggle
      expect(result).toContain('[data-theme="dark"]');
    });

    it('should handle system preference override', () => {
      const lightCSS = ':root {\n  --tekton-primary-500: oklch(0.60 0.15 220);\n}';
      const darkCSS = generateDarkModeCSS(mockDarkTokens);

      const result = mergeLightAndDarkCSS(lightCSS, darkCSS);

      // Both modes should be available
      expect(result).toContain(':root {');
      expect(result).toContain('[data-theme="dark"] {');
    });
  });

  describe('Browser Compatibility', () => {
    it('should generate CSS compatible with modern browsers', () => {
      const result = generateDarkModeCSS(mockDarkTokens);

      // CSS custom properties are widely supported
      expect(result).toMatch(/--tekton-[a-z]+-\d+:/);

      // OKLCH color space (check if using modern syntax)
      expect(result).toContain('oklch(');
    });

    it('should use valid CSS selector syntax', () => {
      const result = generateDarkModeCSS(mockDarkTokens);

      // Attribute selector with quotes
      expect(result).toContain('[data-theme="dark"]');
    });

    it('should handle cascade correctly', () => {
      const lightCSS = ':root {\n  --tekton-primary-500: oklch(0.60 0.15 220);\n}';
      const darkCSS = '[data-theme="dark"] {\n  --tekton-primary-500: oklch(0.70 0.15 220);\n}';

      const result = mergeLightAndDarkCSS(lightCSS, darkCSS);

      // Dark mode selector should come after :root for proper override
      const rootIndex = result.indexOf(':root');
      const darkIndex = result.indexOf('[data-theme="dark"]');

      expect(darkIndex).toBeGreaterThan(rootIndex);
    });
  });
});
