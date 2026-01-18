import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  saveArchetype,
  loadArchetype,
  listArchetypes,
  deleteArchetype,
  archetypeExists,
} from "../../src/storage/storage.js";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test schema
const TestDataSchema = z.object({
  hookName: z.string(),
  description: z.string().optional(),
  version: z.string(),
});

type TestData = z.infer<typeof TestDataSchema>;

describe("Storage", () => {
  const storagePath = path.join(__dirname, "../../.tekton-test/archetypes");

  const mockData: TestData = {
    hookName: "useButton",
    description: "A test button hook",
    version: "1.0.0",
  };

  beforeEach(async () => {
    // Clean up test directory before each test
    try {
      await fs.rm(storagePath, { recursive: true, force: true });
    } catch {
      // Directory might not exist
    }
  });

  afterEach(async () => {
    // Clean up test directory after each test
    try {
      await fs.rm(storagePath, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe("saveArchetype", () => {
    it("should save archetype data to JSON file", async () => {
      await saveArchetype("useButton", mockData, TestDataSchema, storagePath);

      const filePath = path.join(storagePath, "useButton.json");
      const fileContent = await fs.readFile(filePath, "utf-8");
      const savedData = JSON.parse(fileContent);

      expect(savedData.hookName).toBe("useButton");
      expect(savedData.data.hookName).toBe("useButton");
      expect(savedData.data.version).toBe("1.0.0");
    });

    it("should create directory structure if it does not exist", async () => {
      await saveArchetype("useButton", mockData, TestDataSchema, storagePath);

      const dirExists = await fs
        .access(storagePath)
        .then(() => true)
        .catch(() => false);

      expect(dirExists).toBe(true);
    });

    it("should add updatedAt timestamp on save", async () => {
      const beforeSave = new Date();

      await saveArchetype("useButton", mockData, TestDataSchema, storagePath);

      const filePath = path.join(storagePath, "useButton.json");
      const fileContent = await fs.readFile(filePath, "utf-8");
      const savedData = JSON.parse(fileContent);

      const savedUpdatedAt = new Date(savedData.updatedAt);
      expect(savedUpdatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeSave.getTime(),
      );
    });

    it("should validate data against schema before saving", async () => {
      const invalidData = { invalid: "data" };

      await expect(
        saveArchetype("useButton", invalidData as any, TestDataSchema, storagePath),
      ).rejects.toThrow();
    });

    it("should overwrite existing archetype file", async () => {
      // Save initial version
      await saveArchetype("useButton", mockData, TestDataSchema, storagePath);

      // Save updated version
      const updatedData = {
        ...mockData,
        description: "Updated description",
        version: "2.0.0",
      };
      await saveArchetype("useButton", updatedData, TestDataSchema, storagePath);

      const loaded = await loadArchetype("useButton", TestDataSchema, storagePath);
      expect(loaded.description).toBe("Updated description");
      expect(loaded.version).toBe("2.0.0");
    });
  });

  describe("loadArchetype", () => {
    it("should load archetype data from JSON file", async () => {
      await saveArchetype("useButton", mockData, TestDataSchema, storagePath);

      const loaded = await loadArchetype("useButton", TestDataSchema, storagePath);

      expect(loaded.hookName).toBe("useButton");
      expect(loaded.version).toBe("1.0.0");
    });

    it("should throw error when archetype does not exist", async () => {
      await expect(
        loadArchetype("non-existent", TestDataSchema, storagePath),
      ).rejects.toThrow("Archetype not found: non-existent");
    });

    it("should validate loaded data against schema", async () => {
      // Manually create invalid JSON file
      await fs.mkdir(storagePath, { recursive: true });
      const filePath = path.join(storagePath, "useButton.json");
      await fs.writeFile(
        filePath,
        JSON.stringify({ hookName: "useButton", data: { invalid: "data" } }),
      );

      await expect(
        loadArchetype("useButton", TestDataSchema, storagePath),
      ).rejects.toThrow();
    });
  });

  describe("listArchetypes", () => {
    it("should return empty array when no archetypes exist", async () => {
      const list = await listArchetypes(storagePath);
      expect(list).toEqual([]);
    });

    it("should list all archetype hook names", async () => {
      const data1 = { ...mockData, hookName: "useButton" };
      const data2 = { ...mockData, hookName: "useTextField" };
      const data3 = { ...mockData, hookName: "useModal" };

      await saveArchetype("useButton", data1, TestDataSchema, storagePath);
      await saveArchetype("useTextField", data2, TestDataSchema, storagePath);
      await saveArchetype("useModal", data3, TestDataSchema, storagePath);

      const list = await listArchetypes(storagePath);

      expect(list).toHaveLength(3);
      expect(list.sort()).toEqual(["useButton", "useModal", "useTextField"]);
    });

    it("should ignore non-JSON files", async () => {
      await saveArchetype("useButton", mockData, TestDataSchema, storagePath);

      // Create a non-JSON file
      await fs.writeFile(path.join(storagePath, "README.md"), "# Test");

      const list = await listArchetypes(storagePath);

      expect(list).toHaveLength(1);
      expect(list[0]).toBe("useButton");
    });
  });

  describe("deleteArchetype", () => {
    it("should delete archetype file", async () => {
      await saveArchetype("useButton", mockData, TestDataSchema, storagePath);

      await deleteArchetype("useButton", storagePath);

      const exists = await archetypeExists("useButton", storagePath);
      expect(exists).toBe(false);
    });

    it("should throw error when archetype does not exist", async () => {
      await expect(
        deleteArchetype("non-existent", storagePath),
      ).rejects.toThrow("Archetype not found: non-existent");
    });
  });

  describe("archetypeExists", () => {
    it("should return true when archetype exists", async () => {
      await saveArchetype("useButton", mockData, TestDataSchema, storagePath);

      const exists = await archetypeExists("useButton", storagePath);
      expect(exists).toBe(true);
    });

    it("should return false when archetype does not exist", async () => {
      const exists = await archetypeExists("non-existent", storagePath);
      expect(exists).toBe(false);
    });
  });

  describe("Error handling", () => {
    it("should re-throw non-ENOENT errors on delete", async () => {
      // Create a directory instead of a file with the hook name
      const hookDir = path.join(storagePath, "useDirectory.json");
      await fs.mkdir(hookDir, { recursive: true });

      // Trying to unlink a directory should throw EISDIR or EPERM, not ENOENT
      await expect(
        deleteArchetype("useDirectory", storagePath),
      ).rejects.toThrow();
    });
  });

  describe("Edge cases", () => {
    it("should handle special characters in hook name", async () => {
      const hookName = "use-special_hook123";
      const data = { ...mockData, hookName };

      await saveArchetype(hookName, data, TestDataSchema, storagePath);

      const loaded = await loadArchetype(hookName, TestDataSchema, storagePath);
      expect(loaded.hookName).toBe(hookName);
    });

    it("should handle concurrent writes gracefully", async () => {
      const promises = Array.from({ length: 10 }, (_, i) => {
        const data = { ...mockData, hookName: `useHook${i}`, version: `${i}.0.0` };
        return saveArchetype(`useHook${i}`, data, TestDataSchema, storagePath);
      });

      await Promise.all(promises);

      const list = await listArchetypes(storagePath);
      expect(list).toHaveLength(10);
    });
  });
});
