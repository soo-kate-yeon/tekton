/**
 * Worktree Status Command
 *
 * Display worktree status information
 */

import { Command } from 'commander';
import chalk from 'chalk';
import Table from 'cli-table3';
import { WorktreeManager } from '../../worktree/manager/worktree-manager.js';
import type { WorktreeConfig } from '../../worktree/models/worktree.types.js';

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
 * Format Relative Time
 *
 * Formats ISO timestamp to relative time (e.g., "2 days ago")
 */
function formatRelativeTime(isoString?: string): string {
  if (!isoString) return 'never';

  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  return 'just now';
}

/**
 * Get Status Color
 *
 * Returns color based on worktree status
 */
function getStatusColor(
  status: string,
  uncommittedChanges: number
): (text: string) => string {
  if (uncommittedChanges > 0) return chalk.yellow;
  if (status === 'merged') return chalk.gray;
  if (status === 'stale') return chalk.red;
  return chalk.green;
}

/**
 * Create Status Command
 *
 * Creates the worktree status command
 */
export function createStatusCommand(): Command {
  const command = new Command('status');

  command
    .description('Show worktree status')
    .argument('[spec-id]', 'SPEC identifier (optional - shows all if omitted)')
    .action(async (specId?: string) => {
      try {
        const manager = getWorktreeManager();
        await manager.initialize();

        if (specId) {
          // Show detailed status for one worktree
          await showDetailedStatus(manager, specId);
        } else {
          // Show table status for all worktrees
          await showTableStatus(manager);
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

/**
 * Show Detailed Status
 *
 * Shows detailed status for a single worktree
 */
async function showDetailedStatus(
  manager: WorktreeManager,
  specId: string
): Promise<void> {
  const worktree = await manager.get(specId);
  if (!worktree) {
    throw new Error(`Worktree ${specId} not found`);
  }

  const status = await manager.getStatus(specId);

  console.log(chalk.cyan(`\nWorktree: ${specId}`));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(`${chalk.bold('Branch:')} ${worktree.branch}`);
  console.log(`${chalk.bold('Base:')} ${worktree.base_branch}`);
  console.log(`${chalk.bold('Path:')} ${worktree.path}`);
  console.log(
    `${chalk.bold('Status:')} ${getStatusColor(worktree.status, status.uncommittedChanges)(worktree.status)}`
  );

  console.log(chalk.gray('─'.repeat(50)));
  console.log(`${chalk.bold('Commits ahead:')} ${status.ahead}`);
  console.log(`${chalk.bold('Commits behind:')} ${status.behind}`);
  console.log(`${chalk.bold('Uncommitted changes:')} ${status.uncommittedChanges}`);

  console.log(chalk.gray('─'.repeat(50)));
  console.log(`${chalk.bold('Created:')} ${formatRelativeTime(worktree.created_at)}`);
  console.log(`${chalk.bold('Last sync:')} ${formatRelativeTime(status.lastSync)}`);

  // Status indicators
  if (status.uncommittedChanges > 0) {
    console.log(
      chalk.yellow(`\n⚠ Warning: ${status.uncommittedChanges} uncommitted changes`)
    );
  }
  if (status.behind > 0) {
    console.log(chalk.yellow(`⚠ Behind base branch by ${status.behind} commits`));
  }
  if (worktree.status === 'stale') {
    console.log(chalk.red('⚠ Worktree is stale (not synced recently)'));
  }
  if (status.uncommittedChanges === 0 && status.behind === 0) {
    console.log(chalk.green('\n✓ Worktree is clean and up to date'));
  }
}

/**
 * Show Table Status
 *
 * Shows table status for all worktrees
 */
async function showTableStatus(manager: WorktreeManager): Promise<void> {
  const worktrees = await manager.list();

  if (worktrees.length === 0) {
    console.log(chalk.yellow('No worktrees found'));
    return;
  }

  const table = new (Table as any)({
    head: [
      chalk.cyan('SPEC ID'),
      chalk.cyan('Branch'),
      chalk.cyan('Status'),
      chalk.cyan('Ahead'),
      chalk.cyan('Behind'),
      chalk.cyan('Changes'),
      chalk.cyan('Last Sync'),
    ],
    colWidths: [20, 25, 12, 8, 8, 10, 15],
  });

  for (const worktree of worktrees) {
    try {
      const status = await manager.getStatus(worktree.id);
      const colorFn = getStatusColor(worktree.status, status.uncommittedChanges);

      table.push([
        worktree.id,
        worktree.branch,
        colorFn(worktree.status),
        status.ahead.toString(),
        status.behind.toString(),
        status.uncommittedChanges > 0
          ? chalk.yellow(status.uncommittedChanges.toString())
          : chalk.green('0'),
        formatRelativeTime(status.lastSync),
      ]);
    } catch (error) {
      // If status fails, show basic info
      table.push([
        worktree.id,
        worktree.branch,
        chalk.red('error'),
        '-',
        '-',
        '-',
        formatRelativeTime(worktree.last_sync),
      ]);
    }
  }

  console.log(table.toString());
  console.log(
    chalk.gray(
      `\nTotal: ${worktrees.length} worktree${worktrees.length !== 1 ? 's' : ''}`
    )
  );
}
