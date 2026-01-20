/**
 * Knowledge Schema Types Tests
 * TASK-001: Define Knowledge Schema types
 * RED Phase: Failing tests
 */

import { describe, it, expect } from 'vitest';
import type {
  ComponentKnowledge,
  ComponentBlueprint,
  SlotMapping,
  PropMapping,
  KnowledgeSchema,
} from '../src/types/knowledge-types';

describe('Knowledge Schema Types', () => {
  describe('ComponentKnowledge Type', () => {
    it('should allow valid ComponentKnowledge with all required fields', () => {
      const knowledge: ComponentKnowledge = {
        componentName: 'Button',
        importPath: '@/components/ui/button',
        category: 'action',
        description: 'A clickable button component',
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
          },
        ],
      };

      expect(knowledge.componentName).toBe('Button');
      expect(knowledge.importPath).toBe('@/components/ui/button');
      expect(knowledge.category).toBe('action');
      expect(knowledge.slots).toHaveLength(1);
      expect(knowledge.props).toHaveLength(1);
    });

    it('should allow ComponentKnowledge with optional fields omitted', () => {
      const knowledge: ComponentKnowledge = {
        componentName: 'Card',
        importPath: '@/components/ui/card',
        category: 'layout',
        description: 'A container card component',
        slots: [],
        props: [],
      };

      expect(knowledge.slots).toHaveLength(0);
      expect(knowledge.props).toHaveLength(0);
    });
  });

  describe('ComponentBlueprint Type', () => {
    it('should allow valid ComponentBlueprint for rendering', () => {
      const blueprint: ComponentBlueprint = {
        componentName: 'Button',
        slotMappings: {
          children: { type: 'literal', value: 'Click me' },
        },
        propMappings: {
          variant: { type: 'literal', value: 'primary' },
          disabled: { type: 'literal', value: false },
        },
      };

      expect(blueprint.componentName).toBe('Button');
      expect(blueprint.slotMappings.children.type).toBe('literal');
      expect(blueprint.propMappings.variant.value).toBe('primary');
    });

    it('should allow ComponentBlueprint with nested components in slots', () => {
      const blueprint: ComponentBlueprint = {
        componentName: 'Dialog',
        slotMappings: {
          trigger: {
            type: 'component',
            blueprint: {
              componentName: 'Button',
              slotMappings: {
                children: { type: 'literal', value: 'Open' },
              },
              propMappings: {},
            },
          },
          content: { type: 'literal', value: 'Dialog content' },
        },
        propMappings: {},
      };

      expect(blueprint.slotMappings.trigger.type).toBe('component');
      expect(blueprint.slotMappings.trigger.blueprint?.componentName).toBe('Button');
    });
  });

  describe('SlotMapping Type', () => {
    it('should allow literal string slot mapping', () => {
      const mapping: SlotMapping = {
        type: 'literal',
        value: 'Hello World',
      };

      expect(mapping.type).toBe('literal');
      expect(typeof mapping.value).toBe('string');
    });

    it('should allow literal boolean slot mapping', () => {
      const mapping: SlotMapping = {
        type: 'literal',
        value: true,
      };

      expect(mapping.type).toBe('literal');
      expect(typeof mapping.value).toBe('boolean');
    });

    it('should allow component slot mapping with nested blueprint', () => {
      const mapping: SlotMapping = {
        type: 'component',
        blueprint: {
          componentName: 'Icon',
          slotMappings: {},
          propMappings: {
            name: { type: 'literal', value: 'check' },
          },
        },
      };

      expect(mapping.type).toBe('component');
      expect(mapping.blueprint).toBeDefined();
      expect(mapping.blueprint?.componentName).toBe('Icon');
    });

    it('should allow array slot mapping with multiple children', () => {
      const mapping: SlotMapping = {
        type: 'array',
        items: [
          { type: 'literal', value: 'First' },
          { type: 'literal', value: 'Second' },
        ],
      };

      expect(mapping.type).toBe('array');
      expect(mapping.items).toHaveLength(2);
    });
  });

  describe('PropMapping Type', () => {
    it('should allow literal string prop mapping', () => {
      const mapping: PropMapping = {
        type: 'literal',
        value: 'primary',
      };

      expect(mapping.type).toBe('literal');
      expect(mapping.value).toBe('primary');
    });

    it('should allow literal number prop mapping', () => {
      const mapping: PropMapping = {
        type: 'literal',
        value: 42,
      };

      expect(mapping.type).toBe('literal');
      expect(typeof mapping.value).toBe('number');
    });
  });

  describe('KnowledgeSchema Type', () => {
    it('should allow complete knowledge schema with multiple components', () => {
      const schema: KnowledgeSchema = {
        version: '1.0.0',
        components: [
          {
            componentName: 'Button',
            importPath: '@/components/ui/button',
            category: 'action',
            description: 'Button component',
            slots: [],
            props: [],
          },
          {
            componentName: 'Card',
            importPath: '@/components/ui/card',
            category: 'layout',
            description: 'Card component',
            slots: [],
            props: [],
          },
        ],
      };

      expect(schema.version).toBe('1.0.0');
      expect(schema.components).toHaveLength(2);
    });

    it('should allow empty components array in schema', () => {
      const schema: KnowledgeSchema = {
        version: '1.0.0',
        components: [],
      };

      expect(schema.components).toHaveLength(0);
    });
  });
});
