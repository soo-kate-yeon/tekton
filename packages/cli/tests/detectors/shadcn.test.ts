import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs-extra';
import * as path from 'path';
import { detectShadcn, type ShadcnDetectionResult } from '../../src/detectors/shadcn.js';

describe('shadcn Detector', () => {
  const testDir = path.join(process.cwd(), 'test-fixtures', 'shadcn-detection');

  beforeEach(async () => {
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  describe('shadcn detection', () => {
    it('should detect shadcn when components.json exists', async () => {
      const projectDir = path.join(testDir, 'shadcn-installed');
      await fs.ensureDir(projectDir);
      const componentsJson = {
        $schema: 'https://ui.shadcn.com/schema.json',
        style: 'default',
        tailwind: {
          config: 'tailwind.config.ts',
        },
      };
      await fs.writeJSON(path.join(projectDir, 'components.json'), componentsJson);

      const result = await detectShadcn(projectDir);

      expect(result.installed).toBe(true);
      expect(result.configPath).toBe(path.join(projectDir, 'components.json'));
    });

    it('should parse shadcn configuration', async () => {
      const projectDir = path.join(testDir, 'shadcn-config');
      await fs.ensureDir(projectDir);
      const componentsJson = {
        $schema: 'https://ui.shadcn.com/schema.json',
        style: 'new-york',
        rsc: true,
        tsx: true,
        tailwind: {
          config: 'tailwind.config.js',
          css: 'src/styles/globals.css',
        },
        aliases: {
          components: '@/components',
          utils: '@/lib/utils',
        },
      };
      await fs.writeJSON(path.join(projectDir, 'components.json'), componentsJson);

      const result = await detectShadcn(projectDir);

      expect(result.installed).toBe(true);
      expect(result.config?.style).toBe('new-york');
      expect(result.config?.rsc).toBe(true);
      expect(result.config?.tsx).toBe(true);
    });
  });

  describe('No shadcn detection', () => {
    it('should return not installed when components.json does not exist', async () => {
      const projectDir = path.join(testDir, 'no-shadcn');
      await fs.ensureDir(projectDir);

      const result = await detectShadcn(projectDir);

      expect(result.installed).toBe(false);
      expect(result.configPath).toBeUndefined();
      expect(result.config).toBeUndefined();
    });

    it('should return not installed when directory does not exist', async () => {
      const projectDir = path.join(testDir, 'non-existent');

      const result = await detectShadcn(projectDir);

      expect(result.installed).toBe(false);
    });

    it('should handle invalid JSON gracefully', async () => {
      const projectDir = path.join(testDir, 'invalid-json');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'components.json'), 'invalid json{');

      const result = await detectShadcn(projectDir);

      expect(result.installed).toBe(false);
    });
  });

  describe('Version detection', () => {
    it('should detect shadcn CLI version from package.json', async () => {
      const projectDir = path.join(testDir, 'shadcn-versioned');
      await fs.ensureDir(projectDir);
      await fs.writeJSON(path.join(projectDir, 'components.json'), {
        style: 'default',
      });
      await fs.writeJSON(path.join(projectDir, 'package.json'), {
        devDependencies: { 'shadcn-ui': '^0.8.0' },
      });

      const result = await detectShadcn(projectDir);

      expect(result.installed).toBe(true);
      expect(result.version).toBe('^0.8.0');
    });
  });

  describe('Performance', () => {
    it('should complete detection in less than 100ms', async () => {
      const projectDir = path.join(testDir, 'performance-test');
      await fs.ensureDir(projectDir);
      await fs.writeJSON(path.join(projectDir, 'components.json'), { style: 'default' });

      const startTime = Date.now();
      await detectShadcn(projectDir);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
