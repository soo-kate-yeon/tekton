#!/usr/bin/env node

import { Command } from 'commander';
import { detectCommand } from './commands/detect.js';
import { setupCommand } from './commands/setup.js';
import { generateCommand } from './commands/generate.js';

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
  .option('--preset <preset>', 'Preset name (default, accessible, vibrant)', 'default')
  .option('-f, --force', 'Force generation even with WCAG warnings')
  .action(async (options) => {
    await generateCommand({
      path: options.path,
      primaryColor: options.primaryColor,
      preset: options.preset,
      force: options.force,
    });
  });

program.parse();
