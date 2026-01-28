#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { info, error as logError } from './utils/logger.js';
import { generateBlueprintTool } from './tools/generate-blueprint.js';
import { previewThemeTool } from './tools/preview-theme.js';
import { listThemesTool } from './tools/list-themes.js';
import { exportScreenTool } from './tools/export-screen.js';
import { generateScreenTool } from './tools/generate-screen.js';
import { validateScreenTool } from './tools/validate-screen.js';
import { listTokensTool } from './tools/list-tokens.js';
import {
  GenerateBlueprintInputSchema,
  PreviewThemeInputSchema,
  ListThemesInputSchema,
  ExportScreenInputSchema,
  GenerateScreenInputSchema,
  ValidateScreenInputSchema,
  ListTokensInputSchema,
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
              maxLength: 500,
            },
            layout: {
              type: 'string',
              description: 'Layout type for the screen',
              enum: [
                'single-column',
                'two-column',
                'sidebar-left',
                'sidebar-right',
                'dashboard',
                'landing',
              ],
            },
            themeId: {
              type: 'string',
              description: 'Theme ID (lowercase alphanumeric with hyphens)',
              pattern: '^[a-z0-9-]+$',
            },
            componentHints: {
              type: 'array',
              description: 'Optional component type hints',
              items: { type: 'string' },
            },
          },
          required: ['description', 'layout', 'themeId'],
        },
      },
      {
        name: 'list-themes',
        description: 'List all available themes from .moai/themes/generated/',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'preview-theme',
        description: 'Preview a theme and retrieve its full v2.1 theme data including tokens',
        inputSchema: {
          type: 'object',
          properties: {
            themeId: {
              type: 'string',
              description: 'Theme ID to preview (lowercase alphanumeric with hyphens)',
              pattern: '^[a-z0-9-]+$',
            },
          },
          required: ['themeId'],
        },
      },
      {
        name: 'export-screen',
        description: 'Export a blueprint to JSX, TSX, or Vue code',
        inputSchema: {
          type: 'object',
          properties: {
            blueprint: {
              type: 'object',
              description: 'Blueprint object to export',
            },
            format: {
              type: 'string',
              description: 'Export format',
              enum: ['jsx', 'tsx', 'vue'],
            },
          },
          required: ['blueprint', 'format'],
        },
      },
      {
        name: 'generate_screen',
        description: 'Generate production-ready code from JSON screen definition',
        inputSchema: {
          type: 'object',
          properties: {
            screenDefinition: {
              type: 'object',
              description: 'JSON screen definition with id, shell, page, sections',
            },
            outputFormat: {
              type: 'string',
              description: 'Code output format',
              enum: ['css-in-js', 'tailwind', 'react'],
            },
            options: {
              type: 'object',
              description: 'Optional generation options',
              properties: {
                cssFramework: {
                  type: 'string',
                  enum: ['styled-components', 'emotion'],
                },
                typescript: { type: 'boolean' },
                prettier: { type: 'boolean' },
              },
            },
          },
          required: ['screenDefinition', 'outputFormat'],
        },
      },
      {
        name: 'validate_screen',
        description: 'Validate JSON screen definition with helpful feedback',
        inputSchema: {
          type: 'object',
          properties: {
            screenDefinition: {
              type: 'object',
              description: 'JSON screen definition to validate',
            },
            strictMode: {
              type: 'boolean',
              description: 'Enable strict validation (default: false)',
            },
          },
          required: ['screenDefinition'],
        },
      },
      {
        name: 'list_tokens',
        description: 'List available layout tokens from SPEC-LAYOUT-001',
        inputSchema: {
          type: 'object',
          properties: {
            tokenType: {
              type: 'string',
              description: 'Filter by token type',
              enum: ['shell', 'page', 'section', 'all'],
            },
            filter: {
              type: 'string',
              description: 'Optional pattern filter (case-insensitive substring match)',
            },
          },
        },
      },
    ],
  };
});

// ============================================================================
// Task #10: CallToolRequestSchema Handler
// ============================================================================

server.setRequestHandler(CallToolRequestSchema, async request => {
  const { name, arguments: args } = request.params;

  info(`CallTool request: ${name}`);

  try {
    switch (name) {
      case 'generate-blueprint': {
        // Validate input
        const validatedInput = GenerateBlueprintInputSchema.parse(args);
        const result = await generateBlueprintTool(validatedInput);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'list-themes': {
        // Validate input (no required fields)
        ListThemesInputSchema.parse(args);
        const result = await listThemesTool();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'preview-theme': {
        // Validate input
        const validatedInput = PreviewThemeInputSchema.parse(args);
        const result = await previewThemeTool(validatedInput);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'export-screen': {
        // Validate input
        const validatedInput = ExportScreenInputSchema.parse(args);
        const result = await exportScreenTool(validatedInput);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'generate_screen': {
        // Validate input
        const validatedInput = GenerateScreenInputSchema.parse(args);
        const result = await generateScreenTool(validatedInput);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'validate_screen': {
        // Validate input
        const validatedInput = ValidateScreenInputSchema.parse(args);
        const result = await validateScreenTool(validatedInput);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'list_tokens': {
        // Validate input
        const validatedInput = ListTokensInputSchema.parse(args);
        const result = await listTokensTool(validatedInput);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    logError(`Tool execution error: ${error}`);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              success: false,
              error: error instanceof Error ? error.message : String(error),
            },
            null,
            2
          ),
        },
      ],
      isError: true,
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
info(
  '7 MCP tools registered: generate-blueprint, list-themes, preview-theme, export-screen, generate_screen, validate_screen, list_tokens'
);
