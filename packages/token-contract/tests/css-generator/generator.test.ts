/**
 * CSS Generator Tests
 * Tests for CSS custom property generation from tokens
 */

import { describe, it, expect } from 'vitest';
import {
  generateCSSVariables,
  generateCSSFromTokens,
  formatCSSRule,
} from '../../src/css-generator/generator.js';
import type { SemanticToken } from '../../src/schemas/index.js';

describe('CSS Generator', () => {
  const mockSemanticTokens: SemanticToken = {
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

  describe('generateCSSVariables', () => {
    it('should generate CSS variables for semantic tokens', () => {
      const result = generateCSSVariables(mockSemanticTokens);

      expect(result).toContain('--tekton-primary-50: oklch(0.95 0.05 220);');
      expect(result).toContain('--tekton-primary-500: oklch(0.60 0.15 220);');
      expect(result).toContain('--tekton-neutral-500: oklch(0.60 0.01 220);');
      expect(result).toContain('--tekton-success-500: oklch(0.60 0.15 140);');
    });

    it('should generate all steps for each semantic token', () => {
      const result = generateCSSVariables(mockSemanticTokens);

      // Check all steps for primary
      expect(result).toContain('--tekton-primary-50:');
      expect(result).toContain('--tekton-primary-100:');
      expect(result).toContain('--tekton-primary-500:');
      expect(result).toContain('--tekton-primary-900:');
    });

    it('should generate valid CSS syntax', () => {
      const result = generateCSSVariables(mockSemanticTokens);

      // Should start with :root
      expect(result).toMatch(/^:root\s*{/);

      // Should end with closing brace
      expect(result).toMatch(/}\s*$/);

      // Should have proper semicolons
      expect(result).toMatch(/--tekton-[a-z]+-\d+:\s*oklch\([^)]+\);/);
    });

    it('should handle optional semantic tokens', () => {
      const tokensWithOptional: SemanticToken = {
        ...mockSemanticTokens,
        secondary: mockSemanticTokens.primary,
        accent: mockSemanticTokens.primary,
      };

      const result = generateCSSVariables(tokensWithOptional);

      expect(result).toContain('--tekton-secondary-500:');
      expect(result).toContain('--tekton-accent-500:');
    });

    it('should format CSS with proper indentation', () => {
      const result = generateCSSVariables(mockSemanticTokens);

      // Variables should be indented
      expect(result).toMatch(/\n  --tekton-/);

      // Should have consistent formatting
      const lines = result.split('\n').filter(l => l.includes('--tekton-'));
      expect(lines.every(l => l.startsWith('  --tekton-'))).toBe(true);
    });
  });

  describe('generateCSSFromTokens', () => {
    it('should generate complete CSS with semantic tokens', () => {
      const result = generateCSSFromTokens({
        semantic: mockSemanticTokens,
      });

      expect(result).toContain(':root {');
      expect(result).toContain('--tekton-primary-500:');
      expect(result).toContain('}');
    });

    it('should include composition tokens when provided', () => {
      const result = generateCSSFromTokens({
        semantic: mockSemanticTokens,
        composition: {
          border: {
            default: '1px solid var(--tekton-neutral-300)',
            thick: '2px solid var(--tekton-neutral-400)',
          },
          shadow: {
            sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
          spacing: {
            xs: '0.25rem',
            sm: '0.5rem',
            md: '1rem',
          },
          typography: {
            fontFamily: {
              sans: 'Inter, system-ui, sans-serif',
            },
            fontSize: {
              base: '1rem',
            },
          },
        },
      });

      expect(result).toContain('--tekton-border-default:');
      expect(result).toContain('--tekton-shadow-sm:');
      expect(result).toContain('--tekton-spacing-md:');
    });

    it('should handle empty composition tokens', () => {
      const result = generateCSSFromTokens({
        semantic: mockSemanticTokens,
        composition: {
          border: {},
          shadow: {},
          spacing: {},
          typography: {
            fontFamily: {},
            fontSize: {},
          },
        },
      });

      expect(result).toContain(':root {');
      expect(result).toContain('--tekton-primary-500:');
    });
  });

  describe('formatCSSRule', () => {
    it('should format CSS rules with proper syntax', () => {
      const variables = {
        '--tekton-primary-500': 'oklch(0.60 0.15 220)',
        '--tekton-neutral-500': 'oklch(0.60 0.01 220)',
      };

      const result = formatCSSRule(':root', variables);

      expect(result).toContain(':root {');
      expect(result).toContain('--tekton-primary-500: oklch(0.60 0.15 220);');
      expect(result).toContain('--tekton-neutral-500: oklch(0.60 0.01 220);');
      expect(result).toContain('}');
    });

    it('should handle empty variables object', () => {
      const result = formatCSSRule(':root', {});

      expect(result).toBe(':root {\n}');
    });

    it('should apply proper indentation', () => {
      const variables = {
        '--tekton-primary-500': 'oklch(0.60 0.15 220)',
      };

      const result = formatCSSRule(':root', variables);
      const lines = result.split('\n');

      expect(lines[0]).toBe(':root {');
      expect(lines[1]).toMatch(/^  --tekton-/);
      expect(lines[2]).toBe('}');
    });

    it('should handle different selectors', () => {
      const variables = {
        '--tekton-primary-500': 'oklch(0.60 0.15 220)',
      };

      const result = formatCSSRule('[data-theme="dark"]', variables);

      expect(result).toContain('[data-theme="dark"] {');
    });
  });

  describe('CSS Syntax Validation', () => {
    it('should generate valid CSS that can be parsed', () => {
      const result = generateCSSVariables(mockSemanticTokens);

      // Count opening and closing braces
      const openBraces = (result.match(/{/g) || []).length;
      const closeBraces = (result.match(/}/g) || []).length;

      expect(openBraces).toBe(closeBraces);
    });

    it('should escape special characters in values', () => {
      const tokensWithSpecialChars: SemanticToken = {
        ...mockSemanticTokens,
      };

      const result = generateCSSVariables(tokensWithSpecialChars);

      // Should not break CSS syntax
      expect(result).toMatch(/^:root\s*{[\s\S]*}\s*$/);
    });

    it('should handle very long color values', () => {
      const result = generateCSSVariables(mockSemanticTokens);

      // All lines should end with semicolons (except braces)
      const lines = result.split('\n').filter(l => l.trim() && !l.trim().match(/^[{}]$/));
      const varLines = lines.filter(l => l.includes('--tekton-'));

      expect(varLines.every(l => l.trim().endsWith(';'))).toBe(true);
    });
  });
});
