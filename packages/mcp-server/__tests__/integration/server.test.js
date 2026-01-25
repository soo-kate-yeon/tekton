/**
 * Integration Tests for MCP Server
 * SPEC-MCP-002: End-to-End Workflow Validation
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { startServer } from '../../src/server.js';
describe('MCP Server Integration', () => {
    let server;
    const baseUrl = 'http://localhost:3001';
    beforeAll(() => {
        server = startServer({ port: 3001, host: 'localhost', baseUrl });
    });
    afterAll(() => {
        server.close();
    });
    it('should list all MCP tools', async () => {
        const response = await fetch(`${baseUrl}/tools`);
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.tools).toBeDefined();
        expect(data.tools).toHaveLength(3);
        const toolNames = data.tools.map((t) => t.name);
        expect(toolNames).toContain('generate-blueprint');
        expect(toolNames).toContain('preview-theme');
        expect(toolNames).toContain('export-screen');
    });
    it('should generate blueprint via tool invocation', async () => {
        const response = await fetch(`${baseUrl}/tools/generate-blueprint`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description: 'Test dashboard with user profile',
                layout: 'single-column',
                themeId: 'calm-wellness'
            })
        });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.blueprint).toBeDefined();
        expect(data.previewUrl).toBeDefined();
    });
    it('should preview theme via tool invocation', async () => {
        const response = await fetch(`${baseUrl}/tools/preview-theme`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                themeId: 'premium-editorial'
            })
        });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.theme).toBeDefined();
        expect(data.theme.cssVariables).toBeDefined();
    });
    it('should return validation error for invalid input', async () => {
        const response = await fetch(`${baseUrl}/tools/generate-blueprint`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description: 'Short', // Too short
                layout: 'single-column',
                themeId: 'calm-wellness'
            })
        });
        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data.success).toBe(false);
        expect(data.error).toContain('Validation errors');
    });
    it('should list all themes via API', async () => {
        const response = await fetch(`${baseUrl}/api/themes`);
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.themes).toBeDefined();
        expect(data.themes.length).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=server.test.js.map