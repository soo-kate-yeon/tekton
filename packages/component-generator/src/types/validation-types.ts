/**
 * Validation Error Types
 * SPEC-LAYER3-001 Phase 1
 */

/**
 * Validation error
 */
export interface ValidationError {
  /**
   * Error code (e.g., LAYER3-E003)
   */
  code: string;

  /**
   * Human-readable error message
   */
  message: string;

  /**
   * Additional context about the error
   */
  context?: Record<string, unknown>;
}

/**
 * Validation result
 */
export interface ValidationResult {
  /**
   * Whether validation passed
   */
  isValid: boolean;

  /**
   * List of validation errors
   */
  errors: ValidationError[];
}

/**
 * Slot validation options
 */
export interface SlotValidationOptions {
  /**
   * Number of children in the slot
   */
  childrenCount?: number;

  /**
   * Types of components to validate
   */
  componentTypes?: string[];
}
