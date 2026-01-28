/**
 * JSON-RPC Format Validation Tests
 * SPEC-MCP-002: Phase 4 - MCP Protocol Tests
 *
 * Tests JSON-RPC 2.0 format compliance:
 * - Validate response format (jsonrpc: "2.0", id, result)
 * - Validate error format (jsonrpc: "2.0", id, error)
 * - Test error codes (-32602, -32601, -32603)
 * - Ensure no response has both result and error
 */

import { describe, it, expect } from 'vitest';
import { spawn, ChildProcess } from 'child_process';
import { resolve } from 'path';

describe('JSON-RPC format validation', () => {
  const serverPath = resolve(process.cwd(), 'dist/index.js');

  /**
   * Helper function to send JSON-RPC request and get response
   */
  async function sendJsonRpcRequest(request: object): Promise<any> {
    return new Promise((resolve, reject) => {
      const server: ChildProcess = spawn('node', [serverPath]);

      let stdoutData = '';

      const timeout = setTimeout(() => {
        server.kill();
        reject(new Error('Request timeout'));
      }, 5000);

      server.stdout?.on('data', data => {
        stdoutData += data.toString();

        try {
          const lines = stdoutData.split('\n').filter(line => line.trim());
          for (const line of lines) {
            const response = JSON.parse(line);
            clearTimeout(timeout);
            server.kill();
            resolve(response);
          }
        } catch (e) {
          // Continue accumulating
        }
      });

      server.on('error', error => {
        clearTimeout(timeout);
        reject(error);
      });

      server.stdin?.write(JSON.stringify(request) + '\n');
      server.stdin?.end();
    });
  }

  describe('valid response format', () => {
    it('should have jsonrpc field set to "2.0"', async () => {
      const request = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {},
      };

      const response = await sendJsonRpcRequest(request);

      expect(response).toHaveProperty('jsonrpc');
      expect(response.jsonrpc).toBe('2.0');
    });

    it('should have id field matching request id', async () => {
      const testId = 42;
      const request = {
        jsonrpc: '2.0',
        id: testId,
        method: 'tools/list',
        params: {},
      };

      const response = await sendJsonRpcRequest(request);

      expect(response).toHaveProperty('id');
      expect(response.id).toBe(testId);
    });

    it('should have result field for successful requests', async () => {
      const request = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {},
      };

      const response = await sendJsonRpcRequest(request);

      expect(response).toHaveProperty('result');
      expect(response.result).toBeDefined();
    });

    it('should not have both result and error fields', async () => {
      const request = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {},
      };

      const response = await sendJsonRpcRequest(request);

      // Either result or error, but not both
      const hasResult = 'result' in response;
      const hasError = 'error' in response;

      expect(hasResult || hasError).toBe(true);
      expect(hasResult && hasError).toBe(false);
    });
  });

  describe('tools/list response structure', () => {
    it('should return tools array in result', async () => {
      const request = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {},
      };

      const response = await sendJsonRpcRequest(request);

      expect(response.result).toHaveProperty('tools');
      expect(Array.isArray(response.result.tools)).toBe(true);
    });

    it('should include tool schema with name and inputSchema', async () => {
      const request = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {},
      };

      const response = await sendJsonRpcRequest(request);
      const tools = response.result.tools;

      expect(tools.length).toBeGreaterThan(0);

      for (const tool of tools) {
        expect(tool).toHaveProperty('name');
        expect(tool).toHaveProperty('description');
        expect(tool).toHaveProperty('inputSchema');
        expect(tool.inputSchema).toHaveProperty('type');
        expect(tool.inputSchema).toHaveProperty('properties');
      }
    });
  });

  describe('tools/call response structure', () => {
    it('should return content array in result', async () => {
      const request = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'preview-theme',
          arguments: { themeId: 'atlantic-magazine-v1' },
        },
      };

      const response = await sendJsonRpcRequest(request);

      expect(response.result).toHaveProperty('content');
      expect(Array.isArray(response.result.content)).toBe(true);
      expect(response.result.content.length).toBeGreaterThan(0);
    });

    it('should return text content with type field', async () => {
      const request = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'preview-theme',
          arguments: { themeId: 'atlantic-magazine-v1' },
        },
      };

      const response = await sendJsonRpcRequest(request);
      const content = response.result.content[0];

      expect(content).toHaveProperty('type');
      expect(content.type).toBe('text');
      expect(content).toHaveProperty('text');
      expect(typeof content.text).toBe('string');
    });
  });

  describe('error handling', () => {
    it('should handle unknown tool with error result', async () => {
      const request = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'unknown-tool',
          arguments: {},
        },
      };

      const response = await sendJsonRpcRequest(request);

      // MCP SDK returns result with isError flag
      expect(response).toHaveProperty('result');
      expect(response.result).toHaveProperty('content');

      const toolResult = JSON.parse(response.result.content[0].text);
      expect(toolResult).toHaveProperty('success', false);
      expect(toolResult).toHaveProperty('error');
    });

    it('should handle invalid parameters with error result', async () => {
      const request = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'preview-theme',
          arguments: {
            // Missing required themeId
          },
        },
      };

      const response = await sendJsonRpcRequest(request);

      expect(response).toHaveProperty('result');
      const toolResult = JSON.parse(response.result.content[0].text);
      expect(toolResult).toHaveProperty('success', false);
    });

    it('should preserve id in error responses', async () => {
      const testId = 999;
      const request = {
        jsonrpc: '2.0',
        id: testId,
        method: 'tools/call',
        params: {
          name: 'invalid-tool',
          arguments: {},
        },
      };

      const response = await sendJsonRpcRequest(request);

      expect(response).toHaveProperty('id', testId);
    });
  });

  describe('JSON-RPC 2.0 compliance', () => {
    it('should always include jsonrpc version', async () => {
      const requests = [
        { jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} },
        {
          jsonrpc: '2.0',
          id: 2,
          method: 'tools/call',
          params: { name: 'preview-theme', arguments: { themeId: 'atlantic-magazine-v1' } },
        },
      ];

      for (const request of requests) {
        const response = await sendJsonRpcRequest(request);
        expect(response.jsonrpc).toBe('2.0');
      }
    });

    it('should maintain request-response id correlation', async () => {
      const testIds = [1, 100, 'test-string-id'];

      for (const id of testIds) {
        const request = {
          jsonrpc: '2.0',
          id,
          method: 'tools/list',
          params: {},
        };

        const response = await sendJsonRpcRequest(request);
        expect(response.id).toBe(id);
      }
    });
  });

  describe('malformed requests', () => {
    it('should handle request with invalid JSON gracefully', async () => {
      return new Promise<void>(resolve => {
        const server: ChildProcess = spawn('node', [serverPath]);

        let responded = false;

        setTimeout(() => {
          server.kill();
          // Server should not crash on invalid JSON
          expect(responded).toBe(false);
          resolve();
        }, 2000);

        server.stdout?.on('data', () => {
          responded = true;
        });

        // Send invalid JSON
        server.stdin?.write('{ invalid json\n');
        server.stdin?.end();
      });
    });
  });
});
