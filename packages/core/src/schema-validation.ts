/**
 * @tekton/core - Schema Validation Utilities
 * Zod-based runtime validation for component schemas
 * [SPEC-COMPONENT-001-B] [TAG-004]
 */

import { z } from 'zod';
import type { ComponentSchema, PropDefinition, A11yRequirements } from './component-schemas.js';
import { ALL_COMPONENTS } from './component-schemas.js';

// ============================================================================
// Zod Schemas
// ============================================================================

/**
 * PropDefinition Zod Schema
 */
export const PropDefinitionSchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  type: z.string().min(1, 'Property type is required'),
  required: z.boolean(),
  description: z.string().min(1, 'Property description is required'),
  defaultValue: z.unknown().optional(),
  options: z.array(z.string()).optional(),
});

/**
 * A11yRequirements Zod Schema
 */
export const A11yRequirementsSchema = z.object({
  role: z.string().min(1, 'ARIA role is required'),
  wcag: z.string().includes('2.1', { message: 'WCAG 2.1 compliance required' }),
  ariaAttributes: z.array(z.string()).optional(),
  keyboard: z.array(z.string()).optional(),
  focus: z.string().optional(),
  screenReader: z.string().optional(),
});

/**
 * TokenBindings Zod Schema
 */
export const TokenBindingsSchema = z
  .record(z.string(), z.string())
  .refine(bindings => Object.keys(bindings).length >= 2, {
    message: 'At least 2 token bindings required per component',
  });

/**
 * ComponentSchema Zod Schema
 */
export const ComponentSchemaZod = z.object({
  type: z.string().min(1, 'Component type is required'),
  category: z.enum(['primitive', 'composed'], {
    errorMap: () => ({ message: 'Category must be "primitive" or "composed"' }),
  }),
  props: z.array(PropDefinitionSchema).min(1, 'At least one prop is required'),
  tokenBindings: TokenBindingsSchema,
  a11y: A11yRequirementsSchema,
  description: z.string().optional(),
});

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validation result type
 */
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

/**
 * Validate a single component schema
 */
export function validateComponentSchema(schema: ComponentSchema): ValidationResult {
  try {
    ComponentSchemaZod.parse(schema);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { valid: false, errors };
    }
    return { valid: false, errors: ['Unknown validation error'] };
  }
}

/**
 * Validate all component schemas
 */
export function validateAllSchemas(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  ALL_COMPONENTS.forEach(schema => {
    const result = validateComponentSchema(schema);
    if (!result.valid && result.errors) {
      errors.push(`${schema.type}: ${result.errors.join(', ')}`);
    }
  });

  // Check for duplicate component types
  const types = ALL_COMPONENTS.map(c => c.type);
  const duplicates = types.filter((type, index) => types.indexOf(type) !== index);
  if (duplicates.length > 0) {
    errors.push(`Duplicate component types found: ${duplicates.join(', ')}`);
  }

  // Check for expected component count
  if (ALL_COMPONENTS.length !== 20) {
    warnings.push(`Expected 20 components, found ${ALL_COMPONENTS.length}`);
  }

  const primitiveCount = ALL_COMPONENTS.filter(c => c.category === 'primitive').length;
  const composedCount = ALL_COMPONENTS.filter(c => c.category === 'composed').length;

  if (primitiveCount !== 10) {
    warnings.push(`Expected 10 primitive components, found ${primitiveCount}`);
  }
  if (composedCount !== 10) {
    warnings.push(`Expected 10 composed components, found ${composedCount}`);
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Validate prop definition
 */
export function validateProp(prop: PropDefinition): ValidationResult {
  try {
    PropDefinitionSchema.parse(prop);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { valid: false, errors };
    }
    return { valid: false, errors: ['Unknown validation error'] };
  }
}

/**
 * Validate accessibility requirements
 */
export function validateA11y(a11y: A11yRequirements): ValidationResult {
  try {
    A11yRequirementsSchema.parse(a11y);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { valid: false, errors };
    }
    return { valid: false, errors: ['Unknown validation error'] };
  }
}

/**
 * Validate token bindings format
 */
export function validateTokenBindings(bindings: Record<string, string>): ValidationResult {
  const warnings: string[] = [];

  try {
    TokenBindingsSchema.parse(bindings);

    // Check for template variable usage
    const hasTemplateVars = Object.values(bindings).some(value => /\{[a-zA-Z]+\}/.test(value));

    if (!hasTemplateVars) {
      warnings.push('Consider using template variables like {variant} or {size}');
    }

    // Check for token references
    const hasTokenReferences = Object.values(bindings).some(
      value =>
        value.includes('semantic.') || value.includes('atomic.') || value.includes('component.')
    );

    if (!hasTokenReferences) {
      warnings.push('Token bindings should reference semantic, atomic, or component tokens');
    }

    return {
      valid: true,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { valid: false, errors };
    }
    return { valid: false, errors: ['Unknown validation error'] };
  }
}

/**
 * Get component schema validation summary
 */
export function getValidationSummary(): {
  totalComponents: number;
  primitiveComponents: number;
  composedComponents: number;
  validSchemas: number;
  invalidSchemas: number;
  validationResults: Array<{
    type: string;
    valid: boolean;
    errors?: string[];
  }>;
} {
  const results = ALL_COMPONENTS.map(schema => ({
    type: schema.type,
    ...validateComponentSchema(schema),
  }));

  const validSchemas = results.filter(r => r.valid).length;
  const invalidSchemas = results.filter(r => !r.valid).length;

  return {
    totalComponents: ALL_COMPONENTS.length,
    primitiveComponents: ALL_COMPONENTS.filter(c => c.category === 'primitive').length,
    composedComponents: ALL_COMPONENTS.filter(c => c.category === 'composed').length,
    validSchemas,
    invalidSchemas,
    validationResults: results,
  };
}

/**
 * Assert component schema is valid (throws on invalid)
 */
export function assertValidSchema(schema: ComponentSchema): void {
  const result = validateComponentSchema(schema);
  if (!result.valid) {
    throw new Error(`Invalid component schema: ${result.errors?.join(', ')}`);
  }
}

/**
 * Assert all schemas are valid (throws on invalid)
 */
export function assertAllSchemasValid(): void {
  const result = validateAllSchemas();
  if (!result.valid) {
    throw new Error(`Schema validation failed: ${result.errors?.join(', ')}`);
  }
}
