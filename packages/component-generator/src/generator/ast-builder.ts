/**
 * AST Builder
 * Orchestrates full AST construction from blueprint
 * SPEC-LAYER3-MVP-001 M1-TASK-005
 * SPEC-LAYOUT-001 - Extended with layout support
 */

import * as t from '@babel/types';
import { ComponentValidator } from '../validators/component-name-validator.js';
import { generateImports } from './import-generator.js';
import { buildComponentNode, buildComponentNodeWithClassName } from './jsx-element-generator.js';
import { getLayoutClassName } from './layout-class-generator.js';
import type {
  BlueprintResult,
  BlueprintResultV2,
  ComponentNode,
  Environment,
} from '../types/knowledge-schema.js';
import type { BlueprintLayout } from '../types/layout-schema.js';

/**
 * HTML intrinsic elements that don't need catalog validation
 */
const HTML_INTRINSIC_ELEMENTS = new Set([
  'div', 'span', 'main', 'section', 'article', 'aside', 'header', 'footer',
  'nav', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol', 'li',
  'table', 'tr', 'td', 'th', 'form', 'input', 'button', 'label', 'textarea',
  'select', 'option', 'img', 'video', 'audio', 'canvas', 'svg', 'iframe',
]);

/**
 * Check if a component name is an HTML intrinsic element
 */
function isHtmlElement(name: string): boolean {
  return HTML_INTRINSIC_ELEMENTS.has(name.toLowerCase());
}

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
   * @param blueprint - Blueprint result to build from (supports V2 with layout)
   * @returns AST build result with success status and AST or errors
   */
  build(blueprint: BlueprintResult | BlueprintResultV2): ASTBuildResult {
    // Cast to V2 to access optional layout/environment fields
    const blueprintV2 = blueprint as BlueprintResultV2;

    // Step 1: Collect all component names from structure
    const componentNames = this.collectComponentNames(blueprint.structure);

    // Step 2: Filter out HTML elements and validate remaining components
    const customComponents = componentNames.filter(name => !isHtmlElement(name));
    const validationResults = this.validator.validateBatch(customComponents);
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

    // Step 3: Generate imports (only for custom components)
    const imports = generateImports(customComponents);

    // Step 4: Generate layout className if layout is present
    const layoutClassName = this.generateLayoutClassName(
      blueprintV2.layout,
      blueprintV2.environment
    );

    // Step 5: Generate JSX element with layout classes
    const jsxElement = layoutClassName
      ? buildComponentNodeWithClassName(blueprint.structure, layoutClassName)
      : buildComponentNode(blueprint.structure);

    // Step 6: Create function component
    const functionComponent = this.createFunctionComponent(jsxElement);

    // Step 7: Create export default statement
    const exportStatement = t.exportDefaultDeclaration(
      t.identifier('GeneratedComponent')
    );

    // Step 8: Combine into program
    const program = t.program([
      ...imports,
      functionComponent,
      exportStatement,
    ]);

    // Step 9: Create file AST
    const ast = t.file(program, [], []);

    return {
      success: true,
      ast,
      componentName: 'GeneratedComponent',
    };
  }

  /**
   * Generate layout className string from layout and environment
   */
  private generateLayoutClassName(
    layout: BlueprintLayout | undefined,
    environment: Environment | undefined
  ): string | undefined {
    // Always generate layout classes if layout is provided or we have an environment
    if (layout || environment) {
      return getLayoutClassName(layout, environment);
    }
    return undefined;
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
