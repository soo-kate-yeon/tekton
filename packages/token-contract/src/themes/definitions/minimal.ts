import type { Preset } from '../types.js';

/**
 * Minimal Preset
 * Target: Blogs, documentation, content-focused sites
 * Characteristics: Low chroma, small radius, minimal spacing
 */
export const minimalPreset: Preset = {
  name: 'minimal',
  description: 'Clean and minimal design for content-focused applications',
  tokens: {
    // Primary: Dark gray (low chroma, L: 0.3)
    primary: {
      '50': { l: 0.96, c: 0.01, h: 0 },
      '100': { l: 0.92, c: 0.01, h: 0 },
      '200': { l: 0.84, c: 0.02, h: 0 },
      '300': { l: 0.74, c: 0.02, h: 0 },
      '400': { l: 0.62, c: 0.03, h: 0 },
      '500': { l: 0.5, c: 0.03, h: 0 },
      '600': { l: 0.42, c: 0.03, h: 0 },
      '700': { l: 0.35, c: 0.02, h: 0 },
      '800': { l: 0.27, c: 0.02, h: 0 },
      '900': { l: 0.19, c: 0.01, h: 0 },
      '950': { l: 0.13, c: 0.01, h: 0 },
    },
    // Neutral: Pure gray (chroma 0)
    neutral: {
      '50': { l: 0.98, c: 0, h: 0 },
      '100': { l: 0.96, c: 0, h: 0 },
      '200': { l: 0.9, c: 0, h: 0 },
      '300': { l: 0.83, c: 0, h: 0 },
      '400': { l: 0.64, c: 0, h: 0 },
      '500': { l: 0.53, c: 0, h: 0 },
      '600': { l: 0.45, c: 0, h: 0 },
      '700': { l: 0.38, c: 0, h: 0 },
      '800': { l: 0.27, c: 0, h: 0 },
      '900': { l: 0.15, c: 0, h: 0 },
      '950': { l: 0.1, c: 0, h: 0 },
    },
    // Success: Muted green (low chroma)
    success: {
      '50': { l: 0.96, c: 0.01, h: 140 },
      '100': { l: 0.92, c: 0.03, h: 140 },
      '200': { l: 0.84, c: 0.05, h: 140 },
      '300': { l: 0.74, c: 0.07, h: 140 },
      '400': { l: 0.62, c: 0.09, h: 140 },
      '500': { l: 0.5, c: 0.1, h: 140 },
      '600': { l: 0.42, c: 0.09, h: 140 },
      '700': { l: 0.35, c: 0.07, h: 140 },
      '800': { l: 0.27, c: 0.05, h: 140 },
      '900': { l: 0.19, c: 0.03, h: 140 },
      '950': { l: 0.13, c: 0.02, h: 140 },
    },
    // Warning: Muted yellow
    warning: {
      '50': { l: 0.97, c: 0.01, h: 60 },
      '100': { l: 0.93, c: 0.03, h: 60 },
      '200': { l: 0.86, c: 0.05, h: 60 },
      '300': { l: 0.77, c: 0.07, h: 60 },
      '400': { l: 0.67, c: 0.09, h: 60 },
      '500': { l: 0.57, c: 0.1, h: 60 },
      '600': { l: 0.48, c: 0.09, h: 60 },
      '700': { l: 0.4, c: 0.07, h: 60 },
      '800': { l: 0.31, c: 0.05, h: 60 },
      '900': { l: 0.23, c: 0.03, h: 60 },
      '950': { l: 0.16, c: 0.02, h: 60 },
    },
    // Error: Muted red
    error: {
      '50': { l: 0.96, c: 0.01, h: 0 },
      '100': { l: 0.92, c: 0.03, h: 0 },
      '200': { l: 0.84, c: 0.05, h: 0 },
      '300': { l: 0.74, c: 0.07, h: 0 },
      '400': { l: 0.62, c: 0.09, h: 0 },
      '500': { l: 0.52, c: 0.1, h: 0 },
      '600': { l: 0.44, c: 0.09, h: 0 },
      '700': { l: 0.37, c: 0.07, h: 0 },
      '800': { l: 0.29, c: 0.05, h: 0 },
      '900': { l: 0.21, c: 0.03, h: 0 },
      '950': { l: 0.14, c: 0.02, h: 0 },
    },
  },
  composition: {
    border: {
      width: '1px',
      style: 'solid',
      color: { l: 0.9, c: 0, h: 0 },
      radius: '2px',
    },
    shadow: {
      x: '0px',
      y: '1px',
      blur: '2px',
      color: { l: 0, c: 0, h: 0 },
    },
    spacing: {
      padding: '0.75rem',
      margin: '0.75rem',
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
    targetUseCase: 'Blogs, documentation, content-focused sites',
    characteristics: [
      'Low chroma colors (subtle, not vibrant)',
      'Small border radius (2px)',
      'Minimal spacing',
      'Simple typography (consistent font weights)',
    ],
  },
};
