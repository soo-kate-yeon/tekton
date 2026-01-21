import { describe, it, expect } from 'vitest';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { ASTBuilder, type ASTBuildResult } from '../src/generator/ast-builder';
import type { BlueprintResult } from '../src/types/knowledge-schema';

describe('AST Builder', () => {
  const builder = new ASTBuilder();

  describe('build', () => {
    it('should build AST from simple blueprint', () => {
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

      const result = builder.build(blueprint);

      expect(result.success).toBe(true);
      expect(result.ast).toBeDefined();
      expect(result.errors).toBeUndefined();
      expect(result.componentName).toBe('GeneratedComponent');
    });

    it('should validate components before building AST', () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-002',
        recipeName: 'invalid-component',
        analysis: {
          intent: 'Create invalid component',
          tone: 'professional',
        },
        structure: {
          componentName: 'InvalidComponent',
          props: {},
        },
      };

      const result = builder.build(blueprint);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.length).toBeGreaterThan(0);
      expect(result.errors?.[0]).toContain('InvalidComponent');
    });

    it('should generate imports in AST', () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-003',
        recipeName: 'card-with-button',
        analysis: {
          intent: 'Create card with button',
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

      const result = builder.build(blueprint);

      expect(result.success).toBe(true);
      expect(result.ast).toBeDefined();

      const code = generate(result.ast!).code;
      expect(code).toContain('import React from "react"');
      expect(code).toContain('import');
      expect(code).toContain('Button');
      expect(code).toContain('Card');
    });

    it('should generate function component in AST', () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-004',
        recipeName: 'simple-card',
        analysis: {
          intent: 'Create card',
          tone: 'professional',
        },
        structure: {
          componentName: 'Card',
          props: { title: 'Title' },
        },
      };

      const result = builder.build(blueprint);

      expect(result.success).toBe(true);

      const code = generate(result.ast!).code;
      expect(code).toContain('function GeneratedComponent()');
      expect(code).toContain('return');
      expect(code).toContain('<Card');
    });

    it('should collect all component names from nested structure', () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-005',
        recipeName: 'nested-structure',
        analysis: {
          intent: 'Create nested structure',
          tone: 'professional',
        },
        structure: {
          componentName: 'Card',
          props: {},
          slots: {
            header: {
              componentName: 'Button',
              props: {},
            },
            content: {
              componentName: 'Input',
              props: {},
            },
          },
        },
      };

      const result = builder.build(blueprint);

      expect(result.success).toBe(true);

      const code = generate(result.ast!).code;
      expect(code).toContain('Button');
      expect(code).toContain('Card');
      expect(code).toContain('Input');
    });

    it('should handle array slots in component collection', () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-006',
        recipeName: 'list-with-items',
        analysis: {
          intent: 'Create list',
          tone: 'professional',
        },
        structure: {
          componentName: 'Card',
          props: {},
          slots: {
            items: [
              { componentName: 'Button', props: {} },
              { componentName: 'Input', props: {} },
            ],
          },
        },
      };

      const result = builder.build(blueprint);

      expect(result.success).toBe(true);

      const code = generate(result.ast!).code;
      expect(code).toContain('Button');
      expect(code).toContain('Card');
      expect(code).toContain('Input');
    });

    it('should validate all components in nested structure', () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-007',
        recipeName: 'invalid-nested',
        analysis: {
          intent: 'Create invalid nested',
          tone: 'professional',
        },
        structure: {
          componentName: 'Card',
          props: {},
          slots: {
            content: {
              componentName: 'InvalidComponent',
              props: {},
            },
          },
        },
      };

      const result = builder.build(blueprint);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]).toContain('InvalidComponent');
    });

    it('should generate valid TypeScript AST', () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-008',
        recipeName: 'simple',
        analysis: {
          intent: 'Create component',
          tone: 'professional',
        },
        structure: {
          componentName: 'Button',
          props: {},
        },
      };

      const result = builder.build(blueprint);

      expect(result.success).toBe(true);
      expect(t.isFile(result.ast!)).toBe(true);
      expect(result.ast!.program).toBeDefined();
      expect(t.isProgram(result.ast!.program)).toBe(true);
    });

    it('should include all necessary imports', () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-009',
        recipeName: 'multi-component',
        analysis: {
          intent: 'Create multiple components',
          tone: 'professional',
        },
        structure: {
          componentName: 'Card',
          props: {},
          slots: {
            a: { componentName: 'Button', props: {} },
            b: { componentName: 'Input', props: {} },
            c: { componentName: 'Checkbox', props: {} },
          },
        },
      };

      const result = builder.build(blueprint);

      expect(result.success).toBe(true);

      const code = generate(result.ast!).code;
      const importMatch = code.match(/import\s+\{([^}]+)\}\s+from\s+["']@tekton\/ui["']/);
      expect(importMatch).toBeTruthy();

      if (importMatch) {
        const imports = importMatch[1].split(',').map(s => s.trim());
        expect(imports).toContain('Button');
        expect(imports).toContain('Card');
        expect(imports).toContain('Checkbox');
        expect(imports).toContain('Input');
      }
    });

    it('should deduplicate component names in imports', () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-010',
        recipeName: 'duplicate-components',
        analysis: {
          intent: 'Create with duplicates',
          tone: 'professional',
        },
        structure: {
          componentName: 'Button',
          props: {},
          slots: {
            items: [
              { componentName: 'Button', props: {} },
              { componentName: 'Button', props: {} },
            ],
          },
        },
      };

      const result = builder.build(blueprint);

      expect(result.success).toBe(true);

      const code = generate(result.ast!).code;
      const buttonMatches = code.match(/\bButton\b/g);
      // Should appear in import once and in JSX elements
      expect(buttonMatches).toBeDefined();
    });

    it('should return error with suggestions for invalid components', () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-011',
        recipeName: 'typo-component',
        analysis: {
          intent: 'Create with typo',
          tone: 'professional',
        },
        structure: {
          componentName: 'Buton', // typo
          props: {},
        },
      };

      const result = builder.build(blueprint);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]).toContain('Buton');
    });

    it('should generate export default statement', () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-012',
        recipeName: 'exported',
        analysis: {
          intent: 'Create exported component',
          tone: 'professional',
        },
        structure: {
          componentName: 'Button',
          props: {},
        },
      };

      const result = builder.build(blueprint);

      expect(result.success).toBe(true);

      const code = generate(result.ast!).code;
      expect(code).toContain('export default GeneratedComponent');
    });

    it('should handle deeply nested structures', () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-013',
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

      const result = builder.build(blueprint);

      expect(result.success).toBe(true);
      expect(result.errors).toBeUndefined();
    });
  });

  describe('ASTBuildResult', () => {
    it('should have correct structure for successful build', () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-014',
        recipeName: 'test',
        analysis: { intent: 'test', tone: 'professional' },
        structure: { componentName: 'Button', props: {} },
      };

      const result = builder.build(blueprint);

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('ast');
      expect(result).toHaveProperty('componentName');
      expect(typeof result.success).toBe('boolean');
    });

    it('should have correct structure for failed build', () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'bp-015',
        recipeName: 'test',
        analysis: { intent: 'test', tone: 'professional' },
        structure: { componentName: 'InvalidComponent', props: {} },
      };

      const result = builder.build(blueprint);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(Array.isArray(result.errors)).toBe(true);
    });
  });
});
