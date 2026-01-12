import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * shadcn/ui configuration interface
 */
export interface ShadcnConfig {
  $schema?: string;
  style?: string;
  rsc?: boolean;
  tsx?: boolean;
  tailwind?: {
    config?: string;
    css?: string;
  };
  aliases?: {
    components?: string;
    utils?: string;
  };
}

/**
 * shadcn detection result
 */
export interface ShadcnDetectionResult {
  installed: boolean;
  configPath?: string;
  config?: ShadcnConfig;
  version?: string;
}

/**
 * Detect shadcn/ui in a project directory
 * @param projectDir - Directory path to check (defaults to current directory)
 * @returns shadcn detection result
 */
export async function detectShadcn(
  projectDir: string = process.cwd()
): Promise<ShadcnDetectionResult> {
  try {
    // Check if directory exists
    const dirExists = await fs.pathExists(projectDir);
    if (!dirExists) {
      return { installed: false };
    }

    // Check for components.json
    const configPath = path.join(projectDir, 'components.json');
    const exists = await fs.pathExists(configPath);

    if (!exists) {
      return { installed: false };
    }

    // Try to parse the configuration
    let config: ShadcnConfig | undefined;
    try {
      config = await fs.readJSON(configPath);
    } catch (error) {
      // Invalid JSON, treat as not installed
      console.error('Error parsing components.json:', error);
      return { installed: false };
    }

    // Extract version from package.json if available
    const version = await extractShadcnVersion(projectDir);

    return {
      installed: true,
      configPath,
      config,
      version,
    };
  } catch (error) {
    // Handle errors gracefully
    console.error('Error detecting shadcn:', error);
    return { installed: false };
  }
}

/**
 * Extract shadcn CLI version from package.json
 */
async function extractShadcnVersion(
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
      packageJson.dependencies?.['shadcn-ui'] ||
      packageJson.devDependencies?.['shadcn-ui'] ||
      packageJson.dependencies?.['shadcn'] ||
      packageJson.devDependencies?.['shadcn'];

    return version;
  } catch (error) {
    return undefined;
  }
}
