/**
 * @tekton/ui - Heading Component
 * [SPEC-COMPONENT-001-C] [PRIMITIVE]
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const headingVariants = cva('font-semibold tracking-tight', {
  variants: {
    level: {
      1: 'text-4xl lg:text-5xl',
      2: 'text-3xl lg:text-4xl',
      3: 'text-2xl lg:text-3xl',
      4: 'text-xl lg:text-2xl',
      5: 'text-lg lg:text-xl',
      6: 'text-base lg:text-lg',
    },
  },
  defaultVariants: {
    level: 1,
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 1, ...props }, ref) => {
    const Comp = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

    return (
      <Comp
        className={cn(headingVariants({ level, className }), 'text-[var(--heading-foreground)]')}
        ref={ref}
        {...props}
      />
    );
  }
);
Heading.displayName = 'Heading';

export { Heading, headingVariants };
