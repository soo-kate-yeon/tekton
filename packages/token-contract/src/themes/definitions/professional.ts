import type { Preset } from '../types.js';

/**
 * Professional Preset
 * Target: Corporate websites, SaaS dashboards, B2B applications
 * Characteristics: High contrast, conservative styling, professional typography
 */
export const professionalPreset: Preset = {
  name: 'professional',
  description: 'Corporate and professional design with high contrast and conservative styling',
  tokens: {
    // Primary: Blue (H: 220, moderate chroma)
    primary: {
      '50': { l: 0.97, c: 0.02, h: 220 },
      '100': { l: 0.94, c: 0.05, h: 220 },
      '200': { l: 0.86, c: 0.08, h: 220 },
      '300': { l: 0.76, c: 0.12, h: 220 },
      '400': { l: 0.64, c: 0.14, h: 220 },
      '500': { l: 0.53, c: 0.15, h: 220 },
      '600': { l: 0.45, c: 0.15, h: 220 },
      '700': { l: 0.38, c: 0.14, h: 220 },
      '800': { l: 0.3, c: 0.12, h: 220 },
      '900': { l: 0.22, c: 0.1, h: 220 },
      '950': { l: 0.15, c: 0.08, h: 220 },
    },
    // Neutral: Pure gray (chroma near 0)
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
    // Success: Green (H: 140)
    success: {
      '50': { l: 0.97, c: 0.02, h: 140 },
      '100': { l: 0.93, c: 0.05, h: 140 },
      '200': { l: 0.85, c: 0.1, h: 140 },
      '300': { l: 0.75, c: 0.14, h: 140 },
      '400': { l: 0.62, c: 0.16, h: 140 },
      '500': { l: 0.52, c: 0.17, h: 140 },
      '600': { l: 0.44, c: 0.16, h: 140 },
      '700': { l: 0.37, c: 0.14, h: 140 },
      '800': { l: 0.29, c: 0.12, h: 140 },
      '900': { l: 0.21, c: 0.1, h: 140 },
      '950': { l: 0.14, c: 0.08, h: 140 },
    },
    // Warning: Yellow (H: 60) - adjusted for WCAG AA
    warning: {
      '50': { l: 0.98, c: 0.02, h: 60 },
      '100': { l: 0.95, c: 0.05, h: 60 },
      '200': { l: 0.88, c: 0.1, h: 60 },
      '300': { l: 0.78, c: 0.14, h: 60 },
      '400': { l: 0.65, c: 0.16, h: 60 },
      '500': { l: 0.55, c: 0.17, h: 60 },
      '600': { l: 0.45, c: 0.16, h: 60 },
      '700': { l: 0.38, c: 0.14, h: 60 },
      '800': { l: 0.3, c: 0.12, h: 60 },
      '900': { l: 0.22, c: 0.1, h: 60 },
      '950': { l: 0.15, c: 0.08, h: 60 },
    },
    // Error: Red (H: 0)
    error: {
      '50': { l: 0.97, c: 0.02, h: 0 },
      '100': { l: 0.94, c: 0.05, h: 0 },
      '200': { l: 0.86, c: 0.1, h: 0 },
      '300': { l: 0.76, c: 0.14, h: 0 },
      '400': { l: 0.64, c: 0.16, h: 0 },
      '500': { l: 0.54, c: 0.17, h: 0 },
      '600': { l: 0.46, c: 0.16, h: 0 },
      '700': { l: 0.39, c: 0.14, h: 0 },
      '800': { l: 0.31, c: 0.12, h: 0 },
      '900': { l: 0.23, c: 0.1, h: 0 },
      '950': { l: 0.16, c: 0.08, h: 0 },
    },
  },
  composition: {
    border: {
      width: '1px',
      style: 'solid',
      color: { l: 0.9, c: 0, h: 0 },
      radius: '4px',
    },
    shadow: {
      x: '0px',
      y: '1px',
      blur: '3px',
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
  },
  metadata: {
    targetUseCase: 'Corporate websites, SaaS dashboards, B2B applications',
    characteristics: [
      'High contrast for readability (WCAG AAA where possible)',
      'Conservative border radius (4px)',
      'Moderate spacing density',
      'Professional typography (medium font weights)',
    ],
  },
};
