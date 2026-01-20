# Acceptance Criteria: SPEC-LAYER3-001 - Component Generation Engine

**TAG**: SPEC-LAYER3-001
**Version**: 2.0.0
**Test Coverage Target**: ≥ 85% (TRUST 5 Framework)
**Dependencies**: SPEC-LAYER1-001, SPEC-LAYER2-001
**WCAG Compliance**: AA Level
**Last Updated**: 2026-01-20

---

## 1. Slot Semantic Registry Acceptance Criteria

### Scenario 1.1: Global Slot Definition Validation

**Given** the Slot Semantic Registry
**When** global slots are queried
**Then** all 4 standard slots shall be defined (header, sidebar, main, footer)
**And** each slot shall have role and constraintTags
**And** main slot shall be marked as required

**Expected Registry**:
```typescript
[
  { name: "header", role: "navigation", constraintTags: ["navigation", "action", "display"], required: false },
  { name: "sidebar", role: "secondary-navigation", constraintTags: ["navigation", "input", "action"], required: false },
  { name: "main", role: "primary-content", constraintTags: ["display", "input", "container", "action"], required: true },
  { name: "footer", role: "auxiliary", constraintTags: ["navigation", "action", "display"], required: false },
]
```

**Validation**:
- All 4 global slots present
- Main slot is required
- constraintTags enforce component categories

---

### Scenario 1.2: Local Slot Definition

**Given** a component that defines local slots (e.g., Card)
**When** local slots are queried
**Then** local slots shall be registered with parent component
**And** local slots shall have constraintTags

**Expected Local Slots**:
```typescript
[
  { name: "card_actions", parentComponent: "Card", role: "actions", constraintTags: ["action"] },
  { name: "table_toolbar", parentComponent: "DataTable", role: "toolbar", constraintTags: ["action", "input"] },
  { name: "modal_footer", parentComponent: "Modal", role: "actions", constraintTags: ["action"] },
]
```

**Validation**:
- Local slots linked to parent components
- constraintTags enforced for local slots

---

### Scenario 1.3: Slot Constraint Enforcement

**Given** a slot with constraintTags
**When** a component with mismatched category is assigned
**Then** the system shall reject with LAYER3-E003
**And** an error message shall indicate allowed categories

**Test Data**:
```typescript
// header slot allows: ["navigation", "action", "display"]
// DataTable has category: "display" but excludedSlots: ["header"]

const assignment = {
  slot: "header",
  component: "DataTable",
};
```

**Validation**:
- Mismatched assignments rejected
- Clear error message with allowed categories

---

## 2. Semantic Scoring Algorithm Acceptance Criteria

### Scenario 2.1: Score Calculation Accuracy

**Given** a component and target slot
**When** the Semantic Scoring Algorithm calculates the score
**Then** the formula shall be: Score = (BaseAffinity × 0.5) + (IntentMatch × 0.3) + (ContextPenalty × 0.2)
**And** the score shall be clamped to 0.0-1.0

**Test Data**:
```typescript
const input = {
  component: ButtonKnowledge,  // slotAffinity.sidebar = 0.8
  targetSlot: "sidebar",
  intent: { mode: "interactive", keywords: ["button", "action"] },
  context: { siblingComponents: [], slotConstraints: ["action"] },
};

// Expected:
// BaseAffinity = 0.8
// IntentMatch = 0.7 (interactive + keyword matches)
// ContextPenalty = 1.0 (no conflicts, category matches)
// Score = (0.8 × 0.5) + (0.7 × 0.3) + (1.0 × 0.2) = 0.4 + 0.21 + 0.2 = 0.81
```

**Validation**:
- Score calculation follows formula
- Score clamped to 0.0-1.0
- Calculation completes in < 10ms

---

### Scenario 2.2: Intent-Based Scoring Adjustment

**Given** a Blueprint with "read-only" intent mode
**When** an action component (e.g., Button) is scored
**Then** the IntentMatch score shall be penalized by -0.3
**And** display components shall receive +0.2 boost

**Test Data**:
```typescript
const readOnlyIntent = { mode: "read-only", keywords: [], complexity: "simple" };

// Button (category: action) IntentMatch:
// Base: 0.5 - 0.3 = 0.2 (penalized)

// DataTable (category: display) IntentMatch:
// Base: 0.5 (no penalty for display in read-only)
```

**Validation**:
- Action components penalized in read-only mode
- Display components not penalized
- Dashboard mode boosts display components

---

### Scenario 2.3: Context Penalty Calculation

**Given** a component with conflictsWith constraints
**When** the component is scored for a slot with conflicting siblings
**Then** the ContextPenalty shall be reduced by -0.5

**Test Data**:
```typescript
const component = {
  name: "DataTable",
  constraints: { conflictsWith: ["OtherDataTable"] },
};

const context = {
  siblingComponents: ["OtherDataTable"],  // Conflict!
  slotConstraints: ["display"],
};

// ContextPenalty = 1.0 - 0.5 = 0.5
```

**Validation**:
- Conflicts detected and penalized
- Category mismatch penalized

---

## 3. Safety Protocol Acceptance Criteria

### Scenario 3.1: Threshold Check Enforcement

**Given** a component with score < 0.4
**When** the Threshold Check is applied
**Then** the system shall trigger Fluid Fallback
**And** GenericContainer shall be assigned
**And** warning LAYER3-W001 shall be logged

**Test Data**:
```typescript
const lowScoreResult = {
  component: "ComplexChart",
  slot: "header",
  score: 0.25,  // Below 0.4 threshold
};

// Expected: Fallback to GenericContainer
```

**Validation**:
- Scores < 0.4 trigger fallback
- GenericContainer assigned as fallback
- Warning logged with original component name

---

### Scenario 3.2: Hallucination Check - Invalid Component Detection

**Given** a Blueprint with non-existent component names
**When** the Hallucination Check validates the Blueprint
**Then** invalid components shall be detected
**And** error LAYER3-E002 shall be returned
**And** similar component suggestions shall be provided

**Test Data**:
```typescript
const blueprint = {
  slots: {
    main: { component: "Buttn" },  // Typo: should be "Button"
    sidebar: { component: "FakeComponent" },  // Non-existent
  }
};
```

**Expected Response**:
```typescript
{
  valid: false,
  invalidComponents: ["Buttn", "FakeComponent"],
  suggestions: {
    "Buttn": ["Button"],
    "FakeComponent": [],
  }
}
```

**Validation**:
- Invalid components detected
- Fuzzy suggestions for typos
- Blueprint rejected until fixed

---

### Scenario 3.3: Constraint Violation - Excluded Slot

**Given** a component with excludedSlots constraint
**When** the component is placed in an excluded slot
**Then** the system shall return score = 0.0
**And** the placement shall be blocked regardless of other factors

**Test Data**:
```typescript
const dataTable = {
  name: "DataTable",
  constraints: { excludedSlots: ["header", "footer", "sidebar"] },
};

// Attempt to place DataTable in header
const result = scoreComponent(dataTable, "header", intent, context);
// Expected: score = 0.0, blocked
```

**Validation**:
- Excluded slots enforce hard block
- Score is exactly 0.0
- Clear error message

---

### Scenario 3.4: Fluid Fallback Application

**Given** a slot that fails scoring or constraint checks
**When** Fluid Fallback is applied
**Then** appropriate fallback component shall be assigned based on slot role
**And** _fallback metadata shall be attached

**Fallback Mapping**:
- primary-content → GenericContainer
- navigation → NavPlaceholder
- actions → ButtonGroup
- auxiliary → GenericContainer

**Validation**:
- Fallback matches slot role
- _fallback metadata includes reason
- No errors during fallback

---

## 4. Blueprint System Acceptance Criteria

### Scenario 4.1: Blueprint Schema Validation (New Structure)

**Given** a Blueprint JSON with the new v2.0 structure
**When** the schema validator checks the Blueprint
**Then** all required fields shall be present
**And** the Blueprint shall pass Zod validation

**Required Fields Checklist**:
- [ ] `id` (string, unique)
- [ ] `version` (string, semver format)
- [ ] `name` (string, non-empty)
- [ ] `description` (string)
- [ ] `archetype` (string, valid archetype ID)
- [ ] `intent.mode` (enum: read-only | interactive | data-entry | dashboard)
- [ ] `intent.keywords` (string array)
- [ ] `intent.complexity` (enum: simple | moderate | complex)
- [ ] `slots.main` (SlotAssignment, required)
- [ ] `responsive` (ResponsiveConfig)
- [ ] `accessibility` (AccessibilityConfig)
- [ ] `metadata` (created, updated, author, generatedBy)

**Validation**:
- All required fields present
- Zod validation passes
- Validation time < 50ms

---

### Scenario 4.2: AI Blueprint Generation (Basic Mode)

**Given** a user natural language prompt
**When** the AI Blueprint generator processes the prompt
**Then** a valid Blueprint JSON shall be generated
**And** intent shall be correctly parsed from prompt
**And** generation shall complete within 5 seconds

**Test Data**:
```
User Prompt: "Create a read-only admin dashboard with data tables and metrics display"
```

**Expected Blueprint**:
```json
{
  "name": "Admin Dashboard",
  "intent": {
    "mode": "dashboard",
    "keywords": ["admin", "dashboard", "data", "tables", "metrics"],
    "complexity": "moderate"
  },
  "slots": {
    "main": {
      "component": "Card",
      "children": [
        { "component": "DataTable" }
      ]
    }
  }
}
```

**Validation**:
- Blueprint generated successfully
- Intent parsed correctly
- Generation time < 5s

---

### Scenario 4.3: Manual Blueprint Editing (Pro Mode)

**Given** a user manually edits a Blueprint
**When** the Blueprint is validated
**Then** schema validation errors shall be detected immediately
**And** hallucination check shall validate component names
**And** validation shall complete within 50ms

**Validation**:
- Instant validation feedback
- Component name suggestions for typos
- Clear error messages

---

## 5. Code Generation Acceptance Criteria

### Scenario 5.1: React JSX Generation

**Given** a validated Blueprint
**When** the JSX generator produces React code
**Then** the code shall be valid TypeScript JSX
**And** all components shall use Layer 2 bindings
**And** code shall be formatted with Prettier

**Expected Output**:
```typescript
import React from "react";
import { Card, DataTable, Badge, Avatar, Button } from "@/components";

export const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-dashboard-layout">
      <header className="layout-header">
        <Card variant="ghost">
          <Badge text="Admin" />
          <Avatar size="sm" />
        </Card>
      </header>
      <aside className="layout-sidebar">
        <Card variant="default">
          <Button variant="ghost">Dashboard</Button>
          <Button variant="ghost">Users</Button>
        </Card>
      </aside>
      <main className="layout-main">
        <Card variant="elevated">
          <DataTable columns={5} rows={10} />
        </Card>
      </main>
    </div>
  );
};
```

**Validation**:
- Code is valid TypeScript
- JSX syntax correct
- All imports generated
- Prettier formatting applied

---

### Scenario 5.2: Layer 1 + Layer 2 + Layer 3 Integration

**Given** a generated component
**When** styles are applied
**Then** all color/size values shall use CSS variables from Layer 1
**And** all component schemas shall use Layer 2 Zod schemas
**And** zero hardcoded design values shall exist

**Validation**:
- All styles use `var(--token-name)` syntax
- Layer 2 schemas imported and used
- Zero hardcoded values

---

## 6. Supabase Integration Acceptance Criteria

### Scenario 6.1: Blueprint Save with Version

**Given** a valid Blueprint
**When** the Blueprint is saved to Supabase
**Then** the Blueprint shall be stored with version number
**And** version shall auto-increment on updates
**And** operation shall complete within 200ms

**Validation**:
- Save completes within 200ms
- Version stored correctly
- Version history preserved

---

### Scenario 6.2: RLS Enforcement

**Given** two users with different Supabase user IDs
**When** User A attempts to access User B's Blueprint
**Then** access shall be denied by RLS policies
**And** authorization error shall be returned

**Validation**:
- User isolation enforced
- Authorization errors returned
- Users only see own Blueprints

---

### Scenario 6.3: Offline Fallback

**Given** Supabase is unavailable
**When** a Blueprint save/load is attempted
**Then** local storage fallback shall be used
**And** sync shall occur when Supabase becomes available

**Validation**:
- Local fallback works
- No data loss
- Sync completes when online

---

## 7. E2E Testing and Accessibility Acceptance Criteria

### Scenario 7.1: E2E Test Generation

**Given** a generated component with interactive elements
**When** the E2E test generator creates Playwright tests
**Then** tests shall cover all interactive elements
**And** tests shall include route from Blueprint.routing.path

**Expected Test Output**:
```typescript
import { test, expect } from "@playwright/test";

const COMPONENT_ROUTE = "/admin-dashboard";

test.describe("AdminDashboard", () => {
  test("should render all slots", async ({ page }) => {
    await page.goto(COMPONENT_ROUTE);
    await expect(page.locator(".layout-header")).toBeVisible();
    await expect(page.locator(".layout-main")).toBeVisible();
    await expect(page.locator(".layout-sidebar")).toBeVisible();
  });
});
```

**Validation**:
- Tests generated for all interactions
- Route derived from Blueprint
- Tests run successfully

---

### Scenario 7.2: WCAG AA Accessibility Compliance

**Given** a generated component
**When** automated accessibility checks run (axe-core)
**Then** zero WCAG AA violations shall exist
**And** all interactive elements shall have ARIA labels
**And** keyboard navigation shall work

**Validation**:
- Zero WCAG AA violations
- Keyboard navigation works
- Focus indicators visible

---

## 8. Performance Acceptance Criteria

### Scenario 8.1: Full Pipeline Performance (With AI)

**Given** a user prompt in Basic Mode
**When** the full pipeline executes
**Then** total time shall be < 6 seconds
**And** AI generation shall be < 5 seconds
**And** code generation shall be < 700ms

**Validation**:
- Full pipeline < 6s
- AI call < 5s
- Code generation < 700ms

---

### Scenario 8.2: Full Pipeline Performance (Without AI)

**Given** a manual Blueprint in Pro Mode
**When** the full pipeline executes (no AI)
**Then** total time shall be < 700ms

**Validation**:
- Full pipeline < 700ms

---

## 9. Quality Gate Criteria (TRUST 5 Framework)

### 9.1 Test Coverage Gate
- **Requirement**: ≥ 85% code coverage
- **Validation**: Run `vitest --coverage`

### 9.2 Code Quality Gate
- **Requirement**: Zero ESLint errors, zero TypeScript errors
- **Validation**: Run `eslint .` and `tsc --noEmit`

### 9.3 Performance Gate
- **Requirement**: Full pipeline < 6s (with AI), < 700ms (without AI)
- **Validation**: Run performance benchmarks

### 9.4 Accessibility Gate
- **Requirement**: Generated components pass WCAG AA
- **Validation**: Run axe-core checks

### 9.5 Security Gate
- **Requirement**: No exposed API keys, no code injection
- **Validation**: Security audit

---

## 10. Definition of Done

### Functional Completeness
- ✅ Slot Semantic Registry defines all global and local slots
- ✅ Semantic Scoring Algorithm produces consistent results
- ✅ Safety Protocols prevent low-quality and hallucinated components
- ✅ AI generates valid Blueprints from user prompts
- ✅ Generated components use Layer 1 tokens and Layer 2 knowledge
- ✅ Supabase Blueprint storage works with versioning
- ✅ E2E tests generated for all components
- ✅ Generated components pass WCAG AA checks

### Quality Completeness
- ✅ Test coverage ≥ 85%
- ✅ All acceptance scenarios pass
- ✅ Zero ESLint/TypeScript errors
- ✅ Performance benchmarks met

### Integration Completeness
- ✅ Layer 1 + Layer 2 + Layer 3 integration verified
- ✅ Generated components work in production React apps
- ✅ Supabase RLS policies enforce security

---

**TAG**: SPEC-LAYER3-001
**Test Framework**: Vitest, Playwright
**Coverage Tool**: @vitest/coverage-v8
**Dependencies**: SPEC-LAYER1-001, SPEC-LAYER2-001
**Last Updated**: 2026-01-20
