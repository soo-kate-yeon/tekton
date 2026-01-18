import * as fs from "fs/promises";
import * as path from "path";
import type { ZodSchema } from "zod";

/**
 * Default storage base path for archetypes
 */
const DEFAULT_STORAGE_PATH = ".tekton/archetypes";

/**
 * Get the full file path for an archetype file
 */
function getArchetypeFilePath(hookName: string, basePath?: string): string {
  const storagePath = basePath || DEFAULT_STORAGE_PATH;
  return path.join(storagePath, `${hookName}.json`);
}

/**
 * Save archetype data to JSON file
 *
 * @param hookName - Hook name identifier
 * @param data - Archetype data object to save
 * @param schema - Zod schema for validation
 * @param basePath - Optional base path for storage
 * @throws Error if validation or save operation fails
 */
export async function saveArchetype<T>(
  hookName: string,
  data: T,
  schema: ZodSchema<T>,
  basePath?: string,
): Promise<void> {
  // Validate data against schema
  schema.parse(data);

  const filePath = getArchetypeFilePath(hookName, basePath);
  const storagePath = basePath || DEFAULT_STORAGE_PATH;

  // Create directory structure if it doesn't exist
  await fs.mkdir(storagePath, { recursive: true });

  // Add metadata
  const dataToSave = {
    hookName,
    data,
    updatedAt: new Date().toISOString(),
  };

  // Write to file with pretty formatting
  const jsonContent = JSON.stringify(dataToSave, null, 2);
  await fs.writeFile(filePath, jsonContent, "utf-8");
}

/**
 * Load archetype data from JSON file
 *
 * @param hookName - Hook name identifier
 * @param schema - Zod schema for validation
 * @param basePath - Optional base path for storage
 * @returns Validated archetype data
 * @throws Error if file does not exist or validation fails
 */
export async function loadArchetype<T>(
  hookName: string,
  schema: ZodSchema<T>,
  basePath?: string,
): Promise<T> {
  const filePath = getArchetypeFilePath(hookName, basePath);

  try {
    // Read file content
    const fileContent = await fs.readFile(filePath, "utf-8");
    const rawData = JSON.parse(fileContent);

    // Validate and parse with Zod schema
    const data = schema.parse(rawData.data);

    return data;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(`Archetype not found: ${hookName}`);
    }
    throw error;
  }
}

/**
 * List all archetype files in storage
 *
 * @param basePath - Optional base path for storage
 * @returns Array of hook names with stored archetypes
 */
export async function listArchetypes(basePath?: string): Promise<string[]> {
  const storagePath = basePath || DEFAULT_STORAGE_PATH;

  try {
    // Check if directory exists
    await fs.access(storagePath);
  } catch {
    // Directory doesn't exist, return empty array
    return [];
  }

  try {
    // Read all files in directory
    const files = await fs.readdir(storagePath);

    // Filter for JSON files and extract hook names
    return files
      .filter((file) => file.endsWith(".json"))
      .map((file) => path.basename(file, ".json"));
  } catch {
    return [];
  }
}

/**
 * Delete archetype data from storage
 *
 * @param hookName - Hook name identifier
 * @param basePath - Optional base path for storage
 * @throws Error if file does not exist
 */
export async function deleteArchetype(
  hookName: string,
  basePath?: string,
): Promise<void> {
  const filePath = getArchetypeFilePath(hookName, basePath);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(`Archetype not found: ${hookName}`);
    }
    throw error;
  }
}

/**
 * Check if archetype exists in storage
 *
 * @param hookName - Hook name identifier
 * @param basePath - Optional base path for storage
 * @returns True if archetype exists
 */
export async function archetypeExists(
  hookName: string,
  basePath?: string,
): Promise<boolean> {
  const filePath = getArchetypeFilePath(hookName, basePath);

  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
