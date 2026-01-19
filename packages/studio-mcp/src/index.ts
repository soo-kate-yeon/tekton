/**
 * @tekton/studio-mcp - Archetype MCP Integration
 *
 * This package provides Model Context Protocol (MCP) integration for Archetype management.
 * It enables AI assistants to query and use hook archetypes for component generation.
 */

// Archetype tools exports
export {
  ArchetypeTools,
  archetypeTools,
  type CompleteArchetype,
  type ArchetypeQueryCriteria,
  type ToolResult,
} from './component/tools.js';

// MCP Server exports
export { createMCPServer, TOOLS } from "./server/mcp-server.js";

// Storage exports
export {
  saveComponent,
  loadComponent,
  listArchetypes,
  deleteComponent,
  archetypeExists,
} from "./storage/storage.js";

// Design token type exports (generic, kept for compatibility)
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
} from "./types/design-tokens.js";
