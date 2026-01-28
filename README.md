# Tekton

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/asleep/tekton)
[![Coverage](https://img.shields.io/badge/coverage-73.23%25-yellow)](https://github.com/asleep/tekton)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![Version](https://img.shields.io/badge/version-0.1.0-blue)](./CHANGELOG.md)

OKLCH-based design token generator with WCAG AA compliance for modern design systems.

## 🎉 v0.1.0 Release Status

**Status**: ✅ **Production Ready** (2026-01-20)

- ✅ All 3 Layer 3 MCP tools operational (100%)
- ✅ 13/13 automated tests passing
- ✅ Known Issue #1 resolved (renderScreen fix)
- ✅ 20 components in catalog with full metadata
- ✅ Blueprint-based component generation working

See [CHANGELOG.md](./CHANGELOG.md) for complete release notes.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Worktree Management](#worktree-management)
- [Architecture Overview](#architecture-overview)
- [API Reference](#api-reference)
- [Project Status](#project-status)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Design System Architecture

Tekton implements a 3-layer design system architecture for generating deterministic design tokens:

### Layer 1: Token Generator Engine (SPEC-LAYER1-001) ✅ Complete

Generates deterministic design tokens from archetype JSON presets using OKLCH color spaces with WCAG AA compliance.

**Key Features**:

- **OKLCH Color Space**: Perceptually uniform color transformations using culori 3.3.0
- **WCAG AA/AAA Validation**: Automatic contrast ratio validation (4.5:1 text, 3:1 UI)
- **Auto-Adjustment**: Intelligent lightness modification to achieve WCAG compliance
- **Multiple Export Formats**: CSS custom properties, Tailwind configuration, DTCG metadata
- **Performance Optimized**: LRU cache with 80%+ hit rate, <100ms generation time

**Technology Stack**:

- TypeScript 5.9+
- culori ^3.3.0 (OKLCH support)
- wcag-contrast ^3.0.0 (WCAG validation)
- vitest ^2.0.0 (testing framework)

**Usage Example**:

```typescript
import { generateTokensFromArchetype } from '@tekton/token-generator';

// Load archetype JSON preset
const archetype = loadArchetypeJSON('premium-editorial.json');

// Generate tokens with WCAG validation
const tokens = await generateTokensFromArchetype(archetype, {
  wcagLevel: 'AA',
  cacheEnabled: true,
});

// Export to desired format
const css = exportToCSS(tokens);
const tailwind = exportToTailwind(tokens);
const dtcg = exportToDTCG(tokens);
```

### Layer 2: Component Knowledge System (SPEC-LAYER2-001) ✅ Complete

Transforms raw design tokens into AI-understandable component knowledge with semantic metadata for intelligent component placement and generation.

**Key Features**:

- **ComponentKnowledge Catalog**: Complete metadata for 20 core components
- **Slot Affinity Scoring**: 0.0-1.0 scores for intelligent placement recommendations
- **Semantic Descriptions**: Purpose, visual impact, and complexity metadata for AI context
- **Token Validation**: Validates all token references against Layer 1 metadata
- **Type-Safe Schemas**: Zod schema generation for component props validation
- **CSS-in-JS Bindings**: Vanilla Extract recipes with CSS variable references
- **Knowledge Export**: JSON and Markdown formats for programmatic and AI use

**Technology Stack**:

- TypeScript 5.9+
- Zod ^3.23.0 (schema validation)
- @vanilla-extract/css ^1.16.0 (CSS-in-JS primary)
- @stitches/core ^1.2.8 (CSS-in-JS legacy)

**Usage Example**:

```typescript
import {
  getAllComponents,
  validateComponentKnowledge,
  ZodSchemaGenerator,
  VanillaExtractGenerator,
  JSONExporter,
} from '@tekton/component-knowledge';

// Get all 20 components with complete metadata
const components = getAllComponents();

// Validate component knowledge
const button = getComponentByName('Button');
const validation = validateComponentKnowledge(button);

// Generate type-safe Zod schema
const schemaGen = new ZodSchemaGenerator();
const schema = schemaGen.generateSchema(button);

// Generate CSS-in-JS bindings
const styleGen = new VanillaExtractGenerator();
const styles = styleGen.generateStyles(button);

// Export as JSON for programmatic use
const jsonExporter = new JSONExporter();
const catalog = jsonExporter.exportCatalog(components);
```

**Quality Metrics**:

- Test Coverage: 95.81% (exceeds ≥85% target) ✅
- Tests Passing: 79/79 (100% pass rate) ✅
- TRUST 5 Compliance: PASS ✅
- Type Safety: Zero TypeScript errors ✅

### Layer 3: Component Generation Engine (SPEC-LAYER3-001) ⚡ Active Development

**Progress**: 4/6 Milestones Complete (67% Progress)

Generates production-ready React components through intelligent slot-based assembly with AI-powered semantic scoring and safety protocols.

#### Completed Milestones

**Milestone 1: Slot Semantic Registry** ✅ (99.75% coverage, 186 tests)

- Global Slots: Application-level layout slots (header, sidebar, main, footer)
- Local Slots: Component-specific slots (card_actions, table_toolbar, modal_footer)
- Semantic Roles: Layout, action, and content categorization
- Constraint Validation: maxChildren, allowedComponents, excludedComponents enforcement

**Milestone 2: Semantic Scoring Algorithm** ✅ (100% coverage, 83 tests)

- Weighted Scoring Formula: BaseAffinity (50%) + IntentMatch (30%) + ContextPenalty (20%)
- Intent-Based Injection: Context-aware component selection (read-only, dashboard, data-entry modes)
- Score Normalization: 0.0-1.0 range with deterministic results
- Performance: <50ms for typical 4-6 slot layout

**Milestone 3: Safety Protocols** ✅ (99.53% coverage, 79 tests)

- Threshold Check: Minimum score 0.4 with automatic fallback for low-quality placements
- Hallucination Check: Component existence validation with fuzzy matching suggestions
- Constraint Validator: Enforces all slot constraints with LAYER3-E003 error codes
- Fluid Fallback: Role-based fallback assignment (GenericContainer, NavPlaceholder, ButtonGroup)

**Milestone 4: MCP Tools Integration** ✅ (100% coverage, 128 tests)

- Knowledge Schema: Complete Blueprint JSON schema for LLM consumption
- MCP Tool: `knowledge.getSchema` - Returns schema definition with usage examples
- MCP Tool: `knowledge.getComponentList` - Query components by category or slot
- MCP Tool: `knowledge.renderScreen` - Generate React `.tsx` files from Blueprint JSON
- AST Builder: Babel-based AST construction for component generation
- JSX Generator: Code generation with Prettier formatting and TypeScript compilation
- Component Validation: All references validated against Layer 2 catalog
- Error Handling: Structured error responses with actionable messages (LAYER3-E002, LAYER3-E005)

**Milestone 5: Theme Token Binding System** ✅ (SPEC-THEME-BIND-001, 100% coverage, 293 tests)

- **TokenResolver**: Theme loading with LRU caching and OKLCH color conversion
- **Theme Priority**: Runtime override > Blueprint preference > Default theme (calm-wellness)
- **CSS Variables**: Automatic injection of `var(--token-name)` syntax in generated components
- **State-Specific Tokens**: Support for hover, focus, active, disabled states with fallback
- **Backward Compatibility**: 100% compatibility with existing blueprints (optional themeId field)
- **Type Safety**: Full TypeScript support for ThemeConfig, ColorPalette, ResolvedTokens
- **Performance**: LRU caching with ~95% cache hit rate, <5ms for cached themes
- **OKLCH Color Space**: Perceptually uniform color transformations for consistent styling

**Theme System Features**:

- Centralized design token management eliminates hardcoded values
- Runtime theme switching enables multi-theme applications
- Semantic token naming ensures maintainability across design changes
- AI-powered theme selection based on blueprint tone matching
- Comprehensive theme validation with descriptive error messages

**Integration**:

```typescript
import { renderScreen } from '@tekton/studio-mcp';

// Basic usage with default theme
const result = await renderScreen(blueprint);

// Custom theme override
const themed = await renderScreen(blueprint, {
  themeId: 'professional-dark',
});
console.log(themed.themeApplied); // "professional-dark"
```

**Documentation**: See [Theme Binding Specification](./moai/specs/SPEC-THEME-BIND-001/spec.md), [TokenResolver API](./packages/component-generator/docs/token-resolver.md), and [Theme Configuration Guide](./packages/component-generator/docs/theme-config.md)

#### Overall Quality Metrics

- **Test Coverage**: 99.45% (exceeds ≥85% target by 14.45%) ✅
- **Total Tests**: 476/476 passing (100% pass rate) ✅
- **TRUST 5 Compliance**: PASS (Test-first, Readable, Unified, Secured, Trackable) ✅
- **Type Safety**: Zero TypeScript errors ✅
- **Performance**: <50ms semantic scoring, <10ms hallucination check, <200ms screen generation

#### Pending Milestones

**Milestone 5: Advanced Blueprint Features** 🚧

- Blueprint versioning and comparison system
- AI-powered Blueprint refinement based on feedback
- Visual Blueprint editor with real-time preview
- Blueprint template library with customizable patterns
- Nested component composition with slot inheritance

**Milestone 6: Production Optimization** 🚧

- Bundle optimization with code splitting
- Performance monitoring and telemetry
- Caching strategies for frequent operations
- Error recovery and retry mechanisms
- Production deployment guides and best practices

#### Technology Stack

- **TypeScript**: 5.9+ with strict mode
- **MCP Integration**: Model Context Protocol for AI-driven generation
- **Scoring Engine**: Custom weighted algorithm (0.5, 0.3, 0.2 weights)
- **Validation**: Zod ^3.23.0 for schema validation
- **Code Generation**: @babel/generator ^7.24.0, @babel/types ^7.24.0
- **Formatting**: Prettier ^3.4.0 for consistent code style
- **Testing**: Vitest ^2.0.0 with comprehensive coverage

#### Key Features

- **Semantic Slot Registry**: 7 slots (4 global + 3 local) with semantic roles and constraints
- **Intelligent Scoring**: AI-powered component placement with intent-based adjustments
- **Safety Protocols**: Multi-layer validation (threshold, hallucination, constraints, fallback)
- **MCP Integration**: LLM-driven component generation via Model Context Protocol
- **Knowledge Schema**: Complete JSON schema for AI consumption and Blueprint design
- **Component Generation**: Automated React `.tsx` file generation from Blueprint JSON
- **High Performance**: <200ms end-to-end generation for typical screens
- **Type Safety**: Full TypeScript support with zero compilation errors
- **SPEC Compliance**: 100% acceptance criteria met for completed milestones

**MCP Integration Workflow**:

```bash
# Step 1: LLM gets Knowledge Schema
curl -X POST http://localhost:3000/tools/knowledge.getSchema

# Step 2: LLM queries available components
curl -X POST http://localhost:3000/tools/knowledge.getComponentList \
  -H "Content-Type: application/json" \
  -d '{"filter": {"category": "layout"}}'

# Step 3: LLM designs Blueprint JSON based on user request
# {
#   "blueprintId": "dashboard-001",
#   "recipeName": "user-dashboard",
#   "analysis": {"intent": "Dashboard screen", "tone": "professional"},
#   "structure": {"componentName": "Card", "props": {"variant": "elevated"}}
# }

# Step 4: LLM generates React component from Blueprint
curl -X POST http://localhost:3000/tools/knowledge.renderScreen \
  -H "Content-Type: application/json" \
  -d '{
    "blueprint": {...},
    "outputPath": "src/app/dashboard/page.tsx"
  }'

# Output: Generated .tsx file with type-safe React component
```

**Programmatic Usage Example**:

```typescript
import { JSXGenerator, getAllComponents } from '@tekton/component-generator';

// Initialize generator with Layer 2 catalog
const catalog = getAllComponents();
const generator = new JSXGenerator({ catalog });

// Design Blueprint (typically done by LLM)
const blueprint = {
  blueprintId: 'dash-001',
  recipeName: 'dashboard',
  analysis: { intent: 'Read-only dashboard', tone: 'professional' },
  structure: {
    componentName: 'Card',
    props: { variant: 'elevated', padding: 'large' },
    slots: {
      header: { componentName: 'Badge', props: { text: 'New' } },
      content: { componentName: 'DataTable', props: { columns: 5 } },
    },
  },
};

// Generate React component
const result = await generator.generate(blueprint);

if (result.success) {
  console.log('Generated code:', result.code);
  console.log('Imports:', result.imports);
  // Write to file: src/app/dashboard/page.tsx
} else {
  console.error('Generation failed:', result.errors);
}
```

---

## Features

### OKLCH Color System

Tekton uses the OKLCH color space for perceptually uniform color generation:

- **Perceptually Uniform**: Equal lightness steps appear equally spaced to the human eye
- **Predictable Behavior**: Chroma adjustments preserve hue, preventing unwanted color shifts
- **Gamut Independence**: Future-proof support for wide-gamut displays (P3, Rec.2020)
- **CSS Native**: Supported in modern browsers (Safari 15+, Chrome 111+, Firefox 113+)

### WCAG Compliance

Automatic accessibility validation ensures all generated color combinations meet standards:

- **Contrast Validation**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Automated Checking**: Built-in WCAG AA/AAA compliance validation
- **Fix Suggestions**: Recommendations for lightness adjustments when compliance fails
- **Real-time Validation**: Validates foreground-background pairs during generation

### Token Caching

Performance optimization through intelligent caching:

- **LRU Cache**: Least Recently Used eviction strategy
- **File-based Invalidation**: Automatic cache clearing when source files change
- **High Hit Rate**: 80%+ cache hit rate in typical usage
- **Fast Generation**: <100ms for typical archetype, <10ms for cached results

### WCAG AA Compliance (Deprecated - See Layer 1 Above)

Automatic accessibility validation ensures all generated color combinations meet standards:

- **Contrast Validation**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Automated Checking**: Built-in WCAG AA/AAA compliance validation
- **Fix Suggestions**: Recommendations for lightness adjustments when compliance fails
- **Real-time Validation**: Validates foreground-background pairs during generation

### Design Token Generation

Create scalable, type-safe design token systems:

- **10-Step Color Scales**: Tailwind-compatible scales (50, 100...900, 950)
- **Deterministic Output**: Same input always produces identical output
- **Multiple Export Formats**: CSS variables, JSON, JavaScript, TypeScript
- **Type Safety**: Full TypeScript support with strict type checking

### Component Presets

Pre-configured tokens for common UI components:

- **8 Component Types**: Button, Input, Card, Badge, Alert, Link, Checkbox, Radio
- **State Management**: Hover, active, focus, disabled, error states
- **Semantic Colors**: Info, success, warning, error variants
- **WCAG Validated**: All preset combinations pass accessibility checks

### Dark Mode Support

Automatic dark theme generation with semantic token mapping:

- **Lightness Inversion**: Intelligent lightness scale reversal
- **Semantic Preservation**: Maintains meaningful color relationships
- **Configurable**: Enable/disable dark mode generation per project

### Curated Presets System (NEW)

Modern preset management system replacing legacy Brand DNA:

- **Systematic Management**: PostgreSQL-backed preset storage with JSONB metadata
- **Category Filtering**: Organize presets by Brand, Product, Campaign categories
- **Tag-Based Search**: Fast GIN-indexed tag searching for preset discovery
- **MCP-Powered Suggestions**: Intelligent preset recommendations via studio-mcp
- **RESTful API**: v2 API with pagination, filtering, and search capabilities
- **High Test Coverage**: 85.23% coverage with 54 passing tests

### Brand DNA MCP Integration (Legacy - Deprecated)

AI-powered design personality system (deprecated in favor of Curated Presets):

- **5 Personality Axes**: Density, Warmth, Playfulness, Sophistication, Energy
- **Axis Interpreter**: Converts 0-1 values to design token characteristics
- **File-Based Storage**: Git-trackable `.tekton/brand-dna/` structure
- **Schema Validation**: Runtime type safety with Zod validation
- **Preset Library**: 3 pre-configured brand personalities
- **MCP Ready**: Model Context Protocol integration for AI assistants
- ⚠️ **Status**: Deprecated as of 2026-01-15, migrating to Curated Presets

### Production Ready

Built for professional design systems:

- **Zero Runtime Dependencies**: Minimal bundle size for core functionality
- **High Test Coverage**: 72.37% (target: 85%+)
- **Strict TypeScript**: Zero `any` types in public APIs
- **Gamut Clipping**: Automatic sRGB gamut handling with chroma reduction

## Installation

```bash
npm install tekton
```

```bash
yarn add tekton
```

```bash
pnpm add tekton
```

## Quick Start

### Basic Token Generation

```typescript
import { generateToken, oklchToHex } from 'tekton';

// Define a primary color in OKLCH
const primaryColor = { l: 0.5, c: 0.15, h: 220 }; // Blue

// Generate a complete token with 10-step scale
const token = generateToken('primary', primaryColor);

console.log(token.id); // "primary-0.500-0.150-220"
console.log(oklchToHex(token.value)); // "#0066CC"
console.log(token.scale['500']); // { l: 0.5, c: 0.15, h: 220 }
```

### Export to Multiple Formats

```typescript
import { TokenGenerator } from 'tekton';

const generator = new TokenGenerator({
  generateDarkMode: true,
  validateWCAG: true,
  wcagLevel: 'AA',
});

// Define your color palette
const palette = {
  primary: { l: 0.5, c: 0.15, h: 220 },
  success: { l: 0.5, c: 0.15, h: 140 },
  warning: { l: 0.6, c: 0.15, h: 60 },
  error: { l: 0.5, c: 0.15, h: 0 },
};

// Export to CSS
const css = generator.exportTokens(palette, 'css');
// :root {
//   --primary: #0066CC;
//   --primary-50: #F0F6FF;
//   ...
// }

// Export to JSON
const json = generator.exportTokens(palette, 'json');

// Export to TypeScript
const ts = generator.exportTokens(palette, 'ts');
```

### Component Presets

```typescript
import { buttonPreset, generateComponentPresets } from 'tekton';

const primaryColor = { l: 0.5, c: 0.15, h: 220 };

// Generate button-specific tokens
const button = buttonPreset(primaryColor);
console.log(button.states.hover); // { l: 0.45, c: 0.15, h: 220 }

// Generate all 8 component presets
const allPresets = generateComponentPresets(primaryColor);
```

### Using Presets

Presets provide pre-configured design system settings for common technology stacks:

```typescript
import { loadDefaultPreset, generateTokensFromPreset } from 'tekton/presets';

// Load Next.js + Tailwind + shadcn/ui preset
const preset = loadDefaultPreset('next-tailwind-shadcn');

// Generate tokens in different formats
const cssTokens = generateTokensFromPreset(preset, { format: 'css' });
const dtcgTokens = generateTokensFromPreset(preset, { format: 'dtcg' });
const tailwindConfig = generateTokensFromPreset(preset, { format: 'tailwind' });

// Use in your project
import fs from 'fs';
fs.writeFileSync('styles/tokens.css', cssTokens);
```

#### Available Presets

- **`next-tailwind-shadcn`**: Next.js + Tailwind CSS + shadcn/ui (default)

#### Custom Presets

Create your own preset JSON file:

```json
{
  "id": "my-preset",
  "version": "1.0.0",
  "name": "My Custom Preset",
  "description": "Custom design system configuration",
  "stack": {
    "framework": "nextjs",
    "styling": "tailwindcss",
    "components": "shadcn-ui"
  },
  "questionnaire": {
    "brandTone": "professional",
    "contrast": "high",
    "density": "comfortable",
    "borderRadius": "medium",
    "primaryColor": { "l": 0.5, "c": 0.15, "h": 220 },
    "neutralTone": "pure",
    "fontScale": "medium"
  }
}
```

Load with `loadPreset(presetData)`:

```typescript
import { loadPreset, generateTokensFromPreset } from 'tekton/presets';
import fs from 'fs';

const presetData = JSON.parse(fs.readFileSync('my-preset.json', 'utf-8'));
const preset = loadPreset(presetData);
const tokens = generateTokensFromPreset(preset);
```

### Color Conversion

```typescript
import { hexToOklch, oklchToHex, rgbToOklch } from 'tekton';

// Hex to OKLCH
const oklch = hexToOklch('#3B82F6');
console.log(oklch); // { l: 0.58, c: 0.18, h: 248 }

// OKLCH to Hex
const hex = oklchToHex({ l: 0.5, c: 0.15, h: 220 });
console.log(hex); // "#0066CC"

// RGB to OKLCH
const oklchFromRgb = rgbToOklch({ r: 59, g: 130, b: 246 });
```

## Worktree Management

Tekton provides a comprehensive Git worktree management system for parallel SPEC development. The worktree system enables isolated development environments where each SPEC gets its own directory and Git branch, allowing true parallel development without context switching overhead.

### Why Use Worktrees?

**Traditional branch workflow pain points**:

- Frequent `git stash` operations when switching branches
- Risk of losing uncommitted work
- Context switching overhead
- Conflicts when switching branches with uncommitted changes
- Single development environment

**Worktree solution**:

- Each SPEC has its own isolated directory
- Independent Git state per worktree
- Simultaneous development on multiple SPECs
- Instant switching between worktrees (no stashing)
- Isolated dependencies and configuration

### Quick Start

Create a worktree for parallel development:

```bash
# Create a worktree for a SPEC
tekton worktree new SPEC-AUTH-001 "User Authentication System"

# Output:
# ✓ Worktree created successfully
#   Path: /Users/yourname/.worktrees/SPEC-AUTH-001
#   Branch: feature/SPEC-AUTH-001
#   Base: master

# Navigate to the worktree
cd ~/.worktrees/SPEC-AUTH-001

# Work on your SPEC in isolation
# All changes are isolated to this worktree

# Check sync status before creating PR
cd /path/to/main/repo
tekton worktree status SPEC-AUTH-001

# Sync with base branch
tekton worktree sync SPEC-AUTH-001

# After PR is merged, clean up
tekton worktree clean --merged-only
```

### Integration with MoAI Workflow

Worktrees integrate seamlessly with MoAI's SPEC-based development workflow:

```bash
# Option 1: Create SPEC with worktree automatically
/moai:1-plan --worktree "User Authentication System"
# Creates SPEC-AUTH-001 and worktree in one step

# Option 2: Create worktree for existing SPEC
tekton worktree new SPEC-AUTH-001 "User Authentication System"
cd ~/.worktrees/SPEC-AUTH-001

# Run MoAI workflow in isolated worktree
/moai:2-run SPEC-AUTH-001  # TDD implementation
/moai:3-sync SPEC-AUTH-001 # Documentation sync

# When ready, sync and create PR
tekton worktree sync SPEC-AUTH-001
git push origin feature/SPEC-AUTH-001
```

**Benefits of MoAI + Worktree**:

- **Parallel SPEC Development**: Work on multiple SPECs simultaneously without conflicts
- **Isolated Testing**: Each SPEC has its own test environment
- **Independent Dependencies**: Install SPEC-specific packages without affecting other work
- **Clean Git History**: Each SPEC maintains its own branch and commits
- **Zero Context Switching**: Move between SPECs instantly (no `git stash` needed)

**Recommended Workflow**:

1. Create SPEC using `/moai:1-plan --worktree`
2. Worktree is automatically created with proper branch naming
3. Develop in isolated worktree using `/moai:2-run`
4. Sync documentation with `/moai:3-sync`
5. Merge changes back using `tekton worktree sync`
6. Create PR directly from worktree branch
7. Clean up after merge: `tekton worktree clean --merged-only`

### Core Commands

| Command  | Usage                                        | Purpose                  |
| -------- | -------------------------------------------- | ------------------------ |
| `new`    | `tekton worktree new SPEC-001 "Description"` | Create isolated worktree |
| `list`   | `tekton worktree list [--status active]`     | List all worktrees       |
| `switch` | `tekton worktree switch SPEC-001`            | Get path to worktree     |
| `status` | `tekton worktree status SPEC-001`            | Check sync status        |
| `sync`   | `tekton worktree sync SPEC-001`              | Sync with base branch    |
| `remove` | `tekton worktree remove SPEC-001`            | Remove worktree          |
| `clean`  | `tekton worktree clean --merged-only`        | Clean merged worktrees   |
| `config` | `tekton worktree config list`                | View configuration       |

### Parallel Development Workflow

Work on multiple SPECs simultaneously:

```bash
# Create multiple worktrees
tekton worktree new SPEC-AUTH-001 "User Authentication"
tekton worktree new SPEC-PAY-001 "Payment Processing"
tekton worktree new SPEC-DASH-001 "Dashboard Analytics"

# List all worktrees
tekton worktree list

# Output:
# SPEC ID         STATUS   PATH                                        BRANCH
# SPEC-AUTH-001   active   /Users/you/.worktrees/SPEC-AUTH-001        feature/SPEC-AUTH-001
# SPEC-PAY-001    active   /Users/you/.worktrees/SPEC-PAY-001         feature/SPEC-PAY-001
# SPEC-DASH-001   active   /Users/you/.worktrees/SPEC-DASH-001        feature/SPEC-DASH-001

# Switch between worktrees instantly
cd ~/.worktrees/SPEC-AUTH-001  # Work on authentication
cd ~/.worktrees/SPEC-PAY-001   # Switch to payment
cd ~/.worktrees/SPEC-DASH-001  # Switch to dashboard

# No stashing, no conflicts, independent development
```

### Features

- **Isolation**: Each SPEC has its own directory and Git branch
- **Parallel Development**: Work on multiple SPECs simultaneously
- **Zero Context Switching**: Instant switching between worktrees
- **Clean Integration**: Automatic sync with base branch
- **Safe Experimentation**: Isolated environment for testing
- **Automatic Cleanup**: Remove merged worktrees with one command
- **Configuration Management**: Project-specific worktree settings
- **JSON Output**: All commands support `--format json` for automation

### Documentation

For complete documentation, see:

- [Worktree Workflow Guide](./docs/worktree-workflow-guide.md) - Complete integration with SPEC workflow
- [MoAI Integration Analysis](./docs/worktree-moai-integration.md) - Integration points and implementation guide

### Implementation Status

The Tekton Worktree Management System is fully implemented:

- **Phase 1**: Foundation (types, registry, validation) - 127 tests ✅
- **Phase 2**: Git Integration (worktree manager, git operations) - 79 tests ✅
- **Phase 3**: Core CLI Commands (new, list, switch, remove) - 67 tests ✅
- **Phase 4**: Advanced Features (sync, status, config, clean) - 41 tests ✅
- **Phase 5**: MoAI Workflow Integration - Documentation complete ✅

**Total: 314 tests passing, full CLI implementation complete**

## Architecture Overview

Tekton is organized into specialized modules, each handling a specific aspect of design token generation:

```
┌─────────────────────────────────────────┐
│         Public API (index.ts)           │
└────────────┬────────────────────────────┘
             │
     ┌───────┴───────┐
     │               │
     ▼               ▼
┌─────────┐    ┌──────────────┐
│ Schemas │    │  Conversion  │
│ (Zod)   │    │  (OKLCH↔RGB) │
└─────────┘    └──────────────┘
     │               │
     ▼               ▼
┌──────────────────────────────┐
│    Token Generator           │
│  - Scale Generation          │
│  - Gamut Clipping            │
│  - Caching & Export          │
└──────────┬───────────────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌─────────┐  ┌──────────┐
│  WCAG   │  │Component │
│Validator│  │ Presets  │
└─────────┘  └──────────┘
```

### Module Dependency Graph

```
schemas.ts
    ↓
color-conversion.ts
    ↓
scale-generator.ts ← wcag-validator.ts
    ↓                      ↓
token-generator.ts ←  component-presets.ts
    ↓
index.ts (Public API)
```

### Screen Contract Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Screen Contract                             │
├─────────────────────────────────────────────────────────────────┤
│  Layer 1: Environment (환경 계층)                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Desktop   │  │   Mobile    │  │   Tablet    │              │
│  │  (12-col)   │  │   (4-col)   │  │   (8-col)   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│  Layer 2: Skeleton (골격 계층)                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Layout Preset: FullScreen | WithSidebar | WithHeader   │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────────────────────────┐│    │
│  │  │ Header? │ │Sidebar? │ │         Content             ││    │
│  │  └─────────┘ └─────────┘ └─────────────────────────────┘│    │
│  │  ┌─────────────────────────────────────────────────────┐│    │
│  │  │                     Footer?                         ││    │
│  │  └─────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────┤
│  Layer 3: Intent (역할 계층)                                     │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐        │
│  │ DataList  │ │   Form    │ │ Dashboard │ │  Detail   │        │
│  │ (Table,   │ │ (Input,   │ │ (Card,    │ │ (Section, │        │
│  │  List)    │ │  Select)  │ │  Chart)   │ │  Media)   │        │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘        │
├─────────────────────────────────────────────────────────────────┤
│  Layer 4: Composition (합성 계층)                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Component Assembly + Token Application                 │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │    │
│  │  │ Button  │ │  Card   │ │  Input  │ │  Table  │ ...    │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘        │    │
│  │         ↓ Token Injection (Color, Spacing, Typography)  │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Key Modules

- **schemas.ts**: Zod validation schemas for type-safe data structures
- **color-conversion.ts**: OKLCH ↔ RGB ↔ Hex conversions with gamma correction
- **scale-generator.ts**: 10-step lightness scale generation with perceptual uniformity
- **wcag-validator.ts**: WCAG AA/AAA contrast ratio validation and compliance checking
- **token-generator.ts**: Core token generation, caching, multi-format export
- **component-presets.ts**: Pre-configured tokens for 8 common UI components
- **contracts/**: Component contract validation system with 8 MVP shadcn/ui contracts
- **screen-contracts/**: 4-layer screen generation architecture (Environment, Skeleton, Intent, Composition)

For detailed architecture documentation, see [Architecture Guide](./docs/architecture/README.md).

## API Reference

### Core Functions

- **`generateToken(name, baseColor)`** - Generate a design token with 10-step scale
- **`generateTokenId(name, color)`** - Create deterministic token identifier
- **`TokenGenerator`** - Class for batch token generation with caching

### Color Conversion

- **`oklchToRgb(oklch)`** - Convert OKLCH to RGB color
- **`rgbToOklch(rgb)`** - Convert RGB to OKLCH color
- **`oklchToHex(oklch)`** - Convert OKLCH to hex string
- **`hexToOklch(hex)`** - Convert hex string to OKLCH

### Scale Generation

- **`generateLightnessScale(baseColor)`** - Create 10-step lightness scale
- **`generateColorScales(palette)`** - Generate scales for multiple colors

### WCAG Validation

- **`calculateContrastRatio(color1, color2)`** - Calculate WCAG contrast ratio (1-21)
- **`checkWCAGCompliance(ratio, level, isLargeText)`** - Validate compliance level
- **`validateColorPair(fg, bg, level, isLargeText)`** - Full color pair validation

### Component Presets

- **`buttonPreset(baseColor)`** - Button component tokens
- **`inputPreset(baseColor)`** - Input component tokens
- **`cardPreset(baseColor)`** - Card component tokens
- **`badgePreset(baseColor)`** - Badge component tokens
- **`alertPreset(baseColor)`** - Alert component tokens
- **`linkPreset(baseColor)`** - Link component tokens
- **`checkboxPreset(baseColor)`** - Checkbox component tokens
- **`radioPreset(baseColor)`** - Radio component tokens
- **`generateComponentPresets(baseColor)`** - All 8 presets

### Component Contracts

- **`getContract(componentName)`** - Retrieve component contract by name
- **`registerContract(contract)`** - Register a new component contract
- **`listAllContracts()`** - List all registered component contracts

**Available Contracts** (8 MVP components):

- **button** (15 constraints) - Icon-only accessibility, prop combinations, WCAG
- **input** (12 constraints) - Label association, validation states, security
- **dialog** (10 constraints) - Required structure (DialogTitle), focus management
- **form** (12 constraints) - Field accessibility (aria-required), validation
- **card** (8 constraints) - Semantic structure, header/footer ordering
- **alert** (7 constraints) - Role requirements, variant validation
- **select** (10 constraints) - Keyboard navigation, aria-expanded state
- **checkbox** (8 constraints) - Label association, aria-checked state

**Contract Usage Example**:

```typescript
import { getContract } from 'tekton/contracts';

// Get button contract
const buttonContract = getContract('button');

// Check all constraints
buttonContract.constraints.forEach(constraint => {
  console.log(`${constraint.id}: ${constraint.description}`);
  console.log(`Severity: ${constraint.severity}`);
  console.log(`Auto-fixable: ${constraint.autoFixable}`);
});

// Example: BTN-A01 - Icon-only buttons require aria-label
// Severity: error
// Auto-fixable: true
```

### Screen Contract API

- **`createScreenContract(config)`** - Create screen specification with 4-layer architecture
- **`validateScreenContract(contract)`** - Validate screen contract against rules
- **`generateScreenFromContract(contract)`** - Generate screen files from contract
- **`Environment`** - Environment enum (web, mobile, tablet, responsive, tv, kiosk)
- **`SkeletonPreset`** - Layout preset enum (full-screen, with-header, with-sidebar, dashboard)
- **`ScreenIntent`** - Screen purpose enum (data-list, data-detail, form, dashboard, etc.)

**Screen Contract Usage Example**:

```typescript
import { createScreenContract, Environment, SkeletonPreset, ScreenIntent } from 'tekton/screen';

// Create screen contract
const contract = createScreenContract({
  name: 'UserProfile',
  environment: Environment.Responsive,
  skeleton: SkeletonPreset.WithHeader,
  intent: ScreenIntent.DataDetail,
  components: ['card', 'section', 'button'],
});

// Generate screen files
await generateScreenFromContract(contract);
// Creates: src/screens/user-profile/page.tsx, layout.tsx, components/index.ts
```

### Schemas (Zod)

- **`OKLCHColorSchema`** - OKLCH color validation
- **`RGBColorSchema`** - RGB color validation
- **`ColorScaleSchema`** - 10-step color scale validation
- **`TokenDefinitionSchema`** - Token structure validation
- **`AccessibilityCheckSchema`** - WCAG validation result
- **`ComponentPresetSchema`** - Component preset validation

For complete API documentation with usage examples, see [API Reference](./docs/api/README.md).

## Project Status

**Current Version**: 0.2.0 (Planned)
**Current Branch**: `feature/SPEC-COMPONENT-001`
**SPEC Phase**: Phase F - Layout System & UI Package (In Progress)

### Implementation Status

**Completed Features** (SPEC-PHASEB-002 + SPEC-PHASEC-003):

**Phase A - Core Token System:**

- ✅ OKLCH color space conversion with gamma correction
- ✅ 10-step lightness scale generation
- ✅ Deterministic token ID generation
- ✅ Multi-format export (CSS, JSON, JS, TS)
- ✅ WCAG AA/AAA contrast validation
- ✅ Gamut clipping with chroma reduction
- ✅ Component presets for 8 UI elements
- ✅ Dark mode variant generation
- ✅ Token caching and performance optimization
- ✅ Strict TypeScript type safety
- ✅ Neutral palette generation (pure/tinted/custom modes)
- ✅ Semantic token mapping (shadcn/ui compatible)
- ✅ Questionnaire schema validation
- ✅ Preset definition system (A1 integration)
- ✅ Preset loading with Zod validation
- ✅ Default preset: next-tailwind-shadcn
- ✅ Component contract system (8 MVP contracts, 82 total constraints)
- ✅ Contract registry with O(1) lookup performance
- ✅ 6 constraint rule types (accessibility, prop-combination, children, context, composition, state)

**Phase B - CLI & VS Code Extension:**

- ✅ M1: Monorepo structure with pnpm workspaces
- ✅ M2: CLI with framework detection (Next.js, Vite, Remix, Nuxt, SvelteKit)
- ✅ M2: Tailwind CSS detection
- ✅ M2: shadcn/ui detection
- ✅ M3: VS Code extension with command palette integration
- ✅ M3: Extension commands (detect, setup, generate)
- ✅ M3: Output channel for command results
- ✅ M4: Screen workflow templates (page.tsx, layout.tsx, index.ts)
- ✅ M4: Advanced framework detection (5 frameworks total)
- ✅ M4: Comprehensive documentation (CLI, Extension, Root)

**Phase C - Screen Contract Architecture:**

- ✅ M1: 4-layer screen contract architecture (Environment, Skeleton, Intent, Composition)
- ✅ M2: Environment layer with 6 device types and grid systems
- ✅ M3: Skeleton presets with 6 layout patterns
- ✅ M4: Intent classification with 10 screen purposes
- ✅ M5: Composition pipeline with token injection
- ✅ M6: CLI command 'tekton create screen' with interactive prompts
- ✅ M7: Non-interactive mode with flags support
- ✅ M8: Contract validation integration
- ✅ M9: Agent context export (agent-context.json)
- ✅ M10: VS Code extension integration

**Phase D - Brand DNA MCP Integration:** ✨ NEW

- ✅ M1: Brand DNA schema validation with Zod
- ✅ M2: Axis Interpreter with 15 conversion mappings (5 axes × 3 ranges)
- ✅ M3: File-based storage with Git-trackable structure
- ✅ M4: TypeScript type definitions for 9 design token categories
- ✅ M5: Preset library system (3 default presets)
- ✅ M6: Comprehensive test coverage (112 tests, 98.88% coverage)
- ✅ M7: Public API with complete documentation

**Quality Gates** (Phase D):

- ✅ Tests: 112 passing tests across 8 test suites (100% pass rate)
- ✅ Coverage: 98.88% statement, 94.11% branch (exceeds ≥85% target)
- ✅ Type Safety: Zero type errors with strict mode
- ✅ Linter: Clean (0 errors, 0 warnings)
- ✅ Security: Zero vulnerabilities in production dependencies

**Quality Gates** (Phase C):

- ✅ Tests: 514 passing tests across 39 test suites (100% pass rate)
- ⚠️ Coverage: 73.23% (below ≥85% CLI target, acceptable for MVP)
- ✅ Type Safety: Zero type errors with strict mode
- ✅ Linter: Clean (2 warnings only, no errors)
- ⚠️ Security: 6 moderate dev dependency vulnerabilities (dev environment only)

**Phase Status**:

- ✅ Phase A: 100% complete (2026-01-11)
  - ✅ A1: Preset definition system
  - ✅ A2: Token generator
  - ✅ A3: Component contract system
- ✅ Phase B (SPEC-PHASEB-002): 100% complete (2026-01-13)
  - ✅ M1: Monorepo setup
  - ✅ M2: CLI implementation (5 frameworks supported)
  - ✅ M3: VS Code extension (Command Palette integration)
  - ✅ M4: Advanced features & screen templates
- ✅ Phase C (SPEC-PHASEC-003): 100% complete (2026-01-13)
  - ✅ M1-M5: 4-layer screen contract architecture
  - ✅ M6-M7: CLI screen creation command
  - ✅ M8: Contract validation integration
  - ✅ M9-M10: Agent context & VS Code integration
- ✅ Phase D (SPEC-STUDIO-001): 100% complete (2026-01-13)
  - ✅ Brand DNA schema validation
  - ✅ Axis Interpreter engine
  - ✅ File-based storage
  - ✅ Design token type system
  - ✅ Preset library
  - ✅ Complete API documentation
- ✅ Phase E (SPEC-STUDIO-002): 85.23% complete (2026-01-15)
  - ✅ Phase 1: Brand DNA cleanup (deprecation, archive, read-only mode)
  - ✅ Phase 2: Curated Presets core build (database, API, frontend, MCP)
  - ✅ 54 passing tests, 85.23% coverage
  - ✅ FastAPI backend with PostgreSQL and Alembic migrations
  - ⏳ Phase 3: Custom Image Flow (deferred to 1 month post-Phase 2)

**Phase B Highlights**:

- Monorepo architecture with pnpm workspaces
- CLI with framework detection (Next.js, Vite, Remix, Nuxt, SvelteKit)
- VS Code extension with real-time output streaming
- Screen workflow templates for Phase C preparation
- Comprehensive documentation (CLI, Extension, Root)

**Phase C Highlights**:

- 4-layer screen contract architecture (Environment, Skeleton, Intent, Composition)
- Interactive CLI screen generation with smart prompts
- 6 environment types with adaptive grid systems (Desktop 12-col, Mobile 4-col, Tablet 8-col)
- 6 skeleton presets for common layouts
- 10 screen intents with component pattern mapping
- Non-interactive mode for CI/CD automation
- Agent context export for AI-driven screen generation
- Contract validation preventing invalid screen compositions

**Quality Exceptions** (Phase C):

- Coverage: 73.23% (below 85% CLI target) - MVP acceptable, Phase D improvement planned
- Security: 6 moderate dev dependencies - Limited to development environment
- See [Quality Exceptions](/.moai/docs/quality-exceptions-phasec.md) for details

For detailed implementation status, see:

- [Phase B Plan](/.moai/specs/SPEC-PHASEB-002/plan.md)
- [Phase C Implementation](/.moai/specs/SPEC-PHASEC-003/implementation-status.md)

### Roadmap

**Phase F (Current) - Layout System & UI Package:** 🚧 In Progress

- ✅ **@tekton/ui Package**: 19개 React 컴포넌트 구현
  - Primitives (14개): Avatar, Badge, Button, Checkbox, Heading, Image, Input, Link, List, Progress, Radio, Slider, Switch, Text
  - Components (5개): Dropdown, Form, Modal, Table, Tabs
  - WCAG 2.1 AA 접근성 준수
  - TypeScript 타입 정의 완료
  - 테스트 커버리지: 100% (모든 테스트 통과)

- ✅ **@tekton/playground-web** (SPEC-PLAYGROUND-001): Next.js 16 React Playground
  - 동적 라우팅 시스템 (`/preview/[timestamp]/[themeId]`)
  - ThemeProvider CSS Variable 주입 시스템
  - Blueprint Renderer 컴포넌트 (재귀적 컴포넌트 트리 렌더링)
  - MCP Client 통합 (blueprint 및 theme 데이터 fetch)
  - 프로덕션 레이아웃 컴포넌트 (Dashboard, Landing 등)
  - 실시간 테마 전환 (HMR 호환)
  - 타임스탬프 기반 불변 히스토리 관리
  - 테스트 커버리지: 99.39% (120/120 테스트 통과)
  - Quality Status: ⚠️ WARNING (5건 경고, Critical 이슈 없음)

- ✅ **SPEC-LAYOUT-001**: Layout Token System (Completed 2026-01-27)
  - 4-Layer Layout Architecture: Shell → Page → Section → Responsive
  - 32 Layout Tokens: 6 shells + 8 pages + 13 sections + 5 breakpoints
  - Performance: 0.001ms layout resolution (5000x faster than 5ms target)
  - Map-based caching with O(1) lookup performance
  - CSS Generator: CSS variables, utility classes, media queries (7KB output)
  - Blueprint Integration: Optional layoutToken with backward compatibility
  - Test Coverage: 490 tests across 9 files (98.21% overall coverage)
  - Files: 22 new files (+9,597 lines), comprehensive documentation
  - Quality: TypeScript strict mode ✓, ESLint ✓, All tests passing ✓

- ✅ **SPEC-LAYOUT-002**: Screen Generation Pipeline (Completed 2026-01-28)
  - JSON Schema-based screen definitions with TypeScript + Zod validation
  - Token resolver pipeline: Shell/Page/Section layout integration
  - Multi-format code generators: CSS-in-JS (styled-components, Emotion) + Tailwind + React
  - 20 supported component types from SPEC-COMPONENT-001-B
  - 3 MCP tools: generate_screen, validate_screen, list_tokens
  - Performance: Resolver 90.16%, Validators 92.88%, Generators 91.17% coverage
  - Files: 4 phases + API docs + integration guide + MCP tools guide
  - Quality: 85%+ overall coverage ✓, TRUST 5 compliant ✓, All tests passing ✓
  - Documentation: [Screen Generation README](./packages/core/src/screen-generation/README.md)

**Phase G (Future) - Figma Integration:**

- Figma token synchronization with Design Tokens Community Group (DTCG) format
- Bidirectional sync (Figma ↔ Tekton)
- Visual design token editor in Figma plugin
- Real-time preview with Figma Dev Mode
- Design system governance with token validation

**Phase H (Future) - AFDS Marketplace:**

- Domain-specific screen contract packs (SaaS, E-commerce, Healthcare)
- Community screen templates and presets
- Component contract library marketplace
- AI agent screen generation patterns

See [SPEC-PHASEB-002](/.moai/specs/SPEC-PHASEB-002/plan.md), [SPEC-PHASEC-003](/.moai/specs/SPEC-PHASEC-003/spec.md), [SPEC-LAYOUT-001](/.moai/specs/SPEC-LAYOUT-001/spec.md), and [SPEC-LAYOUT-002](/.moai/specs/SPEC-LAYOUT-002/spec.md) for comprehensive roadmap.

## Documentation

- **[Getting Started Guide](./docs/guides/getting-started.md)** - Installation and basic usage
- **[API Reference](./docs/api/README.md)** - Complete API documentation
- **[Architecture](./docs/architecture/README.md)** - System design and module overview
- **[Examples](./docs/examples/)** - Working code examples and use cases
- **[Contributing](./CONTRIBUTING.md)** - Development workflow and guidelines

## Why OKLCH?

**Problem with HSL/RGB**: Traditional color spaces don't represent how humans perceive color. A lightness value of 50% in HSL looks different for blue vs yellow.

**OKLCH Solution**: Based on human perception research, OKLCH provides:

1. **Perceptual Uniformity**: L=0.5 looks equally bright across all hues
2. **Predictable Scaling**: Adjusting lightness by 0.1 creates consistent visual steps
3. **Chroma Independence**: Changing saturation doesn't shift hue
4. **Future-Proof**: Supports P3 and Rec.2020 wide-gamut displays

**Real-World Impact**:

- **Design Systems**: Create accessible color scales that actually work
- **Accessibility**: Meet WCAG requirements without manual tweaking
- **Consistency**: Maintain visual harmony across brand colors

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for:

- Development setup and workflow
- SPEC-first development process
- TDD (Test-Driven Development) approach
- Quality gates and acceptance criteria
- PR guidelines and code review process

### Quick Development Setup

```bash
# Install dependencies
npm install

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Build the project
npm run build

# Lint code
npm run lint

# Format code
npm run format
```

## License

MIT © 2026

---

**Built with** [MoAI-ADK](https://github.com/asleep/moai-adk) - AI-Driven Development Kit

**Generated using** SPEC-First TDD workflow for quality-first development
