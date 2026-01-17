'use client';

import { forwardRef, type HTMLAttributes, useRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { styleObjectToReactStyle, type HookName, type ComponentState } from '@/lib/component-preview';
import { useElementPreview } from '@/hooks/useLivePreview';
import type { SemanticToken, CompositionToken } from '@tekton/token-contract';

export interface PreviewCanvasProps extends HTMLAttributes<HTMLDivElement> {
  hookName: HookName | null;
  styles: Record<string, string>;
  componentState: ComponentState;
  semantic?: SemanticToken;
  composition?: CompositionToken;
}

const PreviewCanvas = forwardRef<HTMLDivElement, PreviewCanvasProps>(
  (
    { className, hookName, styles, componentState, semantic, composition, ...props },
    ref
  ) => {
    const canvasRef = useRef<HTMLDivElement>(null);

    // Apply token CSS variables if provided
    if (semantic) {
      useElementPreview(canvasRef, semantic, composition);
    }

    const reactStyles = styleObjectToReactStyle(styles);

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-background overflow-hidden',
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="border-b bg-muted/50 px-4 py-2 flex items-center justify-between">
          <span className="text-sm font-medium">Preview</span>
          <span className="text-xs text-muted-foreground">
            {hookName ? hookName : 'No hook selected'}
          </span>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="p-8 flex items-center justify-center min-h-[200px]"
        >
          {hookName ? (
            <PreviewComponent
              hookName={hookName}
              styles={reactStyles}
              state={componentState}
            />
          ) : (
            <div className="text-muted-foreground text-sm">
              Select a hook to see the preview
            </div>
          )}
        </div>
      </div>
    );
  }
);
PreviewCanvas.displayName = 'PreviewCanvas';

interface PreviewComponentProps {
  hookName: HookName;
  styles: React.CSSProperties;
  state: ComponentState;
}

function PreviewComponent({ hookName, styles, state }: PreviewComponentProps) {
  const getLabel = () => {
    switch (hookName) {
      case 'useButton':
      case 'useToggleButton':
        return state.pressed ? 'Pressed' : 'Click me';
      case 'useBadge':
        return state.variant || 'Badge';
      case 'useInput':
        return undefined; // Input doesn't show label
      default:
        return hookName.replace('use', '');
    }
  };

  const label = getLabel();

  // Helper to safely cast boolean values
  const toBool = (val: unknown): boolean | undefined =>
    typeof val === 'boolean' ? val : undefined;

  switch (hookName) {
    case 'useButton':
    case 'useToggleButton':
      return (
        <button
          style={styles}
          disabled={toBool(state.disabled)}
          aria-pressed={hookName === 'useToggleButton' ? toBool(state.pressed) : undefined}
        >
          {label}
        </button>
      );

    case 'useInput':
      return (
        <input
          type="text"
          placeholder="Enter text..."
          style={styles}
          disabled={toBool(state.disabled)}
          aria-invalid={toBool(state.invalid)}
        />
      );

    case 'useCheckbox':
      return (
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={toBool(state.checked)}
            onChange={() => {}}
            style={{ width: '1rem', height: '1rem' }}
          />
          <span>Checkbox label</span>
        </label>
      );

    case 'useBadge':
      return <span style={styles}>{label}</span>;

    case 'useProgress':
      return (
        <div style={{ width: '200px', ...styles }}>
          <div
            style={{
              height: '8px',
              backgroundColor: 'var(--tekton-neutral-200, #e5e5e5)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${state.value || 60}%`,
                height: '100%',
                backgroundColor: 'var(--tekton-primary-500, #3b82f6)',
                transition: 'width 0.3s',
              }}
            />
          </div>
        </div>
      );

    case 'useAvatar':
      return (
        <span
          style={{
            ...styles,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--tekton-primary-500, #3b82f6)',
            color: 'white',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
          }}
        >
          JD
        </span>
      );

    case 'useDivider':
      return (
        <hr
          style={{
            ...styles,
            width: '200px',
            border: 'none',
            borderTop: '1px solid var(--tekton-neutral-300, #d4d4d4)',
          }}
        />
      );

    default:
      return (
        <div style={styles} className="p-4 rounded-md border">
          {label} Component
        </div>
      );
  }
}

export { PreviewCanvas };
