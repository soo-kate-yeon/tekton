/**
 * ASTBuilder Tests
 * TASK-005: Implement ASTBuilder class
 * RED Phase: Failing tests
 */

import { describe, it, expect } from 'vitest';
import { ASTBuilder } from '../src/generators/ast-builder';
import generate from '@babel/generator';
import type { ComponentBlueprint } from '../src/types/knowledge-types';

describe('ASTBuilder', () => {
  describe('buildComponentAST', () => {
    it('should build complete component AST with imports and JSX', () => {
      const builder = new ASTBuilder();
      const blueprint: ComponentBlueprint = {
        componentName: 'Button',
        slotMappings: {
          children: { type: 'literal', value: 'Click me' },
        },
        propMappings: {
          variant: { type: 'literal', value: 'primary' },
        },
      };

      const ast = builder.buildComponentAST(blueprint);
      const code = generate(ast).code;

      expect(code).toContain('import Button from "@/components/ui/button"');
      expect(code).toContain('<Button');
      expect(code).toContain('variant="primary"');
      expect(code).toContain('Click me');
    });

    it('should build AST with multiple imports for nested components', () => {
      const builder = new ASTBuilder();
      const blueprint: ComponentBlueprint = {
        componentName: 'Card',
        slotMappings: {
          header: {
            type: 'component',
            blueprint: {
              componentName: 'Button',
              slotMappings: {
                children: { type: 'literal', value: 'Action' },
              },
              propMappings: {},
            },
          },
        },
        propMappings: {},
      };

      const ast = builder.buildComponentAST(blueprint);
      const code = generate(ast).code;

      expect(code).toContain('import Card from "@/components/ui/card"');
      expect(code).toContain('import Button from "@/components/ui/button"');
      expect(code).toContain('<Card');
      expect(code).toContain('<Button');
    });

    it('should build AST as a default export function component', () => {
      const builder = new ASTBuilder();
      const blueprint: ComponentBlueprint = {
        componentName: 'Button',
        slotMappings: {
          children: { type: 'literal', value: 'Click' },
        },
        propMappings: {},
      };

      const ast = builder.buildComponentAST(blueprint);
      const code = generate(ast).code;

      expect(code).toContain('export default function');
      expect(code).toContain('return');
    });

    it('should generate unique component name for export', () => {
      const builder = new ASTBuilder();
      const blueprint: ComponentBlueprint = {
        componentName: 'Button',
        slotMappings: {},
        propMappings: {},
      };

      const ast = builder.buildComponentAST(blueprint);
      const code = generate(ast).code;

      // Should have a component name like GeneratedComponent or similar
      expect(code).toMatch(/export default function \w+Component/);
    });
  });

  describe('buildProgramAST', () => {
    it('should build complete program with imports and component', () => {
      const builder = new ASTBuilder();
      const blueprint: ComponentBlueprint = {
        componentName: 'Input',
        slotMappings: {},
        propMappings: {
          placeholder: { type: 'literal', value: 'Enter text' },
        },
      };

      const program = builder.buildProgramAST(blueprint);

      expect(program.type).toBe('Program');
      expect(program.body.length).toBeGreaterThan(0);
    });

    it('should have imports at the top of the program', () => {
      const builder = new ASTBuilder();
      const blueprint: ComponentBlueprint = {
        componentName: 'Button',
        slotMappings: {},
        propMappings: {},
      };

      const program = builder.buildProgramAST(blueprint);
      const code = generate(program).code;

      const importIndex = code.indexOf('import');
      const functionIndex = code.indexOf('function');

      expect(importIndex).toBeLessThan(functionIndex);
    });
  });

  describe('performance requirements', () => {
    it('should build complete AST in under 50ms', () => {
      const builder = new ASTBuilder();
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
          content: { type: 'literal', value: 'Content' },
        },
        propMappings: {},
      };

      const start = performance.now();
      builder.buildComponentAST(blueprint);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(50);
    });
  });
});
