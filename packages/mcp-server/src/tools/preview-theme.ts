/**
 * Preview Theme MCP Tool
 * SPEC-MCP-002: E-002 Theme Preview Request
 */

import { loadTheme, generateCSSVariables, listThemes } from '@tekton/core';
import type { PreviewThemeInput, PreviewThemeOutput } from '../schemas/mcp-schemas.js';
import { createThemeNotFoundError, extractErrorMessage } from '../utils/error-handler.js';

/**
 * Preview theme MCP tool implementation
 * SPEC: E-002 Theme Preview Request
 *
 * @param input - Theme ID to preview
 * @returns Theme metadata with CSS variables (MCP JSON-RPC format - no preview URL)
 */
export async function previewThemeTool(
  input: PreviewThemeInput
): Promise<PreviewThemeOutput> {
  try {
    // SPEC: U-003 @tekton/core Integration - Use loadTheme from @tekton/core
    const theme = loadTheme(input.themeId);

    if (!theme) {
      // SPEC: S-002 Theme Availability Check - Provide helpful error with available themes
      const availableThemes = listThemes().map(t => t.id);
      return createThemeNotFoundError(input.themeId, availableThemes);
    }

    // SPEC: U-003 @tekton/core Integration - Use generateCSSVariables from @tekton/core
    const cssVariables = generateCSSVariables(theme);

    // MCP JSON-RPC format: Return theme data only (no preview URL)
    return {
      success: true,
      theme: {
        id: theme.id,
        name: theme.name,
        description: theme.description,
        cssVariables
      }
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error)
    };
  }
}
