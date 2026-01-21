/**
 * AST Builder
 * Orchestrates full AST construction from blueprint
 * SPEC-LAYER3-MVP-001 M1-TASK-005
 */

import * as t from '@babel/types';
import { ComponentValidator } from '../validators/component-name-validator.js';
import { generateImports } from './import-generator.js';
import { buildComponentNode } from './jsx-element-generator.js';
import type { BlueprintResult, ComponentNode } from '../types/knowledge-schema.js';

/**
 * Result of AST build operation
 */
export interface ASTBuildResult {
  success: boolean;
  ast?: t.File;
  componentName?: string;
  errors?: string[];
}

/**
 * AST Builder class
 * Orchestrates validation, import generation, JSX generation, and function component creation
 */
export class ASTBuilder {
  private validator: ComponentValidator;

  constructor() {
    this.validator = new ComponentValidator();
  }

  /**
   * Build complete AST from blueprint
   *
   * @param blueprint - Blueprint result to build from
   * @returns AST build result with success status and AST or errors
   */
  build(blueprint: BlueprintResult): ASTBuildResult {
    // Step 1: Collect all component names from structure
    const componentNames = this.collectComponentNames(blueprint.structure);

    // Step 2: Validate all components
    const validationResults = this.validator.validateBatch(componentNames);
    const invalidComponents = validationResults.filter(result => !result.isValid);

    if (invalidComponents.length > 0) {
      const errors = invalidComponents.map(result => {
        const suggestions = result.suggestions
          ? ` Did you mean: ${result.suggestions.join(', ')}?`
          : '';
        return `${result.error}${suggestions}`;
      });

      return {
        success: false,
        errors,
      };
    }

    // Step 3: Generate imports
    const imports = generateImports(componentNames);

    // Step 4: Generate JSX element
    const jsxElement = buildComponentNode(blueprint.structure);

    // Step 5: Create function component
    const functionComponent = this.createFunctionComponent(jsxElement);

    // Step 6: Create export default statement
    const exportStatement = t.exportDefaultDeclaration(
      t.identifier('GeneratedComponent')
    );

    // Step 7: Combine into program
    const program = t.program([
      ...imports,
      functionComponent,
      exportStatement,
    ]);

    // Step 8: Create file AST
    const ast = t.file(program, [], []);

    return {
      success: true,
      ast,
      componentName: 'GeneratedComponent',
    };
  }

  /**
   * Collect all component names from structure recursively
   *
   * @param node - Component node to collect from
   * @returns Array of unique component names
   */
  private collectComponentNames(node: ComponentNode): string[] {
    const names = new Set<string>();

    // Validate componentName exists BEFORE adding
    if (!node || !node.componentName || typeof node.componentName !== 'string') {
      console.warn('[AST Builder] Invalid component node:', node);
      return [];
    }

    // Add current component name
    names.add(node.componentName);

    // Recursively collect from slots
    if (node.slots) {
      for (const slotContent of Object.values(node.slots)) {
        if (Array.isArray(slotContent)) {
          // Array of components
          for (const childNode of slotContent) {
            const childNames = this.collectComponentNames(childNode);
            childNames.forEach(name => names.add(name));
          }
        } else {
          // Single component
          const childNames = this.collectComponentNames(slotContent);
          childNames.forEach(name => names.add(name));
        }
      }
    }

    return Array.from(names);
  }

  /**
   * Create function component declaration
   *
   * @param jsxElement - JSX element to return
   * @returns Function declaration
   */
  private createFunctionComponent(jsxElement: t.JSXElement): t.FunctionDeclaration {
    const returnStatement = t.returnStatement(jsxElement);
    const functionBody = t.blockStatement([returnStatement]);

    return t.functionDeclaration(
      t.identifier('GeneratedComponent'),
      [], // no parameters
      functionBody
    );
  }
}
