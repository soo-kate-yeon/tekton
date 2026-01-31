/**
 * Storybook Preview Configuration
 * [SPEC-UI-001] [TAG-019]
 *
 * 글로벌 데코레이터, 파라미터, 테마 설정
 */

import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import '../styles/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true, // 테마 시스템을 사용하므로 비활성화
    },
    a11y: {
      // Axe accessibility checks configuration
      element: '#storybook-root',
      config: {},
      options: {},
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: 'linear-minimal-light',
        dark: 'linear-minimal-dark',
      },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],
};

export default preview;
