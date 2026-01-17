'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import type { ColorToken } from '@tekton/token-contract';
import { colorTokenToCSS, type ColorScaleStep, type SemanticTokenName } from '@/lib/token-editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export interface SemanticTokenCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  name: SemanticTokenName;
  label: string;
  description: string;
  scale: Record<ColorScaleStep, ColorToken>;
  isActive: boolean;
  isRequired: boolean;
  onClick: () => void;
  onRemove?: () => void;
}

const SemanticTokenCard = forwardRef<HTMLDivElement, SemanticTokenCardProps>(
  (
    {
      className,
      name,
      label,
      description,
      scale,
      isActive,
      isRequired,
      onClick,
      onRemove,
      ...props
    },
    ref
  ) => {
    const primaryColor = scale['500'];

    return (
      <Card
        ref={ref}
        className={cn(
          'cursor-pointer transition-all hover:shadow-md',
          isActive && 'ring-2 ring-primary',
          className
        )}
        onClick={onClick}
        {...props}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-6 w-6 rounded-md border"
                style={{
                  backgroundColor: primaryColor
                    ? colorTokenToCSS(primaryColor)
                    : '#ccc',
                }}
              />
              <CardTitle className="text-base">{label}</CardTitle>
            </div>
            {!isRequired && onRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="text-muted-foreground hover:text-destructive p-1 -m-1"
                aria-label={`Remove ${label}`}
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">{description}</p>

          {/* Mini scale preview */}
          <div className="flex rounded overflow-hidden h-4">
            {(['100', '300', '500', '700', '900'] as ColorScaleStep[]).map(
              (step) => {
                const color = scale[step];
                return (
                  <div
                    key={step}
                    className="flex-1"
                    style={{
                      backgroundColor: color ? colorTokenToCSS(color) : '#ccc',
                    }}
                  />
                );
              }
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);
SemanticTokenCard.displayName = 'SemanticTokenCard';

export { SemanticTokenCard };
