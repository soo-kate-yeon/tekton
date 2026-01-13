import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  loadBrandDNA,
  saveBrandDNA,
  listBrandDNA,
} from "../../src/storage/storage.js";
import type { BrandDNA } from "../../src/brand-dna/schema.js";
import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Storage", () => {
  const testProjectId = "test-project";
  const testBrandId = "test-brand-001";
  const storagePath = path.join(__dirname, "../../.tekton-test/brand-dna");

  const mockBrandDNA: BrandDNA = {
    id: testBrandId,
    name: "Test Brand",
    description: "A test brand for storage testing",
    axes: {
      density: 0.5,
      warmth: 0.6,
      playfulness: 0.3,
      sophistication: 0.7,
      energy: 0.4,
    },
    version: "1.0.0",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
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

  describe("saveBrandDNA", () => {
    it("should save brand DNA to JSON file", async () => {
      await saveBrandDNA(testProjectId, testBrandId, mockBrandDNA, storagePath);

      const filePath = path.join(
        storagePath,
        testProjectId,
        `${testBrandId}.json`,
      );
      const fileContent = await fs.readFile(filePath, "utf-8");
      const savedData = JSON.parse(fileContent);

      expect(savedData.id).toBe(testBrandId);
      expect(savedData.name).toBe("Test Brand");
      expect(savedData.axes.density).toBe(0.5);
    });

    it("should create directory structure if it does not exist", async () => {
      await saveBrandDNA(testProjectId, testBrandId, mockBrandDNA, storagePath);

      const projectDir = path.join(storagePath, testProjectId);
      const dirExists = await fs
        .access(projectDir)
        .then(() => true)
        .catch(() => false);

      expect(dirExists).toBe(true);
    });

    it("should update updatedAt timestamp on save", async () => {
      const beforeSave = new Date();

      await saveBrandDNA(testProjectId, testBrandId, mockBrandDNA, storagePath);

      const filePath = path.join(
        storagePath,
        testProjectId,
        `${testBrandId}.json`,
      );
      const fileContent = await fs.readFile(filePath, "utf-8");
      const savedData = JSON.parse(fileContent);

      const savedUpdatedAt = new Date(savedData.updatedAt);
      expect(savedUpdatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeSave.getTime(),
      );
    });

    it("should overwrite existing brand DNA file", async () => {
      // Save initial version
      await saveBrandDNA(testProjectId, testBrandId, mockBrandDNA, storagePath);

      // Save updated version
      const updatedBrandDNA = {
        ...mockBrandDNA,
        name: "Updated Test Brand",
        axes: { ...mockBrandDNA.axes, density: 0.8 },
      };
      await saveBrandDNA(
        testProjectId,
        testBrandId,
        updatedBrandDNA,
        storagePath,
      );

      const loaded = await loadBrandDNA(
        testProjectId,
        testBrandId,
        storagePath,
      );
      expect(loaded.name).toBe("Updated Test Brand");
      expect(loaded.axes.density).toBe(0.8);
    });

    it("should preserve createdAt timestamp when overwriting", async () => {
      await saveBrandDNA(testProjectId, testBrandId, mockBrandDNA, storagePath);

      const updatedBrandDNA = {
        ...mockBrandDNA,
        name: "Updated Test Brand",
      };
      await saveBrandDNA(
        testProjectId,
        testBrandId,
        updatedBrandDNA,
        storagePath,
      );

      const loaded = await loadBrandDNA(
        testProjectId,
        testBrandId,
        storagePath,
      );
      expect(new Date(loaded.createdAt).toISOString()).toBe(
        mockBrandDNA.createdAt.toISOString(),
      );
    });
  });

  describe("loadBrandDNA", () => {
    it("should load brand DNA from JSON file", async () => {
      await saveBrandDNA(testProjectId, testBrandId, mockBrandDNA, storagePath);

      const loaded = await loadBrandDNA(
        testProjectId,
        testBrandId,
        storagePath,
      );

      expect(loaded.id).toBe(testBrandId);
      expect(loaded.name).toBe("Test Brand");
      expect(loaded.axes.density).toBe(0.5);
    });

    it("should parse date strings to Date objects", async () => {
      await saveBrandDNA(testProjectId, testBrandId, mockBrandDNA, storagePath);

      const loaded = await loadBrandDNA(
        testProjectId,
        testBrandId,
        storagePath,
      );

      expect(loaded.createdAt).toBeInstanceOf(Date);
      expect(loaded.updatedAt).toBeInstanceOf(Date);
    });

    it("should throw error when brand DNA does not exist", async () => {
      await expect(
        loadBrandDNA(testProjectId, "non-existent-brand", storagePath),
      ).rejects.toThrow();
    });

    it("should validate loaded data against schema", async () => {
      // Manually create invalid JSON file
      const projectDir = path.join(storagePath, testProjectId);
      await fs.mkdir(projectDir, { recursive: true });
      const filePath = path.join(projectDir, `${testBrandId}.json`);
      await fs.writeFile(filePath, JSON.stringify({ invalid: "data" }));

      await expect(
        loadBrandDNA(testProjectId, testBrandId, storagePath),
      ).rejects.toThrow();
    });
  });

  describe("listBrandDNA", () => {
    it("should return empty array when no brand DNAs exist", async () => {
      const list = await listBrandDNA(testProjectId, storagePath);
      expect(list).toEqual([]);
    });

    it("should list all brand DNAs for a project", async () => {
      const brand1 = { ...mockBrandDNA, id: "brand-001", name: "Brand 1" };
      const brand2 = { ...mockBrandDNA, id: "brand-002", name: "Brand 2" };
      const brand3 = { ...mockBrandDNA, id: "brand-003", name: "Brand 3" };

      await saveBrandDNA(testProjectId, "brand-001", brand1, storagePath);
      await saveBrandDNA(testProjectId, "brand-002", brand2, storagePath);
      await saveBrandDNA(testProjectId, "brand-003", brand3, storagePath);

      const list = await listBrandDNA(testProjectId, storagePath);

      expect(list).toHaveLength(3);
      expect(list.map((b) => b.id).sort()).toEqual([
        "brand-001",
        "brand-002",
        "brand-003",
      ]);
    });

    it("should only list brands from specified project", async () => {
      const brand1 = { ...mockBrandDNA, id: "brand-001" };
      const brand2 = { ...mockBrandDNA, id: "brand-002" };

      await saveBrandDNA("project-1", "brand-001", brand1, storagePath);
      await saveBrandDNA("project-2", "brand-002", brand2, storagePath);

      const list1 = await listBrandDNA("project-1", storagePath);
      const list2 = await listBrandDNA("project-2", storagePath);

      expect(list1).toHaveLength(1);
      expect(list1[0].id).toBe("brand-001");
      expect(list2).toHaveLength(1);
      expect(list2[0].id).toBe("brand-002");
    });

    it("should ignore non-JSON files", async () => {
      await saveBrandDNA(testProjectId, testBrandId, mockBrandDNA, storagePath);

      // Create a non-JSON file
      const projectDir = path.join(storagePath, testProjectId);
      await fs.writeFile(path.join(projectDir, "README.md"), "# Test");

      const list = await listBrandDNA(testProjectId, storagePath);

      expect(list).toHaveLength(1);
      expect(list[0].id).toBe(testBrandId);
    });

    it("should validate all loaded brand DNAs", async () => {
      const brand1 = { ...mockBrandDNA, id: "brand-001" };
      await saveBrandDNA(testProjectId, "brand-001", brand1, storagePath);

      // Manually create invalid JSON file
      const projectDir = path.join(storagePath, testProjectId);
      const invalidPath = path.join(projectDir, "brand-002.json");
      await fs.writeFile(invalidPath, JSON.stringify({ invalid: "data" }));

      // Should skip invalid files or throw error
      const list = await listBrandDNA(testProjectId, storagePath);
      expect(list.every((b) => b.id && b.name && b.axes)).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should handle special characters in project ID", async () => {
      const specialProjectId = "project-with-special-chars_123";
      await saveBrandDNA(
        specialProjectId,
        testBrandId,
        mockBrandDNA,
        storagePath,
      );

      const loaded = await loadBrandDNA(
        specialProjectId,
        testBrandId,
        storagePath,
      );
      expect(loaded.id).toBe(testBrandId);
    });

    it("should handle concurrent writes gracefully", async () => {
      const promises = Array.from({ length: 10 }, (_, i) => {
        const brand = { ...mockBrandDNA, id: `brand-${i}`, name: `Brand ${i}` };
        return saveBrandDNA(testProjectId, `brand-${i}`, brand, storagePath);
      });

      await Promise.all(promises);

      const list = await listBrandDNA(testProjectId, storagePath);
      expect(list).toHaveLength(10);
    });
  });
});
