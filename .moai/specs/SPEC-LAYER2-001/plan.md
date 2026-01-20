# Implementation Plan: SPEC-LAYER2-001 - Component Knowledge System

**TAG**: SPEC-LAYER2-001
**Version**: 2.0.0
**Priority**: HIGH
**Complexity**: HIGH

---

## 1. Implementation Strategy

### 1.1 Development Approach
- **Methodology**: TDD (RED-GREEN-REFACTOR cycle)
- **Phase**: Layer 2 Integration (depends on Layer 1 completion)
- **Iterations**: 5 milestones with incremental delivery

### 1.2 Technology Stack

**Core Dependencies**:
```json
{
  "dependencies": {
    "zod": "^3.23.0",
    "@vanilla-extract/css": "^1.16.0",
    "@stitches/core": "^1.2.8"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.9.0",
    "vitest": "^2.0.0",
    "@vitest/coverage-v8": "^2.0.0"
  }
}
```

**Justification**:
- **zod**: Type-safe schema validation, industry standard
- **@vanilla-extract/css**: Zero-runtime CSS-in-JS (PRIMARY)
- **@stitches/core**: Performance-focused CSS-in-JS (SECONDARY, maintenance mode)

---

## 2. Task Breakdown

### Milestone 1: Foundation and ComponentKnowledge Interface (Priority: HIGH)

**Task 1.1: Package Setup**
- Create `packages/component-knowledge/` package
- Configure TypeScript with strict mode
- Setup Vitest testing infrastructure
- Configure ESLint + Prettier

**Task 1.2: ComponentKnowledge Interface Definition**
- Define `ComponentKnowledge` TypeScript interface
- Define `slotAffinity` type with validation
- Define `semanticDescription` type
- Define `constraints` type
- Write unit tests for interface validation

**Task 1.3: Affinity and Constraint Validators**
- Implement `slotAffinity` range validator (0.0-1.0)
- Implement `excludedSlots` consistency checker
- Implement `constraints.requires` catalog validator
- Implement self-reference conflict detector
- Write unit tests for validators

**Deliverables**:
- ✅ Package structure created
- ✅ ComponentKnowledge interface defined
- ✅ Validators detect invalid affinity values
- ✅ Validators detect constraint violations
- ✅ Tests: `knowledge.test.ts`, `validators.test.ts`

**Definition of Done**:
- All interface validation tests pass
- TypeScript compiles with zero errors
- ESLint reports zero warnings

---

### Milestone 2: Token Validation and State Completeness (Priority: HIGH)

**Task 2.1: Token Validator Implementation**
- Load Layer 1 token metadata
- Implement token existence validation
- Create fuzzy suggestion algorithm for typos
- Write unit tests for validator

**Task 2.2: State Completeness Checker**
- Define required states (default, hover, focus, active, disabled)
- Implement state coverage verification
- Create empty state detector
- Create detailed error messages
- Write unit tests for completeness checker

**Task 2.3: Token Reference Resolver**
- Resolve all token references in tokenBindings
- Track all token dependencies per component
- Generate tokenReferences list for Layer 3
- Write integration tests

**Deliverables**:
- ✅ Validator detects invalid token references
- ✅ Suggestions provided for typos
- ✅ Completeness checker enforces all 5 states
- ✅ Empty states detected and rejected
- ✅ Tests: `token-validator.test.ts`, `state-completeness.test.ts`

---

### Milestone 3: 20 Core Component Knowledge Entries (Priority: HIGH)

**Task 3.1: Define ComponentKnowledge for All 20 Components**
- Button, Input, Card, Modal, Dropdown
- Checkbox, Radio, Switch, Slider, Badge
- Alert, Toast, Tooltip, Popover, Tabs
- Accordion, Select, Textarea, Progress, Avatar

**Task 3.2: slotAffinity Configuration Per Component**
- Define affinity scores for: main, sidebar, header, footer
- Add local slot affinities (card_actions, etc.)
- Validate excludedSlots consistency

**Task 3.3: semanticDescription Per Component**
- Write purpose descriptions (min 20 chars)
- Assign visualImpact (subtle/neutral/prominent)
- Assign complexity (low/medium/high)

**Task 3.4: Constraints Per Component**
- Define `requires` dependencies
- Define `conflictsWith` rules
- Define `excludedSlots`

**Task 3.5: tokenBindings Per Component**
- Define all 5 states with token references
- Define variants where applicable
- Validate all token references

**Deliverables**:
- ✅ All 20 components have complete ComponentKnowledge
- ✅ 100 states defined (20 x 5)
- ✅ All token references validated
- ✅ Tests: `component-catalog.test.ts`

---

### Milestone 4: Schema and CSS-in-JS Generation (Priority: HIGH)

**Task 4.1: Zod Schema Generator**
- Generate Zod schemas from ComponentKnowledge
- Support variant enums and size enums
- Generate TypeScript types with z.infer<>
- Write unit tests for schema correctness

**Task 4.2: Vanilla Extract Binding Generator (PRIMARY)**
- Implement Vanilla Extract binding generation
- Generate style recipes for all 20 components
- Ensure CSS variable references are correct
- Write unit tests for output format

**Task 4.3: Stitches Binding Generator (SECONDARY)**
- Implement Stitches binding generation (maintenance mode)
- Generate styled components for all 20 components
- Ensure CSS variable references are correct
- Write unit tests for output format

**Task 4.4: CSS Variable Reference Validation**
- Validate all bindings use `var(--token-name)`
- Detect hardcoded values
- Create linting rules
- Write unit tests for validation

**Deliverables**:
- ✅ All 20 components have Zod schemas
- ✅ Vanilla Extract bindings generated
- ✅ Stitches bindings generated (secondary)
- ✅ Zero hardcoded values
- ✅ Tests: `zod-schema.test.ts`, `vanilla-extract.test.ts`

---

### Milestone 5: Knowledge Export and Layer 3 Integration (Priority: HIGH)

**Task 5.1: JSON Exporter**
- Export complete ComponentKnowledge catalog as JSON
- Include schemaVersion: "2.0.0"
- Include generatedAt timestamp
- Write unit tests for JSON format

**Task 5.2: Markdown Exporter**
- Generate Markdown documentation
- Include slot affinity tables
- Include constraint descriptions
- Write unit tests for Markdown format

**Task 5.3: Layer 3 Registry Builder**
- Build registry format for Layer 3 consumption
- Include zodSchema, propsType, cssBindings
- Include tokenReferences list
- Validate against Layer 3 contract
- Write integration tests

**Task 5.4: Performance Optimization**
- Benchmark full pipeline (target: < 600ms)
- Optimize hot paths
- Add caching where beneficial
- Write performance tests

**Deliverables**:
- ✅ JSON export with schemaVersion 2.0.0
- ✅ Markdown documentation generated
- ✅ Layer 3 registry built and validated
- ✅ Full pipeline < 600ms
- ✅ Tests: `exporters.test.ts`, `performance.test.ts`

---

## 3. Architecture Design

### 3.1 Module Interaction Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│              Component Knowledge System (Layer 2)                     │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────┐                                                 │
│  │  Layer 1 Tokens │                                                 │
│  │   (Metadata)    │─────────────┐                                   │
│  └─────────────────┘             │                                   │
│                                  ▼                                   │
│                    ┌──────────────────────────┐                      │
│                    │    Token Validator       │                      │
│                    │  - Existence check       │                      │
│                    │  - Fuzzy suggestions     │                      │
│                    └──────────┬───────────────┘                      │
│                               │                                      │
│                               ▼                                      │
│  ┌───────────────────────────────────────────────────────────┐      │
│  │             ComponentKnowledge Builder                     │      │
│  │  - slotAffinity validation                                │      │
│  │  - semanticDescription                                    │      │
│  │  - constraints validation                                 │      │
│  │  - tokenBindings integration                              │      │
│  └───────────────────────────────┬───────────────────────────┘      │
│                                  │                                   │
│                    ┌─────────────┼─────────────┐                     │
│                    ▼             ▼             ▼                     │
│  ┌─────────────────────┐ ┌──────────────┐ ┌────────────────────┐    │
│  │   Zod Schema        │ │  CSS-in-JS   │ │   Knowledge        │    │
│  │   Generator         │ │  Generator   │ │   Exporter         │    │
│  │  - TypeScript types │ │  - Vanilla   │ │  - JSON export     │    │
│  │  - Props validation │ │  - Stitches  │ │  - Markdown export │    │
│  └──────────┬──────────┘ └──────┬───────┘ └────────┬───────────┘    │
│             │                   │                  │                 │
│             └───────────────────┼──────────────────┘                 │
│                                 ▼                                    │
│                    ┌──────────────────────────────┐                  │
│                    │    Layer 3 Registry Output   │                  │
│                    │  - component-knowledge.json  │                  │
│                    │  - *.styles.ts files         │                  │
│                    │  - *.types.ts files          │                  │
│                    └──────────────────────────────┘                  │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### 3.2 Data Flow

**Input Processing**:
1. Load Layer 1 token metadata (JSON)
2. Validate all tokens exist

**Knowledge Building**:
1. For each of 20 components:
   - Build ComponentKnowledge entry
   - Validate slotAffinity scores
   - Validate constraints
   - Validate tokenBindings
2. Report validation errors with suggestions

**Output Generation**:
1. Generate Zod schemas
2. Generate CSS-in-JS bindings
3. Export JSON and Markdown
4. Build Layer 3 registry

---

## 4. Risk Analysis

### 4.1 Technical Risks

**RISK-001**: ComponentKnowledge interface complexity
- **Likelihood**: Medium
- **Impact**: High (affects all downstream)
- **Mitigation**: Start with minimal interface, iterate

**RISK-002**: Layer 1 token metadata format changes
- **Likelihood**: Low (Layer 1 complete)
- **Impact**: High (parser breaks)
- **Mitigation**: Version metadata format, adapter layer

**RISK-003**: Affinity scoring may need tuning
- **Likelihood**: Medium
- **Impact**: Medium (Layer 3 performance)
- **Mitigation**: Make weights configurable, extensive testing

---

## 5. Testing Strategy

### 5.1 Test Pyramid

**Unit Tests (70%)**:
- ComponentKnowledge validation
- slotAffinity range checks
- Constraint validation
- Token reference validation
- Schema generation accuracy
- CSS-in-JS output format

**Integration Tests (20%)**:
- End-to-end knowledge building
- Layer 1 metadata integration
- Layer 3 registry compatibility

**E2E Tests (10%)**:
- Full pipeline from tokens to exports
- React component usage with bindings

**Target Coverage**: ≥ 85%

---

## 6. Performance Targets

| Operation | Target |
|-----------|--------|
| Validate single ComponentKnowledge | < 5ms |
| Validate all 20 components | < 100ms |
| Generate all Zod schemas | < 200ms |
| Generate all CSS-in-JS bindings | < 300ms |
| Export JSON | < 50ms |
| Export Markdown | < 100ms |
| Full pipeline | < 600ms |

---

## 7. Dependencies and Blockers

### 7.1 External Dependencies
- ✅ `zod` package
- ✅ `@vanilla-extract/css` package
- ✅ `@stitches/core` package

### 7.2 Internal Dependencies
- ⏳ SPEC-LAYER1-001 (Token Generator Engine) - MUST COMPLETE FIRST
- ✅ 20 core hooks (already exist in codebase)

### 7.3 Known Blockers
- **BLOCKER-001**: Layer 1 must complete before Layer 2 implementation

---

## 8. Success Criteria

### 8.1 Functional Success
- ✅ All 20 components have complete ComponentKnowledge entries
- ✅ All slotAffinity values validated (0.0-1.0)
- ✅ All constraints validated for consistency
- ✅ All token references validated against Layer 1
- ✅ Zod schemas generated and type-safe
- ✅ CSS-in-JS bindings work with Vanilla Extract and Stitches

### 8.2 Quality Success
- ✅ Test coverage ≥ 85%
- ✅ Zero TypeScript/ESLint errors
- ✅ Performance targets met (< 600ms)
- ✅ API documentation complete

### 8.3 Integration Success
- ✅ Layer 3 can consume generated knowledge catalog
- ✅ React components work with generated bindings

---

**TAG**: SPEC-LAYER2-001
**Dependencies**: SPEC-LAYER1-001 (REQUIRED)
**Related**: SPEC-LAYER3-001
**Last Updated**: 2026-01-20
