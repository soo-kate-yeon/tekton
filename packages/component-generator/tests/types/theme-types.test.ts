/**
 * Theme Types Tests
 * TAG: SPEC-THEME-BIND-001
 *
 * Tests for theme configuration and resolved token types
 */

import { describe, it, expect } from 'vitest';
import type {
  ThemeConfig,
  ResolvedTokens,
  OKLCHColor,
  ThemeOptions,
} from '../../src/types/theme-types';

describe('Theme Types', () => {
  it('should export all required types from theme-types module', async () => {
    const themeTypesModule = await import('../../src/types/theme-types');

    // Verify module exports exist (this will fail if file doesn't exist)
    expect(themeTypesModule).toBeDefined();
  });

  describe('ThemeConfig interface', () => {
    it('should accept valid theme configuration', () => {
      const themeConfig: ThemeConfig = {
        id: 'calm-wellness',
        name: 'Calm Wellness',
        description: 'Calm and meditative atmosphere',
        stackInfo: {
          framework: 'nextjs',
          styling: 'tailwindcss',
          components: 'shadcn-ui',
        },
        brandTone: 'calm',
        colorPalette: {
          primary: { l: 0.70, c: 0.10, h: 170 },
          secondary: { l: 0.20, c: 0.02, h: 40 },
          accent: { l: 0.80, c: 0.12, h: 60 },
          neutral: { l: 0.95, c: 0.01, h: 40 },
        },
        typography: {
          fontFamily: 'System',
          fontScale: 'small',
          headingWeight: 400,
          bodyWeight: 400,
        },
        componentDefaults: {
          borderRadius: 'large',
          density: 'spacious',
          contrast: 'medium',
        },
        aiContext: {
          brandTone: 'calm',
          designPhilosophy: 'Soft, rounded, and breathable',
          colorGuidance: 'Pastel tones',
          componentGuidance: 'Fully rounded buttons',
          accessibilityNotes: 'Maintain sufficient contrast',
        },
      };

      expect(themeConfig.id).toBe('calm-wellness');
      expect(themeConfig.brandTone).toBe('calm');
    });

    it('should have correct color palette structure with OKLCH values', () => {

      const theme: ThemeConfig = {
        id: 'test-theme',
        name: 'Test Theme',
        description: 'Test',
        stackInfo: { framework: 'nextjs', styling: 'tailwindcss', components: 'shadcn-ui' },
        brandTone: 'professional',
        colorPalette: {
          primary: { l: 0.5, c: 0.1, h: 180 },
          secondary: { l: 0.3, c: 0.05, h: 200 },
          accent: { l: 0.7, c: 0.15, h: 60 },
          neutral: { l: 0.9, c: 0.01, h: 0 },
        },
        typography: {
          fontFamily: 'System',
          fontScale: 'medium',
          headingWeight: 500,
          bodyWeight: 400,
        },
        componentDefaults: {
          borderRadius: 'medium',
          density: 'comfortable',
          contrast: 'medium',
        },
        aiContext: {
          brandTone: 'professional',
          designPhilosophy: 'Clean',
          colorGuidance: 'Neutral',
          componentGuidance: 'Standard',
          accessibilityNotes: 'WCAG AA',
        },
      };

      expect(theme.colorPalette.primary).toHaveProperty('l');
      expect(theme.colorPalette.primary).toHaveProperty('c');
      expect(theme.colorPalette.primary).toHaveProperty('h');
      expect(theme.colorPalette.primary.l).toBeGreaterThanOrEqual(0);
      expect(theme.colorPalette.primary.l).toBeLessThanOrEqual(1);
    });
  });

  describe('ResolvedTokens interface', () => {
    it('should represent resolved CSS variable tokens', () => {

      const resolvedTokens: ResolvedTokens = {
        'color-primary': 'oklch(0.70 0.10 170)',
        'color-secondary': 'oklch(0.20 0.02 40)',
        'color-accent': 'oklch(0.80 0.12 60)',
        'color-neutral': 'oklch(0.95 0.01 40)',
        'spacing-base': '1rem',
        'border-radius-large': '16px',
      };

      expect(resolvedTokens['color-primary']).toBe('oklch(0.70 0.10 170)');
      expect(Object.keys(resolvedTokens).length).toBeGreaterThan(0);
    });

    it('should use semantic token names without vendor prefix', () => {

      const tokens: ResolvedTokens = {
        'color-surface': '#ffffff',
        'color-text': '#000000',
        'font-size-base': '16px',
      };

      // Verify no "tekton-" prefix (requirement: semantic naming)
      Object.keys(tokens).forEach((key) => {
        expect(key).not.toMatch(/^tekton-/);
      });
    });
  });

  describe('OKLCHColor interface', () => {
    it('should represent OKLCH color values', () => {

      const color: OKLCHColor = {
        l: 0.75,
        c: 0.12,
        h: 180,
      };

      expect(color.l).toBe(0.75);
      expect(color.c).toBe(0.12);
      expect(color.h).toBe(180);
    });

    it('should validate OKLCH ranges', () => {

      const validColor: OKLCHColor = {
        l: 0.5,  // 0-1 range
        c: 0.2,  // 0-0.4 typical
        h: 270,  // 0-360 degrees
      };

      expect(validColor.l).toBeGreaterThanOrEqual(0);
      expect(validColor.l).toBeLessThanOrEqual(1);
      expect(validColor.h).toBeGreaterThanOrEqual(0);
      expect(validColor.h).toBeLessThanOrEqual(360);
    });
  });

  describe('ThemeOptions interface', () => {
    it('should configure theme resolution options', () => {

      const options: ThemeOptions = {
        themeId: 'calm-wellness',
        fallbackTheme: 'calm-wellness',
        warnOnMissingTokens: true,
      };

      expect(options.themeId).toBe('calm-wellness');
      expect(options.fallbackTheme).toBe('calm-wellness');
      expect(options.warnOnMissingTokens).toBe(true);
    });

    it('should support optional properties', () => {

      const minimalOptions: ThemeOptions = {
        themeId: 'tech-startup',
      };

      expect(minimalOptions.themeId).toBe('tech-startup');
      expect(minimalOptions.fallbackTheme).toBeUndefined();
    });
  });
});
