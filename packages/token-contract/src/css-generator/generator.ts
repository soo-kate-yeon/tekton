/**
 * CSS Variable Generator
 * Generates CSS custom properties from design tokens
 */

import { generateVariableName } from './variable-naming.js';
import type { SemanticToken, CompositionToken, ColorToken } from '../schemas/index.js';

/**
 * Convert ColorToken to OKLCH CSS string
 * @param color - Color token with l, c, h values
 * @returns OKLCH CSS string (e.g., "oklch(0.5 0.15 220)")
 */
function colorTokenToOKLCH(color: ColorToken | string): string {
  // If already a string, return as-is
  if (typeof color === 'string') {
    return color;
  }

  // Convert ColorToken object to oklch string
  return `oklch(${color.l} ${color.c} ${color.h})`;
}

/**
 * Generate CSS variables from semantic tokens
 * @param tokens - Semantic tokens to convert
 * @returns CSS string with :root selector and variables
 */
export function generateCSSVariables(tokens: SemanticToken): string {
  const variables: Record<string, string> = {};

  // Process each semantic token (primary, neutral, success, etc.)
  for (const [tokenName, scale] of Object.entries(tokens)) {
    if (scale && typeof scale === 'object') {
      // Process each step in the scale (50, 100, 200, ..., 900, 950)
      for (const [step, value] of Object.entries(scale)) {
        const varName = generateVariableName(tokenName, step);
        variables[varName] = colorTokenToOKLCH(value);
      }
    }
  }

  return formatCSSRule(':root', variables);
}

/**
 * Generate complete CSS from tokens including composition tokens
 * @param options - Tokens configuration
 * @returns Complete CSS string
 */
export function generateCSSFromTokens(options: {
  semantic: SemanticToken;
  composition?: CompositionToken;
}): string {
  const variables: Record<string, string> = {};

  // Add semantic tokens
  for (const [tokenName, scale] of Object.entries(options.semantic)) {
    if (scale && typeof scale === 'object') {
      for (const [step, value] of Object.entries(scale)) {
        const varName = generateVariableName(tokenName, step);
        variables[varName] = colorTokenToOKLCH(value);
      }
    }
  }

  // Add composition tokens if provided
  if (options.composition) {
    addCompositionVariables(variables, options.composition);
  }

  return formatCSSRule(':root', variables);
}

/**
 * Format CSS rule with selector and variables
 * @param selector - CSS selector (e.g., ':root', '[data-theme="dark"]')
 * @param variables - Variable name to value mapping
 * @returns Formatted CSS rule string
 */
export function formatCSSRule(
  selector: string,
  variables: Record<string, string>
): string {
  const entries = Object.entries(variables);

  if (entries.length === 0) {
    return `${selector} {\n}`;
  }

  const variableLines = entries
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');

  return `${selector} {\n${variableLines}\n}`;
}

/**
 * Add composition token variables to the variables object
 * @param variables - Variables object to mutate
 * @param composition - Composition tokens
 */
function addCompositionVariables(
  variables: Record<string, string>,
  composition: CompositionToken
): void {
  // Add border tokens
  if (composition.border) {
    for (const [key, value] of Object.entries(composition.border)) {
      const varName = generateVariableName('border', key);
      // Convert color tokens to OKLCH strings
      variables[varName] = key === 'color' ? colorTokenToOKLCH(value) : String(value);
    }
  }

  // Add shadow tokens
  if (composition.shadow) {
    for (const [key, value] of Object.entries(composition.shadow)) {
      const varName = generateVariableName('shadow', key);
      // Convert color tokens to OKLCH strings
      variables[varName] = key === 'color' ? colorTokenToOKLCH(value) : String(value);
    }
  }

  // Add spacing tokens
  if (composition.spacing) {
    for (const [key, value] of Object.entries(composition.spacing)) {
      const varName = generateVariableName('spacing', key);
      variables[varName] = String(value);
    }
  }

  // Add typography tokens
  if (composition.typography) {
    for (const [key, value] of Object.entries(composition.typography)) {
      const varName = generateVariableName('typography', key);
      variables[varName] = String(value);
    }
  }
}
