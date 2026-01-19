/**
 * Archetype Client
 * Access archetype-system data for component preview
 */

import type {
  VariantConfigurationOption,
  AccessibilitySpec,
} from '@tekton/component-system';

// Note: Data imports would come from @tekton/component-system/data
// For now we provide typed interfaces and sample data

/**
 * Available hooks for preview
 */
export const AVAILABLE_HOOKS = [
  // Form hooks
  'useButton',
  'useToggleButton',
  'useInput',
  'useCheckbox',
  'useRadio',
  // Complex form hooks
  'useSelect',
  'useTabs',
  'useBreadcrumb',
  'usePagination',
  'useSlider',
  // Overlay hooks
  'useModal',
  'useTooltip',
  'usePopover',
  'useDropdownMenu',
  'useAlert',
  // Display hooks
  'useCard',
  'useAvatar',
  'useBadge',
  'useDivider',
  'useProgress',
] as const;

export type HookName = typeof AVAILABLE_HOOKS[number];

/**
 * Hook metadata for display
 */
export interface HookMeta {
  name: HookName;
  label: string;
  category: 'form' | 'complex' | 'overlay' | 'display';
  description: string;
}

export const HOOK_METADATA: HookMeta[] = [
  // Form
  { name: 'useButton', label: 'Button', category: 'form', description: 'Interactive button with variants' },
  { name: 'useToggleButton', label: 'Toggle Button', category: 'form', description: 'Button with on/off state' },
  { name: 'useInput', label: 'Input', category: 'form', description: 'Text input field' },
  { name: 'useCheckbox', label: 'Checkbox', category: 'form', description: 'Checkbox with label' },
  { name: 'useRadio', label: 'Radio', category: 'form', description: 'Radio button group' },
  // Complex
  { name: 'useSelect', label: 'Select', category: 'complex', description: 'Dropdown selection' },
  { name: 'useTabs', label: 'Tabs', category: 'complex', description: 'Tab navigation' },
  { name: 'useBreadcrumb', label: 'Breadcrumb', category: 'complex', description: 'Navigation breadcrumbs' },
  { name: 'usePagination', label: 'Pagination', category: 'complex', description: 'Page navigation' },
  { name: 'useSlider', label: 'Slider', category: 'complex', description: 'Range slider input' },
  // Overlay
  { name: 'useModal', label: 'Modal', category: 'overlay', description: 'Modal dialog' },
  { name: 'useTooltip', label: 'Tooltip', category: 'overlay', description: 'Hover tooltip' },
  { name: 'usePopover', label: 'Popover', category: 'overlay', description: 'Click popover' },
  { name: 'useDropdownMenu', label: 'Dropdown Menu', category: 'overlay', description: 'Dropdown menu' },
  { name: 'useAlert', label: 'Alert', category: 'overlay', description: 'Alert notification' },
  // Display
  { name: 'useCard', label: 'Card', category: 'display', description: 'Content card' },
  { name: 'useAvatar', label: 'Avatar', category: 'display', description: 'User avatar' },
  { name: 'useBadge', label: 'Badge', category: 'display', description: 'Status badge' },
  { name: 'useDivider', label: 'Divider', category: 'display', description: 'Content divider' },
  { name: 'useProgress', label: 'Progress', category: 'display', description: 'Progress indicator' },
];

/**
 * Sample variant configurations for preview
 */
export const SAMPLE_VARIANTS: Record<string, VariantConfigurationOption[]> = {
  useButton: [
    {
      optionName: 'variant',
      optionType: 'enum',
      possibleValues: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
      styleRules: [
        { condition: "variant === 'primary'", cssProperties: { backgroundColor: 'var(--tekton-primary-500)', color: 'var(--tekton-neutral-50)' } },
        { condition: "variant === 'secondary'", cssProperties: { backgroundColor: 'var(--tekton-neutral-200)', color: 'var(--tekton-neutral-900)' } },
        { condition: "variant === 'outline'", cssProperties: { border: '1px solid var(--tekton-neutral-300)', backgroundColor: 'transparent' } },
        { condition: "variant === 'ghost'", cssProperties: { backgroundColor: 'transparent' } },
        { condition: "variant === 'destructive'", cssProperties: { backgroundColor: 'var(--tekton-error-500)', color: 'var(--tekton-neutral-50)' } },
      ],
    },
    {
      optionName: 'size',
      optionType: 'enum',
      possibleValues: ['sm', 'md', 'lg'],
      styleRules: [
        { condition: "size === 'sm'", cssProperties: { padding: '0.5rem 1rem', fontSize: '0.875rem' } },
        { condition: "size === 'md'", cssProperties: { padding: '0.625rem 1.25rem', fontSize: '1rem' } },
        { condition: "size === 'lg'", cssProperties: { padding: '0.75rem 1.5rem', fontSize: '1.125rem' } },
      ],
    },
    {
      optionName: 'disabled',
      optionType: 'boolean',
      possibleValues: [true, false],
      styleRules: [
        { condition: 'disabled === true', cssProperties: { opacity: '0.5', cursor: 'not-allowed' } },
      ],
    },
  ],
  useToggleButton: [
    {
      optionName: 'pressed',
      optionType: 'boolean',
      possibleValues: [true, false],
      styleRules: [
        { condition: 'pressed === true', cssProperties: { backgroundColor: 'var(--tekton-primary-500)', color: 'var(--tekton-neutral-50)' } },
        { condition: 'pressed === false', cssProperties: { backgroundColor: 'var(--tekton-neutral-200)' } },
      ],
    },
  ],
  useInput: [
    {
      optionName: 'size',
      optionType: 'enum',
      possibleValues: ['sm', 'md', 'lg'],
      styleRules: [
        { condition: "size === 'sm'", cssProperties: { padding: '0.375rem 0.75rem', fontSize: '0.875rem' } },
        { condition: "size === 'md'", cssProperties: { padding: '0.5rem 1rem', fontSize: '1rem' } },
        { condition: "size === 'lg'", cssProperties: { padding: '0.625rem 1.25rem', fontSize: '1.125rem' } },
      ],
    },
    {
      optionName: 'invalid',
      optionType: 'boolean',
      possibleValues: [true, false],
      styleRules: [
        { condition: 'invalid === true', cssProperties: { borderColor: 'var(--tekton-error-500)' } },
      ],
    },
  ],
  useBadge: [
    {
      optionName: 'variant',
      optionType: 'enum',
      possibleValues: ['default', 'success', 'warning', 'error'],
      styleRules: [
        { condition: "variant === 'default'", cssProperties: { backgroundColor: 'var(--tekton-neutral-200)', color: 'var(--tekton-neutral-700)' } },
        { condition: "variant === 'success'", cssProperties: { backgroundColor: 'var(--tekton-success-100)', color: 'var(--tekton-success-700)' } },
        { condition: "variant === 'warning'", cssProperties: { backgroundColor: 'var(--tekton-warning-100)', color: 'var(--tekton-warning-700)' } },
        { condition: "variant === 'error'", cssProperties: { backgroundColor: 'var(--tekton-error-100)', color: 'var(--tekton-error-700)' } },
      ],
    },
  ],
};

/**
 * Sample accessibility specs for preview
 */
export const SAMPLE_ACCESSIBILITY: Record<string, AccessibilitySpec> = {
  useButton: {
    role: 'button',
    ariaAttributes: [
      { name: 'aria-label', required: false, description: 'Accessible label when text is not descriptive' },
      { name: 'aria-disabled', required: false, validValues: ['true', 'false'], description: 'Indicates disabled state' },
    ],
    keyboardNavigation: [
      { key: 'Enter', action: 'Activates the button', required: true },
      { key: 'Space', action: 'Activates the button', required: true },
    ],
    wcagLevel: 'AA',
  },
  useToggleButton: {
    role: 'button',
    ariaAttributes: [
      { name: 'aria-pressed', required: true, validValues: ['true', 'false'], description: 'Indicates toggle state' },
    ],
    keyboardNavigation: [
      { key: 'Enter', action: 'Toggles the button state', required: true },
      { key: 'Space', action: 'Toggles the button state', required: true },
    ],
    wcagLevel: 'AA',
  },
  useInput: {
    role: 'textbox',
    ariaAttributes: [
      { name: 'aria-label', required: false, description: 'Accessible label' },
      { name: 'aria-invalid', required: false, validValues: ['true', 'false'], description: 'Indicates invalid state' },
      { name: 'aria-describedby', required: false, description: 'References error message' },
    ],
    keyboardNavigation: [],
    focusManagement: 'Focus should be visible with clear outline',
    wcagLevel: 'AA',
  },
};

/**
 * Get hook metadata
 */
export function getHookMeta(hookName: HookName): HookMeta | undefined {
  return HOOK_METADATA.find((h) => h.name === hookName);
}

/**
 * Get hooks by category
 */
export function getHooksByCategory(category: HookMeta['category']): HookMeta[] {
  return HOOK_METADATA.filter((h) => h.category === category);
}

/**
 * Get variant options for a hook
 */
export function getVariantOptions(hookName: string): VariantConfigurationOption[] {
  return SAMPLE_VARIANTS[hookName] ?? [];
}

/**
 * Get accessibility spec for a hook
 */
export function getAccessibilitySpec(hookName: string): AccessibilitySpec | undefined {
  return SAMPLE_ACCESSIBILITY[hookName];
}
