/**
 * JSXGenerator Tests
 * TASK-006: Implement JSXGenerator with Prettier formatting
 * RED Phase: Failing tests
 */

import { describe, it, expect } from 'vitest';
import { JSXGenerator } from '../src/generators/jsx-generator';
import type { ComponentBlueprint } from '../src/types/knowledge-types';

describe('JSXGenerator', () => {
  describe('generate', () => {
    it('should generate formatted JSX code from simple blueprint', async () => {
      const generator = new JSXGenerator();
      const blueprint: ComponentBlueprint = {
        componentName: 'Button',
        slotMappings: {
          children: { type: 'literal', value: 'Click me' },
        },
        propMappings: {
          variant: { type: 'literal', value: 'primary' },
        },
      };

      const code = await generator.generate(blueprint);

      expect(code).toContain('import Button from "@/components/ui/button";');
      expect(code).toContain('export default function');
      expect(code).toContain('<Button variant="primary">Click me</Button>');
      expect(code).toContain('return');
    });

    it('should generate formatted code with nested components', async () => {
      const generator = new JSXGenerator();
      const blueprint: ComponentBlueprint = {
        componentName: 'Card',
        slotMappings: {
          header: {
            type: 'component',
            blueprint: {
              componentName: 'CardHeader',
              slotMappings: {
                children: { type: 'literal', value: 'Title' },
              },
              propMappings: {},
            },
          },
          content: { type: 'literal', value: 'Content text' },
        },
        propMappings: {},
      };

      const code = await generator.generate(blueprint);

      expect(code).toContain('import Card from "@/components/ui/card";');
      expect(code).toContain('import CardHeader from "@/components/ui/card";');
      expect(code).toContain('<Card>');
      expect(code).toContain('<CardHeader>Title</CardHeader>');
      expect(code).toContain('Content text');
    });

    it('should format code with proper indentation', async () => {
      const generator = new JSXGenerator();
      const blueprint: ComponentBlueprint = {
        componentName: 'Button',
        slotMappings: {
          children: { type: 'literal', value: 'Click' },
        },
        propMappings: {},
      };

      const code = await generator.generate(blueprint);

      // Check that code has proper indentation (2 spaces by default)
      const lines = code.split('\n');
      const hasIndentation = lines.some(line => line.startsWith('  '));
      expect(hasIndentation).toBe(true);
    });

    it('should use semicolons in formatted output', async () => {
      const generator = new JSXGenerator();
      const blueprint: ComponentBlueprint = {
        componentName: 'Input',
        slotMappings: {},
        propMappings: {},
      };

      const code = await generator.generate(blueprint);

      expect(code).toContain(';');
    });

    it('should handle self-closing tags properly', async () => {
      const generator = new JSXGenerator();
      const blueprint: ComponentBlueprint = {
        componentName: 'Input',
        slotMappings: {},
        propMappings: {
          placeholder: { type: 'literal', value: 'Enter text' },
        },
      };

      const code = await generator.generate(blueprint);

      expect(code).toContain('<Input');
      expect(code).toContain('placeholder="Enter text"');
    });
  });

  describe('generateWithOptions', () => {
    it('should accept custom Prettier options', async () => {
      const generator = new JSXGenerator();
      const blueprint: ComponentBlueprint = {
        componentName: 'Button',
        slotMappings: {
          children: { type: 'literal', value: 'Click' },
        },
        propMappings: {},
      };

      const code = await generator.generateWithOptions(blueprint, {
        semi: false,
        singleQuote: true,
      });

      // Should not have semicolons
      expect(code).not.toContain('";');
      // Should use single quotes
      expect(code).toContain("'@/components/ui/button'");
    });

    it('should support custom tab width', async () => {
      const generator = new JSXGenerator();
      const blueprint: ComponentBlueprint = {
        componentName: 'Button',
        slotMappings: {
          children: { type: 'literal', value: 'Click' },
        },
        propMappings: {},
      };

      const code = await generator.generateWithOptions(blueprint, {
        tabWidth: 4,
      });

      // Check for 4-space indentation
      const lines = code.split('\n');
      const hasFourSpaces = lines.some(line => line.startsWith('    '));
      expect(hasFourSpaces).toBe(true);
    });
  });

  describe('performance requirements', () => {
    it('should generate and format code in under 100ms', async () => {
      const generator = new JSXGenerator();
      const blueprint: ComponentBlueprint = {
        componentName: 'Card',
        slotMappings: {
          header: {
            type: 'component',
            blueprint: {
              componentName: 'CardHeader',
              slotMappings: {
                children: { type: 'literal', value: 'Title' },
              },
              propMappings: {},
            },
          },
        },
        propMappings: {},
      };

      const start = performance.now();
      await generator.generate(blueprint);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100);
    });
  });

  describe('end-to-end validation', () => {
    it('should generate valid TypeScript React component code', async () => {
      const generator = new JSXGenerator();
      const blueprint: ComponentBlueprint = {
        componentName: 'Button',
        slotMappings: {
          children: { type: 'literal', value: 'Submit' },
        },
        propMappings: {
          variant: { type: 'literal', value: 'primary' },
          disabled: { type: 'literal', value: false },
        },
      };

      const code = await generator.generate(blueprint);

      // Validate structure
      expect(code).toMatch(/import .+ from ["'].+["'];/);
      expect(code).toMatch(/export default function \w+/);
      expect(code).toContain('return');
      expect(code).toContain('<Button');
      expect(code).toContain('</Button>');
    });
  });
});
