'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import type { VariantConfigurationOption } from '@tekton/archetype-system';
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
          className={cn('text-sm text-muted-foreground py-4', className)}
          {...props}
        >
          No configuration options available for this hook.
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('space-y-4', className)} {...props}>
        {options.map((option) => (
          <div key={option.optionName} className="space-y-2">
            <label className="text-sm font-medium capitalize">
              {option.optionName}
            </label>

            {option.optionType === 'boolean' && (
              <BooleanControl
                value={state[option.optionName] ?? false}
                onChange={(v) => onChange(option.optionName, v)}
              />
            )}

            {option.optionType === 'enum' && (
              <EnumControl
                value={state[option.optionName] ?? option.possibleValues[0]}
                options={option.possibleValues}
                onChange={(v) => onChange(option.optionName, v)}
              />
            )}

            {option.optionType === 'string' && (
              <StringControl
                value={state[option.optionName] ?? ''}
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
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        value ? 'bg-primary' : 'bg-muted'
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
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
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={String(opt)}
          onClick={() => onChange(opt)}
          className={cn(
            'px-3 py-1 rounded-md text-sm transition-colors',
            value === opt
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
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
      className="w-full px-3 py-2 rounded-md border bg-background text-sm"
    />
  );
}

export { StateVariantControls };
