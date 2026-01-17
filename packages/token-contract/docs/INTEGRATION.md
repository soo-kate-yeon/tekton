# Integration Guide

## Overview

This guide covers integration patterns for the Token Contract & CSS Variable System with other Tekton components, third-party libraries, and custom implementations.

---

## Integration with Tekton Components

### SPEC-COMPONENT-001: Headless Hooks

The Token Contract system provides CSS variables that Headless Hooks consume for component styling.

#### Basic Integration

```tsx
import { useButton } from '@tekton/hooks';
import { useTheme } from '@tekton/token-contract';

function CustomButton({ children, ...props }) {
  const { getRootProps } = useButton(props);
  const { tokens, darkMode } = useTheme();

  return (
    <button
      {...getRootProps()}
      style={{
        backgroundColor: 'var(--tekton-button-default)',
        color: 'var(--tekton-text-on-primary)',
        borderRadius: 'var(--tekton-border-radius)',
        padding: 'var(--tekton-spacing-md)',
      }}
    >
      {children}
    </button>
  );
}
```

#### State Token Integration

Headless hooks manage component state (hover, active, focus, disabled), which maps directly to state tokens:

```tsx
import { useButton } from '@tekton/hooks';

function StateAwareButton({ children, disabled, ...props }) {
  const { getRootProps, isHovered, isPressed, isFocused } = useButton({ disabled, ...props });

  const getBackgroundColor = () => {
    if (disabled) return 'var(--tekton-button-disabled)';
    if (isPressed) return 'var(--tekton-button-active)';
    if (isHovered) return 'var(--tekton-button-hover)';
    if (isFocused) return 'var(--tekton-button-focus)';
    return 'var(--tekton-button-default)';
  };

  return (
    <button
      {...getRootProps()}
      style={{
        backgroundColor: getBackgroundColor(),
        color: 'var(--tekton-text-on-primary)',
      }}
    >
      {children}
    </button>
  );
}
```

#### Accessibility Integration

WCAG-validated tokens ensure accessible contrast ratios:

```tsx
import { useButton } from '@tekton/hooks';
import { useTheme } from '@tekton/token-contract';

function AccessibleButton({ children, ...props }) {
  const { getRootProps } = useButton(props);
  const { tokens } = useTheme();

  // CSS variables automatically provide WCAG AA compliant contrast
  return (
    <button
      {...getRootProps()}
      style={{
        backgroundColor: 'var(--tekton-primary-500)',
        color: 'var(--tekton-text-on-primary)', // Guaranteed ≥4.5:1 contrast
        border: `var(--tekton-border-width) solid var(--tekton-border-default)`,
      }}
    >
      {children}
    </button>
  );
}
```

---

### SPEC-COMPONENT-003: Styled Component Wrappers

Styled components apply Token Contract CSS variables to create pre-styled UI components.

#### Basic Integration

```tsx
import styled from 'styled-components';
import { ThemeProvider } from '@tekton/token-contract';

const StyledButton = styled.button`
  background-color: var(--tekton-button-default);
  color: var(--tekton-text-on-primary);
  border: var(--tekton-border-width) solid var(--tekton-border-default);
  border-radius: var(--tekton-border-radius);
  padding: var(--tekton-spacing-md);
  font-size: var(--tekton-font-size-base);
  font-weight: var(--tekton-font-weight-medium);
  cursor: pointer;

  &:hover {
    background-color: var(--tekton-button-hover);
  }

  &:active {
    background-color: var(--tekton-button-active);
  }

  &:focus-visible {
    outline: 2px solid var(--tekton-button-focus);
    outline-offset: 2px;
  }

  &:disabled {
    background-color: var(--tekton-button-disabled);
    cursor: not-allowed;
  }
`;

function App() {
  return (
    <ThemeProvider defaultPreset="professional">
      <StyledButton>Click me</StyledButton>
    </ThemeProvider>
  );
}
```

#### Dynamic Theming

Styled components automatically update when theme changes:

```tsx
import styled from 'styled-components';
import { ThemeProvider, useTheme } from '@tekton/token-contract';

const ThemedCard = styled.div`
  background-color: var(--tekton-neutral-50);
  border: var(--tekton-border-width) solid var(--tekton-border-default);
  border-radius: var(--tekton-border-radius);
  padding: var(--tekton-spacing-lg);
  box-shadow: var(--tekton-shadow-sm);
  transition: background-color 200ms ease;
`;

function ThemeSwitcher() {
  const { preset, setPreset, darkMode, toggleDarkMode } = useTheme();

  return (
    <div>
      <ThemedCard>
        <h3>Theme Controls</h3>
        <p>Current preset: {preset}</p>
        <button onClick={() => setPreset('creative')}>Creative</button>
        <button onClick={() => setPreset('minimal')}>Minimal</button>
        <button onClick={toggleDarkMode}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </ThemedCard>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultPreset="professional">
      <ThemeSwitcher />
    </ThemeProvider>
  );
}
```

---

## Integration with CSS-in-JS Libraries

### Styled-Components

Direct CSS variable usage in styled-components templates:

```tsx
import styled from 'styled-components';

const Button = styled.button`
  /* Semantic tokens */
  background-color: var(--tekton-primary-500);
  color: var(--tekton-text-on-primary);

  /* Composition tokens */
  border-radius: var(--tekton-border-radius);
  padding: var(--tekton-spacing-md);

  /* State tokens */
  &:hover {
    background-color: var(--tekton-primary-600);
  }
`;
```

### Emotion

Use Emotion's `css` prop with CSS variables:

```tsx
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const buttonStyles = css`
  background-color: var(--tekton-button-default);
  color: var(--tekton-text-on-primary);
  border-radius: var(--tekton-border-radius);
  padding: var(--tekton-spacing-md);

  &:hover {
    background-color: var(--tekton-button-hover);
  }
`;

function Button({ children }) {
  return <button css={buttonStyles}>{children}</button>;
}
```

### CSS Modules

Reference CSS variables in CSS Modules:

```css
/* Button.module.css */
.button {
  background-color: var(--tekton-button-default);
  color: var(--tekton-text-on-primary);
  border-radius: var(--tekton-border-radius);
  padding: var(--tekton-spacing-md);
}

.button:hover {
  background-color: var(--tekton-button-hover);
}
```

```tsx
import styles from './Button.module.css';

function Button({ children }) {
  return <button className={styles.button}>{children}</button>;
}
```

### Tailwind CSS

Integrate Token Contract with Tailwind using CSS variables:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--tekton-primary-50)',
          100: 'var(--tekton-primary-100)',
          500: 'var(--tekton-primary-500)',
          900: 'var(--tekton-primary-900)',
        },
      },
      borderRadius: {
        DEFAULT: 'var(--tekton-border-radius)',
      },
      spacing: {
        md: 'var(--tekton-spacing-md)',
      },
    },
  },
};
```

Usage:
```tsx
<button className="bg-primary-500 text-white rounded px-md py-md hover:bg-primary-600">
  Click me
</button>
```

---

## Integration with Build Tools

### Vite

No special configuration required. CSS variables work out of the box:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Token Contract CSS variables automatically supported
});
```

### Next.js

Wrap your App component with ThemeProvider:

```tsx
// pages/_app.tsx
import { ThemeProvider } from '@tekton/token-contract';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultPreset="professional" detectSystemTheme>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
```

### Create React App

Import and use ThemeProvider in index.tsx:

```tsx
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@tekton/token-contract';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ThemeProvider defaultPreset="professional">
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

---

## Integration with Testing Libraries

### Vitest

Mock ThemeProvider for component tests:

```typescript
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@tekton/token-contract';
import { Button } from './Button';

describe('Button', () => {
  it('renders with theme context', () => {
    render(
      <ThemeProvider defaultPreset="professional">
        <Button>Click me</Button>
      </ThemeProvider>
    );

    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();

    // Verify CSS variables are applied
    const computedStyle = window.getComputedStyle(button);
    expect(computedStyle.backgroundColor).toContain('oklch');
  });
});
```

### Testing Library

Test theme switching behavior:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@tekton/token-contract';

function ThemeSwitcher() {
  const { preset, setPreset } = useTheme();
  return (
    <div>
      <p data-testid="current-preset">{preset}</p>
      <button onClick={() => setPreset('creative')}>Switch to Creative</button>
    </div>
  );
}

describe('Theme Switching', () => {
  it('switches preset when button clicked', () => {
    render(
      <ThemeProvider defaultPreset="professional">
        <ThemeSwitcher />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-preset')).toHaveTextContent('professional');

    fireEvent.click(screen.getByText('Switch to Creative'));

    expect(screen.getByTestId('current-preset')).toHaveTextContent('creative');
  });
});
```

---

## Server-Side Rendering (SSR)

### Next.js SSR

ThemeProvider supports SSR with initial CSS injection:

```tsx
// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { loadPreset, generateCSSFromTokens } from '@tekton/token-contract';

export default class MyDocument extends Document {
  render() {
    const preset = loadPreset('professional');
    const css = generateCSSFromTokens({
      semantic: preset.tokens,
      composition: preset.composition,
    });

    return (
      <Html>
        <Head>
          <style
            dangerouslySetInnerHTML={{
              __html: css,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

### Gatsby SSR

Use Gatsby's SSR API to inject initial CSS:

```javascript
// gatsby-ssr.js
import { loadPreset, generateCSSFromTokens } from '@tekton/token-contract';

export const onRenderBody = ({ setHeadComponents }) => {
  const preset = loadPreset('professional');
  const css = generateCSSFromTokens({
    semantic: preset.tokens,
    composition: preset.composition,
  });

  setHeadComponents([
    <style
      key="tekton-tokens"
      dangerouslySetInnerHTML={{
        __html: css,
      }}
    />,
  ]);
};
```

---

## Static Site Generation

### Exporting CSS for Static Sites

Generate CSS files at build time:

```typescript
// scripts/generate-css.ts
import { writeFileSync } from 'fs';
import { loadPreset, generateCSSFromTokens } from '@tekton/token-contract';

const presets = ['professional', 'creative', 'minimal', 'bold', 'warm', 'cool', 'high-contrast'];

presets.forEach((presetName) => {
  const preset = loadPreset(presetName);
  const css = generateCSSFromTokens({
    semantic: preset.tokens,
    composition: preset.composition,
  });

  writeFileSync(`public/themes/${presetName}.css`, css);
});

console.log('CSS files generated successfully!');
```

Usage in HTML:
```html
<link rel="stylesheet" href="/themes/professional.css" id="theme-stylesheet">

<script>
  function switchTheme(theme) {
    document.getElementById('theme-stylesheet').href = `/themes/${theme}.css`;
  }
</script>
```

---

## Custom Preset Creation

### Defining Custom Presets

Create custom presets by extending base preset structure:

```typescript
import { loadPreset, overridePresetTokens } from '@tekton/token-contract';

const basePreset = loadPreset('professional');

const customPreset = overridePresetTokens(basePreset.tokens, {
  primary: {
    '500': 'oklch(0.65 0.15 200)', // Custom primary color
  },
  accent: {
    '500': 'oklch(0.60 0.12 30)', // Custom accent color
  },
});
```

### Validating Custom Presets

Ensure custom presets pass validation:

```typescript
import { validateOverride, validateWCAGCompliance } from '@tekton/token-contract';

const overrideTokens = {
  primary: {
    '500': 'oklch(0.65 0.15 200)',
  },
};

// Validate schema
const schemaValidation = validateOverride(overrideTokens);
if (!schemaValidation.valid) {
  console.error('Schema validation failed:', schemaValidation.errors);
}

// Validate WCAG compliance
const customTokens = overridePresetTokens(basePreset.tokens, overrideTokens);
const wcagValidation = validateWCAGCompliance(customTokens);
if (!wcagValidation.passed) {
  console.warn('WCAG violations:', wcagValidation.violations);
}
```

---

## Performance Optimization

### CSS Variable Caching

Cache generated CSS to avoid redundant generation:

```typescript
import { loadPreset, generateCSSFromTokens } from '@tekton/token-contract';

const cssCache = new Map<string, string>();

function getCachedCSS(presetName: string): string {
  if (cssCache.has(presetName)) {
    return cssCache.get(presetName)!;
  }

  const preset = loadPreset(presetName);
  const css = generateCSSFromTokens({
    semantic: preset.tokens,
    composition: preset.composition,
  });

  cssCache.set(presetName, css);
  return css;
}
```

### Lazy Preset Loading

Load presets on-demand to reduce initial bundle size:

```typescript
import { lazy, Suspense } from 'react';

const presetLoaders = {
  professional: () => import('./presets/professional'),
  creative: () => import('./presets/creative'),
  minimal: () => import('./presets/minimal'),
};

function LazyThemeProvider({ preset, children }) {
  const PresetProvider = lazy(presetLoaders[preset]);

  return (
    <Suspense fallback={<div>Loading theme...</div>}>
      <PresetProvider>{children}</PresetProvider>
    </Suspense>
  );
}
```

---

## Migration Strategies

### From Tailwind CSS

Map Tailwind color scales to Token Contract presets:

```typescript
// tailwind.config.js
const { loadPreset, generateCSSFromTokens } = require('@tekton/token-contract');

const preset = loadPreset('professional');

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--tekton-primary-50)',
          100: 'var(--tekton-primary-100)',
          200: 'var(--tekton-primary-200)',
          300: 'var(--tekton-primary-300)',
          400: 'var(--tekton-primary-400)',
          500: 'var(--tekton-primary-500)',
          600: 'var(--tekton-primary-600)',
          700: 'var(--tekton-primary-700)',
          800: 'var(--tekton-primary-800)',
          900: 'var(--tekton-primary-900)',
        },
      },
    },
  },
};
```

### From Chakra UI

Replace Chakra's theme with Token Contract:

```tsx
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { ThemeProvider, loadPreset } from '@tekton/token-contract';

const preset = loadPreset('professional');

const chakraTheme = extendTheme({
  colors: {
    primary: {
      50: 'var(--tekton-primary-50)',
      500: 'var(--tekton-primary-500)',
      900: 'var(--tekton-primary-900)',
    },
  },
});

function App() {
  return (
    <ThemeProvider defaultPreset="professional">
      <ChakraProvider theme={chakraTheme}>
        <YourApp />
      </ChakraProvider>
    </ThemeProvider>
  );
}
```

### From Material-UI

Map Material-UI theme to Token Contract:

```tsx
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ThemeProvider, loadPreset } from '@tekton/token-contract';

const preset = loadPreset('professional');

const muiTheme = createTheme({
  palette: {
    primary: {
      main: 'var(--tekton-primary-500)',
      light: 'var(--tekton-primary-300)',
      dark: 'var(--tekton-primary-700)',
    },
  },
});

function App() {
  return (
    <ThemeProvider defaultPreset="professional">
      <MuiThemeProvider theme={muiTheme}>
        <YourApp />
      </MuiThemeProvider>
    </ThemeProvider>
  );
}
```

---

## Troubleshooting

### CSS Variables Not Updating

**Issue**: CSS variables not updating when theme changes.

**Solution**: Ensure ThemeProvider is at the root of your component tree:

```tsx
// ❌ Wrong
function App() {
  return (
    <div>
      <ThemeProvider>
        <Component />
      </ThemeProvider>
    </div>
  );
}

// ✅ Correct
function App() {
  return (
    <ThemeProvider>
      <div>
        <Component />
      </div>
    </ThemeProvider>
  );
}
```

### OKLCH Colors Not Rendering

**Issue**: OKLCH colors displaying as black or not rendering.

**Solution**: Check browser compatibility and add fallback:

```css
/* Add fallback for older browsers */
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

---

## Best Practices

### Use Semantic Tokens Over Color Scales

**Prefer**:
```css
background-color: var(--tekton-button-default);
```

**Avoid**:
```css
background-color: var(--tekton-primary-500);
```

**Reason**: Semantic tokens adapt to context and theme changes.

### Leverage State Tokens for Interactivity

**Prefer**:
```css
button:hover {
  background-color: var(--tekton-button-hover);
}
```

**Avoid**:
```css
button:hover {
  background-color: var(--tekton-primary-600);
}
```

**Reason**: State tokens designed specifically for interaction feedback.

### Use Composition Tokens for Consistency

**Prefer**:
```css
border-radius: var(--tekton-border-radius);
padding: var(--tekton-spacing-md);
```

**Avoid**:
```css
border-radius: 4px;
padding: 1rem;
```

**Reason**: Composition tokens ensure design system consistency.

---

## References

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture details
- [API.md](./API.md) - Complete API reference
- [MIGRATION.md](./MIGRATION.md) - Detailed migration guides
- [BEST-PRACTICES.md](./BEST-PRACTICES.md) - Recommended patterns

---

**Last Updated**: 2026-01-17
**Version**: 1.0.0
**Status**: Production Ready
