import { describe, it, expect } from "vitest";
import * as StudioMCP from "../src/index.js";

describe("Package exports", () => {
  it("should export schema types and validators", () => {
    expect(StudioMCP.BrandAxisSchema).toBeDefined();
    expect(StudioMCP.BrandAxesSchema).toBeDefined();
    expect(StudioMCP.BrandDNASchema).toBeDefined();
  });

  it("should export design token schemas", () => {
    expect(StudioMCP.DesignTokenSchema).toBeDefined();
    expect(StudioMCP.FontFamilySchema).toBeDefined();
    expect(StudioMCP.FontSizeSchema).toBeDefined();
    expect(StudioMCP.TypographySchema).toBeDefined();
  });

  it("should export interpreter functions", () => {
    expect(typeof StudioMCP.interpretAxis).toBe("function");
    expect(typeof StudioMCP.interpretBrandDNA).toBe("function");
  });

  it("should export storage functions", () => {
    expect(typeof StudioMCP.saveBrandDNA).toBe("function");
    expect(typeof StudioMCP.loadBrandDNA).toBe("function");
    expect(typeof StudioMCP.listBrandDNA).toBe("function");
  });
});
