/**
 * ComponentKnowledge Type Definitions
 * TAG: SPEC-LAYER2-001
 *
 * Core types for the Component Knowledge System (Layer 2)
 */

/**
 * Atomic Design hierarchy levels
 */
export type ComponentType = 'atom' | 'molecule' | 'organism' | 'template';

/**
 * Functional categories for component filtering
 */
export type ComponentCategory = 'display' | 'input' | 'action' | 'container' | 'navigation';

/**
 * Visual prominence levels
 */
export type VisualImpact = 'subtle' | 'neutral' | 'prominent';

/**
 * Implementation complexity levels
 */
export type Complexity = 'low' | 'medium' | 'high';

/**
 * Component interaction states
 */
export type ComponentState = 'default' | 'hover' | 'focus' | 'active' | 'disabled';

/**
 * Token bindings mapping CSS properties to token names
 */
export interface TokenBindings {
  // Color Properties
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  outlineColor?: string;

  // Typography Properties
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;

  // Spacing Properties
  padding?: string;
  paddingX?: string;
  paddingY?: string;
  margin?: string;
  gap?: string;

  // Border Properties
  borderWidth?: string;
  borderRadius?: string;
  borderStyle?: string;

  // Effect Properties
  boxShadow?: string;
  opacity?: string;
  transition?: string;
  transform?: string;

  // Size Properties
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
}

/**
 * Slot affinity scoring (0.0 to 1.0)
 * Higher values indicate better placement suitability
 */
export type SlotAffinity = Record<string, number>;

/**
 * Semantic description for AI context
 */
export interface SemanticDescription {
  /** What this component is used for */
  purpose: string;
  /** Visual prominence level */
  visualImpact: VisualImpact;
  /** Implementation complexity */
  complexity: Complexity;
}

/**
 * Placement rules and constraints
 */
export interface ComponentConstraints {
  /** Components that must be present as parent/child */
  requires?: string[];
  /** Components that cannot be used together */
  conflictsWith?: string[];
  /** Slots where this component must NEVER be placed */
  excludedSlots?: string[];
}

/**
 * Token bindings with state support
 */
export interface StateTokenBindings {
  states: Record<ComponentState, TokenBindings>;
  variants?: Record<string, Partial<Record<ComponentState, TokenBindings>>>;
}

/**
 * ComponentKnowledge: Extended metadata for AI reasoning
 * This is the core interface that enables intelligent component placement
 */
export interface ComponentKnowledge {
  /** Component identifier (e.g., "Button", "DataTable") */
  name: string;

  /** Atomic Design hierarchy level */
  type: ComponentType;

  /** Functional category for filtering */
  category: ComponentCategory;

  /**
   * Slot Affinity Scoring
   * Values from 0.0 to 1.0 indicating placement suitability
   * Higher values = more suitable for that slot
   */
  slotAffinity: SlotAffinity;

  /**
   * Semantic Description for AI Context
   * Human-readable guidance for component usage
   */
  semanticDescription: SemanticDescription;

  /**
   * Placement Rules and Constraints
   * Hard rules that AI must respect
   */
  constraints: ComponentConstraints;

  /**
   * Token Bindings (integrated from v1.x)
   * Maps component states to design tokens
   */
  tokenBindings: StateTokenBindings;
}

/**
 * Validation result with errors and warnings
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Layer 1 Token Metadata (Input Contract)
 */
export interface Layer1TokenMetadata {
  schemaVersion: '1.0.0';
  generatedAt: string;
  sourceArchetype: string;
  tokens: Array<{
    name: string;
    value: string;
    rgbFallback: string;
    cssVariable: string;
    category: 'color' | 'typography' | 'spacing' | 'shadow' | 'border';
    role?: 'primary' | 'secondary' | 'surface' | 'text' | 'border' | 'shadow';
  }>;
  wcagValidation: {
    passed: boolean;
    violations: Array<{
      foreground: string;
      background: string;
      ratio: number;
      required: number;
    }>;
  };
}
