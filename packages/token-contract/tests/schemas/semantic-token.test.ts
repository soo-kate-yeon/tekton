import { describe, it, expect } from 'vitest';
import { SemanticTokenSchema } from '../../src/schemas/semantic-token.js';

describe('SemanticTokenSchema', () => {
  const validColorScale = {
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

  describe('valid semantic tokens', () => {
    it('should accept complete semantic token set', () => {
      const validSemanticTokens = {
        primary: validColorScale,
        secondary: validColorScale,
        accent: validColorScale,
        neutral: validColorScale,
        success: validColorScale,
        warning: validColorScale,
        error: validColorScale,
        info: validColorScale,
      };
      expect(() => SemanticTokenSchema.parse(validSemanticTokens)).not.toThrow();
    });

    it('should accept minimal required semantic tokens', () => {
      const minimalTokens = {
        primary: validColorScale,
        neutral: validColorScale,
        success: validColorScale,
        warning: validColorScale,
        error: validColorScale,
      };
      expect(() => SemanticTokenSchema.parse(minimalTokens)).not.toThrow();
    });

    it('should accept with optional secondary token', () => {
      const withSecondary = {
        primary: validColorScale,
        secondary: validColorScale,
        neutral: validColorScale,
        success: validColorScale,
        warning: validColorScale,
        error: validColorScale,
      };
      expect(() => SemanticTokenSchema.parse(withSecondary)).not.toThrow();
    });

    it('should accept with optional accent token', () => {
      const withAccent = {
        primary: validColorScale,
        accent: validColorScale,
        neutral: validColorScale,
        success: validColorScale,
        warning: validColorScale,
        error: validColorScale,
      };
      expect(() => SemanticTokenSchema.parse(withAccent)).not.toThrow();
    });

    it('should accept with optional info token', () => {
      const withInfo = {
        primary: validColorScale,
        neutral: validColorScale,
        success: validColorScale,
        warning: validColorScale,
        error: validColorScale,
        info: validColorScale,
      };
      expect(() => SemanticTokenSchema.parse(withInfo)).not.toThrow();
    });
  });

  describe('invalid semantic tokens', () => {
    it('should reject missing primary token', () => {
      const missingPrimary = {
        neutral: validColorScale,
        success: validColorScale,
        warning: validColorScale,
        error: validColorScale,
      };
      expect(() => SemanticTokenSchema.parse(missingPrimary)).toThrow();
    });

    it('should reject missing neutral token', () => {
      const missingNeutral = {
        primary: validColorScale,
        success: validColorScale,
        warning: validColorScale,
        error: validColorScale,
      };
      expect(() => SemanticTokenSchema.parse(missingNeutral)).toThrow();
    });

    it('should reject missing success token', () => {
      const missingSuccess = {
        primary: validColorScale,
        neutral: validColorScale,
        warning: validColorScale,
        error: validColorScale,
      };
      expect(() => SemanticTokenSchema.parse(missingSuccess)).toThrow();
    });

    it('should reject missing warning token', () => {
      const missingWarning = {
        primary: validColorScale,
        neutral: validColorScale,
        success: validColorScale,
        error: validColorScale,
      };
      expect(() => SemanticTokenSchema.parse(missingWarning)).toThrow();
    });

    it('should reject missing error token', () => {
      const missingError = {
        primary: validColorScale,
        neutral: validColorScale,
        success: validColorScale,
        warning: validColorScale,
      };
      expect(() => SemanticTokenSchema.parse(missingError)).toThrow();
    });

    it('should reject invalid color scale in semantic token', () => {
      const invalidScale = {
        primary: { '500': { l: 1.5, c: 0.15, h: 220 } }, // Invalid lightness
        neutral: validColorScale,
        success: validColorScale,
        warning: validColorScale,
        error: validColorScale,
      };
      expect(() => SemanticTokenSchema.parse(invalidScale)).toThrow();
    });
  });
});
