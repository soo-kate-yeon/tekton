/**
 * @tekton/studio-mcp - Brand DNA MCP Integration
 *
 * This package provides Model Context Protocol (MCP) integration for Brand DNA management.
 * It enables AI assistants to read and write Brand DNA configurations for design token generation.
 */

// Schema exports
export {
  BrandAxisSchema,
  BrandAxesSchema,
  BrandDNASchema,
  type BrandAxis,
  type BrandAxes,
  type BrandDNA,
} from "./brand-dna/schema.js";

// Design token exports
export {
  DesignTokenSchema,
  FontFamilySchema,
  FontSizeSchema,
  FontWeightSchema,
  LineHeightSchema,
  TypographySchema,
  type DesignToken,
  type SpacingValue,
  type ColorValue,
  type ShadowValue,
  type TransitionValue,
  type BorderRadiusValue,
  type OpacityValue,
  type BreakpointValue,
  type ZIndexValue,
  type TypographyValue,
} from "./brand-dna/design-tokens.js";

// Interpreter exports
export {
  interpretAxis,
  interpretBrandDNA,
  type AxisName,
  type AxisInterpretation,
  type DensityInterpretation,
  type WarmthInterpretation,
  type PlayfulnessInterpretation,
  type SophisticationInterpretation,
  type EnergyInterpretation,
  type BrandDNAInterpretation,
} from "./interpreter/axis-interpreter.js";

// Storage exports
export { saveBrandDNA, loadBrandDNA, listBrandDNA } from "./storage/storage.js";
