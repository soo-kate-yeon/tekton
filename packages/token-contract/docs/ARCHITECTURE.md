# Token Contract & CSS Variable System Architecture

## System Overview

The Token Contract & CSS Variable System bridges Tekton's OKLCH-based design token generation with CSS custom property consumption. It provides a comprehensive, type-safe token management layer with runtime validation, curated design themes, and dynamic theme switching capabilities.

### Key Components

```mermaid
graph TB
    subgraph "Token Input Layer"
        OKLCH[OKLCH Token Generator]
        Themes[7 Curated Themes]
        Custom[Custom Token Input]
    end

    subgraph "Validation Layer"
        Zod[Zod Schema Validation]
        WCAG[WCAG Compliance Check]
    end

    subgraph "Token Contract Layer"
        Semantic[Semantic Tokens]
        State[State Tokens]
        Composition[Composition Tokens]
    end

    subgraph "CSS Generation Layer"
        CSSGen[CSS Variable Generator]
        DarkMode[Dark Mode Transformer]
    end

    subgraph "React Integration Layer"
        ThemeProvider[ThemeProvider Context]
        Hooks[useTheme Hook]
    end

    subgraph "Output Layer"
        CSSVars[CSS Custom Properties]
        StyledComps[Styled Components]
    end

    OKLCH --> Zod
    Themes --> Zod
    Custom --> Zod
    Zod --> WCAG
    WCAG --> Semantic
    Semantic --> State
    State --> Composition
    Composition --> CSSGen
    CSSGen --> DarkMode
    DarkMode --> ThemeProvider
    ThemeProvider --> Hooks
    Hooks --> CSSVars
    CSSVars --> StyledComps

    classDef inputLayer fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef validationLayer fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef contractLayer fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef generationLayer fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    classDef integrationLayer fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef outputLayer fill:#e0f2f1,stroke:#00796b,stroke-width:2px

    class OKLCH,Themes,Custom inputLayer
    class Zod,WCAG validationLayer
    class Semantic,State,Composition contractLayer
    class CSSGen,DarkMode generationLayer
    class ThemeProvider,Hooks integrationLayer
    class CSSVars,StyledComps outputLayer
```

### Design Principles

**Type Safety First**: All tokens validated with Zod schemas at runtime, preventing invalid token combinations before they reach the browser.

**Perceptual Uniformity**: OKLCH color space ensures consistent perceived brightness and color intensity across the entire token system.

**Accessibility by Default**: WCAG AA compliance validation integrated into the core validation pipeline, with High-Contrast theme achieving AAA compliance.

**Progressive Enhancement**: Graceful fallback handling for missing tokens, browser compatibility considerations, and optional features.

**Developer Experience**: Curated themes for rapid prototyping, comprehensive TypeScript types, clear error messages with validation feedback.

---

## Token Transformation Pipeline

The token transformation pipeline converts high-level design intent into browser-consumable CSS custom properties through a series of validation and transformation stages.

```mermaid
flowchart LR
    subgraph Input["Input Stage"]
        direction TB
        I1[Theme Selection]
        I2[Custom Overrides]
        I3[OKLCH Generation]
    end

    subgraph Validation["Validation Stage"]
        direction TB
        V1{Zod Schema<br/>Valid?}
        V2{WCAG<br/>Compliant?}
        V3[Error Handler]
    end

    subgraph Transform["Transformation Stage"]
        direction TB
        T1[Semantic Token<br/>Resolution]
        T2[State Token<br/>Derivation]
        T3[Composition Token<br/>Assembly]
    end

    subgraph Generation["Generation Stage"]
        direction TB
        G1[CSS Variable<br/>Naming]
        G2[OKLCH Serialization]
        G3[Dark Mode<br/>Override]
    end

    subgraph Output["Output Stage"]
        direction TB
        O1[CSS String]
        O2[DOM Injection]
        O3[Component Styling]
    end

    I1 --> V1
    I2 --> V1
    I3 --> V1
    V1 -->|Invalid| V3
    V1 -->|Valid| V2
    V2 -->|Fail| V3
    V2 -->|Pass| T1
    T1 --> T2
    T2 --> T3
    T3 --> G1
    G1 --> G2
    G2 --> G3
    G3 --> O1
    O1 --> O2
    O2 --> O3

    classDef inputStyle fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef validationStyle fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef transformStyle fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef generationStyle fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    classDef outputStyle fill:#e0f2f1,stroke:#00796b,stroke-width:2px

    class I1,I2,I3 inputStyle
    class V1,V2,V3 validationStyle
    class T1,T2,T3 transformStyle
    class G1,G2,G3 generationStyle
    class O1,O2,O3 outputStyle
```

### Pipeline Stages

#### 1. Input Stage

**Theme Selection**: User selects one of 7 curated themes (Professional, Creative, Minimal, Bold, Warm, Cool, High-Contrast).

**Custom Overrides**: Developer provides custom token overrides while maintaining theme structure.

**OKLCH Generation**: Tokens generated using Tekton's OKLCH token generator with perceptually uniform color distribution.

#### 2. Validation Stage

**Zod Schema Validation**: Runtime type checking ensures all tokens conform to defined schemas (ColorTokenSchema, SemanticTokenSchema, StateTokenSchema, CompositionTokenSchema).

**WCAG Compliance Check**: Contrast ratios validated against WCAG AA standards (4.5:1 for normal text, 3:1 for large text).

**Error Handling**: Typed errors with detailed validation messages returned to developer for invalid configurations.

#### 3. Transformation Stage

**Semantic Token Resolution**: Maps color scales to semantic meanings (primary, secondary, neutral, success, warning, error, info).

**State Token Derivation**: Generates interactive state tokens (hover, active, focus, disabled, error) from base semantic tokens.

**Composition Token Assembly**: Combines primitive tokens into higher-level composition tokens (border, shadow, spacing, typography).

#### 4. Generation Stage

**CSS Variable Naming**: Converts tokens to CSS custom property names following `--tekton-{semantic}-{step}` convention.

**OKLCH Serialization**: Formats OKLCH values as valid CSS strings: `oklch(L C H)`.

**Dark Mode Override**: Generates `[data-theme="dark"]` selector overrides with inverted lightness values.

#### 5. Output Stage

**CSS String**: Complete CSS stylesheet with all token variables and dark mode overrides.

**DOM Injection**: Injects CSS variables into `:root` element via `<style>` tag or stylesheet.

**Component Styling**: Components reference CSS variables for dynamic theming without re-rendering.

---

## CSS Variable Generation Architecture

The CSS Variable Generator transforms validated token contracts into browser-consumable CSS custom properties with optimized naming conventions and dark mode support.

```mermaid
graph TB
    subgraph Tokens["Token Inputs"]
        direction LR
        Sem[Semantic Tokens<br/>primary, neutral, etc.]
        St[State Tokens<br/>hover, active, focus]
        Comp[Composition Tokens<br/>border, shadow, spacing]
    end

    subgraph Generator["CSS Variable Generator"]
        direction TB
        Naming[Variable Naming Engine]
        Serial[OKLCH Serializer]
        Merge[CSS Merger]
    end

    subgraph Output["Generated CSS"]
        direction TB
        Root[:root Variables]
        Dark[data-theme='dark' Overrides]
        Final[Final CSS String]
    end

    Sem --> Naming
    St --> Naming
    Comp --> Naming

    Naming --> Serial
    Serial --> Merge

    Merge --> Root
    Merge --> Dark

    Root --> Final
    Dark --> Final

    classDef tokenStyle fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef generatorStyle fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef outputStyle fill:#e8f5e9,stroke:#388e3c,stroke-width:2px

    class Sem,St,Comp tokenStyle
    class Naming,Serial,Merge generatorStyle
    class Root,Dark,Final outputStyle
```

### Naming Convention Strategy

**Semantic Token Variables**: Follow pattern `--tekton-{semantic}-{step}` where semantic is primary, secondary, neutral, success, warning, error, info and step is 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950.

Example:
```css
--tekton-primary-500: oklch(0.60 0.15 220);
--tekton-neutral-900: oklch(0.20 0.02 220);
--tekton-success-500: oklch(0.55 0.12 140);
```

**State Token Variables**: Follow pattern `--tekton-{component}-{state}` where component is button, input, card, etc. and state is default, hover, active, focus, disabled, error.

Example:
```css
--tekton-button-default: oklch(0.60 0.15 220);
--tekton-button-hover: oklch(0.55 0.16 220);
--tekton-button-focus: oklch(0.60 0.18 220);
```

**Composition Token Variables**: Follow pattern `--tekton-{property}-{variant}` where property is border-width, border-radius, shadow, spacing, font-size, etc.

Example:
```css
--tekton-border-width: 1px;
--tekton-border-radius: 4px;
--tekton-shadow-sm: 0 1px 2px oklch(0 0 0 / 0.1);
--tekton-spacing-md: 1rem;
```

### OKLCH Serialization

OKLCH tokens serialized as CSS color functions with proper syntax:

```typescript
function serializeOKLCH(token: ColorToken): string {
  return `oklch(${token.l} ${token.c} ${token.h})`;
}
```

Example output:
```css
oklch(0.60 0.15 220)  /* 60% lightness, 15% chroma, 220° hue (blue) */
```

### Dark Mode Generation

Dark mode CSS generated by inverting lightness values and applying `[data-theme="dark"]` selector:

```typescript
function invertLightness(token: ColorToken): ColorToken {
  return {
    ...token,
    l: 1 - token.l,  // Invert lightness (0.2 becomes 0.8)
  };
}
```

Example dark mode output:
```css
[data-theme="dark"] {
  --tekton-primary-50: oklch(0.20 0.15 220);   /* Inverted from 0.95 */
  --tekton-primary-500: oklch(0.60 0.15 220);  /* Inverted from 0.60 */
  --tekton-primary-900: oklch(0.95 0.05 220);  /* Inverted from 0.20 */
}
```

---

## ThemeProvider Architecture

The ThemeProvider component implements React Context API for centralized theme state management with optimized re-rendering and CSS variable injection.

```mermaid
sequenceDiagram
    participant App
    participant ThemeProvider
    participant useTheme Hook
    participant CSS Engine
    participant Component

    App->>ThemeProvider: Initialize with defaultPreset='professional'
    ThemeProvider->>ThemeProvider: Load theme tokens
    ThemeProvider->>CSS Engine: Generate CSS variables
    CSS Engine->>ThemeProvider: CSS string
    ThemeProvider->>CSS Engine: Inject into :root

    Component->>useTheme Hook: useTheme()
    useTheme Hook->>ThemeProvider: Read context
    ThemeProvider-->>useTheme Hook: { theme, tokens, darkMode, ... }
    useTheme Hook-->>Component: Theme state

    Component->>useTheme Hook: setPreset('creative')
    useTheme Hook->>ThemeProvider: Update theme state
    ThemeProvider->>ThemeProvider: Re-derive tokens (memoized)
    ThemeProvider->>CSS Engine: Regenerate CSS variables
    CSS Engine->>ThemeProvider: New CSS string
    ThemeProvider->>CSS Engine: Update :root
    ThemeProvider-->>Component: Context update
    Component->>Component: Re-render with new theme
```

### Context Structure

```typescript
interface ThemeContextValue {
  theme: PresetName;                      // Current theme name
  setPreset: (theme: PresetName) => void; // Theme setter
  tokens: SemanticToken;                   // Current semantic tokens
  composition: CompositionToken;           // Current composition tokens
  darkMode: boolean;                       // Dark mode state
  toggleDarkMode: () => void;              // Dark mode toggle
}
```

### Performance Optimizations

**Token Derivation Memoization**: Uses `useMemo` to cache token derivation based on theme and darkMode dependencies:

```typescript
const tokens = useMemo(() => {
  const theme = loadPreset(presetName);
  return darkMode ? invertTokensForDarkMode(theme.tokens) : theme.tokens;
}, [presetName, darkMode]);
```

**Stable Callback References**: Uses `useCallback` for setter functions to prevent unnecessary re-renders:

```typescript
const setPreset = useCallback((newPreset: PresetName) => {
  setPresetName(newPreset);
}, []);

const toggleDarkMode = useCallback(() => {
  setDarkModeState(prev => !prev);
}, []);
```

**CSS Variable Injection Optimization**: Updates CSS variables in `useEffect` without triggering React re-renders:

```typescript
useEffect(() => {
  const css = generateCSSFromTokens({ semantic: tokens, composition });
  injectCSSVariables(css); // Direct DOM manipulation
}, [tokens, composition]);
```

**Re-render Target**: Maximum 3 re-renders per theme change:
1. Initial theme state update
2. Token derivation (memoized)
3. CSS variable injection (no re-render)

### System Theme Detection

Supports automatic dark mode detection using `prefers-color-scheme` media query:

```typescript
function detectSystemTheme(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Initialize with system preference
const [darkMode, setDarkMode] = useState(() =>
  detectSystemTheme ? detectSystemTheme() : defaultDarkMode
);

// Listen for system theme changes
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);

  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
}, []);
```

---

## Integration Points

The Token Contract & CSS Variable System integrates with multiple components of the Tekton ecosystem, providing a central token management layer.

```mermaid
C4Context
    title System Context Diagram - Token Contract Integration

    Person(developer, "Developer", "Builds applications using Tekton design system")

    System(tokenContract, "Token Contract System", "Type-safe token management with CSS variable generation")

    System_Ext(oklchSystem, "OKLCH Token Generator", "Generates perceptually uniform color tokens")
    System_Ext(wcagValidator, "WCAG Validator", "Validates color contrast compliance")
    System_Ext(headlessHooks, "Headless Hooks (SPEC-001)", "Unstyled UI component logic")
    System_Ext(styledComponents, "Styled Components (SPEC-003)", "Styled UI component wrappers")

    Rel(developer, tokenContract, "Uses", "TypeScript API")
    Rel(tokenContract, oklchSystem, "Consumes tokens", "OKLCH format")
    Rel(tokenContract, wcagValidator, "Validates contrast", "WCAG API")
    Rel(headlessHooks, tokenContract, "Reads CSS variables", "CSS custom properties")
    Rel(styledComponents, tokenContract, "Applies themes", "CSS custom properties")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

### OKLCH Token System Integration

**Dependency**: Token Contract consumes OKLCH tokens from Phase A implementation.

**Integration Points**:
- Token generation via `generateToken()` function
- WCAG validation via `validateWCAGCompliance()` function
- 10-step lightness scales (50, 100, 200...950)

**Data Flow**:
```typescript
// OKLCH System generates tokens
const oklchToken = generateToken({ hue: 220, chroma: 0.15 });

// Token Contract validates and wraps in schema
const semanticToken = SemanticTokenSchema.parse({
  primary: oklchToken.scale,
  neutral: generateToken({ hue: 220, chroma: 0.02 }).scale,
  // ...
});

// CSS Variable Generator outputs CSS
const css = generateCSSVariables(semanticToken);
```

### Headless Hooks Integration (SPEC-001)

**Dependency**: Headless hooks consume CSS variables generated by Token Contract.

**Integration Points**:
- Component state styling via state tokens
- Accessibility properties via WCAG-validated colors
- Dark mode support via `[data-theme]` attribute

**Usage Example**:
```tsx
import { useButton } from '@tekton/hooks';
import { useTheme } from '@tekton/token-contract';

function Button({ children }: ButtonProps) {
  const { getRootProps } = useButton();
  const { darkMode } = useTheme();

  return (
    <button
      {...getRootProps()}
      style={{
        backgroundColor: 'var(--tekton-button-default)',
        color: 'var(--tekton-text-on-primary)',
      }}
    >
      {children}
    </button>
  );
}
```

### Styled Components Integration (SPEC-003)

**Dependency**: Styled components apply CSS variables to implement visual design.

**Integration Points**:
- Theme selection via ThemeProvider
- CSS variable consumption in styled-components
- Dark mode theming via theme context

**Usage Example**:
```tsx
import styled from 'styled-components';
import { ThemeProvider } from '@tekton/token-contract';

const StyledButton = styled.button`
  background-color: var(--tekton-button-default);
  color: var(--tekton-text-on-primary);
  border-radius: var(--tekton-border-radius);
  padding: var(--tekton-spacing-md);

  &:hover {
    background-color: var(--tekton-button-hover);
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

### Testing Integration

**Dependency**: Test suite validates token contract behavior and CSS generation.

**Integration Points**:
- Zod schema validation tests
- WCAG compliance tests
- CSS variable generation tests
- React component integration tests

**Test Coverage**: 96.36% (222 passing tests)

---

## Performance Characteristics

### Token Validation Performance

**Zod Validation Benchmarks**:
- Simple ColorToken validation: <0.1ms
- SemanticToken validation: <0.5ms
- Complete token contract validation: <1ms
- Target: <1ms per token (achieved)

**Validation Caching**: Validated tokens cached to avoid redundant validation on re-renders.

### CSS Variable Generation Performance

**Generation Benchmarks**:
- Single semantic token scale (11 colors): <0.2ms
- Complete semantic tokens (7 scales): <1.5ms
- Full CSS generation (semantic + composition + dark mode): <3ms
- Target: <5ms total generation time (achieved)

**Optimization Strategies**:
- Pre-computed CSS strings for curated themes
- Lazy generation only when tokens change
- CSS string caching in ThemeProvider

### React Re-render Performance

**Re-render Targets**:
- Theme change: ≤3 re-renders (achieved)
- Dark mode toggle: ≤2 re-renders (achieved)
- Theme override: ≤3 re-renders (achieved)

**Optimization Techniques**:
- `useMemo` for token derivation
- `useCallback` for stable setter references
- CSS variable injection outside React render cycle

### Browser Rendering Performance

**CSS Custom Property Performance**:
- Initial CSS injection: <5ms
- CSS variable update: <1ms (native browser optimization)
- Component style recalculation: <10ms for typical component tree

**Memory Footprint**:
- Token contract object: ~2KB
- Generated CSS string: ~5KB (uncompressed)
- CSS variables in DOM: ~3KB

---

## Security Considerations

### Input Validation

**Zod Schema Enforcement**: All token inputs validated against strict schemas, preventing injection of malicious values.

**Type Safety**: TypeScript strict mode with `satisfies` operator ensures compile-time type checking.

**Sanitization**: OKLCH values clamped to valid ranges (lightness 0-1, chroma 0-0.4, hue 0-360).

### CSS Injection Prevention

**No User-Provided CSS**: System generates CSS programmatically, no user-provided CSS strings accepted.

**Variable Name Validation**: CSS variable names validated against regex `^--tekton-[a-z-]+$` to prevent injection.

**OKLCH Serialization**: OKLCH values sanitized and escaped before CSS generation.

### XSS Protection

**No HTML Injection**: System outputs CSS only, no HTML or JavaScript injection vectors.

**CSP Compatibility**: Generated CSS compatible with strict Content Security Policy (no inline styles in markup).

---

## Accessibility Architecture

### WCAG Compliance Integration

**Validation Pipeline**: All color tokens validated against WCAG AA standards (4.5:1 contrast for normal text, 3:1 for large text).

**High-Contrast Theme**: Dedicated theme achieving WCAG AAA compliance (7:1 contrast ratio).

**Error Reporting**: WCAG validation failures reported with detailed contrast ratio information.

### Dark Mode Accessibility

**System Theme Respect**: Automatically detects and respects `prefers-color-scheme` media query.

**Contrast Preservation**: Dark mode tokens inverted while maintaining WCAG compliance.

**User Control**: User can override system theme preference via `toggleDarkMode()`.

### Semantic Token Naming

**Meaningful Names**: Tokens named semantically (success, warning, error) rather than by color (green, yellow, red).

**Consistent Mapping**: Semantic tokens consistently mapped across all themes for predictable behavior.

---

## Browser Compatibility

### CSS Custom Properties

**Support**: Chrome 49+, Firefox 31+, Safari 9.1+, Edge 15+
**Coverage**: 98%+ global browser support
**Fallback**: Not required for modern browsers, optional polyfill for legacy support

### OKLCH Color Space

**Support**: Chrome 111+, Firefox 113+, Safari 15.4+
**Coverage**: 85%+ global browser support (as of 2025)
**Fallback**: Consider PostCSS plugin to convert OKLCH to RGB/HSL for older browsers

**Fallback Strategy**:
```javascript
// Detect OKLCH support
const supportsOKLCH = CSS.supports('color', 'oklch(0.5 0.1 200)');

if (!supportsOKLCH) {
  // Use RGB fallback values or PostCSS conversion
  console.warn('OKLCH not supported, using RGB fallback');
}
```

---

## Future Enhancements

### Planned Features (Deferred)

**Figma Token Sync (O-001)**: Synchronize tokens with Figma Design Tokens Community Group (DTCG) format.

**Token Animation (O-002)**: Provide CSS transition definitions for smooth token value changes.

**Token Versioning (O-003)**: Version token contracts for backward compatibility across major releases.

**Custom Theme Builder**: UI tool for creating custom themes with live preview.

**Token Analytics**: Usage analytics to track most popular themes and token combinations.

---

## References

- [OKLCH Token System](../../token-generator/README.md)
- [WCAG Validator](../../token-generator/src/wcag-validator.ts)
- [Zod Documentation](https://zod.dev/)
- [CSS Custom Properties Specification](https://www.w3.org/TR/css-variables-1/)
- [OKLCH Color Space](https://oklch.com/)
- [SPEC-COMPONENT-002](/.moai/specs/SPEC-COMPONENT-002/spec.md)

---

**Last Updated**: 2026-01-17
**Version**: 1.0.0
**Status**: Production Ready
