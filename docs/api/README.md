# API Reference

Complete reference documentation for all public exports from Tekton.

## Table of Contents

- [Schemas Module](#schemas-module)
- [Color Conversion Module](#color-conversion-module)
- [Scale Generation Module](#scale-generation-module)
- [Token Generator Module](#token-generator-module)
- [Component Themes Module](#component-themes-module)
- [WCAG Validator Module](#wcag-validator-module)
- [Usage Patterns](#usage-patterns)

---

## Schemas Module

Type-safe data structures powered by Zod validation.

### OKLCHColorSchema

Validates OKLCH color objects.

```typescript
import { OKLCHColorSchema, type OKLCHColor } from 'tekton';

const color: OKLCHColor = {
  l: 0.5,  // Lightness: 0-1
  c: 0.15, // Chroma: 0-0.5 (typical range 0-0.4)
  h: 220   // Hue: 0-360 degrees
};

// Validate at runtime
OKLCHColorSchema.parse(color); // Throws if invalid
```

**Properties:**
- `l` (number): Lightness from 0 (black) to 1 (white)
- `c` (number): Chroma (saturation) from 0 (gray) to 0.5 (maximum)
- `h` (number): Hue angle from 0 to 360 degrees

### RGBColorSchema

Validates RGB color objects.

```typescript
import { RGBColorSchema, type RGBColor } from 'tekton';

const color: RGBColor = {
  r: 59,   // Red: 0-255
  g: 130,  // Green: 0-255
  b: 246   // Blue: 0-255
};

RGBColorSchema.parse(color);
```

**Properties:**
- `r` (number): Red channel, integer 0-255
- `g` (number): Green channel, integer 0-255
- `b` (number): Blue channel, integer 0-255

### ColorScaleSchema

Validates 10-step color scales.

```typescript
import { type ColorScale } from 'tekton';

const scale: ColorScale = {
  '50': { l: 0.98, c: 0.08, h: 220 },
  '100': { l: 0.95, c: 0.10, h: 220 },
  // ... steps 200-900
  '950': { l: 0.05, c: 0.08, h: 220 }
};
```

**Scale Steps**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

### TokenDefinitionSchema

Validates complete design token structure.

```typescript
import { type TokenDefinition } from 'tekton';

const token: TokenDefinition = {
  id: 'primary-0.500-0.150-220',
  name: 'primary',
  value: { l: 0.5, c: 0.15, h: 220 },
  scale: {
    '50': { l: 0.98, c: 0.08, h: 220 },
    // ... full 10-step scale
  },
  metadata: {
    generated: '2026-01-11T17:00:00.000Z',
    gamutClipped: false
  }
};
```

**Properties:**
- `id` (string): Deterministic identifier
- `name` (string): Token name
- `value` (OKLCHColor): Base color value
- `scale?` (ColorScale): Optional 10-step scale
- `metadata?` (object): Optional metadata (generation time, gamut clipping)

### AccessibilityCheckSchema

Validates WCAG compliance check results.

```typescript
import { type AccessibilityCheck } from 'tekton';

const check: AccessibilityCheck = {
  contrastRatio: 7.5,
  wcagLevel: 'AA',
  passed: true,
  foreground: { r: 0, g: 0, b: 0 },
  background: { r: 255, g: 255, b: 255 }
};
```

**Properties:**
- `contrastRatio` (number): Calculated ratio (1-21)
- `wcagLevel` ('AA' | 'AAA'): Target compliance level
- `passed` (boolean): Whether compliance check passed
- `foreground?` (RGBColor): Foreground color used
- `background?` (RGBColor): Background color used

### ComponentPresetSchema

Validates component theme structure.

```typescript
import { type ComponentPreset } from 'tekton';

const theme: ComponentPreset = {
  name: 'button',
  states: {
    default: { l: 0.5, c: 0.15, h: 220 },
    hover: { l: 0.45, c: 0.15, h: 220 },
    active: { l: 0.40, c: 0.15, h: 220 },
    disabled: { l: 0.65, c: 0.08, h: 220 }
  },
  accessibility: [
    { contrastRatio: 4.8, wcagLevel: 'AA', passed: true }
  ]
};
```

### Other Schemas

- `TokenOutputFormatSchema`: Validates format types ('css' | 'json' | 'js' | 'ts')
- `ThemeModeSchema`: Validates theme modes ('light' | 'dark')

---

## Color Conversion Module

Convert between OKLCH, RGB, and hex color formats.

### oklchToRgb

Convert OKLCH color to RGB.

```typescript
import { oklchToRgb } from 'tekton';

const oklch = { l: 0.5, c: 0.15, h: 220 };
const rgb = oklchToRgb(oklch);
// { r: 59, g: 130, b: 246 }
```

**Algorithm**:
1. Convert OKLCH to OKLab
2. Transform OKLab to linear RGB
3. Apply gamma correction (sRGB)
4. Clamp values to 0-255 range

**Parameters:**
- `oklch` (OKLCHColor): Input OKLCH color

**Returns:** RGBColor

### rgbToOklch

Convert RGB color to OKLCH.

```typescript
import { rgbToOklch } from 'tekton';

const rgb = { r: 59, g: 130, b: 246 };
const oklch = rgbToOklch(rgb);
// { l: 0.58, c: 0.18, h: 248 }
```

**Algorithm**:
1. Convert sRGB to linear RGB
2. Transform to OKLab
3. Convert OKLab to OKLCH (polar coordinates)

**Parameters:**
- `rgb` (RGBColor): Input RGB color

**Returns:** OKLCHColor

### oklchToHex

Convert OKLCH color to hex string.

```typescript
import { oklchToHex } from 'tekton';

const oklch = { l: 0.5, c: 0.15, h: 220 };
const hex = oklchToHex(oklch);
// "#3B82F6"
```

**Parameters:**
- `oklch` (OKLCHColor): Input OKLCH color

**Returns:** string (uppercase hex with # prefix)

### hexToOklch

Convert hex string to OKLCH color.

```typescript
import { hexToOklch } from 'tekton';

const oklch = hexToOklch('#3B82F6');
// { l: 0.58, c: 0.18, h: 248 }

// Works with or without # prefix
const oklch2 = hexToOklch('3B82F6');
```

**Parameters:**
- `hex` (string): Hex color string (with or without #)

**Returns:** OKLCHColor

---

## Scale Generation Module

Generate perceptually uniform color scales.

### generateLightnessScale

Generate a 10-step lightness scale from a base color.

```typescript
import { generateLightnessScale } from 'tekton';

const baseColor = { l: 0.5, c: 0.15, h: 220 };
const scale = generateLightnessScale(baseColor);

// Returns ColorScale with steps:
// 50: lightest (~0.98 lightness)
// 100-900: graduated steps
// 950: darkest (~0.05 lightness)
```

**Lightness Mapping:**
- 50: 0.98 (near white)
- 100: 0.95
- 200: 0.88
- 300: 0.78
- 400: 0.65
- 500: base color lightness (reference point)
- 600: base * 0.85 (minimum 0.35)
- 700: base * 0.70 (minimum 0.25)
- 800: base * 0.55 (minimum 0.15)
- 900: base * 0.40 (minimum 0.10)
- 950: base * 0.25 (minimum 0.05)

**Chroma Adjustment:**
- Very light colors (L > 0.9): chroma * 0.5
- Very dark colors (L < 0.2): chroma * 0.7
- Mid-range: preserve base chroma

**Parameters:**
- `baseColor` (OKLCHColor): Base color for scale generation

**Returns:** ColorScale (10 steps)

### generateColorScales

Generate scales for multiple colors at once.

```typescript
import { generateColorScales } from 'tekton';

const palette = {
  primary: { l: 0.5, c: 0.15, h: 220 },
  success: { l: 0.5, c: 0.15, h: 140 },
  error: { l: 0.5, c: 0.15, h: 0 }
};

const scales = generateColorScales(palette);
// {
//   primary: ColorScale,
//   success: ColorScale,
//   error: ColorScale
// }
```

**Parameters:**
- `palette` (Record<string, OKLCHColor>): Named color palette

**Returns:** Record<string, ColorScale>

---

## Token Generator Module

The Token Generator module provides the core Layer 1 functionality for design token generation from archetype JSON presets.

### Core Functions

#### `generateTokensFromArchetype(archetype, options?)`

Main token generation function. Converts archetype JSON to validated design tokens with OKLCH color space support and WCAG compliance validation.

```typescript
import { generateTokensFromArchetype } from '@tekton/token-generator';

const tokens = await generateTokensFromArchetype(archetype, {
  wcagLevel: 'AA',
  cacheEnabled: true,
  cacheTTL: 3600000 // 1 hour
});
```

**Options**:
- `wcagLevel`: WCAG compliance level ('AA' | 'AAA')
- `cacheEnabled`: Enable token caching (boolean)
- `cacheTTL`: Cache time-to-live in milliseconds (number)

**Returns**: Generated tokens object containing color tokens, semantic tokens, and metadata

**Throws**:
- `ArchetypeValidationError` if archetype JSON is invalid
- `WCAGComplianceError` if colors cannot meet specified WCAG level

#### `TokenCache` Class

LRU cache for token generation results with file-based invalidation and memory management.

```typescript
import { TokenCache } from '@tekton/token-generator';

const cache = new TokenCache({
  maxSize: 100,
  ttl: 3600000,
  invalidateOnChange: true
});

// Cache tokens
cache.set('premium-editorial', tokens);

// Retrieve tokens
const cached = cache.get('premium-editorial');

// Clear cache
cache.clear();
```

**Constructor Options**:
- `maxSize`: Maximum number of cached entries (default: 100)
- `ttl`: Time-to-live in milliseconds (default: 3600000)
- `invalidateOnChange`: Auto-invalidate on file changes (default: true)

**Methods**:
- `set(key, value)`: Store tokens in cache
- `get(key)`: Retrieve cached tokens
- `has(key)`: Check if key exists in cache
- `delete(key)`: Remove specific cache entry
- `clear()`: Clear entire cache

#### `autoAdjustContrast(foreground, background, wcagLevel)`

Automatically adjusts color lightness to meet WCAG contrast requirements. Uses iterative adjustment algorithm to find the optimal lightness value.

```typescript
import { autoAdjustContrast } from '@tekton/token-generator';

const adjusted = autoAdjustContrast(
  { r: 150, g: 150, b: 150 }, // Foreground
  { r: 255, g: 255, b: 255 }, // Background
  'AA' // WCAG level
);

// Returns: Adjusted color meeting 4.5:1 ratio
```

**Parameters**:
- `foreground`: RGB color object for text or foreground element
- `background`: RGB color object for background surface
- `wcagLevel`: Target compliance level ('AA' requires 4.5:1, 'AAA' requires 7:1)

**Returns**: Adjusted RGB color object that meets contrast requirement

**Algorithm**:
1. Calculate current contrast ratio
2. If below threshold, darken foreground or lighten background
3. Iterate in 0.05 lightness steps until ratio achieved
4. Return adjusted color with metadata

#### Export Functions

```typescript
import {
  exportToCSS,
  exportToTailwind,
  exportToDTCG
} from '@tekton/token-generator';

// Export to CSS custom properties
const css = exportToCSS(tokens, {
  format: 'oklch',
  prefix: '--',
  minify: false
});

// Export to Tailwind config
const tailwind = exportToTailwind(tokens, {
  format: 'js' // or 'ts'
});

// Export to DTCG format
const dtcg = exportToDTCG(tokens);
```

**`exportToCSS(tokens, options?)`**:
- `format`: 'oklch' | 'rgb' | 'both' (default: 'oklch')
- `prefix`: CSS variable prefix (default: '--')
- `minify`: Remove whitespace for production (default: false)

**`exportToTailwind(tokens, options?)`**:
- `format`: 'js' | 'ts' - Output JavaScript or TypeScript config

**`exportToDTCG(tokens)`**:
- Exports Design Token Community Group compliant JSON
- Includes type information and metadata for design tools

### Configuration

```typescript
interface TokenGeneratorConfig {
  wcagLevel: 'AA' | 'AAA';
  cacheEnabled: boolean;
  cacheTTL: number;
  maxCacheSize: number;
}
```

## Original Token Generator Module (Legacy)

Core token generation with caching and multi-format export.

### generateToken

Generate a single design token with full scale.

```typescript
import { generateToken } from 'tekton';

const token = generateToken('primary', { l: 0.5, c: 0.15, h: 220 });

console.log(token.id); // "primary-0.500-0.150-220"
console.log(token.name); // "primary"
console.log(token.value); // { l: 0.5, c: 0.15, h: 220 }
console.log(token.scale); // ColorScale with 10 steps
console.log(token.metadata); // { generated: ISO timestamp, gamutClipped: false }
```

**Gamut Clipping:**
If the input color exceeds sRGB gamut boundaries, the function automatically reduces chroma in 0.01 steps until the color is displayable. This is tracked in `metadata.gamutClipped`.

**Parameters:**
- `name` (string): Token name
- `baseColor` (OKLCHColor): Base color value

**Returns:** TokenDefinition

**Throws:** Zod validation error if baseColor is invalid

### generateTokenId

Generate deterministic token identifier.

```typescript
import { generateTokenId } from 'tekton';

const id = generateTokenId('primary', { l: 0.5, c: 0.15, h: 220 });
// "primary-0.500-0.150-220"

// Same input always produces same ID
const id2 = generateTokenId('primary', { l: 0.5, c: 0.15, h: 220 });
// id === id2 (true)
```

**Format:** `{name}-{lightness}-{chroma}-{hue}`
- Lightness: 3 decimal places
- Chroma: 3 decimal places
- Hue: whole number
- Non-alphanumeric characters replaced with hyphens

**Parameters:**
- `name` (string): Token name
- `color` (OKLCHColor): Color value

**Returns:** string (deterministic ID)

### TokenGenerator Class

Batch token generation with caching and export.

```typescript
import { TokenGenerator } from 'tekton';

const generator = new TokenGenerator({
  generateDarkMode: true,
  validateWCAG: true,
  wcagLevel: 'AA'
});
```

**Constructor Options:**
- `generateDarkMode?` (boolean): Generate dark mode variants (default: false)
- `validateWCAG?` (boolean): Enable WCAG validation (default: true)
- `wcagLevel?` ('AA' | 'AAA'): WCAG compliance level (default: 'AA')

#### generateTokens

Generate tokens from a color palette.

```typescript
const palette = {
  primary: { l: 0.5, c: 0.15, h: 220 },
  success: { l: 0.5, c: 0.15, h: 140 }
};

const tokens = generator.generateTokens(palette);
// Returns TokenDefinition[] (includes dark mode if enabled)
```

**Caching:** Results are cached by color value for performance. Identical inputs skip regeneration.

**Dark Mode:** When enabled, generates additional tokens with `-dark` suffix and inverted lightness.

**Parameters:**
- `palette` (Record<string, OKLCHColor>): Named color palette

**Returns:** TokenDefinition[]

#### exportTokens

Export tokens to various formats.

```typescript
const css = generator.exportTokens(palette, 'css');
const json = generator.exportTokens(palette, 'json');
const js = generator.exportTokens(palette, 'js');
const ts = generator.exportTokens(palette, 'ts');
```

**CSS Output:**
```css
:root {
  --primary: #3B82F6;
  --primary-50: #EFF6FF;
  --primary-100: #DBEAFE;
  /* ... */
  --primary-950: #0A2540;
}
```

**JSON Output:**
```json
{
  "primary": {
    "value": "#3B82F6",
    "oklch": { "l": 0.5, "c": 0.15, "h": 220 },
    "scale": {
      "50": "#EFF6FF",
      "100": "#DBEAFE"
    }
  }
}
```

**JavaScript Output:**
```javascript
export const primary = '#3B82F6';
export const primaryScale = {
  '50': '#EFF6FF',
  '100': '#DBEAFE',
  // ...
};
```

**TypeScript Output:**
```typescript
export const primary = '#3B82F6' as const;
export const primaryScale = {
  '50': '#EFF6FF' as const,
  '100': '#DBEAFE' as const,
  // ...
} as const;
```

**Parameters:**
- `palette` (Record<string, OKLCHColor>): Color palette
- `format` (TokenOutputFormat): Export format

**Returns:** string

#### clearCache

Clear the internal token cache.

```typescript
generator.clearCache();
```

---

## Component Themes Module

Pre-configured tokens for common UI components.

### buttonPreset

Generate button component tokens.

```typescript
import { buttonPreset } from 'tekton';

const baseColor = { l: 0.5, c: 0.15, h: 220 };
const button = buttonPreset(baseColor);

// button.states:
// - default: base color
// - hover: 90% lightness (darker)
// - active: 80% lightness (darkest)
// - disabled: 130% lightness, 50% chroma (lighter, desaturated)
```

**States:**
- `default`: Base color
- `hover`: Darkened for hover interaction
- `active`: Darkened further for active/pressed state
- `disabled`: Lightened and desaturated

### inputPreset

Generate input component tokens.

```typescript
import { inputPreset } from 'tekton';

const input = inputPreset(baseColor);

// input.states:
// - default: base color
// - focus: increased chroma (more saturated)
// - error: red (L: 0.5, C: 0.15, H: 0)
// - disabled: light gray
```

**States:**
- `default`: Base color
- `focus`: Increased chroma (up to 0.4 maximum)
- `error`: Red error state
- `disabled`: Desaturated gray

### cardPreset

Generate card component tokens.

```typescript
import { cardPreset } from 'tekton';

const card = cardPreset(baseColor);

// card.states:
// - background: very light tint of base hue
// - border: medium tint of base hue
// - shadow: dark tint of base hue
```

**States:**
- `background`: L: 0.98, C: 0.02 (subtle tint)
- `border`: L: 0.85, C: 0.05
- `shadow`: L: 0.30, C: 0.02

### badgePreset

Generate badge/pill component tokens.

```typescript
import { badgePreset } from 'tekton';

const badge = badgePreset(baseColor);

// badge.states:
// - info: blue (H: 220)
// - success: green (H: 140)
// - warning: yellow/orange (H: 60)
// - error: red (H: 0)
```

**States:** All at L: 0.5, C: 0.15 with semantic hues

### alertPreset

Generate alert/notification component tokens.

```typescript
import { alertPreset } from 'tekton';

const alert = alertPreset(baseColor);

// alert.states:
// - info: light blue background
// - success: light green background
// - warning: light yellow background
// - error: light red background
```

**States:** All at L: 0.9-0.92 (light backgrounds), C: 0.08 (subtle)

### linkPreset

Generate link component tokens.

```typescript
import { linkPreset } from 'tekton';

const link = linkPreset(baseColor);

// link.states:
// - default: blue (L: 0.4)
// - hover: darker blue (L: 0.35)
// - visited: purple (H: 280)
// - active: darkest blue (L: 0.3)
```

### checkboxPreset & radioPreset

Generate checkbox and radio button tokens.

```typescript
import { checkboxPreset, radioPreset } from 'tekton';

const checkbox = checkboxPreset(baseColor);
// states: unchecked (light gray), checked (base), indeterminate (darker base)

const radio = radioPreset(baseColor);
// states: unselected (light gray), selected (base)
```

### generateComponentPresets

Generate all 8 themes at once.

```typescript
import { generateComponentPresets } from 'tekton';

const allPresets = generateComponentPresets(baseColor);
// Returns ComponentPreset[] with all 8 themes
```

### COMPONENT_PRESETS

Export object with all theme functions.

```typescript
import { COMPONENT_PRESETS } from 'tekton';

const button = COMPONENT_PRESETS.button(baseColor);
const input = COMPONENT_PRESETS.input(baseColor);
// ...
```

---

## WCAG Validator Module

WCAG AA/AAA contrast validation and compliance checking.

### calculateContrastRatio

Calculate WCAG contrast ratio between two colors.

```typescript
import { calculateContrastRatio } from 'tekton';

const foreground = { r: 0, g: 0, b: 0 }; // Black
const background = { r: 255, g: 255, b: 255 }; // White
const ratio = calculateContrastRatio(foreground, background);
// 21 (maximum possible contrast)
```

**Formula:** (L1 + 0.05) / (L2 + 0.05) where L1 is lighter color

**Range:** 1 (no contrast) to 21 (maximum contrast)

**Parameters:**
- `color1` (RGBColor): First color
- `color2` (RGBColor): Second color

**Returns:** number (1-21)

### checkWCAGCompliance

Check if contrast ratio meets WCAG level.

```typescript
import { checkWCAGCompliance } from 'tekton';

const result = checkWCAGCompliance(4.8, 'AA', false);
// { contrastRatio: 4.8, wcagLevel: 'AA', passed: true }

const largeText = checkWCAGCompliance(3.2, 'AA', true);
// { contrastRatio: 3.2, wcagLevel: 'AA', passed: true }
```

**WCAG AA Requirements:**
- Normal text: minimum 4.5:1
- Large text (18pt+): minimum 3:1

**WCAG AAA Requirements:**
- Normal text: minimum 7:1
- Large text: minimum 4.5:1

**Parameters:**
- `contrastRatio` (number): Calculated ratio
- `level` ('AA' | 'AAA'): Target compliance level
- `isLargeText?` (boolean): Whether text is large (default: false)

**Returns:** AccessibilityCheck

### validateColorPair

Validate a foreground-background color pair.

```typescript
import { validateColorPair } from 'tekton';

const fg = { r: 0, g: 0, b: 0 };
const bg = { r: 255, g: 255, b: 255 };

const result = validateColorPair(fg, bg, 'AA', false);
// {
//   contrastRatio: 21,
//   wcagLevel: 'AA',
//   passed: true,
//   foreground: { r: 0, g: 0, b: 0 },
//   background: { r: 255, g: 255, b: 255 }
// }
```

**Parameters:**
- `foreground` (RGBColor): Text/foreground color
- `background` (RGBColor): Background color
- `level?` ('AA' | 'AAA'): Target level (default: 'AA')
- `isLargeText?` (boolean): Large text flag (default: false)

**Returns:** AccessibilityCheck (includes original colors)

### suggestLightnessAdjustment

Suggest lightness adjustment for WCAG compliance.

```typescript
import { suggestLightnessAdjustment } from 'tekton';

const fg = { r: 100, g: 100, b: 100 }; // Gray text
const bg = { r: 200, g: 200, b: 200 }; // Light gray bg

const suggestion = suggestLightnessAdjustment(fg, bg, 'AA');
// Returns number (suggested lightness) or null if already compliant
```

**Heuristic:** Suggests darkening foreground or lightening background in 0.1 increments.

**Note:** This is a simple heuristic. For production use, iterate with OKLCH lightness adjustments.

**Parameters:**
- `foreground` (RGBColor): Text color
- `background` (RGBColor): Background color
- `targetLevel?` ('AA' | 'AAA'): Target level (default: 'AA')

**Returns:** number | null

---

## Usage Patterns

### Complete Workflow Example

```typescript
import {
  generateToken,
  TokenGenerator,
  generateComponentPresets,
  validateColorPair,
  oklchToRgb,
  oklchToHex
} from 'tekton';

// 1. Define brand color in OKLCH
const brandColor = { l: 0.5, c: 0.15, h: 220 };

// 2. Generate primary token
const primaryToken = generateToken('primary', brandColor);

// 3. Export to CSS variables
const generator = new TokenGenerator({ generateDarkMode: true });
const css = generator.exportTokens({ primary: brandColor }, 'css');

// 4. Generate component themes
const themes = generateComponentPresets(brandColor);
const buttonStates = themes.find(p => p.name === 'button');

// 5. Validate accessibility
const fg = oklchToRgb(buttonStates.states.default);
const bg = { r: 255, g: 255, b: 255 };
const accessibility = validateColorPair(fg, bg, 'AA');

console.log(`Button color: ${oklchToHex(buttonStates.states.default)}`);
console.log(`WCAG AA compliant: ${accessibility.passed}`);
```

### Integration with Tailwind CSS

```typescript
import { TokenGenerator } from 'tekton';

const generator = new TokenGenerator();
const palette = {
  primary: { l: 0.5, c: 0.15, h: 220 },
  secondary: { l: 0.5, c: 0.12, h: 280 }
};

// Generate tokens
const tokens = generator.generateTokens(palette);

// Convert to Tailwind theme extension
const tailwindColors = {};
tokens.forEach(token => {
  const scaleHex = {};
  Object.entries(token.scale).forEach(([step, color]) => {
    scaleHex[step] = oklchToHex(color);
  });
  tailwindColors[token.name] = scaleHex;
});

// Use in tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       colors: tailwindColors
//     }
//   }
// }
```

### Type-Safe Token System

```typescript
import { type TokenDefinition, type OKLCHColor } from 'tekton';

// Define your design system type
interface DesignSystem {
  colors: {
    primary: TokenDefinition;
    secondary: TokenDefinition;
    success: TokenDefinition;
    error: TokenDefinition;
  };
}

// Create type-safe token generator
function createDesignSystem(
  primary: OKLCHColor,
  secondary: OKLCHColor,
  success: OKLCHColor,
  error: OKLCHColor
): DesignSystem {
  return {
    colors: {
      primary: generateToken('primary', primary),
      secondary: generateToken('secondary', secondary),
      success: generateToken('success', success),
      error: generateToken('error', error)
    }
  };
}
```

---

## Performance Notes

- **Caching**: `TokenGenerator` caches results by color value. Use `clearCache()` if memory is a concern.
- **Batch Generation**: `generateTokens()` is more efficient than multiple `generateToken()` calls.
- **Export Formats**: JSON and TypeScript exports include full type information for IDE autocomplete.
- **Gamut Clipping**: Iterative chroma reduction may take 1-2ms for highly saturated colors.

---

## Error Handling

All public functions validate inputs using Zod schemas. Invalid inputs throw descriptive errors:

```typescript
try {
  const token = generateToken('primary', { l: 1.5, c: 0.15, h: 220 }); // Invalid
} catch (error) {
  console.error(error.message);
  // "Validation error: l must be between 0 and 1"
}
```

---

For working examples, see [Examples Directory](../examples/).

For architecture details, see [Architecture Documentation](../architecture/README.md).
