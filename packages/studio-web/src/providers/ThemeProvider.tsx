'use client';

import { createContext, useContext, type ReactNode, useEffect, useState, useCallback } from 'react';

/**
 * Available themes in the system
 * - default: Light theme with rounded corners and sans-serif fonts
 * - dark: Dark theme variant
 * - premium-editorial: NYTimes-inspired theme with serif fonts and sharp corners
 */
export type ThemeName = 'default' | 'dark' | 'premium-editorial';

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  availableThemes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  defaultDarkMode?: boolean;
  detectSystemTheme?: boolean;
  initialTheme?: ThemeName;
}

const AVAILABLE_THEMES: ThemeName[] = ['default', 'dark', 'premium-editorial'];
const THEME_STORAGE_KEY = 'tekton-theme';

export function ThemeProvider({
  children,
  defaultDarkMode = false,
  detectSystemTheme = true,
  initialTheme,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>('default');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from storage or system preference
  useEffect(() => {
    setMounted(true);

    // Check for stored theme first
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null;
    if (storedTheme && AVAILABLE_THEMES.includes(storedTheme)) {
      setThemeState(storedTheme);
      return;
    }

    // Then check initial theme prop
    if (initialTheme) {
      setThemeState(initialTheme);
      return;
    }

    // Finally, detect system preference
    if (detectSystemTheme) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setThemeState(mediaQuery.matches ? 'dark' : 'default');

      const handler = (e: MediaQueryListEvent) => {
        // Only auto-switch if user hasn't manually selected a theme
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (!stored) {
          setThemeState(e.matches ? 'dark' : 'default');
        }
      };
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      setThemeState(defaultDarkMode ? 'dark' : 'default');
    }
  }, [defaultDarkMode, detectSystemTheme, initialTheme]);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) {return;}

    if (theme === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, mounted]);

  const setTheme = useCallback((newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes: AVAILABLE_THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 * Provides current theme, setTheme function, and list of available themes
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  // Fallback for when used outside provider (maintains backward compatibility)
  const [fallbackTheme, setFallbackTheme] = useState<ThemeName>('default');

  useEffect(() => {
    if (!context) {
      const dataTheme = document.documentElement.getAttribute('data-theme') as ThemeName | null;
      setFallbackTheme(dataTheme || 'default');

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'data-theme') {
            const newTheme = document.documentElement.getAttribute('data-theme') as ThemeName | null;
            setFallbackTheme(newTheme || 'default');
          }
        });
      });

      observer.observe(document.documentElement, { attributes: true });
      return () => observer.disconnect();
    }
  }, [context]);

  if (context) {
    // Also provide backward-compatible darkMode property
    return {
      ...context,
      darkMode: context.theme === 'dark',
      toggleDarkMode: () => {
        context.setTheme(context.theme === 'dark' ? 'default' : 'dark');
      },
    };
  }

  // Fallback behavior
  return {
    theme: fallbackTheme,
    setTheme: (newTheme: ThemeName) => {
      if (newTheme === 'default') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', newTheme);
      }
      setFallbackTheme(newTheme);
    },
    availableThemes: AVAILABLE_THEMES,
    darkMode: fallbackTheme === 'dark',
    toggleDarkMode: () => {
      const newTheme = fallbackTheme === 'dark' ? 'default' : 'dark';
      if (newTheme === 'default') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', newTheme);
      }
      setFallbackTheme(newTheme);
    },
  };
}
