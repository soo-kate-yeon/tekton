/**
 * Tailwind CSS Configuration for @tekton/ui
 * [SPEC-UI-001] shadcn-ui Fork & Token Integration
 */

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './.storybook/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Tekton 토큰은 CSS Variables로 처리되므로 Tailwind 테마 확장 불필요
      // arbitrary values로 var(--tekton-*) 사용
    },
  },
  plugins: [],
};

export default config;
