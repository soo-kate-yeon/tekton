/**
 * Layer 3 Knowledge Schema Types
 * Defines the structure for component blueprints and generation
 */

/**
 * Slot role classification for component composition
 */
export type SlotRole = 'layout' | 'navigation' | 'content' | 'action' | 'meta';

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
  /** Unique identifier for the blueprint */
  blueprintId: string;
  /** Name of the recipe used to generate the blueprint */
  recipeName: string;
  /** Analysis results including intent and tone */
  analysis: {
    /** User intent analysis */
    intent: string;
    /** Tone analysis (professional, calm, etc.) */
    tone: string;
  };
  /** Root component node structure */
  structure: ComponentNode;
  /**
   * Optional theme identifier for token binding
   * @example "calm-wellness"
   * @example "tech-startup"
   * @default "calm-wellness" (when resolved)
   */
  themeId?: string;
}

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
    themeId: {
      type: 'string' as const,
      description: 'Optional theme identifier for token binding (e.g., "calm-wellness")',
    },
  },
};
