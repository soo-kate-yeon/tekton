/**
 * Blueprint storage with timestamp-based file system
 * SPEC-MCP-002: File Storage Structure
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { Blueprint } from '@tekton/core';
import { generateTimestampId, isValidBlueprintId } from './timestamp-manager.js';
import { createStorageError } from '../utils/error-handler.js';

/**
 * Blueprint metadata for storage index
 */
export interface BlueprintMetadata {
  timestamp: string;
  themeId: string;
  createdAt: string;
  ttl: number; // Time-to-live in milliseconds
}

/**
 * Blueprint storage configuration
 */
export interface StorageConfig {
  baseDir: string; // Default: .tekton/blueprints
  ttlDays: number; // Default: 30 days
}

/**
 * Default storage configuration
 */
const DEFAULT_CONFIG: StorageConfig = {
  baseDir: '.tekton/blueprints',
  ttlDays: 30,
};

/**
 * Blueprint storage manager
 * SPEC: File Storage Structure
 */
export class BlueprintStorage {
  private config: StorageConfig;

  constructor(config: Partial<StorageConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.ensureBaseDir();
  }

  /**
   * Save blueprint to storage with timestamp-based ID
   * SPEC: S-001 Timestamp Collision Handling, S-003 Blueprint Validation Result
   *
   * @param blueprint - Blueprint to save
   * @returns Blueprint ID (timestamp or timestamp-suffix)
   */
  async saveBlueprint(blueprint: Blueprint): Promise<string> {
    try {
      // Generate unique timestamp ID with collision detection
      const timestampId = generateTimestampId(this.config.baseDir);
      const blueprintDir = join(this.config.baseDir, timestampId);

      // Create directory
      mkdirSync(blueprintDir, { recursive: true });

      // Save blueprint.json
      const blueprintPath = join(blueprintDir, 'blueprint.json');
      writeFileSync(blueprintPath, JSON.stringify(blueprint, null, 2), 'utf-8');

      // Save metadata.json
      const metadata: BlueprintMetadata = {
        timestamp: timestampId,
        themeId: blueprint.themeId,
        createdAt: new Date().toISOString(),
        ttl: Date.now() + this.config.ttlDays * 24 * 60 * 60 * 1000,
      };
      const metadataPath = join(blueprintDir, 'metadata.json');
      writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');

      return timestampId;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(createStorageError('save blueprint', message).error);
    }
  }

  /**
   * Load blueprint from storage by ID
   *
   * @param blueprintId - Timestamp-based blueprint ID
   * @returns Blueprint or null if not found
   */
  async loadBlueprint(blueprintId: string): Promise<Blueprint | null> {
    try {
      if (!isValidBlueprintId(blueprintId)) {
        return null;
      }

      const blueprintPath = join(this.config.baseDir, blueprintId, 'blueprint.json');
      if (!existsSync(blueprintPath)) {
        return null;
      }

      const blueprintJson = readFileSync(blueprintPath, 'utf-8');
      return JSON.parse(blueprintJson) as Blueprint;
    } catch (error) {
      return null;
    }
  }

  /**
   * Load blueprint metadata
   *
   * @param blueprintId - Timestamp-based blueprint ID
   * @returns Metadata or null if not found
   */
  async loadMetadata(blueprintId: string): Promise<BlueprintMetadata | null> {
    try {
      const metadataPath = join(this.config.baseDir, blueprintId, 'metadata.json');
      if (!existsSync(metadataPath)) {
        return null;
      }

      const metadataJson = readFileSync(metadataPath, 'utf-8');
      return JSON.parse(metadataJson) as BlueprintMetadata;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if blueprint exists
   */
  async blueprintExists(blueprintId: string): Promise<boolean> {
    const blueprintPath = join(this.config.baseDir, blueprintId, 'blueprint.json');
    return existsSync(blueprintPath);
  }

  /**
   * Get blueprint directory path
   */
  getBlueprintDir(blueprintId: string): string {
    return join(this.config.baseDir, blueprintId);
  }

  /**
   * Ensure base directory exists
   */
  private ensureBaseDir(): void {
    if (!existsSync(this.config.baseDir)) {
      mkdirSync(this.config.baseDir, { recursive: true });
    }
  }
}

/**
 * Singleton instance for default storage
 */
let defaultStorage: BlueprintStorage | null = null;

/**
 * Get default blueprint storage instance
 */
export function getDefaultStorage(): BlueprintStorage {
  if (!defaultStorage) {
    defaultStorage = new BlueprintStorage();
  }
  return defaultStorage;
}
