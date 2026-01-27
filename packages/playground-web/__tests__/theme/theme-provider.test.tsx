/**
 * ThemeProvider Tests
 * SPEC-PLAYGROUND-001 Milestone 3: Theme Integration
 *
 * Test Coverage:
 * - CSS Variables injection
 * - Theme loading from @tekton/core
 * - generateThemeCSS integration
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/components/theme/theme-provider';

describe('ThemeProvider', () => {
  // Create a proper ThemeWithTokens mock that matches the interface
  const createMockTheme = () => ({
    id: 'test-theme',
    name: 'Test Theme',
    description: 'Test theme for unit tests',
    stackInfo: {
      framework: 'nextjs' as const,
      styling: 'tailwindcss' as const,
      components: 'shadcn-ui' as const,
    },
    brandTone: 'professional' as const,
    colorPalette: {
      primary: { l: 0.5, c: 0.2, h: 250 },
      secondary: { l: 0.6, c: 0.15, h: 220 },
      accent: { l: 0.65, c: 0.18, h: 150 },
      neutral: { l: 0.5, c: 0.02, h: 240 },
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      fontScale: 'medium' as const,
      headingWeight: 600,
      bodyWeight: 400,
    },
    componentDefaults: {
      borderRadius: 'medium' as const,
      density: 'comfortable' as const,
      contrast: 'medium' as const,
    },
    tokens: {
      atomic: {
        color: {
          blue: { '500': 'oklch(0.5 0.2 250)' },
          neutral: { '50': 'oklch(0.98 0 0)', '900': 'oklch(0.2 0 0)' },
        },
        spacing: { '4': '16px', '8': '32px' },
        radius: { sm: '4px', md: '8px' },
        shadow: { md: '0 4px 6px rgba(0,0,0,0.1)' },
        typography: {
          body: { fontSize: '16px', lineHeight: '1.5', fontWeight: '400' },
          heading: { fontSize: '24px', lineHeight: '1.2', fontWeight: '600' },
        },
      },
      semantic: {
        background: {
          page: 'oklch(0.98 0 0)',
          surface: 'oklch(1 0 0)',
          elevated: 'oklch(1 0 0)',
          muted: 'oklch(0.95 0 0)',
          inverse: 'oklch(0.2 0 0)',
        },
        foreground: {
          primary: 'oklch(0.2 0 0)',
          secondary: 'oklch(0.4 0 0)',
          muted: 'oklch(0.6 0 0)',
          inverse: 'oklch(1 0 0)',
          accent: 'oklch(0.5 0.2 250)',
        },
        border: {
          default: 'oklch(0.8 0 0)',
          muted: 'oklch(0.9 0 0)',
          strong: 'oklch(0.6 0 0)',
        },
        accent: {
          primary: 'oklch(0.5 0.2 250)',
          secondary: 'oklch(0.6 0.15 220)',
          muted: 'oklch(0.7 0.1 240)',
        },
        status: {
          success: 'oklch(0.6 0.15 140)',
          warning: 'oklch(0.7 0.18 60)',
          error: 'oklch(0.55 0.22 25)',
          info: 'oklch(0.6 0.18 240)',
        },
      },
      component: {
        button: {
          primary: {
            background: 'oklch(0.5 0.2 250)',
            foreground: 'oklch(1 0 0)',
            border: 'oklch(0.5 0.2 250)',
            hover: {
              background: 'oklch(0.45 0.2 250)',
              foreground: 'oklch(1 0 0)',
            },
            active: {
              background: 'oklch(0.4 0.2 250)',
            },
            disabled: {
              background: 'oklch(0.9 0 0)',
              foreground: 'oklch(0.6 0 0)',
            },
          },
        },
        input: {
          background: 'oklch(1 0 0)',
          foreground: 'oklch(0.2 0 0)',
          border: 'oklch(0.8 0 0)',
          placeholder: 'oklch(0.6 0 0)',
          focus: {
            border: 'oklch(0.5 0.2 250)',
            ring: 'oklch(0.7 0.15 250)',
          },
          error: {
            border: 'oklch(0.55 0.22 25)',
            ring: 'oklch(0.7 0.15 25)',
          },
        },
      },
    },
  });

  it('should inject CSS variables into document head', () => {
    const mockTheme = createMockTheme();

    const { container } = render(
      <ThemeProvider theme={mockTheme as any}>
        <div>Test Content</div>
      </ThemeProvider>
    );

    // Verify style tag is injected
    const styleTag = container.querySelector('style');
    expect(styleTag).toBeDefined();

    // Verify CSS variables are present
    const cssContent = styleTag?.textContent || '';
    expect(cssContent).toContain(':root');
  });

  it('should render children correctly', () => {
    const mockTheme = createMockTheme();

    const { getByText } = render(
      <ThemeProvider theme={mockTheme as any}>
        <div>Test Content</div>
      </ThemeProvider>
    );

    expect(getByText('Test Content')).toBeDefined();
  });

  it('should handle missing theme gracefully', () => {
    const { container } = render(
      <ThemeProvider theme={null}>
        <div>Fallback Content</div>
      </ThemeProvider>
    );

    expect(container).toBeDefined();
  });
});
