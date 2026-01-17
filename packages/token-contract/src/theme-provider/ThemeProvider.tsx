/**
 * ThemeProvider Component
 * Provides theme context to child components
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ThemeContext } from './ThemeContext.js';
import { loadPreset } from '../presets/preset-loader.js';
import { applyCSSVariables } from './apply-css-variables.js';
import type { PresetName } from '../presets/types.js';

/**
 * ThemeProvider Props
 */
export interface ThemeProviderProps {
  /** Child components */
  children: React.ReactNode;
  /** Default preset to load */
  defaultPreset?: PresetName;
  /** Default dark mode state */
  defaultDarkMode?: boolean;
  /** Detect system theme preference */
  detectSystemTheme?: boolean;
}

/**
 * Detect system dark mode preference
 */
function detectSystemDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

/**
 * ThemeProvider Component
 * Manages theme state and provides context to children
 */
export function ThemeProvider({
  children,
  defaultPreset = 'professional',
  defaultDarkMode = false,
  detectSystemTheme = false,
}: ThemeProviderProps) {
  // Determine initial dark mode state
  const initialDarkMode = detectSystemTheme
    ? detectSystemDarkMode()
    : defaultDarkMode;

  // State
  const [preset, setPresetState] = useState<PresetName>(() => {
    // Validate preset or fall back to professional
    try {
      loadPreset(defaultPreset);
      return defaultPreset;
    } catch {
      return 'professional';
    }
  });

  const [darkMode, setDarkMode] = useState<boolean>(initialDarkMode);

  // Load tokens from preset
  const { tokens, composition } = useMemo(() => {
    try {
      const loadedPreset = loadPreset(preset);
      return {
        tokens: loadedPreset.tokens,
        composition: loadedPreset.composition,
      };
    } catch {
      // Fallback to professional if preset fails to load
      const fallbackPreset = loadPreset('professional');
      return {
        tokens: fallbackPreset.tokens,
        composition: fallbackPreset.composition,
      };
    }
  }, [preset]);

  // Stable callback for setting preset
  const setPreset = useCallback((newPreset: PresetName) => {
    setPresetState(newPreset);
  }, []);

  // Stable callback for toggling dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  // Apply CSS variables when tokens or dark mode changes
  useEffect(() => {
    if (tokens && composition) {
      applyCSSVariables(tokens, composition);
    }
  }, [tokens, composition]);

  // Apply data-theme attribute for dark mode
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
  }, [darkMode]);

  // Context value (memoized to prevent unnecessary re-renders)
  const contextValue = useMemo(
    () => ({
      preset,
      setPreset,
      tokens,
      composition,
      darkMode,
      toggleDarkMode,
    }),
    [preset, setPreset, tokens, composition, darkMode, toggleDarkMode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
