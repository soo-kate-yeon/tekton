import { describe, it, expect } from 'vitest';
import {
  generateContainerQueryCSS,
  generateContainerQueryFallback,
} from '../src/layout-css-generator.js';
import type { ContainerQueryConfig } from '../src/layout-tokens/types.js';

describe('Container Query CSS Generation', () => {
  describe('generateContainerQueryCSS', () => {
    it('should generate container type and name', () => {
      const config: ContainerQueryConfig = {
        name: 'card',
        type: 'inline-size',
        breakpoints: {},
      };

      const css = generateContainerQueryCSS(config);
      expect(css).toContain('container-type: inline-size');
      expect(css).toContain('container-name: card');
    });

    it('should generate container queries with @supports', () => {
      const config: ContainerQueryConfig = {
        name: 'section',
        type: 'inline-size',
        breakpoints: {
          sm: { minWidth: 320, css: { padding: '1rem' } },
          lg: { minWidth: 640, css: { padding: '2rem' } },
        },
      };

      const css = generateContainerQueryCSS(config);
      expect(css).toContain('@supports (container-type: inline-size)');
      expect(css).toContain('@container section (min-width: 320px)');
      expect(css).toContain('@container section (min-width: 640px)');
      expect(css).toContain('padding: 1rem');
      expect(css).toContain('padding: 2rem');
    });

    it('should handle size type', () => {
      const config: ContainerQueryConfig = {
        name: 'layout',
        type: 'size',
        breakpoints: {},
      };

      const css = generateContainerQueryCSS(config);
      expect(css).toContain('container-type: size');
    });
  });

  describe('generateContainerQueryFallback', () => {
    it('should generate media query fallbacks', () => {
      const config: ContainerQueryConfig = {
        name: 'card',
        type: 'inline-size',
        breakpoints: {
          sm: { minWidth: 320, css: { padding: '1rem' } },
          md: { minWidth: 480, css: { padding: '1.5rem' } },
        },
      };

      const css = generateContainerQueryFallback(config);
      expect(css).toContain('@supports not (container-type: inline-size)');
      expect(css).toContain('@media (min-width:');
      expect(css).toContain('padding: 1rem');
      expect(css).toContain('padding: 1.5rem');
    });
  });
});
