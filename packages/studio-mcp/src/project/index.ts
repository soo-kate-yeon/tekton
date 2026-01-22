/**
 * Project Module
 * Exports project tools and schemas for MCP integration
 *
 * @module project
 */

export {
  ProjectTools,
  projectTools,
  type ToolResult,
  type StudioApiConfig,
} from "./tools.js";

export {
  DetectStructureInputSchema,
  GetActiveThemeInputSchema,
  SetActiveThemeInputSchema,
  FrameworkTypeSchema,
  ProjectStructureSchema,
  ActiveThemeSchema,
  type DetectStructureInput,
  type GetActiveThemeInput,
  type SetActiveThemeInput,
  type FrameworkType,
  type ProjectStructure,
} from "./schemas.js";
