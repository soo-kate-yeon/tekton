/**
 * JSX Generator
 * TASK-006: Generate formatted JSX code from blueprints using Prettier
 */

import generate from '@babel/generator';
import prettier from 'prettier';
import { ASTBuilder } from './ast-builder';
import type { ComponentBlueprint } from '../types/knowledge-types';

/**
 * Prettier formatting options
 */
export interface PrettierOptions {
  semi?: boolean;
  singleQuote?: boolean;
  tabWidth?: number;
  printWidth?: number;
  trailingComma?: 'none' | 'es5' | 'all';
}

/**
 * Generates formatted JSX code from component blueprints
 */
export class JSXGenerator {
  private astBuilder: ASTBuilder;
  private defaultOptions: PrettierOptions;

  constructor() {
    this.astBuilder = new ASTBuilder();
    this.defaultOptions = {
      semi: true,
      singleQuote: false,
      tabWidth: 2,
      printWidth: 80,
      trailingComma: 'es5',
    };
  }

  /**
   * Generate formatted JSX code from blueprint
   *
   * @param blueprint - Component blueprint
   * @returns Formatted JSX code string
   */
  async generate(blueprint: ComponentBlueprint): Promise<string> {
    return this.generateWithOptions(blueprint, this.defaultOptions);
  }

  /**
   * Generate formatted JSX code with custom Prettier options
   *
   * @param blueprint - Component blueprint
   * @param options - Custom Prettier options
   * @returns Formatted JSX code string
   */
  async generateWithOptions(
    blueprint: ComponentBlueprint,
    options: PrettierOptions
  ): Promise<string> {
    // Step 1: Build AST
    const ast = this.astBuilder.buildComponentAST(blueprint);

    // Step 2: Generate raw code from AST
    const rawCode = generate(ast, {
      retainLines: false,
      compact: false,
    }).code;

    // Step 3: Format with Prettier
    const formatted = await prettier.format(rawCode, {
      parser: 'typescript',
      semi: options.semi ?? this.defaultOptions.semi,
      singleQuote: options.singleQuote ?? this.defaultOptions.singleQuote,
      tabWidth: options.tabWidth ?? this.defaultOptions.tabWidth,
      printWidth: options.printWidth ?? this.defaultOptions.printWidth,
      trailingComma: options.trailingComma ?? this.defaultOptions.trailingComma,
    });

    return formatted;
  }
}
