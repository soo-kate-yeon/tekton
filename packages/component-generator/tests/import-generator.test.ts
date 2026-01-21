import { describe, it, expect } from 'vitest';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { generateImports } from '../src/generator/import-generator';

describe('Import Generator', () => {
  describe('generateImports', () => {
    it('should generate React import', () => {
      const imports = generateImports([]);

      expect(imports.length).toBeGreaterThanOrEqual(1);

      const reactImport = imports[0];
      expect(t.isImportDeclaration(reactImport)).toBe(true);

      const code = generate(reactImport).code;
      expect(code).toContain('import');
      expect(code).toContain('React');
      expect(code).toContain('react');
    });

    it('should generate import for single component', () => {
      const imports = generateImports(['Button']);

      expect(imports.length).toBe(2); // React + Button

      const componentImport = imports[1];
      const code = generate(componentImport).code;

      expect(code).toContain('Button');
      expect(code).toContain('@tekton/ui');
    });

    it('should generate imports for multiple components', () => {
      const imports = generateImports(['Button', 'Card', 'Modal']);

      expect(imports.length).toBe(2); // React + Components

      const componentImport = imports[1];
      const code = generate(componentImport).code;

      expect(code).toContain('Button');
      expect(code).toContain('Card');
      expect(code).toContain('Modal');
    });

    it('should sort component names alphabetically', () => {
      const imports = generateImports(['Zeta', 'Alpha', 'Beta']);

      const componentImport = imports[1];
      const code = generate(componentImport).code;

      // Check that imports are in alphabetical order
      const alphaIndex = code.indexOf('Alpha');
      const betaIndex = code.indexOf('Beta');
      const zetaIndex = code.indexOf('Zeta');

      expect(alphaIndex).toBeLessThan(betaIndex);
      expect(betaIndex).toBeLessThan(zetaIndex);
    });

    it('should deduplicate component names', () => {
      const imports = generateImports(['Button', 'Card', 'Button', 'Card']);

      const componentImport = imports[1];
      const code = generate(componentImport).code;

      // Count occurrences of "Button" - should appear only once
      const buttonMatches = code.match(/\bButton\b/g);
      expect(buttonMatches?.length).toBe(1);

      const cardMatches = code.match(/\bCard\b/g);
      expect(cardMatches?.length).toBe(1);
    });

    it('should handle empty component array', () => {
      const imports = generateImports([]);

      expect(imports.length).toBe(1); // Only React import
    });

    it('should generate valid ImportDeclaration AST nodes', () => {
      const imports = generateImports(['Button', 'Card']);

      imports.forEach(importNode => {
        expect(t.isImportDeclaration(importNode)).toBe(true);
        expect(importNode.specifiers).toBeDefined();
        expect(importNode.source).toBeDefined();
        expect(t.isStringLiteral(importNode.source)).toBe(true);
      });
    });

    it('should use named imports for components', () => {
      const imports = generateImports(['Button']);

      const componentImport = imports[1];

      expect(componentImport.specifiers.length).toBeGreaterThan(0);
      expect(t.isImportSpecifier(componentImport.specifiers[0])).toBe(true);
    });

    it('should import React as default export', () => {
      const imports = generateImports([]);

      const reactImport = imports[0];
      const code = generate(reactImport).code;

      // Should be: import React from "react"
      expect(code).toMatch(/import\s+React\s+from\s+["']react["']/);
    });

    it('should generate correct source for component imports', () => {
      const imports = generateImports(['Button']);

      const componentImport = imports[1];

      expect(t.isStringLiteral(componentImport.source)).toBe(true);
      expect(componentImport.source.value).toBe('@tekton/ui');
    });

    it('should handle components with mixed casing', () => {
      const imports = generateImports(['button', 'CARD', 'Modal']);

      const componentImport = imports[1];
      const code = generate(componentImport).code;

      expect(code).toContain('button');
      expect(code).toContain('CARD');
      expect(code).toContain('Modal');
    });

    it('should preserve component name exactly as provided', () => {
      const imports = generateImports(['CustomButton']);

      const componentImport = imports[1];
      const code = generate(componentImport).code;

      expect(code).toContain('CustomButton');
    });

    it('should generate imports that can be combined into valid code', () => {
      const imports = generateImports(['Button', 'Card']);

      const fullCode = imports.map(imp => generate(imp).code).join('\n');

      expect(fullCode).toContain('import React from "react"');
      expect(fullCode).toContain('import');
      expect(fullCode).toContain('@tekton/ui');
      expect(fullCode).toContain('Button');
      expect(fullCode).toContain('Card');
    });
  });
});
