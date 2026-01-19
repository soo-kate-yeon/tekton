/**
 * Standalone Project Tools
 * Tool handlers for project.status and project.useBuiltinPreset MCP tools
 *
 * @module project/standalone
 */

import { readConfig, updateConfig, getDefaultConfig } from "./config.js";
import type { TektonConfig, ConnectionMode } from "./config-types.js";
import { getBuiltinPreset, isValidPresetId } from '../theme/builtin.js';
import type { PresetMeta } from '../theme/types.js';
import { ProjectTools } from "./tools.js";

/**
 * Tool result wrapper (consistent with other tools)
 */
export interface ToolResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Input schema for project.status tool
 */
export interface ProjectStatusInput {
  projectPath?: string;
}

/**
 * Input schema for project.useBuiltinPreset tool
 */
export interface UseBuiltinPresetInput {
  themeId: string;
  projectPath?: string;
}

/**
 * Project status response
 */
export interface ProjectStatusResponse {
  mode: ConnectionMode;
  project: {
    name: string;
    frameworkType: string;
    detectedAt: string;
  } | null;
  activeTheme: {
    id: string;
    name: string;
    brandTone: string;
    selectedAt: string;
  } | null;
}

/**
 * Use builtin preset response
 */
export interface UseBuiltinPresetResponse {
  preset: PresetMeta;
  config: TektonConfig;
}

// Singleton project tools instance for framework detection
const projectTools = new ProjectTools();

/**
 * Get project status including mode and active preset
 * MCP Tool: project.status
 *
 * @param input - Optional projectPath
 * @returns Project status with mode, framework info, and active preset
 */
export async function projectStatus(
  input: ProjectStatusInput
): Promise<ToolResult<ProjectStatusResponse>> {
  try {
    const projectPath = input.projectPath || process.cwd();

    // Read existing config or use defaults
    let config = readConfig(projectPath);

    // If no config exists, detect framework and create default status
    if (!config) {
      config = getDefaultConfig();

      // Try to detect framework
      const detection = await projectTools.detectStructure({ projectPath });
      if (detection.success && detection.data) {
        config.project.frameworkType = detection.data.frameworkType;
        config.project.detectedAt = new Date().toISOString();
      }
    }

    // Build response
    const response: ProjectStatusResponse = {
      mode: config.mode,
      project: {
        name: config.project.name,
        frameworkType: config.project.frameworkType,
        detectedAt: config.project.detectedAt,
      },
      activeTheme: null,
    };

    // If there's an active preset, include its info
    if (config.preset.activePresetId) {
      const preset = getBuiltinPreset(config.preset.activePresetId);
      if (preset) {
        response.activeTheme = {
          id: preset.id,
          name: preset.name,
          brandTone: preset.brandTone,
          selectedAt: config.preset.selectedAt || new Date().toISOString(),
        };
      }
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get project status",
    };
  }
}

/**
 * Select a built-in preset as active for the project
 * MCP Tool: project.useBuiltinPreset
 *
 * @param input - Contains themeId and optional projectPath
 * @returns Confirmation with preset info
 */
export async function useBuiltinPreset(
  input: UseBuiltinPresetInput
): Promise<ToolResult<UseBuiltinPresetResponse>> {
  try {
    const { themeId, projectPath = process.cwd() } = input;

    // Validate preset ID
    if (!themeId || themeId.trim() === "") {
      return {
        success: false,
        error: "Preset ID is required",
      };
    }

    if (!isValidPresetId(themeId)) {
      return {
        success: false,
        error: `Invalid preset ID: ${themeId}. Use preset.list to see available presets.`,
      };
    }

    // Get preset data
    const preset = getBuiltinPreset(themeId);
    if (!preset) {
      return {
        success: false,
        error: `Preset not found: ${themeId}`,
      };
    }

    // Update config with new preset selection
    const now = new Date().toISOString();
    const updatedConfig = updateConfig(projectPath, {
      preset: {
        activePresetId: themeId,
        selectedAt: now,
      },
    });

    // Build preset metadata for response
    const presetMeta: PresetMeta = {
      id: preset.id,
      name: preset.name,
      description: preset.description,
      stackInfo: preset.stackInfo,
      brandTone: preset.brandTone,
    };

    return {
      success: true,
      data: {
        preset: presetMeta,
        config: updatedConfig,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to set preset",
    };
  }
}
