import { describe, it, expect } from 'vitest';
import { buttonTheme, inputTheme, cardTheme, badgeTheme, alertTheme, linkTheme, checkboxTheme, radioTheme, generateComponentThemes, } from '../src/component-themes';
describe('Component Themes - TASK-018 & TASK-019', () => {
    describe('buttonTheme', () => {
        it('should have all required states', () => {
            const theme = buttonTheme({ l: 0.5, c: 0.15, h: 220 });
            expect(theme.states.default).toBeDefined();
            expect(theme.states.hover).toBeDefined();
            expect(theme.states.active).toBeDefined();
            expect(theme.states.disabled).toBeDefined();
        });
        it('should have WCAG AA compliant colors', () => {
            const theme = buttonTheme({ l: 0.5, c: 0.15, h: 220 });
            expect(theme.accessibility).toBeDefined();
            expect(theme.accessibility.length).toBeGreaterThan(0);
            theme.accessibility.forEach(check => {
                expect(check.wcagLevel).toBe('AA');
            });
        });
        it('should have darker hover state', () => {
            const theme = buttonTheme({ l: 0.5, c: 0.15, h: 220 });
            expect(theme.states.hover.l).toBeLessThan(theme.states.default.l);
        });
        it('should have disabled state with reduced opacity', () => {
            const theme = buttonTheme({ l: 0.5, c: 0.15, h: 220 });
            expect(theme.states.disabled.l).toBeGreaterThan(theme.states.default.l);
        });
    });
    describe('inputTheme', () => {
        it('should have default, focus, error, and disabled states', () => {
            const theme = inputTheme({ l: 0.5, c: 0.15, h: 220 });
            expect(theme.states.default).toBeDefined();
            expect(theme.states.focus).toBeDefined();
            expect(theme.states.error).toBeDefined();
            expect(theme.states.disabled).toBeDefined();
        });
        it('should have accessible focus state', () => {
            const theme = inputTheme({ l: 0.5, c: 0.15, h: 220 });
            expect(theme.states.focus.c).toBeGreaterThanOrEqual(theme.states.default.c);
        });
    });
    describe('cardTheme', () => {
        it('should have elevation and border variants', () => {
            const theme = cardTheme({ l: 0.5, c: 0.15, h: 220 });
            expect(theme.states.background).toBeDefined();
            expect(theme.states.border).toBeDefined();
            expect(theme.states.shadow).toBeDefined();
        });
    });
    describe('badgeTheme', () => {
        it('should have info, success, warning, error states', () => {
            const theme = badgeTheme({ l: 0.5, c: 0.15, h: 220 });
            expect(theme.states.info).toBeDefined();
            expect(theme.states.success).toBeDefined();
            expect(theme.states.warning).toBeDefined();
            expect(theme.states.error).toBeDefined();
        });
        it('should have distinct hues for each state', () => {
            const theme = badgeTheme({ l: 0.5, c: 0.15, h: 220 });
            const hues = [
                theme.states.info.h,
                theme.states.success.h,
                theme.states.warning.h,
                theme.states.error.h,
            ];
            // All hues should be different
            const uniqueHues = new Set(hues);
            expect(uniqueHues.size).toBe(4);
        });
    });
    describe('alertTheme', () => {
        it('should have info, success, warning, error variants', () => {
            const theme = alertTheme({ l: 0.5, c: 0.15, h: 220 });
            expect(theme.states.info).toBeDefined();
            expect(theme.states.success).toBeDefined();
            expect(theme.states.warning).toBeDefined();
            expect(theme.states.error).toBeDefined();
        });
    });
    describe('linkTheme', () => {
        it('should have default, hover, visited, active states', () => {
            const theme = linkTheme({ l: 0.5, c: 0.15, h: 220 });
            expect(theme.states.default).toBeDefined();
            expect(theme.states.hover).toBeDefined();
            expect(theme.states.visited).toBeDefined();
            expect(theme.states.active).toBeDefined();
        });
    });
    describe('checkboxTheme', () => {
        it('should have unchecked, checked, indeterminate states', () => {
            const theme = checkboxTheme({ l: 0.5, c: 0.15, h: 220 });
            expect(theme.states.unchecked).toBeDefined();
            expect(theme.states.checked).toBeDefined();
            expect(theme.states.indeterminate).toBeDefined();
        });
    });
    describe('radioTheme', () => {
        it('should have unselected and selected states', () => {
            const theme = radioTheme({ l: 0.5, c: 0.15, h: 220 });
            expect(theme.states.unselected).toBeDefined();
            expect(theme.states.selected).toBeDefined();
        });
    });
    describe('generateComponentThemes', () => {
        it('should generate all 8 component themes', () => {
            const themes = generateComponentThemes({ l: 0.5, c: 0.15, h: 220 });
            expect(themes).toHaveLength(8);
            expect(themes.map(p => p.name)).toContain('button');
            expect(themes.map(p => p.name)).toContain('input');
            expect(themes.map(p => p.name)).toContain('card');
            expect(themes.map(p => p.name)).toContain('badge');
            expect(themes.map(p => p.name)).toContain('alert');
            expect(themes.map(p => p.name)).toContain('link');
            expect(themes.map(p => p.name)).toContain('checkbox');
            expect(themes.map(p => p.name)).toContain('radio');
        });
        it('should validate WCAG AA for all themes', () => {
            const themes = generateComponentThemes({ l: 0.5, c: 0.15, h: 220 });
            themes.forEach(theme => {
                expect(theme.accessibility).toBeDefined();
                if (theme.accessibility && theme.accessibility.length > 0) {
                    theme.accessibility.forEach(check => {
                        expect(check.wcagLevel).toBe('AA');
                    });
                }
            });
        });
    });
    describe('WCAG AA compliance - TASK-019', () => {
        it('should ensure all button states pass WCAG AA', () => {
            const theme = buttonTheme({ l: 0.5, c: 0.15, h: 220 });
            theme.accessibility?.forEach(check => {
                expect(check.passed).toBe(true);
            });
        });
        it('should ensure all input states pass WCAG AA', () => {
            const theme = inputTheme({ l: 0.5, c: 0.15, h: 220 });
            theme.accessibility?.forEach(check => {
                expect(check.passed).toBe(true);
            });
        });
    });
});
//# sourceMappingURL=component-themes.test.js.map