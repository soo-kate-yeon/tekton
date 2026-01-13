import { z } from "zod";

/**
 * Brand Axis Schema
 * Validates individual axis values to be between 0 and 1 (inclusive)
 */
export const BrandAxisSchema = z
  .number()
  .min(0, "Axis value must be at least 0")
  .max(1, "Axis value must be at most 1");

/**
 * Brand Axes Schema
 * Defines the five core brand personality axes
 */
export const BrandAxesSchema = z.object({
  density: BrandAxisSchema,
  warmth: BrandAxisSchema,
  playfulness: BrandAxisSchema,
  sophistication: BrandAxisSchema,
  energy: BrandAxisSchema,
});

/**
 * Semantic version regex pattern (MAJOR.MINOR.PATCH)
 */
const SEMVER_REGEX = /^\d+\.\d+\.\d+$/;

/**
 * Brand DNA Schema
 * Complete validation schema for Brand DNA objects
 */
export const BrandDNASchema = z.object({
  id: z.string().min(1, "ID is required").trim(),
  name: z.string().min(1, "Name is required").trim(),
  description: z.string().optional(),
  axes: BrandAxesSchema,
  version: z
    .string()
    .regex(
      SEMVER_REGEX,
      "Version must follow semantic versioning (e.g., 1.0.0)",
    ),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

/**
 * TypeScript types inferred from Zod schemas
 */
export type BrandAxis = z.infer<typeof BrandAxisSchema>;
export type BrandAxes = z.infer<typeof BrandAxesSchema>;
export type BrandDNA = z.infer<typeof BrandDNASchema>;
