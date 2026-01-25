/**
 * Preview Theme MCP Tool
 * SPEC-MCP-002: E-002 Theme Preview Request
 */

import { loadTheme, generateCSSVariables, listThemes } from '@tekton/core';
import type { PreviewThemeInput, PreviewThemeOutput } from '../schemas/mcp-schemas.js';
import { createThemeNotFoundError, extractErrorMessage } from '../utils/error-handler.js';

/**
 * Preview theme configuration
 */
export interface PreviewThemeConfig {
  baseUrl: string; // Default: http://localhost:3000
}

const DEFAULT_CONFIG: PreviewThemeConfig = {
  baseUrl: 'http://localhost:3000'
};

/**
 * Preview theme MCP tool implementation
 * SPEC: E-002 Theme Preview Request
 *
 * @param input - Theme ID to preview
 * @param config - Preview configuration
 * @returns Theme metadata with preview URL and CSS variables
 */
export async function previewThemeTool(
  input: PreviewThemeInput,
  config: Partial<PreviewThemeConfig> = {}
): Promise<PreviewThemeOutput> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

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

    // Generate timestamp for preview URL
    const timestamp = Date.now();

    // SPEC: E-002 Theme Preview Request - Generate preview URL
    const previewUrl = `${finalConfig.baseUrl}/preview/${timestamp}/${input.themeId}`;

    return {
      success: true,
      theme: {
        id: theme.id,
        name: theme.name,
        description: theme.description,
        cssVariables
      },
      previewUrl
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error)
    };
  }
}
