/**
 * Preset Tools Tests
 * TDD RED phase: Tests for preset.list and preset.get MCP tools
 *
 * @module preset/__tests__/tools.test
 */

import { describe, it, expect } from "vitest";
import { presetList, presetGet } from "../tools.js";
import { BUILTIN_PRESET_IDS } from "../types.js";

describe("Preset Tools", () => {
  describe("presetList", () => {
    it("should return success with all 7 presets", async () => {
      const result = await presetList();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(7);
    });

    it("should return presets with required metadata fields", async () => {
      const result = await presetList();

      expect(result.success).toBe(true);
      result.data?.forEach((preset) => {
        expect(preset.id).toBeDefined();
        expect(preset.name).toBeDefined();
        expect(preset.description).toBeDefined();
        expect(preset.stackInfo).toBeDefined();
        expect(preset.brandTone).toBeDefined();
      });
    });

    it("should include all expected preset IDs", async () => {
      const result = await presetList();

      const presetIds = result.data?.map((p) => p.id) || [];
      BUILTIN_PRESET_IDS.forEach((expectedId) => {
        expect(presetIds).toContain(expectedId);
      });
    });

    it("should return presets sorted by ID", async () => {
      const result = await presetList();

      const ids = result.data?.map((p) => p.id) || [];
      const sortedIds = [...ids].sort();
      expect(ids).toEqual(sortedIds);
    });
  });

  describe("presetGet", () => {
    it("should return success with full preset data for valid ID", async () => {
      const result = await presetGet({ presetId: "next-tailwind-shadcn" });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBe("next-tailwind-shadcn");
    });

    it("should return error for invalid preset ID", async () => {
      const result = await presetGet({ presetId: "non-existent-preset" });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain("not found");
    });

    it("should return error for empty preset ID", async () => {
      const result = await presetGet({ presetId: "" });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain("required");
    });

    it("should return error for whitespace-only preset ID", async () => {
      const result = await presetGet({ presetId: "   " });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain("required");
    });

    it("should return preset with colorPalette", async () => {
      const result = await presetGet({ presetId: "next-tailwind-shadcn" });

      expect(result.data?.colorPalette).toBeDefined();
      expect(result.data?.colorPalette.primary).toBeDefined();
    });

    it("should return preset with typography", async () => {
      const result = await presetGet({ presetId: "next-tailwind-shadcn" });

      expect(result.data?.typography).toBeDefined();
      expect(result.data?.typography.fontScale).toBeDefined();
    });

    it("should return preset with componentDefaults", async () => {
      const result = await presetGet({ presetId: "next-tailwind-shadcn" });

      expect(result.data?.componentDefaults).toBeDefined();
      expect(result.data?.componentDefaults.borderRadius).toBeDefined();
    });

    it("should return preset with aiContext", async () => {
      const result = await presetGet({ presetId: "next-tailwind-shadcn" });

      expect(result.data?.aiContext).toBeDefined();
      expect(result.data?.aiContext.brandTone).toBeDefined();
      expect(result.data?.aiContext.designPhilosophy).toBeDefined();
      expect(result.data?.aiContext.colorGuidance).toBeDefined();
      expect(result.data?.aiContext.componentGuidance).toBeDefined();
    });

    it("should work for all built-in preset IDs", async () => {
      for (const presetId of BUILTIN_PRESET_IDS) {
        const result = await presetGet({ presetId });
        expect(result.success).toBe(true);
        expect(result.data?.id).toBe(presetId);
      }
    });
  });
});
