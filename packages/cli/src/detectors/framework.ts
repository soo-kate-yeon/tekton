import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Supported framework types
 */
export enum Framework {
  NextJS = 'Next.js',
  Vite = 'Vite',
  Remix = 'Remix',
}

/**
 * Framework detection result
 */
export interface FrameworkDetectionResult {
  framework: Framework | null;
  configPath?: string;
  version?: string;
}

/**
 * Framework configuration file patterns
 * Priority order: Next.js > Vite > Remix
 */
const FRAMEWORK_CONFIGS = [
  {
    framework: Framework.NextJS,
    patterns: ['next.config.js', 'next.config.mjs', 'next.config.ts'],
    packageName: 'next',
  },
  {
    framework: Framework.Vite,
    patterns: ['vite.config.js', 'vite.config.ts', 'vite.config.mjs'],
    packageName: 'vite',
  },
  {
    framework: Framework.Remix,
    patterns: ['remix.config.js', 'remix.config.ts'],
    packageName: '@remix-run/react',
  },
];

/**
 * Detect framework in a project directory
 * @param projectDir - Directory path to check (defaults to current directory)
 * @returns Framework detection result
 */
export async function detectFramework(
  projectDir: string = process.cwd()
): Promise<FrameworkDetectionResult> {
  try {
    // Check if directory exists
    const dirExists = await fs.pathExists(projectDir);
    if (!dirExists) {
      return { framework: null };
    }

    // Check each framework in priority order
    for (const { framework, patterns, packageName } of FRAMEWORK_CONFIGS) {
      for (const pattern of patterns) {
        const configPath = path.join(projectDir, pattern);
        const exists = await fs.pathExists(configPath);

        if (exists) {
          // Extract version from package.json if available
          const version = await extractVersion(projectDir, packageName);

          return {
            framework,
            configPath,
            version,
          };
        }
      }
    }

    // No framework detected
    return { framework: null };
  } catch (error) {
    // Handle errors gracefully
    console.error('Error detecting framework:', error);
    return { framework: null };
  }
}

/**
 * Extract package version from package.json
 */
async function extractVersion(
  projectDir: string,
  packageName: string
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
      packageJson.dependencies?.[packageName] ||
      packageJson.devDependencies?.[packageName];

    return version;
  } catch (error) {
    return undefined;
  }
}
