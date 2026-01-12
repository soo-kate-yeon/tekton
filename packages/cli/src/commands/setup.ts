import chalk from 'chalk';
import { checkPrerequisites, installShadcn } from '../setup/shadcn-installer.js';

/**
 * Setup command result
 */
export interface SetupResult {
  success: boolean;
  message?: string;
  configPath?: string;
  errors?: string[];
  warnings?: string[];
  error?: string;
}

/**
 * Setup command options
 */
export interface SetupOptions {
  path?: string;
}

/**
 * Supported setup targets
 */
const SUPPORTED_TARGETS = ['shadcn'];

/**
 * Setup a tool in the project
 * @param target - Tool to setup (e.g., 'shadcn')
 * @param options - Setup options
 * @returns Setup result
 */
export async function setup(
  target: string,
  options: SetupOptions = {}
): Promise<SetupResult> {
  const projectDir = options.path || process.cwd();
  const normalizedTarget = target.toLowerCase();

  // Validate target
  if (!SUPPORTED_TARGETS.includes(normalizedTarget)) {
    return {
      success: false,
      error: `Unsupported target: ${target}. Currently supported: ${SUPPORTED_TARGETS.join(', ')}`,
    };
  }

  // Handle shadcn setup
  if (normalizedTarget === 'shadcn') {
    return await setupShadcn(projectDir);
  }

  return {
    success: false,
    error: 'Unknown target',
  };
}

/**
 * Setup shadcn/ui
 */
async function setupShadcn(projectDir: string): Promise<SetupResult> {
  try {
    // Check prerequisites
    const prereqResult = await checkPrerequisites(projectDir);

    if (!prereqResult.passed) {
      return {
        success: false,
        errors: prereqResult.errors,
        warnings: prereqResult.warnings,
      };
    }

    // Install shadcn
    const installResult = await installShadcn(projectDir);

    if (!installResult.success) {
      return {
        success: false,
        error: installResult.error,
        warnings: [...prereqResult.warnings, ...installResult.warnings],
      };
    }

    // Success
    return {
      success: true,
      message: 'shadcn/ui successfully installed',
      configPath: installResult.configPath,
      warnings: [...prereqResult.warnings, ...installResult.warnings],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Setup failed',
    };
  }
}

/**
 * CLI command handler for setup
 * Prints setup results to console
 * @istanbul ignore next
 */
export async function setupCommand(
  target: string,
  options: SetupOptions = {}
): Promise<void> {
  console.log(chalk.bold(`\nSetting up ${target}...\n`));

  const result = await setup(target, options);

  // Display warnings
  if (result.warnings && result.warnings.length > 0) {
    console.log(chalk.yellow('\nWarnings:'));
    result.warnings.forEach(warning => {
      console.log(chalk.yellow(`  ⚠ ${warning}`));
    });
    console.log();
  }

  // Handle errors
  if (!result.success) {
    if (result.errors && result.errors.length > 0) {
      console.error(chalk.red('\nErrors:'));
      result.errors.forEach(error => {
        console.error(chalk.red(`  ✗ ${error}`));
      });
    }
    if (result.error) {
      console.error(chalk.red(`\nError: ${result.error}`));
    }
    console.log();
    process.exit(1);
  }

  // Success message
  console.log(chalk.green(`✓ ${result.message}`));
  if (result.configPath) {
    console.log(chalk.gray(`  Config: ${result.configPath}`));
  }
  console.log();
}
