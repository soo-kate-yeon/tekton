/**
 * @tekton/core - Theme Module
 * v2.1 Theme System - Load themes from .moai/themes/generated/
 *
 * MIGRATION NOTICE:
 * - v1 themes (packages/core/themes/) have been removed
 * - All themes now use v2.1 schema from .moai/themes/generated/
 * - Use loadThemeV2() and ThemeV2 type for new code
 */

// Re-export all v2.1 theme functionality
export {
  // Types
  type ThemeV2,
  type ThemeMetaV2,
  type DesignDNA,
  type AtomicTokensV2,
  type SemanticTokensV2,
  type ComponentTokensV2,
  type StateLayerTokens,
  type MotionTokens,
  type ElevationTokens,
  type BorderTokens,
  type TypographyTokens,
  type DensityTokens,
  type EffectsTokens,
  type AIContext,
  type DarkModeOverrides,
  type OKLCHColorV2,

  // Functions
  loadThemeV2,
  listThemesV2,
  themeExistsV2,
  oklchToCSSV2,
  resolveTokenRef,
} from './theme-v2.js';

// ============================================================================
// Convenience Aliases (Primary API)
// ============================================================================

import {
  loadThemeV2,
  listThemesV2,
  themeExistsV2,
  oklchToCSSV2,
  type ThemeV2,
  type ThemeMetaV2,
  type OKLCHColorV2,
} from './theme-v2.js';

/**
 * Load a theme by ID
 * @param themeId - Theme identifier (e.g., "atlantic-magazine-v1")
 * @returns Theme object or null if not found
 *
 * @example
 * ```typescript
 * const theme = loadTheme('atlantic-magazine-v1');
 * if (theme) {
 *   console.log(theme.brandTone); // "professional"
 * }
 * ```
 */
export function loadTheme(themeId: string): ThemeV2 | null {
  return loadThemeV2(themeId);
}

/**
 * List all available themes
 * @returns Array of theme metadata
 */
export function listThemes(): ThemeMetaV2[] {
  return listThemesV2();
}

/**
 * Check if a theme exists
 * @param themeId - Theme identifier
 */
export function themeExists(themeId: string): boolean {
  return themeExistsV2(themeId);
}

/**
 * Convert OKLCH color to CSS string
 */
export function oklchToCSS(color: OKLCHColorV2): string {
  return oklchToCSSV2(color);
}

// Type aliases for convenience
export type Theme = ThemeV2;
export type ThemeMeta = ThemeMetaV2;
export type OKLCHColor = OKLCHColorV2;

// ============================================================================
// Deprecated - Remove in next major version
// ============================================================================

/**
 * @deprecated v1 built-in themes have been removed. Use themes from .moai/themes/generated/
 */
export const BUILTIN_THEMES: readonly string[] = [];

/**
 * @deprecated v1 built-in themes have been removed
 */
export type BuiltinThemeId = never;

/**
 * @deprecated v1 built-in themes have been removed
 */
export function isBuiltinTheme(_themeId: string): _themeId is BuiltinThemeId {
  console.warn('isBuiltinTheme() is deprecated. All themes now come from .moai/themes/generated/');
  return false;
}

/**
 * @deprecated Use theme tokens directly. This function provided minimal v1 CSS output.
 * For v2.1, use generateThemeCSS() from css-generator.ts with proper token resolution.
 */
export function generateCSSVariables(_theme: ThemeV2): Record<string, string> {
  console.warn('generateCSSVariables() is deprecated. Use generateThemeCSS() for v2.1 themes.');
  return {};
}
