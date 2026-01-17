import type { Preset } from '../types.js';

/**
 * Bold Preset
 * Target: E-commerce, conversion-focused apps, call-to-action heavy
 * Characteristics: Maximum chroma, vibrant colors, bold typography
 */
export const boldPreset: Preset = {
  name: 'bold',
  description: 'High-impact design with vibrant colors for maximum attention',
  tokens: {
    // Primary: Vibrant red (H: 0, high chroma)
    primary: {
      '50': { l: 0.97, c: 0.03, h: 0 },
      '100': { l: 0.94, c: 0.08, h: 0 },
      '200': { l: 0.87, c: 0.16, h: 0 },
      '300': { l: 0.78, c: 0.24, h: 0 },
      '400': { l: 0.67, c: 0.3, h: 0 },
      '500': { l: 0.57, c: 0.34, h: 0 },
      '600': { l: 0.49, c: 0.32, h: 0 },
      '700': { l: 0.41, c: 0.28, h: 0 },
      '800': { l: 0.33, c: 0.22, h: 0 },
      '900': { l: 0.25, c: 0.16, h: 0 },
      '950': { l: 0.18, c: 0.12, h: 0 },
    },
    // Secondary: Deep blue (H: 240)
    secondary: {
      '50': { l: 0.97, c: 0.03, h: 240 },
      '100': { l: 0.94, c: 0.08, h: 240 },
      '200': { l: 0.86, c: 0.15, h: 240 },
      '300': { l: 0.76, c: 0.22, h: 240 },
      '400': { l: 0.65, c: 0.28, h: 240 },
      '500': { l: 0.55, c: 0.32, h: 240 },
      '600': { l: 0.47, c: 0.3, h: 240 },
      '700': { l: 0.39, c: 0.26, h: 240 },
      '800': { l: 0.31, c: 0.2, h: 240 },
      '900': { l: 0.23, c: 0.15, h: 240 },
      '950': { l: 0.16, c: 0.11, h: 240 },
    },
    // Neutral: Cool gray
    neutral: {
      '50': { l: 0.98, c: 0.005, h: 240 },
      '100': { l: 0.96, c: 0.005, h: 240 },
      '200': { l: 0.9, c: 0.01, h: 240 },
      '300': { l: 0.83, c: 0.01, h: 240 },
      '400': { l: 0.64, c: 0.01, h: 240 },
      '500': { l: 0.53, c: 0.01, h: 240 },
      '600': { l: 0.45, c: 0.01, h: 240 },
      '700': { l: 0.38, c: 0.01, h: 240 },
      '800': { l: 0.27, c: 0.01, h: 240 },
      '900': { l: 0.15, c: 0.005, h: 240 },
      '950': { l: 0.1, c: 0.005, h: 240 },
    },
    // Success: Bright green (H: 120)
    success: {
      '50': { l: 0.97, c: 0.03, h: 120 },
      '100': { l: 0.93, c: 0.08, h: 120 },
      '200': { l: 0.85, c: 0.16, h: 120 },
      '300': { l: 0.75, c: 0.24, h: 120 },
      '400': { l: 0.63, c: 0.3, h: 120 },
      '500': { l: 0.53, c: 0.34, h: 120 },
      '600': { l: 0.45, c: 0.32, h: 120 },
      '700': { l: 0.38, c: 0.27, h: 120 },
      '800': { l: 0.3, c: 0.21, h: 120 },
      '900': { l: 0.22, c: 0.16, h: 120 },
      '950': { l: 0.15, c: 0.11, h: 120 },
    },
    // Warning: Bright orange (H: 35)
    warning: {
      '50': { l: 0.98, c: 0.03, h: 35 },
      '100': { l: 0.95, c: 0.08, h: 35 },
      '200': { l: 0.88, c: 0.16, h: 35 },
      '300': { l: 0.8, c: 0.24, h: 35 },
      '400': { l: 0.71, c: 0.3, h: 35 },
      '500': { l: 0.62, c: 0.34, h: 35 },
      '600': { l: 0.53, c: 0.32, h: 35 },
      '700': { l: 0.45, c: 0.27, h: 35 },
      '800': { l: 0.36, c: 0.21, h: 35 },
      '900': { l: 0.28, c: 0.16, h: 35 },
      '950': { l: 0.2, c: 0.11, h: 35 },
    },
    // Error: Dark red (H: 0, L: 0.4)
    error: {
      '50': { l: 0.97, c: 0.03, h: 0 },
      '100': { l: 0.94, c: 0.08, h: 0 },
      '200': { l: 0.86, c: 0.16, h: 0 },
      '300': { l: 0.76, c: 0.24, h: 0 },
      '400': { l: 0.64, c: 0.3, h: 0 },
      '500': { l: 0.54, c: 0.34, h: 0 },
      '600': { l: 0.46, c: 0.32, h: 0 },
      '700': { l: 0.39, c: 0.27, h: 0 },
      '800': { l: 0.31, c: 0.21, h: 0 },
      '900': { l: 0.23, c: 0.16, h: 0 },
      '950': { l: 0.16, c: 0.11, h: 0 },
    },
  },
  composition: {
    border: {
      width: '2px',
      style: 'solid',
      color: { l: 0.86, c: 0.01, h: 240 },
      radius: '6px',
    },
    shadow: {
      x: '0px',
      y: '2px',
      blur: '6px',
      spread: '0px',
      color: { l: 0, c: 0, h: 0 },
    },
    spacing: {
      padding: '0.875rem',
      margin: '0.875rem',
      gap: '0.625rem',
    },
    typography: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: '1.4',
      letterSpacing: '0em',
    },
  },
  metadata: {
    targetUseCase: 'E-commerce, conversion-focused apps, call-to-action heavy',
    characteristics: [
      'Maximum chroma for attention',
      'Medium border radius (6px)',
      'Tight spacing for density',
      'Bold typography (heavier font weights)',
    ],
  },
};
