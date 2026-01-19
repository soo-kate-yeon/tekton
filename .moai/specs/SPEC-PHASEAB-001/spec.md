---
id: SPEC-PHASEAB-001
version: "1.0.0"
status: "complete"
created: "2026-01-11"
updated: "2026-01-12"
author: "Claude Sonnet 4.5"
priority: "HIGH"
---

## HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-11 | Claude Sonnet 4.5 | Initial SPEC creation for FigmArchitect Phase A - Design System Foundation |
| 1.1.0 | 2026-01-12 | Claude Sonnet 4.5 | Phase A completion: All 3 packages (A1, A2, A3) implemented, 26/26 acceptance criteria met, status changed to "complete" |

# SPEC-PHASEAB-001: FigmArchitect Phase A - Design System Foundation

## Overview

**Purpose**: Establish production-ready design system infrastructure through 3-package monorepo implementation providing theme-driven token generation and component contracts for Next.js + Tailwind CSS + shadcn/ui applications.

**Scope**: Phase A comprises three foundational packages:
- A1: Theme definition system for technology stack configuration
- A2: OKLCH-based design token generator with accessibility validation
- A3: Component contract system with comprehensive shadcn/ui coverage

**Technology Stack**:
- TypeScript 5.0+
- OKLCH color generation: culori ^4.0.0
- Accessibility validation: chroma-js ^2.4.0
- Testing framework: Vitest ^1.0.0
- Target environments: Next.js 14+, Tailwind CSS 3.4+, shadcn/ui

**Success Criteria**:
- Deterministic token generation (same input = same output)
- WCAG AA compliance (≥4.5:1 contrast for all text)
- Test coverage ≥85% across all packages
- Zero external runtime dependencies in core packages

## TAG BLOCK

```
TAGS: [DESIGN-SYSTEM, OKLCH, TOKEN-GENERATOR, COMPONENT-CONTRACTS, ACCESSIBILITY, WCAG-AA, THEME-SYSTEM, MONOREPO, SHADCN-UI]
PRIORITY: HIGH
COMPLEXITY: HIGH
ESTIMATED_EFFORT: 3-4 weeks
RELATED_SPECS: []
```

---

## EARS Requirements

### 1. Ubiquitous Requirements (Always Active)

**UR-001: Deterministic Output Requirement**
- The token generator **shall** produce identical output for identical input across all executions.
- **Rationale**: Reproducibility is essential for CI/CD pipelines and team collaboration.
- **Test**: Run generation 100 times with same seed and verify byte-identical output.

**UR-002: Test Coverage Requirement**
- The system **shall** maintain test coverage at or above 85 percent for all packages.
- **Rationale**: High coverage ensures code reliability and reduces production defects.
- **Test**: Execute coverage reports and verify threshold compliance.

**UR-003: Type Safety Requirement**
- All packages **shall** use strict TypeScript mode with zero any types in public APIs.
- **Rationale**: Type safety prevents runtime errors and improves developer experience.
- **Test**: Execute `tsc --noEmit` with strict mode and verify zero errors.

**UR-004: WCAG AA Compliance Requirement**
- Generated color combinations **shall** meet WCAG AA contrast requirements (≥4.5:1 for normal text, ≥3:1 for large text).
- **Rationale**: Accessibility compliance is non-negotiable for inclusive design.
- **Test**: Validate all foreground-background combinations with chroma-js contrast calculator.

**UR-005: Zero Runtime Dependencies Requirement**
- Core packages (theme, contracts) **shall** have zero external runtime dependencies.
- **Rationale**: Minimize bundle size and reduce security vulnerabilities.
- **Test**: Verify `package.json` dependencies sections contain only dev dependencies.

### 2. Event-Driven Requirements (WHEN/THEN)

**EDR-001: Theme Loading Event**
- **WHEN** a theme file is loaded, **THEN** the system **shall** validate against JSON schema before proceeding.
- **Error Handling**: If validation fails, throw descriptive error with field-level details.
- **Test**: Load invalid theme and verify detailed error message includes failing field path.

**EDR-002: Token Generation Event**
- **WHEN** token generation is requested, **THEN** the system **shall** generate palettes for primary, neutral, and all status colors (success, warning, error, info).
- **Output Format**: CSS variables string, tokens.json structure, and Tailwind extend object.
- **Test**: Verify all three outputs are present and correctly formatted.

**EDR-003: OKLCH Out-of-Gamut Event**
- **WHEN** OKLCH color exceeds sRGB gamut boundaries, **THEN** the system **shall** apply gamut clipping using culori's clampChroma function.
- **Fallback Strategy**: Reduce chroma incrementally while maintaining hue and lightness.
- **Test**: Generate highly saturated colors and verify sRGB validity.

**EDR-004: Contract Violation Detection Event**
- **WHEN** a component usage is analyzed, **THEN** the system **shall** check all applicable constraints and report violations with severity level and fix suggestions.
- **Response Levels**: error (blocking), warning (advisory), info (best practice).
- **Test**: Create violation scenarios for each severity level and verify appropriate reporting.

**EDR-005: Monorepo Build Event**
- **WHEN** any package changes are committed, **THEN** the build system **shall** execute tests for changed package and all dependent packages.
- **Incremental Build**: Only rebuild affected packages to optimize CI time.
- **Test**: Modify package and verify dependent packages are tested.

### 3. State-Driven Requirements (IF/WHILE)

**SDR-001: Light Mode State**
- **IF** the system is in light mode, **THEN** neutral palette **shall** use lightness scale where 50 = background (~0.97) and 900 = foreground (~0.15).
- **Scaling Function**: Use background-based scaling with tinted or pure neutral mode.
- **Test**: Generate light mode tokens and verify neutral-50 lightness ≥ 0.95.

**SDR-002: Dark Mode State**
- **IF** the system is in dark mode, **THEN** neutral palette **shall** use lightness scale where 900 = background (~0.10) and 50 = foreground (~0.97).
- **Inversion Strategy**: Reverse lightness scale while maintaining semantic meaning.
- **Test**: Generate dark mode tokens and verify neutral-900 lightness ≤ 0.15.

**SDR-003: High Contrast Mode State**
- **IF** high contrast mode is enabled, **THEN** minimum contrast ratio **shall** be increased to 7:1 for normal text.
- **Adjustment Strategy**: Increase lightness separation between foreground and background.
- **Test**: Enable high contrast and verify all combinations meet 7:1 threshold.

**SDR-004: Custom Primary Color State**
- **IF** user provides custom primary color hex, **THEN** the system **shall** generate 10-step palette maintaining perceptual uniformity.
- **Validation**: Ensure custom color is valid hex format before processing.
- **Test**: Provide custom hex and verify 10 steps with correct lightness distribution.

**SDR-005: Contract Registry Initialized State**
- **WHILE** contract registry is initialized, **THEN** the system **shall** provide O(1) lookup time for component constraints.
- **Data Structure**: Use Map<ComponentName, ComponentContract> for efficient access.
- **Test**: Benchmark lookup time for 50+ components and verify < 1ms average.

### 4. Unwanted Behavior Requirements (SHALL NOT)

**UBR-001: Non-Deterministic Randomness**
- The token generator **shall not** use random number generation or timestamps in palette creation.
- **Violation Impact**: Breaks reproducibility and CI/CD integration.
- **Enforcement**: Code review and test verification of output consistency.

**UBR-002: Hardcoded Color Values**
- Component contracts **shall not** contain hardcoded hex color values in constraint definitions.
- **Correct Approach**: Reference semantic token names (e.g., "primary", "destructive").
- **Enforcement**: Linter rule to detect hex patterns in contract files.

**UBR-003: Accessibility Violations**
- The system **shall not** generate color combinations failing WCAG AA standards.
- **Prevention Strategy**: Validate all combinations during generation and block output if violations detected.
- **Enforcement**: Automated test suite with 100% coverage of foreground-background pairs.

**UBR-004: Breaking API Changes**
- Public package APIs **shall not** introduce breaking changes without major version bump.
- **Semver Compliance**: Follow strict semantic versioning for all packages.
- **Enforcement**: API compatibility tests in CI pipeline.

**UBR-005: Circular Package Dependencies**
- Monorepo packages **shall not** create circular dependency relationships.
- **Dependency Graph**: theme ← token-generator ← contracts (unidirectional only).
- **Enforcement**: Build-time dependency graph validation.

### 5. Complex Requirements (Multi-Condition)

**CR-001: OKLCH Palette Generation with Gamut Handling**
- **WHILE** generating primary palette, **WHEN** target color exceeds sRGB gamut, **THEN** the system **shall** clamp chroma while preserving lightness and hue, **AND** log gamut clipping events for debugging.
- **Multi-Step Process**: (1) Calculate OKLCH values, (2) Check gamut, (3) Apply clampChroma if needed, (4) Convert to hex.
- **Test**: Generate saturated blues and verify clipping logs appear without breaking generation.

**CR-002: Neutral Palette with Background Tinting**
- **IF** neutral tone is set to "tinted", **THEN** the system **shall** use primary hue with reduced chroma (0.012), **WHILE** maintaining lightness scale based on light/dark mode.
- **Coordination**: Neutral palette must harmonize with primary palette through shared hue.
- **Test**: Set tinted neutral with blue primary and verify neutral has slight blue undertone.

**CR-003: Component Contract Validation with Auto-Fix**
- **WHEN** a constraint violation is detected, **IF** the constraint has autoFixable=true, **THEN** the system **shall** provide fix suggestion in error message, **AND** enable one-click fix application in IDE extension.
- **Fix Application**: Modify component props or structure to resolve violation.
- **Test**: Trigger auto-fixable violation and verify fix suggestion is accurate and applicable.

**CR-004: Multi-Package Build Orchestration**
- **WHEN** token-generator changes are committed, **THEN** the build system **shall** rebuild token-generator tests, **AND** rebuild contracts tests (due to dependency), **AND** skip theme tests (no dependency), **WHILE** running all builds in parallel where possible.
- **Optimization**: Topological sort of dependency graph for parallel execution.
- **Test**: Modify token-generator and verify only affected packages rebuild.

**CR-005: Cross-Package Type Consistency**
- **WHILE** maintaining shared types (e.g., ShadcnComponent), **IF** type is updated in one package, **THEN** all dependent packages **shall** reflect the change, **AND** TypeScript compiler **shall** detect any inconsistencies at build time.
- **Shared Types Strategy**: Use workspace types package or careful re-export management.
- **Test**: Add new component to ShadcnComponent type and verify contracts package sees update.

---

## Architecture Design

### Package Dependency Graph

```
┌─────────────────┐
│   theme        │  ← Configuration layer
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ token-generator │  ← Generation layer
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   contracts     │  ← Validation layer
└─────────────────┘

Dependency Direction: Top → Bottom (Unidirectional)
```

### Data Flow

```
User Input (Q&A)
     │
     ▼
TokenQuestionnaire (schema)
     │
     ▼
generateTokens() ──→ OKLCH Palette Generation
     │                      │
     │                      ├─ Primary Palette (10 steps)
     │                      ├─ Neutral Palette (background-based)
     │                      └─ Status Palettes (4 colors)
     │
     ▼
Token Output:
├─ cssVariables (string)
├─ tokensJson (DTCG format)
└─ tailwindExtend (object)
     │
     ▼
Application in Next.js Project
```

### OKLCH Color Generation Algorithm

```
Input: Primary hex color (e.g., #3b82f6)
       ↓
Convert to OKLCH using culori
       ↓
For each step (50, 100, ..., 900):
       ↓
Calculate target lightness from LIGHTNESS_SCALE
       ↓
Calculate chroma: base_chroma × chromaScale
       ↓
Preserve hue from base color
       ↓
Check if result is in sRGB gamut
       ↓
If out-of-gamut: Apply clampChroma
       ↓
Convert to hex and store
       ↓
Output: ColorScale with 10 steps
```

---

## Component Contract Schema

### Contract Structure

```typescript
ComponentContract {
  component: ShadcnComponent,
  version: string,
  category: ComponentCategory,
  constraints: Constraint[],
  bestPractices?: BestPractice[]
}

Constraint {
  id: string,              // e.g., "BTN-A01"
  severity: 'error' | 'warning' | 'info',
  description: string,
  rule: ConstraintRule,
  message: string,
  autoFixable: boolean,
  fixSuggestion?: string
}
```

### Constraint Rule Types

1. **PropCombinationRule**: Validates prop combinations (forbidden/required)
2. **ChildrenRule**: Validates child component structure
3. **AccessibilityRule**: Enforces WCAG compliance
4. **ContextRule**: Defines allowed/forbidden usage contexts
5. **CompositionRule**: Manages component relationships
6. **StateRule**: Validates state management patterns

---

## Technology Decisions

### Why OKLCH?

- **Perceptual Uniformity**: Equal lightness steps appear equally spaced to human eye
- **Gamut Independence**: Supports future wide-gamut displays (P3, Rec.2020)
- **Predictable Behavior**: Chroma adjustments don't shift hue
- **Industry Adoption**: CSS Color Level 4 specification, Safari 15+, Chrome 111+

### Why culori?

- **Comprehensive Color Space Support**: OKLCH, Lab, LCH, sRGB, P3
- **Gamut Mapping**: Built-in clampChroma for safe sRGB conversion
- **TypeScript Support**: Full type definitions
- **Bundle Size**: 15KB gzipped (tree-shakeable)

### Why Monorepo?

- **Shared Types**: Single source of truth for ShadcnComponent type
- **Atomic Changes**: Update multiple packages in single commit
- **Consistent Versioning**: All packages released together
- **Simplified Testing**: Cross-package integration tests

---

## Quality Gates

### Pre-Commit Checks

1. **Type Safety**: `tsc --noEmit` must pass
2. **Linting**: `eslint` with zero errors
3. **Formatting**: `prettier` auto-format
4. **Unit Tests**: All tests pass with ≥85% coverage

### CI/CD Pipeline Checks

1. **Build**: All packages build successfully
2. **Test**: Unit + integration tests pass
3. **Accessibility**: WCAG validation suite passes
4. **Bundle Size**: No package exceeds size budget (token-generator: 50KB, contracts: 100KB)
5. **Type Coverage**: 100% type coverage in public APIs

### Release Criteria

1. **Documentation**: All public APIs documented with TSDoc
2. **Examples**: Working examples for each package
3. **Migration Guide**: If breaking changes exist
4. **Changelog**: Following Keep a Changelog format

---

## Risk Mitigation

### Risk 001: OKLCH Browser Compatibility

**Risk**: Older browsers don't support OKLCH CSS syntax.
**Mitigation**: Generate HSL fallback values alongside OKLCH values.
**Implementation**: Provide both `oklchToHSL` converter and direct OKLCH strings.

### Risk 002: Gamut Clipping Quality

**Risk**: Clipped colors may lose vibrancy or become indistinguishable.
**Mitigation**: Log clipping events and provide visual preview in IDE extension.
**Implementation**: Track `clippingOccurred` boolean and include in tokens.json metadata.

### Risk 003: Contract Coverage Gaps

**Risk**: Not all shadcn components have contracts initially.
**Mitigation**: Phased rollout with MVP (8 components) → P1 (16 components) → Full (50 components).
**Implementation**: Graceful degradation when component has no contract defined.

### Risk 004: Performance at Scale

**Risk**: Contract validation may slow down large codebases.
**Mitigation**: Implement constraint indexing and caching for frequently checked components.
**Implementation**: O(1) lookup with Map data structure.

---

## Traceability

This SPEC implements the design system foundation described in `tekton-phase-ab-spec.md`.

**Alignment with Technical Specification**:
- Section A1 (Theme) → Package: theme
- Section A2 (Token Generator) → Package: token-generator
- Section A3 (Contracts) → Package: contracts

**Quality Framework**: Adheres to TRUST 5 principles (Testable, Readable, Unified, Secured, Trackable).

**Testing Strategy**: Follows TDD approach with RED-GREEN-REFACTOR cycles.
