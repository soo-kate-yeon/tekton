# Implementation Plan: SPEC-LAYER3-001 - Component Generation Engine

**TAG**: SPEC-LAYER3-001
**Version**: 2.0.0
**Priority**: HIGH
**Complexity**: HIGH
**Dependencies**: SPEC-LAYER1-001, SPEC-LAYER2-001
**Last Updated**: 2026-01-20

---

## 1. Implementation Strategy

### 1.1 Development Approach
- **Methodology**: TDD (RED-GREEN-REFACTOR cycle)
- **Phase**: Layer 3 Integration (depends on Layer 1 + Layer 2 completion)
- **Iterations**: 6 milestones with incremental delivery
- **Risk**: Highest complexity layer - requires extensive integration testing

### 1.2 Technology Stack

**Core Dependencies**:
```json
{
  "dependencies": {
    "@babel/generator": "^7.24.0",
    "@babel/types": "^7.24.0",
    "@supabase/supabase-js": "^2.45.0",
    "zod": "^3.23.0",
    "prettier": "^3.4.0",
    "react": "^19.0.0",
    "@types/react": "^19.0.0",
    "fuse.js": "^7.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/babel__generator": "^7.6.0",
    "@types/babel__types": "^7.20.0",
    "typescript": "^5.9.0",
    "vitest": "^2.0.0",
    "@vitest/coverage-v8": "^2.0.0",
    "@playwright/test": "^1.48.0",
    "axe-core": "^4.8.0"
  }
}
```

**Justification**:
- **@babel/generator**: Industry-standard AST-to-code generation
- **@supabase/supabase-js**: PostgreSQL-backed database with RLS
- **zod**: Type-safe schema validation
- **prettier**: Code formatting standard
- **fuse.js**: Fuzzy search for hallucination check suggestions
- **axe-core**: WCAG accessibility validation

---

## 2. Task Breakdown

### Milestone 1: Slot Semantic Registry (Priority: HIGH)

**Task 1.1: Package Setup**
- Create `packages/component-generator/` package
- Configure TypeScript with strict mode
- Setup Vitest and Playwright testing infrastructure
- Configure ESLint + Prettier for code quality

**Task 1.2: Global Slot Definitions**
- Define 4 standard global slots (header, sidebar, main, footer)
- Implement slot roles and constraintTags
- Create SlotDefinition TypeScript interface
- Mark main slot as required
- Write unit tests for global slot validation

**Task 1.3: Local Slot Definitions**
- Define local slots (card_actions, table_toolbar, modal_footer)
- Implement parent component associations
- Create local slot registry with constraintTags
- Write unit tests for local slot validation

**Task 1.4: Slot Constraint Enforcement**
- Implement constraintTags validation against component categories
- Create LAYER3-E003 error for mismatched assignments
- Write unit tests for constraint enforcement

**Deliverables**:
- ✅ Global slot registry with 4 standard slots
- ✅ Local slot registry with parent associations
- ✅ Constraint enforcement prevents invalid assignments
- ✅ Tests: `slot-registry.test.ts`, `slot-constraints.test.ts`

**Definition of Done**:
- All 4 global slots defined with roles
- Local slots linked to parent components
- Constraint violations rejected with clear errors

---

### Milestone 2: Semantic Scoring Algorithm (Priority: HIGH)

**Task 2.1: Base Affinity Scoring**
- Implement slotAffinity lookup from ComponentKnowledge
- Apply 0.5 weight to base affinity score
- Handle missing affinity with 0.5 default
- Write unit tests for base affinity calculation

**Task 2.2: Intent Match Scoring**
- Implement intent mode detection (read-only, interactive, data-entry, dashboard)
- Apply scoring adjustments based on intent:
  - read-only: -0.3 penalty for action components
  - interactive: +0.2 boost for action components
  - data-entry: +0.2 boost for input components
  - dashboard: +0.2 boost for display components
- Apply 0.3 weight to intent match score
- Write unit tests for intent matching

**Task 2.3: Context Penalty Calculation**
- Implement conflict detection with sibling components
- Apply -0.5 penalty for conflictsWith violations
- Apply -0.3 penalty for category mismatch with slot constraints
- Apply 0.2 weight to context penalty
- Write unit tests for context penalty calculation

**Task 2.4: Score Aggregation**
- Implement formula: Score = (BaseAffinity × 0.5) + (IntentMatch × 0.3) + (ContextPenalty × 0.2)
- Clamp final score to 0.0-1.0 range
- Ensure calculation completes in < 10ms
- Write performance tests for scoring

**Deliverables**:
- ✅ Complete scoring algorithm implementation
- ✅ All three factors calculated correctly
- ✅ Score clamped to valid range
- ✅ Tests: `semantic-scoring.test.ts`, `intent-matching.test.ts`

**Definition of Done**:
- Scoring formula produces consistent results
- Performance target (< 10ms) met
- All intent modes handled correctly

---

### Milestone 3: Safety Protocols (Priority: HIGH)

**Task 3.1: Threshold Check Implementation**
- Implement minimum score threshold (0.4)
- Trigger Fluid Fallback for scores below threshold
- Log LAYER3-W001 warning with original component name
- Write unit tests for threshold enforcement

**Task 3.2: Hallucination Check Implementation**
- Load component catalog from Layer 2
- Validate all Blueprint component names against catalog
- Implement fuzzy matching with Fuse.js for typo suggestions
- Return LAYER3-E002 error with suggestions for invalid names
- Write unit tests for hallucination detection

**Task 3.3: Excluded Slot Enforcement**
- Check component constraints.excludedSlots before scoring
- Return score = 0.0 for excluded slot violations
- Block placement regardless of other factors
- Write unit tests for excluded slot enforcement

**Task 3.4: Fluid Fallback System**
- Define fallback mapping based on slot role:
  - primary-content → GenericContainer
  - navigation → NavPlaceholder
  - actions → ButtonGroup
  - auxiliary → GenericContainer
- Attach _fallback metadata with reason
- Write unit tests for fallback application

**Deliverables**:
- ✅ Threshold check prevents low-quality assignments
- ✅ Hallucination check detects invalid component names
- ✅ Excluded slot constraints enforced
- ✅ Fluid Fallback assigns appropriate components
- ✅ Tests: `safety-protocols.test.ts`, `hallucination-check.test.ts`

**Definition of Done**:
- All safety checks pass validation
- Fallback components appropriate for slot roles
- Error messages include actionable suggestions

---

### Milestone 4: Blueprint System (Priority: HIGH)

**Task 4.1: Blueprint v2.0 Schema Definition**
- Define TypeScript interfaces for new Blueprint structure
- Implement Zod schemas with all required fields:
  - id, version, name, description, archetype
  - intent (mode, keywords, complexity)
  - slots (main required, others optional)
  - responsive, accessibility, metadata
- Create schema validation with < 50ms target
- Write unit tests for schema validation

**Task 4.2: AI Blueprint Generator (Basic Mode)**
- Integrate Claude API for natural language → Blueprint conversion
- Implement prompt engineering for intent extraction
- Parse keywords from user prompts
- Determine complexity level automatically
- Create fallback mechanisms for API failures
- Write integration tests with sample prompts

**Task 4.3: Manual Blueprint Editor (Pro Mode)**
- Implement JSON editor for Blueprint editing
- Add real-time schema validation
- Integrate hallucination check for component names
- Provide autocomplete for valid component names
- Write unit tests for editor validation

**Task 4.4: Intent Parser**
- Implement natural language intent detection
- Extract mode from prompts (read-only, interactive, etc.)
- Extract keywords for semantic scoring
- Determine complexity from prompt analysis
- Write unit tests for intent parsing

**Deliverables**:
- ✅ Blueprint v2.0 schema fully defined
- ✅ AI generates valid Blueprints from prompts
- ✅ Pro Mode allows manual editing with validation
- ✅ Intent correctly parsed from user input
- ✅ Tests: `blueprint-schema.test.ts`, `ai-generator.test.ts`

**Definition of Done**:
- Schema validation < 50ms
- AI generation < 5 seconds
- All required fields validated

---

### Milestone 5: Code Generation Engine (Priority: HIGH)

**Task 5.1: AST Builder**
- Implement Babel AST construction for JSX
- Generate React component structures
- Support TypeScript type annotations
- Integrate Layer 2 component bindings
- Write unit tests for AST correctness

**Task 5.2: JSX Generator**
- Convert AST to JSX code using @babel/generator
- Implement Prettier formatting for generated code
- Generate import statements from Layer 2 bindings
- Ensure all styles use CSS variables (var(--token-name))
- Write unit tests for code generation

**Task 5.3: TypeScript Type Generator**
- Generate `.types.ts` files with component prop types
- Use Layer 2 Zod schemas for type inference
- Create type exports for external consumption
- Validate generated types compile correctly
- Write unit tests for type generation

**Task 5.4: Responsive Utility Generator**
- Implement mobile-first breakpoint system
- Generate media queries for responsive layouts
- Support Blueprint.responsive configuration
- Write unit tests for responsive styles

**Task 5.5: Layer Integration Validation**
- Validate all generated code uses Layer 1 CSS variables
- Validate all component schemas use Layer 2 Zod schemas
- Check for zero hardcoded design values
- Write integration tests for layer compliance

**Deliverables**:
- ✅ AST builder generates valid React JSX
- ✅ JSX generator produces formatted code
- ✅ TypeScript types exported correctly
- ✅ All code uses Layer 1 + Layer 2 bindings
- ✅ Tests: `ast-builder.test.ts`, `jsx-generator.test.ts`

**Definition of Done**:
- Generated code compiles without errors
- Zero hardcoded design values
- Full layer integration verified

---

### Milestone 6: Supabase Integration and Testing (Priority: HIGH)

**Task 6.1: Supabase Blueprint Storage**
- Create `blueprints` table schema with version column
- Implement Row-Level Security policies
- Setup save/load operations with auto-versioning
- Target: < 200ms for save/load operations
- Write integration tests for Supabase operations

**Task 6.2: Version History**
- Implement semantic versioning for Blueprints
- Track Blueprint history with diff comparison
- Implement version rollback functionality
- Write unit tests for versioning

**Task 6.3: Offline Fallback**
- Implement local storage fallback (IndexedDB)
- Create sync mechanism when Supabase unavailable
- Handle conflict resolution (last-write-wins with log)
- Write unit tests for fallback logic

**Task 6.4: E2E Test Generator**
- Generate Playwright test files for components
- Cover all interactive elements
- Include route from Blueprint.routing.path
- Write unit tests for test generation logic

**Task 6.5: Accessibility Validation**
- Implement WCAG AA compliance checks with axe-core
- Generate ARIA labels and roles
- Support keyboard navigation
- Validate all generated components pass accessibility
- Write integration tests for accessibility

**Task 6.6: Performance Benchmarking**
- Benchmark full pipeline (with AI): < 6 seconds
- Benchmark full pipeline (without AI): < 700ms
- Optimize hot paths as needed
- Write performance tests

**Deliverables**:
- ✅ Supabase storage with RLS and versioning
- ✅ Offline fallback prevents data loss
- ✅ E2E tests generated for all components
- ✅ Generated components pass WCAG AA
- ✅ Performance targets met
- ✅ Tests: `supabase.test.ts`, `e2e-generator.test.ts`, `accessibility.test.ts`

**Definition of Done**:
- RLS policies enforce security
- Full pipeline meets performance targets
- Zero WCAG AA violations

---

## 3. Architecture Design

### 3.1 Module Interaction Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│              Component Generation Engine (Layer 3)                        │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────┐     ┌──────────────────────┐                        │
│  │  User Input     │     │  Layer 2 Knowledge   │                        │
│  │  (Prompt/JSON)  │     │  (ComponentKnowledge)│                        │
│  └────────┬────────┘     └──────────┬───────────┘                        │
│           │                         │                                     │
│           ▼                         ▼                                     │
│  ┌─────────────────────────────────────────────────┐                     │
│  │           AI Blueprint Generator                 │                     │
│  │  - Intent Parser (mode, keywords, complexity)   │                     │
│  │  - Blueprint v2.0 Schema Generation             │                     │
│  └────────────────────┬────────────────────────────┘                     │
│                       │                                                   │
│                       ▼                                                   │
│  ┌─────────────────────────────────────────────────┐                     │
│  │           Safety Protocols                       │                     │
│  │  - Hallucination Check (validate components)    │                     │
│  │  - Threshold Check (min score 0.4)              │                     │
│  │  - Excluded Slot Enforcement                    │                     │
│  └────────────────────┬────────────────────────────┘                     │
│                       │                                                   │
│           ┌───────────┴───────────┐                                      │
│           ▼                       ▼                                      │
│  ┌─────────────────┐    ┌─────────────────────┐                         │
│  │  Slot Semantic  │    │  Semantic Scoring   │                         │
│  │  Registry       │    │  Algorithm          │                         │
│  │  - Global slots │    │  - BaseAffinity×0.5 │                         │
│  │  - Local slots  │    │  - IntentMatch×0.3  │                         │
│  │  - Constraints  │    │  - ContextPenalty×0.2│                        │
│  └────────┬────────┘    └──────────┬──────────┘                         │
│           │                        │                                     │
│           └────────────┬───────────┘                                     │
│                        ▼                                                  │
│           ┌────────────────────────────┐                                 │
│           │     Slot Resolution        │                                 │
│           │  - Score all candidates    │                                 │
│           │  - Apply Fluid Fallback    │                                 │
│           │  - Resolve children        │                                 │
│           └────────────┬───────────────┘                                 │
│                        │                                                  │
│                        ▼                                                  │
│           ┌────────────────────────────┐                                 │
│           │     Code Generation        │                                 │
│           │  - AST Builder (Babel)     │                                 │
│           │  - JSX Generator           │                                 │
│           │  - TypeScript Types        │                                 │
│           │  - E2E Test Generator      │                                 │
│           └────────────┬───────────────┘                                 │
│                        │                                                  │
│           ┌────────────┴────────────┐                                    │
│           ▼                         ▼                                    │
│  ┌─────────────────┐     ┌──────────────────┐                           │
│  │  Output Files   │     │  Supabase        │                           │
│  │  - *.tsx        │     │  - Blueprint     │                           │
│  │  - *.types.ts   │     │  - Version       │                           │
│  │  - *.spec.ts    │     │  - History       │                           │
│  └─────────────────┘     └──────────────────┘                           │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Data Flow

**Input Processing**:
1. User provides prompt (Basic Mode) or Blueprint JSON (Pro Mode)
2. AI generates Blueprint with intent parsing
3. Safety Protocols validate Blueprint (hallucination check, component validation)

**Semantic Scoring**:
1. For each slot assignment, calculate semantic score
2. Apply formula: Score = (BaseAffinity × 0.5) + (IntentMatch × 0.3) + (ContextPenalty × 0.2)
3. Check threshold (≥ 0.4), apply Fluid Fallback if needed

**Code Generation**:
1. Slot resolver maps Blueprint slots to scored components
2. AST builder constructs Babel AST for React JSX
3. JSX generator converts AST to formatted code
4. TypeScript types generated from Layer 2 schemas
5. E2E tests generated for interactive elements

**Output and Storage**:
1. Generated files written to disk
2. Blueprint saved to Supabase with version
3. Accessibility validation run on output

---

## 4. Risk Analysis

### 4.1 Technical Risks

**RISK-001**: Semantic Scoring may need tuning
- **Likelihood**: Medium
- **Impact**: Medium (suboptimal component selections)
- **Mitigation**: Make weights configurable, extensive testing, user feedback loop

**RISK-002**: AI-generated Blueprints may have invalid intent
- **Likelihood**: Medium
- **Impact**: High (poor component selections)
- **Mitigation**: Intent validation, fallback to "interactive" mode

**RISK-003**: Hallucination Check false positives
- **Likelihood**: Low
- **Impact**: Medium (valid components rejected)
- **Mitigation**: Fuzzy matching with configurable threshold

**RISK-004**: Fluid Fallback may not suit all contexts
- **Likelihood**: Medium
- **Impact**: Low (generic components used)
- **Mitigation**: Role-based fallback mapping, user notification

**RISK-005**: Layer 1/Layer 2 integration failures
- **Likelihood**: Medium
- **Impact**: High (components cannot be generated)
- **Mitigation**: Integration tests, versioned APIs

---

## 5. Testing Strategy

### 5.1 Test Pyramid

**Unit Tests (60%)**:
- Slot registry definitions and constraints
- Semantic scoring algorithm accuracy
- Safety protocol enforcement
- Blueprint schema validation
- AST builder and JSX generator

**Integration Tests (25%)**:
- Layer 1 + Layer 2 + Layer 3 integration
- Supabase save/load operations
- End-to-end Blueprint to component flow

**E2E Tests (15%)**:
- Generated component rendering in browser
- Accessibility compliance (WCAG AA)
- User interaction testing (Playwright)

**Target Coverage**: ≥ 85% (TRUST 5 requirement)

---

## 6. Performance Targets

| Operation | Target |
|-----------|--------|
| Single component scoring | < 10ms |
| Blueprint validation | < 50ms |
| Slot resolution (all slots) | < 100ms |
| AST + JSX generation | < 300ms |
| E2E test generation | < 100ms |
| Supabase save/load | < 200ms |
| Full pipeline (no AI) | < 700ms |
| AI Blueprint generation | < 5000ms |
| **Full pipeline (with AI)** | **< 6000ms** |

---

## 7. Quality Gates (TRUST 5 Framework)

### 7.1 Test Coverage Gate
- **Requirement**: ≥ 85% code coverage
- **Validation**: Run `vitest --coverage`

### 7.2 Code Quality Gate
- **Requirement**: Zero ESLint errors, zero TypeScript errors
- **Validation**: Run `eslint .` and `tsc --noEmit`

### 7.3 Performance Gate
- **Requirement**: Full pipeline < 6s (with AI), < 700ms (without AI)
- **Validation**: Run performance benchmarks

### 7.4 Accessibility Gate
- **Requirement**: Generated components pass WCAG AA
- **Validation**: Run axe-core checks

### 7.5 Security Gate
- **Requirement**: No exposed API keys, no code injection
- **Validation**: Security audit

---

## 8. Dependencies and Blockers

### 8.1 External Dependencies
- ✅ `@babel/generator` package
- ✅ `@supabase/supabase-js` package
- ✅ `zod` package
- ✅ `fuse.js` package
- ✅ `axe-core` package

### 8.2 Internal Dependencies
- ⏳ SPEC-LAYER1-001 (Token Generator Engine) - MUST COMPLETE FIRST
- ⏳ SPEC-LAYER2-001 (Component Knowledge System) - MUST COMPLETE FIRST

### 8.3 Known Blockers
- **BLOCKER-001**: Layer 1 + Layer 2 must complete before Layer 3
  - **Resolution**: Coordinate contracts early, begin schema design

---

## 9. Success Criteria

### 9.1 Functional Success
- ✅ Slot Semantic Registry defines all global and local slots
- ✅ Semantic Scoring Algorithm produces consistent results
- ✅ Safety Protocols prevent low-quality and hallucinated components
- ✅ AI generates valid Blueprints from user prompts
- ✅ Generated components use Layer 1 tokens and Layer 2 knowledge
- ✅ Supabase Blueprint storage works with versioning
- ✅ E2E tests generated for all components
- ✅ Generated components pass WCAG AA checks

### 9.2 Quality Success
- ✅ Test coverage ≥ 85%
- ✅ All acceptance scenarios pass
- ✅ Zero ESLint/TypeScript errors
- ✅ Performance benchmarks met

### 9.3 Integration Success
- ✅ Layer 1 + Layer 2 + Layer 3 integration verified
- ✅ Generated components work in production React apps
- ✅ Supabase RLS policies enforce security

---

**TAG**: SPEC-LAYER3-001
**Dependencies**: SPEC-LAYER1-001 (REQUIRED), SPEC-LAYER2-001 (REQUIRED)
**Related**: SPEC-LAYER2-001
**Last Updated**: 2026-01-20
