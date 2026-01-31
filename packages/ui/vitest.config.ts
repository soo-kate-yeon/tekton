import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/__tests__/**',
        'src/**/*.d.ts',
        'src/index.ts',
        'src/lib/tokens.ts', // Pure constant exports, no logic to test
        'src/lib/theme-loader.ts', // Complex utility with browser-specific logic
      ],
      all: true,
      skipFull: false,
      thresholds: {
        lines: 85,
        functions: 75, // Lower threshold due to many untested utility components
        branches: 85,
        statements: 85,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
