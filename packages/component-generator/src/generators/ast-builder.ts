/**
 * AST Builder
 * TASK-005: Orchestrates import and JSX generation into complete component AST
 */

import * as t from '@babel/types';
import { ASTImportGenerator } from './ast-import-generator';
import { ASTJSXGenerator } from './ast-jsx-generator';
import type { ComponentBlueprint } from '../types/knowledge-types';

/**
 * Builds complete component AST from blueprint
 * Combines imports and JSX into a functional React component
 */
export class ASTBuilder {
  private importGenerator: ASTImportGenerator;
  private jsxGenerator: ASTJSXGenerator;

  constructor() {
    this.importGenerator = new ASTImportGenerator();
    this.jsxGenerator = new ASTJSXGenerator();
  }

  /**
   * Build complete component AST including imports and component function
   *
   * @param blueprint - Component blueprint
   * @returns Babel File AST node
   */
  buildComponentAST(blueprint: ComponentBlueprint): t.File {
    const program = this.buildProgramAST(blueprint);
    return t.file(program, [], []);
  }

  /**
   * Build program AST with imports and component
   *
   * @param blueprint - Component blueprint
   * @returns Babel Program AST node
   */
  buildProgramAST(blueprint: ComponentBlueprint): t.Program {
    const body: t.Statement[] = [];

    // 1. Generate imports
    const imports = this.importGenerator.generateImportsFromBlueprint(blueprint);
    for (const importInfo of imports) {
      const importDecl = this.importGenerator.generateImportDeclaration(
        importInfo.componentName,
        importInfo.importPath
      );
      body.push(importDecl);
    }

    // 2. Generate component function
    const componentFunction = this.buildComponentFunction(blueprint);
    body.push(componentFunction);

    return t.program(body, [], 'module');
  }

  /**
   * Build component function with JSX return
   */
  private buildComponentFunction(blueprint: ComponentBlueprint): t.ExportDefaultDeclaration {
    // Generate JSX element
    const jsxElement = this.jsxGenerator.generateJSXElement(blueprint);

    // Create return statement
    const returnStatement = t.returnStatement(jsxElement);

    // Create function body
    const functionBody = t.blockStatement([returnStatement]);

    // Create function declaration
    const functionName = this.generateComponentName(blueprint);
    const functionDeclaration = t.functionDeclaration(
      t.identifier(functionName),
      [], // no parameters for now
      functionBody
    );

    // Export as default
    return t.exportDefaultDeclaration(functionDeclaration);
  }

  /**
   * Generate a unique component name for the exported function
   */
  private generateComponentName(blueprint: ComponentBlueprint): string {
    // Use the blueprint's component name as base, add "Component" suffix to avoid conflicts
    return `Generated${blueprint.componentName}Component`;
  }
}
