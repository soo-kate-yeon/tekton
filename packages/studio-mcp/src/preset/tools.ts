/**
 * Preset MCP Tools
 * Tool handlers for preset.list and preset.get MCP tools
 *
 * @module preset/tools
 */

import { getBuiltinPresets, getBuiltinPreset, isValidPresetId } from "./builtin.js";
import type { Preset, PresetMeta } from "./types.js";

/**
 * Tool result wrapper (consistent with other tools)
 */
export interface ToolResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Input schema for preset.get tool
 */
export interface PresetGetInput {
  presetId: string;
}

/**
 * List all built-in presets
 * MCP Tool: preset.list
 *
 * @returns List of preset metadata sorted by ID
 */
export async function presetList(): Promise<ToolResult<PresetMeta[]>> {
  try {
    const presets = getBuiltinPresets();

    // Sort by ID for consistent ordering
    const sortedPresets = [...presets].sort((a, b) => a.id.localeCompare(b.id));

    return {
      success: true,
      data: sortedPresets,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list presets",
    };
  }
}

/**
 * Get complete preset data by ID
 * MCP Tool: preset.get
 *
 * @param input - Contains presetId to retrieve
 * @returns Full preset data or error
 */
export async function presetGet(input: PresetGetInput): Promise<ToolResult<Preset>> {
  try {
    const { presetId } = input;

    if (!presetId || presetId.trim() === "") {
      return {
        success: false,
        error: "Preset ID is required",
      };
    }

    if (!isValidPresetId(presetId)) {
      return {
        success: false,
        error: `Preset not found: ${presetId}`,
      };
    }

    const preset = getBuiltinPreset(presetId);

    if (!preset) {
      return {
        success: false,
        error: `Preset not found: ${presetId}`,
      };
    }

    return {
      success: true,
      data: preset,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get preset",
    };
  }
}
