'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { useDownload, type ExportFormat } from '@/hooks/useDownload';
import { useClipboard } from '@/hooks/useClipboard';

export interface ExportActionsProps extends HTMLAttributes<HTMLDivElement> {
  content: string;
  filename: string;
  format: ExportFormat;
}

const ExportActions = forwardRef<HTMLDivElement, ExportActionsProps>(
  ({ className, content, filename, format, ...props }, ref) => {
    const { download, isDownloading, error: downloadError } = useDownload();
    const { copy, isCopied, isCopying, error: copyError } = useClipboard();

    const handleDownload = () => {
      download(content, filename, format);
    };

    const handleCopy = async () => {
      await copy(content);
    };

    const error = downloadError || copyError;

    return (
      <div ref={ref} className={cn('space-y-3', className)} {...props}>
        <div className="flex gap-3">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1"
          >
            {isDownloading ? (
              <>
                <DownloadingIcon className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={isCopying}
            className="flex-1"
          >
            {isCopied ? (
              <>
                <CheckIcon className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : isCopying ? (
              <>
                <CopyingIcon className="mr-2 h-4 w-4 animate-spin" />
                Copying...
              </>
            ) : (
              <>
                <CopyIcon className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
      </div>
    );
  }
);
ExportActions.displayName = 'ExportActions';

// Simple SVG Icons
function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function DownloadingIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CopyingIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export { ExportActions };
