/**
 * @tekton/core - Integration Tests
 * Test integration of token system with existing codebase
 * [SPEC-COMPONENT-001-A] Integration
 */

import { describe, it, expect } from 'vitest';
import {
  // Existing exports
  loadTheme,
  generateCSSVariables,
  // New token system exports
  generateThemeCSS,
  validateTheme,
  resolveToken,
  resolveWithFallback,
  type ThemeWithTokens,
  type ComponentTokens,
  type TokenValidationResult,
} from '../src/index.js';

// ============================================================================
// Export Integration Tests
// ============================================================================

describe('Integration - Exports', () => {
  it('should export all existing functions (backward compatibility)', () => {
    expect(loadTheme).toBeDefined();
    expect(generateCSSVariables).toBeDefined();
  });

  it('should export all new token system functions', () => {
    expect(generateThemeCSS).toBeDefined();
    expect(validateTheme).toBeDefined();
    expect(resolveToken).toBeDefined();
    expect(resolveWithFallback).toBeDefined();
  });
});

// ============================================================================
// Backward Compatibility Tests
// ============================================================================

describe('Integration - Backward Compatibility', () => {
  it('should still load existing themes with loadTheme', () => {
    const theme = loadTheme('calm-wellness');
    expect(theme).not.toBeNull();
    expect(theme?.id).toBe('calm-wellness');
  });

  it('should still generate CSS variables with old function', () => {
    const theme = loadTheme('calm-wellness');
    expect(theme).not.toBeNull();

    if (theme) {
      const vars = generateCSSVariables(theme);
      expect(vars).toBeDefined();
      expect(vars['--color-primary']).toBeDefined();
    }
  });
});

// ============================================================================
// Token System Integration Tests
// ============================================================================

describe('Integration - Token System Workflow', () => {
  const mockThemeWithTokens: ThemeWithTokens = {
    id: 'integration-test',
    name: 'Integration Test Theme',
    description: 'Test theme for integration',
    brandTone: 'professional',
    colorPalette: {
      primary: { l: 0.6, c: 0.15, h: 220 },
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      fontScale: 'medium',
      headingWeight: 700,
      bodyWeight: 400,
    },
    componentDefaults: {
      borderRadius: 'medium',
      density: 'comfortable',
      contrast: 'medium',
    },
    tokens: {
      atomic: {
        color: {
          blue: { '500': '#3b82f6' },
          neutral: { '50': '#f9fafb', '900': '#111827' },
        },
        spacing: { '4': '16px' },
        radius: { md: '8px' },
        typography: {
          body: {
            fontSize: '16px',
            lineHeight: '24px',
            fontWeight: '400',
          },
        },
        shadow: {
          md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        },
      },
      semantic: {
        background: {
          page: 'atomic.color.neutral.50',
          surface: '#ffffff',
          elevated: '#ffffff',
          muted: '#f3f4f6',
          inverse: 'atomic.color.neutral.900',
        },
        foreground: {
          primary: 'atomic.color.neutral.900',
          secondary: '#6b7280',
          muted: '#9ca3af',
          inverse: '#ffffff',
          accent: 'atomic.color.blue.500',
        },
        border: {
          default: '#e5e7eb',
          muted: '#f3f4f6',
          focus: 'atomic.color.blue.500',
          error: '#ef4444',
        },
        surface: {
          primary: '#ffffff',
          secondary: 'atomic.color.neutral.50',
          tertiary: '#f3f4f6',
          inverse: 'atomic.color.neutral.900',
        },
      },
      component: {
        button: {
          primary: {
            background: 'semantic.foreground.accent',
            foreground: '#ffffff',
            border: 'semantic.foreground.accent',
            hover: {
              background: '#2563eb',
              foreground: '#ffffff',
            },
            active: {
              background: '#1d4ed8',
            },
            disabled: {
              background: '#f3f4f6',
              foreground: '#9ca3af',
            },
          },
        },
        input: {
          background: 'semantic.background.surface',
          foreground: 'semantic.foreground.primary',
          border: 'semantic.border.default',
          placeholder: 'semantic.foreground.muted',
          focus: {
            border: 'semantic.border.focus',
            ring: 'atomic.color.blue.500',
          },
          error: {
            border: 'semantic.border.error',
            ring: '#ef4444',
          },
          disabled: {
            background: '#f3f4f6',
            foreground: '#9ca3af',
          },
        },
        card: {
          background: 'semantic.background.surface',
          foreground: 'semantic.foreground.primary',
          border: 'semantic.border.default',
          shadow: 'atomic.shadow.md',
        },
      },
    },
  };

  it('should validate theme before CSS generation', () => {
    const validationResult = validateTheme(mockThemeWithTokens);
    expect(validationResult.valid).toBe(true);
  });

  it('should generate CSS from validated theme', () => {
    const validationResult = validateTheme(mockThemeWithTokens);
    expect(validationResult.valid).toBe(true);

    const css = generateThemeCSS(mockThemeWithTokens);
    expect(css).toBeTruthy();
    expect(css).toContain(':root {');
    expect(css).toContain('--color-blue-500: #3b82f6;');
  });

  it('should resolve tokens during CSS generation', () => {
    const css = generateThemeCSS(mockThemeWithTokens);

    // Component token should be resolved
    expect(css).toContain('--button-primary-background: #3b82f6;');
    // Semantic token reference resolved to atomic value
  });

  it('should complete validation → resolution → generation workflow', () => {
    // Step 1: Validate
    const validationResult: TokenValidationResult = validateTheme(mockThemeWithTokens);
    expect(validationResult.valid).toBe(true);

    // Step 2: Manual token resolution (if needed)
    const resolvedColor = resolveToken(
      'component.button.primary.background',
      mockThemeWithTokens.tokens
    );
    expect(resolvedColor).toBe('#3b82f6');

    // Step 3: Generate CSS
    const css = generateThemeCSS(mockThemeWithTokens);
    expect(css).toContain('--button-primary-background: #3b82f6;');
  });
});

// ============================================================================
// TypeScript Integration Tests
// ============================================================================

describe('Integration - TypeScript Types', () => {
  it('should allow ThemeWithTokens to extend Theme', () => {
    const theme: ThemeWithTokens = {
      id: 'test',
      name: 'Test',
      description: 'Test theme',
      brandTone: 'professional',
      colorPalette: {
        primary: { l: 0.6, c: 0.15, h: 220 },
      },
      typography: {
        fontFamily: 'Inter',
        fontScale: 'medium',
        headingWeight: 700,
        bodyWeight: 400,
      },
      componentDefaults: {
        borderRadius: 'medium',
        density: 'comfortable',
        contrast: 'medium',
      },
      tokens: {
        atomic: {
          color: {},
          spacing: {},
          radius: {},
          typography: {},
          shadow: {},
        },
        semantic: {
          background: {
            page: '#ffffff',
            surface: '#ffffff',
            elevated: '#ffffff',
            muted: '#f3f4f6',
            inverse: '#111827',
          },
          foreground: {
            primary: '#111827',
            secondary: '#6b7280',
            muted: '#9ca3af',
            inverse: '#ffffff',
            accent: '#3b82f6',
          },
          border: {
            default: '#e5e7eb',
            muted: '#f3f4f6',
            focus: '#3b82f6',
            error: '#ef4444',
          },
          surface: {
            primary: '#ffffff',
            secondary: '#f9fafb',
            tertiary: '#f3f4f6',
            inverse: '#111827',
          },
        },
        component: {} as ComponentTokens,
      },
    };

    expect(theme.id).toBe('test');
    expect(theme.tokens).toBeDefined();
  });
});

// ============================================================================
// End-to-End Integration Test
// ============================================================================

describe('Integration - End-to-End', () => {
  it('should complete full token system workflow', () => {
    // Create theme with tokens
    const theme: ThemeWithTokens = {
      id: 'e2e-test',
      name: 'E2E Test Theme',
      description: 'End-to-end test',
      brandTone: 'professional',
      colorPalette: {
        primary: { l: 0.6, c: 0.15, h: 220 },
      },
      typography: {
        fontFamily: 'Inter',
        fontScale: 'medium',
        headingWeight: 700,
        bodyWeight: 400,
      },
      componentDefaults: {
        borderRadius: 'medium',
        density: 'comfortable',
        contrast: 'medium',
      },
      tokens: {
        atomic: {
          color: {
            primary: { '500': '#3b82f6' },
          },
          spacing: { '4': '16px' },
          radius: { md: '8px' },
          typography: {
            body: {
              fontSize: '16px',
              lineHeight: '24px',
              fontWeight: '400',
            },
          },
          shadow: {
            md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          },
        },
        semantic: {
          background: {
            page: '#ffffff',
            surface: '#ffffff',
            elevated: '#ffffff',
            muted: '#f3f4f6',
            inverse: '#111827',
          },
          foreground: {
            primary: '#111827',
            secondary: '#6b7280',
            muted: '#9ca3af',
            inverse: '#ffffff',
            accent: 'atomic.color.primary.500',
          },
          border: {
            default: '#e5e7eb',
            muted: '#f3f4f6',
            focus: 'atomic.color.primary.500',
            error: '#ef4444',
          },
          surface: {
            primary: '#ffffff',
            secondary: '#f9fafb',
            tertiary: '#f3f4f6',
            inverse: '#111827',
          },
        },
        component: {
          button: {
            primary: {
              background: 'semantic.foreground.accent',
              foreground: '#ffffff',
              border: 'semantic.foreground.accent',
              hover: {
                background: '#2563eb',
                foreground: '#ffffff',
              },
              active: {
                background: '#1d4ed8',
              },
              disabled: {
                background: '#f3f4f6',
                foreground: '#9ca3af',
              },
            },
          },
          input: {
            background: '#ffffff',
            foreground: '#111827',
            border: '#e5e7eb',
            placeholder: '#9ca3af',
            focus: {
              border: 'semantic.border.focus',
              ring: 'atomic.color.primary.500',
            },
            error: {
              border: '#ef4444',
              ring: '#ef4444',
            },
            disabled: {
              background: '#f3f4f6',
              foreground: '#9ca3af',
            },
          },
          card: {
            background: '#ffffff',
            foreground: '#111827',
            border: '#e5e7eb',
            shadow: 'atomic.shadow.md',
          },
        },
      },
    };

    // 1. Validate
    const validation = validateTheme(theme);
    expect(validation.valid).toBe(true);

    // 2. Generate CSS
    const css = generateThemeCSS(theme);
    expect(css).toBeTruthy();

    // 3. Verify output
    expect(css).toContain(':root {');
    expect(css).toContain('Layer 1: Atomic Tokens');
    expect(css).toContain('Layer 2: Semantic Tokens');
    expect(css).toContain('Layer 3: Component Tokens');

    // 4. Verify resolved values
    expect(css).toContain('--color-primary-500: #3b82f6;');
    expect(css).toContain('--foreground-accent: #3b82f6;');
    expect(css).toContain('--button-primary-background: #3b82f6;');

    // 5. Verify no unresolved references
    expect(css).not.toContain('atomic.');
    expect(css).not.toContain('semantic.');
    expect(css).not.toContain('component.');
  });
});
