import { describe, it, expect } from 'vitest';
import {
  generateJSONExport,
  flattenTokens,
  generateFlatJSONExport,
} from '@/lib/export/json-generator';
import type { SemanticToken } from '@tekton/token-contract';

describe('json-generator', () => {
  const mockTokens: SemanticToken = {
    primary: {
      '500': { l: 0.53, c: 0.15, h: 220 },
      '600': { l: 0.45, c: 0.15, h: 220 },
    },
    neutral: {
      '50': { l: 0.98, c: 0, h: 0 },
    },
  };

  describe('generateJSONExport', () => {
    it('includes $schema field', () => {
      const result = generateJSONExport({ semantic: mockTokens });
      const parsed = JSON.parse(result);

      expect(parsed.$schema).toBeDefined();
      expect(parsed.$schema).toContain('tekton.design');
    });

    it('includes version field', () => {
      const result = generateJSONExport({ semantic: mockTokens });
      const parsed = JSON.parse(result);

      expect(parsed.version).toBe('1.0.0');
    });

    it('includes semantic tokens', () => {
      const result = generateJSONExport({ semantic: mockTokens });
      const parsed = JSON.parse(result);

      expect(parsed.tokens.semantic.primary['500']).toEqual({
        l: 0.53,
        c: 0.15,
        h: 220,
      });
    });

    it('includes preset name when provided', () => {
      const result = generateJSONExport({
        semantic: mockTokens,
        themeName: 'professional',
      });
      const parsed = JSON.parse(result);

      expect(parsed.name).toBe('professional');
    });

    it('generates compact JSON when prettyPrint is false', () => {
      const result = generateJSONExport({
        semantic: mockTokens,
        prettyPrint: false,
      });

      expect(result).not.toContain('\n');
    });
  });

  describe('flattenTokens', () => {
    it('flattens nested tokens to flat object', () => {
      const result = flattenTokens(mockTokens);

      expect(result['primary-500']).toBe('oklch(0.53 0.15 220)');
      expect(result['primary-600']).toBe('oklch(0.45 0.15 220)');
      expect(result['neutral-50']).toBe('oklch(0.98 0 0)');
    });
  });

  describe('generateFlatJSONExport', () => {
    it('generates flat JSON structure', () => {
      const result = generateFlatJSONExport(mockTokens);
      const parsed = JSON.parse(result);

      expect(parsed['primary-500']).toBeDefined();
      expect(parsed['neutral-50']).toBeDefined();
      // Should not have nested structure
      expect(parsed.primary).toBeUndefined();
    });
  });
});
