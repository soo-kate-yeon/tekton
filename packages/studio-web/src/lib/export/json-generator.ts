/**
 * JSON Generator
 * Export tokens as structured JSON with schema
 */

import type { SemanticToken, CompositionToken, Preset } from '@tekton/token-contract';

export interface JSONExportOptions {
  semantic: SemanticToken;
  composition?: CompositionToken;
  presetName?: string;
  includeMetadata?: boolean;
  prettyPrint?: boolean;
}

export interface JSONExportSchema {
  $schema: string;
  version: string;
  name?: string;
  generatedAt: string;
  tokens: {
    semantic: SemanticToken;
    composition?: CompositionToken;
  };
}

const SCHEMA_VERSION = '1.0.0';
const SCHEMA_URL = 'https://tekton.design/schemas/tokens/v1.json';

/**
 * Generate JSON export from tokens
 */
export function generateJSONExport({
  semantic,
  composition,
  presetName,
  includeMetadata = true,
  prettyPrint = true,
}: JSONExportOptions): string {
  const exportData: JSONExportSchema = {
    $schema: SCHEMA_URL,
    version: SCHEMA_VERSION,
    ...(presetName && { name: presetName }),
    ...(includeMetadata && { generatedAt: new Date().toISOString() }),
    tokens: {
      semantic,
      ...(composition && { composition }),
    },
  };

  return prettyPrint
    ? JSON.stringify(exportData, null, 2)
    : JSON.stringify(exportData);
}

/**
 * Generate JSON export from a complete preset
 */
export function generatePresetJSONExport(
  preset: Preset,
  prettyPrint = true
): string {
  const exportData = {
    $schema: SCHEMA_URL,
    version: SCHEMA_VERSION,
    name: preset.name,
    description: preset.description,
    generatedAt: new Date().toISOString(),
    tokens: {
      semantic: preset.tokens,
      composition: preset.composition,
    },
    metadata: preset.metadata,
  };

  return prettyPrint
    ? JSON.stringify(exportData, null, 2)
    : JSON.stringify(exportData);
}

/**
 * Convert OKLCH token to flat format
 */
export function flattenTokens(semantic: SemanticToken): Record<string, string> {
  const flat: Record<string, string> = {};

  for (const [tokenName, scale] of Object.entries(semantic)) {
    if (scale && typeof scale === 'object') {
      for (const [step, value] of Object.entries(scale)) {
        const key = `${tokenName}-${step}`;
        if (typeof value === 'string') {
          flat[key] = value;
        } else {
          flat[key] = `oklch(${value.l} ${value.c} ${value.h})`;
        }
      }
    }
  }

  return flat;
}

/**
 * Generate flat JSON format (for simpler integrations)
 */
export function generateFlatJSONExport(
  semantic: SemanticToken,
  prettyPrint = true
): string {
  const flat = flattenTokens(semantic);

  return prettyPrint
    ? JSON.stringify(flat, null, 2)
    : JSON.stringify(flat);
}
