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

// Import all preset JSON files
import nextTailwindShadcn from "./presets/next-tailwind-shadcn.json" with { type: "json" };
import nextTailwindRadix from "./presets/next-tailwind-radix.json" with { type: "json" };
import viteTailwindShadcn from "./presets/vite-tailwind-shadcn.json" with { type: "json" };
import nextStyledComponents from "./presets/next-styled-components.json" with { type: "json" };
import saasDashboard from "./presets/saas-dashboard.json" with { type: "json" };
import techStartup from "./presets/tech-startup.json" with { type: "json" };
import premiumEditorial from "./presets/premium-editorial.json" with { type: "json" };

/**
 * Map of preset ID to preset data
 */
const PRESETS: Record<BuiltinPresetId, Preset> = {
  "next-tailwind-shadcn": nextTailwindShadcn as Preset,
  "next-tailwind-radix": nextTailwindRadix as Preset,
  "vite-tailwind-shadcn": viteTailwindShadcn as Preset,
  "next-styled-components": nextStyledComponents as Preset,
  "saas-dashboard": saasDashboard as Preset,
  "tech-startup": techStartup as Preset,
  "premium-editorial": premiumEditorial as Preset,
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
 * @param presetId - The preset ID to retrieve
 * @returns Full preset data or null if not found
 */
export function getBuiltinPreset(presetId: string): Preset | null {
  if (!isValidPresetId(presetId)) {
    return null;
  }
  return PRESETS[presetId as BuiltinPresetId] || null;
}

/**
 * Check if a preset ID is a valid built-in preset
 *
 * @param presetId - The preset ID to validate
 * @returns True if the ID is a valid built-in preset
 */
export function isValidPresetId(presetId: string): boolean {
  return BUILTIN_PRESET_IDS.includes(presetId as BuiltinPresetId);
}
