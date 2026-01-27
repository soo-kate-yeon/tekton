/**
 * ThemeSwitch - Client Component
 * SPEC-PLAYGROUND-001 Milestone 3: Theme Integration
 *
 * Provides UI for switching between themes
 */

'use client';

import { useState } from 'react';
import { BUILTIN_THEMES, type BuiltinThemeId } from '@tekton/core';

export interface ThemeSwitchProps {
  currentTheme?: BuiltinThemeId;
  onThemeChange?: (themeId: BuiltinThemeId) => void;
}

/**
 * ThemeSwitch component for switching between built-in themes
 */
export function ThemeSwitch({ currentTheme, onThemeChange }: ThemeSwitchProps) {
  const [selectedTheme, setSelectedTheme] = useState<BuiltinThemeId>(
    currentTheme || BUILTIN_THEMES[0]
  );

  const handleThemeChange = (themeId: BuiltinThemeId) => {
    setSelectedTheme(themeId);
    onThemeChange?.(themeId);
  };

  return (
    <div className="flex gap-2 items-center">
      <label htmlFor="theme-select" className="text-sm font-medium">
        Theme:
      </label>
      <select
        id="theme-select"
        value={selectedTheme}
        onChange={(e) => handleThemeChange(e.target.value as BuiltinThemeId)}
        className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
      >
        {BUILTIN_THEMES.map((themeId) => (
          <option key={themeId} value={themeId}>
            {themeId}
          </option>
        ))}
      </select>
    </div>
  );
}
