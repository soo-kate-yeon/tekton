import { describe, it, expect } from 'vitest';
import {
  colorTokenToCSS,
  parseOKLCHString,
  clampOKLCH,
  roundOKLCH,
  interpolateOKLCH,
  generateColorScale,
  areColorsSimilar,
  OKLCH_BOUNDS,
  COLOR_SCALE_STEPS,
} from '@/lib/token-editor/oklch-utils';
import type { ColorToken } from '@tekton/token-contract';

describe('oklch-utils', () => {
  describe('colorTokenToCSS', () => {
    it('converts ColorToken to OKLCH CSS string', () => {
      const color: ColorToken = { l: 0.5, c: 0.15, h: 220 };
      expect(colorTokenToCSS(color)).toBe('oklch(0.5 0.15 220)');
    });

    it('handles zero values', () => {
      const color: ColorToken = { l: 0, c: 0, h: 0 };
      expect(colorTokenToCSS(color)).toBe('oklch(0 0 0)');
    });
  });

  describe('parseOKLCHString', () => {
    it('parses valid OKLCH string', () => {
      const result = parseOKLCHString('oklch(0.5 0.15 220)');
      expect(result).toEqual({ l: 0.5, c: 0.15, h: 220 });
    });

    it('returns null for invalid string', () => {
      expect(parseOKLCHString('rgb(255, 0, 0)')).toBeNull();
      expect(parseOKLCHString('invalid')).toBeNull();
    });

    it('handles spaces in string', () => {
      const result = parseOKLCHString('oklch( 0.5  0.15  220 )');
      expect(result).toEqual({ l: 0.5, c: 0.15, h: 220 });
    });
  });

  describe('clampOKLCH', () => {
    it('clamps values within bounds', () => {
      const color: ColorToken = { l: 1.5, c: 0.6, h: 400 };
      const result = clampOKLCH(color);

      expect(result.l).toBe(OKLCH_BOUNDS.l.max);
      expect(result.c).toBe(OKLCH_BOUNDS.c.max);
      expect(result.h).toBe(OKLCH_BOUNDS.h.max);
    });

    it('clamps negative values to minimum', () => {
      const color: ColorToken = { l: -0.5, c: -0.1, h: -10 };
      const result = clampOKLCH(color);

      expect(result.l).toBe(OKLCH_BOUNDS.l.min);
      expect(result.c).toBe(OKLCH_BOUNDS.c.min);
      expect(result.h).toBe(OKLCH_BOUNDS.h.min);
    });

    it('leaves valid values unchanged', () => {
      const color: ColorToken = { l: 0.5, c: 0.15, h: 180 };
      const result = clampOKLCH(color);

      expect(result).toEqual(color);
    });
  });

  describe('roundOKLCH', () => {
    it('rounds to specified decimals', () => {
      const color: ColorToken = { l: 0.12345, c: 0.15678, h: 220.999 };
      const result = roundOKLCH(color, 2);

      expect(result.l).toBe(0.12);
      expect(result.c).toBe(0.16);
      expect(result.h).toBe(221);
    });

    it('defaults to 3 decimals', () => {
      const color: ColorToken = { l: 0.12345, c: 0.15678, h: 220.1234 };
      const result = roundOKLCH(color);

      expect(result.l).toBe(0.123);
      expect(result.c).toBe(0.157);
      expect(result.h).toBe(220.123);
    });
  });

  describe('interpolateOKLCH', () => {
    it('interpolates between two colors', () => {
      const color1: ColorToken = { l: 0, c: 0, h: 0 };
      const color2: ColorToken = { l: 1, c: 0.4, h: 360 };

      const result = interpolateOKLCH(color1, color2, 0.5);

      expect(result.l).toBe(0.5);
      expect(result.c).toBe(0.2);
    });

    it('returns first color at t=0', () => {
      const color1: ColorToken = { l: 0.3, c: 0.1, h: 100 };
      const color2: ColorToken = { l: 0.7, c: 0.3, h: 200 };

      const result = interpolateOKLCH(color1, color2, 0);

      expect(result.l).toBe(0.3);
      expect(result.c).toBe(0.1);
    });

    it('returns second color at t=1', () => {
      const color1: ColorToken = { l: 0.3, c: 0.1, h: 100 };
      const color2: ColorToken = { l: 0.7, c: 0.3, h: 200 };

      const result = interpolateOKLCH(color1, color2, 1);

      expect(result.l).toBe(0.7);
      expect(result.c).toBe(0.3);
    });
  });

  describe('generateColorScale', () => {
    it('generates all 11 scale steps', () => {
      const baseColor: ColorToken = { l: 0.53, c: 0.15, h: 220 };
      const result = generateColorScale(baseColor);

      expect(Object.keys(result)).toHaveLength(11);
      COLOR_SCALE_STEPS.forEach((step) => {
        expect(result[step]).toBeDefined();
      });
    });

    it('maintains hue across scale', () => {
      const baseColor: ColorToken = { l: 0.53, c: 0.15, h: 220 };
      const result = generateColorScale(baseColor);

      COLOR_SCALE_STEPS.forEach((step) => {
        expect(result[step].h).toBe(220);
      });
    });

    it('lightness decreases from 50 to 950', () => {
      const baseColor: ColorToken = { l: 0.53, c: 0.15, h: 220 };
      const result = generateColorScale(baseColor);

      expect(result['50'].l).toBeGreaterThan(result['500'].l);
      expect(result['500'].l).toBeGreaterThan(result['950'].l);
    });
  });

  describe('areColorsSimilar', () => {
    it('returns true for identical colors', () => {
      const color: ColorToken = { l: 0.5, c: 0.15, h: 220 };
      expect(areColorsSimilar(color, color)).toBe(true);
    });

    it('returns true for very similar colors', () => {
      const color1: ColorToken = { l: 0.5, c: 0.15, h: 220 };
      const color2: ColorToken = { l: 0.51, c: 0.15, h: 220 };
      expect(areColorsSimilar(color1, color2)).toBe(true);
    });

    it('returns false for different colors', () => {
      const color1: ColorToken = { l: 0.5, c: 0.15, h: 220 };
      const color2: ColorToken = { l: 0.8, c: 0.3, h: 100 };
      expect(areColorsSimilar(color1, color2)).toBe(false);
    });
  });
});
