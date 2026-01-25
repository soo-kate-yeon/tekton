import { describe, it, expect } from 'vitest';
import { oklchToRgb, rgbToOklch, oklchToHex, hexToOklch } from '../src/color-conversion';

describe('Color Space Utilities - TASK-006', () => {
  describe('oklchToRgb', () => {
    it('should convert pure white OKLCH to RGB', () => {
      const white = { l: 1, c: 0, h: 0 };
      const rgb = oklchToRgb(white);

      expect(rgb.r).toBeCloseTo(255, 0);
      expect(rgb.g).toBeCloseTo(255, 0);
      expect(rgb.b).toBeCloseTo(255, 0);
    });

    it('should convert pure black OKLCH to RGB', () => {
      const black = { l: 0, c: 0, h: 0 };
      const rgb = oklchToRgb(black);

      expect(rgb.r).toBeCloseTo(0, 0);
      expect(rgb.g).toBeCloseTo(0, 0);
      expect(rgb.b).toBeCloseTo(0, 0);
    });

    it('should convert blue OKLCH to RGB', () => {
      const blue = { l: 0.5, c: 0.15, h: 264 };
      const rgb = oklchToRgb(blue);

      expect(rgb.r).toBeGreaterThanOrEqual(0);
      expect(rgb.r).toBeLessThanOrEqual(255);
      expect(rgb.g).toBeGreaterThanOrEqual(0);
      expect(rgb.g).toBeLessThanOrEqual(255);
      expect(rgb.b).toBeGreaterThanOrEqual(0);
      expect(rgb.b).toBeLessThanOrEqual(255);
    });

    it('should handle mid-gray conversion', () => {
      const gray = { l: 0.5, c: 0, h: 0 };
      const rgb = oklchToRgb(gray);

      // Gray should have equal RGB values
      expect(Math.abs(rgb.r - rgb.g)).toBeLessThan(5);
      expect(Math.abs(rgb.g - rgb.b)).toBeLessThan(5);
    });
  });

  describe('rgbToOklch', () => {
    it('should convert white RGB to OKLCH', () => {
      const white = { r: 255, g: 255, b: 255 };
      const oklch = rgbToOklch(white);

      expect(oklch.l).toBeCloseTo(1, 1);
      expect(oklch.c).toBeCloseTo(0, 1);
    });

    it('should convert black RGB to OKLCH', () => {
      const black = { r: 0, g: 0, b: 0 };
      const oklch = rgbToOklch(black);

      expect(oklch.l).toBeCloseTo(0, 1);
      expect(oklch.c).toBeCloseTo(0, 1);
    });

    it('should convert gray RGB to achromatic OKLCH', () => {
      const gray = { r: 128, g: 128, b: 128 };
      const oklch = rgbToOklch(gray);

      expect(oklch.c).toBeCloseTo(0, 1);
    });
  });

  describe('round-trip conversion', () => {
    it('should maintain color integrity in OKLCH -> RGB -> OKLCH', () => {
      const original = { l: 0.6, c: 0.1, h: 180 };
      const rgb = oklchToRgb(original);
      const roundtrip = rgbToOklch(rgb);

      expect(roundtrip.l).toBeCloseTo(original.l, 1);
      expect(roundtrip.c).toBeCloseTo(original.c, 1);
      // Hue can be unstable for low chroma
      if (original.c > 0.01) {
        expect(roundtrip.h).toBeCloseTo(original.h, 0);
      }
    });
  });

  describe('oklchToHex', () => {
    it('should convert OKLCH to hex string', () => {
      const white = { l: 1, c: 0, h: 0 };
      const hex = oklchToHex(white);

      expect(hex).toMatch(/^#[0-9A-F]{6}$/);
      expect(hex.toLowerCase()).toBe('#ffffff');
    });

    it('should convert black OKLCH to hex', () => {
      const black = { l: 0, c: 0, h: 0 };
      const hex = oklchToHex(black);

      expect(hex.toLowerCase()).toBe('#000000');
    });
  });

  describe('hexToOklch', () => {
    it('should convert hex to OKLCH', () => {
      const hex = '#FFFFFF';
      const oklch = hexToOklch(hex);

      expect(oklch.l).toBeCloseTo(1, 1);
      expect(oklch.c).toBeCloseTo(0, 1);
    });

    it('should handle lowercase hex', () => {
      const hex = '#ffffff';
      const oklch = hexToOklch(hex);

      expect(oklch.l).toBeCloseTo(1, 1);
    });

    it('should handle hex without hash', () => {
      const hex = 'FFFFFF';
      const oklch = hexToOklch(hex);

      expect(oklch.l).toBeCloseTo(1, 1);
    });
  });
});
