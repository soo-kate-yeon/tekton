import { z } from 'zod';
/**
 * Brand tone options
 */
export declare const BrandToneSchema: z.ZodEnum<["professional", "playful", "elegant", "bold", "minimal"]>;
/**
 * Contrast level options
 */
export declare const ContrastSchema: z.ZodEnum<["low", "medium", "high", "maximum"]>;
/**
 * UI density options
 */
export declare const DensitySchema: z.ZodEnum<["compact", "comfortable", "spacious"]>;
/**
 * Border radius options
 */
export declare const BorderRadiusSchema: z.ZodEnum<["none", "small", "medium", "large", "full"]>;
/**
 * Neutral tone options
 */
export declare const NeutralToneSchema: z.ZodEnum<["pure", "warm", "cool"]>;
/**
 * Font scale options
 */
export declare const FontScaleSchema: z.ZodEnum<["small", "medium", "large"]>;
/**
 * Complete questionnaire schema
 * TASK-008: Q&A Schema Implementation (EDR-002)
 */
export declare const QuestionnaireSchema: z.ZodObject<{
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
/**
 * Questionnaire type
 */
export type Questionnaire = z.infer<typeof QuestionnaireSchema>;
/**
 * Default questionnaire configuration
 */
export declare const DEFAULT_QUESTIONNAIRE: Questionnaire;
//# sourceMappingURL=questionnaire.d.ts.map