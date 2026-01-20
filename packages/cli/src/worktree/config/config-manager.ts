/**
 * Config Manager
 *
 * Manages worktree configuration stored in YAML format
 */

import fs from 'fs-extra';
import * as path from 'path';
import * as yaml from 'yaml';
import * as os from 'os';
import { z } from 'zod';

/**
 * Worktree Configuration Schema
 *
 * Validates the structure and types of worktree configuration
 */
export const WorktreeConfigSchema = z.object({
  worktree: z.object({
    auto_sync: z.boolean().default(false),
    cleanup_merged: z.boolean().default(true),
    worktree_root: z.string().default('~/worktrees/{PROJECT_NAME}/'),
    default_base: z.string().default('master'),
    sync_strategy: z.enum(['merge', 'rebase']).default('merge'),
    max_worktrees: z.number().int().positive().default(10),
    stale_threshold_days: z.number().int().positive().default(30),
  }),
});

export type WorktreeConfigType = z.infer<typeof WorktreeConfigSchema>;

/**
 * Valid configuration keys
 */
const VALID_KEYS = [
  'auto_sync',
  'cleanup_merged',
  'worktree_root',
  'default_base',
  'sync_strategy',
  'max_worktrees',
  'stale_threshold_days',
] as const;

type ConfigKey = (typeof VALID_KEYS)[number];

/**
 * Config Manager
 *
 * Handles loading, saving, and managing worktree configuration
 */
export class ConfigManager {
  private configPath: string;

  constructor(configPath: string = '.moai/config/sections/worktree.yaml') {
    this.configPath = configPath;
  }

  /**
   * Load Configuration
   *
   * Loads configuration from YAML file, creates default if doesn't exist
   *
   * @returns Parsed and validated configuration
   */
  async loadConfig(): Promise<WorktreeConfigType> {
    if (!(await fs.pathExists(this.configPath))) {
      return this.createDefaultConfig();
    }

    try {
      const content = await fs.readFile(this.configPath, 'utf-8');
      const parsed = yaml.parse(content);
      const validated = WorktreeConfigSchema.parse(parsed);

      // Expand tilde in worktree_root
      if (validated.worktree.worktree_root.startsWith('~')) {
        validated.worktree.worktree_root = validated.worktree.worktree_root.replace(
          /^~/,
          os.homedir()
        );
      }

      return validated;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Invalid configuration format: ${error.errors.map((e) => e.message).join(', ')}`
        );
      }
      throw new Error(`Failed to load configuration: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Save Configuration
   *
   * Saves configuration to YAML file
   *
   * @param config - Configuration to save
   */
  async saveConfig(config: WorktreeConfigType): Promise<void> {
    try {
      // Validate before saving
      WorktreeConfigSchema.parse(config);

      // Ensure parent directory exists
      await fs.ensureDir(path.dirname(this.configPath));

      // Convert to YAML string
      const content = yaml.stringify(config);

      // Write to file
      await fs.writeFile(this.configPath, content, 'utf-8');
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Invalid configuration: ${error.errors.map((e) => e.message).join(', ')}`
        );
      }
      throw new Error(`Failed to save configuration: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get Config Value
   *
   * Gets a specific configuration value by key
   *
   * @param key - Configuration key
   * @returns Configuration value
   */
  async getConfigValue(key: string): Promise<unknown> {
    if (!this.isValidKey(key)) {
      throw new Error(
        `Unknown configuration key: ${key}. Valid keys: ${VALID_KEYS.join(', ')}`
      );
    }

    const config = await this.loadConfig();
    return config.worktree[key as ConfigKey];
  }

  /**
   * Set Config Value
   *
   * Sets a specific configuration value by key
   *
   * @param key - Configuration key
   * @param value - New value
   */
  async setConfigValue(key: string, value: unknown): Promise<void> {
    if (!this.isValidKey(key)) {
      throw new Error(
        `Unknown configuration key: ${key}. Valid keys: ${VALID_KEYS.join(', ')}`
      );
    }

    const config = await this.loadConfig();

    // Type validation based on key
    const validatedValue = this.validateValueType(key as ConfigKey, value);

    // Update config
    config.worktree[key as ConfigKey] = validatedValue as never;

    // Validate full config before saving
    WorktreeConfigSchema.parse(config);

    // Save config
    await this.saveConfig(config);
  }

  /**
   * Create Default Config
   *
   * Creates and returns default configuration
   *
   * @returns Default configuration
   */
  private createDefaultConfig(): WorktreeConfigType {
    return WorktreeConfigSchema.parse({ worktree: {} });
  }

  /**
   * Is Valid Key
   *
   * Checks if a key is a valid configuration key
   *
   * @param key - Key to check
   * @returns True if valid
   */
  private isValidKey(key: string): key is ConfigKey {
    return VALID_KEYS.includes(key as ConfigKey);
  }

  /**
   * Validate Value Type
   *
   * Validates that a value matches the expected type for a configuration key
   *
   * @param key - Configuration key
   * @param value - Value to validate
   * @returns Validated value
   */
  private validateValueType(key: ConfigKey, value: unknown): unknown {
    switch (key) {
      case 'auto_sync':
      case 'cleanup_merged':
        if (typeof value !== 'boolean') {
          throw new Error(`${key} must be a boolean`);
        }
        return value;

      case 'worktree_root':
      case 'default_base':
        if (typeof value !== 'string') {
          throw new Error(`${key} must be a string`);
        }
        return value;

      case 'sync_strategy':
        if (value !== 'merge' && value !== 'rebase') {
          throw new Error(`${key} must be 'merge' or 'rebase'`);
        }
        return value;

      case 'max_worktrees':
      case 'stale_threshold_days':
        if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
          throw new Error(`${key} must be a positive integer`);
        }
        return value;

      default:
        throw new Error(`Unknown configuration key: ${key}`);
    }
  }
}
