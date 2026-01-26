/**
 * @tekton/ui - Button Component
 * [SPEC-COMPONENT-001-C] [PRIMITIVE]
 */

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
          'hover:bg-[var(--button-outline-hover-background)] ' +
          'hover:text-[var(--button-outline-hover-foreground)]',
        link: 'text-[var(--button-link-foreground)] ' + 'underline-offset-4 hover:underline',
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
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
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
    { className, variant, size, asChild = false, loading = false, children, disabled, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    // Wrap children with loading spinner to maintain single child for Slot
    const content = loading ? (
      <>
        <span
          className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
        {children}
      </>
    ) : (
      children
    );

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
