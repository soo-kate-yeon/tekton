/**
 * OKLCH to RGB color conversion using culori library
 * Provides perceptually uniform color space conversion with sRGB gamut clipping
 *
 * @module color/oklch-converter
 */

import { oklch, rgb } from 'culori';
import type { ArchetypeColor } from '../types/archetype.types.js';
import { clipToSrgbGamut } from './gamut-clipper.js';

/**
 * RGB color format with 0-255 integer values
 */
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Convert OKLCH color to RGB format
 * Uses culori library for accurate color space conversion
 *
 * @param color - OKLCH color with l (0-1), c (≥0), h (0-360)
 * @returns RGB color with r, g, b values (0-255)
 *
 * @example
 * ```typescript
 * const oklchColor = { l: 0.5, c: 0.15, h: 220 };
 * const rgbColor = oklchToRgb(oklchColor);
 * // Returns: { r: 59, g: 120, b: 193 }
 * ```
 */
export function oklchToRgb(color: ArchetypeColor): RGBColor {
  // Clip to sRGB gamut first to ensure valid RGB output
  const clippedColor = clipToSrgbGamut(color);

  // Create OKLCH color object for culori
  const oklchColor = oklch({
    mode: 'oklch',
    l: clippedColor.l,
    c: clippedColor.c,
    h: clippedColor.h,
  });

  // Convert to RGB color space
  const rgbColor = rgb(oklchColor);

  // Handle undefined/null case (shouldn't happen with valid input)
  if (!rgbColor) {
    throw new Error('Failed to convert OKLCH to RGB');
  }

  // Convert normalized RGB (0-1) to 8-bit RGB (0-255)
  // Round to nearest integer for consistent output
  // Clamp to [0, 255] range to handle any floating point precision issues
  return {
    r: Math.max(0, Math.min(255, Math.round((rgbColor.r ?? 0) * 255))),
    g: Math.max(0, Math.min(255, Math.round((rgbColor.g ?? 0) * 255))),
    b: Math.max(0, Math.min(255, Math.round((rgbColor.b ?? 0) * 255))),
  };
}

/**
 * Convert RGB color to hexadecimal format
 *
 * @param color - RGB color with r, g, b values (0-255)
 * @returns Hex color string in format #rrggbb
 *
 * @example
 * ```typescript
 * const rgb = { r: 255, g: 0, b: 0 };
 * const hex = rgbToHex(rgb);
 * // Returns: "#ff0000"
 * ```
 */
export function rgbToHex(color: RGBColor): string {
  const r = color.r.toString(16).padStart(2, '0');
  const g = color.g.toString(16).padStart(2, '0');
  const b = color.b.toString(16).padStart(2, '0');

  return `#${r}${g}${b}`;
}

/**
 * Convert OKLCH color directly to hexadecimal format
 * Convenience function combining oklchToRgb and rgbToHex
 *
 * @param color - OKLCH color with l (0-1), c (≥0), h (0-360)
 * @returns Hex color string in format #rrggbb
 *
 * @example
 * ```typescript
 * const oklch = { l: 0.5, c: 0.15, h: 220 };
 * const hex = oklchToHex(oklch);
 * // Returns: "#3b78c1"
 * ```
 */
export function oklchToHex(color: ArchetypeColor): string {
  const rgb = oklchToRgb(color);
  return rgbToHex(rgb);
}
