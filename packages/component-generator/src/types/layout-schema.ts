/**
 * Layout Schema Types and Validation
 * SPEC-LAYOUT-001 - TASK-004
 *
 * Defines BlueprintLayout interface and Zod schema for validation.
 */

import { z } from 'zod';

/**
 * Valid container behavior values
 */
export const containerValues = ['fluid', 'fixed', 'none'] as const;

/**
 * Valid max-width preset values (Tailwind CSS)
 */
export const maxWidthValues = [
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  'full',
  'prose',
] as const;

/**
 * Valid breakpoint keys for grid configuration
 */
export const gridBreakpointKeys = [
  'default',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
] as const;

/**
 * Maximum value for Tailwind spacing scale
 */
const TAILWIND_MAX_SPACING = 96;

/**
 * Grid columns constraint (1-12)
 */
const gridColumnsSchema = z
  .number()
  .int()
  .min(1, 'Columns must be at least 1')
  .max(12, 'Columns must be at most 12');

/**
 * Tailwind spacing value constraint (0-96)
 */
const spacingSchema = z
  .number()
  .min(0, 'Value must be non-negative')
  .max(TAILWIND_MAX_SPACING, `Value must be at most ${TAILWIND_MAX_SPACING}`);

/**
 * Gap object schema for x/y configuration
 */
const gapObjectSchema = z.object({
  x: spacingSchema.optional(),
  y: spacingSchema.optional(),
});

/**
 * Grid configuration schema per breakpoint
 */
const gridConfigSchema = z.object({
  default: gridColumnsSchema.optional(),
  sm: gridColumnsSchema.optional(),
  md: gridColumnsSchema.optional(),
  lg: gridColumnsSchema.optional(),
  xl: gridColumnsSchema.optional(),
  '2xl': gridColumnsSchema.optional(),
});

/**
 * Zod schema for BlueprintLayout validation
 *
 * All fields are optional to support partial configuration and backward compatibility.
 */
export const blueprintLayoutSchema = z.object({
  /**
   * Container behavior
   * - fluid: Full width with responsive padding
   * - fixed: Constrained width with max-width
   * - none: No container wrapper
   */
  container: z.enum(containerValues).optional(),

  /**
   * Maximum width preset (Tailwind CSS)
   */
  maxWidth: z.enum(maxWidthValues).optional(),

  /**
   * Horizontal padding (Tailwind spacing scale 0-96)
   */
  padding: spacingSchema.optional(),

  /**
   * Grid columns override per breakpoint
   */
  grid: gridConfigSchema.optional(),

  /**
   * Gap between grid items
   * Can be a number (uniform gap) or object with x/y values
   */
  gap: z.union([spacingSchema, gapObjectSchema]).optional(),
});

/**
 * BlueprintLayout type inferred from Zod schema
 */
export type BlueprintLayout = z.infer<typeof blueprintLayoutSchema>;

/**
 * Container type
 */
export type ContainerType = (typeof containerValues)[number];

/**
 * MaxWidth preset type
 */
export type MaxWidthPreset = (typeof maxWidthValues)[number];

/**
 * Grid breakpoint key type
 */
export type GridBreakpointKey = (typeof gridBreakpointKeys)[number];

/**
 * Grid configuration type
 */
export type GridConfig = z.infer<typeof gridConfigSchema>;

/**
 * Gap configuration type
 */
export type GapConfig = number | { x?: number; y?: number };
