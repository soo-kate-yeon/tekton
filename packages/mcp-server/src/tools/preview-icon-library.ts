/**
 * MCP Tool: preview-icon-library
 * Preview a specific icon library and retrieve its full data
 * [SPEC-ICON-001]
 */

import { loadIconLibrary, iconLibraryExists } from '@tekton/core';
import type { PreviewIconLibraryInput, PreviewIconLibraryOutput } from '../schemas/mcp-schemas.js';
import { info, error as logError } from '../utils/logger.js';

/**
 * Preview an icon library and retrieve its full data
 * @param input - Library ID to preview
 * @returns Full icon library data
 */
export async function previewIconLibraryTool(
  input: PreviewIconLibraryInput
): Promise<PreviewIconLibraryOutput> {
  const { libraryId } = input;

  info(`preview-icon-library: Previewing library "${libraryId}"`);

  // Check if library exists
  if (!iconLibraryExists(libraryId)) {
    logError(`preview-icon-library: Library "${libraryId}" not found`);
    return {
      success: false,
      error: `Icon library "${libraryId}" not found. Use list-icon-libraries to see available libraries.`,
    };
  }

  try {
    const library = loadIconLibrary(libraryId);

    if (!library) {
      return {
        success: false,
        error: `Failed to load icon library "${libraryId}"`,
      };
    }

    // Get first 20 icons as sample
    const iconNames = Object.keys(library.icons);
    const iconSample = iconNames.slice(0, 20);

    info(`preview-icon-library: Successfully loaded library "${libraryId}"`);

    return {
      success: true,
      library: {
        id: library.id,
        name: library.name,
        description: library.description,
        version: library.version,
        license: library.license,
        website: library.website,
        totalIcons: library.totalIcons,
        categories: library.categories,
        sizeMapping: library.sizeMapping,
        frameworks: library.frameworks,
        defaultVariant: library.defaultVariant,
        iconSample,
      },
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logError(`preview-icon-library: Failed to preview library: ${errorMessage}`);
    return {
      success: false,
      error: `Failed to preview icon library: ${errorMessage}`,
    };
  }
}
