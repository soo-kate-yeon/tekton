/**
 * ThemeProvider - Server Component
 * SPEC-PLAYGROUND-001 Milestone 3: Theme Integration
 *
 * Injects CSS Variables into document head using @tekton/core's generateThemeCSS
 */

import { generateThemeCSS } from '@tekton/core';
import type { Theme, ThemeWithTokens } from '@tekton/core';

export interface ThemeProviderProps {
  theme: Theme | ThemeWithTokens | null;
  children: React.ReactNode;
}

/**
 * ThemeProvider injects theme CSS variables as a Server Component
 * This allows Next.js to generate the CSS at build time or on the server
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  // Generate CSS from theme tokens
  // Note: Only ThemeWithTokens can generate full CSS
  // Plain Theme will render children without CSS injection (graceful degradation)
  const css =
    theme && 'tokens' in theme && theme.tokens
      ? generateThemeCSS(theme as ThemeWithTokens)
      : '';

  return (
    <>
      {/* Inject CSS variables into document head */}
      {css && (
        <style
          dangerouslySetInnerHTML={{ __html: css }}
          data-theme-id={theme?.id}
          suppressHydrationWarning
        />
      )}
      {children}
    </>
  );
}
