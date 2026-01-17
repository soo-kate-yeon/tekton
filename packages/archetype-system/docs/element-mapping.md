# HTML Element Mapping Guide

This document provides comprehensive guidance on HTML element selection for each hook in the Archetype System, ensuring semantic HTML usage and accessibility compliance.

## Overview

The Archetype System maps each headless hook to appropriate HTML elements following these principles:

1. **Semantic HTML First**: Use native HTML elements whenever possible
2. **ARIA Enhancement**: Add ARIA attributes to enhance accessibility, not replace semantics
3. **Progressive Enhancement**: Ensure basic functionality without JavaScript
4. **WCAG 2.1 AA Compliance**: Meet or exceed accessibility standards

## Element Mapping by Category

### Button Components

#### useButton → `<button>`

**Primary Element**: `button`

**Rationale**: Native button element provides built-in keyboard support, focus management, and semantic meaning.

**Structure**:
```jsx
<button {...buttonProps}>{children}</button>
```

**Accessibility**:
- Implicit role: `button`
- Keyboard: Enter, Space (native support)
- Focus: Automatically focusable
- Screen readers: Announces as button

**When to use**:
- Trigger actions (submit forms, open dialogs, toggle states)
- Non-navigation interactions
- Any clickable action that doesn't navigate

**Avoid**:
- Using `div` or `span` with `role="button"` (native button is better)
- Using for links (use `<a>` instead)

---

#### useToggleButton → `<button>`

**Primary Element**: `button` with `aria-pressed`

**Rationale**: Toggle buttons are buttons with persistent state, requiring `aria-pressed` to indicate state.

**Structure**:
```jsx
<button {...buttonProps} aria-pressed={isSelected}>{children}</button>
```

**Accessibility**:
- Explicit ARIA: `aria-pressed="true|false"`
- Keyboard: Enter, Space
- State indication: Required via aria-pressed

**When to use**:
- Bold/Italic/Underline formatting buttons
- Show/Hide panel toggles
- Any two-state button

---

#### useSwitch → `<button>` with `role="switch"`

**Primary Element**: `button` with switch role

**Rationale**: Switches represent on/off states similar to physical switches. Use `role="switch"` to distinguish from toggle buttons.

**Structure**:
```jsx
<button {...inputProps} role="switch" aria-checked={isSelected}>{children}</button>
```

**Accessibility**:
- Explicit role: `switch`
- State attribute: `aria-checked` (not `aria-pressed`)
- Visual indicator: Required to show on/off state

**When to use**:
- Settings toggles (Enable notifications, Dark mode)
- Binary on/off controls
- Similar to physical light switches

**Avoid**:
- Using for multi-select options (use checkbox instead)
- Using for single-select from group (use radio instead)

---

### Form Input Components

#### useCheckbox → `<input type="checkbox">`

**Primary Element**: `input[type="checkbox"]`

**Rationale**: Native checkbox provides all required functionality and semantics.

**Structure**:
```jsx
<input {...inputProps} type="checkbox" />
<label><input {...inputProps} type="checkbox" /> Label text</label>
```

**Accessibility**:
- Implicit role: `checkbox`
- Native state: checked/unchecked/indeterminate
- Label association: Via `<label>` wrapping or `for` attribute

**When to use**:
- Multi-select options
- Single binary choice with explicit opt-in
- Agreement checkboxes

---

#### useRadio → `<input type="radio">`

**Primary Element**: `input[type="radio"]`

**Rationale**: Native radio button for mutually exclusive selections.

**Structure**:
```jsx
<label><input {...inputProps} type="radio" name="group" /> Option 1</label>
<label><input {...inputProps} type="radio" name="group" /> Option 2</label>
```

**Accessibility**:
- Implicit role: `radio`
- Grouping: Required via same `name` attribute
- Keyboard: Arrow keys for navigation within group

**When to use**:
- Mutually exclusive options
- Single selection from group
- When only one choice is allowed

---

#### useTextField → `<input>` with supporting elements

**Primary Element**: `input` (or `textarea` for multiline)

**Rationale**: Native input elements with proper labeling and description associations.

**Structure**:
```jsx
<div>
  <label {...labelProps}>Email</label>
  <input {...inputProps} />
  <div {...descriptionProps}>We'll never share your email</div>
  {isInvalid && <div {...errorMessageProps}>Invalid email format</div>}
</div>
```

**Accessibility**:
- Label: Required via `<label>` element
- Description: `aria-describedby` pointing to description div
- Error messages: `aria-invalid` and `aria-describedby` for error
- Required indication: `aria-required` or `required` attribute

**Composition**:
- **Label** (order 1): Provides accessible name
- **Input** (order 2): Main input field
- **Description** (order 3): Help text
- **Error Message** (order 4): Validation feedback

---

### Dialog and Overlay Components

#### useDialog → `<dialog>`

**Primary Element**: `dialog` (HTML5 element)

**Rationale**: Native dialog element with built-in modal behavior and backdrop support.

**Structure**:
```jsx
<dialog {...dialogProps} aria-labelledby="dialog-title" aria-modal="true">
  <h2 {...titleProps} id="dialog-title">Title</h2>
  <div>{children}</div>
  <button onClick={close}>Close</button>
</dialog>
```

**Accessibility**:
- Implicit role: `dialog`
- Required ARIA: `aria-labelledby`, `aria-modal`
- Focus trap: Required when modal
- Keyboard: Escape to close

**Composition**:
- **Dialog container** (order 1): Main container with backdrop
- **Title** (order 2): Referenced by aria-labelledby
- **Content** (order 3): Dialog body
- **Close button** (order 4): Dismiss action

**Browser Support**: Modern browsers (use polyfill for older browsers)

---

#### useModal → `<div>` with `role="dialog"`

**Primary Element**: `div` with dialog role

**Rationale**: For broader browser support or custom backdrop handling, use div with ARIA.

**Structure**:
```jsx
<div {...modalProps} role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 {...titleProps} id="modal-title">Title</h2>
  <div>{children}</div>
</div>
```

**Accessibility**:
- Explicit role: `dialog`
- Required: `aria-modal="true"` (always true for modals)
- Focus management: Must trap focus within modal
- Backdrop: Prevent interaction with background content

---

#### usePopover → `<div>` with trigger relationship

**Primary Element**: `div` (popover) + `button` (trigger)

**Rationale**: Popovers are non-modal overlays triggered by user action.

**Structure**:
```jsx
<div>
  <button {...triggerProps} aria-expanded={isOpen} aria-haspopup="true" aria-controls="popover-1">
    Show Popover
  </button>
  {isOpen && (
    <div {...popoverProps} id="popover-1" role="dialog">
      {children}
    </div>
  )}
</div>
```

**Accessibility**:
- Trigger ARIA: `aria-expanded`, `aria-haspopup`, `aria-controls`
- Popover: Can use `role="dialog"` or no role for simple popovers
- Keyboard: Escape to close
- Focus: Return to trigger on close

---

#### useTooltip → `<div>` with `role="tooltip"`

**Primary Element**: `div` with tooltip role

**Rationale**: Tooltips provide non-interactive supplementary information.

**Structure**:
```jsx
<div>
  <button {...triggerProps} aria-describedby="tooltip-1">Hover me</button>
  {isOpen && (
    <div {...tooltipProps} role="tooltip" id="tooltip-1">
      Helpful information
    </div>
  )}
</div>
```

**Accessibility**:
- Explicit role: `tooltip`
- Trigger association: `aria-describedby` from trigger
- Non-interactive: Tooltips must not contain interactive elements
- Keyboard: Escape to dismiss

**Important**: Use popover for interactive content, not tooltip.

---

### Navigation Components

#### useTabs → `<div>` with tab roles

**Primary Element**: Container with tablist/tab/tabpanel roles

**Rationale**: Tabs require specific ARIA structure for proper screen reader support.

**Structure**:
```jsx
<div>
  <div {...tabListProps} role="tablist">
    <button {...tabProps(1)} role="tab" aria-selected="true" aria-controls="panel-1">Tab 1</button>
    <button {...tabProps(2)} role="tab" aria-selected="false" aria-controls="panel-2">Tab 2</button>
  </div>
  <div {...tabPanelProps(1)} role="tabpanel" id="panel-1" aria-labelledby="tab-1">Panel 1</div>
  <div {...tabPanelProps(2)} role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>Panel 2</div>
</div>
```

**Accessibility**:
- Roles: `tablist`, `tab`, `tabpanel`
- Tab attributes: `aria-selected`, `aria-controls`
- Panel attributes: `aria-labelledby`
- Keyboard: Arrow keys (horizontal), Home, End

**Composition**:
- **Tab list** (order 1): Container for tab buttons
- **Tab buttons** (order 2): Individual tabs
- **Tab panels** (order 3): Content for each tab

---

#### useBreadcrumbs → `<nav>`

**Primary Element**: `nav` with ordered list

**Rationale**: Breadcrumbs are navigation, requiring nav landmark and ordered list for structure.

**Structure**:
```jsx
<nav {...navProps} aria-label="Breadcrumb">
  <ol {...listProps}>
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li aria-current="page">Product Name</li>
  </ol>
</nav>
```

**Accessibility**:
- Element: `<nav>` for landmark
- ARIA label: `aria-label="Breadcrumb"` to identify purpose
- Current page: `aria-current="page"` on current item
- Structure: Ordered list for hierarchy

---

#### usePagination → `<nav>`

**Primary Element**: `nav` with buttons

**Rationale**: Pagination is navigation requiring nav landmark.

**Structure**:
```jsx
<nav {...paginationProps} aria-label="Pagination">
  <button disabled={currentPage === 1}>Previous</button>
  <button aria-current="page">1</button>
  <button>2</button>
  <button>3</button>
  <button disabled={currentPage === totalPages}>Next</button>
</nav>
```

**Accessibility**:
- ARIA label: `aria-label="Pagination"`
- Current page: `aria-current="page"`
- Disabled state: `disabled` attribute for prev/next

---

### Menu Components

#### useMenu → `<div>` with `role="menu"`

**Primary Element**: Container with menu role

**Rationale**: Menus are application menus (not navigation menus), requiring specific ARIA structure.

**Structure**:
```jsx
<div {...menuProps} role="menu" aria-label="Actions">
  <div {...menuItemProps(1)} role="menuitem">Edit</div>
  <div {...menuItemProps(2)} role="menuitem">Delete</div>
</div>
```

**Accessibility**:
- Roles: `menu`, `menuitem`
- Keyboard: Arrow keys, Home, End, Escape
- Orientation: `aria-orientation` if needed

**Important**: Use `role="menu"` for application menus (like File/Edit). Use nav elements for site navigation.

---

#### useDropdown → `<div>` with trigger

**Primary Element**: Container with button trigger + menu

**Rationale**: Dropdown combines trigger with menu popup.

**Structure**:
```jsx
<div>
  <button {...triggerProps} aria-haspopup="menu" aria-expanded={isOpen}>
    Actions
  </button>
  {isOpen && (
    <div {...menuProps} role="menu">
      {menuItems}
    </div>
  )}
</div>
```

**Accessibility**:
- Trigger ARIA: `aria-haspopup="menu"`, `aria-expanded`
- Menu: Follows useMenu patterns
- Keyboard: Enter/Space to open, Escape to close

---

### Accordion Components

#### useAccordion → `<div>` with button headers

**Primary Element**: Container with button+content pairs

**Rationale**: Accordions use buttons for headers and divs for expandable content.

**Structure**:
```jsx
<div {...accordionProps}>
  <div>
    <button aria-expanded={isExpanded} aria-controls="panel-1">Header 1</button>
    {isExpanded && <div id="panel-1">Content 1</div>}
  </div>
</div>
```

**Accessibility**:
- Button for header: Triggers expansion
- ARIA: `aria-expanded`, `aria-controls`
- Keyboard: Enter/Space to toggle

---

### Data Display Components

#### useTable → `<table>`

**Primary Element**: `table` with semantic structure

**Rationale**: Native table element for tabular data.

**Structure**:
```jsx
<table {...tableProps}>
  <thead>
    <tr><th>Header 1</th><th>Header 2</th></tr>
  </thead>
  <tbody>
    <tr {...rowProps}><td {...cellProps}>Data 1</td><td>Data 2</td></tr>
  </tbody>
</table>
```

**Accessibility**:
- Implicit role: `table`
- Headers: `<th>` for column headers
- Caption: `<caption>` for table description
- Selection: `aria-selected` on rows if selectable

---

#### useProgress → `<div>` with `role="progressbar"`

**Primary Element**: `div` with progressbar role

**Rationale**: Progress bars need ARIA value attributes for screen readers.

**Structure**:
```jsx
<div
  {...progressBarProps}
  role="progressbar"
  aria-valuenow={value}
  aria-valuemin="0"
  aria-valuemax={maxValue}
  aria-label="Upload progress"
>
  <div style={{ width: `${(value / maxValue) * 100}%` }}></div>
</div>
```

**Accessibility**:
- Role: `progressbar`
- Value attributes: Required for screen readers
- Label: `aria-label` to describe what's progressing

---

### Calendar Components

#### useCalendar → `<div>` with `role="application"`

**Primary Element**: Container with application role

**Rationale**: Calendar grids require complex keyboard navigation, warranting application role.

**Structure**:
```jsx
<div {...calendarProps} role="application" aria-label="Choose a date">
  {/* Calendar grid implementation */}
</div>
```

**Accessibility**:
- Role: `application` (tells screen readers to pass through keyboard events)
- Grid cells: `role="gridcell"`
- Selected date: `aria-selected="true"`
- Keyboard: Full arrow key navigation, PageUp/Down for months

**Important**: Application role removes default screen reader navigation. Must provide comprehensive keyboard support.

---

## Element Selection Decision Tree

```
Is it a user action?
├─ Yes, navigation → <a> or <nav>
├─ Yes, action → <button>
└─ No, data display → Semantic element (table, etc.) or <div> with role

Is it a form input?
├─ Single line text → <input>
├─ Multi-line text → <textarea>
├─ Multi-select → <input type="checkbox">
├─ Single-select → <input type="radio">
└─ On/Off toggle → <button role="switch">

Is it an overlay?
├─ Modal (blocking) → <dialog> or <div role="dialog" aria-modal="true">
├─ Non-modal info → <div> with aria-haspopup
└─ Tooltip → <div role="tooltip">

Is it navigation?
├─ Yes → <nav>
└─ No, but menu-like → <div role="menu">
```

## Common Pitfalls to Avoid

### ❌ Don't Use `<div>` When Native Elements Exist

**Wrong**:
```jsx
<div role="button" onClick={handleClick}>Click me</div>
```

**Right**:
```jsx
<button onClick={handleClick}>Click me</button>
```

**Why**: Native elements provide keyboard support, focus management, and semantic meaning for free.

---

### ❌ Don't Use `<a>` for Actions

**Wrong**:
```jsx
<a href="#" onClick={handleAction}>Delete</a>
```

**Right**:
```jsx
<button onClick={handleAction}>Delete</button>
```

**Why**: Links are for navigation. Buttons are for actions.

---

### ❌ Don't Mix Roles and Native Semantics

**Wrong**:
```jsx
<button role="link">Go to page</button>
```

**Right**:
```jsx
<a href="/page">Go to page</a>
```

**Why**: Conflicting semantics confuse assistive technologies.

---

### ❌ Don't Forget Labels for Form Inputs

**Wrong**:
```jsx
<input type="text" placeholder="Email" />
```

**Right**:
```jsx
<label>
  Email
  <input type="text" />
</label>
```

**Why**: Placeholders are not labels. Screen readers need proper labels.

---

## Browser Compatibility Notes

### `<dialog>` Element

- **Support**: Modern browsers (Chrome 37+, Firefox 98+, Safari 15.4+)
- **Fallback**: Use `<div role="dialog">` for older browsers
- **Polyfill**: Available for broader support

### ARIA Support

- **Generally Good**: Most ARIA attributes supported in modern browsers
- **Test**: Always test with actual screen readers (NVDA, JAWS, VoiceOver)

---

## Testing Your Element Choices

### Automated Testing

- **axe-core**: Catches common accessibility issues
- **pa11y**: CLI tool for accessibility testing
- **Lighthouse**: Includes accessibility audit

### Manual Testing

- **Keyboard Only**: Can you use the component without a mouse?
- **Screen Reader**: Does it make sense with NVDA/JAWS/VoiceOver?
- **Zoom**: Does it work at 200% zoom?
- **High Contrast**: Is it usable in high contrast mode?

---

## Additional Resources

- [MDN: HTML Elements Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM: Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Version**: 1.0.0
**Last Updated**: 2026-01-17
**Maintained By**: Tekton Archetype System Team
