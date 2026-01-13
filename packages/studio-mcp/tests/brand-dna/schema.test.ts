import { describe, it, expect } from "vitest";
import { BrandAxisSchema, BrandDNASchema } from "../../src/brand-dna/schema.js";

describe("BrandAxisSchema", () => {
  describe("Valid values", () => {
    it("should accept valid axis values within 0-1 range", () => {
      expect(() => BrandAxisSchema.parse(0)).not.toThrow();
      expect(() => BrandAxisSchema.parse(0.5)).not.toThrow();
      expect(() => BrandAxisSchema.parse(1)).not.toThrow();
      expect(() => BrandAxisSchema.parse(0.333)).not.toThrow();
      expect(() => BrandAxisSchema.parse(0.667)).not.toThrow();
    });

    it("should accept boundary values exactly", () => {
      const min = BrandAxisSchema.parse(0);
      const max = BrandAxisSchema.parse(1);
      expect(min).toBe(0);
      expect(max).toBe(1);
    });
  });

  describe("Invalid values", () => {
    it("should reject values below 0", () => {
      expect(() => BrandAxisSchema.parse(-0.1)).toThrow();
      expect(() => BrandAxisSchema.parse(-1)).toThrow();
    });

    it("should reject values above 1", () => {
      expect(() => BrandAxisSchema.parse(1.1)).toThrow();
      expect(() => BrandAxisSchema.parse(2)).toThrow();
    });

    it("should reject non-numeric values", () => {
      expect(() => BrandAxisSchema.parse("0.5")).toThrow();
      expect(() => BrandAxisSchema.parse(null)).toThrow();
      expect(() => BrandAxisSchema.parse(undefined)).toThrow();
      expect(() => BrandAxisSchema.parse({})).toThrow();
    });
  });
});

describe("BrandDNASchema", () => {
  const validBrandDNA = {
    id: "brand-001",
    name: "Modern Tech Brand",
    description: "A contemporary technology brand with clean aesthetics",
    axes: {
      density: 0.3,
      warmth: 0.6,
      playfulness: 0.2,
      sophistication: 0.8,
      energy: 0.5,
    },
    version: "1.0.0",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  };

  describe("Valid Brand DNA", () => {
    it("should accept valid complete Brand DNA object", () => {
      const result = BrandDNASchema.parse(validBrandDNA);
      expect(result).toBeDefined();
      expect(result.id).toBe("brand-001");
      expect(result.name).toBe("Modern Tech Brand");
      expect(result.axes.density).toBe(0.3);
    });

    it("should accept all axes at minimum boundary (0)", () => {
      const allMin = {
        ...validBrandDNA,
        axes: {
          density: 0,
          warmth: 0,
          playfulness: 0,
          sophistication: 0,
          energy: 0,
        },
      };
      expect(() => BrandDNASchema.parse(allMin)).not.toThrow();
    });

    it("should accept all axes at maximum boundary (1)", () => {
      const allMax = {
        ...validBrandDNA,
        axes: {
          density: 1,
          warmth: 1,
          playfulness: 1,
          sophistication: 1,
          energy: 1,
        },
      };
      expect(() => BrandDNASchema.parse(allMax)).not.toThrow();
    });

    it("should accept all axes at middle value (0.5)", () => {
      const allMid = {
        ...validBrandDNA,
        axes: {
          density: 0.5,
          warmth: 0.5,
          playfulness: 0.5,
          sophistication: 0.5,
          energy: 0.5,
        },
      };
      expect(() => BrandDNASchema.parse(allMid)).not.toThrow();
    });

    it("should parse ISO date strings to Date objects", () => {
      const withStringDates = {
        ...validBrandDNA,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };
      const result = BrandDNASchema.parse(withStringDates);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe("Invalid Brand DNA", () => {
    it("should reject missing required fields", () => {
      const missingId = { ...validBrandDNA };
      delete (missingId as any).id;
      expect(() => BrandDNASchema.parse(missingId)).toThrow();

      const missingName = { ...validBrandDNA };
      delete (missingName as any).name;
      expect(() => BrandDNASchema.parse(missingName)).toThrow();

      const missingAxes = { ...validBrandDNA };
      delete (missingAxes as any).axes;
      expect(() => BrandDNASchema.parse(missingAxes)).toThrow();
    });

    it("should reject invalid axis values", () => {
      const invalidDensity = {
        ...validBrandDNA,
        axes: { ...validBrandDNA.axes, density: -0.1 },
      };
      expect(() => BrandDNASchema.parse(invalidDensity)).toThrow();

      const invalidWarmth = {
        ...validBrandDNA,
        axes: { ...validBrandDNA.axes, warmth: 1.5 },
      };
      expect(() => BrandDNASchema.parse(invalidWarmth)).toThrow();
    });

    it("should reject missing axis fields", () => {
      const missingDensity = {
        ...validBrandDNA,
        axes: { ...validBrandDNA.axes },
      };
      delete (missingDensity.axes as any).density;
      expect(() => BrandDNASchema.parse(missingDensity)).toThrow();
    });

    it("should reject empty string for id or name", () => {
      const emptyId = { ...validBrandDNA, id: "" };
      expect(() => BrandDNASchema.parse(emptyId)).toThrow();

      const emptyName = { ...validBrandDNA, name: "" };
      expect(() => BrandDNASchema.parse(emptyName)).toThrow();
    });

    it("should reject invalid version format", () => {
      const invalidVersion = { ...validBrandDNA, version: "v1" };
      expect(() => BrandDNASchema.parse(invalidVersion)).toThrow();
    });

    it("should reject invalid date formats", () => {
      const invalidDate = { ...validBrandDNA, createdAt: "not-a-date" };
      expect(() => BrandDNASchema.parse(invalidDate)).toThrow();
    });
  });

  describe("Edge cases", () => {
    it("should handle description as optional field", () => {
      const noDescription = { ...validBrandDNA };
      delete (noDescription as any).description;
      expect(() => BrandDNASchema.parse(noDescription)).not.toThrow();
    });

    it("should trim whitespace from id and name", () => {
      const withWhitespace = {
        ...validBrandDNA,
        id: "  brand-001  ",
        name: "  Modern Tech Brand  ",
      };
      const result = BrandDNASchema.parse(withWhitespace);
      expect(result.id).toBe("brand-001");
      expect(result.name).toBe("Modern Tech Brand");
    });

    it("should validate version follows semantic versioning pattern", () => {
      const validVersions = ["1.0.0", "1.2.3", "10.20.30"];
      validVersions.forEach((version) => {
        const brandDNA = { ...validBrandDNA, version };
        expect(() => BrandDNASchema.parse(brandDNA)).not.toThrow();
      });
    });
  });
});
