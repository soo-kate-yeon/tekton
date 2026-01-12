import chalk from 'chalk';
import { detectFramework, Framework } from '../detectors/framework.js';
import { detectTailwind } from '../detectors/tailwind.js';
import { detectShadcn } from '../detectors/shadcn.js';

/**
 * Detection result interface
 */
export interface DetectionResult {
  framework: string | null;
  tailwind: boolean;
  shadcn: boolean;
  message?: string;
  error?: string;
}

/**
 * Detect project stack (framework, Tailwind, shadcn)
 * @param projectDir - Directory path to check (defaults to current directory)
 * @returns Detection result with formatted message
 */
export async function detect(
  projectDir: string = process.cwd()
): Promise<DetectionResult> {
  try {
    // Run all detectors in parallel for performance
    const [frameworkResult, tailwindResult, shadcnResult] = await Promise.all([
      detectFramework(projectDir),
      detectTailwind(projectDir),
      detectShadcn(projectDir),
    ]);

    const result: DetectionResult = {
      framework: frameworkResult.framework,
      tailwind: tailwindResult.installed,
      shadcn: shadcnResult.installed,
    };

    // Generate formatted message
    result.message = formatDetectionMessage(
      frameworkResult.framework,
      frameworkResult.version,
      tailwindResult.installed,
      tailwindResult.version,
      shadcnResult.installed,
      shadcnResult.config?.style
    );

    return result;
  } catch (error) {
    // Handle errors gracefully
    console.error('Error during detection:', error);
    return {
      framework: null,
      tailwind: false,
      shadcn: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Format detection results into a user-friendly message
 */
function formatDetectionMessage(
  framework: Framework | null,
  frameworkVersion: string | undefined,
  tailwind: boolean,
  tailwindVersion: string | undefined,
  shadcn: boolean,
  shadcnStyle: string | undefined
): string {
  const parts: string[] = [];

  // Framework detection
  if (framework) {
    let frameworkText = `${chalk.green('✓')} Framework: ${chalk.bold(framework)}`;
    if (frameworkVersion) {
      frameworkText += ` ${chalk.gray(`(${frameworkVersion})`)}`;
    }
    parts.push(frameworkText);
  } else {
    parts.push(`${chalk.yellow('○')} Framework: ${chalk.gray('Not detected')}`);
  }

  // Tailwind detection
  if (tailwind) {
    let tailwindText = `${chalk.green('✓')} Tailwind CSS: ${chalk.bold('Installed')}`;
    if (tailwindVersion) {
      tailwindText += ` ${chalk.gray(`(${tailwindVersion})`)}`;
    }
    parts.push(tailwindText);
  } else {
    parts.push(`${chalk.yellow('○')} Tailwind CSS: ${chalk.gray('Not installed')}`);
  }

  // shadcn detection
  if (shadcn) {
    let shadcnText = `${chalk.green('✓')} shadcn/ui: ${chalk.bold('Installed')}`;
    if (shadcnStyle) {
      shadcnText += ` ${chalk.gray(`(${shadcnStyle} style)`)}`;
    }
    parts.push(shadcnText);
  } else {
    parts.push(`${chalk.yellow('○')} shadcn/ui: ${chalk.gray('Not installed')}`);
  }

  return parts.join('\n');
}

/**
 * CLI command handler for detect
 * Prints detection results to console
 * @istanbul ignore next
 */
export async function detectCommand(options: { path?: string } = {}): Promise<void> {
  const projectDir = options.path || process.cwd();

  console.log(chalk.bold('\nDetecting project stack...\n'));

  const result = await detect(projectDir);

  if (result.error) {
    console.error(chalk.red(`\nError: ${result.error}\n`));
    process.exit(1);
  }

  console.log(result.message);
  console.log(); // Empty line for spacing
}
