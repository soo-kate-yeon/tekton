/**
 * AST Import Generator Tests
 * TASK-003: Build Babel AST import generator
 * RED Phase: Failing tests
 */

import { describe, it, expect } from 'vitest';
import { ASTImportGenerator } from '../src/generators/ast-import-generator';
import generate from '@babel/generator';

describe('ASTImportGenerator', () => {
  describe('generateImportDeclaration', () => {
    it('should generate default import', () => {
      const generator = new ASTImportGenerator();
      const ast = generator.generateImportDeclaration('Button', '@/components/ui/button');
      const code = generate(ast).code;

      expect(code).toBe('import Button from "@/components/ui/button";');
    });

    it('should generate named import', () => {
      const generator = new ASTImportGenerator();
      const ast = generator.generateImportDeclaration('Button', '@/components/ui/button', 'named');
      const code = generate(ast).code;

      expect(code).toBe('import { Button } from "@/components/ui/button";');
    });

    it('should generate multiple named imports', () => {
      const generator = new ASTImportGenerator();
      const ast = generator.generateMultipleNamedImports(
        ['Button', 'Card', 'Input'],
        '@/components/ui'
      );
      const code = generate(ast).code;

      expect(code).toBe('import { Button, Card, Input } from "@/components/ui";');
    });

    it('should handle aliased imports', () => {
      const generator = new ASTImportGenerator();
      const ast = generator.generateImportDeclaration(
        'Button',
        '@/components/ui/button',
        'named',
        'PrimaryButton'
      );
      const code = generate(ast).code;

      expect(code).toBe('import { Button as PrimaryButton } from "@/components/ui/button";');
    });
  });

  describe('collectUniqueImports', () => {
    it('should collect unique imports from component name', () => {
      const generator = new ASTImportGenerator();
      const imports = generator.collectUniqueImports('Button');

      expect(imports).toEqual([
        {
          componentName: 'Button',
          importPath: '@/components/ui/button',
        },
      ]);
    });

    it('should collect imports from multiple component names', () => {
      const generator = new ASTImportGenerator();
      const imports = generator.collectUniqueImports(['Button', 'Card', 'Input']);

      expect(imports).toHaveLength(3);
      expect(imports).toContainEqual({
        componentName: 'Button',
        importPath: '@/components/ui/button',
      });
      expect(imports).toContainEqual({
        componentName: 'Card',
        importPath: '@/components/ui/card',
      });
    });

    it('should deduplicate imports from same path', () => {
      const generator = new ASTImportGenerator();
      const imports = generator.collectUniqueImports(['Button', 'Button']);

      expect(imports).toHaveLength(1);
    });

    it('should group components from same import path', () => {
      const generator = new ASTImportGenerator();
      const imports = generator.collectUniqueImports(['CardHeader', 'CardContent', 'CardFooter']);

      // All three should come from the same card import
      const cardImports = imports.filter(imp => imp.importPath.includes('card'));
      expect(cardImports.length).toBeGreaterThan(0);
    });
  });

  describe('generateImportsFromBlueprint', () => {
    it('should generate imports for simple blueprint', () => {
      const generator = new ASTImportGenerator();
      const blueprint = {
        componentName: 'Button',
        slotMappings: {
          children: { type: 'literal' as const, value: 'Click' },
        },
        propMappings: {},
      };

      const imports = generator.generateImportsFromBlueprint(blueprint);

      expect(imports).toHaveLength(1);
      expect(imports[0].componentName).toBe('Button');
    });

    it('should generate imports for nested blueprints', () => {
      const generator = new ASTImportGenerator();
      const blueprint = {
        componentName: 'Card',
        slotMappings: {
          header: {
            type: 'component' as const,
            blueprint: {
              componentName: 'Button',
              slotMappings: {},
              propMappings: {},
            },
          },
        },
        propMappings: {},
      };

      const imports = generator.generateImportsFromBlueprint(blueprint);

      expect(imports).toHaveLength(2);
      expect(imports.map(i => i.componentName)).toContain('Card');
      expect(imports.map(i => i.componentName)).toContain('Button');
    });

    it('should generate imports for array slot mappings', () => {
      const generator = new ASTImportGenerator();
      const blueprint = {
        componentName: 'Card',
        slotMappings: {
          content: {
            type: 'array' as const,
            items: [
              {
                type: 'component' as const,
                blueprint: {
                  componentName: 'Button',
                  slotMappings: {},
                  propMappings: {},
                },
              },
              {
                type: 'component' as const,
                blueprint: {
                  componentName: 'Input',
                  slotMappings: {},
                  propMappings: {},
                },
              },
            ],
          },
        },
        propMappings: {},
      };

      const imports = generator.generateImportsFromBlueprint(blueprint);

      expect(imports.length).toBeGreaterThanOrEqual(3);
      expect(imports.map(i => i.componentName)).toContain('Button');
      expect(imports.map(i => i.componentName)).toContain('Input');
    });
  });

  describe('performance requirements', () => {
    it('should generate import AST in under 50ms', () => {
      const generator = new ASTImportGenerator();

      const start = performance.now();
      generator.generateImportDeclaration('Button', '@/components/ui/button');
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(50);
    });
  });
});
