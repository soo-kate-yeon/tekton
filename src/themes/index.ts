/**
 * Theme system for design token generation
 * Provides pre-configured design system settings for common technology stacks
 *
 * @module themes
 */

export * from './types';
export * from './loader';

import type { Theme } from './types';
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
 * Options for token generation from theme
 */
export interface GenerateTokensOptions {
  /**
   * Output format for generated tokens
   * @default 'css'
   */
  format?: TokenFormat;
}

/**
 * Generate design tokens from a theme configuration
 * Convenience function that integrates theme with token generation workflow
 *
 * @param theme - Validated theme configuration
 * @param options - Token generation options
 * @returns Generated tokens in the specified format
 * @throws {Error} When an unsupported format is specified
 *
 * @example
 * ```typescript
 * import { loadDefaultTheme, generateTokensFromTheme } from 'tekton/themes';
 *
 * const theme = loadDefaultTheme('next-tailwind-shadcn');
 *
 * // Generate CSS variables
 * const css = generateTokensFromTheme(theme, { format: 'css' });
 *
 * // Generate DTCG JSON
 * const dtcg = generateTokensFromTheme(theme, { format: 'dtcg' });
 *
 * // Generate Tailwind config
 * const tailwind = generateTokensFromTheme(theme, { format: 'tailwind' });
 * ```
 */
export function generateTokensFromTheme(
  theme: Theme,
  options: GenerateTokensOptions = {}
): string {
  const { format = 'css' } = options;
  const { questionnaire } = theme;

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
