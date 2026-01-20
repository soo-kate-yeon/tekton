/**
 * Config Manager Tests
 *
 * TDD tests for worktree configuration management
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { ConfigManager } from '../../../src/worktree/config/config-manager.js';

describe('ConfigManager', () => {
  let tempDir: string;
  let configPath: string;
  let manager: ConfigManager;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'worktree-config-test-'));
    configPath = path.join(tempDir, '.moai/config/sections/worktree.yaml');
    manager = new ConfigManager(configPath);
  });

  afterEach(async () => {
    await fs.remove(tempDir);
  });

  describe('loadConfig', () => {
    it('should create default config if file does not exist', async () => {
      const config = await manager.loadConfig();

      expect(config).toBeDefined();
      expect(config.worktree).toBeDefined();
      expect(config.worktree.auto_sync).toBe(false);
      expect(config.worktree.cleanup_merged).toBe(true);
      expect(config.worktree.default_base).toBe('master');
      expect(config.worktree.sync_strategy).toBe('merge');
      expect(config.worktree.max_worktrees).toBe(10);
      expect(config.worktree.stale_threshold_days).toBe(30);
    });

    it('should load existing config from YAML file', async () => {
      // Create a config file
      await fs.ensureDir(path.dirname(configPath));
      await fs.writeFile(
        configPath,
        `worktree:
  auto_sync: true
  cleanup_merged: false
  worktree_root: ~/custom/path/
  default_base: main
  sync_strategy: rebase
  max_worktrees: 20
  stale_threshold_days: 60
`
      );

      const config = await manager.loadConfig();

      expect(config.worktree.auto_sync).toBe(true);
      expect(config.worktree.cleanup_merged).toBe(false);
      expect(config.worktree.worktree_root).toBe(path.join(os.homedir(), 'custom/path/'));
      expect(config.worktree.default_base).toBe('main');
      expect(config.worktree.sync_strategy).toBe('rebase');
      expect(config.worktree.max_worktrees).toBe(20);
      expect(config.worktree.stale_threshold_days).toBe(60);
    });

    it('should validate config schema and throw on invalid data', async () => {
      await fs.ensureDir(path.dirname(configPath));
      await fs.writeFile(
        configPath,
        `worktree:
  auto_sync: "not-a-boolean"
  max_worktrees: "not-a-number"
`
      );

      await expect(manager.loadConfig()).rejects.toThrow();
    });

    it('should handle malformed YAML gracefully', async () => {
      await fs.ensureDir(path.dirname(configPath));
      await fs.writeFile(configPath, 'invalid: yaml: content: [[[');

      await expect(manager.loadConfig()).rejects.toThrow();
    });
  });

  describe('saveConfig', () => {
    it('should save config to YAML file', async () => {
      const config = {
        worktree: {
          auto_sync: true,
          cleanup_merged: false,
          worktree_root: '~/test/path/',
          default_base: 'develop',
          sync_strategy: 'rebase' as const,
          max_worktrees: 15,
          stale_threshold_days: 45,
        },
      };

      await manager.saveConfig(config);

      expect(await fs.pathExists(configPath)).toBe(true);

      const saved = await manager.loadConfig();
      // Note: tilde expansion happens on load
      expect(saved.worktree.auto_sync).toBe(config.worktree.auto_sync);
      expect(saved.worktree.cleanup_merged).toBe(config.worktree.cleanup_merged);
      expect(saved.worktree.default_base).toBe(config.worktree.default_base);
      expect(saved.worktree.sync_strategy).toBe(config.worktree.sync_strategy);
      expect(saved.worktree.max_worktrees).toBe(config.worktree.max_worktrees);
      expect(saved.worktree.stale_threshold_days).toBe(config.worktree.stale_threshold_days);
      expect(saved.worktree.worktree_root).toBe(path.join(os.homedir(), 'test/path/'));
    });

    it('should create parent directories if they do not exist', async () => {
      const deepPath = path.join(tempDir, 'a/b/c/worktree.yaml');
      const deepManager = new ConfigManager(deepPath);

      const config = {
        worktree: {
          auto_sync: false,
          cleanup_merged: true,
          worktree_root: '~/worktrees/{PROJECT_NAME}/',
          default_base: 'master',
          sync_strategy: 'merge' as const,
          max_worktrees: 10,
          stale_threshold_days: 30,
        },
      };

      await deepManager.saveConfig(config);

      expect(await fs.pathExists(deepPath)).toBe(true);
    });
  });

  describe('getConfigValue', () => {
    beforeEach(async () => {
      await manager.saveConfig({
        worktree: {
          auto_sync: true,
          cleanup_merged: false,
          worktree_root: '~/test/path/',
          default_base: 'main',
          sync_strategy: 'merge',
          max_worktrees: 10,
          stale_threshold_days: 30,
        },
      });
    });

    it('should get specific config value by key', async () => {
      expect(await manager.getConfigValue('auto_sync')).toBe(true);
      expect(await manager.getConfigValue('cleanup_merged')).toBe(false);
      expect(await manager.getConfigValue('worktree_root')).toBe(path.join(os.homedir(), 'test/path/'));
      expect(await manager.getConfigValue('default_base')).toBe('main');
      expect(await manager.getConfigValue('sync_strategy')).toBe('merge');
      expect(await manager.getConfigValue('max_worktrees')).toBe(10);
      expect(await manager.getConfigValue('stale_threshold_days')).toBe(30);
    });

    it('should throw error for invalid key', async () => {
      await expect(manager.getConfigValue('nonexistent_key')).rejects.toThrow(
        'Unknown configuration key'
      );
    });
  });

  describe('setConfigValue', () => {
    beforeEach(async () => {
      await manager.saveConfig({
        worktree: {
          auto_sync: false,
          cleanup_merged: true,
          worktree_root: '~/worktrees/{PROJECT_NAME}/',
          default_base: 'master',
          sync_strategy: 'merge',
          max_worktrees: 10,
          stale_threshold_days: 30,
        },
      });
    });

    it('should set boolean config value', async () => {
      await manager.setConfigValue('auto_sync', true);
      expect(await manager.getConfigValue('auto_sync')).toBe(true);

      await manager.setConfigValue('cleanup_merged', false);
      expect(await manager.getConfigValue('cleanup_merged')).toBe(false);
    });

    it('should set string config value', async () => {
      await manager.setConfigValue('worktree_root', '~/new/path/');
      expect(await manager.getConfigValue('worktree_root')).toBe(path.join(os.homedir(), 'new/path/'));

      await manager.setConfigValue('default_base', 'develop');
      expect(await manager.getConfigValue('default_base')).toBe('develop');

      await manager.setConfigValue('sync_strategy', 'rebase');
      expect(await manager.getConfigValue('sync_strategy')).toBe('rebase');
    });

    it('should set number config value', async () => {
      await manager.setConfigValue('max_worktrees', 20);
      expect(await manager.getConfigValue('max_worktrees')).toBe(20);

      await manager.setConfigValue('stale_threshold_days', 60);
      expect(await manager.getConfigValue('stale_threshold_days')).toBe(60);
    });

    it('should validate value type matches expected type', async () => {
      // Try to set boolean key with string value
      await expect(manager.setConfigValue('auto_sync', 'true' as any)).rejects.toThrow();

      // Try to set number key with string value
      await expect(manager.setConfigValue('max_worktrees', '10' as any)).rejects.toThrow();

      // Try to set string key with number value
      await expect(manager.setConfigValue('default_base', 123 as any)).rejects.toThrow();
    });

    it('should validate sync_strategy enum values', async () => {
      await manager.setConfigValue('sync_strategy', 'merge');
      expect(await manager.getConfigValue('sync_strategy')).toBe('merge');

      await manager.setConfigValue('sync_strategy', 'rebase');
      expect(await manager.getConfigValue('sync_strategy')).toBe('rebase');

      await expect(manager.setConfigValue('sync_strategy', 'invalid' as any)).rejects.toThrow();
    });

    it('should throw error for invalid key', async () => {
      await expect(manager.setConfigValue('invalid_key', 'value')).rejects.toThrow(
        'Unknown configuration key'
      );
    });

    it('should persist config changes to file', async () => {
      await manager.setConfigValue('auto_sync', true);
      await manager.setConfigValue('default_base', 'develop');

      // Create a new manager instance to reload from file
      const newManager = new ConfigManager(configPath);
      expect(await newManager.getConfigValue('auto_sync')).toBe(true);
      expect(await newManager.getConfigValue('default_base')).toBe('develop');
    });
  });

  describe('path expansion', () => {
    it('should expand tilde (~) in worktree_root', async () => {
      const config = {
        worktree: {
          auto_sync: false,
          cleanup_merged: true,
          worktree_root: '~/worktrees/{PROJECT_NAME}/',
          default_base: 'master',
          sync_strategy: 'merge' as const,
          max_worktrees: 10,
          stale_threshold_days: 30,
        },
      };

      await manager.saveConfig(config);
      const loaded = await manager.loadConfig();

      expect(loaded.worktree.worktree_root).toContain(os.homedir());
      expect(loaded.worktree.worktree_root).not.toContain('~');
    });

    it('should handle absolute paths without expansion', async () => {
      const absolutePath = '/absolute/path/to/worktrees/';
      const config = {
        worktree: {
          auto_sync: false,
          cleanup_merged: true,
          worktree_root: absolutePath,
          default_base: 'master',
          sync_strategy: 'merge' as const,
          max_worktrees: 10,
          stale_threshold_days: 30,
        },
      };

      await manager.saveConfig(config);
      const loaded = await manager.loadConfig();

      expect(loaded.worktree.worktree_root).toBe(absolutePath);
    });
  });
});
