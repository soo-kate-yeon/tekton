#!/usr/bin/env node
/**
 * Tekton Studio MCP Server - stdio transport
 * For Claude Desktop integration
 *
 * @module server/stdio-server
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { archetypeTools, type ArchetypeQueryCriteria } from "../component/tools.js";
import {
  getKnowledgeSchema,
  getComponentList,
  renderScreen,
  type ComponentFilter,
} from "../component/layer3-tools.js";
import type { BlueprintResult } from "@tekton/component-generator";
import { projectTools } from "../project/tools.js";
import { screenTools } from "../screen/tools.js";
import type { ArchetypeName } from "../screen/schemas.js";
import { getBuiltinThemes, getBuiltinTheme } from "../theme/builtin.js";
import { projectStatus, useBuiltinTheme } from "../project/standalone.js";

// Create MCP server
const server = new McpServer({
  name: "tekton-studio",
  version: "1.0.0",
});

// ============ Archetype Tools ============

server.registerTool(
  "archetype_list",
  {
    description: "List all available hook names with archetype definitions",
  },
  async () => {
    const result = archetypeTools.list();
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  "archetype_get",
  {
    description:
      "Get complete archetype for a hook including all 4 layers (prop rules, state mappings, variants, structure)",
    inputSchema: {
      hookName: z.string().describe("Name of the hook (e.g., useButton, useTextField)"),
    },
  },
  async ({ hookName }) => {
    const result = archetypeTools.get(hookName);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  "archetype_getPropRules",
  {
    description: "Get Layer 1 hook prop rules - maps hooks to prop objects and base styles",
    inputSchema: {
      hookName: z.string().describe("Name of the hook"),
    },
  },
  async ({ hookName }) => {
    const result = archetypeTools.getPropRules(hookName);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  "archetype_getStateMappings",
  {
    description: "Get Layer 2 state-style mappings - visual feedback rules for hook states",
    inputSchema: {
      hookName: z.string().describe("Name of the hook"),
    },
  },
  async ({ hookName }) => {
    const result = archetypeTools.getStateMappings(hookName);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  "archetype_getVariants",
  {
    description:
      "Get Layer 3 variant branching - conditional styling based on configuration options",
    inputSchema: {
      hookName: z.string().describe("Name of the hook"),
    },
  },
  async ({ hookName }) => {
    const result = archetypeTools.getVariants(hookName);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  "archetype_getStructure",
  {
    description: "Get Layer 4 structure templates - HTML/JSX templates and accessibility rules",
    inputSchema: {
      hookName: z.string().describe("Name of the hook"),
    },
  },
  async ({ hookName }) => {
    const result = archetypeTools.getStructure(hookName);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  "archetype_query",
  {
    description: "Search archetypes by criteria (WCAG level, state name, etc.)",
    inputSchema: {
      wcagLevel: z.enum(["A", "AA", "AAA"]).optional().describe("Filter by WCAG accessibility level"),
      stateName: z.string().optional().describe("Filter by state name (e.g., isPressed, isSelected)"),
      hasVariant: z.string().optional().describe("Filter by variant option name (e.g., variant, size)"),
      propObject: z.string().optional().describe("Filter by prop object name (e.g., buttonProps)"),
    },
  },
  async (params) => {
    const result = archetypeTools.query(params as ArchetypeQueryCriteria);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ============ Project Tools ============

server.registerTool(
  "project_detectStructure",
  {
    description: "Detect project structure and framework type.",
    inputSchema: {
      projectPath: z.string().describe("Path to project root directory"),
    },
  },
  async ({ projectPath }) => {
    const result = await projectTools.detectStructure({ projectPath });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  "project_getActiveTheme",
  {
    description: "Get the currently active theme for the project.",
    inputSchema: {
      projectPath: z.string().optional().describe("Optional project path to filter by"),
    },
  },
  async ({ projectPath }) => {
    const result = await projectTools.getActiveTheme({ projectPath });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  "project_setActiveTheme",
  {
    description: "Set the active theme for the project.",
    inputSchema: {
      themeId: z.number().describe("ID of the theme to set as active"),
      projectPath: z.string().optional().describe("Optional project path"),
    },
  },
  async ({ themeId, projectPath }) => {
    const result = await projectTools.setActiveTheme({ themeId, projectPath });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  "project_status",
  {
    description: "Get project status information.",
    inputSchema: {
      projectPath: z.string().optional().describe("Optional project path"),
    },
  },
  async ({ projectPath }) => {
    const result = await projectStatus({ projectPath });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  "project_useBuiltinTheme",
  {
    description: "Use a built-in theme for the project.",
    inputSchema: {
      themeId: z.string().describe("ID of the built-in theme"),
      projectPath: z.string().optional().describe("Optional project path"),
    },
  },
  async ({ themeId, projectPath }) => {
    const result = await useBuiltinTheme({ themeId, projectPath });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ============ Screen Tools ============

server.registerTool(
  "screen_create",
  {
    description:
      "Create a new screen with routing setup. Generates complete page file in framework-appropriate directory.",
    inputSchema: {
      name: z
        .string()
        .describe("Screen name (e.g., 'user-profile', 'dashboard'). Used for file name and route."),
      intent: z
        .string()
        .describe(
          "Natural language description of screen purpose (e.g., 'User profile page with avatar, bio, and settings link')"
        ),
      targetPath: z.string().describe("Target route path (e.g., '/users/profile', '/dashboard')"),
      linkFrom: z
        .object({
          page: z.string().describe("Parent page path to add navigation link"),
          label: z.string().describe("Link text label"),
          description: z.string().optional().describe("Optional description for the link"),
        })
        .optional()
        .describe("Optional. Configuration for adding navigation link to parent page."),
      projectPath: z.string().optional().describe("Optional project path"),
    },
  },
  async ({ name, intent, targetPath, linkFrom, projectPath }) => {
    const result = await screenTools.create({ name, intent, targetPath, linkFrom, projectPath });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  "screen_addComponent",
  {
    description: "Add a component to an existing screen. Handles imports and placement.",
    inputSchema: {
      screenName: z.string().describe("Target screen name"),
      componentType: z
        .string()
        .describe("Component type from archetype system (e.g., 'useButton', 'useTextField', 'useDialog')"),
      props: z.record(z.unknown()).optional().describe("Optional component props configuration"),
      projectPath: z.string().optional().describe("Optional project path"),
    },
  },
  async ({ screenName, componentType, props, projectPath }) => {
    const result = await screenTools.addComponent({ screenName, componentType, props, projectPath });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  "screen_applyArchetype",
  {
    description: "Apply a style archetype to a screen. Updates CSS variables and component styling.",
    inputSchema: {
      screenName: z.string().describe("Target screen name"),
      componentName: z
        .enum(["Professional", "Creative", "Minimal", "Bold", "Warm", "Cool", "High-Contrast"])
        .describe("Style archetype to apply"),
      projectPath: z.string().optional().describe("Optional project path"),
    },
  },
  async ({ screenName, componentName, projectPath }) => {
    const result = await screenTools.applyArchetype({
      screenName,
      componentName: componentName as ArchetypeName,
      projectPath,
    });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  "screen_list",
  {
    description: "List all screens in the current project with metadata.",
    inputSchema: {
      projectPath: z.string().optional().describe("Optional project path"),
    },
  },
  async ({ projectPath }) => {
    const result = await screenTools.list({ projectPath });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  "screen_preview",
  {
    description: "Get preview URL for a screen.",
    inputSchema: {
      screenName: z.string().describe("Screen name to preview"),
      projectPath: z.string().optional().describe("Optional project path"),
    },
  },
  async ({ screenName, projectPath }) => {
    const result = await screenTools.preview({ screenName, projectPath });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ============ Theme Tools ============

server.registerTool(
  "theme_list",
  {
    description: "List all built-in themes.",
  },
  async () => {
    const result = getBuiltinThemes();
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  "theme_get",
  {
    description: "Get details of a specific built-in theme.",
    inputSchema: {
      themeId: z.string().describe("ID of the theme to retrieve"),
    },
  },
  async ({ themeId }) => {
    const result = getBuiltinTheme(themeId);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// ============ Knowledge/Layer 3 Tools ============

server.registerTool(
  "knowledge_getSchema",
  {
    description:
      "Get the Blueprint JSON Schema and component knowledge format for LLM consumption. Use this to understand how to structure component blueprints.",
  },
  async () => {
    const result = getKnowledgeSchema();
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  "knowledge_getComponentList",
  {
    description:
      "Query available components from the catalog with optional filters (category, hasSlot). Returns lightweight component data.",
    inputSchema: {
      filter: z
        .object({
          category: z
            .string()
            .optional()
            .describe("Filter by component category (layout, content, input, navigation, action)"),
          hasSlot: z.string().optional().describe("Filter by slot name (e.g., 'header', 'content', 'footer')"),
        })
        .optional()
        .describe("Optional filter criteria"),
    },
  },
  async ({ filter }) => {
    const result = getComponentList(filter as ComponentFilter | undefined);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.registerTool(
  "knowledge_renderScreen",
  {
    description:
      "Generate React component file from Blueprint JSON. Creates .tsx file with formatted code in the specified output path.",
    inputSchema: {
      blueprint: z
        .object({
          blueprintId: z.string(),
          recipeName: z.string(),
          analysis: z.any(),
          structure: z.any(),
        })
        .passthrough()
        .describe("Blueprint JSON object conforming to BlueprintResult schema"),
      outputPath: z
        .string()
        .optional()
        .describe("Optional output file path (default: src/app/{recipeName}/page.tsx)"),
    },
  },
  async ({ blueprint, outputPath }) => {
    const result = await renderScreen(blueprint as BlueprintResult, outputPath);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

// Start the server with stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Tekton Studio MCP server running on stdio");
}

main().catch((error) => {
  console.error("Failed to start MCP server:", error);
  process.exit(1);
});
