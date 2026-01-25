/**
 * @tekton/core - Token Type System Tests
 * Test-First: Define expected behavior for 3-layer token architecture
 */

import { describe, it, expect } from 'vitest';
import type {
  AtomicTokens,
  SemanticTokens,
  ComponentTokens,
  ThemeWithTokens,
} from '../src/tokens.js';

// ============================================================================
// Type Tests - Atomic Tokens
// ============================================================================

describe('AtomicTokens Type', () => {
  it('should allow valid atomic color tokens', () => {
    const validAtomicTokens: AtomicTokens = {
      color: {
        blue: {
          '500': '#3b82f6',
          '600': '#2563eb',
        },
        neutral: {
          '50': '#f9fafb',
          '900': '#111827',
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
      transition: {
        default: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
    };

    expect(validAtomicTokens.color.blue['500']).toBe('#3b82f6');
    expect(validAtomicTokens.spacing['4']).toBe('16px');
    expect(validAtomicTokens.typography.body.fontSize).toBe('16px');
  });

  it('should allow optional transition property', () => {
    const minimalAtomic: Partial<AtomicTokens> = {
      color: {},
      spacing: {},
      radius: {},
      typography: {},
      shadow: {},
      // transition is optional
    };

    expect(minimalAtomic.transition).toBeUndefined();
  });
});

// ============================================================================
// Type Tests - Semantic Tokens
// ============================================================================

describe('SemanticTokens Type', () => {
  it('should support semantic token structure with references', () => {
    const validSemantic: SemanticTokens = {
      background: {
        page: 'atomic.color.neutral.50',
        surface: 'atomic.color.white',
        elevated: 'atomic.color.white',
        muted: 'atomic.color.neutral.100',
        inverse: 'atomic.color.neutral.900',
      },
      foreground: {
        primary: 'atomic.color.neutral.900',
        secondary: 'atomic.color.neutral.600',
        muted: 'atomic.color.neutral.400',
        inverse: 'atomic.color.white',
        accent: 'atomic.color.primary.500',
      },
      border: {
        default: 'atomic.color.neutral.200',
        muted: 'atomic.color.neutral.100',
        focus: 'atomic.color.primary.500',
        error: 'atomic.color.red.500',
      },
      surface: {
        primary: 'atomic.color.white',
        secondary: 'atomic.color.neutral.50',
        tertiary: 'atomic.color.neutral.100',
        inverse: 'atomic.color.neutral.900',
      },
    };

    expect(validSemantic.background.page).toBe('atomic.color.neutral.50');
    expect(validSemantic.foreground.accent).toBe('atomic.color.primary.500');
  });
});

// ============================================================================
// Type Tests - Component Tokens
// ============================================================================

describe('ComponentTokens Type', () => {
  it('should support button component tokens', () => {
    const validComponent: ComponentTokens = {
      button: {
        primary: {
          background: 'semantic.foreground.accent',
          foreground: 'semantic.foreground.inverse',
          border: 'semantic.foreground.accent',
          hover: {
            background: 'atomic.color.primary.600',
            foreground: 'semantic.foreground.inverse',
          },
          active: {
            background: 'atomic.color.primary.700',
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
          ring: 'atomic.color.primary.500',
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
    };

    expect(validComponent.button.primary.background).toBe('semantic.foreground.accent');
    expect(validComponent.input.focus.ring).toBe('atomic.color.primary.500');
    expect(validComponent.card.shadow).toBe('atomic.shadow.md');
  });

  it('should allow extensible component tokens', () => {
    const extendedComponent: ComponentTokens = {
      button: {},
      input: {
        background: 'semantic.background.surface',
        foreground: 'semantic.foreground.primary',
        border: 'semantic.border.default',
        placeholder: 'semantic.foreground.muted',
        focus: {
          border: 'semantic.border.focus',
          ring: 'atomic.color.primary.500',
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
      // Extensible: add custom components
      badge: {
        background: 'semantic.background.muted',
        foreground: 'semantic.foreground.secondary',
      },
    };

    expect(extendedComponent.badge).toBeDefined();
  });
});

// ============================================================================
// Type Tests - ThemeWithTokens
// ============================================================================

describe('ThemeWithTokens Type', () => {
  it('should extend Theme interface with 3-layer tokens', () => {
    const validThemeWithTokens: Partial<ThemeWithTokens> = {
      id: 'test-theme',
      name: 'Test Theme',
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
          shadow: { md: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
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
            secondary: 'atomic.color.neutral.600',
            muted: 'atomic.color.neutral.400',
            inverse: '#ffffff',
            accent: 'atomic.color.primary.500',
          },
          border: {
            default: 'atomic.color.neutral.200',
            muted: 'atomic.color.neutral.100',
            focus: 'atomic.color.primary.500',
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
          button: {},
          input: {
            background: 'semantic.background.surface',
            foreground: 'semantic.foreground.primary',
            border: 'semantic.border.default',
            placeholder: 'semantic.foreground.muted',
            focus: {
              border: 'semantic.border.focus',
              ring: 'atomic.color.primary.500',
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

    expect(validThemeWithTokens.tokens?.atomic).toBeDefined();
    expect(validThemeWithTokens.tokens?.semantic).toBeDefined();
    expect(validThemeWithTokens.tokens?.component).toBeDefined();
  });

  it('should support optional dark mode tokens', () => {
    const themeWithDarkMode: Partial<ThemeWithTokens> = {
      id: 'test-theme',
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
                background: 'atomic.color.primary.400',
              } as ComponentTokens['button']['primary'],
            },
          },
        },
      },
    };

    expect(themeWithDarkMode.darkMode).toBeDefined();
    expect(themeWithDarkMode.darkMode?.tokens.semantic).toBeDefined();
    expect(themeWithDarkMode.darkMode?.tokens.component).toBeDefined();
  });

  it('should allow partial dark mode overrides', () => {
    const partialDarkMode: ThemeWithTokens['darkMode'] = {
      tokens: {
        semantic: {
          background: {
            page: 'atomic.color.neutral.900',
          } as SemanticTokens['background'],
        },
        component: {},
      },
    };

    expect(partialDarkMode?.tokens.semantic?.background?.page).toBe('atomic.color.neutral.900');
    expect(partialDarkMode?.tokens.component).toEqual({});
  });
});
