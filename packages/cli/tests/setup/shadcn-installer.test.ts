import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs-extra';
import * as path from 'path';
import { installShadcn, checkPrerequisites } from '../../src/setup/shadcn-installer.js';

// Mock execa
vi.mock('execa', () => ({
  execa: vi.fn(),
}));

describe('shadcn Installer', () => {
  const testDir = path.join(process.cwd(), 'test-fixtures', 'shadcn-installer');

  beforeEach(async () => {
    await fs.ensureDir(testDir);
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  describe('Prerequisite checks', () => {
    it('should pass when framework and Tailwind are detected', async () => {
      const projectDir = path.join(testDir, 'valid-setup');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'next.config.js'), 'module.exports = {}');
      await fs.writeFile(path.join(projectDir, 'tailwind.config.ts'), 'export default {}');

      const result = await checkPrerequisites(projectDir);

      expect(result.passed).toBe(true);
      expect(result.framework).toBe('Next.js');
      expect(result.tailwind).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when no framework is detected', async () => {
      const projectDir = path.join(testDir, 'no-framework');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'tailwind.config.ts'), 'export default {}');

      const result = await checkPrerequisites(projectDir);

      expect(result.passed).toBe(false);
      expect(result.framework).toBeNull();
      expect(result.errors).toContain('No framework detected. shadcn/ui requires Next.js, Vite, or Remix.');
    });

    it('should fail when Tailwind is not installed', async () => {
      const projectDir = path.join(testDir, 'no-tailwind');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'next.config.js'), 'module.exports = {}');

      const result = await checkPrerequisites(projectDir);

      expect(result.passed).toBe(false);
      expect(result.tailwind).toBe(false);
      expect(result.errors).toContain('Tailwind CSS not detected. Please install Tailwind CSS first.');
    });

    it('should fail when neither framework nor Tailwind are present', async () => {
      const projectDir = path.join(testDir, 'empty-project');
      await fs.ensureDir(projectDir);

      const result = await checkPrerequisites(projectDir);

      expect(result.passed).toBe(false);
      expect(result.errors).toHaveLength(2);
    });

    it('should warn if shadcn is already installed', async () => {
      const projectDir = path.join(testDir, 'shadcn-exists');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'next.config.js'), 'module.exports = {}');
      await fs.writeFile(path.join(projectDir, 'tailwind.config.ts'), 'export default {}');
      await fs.writeJSON(path.join(projectDir, 'components.json'), { style: 'default' });

      const result = await checkPrerequisites(projectDir);

      expect(result.passed).toBe(true);
      expect(result.warnings).toContain('shadcn/ui is already installed. This will overwrite existing configuration.');
    });
  });

  describe('Installation', () => {
    it('should execute shadcn init command', async () => {
      const { execa } = await import('execa');
      const projectDir = path.join(testDir, 'install-test');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'next.config.js'), 'module.exports = {}');
      await fs.writeFile(path.join(projectDir, 'tailwind.config.ts'), 'export default {}');

      vi.mocked(execa).mockResolvedValue({
        stdout: 'Success!',
        stderr: '',
      } as any);

      const result = await installShadcn(projectDir);

      expect(execa).toHaveBeenCalledWith(
        'npx',
        ['shadcn@latest', 'init'],
        expect.objectContaining({
          cwd: projectDir,
          stdio: 'inherit',
        })
      );
      expect(result.success).toBe(true);
    });

    it('should validate components.json creation', async () => {
      const { execa } = await import('execa');
      const projectDir = path.join(testDir, 'validation-test');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'next.config.js'), 'module.exports = {}');
      await fs.writeFile(path.join(projectDir, 'tailwind.config.ts'), 'export default {}');

      vi.mocked(execa).mockResolvedValue({ stdout: '', stderr: '' } as any);

      // Simulate components.json creation
      await fs.writeJSON(path.join(projectDir, 'components.json'), { style: 'default' });

      const result = await installShadcn(projectDir);

      expect(result.success).toBe(true);
      expect(result.configCreated).toBe(true);
    });

    it('should handle installation errors gracefully', async () => {
      const { execa } = await import('execa');
      const projectDir = path.join(testDir, 'error-test');
      await fs.ensureDir(projectDir);

      vi.mocked(execa).mockRejectedValue(new Error('Installation failed'));

      const result = await installShadcn(projectDir);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Installation failed');
    });

    it('should detect if components.json was not created', async () => {
      const { execa } = await import('execa');
      const projectDir = path.join(testDir, 'no-config-test');
      await fs.ensureDir(projectDir);

      vi.mocked(execa).mockResolvedValue({ stdout: '', stderr: '' } as any);

      const result = await installShadcn(projectDir);

      expect(result.success).toBe(true);
      expect(result.configCreated).toBe(false);
      expect(result.warnings).toContain('components.json was not created. The installation may have been cancelled.');
    });
  });

  describe('Performance', () => {
    it('should complete prerequisite checks in less than 500ms', async () => {
      const projectDir = path.join(testDir, 'perf-test');
      await fs.ensureDir(projectDir);
      await fs.writeFile(path.join(projectDir, 'next.config.js'), 'module.exports = {}');
      await fs.writeFile(path.join(projectDir, 'tailwind.config.ts'), 'export default {}');

      const startTime = Date.now();
      await checkPrerequisites(projectDir);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(500);
    });
  });
});
