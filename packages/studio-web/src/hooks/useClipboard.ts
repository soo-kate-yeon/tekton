/**
 * useClipboard Hook
 * Handles clipboard operations with feedback state
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { copyToClipboard } from '@/lib/export/download-utils';

interface ClipboardState {
  isCopied: boolean;
  isCopying: boolean;
  error: string | null;
}

interface UseClipboardOptions {
  resetDelay?: number;
}

interface UseClipboardReturn extends ClipboardState {
  copy: (text: string) => Promise<boolean>;
  reset: () => void;
}

export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { resetDelay = 2000 } = options;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [state, setState] = useState<ClipboardState>({
    isCopied: false,
    isCopying: false,
    error: null,
  });

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setState({ isCopied: false, isCopying: true, error: null });

      const success = await copyToClipboard(text);

      if (success) {
        setState({ isCopied: true, isCopying: false, error: null });

        // Auto-reset after delay
        timeoutRef.current = setTimeout(() => {
          setState((prev) => ({ ...prev, isCopied: false }));
        }, resetDelay);
      } else {
        setState({
          isCopied: false,
          isCopying: false,
          error: 'Failed to copy to clipboard',
        });
      }

      return success;
    },
    [resetDelay]
  );

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setState({ isCopied: false, isCopying: false, error: null });
  }, []);

  return {
    ...state,
    copy,
    reset,
  };
}
