import { z } from 'zod';

export const ThemeConfigSchema = z.record(z.string(), z.unknown());

export const ThemeSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  description: z.string().nullable(),
  config: ThemeConfigSchema,
  tags: z.array(z.string()),
  one_line_definition: z.string().nullable(),
  reference_style: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ThemeListSchema = z.object({
  items: z.array(ThemeSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export const ThemeCreateSchema = z.object({
  name: z.string().min(1).max(255),
  category: z.string().min(1).max(100),
  description: z.string().nullable().optional(),
  config: ThemeConfigSchema.optional().default({}),
  tags: z.array(z.string()).optional().default([]),
});

export const ThemeUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  category: z.string().min(1).max(100).optional(),
  description: z.string().nullable().optional(),
  config: ThemeConfigSchema.optional(),
  tags: z.array(z.string()).optional(),
  is_active: z.boolean().optional(),
});

export type Theme = z.infer<typeof ThemeSchema>;
export type ThemeList = z.infer<typeof ThemeListSchema>;
export type ThemeCreate = z.infer<typeof ThemeCreateSchema>;
export type ThemeUpdate = z.infer<typeof ThemeUpdateSchema>;
export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;

export interface ThemeListParams {
  skip?: number;
  limit?: number;
  category?: string;
  tags?: string;
}
