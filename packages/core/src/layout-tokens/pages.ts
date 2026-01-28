/**
 * @tekton/core - Page Layout Token Definitions
 * Concrete Page Layout Token implementations for various screen purposes
 * [SPEC-LAYOUT-001] [PHASE-4]
 */

import type { PageLayoutToken, PagePurpose, SectionSlot } from './types.js';

// ============================================================================
// Page Layout Token Definitions
// ============================================================================

/**
 * Job/Task execution page layout
 * Suitable for form-based task execution with header, main form, and action buttons
 */
export const PAGE_JOB: PageLayoutToken = {
  id: 'page.job',
  description: 'Task execution page layout with header, main form, and action buttons',
  purpose: 'job',
  sections: [
    {
      name: 'header',
      pattern: 'section.stack-start',
      required: true,
      allowedComponents: ['Breadcrumb', 'Heading', 'Text'],
    },
    {
      name: 'form',
      pattern: 'section.stack-start',
      required: true,
      allowedComponents: ['Form', 'Input', 'Select', 'Textarea', 'Checkbox', 'Radio'],
    },
    {
      name: 'actions',
      pattern: 'section.stack-end',
      required: true,
      allowedComponents: ['Button', 'ButtonGroup'],
    },
  ],
  responsive: {
    default: {
      formWidth: '100%',
      contentPadding: 'atomic.spacing.4',
    },
    md: {
      formWidth: 'atomic.spacing.128',
      contentPadding: 'atomic.spacing.6',
    },
    lg: {
      formWidth: 'atomic.spacing.160',
      contentPadding: 'atomic.spacing.8',
    },
  },
  tokenBindings: {
    background: 'semantic.background.page',
    formBackground: 'semantic.background.surface',
    headerSpacing: 'atomic.spacing.6',
    formSpacing: 'atomic.spacing.4',
    actionSpacing: 'atomic.spacing.4',
  },
};

/**
 * Resource management page layout (CRUD operations)
 * Suitable for list-detail views with toolbar, list, and detail panel
 */
export const PAGE_RESOURCE: PageLayoutToken = {
  id: 'page.resource',
  description: 'CRUD operations page layout with toolbar, list, and detail panel',
  purpose: 'resource',
  sections: [
    {
      name: 'toolbar',
      pattern: 'section.stack-start',
      required: true,
      allowedComponents: ['Input', 'Button', 'Select', 'SearchField'],
    },
    {
      name: 'list',
      pattern: 'section.stack-start',
      required: true,
      allowedComponents: ['Table', 'List', 'Card', 'DataGrid'],
    },
    {
      name: 'detail',
      pattern: 'section.stack-start',
      required: false,
      allowedComponents: ['Card', 'Heading', 'Text', 'Button', 'Badge'],
    },
  ],
  responsive: {
    default: {
      layout: 'stacked',
      listColumns: 1,
    },
    md: {
      layout: 'stacked',
      listColumns: 1,
    },
    lg: {
      layout: 'split',
      listColumns: 1,
      detailWidth: '30%',
    },
  },
  tokenBindings: {
    background: 'semantic.background.page',
    toolbarBackground: 'semantic.background.surface',
    listBackground: 'semantic.background.surface',
    detailBackground: 'semantic.background.elevated',
    sectionSpacing: 'atomic.spacing.6',
  },
};

/**
 * Dashboard page layout for data overview
 * Suitable for metrics, charts, and data tables
 */
export const PAGE_DASHBOARD: PageLayoutToken = {
  id: 'page.dashboard',
  description: 'Dashboard page layout with metrics, charts, and data tables',
  purpose: 'dashboard',
  sections: [
    {
      name: 'metrics',
      pattern: 'section.grid-4',
      required: true,
      allowedComponents: ['Card', 'Stat', 'Metric'],
    },
    {
      name: 'charts',
      pattern: 'section.grid-2',
      required: false,
      allowedComponents: ['Chart', 'Graph', 'Card'],
    },
    {
      name: 'tables',
      pattern: 'section.container',
      required: false,
      allowedComponents: ['Table', 'DataGrid', 'List'],
    },
  ],
  responsive: {
    default: {
      metricsColumns: 1,
      chartsColumns: 1,
    },
    md: {
      metricsColumns: 2,
      chartsColumns: 1,
    },
    lg: {
      metricsColumns: 4,
      chartsColumns: 2,
    },
  },
  tokenBindings: {
    background: 'semantic.background.page',
    cardBackground: 'semantic.background.surface',
    sectionSpacing: 'atomic.spacing.6',
    contentMaxWidth: 'atomic.spacing.320',
  },
};

/**
 * Settings page layout for configuration
 * Suitable for grouped form sections with sidebar navigation
 */
export const PAGE_SETTINGS: PageLayoutToken = {
  id: 'page.settings',
  description: 'Configuration page layout with grouped form sections',
  purpose: 'settings',
  sections: [
    {
      name: 'sidebar',
      pattern: 'section.sidebar-left',
      required: false,
      allowedComponents: ['Navigation', 'List', 'Link'],
    },
    {
      name: 'content',
      pattern: 'section.stack-start',
      required: true,
      allowedComponents: ['Form', 'Input', 'Select', 'Switch', 'Checkbox', 'Heading', 'Text'],
    },
    {
      name: 'actions',
      pattern: 'section.stack-end',
      required: true,
      allowedComponents: ['Button', 'ButtonGroup'],
    },
  ],
  responsive: {
    default: {
      layout: 'stacked',
      sidebarVisible: false,
    },
    md: {
      layout: 'sidebar',
      sidebarVisible: true,
      sidebarWidth: 'atomic.spacing.64',
    },
    lg: {
      layout: 'sidebar',
      sidebarVisible: true,
      sidebarWidth: 'atomic.spacing.80',
    },
  },
  tokenBindings: {
    background: 'semantic.background.page',
    sidebarBackground: 'semantic.background.elevated',
    contentBackground: 'semantic.background.surface',
    sectionSpacing: 'atomic.spacing.6',
  },
};

/**
 * Detail page layout for item focus
 * Suitable for single item view with hero section, content, and related items
 */
export const PAGE_DETAIL: PageLayoutToken = {
  id: 'page.detail',
  description: 'Item focus page layout with hero, content, and related items',
  purpose: 'detail',
  sections: [
    {
      name: 'hero',
      pattern: 'section.stack-center',
      required: true,
      allowedComponents: ['Image', 'Heading', 'Text', 'Badge', 'Button'],
    },
    {
      name: 'content',
      pattern: 'section.container',
      required: true,
      allowedComponents: ['Text', 'Heading', 'Image', 'Video', 'Card'],
    },
    {
      name: 'related',
      pattern: 'section.grid-3',
      required: false,
      allowedComponents: ['Card', 'Image', 'Heading', 'Text'],
    },
  ],
  responsive: {
    default: {
      heroHeight: 'auto',
      contentMaxWidth: '100%',
      relatedColumns: 1,
    },
    md: {
      heroHeight: 'auto',
      contentMaxWidth: 'atomic.spacing.192',
      relatedColumns: 2,
    },
    lg: {
      heroHeight: 'auto',
      contentMaxWidth: 'atomic.spacing.224',
      relatedColumns: 3,
    },
  },
  tokenBindings: {
    background: 'semantic.background.page',
    heroBackground: 'semantic.background.elevated',
    contentBackground: 'semantic.background.surface',
    sectionSpacing: 'atomic.spacing.8',
  },
};

/**
 * Empty state page layout
 * Suitable for empty states with illustration and call-to-action
 */
export const PAGE_EMPTY: PageLayoutToken = {
  id: 'page.empty',
  description: 'Empty state page layout with illustration and call-to-action',
  purpose: 'empty',
  sections: [
    {
      name: 'illustration',
      pattern: 'section.stack-center',
      required: true,
      allowedComponents: ['Image', 'Icon', 'Illustration'],
    },
    {
      name: 'message',
      pattern: 'section.stack-center',
      required: true,
      allowedComponents: ['Heading', 'Text'],
    },
    {
      name: 'cta',
      pattern: 'section.stack-center',
      required: true,
      allowedComponents: ['Button', 'Link'],
    },
  ],
  responsive: {
    default: {
      illustrationSize: 'atomic.spacing.48',
      contentPadding: 'atomic.spacing.4',
    },
    md: {
      illustrationSize: 'atomic.spacing.64',
      contentPadding: 'atomic.spacing.6',
    },
    lg: {
      illustrationSize: 'atomic.spacing.80',
      contentPadding: 'atomic.spacing.8',
    },
  },
  tokenBindings: {
    background: 'semantic.background.page',
    illustrationColor: 'semantic.foreground.muted',
    messageColor: 'semantic.foreground.secondary',
    sectionSpacing: 'atomic.spacing.6',
  },
};

/**
 * Wizard page layout for multi-step flows
 * Suitable for multi-step processes with progress indicator, step content, and navigation
 */
export const PAGE_WIZARD: PageLayoutToken = {
  id: 'page.wizard',
  description: 'Multi-step flow page layout with progress, step content, and navigation',
  purpose: 'wizard',
  sections: [
    {
      name: 'progress',
      pattern: 'section.stack-start',
      required: true,
      allowedComponents: ['Stepper', 'Progress', 'Breadcrumb'],
    },
    {
      name: 'step',
      pattern: 'section.stack-start',
      required: true,
      allowedComponents: [
        'Form',
        'Input',
        'Select',
        'Textarea',
        'Checkbox',
        'Radio',
        'Heading',
        'Text',
      ],
    },
    {
      name: 'navigation',
      pattern: 'section.stack-end',
      required: true,
      allowedComponents: ['Button', 'ButtonGroup'],
    },
  ],
  responsive: {
    default: {
      progressStyle: 'compact',
      stepMaxWidth: '100%',
      contentPadding: 'atomic.spacing.4',
    },
    md: {
      progressStyle: 'expanded',
      stepMaxWidth: 'atomic.spacing.160',
      contentPadding: 'atomic.spacing.6',
    },
    lg: {
      progressStyle: 'expanded',
      stepMaxWidth: 'atomic.spacing.192',
      contentPadding: 'atomic.spacing.8',
    },
  },
  tokenBindings: {
    background: 'semantic.background.page',
    progressBackground: 'semantic.background.surface',
    stepBackground: 'semantic.background.surface',
    navigationBackground: 'semantic.background.surface',
    sectionSpacing: 'atomic.spacing.6',
  },
};

/**
 * Onboarding page layout for first-run experience
 * Suitable for user onboarding with welcome, steps, and completion sections
 */
export const PAGE_ONBOARDING: PageLayoutToken = {
  id: 'page.onboarding',
  description: 'First-run experience page layout with welcome, steps, and completion',
  purpose: 'onboarding',
  sections: [
    {
      name: 'welcome',
      pattern: 'section.stack-center',
      required: true,
      allowedComponents: ['Image', 'Heading', 'Text', 'Button'],
    },
    {
      name: 'steps',
      pattern: 'section.stack-center',
      required: true,
      allowedComponents: ['Card', 'Stepper', 'Form', 'Input', 'Heading', 'Text'],
    },
    {
      name: 'completion',
      pattern: 'section.stack-center',
      required: false,
      allowedComponents: ['Image', 'Heading', 'Text', 'Button'],
    },
  ],
  responsive: {
    default: {
      cardMaxWidth: '100%',
      contentPadding: 'atomic.spacing.4',
    },
    md: {
      cardMaxWidth: 'atomic.spacing.128',
      contentPadding: 'atomic.spacing.6',
    },
    lg: {
      cardMaxWidth: 'atomic.spacing.160',
      contentPadding: 'atomic.spacing.8',
    },
  },
  tokenBindings: {
    background: 'semantic.background.brand',
    cardBackground: 'semantic.background.surface',
    welcomeColor: 'semantic.foreground.primary',
    sectionSpacing: 'atomic.spacing.8',
  },
};

// ============================================================================
// Internal Token Map
// ============================================================================

/**
 * Internal map for quick page layout token lookups by ID
 * Used by getPageLayoutToken() for O(1) access
 */
const PAGE_LAYOUT_TOKENS_MAP: Record<string, PageLayoutToken> = {
  'page.job': PAGE_JOB,
  'page.resource': PAGE_RESOURCE,
  'page.dashboard': PAGE_DASHBOARD,
  'page.settings': PAGE_SETTINGS,
  'page.detail': PAGE_DETAIL,
  'page.empty': PAGE_EMPTY,
  'page.wizard': PAGE_WIZARD,
  'page.onboarding': PAGE_ONBOARDING,
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get a page layout token by its ID
 *
 * @param pageId - Page layout token ID (e.g., "page.dashboard")
 * @returns PageLayoutToken if found, undefined otherwise
 *
 * @example
 * ```typescript
 * const dashboard = getPageLayoutToken('page.dashboard');
 * if (dashboard) {
 *   console.log(dashboard.description);
 * }
 * ```
 */
export function getPageLayoutToken(pageId: string): PageLayoutToken | undefined {
  return PAGE_LAYOUT_TOKENS_MAP[pageId];
}

/**
 * Get all available page layout tokens
 *
 * @returns Array of all PageLayoutTokens
 *
 * @example
 * ```typescript
 * const allPages = getAllPageLayoutTokens();
 * console.log(`Available pages: ${allPages.length}`);
 * ```
 */
export function getAllPageLayoutTokens(): PageLayoutToken[] {
  return Object.values(PAGE_LAYOUT_TOKENS_MAP);
}

/**
 * Get page layout tokens filtered by purpose
 *
 * @param purpose - Page purpose type
 * @returns Array of PageLayoutTokens with the specified purpose
 *
 * @example
 * ```typescript
 * const dashboards = getPagesByPurpose('dashboard');
 * console.log(`Dashboard pages: ${dashboards.length}`);
 * ```
 */
export function getPagesByPurpose(purpose: PagePurpose): PageLayoutToken[] {
  return getAllPageLayoutTokens().filter(page => page.purpose === purpose);
}

/**
 * Get section slots for a specific page layout
 *
 * @param pageId - Page layout token ID (e.g., "page.dashboard")
 * @returns Array of SectionSlots for the page, or empty array if not found
 *
 * @example
 * ```typescript
 * const sections = getPageSections('page.dashboard');
 * console.log(`Dashboard sections: ${sections.length}`);
 * ```
 */
export function getPageSections(pageId: string): SectionSlot[] {
  const page = getPageLayoutToken(pageId);
  return page ? page.sections : [];
}
