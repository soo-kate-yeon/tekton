#!/usr/bin/env node

import { Command } from 'commander';
import { detectCommand } from './commands/detect.js';
import { setupCommand } from './commands/setup.js';
import { generateCommand } from './commands/generate.js';
import { createScreenCommand } from './commands/create-screen.js';
import { createWorktreeCommand } from './commands/worktree/index.js';

const program = new Command();

program
  .name('tekton')
  .description('OKLCH-based design token generator with WCAG AA compliance')
  .version('0.1.0');

// Detect command
program
  .command('detect')
  .description('Detect project stack (framework, Tailwind, shadcn)')
  .option('-p, --path <path>', 'Project directory path', process.cwd())
  .action(async (options) => {
    await detectCommand(options);
  });

// Setup command
program
  .command('setup <target>')
  .description('Setup a tool in the project (e.g., shadcn)')
  .option('-p, --path <path>', 'Project directory path', process.cwd())
  .action(async (target, options) => {
    await setupCommand(target, options);
  });

// Generate command
program
  .command('generate')
  .description('Generate design tokens')
  .option('-p, --path <path>', 'Project directory path', process.cwd())
  .option('-c, --primary-color <color>', 'Primary color (hex code)')
  .option('--theme <theme>', 'Theme name (default, accessible, vibrant)', 'default')
  .option('-f, --force', 'Force generation even with WCAG warnings')
  .action(async (options) => {
    await generateCommand({
      path: options.path,
      primaryColor: options.primaryColor,
      theme: options.theme,
      force: options.force,
    });
  });

// Create screen command
program
  .command('create-screen <name>')
  .description('Create a new screen with contract-based generation')
  .option('-e, --environment <env>', 'Target environment (web, mobile, tablet, responsive, tv, kiosk)')
  .option('-s, --skeleton <skeleton>', 'Skeleton preset (full-screen, with-header, with-sidebar, etc.)')
  .option('-i, --intent <intent>', 'Screen intent (data-list, data-detail, dashboard, form, etc.)')
  .option('-c, --components <components...>', 'Components to include')
  .option('-p, --path <path>', 'Output directory path', process.cwd())
  .option('--theme <theme>', 'Theme name to fetch design tokens from API')
  .option('--skip-mcp', 'Skip MCP server integration (offline mode)')
  .option('--skip-api', 'Skip Theme API integration (offline mode)')
  .action(async (name, options) => {
    await createScreenCommand(name, {
      environment: options.environment,
      skeleton: options.skeleton,
      intent: options.intent,
      components: options.components,
      path: options.path,
      theme: options.theme,
      skipMcp: options.skipMcp,
      skipApi: options.skipApi,
    });
  });

// Worktree command group
program.addCommand(createWorktreeCommand());

program.parse();
