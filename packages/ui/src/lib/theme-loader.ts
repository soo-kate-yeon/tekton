/**
 * @tekton/ui - Theme Loader
 * SPEC-UI-001: linear-minimal-v1.json → CSS Variables Converter
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: 테마 로더가 런타임 테마 전환을 보장
 * IMPACT: 테마 로더 오류 시 시각적 일관성 파괴
 *
 * Converts Tekton theme JSON files to CSS Variables for runtime theming.
 * Supports OKLCH color format and semantic token resolution.
 */

/**
 * Theme Definition (mirrors @tekton/core ThemeDefinition)
 */
export interface ThemeDefinition {
  id: string;
  name: string;
  schemaVersion: string;
  tokens: {
    atomic: {
      color: {
        brand: Record<string, OKLCHColor>;
        neutral: Record<string, OKLCHColor>;
        white: OKLCHColor;
      };
      spacing: Record<string, string>;
      radius: Record<string, string>;
    };
    semantic: {
      background: {
        canvas: string;
        surface: {
          subtle: string;
          default: string;
          emphasis: string;
        };
        brand: {
          subtle: string;
          default: string;
          emphasis: string;
        };
      };
      border: {
        default: {
          subtle: string;
          default: string;
          emphasis: string;
        };
      };
      text?: {
        primary: string;
        secondary: string;
        muted: string;
      };
    };
  };
  stateLayer?: {
    hover?: { opacity: number };
    disabled?: { opacity: number; contentOpacity: number };
  };
  typography?: {
    fontFamily?: Record<string, string>;
    fontWeight?: Record<string, string>;
  };
}

/**
 * OKLCH Color Format (used by linear-minimal-v1)
 */
export interface OKLCHColor {
  l: number; // Lightness (0-1)
  c: number; // Chroma (0+)
  h: number; // Hue (0-360)
}

/**
 * Convert OKLCH color object to CSS oklch() string
 */
export function oklchToCSS(color: OKLCHColor): string {
  return `oklch(${color.l} ${color.c} ${color.h})`;
}

/**
 * Resolve semantic token reference to atomic color
 * Example: "atomic.color.brand.500" → { l: 0.55, c: 0.12, h: 265 }
 */
export function resolveSemanticToken(
  reference: string,
  theme: ThemeDefinition
): OKLCHColor | string {
  const parts = reference.split('.');

  if (parts[0] !== 'atomic') {
    return reference; // Not a token reference
  }

  let current: any = theme.tokens;
  for (const part of parts) {
    if (current && typeof current === 'object') {
      current = current[part];
    } else {
      return reference; // Path not found
    }
  }

  return current;
}

/**
 * Convert theme JSON to CSS Variables string
 * Maps linear-minimal-v1.json structure to --tekton-* variables
 */
export function themeToCSS(theme: ThemeDefinition): string {
  const { tokens } = theme;

  // Resolve semantic tokens
  const resolveColor = (ref: string): string => {
    const resolved = resolveSemanticToken(ref, theme);
    if (typeof resolved === 'object' && 'l' in resolved) {
      return oklchToCSS(resolved);
    }
    return String(resolved);
  };

  const css = `
:root, [data-theme="${theme.id}"] {
  /* ========================================
     Tekton Background Tokens
     From: linear-minimal-v1.json → tokens.semantic.background
     ======================================== */
  --tekton-bg-background: ${resolveColor(tokens.semantic.background.canvas)};
  --tekton-bg-foreground: ${tokens.semantic.text ? resolveColor(tokens.semantic.text.primary) : oklchToCSS(tokens.atomic.color.neutral[900])};

  --tekton-bg-card: ${resolveColor(tokens.semantic.background.surface.default)};
  --tekton-bg-card-foreground: ${tokens.semantic.text ? resolveColor(tokens.semantic.text.primary) : oklchToCSS(tokens.atomic.color.neutral[900])};

  --tekton-bg-popover: ${resolveColor(tokens.semantic.background.surface.default)};
  --tekton-bg-popover-foreground: ${tokens.semantic.text ? resolveColor(tokens.semantic.text.primary) : oklchToCSS(tokens.atomic.color.neutral[900])};

  --tekton-bg-primary: ${resolveColor(tokens.semantic.background.brand.default)};
  --tekton-bg-primary-foreground: ${oklchToCSS(tokens.atomic.color.white)};

  --tekton-bg-secondary: ${resolveColor(tokens.semantic.background.surface.emphasis)};
  --tekton-bg-secondary-foreground: ${tokens.semantic.text ? resolveColor(tokens.semantic.text.primary) : oklchToCSS(tokens.atomic.color.neutral[900])};

  --tekton-bg-muted: ${resolveColor(tokens.semantic.background.surface.subtle)};
  --tekton-bg-muted-foreground: ${tokens.semantic.text ? resolveColor(tokens.semantic.text.secondary) : oklchToCSS(tokens.atomic.color.neutral[500])};

  --tekton-bg-accent: ${resolveColor(tokens.semantic.background.surface.emphasis)};
  --tekton-bg-accent-foreground: ${tokens.semantic.text ? resolveColor(tokens.semantic.text.primary) : oklchToCSS(tokens.atomic.color.neutral[900])};

  --tekton-bg-destructive: ${oklchToCSS({ l: 0.5, c: 0.2, h: 30 })}; /* Default red */
  --tekton-bg-destructive-foreground: ${oklchToCSS(tokens.atomic.color.white)};

  /* ========================================
     Tekton Border Tokens
     From: linear-minimal-v1.json → tokens.semantic.border
     ======================================== */
  --tekton-border-default: ${resolveColor(tokens.semantic.border.default.default)};
  --tekton-border-input: ${resolveColor(tokens.semantic.border.default.subtle)};
  --tekton-border-ring: ${resolveColor(tokens.semantic.background.brand.default)};

  /* ========================================
     Tekton Radius Tokens
     From: linear-minimal-v1.json → tokens.atomic.radius
     ======================================== */
  ${Object.entries(tokens.atomic.radius)
    .map(([key, val]) => `--tekton-radius-${key}: ${val};`)
    .join('\n  ')}

  /* ========================================
     Tekton Spacing Tokens
     From: linear-minimal-v1.json → tokens.atomic.spacing
     ======================================== */
  ${Object.entries(tokens.atomic.spacing)
    .map(([key, val]) => `--tekton-spacing-${key}: ${val};`)
    .join('\n  ')}
}
`;

  return css.trim();
}

/**
 * Load theme from JSON and inject CSS Variables
 * Usage in Next.js app:
 *
 * ```tsx
 * import theme from '@/.moai/themes/generated/linear-minimal-v1.json';
 * import { injectThemeCSS } from '@tekton/ui/lib/theme-loader';
 *
 * // In layout or app component
 * useEffect(() => {
 *   injectThemeCSS(theme);
 * }, []);
 * ```
 */
export function injectThemeCSS(theme: ThemeDefinition): void {
  if (typeof document === 'undefined') {
    return; // SSR guard
  }

  const css = themeToCSS(theme);

  // Remove existing theme style if present
  const existingStyle = document.getElementById('tekton-theme');
  if (existingStyle) {
    existingStyle.remove();
  }

  // Inject new theme CSS
  const style = document.createElement('style');
  style.id = 'tekton-theme';
  style.textContent = css;
  document.head.appendChild(style);
}

/**
 * Get current theme ID from document
 */
export function getCurrentThemeId(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const root = document.documentElement;
  return root.getAttribute('data-theme');
}

/**
 * Set theme ID on document root
 */
export function setThemeId(themeId: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.setAttribute('data-theme', themeId);
}
