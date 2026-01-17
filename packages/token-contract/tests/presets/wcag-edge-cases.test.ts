import { describe, it, expect } from 'vitest';
import { validateWCAGCompliance } from '../../src/presets/wcag-compliance.js';
import type { Preset } from '../../src/presets/types.js';

describe('WCAG Compliance Edge Cases', () => {
  describe('missing color scales', () => {
    it('should throw error for preset missing neutral background', () => {
      const invalidPreset = {
        name: 'test' as const,
        description: 'Test',
        tokens: {
          primary: {
            '500': { l: 0.5, c: 0.15, h: 220 },
          },
          neutral: {}, // Missing required neutral colors
          success: {
            '500': { l: 0.5, c: 0.15, h: 140 },
          },
          warning: {
            '500': { l: 0.5, c: 0.15, h: 60 },
          },
          error: {
            '500': { l: 0.5, c: 0.15, h: 0 },
          },
        },
        composition: {
          border: {
            width: '1px',
            style: 'solid' as const,
            color: { l: 0.9, c: 0, h: 0 },
            radius: '4px',
          },
          shadow: {
            x: '0px',
            y: '1px',
            blur: '2px',
            color: { l: 0, c: 0, h: 0 },
          },
          spacing: {
            padding: '1rem',
            margin: '1rem',
            gap: '0.5rem',
          },
          typography: {
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: '1.5',
            letterSpacing: '0em',
          },
        },
      } as Preset;

      expect(() => validateWCAGCompliance(invalidPreset, 'AA')).toThrow(
        'Preset missing required neutral background colors'
      );
    });
  });

  describe('contrast calculation edge cases', () => {
    it('should handle preset with minimal color scale steps', () => {
      const minimalPreset = {
        name: 'minimal-test' as const,
        description: 'Minimal test preset',
        tokens: {
          primary: {
            '50': { l: 0.95, c: 0.05, h: 220 },
            '500': { l: 0.5, c: 0.15, h: 220 },
            '900': { l: 0.15, c: 0.1, h: 220 },
          },
          neutral: {
            '50': { l: 0.98, c: 0, h: 0 },
            '900': { l: 0.15, c: 0, h: 0 },
          },
          success: {
            '500': { l: 0.5, c: 0.15, h: 140 },
          },
          warning: {
            '500': { l: 0.5, c: 0.15, h: 60 },
          },
          error: {
            '500': { l: 0.5, c: 0.15, h: 0 },
          },
        },
        composition: {
          border: {
            width: '1px',
            style: 'solid' as const,
            color: { l: 0.9, c: 0, h: 0 },
            radius: '4px',
          },
          shadow: {
            x: '0px',
            y: '1px',
            blur: '2px',
            color: { l: 0, c: 0, h: 0 },
          },
          spacing: {
            padding: '1rem',
            margin: '1rem',
            gap: '0.5rem',
          },
          typography: {
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: '1.5',
            letterSpacing: '0em',
          },
        },
      } as Preset;

      const result = validateWCAGCompliance(minimalPreset, 'AA');
      expect(result.checks.length).toBeGreaterThan(0);
    });

    it('should handle AAA level validation', () => {
      const preset = {
        name: 'aaa-test' as const,
        description: 'AAA test preset',
        tokens: {
          primary: {
            '500': { l: 0.3, c: 0.15, h: 220 },
            '600': { l: 0.25, c: 0.15, h: 220 },
            '700': { l: 0.2, c: 0.14, h: 220 },
          },
          neutral: {
            '50': { l: 0.98, c: 0, h: 0 },
            '900': { l: 0.12, c: 0, h: 0 },
          },
          success: {
            '500': { l: 0.3, c: 0.15, h: 140 },
            '600': { l: 0.25, c: 0.15, h: 140 },
            '700': { l: 0.2, c: 0.14, h: 140 },
          },
          warning: {
            '500': { l: 0.4, c: 0.15, h: 60 },
            '600': { l: 0.35, c: 0.15, h: 60 },
            '700': { l: 0.3, c: 0.14, h: 60 },
          },
          error: {
            '500': { l: 0.3, c: 0.15, h: 0 },
            '600': { l: 0.25, c: 0.15, h: 0 },
            '700': { l: 0.2, c: 0.14, h: 0 },
          },
        },
        composition: {
          border: {
            width: '1px',
            style: 'solid' as const,
            color: { l: 0.9, c: 0, h: 0 },
            radius: '4px',
          },
          shadow: {
            x: '0px',
            y: '1px',
            blur: '2px',
            color: { l: 0, c: 0, h: 0 },
          },
          spacing: {
            padding: '1rem',
            margin: '1rem',
            gap: '0.5rem',
          },
          typography: {
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: '1.5',
            letterSpacing: '0em',
          },
        },
      } as Preset;

      const result = validateWCAGCompliance(preset, 'AAA');
      expect(result.level).toBe('AAA');
      expect(result.checks.length).toBeGreaterThan(0);
    });
  });
});
