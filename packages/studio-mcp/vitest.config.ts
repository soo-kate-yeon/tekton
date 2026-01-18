import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
        'src/server/index.ts', // Entry point that starts server, not testable
      ],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 80, // Lower threshold for branches due to error handling paths
        statements: 85,
      },
    },
  },
});
