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
  semantic: SemanticToken;
  composition?: CompositionToken;
  presetName?: string;
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
  presetName = 'tokens',
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

    switch (format) {
      case 'css':
        return generateCSSExport({
          semantic,
          composition,
          includeDarkMode: options.includeDarkMode,
          minify: options.minify,
        });

      case 'json':
        return generateJSONExport({
          semantic,
          composition,
          presetName,
          includeMetadata: true,
          prettyPrint: options.prettyPrint,
        });

      case 'stylesheet':
        return generateStyleSheetExport({
          semantic,
          composition,
          includeTypes: options.includeTypes,
        });

      default:
        return '';
    }
  }, [semantic, composition, presetName, state]);

  const filename = useMemo(() => {
    const base = presetName.toLowerCase().replace(/\s+/g, '-');
    return `${base}-tokens`;
  }, [presetName]);

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
  const semantic = preset?.tokens ?? {};
  const composition = preset?.composition;
  const presetName = preset?.name ?? 'custom';

  return useExport({ semantic, composition, presetName });
}
