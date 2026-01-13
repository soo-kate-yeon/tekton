import chalk from 'chalk';
import enquirer from 'enquirer';
const { prompt } = enquirer;
import {
  Environment,
  SkeletonPreset,
  ScreenIntent,
  INTENT_TO_COMPOUND_PATTERNS,
  environmentContractSchema,
  skeletonContractSchema,
  intentContractSchema,
} from '@tekton/contracts';
import { generateScreenFiles, checkDuplicateScreen } from '../generators/screen-generator.js';

/**
 * Create screen command options
 */
export interface CreateScreenOptions {
  name: string;
  interactive?: boolean;
  environment?: string;
  skeleton?: string;
  intent?: string;
  components?: string[];
  path?: string;
}

/**
 * Screen contract definition
 */
export interface ScreenContract {
  name: string;
  environment: string;
  skeleton: string;
  intent: string;
  components: string[];
}

/**
 * Create screen command result
 */
export interface CreateScreenResult {
  success: boolean;
  message?: string;
  screenName?: string;
  screenContract?: ScreenContract;
  suggestedComponents?: string[];
  files?: {
    page: string;
    layout: string;
    components: string;
  };
  error?: string;
}

/**
 * Available environment options
 */
const ENVIRONMENT_OPTIONS = Object.values(Environment);

/**
 * Available skeleton preset options
 */
const SKELETON_OPTIONS = Object.values(SkeletonPreset);

/**
 * Available screen intent options
 */
const INTENT_OPTIONS = Object.values(ScreenIntent);

/**
 * Validate screen name format
 */
function validateScreenName(name: string): string | true {
  if (!name || name.trim().length === 0) {
    return 'Screen name is required';
  }

  if (name.includes(' ')) {
    return 'Invalid screen name format: no spaces allowed';
  }

  if (!/^[A-Z]/.test(name)) {
    return 'Screen name must start with uppercase letter';
  }

  if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
    return 'Screen name must be PascalCase (letters and numbers only)';
  }

  return true;
}

/**
 * Validate environment value
 */
function validateEnvironment(env: string): boolean {
  return ENVIRONMENT_OPTIONS.includes(env as any);
}

/**
 * Validate skeleton value
 */
function validateSkeleton(skeleton: string): boolean {
  return SKELETON_OPTIONS.includes(skeleton as any);
}

/**
 * Validate intent value
 */
function validateIntent(intent: string): boolean {
  return INTENT_OPTIONS.includes(intent as any);
}

/**
 * Get suggested components based on intent
 */
function getSuggestedComponents(intent: string): string[] {
  const mapping = INTENT_TO_COMPOUND_PATTERNS[intent as keyof typeof INTENT_TO_COMPOUND_PATTERNS];
  return mapping ? mapping.primaryComponents : [];
}

/**
 * Create screen
 * @param options - Screen creation options
 * @returns Screen creation result
 */
export async function createScreen(options: CreateScreenOptions): Promise<CreateScreenResult> {
  try {
    // Validate screen name
    const nameValidation = validateScreenName(options.name);
    if (nameValidation !== true) {
      return {
        success: false,
        error: nameValidation,
      };
    }

    let environment = options.environment;
    let skeleton = options.skeleton;
    let intent = options.intent;
    let components = options.components || [];

    // Interactive mode - prompt for missing values
    if (options.interactive) {
      const answers = await prompt<{
        environment?: string;
        skeleton?: string;
        intent?: string;
        components?: string[];
      }>([
        ...(environment
          ? []
          : [
              {
                type: 'select',
                name: 'environment',
                message: 'Select target environment:',
                choices: ENVIRONMENT_OPTIONS,
                initial: 0,
              },
            ]),
        ...(skeleton
          ? []
          : [
              {
                type: 'select',
                name: 'skeleton',
                message: 'Select skeleton preset:',
                choices: SKELETON_OPTIONS,
                initial: 0,
              },
            ]),
        ...(intent
          ? []
          : [
              {
                type: 'select',
                name: 'intent',
                message: 'Select screen intent:',
                choices: INTENT_OPTIONS,
                initial: 0,
              },
            ]),
      ]);

      environment = environment || answers.environment;
      skeleton = skeleton || answers.skeleton;
      intent = intent || answers.intent;
    }

    // Validate provided values
    if (!environment || !validateEnvironment(environment)) {
      return {
        success: false,
        error: 'Invalid environment. Must be one of: ' + ENVIRONMENT_OPTIONS.join(', '),
      };
    }

    if (!skeleton || !validateSkeleton(skeleton)) {
      return {
        success: false,
        error: 'Invalid skeleton. Must be one of: ' + SKELETON_OPTIONS.join(', '),
      };
    }

    if (!intent || !validateIntent(intent)) {
      return {
        success: false,
        error: 'Invalid intent. Must be one of: ' + INTENT_OPTIONS.join(', '),
      };
    }

    // Get suggested components based on intent
    const suggestedComponents = getSuggestedComponents(intent);

    // Use provided components or suggested components
    if (components.length === 0) {
      components = suggestedComponents;
    }

    // Build screen contract
    const screenContract: ScreenContract = {
      name: options.name,
      environment,
      skeleton,
      intent,
      components,
    };

    // Validate contracts using Zod schemas
    const envValidation = environmentContractSchema.safeParse({
      environment,
      gridSystem: {
        columns: environment === 'mobile' ? 4 : 12,
        gutter: 24,
        margin: 24,
        breakpoint: { min: 0, max: Infinity },
      },
      layoutBehavior: {
        navigation: 'persistent-sidebar',
        cardLayout: 'grid',
        dataDensity: 'comfortable',
        interactionModel: 'hover-enabled',
      },
    });

    if (!envValidation.success) {
      return {
        success: false,
        error: 'Environment contract validation failed: ' + envValidation.error.message,
      };
    }

    const skelValidation = skeletonContractSchema.safeParse({
      preset: skeleton,
      header: skeleton !== 'full-screen',
      sidebar: skeleton.includes('sidebar'),
      footer: skeleton.includes('footer'),
      content: {
        type: 'main',
        flexible: true,
      },
    });

    if (!skelValidation.success) {
      return {
        success: false,
        error: 'Skeleton contract validation failed: ' + skelValidation.error.message,
      };
    }

    const intentValidation = intentContractSchema.safeParse({
      intent,
      primaryComponents: components,
      layoutPatterns: INTENT_TO_COMPOUND_PATTERNS[intent as keyof typeof INTENT_TO_COMPOUND_PATTERNS].layoutPatterns,
      actions: INTENT_TO_COMPOUND_PATTERNS[intent as keyof typeof INTENT_TO_COMPOUND_PATTERNS].actions,
    });

    if (!intentValidation.success) {
      return {
        success: false,
        error: 'Intent contract validation failed: ' + intentValidation.error.message,
      };
    }

    // Generate screen files if path is provided
    let files;
    if (options.path) {
      // Check for duplicate
      const isDuplicate = await checkDuplicateScreen(options.name, options.path);

      if (isDuplicate) {
        // In non-interactive mode, we need to handle duplicates
        // For now, we'll just report it but still return success for contract validation
        return {
          success: true,
          message: `Screen "${options.name}" contract created successfully (files not generated - duplicate detected)`,
          screenName: options.name,
          screenContract,
          suggestedComponents,
        };
      }

      const generationResult = await generateScreenFiles({
        name: options.name,
        environment,
        skeleton,
        intent,
        components,
        outputDir: options.path,
      });

      if (generationResult.success) {
        files = generationResult.files;
      }
    }

    return {
      success: true,
      message: `Screen "${options.name}" contract created successfully`,
      screenName: options.name,
      screenContract,
      suggestedComponents,
      files,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Screen creation failed',
    };
  }
}

/**
 * CLI command handler for create-screen
 * Prints creation results to console
 * @istanbul ignore next
 */
export async function createScreenCommand(
  name: string,
  options: Omit<CreateScreenOptions, 'name'> = {}
): Promise<void> {
  console.log(chalk.bold(`\nCreating screen: ${name}...\n`));

  const result = await createScreen({ name, ...options, interactive: !options.environment });

  if (!result.success) {
    console.error(chalk.red(`\nError: ${result.error}\n`));
    process.exit(1);
  }

  // Success message
  console.log(chalk.green(`✓ ${result.message}`));
  if (result.screenContract) {
    console.log(chalk.gray(`  Environment: ${result.screenContract.environment}`));
    console.log(chalk.gray(`  Skeleton: ${result.screenContract.skeleton}`));
    console.log(chalk.gray(`  Intent: ${result.screenContract.intent}`));
    console.log(chalk.gray(`  Components: ${result.screenContract.components.join(', ')}`));
  }
  console.log();
}
