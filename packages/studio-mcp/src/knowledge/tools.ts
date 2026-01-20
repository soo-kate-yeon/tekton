/**
 * Knowledge Tools
 * TASK-007, TASK-008, TASK-009: MCP tools for component knowledge and rendering
 */

import type { MCPTool } from '../server/standalone-tools.js';
import type {
  KnowledgeSchema,
  ComponentBlueprint,
  ComponentCategory,
} from '@tekton/component-generator';
import {
  ComponentValidator,
  JSXGenerator,
} from '@tekton/component-generator';
import { SAMPLE_KNOWLEDGE_SCHEMA } from './sample-schema.js';

/**
 * Knowledge tools for MCP
 */
export const KNOWLEDGE_TOOLS: MCPTool[] = [
  {
    name: 'knowledge.get-schema',
    description:
      'Get the complete component knowledge schema. Returns all available components with their slots, props, and metadata for AI-driven component selection.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'knowledge.get-component-list',
    description:
      'Get a list of available components. Optionally filter by category (action, layout, input, feedback, data-display, navigation).',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by component category',
          enum: ['action', 'layout', 'input', 'feedback', 'data-display', 'navigation'],
        },
      },
      required: [],
    },
  },
  {
    name: 'knowledge.render-screen',
    description:
      'Render a component blueprint to JSX code. Validates the blueprint and generates formatted TypeScript React component code.',
    inputSchema: {
      type: 'object',
      properties: {
        blueprint: {
          type: 'object',
          description: 'Component blueprint with componentName, slotMappings, and propMappings',
        },
      },
      required: ['blueprint'],
    },
  },
];

/**
 * Get the complete knowledge schema
 * TASK-007: get-knowledge-schema tool implementation
 */
export function getKnowledgeSchema(): KnowledgeSchema {
  return SAMPLE_KNOWLEDGE_SCHEMA;
}

/**
 * Get component list options
 */
export interface GetComponentListOptions {
  category?: ComponentCategory;
}

/**
 * Get list of component names
 * TASK-008: get-component-list tool implementation
 */
export function getComponentList(options?: GetComponentListOptions): string[] {
  const schema = SAMPLE_KNOWLEDGE_SCHEMA;

  if (options?.category) {
    return schema.components
      .filter((comp) => comp.category === options.category)
      .map((comp) => comp.componentName);
  }

  return schema.components.map((comp) => comp.componentName);
}

/**
 * Render screen input
 */
export interface RenderScreenInput {
  blueprint: ComponentBlueprint;
}

/**
 * Render screen result
 */
export interface RenderScreenResult {
  success: boolean;
  code?: string;
  errors?: Array<{ type: string; message: string; field?: string }>;
}

/**
 * Render a component blueprint to JSX code
 * TASK-009: render-screen tool implementation
 */
export async function renderScreen(input: RenderScreenInput): Promise<RenderScreenResult> {
  const { blueprint } = input;

  // Step 1: Validate blueprint
  const validator = new ComponentValidator(SAMPLE_KNOWLEDGE_SCHEMA);
  const validationResult = validator.validateBlueprint(blueprint);

  if (!validationResult.isValid) {
    return {
      success: false,
      errors: validationResult.errors,
    };
  }

  // Step 2: Generate JSX code
  try {
    const generator = new JSXGenerator();
    const code = await generator.generate(blueprint);

    return {
      success: true,
      code,
    };
  } catch (error) {
    return {
      success: false,
      errors: [
        {
          type: 'generation_error',
          message: error instanceof Error ? error.message : 'Failed to generate code',
        },
      ],
    };
  }
}
