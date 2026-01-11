import type { RGBColor, AccessibilityCheck } from './schemas';

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
