# Composition Patterns Guide

This document explains how to compose complex components from multiple hooks in the Component System, covering nested structures, hook combinations, and common patterns.

## Overview

Complex UI components often require multiple hooks working together. This guide demonstrates:

1. **Hook Composition**: Combining multiple hooks in a single component
2. **Nested Structures**: Hooks that contain other components
3. **Common Patterns**: Reusable composition strategies
4. **Integration Guidelines**: How hooks interact with each other

## Core Composition Principles

### 1. Single Responsibility

Each hook should handle one primary concern:

```jsx
// ❌ Don't combine unrelated concerns in props
const { buttonProps, modalProps, formProps } = useEverything();

// ✅ Use separate hooks for separate concerns
const { buttonProps } = useButton();
const { modalProps } = useModal();
const { formProps } = useForm();
```

### 2. Prop Spreading

Always use prop spreading to apply hook props to elements:

```jsx
// ✅ Spread hook props
<button {...buttonProps}>Click me</button>

// ❌ Don't manually copy props
<button onClick={buttonProps.onClick} onKeyDown={buttonProps.onKeyDown}>
  Click me
</button>
```

### 3. Composition over Configuration

Prefer composing hooks over complex configuration:

```jsx
// ✅ Compose multiple simple hooks
function ConfirmDialog() {
  const { dialogProps } = useDialog();
  const { buttonProps: confirmProps } = useButton({ variant: 'primary' });
  const { buttonProps: cancelProps } = useButton({ variant: 'secondary' });

  return (
    <dialog {...dialogProps}>
      <button {...confirmProps}>Confirm</button>
      <button {...cancelProps}>Cancel</button>
    </dialog>
  );
}
```

## Nested Structure Patterns

### Pattern 1: Form with Multiple Inputs

**Composition**: useTextField + useButton + useCheckbox

```jsx
function RegistrationForm() {
  const {
    inputProps: emailProps,
    labelProps: emailLabelProps,
    errorMessageProps: emailErrorProps,
    isInvalid: emailInvalid
  } = useTextField({
    name: 'email',
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  });

  const {
    inputProps: passwordProps,
    labelProps: passwordLabelProps,
    errorMessageProps: passwordErrorProps,
    isInvalid: passwordInvalid
  } = useTextField({
    name: 'password',
    type: 'password',
    validate: (value) => value.length >= 8
  });

  const { inputProps: agreeProps, isSelected } = useCheckbox();

  const { buttonProps } = useButton({
    onPress: handleSubmit,
    isDisabled: !isSelected || emailInvalid || passwordInvalid
  });

  return (
    <form>
      <div>
        <label {...emailLabelProps}>Email</label>
        <input {...emailProps} />
        {emailInvalid && <div {...emailErrorProps}>Invalid email</div>}
      </div>

      <div>
        <label {...passwordLabelProps}>Password</label>
        <input {...passwordProps} />
        {passwordInvalid && <div {...passwordErrorProps}>Min 8 characters</div>}
      </div>

      <label>
        <input {...agreeProps} />
        I agree to the terms
      </label>

      <button {...buttonProps}>Register</button>
    </form>
  );
}
```

**Pattern Structure**:
- Multiple `useTextField` instances for different inputs
- `useCheckbox` for agreement
- `useButton` with disabled state based on validation
- Form wrapper coordinates all inputs

**Key Points**:
- Each field has independent validation
- Button disabled state depends on all fields
- Unique names for each field

---

### Pattern 2: Dialog with Actions

**Composition**: useDialog + useButton (multiple instances)

```jsx
function ConfirmDeleteDialog({ itemName, onConfirm, onCancel }) {
  const { dialogProps, titleProps, isOpen, close } = useDialog();

  const { buttonProps: deleteButtonProps, isPressed: isDeleting } = useButton({
    variant: 'danger',
    onPress: async () => {
      await onConfirm();
      close();
    }
  });

  const { buttonProps: cancelButtonProps } = useButton({
    variant: 'secondary',
    onPress: () => {
      onCancel?.();
      close();
    }
  });

  return (
    <dialog {...dialogProps} aria-labelledby="delete-dialog-title" aria-modal="true">
      <h2 {...titleProps} id="delete-dialog-title">
        Confirm Delete
      </h2>

      <p>Are you sure you want to delete "{itemName}"? This action cannot be undone.</p>

      <div className="dialog-actions">
        <button {...cancelButtonProps}>Cancel</button>
        <button {...deleteButtonProps} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </dialog>
  );
}
```

**Nested Structure**:
1. Dialog container (useDialog)
2. Title element (titleProps)
3. Content paragraph
4. Action buttons (useButton × 2)

**Integration Points**:
- Dialog manages open/close state
- Buttons trigger dialog close after actions
- Loading state on delete button
- Cancel button always available

---

### Pattern 3: Tabs with Content Panels

**Composition**: useTabs + Content per panel

```jsx
function SettingsTabs() {
  const { tabListProps, tabProps, tabPanelProps, selectedKey } = useTabs({
    defaultSelectedKey: 'profile'
  });

  return (
    <div>
      <div {...tabListProps} role="tablist">
        <button
          {...tabProps('profile')}
          role="tab"
          aria-selected={selectedKey === 'profile'}
          aria-controls="profile-panel"
        >
          Profile
        </button>
        <button
          {...tabProps('security')}
          role="tab"
          aria-selected={selectedKey === 'security'}
          aria-controls="security-panel"
        >
          Security
        </button>
        <button
          {...tabProps('notifications')}
          role="tab"
          aria-selected={selectedKey === 'notifications'}
          aria-controls="notifications-panel"
        >
          Notifications
        </button>
      </div>

      <div
        {...tabPanelProps('profile')}
        role="tabpanel"
        id="profile-panel"
        hidden={selectedKey !== 'profile'}
      >
        <ProfileSettings />
      </div>

      <div
        {...tabPanelProps('security')}
        role="tabpanel"
        id="security-panel"
        hidden={selectedKey !== 'security'}
      >
        <SecuritySettings />
      </div>

      <div
        {...tabPanelProps('notifications')}
        role="tabpanel"
        id="notifications-panel"
        hidden={selectedKey !== 'notifications'}
      >
        <NotificationSettings />
      </div>
    </div>
  );
}
```

**Nested Structure**:
1. Tab list container
2. Tab buttons (one per tab)
3. Tab panels (one per tab, conditionally visible)

**Key Points**:
- Each panel can contain complex nested components
- Panels often compose additional hooks internally
- `hidden` attribute for inactive panels (accessibility)

---

### Pattern 4: Dropdown Menu with Items

**Composition**: useDropdown + useMenu + useButton (trigger)

```jsx
function ActionsDropdown({ item }) {
  const {
    triggerProps,
    menuProps,
    isOpen,
    close
  } = useDropdown();

  const { menuItemProps } = useMenu({
    onAction: (key) => {
      handleAction(key, item);
      close();
    }
  });

  return (
    <div>
      <button
        {...triggerProps}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        Actions
      </button>

      {isOpen && (
        <div {...menuProps} role="menu">
          <div {...menuItemProps('edit')} role="menuitem">
            Edit
          </div>
          <div {...menuItemProps('duplicate')} role="menuitem">
            Duplicate
          </div>
          <div {...menuItemProps('delete')} role="menuitem">
            Delete
          </div>
        </div>
      )}
    </div>
  );
}
```

**Nested Structure**:
1. Trigger button (useDropdown.triggerProps)
2. Menu container (useMenu)
3. Menu items (useMenu.menuItemProps)

**Accessibility Integration**:
- Trigger announces `aria-haspopup="menu"`
- Trigger announces `aria-expanded` state
- Menu has `role="menu"`
- Items have `role="menuitem"`

---

### Pattern 5: Accordion with Multiple Sections

**Composition**: useAccordion + Content per section

```jsx
function FAQ() {
  const { accordionProps, itemProps, isExpanded } = useAccordion({
    allowMultiple: true
  });

  const faqs = [
    { id: '1', question: 'What is this?', answer: 'This is an FAQ.' },
    { id: '2', question: 'How does it work?', answer: 'It works like this.' },
    { id: '3', question: 'Where can I learn more?', answer: 'Visit our docs.' }
  ];

  return (
    <div {...accordionProps}>
      {faqs.map((faq) => (
        <div key={faq.id}>
          <button
            {...itemProps(faq.id).buttonProps}
            aria-expanded={isExpanded(faq.id)}
            aria-controls={`panel-${faq.id}`}
          >
            {faq.question}
          </button>
          {isExpanded(faq.id) && (
            <div id={`panel-${faq.id}`}>
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

**Nested Structure**:
1. Accordion container
2. Items (button + panel pairs)
3. Conditional content panels

---

### Pattern 6: Table with Pagination

**Composition**: useTable + usePagination

```jsx
function DataTable({ data, pageSize = 10 }) {
  const { tableProps, rowProps, cellProps, selectedKeys } = useTable({
    selectionMode: 'multiple'
  });

  const {
    paginationProps,
    currentPage,
    totalPages,
    paginatedData
  } = usePagination({
    data,
    pageSize
  });

  return (
    <div>
      <table {...tableProps}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row) => (
            <tr {...rowProps(row.id)} key={row.id}>
              <td {...cellProps}>{row.name}</td>
              <td {...cellProps}>{row.email}</td>
              <td {...cellProps}>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav {...paginationProps} aria-label="Pagination">
        <button disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage === totalPages}>Next</button>
      </nav>
    </div>
  );
}
```

**Integration**:
- Table displays current page data
- Pagination controls page navigation
- Both hooks work with same data source

---

## Advanced Composition Patterns

### Pattern 7: Modal Form with Validation

**Composition**: useModal + useTextField (multiple) + useButton

```jsx
function EditUserModal({ user, onSave, onClose }) {
  const { modalProps, titleProps, isOpen } = useModal();

  const [formData, setFormData] = useState(user);
  const [errors, setErrors] = useState({});

  const { inputProps: nameProps, labelProps: nameLabelProps } = useTextField({
    value: formData.name,
    onChange: (value) => setFormData({ ...formData, name: value })
  });

  const { inputProps: emailProps, labelProps: emailLabelProps } = useTextField({
    value: formData.email,
    onChange: (value) => setFormData({ ...formData, email: value })
  });

  const { buttonProps: saveButtonProps } = useButton({
    onPress: () => {
      if (validate(formData)) {
        onSave(formData);
        onClose();
      }
    }
  });

  const { buttonProps: cancelButtonProps } = useButton({
    variant: 'secondary',
    onPress: onClose
  });

  return (
    <div {...modalProps} role="dialog" aria-modal="true" aria-labelledby="edit-user-title">
      <h2 {...titleProps} id="edit-user-title">Edit User</h2>

      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label {...nameLabelProps}>Name</label>
          <input {...nameProps} />
        </div>

        <div>
          <label {...emailLabelProps}>Email</label>
          <input {...emailProps} />
        </div>

        <div className="modal-actions">
          <button {...cancelButtonProps}>Cancel</button>
          <button {...saveButtonProps}>Save</button>
        </div>
      </form>
    </div>
  );
}
```

**Complexity Factors**:
- Modal manages overlay state
- Multiple text fields with validation
- Form state coordination
- Action buttons with different variants

---

### Pattern 8: Popover with Interactive Content

**Composition**: usePopover + useButton (trigger) + useMenu (content)

```jsx
function FilterPopover({ filters, onApplyFilters }) {
  const { popoverProps, triggerProps, isOpen, close } = usePopover();

  const [selectedFilters, setSelectedFilters] = useState(filters);

  const { buttonProps: triggerButtonProps } = useButton();

  const { buttonProps: applyButtonProps } = useButton({
    onPress: () => {
      onApplyFilters(selectedFilters);
      close();
    }
  });

  return (
    <div>
      <button
        {...triggerProps}
        {...triggerButtonProps}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        Filters
      </button>

      {isOpen && (
        <div {...popoverProps} role="dialog">
          <h3>Filter Options</h3>

          {/* Filter checkboxes */}
          <FilterCheckboxes
            selected={selectedFilters}
            onChange={setSelectedFilters}
          />

          <button {...applyButtonProps}>Apply</button>
        </div>
      )}
    </div>
  );
}
```

**Key Differences from Tooltip**:
- Popovers can contain interactive elements (buttons, checkboxes)
- Tooltips must be non-interactive
- Use `role="dialog"` for popovers with interactivity

---

### Pattern 9: Breadcrumbs with Dropdown

**Composition**: useBreadcrumbs + useDropdown (for collapsed items)

```jsx
function SmartBreadcrumbs({ items }) {
  const { navProps, listProps, itemProps } = useBreadcrumbs();

  const visibleItems = items.length > 4
    ? [items[0], '...', ...items.slice(-2)]
    : items;

  const collapsedItems = items.slice(1, -2);

  return (
    <nav {...navProps} aria-label="Breadcrumb">
      <ol {...listProps}>
        {visibleItems.map((item, index) => {
          if (item === '...') {
            return (
              <li key="collapsed">
                <CollapsedBreadcrumbsDropdown items={collapsedItems} />
              </li>
            );
          }

          return (
            <li {...itemProps} key={item.href}>
              {index === visibleItems.length - 1 ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <a href={item.href}>{item.label}</a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
```

---

### Pattern 10: Calendar with Date Range Selection

**Composition**: useRangeCalendar + Custom date logic

```jsx
function DateRangePicker({ onChange }) {
  const {
    calendarProps,
    startDate,
    endDate,
    selectDate
  } = useRangeCalendar({
    onChange: (range) => onChange(range)
  });

  return (
    <div>
      <div {...calendarProps} role="application" aria-label="Choose date range">
        <CalendarGrid
          onSelectDate={selectDate}
          startDate={startDate}
          endDate={endDate}
        />
      </div>

      {startDate && endDate && (
        <div aria-live="polite">
          Selected: {formatDate(startDate)} - {formatDate(endDate)}
        </div>
      )}
    </div>
  );
}
```

---

## Common Integration Patterns

### 1. Trigger + Overlay Pattern

Used by: usePopover, useDropdown, useTooltip, useMenu

```jsx
<div>
  <button {...triggerProps} aria-expanded={isOpen}>Trigger</button>
  {isOpen && <div {...overlayProps}>Content</div>}
</div>
```

**Key Points**:
- Conditional rendering based on `isOpen`
- `aria-expanded` on trigger
- Focus management on open/close

---

### 2. Container + Items Pattern

Used by: useTabs, useMenu, useAccordion, useBreadcrumbs

```jsx
<div {...containerProps}>
  {items.map(item => (
    <div {...itemProps(item.key)} key={item.key}>
      {item.content}
    </div>
  ))}
</div>
```

**Key Points**:
- Map over data to create items
- Unique keys for each item
- Item props function receives identifier

---

### 3. Label + Input Pattern

Used by: useTextField, useCheckbox, useRadio, useSwitch

```jsx
<label>
  <span {...labelProps}>Label Text</span>
  <input {...inputProps} />
</label>
```

**Key Points**:
- Label wrapping or `for` attribute
- Description and error associations
- Validation state indication

---

## Composition Anti-Patterns

### ❌ Tight Coupling

```jsx
// Don't tightly couple hooks
function BadDialog() {
  const everything = useDialogWithButtonsAndForm(); // Too much in one hook
}
```

### ✅ Loose Coupling

```jsx
// Compose independent hooks
function GoodDialog() {
  const { dialogProps } = useDialog();
  const { buttonProps } = useButton();
  const { formProps } = useForm();
}
```

---

### ❌ Prop Drilling

```jsx
// Don't pass all props down manually
<CustomButton
  onClick={buttonProps.onClick}
  onKeyDown={buttonProps.onKeyDown}
  disabled={buttonProps.disabled}
  // ... many more props
/>
```

### ✅ Prop Spreading

```jsx
// Spread hook props
<CustomButton {...buttonProps} />
```

---

### ❌ Mixing Concerns

```jsx
// Don't mix unrelated UI patterns
<button {...buttonProps} role="link" href="/page">
  Confusing Element
</button>
```

### ✅ Clear Separation

```jsx
// Use appropriate elements for each purpose
<a href="/page">Navigation Link</a>
<button {...buttonProps}>Action Button</button>
```

---

## Testing Composed Components

### Unit Testing Individual Hooks

```jsx
import { renderHook } from '@testing-library/react';

test('useButton returns correct props', () => {
  const { result } = renderHook(() => useButton());
  expect(result.current.buttonProps).toHaveProperty('onClick');
});
```

### Integration Testing Compositions

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('ConfirmDialog confirms and closes', async () => {
  const onConfirm = vi.fn();
  render(<ConfirmDeleteDialog onConfirm={onConfirm} itemName="Test" />);

  await userEvent.click(screen.getByRole('button', { name: /delete/i }));

  expect(onConfirm).toHaveBeenCalled();
});
```

---

## Performance Considerations

### Memoization

```jsx
// Memoize composed components to prevent unnecessary re-renders
const MemoizedDialog = React.memo(function Dialog({ isOpen, children }) {
  const { dialogProps } = useDialog({ isOpen });
  return <dialog {...dialogProps}>{children}</dialog>;
});
```

### Lazy Loading

```jsx
// Lazy load complex compositions
const HeavyDataTable = lazy(() => import('./HeavyDataTable'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyDataTable />
    </Suspense>
  );
}
```

---

## Summary

**Key Takeaways**:

1. **Compose Simple Hooks**: Build complex UIs from simple, focused hooks
2. **Use Prop Spreading**: Always spread hook props onto elements
3. **Follow Accessibility Patterns**: Each composition has specific ARIA requirements
4. **Test Integrations**: Test how hooks work together, not just in isolation
5. **Optimize Wisely**: Use memoization and lazy loading when needed

**Next Steps**:
- Review [element-mapping.md](./element-mapping.md) for HTML element selection
- Check [preset_archetypes.md](./preset_archetypes.md) for AI prompting examples
- Explore individual hook documentation for detailed APIs

---

**Version**: 1.0.0
**Last Updated**: 2026-01-17
**Maintained By**: Tekton Component System Team
