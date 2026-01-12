import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs-extra';
import * as path from 'path';
import { detect } from '../../src/commands/detect.js';

describe('Detect Command', () => {
  const testDir = path.join(process.cwd(), 'test-fixtures', 'detect-command');

  beforeEach(async () => {
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  describe('Full stack detection', () => {
    it('should detect Next.js + Tailwind + shadcn stack', async () => {
      const projectDir = path.join(testDir, 'full-stack');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'next.config.js'), 'module.exports = {}');
      await fs.writeFile(path.join(projectDir, 'tailwind.config.ts'), 'export default {}');
      await fs.writeJSON(path.join(projectDir, 'components.json'), { style: 'default' });

      const result = await detect(projectDir);

      expect(result.framework).toBe('Next.js');
      expect(result.tailwind).toBe(true);
      expect(result.shadcn).toBe(true);
    });

    it('should detect Vite + Tailwind stack without shadcn', async () => {
      const projectDir = path.join(testDir, 'vite-stack');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'vite.config.ts'), 'export default {}');
      await fs.writeFile(path.join(projectDir, 'tailwind.config.js'), 'module.exports = {}');

      const result = await detect(projectDir);

      expect(result.framework).toBe('Vite');
      expect(result.tailwind).toBe(true);
      expect(result.shadcn).toBe(false);
    });

    it('should detect Remix stack', async () => {
      const projectDir = path.join(testDir, 'remix-stack');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'remix.config.js'), 'module.exports = {}');

      const result = await detect(projectDir);

      expect(result.framework).toBe('Remix');
      expect(result.tailwind).toBe(false);
      expect(result.shadcn).toBe(false);
    });
  });

  describe('Partial detection', () => {
    it('should handle project with no framework but has Tailwind', async () => {
      const projectDir = path.join(testDir, 'tailwind-only');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'tailwind.config.js'), 'module.exports = {}');

      const result = await detect(projectDir);

      expect(result.framework).toBeNull();
      expect(result.tailwind).toBe(true);
      expect(result.shadcn).toBe(false);
    });

    it('should handle empty project', async () => {
      const projectDir = path.join(testDir, 'empty-project');
      await fs.ensureDir(projectDir);

      const result = await detect(projectDir);

      expect(result.framework).toBeNull();
      expect(result.tailwind).toBe(false);
      expect(result.shadcn).toBe(false);
    });
  });

  describe('Output formatting', () => {
    it('should include formatted output message', async () => {
      const projectDir = path.join(testDir, 'format-test');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'next.config.js'), 'module.exports = {}');
      await fs.writeFile(path.join(projectDir, 'tailwind.config.ts'), 'export default {}');

      const result = await detect(projectDir);

      expect(result.message).toBeDefined();
      expect(result.message).toContain('Next.js');
      expect(result.message).toContain('Tailwind');
    });
  });

  describe('Error handling', () => {
    it('should handle non-existent directory gracefully', async () => {
      const projectDir = path.join(testDir, 'non-existent');

      const result = await detect(projectDir);

      expect(result.framework).toBeNull();
      expect(result.error).toBeUndefined();
    });

    it('should handle permission errors gracefully', async () => {
      const projectDir = path.join(testDir, 'no-permission');
      await fs.ensureDir(projectDir);

      // This test would need special setup for permission testing
      // For now, we just verify the function can be called
      const result = await detect(projectDir);
      expect(result).toBeDefined();
    });
  });

  describe('Default directory', () => {
    it('should use current directory when no path provided', async () => {
      // Save original cwd
      const originalCwd = process.cwd();

      try {
        // Change to test directory
        process.chdir(testDir);
        await fs.writeFile(path.join(testDir, 'vite.config.ts'), 'export default {}');

        const result = await detect();

        expect(result.framework).toBe('Vite');
      } finally {
        // Restore original cwd
        process.chdir(originalCwd);
      }
    });
  });

  describe('Performance', () => {
    it('should complete detection in less than 1 second', async () => {
      const projectDir = path.join(testDir, 'performance-test');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'next.config.js'), 'module.exports = {}');
      await fs.writeFile(path.join(projectDir, 'tailwind.config.ts'), 'export default {}');
      await fs.writeJSON(path.join(projectDir, 'components.json'), { style: 'default' });

      const startTime = Date.now();
      await detect(projectDir);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});
