/**
 * BlueprintRenderer
 * SPEC-PLAYGROUND-001 Milestone 5: Blueprint Renderer
 *
 * Recursively renders ComponentNode tree using @tekton/ui components
 */

import { resolveComponent } from './component-resolver';
import type { ComponentNode } from '@/lib/schemas';

export interface BlueprintRendererProps {
  node: ComponentNode;
}

/**
 * Renders a single ComponentNode
 * Handles:
 * - Component resolution from @tekton/ui
 * - Props passing
 * - Recursive rendering of children
 * - Unknown component fallback
 */
export function BlueprintRenderer({ node }: BlueprintRendererProps) {
  const { type, props, children } = node;

  // Resolve component from @tekton/ui
  const Component = resolveComponent(type);

  // Unknown component fallback
  if (!Component) {
    return (
      <div
        data-unknown-component={type}
        style={{
          padding: '1rem',
          border: '2px dashed #fbbf24',
          borderRadius: '0.5rem',
          backgroundColor: '#fef3c7',
          color: '#92400e',
        }}
      >
        <strong>Unknown Component:</strong> {type}
        <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Component "{type}" is not available in @tekton/ui
        </div>
      </div>
    );
  }

  // Render children recursively
  const renderedChildren = children?.map((child, index) => {
    if (typeof child === 'string') {
      // Plain text node
      return child;
    }
    // Recursive ComponentNode rendering (type assertion safe due to Zod validation)
    return <BlueprintRenderer key={index} node={child as ComponentNode} />;
  });

  // Merge props with rendered children
  const componentProps = {
    ...props,
    children: renderedChildren?.length ? renderedChildren : props?.children,
  };

  return <Component {...componentProps} />;
}
