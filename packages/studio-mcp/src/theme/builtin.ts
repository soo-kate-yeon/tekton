/**
 * Builtin Preset Loader
 * Loads bundled preset JSON files for standalone MCP operation
 *
 * @module preset/builtin
 */

import {
  type Preset,
  type PresetMeta,
  BUILTIN_PRESET_IDS,
  type BuiltinPresetId,
} from "./types.js";

// Import all theme JSON files
import saasModern from "./themes/saas-modern.json" with { type: "json" };
import dynamicFitness from "./themes/dynamic-fitness.json" with { type: "json" };
import premiumEditorial from "./themes/premium-editorial.json" with { type: "json" };
import mediaStreaming from "./themes/media-streaming.json" with { type: "json" };
import calmWellness from "./themes/calm-wellness.json" with { type: "json" };
import koreanFintech from "./themes/korean-fintech.json" with { type: "json" };
import warmHumanist from "./themes/warm-humanist.json" with { type: "json" };

/**
 * Map of preset ID to preset data
 */
const PRESETS: Record<BuiltinPresetId, Preset> = {
  "saas-modern": saasModern as Preset,
  "dynamic-fitness": dynamicFitness as Preset,
  "premium-editorial": premiumEditorial as Preset,
  "media-streaming": mediaStreaming as Preset,
  "calm-wellness": calmWellness as Preset,
  "korean-fintech": koreanFintech as Preset,
  "warm-humanist": warmHumanist as Preset,
};

/**
 * Get metadata for all built-in presets
 * Returns lightweight preset metadata without full AI context
 *
 * @returns Array of preset metadata
 */
export function getBuiltinPresets(): PresetMeta[] {
  return BUILTIN_PRESET_IDS.map((id) => {
    const preset = PRESETS[id];
    return {
      id: preset.id,
      name: preset.name,
      description: preset.description,
      stackInfo: preset.stackInfo,
      brandTone: preset.brandTone,
    };
  });
}

/**
 * Get complete preset data by ID
 *
 * @param themeId - The preset ID to retrieve
 * @returns Full preset data or null if not found
 */
export function getBuiltinPreset(themeId: string): Preset | null {
  if (!isValidPresetId(themeId)) {
    return null;
  }
  return PRESETS[themeId as BuiltinPresetId] || null;
}

/**
 * Check if a preset ID is a valid built-in preset
 *
 * @param themeId - The preset ID to validate
 * @returns True if the ID is a valid built-in preset
 */
export function isValidPresetId(themeId: string): boolean {
  return BUILTIN_PRESET_IDS.includes(themeId as BuiltinPresetId);
}
