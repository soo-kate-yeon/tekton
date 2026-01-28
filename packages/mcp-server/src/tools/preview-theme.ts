/**
 * Preview Theme MCP Tool (v2.1)
 * SPEC-MCP-002: E-002 Theme Preview Request
 * Updated for v2.1 theme schema
 */

import { loadTheme, listThemes } from '@tekton/core';
import type { PreviewThemeInput, PreviewThemeOutput } from '../schemas/mcp-schemas.js';
import { createThemeNotFoundError, extractErrorMessage } from '../utils/error-handler.js';

/**
 * Preview theme MCP tool implementation
 * SPEC: E-002 Theme Preview Request
 *
 * @param input - Theme ID to preview
 * @returns Full v2.1 theme data (MCP JSON-RPC format)
 */
export async function previewThemeTool(input: PreviewThemeInput): Promise<PreviewThemeOutput> {
  try {
    // SPEC: U-003 @tekton/core Integration - Use loadTheme from @tekton/core
    const theme = loadTheme(input.themeId);

    if (!theme) {
      // SPEC: S-002 Theme Availability Check - Provide helpful error with available themes
      const availableThemes = listThemes().map((t: { id: string }) => t.id);
      return createThemeNotFoundError(input.themeId, availableThemes);
    }

    // Return full v2.1 theme data
    return {
      success: true,
      theme: {
        id: theme.id,
        name: theme.name,
        description: theme.description,
        brandTone: theme.brandTone,
        schemaVersion: theme.schemaVersion,
        designDNA: theme.designDNA,
        tokens: {
          atomic: theme.tokens.atomic,
          semantic: theme.tokens.semantic,
          component: theme.tokens.component,
        },
        stateLayer: theme.stateLayer,
        motion: theme.motion,
        elevation: theme.elevation,
        typography: theme.typography,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error),
    };
  }
}
