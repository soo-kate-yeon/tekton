# @tekton/component-generator

Component generation engine with slot semantic registry for the Tekton design system.

## Overview

This package implements the Component Generation Engine (SPEC-LAYER3-001) with intelligent slot-based assembly, semantic scoring, and AI-powered safety protocols. Currently in active development with **4/6 milestones complete (67% progress)**.

**Completed Milestones**:
- ✅ Milestone 1: Slot Semantic Registry (99.75% coverage, 186 tests)
- ✅ Milestone 2: Semantic Scoring Algorithm (100% coverage, 83 tests)
- ✅ Milestone 3: Safety Protocols (99.53% coverage, 79 tests)
- ✅ Milestone 4: MCP Tools Integration (100% coverage, 128 tests)

**MCP Integration**: This package now provides complete MCP (Model Context Protocol) tools for LLM-driven component generation. See [@tekton/studio-mcp](../studio-mcp/README.md) for integration details.

This provides a robust foundation for managing component slots with semantic roles, intelligent component placement through weighted scoring, and comprehensive safety protocols to prevent low-quality or invalid component assignments.

## Features

### Slot Registry System

- **Global Slots**: Application-level layout slots (header, sidebar, main, footer)
- **Local Slots**: Component-specific slots (card_actions, table_toolbar, modal_footer)
- **Semantic Roles**: Layout, action, and content categorization
- **Constraint Validation**: maxChildren, allowedComponents, excludedComponents

### Core Components

#### 1. GlobalSlotRegistry

Manages application-level layout slots with predefined constraints.

```typescript
import { GlobalSlotRegistry } from '@tekton/component-generator';

const registry = new GlobalSlotRegistry();

// Get slot definition
const headerSlot = registry.getSlot('header');
console.log(headerSlot.role); // 'layout'
console.log(headerSlot.constraints.maxChildren); // 3

// Get all global slots
const allSlots = registry.getAllSlots();
```

#### 2. LocalSlotRegistry

Manages component-specific slots associated with parent components.

```typescript
import { LocalSlotRegistry } from '@tekton/component-generator';

const registry = new LocalSlotRegistry();

// Get local slot
const cardActionsSlot = registry.getSlot('card_actions');
console.log(cardActionsSlot.parentComponent); // 'Card'

// Get slots by parent component
const cardSlots = registry.getSlotsByParent('Card');
```

#### 3. SlotValidator

Validates slot configurations against defined constraints.

```typescript
import { SlotValidator, GlobalSlotRegistry, LocalSlotRegistry } from '@tekton/component-generator';

const globalRegistry = new GlobalSlotRegistry();
const localRegistry = new LocalSlotRegistry();
const validator = new SlotValidator(globalRegistry, localRegistry);

// Validate max children constraint
const result1 = validator.validateMaxChildren('header', 3);
console.log(result1.isValid); // true

const result2 = validator.validateMaxChildren('header', 5);
console.log(result2.isValid); // false
console.log(result2.errors[0].code); // 'LAYER3-E003'

// Comprehensive slot validation
const result3 = validator.validateSlot('header', {
  childrenCount: 2,
  componentTypes: ['Button', 'Logo'],
});
console.log(result3.isValid); // true

// Exclude DataTable from header
const result4 = validator.validateSlot('header', {
  componentTypes: ['DataTable'],
});
console.log(result4.isValid); // false
```

#### 4. SlotResolver

Unified access to slot definitions across global and local registries.

```typescript
import { SlotResolver, GlobalSlotRegistry, LocalSlotRegistry } from '@tekton/component-generator';

const globalRegistry = new GlobalSlotRegistry();
const localRegistry = new LocalSlotRegistry();
const resolver = new SlotResolver(globalRegistry, localRegistry);

// Resolve any slot
const slot = resolver.resolveSlot('header'); // or 'card_actions'

// Filter by scope
const globalSlots = resolver.resolveSlotsByScope('global');
const localSlots = resolver.resolveSlotsByScope('local');

// Filter by role
const layoutSlots = resolver.resolveSlotsByRole('layout');
const actionSlots = resolver.resolveSlotsByRole('action');

// Get slots by parent component
const cardSlots = resolver.resolveSlotsByParent('Card');

// Get all slots
const allSlots = resolver.getAllSlots(); // 7 slots (4 global + 3 local)
```

## Slot Definitions

### Global Slots

| Slot Name | Role    | Max Children | Excluded Components |
|-----------|---------|--------------|---------------------|
| header    | layout  | 3            | DataTable           |
| sidebar   | layout  | 10           | DataTable           |
| main      | content | unlimited    | -                   |
| footer    | layout  | 5            | DataTable           |

### Local Slots

| Slot Name      | Parent Component | Role   | Max Children | Allowed Components                    |
|----------------|------------------|--------|--------------|---------------------------------------|
| card_actions   | Card             | action | 5            | Button, Link, Icon                    |
| table_toolbar  | DataTable        | action | 8            | Button, SearchInput, FilterDropdown   |
| modal_footer   | Modal            | action | 4            | Button                                |

## Error Codes

- **LAYER3-E003**: Constraint violation (maxChildren, allowedComponents, excludedComponents)

## Semantic Scoring System

The package implements a sophisticated semantic scoring algorithm for intelligent component placement in slots.

### Scoring Formula

```
Score = (BaseAffinity × 0.5) + (IntentMatch × 0.3) + (ContextPenalty × 0.2)
```

**Scoring Factors**:
1. **Base Affinity (50% weight)**: Component-slot compatibility from ComponentKnowledge metadata
2. **Intent Match (30% weight)**: User intent alignment (read-only, dashboard, data-entry, interactive)
3. **Context Penalty (20% weight)**: Sibling component conflicts and slot constraint violations

### Usage Example

```typescript
import { SemanticScorer } from '@tekton/component-generator';

const scorer = new SemanticScorer();

// Calculate semantic score for component placement
const result = scorer.calculateSemanticScore({
  component: {
    name: 'Button',
    category: 'action',
    slotAffinity: { header: 0.8, sidebar: 0.6, main: 0.7, footer: 0.5 },
    semanticDescription: {
      purpose: 'Interactive button for user actions',
      visualImpact: 'medium',
      complexity: 'low',
    },
  },
  targetSlot: 'header',
  intent: {
    mode: 'interactive',
    keywords: ['action', 'button', 'navigation'],
    complexity: 'simple',
  },
  context: {
    siblingComponents: ['Logo', 'Badge'],
    slotConstraints: ['action', 'display'],
    requirements: ['navigation'],
  },
});

console.log(result.score); // e.g., 0.78
console.log(result.factors); // { baseAffinity: 0.8, intentMatch: 0.7, contextPenalty: 0.9 }
```

### Intent Modes

**read-only**: Penalizes action components (-0.3), boosts display components
```typescript
intent: { mode: 'read-only', keywords: ['display', 'view'], complexity: 'simple' }
```

**dashboard**: Boosts display components (+0.2), ideal for metrics and charts
```typescript
intent: { mode: 'dashboard', keywords: ['metrics', 'charts', 'data'], complexity: 'complex' }
```

**data-entry**: Boosts input components (+0.2), ideal for forms
```typescript
intent: { mode: 'data-entry', keywords: ['form', 'input', 'submit'], complexity: 'moderate' }
```

**interactive**: Neutral baseline for all component types
```typescript
intent: { mode: 'interactive', keywords: ['navigation', 'action'], complexity: 'simple' }
```

## Safety Protocols

The package implements comprehensive safety protocols to prevent low-quality placements and hallucinated components.

### 1. Threshold Check

Enforces minimum score threshold (0.4) with automatic fallback for low-scoring components.

```typescript
import { ThresholdChecker } from '@tekton/component-generator';

const checker = new ThresholdChecker();

// Accepted: score ≥ 0.4
const result1 = checker.applyThresholdCheck('Button', 0.65, 'header');
console.log(result1.status); // 'accepted'
console.log(result1.component); // 'Button'

// Fallback: score < 0.4
const result2 = checker.applyThresholdCheck('DataTable', 0.35, 'header');
console.log(result2.status); // 'fallback'
console.log(result2.component); // 'GenericContainer'
console.log(result2.originalComponent); // 'DataTable'
console.log(result2.reason); // 'Score 0.35 below threshold'
```

### 2. Hallucination Check

Validates Blueprint component references against Layer 2 Component Knowledge Catalog.

```typescript
import { HallucinationChecker } from '@tekton/component-generator';

const checker = new HallucinationChecker();
const catalog = getAllComponents(); // From Layer 2

// Valid Blueprint
const validBlueprint = {
  slots: {
    header: { component: 'Button', props: {} },
    main: { component: 'Card', props: {} },
  },
};

const result1 = checker.validateBlueprintComponents(validBlueprint, catalog);
console.log(result1.valid); // true

// Invalid Blueprint with hallucinated component
const invalidBlueprint = {
  slots: {
    header: { component: 'SuperButton', props: {} }, // Non-existent
  },
};

const result2 = checker.validateBlueprintComponents(invalidBlueprint, catalog);
console.log(result2.valid); // false
console.log(result2.invalidComponents); // ['SuperButton']
console.log(result2.suggestions); // { 'SuperButton': ['Button', 'IconButton'] }
```

**Features**:
- Component existence validation against Layer 2 catalog
- Fuzzy matching with Levenshtein distance ≤ 3 for suggestions
- Recursive Blueprint traversal (nested slots)
- LAYER3-E002 error code for hallucinated components

### 3. Constraint Validator

Enforces slot constraints (maxChildren, allowedComponents, excludedComponents).

```typescript
import { ConstraintValidator, GlobalSlotRegistry } from '@tekton/component-generator';

const registry = new GlobalSlotRegistry();
const validator = new ConstraintValidator();

const headerSlot = registry.getSlot('header');

// Valid: within constraints
const result1 = validator.validateConstraints(
  headerSlot,
  ['Button', 'Logo'], // Allowed components
  2 // Children count < maxChildren (3)
);
console.log(result1.isValid); // true

// Invalid: exceeds maxChildren
const result2 = validator.validateConstraints(
  headerSlot,
  ['Button', 'Logo', 'Badge', 'Icon'],
  4 // Children count > maxChildren (3)
);
console.log(result2.isValid); // false
console.log(result2.errors[0].code); // 'LAYER3-E003'

// Invalid: excluded component
const result3 = validator.validateConstraints(
  headerSlot,
  ['DataTable'], // DataTable excluded from header
  1
);
console.log(result3.isValid); // false
console.log(result3.errors[0].code); // 'LAYER3-E003'
```

### 4. Fluid Fallback

Provides graceful degradation with role-based fallback component assignment.

```typescript
import { FluidFallback, GlobalSlotRegistry } from '@tekton/component-generator';

const registry = new GlobalSlotRegistry();
const fallback = new FluidFallback();

// Fallback for content slot
const result1 = fallback.applyFluidFallback('main', 'Score below threshold', registry);
console.log(result1.component); // 'GenericContainer'
console.log(result1._fallback.reason); // 'Score below threshold'
console.log(result1._fallback.originalSlot); // 'main'

// Fallback for action slot
const result2 = fallback.applyFluidFallback('card_actions', 'Constraint violation', registry);
console.log(result2.component); // 'ButtonGroup'
```

**Fallback Mapping**:
- `primary-content` → `GenericContainer`
- `navigation` → `NavPlaceholder`
- `actions` → `ButtonGroup`
- `auxiliary` → `GenericContainer`

## SPEC Compliance

This implementation satisfies the following acceptance criteria from SPEC-LAYER3-001:

### Scenario 1.1: Global Slots Return Correct Roles and Constraints
✅ Header, sidebar, main, and footer slots return correct semantic roles and constraint definitions

### Scenario 1.2: Local Slots Associated with Parent Components
✅ Local slots (card_actions, table_toolbar, modal_footer) are correctly associated with their parent components

### Scenario 1.3: Constraint Violations Rejected with LAYER3-E003
✅ Violations of maxChildren, allowedComponents, or excludedComponents return LAYER3-E003 error code

### Scenario 3.3: ExcludedSlots Enforcement
✅ DataTable component is excluded from header, sidebar, and footer slots

### Scenario 2.1: Semantic Scoring Produces Consistent Results
✅ Scoring algorithm produces deterministic results with same inputs always yielding same scores

### Scenario 2.2: Intent Matching Affects Scoring
✅ Read-only mode penalizes action components (-0.3), dashboard mode boosts display components (+0.2), data-entry mode boosts input components (+0.2)

### Scenario 2.3: Context Penalties Applied
✅ Conflicting components receive penalty (-0.5), slot constraint mismatches receive penalty (-0.3)

### Scenario 3.1: Threshold Check Prevents Low-Quality Placements
✅ Components scoring <0.4 trigger fallback with appropriate generic component assignment

### Scenario 3.2: Hallucination Check Rejects Invalid Components
✅ Non-existent components rejected with LAYER3-E002 and fuzzy matching suggestions provided

## Installation

```bash
pnpm add @tekton/component-generator
```

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Build
pnpm build

# Lint
pnpm lint
```

## Implementation Status

### Overall Quality Metrics

- **Test Coverage**: 99.45% (exceeds ≥85% target by 14.45%) ✅
- **Total Tests**: 476/476 passing (100% pass rate) ✅
- **TRUST 5 Compliance**: PASS ✅
- **Type Safety**: Zero TypeScript errors ✅
- **Milestones Complete**: 4/6 (67% progress)

### Detailed Coverage

- **Statements**: 99.45%
- **Branches**: 97.88%
- **Functions**: 100%
- **Lines**: 99.45%

Target: ≥85% (exceeded ✅)

### Milestone Breakdown

**Milestone 1: Slot Semantic Registry** ✅
- Coverage: 99.75% | Tests: 186/186 | Status: COMPLETE

**Milestone 2: Semantic Scoring Algorithm** ✅
- Coverage: 100% | Tests: 83/83 | Status: COMPLETE

**Milestone 3: Safety Protocols** ✅
- Coverage: 99.53% | Tests: 79/79 | Status: COMPLETE

**Milestone 4: MCP Tools Integration** ✅
- Coverage: 100% | Tests: 128/128 | Status: COMPLETE

**Milestones 5-6** 🚧
- Advanced Blueprint Features, Production Optimization - PENDING

## Architecture

```
component-generator/
├── src/
│   ├── types/              # Type definitions
│   │   ├── slot-types.ts
│   │   ├── validation-types.ts
│   │   └── knowledge-schema.ts      # NEW: M4 Blueprint schema
│   ├── registry/           # Slot registries (M1)
│   │   ├── global-slot-registry.ts
│   │   └── local-slot-registry.ts
│   ├── validators/         # Constraint validation (M1)
│   │   └── slot-validator.ts
│   ├── resolvers/          # Slot resolution (M1)
│   │   └── slot-resolver.ts
│   ├── scoring/            # Semantic scoring (M2)
│   │   └── semantic-scorer.ts
│   ├── safety/             # Safety protocols (M3)
│   │   ├── threshold-checker.ts
│   │   ├── hallucination-checker.ts
│   │   ├── constraint-validator.ts
│   │   └── fluid-fallback.ts
│   ├── generator/          # Code generation (M4) NEW
│   │   ├── ast-builder.ts
│   │   └── jsx-generator.ts
│   └── index.ts            # Public API
├── tests/                  # Test suites
│   ├── spec-global-slots.test.ts
│   ├── spec-local-slots.test.ts
│   ├── scoring/            # M2 tests
│   ├── safety/             # M3 tests
│   └── generator/          # M4 tests NEW
│       ├── ast-builder.test.ts
│       └── jsx-generator.test.ts
└── README.md
```

**MCP Integration**: See [@tekton/studio-mcp](../studio-mcp/README.md) for MCP Server implementation and tool registration.

## Next Steps (Future Milestones)

**Milestone 5: Advanced Blueprint Features** (Target: 2026-02-05)
- Blueprint versioning and comparison system
- AI-powered Blueprint refinement based on feedback
- Visual Blueprint editor with real-time preview
- Blueprint template library with customizable patterns
- Nested component composition with slot inheritance

**Milestone 6: Production Optimization** (Target: 2026-02-20)
- Bundle optimization with code splitting
- Performance monitoring and telemetry
- Caching strategies for frequent operations
- Error recovery and retry mechanisms
- Production deployment guides and best practices

## License

MIT

## Contributing

See the main repository README for contribution guidelines.

## References

- [SPEC-LAYER3-MVP-001](../../.moai/specs/SPEC-LAYER3-MVP-001/spec.md): MCP-Driven Component Generation Engine
- [Implementation Status](../../.moai/specs/SPEC-LAYER3-MVP-001/implementation-status.md): Milestone completion tracking
- [SPEC-LAYER2-001](../../.moai/specs/SPEC-LAYER2-001/spec.md): Component Knowledge System
- [@tekton/studio-mcp](../studio-mcp/README.md): MCP Server integration guide
