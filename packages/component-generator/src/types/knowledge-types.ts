/**
 * Knowledge Schema Types
 * TASK-001: Component knowledge representation for MCP integration
 *
 * These types define the schema for component knowledge that enables
 * AI-driven component generation through the MCP protocol.
 */

/**
 * Categories for organizing components
 */
export type ComponentCategory = 'action' | 'layout' | 'input' | 'feedback' | 'data-display' | 'navigation';

/**
 * Slot definition within a component
 * Describes where and how child content can be inserted
 */
export interface SlotDefinitionKnowledge {
  /**
   * Name of the slot (e.g., 'children', 'header', 'footer')
   */
  slotName: string;

  /**
   * Type of content accepted by the slot
   */
  slotType: 'text' | 'component' | 'icon' | 'mixed';

  /**
   * Whether this slot must be filled
   */
  required: boolean;

  /**
   * Optional description of the slot's purpose
   */
  description?: string;
}

/**
 * Property definition within a component
 * Describes configurable props and their types
 */
export interface PropDefinitionKnowledge {
  /**
   * Name of the prop
   */
  propName: string;

  /**
   * Type of the prop value
   */
  propType: 'string' | 'number' | 'boolean' | 'enum' | 'object';

  /**
   * For enum type, the allowed values
   */
  possibleValues?: string[];

  /**
   * Default value if prop is not provided
   */
  defaultValue?: string | number | boolean;

  /**
   * Whether this prop is required
   */
  required?: boolean;

  /**
   * Optional description of the prop's purpose
   */
  description?: string;
}

/**
 * Complete knowledge about a single component
 * This is what the LLM receives to understand component capabilities
 */
export interface ComponentKnowledge {
  /**
   * Component name (e.g., 'Button', 'Card')
   */
  componentName: string;

  /**
   * Import path for the component
   */
  importPath: string;

  /**
   * Component category for organization
   */
  category: ComponentCategory;

  /**
   * Human-readable description
   */
  description: string;

  /**
   * Available slots for child content
   */
  slots: SlotDefinitionKnowledge[];

  /**
   * Configurable props
   */
  props: PropDefinitionKnowledge[];
}

/**
 * Mapping for a slot value in a blueprint
 * Can be literal content, a nested component, or an array of items
 */
export type SlotMapping =
  | {
      type: 'literal';
      value: string | number | boolean;
    }
  | {
      type: 'component';
      blueprint: ComponentBlueprint;
    }
  | {
      type: 'array';
      items: SlotMapping[];
    };

/**
 * Mapping for a prop value in a blueprint
 * Currently supports literal values
 */
export type PropMapping = {
  type: 'literal';
  value: string | number | boolean;
};

/**
 * Blueprint for rendering a component instance
 * This is what the LLM generates to create actual component code
 */
export interface ComponentBlueprint {
  /**
   * Name of component to render
   */
  componentName: string;

  /**
   * Values for each slot
   */
  slotMappings: Record<string, SlotMapping>;

  /**
   * Values for each prop
   */
  propMappings: Record<string, PropMapping>;
}

/**
 * Complete schema containing all component knowledge
 * This is the master reference for available components
 */
export interface KnowledgeSchema {
  /**
   * Schema version for compatibility
   */
  version: string;

  /**
   * All available components
   */
  components: ComponentKnowledge[];
}
