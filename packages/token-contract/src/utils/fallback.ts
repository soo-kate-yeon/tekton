/**
 * Fallback Handling Utilities
 * Handle missing tokens with fallback values and warnings
 */

import type { SemanticToken, ColorScale, ColorToken } from '../schemas/index.js';

/**
 * Convert ColorToken to OKLCH CSS string
 */
function colorTokenToOKLCH(color: ColorToken | string): string {
  if (typeof color === 'string') {
    return color;
  }
  return `oklch(${color.l} ${color.c} ${color.h})`;
}

/**
 * Get a token value with fallback for missing tokens
 * @param tokens - Semantic tokens
 * @param tokenName - Token name (e.g., 'primary', 'accent')
 * @param step - Step value (e.g., '500')
 * @param customFallback - Optional custom fallback value
 * @returns Token value or fallback
 */
export function getTokenWithFallback(
  tokens: SemanticToken | null | undefined,
  tokenName: keyof SemanticToken | string,
  step: keyof ColorScale | string,
  customFallback?: string
): string {
  // Check if tokens exist
  if (!tokens || typeof tokens !== 'object') {
    const fallback = customFallback ?? getFallbackColor({} as SemanticToken);
    logMissingTokenWarning(tokenName as string, step as string, fallback);
    return fallback;
  }

  // Check if semantic token exists
  const scale = tokens[tokenName as keyof SemanticToken];
  if (!scale || typeof scale !== 'object') {
    const fallback = customFallback ?? getFallbackColor(tokens);
    logMissingTokenWarning(tokenName as string, step as string, fallback);
    return fallback;
  }

  // Check if step exists
  const value = scale[step as keyof typeof scale];
  if (!value) {
    // Try to fall back to step 500 of the same token
    const step500 = scale['500' as keyof typeof scale];
    const fallback = customFallback ?? (step500 ? colorTokenToOKLCH(step500) : getFallbackColor(tokens));
    logMissingTokenWarning(tokenName as string, step as string, fallback);
    return fallback;
  }

  return colorTokenToOKLCH(value);
}

/**
 * Get a fallback color from available tokens
 * @param tokens - Semantic tokens
 * @returns Fallback color value
 */
export function getFallbackColor(tokens: SemanticToken): string {
  // Prefer neutral-500
  if (tokens.neutral?.['500']) {
    return colorTokenToOKLCH(tokens.neutral['500']);
  }

  // Fall back to primary-500
  if (tokens.primary?.['500']) {
    return colorTokenToOKLCH(tokens.primary['500']);
  }

  // Fall back to any available 500 step
  const semanticKeys: Array<keyof SemanticToken> = [
    'success',
    'warning',
    'error',
    'secondary',
    'accent',
    'info',
  ];

  for (const key of semanticKeys) {
    const scale = tokens[key];
    if (scale && typeof scale === 'object' && scale['500']) {
      return colorTokenToOKLCH(scale['500']);
    }
  }

  // Ultimate fallback: hardcoded gray
  return 'oklch(0.5 0.1 220)';
}

/**
 * Log a warning for missing token
 * @param tokenName - Token name
 * @param step - Step value
 * @param fallback - Fallback value being used
 */
export function logMissingTokenWarning(
  tokenName: string,
  step: string,
  fallback?: string
): void {
  const message = `Missing token: ${tokenName}-${step}`;
  const fallbackInfo = fallback ? `. Using fallback: ${fallback}` : '';

  console.warn(`[Tekton Token Contract] ${message}${fallbackInfo}`);
}
