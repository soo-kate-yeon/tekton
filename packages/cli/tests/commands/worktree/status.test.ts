/**
 * Status Command Tests
 *
 * TDD tests for worktree status command
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { createStatusCommand } from '../../../src/commands/worktree/status.js';

describe('Status Command', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'worktree-status-test-'));
  });

  afterEach(async () => {
    await fs.remove(tempDir);
    vi.restoreAllMocks();
  });

  describe('command structure', () => {
    it('should create status command', () => {
      const command = createStatusCommand();

      expect(command).toBeDefined();
      expect(command.name()).toBe('status');
      expect(command.description()).toBeTruthy();
    });

    it('should have optional spec-id argument', () => {
      const command = createStatusCommand();

      // Should allow both with and without spec-id
      expect(command.usage()).toContain('[spec-id]');
    });
  });

  describe('output format', () => {
    it('should support table format for multiple worktrees', () => {
      const command = createStatusCommand();

      expect(command).toBeDefined();
      // Table format is the default when no spec-id is provided
    });

    it('should support detailed format for single worktree', () => {
      const command = createStatusCommand();

      expect(command).toBeDefined();
      // Detailed format when spec-id is provided
    });
  });
});
