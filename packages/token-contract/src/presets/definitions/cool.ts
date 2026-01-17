import type { Preset } from '../types.js';

/**
 * Cool Preset
 * Target: Tech startups, fintech, healthcare
 * Characteristics: Cool hues, sharp borders, precise spacing
 */
export const coolPreset: Preset = {
  name: 'cool',
  description: 'Cool and professional design with blue/cyan tones',
  tokens: {
    // Primary: Cool blue (H: 210)
    primary: {
      '50': { l: 0.97, c: 0.02, h: 210 },
      '100': { l: 0.94, c: 0.06, h: 210 },
      '200': { l: 0.87, c: 0.11, h: 210 },
      '300': { l: 0.77, c: 0.16, h: 210 },
      '400': { l: 0.66, c: 0.2, h: 210 },
      '500': { l: 0.56, c: 0.22, h: 210 },
      '600': { l: 0.48, c: 0.2, h: 210 },
      '700': { l: 0.41, c: 0.17, h: 210 },
      '800': { l: 0.33, c: 0.14, h: 210 },
      '900': { l: 0.25, c: 0.1, h: 210 },
      '950': { l: 0.17, c: 0.07, h: 210 },
    },
    // Secondary: Cyan (H: 190)
    secondary: {
      '50': { l: 0.97, c: 0.02, h: 190 },
      '100': { l: 0.94, c: 0.06, h: 190 },
      '200': { l: 0.86, c: 0.11, h: 190 },
      '300': { l: 0.76, c: 0.16, h: 190 },
      '400': { l: 0.65, c: 0.2, h: 190 },
      '500': { l: 0.55, c: 0.22, h: 190 },
      '600': { l: 0.47, c: 0.2, h: 190 },
      '700': { l: 0.4, c: 0.17, h: 190 },
      '800': { l: 0.32, c: 0.14, h: 190 },
      '900': { l: 0.24, c: 0.1, h: 190 },
      '950': { l: 0.16, c: 0.07, h: 190 },
    },
    // Neutral: Cool gray (slight blue tint)
    neutral: {
      '50': { l: 0.98, c: 0.01, h: 210 },
      '100': { l: 0.96, c: 0.01, h: 210 },
      '200': { l: 0.9, c: 0.015, h: 210 },
      '300': { l: 0.83, c: 0.015, h: 210 },
      '400': { l: 0.64, c: 0.015, h: 210 },
      '500': { l: 0.53, c: 0.015, h: 210 },
      '600': { l: 0.45, c: 0.015, h: 210 },
      '700': { l: 0.38, c: 0.015, h: 210 },
      '800': { l: 0.27, c: 0.01, h: 210 },
      '900': { l: 0.15, c: 0.01, h: 210 },
      '950': { l: 0.1, c: 0.01, h: 210 },
    },
    // Success: Cool green (H: 160)
    success: {
      '50': { l: 0.97, c: 0.02, h: 160 },
      '100': { l: 0.93, c: 0.06, h: 160 },
      '200': { l: 0.86, c: 0.11, h: 160 },
      '300': { l: 0.76, c: 0.16, h: 160 },
      '400': { l: 0.65, c: 0.2, h: 160 },
      '500': { l: 0.55, c: 0.22, h: 160 },
      '600': { l: 0.47, c: 0.2, h: 160 },
      '700': { l: 0.4, c: 0.17, h: 160 },
      '800': { l: 0.32, c: 0.14, h: 160 },
      '900': { l: 0.24, c: 0.1, h: 160 },
      '950': { l: 0.16, c: 0.07, h: 160 },
    },
    // Warning: Cool yellow (H: 65)
    warning: {
      '50': { l: 0.98, c: 0.02, h: 65 },
      '100': { l: 0.95, c: 0.06, h: 65 },
      '200': { l: 0.89, c: 0.11, h: 65 },
      '300': { l: 0.81, c: 0.16, h: 65 },
      '400': { l: 0.72, c: 0.2, h: 65 },
      '500': { l: 0.63, c: 0.22, h: 65 },
      '600': { l: 0.54, c: 0.2, h: 65 },
      '700': { l: 0.46, c: 0.17, h: 65 },
      '800': { l: 0.37, c: 0.14, h: 65 },
      '900': { l: 0.29, c: 0.1, h: 65 },
      '950': { l: 0.21, c: 0.07, h: 65 },
    },
    // Error: Cool red (H: 355)
    error: {
      '50': { l: 0.97, c: 0.02, h: 355 },
      '100': { l: 0.94, c: 0.06, h: 355 },
      '200': { l: 0.87, c: 0.11, h: 355 },
      '300': { l: 0.77, c: 0.16, h: 355 },
      '400': { l: 0.66, c: 0.2, h: 355 },
      '500': { l: 0.56, c: 0.22, h: 355 },
      '600': { l: 0.48, c: 0.2, h: 355 },
      '700': { l: 0.41, c: 0.17, h: 355 },
      '800': { l: 0.33, c: 0.14, h: 355 },
      '900': { l: 0.25, c: 0.1, h: 355 },
      '950': { l: 0.17, c: 0.07, h: 355 },
    },
  },
  composition: {
    border: {
      width: '1px',
      style: 'solid',
      color: { l: 0.9, c: 0.015, h: 210 },
      radius: '3px',
    },
    shadow: {
      x: '0px',
      y: '1px',
      blur: '3px',
      spread: '0px',
      color: { l: 0.5, c: 0.05, h: 210 },
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
  },
  metadata: {
    targetUseCase: 'Tech startups, fintech, healthcare',
    characteristics: [
      'Cool hue bias (180-300 range emphasis)',
      'Sharp border radius (3px)',
      'Precise spacing',
      'Clean typography (modern font weights)',
    ],
  },
};
