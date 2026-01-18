'use client';

import { useTheme, type ThemeName } from '@/providers/ThemeProvider';
import { cn } from '@/lib/utils/cn';

const THEME_CONFIG: Record<ThemeName, { label: string; description: string; icon: React.ReactNode }> = {
  default: {
    label: 'Default',
    description: 'Light theme with modern styling',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    ),
  },
  dark: {
    label: 'Dark',
    description: 'Dark theme for low-light environments',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    ),
  },
  'premium-editorial': {
    label: 'Premium Editorial',
    description: 'NYTimes-inspired elegant reading experience',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M8 7h8M8 11h8M8 15h4" />
      </svg>
    ),
  },
};

export function ThemeSelector() {
  const { theme, setTheme, availableThemes } = useTheme();

  return (
    <div className="relative group">
      <button
        className={cn(
          'inline-flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium',
          'ring-offset-background transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        )}
        aria-label="Select theme"
      >
        {THEME_CONFIG[theme].icon}
        <span className="hidden sm:inline">{THEME_CONFIG[theme].label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div className="absolute right-0 top-full mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="rounded-lg border bg-card p-1 shadow-lg">
          {availableThemes.map((themeName) => {
            const config = THEME_CONFIG[themeName];
            const isActive = theme === themeName;

            return (
              <button
                key={themeName}
                onClick={() => setTheme(themeName)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-md p-3 text-left transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive && 'bg-accent/50'
                )}
              >
                <span className="mt-0.5 text-muted-foreground">{config.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{config.label}</span>
                    {isActive && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
