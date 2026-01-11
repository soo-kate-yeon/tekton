/**
 * Preset system for design token generation
 * Provides pre-configured design system settings for common technology stacks
 *
 * @module presets
 */

export * from './types';
export * from './loader';

import type { Preset } from './types';
import { generateNeutralPalette } from '../generator/neutral-palette';
import { mapSemanticTokens } from '../generator/semantic-mapper';
import { exportToCSS, exportToDTCG, exportToTailwind } from '../generator/output';
import type { ExportConfig } from '../generator/output';
import type { OKLCHColor } from '../schemas';

/**
 * Token generation format options
 */
export type TokenFormat = 'css' | 'dtcg' | 'tailwind';

/**
 * Options for token generation from preset
 */
export interface GenerateTokensOptions {
  /**
   * Output format for generated tokens
   * @default 'css'
   */
  format?: TokenFormat;
}

/**
 * Generate design tokens from a preset configuration
 * Convenience function that integrates preset with token generation workflow
 *
 * @param preset - Validated preset configuration
 * @param options - Token generation options
 * @returns Generated tokens in the specified format
 * @throws {Error} When an unsupported format is specified
 *
 * @example
 * ```typescript
 * import { loadDefaultPreset, generateTokensFromPreset } from 'tekton/presets';
 *
 * const preset = loadDefaultPreset('next-tailwind-shadcn');
 *
 * // Generate CSS variables
 * const css = generateTokensFromPreset(preset, { format: 'css' });
 *
 * // Generate DTCG JSON
 * const dtcg = generateTokensFromPreset(preset, { format: 'dtcg' });
 *
 * // Generate Tailwind config
 * const tailwind = generateTokensFromPreset(preset, { format: 'tailwind' });
 * ```
 */
export function generateTokensFromPreset(
  preset: Preset,
  options: GenerateTokensOptions = {}
): string {
  const { format = 'css' } = options;
  const { questionnaire } = preset;

  // Extract and validate primaryColor (required by Zod schema)
  const primaryColor: OKLCHColor = questionnaire.primaryColor || {
    l: 0.5,
    c: 0.15,
    h: 220,
  };

  // Generate neutral palette based on questionnaire settings
  const neutralPalette = generateNeutralPalette({
    mode: 'light',
    tinting: questionnaire.neutralTone === 'pure' ? 'pure' : 'tinted',
    primaryHue: primaryColor.h,
  });

  // Extract neutral base color (500 step is always generated)
  const neutralBase: OKLCHColor = neutralPalette['500'] || {
    l: 0.5,
    c: 0,
    h: 0,
  };

  // Map to semantic tokens
  const semanticTokens = mapSemanticTokens({
    mode: 'light',
    primary: primaryColor,
    neutral: neutralBase,
  });

  // Prepare export configuration
  const exportConfig: ExportConfig = {
    semanticTokens,
  };

  // Export based on format
  switch (format) {
    case 'css':
      return exportToCSS(exportConfig);
    case 'dtcg':
      return exportToDTCG(exportConfig);
    case 'tailwind':
      return exportToTailwind({ ...exportConfig, format: 'js' });
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}
