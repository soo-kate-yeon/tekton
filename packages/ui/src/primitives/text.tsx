/**
 * @tekton/ui - Text Component
 * [SPEC-COMPONENT-001-C] [PRIMITIVE]
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const textVariants = cva('', {
  variants: {
    variant: {
      body: 'text-[var(--text-body-color)]',
      caption: 'text-[var(--text-caption-color)]',
      label: 'text-[var(--text-label-color)]',
      code: 'font-mono text-[var(--text-code-color)]',
    },
    size: {
      sm: 'text-sm',
      default: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'body',
    size: 'default',
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof textVariants> {
  as?: 'span' | 'p' | 'div';
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, variant, size, as: Comp = 'span', ...props }, ref) => {
    return (
      <Comp
        className={cn(textVariants({ variant, size, className }))}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        {...props}
      />
    );
  }
);
Text.displayName = 'Text';

export { Text, textVariants };
