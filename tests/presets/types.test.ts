import { describe, it, expect } from 'vitest';
import { PresetSchema } from '../../src/presets/types';
import type { Preset } from '../../src/presets/types';

describe('PresetSchema', () => {
  describe('valid presets', () => {
    it('validates complete preset with all fields', () => {
      const validPreset: Preset = {
        id: 'next-tailwind-shadcn',
        version: '0.1.0',
        name: 'Next.js + Tailwind CSS + shadcn/ui',
        description: 'Default preset for Next.js applications',
        stack: {
          framework: 'nextjs',
          styling: 'tailwindcss',
          components: 'shadcn-ui',
        },
        questionnaire: {
          brandTone: 'professional',
          contrast: 'high',
          density: 'comfortable',
          borderRadius: 'medium',
          primaryColor: { l: 0.5, c: 0.15, h: 220 },
          neutralTone: 'pure',
          fontScale: 'medium',
        },
      };

      const result = PresetSchema.safeParse(validPreset);
      expect(result.success).toBe(true);
    });

    it('validates preset with metadata', () => {
      const presetWithMetadata = {
        id: 'test-preset',
        version: '1.0.0',
        name: 'Test Preset',
        description: 'Test description',
        stack: {
          framework: 'nextjs',
          styling: 'tailwindcss',
          components: 'shadcn-ui',
        },
        questionnaire: {
          brandTone: 'professional',
          contrast: 'high',
          density: 'comfortable',
          borderRadius: 'medium',
          primaryColor: { l: 0.5, c: 0.15, h: 220 },
          neutralTone: 'pure',
          fontScale: 'medium',
        },
        metadata: {
          tags: ['nextjs', 'tailwind'],
          author: 'Test Author',
          homepage: 'https://example.com',
        },
      };

      const result = PresetSchema.safeParse(presetWithMetadata);
      expect(result.success).toBe(true);
    });

    it('validates all framework types', () => {
      const frameworks = ['nextjs', 'vite', 'remix'] as const;

      frameworks.forEach((framework) => {
        const preset = {
          id: `test-${framework}`,
          version: '1.0.0',
          name: `Test ${framework}`,
          description: 'Test',
          stack: { framework, styling: 'tailwindcss', components: 'shadcn-ui' },
          questionnaire: {
            brandTone: 'professional',
            contrast: 'high',
            density: 'comfortable',
            borderRadius: 'medium',
            primaryColor: { l: 0.5, c: 0.15, h: 220 },
            neutralTone: 'pure',
            fontScale: 'medium',
          },
        };

        const result = PresetSchema.safeParse(preset);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('invalid presets', () => {
    it('rejects missing id', () => {
      const preset = {
        version: '1.0.0',
        name: 'Test',
        description: 'Test',
        stack: { framework: 'nextjs', styling: 'tailwindcss', components: 'shadcn-ui' },
        questionnaire: {
          brandTone: 'professional',
          contrast: 'high',
          density: 'comfortable',
          borderRadius: 'medium',
          primaryColor: { l: 0.5, c: 0.15, h: 220 },
          neutralTone: 'pure',
          fontScale: 'medium',
        },
      };

      const result = PresetSchema.safeParse(preset);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes('id'))).toBe(true);
      }
    });

    it('rejects missing version', () => {
      const preset = {
        id: 'test',
        name: 'Test',
        description: 'Test',
        stack: { framework: 'nextjs', styling: 'tailwindcss', components: 'shadcn-ui' },
        questionnaire: {
          brandTone: 'professional',
          contrast: 'high',
          density: 'comfortable',
          borderRadius: 'medium',
          primaryColor: { l: 0.5, c: 0.15, h: 220 },
          neutralTone: 'pure',
          fontScale: 'medium',
        },
      };

      const result = PresetSchema.safeParse(preset);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes('version'))).toBe(true);
      }
    });

    it('rejects invalid framework', () => {
      const preset = {
        id: 'test',
        version: '1.0.0',
        name: 'Test',
        description: 'Test',
        stack: { framework: 'invalid', styling: 'tailwindcss', components: 'shadcn-ui' },
        questionnaire: {
          brandTone: 'professional',
          contrast: 'high',
          density: 'comfortable',
          borderRadius: 'medium',
          primaryColor: { l: 0.5, c: 0.15, h: 220 },
          neutralTone: 'pure',
          fontScale: 'medium',
        },
      };

      const result = PresetSchema.safeParse(preset);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes('framework'))).toBe(true);
      }
    });

    it('rejects invalid questionnaire', () => {
      const preset = {
        id: 'test',
        version: '1.0.0',
        name: 'Test',
        description: 'Test',
        stack: { framework: 'nextjs', styling: 'tailwindcss', components: 'shadcn-ui' },
        questionnaire: {
          brandTone: 'invalid',
          contrast: 'high',
          density: 'comfortable',
          borderRadius: 'medium',
          primaryColor: { l: 0.5, c: 0.15, h: 220 },
          neutralTone: 'pure',
          fontScale: 'medium',
        },
      };

      const result = PresetSchema.safeParse(preset);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes('brandTone'))).toBe(true);
      }
    });

    it('rejects empty id', () => {
      const preset = {
        id: '',
        version: '1.0.0',
        name: 'Test',
        description: 'Test',
        stack: { framework: 'nextjs', styling: 'tailwindcss', components: 'shadcn-ui' },
        questionnaire: {
          brandTone: 'professional',
          contrast: 'high',
          density: 'comfortable',
          borderRadius: 'medium',
          primaryColor: { l: 0.5, c: 0.15, h: 220 },
          neutralTone: 'pure',
          fontScale: 'medium',
        },
      };

      const result = PresetSchema.safeParse(preset);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes('id'))).toBe(true);
      }
    });

    it('rejects empty name', () => {
      const preset = {
        id: 'test',
        version: '1.0.0',
        name: '',
        description: 'Test',
        stack: { framework: 'nextjs', styling: 'tailwindcss', components: 'shadcn-ui' },
        questionnaire: {
          brandTone: 'professional',
          contrast: 'high',
          density: 'comfortable',
          borderRadius: 'medium',
          primaryColor: { l: 0.5, c: 0.15, h: 220 },
          neutralTone: 'pure',
          fontScale: 'medium',
        },
      };

      const result = PresetSchema.safeParse(preset);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes('name'))).toBe(true);
      }
    });
  });
});
