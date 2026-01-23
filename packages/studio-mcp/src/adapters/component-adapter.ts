/**
 * ComponentAdapter
 * Wraps @tekton/component-generator to isolate coupling
 *
 * Benefits:
 * - Stable API even if JSXGenerator changes
 * - Easy to mock for testing
 * - Single place to handle generation errors
 */

import { JSXGenerator, type BlueprintResult, type GenerationResult } from '@tekton/component-generator';

export interface GenerateCodeOptions {
  themeId?: string;
  outputPath?: string;
}

export interface GenerateCodeResult {
  success: boolean;
  code?: string;
  error?: string;
  errorCode?: string;
}

export class ComponentAdapter {
  private generator: JSXGenerator;

  constructor() {
    this.generator = new JSXGenerator();
  }

  /**
   * Generate TypeScript code from blueprint
   * Handles all error cases and returns unified result
   */
  async generateCode(
    blueprint: BlueprintResult,
    options?: GenerateCodeOptions
  ): Promise<GenerateCodeResult> {
    try {
      // Apply theme if specified
      const blueprintWithTheme = {
        ...blueprint,
        themeId: options?.themeId || blueprint.themeId || 'calm-wellness',
      };

      // Generate code
      const result: GenerationResult = await this.generator.generate(blueprintWithTheme);

      if (!result.success || !result.code) {
        return {
          success: false,
          error: result.errors?.join(', ') || 'Code generation failed',
          errorCode: 'GENERATION_FAILED',
        };
      }

      return {
        success: true,
        code: result.code,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorCode: 'UNEXPECTED_ERROR',
      };
    }
  }

  /**
   * Validate blueprint structure without generating code
   */
  validateBlueprint(blueprint: BlueprintResult): boolean {
    return Boolean(
      blueprint.blueprintId &&
      blueprint.recipeName &&
      blueprint.structure
    );
  }
}
