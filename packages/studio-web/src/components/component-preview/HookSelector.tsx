'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { HOOK_METADATA, type HookName, type HookMeta } from '@/lib/component-preview';

export interface HookSelectorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: HookName | null;
  onChange: (hookName: HookName) => void;
}

const HookSelector = forwardRef<HTMLDivElement, HookSelectorProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const categories = [
      { key: 'form', label: 'Form' },
      { key: 'complex', label: 'Complex' },
      { key: 'overlay', label: 'Overlay' },
      { key: 'display', label: 'Display' },
    ] as const;

    const hooksByCategory = HOOK_METADATA.reduce((acc, hook) => {
      if (!acc[hook.category]) {
        acc[hook.category] = [];
      }
      acc[hook.category].push(hook);
      return acc;
    }, {} as Record<string, HookMeta[]>);

    return (
      <div ref={ref} className={cn('space-y-4', className)} {...props}>
        {categories.map((cat) => (
          <div key={cat.key}>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              {cat.label}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {hooksByCategory[cat.key]?.map((hook) => (
                <button
                  key={hook.name}
                  onClick={() => onChange(hook.name)}
                  className={cn(
                    'px-3 py-2 rounded-md text-left text-sm transition-colors',
                    'hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring',
                    value === hook.name
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50'
                  )}
                >
                  <div className="font-medium">{hook.label}</div>
                  <div className="text-xs opacity-70 truncate">
                    {hook.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
);
HookSelector.displayName = 'HookSelector';

export { HookSelector };
