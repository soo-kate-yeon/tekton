/**
 * CSS Variable Naming Tests
 * Tests for --tekton-{semantic}-{step} naming convention
 */

import { describe, it, expect } from 'vitest';
import {
  generateVariableName,
  validateVariableName,
  isValidCSSVariableName,
} from '../../src/css-generator/variable-naming.js';

describe('CSS Variable Naming', () => {
  describe('generateVariableName', () => {
    it('should generate valid CSS variable names for semantic tokens', () => {
      expect(generateVariableName('primary', '500')).toBe('--tekton-primary-500');
      expect(generateVariableName('neutral', '50')).toBe('--tekton-neutral-50');
      expect(generateVariableName('success', '900')).toBe('--tekton-success-900');
    });

    it('should generate valid CSS variable names for state tokens', () => {
      expect(generateVariableName('button', 'hover')).toBe('--tekton-button-hover');
      expect(generateVariableName('input', 'focus')).toBe('--tekton-input-focus');
      expect(generateVariableName('link', 'active')).toBe('--tekton-link-active');
    });

    it('should generate valid CSS variable names for composition tokens', () => {
      expect(generateVariableName('border', 'default')).toBe('--tekton-border-default');
      expect(generateVariableName('shadow', 'sm')).toBe('--tekton-shadow-sm');
      expect(generateVariableName('spacing', 'md')).toBe('--tekton-spacing-md');
    });

    it('should handle kebab-case token names', () => {
      expect(generateVariableName('primary-dark', '500')).toBe('--tekton-primary-dark-500');
      expect(generateVariableName('button-primary', 'hover')).toBe('--tekton-button-primary-hover');
    });

    it('should handle numeric step values', () => {
      expect(generateVariableName('primary', 500)).toBe('--tekton-primary-500');
      expect(generateVariableName('neutral', 50)).toBe('--tekton-neutral-50');
    });

    it('should sanitize invalid characters', () => {
      expect(generateVariableName('primary!', '500')).toBe('--tekton-primary-500');
      expect(generateVariableName('button@hover', 'active')).toBe('--tekton-buttonhover-active');
    });
  });

  describe('validateVariableName', () => {
    it('should validate correct CSS variable names', () => {
      expect(validateVariableName('--tekton-primary-500')).toBe(true);
      expect(validateVariableName('--tekton-button-hover')).toBe(true);
      expect(validateVariableName('--tekton-border-default')).toBe(true);
    });

    it('should reject invalid CSS variable names', () => {
      expect(validateVariableName('tekton-primary-500')).toBe(false); // Missing --
      expect(validateVariableName('--primary-500')).toBe(false); // Missing tekton prefix
      expect(validateVariableName('--tekton-')).toBe(false); // Incomplete
      expect(validateVariableName('--tekton')).toBe(false); // No token name
    });

    it('should reject names with invalid characters', () => {
      expect(validateVariableName('--tekton-primary!-500')).toBe(false);
      expect(validateVariableName('--tekton-button@hover')).toBe(false);
      expect(validateVariableName('--tekton-primary 500')).toBe(false); // Space
    });

    it('should handle edge cases', () => {
      expect(validateVariableName('')).toBe(false);
      expect(validateVariableName('--')).toBe(false);
      expect(validateVariableName('--tekton-a-b')).toBe(true); // Single char parts
    });
  });

  describe('isValidCSSVariableName', () => {
    it('should validate CSS custom property syntax', () => {
      expect(isValidCSSVariableName('--valid-name')).toBe(true);
      expect(isValidCSSVariableName('--valid-name-123')).toBe(true);
      expect(isValidCSSVariableName('--_valid')).toBe(true);
    });

    it('should reject invalid CSS custom property syntax', () => {
      expect(isValidCSSVariableName('invalid')).toBe(false);
      expect(isValidCSSVariableName('-invalid')).toBe(false);
      expect(isValidCSSVariableName('--invalid name')).toBe(false);
      expect(isValidCSSVariableName('--invalid@name')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isValidCSSVariableName('--')).toBe(true); // Technically valid
      expect(isValidCSSVariableName('---')).toBe(true);
      expect(isValidCSSVariableName('')).toBe(false);
    });
  });
});
