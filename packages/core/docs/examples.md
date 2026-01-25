# Token System Examples

Real-world usage examples for the 3-Layer Token System.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Building a Complete Theme](#building-a-complete-theme)
- [Dark Mode Implementation](#dark-mode-implementation)
- [Custom Component Tokens](#custom-component-tokens)
- [Token Resolution Patterns](#token-resolution-patterns)
- [Integration with React](#integration-with-react)
- [Migration from Old System](#migration-from-old-system)

---

## Basic Usage

### Quick Start

Create a minimal theme with token system:

```typescript
import type { ThemeWithTokens } from '@tekton/core';
import { generateThemeCSS, validateTheme } from '@tekton/core';

const theme: ThemeWithTokens = {
  id: 'minimal-theme',
  name: 'Minimal Theme',
  tokens: {
    atomic: {
      color: {
        primary: { '500': '#3b82f6' },
        neutral: { '50': '#f9fafb', '900': '#111827' },
      },
      spacing: { '4': '16px' },
      radius: { md: '8px' },
      typography: {
        body: {
          fontSize: '16px',
          lineHeight: '24px',
          fontWeight: '400',
        },
      },
      shadow: { md: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
    },
    semantic: {
      background: {
        page: '#ffffff',
        surface: '#ffffff',
        elevated: '#ffffff',
        muted: 'atomic.color.neutral.50',
        inverse: 'atomic.color.neutral.900',
      },
      foreground: {
        primary: 'atomic.color.neutral.900',
        secondary: '#6b7280',
        muted: '#9ca3af',
        inverse: '#ffffff',
        accent: 'atomic.color.primary.500',
      },
      border: {
        default: '#e5e7eb',
        muted: '#f3f4f6',
        focus: 'atomic.color.primary.500',
        error: '#ef4444',
      },
      surface: {
        primary: '#ffffff',
        secondary: 'atomic.color.neutral.50',
        tertiary: '#f3f4f6',
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
            background: 'atomic.color.primary.600',
            foreground: '#ffffff',
          },
          active: {
            background: 'atomic.color.primary.700',
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
          ring: 'atomic.color.primary.500',
        },
        error: {
          border: 'semantic.border.error',
          ring: '#ef4444',
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
    },
  },
};

// Validate theme
const validation = validateTheme(theme);
if (!validation.valid) {
  throw new Error(`Invalid theme: ${validation.errors?.join(', ')}`);
}

// Generate CSS
const css = generateThemeCSS(theme);

// Use CSS
import { writeFileSync } from 'fs';
writeFileSync('theme.css', css);
```

---

## Building a Complete Theme

### E-commerce Theme Example

Complete theme for an e-commerce website:

```typescript
import type { ThemeWithTokens } from '@tekton/core';

const ecommerceTheme: ThemeWithTokens = {
  id: 'ecommerce-pro',
  name: 'E-commerce Pro',

  tokens: {
    // Layer 1: Atomic Tokens
    atomic: {
      color: {
        brand: {
          '50': '#eff6ff',
          '100': '#dbeafe',
          '200': '#bfdbfe',
          '300': '#93c5fd',
          '400': '#60a5fa',
          '500': '#3b82f6', // Primary brand color
          '600': '#2563eb',
          '700': '#1d4ed8',
          '800': '#1e40af',
          '900': '#1e3a8a',
        },
        neutral: {
          '50': '#f9fafb',
          '100': '#f3f4f6',
          '200': '#e5e7eb',
          '300': '#d1d5db',
          '400': '#9ca3af',
          '500': '#6b7280',
          '600': '#4b5563',
          '700': '#374151',
          '800': '#1f2937',
          '900': '#111827',
        },
        success: {
          '500': '#10b981',
          '600': '#059669',
          '700': '#047857',
        },
        warning: {
          '500': '#f59e0b',
          '600': '#d97706',
        },
        error: {
          '500': '#ef4444',
          '600': '#dc2626',
          '700': '#b91c1c',
        },
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
      radius: {
        none: '0px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
      typography: {
        xs: {
          fontSize: '12px',
          lineHeight: '16px',
          fontWeight: '400',
        },
        sm: {
          fontSize: '14px',
          lineHeight: '20px',
          fontWeight: '400',
        },
        base: {
          fontSize: '16px',
          lineHeight: '24px',
          fontWeight: '400',
        },
        lg: {
          fontSize: '18px',
          lineHeight: '28px',
          fontWeight: '400',
        },
        xl: {
          fontSize: '20px',
          lineHeight: '28px',
          fontWeight: '500',
        },
        '2xl': {
          fontSize: '24px',
          lineHeight: '32px',
          fontWeight: '600',
        },
        '3xl': {
          fontSize: '30px',
          lineHeight: '36px',
          fontWeight: '700',
        },
      },
      shadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      },
      transition: {
        fast: '100ms cubic-bezier(0.4, 0, 0.2, 1)',
        base: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
        slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },

    // Layer 2: Semantic Tokens
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
        secondary: 'atomic.color.neutral.600',
        muted: 'atomic.color.neutral.400',
        inverse: '#ffffff',
        accent: 'atomic.color.brand.500',
      },
      border: {
        default: 'atomic.color.neutral.200',
        muted: 'atomic.color.neutral.100',
        focus: 'atomic.color.brand.500',
        error: 'atomic.color.error.500',
      },
      surface: {
        primary: '#ffffff',
        secondary: 'atomic.color.neutral.50',
        tertiary: 'atomic.color.neutral.100',
        inverse: 'atomic.color.neutral.900',
      },
    },

    // Layer 3: Component Tokens
    component: {
      button: {
        primary: {
          background: 'semantic.foreground.accent',
          foreground: '#ffffff',
          border: 'semantic.foreground.accent',
          hover: {
            background: 'atomic.color.brand.600',
            foreground: '#ffffff',
          },
          active: {
            background: 'atomic.color.brand.700',
          },
          disabled: {
            background: 'semantic.background.muted',
            foreground: 'semantic.foreground.muted',
          },
        },
        secondary: {
          background: 'transparent',
          foreground: 'semantic.foreground.primary',
          border: 'semantic.border.default',
          hover: {
            background: 'semantic.background.muted',
            foreground: 'semantic.foreground.primary',
          },
          active: {
            background: 'semantic.background.muted',
          },
          disabled: {
            background: 'transparent',
            foreground: 'semantic.foreground.muted',
          },
        },
        success: {
          background: 'atomic.color.success.500',
          foreground: '#ffffff',
          border: 'atomic.color.success.500',
          hover: {
            background: 'atomic.color.success.600',
            foreground: '#ffffff',
          },
          active: {
            background: 'atomic.color.success.700',
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
          ring: 'atomic.color.brand.500',
        },
        error: {
          border: 'semantic.border.error',
          ring: 'atomic.color.error.500',
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
      // Custom: Product Card
      productCard: {
        background: 'semantic.background.surface',
        border: 'semantic.border.default',
        shadow: 'atomic.shadow.md',
        hover: {
          shadow: 'atomic.shadow.lg',
          border: 'semantic.border.focus',
        },
      },
      // Custom: Price Tag
      priceTag: {
        background: 'atomic.color.brand.50',
        foreground: 'atomic.color.brand.700',
        discount: {
          background: 'atomic.color.error.500',
          foreground: '#ffffff',
        },
      },
    },
  },
};

export default ecommerceTheme;
```

---

## Dark Mode Implementation

### Complete Dark Mode Theme

```typescript
import type { ThemeWithTokens } from '@tekton/core';

const darkModeTheme: ThemeWithTokens = {
  id: 'dark-mode-pro',
  name: 'Dark Mode Pro',

  tokens: {
    atomic: {
      color: {
        blue: {
          '400': '#60a5fa',
          '500': '#3b82f6',
          '600': '#2563eb',
        },
        neutral: {
          '50': '#f9fafb',
          '100': '#f3f4f6',
          '200': '#e5e7eb',
          '700': '#374151',
          '800': '#1f2937',
          '900': '#111827',
        },
      },
      spacing: { '4': '16px' },
      radius: { md: '8px' },
      typography: {
        body: {
          fontSize: '16px',
          lineHeight: '24px',
          fontWeight: '400',
        },
      },
      shadow: {
        md: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
        'md-dark': '0 4px 6px -1px rgb(0 0 0 / 0.6)',
      },
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
        error: '#ef4444',
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
          ring: '#ef4444',
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
    },
  },

  // Dark Mode Overrides
  darkMode: {
    tokens: {
      semantic: {
        // Invert backgrounds
        background: {
          page: 'atomic.color.neutral.900',
          surface: 'atomic.color.neutral.800',
          elevated: 'atomic.color.neutral.700',
          muted: 'atomic.color.neutral.800',
          inverse: 'atomic.color.neutral.50',
        },
        // Invert foregrounds
        foreground: {
          primary: 'atomic.color.neutral.50',
          secondary: 'atomic.color.neutral.200',
          muted: '#9ca3af',
          inverse: 'atomic.color.neutral.900',
          accent: 'atomic.color.blue.400', // Lighter for dark mode
        },
        // Adjust borders
        border: {
          default: '#374151',
          muted: '#1f2937',
          focus: 'atomic.color.blue.400',
          error: '#ef4444',
        },
        // Invert surfaces
        surface: {
          primary: 'atomic.color.neutral.800',
          secondary: 'atomic.color.neutral.700',
          tertiary: '#374151',
          inverse: 'atomic.color.neutral.50',
        },
      },
      component: {
        button: {
          primary: {
            background: 'atomic.color.blue.400', // Lighter for dark mode
            hover: {
              background: 'atomic.color.blue.500',
            },
            active: {
              background: 'atomic.color.blue.600',
            },
          },
        },
        card: {
          shadow: 'atomic.shadow.md-dark', // Stronger shadow for dark mode
        },
      },
    },
  },
};

export default darkModeTheme;
```

### Using Dark Mode in React

```tsx
import { useState, useEffect } from 'react';
import { generateThemeCSS } from '@tekton/core';
import darkModeTheme from './darkModeTheme';

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Generate and inject CSS
    const css = generateThemeCSS(darkModeTheme);
    const style = document.createElement('style');
    style.id = 'theme-css';
    style.textContent = css;
    document.head.appendChild(style);

    return () => {
      document.getElementById('theme-css')?.remove();
    };
  }, []);

  useEffect(() => {
    // Toggle dark class
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="app">
      <button onClick={() => setIsDark(!isDark)}>Toggle {isDark ? 'Light' : 'Dark'} Mode</button>
      <div className="card">
        <h1>Dark Mode Example</h1>
        <p>This card adapts to dark mode automatically.</p>
      </div>
    </div>
  );
}
```

```css
/* CSS uses CSS Variables that change with .dark class */
.card {
  background: var(--card-background);
  color: var(--card-foreground);
  border: 1px solid var(--card-border);
  box-shadow: var(--card-shadow);
  padding: var(--spacing-6);
  border-radius: var(--radius-lg);
}

/* No need for .dark .card selector - variables handle it automatically */
```

---

## Custom Component Tokens

### Adding Custom Components

```typescript
import type { ThemeWithTokens, ComponentTokens } from '@tekton/core';

// Extend ComponentTokens with custom components
interface CustomComponentTokens extends ComponentTokens {
  badge: {
    default: {
      background: string;
      foreground: string;
      border: string;
    };
    success: {
      background: string;
      foreground: string;
    };
    warning: {
      background: string;
      foreground: string;
    };
    error: {
      background: string;
      foreground: string;
    };
  };
  tooltip: {
    background: string;
    foreground: string;
    shadow: string;
  };
  alert: {
    info: {
      background: string;
      foreground: string;
      border: string;
      icon: string;
    };
    success: {
      background: string;
      foreground: string;
      border: string;
      icon: string;
    };
    warning: {
      background: string;
      foreground: string;
      border: string;
      icon: string;
    };
    error: {
      background: string;
      foreground: string;
      border: string;
      icon: string;
    };
  };
}

const customTheme: ThemeWithTokens = {
  id: 'custom-components',
  name: 'Custom Components Theme',

  tokens: {
    atomic: {
      color: {
        blue: { '50': '#eff6ff', '500': '#3b82f6', '700': '#1d4ed8' },
        green: { '50': '#f0fdf4', '500': '#10b981', '700': '#047857' },
        yellow: { '50': '#fefce8', '500': '#f59e0b', '700': '#d97706' },
        red: { '50': '#fef2f2', '500': '#ef4444', '700': '#b91c1c' },
        neutral: { '50': '#f9fafb', '900': '#111827' },
      },
      spacing: { '4': '16px' },
      radius: { md: '8px', full: '9999px' },
      typography: {
        body: { fontSize: '16px', lineHeight: '24px', fontWeight: '400' },
      },
      shadow: {
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      },
    },
    semantic: {
      background: {
        page: '#ffffff',
        surface: '#ffffff',
        elevated: '#ffffff',
        muted: 'atomic.color.neutral.50',
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
        default: '#e5e7eb',
        muted: '#f3f4f6',
        focus: 'atomic.color.blue.500',
        error: 'atomic.color.red.500',
      },
      surface: {
        primary: '#ffffff',
        secondary: 'atomic.color.neutral.50',
        tertiary: '#f3f4f6',
        inverse: 'atomic.color.neutral.900',
      },
    },
    component: {
      button: {
        primary: {
          background: 'semantic.foreground.accent',
          foreground: '#ffffff',
          border: 'semantic.foreground.accent',
          hover: { background: 'atomic.color.blue.600', foreground: '#ffffff' },
          active: { background: 'atomic.color.blue.700' },
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

      // Custom Components
      badge: {
        default: {
          background: 'semantic.background.muted',
          foreground: 'semantic.foreground.secondary',
          border: 'semantic.border.default',
        },
        success: {
          background: 'atomic.color.green.50',
          foreground: 'atomic.color.green.700',
        },
        warning: {
          background: 'atomic.color.yellow.50',
          foreground: 'atomic.color.yellow.700',
        },
        error: {
          background: 'atomic.color.red.50',
          foreground: 'atomic.color.red.700',
        },
      },
      tooltip: {
        background: 'atomic.color.neutral.900',
        foreground: '#ffffff',
        shadow: 'atomic.shadow.lg',
      },
      alert: {
        info: {
          background: 'atomic.color.blue.50',
          foreground: 'atomic.color.blue.700',
          border: 'atomic.color.blue.500',
          icon: 'atomic.color.blue.500',
        },
        success: {
          background: 'atomic.color.green.50',
          foreground: 'atomic.color.green.700',
          border: 'atomic.color.green.500',
          icon: 'atomic.color.green.500',
        },
        warning: {
          background: 'atomic.color.yellow.50',
          foreground: 'atomic.color.yellow.700',
          border: 'atomic.color.yellow.500',
          icon: 'atomic.color.yellow.500',
        },
        error: {
          background: 'atomic.color.red.50',
          foreground: 'atomic.color.red.700',
          border: 'atomic.color.red.500',
          icon: 'atomic.color.red.500',
        },
      },
    } as CustomComponentTokens,
  },
};

export default customTheme;
```

---

## Token Resolution Patterns

### Multi-Level Resolution

```typescript
import { resolveToken } from '@tekton/core';

// Example theme
const tokens = {
  atomic: {
    color: {
      blue: { '500': '#3b82f6', '600': '#2563eb' },
    },
  },
  semantic: {
    foreground: {
      accent: 'atomic.color.blue.500', // References atomic
    },
  },
  component: {
    button: {
      primary: {
        background: 'semantic.foreground.accent', // References semantic
      },
    },
  },
};

// Single-level resolution
const blue500 = resolveToken('atomic.color.blue.500', tokens);
console.log(blue500); // → '#3b82f6'

// Two-level resolution
const accent = resolveToken('semantic.foreground.accent', tokens);
console.log(accent); // → '#3b82f6' (via atomic.color.blue.500)

// Three-level resolution
const buttonBg = resolveToken('component.button.primary.background', tokens);
console.log(buttonBg);
// → '#3b82f6' (semantic.foreground.accent → atomic.color.blue.500)
```

### Fallback Chain Pattern

```typescript
import { resolveWithFallback } from '@tekton/core';

// Use fallback for custom variants
function getButtonColor(variant: string, tokens: any): string {
  return resolveWithFallback(
    `component.button.${variant}.background`, // Try custom variant
    'semantic.foreground.accent', // Fallback to accent
    'atomic.color.blue.500', // Final fallback
    tokens
  );
}

// Usage
const primaryColor = getButtonColor('primary', tokens); // → component token
const customColor = getButtonColor('custom', tokens); // → semantic fallback
const unknownColor = getButtonColor('unknown', tokens); // → atomic fallback
```

---

## Integration with React

### Theme Provider

```tsx
import { createContext, useContext, useEffect } from 'react';
import type { ThemeWithTokens } from '@tekton/core';
import { generateThemeCSS } from '@tekton/core';

const ThemeContext = createContext<ThemeWithTokens | null>(null);

export function ThemeProvider({
  theme,
  children,
}: {
  theme: ThemeWithTokens;
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Generate and inject CSS
    const css = generateThemeCSS(theme);
    const styleId = `theme-${theme.id}`;

    // Remove existing theme
    document.getElementById(styleId)?.remove();

    // Inject new theme
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = css;
    document.head.appendChild(style);

    return () => {
      document.getElementById(styleId)?.remove();
    };
  }, [theme]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return theme;
}
```

### Using Components with Theme

```tsx
import { useTheme } from './ThemeProvider';

function Button({ variant = 'primary', children }: any) {
  return <button className={`button-${variant}`}>{children}</button>;
}

function App() {
  return (
    <div>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
    </div>
  );
}
```

```css
/* CSS automatically uses theme tokens */
.button-primary {
  background: var(--button-primary-background);
  color: var(--button-primary-foreground);
  border: 1px solid var(--button-primary-border);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  transition: var(--transition-base);
}

.button-primary:hover {
  background: var(--button-primary-hover-background);
}

.button-primary:disabled {
  background: var(--button-primary-disabled-background);
  color: var(--button-primary-disabled-foreground);
}
```

---

## Migration from Old System

### Before (v0.1.0)

```typescript
import { loadTheme, generateCSSVariables } from '@tekton/core';

const theme = loadTheme('calm-wellness');
const cssVars = generateCSSVariables(theme);
```

### After (v0.2.0 with Tokens)

```typescript
import { generateThemeCSS } from '@tekton/core';
import type { ThemeWithTokens } from '@tekton/core';

// Option 1: Keep using old themes (backward compatible)
const theme = loadTheme('calm-wellness');
const cssVars = generateCSSVariables(theme); // Still works

// Option 2: Extend with token system
const themeWithTokens: ThemeWithTokens = {
  id: 'calm-wellness',
  name: 'Calm Wellness',
  tokens: {
    atomic: {
      /* ... */
    },
    semantic: {
      /* ... */
    },
    component: {
      /* ... */
    },
  },
};

const css = generateThemeCSS(themeWithTokens);
```

### Gradual Migration Strategy

1. **Phase 1**: Keep existing themes, add token system alongside
2. **Phase 2**: Migrate components one-by-one to use CSS Variables
3. **Phase 3**: Replace old theme system completely

```typescript
// Phase 1: Both systems coexist
const oldTheme = loadTheme('calm-wellness');
const newTheme = createTokenTheme('calm-wellness');

// Phase 2: Migrate components gradually
function Button({ variant }: any) {
  // Old: inline styles
  // const bg = theme.colors.primary;

  // New: CSS Variables
  return <button className={`button-${variant}`}>Click</button>;
}

// Phase 3: Remove old theme system
```

---

## Performance Optimization

### Build-Time CSS Generation

```typescript
// build.ts
import { generateThemeCSS, validateTheme } from '@tekton/core';
import { writeFileSync } from 'fs';
import theme from './theme';

// Validate at build time
const validation = validateTheme(theme);
if (!validation.valid) {
  throw new Error(`Theme validation failed: ${validation.errors?.join(', ')}`);
}

// Generate CSS at build time
const css = generateThemeCSS(theme);
writeFileSync('dist/theme.css', css);

console.log('✅ Theme CSS generated successfully');
```

### Runtime Optimization

```typescript
// Cache resolved tokens
const tokenCache = new Map<string, string>();

function getCachedToken(ref: string, tokens: any): string {
  if (!tokenCache.has(ref)) {
    tokenCache.set(ref, resolveToken(ref, tokens));
  }
  return tokenCache.get(ref)!;
}

// Use CSS Variables instead of resolving in components
// ✅ Good
function Button() {
  return <button className="button-primary">Click</button>;
}

// ❌ Avoid
function Button() {
  const bg = resolveToken('component.button.primary.background', tokens);
  return <button style={{ background: bg }}>Click</button>;
}
```

---

## Next Steps

- [Token System Guide](./token-system.md) - Complete architecture overview
- [API Reference](./api-reference.md) - Detailed API documentation
- [README](../README.md) - Getting started guide
