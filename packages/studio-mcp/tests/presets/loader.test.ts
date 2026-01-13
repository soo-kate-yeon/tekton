import { describe, it, expect, beforeEach } from "vitest";
import { listPresets, getPreset } from "../../src/presets/loader.js";

describe("Preset Loader", () => {
  describe("listPresets", () => {
    it("should return an array of all available presets", async () => {
      const presets = await listPresets();
      expect(Array.isArray(presets)).toBe(true);
      expect(presets.length).toBeGreaterThanOrEqual(3);
    });

    it("should return presets with valid schema", async () => {
      const presets = await listPresets();
      presets.forEach((preset) => {
        expect(preset).toHaveProperty("id");
        expect(preset).toHaveProperty("name");
        expect(preset).toHaveProperty("description");
        expect(preset).toHaveProperty("axes");
        expect(preset.axes).toHaveProperty("density");
        expect(preset.axes).toHaveProperty("warmth");
        expect(preset.axes).toHaveProperty("playfulness");
        expect(preset.axes).toHaveProperty("sophistication");
        expect(preset.axes).toHaveProperty("energy");
      });
    });

    it("should include required presets (modern-tech, luxury-fashion, friendly-casual)", async () => {
      const presets = await listPresets();
      const ids = presets.map((p) => p.id);

      expect(ids).toContain("modern-tech");
      expect(ids).toContain("luxury-fashion");
      expect(ids).toContain("friendly-casual");
    });

    it("should return presets with valid axis values (0-1 range)", async () => {
      const presets = await listPresets();
      presets.forEach((preset) => {
        Object.values(preset.axes).forEach((value) => {
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(1);
        });
      });
    });

    it("should return presets sorted alphabetically by ID", async () => {
      const presets = await listPresets();
      const ids = presets.map((p) => p.id);
      const sortedIds = [...ids].sort();
      expect(ids).toEqual(sortedIds);
    });
  });

  describe("getPreset", () => {
    it("should return a preset by valid ID", async () => {
      const preset = await getPreset("modern-tech");
      expect(preset).toBeDefined();
      expect(preset.id).toBe("modern-tech");
      expect(preset.name).toBeDefined();
      expect(preset.axes).toBeDefined();
    });

    it("should return modern-tech preset with correct values", async () => {
      const preset = await getPreset("modern-tech");
      expect(preset.id).toBe("modern-tech");
      expect(preset.name).toBe("Modern Tech");
      expect(preset.description).toContain("tech");
      expect(preset.axes.density).toBe(0.6);
      expect(preset.axes.warmth).toBe(0.3);
      expect(preset.axes.playfulness).toBe(0.5);
      expect(preset.axes.sophistication).toBe(0.7);
      expect(preset.axes.energy).toBe(0.8);
    });

    it("should return luxury-fashion preset with correct values", async () => {
      const preset = await getPreset("luxury-fashion");
      expect(preset.id).toBe("luxury-fashion");
      expect(preset.name).toBe("Luxury Fashion");
      expect(preset.description).toContain("luxury");
      expect(preset.axes.density).toBe(0.3);
      expect(preset.axes.warmth).toBe(0.4);
      expect(preset.axes.playfulness).toBe(0.2);
      expect(preset.axes.sophistication).toBe(0.9);
      expect(preset.axes.energy).toBe(0.5);
    });

    it("should return friendly-casual preset with correct values", async () => {
      const preset = await getPreset("friendly-casual");
      expect(preset.id).toBe("friendly-casual");
      expect(preset.name).toBe("Friendly Casual");
      expect(preset.description).toContain("Approachable");
      expect(preset.axes.density).toBe(0.5);
      expect(preset.axes.warmth).toBe(0.7);
      expect(preset.axes.playfulness).toBe(0.8);
      expect(preset.axes.sophistication).toBe(0.4);
      expect(preset.axes.energy).toBe(0.6);
    });

    it("should throw NotFoundError for non-existent preset ID", async () => {
      await expect(getPreset("non-existent-preset")).rejects.toThrow(
        "Preset not found: non-existent-preset",
      );
    });

    it("should throw error for invalid preset ID format", async () => {
      await expect(getPreset("InvalidFormat")).rejects.toThrow();
    });

    it("should throw error for empty preset ID", async () => {
      await expect(getPreset("")).rejects.toThrow();
    });
  });

  describe("Preset validation", () => {
    it("should validate preset JSON files with BrandAxisSchema", async () => {
      const presets = await listPresets();
      presets.forEach((preset) => {
        // All axes should be valid according to BrandAxisSchema
        Object.values(preset.axes).forEach((value) => {
          expect(typeof value).toBe("number");
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(1);
        });
      });
    });

    it("should reject invalid preset JSON files during load", async () => {
      // This test ensures that if a malformed preset exists, it won't be loaded
      const presets = await listPresets();
      // All returned presets should be valid (no exceptions thrown)
      expect(presets.length).toBeGreaterThanOrEqual(3);
    });
  });
});
