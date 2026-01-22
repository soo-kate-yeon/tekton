/**
 * Layer 3 Knowledge Schema Types
 * Defines the structure for component blueprints and generation
 * SPEC-LAYOUT-001 - Extended with layout support
 */

import { z } from 'zod';
import { blueprintLayoutSchema, type BlueprintLayout } from './layout-schema.js';

/**
 * Slot role classification for component composition
 */
export type SlotRole = 'layout' | 'navigation' | 'content' | 'action' | 'meta';

/**
 * Environment type for grid preset selection
 */
export type Environment =
  | 'web'
  | 'mobile'
  | 'tablet'
  | 'responsive'
  | 'tv'
  | 'kiosk';

/**
 * Valid environment values
 */
export const environmentValues = [
  'web',
  'mobile',
  'tablet',
  'responsive',
  'tv',
  'kiosk',
] as const;

/**
 * Component node representing a single component in the tree structure
 */
export interface ComponentNode {
  componentName: string;
  props: Record<string, unknown>;
  slots?: {
    [slotName: string]: ComponentNode | ComponentNode[];
  };
}

/**
 * Blueprint result from Layer 3 knowledge system
 */
export interface BlueprintResult {
  blueprintId: string;
  recipeName: string;
  analysis: {
    intent: string;
    tone: string;
  };
  structure: ComponentNode;
}

/**
 * Extended Blueprint result with layout support (V2)
 * SPEC-LAYOUT-001
 */
export interface BlueprintResultV2 extends BlueprintResult {
  /** Optional layout configuration */
  layout?: BlueprintLayout;
  /** Target environment for grid defaults */
  environment?: Environment;
}

/**
 * Zod schema for ComponentNode (recursive)
 */
const componentNodeSchema: z.ZodType<ComponentNode> = z.lazy(() =>
  z.object({
    componentName: z.string().min(1),
    props: z.record(z.unknown()),
    slots: z
      .record(z.union([componentNodeSchema, z.array(componentNodeSchema)]))
      .optional(),
  })
);

/**
 * Zod schema for analysis object
 */
const analysisSchema = z.object({
  intent: z.string().min(1),
  tone: z.string().min(1),
});

/**
 * Zod schema for BlueprintResultV2 validation
 * SPEC-LAYOUT-001 - TASK-005
 */
export const blueprintResultV2Schema = z.object({
  blueprintId: z.string().min(1),
  recipeName: z.string().min(1),
  analysis: analysisSchema,
  structure: componentNodeSchema,
  environment: z.enum(environmentValues).optional(),
  layout: blueprintLayoutSchema.optional(),
});

/**
 * JSON Schema for BlueprintResult validation
 */
export const BlueprintResultSchema = {
  type: 'object' as const,
  required: ['blueprintId', 'recipeName', 'analysis', 'structure'],
  properties: {
    blueprintId: {
      type: 'string' as const,
      description: 'Unique identifier for the blueprint',
    },
    recipeName: {
      type: 'string' as const,
      description: 'Name of the recipe used to generate the blueprint',
    },
    analysis: {
      type: 'object' as const,
      required: ['intent', 'tone'],
      properties: {
        intent: {
          type: 'string' as const,
          description: 'User intent analysis',
        },
        tone: {
          type: 'string' as const,
          description: 'Tone analysis (professional, casual, etc.)',
        },
      },
    },
    structure: {
      type: 'object' as const,
      description: 'Root component node structure',
    },
    environment: {
      type: 'string' as const,
      enum: ['web', 'mobile', 'tablet', 'responsive', 'tv', 'kiosk'],
      description: 'Target environment for grid defaults',
    },
    layout: {
      type: 'object' as const,
      description: 'Layout configuration for responsive grid',
    },
  },
};
