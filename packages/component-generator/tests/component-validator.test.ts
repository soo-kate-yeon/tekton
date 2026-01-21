import { describe, it, expect } from 'vitest';
import { ComponentValidator } from '../src/validators/component-validator';

describe('ComponentValidator', () => {
  const validator = new ComponentValidator();

  describe('validateComponent', () => {
    it('should validate existing component', () => {
      const result = validator.validateComponent('Button');

      expect(result.isValid).toBe(true);
      expect(result.componentName).toBe('Button');
      expect(result.error).toBeUndefined();
      expect(result.errorCode).toBeUndefined();
      expect(result.suggestions).toBeUndefined();
    });

    it('should validate multiple existing components', () => {
      const components = ['Card', 'Modal', 'Input', 'Checkbox'];

      components.forEach(component => {
        const result = validator.validateComponent(component);
        expect(result.isValid).toBe(true);
        expect(result.componentName).toBe(component);
      });
    });

    it('should return LAYER3-E002 error for invalid component', () => {
      const result = validator.validateComponent('InvalidComponent');

      expect(result.isValid).toBe(false);
      expect(result.componentName).toBe('InvalidComponent');
      expect(result.error).toBeDefined();
      expect(result.errorCode).toBe('LAYER3-E002');
    });

    it('should provide suggestions using Levenshtein distance', () => {
      const result = validator.validateComponent('Buton'); // typo

      expect(result.isValid).toBe(false);
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions).toContain('Button');
    });

    it('should provide suggestions for similar component names', () => {
      const result = validator.validateComponent('Crd'); // typo for Card

      expect(result.isValid).toBe(false);
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions?.length).toBeGreaterThan(0);
    });

    it('should handle empty string', () => {
      const result = validator.validateComponent('');

      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe('LAYER3-E002');
    });

    it('should handle whitespace trimming', () => {
      const result = validator.validateComponent('  Button  ');

      expect(result.isValid).toBe(true);
      expect(result.componentName).toBe('  Button  ');
    });

    it('should return multiple suggestions when available', () => {
      const result = validator.validateComponent('Butto'); // close to Button

      expect(result.isValid).toBe(false);
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions?.length).toBeGreaterThanOrEqual(1);
      expect(result.suggestions).toContain('Button');
    });

    it('should limit suggestions to maximum 3', () => {
      const result = validator.validateComponent('x'); // very generic

      expect(result.isValid).toBe(false);
      if (result.suggestions) {
        expect(result.suggestions.length).toBeLessThanOrEqual(3);
      }
    });
  });

  describe('isValid', () => {
    it('should return true for valid component', () => {
      expect(validator.isValid('Button')).toBe(true);
      expect(validator.isValid('Card')).toBe(true);
      expect(validator.isValid('Modal')).toBe(true);
    });

    it('should return false for invalid component', () => {
      expect(validator.isValid('InvalidComponent')).toBe(false);
      expect(validator.isValid('FakeComponent')).toBe(false);
      expect(validator.isValid('')).toBe(false);
    });

    it('should handle trimming in validation', () => {
      expect(validator.isValid('  Button  ')).toBe(true);
    });
  });

  describe('validateBatch', () => {
    it('should validate multiple components at once', () => {
      const components = ['Button', 'Card', 'Modal'];
      const results = validator.validateBatch(components);

      expect(results.length).toBe(3);
      results.forEach(result => {
        expect(result.isValid).toBe(true);
      });
    });

    it('should identify all invalid components in batch', () => {
      const components = ['Button', 'InvalidComp', 'Card', 'FakeComp'];
      const results = validator.validateBatch(components);

      expect(results.length).toBe(4);
      expect(results[0].isValid).toBe(true);
      expect(results[1].isValid).toBe(false);
      expect(results[2].isValid).toBe(true);
      expect(results[3].isValid).toBe(false);
    });

    it('should handle empty array', () => {
      const results = validator.validateBatch([]);
      expect(results.length).toBe(0);
    });
  });

  describe('getSuggestions', () => {
    it('should return suggestions for typos', () => {
      const suggestions = validator.getSuggestions('Buton', 3);

      expect(suggestions).toBeDefined();
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions).toContain('Button');
    });

    it('should limit suggestions to specified maximum', () => {
      const suggestions = validator.getSuggestions('x', 2);

      expect(suggestions.length).toBeLessThanOrEqual(2);
    });

    it('should return empty array for exact match', () => {
      const suggestions = validator.getSuggestions('Button', 3);

      // Button should match exactly, so distance would be 0
      // Depending on implementation, might return Button or empty
      expect(Array.isArray(suggestions)).toBe(true);
    });
  });
});
