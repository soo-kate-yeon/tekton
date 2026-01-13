import { describe, it, expect } from "vitest";
import {
  DesignTokenSchema,
  type DesignToken,
  type SpacingValue,
  type TypographyValue,
  type ColorValue,
} from "../../src/brand-dna/design-tokens.js";

describe("DesignTokenSchema", () => {
  describe("Valid Design Token Objects", () => {
    it("should accept complete design token object with all categories", () => {
      const validToken: DesignToken = {
        spacing: {
          xs: "4px",
          sm: "8px",
          md: "16px",
          lg: "24px",
          xl: "32px",
        },
        typography: {
          fontFamily: {
            sans: "Inter, system-ui, sans-serif",
            serif: "Georgia, serif",
            mono: "Menlo, monospace",
          },
          fontSize: {
            xs: "12px",
            sm: "14px",
            md: "16px",
            lg: "18px",
            xl: "24px",
          },
          fontWeight: {
            normal: "400",
            medium: "500",
            bold: "700",
          },
          lineHeight: {
            tight: "1.2",
            normal: "1.5",
            relaxed: "1.75",
          },
        },
        colors: {
          primary: "#0066CC",
          secondary: "#6B46C1",
          neutral: "#718096",
          success: "#38A169",
          warning: "#D69E2E",
          error: "#E53E3E",
        },
        borderRadius: {
          none: "0px",
          sm: "4px",
          md: "8px",
          lg: "16px",
          full: "9999px",
        },
        shadows: {
          sm: "0 1px 2px rgba(0,0,0,0.05)",
          md: "0 4px 6px rgba(0,0,0,0.1)",
          lg: "0 10px 15px rgba(0,0,0,0.1)",
        },
        opacity: {
          low: "0.3",
          medium: "0.6",
          high: "0.9",
        },
        transitions: {
          fast: "150ms",
          normal: "300ms",
          slow: "500ms",
        },
        breakpoints: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
        },
        zIndex: {
          dropdown: "1000",
          modal: "2000",
          tooltip: "3000",
        },
      };

      const result = DesignTokenSchema.parse(validToken);
      expect(result).toBeDefined();
      expect(result.spacing.md).toBe("16px");
      expect(result.colors.primary).toBe("#0066CC");
    });

    it("should accept partial design token objects", () => {
      const minimalToken = {
        spacing: {
          md: "16px",
        },
      };

      expect(() => DesignTokenSchema.parse(minimalToken)).not.toThrow();
    });

    it("should accept empty nested objects", () => {
      const emptyCategories: DesignToken = {
        spacing: {},
        typography: {
          fontFamily: {},
          fontSize: {},
          fontWeight: {},
          lineHeight: {},
        },
        colors: {},
        borderRadius: {},
        shadows: {},
        opacity: {},
        transitions: {},
        breakpoints: {},
        zIndex: {},
      };

      expect(() => DesignTokenSchema.parse(emptyCategories)).not.toThrow();
    });
  });

  describe("Type Safety", () => {
    it("should validate spacing values as strings", () => {
      const validSpacing: SpacingValue = "16px";
      expect(typeof validSpacing).toBe("string");
    });

    it("should validate color values as hex strings", () => {
      const validColor: ColorValue = "#FF5733";
      expect(validColor).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it("should validate typography values", () => {
      const validTypography: TypographyValue = {
        fontFamily: {
          sans: "Inter, sans-serif",
        },
        fontSize: {
          md: "16px",
        },
        fontWeight: {
          normal: "400",
        },
        lineHeight: {
          normal: "1.5",
        },
      };

      expect(validTypography.fontFamily.sans).toBe("Inter, sans-serif");
    });
  });

  describe("Invalid Design Token Objects", () => {
    it("should reject non-object values for categories", () => {
      const invalidSpacing = {
        spacing: "not-an-object",
      };

      expect(() => DesignTokenSchema.parse(invalidSpacing)).toThrow();
    });

    it("should reject non-string values for spacing", () => {
      const invalidSpacing = {
        spacing: {
          md: 16,
        },
      };

      expect(() => DesignTokenSchema.parse(invalidSpacing)).toThrow();
    });

    it("should reject non-string values for colors", () => {
      const invalidColors = {
        colors: {
          primary: 0x0066cc,
        },
      };

      expect(() => DesignTokenSchema.parse(invalidColors)).toThrow();
    });
  });

  describe("Edge Cases", () => {
    it("should handle deeply nested optional fields", () => {
      const partialTypography = {
        typography: {
          fontFamily: {
            sans: "Inter",
          },
        },
      };

      expect(() => DesignTokenSchema.parse(partialTypography)).not.toThrow();
    });

    it("should accept custom properties in each category", () => {
      const customSpacing = {
        spacing: {
          xs: "4px",
          custom2xl: "48px",
          customHuge: "96px",
        },
      };

      expect(() => DesignTokenSchema.parse(customSpacing)).not.toThrow();
    });
  });
});
