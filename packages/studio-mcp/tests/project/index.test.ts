/**
 * Project Module Index Tests
 * Tests for project module exports
 *
 * @module tests/project/index.test
 */

import { describe, it, expect } from "vitest";
import {
  ProjectTools,
  projectTools,
  DetectStructureInputSchema,
  GetActivePresetInputSchema,
  SetActivePresetInputSchema,
  FrameworkTypeSchema,
  ProjectStructureSchema,
  ActivePresetSchema,
} from "../../src/project/index.js";

describe("Project Module Exports", () => {
  describe("Class exports", () => {
    it("should export ProjectTools class", () => {
      expect(ProjectTools).toBeDefined();
      expect(typeof ProjectTools).toBe("function");
    });

    it("should export projectTools singleton instance", () => {
      expect(projectTools).toBeDefined();
      expect(projectTools).toBeInstanceOf(ProjectTools);
    });
  });

  describe("Schema exports", () => {
    it("should export DetectStructureInputSchema", () => {
      expect(DetectStructureInputSchema).toBeDefined();
      expect(DetectStructureInputSchema.parse).toBeDefined();
    });

    it("should export GetActivePresetInputSchema", () => {
      expect(GetActivePresetInputSchema).toBeDefined();
      expect(GetActivePresetInputSchema.parse).toBeDefined();
    });

    it("should export SetActivePresetInputSchema", () => {
      expect(SetActivePresetInputSchema).toBeDefined();
      expect(SetActivePresetInputSchema.parse).toBeDefined();
    });

    it("should export FrameworkTypeSchema", () => {
      expect(FrameworkTypeSchema).toBeDefined();
      expect(FrameworkTypeSchema.parse).toBeDefined();
    });

    it("should export ProjectStructureSchema", () => {
      expect(ProjectStructureSchema).toBeDefined();
      expect(ProjectStructureSchema.parse).toBeDefined();
    });

    it("should export ActivePresetSchema", () => {
      expect(ActivePresetSchema).toBeDefined();
      expect(ActivePresetSchema.parse).toBeDefined();
    });
  });

  describe("Schema validation", () => {
    it("should validate DetectStructureInput correctly", () => {
      const valid = { projectPath: "/some/path" };
      const result = DetectStructureInputSchema.safeParse(valid);
      expect(result.success).toBe(true);

      const invalid = { projectPath: "" };
      const invalidResult = DetectStructureInputSchema.safeParse(invalid);
      expect(invalidResult.success).toBe(false);
    });

    it("should validate FrameworkType correctly", () => {
      expect(FrameworkTypeSchema.parse("next-app")).toBe("next-app");
      expect(FrameworkTypeSchema.parse("next-pages")).toBe("next-pages");
      expect(FrameworkTypeSchema.parse("vite")).toBe("vite");
      expect(FrameworkTypeSchema.parse("unknown")).toBe("unknown");

      expect(() => FrameworkTypeSchema.parse("invalid")).toThrow();
    });

    it("should validate SetActivePresetInput correctly", () => {
      const valid = { presetId: 1 };
      const result = SetActivePresetInputSchema.safeParse(valid);
      expect(result.success).toBe(true);

      const withPath = { presetId: 1, projectPath: "/some/path" };
      const withPathResult = SetActivePresetInputSchema.safeParse(withPath);
      expect(withPathResult.success).toBe(true);

      const invalid = { presetId: -1 };
      const invalidResult = SetActivePresetInputSchema.safeParse(invalid);
      expect(invalidResult.success).toBe(false);
    });
  });
});
