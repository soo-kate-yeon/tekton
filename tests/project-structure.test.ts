import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('Project Structure - TASK-001', () => {
  const rootDir = join(__dirname, '..');

  it('should have package.json with correct metadata', () => {
    const packageJsonPath = join(rootDir, 'package.json');
    expect(existsSync(packageJsonPath)).toBe(true);

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

    expect(packageJson.name).toBe('tekton');
    expect(packageJson.version).toBeDefined();
    expect(packageJson.type).toBe('module');
    // Monorepo root is now private, packages have main/types
    expect(packageJson.private).toBe(true);
  });

  it('should have tsconfig.json with strict TypeScript configuration', () => {
    const tsconfigPath = join(rootDir, 'tsconfig.json');
    expect(existsSync(tsconfigPath)).toBe(true);

    const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'));

    expect(tsconfig.compilerOptions.strict).toBe(true);
    expect(tsconfig.compilerOptions.target).toBeDefined();
    expect(tsconfig.compilerOptions.module).toBeDefined();
    expect(tsconfig.compilerOptions.moduleResolution).toBe('bundler');
  });

  it('should have src directory structure', () => {
    const srcDir = join(rootDir, 'src');
    expect(existsSync(srcDir)).toBe(true);
  });

  it('should have tests directory structure', () => {
    const testsDir = join(rootDir, 'tests');
    expect(existsSync(testsDir)).toBe(true);
  });
});
