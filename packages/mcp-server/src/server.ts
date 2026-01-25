/**
 * Tekton MCP Server
 * SPEC-MCP-002: MCP Protocol Foundation with HTTP preview server
 */

import { createServer, IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { handlePreviewRequest } from './web/preview-routes.js';
import { handleBlueprintRequest, handleThemesRequest } from './web/api-routes.js';

// MCP Tools
import { generateBlueprintTool } from './tools/generate-blueprint.js';
import { previewThemeTool } from './tools/preview-theme.js';
import { exportScreenTool } from './tools/export-screen.js';

// Schemas
import {
  GenerateBlueprintInputSchema,
  PreviewThemeInputSchema,
  ExportScreenInputSchema
} from './schemas/mcp-schemas.js';

/**
 * Server configuration
 */
export interface ServerConfig {
  port: number;
  host: string;
  baseUrl: string;
}

const DEFAULT_CONFIG: ServerConfig = {
  port: 3000,
  host: 'localhost',
  baseUrl: 'http://localhost:3000'
};

/**
 * MCP Tool registry for tool discovery
 * SPEC: U-001 MCP Tool Registration
 */
const MCP_TOOLS = [
  {
    name: 'generate-blueprint',
    description: 'Generate Blueprint JSON from natural language description with theme and layout',
    inputSchema: GenerateBlueprintInputSchema,
    handler: generateBlueprintTool
  },
  {
    name: 'preview-theme',
    description: 'Generate preview URL for theme quality check with CSS variables',
    inputSchema: PreviewThemeInputSchema,
    handler: previewThemeTool
  },
  {
    name: 'export-screen',
    description: 'Export generated screen to production code (JSX, TSX, Vue)',
    inputSchema: ExportScreenInputSchema,
    handler: exportScreenTool
  }
];

/**
 * HTTP request handler
 */
async function handleRequest(req: IncomingMessage, res: ServerResponse, config: ServerConfig): Promise<void> {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // MCP Tool List endpoint
  if (url.pathname === '/tools' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    const tools = MCP_TOOLS.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema.shape
    }));
    res.end(JSON.stringify({ tools }));
    return;
  }

  // Preview routes: GET /preview/:timestamp/:themeId
  const previewMatch = url.pathname.match(/^\/preview\/([^/]+)\/([^/]+)$/);
  if (previewMatch && req.method === 'GET') {
    const timestamp = previewMatch[1];
    const themeId = previewMatch[2];
    if (timestamp && themeId) {
      handlePreviewRequest(req, res, timestamp, themeId);
      return;
    }
  }

  // API routes: GET /api/blueprints/:timestamp
  const blueprintMatch = url.pathname.match(/^\/api\/blueprints\/([^/]+)$/);
  if (blueprintMatch && req.method === 'GET') {
    const timestamp = blueprintMatch[1];
    if (timestamp) {
      await handleBlueprintRequest(req, res, timestamp);
      return;
    }
  }

  // API routes: GET /api/themes
  if (url.pathname === '/api/themes' && req.method === 'GET') {
    handleThemesRequest(req, res);
    return;
  }

  // MCP Tool invocation: POST /tools/:toolName
  const toolMatch = url.pathname.match(/^\/tools\/([^/]+)$/);
  if (toolMatch && req.method === 'POST') {
    const toolName = toolMatch[1];
    if (!toolName) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Invalid tool name' }));
      return;
    }
    const tool = MCP_TOOLS.find(t => t.name === toolName);

    if (!tool) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Tool not found' }));
      return;
    }

    // Read request body
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const input = JSON.parse(body);

        // Validate input with Zod schema
        const validationResult = tool.inputSchema.safeParse(input);
        if (!validationResult.success) {
          res.writeHead(400, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify({
            success: false,
            error: `Validation errors: ${validationResult.error.errors.map(e => e.message).join(', ')}`
          }));
          return;
        }

        // Invoke tool handler (cast to any to handle union types)
        const result = await (tool.handler as any)(validationResult.data, { baseUrl: config.baseUrl });

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(500, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }));
      }
    });
    return;
  }

  // 404 Not Found
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
}

/**
 * Start MCP server
 * SPEC: Milestone 1 MCP Protocol Foundation
 */
export function startServer(config: Partial<ServerConfig> = {}): ReturnType<typeof createServer> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const server = createServer((req, res) => {
    handleRequest(req, res, finalConfig).catch(error => {
      console.error('Request handling error:', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    });
  });

  server.listen(finalConfig.port, finalConfig.host, () => {
    console.log(`🚀 Tekton MCP Server running at ${finalConfig.baseUrl}`);
    console.log(`📋 MCP Tools: ${MCP_TOOLS.map(t => t.name).join(', ')}`);
    console.log(`🎨 Preview: ${finalConfig.baseUrl}/preview/:timestamp/:themeId`);
  });

  return server;
}

/**
 * Export tools for testing
 */
export { generateBlueprintTool, previewThemeTool, exportScreenTool };

/**
 * CLI entry point
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}
