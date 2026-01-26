/**
 * stdio Transport Communication Tests
 * SPEC-MCP-002: Phase 4 - MCP Protocol Tests
 *
 * Tests stdio transport communication:
 * - Spawn server process and send JSON-RPC via stdin
 * - Read JSON-RPC from stdout
 * - Verify tools/list works
 * - Verify tools/call works
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { spawn } from 'child_process';
import { resolve } from 'path';
describe('stdio transport', () => {
    let serverPath;
    beforeAll(async () => {
        // Path to the built server
        serverPath = resolve(process.cwd(), 'dist/index.js');
    });
    /**
     * Helper function to spawn server and send/receive JSON-RPC messages
     */
    async function sendRequest(request) {
        return new Promise((resolve, reject) => {
            const server = spawn('node', [serverPath]);
            let stdoutData = '';
            let _stderrData = '';
            const timeout = setTimeout(() => {
                server.kill();
                reject(new Error('Request timeout'));
            }, 5000);
            server.stdout?.on('data', data => {
                stdoutData += data.toString();
                // Try to parse complete JSON-RPC response
                try {
                    const lines = stdoutData.split('\n').filter(line => line.trim());
                    for (const line of lines) {
                        const response = JSON.parse(line);
                        clearTimeout(timeout);
                        server.kill();
                        resolve(response);
                    }
                }
                catch (e) {
                    // Continue accumulating data
                }
            });
            server.stderr?.on('data', data => {
                _stderrData += data.toString();
            });
            server.on('error', error => {
                clearTimeout(timeout);
                reject(error);
            });
            // Send request via stdin
            server.stdin?.write(JSON.stringify(request) + '\n');
            server.stdin?.end();
        });
    }
    it('should handle tools/list request', async () => {
        const request = {
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/list',
            params: {},
        };
        const response = await sendRequest(request);
        // Verify JSON-RPC 2.0 format
        expect(response).toHaveProperty('jsonrpc', '2.0');
        expect(response).toHaveProperty('id', 1);
        expect(response).toHaveProperty('result');
        // Verify tools list
        expect(response.result).toHaveProperty('tools');
        expect(Array.isArray(response.result.tools)).toBe(true);
        expect(response.result.tools).toHaveLength(3);
        // Verify tool names
        const toolNames = response.result.tools.map((t) => t.name);
        expect(toolNames).toContain('generate-blueprint');
        expect(toolNames).toContain('preview-theme');
        expect(toolNames).toContain('export-screen');
    });
    it('should handle tools/call request for preview-theme', async () => {
        const request = {
            jsonrpc: '2.0',
            id: 2,
            method: 'tools/call',
            params: {
                name: 'preview-theme',
                arguments: {
                    themeId: 'calm-wellness',
                },
            },
        };
        const response = await sendRequest(request);
        // Verify JSON-RPC 2.0 format
        expect(response).toHaveProperty('jsonrpc', '2.0');
        expect(response).toHaveProperty('id', 2);
        expect(response).toHaveProperty('result');
        // Verify result content
        expect(response.result).toHaveProperty('content');
        expect(Array.isArray(response.result.content)).toBe(true);
        expect(response.result.content[0]).toHaveProperty('type', 'text');
        expect(response.result.content[0]).toHaveProperty('text');
        // Parse tool result
        const toolResult = JSON.parse(response.result.content[0].text);
        expect(toolResult).toHaveProperty('success', true);
        expect(toolResult).toHaveProperty('theme');
        expect(toolResult.theme).toHaveProperty('id', 'calm-wellness');
    });
    it('should handle tools/call request with invalid tool name', async () => {
        const request = {
            jsonrpc: '2.0',
            id: 3,
            method: 'tools/call',
            params: {
                name: 'non-existent-tool',
                arguments: {},
            },
        };
        const response = await sendRequest(request);
        // Verify JSON-RPC 2.0 error format
        expect(response).toHaveProperty('jsonrpc', '2.0');
        expect(response).toHaveProperty('id', 3);
        expect(response).toHaveProperty('result');
        // Verify error content
        expect(response.result).toHaveProperty('content');
        const toolResult = JSON.parse(response.result.content[0].text);
        expect(toolResult).toHaveProperty('success', false);
        expect(toolResult).toHaveProperty('error');
        expect(toolResult.error).toContain('Unknown tool');
    });
    it('should handle tools/call with missing required parameters', async () => {
        const request = {
            jsonrpc: '2.0',
            id: 4,
            method: 'tools/call',
            params: {
                name: 'preview-theme',
                arguments: {},
            },
        };
        const response = await sendRequest(request);
        // Should return error result
        expect(response).toHaveProperty('jsonrpc', '2.0');
        expect(response).toHaveProperty('id', 4);
        expect(response).toHaveProperty('result');
        const toolResult = JSON.parse(response.result.content[0].text);
        expect(toolResult).toHaveProperty('success', false);
        expect(toolResult).toHaveProperty('error');
    });
    it('should send logs to stderr, not stdout', async () => {
        return new Promise((resolve, reject) => {
            const server = spawn('node', [serverPath]);
            const stdoutLines = [];
            const stderrLines = [];
            let receivedResponse = false;
            const timeout = setTimeout(() => {
                server.kill();
                // Verify stderr contains logs
                expect(stderrLines.length).toBeGreaterThan(0);
                expect(stderrLines.some(line => line.includes('[INFO]'))).toBe(true);
                // Verify stdout only contains JSON-RPC
                for (const line of stdoutLines) {
                    if (line.trim()) {
                        expect(() => JSON.parse(line)).not.toThrow();
                    }
                }
                resolve(undefined);
            }, 3000);
            server.stdout?.on('data', data => {
                const lines = data
                    .toString()
                    .split('\n')
                    .filter((l) => l.trim());
                stdoutLines.push(...lines);
                if (!receivedResponse && lines.length > 0) {
                    receivedResponse = true;
                }
            });
            server.stderr?.on('data', data => {
                const lines = data
                    .toString()
                    .split('\n')
                    .filter((l) => l.trim());
                stderrLines.push(...lines);
            });
            server.on('error', error => {
                clearTimeout(timeout);
                reject(error);
            });
            // Send a request to trigger logs
            const request = {
                jsonrpc: '2.0',
                id: 1,
                method: 'tools/list',
                params: {},
            };
            server.stdin?.write(JSON.stringify(request) + '\n');
            server.stdin?.end();
        });
    });
});
//# sourceMappingURL=stdio-transport.test.js.map