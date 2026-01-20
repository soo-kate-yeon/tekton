# Component Knowledge System (Layer 2)

**TAG**: SPEC-LAYER2-001
**Version**: 2.0.0
**Status**: Complete ✅

## Overview

The Component Knowledge System serves as the **knowledge translation layer** that transforms raw design system data into AI-understandable "knowledge" and "rules". This layer bridges abstract tokens (Layer 1) and intelligent component generation (Layer 3).

## Key Features

- ✅ **ComponentKnowledge Catalog**: Complete metadata for 20 core components
- ✅ **Slot Affinity Scoring**: 0.0-1.0 scores for intelligent placement recommendations
- ✅ **Semantic Descriptions**: Purpose, visual impact, and complexity metadata for AI context
- ✅ **Token Validation**: Validates all token references against Layer 1 metadata
- ✅ **State Completeness**: Ensures all 5 states (default, hover, focus, active, disabled) are covered
- ✅ **Zod Schema Generation**: Type-safe component props validation
- ✅ **CSS-in-JS Bindings**: Vanilla Extract recipes with CSS variable references
- ✅ **Knowledge Export**: JSON and Markdown formats for programmatic and AI use
- ✅ **Layer 3 Integration**: Registry builder for component generation engine

## Test Coverage

**Overall Coverage**: 95.81% ✅
- Statements: 95.81%
- Branches: 89.11%
- Functions: 85%
- Lines: 95.81%

**Target**: ≥85% (TRUST 5 requirement) - **PASSED** ✅

## Installation

```bash
npm install @tekton/component-knowledge
```

## Usage

### Basic Usage

```typescript
import {
  getAllComponents,
  validateComponentKnowledge,
  ZodSchemaGenerator,
  VanillaExtractGenerator,
  JSONExporter,
  MarkdownExporter,
  Layer3RegistryBuilder,
} from '@tekton/component-knowledge';

// Get all 20 components
const components = getAllComponents();

// Validate a component
const button = getComponentByName('Button');
const validation = validateComponentKnowledge(button);

// Generate Zod schema
const schemaGen = new ZodSchemaGenerator();
const schema = schemaGen.generateSchema(button);

// Generate CSS-in-JS bindings
const styleGen = new VanillaExtractGenerator();
const styles = styleGen.generateStyles(button);

// Export as JSON
const jsonExporter = new JSONExporter();
const json = jsonExporter.exportCatalog(components);

// Export as Markdown (for AI context)
const mdExporter = new MarkdownExporter();
const markdown = mdExporter.exportCatalog(components);

// Build Layer 3 registry
const builder = new Layer3RegistryBuilder();
const registry = builder.buildRegistry(components);
```

### Token Validation

```typescript
import { TokenValidator } from '@tekton/component-knowledge';
import type { Layer1TokenMetadata } from '@tekton/component-knowledge';

// Load Layer 1 metadata
const layer1Metadata: Layer1TokenMetadata = await loadTokens();

// Create validator
const validator = new TokenValidator(layer1Metadata);

// Validate token references
const result = validator.validateToken('color-primary');
if (!result.valid) {
  console.error('Invalid token:', result.errors);
  console.warn('Suggestions:', result.warnings);
}

// Resolve all token references from component
const tokenRefs = validator.resolveTokenReferences(button);
console.log('Token references:', tokenRefs);
```

### State Completeness Check

```typescript
import { StateCompletenessChecker } from '@tekton/component-knowledge';

const checker = new StateCompletenessChecker();

// Validate all states are present
const result = checker.validate(button);
if (!result.valid) {
  console.error('Missing states:', result.errors);
}

// Calculate coverage
const coverage = checker.calculateCoverage(button);
console.log(`State coverage: ${coverage}%`);
```

## Component Catalog

The system includes complete knowledge for 20 core components:

| Component | Type | Category | Primary Slot |
|-----------|------|----------|--------------|
| Button | atom | action | sidebar, footer |
| Input | atom | input | main, sidebar |
| Card | molecule | container | main, sidebar |
| Modal | organism | container | overlay |
| Dropdown | molecule | input | header, main |
| Checkbox | atom | input | main, sidebar |
| Radio | atom | input | main, sidebar |
| Switch | atom | input | sidebar |
| Slider | atom | input | main |
| Badge | atom | display | header, card |
| Alert | molecule | display | main |
| Toast | molecule | display | overlay |
| Tooltip | atom | display | any |
| Popover | molecule | container | any |
| Tabs | molecule | navigation | main |
| Accordion | molecule | container | main, sidebar |
| Select | atom | input | main, sidebar |
| Textarea | atom | input | main |
| Progress | atom | display | main, header |
| Avatar | atom | display | header, sidebar |

## Requirements Satisfied

- ✅ **REQ-LAYER2-001**: All token references validated against Layer 1
- ✅ **REQ-LAYER2-002**: Type-safe Zod schemas generated
- ✅ **REQ-LAYER2-003**: Complete state coverage (5 states)
- ✅ **REQ-LAYER2-004**: CSS variables referenced (no hardcoded values)
- ✅ **REQ-LAYER2-005**: ComponentKnowledge metadata for all components
- ✅ **REQ-LAYER2-006**: Slot affinity validation with warnings
- ✅ **REQ-LAYER2-009**: JSON and Markdown export formats
- ✅ **REQ-LAYER2-010**: excludedSlots consistency validation
- ✅ **REQ-LAYER2-011**: Required component validation
- ✅ **REQ-LAYER2-013**: No hardcoded values (CSS-in-JS)
- ✅ **REQ-LAYER2-014**: Reject incomplete state coverage
- ✅ **REQ-LAYER2-015**: Slot affinity range validation (0.0-1.0)

## Architecture

```
ComponentKnowledge Interface
        ↓
    Validators
        ↓
    20 Components
        ↓
   Schema & CSS-in-JS Generation
        ↓
    Export (JSON/Markdown)
        ↓
   Layer 3 Registry
```

## Dependencies

- `zod` (^3.23.0) - Schema validation
- `@vanilla-extract/css` (^1.16.0) - CSS-in-JS (primary)
- `@stitches/core` (^1.2.8) - CSS-in-JS (secondary)

## License

MIT

## Related

- **SPEC-LAYER1-001**: Token Generator Engine (input dependency)
- **SPEC-LAYER3-001**: Component Generation Engine (output consumer)
