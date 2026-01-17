/**
 * Preset Override Utilities
 * Override preset tokens with custom values and validation
 */

import type { SemanticToken, ColorScale } from '../schemas/index.js';

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Override preset tokens with custom values
 * @param baseTokens - Base semantic tokens
 * @param overrides - Partial override tokens
 * @returns Merged semantic tokens
 */
export function overridePresetTokens(
  baseTokens: SemanticToken,
  overrides: Partial<SemanticToken> | null | undefined
): SemanticToken {
  // Handle null/undefined overrides
  if (!overrides || typeof overrides !== 'object') {
    return baseTokens;
  }

  // Deep merge overrides into base tokens
  const result: SemanticToken = { ...baseTokens };

  for (const [tokenName, overrideScale] of Object.entries(overrides)) {
    if (overrideScale && typeof overrideScale === 'object') {
      const baseScale = result[tokenName as keyof SemanticToken];
      result[tokenName as keyof SemanticToken] = mergeTokens(
        baseScale,
        overrideScale as Partial<ColorScale>
      );
    }
  }

  return result;
}

/**
 * Validate override tokens against schema
 * @param overrides - Override tokens to validate
 * @returns Validation result
 */
export function validateOverride(
  overrides: Partial<SemanticToken> | null | undefined
): ValidationResult {
  // Handle null/undefined
  if (!overrides || typeof overrides !== 'object') {
    return {
      valid: false,
      errors: ['Override must be a valid object'],
    };
  }

  // Empty overrides are valid
  if (Object.keys(overrides).length === 0) {
    return { valid: true, errors: [] };
  }

  // Validate each token individually (allow partial color scales)
  const errors: string[] = [];

  for (const [tokenName, scale] of Object.entries(overrides)) {
    if (!scale || typeof scale !== 'object') {
      errors.push(`${tokenName}: Must be a color scale object`);
      continue;
    }

    // Validate each color value in the scale
    for (const [step, value] of Object.entries(scale)) {
      // Validate step is a valid number
      const stepNum = parseInt(step, 10);
      if (
        isNaN(stepNum) ||
        !['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'].includes(step)
      ) {
        errors.push(
          `${tokenName}.${step}: Invalid step. Must be one of: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`
        );
        continue;
      }

      // Validate color value format (ColorToken object or oklch string)
      const colorValue = value as any; // Type assertion needed for union type
      if (typeof colorValue === 'object' && colorValue !== null) {
        // Check for ColorToken structure
        if (!('l' in colorValue && 'c' in colorValue && 'h' in colorValue)) {
          errors.push(
            `${tokenName}.${step}: Invalid ColorToken format. Expected {l, c, h} properties`
          );
        }
      } else if (typeof colorValue === 'string') {
        // Allow oklch strings for backward compatibility
        if (!colorValue.startsWith('oklch(')) {
          errors.push(
            `${tokenName}.${step}: Invalid color format. Expected oklch() format or ColorToken object`
          );
        }
      } else {
        errors.push(
          `${tokenName}.${step}: Invalid color type. Expected ColorToken object or oklch string`
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Merge partial color scale into complete scale
 * @param baseScale - Base color scale
 * @param overrideScale - Partial override scale
 * @returns Merged color scale
 */
export function mergeTokens(
  baseScale: ColorScale | undefined,
  overrideScale: Partial<ColorScale> | undefined
): ColorScale {
  // If no base scale, use override as-is
  if (!baseScale || typeof baseScale !== 'object') {
    return (overrideScale || {}) as ColorScale;
  }

  // If no override, use base as-is
  if (!overrideScale || typeof overrideScale !== 'object') {
    return baseScale;
  }

  // Merge override into base
  return {
    ...baseScale,
    ...overrideScale,
  } as ColorScale;
}
