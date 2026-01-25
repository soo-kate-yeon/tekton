import type { OKLCHColor, TokenDefinition, ColorScale, TokenOutputFormat } from './schemas';
import { OKLCHColorSchema } from './schemas';
import { generateLightnessScale } from './scale-generator';
import { oklchToRgb, oklchToHex } from './color-conversion';

/**
 * Generate deterministic token ID from name and color
 * TASK-013: Deterministic ID generation
 */
export function generateTokenId(name: string, color: OKLCHColor): string {
  // Create a deterministic hash-like ID
  const colorKey = `${color.l.toFixed(3)}-${color.c.toFixed(3)}-${color.h.toFixed(0)}`;
  return `${name}-${colorKey}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

/**
 * Clip OKLCH color to RGB gamut using HSL fallback
 * TASK-009: Gamut clipping handler
 */
function clipToGamut(color: OKLCHColor): OKLCHColor {
  const rgb = oklchToRgb(color);

  // Check if any RGB value is out of bounds
  const isInGamut =
    rgb.r >= 0 && rgb.r <= 255 && rgb.g >= 0 && rgb.g <= 255 && rgb.b >= 0 && rgb.b <= 255;

  if (isInGamut) {
    return color;
  }

  // Reduce chroma until color is in gamut
  const clippedColor = { ...color };
  const step = 0.01;

  while (clippedColor.c > 0) {
    clippedColor.c = Math.max(0, clippedColor.c - step);
    const testRgb = oklchToRgb(clippedColor);

    const testInGamut =
      testRgb.r >= 0 &&
      testRgb.r <= 255 &&
      testRgb.g >= 0 &&
      testRgb.g <= 255 &&
      testRgb.b >= 0 &&
      testRgb.b <= 255;

    if (testInGamut) {
      break;
    }
  }

  return clippedColor;
}

/**
 * Generate a single design token
 * TASK-010: Semantic token mapping
 */
export function generateToken(name: string, baseColor: OKLCHColor): TokenDefinition {
  // Validate input
  OKLCHColorSchema.parse(baseColor);

  // Clip to gamut if needed
  const clippedColor = clipToGamut(baseColor);

  // Generate scale
  const scale = generateLightnessScale(clippedColor);

  // Generate deterministic ID
  const id = generateTokenId(name, clippedColor);

  return {
    id,
    name,
    value: clippedColor,
    scale,
    metadata: {
      generated: new Date().toISOString(),
      gamutClipped: clippedColor.c !== baseColor.c,
    },
  };
}

/**
 * Token Generator configuration
 */
export interface TokenGeneratorConfig {
  generateDarkMode?: boolean;
  validateWCAG?: boolean;
  wcagLevel?: 'AA' | 'AAA';
}

/**
 * JSON export token structure
 */
interface JSONTokenOutput {
  value: string;
  oklch: OKLCHColor;
  scale: Record<string, string>;
}

/**
 * Token Generator class with caching and optimization
 * TASK-011: Dark mode auto-generation
 * TASK-015: Performance optimization (Map-based caching)
 */
export class TokenGenerator {
  private cache: Map<string, TokenDefinition> = new Map();
  private config: TokenGeneratorConfig;

  constructor(config: TokenGeneratorConfig = {}) {
    this.config = {
      generateDarkMode: false,
      validateWCAG: true,
      wcagLevel: 'AA',
      ...config,
    };
  }

  /**
   * Generate tokens from color palette
   */
  generateTokens(palette: Record<string, OKLCHColor>): TokenDefinition[] {
    const tokens: TokenDefinition[] = [];

    Object.entries(palette).forEach(([name, color]) => {
      // Check cache
      const cacheKey = `${name}-${JSON.stringify(color)}`;

      if (this.cache.has(cacheKey)) {
        tokens.push(this.cache.get(cacheKey)!);
        return;
      }

      // Generate token
      const token = generateToken(name, color);

      // Cache result
      this.cache.set(cacheKey, token);
      tokens.push(token);

      // Generate dark mode variant if enabled
      if (this.config.generateDarkMode) {
        const darkToken = this.generateDarkModeVariant(token);
        this.cache.set(`${cacheKey}-dark`, darkToken);
        tokens.push(darkToken);
      }
    });

    return tokens;
  }

  /**
   * Generate dark mode variant of a token
   * TASK-011: Dark mode auto-generation
   */
  private generateDarkModeVariant(token: TokenDefinition): TokenDefinition {
    // Invert lightness for dark mode
    const darkValue: OKLCHColor = {
      ...token.value,
      l: 1 - token.value.l,
    };

    const darkScale: ColorScale = {} as ColorScale;
    Object.entries(token.scale || {}).forEach(([key, value]) => {
      darkScale[key as keyof ColorScale] = {
        ...value,
        l: 1 - value.l,
      };
    });

    return {
      id: `${token.id}-dark`,
      name: `${token.name}-dark`,
      value: darkValue,
      scale: darkScale,
      metadata: {
        ...token.metadata,
        darkMode: true,
      },
    };
  }

  /**
   * Export tokens to various formats
   * TASK-012: Token format conversion (CSS, JSON, JS)
   */
  exportTokens(palette: Record<string, OKLCHColor>, format: TokenOutputFormat): string {
    const tokens = this.generateTokens(palette);

    switch (format) {
      case 'css':
        return this.exportToCSS(tokens);
      case 'json':
        return this.exportToJSON(tokens);
      case 'js':
        return this.exportToJS(tokens);
      case 'ts':
        return this.exportToTS(tokens);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  private exportToCSS(tokens: TokenDefinition[]): string {
    const lines = [':root {'];

    tokens.forEach(token => {
      // Export base value
      const hex = oklchToHex(token.value);
      lines.push(`  --${token.name}: ${hex};`);

      // Export scale
      Object.entries(token.scale || {}).forEach(([step, color]) => {
        const stepHex = oklchToHex(color);
        lines.push(`  --${token.name}-${step}: ${stepHex};`);
      });
    });

    lines.push('}');
    return lines.join('\n');
  }

  private exportToJSON(tokens: TokenDefinition[]): string {
    const output: Record<string, JSONTokenOutput> = {};

    tokens.forEach(token => {
      output[token.name] = {
        value: oklchToHex(token.value),
        oklch: token.value,
        scale: Object.fromEntries(
          Object.entries(token.scale || {}).map(([step, color]) => [step, oklchToHex(color)])
        ),
      };
    });

    return JSON.stringify(output, null, 2);
  }

  private exportToJS(tokens: TokenDefinition[]): string {
    const lines = ['// Generated design tokens'];

    tokens.forEach(token => {
      lines.push(`export const ${token.name} = '${oklchToHex(token.value)}';`);

      lines.push(`export const ${token.name}Scale = {`);
      Object.entries(token.scale || {}).forEach(([step, color]) => {
        lines.push(`  '${step}': '${oklchToHex(color)}',`);
      });
      lines.push('};');
    });

    return lines.join('\n');
  }

  private exportToTS(tokens: TokenDefinition[]): string {
    const lines = ['// Generated design tokens', ''];

    tokens.forEach(token => {
      lines.push(`export const ${token.name} = '${oklchToHex(token.value)}' as const;`);

      lines.push(`export const ${token.name}Scale = {`);
      Object.entries(token.scale || {}).forEach(([step, color]) => {
        lines.push(`  '${step}': '${oklchToHex(color)}' as const,`);
      });
      lines.push('} as const;');
      lines.push('');
    });

    return lines.join('\n');
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}
