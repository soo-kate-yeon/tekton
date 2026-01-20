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
 * Create the 'new' command
 *
 * Creates a new Git worktree for SPEC development
 */
export function createNewCommand(): Command {
  const command = new Command('new');

  command
    .description('Create a new worktree for SPEC development')
    .argument('<spec-id>', 'SPEC identifier (e.g., SPEC-ABC-001)')
    .argument('[description]', 'Worktree description', '')
    .option('--base <branch>', 'Base branch to create from', 'master')
    .option('--no-switch', 'Do not switch to new worktree')
    .action(async (specId: string, description: string, options) => {
      try {
        // Validate SPEC ID
        if (!validateSpecId(specId)) {
          console.error(chalk.red(`✗ Invalid SPEC ID: ${specId}`));
          console.error(chalk.gray('  Expected format: SPEC-XXX-001'));
          process.exit(1);
        }

        console.log(chalk.bold(`\nCreating worktree for ${chalk.cyan(specId)}...\n`));

        // Initialize worktree manager
        const repoPath = process.cwd();
        const registryPath = path.join(repoPath, '.git', 'worktree-registry.json');
        const manager = new WorktreeManager(registryPath, DEFAULT_CONFIG, repoPath);
        await manager.initialize();

        // Create worktree
        const worktree = await manager.create(specId, description, {
          base: options.base,
        });

        // Success message
        console.log(chalk.green(`✓ Worktree created successfully`));
        console.log(chalk.gray(`  Path: ${worktree.path}`));
        console.log(chalk.gray(`  Branch: ${worktree.branch}`));
        console.log(chalk.gray(`  Base: ${worktree.base_branch}`));

        // Switch instructions
        if (options.switch !== false) {
          console.log(chalk.blue(`\nTo switch to worktree, run:`));
          console.log(chalk.cyan(`  cd ${worktree.path}`));
        }

        console.log(); // Empty line
      } catch (error) {
        console.error(chalk.red(`✗ Failed to create worktree`));
        if (error instanceof Error) {
          console.error(chalk.red(`  ${error.message}`));
        }
        console.log(); // Empty line
        process.exit(1);
      }
    });

  return command;
}
