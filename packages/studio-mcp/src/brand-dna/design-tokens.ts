import { z } from "zod";

/**
 * Base token value types
 */
export type SpacingValue = string;
export type ColorValue = string;
export type ShadowValue = string;
export type TransitionValue = string;
export type BorderRadiusValue = string;
export type OpacityValue = string;
export type BreakpointValue = string;
export type ZIndexValue = string;

/**
 * Typography sub-schemas
 */
export const FontFamilySchema = z.record(z.string());
export const FontSizeSchema = z.record(z.string());
export const FontWeightSchema = z.record(z.string());
export const LineHeightSchema = z.record(z.string());

/**
 * Typography Schema
 */
export const TypographySchema = z.object({
  fontFamily: FontFamilySchema.optional().default({}),
  fontSize: FontSizeSchema.optional().default({}),
  fontWeight: FontWeightSchema.optional().default({}),
  lineHeight: LineHeightSchema.optional().default({}),
});

export type TypographyValue = z.infer<typeof TypographySchema>;

/**
 * Design Token Schema
 * Defines the complete structure of design tokens generated from Brand DNA
 */
export const DesignTokenSchema = z.object({
  spacing: z.record(z.string()).optional().default({}),
  typography: TypographySchema.optional().default({
    fontFamily: {},
    fontSize: {},
    fontWeight: {},
    lineHeight: {},
  }),
  colors: z.record(z.string()).optional().default({}),
  borderRadius: z.record(z.string()).optional().default({}),
  shadows: z.record(z.string()).optional().default({}),
  opacity: z.record(z.string()).optional().default({}),
  transitions: z.record(z.string()).optional().default({}),
  breakpoints: z.record(z.string()).optional().default({}),
  zIndex: z.record(z.string()).optional().default({}),
});

/**
 * TypeScript type inferred from Zod schema
 */
export type DesignToken = z.infer<typeof DesignTokenSchema>;
