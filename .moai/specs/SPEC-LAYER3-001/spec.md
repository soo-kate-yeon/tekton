---
id: SPEC-LAYER3-001
version: "2.0.0"
status: "draft"
created: "2026-01-19"
updated: "2026-01-20"
author: "asleep"
priority: "medium"
---

# HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-19 | asleep | Initial SPEC creation for Component Generation Engine |
| 1.1.0 | 2026-01-20 | asleep | Refinements: Layer 2 integration contract, error handling, performance targets |
| 2.0.0 | 2026-01-20 | asleep | Major restructure: Integrated AI-Native Component Knowledge System. Added Slot Semantic Registry (Module A), Blueprint Recipe System (Module C), Semantic Scoring Algorithm, Safety Protocols. Replaced Blueprint structure. |

---

# SPEC-LAYER3-001: Component Generation Engine

## 1. Overview

### 1.1 Purpose
The Component Generation Engine is the **execution layer** that generates production-ready React components through intelligent slot-based assembly. This layer implements:

1. **Slot Semantic Registry (Module A)**: Defines screen regions with semantic roles and component constraints
2. **Blueprint Recipe System (Module C)**: Intent-based component selection with fluid fallback
3. **Semantic Scoring Algorithm**: Weighted scoring for optimal component placement
4. **Safety Protocols**: Threshold checks and hallucination prevention

This layer consumes Component Knowledge from Layer 2 and applies AI reasoning to generate contextually appropriate UI code.

### 1.2 Scope
- **Slot Semantic Registry**: Global and local slot definitions with roles and constraints
- **Blueprint System**: AI-generated (Basic Mode) and user-editable (Pro Mode) blueprints
- **Semantic Scoring**: Component selection algorithm with intent matching
- **Safety Protocols**: Threshold check, hallucination check, constraint validation
- **Code Generation**: React JSX with TypeScript support
- **Supabase Integration**: Blueprint persistence and versioning
- **Responsive Utilities**: Mobile-first breakpoint system
- **E2E Test Generation**: Automated test creation for generated components

### 1.3 Dependencies
- **SPEC-LAYER1-001**: Token Generator Engine (REQUIRED)
- **SPEC-LAYER2-001**: Component Knowledge System (REQUIRED)
- **External Libraries**:
  - `@babel/generator` (^7.24.0) - AST to code generation
  - `@babel/types` (^7.24.0) - AST construction
  - `@supabase/supabase-js` (^2.45.0) - Blueprint storage
  - `zod` (^3.23.0) - Blueprint schema validation
  - `prettier` (^3.4.0) - Code formatting

---

## 2. Environment

### 2.1 Technical Environment
- **Runtime**: Node.js 20+ / Browser (ES2022+)
- **Language**: TypeScript 5.9+
- **Build System**: Turbo (existing monorepo setup)
- **Package Manager**: npm (existing project standard)
- **Database**: Supabase (PostgreSQL backend)

### 2.2 Integration Points
- **Input**:
  - User intent (natural language or structured Blueprint)
  - Layer 2 Component Knowledge Catalog
  - Layer 1 tokens (CSS variables)
- **Output**:
  - React component files (`.tsx`)
  - Component metadata (`.meta.json`)
  - E2E test files (`.spec.ts`)
  - Blueprint JSON (versioned)

---

## 3. Assumptions

### 3.1 Technical Assumptions
- **ASSUMPTION-001**: Semantic Scoring Algorithm produces consistent, reasonable results
  - **Confidence**: Medium - Algorithm design based on Functional Spec
  - **Evidence**: Industry examples (recommendation engines)
  - **Risk if Wrong**: May need weight tuning or alternative algorithms
  - **Validation**: Extensive testing with diverse layouts

- **ASSUMPTION-002**: AI (Claude API) can interpret user intent to generate valid Blueprints
  - **Confidence**: High - LLMs excel at structured JSON generation
  - **Evidence**: Existing LLM capabilities
  - **Risk if Wrong**: More manual Blueprint authoring required
  - **Validation**: Test with diverse user prompts

- **ASSUMPTION-003**: Safety thresholds (0.4 minimum score) are appropriate for quality
  - **Confidence**: Medium - Based on Functional Spec recommendation
  - **Evidence**: Design system literature
  - **Risk if Wrong**: Threshold may need adjustment
  - **Validation**: User testing with generated components

### 3.2 Business Assumptions
- **ASSUMPTION-004**: Slot-based assembly covers 80%+ of common UI patterns
  - **Confidence**: High - Based on Bootstrap/Tailwind layout analysis
  - **Evidence**: Web layout pattern research
  - **Risk if Wrong**: Additional slot types may be needed
  - **Validation**: User feedback during beta

---

## 4. Requirements

### 4.1 Ubiquitous Requirements (Always Active)

**REQ-LAYER3-001**: The system shall always validate Blueprint schemas before component generation
- **Rationale**: Invalid Blueprints cause runtime errors
- **Acceptance**: 100% of Blueprints validated against Zod schemas

**REQ-LAYER3-002**: The system shall always generate TypeScript-compatible React components
- **Rationale**: TypeScript support is non-negotiable
- **Acceptance**: All generated components compile without TypeScript errors

**REQ-LAYER3-003**: The system shall always apply Semantic Scoring Algorithm for component selection
- **Rationale**: Consistent, intelligent component placement
- **Acceptance**: All slot assignments use scoring formula

**REQ-LAYER3-004**: The system shall always enforce Safety Protocol threshold check (score ≥ 0.4)
- **Rationale**: Prevent low-quality component placements
- **Acceptance**: Components with score < 0.4 trigger fallback

**REQ-LAYER3-005**: The system shall always validate generated components against Layer 2 Component Knowledge
- **Rationale**: Prevent hallucinated component references
- **Acceptance**: All component names verified against catalog

### 4.2 Event-Driven Requirements (User/System Triggers)

**REQ-LAYER3-006**: WHEN user provides natural language intent (Basic Mode), THEN the system shall generate a Blueprint using AI
- **Rationale**: Automation for non-technical users
- **Acceptance**: AI generates valid Blueprint JSON

**REQ-LAYER3-007**: WHEN a component constraint violation is detected, THEN the system shall apply Fluid Fallback
- **Rationale**: Graceful degradation
- **Acceptance**: GenericContainer or suitable alternative assigned

**REQ-LAYER3-008**: WHEN user specifies "Read-Only" intent, THEN the system shall apply Intent-Based Injection (downgrade action components)
- **Rationale**: Context-aware component selection
- **Acceptance**: Action category components receive penalty in scoring

**REQ-LAYER3-009**: WHEN a Blueprint is approved, THEN the system shall save to Supabase with version tracking
- **Rationale**: Version history enables rollback
- **Acceptance**: Blueprint saved with semver version

**REQ-LAYER3-010**: WHEN AI Blueprint generation fails, THEN the system shall provide fallback template Blueprint
- **Rationale**: Graceful degradation
- **Acceptance**: User notified, template Blueprint available

### 4.3 State-Driven Requirements (Conditional Behavior)

**REQ-LAYER3-011**: IF a slot has constraintTags defined, THEN only matching component categories shall be allowed
- **Rationale**: Enforce slot semantic rules
- **Acceptance**: Mismatched components rejected with error

**REQ-LAYER3-012**: IF a component has excludedSlots in constraints, THEN placement in those slots shall fail scoring
- **Rationale**: Honor component placement rules
- **Acceptance**: Excluded slots receive score = 0.0

**REQ-LAYER3-013**: IF Supabase is unavailable, THEN the system shall use local storage fallback
- **Rationale**: Offline development support
- **Acceptance**: Local fallback works without data loss

**REQ-LAYER3-014**: IF a Blueprint references non-existent components, THEN hallucination check shall reject the Blueprint
- **Rationale**: Prevent broken code generation
- **Acceptance**: Validation error with component suggestions

### 4.4 Unwanted Behaviors (Prohibited Actions)

**REQ-LAYER3-015**: The system shall NOT generate components with hardcoded design values
- **Rationale**: Must use Layer 1 tokens
- **Acceptance**: Zero hardcoded colors/sizes in generated code

**REQ-LAYER3-016**: The system shall NOT place components in excluded slots regardless of score
- **Rationale**: Hard constraints must be respected
- **Acceptance**: Constraint violations blocked, not just penalized

**REQ-LAYER3-017**: The system shall NOT expose Supabase API keys in generated code
- **Rationale**: Security
- **Acceptance**: Keys in environment variables only

**REQ-LAYER3-018**: The system shall NOT generate components that fail WCAG AA accessibility
- **Rationale**: Accessibility is mandatory
- **Acceptance**: Generated components pass axe-core checks

### 4.5 Optional Requirements (Nice-to-Have)

**REQ-LAYER3-019**: IF Storybook is configured, THEN generate Storybook stories
- **Rationale**: Documentation automation
- **Acceptance**: Stories render component variants

**REQ-LAYER3-020**: Where feasible, provide visual diff previews for Blueprint changes
- **Rationale**: Change visualization
- **Acceptance**: Side-by-side diff view

---

## 5. Technical Specifications

### 5.1 Core Architecture

**Generation Pipeline**:
```
User Intent → Intent Parser → Blueprint Generator (AI/Manual) →
Schema Validator → Hallucination Check → Slot Semantic Resolver →
Semantic Scoring → Safety Protocol → AST Builder →
Code Generator → Prettier → Output Files
```

**Module Structure**:
```
packages/studio-component-generator/
├── src/
│   ├── slots/
│   │   ├── slot-registry.ts          # Global and local slot definitions
│   │   ├── slot-semantic.ts          # Slot role and constraint logic
│   │   └── slot-resolver.ts          # Resolve slots to components
│   ├── blueprint/
│   │   ├── basic-mode-generator.ts   # AI Blueprint generation
│   │   ├── pro-mode-editor.ts        # Manual Blueprint editing
│   │   ├── schema-validator.ts       # Zod Blueprint validation
│   │   ├── intent-parser.ts          # Parse user intent keywords
│   │   └── blueprint.types.ts        # Blueprint TypeScript types
│   ├── scoring/
│   │   ├── semantic-scorer.ts        # Semantic Scoring Algorithm
│   │   ├── intent-injector.ts        # Intent-Based Injection
│   │   └── scoring.types.ts          # Scoring types
│   ├── safety/
│   │   ├── threshold-check.ts        # Score threshold enforcement
│   │   ├── hallucination-check.ts    # Component existence validation
│   │   ├── constraint-validator.ts   # Slot constraint validation
│   │   └── fluid-fallback.ts         # Fallback component assignment
│   ├── generator/
│   │   ├── ast-builder.ts            # Build Babel AST
│   │   ├── jsx-generator.ts          # Generate JSX code
│   │   ├── typescript-generator.ts   # Generate TypeScript types
│   │   └── responsive-utils.ts       # Responsive utility generation
│   ├── supabase/
│   │   ├── blueprint-storage.ts      # Save/load Blueprints
│   │   ├── version-manager.ts        # Blueprint versioning
│   │   └── supabase-client.ts        # Supabase connection
│   ├── testing/
│   │   ├── e2e-test-generator.ts     # Generate Playwright tests
│   │   └── accessibility-checker.ts  # WCAG validation
│   └── types/
│       ├── blueprint.types.ts        # Blueprint schema types
│       └── component.types.ts        # Generated component types
├── tests/
│   ├── slots/
│   │   └── slot-resolver.test.ts
│   ├── scoring/
│   │   └── semantic-scorer.test.ts
│   ├── safety/
│   │   ├── hallucination-check.test.ts
│   │   └── threshold-check.test.ts
│   └── generator/
│       └── jsx-generator.test.ts
└── package.json
```

### 5.2 Slot Semantic Registry (Module A)

**Global Slots** (Layout Level):
```typescript
interface GlobalSlot {
  name: string;           // "header" | "sidebar" | "main" | "footer"
  role: string;           // Semantic role (e.g., "navigation", "primary-content")
  constraintTags: string[]; // Allowed component categories
  required: boolean;      // Is this slot mandatory in layouts?
  maxChildren?: number;   // Maximum child components
}

const GLOBAL_SLOTS: GlobalSlot[] = [
  {
    name: "header",
    role: "navigation",
    constraintTags: ["navigation", "action", "display"],
    required: false,
    maxChildren: 5,
  },
  {
    name: "sidebar",
    role: "secondary-navigation",
    constraintTags: ["navigation", "input", "action"],
    required: false,
    maxChildren: 10,
  },
  {
    name: "main",
    role: "primary-content",
    constraintTags: ["display", "input", "container", "action"],
    required: true,  // Main slot is always required
    maxChildren: undefined, // No limit
  },
  {
    name: "footer",
    role: "auxiliary",
    constraintTags: ["navigation", "action", "display"],
    required: false,
    maxChildren: 5,
  },
];
```

**Local Slots** (Component Level):
```typescript
interface LocalSlot {
  name: string;           // "card_actions", "table_toolbar", "modal_footer"
  parentComponent: string; // Component that defines this slot
  role: string;
  constraintTags: string[];
}

const LOCAL_SLOTS: LocalSlot[] = [
  {
    name: "card_actions",
    parentComponent: "Card",
    role: "actions",
    constraintTags: ["action"],
  },
  {
    name: "table_toolbar",
    parentComponent: "DataTable",
    role: "toolbar",
    constraintTags: ["action", "input"],
  },
  {
    name: "modal_footer",
    parentComponent: "Modal",
    role: "actions",
    constraintTags: ["action"],
  },
];
```

### 5.3 Blueprint Schema (Replaced Structure)

**New Blueprint JSON Structure**:
```typescript
interface Blueprint {
  /** Unique identifier */
  id: string;

  /** Semantic version (auto-incremented) */
  version: string;

  /** Human-readable name */
  name: string;

  /** Description of the screen/component */
  description: string;

  /** Reference to archetype preset from Layer 1 */
  archetype: string;

  /**
   * User Intent (NEW)
   * Parsed keywords that affect scoring
   */
  intent: {
    /** Primary purpose: "read-only" | "interactive" | "data-entry" | "dashboard" */
    mode: "read-only" | "interactive" | "data-entry" | "dashboard";

    /** Priority keywords extracted from user prompt */
    keywords: string[];

    /** Complexity level affects component selection */
    complexity: "simple" | "moderate" | "complex";
  };

  /**
   * Slot Definitions
   * Each slot contains component assignments
   */
  slots: {
    header?: SlotAssignment;
    sidebar?: SlotAssignment;
    main: SlotAssignment;  // Required
    footer?: SlotAssignment;
    [customSlot: string]: SlotAssignment | undefined;
  };

  /**
   * Responsive Configuration
   */
  responsive: {
    breakpoints: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    strategy: "mobile-first" | "desktop-first";
  };

  /**
   * Accessibility Configuration
   */
  accessibility: {
    ariaLabels: Record<string, string>;
    keyboardNav: boolean;
    screenReaderText: Record<string, string>;
    focusTrap?: boolean;
  };

  /**
   * Metadata
   */
  metadata: {
    created: string;
    updated: string;
    author: string;
    generatedBy: "ai" | "manual";
  };
}

interface SlotAssignment {
  /** Component name from Layer 2 catalog */
  component: string;

  /** Component props */
  props: Record<string, any>;

  /** Nested children (recursive) */
  children?: SlotAssignment[];

  /** Variant overrides */
  variants?: Record<string, any>;

  /**
   * Scoring metadata (computed, not user-provided)
   * Added during slot resolution
   */
  _scoring?: {
    baseAffinity: number;
    intentMatch: number;
    contextPenalty: number;
    finalScore: number;
  };
}
```

**Example Blueprint**:
```json
{
  "id": "bp-admin-dashboard-001",
  "version": "1.0.0",
  "name": "Admin Dashboard",
  "description": "Administrative dashboard with data tables and metrics",
  "archetype": "enterprise-professional",

  "intent": {
    "mode": "dashboard",
    "keywords": ["admin", "data", "metrics", "charts"],
    "complexity": "complex"
  },

  "slots": {
    "header": {
      "component": "Card",
      "props": { "variant": "ghost" },
      "children": [
        { "component": "Badge", "props": { "text": "Admin" } },
        { "component": "Avatar", "props": { "size": "sm" } }
      ]
    },
    "sidebar": {
      "component": "Card",
      "props": { "variant": "default" },
      "children": [
        { "component": "Button", "props": { "variant": "ghost", "text": "Dashboard" } },
        { "component": "Button", "props": { "variant": "ghost", "text": "Users" } },
        { "component": "Button", "props": { "variant": "ghost", "text": "Settings" } }
      ]
    },
    "main": {
      "component": "Card",
      "props": { "variant": "elevated" },
      "children": [
        { "component": "DataTable", "props": { "columns": 5, "rows": 10 } }
      ]
    }
  },

  "responsive": {
    "breakpoints": { "sm": "640px", "md": "768px", "lg": "1024px", "xl": "1280px" },
    "strategy": "mobile-first"
  },

  "accessibility": {
    "ariaLabels": { "header": "Dashboard header", "main": "Main content" },
    "keyboardNav": true,
    "screenReaderText": {}
  },

  "metadata": {
    "created": "2026-01-20T10:00:00Z",
    "updated": "2026-01-20T10:00:00Z",
    "author": "asleep",
    "generatedBy": "ai"
  }
}
```

### 5.4 Semantic Scoring Algorithm

**Scoring Formula** (from Functional Spec):
```
Score = (BaseAffinity × 0.5) + (IntentMatch × 0.3) + (ContextPenalty × 0.2)
```

**Implementation**:
```typescript
interface ScoringInput {
  component: ComponentKnowledge;
  targetSlot: string;
  intent: BlueprintIntent;
  context: ScoringContext;
}

interface ScoringContext {
  /** Other components already in layout */
  siblingComponents: string[];

  /** Slot constraints from registry */
  slotConstraints: string[];

  /** User-specified requirements */
  requirements: string[];
}

function calculateSemanticScore(input: ScoringInput): number {
  const { component, targetSlot, intent, context } = input;

  // 1. Base Affinity (from ComponentKnowledge)
  const baseAffinity = component.slotAffinity[targetSlot] ?? 0.5;

  // 2. Intent Match
  const intentMatch = calculateIntentMatch(component, intent);

  // 3. Context Penalty
  const contextPenalty = calculateContextPenalty(component, context);

  // 4. Final Score
  const score = (baseAffinity * 0.5) + (intentMatch * 0.3) + (contextPenalty * 0.2);

  return Math.max(0, Math.min(1, score)); // Clamp to 0.0-1.0
}

function calculateIntentMatch(component: ComponentKnowledge, intent: BlueprintIntent): number {
  let match = 0.5; // Neutral baseline

  // Read-only mode penalizes action components
  if (intent.mode === "read-only" && component.category === "action") {
    match -= 0.3;
  }

  // Dashboard mode boosts display components
  if (intent.mode === "dashboard" && component.category === "display") {
    match += 0.2;
  }

  // Data-entry mode boosts input components
  if (intent.mode === "data-entry" && component.category === "input") {
    match += 0.2;
  }

  // Keyword matching
  const keywordMatches = intent.keywords.filter(kw =>
    component.semanticDescription.purpose.toLowerCase().includes(kw.toLowerCase())
  ).length;
  match += keywordMatches * 0.1;

  return Math.max(0, Math.min(1, match));
}

function calculateContextPenalty(component: ComponentKnowledge, context: ScoringContext): number {
  let penalty = 1.0; // No penalty baseline

  // Check for conflicting components
  const conflicts = component.constraints.conflictsWith ?? [];
  const hasConflict = conflicts.some(c => context.siblingComponents.includes(c));
  if (hasConflict) {
    penalty -= 0.5;
  }

  // Check slot constraints
  if (!context.slotConstraints.includes(component.category)) {
    penalty -= 0.3;
  }

  return Math.max(0, penalty);
}
```

### 5.5 Safety Protocols

**Threshold Check**:
```typescript
const MINIMUM_SCORE_THRESHOLD = 0.4;

function applyThresholdCheck(
  component: string,
  score: number,
  slot: string
): ComponentAssignment | FallbackAssignment {
  if (score >= MINIMUM_SCORE_THRESHOLD) {
    return { component, score, status: "accepted" };
  }

  // Trigger fallback
  console.warn(
    `Component ${component} scored ${score.toFixed(2)} for slot ${slot}, ` +
    `below threshold ${MINIMUM_SCORE_THRESHOLD}. Applying fallback.`
  );

  return {
    component: "GenericContainer",
    score: 0.5,
    status: "fallback",
    originalComponent: component,
    reason: `Score ${score.toFixed(2)} below threshold`,
  };
}
```

**Hallucination Check**:
```typescript
interface HallucinationCheckResult {
  valid: boolean;
  invalidComponents: string[];
  suggestions: Record<string, string[]>;
}

function validateBlueprintComponents(
  blueprint: Blueprint,
  catalog: ComponentKnowledge[]
): HallucinationCheckResult {
  const catalogNames = new Set(catalog.map(c => c.name));
  const invalidComponents: string[] = [];
  const suggestions: Record<string, string[]> = {};

  // Extract all component names from blueprint
  const usedComponents = extractComponentNames(blueprint);

  for (const comp of usedComponents) {
    if (!catalogNames.has(comp)) {
      invalidComponents.push(comp);

      // Find similar component names for suggestions
      suggestions[comp] = findSimilarComponents(comp, catalogNames);
    }
  }

  return {
    valid: invalidComponents.length === 0,
    invalidComponents,
    suggestions,
  };
}

function findSimilarComponents(name: string, catalog: Set<string>): string[] {
  // Levenshtein distance or fuzzy matching
  return Array.from(catalog)
    .filter(c => levenshteinDistance(name.toLowerCase(), c.toLowerCase()) <= 3)
    .slice(0, 3);
}
```

**Fluid Fallback**:
```typescript
function applyFluidFallback(
  slot: string,
  reason: string,
  slotRegistry: SlotRegistry
): SlotAssignment {
  const slotConfig = slotRegistry.get(slot);

  // Choose appropriate fallback based on slot role
  const fallbackMap: Record<string, string> = {
    "primary-content": "GenericContainer",
    "navigation": "NavPlaceholder",
    "actions": "ButtonGroup",
    "auxiliary": "GenericContainer",
  };

  const fallbackComponent = fallbackMap[slotConfig?.role ?? "primary-content"];

  return {
    component: fallbackComponent,
    props: {},
    _fallback: {
      reason,
      originalSlot: slot,
      appliedAt: new Date().toISOString(),
    },
  };
}
```

### 5.6 Intent-Based Injection

**Intent Parsing**:
```typescript
interface ParsedIntent {
  mode: "read-only" | "interactive" | "data-entry" | "dashboard";
  keywords: string[];
  complexity: "simple" | "moderate" | "complex";
}

function parseUserIntent(prompt: string): ParsedIntent {
  const lowerPrompt = prompt.toLowerCase();

  // Mode detection
  let mode: ParsedIntent["mode"] = "interactive";
  if (lowerPrompt.includes("read-only") || lowerPrompt.includes("view only") || lowerPrompt.includes("display")) {
    mode = "read-only";
  } else if (lowerPrompt.includes("dashboard") || lowerPrompt.includes("metrics") || lowerPrompt.includes("analytics")) {
    mode = "dashboard";
  } else if (lowerPrompt.includes("form") || lowerPrompt.includes("input") || lowerPrompt.includes("entry")) {
    mode = "data-entry";
  }

  // Keyword extraction
  const keywords = extractKeywords(prompt);

  // Complexity detection
  const complexity = detectComplexity(prompt, keywords);

  return { mode, keywords, complexity };
}

function extractKeywords(prompt: string): string[] {
  const relevantWords = [
    "table", "chart", "graph", "list", "form", "button", "input",
    "card", "modal", "sidebar", "header", "footer", "navigation",
    "data", "metrics", "user", "admin", "settings", "dashboard"
  ];

  return relevantWords.filter(word =>
    prompt.toLowerCase().includes(word)
  );
}
```

### 5.7 Supabase Integration

**Database Schema**:
```sql
CREATE TABLE blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  archetype TEXT NOT NULL,
  intent JSONB NOT NULL,
  blueprint JSONB NOT NULL,
  version TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  generated_by TEXT CHECK (generated_by IN ('ai', 'manual')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Version history table
CREATE TABLE blueprint_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id UUID REFERENCES blueprints(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  blueprint JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blueprint_id, version)
);

-- RLS Policies
ALTER TABLE blueprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own blueprints"
  ON blueprints FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "Users can create blueprints"
  ON blueprints FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own blueprints"
  ON blueprints FOR UPDATE
  USING (auth.uid() = author_id);
```

### 5.8 Performance Targets

| Operation | Target | Notes |
|-----------|--------|-------|
| Blueprint validation | < 50ms | Zod schema check |
| Hallucination check | < 30ms | Catalog lookup |
| Semantic scoring (all slots) | < 100ms | 4-6 slots typical |
| Component generation | < 500ms | AST + JSX |
| AI Blueprint generation | < 5000ms | Claude API call |
| Full pipeline (prompt → files) | < 6000ms | With AI |
| Full pipeline (no AI) | < 700ms | Manual Blueprint |
| Supabase save/load | < 200ms | Round-trip |

### 5.9 Error Code System

| Code | Type | Description |
|------|------|-------------|
| LAYER3-E001 | Validation | Blueprint schema validation failed |
| LAYER3-E002 | Hallucination | Component not found in Layer 2 catalog |
| LAYER3-E003 | Constraint | Slot constraint violation |
| LAYER3-E004 | Threshold | Component score below minimum threshold |
| LAYER3-E005 | Generation | AST/JSX generation failed |
| LAYER3-E006 | Supabase | Database operation failed |
| LAYER3-E007 | AI | AI Blueprint generation failed |
| LAYER3-W001 | Warning | Fallback applied due to low score |
| LAYER3-W002 | Warning | Missing optional slot |
| LAYER3-W003 | Warning | Accessibility config incomplete |

---

## 6. Testing Strategy

### 6.1 Unit Test Coverage

**Slot Module**:
- Slot registry lookup and validation
- Slot constraint enforcement
- Custom slot support

**Scoring Module**:
- Semantic scoring formula accuracy
- Intent matching logic
- Context penalty calculation

**Safety Module**:
- Threshold check boundary cases
- Hallucination detection
- Fluid fallback assignment

**Generator Module**:
- AST construction accuracy
- JSX code generation
- TypeScript type generation

**Target Coverage**: ≥ 85% (TRUST 5 requirement)

### 6.2 Integration Test Scenarios

**End-to-End Generation**:
- User prompt → AI Blueprint → Validation → Scoring → Generation → Files

**Scoring Verification**:
- Test scoring with various intent modes
- Verify penalty application

**Safety Protocol Verification**:
- Test with invalid component names
- Test with low-scoring components

---

## 7. Security Considerations

**SEC-001**: Blueprint validation prevents injection attacks
- Zod schema rejects malicious input
- Component names validated against catalog

**SEC-002**: Generated code sanitized for XSS prevention
- All user input escaped in JSX
- CSP-compatible code generation

**SEC-003**: Supabase RLS enforces user isolation
- Row-level security prevents unauthorized access
- API keys in environment variables only

---

## 8. Quality Gates

### 8.1 TRUST 5 Framework Compliance

- **Test-first**: ≥ 85% test coverage
- **Readable**: Clear naming, JSDoc comments
- **Unified**: ESLint + Prettier formatting
- **Secured**: Input validation, safe generation, RLS
- **Trackable**: Commits reference SPEC-LAYER3-001

### 8.2 Acceptance Criteria

✅ Slot Semantic Registry defines all global and local slots
✅ Semantic Scoring Algorithm produces consistent results
✅ Safety Protocols prevent low-quality and hallucinated components
✅ AI generates valid Blueprints from user prompts
✅ Generated components use Layer 1 tokens and Layer 2 knowledge
✅ Supabase Blueprint storage works with versioning
✅ E2E tests cover 80%+ of component interactions
✅ Generated components pass WCAG AA accessibility checks
✅ Test coverage ≥ 85%
✅ Zero ESLint/TypeScript errors

---

## 9. Traceability

**TAG**: SPEC-LAYER3-001
**Source**: Functional Specification - AI-Native Component Knowledge System (Modules A, C)
**Dependencies**:
- SPEC-LAYER1-001 (Token Generator Engine) - REQUIRED
- SPEC-LAYER2-001 (Component Knowledge System) - REQUIRED
**Archetype Documentation**: `docs/archetype-system.md`

---

**END OF SPEC**
