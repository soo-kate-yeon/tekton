/**
 * @tekton/core - Screen Layout Resolver
 * Wrapper for layout resolution with screen-specific context
 * [SPEC-LAYOUT-002] [PHASE-2]
 */

import { resolveLayout as coreResolveLayout } from '../../layout-resolver.js';
import type { ResolvedLayout } from '../../layout-resolver.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Layout resolution context for screen generation
 * Provides additional context for error messages and debugging
 */
export interface LayoutContext {
  /** Screen ID requesting the layout */
  screenId: string;

  /** Layout type being resolved */
  layoutType: 'shell' | 'page' | 'section';

  /** Additional metadata for debugging */
  meta?: {
    /** Section ID (if resolving section pattern) */
    sectionId?: string;

    /** Section index in screen (if resolving section pattern) */
    sectionIndex?: number;
  };
}

// ============================================================================
// Core Resolution Functions
// ============================================================================

/**
 * Resolve shell layout with screen context
 *
 * Wraps core resolveLayout() with enhanced error messages
 * specific to screen generation context.
 *
 * @param shellId - Shell token ID (e.g., "shell.web.dashboard")
 * @param context - Screen resolution context
 * @returns Resolved shell layout
 * @throws Error with helpful message if shell not found
 *
 * @example
 * ```typescript
 * const context = {
 *   screenId: 'dashboard-screen',
 *   layoutType: 'shell'
 * };
 *
 * const shell = resolveShell('shell.web.dashboard', context);
 * console.log(shell.shell?.description);
 * ```
 */
export function resolveShell(shellId: string, context: LayoutContext): ResolvedLayout {
  try {
    return coreResolveLayout(shellId);
  } catch (error) {
    throw new Error(
      `Failed to resolve shell '${shellId}' for screen '${context.screenId}': ${
        error instanceof Error ? error.message : String(error)
      }\n\n` +
        `Available shells: shell.web.dashboard, shell.web.settings, shell.web.admin, ` +
        `shell.mobile.bottom-nav, shell.mobile.tabs`
    );
  }
}

/**
 * Resolve page layout with screen context
 *
 * Wraps core resolveLayout() with enhanced error messages
 * specific to screen generation context.
 *
 * @param pageId - Page layout token ID (e.g., "page.dashboard")
 * @param context - Screen resolution context
 * @returns Resolved page layout with sections
 * @throws Error with helpful message if page not found
 *
 * @example
 * ```typescript
 * const context = {
 *   screenId: 'dashboard-screen',
 *   layoutType: 'page'
 * };
 *
 * const page = resolvePage('page.dashboard', context);
 * console.log(page.page?.purpose);
 * console.log(page.sections.length);
 * ```
 */
export function resolvePage(pageId: string, context: LayoutContext): ResolvedLayout {
  try {
    return coreResolveLayout(pageId);
  } catch (error) {
    throw new Error(
      `Failed to resolve page '${pageId}' for screen '${context.screenId}': ${
        error instanceof Error ? error.message : String(error)
      }\n\n` +
        `Available pages: page.dashboard, page.detail, page.list, page.settings, page.form, ` +
        `page.auth, page.error, page.landing`
    );
  }
}

/**
 * Resolve section pattern with screen context
 *
 * Wraps core resolveLayout() with enhanced error messages
 * specific to screen generation context.
 *
 * @param sectionId - Section pattern token ID (e.g., "section.grid-4")
 * @param context - Screen resolution context with section metadata
 * @returns Resolved section pattern
 * @throws Error with helpful message if section not found
 *
 * @example
 * ```typescript
 * const context = {
 *   screenId: 'dashboard-screen',
 *   layoutType: 'section',
 *   meta: {
 *     sectionId: 'stats',
 *     sectionIndex: 0
 *   }
 * };
 *
 * const section = resolveSection('section.grid-4', context);
 * console.log(section.sections[0].type);
 * ```
 */
export function resolveSection(sectionId: string, context: LayoutContext): ResolvedLayout {
  try {
    return coreResolveLayout(sectionId);
  } catch (error) {
    const sectionInfo = context.meta?.sectionId
      ? ` (section '${context.meta.sectionId}' at index ${context.meta.sectionIndex})`
      : '';

    throw new Error(
      `Failed to resolve section '${sectionId}' for screen '${context.screenId}'${sectionInfo}: ${
        error instanceof Error ? error.message : String(error)
      }\n\n` +
        `Available sections: section.grid-2, section.grid-3, section.grid-4, section.grid-auto, ` +
        `section.split-30-70, section.split-50-50, section.split-70-30, ` +
        `section.stack-start, section.stack-center, section.stack-end, ` +
        `section.sidebar-left, section.sidebar-right, section.container`
    );
  }
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validate shell token ID format
 *
 * @param shellId - Shell token ID to validate
 * @returns True if valid shell token format
 *
 * @example
 * ```typescript
 * isValidShellToken('shell.web.dashboard'); // → true
 * isValidShellToken('page.dashboard'); // → false
 * isValidShellToken('invalid'); // → false
 * ```
 */
export function isValidShellToken(shellId: string): boolean {
  return shellId.startsWith('shell.') && shellId.split('.').length >= 3;
}

/**
 * Validate page layout token ID format
 *
 * @param pageId - Page layout token ID to validate
 * @returns True if valid page layout token format
 *
 * @example
 * ```typescript
 * isValidPageToken('page.dashboard'); // → true
 * isValidPageToken('shell.web.dashboard'); // → false
 * isValidPageToken('invalid'); // → false
 * ```
 */
export function isValidPageToken(pageId: string): boolean {
  return pageId.startsWith('page.') && pageId.split('.').length >= 2;
}

/**
 * Validate section pattern token ID format
 *
 * @param sectionId - Section pattern token ID to validate
 * @returns True if valid section pattern token format
 *
 * @example
 * ```typescript
 * isValidSectionToken('section.grid-4'); // → true
 * isValidSectionToken('page.dashboard'); // → false
 * isValidSectionToken('invalid'); // → false
 * ```
 */
export function isValidSectionToken(sectionId: string): boolean {
  return sectionId.startsWith('section.') && sectionId.split('.').length >= 2;
}

/**
 * Parse layout ID to determine its type
 *
 * @param layoutId - Layout ID to parse
 * @returns Layout type or undefined if invalid
 *
 * @example
 * ```typescript
 * parseLayoutType('shell.web.dashboard'); // → 'shell'
 * parseLayoutType('page.dashboard'); // → 'page'
 * parseLayoutType('section.grid-4'); // → 'section'
 * parseLayoutType('invalid'); // → undefined
 * ```
 */
export function parseLayoutType(layoutId: string): 'shell' | 'page' | 'section' | undefined {
  if (isValidShellToken(layoutId)) {
    return 'shell';
  } else if (isValidPageToken(layoutId)) {
    return 'page';
  } else if (isValidSectionToken(layoutId)) {
    return 'section';
  }
  return undefined;
}
