/**
 * Scale step values and their target lightness adjustments
 * Based on Tailwind-like scale: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
 */
const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
/**
 * Calculate target lightness for a given scale step
 * 500 is the base (no adjustment)
 * Lower numbers = lighter, higher numbers = darker
 */
function calculateTargetLightness(step, baseLightness) {
    if (step === 500) {
        return baseLightness;
    }
    // Lightness mapping for perceptually uniform distribution
    const lightnessMap = {
        50: 0.98,
        100: 0.95,
        200: 0.88,
        300: 0.78,
        400: 0.65,
        500: baseLightness, // Base color
        600: Math.max(baseLightness * 0.85, 0.35),
        700: Math.max(baseLightness * 0.7, 0.25),
        800: Math.max(baseLightness * 0.55, 0.15),
        900: Math.max(baseLightness * 0.4, 0.1),
        950: Math.max(baseLightness * 0.25, 0.05),
    };
    // For steps lighter than base (50-400)
    if (step < 500) {
        return lightnessMap[step];
    }
    // For steps darker than base (600-950)
    return lightnessMap[step];
}
/**
 * Adjust chroma based on lightness to maintain perceptual consistency
 * Very light and very dark colors should have reduced chroma
 */
function adjustChromaForLightness(baseChroma, lightness) {
    // Reduce chroma at extreme lightness values
    if (lightness > 0.9) {
        return baseChroma * 0.5;
    }
    if (lightness < 0.2) {
        return baseChroma * 0.7;
    }
    return baseChroma;
}
/**
 * Generate a complete lightness scale from a base color
 * Creates 11 steps: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
 */
export function generateLightnessScale(baseColor) {
    const scale = {};
    SCALE_STEPS.forEach(step => {
        const targetLightness = calculateTargetLightness(step, baseColor.l);
        const adjustedChroma = adjustChromaForLightness(baseColor.c, targetLightness);
        scale[step.toString()] = {
            l: Math.max(0, Math.min(1, targetLightness)),
            c: Math.max(0, Math.min(0.5, adjustedChroma)),
            h: baseColor.h,
        };
    });
    return scale;
}
/**
 * Generate multiple color scales from a color palette
 */
export function generateColorScales(palette) {
    const scales = {};
    Object.entries(palette).forEach(([name, color]) => {
        scales[name] = generateLightnessScale(color);
    });
    return scales;
}
//# sourceMappingURL=scale-generator.js.map