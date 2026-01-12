import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs-extra';
import * as path from 'path';
import { generate } from '../../src/commands/generate.js';

// Mock enquirer with default export
vi.mock('enquirer', () => ({
  default: {
    prompt: vi.fn()
  }
}));

// Mock token wrapper
vi.mock('../../src/utils/token-wrapper.js', () => ({
  generateTokensWrapper: vi.fn(),
}));

describe('Generate Command', () => {
  const testDir = path.join(process.cwd(), 'test-fixtures', 'generate-command');

  beforeEach(async () => {
    await fs.ensureDir(testDir);
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  describe('Interactive Q&A workflow', () => {
    it('should prompt for primary color', async () => {
      const enquirer = await import('enquirer');
      const { prompt } = enquirer.default;
      const projectDir = path.join(testDir, 'color-prompt');
      await fs.ensureDir(projectDir);

      vi.mocked(prompt).mockResolvedValue({
        primaryColor: '#3b82f6',
        preset: 'default',
      });

      const { generateTokensWrapper } = await import('../../src/utils/token-wrapper.js');
      vi.mocked(generateTokensWrapper).mockResolvedValue({
        cssVariables: ':root {}',
        tailwindConfig: 'module.exports = {}',
      } as any);

      await generate({ path: projectDir, interactive: true });

      expect(prompt).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'input',
            name: 'primaryColor',
            message: expect.stringContaining('primary color'),
          }),
        ])
      );
    });

    it('should prompt for preset selection', async () => {
      const enquirer = await import('enquirer');
      const { prompt } = enquirer.default;
      const projectDir = path.join(testDir, 'preset-prompt');
      await fs.ensureDir(projectDir);

      vi.mocked(prompt).mockResolvedValue({
        primaryColor: '#3b82f6',
        preset: 'accessible',
      });

      const { generateTokensWrapper } = await import('../../src/utils/token-wrapper.js');
      vi.mocked(generateTokensWrapper).mockResolvedValue({
        cssVariables: ':root {}',
        tailwindConfig: 'module.exports = {}',
      } as any);

      await generate({ path: projectDir, interactive: true });

      expect(prompt).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'select',
            name: 'preset',
            message: expect.stringContaining('preset'),
            choices: expect.arrayContaining(['default', 'accessible', 'vibrant']),
          }),
        ])
      );
    });

    it('should validate hex color format', async () => {
      const enquirer = await import('enquirer');
      const { prompt } = enquirer.default;
      const projectDir = path.join(testDir, 'color-validation');
      await fs.ensureDir(projectDir);

      vi.mocked(prompt).mockResolvedValue({
        primaryColor: '#3b82f6',
        preset: 'default',
      });

      const { generateTokensWrapper } = await import('../../src/utils/token-wrapper.js');
      vi.mocked(generateTokensWrapper).mockResolvedValue({
        cssVariables: ':root {}',
        tailwindConfig: 'module.exports = {}',
      } as any);

      await generate({ path: projectDir, interactive: true });

      expect(prompt).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'primaryColor',
            validate: expect.any(Function),
          }),
        ])
      );
    });
  });

  describe('Non-interactive mode', () => {
    it('should accept primary color via options', async () => {
      const projectDir = path.join(testDir, 'non-interactive-color');
      await fs.ensureDir(projectDir);

      const { generateTokensWrapper } = await import('../../src/utils/token-wrapper.js');
      vi.mocked(generateTokensWrapper).mockResolvedValue({
        cssVariables: ':root { --primary: #3b82f6; }',
        tailwindConfig: 'module.exports = {}',
      } as any);

      const result = await generate({
        path: projectDir,
        primaryColor: '#3b82f6',
        preset: 'default',
      });

      expect(result.success).toBe(true);
      expect(generateTokensWrapper).toHaveBeenCalledWith(
        expect.objectContaining({
          primaryColor: '#3b82f6',
          preset: 'default',
        })
      );
    });

    it('should use default preset if not specified', async () => {
      const projectDir = path.join(testDir, 'default-preset');
      await fs.ensureDir(projectDir);

      const { generateTokensWrapper } = await import('../../src/utils/token-wrapper.js');
      vi.mocked(generateTokensWrapper).mockResolvedValue({
        cssVariables: ':root {}',
        tailwindConfig: 'module.exports = {}',
      } as any);

      const result = await generate({
        path: projectDir,
        primaryColor: '#3b82f6',
      });

      expect(result.success).toBe(true);
      expect(generateTokensWrapper).toHaveBeenCalledWith(
        expect.objectContaining({
          preset: 'default',
        })
      );
    });
  });

  describe('File output', () => {
    it('should create tokens.css file', async () => {
      const projectDir = path.join(testDir, 'css-output');
      await fs.ensureDir(projectDir);
      await fs.ensureDir(path.join(projectDir, 'src', 'styles'));

      const { generateTokensWrapper } = await import('../../src/utils/token-wrapper.js');
      vi.mocked(generateTokensWrapper).mockResolvedValue({
        cssVariables: ':root { --primary: #3b82f6; }',
        tailwindConfig: 'module.exports = {}',
      } as any);

      const result = await generate({
        path: projectDir,
        primaryColor: '#3b82f6',
        preset: 'default',
      });

      expect(result.success).toBe(true);
      const cssPath = path.join(projectDir, 'src', 'styles', 'tokens.css');
      const cssExists = await fs.pathExists(cssPath);
      expect(cssExists).toBe(true);

      const cssContent = await fs.readFile(cssPath, 'utf-8');
      expect(cssContent).toContain(':root');
      expect(cssContent).toContain('--primary');
    });

    it('should update tailwind.config.js', async () => {
      const projectDir = path.join(testDir, 'tailwind-output');
      await fs.ensureDir(projectDir);

      const { generateTokensWrapper } = await import('../../src/utils/token-wrapper.js');
      vi.mocked(generateTokensWrapper).mockResolvedValue({
        cssVariables: ':root {}',
        tailwindConfig: 'module.exports = { theme: { extend: {} } }',
      } as any);

      const result = await generate({
        path: projectDir,
        primaryColor: '#3b82f6',
        preset: 'default',
      });

      expect(result.success).toBe(true);
      const tailwindPath = path.join(projectDir, 'tailwind.config.js');
      const tailwindExists = await fs.pathExists(tailwindPath);
      expect(tailwindExists).toBe(true);

      const tailwindContent = await fs.readFile(tailwindPath, 'utf-8');
      expect(tailwindContent).toContain('module.exports');
    });

    it('should report generated file paths', async () => {
      const projectDir = path.join(testDir, 'file-paths');
      await fs.ensureDir(projectDir);

      const { generateTokensWrapper } = await import('../../src/utils/token-wrapper.js');
      vi.mocked(generateTokensWrapper).mockResolvedValue({
        cssVariables: ':root {}',
        tailwindConfig: 'module.exports = {}',
      } as any);

      const result = await generate({
        path: projectDir,
        primaryColor: '#3b82f6',
        preset: 'default',
      });

      expect(result.success).toBe(true);
      expect(result.files).toBeDefined();
      expect(result.files?.css).toContain('tokens.css');
      expect(result.files?.tailwind).toContain('tailwind.config.js');
    });
  });

  describe('WCAG validation', () => {
    it('should warn on WCAG validation failures', async () => {
      const projectDir = path.join(testDir, 'wcag-warning');
      await fs.ensureDir(projectDir);

      const { generateTokensWrapper } = await import('../../src/utils/token-wrapper.js');
      vi.mocked(generateTokensWrapper).mockResolvedValue({
        cssVariables: ':root {}',
        tailwindConfig: 'module.exports = {}',
        warnings: ['Color contrast does not meet WCAG AA'],
      } as any);

      const result = await generate({
        path: projectDir,
        primaryColor: '#ffff00',
        preset: 'default',
      });

      expect(result.success).toBe(true);
      expect(result.warnings).toContain('Color contrast does not meet WCAG AA');
    });

    it('should allow continuation with confirmation on WCAG failure', async () => {
      const projectDir = path.join(testDir, 'wcag-continue');
      await fs.ensureDir(projectDir);

      const { generateTokensWrapper } = await import('../../src/utils/token-wrapper.js');
      vi.mocked(generateTokensWrapper).mockResolvedValue({
        cssVariables: ':root {}',
        tailwindConfig: 'module.exports = {}',
        warnings: ['WCAG validation failed'],
      } as any);

      const result = await generate({
        path: projectDir,
        primaryColor: '#ffff00',
        preset: 'default',
        force: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('should handle invalid hex color', async () => {
      const projectDir = path.join(testDir, 'invalid-color');
      await fs.ensureDir(projectDir);

      const result = await generate({
        path: projectDir,
        primaryColor: 'not-a-color',
        preset: 'default',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid hex color');
    });

    it('should handle token generation errors', async () => {
      const projectDir = path.join(testDir, 'generation-error');
      await fs.ensureDir(projectDir);

      const { generateTokensWrapper } = await import('../../src/utils/token-wrapper.js');
      vi.mocked(generateTokensWrapper).mockRejectedValue(new Error('Generation failed'));

      const result = await generate({
        path: projectDir,
        primaryColor: '#3b82f6',
        preset: 'default',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Generation failed');
    });

    it('should handle file write errors', async () => {
      const projectDir = '/invalid/path/that/does/not/exist';

      const { generateTokensWrapper } = await import('../../src/utils/token-wrapper.js');
      vi.mocked(generateTokensWrapper).mockResolvedValue({
        cssVariables: ':root {}',
        tailwindConfig: 'module.exports = {}',
      } as any);

      const result = await generate({
        path: projectDir,
        primaryColor: '#3b82f6',
        preset: 'default',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('Performance', () => {
    it('should complete generation in less than 500ms', async () => {
      const projectDir = path.join(testDir, 'performance');
      await fs.ensureDir(projectDir);

      const { generateTokensWrapper } = await import('../../src/utils/token-wrapper.js');
      vi.mocked(generateTokensWrapper).mockResolvedValue({
        cssVariables: ':root {}',
        tailwindConfig: 'module.exports = {}',
      } as any);

      const startTime = Date.now();
      await generate({
        path: projectDir,
        primaryColor: '#3b82f6',
        preset: 'default',
      });
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(500);
    });
  });
});
