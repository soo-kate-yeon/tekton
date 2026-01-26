import { defineConfig } from 'vitest/config';
export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
            include: ['tests/**/*.ts'],
            exclude: [
                'node_modules/**',
                'dist/**',
                '**/dist/**',
                'coverage/**',
                'tests/**',
                '**/*.test.ts',
                '**/*.test.tsx',
                '**/*.test.js',
                '**/*.config.ts',
                '**/*.config.js',
                '**/*.config.mjs',
                'examples/**',
                'eslint.config.js',
                'src/**', // Legacy code (moved to packages/core)
                'packages/**', // Packages have their own coverage
                '**/__tests__/**', // Test files
                '**/coverage/**', // Coverage reports
            ],
            thresholds: {
                lines: 85,
                functions: 85,
                branches: 84,
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
//# sourceMappingURL=vitest.config.js.map