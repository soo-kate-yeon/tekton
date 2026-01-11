import { describe, it, expect } from 'vitest';
import {
  buttonPreset,
  inputPreset,
  cardPreset,
  badgePreset,
  alertPreset,
  linkPreset,
  checkboxPreset,
  radioPreset,
  generateComponentPresets,
} from '../src/component-presets';

describe('Component Presets - TASK-018 & TASK-019', () => {
  describe('buttonPreset', () => {
    it('should have all required states', () => {
      const preset = buttonPreset({ l: 0.5, c: 0.15, h: 220 });

      expect(preset.states.default).toBeDefined();
      expect(preset.states.hover).toBeDefined();
      expect(preset.states.active).toBeDefined();
      expect(preset.states.disabled).toBeDefined();
    });

    it('should have WCAG AA compliant colors', () => {
      const preset = buttonPreset({ l: 0.5, c: 0.15, h: 220 });

      expect(preset.accessibility).toBeDefined();
      expect(preset.accessibility!.length).toBeGreaterThan(0);
      preset.accessibility!.forEach((check) => {
        expect(check.wcagLevel).toBe('AA');
      });
    });

    it('should have darker hover state', () => {
      const preset = buttonPreset({ l: 0.5, c: 0.15, h: 220 });

      expect(preset.states.hover.l).toBeLessThan(preset.states.default.l);
    });

    it('should have disabled state with reduced opacity', () => {
      const preset = buttonPreset({ l: 0.5, c: 0.15, h: 220 });

      expect(preset.states.disabled.l).toBeGreaterThan(preset.states.default.l);
    });
  });

  describe('inputPreset', () => {
    it('should have default, focus, error, and disabled states', () => {
      const preset = inputPreset({ l: 0.5, c: 0.15, h: 220 });

      expect(preset.states.default).toBeDefined();
      expect(preset.states.focus).toBeDefined();
      expect(preset.states.error).toBeDefined();
      expect(preset.states.disabled).toBeDefined();
    });

    it('should have accessible focus state', () => {
      const preset = inputPreset({ l: 0.5, c: 0.15, h: 220 });

      expect(preset.states.focus.c).toBeGreaterThanOrEqual(preset.states.default.c);
    });
  });

  describe('cardPreset', () => {
    it('should have elevation and border variants', () => {
      const preset = cardPreset({ l: 0.5, c: 0.15, h: 220 });

      expect(preset.states.background).toBeDefined();
      expect(preset.states.border).toBeDefined();
      expect(preset.states.shadow).toBeDefined();
    });
  });

  describe('badgePreset', () => {
    it('should have info, success, warning, error states', () => {
      const preset = badgePreset({ l: 0.5, c: 0.15, h: 220 });

      expect(preset.states.info).toBeDefined();
      expect(preset.states.success).toBeDefined();
      expect(preset.states.warning).toBeDefined();
      expect(preset.states.error).toBeDefined();
    });

    it('should have distinct hues for each state', () => {
      const preset = badgePreset({ l: 0.5, c: 0.15, h: 220 });

      const hues = [
        preset.states.info.h,
        preset.states.success.h,
        preset.states.warning.h,
        preset.states.error.h,
      ];

      // All hues should be different
      const uniqueHues = new Set(hues);
      expect(uniqueHues.size).toBe(4);
    });
  });

  describe('alertPreset', () => {
    it('should have info, success, warning, error variants', () => {
      const preset = alertPreset({ l: 0.5, c: 0.15, h: 220 });

      expect(preset.states.info).toBeDefined();
      expect(preset.states.success).toBeDefined();
      expect(preset.states.warning).toBeDefined();
      expect(preset.states.error).toBeDefined();
    });
  });

  describe('linkPreset', () => {
    it('should have default, hover, visited, active states', () => {
      const preset = linkPreset({ l: 0.5, c: 0.15, h: 220 });

      expect(preset.states.default).toBeDefined();
      expect(preset.states.hover).toBeDefined();
      expect(preset.states.visited).toBeDefined();
      expect(preset.states.active).toBeDefined();
    });
  });

  describe('checkboxPreset', () => {
    it('should have unchecked, checked, indeterminate states', () => {
      const preset = checkboxPreset({ l: 0.5, c: 0.15, h: 220 });

      expect(preset.states.unchecked).toBeDefined();
      expect(preset.states.checked).toBeDefined();
      expect(preset.states.indeterminate).toBeDefined();
    });
  });

  describe('radioPreset', () => {
    it('should have unselected and selected states', () => {
      const preset = radioPreset({ l: 0.5, c: 0.15, h: 220 });

      expect(preset.states.unselected).toBeDefined();
      expect(preset.states.selected).toBeDefined();
    });
  });

  describe('generateComponentPresets', () => {
    it('should generate all 8 component presets', () => {
      const presets = generateComponentPresets({ l: 0.5, c: 0.15, h: 220 });

      expect(presets).toHaveLength(8);
      expect(presets.map((p) => p.name)).toContain('button');
      expect(presets.map((p) => p.name)).toContain('input');
      expect(presets.map((p) => p.name)).toContain('card');
      expect(presets.map((p) => p.name)).toContain('badge');
      expect(presets.map((p) => p.name)).toContain('alert');
      expect(presets.map((p) => p.name)).toContain('link');
      expect(presets.map((p) => p.name)).toContain('checkbox');
      expect(presets.map((p) => p.name)).toContain('radio');
    });

    it('should validate WCAG AA for all presets', () => {
      const presets = generateComponentPresets({ l: 0.5, c: 0.15, h: 220 });

      presets.forEach((preset) => {
        expect(preset.accessibility).toBeDefined();
        if (preset.accessibility && preset.accessibility.length > 0) {
          preset.accessibility.forEach((check) => {
            expect(check.wcagLevel).toBe('AA');
          });
        }
      });
    });
  });

  describe('WCAG AA compliance - TASK-019', () => {
    it('should ensure all button states pass WCAG AA', () => {
      const preset = buttonPreset({ l: 0.5, c: 0.15, h: 220 });

      preset.accessibility?.forEach((check) => {
        expect(check.passed).toBe(true);
      });
    });

    it('should ensure all input states pass WCAG AA', () => {
      const preset = inputPreset({ l: 0.5, c: 0.15, h: 220 });

      preset.accessibility?.forEach((check) => {
        expect(check.passed).toBe(true);
      });
    });
  });
});
