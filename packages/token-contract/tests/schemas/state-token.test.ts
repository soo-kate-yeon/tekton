import { describe, it, expect } from 'vitest';
import { StateTokenSchema } from '../../src/schemas/state-token.js';

describe('StateTokenSchema', () => {
  const validColor = { l: 0.5, c: 0.15, h: 220 };

  describe('valid state tokens', () => {
    it('should accept complete state token set', () => {
      const validStateTokens = {
        default: validColor,
        hover: { l: 0.45, c: 0.15, h: 220 },
        active: { l: 0.4, c: 0.15, h: 220 },
        focus: { l: 0.5, c: 0.18, h: 220 },
        disabled: { l: 0.7, c: 0.05, h: 220 },
        error: { l: 0.5, c: 0.15, h: 0 },
      };
      expect(() => StateTokenSchema.parse(validStateTokens)).not.toThrow();
    });

    it('should accept minimal required state tokens (without error)', () => {
      const minimalStateTokens = {
        default: validColor,
        hover: { l: 0.45, c: 0.15, h: 220 },
        active: { l: 0.4, c: 0.15, h: 220 },
        focus: { l: 0.5, c: 0.18, h: 220 },
        disabled: { l: 0.7, c: 0.05, h: 220 },
      };
      expect(() => StateTokenSchema.parse(minimalStateTokens)).not.toThrow();
    });

    it('should accept state tokens with varying hues', () => {
      const varyingHues = {
        default: { l: 0.5, c: 0.15, h: 220 },
        hover: { l: 0.5, c: 0.15, h: 210 }, // Different hue
        active: { l: 0.5, c: 0.15, h: 200 },
        focus: { l: 0.5, c: 0.15, h: 230 },
        disabled: { l: 0.5, c: 0.05, h: 220 },
      };
      expect(() => StateTokenSchema.parse(varyingHues)).not.toThrow();
    });
  });

  describe('invalid state tokens', () => {
    it('should reject missing default state', () => {
      const missingDefault = {
        hover: validColor,
        active: validColor,
        focus: validColor,
        disabled: validColor,
      };
      expect(() => StateTokenSchema.parse(missingDefault)).toThrow();
    });

    it('should reject missing hover state', () => {
      const missingHover = {
        default: validColor,
        active: validColor,
        focus: validColor,
        disabled: validColor,
      };
      expect(() => StateTokenSchema.parse(missingHover)).toThrow();
    });

    it('should reject missing active state', () => {
      const missingActive = {
        default: validColor,
        hover: validColor,
        focus: validColor,
        disabled: validColor,
      };
      expect(() => StateTokenSchema.parse(missingActive)).toThrow();
    });

    it('should reject missing focus state', () => {
      const missingFocus = {
        default: validColor,
        hover: validColor,
        active: validColor,
        disabled: validColor,
      };
      expect(() => StateTokenSchema.parse(missingFocus)).toThrow();
    });

    it('should reject missing disabled state', () => {
      const missingDisabled = {
        default: validColor,
        hover: validColor,
        active: validColor,
        focus: validColor,
      };
      expect(() => StateTokenSchema.parse(missingDisabled)).toThrow();
    });

    it('should reject invalid color in state token', () => {
      const invalidColor = {
        default: { l: 1.5, c: 0.15, h: 220 }, // Invalid lightness
        hover: validColor,
        active: validColor,
        focus: validColor,
        disabled: validColor,
      };
      expect(() => StateTokenSchema.parse(invalidColor)).toThrow();
    });

    it('should reject non-object state values', () => {
      const invalidValue = {
        default: 'not a color',
        hover: validColor,
        active: validColor,
        focus: validColor,
        disabled: validColor,
      };
      expect(() => StateTokenSchema.parse(invalidValue)).toThrow();
    });
  });
});
