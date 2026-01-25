---
id: SPEC-COMPONENT-001-C
parent: SPEC-COMPONENT-001
version: "1.0.0"
status: "planned"
created: "2026-01-25"
updated: "2026-01-25"
author: "MoAI-ADK"
priority: "HIGH"
lifecycle: "spec-anchored"
tags: ["SPEC-COMPONENT-001-C", "Reference-Implementation", "Tekton-UI", "Tier-1"]
---

## HISTORY
- 2026-01-25 v1.0.0: Initial sub-SPEC creation - @tekton/ui Reference Implementation Library

---

# SPEC-COMPONENT-001-C: @tekton/ui Reference Implementation Library

## Executive Summary

**Purpose**: Build a high-quality reference implementation library (@tekton/ui) containing all 20 core components (Tier 1) with CSS Variables theming, Radix primitives, and WCAG 2.1 AA compliance.

**Scope**: Design and implement:
1. @tekton/ui package structure
2. 20 core component implementations
3. CSS Variables integration
4. Radix UI primitive wrappers
5. CVA-based variant management
6. Accessibility compliance (WCAG 2.1 AA)
7. Comprehensive test coverage

**Priority**: HIGH - Reference implementations set quality baseline for entire system.

**Impact**: Provides production-ready components that:
- Guarantee 100% quality for Tier 1 components
- Serve as few-shot examples for LLM generation
- Enable copy-paste component export
- Demonstrate proper token binding patterns

**Key Design Decisions**:
- **shadcn-Inspired**: Component API and structure follow shadcn/ui patterns
- **CSS Variables First**: All theming through CSS Variables, zero hardcoded colors
- **Radix Foundation**: Built on Radix primitives for accessibility
- **CVA Variants**: Type-safe variant management with class-variance-authority
- **Copy-Ready**: Components designed to be copied directly to user projects

---

## ENVIRONMENT

### Current System Context

**Gap Analysis:**
- ❌ No @tekton/ui package exists
- ❌ No reference component implementations
- ❌ No CSS Variables integration examples
- ❌ No Radix primitive wrappers

**Target Package Structure:**
```
packages/ui/
├── src/
│   ├── primitives/         # Atomic components (Button, Input, etc.)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── checkbox.tsx
│   │   ├── radio.tsx
│   │   ├── switch.tsx
│   │   ├── slider.tsx
│   │   ├── text.tsx
│   │   ├── heading.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── progress.tsx
│   │   ├── link.tsx
│   │   ├── list.tsx
│   │   └── image.tsx
│   │
│   ├── components/         # Composed components
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   ├── modal.tsx
│   │   ├── dropdown.tsx
│   │   ├── tabs.tsx
│   │   └── table.tsx
│   │
│   ├── lib/
│   │   └── utils.ts        # cn(), variant helpers
│   │
│   └── index.ts
│
├── styles/
│   └── tokens.css          # CSS Variables template
│
├── __tests__/
│   ├── primitives/
│   ├── components/
│   └── accessibility.test.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

**Technology Stack:**
- **Runtime**: React 19, TypeScript 5.7+
- **Primitives**: Radix UI v1.0+
- **Styling**: Tailwind CSS 4.x + CSS Variables
- **Variants**: class-variance-authority (CVA)
- **Utilities**: clsx, tailwind-merge
- **Testing**: Vitest, @testing-library/react, @axe-core/react
- **Accessibility**: WCAG 2.1 AA compliance

---

## ASSUMPTIONS

### Technical Assumptions

**A-002: Radix Primitives Stability**
- **Assumption**: Radix UI primitives provide stable, accessible component foundations
- **Confidence**: HIGH
- **Evidence**: Used by shadcn/ui, Vercel, major design systems
- **Risk if Wrong**: Alternative headless library or custom implementation
- **Validation**: Radix version pinning, integration tests

**A-008: Tailwind CSS + CSS Variables Compatibility**
- **Assumption**: Tailwind CSS arbitrary values (`bg-[--button-bg]`) work reliably
- **Confidence**: HIGH
- **Evidence**: Tailwind v3.0+ supports arbitrary values with CSS Variables
- **Risk if Wrong**: Use Tailwind theme extension instead
- **Validation**: Build-time CSS generation tests

---

## REQUIREMENTS

### Ubiquitous Requirements (Always Active)

**U-004: Reference Implementation Quality**
- The system **shall** provide Tier 1 components that pass accessibility (WCAG 2.1 AA), TypeScript strict mode, and ESLint rules.
- **Rationale**: Reference implementations set quality baseline for entire system.
- **Test Strategy**: Accessibility audits with axe-core, linting, type checking, visual regression tests.

### Unwanted Behaviors (Prohibited Actions)

**UW-001: No Hardcoded Colors**
- The system **shall not** include hardcoded color values in component implementations; all colors must reference CSS Variables.
- **Rationale**: Hardcoded colors break theming.
- **Test Strategy**: Code scanning for color literals (`#`, `rgb`, `hsl`), CSS Variable usage audit.

**UW-002: No Component-Specific Theme Code**
- The system **shall not** require theme-specific code within components; theming must be purely CSS Variable based.
- **Rationale**: Components must remain theme-agnostic.
- **Test Strategy**: Component code review, no theme imports in components.

**UW-003: No Inline Styles for Themeable Properties**
- The system **shall not** use inline styles for properties that should be themeable (colors, spacing, typography).
- **Rationale**: Inline styles prevent CSS Variable theming.
- **Test Strategy**: Inline style audit, Tailwind/CSS Variable usage verification.

---

## SPECIFICATIONS

### Package Configuration

```json
// packages/ui/package.json
{
  "name": "@tekton/ui",
  "version": "0.1.0",
  "description": "Tekton UI Reference Component Library",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles": "./styles/tokens.css"
  },
  "scripts": {
    "build": "tsup src/index.ts --format esm --dts",
    "test": "vitest",
    "test:a11y": "vitest accessibility",
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-progress": "^1.0.3",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.0.0",
    "@axe-core/react": "^4.8.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.7.0",
    "vitest": "^1.0.0",
    "tsup": "^8.0.0"
  }
}
```

### Component Implementation Examples

#### Button Component (Primitive)

```typescript
// packages/ui/src/primitives/button.tsx

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

/**
 * Button variants using CSS Variables for all themeable properties
 * Structure: fixed, Colors: CSS Variables
 */
const buttonVariants = cva(
  // Base styles (layout, transitions, accessibility)
  'inline-flex items-center justify-center whitespace-nowrap font-medium ' +
  'transition-colors focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // All colors via CSS Variables (--{component}-{variant}-{property})
        default:
          'bg-[var(--button-default-background)] ' +
          'text-[var(--button-default-foreground)] ' +
          'border border-[var(--button-default-border)] ' +
          'hover:bg-[var(--button-default-hover-background)]',
        secondary:
          'bg-[var(--button-secondary-background)] ' +
          'text-[var(--button-secondary-foreground)] ' +
          'hover:bg-[var(--button-secondary-hover-background)]',
        ghost:
          'hover:bg-[var(--button-ghost-hover-background)] ' +
          'hover:text-[var(--button-ghost-hover-foreground)]',
        destructive:
          'bg-[var(--button-destructive-background)] ' +
          'text-[var(--button-destructive-foreground)] ' +
          'hover:bg-[var(--button-destructive-hover-background)]',
        outline:
          'border border-[var(--button-outline-border)] ' +
          'bg-transparent ' +
          'hover:bg-[var(--button-outline-hover-background)]',
        link:
          'text-[var(--button-link-foreground)] ' +
          'underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2 rounded-[var(--radius-md)]',
        sm: 'h-9 px-3 rounded-[var(--radius-sm)] text-sm',
        lg: 'h-11 px-8 rounded-[var(--radius-md)]',
        icon: 'h-10 w-10 rounded-[var(--radius-md)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Merge props with child element (Radix Slot pattern)
   */
  asChild?: boolean;
  /**
   * Loading state with spinner
   */
  loading?: boolean;
}

/**
 * Button component following SPEC-COMPONENT-001-B schema
 * - CSS Variables theming
 * - Radix Slot for composition
 * - CVA for type-safe variants
 * - WCAG 2.1 AA compliant
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span
            className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

#### Input Component (Primitive)

```typescript
// packages/ui/src/primitives/input.tsx

import * as React from 'react';
import { cn } from '../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Error state for validation
   */
  error?: boolean;
}

/**
 * Input component following SPEC-COMPONENT-001-B schema
 * - CSS Variables theming
 * - Error state styling
 * - WCAG 2.1 AA compliant
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error = false, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          'flex h-10 w-full rounded-[var(--radius-md)] px-3 py-2 text-sm',
          'transition-colors',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-[var(--input-placeholder)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          // Themeable properties via CSS Variables
          'bg-[var(--input-background)]',
          'text-[var(--input-foreground)]',
          'border border-[var(--input-border)]',
          // Error state
          error
            ? 'border-[var(--input-error-border)] focus-visible:ring-[var(--input-error-ring)]'
            : 'focus-visible:ring-[var(--input-focus-ring)]',
          className
        )}
        ref={ref}
        aria-invalid={error}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
```

#### Card Component (Composed)

```typescript
// packages/ui/src/components/card.tsx

import * as React from 'react';
import { cn } from '../lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-[var(--radius-md)] p-6',
        'bg-[var(--card-background)]',
        'text-[var(--card-foreground)]',
        'border border-[var(--card-border)]',
        'shadow-[var(--card-shadow)]',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-[var(--foreground-muted)]', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

### Utility Functions

```typescript
// packages/ui/src/lib/utils.ts

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper precedence
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### CSS Variables Template

```css
/* packages/ui/styles/tokens.css */

/**
 * Tekton UI Token Variables Template
 * Generated by: SPEC-COMPONENT-001-A CSS Generator
 * This file is a template showing expected CSS Variable structure
 */

:root {
  /* === Layer 1: Atomic Tokens === */
  /* Colors */
  --color-primary-500: #3b82f6;
  --color-neutral-50: #f9fafb;
  --color-neutral-100: #f3f4f6;
  /* ... */

  /* Spacing */
  --spacing-1: 4px;
  --spacing-2: 8px;
  /* ... */

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* === Layer 2: Semantic Tokens === */
  --background-page: var(--color-neutral-50);
  --foreground-primary: var(--color-neutral-900);
  --border-default: var(--color-neutral-200);
  /* ... */

  /* === Layer 3: Component Tokens === */
  /* Button */
  --button-default-background: var(--color-primary-500);
  --button-default-foreground: white;
  --button-default-border: transparent;
  --button-default-hover-background: var(--color-primary-600);

  /* Input */
  --input-background: white;
  --input-foreground: var(--foreground-primary);
  --input-border: var(--border-default);
  --input-placeholder: var(--foreground-muted);
  --input-focus-ring: var(--color-primary-500);
  --input-error-border: var(--color-red-500);
  --input-error-ring: var(--color-red-500);

  /* Card */
  --card-background: white;
  --card-foreground: var(--foreground-primary);
  --card-border: var(--border-default);
  --card-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  /* ... */
}

.dark {
  /* Dark mode overrides */
  --background-page: var(--color-neutral-900);
  --foreground-primary: var(--color-neutral-50);
  /* ... */
}
```

### Testing Strategy

```typescript
// packages/ui/__tests__/primitives/button.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../../src/primitives/button';

expect.extend(toHaveNoViolations);

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies variant classes', () => {
    const { container } = render(<Button variant="secondary">Test</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-[var(--button-secondary-background)]');
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick handler', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Accessible</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard interaction', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Keyboard</Button>);

    const button = screen.getByRole('button');
    button.focus();
    await userEvent.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalled();
  });
});
```

---

## TRACEABILITY

### Requirements to Implementation Mapping

| Requirement | Implementation File | Test File |
|-------------|---------------------|-----------|
| U-004 | `ui/src/primitives/*.tsx` | `ui/__tests__/accessibility.test.ts` |
| UW-001 | All component files | `ui/__tests__/no-hardcoded-colors.test.ts` |
| UW-002 | All component files | `ui/__tests__/theme-agnostic.test.ts` |
| UW-003 | All component files | `ui/__tests__/no-inline-styles.test.ts` |

### SPEC Tags for Implementation

- **[SPEC-COMPONENT-001-C]**: @tekton/ui implementation
- **[TIER-1-IMPL]**: Reference component code
- **[CSS-VAR-BINDING]**: CSS Variables integration
- **[A11Y-IMPL]**: Accessibility implementation

---

## DEPENDENCIES

### Internal Dependencies
- **SPEC-COMPONENT-001-A**: Uses token type definitions
- **SPEC-COMPONENT-001-B**: Implements component schemas

### External Dependencies
- **@radix-ui/react-***: Headless UI primitives
- **class-variance-authority**: ^0.7.0
- **clsx**: ^2.1.0
- **tailwind-merge**: ^2.2.0
- **Tailwind CSS**: ^4.0.0

### Dependents (Blocks)
- **SPEC-COMPONENT-001-D**: Uses components for Tier 1 export

---

## RISK ANALYSIS

### High-Risk Areas

**Risk 1: CSS Variables Browser Support Edge Cases**
- **Likelihood**: LOW
- **Impact**: MEDIUM
- **Mitigation**: Fallback values in CSS, browser testing
- **Contingency**: Polyfill or CSS-in-JS fallback

**Risk 2: Radix API Changes**
- **Likelihood**: LOW
- **Impact**: MEDIUM
- **Mitigation**: Version pinning, update tests
- **Contingency**: Adapter layer for API changes

---

## SUCCESS CRITERIA

### Implementation Success
- [ ] All 20 components implemented and exported
- [ ] CSS Variables used for all themeable properties
- [ ] Zero hardcoded color values
- [ ] Radix primitives integrated where applicable

### Quality Success
- [ ] All components pass WCAG 2.1 AA accessibility audit
- [ ] TypeScript strict mode compliance
- [ ] Test coverage >= 90%
- [ ] Zero ESLint errors
- [ ] Visual regression tests passing

### Integration Success
- [ ] Components render correctly with theme CSS
- [ ] Theme switching works without remounting
- [ ] Dark mode toggle works seamlessly
- [ ] Components work in Next.js 15+ App Router

---

## REFERENCES

- [shadcn/ui](https://ui.shadcn.com/) - Reference component patterns
- [Radix UI](https://www.radix-ui.com/) - Headless primitives
- [CVA](https://cva.style/) - Variant management
- [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility guidelines

---

**Last Updated**: 2026-01-25
**Status**: Planned
**Version**: 1.0.0
**Parent SPEC**: SPEC-COMPONENT-001
**Depends On**: SPEC-COMPONENT-001-A, SPEC-COMPONENT-001-B
**Next Steps**: /moai:2-run SPEC-COMPONENT-001-C after SPEC-001-B completion
