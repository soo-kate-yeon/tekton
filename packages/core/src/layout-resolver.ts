/**
 * @tekton/core - Layout Resolver
 * Resolves layout IDs to complete layout configurations with CSS variables
 * [SPEC-LAYOUT-001] [PHASE-7]
 */

import type {
  ShellToken,
  PageLayoutToken,
  SectionPatternToken,
  ResponsiveConfig,
} from './layout-tokens/types.js';
import { getShellToken } from './layout-tokens/shells.js';
import { getPageLayoutToken } from './layout-tokens/pages.js';
import { getSectionPatternToken } from './layout-tokens/sections.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Resolved Layout - Complete layout configuration with CSS variables
 * Contains all information needed to render a layout
 */
export interface ResolvedLayout {
  /** Shell token (if layout is a shell) */
  shell?: ShellToken;

  /** Page layout token (if layout is a page) */
  page?: PageLayoutToken;

  /** Section pattern tokens array (if layout is a section or page with sections) */
  sections: SectionPatternToken[];

  /** Merged responsive configuration */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responsive: ResponsiveConfig<any>;

  /** CSS variables generated from token references */
  cssVariables: Record<string, string>;
}

/**
 * Layout type discriminator
 */
type LayoutType = 'shell' | 'page' | 'section';

// ============================================================================
// Cache
// ============================================================================

/**
 * Layout cache for performance optimization
 * Maps layout ID to resolved layout
 */
const layoutCache = new Map<string, ResolvedLayout>();

/**
 * Clear the layout cache
 * Useful for testing or when layout definitions change
 *
 * @example
 * ```typescript
 * clearLayoutCache();
 * ```
 */
export function clearLayoutCache(): void {
  layoutCache.clear();
}

// ============================================================================
// Core Resolver Functions
// ============================================================================

/**
 * Parse layout ID to determine its type
 *
 * @param layoutId - Layout ID to parse (e.g., "shell.web.dashboard", "page.dashboard", "section.grid-3")
 * @returns Layout type
 *
 * @example
 * ```typescript
 * parseLayoutType('shell.web.dashboard'); // 'shell'
 * parseLayoutType('page.dashboard'); // 'page'
 * parseLayoutType('section.grid-3'); // 'section'
 * ```
 */
function parseLayoutType(layoutId: string): LayoutType {
  if (layoutId.startsWith('shell.')) {
    return 'shell';
  } else if (layoutId.startsWith('page.')) {
    return 'page';
  } else if (layoutId.startsWith('section.')) {
    return 'section';
  }

  throw new Error(
    `Invalid layout ID format: ${layoutId}. Must start with 'shell.', 'page.', or 'section.'`
  );
}

/**
 * Resolve token reference to CSS variable name
 * Converts dot notation to CSS custom property format
 *
 * @param ref - Token reference (e.g., "atomic.spacing.16")
 * @returns CSS variable name (e.g., "--atomic-spacing-16")
 *
 * @example
 * ```typescript
 * resolveTokenReference('atomic.spacing.16'); // '--atomic-spacing-16'
 * resolveTokenReference('semantic.color.primary'); // '--semantic-color-primary'
 * ```
 */
export function resolveTokenReference(ref: string): string {
  // Convert dot notation to CSS variable format
  // "atomic.spacing.16" → "--atomic-spacing-16"
  return `--${ref.replace(/\./g, '-')}`;
}

/**
 * Extract all token references from an object recursively
 *
 * @param obj - Object to extract token references from
 * @returns Set of unique token references
 */
function extractTokenReferences(obj: unknown): Set<string> {
  const refs = new Set<string>();

  function traverse(value: unknown): void {
    if (typeof value === 'string' && /^[a-z]+\.[a-z-]+(\.[a-z0-9-]+)*$/.test(value)) {
      // This is a token reference
      refs.add(value);
    } else if (typeof value === 'object' && value !== null) {
      for (const prop of Object.values(value)) {
        traverse(prop);
      }
    }
  }

  traverse(obj);
  return refs;
}

/**
 * Generate CSS variables from token references
 *
 * @param refs - Set of token references
 * @returns Record mapping CSS variable names to token references
 *
 * @example
 * ```typescript
 * const refs = new Set(['atomic.spacing.16', 'semantic.color.primary']);
 * const cssVars = generateCSSVariables(refs);
 * // { '--atomic-spacing-16': 'atomic.spacing.16', '--semantic-color-primary': 'semantic.color.primary' }
 * ```
 */
function generateCSSVariables(refs: Set<string>): Record<string, string> {
  const cssVariables: Record<string, string> = {};

  for (const ref of refs) {
    const cssVarName = resolveTokenReference(ref);
    cssVariables[cssVarName] = ref;
  }

  return cssVariables;
}

/**
 * Merge responsive configurations (mobile-first)
 * Applies breakpoint overrides on top of base configuration
 *
 * @param base - Base responsive configuration
 * @param overrides - Optional overrides to apply
 * @returns Merged responsive configuration
 *
 * @example
 * ```typescript
 * const base = { default: { width: '100%' }, md: { width: '768px' } };
 * const overrides = { lg: { width: '1024px' } };
 * const merged = mergeResponsiveConfig(base, overrides);
 * // { default: { width: '100%' }, md: { width: '768px' }, lg: { width: '1024px' } }
 * ```
 */
export function mergeResponsiveConfig<T extends Record<string, unknown>>(
  base: ResponsiveConfig<T>,
  overrides?: Partial<ResponsiveConfig<T>>
): ResponsiveConfig<T> {
  if (!overrides) {
    return base;
  }

  return {
    default: { ...base.default, ...overrides.default } as T,
    sm: overrides.sm ? ({ ...base.sm, ...overrides.sm } as Partial<T>) : base.sm,
    md: overrides.md ? ({ ...base.md, ...overrides.md } as Partial<T>) : base.md,
    lg: overrides.lg ? ({ ...base.lg, ...overrides.lg } as Partial<T>) : base.lg,
    xl: overrides.xl ? ({ ...base.xl, ...overrides.xl } as Partial<T>) : base.xl,
    '2xl': overrides['2xl'] ? ({ ...base['2xl'], ...overrides['2xl'] } as Partial<T>) : base['2xl'],
  };
}

/**
 * Resolve shell layout
 *
 * @param layoutId - Shell layout ID
 * @returns Resolved layout
 */
function resolveShellLayout(layoutId: string): ResolvedLayout {
  const shell = getShellToken(layoutId);

  if (!shell) {
    throw new Error(`Shell token not found: ${layoutId}`);
  }

  // Extract all token references from shell
  const refs = extractTokenReferences(shell);

  // Generate CSS variables
  const cssVariables = generateCSSVariables(refs);

  return {
    shell,
    sections: [],
    responsive: shell.responsive,
    cssVariables,
  };
}

/**
 * Resolve page layout
 *
 * @param layoutId - Page layout ID
 * @returns Resolved layout
 */
function resolvePageLayout(layoutId: string): ResolvedLayout {
  const page = getPageLayoutToken(layoutId);

  if (!page) {
    throw new Error(`Page layout token not found: ${layoutId}`);
  }

  // Resolve all section patterns referenced by the page
  const sections: SectionPatternToken[] = [];
  for (const slot of page.sections) {
    const section = getSectionPatternToken(slot.pattern);
    if (!section) {
      throw new Error(`Section pattern not found: ${slot.pattern} (referenced by ${layoutId})`);
    }
    sections.push(section);
  }

  // Extract all token references from page and its sections
  const refs = extractTokenReferences({ page, sections });

  // Generate CSS variables
  const cssVariables = generateCSSVariables(refs);

  return {
    page,
    sections,
    responsive: page.responsive,
    cssVariables,
  };
}

/**
 * Resolve section layout
 *
 * @param layoutId - Section layout ID
 * @returns Resolved layout
 */
function resolveSectionLayout(layoutId: string): ResolvedLayout {
  const section = getSectionPatternToken(layoutId);

  if (!section) {
    throw new Error(`Section pattern token not found: ${layoutId}`);
  }

  // Extract all token references from section
  const refs = extractTokenReferences(section);

  // Generate CSS variables
  const cssVariables = generateCSSVariables(refs);

  return {
    sections: [section],
    responsive: section.responsive,
    cssVariables,
  };
}

/**
 * Resolve layout ID to complete layout configuration
 * Supports shell, page, and section layout IDs
 *
 * Performance: <5ms per call (cached after first call)
 *
 * @param layoutId - Layout ID to resolve (e.g., "shell.web.dashboard", "page.dashboard", "section.grid-3")
 * @returns Resolved layout with all tokens, responsive config, and CSS variables
 * @throws Error if layout ID is invalid or token not found
 *
 * @example
 * ```typescript
 * // Resolve shell layout
 * const shellLayout = resolveLayout('shell.web.dashboard');
 * console.log(shellLayout.shell?.description);
 * console.log(shellLayout.cssVariables);
 *
 * // Resolve page layout
 * const pageLayout = resolveLayout('page.dashboard');
 * console.log(pageLayout.page?.purpose);
 * console.log(pageLayout.sections.length);
 *
 * // Resolve section layout
 * const sectionLayout = resolveLayout('section.grid-3');
 * console.log(sectionLayout.sections[0].type);
 * ```
 */
export function resolveLayout(layoutId: string): ResolvedLayout {
  // Check cache first
  const cached = layoutCache.get(layoutId);
  if (cached) {
    return cached;
  }

  // Parse layout type
  const layoutType = parseLayoutType(layoutId);

  // Resolve based on type
  let resolved: ResolvedLayout;

  switch (layoutType) {
    case 'shell':
      resolved = resolveShellLayout(layoutId);
      break;
    case 'page':
      resolved = resolvePageLayout(layoutId);
      break;
    case 'section':
      resolved = resolveSectionLayout(layoutId);
      break;
    default:
      throw new Error(`Unknown layout type: ${layoutType}`);
  }

  // Cache the result
  layoutCache.set(layoutId, resolved);

  return resolved;
}
