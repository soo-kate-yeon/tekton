'use client';

import { forwardRef, type HTMLAttributes, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import type { ColorToken } from '@tekton/token-contract';
import { OKLCH_BOUNDS, colorTokenToCSS, oklchToHex } from '@/lib/token-editor';

export interface OKLCHColorPickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: ColorToken;
  onChange: (color: ColorToken) => void;
  label?: string;
  showHex?: boolean;
}

const OKLCHColorPicker = forwardRef<HTMLDivElement, OKLCHColorPickerProps>(
  ({ className, value, onChange, label, showHex = true, ...props }, ref) => {
    const handleChange = useCallback(
      (key: keyof ColorToken, newValue: number) => {
        onChange({ ...value, [key]: newValue });
      },
      [value, onChange]
    );

    const cssString = colorTokenToCSS(value);
    const hexString = oklchToHex(value);

    return (
      <div ref={ref} className={cn('space-y-4', className)} {...props}>
        {label && (
          <div className="text-sm font-medium">{label}</div>
        )}

        {/* Color Preview */}
        <div className="flex gap-4 items-center">
          <div
            className="h-16 w-16 rounded-lg border shadow-inner"
            style={{ backgroundColor: cssString }}
          />
          <div className="flex-1 space-y-1">
            <div className="font-mono text-sm">{cssString}</div>
            {showHex && (
              <div className="font-mono text-xs text-muted-foreground">
                {hexString}
              </div>
            )}
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-3">
          {/* Lightness */}
          <SliderControl
            label="Lightness"
            value={value.l}
            min={OKLCH_BOUNDS.l.min}
            max={OKLCH_BOUNDS.l.max}
            step={OKLCH_BOUNDS.l.step}
            onChange={(v) => handleChange('l', v)}
            formatValue={(v) => `${Math.round(v * 100)}%`}
            gradient={`linear-gradient(to right,
              oklch(0 ${value.c} ${value.h}),
              oklch(0.5 ${value.c} ${value.h}),
              oklch(1 ${value.c} ${value.h}))`}
          />

          {/* Chroma */}
          <SliderControl
            label="Chroma"
            value={value.c}
            min={OKLCH_BOUNDS.c.min}
            max={OKLCH_BOUNDS.c.max}
            step={OKLCH_BOUNDS.c.step}
            onChange={(v) => handleChange('c', v)}
            formatValue={(v) => v.toFixed(2)}
            gradient={`linear-gradient(to right,
              oklch(${value.l} 0 ${value.h}),
              oklch(${value.l} 0.2 ${value.h}),
              oklch(${value.l} 0.4 ${value.h}))`}
          />

          {/* Hue */}
          <SliderControl
            label="Hue"
            value={value.h}
            min={OKLCH_BOUNDS.h.min}
            max={OKLCH_BOUNDS.h.max}
            step={OKLCH_BOUNDS.h.step}
            onChange={(v) => handleChange('h', v)}
            formatValue={(v) => `${Math.round(v)}°`}
            gradient={`linear-gradient(to right,
              oklch(${value.l} ${value.c} 0),
              oklch(${value.l} ${value.c} 60),
              oklch(${value.l} ${value.c} 120),
              oklch(${value.l} ${value.c} 180),
              oklch(${value.l} ${value.c} 240),
              oklch(${value.l} ${value.c} 300),
              oklch(${value.l} ${value.c} 360))`}
          />
        </div>
      </div>
    );
  }
);
OKLCHColorPicker.displayName = 'OKLCHColorPicker';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
  gradient: string;
}

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  gradient,
}: SliderControlProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono">{formatValue(value)}</span>
      </div>
      <div className="relative">
        <div
          className="absolute inset-0 rounded-full h-2 top-1/2 -translate-y-1/2"
          style={{ background: gradient }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="relative w-full h-2 bg-transparent appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-gray-400
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-gray-400
            [&::-moz-range-thumb]:shadow-md
            [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>
    </div>
  );
}

export { OKLCHColorPicker };
