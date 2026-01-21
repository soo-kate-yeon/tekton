import { describe, it, expect } from 'vitest';
import {
  SlotRole,
  ComponentNode,
  BlueprintResult,
  BlueprintResultSchema,
} from '../src/types/knowledge-schema';

describe('Knowledge Schema Types', () => {
  describe('SlotRole', () => {
    it('should accept valid slot roles', () => {
      const roles: SlotRole[] = ['layout', 'navigation', 'content', 'action', 'meta'];

      roles.forEach(role => {
        const testRole: SlotRole = role;
        expect(testRole).toBe(role);
      });
    });
  });

  describe('ComponentNode', () => {
    it('should create a simple component node without slots', () => {
      const node: ComponentNode = {
        componentName: 'Button',
        props: { variant: 'primary', label: 'Click me' },
      };

      expect(node.componentName).toBe('Button');
      expect(node.props).toEqual({ variant: 'primary', label: 'Click me' });
      expect(node.slots).toBeUndefined();
    });

    it('should create a component node with single slot', () => {
      const node: ComponentNode = {
        componentName: 'Card',
        props: { title: 'Card Title' },
        slots: {
          content: {
            componentName: 'Text',
            props: { text: 'Card content' },
          },
        },
      };

      expect(node.slots?.content).toBeDefined();
      expect((node.slots?.content as ComponentNode).componentName).toBe('Text');
    });

    it('should create a component node with array slots', () => {
      const node: ComponentNode = {
        componentName: 'List',
        props: {},
        slots: {
          items: [
            { componentName: 'ListItem', props: { text: 'Item 1' } },
            { componentName: 'ListItem', props: { text: 'Item 2' } },
          ],
        },
      };

      expect(Array.isArray(node.slots?.items)).toBe(true);
      expect((node.slots?.items as ComponentNode[]).length).toBe(2);
    });

    it('should support nested component structure', () => {
      const node: ComponentNode = {
        componentName: 'Page',
        props: {},
        slots: {
          header: {
            componentName: 'Header',
            props: {},
            slots: {
              navigation: {
                componentName: 'Navigation',
                props: {},
              },
            },
          },
          main: {
            componentName: 'Main',
            props: {},
          },
        },
      };

      expect(node.slots?.header).toBeDefined();
      const header = node.slots?.header as ComponentNode;
      expect(header.slots?.navigation).toBeDefined();
    });
  });

  describe('BlueprintResult', () => {
    it('should create a valid blueprint result', () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-001',
        recipeName: 'user-profile-card',
        analysis: {
          intent: 'Display user profile information',
          tone: 'professional',
        },
        structure: {
          componentName: 'Card',
          props: {},
          slots: {
            content: {
              componentName: 'Text',
              props: { text: 'User profile' },
            },
          },
        },
      };

      expect(blueprint.blueprintId).toBe('bp-001');
      expect(blueprint.recipeName).toBe('user-profile-card');
      expect(blueprint.analysis.intent).toBe('Display user profile information');
      expect(blueprint.structure.componentName).toBe('Card');
    });

    it('should support complex blueprint with nested structure', () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-002',
        recipeName: 'dashboard-layout',
        analysis: {
          intent: 'Create dashboard layout with widgets',
          tone: 'informative',
        },
        structure: {
          componentName: 'Container',
          props: { layout: 'grid' },
          slots: {
            widgets: [
              {
                componentName: 'Widget',
                props: { type: 'chart' },
                slots: {
                  content: {
                    componentName: 'Chart',
                    props: { data: [] },
                  },
                },
              },
              {
                componentName: 'Widget',
                props: { type: 'stats' },
              },
            ],
          },
        },
      };

      expect(blueprint.structure.slots?.widgets).toBeDefined();
      expect(Array.isArray(blueprint.structure.slots?.widgets)).toBe(true);
    });
  });

  describe('BlueprintResultSchema', () => {
    it('should have correct schema structure', () => {
      expect(BlueprintResultSchema.type).toBe('object');
      expect(BlueprintResultSchema.required).toContain('blueprintId');
      expect(BlueprintResultSchema.required).toContain('recipeName');
      expect(BlueprintResultSchema.required).toContain('analysis');
      expect(BlueprintResultSchema.required).toContain('structure');
    });

    it('should define properties object', () => {
      expect(BlueprintResultSchema.properties).toBeDefined();
      expect(typeof BlueprintResultSchema.properties).toBe('object');
    });

    it('should have blueprintId property with string type', () => {
      expect(BlueprintResultSchema.properties.blueprintId).toBeDefined();
      expect(BlueprintResultSchema.properties.blueprintId.type).toBe('string');
    });

    it('should have recipeName property with string type', () => {
      expect(BlueprintResultSchema.properties.recipeName).toBeDefined();
      expect(BlueprintResultSchema.properties.recipeName.type).toBe('string');
    });

    it('should have analysis property with object type', () => {
      expect(BlueprintResultSchema.properties.analysis).toBeDefined();
      expect(BlueprintResultSchema.properties.analysis.type).toBe('object');
      expect(BlueprintResultSchema.properties.analysis.required).toContain('intent');
      expect(BlueprintResultSchema.properties.analysis.required).toContain('tone');
    });

    it('should have structure property with object type', () => {
      expect(BlueprintResultSchema.properties.structure).toBeDefined();
      expect(BlueprintResultSchema.properties.structure.type).toBe('object');
    });
  });
});
