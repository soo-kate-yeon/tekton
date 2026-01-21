/**
 * Layer 3 MCP Tools
 * Knowledge Schema and Component Generation
 * SPEC-LAYER3-MVP-001 M2
 */

import {
  JSXGenerator,
  BlueprintResultSchema,
  type BlueprintResult,
} from '@tekton/component-generator';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';

/**
 * Component knowledge lightweight format for listing
 */
interface ComponentLightweight {
  name: string;
  description: string;
  category?: string;
  slots?: string[];
  props?: string[];
}

/**
 * Filter criteria for component list
 */
export interface ComponentFilter {
  category?: string;
  hasSlot?: string;
}

/**
 * Get Knowledge Schema for LLM consumption
 * TASK-007: MCP Tool - get-knowledge-schema
 *
 * Returns the Blueprint JSON Schema and component knowledge format
 * for AI assistants to understand how to structure component blueprints
 */
export function getKnowledgeSchema(): {
  success: boolean;
  schema: typeof BlueprintResultSchema;
  usage: {
    example: BlueprintResult;
    instructions: string;
  };
} {
  // Example Blueprint showing correct structure
  const exampleBlueprint: BlueprintResult = {
    blueprintId: 'example-001',
    recipeName: 'user-profile',
    analysis: {
      intent: 'Display user profile with avatar and bio',
      tone: 'professional',
    },
    structure: {
      componentName: 'Card',
      props: {
        variant: 'elevated',
        padding: 'large',
      },
      slots: {
        header: {
          componentName: 'Avatar',
          props: {
            size: 'large',
            src: '{{user.avatar}}',
          },
        },
        content: {
          componentName: 'Typography',
          props: {
            variant: 'body1',
            text: '{{user.bio}}',
          },
        },
      },
    },
  };

  return {
    success: true,
    schema: BlueprintResultSchema,
    usage: {
      example: exampleBlueprint,
      instructions: `Use this schema to design component layouts with proper structure:

1. blueprintId: Unique identifier (use timestamp or UUID)
2. recipeName: Descriptive name for the screen/component
3. analysis: User intent and tone analysis
4. structure: Component tree with componentName, props, and optional slots

Components can be nested using slots. Each slot can contain:
- Single component: { componentName, props, slots? }
- Array of components: [{ componentName, props, slots? }, ...]

Available component categories:
- Layout: Card, Container, Stack, Grid
- Content: Typography, Image, Icon
- Input: TextField, Button, Checkbox
- Navigation: Link, Menu, Tabs
`,
    },
  };
}

/**
 * Get component list with optional filters
 * TASK-008: MCP Tool - get-component-list
 *
 * Queries available components from the catalog with lightweight data
 */
export function getComponentList(filter?: ComponentFilter): {
  success: boolean;
  components: ComponentLightweight[];
  count: number;
} {
  // Build component catalog from known components
  // This is a static catalog for MVP; future versions would query from registry
  const components: ComponentLightweight[] = [];
  const knownComponents: ComponentLightweight[] = [
    {
      name: 'Card',
      description: 'Container component with elevation and padding',
      category: 'layout',
      slots: ['header', 'content', 'footer', 'actions'],
      props: ['variant', 'elevation', 'padding'],
    },
    {
      name: 'Button',
      description: 'Interactive button component',
      category: 'action',
      slots: ['icon', 'label'],
      props: ['variant', 'size', 'disabled', 'onClick'],
    },
    {
      name: 'Typography',
      description: 'Text display component',
      category: 'content',
      props: ['variant', 'text', 'color', 'align'],
    },
    {
      name: 'Avatar',
      description: 'User avatar/profile image',
      category: 'content',
      props: ['size', 'src', 'alt', 'fallback'],
    },
    {
      name: 'Container',
      description: 'Layout container',
      category: 'layout',
      slots: ['children'],
      props: ['maxWidth', 'padding', 'centered'],
    },
    {
      name: 'Stack',
      description: 'Vertical or horizontal stack layout',
      category: 'layout',
      slots: ['children'],
      props: ['direction', 'spacing', 'align'],
    },
    {
      name: 'TextField',
      description: 'Text input field',
      category: 'input',
      slots: ['label', 'helper', 'error'],
      props: ['value', 'placeholder', 'type', 'disabled'],
    },
    {
      name: 'Link',
      description: 'Navigation link',
      category: 'navigation',
      slots: ['children'],
      props: ['href', 'target', 'underline'],
    },
  ];

  // Apply filters
  let filtered = knownComponents;

  if (filter?.category) {
    filtered = filtered.filter((c) => c.category === filter.category);
  }

  if (filter?.hasSlot) {
    filtered = filtered.filter((c) => c.slots?.includes(filter.hasSlot));
  }

  return {
    success: true,
    components: filtered,
    count: filtered.length,
  };
}

/**
 * Options for renderScreen function
 * TASK-006: SPEC-THEME-BIND-001
 *
 * @property outputPath - Optional output file path for generated component
 * @property themeId - Optional theme ID to apply during code generation
 */
export interface RenderScreenOptions {
  /** Output file path for generated component */
  outputPath?: string;
  /** Theme ID to apply during code generation */
  themeId?: string;
}

/**
 * Render screen from Blueprint JSON
 * TASK-009: MCP Tool - render-screen
 * TASK-006: Added theme support via options
 *
 * Generates React component file from Blueprint JSON with theme support.
 * Theme priority: options.themeId > blueprint.themeId > 'calm-wellness' (default)
 *
 * @param blueprint - Blueprint result containing component structure
 * @param options - Output path (string for backward compatibility) or options object
 * @returns Promise resolving to generation result with success status, file path, code, and applied theme
 *
 * @example
 * // Using default theme
 * const result = await renderScreen(blueprint);
 *
 * @example
 * // With custom theme
 * const result = await renderScreen(blueprint, {
 *   outputPath: 'src/components/MyScreen.tsx',
 *   themeId: 'energetic-bright'
 * });
 *
 * @example
 * // Backward compatible string path
 * const result = await renderScreen(blueprint, 'src/components/MyScreen.tsx');
 */
export async function renderScreen(
  blueprint: BlueprintResult,
  options?: string | RenderScreenOptions
): Promise<{
  success: boolean;
  filePath?: string;
  code?: string;
  error?: string;
  errorCode?: string;
  themeApplied?: string;
}> {
  try {
    // Step 0: Parse options (backward compatibility)
    const parsedOptions: RenderScreenOptions =
      typeof options === 'string' ? { outputPath: options } : options || {};

    // Step 1: Validate blueprint structure
    if (!blueprint.blueprintId || !blueprint.recipeName || !blueprint.structure) {
      return {
        success: false,
        error: 'Invalid blueprint: missing required fields',
        errorCode: 'INVALID_BLUEPRINT',
      };
    }

    // Step 2: Determine effective theme (priority: options > blueprint > default)
    const themeId =
      parsedOptions.themeId || blueprint.themeId || 'calm-wellness';

    // Step 3: Generate code using JSXGenerator with theme context
    const generator = new JSXGenerator();
    const result = await generator.generate(blueprint, { themeId });

    if (!result.success || !result.code) {
      return {
        success: false,
        error: result.errors?.join(', ') || 'Failed to generate code',
        errorCode: 'GENERATION_FAILED',
      };
    }

    // Step 4: Determine output path
    const finalPath =
      parsedOptions.outputPath || `src/app/${blueprint.recipeName}/page.tsx`;

    // Step 5: Write to file system
    try {
      // Ensure directory exists
      const dirPath = dirname(finalPath);
      await mkdir(dirPath, { recursive: true });

      // Write file
      await writeFile(finalPath, result.code, 'utf-8');

      return {
        success: true,
        filePath: finalPath,
        code: result.code,
        themeApplied: themeId,
      };
    } catch (fileError) {
      return {
        success: false,
        error: `Failed to write file: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`,
        errorCode: 'FILE_WRITE_ERROR',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      errorCode: 'UNEXPECTED_ERROR',
    };
  }
}
