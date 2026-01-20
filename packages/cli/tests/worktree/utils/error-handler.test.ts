import { describe, it, expect } from 'vitest';
import {
  WorktreeError,
  GitOperationError,
  RegistryError,
  ValidationError,
  formatErrorMessage,
  isWorktreeError,
} from '../../../src/worktree/utils/error-handler.js';

describe('Error Handler', () => {
  describe('WorktreeError', () => {
    it('should create base error with message', () => {
      const error = new WorktreeError('Test error');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(WorktreeError);
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('WorktreeError');
    });

    it('should preserve stack trace', () => {
      const error = new WorktreeError('Test error');

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('WorktreeError');
    });

    it('should support error cause', () => {
      const cause = new Error('Original error');
      const error = new WorktreeError('Wrapped error', { cause });

      expect(error.cause).toBe(cause);
    });

    it('should have correct error code', () => {
      const error = new WorktreeError('Test error');

      expect(error.code).toBe('WORKTREE_ERROR');
    });
  });

  describe('GitOperationError', () => {
    it('should extend WorktreeError', () => {
      const error = new GitOperationError('Git failed');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(WorktreeError);
      expect(error).toBeInstanceOf(GitOperationError);
      expect(error.name).toBe('GitOperationError');
      expect(error.code).toBe('GIT_OPERATION_ERROR');
    });

    it('should include command in message when provided', () => {
      const error = new GitOperationError('Git failed', {
        command: 'git worktree add',
      });

      expect(error.message).toContain('Git failed');
      expect(error.command).toBe('git worktree add');
    });

    it('should include stderr output', () => {
      const error = new GitOperationError('Git failed', {
        command: 'git worktree add',
        stderr: 'fatal: already exists',
      });

      expect(error.stderr).toBe('fatal: already exists');
    });

    it('should include exit code', () => {
      const error = new GitOperationError('Git failed', {
        command: 'git worktree add',
        exitCode: 128,
      });

      expect(error.exitCode).toBe(128);
    });
  });

  describe('RegistryError', () => {
    it('should extend WorktreeError', () => {
      const error = new RegistryError('Registry operation failed');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(WorktreeError);
      expect(error).toBeInstanceOf(RegistryError);
      expect(error.name).toBe('RegistryError');
      expect(error.code).toBe('REGISTRY_ERROR');
    });

    it('should include registry path', () => {
      const error = new RegistryError('Failed to read registry', {
        registryPath: '/path/to/.worktree-registry.json',
      });

      expect(error.registryPath).toBe('/path/to/.worktree-registry.json');
    });

    it('should include operation type', () => {
      const error = new RegistryError('Operation failed', {
        operation: 'read',
      });

      expect(error.operation).toBe('read');
    });
  });

  describe('ValidationError', () => {
    it('should extend WorktreeError', () => {
      const error = new ValidationError('Validation failed');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(WorktreeError);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.name).toBe('ValidationError');
      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should include validation field', () => {
      const error = new ValidationError('Invalid SPEC ID', {
        field: 'specId',
      });

      expect(error.field).toBe('specId');
    });

    it('should include validation errors', () => {
      const errors = [
        { path: 'branch', message: 'Branch name is required' },
        { path: 'path', message: 'Path is required' },
      ];
      const error = new ValidationError('Validation failed', {
        errors,
      });

      expect(error.errors).toEqual(errors);
      expect(error.errors).toHaveLength(2);
    });
  });

  describe('formatErrorMessage', () => {
    it('should format WorktreeError', () => {
      const error = new WorktreeError('Base error');
      const formatted = formatErrorMessage(error);

      expect(formatted).toContain('WorktreeError');
      expect(formatted).toContain('Base error');
    });

    it('should format GitOperationError with command', () => {
      const error = new GitOperationError('Git command failed', {
        command: 'git worktree add',
        exitCode: 128,
        stderr: 'fatal: worktree already exists',
      });
      const formatted = formatErrorMessage(error);

      expect(formatted).toContain('GitOperationError');
      expect(formatted).toContain('Git command failed');
      expect(formatted).toContain('git worktree add');
      expect(formatted).toContain('128');
      expect(formatted).toContain('fatal: worktree already exists');
    });

    it('should format RegistryError with path', () => {
      const error = new RegistryError('Failed to read registry', {
        registryPath: '/path/to/.worktree-registry.json',
        operation: 'read',
      });
      const formatted = formatErrorMessage(error);

      expect(formatted).toContain('RegistryError');
      expect(formatted).toContain('Failed to read registry');
      expect(formatted).toContain('/path/to/.worktree-registry.json');
      expect(formatted).toContain('read');
    });

    it('should format ValidationError with errors', () => {
      const error = new ValidationError('Validation failed', {
        field: 'specId',
        errors: [
          { path: 'specId', message: 'Must start with SPEC-' },
          { path: 'specId', message: 'Must be uppercase' },
        ],
      });
      const formatted = formatErrorMessage(error);

      expect(formatted).toContain('ValidationError');
      expect(formatted).toContain('Validation failed');
      expect(formatted).toContain('specId');
      expect(formatted).toContain('Must start with SPEC-');
      expect(formatted).toContain('Must be uppercase');
    });

    it('should format generic Error', () => {
      const error = new Error('Generic error');
      const formatted = formatErrorMessage(error);

      expect(formatted).toContain('Error');
      expect(formatted).toContain('Generic error');
    });

    it('should handle error with cause', () => {
      const cause = new Error('Original error');
      const error = new WorktreeError('Wrapped error', { cause });
      const formatted = formatErrorMessage(error);

      expect(formatted).toContain('Wrapped error');
      expect(formatted).toContain('Caused by:');
      expect(formatted).toContain('Original error');
    });
  });

  describe('isWorktreeError', () => {
    it('should return true for WorktreeError', () => {
      const error = new WorktreeError('Test');
      expect(isWorktreeError(error)).toBe(true);
    });

    it('should return true for GitOperationError', () => {
      const error = new GitOperationError('Test');
      expect(isWorktreeError(error)).toBe(true);
    });

    it('should return true for RegistryError', () => {
      const error = new RegistryError('Test');
      expect(isWorktreeError(error)).toBe(true);
    });

    it('should return true for ValidationError', () => {
      const error = new ValidationError('Test');
      expect(isWorktreeError(error)).toBe(true);
    });

    it('should return false for generic Error', () => {
      const error = new Error('Generic');
      expect(isWorktreeError(error)).toBe(false);
    });

    it('should return false for non-error values', () => {
      expect(isWorktreeError(null)).toBe(false);
      expect(isWorktreeError(undefined)).toBe(false);
      expect(isWorktreeError('error')).toBe(false);
      expect(isWorktreeError({})).toBe(false);
    });
  });
});
