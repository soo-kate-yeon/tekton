/**
 * @tekton/core - Essential Types
 * Minimal type definitions for the design system pipeline
 * Target: 80 LOC
 */

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
// Theme Types
// ============================================================================

export interface Theme {
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

export interface ThemeMeta {
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
  layout: LayoutType;
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
