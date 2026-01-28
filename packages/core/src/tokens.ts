/**
 * @tekton/core - Token Type Definitions
 * 3-Layer Token Architecture: Atomic → Semantic → Component
 * [SPEC-COMPONENT-001-A] [TOKEN-TYPES]
 *
 * NOTE: This module defines the CSS generator token types.
 * For v2.1 theme types, see theme-v2.ts
 */

import type { ThemeLegacy } from './types.js';

// ============================================================================
// Layer 1: Atomic Tokens - Raw Design Values
// ============================================================================

/**
 * Atomic Token Layer - Foundation tokens that never reference other tokens
 * These are the raw design values (colors, spacing, etc.)
 */
export interface AtomicTokens {
  /** Color palettes with shades */
  color: {
    [palette: string]: {
      [shade: string]: string; // "500": "#3b82f6"
    };
  };

  /** Spacing scale */
  spacing: {
    [size: string]: string; // "4": "16px"
  };

  /** Border radius values */
  radius: {
    [size: string]: string; // "md": "8px"
  };

  /** Typography definitions */
  typography: {
    [name: string]: {
      fontSize: string; // "16px"
      lineHeight: string; // "24px"
      fontWeight: string; // "400"
    };
  };

  /** Shadow definitions */
  shadow: {
    [name: string]: string; // "md": "0 4px 6px -1px rgb(0 0 0 / 0.1)"
  };

  /** Transition definitions (optional) */
  transition?: {
    [name: string]: string; // "default": "150ms cubic-bezier(0.4, 0, 0.2, 1)"
  };
}

// ============================================================================
// Layer 2: Semantic Tokens - Meaning-Based Mappings
// ============================================================================

/**
 * Semantic Token Layer - Meaning-based mappings
 * These tokens reference atomic tokens and provide semantic meaning
 */
export interface SemanticTokens {
  /** Background colors with semantic meaning */
  background: {
    page: string; // → atomic.color.neutral.50
    surface: string; // → atomic.color.white
    elevated: string; // → atomic.color.white
    muted: string; // → atomic.color.neutral.100
    inverse: string; // → atomic.color.neutral.900
  };

  /** Foreground (text) colors with semantic meaning */
  foreground: {
    primary: string; // → atomic.color.neutral.900
    secondary: string; // → atomic.color.neutral.600
    muted: string; // → atomic.color.neutral.400
    inverse: string; // → atomic.color.white
    accent: string; // → atomic.color.primary.500
  };

  /** Border colors with semantic meaning */
  border: {
    default: string; // → atomic.color.neutral.200
    muted: string; // → atomic.color.neutral.100
    focus: string; // → atomic.color.primary.500
    error: string; // → atomic.color.red.500
  };

  /** Surface colors with semantic meaning */
  surface: {
    primary: string; // → atomic.color.white
    secondary: string; // → atomic.color.neutral.50
    tertiary: string; // → atomic.color.neutral.100
    inverse: string; // → atomic.color.neutral.900
  };
}

// ============================================================================
// Layer 3: Component Tokens - Component-Specific Bindings
// ============================================================================

/**
 * Component Token Layer - Component-specific bindings
 * These tokens reference semantic or atomic tokens and are used directly in components
 */
export interface ComponentTokens {
  /** Button component tokens */
  button: {
    [variant: string]: {
      background: string; // → semantic.* or atomic.*
      foreground: string;
      border: string;
      hover: {
        background: string;
        foreground: string;
      };
      active: {
        background: string;
      };
      disabled: {
        background: string;
        foreground: string;
      };
    };
  };

  /** Input component tokens */
  input: {
    background: string;
    foreground: string;
    border: string;
    placeholder: string;
    focus: {
      border: string;
      ring: string;
    };
    error: {
      border: string;
      ring: string;
    };
    disabled: {
      background: string;
      foreground: string;
    };
  };

  /** Card component tokens */
  card: {
    background: string;
    foreground: string;
    border: string;
    shadow: string;
  };

  /** Extensible for additional components */
  [component: string]: unknown;
}

// ============================================================================
// Extended Theme with 3-Layer Tokens
// ============================================================================

/**
 * Extended Theme with 3-Layer Token Architecture
 * Extends the legacy Theme interface with token system
 *
 * @deprecated Consider using ThemeV2 from theme-v2.ts for new themes
 */
export interface ThemeWithTokens extends ThemeLegacy {
  /** 3-Layer token structure */
  tokens: {
    atomic: AtomicTokens;
    semantic: SemanticTokens;
    component: ComponentTokens;
  };

  /** Optional dark mode token overrides */
  darkMode?: {
    tokens: {
      semantic: Partial<SemanticTokens>;
      component: Partial<ComponentTokens>;
    };
  };
}

// ============================================================================
// Type Exports
// ============================================================================

/** @deprecated Use Theme from theme.ts (ThemeV2) for new code */
export type { ThemeLegacy as Theme } from './types.js';
