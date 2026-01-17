/**
 * useWCAGValidation Hook
 * Live WCAG compliance checking
 */

import { useMemo } from 'react';
import type { ColorToken, SemanticToken } from '@tekton/token-contract';
import {
  getContrastResult,
  batchCheckContrast,
  type ContrastResult,
  type BatchContrastResult,
  type ColorPair,
} from '@/lib/token-editor';

/**
 * Check contrast between a single color pair
 */
export function useContrastCheck(
  foreground: ColorToken | null,
  background: ColorToken | null
): ContrastResult | null {
  return useMemo(() => {
    if (!foreground || !background) {
      return null;
    }
    return getContrastResult(foreground, background);
  }, [foreground, background]);
}

/**
 * Check contrast for a color against light and dark backgrounds
 */
export function useColorAccessibility(
  color: ColorToken | null,
  lightBg: ColorToken = { l: 0.98, c: 0, h: 0 },
  darkBg: ColorToken = { l: 0.15, c: 0, h: 0 }
): { onLight: ContrastResult | null; onDark: ContrastResult | null } {
  return useMemo(() => {
    if (!color) {
      return { onLight: null, onDark: null };
    }

    return {
      onLight: getContrastResult(color, lightBg),
      onDark: getContrastResult(color, darkBg),
    };
  }, [color, lightBg, darkBg]);
}

/**
 * Batch validate semantic tokens for WCAG compliance
 */
export function useSemanticTokensValidation(
  tokens: SemanticToken
): BatchContrastResult[] {
  return useMemo(() => {
    const pairs: ColorPair[] = [];

    // Get neutral backgrounds
    const lightBg = tokens.neutral?.['50'] ?? { l: 0.98, c: 0, h: 0 };
    const darkBg = tokens.neutral?.['900'] ?? { l: 0.15, c: 0, h: 0 };

    // Test primary, success, warning, error at key steps
    const semanticNames = ['primary', 'success', 'warning', 'error'] as const;
    const testSteps = ['500', '600', '700'] as const;

    semanticNames.forEach((name) => {
      const scale = tokens[name];
      if (!scale) {
        return;
      }

      testSteps.forEach((step) => {
        const color = scale[step];
        if (!color) {
          return;
        }

        pairs.push({
          name: `${name}-${step}-on-light`,
          foreground: color,
          background: lightBg,
        });

        pairs.push({
          name: `${name}-${step}-on-dark`,
          foreground: color,
          background: darkBg,
        });
      });
    });

    return batchCheckContrast(pairs);
  }, [tokens]);
}

/**
 * Get summary of WCAG validation results
 */
export interface WCAGSummary {
  total: number;
  passing: number;
  failing: number;
  passRate: number;
  worstContrast: number;
  bestContrast: number;
}

export function useWCAGSummary(results: BatchContrastResult[]): WCAGSummary {
  return useMemo(() => {
    if (results.length === 0) {
      return {
        total: 0,
        passing: 0,
        failing: 0,
        passRate: 100,
        worstContrast: 0,
        bestContrast: 0,
      };
    }

    const passing = results.filter((r) => r.passesAA).length;
    const ratios = results.map((r) => r.ratio);

    return {
      total: results.length,
      passing,
      failing: results.length - passing,
      passRate: Math.round((passing / results.length) * 100),
      worstContrast: Math.min(...ratios),
      bestContrast: Math.max(...ratios),
    };
  }, [results]);
}
