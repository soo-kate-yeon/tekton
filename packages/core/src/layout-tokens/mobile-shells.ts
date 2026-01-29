/**
 * @tekton/core - Mobile Shell Token Definitions
 * Concrete Mobile Shell Token implementations for mobile applications
 * [SPEC-LAYOUT-004] [MILESTONE-2]
 */

import type { MobileShellToken } from './types.js';
import type { TokenReference } from '../token-resolver.js';

// ============================================================================
// Mobile Shell Token Definitions
// ============================================================================

/**
 * Standard mobile app layout with header, main content, and bottom tab
 * Suitable for most mobile applications with tab-based navigation
 */
export const SHELL_MOBILE_APP: MobileShellToken = {
  id: 'shell.mobile.app',
  description: 'Standard mobile app layout with header, main content, and bottom tab',
  platform: 'mobile',
  os: 'cross-platform',
  regions: [
    {
      name: 'header',
      position: 'top',
      size: 'atomic.spacing.14' as TokenReference,
      collapsible: false,
    },
    {
      name: 'main',
      position: 'center',
      size: 'atomic.spacing.full' as TokenReference,
      collapsible: false,
    },
    {
      name: 'bottomTab',
      position: 'bottom',
      size: 'atomic.spacing.16' as TokenReference,
      collapsible: true,
    },
  ],
  safeArea: {
    top: 'atomic.spacing.0' as TokenReference,
    bottom: 'atomic.spacing.0' as TokenReference,
    left: 'atomic.spacing.0' as TokenReference,
    right: 'atomic.spacing.0' as TokenReference,
    defaults: {
      notch: 44,
      dynamicIsland: 59,
      homeIndicator: 34,
      statusBar: 20,
    },
    edges: {
      top: true,
      bottom: true,
      horizontal: true,
    },
  },
  systemUI: {
    statusBar: {
      height: 'atomic.spacing.5' as TokenReference,
      visible: true,
      style: 'auto',
      translucent: true,
    },
    navigationBar: {
      height: 'atomic.spacing.12' as TokenReference,
      mode: 'overlay',
      buttonStyle: 'auto',
    },
  },
  keyboard: {
    avoidance: 'padding',
    behavior: 'height',
    animation: {
      duration: 250,
      easing: 'keyboard',
      enabled: true,
    },
    dismissMode: 'on-drag',
  },
  bottomTab: {
    height: 'atomic.spacing.16' as TokenReference,
    safeAreaBottom: 'atomic.spacing.9' as TokenReference,
    totalHeight: 'atomic.spacing.25' as TokenReference,
    visibility: 'always',
    maxItems: 5,
    item: {
      minTouchTarget: 'atomic.spacing.11' as TokenReference,
      iconSize: 'atomic.spacing.6' as TokenReference,
      labelSize: 'atomic.spacing.3' as TokenReference,
      spacing: 'atomic.spacing.1' as TokenReference,
    },
  },
  touchTarget: {
    minSize: 'atomic.spacing.11' as TokenReference,
    hitSlop: {
      top: 8,
      bottom: 8,
      left: 8,
      right: 8,
    },
  },
  responsive: {
    default: {
      headerVisible: true,
      bottomTabVisible: true,
    },
    md: {
      headerVisible: true,
      bottomTabVisible: true,
    },
  },
  tokenBindings: {
    headerBackground: 'semantic.background.surface',
    mainBackground: 'semantic.background.base',
    bottomTabBackground: 'semantic.background.surface',
    headerBorder: 'semantic.border.default',
    bottomTabBorder: 'semantic.border.default',
  },
};

/**
 * Fullscreen content layout with safe area applied
 * Perfect for media viewing, immersive experiences, and splash screens
 */
export const SHELL_MOBILE_FULLSCREEN: MobileShellToken = {
  id: 'shell.mobile.fullscreen',
  description: 'Fullscreen content layout with safe area applied',
  platform: 'mobile',
  os: 'cross-platform',
  regions: [
    {
      name: 'main',
      position: 'center',
      size: 'atomic.spacing.full' as TokenReference,
      collapsible: false,
    },
  ],
  safeArea: {
    top: 'atomic.spacing.0' as TokenReference,
    bottom: 'atomic.spacing.0' as TokenReference,
    left: 'atomic.spacing.0' as TokenReference,
    right: 'atomic.spacing.0' as TokenReference,
    defaults: {
      notch: 44,
      dynamicIsland: 59,
      homeIndicator: 34,
      statusBar: 20,
    },
    edges: {
      top: true,
      bottom: true,
      horizontal: true,
    },
  },
  systemUI: {
    statusBar: {
      height: 'atomic.spacing.5' as TokenReference,
      visible: true,
      style: 'auto',
      translucent: true,
    },
    navigationBar: {
      height: 'atomic.spacing.12' as TokenReference,
      mode: 'overlay',
      buttonStyle: 'auto',
    },
  },
  keyboard: {
    avoidance: 'none',
    behavior: 'height',
    animation: {
      duration: 250,
      easing: 'keyboard',
      enabled: true,
    },
    dismissMode: 'on-drag',
  },
  touchTarget: {
    minSize: 'atomic.spacing.11' as TokenReference,
    hitSlop: {
      top: 8,
      bottom: 8,
      left: 8,
      right: 8,
    },
  },
  responsive: {
    default: {
      contentFit: 'cover',
    },
    md: {
      contentFit: 'contain',
    },
  },
  tokenBindings: {
    mainBackground: 'semantic.background.base',
  },
};

/**
 * Modal or bottom sheet layout with handle and content
 * Designed for dialogs, bottom sheets, and overlay content
 */
export const SHELL_MOBILE_MODAL: MobileShellToken = {
  id: 'shell.mobile.modal',
  description: 'Modal or bottom sheet layout with handle and content',
  platform: 'mobile',
  os: 'cross-platform',
  regions: [
    {
      name: 'handle',
      position: 'top',
      size: 'atomic.spacing.6' as TokenReference,
      collapsible: false,
    },
    {
      name: 'content',
      position: 'center',
      size: 'atomic.spacing.full' as TokenReference,
      collapsible: false,
    },
  ],
  safeArea: {
    top: 'atomic.spacing.0' as TokenReference,
    bottom: 'atomic.spacing.0' as TokenReference,
    left: 'atomic.spacing.0' as TokenReference,
    right: 'atomic.spacing.0' as TokenReference,
    defaults: {
      notch: 44,
      dynamicIsland: 59,
      homeIndicator: 34,
      statusBar: 20,
    },
    edges: {
      top: false,
      bottom: true,
      horizontal: false,
    },
  },
  systemUI: {
    statusBar: {
      height: 'atomic.spacing.5' as TokenReference,
      visible: true,
      style: 'auto',
      translucent: true,
    },
    navigationBar: {
      height: 'atomic.spacing.12' as TokenReference,
      mode: 'overlay',
      buttonStyle: 'auto',
    },
  },
  keyboard: {
    avoidance: 'padding',
    behavior: 'padding',
    animation: {
      duration: 250,
      easing: 'keyboard',
      enabled: true,
    },
    dismissMode: 'on-drag',
  },
  touchTarget: {
    minSize: 'atomic.spacing.11' as TokenReference,
    hitSlop: {
      top: 8,
      bottom: 8,
      left: 8,
      right: 8,
    },
  },
  responsive: {
    default: {
      maxHeight: '90%',
      borderRadius: 'atomic.spacing.4',
    },
    md: {
      maxHeight: '80%',
      borderRadius: 'atomic.spacing.4',
    },
  },
  tokenBindings: {
    handleBackground: 'semantic.background.surface',
    contentBackground: 'semantic.background.surface',
    overlayBackground: 'semantic.background.overlay',
  },
};

/**
 * Tab-based navigation with bottom tab bar
 * Optimized for tab-based navigation patterns with persistent tab bar
 */
export const SHELL_MOBILE_TAB: MobileShellToken = {
  id: 'shell.mobile.tab',
  description: 'Tab-based navigation with bottom tab bar',
  platform: 'mobile',
  os: 'cross-platform',
  regions: [
    {
      name: 'main',
      position: 'center',
      size: 'atomic.spacing.full' as TokenReference,
      collapsible: false,
    },
    {
      name: 'bottomTab',
      position: 'bottom',
      size: 'atomic.spacing.16' as TokenReference,
      collapsible: false,
    },
  ],
  safeArea: {
    top: 'atomic.spacing.0' as TokenReference,
    bottom: 'atomic.spacing.0' as TokenReference,
    left: 'atomic.spacing.0' as TokenReference,
    right: 'atomic.spacing.0' as TokenReference,
    defaults: {
      notch: 44,
      dynamicIsland: 59,
      homeIndicator: 34,
      statusBar: 20,
    },
    edges: {
      top: true,
      bottom: true,
      horizontal: true,
    },
  },
  systemUI: {
    statusBar: {
      height: 'atomic.spacing.5' as TokenReference,
      visible: true,
      style: 'auto',
      translucent: true,
    },
    navigationBar: {
      height: 'atomic.spacing.12' as TokenReference,
      mode: 'overlay',
      buttonStyle: 'auto',
    },
  },
  keyboard: {
    avoidance: 'resize',
    behavior: 'height',
    animation: {
      duration: 250,
      easing: 'keyboard',
      enabled: true,
    },
    dismissMode: 'on-drag',
  },
  bottomTab: {
    height: 'atomic.spacing.16' as TokenReference,
    safeAreaBottom: 'atomic.spacing.9' as TokenReference,
    totalHeight: 'atomic.spacing.25' as TokenReference,
    visibility: 'always',
    maxItems: 5,
    item: {
      minTouchTarget: 'atomic.spacing.11' as TokenReference,
      iconSize: 'atomic.spacing.6' as TokenReference,
      labelSize: 'atomic.spacing.3' as TokenReference,
      spacing: 'atomic.spacing.1' as TokenReference,
    },
  },
  touchTarget: {
    minSize: 'atomic.spacing.11' as TokenReference,
    hitSlop: {
      top: 8,
      bottom: 8,
      left: 8,
      right: 8,
    },
  },
  responsive: {
    default: {
      bottomTabVisible: true,
    },
    md: {
      bottomTabVisible: true,
    },
  },
  tokenBindings: {
    mainBackground: 'semantic.background.base',
    bottomTabBackground: 'semantic.background.surface',
    bottomTabBorder: 'semantic.border.default',
    tabActiveBackground: 'semantic.background.brand',
  },
};

/**
 * Drawer navigation with slide-out menu
 * Suitable for applications with hierarchical navigation and menu
 */
export const SHELL_MOBILE_DRAWER: MobileShellToken = {
  id: 'shell.mobile.drawer',
  description: 'Drawer navigation with slide-out menu',
  platform: 'mobile',
  os: 'cross-platform',
  regions: [
    {
      name: 'drawer',
      position: 'left',
      size: 'atomic.spacing.72' as TokenReference,
      collapsible: true,
      defaultCollapsed: true,
    },
    {
      name: 'main',
      position: 'center',
      size: 'atomic.spacing.full' as TokenReference,
      collapsible: false,
    },
  ],
  safeArea: {
    top: 'atomic.spacing.0' as TokenReference,
    bottom: 'atomic.spacing.0' as TokenReference,
    left: 'atomic.spacing.0' as TokenReference,
    right: 'atomic.spacing.0' as TokenReference,
    defaults: {
      notch: 44,
      dynamicIsland: 59,
      homeIndicator: 34,
      statusBar: 20,
    },
    edges: {
      top: true,
      bottom: true,
      horizontal: false,
    },
  },
  systemUI: {
    statusBar: {
      height: 'atomic.spacing.5' as TokenReference,
      visible: true,
      style: 'auto',
      translucent: true,
    },
    navigationBar: {
      height: 'atomic.spacing.12' as TokenReference,
      mode: 'overlay',
      buttonStyle: 'auto',
    },
  },
  keyboard: {
    avoidance: 'none',
    behavior: 'height',
    animation: {
      duration: 250,
      easing: 'keyboard',
      enabled: true,
    },
    dismissMode: 'on-drag',
  },
  touchTarget: {
    minSize: 'atomic.spacing.11' as TokenReference,
    hitSlop: {
      top: 8,
      bottom: 8,
      left: 8,
      right: 8,
    },
  },
  responsive: {
    default: {
      drawerWidth: 'atomic.spacing.72',
      drawerType: 'overlay',
    },
    md: {
      drawerWidth: 'atomic.spacing.80',
      drawerType: 'overlay',
    },
  },
  tokenBindings: {
    drawerBackground: 'semantic.background.surface',
    mainBackground: 'semantic.background.base',
    drawerBorder: 'semantic.border.default',
    overlayBackground: 'semantic.background.overlay',
  },
};

/**
 * Detail view layout with header and action bar
 * Designed for content detail pages with actions
 */
export const SHELL_MOBILE_DETAIL: MobileShellToken = {
  id: 'shell.mobile.detail',
  description: 'Detail view layout with header and action bar',
  platform: 'mobile',
  os: 'cross-platform',
  regions: [
    {
      name: 'header',
      position: 'top',
      size: 'atomic.spacing.14' as TokenReference,
      collapsible: true,
    },
    {
      name: 'main',
      position: 'center',
      size: 'atomic.spacing.full' as TokenReference,
      collapsible: false,
    },
    {
      name: 'actionBar',
      position: 'bottom',
      size: 'atomic.spacing.14' as TokenReference,
      collapsible: false,
    },
  ],
  safeArea: {
    top: 'atomic.spacing.0' as TokenReference,
    bottom: 'atomic.spacing.0' as TokenReference,
    left: 'atomic.spacing.0' as TokenReference,
    right: 'atomic.spacing.0' as TokenReference,
    defaults: {
      notch: 44,
      dynamicIsland: 59,
      homeIndicator: 34,
      statusBar: 20,
    },
    edges: {
      top: true,
      bottom: true,
      horizontal: true,
    },
  },
  systemUI: {
    statusBar: {
      height: 'atomic.spacing.5' as TokenReference,
      visible: true,
      style: 'auto',
      translucent: true,
    },
    navigationBar: {
      height: 'atomic.spacing.12' as TokenReference,
      mode: 'overlay',
      buttonStyle: 'auto',
    },
  },
  keyboard: {
    avoidance: 'padding',
    behavior: 'height',
    animation: {
      duration: 250,
      easing: 'keyboard',
      enabled: true,
    },
    dismissMode: 'on-drag',
  },
  touchTarget: {
    minSize: 'atomic.spacing.11' as TokenReference,
    hitSlop: {
      top: 8,
      bottom: 8,
      left: 8,
      right: 8,
    },
  },
  responsive: {
    default: {
      headerCollapsible: true,
      actionBarVisible: true,
    },
    md: {
      headerCollapsible: true,
      actionBarVisible: true,
    },
  },
  tokenBindings: {
    headerBackground: 'semantic.background.surface',
    mainBackground: 'semantic.background.base',
    actionBarBackground: 'semantic.background.surface',
    headerBorder: 'semantic.border.default',
    actionBarBorder: 'semantic.border.default',
  },
};

// ============================================================================
// Internal Token Map
// ============================================================================

/**
 * Internal map for quick mobile shell token lookups by ID
 * Used by getMobileShellToken() for O(1) access
 */
const MOBILE_SHELL_TOKENS_MAP: Record<string, MobileShellToken> = {
  'shell.mobile.app': SHELL_MOBILE_APP,
  'shell.mobile.fullscreen': SHELL_MOBILE_FULLSCREEN,
  'shell.mobile.modal': SHELL_MOBILE_MODAL,
  'shell.mobile.tab': SHELL_MOBILE_TAB,
  'shell.mobile.drawer': SHELL_MOBILE_DRAWER,
  'shell.mobile.detail': SHELL_MOBILE_DETAIL,
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get a mobile shell token by its ID
 *
 * @param shellId - Mobile shell token ID (e.g., "shell.mobile.app")
 * @returns MobileShellToken if found, undefined otherwise
 *
 * @example
 * ```typescript
 * const appShell = getMobileShellToken('shell.mobile.app');
 * if (appShell) {
 *   console.log(appShell.description);
 * }
 * ```
 */
export function getMobileShellToken(shellId: string): MobileShellToken | undefined {
  return MOBILE_SHELL_TOKENS_MAP[shellId];
}

/**
 * Get all available mobile shell tokens
 *
 * @returns Array of all MobileShellTokens
 *
 * @example
 * ```typescript
 * const allMobileShells = getAllMobileShellTokens();
 * console.log(`Available mobile shells: ${allMobileShells.length}`);
 * ```
 */
export function getAllMobileShellTokens(): MobileShellToken[] {
  return Object.values(MOBILE_SHELL_TOKENS_MAP);
}

/**
 * Get mobile shell tokens filtered by target OS
 *
 * @param os - Target operating system ('ios', 'android', or 'cross-platform')
 * @returns Array of MobileShellTokens for the specified OS
 *
 * @example
 * ```typescript
 * const iosShells = getMobileShellsByOS('ios');
 * const crossPlatformShells = getMobileShellsByOS('cross-platform');
 * console.log(`iOS shells: ${iosShells.length}`);
 * ```
 */
export function getMobileShellsByOS(os: 'ios' | 'android' | 'cross-platform'): MobileShellToken[] {
  return getAllMobileShellTokens().filter(
    shell => shell.os === os || shell.os === 'cross-platform'
  );
}
