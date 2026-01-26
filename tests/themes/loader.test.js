import { describe, it, expect } from 'vitest';
import { loadTheme, loadDefaultTheme, ThemeValidationError } from '../../src/themes/loader';
describe('loadTheme', () => {
    describe('valid themes', () => {
        it('loads minimal valid theme', () => {
            const validTheme = {
                id: 'test-theme',
                version: '1.0.0',
                name: 'Test Theme',
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
            const result = loadTheme(validTheme);
            expect(result).toEqual(validTheme);
        });
        it('loads theme with all fields', () => {
            const completeTheme = {
                id: 'complete-theme',
                version: '2.0.0',
                name: 'Complete Theme',
                description: 'Complete test theme',
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
            const result = loadTheme(completeTheme);
            expect(result).toEqual(completeTheme);
        });
        it('loads theme with metadata', () => {
            const themeWithMetadata = {
                id: 'meta-theme',
                version: '1.5.0',
                name: 'Metadata Theme',
                description: 'Theme with metadata',
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
            const result = loadTheme(themeWithMetadata);
            expect(result.metadata).toBeDefined();
            expect(result.metadata?.tags).toEqual(['remix', 'elegant']);
        });
    });
    describe('invalid themes', () => {
        it('throws ThemeValidationError for missing id', () => {
            const invalidTheme = {
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
            expect(() => loadTheme(invalidTheme)).toThrow(ThemeValidationError);
        });
        it('throws with field-level error details', () => {
            const invalidTheme = {
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
                loadTheme(invalidTheme);
                expect.fail('Should have thrown ThemeValidationError');
            }
            catch (error) {
                expect(error).toBeInstanceOf(ThemeValidationError);
                if (error instanceof ThemeValidationError) {
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
                loadTheme(multipleErrors);
                expect.fail('Should have thrown');
            }
            catch (error) {
                if (error instanceof ThemeValidationError) {
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
            expect(() => loadTheme(invalidQuestionnaire)).toThrow(ThemeValidationError);
        });
    });
    describe('error messages', () => {
        it('includes field path in error message', () => {
            const invalidTheme = {
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
                loadTheme(invalidTheme);
                expect.fail('Should have thrown');
            }
            catch (error) {
                if (error instanceof ThemeValidationError) {
                    const hasPathInfo = error.issues.some(issue => issue.path.includes('questionnaire') || issue.path.includes('brandTone'));
                    expect(hasPathInfo).toBe(true);
                }
            }
        });
        it('includes expected vs actual values', () => {
            const invalidTheme = {
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
                loadTheme(invalidTheme);
                expect.fail('Should have thrown');
            }
            catch (error) {
                if (error instanceof ThemeValidationError) {
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
                loadTheme(multipleErrors);
                expect.fail('Should have thrown');
            }
            catch (error) {
                if (error instanceof ThemeValidationError) {
                    expect(error.issues.length).toBeGreaterThanOrEqual(2);
                }
            }
        });
    });
});
describe('loadDefaultTheme', () => {
    it('loads next-tailwind-shadcn theme', () => {
        const theme = loadDefaultTheme('next-tailwind-shadcn');
        expect(theme).toBeDefined();
        expect(theme.id).toBe('next-tailwind-shadcn');
    });
    it('returns valid Theme object', () => {
        const theme = loadDefaultTheme('next-tailwind-shadcn');
        expect(theme.version).toBeDefined();
        expect(theme.name).toBeDefined();
        expect(theme.description).toBeDefined();
        expect(theme.stack).toBeDefined();
        expect(theme.questionnaire).toBeDefined();
    });
    it('has complete questionnaire config', () => {
        const theme = loadDefaultTheme('next-tailwind-shadcn');
        expect(theme.questionnaire.brandTone).toBe('professional');
        expect(theme.questionnaire.contrast).toBe('high');
        expect(theme.questionnaire.density).toBe('comfortable');
        expect(theme.questionnaire.borderRadius).toBe('medium');
        expect(theme.questionnaire.primaryColor).toBeDefined();
        expect(theme.questionnaire.neutralTone).toBe('pure');
        expect(theme.questionnaire.fontScale).toBe('medium');
    });
    it('has valid metadata', () => {
        const theme = loadDefaultTheme('next-tailwind-shadcn');
        expect(theme.metadata).toBeDefined();
        expect(theme.metadata?.tags).toBeDefined();
        expect(theme.metadata?.tags?.length).toBeGreaterThan(0);
    });
    it('throws for unknown theme id', () => {
        expect(() => loadDefaultTheme('unknown-theme')).toThrow();
    });
});
//# sourceMappingURL=loader.test.js.map