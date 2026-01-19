/**
 * State-Style Mapping Schema
 * Defines visual feedback rules for all hook state values
 *
 * @module schemas/state-style-mapping
 */

/**
 * State type categories
 */
export type StateType = 'boolean' | 'numeric' | 'composite';

/**
 * Visual feedback definition for a state
 */
export interface VisualFeedback {
  /**
   * CSS properties for state visual changes
   * All values must use Token Contract CSS variables
   */
  cssProperties: Record<string, string>;
}

/**
 * State definition with visual feedback
 */
export interface StateFeedback {
  /**
   * State name (e.g., "isPressed", "currentPage", "selectedKeys")
   */
  stateName: string;

  /**
   * State type classification
   */
  stateType: StateType;

  /**
   * Visual feedback rules for this state
   */
  visualFeedback: VisualFeedback;
}

/**
 * Transition specifications for state changes
 */
export interface TransitionSpec {
  /**
   * Transition duration (CSS format: "150ms", "0.3s")
   */
  duration: string;

  /**
   * Transition easing function
   */
  easing: string;

  /**
   * Reduced motion support enabled
   */
  reducedMotion: boolean;
}

/**
 * Complete state-style mapping for a hook
 */
export interface StateStyleMapping {
  /**
   * Hook name (e.g., "useButton", "useTextField")
   */
  hookName: string;

  /**
   * All states with visual feedback definitions
   */
  states: StateFeedback[];

  /**
   * Transition specifications for state changes
   */
  transitions: TransitionSpec;
}

/**
 * Collection of all state-style mappings
 */
export interface StateStyleMappingCollection {
  version: string;
  mappings: StateStyleMapping[];
}

/**
 * Type guard to check if a value is a valid StateStyleMapping object
 */
export function isStateStyleMapping(value: any): value is StateStyleMapping {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.hookName === 'string' &&
    Array.isArray(value.states) &&
    typeof value.transitions === 'object' &&
    value.transitions !== null
  );
}
