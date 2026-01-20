import { Command } from 'commander';
import chalk from 'chalk';
import Table from 'cli-table3';
import { WorktreeManager } from '../../worktree/manager/worktree-manager.js';
import * as path from 'path';
import * as os from 'os';
import type { WorktreeConfig, WorktreeStatus } from '../../worktree/models/worktree.types.js';

/**
 * Default worktree configuration
 */
const DEFAULT_CONFIG: WorktreeConfig = {
  worktree_root: path.join(os.homedir(), '.worktrees'),
  default_base: 'master',
  auto_sync: false,
  cleanup_merged: false,
};

/**
 * Format relative time from ISO date string
 */
function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;

  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo ago`;
}

/**
 * Get status color
 */
function getStatusColor(status: WorktreeStatus): (text: string) => string {
  switch (status) {
    case 'active':
      return chalk.green;
    case 'merged':
      return chalk.gray;
    case 'stale':
      return chalk.yellow;
    default:
      return chalk.white;
  }
}

/**
 * Create the 'list' command
 *
 * Lists all worktrees with optional filtering
 */
export function createListCommand(): Command {
  const command = new Command('list');

  command
    .description('List all worktrees for this repository')
    .option('--status <status>', 'Filter by status (active, merged, stale)')
    .option('--json', 'Output in JSON format')
    .action(async (options) => {
      try {
        // Initialize worktree manager
        const repoPath = process.cwd();
        const registryPath = path.join(repoPath, '.git', 'worktree-registry.json');
        const manager = new WorktreeManager(registryPath, DEFAULT_CONFIG, repoPath);
        await manager.initialize();

        // List worktrees with optional status filter
        const statusFilter = options.status as WorktreeStatus | undefined;
        const worktrees = await manager.list(statusFilter);

        // JSON output
        if (options.json) {
          console.log(JSON.stringify(worktrees, null, 2));
          return;
        }

        // Empty list
        if (worktrees.length === 0) {
          console.log(chalk.gray('\nNo worktrees found.\n'));
          return;
        }

        // Table output
        console.log(chalk.bold('\nWorktrees:\n'));

        const table = new Table({
          head: [
            chalk.bold('SPEC ID'),
            chalk.bold('Branch'),
            chalk.bold('Status'),
            chalk.bold('Path'),
            chalk.bold('Last Sync'),
          ],
          colWidths: [18, 35, 12, 45, 15],
        });

        worktrees.forEach((wt) => {
          const statusColor = getStatusColor(wt.status);
          const displayPath = wt.path.replace(os.homedir(), '~');
          const lastSync = wt.last_sync ? formatRelativeTime(wt.last_sync) : '-';

          table.push([
            chalk.cyan(wt.id),
            wt.branch,
            statusColor(wt.status),
            displayPath,
            lastSync,
          ]);
        });

        console.log(table.toString());
        console.log(); // Empty line
      } catch (error) {
        console.error(chalk.red(`✗ Failed to list worktrees`));
        if (error instanceof Error) {
          console.error(chalk.red(`  ${error.message}`));
        }
        console.log(); // Empty line
        process.exit(1);
      }
    });

  return command;
}
