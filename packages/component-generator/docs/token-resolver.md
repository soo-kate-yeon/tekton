# TokenResolver API Reference

## Overview

`TokenResolver` is the core class for loading, caching, and resolving theme configurations in the Theme Binding System. It handles theme file I/O, OKLCH color conversion, and provides a convenient API for token access with fallback support.

## Table of Contents

- [Class: TokenResolver](#class-tokenresolver)
- [Constructor](#constructor)
- [Methods](#methods)
- [Types](#types)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Performance](#performance)
- [Best Practices](#best-practices)

---

## Class: TokenResolver

**Location**: `packages/component-generator/src/resolvers/token-resolver.ts`

**Export**: `export class TokenResolver`

### Purpose

TokenResolver provides a high-level API for working with theme configurations:

- **Load**: Read theme JSON files from the filesystem
- **Cache**: Implement LRU caching for performance
- **Resolve**: Convert OKLCH colors to CSS-compatible format
- **Access**: Safely retrieve token values with fallback support

### Features

✅ **Automatic Caching**: LRU cache prevents redundant file I/O
✅ **OKLCH Support**: Converts OKLCH color definitions to CSS syntax
✅ **Type Safety**: Full TypeScript support with strict types
✅ **Fallback Handling**: Graceful degradation when tokens missing
✅ **Warning System**: Emits console warnings for missing tokens
✅ **Default Theme**: Automatic fallback to `calm-wellness` theme

---

## Constructor

### Signature

```typescript
constructor(options?: TokenResolverOptions)
```

### Parameters

#### `options` (optional)

Configuration object with the following fields:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `themesPath` | `string` | `'./themes'` | Directory path containing theme JSON files |
| `cacheSize` | `number` | `10` | Maximum number of themes to cache (LRU eviction) |

### Types

```typescript
export interface TokenResolverOptions {
  themesPath?: string;
  cacheSize?: number;
}
```

### Examples

#### Default Configuration

```typescript
import { TokenResolver } from '@tekton/component-generator';

// Uses default options (themesPath: './themes', cacheSize: 10)
const resolver = new TokenResolver();
```

#### Custom Theme Directory

```typescript
const resolver = new TokenResolver({
  themesPath: './my-custom-themes'
});
```

#### Larger Cache Size

```typescript
const resolver = new TokenResolver({
  cacheSize: 50  // Cache up to 50 themes
});
```

#### Full Configuration

```typescript
const resolver = new TokenResolver({
  themesPath: '/absolute/path/to/themes',
  cacheSize: 20
});
```

---

## Methods

### loadTheme

Load a theme configuration from the filesystem with automatic caching.

#### Signature

```typescript
async loadTheme(themeId: string): Promise<ThemeConfig>
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `themeId` | `string` | Yes | Unique theme identifier (without `.json` extension) |

#### Returns

`Promise<ThemeConfig>` - Resolved theme configuration object

#### Throws

- `Error`: Theme file not found
- `SyntaxError`: Invalid JSON in theme file
- `TypeError`: Theme does not match `ThemeConfig` interface

#### Behavior

1. **Check Cache**: If theme already cached, return immediately
2. **Read File**: Attempt to read `{themesPath}/{themeId}.json`
3. **Parse JSON**: Parse file contents as JSON
4. **Validate**: Ensure structure matches `ThemeConfig` interface
5. **Cache**: Store in LRU cache
6. **Return**: Return parsed theme configuration

#### Cache Policy

- **Cache Key**: Theme ID (e.g., `"calm-wellness"`)
- **Eviction**: LRU (Least Recently Used) when cache full
- **Invalidation**: Manual via `clearCache()` method

#### Examples

##### Basic Usage

```typescript
const resolver = new TokenResolver();

try {
  const theme = await resolver.loadTheme('calm-wellness');

  console.log(theme.id);          // "calm-wellness"
  console.log(theme.name);        // "Calm Wellness"
  console.log(theme.brandTone);   // "calm"
} catch (error) {
  console.error('Theme loading failed:', error.message);
}
```

##### Loading Multiple Themes

```typescript
const resolver = new TokenResolver();

// Load themes in parallel
const [calmTheme, proTheme] = await Promise.all([
  resolver.loadTheme('calm-wellness'),
  resolver.loadTheme('professional-dark')
]);

console.log('Loaded themes:', calmTheme.name, proTheme.name);
```

##### Error Handling

```typescript
const resolver = new TokenResolver();

try {
  const theme = await resolver.loadTheme('non-existent-theme');
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error('Theme file not found');
  } else if (error instanceof SyntaxError) {
    console.error('Invalid JSON in theme file');
  } else {
    console.error('Unknown error:', error);
  }
}
```

---

### resolveTokens

Convert a theme configuration into resolved CSS tokens.

#### Signature

```typescript
resolveTokens(theme: ThemeConfig): ResolvedTokens
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `theme` | `ThemeConfig` | Yes | Theme configuration object (from `loadTheme`) |

#### Returns

`ResolvedTokens` - Map of token names to resolved values and CSS variables

```typescript
type ResolvedTokens = Record<string, {
  value: string;        // Original value (e.g., "oklch(0.65 0.15 270)")
  cssVariable: string;  // CSS variable syntax (e.g., "var(--color-primary)")
}>;
```

#### Behavior

1. **Extract Colors**: Process `colorPalette` object
2. **Convert OKLCH**: Transform OKLCH color definitions to CSS format
3. **Generate Variables**: Create CSS variable references
4. **Include Typography**: Add typography scale tokens
5. **Include Component Defaults**: Add border radius, spacing tokens
6. **Return Map**: Return complete token map

#### Token Naming Convention

Tokens are named using kebab-case with descriptive prefixes:

- **Colors**: `color-primary`, `color-surface`, `color-on-primary`
- **Typography**: `font-sans`, `font-mono`, `text-base`, `text-lg`
- **Spacing**: `radius-sm`, `radius-md`, `radius-lg`
- **Shadows**: `shadow-sm`, `shadow-md`, `shadow-lg`

#### Examples

##### Basic Usage

```typescript
const resolver = new TokenResolver();
const theme = await resolver.loadTheme('calm-wellness');

const tokens = resolver.resolveTokens(theme);

// Access color token
console.log(tokens['color-primary']);
// Output:
// {
//   value: 'oklch(0.65 0.15 270)',
//   cssVariable: 'var(--color-primary)'
// }

// Access typography token
console.log(tokens['text-lg']);
// Output:
// {
//   value: '1.125rem',
//   cssVariable: 'var(--text-lg)'
// }
```

##### Listing All Tokens

```typescript
const tokens = resolver.resolveTokens(theme);

Object.keys(tokens).forEach(tokenName => {
  const token = tokens[tokenName];
  console.log(`${tokenName}: ${token.value} → ${token.cssVariable}`);
});

// Output:
// color-primary: oklch(0.65 0.15 270) → var(--color-primary)
// color-surface: oklch(0.98 0.01 270) → var(--color-surface)
// text-base: 1rem → var(--text-base)
// radius-lg: 0.5rem → var(--radius-lg)
// ...
```

##### Using Resolved Tokens

```typescript
const tokens = resolver.resolveTokens(theme);

// Generate inline styles
const styles = {
  backgroundColor: tokens['color-surface'].cssVariable,
  color: tokens['color-on-surface'].cssVariable,
  borderRadius: tokens['radius-lg'].cssVariable
};

console.log(styles);
// Output:
// {
//   backgroundColor: 'var(--color-surface)',
//   color: 'var(--color-on-surface)',
//   borderRadius: 'var(--radius-lg)'
// }
```

---

### getTokenValue

Safely retrieve a token value with optional fallback.

#### Signature

```typescript
getTokenValue(
  tokens: ResolvedTokens,
  key: string,
  fallback?: string
): string
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tokens` | `ResolvedTokens` | Yes | Resolved tokens map (from `resolveTokens`) |
| `key` | `string` | Yes | Token key to retrieve |
| `fallback` | `string` | No | Fallback value if token not found |

#### Returns

`string` - Token value (CSS variable syntax) or fallback

#### Behavior

1. **Lookup Token**: Search for token in `tokens` map
2. **If Found**: Return `token.cssVariable` (e.g., `"var(--color-primary)"`)
3. **If Not Found**:
   - Emit console warning
   - Return `fallback` if provided
   - Otherwise, return `key` as-is

#### Warning System

When token not found, emits warning to console:

```
Warning: Token 'color-unknown' not found in theme 'calm-wellness'
```

This helps identify:
- Typos in token names
- Missing tokens in theme configuration
- Need to add tokens to theme

#### Examples

##### Basic Usage

```typescript
const resolver = new TokenResolver();
const theme = await resolver.loadTheme('calm-wellness');
const tokens = resolver.resolveTokens(theme);

// Retrieve existing token
const primaryColor = resolver.getTokenValue(tokens, 'color-primary');
console.log(primaryColor); // "var(--color-primary)"
```

##### With Fallback

```typescript
// Retrieve non-existent token with fallback
const unknownColor = resolver.getTokenValue(
  tokens,
  'color-brand-blue',  // Doesn't exist
  '#6366f1'            // Fallback
);

console.log(unknownColor); // "#6366f1"
// Console warning: Token 'color-brand-blue' not found in theme
```

##### Without Fallback

```typescript
// Retrieve non-existent token without fallback
const unknownColor = resolver.getTokenValue(tokens, 'color-unknown');

console.log(unknownColor); // "color-unknown" (returns key as-is)
// Console warning: Token 'color-unknown' not found in theme
```

##### Safe Access Pattern

```typescript
// Defensive pattern for optional tokens
function getBackgroundColor(tokens: ResolvedTokens): string {
  return resolver.getTokenValue(
    tokens,
    'color-background',
    'var(--color-surface)'  // Fallback to surface color
  );
}
```

---

### clearCache

Clear the theme cache manually.

#### Signature

```typescript
clearCache(): void
```

#### Parameters

None

#### Returns

`void`

#### Use Cases

- **Development**: Clear cache after editing theme files
- **Testing**: Ensure fresh theme loads in test suites
- **Memory Management**: Free memory in long-running processes

#### Example

```typescript
const resolver = new TokenResolver();

// Load theme (gets cached)
await resolver.loadTheme('calm-wellness');

// Edit theme file...

// Clear cache to reload
resolver.clearCache();

// Load theme again (reads from file)
await resolver.loadTheme('calm-wellness');
```

---

## Types

### ThemeConfig

Complete theme configuration interface:

```typescript
interface ThemeConfig {
  id: string;                       // Unique identifier (e.g., "calm-wellness")
  name: string;                     // Display name (e.g., "Calm Wellness")
  description: string;              // Theme description
  version: string;                  // Semantic version (e.g., "1.0.0")
  brandTone: string;                // Tone matching (calm, professional, energetic)
  colorPalette: ColorPalette;       // Color definitions
  typography: Typography;           // Font settings
  componentDefaults: ComponentDefaults; // Component styling
  aiContext: AIContext;             // AI guidance
}
```

### ColorPalette

Color definitions using OKLCH color space:

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

### Typography

Typography configuration:

```typescript
interface Typography {
  fontFamily: {
    sans: string;     // Sans-serif font stack
    mono: string;     // Monospace font stack
  };
  scale: {
    xs: string;       // Extra small (e.g., "0.75rem")
    sm: string;       // Small (e.g., "0.875rem")
    base: string;     // Base (e.g., "1rem")
    lg: string;       // Large (e.g., "1.125rem")
    xl: string;       // Extra large (e.g., "1.25rem")
    // ... more sizes
  };
}
```

### ComponentDefaults

Component styling defaults:

```typescript
interface ComponentDefaults {
  borderRadius: {
    sm: string;       // Small radius (e.g., "0.25rem")
    md: string;       // Medium radius (e.g., "0.375rem")
    lg: string;       // Large radius (e.g., "0.5rem")
    xl: string;       // Extra large radius (e.g., "0.75rem")
  };
  density: 'compact' | 'comfortable' | 'spacious';
  contrast: 'low' | 'normal' | 'high';
}
```

### ResolvedTokens

Resolved token map:

```typescript
type ResolvedTokens = Record<string, {
  value: string;        // Original value (e.g., "oklch(0.65 0.15 270)")
  cssVariable: string;  // CSS variable syntax (e.g., "var(--color-primary)")
}>;
```

---

## Usage Examples

### Example 1: Basic Theme Loading

```typescript
import { TokenResolver } from '@tekton/component-generator';

async function loadTheme() {
  const resolver = new TokenResolver();

  // Load theme
  const theme = await resolver.loadTheme('calm-wellness');

  // Resolve tokens
  const tokens = resolver.resolveTokens(theme);

  // Get specific token
  const primaryColor = resolver.getTokenValue(tokens, 'color-primary');

  console.log(`Primary color: ${primaryColor}`);
}

loadTheme();
```

### Example 2: Multi-Theme Application

```typescript
import { TokenResolver } from '@tekton/component-generator';

class ThemeManager {
  private resolver: TokenResolver;
  private currentTheme: string = 'calm-wellness';

  constructor() {
    this.resolver = new TokenResolver();
  }

  async switchTheme(themeId: string) {
    try {
      const theme = await this.resolver.loadTheme(themeId);
      const tokens = this.resolver.resolveTokens(theme);

      this.currentTheme = themeId;
      this.applyTokensToDOM(tokens);

      console.log(`Switched to theme: ${theme.name}`);
    } catch (error) {
      console.error(`Failed to switch theme: ${error.message}`);
    }
  }

  private applyTokensToDOM(tokens: ResolvedTokens) {
    const root = document.documentElement;

    // Set CSS variables on :root
    Object.entries(tokens).forEach(([key, token]) => {
      root.style.setProperty(`--${key}`, token.value);
    });
  }
}

const manager = new ThemeManager();
await manager.switchTheme('professional-dark');
```

### Example 3: Theme Validation

```typescript
import { TokenResolver } from '@tekton/component-generator';

async function validateTheme(themeId: string): Promise<boolean> {
  const resolver = new TokenResolver();

  try {
    const theme = await resolver.loadTheme(themeId);

    // Validate required fields
    const requiredFields = ['id', 'name', 'colorPalette', 'typography'];
    for (const field of requiredFields) {
      if (!(field in theme)) {
        console.error(`Missing required field: ${field}`);
        return false;
      }
    }

    // Validate color palette
    if (Object.keys(theme.colorPalette).length === 0) {
      console.error('Color palette is empty');
      return false;
    }

    console.log(`Theme ${themeId} is valid`);
    return true;
  } catch (error) {
    console.error(`Theme validation failed: ${error.message}`);
    return false;
  }
}

await validateTheme('calm-wellness');
```

### Example 4: Custom Token Extraction

```typescript
import { TokenResolver } from '@tekton/component-generator';

async function extractColorTokens(themeId: string) {
  const resolver = new TokenResolver();
  const theme = await resolver.loadTheme(themeId);
  const tokens = resolver.resolveTokens(theme);

  // Extract only color tokens
  const colorTokens = Object.entries(tokens)
    .filter(([key]) => key.startsWith('color-'))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, typeof tokens[string]>);

  return colorTokens;
}

const colors = await extractColorTokens('calm-wellness');
console.log('Available colors:', Object.keys(colors));
```

---

## Error Handling

### Common Errors

#### Theme Not Found

```typescript
// Error: ENOENT: no such file or directory
try {
  await resolver.loadTheme('non-existent');
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error('Theme file does not exist');
    // Fallback to default theme
    await resolver.loadTheme('calm-wellness');
  }
}
```

#### Invalid JSON

```typescript
// Error: Unexpected token in JSON
try {
  await resolver.loadTheme('broken-theme');
} catch (error) {
  if (error instanceof SyntaxError) {
    console.error('Invalid JSON in theme file');
    console.error('Fix the theme file and try again');
  }
}
```

#### Missing Required Fields

```typescript
try {
  const theme = await resolver.loadTheme('incomplete-theme');
  const tokens = resolver.resolveTokens(theme);
} catch (error) {
  console.error('Theme does not match required interface');
  console.error(error.message);
}
```

### Best Practices for Error Handling

```typescript
async function safeLoadTheme(
  resolver: TokenResolver,
  themeId: string,
  fallbackThemeId: string = 'calm-wellness'
): Promise<ThemeConfig> {
  try {
    return await resolver.loadTheme(themeId);
  } catch (primaryError) {
    console.warn(`Failed to load theme '${themeId}':`, primaryError.message);

    try {
      console.log(`Falling back to '${fallbackThemeId}'`);
      return await resolver.loadTheme(fallbackThemeId);
    } catch (fallbackError) {
      console.error(`Fallback theme also failed:`, fallbackError.message);
      throw new Error('Unable to load any theme');
    }
  }
}
```

---

## Performance

### Caching Behavior

TokenResolver implements an LRU (Least Recently Used) cache:

**Cache Hit** (theme already loaded):
- Time: < 1ms
- No file I/O
- Instant return from memory

**Cache Miss** (theme not yet loaded):
- Time: ~50ms (includes file read and JSON parse)
- Single file I/O operation
- Theme stored in cache after load

### Performance Metrics

| Operation | Time (cached) | Time (uncached) | Memory |
|-----------|---------------|-----------------|--------|
| `loadTheme` | < 1ms | ~50ms | ~50KB per theme |
| `resolveTokens` | ~1ms | ~1ms | ~10KB per token set |
| `getTokenValue` | < 0.1ms | < 0.1ms | Negligible |

### Optimization Tips

1. **Preload Themes**: Load frequently used themes on application startup
2. **Increase Cache Size**: For multi-theme apps, increase `cacheSize` option
3. **Batch Operations**: Load multiple themes in parallel with `Promise.all()`
4. **Avoid Repeated Parsing**: Resolve tokens once and reuse the result

**Example: Preloading**

```typescript
const resolver = new TokenResolver({ cacheSize: 20 });

// Preload common themes on startup
await Promise.all([
  resolver.loadTheme('calm-wellness'),
  resolver.loadTheme('professional-dark'),
  resolver.loadTheme('energetic-bright')
]);

// Later theme loads will be instant (cache hit)
```

---

## Best Practices

### 1. Singleton Pattern

Create a single TokenResolver instance and reuse it:

```typescript
// theme-service.ts
import { TokenResolver } from '@tekton/component-generator';

export const themeResolver = new TokenResolver({
  themesPath: './themes',
  cacheSize: 20
});

// other-file.ts
import { themeResolver } from './theme-service';

const theme = await themeResolver.loadTheme('calm-wellness');
```

### 2. Type-Safe Token Access

Create type-safe helpers for token access:

```typescript
type TokenKey = 'color-primary' | 'color-surface' | 'radius-lg'; // ... all tokens

function getToken(
  resolver: TokenResolver,
  tokens: ResolvedTokens,
  key: TokenKey,
  fallback?: string
): string {
  return resolver.getTokenValue(tokens, key, fallback);
}
```

### 3. Centralized Theme Loading

```typescript
class ThemeService {
  private resolver: TokenResolver;
  private loadedThemes: Map<string, ThemeConfig> = new Map();

  constructor() {
    this.resolver = new TokenResolver();
  }

  async getTheme(themeId: string): Promise<ThemeConfig> {
    if (!this.loadedThemes.has(themeId)) {
      const theme = await this.resolver.loadTheme(themeId);
      this.loadedThemes.set(themeId, theme);
    }

    return this.loadedThemes.get(themeId)!;
  }
}
```

### 4. Fallback Chains

```typescript
function getColorWithFallback(
  resolver: TokenResolver,
  tokens: ResolvedTokens,
  ...keys: string[]
): string {
  for (const key of keys) {
    const value = resolver.getTokenValue(tokens, key);
    if (value !== key) {  // Found valid token
      return value;
    }
  }

  // All failed, return final fallback
  return '#000000';
}

// Usage
const textColor = getColorWithFallback(
  resolver,
  tokens,
  'color-on-surface',
  'color-text',
  'color-foreground'
);
```

### 5. Development vs Production

```typescript
const resolver = new TokenResolver({
  themesPath: process.env.NODE_ENV === 'production'
    ? '/app/themes'
    : './themes',
  cacheSize: process.env.NODE_ENV === 'production'
    ? 50   // Larger cache in production
    : 5    // Smaller cache in development
});
```

---

## Related Documentation

- [Theme Binding System Specification](../../../.moai/specs/SPEC-THEME-BIND-001/spec.md)
- [API Changes Documentation](../../../.moai/specs/SPEC-THEME-BIND-001/api.md)
- [Migration Guide](../../../.moai/specs/SPEC-THEME-BIND-001/migration.md)
- [Component Generator README](../README.md#theme-binding-system)

---

**Document Version**: 1.0.0
**Last Updated**: 2026-01-21
**Package**: @tekton/component-generator
**Status**: ✅ Current
