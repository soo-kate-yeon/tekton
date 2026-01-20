import { Command } from 'commander';
import chalk from 'chalk';
import enquirer from 'enquirer';
import { WorktreeManager } from '../../worktree/manager/worktree-manager.js';
import { validateSpecId } from '../../worktree/utils/spec-validator.js';
import * as path from 'path';
import * as os from 'os';
import type { WorktreeConfig } from '../../worktree/models/worktree.types.js';

const { prompt } = enquirer;

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
 * Create the 'remove' command
 *
 * Removes an existing worktree with optional confirmation
 */
export function createRemoveCommand(): Command {
  const command = new Command('remove');

  command
    .description('Remove a worktree')
    .argument('<spec-id>', 'SPEC identifier (e.g., SPEC-ABC-001)')
    .option('--force', 'Force removal even with uncommitted changes')
    .action(async (specId: string, options) => {
      try {
        // Validate SPEC ID format
        if (!validateSpecId(specId)) {
          console.error(chalk.red(`✗ Invalid SPEC ID format: ${specId}`));
          console.error(chalk.gray('  Expected format: SPEC-XXX-001'));
          process.exit(1);
        }

        // Initialize worktree manager
        const repoPath = process.cwd();
        const registryPath = path.join(repoPath, '.git', 'worktree-registry.json');
        const manager = new WorktreeManager(registryPath, DEFAULT_CONFIG, repoPath);
        await manager.initialize();

        // Verify worktree exists
        const worktree = await manager.get(specId);
        if (!worktree) {
          console.error(chalk.red(`✗ Worktree not found: ${specId}`));
          console.error(chalk.gray('  Run "tekton worktree list" to see available worktrees'));
          process.exit(1);
        }

        // Confirmation prompt unless --force
        if (!options.force) {
          console.log(chalk.yellow(`\n⚠ You are about to remove worktree:`));
          console.log(chalk.gray(`  SPEC ID: ${chalk.cyan(specId)}`));
          console.log(chalk.gray(`  Path: ${worktree.path}`));
          console.log(chalk.gray(`  Branch: ${worktree.branch}\n`));

          const answer = await prompt<{ confirm: boolean }>({
            type: 'confirm',
            name: 'confirm',
            message: 'Are you sure you want to remove this worktree?',
            initial: false,
          });

          if (!answer.confirm) {
            console.log(chalk.gray('\nRemoval cancelled.\n'));
            return;
          }
        }

        // Remove worktree
        console.log(chalk.bold(`\nRemoving worktree ${chalk.cyan(specId)}...\n`));
        await manager.remove(specId, options.force);

        // Success message
        console.log(chalk.green(`✓ Worktree removed successfully`));
        console.log(); // Empty line
      } catch (error) {
        console.error(chalk.red(`✗ Failed to remove worktree`));
        if (error instanceof Error) {
          console.error(chalk.red(`  ${error.message}`));
        }
        console.log(); // Empty line
        process.exit(1);
      }
    });

  return command;
}
