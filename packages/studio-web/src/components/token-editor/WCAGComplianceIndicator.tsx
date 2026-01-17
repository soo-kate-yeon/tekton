'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import type { ContrastResult, BatchContrastResult, WCAGSummary } from '@/lib/token-editor';
import { getComplianceBadge, getComplianceColorClass } from '@/lib/token-editor';

export interface WCAGComplianceIndicatorProps
  extends HTMLAttributes<HTMLDivElement> {
  result: ContrastResult;
  label?: string;
  showRatio?: boolean;
}

const WCAGComplianceIndicator = forwardRef<HTMLDivElement, WCAGComplianceIndicatorProps>(
  ({ className, result, label, showRatio = true, ...props }, ref) => {
    const badge = getComplianceBadge(result);
    const colorClass = getComplianceColorClass(result);

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2', className)}
        {...props}
      >
        {label && <span className="text-sm text-muted-foreground">{label}</span>}
        <span
          className={cn(
            'px-2 py-0.5 rounded text-xs font-medium',
            colorClass
          )}
        >
          {badge}
        </span>
        {showRatio && (
          <span className="text-xs text-muted-foreground">
            {result.ratio.toFixed(2)}:1
          </span>
        )}
      </div>
    );
  }
);
WCAGComplianceIndicator.displayName = 'WCAGComplianceIndicator';

export interface WCAGSummaryPanelProps extends HTMLAttributes<HTMLDivElement> {
  summary: WCAGSummary;
  results: BatchContrastResult[];
}

const WCAGSummaryPanel = forwardRef<HTMLDivElement, WCAGSummaryPanelProps>(
  ({ className, summary, results, ...props }, ref) => {
    const passRate = summary.passRate;
    const statusColor =
      passRate >= 100
        ? 'text-green-600'
        : passRate >= 80
        ? 'text-yellow-600'
        : 'text-red-600';

    return (
      <div
        ref={ref}
        className={cn('space-y-4 p-4 rounded-lg border', className)}
        {...props}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-medium">WCAG Compliance</h3>
          <span className={cn('text-2xl font-bold', statusColor)}>
            {passRate}%
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {summary.passing}
            </div>
            <div className="text-xs text-muted-foreground">Passing</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {summary.failing}
            </div>
            <div className="text-xs text-muted-foreground">Failing</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{summary.total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>

        {/* Violation list */}
        {summary.failing > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-red-600">Violations</h4>
            <ul className="space-y-1">
              {results
                .filter((r) => !r.passesAA)
                .slice(0, 5)
                .map((r) => (
                  <li
                    key={r.name}
                    className="text-xs flex justify-between text-muted-foreground"
                  >
                    <span>{r.name}</span>
                    <span>{r.ratio.toFixed(2)}:1</span>
                  </li>
                ))}
              {summary.failing > 5 && (
                <li className="text-xs text-muted-foreground">
                  +{summary.failing - 5} more...
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }
);
WCAGSummaryPanel.displayName = 'WCAGSummaryPanel';

export { WCAGComplianceIndicator, WCAGSummaryPanel };
