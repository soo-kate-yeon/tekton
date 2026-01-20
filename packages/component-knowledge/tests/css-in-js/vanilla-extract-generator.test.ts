import { describe, it, expect } from 'vitest';
import { VanillaExtractGenerator } from '../../src/css-in-js/vanilla-extract-generator';
import { getComponentByName } from '../../src/catalog/component-catalog';

describe('VanillaExtractGenerator', () => {
  const generator = new VanillaExtractGenerator();

  describe('Basic Style Generation', () => {
    it('should generate Vanilla Extract style recipe for Button', () => {
      const button = getComponentByName('Button');
      const styles = generator.generateStyles(button!);

      expect(styles).toContain('import { recipe }');
      expect(styles).toContain('@vanilla-extract/recipes');
      expect(styles).toContain('export const buttonStyles');
    });

    it('should use CSS variable references not hardcoded values', () => {
      const button = getComponentByName('Button');
      const styles = generator.generateStyles(button!);

      // Should contain var(--token-name) references
      expect(styles).toContain('var(--');
      // Should NOT contain hardcoded color values
      expect(styles).not.toContain('#');
      expect(styles).not.toContain('rgb(');
    });

    it('should generate base styles from default state', () => {
      const button = getComponentByName('Button');
      const styles = generator.generateStyles(button!);

      expect(styles).toContain('base:');
      expect(styles).toContain('background-color:'); // kebab-case in CSS
      expect(styles).toContain('var(--color-primary)');
    });

    it('should generate variants from tokenBindings.variants', () => {
      const buttonWithVariants = {
        ...getComponentByName('Button')!,
        tokenBindings: {
          ...getComponentByName('Button')!.tokenBindings,
          variants: {
            primary: { default: { backgroundColor: 'color-primary' } },
            secondary: { default: { backgroundColor: 'color-secondary' } },
          },
        },
      };

      const styles = generator.generateStyles(buttonWithVariants);

      expect(styles).toContain('variants:');
      expect(styles).toContain('primary:');
      expect(styles).toContain('secondary:');
    });
  });

  describe('State Selectors Generation', () => {
    it('should generate hover state with :hover selector', () => {
      const button = getComponentByName('Button');
      const styles = generator.generateStyles(button!);

      expect(styles).toContain(':hover');
      expect(styles).toContain('var(--color-primary-hover)');
    });

    it('should generate focus state with :focus selector', () => {
      const button = getComponentByName('Button');
      const styles = generator.generateStyles(button!);

      expect(styles).toContain(':focus');
    });

    it('should generate disabled state with :disabled selector', () => {
      const button = getComponentByName('Button');
      const styles = generator.generateStyles(button!);

      expect(styles).toContain(':disabled');
      expect(styles).toContain('var(--opacity-disabled)');
    });
  });

  describe('CSS Variable Reference Validation', () => {
    it('should reject hardcoded color values', () => {
      const invalidComponent = {
        ...getComponentByName('Button')!,
        tokenBindings: {
          states: {
            default: { backgroundColor: '#FF0000' }, // hardcoded!
            hover: {},
            focus: {},
            active: {},
            disabled: {},
          },
        },
      };

      expect(() => {
        generator.generateStyles(invalidComponent);
      }).toThrow(/[Hh]ardcoded/);
    });

    it('should accept valid token references', () => {
      const button = getComponentByName('Button');
      expect(() => {
        generator.generateStyles(button!);
      }).not.toThrow();
    });
  });

  describe('All Components Generation', () => {
    it('should generate styles for all 20 components without errors', async () => {
      const { getAllComponents } = await import('../../src/catalog/component-catalog');
      const allComponents = getAllComponents();

      for (const component of allComponents) {
        expect(() => {
          const styles = generator.generateStyles(component);
          expect(styles).toBeDefined();
          expect(styles.length).toBeGreaterThan(0);
        }).not.toThrow();
      }
    });
  });

  describe('TypeScript Module Generation', () => {
    it('should generate valid TypeScript module', () => {
      const button = getComponentByName('Button');
      const styles = generator.generateStyles(button!);

      // Should be valid TypeScript
      expect(styles).toContain('import');
      expect(styles).toContain('export');
      // Should not have syntax errors
      expect(styles).not.toContain('undefined');
      expect(styles).not.toContain('null');
    });
  });
});
