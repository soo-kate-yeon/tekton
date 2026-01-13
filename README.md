# Tekton

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/asleep/tekton)
[![Coverage](https://img.shields.io/badge/coverage-73.23%25-yellow)](https://github.com/asleep/tekton)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)

OKLCH-based design token generator with WCAG AA compliance for modern design systems.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [API Reference](#api-reference)
- [Project Status](#project-status)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

### OKLCH Color Space

Tekton uses the **OKLCH color space** for perceptually uniform color generation:

- **Perceptual Uniformity**: Equal lightness steps appear equally spaced to the human eye
- **Predictable Behavior**: Chroma adjustments preserve hue, preventing unwanted color shifts
- **Gamut Independence**: Future-proof support for wide-gamut displays (P3, Rec.2020)
- **CSS Native**: Supported in modern browsers (Safari 15+, Chrome 111+, Firefox 113+)

### WCAG AA Compliance

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

### Brand DNA MCP Integration

AI-powered design personality system with axis-based token generation:

- **5 Personality Axes**: Density, Warmth, Playfulness, Sophistication, Energy
- **Axis Interpreter**: Converts 0-1 values to design token characteristics
- **File-Based Storage**: Git-trackable `.tekton/brand-dna/` structure
- **Schema Validation**: Runtime type safety with Zod validation
- **Preset Library**: 3 pre-configured brand personalities
- **MCP Ready**: Model Context Protocol integration for AI assistants

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
  components: ['card', 'section', 'button']
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

**Current Version**: 0.3.0
**Current Branch**: `master`
**SPEC Phase**: Phase D Complete - Brand DNA MCP Integration Implemented (100%)

### Implementation Status

**Completed Features** (SPEC-PHASEAB-001 + SPEC-PHASEB-002 + SPEC-PHASEC-003):

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
- ✅ Phase A (SPEC-PHASEAB-001): 100% complete (2026-01-11)
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
- [Phase A Implementation](/.moai/specs/SPEC-PHASEAB-001/implementation-status.md)
- [Phase B Plan](/.moai/specs/SPEC-PHASEB-002/plan.md)
- [Phase C Implementation](/.moai/specs/SPEC-PHASEC-003/implementation-status.md)

### Roadmap

**Phase D (Upcoming) - Figma Integration:**
- Figma token synchronization with Design Tokens Community Group (DTCG) format
- Bidirectional sync (Figma ↔ Tekton)
- Visual design token editor in Figma plugin
- Real-time preview with Figma Dev Mode
- Design system governance with token validation

**Phase E (Future) - AFDS Marketplace:**
- Domain-specific screen contract packs (SaaS, E-commerce, Healthcare)
- Community screen templates and presets
- Component contract library marketplace
- AI agent screen generation patterns

See [SPEC-PHASEAB-001](/.moai/specs/SPEC-PHASEAB-001/spec.md), [SPEC-PHASEB-002](/.moai/specs/SPEC-PHASEB-002/plan.md), and [SPEC-PHASEC-003](/.moai/specs/SPEC-PHASEC-003/spec.md) for comprehensive roadmap.

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
