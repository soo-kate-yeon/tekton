# Theme Components - Hook-Based Component Generation System

**AI-Optimized Documentation for Single-Prompt Component Generation**

## Quick Start for AI

This document enables AI to generate complete, accessible React components from simple natural language prompts. It consolidates four architectural layers into actionable patterns.

**Usage**: Reference this document when generating components with Tekton headless hooks.

**Target**: AI assistants, code generators, development tools

---

## System Overview

The Component System defines precise mappings from React hooks to complete component implementations following these principles:

1. **Hook Prop Rules (Layer 1)**: Maps hooks → prop objects + base CSS
2. **State-Style Mapping (Layer 2)**: Maps state values → visual feedback
3. **Variant Branching (Layer 3)**: Maps configuration → style variations
4. **Structure Templates (Layer 4)**: Maps hooks → HTML/JSX + ARIA attributes

**Integration**: All layers work together to produce complete, accessible components from minimal input.

---

## Section 1: Hook Prop Rules (Layer 1)

### How to Use

For any hook, apply these base styles to the primary prop object.

### useButton

**Hook Name**: `useButton`

**Prop Objects**: `buttonProps`, `isPressed`

**Base Styles** (apply to `buttonProps`):
```css
background: var(--tekton-primary-500);
color: var(--tekton-neutral-50);
border: var(--tekton-border-width) solid var(--tekton-primary-600);
border-radius: var(--tekton-border-radius);
padding: var(--tekton-spacing-md);
font-size: var(--tekton-font-size-base);
font-weight: var(--tekton-font-weight-medium);
cursor: pointer;
transition: all 150ms ease;
```

**Required CSS Variables**: `--tekton-primary-500`, `--tekton-primary-600`, `--tekton-neutral-50`, `--tekton-border-width`, `--tekton-border-radius`, `--tekton-spacing-md`, `--tekton-font-size-base`, `--tekton-font-weight-medium`

---

### useToggleButton

**Hook Name**: `useToggleButton`

**Prop Objects**: `buttonProps`, `isSelected`

**Base Styles** (apply to `buttonProps`):
```css
background: var(--tekton-neutral-200);
color: var(--tekton-neutral-700);
border: var(--tekton-border-width) solid var(--tekton-neutral-300);
border-radius: var(--tekton-border-radius);
padding: var(--tekton-spacing-md);
font-size: var(--tekton-font-size-base);
cursor: pointer;
transition: all 200ms ease;
```

**Required CSS Variables**: `--tekton-neutral-200`, `--tekton-neutral-300`, `--tekton-neutral-700`, `--tekton-border-width`, `--tekton-border-radius`, `--tekton-spacing-md`, `--tekton-font-size-base`

---

### useTextField

**Hook Name**: `useTextField`

**Prop Objects**: `inputProps`, `labelProps`, `descriptionProps`, `errorMessageProps`, `isInvalid`

**Base Styles**:

For `inputProps`:
```css
background: var(--tekton-neutral-50);
border: var(--tekton-border-width) solid var(--tekton-neutral-300);
border-radius: var(--tekton-border-radius);
padding: var(--tekton-spacing-md);
font-size: var(--tekton-font-size-base);
color: var(--tekton-neutral-900);
```

For `labelProps`:
```css
font-size: var(--tekton-font-size-sm);
font-weight: var(--tekton-font-weight-medium);
color: var(--tekton-neutral-700);
```

---

### useDialog

**Hook Name**: `useDialog`

**Prop Objects**: `dialogProps`, `titleProps`, `isOpen`

**Base Styles**:

For `dialogProps`:
```css
background: var(--tekton-neutral-50);
border-radius: var(--tekton-border-radius-lg);
padding: var(--tekton-spacing-xl);
box-shadow: var(--tekton-shadow-lg);
max-width: 32rem;
```

For `titleProps`:
```css
font-size: var(--tekton-font-size-xl);
font-weight: var(--tekton-font-weight-bold);
color: var(--tekton-neutral-900);
```

---

### useTabs

**Hook Name**: `useTabs`

**Prop Objects**: `tabListProps`, `tabProps`, `tabPanelProps`, `selectedKey`

**Base Styles**:

For `tabListProps`:
```css
display: flex;
border-bottom: var(--tekton-border-width) solid var(--tekton-neutral-300);
```

For `tabProps`:
```css
padding: var(--tekton-spacing-md);
font-size: var(--tekton-font-size-base);
color: var(--tekton-neutral-700);
cursor: pointer;
border-bottom: 2px solid transparent;
```

---

*See [Complete Hook Prop Rules](../src/data/hook-prop-rules.json) for all 20 hooks*

---

## Section 2: State-Style Mapping (Layer 2)

### How to Use

When a state changes, apply these visual feedback styles. All styles use Token Contract CSS variables.

### useButton States

**Hook**: `useButton`

**State**: `isPressed` (boolean)

**Visual Feedback** (when `isPressed === true`):
```css
background: var(--tekton-primary-700);
transform: scale(0.98);
```

---

**State**: `isHovered` (boolean)

**Visual Feedback** (when `isHovered === true`):
```css
background: var(--tekton-primary-600);
box-shadow: var(--tekton-shadow-sm);
```

---

**State**: `isFocused` (boolean)

**Visual Feedback** (when `isFocused === true`):
```css
outline: 2px solid var(--tekton-primary-300);
outline-offset: 2px;
```

---

**State**: `isDisabled` (boolean)

**Visual Feedback** (when `isDisabled === true`):
```css
opacity: 0.5;
cursor: not-allowed;
pointer-events: none;
```

**Transitions**:
- Duration: `150ms`
- Easing: `ease`
- Reduced Motion: `true`

---

### useToggleButton States

**Hook**: `useToggleButton`

**State**: `isSelected` (boolean)

**Visual Feedback** (when `isSelected === true`):
```css
background: var(--tekton-primary-500);
color: var(--tekton-neutral-50);
border-color: var(--tekton-primary-600);
```

---

### useTextField States

**Hook**: `useTextField`

**State**: `isInvalid` (boolean)

**Visual Feedback** (when `isInvalid === true`):
```css
border-color: var(--tekton-error-500);
```

---

**State**: `isFocused` (boolean)

**Visual Feedback** (when `isFocused === true`):
```css
border-color: var(--tekton-primary-500);
outline: 2px solid var(--tekton-primary-300);
outline-offset: 2px;
```

---

*See [Complete State-Style Mapping](../src/data/state-style-mapping.json) for all hooks and states*

---

## Section 3: Variant Branching (Layer 3)

### How to Use

Apply conditional styles based on configuration options. Evaluate conditions and apply matching CSS properties.

### useButton Variants

**Hook**: `useButton`

**Option**: `variant` (enum)

**Possible Values**: `"primary"`, `"secondary"`, `"danger"`

**Style Rules**:

IF `variant === "primary"`:
```css
background: var(--tekton-primary-500);
color: var(--tekton-neutral-50);
border-color: var(--tekton-primary-600);
```

IF `variant === "secondary"`:
```css
background: var(--tekton-neutral-200);
color: var(--tekton-neutral-900);
border-color: var(--tekton-neutral-300);
```

IF `variant === "danger"`:
```css
background: var(--tekton-error-500);
color: var(--tekton-neutral-50);
border-color: var(--tekton-error-600);
```

---

**Option**: `size` (enum)

**Possible Values**: `"sm"`, `"md"`, `"lg"`

**Style Rules**:

IF `size === "sm"`:
```css
padding: var(--tekton-spacing-sm);
font-size: var(--tekton-font-size-sm);
height: var(--tekton-spacing-xl);
```

IF `size === "md"`:
```css
padding: var(--tekton-spacing-md);
font-size: var(--tekton-font-size-base);
height: var(--tekton-spacing-2xl);
```

IF `size === "lg"`:
```css
padding: var(--tekton-spacing-lg);
font-size: var(--tekton-font-size-lg);
height: var(--tekton-spacing-3xl);
```

---

*See [Complete Variant Branching](../src/data/variant-branching.json) for all hooks and options*

---

## Section 4: Layer 4 Structure Templates

### How to Use

Use these JSX patterns and ARIA attributes for complete, accessible components.

### useButton

**HTML Element**: `button`

**JSX Pattern**:
```jsx
<button {...buttonProps}>{children}</button>
```

**ARIA Attributes**:
- `aria-label` (optional): Accessible label for screen readers
- `aria-pressed` (optional): Current pressed state for toggle buttons
- `aria-disabled` (optional): Disabled state indication

**Keyboard Navigation**:
- **Enter**: Activates the button (required)
- **Space**: Activates the button (required)

**WCAG Level**: AA

**Example**:
```jsx
<button {...buttonProps} aria-label="Submit form">Submit</button>
```

---

### useTextField

**HTML Element**: `input`

**JSX Pattern**:
```jsx
<div>
  <label {...labelProps}>{label}</label>
  <input {...inputProps} />
  {description && <div {...descriptionProps}>{description}</div>}
  {isInvalid && <div {...errorMessageProps}>{errorMessage}</div>}
</div>
```

**Nested Structure**:
1. **Label** (`label` element, order 1): Provides accessible label for input
2. **Input** (`input` element, order 2): Main text input field
3. **Description** (`div` element, order 3): Provides help text or description
4. **Error Message** (`div` element, order 4): Displays validation error message

**ARIA Attributes**:
- `aria-label` (optional): Accessible label when no visible label
- `aria-describedby` (optional): References description and error elements
- `aria-invalid` (optional): Indicates validation state
- `aria-required` (optional): Indicates required field

**WCAG Level**: AA

**Example**:
```jsx
<div>
  <label {...labelProps}>Email</label>
  <input {...inputProps} aria-describedby="email-desc email-error" />
  <div {...descriptionProps} id="email-desc">We'll never share your email</div>
  {isInvalid && <div {...errorMessageProps} id="email-error">Invalid email format</div>}
</div>
```

---

### useDialog

**HTML Element**: `dialog`

**JSX Pattern**:
```jsx
<dialog {...dialogProps} aria-labelledby="dialog-title" aria-modal="true">
  <h2 {...titleProps} id="dialog-title">{title}</h2>
  <div>{children}</div>
  <button onClick={close}>Close</button>
</dialog>
```

**Nested Structure**:
1. **Dialog container** (`dialog` element, order 1): Main dialog container
2. **Title** (`h2` element, order 2): Dialog title for aria-labelledby
3. **Content** (`div` element, order 3): Dialog content container
4. **Close button** (`button` element, order 4): Close button for dialog

**ARIA Attributes**:
- `aria-labelledby` (required): References the dialog title element
- `aria-describedby` (optional): References the dialog description element
- `aria-modal` (required): Indicates whether the dialog is modal

**Keyboard Navigation**:
- **Escape**: Closes the dialog (required)
- **Tab**: Cycles focus through dialog elements (required)

**Focus Management**: Trap focus within dialog when open, restore focus to trigger when closed

**WCAG Level**: AA

**Example**:
```jsx
<dialog {...dialogProps} aria-labelledby="confirm-title" aria-modal="true">
  <h2 {...titleProps} id="confirm-title">Confirm Delete</h2>
  <div>Are you sure you want to delete this item?</div>
  <div>
    <button onClick={confirm}>Delete</button>
    <button onClick={close}>Cancel</button>
  </div>
</dialog>
```

**Integration Notes**:
- Often contains useButton for actions
- May use useTextField for input dialogs

---

### useTabs

**HTML Element**: `div`

**JSX Pattern**:
```jsx
<div>
  <div {...tabListProps} role="tablist">
    {tabs.map((tab) => (
      <button {...tabProps(tab.key)} role="tab" aria-selected={selectedKey === tab.key}>
        {tab.label}
      </button>
    ))}
  </div>
  <div {...tabPanelProps} role="tabpanel">{selectedPanel}</div>
</div>
```

**Nested Structure**:
1. **Tab list** (`div` element, order 1): Container for tab buttons
2. **Tab buttons** (`button` element, order 2): Individual tab button
3. **Tab panel** (`div` element, order 3): Content panel for selected tab

**ARIA Attributes**:
- `aria-selected` (required): Indicates selected tab
- `aria-controls` (required): Tab references its panel ID
- `aria-labelledby` (required): Panel references its tab ID

**Keyboard Navigation**:
- **ArrowLeft**: Moves focus to previous tab (required)
- **ArrowRight**: Moves focus to next tab (required)
- **Home**: Moves focus to first tab (required)
- **End**: Moves focus to last tab (required)

**WCAG Level**: AA

**Example**:
```jsx
<div>
  <div {...tabListProps} role="tablist">
    <button {...tabProps('profile')} role="tab" aria-selected={true} aria-controls="profile-panel">
      Profile
    </button>
    <button {...tabProps('settings')} role="tab" aria-selected={false} aria-controls="settings-panel">
      Settings
    </button>
  </div>
  <div {...tabPanelProps} role="tabpanel" id="profile-panel" aria-labelledby="profile-tab">
    Profile content
  </div>
</div>
```

---

*See [Complete Structure Templates](../src/data/structure-templates.json) for all 20 hooks*

---

## Section 5: AI Prompting Examples

These examples demonstrate single-prompt component generation using the component system.

### Simple Examples

#### Example 1: Basic Button

**Prompt**: "Create button using useButton hook with 32px height"

**Expected Output**:
```jsx
import { useButton } from '@tekton/headless-components';

function SubmitButton() {
  const { buttonProps } = useButton();

  return (
    <button
      {...buttonProps}
      style={{
        background: 'var(--tekton-primary-500)',
        color: 'var(--tekton-neutral-50)',
        border: 'var(--tekton-border-width) solid var(--tekton-primary-600)',
        borderRadius: 'var(--tekton-border-radius)',
        padding: 'var(--tekton-spacing-md)',
        fontSize: 'var(--tekton-font-size-base)',
        fontWeight: 'var(--tekton-font-weight-medium)',
        cursor: 'pointer',
        transition: 'all 150ms ease',
        height: 'var(--tekton-spacing-2xl)' // 32px
      }}
    >
      Submit
    </button>
  );
}
```

**Layer Application**:
- Layer 1 (Hook Prop Rules): Applied base styles from useButton
- Layer 3 (Variant Branching): Applied `size="md"` variant (default 32px)
- Layer 4 (Structure Templates): Used `<button {...buttonProps}>{children}</button>` pattern

---

#### Example 2: Toggle Button with Primary Variant

**Prompt**: "Create toggle button with primary variant"

**Expected Output**:
```jsx
import { useToggleButton } from '@tekton/headless-components';

function ToggleNotifications() {
  const { buttonProps, isSelected } = useToggleButton({
    variant: 'primary'
  });

  return (
    <button
      {...buttonProps}
      aria-pressed={isSelected}
      style={{
        // Layer 2: Base styles when not selected
        background: isSelected
          ? 'var(--tekton-primary-500)' // Layer 2: State styles
          : 'var(--tekton-neutral-200)',
        color: isSelected
          ? 'var(--tekton-neutral-50)'
          : 'var(--tekton-neutral-700)',
        border: `var(--tekton-border-width) solid ${
          isSelected ? 'var(--tekton-primary-600)' : 'var(--tekton-neutral-300)'
        }`,
        borderRadius: 'var(--tekton-border-radius)',
        padding: 'var(--tekton-spacing-md)',
        fontSize: 'var(--tekton-font-size-base)',
        cursor: 'pointer',
        transition: 'all 200ms ease'
      }}
    >
      {isSelected ? 'Notifications On' : 'Notifications Off'}
    </button>
  );
}
```

**Layer Application**:
- Layer 1: Base styles from useToggleButton
- Layer 2: State styles for `isSelected` state
- Layer 3: Primary variant colors
- Layer 4: ARIA `aria-pressed` attribute

---

### Complex Examples

#### Example 3: Dialog with Primary Action Button and Cancel Button

**Prompt**: "Create dialog with primary action button and cancel button"

**Expected Output**:
```jsx
import { useDialog } from '@tekton/headless-components';
import { useButton } from '@tekton/headless-components';

function ConfirmDialog({ onConfirm, onCancel }) {
  const { dialogProps, titleProps, isOpen, close } = useDialog();

  const { buttonProps: confirmProps } = useButton({
    variant: 'primary',
    onPress: () => {
      onConfirm();
      close();
    }
  });

  const { buttonProps: cancelProps } = useButton({
    variant: 'secondary',
    onPress: () => {
      onCancel?.();
      close();
    }
  });

  return (
    <dialog
      {...dialogProps}
      aria-labelledby="confirm-dialog-title"
      aria-modal="true"
      style={{
        background: 'var(--tekton-neutral-50)',
        borderRadius: 'var(--tekton-border-radius-lg)',
        padding: 'var(--tekton-spacing-xl)',
        boxShadow: 'var(--tekton-shadow-lg)',
        maxWidth: '32rem'
      }}
    >
      <h2
        {...titleProps}
        id="confirm-dialog-title"
        style={{
          fontSize: 'var(--tekton-font-size-xl)',
          fontWeight: 'var(--tekton-font-weight-bold)',
          color: 'var(--tekton-neutral-900)'
        }}
      >
        Confirm Action
      </h2>

      <div>Are you sure you want to proceed with this action?</div>

      <div style={{ display: 'flex', gap: 'var(--tekton-spacing-md)', marginTop: 'var(--tekton-spacing-lg)' }}>
        <button
          {...cancelProps}
          style={{
            background: 'var(--tekton-neutral-200)',
            color: 'var(--tekton-neutral-900)',
            border: 'var(--tekton-border-width) solid var(--tekton-neutral-300)',
            borderRadius: 'var(--tekton-border-radius)',
            padding: 'var(--tekton-spacing-md)',
            fontSize: 'var(--tekton-font-size-base)',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          {...confirmProps}
          style={{
            background: 'var(--tekton-primary-500)',
            color: 'var(--tekton-neutral-50)',
            border: 'var(--tekton-border-width) solid var(--tekton-primary-600)',
            borderRadius: 'var(--tekton-border-radius)',
            padding: 'var(--tekton-spacing-md)',
            fontSize: 'var(--tekton-font-size-base)',
            cursor: 'pointer'
          }}
        >
          Confirm
        </button>
      </div>
    </dialog>
  );
}
```

**Layer Application**:
- useDialog: Layer 1 (base styles) + Layer 4 (nested structure pattern)
- useButton (×2): Layer 1 (base styles) + Layer 3 (variant branching for primary/secondary)
- Proper ARIA attributes from Layer 4
- Focus management and Escape key handling

---

#### Example 4: Tabs Component with 3 Tabs

**Prompt**: "Create tabs component with 3 tabs"

**Expected Output**:
```jsx
import { useTabs } from '@tekton/headless-components';

function SettingsTabs() {
  const { tabListProps, tabProps, tabPanelProps, selectedKey } = useTabs({
    defaultSelectedKey: 'profile'
  });

  const tabs = [
    { key: 'profile', label: 'Profile', content: 'Profile settings content' },
    { key: 'security', label: 'Security', content: 'Security settings content' },
    { key: 'notifications', label: 'Notifications', content: 'Notification preferences' }
  ];

  return (
    <div>
      <div
        {...tabListProps}
        role="tablist"
        style={{
          display: 'flex',
          borderBottom: 'var(--tekton-border-width) solid var(--tekton-neutral-300)'
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            {...tabProps(tab.key)}
            role="tab"
            aria-selected={selectedKey === tab.key}
            aria-controls={`panel-${tab.key}`}
            style={{
              padding: 'var(--tekton-spacing-md)',
              fontSize: 'var(--tekton-font-size-base)',
              color: 'var(--tekton-neutral-700)',
              cursor: 'pointer',
              borderBottom: `2px solid ${
                selectedKey === tab.key ? 'var(--tekton-primary-500)' : 'transparent'
              }`,
              background: 'transparent',
              border: 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.key}
          {...tabPanelProps(tab.key)}
          role="tabpanel"
          id={`panel-${tab.key}`}
          aria-labelledby={`tab-${tab.key}`}
          hidden={selectedKey !== tab.key}
          style={{ padding: 'var(--tekton-spacing-lg)' }}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
```

**Layer Application**:
- Layer 1: Base styles for tabListProps and tabProps
- Layer 2: State styles for selected tab (border-bottom color)
- Layer 4: Nested structure with ARIA (tablist, tab, tabpanel roles)
- Keyboard navigation (arrow keys) from Layer 4

---

### Multi-Component Examples

#### Example 5: Form with Text Field, Checkbox, and Submit Button

**Prompt**: "Create form with text field, checkbox, and submit button"

**Expected Output**:
```jsx
import { useTextField } from '@tekton/headless-components';
import { useCheckbox } from '@tekton/headless-components';
import { useButton } from '@tekton/headless-components';

function SubscriptionForm() {
  const {
    inputProps: emailInputProps,
    labelProps: emailLabelProps,
    descriptionProps: emailDescProps,
    errorMessageProps: emailErrorProps,
    isInvalid: emailInvalid
  } = useTextField({
    name: 'email',
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  });

  const { inputProps: agreeProps, isSelected: agreedToTerms } = useCheckbox();

  const { buttonProps } = useButton({
    type: 'submit',
    isDisabled: emailInvalid || !agreedToTerms
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); /* handle submit */ }}>
      <div style={{ marginBottom: 'var(--tekton-spacing-lg)' }}>
        <label
          {...emailLabelProps}
          style={{
            fontSize: 'var(--tekton-font-size-sm)',
            fontWeight: 'var(--tekton-font-weight-medium)',
            color: 'var(--tekton-neutral-700)',
            display: 'block',
            marginBottom: 'var(--tekton-spacing-sm)'
          }}
        >
          Email Address
        </label>
        <input
          {...emailInputProps}
          type="email"
          style={{
            background: 'var(--tekton-neutral-50)',
            border: `var(--tekton-border-width) solid ${
              emailInvalid ? 'var(--tekton-error-500)' : 'var(--tekton-neutral-300)'
            }`,
            borderRadius: 'var(--tekton-border-radius)',
            padding: 'var(--tekton-spacing-md)',
            fontSize: 'var(--tekton-font-size-base)',
            color: 'var(--tekton-neutral-900)',
            width: '100%'
          }}
        />
        <div
          {...emailDescProps}
          style={{
            fontSize: 'var(--tekton-font-size-sm)',
            color: 'var(--tekton-neutral-600)',
            marginTop: 'var(--tekton-spacing-xs)'
          }}
        >
          We'll send updates to this email
        </div>
        {emailInvalid && (
          <div
            {...emailErrorProps}
            style={{
              fontSize: 'var(--tekton-font-size-sm)',
              color: 'var(--tekton-error-500)',
              marginTop: 'var(--tekton-spacing-xs)'
            }}
          >
            Please enter a valid email address
          </div>
        )}
      </div>

      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--tekton-spacing-sm)',
          marginBottom: 'var(--tekton-spacing-lg)',
          cursor: 'pointer'
        }}
      >
        <input
          {...agreeProps}
          type="checkbox"
          style={{
            width: 'var(--tekton-spacing-lg)',
            height: 'var(--tekton-spacing-lg)',
            cursor: 'pointer'
          }}
        />
        <span style={{ fontSize: 'var(--tekton-font-size-sm)' }}>
          I agree to receive email updates
        </span>
      </label>

      <button
        {...buttonProps}
        style={{
          background: 'var(--tekton-primary-500)',
          color: 'var(--tekton-neutral-50)',
          border: 'var(--tekton-border-width) solid var(--tekton-primary-600)',
          borderRadius: 'var(--tekton-border-radius)',
          padding: 'var(--tekton-spacing-md)',
          fontSize: 'var(--tekton-font-size-base)',
          fontWeight: 'var(--tekton-font-weight-medium)',
          cursor: 'pointer',
          opacity: emailInvalid || !agreedToTerms ? 0.5 : 1,
          pointerEvents: emailInvalid || !agreedToTerms ? 'none' : 'auto'
        }}
      >
        Subscribe
      </button>
    </form>
  );
}
```

**Layer Application**:
- useTextField: Layer 1 (base + label styles) + Layer 2 (invalid state) + Layer 4 (nested structure)
- useCheckbox: Layer 1 (base styles) + Layer 4 (checkbox pattern)
- useButton: Layer 1 (base styles) + Layer 2 (disabled state)
- Coordinated validation: Button disabled when email invalid or checkbox unchecked

---

## Section 6: Token Contract Integration

### CSS Variable Naming Convention

All component styles reference Token Contract CSS variables using this pattern:

**Format**: `var(--tekton-{category}-{variant})`

**Categories**:
- **primary**: Primary brand colors (500, 600, 700, etc.)
- **neutral**: Neutral grays (50, 100, 200, ..., 900)
- **error**: Error/danger colors
- **warning**: Warning colors
- **success**: Success colors

**Property Types**:
- **spacing**: `--tekton-spacing-{size}` (xs, sm, md, lg, xl, 2xl, 3xl)
- **border-radius**: `--tekton-border-radius{-size}` (sm, md, lg)
- **shadow**: `--tekton-shadow-{size}` (sm, md, lg)
- **font-size**: `--tekton-font-size-{size}` (xs, sm, base, lg, xl, 2xl)
- **font-weight**: `--tekton-font-weight-{weight}` (light, normal, medium, semibold, bold)

### Theme Usage

**DO**: Always use Token Contract variables
```css
background: var(--tekton-primary-500);
padding: var(--tekton-spacing-md);
```

**DON'T**: Never use hardcoded values
```css
background: #3b82f6; /* ❌ Wrong */
padding: 16px; /* ❌ Wrong */
```

### Dark Mode Handling

Token Contract automatically handles dark mode through CSS variable reassignment. No conditional logic needed in components:

```jsx
// ✅ Automatically adapts to dark mode
<button style={{ background: 'var(--tekton-primary-500)' }}>
  Click me
</button>

// ❌ Don't check theme manually
<button style={{ background: isDark ? '#1e40af' : '#3b82f6' }}>
  Click me
</button>
```

---

## Quick Decision Tree for AI

```
1. Which hook should I use?
   ├─ Button action → useButton
   ├─ Toggle state → useToggleButton or useSwitch
   ├─ Form input → useTextField, useCheckbox, useRadio
   ├─ Modal overlay → useDialog or useModal
   ├─ Tabs → useTabs
   └─ Menu → useMenu or useDropdown

2. What styles should I apply?
   ├─ Step 1: Apply Layer 1 (Hook Prop Rules) base styles
   ├─ Step 2: Apply Layer 3 (Variant Branching) if variant specified
   ├─ Step 3: Apply Layer 2 (State-Style Mapping) for state changes
   └─ Step 4: Use Layer 4 (Structure Templates) for JSX pattern

3. What ARIA attributes do I need?
   └─ Refer to Layer 4 (Structure Templates) accessibility section

4. How do I compose multiple hooks?
   └─ See Section 5 examples (particularly Example 5: Form)
```

---

## Validation Checklist for Generated Components

When generating components, verify:

- ✅ All hook props spread correctly (`{...hookProps}`)
- ✅ All styles use Token Contract CSS variables
- ✅ Required ARIA attributes present (from Layer 4)
- ✅ Keyboard navigation supported (from Layer 4)
- ✅ State visual feedback applied (from Layer 2)
- ✅ Variant styles applied if specified (from Layer 3)
- ✅ Nested structure follows Layer 4 patterns
- ✅ No hardcoded colors or spacing values

---

## Common Pitfalls to Avoid

### ❌ Incorrect: Missing Prop Spread
```jsx
<button onClick={buttonProps.onClick}>Click me</button>
```

### ✅ Correct: Always Spread Props
```jsx
<button {...buttonProps}>Click me</button>
```

---

### ❌ Incorrect: Hardcoded Values
```jsx
<button style={{ padding: '12px', background: '#3b82f6' }}>Click</button>
```

### ✅ Correct: Token Contract Variables
```jsx
<button style={{
  padding: 'var(--tekton-spacing-md)',
  background: 'var(--tekton-primary-500)'
}}>Click</button>
```

---

### ❌ Incorrect: Missing ARIA Attributes
```jsx
<dialog {...dialogProps}>
  <h2>Title</h2>
  <div>Content</div>
</dialog>
```

### ✅ Correct: Required ARIA Attributes
```jsx
<dialog {...dialogProps} aria-labelledby="dialog-title" aria-modal="true">
  <h2 id="dialog-title">Title</h2>
  <div>Content</div>
</dialog>
```

---

### ❌ Incorrect: Ignoring State Styles
```jsx
<button {...buttonProps} style={{ background: 'var(--tekton-primary-500)' }}>
  Toggle
</button>
```

### ✅ Correct: Apply State Styles
```jsx
<button
  {...buttonProps}
  style={{
    background: isSelected
      ? 'var(--tekton-primary-500)'
      : 'var(--tekton-neutral-200)'
  }}
>
  Toggle
</button>
```

---

## Additional Resources

### Documentation Files
- [Hook Prop Rules](../src/data/hook-prop-rules.json): Complete Layer 1 mappings
- [State-Style Mapping](../src/data/state-style-mapping.json): Complete Layer 2 mappings
- [Variant Branching](../src/data/variant-branching.json): Complete Layer 3 mappings
- [Structure Templates](../src/data/structure-templates.json): Complete Layer 4 mappings
- [Element Mapping Guide](./element-mapping.md): HTML element selection guide
- [Composition Patterns](./composition-patterns.md): Complex component patterns

### External Standards
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/): Official ARIA patterns
- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=aaa): Accessibility standards
- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA): ARIA reference

---

## Version Information

**Document Version**: 1.0.0
**Last Updated**: 2026-01-17
**System Version**: Component System v1.0.0
**Maintained By**: Tekton Component System Team

**Changelog**:
- v1.0.0 (2026-01-17): Initial release with all 4 layers consolidated
- Includes 20 hooks with complete component mappings
- AI prompting examples for simple to complex components
- Full Token Contract integration

---

**End of Document**

This document enables AI to generate production-ready, accessible React components from minimal natural language prompts. All generated code follows Tekton design system standards and WCAG 2.1 AA accessibility guidelines.
