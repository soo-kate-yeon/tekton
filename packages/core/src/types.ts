/**
 * @tekton/core - Essential Types
 * Minimal type definitions for the design system pipeline
 * Target: 80 LOC
 */

import type { ResolvedLayout } from './layout-resolver.js';

// ============================================================================
// Color Types
// ============================================================================

/** OKLCH color: L(0-1), C(0-0.5), H(0-360) */
export interface OKLCHColor {
  l: number;
  c: number;
  h: number;
}

// ============================================================================
// Theme Types (v2.1 - from theme-v2.ts)
// ============================================================================

// Re-export v2.1 Theme types as primary
export type { ThemeV2 as Theme, ThemeMetaV2 as ThemeMeta } from './theme-v2.js';

// ============================================================================
// Legacy Theme Types (v1 - DEPRECATED)
// ============================================================================

/**
 * @deprecated Use Theme (ThemeV2) from theme.ts instead.
 * v1 themes have been removed. This interface is kept for migration purposes only.
 */
export interface ThemeLegacy {
  id: string;
  name: string;
  description: string;
  brandTone: string;
  colorPalette: {
    primary: OKLCHColor;
    secondary?: OKLCHColor;
    accent?: OKLCHColor;
    neutral?: OKLCHColor;
  };
  typography: {
    fontFamily: string;
    fontScale: 'small' | 'medium' | 'large';
    headingWeight: number;
    bodyWeight: number;
  };
  componentDefaults: {
    borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full';
    density: 'compact' | 'comfortable' | 'spacious';
    contrast: 'low' | 'medium' | 'high';
  };
}

/**
 * @deprecated Use ThemeMeta (ThemeMetaV2) from theme.ts instead.
 */
export interface ThemeMetaLegacy {
  id: string;
  name: string;
  description: string;
}

// ============================================================================
// Blueprint Types
// ============================================================================

export interface ComponentNode {
  type: string;
  props?: Record<string, unknown>;
  children?: (ComponentNode | string)[];
  slot?: string;
}

export interface Blueprint {
  id: string;
  name: string;
  description?: string;
  themeId: string;
  layout: LayoutType; // Keep for backward compatibility
  layoutToken?: string; // NEW: Optional layout token ID
  layoutConfig?: ResolvedLayout; // NEW: Resolved layout configuration
  components: ComponentNode[];
}

export type LayoutType =
  | 'single-column'
  | 'two-column'
  | 'sidebar-left'
  | 'sidebar-right'
  | 'dashboard'
  | 'landing';

// ============================================================================
// Render Output Types
// ============================================================================

export interface RenderResult {
  success: boolean;
  code?: string;
  error?: string;
}

export interface RenderOptions {
  typescript?: boolean;
  indent?: number;
  semicolons?: boolean;
}

// ============================================================================
// Token Types (re-exported from tokens.ts)
// ============================================================================

export type { AtomicTokens, SemanticTokens, ComponentTokens, ThemeWithTokens } from './tokens.js';
