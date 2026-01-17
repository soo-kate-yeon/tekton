/**
 * useLivePreview Hook
 * Inject CSS variables for live preview
 */

import { useEffect, useRef } from 'react';
import type { SemanticToken, CompositionToken, ColorToken } from '@tekton/token-contract';
import { colorTokenToCSS } from '@/lib/token-editor';

/**
 * Generate CSS variables from semantic tokens
 */
function generateCSSVariables(
  semantic: SemanticToken,
  composition?: CompositionToken
): string {
  const variables: string[] = [];

  // Add semantic color tokens
  for (const [tokenName, scale] of Object.entries(semantic)) {
    if (scale && typeof scale === 'object') {
      for (const [step, color] of Object.entries(scale)) {
        const varName = `--tekton-${tokenName}-${step}`;
        const value = typeof color === 'string' ? color : colorTokenToCSS(color as ColorToken);
        variables.push(`${varName}: ${value};`);
      }
    }
  }

  // Add composition tokens
  if (composition) {
    if (composition.border) {
      for (const [key, value] of Object.entries(composition.border)) {
        const varName = `--tekton-border-${key}`;
        const cssValue = key === 'color' && typeof value !== 'string'
          ? colorTokenToCSS(value as ColorToken)
          : String(value);
        variables.push(`${varName}: ${cssValue};`);
      }
    }

    if (composition.spacing) {
      for (const [key, value] of Object.entries(composition.spacing)) {
        variables.push(`--tekton-spacing-${key}: ${value};`);
      }
    }

    if (composition.typography) {
      for (const [key, value] of Object.entries(composition.typography)) {
        variables.push(`--tekton-typography-${key}: ${value};`);
      }
    }

    if (composition.shadow) {
      for (const [key, value] of Object.entries(composition.shadow)) {
        const varName = `--tekton-shadow-${key}`;
        const cssValue = key === 'color' && typeof value !== 'string'
          ? colorTokenToCSS(value as ColorToken)
          : String(value);
        variables.push(`${varName}: ${cssValue};`);
      }
    }
  }

  return `:root {\n  ${variables.join('\n  ')}\n}`;
}

/**
 * Inject live preview CSS variables
 */
export function useLivePreview(
  semantic: SemanticToken,
  composition?: CompositionToken,
  enabled = true
): void {
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (!enabled) {
      // Remove style element if disabled
      if (styleRef.current) {
        styleRef.current.remove();
        styleRef.current = null;
      }
      return;
    }

    // Create or get style element
    if (!styleRef.current) {
      styleRef.current = document.createElement('style');
      styleRef.current.id = 'tekton-live-preview';
      document.head.appendChild(styleRef.current);
    }

    // Update CSS content
    const css = generateCSSVariables(semantic, composition);
    styleRef.current.textContent = css;

    // Cleanup on unmount
    return () => {
      if (styleRef.current) {
        styleRef.current.remove();
        styleRef.current = null;
      }
    };
  }, [semantic, composition, enabled]);
}

/**
 * Apply CSS variables to a specific element (for isolated preview)
 */
export function useElementPreview(
  elementRef: React.RefObject<HTMLElement>,
  semantic: SemanticToken,
  composition?: CompositionToken
): void {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    // Apply semantic tokens
    for (const [tokenName, scale] of Object.entries(semantic)) {
      if (scale && typeof scale === 'object') {
        for (const [step, color] of Object.entries(scale)) {
          const varName = `--tekton-${tokenName}-${step}`;
          const value = typeof color === 'string' ? color : colorTokenToCSS(color as ColorToken);
          element.style.setProperty(varName, value);
        }
      }
    }

    // Apply composition tokens
    if (composition) {
      if (composition.border) {
        for (const [key, value] of Object.entries(composition.border)) {
          const varName = `--tekton-border-${key}`;
          const cssValue = key === 'color' && typeof value !== 'string'
            ? colorTokenToCSS(value as ColorToken)
            : String(value);
          element.style.setProperty(varName, cssValue);
        }
      }

      if (composition.spacing) {
        for (const [key, value] of Object.entries(composition.spacing)) {
          element.style.setProperty(`--tekton-spacing-${key}`, String(value));
        }
      }
    }
  }, [elementRef, semantic, composition]);
}
