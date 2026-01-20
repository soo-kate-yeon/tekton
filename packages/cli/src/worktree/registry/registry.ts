import fs from 'fs-extra';
import * as path from 'path';
import {
  WorktreeRegistrySchema,
  type WorktreeRegistry,
  type WorktreeMetadata,
} from '../models/registry.types.js';
import type { WorktreeStatus } from '../models/worktree.types.js';
import { acquireLock, releaseLock } from './registry-lock.js';

/**
 * List filter options
 */
export interface ListOptions {
  /**
   * Filter by worktree status
   */
  status?: WorktreeStatus;
}

/**
 * Worktree Registry Manager
 *
 * Manages the worktree registry with atomic updates, locking, and backup/rollback support
 */
export class WorktreeRegistryManager {
  private registryPath: string;
  private registry: WorktreeRegistry | null = null;
  private readonly LOCK_TIMEOUT = 30000; // 30 seconds

  constructor(registryPath: string) {
    this.registryPath = registryPath;
  }

  /**
   * Load the registry from disk
   * Creates a new registry if file doesn't exist
   */
  async load(): Promise<void> {
    const exists = await fs.pathExists(this.registryPath);

    if (!exists) {
      // Create new registry with default values
      this.registry = {
        version: '1.0.0',
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        config: {
          worktree_root: '~/worktrees/tekton/',
          auto_sync: true,
          cleanup_merged: true,
          default_base: 'master',
        },
        worktrees: {},
      };

      // Save initial registry
      await this.saveWithoutLock();
    } else {
      // Load existing registry
      const data = await fs.readJSON(this.registryPath);

      // Validate with Zod schema
      const result = WorktreeRegistrySchema.safeParse(data);
      if (!result.success) {
        throw new Error(`Invalid registry format: ${result.error.message}`);
      }

      this.registry = result.data;
    }
  }

  /**
   * Get the full registry
   */
  async getAll(): Promise<WorktreeRegistry> {
    this.ensureLoaded();
    return { ...this.registry! };
  }

  /**
   * Get a worktree by ID
   */
  async get(id: string): Promise<WorktreeMetadata | undefined> {
    this.ensureLoaded();
    const worktree = this.registry!.worktrees[id];
    return worktree ? { ...worktree } : undefined;
  }

  /**
   * List all worktrees with optional filtering
   */
  async list(options: ListOptions = {}): Promise<WorktreeMetadata[]> {
    this.ensureLoaded();

    let worktrees = Object.values(this.registry!.worktrees);

    // Apply status filter if provided
    if (options.status) {
      worktrees = worktrees.filter(w => w.status === options.status);
    }

    return worktrees.map(w => ({ ...w }));
  }

  /**
   * Add a new worktree to the registry
   */
  async add(worktree: WorktreeMetadata): Promise<void> {
    this.ensureLoaded();

    // Check if worktree already exists
    if (this.registry!.worktrees[worktree.id]) {
      throw new Error(`Worktree ${worktree.id} already exists`);
    }

    // Acquire lock
    const locked = await acquireLock(this.registryPath, { timeout: this.LOCK_TIMEOUT });
    if (!locked) {
      throw new Error('Failed to acquire registry lock');
    }

    try {
      // Reload registry to get latest state
      await this.load();

      // Double-check after reload
      if (this.registry!.worktrees[worktree.id]) {
        throw new Error(`Worktree ${worktree.id} already exists`);
      }

      // Add worktree
      this.registry!.worktrees[worktree.id] = worktree;
      this.registry!.last_updated = new Date().toISOString();

      // Save with atomic update
      await this.save();
    } finally {
      await releaseLock(this.registryPath);
    }
  }

  /**
   * Update an existing worktree
   */
  async update(id: string, updates: Partial<WorktreeMetadata>): Promise<void> {
    this.ensureLoaded();

    // Check if worktree exists
    if (!this.registry!.worktrees[id]) {
      throw new Error(`Worktree ${id} not found`);
    }

    // Acquire lock
    const locked = await acquireLock(this.registryPath, { timeout: this.LOCK_TIMEOUT });
    if (!locked) {
      throw new Error('Failed to acquire registry lock');
    }

    try {
      // Reload registry to get latest state
      await this.load();

      // Double-check after reload
      if (!this.registry!.worktrees[id]) {
        throw new Error(`Worktree ${id} not found`);
      }

      // Update worktree
      this.registry!.worktrees[id] = {
        ...this.registry!.worktrees[id],
        ...updates,
      };
      this.registry!.last_updated = new Date().toISOString();

      // Save with atomic update
      await this.save();
    } finally {
      await releaseLock(this.registryPath);
    }
  }

  /**
   * Remove a worktree from the registry
   */
  async remove(id: string): Promise<void> {
    this.ensureLoaded();

    // Check if worktree exists
    if (!this.registry!.worktrees[id]) {
      throw new Error(`Worktree ${id} not found`);
    }

    // Acquire lock
    const locked = await acquireLock(this.registryPath, { timeout: this.LOCK_TIMEOUT });
    if (!locked) {
      throw new Error('Failed to acquire registry lock');
    }

    try {
      // Reload registry to get latest state
      await this.load();

      // Double-check after reload
      if (!this.registry!.worktrees[id]) {
        throw new Error(`Worktree ${id} not found`);
      }

      // Remove worktree
      delete this.registry!.worktrees[id];
      this.registry!.last_updated = new Date().toISOString();

      // Save with atomic update
      await this.save();
    } finally {
      await releaseLock(this.registryPath);
    }
  }

  /**
   * Save the registry to disk with atomic update (backup and rollback)
   * This method assumes the lock is already acquired
   */
  private async save(): Promise<void> {
    this.ensureLoaded();

    const backupPath = `${this.registryPath}.backup`;

    // Create backup if registry file exists
    const exists = await fs.pathExists(this.registryPath);
    if (exists) {
      await fs.copy(this.registryPath, backupPath, { overwrite: true });
    }

    try {
      // Ensure directory exists
      await fs.ensureDir(path.dirname(this.registryPath));

      // Write new registry
      await fs.writeJSON(this.registryPath, this.registry, { spaces: 2 });

      // Remove backup on success
      if (exists) {
        await fs.remove(backupPath);
      }
    } catch (error) {
      // Rollback on error
      if (exists) {
        await fs.copy(backupPath, this.registryPath, { overwrite: true });
        await fs.remove(backupPath);
      }
      throw error;
    }
  }

  /**
   * Save without acquiring lock (used for initial creation)
   */
  private async saveWithoutLock(): Promise<void> {
    this.ensureLoaded();

    // Ensure directory exists
    await fs.ensureDir(path.dirname(this.registryPath));

    // Write registry
    await fs.writeJSON(this.registryPath, this.registry, { spaces: 2 });
  }

  /**
   * Ensure registry is loaded
   */
  private ensureLoaded(): void {
    if (!this.registry) {
      throw new Error('Registry not loaded. Call load() first.');
    }
  }
}
