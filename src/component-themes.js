import { oklchToRgb } from './color-conversion';
import { validateColorPair } from './wcag-validator';
/**
 * White background for WCAG validation
 */
const WHITE_BG = { r: 255, g: 255, b: 255 };
/**
 * Validate WCAG AA compliance for a color against white background
 */
function validateAgainstWhite(color) {
    const rgb = oklchToRgb(color);
    const result = validateColorPair(rgb, WHITE_BG, 'AA');
    return [result];
}
/**
 * Button component theme
 * States: default, hover, active, disabled
 */
export function buttonTheme(baseColor) {
    return {
        name: 'button',
        states: {
            default: baseColor,
            hover: { ...baseColor, l: baseColor.l * 0.9 },
            active: { ...baseColor, l: baseColor.l * 0.8 },
            disabled: { ...baseColor, l: baseColor.l * 1.3, c: baseColor.c * 0.5 },
        },
        accessibility: validateAgainstWhite(baseColor),
    };
}
/**
 * Input component theme
 * States: default, focus, error, disabled
 */
export function inputTheme(baseColor) {
    return {
        name: 'input',
        states: {
            default: baseColor,
            focus: { ...baseColor, c: Math.min(baseColor.c * 1.2, 0.4) },
            error: { l: 0.5, c: 0.15, h: 0 }, // Red
            disabled: { ...baseColor, l: 0.7, c: 0.05 },
        },
        accessibility: validateAgainstWhite(baseColor),
    };
}
/**
 * Card component theme
 * States: background, border, shadow
 */
export function cardTheme(baseColor) {
    return {
        name: 'card',
        states: {
            background: { l: 0.98, c: 0.02, h: baseColor.h },
            border: { l: 0.85, c: 0.05, h: baseColor.h },
            shadow: { l: 0.3, c: 0.02, h: baseColor.h },
        },
        accessibility: validateAgainstWhite(baseColor),
    };
}
/**
 * Badge component theme
 * States: info, success, warning, error
 */
export function badgeTheme(_baseColor) {
    const infoColor = { l: 0.5, c: 0.15, h: 220 }; // Blue
    const successColor = { l: 0.5, c: 0.15, h: 140 }; // Green
    const warningColor = { l: 0.6, c: 0.15, h: 60 }; // Yellow/Orange
    const errorColor = { l: 0.5, c: 0.15, h: 0 }; // Red
    return {
        name: 'badge',
        states: {
            info: infoColor,
            success: successColor,
            warning: warningColor,
            error: errorColor,
        },
        accessibility: [
            ...(validateAgainstWhite(infoColor) || []),
            ...(validateAgainstWhite(successColor) || []),
            ...(validateAgainstWhite(warningColor) || []),
            ...(validateAgainstWhite(errorColor) || []),
        ],
    };
}
/**
 * Alert component theme
 * States: info, success, warning, error
 */
export function alertTheme(_baseColor) {
    const infoColor = { l: 0.9, c: 0.08, h: 220 }; // Light blue
    const successColor = { l: 0.9, c: 0.08, h: 140 }; // Light green
    const warningColor = { l: 0.92, c: 0.08, h: 60 }; // Light yellow
    const errorColor = { l: 0.9, c: 0.08, h: 0 }; // Light red
    return {
        name: 'alert',
        states: {
            info: infoColor,
            success: successColor,
            warning: warningColor,
            error: errorColor,
        },
        accessibility: [
            ...(validateAgainstWhite(infoColor) || []),
            ...(validateAgainstWhite(successColor) || []),
            ...(validateAgainstWhite(warningColor) || []),
            ...(validateAgainstWhite(errorColor) || []),
        ],
    };
}
/**
 * Link component theme
 * States: default, hover, visited, active
 */
export function linkTheme(_baseColor) {
    const defaultColor = { l: 0.4, c: 0.15, h: 220 }; // Blue
    return {
        name: 'link',
        states: {
            default: defaultColor,
            hover: { l: 0.35, c: 0.15, h: 220 },
            visited: { l: 0.4, c: 0.15, h: 280 }, // Purple
            active: { l: 0.3, c: 0.15, h: 220 },
        },
        accessibility: validateAgainstWhite(defaultColor),
    };
}
/**
 * Checkbox component theme
 * States: unchecked, checked, indeterminate
 */
export function checkboxTheme(baseColor) {
    return {
        name: 'checkbox',
        states: {
            unchecked: { l: 0.95, c: 0.02, h: baseColor.h },
            checked: baseColor,
            indeterminate: { ...baseColor, l: baseColor.l * 0.9 },
        },
        accessibility: validateAgainstWhite(baseColor),
    };
}
/**
 * Radio component theme
 * States: unselected, selected
 */
export function radioTheme(baseColor) {
    return {
        name: 'radio',
        states: {
            unselected: { l: 0.95, c: 0.02, h: baseColor.h },
            selected: baseColor,
        },
        accessibility: validateAgainstWhite(baseColor),
    };
}
/**
 * Generate all 8 MVP component themes
 */
export function generateComponentThemes(baseColor) {
    return [
        buttonTheme(baseColor),
        inputTheme(baseColor),
        cardTheme(baseColor),
        badgeTheme(baseColor),
        alertTheme(baseColor),
        linkTheme(baseColor),
        checkboxTheme(baseColor),
        radioTheme(baseColor),
    ];
}
/**
 * Export all themes
 */
export const COMPONENT_THEMES = {
    button: buttonTheme,
    input: inputTheme,
    card: cardTheme,
    badge: badgeTheme,
    alert: alertTheme,
    link: linkTheme,
    checkbox: checkboxTheme,
    radio: radioTheme,
};
/**
 * Backward compatibility alias for generateComponentThemes
 * @deprecated Use generateComponentThemes instead
 */
export const generateComponentPresets = generateComponentThemes;
//# sourceMappingURL=component-themes.js.map