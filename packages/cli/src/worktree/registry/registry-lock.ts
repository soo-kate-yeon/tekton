import fs from 'fs-extra';
import * as path from 'path';

/**
 * Lock file data structure
 */
interface LockData {
  pid: number;
  timestamp: number;
}

/**
 * Lock acquisition options
 */
export interface LockOptions {
  /**
   * Maximum time to wait for lock acquisition in milliseconds
   * @default 30000 (30 seconds)
   */
  timeout?: number;

  /**
   * Time after which a lock is considered stale in milliseconds
   * @default 60000 (60 seconds)
   */
  staleTimeout?: number;

  /**
   * Polling interval when waiting for lock in milliseconds
   * @default 100 (100ms)
   */
  pollInterval?: number;
}

const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_STALE_TIMEOUT = 60000; // 60 seconds
const DEFAULT_POLL_INTERVAL = 100; // 100ms

/**
 * Get the lock file path for a registry
 */
function getLockPath(registryPath: string): string {
  return `${registryPath}.lock`;
}

/**
 * Check if a lock file is stale
 */
async function isLockStale(lockPath: string, staleTimeout: number): Promise<boolean> {
  try {
    const lockData: LockData = await fs.readJSON(lockPath);
    const age = Date.now() - lockData.timestamp;
    return age > staleTimeout;
  } catch (error) {
    // Corrupted or missing lock file is considered stale
    return true;
  }
}

/**
 * Check if a registry is currently locked
 *
 * @param registryPath - Path to the registry file
 * @param options - Lock checking options
 * @returns true if locked, false otherwise
 */
export async function isLocked(
  registryPath: string,
  options: Pick<LockOptions, 'staleTimeout'> = {}
): Promise<boolean> {
  const lockPath = getLockPath(registryPath);
  const staleTimeout = options.staleTimeout ?? DEFAULT_STALE_TIMEOUT;

  const exists = await fs.pathExists(lockPath);
  if (!exists) {
    return false;
  }

  // Check if lock is stale
  const stale = await isLockStale(lockPath, staleTimeout);
  return !stale;
}

/**
 * Acquire a lock on the registry file
 *
 * This function uses a file-based locking mechanism to prevent concurrent
 * modifications to the registry. It will retry acquisition until the timeout
 * is reached.
 *
 * @param registryPath - Path to the registry file
 * @param options - Lock acquisition options
 * @returns true if lock was acquired, false if timeout was reached
 *
 * @example
 * ```typescript
 * const acquired = await acquireLock('/path/to/registry.json');
 * if (acquired) {
 *   try {
 *     // Perform operations on registry
 *   } finally {
 *     await releaseLock('/path/to/registry.json');
 *   }
 * }
 * ```
 */
export async function acquireLock(
  registryPath: string,
  options: LockOptions = {}
): Promise<boolean> {
  const lockPath = getLockPath(registryPath);
  const timeout = options.timeout ?? DEFAULT_TIMEOUT;
  const staleTimeout = options.staleTimeout ?? DEFAULT_STALE_TIMEOUT;
  const pollInterval = options.pollInterval ?? DEFAULT_POLL_INTERVAL;

  const startTime = Date.now();

  // Ensure lock directory exists
  await fs.ensureDir(path.dirname(lockPath));

  while (true) {
    try {
      // Check if existing lock is stale
      const exists = await fs.pathExists(lockPath);
      if (exists) {
        const stale = await isLockStale(lockPath, staleTimeout);
        if (stale) {
          // Remove stale lock
          await fs.remove(lockPath);
        }
      }

      // Try to create lock file exclusively
      const lockData: LockData = {
        pid: process.pid,
        timestamp: Date.now(),
      };

      await fs.writeJSON(lockPath, lockData, { flag: 'wx' });
      return true; // Lock acquired
    } catch (error: unknown) {
      // Lock file already exists or write failed
      const elapsed = Date.now() - startTime;
      if (elapsed >= timeout) {
        return false; // Timeout reached
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
  }
}

/**
 * Release a lock on the registry file
 *
 * @param registryPath - Path to the registry file
 * @returns true if lock was released, false if no lock existed
 *
 * @example
 * ```typescript
 * await releaseLock('/path/to/registry.json');
 * ```
 */
export async function releaseLock(registryPath: string): Promise<boolean> {
  const lockPath = getLockPath(registryPath);

  // Check if lock file exists before removing
  const exists = await fs.pathExists(lockPath);
  if (!exists) {
    return false;
  }

  try {
    await fs.remove(lockPath);
    return true;
  } catch (error: unknown) {
    // Couldn't be removed
    return false;
  }
}
