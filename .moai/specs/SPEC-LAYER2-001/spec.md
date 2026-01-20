---
id: SPEC-LAYER2-001
version: "2.0.0"
status: "complete"
created: "2026-01-19"
updated: "2026-01-20"
author: "asleep"
priority: "high"
---

# HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-19 | asleep | Initial SPEC creation for Component Token Binding System |
| 1.1.0 | 2026-01-19 | asleep | SPEC refinements: Package naming, Layer 1/3 contracts, CSS-in-JS config |
| 2.0.0 | 2026-01-20 | asleep | Major restructure: Integrated Component Knowledge System from Functional Spec. Added ComponentKnowledge interface, slotAffinity, semanticDescription, constraints. Renamed focus from "Token Binding" to "Component Knowledge System". |

---

# SPEC-LAYER2-001: Component Knowledge System

## 1. Overview

### 1.1 Purpose
The Component Knowledge System serves as the **knowledge translation layer** that transforms raw design system data into AI-understandable "knowledge" and "rules". This layer bridges abstract tokens (Layer 1) and intelligent component generation (Layer 3) by providing:

1. **Component Capability Catalog**: Metadata that enables AI to reason about component placement and usage
2. **Token-to-Component Binding**: Type-safe mappings from design tokens to component properties
3. **Semantic Knowledge Export**: Structured data for AI context injection

This layer implements **Module B: Component Capability Catalog** from the AI-Native Component Knowledge System specification.

### 1.2 Scope
- **Component Capability Catalog**: Extended metadata schema for AI reasoning
  - Atomic Design hierarchy (atom, molecule, organism, template)
  - Semantic categories (display, input, action, container, navigation)
  - Slot affinity scoring (0.0 - 1.0 per slot)
  - Semantic descriptions (purpose, visualImpact, complexity)
  - Placement constraints (requires, conflictsWith, excludedSlots)
- **Token-to-Component Binding**: 20 core hooks with state/variant coverage
- **TypeScript Schema Generation**: Zod schemas for type-safe component props
- **CSS-in-JS Binding Generation**: Vanilla Extract (primary) / Stitches (legacy)
- **Knowledge Export**: JSON and Markdown formats for AI context injection

### 1.3 Dependencies
- **SPEC-LAYER1-001**: Token Generator Engine (REQUIRED - must be complete before implementation)
- **External Libraries**:
  - `zod` (^3.23.0) - TypeScript schema generation and validation
  - `@vanilla-extract/css` (^1.16.0) - CSS-in-JS bindings (PRIMARY, recommended)
  - `@stitches/core` (^1.2.8) - CSS-in-JS bindings (SECONDARY, maintenance mode)

---

## 2. Environment

### 2.1 Technical Environment
- **Runtime**: Node.js 20+ / Browser (ES2022+)
- **Language**: TypeScript 5.9+
- **Build System**: Turbo (existing monorepo setup)
- **Package Manager**: npm (existing project standard)

### 2.2 Integration Points
- **Input**: Token metadata from SPEC-LAYER1-001 (JSON format)
- **Output**:
  - Component Knowledge Catalog (`component-knowledge.json`)
  - TypeScript schemas (`.types.ts` files)
  - CSS-in-JS binding files (`.styles.ts` files)
  - AI Context Markdown (`.context.md` files)
  - Binding Registry for Layer 3 (`registry.json`)

---

## 3. Assumptions

### 3.1 Technical Assumptions
- **ASSUMPTION-001**: The 20 core hooks are already defined in the codebase
  - **Confidence**: High - Existing hooks visible in project
  - **Evidence**: Project structure analysis
  - **Risk if Wrong**: Hook list needs adjustment
  - **Validation**: Review existing hooks during implementation

- **ASSUMPTION-002**: AI agents can effectively use semantic metadata for component placement decisions
  - **Confidence**: High - LLMs excel at structured reasoning with metadata
  - **Evidence**: Functional Spec's Semantic Scoring Algorithm
  - **Risk if Wrong**: Scoring algorithm may need tuning
  - **Validation**: Test with Claude Code agent during integration

- **ASSUMPTION-003**: Slot affinity scores (0.0-1.0) provide sufficient granularity for placement decisions
  - **Confidence**: Medium - Based on Functional Spec design
  - **Evidence**: Industry examples (recommendation systems)
  - **Risk if Wrong**: May need weighted multi-factor scoring
  - **Validation**: Test with diverse component placement scenarios

### 3.2 Business Assumptions
- **ASSUMPTION-004**: Consistent component knowledge improves AI-generated UI quality
  - **Confidence**: High - Core premise of AI-Native Design System
  - **Evidence**: Functional Spec validation
  - **Risk if Wrong**: May need manual intervention for complex layouts
  - **Validation**: User testing with generated components

---

## 4. Requirements

### 4.1 Ubiquitous Requirements (Always Active)

**REQ-LAYER2-001**: The Component Knowledge System shall always validate that all referenced tokens exist in Layer 1 metadata
- **Rationale**: Prevent runtime errors from missing tokens
- **Acceptance**: 100% of token references validated before binding generation

**REQ-LAYER2-002**: The system shall always generate type-safe TypeScript schemas using Zod for all component bindings
- **Rationale**: Type safety prevents integration errors
- **Acceptance**: All bindings have corresponding Zod schemas

**REQ-LAYER2-003**: The system shall always ensure complete state coverage for all 20 core hooks (default, hover, focus, active, disabled)
- **Rationale**: Incomplete state coverage creates UX inconsistencies
- **Acceptance**: All hooks have bindings for all 5 states

**REQ-LAYER2-004**: The system shall always generate CSS-in-JS bindings that reference Layer 1 CSS variables
- **Rationale**: Single source of truth for token values
- **Acceptance**: All bindings use `var(--token-name)` references

**REQ-LAYER2-005**: The system shall always include ComponentKnowledge metadata for each component
- **Rationale**: AI agents require semantic metadata for intelligent placement
- **Acceptance**: All 20 components have complete ComponentKnowledge entries

### 4.2 Event-Driven Requirements (User/System Triggers)

**REQ-LAYER2-006**: WHEN a component knowledge entry is defined, THEN the system shall validate slotAffinity scores sum to reasonable values
- **Rationale**: Prevent skewed placement recommendations
- **Acceptance**: Warning logged if any slot affinity > 0.95 or sum across all slots < 0.5

**REQ-LAYER2-007**: WHEN CSS-in-JS bindings are generated, THEN the system shall produce importable TypeScript modules
- **Rationale**: Enable tree-shaking and type-safe imports
- **Acceptance**: Generated files are valid TypeScript modules

**REQ-LAYER2-008**: WHEN token references change in Layer 1, THEN the system shall detect and regenerate affected bindings
- **Rationale**: Automatic synchronization prevents stale bindings
- **Acceptance**: Binding regeneration triggered by Layer 1 changes

**REQ-LAYER2-009**: WHEN knowledge export is requested, THEN the system shall generate both JSON and Markdown formats
- **Rationale**: JSON for programmatic use, Markdown for AI context injection
- **Acceptance**: Both formats generated with consistent content

### 4.3 State-Driven Requirements (Conditional Behavior)

**REQ-LAYER2-010**: IF a component has constraints.excludedSlots defined, THEN the corresponding slotAffinity for those slots shall be 0.0
- **Rationale**: Excluded slots should have zero affinity
- **Acceptance**: System auto-corrects or errors on mismatch

**REQ-LAYER2-011**: IF a component requires another component (constraints.requires), THEN the required component must exist in the catalog
- **Rationale**: Prevent broken dependency chains
- **Acceptance**: Validation error if required component missing

**REQ-LAYER2-012**: IF CSS-in-JS library preference changes (Stitches vs Vanilla Extract), THEN the system shall generate bindings in the correct format
- **Rationale**: Support multiple CSS-in-JS frameworks
- **Acceptance**: Bindings work with both Stitches and Vanilla Extract

### 4.4 Unwanted Behaviors (Prohibited Actions)

**REQ-LAYER2-013**: The system shall NOT generate bindings that hardcode token values (must reference CSS variables)
- **Rationale**: Hardcoded values break dynamic theming
- **Acceptance**: Zero hardcoded color/size values in generated bindings

**REQ-LAYER2-014**: The system shall NOT allow incomplete state coverage (missing states) in generated schemas
- **Rationale**: Incomplete coverage creates UX bugs
- **Acceptance**: Schema generation fails if any state is missing

**REQ-LAYER2-015**: The system shall NOT allow slotAffinity values outside 0.0-1.0 range
- **Rationale**: Affinity scores must be normalized
- **Acceptance**: Validation error for out-of-range values

**REQ-LAYER2-016**: The system shall NOT allow conflicting constraints (e.g., component conflicts with itself)
- **Rationale**: Self-referential constraints are logical errors
- **Acceptance**: Validation error for invalid constraint references

### 4.5 Optional Requirements (Nice-to-Have)

**REQ-LAYER2-017**: Where possible, the system should generate visual documentation showing component-to-slot affinity heatmaps
- **Rationale**: Improved design system documentation
- **Acceptance**: HTML/SVG heatmap visualization generated

**REQ-LAYER2-018**: Where feasible, the system should provide migration scripts for updating existing component implementations
- **Rationale**: Ease adoption of new knowledge system
- **Acceptance**: Migration script updates 80%+ of components automatically

---

## 5. Technical Specifications

### 5.1 Core Architecture

**Knowledge Pipeline**:
```
Layer 1 Tokens → Token Validator → ComponentKnowledge Builder → Schema Generator → CSS-in-JS Generator → Knowledge Exporter → Output
```

**Module Structure**:
```
packages/component-knowledge/
├── src/
│   ├── catalog/
│   │   ├── component-knowledge.ts     # ComponentKnowledge interface
│   │   ├── knowledge-builder.ts       # Build knowledge entries
│   │   ├── affinity-calculator.ts     # Slot affinity utilities
│   │   └── constraint-validator.ts    # Validate constraints
│   ├── validator/
│   │   ├── token-validator.ts         # Validate tokens exist
│   │   └── state-completeness.ts      # Verify all states covered
│   ├── mapper/
│   │   ├── component-mapper.ts        # Map tokens to components
│   │   └── mapping-registry.ts        # Central mapping definitions
│   ├── schema/
│   │   ├── zod-schema-generator.ts    # Generate Zod schemas
│   │   └── typescript-types.ts        # TypeScript type generation
│   ├── css-in-js/
│   │   ├── vanilla-extract-gen.ts     # Vanilla Extract generation
│   │   ├── stitches-generator.ts      # Stitches binding generation
│   │   └── css-variable-refs.ts       # CSS variable reference utilities
│   ├── export/
│   │   ├── json-exporter.ts           # Export as JSON
│   │   ├── markdown-exporter.ts       # Export as Markdown for AI
│   │   └── registry-builder.ts        # Build Layer 3 registry
│   └── types/
│       ├── knowledge.types.ts         # ComponentKnowledge types
│       ├── binding.types.ts           # Binding configuration types
│       └── export.types.ts            # Export format types
├── tests/
│   ├── catalog/
│   │   ├── knowledge-builder.test.ts
│   │   └── constraint-validator.test.ts
│   ├── validator/
│   │   ├── token-validator.test.ts
│   │   └── state-completeness.test.ts
│   ├── schema/
│   │   └── zod-schema-generator.test.ts
│   └── export/
│       ├── json-exporter.test.ts
│       └── markdown-exporter.test.ts
└── package.json
```

### 5.2 ComponentKnowledge Interface

**Core Knowledge Schema** (from Functional Spec Module B):

```typescript
/**
 * ComponentKnowledge: Extended metadata for AI reasoning
 * This is the core interface that enables intelligent component placement
 */
interface ComponentKnowledge {
  /** Component identifier (e.g., "Button", "UserTable") */
  name: string;

  /** Atomic Design hierarchy level */
  type: "atom" | "molecule" | "organism" | "template";

  /** Functional category for filtering */
  category: "display" | "input" | "action" | "container" | "navigation";

  /**
   * Slot Affinity Scoring
   * Values from 0.0 to 1.0 indicating placement suitability
   * Higher values = more suitable for that slot
   */
  slotAffinity: {
    [slotName: string]: number; // e.g., { main: 0.9, sidebar: 0.1, header: 0.3 }
  };

  /**
   * Semantic Description for AI Context
   * Human-readable guidance for component usage
   */
  semanticDescription: {
    /** What this component is used for */
    purpose: string; // e.g., "Used for visualizing high-density data sets."

    /** Visual prominence level */
    visualImpact: "subtle" | "neutral" | "prominent";

    /** Implementation complexity */
    complexity: "low" | "medium" | "high";
  };

  /**
   * Placement Rules and Constraints
   * Hard rules that AI must respect
   */
  constraints: {
    /** Components that must be present as parent/child */
    requires?: string[];

    /** Components that cannot be used together */
    conflictsWith?: string[];

    /** Slots where this component must NEVER be placed */
    excludedSlots?: string[];
  };

  /**
   * Token Bindings (integrated from v1.x)
   * Maps component states to design tokens
   */
  tokenBindings: {
    states: {
      default: TokenBindings;
      hover: TokenBindings;
      focus: TokenBindings;
      active: TokenBindings;
      disabled: TokenBindings;
    };
    variants?: {
      [variantName: string]: Partial<Record<keyof typeof states, TokenBindings>>;
    };
  };
}

/**
 * TokenBindings: CSS property to token mappings
 */
interface TokenBindings {
  // Color Properties
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  outlineColor?: string;

  // Typography Properties
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;

  // Spacing Properties
  padding?: string;
  paddingX?: string;
  paddingY?: string;
  margin?: string;
  gap?: string;

  // Border Properties
  borderWidth?: string;
  borderRadius?: string;
  borderStyle?: string;

  // Effect Properties
  boxShadow?: string;
  opacity?: string;
  transition?: string;
  transform?: string;

  // Size Properties
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
}
```

### 5.3 Example ComponentKnowledge Entries

**Button Component**:
```typescript
const ButtonKnowledge: ComponentKnowledge = {
  name: "Button",
  type: "atom",
  category: "action",

  slotAffinity: {
    main: 0.6,
    sidebar: 0.8,
    header: 0.7,
    footer: 0.9,
    card_actions: 0.95,
  },

  semanticDescription: {
    purpose: "Primary interactive element for user actions like submit, confirm, or navigate.",
    visualImpact: "prominent",
    complexity: "low",
  },

  constraints: {
    requires: [],
    conflictsWith: [],
    excludedSlots: [],
  },

  tokenBindings: {
    states: {
      default: {
        backgroundColor: "color-primary",
        color: "color-text-on-primary",
        borderColor: "color-border",
        borderRadius: "radius-md",
        padding: "spacing-2",
      },
      hover: {
        backgroundColor: "color-primary-hover",
        color: "color-text-on-primary",
        borderColor: "color-border",
      },
      focus: {
        backgroundColor: "color-primary",
        color: "color-text-on-primary",
        borderColor: "color-focus-ring",
        boxShadow: "shadow-focus",
      },
      active: {
        backgroundColor: "color-primary-active",
        color: "color-text-on-primary",
        borderColor: "color-border",
      },
      disabled: {
        backgroundColor: "color-disabled",
        color: "color-text-disabled",
        borderColor: "color-border-disabled",
        opacity: "opacity-disabled",
      },
    },
    variants: {
      primary: {
        default: { backgroundColor: "color-primary" },
        hover: { backgroundColor: "color-primary-hover" },
      },
      secondary: {
        default: { backgroundColor: "color-secondary" },
        hover: { backgroundColor: "color-secondary-hover" },
      },
      ghost: {
        default: { backgroundColor: "transparent", borderColor: "color-border" },
        hover: { backgroundColor: "color-surface-hover" },
      },
    },
  },
};
```

**DataTable Component (Organism)**:
```typescript
const DataTableKnowledge: ComponentKnowledge = {
  name: "DataTable",
  type: "organism",
  category: "display",

  slotAffinity: {
    main: 0.95,      // Best in main content area
    sidebar: 0.1,    // Too wide for sidebar
    header: 0.0,     // Never in header
    footer: 0.0,     // Never in footer
  },

  semanticDescription: {
    purpose: "Used for visualizing high-density structured data sets with sorting, filtering, and pagination.",
    visualImpact: "prominent",
    complexity: "high",
  },

  constraints: {
    requires: ["TableRow", "TableCell"],
    conflictsWith: [],
    excludedSlots: ["header", "footer", "sidebar"],
  },

  tokenBindings: {
    states: {
      default: {
        backgroundColor: "color-surface",
        borderColor: "color-border",
        borderRadius: "radius-lg",
      },
      hover: { backgroundColor: "color-surface" },
      focus: { borderColor: "color-focus-ring" },
      active: { backgroundColor: "color-surface" },
      disabled: { opacity: "opacity-disabled" },
    },
  },
};
```

### 5.4 Knowledge Export Formats

**JSON Export** (for programmatic consumption):
```json
{
  "schemaVersion": "2.0.0",
  "generatedAt": "2026-01-20T10:00:00Z",
  "components": {
    "Button": {
      "name": "Button",
      "type": "atom",
      "category": "action",
      "slotAffinity": { "main": 0.6, "sidebar": 0.8, "header": 0.7 },
      "semanticDescription": {
        "purpose": "Primary interactive element for user actions.",
        "visualImpact": "prominent",
        "complexity": "low"
      },
      "constraints": { "excludedSlots": [] }
    }
  }
}
```

**Markdown Export** (for AI context injection):
```markdown
# Component Knowledge Catalog

## Button
- **Type:** Atom
- **Category:** Action
- **Purpose:** Primary interactive element for user actions like submit, confirm, or navigate.
- **Visual Impact:** Prominent
- **Complexity:** Low

### Slot Affinity
| Slot | Affinity | Recommendation |
|------|----------|----------------|
| main | 0.6 | Suitable |
| sidebar | 0.8 | Recommended |
| header | 0.7 | Suitable |
| footer | 0.9 | Highly Recommended |

### Constraints
- **Excluded Slots:** None
- **Conflicts With:** None

---

## DataTable
- **Type:** Organism
- **Category:** Display
- **Purpose:** Used for visualizing high-density structured data sets.
- **Constraint:** ⛔ NEVER place in sidebar, header, or footer.
- **Best For:** Main content area.
```

### 5.5 The 20 Core Components

**Complete Component List with Knowledge Requirements**:

| # | Component | Type | Category | Primary Slot |
|---|-----------|------|----------|--------------|
| 1 | Button | atom | action | sidebar, footer |
| 2 | Input | atom | input | main, sidebar |
| 3 | Card | molecule | container | main, sidebar |
| 4 | Modal | organism | container | overlay |
| 5 | Dropdown | molecule | input | header, main |
| 6 | Checkbox | atom | input | main, sidebar |
| 7 | Radio | atom | input | main, sidebar |
| 8 | Switch | atom | input | sidebar |
| 9 | Slider | atom | input | main |
| 10 | Badge | atom | display | header, card |
| 11 | Alert | molecule | display | main |
| 12 | Toast | molecule | display | overlay |
| 13 | Tooltip | atom | display | any |
| 14 | Popover | molecule | container | any |
| 15 | Tabs | molecule | navigation | main |
| 16 | Accordion | molecule | container | main, sidebar |
| 17 | Select | atom | input | main, sidebar |
| 18 | Textarea | atom | input | main |
| 19 | Progress | atom | display | main, header |
| 20 | Avatar | atom | display | header, sidebar |

**Per-Component Requirements**:
- Complete ComponentKnowledge entry
- All 5 states defined (default, hover, focus, active, disabled)
- slotAffinity scores for all standard slots
- semanticDescription with purpose, visualImpact, complexity
- constraints (even if empty)
- Type-safe Zod schema
- CSS-in-JS bindings (Vanilla Extract primary)

### 5.6 Layer 1 Input Contract

```typescript
/**
 * Layer 1 → Layer 2 Contract
 * This interface defines the exact format Layer 2 expects from Layer 1.
 */
interface Layer1TokenMetadata {
  schemaVersion: '1.0.0';
  generatedAt: string;
  sourceArchetype: string;

  tokens: Array<{
    name: string;
    value: string;
    rgbFallback: string;
    cssVariable: string;
    category: 'color' | 'typography' | 'spacing' | 'shadow' | 'border';
    role?: 'primary' | 'secondary' | 'surface' | 'text' | 'border' | 'shadow';
  }>;

  wcagValidation: {
    passed: boolean;
    violations: Array<{
      foreground: string;
      background: string;
      ratio: number;
      required: number;
    }>;
  };
}
```

### 5.7 Layer 3 Output Contract

```typescript
/**
 * Layer 2 → Layer 3 Contract
 * This interface defines the exact format Layer 3 expects from Layer 2.
 */
interface Layer2Output {
  /** Schema version for compatibility checking */
  schemaVersion: '2.0.0';

  /** Generated timestamp for cache invalidation */
  generatedAt: string;

  /** Complete component knowledge catalog */
  components: {
    [componentName: string]: {
      /** Full ComponentKnowledge entry */
      knowledge: ComponentKnowledge;

      /** Generated Zod schema for props validation */
      zodSchema: ZodSchema;

      /** TypeScript type definition as string */
      propsType: string;

      /** CSS-in-JS bindings by library */
      cssBindings: {
        vanillaExtract?: {
          baseStyle: string;
          variants: Record<string, string>;
        };
        stitches?: {
          styledComponent: string;
          variants: Record<string, any>;
        };
      };

      /** All states covered in bindings */
      states: ('default' | 'hover' | 'focus' | 'active' | 'disabled')[];

      /** Variant names if applicable */
      variants: string[];

      /** All token names referenced */
      tokenReferences: string[];
    };
  };

  /** Slot definitions for Layer 3 slot resolution */
  standardSlots: {
    name: string;
    role: string;
    allowedTypes: ('atom' | 'molecule' | 'organism' | 'template')[];
    allowedCategories: ('display' | 'input' | 'action' | 'container' | 'navigation')[];
  }[];
}
```

### 5.8 Error Code System

| Code | Type | Description |
|------|------|-------------|
| LAYER2-E001 | Token Validation | Token reference not found in Layer 1 metadata |
| LAYER2-E002 | State Completeness | Required state missing from component mapping |
| LAYER2-E003 | Schema Generation | Invalid Zod schema structure generated |
| LAYER2-E004 | CSS-in-JS Output | Invalid binding output format |
| LAYER2-E005 | Contract Violation | Layer 1 metadata does not match expected contract |
| LAYER2-E006 | Affinity Range | slotAffinity value outside 0.0-1.0 range |
| LAYER2-E007 | Constraint Invalid | Invalid constraint reference (e.g., missing component) |
| LAYER2-E008 | Excluded Slot Mismatch | excludedSlots doesn't match slotAffinity=0 |
| LAYER2-W001 | Warning | Custom state detected (non-standard) |
| LAYER2-W002 | Warning | Hardcoded value detected in binding |
| LAYER2-W003 | Warning | High affinity (>0.95) may cause over-selection |

### 5.9 Performance Targets

- **Validation Speed**: < 100ms for all 20 components
- **Schema Generation**: < 200ms for all 20 schemas
- **Binding Generation**: < 300ms for all 20 components
- **Knowledge Export (JSON)**: < 50ms
- **Knowledge Export (Markdown)**: < 100ms
- **Full Pipeline**: < 600ms total
- **Memory Usage**: < 100MB during generation

---

## 6. Testing Strategy

### 6.1 Unit Test Coverage

**Catalog Module**:
- ComponentKnowledge building and validation
- slotAffinity score validation (0.0-1.0 range)
- Constraint validation (requires, conflictsWith, excludedSlots)
- Semantic description completeness

**Validator Module**:
- Token existence validation
- State completeness verification
- Invalid token reference detection

**Schema Generator Module**:
- Zod schema generation accuracy
- TypeScript type generation
- Schema validation correctness

**Export Module**:
- JSON export format validation
- Markdown export format validation
- Registry building for Layer 3

**Target Coverage**: ≥ 85% (TRUST 5 requirement)

### 6.2 Integration Test Scenarios

**End-to-End Knowledge Generation**:
- Load Layer 1 tokens → Build ComponentKnowledge → Generate schemas → Export → Validate output

**Constraint Validation**:
- Provide conflicting constraints → Assert validation error

**Affinity Consistency**:
- Provide excludedSlots → Assert affinity = 0 for those slots

---

## 7. Security Considerations

**SEC-001**: Token reference validation prevents injection of arbitrary CSS
- Validate all token names against allowed set
- Reject unknown tokens

**SEC-002**: Generated TypeScript code is sanitized to prevent code injection
- Escape all dynamic content in generated code
- Use template literals safely

**SEC-003**: Knowledge export sanitizes user-provided descriptions
- HTML-escape semantic descriptions in Markdown export
- Prevent XSS in documentation

---

## 8. Quality Gates

### 8.1 TRUST 5 Framework Compliance

- **Test-first**: ≥ 85% test coverage
- **Readable**: Clear naming, JSDoc comments for public APIs
- **Unified**: ESLint + Prettier formatting
- **Secured**: Input validation, safe code generation
- **Trackable**: Git commits reference SPEC-LAYER2-001

### 8.2 Acceptance Criteria

✅ All 20 components have complete ComponentKnowledge entries
✅ All token references validated against Layer 1 metadata
✅ All slotAffinity values in 0.0-1.0 range
✅ All constraints validated for consistency
✅ Generated Zod schemas are type-safe and valid
✅ CSS-in-JS bindings reference CSS variables correctly
✅ JSON and Markdown exports generated correctly
✅ Test coverage ≥ 85%
✅ Zero ESLint errors
✅ Zero TypeScript errors

---

## 9. Traceability

**TAG**: SPEC-LAYER2-001
**Source**: Functional Specification - AI-Native Component Knowledge System (Module B)
**Dependencies**:
- SPEC-LAYER1-001 (Token Generator Engine) - REQUIRED
**Related SPECs**:
- SPEC-LAYER3-001 (Component Generation Engine) - Consumes this layer

---

**END OF SPEC**
