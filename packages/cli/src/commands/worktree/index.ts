/**
 * Worktree Commands
 *
 * Git worktree management commands for parallel SPEC development
 */

import { Command } from 'commander';
import { createNewCommand } from './new.js';
import { createListCommand } from './list.js';
import { createSwitchCommand } from './switch.js';
import { createRemoveCommand } from './remove.js';
import { createSyncCommand } from './sync.js';
import { createStatusCommand } from './status.js';
import { createConfigCommand } from './config.js';
import { createCleanCommand } from './clean.js';

/**
 * Create the worktree command group
 *
 * Registers all worktree subcommands
 */
export function createWorktreeCommand(): Command {
  const command = new Command('worktree');

  command
    .description('Manage Git worktrees for parallel SPEC development')
    .addCommand(createNewCommand())
    .addCommand(createListCommand())
    .addCommand(createSwitchCommand())
    .addCommand(createRemoveCommand())
    .addCommand(createSyncCommand())
    .addCommand(createStatusCommand())
    .addCommand(createConfigCommand())
    .addCommand(createCleanCommand());

  return command;
}

// Export individual commands for testing
export { createNewCommand } from './new.js';
export { createListCommand } from './list.js';
export { createSwitchCommand } from './switch.js';
export { createRemoveCommand } from './remove.js';
export { createSyncCommand } from './sync.js';
export { createStatusCommand } from './status.js';
export { createConfigCommand } from './config.js';
export { createCleanCommand } from './clean.js';
