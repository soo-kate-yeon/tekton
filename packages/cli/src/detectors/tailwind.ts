import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Tailwind detection result
 */
export interface TailwindDetectionResult {
  installed: boolean;
  configPath?: string;
  version?: string;
}

/**
 * Tailwind configuration file patterns
 * Priority order: .ts > .mjs > .js
 */
const TAILWIND_CONFIG_PATTERNS = [
  'tailwind.config.ts',
  'tailwind.config.mjs',
  'tailwind.config.js',
];

/**
 * Detect Tailwind CSS in a project directory
 * @param projectDir - Directory path to check (defaults to current directory)
 * @returns Tailwind detection result
 */
export async function detectTailwind(
  projectDir: string = process.cwd()
): Promise<TailwindDetectionResult> {
  try {
    // Check if directory exists
    const dirExists = await fs.pathExists(projectDir);
    if (!dirExists) {
      return { installed: false };
    }

    // Check for Tailwind config files in priority order
    for (const pattern of TAILWIND_CONFIG_PATTERNS) {
      const configPath = path.join(projectDir, pattern);
      const exists = await fs.pathExists(configPath);

      if (exists) {
        // Extract version from package.json if available
        const version = await extractTailwindVersion(projectDir);

        return {
          installed: true,
          configPath,
          version,
        };
      }
    }

    // Tailwind not detected
    return { installed: false };
  } catch (error) {
    // Handle errors gracefully
    console.error('Error detecting Tailwind:', error);
    return { installed: false };
  }
}

/**
 * Extract Tailwind version from package.json
 */
async function extractTailwindVersion(
  projectDir: string
): Promise<string | undefined> {
  try {
    const packageJsonPath = path.join(projectDir, 'package.json');
    const exists = await fs.pathExists(packageJsonPath);

    if (!exists) {
      return undefined;
    }

    const packageJson = await fs.readJSON(packageJsonPath);

    // Check dependencies and devDependencies
    const version =
      packageJson.dependencies?.['tailwindcss'] ||
      packageJson.devDependencies?.['tailwindcss'];

    return version;
  } catch (error) {
    return undefined;
  }
}
