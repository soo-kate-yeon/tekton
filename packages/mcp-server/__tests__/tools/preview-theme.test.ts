/**
 * Preview Theme Tool Tests
 * SPEC-MCP-002: AC-007 Theme Preview
 */

import { describe, it, expect } from 'vitest';
import { previewThemeTool } from '../../src/tools/preview-theme.js';

describe('previewThemeTool', () => {
  it('should generate preview for valid theme', async () => {
    const result = await previewThemeTool({
      themeId: 'calm-wellness'
    });

    expect(result.success).toBe(true);
    expect(result.theme).toBeDefined();
    expect(result.theme?.id).toBe('calm-wellness');
    expect(result.theme?.name).toBeDefined();
    expect(result.theme?.description).toBeDefined();
    expect(result.theme?.cssVariables).toBeDefined();
    expect(result.previewUrl).toMatch(/\/preview\/\d+\/calm-wellness$/);
  });

  it('should include OKLCH CSS variables', async () => {
    const result = await previewThemeTool({
      themeId: 'premium-editorial'
    });

    expect(result.success).toBe(true);
    expect(result.theme?.cssVariables).toBeDefined();

    // Check for CSS variable format (SPEC: OKLCH Color Space)
    const cssVars = result.theme?.cssVariables || {};
    const primaryColor = cssVars['--color-primary'];
    expect(primaryColor).toMatch(/oklch\(/);
  });

  it('should return error for invalid theme ID', async () => {
    const result = await previewThemeTool({
      themeId: 'non-existent-theme'
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('Theme not found');
    expect(result.error).toContain('Available themes:');
  });

  it('should accept custom base URL', async () => {
    const result = await previewThemeTool(
      { themeId: 'calm-wellness' },
      { baseUrl: 'https://custom.domain' }
    );

    expect(result.success).toBe(true);
    expect(result.previewUrl).toMatch(/^https:\/\/custom\.domain/);
  });
});
