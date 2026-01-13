import { describe, it, expect } from "vitest";
import {
  interpretAxis,
  interpretBrandDNA,
} from "../../src/interpreter/axis-interpreter.js";
import type { BrandDNA } from "../../src/brand-dna/schema.js";

describe("interpretAxis", () => {
  describe("Density axis", () => {
    it("should interpret low density (0-0.3) as generous/large", () => {
      expect(interpretAxis("density", 0)).toEqual({
        spacing: "generous",
        size: "large",
      });
      expect(interpretAxis("density", 0.1)).toEqual({
        spacing: "generous",
        size: "large",
      });
      expect(interpretAxis("density", 0.29)).toEqual({
        spacing: "generous",
        size: "large",
      });
    });

    it("should interpret medium density (0.3-0.7) as comfortable/medium", () => {
      expect(interpretAxis("density", 0.3)).toEqual({
        spacing: "comfortable",
        size: "medium",
      });
      expect(interpretAxis("density", 0.5)).toEqual({
        spacing: "comfortable",
        size: "medium",
      });
      expect(interpretAxis("density", 0.69)).toEqual({
        spacing: "comfortable",
        size: "medium",
      });
    });

    it("should interpret high density (0.7-1) as compact/small", () => {
      expect(interpretAxis("density", 0.7)).toEqual({
        spacing: "compact",
        size: "small",
      });
      expect(interpretAxis("density", 0.85)).toEqual({
        spacing: "compact",
        size: "small",
      });
      expect(interpretAxis("density", 1)).toEqual({
        spacing: "compact",
        size: "small",
      });
    });

    it("should handle boundary values correctly", () => {
      expect(interpretAxis("density", 0.3)).toEqual({
        spacing: "comfortable",
        size: "medium",
      });
      expect(interpretAxis("density", 0.7)).toEqual({
        spacing: "compact",
        size: "small",
      });
    });
  });

  describe("Warmth axis", () => {
    it("should interpret low warmth (0-0.3) as cool", () => {
      expect(interpretAxis("warmth", 0)).toEqual({ temperature: "cool" });
      expect(interpretAxis("warmth", 0.15)).toEqual({ temperature: "cool" });
      expect(interpretAxis("warmth", 0.29)).toEqual({ temperature: "cool" });
    });

    it("should interpret medium warmth (0.3-0.7) as neutral", () => {
      expect(interpretAxis("warmth", 0.3)).toEqual({ temperature: "neutral" });
      expect(interpretAxis("warmth", 0.5)).toEqual({ temperature: "neutral" });
      expect(interpretAxis("warmth", 0.69)).toEqual({ temperature: "neutral" });
    });

    it("should interpret high warmth (0.7-1) as warm", () => {
      expect(interpretAxis("warmth", 0.7)).toEqual({ temperature: "warm" });
      expect(interpretAxis("warmth", 0.85)).toEqual({ temperature: "warm" });
      expect(interpretAxis("warmth", 1)).toEqual({ temperature: "warm" });
    });
  });

  describe("Playfulness axis", () => {
    it("should interpret low playfulness (0-0.3) as sharp/subtle", () => {
      expect(interpretAxis("playfulness", 0)).toEqual({
        corners: "sharp",
        animation: "subtle",
      });
      expect(interpretAxis("playfulness", 0.15)).toEqual({
        corners: "sharp",
        animation: "subtle",
      });
      expect(interpretAxis("playfulness", 0.29)).toEqual({
        corners: "sharp",
        animation: "subtle",
      });
    });

    it("should interpret medium playfulness (0.3-0.7) as moderate/standard", () => {
      expect(interpretAxis("playfulness", 0.3)).toEqual({
        corners: "moderate",
        animation: "standard",
      });
      expect(interpretAxis("playfulness", 0.5)).toEqual({
        corners: "moderate",
        animation: "standard",
      });
      expect(interpretAxis("playfulness", 0.69)).toEqual({
        corners: "moderate",
        animation: "standard",
      });
    });

    it("should interpret high playfulness (0.7-1) as round/playful", () => {
      expect(interpretAxis("playfulness", 0.7)).toEqual({
        corners: "round",
        animation: "playful",
      });
      expect(interpretAxis("playfulness", 0.85)).toEqual({
        corners: "round",
        animation: "playful",
      });
      expect(interpretAxis("playfulness", 1)).toEqual({
        corners: "round",
        animation: "playful",
      });
    });
  });

  describe("Sophistication axis", () => {
    it("should interpret low sophistication (0-0.3) as casual/minimal", () => {
      expect(interpretAxis("sophistication", 0)).toEqual({
        style: "casual",
        detail: "minimal",
      });
      expect(interpretAxis("sophistication", 0.15)).toEqual({
        style: "casual",
        detail: "minimal",
      });
      expect(interpretAxis("sophistication", 0.29)).toEqual({
        style: "casual",
        detail: "minimal",
      });
    });

    it("should interpret medium sophistication (0.3-0.7) as balanced/moderate", () => {
      expect(interpretAxis("sophistication", 0.3)).toEqual({
        style: "balanced",
        detail: "moderate",
      });
      expect(interpretAxis("sophistication", 0.5)).toEqual({
        style: "balanced",
        detail: "moderate",
      });
      expect(interpretAxis("sophistication", 0.69)).toEqual({
        style: "balanced",
        detail: "moderate",
      });
    });

    it("should interpret high sophistication (0.7-1) as elegant/refined", () => {
      expect(interpretAxis("sophistication", 0.7)).toEqual({
        style: "elegant",
        detail: "refined",
      });
      expect(interpretAxis("sophistication", 0.85)).toEqual({
        style: "elegant",
        detail: "refined",
      });
      expect(interpretAxis("sophistication", 1)).toEqual({
        style: "elegant",
        detail: "refined",
      });
    });
  });

  describe("Energy axis", () => {
    it("should interpret low energy (0-0.3) as low/muted", () => {
      expect(interpretAxis("energy", 0)).toEqual({
        intensity: "low",
        contrast: "muted",
      });
      expect(interpretAxis("energy", 0.15)).toEqual({
        intensity: "low",
        contrast: "muted",
      });
      expect(interpretAxis("energy", 0.29)).toEqual({
        intensity: "low",
        contrast: "muted",
      });
    });

    it("should interpret medium energy (0.3-0.7) as medium/balanced", () => {
      expect(interpretAxis("energy", 0.3)).toEqual({
        intensity: "medium",
        contrast: "balanced",
      });
      expect(interpretAxis("energy", 0.5)).toEqual({
        intensity: "medium",
        contrast: "balanced",
      });
      expect(interpretAxis("energy", 0.69)).toEqual({
        intensity: "medium",
        contrast: "balanced",
      });
    });

    it("should interpret high energy (0.7-1) as high/vibrant", () => {
      expect(interpretAxis("energy", 0.7)).toEqual({
        intensity: "high",
        contrast: "vibrant",
      });
      expect(interpretAxis("energy", 0.85)).toEqual({
        intensity: "high",
        contrast: "vibrant",
      });
      expect(interpretAxis("energy", 1)).toEqual({
        intensity: "high",
        contrast: "vibrant",
      });
    });
  });

  describe("Edge cases", () => {
    it("should throw error for invalid axis name", () => {
      expect(() => interpretAxis("invalid" as any, 0.5)).toThrow(
        "Unknown axis",
      );
    });

    it("should throw error for value out of range", () => {
      expect(() => interpretAxis("density", -0.1)).toThrow(
        "Axis value must be between 0 and 1",
      );
      expect(() => interpretAxis("density", 1.1)).toThrow(
        "Axis value must be between 0 and 1",
      );
    });

    it("should handle exact boundary values", () => {
      // Lower boundary of middle range
      const result1 = interpretAxis("density", 0.3);
      expect(result1.spacing).toBe("comfortable");

      // Upper boundary of middle range (just below high)
      const result2 = interpretAxis("density", 0.7);
      expect(result2.spacing).toBe("compact");
    });
  });
});

describe("interpretBrandDNA", () => {
  const mockBrandDNA: BrandDNA = {
    id: "test-brand",
    name: "Test Brand",
    description: "Test brand for axis interpretation",
    axes: {
      density: 0.5,
      warmth: 0.6,
      playfulness: 0.2,
      sophistication: 0.8,
      energy: 0.4,
    },
    version: "1.0.0",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };

  it("should interpret all axes correctly", () => {
    const result = interpretBrandDNA(mockBrandDNA);

    expect(result.density).toEqual({ spacing: "comfortable", size: "medium" });
    expect(result.warmth).toEqual({ temperature: "neutral" });
    expect(result.playfulness).toEqual({
      corners: "sharp",
      animation: "subtle",
    });
    expect(result.sophistication).toEqual({
      style: "elegant",
      detail: "refined",
    });
    expect(result.energy).toEqual({
      intensity: "medium",
      contrast: "balanced",
    });
  });

  it("should handle all axes at minimum (0)", () => {
    const minBrand: BrandDNA = {
      ...mockBrandDNA,
      axes: {
        density: 0,
        warmth: 0,
        playfulness: 0,
        sophistication: 0,
        energy: 0,
      },
    };

    const result = interpretBrandDNA(minBrand);

    expect(result.density).toEqual({ spacing: "generous", size: "large" });
    expect(result.warmth).toEqual({ temperature: "cool" });
    expect(result.playfulness).toEqual({
      corners: "sharp",
      animation: "subtle",
    });
    expect(result.sophistication).toEqual({
      style: "casual",
      detail: "minimal",
    });
    expect(result.energy).toEqual({ intensity: "low", contrast: "muted" });
  });

  it("should handle all axes at maximum (1)", () => {
    const maxBrand: BrandDNA = {
      ...mockBrandDNA,
      axes: {
        density: 1,
        warmth: 1,
        playfulness: 1,
        sophistication: 1,
        energy: 1,
      },
    };

    const result = interpretBrandDNA(maxBrand);

    expect(result.density).toEqual({ spacing: "compact", size: "small" });
    expect(result.warmth).toEqual({ temperature: "warm" });
    expect(result.playfulness).toEqual({
      corners: "round",
      animation: "playful",
    });
    expect(result.sophistication).toEqual({
      style: "elegant",
      detail: "refined",
    });
    expect(result.energy).toEqual({ intensity: "high", contrast: "vibrant" });
  });

  it("should handle all axes at middle (0.5)", () => {
    const midBrand: BrandDNA = {
      ...mockBrandDNA,
      axes: {
        density: 0.5,
        warmth: 0.5,
        playfulness: 0.5,
        sophistication: 0.5,
        energy: 0.5,
      },
    };

    const result = interpretBrandDNA(midBrand);

    expect(result.density).toEqual({ spacing: "comfortable", size: "medium" });
    expect(result.warmth).toEqual({ temperature: "neutral" });
    expect(result.playfulness).toEqual({
      corners: "moderate",
      animation: "standard",
    });
    expect(result.sophistication).toEqual({
      style: "balanced",
      detail: "moderate",
    });
    expect(result.energy).toEqual({
      intensity: "medium",
      contrast: "balanced",
    });
  });

  it("should return an object with all five axis interpretations", () => {
    const result = interpretBrandDNA(mockBrandDNA);

    expect(Object.keys(result)).toEqual([
      "density",
      "warmth",
      "playfulness",
      "sophistication",
      "energy",
    ]);
  });
});
