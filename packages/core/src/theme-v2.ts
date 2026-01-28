/**
 * @tekton/core - Theme Module v2.1
 * Load and manage v2.1 theme definitions from .moai/themes/generated/
 * [SPEC-LAYOUT-002] [THEME-V2]
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

// ============================================================================
// V2.1 Theme Types (Visual DNA Only - No Layout)
// ============================================================================

/** OKLCH color format */
export interface OKLCHColorV2 {
  l: number; // 0-1
  c: number; // 0-0.5
  h: number; // 0-360
}

/** Design DNA - Qualitative essence from reference images */
export interface DesignDNA {
  moodKeywords: string[];
  targetEmotion: string;
  visualAtmosphere: string;
}

/** Atomic Tokens - Layer 1 */
export interface AtomicTokensV2 {
  color: {
    brand?: Record<string, OKLCHColorV2>;
    neutral?: Record<string, OKLCHColorV2>;
    accent?: Record<string, OKLCHColorV2>;
    success?: OKLCHColorV2;
    warning?: OKLCHColorV2;
    error?: OKLCHColorV2;
    info?: OKLCHColorV2;
  };
  spacing: Record<string, string>;
  radius: Record<string, string>;
}

/** Semantic Tokens - Layer 2 */
export interface SemanticTokensV2 {
  background?: {
    canvas?: string;
    surface?: {
      subtle?: string;
      default?: string;
      emphasis?: string;
    };
    elevated?: Record<string, string>;
    inverse?: Record<string, string>;
    brand?: Record<string, string>;
  };
  foreground?: {
    primary?: Record<string, string>;
    secondary?: Record<string, string>;
    inverse?: Record<string, string>;
    brand?: Record<string, string>;
    disabled?: string;
    placeholder?: string;
  };
  border?: {
    default?: {
      subtle?: string;
      default?: string;
      emphasis?: string;
    };
    focus?: string;
    error?: string;
    success?: string;
  };
}

/** Component Tokens - Layer 3 */
export interface ComponentTokensV2 {
  [component: string]: Record<string, unknown>;
}

/** State Layer Tokens (MD3 approach) */
export interface StateLayerTokens {
  hover?: {
    opacity?: number;
    overlayColor?: {
      onLight?: string;
      onDark?: string;
    };
  };
  pressed?: {
    opacity?: number;
  };
  focus?: {
    opacity?: number;
    ring?: {
      width?: string;
      offset?: string;
      color?: string;
    };
  };
  disabled?: {
    opacity?: number;
    contentOpacity?: number;
  };
  dragged?: {
    opacity?: number;
    elevation?: string;
  };
  selected?: {
    opacity?: number;
  };
}

/** Motion Tokens */
export interface MotionTokens {
  duration?: Record<string, string>;
  easing?: Record<string, string>;
  preset?: Record<string, unknown>;
}

/** Elevation Tokens */
export interface ElevationTokens {
  level?: Record<string, string>;
  context?: Record<string, string>;
  color?: Record<string, string>;
}

/** Border Tokens */
export interface BorderTokens {
  width?: Record<string, string>;
  style?: Record<string, string>;
  radius?: Record<string, string>;
}

/** Typography Tokens */
export interface TypographyTokens {
  fontFamily?: Record<string, string>;
  fontSize?: Record<string, string>;
  fontWeight?: Record<string, string>;
  lineHeight?: Record<string, string>;
  letterSpacing?: Record<string, string>;
  textTransform?: Record<string, string>;
  preset?: Record<string, unknown>;
}

/** Density Tokens */
export interface DensityTokens {
  mode?: 'compact' | 'comfortable' | 'spacious';
  scale?: Record<string, number>;
  spacing?: Record<string, string>;
  sizing?: Record<string, unknown>;
}

/** Effects Tokens */
export interface EffectsTokens {
  blur?: Record<string, string>;
  backdrop?: {
    blur?: string;
    saturate?: string;
    brightness?: string;
  };
  glassmorphism?: {
    enabled?: boolean;
    background?: string;
    blur?: string;
    border?: string;
  };
  gradient?: Record<string, string>;
  overlay?: Record<string, string>;
}

/** AI Context for LLM consumption */
export interface AIContext {
  designPhilosophy?: string;
  colorGuidance?: string;
  componentGuidance?: string;
  spacingGuidance?: string;
  accessibilityNotes?: string;
}

/** Dark Mode Overrides */
export interface DarkModeOverrides {
  tokens?: {
    semantic?: Partial<SemanticTokensV2>;
  };
  stateLayer?: Partial<StateLayerTokens>;
  elevation?: Partial<ElevationTokens>;
}

// ============================================================================
// Main Theme V2.1 Interface
// ============================================================================

/**
 * Theme V2.1 - Visual DNA Only
 * Pure visual design tokens without layout information
 */
export interface ThemeV2 {
  id: string;
  name: string;
  description?: string;
  schemaVersion: '2.1';
  brandTone:
    | 'professional'
    | 'playful'
    | 'elegant'
    | 'bold'
    | 'minimal'
    | 'calm'
    | 'dynamic'
    | 'premium'
    | 'warm';
  designDNA?: DesignDNA;
  tokens: {
    atomic: AtomicTokensV2;
    semantic: SemanticTokensV2;
    component?: ComponentTokensV2;
  };
  stateLayer: StateLayerTokens;
  motion: MotionTokens;
  elevation: ElevationTokens;
  border: BorderTokens;
  typography: TypographyTokens;
  density: DensityTokens;
  effects?: EffectsTokens;
  darkMode?: DarkModeOverrides;
  aiContext?: AIContext;
}

/** Theme metadata for listing */
export interface ThemeMetaV2 {
  id: string;
  name: string;
  description?: string;
  brandTone: string;
  schemaVersion: string;
}

// ============================================================================
// Theme Directory Resolution
// ============================================================================

/**
 * Find project root by looking for .moai directory
 */
function findProjectRoot(startDir: string): string | null {
  let currentDir = startDir;
  const root = '/';

  while (currentDir !== root) {
    if (existsSync(join(currentDir, '.moai'))) {
      return currentDir;
    }
    currentDir = resolve(currentDir, '..');
  }

  return null;
}

/**
 * Get themes directory path
 * Returns .moai/themes/generated/ from project root
 */
function getThemesDir(): string | null {
  const projectRoot = findProjectRoot(process.cwd());
  if (!projectRoot) {
    return null;
  }
  return join(projectRoot, '.moai', 'themes', 'generated');
}

// ============================================================================
// Theme Loading Functions
// ============================================================================

/**
 * Load theme from .moai/themes/generated/ directory
 * @param themeId - Theme identifier (kebab-case, e.g., "atlantic-magazine-v1")
 * @returns Loaded theme or null if not found
 */
export function loadThemeV2(themeId: string): ThemeV2 | null {
  // Security: Prevent path traversal attacks
  if (!themeId || !/^[a-z0-9-]+$/.test(themeId)) {
    return null;
  }

  const themesDir = getThemesDir();
  if (!themesDir || !existsSync(themesDir)) {
    return null;
  }

  const themePath = join(themesDir, `${themeId}.json`);

  if (!existsSync(themePath)) {
    return null;
  }

  try {
    const content = readFileSync(themePath, 'utf-8');
    const theme = JSON.parse(content) as ThemeV2;

    // Validate schema version
    if (theme.schemaVersion !== '2.1') {
      console.warn(`Theme ${themeId} has invalid schema version: ${theme.schemaVersion}`);
      return null;
    }

    return theme;
  } catch (error) {
    console.error(`Failed to load theme ${themeId}:`, error);
    return null;
  }
}

/**
 * List all available themes from .moai/themes/generated/
 * @returns Array of theme metadata
 */
export function listThemesV2(): ThemeMetaV2[] {
  const themesDir = getThemesDir();
  if (!themesDir || !existsSync(themesDir)) {
    return [];
  }

  const files = readdirSync(themesDir).filter(f => f.endsWith('.json'));
  const themes: ThemeMetaV2[] = [];

  for (const file of files) {
    const themeId = file.replace('.json', '');
    const theme = loadThemeV2(themeId);

    if (theme) {
      themes.push({
        id: theme.id,
        name: theme.name,
        description: theme.description,
        brandTone: theme.brandTone,
        schemaVersion: theme.schemaVersion,
      });
    }
  }

  return themes;
}

/**
 * Check if a theme exists
 * @param themeId - Theme identifier
 * @returns true if theme exists
 */
export function themeExistsV2(themeId: string): boolean {
  if (!themeId || !/^[a-z0-9-]+$/.test(themeId)) {
    return false;
  }

  const themesDir = getThemesDir();
  if (!themesDir) {
    return false;
  }

  return existsSync(join(themesDir, `${themeId}.json`));
}

// ============================================================================
// Color Utilities
// ============================================================================

/**
 * Convert OKLCH color object to CSS string
 */
export function oklchToCSSV2(color: OKLCHColorV2): string {
  const l = Math.max(0, Math.min(1, color.l));
  const c = Math.max(0, Math.min(0.5, color.c));
  const h = ((color.h % 360) + 360) % 360;
  return `oklch(${l} ${c} ${h})`;
}

/**
 * Resolve a token reference to its actual value
 * Supports: atomic.*, semantic.*, elevation.* references
 */
export function resolveTokenRef(ref: string, theme: ThemeV2): string | null {
  if (!ref.includes('.')) {
    return ref; // Not a reference, return as-is
  }

  const parts = ref.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = theme;

  // Navigate through: "atomic.color.brand.500" -> theme.tokens.atomic.color.brand.500
  if (parts[0] === 'atomic' || parts[0] === 'semantic' || parts[0] === 'component') {
    current = theme.tokens;
  }

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return null;
    }
  }

  // If result is OKLCH color object, convert to CSS
  if (
    current &&
    typeof current === 'object' &&
    'l' in current &&
    'c' in current &&
    'h' in current
  ) {
    return oklchToCSSV2(current as OKLCHColorV2);
  }

  return typeof current === 'string' ? current : null;
}
