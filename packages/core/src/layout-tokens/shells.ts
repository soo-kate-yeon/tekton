/**
 * @tekton/core - Shell Token Definitions
 * Concrete Shell Token implementations for web applications
 * [SPEC-LAYOUT-001] [PHASE-3]
 */

import type { ShellToken } from './types.js';
import type { TokenReference } from '../token-resolver.js';

// ============================================================================
// Shell Token Definitions
// ============================================================================

/**
 * Standard web application layout with header, sidebar, and main content area
 * Suitable for most application UIs with navigation and content sections
 */
export const SHELL_WEB_APP: ShellToken = {
  id: 'shell.web.app',
  description: 'Standard web application layout with header, sidebar, and main content area',
  platform: 'web',
  regions: [
    {
      name: 'header',
      position: 'top',
      size: 'atomic.spacing.16' as TokenReference,
      collapsible: false,
    },
    {
      name: 'sidebar',
      position: 'left',
      size: 'atomic.spacing.64' as TokenReference,
      collapsible: true,
      defaultCollapsed: false,
    },
    {
      name: 'main',
      position: 'center',
      size: 'atomic.spacing.full' as TokenReference,
      collapsible: false,
    },
    {
      name: 'footer',
      position: 'bottom',
      size: 'atomic.spacing.12' as TokenReference,
      collapsible: false,
    },
  ],
  responsive: {
    default: {
      sidebarVisible: false,
      headerHeight: 'atomic.spacing.14',
    },
    md: {
      sidebarVisible: true,
      headerHeight: 'atomic.spacing.16',
    },
    lg: {
      sidebarVisible: true,
      sidebarWidth: 'atomic.spacing.64',
    },
  },
  tokenBindings: {
    headerBackground: 'semantic.background.surface',
    sidebarBackground: 'semantic.background.elevated',
    mainBackground: 'semantic.background.page',
    headerBorder: 'semantic.border.default',
  },
};

/**
 * Marketing and landing page layout with full-width hero sections
 * Optimized for marketing content and promotional pages
 */
export const SHELL_WEB_MARKETING: ShellToken = {
  id: 'shell.web.marketing',
  description: 'Marketing and landing page layout with full-width hero sections',
  platform: 'web',
  regions: [
    {
      name: 'hero',
      position: 'top',
      size: 'atomic.spacing.full' as TokenReference,
      collapsible: false,
    },
    {
      name: 'features',
      position: 'center',
      size: 'atomic.spacing.full' as TokenReference,
      collapsible: false,
    },
    {
      name: 'cta',
      position: 'center',
      size: 'atomic.spacing.full' as TokenReference,
      collapsible: false,
    },
    {
      name: 'footer',
      position: 'bottom',
      size: 'atomic.spacing.16' as TokenReference,
      collapsible: false,
    },
  ],
  responsive: {
    default: {
      heroHeight: 'atomic.spacing.full',
      contentPadding: 'atomic.spacing.4',
    },
    md: {
      heroHeight: 'atomic.spacing.full',
      contentPadding: 'atomic.spacing.8',
    },
    lg: {
      heroHeight: 'atomic.spacing.full',
      contentPadding: 'atomic.spacing.12',
    },
  },
  tokenBindings: {
    heroBackground: 'semantic.background.brand',
    featuresBackground: 'semantic.background.page',
    ctaBackground: 'semantic.background.elevated',
    footerBackground: 'semantic.background.surface',
  },
};

/**
 * Authentication flow layout with centered content
 * Designed for login, signup, and password reset pages
 */
export const SHELL_WEB_AUTH: ShellToken = {
  id: 'shell.web.auth',
  description: 'Authentication flow layout with centered content (login/signup)',
  platform: 'web',
  regions: [
    {
      name: 'logo',
      position: 'top',
      size: 'atomic.spacing.12' as TokenReference,
      collapsible: false,
    },
    {
      name: 'main',
      position: 'center',
      size: 'atomic.spacing.96' as TokenReference,
      collapsible: false,
    },
  ],
  responsive: {
    default: {
      mainMaxWidth: '100%',
      contentPadding: 'atomic.spacing.4',
    },
    md: {
      mainMaxWidth: 'atomic.spacing.96',
      contentPadding: 'atomic.spacing.8',
    },
  },
  tokenBindings: {
    logoBackground: 'semantic.background.page',
    mainBackground: 'semantic.background.surface',
    mainBorder: 'semantic.border.default',
  },
};

/**
 * Admin dashboard layout with collapsible sidebar and header
 * Optimized for data-heavy admin interfaces with grid layouts
 */
export const SHELL_WEB_DASHBOARD: ShellToken = {
  id: 'shell.web.dashboard',
  description: 'Admin dashboard layout with collapsible sidebar and header',
  platform: 'web',
  regions: [
    {
      name: 'header',
      position: 'top',
      size: 'atomic.spacing.16' as TokenReference,
      collapsible: false,
    },
    {
      name: 'sidebar',
      position: 'left',
      size: 'atomic.spacing.64' as TokenReference,
      collapsible: true,
      defaultCollapsed: false,
    },
    {
      name: 'main',
      position: 'center',
      size: 'atomic.spacing.full' as TokenReference,
      collapsible: false,
    },
  ],
  responsive: {
    default: {
      sidebarVisible: false,
      sidebarCollapsed: true,
    },
    md: {
      sidebarVisible: true,
      sidebarCollapsed: false,
    },
    lg: {
      sidebarVisible: true,
      sidebarCollapsed: false,
      sidebarWidth: 'atomic.spacing.64',
    },
  },
  tokenBindings: {
    headerBackground: 'semantic.background.surface',
    sidebarBackground: 'semantic.background.elevated',
    mainBackground: 'semantic.background.page',
    gridGap: 'semantic.spacing.default',
  },
};

/**
 * Admin panel layout with fixed sidebar and tabbed main content
 * Designed for complex admin interfaces with persistent navigation
 */
export const SHELL_WEB_ADMIN: ShellToken = {
  id: 'shell.web.admin',
  description: 'Admin panel layout with fixed sidebar and tabbed main content area',
  platform: 'web',
  regions: [
    {
      name: 'header',
      position: 'top',
      size: 'atomic.spacing.16' as TokenReference,
      collapsible: false,
    },
    {
      name: 'sidebar',
      position: 'left',
      size: 'atomic.spacing.56' as TokenReference,
      collapsible: false,
    },
    {
      name: 'main',
      position: 'center',
      size: 'atomic.spacing.full' as TokenReference,
      collapsible: false,
    },
    {
      name: 'footer',
      position: 'bottom',
      size: 'atomic.spacing.8' as TokenReference,
      collapsible: false,
    },
  ],
  responsive: {
    default: {
      layout: 'stacked',
      sidebarPosition: 'top',
    },
    md: {
      layout: 'side-by-side',
      sidebarPosition: 'left',
      sidebarWidth: 'atomic.spacing.56',
    },
  },
  tokenBindings: {
    headerBackground: 'semantic.background.surface',
    sidebarBackground: 'semantic.background.elevated',
    mainBackground: 'semantic.background.page',
    footerBackground: 'semantic.background.surface',
    sidebarBorder: 'semantic.border.default',
  },
};

/**
 * Minimal layout with single main content area
 * Perfect for focused single-task interfaces and simple pages
 */
export const SHELL_WEB_MINIMAL: ShellToken = {
  id: 'shell.web.minimal',
  description: 'Minimal layout with single main content area (no header/sidebar/footer)',
  platform: 'web',
  regions: [
    {
      name: 'main',
      position: 'center',
      size: 'atomic.spacing.128' as TokenReference,
      collapsible: false,
    },
  ],
  responsive: {
    default: {
      mainMaxWidth: '100%',
      contentPadding: 'atomic.spacing.4',
    },
    md: {
      mainMaxWidth: 'atomic.spacing.128',
      contentPadding: 'atomic.spacing.8',
    },
  },
  tokenBindings: {
    mainBackground: 'semantic.background.page',
  },
};

// ============================================================================
// Internal Token Map
// ============================================================================

/**
 * Internal map for quick shell token lookups by ID
 * Used by getShellToken() for O(1) access
 */
const SHELL_TOKENS_MAP: Record<string, ShellToken> = {
  'shell.web.app': SHELL_WEB_APP,
  'shell.web.marketing': SHELL_WEB_MARKETING,
  'shell.web.auth': SHELL_WEB_AUTH,
  'shell.web.dashboard': SHELL_WEB_DASHBOARD,
  'shell.web.admin': SHELL_WEB_ADMIN,
  'shell.web.minimal': SHELL_WEB_MINIMAL,
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get a shell token by its ID
 *
 * @param shellId - Shell token ID (e.g., "shell.web.app")
 * @returns ShellToken if found, undefined otherwise
 *
 * @example
 * ```typescript
 * const appShell = getShellToken('shell.web.app');
 * if (appShell) {
 *   console.log(appShell.description);
 * }
 * ```
 */
export function getShellToken(shellId: string): ShellToken | undefined {
  return SHELL_TOKENS_MAP[shellId];
}

/**
 * Get all available shell tokens
 *
 * @returns Array of all ShellTokens
 *
 * @example
 * ```typescript
 * const allShells = getAllShellTokens();
 * console.log(`Available shells: ${allShells.length}`);
 * ```
 */
export function getAllShellTokens(): ShellToken[] {
  return Object.values(SHELL_TOKENS_MAP);
}

/**
 * Get shell tokens filtered by platform
 *
 * @param platform - Target platform ('web', 'mobile', or 'desktop')
 * @returns Array of ShellTokens for the specified platform
 *
 * @example
 * ```typescript
 * const webShells = getShellsByPlatform('web');
 * console.log(`Web shells: ${webShells.length}`);
 * ```
 */
export function getShellsByPlatform(platform: 'web' | 'mobile' | 'desktop'): ShellToken[] {
  return getAllShellTokens().filter(shell => shell.platform === platform);
}
