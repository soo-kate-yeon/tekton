import { z } from 'zod';

/**
 * Screen intent enum representing the primary purpose of the screen.
 *
 * @remarks
 * Each intent type maps to specific compound patterns, component suggestions,
 * and recommended actions optimized for the screen's use case.
 */
export const ScreenIntent = {
  DataList: 'data-list',
  DataDetail: 'data-detail',
  Dashboard: 'dashboard',
  Form: 'form',
  Wizard: 'wizard',
  Auth: 'auth',
  Settings: 'settings',
  EmptyState: 'empty-state',
  Error: 'error',
  Custom: 'custom',
} as const;

export type ScreenIntent = (typeof ScreenIntent)[keyof typeof ScreenIntent];

/**
 * Compound pattern mapping for a screen intent.
 *
 * @property primaryComponents - Recommended primary components for this intent
 * @property layoutPatterns - Suggested layout patterns
 * @property actions - Common actions for this intent
 */
export interface CompoundPatternMapping {
  primaryComponents: string[];
  layoutPatterns: string[];
  actions: string[];
}

/**
 * Intent to compound pattern mappings.
 *
 * @remarks
 * Maps each screen intent to recommended component combinations,
 * layout patterns, and user actions.
 */
export const INTENT_TO_COMPOUND_PATTERNS: Record<ScreenIntent, CompoundPatternMapping> = {
  [ScreenIntent.DataList]: {
    primaryComponents: ['Table', 'Card', 'Pagination', 'SearchBar'],
    layoutPatterns: ['list-grid', 'responsive-table', 'masonry'],
    actions: ['search', 'filter', 'sort', 'export', 'create'],
  },
  [ScreenIntent.DataDetail]: {
    primaryComponents: ['Card', 'Tabs', 'Badge', 'Avatar'],
    layoutPatterns: ['detail-view', 'split-pane', 'tabbed-content'],
    actions: ['edit', 'delete', 'share', 'print'],
  },
  [ScreenIntent.Dashboard]: {
    primaryComponents: ['Card', 'Chart', 'Stat', 'Table'],
    layoutPatterns: ['dashboard-grid', 'widget-layout', 'responsive-cards'],
    actions: ['refresh', 'customize', 'export', 'filter-date'],
  },
  [ScreenIntent.Form]: {
    primaryComponents: ['Input', 'Button', 'Select', 'Checkbox', 'TextArea'],
    layoutPatterns: ['form-layout', 'two-column', 'stepped-form'],
    actions: ['submit', 'cancel', 'validate', 'save-draft', 'reset'],
  },
  [ScreenIntent.Wizard]: {
    primaryComponents: ['Stepper', 'Form', 'Button', 'ProgressBar'],
    layoutPatterns: ['wizard-flow', 'stepped-layout', 'linear-progression'],
    actions: ['next', 'previous', 'submit', 'save-progress', 'cancel'],
  },
  [ScreenIntent.Auth]: {
    primaryComponents: ['Form', 'Input', 'Button', 'Link'],
    layoutPatterns: ['centered-form', 'split-screen', 'branded-auth'],
    actions: ['login', 'signup', 'forgot-password', 'social-login'],
  },
  [ScreenIntent.Settings]: {
    primaryComponents: ['Form', 'Tabs', 'Switch', 'Select'],
    layoutPatterns: ['settings-panel', 'sidebar-settings', 'tabbed-settings'],
    actions: ['save', 'reset', 'export-data', 'delete-account'],
  },
  [ScreenIntent.EmptyState]: {
    primaryComponents: ['EmptyState', 'Button', 'Icon', 'Image'],
    layoutPatterns: ['centered-message', 'illustrated-empty', 'action-prompt'],
    actions: ['create', 'import', 'learn-more'],
  },
  [ScreenIntent.Error]: {
    primaryComponents: ['Alert', 'Button', 'Icon', 'Code'],
    layoutPatterns: ['error-display', 'centered-error', 'detailed-error'],
    actions: ['retry', 'back', 'report', 'home'],
  },
  [ScreenIntent.Custom]: {
    primaryComponents: ['Container', 'Card', 'Button'],
    layoutPatterns: ['custom-layout', 'flexible-grid'],
    actions: ['custom-action'],
  },
};

/**
 * Intent contract defining the screen's purpose and recommended patterns.
 *
 * @property intent - The screen intent type
 * @property primaryComponents - List of primary components for this screen
 * @property layoutPatterns - List of layout patterns to use
 * @property actions - List of user actions available on this screen
 */
export interface IntentContract {
  intent: ScreenIntent;
  primaryComponents: string[];
  layoutPatterns: string[];
  actions: string[];
}

/**
 * Zod schema for intent contract validation.
 *
 * @remarks
 * Validates that the intent contract includes all required fields
 * with correct types and non-empty arrays for components and patterns.
 */
export const intentContractSchema = z.object({
  intent: z.enum([
    'data-list',
    'data-detail',
    'dashboard',
    'form',
    'wizard',
    'auth',
    'settings',
    'empty-state',
    'error',
    'custom',
  ]),
  primaryComponents: z.array(z.string().min(1)).min(1, 'At least one primary component is required'),
  layoutPatterns: z.array(z.string().min(1)).min(1, 'At least one layout pattern is required'),
  actions: z.array(z.string().min(1)), // Actions can be empty array
});

/**
 * Type inference from Zod schema.
 */
export type IntentContractSchema = z.infer<typeof intentContractSchema>;
