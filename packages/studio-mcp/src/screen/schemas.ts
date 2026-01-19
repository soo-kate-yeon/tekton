/**
 * Screen Tools Zod Schemas
 * Input validation schemas for screen-related MCP tools
 *
 * @module screen/schemas
 */

import { z } from "zod";

/**
 * Valid archetype names from the Tekton archetype system
 */
export const ArchetypeNameSchema = z.enum([
  "Professional",
  "Creative",
  "Minimal",
  "Bold",
  "Warm",
  "Cool",
  "High-Contrast",
]);

export type ArchetypeName = z.infer<typeof ArchetypeNameSchema>;

/**
 * Schema for linkFrom configuration
 * Used to inject navigation links into parent pages
 */
export const LinkFromSchema = z.object({
  page: z.string().min(1, "Page path is required"),
  label: z.string().min(1, "Link label is required"),
  description: z.string().optional(),
});

export type LinkFrom = z.infer<typeof LinkFromSchema>;

/**
 * Schema for screen.create tool input
 */
export const CreateScreenInputSchema = z.object({
  name: z.string().min(1, "Screen name is required"),
  intent: z.string().min(1, "Screen intent is required"),
  targetPath: z.string().min(1, "Target path is required"),
  linkFrom: LinkFromSchema.optional(),
  projectPath: z.string().optional(),
});

export type CreateScreenInput = z.infer<typeof CreateScreenInputSchema>;

/**
 * Schema for screen.addComponent tool input
 */
export const AddComponentInputSchema = z.object({
  screenName: z.string().min(1, "Screen name is required"),
  componentType: z.string().min(1, "Component type is required"),
  props: z.record(z.unknown()).optional(),
  projectPath: z.string().optional(),
});

export type AddComponentInput = z.infer<typeof AddComponentInputSchema>;

/**
 * Schema for screen.applyArchetype tool input
 */
export const ApplyArchetypeInputSchema = z.object({
  screenName: z.string().min(1, "Screen name is required"),
  componentName: ArchetypeNameSchema,
  projectPath: z.string().optional(),
});

export type ApplyArchetypeInput = z.infer<typeof ApplyArchetypeInputSchema>;

/**
 * Schema for screen.list tool input
 */
export const ListScreensInputSchema = z.object({
  projectPath: z.string().optional(),
});

export type ListScreensInput = z.infer<typeof ListScreensInputSchema>;

/**
 * Schema for screen.preview tool input
 */
export const PreviewScreenInputSchema = z.object({
  screenName: z.string().min(1, "Screen name is required"),
  projectPath: z.string().optional(),
});

export type PreviewScreenInput = z.infer<typeof PreviewScreenInputSchema>;

/**
 * Screen metadata returned by list operation
 */
export const ScreenMetadataSchema = z.object({
  name: z.string(),
  filePath: z.string(),
  routePath: z.string(),
  createdAt: z.string().optional(),
});

export type ScreenMetadata = z.infer<typeof ScreenMetadataSchema>;

/**
 * Response schema for screen.create
 */
export const CreateScreenResponseSchema = z.object({
  filePath: z.string(),
  routePath: z.string(),
  frameworkType: z.string(),
  linkInjected: z.boolean().optional(),
  warnings: z.array(z.string()).optional(),
});

export type CreateScreenResponse = z.infer<typeof CreateScreenResponseSchema>;

/**
 * Response schema for screen.addComponent
 */
export const AddComponentResponseSchema = z.object({
  componentAdded: z.boolean(),
  componentType: z.string(),
  screenPath: z.string(),
});

export type AddComponentResponse = z.infer<typeof AddComponentResponseSchema>;

/**
 * Response schema for screen.applyArchetype
 */
export const ApplyArchetypeResponseSchema = z.object({
  archetypeApplied: z.boolean(),
  componentName: ArchetypeNameSchema,
  screenPath: z.string(),
});

export type ApplyArchetypeResponse = z.infer<typeof ApplyArchetypeResponseSchema>;

/**
 * Response schema for screen.list
 */
export const ListScreensResponseSchema = z.object({
  screens: z.array(ScreenMetadataSchema),
  frameworkType: z.string(),
  projectPath: z.string(),
});

export type ListScreensResponse = z.infer<typeof ListScreensResponseSchema>;

/**
 * Response schema for screen.preview
 */
export const PreviewScreenResponseSchema = z.object({
  previewUrl: z.string(),
  screenName: z.string(),
  routePath: z.string(),
});

export type PreviewScreenResponse = z.infer<typeof PreviewScreenResponseSchema>;
