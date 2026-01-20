import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import { execa } from 'execa';
import {
  createWorktree,
  removeWorktree,
  listWorktrees,
  getCommitStatus,
  syncWorktree,
  isGitRepository,
  getCurrentBranch,
} from '../../../src/worktree/manager/git-operations.js';
import { GitOperationError } from '../../../src/worktree/utils/error-handler.js';

/**
 * Test Utility: Create Test Git Repository
 *
 * Creates a temporary Git repository with an initial commit
 */
async function createTestGitRepo(): Promise<string> {
  const repoPath = path.join(os.tmpdir(), `test-repo-${Date.now()}`);
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
 *
 * Removes a temporary test repository
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
      .filter((p) => p !== repoPath); // Don't remove main worktree

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

describe('Git Operations', () => {
  let testRepoPath: string;

  beforeEach(async () => {
    testRepoPath = await createTestGitRepo();
  });

  afterEach(async () => {
    await cleanupTestRepo(testRepoPath);
  });

  describe('isGitRepository', () => {
    it('should return true for valid Git repository', async () => {
      const result = await isGitRepository(testRepoPath);
      expect(result).toBe(true);
    });

    it('should return false for non-Git directory', async () => {
      const nonGitPath = path.join(os.tmpdir(), `non-git-${Date.now()}`);
      await fs.ensureDir(nonGitPath);

      const result = await isGitRepository(nonGitPath);

      expect(result).toBe(false);
      await fs.remove(nonGitPath);
    });

    it('should return false for non-existent directory', async () => {
      const result = await isGitRepository('/non/existent/path');
      expect(result).toBe(false);
    });
  });

  describe('getCurrentBranch', () => {
    it('should return current branch name', async () => {
      const branch = await getCurrentBranch(testRepoPath);

      expect(branch).toMatch(/^(main|master)$/);
    });

    it('should throw error for non-Git directory', async () => {
      const nonGitPath = path.join(os.tmpdir(), `non-git-${Date.now()}`);
      await fs.ensureDir(nonGitPath);

      await expect(getCurrentBranch(nonGitPath)).rejects.toThrow(GitOperationError);

      await fs.remove(nonGitPath);
    });
  });

  describe('createWorktree', () => {
    it('should create a new worktree from base branch', async () => {
      const worktreePath = path.join(os.tmpdir(), `worktree-${Date.now()}`);
      const baseBranch = await getCurrentBranch(testRepoPath);

      await createWorktree({
        repoPath: testRepoPath,
        branch: 'feature/test',
        path: worktreePath,
        base: baseBranch,
      });

      // Verify worktree was created
      expect(await fs.pathExists(worktreePath)).toBe(true);
      expect(await isGitRepository(worktreePath)).toBe(true);

      // Verify branch
      const branch = await getCurrentBranch(worktreePath);
      expect(branch).toBe('feature/test');

      // Cleanup
      await fs.remove(worktreePath);
    });

    it('should throw error when branch already exists', async () => {
      const worktreePath = path.join(os.tmpdir(), `worktree-${Date.now()}`);
      const baseBranch = await getCurrentBranch(testRepoPath);

      // Create first worktree
      await createWorktree({
        repoPath: testRepoPath,
        branch: 'feature/duplicate',
        path: worktreePath,
        base: baseBranch,
      });

      // Try to create duplicate branch
      const worktreePath2 = path.join(os.tmpdir(), `worktree-2-${Date.now()}`);
      await expect(
        createWorktree({
          repoPath: testRepoPath,
          branch: 'feature/duplicate',
          path: worktreePath2,
          base: baseBranch,
        })
      ).rejects.toThrow(GitOperationError);

      // Cleanup
      await fs.remove(worktreePath);
    });

    it('should throw error for non-existent base branch', async () => {
      const worktreePath = path.join(os.tmpdir(), `worktree-${Date.now()}`);

      await expect(
        createWorktree({
          repoPath: testRepoPath,
          branch: 'feature/test',
          path: worktreePath,
          base: 'non-existent-branch',
        })
      ).rejects.toThrow(GitOperationError);
    });
  });

  describe('listWorktrees', () => {
    it('should list main worktree', async () => {
      const worktrees = await listWorktrees(testRepoPath);

      expect(worktrees).toHaveLength(1);
      // Use realpath to resolve symlinks (macOS /private/var vs /var)
      const resolvedTestPath = await fs.realpath(testRepoPath);
      const resolvedWorktreePath = await fs.realpath(worktrees[0].path);
      expect(resolvedWorktreePath).toBe(resolvedTestPath);
      expect(worktrees[0].bare).toBe(false);
    });

    it('should list multiple worktrees', async () => {
      const baseBranch = await getCurrentBranch(testRepoPath);
      const worktreePath1 = path.join(os.tmpdir(), `worktree-1-${Date.now()}`);
      const worktreePath2 = path.join(os.tmpdir(), `worktree-2-${Date.now()}`);

      await createWorktree({
        repoPath: testRepoPath,
        branch: 'feature/one',
        path: worktreePath1,
        base: baseBranch,
      });

      await createWorktree({
        repoPath: testRepoPath,
        branch: 'feature/two',
        path: worktreePath2,
        base: baseBranch,
      });

      const worktrees = await listWorktrees(testRepoPath);

      expect(worktrees).toHaveLength(3);
      expect(worktrees.some((wt) => wt.branch === 'feature/one')).toBe(true);
      expect(worktrees.some((wt) => wt.branch === 'feature/two')).toBe(true);

      // Cleanup
      await fs.remove(worktreePath1);
      await fs.remove(worktreePath2);
    });
  });

  describe('removeWorktree', () => {
    it('should remove a worktree', async () => {
      const baseBranch = await getCurrentBranch(testRepoPath);
      const worktreePath = path.join(os.tmpdir(), `worktree-${Date.now()}`);

      await createWorktree({
        repoPath: testRepoPath,
        branch: 'feature/remove',
        path: worktreePath,
        base: baseBranch,
      });

      // Verify created
      expect(await fs.pathExists(worktreePath)).toBe(true);

      // Remove
      await removeWorktree(testRepoPath, worktreePath);

      // Verify removed
      expect(await fs.pathExists(worktreePath)).toBe(false);
    });

    it('should force remove worktree with uncommitted changes', async () => {
      const baseBranch = await getCurrentBranch(testRepoPath);
      const worktreePath = path.join(os.tmpdir(), `worktree-${Date.now()}`);

      await createWorktree({
        repoPath: testRepoPath,
        branch: 'feature/dirty',
        path: worktreePath,
        base: baseBranch,
      });

      // Create uncommitted changes
      await fs.writeFile(path.join(worktreePath, 'dirty.txt'), 'uncommitted');

      // Force remove
      await removeWorktree(testRepoPath, worktreePath, true);

      // Verify removed
      expect(await fs.pathExists(worktreePath)).toBe(false);
    });

    it('should throw error when removing non-existent worktree', async () => {
      await expect(
        removeWorktree(testRepoPath, '/non/existent/worktree')
      ).rejects.toThrow(GitOperationError);
    });
  });

  describe('getCommitStatus', () => {
    it('should return zero ahead/behind when up to date', async () => {
      const baseBranch = await getCurrentBranch(testRepoPath);
      const worktreePath = path.join(os.tmpdir(), `worktree-${Date.now()}`);

      await createWorktree({
        repoPath: testRepoPath,
        branch: 'feature/status',
        path: worktreePath,
        base: baseBranch,
      });

      const status = await getCommitStatus(worktreePath, baseBranch);

      expect(status.ahead).toBe(0);
      expect(status.behind).toBe(0);

      // Cleanup
      await fs.remove(worktreePath);
    });

    it('should detect ahead commits', async () => {
      const baseBranch = await getCurrentBranch(testRepoPath);
      const worktreePath = path.join(os.tmpdir(), `worktree-${Date.now()}`);

      await createWorktree({
        repoPath: testRepoPath,
        branch: 'feature/ahead',
        path: worktreePath,
        base: baseBranch,
      });

      // Create commit in worktree
      await fs.writeFile(path.join(worktreePath, 'new-file.txt'), 'new content');
      await execa('git', ['add', '.'], { cwd: worktreePath });
      await execa('git', ['commit', '-m', 'New commit'], { cwd: worktreePath });

      const status = await getCommitStatus(worktreePath, baseBranch);

      expect(status.ahead).toBe(1);
      expect(status.behind).toBe(0);

      // Cleanup
      await fs.remove(worktreePath);
    });

    it('should detect behind commits', async () => {
      const baseBranch = await getCurrentBranch(testRepoPath);
      const worktreePath = path.join(os.tmpdir(), `worktree-${Date.now()}`);

      await createWorktree({
        repoPath: testRepoPath,
        branch: 'feature/behind',
        path: worktreePath,
        base: baseBranch,
      });

      // Create commit in main repo
      await fs.writeFile(path.join(testRepoPath, 'main-file.txt'), 'main content');
      await execa('git', ['add', '.'], { cwd: testRepoPath });
      await execa('git', ['commit', '-m', 'Main commit'], { cwd: testRepoPath });

      const status = await getCommitStatus(worktreePath, baseBranch);

      expect(status.ahead).toBe(0);
      expect(status.behind).toBe(1);

      // Cleanup
      await fs.remove(worktreePath);
    });
  });

  describe('syncWorktree', () => {
    it('should sync with merge strategy', async () => {
      const baseBranch = await getCurrentBranch(testRepoPath);
      const worktreePath = path.join(os.tmpdir(), `worktree-${Date.now()}`);

      await createWorktree({
        repoPath: testRepoPath,
        branch: 'feature/sync-merge',
        path: worktreePath,
        base: baseBranch,
      });

      // Create commit in main repo
      await fs.writeFile(path.join(testRepoPath, 'sync-file.txt'), 'sync content');
      await execa('git', ['add', '.'], { cwd: testRepoPath });
      await execa('git', ['commit', '-m', 'Sync commit'], { cwd: testRepoPath });

      // Sync worktree
      await syncWorktree(worktreePath, baseBranch, 'merge');

      // Verify sync
      const syncedFileExists = await fs.pathExists(path.join(worktreePath, 'sync-file.txt'));
      expect(syncedFileExists).toBe(true);

      // Cleanup
      await fs.remove(worktreePath);
    });

    it('should sync with rebase strategy', async () => {
      const baseBranch = await getCurrentBranch(testRepoPath);
      const worktreePath = path.join(os.tmpdir(), `worktree-${Date.now()}`);

      await createWorktree({
        repoPath: testRepoPath,
        branch: 'feature/sync-rebase',
        path: worktreePath,
        base: baseBranch,
      });

      // Create commit in main repo
      await fs.writeFile(path.join(testRepoPath, 'rebase-file.txt'), 'rebase content');
      await execa('git', ['add', '.'], { cwd: testRepoPath });
      await execa('git', ['commit', '-m', 'Rebase commit'], { cwd: testRepoPath });

      // Sync worktree
      await syncWorktree(worktreePath, baseBranch, 'rebase');

      // Verify sync
      const rebasedFileExists = await fs.pathExists(
        path.join(worktreePath, 'rebase-file.txt')
      );
      expect(rebasedFileExists).toBe(true);

      // Cleanup
      await fs.remove(worktreePath);
    });

    it('should throw error on merge conflict', async () => {
      const baseBranch = await getCurrentBranch(testRepoPath);
      const worktreePath = path.join(os.tmpdir(), `worktree-${Date.now()}`);

      await createWorktree({
        repoPath: testRepoPath,
        branch: 'feature/conflict',
        path: worktreePath,
        base: baseBranch,
      });

      // Create conflicting commits
      const conflictFile = 'conflict.txt';

      // Commit in main
      await fs.writeFile(path.join(testRepoPath, conflictFile), 'main version');
      await execa('git', ['add', '.'], { cwd: testRepoPath });
      await execa('git', ['commit', '-m', 'Main version'], { cwd: testRepoPath });

      // Commit in worktree
      await fs.writeFile(path.join(worktreePath, conflictFile), 'worktree version');
      await execa('git', ['add', '.'], { cwd: worktreePath });
      await execa('git', ['commit', '-m', 'Worktree version'], { cwd: worktreePath });

      // Try to sync - should fail with conflict
      await expect(syncWorktree(worktreePath, baseBranch, 'merge')).rejects.toThrow(
        GitOperationError
      );

      // Cleanup
      await fs.remove(worktreePath);
    });
  });
});
