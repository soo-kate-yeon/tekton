/**
 * Default Token Values
 * Initial values for the token editor
 */

import type { ColorScale, SemanticToken, CompositionToken } from '@tekton/token-contract';
import { COLOR_SCALE_STEPS, type ColorScaleStep } from './oklch-utils';

/**
 * Default semantic token names (required)
 */
export const REQUIRED_SEMANTIC_TOKENS = [
  'primary',
  'neutral',
  'success',
  'warning',
  'error',
] as const;

/**
 * Optional semantic token names
 */
export const OPTIONAL_SEMANTIC_TOKENS = [
  'secondary',
  'accent',
  'info',
] as const;

export type RequiredSemanticToken = typeof REQUIRED_SEMANTIC_TOKENS[number];
export type OptionalSemanticToken = typeof OPTIONAL_SEMANTIC_TOKENS[number];
export type SemanticTokenName = RequiredSemanticToken | OptionalSemanticToken;

/**
 * Semantic token metadata
 */
export interface SemanticTokenMeta {
  name: SemanticTokenName;
  label: string;
  description: string;
  required: boolean;
  defaultHue: number;
}

export const SEMANTIC_TOKEN_META: SemanticTokenMeta[] = [
  { name: 'primary', label: 'Primary', description: 'Main brand color', required: true, defaultHue: 220 },
  { name: 'neutral', label: 'Neutral', description: 'Grayscale tones', required: true, defaultHue: 0 },
  { name: 'success', label: 'Success', description: 'Positive actions and states', required: true, defaultHue: 140 },
  { name: 'warning', label: 'Warning', description: 'Caution and alerts', required: true, defaultHue: 60 },
  { name: 'error', label: 'Error', description: 'Errors and destructive actions', required: true, defaultHue: 0 },
  { name: 'secondary', label: 'Secondary', description: 'Secondary brand color', required: false, defaultHue: 280 },
  { name: 'accent', label: 'Accent', description: 'Highlight color', required: false, defaultHue: 180 },
  { name: 'info', label: 'Info', description: 'Informational states', required: false, defaultHue: 200 },
];

/**
 * Create a default color scale with given hue
 */
export function createDefaultColorScale(hue: number, isNeutral = false): ColorScale {
  const scale: Partial<ColorScale> = {};

  const lightnesses: Record<ColorScaleStep, number> = {
    '50': 0.97,
    '100': 0.94,
    '200': 0.86,
    '300': 0.76,
    '400': 0.64,
    '500': 0.53,
    '600': 0.45,
    '700': 0.38,
    '800': 0.30,
    '900': 0.22,
    '950': 0.15,
  };

  COLOR_SCALE_STEPS.forEach((step) => {
    const l = lightnesses[step];
    // Neutral has zero chroma, others have varying chroma based on lightness
    const c = isNeutral ? 0 : calculateChroma(l);

    scale[step] = { l, c, h: hue };
  });

  return scale as ColorScale;
}

/**
 * Calculate appropriate chroma based on lightness
 * Reduced chroma at extremes for better color rendering
 */
function calculateChroma(lightness: number): number {
  if (lightness > 0.9 || lightness < 0.2) {
    return 0.08;
  }
  if (lightness > 0.8 || lightness < 0.25) {
    return 0.1;
  }
  if (lightness > 0.7 || lightness < 0.35) {
    return 0.12;
  }
  return 0.15;
}

/**
 * Create default semantic tokens
 */
export function createDefaultSemanticTokens(): SemanticToken {
  return {
    primary: createDefaultColorScale(220),
    neutral: createDefaultColorScale(0, true),
    success: createDefaultColorScale(140),
    warning: createDefaultColorScale(60),
    error: createDefaultColorScale(0),
  };
}

/**
 * Default composition tokens
 */
export const DEFAULT_COMPOSITION_TOKENS: CompositionToken = {
  border: {
    width: '1px',
    style: 'solid',
    color: { l: 0.9, c: 0, h: 0 },
    radius: '8px',
  },
  shadow: {
    x: '0px',
    y: '2px',
    blur: '4px',
    spread: '0px',
    color: { l: 0, c: 0, h: 0 },
  },
  spacing: {
    padding: '1rem',
    margin: '1rem',
    gap: '0.5rem',
  },
  typography: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: '1.5',
    letterSpacing: '0em',
  },
};

/**
 * Get display label for a scale step
 */
export function getStepLabel(step: ColorScaleStep): string {
  return step;
}

/**
 * Get description for a scale step
 */
export function getStepDescription(step: ColorScaleStep): string {
  switch (step) {
    case '50': return 'Lightest tint';
    case '100': return 'Very light';
    case '200': return 'Light';
    case '300': return 'Light-medium';
    case '400': return 'Medium-light';
    case '500': return 'Base color';
    case '600': return 'Medium-dark';
    case '700': return 'Dark';
    case '800': return 'Very dark';
    case '900': return 'Near black';
    case '950': return 'Darkest shade';
    default: return '';
  }
}
