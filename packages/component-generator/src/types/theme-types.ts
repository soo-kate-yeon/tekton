/**
 * Theme Type Definitions
 * TAG: SPEC-THEME-BIND-001
 *
 * Types for theme configuration and token resolution
 */

/**
 * OKLCH color representation
 * @see https://oklch.com
 */
export interface OKLCHColor {
  /** Lightness (0-1) */
  l: number;
  /** Chroma (0-0.4 typical) */
  c: number;
  /** Hue (0-360 degrees) */
  h: number;
}

/**
 * Color palette with OKLCH values
 */
export interface ColorPalette {
  primary: OKLCHColor;
  secondary: OKLCHColor;
  accent: OKLCHColor;
  neutral: OKLCHColor;
}

/**
 * Typography configuration
 */
export interface Typography {
  fontFamily: string;
  fontScale: 'small' | 'medium' | 'large';
  headingWeight: number;
  bodyWeight: number;
}

/**
 * Component default settings
 */
export interface ComponentDefaults {
  borderRadius: 'small' | 'medium' | 'large';
  density: 'compact' | 'comfortable' | 'spacious';
  contrast: 'low' | 'medium' | 'high';
}

/**
 * Stack information for theme
 */
export interface StackInfo {
  framework: string;
  styling: string;
  components: string;
}

/**
 * AI context guidance for theme application
 */
export interface AIContext {
  brandTone: string;
  designPhilosophy: string;
  colorGuidance: string;
  componentGuidance: string;
  accessibilityNotes: string;
}

/**
 * Complete theme configuration
 * Matches the structure of theme JSON files
 */
export interface ThemeConfig {
  /** Unique theme identifier */
  id: string;
  /** Human-readable theme name */
  name: string;
  /** Theme description */
  description: string;
  /** Technology stack information */
  stackInfo: StackInfo;
  /** Brand tone (calm, professional, energetic, etc.) */
  brandTone: string;
  /** Color palette with OKLCH values */
  colorPalette: ColorPalette;
  /** Typography settings */
  typography: Typography;
  /** Component default settings */
  componentDefaults: ComponentDefaults;
  /** AI context and guidance */
  aiContext: AIContext;
}

/**
 * Resolved CSS variable tokens
 * Maps semantic token names to CSS values
 *
 * @example
 * {
 *   'color-primary': 'oklch(0.70 0.10 170)',
 *   'color-surface': '#ffffff',
 *   'spacing-base': '1rem',
 *   'border-radius-large': '16px'
 * }
 */
export type ResolvedTokens = Record<string, string>;

/**
 * Theme resolution options
 */
export interface ThemeOptions {
  /** Theme identifier to load */
  themeId: string;
  /** Fallback theme if themeId not found (defaults to 'calm-wellness') */
  fallbackTheme?: string;
  /** Warn when tokens are missing (defaults to true) */
  warnOnMissingTokens?: boolean;
}

/**
 * Build context for component generation with theme support
 * TAG: SPEC-THEME-BIND-001 TASK-005
 *
 * This context is passed to component builders to enable theme token injection.
 * When provided, components will receive CSS variable styles based on their tokenBindings.
 *
 * @example
 * ```typescript
 * const context: BuildContext = {
 *   themeId: 'calm-wellness',
 *   componentName: 'Card',
 *   state: 'default',
 *   tokenBindings: {
 *     backgroundColor: 'color-surface',
 *     borderRadius: 'radius-lg',
 *     boxShadow: 'shadow-md'
 *   }
 * };
 * const jsxElement = buildComponentNode(componentNode, context);
 * // Generates: <Card style={{ backgroundColor: "var(--color-surface)", ... }} />
 * ```
 */
export interface BuildContext {
  /** Theme ID being applied */
  themeId: string;
  /** Component name for token lookup */
  componentName: string;
  /** Component state (default, hover, focus, etc.) */
  state: 'default' | 'hover' | 'focus' | 'active' | 'disabled';
  /** Resolved token bindings for this component and state */
  tokenBindings?: Record<string, string>;
}
