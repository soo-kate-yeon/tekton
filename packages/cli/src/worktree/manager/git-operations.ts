/**
 * Git Operations
 *
 * Git worktree command wrappers using execa
 */

import { execa } from 'execa';
import { GitOperationError } from '../utils/error-handler.js';

/**
 * Worktree Info
 *
 * Information about a Git worktree from `git worktree list`
 */
export interface WorktreeInfo {
  path: string;
  branch: string;
  bare: boolean;
  detached?: boolean;
  locked?: boolean;
}

/**
 * Commit Status
 *
 * Number of commits ahead and behind base branch
 */
export interface CommitStatus {
  ahead: number;
  behind: number;
  uncommittedChanges: number;
}

/**
 * Create Worktree Options
 */
export interface CreateWorktreeOptions {
  repoPath: string;
  branch: string;
  path: string;
  base: string;
}

/**
 * Is Git Repository
 *
 * Checks if a directory is a Git repository
 *
 * @param path - Path to check
 * @returns True if path is a Git repository
 */
export async function isGitRepository(path: string): Promise<boolean> {
  try {
    await execa('git', ['rev-parse', '--git-dir'], { cwd: path });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get Current Branch
 *
 * Gets the current branch name for a Git repository
 *
 * @param path - Repository or worktree path
 * @returns Current branch name
 * @throws {GitOperationError} If not a Git repository or command fails
 */
export async function getCurrentBranch(path: string): Promise<string> {
  try {
    const { stdout } = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
      cwd: path,
    });
    return stdout.trim();
  } catch (error) {
    throw new GitOperationError('Failed to get current branch', {
      command: 'git rev-parse --abbrev-ref HEAD',
      cause: error,
    });
  }
}

/**
 * Create Worktree
 *
 * Creates a new Git worktree from a base branch
 *
 * @param options - Worktree creation options
 * @throws {GitOperationError} If creation fails
 */
export async function createWorktree(options: CreateWorktreeOptions): Promise<void> {
  const { repoPath, branch, path, base } = options;

  try {
    await execa(
      'git',
      ['worktree', 'add', '-b', branch, path, base],
      { cwd: repoPath }
    );
  } catch (error: any) {
    throw new GitOperationError(`Failed to create worktree: ${error.message}`, {
      command: `git worktree add -b ${branch} ${path} ${base}`,
      exitCode: error.exitCode,
      stderr: error.stderr,
      cause: error,
    });
  }
}

/**
 * Remove Worktree
 *
 * Removes a Git worktree
 *
 * @param repoPath - Main repository path
 * @param worktreePath - Worktree path to remove
 * @param force - Force removal even with uncommitted changes
 * @throws {GitOperationError} If removal fails
 */
export async function removeWorktree(
  repoPath: string,
  worktreePath: string,
  force: boolean = false
): Promise<void> {
  try {
    const args = ['worktree', 'remove'];
    if (force) {
      args.push('--force');
    }
    args.push(worktreePath);

    await execa('git', args, { cwd: repoPath });
  } catch (error: any) {
    throw new GitOperationError(`Failed to remove worktree: ${error.message}`, {
      command: `git worktree remove ${force ? '--force ' : ''}${worktreePath}`,
      exitCode: error.exitCode,
      stderr: error.stderr,
      cause: error,
    });
  }
}

/**
 * List Worktrees
 *
 * Lists all worktrees for a Git repository
 *
 * @param repoPath - Repository path
 * @returns Array of worktree information
 * @throws {GitOperationError} If listing fails
 */
export async function listWorktrees(repoPath: string): Promise<WorktreeInfo[]> {
  try {
    const { stdout } = await execa('git', ['worktree', 'list', '--porcelain'], {
      cwd: repoPath,
    });

    const worktrees: WorktreeInfo[] = [];
    const lines = stdout.split('\n');

    let currentWorktree: Partial<WorktreeInfo> = {};

    for (const line of lines) {
      if (line.startsWith('worktree ')) {
        currentWorktree.path = line.replace('worktree ', '');
      } else if (line.startsWith('HEAD ')) {
        // HEAD commit SHA (we don't need this)
      } else if (line.startsWith('branch ')) {
        // branch refs/heads/main -> main
        const branchRef = line.replace('branch ', '');
        currentWorktree.branch = branchRef.replace('refs/heads/', '');
      } else if (line === 'bare') {
        currentWorktree.bare = true;
      } else if (line === 'detached') {
        currentWorktree.detached = true;
      } else if (line.startsWith('locked ')) {
        currentWorktree.locked = true;
      } else if (line === '') {
        // Empty line signals end of worktree entry
        if (currentWorktree.path) {
          worktrees.push({
            path: currentWorktree.path,
            branch: currentWorktree.branch || 'HEAD',
            bare: currentWorktree.bare || false,
            detached: currentWorktree.detached,
            locked: currentWorktree.locked,
          });
        }
        currentWorktree = {};
      }
    }

    // Handle last entry if no trailing newline
    if (currentWorktree.path) {
      worktrees.push({
        path: currentWorktree.path,
        branch: currentWorktree.branch || 'HEAD',
        bare: currentWorktree.bare || false,
        detached: currentWorktree.detached,
        locked: currentWorktree.locked,
      });
    }

    return worktrees;
  } catch (error: any) {
    throw new GitOperationError(`Failed to list worktrees: ${error.message}`, {
      command: 'git worktree list --porcelain',
      exitCode: error.exitCode,
      stderr: error.stderr,
      cause: error,
    });
  }
}

/**
 * Get Commit Status
 *
 * Gets the number of commits ahead and behind base branch
 *
 * @param worktreePath - Worktree path
 * @param baseBranch - Base branch to compare against
 * @returns Commit status (ahead and behind counts)
 * @throws {GitOperationError} If status check fails
 */
export async function getCommitStatus(
  worktreePath: string,
  baseBranch: string
): Promise<CommitStatus> {
  try {
    const { stdout } = await execa(
      'git',
      ['rev-list', '--left-right', '--count', `${baseBranch}...HEAD`],
      { cwd: worktreePath }
    );

    const [behind, ahead] = stdout.trim().split('\t').map(Number);

    // Get uncommitted changes count
    let uncommittedChanges = 0;
    try {
      const { stdout: statusOut } = await execa('git', ['status', '--porcelain'], {
        cwd: worktreePath,
      });
      uncommittedChanges = statusOut.split('\n').filter((line) => line.trim()).length;
    } catch {
      // If status fails, default to 0
      uncommittedChanges = 0;
    }

    return { ahead, behind, uncommittedChanges };
  } catch (error: any) {
    throw new GitOperationError(`Failed to get commit status: ${error.message}`, {
      command: `git rev-list --left-right --count ${baseBranch}...HEAD`,
      exitCode: error.exitCode,
      stderr: error.stderr,
      cause: error,
    });
  }
}

/**
 * Sync Worktree
 *
 * Syncs a worktree with its base branch using merge or rebase
 *
 * @param worktreePath - Worktree path
 * @param baseBranch - Base branch to sync with
 * @param strategy - Sync strategy ('merge' or 'rebase')
 * @throws {GitOperationError} If sync fails or there are conflicts
 */
export async function syncWorktree(
  worktreePath: string,
  baseBranch: string,
  strategy: 'merge' | 'rebase' = 'merge'
): Promise<void> {
  try {
    // Check if origin remote exists
    const { stdout: remotes } = await execa('git', ['remote'], { cwd: worktreePath });
    const hasOrigin = remotes.includes('origin');

    if (hasOrigin) {
      // Fetch latest changes from origin
      await execa('git', ['fetch', 'origin', baseBranch], { cwd: worktreePath });

      if (strategy === 'merge') {
        // Merge base branch into current branch
        await execa('git', ['merge', `origin/${baseBranch}`], { cwd: worktreePath });
      } else {
        // Rebase current branch onto base branch
        await execa('git', ['rebase', `origin/${baseBranch}`], { cwd: worktreePath });
      }
    } else {
      // No remote - sync with local base branch
      if (strategy === 'merge') {
        await execa('git', ['merge', baseBranch], { cwd: worktreePath });
      } else {
        await execa('git', ['rebase', baseBranch], { cwd: worktreePath });
      }
    }
  } catch (error: any) {
    // Check if it's a merge/rebase conflict
    const isConflict =
      error.stderr?.includes('CONFLICT') ||
      error.stderr?.includes('conflict') ||
      error.exitCode === 1;

    if (isConflict) {
      // Try to abort the merge/rebase
      try {
        if (strategy === 'merge') {
          await execa('git', ['merge', '--abort'], { cwd: worktreePath });
        } else {
          await execa('git', ['rebase', '--abort'], { cwd: worktreePath });
        }
      } catch {
        // Ignore abort errors
      }
    }

    throw new GitOperationError(
      `Failed to sync worktree using ${strategy}: ${error.message}`,
      {
        command:
          strategy === 'merge'
            ? `git merge ${baseBranch}`
            : `git rebase ${baseBranch}`,
        exitCode: error.exitCode,
        stderr: error.stderr,
        cause: error,
      }
    );
  }
}
