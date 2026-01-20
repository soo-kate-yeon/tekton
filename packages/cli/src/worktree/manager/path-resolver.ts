import * as os from 'os';
import * as path from 'path';
import { execa } from 'execa';
import type { WorktreeConfig } from '../models/worktree.types.js';

/**
 * Path Context
 *
 * Context object containing values for path template substitution
 */
export interface PathContext {
  /**
   * Home directory path
   */
  HOME: string;

  /**
   * Current user name
   */
  USER: string;

  /**
   * Project name (derived from Git remote or directory)
   */
  PROJECT_NAME: string;
}

/**
 * Get Project Name
 *
 * Derives project name from Git remote URL or current directory name
 */
export async function getProjectName(cwd: string = process.cwd()): Promise<string> {
  try {
    // Try to get project name from Git remote URL
    const { stdout } = await execa('git', ['remote', 'get-url', 'origin'], { cwd });
    const remoteName = stdout.trim();

    // Extract project name from Git URL
    // Examples:
    // - https://github.com/user/project.git -> project
    // - git@github.com:user/project.git -> project
    // - https://github.com/user/project -> project
    const match = remoteName.match(/\/([^/]+?)(\.git)?$/);
    if (match && match[1]) {
      return match[1];
    }
  } catch {
    // Git command failed or no remote - fall back to directory name
  }

  // Fall back to current directory name
  return path.basename(cwd);
}

/**
 * Create Path Context
 *
 * Creates a PathContext object with current environment values
 */
export async function createPathContext(cwd: string = process.cwd()): Promise<PathContext> {
  const projectName = await getProjectName(cwd);

  return {
    HOME: os.homedir(),
    USER: process.env.USER || process.env.USERNAME || 'unknown',
    PROJECT_NAME: projectName,
  };
}

/**
 * Expand Path
 *
 * Expands a path template with context values
 *
 * Supported substitutions:
 * - {HOME} -> User's home directory
 * - {USER} -> Current user name
 * - {PROJECT_NAME} -> Project name
 * - ~ -> User's home directory (at start of path only)
 *
 * @param template - Path template with placeholders
 * @param context - Context values for substitution
 * @returns Expanded path string
 */
export function expandPath(template: string, context: PathContext): string {
  if (!template) {
    return '';
  }

  let expanded = template;

  // Expand tilde to home directory (only at start)
  if (expanded.startsWith('~')) {
    expanded = expanded.replace(/^~/, context.HOME);
  }

  // Expand {HOME}
  expanded = expanded.replace(/{HOME}/g, context.HOME);

  // Expand {USER}
  expanded = expanded.replace(/{USER}/g, context.USER);

  // Expand {PROJECT_NAME}
  expanded = expanded.replace(/{PROJECT_NAME}/g, context.PROJECT_NAME);

  return expanded;
}

/**
 * Resolve Worktree Path
 *
 * Resolves the full path for a worktree based on SPEC ID and config
 *
 * @param specId - SPEC identifier (e.g., SPEC-AUTH-001)
 * @param config - Worktree configuration
 * @param cwd - Current working directory (for project name detection)
 * @returns Absolute path to the worktree directory
 */
export async function resolveWorktreePath(
  specId: string,
  config: WorktreeConfig,
  cwd: string = process.cwd()
): Promise<string> {
  const context = await createPathContext(cwd);
  const expandedRoot = expandPath(config.worktree_root, context);

  // Normalize and resolve to absolute path
  const absoluteRoot = path.resolve(expandedRoot);

  // Append SPEC ID to create final worktree path
  const worktreePath = path.join(absoluteRoot, specId);

  return worktreePath;
}

/**
 * Synchronous version of resolveWorktreePath
 *
 * Uses the project name from the current directory instead of Git remote.
 * Useful for testing or when Git is not available.
 *
 * @param specId - SPEC identifier
 * @param config - Worktree configuration
 * @param projectName - Explicit project name (defaults to current directory basename)
 * @returns Absolute path to the worktree directory
 */
export function resolveWorktreePathSync(
  specId: string,
  config: WorktreeConfig,
  projectName?: string
): string {
  const context: PathContext = {
    HOME: os.homedir(),
    USER: process.env.USER || process.env.USERNAME || 'unknown',
    PROJECT_NAME: projectName || path.basename(process.cwd()),
  };

  const expandedRoot = expandPath(config.worktree_root, context);
  const absoluteRoot = path.resolve(expandedRoot);
  const worktreePath = path.join(absoluteRoot, specId);

  return worktreePath;
}
