import { describe, it, expect } from "vitest";
import { PresetSchema } from "../../src/presets/schema.js";

describe("PresetSchema", () => {
  const validPreset = {
    id: "modern-tech",
    name: "Modern Tech",
    description: "Tech-forward, minimalist brand",
    axes: {
      density: 0.6,
      warmth: 0.3,
      playfulness: 0.5,
      sophistication: 0.7,
      energy: 0.8,
    },
  };

  describe("Valid presets", () => {
    it("should accept valid preset with all required fields", () => {
      const result = PresetSchema.parse(validPreset);
      expect(result).toBeDefined();
      expect(result.id).toBe("modern-tech");
      expect(result.name).toBe("Modern Tech");
      expect(result.axes.density).toBe(0.6);
    });

    it("should accept preset without optional thumbnail", () => {
      expect(() => PresetSchema.parse(validPreset)).not.toThrow();
    });

    it("should accept preset with optional thumbnail", () => {
      const withThumbnail = {
        ...validPreset,
        thumbnail: "https://example.com/thumbnail.png",
      };
      const result = PresetSchema.parse(withThumbnail);
      expect(result.thumbnail).toBe("https://example.com/thumbnail.png");
    });

    it("should accept kebab-case ID", () => {
      const kebabIds = [
        "modern-tech",
        "luxury-fashion",
        "friendly-casual",
        "tech-startup",
        "eco-friendly",
      ];
      kebabIds.forEach((id) => {
        const preset = { ...validPreset, id };
        expect(() => PresetSchema.parse(preset)).not.toThrow();
      });
    });

    it("should validate all axes are within 0-1 range", () => {
      const allBoundaries = {
        ...validPreset,
        axes: {
          density: 0,
          warmth: 1,
          playfulness: 0.5,
          sophistication: 0.25,
          energy: 0.75,
        },
      };
      expect(() => PresetSchema.parse(allBoundaries)).not.toThrow();
    });
  });

  describe("Invalid presets", () => {
    it("should reject missing required fields", () => {
      const missingId = { ...validPreset };
      delete (missingId as any).id;
      expect(() => PresetSchema.parse(missingId)).toThrow();

      const missingName = { ...validPreset };
      delete (missingName as any).name;
      expect(() => PresetSchema.parse(missingName)).toThrow();

      const missingAxes = { ...validPreset };
      delete (missingAxes as any).axes;
      expect(() => PresetSchema.parse(missingAxes)).toThrow();
    });

    it("should reject invalid ID format (non-kebab-case)", () => {
      const invalidIds = ["ModernTech", "modern_tech", "MODERN-TECH", "modern tech"];
      invalidIds.forEach((id) => {
        const preset = { ...validPreset, id };
        expect(() => PresetSchema.parse(preset)).toThrow();
      });
    });

    it("should reject empty string for id or name", () => {
      const emptyId = { ...validPreset, id: "" };
      expect(() => PresetSchema.parse(emptyId)).toThrow();

      const emptyName = { ...validPreset, name: "" };
      expect(() => PresetSchema.parse(emptyName)).toThrow();
    });

    it("should reject invalid axis values (out of 0-1 range)", () => {
      const invalidDensity = {
        ...validPreset,
        axes: { ...validPreset.axes, density: -0.1 },
      };
      expect(() => PresetSchema.parse(invalidDensity)).toThrow();

      const invalidWarmth = {
        ...validPreset,
        axes: { ...validPreset.axes, warmth: 1.5 },
      };
      expect(() => PresetSchema.parse(invalidWarmth)).toThrow();
    });

    it("should reject missing axis fields", () => {
      const missingDensity = {
        ...validPreset,
        axes: { ...validPreset.axes },
      };
      delete (missingDensity.axes as any).density;
      expect(() => PresetSchema.parse(missingDensity)).toThrow();
    });

    it("should reject invalid thumbnail URL format", () => {
      const invalidThumbnail = {
        ...validPreset,
        thumbnail: "not-a-valid-url",
      };
      expect(() => PresetSchema.parse(invalidThumbnail)).toThrow();
    });
  });

  describe("Edge cases", () => {
    it("should handle description as required field", () => {
      const noDescription = { ...validPreset };
      delete (noDescription as any).description;
      expect(() => PresetSchema.parse(noDescription)).toThrow();
    });

    it("should validate all five axes are present", () => {
      const axes = ["density", "warmth", "playfulness", "sophistication", "energy"];
      axes.forEach((axis) => {
        const missingAxis = {
          ...validPreset,
          axes: { ...validPreset.axes },
        };
        delete (missingAxis.axes as any)[axis];
        expect(() => PresetSchema.parse(missingAxis)).toThrow();
      });
    });
  });
});
