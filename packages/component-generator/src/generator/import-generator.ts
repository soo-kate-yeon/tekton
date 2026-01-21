/**
 * Import Generator
 * Generates Babel AST import statements for React and components
 * SPEC-LAYER3-MVP-001 M1-TASK-003
 */

import * as t from '@babel/types';

/**
 * Generate import statements for React and components
 *
 * @param components - Array of component names to import
 * @returns Array of ImportDeclaration AST nodes
 *
 * @example
 * generateImports(['Button', 'Card'])
 * // Returns AST for:
 * // import React from "react";
 * // import { Button, Card } from "@tekton/ui";
 */
export function generateImports(components: string[]): t.ImportDeclaration[] {
  const imports: t.ImportDeclaration[] = [];

  // Generate React import: import React from "react"
  const reactImport = t.importDeclaration(
    [t.importDefaultSpecifier(t.identifier('React'))],
    t.stringLiteral('react')
  );
  imports.push(reactImport);

  // Deduplicate and sort component names alphabetically
  const uniqueComponents = Array.from(new Set(components)).sort();

  // Generate component imports if there are any
  if (uniqueComponents.length > 0) {
    const componentSpecifiers = uniqueComponents.map(componentName =>
      t.importSpecifier(
        t.identifier(componentName),
        t.identifier(componentName)
      )
    );

    const componentImport = t.importDeclaration(
      componentSpecifiers,
      t.stringLiteral('@tekton/ui')
    );

    imports.push(componentImport);
  }

  return imports;
}
