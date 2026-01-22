# Theme Configuration Guide

## Overview

This guide provides comprehensive documentation for creating and configuring custom themes in the Tekton Design System. Themes are defined as JSON files following the `ThemeConfig` interface, enabling centralized design token management across all generated components.

## Table of Contents

- [Theme Structure](#theme-structure)
- [ThemeConfig Schema](#themeconfig-schema)
- [Creating Your First Theme](#creating-your-first-theme)
- [Color Palette Configuration](#color-palette-configuration)
- [Typography Configuration](#typography-configuration)
- [Component Defaults](#component-defaults)
- [AI Context](#ai-context)
- [OKLCH Color Space](#oklch-color-space)
- [Theme Validation](#theme-validation)
- [Theme Best Practices](#theme-best-practices)
- [Complete Examples](#complete-examples)

---

## Theme Structure

Themes are JSON files stored in the `themes/` directory with the following structure:

```
themes/
├── calm-wellness.json          # Default theme
├── professional-dark.json      # Professional theme
├── energetic-bright.json       # Energetic theme
└── your-custom-theme.json      # Your theme
```

**File Naming Convention**: `{themeId}.json` where `themeId` is the unique theme identifier.

---

## ThemeConfig Schema

Complete TypeScript interface for theme configuration:

```typescript
interface ThemeConfig {
  id: string;                       // Unique identifier
  name: string;                     // Human-readable name
  description: string;              // Theme description
  version: string;                  // Semantic version
  brandTone: string;                // Tone matching
  colorPalette: ColorPalette;       // Color definitions
  typography: Typography;           // Font settings
  componentDefaults: ComponentDefaults; // Component styling
  aiContext: AIContext;             // AI guidance
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ Yes | Unique identifier (lowercase, kebab-case) |
| `name` | string | ✅ Yes | Display name (human-readable) |
| `description` | string | ✅ Yes | Brief theme description |
| `version` | string | ✅ Yes | Semantic version (e.g., "1.0.0") |
| `brandTone` | string | ✅ Yes | Brand tone (calm, professional, energetic, playful) |
| `colorPalette` | ColorPalette | ✅ Yes | Color definitions using OKLCH |
| `typography` | Typography | ✅ Yes | Font families and type scale |
| `componentDefaults` | ComponentDefaults | ✅ Yes | Border radius, density, contrast |
| `aiContext` | AIContext | ✅ Yes | AI guidance for theme application |

---

## Creating Your First Theme

### Step 1: Create JSON File

Create `themes/my-first-theme.json`:

```json
{
  "id": "my-first-theme",
  "name": "My First Theme",
  "description": "A custom theme for my application",
  "version": "1.0.0",
  "brandTone": "professional",
  "colorPalette": {},
  "typography": {},
  "componentDefaults": {},
  "aiContext": {}
}
```

### Step 2: Add Color Palette

Define colors using OKLCH (Lightness, Chroma, Hue):

```json
{
  "colorPalette": {
    "primary": {
      "l": 0.65,
      "c": 0.15,
      "h": 270,
      "description": "Primary brand color (purple)"
    },
    "surface": {
      "l": 0.98,
      "c": 0.01,
      "h": 270,
      "description": "Surface background (light gray)"
    },
    "on-primary": {
      "l": 0.98,
      "c": 0.01,
      "h": 270,
      "description": "Text color on primary background (white)"
    },
    "on-surface": {
      "l": 0.20,
      "c": 0.02,
      "h": 270,
      "description": "Text color on surface background (dark gray)"
    }
  }
}
```

### Step 3: Add Typography

Define font families and type scale:

```json
{
  "typography": {
    "fontFamily": {
      "sans": "Inter, system-ui, -apple-system, sans-serif",
      "mono": "Fira Code, Consolas, monospace"
    },
    "scale": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem"
    },
    "lineHeight": {
      "tight": "1.25",
      "normal": "1.5",
      "relaxed": "1.75"
    },
    "fontWeight": {
      "normal": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700"
    }
  }
}
```

### Step 4: Add Component Defaults

Define default styling for components:

```json
{
  "componentDefaults": {
    "borderRadius": {
      "none": "0",
      "sm": "0.25rem",
      "md": "0.375rem",
      "lg": "0.5rem",
      "xl": "0.75rem",
      "2xl": "1rem",
      "full": "9999px"
    },
    "spacing": {
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "6": "1.5rem",
      "8": "2rem",
      "12": "3rem",
      "16": "4rem"
    },
    "shadow": {
      "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
    },
    "density": "comfortable",
    "contrast": "normal"
  }
}
```

### Step 5: Add AI Context

Provide guidance for AI-powered generation:

```json
{
  "aiContext": {
    "usageGuidelines": "Use for professional business applications requiring trustworthiness",
    "colorMood": "Calming and trustworthy with subtle sophistication",
    "targetAudience": "Enterprise users and business professionals",
    "designPrinciples": [
      "Clarity over decoration",
      "Consistency in spacing and alignment",
      "Accessible color contrasts",
      "Purposeful use of color"
    ],
    "avoidPatterns": [
      "Overly bright or saturated colors",
      "Inconsistent spacing",
      "Decorative elements without purpose"
    ]
  }
}
```

### Step 6: Use Your Theme

```typescript
import { renderScreen } from '@tekton/studio-mcp';

const result = await renderScreen(blueprint, {
  themeId: 'my-first-theme'
});
```

---

## Color Palette Configuration

### ColorPalette Interface

```typescript
interface ColorPalette {
  [colorName: string]: OKLCHColor;
}

interface OKLCHColor {
  l: number;          // Lightness (0.0 to 1.0)
  c: number;          // Chroma (0.0 to ~0.4)
  h: number;          // Hue (0 to 360 degrees)
  description?: string; // Optional color description
}
```

### Recommended Color Names

Follow semantic naming conventions for consistency:

**Primary Colors**:
- `primary` - Main brand color
- `secondary` - Secondary brand color
- `tertiary` - Tertiary brand color

**Functional Colors**:
- `success` - Success state (green tones)
- `warning` - Warning state (yellow/orange tones)
- `error` - Error state (red tones)
- `info` - Informational state (blue tones)

**Surface Colors**:
- `background` - Page background
- `surface` - Card/component surface
- `surface-variant` - Alternative surface
- `outline` - Border color

**Text Colors**:
- `on-primary` - Text on primary background
- `on-surface` - Text on surface background
- `on-error` - Text on error background

### Color Examples

#### Neutral Gray Scale

```json
{
  "gray-50": { "l": 0.98, "c": 0.00, "h": 270, "description": "Lightest gray" },
  "gray-100": { "l": 0.96, "c": 0.01, "h": 270, "description": "Very light gray" },
  "gray-200": { "l": 0.93, "c": 0.01, "h": 270, "description": "Light gray" },
  "gray-300": { "l": 0.86, "c": 0.02, "h": 270, "description": "Medium light gray" },
  "gray-400": { "l": 0.74, "c": 0.03, "h": 270, "description": "Medium gray" },
  "gray-500": { "l": 0.62, "c": 0.04, "h": 270, "description": "Medium dark gray" },
  "gray-600": { "l": 0.49, "c": 0.04, "h": 270, "description": "Dark gray" },
  "gray-700": { "l": 0.38, "c": 0.03, "h": 270, "description": "Very dark gray" },
  "gray-800": { "l": 0.27, "c": 0.02, "h": 270, "description": "Almost black" },
  "gray-900": { "l": 0.15, "c": 0.01, "h": 270, "description": "Darkest gray" }
}
```

#### Vibrant Brand Colors

```json
{
  "brand-blue": { "l": 0.60, "c": 0.20, "h": 250, "description": "Primary blue" },
  "brand-teal": { "l": 0.65, "c": 0.15, "h": 180, "description": "Accent teal" },
  "brand-purple": { "l": 0.55, "c": 0.18, "h": 300, "description": "Accent purple" }
}
```

#### Functional State Colors

```json
{
  "success": { "l": 0.65, "c": 0.15, "h": 145, "description": "Success green" },
  "warning": { "l": 0.75, "c": 0.18, "h": 85, "description": "Warning yellow" },
  "error": { "l": 0.60, "c": 0.20, "h": 25, "description": "Error red" },
  "info": { "l": 0.65, "c": 0.17, "h": 240, "description": "Info blue" }
}
```

### State-Specific Color Variants

Define hover, focus, and disabled states:

```json
{
  "primary": { "l": 0.60, "c": 0.18, "h": 270, "description": "Primary default" },
  "primary-hover": { "l": 0.55, "c": 0.20, "h": 270, "description": "Primary hover (darker, more saturated)" },
  "primary-focus": { "l": 0.58, "c": 0.19, "h": 270, "description": "Primary focus" },
  "primary-active": { "l": 0.50, "c": 0.22, "h": 270, "description": "Primary active (darkest)" },
  "primary-disabled": { "l": 0.75, "c": 0.05, "h": 270, "description": "Primary disabled (desaturated)" }
}
```

---

## Typography Configuration

### Typography Interface

```typescript
interface Typography {
  fontFamily: {
    sans: string;     // Sans-serif font stack
    serif?: string;   // Serif font stack (optional)
    mono: string;     // Monospace font stack
  };
  scale: {
    [size: string]: string;  // Font sizes (rem units)
  };
  lineHeight?: {
    [variant: string]: string;  // Line heights (unitless or rem)
  };
  fontWeight?: {
    [weight: string]: string;   // Font weights (100-900)
  };
  letterSpacing?: {
    [variant: string]: string;  // Letter spacing (em units)
  };
}
```

### Font Family Configuration

#### System Font Stack (Recommended)

```json
{
  "fontFamily": {
    "sans": "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    "mono": "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, monospace"
  }
}
```

#### Custom Web Fonts

```json
{
  "fontFamily": {
    "sans": "'Inter', system-ui, -apple-system, sans-serif",
    "serif": "'Merriweather', Georgia, serif",
    "mono": "'Fira Code', 'Courier New', monospace"
  }
}
```

**Note**: Ensure web fonts are loaded via `<link>` tags or `@import` in your CSS.

### Type Scale Configuration

#### Modular Scale (Recommended)

Base: 1rem (16px), Ratio: 1.25 (Major Third)

```json
{
  "scale": {
    "xs": "0.64rem",    // 10.24px
    "sm": "0.8rem",     // 12.8px
    "base": "1rem",     // 16px
    "lg": "1.25rem",    // 20px
    "xl": "1.563rem",   // 25px
    "2xl": "1.953rem",  // 31.25px
    "3xl": "2.441rem",  // 39.06px
    "4xl": "3.052rem",  // 48.83px
    "5xl": "3.815rem"   // 61.04px
  }
}
```

#### Linear Scale

Consistent increments:

```json
{
  "scale": {
    "xs": "0.75rem",    // 12px
    "sm": "0.875rem",   // 14px
    "base": "1rem",     // 16px
    "lg": "1.125rem",   // 18px
    "xl": "1.25rem",    // 20px
    "2xl": "1.5rem",    // 24px
    "3xl": "1.875rem",  // 30px
    "4xl": "2.25rem",   // 36px
    "5xl": "3rem"       // 48px
  }
}
```

### Line Height Configuration

```json
{
  "lineHeight": {
    "none": "1",
    "tight": "1.25",
    "snug": "1.375",
    "normal": "1.5",
    "relaxed": "1.625",
    "loose": "2"
  }
}
```

### Font Weight Configuration

```json
{
  "fontWeight": {
    "thin": "100",
    "extralight": "200",
    "light": "300",
    "normal": "400",
    "medium": "500",
    "semibold": "600",
    "bold": "700",
    "extrabold": "800",
    "black": "900"
  }
}
```

### Letter Spacing Configuration

```json
{
  "letterSpacing": {
    "tighter": "-0.05em",
    "tight": "-0.025em",
    "normal": "0em",
    "wide": "0.025em",
    "wider": "0.05em",
    "widest": "0.1em"
  }
}
```

---

## Component Defaults

### ComponentDefaults Interface

```typescript
interface ComponentDefaults {
  borderRadius: {
    [size: string]: string;  // Border radius values
  };
  spacing?: {
    [size: string]: string;  // Spacing scale
  };
  shadow?: {
    [size: string]: string;  // Box shadow definitions
  };
  density: 'compact' | 'comfortable' | 'spacious';
  contrast: 'low' | 'normal' | 'high';
  transition?: {
    [speed: string]: string;  // Transition durations
  };
}
```

### Border Radius Configuration

```json
{
  "borderRadius": {
    "none": "0",
    "sm": "0.25rem",    // 4px
    "md": "0.375rem",   // 6px
    "lg": "0.5rem",     // 8px
    "xl": "0.75rem",    // 12px
    "2xl": "1rem",      // 16px
    "3xl": "1.5rem",    // 24px
    "full": "9999px"    // Fully rounded (pills)
  }
}
```

### Spacing Scale

```json
{
  "spacing": {
    "0": "0",
    "px": "1px",
    "0.5": "0.125rem",  // 2px
    "1": "0.25rem",     // 4px
    "2": "0.5rem",      // 8px
    "3": "0.75rem",     // 12px
    "4": "1rem",        // 16px
    "5": "1.25rem",     // 20px
    "6": "1.5rem",      // 24px
    "8": "2rem",        // 32px
    "10": "2.5rem",     // 40px
    "12": "3rem",       // 48px
    "16": "4rem",       // 64px
    "20": "5rem",       // 80px
    "24": "6rem"        // 96px
  }
}
```

### Shadow Definitions

```json
{
  "shadow": {
    "none": "none",
    "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "inner": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)"
  }
}
```

### Density Options

- **compact**: Minimal padding, tight spacing (for data-dense interfaces)
- **comfortable**: Balanced padding (default, recommended)
- **spacious**: Generous padding, relaxed spacing (for marketing/content sites)

```json
{
  "density": "comfortable"
}
```

### Contrast Options

- **low**: Subtle color differences (for modern, minimal designs)
- **normal**: Standard contrast (recommended)
- **high**: Maximum contrast (for accessibility, strong emphasis)

```json
{
  "contrast": "normal"
}
```

### Transition Configuration

```json
{
  "transition": {
    "fast": "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    "normal": "300ms cubic-bezier(0.4, 0, 0.2, 1)",
    "slow": "500ms cubic-bezier(0.4, 0, 0.2, 1)"
  }
}
```

---

## AI Context

### AIContext Interface

```typescript
interface AIContext {
  usageGuidelines: string;          // When to use this theme
  colorMood: string;                // Emotional tone of colors
  targetAudience: string;           // Intended user demographic
  designPrinciples?: string[];      // Core design principles
  avoidPatterns?: string[];         // Anti-patterns to avoid
  examples?: string[];              // Example use cases
  accessibility?: {
    minimumContrast?: string;       // WCAG level (AA, AAA)
    colorBlindSafe?: boolean;       // Color blind friendly
    notes?: string;                 // Additional accessibility notes
  };
}
```

### Example AI Context

```json
{
  "aiContext": {
    "usageGuidelines": "Use for professional SaaS applications and enterprise dashboards requiring trustworthiness and clarity",
    "colorMood": "Calm, trustworthy, and sophisticated with subtle warmth",
    "targetAudience": "Business professionals, enterprise users, and decision-makers",
    "designPrinciples": [
      "Clarity over decoration",
      "Consistency in spacing and alignment",
      "Purposeful use of color to guide attention",
      "Accessible color contrasts (WCAG AA minimum)",
      "Progressive disclosure of complexity"
    ],
    "avoidPatterns": [
      "Overly bright or saturated colors that strain eyes",
      "Inconsistent spacing that breaks visual rhythm",
      "Decorative elements without functional purpose",
      "Low contrast text on colored backgrounds",
      "More than 3 levels of visual hierarchy per section"
    ],
    "examples": [
      "Project management dashboards",
      "Analytics and reporting interfaces",
      "Enterprise CRM systems",
      "Financial planning tools"
    ],
    "accessibility": {
      "minimumContrast": "WCAG AA (4.5:1 for normal text, 3:1 for large text)",
      "colorBlindSafe": true,
      "notes": "All functional colors (success, error, warning) use icons in addition to color"
    }
  }
}
```

---

## OKLCH Color Space

### What is OKLCH?

OKLCH (Lightness, Chroma, Hue) is a perceptually uniform color space that provides predictable color transformations:

- **L (Lightness)**: 0.0 (black) to 1.0 (white)
- **C (Chroma)**: 0.0 (grayscale) to ~0.4 (vivid)
- **H (Hue)**: 0-360 degrees (color wheel)

### Why OKLCH?

**Benefits**:
- ✅ Perceptually uniform (equal changes feel equal)
- ✅ Predictable lightness adjustments
- ✅ Better accessibility with consistent contrast
- ✅ More natural color relationships
- ✅ Easier to generate color scales

**Comparison with RGB/HEX**:
- ❌ RGB: Not perceptually uniform (changing values unpredictably affects perception)
- ❌ HEX: Same issues as RGB, plus harder to modify programmatically
- ✅ OKLCH: Designed for perceptual uniformity

### OKLCH Parameters Explained

#### Lightness (L)

Controls perceived brightness:

```json
{
  "very-dark": { "l": 0.15, "c": 0.02, "h": 270 },  // Almost black
  "dark": { "l": 0.35, "c": 0.05, "h": 270 },       // Dark
  "medium": { "l": 0.55, "c": 0.10, "h": 270 },     // Medium
  "light": { "l": 0.75, "c": 0.05, "h": 270 },      // Light
  "very-light": { "l": 0.95, "c": 0.01, "h": 270 }  // Almost white
}
```

**Accessibility Tip**: Maintain lightness difference of 0.4+ between text and background for WCAG AA compliance.

#### Chroma (C)

Controls color saturation/vividness:

```json
{
  "grayscale": { "l": 0.60, "c": 0.00, "h": 270 },  // No color
  "muted": { "l": 0.60, "c": 0.05, "h": 270 },      // Slightly colored
  "moderate": { "l": 0.60, "c": 0.12, "h": 270 },   // Noticeable color
  "vibrant": { "l": 0.60, "c": 0.20, "h": 270 },    // Vivid color
  "intense": { "l": 0.60, "c": 0.30, "h": 270 }     // Very saturated
}
```

**Design Tip**: Use lower chroma (0.05-0.10) for professional themes, higher chroma (0.15-0.25) for energetic themes.

#### Hue (H)

Controls the color itself (degrees on color wheel):

```json
{
  "red": { "l": 0.60, "c": 0.18, "h": 25 },         // Red
  "orange": { "l": 0.70, "c": 0.18, "h": 60 },      // Orange
  "yellow": { "l": 0.80, "c": 0.18, "h": 90 },      // Yellow
  "green": { "l": 0.60, "c": 0.18, "h": 145 },      // Green
  "cyan": { "l": 0.65, "c": 0.18, "h": 195 },       // Cyan
  "blue": { "l": 0.60, "c": 0.18, "h": 250 },       // Blue
  "purple": { "l": 0.55, "c": 0.18, "h": 300 },     // Purple
  "magenta": { "l": 0.60, "c": 0.18, "h": 340 }     // Magenta
}
```

### Creating Color Scales

Generate harmonious color scales by varying lightness:

```json
{
  "primary-50": { "l": 0.95, "c": 0.10, "h": 270 },
  "primary-100": { "l": 0.90, "c": 0.11, "h": 270 },
  "primary-200": { "l": 0.85, "c": 0.12, "h": 270 },
  "primary-300": { "l": 0.75, "c": 0.13, "h": 270 },
  "primary-400": { "l": 0.65, "c": 0.14, "h": 270 },
  "primary-500": { "l": 0.55, "c": 0.15, "h": 270 },  // Base color
  "primary-600": { "l": 0.45, "c": 0.16, "h": 270 },
  "primary-700": { "l": 0.35, "c": 0.15, "h": 270 },
  "primary-800": { "l": 0.25, "c": 0.12, "h": 270 },
  "primary-900": { "l": 0.15, "c": 0.08, "h": 270 }
}
```

**Pattern**: Keep hue constant, increase chroma slightly toward middle values, vary lightness.

### OKLCH Tools and Resources

- **OKLCH Color Picker**: https://oklch.com
- **Color Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **APCA Contrast Calculator**: https://www.myndex.com/APCA/

---

## Theme Validation

### Manual Validation Checklist

Before using a theme in production, verify:

**Structure**:
- [ ] Theme file is valid JSON
- [ ] All required fields present (`id`, `name`, `colorPalette`, etc.)
- [ ] Version follows semantic versioning (e.g., "1.0.0")

**Colors**:
- [ ] All OKLCH values in valid ranges (L: 0-1, C: 0-0.4, H: 0-360)
- [ ] Minimum color palette includes: primary, surface, on-primary, on-surface
- [ ] Text/background combinations meet WCAG AA contrast (4.5:1)

**Typography**:
- [ ] Font families include fallback fonts
- [ ] Type scale includes at least: xs, sm, base, lg, xl
- [ ] Font weights defined (or using system defaults)

**Component Defaults**:
- [ ] Border radius values in valid CSS units
- [ ] Spacing scale defined (if using)
- [ ] Density is one of: compact, comfortable, spacious
- [ ] Contrast is one of: low, normal, high

**AI Context**:
- [ ] Usage guidelines are clear and specific
- [ ] Design principles are actionable
- [ ] Target audience is well-defined

### Automated Validation

Use TokenResolver to validate themes programmatically:

```typescript
import { TokenResolver } from '@tekton/component-generator';

async function validateTheme(themeId: string): Promise<boolean> {
  const resolver = new TokenResolver();

  try {
    // Attempt to load theme
    const theme = await resolver.loadTheme(themeId);

    // Validate required fields
    const requiredFields = [
      'id', 'name', 'description', 'version',
      'brandTone', 'colorPalette', 'typography',
      'componentDefaults', 'aiContext'
    ];

    for (const field of requiredFields) {
      if (!(field in theme)) {
        console.error(`Missing required field: ${field}`);
        return false;
      }
    }

    // Validate color palette not empty
    if (Object.keys(theme.colorPalette).length === 0) {
      console.error('Color palette is empty');
      return false;
    }

    // Validate OKLCH values
    for (const [colorName, color] of Object.entries(theme.colorPalette)) {
      if (color.l < 0 || color.l > 1) {
        console.error(`Invalid lightness for ${colorName}: ${color.l}`);
        return false;
      }

      if (color.c < 0 || color.c > 0.4) {
        console.error(`Invalid chroma for ${colorName}: ${color.c}`);
        return false;
      }

      if (color.h < 0 || color.h > 360) {
        console.error(`Invalid hue for ${colorName}: ${color.h}`);
        return false;
      }
    }

    console.log(`✅ Theme '${themeId}' is valid`);
    return true;
  } catch (error) {
    console.error(`❌ Theme validation failed: ${error.message}`);
    return false;
  }
}

await validateTheme('my-custom-theme');
```

---

## Theme Best Practices

### 1. Start with a Base Theme

Copy an existing theme (e.g., `calm-wellness.json`) and modify incrementally:

```bash
cp themes/calm-wellness.json themes/my-theme.json
```

### 2. Use Semantic Color Names

✅ **Good**: `primary`, `surface`, `on-primary`, `error`, `success`
❌ **Bad**: `blue`, `light-gray`, `red-500`

**Why**: Semantic names survive design changes. If primary color changes from blue to green, you don't need to rename tokens.

### 3. Maintain Consistent Chroma

Keep chroma values consistent within a theme for visual harmony:

**Muted Theme**: 0.05-0.10 chroma across all colors
**Moderate Theme**: 0.12-0.18 chroma
**Vibrant Theme**: 0.20-0.30 chroma

### 4. Define Color Scales

Provide tints and shades for flexibility:

```json
{
  "primary-light": { "l": 0.75, "c": 0.12, "h": 270 },
  "primary": { "l": 0.60, "c": 0.15, "h": 270 },
  "primary-dark": { "l": 0.45, "c": 0.17, "h": 270 }
}
```

### 5. Test Accessibility

Verify text/background contrast meets WCAG guidelines:

- **WCAG AA**: 4.5:1 for normal text, 3:1 for large text
- **WCAG AAA**: 7:1 for normal text, 4.5:1 for large text

**Tool**: Use https://webaim.org/resources/contrastchecker/

### 6. Document Intent

Use `description` fields extensively:

```json
{
  "primary": {
    "l": 0.60,
    "c": 0.18,
    "h": 270,
    "description": "Primary brand color used for CTAs, links, and emphasis"
  }
}
```

### 7. Version Your Themes

Follow semantic versioning:

- **Major**: Breaking changes (removing colors, changing structure)
- **Minor**: Adding new colors or properties
- **Patch**: Tweaking existing color values

```json
{
  "version": "1.2.3"
}
```

### 8. Provide AI Context

Detailed AI context improves component generation quality:

```json
{
  "aiContext": {
    "usageGuidelines": "Specific use cases where this theme excels",
    "designPrinciples": ["Concrete, actionable principles"],
    "avoidPatterns": ["Specific anti-patterns to avoid"],
    "examples": ["Real-world application examples"]
  }
}
```

---

## Complete Examples

### Example 1: Professional Dark Theme

**File**: `themes/professional-dark.json`

```json
{
  "id": "professional-dark",
  "name": "Professional Dark",
  "description": "Dark theme for professional applications with excellent readability",
  "version": "1.0.0",
  "brandTone": "professional",
  "colorPalette": {
    "primary": {
      "l": 0.70,
      "c": 0.18,
      "h": 250,
      "description": "Primary brand blue"
    },
    "background": {
      "l": 0.12,
      "c": 0.02,
      "h": 250,
      "description": "Page background (very dark)"
    },
    "surface": {
      "l": 0.18,
      "c": 0.02,
      "h": 250,
      "description": "Card surface (dark gray)"
    },
    "surface-variant": {
      "l": 0.22,
      "c": 0.03,
      "h": 250,
      "description": "Alternate surface (slightly lighter)"
    },
    "on-background": {
      "l": 0.90,
      "c": 0.01,
      "h": 250,
      "description": "Text on background (near white)"
    },
    "on-surface": {
      "l": 0.85,
      "c": 0.02,
      "h": 250,
      "description": "Text on surface (light gray)"
    },
    "on-primary": {
      "l": 0.98,
      "c": 0.01,
      "h": 250,
      "description": "Text on primary (white)"
    },
    "outline": {
      "l": 0.35,
      "c": 0.03,
      "h": 250,
      "description": "Border color (medium gray)"
    }
  },
  "typography": {
    "fontFamily": {
      "sans": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      "mono": "'Fira Code', 'SF Mono', Consolas, monospace"
    },
    "scale": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem"
    },
    "lineHeight": {
      "tight": "1.25",
      "normal": "1.5",
      "relaxed": "1.75"
    },
    "fontWeight": {
      "normal": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700"
    }
  },
  "componentDefaults": {
    "borderRadius": {
      "sm": "0.25rem",
      "md": "0.375rem",
      "lg": "0.5rem",
      "xl": "0.75rem"
    },
    "spacing": {
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "6": "1.5rem",
      "8": "2rem"
    },
    "shadow": {
      "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
      "md": "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
      "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
    },
    "density": "comfortable",
    "contrast": "high"
  },
  "aiContext": {
    "usageGuidelines": "Use for professional development tools, dashboards, and enterprise applications. Excellent for extended use with reduced eye strain.",
    "colorMood": "Sophisticated and modern with high contrast for clarity",
    "targetAudience": "Developers, data analysts, and users working long hours",
    "designPrinciples": [
      "High contrast for readability in low-light environments",
      "Subtle use of color to reduce visual noise",
      "Clear visual hierarchy with consistent spacing",
      "Accessible color combinations (WCAG AAA where possible)"
    ],
    "avoidPatterns": [
      "Pure black backgrounds (cause eye strain)",
      "Low contrast text (hard to read)",
      "Overly saturated accent colors (jarring in dark mode)"
    ],
    "examples": [
      "Code editors and IDEs",
      "Analytics dashboards",
      "System administration tools",
      "Developer documentation sites"
    ],
    "accessibility": {
      "minimumContrast": "WCAG AAA (7:1 for normal text)",
      "colorBlindSafe": true,
      "notes": "All interactive elements have 3:1 contrast minimum"
    }
  }
}
```

### Example 2: Energetic Bright Theme

**File**: `themes/energetic-bright.json`

```json
{
  "id": "energetic-bright",
  "name": "Energetic Bright",
  "description": "Vibrant theme for consumer-facing applications and marketing sites",
  "version": "1.0.0",
  "brandTone": "energetic",
  "colorPalette": {
    "primary": {
      "l": 0.60,
      "c": 0.25,
      "h": 30,
      "description": "Vibrant orange-red"
    },
    "secondary": {
      "l": 0.65,
      "c": 0.22,
      "h": 280,
      "description": "Bold purple"
    },
    "background": {
      "l": 0.98,
      "c": 0.01,
      "h": 30,
      "description": "Near-white with warm tint"
    },
    "surface": {
      "l": 1.00,
      "c": 0.00,
      "h": 0,
      "description": "Pure white"
    },
    "on-primary": {
      "l": 0.98,
      "c": 0.01,
      "h": 30,
      "description": "White text on primary"
    },
    "on-surface": {
      "l": 0.15,
      "c": 0.02,
      "h": 30,
      "description": "Dark gray text"
    }
  },
  "typography": {
    "fontFamily": {
      "sans": "'Poppins', 'Helvetica Neue', Arial, sans-serif",
      "mono": "'Source Code Pro', monospace"
    },
    "scale": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem"
    },
    "fontWeight": {
      "normal": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700",
      "extrabold": "800"
    }
  },
  "componentDefaults": {
    "borderRadius": {
      "md": "0.5rem",
      "lg": "0.75rem",
      "xl": "1rem",
      "2xl": "1.5rem",
      "full": "9999px"
    },
    "density": "spacious",
    "contrast": "normal"
  },
  "aiContext": {
    "usageGuidelines": "Use for consumer-facing products, marketing pages, and applications targeting young audiences. Best for short engagement sessions.",
    "colorMood": "Energetic, playful, and attention-grabbing",
    "targetAudience": "Young consumers, social media users, creative professionals",
    "designPrinciples": [
      "Bold use of color to create excitement",
      "Generous spacing for impact",
      "Rounded corners for friendly feel",
      "Strong visual hierarchy"
    ],
    "examples": [
      "Social media applications",
      "E-commerce product pages",
      "Creative portfolios",
      "Marketing landing pages"
    ]
  }
}
```

---

## Related Documentation

- [Theme Binding System Specification](../../../.moai/specs/SPEC-THEME-BIND-001/spec.md)
- [TokenResolver API Reference](./token-resolver.md)
- [API Changes Documentation](../../../.moai/specs/SPEC-THEME-BIND-001/api.md)
- [Migration Guide](../../../.moai/specs/SPEC-THEME-BIND-001/migration.md)

---

**Document Version**: 1.0.0
**Last Updated**: 2026-01-21
**Package**: @tekton/component-generator
**Status**: ✅ Current
