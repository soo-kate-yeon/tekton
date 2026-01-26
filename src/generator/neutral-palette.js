/**
 * Scale steps matching Tailwind convention
 */
const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
/**
 * Light mode lightness mapping
 * SDR-001: Neutral-50 lightness >= 0.95, Neutral-900 lightness <= 0.20
 */
const LIGHT_MODE_LIGHTNESS = {
    50: 0.98, // Background (very light)
    100: 0.95,
    200: 0.88,
    300: 0.78,
    400: 0.65,
    500: 0.5, // Middle gray
    600: 0.4,
    700: 0.3,
    800: 0.22,
    900: 0.15, // Foreground (very dark)
    950: 0.1,
};
/**
 * Dark mode lightness mapping
 * SDR-002: Neutral-900 lightness <= 0.15, Neutral-50 lightness >= 0.95
 * In dark mode, semantics are inverted but scale numbers stay the same
 */
const DARK_MODE_LIGHTNESS = {
    50: 0.98, // Foreground (very light) - inverted semantic
    100: 0.95,
    200: 0.88,
    300: 0.78,
    400: 0.65,
    500: 0.5, // Middle gray
    600: 0.4,
    700: 0.3,
    800: 0.22,
    900: 0.1, // Background (very dark) - inverted semantic
    950: 0.05,
};
/**
 * Generate neutral palette with configurable tinting
 * TASK-001: Light mode neutral palette
 * TASK-002: Dark mode neutral palette
 * TASK-003: Tinting modes
 */
export function generateNeutralPalette(config) {
    const { mode, tinting = 'pure', primaryHue = 0, chromaIntensity = 0.012 } = config;
    const palette = {};
    SCALE_STEPS.forEach(step => {
        const lightness = mode === 'light' ? LIGHT_MODE_LIGHTNESS[step] : DARK_MODE_LIGHTNESS[step];
        let hue = 0;
        let chroma = 0.002; // Minimal chroma for pure neutral
        if (tinting === 'tinted') {
            hue = primaryHue;
            chroma = chromaIntensity;
        }
        else if (tinting === 'custom') {
            hue = primaryHue;
            chroma = chromaIntensity;
        }
        const stepKey = step.toString();
        palette[stepKey] = {
            l: Math.max(0, Math.min(1, lightness)),
            c: Math.max(0, Math.min(0.5, chroma)),
            h: hue,
        };
    });
    return palette;
}
//# sourceMappingURL=neutral-palette.js.map