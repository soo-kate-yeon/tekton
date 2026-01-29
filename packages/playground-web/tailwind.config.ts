import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Times', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
