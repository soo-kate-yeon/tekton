'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import type { AccessibilitySpec } from '@tekton/archetype-system';

export interface AccessibilityInfoPanelProps extends HTMLAttributes<HTMLDivElement> {
  accessibility: AccessibilitySpec | undefined;
}

const AccessibilityInfoPanel = forwardRef<HTMLDivElement, AccessibilityInfoPanelProps>(
  ({ className, accessibility, ...props }, ref) => {
    if (!accessibility) {
      return (
        <div
          ref={ref}
          className={cn('text-sm text-muted-foreground py-4', className)}
          {...props}
        >
          Select a hook to view accessibility information.
        </div>
      );
    }

    const wcagColor = {
      A: 'bg-yellow-100 text-yellow-800',
      AA: 'bg-blue-100 text-blue-800',
      AAA: 'bg-green-100 text-green-800',
    }[accessibility.wcagLevel];

    return (
      <div ref={ref} className={cn('space-y-4', className)} {...props}>
        {/* WCAG Level */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">WCAG Level:</span>
          <span
            className={cn('px-2 py-0.5 rounded text-xs font-medium', wcagColor)}
          >
            {accessibility.wcagLevel}
          </span>
        </div>

        {/* Role */}
        {accessibility.role && (
          <div>
            <h4 className="text-sm font-medium mb-1">ARIA Role</h4>
            <code className="text-xs bg-muted px-2 py-1 rounded">
              role="{accessibility.role}"
            </code>
          </div>
        )}

        {/* ARIA Attributes */}
        {accessibility.ariaAttributes.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">ARIA Attributes</h4>
            <ul className="space-y-2">
              {accessibility.ariaAttributes.map((attr) => (
                <li
                  key={attr.name}
                  className="text-xs bg-muted/50 rounded p-2"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <code className="font-mono">{attr.name}</code>
                    {attr.required && (
                      <span className="text-red-600 text-[10px]">Required</span>
                    )}
                  </div>
                  <p className="text-muted-foreground">{attr.description}</p>
                  {attr.validValues && (
                    <p className="text-muted-foreground mt-1">
                      Values: {attr.validValues.join(', ')}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Keyboard Navigation */}
        {accessibility.keyboardNavigation.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Keyboard Navigation</h4>
            <ul className="space-y-2">
              {accessibility.keyboardNavigation.map((nav) => (
                <li
                  key={nav.key}
                  className="flex items-start gap-2 text-xs"
                >
                  <kbd className="px-2 py-0.5 bg-muted rounded font-mono min-w-[60px] text-center">
                    {nav.key}
                  </kbd>
                  <span className="text-muted-foreground">{nav.action}</span>
                  {nav.required && (
                    <span className="text-red-600 text-[10px]">*</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Focus Management */}
        {accessibility.focusManagement && (
          <div>
            <h4 className="text-sm font-medium mb-1">Focus Management</h4>
            <p className="text-xs text-muted-foreground">
              {accessibility.focusManagement}
            </p>
          </div>
        )}

        {/* Notes */}
        {accessibility.notes && accessibility.notes.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-1">Additional Notes</h4>
            <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
              {accessibility.notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);
AccessibilityInfoPanel.displayName = 'AccessibilityInfoPanel';

export { AccessibilityInfoPanel };
