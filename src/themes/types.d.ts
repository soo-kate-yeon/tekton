import { z } from 'zod';
/**
 * Supported frontend frameworks for themes
 */
export declare const SUPPORTED_FRAMEWORKS: readonly ["nextjs", "vite", "remix"];
/**
 * Stack configuration schema
 * Defines the technology stack for the theme
 *
 * @property framework - Frontend framework (Next.js, Vite, or Remix)
 * @property styling - Styling solution (currently only Tailwind CSS)
 * @property components - Component library (currently only shadcn/ui)
 */
export declare const StackSchema: z.ZodObject<{
    framework: z.ZodEnum<["nextjs", "vite", "remix"]>;
    styling: z.ZodLiteral<"tailwindcss">;
    components: z.ZodLiteral<"shadcn-ui">;
}, "strip", z.ZodTypeAny, {
    components: "shadcn-ui";
    framework: "nextjs" | "vite" | "remix";
    styling: "tailwindcss";
}, {
    components: "shadcn-ui";
    framework: "nextjs" | "vite" | "remix";
    styling: "tailwindcss";
}>;
/**
 * Theme metadata schema
 * Optional metadata for theme discoverability and attribution
 *
 * @property tags - Optional array of tags for categorization
 * @property author - Optional author name or organization
 * @property homepage - Optional URL to theme documentation or homepage
 */
export declare const ThemeMetadataSchema: z.ZodObject<{
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    author: z.ZodOptional<z.ZodString>;
    homepage: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    tags?: string[] | undefined;
    author?: string | undefined;
    homepage?: string | undefined;
}, {
    tags?: string[] | undefined;
    author?: string | undefined;
    homepage?: string | undefined;
}>;
/**
 * Complete theme schema
 * Validates theme configuration files against SPEC EDR-001 requirements
 *
 * @property id - Unique theme identifier (kebab-case recommended)
 * @property version - Semantic version (e.g., "1.0.0")
 * @property name - Human-readable theme name
 * @property description - Theme description and use case
 * @property stack - Technology stack configuration
 * @property questionnaire - Design system questionnaire configuration
 * @property metadata - Optional metadata for discoverability
 *
 * @example
 * ```typescript
 * const theme = {
 *   id: 'next-tailwind-shadcn',
 *   version: '0.1.0',
 *   name: 'Next.js + Tailwind CSS + shadcn/ui',
 *   description: 'Default theme for Next.js applications',
 *   stack: {
 *     framework: 'nextjs',
 *     styling: 'tailwindcss',
 *     components: 'shadcn-ui',
 *   },
 *   questionnaire: {
 *     brandTone: 'professional',
 *     contrast: 'high',
 *     // ... other questionnaire fields
 *   },
 * };
 * ```
 */
export declare const ThemeSchema: z.ZodObject<{
    id: z.ZodString;
    version: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    stack: z.ZodObject<{
        framework: z.ZodEnum<["nextjs", "vite", "remix"]>;
        styling: z.ZodLiteral<"tailwindcss">;
        components: z.ZodLiteral<"shadcn-ui">;
    }, "strip", z.ZodTypeAny, {
        components: "shadcn-ui";
        framework: "nextjs" | "vite" | "remix";
        styling: "tailwindcss";
    }, {
        components: "shadcn-ui";
        framework: "nextjs" | "vite" | "remix";
        styling: "tailwindcss";
    }>;
    questionnaire: z.ZodObject<{
        brandTone: z.ZodEnum<["professional", "playful", "elegant", "bold", "minimal"]>;
        contrast: z.ZodEnum<["low", "medium", "high", "maximum"]>;
        density: z.ZodEnum<["compact", "comfortable", "spacious"]>;
        borderRadius: z.ZodEnum<["none", "small", "medium", "large", "full"]>;
        primaryColor: z.ZodObject<{
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
        neutralTone: z.ZodEnum<["pure", "warm", "cool"]>;
        fontScale: z.ZodEnum<["small", "medium", "large"]>;
    }, "strip", z.ZodTypeAny, {
        brandTone: "professional" | "playful" | "elegant" | "bold" | "minimal";
        contrast: "maximum" | "low" | "medium" | "high";
        density: "compact" | "comfortable" | "spacious";
        borderRadius: "none" | "medium" | "small" | "large" | "full";
        primaryColor: {
            l: number;
            c: number;
            h: number;
        };
        neutralTone: "pure" | "warm" | "cool";
        fontScale: "medium" | "small" | "large";
    }, {
        brandTone: "professional" | "playful" | "elegant" | "bold" | "minimal";
        contrast: "maximum" | "low" | "medium" | "high";
        density: "compact" | "comfortable" | "spacious";
        borderRadius: "none" | "medium" | "small" | "large" | "full";
        primaryColor: {
            l: number;
            c: number;
            h: number;
        };
        neutralTone: "pure" | "warm" | "cool";
        fontScale: "medium" | "small" | "large";
    }>;
    metadata: z.ZodOptional<z.ZodObject<{
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        author: z.ZodOptional<z.ZodString>;
        homepage: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        tags?: string[] | undefined;
        author?: string | undefined;
        homepage?: string | undefined;
    }, {
        tags?: string[] | undefined;
        author?: string | undefined;
        homepage?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    description: string;
    version: string;
    stack: {
        components: "shadcn-ui";
        framework: "nextjs" | "vite" | "remix";
        styling: "tailwindcss";
    };
    questionnaire: {
        brandTone: "professional" | "playful" | "elegant" | "bold" | "minimal";
        contrast: "maximum" | "low" | "medium" | "high";
        density: "compact" | "comfortable" | "spacious";
        borderRadius: "none" | "medium" | "small" | "large" | "full";
        primaryColor: {
            l: number;
            c: number;
            h: number;
        };
        neutralTone: "pure" | "warm" | "cool";
        fontScale: "medium" | "small" | "large";
    };
    metadata?: {
        tags?: string[] | undefined;
        author?: string | undefined;
        homepage?: string | undefined;
    } | undefined;
}, {
    id: string;
    name: string;
    description: string;
    version: string;
    stack: {
        components: "shadcn-ui";
        framework: "nextjs" | "vite" | "remix";
        styling: "tailwindcss";
    };
    questionnaire: {
        brandTone: "professional" | "playful" | "elegant" | "bold" | "minimal";
        contrast: "maximum" | "low" | "medium" | "high";
        density: "compact" | "comfortable" | "spacious";
        borderRadius: "none" | "medium" | "small" | "large" | "full";
        primaryColor: {
            l: number;
            c: number;
            h: number;
        };
        neutralTone: "pure" | "warm" | "cool";
        fontScale: "medium" | "small" | "large";
    };
    metadata?: {
        tags?: string[] | undefined;
        author?: string | undefined;
        homepage?: string | undefined;
    } | undefined;
}>;
/**
 * Theme type
 * Represents a complete design system theme configuration
 *
 * This type is inferred from ThemeSchema and provides full type safety
 * for theme objects throughout the application.
 */
export type Theme = z.infer<typeof ThemeSchema>;
/**
 * Stack type
 * Represents the technology stack configuration for a theme
 */
export type Stack = z.infer<typeof StackSchema>;
/**
 * Theme metadata type
 * Represents optional metadata for theme discoverability
 */
export type ThemeMetadata = z.infer<typeof ThemeMetadataSchema>;
//# sourceMappingURL=types.d.ts.map