import { describe, it, expect, beforeEach } from 'vitest';
import * as os from 'os';
import * as path from 'path';
import { expandPath, resolveWorktreePathSync } from '../../../src/worktree/manager/path-resolver.js';
import type { WorktreeConfig } from '../../../src/worktree/models/worktree.types.js';

describe('Path Resolver', () => {
  const mockUser = process.env.USER || process.env.USERNAME || 'testuser';
  const mockHome = os.homedir();

  describe('expandPath', () => {
    it('should expand {HOME} to home directory', () => {
      const result = expandPath('{HOME}/worktrees', {
        HOME: mockHome,
        USER: mockUser,
        PROJECT_NAME: 'tekton',
      });

      expect(result).toBe(`${mockHome}/worktrees`);
    });

    it('should expand {USER} to current user', () => {
      const result = expandPath('/worktrees/{USER}/projects', {
        HOME: mockHome,
        USER: mockUser,
        PROJECT_NAME: 'tekton',
      });

      expect(result).toBe(`/worktrees/${mockUser}/projects`);
    });

    it('should expand {PROJECT_NAME} to project name', () => {
      const result = expandPath('/worktrees/{PROJECT_NAME}/specs', {
        HOME: mockHome,
        USER: mockUser,
        PROJECT_NAME: 'tekton',
      });

      expect(result).toBe('/worktrees/tekton/specs');
    });

    it('should expand ~ to home directory', () => {
      const result = expandPath('~/worktrees/project', {
        HOME: mockHome,
        USER: mockUser,
        PROJECT_NAME: 'tekton',
      });

      expect(result).toBe(`${mockHome}/worktrees/project`);
    });

    it('should expand multiple placeholders', () => {
      const result = expandPath('~/worktrees/{PROJECT_NAME}/{USER}', {
        HOME: mockHome,
        USER: mockUser,
        PROJECT_NAME: 'tekton',
      });

      expect(result).toBe(`${mockHome}/worktrees/tekton/${mockUser}`);
    });

    it('should handle empty template', () => {
      const result = expandPath('', {
        HOME: mockHome,
        USER: mockUser,
        PROJECT_NAME: 'tekton',
      });

      expect(result).toBe('');
    });

    it('should handle template with no placeholders', () => {
      const result = expandPath('/absolute/path/to/worktrees', {
        HOME: mockHome,
        USER: mockUser,
        PROJECT_NAME: 'tekton',
      });

      expect(result).toBe('/absolute/path/to/worktrees');
    });

    it('should handle relative paths', () => {
      const result = expandPath('worktrees/{PROJECT_NAME}', {
        HOME: mockHome,
        USER: mockUser,
        PROJECT_NAME: 'tekton',
      });

      expect(result).toBe('worktrees/tekton');
    });

    it('should handle missing context values gracefully', () => {
      const result = expandPath('~/worktrees/{PROJECT_NAME}', {
        HOME: mockHome,
        USER: mockUser,
        PROJECT_NAME: '',
      });

      // Should keep empty placeholder
      expect(result).toBe(`${mockHome}/worktrees/`);
    });

    it('should handle Windows-style paths (when on Windows)', () => {
      if (process.platform === 'win32') {
        const result = expandPath('{HOME}\\worktrees\\{PROJECT_NAME}', {
          HOME: mockHome,
          USER: mockUser,
          PROJECT_NAME: 'tekton',
        });

        expect(result).toContain('worktrees');
        expect(result).toContain('tekton');
      } else {
        // On Unix, backslashes are literal path characters
        const result = expandPath('{HOME}/worktrees/{PROJECT_NAME}', {
          HOME: mockHome,
          USER: mockUser,
          PROJECT_NAME: 'tekton',
        });

        expect(result).toBe(`${mockHome}/worktrees/tekton`);
      }
    });
  });

  describe('resolveWorktreePathSync', () => {
    const baseConfig: WorktreeConfig = {
      worktree_root: '~/worktrees/{PROJECT_NAME}',
      auto_sync: true,
      cleanup_merged: true,
      default_base: 'main',
    };

    it('should resolve worktree path with SPEC ID', () => {
      const result = resolveWorktreePathSync('SPEC-AUTH-001', baseConfig, 'tekton');

      expect(result).toContain('worktrees');
      expect(result).toContain('tekton');
      expect(result).toContain('SPEC-AUTH-001');
      expect(path.isAbsolute(result)).toBe(true);
    });

    it('should handle absolute worktree_root', () => {
      const config: WorktreeConfig = {
        ...baseConfig,
        worktree_root: '/tmp/worktrees/{PROJECT_NAME}',
      };

      const result = resolveWorktreePathSync('SPEC-AUTH-001', config, 'tekton');

      expect(result).toBe('/tmp/worktrees/tekton/SPEC-AUTH-001');
      expect(path.isAbsolute(result)).toBe(true);
    });

    it('should handle worktree_root with {USER} placeholder', () => {
      const config: WorktreeConfig = {
        ...baseConfig,
        worktree_root: '/home/{USER}/worktrees/{PROJECT_NAME}',
      };

      const result = resolveWorktreePathSync('SPEC-AUTH-001', config, 'tekton');

      expect(result).toContain(mockUser);
      expect(result).toContain('worktrees');
      expect(result).toContain('tekton');
      expect(result).toContain('SPEC-AUTH-001');
    });

    it('should handle worktree_root with {HOME} placeholder', () => {
      const config: WorktreeConfig = {
        ...baseConfig,
        worktree_root: '{HOME}/worktrees/{PROJECT_NAME}',
      };

      const result = resolveWorktreePathSync('SPEC-AUTH-001', config, 'tekton');

      expect(result).toBe(path.join(mockHome, 'worktrees', 'tekton', 'SPEC-AUTH-001'));
      expect(path.isAbsolute(result)).toBe(true);
    });

    it('should normalize paths correctly', () => {
      const config: WorktreeConfig = {
        ...baseConfig,
        worktree_root: '~/worktrees/{PROJECT_NAME}//extra//',
      };

      const result = resolveWorktreePathSync('SPEC-AUTH-001', config, 'tekton');

      expect(result).not.toContain('//');
      expect(path.isAbsolute(result)).toBe(true);
    });

    it('should use current directory as project name if not provided', () => {
      const config: WorktreeConfig = {
        ...baseConfig,
        worktree_root: '/tmp/worktrees/{PROJECT_NAME}',
      };

      const result = resolveWorktreePathSync('SPEC-AUTH-001', config);

      expect(result).toContain('/tmp/worktrees/');
      expect(result).toContain('SPEC-AUTH-001');
      expect(path.isAbsolute(result)).toBe(true);
    });
  });
});
