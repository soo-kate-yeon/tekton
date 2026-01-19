# Implementation Plan: SPEC-COMPONENT-001

**SPEC ID**: SPEC-COMPONENT-001
**Version**: 1.0.0
**Status**: Draft
**Priority**: HIGH

---

## Overview

**Purpose**: Implement hook-prop-based component system enabling AI-driven component generation through single-prompt interactions.

**Approach**: Create systematic mapping from 20 headless hooks to styling components with three-layer structure: Hook Prop Rules, State-Style Mapping, and Variant Branching.

**Target**: Enable single-prompt AI component generation workflow integrated with Token Contract CSS variables.

**Dependencies**:
- SPEC-COMPONENT-001: 20 headless hooks (completed)
- SPEC-COMPONENT-002: Token Contract CSS variables (completed)

---

## Phase 1: Hook Prop Mapping System

**Priority**: HIGH

### Objective
Create complete inventory of 20 hooks with prop object identification and base styling rules.

### Tasks

**Task 1.1: Hook Signature Analysis**
- Analyze all 20 hook signatures from SPEC-COMPONENT-001
- Document hook return values (prop objects and state values)
- Create Hook-to-Prop inventory table
- Validation: All 20 hooks documented with complete return value signatures

**Task 1.2: Hook-to-Prop Rule Table Creation**
- Define TypeScript interface for HookPropRule schema
- Create base style definitions for each hook
- Map prop objects to CSS properties using Token Contract variables
- Validation: HookPropRule schema validates against JSON Schema

**Task 1.3: Base Style Definition**
- For each hook, define baseline CSS properties for prop objects
- Reference only Token Contract CSS variables (no hardcoded values)
- Document required CSS variable dependencies per hook
- Validation: CSS variable existence tests pass, no hardcoded values detected

**Task 1.4: Tier 1-4 Hook Coverage**
- **Tier 1 (Component)**: useButton, useToggleButton, useSwitch, useCheckbox, useRadio, useTextField
- **Tier 2 (Overlay)**: useDialog, useModal, usePopover, useTooltip
- **Tier 3 (Navigation)**: useTabs, useBreadcrumbs, useMenu, useDropdown
- **Tier 4 (Display)**: useAccordion, useTable, usePagination, useProgress, useCalendar, useRangeCalendar
- Validation: All 20 hooks have complete Hook Prop Rules

### Deliverables
- `hook-prop-rules.json`: Complete mapping for all 20 hooks
- `hook-inventory.md`: Human-readable hook documentation
- TypeScript types: `HookPropRule` interface definition
- Unit tests: Hook prop rule validation tests

### Success Criteria
- ✅ All 20 hooks documented with prop object mappings
- ✅ All base styles reference valid Token Contract CSS variables
- ✅ JSON Schema validation passes for all Hook Prop Rules
- ✅ Test coverage ≥85% for hook prop mapping code

---

## Phase 2: State-to-Style Mapping

**Priority**: HIGH

### Objective
Define visual feedback rules for all hook state values (boolean, numeric, composite).

### Tasks

**Task 2.1: State Inventory Creation**
- Extract all state values from 20 hook return signatures
- Categorize states by type: boolean (isPressed), numeric (currentPage), composite (selectedKeys)
- Document visual feedback requirements per state
- Validation: State inventory completeness verified against hook signatures

**Task 2.2: State-Style JSON Schema Definition**
- Define TypeScript interface for StateStyleMapping
- Create schema for state visual feedback rules
- Include CSS property mappings and transition definitions
- Validation: Schema validates with JSON Schema standard

**Task 2.3: Visual Feedback Rule Definition**
- For boolean states: Define hover, active, focus, disabled visual feedback
- For numeric states: Define progress, pagination, slider visual feedback
- For composite states: Define selection, multi-select visual feedback
- Validation: All states have complete visual feedback definitions

**Task 2.4: Transition and Animation Specifications**
- Define CSS transitions for state changes (duration, easing)
- Document animation requirements (fade, slide, scale)
- Ensure WCAG compliance for motion preferences
- Validation: Transition definitions follow CSS spec, prefers-reduced-motion respected

### Deliverables
- `state-style-mapping.json`: Complete state mappings for all 20 hooks
- `state-inventory.md`: State documentation with visual feedback descriptions
- TypeScript types: `StateStyleMapping` interface definition
- Unit tests: State mapping validation tests

### Success Criteria
- ✅ All hook states have state-style mappings
- ✅ Visual feedback rules reference valid Token Contract CSS variables
- ✅ Transition definitions follow CSS specifications
- ✅ Test coverage ≥85% for state mapping code

---

## Phase 3: Variant Configuration System

**Priority**: MEDIUM

### Objective
Create conditional styling logic based on hook configuration options (toggle, variant, disabled).

### Tasks

**Task 3.1: Configuration Option Documentation**
- Identify all configuration options per hook (toggle, variant, disabled, etc.)
- Document option types: boolean, string, enum
- List possible values for each option
- Validation: Configuration options match hook API documentation

**Task 3.2: Variant-to-Style Branching Schema**
- Define TypeScript interface for VariantBranching
- Create conditional logic schema (if-then style rules)
- Document precedence rules when multiple variants apply
- Validation: Schema validates with JSON Schema standard

**Task 3.3: Conditional Style Rule Definition**
- For each configuration option, define style rules per value
- Create decision trees for complex multi-option scenarios
- Document variant combinations (e.g., toggle + variant + disabled)
- Validation: Variant rules cover all documented option combinations

**Task 3.4: Theme Integration**
- Map variant styles to 7 Token Contract themes (Professional, Creative, etc.)
- Ensure variant styles respect theme color semantics
- Document theme-specific variant overrides
- Validation: Variant styles work correctly with all 7 themes

### Deliverables
- `variant-branching.json`: Variant rules for all 20 hooks
- `variant-decision-trees.md`: Complex variant scenario documentation
- TypeScript types: `VariantBranching` interface definition
- Unit tests: Variant branching validation tests

### Success Criteria
- ✅ All hook configuration options documented
- ✅ Variant rules defined for all option combinations
- ✅ Decision trees handle complex multi-variant scenarios
- ✅ Test coverage ≥85% for variant branching code

---

## Phase 4: Layer 4 Structure Template System

**Priority**: HIGH

### Objective
Create HTML structure templates and JSX patterns for all 20 hooks to enable complete AI component generation following Layer 4 architecture.

### Tasks

**Task 4.1: HTML Element Mapping**
- Define recommended HTML elements for each hook (button, dialog, input, etc.)
- Document semantic HTML requirements for accessibility compliance
- Create element selection decision tree (when to use button vs div with role)
- Establish HTML5 element usage guidelines per hook type
- Validation: All 20 hooks have recommended HTML element mappings

**Task 4.2: Component Structure Templates**
- Design JSX template structure for each hook
- Define child element ordering (icon placement, label position)
- Document container/wrapper patterns for layout consistency
- Specify className conventions for styling hooks
- Validation: JSX templates validated against React best practices

**Task 4.3: Nested Component Structures**
- Define complex component structures (Dropdown = Trigger + Menu + Items)
- Document parent-child relationships for composite components
- Create composition patterns for multi-part components (Dialog, Popover, Tabs)
- Establish nesting depth guidelines and anti-patterns
- Validation: Nested structures cover all complex hooks (Dialog, Dropdown, Menu, Tabs, Accordion)

**Task 4.4: Structure-Component Integration**
- Map structure templates to Hook Prop Rules from Phase 1
- Integrate state-style mappings into JSX templates from Phase 2
- Apply variant branching to structure variations from Phase 3
- Document prop spreading patterns for hook prop objects
- Validation: Structure templates correctly consume Component rules

**Task 4.5: SPEC-COMPONENT-003 Alignment**
- Coordinate with SPEC-COMPONENT-003 (@tekton/components package scope)
- Define interface between component templates and production components
- Document structure template handoff requirements
- Establish migration path from component templates to production
- Validation: Templates align with SPEC-COMPONENT-003 component API

**Task 4.6: Accessibility and Semantic Best Practices**
- Document ARIA attribute placement in structure templates
- Define landmark region usage for complex components
- Establish keyboard navigation patterns per template
- Document focus management for overlay components
- Validation: All templates pass WCAG 2.1 AA accessibility audit

### Deliverables
- `structure-templates.json`: HTML/JSX templates for all 20 hooks
- `element-mapping.md`: Semantic HTML element selection guide
- `composition-patterns.md`: Nested component structure documentation
- TypeScript types: `StructureTemplate` interface definition
- Integration tests: Structure template validation tests
- Accessibility audit report: WCAG compliance verification

### Success Criteria
- ✅ All 20 hooks have complete structure templates with semantic HTML
- ✅ Templates follow React best practices and accessibility standards
- ✅ Nested structures documented for all complex components
- ✅ Integration with Phases 1-3 component rules validated
- ✅ Templates align with SPEC-COMPONENT-003 scope and interface
- ✅ Test coverage ≥85% for structure template code

---

## Phase 5: preset_archetypes.md Creation

**Priority**: HIGH

### Objective
Create comprehensive component documentation consumable by AI for single-prompt component generation.

### Tasks

**Task 5.1: Documentation Structure Design**
- Define preset_archetypes.md outline and organization
- Create table of contents with navigation structure
- Establish markdown formatting conventions
- Validation: Documentation structure reviewed and approved

**Task 5.2: Hook Prop Rules Section**
- Document Hook Prop Rules for all 20 hooks
- Include prop object listings, base styles, required CSS variables
- Provide code examples for each hook
- Validation: Hook Prop Rules section complete and accurate

**Task 5.3: State-Style Mapping Section**
- Document State-Style Mappings for all hook states
- Include visual feedback descriptions and CSS property details
- Provide state transition examples
- Validation: State-Style section complete and accurate

**Task 5.4: Variant Branching Section**
- Document Variant Branching rules for all hooks
- Include decision trees for complex scenarios
- Provide variant combination examples
- Validation: Variant Branching section complete and accurate

**Task 5.5: Structure Template Section**
- Document HTML/JSX structure templates from Phase 4
- Include element selection guidelines and composition patterns
- Provide nested component structure examples
- Validation: Structure Template section complete and accurate

**Task 5.6: AI Prompting Examples Section**
- Create 10+ single-prompt component generation examples
- Include simple scenarios (basic button) and complex scenarios (toggle button with variant)
- Document expected AI interpretation and component output
- Validation: AI prompting examples tested with Claude Sonnet 4.5

**Task 5.7: Token Contract Integration Section**
- Document CSS variable naming conventions
- Explain theme integration (Professional, Creative, etc.)
- Provide dark mode handling guidance
- Validation: Integration section accurate and complete

### Deliverables
- `preset_archetypes.md`: Complete component documentation with Layer 4 Structure
- AI prompting examples: 10+ tested scenarios
- JSON Schema validation: Schema for component structure
- Integration guide: Token Contract integration documentation

### Success Criteria
- ✅ preset_archetypes.md includes all Hook Prop Rules, State-Style Mappings, Variant Branching, Structure Templates
- ✅ AI prompting examples generate working components without clarification
- ✅ Documentation validates against JSON Schema
- ✅ User testing confirms documentation clarity

---

## Phase 6: Integration and Validation

**Priority**: HIGH

### Objective
Validate component system integration with SPEC-COMPONENT-001 hooks, SPEC-COMPONENT-002 Token Contract, and Layer 4 Structure templates.

### Tasks

**Task 6.1: Hook API Compatibility Validation**
- Execute integration tests with all 20 hooks from SPEC-COMPONENT-001
- Verify prop object names match component documentation
- Validate state values match component state mappings
- Validation: Integration tests pass without API mismatches

**Task 6.2: CSS Variable Reference Validation**
- Verify all component CSS variable references exist in Token Contract
- Test component styles with all 7 Token Contract themes
- Validate dark mode CSS variable resolution
- Validation: CSS variable existence tests pass for all themes

**Task 6.3: Structure Template Integration Testing**
- Validate HTML structure templates with all 20 hooks
- Test JSX templates render correctly with hook prop objects
- Verify nested component structures work with complex hooks
- Validation: Structure template integration tests pass

**Task 6.4: AI Prompting Workflow Testing**
- Test single-prompt component generation with Claude Sonnet 4.5
- Measure prompt success rate (target: 90%+ without clarification)
- Validate generated components use correct structure templates
- Document edge cases requiring multi-step dialogue
- Validation: AI prompting success rate meets target

**Task 6.5: Performance Validation**
- Profile JSON Schema validation performance (target: <5ms per component)
- Measure component documentation loading time
- Validate component rule application performance
- Test structure template parsing performance
- Validation: Performance metrics meet targets

**Task 6.6: Quality Gate Validation**
- Execute TRUST 5 framework validation (test coverage, readability, security)
- Verify ≥85% test coverage across all component code
- Run linting and formatting checks
- Validate accessibility compliance for structure templates
- Validation: All quality gates pass

### Deliverables
- Integration test suite: Hook API compatibility tests
- CSS variable validation tests: Token Contract integration tests
- Structure template tests: JSX rendering and composition tests
- AI prompting test report: Success rate and edge case documentation
- Performance benchmarks: Validation and loading performance metrics
- Quality gate report: TRUST 5 framework validation results

### Success Criteria
- ✅ Integration tests pass with SPEC-COMPONENT-001 hooks
- ✅ CSS variable references resolve correctly in all 7 themes
- ✅ Structure templates render correctly with all 20 hooks
- ✅ AI prompting success rate ≥90%
- ✅ Performance metrics meet targets (<5ms validation)
- ✅ Test coverage ≥85% achieved

---

## Technical Stack

**Core Technologies:**
- TypeScript 5.9+ (component type definitions)
- JSON Schema (component validation)
- Markdown (preset_archetypes.md documentation)
- CSS Custom Properties (Token Contract integration)

**Hook System:**
- React 19 (headless hooks runtime)
- React Aria (hook foundation library)

**Testing:**
- Vitest (unit tests, integration tests)
- @testing-library/react (component integration tests)
- Zod (runtime validation - optional)

**Development:**
- pnpm workspaces (monorepo)
- ESLint + Prettier (code quality)
- TypeScript strict mode

---

## Implementation Milestones

**Milestone 1: Hook Prop Analysis Complete** (Priority: HIGH)
- Deliverable: Hook-to-Prop inventory, HookPropRule schema, base style definitions
- Acceptance: All 20 hooks documented, JSON Schema validation passes

**Milestone 2: State Mapping System Complete** (Priority: HIGH)
- Deliverable: State inventory, StateStyleMapping schema, visual feedback rules
- Acceptance: All hook states mapped, transition definitions complete

**Milestone 3: Variant Branching Complete** (Priority: MEDIUM)
- Deliverable: Variant rules, decision trees, theme integration
- Acceptance: All configuration options documented, variant rules defined

**Milestone 4: Layer 4 Structure Templates Complete** (Priority: HIGH)
- Deliverable: structure-templates.json, element-mapping.md, composition-patterns.md
- Acceptance: All 20 hooks have structure templates, integration with Phases 1-3 validated

**Milestone 5: AI Prompting Documentation Complete** (Priority: HIGH)
- Deliverable: preset_archetypes.md with all sections including Structure Templates, AI prompting examples
- Acceptance: Documentation validates, AI prompting examples tested

**Milestone 6: Integration Validation Complete** (Priority: HIGH)
- Deliverable: Integration tests, structure template tests, performance benchmarks, quality gate results
- Acceptance: All tests pass, structure templates validated, performance targets met, quality gates satisfied

---

## Risk Analysis

### High-Risk Areas

**Risk 1: Hook API Changes** (Likelihood: LOW, Impact: HIGH)
- **Mitigation**: Semantic versioning monitoring, integration tests, breaking change detection
- **Contingency**: Component rule update workflow, backward compatibility layer

**Risk 2: AI Prompting Misalignment** (Likelihood: MEDIUM, Impact: MEDIUM)
- **Mitigation**: Iterative AI prompting tests, documentation refinement, example expansion
- **Contingency**: Multi-step dialogue fallback, clarification prompts

**Risk 3: Token Contract Integration Complexity** (Likelihood: LOW, Impact: MEDIUM)
- **Mitigation**: CSS variable existence validation, integration tests, reference integrity checks
- **Contingency**: CSS variable fallback mechanism, error handling

### Medium-Risk Areas

**Risk 4: Documentation Scalability** (Likelihood: MEDIUM, Impact: LOW)
- **Mitigation**: Structured documentation organization, modular component definitions
- **Contingency**: Documentation restructuring, automated generation from schema

**Risk 5: Schema Validation Overhead** (Likelihood: LOW, Impact: LOW)
- **Mitigation**: Performance profiling, validation caching, schema optimization
- **Contingency**: Validation optimization, lazy validation

---

## Quality Metrics

**Test Coverage:**
- Target: ≥85% code coverage (TRUST 5 framework requirement)
- Measurement: Vitest coverage reporting

**AI Prompting Success Rate:**
- Target: ≥90% single-prompt success without clarification
- Measurement: AI prompting test suite results

**Performance:**
- JSON Schema validation: <5ms per component
- Documentation loading: <100ms for preset_archetypes.md
- Component rule application: <1ms per hook

**Documentation Quality:**
- Clarity validation through user testing
- Completeness verified against JSON Schema
- Examples tested with Claude Sonnet 4.5

---

## Next Steps

**Immediate Actions:**
1. Execute `/moai:2-run SPEC-COMPONENT-001` to begin TDD implementation
2. Create `hook-prop-rules.json` schema and TypeScript types
3. Implement Hook Prop Mapping System (Phase 1)
4. Implement State-to-Style Mapping (Phase 2)
5. Implement Variant Configuration System (Phase 3)
6. Create Layer 4 Structure Template System (Phase 4) - HTML/JSX templates for all 20 hooks
7. Write integration tests with SPEC-COMPONENT-001 hooks

**Post-Implementation:**
1. Validate structure template integration with Phases 1-3 component rules
2. User testing for preset_archetypes.md clarity including structure templates
3. AI prompting workflow optimization based on test results
4. Documentation refinement based on user feedback
5. Performance optimization if targets not met

**Dependencies:**
- Phase 4 (Structure Templates) depends on completion of Phases 1-3
- Phase 5 (preset_archetypes.md) requires all prior phases including Phase 4
- Phase 6 (Integration Validation) validates complete system including structure templates

---

**Tags**: [SPEC-COMPONENT-001], [HOOK-PROP], [STATE-STYLE], [VARIANT], [THEME-DOC]

**Last Updated**: 2026-01-17
**Status**: Ready for Implementation
