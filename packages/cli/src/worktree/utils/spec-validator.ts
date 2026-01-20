/**
 * SPEC ID Validation Utilities
 *
 * Validates and formats SPEC identifiers according to the pattern:
 * SPEC-[A-Z0-9]+-\d{3}
 *
 * Examples:
 * - Valid: SPEC-ABC-001, SPEC-TEST-999, SPEC-A1B2-123
 * - Invalid: spec-abc-001, SPEC-ABC, SPEC-ABC-1, SPEC-ABC-1234
 */

/**
 * Regular expression for validating SPEC IDs
 * Pattern: SPEC-[A-Z0-9]+-\d{3}
 * - Must start with "SPEC-"
 * - Followed by one or more uppercase letters or digits
 * - Followed by a hyphen
 * - Followed by exactly 3 digits
 */
const SPEC_ID_PATTERN = /^SPEC-[A-Z0-9]+-\d{3}$/;

/**
 * Validates a SPEC ID against the required pattern
 *
 * @param id - The SPEC ID string to validate
 * @returns true if the ID matches the pattern, false otherwise
 *
 * @example
 * ```typescript
 * validateSpecId('SPEC-ABC-001') // true
 * validateSpecId('spec-abc-001') // false
 * validateSpecId('SPEC-ABC') // false
 * ```
 */
export function validateSpecId(id: string): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }

  return SPEC_ID_PATTERN.test(id);
}

/**
 * Formats a SPEC ID by normalizing case and trimming whitespace
 *
 * This function attempts to convert a potentially malformed SPEC ID into
 * the correct format. If the input cannot be formatted into a valid SPEC ID,
 * an empty string is returned.
 *
 * @param input - The input string to format
 * @returns The formatted SPEC ID, or an empty string if formatting fails
 *
 * @example
 * ```typescript
 * formatSpecId('spec-abc-001') // 'SPEC-ABC-001'
 * formatSpecId('  SPEC-abc-001  ') // 'SPEC-ABC-001'
 * formatSpecId('invalid') // ''
 * ```
 */
export function formatSpecId(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Trim whitespace and convert to uppercase
  const normalized = input.trim().toUpperCase();

  // Validate the normalized string
  if (!validateSpecId(normalized)) {
    return '';
  }

  return normalized;
}
