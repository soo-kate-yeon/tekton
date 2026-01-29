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

// ============================================================================
// Mobile Platform Tokens - Mobile-Specific Shell Extensions
// ============================================================================

/**
 * Touch target minimum size constants
 * Based on platform accessibility guidelines (iOS HIG, Material Design)
 */
export const TOUCH_TARGET = {
  /** Minimum touch target size in points (44pt for iOS, 48dp for Android) */
  MIN_SIZE_PT: 44,
  /** Minimum touch target size in pixels (1x density) */
  MIN_SIZE_PX: 44,
  /** Touch target size at 2x density (88px) */
  MIN_SIZE_2X: 88,
  /** Touch target size at 3x density (132px) */
  MIN_SIZE_3X: 132,
  /** Touch target size at 4x density (176px) */
  MIN_SIZE_4X: 176,
} as const;

/**
 * Safe area inset default values
 * Standard measurements for iOS device notches and home indicators
 */
export const SAFE_AREA_DEFAULTS = {
  /** Notch height on iPhone X series (44pt) */
  NOTCH: 44,
  /** Dynamic Island height on iPhone 14 Pro+ (59pt) */
  DYNAMIC_ISLAND: 59,
  /** Home indicator height on devices without home button (34pt) */
  HOME_INDICATOR: 34,
  /** Status bar height on standard devices (20pt) */
  STATUS_BAR: 20,
} as const;

/**
 * Safe Area Default Values
 * Device-specific safe area measurements in points
 */
export interface SafeAreaDefaults {
  /** Notch height for iPhone X and later (44pt) */
  notch: number;

  /** Dynamic Island height for iPhone 14 Pro and later (59pt) */
  dynamicIsland: number;

  /** Home indicator height for devices without physical home button (34pt) */
  homeIndicator: number;

  /** Status bar height for standard devices (20pt) */
  statusBar: number;
}

/**
 * Safe Area Edges Configuration
 * Specifies which screen edges should respect safe area insets
 */
export interface SafeAreaEdges {
  /** Apply safe area to top edge (notch, Dynamic Island, status bar) */
  top: boolean;

  /** Apply safe area to bottom edge (home indicator, virtual navigation) */
  bottom: boolean;

  /** Apply safe area to left and right edges (for landscape orientation) */
  horizontal: boolean;
}

/**
 * Safe Area Configuration
 * Defines safe area insets and behavior for mobile devices
 *
 * @see https://developer.apple.com/design/human-interface-guidelines/layout
 * @see https://m3.material.io/foundations/layout/applying-layout/window-size-classes
 */
export interface SafeAreaConfig {
  /** Top inset (token reference, e.g., "atomic.spacing.44") */
  top: TokenReference;

  /** Bottom inset (token reference, e.g., "atomic.spacing.34") */
  bottom: TokenReference;

  /** Left inset (token reference) */
  left: TokenReference;

  /** Right inset (token reference) */
  right: TokenReference;

  /** Default safe area values for standard device configurations */
  defaults: SafeAreaDefaults;

  /** Which edges should respect safe area insets */
  edges: SafeAreaEdges;
}

/**
 * Status Bar Configuration
 * Controls the appearance and behavior of the mobile status bar
 *
 * @see https://developer.apple.com/documentation/uikit/uistatusbar
 * @see https://developer.android.com/reference/android/view/WindowInsetsController
 */
export interface StatusBarConfig {
  /** Height of the status bar (token reference) */
  height: TokenReference;

  /** Whether the status bar is visible */
  visible: boolean;

  /** Content style (light icons on dark background or vice versa) */
  style: 'light-content' | 'dark-content' | 'auto';

  /** Background color (token reference, optional) */
  backgroundColor?: TokenReference;

  /** Whether content can render behind the status bar (Android) */
  translucent: boolean;
}

/**
 * Navigation Bar Configuration
 * Controls the system navigation bar on Android devices
 *
 * @see https://developer.android.com/develop/ui/views/layout/edge-to-edge
 */
export interface NavigationBarConfig {
  /** Height of the navigation bar (token reference) */
  height: TokenReference;

  /**
   * Navigation bar display mode
   * - 'overlay': Draws over the navigation bar (edge-to-edge)
   * - 'inset': Content stops at navigation bar
   * - 'hidden': Navigation bar is hidden
   */
  mode: 'overlay' | 'inset' | 'hidden';

  /** Background color (token reference, optional) */
  backgroundColor?: TokenReference;

  /** Navigation button style (light or dark icons) */
  buttonStyle: 'light' | 'dark' | 'auto';
}

/**
 * System UI Configuration
 * Combines status bar and navigation bar settings
 */
export interface SystemUIConfig {
  /** Status bar configuration */
  statusBar: StatusBarConfig;

  /** Navigation bar configuration (Android only) */
  navigationBar: NavigationBarConfig;
}

/**
 * Keyboard Animation Configuration
 * Controls how the UI animates when the keyboard appears/disappears
 */
export interface KeyboardAnimationConfig {
  /** Animation duration in milliseconds (iOS: 250ms, Android: 300ms) */
  duration: number;

  /**
   * Animation easing function
   * - 'keyboard': Platform default keyboard animation
   * - 'easeInOut': Standard ease-in-out curve
   */
  easing: string;

  /** Whether keyboard animation is enabled */
  enabled: boolean;
}

/**
 * Keyboard Configuration
 * Defines how the UI responds to keyboard visibility changes
 *
 * @see https://reactnative.dev/docs/keyboardavoidingview
 * @see https://developer.apple.com/documentation/uikit/keyboards_and_input
 */
export interface KeyboardConfig {
  /**
   * Keyboard avoidance strategy
   * - 'padding': Add padding to avoid keyboard
   * - 'resize': Resize view to avoid keyboard
   * - 'position': Adjust position to avoid keyboard
   * - 'none': No automatic avoidance
   */
  avoidance: 'padding' | 'resize' | 'position' | 'none';

  /**
   * Keyboard behavior type (iOS-specific)
   * - 'height': Adjust based on keyboard height
   * - 'position': Adjust based on position
   * - 'padding': Add padding
   */
  behavior: 'height' | 'position' | 'padding';

  /** Animation configuration for keyboard transitions */
  animation: KeyboardAnimationConfig;

  /**
   * Keyboard dismiss mode
   * - 'on-drag': Dismiss when user drags scrollable content
   * - 'interactive': Allow interactive dismissal
   * - 'none': Require explicit dismiss
   */
  dismissMode: 'on-drag' | 'interactive' | 'none';
}

/**
 * Bottom Tab Item Configuration
 * Defines the layout and sizing for individual tab bar items
 */
export interface BottomTabItemConfig {
  /** Minimum touch target size (token reference) */
  minTouchTarget: TokenReference;

  /** Icon size (token reference) */
  iconSize: TokenReference;

  /** Label font size (token reference) */
  labelSize: TokenReference;

  /** Spacing between icon and label (token reference) */
  spacing: TokenReference;
}

/**
 * Bottom Tab Configuration
 * Defines the layout and behavior of the bottom tab bar
 *
 * @see https://developer.apple.com/design/human-interface-guidelines/tab-bars
 * @see https://m3.material.io/components/navigation-bar
 */
export interface BottomTabConfig {
  /** Tab bar height excluding safe area (token reference) */
  height: TokenReference;

  /** Bottom safe area inset (token reference) */
  safeAreaBottom: TokenReference;

  /** Total height including safe area (token reference) */
  totalHeight: TokenReference;

  /**
   * Tab bar visibility behavior
   * - 'always': Always visible
   * - 'scroll-hide': Hide on scroll
   * - 'route-based': Show/hide based on route
   */
  visibility: 'always' | 'scroll-hide' | 'route-based';

  /** Maximum recommended number of tab items */
  maxItems: number;

  /** Individual tab item configuration */
  item: BottomTabItemConfig;
}

/**
 * Hit Slop Configuration
 * Defines the expanded touch area around a component
 * Negative values expand the touch area beyond visual bounds
 *
 * @see https://reactnative.dev/docs/touchablewithoutfeedback#hitslop
 */
export interface HitSlopConfig {
  /** Additional touchable area above the component (in pixels) */
  top: number;

  /** Additional touchable area below the component (in pixels) */
  bottom: number;

  /** Additional touchable area to the left of the component (in pixels) */
  left: number;

  /** Additional touchable area to the right of the component (in pixels) */
  right: number;
}

/**
 * Touch Target Configuration
 * Ensures minimum touch target sizes for accessibility
 *
 * @see https://developer.apple.com/design/human-interface-guidelines/layout
 * @see https://m3.material.io/foundations/accessible-design/accessibility-basics
 */
export interface TouchTargetConfig {
  /** Minimum touch target size (token reference, typically 44pt iOS / 48dp Android) */
  minSize: TokenReference;

  /** Hit slop for expanding touch area beyond visual bounds */
  hitSlop: HitSlopConfig;
}

/**
 * Mobile Shell Token - Mobile-specific shell layout definition
 * Extends ShellToken with mobile platform configurations including
 * safe areas, system UI, keyboard handling, and touch targets
 *
 * @extends ShellToken
 *
 * @example
 * ```typescript
 * const mobileShell: MobileShellToken = {
 *   id: "shell.mobile.main",
 *   description: "Main mobile app shell with bottom tabs",
 *   platform: "mobile",
 *   os: "cross-platform",
 *   regions: [...],
 *   safeArea: {
 *     top: "atomic.spacing.44",
 *     bottom: "atomic.spacing.34",
 *     left: "atomic.spacing.0",
 *     right: "atomic.spacing.0",
 *     defaults: { notch: 44, dynamicIsland: 59, homeIndicator: 34, statusBar: 20 },
 *     edges: { top: true, bottom: true, horizontal: false }
 *   },
 *   systemUI: { ... },
 *   keyboard: { ... },
 *   bottomTab: { ... },
 *   touchTarget: { ... },
 *   responsive: { ... },
 *   tokenBindings: { ... }
 * };
 * ```
 */
export interface MobileShellToken extends ShellToken {
  /** Platform must be 'mobile' for mobile shell tokens */
  platform: 'mobile';

  /**
   * Target mobile operating system
   * - 'ios': iOS-specific configuration
   * - 'android': Android-specific configuration
   * - 'cross-platform': Shared configuration for both platforms
   */
  os: 'ios' | 'android' | 'cross-platform';

  /** Safe area configuration for device notches and system UI */
  safeArea: SafeAreaConfig;

  /** System UI configuration (status bar, navigation bar) */
  systemUI: SystemUIConfig;

  /** Keyboard behavior and animation configuration */
  keyboard: KeyboardConfig;

  /** Bottom tab bar configuration (optional, for tab-based navigation) */
  bottomTab?: BottomTabConfig;

  /** Touch target size and hit slop configuration for accessibility */
  touchTarget: TouchTargetConfig;
}
