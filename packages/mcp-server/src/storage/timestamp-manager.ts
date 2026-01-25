/**
 * Timestamp-based ID generation with collision detection
 * SPEC-MCP-002: S-001 Timestamp Collision Handling
 */

import { randomBytes } from 'crypto';
import { existsSync } from 'fs';

/**
 * Generate timestamp-based ID with collision detection
 * SPEC: S-001 Timestamp Collision Handling
 *
 * @param baseDir - Base directory to check for collisions
 * @returns Unique timestamp-based ID
 */
export function generateTimestampId(baseDir: string): string {
  const timestamp = Date.now();
  const timestampStr = timestamp.toString();
  const candidatePath = `${baseDir}/${timestampStr}`;

  // Check for collision (same millisecond)
  if (existsSync(candidatePath)) {
    // Append random 6-character suffix
    const suffix = generateRandomSuffix(6);
    return `${timestampStr}-${suffix}`;
  }

  return timestampStr;
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
 * Handles both formats: "1738123456789" and "1738123456789-abc123"
 */
export function parseTimestampFromId(blueprintId: string): number | null {
  const match = blueprintId.match(/^(\d+)(-[a-z0-9]+)?$/);
  if (!match || !match[1]) {
    return null;
  }
  return parseInt(match[1], 10);
}

/**
 * Check if blueprint ID is valid format
 */
export function isValidBlueprintId(blueprintId: string): boolean {
  return /^(\d+)(-[a-z0-9]+)?$/.test(blueprintId);
}
