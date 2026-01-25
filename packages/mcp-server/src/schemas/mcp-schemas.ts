/**
 * MCP Tool Input/Output Schemas with Zod validation
 * SPEC-MCP-002: U-002 Input Schema Validation
 */

import { z } from 'zod';

// ============================================================================
// Generate Blueprint Tool Schemas
// ============================================================================

/**
 * Layout types from @tekton/core LAYOUTS
 */
export const LayoutTypeSchema = z.enum([
  'single-column',
  'two-column',
  'sidebar-left',
  'sidebar-right',
  'dashboard',
  'landing'
]);

/**
 * Theme ID validation - alphanumeric with hyphens only (security: prevent path traversal)
 * SPEC: UW-002 No Theme ID Injection
 */
export const ThemeIdSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, 'Theme ID must contain only lowercase letters, numbers, and hyphens');

/**
 * Generate Blueprint Input Schema
 * SPEC: E-001 Blueprint Generation Request
 */
export const GenerateBlueprintInputSchema = z.object({
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  layout: LayoutTypeSchema,
  themeId: ThemeIdSchema,
  componentHints: z.array(z.string()).optional()
});

export type GenerateBlueprintInput = z.infer<typeof GenerateBlueprintInputSchema>;

/**
 * Generate Blueprint Output Schema
 */
export const GenerateBlueprintOutputSchema = z.object({
  success: z.boolean(),
  blueprint: z.optional(
    z.object({
      id: z.string(),
      name: z.string(),
      themeId: z.string(),
      layout: LayoutTypeSchema,
      components: z.array(z.any()), // ComponentNode[] from @tekton/core
      timestamp: z.number()
    })
  ),
  previewUrl: z.string().optional(),
  error: z.string().optional()
});

export type GenerateBlueprintOutput = z.infer<typeof GenerateBlueprintOutputSchema>;

// ============================================================================
// Preview Theme Tool Schemas
// ============================================================================

/**
 * Preview Theme Input Schema
 * SPEC: E-002 Theme Preview Request
 */
export const PreviewThemeInputSchema = z.object({
  themeId: ThemeIdSchema
});

export type PreviewThemeInput = z.infer<typeof PreviewThemeInputSchema>;

/**
 * Preview Theme Output Schema
 */
export const PreviewThemeOutputSchema = z.object({
  success: z.boolean(),
  theme: z.optional(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      cssVariables: z.record(z.string(), z.string())
    })
  ),
  previewUrl: z.string().optional(),
  error: z.string().optional()
});

export type PreviewThemeOutput = z.infer<typeof PreviewThemeOutputSchema>;

// ============================================================================
// Export Screen Tool Schemas
// ============================================================================

/**
 * Export format types
 * SPEC: S-004 Export Format Compatibility
 */
export const ExportFormatSchema = z.enum(['jsx', 'tsx', 'vue']);

export type ExportFormat = z.infer<typeof ExportFormatSchema>;

/**
 * Export Screen Input Schema
 * SPEC: E-003 Screen Export Request
 */
export const ExportScreenInputSchema = z.object({
  blueprintId: z.string(),
  format: ExportFormatSchema,
  outputPath: z.string().optional()
});

export type ExportScreenInput = z.infer<typeof ExportScreenInputSchema>;

/**
 * Export Screen Output Schema
 */
export const ExportScreenOutputSchema = z.object({
  success: z.boolean(),
  code: z.string().optional(),
  filePath: z.string().optional(),
  error: z.string().optional()
});

export type ExportScreenOutput = z.infer<typeof ExportScreenOutputSchema>;

// ============================================================================
// Common Error Response Schema
// ============================================================================

/**
 * Standardized error response format
 * SPEC: U-004 Error Response Consistency
 */
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string()
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
