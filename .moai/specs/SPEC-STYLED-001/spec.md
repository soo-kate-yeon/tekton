---
id: SPEC-STYLED-001
version: "1.0.0"
status: "implemented"
created: "2026-01-29"
updated: "2026-01-29"
completed: "2026-01-29"
author: "soo-kate-yeon"
priority: "critical"
lifecycle: "spec-anchored"
tags:
  - token-enforcement
  - styled-components
  - build-plugin
  - ai-compliance
implementation:
  commits:
    - de31f9d # feat: Add @tekton/tokens type definitions
    - 8f0abdd # feat: Add @tekton/styled token-enforced wrapper
    - 3e5de4b # feat: Add @tekton/esbuild-plugin build validation
    - abcf584 # docs: Add documentation for token-enforced styling system
  tests_added: 197
  total_tests: 1821
  coverage: "85%+"
  requirements_met: "18/20 (90%)"
  reports:
    - implementation: ".moai/specs/SPEC-STYLED-001/implementation-report.md"
    - tests: ".moai/specs/SPEC-STYLED-001/test-completion-report.md"
---

## HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-29 | soo-kate-yeon | Initial SPEC creation for Token-Enforced Styling System |
| 1.0.0 | 2026-01-29 | manager-ddd | Implementation completed - 3 packages, 197 tests, 90% requirements |

---

# SPEC-STYLED-001: Token-Enforced Styling System

## 1. Overview

### 1.1 Purpose

This SPEC defines a **Token-Enforced Styling System** that prevents AI coding agents (and human developers) from bypassing the design token system. The system ensures 100% token compliance at compile time and build time, making hardcoded CSS values impossible.

**Primary Goal**: Enforce design token usage through TypeScript type system and build-time validation, eliminating the possibility of hardcoded styles.

**Design Principle**: "Tekton's value = Token System enforcement (not component count)"

### 1.2 Problem Statement

**Current Problem:**
```typescript
// AI agents can bypass MCP tools and write:
const BadComponent = styled.div`
  background: #ffffff;      // Hardcoded color
  padding: 16px;            // Hardcoded spacing
  border-radius: 8px;       // Hardcoded radius
`;
// This breaks design system integrity
```

**Impact:**
- Design system inconsistency across the application
- Theme switching becomes impossible
- Maintenance nightmare as product scales
- **Fatal for service commercialization**

### 1.3 Solution Overview

A **Hybrid Token System** with three enforcement layers:

1. **TypeScript Enforcement** (`@tekton/styled`): styled-components wrapper that only accepts token references
2. **Type Definitions** (`@tekton/tokens`): Complete TypeScript token type definitions with IDE autocomplete
3. **Build Validation** (`@tekton/vite-plugin`, `@tekton/webpack-plugin`): Scan all generated code and fail build if compliance < 100%

**Target State:**
```typescript
import { styled, tokens } from '@tekton/styled';

const GoodComponent = styled.div`
  background: ${tokens.bg.surface.default};  // Token allowed
  padding: ${tokens.spacing[4]};              // Token allowed
  // background: #ffffff;  <- TypeScript Error!
`;
```

### 1.4 Scope

**In Scope (Phase 1 - MVP):**
- `@tekton/styled` package with TypeScript enforcement
- `@tekton/tokens` package with token type definitions
- `@tekton/vite-plugin` for build-time validation
- Primitive components (10-15) as reference implementations
- Documentation and migration guide

**Out of Scope (Future Phases):**
- `@tekton/webpack-plugin` (Phase 2)
- Visual Studio Code extension for real-time feedback
- Automated code migration tool
- CSS-in-JS alternatives (emotion, vanilla-extract)

### 1.5 Dependencies

**Required SPEC Dependencies:**
- SPEC-COMPONENT-001 (Token System) - Provides token resolution logic
- SPEC-THEME-BIND-001 (Theme Binding) - Provides theme context integration

**External Dependencies:**
- styled-components ^6.0.0
- TypeScript ^5.5.0
- Vite ^5.0.0 (for plugin)

---

## 2. Environment

### 2.1 Technical Environment

- **Runtime**: Node.js 20+ / Browser (ES2022+)
- **Language**: TypeScript 5.5+ (for advanced type inference)
- **Build System**: Vite 5+, Turbo (existing monorepo)
- **Package Manager**: pnpm (existing project standard)
- **Testing**: Vitest (existing test framework)
- **Styling**: styled-components 6+

### 2.2 Package Architecture

```
@tekton/
├── core           # Existing: Theme loading, token resolution
├── styled         # NEW: styled-components wrapper with enforcement
├── tokens         # NEW: TypeScript token type definitions
├── ui             # Existing: Primitive components (10-15)
├── vite-plugin    # NEW: Build-time validation for Vite
├── webpack-plugin # FUTURE: Build-time validation for Webpack
└── mcp-server     # Existing: AI integration
```

### 2.3 Integration Points

**Input:**
- Design token definitions from `@tekton/core`
- Theme JSON files
- User-written styled components

**Output:**
- TypeScript compilation errors for hardcoded values
- Build failures for non-compliant code
- Compliance reports with violation details

---

## 3. Assumptions

### 3.1 Technical Assumptions

**ASSUMPTION-001**: TypeScript template literal types can enforce token-only values
- **Confidence**: HIGH
- **Evidence**: TypeScript 4.1+ template literal types enable pattern matching
- **Risk if Wrong**: May need runtime validation fallback
- **Validation**: Proof of concept with styled-components type override

**ASSUMPTION-002**: Build plugins can reliably detect hardcoded CSS values
- **Confidence**: HIGH
- **Evidence**: ESLint, Stylelint use similar AST analysis
- **Risk if Wrong**: False positives/negatives in edge cases
- **Validation**: Test with 1000+ component samples

**ASSUMPTION-003**: AI agents will use the provided styled wrapper when instructed
- **Confidence**: MEDIUM
- **Evidence**: MCP tool guidance has shown effectiveness
- **Risk if Wrong**: Need additional enforcement in MCP server
- **Validation**: Test with Claude, GPT-4 code generation

**ASSUMPTION-004**: styled-components internals allow type-safe wrapping
- **Confidence**: HIGH
- **Evidence**: styled-components v6 has improved TypeScript support
- **Risk if Wrong**: May need fork or alternative approach
- **Validation**: Prototype styled wrapper with type tests

### 3.2 Business Assumptions

**ASSUMPTION-005**: Token enforcement is critical for commercialization
- **Confidence**: HIGH
- **Evidence**: User explicitly stated "fatal for service commercialization"
- **Risk if Wrong**: N/A - explicit requirement
- **Validation**: User acceptance

**ASSUMPTION-006**: 10-15 primitive components are sufficient for MVP
- **Confidence**: MEDIUM
- **Evidence**: Most UI can be composed from Box, Text, Button, Input, etc.
- **Risk if Wrong**: May need more specialized components
- **Validation**: Build 3 real screens with primitives only

---

## 4. Requirements

### 4.1 Ubiquitous Requirements (Always Active)

**REQ-STY-001**: The system shall always reject hardcoded color values in styled components
- **Rationale**: Core enforcement requirement
- **Acceptance**: `color: #fff` produces TypeScript error

**REQ-STY-002**: The system shall always reject hardcoded spacing values in styled components
- **Rationale**: Spacing consistency is critical for visual harmony
- **Acceptance**: `padding: 16px` produces TypeScript error

**REQ-STY-003**: The system shall always provide IDE autocomplete for available tokens
- **Rationale**: Developer experience is critical for adoption
- **Acceptance**: `tokens.` shows all available token categories

**REQ-STY-004**: The system shall always generate semantic CSS variable references
- **Rationale**: Enable runtime theme switching
- **Acceptance**: Output uses `var(--tekton-*)` format

**REQ-STY-005**: The system shall always maintain backward compatibility with existing @tekton/ui components
- **Rationale**: Gradual migration path required
- **Acceptance**: Existing components continue to work

### 4.2 Event-Driven Requirements (Trigger-Response)

**REQ-STY-006**: WHEN a developer imports from @tekton/styled, THEN the system shall provide the token-enforced styled function
- **Rationale**: Drop-in replacement for styled-components
- **Acceptance**: Import works without additional configuration

**REQ-STY-007**: WHEN build validation runs, THEN the system shall scan all .tsx/.ts files for hardcoded style values
- **Rationale**: Catch any code that bypasses the styled wrapper
- **Acceptance**: Plugin scans entire codebase

**REQ-STY-008**: WHEN hardcoded values are detected, THEN the system shall report file location, line number, and violation type
- **Rationale**: Actionable error messages for developers
- **Acceptance**: Report includes specific remediation guidance

**REQ-STY-009**: WHEN token compliance is below 100%, THEN the build shall fail
- **Rationale**: Zero tolerance for hardcoded values
- **Acceptance**: Build exits with non-zero code

**REQ-STY-010**: WHEN using tokens.* accessor, THEN the system shall return CSS variable references
- **Rationale**: Decouple from actual token values
- **Acceptance**: `tokens.spacing[4]` returns `var(--tekton-spacing-4)`

### 4.3 State-Driven Requirements (Conditional Behavior)

**REQ-STY-011**: IF the project has a .tektonrc configuration, THEN the system shall respect custom token namespaces
- **Rationale**: Support for white-label products
- **Acceptance**: Custom namespace prefix in CSS variables

**REQ-STY-012**: IF development mode is active, THEN the build plugin shall warn but not fail
- **Rationale**: Allow iterative development
- **Acceptance**: Warnings in dev, failures in production build

**REQ-STY-013**: IF a CSS property is not token-applicable (e.g., display: flex), THEN the system shall allow literal values
- **Rationale**: Not all CSS properties need tokens
- **Acceptance**: Non-design-system properties work normally

**REQ-STY-014**: IF tokens.raw.* is used, THEN the system shall return actual token values
- **Rationale**: Special cases needing computed values
- **Acceptance**: `tokens.raw.spacing[4]` returns `16px`

### 4.4 Unwanted Behaviors (Prohibited Actions)

**REQ-STY-015**: The system shall NOT allow hex color codes in styled templates
- **Rationale**: Forces token usage
- **Acceptance**: `#ffffff`, `#fff`, `rgb()`, `hsl()` all produce errors

**REQ-STY-016**: The system shall NOT allow pixel values for spacing properties
- **Rationale**: Forces token usage
- **Acceptance**: `padding: 16px` produces error

**REQ-STY-017**: The system shall NOT fail silently on validation errors
- **Rationale**: Developers need clear feedback
- **Acceptance**: All errors produce visible output

**REQ-STY-018**: The system shall NOT break existing styled-components features
- **Rationale**: Minimal learning curve
- **Acceptance**: Theming, variants, props all work

### 4.5 Optional Requirements (Future Enhancement)

**REQ-STY-019**: WHERE possible, the system should provide auto-fix suggestions
- **Rationale**: Faster remediation
- **Acceptance**: Suggest `tokens.spacing[4]` for `padding: 16px`

**REQ-STY-020**: WHERE possible, the system should integrate with VS Code for real-time feedback
- **Rationale**: Catch errors before build
- **Acceptance**: Inline errors in editor

---

## 5. Technical Specifications

### 5.1 @tekton/styled Package

#### 5.1.1 Core Styled Function

```typescript
// packages/styled/src/styled.ts

import baseStyled, { css as baseCss, createGlobalStyle as baseCreateGlobalStyle } from 'styled-components';
import type { StyledComponent, DefaultTheme } from 'styled-components';
import type { TokenReference, TektonTokens } from '@tekton/tokens';

/**
 * Token-enforced tagged template literal type
 * Rejects hardcoded color/spacing values at compile time
 */
type TokenEnforcedTemplate = TemplateStringsArray & {
  readonly __tokenEnforced: unique symbol;
};

/**
 * Validates that interpolated values are token references
 */
type ValidTokenValue = TokenReference | string | number | ((props: any) => TokenReference | string);

/**
 * Token-enforced styled function
 */
export const styled = new Proxy(baseStyled, {
  get(target, prop) {
    const component = target[prop as keyof typeof target];
    return createTokenEnforcedStyled(component);
  },
});

function createTokenEnforcedStyled<C extends keyof JSX.IntrinsicElements>(
  component: C
): (
  strings: TemplateStringsArray,
  ...values: ValidTokenValue[]
) => StyledComponent<C, DefaultTheme> {
  return (strings, ...values) => {
    // Runtime validation (backup for any edge cases)
    validateNoHardcodedValues(strings, values);

    return baseStyled[component](strings, ...values);
  };
}

/**
 * Runtime validation for hardcoded values
 */
function validateNoHardcodedValues(
  strings: TemplateStringsArray,
  values: any[]
): void {
  const fullTemplate = strings.join('${...}');

  // Check for hardcoded colors
  const colorPatterns = [
    /#[0-9a-fA-F]{3,8}\b/g,           // Hex colors
    /rgb\s*\([^)]+\)/gi,               // rgb()
    /rgba\s*\([^)]+\)/gi,              // rgba()
    /hsl\s*\([^)]+\)/gi,               // hsl()
    /hsla\s*\([^)]+\)/gi,              // hsla()
  ];

  // Check for hardcoded spacing
  const spacingPatterns = [
    /(?:padding|margin|gap|top|right|bottom|left|width|height):\s*\d+px/gi,
  ];

  for (const pattern of [...colorPatterns, ...spacingPatterns]) {
    if (pattern.test(fullTemplate)) {
      throw new Error(
        `[Tekton] Hardcoded value detected. Use tokens instead.\n` +
        `Template: ${fullTemplate.substring(0, 100)}...`
      );
    }
  }
}

export { baseCss as css, baseCreateGlobalStyle as createGlobalStyle };
```

#### 5.1.2 Token Accessor

```typescript
// packages/styled/src/tokens.ts

import type { TektonTokens } from '@tekton/tokens';

/**
 * Token accessor that returns CSS variable references
 *
 * @example
 * tokens.bg.surface.default -> 'var(--tekton-bg-surface-default)'
 * tokens.spacing[4] -> 'var(--tekton-spacing-4)'
 */
export const tokens: TektonTokens = new Proxy({} as TektonTokens, {
  get(target, category: string) {
    return createCategoryProxy(category);
  },
});

function createCategoryProxy(category: string): any {
  return new Proxy({}, {
    get(target, key: string | number) {
      const path = `${category}-${String(key)}`;

      // Handle nested access (e.g., tokens.bg.surface.default)
      return new Proxy(() => `var(--tekton-${path})`, {
        get(fn, nestedKey: string) {
          if (nestedKey === 'toString' || nestedKey === 'valueOf') {
            return () => `var(--tekton-${path})`;
          }
          return createCategoryProxy(`${path}-${nestedKey}`);
        },
        apply() {
          return `var(--tekton-${path})`;
        },
      });
    },
  });
}

/**
 * Raw token accessor for computed values
 *
 * @example
 * tokens.raw.spacing[4] -> '16px'
 */
export const rawTokens = {
  // Implementation would resolve actual values from theme
};
```

### 5.2 @tekton/tokens Package

#### 5.2.1 Token Type Definitions

```typescript
// packages/tokens/src/types.ts

/**
 * Token reference type - represents a CSS variable reference
 */
export type TokenReference = `var(--tekton-${string})`;

/**
 * Background tokens
 */
export interface BgTokens {
  surface: {
    default: TokenReference;
    elevated: TokenReference;
    sunken: TokenReference;
  };
  primary: {
    default: TokenReference;
    hover: TokenReference;
    active: TokenReference;
  };
  secondary: {
    default: TokenReference;
    hover: TokenReference;
    active: TokenReference;
  };
  // ... more bg tokens
}

/**
 * Text/Foreground tokens
 */
export interface FgTokens {
  primary: TokenReference;
  secondary: TokenReference;
  muted: TokenReference;
  inverse: TokenReference;
  link: TokenReference;
  error: TokenReference;
  success: TokenReference;
  warning: TokenReference;
}

/**
 * Spacing tokens (4px base unit)
 */
export interface SpacingTokens {
  0: TokenReference;   // 0px
  1: TokenReference;   // 4px
  2: TokenReference;   // 8px
  3: TokenReference;   // 12px
  4: TokenReference;   // 16px
  5: TokenReference;   // 20px
  6: TokenReference;   // 24px
  8: TokenReference;   // 32px
  10: TokenReference;  // 40px
  12: TokenReference;  // 48px
  16: TokenReference;  // 64px
  20: TokenReference;  // 80px
  24: TokenReference;  // 96px
}

/**
 * Border radius tokens
 */
export interface RadiusTokens {
  none: TokenReference;
  sm: TokenReference;
  md: TokenReference;
  lg: TokenReference;
  xl: TokenReference;
  full: TokenReference;
}

/**
 * Typography tokens
 */
export interface TypographyTokens {
  fontFamily: {
    sans: TokenReference;
    mono: TokenReference;
  };
  fontSize: {
    xs: TokenReference;
    sm: TokenReference;
    base: TokenReference;
    lg: TokenReference;
    xl: TokenReference;
    '2xl': TokenReference;
    '3xl': TokenReference;
    '4xl': TokenReference;
  };
  fontWeight: {
    normal: TokenReference;
    medium: TokenReference;
    semibold: TokenReference;
    bold: TokenReference;
  };
  lineHeight: {
    tight: TokenReference;
    normal: TokenReference;
    relaxed: TokenReference;
  };
}

/**
 * Shadow tokens
 */
export interface ShadowTokens {
  none: TokenReference;
  sm: TokenReference;
  md: TokenReference;
  lg: TokenReference;
  xl: TokenReference;
}

/**
 * Complete Tekton tokens interface
 */
export interface TektonTokens {
  bg: BgTokens;
  fg: FgTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  typography: TypographyTokens;
  shadow: ShadowTokens;
  raw: RawTektonTokens;  // For computed values
}

/**
 * Raw token values (actual CSS values, not variables)
 */
export interface RawTektonTokens {
  spacing: Record<keyof SpacingTokens, string>;
  // ... other raw tokens
}
```

### 5.3 @tekton/vite-plugin Package

#### 5.3.1 Plugin Implementation

```typescript
// packages/vite-plugin/src/index.ts

import type { Plugin } from 'vite';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

export interface TektonPluginOptions {
  /** Fail build on violations (default: true in production) */
  strict?: boolean;

  /** Directories to scan */
  include?: string[];

  /** Directories to exclude */
  exclude?: string[];

  /** Compliance threshold (default: 100) */
  threshold?: number;

  /** Generate report file */
  reportPath?: string;
}

interface Violation {
  file: string;
  line: number;
  column: number;
  type: 'color' | 'spacing' | 'radius' | 'other';
  value: string;
  suggestion?: string;
}

export function tektonPlugin(options: TektonPluginOptions = {}): Plugin {
  const violations: Violation[] = [];
  const {
    strict = process.env.NODE_ENV === 'production',
    include = ['src/**/*.tsx', 'src/**/*.ts'],
    exclude = ['node_modules', '**/*.test.ts', '**/*.spec.ts'],
    threshold = 100,
    reportPath,
  } = options;

  return {
    name: 'vite-plugin-tekton',

    enforce: 'pre',

    transform(code, id) {
      if (!shouldProcess(id, include, exclude)) {
        return null;
      }

      const fileViolations = analyzeCode(code, id);
      violations.push(...fileViolations);

      return null; // Don't transform, just analyze
    },

    buildEnd() {
      if (violations.length > 0) {
        const report = generateReport(violations);
        console.error(report);

        if (reportPath) {
          // Write report to file
        }

        const compliance = calculateCompliance(violations);
        if (strict && compliance < threshold) {
          throw new Error(
            `[Tekton] Token compliance ${compliance}% is below threshold ${threshold}%\n` +
            `Found ${violations.length} violation(s)`
          );
        }
      }
    },
  };
}

function analyzeCode(code: string, filename: string): Violation[] {
  const violations: Violation[] = [];

  try {
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    });

    traverse(ast, {
      TaggedTemplateExpression(path) {
        // Check styled.div`...` or css`...`
        if (isStyledCall(path.node)) {
          const quasis = path.node.quasi.quasis;

          for (const quasi of quasis) {
            const value = quasi.value.raw;
            const lineStart = quasi.loc?.start.line || 0;

            // Check for hardcoded colors
            const colorViolations = findColorViolations(value, filename, lineStart);
            violations.push(...colorViolations);

            // Check for hardcoded spacing
            const spacingViolations = findSpacingViolations(value, filename, lineStart);
            violations.push(...spacingViolations);
          }
        }
      },

      JSXAttribute(path) {
        // Check style={{ ... }} objects
        if (path.node.name.name === 'style') {
          // Analyze inline styles
        }
      },
    });
  } catch (error) {
    console.warn(`[Tekton] Failed to parse ${filename}:`, error);
  }

  return violations;
}

function findColorViolations(css: string, file: string, baseLine: number): Violation[] {
  const violations: Violation[] = [];
  const patterns = [
    { regex: /#[0-9a-fA-F]{3,8}\b/g, type: 'color' as const },
    { regex: /rgb\s*\([^)]+\)/gi, type: 'color' as const },
    { regex: /rgba\s*\([^)]+\)/gi, type: 'color' as const },
  ];

  for (const { regex, type } of patterns) {
    let match;
    while ((match = regex.exec(css)) !== null) {
      violations.push({
        file,
        line: baseLine,
        column: match.index,
        type,
        value: match[0],
        suggestion: suggestToken(type, match[0]),
      });
    }
  }

  return violations;
}

function findSpacingViolations(css: string, file: string, baseLine: number): Violation[] {
  const violations: Violation[] = [];
  const spacingProps = ['padding', 'margin', 'gap', 'width', 'height', 'top', 'right', 'bottom', 'left'];

  for (const prop of spacingProps) {
    const regex = new RegExp(`${prop}\\s*:\\s*(\\d+)px`, 'gi');
    let match;
    while ((match = regex.exec(css)) !== null) {
      const pxValue = parseInt(match[1], 10);
      violations.push({
        file,
        line: baseLine,
        column: match.index,
        type: 'spacing',
        value: `${pxValue}px`,
        suggestion: suggestSpacingToken(pxValue),
      });
    }
  }

  return violations;
}

function suggestSpacingToken(px: number): string {
  const scale: Record<number, string> = {
    0: 'tokens.spacing[0]',
    4: 'tokens.spacing[1]',
    8: 'tokens.spacing[2]',
    12: 'tokens.spacing[3]',
    16: 'tokens.spacing[4]',
    20: 'tokens.spacing[5]',
    24: 'tokens.spacing[6]',
    32: 'tokens.spacing[8]',
    40: 'tokens.spacing[10]',
    48: 'tokens.spacing[12]',
  };
  return scale[px] || `tokens.spacing[?] (${px}px not in scale)`;
}

function suggestToken(type: string, value: string): string {
  if (type === 'color') {
    // Could implement color matching logic
    return 'tokens.bg.* or tokens.fg.*';
  }
  return 'Check @tekton/tokens for available tokens';
}

function generateReport(violations: Violation[]): string {
  const grouped = violations.reduce((acc, v) => {
    acc[v.file] = acc[v.file] || [];
    acc[v.file].push(v);
    return acc;
  }, {} as Record<string, Violation[]>);

  let report = '\n=== Tekton Token Compliance Report ===\n\n';

  for (const [file, fileViolations] of Object.entries(grouped)) {
    report += `${file}:\n`;
    for (const v of fileViolations) {
      report += `  Line ${v.line}: ${v.type} violation - "${v.value}"\n`;
      if (v.suggestion) {
        report += `    Suggestion: ${v.suggestion}\n`;
      }
    }
    report += '\n';
  }

  report += `Total: ${violations.length} violation(s)\n`;
  return report;
}

function calculateCompliance(violations: Violation[]): number {
  // Simplified - would need total CSS property count for accurate calculation
  return violations.length === 0 ? 100 : 0;
}

export default tektonPlugin;
```

### 5.4 Primitive Components (10-15)

```typescript
// packages/ui/src/primitives/index.ts

// Core primitives - all token-enforced
export { Box } from './Box';           // Layout container
export { Text } from './Text';         // Text content
export { Heading } from './Heading';   // Headings h1-h6
export { Button } from './Button';     // Interactive button
export { Input } from './Input';       // Text input
export { Image } from './Image';       // Image with aspect ratio
export { Link } from './Link';         // Navigation link
export { Stack } from './Stack';       // Flex stack (horizontal/vertical)
export { Grid } from './Grid';         // Grid layout
export { Divider } from './Divider';   // Visual separator
export { Icon } from './Icon';         // Icon wrapper
export { Card } from './Card';         // Card container
export { Badge } from './Badge';       // Status badge
export { Spinner } from './Spinner';   // Loading spinner
export { Avatar } from './Avatar';     // User avatar
```

### 5.5 Module Structure

```
packages/
├── styled/                          # NEW: Token-enforced styled
│   ├── src/
│   │   ├── styled.ts               # Wrapped styled function
│   │   ├── tokens.ts               # Token accessor
│   │   ├── validation.ts           # Runtime validation
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── tokens/                          # NEW: Token type definitions
│   ├── src/
│   │   ├── types.ts                # Token interfaces
│   │   ├── schema.ts               # Zod schemas
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── vite-plugin/                     # NEW: Build validation
│   ├── src/
│   │   ├── index.ts                # Plugin entry
│   │   ├── analyzer.ts             # Code analysis
│   │   ├── reporter.ts             # Report generation
│   │   └── types.ts
│   ├── package.json
│   └── tsconfig.json
│
├── core/                            # EXISTING: Enhanced
│   └── src/
│       ├── tokens.ts               # Token resolution (existing)
│       └── css-generator.ts        # CSS generation (existing)
│
└── ui/                              # EXISTING: Enhanced
    └── src/
        └── primitives/             # Primitive components
```

### 5.6 Usage Example

```typescript
// Example: Creating a Card component with token enforcement

import { styled, tokens } from '@tekton/styled';
import { Box, Text, Heading } from '@tekton/ui';

// Using styled wrapper - tokens enforced
const StyledCard = styled.div`
  background: ${tokens.bg.surface.elevated};
  border-radius: ${tokens.radius.lg};
  padding: ${tokens.spacing[6]};
  box-shadow: ${tokens.shadow.md};

  /* Non-token properties work normally */
  display: flex;
  flex-direction: column;

  /* This would cause TypeScript error:
  background: #ffffff;  <- Error!
  padding: 24px;        <- Error!
  */
`;

// Using primitive components - already token-bound
export function WellnessCard({ title, description }: CardProps) {
  return (
    <StyledCard>
      <Heading level={3}>{title}</Heading>
      <Text color="secondary">{description}</Text>
    </StyledCard>
  );
}
```

### 5.7 Performance Targets

| Operation | Target | Notes |
|-----------|--------|-------|
| TypeScript compilation | < 5s overhead | Additional type checking |
| Build plugin scan | < 10s for 1000 files | Parallel processing |
| Token accessor | < 1ms | Proxy resolution |
| Total build impact | < 15s overhead | Acceptable for enforcement benefit |

### 5.8 Error Code System

| Code | Type | Description |
|------|------|-------------|
| TEK-E001 | ColorViolation | Hardcoded color value detected |
| TEK-E002 | SpacingViolation | Hardcoded spacing value detected |
| TEK-E003 | RadiusViolation | Hardcoded border-radius detected |
| TEK-E004 | ShadowViolation | Hardcoded box-shadow detected |
| TEK-E005 | FontViolation | Hardcoded font value detected |
| TEK-W001 | ThresholdWarning | Compliance below threshold |
| TEK-W002 | ParseWarning | Failed to parse file |

---

## 6. Risks and Mitigations

### 6.1 High Risk

**Risk 1: TypeScript Type Complexity**
- **Likelihood**: MEDIUM
- **Impact**: HIGH
- **Mitigation**: Prototype type definitions early, test with complex templates
- **Contingency**: Fallback to runtime-only validation

**Risk 2: styled-components Compatibility**
- **Likelihood**: LOW
- **Impact**: HIGH
- **Mitigation**: Extensive testing with styled-components v6 features
- **Contingency**: Create minimal styled implementation

### 6.2 Medium Risk

**Risk 3: Build Plugin Performance**
- **Likelihood**: MEDIUM
- **Impact**: MEDIUM
- **Mitigation**: Parallel processing, caching, incremental analysis
- **Contingency**: Make plugin optional for development

**Risk 4: AI Agent Bypass**
- **Likelihood**: MEDIUM
- **Impact**: MEDIUM
- **Mitigation**: MCP server guidance, TypeScript errors, build failures
- **Contingency**: Additional MCP tool restrictions

### 6.3 Low Risk

**Risk 5: Developer Adoption Resistance**
- **Likelihood**: LOW
- **Impact**: MEDIUM
- **Mitigation**: Clear documentation, migration guide, IDE support
- **Contingency**: Gradual rollout, opt-in initially

---

## 7. Traceability

**TAG**: SPEC-STYLED-001

**Dependencies:**
- SPEC-COMPONENT-001 (Token System) - Provides token resolution
- SPEC-THEME-BIND-001 (Theme Binding) - Provides theme context

**Related Assets:**
- `packages/core/src/tokens.ts` - Existing token definitions
- `packages/core/src/css-generator.ts` - CSS generation logic

**Implementation Files:**
- `packages/styled/src/styled.ts` (NEW)
- `packages/styled/src/tokens.ts` (NEW)
- `packages/tokens/src/types.ts` (NEW)
- `packages/vite-plugin/src/index.ts` (NEW)
- `packages/ui/src/primitives/*.tsx` (NEW)

---

**END OF SPEC**
