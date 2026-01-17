'use client';

import { forwardRef, type HTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { useClipboard } from '@/hooks/useClipboard';
import type { GeneratedCode, CodeFormat } from '@/hooks/useCodeGeneration';

export interface CodeExportPanelProps extends HTMLAttributes<HTMLDivElement> {
  code: GeneratedCode;
}

const CodeExportPanel = forwardRef<HTMLDivElement, CodeExportPanelProps>(
  ({ className, code, ...props }, ref) => {
    const [activeTab, setActiveTab] = useState<CodeFormat>('jsx');
    const { copy, isCopied } = useClipboard();

    const tabs: { key: CodeFormat; label: string }[] = [
      { key: 'jsx', label: 'JSX' },
      { key: 'html', label: 'HTML' },
      { key: 'css', label: 'CSS' },
    ];

    const currentCode = code[activeTab];

    const handleCopy = async () => {
      await copy(currentCode);
    };

    return (
      <div
        ref={ref}
        className={cn('rounded-lg border overflow-hidden', className)}
        {...props}
      >
        {/* Tabs */}
        <div className="flex items-center justify-between border-b bg-muted/50">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors',
                  activeTab === tab.key
                    ? 'bg-background text-foreground border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-1 mr-2 text-xs rounded-md bg-muted hover:bg-muted/80 transition-colors"
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Code Display */}
        <pre className="p-4 overflow-auto text-sm bg-muted/30 max-h-[300px]">
          <code className="font-mono text-foreground whitespace-pre">
            {currentCode}
          </code>
        </pre>
      </div>
    );
  }
);
CodeExportPanel.displayName = 'CodeExportPanel';

export { CodeExportPanel };
