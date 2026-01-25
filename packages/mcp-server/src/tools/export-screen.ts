/**
 * Export Screen MCP Tool
 * SPEC-MCP-002: E-003 Screen Export Request
 */

import { render } from '@tekton/core';
import type { Blueprint } from '@tekton/core';
import type { ExportScreenInput, ExportScreenOutput } from '../schemas/mcp-schemas.js';
import { createErrorResponse, extractErrorMessage } from '../utils/error-handler.js';

/**
 * Convert JSX code to TSX format with TypeScript annotations
 * SPEC: S-004 Export Format Compatibility - TSX format
 */
function convertToTSX(jsxCode: string): string {
  // Add React import and type annotation to function signature
  const lines = jsxCode.split('\n');
  const result: string[] = [];

  // Add React import at the beginning
  result.push("import React from 'react';");

  for (const line of lines) {
    // Convert function signature to include React.ReactElement return type
    if (line.match(/^export default function \w+\(\)/)) {
      result.push(line.replace('()', '(): React.ReactElement'));
    } else {
      result.push(line);
    }
  }

  return result.join('\n');
}

/**
 * Convert JSX code to Vue 3 SFC format
 * SPEC: S-004 Export Format Compatibility - Vue format
 */
function convertToVue(jsxCode: string, componentName: string): string {
  // Extract the JSX content from the return statement
  const returnMatch = jsxCode.match(/return \(([\s\S]*?)\);/);
  if (!returnMatch || !returnMatch[1]) {
    return jsxCode; // Fallback to original if pattern doesn't match
  }

  const jsxContent = returnMatch[1].trim();

  // Convert React-style JSX to Vue template syntax
  const vueTemplate = jsxContent
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
 * @param input - Blueprint object and export format
 * @returns Generated code (MCP JSON-RPC format - no file write, no filePath)
 */
export async function exportScreenTool(
  input: ExportScreenInput
): Promise<ExportScreenOutput> {
  try {
    // MCP JSON-RPC format: Accept blueprint object directly (no storage lookup)
    const blueprint = input.blueprint as Blueprint;

    if (!blueprint) {
      return createErrorResponse('Blueprint object is required');
    }

    // SPEC: U-003 @tekton/core Integration - Use render from @tekton/core
    // Note: render() returns complete JSX component code with imports and function wrapper
    const renderResult = render(blueprint);

    if (!renderResult.success) {
      return createErrorResponse(`Render failed: ${renderResult.error || 'Unknown error'}`);
    }

    const jsxCode = renderResult.code || '';

    // SPEC: S-004 Export Format Compatibility - Convert JSX to requested format
    let finalCode: string;

    switch (input.format) {
      case 'jsx':
        // render() already returns JSX format
        finalCode = jsxCode;
        break;
      case 'tsx':
        // Convert JSX imports to TypeScript format
        finalCode = jsxCode ? convertToTSX(jsxCode) : '';
        break;
      case 'vue':
        // Convert JSX to Vue SFC format
        finalCode = convertToVue(jsxCode, extractComponentName(blueprint.name || 'Component'));
        break;
      default:
        return createErrorResponse(`Unsupported format: ${input.format}`);
    }

    // MCP JSON-RPC format: Return code only (no file write, no filePath)
    return {
      success: true,
      code: finalCode
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error)
    };
  }
}
