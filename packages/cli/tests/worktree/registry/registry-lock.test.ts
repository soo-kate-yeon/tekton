import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs-extra';
import * as path from 'path';
import { acquireLock, releaseLock, isLocked } from '../../../src/worktree/registry/registry-lock.js';

describe('Registry Lock', () => {
  const testDir = path.join(process.cwd(), 'test-fixtures', 'registry-lock');
  const registryPath = path.join(testDir, 'registry.json');
  const lockPath = `${registryPath}.lock`;

  beforeEach(async () => {
    await fs.ensureDir(testDir);
    await fs.writeJSON(registryPath, { test: true });
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  describe('acquireLock', () => {
    it('should successfully acquire lock when no lock exists', async () => {
      const result = await acquireLock(registryPath);
      expect(result).toBe(true);

      // Verify lock file exists
      const lockExists = await fs.pathExists(lockPath);
      expect(lockExists).toBe(true);

      // Clean up
      await releaseLock(registryPath);
    });

    it('should fail to acquire lock when lock already exists', async () => {
      // Acquire first lock
      await acquireLock(registryPath);

      // Try to acquire second lock
      const result = await acquireLock(registryPath, { timeout: 100 });
      expect(result).toBe(false);

      // Clean up
      await releaseLock(registryPath);
    });

    it('should acquire lock after previous lock is released', async () => {
      // Acquire and release lock
      await acquireLock(registryPath);
      await releaseLock(registryPath);

      // Should be able to acquire again
      const result = await acquireLock(registryPath);
      expect(result).toBe(true);

      // Clean up
      await releaseLock(registryPath);
    });

    it('should timeout after specified duration', async () => {
      // Acquire first lock
      await acquireLock(registryPath);

      const startTime = Date.now();
      const result = await acquireLock(registryPath, { timeout: 500 });
      const endTime = Date.now();

      expect(result).toBe(false);
      expect(endTime - startTime).toBeGreaterThanOrEqual(500);
      expect(endTime - startTime).toBeLessThan(700); // Allow some margin

      // Clean up
      await releaseLock(registryPath);
    });

    it('should use default timeout of 30 seconds', async () => {
      // Acquire first lock
      await acquireLock(registryPath);

      // Start second acquire (will timeout)
      const startTime = Date.now();
      const promise = acquireLock(registryPath); // Default 30s timeout

      // Wait a bit then release first lock
      setTimeout(async () => {
        await releaseLock(registryPath);
      }, 200);

      const result = await promise;
      const endTime = Date.now();

      // Should succeed within a short time due to release
      expect(result).toBe(true);
      expect(endTime - startTime).toBeLessThan(1000);

      // Clean up
      await releaseLock(registryPath);
    });

    it('should handle stale locks (older than timeout)', async () => {
      // Create a stale lock file with old timestamp
      const staleLockData = {
        pid: 99999,
        timestamp: Date.now() - 60000, // 60 seconds ago
      };
      await fs.writeJSON(lockPath, staleLockData);

      // Should be able to acquire despite existing lock file
      const result = await acquireLock(registryPath, { timeout: 1000, staleTimeout: 30000 });
      expect(result).toBe(true);

      // Clean up
      await releaseLock(registryPath);
    });
  });

  describe('releaseLock', () => {
    it('should successfully release acquired lock', async () => {
      await acquireLock(registryPath);

      const result = await releaseLock(registryPath);
      expect(result).toBe(true);

      // Verify lock file is removed
      const lockExists = await fs.pathExists(lockPath);
      expect(lockExists).toBe(false);
    });

    it('should return false when releasing non-existent lock', async () => {
      const result = await releaseLock(registryPath);
      expect(result).toBe(false);
    });

    it('should be idempotent (safe to call multiple times)', async () => {
      await acquireLock(registryPath);

      const result1 = await releaseLock(registryPath);
      expect(result1).toBe(true);

      const result2 = await releaseLock(registryPath);
      expect(result2).toBe(false); // Already released
    });
  });

  describe('isLocked', () => {
    it('should return false when no lock exists', async () => {
      const result = await isLocked(registryPath);
      expect(result).toBe(false);
    });

    it('should return true when lock exists', async () => {
      await acquireLock(registryPath);

      const result = await isLocked(registryPath);
      expect(result).toBe(true);

      // Clean up
      await releaseLock(registryPath);
    });

    it('should return false after lock is released', async () => {
      await acquireLock(registryPath);
      await releaseLock(registryPath);

      const result = await isLocked(registryPath);
      expect(result).toBe(false);
    });

    it('should return false for stale locks', async () => {
      // Create a stale lock file
      const staleLockData = {
        pid: 99999,
        timestamp: Date.now() - 60000, // 60 seconds ago
      };
      await fs.writeJSON(lockPath, staleLockData);

      const result = await isLocked(registryPath, { staleTimeout: 30000 });
      expect(result).toBe(false);
    });
  });

  describe('Concurrent access simulation', () => {
    it('should handle multiple concurrent acquire attempts', async () => {
      const attempts = 5;
      const promises = Array.from({ length: attempts }, () =>
        acquireLock(registryPath, { timeout: 1000 })
      );

      const results = await Promise.all(promises);

      // Only one should succeed
      const successCount = results.filter(r => r === true).length;
      expect(successCount).toBe(1);

      // Clean up
      await releaseLock(registryPath);
    });

    it('should handle acquire-release cycles correctly', async () => {
      const cycles = 10;

      for (let i = 0; i < cycles; i++) {
        const acquired = await acquireLock(registryPath);
        expect(acquired).toBe(true);

        const released = await releaseLock(registryPath);
        expect(released).toBe(true);
      }
    });
  });

  describe('Error handling', () => {
    it('should handle missing registry directory gracefully', async () => {
      const nonExistentPath = path.join(testDir, 'nonexistent', 'registry.json');

      // acquireLock should create parent directory
      const result = await acquireLock(nonExistentPath);
      expect(result).toBe(true);

      // Clean up
      await releaseLock(nonExistentPath);
      await fs.remove(path.join(testDir, 'nonexistent'));
    });

    it('should handle corrupted lock files', async () => {
      // Create invalid lock file
      await fs.writeFile(lockPath, 'invalid json content');

      // Should be able to acquire (treats corrupted file as stale)
      const result = await acquireLock(registryPath, { timeout: 1000 });
      expect(result).toBe(true);

      // Clean up
      await releaseLock(registryPath);
    });
  });
});
