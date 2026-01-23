/**
 * TokenResolver
 * TAG: SPEC-THEME-BIND-001
 *
 * Resolves theme tokens from theme configuration files.
 * Implements caching and fallback strategies for robust theme loading.
 *
 * @example
 * ```typescript
 * const resolver = new TokenResolver();
 * const theme = await resolver.loadTheme('calm-wellness');
 * const tokens = resolver.resolveTokens(theme);
 * const primaryColor = resolver.getTokenValue(tokens, 'color-primary');
 * ```
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { ThemeConfig, ResolvedTokens, OKLCHColor } from '../types/theme-types.js';

/**
 * Default theme to use when theme is not found
 * REQ-TB-002: Always use "calm-wellness" as default theme
 */
const DEFAULT_THEME_ID = 'calm-wellness';

/**
 * TokenResolver class
 * Loads theme configurations and resolves tokens to CSS values
 */
export class TokenResolver {
  private themeCache: Map<string, ThemeConfig> = new Map();
  private themesDir: string;

  constructor() {
    // Determine themes directory path
    // In development: packages/studio-mcp/src/theme/themes/
    // We need to go up from component-generator to find studio-mcp
    const currentDir = process.cwd();
    this.themesDir = resolve(currentDir, '../studio-mcp/src/theme/themes');
  }

  /**
   * Load theme configuration by ID
   *
   * REQ-TB-001: Always resolve theme tokens for generated components
   * REQ-TB-005: WHEN renderScreen invoked with themeId, THEN load and apply theme
   *
   * @param themeId - Theme identifier (e.g., 'calm-wellness')
   * @returns Loaded theme configuration
   * @throws Error if theme file not found
   *
   * @example
   * ```typescript
   * const theme = await resolver.loadTheme('calm-wellness');
   * console.log(theme.brandTone); // 'calm'
   * ```
   */
  async loadTheme(themeId: string): Promise<ThemeConfig> {
    // Check cache first (performance optimization)
    if (this.themeCache.has(themeId)) {
      return this.themeCache.get(themeId)!;
    }

    try {
      const themePath = resolve(this.themesDir, `${themeId}.json`);
      const themeContent = readFileSync(themePath, 'utf-8');
      const theme: ThemeConfig = JSON.parse(themeContent);

      // Validate theme structure
      if (!theme.id || !theme.colorPalette || !theme.typography) {
        throw new Error(`Invalid theme structure in "${themeId}"`);
      }

      // Cache the loaded theme
      this.themeCache.set(themeId, theme);

      return theme;
    } catch (error) {
      // REQ-TB-013: NOT fail silently on theme errors
      throw new Error(
        `Failed to load theme "${themeId}": ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Resolve theme configuration to CSS token values
   *
   * REQ-TB-001: Always resolve theme tokens for generated components
   * REQ-TB-004: Always use CSS variable syntax var(--token-name)
   * REQ-TB-012: NOT hardcode color/size values
   *
   * @param theme - Theme configuration
   * @returns Map of semantic token names to CSS values
   *
   * @example
   * ```typescript
   * const tokens = resolver.resolveTokens(theme);
   * console.log(tokens['color-primary']); // 'oklch(0.70 0.10 170)'
   * ```
   */
  resolveTokens(theme: ThemeConfig): ResolvedTokens {
    const tokens: ResolvedTokens = {};

    // Resolve color palette to OKLCH CSS values
    // Semantic naming without vendor prefix (REQ-TB-004)
    tokens['color-primary'] = this.oklchToCSS(theme.colorPalette.primary);
    tokens['color-secondary'] = this.oklchToCSS(theme.colorPalette.secondary);
    tokens['color-accent'] = this.oklchToCSS(theme.colorPalette.accent);
    tokens['color-neutral'] = this.oklchToCSS(theme.colorPalette.neutral);

    // Resolve typography tokens
    tokens['font-family'] = theme.typography.fontFamily;
    tokens['font-scale'] = theme.typography.fontScale;
    tokens['font-weight-heading'] = String(theme.typography.headingWeight);
    tokens['font-weight-body'] = String(theme.typography.bodyWeight);

    // Resolve component defaults
    tokens['border-radius'] = this.mapBorderRadius(theme.componentDefaults.borderRadius);
    tokens['density'] = theme.componentDefaults.density;
    tokens['contrast'] = theme.componentDefaults.contrast;

    return tokens;
  }

  /**
   * Get specific token value with optional fallback
   *
   * REQ-TB-010: IF token undefined, THEN use fallback with warning
   * REQ-TB-013: NOT fail silently on theme errors
   *
   * @param tokens - Resolved tokens map
   * @param tokenName - Token name to retrieve
   * @param fallback - Fallback value if token not found
   * @param warnOnMissing - Whether to warn if token is missing (default: false)
   * @returns Token value or fallback
   *
   * @example
   * ```typescript
   * const color = resolver.getTokenValue(tokens, 'color-primary', '#000000', true);
   * ```
   */
  getTokenValue(
    tokens: ResolvedTokens,
    tokenName: string,
    fallback?: string,
    warnOnMissing = false
  ): string | undefined {
    const value = tokens[tokenName];

    if (value === undefined) {
      if (warnOnMissing) {
        // REQ-TB-013: NOT fail silently - warn about missing tokens
        console.warn(`Token not found: ${tokenName}${fallback ? `, using fallback: ${fallback}` : ''}`);
      }
      return fallback;
    }

    return value;
  }

  /**
   * Convert OKLCH color object to CSS oklch() string
   * @param color - OKLCH color values
   * @returns CSS oklch() string
   */
  private oklchToCSS(color: OKLCHColor): string {
    // Format: oklch(L C H)
    // L: 0-1 (percentage as decimal)
    // C: 0-0.4 typical (chroma)
    // H: 0-360 (hue in degrees)
    return `oklch(${color.l.toFixed(2)} ${color.c.toFixed(2)} ${color.h})`;
  }

  /**
   * Map border radius setting to CSS value
   * @param radius - Border radius setting
   * @returns CSS border radius value
   */
  private mapBorderRadius(radius: 'small' | 'medium' | 'large'): string {
    const radiusMap = {
      small: '4px',
      medium: '8px',
      large: '16px',
    };
    return radiusMap[radius];
  }

  /**
   * Load theme with fallback to default
   * @param themeId - Theme identifier
   * @param fallbackThemeId - Fallback theme (defaults to DEFAULT_THEME_ID)
   * @returns Loaded theme configuration
   */
  async loadThemeWithFallback(
    themeId: string,
    fallbackThemeId: string = DEFAULT_THEME_ID
  ): Promise<ThemeConfig> {
    try {
      return await this.loadTheme(themeId);
    } catch (error) {
      console.warn(
        `Theme "${themeId}" not found, falling back to "${fallbackThemeId}": ${error instanceof Error ? error.message : String(error)}`
      );
      return await this.loadTheme(fallbackThemeId);
    }
  }
}
