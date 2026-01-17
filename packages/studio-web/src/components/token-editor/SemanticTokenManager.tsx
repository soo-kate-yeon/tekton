'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import type { SemanticToken, ColorToken } from '@tekton/token-contract';
import {
  SEMANTIC_TOKEN_META,
  REQUIRED_SEMANTIC_TOKENS,
  type SemanticTokenName,
  type ColorScaleStep,
} from '@/lib/token-editor';
import { SemanticTokenCard } from './SemanticTokenCard';
import { Button } from '@/components/ui/Button';

export interface SemanticTokenManagerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  tokens: SemanticToken;
  activeToken: SemanticTokenName | null;
  onSelectToken: (name: SemanticTokenName) => void;
  onAddToken: (name: SemanticTokenName) => void;
  onRemoveToken: (name: SemanticTokenName) => void;
}

const SemanticTokenManager = forwardRef<HTMLDivElement, SemanticTokenManagerProps>(
  (
    {
      className,
      tokens,
      activeToken,
      onSelectToken,
      onAddToken,
      onRemoveToken,
      ...props
    },
    ref
  ) => {
    // Get tokens that exist in the current state
    const existingTokenNames = Object.keys(tokens) as SemanticTokenName[];

    // Get tokens that can be added
    const availableToAdd = SEMANTIC_TOKEN_META.filter(
      (meta) => !existingTokenNames.includes(meta.name)
    );

    return (
      <div ref={ref} className={cn('space-y-4', className)} {...props}>
        {/* Existing tokens grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SEMANTIC_TOKEN_META.filter((meta) =>
            existingTokenNames.includes(meta.name)
          ).map((meta) => {
            const scale = tokens[meta.name];
            if (!scale) {
              return null;
            }

            const isRequired = (REQUIRED_SEMANTIC_TOKENS as readonly string[]).includes(
              meta.name
            );

            return (
              <SemanticTokenCard
                key={meta.name}
                name={meta.name}
                label={meta.label}
                description={meta.description}
                scale={scale as Record<ColorScaleStep, ColorToken>}
                isActive={activeToken === meta.name}
                isRequired={isRequired}
                onClick={() => onSelectToken(meta.name)}
                onRemove={isRequired ? undefined : () => onRemoveToken(meta.name)}
              />
            );
          })}
        </div>

        {/* Add token section */}
        {availableToAdd.length > 0 && (
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-3">
              Add optional semantic tokens:
            </p>
            <div className="flex flex-wrap gap-2">
              {availableToAdd.map((meta) => (
                <Button
                  key={meta.name}
                  variant="outline"
                  size="sm"
                  onClick={() => onAddToken(meta.name)}
                >
                  <svg
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {meta.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);
SemanticTokenManager.displayName = 'SemanticTokenManager';

export { SemanticTokenManager };
