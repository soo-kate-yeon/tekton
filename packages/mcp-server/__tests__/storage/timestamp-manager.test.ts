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
  isValidBlueprintId,
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
    it('should generate timestamp-based ID with bp- prefix', () => {
      const id = generateTimestampId(testBaseDir);
      // Format: bp-{timestamp}-{suffix}
      expect(id).toMatch(/^bp-\d+-[a-f0-9]+$/);
    });

    it('should detect collision and generate new suffix', () => {
      // Create first directory
      const id1 = generateTimestampId(testBaseDir);
      const dir1 = `${testBaseDir}/${id1}`;
      mkdirSync(dir1, { recursive: true });

      // Generate second ID (should detect collision if same millisecond)
      const id2 = generateTimestampId(testBaseDir);

      // Both IDs should have bp-{timestamp}-{suffix} format
      expect(id2).toMatch(/^bp-\d+-[a-f0-9]+$/);

      // If same millisecond, suffixes should be different
      const [, timestamp1, suffix1] = id1.match(/^bp-(\d+)-([a-f0-9]+)$/) || [];
      const [, timestamp2, suffix2] = id2.match(/^bp-(\d+)-([a-f0-9]+)$/) || [];
      if (timestamp1 === timestamp2) {
        expect(suffix1).not.toBe(suffix2);
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
    it('should parse timestamp from bp-prefixed ID', () => {
      // Format: bp-{timestamp}-{suffix}
      const timestamp = parseTimestampFromId('bp-1738123456789-abc123');
      expect(timestamp).toBe(1738123456789);
    });

    it('should parse timestamp from various valid IDs', () => {
      const timestamp1 = parseTimestampFromId('bp-1706359200000-def456');
      expect(timestamp1).toBe(1706359200000);

      const timestamp2 = parseTimestampFromId('bp-9999999999999-000000');
      expect(timestamp2).toBe(9999999999999);
    });

    it('should return null for invalid ID formats', () => {
      // Missing bp- prefix
      expect(parseTimestampFromId('1738123456789')).toBeNull();
      expect(parseTimestampFromId('1738123456789-abc123')).toBeNull();
      // Invalid format
      expect(parseTimestampFromId('invalid-id')).toBeNull();
      expect(parseTimestampFromId('bp-invalid-abc123')).toBeNull();
      expect(parseTimestampFromId('')).toBeNull();
    });
  });

  describe('isValidBlueprintId', () => {
    it('should validate bp-prefixed ID format', () => {
      // Format: bp-{timestamp}-{suffix}
      expect(isValidBlueprintId('bp-1738123456789-abc123')).toBe(true);
      expect(isValidBlueprintId('bp-1706359200000-def456')).toBe(true);
      expect(isValidBlueprintId('bp-9999999999999-000000')).toBe(true);
    });

    it('should reject IDs without bp- prefix', () => {
      expect(isValidBlueprintId('1738123456789')).toBe(false);
      expect(isValidBlueprintId('1738123456789-abc123')).toBe(false);
    });

    it('should reject invalid formats', () => {
      expect(isValidBlueprintId('invalid')).toBe(false);
      expect(isValidBlueprintId('bp-123-ABC')).toBe(false); // uppercase not allowed
      expect(isValidBlueprintId('bp-abc-123456')).toBe(false); // non-numeric timestamp
      expect(isValidBlueprintId('')).toBe(false);
      expect(isValidBlueprintId('bp-123')).toBe(false); // missing suffix
    });
  });
});
