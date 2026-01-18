/**
 * Standalone Server Integration Tests
 * TDD RED phase: Tests for mode-aware MCP server
 *
 * @module server/__tests__/standalone-server.test
 */

import { describe, it, expect } from "vitest";
import {
  STANDALONE_TOOLS,
  getHealthResponse,
} from "../standalone-tools.js";

describe("Standalone Server Integration", () => {
  describe("STANDALONE_TOOLS", () => {
    it("should include preset.list tool", () => {
      const tool = STANDALONE_TOOLS.find((t) => t.name === "preset.list");
      expect(tool).toBeDefined();
      expect(tool?.description).toContain("built-in presets");
    });

    it("should include preset.get tool", () => {
      const tool = STANDALONE_TOOLS.find((t) => t.name === "preset.get");
      expect(tool).toBeDefined();
      expect(tool?.inputSchema.required).toContain("presetId");
    });

    it("should include project.status tool", () => {
      const tool = STANDALONE_TOOLS.find((t) => t.name === "project.status");
      expect(tool).toBeDefined();
      expect(tool?.description).toContain("connection mode");
    });

    it("should include project.useBuiltinPreset tool", () => {
      const tool = STANDALONE_TOOLS.find((t) => t.name === "project.useBuiltinPreset");
      expect(tool).toBeDefined();
      expect(tool?.inputSchema.required).toContain("presetId");
    });

    it("should have 4 standalone tools", () => {
      const standaloneToolNames = [
        "preset.list",
        "preset.get",
        "project.status",
        "project.useBuiltinPreset",
      ];

      standaloneToolNames.forEach((name) => {
        expect(STANDALONE_TOOLS.find((t) => t.name === name)).toBeDefined();
      });
    });
  });

  describe("getHealthResponse", () => {
    it("should return health response for standalone mode", () => {
      const response = getHealthResponse("standalone", ["preset.list", "preset.get"]);

      expect(response.status).toBe("ok");
      expect(response.service).toBe("tekton-mcp");
      expect(response.mode).toBe("standalone");
      expect(response.tools).toEqual(["preset.list", "preset.get"]);
    });

    it("should return health response for connected mode", () => {
      const response = getHealthResponse("connected", ["preset.list", "project.getActivePreset"]);

      expect(response.status).toBe("ok");
      expect(response.mode).toBe("connected");
    });

    it("should include version", () => {
      const response = getHealthResponse("standalone", []);

      expect(response.version).toBeDefined();
      expect(typeof response.version).toBe("string");
    });

    it("should include features for standalone mode", () => {
      const response = getHealthResponse("standalone", []);

      expect(response.features).toBeDefined();
      expect(response.features.customPresets).toBe(false);
      expect(response.features.cloudSync).toBe(false);
      expect(response.features.analytics).toBe(false);
    });

    it("should include features for connected mode", () => {
      const response = getHealthResponse("connected", []);

      expect(response.features).toBeDefined();
      expect(response.features.customPresets).toBe(true);
      expect(response.features.cloudSync).toBe(true);
      expect(response.features.analytics).toBe(true);
    });
  });
});
