# @tekton/token-generator

> Layer 1: Token Generator Engine - Deterministic design token generation with OKLCH color spaces and WCAG compliance

## Installation

```bash
pnpm add @tekton/token-generator
```

## Quick Start

```typescript
import { generateTokensFromArchetype, exportToCSS } from '@tekton/token-generator';

// Load archetype preset
const archetype = {
  id: "my-theme",
  colors: {
    primary: { oklch: [0.55, 0.15, 270] },
    surface: { oklch: [0.98, 0.01, 270] }
  }
};

// Generate tokens
const tokens = await generateTokensFromArchetype(archetype);

// Export to CSS
const css = exportToCSS(tokens);
console.log(css);
// Output: :root { --color-primary: oklch(0.55 0.15 270); ... }
```

## Features

- **Deterministic Token Generation**: Same input always produces identical output
- **OKLCH Color Space**: Perceptually uniform color transformations using culori 3.3.0
- **WCAG AA/AAA Validation**: Automatic contrast ratio checking (4.5:1 text, 3:1 UI)
- **Auto-Adjustment**: Intelligent color adjustment to meet WCAG thresholds
- **Multiple Export Formats**: CSS, Tailwind, DTCG (Design Token Community Group)
- **Performance Optimized**: LRU cache, <100ms generation, <10ms cache hit
- **Comprehensive Testing**: 135 tests, 90%+ coverage

## Architecture

```
Archetype JSON → Parser → OKLCH Converter → WCAG Validator → Generator → Output (CSS/Tailwind/DTCG)
```

### Core Modules

- **Parser** (`archetype-parser.ts`, `schema-validator.ts`): JSON schema validation with Zod
- **Color** (`oklch-converter.ts`, `gamut-clipper.ts`): OKLCH ↔ RGB conversion with gamut clipping
- **Validation** (`wcag-validator.ts`): Contrast ratio calculation and WCAG compliance
- **Generator** (`output.ts`, `token-cache.ts`): Token generation and caching

## API Reference

### `generateTokensFromArchetype(archetype, options?)`

Generates design tokens from archetype JSON preset.

**Parameters**:
- `archetype`: Archetype JSON object
- `options` (optional):
  - `wcagLevel`: 'AA' | 'AAA' (default: 'AA')
  - `cacheEnabled`: boolean (default: true)
  - `cacheTTL`: number (default: 3600000ms)

**Returns**: Generated tokens object

### `exportToCSS(tokens, options?)`

Exports tokens as CSS custom properties.

**Parameters**:
- `tokens`: Generated tokens object
- `options` (optional):
  - `format`: 'oklch' | 'rgb' | 'both' (default: 'oklch')
  - `prefix`: string (default: '--')
  - `minify`: boolean (default: false)

**Returns**: CSS string

### `exportToTailwind(tokens, options?)`

Exports tokens as Tailwind configuration.

**Parameters**:
- `tokens`: Generated tokens object
- `options` (optional):
  - `format`: 'js' | 'ts' (default: 'js')

**Returns**: Tailwind config string

### `exportToDTCG(tokens)`

Exports tokens as DTCG-compliant JSON.

**Returns**: DTCG JSON object

## Performance

- **Token Generation**: <100ms for typical archetype (50-100 tokens)
- **Cache Hit**: <10ms lookup time
- **Cache Hit Rate**: 80%+ in typical usage
- **Memory Usage**: <50MB for token cache

## Testing

```bash
pnpm test          # Run all tests
pnpm test:coverage # Run with coverage report
```

**Test Results**:
- 135 tests passing (100%)
- Coverage: 90%+ on critical modules

## Troubleshooting

### Issue: WCAG Compliance Warnings

If you see "Cannot achieve WCAG AA" warnings:
- Check color combinations (some pairs are mathematically impossible to fix)
- Try adjusting base color lightness values
- Consider using suggested alternatives from warning messages

### Issue: Cache Not Invalidating

If tokens don't update after changing archetype:
- Check file timestamps are updating correctly
- Manually clear cache with `TokenCache.clear()`
- Verify cache TTL settings

## Migration Guide

See [MIGRATION.md](./docs/MIGRATION.md) for migrating from legacy token systems.

## Contributing

Contributions welcome! See main project [CONTRIBUTING.md](../../CONTRIBUTING.md).

## License

MIT
