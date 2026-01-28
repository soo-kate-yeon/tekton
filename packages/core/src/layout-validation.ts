/**
 * @tekton/core - Layout Token Validation
 * Zod-based runtime validation for 4-layer layout token architecture
 * [SPEC-LAYOUT-001] [PHASE-2]
 */

import { z } from 'zod';
import type { TokenReference } from './token-resolver.js';
import type {
  ResponsiveConfig,
  ShellToken,
  PageLayoutToken,
  SectionPatternToken,
} from './layout-tokens/types.js';

// ============================================================================
// Zod Schema Definitions (Schema-First Pattern)
// ============================================================================

/**
 * Token Reference Schema
 * Validates token reference format: "atomic.spacing.16" or "semantic.color.primary"
 */
export const TokenReferenceSchema = z.string().regex(/^[a-z]+\.[a-z-]+(\.[a-z0-9-]+)*$/, {
  message: 'Token reference format invalid (e.g., atomic.spacing.16)',
});

/**
 * Responsive Token Schema
 * Validates breakpoint definitions
 */
export const ResponsiveTokenSchema = z.object({
  id: z.string().min(1, 'Breakpoint ID required'),
  minWidth: z.number().positive('Minimum width must be positive'),
  maxWidth: z.number().positive('Maximum width must be positive').optional(),
  description: z.string().min(1, 'Breakpoint description required'),
});

/**
 * Generic Responsive Configuration Schema
 * Validates responsive config with breakpoint overrides
 *
 * Note: Uses z.any() for breakpoint overrides since they are Partial<T> and flexible
 */
export function ResponsiveConfigSchema<T extends z.ZodTypeAny>(
  configSchema: T
): z.ZodType<ResponsiveConfig<z.infer<T>>> {
  return z.object({
    default: configSchema,
    sm: z.any().optional(),
    md: z.any().optional(),
    lg: z.any().optional(),
    xl: z.any().optional(),
    '2xl': z.any().optional(),
  }) as z.ZodType<ResponsiveConfig<z.infer<T>>>;
}

// ============================================================================
// Shell Token Schemas
// ============================================================================

/**
 * Shell Region Position Schema
 */
export const ShellRegionPositionSchema = z.enum(['top', 'left', 'right', 'bottom', 'center'], {
  errorMap: () => ({ message: 'Invalid region position' }),
});

/**
 * Shell Region Schema
 * Validates shell region configuration
 */
export const ShellRegionSchema = z.object({
  name: z.string().min(1, 'Region name required'),
  position: ShellRegionPositionSchema,
  size: TokenReferenceSchema,
  collapsible: z.boolean().optional(),
  defaultCollapsed: z.boolean().optional(),
});

/**
 * Shell Config Schema
 * Flexible schema for shell-level settings
 */
export const ShellConfigSchema = z.record(z.unknown());

/**
 * Shell Token Schema
 * Validates complete shell token structure
 */
export const ShellTokenSchema = z.object({
  id: z.string().min(1, 'Shell ID required'),
  description: z.string().min(1, 'Shell description required'),
  platform: z.enum(['web', 'mobile', 'desktop'], {
    errorMap: () => ({ message: 'Platform must be web, mobile, or desktop' }),
  }),
  regions: z.array(ShellRegionSchema).min(1, 'At least one region required'),
  responsive: ResponsiveConfigSchema(ShellConfigSchema),
  tokenBindings: z.record(z.string()).refine(bindings => Object.keys(bindings).length >= 1, {
    message: 'At least 1 token binding required',
  }),
});

// ============================================================================
// Page Layout Token Schemas
// ============================================================================

/**
 * Page Purpose Schema
 */
export const PagePurposeSchema = z.enum(
  ['job', 'resource', 'dashboard', 'settings', 'detail', 'empty', 'wizard', 'onboarding'],
  {
    errorMap: () => ({ message: 'Invalid page purpose' }),
  }
);

/**
 * Section Slot Schema
 * Validates section slot configuration
 */
export const SectionSlotSchema = z.object({
  name: z.string().min(1, 'Slot name required'),
  pattern: z.string().min(1, 'Pattern reference required'),
  required: z.boolean(),
  allowedComponents: z.array(z.string()).optional(),
});

/**
 * Page Config Schema
 * Flexible schema for page-level settings
 */
export const PageConfigSchema = z.record(z.unknown());

/**
 * Page Layout Token Schema
 * Validates complete page layout structure
 */
export const PageLayoutTokenSchema = z.object({
  id: z.string().min(1, 'Page ID required'),
  description: z.string().min(1, 'Page description required'),
  purpose: PagePurposeSchema,
  sections: z.array(SectionSlotSchema).min(1, 'At least one section required'),
  responsive: ResponsiveConfigSchema(PageConfigSchema),
  tokenBindings: z.record(z.string()).refine(bindings => Object.keys(bindings).length >= 1, {
    message: 'At least 1 token binding required',
  }),
});

// ============================================================================
// Section Pattern Token Schemas
// ============================================================================

/**
 * Section Type Schema
 */
export const SectionTypeSchema = z.enum(['grid', 'flex', 'split', 'stack', 'container'], {
  errorMap: () => ({ message: 'Invalid section type' }),
});

/**
 * Section CSS Schema
 * Validates section CSS properties
 */
export const SectionCSSSchema = z.object({
  display: z.enum(['grid', 'flex'], {
    errorMap: () => ({ message: 'Display must be grid or flex' }),
  }),
  gridTemplateColumns: z.string().optional(),
  gridTemplateRows: z.string().optional(),
  gap: TokenReferenceSchema.optional(),
  flexDirection: z.enum(['row', 'column']).optional(),
  alignItems: z.string().optional(),
  justifyContent: z.string().optional(),
  maxWidth: TokenReferenceSchema.optional(),
  padding: TokenReferenceSchema.optional(),
});

/**
 * Section Pattern Token Schema
 * Validates complete section pattern structure
 */
export const SectionPatternTokenSchema = z.object({
  id: z.string().min(1, 'Section ID required'),
  type: SectionTypeSchema,
  description: z.string().min(1, 'Section description required'),
  css: SectionCSSSchema,
  responsive: ResponsiveConfigSchema(SectionCSSSchema),
  tokenBindings: z.record(z.string()).refine(bindings => Object.keys(bindings).length >= 1, {
    message: 'At least 1 token binding required',
  }),
});

// ============================================================================
// Validation Functions (Strict - for Application Code)
// ============================================================================

/**
 * Validation result with detailed error information
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;

  /** Error messages if validation failed (undefined if valid) */
  errors?: string[];
}

/**
 * Validate Shell Token (strict validation for application code)
 *
 * @param data - Unknown data to validate
 * @returns Validated ShellToken
 * @throws Error if validation fails
 *
 * @example
 * ```typescript
 * const shell = validateShellToken(data);
 * ```
 */
export function validateShellToken(data: unknown): ShellToken {
  const result = ShellTokenSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `Shell token validation failed: ${JSON.stringify(result.error.errors.map(e => ({ path: e.path.join('.'), message: e.message })))}`
    );
  }
  return result.data as ShellToken;
}

/**
 * Validate Page Layout Token (strict validation for application code)
 *
 * @param data - Unknown data to validate
 * @returns Validated PageLayoutToken
 * @throws Error if validation fails
 *
 * @example
 * ```typescript
 * const page = validatePageLayoutToken(data);
 * ```
 */
export function validatePageLayoutToken(data: unknown): PageLayoutToken {
  const result = PageLayoutTokenSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `Page layout token validation failed: ${JSON.stringify(result.error.errors.map(e => ({ path: e.path.join('.'), message: e.message })))}`
    );
  }
  return result.data as PageLayoutToken;
}

/**
 * Validate Section Pattern Token (strict validation for application code)
 *
 * @param data - Unknown data to validate
 * @returns Validated SectionPatternToken
 * @throws Error if validation fails
 *
 * @example
 * ```typescript
 * const section = validateSectionPatternToken(data);
 * ```
 */
export function validateSectionPatternToken(data: unknown): SectionPatternToken {
  const result = SectionPatternTokenSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `Section pattern token validation failed: ${JSON.stringify(result.error.errors.map(e => ({ path: e.path.join('.'), message: e.message })))}`
    );
  }
  return result.data as SectionPatternToken;
}

/**
 * Validate Token Reference format
 *
 * @param data - Unknown data to validate
 * @returns Validated TokenReference
 * @throws Error if validation fails
 *
 * @example
 * ```typescript
 * const ref = validateTokenReference("atomic.spacing.16");
 * ```
 */
export function validateTokenReference(data: unknown): TokenReference {
  const result = TokenReferenceSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `Token reference validation failed: ${JSON.stringify(result.error.errors.map(e => ({ path: e.path.join('.'), message: e.message })))}`
    );
  }
  return result.data;
}

// ============================================================================
// LLM-Friendly Validation (Lenient - for LLM Input)
// ============================================================================

/**
 * LLM Shell Input Schema (lenient - only required fields)
 * Allows LLMs to provide minimal input
 */
export const LLMShellInputSchema = z.object({
  id: z.string().min(1, 'Shell ID required'),
  platform: z.enum(['web', 'mobile', 'desktop']),
  regions: z.array(ShellRegionSchema).min(1, 'At least one region required'),
});

/**
 * LLM Page Input Schema (lenient - only required fields)
 */
export const LLMPageInputSchema = z.object({
  id: z.string().min(1, 'Page ID required'),
  purpose: PagePurposeSchema,
  sections: z.array(SectionSlotSchema).min(1, 'At least one section required'),
});

/**
 * LLM Section Input Schema (lenient - only required fields)
 */
export const LLMSectionInputSchema = z.object({
  id: z.string().min(1, 'Section ID required'),
  type: SectionTypeSchema,
  css: SectionCSSSchema,
});

/**
 * Validate LLM Shell Input (lenient validation for LLM-generated data)
 *
 * @param data - Unknown data from LLM
 * @returns Partial ShellToken with only required fields
 * @throws Error if validation fails with helpful messages
 *
 * @example
 * ```typescript
 * const partialShell = validateLLMShellInput(llmData);
 * ```
 */
export function validateLLMShellInput(data: unknown): Partial<ShellToken> {
  const result = LLMShellInputSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map(e => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    throw new Error(
      `LLM shell input validation failed. Please provide: id (string), platform (web/mobile/desktop), regions (array). Errors: ${JSON.stringify(errors)}`
    );
  }
  return result.data;
}

/**
 * Validate LLM Page Input (lenient validation for LLM-generated data)
 *
 * @param data - Unknown data from LLM
 * @returns Partial PageLayoutToken with only required fields
 * @throws Error if validation fails with helpful messages
 *
 * @example
 * ```typescript
 * const partialPage = validateLLMPageInput(llmData);
 * ```
 */
export function validateLLMPageInput(data: unknown): Partial<PageLayoutToken> {
  const result = LLMPageInputSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map(e => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    throw new Error(
      `LLM page input validation failed. Please provide: id (string), purpose (job/resource/dashboard/etc), sections (array). Errors: ${JSON.stringify(errors)}`
    );
  }
  return result.data;
}

/**
 * Validate LLM Section Input (lenient validation for LLM-generated data)
 *
 * @param data - Unknown data from LLM
 * @returns Partial SectionPatternToken with only required fields
 * @throws Error if validation fails with helpful messages
 *
 * @example
 * ```typescript
 * const partialSection = validateLLMSectionInput(llmData);
 * ```
 */
export function validateLLMSectionInput(data: unknown): Partial<SectionPatternToken> {
  const result = LLMSectionInputSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map(e => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    throw new Error(
      `LLM section input validation failed. Please provide: id (string), type (grid/flex/split/stack/container), css (object). Errors: ${JSON.stringify(errors)}`
    );
  }
  return result.data;
}

// ============================================================================
// Circular Reference Detection
// ============================================================================

/**
 * Detect circular references in token hierarchy
 *
 * Checks if a token references itself directly or indirectly.
 * A circular reference occurs when token.id appears in any of its own token references
 * (excluding the id field itself).
 *
 * @param token - Shell, Page, or Section token to check
 * @returns true if no circular references found, false otherwise
 *
 * @example
 * ```typescript
 * const hasNoCircularRefs = detectCircularRefs(shellToken);
 * if (!hasNoCircularRefs) {
 *   console.error('Circular reference detected!');
 * }
 * ```
 */
export function detectCircularRefs(
  token: ShellToken | PageLayoutToken | SectionPatternToken
): boolean {
  /**
   * Extract all token references from an object recursively
   * Excludes the 'id' field to avoid false positives
   */
  function extractTokenReferences(obj: unknown, excludeIdField = true): string[] {
    const refs: string[] = [];

    if (typeof obj === 'string' && /^[a-z]+\.[a-z-]+(\.[a-z0-9-]+)*$/.test(obj)) {
      refs.push(obj);
    } else if (typeof obj === 'object' && obj !== null) {
      const entries = Object.entries(obj);
      for (const [key, value] of entries) {
        // Skip 'id' field at the root level to avoid false positives
        if (excludeIdField && key === 'id') {
          continue;
        }
        refs.push(...extractTokenReferences(value, false));
      }
    }

    return refs;
  }

  // Extract all token references from the token (excluding the id field itself)
  const refs = extractTokenReferences(token);

  // Check if any reference matches the token's own ID
  // This would indicate a direct circular reference
  for (const ref of refs) {
    if (ref === token.id || ref.startsWith(`${token.id}.`)) {
      return false; // Circular reference detected
    }
  }

  return true; // No circular references
}

// ============================================================================
// Layout Hierarchy Validation
// ============================================================================

/**
 * Token collection for layout hierarchy validation
 */
export interface LayoutTokenCollection {
  shells: ShellToken[];
  pages: PageLayoutToken[];
  sections: SectionPatternToken[];
}

/**
 * Validate complete layout token hierarchy
 *
 * Checks:
 * - All tokens pass schema validation
 * - No circular references exist
 * - All token references point to valid tokens
 *
 * @param tokens - Collection of all layout tokens
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const result = validateLayoutHierarchy({ shells, pages, sections });
 * if (!result.valid) {
 *   console.error('Hierarchy validation failed:', result.errors);
 * }
 * ```
 */
export function validateLayoutHierarchy(tokens: LayoutTokenCollection): ValidationResult {
  const errors: string[] = [];

  // Step 1: Validate all tokens pass schema validation
  try {
    tokens.shells.forEach(shell => validateShellToken(shell));
    tokens.pages.forEach(page => validatePageLayoutToken(page));
    tokens.sections.forEach(section => validateSectionPatternToken(section));
  } catch (error) {
    errors.push(
      `Schema validation failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  // Step 2: Check for circular references
  const allTokens = [...tokens.shells, ...tokens.pages, ...tokens.sections];
  for (const token of allTokens) {
    if (!detectCircularRefs(token)) {
      errors.push(`Circular reference detected in token: ${token.id}`);
    }
  }

  // Step 3: Validate token references point to valid tokens
  // Check page section references
  for (const page of tokens.pages) {
    for (const section of page.sections) {
      const sectionExists = tokens.sections.some(s => s.id === section.pattern);
      if (!sectionExists) {
        errors.push(
          `Page "${page.id}" references non-existent section pattern: ${section.pattern}`
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Safe validation with result (does not throw)
 *
 * @param data - Data to validate
 * @param schema - Zod schema to use
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const result = safeValidate(data, ShellTokenSchema);
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export function safeValidate(data: unknown, schema: z.ZodTypeAny): ValidationResult {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      valid: false,
      errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
    };
  }

  return { valid: true };
}
