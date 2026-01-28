/**
 * Generate Screen MCP Tool
 * SPEC-LAYOUT-002 Phase 4: Generate production code from JSON screen definition
 */

import type { ScreenDefinition } from '@tekton/core';
import type { GenerateScreenInput, GenerateScreenOutput } from '../schemas/mcp-schemas.js';
import { extractErrorMessage } from '../utils/error-handler.js';

/**
 * Generate production-ready code from JSON screen definition
 *
 * @param input - Screen definition and generation options
 * @returns Generated code with CSS variables and validation errors
 */
export async function generateScreenTool(
  input: GenerateScreenInput
): Promise<GenerateScreenOutput> {
  try {
    const { screenDefinition, outputFormat, options } = input;

    // Step 1: Validate screen definition
    const { validateScreenDefinition } = await import('@tekton/core');
    const validation = validateScreenDefinition(screenDefinition);

    if (!validation.valid) {
      return {
        success: false,
        errors: validation.errors || ['Invalid screen definition'],
        error: 'Screen definition validation failed',
      };
    }

    // Step 2: Resolve screen with layout and components
    const { resolveScreen } = await import('@tekton/core');
    const resolvedScreen = await resolveScreen(screenDefinition as ScreenDefinition);

    // Step 3: Prepare generator options
    const generatorOptions = {
      format: (options?.typescript !== false ? 'typescript' : 'javascript') as
        | 'typescript'
        | 'javascript',
      prettier: options?.prettier ?? false,
    };

    // Step 4: Generate code based on output format
    let code: string;
    const cssVariables: string | undefined = undefined;

    switch (outputFormat) {
      case 'css-in-js': {
        const { generateStyledComponents } = await import('@tekton/core');
        const cssFramework =
          (options?.cssFramework as 'styled-components' | 'emotion') || 'styled-components';
        const result = generateStyledComponents(resolvedScreen, cssFramework, generatorOptions);
        code = result.code;
        break;
      }

      case 'tailwind': {
        const { generateTailwindClasses } = await import('@tekton/core');
        const result = generateTailwindClasses(resolvedScreen, generatorOptions);
        code = result.code;
        break;
      }

      case 'react': {
        const { generateReactComponent } = await import('@tekton/core');
        const result = generateReactComponent(resolvedScreen, generatorOptions);
        code = result.code;
        break;
      }

      default:
        return {
          success: false,
          error: `Unsupported output format: ${outputFormat}`,
        };
    }

    // Note: CSS variables generation is optional and depends on theme resolution
    // For now, we return the generated code without separate CSS variables
    // Future enhancement: Extract CSS variables from resolved screen

    return {
      success: true,
      code,
      cssVariables,
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error),
    };
  }
}
