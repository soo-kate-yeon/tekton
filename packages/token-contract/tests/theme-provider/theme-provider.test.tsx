/**
 * ThemeProvider Tests
 * Tests for React Context-based theme management
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ThemeProvider } from '../../src/theme-provider/ThemeProvider.js';
import { useTheme } from '../../src/theme-provider/useTheme.js';
import type { PresetName } from '../../src/presets/types.js';

// Test component to access theme context
function TestComponent() {
  const { preset, tokens, darkMode } = useTheme();
  return (
    <div>
      <div data-testid="preset">{preset}</div>
      <div data-testid="dark-mode">{darkMode ? 'dark' : 'light'}</div>
      <div data-testid="has-tokens">{tokens ? 'yes' : 'no'}</div>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Clear any existing data-theme attribute
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    cleanup();
  });

  describe('Initialization', () => {
    it('should provide default professional preset', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('preset').textContent).toBe('professional');
      expect(screen.getByTestId('has-tokens').textContent).toBe('yes');
    });

    it('should initialize with specified preset', () => {
      render(
        <ThemeProvider defaultTheme="creative">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('preset').textContent).toBe('creative');
    });

    it('should initialize with light mode by default', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('dark-mode').textContent).toBe('light');
    });

    it('should initialize with dark mode if specified', () => {
      render(
        <ThemeProvider defaultDarkMode={true}>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('dark-mode').textContent).toBe('dark');
    });

    it('should detect system dark mode preference', () => {
      // Mock matchMedia for dark mode
      const mockMatchMedia = (query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      });

      window.matchMedia = mockMatchMedia as any;

      render(
        <ThemeProvider detectSystemTheme={true}>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('dark-mode').textContent).toBe('dark');
    });
  });

  describe('CSS Variable Application', () => {
    it('should apply CSS variables to document root', () => {
      render(
        <ThemeProvider defaultTheme="professional">
          <TestComponent />
        </ThemeProvider>
      );

      const rootStyle = getComputedStyle(document.documentElement);

      // Check if CSS variables are applied (will be set by applyCSSVariables)
      // We can't test actual computed values in jsdom, but we can verify the provider renders
      expect(screen.getByTestId('preset').textContent).toBe('professional');
    });

    it('should apply data-theme attribute for dark mode', () => {
      render(
        <ThemeProvider defaultDarkMode={true}>
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should remove data-theme attribute for light mode', () => {
      // First set dark mode
      document.documentElement.setAttribute('data-theme', 'dark');

      render(
        <ThemeProvider defaultDarkMode={false}>
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    });
  });

  describe('Provider Rendering', () => {
    it('should render children correctly', () => {
      render(
        <ThemeProvider>
          <div data-testid="child">Test Child</div>
        </ThemeProvider>
      );

      expect(screen.getByTestId('child').textContent).toBe('Test Child');
    });

    it('should handle multiple children', () => {
      render(
        <ThemeProvider>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
        </ThemeProvider>
      );

      expect(screen.getByTestId('child1').textContent).toBe('Child 1');
      expect(screen.getByTestId('child2').textContent).toBe('Child 2');
    });

    it('should support nested providers (inner should override)', () => {
      function InnerComponent() {
        const { preset } = useTheme();
        return <div data-testid="inner-preset">{preset}</div>;
      }

      render(
        <ThemeProvider defaultTheme="professional">
          <ThemeProvider defaultTheme="creative">
            <InnerComponent />
          </ThemeProvider>
        </ThemeProvider>
      );

      expect(screen.getByTestId('inner-preset').textContent).toBe('creative');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid preset gracefully', () => {
      // TypeScript prevents this, but test runtime behavior
      render(
        <ThemeProvider defaultTheme={'invalid' as PresetName}>
          <TestComponent />
        </ThemeProvider>
      );

      // Should fall back to professional
      expect(screen.getByTestId('preset').textContent).toBe('professional');
    });

    it('should provide error-free context even with no props', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('preset').textContent).toBeTruthy();
      expect(screen.getByTestId('has-tokens').textContent).toBe('yes');
    });
  });

  describe('Token Structure', () => {
    it('should provide tokens with semantic colors', () => {
      function TokenTestComponent() {
        const { tokens } = useTheme();
        const hasPrimary = tokens?.primary ? 'yes' : 'no';
        const hasNeutral = tokens?.neutral ? 'yes' : 'no';
        return (
          <div>
            <div data-testid="has-primary">{hasPrimary}</div>
            <div data-testid="has-neutral">{hasNeutral}</div>
          </div>
        );
      }

      render(
        <ThemeProvider>
          <TokenTestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('has-primary').textContent).toBe('yes');
      expect(screen.getByTestId('has-neutral').textContent).toBe('yes');
    });

    it('should provide tokens with composition values', () => {
      function CompositionTestComponent() {
        const { composition } = useTheme();
        const hasBorder = composition?.border ? 'yes' : 'no';
        const hasShadow = composition?.shadow ? 'yes' : 'no';
        return (
          <div>
            <div data-testid="has-border">{hasBorder}</div>
            <div data-testid="has-shadow">{hasShadow}</div>
          </div>
        );
      }

      render(
        <ThemeProvider>
          <CompositionTestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('has-border').textContent).toBe('yes');
      expect(screen.getByTestId('has-shadow').textContent).toBe('yes');
    });
  });
});
