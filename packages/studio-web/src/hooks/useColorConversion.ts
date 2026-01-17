/**
 * useColorConversion Hook
 * Color format conversion utilities
 */

import { useMemo } from 'react';
import type { ColorToken } from '@tekton/token-contract';
import { colorTokenToCSS, oklchToHex } from '@/lib/token-editor';

export interface ColorFormats {
  oklch: string;
  hex: string;
  cssVar: string;
}

/**
 * Convert a color token to multiple formats
 */
export function useColorConversion(
  color: ColorToken | null,
  varName?: string
): ColorFormats | null {
  return useMemo(() => {
    if (!color) {
      return null;
    }

    return {
      oklch: colorTokenToCSS(color),
      hex: oklchToHex(color),
      cssVar: varName ? `var(${varName})` : '',
    };
  }, [color, varName]);
}

/**
 * Get CSS variable name for a token
 */
export function getTokenCSSVarName(tokenName: string, step: string): string {
  return `--tekton-${tokenName}-${step}`;
}

/**
 * Hook for batch color conversion
 */
export function useColorScaleConversion(
  scale: Record<string, ColorToken> | undefined,
  tokenName: string
): Record<string, ColorFormats> | null {
  return useMemo(() => {
    if (!scale) {
      return null;
    }

    const result: Record<string, ColorFormats> = {};

    for (const [step, color] of Object.entries(scale)) {
      result[step] = {
        oklch: colorTokenToCSS(color),
        hex: oklchToHex(color),
        cssVar: `var(${getTokenCSSVarName(tokenName, step)})`,
      };
    }

    return result;
  }, [scale, tokenName]);
}
