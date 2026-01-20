# Acceptance Criteria: SPEC-LAYER2-001 - Component Knowledge System

**TAG**: SPEC-LAYER2-001
**Version**: 2.0.0
**Test Coverage Target**: ≥ 85% (TRUST 5 Framework)
**Dependencies**: SPEC-LAYER1-001 (Token Generator Engine)
**Last Updated**: 2026-01-20

---

## 1. ComponentKnowledge Interface Acceptance Criteria

### Scenario 1.1: Complete ComponentKnowledge Entry Validation

**Given** a ComponentKnowledge entry for a component
**When** the system validates the entry
**Then** all required fields shall be present
**And** the entry shall conform to the ComponentKnowledge interface

**Required Fields Checklist**:
- [ ] `name` (string, non-empty)
- [ ] `type` (enum: atom | molecule | organism | template)
- [ ] `category` (enum: display | input | action | container | navigation)
- [ ] `slotAffinity` (object with slot name keys and 0.0-1.0 values)
- [ ] `semanticDescription.purpose` (string, descriptive)
- [ ] `semanticDescription.visualImpact` (enum: subtle | neutral | prominent)
- [ ] `semanticDescription.complexity` (enum: low | medium | high)
- [ ] `constraints` (object, can be empty)
- [ ] `tokenBindings.states` (all 5 states defined)

**Validation**:
- All required fields present
- All types match schema
- Validation time < 50ms per component

---

### Scenario 1.2: slotAffinity Score Range Validation

**Given** a ComponentKnowledge entry with slotAffinity values
**When** the system validates slotAffinity scores
**Then** all values shall be within 0.0 to 1.0 range
**And** excluded slots shall have affinity = 0.0
**And** warning shall be logged for values > 0.95

**Test Data**:
```typescript
const validAffinity = {
  main: 0.8,
  sidebar: 0.3,
  header: 0.0,  // excluded slot
  footer: 0.5,
};

const invalidAffinity = {
  main: 1.5,  // ERROR: out of range
  sidebar: -0.1,  // ERROR: out of range
};
```

**Validation**:
- Valid affinity values accepted
- Out-of-range values rejected with LAYER2-E006
- excludedSlots and slotAffinity=0 consistency enforced

---

### Scenario 1.3: Constraint Validation

**Given** a ComponentKnowledge entry with constraints
**When** the system validates constraints
**Then** `requires` references shall exist in catalog
**And** `conflictsWith` shall not include self
**And** `excludedSlots` shall match slotAffinity=0

**Test Data**:
```typescript
const validConstraints = {
  requires: ["TableRow", "TableCell"],  // Must exist in catalog
  conflictsWith: ["OtherTable"],  // Cannot include "DataTable" itself
  excludedSlots: ["header", "footer"],  // Must have affinity=0
};

const invalidConstraints = {
  requires: ["NonExistentComponent"],  // ERROR: not in catalog
  conflictsWith: ["DataTable"],  // ERROR: self-reference
};
```

**Validation**:
- Valid constraints accepted
- Invalid constraints rejected with LAYER2-E007
- Self-referential conflicts rejected with LAYER2-E007

---

## 2. Token Validation Acceptance Criteria

### Scenario 2.1: Valid Token Reference Validation

**Given** a component mapping that references tokens existing in Layer 1 metadata
**When** the validator checks all token references
**Then** all references should pass validation
**And** no errors or warnings should be logged
**And** the validation should complete within 100ms

**Test Data**:
```typescript
const layer1Tokens = [
  { name: "color-primary", value: "oklch(0.55 0.15 270)" },
  { name: "color-primary-hover", value: "oklch(0.50 0.15 270)" },
];

const buttonMapping = {
  states: {
    default: { backgroundColor: "color-primary" },
    hover: { backgroundColor: "color-primary-hover" },
  }
};
```

**Validation**:
- All token references resolve successfully
- Validation returns `{ valid: true, errors: [] }`
- Execution time < 100ms

---

### Scenario 2.2: Invalid Token Reference Detection

**Given** a component mapping that references non-existent tokens
**When** the validator checks all token references
**Then** the validator should detect invalid references
**And** the validator should provide LAYER2-E001 error
**And** the validator should suggest similar tokens

**Test Data**:
```typescript
const layer1Tokens = [
  { name: "color-primary", value: "oklch(0.55 0.15 270)" },
];

const buttonMapping = {
  states: {
    default: { backgroundColor: "color-primry" }, // Typo
  }
};
```

**Expected Errors**:
```typescript
{
  code: "LAYER2-E001",
  message: "Token 'color-primry' not found",
  suggestion: "Did you mean 'color-primary'?"
}
```

**Validation**:
- Typo detected and suggestion provided
- Validation returns `{ valid: false, errors: [...] }`

---

## 3. State Completeness Acceptance Criteria

### Scenario 3.1: Complete State Coverage Validation

**Given** a component mapping with all 5 required states
**When** the state completeness checker validates the mapping
**Then** the checker should return PASS
**And** no warnings should be logged

**Test Data**:
```typescript
const completeMapping = {
  tokenBindings: {
    states: {
      default: { backgroundColor: "color-primary" },
      hover: { backgroundColor: "color-primary-hover" },
      focus: { borderColor: "color-focus-ring" },
      active: { backgroundColor: "color-primary-active" },
      disabled: { backgroundColor: "color-disabled", opacity: "opacity-disabled" },
    }
  }
};
```

**Validation**:
- Completeness check returns `{ complete: true, missingStates: [] }`
- No warnings logged

---

### Scenario 3.2: Incomplete State Coverage Detection

**Given** a component mapping missing required states
**When** the state completeness checker validates the mapping
**Then** the checker should return FAIL with LAYER2-E002
**And** the checker should list all missing states
**And** the checker should prevent binding generation

**Test Data**:
```typescript
const incompleteMapping = {
  tokenBindings: {
    states: {
      default: { backgroundColor: "color-primary" },
      hover: { backgroundColor: "color-primary-hover" },
      // Missing: focus, active, disabled
    }
  }
};
```

**Validation**:
- Completeness check returns `{ complete: false, missingStates: ["focus", "active", "disabled"] }`
- Error: LAYER2-E002 "Missing states: focus, active, disabled"
- Binding generation blocked

---

### Scenario 3.3: Empty State Definition Handling

**Given** a component mapping with an empty state definition
**When** the state completeness checker validates the mapping
**Then** the checker should detect the empty state
**And** return validation error LAYER2-E002
**And** not allow binding generation to proceed

**Test Data**:
```typescript
const emptyStateMapping = {
  tokenBindings: {
    states: {
      default: { backgroundColor: "color-primary" },
      hover: {}, // Empty state - should fail
      focus: { borderColor: "color-focus" },
      active: { backgroundColor: "color-active" },
      disabled: { opacity: "opacity-disabled" },
    }
  }
};
```

**Validation**:
- Empty state detected: hover
- Error: "State 'hover' has no token bindings defined"
- Binding generation blocked

---

## 4. All 20 Components Acceptance Criteria

### Scenario 4.1: Complete Component Catalog

**Given** the component knowledge catalog
**When** the system checks for completeness
**Then** all 20 core components should have complete entries
**And** each entry should have all required fields
**And** all token references should be valid

**20 Core Components Checklist**:
- [ ] Button (atom, action)
- [ ] Input (atom, input)
- [ ] Card (molecule, container)
- [ ] Modal (organism, container)
- [ ] Dropdown (molecule, input)
- [ ] Checkbox (atom, input)
- [ ] Radio (atom, input)
- [ ] Switch (atom, input)
- [ ] Slider (atom, input)
- [ ] Badge (atom, display)
- [ ] Alert (molecule, display)
- [ ] Toast (molecule, display)
- [ ] Tooltip (atom, display)
- [ ] Popover (molecule, container)
- [ ] Tabs (molecule, navigation)
- [ ] Accordion (molecule, container)
- [ ] Select (atom, input)
- [ ] Textarea (atom, input)
- [ ] Progress (atom, display)
- [ ] Avatar (atom, display)

**Validation**:
- All 20 components present
- 100 total states defined (20 x 5)
- Zero invalid token references

---

### Scenario 4.2: Per-Component Semantic Metadata

**Given** each component in the catalog
**When** semantic metadata is inspected
**Then** `purpose` shall be descriptive (min 20 characters)
**And** `visualImpact` shall be appropriate for component type
**And** `complexity` shall match component implementation complexity

**Validation**:
- All purpose strings >= 20 characters
- Visual impact makes sense (e.g., Button = prominent, Badge = subtle/neutral)
- Complexity aligns with implementation (e.g., Modal = medium/high)

---

## 5. Zod Schema Generation Acceptance Criteria

### Scenario 5.1: Type-Safe Schema Generation

**Given** ComponentKnowledge entries for all 20 components
**When** the Zod schema generator processes them
**Then** each component should have a valid Zod schema
**And** TypeScript types should be inferred correctly
**And** schemas should validate props accurately

**Test Data**:
```typescript
const ButtonPropsSchema = z.object({
  variant: z.enum(["default", "primary", "secondary", "ghost"]),
  size: z.enum(["sm", "md", "lg"]),
  disabled: z.boolean(),
});

type ButtonProps = z.infer<typeof ButtonPropsSchema>;
```

**Validation**:
- Schema validates valid props: `{ variant: "primary", size: "md", disabled: false }` → PASS
- Schema rejects invalid props: `{ variant: "invalid" }` → FAIL
- TypeScript type inference works correctly

---

### Scenario 5.2: Schema Validation Error Messages

**Given** a generated Zod schema for a component
**When** invalid props are validated
**Then** the schema should return descriptive error messages
**And** errors should indicate which field is invalid
**And** errors should suggest valid values

**Expected Errors**:
```typescript
{
  errors: [
    { path: ["variant"], message: "Invalid enum value. Expected 'default' | 'primary' | 'secondary' | 'ghost'" }
  ]
}
```

**Validation**:
- Errors list all invalid fields
- Messages include expected values
- Error format is actionable

---

## 6. CSS-in-JS Binding Generation Acceptance Criteria

### Scenario 6.1: Vanilla Extract Binding Format Validation

**Given** ComponentKnowledge entries with token bindings
**When** the Vanilla Extract generator produces bindings
**Then** the bindings should use CSS variable references (`var(--token-name)`)
**And** the bindings should support all 5 states
**And** the generated code should be valid TypeScript

**Expected Output**:
```typescript
import { style } from "@vanilla-extract/css";

export const buttonBase = style({
  backgroundColor: "var(--color-primary)",
  color: "var(--color-text-on-primary)",

  selectors: {
    "&:hover": { backgroundColor: "var(--color-primary-hover)" },
    "&:focus": { borderColor: "var(--color-focus-ring)" },
    "&:active": { backgroundColor: "var(--color-primary-active)" },
    "&:disabled": { backgroundColor: "var(--color-disabled)" },
  },
});
```

**Validation**:
- All CSS properties use `var()` syntax
- All 5 states in selectors object
- TypeScript compiles without errors

---

### Scenario 6.2: Zero Hardcoded Values Enforcement

**Given** generated CSS-in-JS bindings for all 20 components
**When** the system checks for hardcoded color/size values
**Then** zero hardcoded values should be detected
**And** all values should reference CSS variables
**And** the system should fail if hardcoded values are found

**Test Procedure**:
```typescript
const hardcodedPattern = /(#[0-9a-fA-F]{3,6}|rgb\(|rgba\(|hsl\(|[0-9]+px)/;
const generatedCode = fs.readFileSync("button.styles.ts", "utf-8");
const hasHardcoded = hardcodedPattern.test(generatedCode);
assert(!hasHardcoded);
```

**Validation**:
- No hex colors (#fff, #000, etc.)
- No rgb/rgba/hsl values
- No hardcoded pixel values (except border-width: 1px)
- All design token values use CSS variables

---

## 7. Knowledge Export Acceptance Criteria

### Scenario 7.1: JSON Export Format

**Given** complete ComponentKnowledge catalog
**When** JSON export is requested
**Then** valid JSON shall be generated
**And** all components shall be included
**And** schema version shall be "2.0.0"

**Expected JSON Structure**:
```json
{
  "schemaVersion": "2.0.0",
  "generatedAt": "ISO timestamp",
  "components": { ... }
}
```

**Validation**:
- JSON parses without errors
- All 20 components present
- Schema version matches spec

---

### Scenario 7.2: Markdown Export Format

**Given** complete ComponentKnowledge catalog
**When** Markdown export is requested
**Then** valid Markdown shall be generated
**And** all components shall have sections
**And** slot affinity tables shall be included

**Validation**:
- Markdown renders correctly
- All 20 components documented
- Affinity tables present

---

## 8. Performance Acceptance Criteria

### Scenario 8.1: Full Pipeline Performance

**Given** all 20 ComponentKnowledge entries
**When** the full pipeline runs (validation + schema + CSS-in-JS + export)
**Then** total time shall be < 600ms
**And** memory usage shall be < 100MB

**Performance Breakdown**:
- Validation: < 100ms
- Schema Generation: < 200ms
- CSS-in-JS Generation: < 300ms
- Export: < 100ms

**Validation**:
- Full pipeline < 600ms
- Memory usage < 100MB

---

## 9. Quality Gate Criteria (TRUST 5 Framework)

### 9.1 Test Coverage Gate
- **Requirement**: ≥ 85% code coverage
- **Validation**: Run `vitest --coverage`
- **Failure Action**: Block merge until coverage increases

### 9.2 Code Quality Gate
- **Requirement**: Zero ESLint errors, zero TypeScript errors
- **Validation**: Run `eslint .` and `tsc --noEmit`
- **Failure Action**: Fix errors before merge

### 9.3 Completeness Gate
- **Requirement**: All 20 components with complete ComponentKnowledge
- **Validation**: Check catalog completeness
- **Failure Action**: Complete missing entries

---

## 10. Definition of Done

### Functional Completeness
- ✅ All 20 components have complete ComponentKnowledge entries
- ✅ All slotAffinity values in 0.0-1.0 range
- ✅ All constraints validated for consistency
- ✅ All token references validated against Layer 1 metadata
- ✅ Generated Zod schemas are type-safe and valid
- ✅ CSS-in-JS bindings reference CSS variables correctly
- ✅ JSON and Markdown exports generated correctly

### Quality Completeness
- ✅ Test coverage ≥ 85%
- ✅ All acceptance scenarios pass
- ✅ Zero ESLint errors
- ✅ Zero TypeScript errors
- ✅ Performance benchmarks met (< 600ms full pipeline)

### Integration Completeness
- ✅ Layer 1 metadata consumed successfully
- ✅ React components work with generated schemas and styles
- ✅ Layer 3 can consume generated knowledge catalog

### Documentation Completeness
- ✅ API documentation complete (JSDoc)
- ✅ Component knowledge documentation generated (Markdown)
- ✅ Usage examples provided

---

**TAG**: SPEC-LAYER2-001
**Test Framework**: Vitest
**Coverage Tool**: @vitest/coverage-v8
**Dependencies**: SPEC-LAYER1-001 (Token Generator Engine)
**Last Updated**: 2026-01-20
