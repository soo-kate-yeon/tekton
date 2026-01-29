import { describe, it, expect } from 'vitest';
import { generateOrientationCSS } from '../src/layout-css-generator.js';
import type { OrientationConfig } from '../src/layout-tokens/types.js';

describe('Orientation CSS Generation', () => {
  describe('generateOrientationCSS', () => {
    it('should generate portrait media query', () => {
      const config: OrientationConfig<{ gap: string }> = {
        portrait: { gap: '0.5rem' },
      };

      const cssGen = (cfg: Partial<{ gap: string }>) => `  gap: ${cfg.gap};`;

      const css = generateOrientationCSS(config, cssGen);
      expect(css).toContain('@media (orientation: portrait)');
      expect(css).toContain('gap: 0.5rem');
    });

    it('should generate landscape media query', () => {
      const config: OrientationConfig<{ gap: string }> = {
        landscape: { gap: '2rem' },
      };

      const cssGen = (cfg: Partial<{ gap: string }>) => `  gap: ${cfg.gap};`;

      const css = generateOrientationCSS(config, cssGen);
      expect(css).toContain('@media (orientation: landscape)');
      expect(css).toContain('gap: 2rem');
    });

    it('should generate both portrait and landscape', () => {
      const config: OrientationConfig<{ gap: string }> = {
        portrait: { gap: '0.5rem' },
        landscape: { gap: '2rem' },
      };

      const cssGen = (cfg: Partial<{ gap: string }>) => `  gap: ${cfg.gap};`;

      const css = generateOrientationCSS(config, cssGen);
      expect(css).toContain('@media (orientation: portrait)');
      expect(css).toContain('@media (orientation: landscape)');
      expect(css).toContain('gap: 0.5rem');
      expect(css).toContain('gap: 2rem');
    });
  });
});
