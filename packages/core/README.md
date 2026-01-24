# @tekton/core

**Minimal design system pipeline** - Theme → Blueprint → Screen generation

## Overview

89,993 LOC → **742 LOC** (99.2% reduction)

This package replaces 14 bloated packages with a single, focused implementation of the core pipeline.

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

## API Reference

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
@tekton/core (742 LOC)
├── types.ts      (94 LOC)  - Core type definitions
├── theme.ts      (131 LOC) - Theme loading & CSS generation
├── blueprint.ts  (169 LOC) - Blueprint creation & validation
├── render.ts     (297 LOC) - Template-based JSX generation
└── index.ts      (51 LOC)  - Public API exports
```

### Design Decisions

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

Current: **21 tests**, **83% coverage**

## License

MIT
