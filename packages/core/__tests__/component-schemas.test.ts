/**
 * Component Schema Tests
 * [SPEC-COMPONENT-001-B] [TAG-005]
 *
 * Tests for 20 component schemas with token bindings and a11y requirements
 */

import { describe, it, expect } from 'vitest';
import {
  PropDefinition,
  ComponentSchema,
  A11yRequirements,
  PRIMITIVE_COMPONENTS,
  COMPOSED_COMPONENTS,
  ALL_COMPONENTS,
} from '../src/component-schemas.js';
import {
  validateComponentSchema,
  validateAllSchemas,
  validateProp,
  validateA11y,
  validateTokenBindings,
  getValidationSummary,
  assertValidSchema,
  assertAllSchemasValid,
} from '../src/schema-validation.js';

describe('Component Schema Type Definitions', () => {
  describe('PropDefinition structure', () => {
    it('should define required properties', () => {
      const prop: PropDefinition = {
        name: 'variant',
        type: 'string',
        required: false,
        description: 'Visual style variant',
      };

      expect(prop.name).toBe('variant');
      expect(prop.type).toBe('string');
      expect(prop.required).toBe(false);
      expect(prop.description).toBe('Visual style variant');
    });

    it('should support optional fields', () => {
      const prop: PropDefinition = {
        name: 'size',
        type: 'string',
        required: false,
        description: 'Component size',
        defaultValue: 'medium',
        options: ['small', 'medium', 'large'],
      };

      expect(prop.defaultValue).toBe('medium');
      expect(prop.options).toEqual(['small', 'medium', 'large']);
    });
  });

  describe('ComponentSchema structure', () => {
    it('should define Button schema with all required fields', () => {
      const buttonSchema = ALL_COMPONENTS.find(c => c.type === 'Button');

      expect(buttonSchema).toBeDefined();
      expect(buttonSchema?.type).toBe('Button');
      expect(buttonSchema?.category).toBe('primitive');
      expect(buttonSchema?.props).toBeInstanceOf(Array);
      expect(buttonSchema?.tokenBindings).toBeDefined();
      expect(buttonSchema?.a11y).toBeDefined();
    });
  });
});

describe('Primitive Components (10)', () => {
  const primitiveTypes = [
    'Button',
    'Input',
    'Text',
    'Heading',
    'Checkbox',
    'Radio',
    'Switch',
    'Slider',
    'Badge',
    'Avatar',
  ];

  it('should have exactly 10 primitive components', () => {
    expect(PRIMITIVE_COMPONENTS).toHaveLength(10);
  });

  primitiveTypes.forEach(type => {
    describe(type, () => {
      let schema: ComponentSchema;

      beforeEach(() => {
        const found = PRIMITIVE_COMPONENTS.find(c => c.type === type);
        if (!found) throw new Error(`${type} schema not found`);
        schema = found;
      });

      it('should be categorized as primitive', () => {
        expect(schema.category).toBe('primitive');
      });

      it('should have props array', () => {
        expect(schema.props).toBeInstanceOf(Array);
        expect(schema.props.length).toBeGreaterThan(0);
      });

      it('should have tokenBindings with template variables', () => {
        expect(schema.tokenBindings).toBeDefined();
        expect(Object.keys(schema.tokenBindings).length).toBeGreaterThan(0);
      });

      it('should have a11y requirements', () => {
        expect(schema.a11y).toBeDefined();
        expect(schema.a11y.role).toBeDefined();
        expect(schema.a11y.wcag).toContain('2.1');
      });
    });
  });
});

describe('Composed Components (10)', () => {
  const composedTypes = [
    'Card',
    'Modal',
    'Dropdown',
    'Tabs',
    'Link',
    'Table',
    'List',
    'Image',
    'Form',
    'Progress',
  ];

  it('should have exactly 10 composed components', () => {
    expect(COMPOSED_COMPONENTS).toHaveLength(10);
  });

  composedTypes.forEach(type => {
    describe(type, () => {
      let schema: ComponentSchema;

      beforeEach(() => {
        const found = COMPOSED_COMPONENTS.find(c => c.type === type);
        if (!found) throw new Error(`${type} schema not found`);
        schema = found;
      });

      it('should be categorized as composed', () => {
        expect(schema.category).toBe('composed');
      });

      it('should have props array', () => {
        expect(schema.props).toBeInstanceOf(Array);
        expect(schema.props.length).toBeGreaterThan(0);
      });

      it('should have tokenBindings', () => {
        expect(schema.tokenBindings).toBeDefined();
      });

      it('should have a11y requirements', () => {
        expect(schema.a11y).toBeDefined();
        expect(schema.a11y.wcag).toContain('2.1');
      });
    });
  });
});

describe('All Components Registry', () => {
  it('should have exactly 20 components total', () => {
    expect(ALL_COMPONENTS).toHaveLength(20);
  });

  it('should have unique component types', () => {
    const types = ALL_COMPONENTS.map(c => c.type);
    const uniqueTypes = new Set(types);
    expect(uniqueTypes.size).toBe(20);
  });

  it('should correctly split primitive and composed', () => {
    const primitiveCount = ALL_COMPONENTS.filter(c => c.category === 'primitive').length;
    const composedCount = ALL_COMPONENTS.filter(c => c.category === 'composed').length;

    expect(primitiveCount).toBe(10);
    expect(composedCount).toBe(10);
  });
});

describe('Component Schema Validation', () => {
  it('should validate all schemas have required fields', () => {
    ALL_COMPONENTS.forEach(schema => {
      expect(schema.type).toBeTruthy();
      expect(schema.category).toMatch(/^(primitive|composed)$/);
      expect(schema.props).toBeInstanceOf(Array);
      expect(schema.tokenBindings).toBeDefined();
      expect(schema.a11y).toBeDefined();
      expect(schema.a11y.role).toBeTruthy();
      expect(schema.a11y.wcag).toBeTruthy();
    });
  });

  it('should validate prop definitions', () => {
    ALL_COMPONENTS.forEach(schema => {
      schema.props.forEach(prop => {
        expect(prop.name).toBeTruthy();
        expect(prop.type).toBeTruthy();
        expect(typeof prop.required).toBe('boolean');
        expect(prop.description).toBeTruthy();
      });
    });
  });
});

describe('Schema Validation Utilities', () => {
  describe('validateComponentSchema', () => {
    it('should validate a valid schema', () => {
      const buttonSchema = ALL_COMPONENTS.find(c => c.type === 'Button');
      const result = validateComponentSchema(buttonSchema!);

      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('should reject invalid schema', () => {
      const invalidSchema = {
        type: '',
        category: 'invalid',
        props: [],
        tokenBindings: {},
        a11y: { role: '', wcag: '' },
      } as any;

      const result = validateComponentSchema(invalidSchema);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });
  });

  describe('validateAllSchemas', () => {
    it('should validate all component schemas', () => {
      const result = validateAllSchemas();

      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
    });
  });

  describe('validateProp', () => {
    it('should validate a valid prop', () => {
      const prop: PropDefinition = {
        name: 'variant',
        type: 'string',
        required: false,
        description: 'Visual variant',
      };

      const result = validateProp(prop);

      expect(result.valid).toBe(true);
    });

    it('should reject invalid prop', () => {
      const invalidProp = {
        name: '',
        type: '',
        required: 'not a boolean',
        description: '',
      } as any;

      const result = validateProp(invalidProp);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('validateA11y', () => {
    it('should validate valid a11y requirements', () => {
      const a11y: A11yRequirements = {
        role: 'button',
        wcag: 'WCAG 2.1 AA',
        ariaAttributes: ['aria-label'],
      };

      const result = validateA11y(a11y);

      expect(result.valid).toBe(true);
    });

    it('should reject a11y without WCAG 2.1', () => {
      const invalidA11y = {
        role: 'button',
        wcag: 'WCAG 1.0',
      } as any;

      const result = validateA11y(invalidA11y);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('validateTokenBindings', () => {
    it('should validate token bindings with references', () => {
      const bindings = {
        background: 'semantic.surface.primary',
        foreground: 'semantic.foreground.primary',
      };

      const result = validateTokenBindings(bindings);

      expect(result.valid).toBe(true);
    });

    it('should warn about missing template variables', () => {
      const bindings = {
        background: 'semantic.surface.primary',
        foreground: 'semantic.foreground.primary',
      };

      const result = validateTokenBindings(bindings);

      expect(result.valid).toBe(true);
      expect(result.warnings).toBeDefined();
    });

    it('should reject bindings with too few entries', () => {
      const bindings = {
        background: 'semantic.surface.primary',
      };

      const result = validateTokenBindings(bindings);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('getValidationSummary', () => {
    it('should return validation summary', () => {
      const summary = getValidationSummary();

      expect(summary.totalComponents).toBe(20);
      expect(summary.primitiveComponents).toBe(10);
      expect(summary.composedComponents).toBe(10);
      expect(summary.validSchemas).toBe(20);
      expect(summary.invalidSchemas).toBe(0);
      expect(summary.validationResults).toHaveLength(20);
    });
  });

  describe('assertValidSchema', () => {
    it('should not throw for valid schema', () => {
      const buttonSchema = ALL_COMPONENTS.find(c => c.type === 'Button');

      expect(() => assertValidSchema(buttonSchema!)).not.toThrow();
    });

    it('should throw for invalid schema', () => {
      const invalidSchema = {
        type: '',
        category: 'invalid',
        props: [],
        tokenBindings: {},
        a11y: { role: '', wcag: '' },
      } as any;

      expect(() => assertValidSchema(invalidSchema)).toThrow();
    });
  });

  describe('assertAllSchemasValid', () => {
    it('should not throw when all schemas are valid', () => {
      expect(() => assertAllSchemasValid()).not.toThrow();
    });
  });
});
