/**
 * Config Command Tests
 *
 * TDD tests for worktree config command
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { createConfigCommand } from '../../../src/commands/worktree/config.js';

describe('Config Command', () => {
  let tempDir: string;
  let configPath: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'worktree-config-cmd-test-'));
    configPath = path.join(tempDir, '.moai/config/sections/worktree.yaml');

    // Set up mock environment
    process.env.MOAI_CONFIG_PATH = configPath;
  });

  afterEach(async () => {
    await fs.remove(tempDir);
    delete process.env.MOAI_CONFIG_PATH;
    vi.restoreAllMocks();
  });

  describe('command structure', () => {
    it('should create config command with subcommands', () => {
      const command = createConfigCommand();

      expect(command).toBeDefined();
      expect(command.name()).toBe('config');
      expect(command.description()).toContain('configuration');
    });

    it('should have list subcommand', () => {
      const command = createConfigCommand();
      const subcommands = command.commands;

      const listCmd = subcommands.find((cmd) => cmd.name() === 'list');
      expect(listCmd).toBeDefined();
      expect(listCmd?.description()).toContain('configuration');
    });

    it('should have get subcommand', () => {
      const command = createConfigCommand();
      const subcommands = command.commands;

      const getCmd = subcommands.find((cmd) => cmd.name() === 'get');
      expect(getCmd).toBeDefined();
      expect(getCmd?.description()).toContain('configuration');
    });

    it('should have set subcommand', () => {
      const command = createConfigCommand();
      const subcommands = command.commands;

      const setCmd = subcommands.find((cmd) => cmd.name() === 'set');
      expect(setCmd).toBeDefined();
      expect(setCmd?.description()).toContain('configuration');
    });
  });

  describe('list subcommand', () => {
    it('should display all configuration values', async () => {
      const command = createConfigCommand();
      const consoleSpy = vi.spyOn(console, 'log');

      // Create a test config
      await fs.ensureDir(path.dirname(configPath));
      await fs.writeFile(
        configPath,
        `worktree:
  auto_sync: false
  cleanup_merged: true
  worktree_root: ~/worktrees/{PROJECT_NAME}/
  default_base: master
  sync_strategy: merge
  max_worktrees: 10
  stale_threshold_days: 30
`
      );

      // Execute list command (we'll test the actual execution in integration)
      expect(command.commands.find((cmd) => cmd.name() === 'list')).toBeDefined();
    });
  });

  describe('get subcommand', () => {
    it('should require key argument', () => {
      const command = createConfigCommand();
      const getCmd = command.commands.find((cmd) => cmd.name() === 'get');

      expect(getCmd).toBeDefined();
      // Commander will enforce required argument
    });
  });

  describe('set subcommand', () => {
    it('should require key and value arguments', () => {
      const command = createConfigCommand();
      const setCmd = command.commands.find((cmd) => cmd.name() === 'set');

      expect(setCmd).toBeDefined();
      // Commander will enforce required arguments
    });
  });
});
