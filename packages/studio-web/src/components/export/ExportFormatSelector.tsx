'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import type { ExportFormat } from '@/hooks/useExport';

interface FormatOption {
  value: ExportFormat;
  label: string;
  description: string;
}

const FORMAT_OPTIONS: FormatOption[] = [
  {
    value: 'css',
    label: 'CSS',
    description: 'CSS custom properties for web',
  },
  {
    value: 'json',
    label: 'JSON',
    description: 'Structured token data',
  },
  {
    value: 'stylesheet',
    label: 'StyleSheet',
    description: 'React Native compatible',
  },
];

export interface ExportFormatSelectorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: ExportFormat;
  onChange: (format: ExportFormat) => void;
}

const ExportFormatSelector = forwardRef<HTMLDivElement, ExportFormatSelectorProps>(
  ({ className, value, onChange, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex gap-2', className)}
        role="tablist"
        aria-label="Export format"
        {...props}
      >
        {FORMAT_OPTIONS.map((option) => (
          <button
            key={option.value}
            role="tab"
            aria-selected={value === option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex-1 rounded-lg border px-4 py-3 text-left transition-colors',
              'hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              value === option.value
                ? 'border-primary bg-primary/5'
                : 'border-border bg-background'
            )}
          >
            <div className="font-medium">{option.label}</div>
            <div className="text-xs text-muted-foreground">
              {option.description}
            </div>
          </button>
        ))}
      </div>
    );
  }
);
ExportFormatSelector.displayName = 'ExportFormatSelector';

export { ExportFormatSelector };
