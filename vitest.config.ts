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
        'tests/**',
        '**/*.test.ts',
        '**/*.config.ts',
        'examples/**',
        'eslint.config.js',
        'packages/playground-web/**', // WIP: Next.js 16 playground
        'packages/mcp-server/**', // Separate test suite
      ],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 85,
        statements: 85,
      },
    },
    include: ['tests/**/*.test.ts'],
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
