# Variant Decision Trees

## Overview

This document describes conditional styling logic for hook configuration options. Each hook can have multiple configuration options (variant, size, disabled, etc.) that modify its appearance and behavior.

## Configuration Option Types

- **boolean**: True/false options (e.g., `disabled`, `toggle`)
- **enum**: Predefined set of values (e.g., `variant: 'primary' | 'secondary' | 'warning' | 'danger'`)
- **string**: Custom string values (e.g., `size: 'sm' | 'md' | 'lg'`)

## Decision Trees by Hook

### useButton

**Configuration Options:**
- `toggle`: boolean - Enables toggle button behavior
- `variant`: enum - Visual style variant
- `disabled`: boolean - Disables the button

**Decision Tree:**

```
useButton
├── toggle = true
│   ├── isSelected = false
│   │   └── Apply: neutral background, neutral text, no border
│   └── isSelected = true
│       └── Apply: primary background, white text, no border
├── variant
│   ├── 'primary'
│   │   └── Apply: primary-500 background, white text
│   ├── 'secondary'
│   │   └── Apply: neutral-200 background, neutral-800 text
│   ├── 'warning'
│   │   └── Apply: warning-500 background, white text
│   └── 'danger'
│       └── Apply: error-500 background, white text
└── disabled = true
    └── Apply: neutral-200 background, neutral-400 text, not-allowed cursor, 0.6 opacity
```

### useTextField

**Configuration Options:**
- `size`: enum - Input field size
- `variant`: enum - Visual style variant
- `disabled`: boolean - Disables the input

**Decision Tree:**

```
useTextField
├── size
│   ├── 'sm'
│   │   └── Apply: spacing-sm padding, font-size-sm
│   ├── 'md'
│   │   └── Apply: spacing-md padding, font-size-base
│   └── 'lg'
│       └── Apply: spacing-lg padding, font-size-lg
├── variant
│   ├── 'outlined'
│   │   └── Apply: border with neutral-300
│   ├── 'filled'
│   │   └── Apply: neutral-100 background, no border
│   └── 'underlined'
│       └── Apply: no border except bottom with neutral-300
└── disabled = true
    └── Apply: neutral-100 background, neutral-400 text, not-allowed cursor
```

### useDialog / useModal

**Configuration Options:**
- `size`: enum - Dialog/modal size

**Decision Tree:**

```
useDialog / useModal
└── size
    ├── 'sm'
    │   └── Apply: max-width 400px
    ├── 'md'
    │   └── Apply: max-width 600px
    ├── 'lg'
    │   └── Apply: max-width 800px
    └── 'xl'
        └── Apply: max-width 1000px
```

### usePopover / useTooltip

**Configuration Options:**
- `placement`: enum - Positioning relative to trigger

**Decision Tree:**

```
usePopover / useTooltip
└── placement
    ├── 'top'
    │   └── Apply: margin-bottom spacing-sm/xs
    ├── 'bottom'
    │   └── Apply: margin-top spacing-sm/xs
    ├── 'left'
    │   └── Apply: margin-right spacing-sm/xs
    └── 'right'
        └── Apply: margin-left spacing-sm/xs
```

### useTabs

**Configuration Options:**
- `orientation`: enum - Tab layout direction
- `variant`: enum - Visual style variant

**Decision Tree:**

```
useTabs
├── orientation
│   ├── 'horizontal'
│   │   └── Apply: flex-direction row
│   └── 'vertical'
│       └── Apply: flex-direction column
└── variant
    ├── 'underlined'
    │   └── Apply: border-bottom with neutral-300
    └── 'enclosed'
        └── Apply: border with neutral-300, border-radius
```

### useProgress

**Configuration Options:**
- `variant`: enum - Progress display type
- `color`: enum - Progress bar color

**Decision Tree:**

```
useProgress
├── variant
│   ├── 'linear'
│   │   └── Apply: 100% width, spacing-sm height
│   └── 'circular'
│       └── Apply: spacing-3xl width, spacing-3xl height
└── color
    ├── 'primary'
    │   └── Apply: primary-500 background
    ├── 'success'
    │   └── Apply: success-500 background
    ├── 'warning'
    │   └── Apply: warning-500 background
    └── 'error'
        └── Apply: error-500 background
```

## Multi-Option Decision Logic

When a hook has multiple configuration options (5+ options), the decision tree becomes more complex. Options are evaluated in this order:

1. **State-based options** (e.g., `disabled`, `toggle`)
2. **Size options** (e.g., `size`)
3. **Variant options** (e.g., `variant`, `color`)
4. **Placement options** (e.g., `placement`)

### Example: useButton with Multiple Options

```typescript
// Configuration
const config = {
  variant: 'warning',
  disabled: true,
  toggle: false,
};

// Evaluation order
1. Check disabled = true → Apply disabled styles
2. Check toggle = false → Skip toggle-specific styles
3. Check variant = 'warning' → Apply warning styles (overridden by disabled)

// Final styles (disabled takes precedence)
{
  background: 'var(--tekton-neutral-200)',
  color: 'var(--tekton-neutral-400)',
  cursor: 'not-allowed',
  opacity: '0.6'
}
```

## CSS Variable Integration

All conditional styles **must** reference Token Contract CSS variables:

**Valid:**
```json
{
  "condition": "variant === 'primary'",
  "cssProperties": {
    "background": "var(--tekton-primary-500)",
    "color": "white"
  }
}
```

**Invalid:**
```json
{
  "condition": "variant === 'primary'",
  "cssProperties": {
    "background": "#3b82f6",  // ❌ Hardcoded value
    "color": "white"
  }
}
```

## AI Prompting Integration

When AI receives a component generation request with configuration options, it should:

1. **Identify the hook**: Extract hook name from prompt keywords
2. **Extract configuration options**: Parse variant, size, disabled, etc.
3. **Load variant branching rules**: Retrieve decision tree for the hook
4. **Evaluate conditions**: Apply rules in precedence order
5. **Generate component**: Create component with resolved styles

### Example AI Prompt Flow

**Prompt:** "Create a large, disabled warning button using useButton"

**Processing:**
1. Hook: `useButton`
2. Options: `{ size: 'lg', disabled: true, variant: 'warning' }`
3. Load variant branching rules for `useButton`
4. Evaluate:
   - `disabled = true` → Apply disabled styles (highest precedence)
   - `variant = 'warning'` → Partially applied (overridden by disabled)
   - `size = 'lg'` → Apply large size styles
5. Generate button with combined styles

**Result:**
```tsx
<button
  {...buttonProps}
  style={{
    background: 'var(--tekton-neutral-200)',  // From disabled
    color: 'var(--tekton-neutral-400)',       // From disabled
    cursor: 'not-allowed',                    // From disabled
    opacity: '0.6',                           // From disabled
    padding: 'var(--tekton-spacing-lg)',      // From size: 'lg'
    fontSize: 'var(--tekton-font-size-lg)',   // From size: 'lg'
  }}
>
  Button Text
</button>
```

## Validation Rules

All variant branching rules must pass these validations:

1. **No hardcoded colors**: All color values must use `var(--tekton-*)` CSS variables
2. **Valid condition syntax**: Conditions must be valid JavaScript expressions
3. **Complete option coverage**: All possible values in `possibleValues` must have style rules
4. **Type consistency**: CSS property values must be strings
5. **Token Contract compliance**: All CSS variables must exist in Token Contract

---

**Last Updated:** 2026-01-17
**Phase:** 3 - Variant Branching System
**Status:** Complete
