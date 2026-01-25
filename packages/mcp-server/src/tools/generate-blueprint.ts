/**
 * Generate Blueprint MCP Tool
 * SPEC-MCP-002: E-001 Blueprint Generation Request
 */

import {
  createBlueprint,
  validateBlueprint,
  loadTheme,
  listThemes,
  COMPONENT_CATALOG
} from '@tekton/core';
import type { ComponentNode } from '@tekton/core';
import type { GenerateBlueprintInput, GenerateBlueprintOutput } from '../schemas/mcp-schemas.js';
import { getDefaultStorage } from '../storage/blueprint-storage.js';
import { createThemeNotFoundError, createValidationError, extractErrorMessage } from '../utils/error-handler.js';

/**
 * Generate blueprint configuration
 */
export interface GenerateBlueprintConfig {
  baseUrl: string; // Default: http://localhost:3000
}

const DEFAULT_CONFIG: GenerateBlueprintConfig = {
  baseUrl: 'http://localhost:3000'
};

/**
 * Parse natural language description to extract component hints
 * Initial implementation: Simple keyword extraction
 * TODO: Enhance with LLM-based parsing in future iterations
 */
function parseDescriptionToComponents(
  description: string,
  componentHints?: string[]
): ComponentNode[] {
  const lowerDesc = description.toLowerCase();
  const components: ComponentNode[] = [];

  // If component hints provided, use them first
  if (componentHints && componentHints.length > 0) {
    for (const hint of componentHints) {
      if (COMPONENT_CATALOG.includes(hint as any)) {
        components.push({
          type: hint as any,
          slot: 'main',
          children: []
        });
      }
    }
  }

  // Keyword-based component detection (fallback)
  if (components.length === 0) {
    const componentKeywords: Record<string, string[]> = {
      'Card': ['card', 'panel', 'container'],
      'Button': ['button', 'cta', 'action'],
      'Avatar': ['avatar', 'profile picture', 'user icon'],
      'Text': ['text', 'paragraph', 'description', 'bio'],
      'Heading': ['title', 'heading', 'header'],
      'Input': ['input', 'field', 'textbox'],
      'Form': ['form', 'signup', 'login'],
      'Image': ['image', 'photo', 'picture'],
      'Link': ['link', 'anchor'],
      'List': ['list', 'items'],
      'Table': ['table', 'grid', 'data'],
      'Modal': ['modal', 'dialog', 'popup'],
      'Tabs': ['tabs', 'tabbed'],
      'Badge': ['badge', 'tag', 'label'],
      'Dropdown': ['dropdown', 'select', 'menu']
    };

    for (const [componentType, keywords] of Object.entries(componentKeywords)) {
      if (keywords.some(kw => lowerDesc.includes(kw))) {
        components.push({
          type: componentType,
          slot: 'main',
          children: []
        });
      }
    }
  }

  // Default: Add at least one Card if no components detected
  if (components.length === 0) {
    components.push({
      type: 'Card',
      slot: 'main',
      children: [
        {
          type: 'Text',
          children: ['Generated content']
        }
      ]
    });
  }

  return components;
}

/**
 * Extract screen name from description
 */
function extractNameFromDescription(description: string): string {
  // Simple implementation: Use first 50 chars or first sentence
  const firstSentence = description.split(/[.!?]/)[0];
  return firstSentence?.substring(0, 50) || 'Generated Screen';
}

/**
 * Generate blueprint MCP tool implementation
 * SPEC: E-001 Blueprint Generation Request
 *
 * @param input - Blueprint generation parameters
 * @param config - Generation configuration
 * @returns Generated blueprint with preview URL
 */
export async function generateBlueprintTool(
  input: GenerateBlueprintInput,
  config: Partial<GenerateBlueprintConfig> = {}
): Promise<GenerateBlueprintOutput> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  try {
    // SPEC: U-005 Theme Validation - Validate theme ID exists
    const theme = loadTheme(input.themeId);
    if (!theme) {
      const availableThemes = listThemes().map(t => t.id);
      return createThemeNotFoundError(input.themeId, availableThemes);
    }

    // Parse description to generate components
    const components = parseDescriptionToComponents(input.description, input.componentHints);

    // Extract name from description
    const name = extractNameFromDescription(input.description);

    // Generate timestamp for blueprint ID
    const timestamp = Date.now();

    // SPEC: U-003 @tekton/core Integration - Use createBlueprint from @tekton/core
    const blueprint = createBlueprint({
      name,
      themeId: input.themeId,
      layout: input.layout,
      components
    });

    // Add timestamp to blueprint
    const blueprintWithTimestamp = {
      ...blueprint,
      timestamp
    };

    // SPEC: U-003 @tekton/core Integration - Use validateBlueprint from @tekton/core
    const validation = validateBlueprint(blueprint);

    // SPEC: S-003 Blueprint Validation Result - Return errors without saving if invalid
    if (!validation.valid) {
      return createValidationError(validation.errors);
    }

    // SPEC: S-003 Blueprint Validation Result - Save blueprint if valid
    const storage = getDefaultStorage();
    const blueprintId = await storage.saveBlueprint(blueprintWithTimestamp);

    // SPEC: E-001 Blueprint Generation Request - Generate preview URL
    const previewUrl = `${finalConfig.baseUrl}/preview/${blueprintId}/${input.themeId}`;

    return {
      success: true,
      blueprint: {
        id: blueprintId,
        name: blueprint.name,
        themeId: blueprint.themeId,
        layout: blueprint.layout,
        components: blueprint.components,
        timestamp
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
