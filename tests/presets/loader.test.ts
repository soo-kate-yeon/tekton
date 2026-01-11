import { describe, it, expect } from 'vitest';
import { loadPreset, loadDefaultPreset, PresetValidationError } from '../../src/presets/loader';
import type { Preset } from '../../src/presets/types';

describe('loadPreset', () => {
  describe('valid presets', () => {
    it('loads minimal valid preset', () => {
      const validPreset = {
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
      };

      const result = loadPreset(validPreset);
      expect(result).toEqual(validPreset);
    });

    it('loads preset with all fields', () => {
      const completePreset = {
        id: 'complete-preset',
        version: '2.0.0',
        name: 'Complete Preset',
        description: 'Complete test preset',
        stack: {
          framework: 'vite',
          styling: 'tailwindcss',
          components: 'shadcn-ui',
        },
        questionnaire: {
          brandTone: 'playful',
          contrast: 'medium',
          density: 'compact',
          borderRadius: 'large',
          primaryColor: { l: 0.6, c: 0.2, h: 150 },
          neutralTone: 'warm',
          fontScale: 'large',
        },
        metadata: {
          tags: ['vite', 'test'],
          author: 'Test Author',
          homepage: 'https://example.com',
        },
      };

      const result = loadPreset(completePreset);
      expect(result).toEqual(completePreset);
    });

    it('loads preset with metadata', () => {
      const presetWithMetadata = {
        id: 'meta-preset',
        version: '1.5.0',
        name: 'Metadata Preset',
        description: 'Preset with metadata',
        stack: {
          framework: 'remix',
          styling: 'tailwindcss',
          components: 'shadcn-ui',
        },
        questionnaire: {
          brandTone: 'elegant',
          contrast: 'high',
          density: 'spacious',
          borderRadius: 'small',
          primaryColor: { l: 0.45, c: 0.1, h: 280 },
          neutralTone: 'cool',
          fontScale: 'small',
        },
        metadata: {
          tags: ['remix', 'elegant'],
        },
      };

      const result = loadPreset(presetWithMetadata);
      expect(result.metadata).toBeDefined();
      expect(result.metadata?.tags).toEqual(['remix', 'elegant']);
    });
  });

  describe('invalid presets', () => {
    it('throws PresetValidationError for missing id', () => {
      const invalidPreset = {
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

      expect(() => loadPreset(invalidPreset)).toThrow(PresetValidationError);
    });

    it('throws with field-level error details', () => {
      const invalidPreset = {
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

      try {
        loadPreset(invalidPreset);
        expect.fail('Should have thrown PresetValidationError');
      } catch (error) {
        expect(error).toBeInstanceOf(PresetValidationError);
        if (error instanceof PresetValidationError) {
          expect(error.message).toContain('framework');
          expect(error.issues).toBeDefined();
          expect(error.issues.length).toBeGreaterThan(0);
        }
      }
    });

    it('includes all validation issues in error', () => {
      const multipleErrors = {
        id: '',
        version: '',
        name: 'Test',
        description: 'Test',
        stack: { framework: 'invalid', styling: 'tailwindcss', components: 'shadcn-ui' },
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

      try {
        loadPreset(multipleErrors);
        expect.fail('Should have thrown');
      } catch (error) {
        if (error instanceof PresetValidationError) {
          expect(error.issues.length).toBeGreaterThan(1);
        }
      }
    });

    it('rejects invalid questionnaire values', () => {
      const invalidQuestionnaire = {
        id: 'test',
        version: '1.0.0',
        name: 'Test',
        description: 'Test',
        stack: { framework: 'nextjs', styling: 'tailwindcss', components: 'shadcn-ui' },
        questionnaire: {
          brandTone: 'invalid-tone',
          contrast: 'high',
          density: 'comfortable',
          borderRadius: 'medium',
          primaryColor: { l: 0.5, c: 0.15, h: 220 },
          neutralTone: 'pure',
          fontScale: 'medium',
        },
      };

      expect(() => loadPreset(invalidQuestionnaire)).toThrow(PresetValidationError);
    });
  });

  describe('error messages', () => {
    it('includes field path in error message', () => {
      const invalidPreset = {
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

      try {
        loadPreset(invalidPreset);
        expect.fail('Should have thrown');
      } catch (error) {
        if (error instanceof PresetValidationError) {
          const hasPathInfo = error.issues.some((issue) =>
            issue.path.includes('questionnaire') || issue.path.includes('brandTone')
          );
          expect(hasPathInfo).toBe(true);
        }
      }
    });

    it('includes expected vs actual values', () => {
      const invalidPreset = {
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

      try {
        loadPreset(invalidPreset);
        expect.fail('Should have thrown');
      } catch (error) {
        if (error instanceof PresetValidationError) {
          expect(error.message.length).toBeGreaterThan(0);
        }
      }
    });

    it('lists all validation errors', () => {
      const multipleErrors = {
        id: '',
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

      try {
        loadPreset(multipleErrors);
        expect.fail('Should have thrown');
      } catch (error) {
        if (error instanceof PresetValidationError) {
          expect(error.issues.length).toBeGreaterThanOrEqual(2);
        }
      }
    });
  });
});

describe('loadDefaultPreset', () => {
  it('loads next-tailwind-shadcn preset', () => {
    const preset = loadDefaultPreset('next-tailwind-shadcn');
    expect(preset).toBeDefined();
    expect(preset.id).toBe('next-tailwind-shadcn');
  });

  it('returns valid Preset object', () => {
    const preset = loadDefaultPreset('next-tailwind-shadcn');
    expect(preset.version).toBeDefined();
    expect(preset.name).toBeDefined();
    expect(preset.description).toBeDefined();
    expect(preset.stack).toBeDefined();
    expect(preset.questionnaire).toBeDefined();
  });

  it('has complete questionnaire config', () => {
    const preset = loadDefaultPreset('next-tailwind-shadcn');
    expect(preset.questionnaire.brandTone).toBe('professional');
    expect(preset.questionnaire.contrast).toBe('high');
    expect(preset.questionnaire.density).toBe('comfortable');
    expect(preset.questionnaire.borderRadius).toBe('medium');
    expect(preset.questionnaire.primaryColor).toBeDefined();
    expect(preset.questionnaire.neutralTone).toBe('pure');
    expect(preset.questionnaire.fontScale).toBe('medium');
  });

  it('has valid metadata', () => {
    const preset = loadDefaultPreset('next-tailwind-shadcn');
    expect(preset.metadata).toBeDefined();
    expect(preset.metadata?.tags).toBeDefined();
    expect(preset.metadata?.tags?.length).toBeGreaterThan(0);
  });

  it('throws for unknown preset id', () => {
    expect(() => loadDefaultPreset('unknown-preset' as any)).toThrow();
  });
});
