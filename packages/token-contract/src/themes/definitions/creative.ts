import type { Preset } from '../types.js';

/**
 * Creative Preset
 * Target: Design agencies, portfolios, marketing sites
 * Characteristics: Bold colors, larger radius, generous spacing
 */
export const creativePreset: Preset = {
  name: 'creative',
  description: 'Vibrant and expressive design for creative professionals',
  tokens: {
    // Primary: Vibrant purple (H: 280, high chroma)
    primary: {
      '50': { l: 0.97, c: 0.03, h: 280 },
      '100': { l: 0.94, c: 0.08, h: 280 },
      '200': { l: 0.87, c: 0.14, h: 280 },
      '300': { l: 0.78, c: 0.2, h: 280 },
      '400': { l: 0.67, c: 0.25, h: 280 },
      '500': { l: 0.56, c: 0.27, h: 280 },
      '600': { l: 0.48, c: 0.25, h: 280 },
      '700': { l: 0.4, c: 0.22, h: 280 },
      '800': { l: 0.32, c: 0.18, h: 280 },
      '900': { l: 0.24, c: 0.14, h: 280 },
      '950': { l: 0.17, c: 0.1, h: 280 },
    },
    // Accent: Orange (H: 30)
    accent: {
      '50': { l: 0.98, c: 0.03, h: 30 },
      '100': { l: 0.95, c: 0.08, h: 30 },
      '200': { l: 0.88, c: 0.15, h: 30 },
      '300': { l: 0.8, c: 0.22, h: 30 },
      '400': { l: 0.7, c: 0.27, h: 30 },
      '500': { l: 0.6, c: 0.3, h: 30 },
      '600': { l: 0.52, c: 0.28, h: 30 },
      '700': { l: 0.44, c: 0.24, h: 30 },
      '800': { l: 0.35, c: 0.19, h: 30 },
      '900': { l: 0.27, c: 0.14, h: 30 },
      '950': { l: 0.19, c: 0.1, h: 30 },
    },
    // Neutral: Warm gray (slight yellow tint)
    neutral: {
      '50': { l: 0.98, c: 0.01, h: 50 },
      '100': { l: 0.96, c: 0.01, h: 50 },
      '200': { l: 0.9, c: 0.01, h: 50 },
      '300': { l: 0.83, c: 0.01, h: 50 },
      '400': { l: 0.64, c: 0.01, h: 50 },
      '500': { l: 0.53, c: 0.01, h: 50 },
      '600': { l: 0.45, c: 0.01, h: 50 },
      '700': { l: 0.38, c: 0.01, h: 50 },
      '800': { l: 0.27, c: 0.01, h: 50 },
      '900': { l: 0.15, c: 0.01, h: 50 },
      '950': { l: 0.1, c: 0.01, h: 50 },
    },
    // Success: Teal (H: 180)
    success: {
      '50': { l: 0.97, c: 0.03, h: 180 },
      '100': { l: 0.93, c: 0.08, h: 180 },
      '200': { l: 0.85, c: 0.15, h: 180 },
      '300': { l: 0.75, c: 0.21, h: 180 },
      '400': { l: 0.63, c: 0.25, h: 180 },
      '500': { l: 0.53, c: 0.27, h: 180 },
      '600': { l: 0.45, c: 0.25, h: 180 },
      '700': { l: 0.38, c: 0.21, h: 180 },
      '800': { l: 0.3, c: 0.17, h: 180 },
      '900': { l: 0.22, c: 0.13, h: 180 },
      '950': { l: 0.15, c: 0.09, h: 180 },
    },
    // Warning: Amber (H: 45)
    warning: {
      '50': { l: 0.98, c: 0.03, h: 45 },
      '100': { l: 0.95, c: 0.08, h: 45 },
      '200': { l: 0.88, c: 0.15, h: 45 },
      '300': { l: 0.8, c: 0.22, h: 45 },
      '400': { l: 0.71, c: 0.27, h: 45 },
      '500': { l: 0.62, c: 0.3, h: 45 },
      '600': { l: 0.53, c: 0.28, h: 45 },
      '700': { l: 0.45, c: 0.24, h: 45 },
      '800': { l: 0.36, c: 0.19, h: 45 },
      '900': { l: 0.28, c: 0.14, h: 45 },
      '950': { l: 0.2, c: 0.1, h: 45 },
    },
    // Error: Magenta-red (H: 350)
    error: {
      '50': { l: 0.97, c: 0.03, h: 350 },
      '100': { l: 0.94, c: 0.08, h: 350 },
      '200': { l: 0.86, c: 0.15, h: 350 },
      '300': { l: 0.77, c: 0.22, h: 350 },
      '400': { l: 0.65, c: 0.27, h: 350 },
      '500': { l: 0.55, c: 0.3, h: 350 },
      '600': { l: 0.47, c: 0.27, h: 350 },
      '700': { l: 0.4, c: 0.23, h: 350 },
      '800': { l: 0.32, c: 0.18, h: 350 },
      '900': { l: 0.24, c: 0.14, h: 350 },
      '950': { l: 0.17, c: 0.1, h: 350 },
    },
  },
  composition: {
    border: {
      width: '1px',
      style: 'solid',
      color: { l: 0.87, c: 0.01, h: 50 },
      radius: '8px',
    },
    shadow: {
      x: '0px',
      y: '2px',
      blur: '8px',
      spread: '0px',
      color: { l: 0.5, c: 0.1, h: 280 },
    },
    spacing: {
      padding: '1.5rem',
      margin: '1.5rem',
      gap: '1rem',
    },
    typography: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: '1.6',
      letterSpacing: '0em',
    },
  },
  metadata: {
    targetUseCase: 'Design agencies, portfolios, marketing sites',
    characteristics: [
      'Bold colors with higher chroma',
      'Larger border radius (8px)',
      'Generous spacing',
      'Expressive typography (varied font weights)',
    ],
  },
};
