/**
 * useTheme Hook
 * Custom hook for accessing theme context
 */

import { useContext } from 'react';
import { ThemeContext } from './ThemeContext.js';
import type { ThemeContextValue } from './ThemeContext.js';

/**
 * useTheme Hook
 * Access the current theme context
 * @throws Error if used outside ThemeProvider
 * @returns Theme context value
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
