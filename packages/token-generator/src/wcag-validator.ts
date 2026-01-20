import type { RGBColor, AccessibilityCheck } from '@tekton/theme';
import type { ArchetypeColor } from './types/archetype.types.js';
import { oklchToRgb } from './color/oklch-converter.js';

/**
 * Calculate relative luminance of an RGB color
 * Formula from WCAG 2.1 specification
 */
function calculateRelativeLuminance(rgb: RGBColor): number {
  const { r, g, b } = rgb;

  // Convert to 0-1 range
  const [rs, gs, bs] = [r / 255, g / 255, b / 255];

  // Apply gamma correction
  const linearize = (channel: number): number => {
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  };

  const [rl, gl, bl] = [linearize(rs), linearize(gs), linearize(bs)];

  // Calculate luminance with weighted RGB values
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

/**
 * Calculate contrast ratio between two RGB colors
 * Returns a value between 1 and 21
 * Formula: (L1 + 0.05) / (L2 + 0.05) where L1 is the lighter color
 */
export function calculateContrastRatio(color1: RGBColor, color2: RGBColor): number {
  const lum1 = calculateRelativeLuminance(color1);
  const lum2 = calculateRelativeLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if a contrast ratio meets WCAG compliance level
 * WCAG AA: minimum 4.5:1 for normal text, 3:1 for large text
 * WCAG AAA: minimum 7:1 for normal text, 4.5:1 for large text
 */
export function checkWCAGCompliance(
  contrastRatio: number,
  level: 'AA' | 'AAA',
  isLargeText: boolean = false
): AccessibilityCheck {
  const threshold = isLargeText
    ? level === 'AA' ? 3.0 : 4.5
    : level === 'AA' ? 4.5 : 7.0;

  return {
    contrastRatio,
    wcagLevel: level,
    passed: contrastRatio >= threshold,
  };
}

/**
 * Validate a color pair for WCAG compliance
 * Returns full accessibility check result with both colors
 */
export function validateColorPair(
  foreground: RGBColor,
  background: RGBColor,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): AccessibilityCheck {
  const contrastRatio = calculateContrastRatio(foreground, background);
  const result = checkWCAGCompliance(contrastRatio, level, isLargeText);

  return {
    ...result,
    foreground,
    background,
  };
}

/**
 * Find the minimum lightness adjustment needed for WCAG compliance
 * Returns suggested lightness value, or null if already compliant
 */
export function suggestLightnessAdjustment(
  foreground: RGBColor,
  background: RGBColor,
  targetLevel: 'AA' | 'AAA' = 'AA'
): number | null {
  const currentRatio = calculateContrastRatio(foreground, background);
  const result = checkWCAGCompliance(currentRatio, targetLevel);

  if (result.passed) {
    return null;
  }

  // Simple heuristic: suggest darkening or lightening by 10% increments
  // In production, this would use OKLCH adjustments
  const fgLum = calculateRelativeLuminance(foreground);
  const bgLum = calculateRelativeLuminance(background);

  if (fgLum > bgLum) {
    // Foreground is lighter, suggest darkening it
    return Math.max(0, fgLum - 0.1);
  } else {
    // Foreground is darker, suggest lightening background
    return Math.min(1, bgLum + 0.1);
  }
}

/**
 * Advanced contrast adjustment using OKLCH color space
 * Preserves hue while adjusting lightness to achieve WCAG compliance
 *
 * @param color - OKLCH color to adjust
 * @param background - Background RGB color to test against
 * @param targetLevel - WCAG level ('AA' | 'AAA')
 * @param maxIterations - Maximum adjustment iterations (default: 20)
 * @returns Adjusted OKLCH color or null if impossible to fix
 */
export function autoAdjustContrast(
  color: ArchetypeColor,
  background: RGBColor,
  targetLevel: 'AA' | 'AAA' = 'AA',
  maxIterations: number = 20
): ArchetypeColor | null {
  const threshold = targetLevel === 'AA' ? 4.5 : 7.0;

  // Check if already compliant
  const currentRgb = oklchToRgb(color);
  const currentRatio = calculateContrastRatio(currentRgb, background);

  if (currentRatio >= threshold) {
    return color;
  }

  // Determine adjustment direction based on background luminance
  const bgLuminance = calculateRelativeLuminance(background);

  // Binary search for optimal lightness
  let minL = 0;
  let maxL = 1;
  let bestColor: ArchetypeColor | null = null;
  let bestRatio = 0;

  // Determine if we should search darker or lighter
  const needsDarker = bgLuminance > 0.5;

  if (needsDarker) {
    // For light backgrounds, search darker values
    maxL = color.l;
  } else {
    // For dark backgrounds, search lighter values
    minL = color.l;
  }

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const targetL = (minL + maxL) / 2;
    const adjustedColor = { ...color, l: targetL };
    const testRgb = oklchToRgb(adjustedColor);
    const testRatio = calculateContrastRatio(testRgb, background);

    // Track best result so far
    if (testRatio > bestRatio) {
      bestRatio = testRatio;
      bestColor = adjustedColor;
    }

    // Check if we found a compliant color
    if (testRatio >= threshold) {
      return adjustedColor;
    }

    // Adjust search range based on whether we need more or less contrast
    if (testRatio < threshold) {
      if (needsDarker) {
        // Need even darker
        maxL = targetL;
      } else {
        // Need even lighter
        minL = targetL;
      }
    }

    // Check if we've converged
    if (Math.abs(maxL - minL) < 0.001) {
      break;
    }
  }

  // Return best result if we got close enough (within 10% of threshold)
  if (bestColor && bestRatio >= threshold * 0.9) {
    return bestColor;
  }

  return null;
}

/**
 * Detect if a color pair is impossible to fix
 * Returns warning message with suggestions if impossible
 */
export function detectImpossiblePair(
  foreground: RGBColor,
  background: RGBColor,
  targetLevel: 'AA' | 'AAA' = 'AA'
): { impossible: boolean; message?: string; suggestions?: string[] } {
  const bgLum = calculateRelativeLuminance(background);
  const fgLum = calculateRelativeLuminance(foreground);
  const currentRatio = calculateContrastRatio(foreground, background);
  const threshold = targetLevel === 'AA' ? 4.5 : 7.0;

  // If already compliant, not impossible
  if (currentRatio >= threshold) {
    return { impossible: false };
  }

  // Check if both colors are very similar in luminance
  const lumDiff = Math.abs(bgLum - fgLum);

  if (lumDiff < 0.05 && currentRatio < 2.0) {
    return {
      impossible: true,
      message: `Colors are too similar in luminance (${currentRatio.toFixed(2)}:1). Cannot achieve ${threshold}:1 contrast.`,
      suggestions: [
        'Use a significantly darker foreground color (L < 0.3)',
        'Use a significantly lighter background color (L > 0.8)',
        'Consider a different color palette with higher contrast potential',
      ],
    };
  }

  // Check if background is mid-tone (hard to achieve high contrast)
  if (bgLum > 0.3 && bgLum < 0.7 && targetLevel === 'AAA') {
    return {
      impossible: true,
      message: `Mid-tone background (L=${bgLum.toFixed(2)}) makes AAA compliance difficult.`,
      suggestions: [
        'Use pure black (L=0) or pure white (L=1) as foreground',
        'Change background to lighter (L > 0.8) or darker (L < 0.3)',
        'Consider AA level instead of AAA for this color combination',
      ],
    };
  }

  return { impossible: false };
}
