import { describe, it, expect } from 'vitest';
import { CompositionTokenSchema } from '../../src/schemas/composition-token.js';

describe('CompositionTokenSchema', () => {
  const validColor = { l: 0.5, c: 0.15, h: 220 };

  describe('valid composition tokens', () => {
    it('should accept complete composition token set', () => {
      const validComposition = {
        border: {
          width: '1px',
          style: 'solid' as const,
          color: validColor,
          radius: '4px',
        },
        shadow: {
          x: '0px',
          y: '1px',
          blur: '2px',
          spread: '0px',
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
      };
      expect(() => CompositionTokenSchema.parse(validComposition)).not.toThrow();
    });

    it('should accept border with different units', () => {
      const borderVariants = {
        border: {
          width: '0.125rem',
          style: 'dashed' as const,
          color: validColor,
          radius: '50%',
        },
        shadow: {
          x: '0px',
          y: '1px',
          blur: '2px',
          color: validColor,
        },
        spacing: {
          padding: '1em',
          margin: '2em',
          gap: '1em',
        },
        typography: {
          fontSize: '16px',
          fontWeight: 700,
          lineHeight: '24px',
          letterSpacing: '0.5px',
        },
      };
      expect(() => CompositionTokenSchema.parse(borderVariants)).not.toThrow();
    });

    it('should accept shadow without spread (optional)', () => {
      const shadowWithoutSpread = {
        border: {
          width: '1px',
          style: 'solid' as const,
          color: validColor,
          radius: '4px',
        },
        shadow: {
          x: '0px',
          y: '2px',
          blur: '4px',
          color: validColor,
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
      };
      expect(() => CompositionTokenSchema.parse(shadowWithoutSpread)).not.toThrow();
    });

    it('should accept all border styles', () => {
      const borderStyles = ['solid', 'dashed', 'dotted', 'none'] as const;

      borderStyles.forEach(style => {
        const composition = {
          border: {
            width: '1px',
            style,
            color: validColor,
            radius: '4px',
          },
          shadow: {
            x: '0px',
            y: '1px',
            blur: '2px',
            color: validColor,
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
        };
        expect(() => CompositionTokenSchema.parse(composition)).not.toThrow();
      });
    });

    it('should accept all valid font weights', () => {
      const fontWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];

      fontWeights.forEach(fontWeight => {
        const composition = {
          border: {
            width: '1px',
            style: 'solid' as const,
            color: validColor,
            radius: '4px',
          },
          shadow: {
            x: '0px',
            y: '1px',
            blur: '2px',
            color: validColor,
          },
          spacing: {
            padding: '1rem',
            margin: '1rem',
            gap: '0.5rem',
          },
          typography: {
            fontSize: '1rem',
            fontWeight,
            lineHeight: '1.5',
            letterSpacing: '0em',
          },
        };
        expect(() => CompositionTokenSchema.parse(composition)).not.toThrow();
      });
    });

    it('should accept unitless line height', () => {
      const unitlessLineHeight = {
        border: {
          width: '1px',
          style: 'solid' as const,
          color: validColor,
          radius: '4px',
        },
        shadow: {
          x: '0px',
          y: '1px',
          blur: '2px',
          color: validColor,
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
      };
      expect(() => CompositionTokenSchema.parse(unitlessLineHeight)).not.toThrow();
    });

    it('should accept negative letter spacing', () => {
      const negativeLetterSpacing = {
        border: {
          width: '1px',
          style: 'solid' as const,
          color: validColor,
          radius: '4px',
        },
        shadow: {
          x: '0px',
          y: '1px',
          blur: '2px',
          color: validColor,
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
          letterSpacing: '-0.05em',
        },
      };
      expect(() => CompositionTokenSchema.parse(negativeLetterSpacing)).not.toThrow();
    });
  });

  describe('invalid composition tokens', () => {
    it('should reject invalid border width format', () => {
      const invalidBorderWidth = {
        border: {
          width: '1',
          style: 'solid' as const,
          color: validColor,
          radius: '4px',
        },
        shadow: {
          x: '0px',
          y: '1px',
          blur: '2px',
          color: validColor,
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
      };
      expect(() => CompositionTokenSchema.parse(invalidBorderWidth)).toThrow();
    });

    it('should reject invalid border style', () => {
      const invalidBorderStyle = {
        border: {
          width: '1px',
          style: 'wavy', // Invalid style
          color: validColor,
          radius: '4px',
        },
        shadow: {
          x: '0px',
          y: '1px',
          blur: '2px',
          color: validColor,
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
      };
      expect(() => CompositionTokenSchema.parse(invalidBorderStyle)).toThrow();
    });

    it('should reject invalid border radius format', () => {
      const invalidBorderRadius = {
        border: {
          width: '1px',
          style: 'solid' as const,
          color: validColor,
          radius: '4',
        },
        shadow: {
          x: '0px',
          y: '1px',
          blur: '2px',
          color: validColor,
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
      };
      expect(() => CompositionTokenSchema.parse(invalidBorderRadius)).toThrow();
    });

    it('should reject invalid font weight', () => {
      const invalidFontWeight = {
        border: {
          width: '1px',
          style: 'solid' as const,
          color: validColor,
          radius: '4px',
        },
        shadow: {
          x: '0px',
          y: '1px',
          blur: '2px',
          color: validColor,
        },
        spacing: {
          padding: '1rem',
          margin: '1rem',
          gap: '0.5rem',
        },
        typography: {
          fontSize: '1rem',
          fontWeight: 450, // Not a multiple of 100
          lineHeight: '1.5',
          letterSpacing: '0em',
        },
      };
      expect(() => CompositionTokenSchema.parse(invalidFontWeight)).toThrow();
    });

    it('should reject font weight outside 100-900 range', () => {
      const outOfRangeFontWeight = {
        border: {
          width: '1px',
          style: 'solid' as const,
          color: validColor,
          radius: '4px',
        },
        shadow: {
          x: '0px',
          y: '1px',
          blur: '2px',
          color: validColor,
        },
        spacing: {
          padding: '1rem',
          margin: '1rem',
          gap: '0.5rem',
        },
        typography: {
          fontSize: '1rem',
          fontWeight: 1000,
          lineHeight: '1.5',
          letterSpacing: '0em',
        },
      };
      expect(() => CompositionTokenSchema.parse(outOfRangeFontWeight)).toThrow();
    });

    it('should reject missing required composition properties', () => {
      const missingBorder = {
        shadow: {
          x: '0px',
          y: '1px',
          blur: '2px',
          color: validColor,
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
      };
      expect(() => CompositionTokenSchema.parse(missingBorder)).toThrow();
    });

    it('should reject invalid spacing format', () => {
      const invalidSpacing = {
        border: {
          width: '1px',
          style: 'solid' as const,
          color: validColor,
          radius: '4px',
        },
        shadow: {
          x: '0px',
          y: '1px',
          blur: '2px',
          color: validColor,
        },
        spacing: {
          padding: '1',
          margin: '1rem',
          gap: '0.5rem',
        },
        typography: {
          fontSize: '1rem',
          fontWeight: 400,
          lineHeight: '1.5',
          letterSpacing: '0em',
        },
      };
      expect(() => CompositionTokenSchema.parse(invalidSpacing)).toThrow();
    });
  });
});
