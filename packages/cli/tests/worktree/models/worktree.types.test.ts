import { describe, it, expect } from 'vitest';
import {
  WorktreeStatusSchema,
  WorktreeSchema,
  WorktreeConfigSchema,
  type WorktreeStatus,
  type Worktree,
  type WorktreeConfig,
} from '../../../src/worktree/models/worktree.types.js';

describe('Worktree Types', () => {
  describe('WorktreeStatusSchema', () => {
    it('should accept "active" status', () => {
      const result = WorktreeStatusSchema.safeParse('active');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('active');
      }
    });

    it('should accept "merged" status', () => {
      const result = WorktreeStatusSchema.safeParse('merged');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('merged');
      }
    });

    it('should accept "stale" status', () => {
      const result = WorktreeStatusSchema.safeParse('stale');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('stale');
      }
    });

    it('should reject invalid status', () => {
      const result = WorktreeStatusSchema.safeParse('invalid');
      expect(result.success).toBe(false);
    });

    it('should reject empty string', () => {
      const result = WorktreeStatusSchema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('should reject null', () => {
      const result = WorktreeStatusSchema.safeParse(null);
      expect(result.success).toBe(false);
    });
  });

  describe('WorktreeSchema', () => {
    const validWorktree: Worktree = {
      id: 'SPEC-ABC-001',
      path: '/Users/dev/worktrees/tekton/SPEC-ABC-001',
      branch: 'feature/SPEC-ABC-001',
      base_branch: 'master',
      status: 'active',
      created_at: '2024-01-20T10:30:00.000Z',
      last_sync: '2024-01-20T15:45:00.000Z',
    };

    describe('Valid worktrees', () => {
      it('should validate complete worktree object', () => {
        const result = WorktreeSchema.safeParse(validWorktree);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(validWorktree);
        }
      });

      it('should validate worktree without last_sync', () => {
        const { last_sync, ...worktreeWithoutSync } = validWorktree;
        const result = WorktreeSchema.safeParse(worktreeWithoutSync);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.last_sync).toBeUndefined();
        }
      });

      it('should validate worktree with "merged" status', () => {
        const mergedWorktree = { ...validWorktree, status: 'merged' as WorktreeStatus };
        const result = WorktreeSchema.safeParse(mergedWorktree);
        expect(result.success).toBe(true);
      });

      it('should validate worktree with "stale" status', () => {
        const staleWorktree = { ...validWorktree, status: 'stale' as WorktreeStatus };
        const result = WorktreeSchema.safeParse(staleWorktree);
        expect(result.success).toBe(true);
      });
    });

    describe('Invalid worktrees - Missing required fields', () => {
      it('should reject worktree missing id', () => {
        const { id, ...incomplete } = validWorktree;
        const result = WorktreeSchema.safeParse(incomplete);
        expect(result.success).toBe(false);
      });

      it('should reject worktree missing path', () => {
        const { path, ...incomplete } = validWorktree;
        const result = WorktreeSchema.safeParse(incomplete);
        expect(result.success).toBe(false);
      });

      it('should reject worktree missing branch', () => {
        const { branch, ...incomplete } = validWorktree;
        const result = WorktreeSchema.safeParse(incomplete);
        expect(result.success).toBe(false);
      });

      it('should reject worktree missing base_branch', () => {
        const { base_branch, ...incomplete } = validWorktree;
        const result = WorktreeSchema.safeParse(incomplete);
        expect(result.success).toBe(false);
      });

      it('should reject worktree missing status', () => {
        const { status, ...incomplete } = validWorktree;
        const result = WorktreeSchema.safeParse(incomplete);
        expect(result.success).toBe(false);
      });

      it('should reject worktree missing created_at', () => {
        const { created_at, ...incomplete } = validWorktree;
        const result = WorktreeSchema.safeParse(incomplete);
        expect(result.success).toBe(false);
      });
    });

    describe('Invalid worktrees - Wrong types', () => {
      it('should reject worktree with non-string id', () => {
        const invalid = { ...validWorktree, id: 123 };
        const result = WorktreeSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      });

      it('should reject worktree with empty string id', () => {
        const invalid = { ...validWorktree, id: '' };
        const result = WorktreeSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      });

      it('should reject worktree with invalid status', () => {
        const invalid = { ...validWorktree, status: 'invalid' };
        const result = WorktreeSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      });

      it('should reject worktree with invalid date format', () => {
        const invalid = { ...validWorktree, created_at: 'not-a-date' };
        const result = WorktreeSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('WorktreeConfigSchema', () => {
    const validConfig: WorktreeConfig = {
      worktree_root: '~/worktrees/tekton/',
      auto_sync: true,
      cleanup_merged: true,
      default_base: 'master',
    };

    describe('Valid configurations', () => {
      it('should validate complete config', () => {
        const result = WorktreeConfigSchema.safeParse(validConfig);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(validConfig);
        }
      });

      it('should validate config with auto_sync false', () => {
        const config = { ...validConfig, auto_sync: false };
        const result = WorktreeConfigSchema.safeParse(config);
        expect(result.success).toBe(true);
      });

      it('should validate config with cleanup_merged false', () => {
        const config = { ...validConfig, cleanup_merged: false };
        const result = WorktreeConfigSchema.safeParse(config);
        expect(result.success).toBe(true);
      });

      it('should validate config with different base branch', () => {
        const config = { ...validConfig, default_base: 'main' };
        const result = WorktreeConfigSchema.safeParse(config);
        expect(result.success).toBe(true);
      });

      it('should validate config with absolute path', () => {
        const config = { ...validConfig, worktree_root: '/Users/dev/worktrees/tekton/' };
        const result = WorktreeConfigSchema.safeParse(config);
        expect(result.success).toBe(true);
      });
    });

    describe('Invalid configurations', () => {
      it('should reject config missing worktree_root', () => {
        const { worktree_root, ...incomplete } = validConfig;
        const result = WorktreeConfigSchema.safeParse(incomplete);
        expect(result.success).toBe(false);
      });

      it('should reject config missing auto_sync', () => {
        const { auto_sync, ...incomplete } = validConfig;
        const result = WorktreeConfigSchema.safeParse(incomplete);
        expect(result.success).toBe(false);
      });

      it('should reject config missing cleanup_merged', () => {
        const { cleanup_merged, ...incomplete } = validConfig;
        const result = WorktreeConfigSchema.safeParse(incomplete);
        expect(result.success).toBe(false);
      });

      it('should reject config missing default_base', () => {
        const { default_base, ...incomplete } = validConfig;
        const result = WorktreeConfigSchema.safeParse(incomplete);
        expect(result.success).toBe(false);
      });

      it('should reject config with non-string worktree_root', () => {
        const invalid = { ...validConfig, worktree_root: 123 };
        const result = WorktreeConfigSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      });

      it('should reject config with non-boolean auto_sync', () => {
        const invalid = { ...validConfig, auto_sync: 'true' };
        const result = WorktreeConfigSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      });

      it('should reject config with empty worktree_root', () => {
        const invalid = { ...validConfig, worktree_root: '' };
        const result = WorktreeConfigSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      });

      it('should reject config with empty default_base', () => {
        const invalid = { ...validConfig, default_base: '' };
        const result = WorktreeConfigSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      });
    });
  });
});
