/**
 * Hallucination Check Tests
 * TAG: SPEC-LAYER3-001 Section 5.5.2
 *
 * Tests for component existence validation against Layer 2 catalog
 */

import { describe, it, expect } from 'vitest';
import { HallucinationChecker } from '../../src/safety/hallucination-check';
import { SAFETY_ERROR_CODES } from '../../src/safety/safety.types';

describe('HallucinationChecker', () => {
  const checker = new HallucinationChecker();

  describe('checkComponent', () => {
    it('should validate existing component (Button)', () => {
      const result = checker.checkComponent('Button');

      expect(result.isValid).toBe(true);
      expect(result.componentName).toBe('Button');
      expect(result.error).toBeUndefined();
      expect(result.errorCode).toBeUndefined();
      expect(result.suggestions).toBeUndefined();
    });

    it('should validate existing component (Card)', () => {
      const result = checker.checkComponent('Card');

      expect(result.isValid).toBe(true);
      expect(result.componentName).toBe('Card');
      expect(result.error).toBeUndefined();
    });

    it('should validate all 20 core components', () => {
      const components = [
        'Button', 'Input', 'Card', 'Modal', 'Dropdown',
        'Checkbox', 'Radio', 'Switch', 'Slider', 'Badge',
        'Alert', 'Toast', 'Tooltip', 'Popover', 'Tabs',
        'Accordion', 'Select', 'Textarea', 'Progress', 'Avatar',
      ];

      for (const component of components) {
        const result = checker.checkComponent(component);
        expect(result.isValid).toBe(true);
        expect(result.componentName).toBe(component);
      }
    });

    it('should reject non-existent component', () => {
      const result = checker.checkComponent('NonExistentComponent');

      expect(result.isValid).toBe(false);
      expect(result.componentName).toBe('NonExistentComponent');
      expect(result.error).toBeDefined();
      expect(result.error).toContain('not found');
      expect(result.errorCode).toBe(SAFETY_ERROR_CODES.HALLUCINATION);
    });

    it('should reject completely invalid component name', () => {
      const result = checker.checkComponent('FooBarBaz');

      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe(SAFETY_ERROR_CODES.HALLUCINATION);
    });

    it('should provide fuzzy suggestions for typos (Buton -> Button)', () => {
      const result = checker.checkComponent('Buton');

      expect(result.isValid).toBe(false);
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions).toContain('Button');
      expect(result.errorCode).toBe(SAFETY_ERROR_CODES.HALLUCINATION);
    });

    it('should provide fuzzy suggestions for typos (Crad -> Card)', () => {
      const result = checker.checkComponent('Crad');

      expect(result.isValid).toBe(false);
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions).toContain('Card');
    });

    it('should provide multiple suggestions for ambiguous typos', () => {
      const result = checker.checkComponent('Mod');

      expect(result.isValid).toBe(false);
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions!.length).toBeGreaterThan(0);
      // Modal is a likely suggestion
      expect(result.suggestions).toContain('Modal');
    });

    it('should handle case-sensitive component names correctly', () => {
      const result = checker.checkComponent('button'); // lowercase

      expect(result.isValid).toBe(false);
      expect(result.suggestions).toContain('Button');
    });

    it('should handle extra whitespace', () => {
      const result = checker.checkComponent(' Button ');

      // Should either trim and validate, or reject with suggestion
      expect(result.componentName).toBe(' Button ');
      if (!result.isValid) {
        expect(result.suggestions).toContain('Button');
      }
    });

    it('should not suggest components with high Levenshtein distance', () => {
      const result = checker.checkComponent('XYZ123');

      expect(result.isValid).toBe(false);
      // May have no suggestions or only distant ones
      if (result.suggestions) {
        expect(result.suggestions.length).toBeLessThanOrEqual(3);
      }
    });

    it('should handle empty component name', () => {
      const result = checker.checkComponent('');

      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe(SAFETY_ERROR_CODES.HALLUCINATION);
    });

    it('should provide helpful error message', () => {
      const result = checker.checkComponent('InvalidComponent');

      expect(result.error).toContain('InvalidComponent');
      expect(result.error).toContain('catalog');
    });
  });

  describe('getSuggestions', () => {
    it('should return suggestions for similar component names', () => {
      const suggestions = checker.getSuggestions('Buton', 2);

      expect(suggestions).toContain('Button');
      expect(suggestions.length).toBeLessThanOrEqual(2);
    });

    it('should return multiple suggestions when available', () => {
      const suggestions = checker.getSuggestions('Al', 3);

      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.length).toBeLessThanOrEqual(3);
      // Alert is likely
      expect(suggestions).toContain('Alert');
    });

    it('should return empty array for completely unrelated names', () => {
      const suggestions = checker.getSuggestions('ZZZZZZZZZ', 3);

      // Either empty or very few distant suggestions
      expect(Array.isArray(suggestions)).toBe(true);
    });

    it('should respect max suggestions limit', () => {
      const suggestions = checker.getSuggestions('B', 2);

      expect(suggestions.length).toBeLessThanOrEqual(2);
    });
  });

  describe('isComponentValid', () => {
    it('should return true for valid components', () => {
      expect(checker.isComponentValid('Button')).toBe(true);
      expect(checker.isComponentValid('Card')).toBe(true);
      expect(checker.isComponentValid('Modal')).toBe(true);
    });

    it('should return false for invalid components', () => {
      expect(checker.isComponentValid('InvalidComponent')).toBe(false);
      expect(checker.isComponentValid('FooBar')).toBe(false);
      expect(checker.isComponentValid('')).toBe(false);
    });
  });

  describe('Edge Cases - Null/Undefined Safety', () => {
    it('should handle undefined componentName in checkComponent', () => {
      const result = checker.checkComponent(undefined as any);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('required');
      expect(result.errorCode).toBe(SAFETY_ERROR_CODES.HALLUCINATION);
    });

    it('should handle null componentName in checkComponent', () => {
      const result = checker.checkComponent(null as any);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('required');
      expect(result.errorCode).toBe(SAFETY_ERROR_CODES.HALLUCINATION);
    });

    it('should handle empty string componentName in checkComponent', () => {
      const result = checker.checkComponent('');

      expect(result.isValid).toBe(false);
      // Empty string '' is falsy and caught by the first check
      expect(result.error).toContain('required');
      expect(result.errorCode).toBe(SAFETY_ERROR_CODES.HALLUCINATION);
    });

    it('should handle whitespace-only componentName in checkComponent', () => {
      const result = checker.checkComponent('   ');

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('empty');
      expect(result.errorCode).toBe(SAFETY_ERROR_CODES.HALLUCINATION);
    });

    it('should handle undefined componentName in isComponentValid', () => {
      expect(checker.isComponentValid(undefined as any)).toBe(false);
    });

    it('should handle null componentName in isComponentValid', () => {
      expect(checker.isComponentValid(null as any)).toBe(false);
    });

    it('should handle whitespace-only in isComponentValid', () => {
      expect(checker.isComponentValid('   ')).toBe(false);
    });

    it('should validate known component names', () => {
      const result = checker.checkComponent('Button');

      expect(result.isValid).toBe(true);
      expect(result.componentName).toBe('Button');
    });
  });
});
