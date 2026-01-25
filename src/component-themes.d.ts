import type { OKLCHColor, ComponentTheme } from './schemas';
/**
 * Button component theme
 * States: default, hover, active, disabled
 */
export declare function buttonTheme(baseColor: OKLCHColor): ComponentTheme;
/**
 * Input component theme
 * States: default, focus, error, disabled
 */
export declare function inputTheme(baseColor: OKLCHColor): ComponentTheme;
/**
 * Card component theme
 * States: background, border, shadow
 */
export declare function cardTheme(baseColor: OKLCHColor): ComponentTheme;
/**
 * Badge component theme
 * States: info, success, warning, error
 */
export declare function badgeTheme(_baseColor: OKLCHColor): ComponentTheme;
/**
 * Alert component theme
 * States: info, success, warning, error
 */
export declare function alertTheme(_baseColor: OKLCHColor): ComponentTheme;
/**
 * Link component theme
 * States: default, hover, visited, active
 */
export declare function linkTheme(_baseColor: OKLCHColor): ComponentTheme;
/**
 * Checkbox component theme
 * States: unchecked, checked, indeterminate
 */
export declare function checkboxTheme(baseColor: OKLCHColor): ComponentTheme;
/**
 * Radio component theme
 * States: unselected, selected
 */
export declare function radioTheme(baseColor: OKLCHColor): ComponentTheme;
/**
 * Generate all 8 MVP component themes
 */
export declare function generateComponentThemes(baseColor: OKLCHColor): ComponentTheme[];
/**
 * Export all themes
 */
export declare const COMPONENT_THEMES: {
    button: typeof buttonTheme;
    input: typeof inputTheme;
    card: typeof cardTheme;
    badge: typeof badgeTheme;
    alert: typeof alertTheme;
    link: typeof linkTheme;
    checkbox: typeof checkboxTheme;
    radio: typeof radioTheme;
};
/**
 * Backward compatibility alias for generateComponentThemes
 * @deprecated Use generateComponentThemes instead
 */
export declare const generateComponentPresets: typeof generateComponentThemes;
//# sourceMappingURL=component-themes.d.ts.map