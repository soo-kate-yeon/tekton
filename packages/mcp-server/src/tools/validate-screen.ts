/**
 * Validate Screen MCP Tool
 * SPEC-LAYOUT-002 Phase 4: Validate JSON screen definition with helpful feedback
 */

import type {
  ValidateScreenInput,
  ValidateScreenOutput,
  ValidationSuggestion,
} from '../schemas/mcp-schemas.js';
import { extractErrorMessage } from '../utils/error-handler.js';

/**
 * Generate helpful suggestions for common validation errors
 *
 * @param errors - Validation error messages
 * @returns Array of suggestions
 */
function generateSuggestions(errors: string[]): ValidationSuggestion[] {
  const suggestions: ValidationSuggestion[] = [];

  for (const error of errors) {
    const lowerError = error.toLowerCase();

    // Suggestion for shell token errors
    if (lowerError.includes('shell') && lowerError.includes('token')) {
      suggestions.push({
        field: 'shell',
        message: error,
        suggestion:
          'Shell token must match pattern: shell.{platform}.{name} (e.g., shell.web.dashboard)',
      });
    }

    // Suggestion for page token errors
    if (lowerError.includes('page') && lowerError.includes('token')) {
      suggestions.push({
        field: 'page',
        message: error,
        suggestion: 'Page token must match pattern: page.{name} (e.g., page.dashboard)',
      });
    }

    // Suggestion for section token errors
    if (lowerError.includes('section') && lowerError.includes('token')) {
      suggestions.push({
        field: 'sections',
        message: error,
        suggestion:
          'Section token must match pattern: section.{name} (e.g., section.grid-4, section.hero)',
      });
    }

    // Suggestion for component type errors
    if (lowerError.includes('component') && lowerError.includes('type')) {
      suggestions.push({
        field: 'components',
        message: error,
        suggestion:
          'Component type must be one of: Button, Input, Text, Heading, Card, Modal, etc. See @tekton/core COMPONENT_CATALOG',
      });
    }

    // Suggestion for missing required fields
    if (lowerError.includes('required')) {
      const fieldMatch = error.match(/'([^']+)'/);
      const field = fieldMatch?.[1] || 'unknown';
      suggestions.push({
        field,
        message: error,
        suggestion: `The '${field}' field is required in the screen definition`,
      });
    }
  }

  return suggestions;
}

/**
 * Validate JSON screen definition with helpful feedback
 *
 * @param input - Screen definition and validation options
 * @returns Validation result with errors, warnings, and suggestions
 */
export async function validateScreenTool(
  input: ValidateScreenInput
): Promise<ValidateScreenOutput> {
  try {
    const { screenDefinition, strictMode = false } = input;

    // Import validation from @tekton/core
    const { validateScreenDefinition } = await import('@tekton/core');

    // Run validation
    const validation = validateScreenDefinition(screenDefinition);

    // Separate errors and warnings (if strict mode is off, some errors become warnings)
    const errors: string[] = [];
    const warnings: string[] = [];

    if (validation.errors) {
      for (const error of validation.errors) {
        // In non-strict mode, certain errors are treated as warnings
        if (!strictMode && error.toLowerCase().includes('optional')) {
          warnings.push(error);
        } else {
          errors.push(error);
        }
      }
    }

    // Generate helpful suggestions
    const suggestions = generateSuggestions(errors);

    const result: ValidateScreenOutput = {
      success: true,
      valid: validation.valid,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    };

    return result;
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error),
    };
  }
}
