/**
 * Clean Command Tests
 *
 * TDD tests for worktree clean command
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { createCleanCommand } from '../../../src/commands/worktree/clean.js';

describe('Clean Command', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'worktree-clean-test-'));
  });

  afterEach(async () => {
    await fs.remove(tempDir);
    vi.restoreAllMocks();
  });

  describe('command structure', () => {
    it('should create clean command', () => {
      const command = createCleanCommand();

      expect(command).toBeDefined();
      expect(command.name()).toBe('clean');
      expect(command.description()).toBeTruthy();
    });

    it('should have merged-only option', () => {
      const command = createCleanCommand();
      const options = command.options;

      const mergedOnlyOpt = options.find((opt) => opt.long === '--merged-only');
      expect(mergedOnlyOpt).toBeDefined();
    });

    it('should have all option', () => {
      const command = createCleanCommand();
      const options = command.options;

      const allOpt = options.find((opt) => opt.long === '--all');
      expect(allOpt).toBeDefined();
    });

    it('should have stale-days option', () => {
      const command = createCleanCommand();
      const options = command.options;

      const staleDaysOpt = options.find((opt) => opt.long === '--stale-days');
      expect(staleDaysOpt).toBeDefined();
    });

    it('should have dry-run option', () => {
      const command = createCleanCommand();
      const options = command.options;

      const dryRunOpt = options.find((opt) => opt.long === '--dry-run');
      expect(dryRunOpt).toBeDefined();
    });
  });

  describe('option defaults', () => {
    it('should default merged-only to true', () => {
      const command = createCleanCommand();
      const mergedOnlyOpt = command.options.find((opt) => opt.long === '--merged-only');

      expect(mergedOnlyOpt?.defaultValue).toBe(true);
    });
  });
});
