/**
 * @tekton/ui - Link Component
 * [SPEC-COMPONENT-001-C] [PRIMITIVE]
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const linkVariants = cva(
  'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'text-[var(--link-foreground)] hover:text-[var(--link-hover-foreground)] underline-offset-4 hover:underline',
        muted:
          'text-[var(--link-muted-foreground)] hover:text-[var(--link-muted-hover-foreground)] underline-offset-4 hover:underline',
        subtle:
          'text-[var(--link-subtle-foreground)] hover:text-[var(--link-subtle-hover-foreground)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof linkVariants> {}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, ...props }, ref) => {
    return <a className={cn(linkVariants({ variant, className }))} ref={ref} {...props} />;
  }
);
Link.displayName = 'Link';

export { Link, linkVariants };
