/**
 * @tekton/core - Section Pattern Token Definitions
 * Concrete Section Pattern Token implementations for layout primitives
 * [SPEC-LAYOUT-001] [PHASE-5]
 */

import type { SectionPatternToken, SectionType } from './types.js';
import type { TokenReference } from '../token-resolver.js';

// ============================================================================
// Grid Pattern Tokens (4 patterns)
// ============================================================================

/**
 * 2-column grid layout with responsive breakpoints
 * Suitable for comparison layouts, before/after views, or paired content
 */
export const SECTION_GRID_2: SectionPatternToken = {
  id: 'section.grid-2',
  type: 'grid',
  description: '2-column grid layout with responsive breakpoints',
  css: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'atomic.spacing.4' as TokenReference,
  },
  responsive: {
    default: {
      display: 'grid',
      gridTemplateColumns: 'repeat(1, 1fr)', // Mobile: 1 column
      gap: 'atomic.spacing.2' as TokenReference,
    },
    md: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)', // Tablet+: 2 columns
      gap: 'atomic.spacing.4' as TokenReference,
    },
    xl: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'atomic.spacing.5' as TokenReference,
    },
    '2xl': {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'atomic.spacing.6' as TokenReference,
    },
  },
  tokenBindings: {
    gap: 'atomic.spacing.4',
    itemBackground: 'semantic.background.surface',
  },
};

/**
 * 3-column grid layout with responsive breakpoints
 * Suitable for feature cards, product showcases, or team member displays
 */
export const SECTION_GRID_3: SectionPatternToken = {
  id: 'section.grid-3',
  type: 'grid',
  description: '3-column grid layout with responsive breakpoints',
  css: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'atomic.spacing.4' as TokenReference,
  },
  responsive: {
    default: {
      display: 'grid',
      gridTemplateColumns: 'repeat(1, 1fr)', // Mobile: 1 column
      gap: 'atomic.spacing.2' as TokenReference,
    },
    md: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)', // Tablet: 2 columns
      gap: 'atomic.spacing.3' as TokenReference,
    },
    lg: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)', // Desktop: 3 columns
      gap: 'atomic.spacing.4' as TokenReference,
    },
    xl: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'atomic.spacing.5' as TokenReference,
    },
    '2xl': {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 'atomic.spacing.6' as TokenReference,
    },
  },
  tokenBindings: {
    gap: 'atomic.spacing.4',
    itemBackground: 'semantic.background.surface',
  },
};

/**
 * 4-column grid layout with responsive breakpoints
 * Suitable for metrics, dashboards, or dense content displays
 */
export const SECTION_GRID_4: SectionPatternToken = {
  id: 'section.grid-4',
  type: 'grid',
  description: '4-column grid layout with responsive breakpoints',
  css: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 'atomic.spacing.4' as TokenReference,
  },
  responsive: {
    default: {
      display: 'grid',
      gridTemplateColumns: 'repeat(1, 1fr)', // Mobile: 1 column
      gap: 'atomic.spacing.2' as TokenReference,
    },
    md: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)', // Tablet: 2 columns
      gap: 'atomic.spacing.3' as TokenReference,
    },
    lg: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)', // Desktop: 4 columns
      gap: 'atomic.spacing.4' as TokenReference,
    },
    xl: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 'atomic.spacing.5' as TokenReference,
    },
    '2xl': {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: 'atomic.spacing.6' as TokenReference,
    },
  },
  tokenBindings: {
    gap: 'atomic.spacing.4',
    itemBackground: 'semantic.background.surface',
  },
};

/**
 * Auto-fill responsive grid layout
 * Automatically adjusts column count based on available space
 * Suitable for dynamic content grids and galleries
 */
export const SECTION_GRID_AUTO: SectionPatternToken = {
  id: 'section.grid-auto',
  type: 'grid',
  description: 'Auto-fill responsive grid with minimum column width',
  css: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: 'atomic.spacing.4' as TokenReference,
  },
  responsive: {
    default: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', // Mobile: smaller min
      gap: 'atomic.spacing.2' as TokenReference,
    },
    md: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', // Tablet+: standard min
      gap: 'atomic.spacing.4' as TokenReference,
    },
    xl: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: 'atomic.spacing.5' as TokenReference,
    },
    '2xl': {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: 'atomic.spacing.6' as TokenReference,
    },
  },
  tokenBindings: {
    gap: 'atomic.spacing.4',
    itemBackground: 'semantic.background.surface',
    minColumnWidth: 'atomic.spacing.64',
  },
};

// ============================================================================
// Split Pattern Tokens (3 patterns)
// ============================================================================

/**
 * 30/70 split layout using flexbox
 * First child takes 30% width, second child takes 70%
 * Suitable for sidebar-content layouts or list-detail views
 */
export const SECTION_SPLIT_30_70: SectionPatternToken = {
  id: 'section.split-30-70',
  type: 'flex',
  description: '30/70 split layout with sidebar and main content',
  css: {
    display: 'flex',
    flexDirection: 'row',
    gap: 'atomic.spacing.4' as TokenReference,
  },
  responsive: {
    default: {
      display: 'flex',
      flexDirection: 'column', // Mobile: stack vertically
      gap: 'atomic.spacing.2' as TokenReference,
    },
    md: {
      display: 'flex',
      flexDirection: 'row', // Tablet+: side by side with 30/70
      gap: 'atomic.spacing.4' as TokenReference,
    },
    xl: {
      display: 'flex',
      flexDirection: 'row',
      gap: 'atomic.spacing.5' as TokenReference,
    },
    '2xl': {
      display: 'flex',
      flexDirection: 'row',
      gap: 'atomic.spacing.6' as TokenReference,
    },
  },
  tokenBindings: {
    gap: 'atomic.spacing.4',
    leftBackground: 'semantic.background.surface',
    rightBackground: 'semantic.background.elevated',
    leftWidth: 'atomic.spacing.96', // ~30%
    rightWidth: 'atomic.spacing.full',
  },
};

/**
 * Equal 50/50 split layout using flexbox
 * Both children take equal width
 * Suitable for comparison views or balanced content layouts
 */
export const SECTION_SPLIT_50_50: SectionPatternToken = {
  id: 'section.split-50-50',
  type: 'flex',
  description: 'Equal 50/50 split layout using flexbox',
  css: {
    display: 'flex',
    flexDirection: 'row',
    gap: 'atomic.spacing.4' as TokenReference,
  },
  responsive: {
    default: {
      display: 'flex',
      flexDirection: 'column', // Mobile: stack vertically
      gap: 'atomic.spacing.2' as TokenReference,
    },
    md: {
      display: 'flex',
      flexDirection: 'row', // Tablet+: side by side
      gap: 'atomic.spacing.4' as TokenReference,
    },
    xl: {
      display: 'flex',
      flexDirection: 'row',
      gap: 'atomic.spacing.5' as TokenReference,
    },
    '2xl': {
      display: 'flex',
      flexDirection: 'row',
      gap: 'atomic.spacing.6' as TokenReference,
    },
  },
  tokenBindings: {
    gap: 'atomic.spacing.4',
    leftBackground: 'semantic.background.surface',
    rightBackground: 'semantic.background.elevated',
  },
};

/**
 * 70/30 split layout using flexbox
 * First child takes 70% width, second child takes 30%
 * Suitable for content-sidebar layouts or detail-metadata views
 */
export const SECTION_SPLIT_70_30: SectionPatternToken = {
  id: 'section.split-70-30',
  type: 'flex',
  description: '70/30 split layout with main content and sidebar',
  css: {
    display: 'flex',
    flexDirection: 'row',
    gap: 'atomic.spacing.4' as TokenReference,
  },
  responsive: {
    default: {
      display: 'flex',
      flexDirection: 'column', // Mobile: stack vertically
      gap: 'atomic.spacing.2' as TokenReference,
    },
    md: {
      display: 'flex',
      flexDirection: 'row', // Tablet+: side by side with 70/30
      gap: 'atomic.spacing.4' as TokenReference,
    },
    xl: {
      display: 'flex',
      flexDirection: 'row',
      gap: 'atomic.spacing.5' as TokenReference,
    },
    '2xl': {
      display: 'flex',
      flexDirection: 'row',
      gap: 'atomic.spacing.6' as TokenReference,
    },
  },
  tokenBindings: {
    gap: 'atomic.spacing.4',
    leftBackground: 'semantic.background.elevated',
    rightBackground: 'semantic.background.surface',
    leftWidth: 'atomic.spacing.full',
    rightWidth: 'atomic.spacing.96', // ~30%
  },
};

// ============================================================================
// Stack Pattern Tokens (3 patterns)
// ============================================================================

/**
 * Vertical stack layout with top alignment
 * Items are stacked vertically and aligned to the start (top)
 * Suitable for form layouts, content sections, or list views
 */
export const SECTION_STACK_START: SectionPatternToken = {
  id: 'section.stack-start',
  type: 'flex',
  description: 'Vertical stack with top alignment',
  css: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 'atomic.spacing.4' as TokenReference,
  },
  responsive: {
    default: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'atomic.spacing.2' as TokenReference,
    },
    md: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'atomic.spacing.4' as TokenReference,
    },
    xl: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'atomic.spacing.5' as TokenReference,
    },
    '2xl': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'atomic.spacing.6' as TokenReference,
    },
  },
  tokenBindings: {
    gap: 'atomic.spacing.4',
    itemBackground: 'semantic.background.surface',
  },
};

/**
 * Vertical stack layout with center alignment
 * Items are stacked vertically and centered horizontally
 * Suitable for centered content, hero sections, or empty states
 */
export const SECTION_STACK_CENTER: SectionPatternToken = {
  id: 'section.stack-center',
  type: 'flex',
  description: 'Vertical stack with center alignment',
  css: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'atomic.spacing.4' as TokenReference,
  },
  responsive: {
    default: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'atomic.spacing.2' as TokenReference,
    },
    md: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'atomic.spacing.4' as TokenReference,
    },
    xl: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'atomic.spacing.5' as TokenReference,
    },
    '2xl': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'atomic.spacing.6' as TokenReference,
    },
  },
  tokenBindings: {
    gap: 'atomic.spacing.4',
    itemBackground: 'semantic.background.surface',
  },
};

/**
 * Vertical stack layout with bottom alignment
 * Items are stacked vertically and aligned to the end (bottom)
 * Suitable for action buttons, footers, or bottom-aligned content
 */
export const SECTION_STACK_END: SectionPatternToken = {
  id: 'section.stack-end',
  type: 'flex',
  description: 'Vertical stack with bottom alignment',
  css: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 'atomic.spacing.4' as TokenReference,
  },
  responsive: {
    default: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 'atomic.spacing.2' as TokenReference,
    },
    md: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 'atomic.spacing.4' as TokenReference,
    },
    xl: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 'atomic.spacing.5' as TokenReference,
    },
    '2xl': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 'atomic.spacing.6' as TokenReference,
    },
  },
  tokenBindings: {
    gap: 'atomic.spacing.4',
    itemBackground: 'semantic.background.surface',
  },
};

// ============================================================================
// Sidebar Pattern Tokens (2 patterns)
// ============================================================================

/**
 * Fixed left sidebar layout
 * Sidebar has fixed width, main content fills remaining space
 * Suitable for navigation sidebars or filter panels
 */
export const SECTION_SIDEBAR_LEFT: SectionPatternToken = {
  id: 'section.sidebar-left',
  type: 'flex',
  description: 'Fixed left sidebar with flexible main content',
  css: {
    display: 'flex',
    flexDirection: 'row',
    gap: 'atomic.spacing.4' as TokenReference,
  },
  responsive: {
    default: {
      display: 'flex',
      flexDirection: 'column', // Mobile: stack vertically
      gap: 'atomic.spacing.2' as TokenReference,
    },
    md: {
      display: 'flex',
      flexDirection: 'row', // Tablet+: sidebar on left
      gap: 'atomic.spacing.4' as TokenReference,
    },
    xl: {
      display: 'flex',
      flexDirection: 'row',
      gap: 'atomic.spacing.5' as TokenReference,
    },
    '2xl': {
      display: 'flex',
      flexDirection: 'row',
      gap: 'atomic.spacing.6' as TokenReference,
    },
  },
  tokenBindings: {
    gap: 'atomic.spacing.4',
    sidebarBackground: 'semantic.background.surface',
    mainBackground: 'semantic.background.elevated',
    sidebarWidth: 'atomic.spacing.64', // Fixed sidebar width (256px)
  },
};

/**
 * Fixed right sidebar layout
 * Main content on left, sidebar has fixed width on right
 * Suitable for metadata panels or contextual help
 */
export const SECTION_SIDEBAR_RIGHT: SectionPatternToken = {
  id: 'section.sidebar-right',
  type: 'flex',
  description: 'Fixed right sidebar with flexible main content',
  css: {
    display: 'flex',
    flexDirection: 'row',
    gap: 'atomic.spacing.4' as TokenReference,
  },
  responsive: {
    default: {
      display: 'flex',
      flexDirection: 'column', // Mobile: stack vertically
      gap: 'atomic.spacing.2' as TokenReference,
    },
    md: {
      display: 'flex',
      flexDirection: 'row', // Tablet+: sidebar on right
      gap: 'atomic.spacing.4' as TokenReference,
    },
    xl: {
      display: 'flex',
      flexDirection: 'row',
      gap: 'atomic.spacing.5' as TokenReference,
    },
    '2xl': {
      display: 'flex',
      flexDirection: 'row',
      gap: 'atomic.spacing.6' as TokenReference,
    },
  },
  tokenBindings: {
    gap: 'atomic.spacing.4',
    mainBackground: 'semantic.background.elevated',
    sidebarBackground: 'semantic.background.surface',
    sidebarWidth: 'atomic.spacing.64', // Fixed sidebar width (256px)
  },
};

// ============================================================================
// Container Pattern Token (1 pattern)
// ============================================================================

/**
 * Centered max-width container
 * Content is centered horizontally with maximum width constraint
 * Suitable for article content, forms, or focused reading experiences
 */
export const SECTION_CONTAINER: SectionPatternToken = {
  id: 'section.container',
  type: 'flex',
  description: 'Centered max-width container with horizontal padding',
  css: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 'atomic.spacing.256' as TokenReference, // 1024px max width
    padding: 'atomic.spacing.4' as TokenReference,
  },
  responsive: {
    default: {
      display: 'flex',
      flexDirection: 'column',
      // Mobile: no maxWidth constraint (full width)
      padding: 'atomic.spacing.4' as TokenReference,
    },
    md: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 'atomic.spacing.192' as TokenReference, // Tablet: 768px
      padding: 'atomic.spacing.6' as TokenReference,
    },
    lg: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 'atomic.spacing.256' as TokenReference, // Desktop: 1024px
      padding: 'atomic.spacing.8' as TokenReference,
    },
    xl: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 'atomic.spacing.320' as TokenReference, // XL: 1280px
      padding: 'atomic.spacing.10' as TokenReference,
    },
    '2xl': {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 'atomic.spacing.384' as TokenReference, // 2XL: 1536px
      padding: 'atomic.spacing.12' as TokenReference,
    },
  },
  tokenBindings: {
    maxWidth: 'atomic.spacing.256',
    padding: 'atomic.spacing.4',
    background: 'semantic.background.surface',
  },
};

// ============================================================================
// Internal Token Map
// ============================================================================

/**
 * Internal map for quick section pattern token lookups by ID
 * Used by getSectionPatternToken() for O(1) access
 */
const SECTION_PATTERN_TOKENS_MAP: Record<string, SectionPatternToken> = {
  'section.grid-2': SECTION_GRID_2,
  'section.grid-3': SECTION_GRID_3,
  'section.grid-4': SECTION_GRID_4,
  'section.grid-auto': SECTION_GRID_AUTO,
  'section.split-30-70': SECTION_SPLIT_30_70,
  'section.split-50-50': SECTION_SPLIT_50_50,
  'section.split-70-30': SECTION_SPLIT_70_30,
  'section.stack-start': SECTION_STACK_START,
  'section.stack-center': SECTION_STACK_CENTER,
  'section.stack-end': SECTION_STACK_END,
  'section.sidebar-left': SECTION_SIDEBAR_LEFT,
  'section.sidebar-right': SECTION_SIDEBAR_RIGHT,
  'section.container': SECTION_CONTAINER,
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get a section pattern token by its ID
 *
 * @param patternId - Section pattern token ID (e.g., "section.grid-3")
 * @returns SectionPatternToken if found, undefined otherwise
 *
 * @example
 * ```typescript
 * const grid3 = getSectionPatternToken('section.grid-3');
 * if (grid3) {
 *   console.log(grid3.description);
 * }
 * ```
 */
export function getSectionPatternToken(patternId: string): SectionPatternToken | undefined {
  return SECTION_PATTERN_TOKENS_MAP[patternId];
}

/**
 * Get all available section pattern tokens
 *
 * @returns Array of all SectionPatternTokens
 *
 * @example
 * ```typescript
 * const allSections = getAllSectionPatternTokens();
 * console.log(`Available sections: ${allSections.length}`);
 * ```
 */
export function getAllSectionPatternTokens(): SectionPatternToken[] {
  return Object.values(SECTION_PATTERN_TOKENS_MAP);
}

/**
 * Get section pattern tokens filtered by type
 *
 * @param type - Section type ('grid', 'flex', 'split', 'stack', or 'container')
 * @returns Array of SectionPatternTokens with the specified type
 *
 * @example
 * ```typescript
 * const gridSections = getSectionsByType('grid');
 * console.log(`Grid sections: ${gridSections.length}`);
 * ```
 */
export function getSectionsByType(type: SectionType): SectionPatternToken[] {
  return getAllSectionPatternTokens().filter(section => section.type === type);
}

/**
 * Get section CSS configuration by pattern ID
 *
 * @param patternId - Section pattern token ID (e.g., "section.grid-4")
 * @returns SectionCSS if found, undefined otherwise
 *
 * @example
 * ```typescript
 * const css = getSectionCSS('section.grid-4');
 * if (css) {
 *   console.log(`Display: ${css.display}`);
 * }
 * ```
 */
export function getSectionCSS(patternId: string) {
  const pattern = getSectionPatternToken(patternId);
  return pattern?.css;
}
