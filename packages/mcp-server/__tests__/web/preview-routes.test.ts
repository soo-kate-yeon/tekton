/**
 * Preview Routes Tests
 * SPEC-MCP-002: AC-009 Preview URL Access, AC-010 Real-Time Theme Switch
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { startServer } from '../../src/server.js';
import type { Server } from 'http';

describe('Preview Routes', () => {
  let server: Server;
  const baseUrl = 'http://localhost:3002';

  beforeAll(() => {
    server = startServer({ port: 3002, host: 'localhost', baseUrl });
  });

  afterAll(() => {
    server.close();
  });

  it('should serve preview page with theme CSS variables', async () => {
    const response = await fetch(`${baseUrl}/preview/1738123456789/calm-wellness`);
    expect(response.status).toBe(200);

    const html = await response.text();
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<style>');
    expect(html).toContain(':root {');
    expect(html).toContain('--color-');
    expect(html).toContain('data-timestamp="1738123456789"');
    expect(html).toContain('data-theme-id="calm-wellness"');
    expect(html).toContain('window.__TEKTON_PREVIEW__');
  });

  it('should include OKLCH CSS variables in preview page', async () => {
    const response = await fetch(`${baseUrl}/preview/1738123456790/premium-editorial`);
    expect(response.status).toBe(200);

    const html = await response.text();
    expect(html).toContain('oklch(');
  });

  it('should switch theme without changing blueprint', async () => {
    const timestamp = '1738123456789';

    // Request with theme 1
    const response1 = await fetch(`${baseUrl}/preview/${timestamp}/calm-wellness`);
    const html1 = await response1.text();

    // Request with theme 2 (same timestamp)
    const response2 = await fetch(`${baseUrl}/preview/${timestamp}/dynamic-fitness`);
    const html2 = await response2.text();

    // Both should have same timestamp
    expect(html1).toContain(`data-timestamp="${timestamp}"`);
    expect(html2).toContain(`data-timestamp="${timestamp}"`);

    // But different theme IDs
    expect(html1).toContain('data-theme-id="calm-wellness"');
    expect(html2).toContain('data-theme-id="dynamic-fitness"');

    // And different CSS variables
    expect(html1).not.toContain(html2);
  });

  it('should return 404 for invalid theme ID', async () => {
    const response = await fetch(`${baseUrl}/preview/1738123456789/invalid-theme`);
    expect(response.status).toBe(404);

    const html = await response.text();
    expect(html).toContain('Theme not found');
  });

  it('should include CORS headers for playground access', async () => {
    const response = await fetch(`${baseUrl}/preview/1738123456789/calm-wellness`);
    expect(response.headers.get('access-control-allow-origin')).toBe('*');
  });
});
