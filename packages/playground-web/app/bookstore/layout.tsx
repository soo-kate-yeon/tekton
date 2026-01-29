'use client';

import { oklchToCSSV2 } from '@/lib/theme-utils';
import { BLUE_BOTTLE_THEME } from '@/lib/blue-bottle-theme';

export default function BookstoreLayout({ children }: { children: React.ReactNode }) {
  // Generate CSS variables from the theme
  // We need to map the theme tokens to CSS variables that match what the components expect.
  // The theme definition uses nested objects, we'll traverse and create flattened variables.

  // Helper to generate atomic color variables
  const generateColorVars = () => {
    const vars: Record<string, string> = {};
    const { brand, neutral, white } = BLUE_BOTTLE_THEME.tokens.atomic.color;

    // Brand
    Object.entries(brand).forEach(([shade, value]) => {
      vars[`--atomic-color-brand-${shade}`] = oklchToCSSV2(value);
    });

    // Neutral
    Object.entries(neutral).forEach(([shade, value]) => {
      vars[`--atomic-color-neutral-${shade}`] = oklchToCSSV2(value);
    });

    // White
    vars['--atomic-color-white'] = oklchToCSSV2(white);

    return vars;
  };

  const cssVars = {
    ...generateColorVars(),
    // Semantic Background
    '--atomic-semantic-background-canvas': 'var(--atomic-color-neutral-50)',
    '--atomic-semantic-background-surface-default': 'var(--atomic-color-white)',
    '--atomic-semantic-background-surface-subtle': 'var(--atomic-color-neutral-50)',
    '--atomic-semantic-background-surface-emphasis': 'var(--atomic-color-neutral-900)',

    // Semantic Text
    '--atomic-semantic-text-primary': 'var(--atomic-color-neutral-900)',
    '--atomic-semantic-text-secondary': 'var(--atomic-color-neutral-500)',
    '--atomic-semantic-text-brand': 'var(--atomic-color-brand-500)',

    // Semantic Border
    '--atomic-semantic-border-default-subtle': 'var(--atomic-color-neutral-100)',
    '--atomic-semantic-border-default-default': 'var(--atomic-color-neutral-200)',

    // Radius
    '--atomic-radius-md': BLUE_BOTTLE_THEME.tokens.atomic.radius.md,
    '--atomic-radius-full': BLUE_BOTTLE_THEME.tokens.atomic.radius.full,
    '--atomic-radius-lg': BLUE_BOTTLE_THEME.tokens.atomic.radius.lg,

    // Fonts
    '--font-sans': BLUE_BOTTLE_THEME.typography.fontFamily.sans,
    '--font-serif': BLUE_BOTTLE_THEME.typography.fontFamily.serif,
  };

  return (
    <div
      style={cssVars as React.CSSProperties}
      className="font-sans min-h-screen bg-[var(--atomic-color-neutral-50)] text-[var(--atomic-color-neutral-900)] selection:bg-[var(--atomic-color-brand-500)] selection:text-white"
    >
      {children}
    </div>
  );
}
