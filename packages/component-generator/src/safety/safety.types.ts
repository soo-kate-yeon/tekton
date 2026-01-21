/**
 * Safety Protocol Types
 * TAG: SPEC-LAYER3-001 Section 5.5
 *
 * Type definitions for quality gates and safety mechanisms
 */

/**
 * Minimum acceptable score threshold
 */
export const SCORE_THRESHOLD = 0.4;

/**
 * Error codes for safety violations
 */
export const SAFETY_ERROR_CODES = {
  /**
   * LAYER3-E002: Hallucinated or invalid component reference
   */
  HALLUCINATION: "LAYER3-E002",

  /**
   * LAYER3-W001: Score below threshold warning
   */
  BELOW_THRESHOLD: "LAYER3-W001",

  /**
   * LAYER3-E003: Constraint violation
   */
  CONSTRAINT_VIOLATION: "LAYER3-E003",
} as const;

/**
 * Slot roles for fallback mapping
 */
export type SlotRole =
  | "primary-content"
  | "navigation"
  | "actions"
  | "auxiliary";

/**
 * Fallback component names mapped to slot roles
 */
export const FALLBACK_COMPONENTS: Record<SlotRole, string> = {
  "primary-content": "GenericContainer",
  navigation: "NavPlaceholder",
  actions: "ButtonGroup",
  auxiliary: "GenericContainer",
};

/**
 * Threshold check result
 */
export interface ThresholdCheckResult {
  /**
   * Whether score passes threshold (≥ 0.4)
   */
  passes: boolean;

  /**
   * Input score value
   */
  score: number;

  /**
   * Warning message if below threshold
   */
  warning?: string;

  /**
   * Error code if below threshold
   */
  errorCode?: string;
}

/**
 * Hallucination check result
 */
export interface HallucinationCheckResult {
  /**
   * Whether component exists in catalog
   */
  isValid: boolean;

  /**
   * Component name being checked
   */
  componentName: string;

  /**
   * Error message if invalid
   */
  error?: string;

  /**
   * Error code if invalid
   */
  errorCode?: string;

  /**
   * Fuzzy suggestions for typos
   */
  suggestions?: string[];
}

/**
 * Excluded slot check result
 */
export interface ExcludedSlotResult {
  /**
   * Whether component is allowed in slot (not excluded)
   */
  isAllowed: boolean;

  /**
   * Component name being checked
   */
  componentName: string;

  /**
   * Target slot identifier
   */
  targetSlot: string;

  /**
   * Score (0.0 if excluded, original if allowed)
   */
  score: number;

  /**
   * Reason for exclusion if applicable
   */
  reason?: string;
}

/**
 * Fallback metadata attached to component placement
 */
export interface FallbackMetadata {
  /**
   * Indicates this is a fallback component
   */
  _fallback: true;

  /**
   * Reason for fallback activation
   */
  reason: string;

  /**
   * Original score that triggered fallback
   */
  originalScore?: number;

  /**
   * Original component name if hallucinated
   */
  originalComponentName?: string;
}

/**
 * Fluid fallback result
 */
export interface FluidFallbackResult {
  /**
   * Fallback component name
   */
  componentName: string;

  /**
   * Target slot identifier
   */
  targetSlot: string;

  /**
   * Slot role used for fallback selection
   */
  slotRole: SlotRole;

  /**
   * Fallback metadata
   */
  metadata: FallbackMetadata;
}

/**
 * Levenshtein distance calculation options
 */
export interface LevenshteinOptions {
  /**
   * Maximum distance threshold for suggestions
   */
  maxDistance?: number;

  /**
   * Case-sensitive comparison
   */
  caseSensitive?: boolean;
}
