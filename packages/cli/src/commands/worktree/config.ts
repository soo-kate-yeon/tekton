/**
 * Worktree Config Command
 *
 * Manage worktree configuration
 */

import { Command } from 'commander';
import chalk from 'chalk';
import Table from 'cli-table3';
import { ConfigManager } from '../../worktree/config/config-manager.js';

/**
 * Get Config Manager
 *
 * Creates a ConfigManager instance with the appropriate path
 */
function getConfigManager(): ConfigManager {
  const configPath =
    process.env.MOAI_CONFIG_PATH || '.moai/config/sections/worktree.yaml';
  return new ConfigManager(configPath);
}

/**
 * Create Config Command
 *
 * Creates the worktree config command with subcommands
 */
export function createConfigCommand(): Command {
  const command = new Command('config');
  command.description('Manage worktree configuration');

  // List subcommand
  command
    .command('list')
    .description('Show all configuration values')
    .action(async () => {
      try {
        const manager = getConfigManager();
        const config = await manager.loadConfig();

        const table = new (Table as any)({
          head: [chalk.cyan('Key'), chalk.cyan('Value')],
          colWidths: [30, 50],
        });

        // Add rows
        table.push(
          ['auto_sync', config.worktree.auto_sync.toString()],
          ['cleanup_merged', config.worktree.cleanup_merged.toString()],
          ['worktree_root', config.worktree.worktree_root],
          ['default_base', config.worktree.default_base],
          ['sync_strategy', config.worktree.sync_strategy],
          ['max_worktrees', config.worktree.max_worktrees.toString()],
          ['stale_threshold_days', config.worktree.stale_threshold_days.toString()]
        );

        console.log(table.toString());
      } catch (error) {
        console.error(
          chalk.red(`✗ Failed to list configuration: ${error instanceof Error ? error.message : String(error)}`)
        );
        process.exit(1);
      }
    });

  // Get subcommand
  command
    .command('get <key>')
    .description('Get a specific configuration value')
    .action(async (key: string) => {
      try {
        const manager = getConfigManager();
        const value = await manager.getConfigValue(key);

        console.log(chalk.green(`${key}: ${value}`));
      } catch (error) {
        console.error(
          chalk.red(`✗ Failed to get configuration: ${error instanceof Error ? error.message : String(error)}`)
        );
        process.exit(1);
      }
    });

  // Set subcommand
  command
    .command('set <key> <value>')
    .description('Set a configuration value')
    .action(async (key: string, value: string) => {
      try {
        const manager = getConfigManager();

        // Parse value based on type
        let parsedValue: string | number | boolean = value;

        // Try to parse as boolean
        if (value === 'true') {
          parsedValue = true;
        } else if (value === 'false') {
          parsedValue = false;
        }
        // Try to parse as number
        else if (!isNaN(Number(value))) {
          parsedValue = Number(value);
        }

        await manager.setConfigValue(key, parsedValue);

        console.log(chalk.green(`✓ Configuration updated: ${key} = ${parsedValue}`));
      } catch (error) {
        console.error(
          chalk.red(`✗ Failed to set configuration: ${error instanceof Error ? error.message : String(error)}`)
        );
        process.exit(1);
      }
    });

  return command;
}
