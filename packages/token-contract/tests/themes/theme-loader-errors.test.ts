import { describe, it, expect } from 'vitest';
import { loadTheme, validatePreset } from '../../src/presets/theme-loader.js';

describe('Preset Loader Error Handling', () => {
  describe('loadTheme error cases', () => {
    it('should throw error for invalid preset name', () => {
      expect(() => loadTheme('nonexistent' as any)).toThrow(
        "Preset 'nonexistent' not found"
      );
    });

    it('should throw error for undefined preset name', () => {
      expect(() => loadTheme(undefined as any)).toThrow();
    });

    it('should throw error for null preset name', () => {
      expect(() => loadTheme(null as any)).toThrow();
    });
  });

  describe('validatePreset error cases', () => {
    it('should return validation error for invalid preset structure', () => {
      const invalidPreset = {
        name: 'invalid',
        description: 'Invalid preset',
        // Missing tokens and composition
      };

      const result = validatePreset(invalidPreset);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should return validation error for preset with invalid tokens', () => {
      const invalidPreset = {
        name: 'test',
        description: 'Test',
        tokens: {
          // Missing required semantic tokens
          primary: {},
        },
        composition: {},
      };

      const result = validatePreset(invalidPreset);
      expect(result.success).toBe(false);
    });

    it('should return validation error for non-object input', () => {
      const result = validatePreset('not an object');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should return validation error for null input', () => {
      const result = validatePreset(null);
      expect(result.success).toBe(false);
    });

    it('should return validation error for undefined input', () => {
      const result = validatePreset(undefined);
      expect(result.success).toBe(false);
    });

    it('should return validation error for array input', () => {
      const result = validatePreset([]);
      expect(result.success).toBe(false);
    });
  });
});
