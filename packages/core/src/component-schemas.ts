/**
 * @tekton/core - Component Schema Definitions
 * Platform-agnostic component interface specifications with token bindings
 * [SPEC-COMPONENT-001-B] [TAG-001] [TAG-002] [TAG-003]
 */

// ============================================================================
// Type Definitions [TAG-001]
// ============================================================================

/**
 * Property definition for component props
 */
export interface PropDefinition {
  /** Property name */
  name: string;

  /** Property type (TypeScript-style) */
  type: string;

  /** Whether the property is required */
  required: boolean;

  /** Human-readable description */
  description: string;

  /** Default value if not required */
  defaultValue?: unknown;

  /** Allowed values (for enum-like props) */
  options?: string[];
}

/**
 * Accessibility requirements for a component
 */
export interface A11yRequirements {
  /** ARIA role */
  role: string;

  /** WCAG compliance level */
  wcag: string;

  /** Required ARIA attributes */
  ariaAttributes?: string[];

  /** Keyboard interaction requirements */
  keyboard?: string[];

  /** Focus management requirements */
  focus?: string;

  /** Screen reader announcements */
  screenReader?: string;
}

/**
 * Token bindings map component properties to design tokens
 * Supports template variables like {variant}, {size}
 */
export type TokenBindings = Record<string, string>;

/**
 * Complete component schema definition
 */
export interface ComponentSchema {
  /** Component type identifier */
  type: string;

  /** Component category */
  category: 'primitive' | 'composed';

  /** Component properties */
  props: PropDefinition[];

  /** Design token bindings with template variables */
  tokenBindings: TokenBindings;

  /** Accessibility requirements (WCAG 2.1 AA) */
  a11y: A11yRequirements;

  /** Optional description */
  description?: string;
}

// ============================================================================
// Primitive Components [TAG-002]
// ============================================================================

/**
 * Button Component Schema
 */
const ButtonSchema: ComponentSchema = {
  type: 'Button',
  category: 'primitive',
  description: 'Interactive button element for user actions',
  props: [
    {
      name: 'variant',
      type: 'string',
      required: false,
      description: 'Visual style variant',
      defaultValue: 'primary',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    {
      name: 'size',
      type: 'string',
      required: false,
      description: 'Button size',
      defaultValue: 'medium',
      options: ['small', 'medium', 'large'],
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      description: 'Whether the button is disabled',
      defaultValue: false,
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'Button content',
    },
  ],
  tokenBindings: {
    background: 'component.button.{variant}.background',
    foreground: 'component.button.{variant}.foreground',
    border: 'component.button.{variant}.border',
    borderRadius: 'atomic.radius.md',
    paddingX: 'atomic.spacing.{size}',
    paddingY: 'atomic.spacing.2',
    fontSize: 'atomic.typography.{size}.fontSize',
    fontWeight: 'atomic.typography.{size}.fontWeight',
    hoverBackground: 'component.button.{variant}.hover.background',
    activeBackground: 'component.button.{variant}.active.background',
    disabledBackground: 'component.button.{variant}.disabled.background',
    disabledForeground: 'component.button.{variant}.disabled.foreground',
  },
  a11y: {
    role: 'button',
    wcag: 'WCAG 2.1 AA',
    ariaAttributes: ['aria-label', 'aria-disabled', 'aria-pressed'],
    keyboard: ['Enter', 'Space'],
    focus: 'Visible focus indicator with semantic.border.focus',
    screenReader: 'Announces button label and state',
  },
};

/**
 * Input Component Schema
 */
const InputSchema: ComponentSchema = {
  type: 'Input',
  category: 'primitive',
  description: 'Text input field for user data entry',
  props: [
    {
      name: 'type',
      type: 'string',
      required: false,
      description: 'Input type',
      defaultValue: 'text',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
    {
      name: 'size',
      type: 'string',
      required: false,
      description: 'Input size',
      defaultValue: 'medium',
      options: ['small', 'medium', 'large'],
    },
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      description: 'Placeholder text',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      description: 'Whether the input is disabled',
      defaultValue: false,
    },
    {
      name: 'error',
      type: 'boolean',
      required: false,
      description: 'Whether the input has an error',
      defaultValue: false,
    },
    {
      name: 'value',
      type: 'string',
      required: false,
      description: 'Input value',
    },
  ],
  tokenBindings: {
    background: 'component.input.background',
    foreground: 'component.input.foreground',
    border: 'component.input.border',
    borderRadius: 'atomic.radius.md',
    padding: 'atomic.spacing.3',
    fontSize: 'atomic.typography.body.fontSize',
    placeholderColor: 'component.input.placeholder',
    focusBorder: 'component.input.focus.border',
    focusRing: 'component.input.focus.ring',
    errorBorder: 'component.input.error.border',
    errorRing: 'component.input.error.ring',
    disabledBackground: 'component.input.disabled.background',
    disabledForeground: 'component.input.disabled.foreground',
  },
  a11y: {
    role: 'textbox',
    wcag: 'WCAG 2.1 AA',
    ariaAttributes: ['aria-label', 'aria-describedby', 'aria-invalid', 'aria-required'],
    keyboard: ['Tab', 'Shift+Tab', 'Escape'],
    focus: 'Visible focus ring with component.input.focus.ring',
    screenReader: 'Announces label, value, and error state',
  },
};

/**
 * Text Component Schema
 */
const TextSchema: ComponentSchema = {
  type: 'Text',
  category: 'primitive',
  description: 'Text display component with semantic styling',
  props: [
    {
      name: 'variant',
      type: 'string',
      required: false,
      description: 'Text semantic variant',
      defaultValue: 'body',
      options: ['body', 'caption', 'label', 'code'],
    },
    {
      name: 'size',
      type: 'string',
      required: false,
      description: 'Text size',
      defaultValue: 'medium',
      options: ['small', 'medium', 'large'],
    },
    {
      name: 'color',
      type: 'string',
      required: false,
      description: 'Text color semantic',
      defaultValue: 'primary',
      options: ['primary', 'secondary', 'muted', 'accent', 'inverse'],
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'Text content',
    },
  ],
  tokenBindings: {
    color: 'semantic.foreground.{color}',
    fontSize: 'atomic.typography.{variant}.fontSize',
    lineHeight: 'atomic.typography.{variant}.lineHeight',
    fontWeight: 'atomic.typography.{variant}.fontWeight',
  },
  a11y: {
    role: 'text',
    wcag: 'WCAG 2.1 AA',
    ariaAttributes: ['aria-label'],
    focus: 'Not focusable unless interactive',
    screenReader: 'Reads text content naturally',
  },
};

/**
 * Heading Component Schema
 */
const HeadingSchema: ComponentSchema = {
  type: 'Heading',
  category: 'primitive',
  description: 'Heading component for hierarchical text structure',
  props: [
    {
      name: 'level',
      type: 'number',
      required: false,
      description: 'Heading level (h1-h6)',
      defaultValue: 1,
      options: ['1', '2', '3', '4', '5', '6'],
    },
    {
      name: 'size',
      type: 'string',
      required: false,
      description: 'Visual size (can differ from semantic level)',
      defaultValue: 'xl',
      options: ['sm', 'md', 'lg', 'xl', '2xl', '3xl'],
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'Heading content',
    },
  ],
  tokenBindings: {
    color: 'semantic.foreground.primary',
    fontSize: 'atomic.typography.heading{size}.fontSize',
    lineHeight: 'atomic.typography.heading{size}.lineHeight',
    fontWeight: 'atomic.typography.heading{size}.fontWeight',
    marginBottom: 'atomic.spacing.4',
  },
  a11y: {
    role: 'heading',
    wcag: 'WCAG 2.1 AA',
    ariaAttributes: ['aria-level'],
    focus: 'Not focusable',
    screenReader: 'Announces as heading with level',
  },
};

/**
 * Checkbox Component Schema
 */
const CheckboxSchema: ComponentSchema = {
  type: 'Checkbox',
  category: 'primitive',
  description: 'Checkbox input for boolean selections',
  props: [
    {
      name: 'checked',
      type: 'boolean',
      required: false,
      description: 'Checked state',
      defaultValue: false,
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      description: 'Disabled state',
      defaultValue: false,
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      description: 'Checkbox label',
    },
  ],
  tokenBindings: {
    background: 'semantic.surface.primary',
    border: 'semantic.border.default',
    checkedBackground: 'semantic.foreground.accent',
    checkedBorder: 'semantic.foreground.accent',
    checkmarkColor: 'semantic.foreground.inverse',
    focusRing: 'semantic.border.focus',
    disabledBackground: 'semantic.background.muted',
    disabledBorder: 'semantic.border.muted',
  },
  a11y: {
    role: 'checkbox',
    wcag: 'WCAG 2.1 AA',
    ariaAttributes: ['aria-checked', 'aria-disabled', 'aria-labelledby'],
    keyboard: ['Space', 'Tab'],
    focus: 'Visible focus ring with semantic.border.focus',
    screenReader: 'Announces label and checked state',
  },
};

/**
 * Radio Component Schema
 */
const RadioSchema: ComponentSchema = {
  type: 'Radio',
  category: 'primitive',
  description: 'Radio input for mutually exclusive selections',
  props: [
    {
      name: 'checked',
      type: 'boolean',
      required: false,
      description: 'Checked state',
      defaultValue: false,
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      description: 'Disabled state',
      defaultValue: false,
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      description: 'Radio label',
    },
    {
      name: 'name',
      type: 'string',
      required: true,
      description: 'Radio group name',
    },
  ],
  tokenBindings: {
    background: 'semantic.surface.primary',
    border: 'semantic.border.default',
    checkedBackground: 'semantic.foreground.accent',
    checkedBorder: 'semantic.foreground.accent',
    dotColor: 'semantic.foreground.inverse',
    focusRing: 'semantic.border.focus',
    disabledBackground: 'semantic.background.muted',
    disabledBorder: 'semantic.border.muted',
  },
  a11y: {
    role: 'radio',
    wcag: 'WCAG 2.1 AA',
    ariaAttributes: ['aria-checked', 'aria-disabled', 'aria-labelledby'],
    keyboard: ['Space', 'Arrow keys', 'Tab'],
    focus: 'Visible focus ring, keyboard navigation within group',
    screenReader: 'Announces label, checked state, and position in group',
  },
};

/**
 * Switch Component Schema
 */
const SwitchSchema: ComponentSchema = {
  type: 'Switch',
  category: 'primitive',
  description: 'Toggle switch for boolean settings',
  props: [
    {
      name: 'checked',
      type: 'boolean',
      required: false,
      description: 'Checked state',
      defaultValue: false,
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      description: 'Disabled state',
      defaultValue: false,
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      description: 'Switch label',
    },
  ],
  tokenBindings: {
    trackBackground: 'semantic.background.muted',
    trackCheckedBackground: 'semantic.foreground.accent',
    thumbBackground: 'semantic.surface.primary',
    thumbShadow: 'atomic.shadow.sm',
    focusRing: 'semantic.border.focus',
    disabledTrackBackground: 'semantic.background.muted',
    disabledThumbBackground: 'semantic.surface.secondary',
  },
  a11y: {
    role: 'switch',
    wcag: 'WCAG 2.1 AA',
    ariaAttributes: ['aria-checked', 'aria-disabled', 'aria-labelledby'],
    keyboard: ['Space', 'Tab'],
    focus: 'Visible focus ring with semantic.border.focus',
    screenReader: 'Announces as switch with on/off state',
  },
};

/**
 * Slider Component Schema
 */
const SliderSchema: ComponentSchema = {
  type: 'Slider',
  category: 'primitive',
  description: 'Slider input for selecting a value from a range',
  props: [
    {
      name: 'value',
      type: 'number',
      required: false,
      description: 'Current value',
      defaultValue: 0,
    },
    {
      name: 'min',
      type: 'number',
      required: false,
      description: 'Minimum value',
      defaultValue: 0,
    },
    {
      name: 'max',
      type: 'number',
      required: false,
      description: 'Maximum value',
      defaultValue: 100,
    },
    {
      name: 'step',
      type: 'number',
      required: false,
      description: 'Step increment',
      defaultValue: 1,
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      description: 'Disabled state',
      defaultValue: false,
    },
  ],
  tokenBindings: {
    trackBackground: 'semantic.background.muted',
    trackFillBackground: 'semantic.foreground.accent',
    thumbBackground: 'semantic.surface.primary',
    thumbBorder: 'semantic.border.default',
    thumbShadow: 'atomic.shadow.md',
    focusRing: 'semantic.border.focus',
    disabledTrackBackground: 'semantic.background.muted',
    disabledThumbBackground: 'semantic.surface.secondary',
  },
  a11y: {
    role: 'slider',
    wcag: 'WCAG 2.1 AA',
    ariaAttributes: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-disabled'],
    keyboard: ['Arrow keys', 'Home', 'End', 'Page Up', 'Page Down'],
    focus: 'Visible focus ring on thumb',
    screenReader: 'Announces current value, min, max, and step',
  },
};

/**
 * Badge Component Schema
 */
const BadgeSchema: ComponentSchema = {
  type: 'Badge',
  category: 'primitive',
  description: 'Small status or label indicator',
  props: [
    {
      name: 'variant',
      type: 'string',
      required: false,
      description: 'Badge style variant',
      defaultValue: 'default',
      options: ['default', 'success', 'warning', 'error', 'info'],
    },
    {
      name: 'size',
      type: 'string',
      required: false,
      description: 'Badge size',
      defaultValue: 'medium',
      options: ['small', 'medium', 'large'],
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'Badge content',
    },
  ],
  tokenBindings: {
    background: 'semantic.foreground.{variant}',
    foreground: 'semantic.foreground.inverse',
    borderRadius: 'atomic.radius.full',
    paddingX: 'atomic.spacing.{size}',
    paddingY: 'atomic.spacing.1',
    fontSize: 'atomic.typography.caption.fontSize',
    fontWeight: 'atomic.typography.caption.fontWeight',
  },
  a11y: {
    role: 'status',
    wcag: 'WCAG 2.1 AA',
    ariaAttributes: ['aria-label'],
    focus: 'Not focusable',
    screenReader: 'Announces badge content and variant',
  },
};

/**
 * Avatar Component Schema
 */
const AvatarSchema: ComponentSchema = {
  type: 'Avatar',
  category: 'primitive',
  description: 'User profile image or initials display',
  props: [
    {
      name: 'src',
      type: 'string',
      required: false,
      description: 'Image source URL',
    },
    {
      name: 'alt',
      type: 'string',
      required: true,
      description: 'Alternative text',
    },
    {
      name: 'size',
      type: 'string',
      required: false,
      description: 'Avatar size',
      defaultValue: 'medium',
      options: ['small', 'medium', 'large', 'xl'],
    },
    {
      name: 'fallback',
      type: 'string',
      required: false,
      description: 'Fallback text (initials)',
    },
  ],
  tokenBindings: {
    background: 'semantic.background.muted',
    foreground: 'semantic.foreground.secondary',
    borderRadius: 'atomic.radius.full',
    width: 'atomic.spacing.{size}',
    height: 'atomic.spacing.{size}',
    fontSize: 'atomic.typography.{size}.fontSize',
  },
  a11y: {
    role: 'img',
    wcag: 'WCAG 2.1 AA',
    ariaAttributes: ['aria-label', 'alt'],
    focus: 'Not focusable unless interactive',
    screenReader: 'Announces alt text or fallback',
  },
};

// ============================================================================
// Composed Components [TAG-003]
// ============================================================================

/**
 * Card Component Schema
 */
const CardSchema: ComponentSchema = {
  type: 'Card',
  category: 'composed',
  description: 'Container for grouped content',
  props: [
    {
      name: 'variant',
      type: 'string',
      required: false,
      description: 'Card style variant',
      defaultValue: 'default',
      options: ['default', 'outlined', 'elevated'],
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'Card content',
    },
  ],
  tokenBindings: {
    background: 'component.card.background',
    foreground: 'component.card.foreground',
    border: 'component.card.border',
    borderRadius: 'atomic.radius.lg',
    padding: 'atomic.spacing.4',
    shadow: 'component.card.shadow',
  },
  a11y: {
    role: 'article',
    wcag: 'WCAG 2.1 AA',
    ariaAttributes: ['aria-label'],
    focus: 'Not focusable unless interactive',
    screenReader: 'Announces as card with content',
  },
};

/**
 * Modal Component Schema
 */
const ModalSchema: ComponentSchema = {
  type: 'Modal',
  category: 'composed',
  description: 'Overlay dialog for focused content',
  props: [
    {
      name: 'open',
      type: 'boolean',
      required: true,
      description: 'Whether modal is open',
    },
    {
      name: 'onClose',
      type: 'function',
      required: true,
      description: 'Close handler',
    },
    {
      name: 'title',
      type: 'string',
      required: false,
      description: 'Modal title',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'Modal content',
    },
  ],
  tokenBindings: {
    overlayBackground: 'semantic.surface.inverse',
    background: 'semantic.surface.primary',
    foreground: 'semantic.foreground.primary',
    border: 'semantic.border.default',
    borderRadius: 'atomic.radius.lg',
    padding: 'atomic.spacing.6',
    shadow: 'atomic.shadow.xl',
  },
  a11y: {
    role: 'dialog',
    wcag: 'WCAG 2.1 AA',
    ariaAttributes: ['aria-modal', 'aria-labelledby', 'aria-describedby'],
    keyboard: ['Escape to close', 'Tab for focus trap'],
    focus: 'Focus trap within modal, returns focus on close',
    screenReader: 'Announces as dialog, reads title and content',
  },
};

/**
 * Dropdown Component Schema
 */
const DropdownSchema: ComponentSchema = {
  type: 'Dropdown',
  category: 'composed',
  description: 'Contextual menu with selectable options',
  props: [
    {
      name: 'trigger',
      type: 'ReactNode',
      required: true,
      description: 'Trigger element',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Menu items',
    },
    {
      name: 'placement',
      type: 'string',
      required: false,
      description: 'Menu placement',
      defaultValue: 'bottom-start',
      options: ['top', 'bottom', 'left', 'right'],
    },
  ],
  tokenBindings: {
    menuBackground: 'semantic.surface.elevated',
    menuForeground: 'semantic.foreground.primary',
    menuBorder: 'semantic.border.default',
    menuBorderRadius: 'atomic.radius.md',
    menuShadow: 'atomic.shadow.lg',
    itemHoverBackground: 'semantic.background.muted',
    itemActiveBackground: 'semantic.foreground.accent',
    itemPadding: 'atomic.spacing.3',
  },
  a11y: {
    role: 'menu',
    wcag: 'WCAG 2.1 AA',
    ariaAttributes: ['aria-haspopup', 'aria-expanded', 'aria-controls'],
    keyboard: ['Arrow keys', 'Enter', 'Escape', 'Tab'],
    focus: 'Focus management within menu',
    screenReader: 'Announces menu with item count and selection',
  },
};

/**
 * Tabs Component Schema
 */
const TabsSchema: ComponentSchema = {
  type: 'Tabs',
  category: 'composed',
  description: 'Tabbed content navigation',
  props: [
    {
      name: 'tabs',
      type: 'array',
      required: true,
      description: 'Tab items',
    },
    {
      name: 'defaultTab',
      type: 'string',
      required: false,
      description: 'Default active tab',
    },
  ],
  tokenBindings: {
    tabListBackground: 'semantic.surface.secondary',
    tabListBorder: 'semantic.border.default',
    tabBackground: 'semantic.surface.secondary',
    tabForeground: 'semantic.foreground.secondary',
    tabActiveBackground: 'semantic.surface.primary',
    tabActiveForeground: 'semantic.foreground.primary',
    tabActiveBorder: 'semantic.foreground.accent',
    tabHoverBackground: 'semantic.background.muted',
    tabPadding: 'atomic.spacing.3',
    tabBorderRadius: 'atomic.radius.md',
  },
  a11y: {
    role: 'tablist',
    wcag: 'WCAG 2.1 AA',
    ariaAttributes: ['aria-selected', 'aria-controls', 'aria-labelledby'],
    keyboard: ['Arrow keys', 'Home', 'End', 'Tab'],
    focus: 'Roving tabindex for tab navigation',
    screenReader: 'Announces tab name, selection state, and position',
  },
};

/**
 * Link Component Schema
 */
const LinkSchema: ComponentSchema = {
  type: 'Link',
  category: 'composed',
  description: 'Hyperlink for navigation',
  props: [
    {
      name: 'href',
      type: 'string',
      required: true,
      description: 'Link destination',
    },
    {
      name: 'external',
      type: 'boolean',
      required: false,
      description: 'Whether link is external',
      defaultValue: false,
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'Link content',
    },
  ],
  tokenBindings: {
    color: 'semantic.foreground.accent',
    hoverColor: 'semantic.foreground.primary',
    textDecoration: 'atomic.typography.body.textDecoration',
    focusRing: 'semantic.border.focus',
  },
  a11y: {
    role: 'link',
    wcag: 'WCAG 2.1 AA',
    ariaAttributes: ['aria-label', 'aria-current'],
    keyboard: ['Enter', 'Tab'],
    focus: 'Visible focus ring',
    screenReader: 'Announces as link with destination',
  },
};

/**
 * Table Component Schema
 */
const TableSchema: ComponentSchema = {
  type: 'Table',
  category: 'composed',
  description: 'Data table for structured information',
  props: [
    {
      name: 'columns',
      type: 'array',
      required: true,
      description: 'Table columns',
    },
    {
      name: 'data',
      type: 'array',
      required: true,
      description: 'Table data',
    },
    {
      name: 'striped',
      type: 'boolean',
      required: false,
      description: 'Striped rows',
      defaultValue: false,
    },
  ],
  tokenBindings: {
    background: 'semantic.surface.primary',
    border: 'semantic.border.default',
    headerBackground: 'semantic.surface.secondary',
    headerForeground: 'semantic.foreground.primary',
    cellForeground: 'semantic.foreground.primary',
    cellPadding: 'atomic.spacing.3',
    stripedBackground: 'semantic.surface.tertiary',
    hoverBackground: 'semantic.background.muted',
  },
  a11y: {
    role: 'table',
    wcag: 'WCAG 2.1 AA',
    ariaAttributes: ['aria-label', 'aria-describedby'],
    keyboard: ['Tab for navigation'],
    focus: 'Focusable cells for interactive content',
    screenReader: 'Announces table with row and column headers',
  },
};

/**
 * List Component Schema
 */
const ListSchema: ComponentSchema = {
  type: 'List',
  category: 'composed',
  description: 'Ordered or unordered list',
  props: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'List items',
    },
    {
      name: 'ordered',
      type: 'boolean',
      required: false,
      description: 'Whether list is ordered',
      defaultValue: false,
    },
  ],
  tokenBindings: {
    color: 'semantic.foreground.primary',
    markerColor: 'semantic.foreground.secondary',
    spacing: 'atomic.spacing.2',
    fontSize: 'atomic.typography.body.fontSize',
    lineHeight: 'atomic.typography.body.lineHeight',
  },
  a11y: {
    role: 'list',
    wcag: 'WCAG 2.1 AA',
    ariaAttributes: ['aria-label'],
    focus: 'Not focusable unless items are interactive',
    screenReader: 'Announces list with item count',
  },
};

/**
 * Image Component Schema
 */
const ImageSchema: ComponentSchema = {
  type: 'Image',
  category: 'composed',
  description: 'Image display with loading states',
  props: [
    {
      name: 'src',
      type: 'string',
      required: true,
      description: 'Image source URL',
    },
    {
      name: 'alt',
      type: 'string',
      required: true,
      description: 'Alternative text',
    },
    {
      name: 'aspectRatio',
      type: 'string',
      required: false,
      description: 'Aspect ratio',
      defaultValue: '16/9',
    },
    {
      name: 'loading',
      type: 'string',
      required: false,
      description: 'Loading strategy',
      defaultValue: 'lazy',
      options: ['lazy', 'eager'],
    },
  ],
  tokenBindings: {
    borderRadius: 'atomic.radius.md',
    background: 'semantic.background.muted',
    placeholderBackground: 'semantic.background.muted',
  },
  a11y: {
    role: 'img',
    wcag: 'WCAG 2.1 AA',
    ariaAttributes: ['alt', 'aria-label'],
    focus: 'Not focusable',
    screenReader: 'Announces image with alt text',
  },
};

/**
 * Form Component Schema
 */
const FormSchema: ComponentSchema = {
  type: 'Form',
  category: 'composed',
  description: 'Form container with validation',
  props: [
    {
      name: 'onSubmit',
      type: 'function',
      required: true,
      description: 'Submit handler',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'Form fields',
    },
  ],
  tokenBindings: {
    spacing: 'atomic.spacing.4',
    labelColor: 'semantic.foreground.primary',
    errorColor: 'semantic.border.error',
    helperColor: 'semantic.foreground.muted',
  },
  a11y: {
    role: 'form',
    wcag: 'WCAG 2.1 AA',
    ariaAttributes: ['aria-label', 'aria-describedby'],
    keyboard: ['Tab', 'Enter for submit'],
    focus: 'Focus management for validation errors',
    screenReader: 'Announces form with labels and errors',
  },
};

/**
 * Progress Component Schema
 */
const ProgressSchema: ComponentSchema = {
  type: 'Progress',
  category: 'composed',
  description: 'Progress indicator for loading states',
  props: [
    {
      name: 'value',
      type: 'number',
      required: false,
      description: 'Progress value (0-100)',
    },
    {
      name: 'indeterminate',
      type: 'boolean',
      required: false,
      description: 'Indeterminate loading state',
      defaultValue: false,
    },
    {
      name: 'size',
      type: 'string',
      required: false,
      description: 'Progress bar size',
      defaultValue: 'medium',
      options: ['small', 'medium', 'large'],
    },
  ],
  tokenBindings: {
    trackBackground: 'semantic.background.muted',
    fillBackground: 'semantic.foreground.accent',
    height: 'atomic.spacing.{size}',
    borderRadius: 'atomic.radius.full',
  },
  a11y: {
    role: 'progressbar',
    wcag: 'WCAG 2.1 AA',
    ariaAttributes: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-label'],
    focus: 'Not focusable',
    screenReader: 'Announces progress percentage or indeterminate state',
  },
};

// ============================================================================
// Component Registry
// ============================================================================

/**
 * All primitive components (10)
 */
export const PRIMITIVE_COMPONENTS: ComponentSchema[] = [
  ButtonSchema,
  InputSchema,
  TextSchema,
  HeadingSchema,
  CheckboxSchema,
  RadioSchema,
  SwitchSchema,
  SliderSchema,
  BadgeSchema,
  AvatarSchema,
];

/**
 * All composed components (10)
 */
export const COMPOSED_COMPONENTS: ComponentSchema[] = [
  CardSchema,
  ModalSchema,
  DropdownSchema,
  TabsSchema,
  LinkSchema,
  TableSchema,
  ListSchema,
  ImageSchema,
  FormSchema,
  ProgressSchema,
];

/**
 * All components registry (20 total)
 */
export const ALL_COMPONENTS: ComponentSchema[] = [...PRIMITIVE_COMPONENTS, ...COMPOSED_COMPONENTS];

/**
 * Get component schema by type
 */
export function getComponentSchema(type: string): ComponentSchema | undefined {
  return ALL_COMPONENTS.find(c => c.type === type);
}
