/**
 * MCP Server Tests
 * Tests for HTTP server endpoints and tool execution
 *
 * @module tests/server/mcp-server.test
 */

import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { type Server } from "http";
import { createMCPServer, TOOLS } from "../../src/server/mcp-server.js";

// Helper to make HTTP requests to the server
async function makeRequest(
  port: number,
  method: string,
  path: string,
  body?: unknown
): Promise<{ status: number; data: unknown }> {
  const response = await fetch(`http://localhost:${port}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();
  return { status: response.status, data };
}

describe("MCP Server", () => {
  describe("TOOLS array", () => {
    it("should export TOOLS array with archetype tools", () => {
      expect(Array.isArray(TOOLS)).toBe(true);
      expect(TOOLS.length).toBeGreaterThan(0);
    });

    it("should include all 7 archetype tools", () => {
      const archetypeToolNames = TOOLS.filter((t) =>
        t.name.startsWith("archetype.")
      ).map((t) => t.name);

      expect(archetypeToolNames).toContain("archetype.list");
      expect(archetypeToolNames).toContain("archetype.get");
      expect(archetypeToolNames).toContain("archetype.getPropRules");
      expect(archetypeToolNames).toContain("archetype.getStateMappings");
      expect(archetypeToolNames).toContain("archetype.getVariants");
      expect(archetypeToolNames).toContain("archetype.getStructure");
      expect(archetypeToolNames).toContain("archetype.query");
    });

    it("should include all 3 project tools", () => {
      const projectToolNames = TOOLS.filter((t) =>
        t.name.startsWith("project.")
      ).map((t) => t.name);

      expect(projectToolNames).toContain("project.detectStructure");
      expect(projectToolNames).toContain("project.getActivePreset");
      expect(projectToolNames).toContain("project.setActivePreset");
    });

    it("should include all 5 screen tools", () => {
      const screenToolNames = TOOLS.filter((t) =>
        t.name.startsWith("screen.")
      ).map((t) => t.name);

      expect(screenToolNames).toContain("screen.create");
      expect(screenToolNames).toContain("screen.addComponent");
      expect(screenToolNames).toContain("screen.applyArchetype");
      expect(screenToolNames).toContain("screen.list");
      expect(screenToolNames).toContain("screen.preview");
    });

    describe("project.detectStructure tool definition", () => {
      it("should have correct schema", () => {
        const tool = TOOLS.find((t) => t.name === "project.detectStructure");

        expect(tool).toBeDefined();
        expect(tool?.description).toContain("Detect project structure");
        expect(tool?.inputSchema.type).toBe("object");
        expect(tool?.inputSchema.properties).toHaveProperty("projectPath");
        expect(tool?.inputSchema.required).toContain("projectPath");
      });
    });

    describe("project.getActivePreset tool definition", () => {
      it("should have correct schema", () => {
        const tool = TOOLS.find((t) => t.name === "project.getActivePreset");

        expect(tool).toBeDefined();
        expect(tool?.description).toContain("active preset");
        expect(tool?.inputSchema.type).toBe("object");
        expect(tool?.inputSchema.properties).toHaveProperty("projectPath");
        expect(tool?.inputSchema.required).toEqual([]);
      });
    });

    describe("project.setActivePreset tool definition", () => {
      it("should have correct schema", () => {
        const tool = TOOLS.find((t) => t.name === "project.setActivePreset");

        expect(tool).toBeDefined();
        expect(tool?.description).toContain("Set the active preset");
        expect(tool?.inputSchema.type).toBe("object");
        expect(tool?.inputSchema.properties).toHaveProperty("presetId");
        expect(tool?.inputSchema.properties).toHaveProperty("projectPath");
        expect(tool?.inputSchema.required).toContain("presetId");
      });
    });

    describe("Tool schema validation", () => {
      it("should have valid inputSchema for all tools", () => {
        for (const tool of TOOLS) {
          expect(tool.name).toBeTruthy();
          expect(tool.description).toBeTruthy();
          expect(tool.inputSchema).toBeDefined();
          expect(tool.inputSchema.type).toBe("object");
          expect(tool.inputSchema.properties).toBeDefined();
        }
      });

      it("should have required arrays where specified", () => {
        const toolsWithRequired = TOOLS.filter(
          (t) => t.inputSchema.required && t.inputSchema.required.length > 0
        );

        for (const tool of toolsWithRequired) {
          expect(Array.isArray(tool.inputSchema.required)).toBe(true);
          for (const reqField of tool.inputSchema.required!) {
            expect(tool.inputSchema.properties).toHaveProperty(reqField);
          }
        }
      });
    });
  });

  describe("Tool count", () => {
    it("should have 19 tools (7 archetype + 3 project + 5 screen + 4 standalone)", () => {
      expect(TOOLS.length).toBe(19);
    });
  });

  describe("Standalone tools", () => {
    it("should include preset.list tool", () => {
      const tool = TOOLS.find((t) => t.name === "preset.list");
      expect(tool).toBeDefined();
      expect(tool?.description).toContain("built-in presets");
    });

    it("should include preset.get tool", () => {
      const tool = TOOLS.find((t) => t.name === "preset.get");
      expect(tool).toBeDefined();
      expect(tool?.inputSchema.required).toContain("presetId");
    });

    it("should include project.status tool", () => {
      const tool = TOOLS.find((t) => t.name === "project.status");
      expect(tool).toBeDefined();
      expect(tool?.description).toContain("connection mode");
    });

    it("should include project.useBuiltinPreset tool", () => {
      const tool = TOOLS.find((t) => t.name === "project.useBuiltinPreset");
      expect(tool).toBeDefined();
      expect(tool?.inputSchema.required).toContain("presetId");
    });
  });

  describe("HTTP Server Endpoints", () => {
    let server: Server;
    const TEST_PORT = 3999;

    beforeAll(async () => {
      // Suppress console.log during server startup
      const originalLog = console.log;
      console.log = vi.fn();
      server = await createMCPServer({ port: TEST_PORT, forceStandalone: true });
      console.log = originalLog;

      // Wait for server to be ready
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    afterAll(async () => {
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
      });
    });

    describe("GET /health", () => {
      it("should return health status with tool list", async () => {
        const { status, data } = await makeRequest(TEST_PORT, "GET", "/health");

        expect(status).toBe(200);
        expect(data).toMatchObject({
          status: "ok",
          service: "tekton-mcp",
          mode: "standalone",
        });
        expect((data as { tools: string[] }).tools).toContain("archetype.list");
        expect((data as { tools: string[] }).tools).toContain("project.detectStructure");
        expect((data as { tools: string[] }).tools).toContain("preset.list");
        expect((data as { features: { customPresets: boolean } }).features.customPresets).toBe(false);
      });
    });

    describe("GET /tools", () => {
      it("should return list of all available tools", async () => {
        const { status, data } = await makeRequest(TEST_PORT, "GET", "/tools");

        expect(status).toBe(200);
        expect((data as { tools: unknown[] }).tools).toHaveLength(19);
      });
    });

    describe("OPTIONS (CORS)", () => {
      it("should handle CORS preflight requests", async () => {
        const response = await fetch(`http://localhost:${TEST_PORT}/tools`, {
          method: "OPTIONS",
        });

        expect(response.status).toBe(204);
        expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
        expect(response.headers.get("Access-Control-Allow-Methods")).toContain("POST");
      });
    });

    describe("POST /tools/:toolName", () => {
      it("should execute archetype.list tool", async () => {
        const { status, data } = await makeRequest(
          TEST_PORT,
          "POST",
          "/tools/archetype.list",
          {}
        );

        expect(status).toBe(200);
        expect((data as { success: boolean }).success).toBe(true);
        expect(Array.isArray((data as { data: unknown[] }).data)).toBe(true);
      });

      it("should execute archetype.get tool with valid hookName", async () => {
        const { status, data } = await makeRequest(
          TEST_PORT,
          "POST",
          "/tools/archetype.get",
          { hookName: "useButton" }
        );

        expect(status).toBe(200);
        expect((data as { success: boolean }).success).toBe(true);
      });

      it("should execute archetype.getPropRules tool", async () => {
        const { status, data } = await makeRequest(
          TEST_PORT,
          "POST",
          "/tools/archetype.getPropRules",
          { hookName: "useButton" }
        );

        expect(status).toBe(200);
      });

      it("should execute archetype.getStateMappings tool", async () => {
        const { status, data } = await makeRequest(
          TEST_PORT,
          "POST",
          "/tools/archetype.getStateMappings",
          { hookName: "useButton" }
        );

        expect(status).toBe(200);
      });

      it("should execute archetype.getVariants tool", async () => {
        const { status, data } = await makeRequest(
          TEST_PORT,
          "POST",
          "/tools/archetype.getVariants",
          { hookName: "useButton" }
        );

        expect(status).toBe(200);
      });

      it("should execute archetype.getStructure tool", async () => {
        const { status, data } = await makeRequest(
          TEST_PORT,
          "POST",
          "/tools/archetype.getStructure",
          { hookName: "useButton" }
        );

        expect(status).toBe(200);
      });

      it("should execute archetype.query tool", async () => {
        const { status, data } = await makeRequest(
          TEST_PORT,
          "POST",
          "/tools/archetype.query",
          { wcagLevel: "AA" }
        );

        expect(status).toBe(200);
        expect((data as { success: boolean }).success).toBe(true);
      });

      it("should execute project.detectStructure tool", async () => {
        const { status, data } = await makeRequest(
          TEST_PORT,
          "POST",
          "/tools/project.detectStructure",
          { projectPath: process.cwd() }
        );

        expect(status).toBe(200);
        expect((data as { success: boolean }).success).toBe(true);
      });

      it("should execute project.getActivePreset tool", async () => {
        // This will fail to connect to API but should handle gracefully
        const { status, data } = await makeRequest(
          TEST_PORT,
          "POST",
          "/tools/project.getActivePreset",
          { projectPath: "/test/path" }
        );

        expect(status).toBe(200);
        // Will return error since API is not running, but should not crash
        expect(data).toBeDefined();
      });

      it("should execute project.setActivePreset tool", async () => {
        // This will fail to connect to API but should handle gracefully
        const { status, data } = await makeRequest(
          TEST_PORT,
          "POST",
          "/tools/project.setActivePreset",
          { presetId: 1, projectPath: "/test/path" }
        );

        expect(status).toBe(200);
        // Will return error since API is not running, but should not crash
        expect(data).toBeDefined();
      });

      it("should handle invalid JSON body", async () => {
        const response = await fetch(`http://localhost:${TEST_PORT}/tools/archetype.list`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{ invalid json }",
        });

        expect(response.status).toBe(500);
        const data = await response.json();
        expect((data as { error: string }).error).toContain("Invalid JSON");
      });

      it("should return 404 for unknown tool", async () => {
        const { status, data } = await makeRequest(
          TEST_PORT,
          "POST",
          "/tools/unknown.tool",
          {}
        );

        expect(status).toBe(404);
        expect((data as { error: string }).error).toContain("not found");
      });
    });

    describe("Unknown routes", () => {
      it("should return 404 for unknown paths", async () => {
        const { status, data } = await makeRequest(
          TEST_PORT,
          "GET",
          "/unknown/path"
        );

        expect(status).toBe(404);
        expect((data as { error: string }).error).toBe("Not found");
      });
    });
  });
});
