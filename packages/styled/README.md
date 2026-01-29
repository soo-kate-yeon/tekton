# @tekton/styled

Token-enforced styled-components wrapper with compile-time and runtime validation.

## Overview

Drop-in replacement for styled-components that enforces design token usage and rejects hardcoded CSS values.

## Installation

```bash
pnpm add @tekton/styled styled-components
```

## Usage

```typescript
import { styled, tokens } from '@tekton/styled';

// ✅ Valid: Using tokens
const Card = styled.div`
  background: ${tokens.bg.surface.elevated};
  padding: ${tokens.spacing[6]};
  border-radius: ${tokens.radius.lg};
  box-shadow: ${tokens.shadow.md};
`;

// ❌ Invalid: Hardcoded values throw runtime errors
const Bad = styled.div`
  background: #ffffff; // Error: Hardcoded value detected
  padding: 16px; // Error: Hardcoded value detected
`;

// ✅ Valid: Non-token properties work normally
const Layout = styled.div`
  display: flex;
  flex-direction: column;
  background: ${tokens.bg.surface.default};
`;
```

## Token Accessor

The `tokens` accessor provides IDE autocomplete and returns CSS variable references:

```typescript
tokens.bg.surface.default; // → 'var(--tekton-bg-surface-default)'
tokens.spacing[4]; // → 'var(--tekton-spacing-4)'
tokens.fg.primary; // → 'var(--tekton-fg-primary)'
```

## Features

- **Compile-time Type Safety**: TypeScript enforces token types
- **Runtime Validation**: Detects hardcoded colors and spacing values
- **IDE Autocomplete**: Full IntelliSense support for tokens
- **styled-components Compatible**: Works with all styled-components features
- **Error Messages**: Clear, actionable error messages with suggestions

## Requirements

- REQ-STY-001: Reject hardcoded colors (#fff, rgb(), hsl(), etc.)
- REQ-STY-002: Reject hardcoded spacing (16px, 2rem, etc.)
- REQ-STY-003: Provide IDE autocomplete
- REQ-STY-013: Allow non-token properties (display, position, etc.)

## SPEC Reference

- [SPEC-STYLED-001](/.moai/specs/SPEC-STYLED-001/spec.md)
- TAG-003: Token Accessor
- TAG-004: Styled Wrapper Core
- TAG-005: Runtime Validation

## License

MIT
