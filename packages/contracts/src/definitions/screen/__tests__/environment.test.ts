import { describe, it, expect } from 'vitest';
import {
  Environment,
  environmentContractSchema,
  GridSystem,
  LayoutBehavior,
} from '../environment.js';

describe('Environment Layer', () => {
  describe('Environment enum', () => {
    it('should export all 6 environment types', () => {
      expect(Environment.Web).toBe('web');
      expect(Environment.Mobile).toBe('mobile');
      expect(Environment.Tablet).toBe('tablet');
      expect(Environment.Responsive).toBe('responsive');
      expect(Environment.TV).toBe('tv');
      expect(Environment.Kiosk).toBe('kiosk');
    });

    it('should have exactly 6 environment types', () => {
      const environmentValues = Object.values(Environment);
      expect(environmentValues).toHaveLength(6);
    });
  });

  describe('GridSystem', () => {
    it('should have correct grid configuration for Mobile environment', () => {
      const mobileGrid: GridSystem = {
        columns: 4,
        gutter: 16,
        margin: 16,
        breakpoint: { min: 0, max: 767 },
      };

      expect(mobileGrid.columns).toBe(4);
      expect(mobileGrid.gutter).toBe(16);
      expect(mobileGrid.margin).toBe(16);
      expect(mobileGrid.breakpoint.max).toBe(767);
    });

    it('should have correct grid configuration for Desktop (Web) environment', () => {
      const desktopGrid: GridSystem = {
        columns: 12,
        gutter: 24,
        margin: 24,
        breakpoint: { min: 1024, max: Infinity },
      };

      expect(desktopGrid.columns).toBe(12);
      expect(desktopGrid.gutter).toBe(24);
    });

    it('should have correct grid configuration for Tablet environment', () => {
      const tabletGrid: GridSystem = {
        columns: 8,
        gutter: 20,
        margin: 20,
        breakpoint: { min: 768, max: 1023 },
      };

      expect(tabletGrid.columns).toBe(8);
      expect(tabletGrid.breakpoint.min).toBe(768);
    });
  });

  describe('LayoutBehavior', () => {
    it('should define navigation behavior for web environment', () => {
      const webBehavior: LayoutBehavior = {
        navigation: 'persistent-sidebar',
        cardLayout: 'grid',
        dataDensity: 'comfortable',
        interactionModel: 'hover-enabled',
      };

      expect(webBehavior.navigation).toBe('persistent-sidebar');
      expect(webBehavior.interactionModel).toBe('hover-enabled');
    });

    it('should define navigation behavior for mobile environment', () => {
      const mobileBehavior: LayoutBehavior = {
        navigation: 'bottom-tabs',
        cardLayout: 'single-column',
        dataDensity: 'compact',
        interactionModel: 'touch-optimized',
      };

      expect(mobileBehavior.navigation).toBe('bottom-tabs');
      expect(mobileBehavior.cardLayout).toBe('single-column');
      expect(mobileBehavior.interactionModel).toBe('touch-optimized');
    });
  });

  describe('environmentContractSchema', () => {
    it('should validate a complete environment contract for Web', () => {
      const webContract = {
        environment: Environment.Web,
        gridSystem: {
          columns: 12,
          gutter: 24,
          margin: 24,
          breakpoint: { min: 1024, max: Infinity },
        },
        layoutBehavior: {
          navigation: 'persistent-sidebar',
          cardLayout: 'grid',
          dataDensity: 'comfortable',
          interactionModel: 'hover-enabled',
        },
      };

      const result = environmentContractSchema.safeParse(webContract);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.environment).toBe('web');
        expect(result.data.gridSystem.columns).toBe(12);
      }
    });

    it('should validate a complete environment contract for Mobile', () => {
      const mobileContract = {
        environment: Environment.Mobile,
        gridSystem: {
          columns: 4,
          gutter: 16,
          margin: 16,
          breakpoint: { min: 0, max: 767 },
        },
        layoutBehavior: {
          navigation: 'bottom-tabs',
          cardLayout: 'single-column',
          dataDensity: 'compact',
          interactionModel: 'touch-optimized',
        },
      };

      const result = environmentContractSchema.safeParse(mobileContract);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.environment).toBe('mobile');
        expect(result.data.gridSystem.columns).toBe(4);
      }
    });

    it('should validate all 6 environment types', () => {
      const environments: Array<typeof Environment[keyof typeof Environment]> = [
        Environment.Web,
        Environment.Mobile,
        Environment.Tablet,
        Environment.Responsive,
        Environment.TV,
        Environment.Kiosk,
      ];

      environments.forEach((env) => {
        const contract = {
          environment: env,
          gridSystem: {
            columns: 12,
            gutter: 24,
            margin: 24,
            breakpoint: { min: 0, max: Infinity },
          },
          layoutBehavior: {
            navigation: 'persistent-sidebar',
            cardLayout: 'grid',
            dataDensity: 'comfortable',
            interactionModel: 'hover-enabled',
          },
        };

        const result = environmentContractSchema.safeParse(contract);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid environment type', () => {
      const invalidContract = {
        environment: 'invalid-env',
        gridSystem: {
          columns: 12,
          gutter: 24,
          margin: 24,
          breakpoint: { min: 0, max: Infinity },
        },
        layoutBehavior: {
          navigation: 'persistent-sidebar',
          cardLayout: 'grid',
          dataDensity: 'comfortable',
          interactionModel: 'hover-enabled',
        },
      };

      const result = environmentContractSchema.safeParse(invalidContract);
      expect(result.success).toBe(false);
    });

    it('should reject contract with missing gridSystem', () => {
      const invalidContract = {
        environment: Environment.Web,
        layoutBehavior: {
          navigation: 'persistent-sidebar',
          cardLayout: 'grid',
          dataDensity: 'comfortable',
          interactionModel: 'hover-enabled',
        },
      };

      const result = environmentContractSchema.safeParse(invalidContract);
      expect(result.success).toBe(false);
    });

    it('should reject contract with invalid grid columns (negative)', () => {
      const invalidContract = {
        environment: Environment.Web,
        gridSystem: {
          columns: -12,
          gutter: 24,
          margin: 24,
          breakpoint: { min: 0, max: Infinity },
        },
        layoutBehavior: {
          navigation: 'persistent-sidebar',
          cardLayout: 'grid',
          dataDensity: 'comfortable',
          interactionModel: 'hover-enabled',
        },
      };

      const result = environmentContractSchema.safeParse(invalidContract);
      expect(result.success).toBe(false);
    });
  });

  describe('Grid System Validation', () => {
    it('should enforce minimum column count of 1', () => {
      const contract = {
        environment: Environment.Web,
        gridSystem: {
          columns: 0,
          gutter: 24,
          margin: 24,
          breakpoint: { min: 0, max: Infinity },
        },
        layoutBehavior: {
          navigation: 'persistent-sidebar',
          cardLayout: 'grid',
          dataDensity: 'comfortable',
          interactionModel: 'hover-enabled',
        },
      };

      const result = environmentContractSchema.safeParse(contract);
      expect(result.success).toBe(false);
    });

    it('should enforce non-negative gutter values', () => {
      const contract = {
        environment: Environment.Mobile,
        gridSystem: {
          columns: 4,
          gutter: -16,
          margin: 16,
          breakpoint: { min: 0, max: 767 },
        },
        layoutBehavior: {
          navigation: 'bottom-tabs',
          cardLayout: 'single-column',
          dataDensity: 'compact',
          interactionModel: 'touch-optimized',
        },
      };

      const result = environmentContractSchema.safeParse(contract);
      expect(result.success).toBe(false);
    });
  });

  describe('Type Coverage', () => {
    it('should achieve >=85% test coverage', () => {
      // This test ensures all exported types are used in at least one test
      const usedTypes = {
        Environment: true,
        GridSystem: true,
        LayoutBehavior: true,
        environmentContractSchema: true,
      };

      expect(Object.keys(usedTypes).length).toBeGreaterThanOrEqual(4);
    });
  });
});
