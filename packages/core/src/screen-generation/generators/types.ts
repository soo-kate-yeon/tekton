/**
 * @tekton/core - Generator Type Definitions
 * Common types and interfaces for code generators
 * [SPEC-LAYOUT-002] [PHASE-3]
 */

// ============================================================================
// Generator Options
// ============================================================================

/**
 * CSS framework options for code generation
 */
export type CSSFramework = 'styled-components' | 'emotion' | 'tailwind' | 'css-modules';

/**
 * Output format options
 */
export type OutputFormat = 'typescript' | 'javascript';

/**
 * Component style options
 */
export type ComponentStyle = 'functional' | 'class';

/**
 * Generator options for customizing output
 */
export interface GeneratorOptions {
  /** Output format (default: 'typescript') */
  format?: OutputFormat;

  /** CSS framework to use (default: 'tailwind') */
  cssFramework?: CSSFramework;

  /** Enable prettier formatting (default: true) */
  prettier?: boolean;

  /** Include TypeScript types (default: true) */
  includeTypes?: boolean;

  /** Component style (default: 'functional') */
  componentStyle?: ComponentStyle;

  /** Indentation (default: 2 spaces) */
  indent?: number;

  /** Single quotes vs double quotes (default: true for single) */
  singleQuote?: boolean;
}

/**
 * Default generator options
 */
export const defaultGeneratorOptions: Required<GeneratorOptions> = {
  format: 'typescript',
  cssFramework: 'tailwind',
  prettier: true,
  includeTypes: true,
  componentStyle: 'functional',
  indent: 2,
  singleQuote: true,
};

// ============================================================================
// Generator Result
// ============================================================================

/**
 * Result from code generation
 */
export interface GeneratorResult {
  /** Generated code */
  code: string;

  /** Files generated (for multi-file generators) */
  files?: GeneratedFile[];

  /** Warnings encountered during generation */
  warnings?: string[];

  /** Metadata about generation */
  meta?: {
    /** Time taken to generate (ms) */
    duration?: number;

    /** Number of components generated */
    componentCount?: number;

    /** Number of lines generated */
    lineCount?: number;
  };
}

/**
 * Generated file
 */
export interface GeneratedFile {
  /** File path relative to output directory */
  path: string;

  /** File content */
  content: string;

  /** File type */
  type: 'component' | 'style' | 'config' | 'type';
}

// ============================================================================
// CSS Variable Mapping
// ============================================================================

/**
 * CSS variable mapping for token resolution
 */
export interface CSSVariableMap {
  /** Variable name (without --) */
  name: string;

  /** CSS variable reference (with var()) */
  cssVar: string;

  /** Original token reference */
  tokenRef: string;
}

// ============================================================================
// Tailwind Class Mapping
// ============================================================================

/**
 * Tailwind class mapping configuration
 */
export interface TailwindClassMap {
  /** Property name (e.g., 'background', 'padding') */
  property: string;

  /** Tailwind class name (e.g., 'bg-primary-500') */
  className: string;

  /** Original token reference */
  tokenRef: string;

  /** Responsive variants (optional) */
  responsive?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
}

// ============================================================================
// Styled Components Theming
// ============================================================================

/**
 * Theme configuration for styled-components/Emotion
 */
export interface StyledThemeConfig {
  /** Theme name */
  name: string;

  /** Color tokens */
  colors: Record<string, string>;

  /** Spacing tokens */
  spacing: Record<string, string>;

  /** Typography tokens */
  typography: Record<string, string>;

  /** Border radius tokens */
  radii: Record<string, string>;

  /** Shadow tokens */
  shadows: Record<string, string>;

  /** Custom tokens */
  custom?: Record<string, Record<string, string>>;
}

// ============================================================================
// Component Generation Context
// ============================================================================

/**
 * Context for component generation
 */
export interface ComponentGenerationContext {
  /** Component depth in tree (for indentation) */
  depth: number;

  /** Parent component type (if nested) */
  parentType?: string;

  /** Accumulated imports */
  imports: Set<string>;

  /** CSS framework being used */
  cssFramework: CSSFramework;

  /** Output format */
  format: OutputFormat;
}
