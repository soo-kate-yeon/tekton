import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import { execa } from 'execa';
import { WorktreeManager } from '../../../src/worktree/manager/worktree-manager.js';
import type { WorktreeConfig } from '../../../src/worktree/models/worktree.types.js';

/**
 * Test Utility: Create Test Git Repository
 */
async function createTestGitRepo(): Promise<string> {
  const repoPath = path.join(os.tmpdir(), `test-repo-${Date.now()}-${Math.random()}`);
  await fs.ensureDir(repoPath);

  // Initialize Git repo
  await execa('git', ['init'], { cwd: repoPath });
  await execa('git', ['config', 'user.name', 'Test User'], { cwd: repoPath });
  await execa('git', ['config', 'user.email', 'test@example.com'], { cwd: repoPath });

  // Create initial commit
  await fs.writeFile(path.join(repoPath, 'README.md'), '# Test Repo');
  await execa('git', ['add', '.'], { cwd: repoPath });
  await execa('git', ['commit', '-m', 'Initial commit'], { cwd: repoPath });

  // Create main branch (for consistency)
  try {
    await execa('git', ['branch', '-M', 'main'], { cwd: repoPath });
  } catch {
    // Already on main or master
  }

  return repoPath;
}

/**
 * Test Utility: Cleanup Test Repository
 */
async function cleanupTestRepo(repoPath: string): Promise<void> {
  try {
    // Remove all worktrees first
    const { stdout } = await execa('git', ['worktree', 'list', '--porcelain'], {
      cwd: repoPath,
    });

    const worktreePaths = stdout
      .split('\n')
      .filter((line) => line.startsWith('worktree '))
      .map((line) => line.replace('worktree ', ''))
      .filter((p) => p !== repoPath);

    for (const wtPath of worktreePaths) {
      try {
        await execa('git', ['worktree', 'remove', '--force', wtPath], { cwd: repoPath });
      } catch {
        // Ignore errors
      }
    }
  } catch {
    // Ignore errors
  }

  await fs.remove(repoPath);
}

describe('Worktree Manager', () => {
  let testRepoPath: string;
  let worktreeManager: WorktreeManager;
  let registryPath: string;
  let worktreeRoot: string;

  beforeEach(async () => {
    testRepoPath = await createTestGitRepo();
    worktreeRoot = path.join(os.tmpdir(), `worktrees-${Date.now()}-${Math.random()}`);
    registryPath = path.join(worktreeRoot, '.worktree-registry.json');

    // Create registry directory
    await fs.ensureDir(worktreeRoot);

    const config: WorktreeConfig = {
      worktree_root: worktreeRoot,
      auto_sync: false,
      cleanup_merged: false,
      default_base: 'main',
    };

    worktreeManager = new WorktreeManager(registryPath, config, testRepoPath);
    await worktreeManager.initialize();
  });

  afterEach(async () => {
    await cleanupTestRepo(testRepoPath);
    await fs.remove(worktreeRoot);
  });

  describe('initialize', () => {
    it('should create registry if it does not exist', async () => {
      const exists = await fs.pathExists(registryPath);
      expect(exists).toBe(true);
    });

    it('should load existing registry', async () => {
      // Create second manager with same registry
      const manager2 = new WorktreeManager(registryPath, {
        worktree_root: worktreeRoot,
        auto_sync: false,
        cleanup_merged: false,
        default_base: 'main',
      }, testRepoPath);

      await manager2.initialize();

      const registry = await manager2.getRegistry();
      expect(registry.version).toBe('1.0.0');
    });
  });

  describe('create', () => {
    it('should create a new worktree and register it', async () => {
      const specId = 'SPEC-AUTH-001';
      const description = 'Authentication feature';

      const worktree = await worktreeManager.create(specId, description);

      // Verify worktree object
      expect(worktree.id).toBe(specId);
      expect(worktree.branch).toBe('feature/SPEC-AUTH-001');
      expect(worktree.base_branch).toBe('main');
      expect(worktree.status).toBe('active');
      expect(worktree.path).toContain(specId);

      // Verify worktree directory exists
      expect(await fs.pathExists(worktree.path)).toBe(true);

      // Verify registered in registry
      const registered = await worktreeManager.get(specId);
      expect(registered).toBeDefined();
      expect(registered?.id).toBe(specId);
    });

    it('should throw error when worktree already exists', async () => {
      const specId = 'SPEC-AUTH-002';

      await worktreeManager.create(specId, 'First');

      await expect(worktreeManager.create(specId, 'Duplicate')).rejects.toThrow();
    });

    it('should use custom branch name if provided', async () => {
      const specId = 'SPEC-AUTH-003';

      const worktree = await worktreeManager.create(specId, 'Custom branch', {
        branch: 'custom/feature-branch',
      });

      expect(worktree.branch).toBe('custom/feature-branch');
    });

    it('should use custom base branch if provided', async () => {
      // Create a develop branch first
      await execa('git', ['checkout', '-b', 'develop'], { cwd: testRepoPath });
      await execa('git', ['checkout', 'main'], { cwd: testRepoPath });

      const specId = 'SPEC-AUTH-004';

      const worktree = await worktreeManager.create(specId, 'From develop', {
        base: 'develop',
      });

      expect(worktree.base_branch).toBe('develop');
    });
  });

  describe('list', () => {
    it('should return empty array when no worktrees', async () => {
      const worktrees = await worktreeManager.list();
      expect(worktrees).toEqual([]);
    });

    it('should list all created worktrees', async () => {
      await worktreeManager.create('SPEC-ONE-001', 'First');
      await worktreeManager.create('SPEC-TWO-002', 'Second');
      await worktreeManager.create('SPEC-THREE-003', 'Third');

      const worktrees = await worktreeManager.list();

      expect(worktrees).toHaveLength(3);
      expect(worktrees.map((w) => w.id)).toContain('SPEC-ONE-001');
      expect(worktrees.map((w) => w.id)).toContain('SPEC-TWO-002');
      expect(worktrees.map((w) => w.id)).toContain('SPEC-THREE-003');
    });

    it('should filter by status', async () => {
      const wt1 = await worktreeManager.create('SPEC-ACTIVE-001', 'Active');
      await worktreeManager.create('SPEC-ACTIVE-002', 'Active 2');

      // Mark one as merged
      await worktreeManager.updateStatus(wt1.id, 'merged');

      const activeWorktrees = await worktreeManager.list('active');
      expect(activeWorktrees).toHaveLength(1);
      expect(activeWorktrees[0].id).toBe('SPEC-ACTIVE-002');

      const mergedWorktrees = await worktreeManager.list('merged');
      expect(mergedWorktrees).toHaveLength(1);
      expect(mergedWorktrees[0].id).toBe('SPEC-ACTIVE-001');
    });
  });

  describe('get', () => {
    it('should return worktree by ID', async () => {
      const specId = 'SPEC-GET-001';
      await worktreeManager.create(specId, 'Test');

      const worktree = await worktreeManager.get(specId);

      expect(worktree).toBeDefined();
      expect(worktree?.id).toBe(specId);
    });

    it('should return undefined for non-existent worktree', async () => {
      const worktree = await worktreeManager.get('NON-EXISTENT');
      expect(worktree).toBeUndefined();
    });
  });

  describe('remove', () => {
    it('should remove worktree and unregister it', async () => {
      const specId = 'SPEC-REMOVE-001';
      const worktree = await worktreeManager.create(specId, 'To be removed');

      // Verify created
      expect(await fs.pathExists(worktree.path)).toBe(true);
      expect(await worktreeManager.get(specId)).toBeDefined();

      // Remove
      await worktreeManager.remove(specId);

      // Verify removed
      expect(await fs.pathExists(worktree.path)).toBe(false);
      expect(await worktreeManager.get(specId)).toBeUndefined();
    });

    it('should force remove with uncommitted changes', async () => {
      const specId = 'SPEC-REMOVE-002';
      const worktree = await worktreeManager.create(specId, 'Dirty worktree');

      // Create uncommitted changes
      await fs.writeFile(path.join(worktree.path, 'dirty.txt'), 'uncommitted');

      // Force remove
      await worktreeManager.remove(specId, true);

      // Verify removed
      expect(await fs.pathExists(worktree.path)).toBe(false);
    });

    it('should throw error when removing non-existent worktree', async () => {
      await expect(worktreeManager.remove('NON-EXISTENT')).rejects.toThrow();
    });
  });

  describe('sync', () => {
    it('should sync worktree with base branch', async () => {
      const specId = 'SPEC-SYNC-001';
      const worktree = await worktreeManager.create(specId, 'Sync test');

      // Create commit in main repo
      await fs.writeFile(path.join(testRepoPath, 'sync-file.txt'), 'sync content');
      await execa('git', ['add', '.'], { cwd: testRepoPath });
      await execa('git', ['commit', '-m', 'Sync commit'], { cwd: testRepoPath });

      // Sync worktree
      await worktreeManager.sync(specId);

      // Verify file was synced
      const syncedFileExists = await fs.pathExists(path.join(worktree.path, 'sync-file.txt'));
      expect(syncedFileExists).toBe(true);

      // Verify last_sync updated
      const updated = await worktreeManager.get(specId);
      expect(updated?.last_sync).toBeDefined();
    });

    it('should use custom sync strategy', async () => {
      const specId = 'SPEC-SYNC-002';
      const worktree = await worktreeManager.create(specId, 'Rebase sync');

      // Create commit in main repo
      await fs.writeFile(path.join(testRepoPath, 'rebase-file.txt'), 'rebase content');
      await execa('git', ['add', '.'], { cwd: testRepoPath });
      await execa('git', ['commit', '-m', 'Rebase commit'], { cwd: testRepoPath });

      // Sync with rebase
      await worktreeManager.sync(specId, 'rebase');

      // Verify file was synced
      const syncedFileExists = await fs.pathExists(path.join(worktree.path, 'rebase-file.txt'));
      expect(syncedFileExists).toBe(true);
    });
  });

  describe('getStatus', () => {
    it('should return commit status', async () => {
      const specId = 'SPEC-STATUS-001';
      const worktree = await worktreeManager.create(specId, 'Status test');

      // Initially no commits ahead/behind
      let status = await worktreeManager.getStatus(specId);
      expect(status.ahead).toBe(0);
      expect(status.behind).toBe(0);

      // Create commit in worktree
      await fs.writeFile(path.join(worktree.path, 'new-file.txt'), 'new content');
      await execa('git', ['add', '.'], { cwd: worktree.path });
      await execa('git', ['commit', '-m', 'New commit'], { cwd: worktree.path });

      // Check status again
      status = await worktreeManager.getStatus(specId);
      expect(status.ahead).toBe(1);
      expect(status.behind).toBe(0);
    });

    it('should throw error for non-existent worktree', async () => {
      await expect(worktreeManager.getStatus('NON-EXISTENT')).rejects.toThrow();
    });
  });

  describe('updateStatus', () => {
    it('should update worktree status', async () => {
      const specId = 'SPEC-UPDATE-001';
      await worktreeManager.create(specId, 'Update status');

      // Initially active
      let worktree = await worktreeManager.get(specId);
      expect(worktree?.status).toBe('active');

      // Update to merged
      await worktreeManager.updateStatus(specId, 'merged');

      worktree = await worktreeManager.get(specId);
      expect(worktree?.status).toBe('merged');
    });
  });
});
