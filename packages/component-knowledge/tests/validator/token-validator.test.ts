import { describe, it, expect, beforeEach } from 'vitest';
import { TokenValidator } from '../../src/validator/token-validator';
import type { Layer1TokenMetadata } from '../../src/types/knowledge.types';

describe('TokenValidator', () => {
  let validator: TokenValidator;
  let mockLayer1Metadata: Layer1TokenMetadata;

  beforeEach(() => {
    mockLayer1Metadata = {
      schemaVersion: '1.0.0',
      generatedAt: '2026-01-20T00:00:00Z',
      sourceArchetype: 'test-archetype',
      tokens: [
        {
          name: 'color-primary',
          value: '#3b82f6',
          rgbFallback: 'rgb(59, 130, 246)',
          cssVariable: '--color-primary',
          category: 'color',
          role: 'primary',
        },
        {
          name: 'color-primary-hover',
          value: '#2563eb',
          rgbFallback: 'rgb(37, 99, 235)',
          cssVariable: '--color-primary-hover',
          category: 'color',
          role: 'primary',
        },
        {
          name: 'spacing-2',
          value: '0.5rem',
          rgbFallback: '',
          cssVariable: '--spacing-2',
          category: 'spacing',
        },
        {
          name: 'radius-md',
          value: '0.375rem',
          rgbFallback: '',
          cssVariable: '--radius-md',
          category: 'border',
        },
      ],
      wcagValidation: {
        passed: true,
        violations: [],
      },
    };

    validator = new TokenValidator(mockLayer1Metadata);
  });

  describe('Token Existence Validation', () => {
    it('should validate that existing tokens pass', () => {
      const result = validator.validateToken('color-primary');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject non-existent tokens', () => {
      const result = validator.validateToken('color-invalid');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('not found'))).toBe(true);
    });

    it('should provide suggestions for typos', () => {
      const result = validator.validateToken('color-primry'); // typo: missing 'a'
      expect(result.valid).toBe(false);
      expect(result.warnings.some(w => w.includes('color-primary'))).toBe(true);
    });

    it('should validate all tokens in TokenBindings object', () => {
      const bindings = {
        backgroundColor: 'color-primary',
        padding: 'spacing-2',
        borderRadius: 'radius-md',
      };
      const result = validator.validateTokenBindings(bindings);
      expect(result.valid).toBe(true);
    });

    it('should detect invalid tokens in TokenBindings', () => {
      const bindings = {
        backgroundColor: 'color-invalid',
        padding: 'spacing-2',
      };
      const result = validator.validateTokenBindings(bindings);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('color-invalid'))).toBe(true);
    });
  });

  describe('Token Reference Resolution', () => {
    it('should resolve all token references from ComponentKnowledge', () => {
      const knowledge = {
        name: 'Button',
        type: 'atom' as const,
        category: 'action' as const,
        slotAffinity: {},
        semanticDescription: {
          purpose: 'Test button component',
          visualImpact: 'neutral' as const,
          complexity: 'low' as const,
        },
        constraints: {},
        tokenBindings: {
          states: {
            default: { backgroundColor: 'color-primary', padding: 'spacing-2' },
            hover: { backgroundColor: 'color-primary-hover' },
            focus: {},
            active: {},
            disabled: {},
          },
        },
      };

      const references = validator.resolveTokenReferences(knowledge);
      expect(references).toContain('color-primary');
      expect(references).toContain('color-primary-hover');
      expect(references).toContain('spacing-2');
      expect(references).toHaveLength(3);
    });

    it('should return unique token references', () => {
      const knowledge = {
        name: 'Button',
        type: 'atom' as const,
        category: 'action' as const,
        slotAffinity: {},
        semanticDescription: {
          purpose: 'Test button component',
          visualImpact: 'neutral' as const,
          complexity: 'low' as const,
        },
        constraints: {},
        tokenBindings: {
          states: {
            default: { backgroundColor: 'color-primary' },
            hover: { backgroundColor: 'color-primary' }, // duplicate
            focus: {},
            active: {},
            disabled: {},
          },
        },
      };

      const references = validator.resolveTokenReferences(knowledge);
      expect(references).toEqual(['color-primary']);
    });
  });

  describe('Fuzzy Matching', () => {
    it('should suggest similar token names using Levenshtein distance', () => {
      const suggestions = validator.suggestSimilarTokens('color-primery');
      expect(suggestions).toContain('color-primary');
    });

    it('should return empty array if no similar tokens found', () => {
      const suggestions = validator.suggestSimilarTokens('completely-different');
      expect(suggestions).toHaveLength(0);
    });

    it('should limit suggestions to top 3 matches', () => {
      const suggestions = validator.suggestSimilarTokens('color');
      expect(suggestions.length).toBeLessThanOrEqual(3);
    });
  });
});
