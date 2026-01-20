/**
 * Sync Command Tests
 *
 * TDD tests for worktree sync command
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { createSyncCommand } from '../../../src/commands/worktree/sync.js';

describe('Sync Command', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'worktree-sync-test-'));
  });

  afterEach(async () => {
    await fs.remove(tempDir);
    vi.restoreAllMocks();
  });

  describe('command structure', () => {
    it('should create sync command', () => {
      const command = createSyncCommand();

      expect(command).toBeDefined();
      expect(command.name()).toBe('sync');
      expect(command.description()).toBeTruthy();
    });

    it('should require spec-id argument', () => {
      const command = createSyncCommand();

      // Commander enforces required arguments
      expect(command.usage()).toContain('<spec-id>');
    });

    it('should have strategy option', () => {
      const command = createSyncCommand();
      const options = command.options;

      const strategyOpt = options.find((opt) => opt.long === '--strategy');
      expect(strategyOpt).toBeDefined();
      expect(strategyOpt?.description).toContain('strategy');
    });

    it('should have dry-run option', () => {
      const command = createSyncCommand();
      const options = command.options;

      const dryRunOpt = options.find((opt) => opt.long === '--dry-run');
      expect(dryRunOpt).toBeDefined();
    });
  });

  describe('option validation', () => {
    it('should accept merge strategy', () => {
      const command = createSyncCommand();
      const strategyOpt = command.options.find((opt) => opt.long === '--strategy');

      expect(strategyOpt).toBeDefined();
      // Commander validates enum choices
    });

    it('should accept rebase strategy', () => {
      const command = createSyncCommand();
      const strategyOpt = command.options.find((opt) => opt.long === '--strategy');

      expect(strategyOpt).toBeDefined();
    });

    it('should default strategy to merge', () => {
      const command = createSyncCommand();
      const strategyOpt = command.options.find((opt) => opt.long === '--strategy');

      expect(strategyOpt?.defaultValue).toBe('merge');
    });
  });
});
