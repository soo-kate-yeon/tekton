import { describe, it, expect } from "vitest";
import * as StudioMCP from "../src/index.js";

describe("Package exports", () => {
  it("should export archetype tools", () => {
    expect(StudioMCP.ArchetypeTools).toBeDefined();
    expect(StudioMCP.archetypeTools).toBeDefined();
    expect(typeof StudioMCP.archetypeTools.list).toBe("function");
    expect(typeof StudioMCP.archetypeTools.get).toBe("function");
    expect(typeof StudioMCP.archetypeTools.getPropRules).toBe("function");
    expect(typeof StudioMCP.archetypeTools.getStateMappings).toBe("function");
    expect(typeof StudioMCP.archetypeTools.getVariants).toBe("function");
    expect(typeof StudioMCP.archetypeTools.getStructure).toBe("function");
    expect(typeof StudioMCP.archetypeTools.query).toBe("function");
  });

  it("should export MCP server functions", () => {
    expect(typeof StudioMCP.createMCPServer).toBe("function");
    expect(Array.isArray(StudioMCP.TOOLS)).toBe(true);
    expect(StudioMCP.TOOLS.length).toBeGreaterThan(0);
  });

  it("should export storage functions", () => {
    expect(typeof StudioMCP.saveComponent).toBe("function");
    expect(typeof StudioMCP.loadComponent).toBe("function");
    expect(typeof StudioMCP.listArchetypes).toBe("function");
    expect(typeof StudioMCP.deleteComponent).toBe("function");
    expect(typeof StudioMCP.archetypeExists).toBe("function");
  });

  it("should export design token schemas", () => {
    expect(StudioMCP.DesignTokenSchema).toBeDefined();
    expect(StudioMCP.FontFamilySchema).toBeDefined();
    expect(StudioMCP.FontSizeSchema).toBeDefined();
    expect(StudioMCP.TypographySchema).toBeDefined();
  });
});
