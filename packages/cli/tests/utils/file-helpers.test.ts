import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs-extra';
import * as path from 'path';
import {
  fileExists,
  findFirstExisting,
  readJSON,
  getPackageVersion,
} from '../../src/utils/file-helpers.js';

describe('File Helpers', () => {
  const testDir = path.join(process.cwd(), 'test-fixtures', 'file-helpers');

  beforeEach(async () => {
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  describe('fileExists', () => {
    it('should return true for existing file', async () => {
      const filePath = path.join(testDir, 'test.txt');
      await fs.writeFile(filePath, 'content');

      const exists = await fileExists(filePath);
      expect(exists).toBe(true);
    });

    it('should return false for non-existent file', async () => {
      const filePath = path.join(testDir, 'non-existent.txt');

      const exists = await fileExists(filePath);
      expect(exists).toBe(false);
    });
  });

  describe('findFirstExisting', () => {
    it('should find first existing file', async () => {
      const dir = path.join(testDir, 'find-test');
      await fs.ensureDir(dir);
      await fs.writeFile(path.join(dir, 'second.txt'), 'content');

      const result = await findFirstExisting(dir, ['first.txt', 'second.txt', 'third.txt']);

      expect(result).toBe(path.join(dir, 'second.txt'));
    });

    it('should return undefined when no files exist', async () => {
      const dir = path.join(testDir, 'empty-dir');
      await fs.ensureDir(dir);

      const result = await findFirstExisting(dir, ['first.txt', 'second.txt']);

      expect(result).toBeUndefined();
    });

    it('should prioritize earlier patterns', async () => {
      const dir = path.join(testDir, 'priority-test');
      await fs.ensureDir(dir);
      await fs.writeFile(path.join(dir, 'first.txt'), 'content');
      await fs.writeFile(path.join(dir, 'second.txt'), 'content');

      const result = await findFirstExisting(dir, ['first.txt', 'second.txt']);

      expect(result).toBe(path.join(dir, 'first.txt'));
    });
  });

  describe('readJSON', () => {
    it('should parse valid JSON file', async () => {
      const filePath = path.join(testDir, 'valid.json');
      await fs.writeJSON(filePath, { key: 'value' });

      const result = await readJSON<{ key: string }>(filePath);

      expect(result).toEqual({ key: 'value' });
    });

    it('should return undefined for invalid JSON', async () => {
      const filePath = path.join(testDir, 'invalid.json');
      await fs.writeFile(filePath, 'invalid json{');

      const result = await readJSON(filePath);

      expect(result).toBeUndefined();
    });

    it('should return undefined for non-existent file', async () => {
      const filePath = path.join(testDir, 'non-existent.json');

      const result = await readJSON(filePath);

      expect(result).toBeUndefined();
    });
  });

  describe('getPackageVersion', () => {
    it('should extract version from dependencies', async () => {
      const projectDir = path.join(testDir, 'deps-test');
      await fs.ensureDir(projectDir);
      await fs.writeJSON(path.join(projectDir, 'package.json'), {
        dependencies: { react: '^18.0.0' },
      });

      const version = await getPackageVersion(projectDir, 'react');

      expect(version).toBe('^18.0.0');
    });

    it('should extract version from devDependencies', async () => {
      const projectDir = path.join(testDir, 'dev-deps-test');
      await fs.ensureDir(projectDir);
      await fs.writeJSON(path.join(projectDir, 'package.json'), {
        devDependencies: { typescript: '^5.0.0' },
      });

      const version = await getPackageVersion(projectDir, 'typescript');

      expect(version).toBe('^5.0.0');
    });

    it('should prioritize dependencies over devDependencies', async () => {
      const projectDir = path.join(testDir, 'priority-deps');
      await fs.ensureDir(projectDir);
      await fs.writeJSON(path.join(projectDir, 'package.json'), {
        dependencies: { react: '^18.0.0' },
        devDependencies: { react: '^17.0.0' },
      });

      const version = await getPackageVersion(projectDir, 'react');

      expect(version).toBe('^18.0.0');
    });

    it('should return undefined for missing package', async () => {
      const projectDir = path.join(testDir, 'missing-pkg');
      await fs.ensureDir(projectDir);
      await fs.writeJSON(path.join(projectDir, 'package.json'), {
        dependencies: {},
      });

      const version = await getPackageVersion(projectDir, 'non-existent');

      expect(version).toBeUndefined();
    });

    it('should return undefined when package.json does not exist', async () => {
      const projectDir = path.join(testDir, 'no-package-json');
      await fs.ensureDir(projectDir);

      const version = await getPackageVersion(projectDir, 'react');

      expect(version).toBeUndefined();
    });
  });
});
