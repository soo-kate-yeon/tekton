---
id: SPEC-THEME-BIND-001
version: "1.0.0"
status: "draft"
created: "2026-01-21"
updated: "2026-01-21"
author: "asleep"
priority: "high"
lifecycle: "spec-anchored"
---

# HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-21 | asleep | Initial SPEC creation for Theme Token Binding |

---

# SPEC-THEME-BIND-001: Theme Token Binding for Component Generation

## 1. Overview

### 1.1 Purpose

This SPEC defines the integration between Theme selection (Layer 1) and Component Generation (Layer 3) through Token Binding. The system enables generated components to automatically receive theme-specific design tokens, ensuring visual consistency across the Tekton design system.

**Primary Goal**: When `renderScreen` generates React components, the output code includes theme-specific token bindings based on the selected theme (default: `calm-wellness`).

**Design Principle**: Theme-aware code generation. Components receive design tokens at generation time, not just at runtime.

### 1.2 User Story

```
AS A developer using Tekton Studio
I WANT generated components to automatically use the selected theme's design tokens
SO THAT I can see the correct visual styling without manual token configuration
```

**Current User Flow (Broken)**:
1. User requests screen generation
2. LLM invokes `renderScreen(blueprint)`
3. Generated code has generic token references (e.g., `color-primary`)
4. No theme-specific values applied

**Target User Flow (Fixed)**:
1. User requests screen generation with Calm Wellness theme
2. LLM invokes `renderScreen(blueprint, { themeId: "calm-wellness" })`
3. Generated code includes theme-specific CSS variables
4. Components render with correct Calm Wellness aesthetic

### 1.3 Scope

**In Scope (Phase 1 - MVP)**:
- BlueprintResult schema extension with `themeId` field
- renderScreen signature update with theme parameter
- TokenResolver implementation for theme-to-token mapping
- JSXGenerator theme context integration
- Calm Wellness as hardcoded default theme
- Backward compatibility for blueprints without themeId

**Out of Scope (Future Phases)**:
- User authentication and theme preferences
- Dynamic theme selection at runtime
- Theme creation/editing interface
- Multi-theme preview capability

### 1.4 Dependencies

**Required SPEC Dependencies**:
- **SPEC-LAYER1-001**: Token Generator Engine - Provides design token definitions
- **SPEC-LAYER2-001**: Component Knowledge System - Provides component token bindings
- **SPEC-LAYER3-MVP-001**: Component Generation Engine - Base renderScreen implementation

**External Resources**:
- Theme definition file: `/packages/studio-mcp/src/theme/themes/calm-wellness.json`
- Component catalog: `@tekton/component-knowledge` COMPONENT_CATALOG

---

## 2. Environment

### 2.1 Technical Environment

- **Runtime**: Node.js 20+ / Browser (ES2022+)
- **Language**: TypeScript 5.9+
- **Build System**: Turbo (existing monorepo setup)
- **Package Manager**: pnpm (existing project standard)
- **Testing**: Vitest (existing test framework)

### 2.2 Existing Architecture

```
Layer 1 (Token Generator)
    |
    v  Design Tokens (CSS Variables)
Layer 2 (Component Knowledge)
    |
    v  Component Catalog with Token Bindings
Layer 3 (Component Generator)  <-- This SPEC modifies
    |
    v  React/Next.js Components
Layer 4 (Theme Provider)
    |
    v  Runtime CSS Variable Application
```

### 2.3 Integration Points

**Input**:
- Theme JSON files from `/packages/studio-mcp/src/theme/themes/`
- Blueprint JSON with optional `themeId`
- ComponentKnowledge with `tokenBindings` per component

**Output**:
- React component files (`.tsx`) with theme-specific token bindings
- CSS variable references matching selected theme

---

## 3. Assumptions

### 3.1 Technical Assumptions

**ASSUMPTION-001**: Theme JSON files have stable structure
- **Confidence**: High - calm-wellness.json is well-defined
- **Evidence**: Existing theme files follow consistent schema
- **Risk if Wrong**: May need schema validation
- **Validation**: Test with all 13 existing theme files

**ASSUMPTION-002**: ComponentKnowledge.tokenBindings maps to CSS properties
- **Confidence**: High - Layer 2 implementation is complete
- **Evidence**: TokenBindings interface defines CSS property mappings
- **Risk if Wrong**: May need token name translation
- **Validation**: Verify COMPONENT_CATALOG token bindings

**ASSUMPTION-003**: Backward compatibility is achievable without breaking changes
- **Confidence**: High - Optional themeId field approach
- **Evidence**: TypeScript optional fields support this pattern
- **Risk if Wrong**: May need version migration
- **Validation**: Test existing blueprint processing

### 3.2 Business Assumptions

**ASSUMPTION-004**: Calm Wellness is acceptable as default theme
- **Confidence**: High - User explicitly requested this
- **Evidence**: User requirement: "Calm Wellness default"
- **Risk if Wrong**: May need configuration option
- **Validation**: User acceptance testing

---

## 4. Requirements

### 4.1 Ubiquitous Requirements (Always Active)

**REQ-TB-001**: The system shall always resolve theme tokens for generated components
- **Rationale**: Every generated component needs styling
- **Acceptance**: 100% of generated components include token references

**REQ-TB-002**: The system shall always use "calm-wellness" as the default theme when themeId is not specified
- **Rationale**: User requirement for Calm Wellness default
- **Acceptance**: Blueprint without themeId produces Calm Wellness-styled output

**REQ-TB-003**: The system shall always maintain backward compatibility with existing blueprints
- **Rationale**: Existing LLM workflows must not break
- **Acceptance**: Blueprints without themeId field process successfully

**REQ-TB-004**: The system shall always use CSS variable syntax for token references in generated code
- **Rationale**: Enables runtime theme switching via ThemeProvider
- **Acceptance**: Generated code uses `var(--token-name)` format

### 4.2 Event-Driven Requirements (Trigger-Response)

**REQ-TB-005**: WHEN renderScreen is invoked with a valid themeId, THEN the system shall load the corresponding theme JSON and apply its tokens
- **Rationale**: Theme selection must affect output
- **Acceptance**: Different themeId produces different token values

**REQ-TB-006**: WHEN a Blueprint contains themeId field, THEN the system shall override the default theme
- **Rationale**: Explicit theme selection takes precedence
- **Acceptance**: Blueprint themeId is respected over default

**REQ-TB-007**: WHEN JSXGenerator processes a ComponentNode, THEN it shall inject theme-resolved token bindings as style props
- **Rationale**: Core token binding functionality
- **Acceptance**: Generated JSX includes style object with CSS variables

**REQ-TB-008**: WHEN a component has state-specific tokens (hover, focus, disabled), THEN the system shall generate appropriate CSS class names or pseudo-selector handling
- **Rationale**: Interactive states need styling
- **Acceptance**: State tokens mapped to appropriate CSS patterns

### 4.3 State-Driven Requirements (Conditional Behavior)

**REQ-TB-009**: IF themeId is not found in available themes, THEN the system shall fall back to "calm-wellness" and emit a warning
- **Rationale**: Graceful degradation
- **Acceptance**: Unknown themeId logs warning, uses default

**REQ-TB-010**: IF a component's tokenBindings reference undefined tokens, THEN the system shall use fallback values and emit a warning
- **Rationale**: Prevent generation failure
- **Acceptance**: Missing tokens produce fallback, not error

**REQ-TB-011**: IF Blueprint.analysis.tone matches theme's brandTone, THEN the system shall optimize token selection for consistency
- **Rationale**: Semantic alignment between intent and appearance
- **Acceptance**: Tone-matched components have harmonious styling

### 4.4 Unwanted Behaviors (Prohibited Actions)

**REQ-TB-012**: The system shall NOT generate hardcoded color/size values in component output
- **Rationale**: Must use Layer 1 token system
- **Acceptance**: Zero hex codes, px values, or raw numbers for design values

**REQ-TB-013**: The system shall NOT fail silently when theme loading fails
- **Rationale**: Developers need feedback
- **Acceptance**: Theme errors produce structured error responses

**REQ-TB-014**: The system shall NOT modify existing Blueprint schema in breaking ways
- **Rationale**: Backward compatibility requirement
- **Acceptance**: Existing tests pass without modification

### 4.5 Optional Requirements (Future Enhancement)

**REQ-TB-015**: WHERE possible, the system should support theme-specific aiContext guidance
- **Rationale**: Calm Wellness has glassmorphism, blur effects guidance
- **Acceptance**: aiContext informs component prop defaults

---

## 5. Technical Specifications

### 5.1 Schema Changes

#### 5.1.1 BlueprintResult Extension

```typescript
// packages/component-generator/src/types/knowledge-schema.ts

export interface BlueprintResult {
  blueprintId: string;
  recipeName: string;
  analysis: {
    intent: string;
    tone: string;
  };
  structure: ComponentNode;

  // NEW: Theme binding support
  themeId?: string;  // Optional, defaults to "calm-wellness"
}
```

#### 5.1.2 Theme Configuration Type

```typescript
// packages/component-generator/src/types/theme-types.ts (NEW FILE)

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  stackInfo: {
    framework: string;
    styling: string;
    components: string;
  };
  brandTone: string;
  colorPalette: {
    primary: OKLCHColor;
    secondary: OKLCHColor;
    accent: OKLCHColor;
    neutral: OKLCHColor;
  };
  typography: {
    fontFamily: string;
    fontScale: string;
    headingWeight: number;
    bodyWeight: number;
  };
  componentDefaults: {
    borderRadius: 'small' | 'medium' | 'large';
    density: 'compact' | 'default' | 'spacious';
    contrast: 'low' | 'medium' | 'high';
  };
  aiContext: {
    brandTone: string;
    designPhilosophy: string;
    colorGuidance: string;
    componentGuidance: string;
    accessibilityNotes: string;
  };
}

export interface OKLCHColor {
  l: number;  // Lightness 0-1
  c: number;  // Chroma 0-0.4
  h: number;  // Hue 0-360
}

export interface ResolvedTokens {
  [tokenName: string]: {
    cssVariable: string;
    value: string;
    rgbFallback?: string;
  };
}
```

### 5.2 New Module: TokenResolver

```typescript
// packages/component-generator/src/resolvers/token-resolver.ts (NEW FILE)

import type { ThemeConfig, ResolvedTokens } from '../types/theme-types.js';
import type { TokenBindings, StateTokenBindings } from '@tekton/component-knowledge';

export class TokenResolver {
  private themes: Map<string, ThemeConfig> = new Map();
  private defaultThemeId: string = 'calm-wellness';

  constructor(themesPath?: string) {
    this.loadThemes(themesPath);
  }

  /**
   * Load all theme JSON files from themes directory
   */
  private async loadThemes(basePath?: string): Promise<void> {
    // Implementation loads theme files into Map
  }

  /**
   * Resolve component token bindings for a specific theme
   *
   * @param componentName - Component name from catalog
   * @param tokenBindings - Component's token binding configuration
   * @param themeId - Theme identifier (defaults to calm-wellness)
   * @returns Resolved CSS variables and values
   */
  resolveTokens(
    componentName: string,
    tokenBindings: StateTokenBindings,
    themeId?: string
  ): ResolvedTokens {
    const theme = this.themes.get(themeId || this.defaultThemeId);
    if (!theme) {
      console.warn(`Theme "${themeId}" not found, using default`);
      return this.resolveTokens(componentName, tokenBindings, this.defaultThemeId);
    }

    const resolved: ResolvedTokens = {};
    const defaultBindings = tokenBindings.states.default;

    for (const [property, tokenName] of Object.entries(defaultBindings)) {
      if (tokenName) {
        resolved[property] = this.resolveToken(tokenName, theme);
      }
    }

    return resolved;
  }

  /**
   * Convert token name to CSS variable reference
   */
  private resolveToken(tokenName: string, theme: ThemeConfig): {
    cssVariable: string;
    value: string;
    rgbFallback?: string;
  } {
    // Map token names like "color-primary" to theme palette
    // Generate CSS variable: var(--tekton-color-primary)
    // Calculate fallback value from theme colorPalette
  }

  /**
   * Check if theme exists
   */
  hasTheme(themeId: string): boolean {
    return this.themes.has(themeId);
  }

  /**
   * Get available theme IDs
   */
  getAvailableThemes(): string[] {
    return Array.from(this.themes.keys());
  }
}
```

### 5.3 JSXGenerator Integration

```typescript
// packages/component-generator/src/generator/jsx-generator.ts (MODIFIED)

export interface GeneratorOptions {
  themeId?: string;  // NEW: Theme for token resolution
}

export class JSXGenerator {
  private astBuilder: ASTBuilder;
  private tokenResolver: TokenResolver;  // NEW

  constructor(options?: GeneratorOptions) {
    this.astBuilder = new ASTBuilder();
    this.tokenResolver = new TokenResolver();
  }

  async generate(
    blueprint: BlueprintResult,
    options?: GeneratorOptions
  ): Promise<GenerationResult> {
    // Determine effective theme
    const themeId = options?.themeId || blueprint.themeId || 'calm-wellness';

    // Pass theme context to AST builder
    const astResult = this.astBuilder.build(blueprint, { themeId });

    // ... rest of generation logic
  }
}
```

### 5.4 JSXElementGenerator Theme Context

```typescript
// packages/component-generator/src/generator/jsx-element-generator.ts (MODIFIED)

import { TokenResolver } from '../resolvers/token-resolver.js';
import { COMPONENT_CATALOG } from '@tekton/component-knowledge';

interface BuildContext {
  themeId: string;
  tokenResolver: TokenResolver;
}

export function buildComponentNode(
  node: ComponentNode,
  context: BuildContext  // NEW PARAMETER
): t.JSXElement {
  const { componentName, props, slots } = node;

  // Look up component in catalog
  const componentKnowledge = COMPONENT_CATALOG.find(c => c.name === componentName);

  // Resolve tokens if component has token bindings
  if (componentKnowledge?.tokenBindings) {
    const resolvedTokens = context.tokenResolver.resolveTokens(
      componentName,
      componentKnowledge.tokenBindings,
      context.themeId
    );

    // Inject style prop with CSS variables
    const styleObject = tokensToStyleObject(resolvedTokens);
    props.style = { ...props.style, ...styleObject };
  }

  // ... rest of JSX building
}

function tokensToStyleObject(tokens: ResolvedTokens): Record<string, string> {
  const style: Record<string, string> = {};

  for (const [property, resolved] of Object.entries(tokens)) {
    // Convert tokenBinding property to CSS property
    // e.g., backgroundColor -> backgroundColor: var(--tekton-bg-primary)
    style[property] = resolved.cssVariable;
  }

  return style;
}
```

### 5.5 renderScreen API Update

```typescript
// packages/studio-mcp/src/component/layer3-tools.ts (MODIFIED)

export interface RenderScreenOptions {
  outputPath?: string;
  themeId?: string;  // NEW: Optional theme override
}

export async function renderScreen(
  blueprint: BlueprintResult,
  options?: RenderScreenOptions  // CHANGED: From optional string to options object
): Promise<{
  success: boolean;
  filePath?: string;
  code?: string;
  error?: string;
  errorCode?: string;
  themeApplied?: string;  // NEW: Report which theme was used
}> {
  try {
    // Determine effective theme (priority: options > blueprint > default)
    const themeId = options?.themeId || blueprint.themeId || 'calm-wellness';

    // Validate theme exists
    const generator = new JSXGenerator();
    if (!generator.tokenResolver.hasTheme(themeId)) {
      console.warn(`Unknown theme "${themeId}", using calm-wellness`);
    }

    // Generate with theme context
    const result = await generator.generate(blueprint, { themeId });

    // ... file write logic

    return {
      success: true,
      filePath: finalPath,
      code: result.code,
      themeApplied: themeId,
    };
  } catch (error) {
    // ... error handling
  }
}
```

### 5.6 Module Structure

```
packages/component-generator/
├── src/
│   ├── types/
│   │   ├── knowledge-schema.ts      # MODIFIED: Add themeId to Blueprint
│   │   └── theme-types.ts           # NEW: Theme configuration types
│   ├── generator/
│   │   ├── ast-builder.ts           # MODIFIED: Accept theme context
│   │   ├── jsx-generator.ts         # MODIFIED: Theme option support
│   │   └── jsx-element-generator.ts # MODIFIED: Token resolution
│   ├── resolvers/
│   │   ├── slot-resolver.ts         # EXISTING
│   │   └── token-resolver.ts        # NEW: Theme token resolution
│   └── index.ts                     # MODIFIED: Export new types
├── tests/
│   ├── resolvers/
│   │   └── token-resolver.test.ts   # NEW: Token resolution tests
│   └── integration/
│       └── theme-binding.test.ts    # NEW: Integration tests
└── package.json

packages/studio-mcp/
├── src/
│   └── component/
│       └── layer3-tools.ts          # MODIFIED: Theme parameter
└── package.json
```

### 5.7 Generated Code Example

**Input Blueprint**:
```json
{
  "blueprintId": "bp-calm-001",
  "recipeName": "WellnessCard",
  "themeId": "calm-wellness",
  "analysis": { "intent": "Display", "tone": "calm" },
  "structure": {
    "componentName": "Card",
    "props": { "variant": "elevated" },
    "slots": {
      "content": {
        "componentName": "Typography",
        "props": { "variant": "body1" }
      }
    }
  }
}
```

**Generated Output**:
```tsx
import { Card, Typography } from "@tekton/components";

export default function WellnessCard() {
  return (
    <Card
      variant="elevated"
      style={{
        backgroundColor: "var(--tekton-surface-elevated)",
        borderRadius: "var(--tekton-radius-large)",
        boxShadow: "var(--tekton-shadow-soft)",
      }}
    >
      <Typography
        variant="body1"
        style={{
          color: "var(--tekton-text-primary)",
          fontWeight: "var(--tekton-font-weight-body)",
        }}
      />
    </Card>
  );
}
```

### 5.8 Performance Targets

| Operation | Target | Notes |
|-----------|--------|-------|
| Theme loading (initial) | < 100ms | Load all 13 themes once |
| Token resolution | < 5ms | Per component |
| Style object generation | < 2ms | Per component |
| Total render with theme | < 300ms | End-to-end |

### 5.9 Error Code System

| Code | Type | Description |
|------|------|-------------|
| THEME-E001 | NotFound | Theme ID not found in available themes |
| THEME-E002 | LoadError | Failed to load theme JSON file |
| THEME-E003 | TokenMissing | Required token not defined in theme |
| THEME-W001 | Fallback | Using default theme due to invalid themeId |
| THEME-W002 | TokenFallback | Using fallback value for undefined token |

---

## 6. Implementation Plan

### Phase 1: Schema Extension (Priority: Critical)
**Milestone 1: Blueprint Schema Update**
- Add `themeId` optional field to BlueprintResult
- Update BlueprintResultSchema JSON Schema
- Ensure backward compatibility
- **Files**: `knowledge-schema.ts`
- **Acceptance**: Existing blueprints process without error

### Phase 2: Token Resolution Core (Priority: Critical)
**Milestone 2: TokenResolver Implementation**
- Create `theme-types.ts` with type definitions
- Implement `TokenResolver` class
- Load theme JSON files from disk
- Map token names to CSS variables
- **Files**: `theme-types.ts`, `token-resolver.ts`
- **Acceptance**: TokenResolver correctly resolves calm-wellness tokens

### Phase 3: Generator Integration (Priority: High)
**Milestone 3: JSXGenerator Theme Support**
- Update `JSXGenerator` to accept theme options
- Modify `jsx-element-generator` for token injection
- Pass theme context through build pipeline
- **Files**: `jsx-generator.ts`, `jsx-element-generator.ts`, `ast-builder.ts`
- **Acceptance**: Generated code includes CSS variable style props

### Phase 4: API Update (Priority: High)
**Milestone 4: renderScreen Theme Parameter**
- Update `renderScreen` function signature
- Add theme validation logic
- Report applied theme in response
- **Files**: `layer3-tools.ts`
- **Acceptance**: renderScreen accepts and applies themeId

### Phase 5: Testing and Validation (Priority: High)
**Milestone 5: Quality Assurance**
- Unit tests for TokenResolver
- Integration tests for theme binding
- End-to-end tests with LLM workflow
- **Files**: `token-resolver.test.ts`, `theme-binding.test.ts`
- **Acceptance**: >= 85% test coverage, all scenarios pass

---

## 7. Testing Strategy

### 7.1 Unit Tests

**TokenResolver Tests**:
```typescript
describe('TokenResolver', () => {
  it('should load all theme files on initialization');
  it('should resolve tokens for calm-wellness theme');
  it('should fall back to default when theme not found');
  it('should generate correct CSS variable syntax');
  it('should handle missing tokens gracefully');
});
```

**JSXElementGenerator Tests**:
```typescript
describe('JSXElementGenerator with Theme', () => {
  it('should inject style props from resolved tokens');
  it('should preserve existing props');
  it('should handle components without token bindings');
});
```

### 7.2 Integration Tests

```typescript
describe('Theme Token Binding Integration', () => {
  it('should generate themed Card component');
  it('should generate themed Typography component');
  it('should apply calm-wellness as default');
  it('should support explicit themeId in blueprint');
  it('should maintain backward compatibility');
});
```

### 7.3 End-to-End Tests

```typescript
describe('E2E: LLM Theme Workflow', () => {
  it('should complete: get-knowledge-schema -> design -> render with theme');
  it('should generate compilable TypeScript output');
  it('should produce correct CSS variables for calm-wellness');
});
```

---

## 8. Quality Gates

### 8.1 TRUST 5 Framework Compliance

- **Test-first**: >= 85% test coverage with vitest
- **Readable**: Clear naming, comprehensive JSDoc
- **Unified**: ESLint + Prettier formatting
- **Secured**: Theme file validation, error boundaries
- **Trackable**: Commits reference SPEC-THEME-BIND-001

### 8.2 Acceptance Criteria Summary

- [ ] BlueprintResult schema includes optional `themeId` field
- [ ] TokenResolver loads all theme files from disk
- [ ] TokenResolver resolves component tokens for given theme
- [ ] JSXGenerator accepts theme options
- [ ] JSXElementGenerator injects CSS variable style props
- [ ] renderScreen accepts themeId parameter
- [ ] Default theme is "calm-wellness" when not specified
- [ ] Unknown themeId falls back to default with warning
- [ ] Backward compatibility maintained (existing blueprints work)
- [ ] Generated code compiles without TypeScript errors
- [ ] Test coverage >= 85%

---

## 9. Traceability

**TAG**: SPEC-THEME-BIND-001
**Dependencies**:
- SPEC-LAYER1-001 (Token Generator Engine) - Provides token definitions
- SPEC-LAYER2-001 (Component Knowledge System) - Provides component token bindings
- SPEC-LAYER3-MVP-001 (Component Generation Engine) - Base implementation

**Related Assets**:
- Theme file: `/packages/studio-mcp/src/theme/themes/calm-wellness.json`
- Component catalog: `@tekton/component-knowledge` COMPONENT_CATALOG

**Implementation Files**:
- `packages/component-generator/src/types/knowledge-schema.ts` (MODIFY)
- `packages/component-generator/src/types/theme-types.ts` (NEW)
- `packages/component-generator/src/resolvers/token-resolver.ts` (NEW)
- `packages/component-generator/src/generator/jsx-generator.ts` (MODIFY)
- `packages/component-generator/src/generator/jsx-element-generator.ts` (MODIFY)
- `packages/studio-mcp/src/component/layer3-tools.ts` (MODIFY)

---

**END OF SPEC**
