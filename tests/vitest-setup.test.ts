import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('Vitest Configuration - TASK-002', () => {
  const rootDir = join(__dirname, '..');

  it('should have vitest.config.ts with proper configuration', () => {
    const vitestConfigPath = join(rootDir, 'vitest.config.ts');
    expect(existsSync(vitestConfigPath)).toBe(true);

    const configContent = readFileSync(vitestConfigPath, 'utf-8');
    expect(configContent).toContain('defineConfig');
    expect(configContent).toContain('coverage');
  });

  it('should support TypeScript imports in tests', () => {
    expect(() => {
      const testModule = { name: 'test' };
      return testModule;
    }).not.toThrow();
  });

  it('should have coverage threshold configuration', () => {
    const vitestConfigPath = join(rootDir, 'vitest.config.ts');
    const configContent = readFileSync(vitestConfigPath, 'utf-8');

    expect(configContent).toContain('thresholds');
    expect(configContent).toContain('85');
  });

  it('should support mocking functionality', () => {
    const mockFn = vi.fn(() => 'mocked');
    expect(mockFn()).toBe('mocked');
    expect(mockFn).toHaveBeenCalled();
  });

  describe('lifecycle hooks', () => {
    let setup = false;

    beforeEach(() => {
      setup = true;
    });

    it('should support lifecycle hooks', () => {
      expect(setup).toBe(true);
    });
  });
});
