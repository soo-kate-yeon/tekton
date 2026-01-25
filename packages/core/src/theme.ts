/**
 * @tekton/core - Theme Module
 * Load and manage theme definitions
 * Target: 120 LOC
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Theme, ThemeMeta, OKLCHColor } from './types.js';

// ============================================================================
// Theme Directory Resolution
// ============================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const THEMES_DIR = join(__dirname, '..', 'themes');

// ============================================================================
// Built-in Theme IDs
// ============================================================================

export const BUILTIN_THEMES = [
  'calm-wellness',
  'dynamic-fitness',
  'korean-fintech',
  'media-streaming',
  'premium-editorial',
  'saas-dashboard',
  'saas-modern',
  'tech-startup',
  'warm-humanist',
] as const;

export type BuiltinThemeId = (typeof BUILTIN_THEMES)[number];

// ============================================================================
// Theme Loading Functions
// ============================================================================

/**
 * Load theme from JSON file
 */
export function loadTheme(themeId: string): Theme | null {
  // Security: Prevent path traversal attacks
  // Only allow alphanumeric characters and hyphens
  if (!themeId || !/^[a-z0-9-]+$/.test(themeId)) {
    return null;
  }

  const themePath = join(THEMES_DIR, `${themeId}.json`);

  if (!existsSync(themePath)) {
    return null;
  }

  try {
    const content = readFileSync(themePath, 'utf-8');
    return JSON.parse(content) as Theme;
  } catch {
    return null;
  }
}

/**
 * Get all available theme metadata
 */
export function listThemes(): ThemeMeta[] {
  if (!existsSync(THEMES_DIR)) {
    return [];
  }

  const files = readdirSync(THEMES_DIR).filter(f => f.endsWith('.json'));
  const themes: ThemeMeta[] = [];

  for (const file of files) {
    const theme = loadTheme(file.replace('.json', ''));
    if (theme) {
      themes.push({
        id: theme.id,
        name: theme.name,
        description: theme.description,
      });
    }
  }

  return themes;
}

/**
 * Check if theme ID is valid built-in theme
 */
export function isBuiltinTheme(themeId: string): themeId is BuiltinThemeId {
  return BUILTIN_THEMES.includes(themeId as BuiltinThemeId);
}

// ============================================================================
// Color Utilities
// ============================================================================

/**
 * Convert OKLCH to CSS string
 * Clamps values to valid ranges: l (0-1), c (0-0.5), h (0-360)
 */
export function oklchToCSS(color: OKLCHColor): string {
  const l = Math.max(0, Math.min(1, color.l));
  const c = Math.max(0, Math.min(0.5, color.c));
  const h = ((color.h % 360) + 360) % 360; // Normalize to 0-360
  return `oklch(${l} ${c} ${h})`;
}

/**
 * Generate CSS variables from theme
 */
export function generateCSSVariables(theme: Theme): Record<string, string> {
  const vars: Record<string, string> = {};
  const { colorPalette, typography, componentDefaults } = theme;

  // Colors
  vars['--color-primary'] = oklchToCSS(colorPalette.primary);
  if (colorPalette.secondary) {
    vars['--color-secondary'] = oklchToCSS(colorPalette.secondary);
  }
  if (colorPalette.accent) {
    vars['--color-accent'] = oklchToCSS(colorPalette.accent);
  }
  if (colorPalette.neutral) {
    vars['--color-neutral'] = oklchToCSS(colorPalette.neutral);
  }

  // Typography
  vars['--font-family'] = typography.fontFamily;
  vars['--font-scale'] = typography.fontScale;

  // Component defaults
  const radiusMap = { none: '0', small: '4px', medium: '8px', large: '16px', full: '9999px' };
  vars['--border-radius'] = radiusMap[componentDefaults.borderRadius];

  return vars;
}
