/**
 * @tekton/ui - Skeleton Component
 * SPEC-UI-001: shadcn-ui Fork & Token Integration
 */

import { cn } from '../lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-[var(--tekton-radius-md)] bg-[var(--tekton-bg-muted)]', className)}
      {...props}
    />
  );
}

export { Skeleton };
