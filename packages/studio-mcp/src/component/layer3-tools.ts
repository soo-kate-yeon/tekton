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
import {
  COMPONENT_CATALOG,
  type ComponentKnowledge,
} from '@tekton/component-knowledge';
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
  // Use actual catalog instead of hardcoded list
  let filtered = COMPONENT_CATALOG.map((comp: ComponentKnowledge) => ({
    name: comp.name,
    description: comp.semanticDescription.purpose,
    category: comp.category,
    props: Object.keys(comp.tokenBindings.states.default),
    slots: comp.slotAffinity ? Object.keys(comp.slotAffinity) : undefined,
  }));

  if (filter?.category) {
    filtered = filtered.filter((c) => c.category === filter.category);
  }

  if (filter?.hasSlot) {
    const targetSlot = filter.hasSlot;
    filtered = filtered.filter((c) => c.slots?.includes(targetSlot));
  }

  return {
    success: true,
    components: filtered,
    count: filtered.length,
  };
}

/**
 * Render screen from Blueprint JSON
 * TASK-009: MCP Tool - render-screen
 *
 * Generates React component file from Blueprint JSON
 */
export async function renderScreen(
  blueprint: BlueprintResult,
  outputPath?: string
): Promise<{
  success: boolean;
  filePath?: string;
  code?: string;
  error?: string;
  errorCode?: string;
}> {
  try {
    // Step 1: Validate blueprint structure
    if (!blueprint.blueprintId || !blueprint.recipeName || !blueprint.structure) {
      return {
        success: false,
        error: 'Invalid blueprint: missing required fields',
        errorCode: 'INVALID_BLUEPRINT',
      };
    }

    // Step 2: Generate code using JSXGenerator
    const generator = new JSXGenerator();
    const result = await generator.generate(blueprint);

    if (!result.success || !result.code) {
      return {
        success: false,
        error: result.errors?.join(', ') || 'Failed to generate code',
        errorCode: 'GENERATION_FAILED',
      };
    }

    // Step 3: Determine output path
    const finalPath =
      outputPath || `src/app/${blueprint.recipeName}/page.tsx`;

    // Step 4: Write to file system
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
