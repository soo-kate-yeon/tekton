import { describe, it, expect } from 'vitest';
import { generateTokensFromTheme } from '../../src/themes';
import { loadDefaultTheme } from '../../src/themes/loader';
import type { Theme } from '../../src/themes/types';

describe('Theme Integration', () => {
  const validTheme: Theme = {
    id: 'test-theme',
    version: '1.0.0',
    name: 'Test Theme',
    description: 'Test',
    stack: {
      framework: 'nextjs',
      styling: 'tailwindcss',
      components: 'shadcn-ui',
    },
    questionnaire: {
      brandTone: 'professional',
      contrast: 'high',
      density: 'comfortable',
      borderRadius: 'medium',
      primaryColor: { l: 0.5, c: 0.15, h: 220 },
      neutralTone: 'pure',
      fontScale: 'medium',
    },
  };

  describe('generateTokensFromTheme', () => {
    it('generates CSS from theme', () => {
      const css = generateTokensFromTheme(validTheme, { format: 'css' });

      expect(css).toContain(':root');
      expect(css).toContain('--');
      expect(css).toContain('oklch');
    });

    it('generates DTCG from theme', () => {
      const dtcg = generateTokensFromTheme(validTheme, { format: 'dtcg' });

      expect(dtcg).toContain('{');
      expect(dtcg).toContain('}');
      expect(dtcg).toContain('$type');
      expect(dtcg).toContain('color');
    });

    it('generates Tailwind from theme', () => {
      const tailwind = generateTokensFromTheme(validTheme, { format: 'tailwind' });

      expect(tailwind).toContain('module.exports');
      expect(tailwind).toContain('theme');
      expect(tailwind).toContain('colors');
    });

    it('defaults to CSS format when format not specified', () => {
      const output = generateTokensFromTheme(validTheme);

      expect(output).toContain(':root');
      expect(output).toContain('--');
    });

    it('maintains deterministic output', () => {
      const output1 = generateTokensFromTheme(validTheme, { format: 'css' });
      const output2 = generateTokensFromTheme(validTheme, { format: 'css' });

      expect(output1).toBe(output2);
    });

    it('throws for unsupported format', () => {
      expect(() => generateTokensFromTheme(validTheme, { format: 'invalid' as any })).toThrow(
        'Unsupported format'
      );
    });
  });

  describe('full workflow', () => {
    it('loads theme → generates tokens → exports CSS', () => {
      const theme = loadDefaultTheme('next-tailwind-shadcn');
      const css = generateTokensFromTheme(theme, { format: 'css' });

      expect(css).toContain(':root');
      expect(theme.id).toBe('next-tailwind-shadcn');
    });

    it('produces valid shadcn/ui compatible tokens', () => {
      const theme = loadDefaultTheme('next-tailwind-shadcn');
      const css = generateTokensFromTheme(theme, { format: 'css' });

      // Check for common shadcn/ui token names
      expect(css).toMatch(/--background|--foreground|--primary/);
    });
  });

  describe('edge cases', () => {
    it('handles extreme color values', () => {
      const extremeTheme: Theme = {
        ...validTheme,
        questionnaire: {
          ...validTheme.questionnaire,
          primaryColor: { l: 0.99, c: 0.37, h: 360 },
        },
      };

      const css = generateTokensFromTheme(extremeTheme, { format: 'css' });
      expect(css).toContain('oklch');
    });

    it('handles all questionnaire variations', () => {
      const variations: Theme = {
        ...validTheme,
        questionnaire: {
          brandTone: 'playful',
          contrast: 'low',
          density: 'compact',
          borderRadius: 'large',
          primaryColor: { l: 0.3, c: 0.1, h: 180 },
          neutralTone: 'warm',
          fontScale: 'small',
        },
      };

      const css = generateTokensFromTheme(variations, { format: 'css' });
      expect(css).toContain(':root');
    });
  });
});
