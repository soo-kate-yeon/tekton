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

## Theme Binding System

The Theme Binding System (SPEC-THEME-BIND-001) provides centralized design token management for generated components, enabling consistent styling and runtime theme switching.

### Overview

Theme tokens replace hardcoded color and style values with semantic references that can be updated centrally:

```typescript
// Before: Hardcoded values
<Card style={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem' }} />

// After: Theme tokens
<Card style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }} />
```

**Key Benefits**:
- **Design Consistency**: Centralized tokens ensure uniform appearance
- **Maintainability**: Update themes without touching component code
- **Flexibility**: Support multiple themes and runtime switching
- **Type Safety**: Full TypeScript support for theme configurations
- **Performance**: Intelligent caching for efficient theme resolution

### Basic Usage

#### Using Default Theme

All components automatically use the default `calm-wellness` theme without configuration:

```typescript
import { renderScreen } from '@tekton/studio-mcp';

const blueprint: BlueprintResult = {
  blueprintId: 'card-001',
  recipeName: 'user-profile',
  analysis: { intent: 'Display user profile', tone: 'calm' },
  structure: {
    componentName: 'Card',
    props: { variant: 'elevated' },
    tokenBindings: {
      backgroundColor: 'color-surface',
      borderRadius: 'radius-lg',
      boxShadow: 'shadow-md'
    }
  }
};

// Uses default "calm-wellness" theme
const result = await renderScreen(blueprint);
console.log(result.themeApplied); // "calm-wellness"
```

#### Specifying Custom Theme

Override theme at runtime or in the blueprint:

```typescript
// Option 1: Specify in blueprint
const blueprint: BlueprintResult = {
  ...baseBlueprint,
  themeId: 'professional-dark'  // Blueprint preference
};

// Option 2: Override at generation time (highest priority)
const result = await renderScreen(blueprint, {
  themeId: 'energetic-bright',  // Runtime override
  outputPath: './components/UserProfile.tsx'
});
```

### TokenResolver API

The `TokenResolver` class handles theme loading, caching, and token resolution:

```typescript
import { TokenResolver } from '@tekton/component-generator';

// Create resolver with custom options
const resolver = new TokenResolver({
  themesPath: './my-themes',  // Custom theme directory
  cacheSize: 20               // Cache up to 20 themes
});

// Load theme from file
const theme = await resolver.loadTheme('calm-wellness');
console.log(theme.name); // "Calm Wellness"

// Resolve tokens to CSS variables
const tokens = resolver.resolveTokens(theme);
console.log(tokens['color-primary']);
// { value: 'oklch(0.65 0.15 270)', cssVariable: 'var(--color-primary)' }

// Get token value with fallback
const bgColor = resolver.getTokenValue(
  tokens,
  'color-surface',
  '#ffffff'  // Fallback if token not found
);
```

**Key Methods**:

- `loadTheme(themeId: string)`: Load theme configuration from JSON file with caching
- `resolveTokens(theme: ThemeConfig)`: Convert theme config to CSS-compatible tokens
- `getTokenValue(tokens, key, fallback?)`: Safely retrieve token values with fallback

### Theme Priority Rules

When multiple theme specifications exist, priority is resolved as:

1. **Runtime Override** (highest): `options.themeId` parameter
2. **Blueprint Preference**: `blueprint.themeId` field
3. **Default Theme** (lowest): `calm-wellness`

```typescript
const blueprint = {
  ...baseBlueprint,
  themeId: 'professional-dark'  // Priority 2
};

await renderScreen(blueprint, {
  themeId: 'calm-wellness'  // Priority 1 (wins)
});
// Result: Uses 'calm-wellness' theme
```

### Theme Configuration

Themes are defined as JSON files in the `themes/` directory following the `ThemeConfig` interface:

```typescript
interface ThemeConfig {
  id: string;                       // Unique identifier
  name: string;                     // Human-readable name
  description: string;              // Theme description
  version: string;                  // Semantic version
  brandTone: string;                // Tone matching (calm, professional, etc.)
  colorPalette: ColorPalette;       // OKLCH color definitions
  typography: Typography;           // Font and scale settings
  componentDefaults: ComponentDefaults; // Border radius, density, contrast
  aiContext: AIContext;             // AI guidance for theme application
}
```

**Example Theme** (`themes/calm-wellness.json`):

```json
{
  "id": "calm-wellness",
  "name": "Calm Wellness",
  "description": "Serene design system with muted pastels",
  "version": "1.0.0",
  "brandTone": "calm",
  "colorPalette": {
    "primary": {
      "l": 0.65,
      "c": 0.15,
      "h": 270,
      "description": "Primary brand color"
    },
    "surface": {
      "l": 0.98,
      "c": 0.01,
      "h": 270,
      "description": "Surface background"
    }
  },
  "typography": {
    "fontFamily": {
      "sans": "Inter, system-ui, sans-serif",
      "mono": "Fira Code, monospace"
    },
    "scale": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem"
    }
  },
  "componentDefaults": {
    "borderRadius": {
      "sm": "0.25rem",
      "md": "0.375rem",
      "lg": "0.5rem",
      "xl": "0.75rem"
    },
    "density": "comfortable",
    "contrast": "normal"
  },
  "aiContext": {
    "usageGuidelines": "Use for wellness and healthcare applications",
    "colorMood": "Calming and trustworthy",
    "targetAudience": "Health-conscious users"
  }
}
```

### State-Specific Tokens

Support interactive component states with fallback to default:

```typescript
{
  tokenBindings: {
    backgroundColor: 'color-primary',           // Default state
    'backgroundColor:hover': 'color-primary-hover',  // Hover state
    'backgroundColor:focus': 'color-primary-focus',  // Focus state
    'backgroundColor:disabled': 'color-disabled'     // Disabled state
  }
}
```

**Supported States**: `default`, `hover`, `focus`, `active`, `disabled`

### Generated Output

Components are generated with CSS variable style props:

```tsx
// Generated component with theme tokens
import React from 'react';

export const UserProfile: React.FC = () => {
  return (
    <Card
      variant="elevated"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      {/* Card content */}
    </Card>
  );
};
```

### Backward Compatibility

The theme binding system is **fully backward compatible**:

- Existing blueprints without `themeId` continue to work
- Components without `tokenBindings` generate normally
- All 293 existing tests pass without modifications
- Default theme applied automatically when not specified

### OKLCH Color Space

Theme colors use OKLCH (Lightness, Chroma, Hue) for perceptually uniform color transformations:

- **L (Lightness)**: 0.0 (black) to 1.0 (white)
- **C (Chroma)**: 0.0 (grayscale) to ~0.4 (vivid)
- **H (Hue)**: 0-360 degrees (color wheel)

**Benefits**:
- Perceptually uniform adjustments
- Predictable color relationships
- Better accessibility with lightness control

**Example**:

```json
{
  "primary": {
    "l": 0.65,   // Medium lightness
    "c": 0.15,   // Moderate saturation
    "h": 270,    // Purple hue
    "description": "Primary brand color"
  }
}
```

Converted to CSS: `oklch(0.65 0.15 270)` → `var(--color-primary)`

### Performance

TokenResolver implements LRU caching for optimal performance:

- **Cache Size**: Default 10 themes (configurable)
- **Cache Hit Rate**: ~95% for typical workflows
- **Load Time**: < 5ms for cached themes, ~50ms for fresh loads
- **Memory Usage**: ~50KB per cached theme

### Documentation

For comprehensive guides and examples:

- **SPEC Document**: [SPEC-THEME-BIND-001](../../.moai/specs/SPEC-THEME-BIND-001/spec.md)
- **API Reference**: [API Changes](../../.moai/specs/SPEC-THEME-BIND-001/api.md)
- **Migration Guide**: [Migration Guide](../../.moai/specs/SPEC-THEME-BIND-001/migration.md)
- **Theme Configuration**: See `themes/calm-wellness.json` for complete example

### Type Exports

Theme-related TypeScript types:

```typescript
import {
  ThemeConfig,
  ColorPalette,
  OKLCHColor,
  Typography,
  ComponentDefaults,
  BuildContext,
  ResolvedTokens,
  TokenResolver
} from '@tekton/component-generator';
```

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
