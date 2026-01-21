import { describe, it, expect } from 'vitest';
import { JSXGenerator, type GenerationResult } from '../src/generator/jsx-generator';
import type { BlueprintResult } from '../src/types/knowledge-schema';

describe('JSX Generator', () => {
  const generator = new JSXGenerator();

  describe('generate', () => {
    it('should generate code from simple blueprint', async () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-001',
        recipeName: 'simple-button',
        analysis: {
          intent: 'Create a button',
          tone: 'professional',
        },
        structure: {
          componentName: 'Button',
          props: { label: 'Click me' },
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);
      expect(result.code).toBeDefined();
      expect(result.code).toContain('import React from "react"');
      expect(result.code).toContain('Button');
      expect(result.code).toContain('function GeneratedComponent');
    });

    it('should format code with Prettier', async () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-002',
        recipeName: 'formatted',
        analysis: {
          intent: 'Create formatted component',
          tone: 'professional',
        },
        structure: {
          componentName: 'Button',
          props: {},
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);
      expect(result.code).toBeDefined();

      // Check for proper formatting (consistent indentation, semicolons)
      const lines = result.code!.split('\n');
      expect(lines.length).toBeGreaterThan(1);

      // Should have consistent formatting
      expect(result.code).not.toContain('  \n'); // No trailing spaces
    });

    it('should return error for invalid component', async () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-003',
        recipeName: 'invalid',
        analysis: {
          intent: 'Create invalid',
          tone: 'professional',
        },
        structure: {
          componentName: 'InvalidComponent',
          props: {},
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.length).toBeGreaterThan(0);
      expect(result.code).toBeUndefined();
    });

    it('should generate code with nested components', async () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-004',
        recipeName: 'nested',
        analysis: {
          intent: 'Create nested structure',
          tone: 'professional',
        },
        structure: {
          componentName: 'Card',
          props: {},
          slots: {
            content: {
              componentName: 'Button',
              props: { label: 'Click' },
            },
          },
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);
      expect(result.code).toContain('Card');
      expect(result.code).toContain('Button');
      expect(result.code).toContain('<Card>');
      expect(result.code).toContain('<Button');
      expect(result.code).toContain('</Card>');
    });

    it('should generate proper imports for all components', async () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-005',
        recipeName: 'multi-import',
        analysis: {
          intent: 'Create multi-component',
          tone: 'professional',
        },
        structure: {
          componentName: 'Card',
          props: {},
          slots: {
            header: { componentName: 'Button', props: {} },
            content: { componentName: 'Input', props: {} },
          },
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);
      expect(result.code).toContain('import { Button, Card, Input } from "@tekton/ui"');
    });

    it('should generate valid TypeScript code', async () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-006',
        recipeName: 'typescript',
        analysis: {
          intent: 'Create TypeScript component',
          tone: 'professional',
        },
        structure: {
          componentName: 'Button',
          props: { variant: 'primary' },
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);
      expect(result.code).toBeDefined();

      // Should be valid TypeScript/JavaScript
      expect(result.code).toContain('function GeneratedComponent()');
      expect(result.code).toContain('return');
      expect(result.code).toContain('export default GeneratedComponent');
    });

    it('should handle complex props correctly', async () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-007',
        recipeName: 'complex-props',
        analysis: {
          intent: 'Create with complex props',
          tone: 'professional',
        },
        structure: {
          componentName: 'Input',
          props: {
            name: 'email',
            maxLength: 100,
            required: true,
            style: { width: '100%' },
          },
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);
      expect(result.code).toContain('name="email"');
      expect(result.code).toContain('maxLength={100}');
      expect(result.code).toContain('required={true}');
      expect(result.code).toContain('style={{');
    });

    it('should generate code with array slots', async () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-008',
        recipeName: 'array-slots',
        analysis: {
          intent: 'Create with array slots',
          tone: 'professional',
        },
        structure: {
          componentName: 'Card',
          props: {},
          slots: {
            items: [
              { componentName: 'Button', props: { label: 'First' } },
              { componentName: 'Button', props: { label: 'Second' } },
            ],
          },
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);
      expect(result.code).toContain('<Button');
      expect(result.code).toContain('label="First"');
      expect(result.code).toContain('label="Second"');
    });

    it('should preserve component structure in generated code', async () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-009',
        recipeName: 'structure',
        analysis: {
          intent: 'Preserve structure',
          tone: 'professional',
        },
        structure: {
          componentName: 'Card',
          props: { title: 'Title' },
          slots: {
            content: {
              componentName: 'Input',
              props: { placeholder: 'Enter text' },
            },
          },
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);

      // Should have Card wrapping Input
      const cardIndex = result.code!.indexOf('<Card');
      const inputIndex = result.code!.indexOf('<Input');
      const cardCloseIndex = result.code!.indexOf('</Card>');

      expect(cardIndex).toBeLessThan(inputIndex);
      expect(inputIndex).toBeLessThan(cardCloseIndex);
    });

    it('should handle deeply nested structures', async () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-010',
        recipeName: 'deep-nested',
        analysis: {
          intent: 'Create deeply nested',
          tone: 'professional',
        },
        structure: {
          componentName: 'Card',
          props: {},
          slots: {
            content: {
              componentName: 'Card',
              props: {},
              slots: {
                content: {
                  componentName: 'Button',
                  props: {},
                },
              },
            },
          },
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);
      expect(result.code).toContain('Card');
      expect(result.code).toContain('Button');
    });

    it('should include export statement', async () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-011',
        recipeName: 'export',
        analysis: {
          intent: 'Create exported component',
          tone: 'professional',
        },
        structure: {
          componentName: 'Button',
          props: {},
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);
      expect(result.code).toContain('export default GeneratedComponent');
    });

    it('should generate consistent formatting', async () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-012',
        recipeName: 'consistent',
        analysis: {
          intent: 'Create with consistent formatting',
          tone: 'professional',
        },
        structure: {
          componentName: 'Card',
          props: {},
          slots: {
            a: { componentName: 'Button', props: {} },
            b: { componentName: 'Input', props: {} },
          },
        },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(true);

      // Check indentation is consistent
      const lines = result.code!.split('\n');
      const indentedLines = lines.filter(line => line.startsWith('  '));
      expect(indentedLines.length).toBeGreaterThan(0);
    });
  });

  describe('GenerationResult', () => {
    it('should have correct structure for successful generation', async () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-013',
        recipeName: 'test',
        analysis: { intent: 'test', tone: 'professional' },
        structure: { componentName: 'Button', props: {} },
      };

      const result = await generator.generate(blueprint);

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('code');
      expect(typeof result.success).toBe('boolean');
      expect(typeof result.code).toBe('string');
    });

    it('should have correct structure for failed generation', async () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-014',
        recipeName: 'test',
        analysis: { intent: 'test', tone: 'professional' },
        structure: { componentName: 'InvalidComponent', props: {} },
      };

      const result = await generator.generate(blueprint);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(Array.isArray(result.errors)).toBe(true);
      expect(result.code).toBeUndefined();
    });
  });
});
