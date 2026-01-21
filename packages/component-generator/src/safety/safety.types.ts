/**
 * Safety Types
 * SPEC-LAYER3-MVP-001 M1-TASK-002
 */

/**
 * Safety error codes
 */
export const SAFETY_ERROR_CODES = {
  HALLUCINATION: 'LAYER3-E002',
} as const;

/**
 * Hallucination check result
 */
export interface HallucinationCheckResult {
  isValid: boolean;
  componentName: string;
  error?: string;
  errorCode?: string;
  suggestions?: string[];
}
