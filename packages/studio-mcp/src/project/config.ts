/**
 * Config Manager Module
 * Local configuration management for .tekton/config.json
 *
 * @module project/config
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, normalize } from "path";
import {
  TektonConfigSchema,
  type TektonConfig,
  type TektonConfigUpdate,
} from "./config-types.js";

/**
 * Config file name constants
 */
const TEKTON_DIR = ".tekton";
const CONFIG_FILE = "config.json";
const SCHEMA_URL = "https://tekton.design/schemas/config.json";
const CONFIG_VERSION = "1.0.0";

/**
 * Get the path to the config file
 *
 * @param projectPath - Project root directory
 * @returns Full path to .tekton/config.json
 */
export function getConfigPath(projectPath: string): string {
  const normalizedPath = normalize(projectPath);
  return join(normalizedPath, TEKTON_DIR, CONFIG_FILE);
}

/**
 * Get default configuration
 *
 * @returns Default TektonConfig object
 */
export function getDefaultConfig(): TektonConfig {
  return {
    $schema: SCHEMA_URL,
    version: CONFIG_VERSION,
    mode: "standalone",
    project: {
      name: "",
      frameworkType: "unknown",
      detectedAt: new Date().toISOString(),
    },
    preset: {
      activePresetId: null,
      selectedAt: null,
    },
  };
}

/**
 * Read configuration from project directory
 *
 * @param projectPath - Project root directory
 * @returns TektonConfig or null if not found/invalid
 */
export function readConfig(projectPath: string): TektonConfig | null {
  const configPath = getConfigPath(projectPath);

  if (!existsSync(configPath)) {
    return null;
  }

  try {
    const content = readFileSync(configPath, "utf-8");
    const parsed = JSON.parse(content);
    const result = TektonConfigSchema.safeParse(parsed);

    if (result.success) {
      return result.data;
    }

    // Invalid config structure
    return null;
  } catch {
    // JSON parse error or file read error
    return null;
  }
}

/**
 * Write configuration to project directory
 * Creates .tekton directory if it doesn't exist
 *
 * @param projectPath - Project root directory
 * @param config - Configuration to write
 */
export function writeConfig(projectPath: string, config: TektonConfig): void {
  const normalizedPath = normalize(projectPath);
  const tektonDir = join(normalizedPath, TEKTON_DIR);
  const configPath = join(tektonDir, CONFIG_FILE);

  // Create .tekton directory if needed
  if (!existsSync(tektonDir)) {
    mkdirSync(tektonDir, { recursive: true });
  }

  // Write formatted JSON
  writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
}

/**
 * Update configuration with partial values
 * Creates config with defaults if it doesn't exist
 *
 * @param projectPath - Project root directory
 * @param updates - Partial configuration updates
 * @returns Updated full configuration
 */
export function updateConfig(
  projectPath: string,
  updates: TektonConfigUpdate
): TektonConfig {
  // Read existing config or use defaults
  const existingConfig = readConfig(projectPath) || getDefaultConfig();

  // Merge updates into existing config
  const updatedConfig: TektonConfig = {
    ...existingConfig,
    mode: updates.mode ?? existingConfig.mode,
    project: {
      ...existingConfig.project,
      ...(updates.project || {}),
    },
    preset: {
      ...existingConfig.preset,
      ...(updates.preset || {}),
    },
  };

  // Write the updated config
  writeConfig(projectPath, updatedConfig);

  return updatedConfig;
}
