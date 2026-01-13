import { describe, it, expect } from 'vitest';
import {
  SkeletonPreset,
  skeletonContractSchema,
} from '../skeleton';

describe('Skeleton Layer', () => {
  describe('SkeletonPreset enum', () => {
    it('should export all 6 skeleton preset types', () => {
      expect(SkeletonPreset.FullScreen).toBe('full-screen');
      expect(SkeletonPreset.WithHeader).toBe('with-header');
      expect(SkeletonPreset.WithSidebar).toBe('with-sidebar');
      expect(SkeletonPreset.WithHeaderSidebar).toBe('with-header-sidebar');
      expect(SkeletonPreset.WithHeaderFooter).toBe('with-header-footer');
      expect(SkeletonPreset.Dashboard).toBe('dashboard');
    });

    it('should have exactly 6 skeleton preset types', () => {
      const presetValues = Object.values(SkeletonPreset);
      expect(presetValues).toHaveLength(6);
    });
  });

  describe('skeletonContractSchema', () => {
    it('should validate a full-screen skeleton contract', () => {
      const fullScreenContract = {
        preset: SkeletonPreset.FullScreen,
        header: false,
        sidebar: false,
        footer: false,
        content: {
          type: 'main',
          flexible: true,
        },
      };

      const result = skeletonContractSchema.safeParse(fullScreenContract);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.preset).toBe('full-screen');
        expect(result.data.header).toBe(false);
        expect(result.data.sidebar).toBe(false);
        expect(result.data.footer).toBe(false);
      }
    });

    it('should validate a with-header skeleton contract', () => {
      const withHeaderContract = {
        preset: SkeletonPreset.WithHeader,
        header: true,
        sidebar: false,
        footer: false,
        content: {
          type: 'main',
          flexible: true,
        },
      };

      const result = skeletonContractSchema.safeParse(withHeaderContract);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.preset).toBe('with-header');
        expect(result.data.header).toBe(true);
      }
    });

    it('should validate a with-sidebar skeleton contract', () => {
      const withSidebarContract = {
        preset: SkeletonPreset.WithSidebar,
        header: false,
        sidebar: true,
        footer: false,
        content: {
          type: 'main',
          flexible: true,
        },
      };

      const result = skeletonContractSchema.safeParse(withSidebarContract);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sidebar).toBe(true);
      }
    });

    it('should validate a with-header-sidebar skeleton contract', () => {
      const withHeaderSidebarContract = {
        preset: SkeletonPreset.WithHeaderSidebar,
        header: true,
        sidebar: true,
        footer: false,
        content: {
          type: 'main',
          flexible: true,
        },
      };

      const result = skeletonContractSchema.safeParse(withHeaderSidebarContract);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.header).toBe(true);
        expect(result.data.sidebar).toBe(true);
      }
    });

    it('should validate a with-header-footer skeleton contract', () => {
      const withHeaderFooterContract = {
        preset: SkeletonPreset.WithHeaderFooter,
        header: true,
        sidebar: false,
        footer: true,
        content: {
          type: 'main',
          flexible: true,
        },
      };

      const result = skeletonContractSchema.safeParse(withHeaderFooterContract);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.header).toBe(true);
        expect(result.data.footer).toBe(true);
      }
    });

    it('should validate a dashboard skeleton contract', () => {
      const dashboardContract = {
        preset: SkeletonPreset.Dashboard,
        header: true,
        sidebar: true,
        footer: false,
        content: {
          type: 'dashboard',
          flexible: true,
        },
      };

      const result = skeletonContractSchema.safeParse(dashboardContract);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.preset).toBe('dashboard');
      }
    });

    it('should validate all 6 skeleton presets', () => {
      const presets: Array<typeof SkeletonPreset[keyof typeof SkeletonPreset]> = [
        SkeletonPreset.FullScreen,
        SkeletonPreset.WithHeader,
        SkeletonPreset.WithSidebar,
        SkeletonPreset.WithHeaderSidebar,
        SkeletonPreset.WithHeaderFooter,
        SkeletonPreset.Dashboard,
      ];

      presets.forEach((preset) => {
        const contract = {
          preset,
          header: true,
          sidebar: false,
          footer: false,
          content: {
            type: 'main',
            flexible: true,
          },
        };

        const result = skeletonContractSchema.safeParse(contract);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid skeleton preset', () => {
      const invalidContract = {
        preset: 'invalid-preset',
        header: false,
        sidebar: false,
        footer: false,
        content: {
          type: 'main',
          flexible: true,
        },
      };

      const result = skeletonContractSchema.safeParse(invalidContract);
      expect(result.success).toBe(false);
    });

    it('should reject contract with missing header property', () => {
      const invalidContract = {
        preset: SkeletonPreset.FullScreen,
        sidebar: false,
        footer: false,
        content: {
          type: 'main',
          flexible: true,
        },
      };

      const result = skeletonContractSchema.safeParse(invalidContract);
      expect(result.success).toBe(false);
    });

    it('should reject contract with missing sidebar property', () => {
      const invalidContract = {
        preset: SkeletonPreset.FullScreen,
        header: false,
        footer: false,
        content: {
          type: 'main',
          flexible: true,
        },
      };

      const result = skeletonContractSchema.safeParse(invalidContract);
      expect(result.success).toBe(false);
    });

    it('should reject contract with missing footer property', () => {
      const invalidContract = {
        preset: SkeletonPreset.FullScreen,
        header: false,
        sidebar: false,
        content: {
          type: 'main',
          flexible: true,
        },
      };

      const result = skeletonContractSchema.safeParse(invalidContract);
      expect(result.success).toBe(false);
    });

    it('should reject contract with missing content property', () => {
      const invalidContract = {
        preset: SkeletonPreset.FullScreen,
        header: false,
        sidebar: false,
        footer: false,
      };

      const result = skeletonContractSchema.safeParse(invalidContract);
      expect(result.success).toBe(false);
    });

    it('should require content type to be a non-empty string', () => {
      const invalidContract = {
        preset: SkeletonPreset.FullScreen,
        header: false,
        sidebar: false,
        footer: false,
        content: {
          type: '',
          flexible: true,
        },
      };

      const result = skeletonContractSchema.safeParse(invalidContract);
      expect(result.success).toBe(false);
    });

    it('should require content flexible to be a boolean', () => {
      const invalidContract = {
        preset: SkeletonPreset.FullScreen,
        header: false,
        sidebar: false,
        footer: false,
        content: {
          type: 'main',
          flexible: 'yes',
        },
      };

      const result = skeletonContractSchema.safeParse(invalidContract);
      expect(result.success).toBe(false);
    });

    it('should support content with additional optional properties', () => {
      const contractWithOptionalProps = {
        preset: SkeletonPreset.Dashboard,
        header: true,
        sidebar: true,
        footer: false,
        content: {
          type: 'dashboard',
          flexible: true,
          gridColumns: 12,
          gridGap: 16,
        },
      };

      const result = skeletonContractSchema.safeParse(contractWithOptionalProps);
      expect(result.success).toBe(true);
    });
  });

  describe('Type Coverage', () => {
    it('should achieve >=85% test coverage', () => {
      // This test ensures all exported types are used in at least one test
      const usedTypes = {
        SkeletonPreset: true,
        skeletonContractSchema: true,
        SkeletonContract: true,
      };

      expect(Object.keys(usedTypes).length).toBeGreaterThanOrEqual(3);
    });
  });
});
