/**
 * Layout Schema Tests
 * SPEC-LAYOUT-001 - TASK-004
 *
 * Tests for BlueprintLayout Zod schema validation.
 */

import { describe, it, expect } from 'vitest';
import {
  blueprintLayoutSchema,
  type BlueprintLayout,
} from '../src/types/layout-schema.js';

describe('blueprintLayoutSchema', () => {
  describe('AC-005: BlueprintLayout Interface Accepts Valid Configuration', () => {
    it('should accept a complete valid layout configuration', () => {
      const validLayout: BlueprintLayout = {
        container: 'fixed',
        maxWidth: '2xl',
        padding: 6,
        grid: {
          default: 1,
          sm: 2,
          md: 2,
          lg: 3,
          xl: 4,
        },
        gap: { x: 6, y: 8 },
      };

      const result = blueprintLayoutSchema.safeParse(validLayout);
      expect(result.success).toBe(true);
    });

    it('should accept layout with only container', () => {
      const result = blueprintLayoutSchema.safeParse({ container: 'fluid' });
      expect(result.success).toBe(true);
    });

    it('should accept layout with only maxWidth', () => {
      const result = blueprintLayoutSchema.safeParse({ maxWidth: 'lg' });
      expect(result.success).toBe(true);
    });

    it('should accept layout with only padding', () => {
      const result = blueprintLayoutSchema.safeParse({ padding: 4 });
      expect(result.success).toBe(true);
    });

    it('should accept layout with only grid', () => {
      const result = blueprintLayoutSchema.safeParse({
        grid: { default: 1, lg: 3 },
      });
      expect(result.success).toBe(true);
    });

    it('should accept layout with numeric gap', () => {
      const result = blueprintLayoutSchema.safeParse({ gap: 4 });
      expect(result.success).toBe(true);
    });

    it('should accept layout with object gap', () => {
      const result = blueprintLayoutSchema.safeParse({ gap: { x: 4, y: 6 } });
      expect(result.success).toBe(true);
    });

    it('should accept empty layout (all fields optional)', () => {
      const result = blueprintLayoutSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('AC-006: BlueprintLayout Rejects Invalid Values', () => {
    it('should reject invalid container value', () => {
      const result = blueprintLayoutSchema.safeParse({ container: 'invalid' });
      expect(result.success).toBe(false);
    });

    it('should reject invalid maxWidth value', () => {
      const result = blueprintLayoutSchema.safeParse({ maxWidth: 'invalid' });
      expect(result.success).toBe(false);
    });

    it('should reject negative padding', () => {
      const result = blueprintLayoutSchema.safeParse({ padding: -1 });
      expect(result.success).toBe(false);
    });

    it('should reject grid columns greater than 12', () => {
      const result = blueprintLayoutSchema.safeParse({ grid: { lg: 24 } });
      expect(result.success).toBe(false);
    });

    it('should reject grid columns less than 1', () => {
      const result = blueprintLayoutSchema.safeParse({ grid: { lg: 0 } });
      expect(result.success).toBe(false);
    });

    it('should reject negative gap', () => {
      const result = blueprintLayoutSchema.safeParse({ gap: -1 });
      expect(result.success).toBe(false);
    });

    it('should reject negative gap.x', () => {
      const result = blueprintLayoutSchema.safeParse({ gap: { x: -1 } });
      expect(result.success).toBe(false);
    });

    it('should reject negative gap.y', () => {
      const result = blueprintLayoutSchema.safeParse({ gap: { y: -1 } });
      expect(result.success).toBe(false);
    });

    it('should reject padding greater than 96 (Tailwind max)', () => {
      const result = blueprintLayoutSchema.safeParse({ padding: 100 });
      expect(result.success).toBe(false);
    });

    it('should reject gap greater than 96 (Tailwind max)', () => {
      const result = blueprintLayoutSchema.safeParse({ gap: 100 });
      expect(result.success).toBe(false);
    });
  });

  describe('Container values', () => {
    it('should accept container: "fluid"', () => {
      const result = blueprintLayoutSchema.safeParse({ container: 'fluid' });
      expect(result.success).toBe(true);
    });

    it('should accept container: "fixed"', () => {
      const result = blueprintLayoutSchema.safeParse({ container: 'fixed' });
      expect(result.success).toBe(true);
    });

    it('should accept container: "none"', () => {
      const result = blueprintLayoutSchema.safeParse({ container: 'none' });
      expect(result.success).toBe(true);
    });
  });

  describe('MaxWidth values', () => {
    const validMaxWidths = ['sm', 'md', 'lg', 'xl', '2xl', 'full', 'prose'];

    for (const maxWidth of validMaxWidths) {
      it(`should accept maxWidth: "${maxWidth}"`, () => {
        const result = blueprintLayoutSchema.safeParse({ maxWidth });
        expect(result.success).toBe(true);
      });
    }
  });

  describe('Grid configuration', () => {
    it('should accept partial grid configuration', () => {
      const result = blueprintLayoutSchema.safeParse({
        grid: { default: 1, md: 2 },
      });
      expect(result.success).toBe(true);
    });

    it('should accept full grid configuration', () => {
      const result = blueprintLayoutSchema.safeParse({
        grid: {
          default: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 6,
          '2xl': 12,
        },
      });
      expect(result.success).toBe(true);
    });

    it('should accept grid columns from 1 to 12', () => {
      for (let cols = 1; cols <= 12; cols++) {
        const result = blueprintLayoutSchema.safeParse({ grid: { lg: cols } });
        expect(result.success).toBe(true);
      }
    });
  });

  describe('Gap configuration', () => {
    it('should accept gap as number', () => {
      const result = blueprintLayoutSchema.safeParse({ gap: 8 });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.gap).toBe(8);
      }
    });

    it('should accept gap as object with only x', () => {
      const result = blueprintLayoutSchema.safeParse({ gap: { x: 4 } });
      expect(result.success).toBe(true);
    });

    it('should accept gap as object with only y', () => {
      const result = blueprintLayoutSchema.safeParse({ gap: { y: 6 } });
      expect(result.success).toBe(true);
    });

    it('should accept gap as object with both x and y', () => {
      const result = blueprintLayoutSchema.safeParse({ gap: { x: 4, y: 6 } });
      expect(result.success).toBe(true);
    });

    it('should accept gap values in Tailwind spacing scale (0-96)', () => {
      const validGaps = [0, 1, 2, 4, 8, 16, 32, 64, 96];
      for (const gap of validGaps) {
        const result = blueprintLayoutSchema.safeParse({ gap });
        expect(result.success).toBe(true);
      }
    });
  });
});
