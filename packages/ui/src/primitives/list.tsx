/**
 * @tekton/ui - List Component
 * [SPEC-COMPONENT-001-C] [PRIMITIVE]
 */

import * as React from 'react';
import { cn } from '../lib/utils';

const List = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement> & { ordered?: boolean }
>(({ className, ordered = false, ...props }, ref) => {
  const Comp = ordered ? 'ol' : 'ul';

  return (
    <Comp
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={cn(
        'space-y-2',
        ordered ? 'list-decimal' : 'list-disc',
        'pl-6',
        'text-[var(--list-foreground)]',
        className
      )}
      {...props}
    />
  );
});
List.displayName = 'List';

const ListItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => {
    return (
      <li ref={ref} className={cn('text-[var(--list-item-foreground)]', className)} {...props} />
    );
  }
);
ListItem.displayName = 'ListItem';

export { List, ListItem };
