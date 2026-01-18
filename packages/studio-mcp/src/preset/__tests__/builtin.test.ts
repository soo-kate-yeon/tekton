/**
 * Builtin Preset Loader Tests
 * TDD RED phase: Tests for built-in preset loading functionality
 *
 * @module preset/__tests__/builtin.test
 */

import { describe, it, expect, beforeAll } from "vitest";
import {
  getBuiltinPresets,
  getBuiltinPreset,
  isValidPresetId,
} from "../builtin.js";
import {
  PresetSchema,
  PresetMetaSchema,
  BUILTIN_PRESET_IDS,
  type Preset,
  type PresetMeta,
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

    it("should return preset with complete structure matching PresetSchema", () => {
      BUILTIN_PRESET_IDS.forEach((presetId) => {
        const preset = getBuiltinPreset(presetId);

        expect(preset).not.toBeNull();
        const result = PresetSchema.safeParse(preset);
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
      BUILTIN_PRESET_IDS.forEach((presetId) => {
        expect(isValidPresetId(presetId)).toBe(true);
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

    describe("minimal-clean", () => {
      it("should have minimal brand tone", () => {
        const preset = getBuiltinPreset("minimal-clean");

        expect(preset?.brandTone).toBe("minimal");
      });
    });

    describe("bold-contrast", () => {
      it("should have bold brand tone", () => {
        const preset = getBuiltinPreset("bold-contrast");

        expect(preset?.brandTone).toBe("bold");
      });

      it("should have high or maximum contrast", () => {
        const preset = getBuiltinPreset("bold-contrast");

        expect(["high", "maximum"]).toContain(
          preset?.componentDefaults.contrast
        );
      });
    });

    describe("warm-friendly", () => {
      it("should have warm brand tone", () => {
        const preset = getBuiltinPreset("warm-friendly");

        expect(preset?.brandTone).toBe("warm");
      });
    });
  });
});
