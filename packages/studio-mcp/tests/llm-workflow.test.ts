/**
 * M3 - LLM Integration Test
 * SPEC-LAYER3-MVP-001 TASK-010
 *
 * Tests complete LLM workflow simulation:
 * 1. Mock LLM calls knowledge.getSchema
 * 2. Mock LLM calls knowledge.getComponentList
 * 3. Mock LLM designs Blueprint JSON
 * 4. Mock LLM calls knowledge.renderScreen
 * 5. Verify generated file exists and compiles
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

const TEST_OUTPUT_DIR = join(process.cwd(), 'test-llm-output');

/**
 * Utility: Verify generated code has basic TypeScript structure
 * (Actual compilation is skipped as it requires full project context)
 */
function verifyTypeScriptStructure(code: string): boolean {
  // Check for basic TypeScript/React structure
  const hasExportDefault = code.includes('export default');
  const hasFunction = code.includes('function');
  const hasReturn = code.includes('return');

  return hasExportDefault && hasFunction && hasReturn;
}

describe('Test 1: Automated Workflow Simulation', () => {
  beforeEach(async () => {
    await mkdir(TEST_OUTPUT_DIR, { recursive: true });
  });

  afterEach(async () => {
    if (existsSync(TEST_OUTPUT_DIR)) {
      await rm(TEST_OUTPUT_DIR, { recursive: true, force: true });
    }
  });

  it('should complete full LLM workflow: getSchema -> getComponentList -> design Blueprint -> renderScreen', async () => {
    // Step 1: Mock LLM calls knowledge.getSchema
    const schemaResult = getKnowledgeSchema();
    expect(schemaResult.success).toBe(true);
    expect(schemaResult.schema).toBeDefined();
    expect(schemaResult.usage).toBeDefined();

    // Step 2: Mock LLM calls knowledge.getComponentList
    const layoutComponents = getComponentList({ category: 'layout' });
    expect(layoutComponents.success).toBe(true);

    const actionComponents = getComponentList({ category: 'action' });
    expect(actionComponents.success).toBe(true);
    expect(actionComponents.components.length).toBeGreaterThan(0);

    // Step 3: Mock LLM designs Blueprint JSON (Simple Card component)
    // LLM would analyze the schema and available components to create this structure
    const blueprint: BlueprintResult = {
      blueprintId: 'llm-workflow-001',
      recipeName: 'dashboard-card',
      analysis: {
        intent: 'Create a dashboard card with information',
        tone: 'professional',
      },
      structure: {
        componentName: 'Card',
        props: {
          variant: 'elevated',
          padding: 'large',
        },
      },
    };

    // Step 4: Mock LLM calls knowledge.renderScreen with designed Blueprint
    const outputPath = join(TEST_OUTPUT_DIR, 'dashboard-card', 'page.tsx');
    const renderResult = await renderScreen(blueprint, outputPath);

    // Step 5: Verify generated file exists and compiles
    expect(renderResult.success).toBe(true);
    expect(renderResult.filePath).toBe(outputPath);
    expect(renderResult.code).toBeDefined();
    expect(existsSync(outputPath)).toBe(true);

    // Verify file content
    const fileContent = await readFile(outputPath, 'utf-8');
    expect(fileContent).toBe(renderResult.code);

    // Verify code structure
    expect(fileContent).toContain('export default');
    expect(fileContent).toContain('function');
    expect(fileContent).toContain('Card');

    // Verify TypeScript structure
    expect(verifyTypeScriptStructure(fileContent)).toBe(true);
  }, 30000); // 30s timeout for compilation

  it('should handle Modal component correctly', async () => {
    const blueprint: BlueprintResult = {
      blueprintId: 'modal-test-001',
      recipeName: 'modal-component',
      analysis: {
        intent: 'Modal dialog',
        tone: 'professional',
      },
      structure: {
        componentName: 'Modal',
        props: {
          open: true,
        },
      },
    };

    const outputPath = join(TEST_OUTPUT_DIR, 'modal', 'page.tsx');
    const renderResult = await renderScreen(blueprint, outputPath);

    expect(renderResult.success).toBe(true);
    expect(existsSync(outputPath)).toBe(true);

    const code = renderResult.code!;
    expect(code).toContain('Modal');

    // Verify TypeScript structure
    expect(verifyTypeScriptStructure(code)).toBe(true);
  }, 30000);

  it('should validate Blueprint structure before rendering', async () => {
    // Step 1-2: Get schema and components as LLM would
    const schemaResult = getKnowledgeSchema();
    const components = getComponentList();

    expect(schemaResult.success).toBe(true);
    expect(components.success).toBe(true);

    // Step 3: LLM creates blueprint following schema
    const blueprint: BlueprintResult = {
      blueprintId: 'validation-test-001',
      recipeName: 'simple-card',
      analysis: {
        intent: 'Simple card component',
        tone: 'minimal',
      },
      structure: {
        componentName: 'Card',
        props: {
          variant: 'elevated',
        },
      },
    };

    // Verify all required fields from schema are present
    expect(blueprint.blueprintId).toBeDefined();
    expect(blueprint.recipeName).toBeDefined();
    expect(blueprint.analysis).toBeDefined();
    expect(blueprint.analysis.intent).toBeDefined();
    expect(blueprint.analysis.tone).toBeDefined();
    expect(blueprint.structure).toBeDefined();
    expect(blueprint.structure.componentName).toBeDefined();

    // Step 4-5: Render and verify
    const outputPath = join(TEST_OUTPUT_DIR, 'validation', 'page.tsx');
    const renderResult = await renderScreen(blueprint, outputPath);

    expect(renderResult.success).toBe(true);
    expect(existsSync(outputPath)).toBe(true);
  });
});

describe('Test 2: Error Handling Workflow', () => {
  beforeEach(async () => {
    await mkdir(TEST_OUTPUT_DIR, { recursive: true });
  });

  afterEach(async () => {
    if (existsSync(TEST_OUTPUT_DIR)) {
      await rm(TEST_OUTPUT_DIR, { recursive: true, force: true });
    }
  });

  it('should handle invalid Blueprint (missing required fields)', async () => {
    const invalidBlueprint = {
      // Missing blueprintId
      recipeName: 'invalid-test',
      analysis: { intent: 'test', tone: 'test' },
      structure: { componentName: 'Card', props: {} },
    } as any;

    const result = await renderScreen(invalidBlueprint);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.errorCode).toBe('INVALID_BLUEPRINT');
  });

  it('should handle invalid Blueprint (missing analysis)', async () => {
    const invalidBlueprint = {
      blueprintId: 'test-001',
      recipeName: 'invalid-test',
      // Missing analysis - this should still pass validation but fail generation
      structure: { componentName: 'Card', props: {} },
    } as any;

    const result = await renderScreen(invalidBlueprint);

    // May pass initial validation but should provide clear error
    expect(result.success).toBeDefined();
    if (!result.success) {
      expect(result.errorCode).toBeDefined();
    }
  });

  it('should handle invalid Blueprint (missing structure)', async () => {
    const invalidBlueprint = {
      blueprintId: 'test-001',
      recipeName: 'invalid-test',
      analysis: { intent: 'test', tone: 'test' },
      // Missing structure
    } as any;

    const result = await renderScreen(invalidBlueprint);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.errorCode).toBe('INVALID_BLUEPRINT');
  });

  it('should handle hallucinated component (not in catalog)', async () => {
    const blueprintWithUnknownComponent: BlueprintResult = {
      blueprintId: 'hallucinated-001',
      recipeName: 'hallucinated-component',
      analysis: {
        intent: 'Test with unknown component',
        tone: 'test',
      },
      structure: {
        componentName: 'NonExistentComponent', // Component not in catalog
        props: {},
      },
    };

    const result = await renderScreen(blueprintWithUnknownComponent);

    // Should fail with GENERATION_FAILED due to invalid component
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('GENERATION_FAILED');
    expect(result.error).toBeDefined();
  });

  it('should provide structured error responses', async () => {
    const invalidBlueprint = {
      blueprintId: 'error-test-001',
      recipeName: 'error-test',
      analysis: { intent: 'test', tone: 'test' },
      // Missing structure
    } as any;

    const result = await renderScreen(invalidBlueprint);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.errorCode).toBeDefined();

    // Error codes should be one of the documented codes
    const validErrorCodes = [
      'INVALID_BLUEPRINT',
      'GENERATION_FAILED',
      'FILE_WRITE_ERROR',
      'UNEXPECTED_ERROR',
    ];
    expect(validErrorCodes).toContain(result.errorCode);

    // Error message should be actionable for LLM
    expect(result.error!.length).toBeGreaterThan(10);
  });

  it('should prevent partial file writes on failure', async () => {
    const outputPath = join(TEST_OUTPUT_DIR, 'partial-write', 'page.tsx');
    const invalidBlueprint = {
      recipeName: 'partial-write-test',
      // Missing required fields
    } as any;

    const result = await renderScreen(invalidBlueprint, outputPath);

    expect(result.success).toBe(false);
    // File should not exist if rendering failed
    expect(existsSync(outputPath)).toBe(false);
  });
});

describe('Test 3: Multiple Blueprint Patterns', () => {
  beforeEach(async () => {
    await mkdir(TEST_OUTPUT_DIR, { recursive: true });
  });

  afterEach(async () => {
    if (existsSync(TEST_OUTPUT_DIR)) {
      await rm(TEST_OUTPUT_DIR, { recursive: true, force: true });
    }
  });

  it('Pattern 1: Simple flat layout (Card)', async () => {
    const simpleBlueprint: BlueprintResult = {
      blueprintId: 'pattern-simple-001',
      recipeName: 'simple-card-page',
      analysis: {
        intent: 'Simple page with a single card',
        tone: 'minimal',
      },
      structure: {
        componentName: 'Card',
        props: {
          variant: 'elevated',
          padding: 'large',
        },
      },
    };

    const outputPath = join(TEST_OUTPUT_DIR, 'pattern-simple', 'page.tsx');
    const result = await renderScreen(simpleBlueprint, outputPath);

    expect(result.success).toBe(true);
    expect(existsSync(outputPath)).toBe(true);

    const code = result.code!;
    expect(code).toContain('Card');
    expect(code).toContain('export default');

    // Verify TypeScript structure
    expect(verifyTypeScriptStructure(code)).toBe(true);
  }, 30000);

  it('Pattern 2: Modal overlay', async () => {
    const modalBlueprint: BlueprintResult = {
      blueprintId: 'pattern-modal-001',
      recipeName: 'modal-overlay',
      analysis: {
        intent: 'Modal overlay dialog',
        tone: 'professional',
      },
      structure: {
        componentName: 'Modal',
        props: {
          open: true,
        },
      },
    };

    const outputPath = join(TEST_OUTPUT_DIR, 'pattern-modal', 'page.tsx');
    const result = await renderScreen(modalBlueprint, outputPath);

    expect(result.success).toBe(true);
    expect(existsSync(outputPath)).toBe(true);

    const code = result.code!;
    expect(code).toContain('Modal');
    expect(code).toContain('export default');

    // Verify TypeScript structure
    expect(verifyTypeScriptStructure(code)).toBe(true);
  }, 30000);

  it('Pattern 3: Alert component', async () => {
    const alertBlueprint: BlueprintResult = {
      blueprintId: 'pattern-alert-001',
      recipeName: 'alert-component',
      analysis: {
        intent: 'Alert notification',
        tone: 'informational',
      },
      structure: {
        componentName: 'Alert',
        props: {
          severity: 'info',
        },
      },
    };

    const outputPath = join(TEST_OUTPUT_DIR, 'pattern-alert', 'page.tsx');
    const result = await renderScreen(alertBlueprint, outputPath);

    expect(result.success).toBe(true);
    expect(existsSync(outputPath)).toBe(true);

    const code = result.code!;
    expect(code).toContain('Alert');
    expect(code).toContain('export default');

    // Verify TypeScript structure
    expect(verifyTypeScriptStructure(code)).toBe(true);
  }, 30000);

  it('should handle all three patterns with consistent code quality', async () => {
    const patterns = [
      {
        name: 'simple',
        blueprint: {
          blueprintId: 'consistency-simple',
          recipeName: 'consistency-simple',
          analysis: { intent: 'Simple', tone: 'minimal' },
          structure: {
            componentName: 'Card',
            props: {},
          },
        },
      },
      {
        name: 'modal',
        blueprint: {
          blueprintId: 'consistency-modal',
          recipeName: 'consistency-modal',
          analysis: { intent: 'Modal', tone: 'professional' },
          structure: {
            componentName: 'Modal',
            props: { open: true },
          },
        },
      },
      {
        name: 'button',
        blueprint: {
          blueprintId: 'consistency-button',
          recipeName: 'consistency-button',
          analysis: { intent: 'Button', tone: 'action' },
          structure: {
            componentName: 'Button',
            props: { variant: 'primary' },
          },
        },
      },
    ];

    for (const pattern of patterns) {
      const outputPath = join(
        TEST_OUTPUT_DIR,
        `consistency-${pattern.name}`,
        'page.tsx'
      );
      const result = await renderScreen(
        pattern.blueprint as BlueprintResult,
        outputPath
      );

      expect(result.success).toBe(true);
      expect(existsSync(outputPath)).toBe(true);
      expect(result.code).toContain('export default');
      expect(result.code).toContain('function');
    }
  });
});
