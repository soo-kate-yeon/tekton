/**
 * API Routes Tests
 * SPEC-MCP-002: GET /api/blueprints/:timestamp, GET /api/themes
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { startServer } from '../../src/server.js';
import { generateBlueprintTool } from '../../src/tools/generate-blueprint.js';
import type { Server } from 'http';

describe('API Routes', () => {
  let server: Server;
  const baseUrl = 'http://localhost:3003';

  beforeAll(() => {
    server = startServer({ port: 3003, host: 'localhost', baseUrl });
  });

  afterAll(() => {
    server.close();
  });

  describe('GET /api/blueprints/:timestamp', () => {
    it('should return blueprint JSON for valid timestamp', async () => {
      // Generate a blueprint first
      const genResult = await generateBlueprintTool({
        description: 'API test blueprint',
        layout: 'single-column',
        themeId: 'calm-wellness'
      });

      expect(genResult.success).toBe(true);
      const timestamp = genResult.blueprint!.id;

      // Fetch blueprint via API
      const response = await fetch(`${baseUrl}/api/blueprints/${timestamp}`);
      expect(response.status).toBe(200);

      const data = await response.json() as any;
      expect(data.success).toBe(true);
      expect(data.blueprint).toBeDefined();
      expect(data.blueprint.themeId).toBe('calm-wellness');
    });

    it('should return 404 for non-existent blueprint', async () => {
      const response = await fetch(`${baseUrl}/api/blueprints/9999999999999`);
      expect(response.status).toBe(404);

      const data = await response.json() as any;
      expect(data.success).toBe(false);
      expect(data.error).toContain('Blueprint not found');
    });

    it('should include CORS headers', async () => {
      const response = await fetch(`${baseUrl}/api/blueprints/123456789`);
      expect(response.headers.get('access-control-allow-origin')).toBe('*');
    });
  });

  describe('GET /api/themes', () => {
    it('should return list of all built-in themes', async () => {
      const response = await fetch(`${baseUrl}/api/themes`);
      expect(response.status).toBe(200);

      const data = await response.json() as any;
      expect(data.success).toBe(true);
      expect(data.themes).toBeDefined();
      expect(Array.isArray(data.themes)).toBe(true);
      expect(data.themes.length).toBeGreaterThan(0);
    });

    it('should include theme metadata', async () => {
      const response = await fetch(`${baseUrl}/api/themes`);
      const data = await response.json() as any;

      const theme = data.themes[0];
      expect(theme.id).toBeDefined();
      expect(theme.name).toBeDefined();
      expect(theme.description).toBeDefined();
    });

    it('should include calm-wellness theme', async () => {
      const response = await fetch(`${baseUrl}/api/themes`);
      const data = await response.json() as any;

      const themeIds = data.themes.map((t: any) => t.id);
      expect(themeIds).toContain('calm-wellness');
    });

    it('should include CORS headers', async () => {
      const response = await fetch(`${baseUrl}/api/themes`);
      expect(response.headers.get('access-control-allow-origin')).toBe('*');
    });
  });
});
