# Tekton

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-org/tekton)
[![Coverage](https://img.shields.io/badge/coverage-72.37%25-yellow)](https://github.com/your-org/tekton)
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

### Key Modules

- **schemas.ts**: Zod validation schemas for type-safe data structures
- **color-conversion.ts**: OKLCH ↔ RGB ↔ Hex conversions with gamma correction
- **scale-generator.ts**: 10-step lightness scale generation with perceptual uniformity
- **wcag-validator.ts**: WCAG AA/AAA contrast ratio validation and compliance checking
- **token-generator.ts**: Core token generation, caching, multi-format export
- **component-presets.ts**: Pre-configured tokens for 8 common UI components

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

### Schemas (Zod)

- **`OKLCHColorSchema`** - OKLCH color validation
- **`RGBColorSchema`** - RGB color validation
- **`ColorScaleSchema`** - 10-step color scale validation
- **`TokenDefinitionSchema`** - Token structure validation
- **`AccessibilityCheckSchema`** - WCAG validation result
- **`ComponentPresetSchema`** - Component preset validation

For complete API documentation with usage examples, see [API Reference](./docs/api/README.md).

## Project Status

**Current Version**: 0.1.0
**Current Branch**: `feature/SPEC-PHASEAB-001`
**SPEC Phase**: A2 - Token Generator (75% complete)

### Implementation Status

**Completed Features** (SPEC-PHASEAB-001):
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

**In Progress**:
- 🔄 Test coverage improvement (current: 72.37%, target: 85%)
- 🔄 Tinted neutral palette generation (CR-002)

**Quality Gates**:
- ✅ Tests: 142 passing tests across 12 test suites
- ⚠️ Coverage: 72.37% (target: ≥85%)
- ✅ Type Safety: Zero `any` types in public APIs
- ⚠️ Linter: 1 warning (no-explicit-any at token-generator.ts:213)
- ⚠️ Security: 6 moderate dev dependency vulnerabilities

**Next Phases** (SPEC-PHASEAB-001):
- A1: Preset definition system (not started)
- A3: Component contract system (not started)

For detailed implementation status, see [Implementation Status](/.moai/specs/SPEC-PHASEAB-001/implementation-status.md).

### Roadmap

See [SPEC-PHASEAB-001](/.moai/specs/SPEC-PHASEAB-001/spec.md) for comprehensive roadmap and requirements.

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

**Built with** [MoAI-ADK](https://github.com/your-org/moai-adk) - AI-Driven Development Kit

**Generated using** SPEC-First TDD workflow for quality-first development
