import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs-extra';
import * as path from 'path';
import { detectTailwind, type TailwindDetectionResult } from '../../src/detectors/tailwind.js';

describe('Tailwind Detector', () => {
  const testDir = path.join(process.cwd(), 'test-fixtures', 'tailwind-detection');

  beforeEach(async () => {
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  describe('Tailwind detection', () => {
    it('should detect Tailwind when tailwind.config.js exists', async () => {
      const projectDir = path.join(testDir, 'tailwind-js');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'tailwind.config.js'), 'module.exports = {}');

      const result = await detectTailwind(projectDir);

      expect(result.installed).toBe(true);
      expect(result.configPath).toBe(path.join(projectDir, 'tailwind.config.js'));
    });

    it('should detect Tailwind when tailwind.config.ts exists', async () => {
      const projectDir = path.join(testDir, 'tailwind-ts');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'tailwind.config.ts'), 'export default {}');

      const result = await detectTailwind(projectDir);

      expect(result.installed).toBe(true);
      expect(result.configPath).toBe(path.join(projectDir, 'tailwind.config.ts'));
    });

    it('should detect Tailwind when tailwind.config.mjs exists', async () => {
      const projectDir = path.join(testDir, 'tailwind-mjs');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'tailwind.config.mjs'), 'export default {}');

      const result = await detectTailwind(projectDir);

      expect(result.installed).toBe(true);
      expect(result.configPath).toBe(path.join(projectDir, 'tailwind.config.mjs'));
    });

    it('should prioritize .ts over .js when both exist', async () => {
      const projectDir = path.join(testDir, 'tailwind-multi');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'tailwind.config.js'), 'module.exports = {}');
      await fs.writeFile(path.join(projectDir, 'tailwind.config.ts'), 'export default {}');

      const result = await detectTailwind(projectDir);

      expect(result.installed).toBe(true);
      expect(result.configPath).toBe(path.join(projectDir, 'tailwind.config.ts'));
    });
  });

  describe('No Tailwind detection', () => {
    it('should return not installed when no config exists', async () => {
      const projectDir = path.join(testDir, 'no-tailwind');
      await fs.ensureDir(projectDir);

      const result = await detectTailwind(projectDir);

      expect(result.installed).toBe(false);
      expect(result.configPath).toBeUndefined();
    });

    it('should return not installed when directory does not exist', async () => {
      const projectDir = path.join(testDir, 'non-existent');

      const result = await detectTailwind(projectDir);

      expect(result.installed).toBe(false);
    });
  });

  describe('Version detection', () => {
    it('should extract Tailwind version from package.json', async () => {
      const projectDir = path.join(testDir, 'tailwind-versioned');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'tailwind.config.js'), 'module.exports = {}');
      await fs.writeJSON(path.join(projectDir, 'package.json'), {
        devDependencies: { tailwindcss: '^3.4.0' },
      });

      const result = await detectTailwind(projectDir);

      expect(result.installed).toBe(true);
      expect(result.version).toBe('^3.4.0');
    });

    it('should work without package.json', async () => {
      const projectDir = path.join(testDir, 'tailwind-no-package');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'tailwind.config.js'), 'module.exports = {}');

      const result = await detectTailwind(projectDir);

      expect(result.installed).toBe(true);
      expect(result.version).toBeUndefined();
    });
  });

  describe('Performance', () => {
    it('should complete detection in less than 100ms', async () => {
      const projectDir = path.join(testDir, 'performance-test');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'tailwind.config.js'), 'module.exports = {}');

      const startTime = Date.now();
      await detectTailwind(projectDir);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
