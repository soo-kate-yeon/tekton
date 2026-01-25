/**
 * API HTTP routes for web server
 * SPEC-MCP-002: GET /api/blueprints/:timestamp, GET /api/themes
 */

import { IncomingMessage, ServerResponse } from 'http';
import { listThemes } from '@tekton/core';
import { getDefaultStorage } from '../storage/blueprint-storage.js';

/**
 * Handle blueprint retrieval by timestamp
 * SPEC: GET /api/blueprints/:timestamp
 *
 * @param req - HTTP request
 * @param res - HTTP response
 * @param timestamp - Blueprint timestamp ID
 */
export async function handleBlueprintRequest(
  _req: IncomingMessage,
  res: ServerResponse,
  timestamp: string
): Promise<void> {
  try {
    const storage = getDefaultStorage();
    const blueprint = await storage.loadBlueprint(timestamp);

    if (!blueprint) {
      res.writeHead(404, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({
        success: false,
        error: `Blueprint not found: ${timestamp}`
      }));
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({
      success: true,
      blueprint
    }));
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
}

/**
 * Handle themes list retrieval
 * SPEC: GET /api/themes
 *
 * @param req - HTTP request
 * @param res - HTTP response
 */
export function handleThemesRequest(
  _req: IncomingMessage,
  res: ServerResponse
): void {
  try {
    // SPEC: U-003 @tekton/core Integration - Use listThemes from @tekton/core
    const themes = listThemes();

    const themesData = themes.map(theme => ({
      id: theme.id,
      name: theme.name,
      description: theme.description
    }));

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({
      success: true,
      themes: themesData
    }));
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
}
