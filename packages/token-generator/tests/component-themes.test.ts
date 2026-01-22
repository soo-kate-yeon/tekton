/**
 * Comprehensive tests for component-themes.ts
 * Tests the 8 MVP component theme generators with state-aware theming
 *
 * Coverage targets:
 * - All 8 individual theme generators
 * - generateComponentThemes function
 * - COMPONENT_THEMES export
 * - State variations and accessibility
 * - Edge cases with extreme colors
 */

import { describe, it, expect } from 'vitest';
import type { OKLCHColor, ComponentTheme } from '@tekton/theme';
import {
  buttonTheme,
  inputTheme,
  cardTheme,
  badgeTheme,
  alertTheme,
  linkTheme,
  checkboxTheme,
  radioTheme,
  generateComponentThemes,
  generateComponentPresets,
  COMPONENT_THEMES,
} from '../src/component-themes';

/**
 * Helper function to validate OKLCH color values
 */
function isValidOKLCHColor(color: OKLCHColor): boolean {
  return (
    typeof color.l === 'number' &&
    typeof color.c === 'number' &&
    typeof color.h === 'number' &&
    color.l >= 0 &&
    color.l <= 1.5 && // Allow slightly over 1 for lightness adjustments
    color.c >= 0 &&
    color.h >= 0 &&
    color.h <= 360
  );
}

/**
 * Helper function to validate ComponentTheme structure
 */
function isValidComponentTheme(theme: ComponentTheme): boolean {
  return (
    typeof theme.name === 'string' &&
    theme.name.length > 0 &&
    typeof theme.states === 'object' &&
    Object.keys(theme.states).length > 0 &&
    Object.values(theme.states).every(isValidOKLCHColor)
  );
}

/**
 * Standard test base color (blue primary)
 */
const standardBaseColor: OKLCHColor = {
  l: 0.5,
  c: 0.15,
  h: 220,
};

describe('component-themes', () => {
  describe('buttonTheme', () => {
    it('should return a valid ComponentTheme structure', () => {
      const theme = buttonTheme(standardBaseColor);

      expect(theme).toBeDefined();
      expect(theme.name).toBe('button');
      expect(isValidComponentTheme(theme)).toBe(true);
    });

    it('should include default, hover, active, and disabled states', () => {
      const theme = buttonTheme(standardBaseColor);

      expect(theme.states.default).toBeDefined();
      expect(theme.states.hover).toBeDefined();
      expect(theme.states.active).toBeDefined();
      expect(theme.states.disabled).toBeDefined();
    });

    it('should have hover state darker than default (lower lightness)', () => {
      const theme = buttonTheme(standardBaseColor);

      expect(theme.states.hover.l).toBeLessThan(theme.states.default.l);
    });

    it('should have active state darker than hover (lower lightness)', () => {
      const theme = buttonTheme(standardBaseColor);

      expect(theme.states.active.l).toBeLessThan(theme.states.hover.l);
    });

    it('should have disabled state lighter with reduced chroma', () => {
      const theme = buttonTheme(standardBaseColor);

      expect(theme.states.disabled.l).toBeGreaterThan(theme.states.default.l);
      expect(theme.states.disabled.c).toBeLessThan(theme.states.default.c);
    });

    it('should preserve hue across all states', () => {
      const theme = buttonTheme(standardBaseColor);

      expect(theme.states.default.h).toBe(standardBaseColor.h);
      expect(theme.states.hover.h).toBe(standardBaseColor.h);
      expect(theme.states.active.h).toBe(standardBaseColor.h);
      expect(theme.states.disabled.h).toBe(standardBaseColor.h);
    });

    it('should include accessibility information', () => {
      const theme = buttonTheme(standardBaseColor);

      expect(theme.accessibility).toBeDefined();
      expect(Array.isArray(theme.accessibility)).toBe(true);
      expect(theme.accessibility!.length).toBeGreaterThan(0);
    });

    it('should handle dark base color correctly', () => {
      const darkColor: OKLCHColor = { l: 0.2, c: 0.1, h: 180 };
      const theme = buttonTheme(darkColor);

      expect(isValidComponentTheme(theme)).toBe(true);
      expect(theme.states.default.l).toBe(darkColor.l);
    });

    it('should handle light base color correctly', () => {
      const lightColor: OKLCHColor = { l: 0.9, c: 0.05, h: 60 };
      const theme = buttonTheme(lightColor);

      expect(isValidComponentTheme(theme)).toBe(true);
    });

    it('should handle zero chroma (grayscale) color', () => {
      const grayColor: OKLCHColor = { l: 0.5, c: 0, h: 0 };
      const theme = buttonTheme(grayColor);

      expect(isValidComponentTheme(theme)).toBe(true);
      expect(theme.states.default.c).toBe(0);
    });

    it('should handle high chroma color', () => {
      const vibrantColor: OKLCHColor = { l: 0.6, c: 0.35, h: 300 };
      const theme = buttonTheme(vibrantColor);

      expect(isValidComponentTheme(theme)).toBe(true);
    });
  });

  describe('inputTheme', () => {
    it('should return a valid ComponentTheme structure', () => {
      const theme = inputTheme(standardBaseColor);

      expect(theme).toBeDefined();
      expect(theme.name).toBe('input');
      expect(isValidComponentTheme(theme)).toBe(true);
    });

    it('should include default, focus, error, and disabled states', () => {
      const theme = inputTheme(standardBaseColor);

      expect(theme.states.default).toBeDefined();
      expect(theme.states.focus).toBeDefined();
      expect(theme.states.error).toBeDefined();
      expect(theme.states.disabled).toBeDefined();
    });

    it('should have error state with red hue (h=0)', () => {
      const theme = inputTheme(standardBaseColor);

      expect(theme.states.error.h).toBe(0);
    });

    it('should have focus state with increased chroma (capped at 0.4)', () => {
      const theme = inputTheme(standardBaseColor);

      expect(theme.states.focus.c).toBeGreaterThanOrEqual(standardBaseColor.c);
      expect(theme.states.focus.c).toBeLessThanOrEqual(0.4);
    });

    it('should cap focus chroma at 0.4 for high chroma inputs', () => {
      const highChromaColor: OKLCHColor = { l: 0.5, c: 0.38, h: 220 };
      const theme = inputTheme(highChromaColor);

      expect(theme.states.focus.c).toBeLessThanOrEqual(0.4);
    });

    it('should have disabled state with low chroma', () => {
      const theme = inputTheme(standardBaseColor);

      expect(theme.states.disabled.c).toBe(0.05);
    });

    it('should include accessibility information', () => {
      const theme = inputTheme(standardBaseColor);

      expect(theme.accessibility).toBeDefined();
      expect(Array.isArray(theme.accessibility)).toBe(true);
    });
  });

  describe('cardTheme', () => {
    it('should return a valid ComponentTheme structure', () => {
      const theme = cardTheme(standardBaseColor);

      expect(theme).toBeDefined();
      expect(theme.name).toBe('card');
      expect(isValidComponentTheme(theme)).toBe(true);
    });

    it('should include background, border, and shadow states', () => {
      const theme = cardTheme(standardBaseColor);

      expect(theme.states.background).toBeDefined();
      expect(theme.states.border).toBeDefined();
      expect(theme.states.shadow).toBeDefined();
    });

    it('should have light background (high lightness)', () => {
      const theme = cardTheme(standardBaseColor);

      expect(theme.states.background.l).toBe(0.98);
    });

    it('should have medium border lightness', () => {
      const theme = cardTheme(standardBaseColor);

      expect(theme.states.border.l).toBe(0.85);
    });

    it('should have dark shadow (low lightness)', () => {
      const theme = cardTheme(standardBaseColor);

      expect(theme.states.shadow.l).toBe(0.3);
    });

    it('should preserve base color hue across states', () => {
      const theme = cardTheme(standardBaseColor);

      expect(theme.states.background.h).toBe(standardBaseColor.h);
      expect(theme.states.border.h).toBe(standardBaseColor.h);
      expect(theme.states.shadow.h).toBe(standardBaseColor.h);
    });

    it('should have low chroma values for subtle colors', () => {
      const theme = cardTheme(standardBaseColor);

      expect(theme.states.background.c).toBe(0.02);
      expect(theme.states.border.c).toBe(0.05);
      expect(theme.states.shadow.c).toBe(0.02);
    });
  });

  describe('badgeTheme', () => {
    it('should return a valid ComponentTheme structure', () => {
      const theme = badgeTheme(standardBaseColor);

      expect(theme).toBeDefined();
      expect(theme.name).toBe('badge');
      expect(isValidComponentTheme(theme)).toBe(true);
    });

    it('should include info, success, warning, and error states', () => {
      const theme = badgeTheme(standardBaseColor);

      expect(theme.states.info).toBeDefined();
      expect(theme.states.success).toBeDefined();
      expect(theme.states.warning).toBeDefined();
      expect(theme.states.error).toBeDefined();
    });

    it('should have correct semantic colors for each severity', () => {
      const theme = badgeTheme(standardBaseColor);

      // Info: Blue (h=220)
      expect(theme.states.info.h).toBe(220);

      // Success: Green (h=140)
      expect(theme.states.success.h).toBe(140);

      // Warning: Yellow/Orange (h=60)
      expect(theme.states.warning.h).toBe(60);

      // Error: Red (h=0)
      expect(theme.states.error.h).toBe(0);
    });

    it('should have consistent lightness across info, success, error', () => {
      const theme = badgeTheme(standardBaseColor);

      expect(theme.states.info.l).toBe(0.5);
      expect(theme.states.success.l).toBe(0.5);
      expect(theme.states.error.l).toBe(0.5);
    });

    it('should have higher lightness for warning state', () => {
      const theme = badgeTheme(standardBaseColor);

      expect(theme.states.warning.l).toBe(0.6);
    });

    it('should include accessibility information for all variants', () => {
      const theme = badgeTheme(standardBaseColor);

      expect(theme.accessibility).toBeDefined();
      expect(Array.isArray(theme.accessibility)).toBe(true);
      // Should have 4 accessibility checks (one per severity)
      expect(theme.accessibility!.length).toBe(4);
    });

    it('should ignore baseColor parameter (uses fixed semantic colors)', () => {
      const theme1 = badgeTheme(standardBaseColor);
      const theme2 = badgeTheme({ l: 0.8, c: 0.3, h: 300 });

      expect(theme1.states.info).toEqual(theme2.states.info);
      expect(theme1.states.success).toEqual(theme2.states.success);
    });
  });

  describe('alertTheme', () => {
    it('should return a valid ComponentTheme structure', () => {
      const theme = alertTheme(standardBaseColor);

      expect(theme).toBeDefined();
      expect(theme.name).toBe('alert');
      expect(isValidComponentTheme(theme)).toBe(true);
    });

    it('should include info, success, warning, and error states', () => {
      const theme = alertTheme(standardBaseColor);

      expect(theme.states.info).toBeDefined();
      expect(theme.states.success).toBeDefined();
      expect(theme.states.warning).toBeDefined();
      expect(theme.states.error).toBeDefined();
    });

    it('should have lighter colors than badge (background-style)', () => {
      const alertT = alertTheme(standardBaseColor);
      const badgeT = badgeTheme(standardBaseColor);

      // Alert colors should be lighter (higher L) than badge colors
      expect(alertT.states.info.l).toBeGreaterThan(badgeT.states.info.l);
      expect(alertT.states.success.l).toBeGreaterThan(badgeT.states.success.l);
      expect(alertT.states.error.l).toBeGreaterThan(badgeT.states.error.l);
    });

    it('should have low chroma for subtle background colors', () => {
      const theme = alertTheme(standardBaseColor);

      expect(theme.states.info.c).toBe(0.08);
      expect(theme.states.success.c).toBe(0.08);
      expect(theme.states.warning.c).toBe(0.08);
      expect(theme.states.error.c).toBe(0.08);
    });

    it('should have correct semantic hues', () => {
      const theme = alertTheme(standardBaseColor);

      expect(theme.states.info.h).toBe(220);    // Blue
      expect(theme.states.success.h).toBe(140); // Green
      expect(theme.states.warning.h).toBe(60);  // Yellow
      expect(theme.states.error.h).toBe(0);     // Red
    });

    it('should include accessibility information for all variants', () => {
      const theme = alertTheme(standardBaseColor);

      expect(theme.accessibility).toBeDefined();
      expect(Array.isArray(theme.accessibility)).toBe(true);
      expect(theme.accessibility!.length).toBe(4);
    });
  });

  describe('linkTheme', () => {
    it('should return a valid ComponentTheme structure', () => {
      const theme = linkTheme(standardBaseColor);

      expect(theme).toBeDefined();
      expect(theme.name).toBe('link');
      expect(isValidComponentTheme(theme)).toBe(true);
    });

    it('should include default, hover, visited, and active states', () => {
      const theme = linkTheme(standardBaseColor);

      expect(theme.states.default).toBeDefined();
      expect(theme.states.hover).toBeDefined();
      expect(theme.states.visited).toBeDefined();
      expect(theme.states.active).toBeDefined();
    });

    it('should use blue for default, hover, and active states', () => {
      const theme = linkTheme(standardBaseColor);

      expect(theme.states.default.h).toBe(220);
      expect(theme.states.hover.h).toBe(220);
      expect(theme.states.active.h).toBe(220);
    });

    it('should use purple for visited state', () => {
      const theme = linkTheme(standardBaseColor);

      expect(theme.states.visited.h).toBe(280);
    });

    it('should have hover darker than default', () => {
      const theme = linkTheme(standardBaseColor);

      expect(theme.states.hover.l).toBeLessThan(theme.states.default.l);
    });

    it('should have active darker than hover', () => {
      const theme = linkTheme(standardBaseColor);

      expect(theme.states.active.l).toBeLessThan(theme.states.hover.l);
    });

    it('should include accessibility information', () => {
      const theme = linkTheme(standardBaseColor);

      expect(theme.accessibility).toBeDefined();
      expect(Array.isArray(theme.accessibility)).toBe(true);
    });

    it('should use fixed colors regardless of baseColor', () => {
      const theme1 = linkTheme(standardBaseColor);
      const theme2 = linkTheme({ l: 0.9, c: 0.3, h: 0 });

      expect(theme1.states.default).toEqual(theme2.states.default);
    });
  });

  describe('checkboxTheme', () => {
    it('should return a valid ComponentTheme structure', () => {
      const theme = checkboxTheme(standardBaseColor);

      expect(theme).toBeDefined();
      expect(theme.name).toBe('checkbox');
      expect(isValidComponentTheme(theme)).toBe(true);
    });

    it('should include unchecked, checked, and indeterminate states', () => {
      const theme = checkboxTheme(standardBaseColor);

      expect(theme.states.unchecked).toBeDefined();
      expect(theme.states.checked).toBeDefined();
      expect(theme.states.indeterminate).toBeDefined();
    });

    it('should have light unchecked state', () => {
      const theme = checkboxTheme(standardBaseColor);

      expect(theme.states.unchecked.l).toBe(0.95);
      expect(theme.states.unchecked.c).toBe(0.02);
    });

    it('should use base color for checked state', () => {
      const theme = checkboxTheme(standardBaseColor);

      expect(theme.states.checked).toEqual(standardBaseColor);
    });

    it('should have indeterminate slightly darker than base', () => {
      const theme = checkboxTheme(standardBaseColor);

      expect(theme.states.indeterminate.l).toBeLessThan(theme.states.checked.l);
    });

    it('should preserve base color hue in unchecked state', () => {
      const theme = checkboxTheme(standardBaseColor);

      expect(theme.states.unchecked.h).toBe(standardBaseColor.h);
    });

    it('should include accessibility information', () => {
      const theme = checkboxTheme(standardBaseColor);

      expect(theme.accessibility).toBeDefined();
      expect(Array.isArray(theme.accessibility)).toBe(true);
    });
  });

  describe('radioTheme', () => {
    it('should return a valid ComponentTheme structure', () => {
      const theme = radioTheme(standardBaseColor);

      expect(theme).toBeDefined();
      expect(theme.name).toBe('radio');
      expect(isValidComponentTheme(theme)).toBe(true);
    });

    it('should include unselected and selected states', () => {
      const theme = radioTheme(standardBaseColor);

      expect(theme.states.unselected).toBeDefined();
      expect(theme.states.selected).toBeDefined();
    });

    it('should have light unselected state', () => {
      const theme = radioTheme(standardBaseColor);

      expect(theme.states.unselected.l).toBe(0.95);
      expect(theme.states.unselected.c).toBe(0.02);
    });

    it('should use base color for selected state', () => {
      const theme = radioTheme(standardBaseColor);

      expect(theme.states.selected).toEqual(standardBaseColor);
    });

    it('should preserve base color hue in unselected state', () => {
      const theme = radioTheme(standardBaseColor);

      expect(theme.states.unselected.h).toBe(standardBaseColor.h);
    });

    it('should include accessibility information', () => {
      const theme = radioTheme(standardBaseColor);

      expect(theme.accessibility).toBeDefined();
      expect(Array.isArray(theme.accessibility)).toBe(true);
    });
  });

  describe('generateComponentThemes', () => {
    it('should return an array of 8 ComponentThemes', () => {
      const themes = generateComponentThemes(standardBaseColor);

      expect(Array.isArray(themes)).toBe(true);
      expect(themes.length).toBe(8);
    });

    it('should include all 8 MVP components', () => {
      const themes = generateComponentThemes(standardBaseColor);
      const names = themes.map(t => t.name);

      expect(names).toContain('button');
      expect(names).toContain('input');
      expect(names).toContain('card');
      expect(names).toContain('badge');
      expect(names).toContain('alert');
      expect(names).toContain('link');
      expect(names).toContain('checkbox');
      expect(names).toContain('radio');
    });

    it('should return all valid ComponentTheme structures', () => {
      const themes = generateComponentThemes(standardBaseColor);

      themes.forEach(theme => {
        expect(isValidComponentTheme(theme)).toBe(true);
      });
    });

    it('should maintain consistent order', () => {
      const themes = generateComponentThemes(standardBaseColor);

      expect(themes[0].name).toBe('button');
      expect(themes[1].name).toBe('input');
      expect(themes[2].name).toBe('card');
      expect(themes[3].name).toBe('badge');
      expect(themes[4].name).toBe('alert');
      expect(themes[5].name).toBe('link');
      expect(themes[6].name).toBe('checkbox');
      expect(themes[7].name).toBe('radio');
    });

    it('should produce same results with different base colors', () => {
      const themes1 = generateComponentThemes(standardBaseColor);
      const themes2 = generateComponentThemes({ l: 0.7, c: 0.2, h: 300 });

      // Both should have 8 themes
      expect(themes1.length).toBe(themes2.length);

      // Each should be valid
      themes1.forEach(t => expect(isValidComponentTheme(t)).toBe(true));
      themes2.forEach(t => expect(isValidComponentTheme(t)).toBe(true));
    });
  });

  describe('generateComponentPresets (deprecated alias)', () => {
    it('should be an alias for generateComponentThemes', () => {
      expect(generateComponentPresets).toBe(generateComponentThemes);
    });

    it('should produce identical results', () => {
      const themes = generateComponentThemes(standardBaseColor);
      const presets = generateComponentPresets(standardBaseColor);

      expect(themes).toEqual(presets);
    });
  });

  describe('COMPONENT_THEMES export', () => {
    it('should export all 8 theme generators', () => {
      expect(COMPONENT_THEMES.button).toBeDefined();
      expect(COMPONENT_THEMES.input).toBeDefined();
      expect(COMPONENT_THEMES.card).toBeDefined();
      expect(COMPONENT_THEMES.badge).toBeDefined();
      expect(COMPONENT_THEMES.alert).toBeDefined();
      expect(COMPONENT_THEMES.link).toBeDefined();
      expect(COMPONENT_THEMES.checkbox).toBeDefined();
      expect(COMPONENT_THEMES.radio).toBeDefined();
    });

    it('should export the same functions as named exports', () => {
      expect(COMPONENT_THEMES.button).toBe(buttonTheme);
      expect(COMPONENT_THEMES.input).toBe(inputTheme);
      expect(COMPONENT_THEMES.card).toBe(cardTheme);
      expect(COMPONENT_THEMES.badge).toBe(badgeTheme);
      expect(COMPONENT_THEMES.alert).toBe(alertTheme);
      expect(COMPONENT_THEMES.link).toBe(linkTheme);
      expect(COMPONENT_THEMES.checkbox).toBe(checkboxTheme);
      expect(COMPONENT_THEMES.radio).toBe(radioTheme);
    });

    it('should be usable to generate themes dynamically', () => {
      const componentName = 'button' as keyof typeof COMPONENT_THEMES;
      const theme = COMPONENT_THEMES[componentName](standardBaseColor);

      expect(theme.name).toBe('button');
      expect(isValidComponentTheme(theme)).toBe(true);
    });

    it('should allow iterating over all theme generators', () => {
      const entries = Object.entries(COMPONENT_THEMES);

      expect(entries.length).toBe(8);

      entries.forEach(([name, generator]) => {
        const theme = generator(standardBaseColor);
        expect(theme.name).toBe(name);
        expect(isValidComponentTheme(theme)).toBe(true);
      });
    });
  });

  describe('Edge Cases', () => {
    describe('extreme lightness values', () => {
      it('should handle very dark base color (l=0)', () => {
        const darkColor: OKLCHColor = { l: 0, c: 0, h: 0 };
        const themes = generateComponentThemes(darkColor);

        themes.forEach(theme => {
          expect(isValidComponentTheme(theme)).toBe(true);
        });
      });

      it('should handle very light base color (l=1)', () => {
        const lightColor: OKLCHColor = { l: 1, c: 0, h: 0 };
        const themes = generateComponentThemes(lightColor);

        themes.forEach(theme => {
          expect(isValidComponentTheme(theme)).toBe(true);
        });
      });
    });

    describe('extreme chroma values', () => {
      it('should handle zero chroma (grayscale)', () => {
        const grayColor: OKLCHColor = { l: 0.5, c: 0, h: 180 };
        const themes = generateComponentThemes(grayColor);

        themes.forEach(theme => {
          expect(isValidComponentTheme(theme)).toBe(true);
        });
      });

      it('should handle maximum practical chroma', () => {
        const saturatedColor: OKLCHColor = { l: 0.6, c: 0.4, h: 90 };
        const themes = generateComponentThemes(saturatedColor);

        themes.forEach(theme => {
          expect(isValidComponentTheme(theme)).toBe(true);
        });
      });
    });

    describe('extreme hue values', () => {
      it('should handle hue at 0 degrees (red)', () => {
        const redColor: OKLCHColor = { l: 0.5, c: 0.15, h: 0 };
        const themes = generateComponentThemes(redColor);

        themes.forEach(theme => {
          expect(isValidComponentTheme(theme)).toBe(true);
        });
      });

      it('should handle hue at 360 degrees (also red)', () => {
        const redColor: OKLCHColor = { l: 0.5, c: 0.15, h: 360 };
        const themes = generateComponentThemes(redColor);

        themes.forEach(theme => {
          expect(isValidComponentTheme(theme)).toBe(true);
        });
      });

      it('should handle hue at 180 degrees (cyan)', () => {
        const cyanColor: OKLCHColor = { l: 0.5, c: 0.15, h: 180 };
        const themes = generateComponentThemes(cyanColor);

        themes.forEach(theme => {
          expect(isValidComponentTheme(theme)).toBe(true);
        });
      });
    });

    describe('common brand colors', () => {
      const brandColors: Array<{ name: string; color: OKLCHColor }> = [
        { name: 'Facebook Blue', color: { l: 0.43, c: 0.18, h: 245 } },
        { name: 'YouTube Red', color: { l: 0.50, c: 0.22, h: 27 } },
        { name: 'Spotify Green', color: { l: 0.65, c: 0.18, h: 142 } },
        { name: 'Netflix Red', color: { l: 0.45, c: 0.21, h: 23 } },
        { name: 'Twitter/X Black', color: { l: 0.15, c: 0, h: 0 } },
      ];

      brandColors.forEach(({ name, color }) => {
        it(`should handle ${name} color`, () => {
          const themes = generateComponentThemes(color);

          themes.forEach(theme => {
            expect(isValidComponentTheme(theme)).toBe(true);
          });
        });
      });
    });
  });

  describe('Accessibility Integration', () => {
    it('should have accessibility checks on all theme generators', () => {
      const generators = [
        buttonTheme,
        inputTheme,
        cardTheme,
        badgeTheme,
        alertTheme,
        linkTheme,
        checkboxTheme,
        radioTheme,
      ];

      generators.forEach(generator => {
        const theme = generator(standardBaseColor);
        expect(theme.accessibility).toBeDefined();
        expect(Array.isArray(theme.accessibility)).toBe(true);
      });
    });

    it('should have contrastRatio in accessibility results', () => {
      const theme = buttonTheme(standardBaseColor);

      expect(theme.accessibility).toBeDefined();
      expect(theme.accessibility!.length).toBeGreaterThan(0);

      const accessibilityCheck = theme.accessibility![0];
      expect(accessibilityCheck).toHaveProperty('contrastRatio');
      expect(typeof accessibilityCheck.contrastRatio).toBe('number');
    });

    it('should have wcagLevel in accessibility results', () => {
      const theme = buttonTheme(standardBaseColor);

      const accessibilityCheck = theme.accessibility![0];
      expect(accessibilityCheck).toHaveProperty('wcagLevel');
      expect(['AA', 'AAA']).toContain(accessibilityCheck.wcagLevel);
    });

    it('should have passed boolean in accessibility results', () => {
      const theme = buttonTheme(standardBaseColor);

      const accessibilityCheck = theme.accessibility![0];
      expect(accessibilityCheck).toHaveProperty('passed');
      expect(typeof accessibilityCheck.passed).toBe('boolean');
    });
  });

  describe('State Calculations', () => {
    describe('lightness multipliers', () => {
      it('should apply 0.9x multiplier for hover states', () => {
        const baseColor: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };
        const theme = buttonTheme(baseColor);

        expect(theme.states.hover.l).toBeCloseTo(baseColor.l * 0.9, 5);
      });

      it('should apply 0.8x multiplier for active states', () => {
        const baseColor: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };
        const theme = buttonTheme(baseColor);

        expect(theme.states.active.l).toBeCloseTo(baseColor.l * 0.8, 5);
      });

      it('should apply 1.3x multiplier for disabled lightness', () => {
        const baseColor: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };
        const theme = buttonTheme(baseColor);

        expect(theme.states.disabled.l).toBeCloseTo(baseColor.l * 1.3, 5);
      });

      it('should apply 0.5x multiplier for disabled chroma', () => {
        const baseColor: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };
        const theme = buttonTheme(baseColor);

        expect(theme.states.disabled.c).toBeCloseTo(baseColor.c * 0.5, 5);
      });
    });

    describe('input focus chroma calculation', () => {
      it('should multiply chroma by 1.2 for focus state', () => {
        const baseColor: OKLCHColor = { l: 0.5, c: 0.15, h: 220 };
        const theme = inputTheme(baseColor);

        const expectedChroma = Math.min(baseColor.c * 1.2, 0.4);
        expect(theme.states.focus.c).toBeCloseTo(expectedChroma, 5);
      });

      it('should cap focus chroma at 0.4', () => {
        const highChromaColor: OKLCHColor = { l: 0.5, c: 0.35, h: 220 };
        const theme = inputTheme(highChromaColor);

        expect(theme.states.focus.c).toBe(0.4);
      });
    });
  });
});
