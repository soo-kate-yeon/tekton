/**
 * Export Screen MCP Tool
 * SPEC-MCP-002: E-003 Screen Export Request
 */

import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { render } from '@tekton/core';
import type { ExportScreenInput, ExportScreenOutput } from '../schemas/mcp-schemas.js';
import { getDefaultStorage } from '../storage/blueprint-storage.js';
import { createErrorResponse, extractErrorMessage } from '../utils/error-handler.js';

/**
 * Generate JSX code from blueprint
 * SPEC: S-004 Export Format Compatibility - JSX format
 */
function generateJSX(componentCode: string, componentName: string): string {
  return `export default function ${componentName}() {
  return (
${componentCode.split('\n').map(line => '    ' + line).join('\n')}
  );
}
`;
}

/**
 * Generate TSX code from blueprint
 * SPEC: S-004 Export Format Compatibility - TSX format with TypeScript annotations
 */
function generateTSX(componentCode: string, componentName: string): string {
  return `import React from 'react';

export default function ${componentName}(): React.ReactElement {
  return (
${componentCode.split('\n').map(line => '    ' + line).join('\n')}
  );
}
`;
}

/**
 * Generate Vue 3 Composition API code from blueprint
 * SPEC: S-004 Export Format Compatibility - Vue format
 */
function generateVue(componentCode: string, componentName: string): string {
  // Convert React-style JSX to Vue template syntax
  const vueTemplate = componentCode
    .replace(/className=/g, 'class=')
    .replace(/{([^}]+)}/g, '{{ $1 }}'); // Convert interpolation

  return `<template>
${vueTemplate.split('\n').map(line => '  ' + line).join('\n')}
</template>

<script setup lang="ts">
// ${componentName} component
</script>

<style scoped>
/* Component styles */
</style>
`;
}

/**
 * Extract component name from blueprint name or use default
 */
function extractComponentName(blueprintName: string): string {
  // Convert to PascalCase and remove special characters
  const cleaned = blueprintName
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  return cleaned || 'GeneratedComponent';
}

/**
 * Export screen MCP tool implementation
 * SPEC: E-003 Screen Export Request
 *
 * @param input - Blueprint ID and export format
 * @returns Generated code and file path
 */
export async function exportScreenTool(
  input: ExportScreenInput
): Promise<ExportScreenOutput> {
  try {
    // Load blueprint from storage
    const storage = getDefaultStorage();
    const blueprint = await storage.loadBlueprint(input.blueprintId);

    if (!blueprint) {
      return createErrorResponse(`Blueprint not found: ${input.blueprintId}`);
    }

    // SPEC: U-003 @tekton/core Integration - Use render from @tekton/core
    const renderResult = render(blueprint);

    if (!renderResult.success) {
      return createErrorResponse(`Render failed: ${renderResult.error || 'Unknown error'}`);
    }

    const componentCode = renderResult.code || '';
    const componentName = extractComponentName(blueprint.name);

    // SPEC: S-004 Export Format Compatibility - Generate format-specific code
    let finalCode: string;

    switch (input.format) {
      case 'jsx':
        finalCode = generateJSX(componentCode, componentName);
        break;
      case 'tsx':
        finalCode = generateTSX(componentCode, componentName);
        break;
      case 'vue':
        finalCode = generateVue(componentCode, componentName);
        break;
      default:
        return createErrorResponse(`Unsupported format: ${input.format}`);
    }

    // Save to file if outputPath provided
    let filePath: string | undefined;
    if (input.outputPath) {
      try {
        // Ensure directory exists
        const dir = dirname(input.outputPath);
        mkdirSync(dir, { recursive: true });

        // Write file
        writeFileSync(input.outputPath, finalCode, 'utf-8');
        filePath = input.outputPath;
      } catch (error) {
        return createErrorResponse(`Failed to write file: ${extractErrorMessage(error)}`);
      }
    }

    return {
      success: true,
      code: finalCode,
      filePath
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error)
    };
  }
}
