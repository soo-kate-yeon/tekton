/**
 * Error Handler
 *
 * Custom error classes and error formatting utilities for worktree operations
 */

/**
 * Base Worktree Error
 *
 * Base class for all worktree-related errors
 */
export class WorktreeError extends Error {
  public readonly code: string = 'WORKTREE_ERROR';

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'WorktreeError';

    // Maintain proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Git Operation Error
 *
 * Thrown when a Git command fails during worktree operations
 */
export class GitOperationError extends WorktreeError {
  public readonly code: string = 'GIT_OPERATION_ERROR';
  public readonly command?: string;
  public readonly exitCode?: number;
  public readonly stderr?: string;

  constructor(
    message: string,
    options?: ErrorOptions & {
      command?: string;
      exitCode?: number;
      stderr?: string;
    }
  ) {
    super(message, options);
    this.name = 'GitOperationError';
    this.command = options?.command;
    this.exitCode = options?.exitCode;
    this.stderr = options?.stderr;
  }
}

/**
 * Registry Error
 *
 * Thrown when registry operations fail (read, write, lock)
 */
export class RegistryError extends WorktreeError {
  public readonly code: string = 'REGISTRY_ERROR';
  public readonly registryPath?: string;
  public readonly operation?: string;

  constructor(
    message: string,
    options?: ErrorOptions & {
      registryPath?: string;
      operation?: string;
    }
  ) {
    super(message, options);
    this.name = 'RegistryError';
    this.registryPath = options?.registryPath;
    this.operation = options?.operation;
  }
}

/**
 * Validation Error
 *
 * Thrown when input validation fails
 */
export class ValidationError extends WorktreeError {
  public readonly code: string = 'VALIDATION_ERROR';
  public readonly field?: string;
  public readonly errors?: Array<{ path: string; message: string }>;

  constructor(
    message: string,
    options?: ErrorOptions & {
      field?: string;
      errors?: Array<{ path: string; message: string }>;
    }
  ) {
    super(message, options);
    this.name = 'ValidationError';
    this.field = options?.field;
    this.errors = options?.errors;
  }
}

/**
 * Format Error Message
 *
 * Formats an error into a user-friendly message with context
 *
 * @param error - Error to format
 * @returns Formatted error message
 */
export function formatErrorMessage(error: Error): string {
  const lines: string[] = [];

  // Error header
  lines.push(`[${error.name}] ${error.message}`);

  // Add specific error details
  if (error instanceof GitOperationError) {
    if (error.command) {
      lines.push(`  Command: ${error.command}`);
    }
    if (error.exitCode !== undefined) {
      lines.push(`  Exit Code: ${error.exitCode}`);
    }
    if (error.stderr) {
      lines.push(`  Error Output: ${error.stderr}`);
    }
  } else if (error instanceof RegistryError) {
    if (error.registryPath) {
      lines.push(`  Registry Path: ${error.registryPath}`);
    }
    if (error.operation) {
      lines.push(`  Operation: ${error.operation}`);
    }
  } else if (error instanceof ValidationError) {
    if (error.field) {
      lines.push(`  Field: ${error.field}`);
    }
    if (error.errors && error.errors.length > 0) {
      lines.push(`  Validation Errors:`);
      for (const validationError of error.errors) {
        lines.push(`    - ${validationError.path}: ${validationError.message}`);
      }
    }
  }

  // Add cause if present
  if (error.cause && error.cause instanceof Error) {
    lines.push(`  Caused by: ${error.cause.message}`);
  }

  return lines.join('\n');
}

/**
 * Type Guard: Is Worktree Error
 *
 * Checks if a value is a WorktreeError or subclass
 *
 * @param value - Value to check
 * @returns True if value is a WorktreeError
 */
export function isWorktreeError(value: unknown): value is WorktreeError {
  return value instanceof WorktreeError;
}

/**
 * Wrap Error
 *
 * Wraps a generic error in a WorktreeError for consistent handling
 *
 * @param error - Error to wrap
 * @param message - Optional custom message
 * @returns WorktreeError wrapping the original error
 */
export function wrapError(error: unknown, message?: string): WorktreeError {
  if (isWorktreeError(error)) {
    return error;
  }

  const errorMessage = message || (error instanceof Error ? error.message : String(error));
  return new WorktreeError(errorMessage, {
    cause: error instanceof Error ? error : undefined,
  });
}
