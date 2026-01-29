# @tekton/tokens

TypeScript token type definitions for Tekton Design System with compile-time enforcement.

## Overview

Provides TypeScript interfaces for design tokens that enforce CSS variable references at compile time.

## Installation

```bash
pnpm add @tekton/tokens
```

## Usage

```typescript
import type { TektonTokens, TokenReference } from '@tekton/tokens';

// TokenReference ensures only CSS variables are allowed
const background: TokenReference = 'var(--tekton-bg-surface-default)';

// TypeScript error: Type '"#ffffff"' is not assignable to type 'TokenReference'
// const invalid: TokenReference = '#ffffff';
```

## Token Categories

- **BgTokens**: Background colors (surface, primary, secondary, etc.)
- **FgTokens**: Foreground/text colors
- **SpacingTokens**: Spacing scale (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24)
- **RadiusTokens**: Border radius (none, sm, md, lg, xl, full)
- **TypographyTokens**: Font families, sizes, weights, line heights
- **ShadowTokens**: Box shadows (none, sm, md, lg, xl)

## SPEC Reference

- [SPEC-STYLED-001](/.moai/specs/SPEC-STYLED-001/spec.md)
- TAG-002: Token Type Definitions

## License

MIT
