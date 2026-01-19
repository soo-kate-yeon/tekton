/**
 * useExport Hook
 * Manages export state and content generation
 */

import { useState, useCallback, useMemo } from 'react';
import type { SemanticToken, CompositionToken, Preset } from '@tekton/token-contract';
import {
  generateCSSExport,
  generateJSONExport,
  generateStyleSheetExport,
} from '@/lib/export';

export type ExportFormat = 'css' | 'json' | 'stylesheet';

export interface ExportOptions {
  format: ExportFormat;
  includeDarkMode: boolean;
  minify: boolean;
  includeTypes: boolean;
  prettyPrint: boolean;
}

interface ExportState {
  format: ExportFormat;
  options: Omit<ExportOptions, 'format'>;
}

interface UseExportProps {
  semantic: Partial<SemanticToken> | undefined | null;
  composition?: CompositionToken;
  themeName?: string;
}

interface UseExportReturn {
  format: ExportFormat;
  setFormat: (format: ExportFormat) => void;
  options: Omit<ExportOptions, 'format'>;
  setOption: <K extends keyof Omit<ExportOptions, 'format'>>(
    key: K,
    value: ExportOptions[K]
  ) => void;
  content: string;
  filename: string;
}

const DEFAULT_OPTIONS: Omit<ExportOptions, 'format'> = {
  includeDarkMode: true,
  minify: false,
  includeTypes: true,
  prettyPrint: true,
};

export function useExport({
  semantic,
  composition,
  themeName = 'tokens',
}: UseExportProps): UseExportReturn {
  const [state, setState] = useState<ExportState>({
    format: 'css',
    options: DEFAULT_OPTIONS,
  });

  const setFormat = useCallback((format: ExportFormat) => {
    setState((prev) => ({ ...prev, format }));
  }, []);

  const setOption = useCallback(
    <K extends keyof Omit<ExportOptions, 'format'>>(
      key: K,
      value: ExportOptions[K]
    ) => {
      setState((prev) => ({
        ...prev,
        options: { ...prev.options, [key]: value },
      }));
    },
    []
  );

  const content = useMemo(() => {
    const { format, options } = state;

    // Return empty if no semantic tokens
    if (!semantic || Object.keys(semantic).length === 0) {
      return '// No tokens to export. Select a preset first.';
    }

    const safeTokens = semantic as SemanticToken;

    switch (format) {
      case 'css':
        return generateCSSExport({
          semantic: safeTokens,
          composition,
          includeDarkMode: options.includeDarkMode,
          minify: options.minify,
        });

      case 'json':
        return generateJSONExport({
          semantic: safeTokens,
          composition,
          themeName,
          includeMetadata: true,
          prettyPrint: options.prettyPrint,
        });

      case 'stylesheet':
        return generateStyleSheetExport({
          semantic: safeTokens,
          composition,
          includeTypes: options.includeTypes,
        });

      default:
        return '';
    }
  }, [semantic, composition, themeName, state]);

  const filename = useMemo(() => {
    const base = themeName.toLowerCase().replace(/\s+/g, '-');
    return `${base}-tokens`;
  }, [themeName]);

  return {
    format: state.format,
    setFormat,
    options: state.options,
    setOption,
    content,
    filename,
  };
}

/**
 * Create export state from a preset
 */
export function usePresetExport(preset: Preset | null) {
  const semantic = preset?.tokens;
  const composition = preset?.composition;
  const themeName = preset?.name ?? 'custom';

  return useExport({ semantic, composition, themeName });
}
