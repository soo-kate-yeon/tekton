/**
 * Builtin Preset Loader Tests
 * TDD RED phase: Tests for built-in preset loading functionality
 *
 * @module preset/__tests__/builtin.test
 */

import { describe, it, expect } from "vitest";
import {
  getBuiltinPresets,
  getBuiltinPreset,
  isValidPresetId,
} from "../builtin.js";
import {
  ThemeSchema,
  PresetMetaSchema,
  BUILTIN_PRESET_IDS,
} from "../types.js";

describe("Builtin Preset Loader", () => {
  describe("getBuiltinPresets", () => {
    it("should return all 7 built-in presets", () => {
      const presets = getBuiltinPresets();
      expect(presets).toHaveLength(7);
    });

    it("should return presets with correct metadata structure", () => {
      const presets = getBuiltinPresets();

      presets.forEach((preset) => {
        // Validate against PresetMeta schema
        const result = PresetMetaSchema.safeParse(preset);
        expect(result.success).toBe(true);
      });
    });

    it("should include all expected preset IDs", () => {
      const presets = getBuiltinPresets();
      const presetIds = presets.map((p) => p.id);

      BUILTIN_PRESET_IDS.forEach((expectedId) => {
        expect(presetIds).toContain(expectedId);
      });
    });

    it("should return presets with id, name, description, stackInfo, and brandTone", () => {
      const presets = getBuiltinPresets();

      presets.forEach((preset) => {
        expect(preset.id).toBeDefined();
        expect(typeof preset.id).toBe("string");
        expect(preset.name).toBeDefined();
        expect(typeof preset.name).toBe("string");
        expect(preset.description).toBeDefined();
        expect(typeof preset.description).toBe("string");
        expect(preset.stackInfo).toBeDefined();
        expect(preset.brandTone).toBeDefined();
      });
    });
  });

  describe("getBuiltinPreset", () => {
    it("should return full preset data for valid preset ID", () => {
      const preset = getBuiltinPreset("next-tailwind-shadcn");

      expect(preset).not.toBeNull();
      expect(preset?.id).toBe("next-tailwind-shadcn");
    });

    it("should return null for invalid preset ID", () => {
      const preset = getBuiltinPreset("non-existent-preset");

      expect(preset).toBeNull();
    });

    it("should return preset with complete structure matching ThemeSchema", () => {
      BUILTIN_PRESET_IDS.forEach((themeId) => {
        const preset = getBuiltinPreset(themeId);

        expect(preset).not.toBeNull();
        const result = ThemeSchema.safeParse(preset);
        expect(result.success).toBe(true);
      });
    });

    it("should return preset with colorPalette", () => {
      const preset = getBuiltinPreset("next-tailwind-shadcn");

      expect(preset?.colorPalette).toBeDefined();
      expect(preset?.colorPalette.primary).toBeDefined();
      expect(preset?.colorPalette.primary.l).toBeGreaterThanOrEqual(0);
      expect(preset?.colorPalette.primary.l).toBeLessThanOrEqual(1);
    });

    it("should return preset with typography", () => {
      const preset = getBuiltinPreset("next-tailwind-shadcn");

      expect(preset?.typography).toBeDefined();
      expect(preset?.typography.fontScale).toBeDefined();
    });

    it("should return preset with componentDefaults", () => {
      const preset = getBuiltinPreset("next-tailwind-shadcn");

      expect(preset?.componentDefaults).toBeDefined();
      expect(preset?.componentDefaults.borderRadius).toBeDefined();
      expect(preset?.componentDefaults.density).toBeDefined();
      expect(preset?.componentDefaults.contrast).toBeDefined();
    });

    it("should return preset with aiContext", () => {
      const preset = getBuiltinPreset("next-tailwind-shadcn");

      expect(preset?.aiContext).toBeDefined();
      expect(preset?.aiContext.brandTone).toBeDefined();
      expect(preset?.aiContext.designPhilosophy).toBeDefined();
      expect(preset?.aiContext.colorGuidance).toBeDefined();
      expect(preset?.aiContext.componentGuidance).toBeDefined();
    });
  });

  describe("isValidPresetId", () => {
    it("should return true for valid built-in preset IDs", () => {
      BUILTIN_PRESET_IDS.forEach((themeId) => {
        expect(isValidPresetId(themeId)).toBe(true);
      });
    });

    it("should return false for invalid preset ID", () => {
      expect(isValidPresetId("invalid-preset")).toBe(false);
      expect(isValidPresetId("")).toBe(false);
      expect(isValidPresetId("next-tailwind")).toBe(false);
    });
  });

  describe("Preset Content Validation", () => {
    describe("next-tailwind-shadcn", () => {
      it("should have correct stack info", () => {
        const preset = getBuiltinPreset("next-tailwind-shadcn");

        expect(preset?.stackInfo.framework).toBe("nextjs");
        expect(preset?.stackInfo.styling).toBe("tailwindcss");
        expect(preset?.stackInfo.components).toBe("shadcn-ui");
      });

      it("should have professional brand tone", () => {
        const preset = getBuiltinPreset("next-tailwind-shadcn");

        expect(preset?.brandTone).toBe("professional");
      });
    });

    describe("next-tailwind-radix", () => {
      it("should have correct stack info with radix-ui", () => {
        const preset = getBuiltinPreset("next-tailwind-radix");

        expect(preset?.stackInfo.framework).toBe("nextjs");
        expect(preset?.stackInfo.styling).toBe("tailwindcss");
        expect(preset?.stackInfo.components).toBe("radix-ui");
      });
    });

    describe("vite-tailwind-shadcn", () => {
      it("should have vite framework", () => {
        const preset = getBuiltinPreset("vite-tailwind-shadcn");

        expect(preset?.stackInfo.framework).toBe("vite");
      });
    });

    describe("saas-dashboard", () => {
      it("should have professional brand tone", () => {
        const preset = getBuiltinPreset("saas-dashboard");

        expect(preset?.brandTone).toBe("professional");
      });

      it("should have compact density for dashboards", () => {
        const preset = getBuiltinPreset("saas-dashboard");

        expect(preset?.componentDefaults.density).toBe("compact");
      });
    });

    describe("tech-startup", () => {
      it("should have creative brand tone", () => {
        const preset = getBuiltinPreset("tech-startup");

        expect(preset?.brandTone).toBe("creative");
      });

      it("should have large border radius for modern aesthetic", () => {
        const preset = getBuiltinPreset("tech-startup");

        expect(preset?.componentDefaults.borderRadius).toBe("large");
      });
    });

    describe("premium-editorial", () => {
      it("should have elegant brand tone", () => {
        const preset = getBuiltinPreset("premium-editorial");

        expect(preset?.brandTone).toBe("elegant");
      });

      it("should have spacious density for editorial content", () => {
        const preset = getBuiltinPreset("premium-editorial");

        expect(preset?.componentDefaults.density).toBe("spacious");
      });
    });
  });
});
