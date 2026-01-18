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
  GetActivePresetInputSchema,
  SetActivePresetInputSchema,
  FrameworkTypeSchema,
  ProjectStructureSchema,
  ActivePresetSchema,
  type DetectStructureInput,
  type GetActivePresetInput,
  type SetActivePresetInput,
  type FrameworkType,
  type ProjectStructure,
  type ActivePreset,
} from "./schemas.js";
