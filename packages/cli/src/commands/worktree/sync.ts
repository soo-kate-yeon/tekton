/**
 * Worktree Sync Command
 *
 * Sync worktree with base branch
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { WorktreeManager } from '../../worktree/manager/worktree-manager.js';
import type { WorktreeConfig } from '../../worktree/models/worktree.types.js';

/**
 * Sync Options
 */
interface SyncOptions {
  strategy: 'merge' | 'rebase';
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
 * Create Sync Command
 *
 * Creates the worktree sync command
 */
export function createSyncCommand(): Command {
  const command = new Command('sync');

  command
    .description('Sync worktree with base branch')
    .argument('<spec-id>', 'SPEC identifier')
    .option('--strategy <merge|rebase>', 'Sync strategy', 'merge')
    .option('--dry-run', 'Show what would be synced without doing it')
    .action(async (specId: string, options: SyncOptions) => {
      try {
        const manager = getWorktreeManager();
        await manager.initialize();

        // Validate strategy
        if (options.strategy !== 'merge' && options.strategy !== 'rebase') {
          throw new Error('Strategy must be either "merge" or "rebase"');
        }

        // Get current status
        const status = await manager.getStatus(specId);

        console.log(chalk.blue('Current status:'));
        console.log(chalk.gray(`  Ahead: ${status.ahead} commits`));
        console.log(chalk.gray(`  Behind: ${status.behind} commits`));

        if (status.uncommittedChanges > 0) {
          console.log(
            chalk.yellow(`  Uncommitted changes: ${status.uncommittedChanges} files`)
          );
        }

        // Dry run mode
        if (options.dryRun) {
          console.log(chalk.yellow('\nDry run - no changes made'));
          if (status.behind > 0) {
            console.log(
              chalk.gray(
                `Would sync ${status.behind} commits from base branch using ${options.strategy}`
              )
            );
          } else {
            console.log(chalk.gray('No sync needed - already up to date'));
          }
          return;
        }

        // Check if already up to date
        if (status.behind === 0) {
          console.log(chalk.green('\n✓ Already up to date'));
          return;
        }

        // Perform sync
        const spinner = ora('Syncing worktree...').start();

        try {
          await manager.sync(specId, options.strategy);
          spinner.succeed(chalk.green('✓ Worktree synced successfully'));
          console.log(chalk.gray(`  Strategy: ${options.strategy}`));
          console.log(chalk.gray(`  Synced: ${status.behind} commits`));
        } catch (syncError) {
          spinner.fail(chalk.red('✗ Sync failed'));

          if (
            syncError instanceof Error &&
            syncError.message.toLowerCase().includes('conflict')
          ) {
            console.error(chalk.red('\n✗ Merge conflict detected'));
            console.error(
              chalk.gray('  Resolve conflicts manually in the worktree and commit')
            );
            console.error(chalk.gray('  Then run sync again'));
          } else {
            throw syncError;
          }

          process.exit(1);
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
