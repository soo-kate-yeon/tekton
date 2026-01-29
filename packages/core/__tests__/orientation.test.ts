/**
 * @tekton/core - Orientation Configuration Tests
 * Tests for Orientation type definitions
 * [SPEC-LAYOUT-003] [PHASE-2]
 */

import { describe, it, expect } from 'vitest';
import { OrientationConfig, FullResponsiveConfig } from '../src/layout-tokens/types.js';

describe('Orientation Types', () => {
  describe('OrientationConfig', () => {
    it('should accept portrait and landscape overrides', () => {
      const config: OrientationConfig<{ width: string }> = {
        portrait: { width: '100%' },
        landscape: { width: '50%' },
      };

      expect(config.portrait?.width).toBe('100%');
      expect(config.landscape?.width).toBe('50%');
    });

    it('should accept only portrait override', () => {
      const config: OrientationConfig<{ height: string }> = {
        portrait: { height: '100vh' },
      };

      expect(config.portrait).toBeDefined();
      expect(config.landscape).toBeUndefined();
    });

    it('should accept only landscape override', () => {
      const config: OrientationConfig<{ display: string }> = {
        landscape: { display: 'flex' },
      };

      expect(config.portrait).toBeUndefined();
      expect(config.landscape).toBeDefined();
    });

    it('should accept empty configuration', () => {
      const config: OrientationConfig<{ padding: string }> = {};

      expect(config.portrait).toBeUndefined();
      expect(config.landscape).toBeUndefined();
    });

    it('should accept complex CSS properties', () => {
      interface LayoutConfig {
        display: string;
        flexDirection: string;
        gap: string;
        padding: string;
      }

      const config: OrientationConfig<LayoutConfig> = {
        portrait: {
          flexDirection: 'column',
          gap: '1rem',
        },
        landscape: {
          flexDirection: 'row',
          gap: '2rem',
          padding: '2rem',
        },
      };

      expect(config.portrait?.flexDirection).toBe('column');
      expect(config.landscape?.flexDirection).toBe('row');
      expect(config.landscape?.padding).toBe('2rem');
    });

    it('should accept partial configuration', () => {
      interface GridConfig {
        gridTemplateColumns: string;
        gridTemplateRows: string;
        gap: string;
      }

      const config: OrientationConfig<GridConfig> = {
        portrait: {
          gridTemplateColumns: '1fr',
        },
        landscape: {
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2rem',
        },
      };

      expect(config.portrait?.gridTemplateRows).toBeUndefined();
      expect(config.landscape?.gridTemplateRows).toBeUndefined();
    });
  });

  describe('FullResponsiveConfig', () => {
    it('should extend ResponsiveConfig with orientation', () => {
      const config: FullResponsiveConfig<{ gap: string }> = {
        default: { gap: '1rem' },
        md: { gap: '1.5rem' },
        xl: { gap: '2rem' },
        orientation: {
          portrait: { gap: '0.5rem' },
        },
      };

      expect(config.default.gap).toBe('1rem');
      expect(config.md?.gap).toBe('1.5rem');
      expect(config.xl?.gap).toBe('2rem');
      expect(config.orientation?.portrait?.gap).toBe('0.5rem');
    });

    it('should work without orientation overrides', () => {
      const config: FullResponsiveConfig<{ padding: string }> = {
        default: { padding: '1rem' },
        lg: { padding: '2rem' },
      };

      expect(config.default).toBeDefined();
      expect(config.orientation).toBeUndefined();
    });

    it('should accept all responsive breakpoints', () => {
      const config: FullResponsiveConfig<{ margin: string }> = {
        default: { margin: '0.5rem' },
        sm: { margin: '0.75rem' },
        md: { margin: '1rem' },
        lg: { margin: '1.5rem' },
        xl: { margin: '2rem' },
        '2xl': { margin: '2.5rem' },
      };

      expect(config.default.margin).toBe('0.5rem');
      expect(config.sm?.margin).toBe('0.75rem');
      expect(config.md?.margin).toBe('1rem');
      expect(config.lg?.margin).toBe('1.5rem');
      expect(config.xl?.margin).toBe('2rem');
      expect(config['2xl']?.margin).toBe('2.5rem');
    });

    it('should combine responsive and orientation overrides', () => {
      interface SectionConfig {
        display: string;
        flexDirection: string;
        gap: string;
      }

      const config: FullResponsiveConfig<SectionConfig> = {
        default: {
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        },
        md: {
          gap: '1.5rem',
        },
        lg: {
          flexDirection: 'row',
          gap: '2rem',
        },
        orientation: {
          portrait: {
            flexDirection: 'column',
          },
          landscape: {
            flexDirection: 'row',
          },
        },
      };

      expect(config.default.display).toBe('flex');
      expect(config.lg?.flexDirection).toBe('row');
      expect(config.orientation?.portrait?.flexDirection).toBe('column');
      expect(config.orientation?.landscape?.flexDirection).toBe('row');
    });

    it('should support complex nested configurations', () => {
      interface GridConfig {
        gridTemplateColumns: string;
        gridTemplateRows?: string;
        gap: string;
        alignItems?: string;
      }

      const config: FullResponsiveConfig<GridConfig> = {
        default: {
          gridTemplateColumns: '1fr',
          gap: '1rem',
        },
        md: {
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.5rem',
        },
        xl: {
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2rem',
        },
        orientation: {
          portrait: {
            gridTemplateColumns: '1fr',
            alignItems: 'center',
          },
          landscape: {
            gridTemplateColumns: 'repeat(2, 1fr)',
          },
        },
      };

      expect(config.default.gridTemplateColumns).toBe('1fr');
      expect(config.xl?.gridTemplateColumns).toBe('repeat(3, 1fr)');
      expect(config.orientation?.portrait?.alignItems).toBe('center');
    });
  });

  describe('Orientation Integration', () => {
    it('should work with tablet landscape scenario', () => {
      interface TabletLayout {
        display: string;
        flexDirection: string;
        maxWidth: string;
      }

      const config: FullResponsiveConfig<TabletLayout> = {
        default: {
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '100%',
        },
        md: {
          maxWidth: '768px',
        },
        orientation: {
          landscape: {
            flexDirection: 'row',
            maxWidth: '90%',
          },
        },
      };

      expect(config.orientation?.landscape?.flexDirection).toBe('row');
      expect(config.orientation?.landscape?.maxWidth).toBe('90%');
    });

    it('should work with mobile portrait optimizations', () => {
      interface MobileLayout {
        padding: string;
        fontSize: string;
      }

      const config: FullResponsiveConfig<MobileLayout> = {
        default: {
          padding: '1rem',
          fontSize: '16px',
        },
        orientation: {
          portrait: {
            padding: '0.5rem',
            fontSize: '14px',
          },
        },
      };

      expect(config.orientation?.portrait?.padding).toBe('0.5rem');
      expect(config.orientation?.portrait?.fontSize).toBe('14px');
    });

    it('should support orientation-first design', () => {
      interface ViewportConfig {
        height: string;
        width: string;
      }

      const config: FullResponsiveConfig<ViewportConfig> = {
        default: {
          height: 'auto',
          width: '100%',
        },
        orientation: {
          portrait: {
            height: '100vh',
            width: '100vw',
          },
          landscape: {
            height: '100vh',
            width: '50vw',
          },
        },
      };

      expect(config.orientation?.portrait?.height).toBe('100vh');
      expect(config.orientation?.landscape?.width).toBe('50vw');
    });
  });

  describe('Orientation Edge Cases', () => {
    it('should handle empty orientation config', () => {
      const config: FullResponsiveConfig<{ color: string }> = {
        default: { color: 'blue' },
        orientation: {},
      };

      expect(config.orientation).toEqual({});
    });

    it('should handle null-like values', () => {
      interface OptionalConfig {
        value?: string;
      }

      const config: FullResponsiveConfig<OptionalConfig> = {
        default: {},
        orientation: {
          portrait: {},
          landscape: {},
        },
      };

      expect(config.orientation?.portrait).toEqual({});
      expect(config.orientation?.landscape).toEqual({});
    });

    it('should support deeply partial configurations', () => {
      interface ComplexConfig {
        layout: {
          display: string;
          grid: {
            columns: number;
            rows: number;
          };
        };
        spacing: {
          padding: string;
          margin: string;
        };
      }

      const config: FullResponsiveConfig<ComplexConfig> = {
        default: {
          layout: {
            display: 'grid',
            grid: {
              columns: 1,
              rows: 1,
            },
          },
          spacing: {
            padding: '1rem',
            margin: '0',
          },
        },
        orientation: {
          landscape: {
            layout: {
              display: 'grid',
              grid: {
                columns: 2,
                rows: 1,
              },
            },
          },
        },
      };

      expect(config.default.layout.grid.columns).toBe(1);
      expect(config.orientation?.landscape?.layout).toBeDefined();
    });
  });
});
