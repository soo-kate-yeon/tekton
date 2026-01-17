/**
 * Contrast Calculator
 * WCAG contrast ratio calculations for accessibility compliance
 */

import type { ColorToken } from '@tekton/token-contract';

/**
 * WCAG contrast thresholds
 */
export const WCAG_THRESHOLDS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3.0,
  AAA_NORMAL: 7.0,
  AAA_LARGE: 4.5,
} as const;

/**
 * WCAG compliance level
 */
export type WCAGLevel = 'AA' | 'AAA' | 'FAIL';

/**
 * Contrast check result
 */
export interface ContrastResult {
  ratio: number;
  level: WCAGLevel;
  passesAA: boolean;
  passesAAA: boolean;
  passesAALarge: boolean;
  passesAAALarge: boolean;
}

/**
 * Convert OKLCH lightness to approximate relative luminance
 * Uses simplified approach based on perceptual lightness
 */
function oklchToRelativeLuminance(color: ColorToken): number {
  const { l } = color;

  // OKLCH lightness is already perceptually uniform
  // Convert to linear for WCAG calculation
  const linear = l <= 0.03928 / 12.92
    ? l * 12.92
    : Math.pow((l + 0.055) / 1.055, 2.4);

  return linear;
}

/**
 * Calculate contrast ratio between two colors
 */
export function calculateContrastRatio(
  foreground: ColorToken,
  background: ColorToken
): number {
  const lum1 = oklchToRelativeLuminance(foreground);
  const lum2 = oklchToRelativeLuminance(background);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  const ratio = (lighter + 0.05) / (darker + 0.05);

  return Math.round(ratio * 100) / 100;
}

/**
 * Check WCAG compliance for a contrast ratio
 */
export function checkWCAGCompliance(ratio: number): ContrastResult {
  return {
    ratio,
    level: ratio >= WCAG_THRESHOLDS.AAA_NORMAL ? 'AAA'
         : ratio >= WCAG_THRESHOLDS.AA_NORMAL ? 'AA'
         : 'FAIL',
    passesAA: ratio >= WCAG_THRESHOLDS.AA_NORMAL,
    passesAAA: ratio >= WCAG_THRESHOLDS.AAA_NORMAL,
    passesAALarge: ratio >= WCAG_THRESHOLDS.AA_LARGE,
    passesAAALarge: ratio >= WCAG_THRESHOLDS.AAA_LARGE,
  };
}

/**
 * Calculate contrast result between two colors
 */
export function getContrastResult(
  foreground: ColorToken,
  background: ColorToken
): ContrastResult {
  const ratio = calculateContrastRatio(foreground, background);
  return checkWCAGCompliance(ratio);
}

/**
 * Find minimum lightness for a color to pass WCAG against a background
 */
export function findMinLightnessForContrast(
  color: ColorToken,
  background: ColorToken,
  targetRatio: number
): number {
  const bgLum = oklchToRelativeLuminance(background);

  // Calculate required luminance for target contrast
  // (L1 + 0.05) / (L2 + 0.05) = ratio
  // If foreground is darker: L1 = (ratio * (L2 + 0.05)) - 0.05
  // If foreground is lighter: L1 = ((L2 + 0.05) / ratio) - 0.05

  const bgIsLight = background.l > 0.5;

  if (bgIsLight) {
    // Need darker foreground
    const requiredLum = ((bgLum + 0.05) / targetRatio) - 0.05;
    return Math.max(0, Math.min(1, requiredLum));
  } else {
    // Need lighter foreground
    const requiredLum = (targetRatio * (bgLum + 0.05)) - 0.05;
    return Math.max(0, Math.min(1, requiredLum));
  }
}

/**
 * Get compliance badge text
 */
export function getComplianceBadge(result: ContrastResult): string {
  if (result.passesAAA) {
    return 'AAA';
  }
  if (result.passesAA) {
    return 'AA';
  }
  if (result.passesAALarge) {
    return 'AA Large';
  }
  return 'Fail';
}

/**
 * Get compliance color class
 */
export function getComplianceColorClass(result: ContrastResult): string {
  if (result.passesAAA) {
    return 'text-green-600 bg-green-50';
  }
  if (result.passesAA) {
    return 'text-blue-600 bg-blue-50';
  }
  if (result.passesAALarge) {
    return 'text-yellow-600 bg-yellow-50';
  }
  return 'text-red-600 bg-red-50';
}

/**
 * Batch check multiple color pairs
 */
export interface ColorPair {
  name: string;
  foreground: ColorToken;
  background: ColorToken;
}

export interface BatchContrastResult extends ContrastResult {
  name: string;
}

export function batchCheckContrast(pairs: ColorPair[]): BatchContrastResult[] {
  return pairs.map((pair) => ({
    name: pair.name,
    ...getContrastResult(pair.foreground, pair.background),
  }));
}
