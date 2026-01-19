---
id: SPEC-COMPONENT-001
version: "1.0.0"
status: "completed"
created: "2026-01-15"
updated: "2026-01-16"
author: "Tekton Team"
priority: "HIGH"
---

## HISTORY

### 2026-01-16 - Implementation Completed
- Completed all 20 headless component hooks with TypeScript
- Achieved 85%+ test coverage across all hooks
- Validated ARIA attributes and keyboard navigation
- Integrated with Component Contract validation system
- Documentation synchronized with /moai:3-sync command
- Status changed from "draft" to "completed"

### 2026-01-15 - Initial Creation
- Created SPEC-COMPONENT-001 for Headless Component System
- Defined hooks for 20 core components with state management
- Established accessibility foundation for WCAG AA compliance
- Integrated with Screen Contract Architecture and Component Contract validation
- Reference: Tekton Component Architecture Implementation Plan

---

# SPEC-COMPONENT-001: Headless Component System

## Executive Summary

**Purpose**: Build a comprehensive headless component system providing unstyled, accessible, and reusable React hooks for 20 core UI components with state management, keyboard navigation, and WCAG AA compliance.

**Scope**: Implementation of headless hooks for Button, Input, Card, Modal, Tabs, Toggle, Dropdown, Avatar, Badge, Divider, Checkbox, Radio, Select, Alert, Tooltip, Breadcrumb, Pagination, Slider, Switch, and Progress components. Provides state management primitives without styling constraints.

**Priority**: HIGH - Foundation for Styled Component Wrappers (SPEC-COMPONENT-003)

**Impact**: Enables separation of concerns between behavior and presentation, allows multiple styling systems (CSS-in-JS, Tailwind, custom CSS) to share common logic, and ensures accessibility compliance through centralized state management.

---

## ENVIRONMENT

### Current System Context

**Tekton Project Architecture:**
- **Monorepo Structure**: pnpm workspaces with packages for contracts, themes, token-generator, CLI, VS Code extension
- **Component Contract System**: 8 MVP contracts (Button, Input, Dialog, Form, Card, Alert, Select, Checkbox) with 82 total constraints
- **Contract Types**: Accessibility, Prop-Combination, Children, Context, Composition, State validation
- **Screen Contract Architecture**: 4-layer system (Environment, Skeleton, Intent, Composition)
- **Token System**: OKLCH-based design tokens with WCAG AA compliance validation

**Target Headless Component System:**
- **Hook Pattern**: React hooks for state and behavior management
- **Zero Styling**: No CSS, no inline styles, pure logic
- **Accessibility First**: ARIA attributes, keyboard navigation, focus management
- **Type Safety**: Full TypeScript support with strict typing
- **Composability**: Hooks can be combined for complex components

### Technology Stack

**Frontend:**
- React 19 (Server Components, use() hook, Actions)
- Next.js 16 (App Router)
- TypeScript 5.9+ (satisfies operator, decorators)
- React Hooks API (useState, useEffect, useCallback, useId)

**Testing:**
- Vitest (unit tests for hooks)
- React Testing Library (@testing-library/react)
- @testing-library/react-hooks (hook testing utilities)
- Playwright (E2E for integration scenarios)

**Development:**
- pnpm workspaces (monorepo management)
- ESLint + Prettier (code quality)
- TypeScript strict mode (type safety)

---

## ASSUMPTIONS

### Technical Assumptions

**A-001: React 19 Hook Stability**
- **Assumption**: React 19 hooks API is stable and compatible with existing React patterns
- **Confidence**: HIGH
- **Evidence**: React 19 released with stable hooks API, backward compatible with React 18
- **Risk if Wrong**: Hook implementation requires refactoring for React version compatibility
- **Validation**: Test headless hooks with React 19 concurrent features before production deployment

**A-002: Browser Accessibility API Support**
- **Assumption**: Modern browsers (Chrome 111+, Safari 15+, Firefox 113+) support ARIA 1.2 attributes and keyboard event handling
- **Confidence**: HIGH
- **Evidence**: ARIA 1.2 widely supported since 2020, keyboard events standardized in DOM Level 3
- **Risk if Wrong**: Accessibility features require polyfills or fallbacks
- **Validation**: Cross-browser testing with NVDA, JAWS, VoiceOver screen readers

**A-003: Hook Testing Library Compatibility**
- **Assumption**: @testing-library/react-hooks works with React 19 and Vitest
- **Confidence**: MEDIUM
- **Evidence**: Library maintainers confirmed React 19 compatibility roadmap
- **Risk if Wrong**: Custom hook testing utilities required
- **Validation**: Prototype hook tests with Vitest + React 19 before full implementation

### Business Assumptions

**A-004: Headless Approach Adoption**
- **Assumption**: Developers prefer headless components for flexibility over pre-styled components
- **Confidence**: MEDIUM
- **Evidence**: Industry trend toward headless UI libraries (Radix UI, Headless UI, Ariakit)
- **Risk if Wrong**: Users prefer styled components, headless system underutilized
- **Validation**: User research and feedback collection during SPEC-COMPONENT-003 integration

**A-005: Component Scope Sufficiency**
- **Assumption**: 20 core components cover 80% of common UI needs
- **Confidence**: HIGH
- **Evidence**: Analysis of shadcn/ui, Radix UI, and Material UI component libraries
- **Risk if Wrong**: Users request additional components, expanding scope
- **Validation**: Component usage analytics post-deployment, feature request tracking

### Integration Assumptions

**A-006: Component Contract Compatibility**
- **Assumption**: Headless hooks can integrate with existing Component Contract validation system
- **Confidence**: HIGH
- **Evidence**: Contract system validates component behavior independent of implementation
- **Risk if Wrong**: Contract violations not detected in headless hooks
- **Validation**: Integration tests with Component Contract validation before deployment

---

## REQUIREMENTS

### Ubiquitous Requirements (Always Active)

**U-001: Accessibility Compliance**
- The system **shall** provide ARIA attributes, keyboard navigation, and focus management for all 20 components
- **Rationale**: WCAG AA compliance requirement for inclusive user experience
- **Test Strategy**: Automated ARIA attribute validation, keyboard navigation tests, screen reader compatibility tests

**U-002: Type Safety**
- The system **shall** provide full TypeScript type definitions for all hook return values and parameters
- **Rationale**: Developer experience and compile-time error prevention
- **Test Strategy**: TypeScript strict mode compilation, type inference validation

**U-003: Zero Styling Constraint**
- The system **shall not** include any CSS, inline styles, or styling logic in headless hooks
- **Rationale**: Complete separation of concerns enabling flexible styling approaches
- **Test Strategy**: Code review enforcement, automated linting rules

**U-004: State Management**
- The system **shall** manage component state (open/closed, selected, disabled, etc.) through hook return values
- **Rationale**: Predictable state behavior and React re-render optimization
- **Test Strategy**: State transition tests, hook update validation

**U-005: Test Coverage Requirement**
- The system **shall** maintain ≥85% test coverage across all headless hooks
- **Rationale**: TRUST 5 framework Test-first pillar enforcement
- **Test Strategy**: Vitest coverage reporting, automated coverage gates in CI/CD

### Event-Driven Requirements (Trigger-Response)

**E-001: Keyboard Event Handling**
- **WHEN** user presses keyboard keys (Enter, Space, Escape, Arrow keys) **THEN** trigger corresponding component actions
- **Rationale**: Keyboard accessibility for non-mouse users
- **Test Strategy**: Keyboard event simulation tests, key code validation

**E-002: Focus Management**
- **WHEN** component mounts or state changes **THEN** manage focus according to ARIA best practices
- **Rationale**: Screen reader navigation and focus trap prevention
- **Test Strategy**: Focus sequence tests, focus trap validation

**E-003: Click Outside Detection**
- **WHEN** user clicks outside dropdown/modal/tooltip **THEN** close component and trigger onClose callback
- **Rationale**: Intuitive user interaction pattern for dismissible components
- **Test Strategy**: Click outside event tests, boundary detection validation

**E-004: State Change Callbacks**
- **WHEN** component state changes **THEN** invoke user-provided callback functions with new state
- **Rationale**: Parent component notification and controlled component support
- **Test Strategy**: Callback invocation tests, parameter validation

### State-Driven Requirements (Conditional Behavior)

**S-001: Disabled State Handling**
- **IF** component is disabled **THEN** prevent interactions and apply aria-disabled attribute
- **Rationale**: Accessibility compliance and user feedback for unavailable actions
- **Test Strategy**: Disabled state interaction tests, ARIA attribute validation

**S-002: Controlled vs Uncontrolled Modes**
- **IF** state prop provided **THEN** operate in controlled mode, **ELSE** manage state internally
- **Rationale**: Flexible component usage supporting both controlled and uncontrolled patterns
- **Test Strategy**: Controlled mode tests, uncontrolled mode tests, mode detection validation

**S-003: Multi-Select State**
- **IF** component supports multi-select **THEN** manage array state instead of single value
- **Rationale**: Complex selection patterns for dropdown, checkbox group, tag input
- **Test Strategy**: Multi-select state tests, selection synchronization validation

**S-004: Error State Handling**
- **IF** component has validation error **THEN** apply aria-invalid attribute and expose error state
- **Rationale**: Form validation accessibility and user feedback
- **Test Strategy**: Error state tests, ARIA validation state checks

### Unwanted Behaviors (Prohibited Actions)

**UW-001: No Styling Logic**
- The system **shall not** include className generation, CSS-in-JS, or inline style logic
- **Rationale**: Headless principle enforcement, prevent style coupling
- **Test Strategy**: Code review, automated linting, visual regression absence

**UW-002: No DOM Structure Enforcement**
- The system **shall not** enforce specific DOM structures or render prop patterns (except accessibility-required elements)
- **Rationale**: Maximum flexibility for consuming applications
- **Test Strategy**: API contract validation, integration tests with various DOM structures

**UW-003: No Framework-Specific Dependencies**
- The system **shall not** depend on CSS frameworks (Tailwind, Bootstrap) or component libraries
- **Rationale**: Framework-agnostic design for maximum reusability
- **Test Strategy**: Dependency audit, package.json validation

**UW-004: No Silent Accessibility Failures**
- The system **shall not** allow components to render without required ARIA attributes
- **Rationale**: Accessibility compliance cannot be optional or silently bypassed
- **Test Strategy**: ARIA attribute presence tests, development-mode warnings

### Optional Requirements (Future Enhancements - Deferred)

**O-001: Animation Hook Integration**
- **Where possible**, provide animation lifecycle hooks for enter/exit transitions
- **Priority**: DEFERRED to post-Phase 1
- **Rationale**: Animation complexity requires additional research and testing

**O-002: Virtual Scrolling Support**
- **Where possible**, integrate virtual scrolling for large lists (dropdown, select)
- **Priority**: DEFERRED to post-Phase 1
- **Rationale**: Performance optimization for extreme cases, not MVP-critical

**O-003: Touch Gesture Support**
- **Where possible**, add swipe, pinch, long-press gestures for mobile
- **Priority**: DEFERRED to post-Phase 1
- **Rationale**: Mobile-specific features require additional testing infrastructure

---

## SPECIFICATIONS

### Component Implementation Breakdown

#### Tier 1: Basic Interaction Components (5 components)

**1. Button Hook (`useButton`)**
- State: disabled, loading, pressed (aria-pressed for toggle buttons)
- Events: onClick, onKeyDown (Enter/Space)
- ARIA: role=button, aria-disabled, aria-pressed, aria-label
- Returns: `{ buttonProps, isPressed, isDisabled }`

**2. Input Hook (`useInput`)**
- State: value, disabled, readOnly, invalid, focused
- Events: onChange, onFocus, onBlur, onKeyDown
- ARIA: aria-invalid, aria-describedby, aria-labelledby, aria-required
- Returns: `{ inputProps, value, setValue, isInvalid, isFocused }`

**3. Checkbox Hook (`useCheckbox`)**
- State: checked, indeterminate, disabled
- Events: onChange, onKeyDown (Space)
- ARIA: role=checkbox, aria-checked, aria-disabled
- Returns: `{ checkboxProps, isChecked, toggle }`

**4. Radio Hook (`useRadio`)**
- State: selected, disabled, name (group association)
- Events: onChange, onKeyDown (Arrow keys for group navigation)
- ARIA: role=radio, aria-checked, aria-disabled
- Returns: `{ radioProps, isSelected, select }`

**5. Toggle/Switch Hook (`useToggle`)**
- State: on, disabled
- Events: onChange, onKeyDown (Space/Enter)
- ARIA: role=switch, aria-checked, aria-disabled
- Returns: `{ toggleProps, isOn, toggle }`

#### Tier 2: Selection Components (5 components)

**6. Select/Dropdown Hook (`useSelect`)**
- State: open, selectedValue, disabled, options
- Events: onSelect, onOpenChange, onKeyDown (Arrow keys, Enter, Escape)
- ARIA: role=combobox, aria-expanded, aria-activedescendant, aria-controls
- Returns: `{ triggerProps, menuProps, optionProps, isOpen, selectedValue }`

**7. Tabs Hook (`useTabs`)**
- State: activeTab, disabled
- Events: onTabChange, onKeyDown (Arrow keys, Home, End)
- ARIA: role=tablist/tab/tabpanel, aria-selected, aria-controls
- Returns: `{ tabListProps, tabProps, tabPanelProps, activeTab, setActiveTab }`

**8. Breadcrumb Hook (`useBreadcrumb`)**
- State: items, currentIndex
- Events: onNavigate
- ARIA: role=navigation, aria-label, aria-current
- Returns: `{ navProps, itemProps, isCurrentPage }`

**9. Pagination Hook (`usePagination`)**
- State: currentPage, totalPages, pageSize
- Events: onPageChange, onKeyDown (Arrow keys)
- ARIA: role=navigation, aria-label, aria-current
- Returns: `{ paginationProps, currentPage, goToPage, nextPage, prevPage }`

**10. Slider Hook (`useSlider`)**
- State: value, min, max, step, disabled
- Events: onChange, onKeyDown (Arrow keys), onMouseDown/onMouseMove
- ARIA: role=slider, aria-valuemin, aria-valuemax, aria-valuenow, aria-valuetext
- Returns: `{ sliderProps, thumbProps, value, setValue }`

#### Tier 3: Overlay Components (5 components)

**11. Modal/Dialog Hook (`useModal`)**
- State: open, focusTrap
- Events: onOpenChange, onEscapeKey
- ARIA: role=dialog, aria-modal, aria-labelledby, aria-describedby
- Focus Management: Focus trap within modal, restore focus on close
- Returns: `{ overlayProps, dialogProps, isOpen, open, close }`

**12. Tooltip Hook (`useTooltip`)**
- State: open, position, delay
- Events: onOpenChange, onHover, onFocus
- ARIA: role=tooltip, aria-describedby
- Returns: `{ triggerProps, tooltipProps, isOpen }`

**13. Dropdown Menu Hook (`useDropdownMenu`)**
- State: open, selectedItem, disabled
- Events: onSelect, onOpenChange, onKeyDown (Arrow keys, Enter, Escape)
- ARIA: role=menu, aria-expanded, aria-haspopup
- Returns: `{ triggerProps, menuProps, itemProps, isOpen, toggle }`

**14. Alert Hook (`useAlert`)**
- State: variant (info/success/warning/error), dismissible
- Events: onDismiss
- ARIA: role=alert/alertdialog, aria-live, aria-atomic
- Returns: `{ alertProps, isDismissed, dismiss }`

**15. Popover Hook (`usePopover`)**
- State: open, position, trigger (hover/click/focus)
- Events: onOpenChange, onClickOutside
- ARIA: aria-expanded, aria-haspopup, aria-controls
- Returns: `{ triggerProps, popoverProps, isOpen, toggle }`

#### Tier 4: Display Components (5 components)

**16. Card Hook (`useCard`)**
- State: selected, interactive
- Events: onClick, onKeyDown (Enter/Space for interactive cards)
- ARIA: role=article/region, aria-selected (for selectable cards)
- Returns: `{ cardProps, isSelected, select }`

**17. Avatar Hook (`useAvatar`)**
- State: imageLoaded, fallback
- Events: onImageLoad, onImageError
- ARIA: role=img, aria-label
- Returns: `{ avatarProps, imageProps, isLoaded, showFallback }`

**18. Badge Hook (`useBadge`)**
- State: count, max, showZero
- ARIA: aria-label, role=status
- Returns: `{ badgeProps, displayValue }`

**19. Divider Hook (`useDivider`)**
- State: orientation (horizontal/vertical), decorative
- ARIA: role=separator, aria-orientation, aria-hidden (if decorative)
- Returns: `{ dividerProps }`

**20. Progress Hook (`useProgress`)**
- State: value, max, indeterminate
- ARIA: role=progressbar, aria-valuenow, aria-valuemin, aria-valuemax
- Returns: `{ progressProps, percentage, isIndeterminate }`

---

## TRACEABILITY

### Requirements to Test Scenarios Mapping

| Requirement ID | Test Scenario ID | Component Tier |
|----------------|------------------|----------------|
| U-001 | AC-001, AC-002 | All |
| U-002 | AC-003 | All |
| U-003 | AC-004 | All |
| E-001 | AC-005 | Tier 1, 2 |
| E-002 | AC-006 | Tier 3 |
| E-003 | AC-007 | Tier 3 |
| S-001 | AC-008 | All |
| S-002 | AC-009 | Tier 1, 2 |

### SPEC-to-Implementation Tags

- **[SPEC-COMPONENT-001]**: All commits related to headless component hooks
- **[TIER-1]**: Basic interaction components
- **[TIER-2]**: Selection components
- **[TIER-3]**: Overlay components
- **[TIER-4]**: Display components

---

## DEPENDENCIES

### Internal Dependencies
- **Component Contract System**: Headless hooks must comply with contract validation
- **Screen Contract Architecture**: Hooks integrate with 4-layer screen generation
- **Token System**: Hooks expose props for token-based styling (handled by SPEC-COMPONENT-003)

### External Dependencies
- **React 19**: Core hook API (useState, useEffect, useCallback, useId)
- **TypeScript 5.9+**: Type definitions and inference
- **Vitest**: Unit testing framework for hooks
- **@testing-library/react**: Hook testing utilities

### Technical Dependencies
- **pnpm workspaces**: Monorepo package management
- **ESLint + Prettier**: Code quality enforcement
- **tsconfig.json**: Strict TypeScript configuration

---

## RISK ANALYSIS

### High-Risk Areas

**Risk 1: React 19 Hook Behavior Changes**
- **Likelihood**: LOW
- **Impact**: HIGH
- **Mitigation**: Comprehensive unit tests for all hooks, React version pinning, early React 19 testing
- **Contingency**: Fallback to React 18 compatible patterns if breaking changes detected

**Risk 2: Accessibility Attribute Completeness**
- **Likelihood**: MEDIUM
- **Impact**: CRITICAL
- **Mitigation**: ARIA attribute checklists, automated accessibility testing, screen reader validation
- **Contingency**: Manual accessibility audit, contract validation enforcement

**Risk 3: Hook Testing Complexity**
- **Likelihood**: MEDIUM
- **Impact**: MEDIUM
- **Mitigation**: @testing-library/react-hooks for isolated hook testing, clear testing patterns
- **Contingency**: Custom testing utilities if library compatibility issues arise

### Medium-Risk Areas

**Risk 4: Hook Performance with Re-renders**
- **Likelihood**: MEDIUM
- **Impact**: MEDIUM
- **Mitigation**: useCallback/useMemo optimization, React.memo for expensive components
- **Contingency**: Performance profiling, React DevTools re-render tracking

**Risk 5: Browser Compatibility for Keyboard Events**
- **Likelihood**: LOW
- **Impact**: MEDIUM
- **Mitigation**: Cross-browser testing, keyboard event polyfills if needed
- **Contingency**: Graceful degradation for unsupported browsers

---

## SUCCESS CRITERIA

### Implementation Success Criteria
- ✅ **COMPLETED** - All 20 headless hooks implemented with full TypeScript support (U-002)
  - 5 Tier 1 hooks: Button, Input, Checkbox, Radio, Toggle
  - 5 Tier 2 hooks: Select, Tabs, Breadcrumb, Pagination, Slider
  - 5 Tier 3 hooks: Modal, Tooltip, DropdownMenu, Alert, Popover
  - 5 Tier 4 hooks: Card, Avatar, Badge, Divider, Progress
- ✅ **COMPLETED** - Zero styling logic in hook implementations (UW-001)
- ✅ **COMPLETED** - ARIA attributes applied correctly for all components (U-001)
- ✅ **COMPLETED** - Keyboard navigation functional for all interactive components (E-001)
- ✅ **COMPLETED** - Test coverage ≥85% for all hooks (U-005)

### Quality Success Criteria
- ✅ **COMPLETED** - All Component Contract validations pass for headless hooks (A-006)
- ⏳ **IN PROGRESS** - Screen reader compatibility validated with NVDA, JAWS, VoiceOver (U-001)
  - Recommendation: Manual screen reader testing before production deployment
- ✅ **COMPLETED** - TypeScript strict mode compilation with zero errors (U-002)
- ⏳ **IN PROGRESS** - Cross-browser testing passed (Chrome, Safari, Firefox) (A-002)
  - Recommendation: Cross-browser validation in staging environment

### Integration Success Criteria
- ⏳ **PENDING** - Hooks integrate with SPEC-COMPONENT-003 styled wrappers (zero friction)
  - Blocked by: SPEC-COMPONENT-003 not yet initiated
- ✅ **COMPLETED** - Hooks support both controlled and uncontrolled modes (S-002)
- ✅ **COMPLETED** - Documentation includes usage examples for all 20 components

---

## REFERENCES

- [Component Contract System](../../../packages/contracts/README.md)
- [Screen Contract Architecture](../../../packages/contracts/src/screen/README.md)
- [React 19 Hooks API](https://react.dev/reference/react)
- [ARIA 1.2 Specification](https://www.w3.org/TR/wai-aria-1.2/)
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [TRUST 5 Framework](../../../.claude/skills/moai-foundation-core/modules/trust-5-framework.md)

---

**Last Updated**: 2026-01-16
**Status**: Completed - Ready for Integration
**Next Steps**:
1. Execute manual screen reader testing (NVDA, JAWS, VoiceOver)
2. Perform cross-browser validation in staging environment
3. Begin SPEC-COMPONENT-002 (Token Contract & CSS Variable System)
4. Initiate SPEC-COMPONENT-003 (Styled Component Wrappers) integration
