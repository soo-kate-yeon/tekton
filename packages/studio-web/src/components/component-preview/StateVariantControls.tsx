'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import type { VariantConfigurationOption } from '@tekton/component-system';
import type { ComponentState } from '@/lib/component-preview';

type StateValue = string | number | boolean | null | undefined;

export interface StateVariantControlsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: VariantConfigurationOption[];
  state: ComponentState;
  onChange: (key: string, value: StateValue) => void;
}

const StateVariantControls = forwardRef<HTMLDivElement, StateVariantControlsProps>(
  ({ className, options, state, onChange, ...props }, ref) => {
    if (options.length === 0) {
      return (
        <div
          ref={ref}
          className={cn('py-6 text-center', className)}
          {...props}
        >
          <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-5 h-5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">
            No configuration options available
          </p>
        </div>
      );
    }

    // Type-safe value getters
    const getBoolValue = (key: string): boolean => {
      const v = state[key];
      return typeof v === 'boolean' ? v : false;
    };

    const getStringValue = (key: string, fallback: string | number | boolean = ''): string => {
      const v = state[key];
      return v !== null && v !== undefined ? String(v) : String(fallback);
    };

    return (
      <div ref={ref} className={cn('space-y-5', className)} {...props}>
        {options.map((option) => (
          <div key={option.optionName} className="space-y-2.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
              {option.optionName}
            </label>

            {option.optionType === 'boolean' && (
              <BooleanControl
                value={getBoolValue(option.optionName)}
                onChange={(v) => onChange(option.optionName, v)}
              />
            )}

            {option.optionType === 'enum' && (
              <EnumControl
                value={getStringValue(option.optionName, option.possibleValues[0])}
                options={option.possibleValues}
                onChange={(v) => onChange(option.optionName, v)}
              />
            )}

            {option.optionType === 'string' && (
              <StringControl
                value={getStringValue(option.optionName)}
                onChange={(v) => onChange(option.optionName, v)}
              />
            )}
          </div>
        ))}
      </div>
    );
  }
);
StateVariantControls.displayName = 'StateVariantControls';

interface BooleanControlProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

function BooleanControl({ value, onChange }: BooleanControlProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200',
        value ? 'bg-primary' : 'bg-muted/80'
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200',
          value ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  );
}

interface EnumControlProps {
  value: string;
  options: (string | number | boolean)[];
  onChange: (value: string) => void;
}

function EnumControl({ value, options, onChange }: EnumControlProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={String(opt)}
          onClick={() => onChange(String(opt))}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
            value === String(opt)
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
          )}
        >
          {String(opt)}
        </button>
      ))}
    </div>
  );
}

interface StringControlProps {
  value: string;
  onChange: (value: string) => void;
}

function StringControl({ value, onChange }: StringControlProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg border border-border/50 bg-muted/30 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
      placeholder="Enter value..."
    />
  );
}

export { StateVariantControls };
