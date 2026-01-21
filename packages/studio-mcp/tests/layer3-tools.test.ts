/**
 * Layer 3 MCP Tools Integration Tests
 * SPEC-LAYER3-MVP-001 M2
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getKnowledgeSchema,
  getComponentList,
  renderScreen,
  type ComponentFilter,
} from '../src/component/layer3-tools';
import type { BlueprintResult } from '@tekton/component-generator';
import { readFile, rm, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

describe('TASK-007: knowledge.getSchema', () => {
  it('should return success with schema and usage information', () => {
    const result = getKnowledgeSchema();

    expect(result.success).toBe(true);
    expect(result.schema).toBeDefined();
    expect(result.usage).toBeDefined();
    expect(result.usage.example).toBeDefined();
    expect(result.usage.instructions).toBeDefined();
  });

  it('should return valid BlueprintResultSchema', () => {
    const result = getKnowledgeSchema();

    expect(result.schema.type).toBe('object');
    expect(result.schema.required).toEqual([
      'blueprintId',
      'recipeName',
      'analysis',
      'structure',
    ]);
    expect(result.schema.properties).toBeDefined();
    expect(result.schema.properties.blueprintId).toBeDefined();
    expect(result.schema.properties.recipeName).toBeDefined();
    expect(result.schema.properties.analysis).toBeDefined();
    expect(result.schema.properties.structure).toBeDefined();
  });

  it('should provide valid example blueprint', () => {
    const result = getKnowledgeSchema();
    const example = result.usage.example;

    expect(example.blueprintId).toBeDefined();
    expect(example.recipeName).toBeDefined();
    expect(example.analysis).toBeDefined();
    expect(example.analysis.intent).toBeDefined();
    expect(example.analysis.tone).toBeDefined();
    expect(example.structure).toBeDefined();
    expect(example.structure.componentName).toBeDefined();
  });

  it('should complete in under 50ms', () => {
    const startTime = performance.now();
    getKnowledgeSchema();
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(50);
  });

  it('should include usage instructions', () => {
    const result = getKnowledgeSchema();

    expect(result.usage.instructions).toContain('blueprintId');
    expect(result.usage.instructions).toContain('recipeName');
    expect(result.usage.instructions).toContain('analysis');
    expect(result.usage.instructions).toContain('structure');
  });
});

describe('TASK-008: knowledge.getComponentList', () => {
  it('should return success with component list', () => {
    const result = getComponentList();

    expect(result.success).toBe(true);
    expect(result.components).toBeDefined();
    expect(Array.isArray(result.components)).toBe(true);
    expect(result.count).toBeGreaterThan(0);
    expect(result.count).toBe(result.components.length);
  });

  it('should return components with required fields', () => {
    const result = getComponentList();

    result.components.forEach((component) => {
      expect(component.name).toBeDefined();
      expect(typeof component.name).toBe('string');
      expect(component.description).toBeDefined();
      expect(typeof component.description).toBe('string');
    });
  });

  it('should filter by category', () => {
    const filter: ComponentFilter = { category: 'layout' };
    const result = getComponentList(filter);

    expect(result.success).toBe(true);
    expect(result.components.every((c) => c.category === 'layout')).toBe(true);
  });

  it('should filter by hasSlot', () => {
    const filter: ComponentFilter = { hasSlot: 'header' };
    const result = getComponentList(filter);

    expect(result.success).toBe(true);
    expect(
      result.components.every((c) => c.slots?.includes('header'))
    ).toBe(true);
  });

  it('should filter by both category and hasSlot', () => {
    const filter: ComponentFilter = {
      category: 'layout',
      hasSlot: 'header',
    };
    const result = getComponentList(filter);

    expect(result.success).toBe(true);
    expect(result.components.every((c) => c.category === 'layout')).toBe(true);
    expect(
      result.components.every((c) => c.slots?.includes('header'))
    ).toBe(true);
  });

  it('should return empty list for non-matching filter', () => {
    const filter: ComponentFilter = { category: 'nonexistent' };
    const result = getComponentList(filter);

    expect(result.success).toBe(true);
    expect(result.components).toEqual([]);
    expect(result.count).toBe(0);
  });

  it('should complete in under 30ms', () => {
    const startTime = performance.now();
    getComponentList();
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(30);
  });

  it('should return lightweight component data', () => {
    const result = getComponentList();

    result.components.forEach((component) => {
      // Check it only has lightweight fields
      const keys = Object.keys(component);
      const allowedKeys = ['name', 'description', 'category', 'slots', 'props'];
      keys.forEach((key) => {
        expect(allowedKeys).toContain(key);
      });
    });
  });
});

describe('TASK-009: knowledge.renderScreen', () => {
  const testOutputDir = join(process.cwd(), 'test-output');
  const validBlueprint: BlueprintResult = {
    blueprintId: 'test-001',
    recipeName: 'test-profile',
    analysis: {
      intent: 'Test user profile',
      tone: 'professional',
    },
    structure: {
      componentName: 'Card',
      props: {
        variant: 'elevated',
      },
      slots: {
        header: {
          componentName: 'Button',
          props: {
            variant: 'primary',
            label: 'Profile',
          },
        },
      },
    },
  };

  beforeEach(async () => {
    // Ensure test output directory exists
    await mkdir(testOutputDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up test output directory
    if (existsSync(testOutputDir)) {
      await rm(testOutputDir, { recursive: true, force: true });
    }
  });

  it('should generate code from valid blueprint', async () => {
    const result = await renderScreen(validBlueprint);

    expect(result.success).toBe(true);
    expect(result.code).toBeDefined();
    expect(result.filePath).toBeDefined();
  });

  it('should write file to default path', async () => {
    const outputPath = join(testOutputDir, 'test-profile', 'page.tsx');
    const result = await renderScreen(validBlueprint, outputPath);

    expect(result.success).toBe(true);
    expect(result.filePath).toBe(outputPath);
    expect(existsSync(outputPath)).toBe(true);
  });

  it('should write file to custom path', async () => {
    const customPath = join(testOutputDir, 'custom', 'component.tsx');
    const result = await renderScreen(validBlueprint, customPath);

    expect(result.success).toBe(true);
    expect(result.filePath).toBe(customPath);
    expect(existsSync(customPath)).toBe(true);
  });

  it('should create directories if they do not exist', async () => {
    const deepPath = join(testOutputDir, 'a', 'b', 'c', 'page.tsx');
    const result = await renderScreen(validBlueprint, deepPath);

    expect(result.success).toBe(true);
    expect(existsSync(deepPath)).toBe(true);
  });

  it('should return error for invalid blueprint (missing blueprintId)', async () => {
    const invalidBlueprint = {
      recipeName: 'test',
      analysis: { intent: 'test', tone: 'test' },
      structure: { componentName: 'Card', props: {} },
    } as any;

    const result = await renderScreen(invalidBlueprint);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.errorCode).toBe('INVALID_BLUEPRINT');
  });

  it('should return error for invalid blueprint (missing recipeName)', async () => {
    const invalidBlueprint = {
      blueprintId: 'test-001',
      analysis: { intent: 'test', tone: 'test' },
      structure: { componentName: 'Card', props: {} },
    } as any;

    const result = await renderScreen(invalidBlueprint);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.errorCode).toBe('INVALID_BLUEPRINT');
  });

  it('should return error for invalid blueprint (missing structure)', async () => {
    const invalidBlueprint = {
      blueprintId: 'test-001',
      recipeName: 'test',
      analysis: { intent: 'test', tone: 'test' },
    } as any;

    const result = await renderScreen(invalidBlueprint);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.errorCode).toBe('INVALID_BLUEPRINT');
  });

  it('should generate valid TypeScript code', async () => {
    const outputPath = join(testOutputDir, 'valid-tsx', 'page.tsx');
    const result = await renderScreen(validBlueprint, outputPath);

    expect(result.success).toBe(true);
    expect(result.code).toBeDefined();

    // Check code contains expected elements
    const code = result.code!;
    expect(code).toContain('export default');
    expect(code).toContain('function');
  });

  it('should write correct file content', async () => {
    const outputPath = join(testOutputDir, 'file-content', 'page.tsx');
    const result = await renderScreen(validBlueprint, outputPath);

    expect(result.success).toBe(true);

    // Read file and verify content matches returned code
    const fileContent = await readFile(outputPath, 'utf-8');
    expect(fileContent).toBe(result.code);
  });

  it('should return structured error codes', async () => {
    const invalidBlueprint = {
      blueprintId: 'test',
      recipeName: 'test',
      analysis: { intent: 'test', tone: 'test' },
    } as any;

    const result = await renderScreen(invalidBlueprint);

    expect(result.success).toBe(false);
    expect(result.errorCode).toBeDefined();
    expect(['INVALID_BLUEPRINT', 'GENERATION_FAILED', 'FILE_WRITE_ERROR', 'UNEXPECTED_ERROR']).toContain(
      result.errorCode
    );
  });
});

describe('End-to-End MCP Workflow', () => {
  const testOutputDir = join(process.cwd(), 'test-e2e-output');

  beforeEach(async () => {
    await mkdir(testOutputDir, { recursive: true });
  });

  afterEach(async () => {
    if (existsSync(testOutputDir)) {
      await rm(testOutputDir, { recursive: true, force: true });
    }
  });

  it('should complete full workflow: schema -> list -> render', async () => {
    // Step 1: Get schema
    const schemaResult = getKnowledgeSchema();
    expect(schemaResult.success).toBe(true);

    // Step 2: Get component list to understand available components
    const listResult = getComponentList({ category: 'layout' });
    expect(listResult.success).toBe(true);
    expect(listResult.components.length).toBeGreaterThan(0);

    // Step 3: Create blueprint using schema knowledge
    const blueprint: BlueprintResult = {
      blueprintId: 'e2e-test-001',
      recipeName: 'e2e-test-screen',
      analysis: {
        intent: 'End-to-end test screen',
        tone: 'professional',
      },
      structure: {
        componentName: listResult.components[0].name,
        props: {
          padding: 'large',
        },
      },
    };

    // Step 4: Render screen
    const outputPath = join(testOutputDir, 'e2e-screen', 'page.tsx');
    const renderResult = await renderScreen(blueprint, outputPath);

    expect(renderResult.success).toBe(true);
    expect(renderResult.filePath).toBe(outputPath);
    expect(existsSync(outputPath)).toBe(true);
  });
});

describe('TASK-006: renderScreen Theme Support', () => {
  const testOutputDir = join(process.cwd(), 'test-theme-output');

  const blueprintWithTheme: BlueprintResult = {
    blueprintId: 'theme-test-001',
    recipeName: 'themed-profile',
    themeId: 'energetic-bright',
    analysis: {
      intent: 'Test themed user profile',
      tone: 'professional',
    },
    structure: {
      componentName: 'Card',
      props: {
        variant: 'elevated',
      },
    },
  };

  beforeEach(async () => {
    await mkdir(testOutputDir, { recursive: true });
  });

  afterEach(async () => {
    if (existsSync(testOutputDir)) {
      await rm(testOutputDir, { recursive: true, force: true });
    }
  });

  it('should use calm-wellness as default theme when no theme specified', async () => {
    const blueprint: BlueprintResult = {
      blueprintId: 'default-theme-001',
      recipeName: 'default-themed',
      analysis: { intent: 'Test', tone: 'calm' },
      structure: { componentName: 'Card', props: {} },
    };

    const outputPath = join(testOutputDir, 'default-theme', 'page.tsx');
    const result = await renderScreen(blueprint, { outputPath });

    expect(result.success).toBe(true);
    expect(result.themeApplied).toBe('calm-wellness');
    expect(result.code).toBeDefined();
  });

  it('should respect blueprint.themeId when provided', async () => {
    const outputPath = join(testOutputDir, 'blueprint-theme', 'page.tsx');
    const result = await renderScreen(blueprintWithTheme, { outputPath });

    expect(result.success).toBe(true);
    expect(result.themeApplied).toBe('energetic-bright');
    expect(result.code).toBeDefined();
  });

  it('should respect options.themeId over blueprint.themeId', async () => {
    const outputPath = join(testOutputDir, 'options-override', 'page.tsx');
    const result = await renderScreen(blueprintWithTheme, {
      outputPath,
      themeId: 'minimal-monochrome',
    });

    expect(result.success).toBe(true);
    expect(result.themeApplied).toBe('minimal-monochrome');
    expect(result.code).toBeDefined();
  });

  it('should report themeApplied in response', async () => {
    const outputPath = join(testOutputDir, 'theme-report', 'page.tsx');
    const result = await renderScreen(blueprintWithTheme, {
      outputPath,
      themeId: 'calm-wellness',
    });

    expect(result.success).toBe(true);
    expect(result.themeApplied).toBeDefined();
    expect(typeof result.themeApplied).toBe('string');
  });

  it('should work with options=undefined for backward compatibility', async () => {
    const blueprint: BlueprintResult = {
      blueprintId: 'backward-compat-001',
      recipeName: 'backward-compat',
      analysis: { intent: 'Test', tone: 'calm' },
      structure: { componentName: 'Card', props: {} },
    };

    const result = await renderScreen(blueprint);

    expect(result.success).toBe(true);
    expect(result.themeApplied).toBe('calm-wellness');
  });

  it('should work with string outputPath for backward compatibility', async () => {
    const blueprint: BlueprintResult = {
      blueprintId: 'backward-compat-002',
      recipeName: 'backward-compat-string',
      analysis: { intent: 'Test', tone: 'calm' },
      structure: { componentName: 'Card', props: {} },
    };

    const outputPath = join(testOutputDir, 'backward-string', 'page.tsx');
    const result = await renderScreen(blueprint, outputPath);

    expect(result.success).toBe(true);
    expect(result.themeApplied).toBe('calm-wellness');
    expect(existsSync(outputPath)).toBe(true);
  });

  it('should pass themeId to JSXGenerator', async () => {
    const outputPath = join(testOutputDir, 'theme-passed', 'page.tsx');
    const result = await renderScreen(blueprintWithTheme, {
      outputPath,
      themeId: 'calm-wellness',
    });

    expect(result.success).toBe(true);
    expect(result.themeApplied).toBe('calm-wellness');
    expect(result.code).toBeDefined();
    // Note: CSS variable injection is verified in TASK-005 tests
    // This test only verifies that themeId is correctly passed through the pipeline
  });
});

describe('Performance Requirements', () => {
  it('all MCP tools should meet performance targets', () => {
    // TASK-007: <50ms
    const schema1Start = performance.now();
    getKnowledgeSchema();
    const schema1Time = performance.now() - schema1Start;
    expect(schema1Time).toBeLessThan(50);

    // TASK-008: <30ms
    const list1Start = performance.now();
    getComponentList();
    const list1Time = performance.now() - list1Start;
    expect(list1Time).toBeLessThan(30);

    // Run multiple times to ensure consistency
    const schema2Start = performance.now();
    getKnowledgeSchema();
    const schema2Time = performance.now() - schema2Start;
    expect(schema2Time).toBeLessThan(50);

    const list2Start = performance.now();
    getComponentList({ category: 'layout' });
    const list2Time = performance.now() - list2Start;
    expect(list2Time).toBeLessThan(30);
  });
});
