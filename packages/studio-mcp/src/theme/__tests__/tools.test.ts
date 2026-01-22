/**
 * Preset Tools Tests
 * TDD RED phase: Tests for preset.list and preset.get MCP tools
 *
 * @module preset/__tests__/tools.test
 */

import { describe, it, expect } from "vitest";
import { themeList, themeGet } from "../tools.js";
import { BUILTIN_THEME_IDS } from "../types.js";

describe("Preset Tools", () => {
  describe("themeList", () => {
    it("should return success with all 7 presets", async () => {
      const result = await themeList();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(7);
    });

    it("should return presets with required metadata fields", async () => {
      const result = await themeList();

      expect(result.success).toBe(true);
      result.data?.forEach((theme: import("../types.js").ThemeMeta) => {
        expect(theme.id).toBeDefined();
        expect(theme.name).toBeDefined();
        expect(theme.description).toBeDefined();
        expect(theme.stackInfo).toBeDefined();
        expect(theme.brandTone).toBeDefined();
      });
    });

    it("should include all expected preset IDs", async () => {
      const result = await themeList();

      const themeIds = result.data?.map((p: import("../types.js").ThemeMeta) => p.id) || [];
      BUILTIN_THEME_IDS.forEach((expectedId) => {
        expect(themeIds).toContain(expectedId);
      });
    });

    it("should return presets sorted by ID", async () => {
      const result = await themeList();

      const ids = result.data?.map((p: import("../types.js").ThemeMeta) => p.id) || [];
      const sortedIds = [...ids].sort();
      expect(ids).toEqual(sortedIds);
    });
  });

  describe("themeGet", () => {
    it("should return success with full preset data for valid ID", async () => {
      const result = await themeGet({ themeId: "next-tailwind-shadcn" });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBe("next-tailwind-shadcn");
    });

    it("should return error for invalid preset ID", async () => {
      const result = await themeGet({ themeId: "non-existent-preset" });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain("not found");
    });

    it("should return error for empty preset ID", async () => {
      const result = await themeGet({ themeId: "" });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain("required");
    });

    it("should return error for whitespace-only preset ID", async () => {
      const result = await themeGet({ themeId: "   " });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain("required");
    });

    it("should return preset with colorPalette", async () => {
      const result = await themeGet({ themeId: "next-tailwind-shadcn" });

      expect(result.data?.colorPalette).toBeDefined();
      expect(result.data?.colorPalette.primary).toBeDefined();
    });

    it("should return preset with typography", async () => {
      const result = await themeGet({ themeId: "next-tailwind-shadcn" });

      expect(result.data?.typography).toBeDefined();
      expect(result.data?.typography.fontScale).toBeDefined();
    });

    it("should return preset with componentDefaults", async () => {
      const result = await themeGet({ themeId: "next-tailwind-shadcn" });

      expect(result.data?.componentDefaults).toBeDefined();
      expect(result.data?.componentDefaults.borderRadius).toBeDefined();
    });

    it("should return preset with aiContext", async () => {
      const result = await themeGet({ themeId: "next-tailwind-shadcn" });

      expect(result.data?.aiContext).toBeDefined();
      expect(result.data?.aiContext.brandTone).toBeDefined();
      expect(result.data?.aiContext.designPhilosophy).toBeDefined();
      expect(result.data?.aiContext.colorGuidance).toBeDefined();
      expect(result.data?.aiContext.componentGuidance).toBeDefined();
    });

    it("should work for all built-in preset IDs", async () => {
      for (const themeId of BUILTIN_THEME_IDS) {
        const result = await themeGet({ themeId });
        expect(result.success).toBe(true);
        expect(result.data?.id).toBe(themeId);
      }
    });
  });
});
