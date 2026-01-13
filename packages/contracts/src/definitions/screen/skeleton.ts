import { z } from 'zod';

/**
 * Skeleton preset enum representing common screen layout structures.
 *
 * @remarks
 * Each preset defines a specific combination of header, sidebar, footer,
 * and content area configurations optimized for different screen patterns.
 */
export const SkeletonPreset = {
  FullScreen: 'full-screen',
  WithHeader: 'with-header',
  WithSidebar: 'with-sidebar',
  WithHeaderSidebar: 'with-header-sidebar',
  WithHeaderFooter: 'with-header-footer',
  Dashboard: 'dashboard',
} as const;

export type SkeletonPreset = (typeof SkeletonPreset)[keyof typeof SkeletonPreset];

/**
 * Content area configuration.
 *
 * @property type - Content area type (e.g., 'main', 'dashboard')
 * @property flexible - Whether the content area can grow/shrink
 */
export interface ContentArea {
  type: string;
  flexible: boolean;
  [key: string]: unknown; // Allow additional optional properties
}

/**
 * Skeleton contract defining the screen layout structure.
 *
 * @property preset - The skeleton preset type
 * @property header - Whether the layout includes a header
 * @property sidebar - Whether the layout includes a sidebar
 * @property footer - Whether the layout includes a footer
 * @property content - Content area configuration
 */
export interface SkeletonContract {
  preset: SkeletonPreset;
  header: boolean;
  sidebar: boolean;
  footer: boolean;
  content: ContentArea;
}

/**
 * Zod schema for content area validation.
 */
const contentAreaSchema = z.object({
  type: z.string().min(1, 'Content type must not be empty'),
  flexible: z.boolean(),
}).passthrough(); // Allow additional properties

/**
 * Zod schema for skeleton contract validation.
 *
 * @remarks
 * Validates that the skeleton contract includes all required layout properties
 * with correct types and value constraints.
 */
export const skeletonContractSchema = z.object({
  preset: z.enum([
    'full-screen',
    'with-header',
    'with-sidebar',
    'with-header-sidebar',
    'with-header-footer',
    'dashboard',
  ]),
  header: z.boolean(),
  sidebar: z.boolean(),
  footer: z.boolean(),
  content: contentAreaSchema,
});

/**
 * Type inference from Zod schema.
 */
export type SkeletonContractSchema = z.infer<typeof skeletonContractSchema>;
