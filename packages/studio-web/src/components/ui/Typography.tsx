import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface TypographyProps extends HTMLAttributes<HTMLElement> {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption';
    text?: string;
}

const Typography = forwardRef<HTMLElement, TypographyProps>(
    ({ className, variant = 'body1', text, children, ...props }, ref) => {
        const Component = variant.startsWith('h') ? (variant as 'h1' | 'h2' | 'h3' | 'h4') : 'p';

        const variants = {
            h1: 'text-4xl font-bold tracking-tight',
            h2: 'text-3xl font-semibold tracking-tight',
            h3: 'text-2xl font-semibold tracking-tight',
            h4: 'text-xl font-semibold tracking-tight',
            body1: 'text-base leading-7',
            body2: 'text-sm leading-6',
            caption: 'text-xs leading-5 text-muted-foreground',
        };

        return (
            <Component
                ref={ref as any}
                className={cn(variants[variant], className)}
                {...props}
            >
                {text || children}
            </Component>
        );
    }
);
Typography.displayName = 'Typography';

export { Typography };
