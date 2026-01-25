import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/dist/**',
        'coverage/**',
        'tests/**',
        '**/*.test.ts',
        '**/*.test.js',
        '**/*.config.ts',
        '**/*.config.js',
        '**/*.config.mjs',
        'examples/**',
        'eslint.config.js',
        'src/**', // Legacy code (moved to packages/core)
        'packages/.archived/**', // Archived packages
        'packages/playground-web/**', // WIP: Next.js 16 playground
        'packages/mcp-server/**', // Separate test suite
        '**/__tests__/**', // Test files
        '**/coverage/**', // Coverage reports
      ],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 85,
        statements: 85,
      },
    },
    include: ['tests/**/*.test.ts', 'packages/core/__tests__/**/*.test.ts'],
    exclude: [
      'node_modules/**',
      'dist/**',
      'tests/accessibility/**', // Playwright 접근성 테스트 제외
    ],
    typecheck: {
      enabled: false,
    },
  },
});
