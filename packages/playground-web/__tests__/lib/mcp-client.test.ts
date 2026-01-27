/**
 * MCP Client Tests
 * SPEC-PLAYGROUND-001 Milestone 7: Integration Testing
 *
 * Test Coverage:
 * - sendMcpRequest() - MCP protocol request handling
 * - generateBlueprint() - Blueprint generation endpoint
 * - fetchBlueprint() - Blueprint fetch with validation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendMcpRequest, generateBlueprint, fetchBlueprint } from '@/lib/mcp-client';

// Mock global fetch
global.fetch = vi.fn();

describe('MCP Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendMcpRequest()', () => {
    it('should send POST request with correct headers', async () => {
      const mockResponse = { result: { success: true } };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const request = {
        method: 'test-method',
        params: { key: 'value' },
      };

      await sendMcpRequest(request);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/mcp'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        })
      );
    });

    it('should return result on success', async () => {
      const mockResult = { data: 'test-data' };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: mockResult }),
      });

      const response = await sendMcpRequest({ method: 'test' });

      expect(response.result).toEqual(mockResult);
      expect(response.error).toBeUndefined();
    });

    it('should return error on HTTP error', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const response = await sendMcpRequest({ method: 'test' });

      expect(response.error).toBeDefined();
      expect(response.error?.code).toBe(-32603);
      expect(response.error?.message).toContain('HTTP error');
    });

    it('should return error on network failure', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      const response = await sendMcpRequest({ method: 'test' });

      expect(response.error).toBeDefined();
      expect(response.error?.code).toBe(-32603);
      expect(response.error?.message).toBe('Network error');
    });

    it('should handle non-Error exceptions', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce('string error');

      const response = await sendMcpRequest({ method: 'test' });

      expect(response.error).toBeDefined();
      expect(response.error?.message).toBe('Unknown error');
    });
  });

  describe('generateBlueprint()', () => {
    it('should call sendMcpRequest with correct method', async () => {
      const mockResponse = { result: { blueprintId: '123' } };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const params = {
        brandName: 'Test Brand',
        primaryColor: '#ff0000',
        accentColor: '#00ff00',
      };

      await generateBlueprint(params);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('generate-blueprint'),
        })
      );
    });
  });

  describe('fetchBlueprint()', () => {
    const validBlueprint = {
      id: 'test-blueprint',
      name: 'Test Blueprint',
      themeId: 'test-theme',
      layout: 'single-column' as const,
      components: [],
    };

    it('should fetch and validate blueprint', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => validBlueprint,
      });

      const result = await fetchBlueprint('20260127-123456');

      expect(result).toEqual(validBlueprint);
    });

    it('should return null on 404', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await fetchBlueprint('non-existent');

      expect(result).toBeNull();
    });

    it('should return null on validation failure', async () => {
      const invalidData = {
        id: 'test',
        // Missing required fields
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => invalidData,
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await fetchBlueprint('20260127-123456');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should return null on network error', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await fetchBlueprint('20260127-123456');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should use correct API endpoint', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => validBlueprint,
      });

      await fetchBlueprint('20260127-123456');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/blueprints/20260127-123456'),
        expect.objectContaining({
          next: { revalidate: 3600 },
        })
      );
    });
  });
});
