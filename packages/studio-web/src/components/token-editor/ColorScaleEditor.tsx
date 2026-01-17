'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import type { ColorToken } from '@tekton/token-contract';
import { COLOR_SCALE_STEPS, colorTokenToCSS, type ColorScaleStep } from '@/lib/token-editor';

export interface ColorScaleEditorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  scale: Record<ColorScaleStep, ColorToken>;
  activeStep: ColorScaleStep | null;
  onChange: (step: ColorScaleStep) => void;
  semanticName: string;
}

const ColorScaleEditor = forwardRef<HTMLDivElement, ColorScaleEditorProps>(
  ({ className, scale, activeStep, onChange, semanticName, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        <div className="text-sm font-medium capitalize">{semanticName}</div>

        {/* Scale visualization */}
        <div className="flex rounded-lg overflow-hidden border">
          {COLOR_SCALE_STEPS.map((step) => {
            const color = scale[step];
            const isActive = activeStep === step;

            return (
              <button
                key={step}
                onClick={() => onChange(step)}
                className={cn(
                  'flex-1 h-12 relative transition-all',
                  'focus:outline-none focus:z-10',
                  isActive && 'ring-2 ring-primary ring-offset-2 z-10'
                )}
                style={{ backgroundColor: color ? colorTokenToCSS(color) : '#ccc' }}
                title={`${semanticName}-${step}`}
              >
                <span className="sr-only">{step}</span>
              </button>
            );
          })}
        </div>

        {/* Step labels */}
        <div className="flex text-xs text-muted-foreground">
          {COLOR_SCALE_STEPS.map((step) => (
            <div
              key={step}
              className={cn(
                'flex-1 text-center',
                activeStep === step && 'font-medium text-foreground'
              )}
            >
              {step}
            </div>
          ))}
        </div>
      </div>
    );
  }
);
ColorScaleEditor.displayName = 'ColorScaleEditor';

export { ColorScaleEditor };
