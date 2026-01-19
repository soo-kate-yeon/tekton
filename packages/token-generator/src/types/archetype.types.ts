/**
 * Type definitions for archetype/theme structure
 * Supports existing theme files from studio-mcp/src/theme/themes/
 *
 * @module types/archetype
 */

/**
 * OKLCH color format used in archetype themes
 * Compatible with existing theme files that use {l, c, h} structure
 */
export interface ArchetypeColor {
  /** Lightness: 0 (black) to 1 (white) */
  l: number;
  /** Chroma: 0 (grayscale) to ~0.4 (highly saturated) */
  c: number;
  /** Hue: 0-360 degrees */
  h: number;
}

/**
 * Color palette structure from existing themes
 * Contains the four main color roles
 */
export interface ColorPalette {
  /** Primary brand color */
  primary: ArchetypeColor;
  /** Secondary brand color */
  secondary: ArchetypeColor;
  /** Accent/highlight color */
  accent: ArchetypeColor;
  /** Neutral/gray color */
  neutral: ArchetypeColor;
}

/**
 * Stack information from theme files
 * Supports various styling and component libraries
 */
export interface StackInfo {
  framework: 'nextjs' | 'vite' | 'remix';
  styling: 'tailwindcss' | 'styled-components' | 'css-modules' | 'emotion';
  components?: 'shadcn-ui' | 'radix-ui' | 'headless-ui' | 'none';
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
  borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full';
  density: 'compact' | 'comfortable' | 'spacious';
  contrast: 'low' | 'medium' | 'high' | 'maximum';
}

/**
 * AI context for theme generation
 */
export interface AIContext {
  brandTone: string;
  designPhilosophy: string;
  colorGuidance: string;
  componentGuidance: string;
  accessibilityNotes: string;
}

/**
 * Complete archetype theme structure
 * Matches the format used in existing theme JSON files
 */
export interface ArchetypeTheme {
  id: string;
  name: string;
  description: string;
  stackInfo: StackInfo;
  brandTone: string;
  colorPalette: ColorPalette;
  typography: Typography;
  componentDefaults: ComponentDefaults;
  aiContext: AIContext;
}
