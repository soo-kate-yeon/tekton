import { z } from 'zod';
/**
 * OKLCH Color Schema
 * L: Lightness (0-1)
 * C: Chroma (0-0.4 typical range)
 * H: Hue (0-360 degrees)
 */
export declare const OKLCHColorSchema: z.ZodObject<{
    l: z.ZodNumber;
    c: z.ZodNumber;
    h: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    l: number;
    c: number;
    h: number;
}, {
    l: number;
    c: number;
    h: number;
}>;
export type OKLCHColor = z.infer<typeof OKLCHColorSchema>;
/**
 * RGB Color Schema
 * R, G, B: 0-255
 */
export declare const RGBColorSchema: z.ZodObject<{
    r: z.ZodNumber;
    g: z.ZodNumber;
    b: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    r: number;
    g: number;
    b: number;
}, {
    r: number;
    g: number;
    b: number;
}>;
export type RGBColor = z.infer<typeof RGBColorSchema>;
export declare const ColorScaleSchema: z.ZodRecord<z.ZodEnum<["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"]>, z.ZodObject<{
    l: z.ZodNumber;
    c: z.ZodNumber;
    h: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    l: number;
    c: number;
    h: number;
}, {
    l: number;
    c: number;
    h: number;
}>>;
export type ColorScale = z.infer<typeof ColorScaleSchema>;
/**
 * Token Definition Schema
 * Represents a design token with its base value and scale
 */
export declare const TokenDefinitionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    value: z.ZodObject<{
        l: z.ZodNumber;
        c: z.ZodNumber;
        h: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        l: number;
        c: number;
        h: number;
    }, {
        l: number;
        c: number;
        h: number;
    }>;
    scale: z.ZodOptional<z.ZodRecord<z.ZodEnum<["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"]>, z.ZodObject<{
        l: z.ZodNumber;
        c: z.ZodNumber;
        h: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        l: number;
        c: number;
        h: number;
    }, {
        l: number;
        c: number;
        h: number;
    }>>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    value: {
        l: number;
        c: number;
        h: number;
    };
    id: string;
    name: string;
    scale?: Partial<Record<"50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "950", {
        l: number;
        c: number;
        h: number;
    }>> | undefined;
    metadata?: Record<string, unknown> | undefined;
}, {
    value: {
        l: number;
        c: number;
        h: number;
    };
    id: string;
    name: string;
    scale?: Partial<Record<"50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | "950", {
        l: number;
        c: number;
        h: number;
    }>> | undefined;
    metadata?: Record<string, unknown> | undefined;
}>;
export type TokenDefinition = z.infer<typeof TokenDefinitionSchema>;
/**
 * Accessibility Check Result Schema
 * WCAG contrast compliance validation result
 */
export declare const AccessibilityCheckSchema: z.ZodObject<{
    contrastRatio: z.ZodNumber;
    wcagLevel: z.ZodEnum<["AA", "AAA"]>;
    passed: z.ZodBoolean;
    foreground: z.ZodOptional<z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        r: number;
        g: number;
        b: number;
    }, {
        r: number;
        g: number;
        b: number;
    }>>;
    background: z.ZodOptional<z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        r: number;
        g: number;
        b: number;
    }, {
        r: number;
        g: number;
        b: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    contrastRatio: number;
    wcagLevel: "AA" | "AAA";
    passed: boolean;
    foreground?: {
        r: number;
        g: number;
        b: number;
    } | undefined;
    background?: {
        r: number;
        g: number;
        b: number;
    } | undefined;
}, {
    contrastRatio: number;
    wcagLevel: "AA" | "AAA";
    passed: boolean;
    foreground?: {
        r: number;
        g: number;
        b: number;
    } | undefined;
    background?: {
        r: number;
        g: number;
        b: number;
    } | undefined;
}>;
export type AccessibilityCheck = z.infer<typeof AccessibilityCheckSchema>;
/**
 * Component Theme Schema
 * Defines color tokens for component states
 */
export declare const ComponentThemeSchema: z.ZodObject<{
    name: z.ZodString;
    states: z.ZodRecord<z.ZodString, z.ZodObject<{
        l: z.ZodNumber;
        c: z.ZodNumber;
        h: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        l: number;
        c: number;
        h: number;
    }, {
        l: number;
        c: number;
        h: number;
    }>>;
    accessibility: z.ZodOptional<z.ZodArray<z.ZodObject<{
        contrastRatio: z.ZodNumber;
        wcagLevel: z.ZodEnum<["AA", "AAA"]>;
        passed: z.ZodBoolean;
        foreground: z.ZodOptional<z.ZodObject<{
            r: z.ZodNumber;
            g: z.ZodNumber;
            b: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            r: number;
            g: number;
            b: number;
        }, {
            r: number;
            g: number;
            b: number;
        }>>;
        background: z.ZodOptional<z.ZodObject<{
            r: z.ZodNumber;
            g: z.ZodNumber;
            b: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            r: number;
            g: number;
            b: number;
        }, {
            r: number;
            g: number;
            b: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        contrastRatio: number;
        wcagLevel: "AA" | "AAA";
        passed: boolean;
        foreground?: {
            r: number;
            g: number;
            b: number;
        } | undefined;
        background?: {
            r: number;
            g: number;
            b: number;
        } | undefined;
    }, {
        contrastRatio: number;
        wcagLevel: "AA" | "AAA";
        passed: boolean;
        foreground?: {
            r: number;
            g: number;
            b: number;
        } | undefined;
        background?: {
            r: number;
            g: number;
            b: number;
        } | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    states: Record<string, {
        l: number;
        c: number;
        h: number;
    }>;
    accessibility?: {
        contrastRatio: number;
        wcagLevel: "AA" | "AAA";
        passed: boolean;
        foreground?: {
            r: number;
            g: number;
            b: number;
        } | undefined;
        background?: {
            r: number;
            g: number;
            b: number;
        } | undefined;
    }[] | undefined;
}, {
    name: string;
    states: Record<string, {
        l: number;
        c: number;
        h: number;
    }>;
    accessibility?: {
        contrastRatio: number;
        wcagLevel: "AA" | "AAA";
        passed: boolean;
        foreground?: {
            r: number;
            g: number;
            b: number;
        } | undefined;
        background?: {
            r: number;
            g: number;
            b: number;
        } | undefined;
    }[] | undefined;
}>;
export type ComponentTheme = z.infer<typeof ComponentThemeSchema>;
/**
 * Backward compatibility alias for ComponentThemeSchema
 * @deprecated Use ComponentThemeSchema instead
 */
export declare const ComponentPresetSchema: z.ZodObject<{
    name: z.ZodString;
    states: z.ZodRecord<z.ZodString, z.ZodObject<{
        l: z.ZodNumber;
        c: z.ZodNumber;
        h: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        l: number;
        c: number;
        h: number;
    }, {
        l: number;
        c: number;
        h: number;
    }>>;
    accessibility: z.ZodOptional<z.ZodArray<z.ZodObject<{
        contrastRatio: z.ZodNumber;
        wcagLevel: z.ZodEnum<["AA", "AAA"]>;
        passed: z.ZodBoolean;
        foreground: z.ZodOptional<z.ZodObject<{
            r: z.ZodNumber;
            g: z.ZodNumber;
            b: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            r: number;
            g: number;
            b: number;
        }, {
            r: number;
            g: number;
            b: number;
        }>>;
        background: z.ZodOptional<z.ZodObject<{
            r: z.ZodNumber;
            g: z.ZodNumber;
            b: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            r: number;
            g: number;
            b: number;
        }, {
            r: number;
            g: number;
            b: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        contrastRatio: number;
        wcagLevel: "AA" | "AAA";
        passed: boolean;
        foreground?: {
            r: number;
            g: number;
            b: number;
        } | undefined;
        background?: {
            r: number;
            g: number;
            b: number;
        } | undefined;
    }, {
        contrastRatio: number;
        wcagLevel: "AA" | "AAA";
        passed: boolean;
        foreground?: {
            r: number;
            g: number;
            b: number;
        } | undefined;
        background?: {
            r: number;
            g: number;
            b: number;
        } | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    states: Record<string, {
        l: number;
        c: number;
        h: number;
    }>;
    accessibility?: {
        contrastRatio: number;
        wcagLevel: "AA" | "AAA";
        passed: boolean;
        foreground?: {
            r: number;
            g: number;
            b: number;
        } | undefined;
        background?: {
            r: number;
            g: number;
            b: number;
        } | undefined;
    }[] | undefined;
}, {
    name: string;
    states: Record<string, {
        l: number;
        c: number;
        h: number;
    }>;
    accessibility?: {
        contrastRatio: number;
        wcagLevel: "AA" | "AAA";
        passed: boolean;
        foreground?: {
            r: number;
            g: number;
            b: number;
        } | undefined;
        background?: {
            r: number;
            g: number;
            b: number;
        } | undefined;
    }[] | undefined;
}>;
/**
 * Backward compatibility type alias
 * @deprecated Use ComponentTheme instead
 */
export type ComponentPreset = ComponentTheme;
/**
 * Token Output Format Schema
 * Defines supported output formats
 */
export declare const TokenOutputFormatSchema: z.ZodEnum<["css", "json", "js", "ts"]>;
export type TokenOutputFormat = z.infer<typeof TokenOutputFormatSchema>;
/**
 * Theme Mode Schema
 */
export declare const ThemeModeSchema: z.ZodEnum<["light", "dark"]>;
export type ThemeMode = z.infer<typeof ThemeModeSchema>;
//# sourceMappingURL=schemas.d.ts.map