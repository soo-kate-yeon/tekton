import { describe, it, expect } from 'vitest';
import { generateTokensFromPreset } from '../../src/presets';
import { loadDefaultPreset } from '../../src/presets/loader';
import type { Preset } from '../../src/presets/types';

describe('Preset Integration', () => {
  const validPreset: Preset = {
    id: 'test-preset',
    version: '1.0.0',
    name: 'Test Preset',
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

  describe('generateTokensFromPreset', () => {

    it('generates CSS from preset', () => {
      const css = generateTokensFromPreset(validPreset, { format: 'css' });

      expect(css).toContain(':root');
      expect(css).toContain('--');
      expect(css).toContain('oklch');
    });

    it('generates DTCG from preset', () => {
      const dtcg = generateTokensFromPreset(validPreset, { format: 'dtcg' });

      expect(dtcg).toContain('{');
      expect(dtcg).toContain('}');
      expect(dtcg).toContain('$type');
      expect(dtcg).toContain('color');
    });

    it('generates Tailwind from preset', () => {
      const tailwind = generateTokensFromPreset(validPreset, { format: 'tailwind' });

      expect(tailwind).toContain('module.exports');
      expect(tailwind).toContain('theme');
      expect(tailwind).toContain('colors');
    });

    it('defaults to CSS format when format not specified', () => {
      const output = generateTokensFromPreset(validPreset);

      expect(output).toContain(':root');
      expect(output).toContain('--');
    });

    it('maintains deterministic output', () => {
      const output1 = generateTokensFromPreset(validPreset, { format: 'css' });
      const output2 = generateTokensFromPreset(validPreset, { format: 'css' });

      expect(output1).toBe(output2);
    });

    it('throws for unsupported format', () => {
      expect(() =>
        generateTokensFromPreset(validPreset, { format: 'invalid' as any })
      ).toThrow('Unsupported format');
    });
  });

  describe('full workflow', () => {
    it('loads preset → generates tokens → exports CSS', () => {
      const preset = loadDefaultPreset('next-tailwind-shadcn');
      const css = generateTokensFromPreset(preset, { format: 'css' });

      expect(css).toContain(':root');
      expect(preset.id).toBe('next-tailwind-shadcn');
    });

    it('produces valid shadcn/ui compatible tokens', () => {
      const preset = loadDefaultPreset('next-tailwind-shadcn');
      const css = generateTokensFromPreset(preset, { format: 'css' });

      // Check for common shadcn/ui token names
      expect(css).toMatch(/--background|--foreground|--primary/);
    });
  });

  describe('edge cases', () => {
    it('handles extreme color values', () => {
      const extremePreset: Preset = {
        ...validPreset,
        questionnaire: {
          ...validPreset.questionnaire,
          primaryColor: { l: 0.99, c: 0.37, h: 360 },
        },
      };

      const css = generateTokensFromPreset(extremePreset, { format: 'css' });
      expect(css).toContain('oklch');
    });

    it('handles all questionnaire variations', () => {
      const variations: Preset = {
        ...validPreset,
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

      const css = generateTokensFromPreset(variations, { format: 'css' });
      expect(css).toContain(':root');
    });
  });
});
