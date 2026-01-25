---
id: SPEC-COMPONENT-001-A
parent: SPEC-COMPONENT-001
version: "1.0.0"
status: "planned"
created: "2026-01-25"
updated: "2026-01-25"
author: "MoAI-ADK"
priority: "HIGH"
lifecycle: "spec-anchored"
tags: ["SPEC-COMPONENT-001-A", "Token-System", "CSS-Variables", "3-Layer-Architecture"]
---

## HISTORY
- 2026-01-25 v1.0.0: Initial sub-SPEC creation - 3-Layer Token System Architecture

---

# SPEC-COMPONENT-001-A: 3-Layer Token System Architecture

## Executive Summary

**Purpose**: Establish the foundational token architecture that enables theme-agnostic component development through a three-layer token system (Atomic → Semantic → Component).

**Scope**: Design and implement:
1. Token type definitions for all three layers
2. Token resolution logic with fallback chain
3. Token validation rules
4. Dark mode token support
5. CSS Variables generation from tokens

**Priority**: HIGH - Foundation for all subsequent component work.

**Impact**: Provides the type-safe token infrastructure that:
- Eliminates hardcoded values in components
- Enables runtime theme switching
- Supports dark mode without code changes
- Guarantees token consistency across the system

**Key Design Decisions**:
- **3-Layer Architecture**: Atomic (raw values) → Semantic (meaning) → Component (usage)
- **CSS Variables Bridge**: Tokens compile to CSS Variables for runtime theming
- **Fallback Chain**: Component → Semantic → Atomic for missing tokens
- **Type Safety**: Full TypeScript type definitions for all layers

---

## ENVIRONMENT

### Current System Context

**Existing @tekton/core Theme State:**
```typescript
// Current: Basic theme with flat structure
export interface Theme {
  colorPalette: { primary, secondary, accent, neutral }
  typography: { fontFamily, fontScale, headingWeight, bodyWeight }
  componentDefaults: { borderRadius, density, contrast }
}
```

**Gap Analysis:**
- ❌ No layered token architecture
- ❌ No token-to-CSS Variables mapping
- ❌ No semantic token abstraction
- ❌ No component-specific token bindings
- ❌ No token validation or resolution logic

**Target Architecture:**
```
┌─────────────────────────────────────────────────────────┐
│  Layer 3: Component Tokens                              │
│  → button.primary.bg, input.border, card.shadow        │
│     ↓ (references)                                      │
├─────────────────────────────────────────────────────────┤
│  Layer 2: Semantic Tokens                               │
│  → background.page, foreground.primary, border.default │
│     ↓ (references)                                      │
├─────────────────────────────────────────────────────────┤
│  Layer 1: Atomic Tokens                                 │
│  → color.blue.500, spacing.4, radius.md                │
│     ↓ (compiles to)                                     │
├─────────────────────────────────────────────────────────┤
│  CSS Variables                                          │
│  → --color-blue-500, --spacing-4, --radius-md          │
└─────────────────────────────────────────────────────────┘
```

**Technology Stack:**
- **Runtime**: Node.js 20+, TypeScript 5.7+
- **Type System**: TypeScript strict mode
- **Validation**: Zod schemas for runtime validation
- **Output**: CSS Custom Properties (CSS Variables)

---

## ASSUMPTIONS

### Technical Assumptions

**A-001: CSS Variables Browser Support**
- **Assumption**: CSS Custom Properties are supported in all target browsers
- **Confidence**: HIGH
- **Evidence**: 97%+ global browser support (caniuse.com), standard since 2017
- **Risk if Wrong**: Fallback to inline styles or CSS-in-JS required
- **Validation**: Browser compatibility testing in integration tests

**A-004: Token Resolution Performance**
- **Assumption**: CSS Variables resolution at runtime has negligible performance impact
- **Confidence**: HIGH
- **Evidence**: CSS Variables resolved by browser CSS engine, highly optimized
- **Risk if Wrong**: Consider build-time token inlining for critical paths
- **Validation**: Performance benchmarks with Lighthouse, Core Web Vitals

**A-006: 3-Layer Token Granularity**
- **Assumption**: Atomic → Semantic → Component layering provides optimal balance
- **Confidence**: HIGH
- **Evidence**: Industry standard (Figma Tokens, Style Dictionary, Tailwind)
- **Risk if Wrong**: Simplify to 2 layers or add 4th layer based on usage data
- **Validation**: Token usage analysis, theme switching complexity tests

---

## REQUIREMENTS

### Ubiquitous Requirements (Always Active)

**U-002: 3-Layer Token Architecture**
- The system **shall** implement tokens in three layers: Atomic (raw values), Semantic (meaning-based), and Component (component-specific mappings).
- **Rationale**: Layered architecture enables theme flexibility while maintaining component consistency.
- **Test Strategy**: Token resolution tests across all layers, type checking, theme switching verification.

**U-003: CSS Variables Generation**
- The system **shall** generate CSS Variables from Theme tokens following the naming convention `--{layer}-{category}-{name}`.
- **Rationale**: CSS Variables enable runtime theming without code regeneration.
- **Test Strategy**: CSS output validation, variable naming consistency, CSS parsing tests.

### State-Driven Requirements (Conditional Behavior)

**S-002: Token Layer Fallback**
- **IF** component token not defined **THEN** fall back to semantic token.
- **IF** semantic token not defined **THEN** fall back to atomic token.
- **Rationale**: Graceful degradation ensures all components render even with incomplete themes.
- **Test Strategy**: Missing token tests, fallback chain verification, default value tests.

**S-003: Theme Validation**
- **IF** theme missing required tokens **THEN** return validation error with missing token list.
- **IF** theme valid **THEN** proceed with CSS generation.
- **Rationale**: Early validation prevents runtime errors and improves developer experience.
- **Test Strategy**: Incomplete theme tests, error message clarity, Zod schema validation.

**S-004: Dark Mode Support**
- **IF** theme includes dark mode tokens **THEN** generate `.dark` CSS class with overrides.
- **IF** theme is light-only **THEN** generate root-only CSS.
- **Rationale**: Flexible dark mode support without forcing all themes to implement it.
- **Test Strategy**: Dark mode CSS generation, class switching tests, token override verification.

---

## SPECIFICATIONS

### Token Type Definitions

```typescript
// packages/core/src/tokens.ts

/**
 * Atomic Token Layer - Raw design values
 * These are the foundation tokens that never reference other tokens.
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
      fontSize: string;          // "16px"
      lineHeight: string;        // "24px"
      fontWeight: string;        // "400"
    };
  };
  shadow: {
    [name: string]: string;      // "md": "0 4px 6px -1px rgb(0 0 0 / 0.1)"
  };
  transition: {
    [name: string]: string;      // "default": "150ms cubic-bezier(0.4, 0, 0.2, 1)"
  };
}

/**
 * Semantic Token Layer - Meaning-based mappings
 * These tokens reference atomic tokens and provide semantic meaning.
 */
export interface SemanticTokens {
  background: {
    page: string;                // → atomic.color.neutral.50
    surface: string;             // → atomic.color.white
    elevated: string;            // → atomic.color.white
    muted: string;               // → atomic.color.neutral.100
    inverse: string;             // → atomic.color.neutral.900
  };
  foreground: {
    primary: string;             // → atomic.color.neutral.900
    secondary: string;           // → atomic.color.neutral.600
    muted: string;               // → atomic.color.neutral.400
    inverse: string;             // → atomic.color.white
    accent: string;              // → atomic.color.primary.500
  };
  border: {
    default: string;             // → atomic.color.neutral.200
    muted: string;               // → atomic.color.neutral.100
    focus: string;               // → atomic.color.primary.500
    error: string;               // → atomic.color.red.500
  };
  surface: {
    primary: string;             // → atomic.color.white
    secondary: string;           // → atomic.color.neutral.50
    tertiary: string;            // → atomic.color.neutral.100
    inverse: string;             // → atomic.color.neutral.900
  };
}

/**
 * Component Token Layer - Component-specific bindings
 * These tokens reference semantic or atomic tokens and are used directly in components.
 */
export interface ComponentTokens {
  button: {
    [variant: string]: {
      background: string;        // → semantic.* or atomic.*
      foreground: string;
      border: string;
      hover: {
        background: string;
        foreground: string;
      };
      active: {
        background: string;
      };
      disabled: {
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
    error: {
      border: string;
      ring: string;
    };
    disabled: {
      background: string;
      foreground: string;
    };
  };
  card: {
    background: string;
    foreground: string;
    border: string;
    shadow: string;
  };
  // ... extensible for more components
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
  darkMode?: {
    tokens: {
      semantic: Partial<SemanticTokens>;
      component: Partial<ComponentTokens>;
    };
  };
}
```

### Token Resolution Logic

```typescript
// packages/core/src/token-resolver.ts

export type TokenReference = string; // "atomic.color.blue.500" | "semantic.background.page"

/**
 * Resolves a token reference to its final value
 * Supports dot-notation references and fallback chain
 */
export function resolveToken(
  ref: TokenReference,
  tokens: ThemeWithTokens['tokens'],
  visited: Set<string> = new Set()
): string {
  // Prevent circular references
  if (visited.has(ref)) {
    throw new Error(`Circular token reference detected: ${ref}`);
  }
  visited.add(ref);

  // If not a reference, return as-is (actual value)
  if (!ref.includes('.')) {
    return ref;
  }

  // Parse reference path
  const parts = ref.split('.');
  const [layer, ...path] = parts;

  // Navigate token tree
  let value: any = tokens;
  for (const part of [layer, ...path]) {
    value = value?.[part];
    if (value === undefined) {
      throw new Error(`Token not found: ${ref}`);
    }
  }

  // If value is another reference, resolve recursively
  if (typeof value === 'string' && (value.startsWith('atomic.') || value.startsWith('semantic.'))) {
    return resolveToken(value, tokens, visited);
  }

  return value;
}

/**
 * Fallback chain: Component → Semantic → Atomic → Error
 */
export function resolveWithFallback(
  componentRef: string,
  semanticRef: string,
  atomicRef: string,
  tokens: ThemeWithTokens['tokens']
): string {
  try {
    return resolveToken(componentRef, tokens);
  } catch {
    try {
      return resolveToken(semanticRef, tokens);
    } catch {
      try {
        return resolveToken(atomicRef, tokens);
      } catch {
        throw new Error(`Failed to resolve token with fallback: ${componentRef} → ${semanticRef} → ${atomicRef}`);
      }
    }
  }
}
```

### CSS Variables Generation

```typescript
// packages/core/src/css-generator.ts

export function generateThemeCSS(theme: ThemeWithTokens): string {
  const { tokens } = theme;
  const lines: string[] = [
    `/* Generated by Tekton - Theme: ${theme.id} */`,
    `/* Do not edit manually - regenerate from theme definition */`,
    '',
    ':root {',
  ];

  // Layer 1: Atomic Tokens
  lines.push('  /* === Layer 1: Atomic Tokens === */');

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

  // Typography
  for (const [name, props] of Object.entries(tokens.atomic.typography)) {
    lines.push(`  --typography-${name}-size: ${props.fontSize};`);
    lines.push(`  --typography-${name}-line-height: ${props.lineHeight};`);
    lines.push(`  --typography-${name}-weight: ${props.fontWeight};`);
  }

  // Shadow
  for (const [name, value] of Object.entries(tokens.atomic.shadow)) {
    lines.push(`  --shadow-${name}: ${value};`);
  }

  // Layer 2: Semantic Tokens
  lines.push('');
  lines.push('  /* === Layer 2: Semantic Tokens === */');

  for (const [category, values] of Object.entries(tokens.semantic)) {
    for (const [name, ref] of Object.entries(values as Record<string, string>)) {
      const resolved = resolveToken(ref, tokens);
      lines.push(`  --${category}-${name}: ${resolved};`);
    }
  }

  // Layer 3: Component Tokens
  lines.push('');
  lines.push('  /* === Layer 3: Component Tokens === */');

  lines.push(...generateComponentCSS(tokens.component, tokens));

  lines.push('}');

  // Dark mode
  if (theme.darkMode) {
    lines.push('');
    lines.push('.dark {');
    lines.push('  /* === Dark Mode Overrides === */');

    if (theme.darkMode.tokens.semantic) {
      for (const [category, values] of Object.entries(theme.darkMode.tokens.semantic)) {
        for (const [name, ref] of Object.entries(values as Record<string, string>)) {
          const resolved = resolveToken(ref, {
            ...tokens,
            semantic: { ...tokens.semantic, ...theme.darkMode.tokens.semantic }
          });
          lines.push(`  --${category}-${name}: ${resolved};`);
        }
      }
    }

    if (theme.darkMode.tokens.component) {
      lines.push(...generateComponentCSS(theme.darkMode.tokens.component, tokens));
    }

    lines.push('}');
  }

  return lines.join('\n');
}

function generateComponentCSS(
  componentTokens: ComponentTokens,
  tokens: ThemeWithTokens['tokens']
): string[] {
  const lines: string[] = [];

  for (const [component, variants] of Object.entries(componentTokens)) {
    if (typeof variants === 'object' && variants !== null) {
      for (const [variant, props] of Object.entries(variants)) {
        if (typeof props === 'object' && props !== null) {
          flattenTokens(props, `${component}-${variant}`, tokens, lines);
        }
      }
    }
  }

  return lines;
}

function flattenTokens(
  obj: any,
  prefix: string,
  tokens: ThemeWithTokens['tokens'],
  lines: string[]
): void {
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      flattenTokens(value, `${prefix}-${key}`, tokens, lines);
    } else if (typeof value === 'string') {
      const resolved = resolveToken(value, tokens);
      lines.push(`  --${prefix}-${key}: ${resolved};`);
    }
  }
}
```

### Token Validation Schema

```typescript
// packages/core/src/token-validation.ts

import { z } from 'zod';

const AtomicTokensSchema = z.object({
  color: z.record(z.record(z.string())),
  spacing: z.record(z.string()),
  radius: z.record(z.string()),
  typography: z.record(z.object({
    fontSize: z.string(),
    lineHeight: z.string(),
    fontWeight: z.string(),
  })),
  shadow: z.record(z.string()),
  transition: z.record(z.string()).optional(),
});

const SemanticTokensSchema = z.object({
  background: z.object({
    page: z.string(),
    surface: z.string(),
    elevated: z.string(),
    muted: z.string(),
    inverse: z.string(),
  }),
  foreground: z.object({
    primary: z.string(),
    secondary: z.string(),
    muted: z.string(),
    inverse: z.string(),
    accent: z.string(),
  }),
  border: z.object({
    default: z.string(),
    muted: z.string(),
    focus: z.string(),
    error: z.string(),
  }),
  surface: z.object({
    primary: z.string(),
    secondary: z.string(),
    tertiary: z.string(),
    inverse: z.string(),
  }),
});

const ComponentTokensSchema = z.record(z.any()); // Flexible for extensibility

export const ThemeWithTokensSchema = z.object({
  tokens: z.object({
    atomic: AtomicTokensSchema,
    semantic: SemanticTokensSchema,
    component: ComponentTokensSchema,
  }),
  darkMode: z.object({
    tokens: z.object({
      semantic: SemanticTokensSchema.partial(),
      component: ComponentTokensSchema.partial(),
    }),
  }).optional(),
});

export function validateTheme(theme: unknown): { valid: boolean; errors?: string[] } {
  const result = ThemeWithTokensSchema.safeParse(theme);
  if (!result.success) {
    return {
      valid: false,
      errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
    };
  }
  return { valid: true };
}
```

---

## TRACEABILITY

### Requirements to Implementation Mapping

| Requirement | Implementation File | Test File |
|-------------|---------------------|-----------|
| U-002 | `core/src/tokens.ts` | `core/__tests__/tokens.test.ts` |
| U-003 | `core/src/css-generator.ts` | `core/__tests__/css-generator.test.ts` |
| S-002 | `core/src/token-resolver.ts` | `core/__tests__/token-fallback.test.ts` |
| S-003 | `core/src/token-validation.ts` | `core/__tests__/token-validation.test.ts` |
| S-004 | `core/src/css-generator.ts` | `core/__tests__/dark-mode.test.ts` |

### SPEC Tags for Implementation

- **[SPEC-COMPONENT-001-A]**: Token system implementation
- **[TOKEN-TYPES]**: Type definitions
- **[TOKEN-RESOLUTION]**: Resolution logic
- **[CSS-GENERATION]**: CSS Variables generation
- **[TOKEN-VALIDATION]**: Validation rules

---

## DEPENDENCIES

### Internal Dependencies
- **@tekton/core**: Base package (will extend existing types)

### External Dependencies
- **zod**: ^3.22.0 - Runtime schema validation
- **TypeScript**: ^5.7.0 - Type system

### Dependents (Blocks)
- **SPEC-COMPONENT-001-B**: Requires token types for schema definitions
- **SPEC-COMPONENT-001-C**: Requires token types for component implementation
- **SPEC-COMPONENT-001-D**: Requires CSS generation for export pipeline

---

## RISK ANALYSIS

### High-Risk Areas

**Risk 1: Token Naming Convention Drift**
- **Likelihood**: MEDIUM
- **Impact**: MEDIUM
- **Mitigation**: Automated linting, strict naming validation
- **Contingency**: Token migration tooling

**Risk 2: Circular Token References**
- **Likelihood**: LOW
- **Impact**: HIGH
- **Mitigation**: Circular reference detection in resolver
- **Contingency**: Clear error messages with reference chain

### Medium-Risk Areas

**Risk 3: CSS Variables Performance (Large Themes)**
- **Likelihood**: LOW
- **Impact**: LOW
- **Mitigation**: Token pruning, critical CSS extraction
- **Contingency**: Build-time inlining for performance-critical components

---

## SUCCESS CRITERIA

### Implementation Success
- [ ] Token type definitions compile with TypeScript strict mode
- [ ] Token resolver handles all valid references
- [ ] Token resolver detects and reports circular references
- [ ] CSS Variables generator produces valid CSS
- [ ] Dark mode CSS generation works correctly

### Quality Success
- [ ] All token functions have TypeScript strict compliance
- [ ] Zod schemas validate all token structures
- [ ] Test coverage >= 90% for token logic
- [ ] Token resolution performance < 1ms per token
- [ ] Zero hardcoded values in generated CSS

### Integration Success
- [ ] Token types importable in dependent SPECs
- [ ] CSS Variables work in all target browsers
- [ ] Theme switching works without page reload
- [ ] Dark mode toggle works seamlessly

---

## REFERENCES

- [Style Dictionary](https://amzn.github.io/style-dictionary/) - Design token management patterns
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) - CSS Variables specification
- [Figma Tokens](https://tokens.studio/) - Token architecture inspiration
- [Tailwind CSS Theming](https://tailwindcss.com/docs/customizing-colors) - Token naming conventions

---

**Last Updated**: 2026-01-25
**Status**: Planned
**Version**: 1.0.0
**Parent SPEC**: SPEC-COMPONENT-001
**Next Steps**: /moai:2-run SPEC-COMPONENT-001-A
