/**
 * CSS Variable Application
 * Apply CSS custom properties to the DOM
 */

import type { SemanticToken, CompositionToken, ColorToken } from '../schemas/index.js';

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
 * Apply CSS variables to the document root
 * @param tokens - Semantic tokens
 * @param composition - Composition tokens (optional)
 */
export function applyCSSVariables(
  tokens: SemanticToken,
  composition?: CompositionToken
): void {
  // Generate CSS variables from tokens (unused but may be useful for debugging)
  // const css = generateCSSFromTokens({ semantic: tokens, composition });

  // Apply variables to :root element
  applyVariablesToElement(document.documentElement, tokens, composition);
}

/**
 * Apply dark mode CSS variables
 * @param darkTokens - Dark mode semantic tokens
 * @param composition - Composition tokens (optional)
 */
export function applyDarkModeCSSVariables(
  darkTokens: SemanticToken,
  composition?: CompositionToken
): void {
  // Apply dark mode variables to the element with data-theme="dark"
  applyVariablesToElement(document.documentElement, darkTokens, composition);
}

/**
 * Apply variables to a specific element
 * @param element - Target element
 * @param tokens - Semantic tokens
 * @param composition - Composition tokens (optional)
 */
function applyVariablesToElement(
  element: HTMLElement,
  tokens: SemanticToken,
  composition?: CompositionToken
): void {
  // Process semantic tokens
  for (const [tokenName, scale] of Object.entries(tokens)) {
    if (scale && typeof scale === 'object') {
      for (const [step, value] of Object.entries(scale)) {
        const varName = `--tekton-${tokenName}-${step}`;
        element.style.setProperty(varName, colorTokenToOKLCH(value));
      }
    }
  }

  // Process composition tokens
  if (composition) {
    // Border tokens
    if (composition.border) {
      for (const [key, value] of Object.entries(composition.border)) {
        const cssValue = key === 'color' ? colorTokenToOKLCH(value) : String(value);
        element.style.setProperty(`--tekton-border-${key}`, cssValue);
      }
    }

    // Shadow tokens
    if (composition.shadow) {
      for (const [key, value] of Object.entries(composition.shadow)) {
        const cssValue = key === 'color' ? colorTokenToOKLCH(value) : String(value);
        element.style.setProperty(`--tekton-shadow-${key}`, cssValue);
      }
    }

    // Spacing tokens
    if (composition.spacing) {
      for (const [key, value] of Object.entries(composition.spacing)) {
        element.style.setProperty(`--tekton-spacing-${key}`, String(value));
      }
    }

    // Typography tokens
    if (composition.typography) {
      for (const [key, value] of Object.entries(composition.typography)) {
        element.style.setProperty(`--tekton-typography-${key}`, String(value));
      }
    }
  }
}

/**
 * Remove all Tekton CSS variables from an element
 * @param element - Target element
 */
export function removeCSSVariables(element: HTMLElement): void {
  const styles = element.style;
  const propertiesToRemove: string[] = [];

  // Collect all tekton variables
  for (let i = 0; i < styles.length; i++) {
    const propertyName = styles[i];
    if (propertyName && propertyName.startsWith('--tekton-')) {
      propertiesToRemove.push(propertyName);
    }
  }

  // Remove collected variables
  for (const property of propertiesToRemove) {
    element.style.removeProperty(property);
  }
}
