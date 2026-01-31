/**
 * @tekton/ui - Textarea Component
 * SPEC-UI-001: shadcn-ui Fork & Token Integration
 */

import * as React from 'react';
import { cn } from '../lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-[var(--tekton-radius-md)] border border-[var(--tekton-border-input)] bg-[var(--tekton-bg-background)] px-[var(--tekton-spacing-3)] py-[var(--tekton-spacing-2)] text-sm ring-offset-[var(--tekton-bg-background)] placeholder:text-[var(--tekton-bg-muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tekton-border-ring)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
