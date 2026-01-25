# Component Schemas Reference

**Module**: `@tekton/core/component-schemas`
**Status**: ✅ Production Ready
**Version**: 2.0.0
**Coverage**: 97.05%

---

## Overview

Component Schemas provide platform-agnostic component interface specifications for 20 core UI components. Each schema defines props, token bindings with template variables, and accessibility requirements compliant with WCAG 2.1 AA standards.

**Key Features:**

- 20 component schemas (10 primitive + 10 composed)
- Platform-agnostic design (React, Vue, Svelte, React Native compatible)
- Token bindings with template variables (`{variant}`, `{size}`, `{color}`)
- WCAG 2.1 AA accessibility requirements for all components
- TypeScript type definitions with strict typing
- Zod runtime validation integration

---

## Component Registry

### ALL_COMPONENTS

Array of all 20 component schemas.

```typescript
import { ALL_COMPONENTS } from 'tekton/core';

console.log(ALL_COMPONENTS.length); // 20

ALL_COMPONENTS.forEach(schema => {
  console.log(`${schema.type} (${schema.category})`);
});
```

### PRIMITIVE_COMPONENTS

Array of 10 primitive component schemas.

```typescript
import { PRIMITIVE_COMPONENTS } from 'tekton/core';

console.log(PRIMITIVE_COMPONENTS.length); // 10

// Button, Input, Text, Heading, Checkbox, Radio, Switch, Slider, Badge, Avatar
```

### COMPOSED_COMPONENTS

Array of 10 composed component schemas.

```typescript
import { COMPOSED_COMPONENTS } from 'tekton/core';

console.log(COMPOSED_COMPONENTS.length); // 10

// Card, Modal, Dropdown, Tabs, Link, Table, List, Image, Form, Progress
```

### getComponentSchema

Retrieve schema by component type.

```typescript
import { getComponentSchema } from 'tekton/core';

const buttonSchema = getComponentSchema('Button');
const inputSchema = getComponentSchema('Input');

if (buttonSchema) {
  console.log(buttonSchema.type); // "Button"
  console.log(buttonSchema.props); // PropDefinition[]
}
```

---

## Primitive Components (10)

### Button

Interactive button element for user actions.

```typescript
import { getComponentSchema } from 'tekton/core';

const ButtonSchema = getComponentSchema('Button');
```

**Props (4):**

- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' (default: 'primary')
- `size`: 'small' | 'medium' | 'large' (default: 'medium')
- `disabled`: boolean (default: false)
- `children`: ReactNode (required)

**Token Bindings (11):**

```typescript
{
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
  disabledBackground: 'component.button.{variant}.disabled.background'
}
```

**Accessibility:**

- **Role**: `button`
- **WCAG**: 2.1 AA
- **ARIA Attributes**: `aria-label`, `aria-disabled`, `aria-pressed`
- **Keyboard**: Enter, Space
- **Focus**: Visible focus indicator with `semantic.border.focus`

---

### Input

Text input field for user data entry.

```typescript
const InputSchema = getComponentSchema('Input');
```

**Props (6):**

- `type`: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' (default: 'text')
- `size`: 'small' | 'medium' | 'large' (default: 'medium')
- `placeholder`: string (optional)
- `disabled`: boolean (default: false)
- `error`: boolean (default: false)
- `value`: string (optional)

**Token Bindings (11):**

```typescript
{
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
  errorRing: 'component.input.error.ring'
}
```

**Accessibility:**

- **Role**: `textbox`
- **WCAG**: 2.1 AA
- **ARIA Attributes**: `aria-label`, `aria-describedby`, `aria-invalid`, `aria-required`
- **Keyboard**: Tab, Shift+Tab, Escape

---

### Text

Text display component with semantic styling.

```typescript
const TextSchema = getComponentSchema('Text');
```

**Props (4):**

- `variant`: 'body' | 'caption' | 'label' | 'code' (default: 'body')
- `size`: 'small' | 'medium' | 'large' (default: 'medium')
- `color`: 'primary' | 'secondary' | 'muted' | 'accent' | 'inverse' (default: 'primary')
- `children`: ReactNode (required)

**Token Bindings (4):**

```typescript
{
  color: 'semantic.foreground.{color}',
  fontSize: 'atomic.typography.{variant}.fontSize',
  lineHeight: 'atomic.typography.{variant}.lineHeight',
  fontWeight: 'atomic.typography.{variant}.fontWeight'
}
```

**Accessibility:**

- **Role**: `text`
- **WCAG**: 2.1 AA
- **ARIA Attributes**: `aria-label`

---

### Heading

Heading component for hierarchical text structure.

```typescript
const HeadingSchema = getComponentSchema('Heading');
```

**Props (3):**

- `level`: 1 | 2 | 3 | 4 | 5 | 6 (default: 1)
- `size`: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' (default: 'xl')
- `children`: ReactNode (required)

**Token Bindings (5):**

```typescript
{
  color: 'semantic.foreground.primary',
  fontSize: 'atomic.typography.heading{size}.fontSize',
  lineHeight: 'atomic.typography.heading{size}.lineHeight',
  fontWeight: 'atomic.typography.heading{size}.fontWeight',
  marginBottom: 'atomic.spacing.4'
}
```

**Accessibility:**

- **Role**: `heading`
- **WCAG**: 2.1 AA
- **ARIA Attributes**: `aria-level`

---

### Checkbox

Checkbox input for boolean selections.

```typescript
const CheckboxSchema = getComponentSchema('Checkbox');
```

**Props (3):**

- `checked`: boolean (default: false)
- `disabled`: boolean (default: false)
- `label`: string (optional)

**Token Bindings (7):**

```typescript
{
  background: 'semantic.surface.primary',
  border: 'semantic.border.default',
  checkedBackground: 'semantic.foreground.accent',
  checkedBorder: 'semantic.foreground.accent',
  checkmarkColor: 'semantic.foreground.inverse',
  focusRing: 'semantic.border.focus',
  disabledBackground: 'semantic.background.muted'
}
```

**Accessibility:**

- **Role**: `checkbox`
- **WCAG**: 2.1 AA
- **ARIA Attributes**: `aria-checked`, `aria-disabled`, `aria-labelledby`
- **Keyboard**: Space, Tab

---

### Radio

Radio input for mutually exclusive selections.

```typescript
const RadioSchema = getComponentSchema('Radio');
```

**Props (4):**

- `checked`: boolean (default: false)
- `disabled`: boolean (default: false)
- `label`: string (optional)
- `name`: string (required)

**Token Bindings (7):**

```typescript
{
  background: 'semantic.surface.primary',
  border: 'semantic.border.default',
  checkedBackground: 'semantic.foreground.accent',
  checkedBorder: 'semantic.foreground.accent',
  dotColor: 'semantic.foreground.inverse',
  focusRing: 'semantic.border.focus',
  disabledBackground: 'semantic.background.muted'
}
```

**Accessibility:**

- **Role**: `radio`
- **WCAG**: 2.1 AA
- **ARIA Attributes**: `aria-checked`, `aria-disabled`, `aria-labelledby`
- **Keyboard**: Space, Arrow keys, Tab

---

### Switch

Toggle switch for boolean settings.

```typescript
const SwitchSchema = getComponentSchema('Switch');
```

**Props (3):**

- `checked`: boolean (default: false)
- `disabled`: boolean (default: false)
- `label`: string (optional)

**Token Bindings (7):**

```typescript
{
  trackBackground: 'semantic.background.muted',
  trackCheckedBackground: 'semantic.foreground.accent',
  thumbBackground: 'semantic.surface.primary',
  thumbShadow: 'atomic.shadow.sm',
  focusRing: 'semantic.border.focus',
  disabledTrackBackground: 'semantic.background.muted',
  disabledThumbBackground: 'semantic.surface.secondary'
}
```

**Accessibility:**

- **Role**: `switch`
- **WCAG**: 2.1 AA
- **ARIA Attributes**: `aria-checked`, `aria-disabled`, `aria-labelledby`
- **Keyboard**: Space, Tab

---

### Slider

Slider input for selecting a value from a range.

```typescript
const SliderSchema = getComponentSchema('Slider');
```

**Props (5):**

- `value`: number (default: 0)
- `min`: number (default: 0)
- `max`: number (default: 100)
- `step`: number (default: 1)
- `disabled`: boolean (default: false)

**Token Bindings (8):**

```typescript
{
  trackBackground: 'semantic.background.muted',
  trackFillBackground: 'semantic.foreground.accent',
  thumbBackground: 'semantic.surface.primary',
  thumbBorder: 'semantic.border.default',
  thumbShadow: 'atomic.shadow.md',
  focusRing: 'semantic.border.focus',
  disabledTrackBackground: 'semantic.background.muted',
  disabledThumbBackground: 'semantic.surface.secondary'
}
```

**Accessibility:**

- **Role**: `slider`
- **WCAG**: 2.1 AA
- **ARIA Attributes**: `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-disabled`
- **Keyboard**: Arrow keys, Home, End, Page Up, Page Down

---

### Badge

Small status or label indicator.

```typescript
const BadgeSchema = getComponentSchema('Badge');
```

**Props (3):**

- `variant`: 'default' | 'success' | 'warning' | 'error' | 'info' (default: 'default')
- `size`: 'small' | 'medium' | 'large' (default: 'medium')
- `children`: ReactNode (required)

**Token Bindings (7):**

```typescript
{
  background: 'semantic.foreground.{variant}',
  foreground: 'semantic.foreground.inverse',
  borderRadius: 'atomic.radius.full',
  paddingX: 'atomic.spacing.{size}',
  paddingY: 'atomic.spacing.1',
  fontSize: 'atomic.typography.caption.fontSize',
  fontWeight: 'atomic.typography.caption.fontWeight'
}
```

**Accessibility:**

- **Role**: `status`
- **WCAG**: 2.1 AA
- **ARIA Attributes**: `aria-label`

---

### Avatar

User profile image or initials display.

```typescript
const AvatarSchema = getComponentSchema('Avatar');
```

**Props (4):**

- `src`: string (optional)
- `alt`: string (required)
- `size`: 'small' | 'medium' | 'large' | 'xl' (default: 'medium')
- `fallback`: string (optional)

**Token Bindings (6):**

```typescript
{
  background: 'semantic.background.muted',
  foreground: 'semantic.foreground.secondary',
  borderRadius: 'atomic.radius.full',
  width: 'atomic.spacing.{size}',
  height: 'atomic.spacing.{size}',
  fontSize: 'atomic.typography.{size}.fontSize'
}
```

**Accessibility:**

- **Role**: `img`
- **WCAG**: 2.1 AA
- **ARIA Attributes**: `aria-label`, `alt`

---

## Composed Components (10)

### Card

Container for grouped content.

```typescript
const CardSchema = getComponentSchema('Card');
```

**Props (2):**

- `variant`: 'default' | 'outlined' | 'elevated' (default: 'default')
- `children`: ReactNode (required)

**Token Bindings (6):**

```typescript
{
  background: 'component.card.background',
  foreground: 'component.card.foreground',
  border: 'component.card.border',
  borderRadius: 'atomic.radius.lg',
  padding: 'atomic.spacing.4',
  shadow: 'component.card.shadow'
}
```

**Accessibility:**

- **Role**: `article`
- **WCAG**: 2.1 AA
- **ARIA Attributes**: `aria-label`

---

### Modal

Overlay dialog for focused content.

```typescript
const ModalSchema = getComponentSchema('Modal');
```

**Props (4):**

- `open`: boolean (required)
- `onClose`: function (required)
- `title`: string (optional)
- `children`: ReactNode (required)

**Token Bindings (7):**

```typescript
{
  overlayBackground: 'semantic.surface.inverse',
  background: 'semantic.surface.primary',
  foreground: 'semantic.foreground.primary',
  border: 'semantic.border.default',
  borderRadius: 'atomic.radius.lg',
  padding: 'atomic.spacing.6',
  shadow: 'atomic.shadow.xl'
}
```

**Accessibility:**

- **Role**: `dialog`
- **WCAG**: 2.1 AA
- **ARIA Attributes**: `aria-modal`, `aria-labelledby`, `aria-describedby`
- **Keyboard**: Escape to close, Tab for focus trap

---

### Dropdown

Contextual menu with selectable options.

```typescript
const DropdownSchema = getComponentSchema('Dropdown');
```

**Props (3):**

- `trigger`: ReactNode (required)
- `items`: array (required)
- `placement`: 'top' | 'bottom' | 'left' | 'right' (default: 'bottom-start')

**Token Bindings (8):**

```typescript
{
  menuBackground: 'semantic.surface.elevated',
  menuForeground: 'semantic.foreground.primary',
  menuBorder: 'semantic.border.default',
  menuBorderRadius: 'atomic.radius.md',
  menuShadow: 'atomic.shadow.lg',
  itemHoverBackground: 'semantic.background.muted',
  itemActiveBackground: 'semantic.foreground.accent',
  itemPadding: 'atomic.spacing.3'
}
```

**Accessibility:**

- **Role**: `menu`
- **WCAG**: 2.1 AA
- **ARIA Attributes**: `aria-haspopup`, `aria-expanded`, `aria-controls`
- **Keyboard**: Arrow keys, Enter, Escape, Tab

---

### Tabs

Tabbed content navigation.

```typescript
const TabsSchema = getComponentSchema('Tabs');
```

**Props (2):**

- `tabs`: array (required)
- `defaultTab`: string (optional)

**Token Bindings (10):**

```typescript
{
  tabListBackground: 'semantic.surface.secondary',
  tabListBorder: 'semantic.border.default',
  tabBackground: 'semantic.surface.secondary',
  tabForeground: 'semantic.foreground.secondary',
  tabActiveBackground: 'semantic.surface.primary',
  tabActiveForeground: 'semantic.foreground.primary',
  tabActiveBorder: 'semantic.foreground.accent',
  tabHoverBackground: 'semantic.background.muted',
  tabPadding: 'atomic.spacing.3',
  tabBorderRadius: 'atomic.radius.md'
}
```

**Accessibility:**

- **Role**: `tablist`
- **WCAG**: 2.1 AA
- **ARIA Attributes**: `aria-selected`, `aria-controls`, `aria-labelledby`
- **Keyboard**: Arrow keys, Home, End, Tab

---

### Link

Hyperlink for navigation.

```typescript
const LinkSchema = getComponentSchema('Link');
```

**Props (3):**

- `href`: string (required)
- `external`: boolean (default: false)
- `children`: ReactNode (required)

**Token Bindings (4):**

```typescript
{
  color: 'semantic.foreground.accent',
  hoverColor: 'semantic.foreground.primary',
  textDecoration: 'atomic.typography.body.textDecoration',
  focusRing: 'semantic.border.focus'
}
```

**Accessibility:**

- **Role**: `link`
- **WCAG**: 2.1 AA
- **ARIA Attributes**: `aria-label`, `aria-current`
- **Keyboard**: Enter, Tab

---

### Table

Data table for structured information.

```typescript
const TableSchema = getComponentSchema('Table');
```

**Props (3):**

- `columns`: array (required)
- `data`: array (required)
- `striped`: boolean (default: false)

**Token Bindings (8):**

```typescript
{
  background: 'semantic.surface.primary',
  border: 'semantic.border.default',
  headerBackground: 'semantic.surface.secondary',
  headerForeground: 'semantic.foreground.primary',
  cellForeground: 'semantic.foreground.primary',
  cellPadding: 'atomic.spacing.3',
  stripedBackground: 'semantic.surface.tertiary',
  hoverBackground: 'semantic.background.muted'
}
```

**Accessibility:**

- **Role**: `table`
- **WCAG**: 2.1 AA
- **ARIA Attributes**: `aria-label`, `aria-describedby`
- **Keyboard**: Tab for navigation

---

### List

Ordered or unordered list.

```typescript
const ListSchema = getComponentSchema('List');
```

**Props (2):**

- `items`: array (required)
- `ordered`: boolean (default: false)

**Token Bindings (5):**

```typescript
{
  color: 'semantic.foreground.primary',
  markerColor: 'semantic.foreground.secondary',
  spacing: 'atomic.spacing.2',
  fontSize: 'atomic.typography.body.fontSize',
  lineHeight: 'atomic.typography.body.lineHeight'
}
```

**Accessibility:**

- **Role**: `list`
- **WCAG**: 2.1 AA
- **ARIA Attributes**: `aria-label`

---

### Image

Image display with loading states.

```typescript
const ImageSchema = getComponentSchema('Image');
```

**Props (4):**

- `src`: string (required)
- `alt`: string (required)
- `aspectRatio`: string (default: '16/9')
- `loading`: 'lazy' | 'eager' (default: 'lazy')

**Token Bindings (3):**

```typescript
{
  borderRadius: 'atomic.radius.md',
  background: 'semantic.background.muted',
  placeholderBackground: 'semantic.background.muted'
}
```

**Accessibility:**

- **Role**: `img`
- **WCAG**: 2.1 AA
- **ARIA Attributes**: `alt`, `aria-label`

---

### Form

Form container with validation.

```typescript
const FormSchema = getComponentSchema('Form');
```

**Props (2):**

- `onSubmit`: function (required)
- `children`: ReactNode (required)

**Token Bindings (4):**

```typescript
{
  spacing: 'atomic.spacing.4',
  labelColor: 'semantic.foreground.primary',
  errorColor: 'semantic.border.error',
  helperColor: 'semantic.foreground.muted'
}
```

**Accessibility:**

- **Role**: `form`
- **WCAG**: 2.1 AA
- **ARIA Attributes**: `aria-label`, `aria-describedby`
- **Keyboard**: Tab, Enter for submit

---

### Progress

Progress indicator for loading states.

```typescript
const ProgressSchema = getComponentSchema('Progress');
```

**Props (3):**

- `value`: number (optional, 0-100)
- `indeterminate`: boolean (default: false)
- `size`: 'small' | 'medium' | 'large' (default: 'medium')

**Token Bindings (4):**

```typescript
{
  trackBackground: 'semantic.background.muted',
  fillBackground: 'semantic.foreground.accent',
  height: 'atomic.spacing.{size}',
  borderRadius: 'atomic.radius.full'
}
```

**Accessibility:**

- **Role**: `progressbar`
- **WCAG**: 2.1 AA
- **ARIA Attributes**: `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`

---

## Template Variable Resolution

Component schemas support template variables in token bindings for dynamic token resolution.

### Supported Template Variables

| Variable        | Description             | Example Values                             | Used By                                                       |
| --------------- | ----------------------- | ------------------------------------------ | ------------------------------------------------------------- |
| `{variant}`     | Component style variant | primary, secondary, outline, ghost, danger | Button, Badge, Text, Card                                     |
| `{size}`        | Component size          | small, medium, large, xl                   | Button, Input, Text, Heading, Badge, Avatar, Slider, Progress |
| `{color}`       | Semantic color          | primary, secondary, muted, accent, inverse | Text                                                          |
| `{placement}`   | Placement direction     | top, bottom, left, right                   | Dropdown                                                      |
| `{aspectRatio}` | Image aspect ratio      | 16/9, 4/3, 1/1                             | Image                                                         |

### Template Variable Usage

```typescript
import { getComponentSchema } from 'tekton/core';

const buttonSchema = getComponentSchema('Button');

// Template variable in token binding
console.log(buttonSchema?.tokenBindings.background);
// "component.button.{variant}.background"

// Runtime resolution (pseudo-code)
const variant = 'primary';
const resolvedToken = buttonSchema?.tokenBindings.background.replace('{variant}', variant);
// "component.button.primary.background"
```

### Multi-Variable Templates

Some components use multiple template variables:

```typescript
const textSchema = getComponentSchema('Text');

console.log(textSchema?.tokenBindings.color);
// "semantic.foreground.{color}"

console.log(textSchema?.tokenBindings.fontSize);
// "atomic.typography.{variant}.fontSize"

// Runtime resolution with multiple variables
const color = 'accent';
const variant = 'body';
const resolvedColor = 'semantic.foreground.accent';
const resolvedFontSize = 'atomic.typography.body.fontSize';
```

---

## Usage Patterns

### Dynamic Schema Access

```typescript
import { getComponentSchema, type ComponentSchema } from 'tekton/core';

function renderComponent(componentType: string, props: any) {
  const schema = getComponentSchema(componentType);

  if (!schema) {
    throw new Error(`Unknown component: ${componentType}`);
  }

  // Validate props against schema
  schema.props.forEach(propDef => {
    if (propDef.required && !(propDef.name in props)) {
      throw new Error(`Missing required prop: ${propDef.name}`);
    }
  });

  // Apply token bindings
  const styles = applyTokenBindings(schema.tokenBindings, props);

  // Render component with props and styles
  return createComponent(componentType, props, styles);
}
```

### Schema-Driven Component Generation

```typescript
import { ALL_COMPONENTS } from 'tekton/core';

function generateComponentLibrary() {
  ALL_COMPONENTS.forEach(schema => {
    const componentCode = generateComponentFromSchema(schema);
    writeFile(`components/${schema.type}.tsx`, componentCode);
  });
}

function generateComponentFromSchema(schema: ComponentSchema): string {
  const propsInterface = generatePropsInterface(schema.props);
  const componentBody = generateComponentBody(schema);

  return `
    import React from 'react';

    ${propsInterface}

    export function ${schema.type}(props: ${schema.type}Props) {
      ${componentBody}
    }
  `;
}
```

### Token Binding Resolver

```typescript
import { getComponentSchema } from 'tekton/core';

function resolveTokenBindings(
  componentType: string,
  variant: string,
  size: string
): Record<string, string> {
  const schema = getComponentSchema(componentType);

  if (!schema) {
    throw new Error(`Unknown component: ${componentType}`);
  }

  const resolved: Record<string, string> = {};

  Object.entries(schema.tokenBindings).forEach(([key, tokenPath]) => {
    let resolvedPath = tokenPath;

    // Resolve template variables
    resolvedPath = resolvedPath.replace('{variant}', variant);
    resolvedPath = resolvedPath.replace('{size}', size);

    // Get actual token value from token system
    resolved[key] = getTokenValue(resolvedPath);
  });

  return resolved;
}
```

### Accessibility Validation

```typescript
import { getComponentSchema } from 'tekton/core';

function validateAccessibility(componentType: string, props: any): string[] {
  const schema = getComponentSchema(componentType);
  const errors: string[] = [];

  if (!schema) return errors;

  // Check required ARIA attributes
  schema.a11y.ariaAttributes?.forEach(attr => {
    if (!(attr in props)) {
      errors.push(`Missing required ARIA attribute: ${attr}`);
    }
  });

  // Check WCAG compliance
  if (!schema.a11y.wcag.includes('2.1')) {
    errors.push('Component does not meet WCAG 2.1 standards');
  }

  return errors;
}
```

---

## Related Documentation

- [Schema Validation Module](./schema-validation.md) - Zod validation system
- [Token Generator Module](./README.md#token-generator-module) - Token generation
- [Component Presets Module](./README.md#component-presets-module) - Component presets

---

**Last Updated**: 2026-01-26
**Module Status**: ✅ Production Ready (Phase B Complete)
**Test Coverage**: 97.05%
