/**
 * Theme Context Definition
 * React Context for theme management
 */

import { createContext } from 'react';
import type { PresetName } from '../themes/types.js';
import type { SemanticToken, CompositionToken } from '../schemas/index.js';

/**
 * Theme Context Value Interface
 */
export interface ThemeContextValue {
  /** Current preset name */
  preset: PresetName;
  /** Set the current preset */
  setTheme: (preset: PresetName) => void;
  /** Current semantic tokens */
  tokens: SemanticToken | null;
  /** Current composition tokens */
  composition: CompositionToken | null;
  /** Dark mode enabled */
  darkMode: boolean;
  /** Toggle dark mode */
  toggleDarkMode: () => void;
}

/**
 * Theme Context
 * Provides theme state and actions to consuming components
 */
export const ThemeContext = createContext<ThemeContextValue | null>(null);

ThemeContext.displayName = 'ThemeContext';
