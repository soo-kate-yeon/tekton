/**
 * Worktree Clean Command
 *
 * Clean up worktrees based on criteria
 */

import { Command } from 'commander';
import chalk from 'chalk';
import * as enquirer from 'enquirer';
import { WorktreeManager } from '../../worktree/manager/worktree-manager.js';
import type { WorktreeConfig } from '../../worktree/models/worktree.types.js';
import type { Worktree } from '../../worktree/models/worktree.types.js';

/**
 * Clean Options
 */
interface CleanOptions {
  mergedOnly: boolean;
  all: boolean;
  staleDays?: number;
  dryRun?: boolean;
}

/**
 * Get Worktree Manager
 *
 * Creates a WorktreeManager instance for the current repository
 */
function getWorktreeManager(): WorktreeManager {
  const repoPath = process.cwd();
  const registryPath = '.moai/worktree/registry.json';
  const config: WorktreeConfig = {
    worktree_root: '~/worktrees/{PROJECT_NAME}/',
    auto_sync: false,
    cleanup_merged: true,
    default_base: 'master',
  };

  return new WorktreeManager(registryPath, config, repoPath);
}

/**
 * Is Stale
 *
 * Checks if a worktree is stale based on last sync time
 */
function isStale(worktree: Worktree, staleDays: number): boolean {
  if (!worktree.last_sync) return true;

  const lastSync = new Date(worktree.last_sync);
  const now = new Date();
  const diffMs = now.getTime() - lastSync.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays >= staleDays;
}

/**
 * Filter Worktrees
 *
 * Filters worktrees based on clean criteria
 */
function filterWorktrees(worktrees: Worktree[], options: CleanOptions): Worktree[] {
  let filtered = worktrees;

  if (options.all) {
    // Remove all non-active worktrees
    filtered = filtered.filter((w) => w.status !== 'active');
  } else if (options.staleDays !== undefined) {
    // Remove stale worktrees
    filtered = filtered.filter((w) => isStale(w, options.staleDays!));
  } else if (options.mergedOnly) {
    // Remove only merged worktrees (default)
    filtered = filtered.filter((w) => w.status === 'merged');
  }

  return filtered;
}

/**
 * Create Clean Command
 *
 * Creates the worktree clean command
 */
export function createCleanCommand(): Command {
  const command = new Command('clean');

  command
    .description('Clean up worktrees')
    .option('--merged-only', 'Only remove merged worktrees', true)
    .option('--all', 'Remove all inactive worktrees')
    .option('--stale-days <n>', 'Remove worktrees not synced in N days', parseInt)
    .option('--dry-run', 'Show what would be removed without doing it')
    .action(async (options: CleanOptions) => {
      try {
        const manager = getWorktreeManager();
        await manager.initialize();

        // Get all worktrees
        const allWorktrees = await manager.list();

        if (allWorktrees.length === 0) {
          console.log(chalk.yellow('No worktrees found'));
          return;
        }

        // Filter worktrees to remove
        const toRemove = filterWorktrees(allWorktrees, options);

        if (toRemove.length === 0) {
          console.log(chalk.green('✓ No worktrees match the cleanup criteria'));
          return;
        }

        // Display what will be removed
        console.log(chalk.cyan(`\nWorktrees to remove (${toRemove.length}):`));
        console.log(chalk.gray('─'.repeat(50)));
        toRemove.forEach((w) => {
          console.log(`  ${chalk.yellow('•')} ${w.id} (${w.status})`);
        });
        console.log(chalk.gray('─'.repeat(50)));

        // Dry run mode
        if (options.dryRun) {
          console.log(chalk.yellow('\nDry run - no changes made'));
          console.log(
            chalk.gray(`Would remove ${toRemove.length} worktree${toRemove.length !== 1 ? 's' : ''}`)
          );
          return;
        }

        // Confirm removal
        const { confirmed } = await enquirer.prompt<{ confirmed: boolean }>({
          type: 'confirm',
          name: 'confirmed',
          message: `Remove ${toRemove.length} worktree${toRemove.length !== 1 ? 's' : ''}?`,
          initial: false,
        });

        if (!confirmed) {
          console.log(chalk.yellow('Cleanup cancelled'));
          return;
        }

        // Remove worktrees
        let removed = 0;
        let failed = 0;

        for (const worktree of toRemove) {
          try {
            await manager.remove(worktree.id, false);
            console.log(chalk.green(`✓ Removed ${worktree.id}`));
            removed++;
          } catch (error) {
            console.error(
              chalk.red(
                `✗ Failed to remove ${worktree.id}: ${error instanceof Error ? error.message : String(error)}`
              )
            );
            failed++;
          }
        }

        // Summary
        console.log(chalk.cyan('\nSummary:'));
        console.log(chalk.green(`  Removed: ${removed}`));
        if (failed > 0) {
          console.log(chalk.red(`  Failed: ${failed}`));
        }
      } catch (error) {
        console.error(
          chalk.red(`✗ ${error instanceof Error ? error.message : String(error)}`)
        );
        process.exit(1);
      }
    });

  return command;
}
