'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ExportPreviewProps extends HTMLAttributes<HTMLDivElement> {
  content: string;
  language: 'css' | 'json' | 'typescript';
}

const ExportPreview = forwardRef<HTMLDivElement, ExportPreviewProps>(
  ({ className, content, language, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-lg border bg-muted/50',
          className
        )}
        {...props}
      >
        <div className="absolute right-3 top-3">
          <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground uppercase">
            {language}
          </span>
        </div>
        <pre className="overflow-auto p-4 text-sm">
          <code className="font-mono text-foreground">{content}</code>
        </pre>
      </div>
    );
  }
);
ExportPreview.displayName = 'ExportPreview';

export { ExportPreview };
