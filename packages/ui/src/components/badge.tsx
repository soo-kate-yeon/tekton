/**
 * @tekton/ui - Badge Component
 * SPEC-UI-001: shadcn-ui Fork & Token Integration
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-[var(--tekton-radius-full)] border px-[var(--tekton-spacing-3)] py-[var(--tekton-spacing-1)] text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--tekton-border-ring)] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--tekton-bg-primary)] text-[var(--tekton-bg-primary-foreground)] hover:bg-[var(--tekton-bg-primary)]/80',
        secondary:
          'border-transparent bg-[var(--tekton-bg-secondary)] text-[var(--tekton-bg-secondary-foreground)] hover:bg-[var(--tekton-bg-secondary)]/80',
        destructive:
          'border-transparent bg-[var(--tekton-bg-destructive)] text-[var(--tekton-bg-destructive-foreground)] hover:bg-[var(--tekton-bg-destructive)]/80',
        outline: 'text-[var(--tekton-bg-foreground)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
