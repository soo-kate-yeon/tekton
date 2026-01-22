/**
 * Knowledge Tools Tests
 * TASK-007, TASK-008, TASK-009: MCP knowledge tools
 * RED Phase: Failing tests
 */

import { describe, it, expect } from 'vitest';
import { KNOWLEDGE_TOOLS, getKnowledgeSchema, getComponentList, renderScreen } from '../src/knowledge/tools';

describe('Knowledge Tools', () => {
  describe('KNOWLEDGE_TOOLS', () => {
    it('should export get-knowledge-schema tool definition', () => {
      const tool = KNOWLEDGE_TOOLS.find(t => t.name === 'knowledge.get-schema');
      expect(tool).toBeDefined();
      expect(tool?.description).toContain('component knowledge schema');
    });

    it('should export get-component-list tool definition', () => {
      const tool = KNOWLEDGE_TOOLS.find(t => t.name === 'knowledge.get-component-list');
      expect(tool).toBeDefined();
      expect(tool?.description).toContain('available components');
    });

    it('should export render-screen tool definition', () => {
      const tool = KNOWLEDGE_TOOLS.find(t => t.name === 'knowledge.render-screen');
      expect(tool).toBeDefined();
      expect(tool?.description).toContain('blueprint');
    });
  });

  describe('getKnowledgeSchema', () => {
    it('should return complete knowledge schema', () => {
      const schema = getKnowledgeSchema();

      expect(schema).toBeDefined();
      expect(schema.version).toBe('1.0.0');
      expect(schema.components).toBeInstanceOf(Array);
      expect(schema.components.length).toBeGreaterThan(0);
    });

    it('should include Button component knowledge', () => {
      const schema = getKnowledgeSchema();
      const button = schema.components.find(c => c.componentName === 'Button');

      expect(button).toBeDefined();
      expect(button?.importPath).toContain('@/components/ui/button');
      expect(button?.category).toBe('action');
      expect(button?.slots).toBeDefined();
      expect(button?.props).toBeDefined();
    });

    it('should include Card component knowledge', () => {
      const schema = getKnowledgeSchema();
      const card = schema.components.find(c => c.componentName === 'Card');

      expect(card).toBeDefined();
      expect(card?.category).toBe('layout');
    });
  });

  describe('getComponentList', () => {
    it('should return list of all component names', () => {
      const list = getComponentList();

      expect(list).toBeInstanceOf(Array);
      expect(list.length).toBeGreaterThan(0);
      expect(list).toContain('Button');
      expect(list).toContain('Card');
      expect(list).toContain('Input');
    });

    it('should filter components by category', () => {
      const actionComponents = getComponentList({ category: 'action' });

      expect(actionComponents).toBeInstanceOf(Array);
      expect(actionComponents).toContain('Button');
    });

    it('should return all components when no filter provided', () => {
      const all = getComponentList();
      const filtered = getComponentList({});

      expect(all).toEqual(filtered);
    });
  });

  describe('renderScreen', () => {
    it('should generate JSX code from blueprint', async () => {
      const blueprint = {
        componentName: 'Button',
        slotMappings: {
          children: { type: 'literal' as const, value: 'Click me' },
        },
        propMappings: {
          variant: { type: 'literal' as const, value: 'primary' },
        },
      };

      const result = await renderScreen({ blueprint });

      expect(result.code).toContain('import Button');
      expect(result.code).toContain('<Button');
      expect(result.code).toContain('variant="primary"');
      expect(result.code).toContain('Click me');
    });

    it('should validate blueprint before rendering', async () => {
      const invalidBlueprint = {
        componentName: 'UnknownComponent',
        slotMappings: {},
        propMappings: {},
      };

      const result = await renderScreen({ blueprint: invalidBlueprint });

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.length).toBeGreaterThan(0);
    });

    it('should return validation errors for invalid prop values', async () => {
      const blueprint = {
        componentName: 'Button',
        slotMappings: {
          children: { type: 'literal' as const, value: 'Click' },
        },
        propMappings: {
          variant: { type: 'literal' as const, value: 'invalid-variant' },
        },
      };

      const result = await renderScreen({ blueprint });

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should generate code for nested components', async () => {
      const blueprint = {
        componentName: 'Card',
        slotMappings: {
          header: {
            type: 'component' as const,
            blueprint: {
              componentName: 'CardHeader',
              slotMappings: {
                children: { type: 'literal' as const, value: 'Title' },
              },
              propMappings: {},
            },
          },
        },
        propMappings: {},
      };

      const result = await renderScreen({ blueprint });

      expect(result.success).toBe(true);
      expect(result.code).toContain('CardHeader');
    });
  });

  describe('performance requirements', () => {
    it('should execute get-knowledge-schema in under 10ms', () => {
      const start = performance.now();
      getKnowledgeSchema();
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(10);
    });

    it('should execute get-component-list in under 5ms', () => {
      const start = performance.now();
      getComponentList();
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(5);
    });

    it('should execute render-screen in under 250ms', async () => {
      const blueprint = {
        componentName: 'Button',
        slotMappings: {
          children: { type: 'literal' as const, value: 'Click' },
        },
        propMappings: {},
      };

      const start = performance.now();
      await renderScreen({ blueprint });
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(250);
    });
  });
});
