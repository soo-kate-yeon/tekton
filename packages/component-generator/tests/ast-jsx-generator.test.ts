/**
 * AST JSX Generator Tests
 * TASK-004: Build Babel AST JSX element generator
 * RED Phase: Failing tests
 */

import { describe, it, expect } from 'vitest';
import { ASTJSXGenerator } from '../src/generators/ast-jsx-generator';
import generate from '@babel/generator';
import type { ComponentBlueprint } from '../src/types/knowledge-types';

describe('ASTJSXGenerator', () => {
  describe('generateJSXElement', () => {
    it('should generate simple JSX element with text child', () => {
      const generator = new ASTJSXGenerator();
      const blueprint: ComponentBlueprint = {
        componentName: 'Button',
        slotMappings: {
          children: { type: 'literal', value: 'Click me' },
        },
        propMappings: {},
      };

      const ast = generator.generateJSXElement(blueprint);
      const code = generate(ast).code;

      expect(code).toContain('<Button');
      expect(code).toContain('Click me');
      expect(code).toContain('</Button>');
    });

    it('should generate JSX element with props', () => {
      const generator = new ASTJSXGenerator();
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

      const ast = generator.generateJSXElement(blueprint);
      const code = generate(ast).code;

      expect(code).toContain('variant="primary"');
      expect(code).toContain('disabled={false}');
    });

    it('should generate JSX element with boolean prop shorthand', () => {
      const generator = new ASTJSXGenerator();
      const blueprint: ComponentBlueprint = {
        componentName: 'Input',
        slotMappings: {},
        propMappings: {
          required: { type: 'literal', value: true },
        },
      };

      const ast = generator.generateJSXElement(blueprint);
      const code = generate(ast).code;

      // When boolean prop is true, it should be shorthand
      expect(code).toContain('required');
    });

    it('should generate JSX element with number prop', () => {
      const generator = new ASTJSXGenerator();
      const blueprint: ComponentBlueprint = {
        componentName: 'Progress',
        slotMappings: {},
        propMappings: {
          value: { type: 'literal', value: 75 },
        },
      };

      const ast = generator.generateJSXElement(blueprint);
      const code = generate(ast).code;

      expect(code).toContain('value={75}');
    });

    it('should generate nested JSX elements', () => {
      const generator = new ASTJSXGenerator();
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
          content: { type: 'literal', value: 'Card content' },
        },
        propMappings: {},
      };

      const ast = generator.generateJSXElement(blueprint);
      const code = generate(ast).code;

      expect(code).toContain('<Card');
      expect(code).toContain('<CardHeader');
      expect(code).toContain('Title');
      expect(code).toContain('Card content');
    });

    it('should generate array of JSX elements in slot', () => {
      const generator = new ASTJSXGenerator();
      const blueprint: ComponentBlueprint = {
        componentName: 'Card',
        slotMappings: {
          children: {
            type: 'array',
            items: [
              { type: 'literal', value: 'First item' },
              { type: 'literal', value: 'Second item' },
            ],
          },
        },
        propMappings: {},
      };

      const ast = generator.generateJSXElement(blueprint);
      const code = generate(ast).code;

      expect(code).toContain('First item');
      expect(code).toContain('Second item');
    });

    it('should generate self-closing JSX element when no children', () => {
      const generator = new ASTJSXGenerator();
      const blueprint: ComponentBlueprint = {
        componentName: 'Input',
        slotMappings: {},
        propMappings: {
          placeholder: { type: 'literal', value: 'Enter text' },
        },
      };

      const ast = generator.generateJSXElement(blueprint);
      const code = generate(ast).code;

      expect(code).toContain('<Input');
      expect(code).toContain('/>');
    });
  });

  describe('generateJSXAttribute', () => {
    it('should generate string attribute', () => {
      const generator = new ASTJSXGenerator();
      const attr = generator.generateJSXAttribute('variant', 'primary');
      const code = generate(attr).code;

      expect(code).toBe('variant="primary"');
    });

    it('should generate number attribute', () => {
      const generator = new ASTJSXGenerator();
      const attr = generator.generateJSXAttribute('value', 42);
      const code = generate(attr).code;

      expect(code).toBe('value={42}');
    });

    it('should generate boolean attribute', () => {
      const generator = new ASTJSXGenerator();
      const attr = generator.generateJSXAttribute('disabled', false);
      const code = generate(attr).code;

      expect(code).toBe('disabled={false}');
    });
  });

  describe('generateJSXChildren', () => {
    it('should generate text child', () => {
      const generator = new ASTJSXGenerator();
      const children = generator.generateJSXChildren({ type: 'literal', value: 'Hello' });

      expect(children).toHaveLength(1);
    });

    it('should generate component child', () => {
      const generator = new ASTJSXGenerator();
      const children = generator.generateJSXChildren({
        type: 'component',
        blueprint: {
          componentName: 'Icon',
          slotMappings: {},
          propMappings: {},
        },
      });

      expect(children).toHaveLength(1);
    });

    it('should generate multiple children from array', () => {
      const generator = new ASTJSXGenerator();
      const children = generator.generateJSXChildren({
        type: 'array',
        items: [
          { type: 'literal', value: 'First' },
          { type: 'literal', value: 'Second' },
        ],
      });

      expect(children).toHaveLength(2);
    });
  });

  describe('performance requirements', () => {
    it('should generate JSX element AST in under 30ms', () => {
      const generator = new ASTJSXGenerator();
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
      generator.generateJSXElement(blueprint);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(30);
    });
  });
});
