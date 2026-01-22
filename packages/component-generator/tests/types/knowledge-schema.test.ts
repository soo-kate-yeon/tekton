/**
 * Knowledge Schema Tests
 * TAG: SPEC-THEME-BIND-001
 *
 * Tests for BlueprintResult schema with theme support
 */

import { describe, it, expect } from 'vitest';
import type { BlueprintResult } from '../../src/types/knowledge-schema';
import { BlueprintResultSchema } from '../../src/types/knowledge-schema';

describe('BlueprintResult Schema', () => {
  describe('themeId field', () => {
    it('should accept BlueprintResult without themeId (backward compatibility)', () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'test-001',
        recipeName: 'test-recipe',
        analysis: {
          intent: 'test intent',
          tone: 'professional',
        },
        structure: {
          componentName: 'TestComponent',
          props: {},
        },
      };

      expect(blueprint).toBeDefined();
      expect(blueprint.themeId).toBeUndefined();
    });

    it('should accept BlueprintResult with themeId', () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'test-002',
        recipeName: 'test-recipe',
        analysis: {
          intent: 'test intent',
          tone: 'calm',
        },
        structure: {
          componentName: 'TestComponent',
          props: {},
        },
        themeId: 'calm-wellness',
      };

      expect(blueprint).toBeDefined();
      expect(blueprint.themeId).toBe('calm-wellness');
    });

    it('should validate themeId as string type', () => {
      const blueprint: BlueprintResult = {
        blueprintId: 'test-003',
        recipeName: 'test-recipe',
        analysis: {
          intent: 'test intent',
          tone: 'professional',
        },
        structure: {
          componentName: 'TestComponent',
          props: {},
        },
        themeId: 'tech-startup',
      };

      expect(typeof blueprint.themeId).toBe('string');
    });
  });

  describe('BlueprintResultSchema validation', () => {
    it('should include themeId in schema properties (optional)', () => {
      expect(BlueprintResultSchema.properties).toHaveProperty('themeId');
      expect(BlueprintResultSchema.properties.themeId).toMatchObject({
        type: 'string',
        description: expect.any(String),
      });
    });

    it('should NOT require themeId in schema (optional field)', () => {
      expect(BlueprintResultSchema.required).not.toContain('themeId');
      expect(BlueprintResultSchema.required).toEqual([
        'blueprintId',
        'recipeName',
        'analysis',
        'structure',
      ]);
    });
  });
});
