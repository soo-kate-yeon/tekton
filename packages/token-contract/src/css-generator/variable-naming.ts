/**
 * CSS Variable Naming Utilities
 * Generates and validates --tekton-{semantic}-{step} naming convention
 */

/**
 * Generate a CSS variable name following Tekton naming convention
 * @param tokenName - Token name (e.g., 'primary', 'button')
 * @param step - Step or variant (e.g., '500', 'hover')
 * @returns CSS variable name (e.g., '--tekton-primary-500')
 */
export function generateVariableName(
  tokenName: string,
  step: string | number
): string {
  // Sanitize token name and step
  const sanitizedToken = sanitizeTokenName(tokenName);
  const sanitizedStep = sanitizeTokenName(String(step));

  return `--tekton-${sanitizedToken}-${sanitizedStep}`;
}

/**
 * Validate a CSS variable name against Tekton convention
 * @param variableName - CSS variable name to validate
 * @returns true if valid, false otherwise
 */
export function validateVariableName(variableName: string): boolean {
  // Must start with --tekton-
  if (!variableName.startsWith('--tekton-')) {
    return false;
  }

  // Must have at least token name and step after prefix
  const parts = variableName.slice(9).split('-'); // Remove '--tekton-'
  if (parts.length < 2) {
    return false;
  }

  // Must be a valid CSS custom property name
  if (!isValidCSSVariableName(variableName)) {
    return false;
  }

  // All parts must be non-empty
  if (parts.some((part) => part.length === 0)) {
    return false;
  }

  return true;
}

/**
 * Check if a string is a valid CSS custom property name
 * @param name - Name to validate
 * @returns true if valid CSS custom property syntax
 */
export function isValidCSSVariableName(name: string): boolean {
  // Must start with --
  if (!name.startsWith('--')) {
    return false;
  }

  // Empty name is invalid (except technically -- is valid)
  if (name.length < 2) {
    return false;
  }

  // CSS custom properties allow letters, digits, hyphens, underscores
  // No spaces or special characters like @, !, etc.
  const validPattern = /^--[a-zA-Z0-9_-]*$/;
  return validPattern.test(name);
}

/**
 * Sanitize a token name or step for use in CSS variable
 * @param name - Name to sanitize
 * @returns Sanitized name with invalid characters removed
 */
function sanitizeTokenName(name: string): string {
  // Remove any characters that aren't letters, numbers, hyphens, or underscores
  return name.replace(/[^a-zA-Z0-9-_]/g, '');
}
