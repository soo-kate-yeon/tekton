/**
 * Timestamp Manager Tests
 * SPEC-MCP-002: AC-011 Timestamp Collision Handling
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mkdirSync, rmSync } from 'fs';
import {
  generateTimestampId,
  generateRandomSuffix,
  parseTimestampFromId,
  isValidBlueprintId
} from '../../src/storage/timestamp-manager.js';

describe('Timestamp Manager', () => {
  const testBaseDir = '.tekton-test/collision-test';

  beforeEach(() => {
    try {
      rmSync(testBaseDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore
    }
    mkdirSync(testBaseDir, { recursive: true });
  });

  describe('generateTimestampId', () => {
    it('should generate timestamp-based ID', () => {
      const id = generateTimestampId(testBaseDir);
      expect(id).toMatch(/^\d+$/);
    });

    it('should detect collision and append suffix', () => {
      // Create first directory
      const id1 = generateTimestampId(testBaseDir);
      const dir1 = `${testBaseDir}/${id1}`;
      mkdirSync(dir1, { recursive: true });

      // Generate second ID (should detect collision if same millisecond)
      const id2 = generateTimestampId(testBaseDir);

      // If collision occurred, id2 should have suffix
      if (id1 === id2.split('-')[0]) {
        expect(id2).toMatch(/^\d+-[a-z0-9]{6}$/);
      } else {
        // Different timestamps, no suffix
        expect(id2).toMatch(/^\d+$/);
      }
    });
  });

  describe('generateRandomSuffix', () => {
    it('should generate suffix of specified length', () => {
      const suffix = generateRandomSuffix(6);
      expect(suffix).toHaveLength(6);
      expect(suffix).toMatch(/^[a-z0-9]+$/);
    });

    it('should generate different suffixes', () => {
      const suffix1 = generateRandomSuffix(6);
      const suffix2 = generateRandomSuffix(6);
      expect(suffix1).not.toBe(suffix2);
    });
  });

  describe('parseTimestampFromId', () => {
    it('should parse timestamp from simple ID', () => {
      const timestamp = parseTimestampFromId('1738123456789');
      expect(timestamp).toBe(1738123456789);
    });

    it('should parse timestamp from ID with suffix', () => {
      const timestamp = parseTimestampFromId('1738123456789-abc123');
      expect(timestamp).toBe(1738123456789);
    });

    it('should return null for invalid ID', () => {
      const timestamp = parseTimestampFromId('invalid-id');
      expect(timestamp).toBeNull();
    });
  });

  describe('isValidBlueprintId', () => {
    it('should validate simple timestamp ID', () => {
      expect(isValidBlueprintId('1738123456789')).toBe(true);
    });

    it('should validate ID with suffix', () => {
      expect(isValidBlueprintId('1738123456789-abc123')).toBe(true);
    });

    it('should reject invalid formats', () => {
      expect(isValidBlueprintId('invalid')).toBe(false);
      expect(isValidBlueprintId('123-ABC')).toBe(false); // uppercase not allowed
      expect(isValidBlueprintId('')).toBe(false);
    });
  });
});
