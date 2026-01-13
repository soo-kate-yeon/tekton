import type { BrandDNA } from "../brand-dna/schema.js";

/**
 * Axis interpretation result types
 */
export interface DensityInterpretation {
  spacing: "generous" | "comfortable" | "compact";
  size: "large" | "medium" | "small";
}

export interface WarmthInterpretation {
  temperature: "cool" | "neutral" | "warm";
}

export interface PlayfulnessInterpretation {
  corners: "sharp" | "moderate" | "round";
  animation: "subtle" | "standard" | "playful";
}

export interface SophisticationInterpretation {
  style: "casual" | "balanced" | "elegant";
  detail: "minimal" | "moderate" | "refined";
}

export interface EnergyInterpretation {
  intensity: "low" | "medium" | "high";
  contrast: "muted" | "balanced" | "vibrant";
}

export type AxisInterpretation =
  | DensityInterpretation
  | WarmthInterpretation
  | PlayfulnessInterpretation
  | SophisticationInterpretation
  | EnergyInterpretation;

export interface BrandDNAInterpretation {
  density: DensityInterpretation;
  warmth: WarmthInterpretation;
  playfulness: PlayfulnessInterpretation;
  sophistication: SophisticationInterpretation;
  energy: EnergyInterpretation;
}

/**
 * Axis name type
 */
export type AxisName =
  | "density"
  | "warmth"
  | "playfulness"
  | "sophistication"
  | "energy";

/**
 * Interpret a single axis value to design token characteristics
 *
 * @param axisName - Name of the axis to interpret
 * @param value - Axis value between 0 and 1
 * @returns Interpretation object with design token characteristics
 * @throws Error if axis name is invalid or value is out of range
 */
export function interpretAxis(
  axisName: AxisName,
  value: number,
): AxisInterpretation {
  // Validate value range
  if (value < 0 || value > 1) {
    throw new Error("Axis value must be between 0 and 1");
  }

  // Determine range: low (0-0.3), medium (0.3-0.7), high (0.7-1)
  const isLow = value < 0.3;
  const isMedium = value >= 0.3 && value < 0.7;
  // isHigh is implicit when neither isLow nor isMedium

  switch (axisName) {
    case "density":
      if (isLow) {
        return { spacing: "generous", size: "large" };
      } else if (isMedium) {
        return { spacing: "comfortable", size: "medium" };
      } else {
        return { spacing: "compact", size: "small" };
      }

    case "warmth":
      if (isLow) {
        return { temperature: "cool" };
      } else if (isMedium) {
        return { temperature: "neutral" };
      } else {
        return { temperature: "warm" };
      }

    case "playfulness":
      if (isLow) {
        return { corners: "sharp", animation: "subtle" };
      } else if (isMedium) {
        return { corners: "moderate", animation: "standard" };
      } else {
        return { corners: "round", animation: "playful" };
      }

    case "sophistication":
      if (isLow) {
        return { style: "casual", detail: "minimal" };
      } else if (isMedium) {
        return { style: "balanced", detail: "moderate" };
      } else {
        return { style: "elegant", detail: "refined" };
      }

    case "energy":
      if (isLow) {
        return { intensity: "low", contrast: "muted" };
      } else if (isMedium) {
        return { intensity: "medium", contrast: "balanced" };
      } else {
        return { intensity: "high", contrast: "vibrant" };
      }

    default:
      throw new Error(`Unknown axis: ${axisName}`);
  }
}

/**
 * Interpret all axes in a Brand DNA object
 *
 * @param brandDNA - Complete Brand DNA object
 * @returns Object containing interpretations for all five axes
 */
export function interpretBrandDNA(brandDNA: BrandDNA): BrandDNAInterpretation {
  return {
    density: interpretAxis(
      "density",
      brandDNA.axes.density,
    ) as DensityInterpretation,
    warmth: interpretAxis(
      "warmth",
      brandDNA.axes.warmth,
    ) as WarmthInterpretation,
    playfulness: interpretAxis(
      "playfulness",
      brandDNA.axes.playfulness,
    ) as PlayfulnessInterpretation,
    sophistication: interpretAxis(
      "sophistication",
      brandDNA.axes.sophistication,
    ) as SophisticationInterpretation,
    energy: interpretAxis(
      "energy",
      brandDNA.axes.energy,
    ) as EnergyInterpretation,
  };
}
