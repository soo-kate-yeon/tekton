/**
 * Slot Semantic Registry Type Definitions
 * Phase 1: SPEC-LAYER3-001
 */

/**
 * Slot scope types
 */
export type SlotScope = 'global' | 'local';

/**
 * Slot role types
 */
export type SlotRole = 'layout' | 'action' | 'content';

/**
 * Global slot types for application-level layout
 */
export type GlobalSlotType = 'header' | 'sidebar' | 'main' | 'footer';

/**
 * Local slot types for component-specific areas
 */
export type LocalSlotType = 'card_actions' | 'table_toolbar' | 'modal_footer';

/**
 * Combined slot type
 */
export type SlotType = GlobalSlotType | LocalSlotType;

/**
 * Slot constraint configuration
 */
export interface SlotConstraints {
  /**
   * Maximum number of children allowed in this slot
   * undefined means unlimited
   */
  maxChildren?: number;

  /**
   * List of allowed component types
   */
  allowedComponents?: string[];

  /**
   * List of excluded component types
   */
  excludedComponents?: string[];
}

/**
 * Slot definition with metadata and constraints
 */
export interface SlotDefinition {
  /**
   * Unique slot identifier
   */
  name: SlotType;

  /**
   * Slot scope (global or local)
   */
  scope: SlotScope;

  /**
   * Slot semantic role
   */
  role: SlotRole;

  /**
   * Slot constraints
   */
  constraints?: SlotConstraints;

  /**
   * Parent component for local slots
   */
  parentComponent?: string;
}
