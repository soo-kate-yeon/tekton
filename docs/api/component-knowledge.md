# Component Knowledge System API Reference

**Package**: `@tekton/component-knowledge`
**Version**: 2.0.0
**SPEC**: SPEC-LAYER2-001

---

## Table of Contents

- [Overview](#overview)
- [Core Interfaces](#core-interfaces)
- [Public API](#public-api)
- [Catalog Functions](#catalog-functions)
- [Validation Functions](#validation-functions)
- [Schema Generation](#schema-generation)
- [CSS-in-JS Generators](#css-in-js-generators)
- [Export Functions](#export-functions)
- [Type Definitions](#type-definitions)
- [Error Codes](#error-codes)
- [Usage Examples](#usage-examples)

---

## Overview

The Component Knowledge System (Layer 2) transforms raw design tokens into AI-understandable component knowledge with semantic metadata. This enables intelligent component placement, type-safe prop validation, and CSS-in-JS binding generation.

**Key Features**:

- ComponentKnowledge catalog for 20 core components
- Slot affinity scoring (0.0-1.0) for placement recommendations
- Semantic descriptions for AI context injection
- Token validation against Layer 1 metadata
- Type-safe Zod schema generation
- CSS-in-JS bindings (Vanilla Extract + Stitches)
- JSON and Markdown export formats

---

## Core Interfaces

### ComponentKnowledge

The primary interface representing extended metadata for AI reasoning.

```typescript
interface ComponentKnowledge {
  /** Component identifier (e.g., "Button", "DataTable") */
  name: string;

  /** Atomic Design hierarchy level */
  type: 'atom' | 'molecule' | 'organism' | 'template';

  /** Functional category for filtering */
  category: 'display' | 'input' | 'action' | 'container' | 'navigation';

  /**
   * Slot Affinity Scoring
   * Values from 0.0 to 1.0 indicating placement suitability
   * Higher values = more suitable for that slot
   */
  slotAffinity: {
    [slotName: string]: number;
  };

  /**
   * Semantic Description for AI Context
   * Human-readable guidance for component usage
   */
  semanticDescription: {
    /** What this component is used for */
    purpose: string;

    /** Visual prominence level */
    visualImpact: 'subtle' | 'neutral' | 'prominent';

    /** Implementation complexity */
    complexity: 'low' | 'medium' | 'high';
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
   * Token Bindings
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
```

### TokenBindings

CSS property to token mappings for a specific component state.

```typescript
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

---

## Public API

### Installation

```bash
npm install @tekton/component-knowledge
# or
yarn add @tekton/component-knowledge
# or
pnpm add @tekton/component-knowledge
```

### Basic Import

```typescript
import {
  // Catalog Functions
  getAllComponents,
  getComponentByName,
  filterComponentsByType,
  filterComponentsByCategory,

  // Validation Functions
  validateComponentKnowledge,
  validateTokenReferences,
  validateStateCompleteness,

  // Schema Generation
  ZodSchemaGenerator,
  TypeScriptTypeGenerator,

  // CSS-in-JS Generators
  VanillaExtractGenerator,
  StitchesGenerator,

  // Export Functions
  JSONExporter,
  MarkdownExporter,
  RegistryBuilder,

  // Types
  ComponentKnowledge,
  TokenBindings,
  ValidationResult,
} from '@tekton/component-knowledge';
```

---

## Catalog Functions

### getAllComponents()

Returns all 20 core components with complete metadata.

```typescript
function getAllComponents(): ComponentKnowledge[];
```

**Example**:

```typescript
import { getAllComponents } from '@tekton/component-knowledge';

const components = getAllComponents();
console.log(components.length); // 20

components.forEach(component => {
  console.log(`${component.name}: ${component.type} (${component.category})`);
});
```

---

### getComponentByName()

Retrieves a specific component by name.

```typescript
function getComponentByName(name: string): ComponentKnowledge | undefined;
```

**Parameters**:

- `name` (string): Component name (e.g., "Button", "DataTable")

**Returns**: ComponentKnowledge object or undefined if not found

**Example**:

```typescript
import { getComponentByName } from '@tekton/component-knowledge';

const button = getComponentByName('Button');
if (button) {
  console.log(button.semanticDescription.purpose);
  console.log(button.slotAffinity);
}
```

---

### filterComponentsByType()

Filters components by Atomic Design type.

```typescript
function filterComponentsByType(
  type: 'atom' | 'molecule' | 'organism' | 'template'
): ComponentKnowledge[];
```

**Parameters**:

- `type`: Atomic Design hierarchy level

**Returns**: Array of matching components

**Example**:

```typescript
import { filterComponentsByType } from '@tekton/component-knowledge';

const atoms = filterComponentsByType('atom');
console.log(atoms.length); // 12 atomic components

atoms.forEach(atom => {
  console.log(`${atom.name} - ${atom.semanticDescription.complexity}`);
});
```

---

### filterComponentsByCategory()

Filters components by functional category.

```typescript
function filterComponentsByCategory(
  category: 'display' | 'input' | 'action' | 'container' | 'navigation'
): ComponentKnowledge[];
```

**Parameters**:

- `category`: Functional category

**Returns**: Array of matching components

**Example**:

```typescript
import { filterComponentsByCategory } from '@tekton/component-knowledge';

const inputComponents = filterComponentsByCategory('input');
console.log(inputComponents); // Input, Checkbox, Radio, Switch, Slider, Select, Textarea
```

---

## Validation Functions

### validateComponentKnowledge()

Validates a ComponentKnowledge entry for completeness and consistency.

```typescript
function validateComponentKnowledge(component: ComponentKnowledge): ValidationResult;
```

**Validation Checks**:

- Slot affinity values in 0.0-1.0 range
- Excluded slots have affinity = 0.0
- Required components exist in catalog
- Constraints are consistent (no self-conflicts)
- All 5 states defined

**Returns**:

```typescript
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
```

**Example**:

```typescript
import { getComponentByName, validateComponentKnowledge } from '@tekton/component-knowledge';

const button = getComponentByName('Button');
const validation = validateComponentKnowledge(button);

if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
} else if (validation.warnings.length > 0) {
  console.warn('Validation warnings:', validation.warnings);
}
```

---

### validateTokenReferences()

Validates all token references against Layer 1 metadata.

```typescript
function validateTokenReferences(
  component: ComponentKnowledge,
  layer1Tokens: Layer1TokenMetadata
): ValidationResult;
```

**Parameters**:

- `component`: ComponentKnowledge to validate
- `layer1Tokens`: Token metadata from Layer 1

**Returns**: ValidationResult with missing token references

**Example**:

```typescript
import { validateTokenReferences } from '@tekton/component-knowledge';

const layer1Tokens = await loadLayer1Metadata();
const button = getComponentByName('Button');

const validation = validateTokenReferences(button, layer1Tokens);
if (!validation.valid) {
  console.error('Missing tokens:', validation.errors);
}
```

---

### validateStateCompleteness()

Ensures all 5 required states are defined for a component.

```typescript
function validateStateCompleteness(component: ComponentKnowledge): ValidationResult;
```

**Required States**:

- `default`
- `hover`
- `focus`
- `active`
- `disabled`

**Example**:

```typescript
import { validateStateCompleteness } from '@tekton/component-knowledge';

const card = getComponentByName('Card');
const validation = validateStateCompleteness(card);

if (!validation.valid) {
  console.error('Missing states:', validation.errors);
}
```

---

## Schema Generation

### ZodSchemaGenerator

Generates type-safe Zod schemas for component props.

```typescript
class ZodSchemaGenerator {
  /**
   * Generate a Zod schema for a component
   */
  generateSchema(component: ComponentKnowledge): z.ZodSchema;

  /**
   * Generate TypeScript type from Zod schema
   */
  generateTypeFromSchema(schema: z.ZodSchema): string;
}
```

**Example**:

```typescript
import { ZodSchemaGenerator, getComponentByName } from '@tekton/component-knowledge';
import { z } from 'zod';

const generator = new ZodSchemaGenerator();
const button = getComponentByName('Button');

// Generate Zod schema
const buttonSchema = generator.generateSchema(button);

// Validate component props
const validProps = buttonSchema.parse({
  variant: 'primary',
  size: 'medium',
  disabled: false,
});

// Generate TypeScript type
const typeDefinition = generator.generateTypeFromSchema(buttonSchema);
console.log(typeDefinition);
// Output: "type ButtonProps = { variant?: 'primary' | 'secondary' | 'ghost'; ... }"
```

---

### TypeScriptTypeGenerator

Generates standalone TypeScript type definitions.

```typescript
class TypeScriptTypeGenerator {
  /**
   * Generate TypeScript interface for component props
   */
  generatePropsInterface(component: ComponentKnowledge): string;

  /**
   * Generate TypeScript type for component variants
   */
  generateVariantTypes(component: ComponentKnowledge): string;
}
```

**Example**:

```typescript
import { TypeScriptTypeGenerator, getComponentByName } from '@tekton/component-knowledge';

const generator = new TypeScriptTypeGenerator();
const button = getComponentByName('Button');

const propsInterface = generator.generatePropsInterface(button);
console.log(propsInterface);
// Output:
// interface ButtonProps {
//   variant?: 'primary' | 'secondary' | 'ghost';
//   size?: 'small' | 'medium' | 'large';
//   disabled?: boolean;
// }
```

---

## CSS-in-JS Generators

### VanillaExtractGenerator (Primary)

Generates Vanilla Extract CSS-in-JS bindings with CSS variable references.

```typescript
class VanillaExtractGenerator {
  /**
   * Generate Vanilla Extract style recipe
   */
  generateRecipe(component: ComponentKnowledge): string;

  /**
   * Generate base styles for component
   */
  generateBaseStyles(component: ComponentKnowledge): string;

  /**
   * Generate variant styles
   */
  generateVariantStyles(component: ComponentKnowledge): string;
}
```

**Example**:

```typescript
import { VanillaExtractGenerator, getComponentByName } from '@tekton/component-knowledge';

const generator = new VanillaExtractGenerator();
const button = getComponentByName('Button');

const recipe = generator.generateRecipe(button);
console.log(recipe);
// Output:
// import { recipe } from '@vanilla-extract/recipes';
//
// export const buttonStyles = recipe({
//   base: {
//     backgroundColor: 'var(--color-primary)',
//     color: 'var(--color-text-on-primary)',
//     ...
//   },
//   variants: {
//     variant: {
//       primary: { backgroundColor: 'var(--color-primary)' },
//       secondary: { backgroundColor: 'var(--color-secondary)' },
//     }
//   }
// });
```

---

### StitchesGenerator (Legacy)

Generates Stitches CSS-in-JS bindings (maintenance mode).

```typescript
class StitchesGenerator {
  /**
   * Generate Stitches styled component
   */
  generateStyledComponent(component: ComponentKnowledge): string;

  /**
   * Generate Stitches variants
   */
  generateVariants(component: ComponentKnowledge): Record<string, any>;
}
```

**Example**:

```typescript
import { StitchesGenerator, getComponentByName } from '@tekton/component-knowledge';

const generator = new StitchesGenerator();
const button = getComponentByName('Button');

const styledComponent = generator.generateStyledComponent(button);
console.log(styledComponent);
// Output:
// import { styled } from '@stitches/react';
//
// export const Button = styled('button', {
//   backgroundColor: 'var(--color-primary)',
//   color: 'var(--color-text-on-primary)',
//   variants: { ... }
// });
```

---

## Export Functions

### JSONExporter

Exports component knowledge in JSON format for programmatic consumption.

```typescript
class JSONExporter {
  /**
   * Export complete catalog as JSON
   */
  exportCatalog(components: ComponentKnowledge[]): string;

  /**
   * Export single component as JSON
   */
  exportComponent(component: ComponentKnowledge): string;

  /**
   * Export slot affinity matrix
   */
  exportAffinityMatrix(components: ComponentKnowledge[]): string;
}
```

**Example**:

```typescript
import { JSONExporter, getAllComponents } from '@tekton/component-knowledge';
import fs from 'fs';

const exporter = new JSONExporter();
const components = getAllComponents();

const catalogJSON = exporter.exportCatalog(components);
fs.writeFileSync('component-knowledge.json', catalogJSON);

const affinityMatrix = exporter.exportAffinityMatrix(components);
fs.writeFileSync('affinity-matrix.json', affinityMatrix);
```

---

### MarkdownExporter

Exports component knowledge as Markdown for AI context injection.

```typescript
class MarkdownExporter {
  /**
   * Export complete catalog as Markdown
   */
  exportCatalog(components: ComponentKnowledge[]): string;

  /**
   * Export single component as Markdown
   */
  exportComponent(component: ComponentKnowledge): string;

  /**
   * Export slot affinity table
   */
  exportAffinityTable(components: ComponentKnowledge[]): string;
}
```

**Example**:

```typescript
import { MarkdownExporter, getAllComponents } from '@tekton/component-knowledge';
import fs from 'fs';

const exporter = new MarkdownExporter();
const components = getAllComponents();

const catalogMD = exporter.exportCatalog(components);
fs.writeFileSync('component-knowledge.md', catalogMD);

// Inject into AI context
const aiContext = `
# Component Knowledge System

${catalogMD}

Use this knowledge to make intelligent component placement decisions.
`;
```

---

### RegistryBuilder

Builds binding registry for Layer 3 consumption.

```typescript
class RegistryBuilder {
  /**
   * Build complete binding registry
   */
  buildRegistry(components: ComponentKnowledge[]): Layer2Output;

  /**
   * Generate slot definitions for Layer 3
   */
  generateSlotDefinitions(): SlotDefinition[];
}
```

**Example**:

```typescript
import { RegistryBuilder, getAllComponents } from '@tekton/component-knowledge';
import fs from 'fs';

const builder = new RegistryBuilder();
const components = getAllComponents();

const registry = builder.buildRegistry(components);
fs.writeFileSync('layer2-output.json', JSON.stringify(registry, null, 2));

// Layer 3 can now consume this registry
const slotDefinitions = builder.generateSlotDefinitions();
console.log(slotDefinitions);
```

---

## Type Definitions

### ValidationResult

```typescript
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
```

### Layer1TokenMetadata

```typescript
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

### Layer2Output

```typescript
interface Layer2Output {
  schemaVersion: '2.0.0';
  generatedAt: string;
  components: {
    [componentName: string]: {
      knowledge: ComponentKnowledge;
      zodSchema: ZodSchema;
      propsType: string;
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
      states: ('default' | 'hover' | 'focus' | 'active' | 'disabled')[];
      variants: string[];
      tokenReferences: string[];
    };
  };
  standardSlots: SlotDefinition[];
}
```

### SlotDefinition

```typescript
interface SlotDefinition {
  name: string;
  role: string;
  allowedTypes: ('atom' | 'molecule' | 'organism' | 'template')[];
  allowedCategories: ('display' | 'input' | 'action' | 'container' | 'navigation')[];
}
```

---

## Error Codes

| Code        | Type                   | Description                                       |
| ----------- | ---------------------- | ------------------------------------------------- |
| LAYER2-E001 | Token Validation       | Token reference not found in Layer 1 metadata     |
| LAYER2-E002 | State Completeness     | Required state missing from component mapping     |
| LAYER2-E003 | Schema Generation      | Invalid Zod schema structure generated            |
| LAYER2-E004 | CSS-in-JS Output       | Invalid binding output format                     |
| LAYER2-E005 | Contract Violation     | Layer 1 metadata does not match expected contract |
| LAYER2-E006 | Affinity Range         | slotAffinity value outside 0.0-1.0 range          |
| LAYER2-E007 | Constraint Invalid     | Invalid constraint reference (missing component)  |
| LAYER2-E008 | Excluded Slot Mismatch | excludedSlots doesn't match slotAffinity=0        |
| LAYER2-W001 | Warning                | Custom state detected (non-standard)              |
| LAYER2-W002 | Warning                | Hardcoded value detected in binding               |
| LAYER2-W003 | Warning                | High affinity (>0.95) may cause over-selection    |

---

## Usage Examples

### Example 1: Component Catalog Query

```typescript
import {
  getAllComponents,
  filterComponentsByType,
  getComponentByName,
} from '@tekton/component-knowledge';

// Get all components
const allComponents = getAllComponents();
console.log(`Total components: ${allComponents.length}`);

// Filter by type
const atoms = filterComponentsByType('atom');
const organisms = filterComponentsByType('organism');

console.log(`Atoms: ${atoms.map(a => a.name).join(', ')}`);
console.log(`Organisms: ${organisms.map(o => o.name).join(', ')}`);

// Get specific component
const button = getComponentByName('Button');
console.log(`Button affinity for sidebar: ${button.slotAffinity.sidebar}`);
```

### Example 2: Slot Affinity Analysis

```typescript
import { getAllComponents } from '@tekton/component-knowledge';

const components = getAllComponents();

// Find best components for sidebar
const sidebarComponents = components
  .filter(c => c.slotAffinity.sidebar > 0.7)
  .sort((a, b) => b.slotAffinity.sidebar - a.slotAffinity.sidebar);

console.log('Best components for sidebar:');
sidebarComponents.forEach(c => {
  console.log(`${c.name}: ${c.slotAffinity.sidebar} (${c.category})`);
});
```

### Example 3: Schema Generation Pipeline

```typescript
import {
  getComponentByName,
  ZodSchemaGenerator,
  VanillaExtractGenerator,
  JSONExporter,
} from '@tekton/component-knowledge';
import fs from 'fs';

const button = getComponentByName('Button');

// Generate Zod schema
const schemaGen = new ZodSchemaGenerator();
const schema = schemaGen.generateSchema(button);
const typeDefinition = schemaGen.generateTypeFromSchema(schema);

// Generate CSS-in-JS bindings
const styleGen = new VanillaExtractGenerator();
const styles = styleGen.generateRecipe(button);

// Export as JSON
const jsonExporter = new JSONExporter();
const json = jsonExporter.exportComponent(button);

// Save outputs
fs.writeFileSync('Button.types.ts', typeDefinition);
fs.writeFileSync('Button.css.ts', styles);
fs.writeFileSync('Button.knowledge.json', json);
```

### Example 4: Full Layer 2 Pipeline

```typescript
import {
  getAllComponents,
  validateComponentKnowledge,
  validateTokenReferences,
  RegistryBuilder,
  MarkdownExporter,
} from '@tekton/component-knowledge';
import fs from 'fs';

// Load Layer 1 tokens
const layer1Tokens = JSON.parse(fs.readFileSync('layer1-tokens.json', 'utf-8'));

// Get all components
const components = getAllComponents();

// Validate all components
const validationResults = components.map(component => ({
  name: component.name,
  validation: validateComponentKnowledge(component),
  tokenValidation: validateTokenReferences(component, layer1Tokens),
}));

// Check for errors
const errors = validationResults.filter(r => !r.validation.valid || !r.tokenValidation.valid);
if (errors.length > 0) {
  console.error('Validation errors:', errors);
  process.exit(1);
}

// Build registry for Layer 3
const builder = new RegistryBuilder();
const registry = builder.buildRegistry(components);
fs.writeFileSync('layer2-output.json', JSON.stringify(registry, null, 2));

// Generate AI context
const mdExporter = new MarkdownExporter();
const aiContext = mdExporter.exportCatalog(components);
fs.writeFileSync('component-knowledge.md', aiContext);

console.log('Layer 2 pipeline complete!');
```

---

## Performance Considerations

### Caching

Component knowledge is static and should be cached:

```typescript
let cachedComponents: ComponentKnowledge[] | null = null;

export function getCachedComponents(): ComponentKnowledge[] {
  if (!cachedComponents) {
    cachedComponents = getAllComponents();
  }
  return cachedComponents;
}
```

### Lazy Loading

For large applications, lazy load component knowledge:

```typescript
const componentLoaders = {
  Button: () => import('./components/Button.knowledge'),
  Input: () => import('./components/Input.knowledge'),
  // ...
};

export async function lazyLoadComponent(name: string): Promise<ComponentKnowledge> {
  const loader = componentLoaders[name];
  if (!loader) throw new Error(`Component ${name} not found`);
  const module = await loader();
  return module.default;
}
```

---

## Migration Guide

### Migrating from v1.x to v2.0

**Breaking Changes**:

1. ComponentKnowledge now includes `slotAffinity` and `semanticDescription`
2. Constraint validation is stricter
3. Stitches support is now legacy (use Vanilla Extract)

**Migration Steps**:

```typescript
// v1.x (old)
const buttonMapping = {
  name: 'Button',
  states: { default: { ... } }
};

// v2.0 (new)
const buttonKnowledge: ComponentKnowledge = {
  name: 'Button',
  type: 'atom',
  category: 'action',
  slotAffinity: { main: 0.6, sidebar: 0.8 },
  semanticDescription: {
    purpose: 'Primary interactive element',
    visualImpact: 'prominent',
    complexity: 'low'
  },
  constraints: {},
  tokenBindings: {
    states: { default: { ... }, hover: { ... }, ... }
  }
};
```

---

## See Also

- [Architecture Guide](../architecture/layer2-component-knowledge.md)

---

**Last Updated**: 2026-01-20
**Version**: 2.0.0
**Maintained by**: Tekton Design System Team
