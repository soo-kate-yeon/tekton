import { describe, it, expect } from 'vitest';
import {
  loadTheme,
  getAvailablePresets,
  validatePreset,
} from '../../src/presets/theme-loader.js';

describe('Preset Loader', () => {
  describe('getAvailablePresets', () => {
    it('should return all 7 curated presets', () => {
      const presets = getAvailablePresets();
      expect(presets).toHaveLength(7);
    });

    it('should include all required preset names', () => {
      const presets = getAvailablePresets();
      const presetNames = presets.map(p => p.name);

      expect(presetNames).toContain('professional');
      expect(presetNames).toContain('creative');
      expect(presetNames).toContain('minimal');
      expect(presetNames).toContain('bold');
      expect(presetNames).toContain('warm');
      expect(presetNames).toContain('cool');
      expect(presetNames).toContain('high-contrast');
    });

    it('should have descriptions for all presets', () => {
      const presets = getAvailablePresets();
      presets.forEach(preset => {
        expect(preset.description).toBeDefined();
        expect(preset.description.length).toBeGreaterThan(0);
      });
    });
  });

  describe('loadTheme', () => {
    it('should load professional preset', () => {
      const preset = loadTheme('professional');
      expect(preset).toBeDefined();
      expect(preset.name).toBe('professional');
    });

    it('should load creative preset', () => {
      const preset = loadTheme('creative');
      expect(preset).toBeDefined();
      expect(preset.name).toBe('creative');
    });

    it('should load minimal preset', () => {
      const preset = loadTheme('minimal');
      expect(preset).toBeDefined();
      expect(preset.name).toBe('minimal');
    });

    it('should load bold preset', () => {
      const preset = loadTheme('bold');
      expect(preset).toBeDefined();
      expect(preset.name).toBe('bold');
    });

    it('should load warm preset', () => {
      const preset = loadTheme('warm');
      expect(preset).toBeDefined();
      expect(preset.name).toBe('warm');
    });

    it('should load cool preset', () => {
      const preset = loadTheme('cool');
      expect(preset).toBeDefined();
      expect(preset.name).toBe('cool');
    });

    it('should load high-contrast preset', () => {
      const preset = loadTheme('high-contrast');
      expect(preset).toBeDefined();
      expect(preset.name).toBe('high-contrast');
    });

    it('should throw error for invalid preset name', () => {
      expect(() => loadTheme('invalid-preset' as any)).toThrow();
    });
  });

  describe('validatePreset', () => {
    it('should validate professional preset structure', () => {
      const preset = loadTheme('professional');
      const result = validatePreset(preset);
      expect(result.success).toBe(true);
    });

    it('should validate all presets have required semantic tokens', () => {
      const presetNames = ['professional', 'creative', 'minimal', 'bold', 'warm', 'cool', 'high-contrast'] as const;

      presetNames.forEach(name => {
        const preset = loadTheme(name);
        expect(preset.tokens.primary).toBeDefined();
        expect(preset.tokens.neutral).toBeDefined();
        expect(preset.tokens.success).toBeDefined();
        expect(preset.tokens.warning).toBeDefined();
        expect(preset.tokens.error).toBeDefined();
      });
    });

    it('should validate all presets have composition tokens', () => {
      const presetNames = ['professional', 'creative', 'minimal', 'bold', 'warm', 'cool', 'high-contrast'] as const;

      presetNames.forEach(name => {
        const preset = loadTheme(name);
        expect(preset.composition).toBeDefined();
        expect(preset.composition.border).toBeDefined();
        expect(preset.composition.shadow).toBeDefined();
        expect(preset.composition.spacing).toBeDefined();
        expect(preset.composition.typography).toBeDefined();
      });
    });
  });
});
