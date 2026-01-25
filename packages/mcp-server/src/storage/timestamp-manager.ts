/**
 * Timestamp-based ID generation with collision detection
 * SPEC-MCP-002: S-001 Timestamp Collision Handling
 */

import { randomBytes } from 'crypto';
import { existsSync } from 'fs';

/**
 * Generate timestamp-based ID with collision detection
 * SPEC: S-001 Timestamp Collision Handling
 * Format: bp-{timestamp}-{suffix}
 *
 * @param baseDir - Base directory to check for collisions
 * @returns Unique timestamp-based ID in format bp-{timestamp}-{suffix}
 */
export function generateTimestampId(baseDir: string): string {
  const timestamp = Date.now();
  const timestampStr = timestamp.toString();

  // Always generate suffix for consistent ID format
  const suffix = generateRandomSuffix(6);
  const blueprintId = `bp-${timestampStr}-${suffix}`;
  const candidatePath = `${baseDir}/${blueprintId}`;

  // Check for collision (same millisecond + same suffix - extremely rare)
  if (existsSync(candidatePath)) {
    // Generate new suffix if collision occurs
    const newSuffix = generateRandomSuffix(6);
    return `bp-${timestampStr}-${newSuffix}`;
  }

  return blueprintId;
}

/**
 * Generate random alphanumeric suffix for collision resolution
 * SPEC: S-001 Timestamp Collision Handling
 *
 * @param length - Length of suffix (default: 6)
 * @returns Random alphanumeric string
 */
export function generateRandomSuffix(length: number = 6): string {
  const bytes = randomBytes(Math.ceil(length / 2));
  return bytes.toString('hex').slice(0, length);
}

/**
 * Parse timestamp from blueprint ID
 * Format: bp-{timestamp}-{suffix}
 */
export function parseTimestampFromId(blueprintId: string): number | null {
  const match = blueprintId.match(/^bp-(\d+)-[a-z0-9]+$/);
  if (!match || !match[1]) {
    return null;
  }
  return parseInt(match[1], 10);
}

/**
 * Check if blueprint ID is valid format
 * Format: bp-{timestamp}-{suffix}
 */
export function isValidBlueprintId(blueprintId: string): boolean {
  return /^bp-\d+-[a-z0-9]+$/.test(blueprintId);
}
