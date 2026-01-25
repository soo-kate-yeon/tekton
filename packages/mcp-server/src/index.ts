#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { info, error as logError } from './utils/logger.js';
import { generateBlueprintTool } from './tools/generate-blueprint.js';
import { previewThemeTool } from './tools/preview-theme.js';
import { exportScreenTool } from './tools/export-screen.js';
import {
  GenerateBlueprintInputSchema,
  PreviewThemeInputSchema,
  ExportScreenInputSchema
} from './schemas/mcp-schemas.js';

const server = new Server(
  {
    name: 'tekton-mcp-server',
    version: '2.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ============================================================================
// Task #9: ListToolsRequestSchema Handler
// ============================================================================

server.setRequestHandler(ListToolsRequestSchema, async () => {
  info('ListTools request received');
  
  return {
    tools: [
      {
        name: 'generate-blueprint',
        description: 'Generate a UI blueprint from natural language description',
        inputSchema: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
              description: 'Natural language description of the screen (10-500 characters)',
              minLength: 10,
              maxLength: 500
            },
            layout: {
              type: 'string',
              description: 'Layout type for the screen',
              enum: ['single-column', 'two-column', 'sidebar-left', 'sidebar-right', 'dashboard', 'landing']
            },
            themeId: {
              type: 'string',
              description: 'Theme ID (lowercase alphanumeric with hyphens)',
              pattern: '^[a-z0-9-]+$'
            },
            componentHints: {
              type: 'array',
              description: 'Optional component type hints',
              items: { type: 'string' }
            }
          },
          required: ['description', 'layout', 'themeId']
        }
      },
      {
        name: 'preview-theme',
        description: 'Preview a theme and retrieve its CSS variables',
        inputSchema: {
          type: 'object',
          properties: {
            themeId: {
              type: 'string',
              description: 'Theme ID to preview (lowercase alphanumeric with hyphens)',
              pattern: '^[a-z0-9-]+$'
            }
          },
          required: ['themeId']
        }
      },
      {
        name: 'export-screen',
        description: 'Export a blueprint to JSX, TSX, or Vue code',
        inputSchema: {
          type: 'object',
          properties: {
            blueprint: {
              type: 'object',
              description: 'Blueprint object to export'
            },
            format: {
              type: 'string',
              description: 'Export format',
              enum: ['jsx', 'tsx', 'vue']
            }
          },
          required: ['blueprint', 'format']
        }
      }
    ]
  };
});

// ============================================================================
// Task #10: CallToolRequestSchema Handler
// ============================================================================

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  info(`CallTool request: ${name}`);
  
  try {
    switch (name) {
      case 'generate-blueprint': {
        // Validate input
        const validatedInput = GenerateBlueprintInputSchema.parse(args);
        const result = await generateBlueprintTool(validatedInput);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }]
        };
      }
      
      case 'preview-theme': {
        // Validate input
        const validatedInput = PreviewThemeInputSchema.parse(args);
        const result = await previewThemeTool(validatedInput);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }]
        };
      }
      
      case 'export-screen': {
        // Validate input
        const validatedInput = ExportScreenInputSchema.parse(args);
        const result = await exportScreenTool(validatedInput);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }]
        };
      }
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    logError(`Tool execution error: ${error}`);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : String(error)
        }, null, 2)
      }],
      isError: true
    };
  }
});

// ============================================================================
// Server Initialization
// ============================================================================

// Connect via stdio
const transport = new StdioServerTransport();

info('Starting Tekton MCP Server v2.0.0...');

await server.connect(transport);

info('Tekton MCP Server connected via stdio transport');
info('3 MCP tools registered: generate-blueprint, preview-theme, export-screen');
