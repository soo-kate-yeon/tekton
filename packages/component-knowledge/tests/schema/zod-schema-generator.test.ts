import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { ZodSchemaGenerator } from '../../src/schema/zod-schema-generator';
import { getComponentByName } from '../../src/catalog/component-catalog';

describe('ZodSchemaGenerator', () => {
  const generator = new ZodSchemaGenerator();

  describe('Basic Schema Generation', () => {
    it('should generate Zod schema for Button component', () => {
      const button = getComponentByName('Button');
      expect(button).toBeDefined();

      const schema = generator.generateSchema(button!);
      expect(schema).toBeDefined();

      // Schema should be a valid Zod schema
      expect(schema._def).toBeDefined();
    });

    it('should generate schema with variant enum if variants exist', () => {
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

      const schema = generator.generateSchema(buttonWithVariants);
      const schemaShape = schema._def.shape();

      expect(schemaShape.variant).toBeDefined();
    });

    it('should generate TypeScript type definition', () => {
      const button = getComponentByName('Button');
      const typeString = generator.generateTypeDefinition(button!);

      expect(typeString).toContain('export interface ButtonProps');
      expect(typeString).toContain('disabled?:');
      expect(typeString).toContain('className?:');
    });
  });

  describe('Schema Validation', () => {
    it('should validate valid component props', () => {
      const button = getComponentByName('Button');
      const schema = generator.generateSchema(button!);

      const validProps = {
        variant: 'primary',
        disabled: false,
      };

      const result = schema.safeParse(validProps);
      expect(result.success).toBe(true);
    });

    it('should reject invalid variant values', () => {
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

      const schema = generator.generateSchema(buttonWithVariants);

      const invalidProps = {
        variant: 'invalid',
      };

      const result = schema.safeParse(invalidProps);
      expect(result.success).toBe(false);
    });
  });

  describe('All Components Schema Generation', () => {
    it('should generate schemas for all 20 components without errors', async () => {
      const { getAllComponents } = await import('../../src/catalog/component-catalog');
      const allComponents = getAllComponents();

      for (const component of allComponents) {
        expect(() => {
          const schema = generator.generateSchema(component);
          expect(schema).toBeDefined();
        }).not.toThrow();
      }
    });
  });

  describe('TypeScript Type Generation', () => {
    it('should generate valid TypeScript interface', () => {
      const input = getComponentByName('Input');
      const typeString = generator.generateTypeDefinition(input!);

      expect(typeString).toContain('export interface InputProps');
      expect(typeString).toContain('disabled?: boolean');
    });

    it('should include variant types when variants exist', () => {
      const buttonWithVariants = {
        ...getComponentByName('Button')!,
        tokenBindings: {
          ...getComponentByName('Button')!.tokenBindings,
          variants: {
            primary: { default: {} },
            secondary: { default: {} },
            ghost: { default: {} },
          },
        },
      };

      const typeString = generator.generateTypeDefinition(buttonWithVariants);
      expect(typeString).toContain("variant?: 'primary' | 'secondary' | 'ghost'");
    });
  });
});
