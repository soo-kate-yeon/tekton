/**
 * @tekton/core - Token Validation
 * Runtime validation using Zod schemas for 3-layer token architecture
 * [SPEC-COMPONENT-001-A] [TOKEN-VALIDATION]
 */

import { z } from 'zod';

// ============================================================================
// Zod Schema Definitions
// ============================================================================

/**
 * Atomic Tokens Schema - Layer 1
 * Validates raw design values (colors, spacing, typography, etc.)
 */
const AtomicTokensSchema = z.object({
  /** Color palettes with shades */
  color: z.record(z.record(z.string())),

  /** Spacing scale */
  spacing: z.record(z.string()),

  /** Border radius values */
  radius: z.record(z.string()),

  /** Typography definitions */
  typography: z.record(
    z.object({
      fontSize: z.string(),
      lineHeight: z.string(),
      fontWeight: z.string(),
    })
  ),

  /** Shadow definitions */
  shadow: z.record(z.string()),

  /** Transition definitions (optional) */
  transition: z.record(z.string()).optional(),
});

/**
 * Semantic Tokens Schema - Layer 2
 * Validates meaning-based token mappings
 */
const SemanticTokensSchema = z.object({
  /** Background colors with semantic meaning */
  background: z.object({
    page: z.string(),
    surface: z.string(),
    elevated: z.string(),
    muted: z.string(),
    inverse: z.string(),
  }),

  /** Foreground (text) colors with semantic meaning */
  foreground: z.object({
    primary: z.string(),
    secondary: z.string(),
    muted: z.string(),
    inverse: z.string(),
    accent: z.string(),
  }),

  /** Border colors with semantic meaning */
  border: z.object({
    default: z.string(),
    muted: z.string(),
    focus: z.string(),
    error: z.string(),
  }),

  /** Surface colors with semantic meaning */
  surface: z.object({
    primary: z.string(),
    secondary: z.string(),
    tertiary: z.string(),
    inverse: z.string(),
  }),
});

/**
 * Component Tokens Schema - Layer 3
 * Validates component-specific token bindings
 * Flexible to allow extensible component definitions
 */
const ComponentTokensSchema = z.record(z.any());

/**
 * Dark Mode Semantic Tokens Schema
 * Allows partial overrides of semantic tokens for dark mode
 * Uses flexible validation since dark mode is opt-in and can override any semantic token
 */
const DarkModeSemanticTokensSchema = z.record(z.any());

/**
 * Dark Mode Component Tokens Schema
 * Allows partial overrides of component tokens for dark mode
 * Uses flexible validation for extensibility
 */
const DarkModeComponentTokensSchema = z.record(z.any());

/**
 * Theme with Tokens Schema
 * Validates complete 3-layer token structure with optional dark mode
 */
export const ThemeWithTokensSchema = z.object({
  /** 3-layer token structure */
  tokens: z.object({
    atomic: AtomicTokensSchema,
    semantic: SemanticTokensSchema,
    component: ComponentTokensSchema,
  }),

  /** Optional dark mode token overrides */
  darkMode: z
    .object({
      tokens: z.object({
        semantic: DarkModeSemanticTokensSchema,
        component: DarkModeComponentTokensSchema,
      }),
    })
    .optional(),
});

// ============================================================================
// Validation Function
// ============================================================================

/**
 * Validation result with detailed error information
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;

  /** Error messages if validation failed (undefined if valid) */
  errors?: string[];
}

/**
 * Validates a theme with token structure
 *
 * Uses Zod schema validation to ensure:
 * - All required atomic tokens are present
 * - All required semantic tokens are defined
 * - Component tokens structure is valid
 * - Dark mode tokens (if present) follow correct structure
 *
 * @param theme - Theme object to validate
 * @returns Validation result with success status and error messages
 *
 * @example
 * ```typescript
 * const result = validateTheme(myTheme);
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export function validateTheme(theme: unknown): ValidationResult {
  const result = ThemeWithTokensSchema.safeParse(theme);

  if (!result.success) {
    return {
      valid: false,
      errors: result.error.errors.map(e => {
        const path = e.path.join('.');
        return `${path}: ${e.message}`;
      }),
    };
  }

  return { valid: true };
}
