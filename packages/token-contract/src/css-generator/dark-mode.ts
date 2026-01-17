/**
 * Dark Mode CSS Generation
 * Generates [data-theme="dark"] selector overrides
 */

import { generateVariableName } from './variable-naming.js';
import { formatCSSRule } from './generator.js';
import type { SemanticToken, ColorToken } from '../schemas/index.js';

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
 * Generate dark mode CSS with [data-theme="dark"] selector
 * @param darkTokens - Dark mode semantic tokens
 * @returns CSS string with dark mode overrides
 */
export function generateDarkModeCSS(darkTokens: SemanticToken): string {
  const variables: Record<string, string> = {};

  // Process each semantic token
  for (const [tokenName, scale] of Object.entries(darkTokens)) {
    if (scale && typeof scale === 'object') {
      // Process each step in the scale
      for (const [step, value] of Object.entries(scale)) {
        const varName = generateVariableName(tokenName, step);
        variables[varName] = colorTokenToOKLCH(value);
      }
    }
  }

  return formatCSSRule('[data-theme="dark"]', variables);
}

/**
 * Generate dark mode overrides (only variables that differ from light mode)
 * @param lightTokens - Light mode tokens
 * @param darkTokens - Dark mode tokens
 * @returns CSS string with dark mode overrides
 */
export function generateDarkModeOverrides(
  _lightTokens: SemanticToken,
  darkTokens: SemanticToken
): string {
  const variables: Record<string, string> = {};

  // Process each semantic token in dark mode
  for (const [tokenName, scale] of Object.entries(darkTokens)) {
    if (scale && typeof scale === 'object') {
      // Process each step in the scale
      for (const [step, darkValue] of Object.entries(scale)) {
        // Include all dark mode values for completeness
        // (optimization to skip identical values can be added later)
        const varName = generateVariableName(tokenName, step);
        variables[varName] = colorTokenToOKLCH(darkValue);
      }
    }
  }

  return formatCSSRule('[data-theme="dark"]', variables);
}

/**
 * Merge light and dark mode CSS into a single string
 * @param lightCSS - Light mode CSS (:root selector)
 * @param darkCSS - Dark mode CSS ([data-theme="dark"] selector)
 * @returns Combined CSS string
 */
export function mergeLightAndDarkCSS(
  lightCSS: string,
  darkCSS: string
): string {
  if (!darkCSS || darkCSS.trim() === '') {
    return lightCSS;
  }

  return `${lightCSS}\n\n${darkCSS}`;
}
