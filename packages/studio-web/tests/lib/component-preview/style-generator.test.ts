import { describe, it, expect } from 'vitest';
import {
  generateStylesFromVariants,
  styleObjectToCSS,
  styleObjectToReactStyle,
  generateCSSClass,
  generateBaseStyles,
} from '@/lib/component-preview/style-generator';
import type { VariantConfigurationOption } from '@tekton/component-system';

describe('style-generator', () => {
  describe('generateStylesFromVariants', () => {
    const mockOptions: VariantConfigurationOption[] = [
      {
        optionName: 'variant',
        optionType: 'enum',
        possibleValues: ['primary', 'secondary'],
        styleRules: [
          {
            condition: "variant === 'primary'",
            cssProperties: { backgroundColor: 'var(--tekton-primary-500)' },
          },
          {
            condition: "variant === 'secondary'",
            cssProperties: { backgroundColor: 'var(--tekton-neutral-200)' },
          },
        ],
      },
      {
        optionName: 'disabled',
        optionType: 'boolean',
        possibleValues: [true, false],
        styleRules: [
          {
            condition: 'disabled === true',
            cssProperties: { opacity: '0.5' },
          },
        ],
      },
    ];

    it('applies styles for matching conditions', () => {
      const result = generateStylesFromVariants(mockOptions, {
        variant: 'primary',
        disabled: false,
      });

      expect(result.backgroundColor).toBe('var(--tekton-primary-500)');
      expect(result.opacity).toBeUndefined();
    });

    it('applies multiple matching conditions', () => {
      const result = generateStylesFromVariants(mockOptions, {
        variant: 'primary',
        disabled: true,
      });

      expect(result.backgroundColor).toBe('var(--tekton-primary-500)');
      expect(result.opacity).toBe('0.5');
    });

    it('applies secondary variant styles', () => {
      const result = generateStylesFromVariants(mockOptions, {
        variant: 'secondary',
        disabled: false,
      });

      expect(result.backgroundColor).toBe('var(--tekton-neutral-200)');
    });

    it('returns empty object when no conditions match', () => {
      const result = generateStylesFromVariants(mockOptions, {
        variant: 'unknown',
        disabled: false,
      });

      expect(Object.keys(result)).toHaveLength(0);
    });
  });

  describe('styleObjectToCSS', () => {
    it('converts style object to CSS string', () => {
      const styles = {
        backgroundColor: 'red',
        fontSize: '16px',
      };

      const result = styleObjectToCSS(styles);

      expect(result).toContain('background-color: red;');
      expect(result).toContain('font-size: 16px;');
    });

    it('converts camelCase to kebab-case', () => {
      const styles = { borderRadius: '4px' };
      const result = styleObjectToCSS(styles);

      expect(result).toBe('border-radius: 4px;');
    });
  });

  describe('styleObjectToReactStyle', () => {
    it('keeps keys in camelCase', () => {
      const styles = {
        backgroundColor: 'red',
        fontSize: '16px',
      };

      const result = styleObjectToReactStyle(styles);

      expect(result.backgroundColor).toBe('red');
      expect(result.fontSize).toBe('16px');
    });
  });

  describe('generateCSSClass', () => {
    it('generates valid CSS class rule', () => {
      const styles = {
        backgroundColor: 'red',
        padding: '1rem',
      };

      const result = generateCSSClass('button', styles);

      expect(result).toContain('.button {');
      expect(result).toContain('background-color: red;');
      expect(result).toContain('padding: 1rem;');
      expect(result).toContain('}');
    });
  });

  describe('generateBaseStyles', () => {
    it('generates button base styles', () => {
      const result = generateBaseStyles('button');

      expect(result.display).toBe('inline-flex');
      expect(result.cursor).toBe('pointer');
      expect(result.borderRadius).toContain('var(--tekton-border-radius');
    });

    it('generates input base styles', () => {
      const result = generateBaseStyles('input');

      expect(result.display).toBe('block');
      expect(result.width).toBe('100%');
      expect(result.border).toContain('solid');
    });

    it('generates generic styles for unknown element', () => {
      const result = generateBaseStyles('span');

      expect(result.fontFamily).toBe('inherit');
    });
  });
});
