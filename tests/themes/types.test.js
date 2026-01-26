import { describe, it, expect } from 'vitest';
import { ThemeSchema } from '../../src/themes/types';
describe('ThemeSchema', () => {
    describe('valid themes', () => {
        it('validates complete theme with all fields', () => {
            const validTheme = {
                id: 'next-tailwind-shadcn',
                version: '0.1.0',
                name: 'Next.js + Tailwind CSS + shadcn/ui',
                description: 'Default theme for Next.js applications',
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
            const result = ThemeSchema.safeParse(validTheme);
            expect(result.success).toBe(true);
        });
        it('validates theme with metadata', () => {
            const themeWithMetadata = {
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
                metadata: {
                    tags: ['nextjs', 'tailwind'],
                    author: 'Test Author',
                    homepage: 'https://example.com',
                },
            };
            const result = ThemeSchema.safeParse(themeWithMetadata);
            expect(result.success).toBe(true);
        });
        it('validates all framework types', () => {
            const frameworks = ['nextjs', 'vite', 'remix'];
            frameworks.forEach(framework => {
                const theme = {
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
                const result = ThemeSchema.safeParse(theme);
                expect(result.success).toBe(true);
            });
        });
    });
    describe('invalid themes', () => {
        it('rejects missing id', () => {
            const theme = {
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
            const result = ThemeSchema.safeParse(theme);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues.some(i => i.path.includes('id'))).toBe(true);
            }
        });
        it('rejects missing version', () => {
            const theme = {
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
            const result = ThemeSchema.safeParse(theme);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues.some(i => i.path.includes('version'))).toBe(true);
            }
        });
        it('rejects invalid framework', () => {
            const theme = {
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
            const result = ThemeSchema.safeParse(theme);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues.some(i => i.path.includes('framework'))).toBe(true);
            }
        });
        it('rejects invalid questionnaire', () => {
            const theme = {
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
            const result = ThemeSchema.safeParse(theme);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues.some(i => i.path.includes('brandTone'))).toBe(true);
            }
        });
        it('rejects empty id', () => {
            const theme = {
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
            const result = ThemeSchema.safeParse(theme);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues.some(i => i.path.includes('id'))).toBe(true);
            }
        });
        it('rejects empty name', () => {
            const theme = {
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
            const result = ThemeSchema.safeParse(theme);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues.some(i => i.path.includes('name'))).toBe(true);
            }
        });
    });
});
//# sourceMappingURL=types.test.js.map