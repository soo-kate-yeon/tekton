# @tekton/component-generator

Component generation engine with slot semantic registry for the Tekton design system.

## Overview

This package implements Phase 1 (Slot Semantic Registry) of SPEC-LAYER3-001, providing a robust foundation for managing component slots with semantic roles and constraints.

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

## Test Coverage

Current test coverage: **98.38%**

- Statements: 98.38%
- Branches: 95.08%
- Functions: 100%
- Lines: 98.38%

Target: ≥85% (exceeded ✅)

## Architecture

```
component-generator/
├── src/
│   ├── types/              # Type definitions
│   │   ├── slot-types.ts
│   │   └── validation-types.ts
│   ├── registry/           # Slot registries
│   │   ├── global-slot-registry.ts
│   │   └── local-slot-registry.ts
│   ├── validators/         # Constraint validation
│   │   └── slot-validator.ts
│   ├── resolvers/          # Slot resolution
│   │   └── slot-resolver.ts
│   └── index.ts            # Public API
├── tests/                  # Test suites
│   ├── infrastructure.test.ts
│   ├── slot-types.test.ts
│   ├── global-slot-registry.test.ts
│   ├── local-slot-registry.test.ts
│   ├── slot-validator.test.ts
│   ├── excluded-slots.test.ts
│   ├── max-children-enforcement.test.ts
│   ├── slot-resolver.test.ts
│   └── integration/
│       └── slot-registry-integration.test.ts
└── README.md
```

## Next Steps (Future Phases)

- Phase 2: Component Hierarchy Mapper
- Phase 3: Semantic Positioning Engine
- Phase 4: UI Code Generator
- Phase 5: Screen Generator Integration

## License

MIT

## Contributing

See the main repository README for contribution guidelines.

## References

- SPEC-LAYER3-001: Component Generation Engine
- SPEC-LAYER2-001: Component-Aware Token System
- Design System Documentation: See packages/theme
