'use client';

import { forwardRef, type HTMLAttributes, useRef } from 'react';
import { cn } from '@/lib/utils/cn';
import type { SemanticToken, CompositionToken } from '@tekton/token-contract';
import { useElementPreview } from '@/hooks/useLivePreview';

export interface LivePreviewPanelProps extends HTMLAttributes<HTMLDivElement> {
  semantic: SemanticToken;
  composition?: CompositionToken;
}

const LivePreviewPanel = forwardRef<HTMLDivElement, LivePreviewPanelProps>(
  ({ className, semantic, composition, ...props }, ref) => {
    const previewRef = useRef<HTMLDivElement>(null);

    // Apply CSS variables to the preview container
    useElementPreview(previewRef, semantic, composition);

    return (
      <div
        ref={ref}
        className={cn('rounded-lg border overflow-hidden', className)}
        {...props}
      >
        <div className="border-b bg-muted/50 px-4 py-2">
          <h3 className="text-sm font-medium">Live Preview</h3>
        </div>

        <div
          ref={previewRef}
          className="p-6 space-y-6 bg-background"
        >
          {/* Button Examples */}
          <section className="space-y-3">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Buttons
            </h4>
            <div className="flex flex-wrap gap-3">
              <button
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                style={{
                  backgroundColor: 'var(--tekton-primary-500)',
                  color: 'var(--tekton-neutral-50)',
                }}
              >
                Primary
              </button>
              <button
                className="px-4 py-2 rounded-md text-sm font-medium border transition-colors"
                style={{
                  borderColor: 'var(--tekton-neutral-300)',
                  color: 'var(--tekton-neutral-700)',
                }}
              >
                Secondary
              </button>
              <button
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                style={{
                  backgroundColor: 'var(--tekton-success-500)',
                  color: 'var(--tekton-neutral-50)',
                }}
              >
                Success
              </button>
              <button
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                style={{
                  backgroundColor: 'var(--tekton-error-500)',
                  color: 'var(--tekton-neutral-50)',
                }}
              >
                Error
              </button>
            </div>
          </section>

          {/* Text Examples */}
          <section className="space-y-3">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Typography
            </h4>
            <div className="space-y-2">
              <p
                className="text-lg font-semibold"
                style={{ color: 'var(--tekton-neutral-900)' }}
              >
                Heading Text
              </p>
              <p
                className="text-sm"
                style={{ color: 'var(--tekton-neutral-700)' }}
              >
                Body text with normal color density for readability.
              </p>
              <p
                className="text-xs"
                style={{ color: 'var(--tekton-neutral-500)' }}
              >
                Muted helper text for secondary information.
              </p>
            </div>
          </section>

          {/* Status Examples */}
          <section className="space-y-3">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Status Badges
            </h4>
            <div className="flex flex-wrap gap-2">
              <span
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: 'var(--tekton-success-100)',
                  color: 'var(--tekton-success-700)',
                }}
              >
                Success
              </span>
              <span
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: 'var(--tekton-warning-100)',
                  color: 'var(--tekton-warning-700)',
                }}
              >
                Warning
              </span>
              <span
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: 'var(--tekton-error-100)',
                  color: 'var(--tekton-error-700)',
                }}
              >
                Error
              </span>
              <span
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: 'var(--tekton-primary-100)',
                  color: 'var(--tekton-primary-700)',
                }}
              >
                Info
              </span>
            </div>
          </section>

          {/* Card Example */}
          <section className="space-y-3">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Card Component
            </h4>
            <div
              className="rounded-lg border p-4 space-y-2"
              style={{
                borderColor: 'var(--tekton-neutral-200)',
                backgroundColor: 'var(--tekton-neutral-50)',
              }}
            >
              <h5
                className="font-medium"
                style={{ color: 'var(--tekton-neutral-900)' }}
              >
                Card Title
              </h5>
              <p
                className="text-sm"
                style={{ color: 'var(--tekton-neutral-600)' }}
              >
                This is an example card component showing how your tokens
                apply to a typical UI pattern.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  className="px-3 py-1.5 rounded text-xs font-medium"
                  style={{
                    backgroundColor: 'var(--tekton-primary-500)',
                    color: 'var(--tekton-neutral-50)',
                  }}
                >
                  Action
                </button>
                <button
                  className="px-3 py-1.5 rounded text-xs font-medium"
                  style={{ color: 'var(--tekton-neutral-600)' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
);
LivePreviewPanel.displayName = 'LivePreviewPanel';

export { LivePreviewPanel };
