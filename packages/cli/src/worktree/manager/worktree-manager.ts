/**
 * Worktree Manager
 *
 * High-level orchestration of Git worktree operations with registry integration
 */

import * as path from 'path';
import {
  createWorktree,
  removeWorktree,
  getCommitStatus,
  syncWorktree,
} from './git-operations.js';
import { resolveWorktreePathSync } from './path-resolver.js';
import { WorktreeRegistryManager } from '../registry/registry.js';
import type {
  Worktree,
  WorktreeConfig,
  WorktreeStatus,
} from '../models/worktree.types.js';
import type { WorktreeMetadata, WorktreeRegistry } from '../models/registry.types.js';
import type { CommitStatus } from './git-operations.js';
import { ValidationError } from '../utils/error-handler.js';

/**
 * Create Worktree Options
 */
export interface CreateOptions {
  /**
   * Custom branch name (defaults to feature/{specId})
   */
  branch?: string;

  /**
   * Custom base branch (defaults to config.default_base)
   */
  base?: string;
}

/**
 * Worktree Status Info
 *
 * Extended status information including commit status
 */
export interface WorktreeStatusInfo extends CommitStatus {
  status: WorktreeStatus;
  lastSync?: string;
}

/**
 * Worktree Manager
 *
 * Manages Git worktrees with registry integration
 */
export class WorktreeManager {
  private registry: WorktreeRegistryManager;
  private config: WorktreeConfig;
  private repoPath: string;

  constructor(registryPath: string, config: WorktreeConfig, repoPath: string) {
    this.registry = new WorktreeRegistryManager(registryPath);
    this.config = config;
    this.repoPath = repoPath;
  }

  /**
   * Initialize
   *
   * Loads the registry (creates if doesn't exist)
   */
  async initialize(): Promise<void> {
    await this.registry.load();
  }

  /**
   * Get Registry
   *
   * Returns the full registry for inspection
   */
  async getRegistry(): Promise<WorktreeRegistry> {
    return await this.registry.getAll();
  }

  /**
   * Create Worktree
   *
   * Creates a new Git worktree and registers it
   *
   * @param specId - SPEC identifier
   * @param description - Worktree description
   * @param options - Creation options
   * @returns Created worktree
   */
  async create(
    specId: string,
    _description: string,
    options: CreateOptions = {}
  ): Promise<Worktree> {
    // Validate SPEC ID
    if (!specId || specId.trim() === '') {
      throw new ValidationError('SPEC ID cannot be empty', { field: 'specId' });
    }

    // Check if worktree already exists
    const existing = await this.registry.get(specId);
    if (existing) {
      throw new ValidationError(`Worktree for ${specId} already exists`, {
        field: 'specId',
      });
    }

    // Determine branch and base
    const branch = options.branch || `feature/${specId}`;
    const baseBranch = options.base || this.config.default_base;

    // Resolve worktree path
    const worktreePath = resolveWorktreePathSync(
      specId,
      this.config,
      path.basename(this.repoPath)
    );

    // Create Git worktree
    await createWorktree({
      repoPath: this.repoPath,
      branch,
      path: worktreePath,
      base: baseBranch,
    });

    // Create worktree metadata
    const now = new Date().toISOString();
    const metadata: WorktreeMetadata = {
      id: specId,
      path: worktreePath,
      branch,
      base_branch: baseBranch,
      status: 'active',
      created_at: now,
    };

    // Register in registry
    await this.registry.add(metadata);

    // Return full worktree object
    return {
      ...metadata,
    };
  }

  /**
   * List Worktrees
   *
   * Lists all worktrees, optionally filtered by status
   *
   * @param status - Optional status filter
   * @returns Array of worktrees
   */
  async list(status?: WorktreeStatus): Promise<Worktree[]> {
    const options = status ? { status } : {};
    const metadata = await this.registry.list(options);

    return metadata.map((m) => ({
      ...m,
    }));
  }

  /**
   * Get Worktree
   *
   * Gets a worktree by SPEC ID
   *
   * @param specId - SPEC identifier
   * @returns Worktree or undefined if not found
   */
  async get(specId: string): Promise<Worktree | undefined> {
    const metadata = await this.registry.get(specId);
    if (!metadata) {
      return undefined;
    }

    return {
      ...metadata,
    };
  }

  /**
   * Remove Worktree
   *
   * Removes a Git worktree and unregisters it
   *
   * @param specId - SPEC identifier
   * @param force - Force removal even with uncommitted changes
   */
  async remove(specId: string, force: boolean = false): Promise<void> {
    // Get worktree from registry
    const worktree = await this.registry.get(specId);
    if (!worktree) {
      throw new ValidationError(`Worktree ${specId} not found`, { field: 'specId' });
    }

    // Remove Git worktree
    await removeWorktree(this.repoPath, worktree.path, force);

    // Remove from registry
    await this.registry.remove(specId);
  }

  /**
   * Sync Worktree
   *
   * Syncs a worktree with its base branch
   *
   * @param specId - SPEC identifier
   * @param strategy - Sync strategy ('merge' or 'rebase')
   */
  async sync(specId: string, strategy: 'merge' | 'rebase' = 'merge'): Promise<void> {
    // Get worktree from registry
    const worktree = await this.registry.get(specId);
    if (!worktree) {
      throw new ValidationError(`Worktree ${specId} not found`, { field: 'specId' });
    }

    // Sync with Git
    await syncWorktree(worktree.path, worktree.base_branch, strategy);

    // Update last_sync timestamp
    await this.registry.update(specId, {
      last_sync: new Date().toISOString(),
    });
  }

  /**
   * Get Status
   *
   * Gets commit status for a worktree
   *
   * @param specId - SPEC identifier
   * @returns Worktree status info
   */
  async getStatus(specId: string): Promise<WorktreeStatusInfo> {
    // Get worktree from registry
    const worktree = await this.registry.get(specId);
    if (!worktree) {
      throw new ValidationError(`Worktree ${specId} not found`, { field: 'specId' });
    }

    // Get commit status from Git
    const commitStatus = await getCommitStatus(worktree.path, worktree.base_branch);

    return {
      ...commitStatus,
      status: worktree.status,
      lastSync: worktree.last_sync,
    };
  }

  /**
   * Update Status
   *
   * Updates the status of a worktree
   *
   * @param specId - SPEC identifier
   * @param status - New status
   */
  async updateStatus(specId: string, status: WorktreeStatus): Promise<void> {
    // Verify worktree exists
    const worktree = await this.registry.get(specId);
    if (!worktree) {
      throw new ValidationError(`Worktree ${specId} not found`, { field: 'specId' });
    }

    // Update status in registry
    await this.registry.update(specId, { status });
  }
}
