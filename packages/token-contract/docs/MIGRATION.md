# Migration Guide

## Overview

This guide provides step-by-step instructions for migrating from existing design token systems and CSS frameworks to Tekton's Token Contract & CSS Variable System.

---

## Migration from Tailwind CSS

### Phase 1: Assessment

**Identify Tailwind Usage Patterns**:
- Color utility classes (`bg-blue-500`, `text-gray-900`)
- Spacing utilities (`p-4`, `m-2`, `gap-6`)
- Border utilities (`rounded-lg`, `border-2`)
- Typography utilities (`text-base`, `font-medium`)

**Audit Current Color Palette**:
```bash
# Search for Tailwind color classes in codebase
grep -r "bg-\|text-\|border-" src/ --include="*.tsx" --include="*.jsx"
```

### Phase 2: Setup

**Install Token Contract**:
```bash
npm install @tekton/token-contract
# or
pnpm add @tekton/token-contract
```

**Update Tailwind Config**:
```javascript
// tailwind.config.js
const { loadPreset } = require('@tekton/token-contract');

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
          950: 'var(--tekton-primary-950)',
        },
        neutral: {
          50: 'var(--tekton-neutral-50)',
          100: 'var(--tekton-neutral-100)',
          200: 'var(--tekton-neutral-200)',
          300: 'var(--tekton-neutral-300)',
          400: 'var(--tekton-neutral-400)',
          500: 'var(--tekton-neutral-500)',
          600: 'var(--tekton-neutral-600)',
          700: 'var(--tekton-neutral-700)',
          800: 'var(--tekton-neutral-800)',
          900: 'var(--tekton-neutral-900)',
          950: 'var(--tekton-neutral-950)',
        },
        success: {
          500: 'var(--tekton-success-500)',
        },
        warning: {
          500: 'var(--tekton-warning-500)',
        },
        error: {
          500: 'var(--tekton-error-500)',
        },
      },
      borderRadius: {
        DEFAULT: 'var(--tekton-border-radius)',
      },
      spacing: {
        sm: 'var(--tekton-spacing-sm)',
        md: 'var(--tekton-spacing-md)',
        lg: 'var(--tekton-spacing-lg)',
      },
    },
  },
};
```

### Phase 3: Add ThemeProvider

**Wrap App with ThemeProvider**:
```tsx
// src/App.tsx
import { ThemeProvider } from '@tekton/token-contract';

export default function App() {
  return (
    <ThemeProvider defaultPreset="professional" detectSystemTheme>
      <YourApp />
    </ThemeProvider>
  );
}
```

### Phase 4: Incremental Migration

**Before (Tailwind)**:
```tsx
<button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded">
  Click me
</button>
```

**After (Token Contract + Tailwind)**:
```tsx
<button className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-md px-md rounded">
  Click me
</button>
```

**Alternative (Pure CSS Variables)**:
```tsx
<button
  style={{
    backgroundColor: 'var(--tekton-primary-500)',
    color: 'var(--tekton-text-on-primary)',
    padding: 'var(--tekton-spacing-md)',
    borderRadius: 'var(--tekton-border-radius)',
  }}
>
  Click me
</button>
```

### Phase 5: Remove Tailwind Dependency (Optional)

Once fully migrated to CSS variables:
```bash
npm uninstall tailwindcss postcss autoprefixer
```

Replace Tailwind classes with custom CSS using Token Contract variables:
```css
.button {
  background-color: var(--tekton-primary-500);
  color: var(--tekton-text-on-primary);
  padding: var(--tekton-spacing-md);
  border-radius: var(--tekton-border-radius);
}

.button:hover {
  background-color: var(--tekton-primary-600);
}
```

### Tailwind to Token Contract Mapping

| Tailwind Class | Token Contract Variable |
|----------------|------------------------|
| `bg-blue-500` | `var(--tekton-primary-500)` |
| `text-gray-900` | `var(--tekton-neutral-900)` |
| `border-gray-300` | `var(--tekton-border-default)` |
| `rounded-lg` | `var(--tekton-border-radius)` |
| `p-4` | `padding: var(--tekton-spacing-md)` |
| `shadow-md` | `box-shadow: var(--tekton-shadow-md)` |
| `text-base` | `font-size: var(--tekton-font-size-base)` |

---

## Migration from Chakra UI

### Phase 1: Assessment

**Identify Chakra Components**:
- Theme tokens (`useTheme()`, `colorMode`)
- Color mode (`useColorMode()`, `ColorModeScript`)
- Component styles (`variant`, `colorScheme`)

**Audit Theme Customization**:
```tsx
// Current Chakra theme
const theme = extendTheme({
  colors: {
    brand: {
      500: '#3182ce',
      600: '#2c5282',
    },
  },
});
```

### Phase 2: Setup

**Install Token Contract**:
```bash
npm install @tekton/token-contract
```

**Create Hybrid Theme**:
```tsx
import { extendTheme } from '@chakra-ui/react';
import { ThemeProvider as TektonThemeProvider, loadPreset } from '@tekton/token-contract';

const preset = loadPreset('professional');

const chakraTheme = extendTheme({
  colors: {
    primary: {
      50: 'var(--tekton-primary-50)',
      500: 'var(--tekton-primary-500)',
      600: 'var(--tekton-primary-600)',
      900: 'var(--tekton-primary-900)',
    },
  },
  components: {
    Button: {
      baseStyle: {
        bg: 'var(--tekton-button-default)',
        color: 'var(--tekton-text-on-primary)',
        _hover: {
          bg: 'var(--tekton-button-hover)',
        },
      },
    },
  },
});

function App() {
  return (
    <TektonThemeProvider defaultPreset="professional">
      <ChakraProvider theme={chakraTheme}>
        <YourApp />
      </ChakraProvider>
    </TektonThemeProvider>
  );
}
```

### Phase 3: Migrate Color Mode

**Before (Chakra)**:
```tsx
import { useColorMode } from '@chakra-ui/react';

function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();
  return <Button onClick={toggleColorMode}>Toggle {colorMode}</Button>;
}
```

**After (Token Contract)**:
```tsx
import { useTheme } from '@tekton/token-contract';

function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();
  return <Button onClick={toggleDarkMode}>Toggle {darkMode ? 'Dark' : 'Light'}</Button>;
}
```

### Phase 4: Replace Chakra Components

**Before (Chakra Button)**:
```tsx
<Button colorScheme="blue" variant="solid" size="md">
  Click me
</Button>
```

**After (Custom Button with Token Contract)**:
```tsx
import styled from 'styled-components';

const Button = styled.button`
  background-color: var(--tekton-button-default);
  color: var(--tekton-text-on-primary);
  padding: var(--tekton-spacing-md);
  border-radius: var(--tekton-border-radius);
  font-size: var(--tekton-font-size-base);

  &:hover {
    background-color: var(--tekton-button-hover);
  }
`;

<Button>Click me</Button>
```

### Chakra to Token Contract Mapping

| Chakra Concept | Token Contract Equivalent |
|----------------|--------------------------|
| `useColorMode()` | `useTheme()` with `darkMode` |
| `colorMode === 'dark'` | `darkMode === true` |
| `ColorModeScript` | ThemeProvider `detectSystemTheme` |
| `bg="blue.500"` | `backgroundColor: 'var(--tekton-primary-500)'` |
| `color="gray.700"` | `color: 'var(--tekton-neutral-700)'` |

---

## Migration from Material-UI (MUI)

### Phase 1: Assessment

**Identify MUI Theme Usage**:
- Theme tokens (`theme.palette.primary.main`)
- Color modes (`theme.palette.mode`)
- Component styling (`sx` prop, `styled` API)

**Audit Current Theme**:
```tsx
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#115293',
    },
  },
});
```

### Phase 2: Setup

**Install Token Contract**:
```bash
npm install @tekton/token-contract
```

**Create Hybrid Theme**:
```tsx
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ThemeProvider as TektonThemeProvider, loadPreset } from '@tekton/token-contract';

const preset = loadPreset('professional');

const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: 'var(--tekton-primary-500)',
      light: 'var(--tekton-primary-300)',
      dark: 'var(--tekton-primary-700)',
    },
    text: {
      primary: 'var(--tekton-neutral-900)',
      secondary: 'var(--tekton-neutral-600)',
    },
  },
});

function App() {
  return (
    <TektonThemeProvider defaultPreset="professional">
      <MuiThemeProvider theme={muiTheme}>
        <YourApp />
      </MuiThemeProvider>
    </TektonThemeProvider>
  );
}
```

### Phase 3: Migrate Theme Mode

**Before (MUI)**:
```tsx
import { useTheme } from '@mui/material/styles';

function ThemeToggle() {
  const theme = useTheme();
  const mode = theme.palette.mode;
  // Toggle logic
}
```

**After (Token Contract)**:
```tsx
import { useTheme } from '@tekton/token-contract';

function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();
  return <Button onClick={toggleDarkMode}>Toggle {darkMode ? 'Dark' : 'Light'}</Button>;
}
```

### Phase 4: Replace MUI Components

**Before (MUI Button)**:
```tsx
<Button variant="contained" color="primary">
  Click me
</Button>
```

**After (Custom Button with Token Contract)**:
```tsx
const CustomButton = styled.button`
  background-color: var(--tekton-button-default);
  color: var(--tekton-text-on-primary);
  padding: var(--tekton-spacing-md);
  border-radius: var(--tekton-border-radius);

  &:hover {
    background-color: var(--tekton-button-hover);
  }
`;

<CustomButton>Click me</CustomButton>
```

### MUI to Token Contract Mapping

| MUI Concept | Token Contract Equivalent |
|-------------|--------------------------|
| `theme.palette.primary.main` | `var(--tekton-primary-500)` |
| `theme.palette.mode` | `darkMode` from `useTheme()` |
| `sx={{ color: 'primary.main' }}` | `style={{ color: 'var(--tekton-primary-500)' }}` |
| `theme.spacing(2)` | `var(--tekton-spacing-md)` |

---

## Migration from Styled-Components Theme

### Phase 1: Assessment

**Identify Current Theme**:
```tsx
const theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
  },
};
```

### Phase 2: Replace Theme with Token Contract

**Before (Styled-Components Theme)**:
```tsx
import { ThemeProvider } from 'styled-components';

const theme = {
  colors: { primary: '#3b82f6' },
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

**After (Token Contract)**:
```tsx
import { ThemeProvider } from '@tekton/token-contract';

function App() {
  return (
    <ThemeProvider defaultPreset="professional">
      <YourApp />
    </ThemeProvider>
  );
}
```

### Phase 3: Update Styled Components

**Before**:
```tsx
const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.medium};
`;
```

**After**:
```tsx
const Button = styled.button`
  background-color: var(--tekton-primary-500);
  padding: var(--tekton-spacing-md);
`;
```

---

## Migration Checklist

### Pre-Migration
- [ ] Audit current design token usage
- [ ] Identify all color values, spacing, and typography
- [ ] Document custom theme overrides
- [ ] Choose appropriate Token Contract preset

### During Migration
- [ ] Install @tekton/token-contract
- [ ] Add ThemeProvider to app root
- [ ] Update build configuration (if needed)
- [ ] Map existing tokens to Token Contract variables
- [ ] Test component rendering
- [ ] Verify WCAG compliance

### Post-Migration
- [ ] Remove old theme dependencies (if applicable)
- [ ] Update documentation
- [ ] Test dark mode functionality
- [ ] Measure performance improvements
- [ ] Train team on new token system

---

## Common Migration Challenges

### Challenge 1: Hardcoded Color Values

**Problem**: Components using hardcoded hex/rgb colors.

**Before**:
```tsx
<div style={{ backgroundColor: '#3b82f6' }}>Content</div>
```

**Solution**: Replace with Token Contract variables.

**After**:
```tsx
<div style={{ backgroundColor: 'var(--tekton-primary-500)' }}>Content</div>
```

### Challenge 2: Nested Theme Objects

**Problem**: Deeply nested theme objects.

**Before**:
```tsx
const theme = {
  components: {
    button: {
      primary: {
        background: '#3b82f6',
        hover: '#2563eb',
      },
    },
  },
};
```

**Solution**: Flatten to CSS variables.

**After**:
```css
.button-primary {
  background-color: var(--tekton-button-default);
}
.button-primary:hover {
  background-color: var(--tekton-button-hover);
}
```

### Challenge 3: Runtime Theme Calculation

**Problem**: Dynamic theme values calculated at runtime.

**Before**:
```tsx
const theme = {
  primary: calculateColor(baseHue),
};
```

**Solution**: Use Token Contract preset overrides.

**After**:
```tsx
import { loadPreset, overridePresetTokens } from '@tekton/token-contract';

const basePreset = loadPreset('professional');
const customTokens = overridePresetTokens(basePreset.tokens, {
  primary: {
    '500': `oklch(0.60 0.15 ${baseHue})`,
  },
});
```

---

## Performance Considerations

### Before Migration Benchmarks

Measure baseline performance:
- Theme switch time
- Initial render time
- Component re-render count
- CSS bundle size

### After Migration Improvements

Expected improvements:
- **Theme Switch**: 50-70% faster (CSS variable updates vs. full re-render)
- **Initial Render**: 20-30% faster (smaller CSS bundle)
- **Re-renders**: 60-80% reduction (CSS variables don't trigger React re-renders)
- **Bundle Size**: 30-50% smaller (no theme object overhead)

---

## Rollback Strategy

### Incremental Rollback

If issues arise, rollback incrementally:

**Step 1**: Keep both systems running in parallel
```tsx
<ThemeProvider defaultPreset="professional">
  <ChakraProvider theme={chakraTheme}>
    <YourApp />
  </ChakraProvider>
</ThemeProvider>
```

**Step 2**: Gradually remove old theme usage
```tsx
// Remove old theme components one by one
// Keep Token Contract as fallback
```

**Step 3**: Remove Token Contract only if necessary
```bash
npm uninstall @tekton/token-contract
# Restore previous theme configuration
```

---

## Support and Resources

### Documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [API.md](./API.md) - Complete API reference
- [INTEGRATION.md](./INTEGRATION.md) - Integration patterns
- [BEST-PRACTICES.md](./BEST-PRACTICES.md) - Recommended patterns

### Community
- GitHub Issues: Report migration issues
- Discussions: Ask questions and share experiences
- Examples: Browse migration examples in `/examples` directory

---

**Last Updated**: 2026-01-17
**Version**: 1.0.0
**Status**: Production Ready
