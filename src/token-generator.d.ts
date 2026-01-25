import type { OKLCHColor, TokenDefinition, TokenOutputFormat } from './schemas';
/**
 * Generate deterministic token ID from name and color
 * TASK-013: Deterministic ID generation
 */
export declare function generateTokenId(name: string, color: OKLCHColor): string;
/**
 * Generate a single design token
 * TASK-010: Semantic token mapping
 */
export declare function generateToken(name: string, baseColor: OKLCHColor): TokenDefinition;
/**
 * Token Generator configuration
 */
export interface TokenGeneratorConfig {
    generateDarkMode?: boolean;
    validateWCAG?: boolean;
    wcagLevel?: 'AA' | 'AAA';
}
/**
 * Token Generator class with caching and optimization
 * TASK-011: Dark mode auto-generation
 * TASK-015: Performance optimization (Map-based caching)
 */
export declare class TokenGenerator {
    private cache;
    private config;
    constructor(config?: TokenGeneratorConfig);
    /**
     * Generate tokens from color palette
     */
    generateTokens(palette: Record<string, OKLCHColor>): TokenDefinition[];
    /**
     * Generate dark mode variant of a token
     * TASK-011: Dark mode auto-generation
     */
    private generateDarkModeVariant;
    /**
     * Export tokens to various formats
     * TASK-012: Token format conversion (CSS, JSON, JS)
     */
    exportTokens(palette: Record<string, OKLCHColor>, format: TokenOutputFormat): string;
    private exportToCSS;
    private exportToJSON;
    private exportToJS;
    private exportToTS;
    /**
     * Clear cache
     */
    clearCache(): void;
}
//# sourceMappingURL=token-generator.d.ts.map