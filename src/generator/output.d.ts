import type { OKLCHColor } from '../schemas';
import type { SemanticTokens } from './semantic-mapper';
/**
 * Export configuration
 */
export interface ExportConfig {
    semanticTokens: SemanticTokens;
    darkTokens?: SemanticTokens;
    colorScales?: Record<string, Record<string, OKLCHColor>>;
    minify?: boolean;
    prefix?: string;
    format?: 'js' | 'ts';
}
/**
 * Export semantic tokens to CSS variables
 * TASK-005: CSS Variables Output (EDR-002)
 */
export declare function exportToCSS(config: ExportConfig): string;
/**
 * Export to Design Token Community Group (DTCG) format
 * TASK-006: DTCG JSON Output (EDR-002)
 */
export declare function exportToDTCG(config: ExportConfig): string;
/**
 * Export to Tailwind CSS configuration
 * TASK-007: Tailwind Config Output (EDR-002)
 */
export declare function exportToTailwind(config: ExportConfig): string;
//# sourceMappingURL=output.d.ts.map