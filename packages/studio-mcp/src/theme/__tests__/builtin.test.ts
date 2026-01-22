/**
 * Builtin Preset Loader Tests
 * TDD RED phase: Tests for built-in preset loading functionality
 *
 * @module preset/__tests__/builtin.test
 */

import { describe, it, expect } from "vitest";
import {
  getBuiltinThemes,
  getBuiltinTheme,
  isValidThemeId,
} from "../builtin.js";
import {
  ThemeSchema,
  ThemeMetaSchema,
  BUILTIN_THEME_IDS,
} from "../types.js";

describe("Builtin Preset Loader", () => {
  describe("getBuiltinThemes", () => {
    it("should return all 7 built-in presets", () => {
      const themes = getBuiltinThemes();
      expect(themes).toHaveLength(7);
    });

    it("should return themes with correct metadata structure", () => {
      const themes = getBuiltinThemes();

      themes.forEach((theme: import("../types.js").ThemeMeta) => {
        // Validate against PresetMeta schema
        const result = ThemeMetaSchema.safeParse(theme);
        expect(result.success).toBe(true);
      });
    });

    it("should include all expected preset IDs", () => {
      const themes = getBuiltinThemes();
      const themeIds = themes.map((p: import("../types.js").ThemeMeta) => p.id);

      BUILTIN_THEME_IDS.forEach((expectedId) => {
        expect(themeIds).toContain(expectedId);
      });
    });

    it("should return themes with id, name, description, stackInfo, and brandTone", () => {
      const themes = getBuiltinThemes();

      themes.forEach((theme: import("../types.js").ThemeMeta) => {
        expect(theme.id).toBeDefined();
        expect(typeof theme.id).toBe("string");
        expect(theme.name).toBeDefined();
        expect(typeof theme.name).toBe("string");
        expect(theme.description).toBeDefined();
        expect(typeof theme.description).toBe("string");
        expect(theme.stackInfo).toBeDefined();
        expect(theme.brandTone).toBeDefined();
      });
    });
  });

  describe("getBuiltinTheme", () => {
    it("should return full preset data for valid preset ID", () => {
      const theme = getBuiltinTheme("next-tailwind-shadcn");

      expect(theme).not.toBeNull();
      expect(theme?.id).toBe("next-tailwind-shadcn");
    });

    it("should return null for invalid preset ID", () => {
      const theme = getBuiltinTheme("non-existent-preset");

      expect(theme).toBeNull();
    });

    it("should return preset with complete structure matching ThemeSchema", () => {
      BUILTIN_THEME_IDS.forEach((themeId: string) => {
        const theme = getBuiltinTheme(themeId);

        expect(theme).not.toBeNull();
        const result = ThemeSchema.safeParse(theme);
        expect(result.success).toBe(true);
      });
    });

    it("should return preset with colorPalette", () => {
      const theme = getBuiltinTheme("next-tailwind-shadcn");

      expect(theme?.colorPalette).toBeDefined();
      expect(theme?.colorPalette.primary).toBeDefined();
      expect(theme?.colorPalette.primary.l).toBeGreaterThanOrEqual(0);
      expect(theme?.colorPalette.primary.l).toBeLessThanOrEqual(1);
    });

    it("should return preset with typography", () => {
      const theme = getBuiltinTheme("next-tailwind-shadcn");

      expect(theme?.typography).toBeDefined();
      expect(theme?.typography.fontScale).toBeDefined();
    });

    it("should return preset with componentDefaults", () => {
      const theme = getBuiltinTheme("next-tailwind-shadcn");

      expect(theme?.componentDefaults).toBeDefined();
      expect(theme?.componentDefaults.borderRadius).toBeDefined();
      expect(theme?.componentDefaults.density).toBeDefined();
      expect(theme?.componentDefaults.contrast).toBeDefined();
    });

    it("should return preset with aiContext", () => {
      const theme = getBuiltinTheme("next-tailwind-shadcn");

      expect(theme?.aiContext).toBeDefined();
      expect(theme?.aiContext.brandTone).toBeDefined();
      expect(theme?.aiContext.designPhilosophy).toBeDefined();
      expect(theme?.aiContext.colorGuidance).toBeDefined();
      expect(theme?.aiContext.componentGuidance).toBeDefined();
    });
  });

  describe("isValidThemeId", () => {
    it("should return true for valid built-in preset IDs", () => {
      BUILTIN_THEME_IDS.forEach((themeId: string) => {
        expect(isValidThemeId(themeId)).toBe(true);
      });
    });

    it("should return false for invalid preset ID", () => {
      expect(isValidThemeId("invalid-preset")).toBe(false);
      expect(isValidThemeId("")).toBe(false);
      expect(isValidThemeId("next-tailwind")).toBe(false);
    });
  });

  describe("Preset Content Validation", () => {
    describe("next-tailwind-shadcn", () => {
      it("should have correct stack info", () => {
        const theme = getBuiltinTheme("next-tailwind-shadcn");

        expect(theme?.stackInfo.framework).toBe("nextjs");
        expect(theme?.stackInfo.styling).toBe("tailwindcss");
        expect(theme?.stackInfo.components).toBe("shadcn-ui");
      });

      it("should have professional brand tone", () => {
        const theme = getBuiltinTheme("next-tailwind-shadcn");

        expect(theme?.brandTone).toBe("professional");
      });
    });

    describe("next-tailwind-radix", () => {
      it("should have correct stack info with radix-ui", () => {
        const theme = getBuiltinTheme("next-tailwind-radix");

        expect(theme?.stackInfo.framework).toBe("nextjs");
        expect(theme?.stackInfo.styling).toBe("tailwindcss");
        expect(theme?.stackInfo.components).toBe("radix-ui");
      });
    });

    describe("vite-tailwind-shadcn", () => {
      it("should have vite framework", () => {
        const theme = getBuiltinTheme("vite-tailwind-shadcn");

        expect(theme?.stackInfo.framework).toBe("vite");
      });
    });

    describe("saas-dashboard", () => {
      it("should have professional brand tone", () => {
        const theme = getBuiltinTheme("saas-dashboard");

        expect(theme?.brandTone).toBe("professional");
      });

      it("should have compact density for dashboards", () => {
        const theme = getBuiltinTheme("saas-dashboard");

        expect(theme?.componentDefaults.density).toBe("compact");
      });
    });

    describe("tech-startup", () => {
      it("should have creative brand tone", () => {
        const theme = getBuiltinTheme("tech-startup");

        expect(theme?.brandTone).toBe("creative");
      });

      it("should have large border radius for modern aesthetic", () => {
        const theme = getBuiltinTheme("tech-startup");

        expect(theme?.componentDefaults.borderRadius).toBe("large");
      });
    });

    describe("premium-editorial", () => {
      it("should have elegant brand tone", () => {
        const theme = getBuiltinTheme("premium-editorial");

        expect(theme?.brandTone).toBe("elegant");
      });

      it("should have spacious density for editorial content", () => {
        const theme = getBuiltinTheme("premium-editorial");

        expect(theme?.componentDefaults.density).toBe("spacious");
      });
    });
  });
});
