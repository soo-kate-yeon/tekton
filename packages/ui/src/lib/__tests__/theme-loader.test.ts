/**
 * @tekton/ui - Theme Loader Tests
 * SPEC-UI-001: Verify linear-minimal-v1.json → CSS Variables conversion
 */

import { describe, it, expect } from 'vitest';
import {
  oklchToCSS,
  resolveSemanticToken,
  themeToCSS,
  type ThemeDefinition,
  type OKLCHColor,
} from '../theme-loader';

describe('theme-loader', () => {
  describe('oklchToCSS', () => {
    it('should convert OKLCH color to CSS string', () => {
      const color: OKLCHColor = { l: 0.55, c: 0.12, h: 265 };
      expect(oklchToCSS(color)).toBe('oklch(0.55 0.12 265)');
    });

    it('should handle white color', () => {
      const white: OKLCHColor = { l: 1, c: 0, h: 0 };
      expect(oklchToCSS(white)).toBe('oklch(1 0 0)');
    });
  });

  describe('resolveSemanticToken', () => {
    const mockTheme: ThemeDefinition = {
      id: 'test-theme',
      name: 'Test Theme',
      schemaVersion: '2.1',
      tokens: {
        atomic: {
          color: {
            brand: {
              '500': { l: 0.55, c: 0.12, h: 265 },
            },
            neutral: {
              '50': { l: 0.99, c: 0.005, h: 265 },
              '900': { l: 0.2, c: 0.04, h: 265 },
            },
            white: { l: 1, c: 0, h: 0 },
          },
          spacing: {
            '1': '4px',
            '2': '8px',
          },
          radius: {
            sm: '4px',
            md: '6px',
          },
        },
        semantic: {
          background: {
            canvas: 'atomic.color.neutral.50',
            surface: {
              subtle: 'atomic.color.neutral.50',
              default: 'atomic.color.white',
              emphasis: 'atomic.color.neutral.50',
            },
            brand: {
              subtle: 'atomic.color.brand.500',
              default: 'atomic.color.brand.500',
              emphasis: 'atomic.color.brand.500',
            },
          },
          border: {
            default: {
              subtle: 'atomic.color.neutral.50',
              default: 'atomic.color.neutral.50',
              emphasis: 'atomic.color.neutral.50',
            },
          },
        },
      },
    };

    it('should resolve semantic token to atomic color', () => {
      const result = resolveSemanticToken('atomic.color.brand.500', mockTheme);
      expect(result).toEqual({ l: 0.55, c: 0.12, h: 265 });
    });

    it('should resolve nested semantic token', () => {
      const result = resolveSemanticToken('atomic.color.neutral.50', mockTheme);
      expect(result).toEqual({ l: 0.99, c: 0.005, h: 265 });
    });

    it('should return original string if not a token reference', () => {
      const result = resolveSemanticToken('not-a-token', mockTheme);
      expect(result).toBe('not-a-token');
    });

    it('should resolve spacing tokens', () => {
      const result = resolveSemanticToken('atomic.spacing.1', mockTheme);
      expect(result).toBe('4px');
    });
  });

  describe('themeToCSS', () => {
    const linearMinimalV1: ThemeDefinition = {
      id: 'linear-minimal-v1',
      name: 'Linear Minimal',
      schemaVersion: '2.1',
      tokens: {
        atomic: {
          color: {
            brand: {
              '100': { l: 0.95, c: 0.02, h: 265 },
              '500': { l: 0.55, c: 0.12, h: 265 },
              '600': { l: 0.45, c: 0.14, h: 265 },
            },
            neutral: {
              '50': { l: 0.99, c: 0.005, h: 265 },
              '100': { l: 0.96, c: 0.01, h: 265 },
              '200': { l: 0.92, c: 0.015, h: 265 },
              '300': { l: 0.85, c: 0.02, h: 265 },
              '500': { l: 0.6, c: 0.03, h: 265 },
              '900': { l: 0.2, c: 0.04, h: 265 },
            },
            white: { l: 1, c: 0, h: 0 },
          },
          spacing: {
            '0': '0',
            '1': '4px',
            '2': '8px',
            '4': '16px',
          },
          radius: {
            sm: '4px',
            md: '6px',
            lg: '8px',
            full: '9999px',
          },
        },
        semantic: {
          background: {
            canvas: 'atomic.color.neutral.50',
            surface: {
              subtle: 'atomic.color.neutral.50',
              default: 'atomic.color.white',
              emphasis: 'atomic.color.neutral.100',
            },
            brand: {
              subtle: 'atomic.color.brand.100',
              default: 'atomic.color.brand.500',
              emphasis: 'atomic.color.brand.600',
            },
          },
          border: {
            default: {
              subtle: 'atomic.color.neutral.100',
              default: 'atomic.color.neutral.200',
              emphasis: 'atomic.color.neutral.300',
            },
          },
          text: {
            primary: 'atomic.color.neutral.900',
            secondary: 'atomic.color.neutral.500',
            muted: 'atomic.color.neutral.500',
          },
        },
      },
    };

    it('should generate CSS Variables from theme JSON', () => {
      const css = themeToCSS(linearMinimalV1);

      expect(css).toContain(':root');
      expect(css).toContain('[data-theme="linear-minimal-v1"]');
      expect(css).toContain('--tekton-bg-background:');
      expect(css).toContain('--tekton-bg-primary:');
      expect(css).toContain('--tekton-border-default:');
      expect(css).toContain('--tekton-radius-sm: 4px');
      expect(css).toContain('--tekton-spacing-1: 4px');
    });

    it('should resolve semantic tokens to OKLCH colors', () => {
      const css = themeToCSS(linearMinimalV1);

      // Check background tokens resolve to OKLCH
      expect(css).toContain('oklch(0.99 0.005 265)'); // neutral.50
      expect(css).toContain('oklch(0.55 0.12 265)'); // brand.500
      expect(css).toContain('oklch(1 0 0)'); // white
    });

    it('should include all spacing tokens', () => {
      const css = themeToCSS(linearMinimalV1);

      expect(css).toContain('--tekton-spacing-0: 0');
      expect(css).toContain('--tekton-spacing-1: 4px');
      expect(css).toContain('--tekton-spacing-2: 8px');
      expect(css).toContain('--tekton-spacing-4: 16px');
    });

    it('should include all radius tokens', () => {
      const css = themeToCSS(linearMinimalV1);

      expect(css).toContain('--tekton-radius-sm: 4px');
      expect(css).toContain('--tekton-radius-md: 6px');
      expect(css).toContain('--tekton-radius-lg: 8px');
      expect(css).toContain('--tekton-radius-full: 9999px');
    });
  });

  describe('linear-minimal-v1 integration', () => {
    it('should match SPEC requirements for token naming', () => {
      const linearMinimal = {
        id: 'linear-minimal-v1',
        name: 'Linear Minimal',
        schemaVersion: '2.1',
        tokens: {
          atomic: {
            color: {
              brand: { '500': { l: 0.55, c: 0.12, h: 265 } },
              neutral: {
                '50': { l: 0.99, c: 0.005, h: 265 },
                '500': { l: 0.6, c: 0.03, h: 265 },
                '900': { l: 0.2, c: 0.04, h: 265 },
              },
              white: { l: 1, c: 0, h: 0 },
            },
            spacing: { '1': '4px' },
            radius: { md: '6px' },
          },
          semantic: {
            background: {
              canvas: 'atomic.color.neutral.50',
              surface: {
                default: 'atomic.color.white',
                subtle: 'atomic.color.neutral.50',
                emphasis: 'atomic.color.neutral.50',
              },
              brand: {
                default: 'atomic.color.brand.500',
                subtle: 'atomic.color.brand.500',
                emphasis: 'atomic.color.brand.500',
              },
            },
            border: {
              default: {
                default: 'atomic.color.neutral.50',
                subtle: 'atomic.color.neutral.50',
                emphasis: 'atomic.color.neutral.50',
              },
            },
          },
        },
      } as ThemeDefinition;

      const css = themeToCSS(linearMinimal);

      // SPEC-UI-001 requirements: All tokens must follow --tekton-* pattern
      const tektonTokenPattern = /--tekton-[a-z-]+:/g;
      const matches = css.match(tektonTokenPattern);

      expect(matches).toBeTruthy();
      expect(matches!.length).toBeGreaterThan(0);

      // No hardcoded colors should exist (except in fallbacks)
      expect(css).not.toContain('#');
      expect(css).not.toMatch(/rgb\(/);
      expect(css).not.toMatch(/hsl\(/);
    });
  });
});
