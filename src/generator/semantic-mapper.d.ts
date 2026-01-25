import type { OKLCHColor } from '../schemas';
/**
 * Semantic token configuration
 */
export interface SemanticTokenConfig {
    mode: 'light' | 'dark';
    primary: OKLCHColor;
    neutral: OKLCHColor;
    secondary?: OKLCHColor;
    destructive?: OKLCHColor;
    accent?: OKLCHColor;
}
/**
 * Semantic tokens matching shadcn/ui convention
 */
export interface SemanticTokens {
    background: OKLCHColor;
    foreground: OKLCHColor;
    primary: OKLCHColor;
    secondary: OKLCHColor;
    muted: OKLCHColor;
    accent: OKLCHColor;
    destructive: OKLCHColor;
    border: OKLCHColor;
    input: OKLCHColor;
    ring: OKLCHColor;
    card: OKLCHColor;
    popover: OKLCHColor;
}
/**
 * Map color palettes to semantic tokens
 * TASK-004: Semantic token mapping for shadcn/ui
 */
export declare function mapSemanticTokens(config: SemanticTokenConfig): SemanticTokens;
//# sourceMappingURL=semantic-mapper.d.ts.map