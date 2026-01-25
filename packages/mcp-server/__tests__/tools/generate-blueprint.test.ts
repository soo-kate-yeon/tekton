/**
 * Generate Blueprint Tool Tests
 * SPEC-MCP-002: AC-006 Blueprint Generation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { rmSync } from 'fs';
import { generateBlueprintTool } from '../../src/tools/generate-blueprint.js';
import { getDefaultStorage } from '../../src/storage/blueprint-storage.js';

describe('generateBlueprintTool', () => {
  const testStorageDir = '.tekton-test/blueprints';

  beforeEach(() => {
    // Clean up test storage
    try {
      rmSync(testStorageDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore errors
    }
  });

  afterEach(() => {
    // Clean up after tests
    try {
      rmSync(testStorageDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore errors
    }
  });

  it('should generate blueprint from description with component hints', async () => {
    const result = await generateBlueprintTool({
      description: 'User profile dashboard with avatar and bio',
      layout: 'sidebar-left',
      themeId: 'calm-wellness',
      componentHints: ['Card', 'Avatar', 'Text']
    });

    expect(result.success).toBe(true);
    expect(result.blueprint).toBeDefined();
    expect(result.blueprint?.layout).toBe('sidebar-left');
    expect(result.blueprint?.themeId).toBe('calm-wellness');
    expect(result.blueprint?.components).toBeDefined();
    expect(result.blueprint?.components.length).toBeGreaterThan(0);
    expect(result.blueprint?.timestamp).toBeDefined();
    expect(result.previewUrl).toMatch(/\/preview\/[^/]+\/calm-wellness$/);
  });

  it('should extract components from description keywords', async () => {
    const result = await generateBlueprintTool({
      description: 'A dashboard with a card showing user profile information and a button to edit settings',
      layout: 'single-column',
      themeId: 'dynamic-fitness'
    });

    expect(result.success).toBe(true);
    expect(result.blueprint).toBeDefined();

    const componentTypes = result.blueprint?.components.map(c => c.type) || [];
    expect(componentTypes).toContain('Card');
    expect(componentTypes).toContain('Button');
  });

  it('should return error for invalid theme ID', async () => {
    const result = await generateBlueprintTool({
      description: 'Test dashboard',
      layout: 'single-column',
      themeId: 'invalid-theme'
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('Theme not found');
    expect(result.error).toContain('Available themes:');
  });

  it('should save blueprint to storage', async () => {
    const result = await generateBlueprintTool({
      description: 'Simple test screen',
      layout: 'single-column',
      themeId: 'calm-wellness'
    });

    expect(result.success).toBe(true);
    expect(result.blueprint?.id).toBeDefined();

    // Verify blueprint was saved
    const storage = getDefaultStorage();
    const loaded = await storage.loadBlueprint(result.blueprint!.id);
    expect(loaded).toBeDefined();
    expect(loaded?.themeId).toBe('calm-wellness');
  });

  it('should generate unique blueprint IDs', async () => {
    const result1 = await generateBlueprintTool({
      description: 'First screen',
      layout: 'single-column',
      themeId: 'calm-wellness'
    });

    const result2 = await generateBlueprintTool({
      description: 'Second screen',
      layout: 'single-column',
      themeId: 'calm-wellness'
    });

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    expect(result1.blueprint?.id).not.toBe(result2.blueprint?.id);
  });
});
