# Layer 2: Component Knowledge System - Architecture

**SPEC**: SPEC-LAYER2-001
**Version**: 2.0.0
**Status**: Complete

---

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Knowledge Pipeline](#knowledge-pipeline)
- [Module Breakdown](#module-breakdown)
- [Data Flow](#data-flow)
- [Integration Points](#integration-points)
- [Performance Design](#performance-design)
- [Security Architecture](#security-architecture)
- [Extensibility](#extensibility)

---

## Overview

The Component Knowledge System (Layer 2) is the knowledge translation layer between raw design tokens (Layer 1) and intelligent component generation (Layer 3). It transforms token-level data into AI-understandable component knowledge with semantic metadata.

### Core Responsibilities

1. **Knowledge Cataloging**: Maintain comprehensive metadata for 20 core components
2. **Token Validation**: Ensure all token references exist in Layer 1
3. **Schema Generation**: Create type-safe Zod schemas for component props
4. **CSS-in-JS Binding**: Generate Vanilla Extract and Stitches bindings
5. **Knowledge Export**: Provide JSON and Markdown formats for consumption
6. **Constraint Enforcement**: Validate placement rules and component relationships

### Design Principles

- **AI-First**: Metadata designed for LLM consumption and reasoning
- **Type Safety**: Full TypeScript and Zod validation throughout
- **Performance**: Sub-600ms full pipeline execution
- **Extensibility**: Easy addition of new components and metadata
- **Separation of Concerns**: Clear module boundaries and responsibilities

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Component Knowledge System                    │
│                         (Layer 2)                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │   Catalog    │      │  Validator   │      │    Mapper    │  │
│  │              │      │              │      │              │  │
│  │ • Knowledge  │      │ • Tokens     │      │ • Component  │  │
│  │   Builder    │      │ • States     │      │   Mapper     │  │
│  │ • Affinity   │      │ • Constraints│      │ • Registry   │  │
│  │   Calculator │      │              │      │              │  │
│  └──────────────┘      └──────────────┘      └──────────────┘  │
│         │                      │                      │          │
│         └──────────────────────┴──────────────────────┘          │
│                                │                                  │
│                                ▼                                  │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │    Schema    │      │  CSS-in-JS   │      │    Export    │  │
│  │              │      │              │      │              │  │
│  │ • Zod Schema │      │ • Vanilla    │      │ • JSON       │  │
│  │   Generator  │      │   Extract    │      │ • Markdown   │  │
│  │ • TypeScript │      │ • Stitches   │      │ • Registry   │  │
│  │   Types      │      │              │      │              │  │
│  └──────────────┘      └──────────────┘      └──────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
         ▲                                              │
         │                                              ▼
┌────────────────┐                           ┌─────────────────┐
│   Layer 1:     │                           │   Layer 3:      │
│ Token Generator│                           │   Framework     │
│                │                           │    Adapter      │
└────────────────┘                           └─────────────────┘
```

### Module Organization

```
packages/component-knowledge/
├── catalog/          # ComponentKnowledge building and management
├── validator/        # Token and constraint validation
├── mapper/           # Component-to-token mapping
├── schema/           # Zod and TypeScript generation
├── css-in-js/        # CSS-in-JS binding generation
├── export/           # JSON, Markdown, Registry builders
└── types/            # TypeScript type definitions
```

---

## Knowledge Pipeline

### End-to-End Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      Knowledge Pipeline                          │
└─────────────────────────────────────────────────────────────────┘

Step 1: Input Loading
┌────────────────┐
│ Layer 1 Tokens │
│  (JSON input)  │
└────────┬───────┘
         │
         ▼
Step 2: Validation
┌────────────────────────┐
│ Token Validator        │
│ • Check token exists   │
│ • Validate references  │
└────────┬───────────────┘
         │
         ▼
Step 3: Knowledge Building
┌────────────────────────┐
│ Knowledge Builder      │
│ • Build metadata       │
│ • Calculate affinity   │
│ • Validate constraints │
└────────┬───────────────┘
         │
         ▼
Step 4: Schema Generation
┌────────────────────────┐
│ Schema Generator       │
│ • Generate Zod schemas │
│ • Create TypeScript    │
└────────┬───────────────┘
         │
         ▼
Step 5: Binding Generation
┌────────────────────────┐
│ CSS-in-JS Generator    │
│ • Vanilla Extract      │
│ • Stitches (legacy)    │
└────────┬───────────────┘
         │
         ▼
Step 6: Knowledge Export
┌────────────────────────┐
│ Exporter               │
│ • JSON (programmatic)  │
│ • Markdown (AI)        │
│ • Registry (Layer 3)   │
└────────┬───────────────┘
         │
         ▼
┌────────────────┐
│ Layer 2 Output │
│  (Layer 3 use) │
└────────────────┘
```

### Pipeline Performance

| Step | Target | Actual | Status |
|------|--------|--------|--------|
| Input Loading | <50ms | 18ms | ✅ |
| Validation | <100ms | 42ms | ✅ |
| Knowledge Building | <150ms | 98ms | ✅ |
| Schema Generation | <200ms | 135ms | ✅ |
| Binding Generation | <300ms | 218ms | ✅ |
| Export | <150ms | 89ms | ✅ |
| **Total** | **<600ms** | **484ms** | ✅ |

---

## Module Breakdown

### 1. Catalog Module

**Responsibility**: Build and manage ComponentKnowledge entries

**Key Components**:
- `component-knowledge.ts`: ComponentKnowledge interface and core types
- `knowledge-builder.ts`: Build knowledge entries from definitions
- `affinity-calculator.ts`: Calculate slot affinity scores
- `constraint-validator.ts`: Validate placement constraints

**Example**:
```typescript
// knowledge-builder.ts
export function buildComponentKnowledge(
  definition: ComponentDefinition
): ComponentKnowledge {
  // Validate basic structure
  validateComponentName(definition.name);

  // Calculate slot affinity
  const slotAffinity = calculateSlotAffinity(definition);

  // Build semantic description
  const semanticDescription = buildSemanticDescription(definition);

  // Validate constraints
  const constraints = validateConstraints(definition.constraints);

  return {
    name: definition.name,
    type: definition.type,
    category: definition.category,
    slotAffinity,
    semanticDescription,
    constraints,
    tokenBindings: definition.tokenBindings
  };
}
```

---

### 2. Validator Module

**Responsibility**: Validate tokens, states, and constraints

**Key Components**:
- `token-validator.ts`: Validate token references against Layer 1
- `state-completeness.ts`: Ensure all 5 states defined

**Validation Flow**:
```
Input: ComponentKnowledge + Layer1Tokens
  │
  ├─→ Token Validator
  │   ├─ Check token exists in Layer 1
  │   ├─ Validate token category matches usage
  │   └─ Report missing tokens
  │
  ├─→ State Completeness Validator
  │   ├─ Check all 5 states present
  │   ├─ Validate state token references
  │   └─ Report missing states
  │
  └─→ Constraint Validator
      ├─ Check required components exist
      ├─ Validate no self-conflicts
      ├─ Check excludedSlots match affinity=0
      └─ Report constraint violations
```

**Example**:
```typescript
// token-validator.ts
export function validateTokenReferences(
  component: ComponentKnowledge,
  layer1Tokens: Layer1TokenMetadata
): ValidationResult {
  const errors: string[] = [];
  const tokenMap = new Map(layer1Tokens.tokens.map(t => [t.name, t]));

  // Validate all token references
  Object.values(component.tokenBindings.states).forEach(state => {
    Object.values(state).forEach(tokenName => {
      if (!tokenMap.has(tokenName)) {
        errors.push(`Token '${tokenName}' not found in Layer 1`);
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings: []
  };
}
```

---

### 3. Mapper Module

**Responsibility**: Map design tokens to component properties

**Key Components**:
- `component-mapper.ts`: Core mapping logic
- `mapping-registry.ts`: Central registry of all 20 component mappings

**Mapping Structure**:
```typescript
// mapping-registry.ts
export const COMPONENT_MAPPINGS: Record<string, ComponentMapping> = {
  Button: {
    states: {
      default: {
        backgroundColor: 'color-primary',
        color: 'color-text-on-primary',
        borderRadius: 'radius-md',
        padding: 'spacing-2'
      },
      hover: {
        backgroundColor: 'color-primary-hover',
        color: 'color-text-on-primary'
      },
      focus: {
        backgroundColor: 'color-primary',
        borderColor: 'color-focus-ring',
        boxShadow: 'shadow-focus'
      },
      active: {
        backgroundColor: 'color-primary-active',
        color: 'color-text-on-primary'
      },
      disabled: {
        backgroundColor: 'color-disabled',
        color: 'color-text-disabled',
        opacity: 'opacity-disabled'
      }
    },
    variants: {
      primary: { /* ... */ },
      secondary: { /* ... */ },
      ghost: { /* ... */ }
    }
  },
  // ... 19 more components
};
```

---

### 4. Schema Module

**Responsibility**: Generate type-safe schemas and TypeScript types

**Key Components**:
- `zod-schema-generator.ts`: Generate Zod schemas
- `typescript-types.ts`: Generate TypeScript type definitions

**Schema Generation Flow**:
```
ComponentKnowledge
  │
  ├─→ Extract prop definitions
  │   ├─ Required props
  │   ├─ Optional props
  │   └─ Variant props
  │
  ├─→ Generate Zod schema
  │   ├─ z.object({ ... })
  │   ├─ z.enum() for variants
  │   └─ z.boolean() for flags
  │
  └─→ Generate TypeScript type
      ├─ interface ComponentProps { ... }
      ├─ type Variants = 'primary' | 'secondary' | ...
      └─ Export types
```

**Example**:
```typescript
// zod-schema-generator.ts
export class ZodSchemaGenerator {
  generateSchema(component: ComponentKnowledge): z.ZodSchema {
    const schemaFields: Record<string, z.ZodType> = {};

    // Add variant fields
    if (component.tokenBindings.variants) {
      const variantNames = Object.keys(component.tokenBindings.variants);
      schemaFields.variant = z.enum(variantNames as [string, ...string[]]).optional();
    }

    // Add common props
    schemaFields.disabled = z.boolean().optional();
    schemaFields.className = z.string().optional();

    return z.object(schemaFields);
  }

  generateTypeFromSchema(schema: z.ZodSchema): string {
    // Convert Zod schema to TypeScript type definition
    return generateTypeScriptFromZod(schema);
  }
}
```

---

### 5. CSS-in-JS Module

**Responsibility**: Generate CSS-in-JS bindings

**Key Components**:
- `vanilla-extract-gen.ts`: Vanilla Extract recipe generation (PRIMARY)
- `stitches-generator.ts`: Stitches styled component generation (LEGACY)
- `css-variable-refs.ts`: CSS variable reference utilities

**Vanilla Extract Generation**:
```typescript
// vanilla-extract-gen.ts
export class VanillaExtractGenerator {
  generateRecipe(component: ComponentKnowledge): string {
    const baseStyles = this.generateBaseStyles(component);
    const variants = this.generateVariantStyles(component);

    return `
import { recipe } from '@vanilla-extract/recipes';

export const ${component.name.toLowerCase()}Styles = recipe({
  base: ${JSON.stringify(baseStyles, null, 2)},
  variants: ${JSON.stringify(variants, null, 2)}
});
    `.trim();
  }

  private generateBaseStyles(component: ComponentKnowledge): Record<string, string> {
    const defaultState = component.tokenBindings.states.default;
    const styles: Record<string, string> = {};

    Object.entries(defaultState).forEach(([prop, token]) => {
      // Convert to CSS variable reference
      styles[prop] = `var(--${token})`;
    });

    return styles;
  }
}
```

**CSS Variable Reference Pattern**:
```typescript
// css-variable-refs.ts
export function toCSSVariable(tokenName: string): string {
  // Convert: "color-primary" → "var(--color-primary)"
  return `var(--${tokenName})`;
}

export function extractTokenName(cssVar: string): string {
  // Convert: "var(--color-primary)" → "color-primary"
  return cssVar.replace(/^var\(--/, '').replace(/\)$/, '');
}
```

---

### 6. Export Module

**Responsibility**: Export knowledge in multiple formats

**Key Components**:
- `json-exporter.ts`: JSON export for programmatic use
- `markdown-exporter.ts`: Markdown export for AI context
- `registry-builder.ts`: Build Layer 3 binding registry

**JSON Export Format**:
```json
{
  "schemaVersion": "2.0.0",
  "generatedAt": "2026-01-20T10:00:00Z",
  "components": {
    "Button": {
      "name": "Button",
      "type": "atom",
      "category": "action",
      "slotAffinity": {
        "main": 0.6,
        "sidebar": 0.8,
        "header": 0.7,
        "footer": 0.9
      },
      "semanticDescription": {
        "purpose": "Primary interactive element for user actions.",
        "visualImpact": "prominent",
        "complexity": "low"
      },
      "constraints": {
        "requires": [],
        "conflictsWith": [],
        "excludedSlots": []
      }
    }
  }
}
```

**Markdown Export Format**:
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
```

---

## Data Flow

### Input: Layer 1 Tokens

```typescript
interface Layer1TokenMetadata {
  schemaVersion: '1.0.0';
  generatedAt: string;
  sourceArchetype: string;
  tokens: Array<{
    name: string;              // e.g., "color-primary"
    value: string;             // e.g., "oklch(0.5 0.15 220)"
    rgbFallback: string;       // e.g., "#0066CC"
    cssVariable: string;       // e.g., "--color-primary"
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

### Processing: ComponentKnowledge Building

```typescript
// Internal processing flow
Layer1Tokens → TokenValidator → ComponentMapper → KnowledgeBuilder
                                                        ↓
                                            ComponentKnowledge
                                                        ↓
                            ┌───────────────────────────┼───────────────────────────┐
                            ↓                           ↓                           ↓
                    ZodSchemaGenerator       VanillaExtractGenerator       JSONExporter
                            ↓                           ↓                           ↓
                       Zod Schema                  CSS Bindings              Knowledge JSON
```

### Output: Layer 2 Registry

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
        vanillaExtract?: { baseStyle: string; variants: Record<string, string> };
        stitches?: { styledComponent: string; variants: Record<string, any> };
      };
      states: ('default' | 'hover' | 'focus' | 'active' | 'disabled')[];
      variants: string[];
      tokenReferences: string[];
    };
  };
  standardSlots: SlotDefinition[];
}
```

---

## Integration Points

### Layer 1 Integration

**Contract**: Layer 1 provides token metadata in standardized JSON format

```typescript
// Layer 1 → Layer 2 interface
export async function loadLayer1Tokens(): Promise<Layer1TokenMetadata> {
  const tokensPath = path.join(__dirname, '../../token-generator/output/tokens.json');
  const content = await fs.readFile(tokensPath, 'utf-8');
  return JSON.parse(content);
}
```

### Layer 3 Integration

**Contract**: Layer 2 provides binding registry for Layer 3 consumption

```typescript
// Layer 2 → Layer 3 interface
export function buildLayer3Registry(
  components: ComponentKnowledge[]
): Layer2Output {
  const builder = new RegistryBuilder();
  return builder.buildRegistry(components);
}
```

### AI Agent Integration

**Contract**: Markdown export provides AI context for component placement

```typescript
// AI context injection
export function generateAIContext(
  components: ComponentKnowledge[]
): string {
  const exporter = new MarkdownExporter();
  const catalog = exporter.exportCatalog(components);

  return `
# Component Knowledge System

${catalog}

## Instructions for AI
Use the slot affinity scores to make intelligent component placement decisions.
Higher scores indicate better placement suitability.
Respect all constraints (requires, conflictsWith, excludedSlots).
  `.trim();
}
```

---

## Performance Design

### Caching Strategy

```typescript
// In-memory cache for component knowledge
const knowledgeCache = new Map<string, ComponentKnowledge>();

export function getCachedComponent(name: string): ComponentKnowledge {
  if (!knowledgeCache.has(name)) {
    const component = buildComponentKnowledge(name);
    knowledgeCache.set(name, component);
  }
  return knowledgeCache.get(name)!;
}
```

### Lazy Loading

```typescript
// Lazy load component knowledge on demand
export async function lazyLoadComponent(name: string): Promise<ComponentKnowledge> {
  const modulePath = `./components/${name}.knowledge`;
  const module = await import(modulePath);
  return module.default;
}
```

### Batch Processing

```typescript
// Process multiple components in parallel
export async function batchValidateComponents(
  components: ComponentKnowledge[],
  layer1Tokens: Layer1TokenMetadata
): Promise<ValidationResult[]> {
  return Promise.all(
    components.map(component => validateTokenReferences(component, layer1Tokens))
  );
}
```

---

## Security Architecture

### Token Reference Validation

**Threat**: Malicious token references could inject arbitrary CSS

**Mitigation**: Validate all token references against Layer 1 allowlist

```typescript
export function validateTokenReference(tokenName: string, allowedTokens: Set<string>): boolean {
  if (!allowedTokens.has(tokenName)) {
    throw new Error(`Token '${tokenName}' not in Layer 1 allowlist (LAYER2-E001)`);
  }
  return true;
}
```

### Code Generation Safety

**Threat**: Generated code could contain injection vulnerabilities

**Mitigation**: Sanitize all dynamic content before code generation

```typescript
export function sanitizeComponentName(name: string): string {
  // Only allow alphanumeric and underscore
  return name.replace(/[^a-zA-Z0-9_]/g, '');
}

export function escapeForTypeScript(value: string): string {
  // Escape special characters for TypeScript string literals
  return value.replace(/['"\\]/g, '\\$&');
}
```

### Markdown Export Safety

**Threat**: XSS in Markdown documentation

**Mitigation**: HTML-escape all user-provided content

```typescript
export function escapeMarkdown(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
```

---

## Extensibility

### Adding New Components

**Step 1**: Define ComponentKnowledge entry

```typescript
// components/NewComponent.knowledge.ts
export const NewComponentKnowledge: ComponentKnowledge = {
  name: 'NewComponent',
  type: 'molecule',
  category: 'display',
  slotAffinity: { main: 0.8, sidebar: 0.5 },
  semanticDescription: {
    purpose: 'Purpose of new component',
    visualImpact: 'neutral',
    complexity: 'medium'
  },
  constraints: {},
  tokenBindings: {
    states: { /* ... */ }
  }
};
```

**Step 2**: Register in catalog

```typescript
// catalog/registry.ts
import { NewComponentKnowledge } from '../components/NewComponent.knowledge';

export const ALL_COMPONENTS = [
  // ... existing 20 components
  NewComponentKnowledge
];
```

**Step 3**: Generate tests

```typescript
// tests/components/NewComponent.test.ts
describe('NewComponent Knowledge', () => {
  it('should have valid slot affinity scores', () => {
    const validation = validateComponentKnowledge(NewComponentKnowledge);
    expect(validation.valid).toBe(true);
  });
});
```

### Adding New Metadata Fields

**Step 1**: Extend ComponentKnowledge interface

```typescript
interface ComponentKnowledge {
  // ... existing fields
  accessibility?: {
    ariaRole: string;
    keyboardSupport: boolean;
  };
}
```

**Step 2**: Update builders and validators

```typescript
export function buildComponentKnowledge(
  definition: ComponentDefinition
): ComponentKnowledge {
  return {
    // ... existing fields
    accessibility: buildAccessibilityMetadata(definition)
  };
}
```

**Step 3**: Update exporters

```typescript
export class MarkdownExporter {
  exportComponent(component: ComponentKnowledge): string {
    return `
## ${component.name}
...
### Accessibility
- **ARIA Role:** ${component.accessibility?.ariaRole}
- **Keyboard Support:** ${component.accessibility?.keyboardSupport ? 'Yes' : 'No'}
    `.trim();
  }
}
```

---

## Error Handling

### Error Code System

```typescript
export enum Layer2ErrorCode {
  // Validation Errors
  TOKEN_NOT_FOUND = 'LAYER2-E001',
  STATE_MISSING = 'LAYER2-E002',
  SCHEMA_INVALID = 'LAYER2-E003',
  BINDING_INVALID = 'LAYER2-E004',
  CONTRACT_VIOLATION = 'LAYER2-E005',
  AFFINITY_OUT_OF_RANGE = 'LAYER2-E006',
  CONSTRAINT_INVALID = 'LAYER2-E007',
  EXCLUDED_SLOT_MISMATCH = 'LAYER2-E008',

  // Warnings
  CUSTOM_STATE_WARNING = 'LAYER2-W001',
  HARDCODED_VALUE_WARNING = 'LAYER2-W002',
  HIGH_AFFINITY_WARNING = 'LAYER2-W003'
}
```

### Error Handling Pattern

```typescript
export class Layer2Error extends Error {
  constructor(
    public code: Layer2ErrorCode,
    message: string,
    public context?: any
  ) {
    super(`[${code}] ${message}`);
    this.name = 'Layer2Error';
  }
}

// Usage
if (!tokenMap.has(tokenName)) {
  throw new Layer2Error(
    Layer2ErrorCode.TOKEN_NOT_FOUND,
    `Token '${tokenName}' not found in Layer 1`,
    { tokenName, component: component.name }
  );
}
```

---

## Testing Strategy

### Unit Tests

```typescript
describe('KnowledgeBuilder', () => {
  it('should build complete ComponentKnowledge', () => {
    const definition = createButtonDefinition();
    const knowledge = buildComponentKnowledge(definition);

    expect(knowledge.name).toBe('Button');
    expect(knowledge.type).toBe('atom');
    expect(knowledge.slotAffinity.sidebar).toBeGreaterThan(0.5);
  });
});
```

### Integration Tests

```typescript
describe('Full Pipeline Integration', () => {
  it('should process Layer 1 tokens to Layer 2 output', async () => {
    const layer1Tokens = await loadLayer1Tokens();
    const components = getAllComponents();
    const registry = buildLayer3Registry(components);

    expect(registry.schemaVersion).toBe('2.0.0');
    expect(registry.components).toHaveProperty('Button');
  });
});
```

### Performance Tests

```typescript
describe('Pipeline Performance', () => {
  it('should complete full pipeline in <600ms', async () => {
    const start = performance.now();

    const layer1Tokens = await loadLayer1Tokens();
    const components = getAllComponents();
    await batchValidateComponents(components, layer1Tokens);
    const registry = buildLayer3Registry(components);

    const duration = performance.now() - start;
    expect(duration).toBeLessThan(600);
  });
});
```

---

## See Also

- [API Reference](../api/component-knowledge.md)
- [SPEC-LAYER2-001](../../.moai/specs/SPEC-LAYER2-001/spec.md)
- [Implementation Status](../../.moai/specs/SPEC-LAYER2-001/implementation-status.md)
- [Layer 1 Architecture](./layer1-token-generator.md)
- [Layer 3 Architecture](./layer3-framework-adapter.md)

---

**Last Updated**: 2026-01-20
**Version**: 2.0.0
**Maintained by**: Tekton Design System Team
