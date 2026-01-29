/**
 * @tekton/core - Layout Token Type Definitions
 * 4-Layer Layout Token Architecture: Shell → Page → Section → Responsive
 * [SPEC-LAYOUT-001] [PHASE-1]
 */

import type { TokenBindings } from '../component-schemas.js';
import type { TokenReference } from '../token-resolver.js';

// Note: TokenReference is imported from token-resolver.ts to maintain consistency
// Token references use dot notation: "atomic.spacing.16", "semantic.color.primary"

// ============================================================================
// Layer 4: Responsive Tokens - Breakpoint Definitions
// ============================================================================

/**
 * Responsive Token - Defines breakpoint dimensions
 * Used for responsive design across different screen sizes
 */
export interface ResponsiveToken {
  /** Unique identifier for the breakpoint (e.g., "breakpoint.md") */
  id: string;

  /** Minimum width in pixels for this breakpoint */
  minWidth: number;

  /** Maximum width in pixels (optional, for range breakpoints) */
  maxWidth?: number;

  /** Human-readable description of the breakpoint */
  description: string;
}

/**
 * Responsive Configuration for any layout structure
 * Supports mobile-first responsive design with breakpoint overrides
 *
 * @template T - The configuration type being made responsive
 *
 * @example
 * ```typescript
 * const config: ResponsiveConfig<ShellConfig> = {
 *   default: { /* base config *\/ },
 *   md: { /* tablet overrides *\/ },
 *   lg: { /* desktop overrides *\/ }
 * };
 * ```
 */
export interface ResponsiveConfig<T> {
  /** Default configuration (mobile-first, applies to all screen sizes) */
  default: T;

  /** Small devices override (640px+) */
  sm?: Partial<T>;

  /** Medium devices override (768px+) */
  md?: Partial<T>;

  /** Large devices override (1024px+) */
  lg?: Partial<T>;

  /** Extra large devices override (1280px+) */
  xl?: Partial<T>;

  /** 2X large devices override (1536px+) */
  '2xl'?: Partial<T>;
}

/**
 * Container Query breakpoint values (component-level)
 * These are smaller than viewport breakpoints as they query container width
 */
export const CONTAINER_BREAKPOINTS = {
  sm: 320, // Small container
  md: 480, // Medium container
  lg: 640, // Large container
  xl: 800, // Extra large container
} as const;

export type ContainerBreakpointKey = keyof typeof CONTAINER_BREAKPOINTS;

/**
 * Container Query breakpoint configuration
 */
export interface ContainerBreakpointConfig {
  /** Minimum width in pixels */
  minWidth: number;
  /** CSS properties to apply at this breakpoint */
  css: Record<string, string>;
}

/**
 * Container Query configuration for component-level responsiveness
 * Uses CSS @container queries for size-based styling
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
 */
export interface ContainerQueryConfig {
  /** Container name for CSS @container rule */
  name: string;

  /**
   * Container type:
   * - 'inline-size': Query width only (recommended for most cases)
   * - 'size': Query both width and height (higher performance cost)
   */
  type: 'inline-size' | 'size';

  /** Breakpoints for container queries */
  breakpoints: {
    sm?: ContainerBreakpointConfig;
    md?: ContainerBreakpointConfig;
    lg?: ContainerBreakpointConfig;
    xl?: ContainerBreakpointConfig;
  };
}

/**
 * Orientation configuration for device rotation handling
 * Supports portrait (height > width) and landscape (width > height) modes
 *
 * @template T - Configuration type being made orientation-aware
 */
export interface OrientationConfig<T> {
  /** Portrait mode overrides (height >= width) */
  portrait?: Partial<T>;

  /** Landscape mode overrides (width > height) */
  landscape?: Partial<T>;
}

/**
 * Enhanced responsive configuration with orientation support
 * Extends ResponsiveConfig with orientation-specific overrides
 *
 * @template T - Configuration type being made responsive and orientation-aware
 */
export interface FullResponsiveConfig<T> extends ResponsiveConfig<T> {
  /** Orientation-specific overrides applied after breakpoint styles */
  orientation?: OrientationConfig<Partial<T>>;
}

// ============================================================================
// Layer 3: Section Pattern Tokens - Layout Primitives
// ============================================================================

/**
 * Section Type - Layout primitive classification
 * Defines the fundamental layout pattern type
 */
export type SectionType = 'grid' | 'flex' | 'split' | 'stack' | 'container';

/**
 * Section CSS Configuration
 * CSS properties that define the section layout behavior
 */
export interface SectionCSS {
  /** CSS display property */
  display: 'grid' | 'flex';

  /** CSS grid-template-columns (for grid display) */
  gridTemplateColumns?: string;

  /** CSS grid-template-rows (for grid display) */
  gridTemplateRows?: string;

  /** Gap between grid/flex items (token reference) */
  gap?: TokenReference;

  /** Flex direction (for flex display) */
  flexDirection?: 'row' | 'column';

  /** Align items along cross axis */
  alignItems?: string;

  /** Justify content along main axis */
  justifyContent?: string;

  /** Maximum width constraint (token reference) */
  maxWidth?: TokenReference;

  /** Padding (token reference) */
  padding?: TokenReference;
}

/**
 * Section Pattern Token - Layout primitive definition
 * Defines reusable layout patterns with CSS properties
 */
export interface SectionPatternToken {
  /** Unique identifier (e.g., "section.grid-3") */
  id: string;

  /** Layout primitive type */
  type: SectionType;

  /** Human-readable description */
  description: string;

  /** CSS properties defining the layout */
  css: SectionCSS;

  /** Responsive overrides for different breakpoints */
  responsive: ResponsiveConfig<SectionCSS>;

  /** Token bindings for referencing design system tokens */
  tokenBindings: TokenBindings;
}

// ============================================================================
// Layer 2: Page Layout Tokens - Screen Purpose Layouts
// ============================================================================

/**
 * Page Purpose - Semantic page classification
 * Defines the intended use case and behavior of the page
 */
export type PagePurpose =
  | 'job' // Job execution or task-focused page
  | 'resource' // Resource management page
  | 'dashboard' // Overview and metrics page
  | 'settings' // Configuration page
  | 'detail' // Detailed view of a single item
  | 'empty' // Empty state or placeholder page
  | 'wizard' // Multi-step guided process
  | 'onboarding'; // User onboarding flow

/**
 * Section Slot - Placeholder for section patterns in page layout
 * Defines where and how section patterns can be used
 */
export interface SectionSlot {
  /** Slot identifier (e.g., "header", "main", "sidebar") */
  name: string;

  /** Reference to section pattern ID */
  pattern: string;

  /** Whether this section is required in the layout */
  required: boolean;

  /** Optional whitelist of allowed component types in this slot */
  allowedComponents?: string[];
}

/**
 * Page Configuration - Structure for page-level settings
 * Used as the type parameter for ResponsiveConfig<PageConfig>
 */
export interface PageConfig {
  /** Page-specific configuration properties */
  [key: string]: unknown;
}

/**
 * Page Layout Token - Complete page layout definition
 * Defines the overall structure and purpose of a page
 */
export interface PageLayoutToken {
  /** Unique identifier (e.g., "page.dashboard") */
  id: string;

  /** Human-readable description */
  description: string;

  /** Semantic purpose of the page */
  purpose: PagePurpose;

  /** Section slots that make up the page structure */
  sections: SectionSlot[];

  /** Responsive overrides for different breakpoints */
  responsive: ResponsiveConfig<PageConfig>;

  /** Token bindings for referencing design system tokens */
  tokenBindings: TokenBindings;
}

// ============================================================================
// Layer 1: Shell Tokens - Application Frame
// ============================================================================

/**
 * Shell Region Position - Location within the app shell
 */
export type ShellRegionPosition = 'top' | 'left' | 'right' | 'bottom' | 'center';

/**
 * Shell Region - Structural region within the application shell
 * Defines persistent UI regions like headers, sidebars, and footers
 */
export interface ShellRegion {
  /** Region identifier (e.g., "header", "sidebar", "main") */
  name: string;

  /** Position within the shell layout */
  position: ShellRegionPosition;

  /** Size dimension (token reference, e.g., "atomic.spacing.16") */
  size: TokenReference;

  /** Whether the region can be collapsed */
  collapsible?: boolean;

  /** Default collapsed state (if collapsible) */
  defaultCollapsed?: boolean;
}

/**
 * Shell Configuration - Structure for shell-level settings
 * Used as the type parameter for ResponsiveConfig<ShellConfig>
 */
export interface ShellConfig {
  /** Shell-specific configuration properties */
  [key: string]: unknown;
}

/**
 * Shell Token - Application shell layout definition
 * Defines the persistent frame structure of the application
 */
export interface ShellToken {
  /** Unique identifier (e.g., "shell.web.dashboard") */
  id: string;

  /** Human-readable description */
  description: string;

  /** Target platform */
  platform: 'web' | 'mobile' | 'desktop';

  /** Structural regions that make up the shell */
  regions: ShellRegion[];

  /** Responsive overrides for different breakpoints */
  responsive: ResponsiveConfig<ShellConfig>;

  /** Token bindings for referencing design system tokens */
  tokenBindings: TokenBindings;
}
