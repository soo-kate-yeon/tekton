/**
 * Download Utilities
 * Browser-based file download helpers using Blob API
 */

export type MimeType = 'text/css' | 'application/json' | 'text/plain';

export interface DownloadOptions {
  content: string;
  filename: string;
  mimeType: MimeType;
}

/**
 * Download content as a file using browser Blob API
 * Creates a temporary anchor element to trigger download
 */
export function downloadFile({ content, filename, mimeType }: DownloadOptions): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard using Clipboard API
 * Falls back to execCommand for older browsers
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';

    document.body.appendChild(textArea);
    textArea.select();

    const success = document.execCommand('copy');
    document.body.removeChild(textArea);

    return success;
  } catch {
    return false;
  }
}

/**
 * Get file extension for export format
 */
export function getFileExtension(format: 'css' | 'json' | 'stylesheet'): string {
  switch (format) {
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    case 'stylesheet':
      return 'ts';
    default:
      return 'txt';
  }
}

/**
 * Get MIME type for export format
 */
export function getMimeType(format: 'css' | 'json' | 'stylesheet'): MimeType {
  switch (format) {
    case 'css':
      return 'text/css';
    case 'json':
      return 'application/json';
    case 'stylesheet':
      return 'text/plain';
    default:
      return 'text/plain';
  }
}
