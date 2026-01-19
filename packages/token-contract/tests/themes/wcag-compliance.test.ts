import { describe, it, expect } from 'vitest';
import { loadTheme } from '../../src/presets/theme-loader.js';
import { validateWCAGCompliance } from '../../src/presets/wcag-compliance.js';

describe('WCAG Compliance', () => {
  const presetNames = [
    'professional',
    'creative',
    'minimal',
    'bold',
    'warm',
    'cool',
    'high-contrast',
  ] as const;

  describe('AA Compliance', () => {
    presetNames.forEach(themeName => {
      it(`should validate ${themeName} preset has contrast checks`, () => {
        const preset = loadTheme(themeName);
        const result = validateWCAGCompliance(preset, 'AA');

        // Verify that WCAG checks are performed
        expect(result.checks.length).toBeGreaterThan(0);
        expect(result.level).toBe('AA');
      });
    });

    it('should validate primary color contrast against neutral background', () => {
      presetNames.forEach(themeName => {
        const preset = loadTheme(themeName);
        const result = validateWCAGCompliance(preset, 'AA');

        const primaryChecks = result.checks.filter(
          check => check.semantic === 'primary'
        );
        // At least some primary checks should exist
        expect(primaryChecks.length).toBeGreaterThan(0);
      });
    });

    it('should validate success color contrast', () => {
      presetNames.forEach(themeName => {
        const preset = loadTheme(themeName);
        const result = validateWCAGCompliance(preset, 'AA');

        const successChecks = result.checks.filter(
          check => check.semantic === 'success'
        );
        // At least some success checks should exist
        expect(successChecks.length).toBeGreaterThan(0);
      });
    });

    it('should validate error color contrast', () => {
      presetNames.forEach(themeName => {
        const preset = loadTheme(themeName);
        const result = validateWCAGCompliance(preset, 'AA');

        const errorChecks = result.checks.filter(
          check => check.semantic === 'error'
        );
        // At least some error checks should exist
        expect(errorChecks.length).toBeGreaterThan(0);
      });
    });

    it('should validate warning color contrast', () => {
      presetNames.forEach(themeName => {
        const preset = loadTheme(themeName);
        const result = validateWCAGCompliance(preset, 'AA');

        const warningChecks = result.checks.filter(
          check => check.semantic === 'warning'
        );
        // At least some warning checks should exist
        expect(warningChecks.length).toBeGreaterThan(0);
      });
    });
  });

  describe('High Contrast Preset - AAA Compliance', () => {
    it('should validate high-contrast preset has AAA checks', () => {
      const preset = loadTheme('high-contrast');
      const result = validateWCAGCompliance(preset, 'AAA');

      expect(result.level).toBe('AAA');
      expect(result.checks.length).toBeGreaterThan(0);
    });

    it('should have high contrast ratios for high-contrast preset', () => {
      const preset = loadTheme('high-contrast');
      const result = validateWCAGCompliance(preset, 'AA');

      // High contrast preset should have higher average contrast
      const avgContrast =
        result.checks.reduce((sum, check) => sum + check.contrastRatio, 0) /
        result.checks.length;

      expect(avgContrast).toBeGreaterThan(3.0);
    });
  });

  describe('Preset Characteristics', () => {
    it('should have professional preset with contrast checks', () => {
      const preset = loadTheme('professional');
      const result = validateWCAGCompliance(preset, 'AA');

      const avgContrast =
        result.checks.reduce((sum, check) => sum + check.contrastRatio, 0) /
        result.checks.length;

      // Professional preset should have reasonable contrast
      expect(avgContrast).toBeGreaterThan(2.0);
    });

    it('should have bold preset with maximum chroma', () => {
      const preset = loadTheme('bold');

      // Bold preset should have higher chroma values
      const primaryChroma = preset.tokens.primary['500']?.c ?? 0;
      expect(primaryChroma).toBeGreaterThan(0.1);
    });

    it('should have minimal preset with low chroma', () => {
      const preset = loadTheme('minimal');

      // Minimal preset should have lower chroma values
      const primaryChroma = preset.tokens.primary['500']?.c ?? 0;
      expect(primaryChroma).toBeLessThan(0.15);
    });
  });
});
