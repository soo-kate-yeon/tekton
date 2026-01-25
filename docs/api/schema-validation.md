# Schema Validation Reference

**Module**: `@tekton/core/schema-validation`
**Status**: ✅ Production Ready
**Version**: 2.0.0
**Coverage**: 97.05%

---

## Overview

Schema Validation provides Zod-based runtime validation for component schemas, props, accessibility requirements, and token bindings. The validation system ensures type safety, WCAG 2.1 AA compliance, and template variable integrity across all 20 component schemas.

**Key Features:**

- 8 validation utilities with comprehensive error messaging
- Zod schemas for PropDefinition, A11yRequirements, TokenBindings, ComponentSchema
- Custom validation rules (WCAG compliance, template variable detection)
- Detailed validation summaries with path information
- Assertion utilities for build-time validation
- 97.05% test coverage with 119 comprehensive tests

---

## Validation System Architecture

### Zod Schema Hierarchy

```
ComponentSchemaZod
├── type: string (min 1 char)
├── category: enum('primitive' | 'composed')
├── props: PropDefinitionSchema[] (min 1)
├── tokenBindings: TokenBindingsSchema (min 2 bindings)
├── a11y: A11yRequirementsSchema
└── description: string (optional)

PropDefinitionSchema
├── name: string (min 1 char)
├── type: string (min 1 char)
├── required: boolean
├── description: string (min 1 char)
├── defaultValue: unknown (optional)
└── options: string[] (optional)

A11yRequirementsSchema
├── role: string (min 1 char)
├── wcag: string (includes "2.1")
├── ariaAttributes: string[] (optional)
├── keyboard: string[] (optional)
├── focus: string (optional)
└── screenReader: string (optional)

TokenBindingsSchema
└── Record<string, string> (min 2 bindings)
    ├── Template variable detection
    └── Token reference validation
```

---

## Core Validation Functions

### validateComponentSchema

Validate a single component schema against Zod schema.

```typescript
import { validateComponentSchema, type ComponentSchema } from 'tekton/core';

const schema: ComponentSchema = {
  type: 'Button',
  category: 'primitive',
  props: [
    {
      name: 'variant',
      type: 'string',
      required: false,
      description: 'Visual style variant',
      defaultValue: 'primary',
      options: ['primary', 'secondary', 'outline'],
    },
  ],
  tokenBindings: {
    background: 'component.button.{variant}.background',
    foreground: 'component.button.{variant}.foreground',
  },
  a11y: {
    role: 'button',
    wcag: 'WCAG 2.1 AA',
    ariaAttributes: ['aria-label', 'aria-disabled'],
  },
};

const result = validateComponentSchema(schema);

if (result.valid) {
  console.log('✅ Schema is valid');
} else {
  console.error('❌ Validation errors:', result.errors);
  // Example error: "props.0.name: Property name is required"
}
```

**Returns:**

```typescript
{
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}
```

**Validation Rules:**

- `type`: Required, non-empty string
- `category`: Must be "primitive" or "composed"
- `props`: Array with at least 1 PropDefinition
- `tokenBindings`: Object with at least 2 token bindings
- `a11y`: Valid A11yRequirements with WCAG 2.1 reference

**Error Format:**
Errors include path information for precise debugging:

```
"props.0.name: Property name is required"
"a11y.wcag: WCAG 2.1 compliance required"
"tokenBindings: At least 2 token bindings required per component"
```

---

### validateAllSchemas

Validate all 20 component schemas with comprehensive checks.

```typescript
import { validateAllSchemas } from 'tekton/core';

const result = validateAllSchemas();

console.log(`✅ Valid schemas: ${result.validSchemas}/20`);
console.log(`❌ Invalid schemas: ${result.invalidSchemas}`);

if (!result.valid) {
  console.error('Validation errors:', result.errors);
}

if (result.warnings) {
  console.warn('Validation warnings:', result.warnings);
}
```

**Returns:**

```typescript
{
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}
```

**Validation Checks:**

1. All 20 schemas pass individual Zod validation
2. Exactly 20 components registered
3. Exactly 10 primitive components
4. Exactly 10 composed components
5. No duplicate component types

**Example Output:**

```typescript
{
  valid: true,
  errors: undefined,
  warnings: undefined
}

// OR if validation fails:
{
  valid: false,
  errors: [
    "Button: props.0.name: Property name is required",
    "Duplicate component types found: Card, Modal"
  ],
  warnings: [
    "Expected 20 components, found 19"
  ]
}
```

---

### validateProp

Validate a single PropDefinition.

```typescript
import { validateProp, type PropDefinition } from 'tekton/core';

const prop: PropDefinition = {
  name: 'variant',
  type: 'string',
  required: false,
  description: 'Visual style variant',
  defaultValue: 'primary',
  options: ['primary', 'secondary', 'outline'],
};

const result = validateProp(prop);

if (!result.valid) {
  console.error('Invalid prop:', result.errors);
}
```

**Validation Rules:**

- `name`: Required, non-empty string
- `type`: Required, non-empty string (TypeScript-style type)
- `required`: Required boolean
- `description`: Required, non-empty string
- `defaultValue`: Optional, any type
- `options`: Optional, array of strings

**Common Validation Errors:**

```typescript
// Missing required fields
{
  valid: false,
  errors: [
    "name: Property name is required",
    "description: Property description is required"
  ]
}

// Invalid types
{
  valid: false,
  errors: [
    "required: Expected boolean, received string"
  ]
}
```

---

### validateA11y

Validate accessibility requirements with WCAG 2.1 compliance check.

```typescript
import { validateA11y, type A11yRequirements } from 'tekton/core';

const a11y: A11yRequirements = {
  role: 'button',
  wcag: 'WCAG 2.1 AA',
  ariaAttributes: ['aria-label', 'aria-disabled', 'aria-pressed'],
  keyboard: ['Enter', 'Space'],
  focus: 'Visible focus indicator with semantic.border.focus',
  screenReader: 'Announces button label and state',
};

const result = validateA11y(a11y);

if (!result.valid) {
  console.error('Accessibility validation failed:', result.errors);
}
```

**Validation Rules:**

- `role`: Required, non-empty ARIA role string
- `wcag`: Required, must include "2.1" for WCAG 2.1 compliance
- `ariaAttributes`: Optional array of ARIA attribute strings
- `keyboard`: Optional array of keyboard interaction strings
- `focus`: Optional focus management description
- `screenReader`: Optional screen reader announcement description

**WCAG Compliance Validation:**

```typescript
// Valid WCAG references
"WCAG 2.1 AA" ✅
"WCAG 2.1 AAA" ✅
"Compliant with WCAG 2.1 Level AA" ✅

// Invalid WCAG references
"WCAG 2.0 AA" ❌ (must be 2.1+)
"WCAG AA" ❌ (missing version)
"Accessible" ❌ (no WCAG reference)
```

**Example Validation Error:**

```typescript
{
  valid: false,
  errors: [
    "wcag: WCAG 2.1 compliance required"
  ]
}
```

---

### validateTokenBindings

Validate token bindings format and detect template variables.

```typescript
import { validateTokenBindings } from 'tekton/core';

const bindings = {
  background: 'component.button.{variant}.background',
  foreground: 'component.button.{variant}.foreground',
  borderRadius: 'atomic.radius.md',
  paddingX: 'atomic.spacing.{size}',
};

const result = validateTokenBindings(bindings);

if (result.warnings) {
  console.warn('Token binding warnings:', result.warnings);
}
```

**Validation Rules:**

1. **Minimum Bindings**: At least 2 token bindings required per component
2. **Template Variables**: Detection of `{variable}` patterns
3. **Token References**: Validation of `semantic.*`, `atomic.*`, `component.*` prefixes

**Template Variable Detection:**

```typescript
// Detected template variables
/{[a-zA-Z]+}/.test(value) === true

// Examples
"component.button.{variant}.background" → {variant} detected
"atomic.spacing.{size}" → {size} detected
"semantic.foreground.{color}" → {color} detected
```

**Token Reference Validation:**

```typescript
// Valid token references
"semantic.foreground.primary" ✅
"atomic.radius.md" ✅
"component.button.background" ✅

// Warning: Missing token references
"#FF0000" ⚠️
"red" ⚠️
```

**Example Output:**

```typescript
{
  valid: true,
  warnings: [
    "Consider using template variables like {variant} or {size}",
    "Token bindings should reference semantic, atomic, or component tokens"
  ]
}

// OR with errors:
{
  valid: false,
  errors: [
    "At least 2 token bindings required per component"
  ]
}
```

---

### getValidationSummary

Get comprehensive validation summary for all 20 schemas.

```typescript
import { getValidationSummary } from 'tekton/core';

const summary = getValidationSummary();

console.log(`📊 Total components: ${summary.totalComponents}`);
console.log(`🔷 Primitive: ${summary.primitiveComponents}`);
console.log(`🔶 Composed: ${summary.composedComponents}`);
console.log(`✅ Valid: ${summary.validSchemas}`);
console.log(`❌ Invalid: ${summary.invalidSchemas}`);

console.log('\n📋 Validation Results:');
summary.validationResults.forEach(result => {
  const status = result.valid ? '✅' : '❌';
  console.log(`${status} ${result.type}`);

  if (!result.valid && result.errors) {
    result.errors.forEach(error => {
      console.log(`   ⚠️  ${error}`);
    });
  }
});
```

**Returns:**

```typescript
{
  totalComponents: number;
  primitiveComponents: number;
  composedComponents: number;
  validSchemas: number;
  invalidSchemas: number;
  validationResults: Array<{
    type: string;
    valid: boolean;
    errors?: string[];
  }>;
}
```

**Example Output:**

```typescript
{
  totalComponents: 20,
  primitiveComponents: 10,
  composedComponents: 10,
  validSchemas: 20,
  invalidSchemas: 0,
  validationResults: [
    { type: 'Button', valid: true },
    { type: 'Input', valid: true },
    { type: 'Card', valid: true },
    // ... remaining 17 schemas
  ]
}
```

**Use Cases:**

- Build-time validation in CI/CD pipelines
- Development-time schema health checks
- Documentation generation statistics
- Quality assurance reporting

---

### assertValidSchema

Assert single schema is valid (throws on invalid).

```typescript
import { assertValidSchema, type ComponentSchema } from 'tekton/core';

const schema: ComponentSchema = {
  type: 'Button',
  category: 'primitive',
  props: [
    /* ... */
  ],
  tokenBindings: {
    /* ... */
  },
  a11y: {
    /* ... */
  },
};

try {
  assertValidSchema(schema);
  console.log('✅ Schema is valid!');
} catch (error) {
  console.error('❌ Invalid schema:', error.message);
  // Example: "Invalid component schema: props.0.name: Property name is required"
}
```

**Behavior:**

- **Valid Schema**: No exception, continues execution
- **Invalid Schema**: Throws Error with detailed validation error messages

**Error Message Format:**

```
"Invalid component schema: {detailed_errors}"

// Example
"Invalid component schema: props.0.name: Property name is required, a11y.wcag: WCAG 2.1 compliance required"
```

**Use Cases:**

- Build-time validation (fail fast on invalid schemas)
- Pre-deployment checks
- Integration test assertions
- Schema registry initialization

---

### assertAllSchemasValid

Assert all 20 schemas are valid (throws on invalid).

```typescript
import { assertAllSchemasValid } from 'tekton/core';

try {
  assertAllSchemasValid();
  console.log('✅ All 20 schemas are valid!');
} catch (error) {
  console.error('❌ Schema validation failed:', error.message);
  process.exit(1); // Fail CI/CD pipeline
}
```

**Behavior:**

- **All Valid**: No exception, continues execution
- **Any Invalid**: Throws Error with detailed validation errors

**Error Message Format:**

```
"Schema validation failed: {detailed_errors}"

// Example
"Schema validation failed: Button: props.0.name: Property name is required, Duplicate component types found: Card, Modal"
```

**Use Cases:**

- CI/CD pipeline quality gates
- Pre-deployment validation
- Build-time schema integrity checks
- Automated testing suites

**Example CI/CD Integration:**

```typescript
// scripts/validate-schemas.ts
import { assertAllSchemasValid } from 'tekton/core';

async function main() {
  try {
    assertAllSchemasValid();
    console.log('✅ All component schemas validated successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Schema validation failed:', error.message);
    process.exit(1); // Fail CI/CD pipeline
  }
}

main();
```

---

## Validation Rules Reference

### ComponentSchema Validation

| Field           | Rule                              | Error Message                                      |
| --------------- | --------------------------------- | -------------------------------------------------- |
| `type`          | Required, non-empty string        | "Component type is required"                       |
| `category`      | Must be "primitive" or "composed" | "Category must be 'primitive' or 'composed'"       |
| `props`         | Array with ≥1 PropDefinition      | "At least one prop is required"                    |
| `tokenBindings` | Object with ≥2 bindings           | "At least 2 token bindings required per component" |
| `a11y`          | Valid A11yRequirements            | Nested validation errors                           |
| `description`   | Optional string                   | -                                                  |

### PropDefinition Validation

| Field          | Rule                       | Error Message                       |
| -------------- | -------------------------- | ----------------------------------- |
| `name`         | Required, non-empty string | "Property name is required"         |
| `type`         | Required, non-empty string | "Property type is required"         |
| `required`     | Required boolean           | "Expected boolean, received {type}" |
| `description`  | Required, non-empty string | "Property description is required"  |
| `defaultValue` | Optional, any type         | -                                   |
| `options`      | Optional array of strings  | "Expected array of strings"         |

### A11yRequirements Validation

| Field            | Rule                       | Error Message                  |
| ---------------- | -------------------------- | ------------------------------ |
| `role`           | Required, non-empty string | "ARIA role is required"        |
| `wcag`           | Required, includes "2.1"   | "WCAG 2.1 compliance required" |
| `ariaAttributes` | Optional array of strings  | -                              |
| `keyboard`       | Optional array of strings  | -                              |
| `focus`          | Optional string            | -                              |
| `screenReader`   | Optional string            | -                              |

### TokenBindings Validation

| Rule               | Warning Message                                                         |
| ------------------ | ----------------------------------------------------------------------- |
| Minimum 2 bindings | "At least 2 token bindings required per component"                      |
| Template variables | "Consider using template variables like {variant} or {size}"            |
| Token references   | "Token bindings should reference semantic, atomic, or component tokens" |

---

## Advanced Validation Patterns

### Custom Validation Rules

```typescript
import { validateComponentSchema, type ComponentSchema } from 'tekton/core';

function validateWithCustomRules(schema: ComponentSchema): string[] {
  const errors: string[] = [];

  // Base Zod validation
  const result = validateComponentSchema(schema);
  if (!result.valid && result.errors) {
    errors.push(...result.errors);
  }

  // Custom rule: Primitive components must have "children" prop for content
  if (schema.category === 'primitive') {
    const hasChildrenProp = schema.props.some(p => p.name === 'children');
    if (!hasChildrenProp && schema.type !== 'Divider') {
      errors.push('Primitive components should have a "children" prop');
    }
  }

  // Custom rule: All interactive components need keyboard support
  const interactiveRoles = ['button', 'link', 'checkbox', 'radio', 'switch'];
  if (interactiveRoles.includes(schema.a11y.role)) {
    if (!schema.a11y.keyboard || schema.a11y.keyboard.length === 0) {
      errors.push(`Interactive component "${schema.type}" must define keyboard interactions`);
    }
  }

  return errors;
}
```

### Batch Validation with Progress

```typescript
import { ALL_COMPONENTS, validateComponentSchema } from 'tekton/core';

async function validateSchemasWithProgress() {
  console.log(`Validating ${ALL_COMPONENTS.length} component schemas...\n`);

  let validCount = 0;
  let invalidCount = 0;

  for (const schema of ALL_COMPONENTS) {
    const result = validateComponentSchema(schema);

    if (result.valid) {
      console.log(`✅ ${schema.type} (${schema.category})`);
      validCount++;
    } else {
      console.log(`❌ ${schema.type} (${schema.category})`);
      result.errors?.forEach(error => {
        console.log(`   ⚠️  ${error}`);
      });
      invalidCount++;
    }
  }

  console.log(`\n📊 Summary: ${validCount} valid, ${invalidCount} invalid`);
}
```

### Schema Migration Validation

```typescript
import { validateComponentSchema, type ComponentSchema } from 'tekton/core';

function validateSchemaMigration(oldSchema: ComponentSchema, newSchema: ComponentSchema): string[] {
  const errors: string[] = [];

  // Validate new schema structure
  const result = validateComponentSchema(newSchema);
  if (!result.valid && result.errors) {
    errors.push(...result.errors);
  }

  // Check for breaking changes
  if (oldSchema.type !== newSchema.type) {
    errors.push('Component type cannot be changed (breaking change)');
  }

  if (oldSchema.category !== newSchema.category) {
    errors.push('Component category cannot be changed (breaking change)');
  }

  // Check for removed required props
  const oldRequiredProps = oldSchema.props.filter(p => p.required).map(p => p.name);

  const newRequiredProps = newSchema.props.filter(p => p.required).map(p => p.name);

  oldRequiredProps.forEach(propName => {
    if (!newRequiredProps.includes(propName)) {
      errors.push(`Removing required prop "${propName}" is a breaking change`);
    }
  });

  return errors;
}
```

---

## Testing Integration

### Vitest Integration

```typescript
import { describe, it, expect } from 'vitest';
import {
  validateComponentSchema,
  validateAllSchemas,
  assertValidSchema,
  assertAllSchemasValid,
} from 'tekton/core';

describe('Component Schema Validation', () => {
  it('should validate all 20 component schemas', () => {
    const result = validateAllSchemas();

    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('should assert all schemas are valid', () => {
    expect(() => assertAllSchemasValid()).not.toThrow();
  });

  it('should validate individual schema', () => {
    const schema = getComponentSchema('Button');
    expect(schema).toBeDefined();

    const result = validateComponentSchema(schema!);
    expect(result.valid).toBe(true);
  });
});
```

### Jest Integration

```typescript
import { validateComponentSchema, getComponentSchema } from 'tekton/core';

describe('Button Schema Validation', () => {
  const buttonSchema = getComponentSchema('Button');

  test('should have valid schema structure', () => {
    const result = validateComponentSchema(buttonSchema!);

    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  test('should have required ARIA attributes', () => {
    expect(buttonSchema?.a11y.ariaAttributes).toContain('aria-label');
    expect(buttonSchema?.a11y.ariaAttributes).toContain('aria-disabled');
  });

  test('should have WCAG 2.1 compliance', () => {
    expect(buttonSchema?.a11y.wcag).toContain('2.1');
  });
});
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/validate-schemas.yml
name: Validate Component Schemas

on:
  push:
    branches: [main, develop]
    paths:
      - 'packages/core/src/component-schemas.ts'
      - 'packages/core/src/schema-validation.ts'
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Validate component schemas
        run: pnpm run validate:schemas

      - name: Run schema validation tests
        run: pnpm test schema-validation.test.ts
```

### Validation Script

```typescript
// scripts/validate-schemas.ts
import { assertAllSchemasValid, getValidationSummary } from 'tekton/core';

async function main() {
  console.log('🔍 Validating component schemas...\n');

  try {
    // Run validation
    assertAllSchemasValid();

    // Get summary
    const summary = getValidationSummary();

    console.log('✅ All component schemas validated successfully\n');
    console.log('📊 Summary:');
    console.log(`   Total components: ${summary.totalComponents}`);
    console.log(`   Primitive: ${summary.primitiveComponents}`);
    console.log(`   Composed: ${summary.composedComponents}`);
    console.log(`   Valid schemas: ${summary.validSchemas}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Schema validation failed:\n');
    console.error(error.message);

    process.exit(1);
  }
}

main();
```

**Add to package.json:**

```json
{
  "scripts": {
    "validate:schemas": "tsx scripts/validate-schemas.ts"
  }
}
```

---

## Error Handling Best Practices

### Graceful Degradation

```typescript
import { validateComponentSchema, type ComponentSchema } from 'tekton/core';

function loadComponentSchema(type: string): ComponentSchema | null {
  const schema = getComponentSchema(type);

  if (!schema) {
    console.warn(`Schema not found for component: ${type}`);
    return null;
  }

  const result = validateComponentSchema(schema);

  if (!result.valid) {
    console.error(`Invalid schema for ${type}:`, result.errors);
    // Fallback to default schema or return null
    return null;
  }

  return schema;
}
```

### Detailed Error Reporting

```typescript
import { validateAllSchemas } from 'tekton/core';

function generateValidationReport(): string {
  const result = validateAllSchemas();

  let report = '# Component Schema Validation Report\n\n';

  if (result.valid) {
    report += '✅ **Status**: All schemas valid\n\n';
  } else {
    report += '❌ **Status**: Validation failed\n\n';
    report += '## Errors\n\n';
    result.errors?.forEach(error => {
      report += `- ${error}\n`;
    });
  }

  if (result.warnings) {
    report += '\n## Warnings\n\n';
    result.warnings.forEach(warning => {
      report += `- ${warning}\n`;
    });
  }

  return report;
}
```

---

## Related Documentation

- [Component Schemas Module](./component-schemas.md) - 20 component schemas reference
- [Schemas Module](./README.md#schemas-module) - Zod schemas
- [Token Generator Module](./README.md#token-generator-module) - Token generation

---

**Last Updated**: 2026-01-26
**Module Status**: ✅ Production Ready (Phase B Complete)
**Test Coverage**: 97.05%
