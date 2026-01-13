import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@tekton/contracts': path.resolve(__dirname, '../contracts/src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/index.ts',
        'src/**/*.d.ts',
        'src/**/types.ts',
        // Exclude CLI command handlers (they have @istanbul ignore next)
        'src/commands/*Command',
      ],
      // Exclude CLI command handlers (console.log, process.exit) from coverage
      // These are tested via integration tests
      excludeAfterRemap: true,
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
        // Per-file thresholds for core logic (higher requirement)
        perFile: true,
      },
      // Enforce higher coverage for non-CLI files
      thresholdAutoUpdate: false,
    },
  },
});
