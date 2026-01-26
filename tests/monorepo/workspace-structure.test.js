import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import yaml from 'yaml';
describe('RED Phase: Monorepo Workspace Structure', () => {
    const rootDir = join(__dirname, '../..');
    describe('M1.1: Workspace Setup', () => {
        it('should have pnpm-workspace.yaml file', () => {
            const workspaceFile = join(rootDir, 'pnpm-workspace.yaml');
            expect(existsSync(workspaceFile)).toBe(true);
        });
        it('should configure packages/* pattern in pnpm-workspace.yaml', () => {
            const workspaceFile = join(rootDir, 'pnpm-workspace.yaml');
            const content = readFileSync(workspaceFile, 'utf-8');
            const config = yaml.parse(content);
            expect(config.packages).toBeDefined();
            expect(config.packages).toContain('packages/*');
        });
        it('should have root package.json marked as private', () => {
            const packageFile = join(rootDir, 'package.json');
            const pkg = JSON.parse(readFileSync(packageFile, 'utf-8'));
            expect(pkg.private).toBe(true);
        });
        it('should have workspace-level scripts in root package.json', () => {
            const packageFile = join(rootDir, 'package.json');
            const pkg = JSON.parse(readFileSync(packageFile, 'utf-8'));
            expect(pkg.scripts).toBeDefined();
            expect(pkg.scripts['test:all']).toBeDefined();
            expect(pkg.scripts['build:all']).toBeDefined();
            expect(pkg.scripts['lint:all']).toBeDefined();
        });
        it('should have TypeScript, ESLint, Prettier, Vitest as devDependencies', () => {
            const packageFile = join(rootDir, 'package.json');
            const pkg = JSON.parse(readFileSync(packageFile, 'utf-8'));
            expect(pkg.devDependencies).toBeDefined();
            expect(pkg.devDependencies['typescript']).toBeDefined();
            expect(pkg.devDependencies['eslint']).toBeDefined();
            expect(pkg.devDependencies['prettier']).toBeDefined();
            expect(pkg.devDependencies['vitest']).toBeDefined();
        });
    });
    describe('M1.2: Phase A Package Extraction', () => {
        it('should have packages directory', () => {
            const packagesDir = join(rootDir, 'packages');
            expect(existsSync(packagesDir)).toBe(true);
        });
        it('should have @tekton/core package', () => {
            const coreDir = join(rootDir, 'packages/core');
            expect(existsSync(coreDir)).toBe(true);
            const packageFile = join(coreDir, 'package.json');
            expect(existsSync(packageFile)).toBe(true);
            const pkg = JSON.parse(readFileSync(packageFile, 'utf-8'));
            expect(pkg.name).toBe('@tekton/core');
        });
        it('should have @tekton/mcp-server package', () => {
            const mcpServerDir = join(rootDir, 'packages/mcp-server');
            expect(existsSync(mcpServerDir)).toBe(true);
            const packageFile = join(mcpServerDir, 'package.json');
            expect(existsSync(packageFile)).toBe(true);
            const pkg = JSON.parse(readFileSync(packageFile, 'utf-8'));
            expect(pkg.name).toBe('@tekton/mcp-server');
        });
        it('should configure proper exports in each package', () => {
            const packages = ['core', 'mcp-server'];
            packages.forEach(pkgName => {
                const packageFile = join(rootDir, `packages/${pkgName}/package.json`);
                const pkg = JSON.parse(readFileSync(packageFile, 'utf-8'));
                expect(pkg.exports).toBeDefined();
                expect(pkg.exports['.']).toBeDefined();
                expect(pkg.exports['.']['import']).toBeDefined();
            });
        });
        it('should use workspace protocol for internal dependencies', () => {
            const mcpServerFile = join(rootDir, 'packages/mcp-server/package.json');
            if (existsSync(mcpServerFile)) {
                const pkg = JSON.parse(readFileSync(mcpServerFile, 'utf-8'));
                if (pkg.dependencies && pkg.dependencies['@tekton/core']) {
                    expect(pkg.dependencies['@tekton/core']).toMatch(/^workspace:/);
                }
            }
        });
    });
    describe('M1.3: Build & Test Verification', () => {
        it('should have node_modules with hoisted dependencies', () => {
            const nodeModules = join(rootDir, 'node_modules');
            expect(existsSync(nodeModules)).toBe(true);
            // Check for hoisted packages
            const vitest = join(nodeModules, 'vitest');
            expect(existsSync(vitest)).toBe(true);
        });
        it('should maintain original source structure in packages', () => {
            // Verify core package structure
            const coreSrc = join(rootDir, 'packages/core/src');
            expect(existsSync(coreSrc)).toBe(true);
            // Verify mcp-server package structure
            const mcpServerSrc = join(rootDir, 'packages/mcp-server/src');
            expect(existsSync(mcpServerSrc)).toBe(true);
        });
    });
    describe('M1.4: Common Configuration', () => {
        it('should have tsconfig.base.json', () => {
            const tsconfigBase = join(rootDir, 'tsconfig.base.json');
            expect(existsSync(tsconfigBase)).toBe(true);
            const config = JSON.parse(readFileSync(tsconfigBase, 'utf-8'));
            expect(config.compilerOptions).toBeDefined();
        });
        it('should have .eslintrc.base.json', () => {
            const eslintBase = join(rootDir, '.eslintrc.base.json');
            expect(existsSync(eslintBase)).toBe(true);
            const config = JSON.parse(readFileSync(eslintBase, 'utf-8'));
            expect(config.extends || config.rules).toBeDefined();
        });
        it('should have vitest.config.base.ts', () => {
            const vitestBase = join(rootDir, 'vitest.config.base.ts');
            expect(existsSync(vitestBase)).toBe(true);
        });
        it('should have packages extending base configs', () => {
            const coreTsconfig = join(rootDir, 'packages/core/tsconfig.json');
            if (existsSync(coreTsconfig)) {
                const config = JSON.parse(readFileSync(coreTsconfig, 'utf-8'));
                // If extends is defined, it should reference tsconfig.base.json
                if (config.extends) {
                    expect(config.extends).toContain('tsconfig.base.json');
                }
            }
        });
    });
});
//# sourceMappingURL=workspace-structure.test.js.map