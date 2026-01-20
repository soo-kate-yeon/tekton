import { Command } from 'commander';
import chalk from 'chalk';
import { WorktreeManager } from '../../worktree/manager/worktree-manager.js';
import { validateSpecId } from '../../worktree/utils/spec-validator.js';
import * as path from 'path';
import * as os from 'os';
import type { WorktreeConfig } from '../../worktree/models/worktree.types.js';

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
 * Create the 'switch' command
 *
 * Switches to an existing worktree by outputting the cd command
 */
export function createSwitchCommand(): Command {
  const command = new Command('switch');

  command
    .description('Switch to a worktree directory')
    .alias('go')
    .argument('<spec-id>', 'SPEC identifier (e.g., SPEC-ABC-001)')
    .action(async (specId: string) => {
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

        // Get worktree
        const worktree = await manager.get(specId);
        if (!worktree) {
          console.error(chalk.red(`✗ Worktree not found: ${specId}`));
          console.error(chalk.gray('  Run "tekton worktree list" to see available worktrees'));
          process.exit(1);
        }

        // Output cd command
        console.log(chalk.blue(`\nTo switch to worktree ${chalk.cyan(specId)}, run:`));
        console.log(chalk.cyan(`  cd ${worktree.path}`));
        console.log(); // Empty line
      } catch (error) {
        console.error(chalk.red(`✗ Failed to switch to worktree`));
        if (error instanceof Error) {
          console.error(chalk.red(`  ${error.message}`));
        }
        console.log(); // Empty line
        process.exit(1);
      }
    });

  return command;
}
