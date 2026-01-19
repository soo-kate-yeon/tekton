/**
 * sRGB gamut clipping with chroma reduction
 * Clips out-of-gamut OKLCH colors while preserving lightness and hue
 *
 * @module color/gamut-clipper
 */

import { oklch, inGamut } from 'culori';
import type { ArchetypeColor } from '../types/archetype.types.js';

/**
 * Check if an OKLCH color is within the sRGB gamut
 *
 * @param color - OKLCH color to check
 * @returns true if color is displayable in sRGB, false otherwise
 *
 * @example
 * ```typescript
 * const color = { l: 0.5, c: 0.05, h: 220 };
 * const inGamut = isInSrgbGamut(color);
 * // Returns: true
 * ```
 */
export function isInSrgbGamut(color: ArchetypeColor): boolean {
  // Handle edge cases: pure black and pure white are always in gamut
  if ((color.l === 0 || color.l === 1) && color.c === 0) {
    return true;
  }

  const oklchColor = oklch({
    mode: 'oklch',
    l: color.l,
    c: color.c,
    h: color.h,
  });

  // Use culori's inGamut function for sRGB space
  return inGamut('rgb')(oklchColor);
}

/**
 * Clip OKLCH color to sRGB gamut by reducing chroma
 * Preserves lightness (L) and hue (H) for perceptual uniformity
 *
 * Algorithm:
 * 1. Check if color is already in gamut - return unchanged if so
 * 2. Binary search for maximum chroma that stays in gamut
 * 3. Preserve lightness and hue throughout
 *
 * @param color - OKLCH color that may be out of gamut
 * @returns Clipped OKLCH color guaranteed to be in sRGB gamut
 *
 * @example
 * ```typescript
 * const outOfGamut = { l: 0.5, c: 0.4, h: 220 };
 * const clipped = clipToSrgbGamut(outOfGamut);
 * // Returns: { l: 0.5, c: 0.18, h: 220 } (example)
 * ```
 */
export function clipToSrgbGamut(color: ArchetypeColor): ArchetypeColor {
  // Fast path: if already in gamut, return as-is
  if (isInSrgbGamut(color)) {
    return { ...color };
  }

  // Binary search for maximum chroma that stays in gamut
  // Preserve lightness and hue
  let minChroma = 0;
  let maxChroma = color.c;
  let bestChroma = 0;

  // Binary search with 20 iterations gives precision of ~0.000001
  // More than sufficient for color accuracy
  const iterations = 20;

  for (let i = 0; i < iterations; i++) {
    const testChroma = (minChroma + maxChroma) / 2;

    const testColor: ArchetypeColor = {
      l: color.l,
      c: testChroma,
      h: color.h,
    };

    if (isInSrgbGamut(testColor)) {
      // This chroma works, try higher
      bestChroma = testChroma;
      minChroma = testChroma;
    } else {
      // This chroma is too high, try lower
      maxChroma = testChroma;
    }
  }

  return {
    l: color.l,
    c: bestChroma,
    h: color.h,
  };
}
