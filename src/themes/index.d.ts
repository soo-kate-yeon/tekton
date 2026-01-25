/**
 * Theme system for design token generation
 * Provides pre-configured design system settings for common technology stacks
 *
 * @module themes
 */
export * from './types';
export * from './loader';
import type { Theme } from './types';
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
export declare function generateTokensFromTheme(theme: Theme, options?: GenerateTokensOptions): string;
//# sourceMappingURL=index.d.ts.map