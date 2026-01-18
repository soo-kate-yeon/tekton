/**
 * Project Tools Zod Schemas
 * Input validation schemas for project-related MCP tools
 *
 * @module project/schemas
 */

import { z } from "zod";

/**
 * Schema for project.detectStructure tool input
 */
export const DetectStructureInputSchema = z.object({
  projectPath: z.string().min(1, "Project path is required"),
});

export type DetectStructureInput = z.infer<typeof DetectStructureInputSchema>;

/**
 * Schema for project.getActivePreset tool input
 * No required parameters - uses implicit project context
 */
export const GetActivePresetInputSchema = z.object({
  projectPath: z.string().optional(),
});

export type GetActivePresetInput = z.infer<typeof GetActivePresetInputSchema>;

/**
 * Schema for project.setActivePreset tool input
 */
export const SetActivePresetInputSchema = z.object({
  presetId: z.number().int().positive("Preset ID must be a positive integer"),
  projectPath: z.string().optional(),
});

export type SetActivePresetInput = z.infer<typeof SetActivePresetInputSchema>;

/**
 * Framework types supported by the project detector
 */
export const FrameworkTypeSchema = z.enum([
  "next-app",
  "next-pages",
  "vite",
  "unknown",
]);

export type FrameworkType = z.infer<typeof FrameworkTypeSchema>;

/**
 * Project structure response schema
 */
export const ProjectStructureSchema = z.object({
  frameworkType: FrameworkTypeSchema,
  rootPath: z.string(),
  pagesDirectory: z.string().nullable(),
  appDirectory: z.string().nullable(),
  srcDirectory: z.string().nullable(),
  configFiles: z.array(z.string()),
});

export type ProjectStructure = z.infer<typeof ProjectStructureSchema>;

/**
 * Active preset response schema
 */
export const ActivePresetSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string().optional(),
  style_archetype: z.string().optional(),
}).nullable();

export type ActivePreset = z.infer<typeof ActivePresetSchema>;
