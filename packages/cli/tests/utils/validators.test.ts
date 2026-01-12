import { describe, it, expect } from 'vitest';
import { isValidHexColor, validateHexColor } from '../../src/utils/validators.js';

describe('Validators', () => {
  describe('isValidHexColor', () => {
    it('should validate 6-digit hex colors', () => {
      expect(isValidHexColor('#3b82f6')).toBe(true);
      expect(isValidHexColor('#000000')).toBe(true);
      expect(isValidHexColor('#FFFFFF')).toBe(true);
      expect(isValidHexColor('#abc123')).toBe(true);
    });

    it('should validate 3-digit hex colors', () => {
      expect(isValidHexColor('#fff')).toBe(true);
      expect(isValidHexColor('#000')).toBe(true);
      expect(isValidHexColor('#abc')).toBe(true);
    });

    it('should reject invalid hex colors', () => {
      expect(isValidHexColor('3b82f6')).toBe(false);
      expect(isValidHexColor('#3b82f')).toBe(false);
      expect(isValidHexColor('#3b82f66')).toBe(false);
      expect(isValidHexColor('blue')).toBe(false);
      expect(isValidHexColor('')).toBe(false);
      expect(isValidHexColor('#gggggg')).toBe(false);
    });

    it('should handle case insensitivity', () => {
      expect(isValidHexColor('#ABC123')).toBe(true);
      expect(isValidHexColor('#abc123')).toBe(true);
      expect(isValidHexColor('#AbC123')).toBe(true);
    });
  });

  describe('validateHexColor', () => {
    it('should return null for valid colors', () => {
      expect(validateHexColor('#3b82f6')).toBeNull();
      expect(validateHexColor('#fff')).toBeNull();
      expect(validateHexColor('#FFFFFF')).toBeNull();
    });

    it('should return error message for empty color', () => {
      const error = validateHexColor('');
      expect(error).toBe('Color is required');
    });

    it('should return error message for invalid format', () => {
      const error = validateHexColor('blue');
      expect(error).toContain('valid hex color');
    });

    it('should return error message for missing hash', () => {
      const error = validateHexColor('3b82f6');
      expect(error).toContain('valid hex color');
    });
  });
});
