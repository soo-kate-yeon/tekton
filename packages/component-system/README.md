# Component System

Hook-based component component integration system for Tekton Design System.

## Overview

The Component System provides a four-layer architecture for AI-driven component generation, mapping 20 headless hooks to styling rules and visual feedback patterns. This system enables single-prompt component generation by providing structured component definitions that AI can consume directly.

## Installation

Internal package - part of Tekton monorepo.

```bash
pnpm install
```

## Quick Start

### Using Component Schemas

```typescript
import { validateHookPropRules } from '@tekton/component-system';

const buttonArchetype = {
  hookName: "useButton",
  propObjects: ["buttonProps", "isPressed"],
  baseStyles: [
    {
      propObject: "buttonProps",
      cssProperties: {
        "background": "var(--tekton-primary-500)",
        "color": "var(--tekton-neutral-50)",
        "border-radius": "var(--tekton-border-radius)"
      }
    }
  ]
};

const result = validateHookPropRules(buttonArchetype);
console.log(result.valid); // true
```

### Using State-Style Validators

```typescript
import { validateStateMapping } from '@tekton/component-system';

const stateMapping = {
  hookName: "useButton",
  states: [
    {
      stateName: "isPressed",
      stateType: "boolean",
      visualFeedback: {
        cssProperties: {
          "background": "var(--tekton-primary-700)",
          "transform": "scale(0.98)"
        },
        transition: "all 150ms ease-out"
      }
    }
  ]
};

const result = validateStateMapping(stateMapping);
console.log(result.valid); // true
```

## Documentation

Comprehensive component documentation for AI-driven component generation:

- **[AI Master Guide](../../docs/preset_archetypes.md)** - Complete component reference with all 20 hooks
- **[Element Mapping](../../docs/element-mapping.md)** - HTML element selection guide
- **[Composition Patterns](../../docs/composition-patterns.md)** - Nested component patterns and hierarchies
- **[Variant Decision Trees](../../docs/variant-decision-trees.md)** - Conditional styling logic and branching rules

## Architecture

The Component System follows a four-layer component architecture:

### Layer 1: Hook Prop Rules
- **Purpose**: Base styling rules for hook prop objects
- **Schema**: `hook-prop-rules.schema.json`
- **Maps**: Hook signatures → CSS properties with Token Contract variables
- **Example**: `buttonProps` → `{ background: "var(--tekton-primary-500)" }`

### Layer 2: State-Style Mapping
- **Purpose**: Visual feedback rules for hook state values
- **Schema**: `state-style-mapping.schema.json`
- **Maps**: Hook states → Dynamic CSS properties
- **Example**: `isPressed: true` → `{ background: "var(--tekton-primary-700)", transform: "scale(0.98)" }`

### Layer 3: Variant Branching
- **Purpose**: Conditional styling based on hook configuration
- **Schema**: `variant-branching.schema.json`
- **Maps**: Configuration options → Style variations
- **Example**: `variant: "danger"` → `{ background: "var(--tekton-error-500)" }`

### Layer 4: Structure Templates
- **Purpose**: Recommended HTML/JSX patterns
- **Documentation**: `preset_archetypes.md` structure templates
- **Maps**: Hook types → HTML element recommendations
- **Example**: `useButton` → `<button>` element with icon + label pattern

Reference: [SPEC-COMPONENT-001](../../.moai/specs/SPEC-COMPONENT-001/spec.md)

## API Reference

### Schemas

All component schemas are defined in `src/schemas/`:

- **`hook-prop-rules.schema.json`**: Validates hook-to-prop mapping definitions
- **`state-style-mapping.schema.json`**: Validates state-to-style mapping rules
- **`variant-branching.schema.json`**: Validates variant configuration branching

### Validators

Runtime validation utilities in `src/validators/`:

```typescript
// Hook prop rules validation
validateHookPropRules(archetypeDefinition): ValidationResult

// State-style mapping validation
validateStateMapping(stateMapping): ValidationResult

// Variant branching validation
validateVariantBranching(variantConfig): ValidationResult

// CSS variable reference validation
validateCSSVariables(archetypeDef, tokenContract): ValidationResult
```

### Types

TypeScript type definitions for all component structures:

```typescript
interface HookPropRule {
  hookName: string;
  propObjects: string[];
  baseStyles: {
    propObject: string;
    cssProperties: Record<string, string>;
  }[];
  requiredCSSVariables: string[];
}

interface StateStyleMapping {
  hookName: string;
  states: {
    stateName: string;
    stateType: "boolean" | "numeric" | "composite";
    visualFeedback: {
      cssProperties: Record<string, string>;
      transition?: string;
    };
  }[];
}

interface VariantBranching {
  hookName: string;
  configurationOptions: {
    optionName: string;
    optionType: "boolean" | "string" | "enum";
    possibleValues: any[];
    styleRules: {
      condition: string;
      cssProperties: Record<string, string>;
    }[];
  }[];
}
```

## Development

### Testing

Run all tests with coverage:

```bash
pnpm test
```

Run tests with detailed coverage report:

```bash
pnpm test -- --coverage
```

Current test coverage: **87.78%** (142 tests passing)

### Quality Standards

This package follows the TRUST 5 framework:

- **Test-first**: ≥85% coverage (currently 87.78%)
- **Readable**: Clear component definitions, comprehensive documentation
- **Unified**: Consistent naming conventions, structured schemas
- **Secured**: CSS variable validation, schema compliance enforcement
- **Trackable**: Complete SPEC-COMPONENT-001 traceability

Quality Status: **TRUST 5 PASS**

## Integration

### Integration with Token Contract

The Component System integrates seamlessly with the Token Contract system:

```typescript
// All CSS properties reference Token Contract variables
{
  "background": "var(--tekton-primary-500)",
  "color": "var(--tekton-neutral-50)",
  "border": "var(--tekton-border-width) solid var(--tekton-primary-600)"
}
```

For Token Contract details, see: [Token Contract README](../token-contract/README.md)

### Integration with Headless Hooks

Components are built on top of the 20 headless hooks:

```typescript
// Hook returns props and state
const { buttonProps, isPressed } = useButton();

// Component provides styling for both
const styles = {
  ...archetypeBaseStyles.buttonProps,
  ...(isPressed && archetypeStateStyles.isPressed)
};
```

For Headless Hooks details, see: [Headless Components README](../headless-components/README.md)

## AI Component Generation

The primary purpose of this system is to enable AI-driven component generation:

### Single-Prompt Workflow

1. **User Prompt**: "Create a Professional theme button using useButton hook"
2. **AI Identifies**:
   - Hook: `useButton` from SPEC-COMPONENT-001
   - Theme: Professional from Token Contract
   - Component: Button rules from preset_archetypes.md
3. **AI Generates**: Complete Button component with proper styling

### Example AI Prompts

**Simple Button**:
```
"Create a button using useButton hook with primary styling"
```

**Complex Dropdown**:
```
"Create a dropdown menu using useDropdown hook with danger variant and icon"
```

**Form Field**:
```
"Create a text field using useTextField hook with error state styling"
```

For complete AI prompting examples, see: [preset_archetypes.md](../../docs/preset_archetypes.md)

---

**SPEC**: [SPEC-COMPONENT-001](../../.moai/specs/SPEC-COMPONENT-001/spec.md)
**Status**: Production Ready (v1.0.0)
**Coverage**: 87.78% (142 tests passing)
**Quality**: TRUST 5 PASS

**Last Updated**: 2026-01-17
