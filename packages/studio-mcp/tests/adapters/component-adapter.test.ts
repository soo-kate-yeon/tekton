import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentAdapter } from '../../src/adapters/component-adapter.js';
import type { BlueprintResult, GenerationResult } from '@tekton/component-generator';

describe('ComponentAdapter', () => {
  let adapter: ComponentAdapter;

  beforeEach(() => {
    adapter = new ComponentAdapter();
  });

  describe('generateCode', () => {
    it('should generate code successfully with theme', async () => {
      const mockBlueprint: BlueprintResult = {
        blueprintId: 'test-blueprint',
        recipeName: 'Button',
        analysis: {
          intent: 'Create a button component',
          tone: 'professional',
        },
        structure: {
          componentName: 'Button',
          props: { label: 'Click me' },
        },
        themeId: 'calm-wellness',
      };

      const result = await adapter.generateCode(mockBlueprint);

      expect(result.success).toBe(true);
      expect(result.code).toBeDefined();
      expect(typeof result.code).toBe('string');
      expect(result.error).toBeUndefined();
    });

    it('should handle generation failures gracefully', async () => {
      const invalidBlueprint: BlueprintResult = {
        blueprintId: '',
        recipeName: '',
        analysis: {
          intent: '',
          tone: '',
        },
        structure: {} as any,
        themeId: 'calm-wellness',
      };

      const result = await adapter.generateCode(invalidBlueprint);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(['GENERATION_FAILED', 'UNEXPECTED_ERROR']).toContain(result.errorCode);
      expect(result.code).toBeUndefined();
    });

    it('should return generated code even with warnings', async () => {
      const blueprintWithWarning: BlueprintResult = {
        blueprintId: 'test-blueprint',
        recipeName: 'Button',
        analysis: {
          intent: 'Create a button component',
          tone: 'professional',
        },
        structure: {
          componentName: 'Button',
          props: {},
        },
        themeId: 'calm-wellness',
      };

      const result = await adapter.generateCode(blueprintWithWarning);

      // Even with minimal props, generation should succeed
      expect(result.success).toBe(true);
      expect(result.code).toBeDefined();
    });

    it('should apply default theme when not specified', async () => {
      const mockBlueprint: BlueprintResult = {
        blueprintId: 'test-blueprint',
        recipeName: 'Button',
        analysis: {
          intent: 'Create a button component',
          tone: 'professional',
        },
        structure: {
          componentName: 'Button',
          props: { label: 'Click me' },
        },
      };

      const result = await adapter.generateCode(mockBlueprint);

      expect(result.success).toBe(true);
      expect(result.code).toBeDefined();
    });

    it('should validate blueprint structure', async () => {
      const mockBlueprint: BlueprintResult = {
        blueprintId: 'test-blueprint',
        recipeName: 'Button',
        analysis: {
          intent: 'Create a button component',
          tone: 'professional',
        },
        structure: {
          componentName: 'Button',
          props: { label: 'Click me' },
        },
        themeId: 'calm-wellness',
      };

      const isValid = adapter.validateBlueprint(mockBlueprint);

      expect(isValid).toBe(true);
    });

    it('should handle unexpected errors', async () => {
      const mockBlueprint: BlueprintResult = {
        blueprintId: 'test-blueprint',
        recipeName: 'Button',
        analysis: {
          intent: 'Create a button component',
          tone: 'professional',
        },
        structure: null as any, // Invalid structure to trigger error
        themeId: 'calm-wellness',
      };

      const result = await adapter.generateCode(mockBlueprint);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.errorCode).toBeDefined();
    });

    it('should merge theme options correctly', async () => {
      const mockBlueprint: BlueprintResult = {
        blueprintId: 'test-blueprint',
        recipeName: 'Button',
        analysis: {
          intent: 'Create a button component',
          tone: 'professional',
        },
        structure: {
          componentName: 'Button',
          props: { label: 'Click me' },
        },
        themeId: 'existing-theme',
      };

      const options = {
        themeId: 'override-theme',
      };

      const result = await adapter.generateCode(mockBlueprint, options);

      expect(result.success).toBe(true);
      expect(result.code).toBeDefined();
    });
  });

  describe('validateBlueprint', () => {
    it('should return true for valid blueprint', () => {
      const validBlueprint: BlueprintResult = {
        blueprintId: 'test-blueprint',
        recipeName: 'Button',
        analysis: {
          intent: 'Create a button component',
          tone: 'professional',
        },
        structure: {
          componentName: 'Button',
          props: { label: 'Click me' },
        },
      };

      const isValid = adapter.validateBlueprint(validBlueprint);

      expect(isValid).toBe(true);
    });

    it('should return false for blueprint without blueprintId', () => {
      const invalidBlueprint: BlueprintResult = {
        blueprintId: '',
        recipeName: 'Button',
        analysis: {
          intent: 'Create a button component',
          tone: 'professional',
        },
        structure: {
          componentName: 'Button',
          props: { label: 'Click me' },
        },
      };

      const isValid = adapter.validateBlueprint(invalidBlueprint);

      expect(isValid).toBe(false);
    });

    it('should return false for blueprint without recipeName', () => {
      const invalidBlueprint: BlueprintResult = {
        blueprintId: 'test-blueprint',
        recipeName: '',
        analysis: {
          intent: 'Create a button component',
          tone: 'professional',
        },
        structure: {
          componentName: 'Button',
          props: { label: 'Click me' },
        },
      };

      const isValid = adapter.validateBlueprint(invalidBlueprint);

      expect(isValid).toBe(false);
    });

    it('should return false for blueprint without structure', () => {
      const invalidBlueprint: BlueprintResult = {
        blueprintId: 'test-blueprint',
        recipeName: 'Button',
        analysis: {
          intent: 'Create a button component',
          tone: 'professional',
        },
        structure: null as any,
      };

      const isValid = adapter.validateBlueprint(invalidBlueprint);

      expect(isValid).toBe(false);
    });
  });
});
