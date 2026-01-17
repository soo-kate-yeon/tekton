/**
 * useDownload Hook
 * Handles file download with loading state
 */

import { useState, useCallback } from 'react';
import {
  downloadFile,
  getFileExtension,
  getMimeType,
} from '@/lib/export/download-utils';

export type ExportFormat = 'css' | 'json' | 'stylesheet';

interface DownloadState {
  isDownloading: boolean;
  error: string | null;
}

interface UseDownloadReturn extends DownloadState {
  download: (content: string, baseFilename: string, format: ExportFormat) => void;
  reset: () => void;
}

export function useDownload(): UseDownloadReturn {
  const [state, setState] = useState<DownloadState>({
    isDownloading: false,
    error: null,
  });

  const download = useCallback(
    (content: string, baseFilename: string, format: ExportFormat) => {
      setState({ isDownloading: true, error: null });

      try {
        const extension = getFileExtension(format);
        const mimeType = getMimeType(format);
        const filename = `${baseFilename}.${extension}`;

        downloadFile({ content, filename, mimeType });

        setState({ isDownloading: false, error: null });
      } catch (err) {
        setState({
          isDownloading: false,
          error: err instanceof Error ? err.message : 'Download failed',
        });
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ isDownloading: false, error: null });
  }, []);

  return {
    ...state,
    download,
    reset,
  };
}
