import { execa } from 'execa';
import * as fs from 'fs-extra';
import * as path from 'path';
import { detectFramework } from '../detectors/framework.js';
import { detectTailwind } from '../detectors/tailwind.js';
import { detectShadcn } from '../detectors/shadcn.js';

/**
 * Prerequisite check result
 */
export interface PrerequisiteResult {
  passed: boolean;
  framework: string | null;
  tailwind: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Installation result
 */
export interface InstallationResult {
  success: boolean;
  configCreated?: boolean;
  configPath?: string;
  error?: string;
  warnings: string[];
}

/**
 * Check prerequisites for shadcn/ui installation
 * @param projectDir - Project directory path
 * @returns Prerequisite check result
 */
export async function checkPrerequisites(
  projectDir: string = process.cwd()
): Promise<PrerequisiteResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Run detections in parallel
  const [frameworkResult, tailwindResult, shadcnResult] = await Promise.all([
    detectFramework(projectDir),
    detectTailwind(projectDir),
    detectShadcn(projectDir),
  ]);

  // Check framework
  if (!frameworkResult.framework) {
    errors.push('No framework detected. shadcn/ui requires Next.js, Vite, or Remix.');
  }

  // Check Tailwind
  if (!tailwindResult.installed) {
    errors.push('Tailwind CSS not detected. Please install Tailwind CSS first.');
  }

  // Check if shadcn is already installed
  if (shadcnResult.installed) {
    warnings.push('shadcn/ui is already installed. This will overwrite existing configuration.');
  }

  return {
    passed: errors.length === 0,
    framework: frameworkResult.framework,
    tailwind: tailwindResult.installed,
    errors,
    warnings,
  };
}

/**
 * Install shadcn/ui CLI
 * @param projectDir - Project directory path
 * @returns Installation result
 */
export async function installShadcn(
  projectDir: string = process.cwd()
): Promise<InstallationResult> {
  const warnings: string[] = [];

  try {
    // Execute shadcn init command
    await execa('npx', ['shadcn@latest', 'init'], {
      cwd: projectDir,
      stdio: 'inherit',
    });

    // Validate that components.json was created
    const componentsJsonPath = path.join(projectDir, 'components.json');
    const configCreated = await fs.pathExists(componentsJsonPath);

    if (!configCreated) {
      warnings.push('components.json was not created. The installation may have been cancelled.');
    }

    return {
      success: true,
      configCreated,
      configPath: configCreated ? componentsJsonPath : undefined,
      warnings,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Installation failed',
      warnings,
    };
  }
}
