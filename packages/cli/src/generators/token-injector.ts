import type { ExtendedTokenPreset, BrandLevel } from '@tekton/theme';

/**
 * OKLCH color type
 */
interface OKLCHColor {
  l: number;
  c: number;
  h: number;
}

/**
 * Spacing token scale
 */
export interface SpacingTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

/**
 * Border radius token scale
 */
export interface RadiusTokens {
  none: string;
  sm: string;
  default: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  full: string;
}

/**
 * Shadow token scale
 */
export interface ShadowTokens {
  none: string;
  sm: string;
  default: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
}

/**
 * Typography token scale
 */
export interface TypographyTokens {
  fontFamily: {
    sans: string;
    serif: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  lineHeight: {
    none: string;
    tight: string;
    snug: string;
    normal: string;
    relaxed: string;
    loose: string;
  };
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
  };
}

/**
 * Complete design tokens including colors and additional scales
 */
export interface CompleteDesignTokens {
  colors: ExtendedTokenPreset;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  shadow: ShadowTokens;
  typography: TypographyTokens;
}

/**
 * Token injection options
 */
export interface TokenInjectionOptions {
  tokens: ExtendedTokenPreset;
  platform: 'web' | 'react-native';
  outputFormat: 'tailwind' | 'stylesheet' | 'css';
}

/**
 * Token injection result
 */
export interface TokenInjectionResult {
  success: boolean;
  code: string;
  format: string;
  error?: string;
}

/**
 * Generate Tailwind CSS tokens
 */
export function generateTailwindTokens(tokens: ExtendedTokenPreset): string {
  const lines: string[] = [];

  lines.push(':root {');
  lines.push('  /* Brand Colors */');

  // Brand tokens
  for (const [colorName, levels] of Object.entries(tokens.brand)) {
    const brandLevels = levels as BrandLevel;
    lines.push(`  --color-${colorName}-base: oklch(${brandLevels.base.l} ${brandLevels.base.c} ${brandLevels.base.h});`);
    lines.push(`  --color-${colorName}-light: oklch(${brandLevels.light.l} ${brandLevels.light.c} ${brandLevels.light.h});`);
    lines.push(`  --color-${colorName}-dark: oklch(${brandLevels.dark.l} ${brandLevels.dark.c} ${brandLevels.dark.h});`);
    lines.push(`  --color-${colorName}-contrast: oklch(${brandLevels.contrast.l} ${brandLevels.contrast.c} ${brandLevels.contrast.h});`);
  }

  lines.push('');
  lines.push('  /* Semantic Colors */');

  // Semantic tokens
  for (const [semanticName, color] of Object.entries(tokens.semantic)) {
    const oklchColor = color as OKLCHColor;
    lines.push(`  --color-${semanticName}: oklch(${oklchColor.l} ${oklchColor.c} ${oklchColor.h});`);
  }

  lines.push('');
  lines.push('  /* Neutral Colors */');

  // Neutral tokens
  for (const [level, color] of Object.entries(tokens.neutral)) {
    const oklchColor = color as OKLCHColor;
    lines.push(`  --color-neutral-${level}: oklch(${oklchColor.l} ${oklchColor.c} ${oklchColor.h});`);
  }

  lines.push('}');
  lines.push('');
  lines.push('/* Tailwind utilities */');
  lines.push('.bg-primary { background-color: var(--color-primary-base); }');
  lines.push('.text-primary { color: var(--color-primary-base); }');
  lines.push('.bg-success { background-color: var(--color-success); }');
  lines.push('.text-success { color: var(--color-success); }');
  lines.push('.bg-error { background-color: var(--color-error); }');
  lines.push('.text-error { color: var(--color-error); }');

  return lines.join('\n');
}

/**
 * Generate React Native StyleSheet tokens
 */
export function generateStyleSheetTokens(tokens: ExtendedTokenPreset): string {
  const lines: string[] = [];

  lines.push("import { StyleSheet } from 'react-native';");
  lines.push('');
  lines.push('export const colors = {');

  // Brand colors
  for (const [colorName, levels] of Object.entries(tokens.brand)) {
    const brandLevels = levels as BrandLevel;
    lines.push(`  ${colorName}Base: 'oklch(${brandLevels.base.l} ${brandLevels.base.c} ${brandLevels.base.h})',`);
    lines.push(`  ${colorName}Light: 'oklch(${brandLevels.light.l} ${brandLevels.light.c} ${brandLevels.light.h})',`);
    lines.push(`  ${colorName}Dark: 'oklch(${brandLevels.dark.l} ${brandLevels.dark.c} ${brandLevels.dark.h})',`);
  }

  // Semantic colors
  for (const [semanticName, color] of Object.entries(tokens.semantic)) {
    const oklchColor = color as OKLCHColor;
    lines.push(`  ${semanticName}: 'oklch(${oklchColor.l} ${oklchColor.c} ${oklchColor.h})',`);
  }

  // Neutral colors
  for (const [level, color] of Object.entries(tokens.neutral)) {
    const oklchColor = color as OKLCHColor;
    lines.push(`  neutral${level}: 'oklch(${oklchColor.l} ${oklchColor.c} ${oklchColor.h})',`);
  }

  lines.push('};');
  lines.push('');
  lines.push('export const styles = StyleSheet.create({');
  lines.push('  container: {');
  lines.push('    backgroundColor: colors.neutral50,');
  lines.push('  },');
  lines.push('  text: {');
  lines.push('    color: colors.neutral900,');
  lines.push('  },');
  lines.push('});');

  return lines.join('\n');
}

/**
 * Inject tokens based on platform
 */
export async function injectTokens(
  options: TokenInjectionOptions
): Promise<TokenInjectionResult> {
  try {
    let code: string;
    let format: string;

    if (options.platform === 'web' || options.outputFormat === 'tailwind') {
      code = generateTailwindTokens(options.tokens);
      format = 'tailwind';
    } else if (options.platform === 'react-native' || options.outputFormat === 'stylesheet') {
      code = generateStyleSheetTokens(options.tokens);
      format = 'stylesheet';
    } else {
      code = generateTailwindTokens(options.tokens);
      format = 'css';
    }

    return {
      success: true,
      code,
      format,
    };
  } catch (error) {
    return {
      success: false,
      code: '',
      format: '',
      error: error instanceof Error ? error.message : 'Token injection failed',
    };
  }
}

/**
 * Default spacing tokens (in pixels)
 */
export const DEFAULT_SPACING: SpacingTokens = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
};

/**
 * Default radius tokens
 */
export const DEFAULT_RADIUS: RadiusTokens = {
  none: '0',
  sm: '4px',
  default: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  full: '9999px',
};

/**
 * Default shadow tokens
 */
export const DEFAULT_SHADOW: ShadowTokens = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
};

/**
 * Default typography tokens
 */
export const DEFAULT_TYPOGRAPHY: TypographyTokens = {
  fontFamily: {
    sans: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },
};

/**
 * Default color tokens for offline/fallback mode
 */
export const DEFAULT_COLOR_TOKENS: ExtendedTokenPreset = {
  brand: {
    primary: {
      base: { l: 0.55, c: 0.2, h: 250 },
      light: { l: 0.75, c: 0.15, h: 250 },
      dark: { l: 0.35, c: 0.25, h: 250 },
      contrast: { l: 0.98, c: 0, h: 0 },
    },
    secondary: {
      base: { l: 0.6, c: 0.15, h: 200 },
      light: { l: 0.8, c: 0.1, h: 200 },
      dark: { l: 0.4, c: 0.2, h: 200 },
      contrast: { l: 0.98, c: 0, h: 0 },
    },
  },
  semantic: {
    success: { l: 0.55, c: 0.2, h: 145 },
    warning: { l: 0.7, c: 0.18, h: 85 },
    error: { l: 0.55, c: 0.22, h: 25 },
    info: { l: 0.6, c: 0.18, h: 230 },
  },
  dataViz: {
    categorical: [
      { l: 0.55, c: 0.2, h: 250 },
      { l: 0.6, c: 0.2, h: 145 },
      { l: 0.65, c: 0.18, h: 85 },
      { l: 0.55, c: 0.22, h: 25 },
    ],
  },
  neutral: {
    50: { l: 0.98, c: 0, h: 0 },
    100: { l: 0.96, c: 0, h: 0 },
    200: { l: 0.92, c: 0, h: 0 },
    300: { l: 0.85, c: 0, h: 0 },
    400: { l: 0.7, c: 0, h: 0 },
    500: { l: 0.55, c: 0, h: 0 },
    600: { l: 0.45, c: 0, h: 0 },
    700: { l: 0.35, c: 0, h: 0 },
    800: { l: 0.25, c: 0, h: 0 },
    900: { l: 0.15, c: 0, h: 0 },
  },
};

/**
 * Get default tokens for fallback when API is unavailable
 */
export function getDefaultTokens(): CompleteDesignTokens {
  return {
    colors: DEFAULT_COLOR_TOKENS,
    spacing: DEFAULT_SPACING,
    radius: DEFAULT_RADIUS,
    shadow: DEFAULT_SHADOW,
    typography: DEFAULT_TYPOGRAPHY,
  };
}

/**
 * Generate complete tokens.css content with all token categories
 * @param tokens - Color tokens from preset (or defaults)
 * @param options - Optional configuration overrides
 */
export function generateCompleteTokensCSS(
  tokens?: ExtendedTokenPreset,
  options?: {
    spacing?: SpacingTokens;
    radius?: RadiusTokens;
    shadow?: ShadowTokens;
    typography?: TypographyTokens;
    prefix?: string;
  }
): string {
  const colorTokens = tokens || DEFAULT_COLOR_TOKENS;
  const spacing = options?.spacing || DEFAULT_SPACING;
  const radius = options?.radius || DEFAULT_RADIUS;
  const shadow = options?.shadow || DEFAULT_SHADOW;
  const typography = options?.typography || DEFAULT_TYPOGRAPHY;
  const prefix = options?.prefix || 'tekton';

  const lines: string[] = [];
  lines.push('/**');
  lines.push(' * Design Tokens');
  lines.push(' * Generated by Tekton CLI');
  lines.push(' */');
  lines.push('');
  lines.push(':root {');

  // Brand Colors
  lines.push('  /* ─── Brand Colors ─── */');
  for (const [colorName, levels] of Object.entries(colorTokens.brand)) {
    const brandLevels = levels as BrandLevel;
    lines.push(`  --${prefix}-${colorName}-base: oklch(${brandLevels.base.l} ${brandLevels.base.c} ${brandLevels.base.h});`);
    lines.push(`  --${prefix}-${colorName}-light: oklch(${brandLevels.light.l} ${brandLevels.light.c} ${brandLevels.light.h});`);
    lines.push(`  --${prefix}-${colorName}-dark: oklch(${brandLevels.dark.l} ${brandLevels.dark.c} ${brandLevels.dark.h});`);
    lines.push(`  --${prefix}-${colorName}-contrast: oklch(${brandLevels.contrast.l} ${brandLevels.contrast.c} ${brandLevels.contrast.h});`);
  }

  lines.push('');
  lines.push('  /* ─── Semantic Colors ─── */');
  for (const [semanticName, color] of Object.entries(colorTokens.semantic)) {
    const oklchColor = color as OKLCHColor;
    lines.push(`  --${prefix}-${semanticName}: oklch(${oklchColor.l} ${oklchColor.c} ${oklchColor.h});`);
  }

  lines.push('');
  lines.push('  /* ─── Neutral Colors ─── */');
  for (const [level, color] of Object.entries(colorTokens.neutral)) {
    const oklchColor = color as OKLCHColor;
    lines.push(`  --${prefix}-neutral-${level}: oklch(${oklchColor.l} ${oklchColor.c} ${oklchColor.h});`);
  }

  lines.push('');
  lines.push('  /* ─── Spacing ─── */');
  for (const [size, value] of Object.entries(spacing)) {
    lines.push(`  --${prefix}-spacing-${size}: ${value};`);
  }

  lines.push('');
  lines.push('  /* ─── Border Radius ─── */');
  for (const [size, value] of Object.entries(radius)) {
    const varName = size === 'default' ? 'border-radius' : `border-radius-${size}`;
    lines.push(`  --${prefix}-${varName}: ${value};`);
  }

  lines.push('');
  lines.push('  /* ─── Shadows ─── */');
  for (const [size, value] of Object.entries(shadow)) {
    const varName = size === 'default' ? 'shadow' : `shadow-${size}`;
    lines.push(`  --${prefix}-${varName}: ${value};`);
  }

  lines.push('');
  lines.push('  /* ─── Typography - Font Family ─── */');
  for (const [family, value] of Object.entries(typography.fontFamily)) {
    lines.push(`  --${prefix}-font-${family}: ${value};`);
  }

  lines.push('');
  lines.push('  /* ─── Typography - Font Size ─── */');
  for (const [size, value] of Object.entries(typography.fontSize)) {
    lines.push(`  --${prefix}-text-${size}: ${value};`);
  }

  lines.push('');
  lines.push('  /* ─── Typography - Font Weight ─── */');
  for (const [weight, value] of Object.entries(typography.fontWeight)) {
    lines.push(`  --${prefix}-font-${weight}: ${value};`);
  }

  lines.push('');
  lines.push('  /* ─── Typography - Line Height ─── */');
  for (const [height, value] of Object.entries(typography.lineHeight)) {
    lines.push(`  --${prefix}-leading-${height}: ${value};`);
  }

  lines.push('');
  lines.push('  /* ─── Typography - Letter Spacing ─── */');
  for (const [spacing, value] of Object.entries(typography.letterSpacing)) {
    lines.push(`  --${prefix}-tracking-${spacing}: ${value};`);
  }

  lines.push('}');

  return lines.join('\n');
}
