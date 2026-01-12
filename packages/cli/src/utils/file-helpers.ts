import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Check if a file exists
 * @param filePath - Full file path
 * @returns True if file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    return await fs.pathExists(filePath);
  } catch {
    return false;
  }
}

/**
 * Find first existing file from a list of patterns
 * @param dir - Directory to search
 * @param patterns - Array of file patterns to check
 * @returns Path to first existing file, or undefined
 */
export async function findFirstExisting(
  dir: string,
  patterns: string[]
): Promise<string | undefined> {
  for (const pattern of patterns) {
    const filePath = path.join(dir, pattern);
    if (await fileExists(filePath)) {
      return filePath;
    }
  }
  return undefined;
}

/**
 * Read and parse JSON file safely
 * @param filePath - Path to JSON file
 * @returns Parsed JSON or undefined on error
 */
export async function readJSON<T = any>(filePath: string): Promise<T | undefined> {
  try {
    return await fs.readJSON(filePath);
  } catch {
    return undefined;
  }
}

/**
 * Extract package version from package.json
 * @param projectDir - Project directory
 * @param packageName - Package name to find
 * @returns Version string or undefined
 */
export async function getPackageVersion(
  projectDir: string,
  packageName: string
): Promise<string | undefined> {
  const packageJsonPath = path.join(projectDir, 'package.json');
  const packageJson = await readJSON<{
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  }>(packageJsonPath);

  if (!packageJson) {
    return undefined;
  }

  return (
    packageJson.dependencies?.[packageName] ||
    packageJson.devDependencies?.[packageName]
  );
}
