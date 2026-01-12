import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs-extra';
import * as path from 'path';
import { detectFramework, Framework, type FrameworkDetectionResult } from '../../src/detectors/framework.js';

describe('Framework Detector', () => {
  const testDir = path.join(process.cwd(), 'test-fixtures', 'framework-detection');

  beforeEach(async () => {
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  describe('Next.js detection', () => {
    it('should detect Next.js when next.config.js exists', async () => {
      const projectDir = path.join(testDir, 'nextjs-js');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'next.config.js'), 'module.exports = {}');

      const result = await detectFramework(projectDir);

      expect(result.framework).toBe(Framework.NextJS);
      expect(result.configPath).toBe(path.join(projectDir, 'next.config.js'));
      // Version is undefined without package.json
      expect(result.version).toBeUndefined();
    });

    it('should detect Next.js when next.config.mjs exists', async () => {
      const projectDir = path.join(testDir, 'nextjs-mjs');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'next.config.mjs'), 'export default {}');

      const result = await detectFramework(projectDir);

      expect(result.framework).toBe(Framework.NextJS);
      expect(result.configPath).toBe(path.join(projectDir, 'next.config.mjs'));
    });

    it('should detect Next.js when next.config.ts exists', async () => {
      const projectDir = path.join(testDir, 'nextjs-ts');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'next.config.ts'), 'export default {}');

      const result = await detectFramework(projectDir);

      expect(result.framework).toBe(Framework.NextJS);
      expect(result.configPath).toBe(path.join(projectDir, 'next.config.ts'));
    });

    it('should extract Next.js version from package.json', async () => {
      const projectDir = path.join(testDir, 'nextjs-versioned');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'next.config.js'), 'module.exports = {}');
      await fs.writeJSON(path.join(projectDir, 'package.json'), {
        dependencies: { next: '^14.2.0' },
      });

      const result = await detectFramework(projectDir);

      expect(result.framework).toBe(Framework.NextJS);
      expect(result.version).toBe('^14.2.0');
    });
  });

  describe('Vite detection', () => {
    it('should detect Vite when vite.config.js exists', async () => {
      const projectDir = path.join(testDir, 'vite-js');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'vite.config.js'), 'export default {}');

      const result = await detectFramework(projectDir);

      expect(result.framework).toBe(Framework.Vite);
      expect(result.configPath).toBe(path.join(projectDir, 'vite.config.js'));
    });

    it('should detect Vite when vite.config.ts exists', async () => {
      const projectDir = path.join(testDir, 'vite-ts');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'vite.config.ts'), 'export default {}');

      const result = await detectFramework(projectDir);

      expect(result.framework).toBe(Framework.Vite);
      expect(result.configPath).toBe(path.join(projectDir, 'vite.config.ts'));
    });

    it('should extract Vite version from package.json', async () => {
      const projectDir = path.join(testDir, 'vite-versioned');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'vite.config.ts'), 'export default {}');
      await fs.writeJSON(path.join(projectDir, 'package.json'), {
        devDependencies: { vite: '^5.0.0' },
      });

      const result = await detectFramework(projectDir);

      expect(result.framework).toBe(Framework.Vite);
      expect(result.version).toBe('^5.0.0');
    });
  });

  describe('Remix detection', () => {
    it('should detect Remix when remix.config.js exists', async () => {
      const projectDir = path.join(testDir, 'remix-js');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'remix.config.js'), 'module.exports = {}');

      const result = await detectFramework(projectDir);

      expect(result.framework).toBe(Framework.Remix);
      expect(result.configPath).toBe(path.join(projectDir, 'remix.config.js'));
    });

    it('should detect Remix when remix.config.ts exists', async () => {
      const projectDir = path.join(testDir, 'remix-ts');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'remix.config.ts'), 'export default {}');

      const result = await detectFramework(projectDir);

      expect(result.framework).toBe(Framework.Remix);
      expect(result.configPath).toBe(path.join(projectDir, 'remix.config.ts'));
    });

    it('should extract Remix version from package.json', async () => {
      const projectDir = path.join(testDir, 'remix-versioned');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'remix.config.js'), 'module.exports = {}');
      await fs.writeJSON(path.join(projectDir, 'package.json'), {
        dependencies: { '@remix-run/react': '^2.0.0' },
      });

      const result = await detectFramework(projectDir);

      expect(result.framework).toBe(Framework.Remix);
      expect(result.version).toBe('^2.0.0');
    });
  });

  describe('Priority handling', () => {
    it('should prioritize Next.js when multiple frameworks detected', async () => {
      const projectDir = path.join(testDir, 'multi-framework');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'next.config.js'), 'module.exports = {}');
      await fs.writeFile(path.join(projectDir, 'vite.config.ts'), 'export default {}');

      const result = await detectFramework(projectDir);

      expect(result.framework).toBe(Framework.NextJS);
    });

    it('should prioritize Vite over Remix when both detected', async () => {
      const projectDir = path.join(testDir, 'vite-remix');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'vite.config.ts'), 'export default {}');
      await fs.writeFile(path.join(projectDir, 'remix.config.js'), 'module.exports = {}');

      const result = await detectFramework(projectDir);

      expect(result.framework).toBe(Framework.Vite);
    });
  });

  describe('No framework detection', () => {
    it('should return null when no framework config exists', async () => {
      const projectDir = path.join(testDir, 'no-framework');
      await fs.ensureDir(projectDir);

      const result = await detectFramework(projectDir);

      expect(result.framework).toBeNull();
      expect(result.configPath).toBeUndefined();
      expect(result.version).toBeUndefined();
    });

    it('should return null when directory does not exist', async () => {
      const projectDir = path.join(testDir, 'non-existent');

      const result = await detectFramework(projectDir);

      expect(result.framework).toBeNull();
    });
  });

  describe('Performance', () => {
    it('should complete detection in less than 1 second', async () => {
      const projectDir = path.join(testDir, 'performance-test');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'next.config.js'), 'module.exports = {}');

      const startTime = Date.now();
      await detectFramework(projectDir);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});
