---
id: SPEC-COMPONENT-001-E
parent: SPEC-COMPONENT-001
version: "1.0.0"
status: "planned"
created: "2026-01-25"
updated: "2026-01-25"
author: "MoAI-ADK"
priority: "HIGH"
lifecycle: "spec-anchored"
tags: ["SPEC-COMPONENT-001-E", "Token-System", "Theme-Enhancement", "State-Layer", "Composable-Tokens"]
references:
  - "design_token_research.pdf"
  - "Material Design 3 State Layers"
  - "Uber Base Design System"
  - "Salesforce Lightning Design Tokens"
---

## HISTORY
- 2026-01-25 v1.0.0: Initial sub-SPEC creation - Theme-Aware Token Schema Enhancement

---

# SPEC-COMPONENT-001-E: Theme-Aware Token Schema Enhancement

## Executive Summary

**Purpose**: Enhance the existing 3-Layer Token System to better express theme concepts through Composable State Layer tokens, semantic color expansion, motion token separation, and density control - inspired by mature design systems (Material Design 3, Uber Base, Salesforce Lightning).

**Scope**: Design and implement:
1. Composable State Layer tokens (Material Design 3 approach)
2. Enhanced semantic color structure with subtle/emphasis/inverse variants
3. Separated motion tokens (duration + easing)
4. Extended border tokens (width + style + color)
5. Elevation-based shadow system
6. Density/Scale tokens for theme customization
7. Enhanced Typography with letter-spacing and text-transform

**Priority**: HIGH - Critical for advanced theming capabilities.

**Impact**: Provides a more expressive token architecture that:
- Reduces token explosion through composable state layers
- Enables richer theme customization without code changes
- Supports density variations (compact/comfortable/spacious)
- Aligns with industry-standard design token practices

**Key Design Decisions**:
- **Composable State Layer**: State effects via opacity overlay instead of per-state tokens
- **Semantic Color Expansion**: subtle/default/emphasis tiers for each semantic role
- **Motion Separation**: duration tokens + easing tokens for flexible animation control
- **Density Scale**: Multiplier-based system for spacing/sizing adjustments

---

## ENVIRONMENT

### Current System Context

**Existing Token Structure (SPEC-COMPONENT-001-A):**
```typescript
// Current: 3-Layer with hardcoded state tokens
interface ComponentTokens {
  button: {
    [variant: string]: {
      background: string;
      hover: { background: string; foreground: string; };  // ❌ Hardcoded state
      active: { background: string; };                      // ❌ Hardcoded state
      disabled: { background: string; foreground: string; }; // ❌ Hardcoded state
    };
  };
}
```

**Gap Analysis (Based on design_token_research.pdf):**

| Category | Current Gap | Research Recommendation |
|----------|-------------|------------------------|
| State Tokens | Hardcoded per-component states | Composable State Layer (8%/12%/38% opacity) |
| Color Structure | Basic background/foreground | subtle/default/emphasis tiers |
| Motion | Single `transition` property | Separated duration + easing |
| Border | Color only | width + style + color |
| Shadow | Name-based (sm/md/lg) | Elevation levels + contextual |
| Density | Not supported | Scale multiplier tokens |

**Target Architecture:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Layer 4: State Layer Tokens (NEW)                              │
│  → state.hover.opacity, state.pressed.opacity, etc.             │
├─────────────────────────────────────────────────────────────────┤
│  Layer 3: Component Tokens (SIMPLIFIED)                          │
│  → button.primary.background (state-agnostic base)              │
│     ↓ (references)                                               │
├─────────────────────────────────────────────────────────────────┤
│  Layer 2: Semantic Tokens (EXPANDED)                             │
│  → background.subtle, foreground.emphasis, border.muted          │
│     ↓ (references)                                               │
├─────────────────────────────────────────────────────────────────┤
│  Layer 1: Atomic Tokens (ENHANCED)                               │
│  → color.brand.*, motion.duration.*, motion.easing.*             │
│     ↓ (compiles to)                                              │
├─────────────────────────────────────────────────────────────────┤
│  CSS Variables with State Composition                            │
│  → --button-bg + calc(--state-hover-opacity) overlay             │
└─────────────────────────────────────────────────────────────────┘
```

---

## ASSUMPTIONS

### Technical Assumptions

**A-001: State Layer Composition Performance**
- **Assumption**: CSS opacity overlay composition has negligible performance impact
- **Confidence**: HIGH
- **Evidence**: Material Design 3 uses this approach in production at scale
- **Risk if Wrong**: Consider pre-computed state colors as fallback
- **Validation**: Performance benchmarks with complex UI scenarios

**A-002: Density Scaling Consistency**
- **Assumption**: Percentage-based density scaling maintains visual harmony
- **Confidence**: MEDIUM
- **Evidence**: Google Material uses density scale (-3 to +3 system)
- **Risk if Wrong**: May need component-specific density overrides
- **Validation**: Visual regression testing across density levels

**A-003: Color Tier Sufficiency**
- **Assumption**: Three tiers (subtle/default/emphasis) cover most use cases
- **Confidence**: HIGH
- **Evidence**: Uber Base and Atlassian use similar tiered approaches
- **Risk if Wrong**: Add fourth tier or component-specific variants
- **Validation**: Audit existing component color usage patterns

---

## REQUIREMENTS

### Ubiquitous Requirements (Always Active)

**U-001: Composable State Layer System**
- The system **shall** implement state effects (hover, pressed, focused, disabled) as composable opacity layers.
- **Rationale**: Reduces token count exponentially; one state token applies to all colors.
- **Test Strategy**: Verify state composition produces correct visual output across all semantic colors.

**U-002: Semantic Color Tiers**
- The system **shall** provide three tiers for each semantic color role: subtle, default, and emphasis.
- **Rationale**: Enables nuanced visual hierarchy without custom color definitions.
- **Test Strategy**: Validate tier contrast ratios meet WCAG 2.1 AA standards.

**U-003: Separated Motion Tokens**
- The system **shall** separate animation timing into duration tokens and easing tokens.
- **Rationale**: Allows independent control of speed and acceleration curve per interaction type.
- **Test Strategy**: Animation timing tests, cross-platform motion parity checks.

**U-004: Density Scale System**
- The system **shall** support density variations through scale multiplier tokens.
- **Rationale**: Enables compact/comfortable/spacious modes without component rewrites.
- **Test Strategy**: Layout tests at each density level, touch target validation for compact mode.

### State-Driven Requirements (Conditional Behavior)

**S-001: State Layer Application**
- **IF** component is in hover state **THEN** apply state.hover.opacity overlay to base color.
- **IF** component is in pressed state **THEN** apply state.pressed.opacity overlay.
- **IF** component is disabled **THEN** reduce opacity by state.disabled.opacity.
- **Rationale**: Consistent state feedback across all components via single mechanism.
- **Test Strategy**: Interactive state tests, accessibility contrast verification.

**S-002: Density Mode Switching**
- **IF** theme density is "compact" **THEN** apply density.compact scale to spacing/sizing tokens.
- **IF** theme density is "comfortable" **THEN** use default (1.0x) scale.
- **IF** theme density is "spacious" **THEN** apply density.spacious scale.
- **Rationale**: Adapts UI density without component-level changes.
- **Test Strategy**: Responsive layout tests, density switch performance tests.

**S-003: Dark Mode State Adjustment**
- **IF** theme is dark mode **THEN** invert state overlay color (white instead of black).
- **Rationale**: Maintains visual consistency of state feedback in dark themes.
- **Test Strategy**: Dark mode state visibility tests, contrast verification.

---

## SPECIFICATIONS

### 1. State Layer Token Definitions

```typescript
// packages/core/src/tokens-v2.ts

/**
 * State Layer Tokens - Composable state effects
 * Based on Material Design 3 state layer system
 *
 * Usage: Base color + state layer overlay = Final state color
 * Example: button.background + state.hover.opacity overlay = hover color
 */
export interface StateLayerTokens {
  /** Hover state - subtle highlight on pointer hover */
  hover: {
    opacity: number;           // 0.08 (8%) - Light touch
    overlayColor: {
      onLight: string;         // "black" - For light backgrounds
      onDark: string;          // "white" - For dark backgrounds
    };
  };

  /** Pressed/Active state - stronger feedback on click/tap */
  pressed: {
    opacity: number;           // 0.12 (12%) - More pronounced
    overlayColor: {
      onLight: string;
      onDark: string;
    };
  };

  /** Focus state - keyboard/accessibility focus indication */
  focus: {
    opacity: number;           // 0.12 (12%) - Clear visibility
    overlayColor: {
      onLight: string;
      onDark: string;
    };
    /** Additional focus ring properties */
    ring: {
      width: string;           // "2px"
      offset: string;          // "2px"
      color: string;           // → semantic.border.focus
    };
  };

  /** Dragged state - element being dragged */
  dragged: {
    opacity: number;           // 0.16 (16%) - High visibility
    overlayColor: {
      onLight: string;
      onDark: string;
    };
    elevation: string;         // → atomic.shadow.lg (lifted appearance)
  };

  /** Disabled state - non-interactive element */
  disabled: {
    opacity: number;           // 0.38 (38%) - Clearly diminished
    /** Content opacity reduction */
    contentOpacity: number;    // 0.38 - Text/icon dimming
  };

  /** Selected state - chosen item in a list/group */
  selected: {
    opacity: number;           // 0.08 (8%)
    overlayColor: {
      onLight: string;         // → semantic color (e.g., primary)
      onDark: string;
    };
  };
}

/**
 * Default state layer values (Material Design 3 aligned)
 */
export const defaultStateLayerTokens: StateLayerTokens = {
  hover: {
    opacity: 0.08,
    overlayColor: { onLight: '#000000', onDark: '#FFFFFF' }
  },
  pressed: {
    opacity: 0.12,
    overlayColor: { onLight: '#000000', onDark: '#FFFFFF' }
  },
  focus: {
    opacity: 0.12,
    overlayColor: { onLight: '#000000', onDark: '#FFFFFF' },
    ring: { width: '2px', offset: '2px', color: 'semantic.border.focus' }
  },
  dragged: {
    opacity: 0.16,
    overlayColor: { onLight: '#000000', onDark: '#FFFFFF' },
    elevation: 'atomic.shadow.lg'
  },
  disabled: {
    opacity: 0.38,
    contentOpacity: 0.38
  },
  selected: {
    opacity: 0.08,
    overlayColor: { onLight: 'semantic.color.primary', onDark: 'semantic.color.primary' }
  }
};
```

### 2. Enhanced Semantic Color Structure

```typescript
/**
 * Enhanced Semantic Tokens with Tiers
 * Three tiers per role: subtle (muted) → default → emphasis (strong)
 */
export interface EnhancedSemanticTokens {
  /** Background colors with tiers */
  background: {
    // Canvas/Page level
    canvas: string;              // → atomic.color.neutral.50

    // Surface tiers
    surface: {
      subtle: string;            // → atomic.color.neutral.50
      default: string;           // → atomic.color.white
      emphasis: string;          // → atomic.color.neutral.100
    };

    // Elevated surfaces (cards, modals)
    elevated: {
      subtle: string;            // → atomic.color.white
      default: string;           // → atomic.color.white
      emphasis: string;          // → atomic.color.neutral.50
    };

    // Inverse (dark on light, light on dark)
    inverse: {
      subtle: string;            // → atomic.color.neutral.700
      default: string;           // → atomic.color.neutral.800
      emphasis: string;          // → atomic.color.neutral.900
    };

    // Brand-colored backgrounds
    brand: {
      subtle: string;            // → atomic.color.primary.50
      default: string;           // → atomic.color.primary.500
      emphasis: string;          // → atomic.color.primary.600
    };

    // Feedback backgrounds
    success: {
      subtle: string;            // → atomic.color.green.50
      default: string;           // → atomic.color.green.500
      emphasis: string;          // → atomic.color.green.600
    };
    warning: {
      subtle: string;
      default: string;
      emphasis: string;
    };
    error: {
      subtle: string;
      default: string;
      emphasis: string;
    };
    info: {
      subtle: string;
      default: string;
      emphasis: string;
    };
  };

  /** Foreground (content) colors with tiers */
  foreground: {
    // Text tiers
    primary: {
      subtle: string;            // → atomic.color.neutral.600
      default: string;           // → atomic.color.neutral.900
      emphasis: string;          // → atomic.color.neutral.950
    };
    secondary: {
      subtle: string;            // → atomic.color.neutral.400
      default: string;           // → atomic.color.neutral.600
      emphasis: string;          // → atomic.color.neutral.700
    };

    // Inverse text
    inverse: {
      subtle: string;            // → atomic.color.neutral.300
      default: string;           // → atomic.color.white
      emphasis: string;          // → atomic.color.white
    };

    // Brand text
    brand: {
      subtle: string;            // → atomic.color.primary.400
      default: string;           // → atomic.color.primary.500
      emphasis: string;          // → atomic.color.primary.600
    };

    // Feedback text
    success: { subtle: string; default: string; emphasis: string; };
    warning: { subtle: string; default: string; emphasis: string; };
    error: { subtle: string; default: string; emphasis: string; };
    info: { subtle: string; default: string; emphasis: string; };

    // Disabled/muted
    disabled: string;            // → with state.disabled.contentOpacity
    placeholder: string;         // → atomic.color.neutral.400
  };

  /** Border colors with tiers (Uber Base pattern) */
  border: {
    // Structural borders
    default: {
      subtle: string;            // → atomic.color.neutral.100
      default: string;           // → atomic.color.neutral.200
      emphasis: string;          // → atomic.color.neutral.300
    };

    // Interactive borders
    focus: string;               // → atomic.color.primary.500
    error: string;               // → atomic.color.red.500
    success: string;             // → atomic.color.green.500

    // Brand borders
    brand: {
      subtle: string;
      default: string;
      emphasis: string;
    };

    // Inverse borders
    inverse: {
      subtle: string;
      default: string;
      emphasis: string;
    };
  };
}
```

### 3. Separated Motion Tokens

```typescript
/**
 * Motion Tokens - Separated Duration and Easing
 * Inspired by Salesforce Lightning timing tokens
 */
export interface MotionTokens {
  /** Duration tokens - how long animations last */
  duration: {
    /** Instant feedback - 0ms (no animation) */
    instant: string;             // "0ms"

    /** Micro-interactions - 50ms (3 frames @60fps) */
    micro: string;               // "50ms"

    /** Quick feedback - 100ms (6 frames) */
    quick: string;               // "100ms"

    /** Standard interactions - 150ms (9 frames) */
    standard: string;            // "150ms"

    /** Moderate transitions - 200ms (12 frames) */
    moderate: string;            // "200ms"

    /** Deliberate animations - 300ms (18 frames) */
    deliberate: string;          // "300ms"

    /** Slow, emphatic animations - 400ms (24 frames) */
    slow: string;                // "400ms"

    /** Complex animations - 500ms (30 frames) */
    complex: string;             // "500ms"
  };

  /** Easing tokens - acceleration curves */
  easing: {
    /** Linear - constant speed */
    linear: string;              // "linear"

    /** Standard - natural feel for most transitions */
    standard: string;            // "cubic-bezier(0.4, 0, 0.2, 1)"

    /** Decelerate - entering elements (fast start, slow end) */
    decelerate: string;          // "cubic-bezier(0, 0, 0.2, 1)"

    /** Accelerate - exiting elements (slow start, fast end) */
    accelerate: string;          // "cubic-bezier(0.4, 0, 1, 1)"

    /** Emphasized - dramatic, attention-grabbing */
    emphasized: string;          // "cubic-bezier(0.2, 0, 0, 1)"

    /** Spring - bouncy, playful feel */
    spring: string;              // "cubic-bezier(0.34, 1.56, 0.64, 1)"
  };

  /** Semantic motion presets - combining duration + easing */
  preset: {
    /** Fade in/out */
    fade: {
      duration: string;          // → duration.standard
      easing: string;            // → easing.standard
    };

    /** Slide transitions */
    slide: {
      duration: string;          // → duration.moderate
      easing: string;            // → easing.decelerate
    };

    /** Scale/zoom effects */
    scale: {
      duration: string;          // → duration.standard
      easing: string;            // → easing.emphasized
    };

    /** Expand/collapse */
    expand: {
      duration: string;          // → duration.moderate
      easing: string;            // → easing.decelerate
    };

    /** Tooltip/popover appearance */
    tooltip: {
      duration: string;          // → duration.quick
      easing: string;            // → easing.decelerate
    };

    /** Modal/dialog entrance */
    modal: {
      duration: string;          // → duration.deliberate
      easing: string;            // → easing.decelerate
    };
  };
}
```

### 4. Extended Border Tokens

```typescript
/**
 * Extended Border Tokens
 * Separated width, style, and color for maximum flexibility
 */
export interface ExtendedBorderTokens {
  /** Border width scale */
  width: {
    none: string;                // "0"
    thin: string;                // "1px"
    medium: string;              // "2px"
    thick: string;               // "3px"
    heavy: string;               // "4px"
  };

  /** Border styles */
  style: {
    solid: string;               // "solid"
    dashed: string;              // "dashed"
    dotted: string;              // "dotted"
    none: string;                // "none"
  };

  /** Border radius - enhanced scale */
  radius: {
    none: string;                // "0"
    xs: string;                  // "2px"
    sm: string;                  // "4px"
    md: string;                  // "6px"
    lg: string;                  // "8px"
    xl: string;                  // "12px"
    '2xl': string;               // "16px"
    '3xl': string;               // "24px"
    full: string;                // "9999px" (pill shape)
    circle: string;              // "50%" (perfect circle)
  };

  /** Shorthand compositions */
  preset: {
    /** Default border */
    default: string;             // "1px solid var(--border-default)"

    /** Focus ring */
    focus: string;               // "2px solid var(--border-focus)"

    /** Error state */
    error: string;               // "1px solid var(--border-error)"

    /** Divider line */
    divider: string;             // "1px solid var(--border-subtle)"
  };
}
```

### 5. Elevation-Based Shadow System

```typescript
/**
 * Elevation-Based Shadow System
 * Combines Material Design elevation with contextual naming
 */
export interface ElevationTokens {
  /** Numeric elevation levels (Material Design style) */
  level: {
    0: string;                   // "none" (flat)
    1: string;                   // Subtle lift (cards at rest)
    2: string;                   // Moderate lift (raised buttons)
    3: string;                   // Elevated (floating elements)
    4: string;                   // High elevation (dropdowns)
    5: string;                   // Maximum elevation (modals)
  };

  /** Contextual shadow presets */
  context: {
    /** Card resting state */
    card: {
      default: string;           // → level.1
      hover: string;             // → level.2
      raised: string;            // → level.3
    };

    /** Dropdown/popover */
    dropdown: string;            // → level.4

    /** Modal/dialog */
    modal: string;               // → level.5

    /** Toast/snackbar */
    toast: string;               // → level.4

    /** Floating action button */
    fab: {
      default: string;           // → level.3
      hover: string;             // → level.4
    };

    /** Navigation rail/drawer */
    navigation: string;          // → level.2

    /** Active/pressed inset shadow */
    inset: string;               // "inset 0 2px 4px rgba(0,0,0,0.1)"

    /** Focus glow (non-standard) */
    focusGlow: string;           // "0 0 0 3px rgba(primary, 0.25)"
  };

  /** Shadow color tokens for dark mode adjustment */
  color: {
    light: string;               // "rgba(0, 0, 0, 0.1)"
    medium: string;              // "rgba(0, 0, 0, 0.15)"
    dark: string;                // "rgba(0, 0, 0, 0.25)"
  };
}
```

### 6. Density Scale System

```typescript
/**
 * Density Scale System
 * Enables compact/comfortable/spacious UI modes
 */
export interface DensityTokens {
  /** Current density mode */
  mode: 'compact' | 'comfortable' | 'spacious';

  /** Scale multipliers for each mode */
  scale: {
    compact: number;             // 0.875 (87.5% of default)
    comfortable: number;         // 1.0 (100% - default)
    spacious: number;            // 1.25 (125% of default)
  };

  /** Computed spacing based on density */
  spacing: {
    /** Base unit adjusted for density */
    unit: string;                // "4px" * scale

    /** Common spacing values */
    xs: string;                  // unit * 1
    sm: string;                  // unit * 2
    md: string;                  // unit * 4
    lg: string;                  // unit * 6
    xl: string;                  // unit * 8
    '2xl': string;               // unit * 12
    '3xl': string;               // unit * 16
  };

  /** Component sizing */
  sizing: {
    /** Touch target minimums */
    touchTarget: {
      compact: string;           // "36px" (still accessible)
      comfortable: string;       // "44px" (WCAG recommended)
      spacious: string;          // "48px" (larger targets)
    };

    /** Icon sizes */
    icon: {
      sm: string;                // "16px" * scale
      md: string;                // "20px" * scale
      lg: string;                // "24px" * scale
    };

    /** Input heights */
    inputHeight: {
      sm: string;                // "32px" * scale
      md: string;                // "40px" * scale
      lg: string;                // "48px" * scale
    };

    /** Button heights */
    buttonHeight: {
      sm: string;
      md: string;
      lg: string;
    };
  };

  /** Typography density adjustments */
  typography: {
    /** Line height multiplier */
    lineHeightScale: number;     // Affects readability in compact mode

    /** Letter spacing adjustment */
    letterSpacingOffset: string; // Slight increase in compact for legibility
  };
}
```

### 7. Enhanced Typography Tokens

```typescript
/**
 * Enhanced Typography Tokens
 * Adds letter-spacing, text-transform, and semantic presets
 */
export interface EnhancedTypographyTokens {
  /** Font family tokens */
  fontFamily: {
    sans: string;                // "Inter, system-ui, sans-serif"
    serif: string;               // "Georgia, Times, serif"
    mono: string;                // "JetBrains Mono, monospace"
    display: string;             // "Inter Display, sans-serif" (headings)
  };

  /** Font size scale (rem-based for accessibility) */
  fontSize: {
    xs: string;                  // "0.75rem" (12px)
    sm: string;                  // "0.875rem" (14px)
    base: string;                // "1rem" (16px)
    lg: string;                  // "1.125rem" (18px)
    xl: string;                  // "1.25rem" (20px)
    '2xl': string;               // "1.5rem" (24px)
    '3xl': string;               // "1.875rem" (30px)
    '4xl': string;               // "2.25rem" (36px)
    '5xl': string;               // "3rem" (48px)
  };

  /** Font weight tokens */
  fontWeight: {
    thin: string;                // "100"
    light: string;               // "300"
    regular: string;             // "400"
    medium: string;              // "500"
    semibold: string;            // "600"
    bold: string;                // "700"
    extrabold: string;           // "800"
    black: string;               // "900"
  };

  /** Line height tokens */
  lineHeight: {
    none: string;                // "1"
    tight: string;               // "1.25"
    snug: string;                // "1.375"
    normal: string;              // "1.5"
    relaxed: string;             // "1.625"
    loose: string;               // "2"
  };

  /** Letter spacing tokens (NEW) */
  letterSpacing: {
    tighter: string;             // "-0.05em"
    tight: string;               // "-0.025em"
    normal: string;              // "0"
    wide: string;                // "0.025em"
    wider: string;               // "0.05em"
    widest: string;              // "0.1em"
  };

  /** Text transform presets (NEW) */
  textTransform: {
    none: string;                // "none"
    uppercase: string;           // "uppercase"
    lowercase: string;           // "lowercase"
    capitalize: string;          // "capitalize"
  };

  /** Semantic typography presets */
  preset: {
    // Display headings (hero, marketing)
    displayLarge: TypographyPreset;   // 48px/1.1/bold/-0.025em
    displayMedium: TypographyPreset;  // 36px/1.15/bold/-0.025em
    displaySmall: TypographyPreset;   // 30px/1.2/bold/-0.025em

    // Content headings
    headingLarge: TypographyPreset;   // 24px/1.25/semibold
    headingMedium: TypographyPreset;  // 20px/1.3/semibold
    headingSmall: TypographyPreset;   // 18px/1.35/semibold

    // Body text
    bodyLarge: TypographyPreset;      // 18px/1.6/regular
    bodyMedium: TypographyPreset;     // 16px/1.5/regular
    bodySmall: TypographyPreset;      // 14px/1.5/regular

    // Labels and captions
    labelLarge: TypographyPreset;     // 14px/1.4/medium
    labelMedium: TypographyPreset;    // 12px/1.4/medium
    labelSmall: TypographyPreset;     // 11px/1.4/medium/0.025em

    // Code
    code: TypographyPreset;           // 14px/1.6/regular/mono
  };
}

interface TypographyPreset {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  textTransform?: string;
}
```

### 8. Updated ThemeWithTokens Interface

```typescript
/**
 * Extended Theme with Enhanced Token Architecture
 * Version 2.0 - Theme-Aware Enhancement
 */
export interface ThemeWithTokensV2 extends Theme {
  /** Schema version for migration support */
  schemaVersion: '2.0';

  /** Enhanced token structure */
  tokens: {
    atomic: EnhancedAtomicTokens;
    semantic: EnhancedSemanticTokens;
    component: SimplifiedComponentTokens;  // State-agnostic
  };

  /** Composable state layer tokens */
  stateLayer: StateLayerTokens;

  /** Motion tokens */
  motion: MotionTokens;

  /** Elevation/shadow tokens */
  elevation: ElevationTokens;

  /** Border tokens */
  border: ExtendedBorderTokens;

  /** Typography tokens */
  typography: EnhancedTypographyTokens;

  /** Density configuration */
  density: DensityTokens;

  /** Dark mode overrides */
  darkMode?: {
    tokens: {
      semantic: Partial<EnhancedSemanticTokens>;
    };
    stateLayer: Partial<StateLayerTokens>;
    elevation: Partial<ElevationTokens>;
  };

  /** Brand-specific overrides (multi-brand support) */
  brandOverrides?: {
    [brandId: string]: Partial<ThemeWithTokensV2>;
  };
}
```

### 9. CSS Generation with State Composition

```typescript
/**
 * CSS Generation with Composable State Layers
 * Generates utility classes and CSS variables for state composition
 */
export function generateEnhancedThemeCSS(theme: ThemeWithTokensV2): string {
  const lines: string[] = [
    `/* Generated by Tekton v2.0 - Theme: ${theme.id} */`,
    `/* Schema Version: ${theme.schemaVersion} */`,
    '',
    ':root {',
  ];

  // State Layer CSS Variables
  lines.push('  /* === State Layer Tokens === */');
  lines.push(`  --state-hover-opacity: ${theme.stateLayer.hover.opacity};`);
  lines.push(`  --state-pressed-opacity: ${theme.stateLayer.pressed.opacity};`);
  lines.push(`  --state-focus-opacity: ${theme.stateLayer.focus.opacity};`);
  lines.push(`  --state-disabled-opacity: ${theme.stateLayer.disabled.opacity};`);
  lines.push(`  --state-disabled-content-opacity: ${theme.stateLayer.disabled.contentOpacity};`);

  // Density Variables
  lines.push('');
  lines.push('  /* === Density Scale === */');
  lines.push(`  --density-scale: ${theme.density.scale[theme.density.mode]};`);
  lines.push(`  --spacing-unit: calc(4px * var(--density-scale));`);

  // Motion Variables
  lines.push('');
  lines.push('  /* === Motion Tokens === */');
  for (const [key, value] of Object.entries(theme.motion.duration)) {
    lines.push(`  --duration-${key}: ${value};`);
  }
  for (const [key, value] of Object.entries(theme.motion.easing)) {
    lines.push(`  --easing-${key}: ${value};`);
  }

  // ... (continue with other token categories)

  lines.push('}');

  // State Layer Utility Classes
  lines.push('');
  lines.push('/* === State Layer Utilities === */');
  lines.push('.state-hover { position: relative; }');
  lines.push('.state-hover::after {');
  lines.push('  content: "";');
  lines.push('  position: absolute;');
  lines.push('  inset: 0;');
  lines.push('  background: currentColor;');
  lines.push('  opacity: 0;');
  lines.push('  transition: opacity var(--duration-quick) var(--easing-standard);');
  lines.push('  pointer-events: none;');
  lines.push('}');
  lines.push('.state-hover:hover::after { opacity: var(--state-hover-opacity); }');
  lines.push('.state-hover:active::after { opacity: var(--state-pressed-opacity); }');
  lines.push('.state-hover:disabled { opacity: var(--state-disabled-opacity); }');

  return lines.join('\n');
}
```

---

## TRACEABILITY

### Requirements to Implementation Mapping

| Requirement | Implementation File | Test File |
|-------------|---------------------|-----------|
| U-001 | `core/src/tokens-v2.ts#StateLayerTokens` | `core/__tests__/state-layer.test.ts` |
| U-002 | `core/src/tokens-v2.ts#EnhancedSemanticTokens` | `core/__tests__/semantic-tiers.test.ts` |
| U-003 | `core/src/tokens-v2.ts#MotionTokens` | `core/__tests__/motion-tokens.test.ts` |
| U-004 | `core/src/tokens-v2.ts#DensityTokens` | `core/__tests__/density-scale.test.ts` |
| S-001 | `core/src/css-generator-v2.ts` | `core/__tests__/state-composition.test.ts` |
| S-002 | `core/src/density-resolver.ts` | `core/__tests__/density-modes.test.ts` |
| S-003 | `core/src/dark-mode-v2.ts` | `core/__tests__/dark-state-layers.test.ts` |

### SPEC Tags for Implementation

- **[SPEC-COMPONENT-001-E]**: Theme enhancement implementation
- **[STATE-LAYER]**: Composable state layer tokens
- **[SEMANTIC-TIERS]**: Color tier system
- **[MOTION-TOKENS]**: Separated motion tokens
- **[DENSITY-SCALE]**: Density system
- **[ELEVATION]**: Shadow/elevation tokens

---

## DEPENDENCIES

### Internal Dependencies
- **SPEC-COMPONENT-001-A**: Base 3-layer token architecture (extends)
- **@tekton/core**: Base package types

### External Dependencies
- **zod**: ^3.22.0 - Runtime schema validation
- **TypeScript**: ^5.7.0 - Type system

### Dependents (Enables)
- **SPEC-COMPONENT-001-C**: Component implementation can use simplified state-agnostic tokens
- **SPEC-COMPONENT-001-D**: Export pipeline generates enhanced CSS with state layers
- Future: Multi-brand theming support

---

## MIGRATION STRATEGY

### From v1 (SPEC-COMPONENT-001-A) to v2 (This SPEC)

1. **Schema Version Check**
   - Add `schemaVersion` field to distinguish token formats
   - v1 themes continue to work with existing resolver

2. **State Token Migration**
   - Existing `component.button.primary.hover` → Computed via state layer
   - Provide migration utility to extract state values

3. **Backward Compatibility**
   - `resolveToken()` supports both v1 and v2 schemas
   - Component tokens can still define explicit state values (override)

```typescript
// Migration utility
function migrateTokensV1ToV2(v1Theme: ThemeWithTokens): ThemeWithTokensV2 {
  // Extract state opacity patterns from existing tokens
  // Generate state layer tokens
  // Simplify component tokens to state-agnostic
}
```

---

## RISK ANALYSIS

### High-Risk Areas

**Risk 1: State Layer Visual Parity**
- **Likelihood**: MEDIUM
- **Impact**: HIGH
- **Mitigation**: Side-by-side visual comparison tests
- **Contingency**: Keep explicit state tokens for critical components

**Risk 2: Density Scale Breaking Layouts**
- **Likelihood**: MEDIUM
- **Impact**: MEDIUM
- **Mitigation**: Layout stress tests at all density levels
- **Contingency**: Component-specific density overrides

### Medium-Risk Areas

**Risk 3: Migration Complexity**
- **Likelihood**: LOW
- **Impact**: MEDIUM
- **Mitigation**: Automated migration tool with validation
- **Contingency**: Gradual migration per component

---

## SUCCESS CRITERIA

### Implementation Success
- [ ] State layer composition produces visually equivalent states to v1
- [ ] Semantic color tiers meet WCAG 2.1 AA contrast ratios
- [ ] Motion tokens support all existing animation patterns
- [ ] Density scale maintains touch target accessibility (>36px compact)
- [ ] Dark mode state layers invert correctly

### Quality Success
- [ ] Token count reduced by >50% compared to explicit state tokens
- [ ] Test coverage >= 90% for new token types
- [ ] Performance: CSS generation <100ms for full theme
- [ ] No visual regression in existing components

### Integration Success
- [ ] v1 themes continue to work without modification
- [ ] Migration utility successfully converts existing themes
- [ ] CSS output compatible with Tailwind CSS integration
- [ ] Multi-brand theming works with override system

---

## REFERENCES

- [Material Design 3 - State Layers](https://m3.material.io/foundations/interaction/states/state-layers)
- [Uber Base Design System](http://gerardodiaz.me/base)
- [Salesforce Lightning Design Tokens](https://design-system-site-summer-21.herokuapp.com/design-tokens/)
- [The Story of Design Tokens: Stateful vs. Composable](https://www.designsystemscollective.com/the-story-of-design-tokens-stateful-vs-composable-tokens-4f8a3f736932)
- [Design Tokens Explained - Contentful](https://www.contentful.com/blog/design-token-system/)

---

**Last Updated**: 2026-01-25
**Status**: Planned
**Version**: 1.0.0
**Parent SPEC**: SPEC-COMPONENT-001
**Next Steps**: /moai:2-run SPEC-COMPONENT-001-E
