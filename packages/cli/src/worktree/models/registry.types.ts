import { z } from 'zod';
import { WorktreeConfigSchema, WorktreeStatusSchema } from './worktree.types.js';

/**
 * Worktree Metadata
 *
 * Stored metadata for each worktree in the registry
 * This is a subset of the full Worktree type, containing only
 * the information that needs to be persisted
 */
export const WorktreeMetadataSchema = z.object({
  /**
   * SPEC identifier (e.g., SPEC-ABC-001)
   */
  id: z.string().min(1, 'Worktree id cannot be empty'),

  /**
   * Absolute path to the worktree directory
   */
  path: z.string().min(1, 'Worktree path cannot be empty'),

  /**
   * Branch name for this worktree (e.g., feature/SPEC-ABC-001)
   */
  branch: z.string().min(1, 'Worktree branch cannot be empty'),

  /**
   * Base branch this worktree was created from (e.g., master, main)
   */
  base_branch: z.string().min(1, 'Base branch cannot be empty'),

  /**
   * Current status of the worktree
   */
  status: WorktreeStatusSchema,

  /**
   * ISO 8601 timestamp when the worktree was created
   */
  created_at: z.string().datetime('Invalid ISO 8601 date format'),

  /**
   * ISO 8601 timestamp of last sync with base branch (optional)
   */
  last_sync: z.string().datetime('Invalid ISO 8601 date format').optional(),
});

export type WorktreeMetadata = z.infer<typeof WorktreeMetadataSchema>;

/**
 * Worktree Registry
 *
 * The main registry file that tracks all worktrees for a project
 * Stored as JSON at: {worktree_root}/.worktree-registry.json
 */
export const WorktreeRegistrySchema = z.object({
  /**
   * Registry format version (semantic versioning)
   */
  version: z.string().min(1, 'Version cannot be empty'),

  /**
   * ISO 8601 timestamp when the registry was created
   */
  created_at: z.string().datetime('Invalid ISO 8601 date format'),

  /**
   * ISO 8601 timestamp when the registry was last updated
   */
  last_updated: z.string().datetime('Invalid ISO 8601 date format'),

  /**
   * Global worktree configuration
   */
  config: WorktreeConfigSchema,

  /**
   * Map of SPEC ID to worktree metadata
   * Key: SPEC ID (e.g., "SPEC-ABC-001")
   * Value: Worktree metadata
   */
  worktrees: z.record(z.string(), WorktreeMetadataSchema),
});

export type WorktreeRegistry = z.infer<typeof WorktreeRegistrySchema>;
