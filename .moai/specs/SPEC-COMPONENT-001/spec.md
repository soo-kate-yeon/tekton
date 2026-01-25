---
id: SPEC-COMPONENT-001
version: "1.0.0"
status: "planned"
created: "2026-01-25"
updated: "2026-01-25"
author: "MoAI-ADK"
priority: "HIGH"
lifecycle: "spec-anchored"
tags: ["SPEC-COMPONENT-001", "Component", "Catalog", "Token", "CSS-Variables", "Hybrid"]
---

## HISTORY
- 2026-01-25 v1.0.0: Initial SPEC creation - Hybrid Component System with 3-Layer Token Architecture

---

# SPEC-COMPONENT-001: Hybrid Component Catalog System

## Executive Summary

**Purpose**: Implement a hybrid component system that combines pre-built reference implementations (Tier 1) with LLM-generated custom components (Tier 2), enabling consistent high-quality code generation across diverse themes through CSS Variables-based theming.

**Scope**: Design and implement:
1. 3-Layer Token System (Atomic → Semantic → Component)
2. Component Interface Schemas (platform-agnostic contracts)
3. Reference Implementation Library (@tekton/ui)
4. CSS Variables Generation Pipeline
5. Hybrid Export System (Reference + LLM fallback)

**Priority**: HIGH - Foundational architecture for scalable design system code generation.

**Impact**: Transforms Tekton from "component name catalog" to "full component system" with:
- 100% quality guarantee for 20 core components (Tier 1)
- 90%+ quality for custom/composite components via LLM (Tier 2)
- Theme-agnostic code through CSS Variables binding

**Key Design Decisions**:
- **Token Binding**: CSS Variables as the bridge between Theme and Components
- **Reference First**: shadcn-inspired pre-built components, not runtime generation
- **Hybrid Export**: Core components copied, custom components LLM-generated
- **Web-First**: React/Next.js with Radix primitives, extensible interface for future platforms

**Differentiators**:
- **vs shadcn**: Dynamic theme binding, not static copy-paste
- **vs Material-UI**: Theme-agnostic tokens, not coupled theming
- **vs Tailwind UI**: Programmatic generation, not manual templates

---

## ENVIRONMENT

### Current System Context

**Existing @tekton/core State:**
```typescript
// Current: Component names only, no structure
export const COMPONENT_CATALOG = [
  'Button', 'Input', 'Card', 'Text', 'Heading', 'Image', 'Link',
  'List', 'Form', 'Modal', 'Tabs', 'Table', 'Badge', 'Avatar',
  'Dropdown', 'Checkbox', 'Radio', 'Switch', 'Slider', 'Progress'
] as const;

// Current: Theme has basic tokens, not component-bound
export interface Theme {
  colorPalette: { primary, secondary, accent, neutral }
  typography: { fontFamily, fontScale, headingWeight, bodyWeight }
  componentDefaults: { borderRadius, density, contrast }
}
```

**Gap Analysis:**
- ❌ No component props/variants definition
- ❌ No token-to-component binding specification
- ❌ No reference implementation code
- ❌ No CSS Variables generation
- ❌ Export generates code without token binding

**Target Architecture:**
```
┌─────────────────────────────────────────────────────────────────┐
│  TIER 1: Core Library (Reference Implementation)                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ @tekton/ui: 20 shadcn-style components                   │  │
│  │ CSS Variables: --button-primary-bg, --input-border, etc. │  │
│  │ Quality: 100% guaranteed                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  TIER 2: LLM Generator (Custom/Composite)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Schema + Context → LLM → Code → Validate → Fix Loop      │  │
│  │ Few-shot examples from Tier 1                            │  │
│  │ Quality: 90%+ with validation                            │  │
│  └──────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  TOKEN SYSTEM: 3-Layer Architecture                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Layer 1: Atomic    → color.blue.500, spacing.4, radius.md│  │
│  │ Layer 2: Semantic  → background.page, foreground.primary │  │
│  │ Layer 3: Component → button.primary.bg, input.border     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Technology Stack:**
- **Runtime**: Node.js 20+, TypeScript 5.7+
- **UI Framework**: React 19, Next.js 15+
- **Primitives**: Radix UI (headless, accessible)
- **Styling**: Tailwind CSS 4.x + CSS Variables
- **Variants**: class-variance-authority (CVA)
- **Utilities**: clsx, tailwind-merge
- **Validation**: Zod, ESLint, TypeScript strict mode

---

## ASSUMPTIONS

### Technical Assumptions

**A-001: CSS Variables Browser Support**
- **Assumption**: CSS Custom Properties (CSS Variables) are supported in all target browsers
- **Confidence**: HIGH
- **Evidence**: 97%+ global browser support (caniuse.com), standard since 2017
- **Risk if Wrong**: Fallback to inline styles or CSS-in-JS
- **Validation**: Browser compatibility testing

**A-002: Radix Primitives Stability**
- **Assumption**: Radix UI primitives provide stable, accessible component foundations
- **Confidence**: HIGH
- **Evidence**: Radix is used by shadcn/ui, Vercel, and major design systems
- **Risk if Wrong**: Need alternative headless library or custom implementation
- **Validation**: Radix version pinning, integration tests

**A-003: LLM Code Generation Quality**
- **Assumption**: LLM (Claude) can generate valid React/TypeScript code when given proper schema and examples
- **Confidence**: MEDIUM-HIGH
- **Evidence**: Claude demonstrates strong code generation capabilities with context
- **Risk if Wrong**: Increased validation failures, higher fix loop iterations
- **Validation**: Code generation benchmarks, validation success rate tracking

**A-004: Token Resolution Performance**
- **Assumption**: CSS Variables resolution at runtime has negligible performance impact
- **Confidence**: HIGH
- **Evidence**: CSS Variables are resolved by browser CSS engine, highly optimized
- **Risk if Wrong**: Consider build-time token inlining for critical paths
- **Validation**: Performance benchmarks, Lighthouse scores

### Design Assumptions

**A-005: 20 Core Components Sufficiency**
- **Assumption**: 20 core components cover 80%+ of common UI patterns
- **Confidence**: HIGH
- **Evidence**: Analysis of shadcn/ui, Radix, Material-UI component usage statistics
- **Risk if Wrong**: Expand Tier 1 catalog based on usage data
- **Validation**: User feedback, component request tracking

**A-006: 3-Layer Token Granularity**
- **Assumption**: Atomic → Semantic → Component layering provides optimal balance of flexibility and consistency
- **Confidence**: HIGH
- **Evidence**: Industry standard (Figma Tokens, Style Dictionary, Tailwind)
- **Risk if Wrong**: Simplify to 2 layers or add 4th layer as needed
- **Validation**: Token usage analysis, theme switching tests

---

## REQUIREMENTS

### Ubiquitous Requirements (Always Active)

**U-001: Component Schema Definition**
- The system **shall** define TypeScript interfaces for all 20 core components specifying props, variants, sizes, slots, and token bindings.
- **Rationale**: Schemas enable type-safe development and LLM context provision.
- **Test Strategy**: TypeScript compilation, schema completeness verification.

**U-002: 3-Layer Token Architecture**
- The system **shall** implement tokens in three layers: Atomic (raw values), Semantic (meaning-based), and Component (component-specific mappings).
- **Rationale**: Layered architecture enables theme flexibility while maintaining component consistency.
- **Test Strategy**: Token resolution tests across all layers, theme switching verification.

**U-003: CSS Variables Generation**
- The system **shall** generate CSS Variables from Theme tokens following the naming convention `--{layer}-{category}-{name}`.
- **Rationale**: CSS Variables enable runtime theming without code regeneration.
- **Test Strategy**: CSS output validation, variable naming consistency.

**U-004: Reference Implementation Quality**
- The system **shall** provide Tier 1 components that pass accessibility (WCAG 2.1 AA), TypeScript strict mode, and ESLint rules.
- **Rationale**: Reference implementations set quality baseline for entire system.
- **Test Strategy**: Accessibility audits, linting, type checking.

**U-005: Component-Token Binding Specification**
- The system **shall** document which CSS properties each component binds to which token paths.
- **Rationale**: Explicit bindings enable predictable theming and debugging.
- **Test Strategy**: Binding documentation completeness, visual regression tests.

### Event-Driven Requirements (Trigger-Response)

**E-001: Theme-to-CSS Export**
- **WHEN** a Theme object is provided **THEN** generate complete CSS file with all token layers as CSS Variables.
- **Rationale**: Single source of truth for theme → production CSS.
- **Test Strategy**: CSS generation tests with multiple themes.

**E-002: Component Code Export (Tier 1)**
- **WHEN** export requested for core component **THEN** return pre-built reference implementation with CSS Variable bindings.
- **Rationale**: Guaranteed quality for core components.
- **Test Strategy**: Export validation, syntax checking.

**E-003: Component Code Export (Tier 2)**
- **WHEN** export requested for custom/composite component **THEN** invoke LLM generation with schema context, validate output, and return code.
- **Rationale**: Flexible generation for non-standard components.
- **Test Strategy**: LLM generation tests, validation success rate.

**E-004: Validation Failure Recovery**
- **WHEN** LLM-generated code fails validation **THEN** retry with error context (max 3 attempts) before returning error.
- **Rationale**: Self-healing generation improves success rate.
- **Test Strategy**: Failure injection tests, retry behavior verification.

### State-Driven Requirements (Conditional Behavior)

**S-001: Component Tier Resolution**
- **IF** requested component is in COMPONENT_CATALOG **THEN** use Tier 1 reference implementation.
- **IF** requested component is not in catalog **THEN** use Tier 2 LLM generation.
- **Rationale**: Automatic routing to optimal generation path.
- **Test Strategy**: Routing tests for various component types.

**S-002: Token Layer Fallback**
- **IF** component token not defined **THEN** fall back to semantic token.
- **IF** semantic token not defined **THEN** fall back to atomic token.
- **Rationale**: Graceful degradation ensures all components render.
- **Test Strategy**: Missing token tests, fallback chain verification.

**S-003: Theme Validation**
- **IF** theme missing required tokens **THEN** return validation error with missing token list.
- **IF** theme valid **THEN** proceed with CSS generation.
- **Rationale**: Early validation prevents runtime errors.
- **Test Strategy**: Incomplete theme tests, error message clarity.

**S-004: Dark Mode Support**
- **IF** theme includes dark mode tokens **THEN** generate `.dark` CSS class with overrides.
- **IF** theme is light-only **THEN** generate root-only CSS.
- **Rationale**: Flexible dark mode support without forcing all themes.
- **Test Strategy**: Dark mode CSS generation, class switching tests.

### Unwanted Behaviors (Prohibited Actions)

**UW-001: No Hardcoded Colors**
- The system **shall not** include hardcoded color values in component implementations; all colors must reference CSS Variables.
- **Rationale**: Hardcoded colors break theming.
- **Test Strategy**: Code scanning for color literals, CSS Variable usage audit.

**UW-002: No Component-Specific Theme Code**
- The system **shall not** require theme-specific code within components; theming must be purely CSS Variable based.
- **Rationale**: Components must remain theme-agnostic.
- **Test Strategy**: Component code review, no theme imports in components.

**UW-003: No Inline Styles for Themeable Properties**
- The system **shall not** use inline styles for properties that should be themeable (colors, spacing, typography).
- **Rationale**: Inline styles prevent CSS Variable theming.
- **Test Strategy**: Inline style audit, Tailwind/CSS Variable usage.

**UW-004: No Silent LLM Failures**
- The system **shall not** return partially valid or syntactically broken code from LLM generation.
- **Rationale**: Invalid code causes downstream errors.
- **Test Strategy**: Validation enforcement, syntax checking.

### Optional Requirements (Future Enhancements)

**O-001: Component Composition DSL**
- **Where possible**, provide a declarative DSL for composing custom components from primitives.
- **Priority**: DEFERRED to Phase 2
- **Rationale**: Reduces LLM dependence for common compositions.

**O-002: Visual Token Editor**
- **Where possible**, provide a visual interface for editing theme tokens with live preview.
- **Priority**: DEFERRED to Phase 2
- **Rationale**: Improves designer workflow.

**O-003: Platform Extension (React Native)**
- **Where possible**, enable React Native implementations using same component schemas.
- **Priority**: DEFERRED to Phase 3
- **Rationale**: Mobile support extends platform reach.

**O-004: Design Token Import (Figma)**
- **Where possible**, enable Figma design token import to Tekton theme format.
- **Priority**: DEFERRED to Phase 2
- **Rationale**: Designer-developer handoff improvement.

---

## SPECIFICATIONS

### Package Structure

```
packages/
├── core/                      # Types, Schemas, Token Resolution
│   ├── src/
│   │   ├── types.ts           # Blueprint, Theme, ComponentNode
│   │   ├── tokens.ts          # NEW: Token type definitions
│   │   ├── component-schemas.ts # NEW: Component interface schemas
│   │   ├── blueprint.ts       # COMPONENT_CATALOG, LAYOUTS
│   │   ├── theme.ts           # Theme loading, CSS generation
│   │   └── index.ts
│   │
├── ui/                        # NEW: Reference Implementation Library
│   ├── src/
│   │   ├── primitives/        # Base Radix wrappers
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── components/        # Composed components
│   │   │   ├── card.tsx
│   │   │   ├── form.tsx
│   │   │   └── ...
│   │   ├── lib/
│   │   │   └── utils.ts       # cn(), variant helpers
│   │   └── index.ts
│   ├── styles/
│   │   └── tokens.css         # CSS Variables template
│   │
├── mcp-server/                # MCP Tools
│   ├── src/
│   │   ├── generators/        # NEW: Code generation
│   │   │   ├── css-generator.ts    # Theme → CSS Variables
│   │   │   ├── core-resolver.ts    # Tier 1: Copy from @tekton/ui
│   │   │   └── llm-generator.ts    # Tier 2: LLM generation
│   │   └── tools/
│   │       └── export-screen.ts    # ENHANCE: Hybrid export
```

### Token Type Definitions

```typescript
// packages/core/src/tokens.ts

/**
 * Atomic Token Layer - Raw design values
 */
export interface AtomicTokens {
  color: {
    [palette: string]: {
      [shade: string]: string;  // "500": "#3b82f6"
    };
  };
  spacing: {
    [size: string]: string;     // "4": "16px"
  };
  radius: {
    [size: string]: string;     // "md": "8px"
  };
  typography: {
    [name: string]: {
      fontSize: string;
      lineHeight: string;
      fontWeight: string;
    };
  };
  shadow: {
    [name: string]: string;     // "md": "0 4px 6px -1px rgb(0 0 0 / 0.1)"
  };
}

/**
 * Semantic Token Layer - Meaning-based mappings
 */
export interface SemanticTokens {
  background: {
    page: string;               // → atomic.color.neutral.50
    surface: string;            // → atomic.color.white
    elevated: string;           // → atomic.color.white
    muted: string;              // → atomic.color.neutral.100
  };
  foreground: {
    primary: string;            // → atomic.color.neutral.900
    secondary: string;          // → atomic.color.neutral.600
    muted: string;              // → atomic.color.neutral.400
    inverse: string;            // → atomic.color.white
  };
  border: {
    default: string;            // → atomic.color.neutral.200
    muted: string;              // → atomic.color.neutral.100
    focus: string;              // → atomic.color.primary.500
  };
  // ... more semantic categories
}

/**
 * Component Token Layer - Component-specific bindings
 */
export interface ComponentTokens {
  button: {
    [variant: string]: {
      background: string;       // → semantic.* or atomic.*
      foreground: string;
      border: string;
      hover: {
        background: string;
        foreground: string;
      };
    };
  };
  input: {
    background: string;
    foreground: string;
    border: string;
    placeholder: string;
    focus: {
      border: string;
      ring: string;
    };
  };
  card: {
    background: string;
    foreground: string;
    border: string;
    shadow: string;
  };
  // ... more component tokens
}

/**
 * Extended Theme with 3-Layer Tokens
 */
export interface ThemeWithTokens extends Theme {
  tokens: {
    atomic: AtomicTokens;
    semantic: SemanticTokens;
    component: ComponentTokens;
  };
}
```

### Component Schema Definition

```typescript
// packages/core/src/component-schemas.ts

export interface PropDefinition {
  type: 'string' | 'number' | 'boolean' | 'ReactNode' | 'function';
  required?: boolean;
  default?: unknown;
  enum?: string[];
  description?: string;
}

export interface ComponentSchema {
  name: string;
  description: string;
  category: 'primitive' | 'composed' | 'layout';

  // Component API
  variants?: string[];
  sizes?: string[];
  props: Record<string, PropDefinition>;
  slots?: string[];

  // Token Bindings (CSS property → token path)
  tokenBindings: Record<string, string>;

  // Accessibility
  a11y: {
    role?: string;
    focusable?: boolean;
    ariaProps?: string[];
  };

  // Implementation Hints
  radixPrimitive?: string;      // Radix component to use
  composeFrom?: string[];       // Components to compose from
}

export const COMPONENT_SCHEMAS: Record<string, ComponentSchema> = {
  Button: {
    name: 'Button',
    description: 'Interactive button with multiple variants and sizes',
    category: 'primitive',
    variants: ['default', 'secondary', 'ghost', 'destructive', 'outline', 'link'],
    sizes: ['sm', 'default', 'lg', 'icon'],
    props: {
      children: { type: 'ReactNode', required: true },
      variant: { type: 'string', enum: ['default', 'secondary', 'ghost', 'destructive', 'outline', 'link'], default: 'default' },
      size: { type: 'string', enum: ['sm', 'default', 'lg', 'icon'], default: 'default' },
      disabled: { type: 'boolean', default: false },
      loading: { type: 'boolean', default: false },
      asChild: { type: 'boolean', default: false },
    },
    slots: ['icon-left', 'icon-right', 'loading-indicator'],
    tokenBindings: {
      backgroundColor: 'component.button.{variant}.background',
      color: 'component.button.{variant}.foreground',
      borderColor: 'component.button.{variant}.border',
      borderRadius: 'atomic.radius.{componentDefaults.borderRadius}',
      padding: 'atomic.spacing.button.{size}',
      fontSize: 'atomic.typography.button.{size}.fontSize',
      fontWeight: 'atomic.typography.button.{size}.fontWeight',
    },
    a11y: {
      role: 'button',
      focusable: true,
      ariaProps: ['aria-disabled', 'aria-busy'],
    },
    radixPrimitive: 'Button',
  },

  Input: {
    name: 'Input',
    description: 'Text input field with validation states',
    category: 'primitive',
    props: {
      type: { type: 'string', default: 'text' },
      placeholder: { type: 'string' },
      disabled: { type: 'boolean', default: false },
      error: { type: 'boolean', default: false },
      value: { type: 'string' },
      onChange: { type: 'function' },
    },
    tokenBindings: {
      backgroundColor: 'component.input.background',
      color: 'component.input.foreground',
      borderColor: 'component.input.border',
      borderRadius: 'atomic.radius.{componentDefaults.borderRadius}',
      padding: 'atomic.spacing.input',
      fontSize: 'atomic.typography.body.fontSize',
    },
    a11y: {
      role: 'textbox',
      focusable: true,
      ariaProps: ['aria-invalid', 'aria-describedby'],
    },
  },

  Card: {
    name: 'Card',
    description: 'Container component with header, content, and footer slots',
    category: 'composed',
    props: {
      children: { type: 'ReactNode', required: true },
      className: { type: 'string' },
    },
    slots: ['header', 'content', 'footer'],
    tokenBindings: {
      backgroundColor: 'component.card.background',
      color: 'component.card.foreground',
      borderColor: 'component.card.border',
      borderRadius: 'atomic.radius.{componentDefaults.borderRadius}',
      boxShadow: 'component.card.shadow',
      padding: 'atomic.spacing.card',
    },
    a11y: {
      role: 'article',
    },
    composeFrom: ['CardHeader', 'CardContent', 'CardFooter'],
  },

  // ... 17 more component schemas
};
```

### CSS Variables Generation

```typescript
// packages/mcp-server/src/generators/css-generator.ts

export function generateThemeCSS(theme: ThemeWithTokens): string {
  const { tokens, componentDefaults } = theme;

  const lines: string[] = [
    `/* Generated by Tekton - Theme: ${theme.id} */`,
    `/* Do not edit manually - regenerate from theme */`,
    '',
    ':root {',
  ];

  // Layer 1: Atomic Tokens
  lines.push('  /* === Atomic Tokens === */');

  // Colors
  for (const [palette, shades] of Object.entries(tokens.atomic.color)) {
    for (const [shade, value] of Object.entries(shades)) {
      lines.push(`  --color-${palette}-${shade}: ${value};`);
    }
  }

  // Spacing
  for (const [size, value] of Object.entries(tokens.atomic.spacing)) {
    lines.push(`  --spacing-${size}: ${value};`);
  }

  // Radius
  for (const [size, value] of Object.entries(tokens.atomic.radius)) {
    lines.push(`  --radius-${size}: ${value};`);
  }

  // Layer 2: Semantic Tokens
  lines.push('');
  lines.push('  /* === Semantic Tokens === */');

  for (const [category, values] of Object.entries(tokens.semantic)) {
    for (const [name, value] of Object.entries(values as Record<string, string>)) {
      lines.push(`  --${category}-${name}: ${resolveTokenRef(value, tokens)};`);
    }
  }

  // Layer 3: Component Tokens
  lines.push('');
  lines.push('  /* === Component Tokens === */');

  for (const [component, variants] of Object.entries(tokens.component)) {
    if (typeof variants === 'object') {
      for (const [variant, props] of Object.entries(variants)) {
        if (typeof props === 'object') {
          for (const [prop, value] of Object.entries(props as Record<string, string>)) {
            const cssVarName = `--${component}-${variant}-${prop}`;
            lines.push(`  ${cssVarName}: ${resolveTokenRef(value, tokens)};`);
          }
        }
      }
    }
  }

  lines.push('}');

  // Dark mode (if applicable)
  if (theme.darkMode) {
    lines.push('');
    lines.push('.dark {');
    // ... dark mode overrides
    lines.push('}');
  }

  return lines.join('\n');
}

function resolveTokenRef(value: string, tokens: ThemeWithTokens['tokens']): string {
  // If value is a reference like "atomic.color.blue.500"
  if (value.startsWith('atomic.') || value.startsWith('semantic.')) {
    const parts = value.split('.');
    let resolved = tokens as any;
    for (const part of parts) {
      resolved = resolved?.[part];
    }
    return resolved || value;
  }
  return value;
}
```

### Reference Implementation Example

```typescript
// packages/ui/src/primitives/button.tsx

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const buttonVariants = cva(
  // Base styles (structure, not colors)
  'inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // All colors via CSS Variables
        default: 'bg-[--button-default-background] text-[--button-default-foreground] border-[--button-default-border] hover:bg-[--button-default-hover-background]',
        secondary: 'bg-[--button-secondary-background] text-[--button-secondary-foreground] hover:bg-[--button-secondary-hover-background]',
        ghost: 'hover:bg-[--button-ghost-hover-background] hover:text-[--button-ghost-hover-foreground]',
        destructive: 'bg-[--button-destructive-background] text-[--button-destructive-foreground] hover:bg-[--button-destructive-hover-background]',
        outline: 'border border-[--button-outline-border] bg-transparent hover:bg-[--button-outline-hover-background]',
        link: 'text-[--button-link-foreground] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2 rounded-[--radius-md]',
        sm: 'h-9 px-3 rounded-[--radius-sm] text-sm',
        lg: 'h-11 px-8 rounded-[--radius-md]',
        icon: 'h-10 w-10 rounded-[--radius-md]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={props.disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

### Hybrid Export Flow

```typescript
// packages/mcp-server/src/tools/export-screen.ts (enhanced)

import { COMPONENT_SCHEMAS } from '@tekton/core';
import { resolveFromUI } from '../generators/core-resolver';
import { generateWithLLM } from '../generators/llm-generator';
import { generateThemeCSS } from '../generators/css-generator';

export async function exportScreen(input: ExportScreenInput): Promise<ExportScreenOutput> {
  const { blueprint, format, theme } = input;

  const exportedComponents: string[] = [];
  const cssVariables = generateThemeCSS(theme);

  for (const component of blueprint.components) {
    const componentCode = await resolveComponent(component, format, theme);
    exportedComponents.push(componentCode);
  }

  // Combine all components into screen
  const screenCode = assembleScreen(blueprint, exportedComponents, format);

  return {
    success: true,
    code: screenCode,
    css: cssVariables,
  };
}

async function resolveComponent(
  node: ComponentNode,
  format: ExportFormat,
  theme: ThemeWithTokens
): Promise<string> {
  const schema = COMPONENT_SCHEMAS[node.type];

  if (schema) {
    // Tier 1: Use reference implementation
    return resolveFromUI(node, schema, format);
  } else {
    // Tier 2: LLM generation for custom/composite
    return generateWithLLM(node, format, theme, {
      schemas: COMPONENT_SCHEMAS,
      examples: getTier1Examples(),
      maxRetries: 3,
    });
  }
}
```

---

## TRACEABILITY

### Requirements to Implementation Mapping

| Requirement | Implementation File | Test File |
|-------------|---------------------|-----------|
| U-001 | `core/src/component-schemas.ts` | `core/__tests__/component-schemas.test.ts` |
| U-002 | `core/src/tokens.ts` | `core/__tests__/tokens.test.ts` |
| U-003 | `mcp-server/src/generators/css-generator.ts` | `mcp-server/__tests__/css-generator.test.ts` |
| U-004 | `ui/src/primitives/*.tsx` | `ui/__tests__/accessibility.test.ts` |
| U-005 | `core/src/component-schemas.ts` | `core/__tests__/token-bindings.test.ts` |
| E-001 | `mcp-server/src/generators/css-generator.ts` | `mcp-server/__tests__/theme-export.test.ts` |
| E-002 | `mcp-server/src/generators/core-resolver.ts` | `mcp-server/__tests__/core-resolver.test.ts` |
| E-003 | `mcp-server/src/generators/llm-generator.ts` | `mcp-server/__tests__/llm-generator.test.ts` |
| E-004 | `mcp-server/src/generators/llm-generator.ts` | `mcp-server/__tests__/validation-retry.test.ts` |

### SPEC Tags for Implementation

- **[SPEC-COMPONENT-001]**: All commits related to component catalog
- **[COMPONENT-SCHEMA]**: Component interface definitions
- **[TOKEN-SYSTEM]**: 3-layer token implementation
- **[CSS-GEN]**: CSS Variables generation
- **[TIER-1]**: Reference implementation components
- **[TIER-2]**: LLM-based generation

---

## DEPENDENCIES

### Internal Dependencies
- **@tekton/core**: Base types, theme loading (extended)
- **SPEC-MCP-002**: MCP tools integration (export-screen enhancement)
- **SPEC-PLAYGROUND-001**: Preview rendering (uses generated CSS)

### External Dependencies
- **@radix-ui/react-***: Headless UI primitives
- **class-variance-authority**: ^0.7.0 - Variant management
- **clsx**: ^2.0.0 - Class name utility
- **tailwind-merge**: ^2.0.0 - Tailwind class merging
- **Tailwind CSS**: ^4.0.0 - Utility CSS framework

### New Package Dependencies
```json
{
  "@tekton/ui": {
    "@radix-ui/react-slot": "^1.0.0",
    "@radix-ui/react-button": "^1.0.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  }
}
```

---

## RISK ANALYSIS

### High-Risk Areas

**Risk 1: LLM Generation Consistency**
- **Likelihood**: MEDIUM
- **Impact**: HIGH
- **Mitigation**: Few-shot examples, strict validation, fix loop
- **Contingency**: Expand Tier 1 catalog to cover more patterns

**Risk 2: Token Naming Convention Drift**
- **Likelihood**: MEDIUM
- **Impact**: MEDIUM
- **Mitigation**: Automated naming validation, lint rules
- **Contingency**: Token migration tooling

### Medium-Risk Areas

**Risk 3: Radix Version Compatibility**
- **Likelihood**: LOW
- **Impact**: MEDIUM
- **Mitigation**: Version pinning, integration tests
- **Contingency**: Adapter layer for Radix changes

**Risk 4: CSS Variables Performance (Large Themes)**
- **Likelihood**: LOW
- **Impact**: LOW
- **Mitigation**: Token pruning, critical CSS extraction
- **Contingency**: Build-time inlining for critical components

---

## SUCCESS CRITERIA

### Implementation Success
- [ ] 20 component schemas defined with complete token bindings
- [ ] 3-layer token types implemented and documented
- [ ] CSS Variables generator produces valid CSS for all themes
- [ ] 20 reference implementations pass accessibility audit
- [ ] Hybrid export correctly routes Tier 1 vs Tier 2

### Quality Success
- [ ] Tier 1 components: 100% TypeScript strict compliance
- [ ] Tier 2 generation: 90%+ validation success rate
- [ ] All components pass WCAG 2.1 AA accessibility
- [ ] Test coverage >= 85% for all new code
- [ ] Zero hardcoded colors in component implementations

### Integration Success
- [ ] Theme switching works without code regeneration
- [ ] Generated code compiles in React/Next.js projects
- [ ] CSS Variables work in all target browsers
- [ ] SPEC-PLAYGROUND-001 renders with generated CSS

---

## REFERENCES

- [shadcn/ui](https://ui.shadcn.com/) - Reference design system architecture
- [Radix UI](https://www.radix-ui.com/) - Headless component primitives
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Style Dictionary](https://amzn.github.io/style-dictionary/) - Design token management
- [CVA](https://cva.style/) - Class variance authority
- [SPEC-MCP-002](./SPEC-MCP-002/spec.md) - MCP Server specification
- [SPEC-PLAYGROUND-001](./SPEC-PLAYGROUND-001/spec.md) - Preview playground

---

**Last Updated**: 2026-01-25
**Status**: Planned
**Version**: 1.0.0
**Next Steps**: /moai:2-run SPEC-COMPONENT-001 for DDD implementation
