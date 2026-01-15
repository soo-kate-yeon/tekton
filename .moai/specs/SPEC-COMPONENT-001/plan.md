# SPEC-COMPONENT-001: Headless Component System - Implementation Plan

**SPEC ID**: SPEC-COMPONENT-001
**Version**: 1.0.0
**Status**: Draft
**Priority**: HIGH

---

## Implementation Overview

This plan outlines the systematic implementation of 20 headless component hooks with full TypeScript support, accessibility compliance, and comprehensive test coverage. Implementation follows a tiered approach from basic to complex components.

**Estimated Effort**: 8-10 days (assuming full-time development)

**Key Deliverables**:
- 20 TypeScript hook implementations
- 85%+ test coverage with Vitest
- ARIA attribute validation suite
- TypeScript type definitions
- Usage documentation and examples

---

## Technology Stack

### Core Dependencies
- **React**: 19.x (use() hook, Server Components support)
- **TypeScript**: 5.9+ (satisfies operator, decorators)
- **Vitest**: Latest (unit testing framework)
- **@testing-library/react**: Latest (hook testing)
- **@testing-library/react-hooks**: Latest (isolated hook testing)

### Development Dependencies
- **@typescript-eslint/eslint-plugin**: 8.20.0+
- **@typescript-eslint/parser**: 8.20.0+
- **eslint**: 9.18.0+
- **prettier**: 3.4.2+

### Testing Stack
- **Vitest**: Unit testing and coverage reporting
- **@testing-library/react**: Component and hook testing utilities
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: DOM matchers
- **@vitest/coverage-v8**: Coverage reporting

---

## Implementation Phases

### Phase 1: Foundation Setup (Priority: HIGH)

**Duration**: 1 day

**Objective**: Establish package structure, TypeScript configuration, and testing infrastructure

**Tasks**:
1. Create `packages/headless-components/` package in monorepo
   - Initialize package.json with React 19 and TypeScript 5.9+
   - Configure tsconfig.json with strict mode
   - Setup Vitest configuration for hook testing
   - Configure ESLint and Prettier for code quality

2. Establish folder structure:
   ```
   packages/headless-components/
   ├── src/
   │   ├── hooks/
   │   │   ├── useButton.ts
   │   │   ├── useInput.ts
   │   │   ├── ... (18 more hooks)
   │   ├── utils/
   │   │   ├── aria.ts (ARIA helper utilities)
   │   │   ├── keyboard.ts (Keyboard event handlers)
   │   │   ├── focus.ts (Focus management)
   │   ├── types/
   │   │   ├── index.ts (Shared TypeScript types)
   │   ├── index.ts (Public API exports)
   ├── tests/
   │   ├── hooks/ (Unit tests for each hook)
   │   ├── utils/ (Utility function tests)
   ├── vitest.config.ts
   ├── tsconfig.json
   ├── package.json
   └── README.md
   ```

3. Implement shared utility functions:
   - `generateAriaProps()`: Generate ARIA attributes based on component state
   - `handleKeyboardNavigation()`: Standard keyboard event handling
   - `useFocusTrap()`: Focus trap for modals and overlays
   - `useClickOutside()`: Click outside detection
   - `useUniqueId()`: Generate unique IDs for ARIA associations

4. Create TypeScript type definitions:
   ```typescript
   // types/index.ts
   export interface BaseHookProps {
     disabled?: boolean;
     id?: string;
     'aria-label'?: string;
     'aria-labelledby'?: string;
     'aria-describedby'?: string;
   }

   export interface StateHookReturn<T> {
     value: T;
     setValue: (value: T) => void;
     reset: () => void;
   }

   export type KeyboardHandler = (event: React.KeyboardEvent) => void;
   export type ClickHandler = (event: React.MouseEvent) => void;
   ```

**Acceptance Criteria**:
- ✅ Package compiles with TypeScript strict mode (zero errors)
- ✅ Vitest runs successfully with example test
- ✅ ESLint and Prettier configured and passing
- ✅ Folder structure matches specification

**Dependencies**: None (foundation phase)

---

### Phase 2: Tier 1 - Basic Interaction Components (Priority: HIGH)

**Duration**: 2 days

**Objective**: Implement 5 fundamental interaction hooks with full test coverage

**Tasks**:

#### Task 2.1: useButton Hook
- **File**: `src/hooks/useButton.ts`
- **State**: disabled, loading, pressed (toggle buttons)
- **Events**: onClick, onKeyDown (Enter/Space)
- **ARIA**: role=button, aria-disabled, aria-pressed, aria-label
- **Return Value**:
  ```typescript
  {
    buttonProps: {
      role: 'button',
      tabIndex: number,
      disabled: boolean,
      'aria-disabled': boolean,
      'aria-pressed'?: boolean,
      'aria-label'?: string,
      onClick: ClickHandler,
      onKeyDown: KeyboardHandler,
    },
    isPressed: boolean,
    isDisabled: boolean,
    setPressed: (pressed: boolean) => void,
  }
  ```
- **Tests**: Keyboard (Enter/Space), disabled state, toggle mode, ARIA attributes

#### Task 2.2: useInput Hook
- **File**: `src/hooks/useInput.ts`
- **State**: value, disabled, readOnly, invalid, focused
- **Events**: onChange, onFocus, onBlur, onKeyDown
- **ARIA**: aria-invalid, aria-describedby, aria-labelledby, aria-required
- **Return Value**:
  ```typescript
  {
    inputProps: {
      value: string,
      disabled: boolean,
      readOnly: boolean,
      'aria-invalid': boolean,
      'aria-describedby'?: string,
      'aria-labelledby'?: string,
      'aria-required'?: boolean,
      onChange: (e: ChangeEvent<HTMLInputElement>) => void,
      onFocus: FocusHandler,
      onBlur: FocusHandler,
    },
    value: string,
    setValue: (value: string) => void,
    isInvalid: boolean,
    isFocused: boolean,
    reset: () => void,
  }
  ```
- **Tests**: Value change, validation state, focus/blur, disabled state

#### Task 2.3: useCheckbox Hook
- **File**: `src/hooks/useCheckbox.ts`
- **State**: checked, indeterminate, disabled
- **Events**: onChange, onKeyDown (Space)
- **ARIA**: role=checkbox, aria-checked, aria-disabled
- **Tests**: Toggle behavior, indeterminate state, keyboard (Space), disabled

#### Task 2.4: useRadio Hook
- **File**: `src/hooks/useRadio.ts`
- **State**: selected, disabled, name (group)
- **Events**: onChange, onKeyDown (Arrow keys)
- **ARIA**: role=radio, aria-checked, aria-disabled
- **Tests**: Group navigation (Arrow keys), selection, disabled

#### Task 2.5: useToggle/Switch Hook
- **File**: `src/hooks/useToggle.ts`
- **State**: on, disabled
- **Events**: onChange, onKeyDown (Space/Enter)
- **ARIA**: role=switch, aria-checked, aria-disabled
- **Tests**: Toggle behavior, keyboard (Space/Enter), disabled

**Acceptance Criteria**:
- ✅ All 5 hooks implemented with full TypeScript types
- ✅ Test coverage ≥85% for each hook
- ✅ ARIA attributes validated in tests
- ✅ Keyboard navigation tests passing
- ✅ Zero TypeScript errors in strict mode

**Dependencies**: Phase 1 (Foundation Setup)

---

### Phase 3: Tier 2 - Selection Components (Priority: HIGH)

**Duration**: 2 days

**Objective**: Implement 5 selection hooks with keyboard navigation and ARIA compliance

**Tasks**:

#### Task 3.1: useSelect/Dropdown Hook
- **File**: `src/hooks/useSelect.ts`
- **State**: open, selectedValue, disabled, options
- **Events**: onSelect, onOpenChange, onKeyDown (Arrow keys, Enter, Escape)
- **ARIA**: role=combobox, aria-expanded, aria-activedescendant, aria-controls
- **Return Value**:
  ```typescript
  {
    triggerProps: { 'aria-expanded': boolean, 'aria-controls': string },
    menuProps: { role: 'listbox', id: string },
    optionProps: (option: Option) => { role: 'option', 'aria-selected': boolean },
    isOpen: boolean,
    selectedValue: T,
    toggle: () => void,
  }
  ```
- **Tests**: Open/close, selection, keyboard navigation (Arrow/Enter/Escape)

#### Task 3.2: useTabs Hook
- **File**: `src/hooks/useTabs.ts`
- **State**: activeTab, disabled
- **Events**: onTabChange, onKeyDown (Arrow keys, Home, End)
- **ARIA**: role=tablist/tab/tabpanel, aria-selected, aria-controls
- **Tests**: Tab switching, keyboard navigation (Arrow/Home/End), disabled tabs

#### Task 3.3: useBreadcrumb Hook
- **File**: `src/hooks/useBreadcrumb.ts`
- **State**: items, currentIndex
- **Events**: onNavigate
- **ARIA**: role=navigation, aria-label, aria-current
- **Tests**: Navigation, current page indicator, ARIA labels

#### Task 3.4: usePagination Hook
- **File**: `src/hooks/usePagination.ts`
- **State**: currentPage, totalPages, pageSize
- **Events**: onPageChange, onKeyDown (Arrow keys)
- **ARIA**: role=navigation, aria-label, aria-current
- **Tests**: Page navigation (next/prev/goTo), boundary conditions, ARIA

#### Task 3.5: useSlider Hook
- **File**: `src/hooks/useSlider.ts`
- **State**: value, min, max, step, disabled
- **Events**: onChange, onKeyDown (Arrow keys), onMouseDown/onMouseMove
- **ARIA**: role=slider, aria-valuemin, aria-valuemax, aria-valuenow, aria-valuetext
- **Tests**: Value change, step increments, keyboard (Arrow keys), min/max bounds

**Acceptance Criteria**:
- ✅ All 5 hooks implemented with keyboard navigation
- ✅ Test coverage ≥85% for each hook
- ✅ ARIA attributes validated in tests
- ✅ Complex keyboard interactions tested (Arrow keys, Home, End, Escape)

**Dependencies**: Phase 2 (Tier 1 Components)

---

### Phase 4: Tier 3 - Overlay Components (Priority: HIGH)

**Duration**: 2-3 days

**Objective**: Implement 5 overlay hooks with focus management and click-outside detection

**Tasks**:

#### Task 4.1: useModal/Dialog Hook
- **File**: `src/hooks/useModal.ts`
- **State**: open, focusTrap
- **Events**: onOpenChange, onEscapeKey
- **ARIA**: role=dialog, aria-modal, aria-labelledby, aria-describedby
- **Focus Management**: useFocusTrap() integration, restore focus on close
- **Tests**: Open/close, focus trap, Escape key, focus restoration

#### Task 4.2: useTooltip Hook
- **File**: `src/hooks/useTooltip.ts`
- **State**: open, position, delay
- **Events**: onOpenChange, onHover, onFocus
- **ARIA**: role=tooltip, aria-describedby
- **Tests**: Hover trigger, focus trigger, delay timing, ARIA association

#### Task 4.3: useDropdownMenu Hook
- **File**: `src/hooks/useDropdownMenu.ts`
- **State**: open, selectedItem, disabled
- **Events**: onSelect, onOpenChange, onKeyDown (Arrow keys, Enter, Escape)
- **ARIA**: role=menu, aria-expanded, aria-haspopup
- **Tests**: Menu navigation, selection, keyboard (Arrow/Enter/Escape), click outside

#### Task 4.4: useAlert Hook
- **File**: `src/hooks/useAlert.ts`
- **State**: variant (info/success/warning/error), dismissible
- **Events**: onDismiss
- **ARIA**: role=alert/alertdialog, aria-live, aria-atomic
- **Tests**: Alert variants, dismissible behavior, ARIA live region

#### Task 4.5: usePopover Hook
- **File**: `src/hooks/usePopover.ts`
- **State**: open, position, trigger (hover/click/focus)
- **Events**: onOpenChange, onClickOutside
- **ARIA**: aria-expanded, aria-haspopup, aria-controls
- **Tests**: Multiple triggers, click outside, position calculation

**Acceptance Criteria**:
- ✅ All 5 hooks implemented with focus management
- ✅ Test coverage ≥85% for each hook
- ✅ Focus trap functional and tested for modals
- ✅ Click outside detection working for all overlay components
- ✅ ARIA live regions validated for alerts

**Dependencies**: Phase 3 (Tier 2 Components), useFocusTrap utility

---

### Phase 5: Tier 4 - Display Components (Priority: MEDIUM)

**Duration**: 1-2 days

**Objective**: Implement 5 display hooks with minimal state management

**Tasks**:

#### Task 5.1: useCard Hook
- **File**: `src/hooks/useCard.ts`
- **State**: selected, interactive
- **Events**: onClick, onKeyDown (Enter/Space for interactive cards)
- **ARIA**: role=article/region, aria-selected
- **Tests**: Interactive mode, selection, keyboard (Enter/Space)

#### Task 5.2: useAvatar Hook
- **File**: `src/hooks/useAvatar.ts`
- **State**: imageLoaded, fallback
- **Events**: onImageLoad, onImageError
- **ARIA**: role=img, aria-label
- **Tests**: Image load success/failure, fallback display

#### Task 5.3: useBadge Hook
- **File**: `src/hooks/useBadge.ts`
- **State**: count, max, showZero
- **ARIA**: aria-label, role=status
- **Tests**: Count display, max limit, zero handling

#### Task 5.4: useDivider Hook
- **File**: `src/hooks/useDivider.ts`
- **State**: orientation (horizontal/vertical), decorative
- **ARIA**: role=separator, aria-orientation, aria-hidden (if decorative)
- **Tests**: Orientation, decorative vs semantic

#### Task 5.5: useProgress Hook
- **File**: `src/hooks/useProgress.ts`
- **State**: value, max, indeterminate
- **ARIA**: role=progressbar, aria-valuenow, aria-valuemin, aria-valuemax
- **Tests**: Determinate progress, indeterminate state, percentage calculation

**Acceptance Criteria**:
- ✅ All 5 hooks implemented with minimal complexity
- ✅ Test coverage ≥85% for each hook
- ✅ ARIA attributes validated for each display component

**Dependencies**: Phase 4 (Tier 3 Components)

---

## Testing Strategy

### Unit Testing Approach

**Test Structure** (per hook):
1. **State Management Tests**: Verify state transitions, initial values, reset behavior
2. **Event Handler Tests**: Simulate user interactions (click, keyboard, focus)
3. **ARIA Attribute Tests**: Validate correct ARIA attributes for all states
4. **Keyboard Navigation Tests**: Test Arrow keys, Enter, Space, Escape, Home, End
5. **Controlled vs Uncontrolled Tests**: Verify both modes work correctly
6. **Edge Case Tests**: Disabled state, invalid values, boundary conditions

**Example Test Suite** (useButton):
```typescript
describe('useButton', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useButton());
    expect(result.current.isPressed).toBe(false);
    expect(result.current.isDisabled).toBe(false);
  });

  it('should handle click events', () => {
    const onClick = vi.fn();
    const { result } = renderHook(() => useButton({ onClick }));
    result.current.buttonProps.onClick();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should handle keyboard events (Enter/Space)', () => {
    const onClick = vi.fn();
    const { result } = renderHook(() => useButton({ onClick }));

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    result.current.buttonProps.onKeyDown(enterEvent);
    expect(onClick).toHaveBeenCalledTimes(1);

    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    result.current.buttonProps.onKeyDown(spaceEvent);
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('should apply correct ARIA attributes', () => {
    const { result } = renderHook(() => useButton({ disabled: true }));
    expect(result.current.buttonProps['aria-disabled']).toBe(true);
    expect(result.current.buttonProps.role).toBe('button');
  });

  it('should support toggle mode with aria-pressed', () => {
    const { result } = renderHook(() => useButton({ toggle: true }));
    expect(result.current.buttonProps['aria-pressed']).toBe(false);

    act(() => result.current.setPressed(true));
    expect(result.current.buttonProps['aria-pressed']).toBe(true);
  });
});
```

### Coverage Requirements
- **Statement Coverage**: ≥85%
- **Branch Coverage**: ≥80%
- **Function Coverage**: ≥85%
- **Line Coverage**: ≥85%

### Testing Tools
- **Vitest**: Test runner and coverage reporting
- **@testing-library/react**: Hook rendering and user event simulation
- **@testing-library/user-event**: Advanced user interaction simulation
- **@testing-library/jest-dom**: DOM assertion matchers

---

## Risks and Mitigation Strategies

### Risk 1: React 19 Hook Compatibility
- **Mitigation**: Pin React version, comprehensive hook tests, early React 19 testing
- **Contingency**: Fallback to React 18 patterns if breaking changes detected

### Risk 2: Cross-Browser Keyboard Event Differences
- **Mitigation**: Normalize keyboard events, cross-browser testing (Chrome, Safari, Firefox)
- **Contingency**: Browser-specific polyfills if needed

### Risk 3: ARIA Attribute Completeness
- **Mitigation**: ARIA attribute checklists, automated accessibility testing, screen reader validation
- **Contingency**: Manual accessibility audit before production deployment

### Risk 4: Hook Performance with Re-renders
- **Mitigation**: useCallback/useMemo optimization, React.memo for expensive components
- **Contingency**: Performance profiling, React DevTools re-render tracking

---

## Quality Gates

### Pre-Merge Requirements
- ✅ All unit tests passing (100% pass rate)
- ✅ Test coverage ≥85% (statement, branch, function, line)
- ✅ TypeScript strict mode compilation (zero errors)
- ✅ ESLint passing (zero errors, ≤5 warnings)
- ✅ Prettier formatting applied
- ✅ Component Contract validation passing
- ✅ ARIA attribute validation passing

### Production Readiness Requirements
- ✅ Cross-browser testing passed (Chrome, Safari, Firefox)
- ✅ Screen reader compatibility validated (NVDA, JAWS, VoiceOver)
- ✅ Keyboard navigation functional for all interactive components
- ✅ Documentation complete with usage examples
- ✅ Integration tests with SPEC-COMPONENT-003 styled wrappers passing

---

## Documentation Requirements

### API Documentation
- Hook function signatures with TypeScript types
- Return value descriptions
- ARIA attribute references
- Keyboard interaction patterns
- Usage examples for each hook

### Integration Guide
- How to integrate hooks with styled components
- Controlled vs uncontrolled usage patterns
- Custom styling examples (CSS, Tailwind, CSS-in-JS)
- Common pitfalls and solutions

### Migration Guide
- Migrating from existing component libraries to headless hooks
- Breaking changes and compatibility notes

---

## Next Steps

**Phase 1**: Foundation Setup (1 day)
**Phase 2**: Tier 1 - Basic Interaction Components (2 days)
**Phase 3**: Tier 2 - Selection Components (2 days)
**Phase 4**: Tier 3 - Overlay Components (2-3 days)
**Phase 5**: Tier 4 - Display Components (1-2 days)

**Total Estimated Duration**: 8-10 days

**After Implementation**:
1. Execute /moai:3-sync SPEC-COMPONENT-001 for documentation generation
2. Begin SPEC-COMPONENT-002 (Token Contract & CSS Variable System)
3. Integrate headless hooks with SPEC-COMPONENT-003 (Styled Component Wrappers)

---

**Last Updated**: 2026-01-15
**Status**: Draft - Ready for Implementation
**SPEC Reference**: [SPEC-COMPONENT-001](./spec.md)
