/**
 * @tekton/core - Token Validation Tests
 * Test-First: Define expected behavior for runtime token validation
 * [SPEC-COMPONENT-001-A] [TOKEN-VALIDATION]
 */

import { describe, it, expect } from 'vitest';
import { validateTheme } from '../src/token-validation.js';
import type { ThemeWithTokens, SemanticTokens, ComponentTokens } from '../src/tokens.js';

// ============================================================================
// Valid Theme Fixtures
// ============================================================================

const validThemeWithTokens: ThemeWithTokens = {
  id: 'test-theme',
  name: 'Test Theme',
  description: 'A test theme for validation',
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
        blue: {
          '500': '#3b82f6',
          '600': '#2563eb',
        },
        neutral: {
          '50': '#f9fafb',
          '100': '#f3f4f6',
          '200': '#e5e7eb',
          '900': '#111827',
        },
        red: {
          '500': '#ef4444',
        },
      },
      spacing: {
        '4': '16px',
        '8': '32px',
      },
      radius: {
        md: '8px',
        lg: '12px',
      },
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
        muted: 'atomic.color.neutral.100',
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
        default: 'atomic.color.neutral.200',
        muted: 'atomic.color.neutral.100',
        focus: 'atomic.color.blue.500',
        error: 'atomic.color.red.500',
      },
      surface: {
        primary: '#ffffff',
        secondary: 'atomic.color.neutral.50',
        tertiary: 'atomic.color.neutral.100',
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
            background: 'atomic.color.blue.600',
            foreground: '#ffffff',
          },
          active: {
            background: 'atomic.color.blue.700',
          },
          disabled: {
            background: 'semantic.background.muted',
            foreground: 'semantic.foreground.muted',
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
          ring: 'atomic.color.red.500',
        },
        disabled: {
          background: 'semantic.background.muted',
          foreground: 'semantic.foreground.muted',
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

// ============================================================================
// Validation Success Tests
// ============================================================================

describe('validateTheme - Success Cases', () => {
  it('should validate complete theme with all tokens', () => {
    const result = validateTheme(validThemeWithTokens);

    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('should validate theme without optional transition tokens', () => {
    const themeWithoutTransition: ThemeWithTokens = {
      ...validThemeWithTokens,
      tokens: {
        ...validThemeWithTokens.tokens,
        atomic: {
          ...validThemeWithTokens.tokens.atomic,
          // transition is optional
        },
      },
    };

    const result = validateTheme(themeWithoutTransition);
    expect(result.valid).toBe(true);
  });

  it('should validate theme with dark mode tokens', () => {
    const themeWithDarkMode: ThemeWithTokens = {
      ...validThemeWithTokens,
      darkMode: {
        tokens: {
          semantic: {
            background: {
              page: 'atomic.color.neutral.900',
            } as SemanticTokens['background'],
          },
          component: {
            button: {
              primary: {
                background: 'atomic.color.blue.400',
              } as ComponentTokens['button']['primary'],
            },
          },
        },
      },
    };

    const result = validateTheme(themeWithDarkMode);
    expect(result.valid).toBe(true);
  });

  it('should validate theme with partial dark mode semantic tokens', () => {
    const themeWithPartialDarkMode: ThemeWithTokens = {
      ...validThemeWithTokens,
      darkMode: {
        tokens: {
          semantic: {
            background: {
              page: 'atomic.color.neutral.900',
              // Other semantic tokens optional in dark mode
            } as SemanticTokens['background'],
          },
          component: {},
        },
      },
    };

    const result = validateTheme(themeWithPartialDarkMode);
    expect(result.valid).toBe(true);
  });
});

// ============================================================================
// Validation Failure Tests - Atomic Tokens
// ============================================================================

describe('validateTheme - Atomic Token Errors', () => {
  it('should fail if atomic.color is missing', () => {
    const invalidTheme = {
      ...validThemeWithTokens,
      tokens: {
        ...validThemeWithTokens.tokens,
        atomic: {
          // color missing!
          spacing: { '4': '16px' },
          radius: { md: '8px' },
          typography: { body: { fontSize: '16px', lineHeight: '24px', fontWeight: '400' } },
          shadow: { md: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
        },
      },
    };

    const result = validateTheme(invalidTheme);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.some(e => e.includes('color'))).toBe(true);
  });

  it('should fail if atomic.spacing is missing', () => {
    const invalidTheme = {
      ...validThemeWithTokens,
      tokens: {
        ...validThemeWithTokens.tokens,
        atomic: {
          color: { blue: { '500': '#3b82f6' } },
          // spacing missing!
          radius: { md: '8px' },
          typography: { body: { fontSize: '16px', lineHeight: '24px', fontWeight: '400' } },
          shadow: { md: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
        },
      },
    };

    const result = validateTheme(invalidTheme);
    expect(result.valid).toBe(false);
    expect(result.errors?.some(e => e.includes('spacing'))).toBe(true);
  });

  it('should fail if typography properties are incomplete', () => {
    const invalidTheme = {
      ...validThemeWithTokens,
      tokens: {
        ...validThemeWithTokens.tokens,
        atomic: {
          ...validThemeWithTokens.tokens.atomic,
          typography: {
            body: {
              fontSize: '16px',
              // lineHeight and fontWeight missing!
            },
          },
        },
      },
    };

    const result = validateTheme(invalidTheme);
    expect(result.valid).toBe(false);
    expect(result.errors?.some(e => e.includes('lineHeight') || e.includes('fontWeight'))).toBe(
      true
    );
  });
});

// ============================================================================
// Validation Failure Tests - Semantic Tokens
// ============================================================================

describe('validateTheme - Semantic Token Errors', () => {
  it('should fail if semantic.background is missing', () => {
    const invalidTheme = {
      ...validThemeWithTokens,
      tokens: {
        ...validThemeWithTokens.tokens,
        semantic: {
          // background missing!
          foreground: validThemeWithTokens.tokens.semantic.foreground,
          border: validThemeWithTokens.tokens.semantic.border,
          surface: validThemeWithTokens.tokens.semantic.surface,
        },
      },
    };

    const result = validateTheme(invalidTheme);
    expect(result.valid).toBe(false);
    expect(result.errors?.some(e => e.includes('background'))).toBe(true);
  });

  it('should fail if semantic.background.page is missing', () => {
    const invalidTheme = {
      ...validThemeWithTokens,
      tokens: {
        ...validThemeWithTokens.tokens,
        semantic: {
          ...validThemeWithTokens.tokens.semantic,
          background: {
            // page missing!
            surface: '#ffffff',
            elevated: '#ffffff',
            muted: '#f3f4f6',
            inverse: '#111827',
          },
        },
      },
    };

    const result = validateTheme(invalidTheme);
    expect(result.valid).toBe(false);
    expect(result.errors?.some(e => e.includes('page'))).toBe(true);
  });

  it('should fail if semantic.foreground is incomplete', () => {
    const invalidTheme = {
      ...validThemeWithTokens,
      tokens: {
        ...validThemeWithTokens.tokens,
        semantic: {
          ...validThemeWithTokens.tokens.semantic,
          foreground: {
            primary: '#111827',
            // secondary, muted, inverse, accent missing!
          },
        },
      },
    };

    const result = validateTheme(invalidTheme);
    expect(result.valid).toBe(false);
    expect(result.errors?.length).toBeGreaterThan(0);
  });

  it('should fail if semantic.border is missing required properties', () => {
    const invalidTheme = {
      ...validThemeWithTokens,
      tokens: {
        ...validThemeWithTokens.tokens,
        semantic: {
          ...validThemeWithTokens.tokens.semantic,
          border: {
            default: '#e5e7eb',
            // muted, focus, error missing!
          },
        },
      },
    };

    const result = validateTheme(invalidTheme);
    expect(result.valid).toBe(false);
    expect(
      result.errors?.some(e => e.includes('muted') || e.includes('focus') || e.includes('error'))
    ).toBe(true);
  });
});

// ============================================================================
// Validation Failure Tests - Component Tokens
// ============================================================================

describe('validateTheme - Component Token Errors', () => {
  it('should fail if tokens.component is missing', () => {
    const invalidTheme = {
      ...validThemeWithTokens,
      tokens: {
        atomic: validThemeWithTokens.tokens.atomic,
        semantic: validThemeWithTokens.tokens.semantic,
        // component missing!
      },
    };

    const result = validateTheme(invalidTheme);
    expect(result.valid).toBe(false);
    expect(result.errors?.some(e => e.includes('component'))).toBe(true);
  });

  it('should allow empty component tokens', () => {
    const themeWithEmptyComponents: ThemeWithTokens = {
      ...validThemeWithTokens,
      tokens: {
        ...validThemeWithTokens.tokens,
        component: {} as ComponentTokens, // Empty but present
      },
    };

    const result = validateTheme(themeWithEmptyComponents);
    expect(result.valid).toBe(true);
  });
});

// ============================================================================
// Validation Failure Tests - Dark Mode
// ============================================================================

describe('validateTheme - Dark Mode Validation', () => {
  it('should fail if darkMode has invalid structure', () => {
    const invalidTheme = {
      ...validThemeWithTokens,
      darkMode: {
        // tokens missing!
        invalidProp: 'test',
      },
    };

    const result = validateTheme(invalidTheme);
    expect(result.valid).toBe(false);
  });

  it('should allow empty dark mode semantic tokens', () => {
    const themeWithEmptyDarkMode: ThemeWithTokens = {
      ...validThemeWithTokens,
      darkMode: {
        tokens: {
          semantic: {}, // Empty partial semantic
          component: {},
        },
      },
    };

    const result = validateTheme(themeWithEmptyDarkMode);
    expect(result.valid).toBe(true);
  });
});

// ============================================================================
// Error Message Quality Tests
// ============================================================================

describe('validateTheme - Error Messages', () => {
  it('should provide clear error messages with field paths', () => {
    const invalidTheme = {
      ...validThemeWithTokens,
      tokens: {
        atomic: {
          color: {},
          spacing: {},
          // radius missing
        },
      },
    };

    const result = validateTheme(invalidTheme);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors!.length).toBeGreaterThan(0);
    expect(result.errors![0]).toContain('tokens.atomic');
  });

  it('should list multiple errors when multiple fields are invalid', () => {
    const invalidTheme = {
      ...validThemeWithTokens,
      tokens: {
        atomic: {
          // color, spacing, radius, typography, shadow all missing!
        },
      },
    };

    const result = validateTheme(invalidTheme);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors!.length).toBeGreaterThan(3); // Multiple errors
  });
});
