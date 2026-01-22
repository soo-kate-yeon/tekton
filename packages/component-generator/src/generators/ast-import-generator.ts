/**
 * AST Import Generator
 * TASK-003: Generate Babel AST for import statements
 */

import * as t from '@babel/types';
import type { ComponentBlueprint, SlotMapping } from '../types/knowledge-types';

/**
 * Import information for a component
 */
export interface ImportInfo {
  componentName: string;
  importPath: string;
}

/**
 * Import type
 */
export type ImportType = 'default' | 'named';

/**
 * Generates Babel AST nodes for import declarations
 */
export class ASTImportGenerator {
  /**
   * Generate a single import declaration
   *
   * @param componentName - Name of the component to import
   * @param importPath - Path to import from
   * @param importType - Type of import (default or named)
   * @param alias - Optional alias for the import
   * @returns Babel ImportDeclaration AST node
   */
  generateImportDeclaration(
    componentName: string,
    importPath: string,
    importType: ImportType = 'default',
    alias?: string
  ): t.ImportDeclaration {
    const specifier =
      importType === 'default'
        ? t.importDefaultSpecifier(t.identifier(componentName))
        : t.importSpecifier(
            t.identifier(alias || componentName),
            t.identifier(componentName)
          );

    return t.importDeclaration([specifier], t.stringLiteral(importPath));
  }

  /**
   * Generate multiple named imports from a single path
   *
   * @param componentNames - Array of component names to import
   * @param importPath - Path to import from
   * @returns Babel ImportDeclaration AST node
   */
  generateMultipleNamedImports(
    componentNames: string[],
    importPath: string
  ): t.ImportDeclaration {
    const specifiers = componentNames.map((name) =>
      t.importSpecifier(t.identifier(name), t.identifier(name))
    );

    return t.importDeclaration(specifiers, t.stringLiteral(importPath));
  }

  /**
   * Collect unique imports from component names
   *
   * @param components - Single component name or array of component names
   * @returns Array of unique import information
   */
  collectUniqueImports(components: string | string[]): ImportInfo[] {
    const componentArray = Array.isArray(components) ? components : [components];
    const importMap = new Map<string, ImportInfo>();

    for (const componentName of componentArray) {
      const importPath = this.getImportPathForComponent(componentName);
      const key = `${componentName}:${importPath}`;

      if (!importMap.has(key)) {
        importMap.set(key, { componentName, importPath });
      }
    }

    return Array.from(importMap.values());
  }

  /**
   * Generate imports from a component blueprint
   * Recursively collects all component imports including nested ones
   *
   * @param blueprint - Component blueprint
   * @returns Array of unique import information
   */
  generateImportsFromBlueprint(blueprint: ComponentBlueprint): ImportInfo[] {
    const imports: ImportInfo[] = [];
    const seen = new Set<string>();

    const collectFromBlueprint = (bp: ComponentBlueprint) => {
      const key = bp.componentName;
      if (!seen.has(key)) {
        seen.add(key);
        imports.push({
          componentName: bp.componentName,
          importPath: this.getImportPathForComponent(bp.componentName),
        });
      }

      // Recursively collect from slot mappings
      for (const mapping of Object.values(bp.slotMappings)) {
        this.collectFromSlotMapping(mapping, collectFromBlueprint);
      }
    };

    collectFromBlueprint(blueprint);
    return imports;
  }

  /**
   * Collect imports from a slot mapping
   */
  private collectFromSlotMapping(
    mapping: SlotMapping,
    collectFromBlueprint: (bp: ComponentBlueprint) => void
  ): void {
    if (mapping.type === 'component') {
      collectFromBlueprint(mapping.blueprint);
    } else if (mapping.type === 'array') {
      for (const item of mapping.items) {
        this.collectFromSlotMapping(item, collectFromBlueprint);
      }
    }
  }

  /**
   * Get import path for a component name
   * Converts component name to shadcn-style import path
   *
   * @param componentName - Component name
   * @returns Import path
   */
  private getImportPathForComponent(componentName: string): string {
    // Convert PascalCase to kebab-case
    const kebabCase = componentName
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();

    // Handle composite components like CardHeader, CardContent
    if (kebabCase.includes('-')) {
      const parts = kebabCase.split('-');
      const base = parts[0];
      // If it looks like a sub-component, use the base component path
      return `@/components/ui/${base}`;
    }

    return `@/components/ui/${kebabCase}`;
  }
}
