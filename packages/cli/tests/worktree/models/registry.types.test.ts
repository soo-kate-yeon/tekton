import { describe, it, expect } from 'vitest';
import {
  WorktreeMetadataSchema,
  WorktreeRegistrySchema,
  type WorktreeMetadata,
  type WorktreeRegistry,
} from '../../../src/worktree/models/registry.types.js';

describe('Registry Types', () => {
  describe('WorktreeMetadataSchema', () => {
    const validMetadata: WorktreeMetadata = {
      id: 'SPEC-ABC-001',
      path: '/Users/dev/worktrees/tekton/SPEC-ABC-001',
      branch: 'feature/SPEC-ABC-001',
      base_branch: 'master',
      status: 'active',
      created_at: '2024-01-20T10:30:00.000Z',
      last_sync: '2024-01-20T15:45:00.000Z',
    };

    describe('Valid metadata', () => {
      it('should validate complete metadata', () => {
        const result = WorktreeMetadataSchema.safeParse(validMetadata);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(validMetadata);
        }
      });

      it('should validate metadata without last_sync', () => {
        const { last_sync, ...metadataWithoutSync } = validMetadata;
        const result = WorktreeMetadataSchema.safeParse(metadataWithoutSync);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.last_sync).toBeUndefined();
        }
      });

      it('should validate metadata with different status values', () => {
        const merged = { ...validMetadata, status: 'merged' };
        expect(WorktreeMetadataSchema.safeParse(merged).success).toBe(true);

        const stale = { ...validMetadata, status: 'stale' };
        expect(WorktreeMetadataSchema.safeParse(stale).success).toBe(true);
      });
    });

    describe('Invalid metadata', () => {
      it('should reject metadata with invalid status', () => {
        const invalid = { ...validMetadata, status: 'invalid' };
        const result = WorktreeMetadataSchema.safeParse(invalid);
        expect(result.success).toBe(false);
      });

      it('should reject metadata missing required fields', () => {
        const { id, ...incomplete } = validMetadata;
        expect(WorktreeMetadataSchema.safeParse(incomplete).success).toBe(false);
      });
    });
  });

  describe('WorktreeRegistrySchema', () => {
    const validRegistry: WorktreeRegistry = {
      version: '1.0.0',
      created_at: '2024-01-20T10:00:00.000Z',
      last_updated: '2024-01-20T15:00:00.000Z',
      config: {
        worktree_root: '~/worktrees/tekton/',
        auto_sync: true,
        cleanup_merged: true,
        default_base: 'master',
      },
      worktrees: {
        'SPEC-ABC-001': {
          id: 'SPEC-ABC-001',
          path: '/Users/dev/worktrees/tekton/SPEC-ABC-001',
          branch: 'feature/SPEC-ABC-001',
          base_branch: 'master',
          status: 'active',
          created_at: '2024-01-20T10:30:00.000Z',
        },
        'SPEC-XYZ-002': {
          id: 'SPEC-XYZ-002',
          path: '/Users/dev/worktrees/tekton/SPEC-XYZ-002',
          branch: 'feature/SPEC-XYZ-002',
          base_branch: 'master',
          status: 'merged',
          created_at: '2024-01-19T09:00:00.000Z',
          last_sync: '2024-01-20T14:00:00.000Z',
        },
      },
    };

    describe('Valid registries', () => {
      it('should validate complete registry', () => {
        const result = WorktreeRegistrySchema.safeParse(validRegistry);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(validRegistry);
        }
      });

      it('should validate registry with empty worktrees', () => {
        const emptyRegistry = {
          ...validRegistry,
          worktrees: {},
        };
        const result = WorktreeRegistrySchema.safeParse(emptyRegistry);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.worktrees).toEqual({});
        }
      });

      it('should validate registry with single worktree', () => {
        const singleWorktree = {
          ...validRegistry,
          worktrees: {
            'SPEC-ABC-001': validRegistry.worktrees['SPEC-ABC-001'],
          },
        };
        const result = WorktreeRegistrySchema.safeParse(singleWorktree);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(Object.keys(result.data.worktrees)).toHaveLength(1);
        }
      });

      it('should validate registry with different version', () => {
        const diffVersion = { ...validRegistry, version: '2.0.0' };
        const result = WorktreeRegistrySchema.safeParse(diffVersion);
        expect(result.success).toBe(true);
      });
    });

    describe('Invalid registries - Missing required fields', () => {
      it('should reject registry missing version', () => {
        const { version, ...incomplete } = validRegistry;
        const result = WorktreeRegistrySchema.safeParse(incomplete);
        expect(result.success).toBe(false);
      });

      it('should reject registry missing created_at', () => {
        const { created_at, ...incomplete } = validRegistry;
        const result = WorktreeRegistrySchema.safeParse(incomplete);
        expect(result.success).toBe(false);
      });

      it('should reject registry missing last_updated', () => {
        const { last_updated, ...incomplete } = validRegistry;
        const result = WorktreeRegistrySchema.safeParse(incomplete);
        expect(result.success).toBe(false);
      });

      it('should reject registry missing config', () => {
        const { config, ...incomplete } = validRegistry;
        const result = WorktreeRegistrySchema.safeParse(incomplete);
        expect(result.success).toBe(false);
      });

      it('should reject registry missing worktrees', () => {
        const { worktrees, ...incomplete } = validRegistry;
        const result = WorktreeRegistrySchema.safeParse(incomplete);
        expect(result.success).toBe(false);
      });
    });

    describe('Invalid registries - Wrong types', () => {
      it('should reject registry with non-string version', () => {
        const invalid = { ...validRegistry, version: 1.0 };
        const result = WorktreeRegistrySchema.safeParse(invalid);
        expect(result.success).toBe(false);
      });

      it('should reject registry with empty version', () => {
        const invalid = { ...validRegistry, version: '' };
        const result = WorktreeRegistrySchema.safeParse(invalid);
        expect(result.success).toBe(false);
      });

      it('should reject registry with invalid date format', () => {
        const invalid = { ...validRegistry, created_at: 'not-a-date' };
        const result = WorktreeRegistrySchema.safeParse(invalid);
        expect(result.success).toBe(false);
      });

      it('should reject registry with invalid config', () => {
        const invalid = { ...validRegistry, config: { worktree_root: '' } };
        const result = WorktreeRegistrySchema.safeParse(invalid);
        expect(result.success).toBe(false);
      });

      it('should reject registry with non-object worktrees', () => {
        const invalid = { ...validRegistry, worktrees: [] };
        const result = WorktreeRegistrySchema.safeParse(invalid);
        expect(result.success).toBe(false);
      });

      it('should reject registry with invalid worktree metadata', () => {
        const invalid = {
          ...validRegistry,
          worktrees: {
            'SPEC-ABC-001': { id: 123 },
          },
        };
        const result = WorktreeRegistrySchema.safeParse(invalid);
        expect(result.success).toBe(false);
      });
    });

    describe('Worktree key validation', () => {
      it('should validate worktree with matching key and id', () => {
        const result = WorktreeRegistrySchema.safeParse(validRegistry);
        expect(result.success).toBe(true);
      });

      it('should handle multiple worktrees correctly', () => {
        const result = WorktreeRegistrySchema.safeParse(validRegistry);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(Object.keys(result.data.worktrees)).toContain('SPEC-ABC-001');
          expect(Object.keys(result.data.worktrees)).toContain('SPEC-XYZ-002');
        }
      });
    });
  });
});
