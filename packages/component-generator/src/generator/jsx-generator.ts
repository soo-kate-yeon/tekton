/**
 * JSX Generator
 * Generates formatted TypeScript code from blueprint
 * SPEC-LAYER3-MVP-001 M1-TASK-006
 */

import { generate } from '@babel/generator';
import * as prettier from 'prettier';
import { ASTBuilder } from './ast-builder.js';
import type { BlueprintResult } from '../types/knowledge-schema.js';

/**
 * Result of code generation
 */
export interface GenerationResult {
  success: boolean;
  code?: string;
  errors?: string[];
}

/**
 * JSX Generator class
 * Generates formatted TypeScript code from blueprints
 */
export class JSXGenerator {
  private astBuilder: ASTBuilder;

  constructor() {
    this.astBuilder = new ASTBuilder();
  }

  /**
   * Generate formatted TypeScript code from blueprint
   *
   * @param blueprint - Blueprint to generate code from
   * @returns Generation result with formatted code or errors
   */
  async generate(blueprint: BlueprintResult): Promise<GenerationResult> {
    // Step 1: Build AST
    const astResult = this.astBuilder.build(blueprint);

    if (!astResult.success || !astResult.ast) {
      return {
        success: false,
        errors: astResult.errors || ['Failed to build AST'],
      };
    }

    // Step 2: Generate code from AST
    const generatedCode = generate(astResult.ast, {
      retainLines: false,
      compact: false,
      concise: false,
    });

    // Step 3: Format with Prettier
    const formattedCode = await this.formatCode(generatedCode.code);

    return {
      success: true,
      code: formattedCode,
    };
  }

  /**
   * Format code with Prettier
   *
   * @param code - Code to format
   * @returns Formatted code
   */
  private async formatCode(code: string): Promise<string> {
    try {
      const formatted = await prettier.format(code, {
        parser: 'typescript',
        semi: true,
        singleQuote: false,
        trailingComma: 'es5',
        printWidth: 80,
        tabWidth: 2,
      });

      return formatted;
    } catch (error) {
      // If Prettier fails, return unformatted code
      console.warn('Prettier formatting failed, returning unformatted code:', error);
      return code;
    }
  }
}
