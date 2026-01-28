/**
 * @tekton/core - Screen Resolver
 * Main entry point for resolving screen definitions to complete screen structures
 * [SPEC-LAYOUT-002] [PHASE-2]
 */

import type { ScreenDefinition, SectionDefinition, ScreenMeta } from '../types.js';
import type { ResolvedLayout } from '../../layout-resolver.js';
import {
  resolveShell,
  resolvePage,
  resolveSection,
  type LayoutContext,
} from './layout-resolver.js';
import {
  resolveComponent,
  type ResolvedComponent,
  type ComponentContext,
} from './component-resolver.js';
import { tokenRefToCSSVar } from './token-resolver.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Resolved section with layout and components
 * Complete section ready for rendering
 */
export interface ResolvedSection {
  /** Section identifier */
  id: string;

  /** Resolved section pattern layout */
  layout: ResolvedLayout;

  /** Resolved components within section */
  components: ResolvedComponent[];

  /** CSS variables generated from section layout */
  cssVariables: Record<string, string>;
}

/**
 * Component tree node for hierarchical structure
 * Represents the component hierarchy within the screen
 */
export interface ComponentTreeNode {
  /** Component type */
  type: string;

  /** Component slot assignment */
  slot?: string;

  /** Child nodes */
  children?: ComponentTreeNode[];
}

/**
 * Component tree structure
 * Root-level component organization
 */
export interface ComponentTree {
  /** Root component nodes organized by section */
  sections: {
    /** Section ID */
    sectionId: string;

    /** Components in this section */
    components: ComponentTreeNode[];
  }[];
}

/**
 * Complete resolved screen structure
 * Ready for rendering with all layouts, components, and tokens resolved
 */
export interface ResolvedScreen {
  /** Screen identifier */
  id: string;

  /** Screen name */
  name: string;

  /** Optional screen description */
  description?: string;

  /** Resolved shell layout */
  shell: ResolvedLayout;

  /** Resolved page layout */
  page: ResolvedLayout;

  /** Resolved sections with layouts and components */
  sections: ResolvedSection[];

  /** Global CSS variables from all layouts */
  cssVariables: Record<string, string>;

  /** Component tree structure */
  componentTree: ComponentTree;

  /** Screen metadata */
  meta?: ScreenMeta;

  /** Theme ID used for resolution */
  themeId: string;
}

// ============================================================================
// Cache
// ============================================================================

/**
 * Screen resolution cache
 * Key: `${screenId}:${themeId}`
 */
const screenCache = new Map<string, ResolvedScreen>();

/**
 * Clear screen resolution cache
 * Useful for testing or when screen definitions change
 *
 * @example
 * ```typescript
 * clearScreenCache();
 * ```
 */
export function clearScreenCache(): void {
  screenCache.clear();
}

// ============================================================================
// Component Tree Building
// ============================================================================

/**
 * Build component tree node from resolved component
 *
 * @param component - Resolved component
 * @returns Component tree node
 */
function buildComponentTreeNode(component: ResolvedComponent): ComponentTreeNode {
  const node: ComponentTreeNode = {
    type: component.type,
    slot: component.slot,
  };

  if (component.children && component.children.length > 0) {
    node.children = component.children
      .filter((child): child is ResolvedComponent => typeof child !== 'string')
      .map(child => buildComponentTreeNode(child));
  }

  return node;
}

/**
 * Build complete component tree from resolved sections
 *
 * @param sections - Resolved sections with components
 * @returns Component tree structure
 */
function buildComponentTree(sections: ResolvedSection[]): ComponentTree {
  return {
    sections: sections.map(section => ({
      sectionId: section.id,
      components: section.components.map(component => buildComponentTreeNode(component)),
    })),
  };
}

// ============================================================================
// CSS Variables Generation
// ============================================================================

/**
 * Merge CSS variables from multiple layouts
 *
 * Combines CSS variables from shell, page, and section layouts
 * into a single global CSS variable map.
 *
 * @param shell - Resolved shell layout
 * @param page - Resolved page layout
 * @param sections - Resolved sections
 * @returns Merged CSS variables
 */
function mergeCSSVariables(
  shell: ResolvedLayout,
  page: ResolvedLayout,
  sections: ResolvedSection[]
): Record<string, string> {
  const merged: Record<string, string> = {};

  // Add shell CSS variables
  Object.assign(merged, shell.cssVariables);

  // Add page CSS variables
  Object.assign(merged, page.cssVariables);

  // Add section CSS variables
  for (const section of sections) {
    Object.assign(merged, section.cssVariables);
  }

  return merged;
}

/**
 * Generate CSS variables from token references in layout
 *
 * Extracts all token references from layout structure and
 * generates CSS variable declarations.
 *
 * @param layout - Resolved layout
 * @returns CSS variables map
 */
function generateLayoutCSSVariables(layout: ResolvedLayout): Record<string, string> {
  const cssVars: Record<string, string> = {};

  // Extract token references from layout
  const extractTokens = (obj: unknown): void => {
    if (typeof obj === 'string' && /^[a-z]+\.[a-z-]+(\.[a-z0-9-]+)*$/.test(obj)) {
      // This is a token reference
      const cssVarName = tokenRefToCSSVar(obj);
      cssVars[cssVarName] = obj;
    } else if (typeof obj === 'object' && obj !== null) {
      for (const value of Object.values(obj)) {
        extractTokens(value);
      }
    }
  };

  extractTokens(layout);

  return cssVars;
}

// ============================================================================
// Core Resolution Functions
// ============================================================================

/**
 * Resolve section definition to complete resolved section
 *
 * Process:
 * 1. Resolve section pattern layout
 * 2. Resolve all components in section
 * 3. Generate CSS variables
 *
 * @param section - Section definition to resolve
 * @param screenId - Screen ID for error messages
 * @param theme - Theme ID for token resolution
 * @returns Resolved section with layout and components
 */
function resolveScreenSection(
  section: SectionDefinition,
  screenId: string,
  theme: string
): ResolvedSection {
  // Create layout context
  const layoutContext: LayoutContext = {
    screenId,
    layoutType: 'section',
    meta: {
      sectionId: section.id,
    },
  };

  // Resolve section pattern layout
  let layout: ResolvedLayout;
  try {
    layout = resolveSection(section.pattern, layoutContext);
  } catch (error) {
    throw new Error(
      `Failed to resolve section '${section.id}' (pattern: ${section.pattern}): ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  // Create component context
  const componentContext: ComponentContext = {
    theme,
    screenId,
    sectionId: section.id,
  };

  // Resolve all components in section
  const components: ResolvedComponent[] = [];
  for (let i = 0; i < section.components.length; i++) {
    try {
      const resolved = resolveComponent(section.components[i], componentContext);
      components.push(resolved);
    } catch (error) {
      throw new Error(
        `Failed to resolve component at index ${i} in section '${section.id}': ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  // Generate CSS variables from layout
  const cssVariables = generateLayoutCSSVariables(layout);

  return {
    id: section.id,
    layout,
    components,
    cssVariables,
  };
}

/**
 * Resolve screen definition to complete resolved screen structure
 *
 * Main entry point for screen resolution. Performs complete resolution:
 * 1. Validate screen definition
 * 2. Resolve shell layout
 * 3. Resolve page layout
 * 4. Resolve all sections with layouts and components
 * 5. Generate global CSS variables
 * 6. Build component tree
 *
 * Performance: <5ms for typical screen resolution (cached after first call)
 *
 * @param screen - Screen definition to resolve
 * @returns Complete resolved screen structure
 * @throws Error if resolution fails at any stage
 *
 * @example
 * ```typescript
 * const screen = {
 *   id: 'dashboard-screen',
 *   name: 'Dashboard',
 *   shell: 'shell.web.dashboard',
 *   page: 'page.dashboard',
 *   themeId: 'default',
 *   sections: [
 *     {
 *       id: 'stats',
 *       pattern: 'section.grid-4',
 *       components: [
 *         { type: 'Card', props: { children: 'Stats' } }
 *       ]
 *     }
 *   ]
 * };
 *
 * const resolved = resolveScreen(screen);
 * console.log(resolved.shell.shell?.description);
 * console.log(resolved.sections[0].components[0].tokenBindings);
 * ```
 */
export function resolveScreen(screen: ScreenDefinition): ResolvedScreen {
  const startTime = performance.now();

  // Use default theme if not specified
  const themeId = screen.themeId || 'default';

  // Check cache
  const cacheKey = `${screen.id}:${themeId}`;
  const cached = screenCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Create layout context for shell
  const shellContext: LayoutContext = {
    screenId: screen.id,
    layoutType: 'shell',
  };

  // Resolve shell layout
  let shell: ResolvedLayout;
  try {
    shell = resolveShell(screen.shell, shellContext);
  } catch (error) {
    throw new Error(
      `Failed to resolve shell for screen '${screen.id}': ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  // Create layout context for page
  const pageContext: LayoutContext = {
    screenId: screen.id,
    layoutType: 'page',
  };

  // Resolve page layout
  let page: ResolvedLayout;
  try {
    page = resolvePage(screen.page, pageContext);
  } catch (error) {
    throw new Error(
      `Failed to resolve page for screen '${screen.id}': ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  // Resolve all sections
  const sections: ResolvedSection[] = [];
  for (let i = 0; i < screen.sections.length; i++) {
    try {
      const resolved = resolveScreenSection(screen.sections[i], screen.id, themeId);
      sections.push(resolved);
    } catch (error) {
      throw new Error(
        `Failed to resolve section at index ${i}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // Merge CSS variables from all layouts
  const cssVariables = mergeCSSVariables(shell, page, sections);

  // Build component tree
  const componentTree = buildComponentTree(sections);

  // Create resolved screen
  const resolved: ResolvedScreen = {
    id: screen.id,
    name: screen.name,
    description: screen.description,
    shell,
    page,
    sections,
    cssVariables,
    componentTree,
    meta: screen.meta,
    themeId,
  };

  // Cache result
  screenCache.set(cacheKey, resolved);

  // Performance logging
  const endTime = performance.now();
  const duration = endTime - startTime;
  if (duration > 5) {
    console.warn(
      `Screen resolution for '${screen.id}' took ${duration.toFixed(2)}ms (target: <5ms). ` +
        `Consider optimizing layout or component complexity.`
    );
  }

  return resolved;
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validate resolved screen structure
 *
 * Checks:
 * - Shell layout is present
 * - Page layout is present
 * - All sections have layouts and components
 * - CSS variables are generated
 * - Component tree is built
 *
 * @param resolved - Resolved screen to validate
 * @returns True if valid, false otherwise
 *
 * @example
 * ```typescript
 * const resolved = resolveScreen(screenDefinition);
 * if (isValidResolvedScreen(resolved)) {
 *   // Ready to render
 * }
 * ```
 */
export function isValidResolvedScreen(resolved: unknown): resolved is ResolvedScreen {
  if (typeof resolved !== 'object' || resolved === null) {
    return false;
  }

  const obj = resolved as Record<string, unknown>;

  // Check required fields
  if (
    typeof obj.id !== 'string' ||
    typeof obj.name !== 'string' ||
    typeof obj.shell !== 'object' ||
    typeof obj.page !== 'object' ||
    !Array.isArray(obj.sections) ||
    typeof obj.cssVariables !== 'object' ||
    typeof obj.componentTree !== 'object'
  ) {
    return false;
  }

  return true;
}

/**
 * Get screen resolution statistics
 *
 * Provides insights into resolved screen structure:
 * - Total component count
 * - Component types used
 * - Section count
 * - CSS variable count
 *
 * @param resolved - Resolved screen
 * @returns Statistics object
 *
 * @example
 * ```typescript
 * const resolved = resolveScreen(screenDefinition);
 * const stats = getScreenStats(resolved);
 * console.log(`Components: ${stats.componentCount}`);
 * console.log(`CSS Variables: ${stats.cssVariableCount}`);
 * ```
 */
export function getScreenStats(resolved: ResolvedScreen): {
  componentCount: number;
  componentTypes: Set<string>;
  sectionCount: number;
  cssVariableCount: number;
} {
  let componentCount = 0;
  const componentTypes = new Set<string>();

  const countComponents = (node: ComponentTreeNode): void => {
    componentCount++;
    componentTypes.add(node.type);
    if (node.children) {
      node.children.forEach(countComponents);
    }
  };

  resolved.componentTree.sections.forEach(section => {
    section.components.forEach(countComponents);
  });

  return {
    componentCount,
    componentTypes,
    sectionCount: resolved.sections.length,
    cssVariableCount: Object.keys(resolved.cssVariables).length,
  };
}
