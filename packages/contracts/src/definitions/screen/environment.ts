import { z } from 'zod';

/**
 * Environment enum representing the target platform for screen rendering.
 *
 * @remarks
 * Each environment type defines specific grid systems, layout behaviors,
 * and interaction models optimized for the target platform.
 */
export const Environment = {
  Web: 'web',
  Mobile: 'mobile',
  Tablet: 'tablet',
  Responsive: 'responsive',
  TV: 'tv',
  Kiosk: 'kiosk',
} as const;

export type Environment = (typeof Environment)[keyof typeof Environment];

/**
 * Grid system configuration defining layout structure.
 *
 * @property columns - Number of columns in the grid (1-24)
 * @property gutter - Spacing between columns in pixels
 * @property margin - Outer margin in pixels
 * @property breakpoint - Responsive breakpoint range
 */
export interface GridSystem {
  columns: number;
  gutter: number;
  margin: number;
  breakpoint: {
    min: number;
    max: number;
  };
}

/**
 * Layout behavior configuration for environment-specific interactions.
 *
 * @property navigation - Navigation pattern (e.g., 'persistent-sidebar', 'bottom-tabs')
 * @property cardLayout - Card arrangement pattern (e.g., 'grid', 'single-column')
 * @property dataDensity - Information density level (e.g., 'comfortable', 'compact')
 * @property interactionModel - Interaction paradigm (e.g., 'hover-enabled', 'touch-optimized')
 */
export interface LayoutBehavior {
  navigation: string;
  cardLayout: string;
  dataDensity: string;
  interactionModel: string;
}

/**
 * Environment contract defining the complete platform configuration.
 */
export interface EnvironmentContract {
  environment: Environment;
  gridSystem: GridSystem;
  layoutBehavior: LayoutBehavior;
}

/**
 * Zod schema for grid system validation.
 */
const gridSystemSchema = z.object({
  columns: z.number().int().min(1, 'Columns must be at least 1'),
  gutter: z.number().min(0, 'Gutter must be non-negative'),
  margin: z.number().min(0, 'Margin must be non-negative'),
  breakpoint: z.object({
    min: z.number().min(0),
    max: z.number(),
  }),
});

/**
 * Zod schema for layout behavior validation.
 */
const layoutBehaviorSchema = z.object({
  navigation: z.string().min(1),
  cardLayout: z.string().min(1),
  dataDensity: z.string().min(1),
  interactionModel: z.string().min(1),
});

/**
 * Zod schema for environment contract validation.
 *
 * @remarks
 * Validates that the environment contract includes all required fields
 * with correct types and value constraints.
 */
export const environmentContractSchema = z.object({
  environment: z.enum([
    'web',
    'mobile',
    'tablet',
    'responsive',
    'tv',
    'kiosk',
  ]),
  gridSystem: gridSystemSchema,
  layoutBehavior: layoutBehaviorSchema,
});

/**
 * Type inference from Zod schema.
 */
export type EnvironmentContractSchema = z.infer<typeof environmentContractSchema>;
