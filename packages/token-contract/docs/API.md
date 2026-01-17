# API Reference

Complete API documentation for @tekton/token-contract v0.1.0.

---

## Table of Contents

- [Schemas](#schemas)
- [Presets](#presets)
- [CSS Generator](#css-generator)
- [Theme Provider](#theme-provider-react)
- [Utils](#utils)
- [Types](#types)

---

## Schemas

Zod validation schemas for runtime type checking of token structures.

### ColorTokenSchema

Validates individual OKLCH color token structure.

```typescript
import { ColorTokenSchema } from '@tekton/token-contract';

const result = ColorTokenSchema.safeParse({
  l: 0.6,    // Lightness: 0-1
  c: 0.15,   // Chroma: 0-0.4
  h: 220,    // Hue: 0-360
});

if (result.success) {
  console.log('Valid color token:', result.data);
} else {
  console.error('Validation errors:', result.error);
}
```

**Schema Definition**:
```typescript
z.object({
  l: z.number().min(0).max(1),      // Lightness
  c: z.number().min(0).max(0.4),    // Chroma
  h: z.number().min(0).max(360),    // Hue
})
```

### ColorScaleSchema

Validates 10-step color scale (Tailwind-compatible).

```typescript
import { ColorScaleSchema } from '@tekton/token-contract';

const scale = {
  '50': { l: 0.95, c: 0.05, h: 220 },
  '100': { l: 0.90, c: 0.08, h: 220 },
  // ... through 950
};

const result = ColorScaleSchema.safeParse(scale);
```

**Schema Definition**:
```typescript
z.record(
  z.enum(['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']),
  ColorTokenSchema
)
```

### SemanticTokenSchema

Validates complete semantic token structure.

```typescript
import { SemanticTokenSchema } from '@tekton/token-contract';

const semanticTokens = {
  primary: colorScale,
  secondary: colorScale,
  accent: colorScale,
  neutral: colorScale,
  success: colorScale,
  warning: colorScale,
  error: colorScale,
  info: colorScale,
};

const result = SemanticTokenSchema.safeParse(semanticTokens);
```

**Schema Definition**:
```typescript
z.object({
  primary: ColorScaleSchema,
  secondary: ColorScaleSchema.optional(),
  accent: ColorScaleSchema.optional(),
  neutral: ColorScaleSchema,
  success: ColorScaleSchema,
  warning: ColorScaleSchema,
  error: ColorScaleSchema,
  info: ColorScaleSchema.optional(),
})
```

### StateTokenSchema

Validates interactive state tokens.

```typescript
import { StateTokenSchema } from '@tekton/token-contract';

const stateTokens = {
  default: { l: 0.6, c: 0.15, h: 220 },
  hover: { l: 0.55, c: 0.16, h: 220 },
  active: { l: 0.50, c: 0.17, h: 220 },
  focus: { l: 0.60, c: 0.18, h: 220 },
  disabled: { l: 0.70, c: 0.05, h: 220 },
  error: { l: 0.50, c: 0.15, h: 0 },
};

const result = StateTokenSchema.safeParse(stateTokens);
```

### CompositionTokenSchema

Validates composition tokens (border, shadow, spacing, typography).

```typescript
import { CompositionTokenSchema } from '@tekton/token-contract';

const compositionTokens = {
  border: {
    width: '1px',
    style: 'solid',
    color: { l: 0.8, c: 0.02, h: 220 },
    radius: '4px',
  },
  shadow: {
    x: '0',
    y: '1px',
    blur: '2px',
    spread: '0',
    color: { l: 0, c: 0, h: 0 },
  },
  spacing: {
    padding: '1rem',
    margin: '0.5rem',
    gap: '0.5rem',
  },
  typography: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: '1.5',
    letterSpacing: '0em',
  },
};

const result = CompositionTokenSchema.safeParse(compositionTokens);
```

---

## Presets

Functions for loading and managing curated design presets.

### loadPreset

Load a curated preset by name.

```typescript
function loadPreset(name: PresetName): Preset
```

**Parameters**:
- `name` (PresetName): One of 'professional', 'creative', 'minimal', 'bold', 'warm', 'cool', 'high-contrast'

**Returns**:
- `Preset`: Complete preset object with tokens and composition

**Example**:
```typescript
import { loadPreset } from '@tekton/token-contract';

const preset = loadPreset('professional');

console.log(preset.name);         // 'professional'
console.log(preset.description);  // 'Clean, trustworthy design...'
console.log(preset.tokens);       // SemanticToken object
console.log(preset.composition);  // CompositionToken object
```

**Throws**:
- Error if preset name is invalid

### getAvailablePresets

Get information about all available presets.

```typescript
function getAvailablePresets(): PresetInfo[]
```

**Returns**:
- `PresetInfo[]`: Array of preset metadata

**Example**:
```typescript
import { getAvailablePresets } from '@tekton/token-contract';

const presets = getAvailablePresets();

presets.forEach(preset => {
  console.log(`${preset.name}: ${preset.description}`);
  console.log(`Best for: ${preset.bestFor.join(', ')}`);
});

// Output:
// professional: Clean, trustworthy design for business applications
// Best for: Enterprise apps, dashboards, SaaS platforms
// creative: Vibrant, energetic design for creative tools
// Best for: Design tools, creative platforms, portfolios
// ...
```

### validatePreset

Validate a preset configuration.

```typescript
function validatePreset(preset: Preset): ValidationResult
```

**Parameters**:
- `preset` (Preset): Preset object to validate

**Returns**:
- `ValidationResult`: Validation result with `valid` boolean and `errors` array

**Example**:
```typescript
import { validatePreset, loadPreset } from '@tekton/token-contract';

const preset = loadPreset('professional');
const result = validatePreset(preset);

if (result.valid) {
  console.log('Preset is valid!');
} else {
  console.error('Validation errors:', result.errors);
}
```

### validateWCAGCompliance

Validate color tokens against WCAG AA/AAA standards.

```typescript
function validateWCAGCompliance(tokens: SemanticToken): WCAGComplianceResult
```

**Parameters**:
- `tokens` (SemanticToken): Semantic tokens to validate

**Returns**:
- `WCAGComplianceResult`: Object with `passed` boolean and `violations` array

**Example**:
```typescript
import { validateWCAGCompliance, loadPreset } from '@tekton/token-contract';

const preset = loadPreset('professional');
const compliance = validateWCAGCompliance(preset.tokens);

if (compliance.passed) {
  console.log('All tokens are WCAG compliant!');
} else {
  console.warn('WCAG violations:', compliance.violations);
  compliance.violations.forEach(violation => {
    console.log(`${violation.combination}: ${violation.contrastRatio} (required: ${violation.requiredRatio})`);
  });
}
```

**WCAG Standards**:
- **AA Normal Text**: 4.5:1 contrast ratio
- **AA Large Text**: 3:1 contrast ratio
- **AAA Normal Text**: 7:1 contrast ratio
- **AAA Large Text**: 4.5:1 contrast ratio

---

## CSS Generator

Functions for generating CSS custom properties from tokens.

### generateVariableName

Generate a CSS variable name from semantic token and step.

```typescript
function generateVariableName(semantic: string, step: string): string
```

**Parameters**:
- `semantic` (string): Semantic token name (e.g., 'primary', 'neutral')
- `step` (string): Color scale step (e.g., '500', '900')

**Returns**:
- `string`: CSS variable name (e.g., '--tekton-primary-500')

**Example**:
```typescript
import { generateVariableName } from '@tekton/token-contract';

const varName = generateVariableName('primary', '500');
console.log(varName); // '--tekton-primary-500'
```

### validateVariableName

Validate a CSS variable name.

```typescript
function validateVariableName(name: string): boolean
```

**Parameters**:
- `name` (string): CSS variable name to validate

**Returns**:
- `boolean`: true if valid, false otherwise

**Example**:
```typescript
import { validateVariableName } from '@tekton/token-contract';

console.log(validateVariableName('--tekton-primary-500')); // true
console.log(validateVariableName('--invalid name'));       // false
```

### generateCSSVariables

Generate CSS variables from semantic tokens.

```typescript
function generateCSSVariables(tokens: SemanticToken): string
```

**Parameters**:
- `tokens` (SemanticToken): Semantic tokens

**Returns**:
- `string`: CSS string with `:root` selector and variables

**Example**:
```typescript
import { generateCSSVariables, loadPreset } from '@tekton/token-contract';

const preset = loadPreset('professional');
const css = generateCSSVariables(preset.tokens);

console.log(css);
// Output:
// :root {
//   --tekton-primary-50: oklch(0.95 0.05 220);
//   --tekton-primary-100: oklch(0.90 0.08 220);
//   --tekton-primary-500: oklch(0.60 0.15 220);
//   ...
// }
```

### generateCSSFromTokens

Generate complete CSS including semantic and composition tokens.

```typescript
function generateCSSFromTokens(options: {
  semantic: SemanticToken;
  composition: CompositionToken;
}): string
```

**Parameters**:
- `options.semantic` (SemanticToken): Semantic tokens
- `options.composition` (CompositionToken): Composition tokens

**Returns**:
- `string`: Complete CSS string with all variables

**Example**:
```typescript
import { generateCSSFromTokens, loadPreset } from '@tekton/token-contract';

const preset = loadPreset('professional');
const css = generateCSSFromTokens({
  semantic: preset.tokens,
  composition: preset.composition,
});

console.log(css);
// Output:
// :root {
//   /* Semantic tokens */
//   --tekton-primary-500: oklch(0.60 0.15 220);
//   /* Composition tokens */
//   --tekton-border-width: 1px;
//   --tekton-border-radius: 4px;
//   --tekton-shadow-sm: 0 1px 2px oklch(0 0 0 / 0.1);
//   ...
// }
```

### generateDarkModeCSS

Generate dark mode CSS overrides.

```typescript
function generateDarkModeCSS(darkTokens: SemanticToken): string
```

**Parameters**:
- `darkTokens` (SemanticToken): Dark mode semantic tokens

**Returns**:
- `string`: CSS string with `[data-theme="dark"]` selector

**Example**:
```typescript
import { generateDarkModeCSS, loadPreset } from '@tekton/token-contract';

const preset = loadPreset('professional');
// Invert lightness for dark mode
const darkTokens = invertTokensForDarkMode(preset.tokens);

const darkCSS = generateDarkModeCSS(darkTokens);

console.log(darkCSS);
// Output:
// [data-theme="dark"] {
//   --tekton-primary-50: oklch(0.20 0.15 220);
//   --tekton-primary-500: oklch(0.60 0.15 220);
//   --tekton-primary-900: oklch(0.95 0.05 220);
//   ...
// }
```

### mergeLightAndDarkCSS

Merge light and dark mode CSS into single string.

```typescript
function mergeLightAndDarkCSS(lightCSS: string, darkCSS: string): string
```

**Parameters**:
- `lightCSS` (string): Light mode CSS
- `darkCSS` (string): Dark mode CSS

**Returns**:
- `string`: Merged CSS string

**Example**:
```typescript
import { generateCSSVariables, generateDarkModeCSS, mergeLightAndDarkCSS } from '@tekton/token-contract';

const lightCSS = generateCSSVariables(lightTokens);
const darkCSS = generateDarkModeCSS(darkTokens);
const combinedCSS = mergeLightAndDarkCSS(lightCSS, darkCSS);

console.log(combinedCSS);
// Output:
// :root { ... }
// [data-theme="dark"] { ... }
```

---

## Theme Provider (React)

React context provider for theme management.

### ThemeProvider

React context provider component.

```typescript
function ThemeProvider(props: ThemeProviderProps): JSX.Element
```

**Props**:
- `defaultPreset?` (PresetName): Initial preset (default: 'professional')
- `defaultDarkMode?` (boolean): Initial dark mode state (default: false)
- `detectSystemTheme?` (boolean): Auto-detect system dark mode (default: false)
- `children` (ReactNode): Child components

**Example**:
```typescript
import { ThemeProvider } from '@tekton/token-contract';

function App() {
  return (
    <ThemeProvider
      defaultPreset="professional"
      defaultDarkMode={false}
      detectSystemTheme={true}
    >
      <YourApp />
    </ThemeProvider>
  );
}
```

**Behavior**:
- Injects CSS variables into `:root` element
- Updates `data-theme` attribute on `<html>` element
- Provides theme context to child components
- Listens for system theme changes (if `detectSystemTheme` enabled)

### useTheme

Hook to access theme context.

```typescript
function useTheme(): ThemeContextValue
```

**Returns**:
- `ThemeContextValue`: Theme context object

**Example**:
```typescript
import { useTheme } from '@tekton/token-contract';

function MyComponent() {
  const {
    preset,
    setPreset,
    tokens,
    composition,
    darkMode,
    toggleDarkMode,
  } = useTheme();

  return (
    <div>
      <p>Current preset: {preset}</p>
      <button onClick={() => setPreset('creative')}>Switch to Creative</button>
      <button onClick={toggleDarkMode}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    </div>
  );
}
```

**ThemeContextValue Properties**:
- `preset` (PresetName): Current preset name
- `setPreset` ((preset: PresetName) => void): Change preset
- `tokens` (SemanticToken): Current semantic tokens
- `composition` (CompositionToken): Current composition tokens
- `darkMode` (boolean): Dark mode state
- `toggleDarkMode` (() => void): Toggle dark mode

### applyCSSVariables

Manually apply CSS variables to DOM.

```typescript
function applyCSSVariables(css: string): void
```

**Parameters**:
- `css` (string): CSS string to inject

**Example**:
```typescript
import { applyCSSVariables, generateCSSVariables, loadPreset } from '@tekton/token-contract';

const preset = loadPreset('professional');
const css = generateCSSVariables(preset.tokens);

applyCSSVariables(css);
```

**Behavior**:
- Creates or updates `<style>` tag with id `tekton-css-variables`
- Injects CSS into `<head>`

### removeCSSVariables

Remove injected CSS variables from DOM.

```typescript
function removeCSSVariables(): void
```

**Example**:
```typescript
import { removeCSSVariables } from '@tekton/token-contract';

removeCSSVariables();
```

**Behavior**:
- Removes `<style>` tag with id `tekton-css-variables`

---

## Utils

Utility functions for token management.

### getTokenWithFallback

Get token value with fallback for missing tokens.

```typescript
function getTokenWithFallback(
  tokens: SemanticToken,
  tokenName: keyof SemanticToken,
  step: string,
  customFallback?: ColorToken
): ColorToken
```

**Parameters**:
- `tokens` (SemanticToken): Semantic tokens object
- `tokenName` (keyof SemanticToken): Token name (e.g., 'primary', 'accent')
- `step` (string): Color scale step (e.g., '500')
- `customFallback?` (ColorToken): Custom fallback color (optional)

**Returns**:
- `ColorToken`: Token value or fallback

**Example**:
```typescript
import { getTokenWithFallback, loadPreset } from '@tekton/token-contract';

const preset = loadPreset('professional');

// Get existing token
const primary500 = getTokenWithFallback(preset.tokens, 'primary', '500');

// Get missing token with fallback
const accent500 = getTokenWithFallback(preset.tokens, 'accent', '500', {
  l: 0.6,
  c: 0.12,
  h: 30,
});
```

**Behavior**:
- Returns token if exists
- Logs warning if token missing
- Returns customFallback if provided, otherwise default fallback

### overridePresetTokens

Override preset tokens with custom values.

```typescript
function overridePresetTokens(
  baseTokens: SemanticToken,
  overrides: Partial<SemanticToken>
): SemanticToken
```

**Parameters**:
- `baseTokens` (SemanticToken): Base preset tokens
- `overrides` (Partial<SemanticToken>): Custom token overrides

**Returns**:
- `SemanticToken`: Merged tokens

**Example**:
```typescript
import { overridePresetTokens, loadPreset } from '@tekton/token-contract';

const preset = loadPreset('professional');

const customTokens = overridePresetTokens(preset.tokens, {
  primary: {
    '500': { l: 0.65, c: 0.15, h: 200 }, // Custom blue
  },
  accent: {
    '500': { l: 0.60, c: 0.12, h: 30 }, // Custom orange
  },
});
```

### validateOverride

Validate custom token overrides.

```typescript
function validateOverride(overrides: Partial<SemanticToken>): ValidationResult
```

**Parameters**:
- `overrides` (Partial<SemanticToken>): Custom token overrides

**Returns**:
- `ValidationResult`: Validation result with `valid` boolean and `errors` array

**Example**:
```typescript
import { validateOverride } from '@tekton/token-contract';

const overrides = {
  primary: {
    '500': { l: 0.65, c: 0.15, h: 200 },
  },
};

const result = validateOverride(overrides);

if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

### mergeTokens

Deep merge two semantic token objects.

```typescript
function mergeTokens(
  base: SemanticToken,
  override: Partial<SemanticToken>
): SemanticToken
```

**Parameters**:
- `base` (SemanticToken): Base tokens
- `override` (Partial<SemanticToken>): Override tokens

**Returns**:
- `SemanticToken`: Merged tokens

**Example**:
```typescript
import { mergeTokens } from '@tekton/token-contract';

const merged = mergeTokens(baseTokens, {
  primary: customPrimaryScale,
});
```

---

## Types

TypeScript type definitions.

### ColorToken

OKLCH color token.

```typescript
type ColorToken = {
  l: number; // Lightness: 0-1
  c: number; // Chroma: 0-0.4
  h: number; // Hue: 0-360
};
```

### ColorScale

10-step color scale (Tailwind-compatible).

```typescript
type ColorScale = {
  '50': ColorToken;
  '100': ColorToken;
  '200': ColorToken;
  '300': ColorToken;
  '400': ColorToken;
  '500': ColorToken;
  '600': ColorToken;
  '700': ColorToken;
  '800': ColorToken;
  '900': ColorToken;
  '950': ColorToken;
};
```

### SemanticToken

Complete semantic token structure.

```typescript
type SemanticToken = {
  primary: ColorScale;
  secondary?: ColorScale;
  accent?: ColorScale;
  neutral: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  info?: ColorScale;
};
```

### StateToken

Interactive state tokens.

```typescript
type StateToken = {
  default: ColorToken;
  hover: ColorToken;
  active: ColorToken;
  focus: ColorToken;
  disabled: ColorToken;
  error?: ColorToken;
};
```

### CompositionToken

Composition tokens (border, shadow, spacing, typography).

```typescript
type CompositionToken = {
  border: BorderToken;
  shadow: ShadowToken;
  spacing: SpacingToken;
  typography: TypographyToken;
};

type BorderToken = {
  width: string;        // e.g., '1px'
  style: 'solid' | 'dashed' | 'dotted' | 'none';
  color: ColorToken;
  radius: string;       // e.g., '4px'
};

type ShadowToken = {
  x: string;
  y: string;
  blur: string;
  spread?: string;
  color: ColorToken;
};

type SpacingToken = {
  padding: string;
  margin: string;
  gap: string;
};

type TypographyToken = {
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing: string;
};
```

### PresetName

Available preset names.

```typescript
type PresetName =
  | 'professional'
  | 'creative'
  | 'minimal'
  | 'bold'
  | 'warm'
  | 'cool'
  | 'high-contrast';
```

### Preset

Complete preset structure.

```typescript
type Preset = {
  name: PresetName;
  description: string;
  tokens: SemanticToken;
  composition: CompositionToken;
  darkMode?: SemanticToken;
};
```

### PresetInfo

Preset metadata.

```typescript
type PresetInfo = {
  name: PresetName;
  description: string;
  bestFor: string[];
  primaryHue: number;
};
```

### ValidationResult

Validation result.

```typescript
type ValidationResult = {
  valid: boolean;
  errors: string[];
};
```

### WCAGComplianceResult

WCAG validation result.

```typescript
type WCAGComplianceResult = {
  passed: boolean;
  violations: WCAGCheck[];
};

type WCAGCheck = {
  combination: string;
  contrastRatio: number;
  requiredRatio: number;
  level: 'AA' | 'AAA';
  passed: boolean;
};
```

---

## Error Handling

All validation functions return structured error results.

**Schema Validation Errors**:
```typescript
import { ColorTokenSchema } from '@tekton/token-contract';

const result = ColorTokenSchema.safeParse({ l: 1.5, c: 0.15, h: 220 });

if (!result.success) {
  console.error(result.error.errors);
  // [
  //   {
  //     code: 'too_big',
  //     maximum: 1,
  //     path: ['l'],
  //     message: 'Number must be less than or equal to 1'
  //   }
  // ]
}
```

**WCAG Validation Errors**:
```typescript
import { validateWCAGCompliance } from '@tekton/token-contract';

const compliance = validateWCAGCompliance(tokens);

if (!compliance.passed) {
  compliance.violations.forEach(violation => {
    console.error(`WCAG ${violation.level} violation: ${violation.combination}`);
    console.error(`Contrast: ${violation.contrastRatio} (required: ${violation.requiredRatio})`);
  });
}
```

---

## Performance Characteristics

**Zod Validation**:
- ColorToken validation: <0.1ms
- SemanticToken validation: <0.5ms
- Complete preset validation: <1ms

**CSS Generation**:
- Single color scale: <0.2ms
- Complete semantic tokens: <1.5ms
- Full CSS (semantic + composition + dark): <3ms

**React Performance**:
- Theme change: ≤3 re-renders
- Dark mode toggle: ≤2 re-renders
- CSS variable update: <1ms (native browser)

---

**Last Updated**: 2026-01-17
**Version**: 1.0.0
**Status**: Production Ready
