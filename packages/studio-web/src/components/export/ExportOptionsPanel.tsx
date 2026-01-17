'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import type { ExportFormat } from '@/hooks/useExport';

export interface ExportOptionsPanelProps extends HTMLAttributes<HTMLDivElement> {
  format: ExportFormat;
  includeDarkMode: boolean;
  onIncludeDarkModeChange: (value: boolean) => void;
  minify: boolean;
  onMinifyChange: (value: boolean) => void;
  includeTypes: boolean;
  onIncludeTypesChange: (value: boolean) => void;
  prettyPrint: boolean;
  onPrettyPrintChange: (value: boolean) => void;
}

const ExportOptionsPanel = forwardRef<HTMLDivElement, ExportOptionsPanelProps>(
  (
    {
      className,
      format,
      includeDarkMode,
      onIncludeDarkModeChange,
      minify,
      onMinifyChange,
      includeTypes,
      onIncludeTypesChange,
      prettyPrint,
      onPrettyPrintChange,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn('space-y-4 rounded-lg border p-4', className)}
        {...props}
      >
        <h3 className="font-medium">Export Options</h3>

        <div className="space-y-3">
          {/* CSS-specific options */}
          {format === 'css' && (
            <>
              <ToggleOption
                id="dark-mode"
                label="Include dark mode"
                description="Generate CSS for both light and dark themes"
                checked={includeDarkMode}
                onChange={onIncludeDarkModeChange}
              />
              <ToggleOption
                id="minify"
                label="Minify output"
                description="Remove whitespace for smaller file size"
                checked={minify}
                onChange={onMinifyChange}
              />
            </>
          )}

          {/* JSON-specific options */}
          {format === 'json' && (
            <ToggleOption
              id="pretty-print"
              label="Pretty print"
              description="Format JSON with indentation"
              checked={prettyPrint}
              onChange={onPrettyPrintChange}
            />
          )}

          {/* StyleSheet-specific options */}
          {format === 'stylesheet' && (
            <ToggleOption
              id="include-types"
              label="Include TypeScript types"
              description="Add type definitions for color tokens"
              checked={includeTypes}
              onChange={onIncludeTypesChange}
            />
          )}
        </div>
      </div>
    );
  }
);
ExportOptionsPanel.displayName = 'ExportOptionsPanel';

interface ToggleOptionProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleOption({
  id,
  label,
  description,
  checked,
  onChange,
}: ToggleOptionProps) {
  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
      />
      <div className="flex-1">
        <label htmlFor={id} className="text-sm font-medium cursor-pointer">
          {label}
        </label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export { ExportOptionsPanel };
