/**
 * ThemeSwitch - Client Component
 * SPEC-PLAYGROUND-001 Milestone 3: Theme Integration
 *
 * Provides UI for switching between themes
 * Updated to use v2.1 API - receives theme list as props
 */

'use client';

import { useState } from 'react';

export interface ThemeSwitchProps {
  /** List of available theme IDs */
  themes: string[];
  /** Currently selected theme ID */
  currentTheme?: string;
  /** Callback when theme changes */
  onThemeChange?: (themeId: string) => void;
}

/**
 * ThemeSwitch component for switching between themes
 * Theme list is passed as props (loaded by parent server component)
 */
export function ThemeSwitch({ themes, currentTheme, onThemeChange }: ThemeSwitchProps) {
  const [selectedTheme, setSelectedTheme] = useState<string>(currentTheme || themes[0] || '');

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    onThemeChange?.(themeId);
  };

  if (themes.length === 0) {
    return <div className="text-sm text-gray-500">No themes available</div>;
  }

  return (
    <div className="flex gap-2 items-center">
      <label htmlFor="theme-select" className="text-sm font-medium">
        Theme:
      </label>
      <select
        id="theme-select"
        value={selectedTheme}
        onChange={(e) => handleThemeChange(e.target.value)}
        className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
      >
        {themes.map((themeId) => (
          <option key={themeId} value={themeId}>
            {themeId}
          </option>
        ))}
      </select>
    </div>
  );
}
