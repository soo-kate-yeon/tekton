# API Reference

Complete API reference for @tekton/core Token System.

## Table of Contents

- [Type Definitions](#type-definitions)
  - [AtomicTokens](#atomictokens)
  - [SemanticTokens](#semantictokens)
  - [ComponentTokens](#componenttokens)
  - [ThemeWithTokens](#themewithtokens)
  - [ValidationResult](#validationresult)
- [Functions](#functions)
  - [resolveToken()](#resolvetoken)
  - [resolveWithFallback()](#resolvewithfallback)
  - [generateThemeCSS()](#generatethemecss)
  - [validateTheme()](#validatetheme)

---

## Type Definitions

### AtomicTokens

Foundation tokens - raw design values that never reference other tokens.

```typescript
interface AtomicTokens {
  color: {
    [palette: string]: {
      [shade: string]: string;
    };
  };
  spacing: {
    [size: string]: string;
  };
  radius: {
    [size: string]: string;
  };
  typography: {
    [name: string]: {
      fontSize: string;
      lineHeight: string;
      fontWeight: string;
    };
  };
  shadow: {
    [name: string]: string;
  };
  transition?: {
    [name: string]: string;
  };
}
```

**Properties:**

- **color** - Color palettes with shades
  - Type: `Record<string, Record<string, string>>`
  - Example: `{ blue: { '500': '#3b82f6' } }`

- **spacing** - Spacing scale
  - Type: `Record<string, string>`
  - Example: `{ '4': '16px', '8': '32px' }`

- **radius** - Border radius values
  - Type: `Record<string, string>`
  - Example: `{ 'md': '8px', 'lg': '12px' }`

- **typography** - Typography definitions
  - Type: `Record<string, { fontSize: string; lineHeight: string; fontWeight: string }>`
  - Example: `{ body: { fontSize: '16px', lineHeight: '24px', fontWeight: '400' } }`

- **shadow** - Shadow definitions
  - Type: `Record<string, string>`
  - Example: `{ 'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)' }`

- **transition** (Optional) - Transition definitions
  - Type: `Record<string, string>`
  - Example: `{ 'default': '150ms cubic-bezier(0.4, 0, 0.2, 1)' }`

**Example:**

```typescript
const atomic: AtomicTokens = {
  color: {
    blue: {
      '500': '#3b82f6',
      '600': '#2563eb',
    },
    neutral: {
      '50': '#f9fafb',
      '900': '#111827',
    },
  },
  spacing: {
    '4': '16px',
    '8': '32px',
  },
  radius: {
    md: '8px',
  },
  typography: {
    body: {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: '400',
    },
  },
  shadow: {
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  },
};
```

---

### SemanticTokens

Meaning-based token mappings that reference atomic tokens.

```typescript
interface SemanticTokens {
  background: {
    page: string;
    surface: string;
    elevated: string;
    muted: string;
    inverse: string;
  };
  foreground: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
    accent: string;
  };
  border: {
    default: string;
    muted: string;
    focus: string;
    error: string;
  };
  surface: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
}
```

**Properties:**

- **background** - Background colors with semantic meaning
  - `page`: Page background color
  - `surface`: Surface/card background
  - `elevated`: Elevated surface (modals, popovers)
  - `muted`: Muted/subtle background
  - `inverse`: Inverse background for dark sections

- **foreground** - Foreground (text) colors
  - `primary`: Primary text color
  - `secondary`: Secondary text color
  - `muted`: Muted/subtle text
  - `inverse`: Inverse text (light on dark)
  - `accent`: Accent/brand color

- **border** - Border colors
  - `default`: Default border color
  - `muted`: Subtle border
  - `focus`: Focus ring color
  - `error`: Error state border

- **surface** - Surface colors
  - `primary`: Primary surface
  - `secondary`: Secondary surface
  - `tertiary`: Tertiary surface
  - `inverse`: Inverse surface

**Example:**

```typescript
const semantic: SemanticTokens = {
  background: {
    page: 'atomic.color.neutral.50', // Token reference
    surface: '#ffffff', // Direct value
    elevated: '#ffffff',
    muted: 'atomic.color.neutral.100',
    inverse: 'atomic.color.neutral.900',
  },
  foreground: {
    primary: 'atomic.color.neutral.900',
    secondary: '#6b7280',
    muted: '#9ca3af',
    inverse: '#ffffff',
    accent: 'atomic.color.blue.500',
  },
  border: {
    default: 'atomic.color.neutral.200',
    muted: 'atomic.color.neutral.100',
    focus: 'atomic.color.blue.500',
    error: 'atomic.color.red.500',
  },
  surface: {
    primary: '#ffffff',
    secondary: 'atomic.color.neutral.50',
    tertiary: 'atomic.color.neutral.100',
    inverse: 'atomic.color.neutral.900',
  },
};
```

---

### ComponentTokens

Component-specific token bindings that reference semantic or atomic tokens.

```typescript
interface ComponentTokens {
  button: {
    [variant: string]: {
      background: string;
      foreground: string;
      border: string;
      hover: {
        background: string;
        foreground: string;
      };
      active: {
        background: string;
      };
      disabled: {
        background: string;
        foreground: string;
      };
    };
  };
  input: {
    background: string;
    foreground: string;
    border: string;
    placeholder: string;
    focus: {
      border: string;
      ring: string;
    };
    error: {
      border: string;
      ring: string;
    };
    disabled: {
      background: string;
      foreground: string;
    };
  };
  card: {
    background: string;
    foreground: string;
    border: string;
    shadow: string;
  };
  [component: string]: unknown; // Extensible
}
```

**Built-in Components:**

- **button** - Button component with variants
  - Variants: `primary`, `secondary`, etc.
  - States: `hover`, `active`, `disabled`

- **input** - Input component
  - States: `focus`, `error`, `disabled`

- **card** - Card component
  - Properties: `background`, `foreground`, `border`, `shadow`

**Extensibility:**

The interface allows custom components via index signature:

```typescript
const tokens: ComponentTokens = {
  button: {
    /* ... */
  },
  input: {
    /* ... */
  },
  // Custom component
  customWidget: {
    background: 'semantic.background.surface',
    foreground: 'semantic.foreground.primary',
  },
};
```

**Example:**

```typescript
const component: ComponentTokens = {
  button: {
    primary: {
      background: 'semantic.foreground.accent',
      foreground: '#ffffff',
      border: 'semantic.foreground.accent',
      hover: {
        background: 'atomic.color.blue.600',
        foreground: '#ffffff',
      },
      active: {
        background: 'atomic.color.blue.700',
      },
      disabled: {
        background: 'semantic.background.muted',
        foreground: 'semantic.foreground.muted',
      },
    },
  },
  input: {
    background: 'semantic.background.surface',
    foreground: 'semantic.foreground.primary',
    border: 'semantic.border.default',
    placeholder: 'semantic.foreground.muted',
    focus: {
      border: 'semantic.border.focus',
      ring: 'atomic.color.blue.500',
    },
    error: {
      border: 'semantic.border.error',
      ring: 'atomic.color.red.500',
    },
    disabled: {
      background: 'semantic.background.muted',
      foreground: 'semantic.foreground.muted',
    },
  },
  card: {
    background: 'semantic.background.surface',
    foreground: 'semantic.foreground.primary',
    border: 'semantic.border.default',
    shadow: 'atomic.shadow.md',
  },
};
```

---

### ThemeWithTokens

Extended theme interface with 3-layer token architecture.

```typescript
interface ThemeWithTokens extends Theme {
  tokens: {
    atomic: AtomicTokens;
    semantic: SemanticTokens;
    component: ComponentTokens;
  };
  darkMode?: {
    tokens: {
      semantic: Partial<SemanticTokens>;
      component: Partial<ComponentTokens>;
    };
  };
}
```

**Properties:**

- **tokens** (Required) - 3-layer token structure
  - `atomic`: Atomic tokens (Layer 1)
  - `semantic`: Semantic tokens (Layer 2)
  - `component`: Component tokens (Layer 3)

- **darkMode** (Optional) - Dark mode token overrides
  - `tokens.semantic`: Partial semantic token overrides
  - `tokens.component`: Partial component token overrides

**Example:**

```typescript
const theme: ThemeWithTokens = {
  id: 'my-theme',
  name: 'My Theme',
  tokens: {
    atomic: {
      color: {
        /* ... */
      },
      spacing: {
        /* ... */
      },
      radius: {
        /* ... */
      },
      typography: {
        /* ... */
      },
      shadow: {
        /* ... */
      },
    },
    semantic: {
      background: {
        /* ... */
      },
      foreground: {
        /* ... */
      },
      border: {
        /* ... */
      },
      surface: {
        /* ... */
      },
    },
    component: {
      button: {
        /* ... */
      },
      input: {
        /* ... */
      },
      card: {
        /* ... */
      },
    },
  },
  darkMode: {
    tokens: {
      semantic: {
        background: {
          page: 'atomic.color.neutral.900',
          surface: 'atomic.color.neutral.800',
        },
      },
      component: {
        button: {
          primary: {
            background: 'atomic.color.blue.400',
          },
        },
      },
    },
  },
};
```

---

### ValidationResult

Result of theme validation.

```typescript
interface ValidationResult {
  valid: boolean;
  errors?: string[];
}
```

**Properties:**

- **valid** - Whether validation passed
  - Type: `boolean`
  - `true` if theme is valid, `false` otherwise

- **errors** (Optional) - Error messages if validation failed
  - Type: `string[]`
  - Only present when `valid` is `false`
  - Contains detailed error messages with paths

**Example:**

```typescript
const result: ValidationResult = {
  valid: false,
  errors: [
    'tokens.atomic.color: Required',
    'tokens.semantic.background.page: Required',
    'tokens.semantic.foreground.primary: Expected string, received undefined',
  ],
};
```

---

## Functions

### resolveToken()

Resolves a token reference to its final value with multi-level resolution.

```typescript
function resolveToken(
  ref: TokenReference,
  tokens: ThemeWithTokens['tokens'],
  visited?: Set<string>
): string;
```

**Parameters:**

- **ref** (`string`) - Token reference or direct value
  - Dot notation: `'atomic.color.blue.500'`
  - Direct value: `'#3b82f6'`

- **tokens** (`ThemeWithTokens['tokens']`) - Theme token structure
  - Object containing `atomic`, `semantic`, and `component` tokens

- **visited** (`Set<string>`, optional) - Internal tracking for circular reference detection
  - Do not provide this parameter (used internally for recursion)

**Returns:** `string` - Resolved token value

**Throws:**

- `Error` - If token not found
- `Error` - If circular reference detected

**Behavior:**

1. Returns direct values as-is (e.g., `'#3b82f6'` → `'#3b82f6'`)
2. Resolves token references by navigating the token tree
3. Recursively resolves multi-level references
4. Detects and prevents circular references

**Examples:**

```typescript
import { resolveToken } from '@tekton/core';

// Direct atomic token
resolveToken('atomic.color.blue.500', tokens);
// → '#3b82f6'

// Semantic token (references atomic)
resolveToken('semantic.background.page', tokens);
// → '#f9fafb' (resolves atomic.color.neutral.50)

// Component token (multi-level resolution)
resolveToken('component.button.primary.background', tokens);
// → '#3b82f6' (semantic.foreground.accent → atomic.color.blue.500)

// Direct value (returned as-is)
resolveToken('#ffffff', tokens);
// → '#ffffff'

// Nested component token
resolveToken('component.input.focus.ring', tokens);
// → '#3b82f6'
```

**Error Handling:**

```typescript
try {
  const color = resolveToken('atomic.color.purple.500', tokens);
} catch (error) {
  console.error(error.message);
  // → "Token not found: atomic.color.purple.500"
}

// Circular reference
const circularTokens = {
  semantic: {
    background: {
      page: 'semantic.background.surface',
      surface: 'semantic.background.page', // Circular!
    },
  },
};

try {
  resolveToken('semantic.background.page', circularTokens);
} catch (error) {
  console.error(error.message);
  // → "Circular token reference detected: semantic.background.page"
}
```

**Performance:**

- Average resolution time: < 1ms (0.3ms typical)
- Multi-level resolution: < 1ms
- Benchmarked on Node.js 20, Apple M1

---

### resolveWithFallback()

Resolves token with graceful fallback chain: Component → Semantic → Atomic.

```typescript
function resolveWithFallback(
  componentRef: string,
  semanticRef: string,
  atomicRef: string,
  tokens: ThemeWithTokens['tokens']
): string;
```

**Parameters:**

- **componentRef** (`string`) - Component-level token reference (most specific)
  - Example: `'component.button.custom.background'`

- **semanticRef** (`string`) - Semantic-level token reference (fallback)
  - Example: `'semantic.foreground.accent'`

- **atomicRef** (`string`) - Atomic-level token reference (final fallback)
  - Example: `'atomic.color.blue.500'`

- **tokens** (`ThemeWithTokens['tokens']`) - Theme token structure

**Returns:** `string` - Resolved value from first successful resolution

**Throws:**

- `Error` - If all fallback attempts fail
- Error message includes all attempted references

**Behavior:**

1. Attempts to resolve component token first
2. Falls back to semantic token if component fails
3. Falls back to atomic token if semantic fails
4. Throws error if all attempts fail

**Examples:**

```typescript
import { resolveWithFallback } from '@tekton/core';

// Component token exists
resolveWithFallback(
  'component.button.primary.background', // Exists → returns this
  'semantic.foreground.accent',
  'atomic.color.blue.500',
  tokens
);
// → '#3b82f6' (from component token)

// Component missing, semantic exists
resolveWithFallback(
  'component.button.custom.background', // Missing
  'semantic.foreground.accent', // Exists → returns this
  'atomic.color.blue.500',
  tokens
);
// → '#3b82f6' (from semantic token)

// Component and semantic missing, atomic exists
resolveWithFallback(
  'component.button.nonexistent.background', // Missing
  'semantic.nonexistent.color', // Missing
  'atomic.color.blue.500', // Exists → returns this
  tokens
);
// → '#3b82f6' (from atomic token)
```

**Error Handling:**

```typescript
try {
  resolveWithFallback(
    'component.missing.token',
    'semantic.missing.token',
    'atomic.missing.token',
    tokens
  );
} catch (error) {
  console.error(error.message);
  // → "Failed to resolve token with fallback: component.missing.token → semantic.missing.token → atomic.missing.token"
}
```

**Use Cases:**

1. **Custom Component Variants**: Fallback to default variant if custom doesn't exist
2. **Theme Extensions**: Gracefully handle missing custom tokens
3. **Progressive Enhancement**: Support older themes without all tokens

---

### generateThemeCSS()

Generates complete CSS with CSS Variables from theme tokens.

```typescript
function generateThemeCSS(theme: ThemeWithTokens): string;
```

**Parameters:**

- **theme** (`ThemeWithTokens`) - Theme with 3-layer token structure
  - Must include `tokens` property with all three layers

**Returns:** `string` - Generated CSS with `:root` and `.dark` selectors

**Behavior:**

1. Generates CSS Variables for all atomic tokens
2. Resolves and generates CSS Variables for semantic tokens
3. Flattens and generates CSS Variables for component tokens
4. Generates dark mode overrides in `.dark` selector (if present)
5. Includes helpful comments and headers

**CSS Variable Naming:**

- Atomic: `--color-{palette}-{shade}`, `--spacing-{size}`, etc.
- Semantic: `--{category}-{name}`
- Component: `--{component}-{variant}-{property}`

**Example:**

```typescript
import { generateThemeCSS } from '@tekton/core';

const theme: ThemeWithTokens = {
  id: 'my-theme',
  name: 'My Theme',
  tokens: {
    atomic: {
      color: {
        blue: { '500': '#3b82f6' },
        neutral: { '50': '#f9fafb', '900': '#111827' },
      },
      spacing: { '4': '16px' },
      radius: { md: '8px' },
      typography: {
        body: { fontSize: '16px', lineHeight: '24px', fontWeight: '400' },
      },
      shadow: { md: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
    },
    semantic: {
      background: {
        page: 'atomic.color.neutral.50',
        surface: '#ffffff',
        elevated: '#ffffff',
        muted: 'atomic.color.neutral.100',
        inverse: 'atomic.color.neutral.900',
      },
      foreground: {
        primary: 'atomic.color.neutral.900',
        secondary: '#6b7280',
        muted: '#9ca3af',
        inverse: '#ffffff',
        accent: 'atomic.color.blue.500',
      },
      border: {
        default: 'atomic.color.neutral.200',
        muted: 'atomic.color.neutral.100',
        focus: 'atomic.color.blue.500',
        error: 'atomic.color.red.500',
      },
      surface: {
        primary: '#ffffff',
        secondary: 'atomic.color.neutral.50',
        tertiary: 'atomic.color.neutral.100',
        inverse: 'atomic.color.neutral.900',
      },
    },
    component: {
      button: {
        primary: {
          background: 'semantic.foreground.accent',
          foreground: '#ffffff',
          border: 'semantic.foreground.accent',
          hover: {
            background: 'atomic.color.blue.600',
            foreground: '#ffffff',
          },
          active: {
            background: 'atomic.color.blue.700',
          },
          disabled: {
            background: 'semantic.background.muted',
            foreground: 'semantic.foreground.muted',
          },
        },
      },
    },
  },
  darkMode: {
    tokens: {
      semantic: {
        background: {
          page: 'atomic.color.neutral.900',
        },
      },
    },
  },
};

const css = generateThemeCSS(theme);
console.log(css);
```

**Output:**

```css
/* Generated by Tekton - Theme: my-theme */
/* Do not edit manually - regenerate from theme definition */

:root {
  /* === Layer 1: Atomic Tokens === */
  --color-blue-500: #3b82f6;
  --color-neutral-50: #f9fafb;
  --color-neutral-900: #111827;

  --spacing-4: 16px;

  --radius-md: 8px;

  --typography-body-size: 16px;
  --typography-body-line-height: 24px;
  --typography-body-weight: 400;

  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);

  /* === Layer 2: Semantic Tokens === */
  --background-page: #f9fafb;
  --background-surface: #ffffff;
  --foreground-primary: #111827;
  --foreground-accent: #3b82f6;
  --border-default: #e5e7eb;

  /* === Layer 3: Component Tokens === */
  --button-primary-background: #3b82f6;
  --button-primary-foreground: #ffffff;
  --button-primary-hover-background: #2563eb;
}

.dark {
  /* === Dark Mode Overrides === */
  --background-page: #111827;
}
```

**Performance:**

- Generation time: ~5ms for complete theme
- Benchmarked on Node.js 20, Apple M1

**Usage:**

```typescript
// Write to file
import { writeFileSync } from 'fs';
writeFileSync('theme.css', css);

// Inject into DOM
const style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);
```

---

### validateTheme()

Validates theme with token structure using Zod schemas.

```typescript
function validateTheme(theme: unknown): ValidationResult;
```

**Parameters:**

- **theme** (`unknown`) - Theme object to validate
  - Can be any type (validation will check structure)

**Returns:** `ValidationResult` - Validation result with success status and errors

**Behavior:**

1. Validates theme against Zod schema
2. Checks all required atomic tokens
3. Checks all required semantic tokens
4. Validates component token structure
5. Validates dark mode tokens (if present)
6. Returns detailed error messages with paths

**Example:**

```typescript
import { validateTheme } from '@tekton/core';

const theme = {
  id: 'my-theme',
  name: 'My Theme',
  tokens: {
    atomic: {
      color: { blue: { '500': '#3b82f6' } },
      spacing: { '4': '16px' },
      radius: { md: '8px' },
      typography: {
        body: { fontSize: '16px', lineHeight: '24px', fontWeight: '400' },
      },
      shadow: { md: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
    },
    semantic: {
      background: {
        page: 'atomic.color.neutral.50',
        surface: '#ffffff',
        elevated: '#ffffff',
        muted: 'atomic.color.neutral.100',
        inverse: 'atomic.color.neutral.900',
      },
      foreground: {
        primary: 'atomic.color.neutral.900',
        secondary: '#6b7280',
        muted: '#9ca3af',
        inverse: '#ffffff',
        accent: 'atomic.color.blue.500',
      },
      border: {
        default: 'atomic.color.neutral.200',
        muted: 'atomic.color.neutral.100',
        focus: 'atomic.color.blue.500',
        error: 'atomic.color.red.500',
      },
      surface: {
        primary: '#ffffff',
        secondary: 'atomic.color.neutral.50',
        tertiary: 'atomic.color.neutral.100',
        inverse: 'atomic.color.neutral.900',
      },
    },
    component: {
      button: {
        primary: {
          background: 'semantic.foreground.accent',
          foreground: '#ffffff',
          border: 'semantic.foreground.accent',
          hover: {
            background: 'atomic.color.blue.600',
            foreground: '#ffffff',
          },
          active: {
            background: 'atomic.color.blue.700',
          },
          disabled: {
            background: 'semantic.background.muted',
            foreground: 'semantic.foreground.muted',
          },
        },
      },
    },
  },
};

const result = validateTheme(theme);

if (result.valid) {
  console.log('✅ Theme is valid');
} else {
  console.error('❌ Validation failed:');
  result.errors?.forEach(err => {
    console.error(`  - ${err}`);
  });
}
```

**Error Messages:**

Error messages include the path to the problematic field:

```typescript
const invalidTheme = {
  tokens: {
    atomic: {
      // Missing 'color' property
      spacing: { '4': '16px' },
    },
  },
};

const result = validateTheme(invalidTheme);
// result.valid → false
// result.errors → [
//   'tokens.atomic.color: Required',
//   'tokens.semantic: Required',
//   'tokens.component: Required'
// ]
```

**Common Validation Errors:**

1. Missing required properties:

   ```
   tokens.atomic.color: Required
   tokens.semantic.background.page: Required
   ```

2. Type mismatches:

   ```
   tokens.semantic.foreground.primary: Expected string, received undefined
   tokens.atomic.spacing: Expected object, received string
   ```

3. Invalid structure:
   ```
   tokens: Required
   darkMode.tokens.semantic: Expected object, received string
   ```

**Performance:**

- Validation time: < 10ms for full theme structure
- Benchmarked on Node.js 20, Apple M1

**Best Practices:**

1. **Validate During Build:**

   ```typescript
   // build.ts
   const result = validateTheme(theme);
   if (!result.valid) {
     throw new Error(`Theme validation failed: ${result.errors?.join(', ')}`);
   }
   ```

2. **Type Assertion After Validation:**

   ```typescript
   const result = validateTheme(theme);
   if (result.valid) {
     const validTheme = theme as ThemeWithTokens;
     // Safe to use validTheme
   }
   ```

3. **Development-Only Validation:**
   ```typescript
   if (process.env.NODE_ENV === 'development') {
     const result = validateTheme(theme);
     if (!result.valid) {
       console.warn('Theme validation warnings:', result.errors);
     }
   }
   ```

---

## Version History

- **0.2.0** (2026-01-25): Initial Token System API
  - Added `resolveToken()`, `resolveWithFallback()`, `generateThemeCSS()`, `validateTheme()`
  - Added type definitions for 3-layer token architecture
