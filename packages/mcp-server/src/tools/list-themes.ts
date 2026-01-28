/**
 * List Themes MCP Tool (v2.1)
 * Lists all available themes from .moai/themes/generated/
 */

import { listThemes } from '@tekton/core';
import type { ListThemesOutput } from '../schemas/mcp-schemas.js';
import { extractErrorMessage } from '../utils/error-handler.js';

/**
 * List all available themes
 * @returns Array of theme metadata from .moai/themes/generated/
 */
export async function listThemesTool(): Promise<ListThemesOutput> {
  try {
    // Get all themes from @tekton/core (v2.1 loader)
    const themes = listThemes();

    return {
      success: true,
      themes: themes.map(theme => ({
        id: theme.id,
        name: theme.name,
        description: theme.description,
        brandTone: theme.brandTone,
        schemaVersion: theme.schemaVersion,
      })),
      count: themes.length,
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error),
    };
  }
}
