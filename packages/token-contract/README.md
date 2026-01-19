# @tekton/token-contract

Token Contract & CSS Variable System with Zod validation and curated themes.

## Features

- ✅ **Type-Safe Tokens**: Zod schemas for runtime validation
- ✅ **7 Curated Themes**: Professional, Creative, Minimal, Bold, Warm, Cool, High-Contrast
- ✅ **WCAG Compliance**: Automatic contrast validation
- ✅ **CSS Variable Generation**: Generate valid CSS custom properties
- ✅ **Dark Mode Support**: Built-in dark theme variants
- ✅ **React Integration**: ThemeProvider with hooks
- ✅ **OKLCH Color Space**: Modern perceptually uniform colors
- ✅ **State Tokens**: Interactive component states (hover, active, focus, disabled, error)
- ✅ **Fallback Handling**: Graceful degradation with warnings
- ✅ **Theme Override**: Customize themes with validation

## Installation

```bash
npm install @tekton/token-contract
# or
pnpm add @tekton/token-contract
```

## Quick Start

### Basic Usage

```typescript
import { loadPreset, generateCSSFromTokens } from '@tekton/token-contract';

// Load a theme
const theme = loadPreset('professional');

// Generate CSS variables
const css = generateCSSFromTokens({
  semantic: theme.tokens,
  composition: theme.composition,
});

console.log(css);
// Output:
// :root {
//   --tekton-primary-50: oklch(0.95 0.05 220);
//   --tekton-primary-500: oklch(0.60 0.15 220);
//   ...
// }
```

### React Integration

```tsx
import { ThemeProvider, useTheme } from '@tekton/token-contract';

function App() {
  return (
    <ThemeProvider defaultPreset="professional" defaultDarkMode={false}>
      <YourApp />
    </ThemeProvider>
  );
}

function YourComponent() {
  const { theme, tokens, darkMode, setPreset, toggleDarkMode } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setPreset('creative')}>Switch to Creative</button>
      <button onClick={toggleDarkMode}>Toggle Dark Mode</button>
    </div>
  );
}
```

## Available Themes

### Professional
Clean, trustworthy design for business applications.
- Primary: Blue (220°)
- Best for: Enterprise apps, dashboards, SaaS

### Creative
Vibrant, energetic design for creative tools.
- Primary: Purple (270°)
- Best for: Design tools, creative platforms

### Minimal
Subtle, understated design for content-first experiences.
- Primary: Neutral with slight blue tint
- Best for: Blogs, documentation, reading apps

### Bold
High-contrast, attention-grabbing design.
- Primary: Saturated blue (220°)
- Best for: Marketing sites, landing pages

### Warm
Inviting, friendly design with warm tones.
- Primary: Orange (40°)
- Best for: Social apps, community platforms

### Cool
Calm, modern design with cool tones.
- Primary: Cyan (200°)
- Best for: Health apps, wellness platforms

### High-Contrast
Maximum accessibility with WCAG AAA compliance.
- Primary: High saturation blue (220°)
- Best for: Accessibility-first applications

## Architecture Overview

The Token Contract system provides a comprehensive token management layer with:

- **Token Transformation Pipeline**: Validates tokens through Zod schemas, ensures WCAG compliance, and generates CSS variables
- **7 Curated Themes**: Professional, Creative, Minimal, Bold, Warm, Cool, High-Contrast design systems
- **CSS Variable Generation**: Automatic conversion to CSS custom properties with dark mode support
- **React Integration**: ThemeProvider context with optimized re-rendering

```
OKLCH Tokens → Zod Validation → WCAG Check → CSS Variables → ThemeProvider → Components
```

For detailed architecture documentation including system diagrams, see [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

## API Reference

### Themes

#### `loadPreset(name: PresetName): Theme`

Load a curated theme by name.

```typescript
const theme = loadPreset('professional');
console.log(theme.tokens.primary['500']); // oklch(0.60 0.15 220)
```

#### `getAllPresets(): PresetInfo[]`

Get information about all available themes.

```typescript
const themes = getAllPresets();
themes.forEach(p => console.log(p.name, p.description));
```

### CSS Generation

#### `generateCSSVariables(tokens: SemanticToken): string`

Generate CSS variables from semantic tokens.

```typescript
const css = generateCSSVariables(theme.tokens);
// :root { --tekton-primary-500: oklch(...); ... }
```

#### `generateCSSFromTokens(options): string`

Generate complete CSS with semantic and composition tokens.

```typescript
const css = generateCSSFromTokens({
  semantic: theme.tokens,
  composition: theme.composition,
});
```

#### `generateDarkModeCSS(darkTokens: SemanticToken): string`

Generate dark mode CSS overrides.

```typescript
const darkCSS = generateDarkModeCSS(darkTokens);
// [data-theme="dark"] { --tekton-primary-500: oklch(...); ... }
```

### Theme Provider

#### `<ThemeProvider>`

React context provider for theme management.

**Props:**
- `defaultPreset?: PresetName` - Initial theme (default: 'professional')
- `defaultDarkMode?: boolean` - Initial dark mode state (default: false)
- `detectSystemTheme?: boolean` - Auto-detect system dark mode (default: false)

```tsx
<ThemeProvider defaultPreset="creative" defaultDarkMode={false}>
  <App />
</ThemeProvider>
```

#### `useTheme()`

Hook to access theme context.

**Returns:**
- `theme: PresetName` - Current theme name
- `setPreset: (theme: PresetName) => void` - Change theme
- `tokens: SemanticToken` - Current semantic tokens
- `composition: CompositionToken` - Current composition tokens
- `darkMode: boolean` - Dark mode state
- `toggleDarkMode: () => void` - Toggle dark mode

```tsx
const { theme, setPreset, darkMode, toggleDarkMode } = useTheme();
```

### Validation

#### `validateWCAGCompliance(tokens: SemanticToken)`

Validate tokens against WCAG contrast requirements.

```typescript
const compliance = validateWCAGCompliance(theme.tokens);
if (compliance.passed) {
  console.log('WCAG compliant!');
} else {
  console.log('Violations:', compliance.violations);
}
```

### Utils

#### `getTokenWithFallback(tokens, tokenName, step, customFallback?)`

Get a token value with fallback for missing tokens.

```typescript
const color = getTokenWithFallback(tokens, 'accent', '500');
// Logs warning if missing, returns fallback
```

#### `overridePresetTokens(baseTokens, overrides)`

Override theme tokens with custom values.

```typescript
const customTokens = overridePresetTokens(theme.tokens, {
  primary: {
    '500': 'oklch(0.65 0.15 200)',
  },
});
```

#### `validateOverride(overrides)`

Validate custom override tokens.

```typescript
const result = validateOverride({
  primary: { '500': 'oklch(0.65 0.15 200)' },
});

if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

## Type Safety

All tokens are validated with Zod schemas:

```typescript
import { SemanticTokenSchema } from '@tekton/token-contract';

// Runtime validation
const result = SemanticTokenSchema.safeParse(tokens);
if (!result.success) {
  console.error(result.error);
}
```

## CSS Variable Naming Convention

All CSS variables follow the `--tekton-{semantic}-{step}` convention:

```css
--tekton-primary-50
--tekton-primary-500
--tekton-neutral-500
--tekton-success-500
--tekton-border-default
--tekton-shadow-sm
```

## WCAG Compliance

All themes are validated for WCAG AA compliance:

- Text contrast ratio ≥ 4.5:1 (normal text)
- Large text contrast ratio ≥ 3:1
- High-contrast theme meets WCAG AAA

## Dark Mode

Dark mode is supported via the `[data-theme="dark"]` attribute:

```typescript
import { generateDarkModeCSS, mergeLightAndDarkCSS } from '@tekton/token-contract';

const lightCSS = generateCSSVariables(lightTokens);
const darkCSS = generateDarkModeCSS(darkTokens);
const combinedCSS = mergeLightAndDarkCSS(lightCSS, darkCSS);
```

The ThemeProvider automatically manages the `data-theme` attribute.

## Browser Support

- CSS Custom Properties: All modern browsers
- OKLCH Color Space: Chrome 111+, Safari 15.4+, Firefox 113+

For older browsers, consider using a PostCSS plugin to convert OKLCH to RGB/HSL.

## Performance

- ✅ Memoized token derivation in ThemeProvider
- ✅ Stable callback references with useCallback
- ✅ Target: ≤3 re-renders per theme change
- ✅ Zod validation: <1ms per token

## Testing

This package includes comprehensive tests:

- 211+ test cases
- 97% code coverage
- Unit tests for all modules
- Integration tests with OKLCH system
- React component testing with @testing-library/react

## Troubleshooting

### CSS Variables Not Updating

**Issue**: CSS variables not updating when theme changes.

**Solution**: Ensure ThemeProvider is at the root of your component tree:

```tsx
// ✅ Correct
function App() {
  return (
    <ThemeProvider defaultPreset="professional">
      <div>
        <YourApp />
      </div>
    </ThemeProvider>
  );
}
```

### OKLCH Colors Not Rendering

**Issue**: OKLCH colors displaying as black or not rendering.

**Solution**: Check browser compatibility. OKLCH requires Chrome 111+, Firefox 113+, or Safari 15.4+. Add fallback for older browsers:

```css
.button {
  background-color: #3b82f6; /* RGB fallback */
  background-color: var(--tekton-primary-500); /* OKLCH preferred */
}
```

### Dark Mode Not Applying

**Issue**: Dark mode toggle not applying dark theme.

**Solution**: Verify `data-theme` attribute is set on root element:

```tsx
import { useEffect } from 'react';
import { useTheme } from '@tekton/token-contract';

function App() {
  const { darkMode } = useTheme();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return <YourApp />;
}
```

For more troubleshooting tips, see [docs/INTEGRATION.md](./docs/INTEGRATION.md#troubleshooting).

## Documentation

- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System architecture with Mermaid diagrams
- **[INTEGRATION.md](./docs/INTEGRATION.md)** - Integration patterns with CSS-in-JS libraries
- **[MIGRATION.md](./docs/MIGRATION.md)** - Migration guides from Tailwind, Chakra UI, Material-UI
- **[API.md](./docs/API.md)** - Complete API reference
- **[BEST-PRACTICES.md](./docs/BEST-PRACTICES.md)** - Recommended patterns and decision trees
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines

## License

MIT

## Related Packages

- `@tekton/theme` - Theme schemas and utilities
- `@tekton/token-generator` - OKLCH token generation
- `@tekton/hooks` - Headless UI hooks (SPEC-COMPONENT-001)
