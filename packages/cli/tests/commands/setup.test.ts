import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs-extra';
import * as path from 'path';
import { setup } from '../../src/commands/setup.js';

// Mock the installer
vi.mock('../../src/setup/shadcn-installer.js', () => ({
  checkPrerequisites: vi.fn(),
  installShadcn: vi.fn(),
}));

describe('Setup Command', () => {
  const testDir = path.join(process.cwd(), 'test-fixtures', 'setup-command');

  beforeEach(async () => {
    await fs.ensureDir(testDir);
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  describe('Target validation', () => {
    it('should accept "shadcn" as valid target', async () => {
      const { checkPrerequisites, installShadcn } = await import('../../src/setup/shadcn-installer.js');
      const projectDir = path.join(testDir, 'valid-target');
      await fs.ensureDir(projectDir);

      vi.mocked(checkPrerequisites).mockResolvedValue({
        passed: true,
        framework: 'Next.js',
        tailwind: true,
        errors: [],
        warnings: [],
      });

      vi.mocked(installShadcn).mockResolvedValue({
        success: true,
        configCreated: true,
        warnings: [],
      });

      const result = await setup('shadcn', { path: projectDir });

      expect(result.success).toBe(true);
      expect(checkPrerequisites).toHaveBeenCalled();
      expect(installShadcn).toHaveBeenCalled();
    });

    it('should reject invalid target', async () => {
      const projectDir = path.join(testDir, 'invalid-target');
      await fs.ensureDir(projectDir);

      const result = await setup('invalid-target', { path: projectDir });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unsupported target');
    });

    it('should handle case-insensitive target names', async () => {
      const { checkPrerequisites, installShadcn } = await import('../../src/setup/shadcn-installer.js');
      const projectDir = path.join(testDir, 'case-test');
      await fs.ensureDir(projectDir);

      vi.mocked(checkPrerequisites).mockResolvedValue({
        passed: true,
        framework: 'Next.js',
        tailwind: true,
        errors: [],
        warnings: [],
      });

      vi.mocked(installShadcn).mockResolvedValue({
        success: true,
        configCreated: true,
        warnings: [],
      });

      const result = await setup('SHADCN', { path: projectDir });

      expect(result.success).toBe(true);
    });
  });

  describe('Prerequisite handling', () => {
    it('should abort when prerequisites fail', async () => {
      const { checkPrerequisites, installShadcn } = await import('../../src/setup/shadcn-installer.js');
      const projectDir = path.join(testDir, 'failed-prereqs');
      await fs.ensureDir(projectDir);

      vi.mocked(checkPrerequisites).mockResolvedValue({
        passed: false,
        framework: null,
        tailwind: false,
        errors: ['No framework detected', 'Tailwind not installed'],
        warnings: [],
      });

      const result = await setup('shadcn', { path: projectDir });

      expect(result.success).toBe(false);
      expect(result.errors).toContain('No framework detected');
      expect(result.errors).toContain('Tailwind not installed');
      expect(installShadcn).not.toHaveBeenCalled();
    });

    it('should display warnings but continue', async () => {
      const { checkPrerequisites, installShadcn } = await import('../../src/setup/shadcn-installer.js');
      const projectDir = path.join(testDir, 'with-warnings');
      await fs.ensureDir(projectDir);

      vi.mocked(checkPrerequisites).mockResolvedValue({
        passed: true,
        framework: 'Next.js',
        tailwind: true,
        errors: [],
        warnings: ['shadcn/ui is already installed'],
      });

      vi.mocked(installShadcn).mockResolvedValue({
        success: true,
        configCreated: true,
        warnings: [],
      });

      const result = await setup('shadcn', { path: projectDir });

      expect(result.success).toBe(true);
      expect(result.warnings).toContain('shadcn/ui is already installed');
      expect(installShadcn).toHaveBeenCalled();
    });
  });

  describe('Installation flow', () => {
    it('should report successful installation', async () => {
      const { checkPrerequisites, installShadcn } = await import('../../src/setup/shadcn-installer.js');
      const projectDir = path.join(testDir, 'success-flow');
      await fs.ensureDir(projectDir);

      vi.mocked(checkPrerequisites).mockResolvedValue({
        passed: true,
        framework: 'Vite',
        tailwind: true,
        errors: [],
        warnings: [],
      });

      vi.mocked(installShadcn).mockResolvedValue({
        success: true,
        configCreated: true,
        configPath: path.join(projectDir, 'components.json'),
        warnings: [],
      });

      const result = await setup('shadcn', { path: projectDir });

      expect(result.success).toBe(true);
      expect(result.message).toContain('successfully installed');
      expect(result.configPath).toBeDefined();
    });

    it('should handle installation failures', async () => {
      const { checkPrerequisites, installShadcn } = await import('../../src/setup/shadcn-installer.js');
      const projectDir = path.join(testDir, 'install-failure');
      await fs.ensureDir(projectDir);

      vi.mocked(checkPrerequisites).mockResolvedValue({
        passed: true,
        framework: 'Next.js',
        tailwind: true,
        errors: [],
        warnings: [],
      });

      vi.mocked(installShadcn).mockResolvedValue({
        success: false,
        error: 'npm install failed',
        warnings: [],
      });

      const result = await setup('shadcn', { path: projectDir });

      expect(result.success).toBe(false);
      expect(result.error).toContain('npm install failed');
    });
  });

  describe('Default directory', () => {
    it('should use current directory when no path provided', async () => {
      const { checkPrerequisites, installShadcn } = await import('../../src/setup/shadcn-installer.js');

      vi.mocked(checkPrerequisites).mockResolvedValue({
        passed: true,
        framework: 'Next.js',
        tailwind: true,
        errors: [],
        warnings: [],
      });

      vi.mocked(installShadcn).mockResolvedValue({
        success: true,
        configCreated: true,
        warnings: [],
      });

      const result = await setup('shadcn');

      expect(result.success).toBe(true);
      expect(checkPrerequisites).toHaveBeenCalledWith(process.cwd());
    });
  });

  describe('Future targets', () => {
    it('should provide helpful message for unsupported targets', async () => {
      const result = await setup('storybook');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unsupported target');
      expect(result.error).toContain('Currently supported: shadcn');
    });
  });
});
