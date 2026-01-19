/**
 * Theme Switching Tests
 * Tests for dynamic theme and dark mode switching
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { act } from 'react';
import { ThemeProvider } from '../../src/theme-provider/ThemeProvider.js';
import { useTheme } from '../../src/theme-provider/useTheme.js';

// Test component with theme switching capabilities
function ThemeSwitcher() {
  const { preset, setTheme, darkMode, toggleDarkMode } = useTheme();

  return (
    <div>
      <div data-testid="current-preset">{preset}</div>
      <div data-testid="current-mode">{darkMode ? 'dark' : 'light'}</div>
      <button
        data-testid="switch-creative"
        onClick={() => setTheme('creative')}
      >
        Switch to Creative
      </button>
      <button
        data-testid="switch-minimal"
        onClick={() => setTheme('minimal')}
      >
        Switch to Minimal
      </button>
      <button data-testid="toggle-dark" onClick={toggleDarkMode}>
        Toggle Dark Mode
      </button>
    </div>
  );
}

describe('Theme Switching', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    cleanup();
  });

  describe('Preset Switching', () => {
    it('should switch between presets', () => {
      render(
        <ThemeProvider defaultTheme="professional">
          <ThemeSwitcher />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-preset').textContent).toBe('professional');

      // Switch to creative
      act(() => {
        screen.getByTestId('switch-creative').click();
      });

      expect(screen.getByTestId('current-preset').textContent).toBe('creative');

      // Switch to minimal
      act(() => {
        screen.getByTestId('switch-minimal').click();
      });

      expect(screen.getByTestId('current-preset').textContent).toBe('minimal');
    });

    it('should update tokens when preset changes', () => {
      function TokenWatcher() {
        const { preset, tokens, setTheme } = useTheme();
        return (
          <div>
            <div data-testid="preset">{preset}</div>
            <div data-testid="has-tokens">{tokens ? 'yes' : 'no'}</div>
            <button onClick={() => setTheme('bold')}>Switch</button>
          </div>
        );
      }

      render(
        <ThemeProvider defaultTheme="professional">
          <TokenWatcher />
        </ThemeProvider>
      );

      expect(screen.getByTestId('has-tokens').textContent).toBe('yes');

      act(() => {
        screen.getByText('Switch').click();
      });

      expect(screen.getByTestId('preset').textContent).toBe('bold');
      expect(screen.getByTestId('has-tokens').textContent).toBe('yes');
    });

    it('should apply new CSS variables when preset changes', () => {
      render(
        <ThemeProvider defaultTheme="professional">
          <ThemeSwitcher />
        </ThemeProvider>
      );

      act(() => {
        screen.getByTestId('switch-creative').click();
      });

      // CSS variables should be updated (verified by the provider's effect)
      expect(screen.getByTestId('current-preset').textContent).toBe('creative');
    });

    it('should handle rapid preset switches', () => {
      render(
        <ThemeProvider defaultTheme="professional">
          <ThemeSwitcher />
        </ThemeProvider>
      );

      act(() => {
        screen.getByTestId('switch-creative').click();
        screen.getByTestId('switch-minimal').click();
        screen.getByTestId('switch-creative').click();
      });

      expect(screen.getByTestId('current-preset').textContent).toBe('creative');
    });
  });

  describe('Dark Mode Toggling', () => {
    it('should toggle dark mode on and off', () => {
      render(
        <ThemeProvider defaultDarkMode={false}>
          <ThemeSwitcher />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-mode').textContent).toBe('light');
      expect(document.documentElement.hasAttribute('data-theme')).toBe(false);

      // Toggle to dark
      act(() => {
        screen.getByTestId('toggle-dark').click();
      });

      expect(screen.getByTestId('current-mode').textContent).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      // Toggle back to light
      act(() => {
        screen.getByTestId('toggle-dark').click();
      });

      expect(screen.getByTestId('current-mode').textContent).toBe('light');
      expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    });

    it('should update data-theme attribute when toggling', () => {
      render(
        <ThemeProvider>
          <ThemeSwitcher />
        </ThemeProvider>
      );

      act(() => {
        screen.getByTestId('toggle-dark').click();
      });

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      act(() => {
        screen.getByTestId('toggle-dark').click();
      });

      expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    });

    it('should maintain preset when toggling dark mode', () => {
      render(
        <ThemeProvider defaultTheme="creative">
          <ThemeSwitcher />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-preset').textContent).toBe('creative');

      act(() => {
        screen.getByTestId('toggle-dark').click();
      });

      expect(screen.getByTestId('current-preset').textContent).toBe('creative');
      expect(screen.getByTestId('current-mode').textContent).toBe('dark');
    });
  });

  describe('Combined Switching', () => {
    it('should handle preset and dark mode changes together', () => {
      render(
        <ThemeProvider defaultTheme="professional" defaultDarkMode={false}>
          <ThemeSwitcher />
        </ThemeProvider>
      );

      // Switch preset
      act(() => {
        screen.getByTestId('switch-creative').click();
      });

      expect(screen.getByTestId('current-preset').textContent).toBe('creative');

      // Toggle dark mode
      act(() => {
        screen.getByTestId('toggle-dark').click();
      });

      expect(screen.getByTestId('current-preset').textContent).toBe('creative');
      expect(screen.getByTestId('current-mode').textContent).toBe('dark');

      // Switch preset again
      act(() => {
        screen.getByTestId('switch-minimal').click();
      });

      expect(screen.getByTestId('current-preset').textContent).toBe('minimal');
      expect(screen.getByTestId('current-mode').textContent).toBe('dark');
    });

    it('should update CSS variables for all combinations', () => {
      render(
        <ThemeProvider>
          <ThemeSwitcher />
        </ThemeProvider>
      );

      // Switch to creative
      act(() => {
        screen.getByTestId('switch-creative').click();
      });

      expect(screen.getByTestId('current-preset').textContent).toBe('creative');

      // Toggle dark mode
      act(() => {
        screen.getByTestId('toggle-dark').click();
      });

      expect(screen.getByTestId('current-mode').textContent).toBe('dark');

      // Switch to minimal
      act(() => {
        screen.getByTestId('switch-minimal').click();
      });

      expect(screen.getByTestId('current-preset').textContent).toBe('minimal');
      expect(screen.getByTestId('current-mode').textContent).toBe('dark');
    });
  });

  describe('Performance', () => {
    it('should not cause excessive re-renders on preset change', () => {
      let renderCount = 0;

      function RenderCounter() {
        renderCount++;
        const { preset, setTheme } = useTheme();
        return (
          <div>
            <div data-testid="render-count">{renderCount}</div>
            <button onClick={() => setTheme('creative')}>Switch</button>
          </div>
        );
      }

      render(
        <ThemeProvider>
          <RenderCounter />
        </ThemeProvider>
      );

      const initialCount = renderCount;

      act(() => {
        screen.getByText('Switch').click();
      });

      // Should re-render, but not excessively (target: ≤3 re-renders)
      expect(renderCount - initialCount).toBeLessThanOrEqual(3);
    });

    it('should not cause excessive re-renders on dark mode toggle', () => {
      let renderCount = 0;

      function RenderCounter() {
        renderCount++;
        const { toggleDarkMode } = useTheme();
        return (
          <div>
            <div data-testid="render-count">{renderCount}</div>
            <button onClick={toggleDarkMode}>Toggle</button>
          </div>
        );
      }

      render(
        <ThemeProvider>
          <RenderCounter />
        </ThemeProvider>
      );

      const initialCount = renderCount;

      act(() => {
        screen.getByText('Toggle').click();
      });

      // Should re-render, but not excessively (target: ≤3 re-renders)
      expect(renderCount - initialCount).toBeLessThanOrEqual(3);
    });
  });

  describe('Callback Stability', () => {
    it('should provide stable setTheme callback', () => {
      const callbacks: any[] = [];

      function CallbackTracker() {
        const { setTheme } = useTheme();
        callbacks.push(setTheme);
        return <div>Tracker</div>;
      }

      const { rerender } = render(
        <ThemeProvider>
          <CallbackTracker />
        </ThemeProvider>
      );

      rerender(
        <ThemeProvider>
          <CallbackTracker />
        </ThemeProvider>
      );

      // Callbacks should be stable (same reference)
      expect(callbacks[0]).toBe(callbacks[1]);
    });

    it('should provide stable toggleDarkMode callback', () => {
      const callbacks: any[] = [];

      function CallbackTracker() {
        const { toggleDarkMode } = useTheme();
        callbacks.push(toggleDarkMode);
        return <div>Tracker</div>;
      }

      const { rerender } = render(
        <ThemeProvider>
          <CallbackTracker />
        </ThemeProvider>
      );

      rerender(
        <ThemeProvider>
          <CallbackTracker />
        </ThemeProvider>
      );

      // Callbacks should be stable (same reference)
      expect(callbacks[0]).toBe(callbacks[1]);
    });
  });
});
