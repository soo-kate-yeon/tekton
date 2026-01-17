import { describe, it, expect } from 'vitest';
import { ColorTokenSchema, ColorScaleSchema } from '../../src/schemas/color-token.js';

describe('ColorTokenSchema', () => {
  describe('valid color tokens', () => {
    it('should accept valid OKLCH color values', () => {
      const validColor = { l: 0.5, c: 0.15, h: 220 };
      expect(() => ColorTokenSchema.parse(validColor)).not.toThrow();
    });

    it('should accept lightness at boundaries (0 and 1)', () => {
      expect(() => ColorTokenSchema.parse({ l: 0, c: 0.15, h: 220 })).not.toThrow();
      expect(() => ColorTokenSchema.parse({ l: 1, c: 0.15, h: 220 })).not.toThrow();
    });

    it('should accept chroma at boundaries (0 and 0.4)', () => {
      expect(() => ColorTokenSchema.parse({ l: 0.5, c: 0, h: 220 })).not.toThrow();
      expect(() => ColorTokenSchema.parse({ l: 0.5, c: 0.4, h: 220 })).not.toThrow();
    });

    it('should accept hue at boundaries (0 and 360)', () => {
      expect(() => ColorTokenSchema.parse({ l: 0.5, c: 0.15, h: 0 })).not.toThrow();
      expect(() => ColorTokenSchema.parse({ l: 0.5, c: 0.15, h: 360 })).not.toThrow();
    });
  });

  describe('invalid color tokens', () => {
    it('should reject lightness outside 0-1 range', () => {
      expect(() => ColorTokenSchema.parse({ l: -0.1, c: 0.15, h: 220 })).toThrow();
      expect(() => ColorTokenSchema.parse({ l: 1.1, c: 0.15, h: 220 })).toThrow();
    });

    it('should reject chroma outside 0-0.4 range', () => {
      expect(() => ColorTokenSchema.parse({ l: 0.5, c: -0.1, h: 220 })).toThrow();
      expect(() => ColorTokenSchema.parse({ l: 0.5, c: 0.5, h: 220 })).toThrow();
    });

    it('should reject hue outside 0-360 range', () => {
      expect(() => ColorTokenSchema.parse({ l: 0.5, c: 0.15, h: -1 })).toThrow();
      expect(() => ColorTokenSchema.parse({ l: 0.5, c: 0.15, h: 361 })).toThrow();
    });

    it('should reject missing properties', () => {
      expect(() => ColorTokenSchema.parse({ l: 0.5, c: 0.15 })).toThrow();
      expect(() => ColorTokenSchema.parse({ l: 0.5, h: 220 })).toThrow();
      expect(() => ColorTokenSchema.parse({ c: 0.15, h: 220 })).toThrow();
    });

    it('should reject non-number values', () => {
      expect(() => ColorTokenSchema.parse({ l: '0.5', c: 0.15, h: 220 })).toThrow();
      expect(() => ColorTokenSchema.parse({ l: 0.5, c: '0.15', h: 220 })).toThrow();
      expect(() => ColorTokenSchema.parse({ l: 0.5, c: 0.15, h: '220' })).toThrow();
    });
  });
});

describe('ColorScaleSchema', () => {
  describe('valid color scales', () => {
    it('should accept valid 10-step color scale', () => {
      const validScale = {
        '50': { l: 0.95, c: 0.05, h: 220 },
        '100': { l: 0.9, c: 0.08, h: 220 },
        '200': { l: 0.8, c: 0.1, h: 220 },
        '300': { l: 0.7, c: 0.12, h: 220 },
        '400': { l: 0.6, c: 0.14, h: 220 },
        '500': { l: 0.5, c: 0.15, h: 220 },
        '600': { l: 0.4, c: 0.15, h: 220 },
        '700': { l: 0.3, c: 0.14, h: 220 },
        '800': { l: 0.2, c: 0.12, h: 220 },
        '900': { l: 0.15, c: 0.1, h: 220 },
        '950': { l: 0.1, c: 0.08, h: 220 },
      };
      expect(() => ColorScaleSchema.parse(validScale)).not.toThrow();
    });

    it('should accept partial color scale', () => {
      const partialScale = {
        '500': { l: 0.5, c: 0.15, h: 220 },
        '600': { l: 0.4, c: 0.15, h: 220 },
      };
      expect(() => ColorScaleSchema.parse(partialScale)).not.toThrow();
    });
  });

  describe('invalid color scales', () => {
    it('should reject invalid scale keys', () => {
      const invalidScale = {
        '250': { l: 0.5, c: 0.15, h: 220 }, // Invalid key
      };
      expect(() => ColorScaleSchema.parse(invalidScale)).toThrow();
    });

    it('should reject invalid color values in scale', () => {
      const invalidScale = {
        '500': { l: 1.5, c: 0.15, h: 220 }, // Invalid lightness
      };
      expect(() => ColorScaleSchema.parse(invalidScale)).toThrow();
    });

    it('should reject non-object values', () => {
      const invalidScale = {
        '500': 'not a color',
      };
      expect(() => ColorScaleSchema.parse(invalidScale)).toThrow();
    });
  });
});
