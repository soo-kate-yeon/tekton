import { z } from 'zod';

export const PresetConfigSchema = z.record(z.string(), z.unknown());

export const PresetSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  description: z.string().nullable(),
  config: PresetConfigSchema,
  tags: z.array(z.string()),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const PresetListSchema = z.object({
  items: z.array(PresetSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export const PresetCreateSchema = z.object({
  name: z.string().min(1).max(255),
  category: z.string().min(1).max(100),
  description: z.string().nullable().optional(),
  config: PresetConfigSchema.optional().default({}),
  tags: z.array(z.string()).optional().default([]),
});

export const PresetUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  category: z.string().min(1).max(100).optional(),
  description: z.string().nullable().optional(),
  config: PresetConfigSchema.optional(),
  tags: z.array(z.string()).optional(),
  is_active: z.boolean().optional(),
});

export type Preset = z.infer<typeof PresetSchema>;
export type PresetList = z.infer<typeof PresetListSchema>;
export type PresetCreate = z.infer<typeof PresetCreateSchema>;
export type PresetUpdate = z.infer<typeof PresetUpdateSchema>;
export type PresetConfig = z.infer<typeof PresetConfigSchema>;

export interface PresetListParams {
  skip?: number;
  limit?: number;
  category?: string;
  tags?: string;
}
