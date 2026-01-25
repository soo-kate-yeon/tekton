---
id: SPEC-COMPONENT-001
version: "2.0.0"
status: "completed"
created: "2026-01-15"
updated: "2026-01-26"
author: "Tekton Team"
priority: "HIGH"
phases:
  - phase: "A"
    name: "Headless Component Hooks"
    status: "completed"
    completion_date: "2026-01-16"
  - phase: "B"
    name: "Component Schemas & Validation"
    status: "completed"
    completion_date: "2026-01-26"
---

## HISTORY

### 2026-01-26 - Phase B Implementation Completed
- **Component Schemas**: Implemented 20 component schemas (10 primitive, 10 composed)
- **Schema Validation**: Added Zod-based runtime validation system (261 lines)
- **Token Bindings**: Implemented template variable system ({variant}, {size}, {color})
- **TypeScript Types**: Full type definitions for ComponentSchema, PropDefinition, A11yRequirements
- **Test Coverage**: Achieved 97.05% coverage with comprehensive test suite (383 lines)
- **Exports**: Added TypeScript exports for all 20 component schemas
- **Validation Functions**: 8 validation utilities (validateComponentSchema, validateAllSchemas, etc.)

### 2026-01-16 - Phase A Implementation Completed
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

# SPEC-COMPONENT-001: Headless Component System & Schema Architecture

## Executive Summary

**Purpose**: Build a comprehensive headless component system with platform-agnostic component schemas, providing unstyled, accessible, and reusable React hooks for 20 core UI components with state management, keyboard navigation, WCAG AA compliance, and runtime validation.

**Scope**:
- **Phase A (Completed)**: Implementation of headless hooks for Button, Input, Card, Modal, Tabs, Toggle, Dropdown, Avatar, Badge, Divider, Checkbox, Radio, Select, Alert, Tooltip, Breadcrumb, Pagination, Slider, Switch, and Progress components. Provides state management primitives without styling constraints.
- **Phase B (Completed)**: Platform-agnostic component schema definitions with token bindings, Zod-based runtime validation, TypeScript type system, and template variable support for 20 components.

**Priority**: HIGH - Foundation for Styled Component Wrappers (SPEC-COMPONENT-003)

**Impact**:
- Enables separation of concerns between behavior and presentation
- Allows multiple styling systems (CSS-in-JS, Tailwind, custom CSS) to share common logic
- Ensures accessibility compliance through centralized state management
- Provides type-safe component schemas with runtime validation
- Enables dynamic token binding with template variables ({variant}, {size}, {color})
- Supports platform-agnostic component definitions for cross-framework compatibility
d---
id: SPEC-COMPONENT-001
version: "2.0.0"
status: "decomposed"
created: "2026-01-25"
updated: "2026-01-25"
author: "MoAI-ADK"
priority: "HIGH"
lifecycle: "spec-anchored"
tags: ["SPEC-COMPONENT-001", "Master-SPEC", "Component-System", "Token", "CSS-Variables", "Hybrid"]
sub_specs:
  - SPEC-COMPONENT-001-A  # Token System
  - SPEC-COMPONENT-001-B  # Component Schemas
  - SPEC-COMPONENT-001-C  # @tekton/ui Library
  - SPEC-COMPONENT-001-D  # Export Pipeline
---

## HISTORY
- 2026-01-25 v2.0.0: Decomposed into 4 sub-SPECs (A: Token System, B: Schemas, C: UI Library, D: Export Pipeline)
- 2026-01-25 v1.0.0: Initial SPEC creation - Hybrid Component System with 3-Layer Token Architecture

---

# SPEC-COMPONENT-001: Hybrid Component Catalog System (Master SPEC)

> **이 SPEC은 마스터 SPEC입니다.** 실제 구현은 4개의 하위 SPEC으로 분할되어 있습니다.
> 각 하위 SPEC은 독립적으로 실행 가능하며, 순차적 의존성을 가집니다.

## Executive Summary

**Purpose**: Implement a hybrid component system that combines pre-built reference implementations (Tier 1) with LLM-generated custom components (Tier 2), enabling consistent high-quality code generation across diverse themes through CSS Variables-based theming.

**Scope Overview**: This master SPEC has been decomposed into 4 sequential sub-SPECs:

1. **[SPEC-COMPONENT-001-A](../SPEC-COMPONENT-001-A/spec.md)**: 3-Layer Token System Architecture
2. **[SPEC-COMPONENT-001-B](../SPEC-COMPONENT-001-B/spec.md)**: Component Interface & Schema Definition
3. **[SPEC-COMPONENT-001-C](../SPEC-COMPONENT-001-C/spec.md)**: @tekton/ui Reference Implementation Library
4. **[SPEC-COMPONENT-001-D](../SPEC-COMPONENT-001-D/spec.md)**: Hybrid Export System & Generation Pipeline

**Priority**: HIGH - Foundational architecture for scalable design system code generation.

**Impact**: Transforms Tekton from "component name catalog" to "full component system" with:
- 100% quality guarantee for 20 core components (Tier 1)
- 90%+ quality for custom/composite components via LLM (Tier 2)
- Theme-agnostic code through CSS Variables binding

**Key Design Decisions**:
- **Token Binding**: CSS Variables as the bridge between Theme and Components
- **Reference First**: shadcn-inspired pre-built components, not runtime generation
- **Hybrid Export**: Core components copied, custom components LLM-generated
- **Web-First**: React/Next.js with Radix primitives, extensible interface for future platforms

**Differentiators**:
- **vs shadcn**: Dynamic theme binding, not static copy-paste
- **vs Material-UI**: Theme-agnostic tokens, not coupled theming
- **vs Tailwind UI**: Programmatic generation, not manual templates

---

## SUB-SPECS OVERVIEW

### SPEC-COMPONENT-001-A: 3-Layer Token System Architecture

**Purpose**: Foundation token architecture (Atomic → Semantic → Component)

**Key Deliverables**:
- Token type definitions (`@tekton/core/src/tokens.ts`)
- Token resolution logic with fallback chain
- CSS Variables generation from tokens
- Dark mode token support

**Dependencies**: None (foundation layer)

**Status**: Planned

**Run Command**: `/moai:2-run SPEC-COMPONENT-001-A`

---

### SPEC-COMPONENT-001-B: Component Interface & Schema Definition

**Purpose**: Platform-agnostic component contracts for all 20 core components

**Key Deliverables**:
- Component schema type definitions
- 20 core component schemas (Button, Input, Card, etc.)
- Token binding specifications
- Accessibility requirements (WCAG 2.1 AA)

**Dependencies**: SPEC-COMPONENT-001-A (token types)

**Status**: Planned

**Run Command**: `/moai:2-run SPEC-COMPONENT-001-B`

---

### SPEC-COMPONENT-001-C: @tekton/ui Reference Implementation Library

**Purpose**: High-quality reference implementations for Tier 1 components

**Key Deliverables**:
- @tekton/ui package with 20 components
- Radix UI primitive wrappers
- CVA-based variant management
- CSS Variables integration
- 90%+ test coverage

**Dependencies**:
- SPEC-COMPONENT-001-A (token types)
- SPEC-COMPONENT-001-B (component schemas)

**Status**: Planned

**Run Command**: `/moai:2-run SPEC-COMPONENT-001-C`

---

### SPEC-COMPONENT-001-D: Hybrid Export System & Generation Pipeline

**Purpose**: Complete code generation pipeline with Tier 1/2 routing

**Key Deliverables**:
- CSS Variables generator (Theme → CSS)
- Tier 1 resolver (copy from @tekton/ui)
- Tier 2 LLM generator (schema + examples → code)
- Validation & retry logic
- Hybrid routing in export-screen tool

**Dependencies**:
- SPEC-COMPONENT-001-A (CSS generation)
- SPEC-COMPONENT-001-B (schemas for LLM context)
- SPEC-COMPONENT-001-C (Tier 1 components to copy)

**Status**: Planned

**Run Command**: `/moai:2-run SPEC-COMPONENT-001-D`

---

## IMPLEMENTATION ROADMAP

### Phase A: Token Foundation (SPEC-001-A)
**Timeline**: Week 1
**Effort**: Medium
**Milestone**: Token system operational, CSS generation working

**Completion Criteria**:
- ✅ Token types compile with TypeScript strict mode
- ✅ Token resolver handles all valid references
- ✅ CSS Variables generator produces valid CSS
- ✅ Dark mode CSS generation works

**Next**: Proceed to SPEC-001-B

---

### Phase B: Component Contracts (SPEC-001-B)
**Timeline**: Week 1-2
**Effort**: Large (20 schemas)
**Milestone**: All component APIs documented

**Completion Criteria**:
- ✅ All 20 component schemas defined
- ✅ Token bindings documented for each component
- ✅ Accessibility requirements specified
- ✅ Schema validation passes

**Next**: Proceed to SPEC-001-C

---

### Phase C: Reference Library (SPEC-001-C)
**Timeline**: Week 2-4
**Effort**: Very Large (20 implementations)
**Milestone**: @tekton/ui package ready for production

**Completion Criteria**:
- ✅ All 20 components implemented
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ Zero hardcoded colors
- ✅ 90%+ test coverage

**Next**: Proceed to SPEC-001-D

---

### Phase D: Export Pipeline (SPEC-001-D)
**Timeline**: Week 4-5
**Effort**: Large
**Milestone**: Complete hybrid export system operational

**Completion Criteria**:
- ✅ CSS generation integrated
- ✅ Tier 1 export working
- ✅ Tier 2 LLM generation achieving 90%+ success
- ✅ Hybrid routing functional

**Next**: Integration testing and SPEC-COMPONENT-001 completion

---

## DEPENDENCY GRAPH

```
SPEC-001-A (Token System)
    ↓
SPEC-001-B (Component Schemas) ← depends on token types
    ↓
SPEC-001-C (@tekton/ui) ← depends on tokens + schemas
    ↓
SPEC-001-D (Export Pipeline) ← depends on all above
```

**Execution Strategy**: Sequential (Phase A → B → C → D)

**Rationale**: Each phase provides foundation for the next. No parallel execution possible due to hard dependencies.

---

## ENVIRONMENT

### Current System Context

**Tekton Project Architecture:**
- **Monorepo Structure**: pnpm workspaces with packages for contracts, presets, token-generator, CLI, VS Code extension
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

### Phase A: Headless Component Hooks - Implementation Success Criteria
- ✅ **COMPLETED** - All 20 headless hooks implemented with full TypeScript support (U-002)
  - 5 Tier 1 hooks: Button, Input, Checkbox, Radio, Toggle
  - 5 Tier 2 hooks: Select, Tabs, Breadcrumb, Pagination, Slider
  - 5 Tier 3 hooks: Modal, Tooltip, DropdownMenu, Alert, Popover
  - 5 Tier 4 hooks: Card, Avatar, Badge, Divider, Progress
- ✅ **COMPLETED** - Zero styling logic in hook implementations (UW-001)
- ✅ **COMPLETED** - ARIA attributes applied correctly for all components (U-001)
- ✅ **COMPLETED** - Keyboard navigation functional for all interactive components (E-001)
- ✅ **COMPLETED** - Test coverage ≥85% for all hooks (U-005)

### Phase A: Headless Component Hooks - Quality Success Criteria
- ✅ **COMPLETED** - All Component Contract validations pass for headless hooks (A-006)
- ⏳ **IN PROGRESS** - Screen reader compatibility validated with NVDA, JAWS, VoiceOver (U-001)
  - Recommendation: Manual screen reader testing before production deployment
- ✅ **COMPLETED** - TypeScript strict mode compilation with zero errors (U-002)
- ⏳ **IN PROGRESS** - Cross-browser testing passed (Chrome, Safari, Firefox) (A-002)
  - Recommendation: Cross-browser validation in staging environment

### Phase A: Headless Component Hooks - Integration Success Criteria
- ⏳ **PENDING** - Hooks integrate with SPEC-COMPONENT-003 styled wrappers (zero friction)
  - Blocked by: SPEC-COMPONENT-003 not yet initiated
- ✅ **COMPLETED** - Hooks support both controlled and uncontrolled modes (S-002)
- ✅ **COMPLETED** - Documentation includes usage examples for all 20 components

### Phase B: Component Schemas & Validation - Implementation Success Criteria
- ✅ **COMPLETED** - All 20 component schemas defined with TypeScript types
  - 10 Primitive components: Button, Input, Text, Heading, Checkbox, Radio, Switch, Slider, Badge, Avatar
  - 10 Composed components: Card, Modal, Dropdown, Tabs, Link, Table, List, Image, Form, Progress
- ✅ **COMPLETED** - ComponentSchema interface with PropDefinition, TokenBindings, A11yRequirements
- ✅ **COMPLETED** - Token bindings template system with {variant}, {size}, {color} support
- ✅ **COMPLETED** - Zod-based runtime validation for all schema types
- ✅ **COMPLETED** - Test coverage ≥95% for schema validation (97.05% achieved)
- ✅ **COMPLETED** - TypeScript exports for ALL_COMPONENTS, PRIMITIVE_COMPONENTS, COMPOSED_COMPONENTS

### Phase B: Component Schemas & Validation - Quality Success Criteria
- ✅ **COMPLETED** - 8 validation utilities implemented and tested
  - validateComponentSchema, validateAllSchemas, validateProp, validateA11y
  - validateTokenBindings, getValidationSummary, assertValidSchema, assertAllSchemasValid
- ✅ **COMPLETED** - All 20 schemas pass Zod validation without errors
- ✅ **COMPLETED** - WCAG 2.1 AA compliance referenced in all a11y requirements
- ✅ **COMPLETED** - Template variable bindings tested for dynamic token resolution
- ✅ **COMPLETED** - Comprehensive test suite (383 lines) covering all schema types

### Phase B: Component Schemas & Validation - Integration Success Criteria
- ✅ **COMPLETED** - Schemas export as TypeScript modules (component-schemas.ts)
- ✅ **COMPLETED** - Validation exports as TypeScript modules (schema-validation.ts)
- ⏳ **PENDING** - Integration with token generation system for runtime token binding
  - To be completed in SPEC-COMPONENT-003
- ⏳ **PENDING** - Platform-agnostic schema consumption (React Native, Vue, Svelte)
  - To be validated in future multi-framework support phase

---

## REFERENCES

- [Component Contract System](../../../packages/contracts/README.md)
- [Screen Contract Architecture](../../../packages/contracts/src/screen/README.md)
- [React 19 Hooks API](https://react.dev/reference/react)
- [ARIA 1.2 Specification](https://www.w3.org/TR/wai-aria-1.2/)
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [TRUST 5 Framework](../../../.claude/skills/moai-foundation-core/modules/trust-5-framework.md)

---

**Last Updated**: 2026-01-26
**Status**: Phase A & B Completed - Ready for Phase C Integration
**Phase Status**:
- Phase A (Headless Component Hooks): ✅ 100% Complete (2026-01-16)
- Phase B (Component Schemas & Validation): ✅ 100% Complete (2026-01-26)
- Phase C (Styled Component Wrappers): ⏳ Pending

**Next Steps**:
1. Integrate component schemas with token generation system (SPEC-COMPONENT-003)
2. Generate runtime token binding resolver using template variables
3. Create platform-agnostic schema exports for multi-framework support
4. Execute manual screen reader testing (NVDA, JAWS, VoiceOver) for Phase A hooks
5. Perform cross-browser validation in staging environment
6. Initiate SPEC-COMPONENT-003 (Styled Component Wrappers) with schema integration
