import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface StackProps extends HTMLAttributes<HTMLDivElement> {
    direction?: 'row' | 'col';
    gap?: number | string;
}

const Stack = forwardRef<HTMLDivElement, StackProps>(
    ({ className, direction = 'col', gap, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                'flex',
                direction === 'col' ? 'flex-col' : 'flex-row',
                className
            )}
            {...props}
        />
    )
);
Stack.displayName = 'Stack';

export { Stack };
