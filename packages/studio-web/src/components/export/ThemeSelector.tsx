'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import type { PresetName } from '@tekton/token-contract';

interface PresetOption {
  name: PresetName;
  label: string;
  description: string;
}

const PRESET_OPTIONS: PresetOption[] = [
  { name: 'professional', label: 'Professional', description: 'Corporate and SaaS' },
  { name: 'creative', label: 'Creative', description: 'Bold and artistic' },
  { name: 'minimal', label: 'Minimal', description: 'Clean and simple' },
  { name: 'bold', label: 'Bold', description: 'High impact' },
  { name: 'warm', label: 'Warm', description: 'Friendly and inviting' },
  { name: 'cool', label: 'Cool', description: 'Modern and calm' },
  { name: 'high-contrast', label: 'High Contrast', description: 'Maximum accessibility' },
];

export interface ThemeSelectorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: PresetName | null;
  onChange: (preset: PresetName) => void;
}

const PresetSelector = forwardRef<HTMLDivElement, ThemeSelectorProps>(
  ({ className, value, onChange, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('space-y-2', className)}
        {...props}
      >
        <label className="text-sm font-medium">Select Preset</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {PRESET_OPTIONS.map((option) => (
            <button
              key={option.name}
              onClick={() => onChange(option.name)}
              className={cn(
                'rounded-lg border px-3 py-2 text-left transition-colors',
                'hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                value === option.name
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-background'
              )}
            >
              <div className="text-sm font-medium">{option.label}</div>
              <div className="text-xs text-muted-foreground">
                {option.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }
);
PresetSelector.displayName = 'PresetSelector';

export { PresetSelector, PRESET_OPTIONS };
