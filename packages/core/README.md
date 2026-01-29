# @tekton/core

**Minimal design system pipeline** - Theme → Blueprint → Screen generation

## Overview

89,993 LOC → **1,526 LOC** (98.3% reduction)

This package replaces 14 bloated packages with a single, focused implementation of the core pipeline.

### NEW: Screen Generation Pipeline (SPEC-LAYOUT-002) ✅

Transform JSON screen definitions into production-ready React components with multiple CSS frameworks.

**Features:**

- 🎯 **JSON Schema-based definitions** - Type-safe with TypeScript and Zod validation
- 🔄 **Token resolver pipeline** - Automatic layout and component token resolution
- 🎨 **Multiple CSS outputs** - CSS-in-JS (styled-components, Emotion) and Tailwind support
- ⚛️ **React component generation** - TypeScript React functional components
- 🤖 **MCP server integration** - 3 tools for Claude Code/Desktop LLM usage
- ✅ **85%+ test coverage** - TRUST 5 framework compliant

**Quick Start:**

```typescript
import {
  validateScreenDefinition,
  resolveScreen,
  generateReactComponent,
} from '@tekton/core/screen-generation';

const validation = validateScreenDefinition(screenDef);
const resolved = await resolveScreen(screenDef);
const result = generateReactComponent(resolved);
```

**📚 Documentation:**

- [Screen Generation README](./src/screen-generation/README.md) - Complete overview
- [Phase 1: Schema & Validation](./src/screen-generation/PHASE-1.md)
- [Phase 2: Resolver Pipeline](./src/screen-generation/PHASE-2.md)
- [Phase 3: Output Generators](./src/screen-generation/PHASE-3.md)
- [API Reference](./src/screen-generation/API.md)
- [Integration Guide](./src/screen-generation/INTEGRATION.md)
- [MCP Tools](../mcp-server/SCREEN-TOOLS.md)

### NEW: Responsive Web Enhancement (SPEC-LAYOUT-003) ✅

Advanced responsive design system with xl/2xl breakpoints, Container Queries, and Orientation support.

**Features:**

- 📱 **Extended Breakpoints** - xl (1280px), 2xl (1536px) for large displays
- 📦 **Container Queries** - Component-level responsiveness independent of viewport
- 🔄 **Orientation Support** - Portrait/Landscape optimizations for tablets
- 🎯 **27 Layout Tokens Updated** - All shells, pages, and sections enhanced
- ✅ **100% Test Coverage** - 1041/1041 tests passing
- 🌐 **Browser Compatibility** - Chrome 105+, Safari 16+, Firefox 110+ with fallback

**Quick Start:**

```typescript
import {
  generateResponsiveCSS,
  generateContainerQueryCSS,
  generateOrientationCSS,
} from '@tekton/core/layout-tokens';

// Responsive breakpoints including xl/2xl
const responsive = generateResponsiveCSS({
  default: { gridColumns: 1 },
  md: { gridColumns: 2 },
  xl: { gridColumns: 4 },
  '2xl': { gridColumns: 6 },
});

// Container Queries for component-level responsiveness
const container = generateContainerQueryCSS({
  name: 'card-grid',
  type: 'inline-size',
  breakpoints: {
    md: { minWidth: 480, css: { 'grid-template-columns': 'repeat(2, 1fr)' } },
    lg: { minWidth: 640, css: { 'grid-template-columns': 'repeat(3, 1fr)' } },
  },
});

// Orientation support for tablets
const orientation = generateOrientationCSS({
  portrait: { gridColumns: 1 },
  landscape: { gridColumns: 2 },
});
```

**📚 Documentation:**

- [Responsive Design Guide](../../docs/guides/responsive-design.md)
- [Browser Compatibility Matrix](../../docs/guides/browser-compatibility.md)
- [SPEC-LAYOUT-003 Specification](../../.moai/specs/SPEC-LAYOUT-003/spec.md)
- [Acceptance Report](../../.moai/specs/SPEC-LAYOUT-003/acceptance.md)

## Installation

```bash
pnpm add @tekton/core
```

## Quick Start

```typescript
import { loadTheme, createBlueprint, render } from '@tekton/core';

// 1. Load theme
const theme = loadTheme('calm-wellness');

// 2. Create blueprint
const blueprint = createBlueprint({
  name: 'Dashboard',
  themeId: theme.id,
  layout: 'dashboard',
  components: [
    { type: 'Heading', props: { level: 1 }, children: ['Welcome'] },
    {
      type: 'Card',
      children: [
        { type: 'Text', children: ['Your stats here'] },
        { type: 'Button', props: { variant: 'primary' }, children: ['View More'] },
      ],
    },
  ],
});

// 3. Render to JSX
const result = render(blueprint);
console.log(result.code);
```

## Features

### 🎨 3-Layer Token System (NEW)

Professional design token architecture with atomic, semantic, and component layers:

```typescript
import type { ThemeWithTokens } from '@tekton/core';
import { resolveToken, generateThemeCSS } from '@tekton/core';

// Define theme with 3-layer token structure
const theme: ThemeWithTokens = {
  id: 'my-theme',
  name: 'My Theme',
  tokens: {
    // Layer 1: Atomic Tokens (raw values)
    atomic: {
      color: {
        blue: { '500': '#3b82f6', '600': '#2563eb' },
        neutral: { '50': '#f9fafb', '900': '#111827' },
      },
      spacing: { '4': '16px', '8': '32px' },
      radius: { md: '8px' },
    },

    // Layer 2: Semantic Tokens (meaning-based)
    semantic: {
      background: {
        page: 'atomic.color.neutral.50',
        surface: '#ffffff',
      },
      foreground: {
        primary: 'atomic.color.neutral.900',
        accent: 'atomic.color.blue.500',
      },
    },

    // Layer 3: Component Tokens (component-specific)
    component: {
      button: {
        primary: {
          background: 'semantic.foreground.accent',
          foreground: '#ffffff',
          hover: { background: 'atomic.color.blue.600' },
        },
      },
    },
  },
};

// Resolve token with automatic reference resolution
const color = resolveToken('component.button.primary.background', theme.tokens);
// → '#3b82f6' (semantic.foreground.accent → atomic.color.blue.500)

// Generate CSS Variables
const css = generateThemeCSS(theme);
// Outputs:
// :root {
//   --color-blue-500: #3b82f6;
//   --background-page: #f9fafb;
//   --button-primary-background: #3b82f6;
// }
```

**Key Features:**

- ✅ **3-Layer Architecture**: Atomic → Semantic → Component
- ✅ **Automatic Resolution**: Multi-level reference resolution with circular detection
- ✅ **Fallback Chain**: Component → Semantic → Atomic
- ✅ **Type Safety**: Full TypeScript support with Zod validation
- ✅ **Dark Mode**: Built-in dark mode token overrides
- ✅ **CSS Variables**: Auto-generate CSS custom properties
- ✅ **Zero Dependencies**: Only Zod for runtime validation

### 🎯 Token Resolution

```typescript
import { resolveToken, resolveWithFallback } from '@tekton/core';

// Simple resolution
resolveToken('atomic.color.blue.500', tokens);
// → '#3b82f6'

// Multi-level resolution
resolveToken('component.button.primary.background', tokens);
// → '#3b82f6' (resolves through semantic layer)

// Fallback chain (most specific to least specific)
resolveWithFallback(
  'component.button.custom.background', // Try component first
  'semantic.foreground.accent', // Fallback to semantic
  'atomic.color.blue.500', // Final fallback to atomic
  tokens
);
```

### 🌓 Dark Mode Support

```typescript
const theme: ThemeWithTokens = {
  // ... base theme ...
  darkMode: {
    tokens: {
      semantic: {
        background: {
          page: 'atomic.color.neutral.900',
          surface: 'atomic.color.neutral.800',
        },
      },
      component: {
        button: {
          primary: {
            background: 'atomic.color.blue.400',
          },
        },
      },
    },
  },
};

// Generate CSS with dark mode
const css = generateThemeCSS(theme);
// Outputs:
// :root { /* light mode variables */ }
// .dark { /* dark mode overrides */ }
```

### ✅ Runtime Validation

```typescript
import { validateTheme } from '@tekton/core';

const result = validateTheme(myTheme);

if (!result.valid) {
  console.error('Validation errors:', result.errors);
  // → ['tokens.atomic.color: Required', 'tokens.semantic.background.page: Required']
}
```

## API Reference

### Token Module

```typescript
// Type definitions
import type { AtomicTokens, SemanticTokens, ComponentTokens, ThemeWithTokens } from '@tekton/core';

// Token resolution
import { resolveToken, resolveWithFallback } from '@tekton/core';

// CSS generation
import { generateThemeCSS } from '@tekton/core';

// Validation
import { validateTheme } from '@tekton/core';
```

#### `resolveToken(ref, tokens)`

Resolves a token reference to its final value with multi-level resolution.

**Parameters:**

- `ref: string` - Token reference in dot notation (e.g., `'atomic.color.blue.500'`)
- `tokens: ThemeWithTokens['tokens']` - Theme token structure

**Returns:** `string` - Resolved token value

**Throws:**

- `Error` - If token not found
- `Error` - If circular reference detected

**Examples:**

```typescript
// Direct atomic token
resolveToken('atomic.color.blue.500', tokens);
// → '#3b82f6'

// Semantic token (references atomic)
resolveToken('semantic.background.page', tokens);
// → '#f9fafb' (via atomic.color.neutral.50)

// Component token (multi-level resolution)
resolveToken('component.button.primary.background', tokens);
// → '#3b82f6' (semantic.foreground.accent → atomic.color.blue.500)

// Direct value (returned as-is)
resolveToken('#3b82f6', tokens);
// → '#3b82f6'
```

#### `resolveWithFallback(componentRef, semanticRef, atomicRef, tokens)`

Resolves token with graceful fallback: Component → Semantic → Atomic.

**Parameters:**

- `componentRef: string` - Component-level token reference
- `semanticRef: string` - Semantic-level token reference (fallback)
- `atomicRef: string` - Atomic-level token reference (final fallback)
- `tokens: ThemeWithTokens['tokens']` - Theme token structure

**Returns:** `string` - Resolved value from first successful resolution

**Throws:** `Error` - If all fallback attempts fail

**Example:**

```typescript
resolveWithFallback(
  'component.button.custom.background', // Missing (skipped)
  'semantic.foreground.accent', // Exists → returns '#3b82f6'
  'atomic.color.blue.500', // Not evaluated
  tokens
);
```

#### `generateThemeCSS(theme)`

Generates complete CSS with CSS Variables from theme tokens.

**Parameters:**

- `theme: ThemeWithTokens` - Theme with 3-layer token structure

**Returns:** `string` - Generated CSS with `:root` and `.dark` selectors

**Example:**

```typescript
const css = generateThemeCSS(theme);

// Output structure:
// :root {
//   /* Layer 1: Atomic Tokens */
//   --color-blue-500: #3b82f6;
//   --spacing-4: 16px;
//
//   /* Layer 2: Semantic Tokens */
//   --background-page: #f9fafb;
//   --foreground-accent: #3b82f6;
//
//   /* Layer 3: Component Tokens */
//   --button-primary-background: #3b82f6;
//   --button-primary-hover-background: #2563eb;
// }
//
// .dark {
//   --background-page: #111827;
// }
```

#### `validateTheme(theme)`

Validates theme with token structure using Zod schemas.

**Parameters:**

- `theme: unknown` - Theme object to validate

**Returns:** `ValidationResult`

```typescript
interface ValidationResult {
  valid: boolean;
  errors?: string[]; // Present if valid is false
}
```

**Example:**

```typescript
const result = validateTheme(myTheme);

if (result.valid) {
  console.log('✅ Theme is valid');
} else {
  console.error('❌ Validation failed:');
  result.errors?.forEach(err => console.error(`  - ${err}`));
}
```

### Theme Module

```typescript
// Load theme by ID
const theme = loadTheme('calm-wellness');

// List all available themes
const themes = listThemes();

// Check if theme is built-in
const isBuiltin = isBuiltinTheme('calm-wellness'); // true

// Generate CSS variables from theme
const cssVars = generateCSSVariables(theme);

// Convert OKLCH to CSS
const css = oklchToCSS({ l: 0.7, c: 0.1, h: 170 }); // 'oklch(0.7 0.1 170)'
```

### Blueprint Module

```typescript
// Create blueprint
const blueprint = createBlueprint({
  name: 'Page Name',
  description: 'Optional description',
  themeId: 'calm-wellness',
  layout: 'single-column', // or 'two-column', 'sidebar-left', 'dashboard', 'landing'
  components: [{ type: 'Button', children: ['Click'] }],
});

// Validate blueprint
const validation = validateBlueprint(blueprint);
if (!validation.valid) {
  console.error(validation.errors);
}

// Check component validity
isValidComponent('Button'); // true
isValidComponent('FakeComponent'); // false

// Get layout slots
const slots = getLayoutSlots('dashboard');
// [{ name: 'header', required: true }, { name: 'sidebar', required: true }, ...]
```

### Render Module

```typescript
// Render blueprint to JSX
const result = render(blueprint);
if (result.success) {
  console.log(result.code);
}

// Render with theme CSS variables included
const resultWithTheme = renderWithTheme(blueprint);

// Render options
const result = render(blueprint, {
  typescript: true, // Generate TypeScript (default: true)
  indent: 2, // Indentation spaces (default: 2)
  semicolons: true, // Include semicolons (default: true)
});

// Quick render single component
const jsx = renderSingleComponent({ type: 'Button', children: ['Click'] });

// Render multiple components without layout
const jsx = renderComponents([
  { type: 'Heading', children: ['Title'] },
  { type: 'Text', children: ['Content'] },
]);
```

## CSS Variables Naming Convention

The token system generates CSS Variables with a consistent naming pattern:

### Atomic Tokens

```css
--color-{palette}-{shade}: {value}
--spacing-{size}: {value}
--radius-{size}: {value}
--typography-{name}-size: {value}
--typography-{name}-line-height: {value}
--typography-{name}-weight: {value}
--shadow-{name}: {value}
--transition-{name}: {value}
```

**Examples:**

```css
--color-blue-500: #3b82f6;
--color-neutral-50: #f9fafb;
--spacing-4: 16px;
--radius-md: 8px;
--typography-body-size: 16px;
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
```

### Semantic Tokens

```css
--{category}-{name}: {value}
```

**Examples:**

```css
--background-page: #f9fafb;
--foreground-primary: #111827;
--border-default: #e5e7eb;
--surface-primary: #ffffff;
```

### Component Tokens

```css
--{component}-{variant}-{property}: {value}
--{component}-{variant}-{state}-{property}: {value}
```

**Examples:**

```css
/* Button primary variant */
--button-primary-background: #3b82f6;
--button-primary-foreground: #ffffff;
--button-primary-hover-background: #2563eb;
--button-primary-disabled-foreground: #9ca3af;

/* Input component */
--input-background: #ffffff;
--input-border: #e5e7eb;
--input-focus-ring: #3b82f6;
--input-error-border: #ef4444;
```

### Dark Mode Overrides

Dark mode uses the same variable names but scoped to `.dark` class:

```css
.dark {
  --background-page: #111827;
  --foreground-primary: #f9fafb;
  --button-primary-background: #60a5fa;
}
```

**Usage in Components:**

```css
.button-primary {
  background: var(--button-primary-background);
  color: var(--button-primary-foreground);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
}

.button-primary:hover {
  background: var(--button-primary-hover-background);
}

.button-primary:disabled {
  background: var(--button-primary-disabled-background);
  color: var(--button-primary-disabled-foreground);
}
```

## Migration Guide

### From Old Theme System

**Before (0.1.0):**

```typescript
const theme = loadTheme('calm-wellness');
const cssVars = generateCSSVariables(theme);
```

**After (0.2.0 with Token System):**

```typescript
import type { ThemeWithTokens } from '@tekton/core';
import { generateThemeCSS } from '@tekton/core';

// Old themes still work (backward compatible)
const theme = loadTheme('calm-wellness');

// New: Extend with token system
const themeWithTokens: ThemeWithTokens = {
  ...theme,
  tokens: {
    atomic: {
      /* ... */
    },
    semantic: {
      /* ... */
    },
    component: {
      /* ... */
    },
  },
};

const css = generateThemeCSS(themeWithTokens);
```

### Key Changes

1. **New Token Structure**: 3-layer architecture (atomic/semantic/component)
2. **Type Safety**: Full TypeScript support with `ThemeWithTokens` interface
3. **Runtime Validation**: Zod schema validation with `validateTheme()`
4. **CSS Generation**: New `generateThemeCSS()` replaces `generateCSSVariables()`
5. **Dark Mode**: Built-in dark mode support via `darkMode` property

### Breaking Changes

None - the token system is an additive feature in 0.2.0.

## Available Layouts

| Layout          | Slots                           |
| --------------- | ------------------------------- |
| `single-column` | header?, main, footer?          |
| `two-column`    | header?, left, right, footer?   |
| `sidebar-left`  | header?, sidebar, main, footer? |
| `sidebar-right` | header?, main, sidebar, footer? |
| `dashboard`     | header, sidebar, main, footer?  |
| `landing`       | hero, features?, cta?, footer?  |

## Available Components

Button, Input, Card, Text, Heading, Image, Link, List, Form, Modal, Tabs, Table, Badge, Avatar, Dropdown, Checkbox, Radio, Switch, Slider, Progress

## Built-in Themes

- `calm-wellness` - Soft, meditative atmosphere
- `dynamic-fitness` - Energetic, bold design
- `korean-fintech` - Clean, trustworthy finance
- `media-streaming` - Dark, immersive entertainment
- `premium-editorial` - Elegant, typography-focused
- `saas-dashboard` - Professional, data-rich
- `saas-modern` - Clean, modern SaaS
- `tech-startup` - Bold, innovative tech
- `warm-humanist` - Friendly, approachable

## Architecture

```
@tekton/core (1,526 LOC)
├── Core Pipeline (742 LOC)
│   ├── types.ts      (94 LOC)  - Core type definitions
│   ├── theme.ts      (131 LOC) - Theme loading & CSS generation
│   ├── blueprint.ts  (169 LOC) - Blueprint creation & validation
│   ├── render.ts     (297 LOC) - Template-based JSX generation
│   └── index.ts      (51 LOC)  - Public API exports
│
└── Token System (784 LOC) [NEW in 0.2.0]
    ├── tokens.ts           (189 LOC) - 3-layer token type definitions
    ├── token-resolver.ts   (146 LOC) - Token resolution & fallback logic
    ├── token-validation.ts (176 LOC) - Zod schema validation
    └── css-generator.ts    (273 LOC) - CSS Variables generation
```

### Design Decisions

**3-Layer Token Architecture**:

- **Atomic Layer**: Raw design values (colors, spacing) - foundation
- **Semantic Layer**: Meaning-based mappings (background.page, foreground.primary) - context
- **Component Layer**: Component-specific bindings (button.primary.background) - usage

Benefits:

- Clear separation of concerns
- Maintainable theming system
- Type-safe token references
- Automatic dark mode support
- Scalable to complex design systems

**Template-based rendering** (not AST-based):

- Zero dependencies (no Babel, Prettier)
- Faster execution
- Easier to understand and debug
- Sufficient for JSX generation use case

**What was removed**:

- Babel AST builders
- Prettier formatting
- Slot registries (Global/Local)
- Semantic scoring engine
- Safety protocols (4 validators)
- MCP server infrastructure
- 13 unnecessary packages

## Testing

```bash
pnpm test           # Run tests
pnpm test:watch     # Watch mode
pnpm test:coverage  # Coverage report
```

Current: **132 tests**, **96.37% coverage**

### Test Coverage by Module

| Module           | Tests | Coverage |
| ---------------- | ----- | -------- |
| Token Types      | 28    | 100%     |
| Token Resolution | 35    | 98.5%    |
| Token Validation | 32    | 97.2%    |
| CSS Generation   | 37    | 95.8%    |
| Core Pipeline    | -     | 83%      |

## Performance

Token system is highly optimized for production use:

- **Token Resolution**: < 1ms per token (avg 0.3ms)
- **Multi-level Resolution**: < 1ms for deep references
- **CSS Generation**: ~5ms for complete theme
- **Validation**: < 10ms for full theme structure

Benchmarked on Node.js 20, Apple M1.

## License

MIT
