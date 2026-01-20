import { z } from 'zod';

/**
 * Worktree Status
 *
 * - active: Worktree is currently in use
 * - merged: Worktree branch has been merged to base
 * - stale: Worktree hasn't been synced in a while
 */
export const WorktreeStatusSchema = z.enum(['active', 'merged', 'stale']);

export type WorktreeStatus = z.infer<typeof WorktreeStatusSchema>;

/**
 * Worktree Interface
 *
 * Represents a Git worktree associated with a SPEC
 */
export const WorktreeSchema = z.object({
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

export type Worktree = z.infer<typeof WorktreeSchema>;

/**
 * Worktree Configuration
 *
 * Global configuration for worktree management
 */
export const WorktreeConfigSchema = z.object({
  /**
   * Root directory for all worktrees
   * Can use tilde (~) for home directory
   */
  worktree_root: z.string().min(1, 'Worktree root cannot be empty'),

  /**
   * Automatically sync with base branch on operations
   */
  auto_sync: z.boolean(),

  /**
   * Automatically clean up worktrees after merge
   */
  cleanup_merged: z.boolean(),

  /**
   * Default base branch for new worktrees
   */
  default_base: z.string().min(1, 'Default base branch cannot be empty'),
});

export type WorktreeConfig = z.infer<typeof WorktreeConfigSchema>;
