/**
 * OKLCH Color Utilities
 * Conversion and manipulation functions for OKLCH color space
 */

import type { ColorToken } from '@tekton/token-contract';

/**
 * OKLCH color bounds
 */
export const OKLCH_BOUNDS = {
  l: { min: 0, max: 1, step: 0.01 },      // Lightness
  c: { min: 0, max: 0.4, step: 0.01 },    // Chroma
  h: { min: 0, max: 360, step: 1 },       // Hue
} as const;

/**
 * Color scale step keys (Tailwind-compatible)
 */
export const COLOR_SCALE_STEPS = [
  '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950',
] as const;

export type ColorScaleStep = typeof COLOR_SCALE_STEPS[number];

/**
 * Convert ColorToken to OKLCH CSS string
 */
export function colorTokenToCSS(color: ColorToken): string {
  return `oklch(${color.l} ${color.c} ${color.h})`;
}

/**
 * Parse CSS OKLCH string to ColorToken
 */
export function parseOKLCHString(cssString: string): ColorToken | null {
  const match = cssString.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!match) {
    return null;
  }

  const l = parseFloat(match[1]);
  const c = parseFloat(match[2]);
  const h = parseFloat(match[3]);

  if (isNaN(l) || isNaN(c) || isNaN(h)) {
    return null;
  }

  return { l, c, h };
}

/**
 * Clamp OKLCH values to valid bounds
 */
export function clampOKLCH(color: ColorToken): ColorToken {
  return {
    l: Math.max(OKLCH_BOUNDS.l.min, Math.min(OKLCH_BOUNDS.l.max, color.l)),
    c: Math.max(OKLCH_BOUNDS.c.min, Math.min(OKLCH_BOUNDS.c.max, color.c)),
    h: Math.max(OKLCH_BOUNDS.h.min, Math.min(OKLCH_BOUNDS.h.max, color.h)),
  };
}

/**
 * Round OKLCH values to reasonable precision
 */
export function roundOKLCH(color: ColorToken, decimals = 3): ColorToken {
  const factor = Math.pow(10, decimals);
  return {
    l: Math.round(color.l * factor) / factor,
    c: Math.round(color.c * factor) / factor,
    h: Math.round(color.h * factor) / factor,
  };
}

/**
 * Approximate OKLCH to sRGB hex color
 * Uses simplified lightness-based approximation for preview
 */
export function oklchToHex(color: ColorToken): string {
  // Simplified conversion using lightness as primary factor
  // For accurate conversion, use a proper color library
  const { l, c, h } = color;

  // Convert hue to radians
  const hRad = (h * Math.PI) / 180;

  // Approximate a and b from chroma and hue
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // Simplified OKLCH to sRGB (approximate)
  // This is a rough approximation - for production, use culori or color.js
  const r = Math.round(Math.max(0, Math.min(255, (l + 0.3963377774 * a + 0.2158037573 * b) * 255)));
  const g = Math.round(Math.max(0, Math.min(255, (l - 0.1055613458 * a - 0.0638541728 * b) * 255)));
  const bl = Math.round(Math.max(0, Math.min(255, (l - 0.0894841775 * a - 1.2914855480 * b) * 255)));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`;
}

/**
 * Create intermediate color between two colors
 */
export function interpolateOKLCH(
  color1: ColorToken,
  color2: ColorToken,
  t: number
): ColorToken {
  return clampOKLCH({
    l: color1.l + (color2.l - color1.l) * t,
    c: color1.c + (color2.c - color1.c) * t,
    h: interpolateHue(color1.h, color2.h, t),
  });
}

/**
 * Interpolate hue (handles wrapping at 360)
 */
function interpolateHue(h1: number, h2: number, t: number): number {
  const diff = h2 - h1;

  // Take shortest path around the circle
  if (Math.abs(diff) > 180) {
    if (diff > 0) {
      h1 += 360;
    } else {
      h2 += 360;
    }
  }

  const result = h1 + (h2 - h1) * t;
  return ((result % 360) + 360) % 360;
}

/**
 * Generate a complete color scale from a base color
 * Maintains consistent hue and chroma, varies lightness
 */
export function generateColorScale(
  baseColor: ColorToken,
  baseStep: ColorScaleStep = '500'
): Record<ColorScaleStep, ColorToken> {
  const { c, h } = baseColor;
  const baseLightness = baseColor.l;

  // Lightness values for each step (Tailwind-inspired)
  const lightnessMap: Record<ColorScaleStep, number> = {
    '50': 0.97,
    '100': 0.94,
    '200': 0.86,
    '300': 0.76,
    '400': 0.64,
    '500': 0.53,
    '600': 0.45,
    '700': 0.38,
    '800': 0.30,
    '900': 0.22,
    '950': 0.15,
  };

  // Adjust lightness scale to maintain base color at base step
  const baseLightnessTarget = lightnessMap[baseStep];
  const lightnessOffset = baseLightness - baseLightnessTarget;

  const scale: Partial<Record<ColorScaleStep, ColorToken>> = {};

  COLOR_SCALE_STEPS.forEach((step) => {
    const targetLightness = lightnessMap[step] + lightnessOffset;

    // Reduce chroma for very light and very dark colors
    const chromaFactor = step === '50' || step === '950' ? 0.5 :
                         step === '100' || step === '900' ? 0.7 :
                         step === '200' || step === '800' ? 0.85 : 1;

    scale[step] = clampOKLCH({
      l: targetLightness,
      c: c * chromaFactor,
      h,
    });
  });

  return scale as Record<ColorScaleStep, ColorToken>;
}

/**
 * Check if two colors are visually similar
 */
export function areColorsSimilar(
  color1: ColorToken,
  color2: ColorToken,
  threshold = 0.02
): boolean {
  const deltaL = Math.abs(color1.l - color2.l);
  const deltaC = Math.abs(color1.c - color2.c);
  const deltaH = Math.abs(color1.h - color2.h);

  return deltaL < threshold && deltaC < threshold && deltaH < threshold * 360;
}
