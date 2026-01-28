/**
 * MCP Schemas Validation Tests
 * SPEC-MCP-002: AC-002 Input Schema Validation
 */

import { describe, it, expect } from 'vitest';
import {
  GenerateBlueprintInputSchema,
  PreviewThemeInputSchema,
  ExportScreenInputSchema,
  ThemeIdSchema,
} from '../../src/schemas/mcp-schemas.js';

describe('MCP Schemas', () => {
  describe('ThemeIdSchema', () => {
    it('should accept valid theme IDs', () => {
      expect(ThemeIdSchema.safeParse('atlantic-magazine-v1').success).toBe(true);
      expect(ThemeIdSchema.safeParse('hims-v1').success).toBe(true);
      expect(ThemeIdSchema.safeParse('korean-fintech').success).toBe(true);
    });

    it('should reject path traversal attempts', () => {
      expect(ThemeIdSchema.safeParse('../etc/passwd').success).toBe(false);
      expect(ThemeIdSchema.safeParse('../../file').success).toBe(false);
      expect(ThemeIdSchema.safeParse('theme/../../etc').success).toBe(false);
    });

    it('should reject uppercase and special characters', () => {
      expect(ThemeIdSchema.safeParse('Theme-ID').success).toBe(false);
      expect(ThemeIdSchema.safeParse('theme_id').success).toBe(false);
      expect(ThemeIdSchema.safeParse('theme.id').success).toBe(false);
    });
  });

  describe('GenerateBlueprintInputSchema', () => {
    it('should accept valid input', () => {
      const input = {
        description: 'User dashboard with profile card',
        layout: 'sidebar-left',
        themeId: 'atlantic-magazine-v1',
        componentHints: ['Card', 'Avatar'],
      };
      expect(GenerateBlueprintInputSchema.safeParse(input).success).toBe(true);
    });

    it('should reject description shorter than 10 characters', () => {
      const input = {
        description: 'Short',
        layout: 'sidebar-left',
        themeId: 'atlantic-magazine-v1',
      };
      const result = GenerateBlueprintInputSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('at least 10 characters');
      }
    });

    it('should reject description longer than 500 characters', () => {
      const input = {
        description: 'A'.repeat(501),
        layout: 'sidebar-left',
        themeId: 'atlantic-magazine-v1',
      };
      const result = GenerateBlueprintInputSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('not exceed 500 characters');
      }
    });

    it('should reject invalid layout type', () => {
      const input = {
        description: 'Test dashboard',
        layout: 'invalid-layout',
        themeId: 'atlantic-magazine-v1',
      };
      expect(GenerateBlueprintInputSchema.safeParse(input).success).toBe(false);
    });
  });

  describe('PreviewThemeInputSchema', () => {
    it('should accept valid theme ID', () => {
      expect(PreviewThemeInputSchema.safeParse({ themeId: 'atlantic-magazine-v1' }).success).toBe(
        true
      );
    });

    it('should reject invalid theme ID format', () => {
      expect(PreviewThemeInputSchema.safeParse({ themeId: '../invalid' }).success).toBe(false);
    });
  });

  describe('ExportScreenInputSchema', () => {
    it('should accept valid export input', () => {
      const input = {
        blueprintId: '1738123456789',
        format: 'tsx',
        outputPath: 'src/screens/dashboard.tsx',
      };
      expect(ExportScreenInputSchema.safeParse(input).success).toBe(true);
    });

    it('should accept input without outputPath', () => {
      const input = {
        blueprintId: '1738123456789',
        format: 'jsx',
      };
      expect(ExportScreenInputSchema.safeParse(input).success).toBe(true);
    });

    it('should reject invalid format', () => {
      const input = {
        blueprintId: '1738123456789',
        format: 'invalid',
      };
      expect(ExportScreenInputSchema.safeParse(input).success).toBe(false);
    });
  });
});
