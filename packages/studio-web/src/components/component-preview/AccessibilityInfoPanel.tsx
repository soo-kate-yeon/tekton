'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import type { AccessibilitySpec } from '@tekton/component-system';

export interface AccessibilityInfoPanelProps extends HTMLAttributes<HTMLDivElement> {
  accessibility: AccessibilitySpec | undefined;
}

const AccessibilityInfoPanel = forwardRef<HTMLDivElement, AccessibilityInfoPanelProps>(
  ({ className, accessibility, ...props }, ref) => {
    if (!accessibility) {
      return (
        <div
          ref={ref}
          className={cn('py-8 text-center', className)}
          {...props}
        >
          <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">
            Select a component to view accessibility details
          </p>
        </div>
      );
    }

    const wcagColor = {
      A: 'bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20',
      AA: 'bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20',
      AAA: 'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20',
    }[accessibility.wcagLevel];

    return (
      <div ref={ref} className={cn('space-y-6', className)} {...props}>
        {/* WCAG Level Badge */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-1">
              Compliance Level
            </p>
            <p className="text-sm font-medium">WCAG 2.1</p>
          </div>
          <span
            className={cn('px-3 py-1.5 rounded-md text-xs font-semibold', wcagColor)}
          >
            Level {accessibility.wcagLevel}
          </span>
        </div>

        {/* Role */}
        {accessibility.role && (
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-2">
              ARIA Role
            </h4>
            <code className="text-xs bg-muted/50 px-3 py-1.5 rounded-md font-mono inline-block">
              role=&quot;{accessibility.role}&quot;
            </code>
          </div>
        )}

        {/* ARIA Attributes */}
        {accessibility.ariaAttributes.length > 0 && (
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-3">
              ARIA Attributes
            </h4>
            <ul className="space-y-2">
              {accessibility.ariaAttributes.map((attr) => (
                <li
                  key={attr.name}
                  className="text-xs bg-muted/30 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <code className="font-mono text-primary font-medium">{attr.name}</code>
                    {attr.required && (
                      <span className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-red-500/10 text-red-600">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{attr.description}</p>
                  {attr.validValues && (
                    <p className="text-muted-foreground mt-1.5 pt-1.5 border-t border-border/50">
                      <span className="font-medium text-foreground/70">Values:</span>{' '}
                      {attr.validValues.join(', ')}
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
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-3">
              Keyboard Navigation
            </h4>
            <ul className="space-y-2">
              {accessibility.keyboardNavigation.map((nav) => (
                <li
                  key={nav.key}
                  className="flex items-start gap-3 text-xs"
                >
                  <kbd className="px-2.5 py-1 bg-muted rounded-md font-mono min-w-[70px] text-center text-[11px] font-medium shrink-0">
                    {nav.key}
                  </kbd>
                  <span className="text-muted-foreground leading-relaxed pt-0.5">
                    {nav.action}
                    {nav.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Focus Management */}
        {accessibility.focusManagement && (
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-2">
              Focus Management
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed p-3 bg-muted/30 rounded-lg">
              {accessibility.focusManagement}
            </p>
          </div>
        )}

        {/* Notes */}
        {accessibility.notes && accessibility.notes.length > 0 && (
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-2">
              Additional Notes
            </h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {accessibility.notes.map((note, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-1">-</span>
                  <span className="leading-relaxed">{note}</span>
                </li>
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
