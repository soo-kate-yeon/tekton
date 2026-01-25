# Getting Started with Tekton

Complete guide to installing and using Tekton for OKLCH-based design token generation.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Generating Color Palettes](#generating-color-palettes)
- [Using Component Themes](#using-component-themes)
- [Exporting Tokens](#exporting-tokens)
- [Dark Mode Setup](#dark-mode-setup)
- [WCAG Compliance Validation](#wcag-compliance-validation)
- [Advanced Topics](#advanced-topics)

---

## Installation

### Prerequisites

- **Node.js**: ≥20.0.0 (check with `node --version`)
- **Package Manager**: npm, yarn, or pnpm

### Install via npm

```bash
npm install tekton
```

### Install via yarn

```bash
yarn add tekton
```

### Install via pnpm

```bash
pnpm add tekton
```

### Verify Installation

```typescript
import { VERSION } from 'tekton';
console.log(`Tekton v${VERSION}`);
```

---

## Basic Usage

### Understanding OKLCH

OKLCH is a perceptually uniform color space with three components:

- **L** (Lightness): 0 (black) to 1 (white)
- **C** (Chroma): 0 (gray) to 0.4 (typical maximum saturation)
- **H** (Hue): 0-360 degrees (0° = red, 120° = green, 240° = blue)

### Your First Token

```typescript
import { generateToken, oklchToHex } from 'tekton';

// Define a blue color in OKLCH
const blueColor = {
  l: 0.5,   // Medium lightness
  c: 0.15,  // Moderate saturation
  h: 220    // Blue hue
};

// Generate a complete design token
const primaryToken = generateToken('primary', blueColor);

console.log('Token ID:', primaryToken.id);
// "primary-0.500-0.150-220"

console.log('Base Color (hex):', oklchToHex(primaryToken.value));
// "#0066CC"

console.log('Lightness Scale:');
Object.entries(primaryToken.scale).forEach(([step, color]) => {
  console.log(`  ${step}: ${oklchToHex(color)}`);
});
// 50: #EFF6FF (lightest)
// 100: #DBEAFE
// ... through ...
// 950: #0A2540 (darkest)
```

### Color Conversion

```typescript
import { hexToOklch, rgbToOklch, oklchToRgb } from 'tekton';

// Convert from hex
const oklch1 = hexToOklch('#3B82F6');
console.log(oklch1);
// { l: 0.58, c: 0.18, h: 248 }

// Convert from RGB
const oklch2 = rgbToOklch({ r: 59, g: 130, b: 246 });
console.log(oklch2);
// { l: 0.58, c: 0.18, h: 248 }

// Convert to RGB
const rgb = oklchToRgb({ l: 0.5, c: 0.15, h: 220 });
console.log(rgb);
// { r: 0, g: 102, b: 204 }
```

---

## Generating Color Palettes

### Single Color Palette

```typescript
import { generateToken, oklchToHex } from 'tekton';

// Define brand color
const brandColor = hexToOklch('#FF6B6B'); // Coral red

// Generate token with full scale
const token = generateToken('brand', brandColor);

// Access specific shades
const lightestShade = oklchToHex(token.scale['50']);  // Near white
const baseColor = oklchToHex(token.scale['500']);     // Original color
const darkestShade = oklchToHex(token.scale['950']);  // Near black

console.log('50:', lightestShade);   // For backgrounds
console.log('500:', baseColor);      // For primary use
console.log('950:', darkestShade);   // For text
```

### Complete Palette System

```typescript
import { TokenGenerator } from 'tekton';

const generator = new TokenGenerator();

// Define semantic colors
const palette = {
  primary: { l: 0.5, c: 0.15, h: 220 },     // Blue
  secondary: { l: 0.5, c: 0.12, h: 280 },   // Purple
  success: { l: 0.5, c: 0.15, h: 140 },     // Green
  warning: { l: 0.6, c: 0.15, h: 60 },      // Yellow
  error: { l: 0.5, c: 0.15, h: 0 },         // Red
  neutral: { l: 0.5, c: 0.02, h: 220 },     // Subtle blue-gray
};

// Generate all tokens
const tokens = generator.generateTokens(palette);

tokens.forEach(token => {
  console.log(`${token.name}:`, oklchToHex(token.value));
});
```

---

## Using Component Themes

### Button Component

```typescript
import { buttonPreset, oklchToHex } from 'tekton';

const primaryColor = { l: 0.5, c: 0.15, h: 220 };
const button = buttonPreset(primaryColor);

// Access button states
const colors = {
  default: oklchToHex(button.states.default),
  hover: oklchToHex(button.states.hover),
  active: oklchToHex(button.states.active),
  disabled: oklchToHex(button.states.disabled),
};

console.log('Button Colors:', colors);
// default: "#0066CC"
// hover: "#0052A3"    (darker)
// active: "#003D7A"   (darkest)
// disabled: "#99C2E6" (lighter, desaturated)

// Check accessibility
console.log('WCAG Compliant:', button.accessibility[0].passed);
```

### All Component Themes

```typescript
import { generateComponentPresets, oklchToHex } from 'tekton';

const themes = generateComponentPresets({ l: 0.5, c: 0.15, h: 220 });

themes.forEach(theme => {
  console.log(`\n${theme.name} states:`);
  Object.entries(theme.states).forEach(([state, color]) => {
    console.log(`  ${state}: ${oklchToHex(color)}`);
  });
});

// Output:
// button states:
//   default: #0066CC
//   hover: #0052A3
//   ...
// input states:
//   default: #0066CC
//   focus: #0073E6
//   ...
```

---

## Exporting Tokens

### CSS Variables

```typescript
import { TokenGenerator } from 'tekton';

const generator = new TokenGenerator();
const palette = {
  primary: { l: 0.5, c: 0.15, h: 220 },
};

const css = generator.exportTokens(palette, 'css');
console.log(css);
```

**Output**:
```css
:root {
  --primary: #0066CC;
  --primary-50: #EFF6FF;
  --primary-100: #DBEAFE;
  --primary-200: #BFDBFE;
  --primary-300: #93C5FD;
  --primary-400: #60A5FA;
  --primary-500: #0066CC;
  --primary-600: #0052A3;
  --primary-700: #003D7A;
  --primary-800: #002952;
  --primary-900: #001429;
  --primary-950: #000A14;
}
```

### JSON Format

```typescript
const json = generator.exportTokens(palette, 'json');
console.log(json);
```

**Output**:
```json
{
  "primary": {
    "value": "#0066CC",
    "oklch": { "l": 0.5, "c": 0.15, "h": 220 },
    "scale": {
      "50": "#EFF6FF",
      "100": "#DBEAFE",
      ...
    }
  }
}
```

### TypeScript Format

```typescript
const ts = generator.exportTokens(palette, 'ts');
console.log(ts);
```

**Output**:
```typescript
export const primary = '#0066CC' as const;
export const primaryScale = {
  '50': '#EFF6FF' as const,
  '100': '#DBEAFE' as const,
  ...
} as const;
```

### Integration with Tailwind CSS

```typescript
// generate-tokens.js
import { TokenGenerator, oklchToHex } from 'tekton';
import fs from 'fs';

const generator = new TokenGenerator();
const palette = {
  primary: { l: 0.5, c: 0.15, h: 220 },
  secondary: { l: 0.5, c: 0.12, h: 280 },
};

const tokens = generator.generateTokens(palette);

// Convert to Tailwind color object
const tailwindColors = {};
tokens.forEach(token => {
  const scale = {};
  Object.entries(token.scale).forEach(([step, color]) => {
    scale[step] = oklchToHex(color);
  });
  tailwindColors[token.name] = scale;
});

// Save to file
fs.writeFileSync(
  'tailwind-colors.json',
  JSON.stringify(tailwindColors, null, 2)
);
```

**tailwind.config.js**:
```javascript
const colors = require('./tailwind-colors.json');

module.exports = {
  theme: {
    extend: {
      colors: colors,
    },
  },
};
```

**Usage in HTML**:
```html
<button class="bg-primary-500 hover:bg-primary-600 text-white">
  Click me
</button>
```

---

## Dark Mode Setup

### Automatic Dark Mode Generation

```typescript
import { TokenGenerator } from 'tekton';

const generator = new TokenGenerator({
  generateDarkMode: true,  // Enable dark mode variants
});

const palette = {
  primary: { l: 0.5, c: 0.15, h: 220 },
};

const tokens = generator.generateTokens(palette);

// Tokens now include both light and dark variants
tokens.forEach(token => {
  console.log(token.name, oklchToHex(token.value));
});

// Output:
// primary #0066CC
// primary-dark #3399FF (inverted lightness)
```

### CSS with Dark Mode

```typescript
const css = generator.exportTokens(palette, 'css');
```

**Output**:
```css
:root {
  --primary: #0066CC;
  --primary-50: #EFF6FF;
  ...
  --primary-dark: #3399FF;
  --primary-dark-50: #000A14;
  ...
}
```

**Usage**:
```css
.button {
  background: var(--primary-500);
}

@media (prefers-color-scheme: dark) {
  .button {
    background: var(--primary-dark-500);
  }
}
```

---

## WCAG Compliance Validation

### Validate Color Pairs

```typescript
import { validateColorPair, oklchToRgb } from 'tekton';

const textColor = oklchToRgb({ l: 0.2, c: 0.05, h: 220 }); // Dark blue
const bgColor = { r: 255, g: 255, b: 255 }; // White

const result = validateColorPair(textColor, bgColor, 'AA');

console.log('Contrast Ratio:', result.contrastRatio); // ~12:1
console.log('WCAG AA Passed:', result.passed); // true
```

### Calculate Contrast Ratios

```typescript
import { calculateContrastRatio } from 'tekton';

const black = { r: 0, g: 0, b: 0 };
const white = { r: 255, g: 255, b: 255 };

const ratio = calculateContrastRatio(black, white);
console.log('Contrast:', ratio); // 21 (maximum)
```

### Check Compliance Levels

```typescript
import { checkWCAGCompliance } from 'tekton';

// Normal text requires 4.5:1 for AA
const normalTextAA = checkWCAGCompliance(4.8, 'AA', false);
console.log('Normal AA:', normalTextAA.passed); // true

// Large text requires 3:1 for AA
const largeTextAA = checkWCAGCompliance(3.2, 'AA', true);
console.log('Large AA:', largeTextAA.passed); // true

// AAA is stricter (7:1 for normal text)
const normalTextAAA = checkWCAGCompliance(4.8, 'AAA', false);
console.log('Normal AAA:', normalTextAAA.passed); // false (needs 7:1)
```

---

## Advanced Topics

### Custom Scale Generation

```typescript
import { generateLightnessScale, oklchToHex } from 'tekton';

const baseColor = { l: 0.5, c: 0.15, h: 220 };
const scale = generateLightnessScale(baseColor);

// Scale automatically adjusts:
// - Reduces chroma for very light/dark colors
// - Maintains hue consistency
// - Creates perceptually uniform steps

Object.entries(scale).forEach(([step, color]) => {
  console.log(`${step}: L=${color.l.toFixed(2)}, C=${color.c.toFixed(3)}`);
});
```

### Gamut Clipping

```typescript
import { generateToken, oklchToHex } from 'tekton';

// Highly saturated color (may exceed sRGB gamut)
const saturatedColor = { l: 0.7, c: 0.35, h: 200 };

const token = generateToken('accent', saturatedColor);

// Check if gamut clipping occurred
if (token.metadata.gamutClipped) {
  console.log('⚠️ Color was adjusted to fit sRGB gamut');
  console.log('Original chroma:', saturatedColor.c);
  console.log('Clipped chroma:', token.value.c);
}

console.log('Final color:', oklchToHex(token.value));
```

### Performance Optimization

```typescript
import { TokenGenerator } from 'tekton';

const generator = new TokenGenerator();

// First generation (cache miss)
console.time('first');
generator.generateTokens({ primary: { l: 0.5, c: 0.15, h: 220 } });
console.timeEnd('first'); // ~2-3ms

// Second generation (cache hit)
console.time('cached');
generator.generateTokens({ primary: { l: 0.5, c: 0.15, h: 220 } });
console.timeEnd('cached'); // ~0.1ms (20x faster)

// Clear cache if needed
generator.clearCache();
```

### Type-Safe Design System

```typescript
import { type TokenDefinition, type OKLCHColor } from 'tekton';

// Define your design system structure
interface DesignSystem {
  colors: {
    brand: TokenDefinition;
    accent: TokenDefinition;
    semantic: {
      success: TokenDefinition;
      error: TokenDefinition;
    };
  };
}

// Type-safe token creation
function createMyDesignSystem(
  brandColor: OKLCHColor,
  accentColor: OKLCHColor
): DesignSystem {
  return {
    colors: {
      brand: generateToken('brand', brandColor),
      accent: generateToken('accent', accentColor),
      semantic: {
        success: generateToken('success', { l: 0.5, c: 0.15, h: 140 }),
        error: generateToken('error', { l: 0.5, c: 0.15, h: 0 }),
      },
    },
  };
}

const system = createMyDesignSystem(
  { l: 0.5, c: 0.15, h: 220 },
  { l: 0.6, c: 0.12, h: 340 }
);

// Full TypeScript autocomplete
console.log(system.colors.brand.scale['500']);
```

---

## Next Steps

- **Explore Examples**: [Examples Directory](../examples/)
- **API Reference**: [Full API Documentation](../api/README.md)
- **Architecture**: [System Design](../architecture/README.md)
- **Contributing**: [Development Guide](../../CONTRIBUTING.md)

---

## Common Issues

### Issue: Colors look different than expected

**Solution**: OKLCH uses perceptual uniformity, which may differ from HSL/RGB intuition. Use `oklchToHex()` to preview colors during development.

### Issue: Gamut clipping warnings

**Solution**: Reduce chroma (C value) to stay within sRGB gamut. Typical safe range is 0-0.25 for most hues.

### Issue: WCAG compliance failures

**Solution**: Increase lightness difference between foreground and background. Aim for L difference ≥ 0.4 for reliable AA compliance.

---

**Need Help?** Open an issue on [GitHub](https://github.com/your-org/tekton/issues) or check the [API Reference](../api/README.md) for detailed documentation.
