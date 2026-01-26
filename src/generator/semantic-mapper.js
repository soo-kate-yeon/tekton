import { generateNeutralPalette } from './neutral-palette';
/**
 * Generate scale from base color
 */
function generateScale(baseColor) {
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    const scale = {};
    const lightnessMap = {
        50: 0.98,
        100: 0.95,
        200: 0.88,
        300: 0.78,
        400: 0.65,
        500: baseColor.l,
        600: Math.max(baseColor.l * 0.85, 0.35),
        700: Math.max(baseColor.l * 0.7, 0.25),
        800: Math.max(baseColor.l * 0.55, 0.15),
        900: Math.max(baseColor.l * 0.4, 0.1),
        950: Math.max(baseColor.l * 0.25, 0.05),
    };
    steps.forEach(step => {
        scale[step.toString()] = {
            l: lightnessMap[step],
            c: baseColor.c,
            h: baseColor.h,
        };
    });
    return scale;
}
/**
 * Map color palettes to semantic tokens
 * TASK-004: Semantic token mapping for shadcn/ui
 */
export function mapSemanticTokens(config) {
    const { mode, primary, secondary, destructive, accent } = config;
    // Generate neutral palette
    const neutralPalette = generateNeutralPalette({
        mode,
        tinting: 'pure',
    });
    // Generate primary scale
    const primaryScale = generateScale(primary);
    // Light mode mappings
    if (mode === 'light') {
        return {
            background: neutralPalette['50'], // Very light
            foreground: neutralPalette['900'], // Very dark
            card: neutralPalette['50'], // Same as background
            popover: neutralPalette['50'], // Same as background
            primary: primaryScale['500'], // Base primary
            secondary: secondary || {
                // Desaturated primary
                l: primary.l,
                c: primary.c * 0.3,
                h: primary.h,
            },
            muted: neutralPalette['100'], // Subtle background
            accent: accent || primaryScale['400'], // Lighter primary
            destructive: destructive || {
                // Default red
                l: 0.5,
                c: 0.18,
                h: 25,
            },
            border: neutralPalette['200'], // Subtle border
            input: neutralPalette['200'], // Same as border
            ring: primaryScale['500'], // Primary ring
        };
    }
    // Dark mode mappings
    return {
        background: neutralPalette['900'], // Very dark
        foreground: neutralPalette['50'], // Very light
        card: neutralPalette['900'], // Same as background
        popover: neutralPalette['900'], // Same as background
        primary: {
            // Lighter for visibility
            l: Math.min(primary.l + 0.15, 0.75),
            c: primary.c,
            h: primary.h,
        },
        secondary: secondary || {
            // Desaturated primary
            l: primary.l,
            c: primary.c * 0.3,
            h: primary.h,
        },
        muted: neutralPalette['800'], // Subtle background
        accent: accent || {
            // Lighter primary
            l: Math.min(primary.l + 0.2, 0.8),
            c: primary.c,
            h: primary.h,
        },
        destructive: destructive || {
            // Default red (lighter for dark mode)
            l: 0.6,
            c: 0.18,
            h: 25,
        },
        border: neutralPalette['800'], // Subtle border
        input: neutralPalette['800'], // Same as border
        ring: {
            // Lighter ring for visibility
            l: Math.min(primary.l + 0.15, 0.75),
            c: primary.c,
            h: primary.h,
        },
    };
}
//# sourceMappingURL=semantic-mapper.js.map