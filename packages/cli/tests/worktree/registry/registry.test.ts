import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs-extra';
import * as path from 'path';
import { WorktreeRegistryManager } from '../../../src/worktree/registry/registry.js';
import type { WorktreeMetadata } from '../../../src/worktree/models/registry.types.js';

describe('WorktreeRegistryManager', () => {
  const testDir = path.join(process.cwd(), 'test-fixtures', 'registry-manager');
  const registryPath = path.join(testDir, '.worktree-registry.json');

  beforeEach(async () => {
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  describe('Initialization', () => {
    it('should create new registry if file does not exist', async () => {
      const manager = new WorktreeRegistryManager(registryPath);
      await manager.load();

      const fileExists = await fs.pathExists(registryPath);
      expect(fileExists).toBe(true);

      const registry = await manager.getAll();
      expect(registry.version).toBe('1.0.0');
      expect(registry.worktrees).toEqual({});
    });

    it('should load existing registry', async () => {
      // Create existing registry
      const existingRegistry = {
        version: '1.0.0',
        created_at: '2024-01-20T10:00:00.000Z',
        last_updated: '2024-01-20T10:00:00.000Z',
        config: {
          worktree_root: '~/worktrees/tekton/',
          auto_sync: true,
          cleanup_merged: true,
          default_base: 'master',
        },
        worktrees: {
          'SPEC-ABC-001': {
            id: 'SPEC-ABC-001',
            path: '/test/path',
            branch: 'feature/SPEC-ABC-001',
            base_branch: 'master',
            status: 'active' as const,
            created_at: '2024-01-20T10:30:00.000Z',
          },
        },
      };
      await fs.writeJSON(registryPath, existingRegistry);

      const manager = new WorktreeRegistryManager(registryPath);
      await manager.load();

      const registry = await manager.getAll();
      expect(registry.worktrees['SPEC-ABC-001']).toBeDefined();
      expect(registry.worktrees['SPEC-ABC-001'].id).toBe('SPEC-ABC-001');
    });

    it('should validate registry schema on load', async () => {
      // Create invalid registry
      const invalidRegistry = {
        version: '1.0.0',
        // missing required fields
      };
      await fs.writeJSON(registryPath, invalidRegistry);

      const manager = new WorktreeRegistryManager(registryPath);
      await expect(manager.load()).rejects.toThrow();
    });
  });

  describe('CRUD Operations', () => {
    let manager: WorktreeRegistryManager;

    beforeEach(async () => {
      manager = new WorktreeRegistryManager(registryPath);
      await manager.load();
    });

    describe('add', () => {
      const validWorktree: WorktreeMetadata = {
        id: 'SPEC-ABC-001',
        path: '/Users/dev/worktrees/tekton/SPEC-ABC-001',
        branch: 'feature/SPEC-ABC-001',
        base_branch: 'master',
        status: 'active',
        created_at: new Date().toISOString(),
      };

      it('should add a new worktree', async () => {
        await manager.add(validWorktree);

        const worktree = await manager.get('SPEC-ABC-001');
        expect(worktree).toEqual(validWorktree);
      });

      it('should persist worktree to disk', async () => {
        await manager.add(validWorktree);

        // Create new manager instance to verify persistence
        const newManager = new WorktreeRegistryManager(registryPath);
        await newManager.load();
        const worktree = await newManager.get('SPEC-ABC-001');
        expect(worktree).toEqual(validWorktree);
      });

      it('should throw error when adding duplicate worktree', async () => {
        await manager.add(validWorktree);
        await expect(manager.add(validWorktree)).rejects.toThrow('already exists');
      });

      it('should update last_updated timestamp', async () => {
        const registry1 = await manager.getAll();
        const timestamp1 = registry1.last_updated;

        await new Promise(resolve => setTimeout(resolve, 10));
        await manager.add(validWorktree);

        const registry2 = await manager.getAll();
        const timestamp2 = registry2.last_updated;

        expect(timestamp2).not.toBe(timestamp1);
      });
    });

    describe('get', () => {
      it('should return worktree by id', async () => {
        const worktree: WorktreeMetadata = {
          id: 'SPEC-ABC-001',
          path: '/test/path',
          branch: 'feature/SPEC-ABC-001',
          base_branch: 'master',
          status: 'active',
          created_at: new Date().toISOString(),
        };
        await manager.add(worktree);

        const result = await manager.get('SPEC-ABC-001');
        expect(result).toEqual(worktree);
      });

      it('should return undefined for non-existent worktree', async () => {
        const result = await manager.get('SPEC-XYZ-999');
        expect(result).toBeUndefined();
      });
    });

    describe('list', () => {
      it('should return empty array when no worktrees', async () => {
        const result = await manager.list();
        expect(result).toEqual([]);
      });

      it('should return all worktrees', async () => {
        const worktree1: WorktreeMetadata = {
          id: 'SPEC-ABC-001',
          path: '/test/path1',
          branch: 'feature/SPEC-ABC-001',
          base_branch: 'master',
          status: 'active',
          created_at: '2024-01-20T10:00:00.000Z',
        };
        const worktree2: WorktreeMetadata = {
          id: 'SPEC-XYZ-002',
          path: '/test/path2',
          branch: 'feature/SPEC-XYZ-002',
          base_branch: 'master',
          status: 'merged',
          created_at: '2024-01-20T11:00:00.000Z',
        };

        await manager.add(worktree1);
        await manager.add(worktree2);

        const result = await manager.list();
        expect(result).toHaveLength(2);
        expect(result).toContainEqual(worktree1);
        expect(result).toContainEqual(worktree2);
      });

      it('should filter worktrees by status', async () => {
        await manager.add({
          id: 'SPEC-ABC-001',
          path: '/test/path1',
          branch: 'feature/SPEC-ABC-001',
          base_branch: 'master',
          status: 'active',
          created_at: new Date().toISOString(),
        });
        await manager.add({
          id: 'SPEC-XYZ-002',
          path: '/test/path2',
          branch: 'feature/SPEC-XYZ-002',
          base_branch: 'master',
          status: 'merged',
          created_at: new Date().toISOString(),
        });

        const active = await manager.list({ status: 'active' });
        expect(active).toHaveLength(1);
        expect(active[0].id).toBe('SPEC-ABC-001');

        const merged = await manager.list({ status: 'merged' });
        expect(merged).toHaveLength(1);
        expect(merged[0].id).toBe('SPEC-XYZ-002');
      });
    });

    describe('update', () => {
      it('should update existing worktree', async () => {
        await manager.add({
          id: 'SPEC-ABC-001',
          path: '/test/path',
          branch: 'feature/SPEC-ABC-001',
          base_branch: 'master',
          status: 'active',
          created_at: '2024-01-20T10:00:00.000Z',
        });

        await manager.update('SPEC-ABC-001', {
          status: 'merged',
          last_sync: '2024-01-20T15:00:00.000Z',
        });

        const updated = await manager.get('SPEC-ABC-001');
        expect(updated?.status).toBe('merged');
        expect(updated?.last_sync).toBe('2024-01-20T15:00:00.000Z');
      });

      it('should throw error when updating non-existent worktree', async () => {
        await expect(
          manager.update('SPEC-XYZ-999', { status: 'merged' })
        ).rejects.toThrow('not found');
      });

      it('should persist updates to disk', async () => {
        await manager.add({
          id: 'SPEC-ABC-001',
          path: '/test/path',
          branch: 'feature/SPEC-ABC-001',
          base_branch: 'master',
          status: 'active',
          created_at: new Date().toISOString(),
        });

        await manager.update('SPEC-ABC-001', { status: 'merged' });

        // Verify with new manager instance
        const newManager = new WorktreeRegistryManager(registryPath);
        await newManager.load();
        const worktree = await newManager.get('SPEC-ABC-001');
        expect(worktree?.status).toBe('merged');
      });
    });

    describe('remove', () => {
      it('should remove existing worktree', async () => {
        await manager.add({
          id: 'SPEC-ABC-001',
          path: '/test/path',
          branch: 'feature/SPEC-ABC-001',
          base_branch: 'master',
          status: 'active',
          created_at: new Date().toISOString(),
        });

        await manager.remove('SPEC-ABC-001');

        const worktree = await manager.get('SPEC-ABC-001');
        expect(worktree).toBeUndefined();
      });

      it('should throw error when removing non-existent worktree', async () => {
        await expect(manager.remove('SPEC-XYZ-999')).rejects.toThrow('not found');
      });

      it('should persist removal to disk', async () => {
        await manager.add({
          id: 'SPEC-ABC-001',
          path: '/test/path',
          branch: 'feature/SPEC-ABC-001',
          base_branch: 'master',
          status: 'active',
          created_at: new Date().toISOString(),
        });

        await manager.remove('SPEC-ABC-001');

        // Verify with new manager instance
        const newManager = new WorktreeRegistryManager(registryPath);
        await newManager.load();
        const worktree = await newManager.get('SPEC-ABC-001');
        expect(worktree).toBeUndefined();
      });
    });
  });

  describe('Atomic Updates', () => {
    let manager: WorktreeRegistryManager;

    beforeEach(async () => {
      manager = new WorktreeRegistryManager(registryPath);
      await manager.load();
    });

    it('should clean up backup after successful save', async () => {
      await manager.add({
        id: 'SPEC-ABC-001',
        path: '/test/path',
        branch: 'feature/SPEC-ABC-001',
        base_branch: 'master',
        status: 'active',
        created_at: new Date().toISOString(),
      });

      // Backup should be cleaned up after successful operation
      const backupPath = `${registryPath}.backup`;
      const backupExists = await fs.pathExists(backupPath);
      expect(backupExists).toBe(false);

      // But registry should be saved successfully
      const worktree = await manager.get('SPEC-ABC-001');
      expect(worktree).toBeDefined();
    });

    it('should rollback on save error', async () => {
      // Add initial worktree
      await manager.add({
        id: 'SPEC-ABC-001',
        path: '/test/path',
        branch: 'feature/SPEC-ABC-001',
        base_branch: 'master',
        status: 'active',
        created_at: new Date().toISOString(),
      });

      // Make registry path read-only to force error
      await fs.chmod(registryPath, 0o444);

      try {
        // Try to add another worktree (should fail and rollback)
        await manager.add({
          id: 'SPEC-XYZ-002',
          path: '/test/path2',
          branch: 'feature/SPEC-XYZ-002',
          base_branch: 'master',
          status: 'active',
          created_at: new Date().toISOString(),
        });
      } catch (error) {
        // Expected to fail
      } finally {
        // Restore permissions
        await fs.chmod(registryPath, 0o644);
      }

      // Verify rollback - should only have first worktree
      const newManager = new WorktreeRegistryManager(registryPath);
      await newManager.load();
      const worktrees = await newManager.list();
      expect(worktrees).toHaveLength(1);
      expect(worktrees[0].id).toBe('SPEC-ABC-001');
    });
  });

  describe('Concurrent Access', () => {
    it('should handle concurrent add operations with locking', async () => {
      const manager1 = new WorktreeRegistryManager(registryPath);
      const manager2 = new WorktreeRegistryManager(registryPath);

      await manager1.load();
      await manager2.load();

      // Concurrent adds
      await Promise.all([
        manager1.add({
          id: 'SPEC-ABC-001',
          path: '/test/path1',
          branch: 'feature/SPEC-ABC-001',
          base_branch: 'master',
          status: 'active',
          created_at: new Date().toISOString(),
        }),
        manager2.add({
          id: 'SPEC-XYZ-002',
          path: '/test/path2',
          branch: 'feature/SPEC-XYZ-002',
          base_branch: 'master',
          status: 'active',
          created_at: new Date().toISOString(),
        }),
      ]);

      // Verify both were added
      const manager3 = new WorktreeRegistryManager(registryPath);
      await manager3.load();
      const worktrees = await manager3.list();
      expect(worktrees).toHaveLength(2);
    });
  });
});
