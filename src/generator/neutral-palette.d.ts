import type { ColorScale } from '../schemas';
/**
 * Neutral palette configuration
 */
export interface NeutralPaletteConfig {
    mode: 'light' | 'dark';
    tinting?: 'pure' | 'tinted' | 'custom';
    primaryHue?: number;
    chromaIntensity?: number;
}
/**
 * Generate neutral palette with configurable tinting
 * TASK-001: Light mode neutral palette
 * TASK-002: Dark mode neutral palette
 * TASK-003: Tinting modes
 */
export declare function generateNeutralPalette(config: NeutralPaletteConfig): ColorScale;
//# sourceMappingURL=neutral-palette.d.ts.map