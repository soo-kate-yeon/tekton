/**
 * Archetype MCP Server
 * HTTP-based MCP server for exposing archetype data to AI assistants
 * Supports both standalone and connected modes
 *
 * @module server/mcp-server
 */

import { createServer, type IncomingMessage, type ServerResponse } from "http";
import { archetypeTools, type ArchetypeQueryCriteria } from '../component/tools.js';
import { getKnowledgeSchema, getComponentList, renderScreen, type ComponentFilter } from '../component/layer3-tools.js';
import type { BlueprintResult } from '@tekton/component-generator';
import { projectTools } from "../project/tools.js";
import { screenTools } from "../screen/tools.js";
import type { ArchetypeName } from "../screen/schemas.js";
import { getBuiltinThemes, getBuiltinTheme } from "../theme/builtin.js";
import { projectStatus, useBuiltinTheme } from "../project/standalone.js";
import { detectMode, type ModeOptions } from "./mode.js";
import { STANDALONE_TOOLS, getHealthResponse } from "./standalone-tools.js";
import type { ConnectionMode } from "../project/config-types.js";

/**
 * MCP Tool definition
 */
interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
}

/**
 * Available MCP tools
 */
const TOOLS: MCPTool[] = [
  {
    name: "archetype.list",
    description: "List all available hook names with archetype definitions",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "archetype.get",
    description:
      "Get complete archetype for a hook including all 4 layers (prop rules, state mappings, variants, structure)",
    inputSchema: {
      type: "object",
      properties: {
        hookName: {
          type: "string",
          description: "Name of the hook (e.g., useButton, useTextField)",
        },
      },
      required: ["hookName"],
    },
  },
  {
    name: "archetype.getPropRules",
    description:
      "Get Layer 1 hook prop rules - maps hooks to prop objects and base styles",
    inputSchema: {
      type: "object",
      properties: {
        hookName: {
          type: "string",
          description: "Name of the hook",
        },
      },
      required: ["hookName"],
    },
  },
  {
    name: "archetype.getStateMappings",
    description:
      "Get Layer 2 state-style mappings - visual feedback rules for hook states",
    inputSchema: {
      type: "object",
      properties: {
        hookName: {
          type: "string",
          description: "Name of the hook",
        },
      },
      required: ["hookName"],
    },
  },
  {
    name: "archetype.getVariants",
    description:
      "Get Layer 3 variant branching - conditional styling based on configuration options",
    inputSchema: {
      type: "object",
      properties: {
        hookName: {
          type: "string",
          description: "Name of the hook",
        },
      },
      required: ["hookName"],
    },
  },
  {
    name: "archetype.getStructure",
    description:
      "Get Layer 4 structure templates - HTML/JSX templates and accessibility rules",
    inputSchema: {
      type: "object",
      properties: {
        hookName: {
          type: "string",
          description: "Name of the hook",
        },
      },
      required: ["hookName"],
    },
  },
  {
    name: "archetype.query",
    description: "Search archetypes by criteria (WCAG level, state name, etc.)",
    inputSchema: {
      type: "object",
      properties: {
        wcagLevel: {
          type: "string",
          enum: ["A", "AA", "AAA"],
          description: "Filter by WCAG accessibility level",
        },
        stateName: {
          type: "string",
          description: "Filter by state name (e.g., isPressed, isSelected)",
        },
        hasVariant: {
          type: "string",
          description: "Filter by variant option name (e.g., variant, size)",
        },
        propObject: {
          type: "string",
          description: "Filter by prop object name (e.g., buttonProps)",
        },
      },
    },
  },
  // Project Tools
  {
    name: "project.detectStructure",
    description: "Detect project structure and framework type.",
    inputSchema: {
      type: "object",
      properties: {
        projectPath: {
          type: "string",
          description: "Path to project root directory",
        },
      },
      required: ["projectPath"],
    },
  },
  {
    name: "project.getActiveTheme",
    description: "Get the currently active theme for the project.",
    inputSchema: {
      type: "object",
      properties: {
        projectPath: {
          type: "string",
          description: "Optional project path to filter by",
        },
      },
      required: [],
    },
  },
  {
    name: "project.setActiveTheme",
    description: "Set the active theme for the project.",
    inputSchema: {
      type: "object",
      properties: {
        themeId: {
          type: "integer",
          description: "ID of the theme to set as active",
        },
        projectPath: {
          type: "string",
          description: "Optional project path",
        },
      },
      required: ["themeId"],
    },
  },
  // Screen Tools
  {
    name: "screen.create",
    description: "Create a new screen with routing setup. Generates complete page file in framework-appropriate directory.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Screen name (e.g., 'user-profile', 'dashboard'). Used for file name and route.",
        },
        intent: {
          type: "string",
          description: "Natural language description of screen purpose (e.g., 'User profile page with avatar, bio, and settings link')",
        },
        targetPath: {
          type: "string",
          description: "Target route path (e.g., '/users/profile', '/dashboard')",
        },
        linkFrom: {
          type: "object",
          description: "Optional. Configuration for adding navigation link to parent page.",
          properties: {
            page: {
              type: "string",
              description: "Parent page path to add navigation link (e.g., '/users')",
            },
            label: {
              type: "string",
              description: "Link text label (e.g., 'View Profile')",
            },
            description: {
              type: "string",
              description: "Optional description for the link",
            },
          },
          required: ["page", "label"],
        },
        projectPath: {
          type: "string",
          description: "Optional project path",
        },
      },
      required: ["name", "intent", "targetPath"],
    },
  },
  {
    name: "screen.addComponent",
    description: "Add a component to an existing screen. Handles imports and placement.",
    inputSchema: {
      type: "object",
      properties: {
        screenName: {
          type: "string",
          description: "Target screen name",
        },
        componentType: {
          type: "string",
          description: "Component type from archetype system (e.g., 'useButton', 'useTextField', 'useDialog')",
        },
        props: {
          type: "object",
          description: "Optional component props configuration",
        },
        projectPath: {
          type: "string",
          description: "Optional project path",
        },
      },
      required: ["screenName", "componentType"],
    },
  },
  {
    name: "screen.applyArchetype",
    description: "Apply a style archetype to a screen. Updates CSS variables and component styling.",
    inputSchema: {
      type: "object",
      properties: {
        screenName: {
          type: "string",
          description: "Target screen name",
        },
        componentName: {
          type: "string",
          enum: ["Professional", "Creative", "Minimal", "Bold", "Warm", "Cool", "High-Contrast"],
          description: "Style archetype to apply",
        },
        projectPath: {
          type: "string",
          description: "Optional project path",
        },
      },
      required: ["screenName", "componentName"],
    },
  },
  {
    name: "screen.list",
    description: "List all screens in the current project with metadata.",
    inputSchema: {
      type: "object",
      properties: {
        projectPath: {
          type: "string",
          description: "Optional project path",
        },
      },
      required: [],
    },
  },
  {
    name: "screen.preview",
    description: "Get preview URL for a screen.",
    inputSchema: {
      type: "object",
      properties: {
        screenName: {
          type: "string",
          description: "Screen name to preview",
        },
        projectPath: {
          type: "string",
          description: "Optional project path",
        },
      },
      required: ["screenName"],
    },
  },
  // Standalone Preset Tools
  ...STANDALONE_TOOLS,
  // Layer 3 Knowledge Schema Tools
  {
    name: "knowledge.getSchema",
    description: "Get the Blueprint JSON Schema and component knowledge format for LLM consumption. Use this to understand how to structure component blueprints.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "knowledge.getComponentList",
    description: "Query available components from the catalog with optional filters (category, hasSlot). Returns lightweight component data.",
    inputSchema: {
      type: "object",
      properties: {
        filter: {
          type: "object",
          description: "Optional filter criteria",
          properties: {
            category: {
              type: "string",
              description: "Filter by component category (layout, content, input, navigation, action)",
            },
            hasSlot: {
              type: "string",
              description: "Filter by slot name (e.g., 'header', 'content', 'footer')",
            },
          },
        },
      },
    },
  },
  {
    name: "knowledge.renderScreen",
    description: "Generate React component file from Blueprint JSON. Creates .tsx file with formatted code in the specified output path.",
    inputSchema: {
      type: "object",
      properties: {
        blueprint: {
          type: "object",
          description: "Blueprint JSON object conforming to BlueprintResult schema",
          required: ["blueprintId", "recipeName", "analysis", "structure"],
        },
        outputPath: {
          type: "string",
          description: "Optional output file path (default: src/app/{recipeName}/page.tsx)",
        },
      },
      required: ["blueprint"],
    },
  },
];

/**
 * Server state
 */
let currentMode: ConnectionMode = "standalone";

/**
 * Parse JSON body from request
 */
async function parseBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

/**
 * Send JSON response
 */
function sendJSON(res: ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data, null, 2));
}

/**
 * Handle tool execution
 */
async function executeTool(
  toolName: string,
  params: Record<string, unknown>,
): Promise<unknown> {
  switch (toolName) {
    case "archetype.list":
      return archetypeTools.list();

    case "archetype.get":
      return archetypeTools.get(params.hookName as string);

    case "archetype.getPropRules":
      return archetypeTools.getPropRules(params.hookName as string);

    case "archetype.getStateMappings":
      return archetypeTools.getStateMappings(params.hookName as string);

    case "archetype.getVariants":
      return archetypeTools.getVariants(params.hookName as string);

    case "archetype.getStructure":
      return archetypeTools.getStructure(params.hookName as string);

    case "archetype.query":
      return archetypeTools.query(params as ArchetypeQueryCriteria);

    // Project Tools
    case "project.detectStructure":
      return projectTools.detectStructure({
        projectPath: params.projectPath as string,
      });

    case "project.getActiveTheme":
      return projectTools.getActiveTheme({
        projectPath: params.projectPath as string | undefined,
      });

    case "project.setActiveTheme":
      return projectTools.setActiveTheme({
        themeId: params.themeId as number,
        projectPath: params.projectPath as string | undefined,
      });

    // Screen Tools
    case "screen.create":
      return screenTools.create({
        name: params.name as string,
        intent: params.intent as string,
        targetPath: params.targetPath as string,
        linkFrom: params.linkFrom as { page: string; label: string; description?: string } | undefined,
        projectPath: params.projectPath as string | undefined,
      });

    case "screen.addComponent":
      return screenTools.addComponent({
        screenName: params.screenName as string,
        componentType: params.componentType as string,
        props: params.props as Record<string, unknown> | undefined,
        projectPath: params.projectPath as string | undefined,
      });

    case "screen.applyArchetype":
      return screenTools.applyArchetype({
        screenName: params.screenName as string,
        componentName: params.componentName as ArchetypeName,
        projectPath: params.projectPath as string | undefined,
      });

    case "screen.list":
      return screenTools.list({
        projectPath: params.projectPath as string | undefined,
      });

    case "screen.preview":
      return screenTools.preview({
        screenName: params.screenName as string,
        projectPath: params.projectPath as string | undefined,
      });

    // Standalone Theme Tools
    case "theme.list":
      return getBuiltinThemes(); // Using direct export since logic was inline/simple wrapper

    case "theme.get":
      return getBuiltinTheme(params.themeId as string);

    case "project.status":
      return projectStatus({
        projectPath: params.projectPath as string | undefined,
      });

    case "project.useBuiltinTheme":
      return useBuiltinTheme({
        themeId: params.themeId as string,
        projectPath: params.projectPath as string | undefined,
      });

    // Layer 3 Knowledge Schema Tools
    case "knowledge.getSchema":
      return getKnowledgeSchema();

    case "knowledge.getComponentList":
      return getComponentList(params.filter as ComponentFilter | undefined);

    case "knowledge.renderScreen":
      return renderScreen(
        params.blueprint as BlueprintResult,
        params.outputPath as string | undefined
      );

    default:
      return { success: false, error: `Unknown tool: ${toolName}` };
  }
}

/**
 * Request handler
 */
async function handleRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const path = url.pathname;

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  // Health check
  if (path === "/health" && req.method === "GET") {
    const healthResponse = getHealthResponse(currentMode, TOOLS.map((t) => t.name));
    sendJSON(res, 200, healthResponse);
    return;
  }

  // List tools
  if (path === "/tools" && req.method === "GET") {
    sendJSON(res, 200, { tools: TOOLS });
    return;
  }

  // Execute tool
  if (path.startsWith("/tools/") && req.method === "POST") {
    const toolName = path.replace("/tools/", "");
    const tool = TOOLS.find((t) => t.name === toolName);

    if (!tool) {
      sendJSON(res, 404, { error: `Tool not found: ${toolName}` });
      return;
    }

    try {
      const params = (await parseBody(req)) as Record<string, unknown>;
      const result = await executeTool(toolName, params);
      sendJSON(res, 200, result);
    } catch (error) {
      sendJSON(res, 500, {
        error: error instanceof Error ? error.message : "Internal error",
      });
    }
    return;
  }

  // Not found
  sendJSON(res, 404, { error: "Not found" });
}

/**
 * Server configuration options
 */
export interface MCPServerOptions extends ModeOptions {
  port?: number;
}

/**
 * Create and start MCP server
 * Detects mode automatically based on API availability
 */
export async function createMCPServer(
  options: MCPServerOptions = {}
): Promise<ReturnType<typeof createServer>> {
  const { port = 3000, ...modeOptions } = options;

  // Detect operation mode
  currentMode = await detectMode(modeOptions);

  const server = createServer(async (req, res) => {
    try {
      await handleRequest(req, res);
    } catch (error) {
      console.error("Request error:", error);
      sendJSON(res, 500, { error: "Internal server error" });
    }
  });

  server.listen(port, () => {
    const modeLabel = currentMode === "standalone" ? "Standalone" : "Connected";
    console.log(`🚀 Tekton MCP Server running at http://localhost:${port}`);
    console.log(`   Mode:   ${modeLabel}`);
    console.log(`   Health: http://localhost:${port}/health`);
    console.log(`   Tools:  http://localhost:${port}/tools`);
  });

  return server;
}

/**
 * Export tools list for external use
 */
export { TOOLS };
