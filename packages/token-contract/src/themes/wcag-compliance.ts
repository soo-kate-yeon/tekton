import type { Preset } from './types.js';
import type { ColorToken } from '../schemas/index.js';

/**
 * Convert OKLCH to approximate sRGB for WCAG validation
 * Uses simplified lightness-based approximation
 * For production use, integrate with proper color conversion library
 */
function oklchToRGB(color: ColorToken): { r: number; g: number; b: number } {
  const { l } = color;

  // Simplified approach: use lightness as grayscale approximation
  // This ensures contrast ratios are based on perceptual lightness
  // which is the primary factor in WCAG contrast
  const gray = Math.round(l * 255);

  return {
    r: gray,
    g: gray,
    b: gray,
  };
}

/**
 * Calculate relative luminance from RGB
 */
function calculateRelativeLuminance(rgb: {
  r: number;
  g: number;
  b: number;
}): number {
  const { r, g, b } = rgb;

  const [rs, gs, bs] = [r / 255, g / 255, b / 255];

  const linearize = (channel: number): number => {
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  };

  const [rl, gl, bl] = [linearize(rs), linearize(gs), linearize(bs)];

  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

/**
 * Calculate contrast ratio between two colors
 */
function calculateContrastRatio(
  color1: ColorToken,
  color2: ColorToken
): number {
  const rgb1 = oklchToRGB(color1);
  const rgb2 = oklchToRGB(color2);

  const lum1 = calculateRelativeLuminance(rgb1);
  const lum2 = calculateRelativeLuminance(rgb2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * WCAG Compliance Check Result
 */
export interface WCAGCheck {
  semantic: string;
  step: string;
  contrastRatio: number;
  passed: boolean;
  level: 'AA' | 'AAA';
}

/**
 * WCAG Compliance Validation Result
 */
export interface WCAGComplianceResult {
  passed: boolean;
  level: 'AA' | 'AAA';
  checks: WCAGCheck[];
  violations: WCAGCheck[];
}

/**
 * Validate preset WCAG compliance
 * Tests color contrast against neutral background
 */
export function validateWCAGCompliance(
  preset: Preset,
  level: 'AA' | 'AAA' = 'AA'
): WCAGComplianceResult {
  const threshold = level === 'AA' ? 4.5 : 7.0;
  const checks: WCAGCheck[] = [];
  const violations: WCAGCheck[] = [];

  // Test against light and dark neutral backgrounds
  const lightBg = preset.tokens.neutral['50'];
  const darkBg = preset.tokens.neutral['900'];

  if (!lightBg || !darkBg) {
    throw new Error('Preset missing required neutral background colors');
  }

  // Test semantic colors at various steps
  const semanticColors = ['primary', 'success', 'warning', 'error'] as const;
  const testSteps = ['500', '600', '700'] as const;

  semanticColors.forEach(semantic => {
    const scale = preset.tokens[semantic];
    if (!scale) return;

    testSteps.forEach(step => {
      const color = scale[step];
      if (!color) return;

      // Test against light background
      const contrastLight = calculateContrastRatio(color, lightBg);
      const passedLight = contrastLight >= threshold;

      const checkLight: WCAGCheck = {
        semantic,
        step: `${step}-on-light`,
        contrastRatio: contrastLight,
        passed: passedLight,
        level,
      };

      checks.push(checkLight);
      if (!passedLight) {
        violations.push(checkLight);
      }

      // Test against dark background
      const contrastDark = calculateContrastRatio(color, darkBg);
      const passedDark = contrastDark >= threshold;

      const checkDark: WCAGCheck = {
        semantic,
        step: `${step}-on-dark`,
        contrastRatio: contrastDark,
        passed: passedDark,
        level,
      };

      checks.push(checkDark);
      if (!passedDark) {
        violations.push(checkDark);
      }
    });
  });

  return {
    passed: violations.length === 0,
    level,
    checks,
    violations,
  };
}
