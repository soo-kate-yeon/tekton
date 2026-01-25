/**
 * @tekton/core - Token Resolution Tests
 * Test-First: Define expected behavior for token resolution and fallback logic
 * [SPEC-COMPONENT-001-A] [TOKEN-RESOLUTION]
 */

import { describe, it, expect } from 'vitest';
import { resolveToken, resolveWithFallback } from '../src/token-resolver.js';
import type { ThemeWithTokens } from '../src/tokens.js';

// ============================================================================
// Test Fixture: Mock Theme with 3-Layer Tokens
// ============================================================================

const mockThemeTokens: ThemeWithTokens['tokens'] = {
  atomic: {
    color: {
      blue: {
        '400': '#60a5fa',
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
};

// ============================================================================
// resolveToken() Tests
// ============================================================================

describe('resolveToken', () => {
  it('should return raw value if not a reference', () => {
    const result = resolveToken('#3b82f6', mockThemeTokens);
    expect(result).toBe('#3b82f6');
  });

  it('should resolve atomic token reference', () => {
    const result = resolveToken('atomic.color.blue.500', mockThemeTokens);
    expect(result).toBe('#3b82f6');
  });

  it('should resolve semantic token reference', () => {
    const result = resolveToken('semantic.background.page', mockThemeTokens);
    expect(result).toBe('#f9fafb'); // Resolves atomic.color.neutral.50
  });

  it('should resolve component token reference', () => {
    const result = resolveToken('component.button.primary.background', mockThemeTokens);
    expect(result).toBe('#3b82f6'); // semantic.foreground.accent → atomic.color.blue.500
  });

  it('should resolve multi-level references', () => {
    // component.input.border → semantic.border.default → atomic.color.neutral.200
    const result = resolveToken('component.input.border', mockThemeTokens);
    expect(result).toBe('#e5e7eb');
  });

  it('should resolve nested component tokens', () => {
    const result = resolveToken('component.input.focus.ring', mockThemeTokens);
    expect(result).toBe('#3b82f6'); // atomic.color.blue.500
  });

  it('should throw error for non-existent token', () => {
    expect(() => {
      resolveToken('atomic.color.purple.500', mockThemeTokens);
    }).toThrow('Token not found: atomic.color.purple.500');
  });

  it('should throw error for malformed reference', () => {
    expect(() => {
      resolveToken('atomic.nonexistent.path', mockThemeTokens);
    }).toThrow('Token not found');
  });

  it('should detect circular references', () => {
    const circularTokens: ThemeWithTokens['tokens'] = {
      atomic: {
        color: {},
        spacing: {},
        radius: {},
        typography: {},
        shadow: {},
      },
      semantic: {
        background: {
          page: 'semantic.background.surface',
          surface: 'semantic.background.page', // Circular!
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
      component: {
        button: {},
        input: {
          background: '#ffffff',
          foreground: '#111827',
          border: '#e5e7eb',
          placeholder: '#9ca3af',
          focus: { border: '#3b82f6', ring: '#3b82f6' },
          error: { border: '#ef4444', ring: '#ef4444' },
          disabled: { background: '#f3f4f6', foreground: '#9ca3af' },
        },
        card: {
          background: '#ffffff',
          foreground: '#111827',
          border: '#e5e7eb',
          shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        },
      },
    };

    expect(() => {
      resolveToken('semantic.background.page', circularTokens);
    }).toThrow('Circular token reference detected');
  });

  it('should handle direct values in semantic tokens', () => {
    // semantic.background.surface is '#ffffff' (direct value)
    const result = resolveToken('semantic.background.surface', mockThemeTokens);
    expect(result).toBe('#ffffff');
  });

  it('should resolve spacing tokens', () => {
    const result = resolveToken('atomic.spacing.4', mockThemeTokens);
    expect(result).toBe('16px');
  });

  it('should resolve shadow tokens', () => {
    const result = resolveToken('atomic.shadow.md', mockThemeTokens);
    expect(result).toBe('0 4px 6px -1px rgb(0 0 0 / 0.1)');
  });
});

// ============================================================================
// resolveWithFallback() Tests
// ============================================================================

describe('resolveWithFallback', () => {
  it('should return component token if exists', () => {
    const result = resolveWithFallback(
      'component.button.primary.background',
      'semantic.foreground.accent',
      'atomic.color.blue.500',
      mockThemeTokens
    );
    expect(result).toBe('#3b82f6');
  });

  it('should fallback to semantic token if component missing', () => {
    const result = resolveWithFallback(
      'component.button.nonexistent.background',
      'semantic.foreground.accent',
      'atomic.color.blue.500',
      mockThemeTokens
    );
    expect(result).toBe('#3b82f6'); // Falls back to semantic
  });

  it('should fallback to atomic token if semantic missing', () => {
    const result = resolveWithFallback(
      'component.button.nonexistent.background',
      'semantic.nonexistent.color',
      'atomic.color.blue.500',
      mockThemeTokens
    );
    expect(result).toBe('#3b82f6'); // Falls back to atomic
  });

  it('should throw error if all fallbacks fail', () => {
    expect(() => {
      resolveWithFallback(
        'component.nonexistent.token',
        'semantic.nonexistent.token',
        'atomic.nonexistent.token',
        mockThemeTokens
      );
    }).toThrow('Failed to resolve token with fallback');
  });

  it('should include all attempted references in error message', () => {
    expect(() => {
      resolveWithFallback(
        'component.missing.token',
        'semantic.missing.token',
        'atomic.missing.token',
        mockThemeTokens
      );
    }).toThrow('component.missing.token → semantic.missing.token → atomic.missing.token');
  });
});

// ============================================================================
// Performance Tests
// ============================================================================

describe('Performance', () => {
  it('should resolve token in < 1ms', () => {
    const iterations = 1000;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      resolveToken('component.input.border', mockThemeTokens);
    }

    const end = performance.now();
    const avgTime = (end - start) / iterations;

    expect(avgTime).toBeLessThan(1); // < 1ms per token
  });

  it('should handle deep references efficiently', () => {
    const start = performance.now();

    // Multi-level resolution
    resolveToken('component.button.primary.background', mockThemeTokens);

    const duration = performance.now() - start;
    expect(duration).toBeLessThan(1);
  });
});
