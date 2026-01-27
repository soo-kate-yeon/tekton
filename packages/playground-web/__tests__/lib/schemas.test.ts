/**
 * Schemas Tests
 * SPEC-PLAYGROUND-001 Milestone 7: Integration Testing
 *
 * Test Coverage:
 * - ComponentNodeSchema - Recursive component tree validation
 * - BlueprintSchema - Blueprint data validation
 * - BlueprintRequestSchema - User input validation
 * - validateEnv() - Environment variable validation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  ComponentNodeSchema,
  BlueprintSchema,
  BlueprintRequestSchema,
  LayoutTypeSchema,
  validateEnv,
} from '@/lib/schemas';

describe('Schemas', () => {
  describe('ComponentNodeSchema', () => {
    it('should validate valid component node', () => {
      const validNode = {
        type: 'Button',
        props: { variant: 'primary', children: 'Click me' },
      };

      const result = ComponentNodeSchema.safeParse(validNode);
      expect(result.success).toBe(true);
    });

    it('should validate component with children', () => {
      const nodeWithChildren = {
        type: 'Card',
        props: {},
        children: [
          { type: 'CardHeader', props: {} },
          { type: 'CardContent', props: {}, children: ['Text content'] },
        ],
      };

      const result = ComponentNodeSchema.safeParse(nodeWithChildren);
      expect(result.success).toBe(true);
    });

    it('should validate component with string children', () => {
      const nodeWithText = {
        type: 'Heading',
        props: {},
        children: ['Hello World'],
      };

      const result = ComponentNodeSchema.safeParse(nodeWithText);
      expect(result.success).toBe(true);
    });

    it('should validate component with slot', () => {
      const nodeWithSlot = {
        type: 'Avatar',
        props: {},
        slot: 'user-avatar',
      };

      const result = ComponentNodeSchema.safeParse(nodeWithSlot);
      expect(result.success).toBe(true);
    });

    it('should reject node without type', () => {
      const invalidNode = {
        props: {},
      };

      const result = ComponentNodeSchema.safeParse(invalidNode);
      expect(result.success).toBe(false);
    });

    it('should reject node with empty type', () => {
      const invalidNode = {
        type: '',
        props: {},
      };

      const result = ComponentNodeSchema.safeParse(invalidNode);
      expect(result.success).toBe(false);
    });
  });

  describe('LayoutTypeSchema', () => {
    it('should validate all layout types', () => {
      const validLayouts = [
        'single-column',
        'two-column',
        'sidebar-left',
        'sidebar-right',
        'dashboard',
        'landing',
      ];

      validLayouts.forEach((layout) => {
        const result = LayoutTypeSchema.safeParse(layout);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid layout type', () => {
      const result = LayoutTypeSchema.safeParse('invalid-layout');
      expect(result.success).toBe(false);
    });
  });

  describe('BlueprintSchema', () => {
    const validBlueprint = {
      id: 'test-blueprint-001',
      name: 'Test Blueprint',
      description: 'A test blueprint',
      themeId: 'saas-dashboard',
      layout: 'dashboard' as const,
      components: [
        {
          type: 'Card',
          props: {},
          children: [{ type: 'CardHeader', props: {} }],
        },
      ],
    };

    it('should validate valid blueprint', () => {
      const result = BlueprintSchema.safeParse(validBlueprint);
      expect(result.success).toBe(true);
    });

    it('should allow optional description', () => {
      const { description, ...blueprintWithoutDesc } = validBlueprint;
      const result = BlueprintSchema.safeParse(blueprintWithoutDesc);
      expect(result.success).toBe(true);
    });

    it('should reject blueprint without id', () => {
      const { id, ...blueprintWithoutId } = validBlueprint;
      const result = BlueprintSchema.safeParse(blueprintWithoutId);
      expect(result.success).toBe(false);
    });

    it('should reject blueprint with empty id', () => {
      const blueprint = { ...validBlueprint, id: '' };
      const result = BlueprintSchema.safeParse(blueprint);
      expect(result.success).toBe(false);
    });

    it('should reject blueprint without name', () => {
      const { name, ...blueprintWithoutName } = validBlueprint;
      const result = BlueprintSchema.safeParse(blueprintWithoutName);
      expect(result.success).toBe(false);
    });

    it('should reject blueprint without themeId', () => {
      const { themeId, ...blueprintWithoutTheme } = validBlueprint;
      const result = BlueprintSchema.safeParse(blueprintWithoutTheme);
      expect(result.success).toBe(false);
    });

    it('should reject blueprint with invalid layout', () => {
      const blueprint = { ...validBlueprint, layout: 'invalid' };
      const result = BlueprintSchema.safeParse(blueprint);
      expect(result.success).toBe(false);
    });

    it('should reject blueprint without components', () => {
      const { components, ...blueprintWithoutComponents } = validBlueprint;
      const result = BlueprintSchema.safeParse(blueprintWithoutComponents);
      expect(result.success).toBe(false);
    });
  });

  describe('BlueprintRequestSchema', () => {
    const validRequest = {
      brandName: 'Test Brand',
      primaryColor: '#ff0000',
      accentColor: '#00ff00',
    };

    it('should validate valid request', () => {
      const result = BlueprintRequestSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('should allow optional colors', () => {
      const { primaryColor, accentColor, ...minimalRequest } = validRequest;
      const result = BlueprintRequestSchema.safeParse(minimalRequest);
      expect(result.success).toBe(true);
    });

    it('should reject request without brandName', () => {
      const { brandName, ...requestWithoutBrand } = validRequest;
      const result = BlueprintRequestSchema.safeParse(requestWithoutBrand);
      expect(result.success).toBe(false);
    });

    it('should reject empty brandName', () => {
      const request = { ...validRequest, brandName: '' };
      const result = BlueprintRequestSchema.safeParse(request);
      expect(result.success).toBe(false);
    });

    it('should reject brandName longer than 50 characters', () => {
      const request = { ...validRequest, brandName: 'a'.repeat(51) };
      const result = BlueprintRequestSchema.safeParse(request);
      expect(result.success).toBe(false);
    });

    it('should reject invalid hex color format', () => {
      const request = { ...validRequest, primaryColor: 'red' };
      const result = BlueprintRequestSchema.safeParse(request);
      expect(result.success).toBe(false);
    });

    it('should reject short hex color', () => {
      const request = { ...validRequest, primaryColor: '#fff' };
      const result = BlueprintRequestSchema.safeParse(request);
      expect(result.success).toBe(false);
    });

    it('should reject hex color without #', () => {
      const request = { ...validRequest, primaryColor: 'ff0000' };
      const result = BlueprintRequestSchema.safeParse(request);
      expect(result.success).toBe(false);
    });

    it('should accept uppercase hex', () => {
      const request = { ...validRequest, primaryColor: '#FF0000' };
      const result = BlueprintRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
    });
  });

  describe('validateEnv()', () => {
    const originalEnv = { ...process.env };

    beforeEach(() => {
      process.env.MCP_SERVER_URL = 'http://localhost:3000';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3001';
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should validate correct environment variables', () => {
      expect(() => validateEnv()).not.toThrow();

      const result = validateEnv();
      expect(result.MCP_SERVER_URL).toBe('http://localhost:3000');
      expect(result.NEXT_PUBLIC_APP_URL).toBe('http://localhost:3001');
    });

    it('should throw on missing MCP_SERVER_URL', () => {
      delete process.env.MCP_SERVER_URL;

      expect(() => validateEnv()).toThrow();
    });

    it('should throw on missing NEXT_PUBLIC_APP_URL', () => {
      delete process.env.NEXT_PUBLIC_APP_URL;

      expect(() => validateEnv()).toThrow();
    });

    it('should throw on invalid URL format', () => {
      process.env.MCP_SERVER_URL = 'not-a-url';

      expect(() => validateEnv()).toThrow();
    });
  });
});
