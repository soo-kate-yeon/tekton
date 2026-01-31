/**
 * Storybook Tekton Brand Theme
 * [SPEC-UI-001] [TAG-019]
 *
 * Storybook UI를 Tekton 브랜드로 커스터마이징
 */

import { create } from '@storybook/theming/create';

export default create({
  base: 'light',
  brandTitle: 'Tekton UI',
  brandUrl: 'https://github.com/tektonlabs/tekton',
  brandTarget: '_blank',

  // Typography
  fontBase: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
  fontCode: '"JetBrains Mono", "Fira Code", monospace',

  // Colors (Tekton Linear Minimal Light 테마 기반)
  colorPrimary: '#6366f1', // indigo-500
  colorSecondary: '#6366f1',

  // UI
  appBg: '#fafafa',
  appContentBg: '#ffffff',
  appBorderColor: '#e5e7eb',
  appBorderRadius: 8,

  // Text colors
  textColor: '#1f2937',
  textInverseColor: '#ffffff',

  // Toolbar default and active colors
  barTextColor: '#6b7280',
  barSelectedColor: '#6366f1',
  barBg: '#ffffff',

  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#e5e7eb',
  inputTextColor: '#1f2937',
  inputBorderRadius: 6,
});
