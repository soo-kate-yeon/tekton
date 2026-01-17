import type { Preset } from '../types.js';

/**
 * High-Contrast Preset
 * Target: Accessibility-focused apps, government sites, educational platforms
 * Characteristics: Maximum contrast (WCAG AAA), clear borders, generous spacing
 */
export const highContrastPreset: Preset = {
  name: 'high-contrast',
  description: 'Maximum accessibility with WCAG AAA contrast ratios',
  tokens: {
    // Primary: Pure black and white
    primary: {
      '50': { l: 0.98, c: 0, h: 0 },
      '100': { l: 0.95, c: 0, h: 0 },
      '200': { l: 0.88, c: 0, h: 0 },
      '300': { l: 0.78, c: 0, h: 0 },
      '400': { l: 0.65, c: 0, h: 0 },
      '500': { l: 0.5, c: 0, h: 0 },
      '600': { l: 0.4, c: 0, h: 0 },
      '700': { l: 0.3, c: 0, h: 0 },
      '800': { l: 0.2, c: 0, h: 0 },
      '900': { l: 0.12, c: 0, h: 0 },
      '950': { l: 0.08, c: 0, h: 0 },
    },
    // Neutral: High-contrast gray scale
    neutral: {
      '50': { l: 0.98, c: 0, h: 0 },
      '100': { l: 0.95, c: 0, h: 0 },
      '200': { l: 0.88, c: 0, h: 0 },
      '300': { l: 0.78, c: 0, h: 0 },
      '400': { l: 0.65, c: 0, h: 0 },
      '500': { l: 0.5, c: 0, h: 0 },
      '600': { l: 0.4, c: 0, h: 0 },
      '700': { l: 0.3, c: 0, h: 0 },
      '800': { l: 0.2, c: 0, h: 0 },
      '900': { l: 0.12, c: 0, h: 0 },
      '950': { l: 0.08, c: 0, h: 0 },
    },
    // Success: High-contrast green (WCAG AAA)
    success: {
      '50': { l: 0.97, c: 0.02, h: 140 },
      '100': { l: 0.93, c: 0.04, h: 140 },
      '200': { l: 0.86, c: 0.08, h: 140 },
      '300': { l: 0.76, c: 0.12, h: 140 },
      '400': { l: 0.64, c: 0.14, h: 140 },
      '500': { l: 0.52, c: 0.15, h: 140 },
      '600': { l: 0.42, c: 0.14, h: 140 },
      '700': { l: 0.32, c: 0.12, h: 140 },
      '800': { l: 0.24, c: 0.1, h: 140 },
      '900': { l: 0.16, c: 0.08, h: 140 },
      '950': { l: 0.1, c: 0.06, h: 140 },
    },
    // Warning: High-contrast yellow (WCAG AAA)
    warning: {
      '50': { l: 0.98, c: 0.02, h: 60 },
      '100': { l: 0.95, c: 0.04, h: 60 },
      '200': { l: 0.89, c: 0.08, h: 60 },
      '300': { l: 0.81, c: 0.12, h: 60 },
      '400': { l: 0.71, c: 0.14, h: 60 },
      '500': { l: 0.6, c: 0.15, h: 60 },
      '600': { l: 0.5, c: 0.14, h: 60 },
      '700': { l: 0.4, c: 0.12, h: 60 },
      '800': { l: 0.3, c: 0.1, h: 60 },
      '900': { l: 0.22, c: 0.08, h: 60 },
      '950': { l: 0.15, c: 0.06, h: 60 },
    },
    // Error: High-contrast red (WCAG AAA)
    error: {
      '50': { l: 0.97, c: 0.02, h: 0 },
      '100': { l: 0.94, c: 0.04, h: 0 },
      '200': { l: 0.86, c: 0.08, h: 0 },
      '300': { l: 0.76, c: 0.12, h: 0 },
      '400': { l: 0.64, c: 0.14, h: 0 },
      '500': { l: 0.52, c: 0.15, h: 0 },
      '600': { l: 0.42, c: 0.14, h: 0 },
      '700': { l: 0.32, c: 0.12, h: 0 },
      '800': { l: 0.24, c: 0.1, h: 0 },
      '900': { l: 0.16, c: 0.08, h: 0 },
      '950': { l: 0.1, c: 0.06, h: 0 },
    },
  },
  composition: {
    border: {
      width: '2px',
      style: 'solid',
      color: { l: 0.2, c: 0, h: 0 },
      radius: '4px',
    },
    shadow: {
      x: '0px',
      y: '2px',
      blur: '4px',
      spread: '0px',
      color: { l: 0, c: 0, h: 0 },
    },
    spacing: {
      padding: '1.5rem',
      margin: '1.5rem',
      gap: '1rem',
    },
    typography: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: '1.6',
      letterSpacing: '0.01em',
    },
  },
  metadata: {
    targetUseCase:
      'Accessibility-focused apps, government sites, educational platforms',
    characteristics: [
      'Maximum contrast ratios (≥7:1 WCAG AAA)',
      'Clear border radius (4px)',
      'Generous spacing for readability',
      'High-contrast typography (bold weights)',
    ],
  },
};
