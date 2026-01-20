/**
 * Component Validator Tests
 * TASK-002: Implement component validation
 * RED Phase: Failing tests
 */

import { describe, it, expect } from 'vitest';
import { ComponentValidator } from '../src/validators/component-validator';
import type { ComponentBlueprint, KnowledgeSchema } from '../src/types/knowledge-types';

describe('ComponentValidator', () => {
  const sampleSchema: KnowledgeSchema = {
    version: '1.0.0',
    components: [
      {
        componentName: 'Button',
        importPath: '@/components/ui/button',
        category: 'action',
        description: 'A clickable button',
        slots: [
          {
            slotName: 'children',
            slotType: 'text',
            required: true,
          },
        ],
        props: [
          {
            propName: 'variant',
            propType: 'enum',
            possibleValues: ['primary', 'secondary', 'ghost'],
            defaultValue: 'primary',
            required: false,
          },
          {
            propName: 'disabled',
            propType: 'boolean',
            defaultValue: false,
            required: false,
          },
        ],
      },
      {
        componentName: 'Card',
        importPath: '@/components/ui/card',
        category: 'layout',
        description: 'A container card',
        slots: [
          {
            slotName: 'header',
            slotType: 'component',
            required: false,
          },
          {
            slotName: 'content',
            slotType: 'mixed',
            required: true,
          },
        ],
        props: [],
      },
    ],
  };

  describe('validateBlueprint', () => {
    it('should validate a correct blueprint successfully', () => {
      const validator = new ComponentValidator(sampleSchema);
      const blueprint: ComponentBlueprint = {
        componentName: 'Button',
        slotMappings: {
          children: { type: 'literal', value: 'Click me' },
        },
        propMappings: {
          variant: { type: 'literal', value: 'primary' },
        },
      };

      const result = validator.validateBlueprint(blueprint);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject blueprint for unknown component', () => {
      const validator = new ComponentValidator(sampleSchema);
      const blueprint: ComponentBlueprint = {
        componentName: 'UnknownComponent',
        slotMappings: {},
        propMappings: {},
      };

      const result = validator.validateBlueprint(blueprint);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          type: 'unknown_component',
          message: expect.stringContaining('UnknownComponent'),
        })
      );
    });

    it('should reject blueprint missing required slot', () => {
      const validator = new ComponentValidator(sampleSchema);
      const blueprint: ComponentBlueprint = {
        componentName: 'Button',
        slotMappings: {}, // Missing required 'children' slot
        propMappings: {},
      };

      const result = validator.validateBlueprint(blueprint);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          type: 'missing_required_slot',
          field: 'children',
        })
      );
    });

    it('should reject blueprint with invalid enum value', () => {
      const validator = new ComponentValidator(sampleSchema);
      const blueprint: ComponentBlueprint = {
        componentName: 'Button',
        slotMappings: {
          children: { type: 'literal', value: 'Click' },
        },
        propMappings: {
          variant: { type: 'literal', value: 'invalid' }, // Not in possibleValues
        },
      };

      const result = validator.validateBlueprint(blueprint);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          type: 'invalid_prop_value',
          field: 'variant',
        })
      );
    });

    it('should reject blueprint with type mismatch in prop', () => {
      const validator = new ComponentValidator(sampleSchema);
      const blueprint: ComponentBlueprint = {
        componentName: 'Button',
        slotMappings: {
          children: { type: 'literal', value: 'Click' },
        },
        propMappings: {
          disabled: { type: 'literal', value: 'true' }, // Should be boolean, not string
        },
      };

      const result = validator.validateBlueprint(blueprint);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          type: 'type_mismatch',
          field: 'disabled',
        })
      );
    });

    it('should validate nested component blueprints', () => {
      const validator = new ComponentValidator(sampleSchema);
      const blueprint: ComponentBlueprint = {
        componentName: 'Card',
        slotMappings: {
          header: {
            type: 'component',
            blueprint: {
              componentName: 'Button',
              slotMappings: {
                children: { type: 'literal', value: 'Header Button' },
              },
              propMappings: {},
            },
          },
          content: { type: 'literal', value: 'Card content' },
        },
        propMappings: {},
      };

      const result = validator.validateBlueprint(blueprint);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject nested blueprint with errors', () => {
      const validator = new ComponentValidator(sampleSchema);
      const blueprint: ComponentBlueprint = {
        componentName: 'Card',
        slotMappings: {
          header: {
            type: 'component',
            blueprint: {
              componentName: 'Button',
              slotMappings: {}, // Missing required 'children' slot
              propMappings: {},
            },
          },
          content: { type: 'literal', value: 'Card content' },
        },
        propMappings: {},
      };

      const result = validator.validateBlueprint(blueprint);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate array slot mappings', () => {
      const validator = new ComponentValidator(sampleSchema);
      const blueprint: ComponentBlueprint = {
        componentName: 'Card',
        slotMappings: {
          content: {
            type: 'array',
            items: [
              { type: 'literal', value: 'First item' },
              { type: 'literal', value: 'Second item' },
            ],
          },
        },
        propMappings: {},
      };

      const result = validator.validateBlueprint(blueprint);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('performance requirements', () => {
    it('should validate blueprint in under 20ms', () => {
      const validator = new ComponentValidator(sampleSchema);
      const blueprint: ComponentBlueprint = {
        componentName: 'Button',
        slotMappings: {
          children: { type: 'literal', value: 'Click' },
        },
        propMappings: {
          variant: { type: 'literal', value: 'primary' },
        },
      };

      const start = performance.now();
      validator.validateBlueprint(blueprint);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(20);
    });
  });
});
