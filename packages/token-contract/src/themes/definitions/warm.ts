import type { Preset } from '../types.js';

/**
 * Warm Preset
 * Target: Lifestyle brands, food/hospitality, wellness
 * Characteristics: Warm hues, rounded borders, comfortable spacing
 */
export const warmPreset: Preset = {
  name: 'warm',
  description: 'Warm and inviting design with earth tones',
  tokens: {
    // Primary: Warm orange (H: 25)
    primary: {
      '50': { l: 0.98, c: 0.02, h: 25 },
      '100': { l: 0.95, c: 0.06, h: 25 },
      '200': { l: 0.88, c: 0.12, h: 25 },
      '300': { l: 0.79, c: 0.18, h: 25 },
      '400': { l: 0.69, c: 0.22, h: 25 },
      '500': { l: 0.59, c: 0.24, h: 25 },
      '600': { l: 0.51, c: 0.22, h: 25 },
      '700': { l: 0.43, c: 0.19, h: 25 },
      '800': { l: 0.34, c: 0.15, h: 25 },
      '900': { l: 0.26, c: 0.11, h: 25 },
      '950': { l: 0.18, c: 0.08, h: 25 },
    },
    // Secondary: Warm yellow (H: 50)
    secondary: {
      '50': { l: 0.98, c: 0.02, h: 50 },
      '100': { l: 0.95, c: 0.06, h: 50 },
      '200': { l: 0.89, c: 0.12, h: 50 },
      '300': { l: 0.81, c: 0.18, h: 50 },
      '400': { l: 0.72, c: 0.22, h: 50 },
      '500': { l: 0.63, c: 0.24, h: 50 },
      '600': { l: 0.54, c: 0.22, h: 50 },
      '700': { l: 0.46, c: 0.19, h: 50 },
      '800': { l: 0.37, c: 0.15, h: 50 },
      '900': { l: 0.29, c: 0.11, h: 50 },
      '950': { l: 0.21, c: 0.08, h: 50 },
    },
    // Neutral: Warm gray (slight orange tint)
    neutral: {
      '50': { l: 0.98, c: 0.01, h: 35 },
      '100': { l: 0.96, c: 0.01, h: 35 },
      '200': { l: 0.9, c: 0.015, h: 35 },
      '300': { l: 0.83, c: 0.015, h: 35 },
      '400': { l: 0.64, c: 0.015, h: 35 },
      '500': { l: 0.53, c: 0.015, h: 35 },
      '600': { l: 0.45, c: 0.015, h: 35 },
      '700': { l: 0.38, c: 0.015, h: 35 },
      '800': { l: 0.27, c: 0.01, h: 35 },
      '900': { l: 0.15, c: 0.01, h: 35 },
      '950': { l: 0.1, c: 0.01, h: 35 },
    },
    // Success: Earthy green (H: 100)
    success: {
      '50': { l: 0.97, c: 0.02, h: 100 },
      '100': { l: 0.93, c: 0.06, h: 100 },
      '200': { l: 0.86, c: 0.12, h: 100 },
      '300': { l: 0.76, c: 0.18, h: 100 },
      '400': { l: 0.65, c: 0.22, h: 100 },
      '500': { l: 0.55, c: 0.24, h: 100 },
      '600': { l: 0.47, c: 0.22, h: 100 },
      '700': { l: 0.4, c: 0.19, h: 100 },
      '800': { l: 0.32, c: 0.15, h: 100 },
      '900': { l: 0.24, c: 0.11, h: 100 },
      '950': { l: 0.16, c: 0.08, h: 100 },
    },
    // Warning: Golden yellow (H: 48)
    warning: {
      '50': { l: 0.98, c: 0.02, h: 48 },
      '100': { l: 0.95, c: 0.06, h: 48 },
      '200': { l: 0.89, c: 0.12, h: 48 },
      '300': { l: 0.81, c: 0.18, h: 48 },
      '400': { l: 0.72, c: 0.22, h: 48 },
      '500': { l: 0.63, c: 0.24, h: 48 },
      '600': { l: 0.54, c: 0.22, h: 48 },
      '700': { l: 0.46, c: 0.19, h: 48 },
      '800': { l: 0.37, c: 0.15, h: 48 },
      '900': { l: 0.29, c: 0.11, h: 48 },
      '950': { l: 0.21, c: 0.08, h: 48 },
    },
    // Error: Warm red (H: 10)
    error: {
      '50': { l: 0.97, c: 0.02, h: 10 },
      '100': { l: 0.94, c: 0.06, h: 10 },
      '200': { l: 0.87, c: 0.12, h: 10 },
      '300': { l: 0.77, c: 0.18, h: 10 },
      '400': { l: 0.66, c: 0.22, h: 10 },
      '500': { l: 0.56, c: 0.24, h: 10 },
      '600': { l: 0.48, c: 0.22, h: 10 },
      '700': { l: 0.41, c: 0.19, h: 10 },
      '800': { l: 0.33, c: 0.15, h: 10 },
      '900': { l: 0.25, c: 0.11, h: 10 },
      '950': { l: 0.17, c: 0.08, h: 10 },
    },
  },
  composition: {
    border: {
      width: '1px',
      style: 'solid',
      color: { l: 0.9, c: 0.015, h: 35 },
      radius: '12px',
    },
    shadow: {
      x: '0px',
      y: '2px',
      blur: '4px',
      spread: '0px',
      color: { l: 0.5, c: 0.05, h: 25 },
    },
    spacing: {
      padding: '1.25rem',
      margin: '1.25rem',
      gap: '0.75rem',
    },
    typography: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: '1.6',
      letterSpacing: '0em',
    },
  },
  metadata: {
    targetUseCase: 'Lifestyle brands, food/hospitality, wellness',
    characteristics: [
      'Warm hue bias (0-120 range emphasis)',
      'Rounded border radius (12px)',
      'Comfortable spacing',
      'Friendly typography (rounded feel)',
    ],
  },
};
