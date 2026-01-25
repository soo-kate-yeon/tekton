import { describe, it, expect } from 'vitest';
import { QuestionnaireSchema, DEFAULT_QUESTIONNAIRE, } from '../src/generator/questionnaire';
describe('Questionnaire Schema - TASK-008 (EDR-002)', () => {
    describe('Schema Validation', () => {
        it('should validate complete questionnaire', () => {
            const questionnaire = {
                brandTone: 'professional',
                contrast: 'high',
                density: 'comfortable',
                borderRadius: 'medium',
                primaryColor: { l: 0.5, c: 0.15, h: 220 },
                neutralTone: 'pure',
                fontScale: 'medium',
            };
            const result = QuestionnaireSchema.safeParse(questionnaire);
            expect(result.success).toBe(true);
        });
        it('should validate brandTone options', () => {
            const validTones = ['professional', 'playful', 'elegant', 'bold', 'minimal'];
            validTones.forEach((tone) => {
                const result = QuestionnaireSchema.safeParse({
                    ...DEFAULT_QUESTIONNAIRE,
                    brandTone: tone,
                });
                expect(result.success).toBe(true);
            });
        });
        it('should reject invalid brandTone', () => {
            const result = QuestionnaireSchema.safeParse({
                ...DEFAULT_QUESTIONNAIRE,
                brandTone: 'invalid',
            });
            expect(result.success).toBe(false);
        });
        it('should validate contrast options', () => {
            const validContrasts = ['low', 'medium', 'high', 'maximum'];
            validContrasts.forEach((contrast) => {
                const result = QuestionnaireSchema.safeParse({
                    ...DEFAULT_QUESTIONNAIRE,
                    contrast,
                });
                expect(result.success).toBe(true);
            });
        });
        it('should validate density options', () => {
            const validDensities = ['compact', 'comfortable', 'spacious'];
            validDensities.forEach((density) => {
                const result = QuestionnaireSchema.safeParse({
                    ...DEFAULT_QUESTIONNAIRE,
                    density,
                });
                expect(result.success).toBe(true);
            });
        });
        it('should validate borderRadius options', () => {
            const validRadius = ['none', 'small', 'medium', 'large', 'full'];
            validRadius.forEach((borderRadius) => {
                const result = QuestionnaireSchema.safeParse({
                    ...DEFAULT_QUESTIONNAIRE,
                    borderRadius,
                });
                expect(result.success).toBe(true);
            });
        });
        it('should validate primaryColor OKLCH format', () => {
            const result = QuestionnaireSchema.safeParse({
                ...DEFAULT_QUESTIONNAIRE,
                primaryColor: { l: 0.5, c: 0.15, h: 220 },
            });
            expect(result.success).toBe(true);
        });
        it('should reject invalid primaryColor', () => {
            const result = QuestionnaireSchema.safeParse({
                ...DEFAULT_QUESTIONNAIRE,
                primaryColor: { l: 2.0, c: 0.15, h: 220 }, // Invalid lightness
            });
            expect(result.success).toBe(false);
        });
        it('should validate neutralTone options', () => {
            const validTones = ['pure', 'warm', 'cool'];
            validTones.forEach((neutralTone) => {
                const result = QuestionnaireSchema.safeParse({
                    ...DEFAULT_QUESTIONNAIRE,
                    neutralTone,
                });
                expect(result.success).toBe(true);
            });
        });
        it('should validate fontScale options', () => {
            const validScales = ['small', 'medium', 'large'];
            validScales.forEach((fontScale) => {
                const result = QuestionnaireSchema.safeParse({
                    ...DEFAULT_QUESTIONNAIRE,
                    fontScale,
                });
                expect(result.success).toBe(true);
            });
        });
    });
    describe('Default Configuration', () => {
        it('should provide default questionnaire', () => {
            expect(DEFAULT_QUESTIONNAIRE).toBeDefined();
            expect(DEFAULT_QUESTIONNAIRE.brandTone).toBe('professional');
            expect(DEFAULT_QUESTIONNAIRE.contrast).toBe('high');
            expect(DEFAULT_QUESTIONNAIRE.density).toBe('comfortable');
            expect(DEFAULT_QUESTIONNAIRE.borderRadius).toBe('medium');
            expect(DEFAULT_QUESTIONNAIRE.neutralTone).toBe('pure');
            expect(DEFAULT_QUESTIONNAIRE.fontScale).toBe('medium');
        });
        it('should validate default questionnaire', () => {
            const result = QuestionnaireSchema.safeParse(DEFAULT_QUESTIONNAIRE);
            expect(result.success).toBe(true);
        });
        it('should have valid default primary color', () => {
            expect(DEFAULT_QUESTIONNAIRE.primaryColor.l).toBeGreaterThanOrEqual(0);
            expect(DEFAULT_QUESTIONNAIRE.primaryColor.l).toBeLessThanOrEqual(1);
            expect(DEFAULT_QUESTIONNAIRE.primaryColor.c).toBeGreaterThanOrEqual(0);
            expect(DEFAULT_QUESTIONNAIRE.primaryColor.h).toBeGreaterThanOrEqual(0);
            expect(DEFAULT_QUESTIONNAIRE.primaryColor.h).toBeLessThanOrEqual(360);
        });
    });
    describe('Partial Configuration', () => {
        it('should allow partial questionnaire with defaults', () => {
            const partial = {
                brandTone: 'playful',
                primaryColor: { l: 0.6, c: 0.18, h: 280 },
            };
            // Should be able to merge with defaults
            const complete = { ...DEFAULT_QUESTIONNAIRE, ...partial };
            const result = QuestionnaireSchema.safeParse(complete);
            expect(result.success).toBe(true);
        });
    });
    describe('Edge Cases', () => {
        it('should handle minimum lightness primary color', () => {
            const result = QuestionnaireSchema.safeParse({
                ...DEFAULT_QUESTIONNAIRE,
                primaryColor: { l: 0.0, c: 0.15, h: 220 },
            });
            expect(result.success).toBe(true);
        });
        it('should handle maximum lightness primary color', () => {
            const result = QuestionnaireSchema.safeParse({
                ...DEFAULT_QUESTIONNAIRE,
                primaryColor: { l: 1.0, c: 0.15, h: 220 },
            });
            expect(result.success).toBe(true);
        });
        it('should handle zero chroma primary color', () => {
            const result = QuestionnaireSchema.safeParse({
                ...DEFAULT_QUESTIONNAIRE,
                primaryColor: { l: 0.5, c: 0.0, h: 220 },
            });
            expect(result.success).toBe(true);
        });
        it('should handle all hue values (0-360)', () => {
            [0, 90, 180, 270, 360].forEach((hue) => {
                const result = QuestionnaireSchema.safeParse({
                    ...DEFAULT_QUESTIONNAIRE,
                    primaryColor: { l: 0.5, c: 0.15, h: hue },
                });
                expect(result.success).toBe(true);
            });
        });
    });
    describe('Type Safety', () => {
        it('should provide correct TypeScript types', () => {
            const questionnaire = DEFAULT_QUESTIONNAIRE;
            // Type assertions to verify proper typing
            const brandTone = questionnaire.brandTone;
            const contrast = questionnaire.contrast;
            const density = questionnaire.density;
            expect(brandTone).toBeDefined();
            expect(contrast).toBeDefined();
            expect(density).toBeDefined();
        });
    });
});
//# sourceMappingURL=questionnaire.test.js.map