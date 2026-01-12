import chalk from 'chalk';
import enquirer from 'enquirer';
const { prompt } = enquirer;
import * as fs from 'fs-extra';
import * as path from 'path';
import { isValidHexColor, validateHexColor } from '../utils/validators.js';
import { generateTokensWrapper } from '../utils/token-wrapper.js';

/**
 * Generate command options
 */
export interface GenerateOptions {
  path?: string;
  primaryColor?: string;
  preset?: string;
  interactive?: boolean;
  force?: boolean;
}

/**
 * Generate command result
 */
export interface GenerateResult {
  success: boolean;
  message?: string;
  files?: {
    css: string;
    tailwind: string;
  };
  warnings?: string[];
  error?: string;
}

/**
 * Available presets
 */
const AVAILABLE_PRESETS = ['default', 'accessible', 'vibrant', 'pastel', 'dark'];

/**
 * Generate design tokens
 * @param options - Generation options
 * @returns Generation result
 */
export async function generate(options: GenerateOptions = {}): Promise<GenerateResult> {
  const projectDir = options.path || process.cwd();

  try {
    let primaryColor = options.primaryColor;
    let preset = options.preset || 'default';

    // Interactive mode
    if (options.interactive && !options.primaryColor) {
      const answers = await prompt<{ primaryColor: string; preset: string }>([
        {
          type: 'input',
          name: 'primaryColor',
          message: 'Enter your primary color (hex code):',
          initial: '#3b82f6',
          validate: (value: string) => {
            const error = validateHexColor(value);
            return error || true;
          },
        },
        {
          type: 'select',
          name: 'preset',
          message: 'Select a preset:',
          choices: AVAILABLE_PRESETS,
          initial: 0,
        },
      ]);

      primaryColor = answers.primaryColor;
      preset = answers.preset;
    }

    // Validate primary color
    if (!primaryColor || !isValidHexColor(primaryColor)) {
      return {
        success: false,
        error: 'Invalid hex color format. Please provide a valid hex color (e.g., #3b82f6)',
      };
    }

    // Generate tokens using @tekton/token-generator
    // Note: This is a simplified integration for M2
    // Full integration with Phase A token-generator will be completed in future iterations
    const tokenResult = await generateTokensWrapper({
      primaryColor,
      preset: preset as any,
    });

    // Prepare output directories
    const stylesDir = path.join(projectDir, 'src', 'styles');
    await fs.ensureDir(stylesDir);

    // Write CSS variables file
    const cssPath = path.join(stylesDir, 'tokens.css');
    await fs.writeFile(cssPath, tokenResult.cssVariables);

    // Write Tailwind config
    const tailwindPath = path.join(projectDir, 'tailwind.config.js');
    await fs.writeFile(tailwindPath, tokenResult.tailwindConfig);

    // Collect warnings
    const warnings: string[] = [];
    if (tokenResult.warnings && tokenResult.warnings.length > 0) {
      warnings.push(...tokenResult.warnings);
    }

    return {
      success: true,
      message: 'Design tokens generated successfully',
      files: {
        css: cssPath,
        tailwind: tailwindPath,
      },
      warnings,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Token generation failed',
    };
  }
}

/**
 * CLI command handler for generate
 * Prints generation results to console
 * @istanbul ignore next
 */
export async function generateCommand(options: GenerateOptions = {}): Promise<void> {
  console.log(chalk.bold('\nGenerating design tokens...\n'));

  const result = await generate({ ...options, interactive: true });

  if (!result.success) {
    console.error(chalk.red(`\nError: ${result.error}\n`));
    process.exit(1);
  }

  // Display warnings
  if (result.warnings && result.warnings.length > 0) {
    console.log(chalk.yellow('\nWarnings:'));
    result.warnings.forEach(warning => {
      console.log(chalk.yellow(`  ⚠ ${warning}`));
    });
    console.log();
  }

  // Success message
  console.log(chalk.green(`✓ ${result.message}`));
  if (result.files) {
    console.log(chalk.gray(`  CSS: ${result.files.css}`));
    console.log(chalk.gray(`  Tailwind: ${result.files.tailwind}`));
  }
  console.log();
}
