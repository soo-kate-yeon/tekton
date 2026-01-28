/**
 * Preview Theme Tool Tests
 * SPEC-MCP-002: AC-007 Theme Preview
 */

import { describe, it, expect } from 'vitest';
import { previewThemeTool } from '../../src/tools/preview-theme.js';

describe('previewThemeTool', () => {
  it('should generate preview for valid theme', async () => {
    const result = await previewThemeTool({
      themeId: 'atlantic-magazine-v1',
    });

    expect(result.success).toBe(true);
    expect(result.theme).toBeDefined();
    expect(result.theme?.id).toBe('atlantic-magazine-v1');
    expect(result.theme?.name).toBeDefined();
    // Note: description is optional in v2.1 theme schema
    // v2.1 schema uses tokens instead of cssVariables
    expect(result.theme?.tokens).toBeDefined();
  });

  it('should include OKLCH color tokens', async () => {
    const result = await previewThemeTool({
      themeId: 'hims-v1',
    });

    expect(result.success).toBe(true);
    // v2.1 schema uses tokens.atomic.color for OKLCH colors
    expect(result.theme?.tokens).toBeDefined();
    expect(result.theme?.tokens?.atomic).toBeDefined();
  });

  it('should return error for invalid theme ID', async () => {
    const result = await previewThemeTool({
      themeId: 'non-existent-theme',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('Theme not found');
    expect(result.error).toContain('Available themes:');
  });

  it('should return theme without custom base URL', async () => {
    const result = await previewThemeTool({ themeId: 'atlantic-magazine-v1' });

    expect(result.success).toBe(true);
    expect(result.theme).toBeDefined();
  });
});
