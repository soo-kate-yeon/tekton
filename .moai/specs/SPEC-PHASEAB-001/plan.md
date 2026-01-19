# Implementation Plan: SPEC-PHASEAB-001

## Milestone Overview

**Execution Strategy**: Three sequential milestones with clear dependencies:

```
Milestone 1: A1 Theme       (Foundation)
            ↓
Milestone 2: A2 Token Gen    (OKLCH Core)
            ↓
Milestone 3: A3 Contracts    (Validation)
```

**Priority Classification**:
- **Primary Goal**: A1 + A2 (Theme + Token Generation)
- **Secondary Goal**: A3 MVP (8 core components)
- **Optional Goal**: A3 Extended (42 additional components)

---

## Milestone 1: A1 Theme Package (Foundation)

**Objective**: Establish theme definition system for technology stack configuration.

**Dependencies**: None (foundation layer)

**Deliverables**:
1. Theme JSON schema with TypeScript types
2. Theme loader with validation
3. Default theme: `next-tailwind-shadcn.json`

### Implementation Steps

#### Step 1.1: Define Package Structure

```
packages/theme/
├── src/
│   ├── types/
│   │   └── theme.ts          # TypeScript type definitions
│   ├── themes/
│   │   └── next-tailwind-shadcn.json
│   ├── loader.ts               # Theme loading logic
│   ├── validator.ts            # JSON schema validation
│   └── index.ts                # Public API exports
├── __tests__/
│   ├── loader.test.ts
│   └── validator.test.ts
├── package.json
└── tsconfig.json
```

#### Step 1.2: Implement TypeScript Types

**File**: `src/types/theme.ts`

```typescript
export interface Theme {
  id: string;
  version: string;
  name: string;
  description: string;

  stack: {
    framework: 'nextjs' | 'vite' | 'remix';
    styling: 'tailwindcss';
    components: 'shadcn';
  };

  dependencies: {
    required: Record<string, string>;
    devDependencies: Record<string, string>;
  };

  fileStructure: Record<string, string>;
  componentWhitelist: ShadcnComponent[];
  themeMode: 'css-variables' | 'tailwind-config';
}

export type ShadcnComponent =
  | 'button' | 'input' | 'card' | 'dialog'
  | 'form' | 'data-table' | 'select' | 'alert'
  | 'toast' | 'tabs' | 'dropdown-menu' | 'navigation-menu'
  // ... (50+ total components)
```

#### Step 1.3: Create Default Theme

**File**: `src/themes/next-tailwind-shadcn.json`

Key configuration elements:
- Framework: Next.js 14+
- Styling: Tailwind CSS 3.4+
- Component library: shadcn/ui
- Theme mode: CSS variables (shadcn standard)
- Component whitelist: 8 MVP components initially

#### Step 1.4: Implement Validation

**Validation Strategy**:
- Use JSON Schema or Zod for runtime validation
- Validate on theme load before processing
- Provide detailed error messages with field paths

**Error Handling**:
- Invalid structure → throw PresetValidationError
- Missing required fields → list all missing fields
- Invalid dependency versions → suggest valid semver format

#### Step 1.5: Write Tests

**Test Coverage Requirements**:
- Valid theme loading: ✓
- Invalid structure rejection: ✓
- Missing fields detection: ✓
- Dependency version validation: ✓
- TypeScript type compatibility: ✓

**Target**: ≥90% coverage for theme package

---

## Milestone 2: A2 Token Generator Package (OKLCH Core)

**Objective**: Implement OKLCH-based design token generation with WCAG AA compliance.

**Dependencies**: None (can run standalone)

**Deliverables**:
1. Q&A schema with 7 questions
2. OKLCH palette generation (primary, neutral, status)
3. CSS variables output
4. DTCG format export
5. Accessibility validation suite

### Implementation Steps

#### Step 2.1: Define Package Structure

```
packages/token-generator/
├── src/
│   ├── schema/
│   │   └── questionnaire.ts    # Q&A schema + defaults
│   ├── utils/
│   │   ├── color.ts             # OKLCH palette generation
│   │   ├── semantic.ts          # Semantic color mapping
│   │   ├── scales.ts            # Radius, spacing, typography
│   │   └── wcag.ts              # Accessibility validation
│   ├── output/
│   │   ├── css.ts               # CSS variables formatter
│   │   ├── dtcg.ts              # DTCG format exporter
│   │   └── tailwind.ts          # Tailwind config extension
│   ├── generator.ts             # Main generation logic
│   └── index.ts
├── __tests__/
│   ├── generator.test.ts        # Determinism tests
│   ├── color.test.ts            # Palette generation
│   ├── wcag.test.ts             # Accessibility validation
│   └── output.test.ts           # Output formatting
├── package.json
└── tsconfig.json
```

#### Step 2.2: Define Q&A Schema

**File**: `src/schema/questionnaire.ts`

**7 Questions**:
1. Brand Tone: minimal | neutral | playful | serious | luxury
2. Contrast Level: standard | high
3. UI Density: comfortable | compact
4. Border Radius: none | sm | md | lg
5. Primary Color: theme (blue, green, purple) | custom (hex)
6. Neutral Tone: warm | cool | gray
7. Font Scale: small | default | large

**Default Configuration**:
```typescript
export const DEFAULT_QUESTIONNAIRE: TokenQuestionnaire = {
  brandTone: 'neutral',
  contrast: 'standard',
  density: 'comfortable',
  borderRadius: 'md',
  primaryColor: { type: 'theme', value: 'blue' },
  neutralTone: 'gray',
  fontScale: 'default'
};
```

#### Step 2.3: Implement OKLCH Palette Generation

**Critical Algorithm**: Primary Palette with 10 Steps

**File**: `src/utils/color.ts`

**Lightness Scale Table**:
```typescript
const LIGHTNESS_SCALE: Record<number, { l: number; chromaScale: number }> = {
  50:  { l: 0.97, chromaScale: 0.25 },
  100: { l: 0.93, chromaScale: 0.40 },
  200: { l: 0.87, chromaScale: 0.60 },
  300: { l: 0.78, chromaScale: 0.80 },
  400: { l: 0.68, chromaScale: 0.95 },
  500: { l: 0.55, chromaScale: 1.00 },  // Base reference
  600: { l: 0.48, chromaScale: 0.95 },
  700: { l: 0.40, chromaScale: 0.85 },
  800: { l: 0.32, chromaScale: 0.75 },
  900: { l: 0.24, chromaScale: 0.65 },
};
```

**Generation Process**:
1. Parse input hex to OKLCH using culori
2. For each step, calculate target lightness and scaled chroma
3. Preserve original hue across all steps
4. Check sRGB gamut validity
5. Apply clampChroma if out-of-gamut
6. Convert to hex and store with metadata

**Key Function**:
```typescript
export function generatePrimaryPalette(primaryHex: string): ColorScale;
```

#### Step 2.4: Implement Neutral Palette Generation

**Background-Based Scaling Strategy**:

**Light Mode**:
- 50 = background (~0.97 lightness)
- 900 = foreground (~0.15 lightness)

**Dark Mode**:
- 900 = background (~0.10 lightness)
- 50 = foreground (~0.97 lightness)

**Tinting Modes**:
- **pure**: Chroma = 0.005 (nearly grayscale)
- **tinted**: Chroma = 0.012, Hue = primary hue
- **custom**: User-defined chroma and hue

**Key Function**:
```typescript
export function generateNeutralPalette(config: NeutralConfig): ColorScale;
```

#### Step 2.5: Implement Status Color Palettes

**Status Colors**:
```typescript
const STATUS_COLORS = {
  success: '#22C55E',  // Green-500
  warning: '#F59E0B',  // Amber-500
  error: '#EF4444',    // Red-500
  info: '#3B82F6',     // Blue-500
};
```

**Strategy**: Reuse `generatePrimaryPalette` for each status color.

#### Step 2.6: Implement Semantic Color Mapping

**shadcn Token Mapping** (Light Mode):
```typescript
{
  background: neutral-50,
  foreground: neutral-900,
  card: neutral-50,
  cardForeground: neutral-900,
  popover: neutral-50,
  popoverForeground: neutral-900,
  primary: primary-500,
  primaryForeground: neutral-50,
  secondary: neutral-100,
  secondaryForeground: neutral-900,
  muted: neutral-100,
  mutedForeground: neutral-500,
  accent: neutral-100,
  accentForeground: neutral-900,
  destructive: error-500,
  destructiveForeground: neutral-50,
  border: neutral-200,
  input: neutral-200,
  ring: primary-500,
}
```

**Dark Mode**: Reverse mapping (900 ↔ 50 swap).

**Key Function**:
```typescript
export function mapToShadcnTokens(
  primaryPalette: ColorScale,
  neutralPalette: ColorScale,
  isLightMode: boolean
): ShadcnColorTokens;
```

#### Step 2.7: Implement Output Formatters

**CSS Variables Output**:
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 47.4% 11.2%;
    --primary: 221.2 83.2% 53.3%;
    /* ... */
  }

  .dark {
    --background: 224 71% 4%;
    --foreground: 213 31% 91%;
    /* ... */
  }
}
```

**DTCG Format Export** (Design Token Community Group):
```json
{
  "color": {
    "primary": {
      "500": {
        "$type": "color",
        "$value": "#3b82f6",
        "oklch": { "l": 0.55, "c": 0.15, "h": 264 }
      }
    }
  }
}
```

**Tailwind Config Extension**:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ... 100-900
        }
      }
    }
  }
}
```

#### Step 2.8: Implement WCAG Validation

**Validation Requirements**:
- Normal text (16px): ≥4.5:1 contrast ratio
- Large text (24px): ≥3:1 contrast ratio
- High contrast mode: ≥7:1 for normal text

**Validation Process**:
1. Load generated token pairs (e.g., primary on primaryForeground)
2. Convert HSL values to hex using chroma-js
3. Calculate contrast ratio: `chroma.contrast(color1, color2)`
4. Assert ratio meets threshold
5. Report violations with suggested adjustments

**Key Function**:
```typescript
export function validateWCAG(tokens: ShadcnColorTokens): ValidationResult;
```

#### Step 2.9: Write Comprehensive Tests

**Test Categories**:

1. **Determinism Tests**:
   - Run generation 100 times with same input
   - Verify byte-identical output

2. **Palette Generation Tests**:
   - Verify 10 steps for primary palette
   - Verify lightness values match LIGHTNESS_SCALE
   - Verify chroma scaling is applied correctly

3. **Gamut Clipping Tests**:
   - Generate highly saturated colors (red, cyan, magenta)
   - Verify all outputs are valid hex
   - Verify clipping preserves hue and lightness

4. **WCAG Compliance Tests**:
   - Test all 12 token pairs (primary/primaryForeground, etc.)
   - Verify minimum 4.5:1 contrast
   - Test with default Q&A answers

5. **Edge Case Tests**:
   - Custom primary color: #000000 (black)
   - Custom primary color: #FFFFFF (white)
   - Invalid hex input → error handling
   - Missing questionnaire fields → default values

**Target**: ≥85% coverage for token-generator package

---

## Milestone 3: A3 Component Contracts Package (Validation)

**Objective**: Define component usage contracts with comprehensive shadcn/ui coverage.

**Dependencies**: None (can reference theme types if needed)

**Deliverables**:
1. Contract schema with 6 rule types
2. MVP contracts for 8 core components
3. Layout policies (10+ rules)
4. Contract registry with O(1) lookup

### Implementation Steps

#### Step 3.1: Define Package Structure

```
packages/contracts/
├── src/
│   ├── schema/
│   │   └── contract.ts          # Contract type definitions
│   ├── definitions/
│   │   ├── index.ts             # Registry of all contracts
│   │   ├── button.ts            # Button contract
│   │   ├── input.ts             # Input contract
│   │   ├── dialog.ts            # Dialog contract
│   │   ├── form.ts              # Form contract
│   │   ├── data-table.ts        # DataTable contract
│   │   ├── card.ts              # Card contract
│   │   ├── select.ts            # Select contract
│   │   └── alert.ts             # Alert contract
│   ├── policies/
│   │   └── layout.ts            # Layout policies
│   ├── registry.ts              # Contract registry
│   └── index.ts
├── __tests__/
│   ├── registry.test.ts
│   ├── button.test.ts
│   └── layout-policies.test.ts
├── package.json
└── tsconfig.json
```

#### Step 3.2: Define Contract Schema

**File**: `src/schema/contract.ts`

**Core Types**:
```typescript
export interface ComponentContract {
  component: ShadcnComponent;
  version: string;
  category: ComponentCategory;
  constraints: Constraint[];
  bestPractices?: BestPractice[];
}

export interface Constraint {
  id: string;              // e.g., "BTN-A01"
  severity: 'error' | 'warning' | 'info';
  description: string;
  rule: ConstraintRule;
  message: string;
  autoFixable: boolean;
  fixSuggestion?: string;
}
```

**6 Rule Types**:
1. **PropCombinationRule**: Forbidden/required prop combinations
2. **ChildrenRule**: Child component structure requirements
3. **AccessibilityRule**: WCAG compliance requirements
4. **ContextRule**: Allowed/forbidden usage contexts
5. **CompositionRule**: Component relationship management
6. **StateRule**: State management patterns

#### Step 3.3: Implement MVP Component Contracts

**MVP Components** (8 total):
1. **button**: 10-15 constraints
2. **input**: 10-12 constraints
3. **dialog**: 8-10 constraints
4. **form**: 12-15 constraints
5. **data-table**: 15-20 constraints (most complex)
6. **card**: 5-7 constraints
7. **select**: 8-10 constraints
8. **alert**: 5-7 constraints

**Example: Button Contract** (Detailed)

**File**: `src/definitions/button.ts`

**Constraint Categories**:

1. **Accessibility Constraints**:
   - BTN-A01: Icon-only buttons must have aria-label (error)
   - BTN-A02: Disabled state should use aria-disabled (warning)

2. **Variant Constraints**:
   - BTN-V01: Destructive buttons must include text label (error)
   - BTN-V02: Avoid ghost variant with destructive action (warning)

3. **Context Constraints**:
   - BTN-C01: Form buttons should specify type attribute (warning)
   - BTN-C02: Dialog footer limited to 1 primary button (error)

4. **State Constraints**:
   - BTN-S01: Async operations should show loading state (info)

5. **Size Consistency**:
   - BTN-Z01: Button groups should use consistent size (warning)

**Example: Data Table Contract** (Most Complex)

**File**: `src/definitions/data-table.ts`

**Constraint Categories**:

1. **Structure**: TableHeader required, TableCaption recommended
2. **State Handling**: Empty state required, loading state recommended, error state recommended
3. **Accessibility**: Sortable columns need aria-sort, selectable rows need aria-selected
4. **Interaction**: Keyboard navigation for selectable tables, pagination integration
5. **Performance**: Virtual scrolling recommendation for 100+ rows

**Total**: 15-20 constraints covering all critical table usage patterns.

#### Step 3.4: Implement Layout Policies

**File**: `src/policies/layout.ts`

**10+ Layout Rules**:

1. **LAY-001**: Section gap minimum (gap-y-6 recommended)
2. **LAY-002**: Form field spacing minimum (space-y-4 recommended)
3. **LAY-003**: Page container max-width recommendation
4. **LAY-004**: Primary CTA count limit per view (max 2)
5. **LAY-005**: Card internal padding consistency (p-6 recommended)
6. **LAY-006**: Button group spacing (gap-2 minimum)
7. **LAY-007**: Modal width constraint (90vh maximum)
8. **LAY-008**: Mobile breakpoint behavior enforcement
9. **LAY-009**: Z-index hierarchy compliance
10. **LAY-010**: Focus indicator visibility requirement

**Policy Structure**:
```typescript
export interface LayoutPolicy {
  id: string;
  severity: 'error' | 'warning' | 'info';
  description: string;
  detector: PolicyDetector;
  message: string;
}
```

#### Step 3.5: Implement Contract Registry

**File**: `src/registry.ts`

**Data Structure**: `Map<ShadcnComponent, ComponentContract>`

**Registry Functions**:
```typescript
export function createRegistry(): ContractRegistry;
export function getConstraintsForComponent(
  registry: ContractRegistry,
  component: string
): Constraint[];
```

**Performance Requirement**: O(1) lookup time for any component.

#### Step 3.6: Write Tests

**Test Coverage**:
1. Registry contains all MVP components: ✓
2. All constraint IDs are unique: ✓
3. All constraints have valid severity levels: ✓
4. Auto-fixable constraints have fix suggestions: ✓
5. Layout policies have valid detectors: ✓

**Target**: ≥85% coverage for contracts package

---

## Technology Stack Versions

### Core Dependencies

**Package: token-generator**
```json
{
  "dependencies": {
    "culori": "^4.0.0",
    "chroma-js": "^2.4.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^1.0.0",
    "@types/chroma-js": "^2.4.0"
  }
}
```

**Package: theme**
```json
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^1.0.0",
    "zod": "^3.23.0"
  }
}
```

**Package: contracts**
```json
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

### Target Environment Versions

- **Next.js**: ≥14.0.0
- **Tailwind CSS**: ≥3.4.0
- **shadcn/ui**: Latest (no specific version, uses CLI)
- **React**: ≥18.0.0
- **TypeScript**: ≥5.0.0

---

## Testing Strategy

### Unit Test Coverage

**Per-Package Requirements**:
- theme: ≥90% coverage
- token-generator: ≥85% coverage
- contracts: ≥85% coverage

**Test Framework**: Vitest (faster than Jest for TypeScript)

### Integration Test Scenarios

**Scenario 1**: Theme → Token Generation
- Load next-tailwind-shadcn theme
- Generate tokens with default Q&A
- Verify CSS variables match expected format

**Scenario 2**: Token Generation → WCAG Validation
- Generate tokens with various primary colors
- Run WCAG validation suite
- Assert all combinations pass AA threshold

**Scenario 3**: Contract Registry Lookup
- Initialize registry with all MVP contracts
- Perform 1000 lookups
- Verify average lookup time < 1ms

### End-to-End Test Scenarios

**E2E Test**: Complete Workflow
1. Load theme
2. Generate tokens
3. Apply tokens to Next.js project
4. Validate generated CSS
5. Check component rendering

**Environment**: Test Next.js project in `tests/fixtures/`

---

## Risk Management

### Critical Risks

**Risk 1**: OKLCH Browser Support
- **Likelihood**: High (older browsers)
- **Impact**: High (broken colors)
- **Mitigation**: Generate HSL fallback values
- **Verification**: Test in Safari 14, Chrome 110

**Risk 2**: Gamut Clipping Artifacts
- **Likelihood**: Medium (saturated colors)
- **Impact**: Medium (color quality)
- **Mitigation**: Log clipping events, provide visual preview
- **Verification**: Manual review of highly saturated palettes

**Risk 3**: Contract Coverage Gaps
- **Likelihood**: High (50+ components)
- **Impact**: Medium (incomplete validation)
- **Mitigation**: Phased rollout (MVP → P1 → Full)
- **Verification**: Track coverage percentage

**Risk 4**: Performance Degradation
- **Likelihood**: Low (O(1) lookup)
- **Impact**: Medium (slow validation)
- **Mitigation**: Benchmark critical paths, implement caching
- **Verification**: Performance test suite

---

## Optional Extensions (Post-MVP)

### Extension 1: Additional Component Contracts (P1-P5)

**P1 Priority** (8 components):
- tabs, dropdown-menu, toast, navigation-menu
- sheet, popover, tooltip, badge

**P2 Priority** (8 components):
- checkbox, radio-group, switch, slider
- textarea, label, separator, progress

**P3-P5**: Remaining ~26 components

**Effort**: ~1 week per priority level

### Extension 2: Visual Preview Tool

**Feature**: Generate color palette previews in IDE extension.

**Implementation**:
- SVG generation of color swatches
- Accessibility report overlay
- Export to Figma plugin

**Effort**: ~1 week

### Extension 3: Theme Variants

**Feature**: Support multiple theme themes beyond default.

**Variants**:
- Material Design 3 mapping
- Bootstrap 5 mapping
- Custom design system imports

**Effort**: ~2 weeks

---

## Development Workflow

### Phase 1: Setup (Day 1)

1. Initialize monorepo with pnpm workspaces
2. Configure TypeScript with strict mode
3. Set up Vitest testing framework
4. Configure ESLint + Prettier
5. Create package scaffolds

### Phase 2: Theme Package (Days 2-3)

1. Define types
2. Create default theme JSON
3. Implement loader
4. Write tests
5. Verify integration

### Phase 3: Token Generator (Days 4-10)

1. Define Q&A schema (Day 4)
2. Implement OKLCH palette generation (Days 5-6)
3. Implement neutral palette (Day 7)
4. Implement semantic mapping (Day 8)
5. Implement output formatters (Day 9)
6. Write comprehensive tests (Day 10)

### Phase 4: Contracts Package (Days 11-15)

1. Define contract schema (Day 11)
2. Implement button contract (Day 12)
3. Implement remaining MVP contracts (Days 13-14)
4. Implement layout policies (Day 15)
5. Write tests and documentation

### Phase 5: Integration & Polish (Days 16-18)

1. Integration testing
2. Documentation
3. Examples
4. Performance optimization

---

## Success Metrics

### Quantitative Metrics

1. **Test Coverage**: ≥85% across all packages
2. **WCAG Compliance**: 100% of generated combinations pass AA
3. **Determinism**: 100% consistency across 100 runs
4. **Performance**: Contract lookup < 1ms average
5. **Type Safety**: 0 `any` types in public APIs

### Qualitative Metrics

1. **Developer Experience**: Clear error messages, intuitive APIs
2. **Documentation Quality**: All public APIs have TSDoc comments
3. **Code Maintainability**: Modular structure, clear separation of concerns

---

## Next Steps After Phase A

**Phase B**: IDE Bootstrap + Integration
- VS Code extension commands
- Stack detection
- Automatic shadcn setup
- Create screen workflow preparation

**Phase C**: Agentic Screen Generation
- LLM orchestrator integration
- Constraint-aware code generation
- Multi-agent collaboration

**Timeline**: Phase A completion enables immediate Phase B start.
