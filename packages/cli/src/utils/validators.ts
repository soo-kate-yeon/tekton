/**
 * Hex color validation regex
 */
const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

/**
 * Validate hex color format
 * @param color - Color string to validate
 * @returns True if valid hex color
 */
export function isValidHexColor(color: string): boolean {
  return HEX_COLOR_REGEX.test(color);
}

/**
 * Validate color and return error message if invalid
 * @param color - Color string to validate
 * @returns Error message or null if valid
 */
export function validateHexColor(color: string): string | null {
  if (!color) {
    return 'Color is required';
  }
  if (!isValidHexColor(color)) {
    return 'Please enter a valid hex color (e.g., #3b82f6)';
  }
  return null;
}
