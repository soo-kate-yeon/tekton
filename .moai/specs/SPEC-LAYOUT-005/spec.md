---
id: SPEC-LAYOUT-005
version: "1.0.0"
status: "draft"
created: "2026-01-29"
updated: "2026-01-29"
author: "soo-kate-yeon"
priority: "medium"
---

## HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-29 | soo-kate-yeon | Initial draft |

---

# SPEC-LAYOUT-005: Advanced Layout Patterns

## 1. Overview

### 1.1 Purpose

Implement 10 advanced layout patterns for the Layout Token System, including masonry grid, sticky positioning, scroll-aware behaviors, multi-pane layouts, foldable device support, and collapsible sidebar patterns.

### 1.2 Scope

- Pinterest-style masonry grid layout (section.masonry)
- Sticky header and footer positioning (section.sticky-header, section.sticky-footer)
- Scroll-aware collapse and reveal behaviors (section.scroll-collapse-header, section.scroll-reveal-footer)
- Multi-pane layouts for productivity apps (section.multipane-master-detail, section.multipane-three-pane)
- Foldable device support (section.foldable-split, section.foldable-span)
- Collapsible sidebar navigation (section.collapsible-sidebar)

### 1.3 Dependencies

- SPEC-LAYOUT-001 (Layout Token System) - Required, Completed
- SPEC-LAYOUT-002 (Layout Implementation) - Required, Completed
- SPEC-LAYOUT-003 (Responsive Web Enhancement) - Recommended

### 1.4 Exclusions

- Animation library implementation (use CSS transitions)
- Virtual scrolling implementation (separate concern)
- Accessibility focus management (separate SPEC)

---

## 2. Environment

```
Current System:
  - 4-tier Layout Token System (Shell → Page → Section → Responsive)
  - 6 web shells, 8 page layouts, 13 section patterns implemented
  - Responsive config with xl/2xl breakpoints active

Technology Stack:
  - TypeScript 5.7+
  - CSS Grid/Flexbox
  - CSS Sticky positioning
  - CSS Container Queries (for responsive patterns)
  - Intersection Observer API (for scroll behaviors)
  - matchMedia API (for foldable detection)

Integration Points:
  - packages/core/src/layout-tokens/types.ts
  - packages/core/src/layout-tokens/sections.ts
  - packages/core/src/layout-tokens/index.ts
  - packages/core/src/layout-css-generator.ts
```

---

## 3. Assumptions

| ID | Assumption | Rationale |
|----|------------|-----------|
| A-001 | Masonry layout is needed for image galleries and card-based UIs | Pinterest-style layouts are common in modern web applications |
| A-002 | Sticky positioning is widely supported across browsers | CSS sticky has 98%+ browser support |
| A-003 | Scroll-aware behaviors improve user experience | Header collapse increases content visibility on mobile |
| A-004 | Multi-pane layouts are essential for productivity applications | Email clients, IDE-style apps require master-detail patterns |
| A-005 | Foldable device market is growing | Samsung Fold, Surface Duo adoption increasing |
| A-006 | Collapsible sidebar is a fundamental navigation pattern | Used in dashboards, admin panels, and document viewers |

---

## 4. Requirements

### 4.1 Mandatory Requirements (HIGH Priority)

| ID | Requirement | Pattern |
|----|-------------|---------|
| M-001 | The system **shall** provide section.masonry token for Pinterest-style waterfall grid layouts with configurable column count and gap spacing | section.masonry |
| M-002 | The system **shall** provide section.sticky-header token that keeps the header fixed at viewport top during scroll | section.sticky-header |
| M-003 | The system **shall** provide section.sticky-footer token that keeps the footer fixed at viewport bottom | section.sticky-footer |
| M-004 | The system **shall** provide section.collapsible-sidebar token with expand/collapse toggle capability and persistent state | section.collapsible-sidebar |

### 4.2 Conditional Requirements (MEDIUM Priority)

| ID | Requirement | Pattern |
|----|-------------|---------|
| C-001 | **WHEN** user scrolls down beyond threshold **THEN** section.scroll-collapse-header shall collapse to compact height | section.scroll-collapse-header |
| C-002 | **WHEN** user scrolls up **THEN** section.scroll-reveal-footer shall reveal from hidden state | section.scroll-reveal-footer |
| C-003 | **WHEN** viewport width exceeds breakpoint **THEN** section.multipane-master-detail shall display master and detail panes side-by-side | section.multipane-master-detail |

### 4.3 Optional Requirements (LOW Priority)

| ID | Requirement | Pattern |
|----|-------------|---------|
| O-001 | **Where possible**, section.multipane-three-pane shall provide navigation, list, and detail panes for complex applications | section.multipane-three-pane |
| O-002 | **Where possible**, section.foldable-split shall detect foldable hinge and split content across screens | section.foldable-split |
| O-003 | **Where possible**, section.foldable-span shall span content across the fold when beneficial | section.foldable-span |

### 4.4 State-Driven Requirements

| ID | Requirement |
|----|-------------|
| S-001 | **IF** sidebar is collapsed **THEN** content area shall expand to fill available width |
| S-002 | **IF** device is in dual-screen mode **THEN** foldable tokens shall activate split/span behavior |
| S-003 | **IF** master pane item is selected **THEN** detail pane shall display corresponding content |

### 4.5 Unwanted Behaviors

| ID | Requirement |
|----|-------------|
| U-001 | The system **shall NOT** cause layout shift (CLS) when sticky elements transition |
| U-002 | The system **shall NOT** break scrolling behavior when multiple sticky elements are present |

---

## 5. Technical Specifications

### 5.1 Masonry Pattern Token

```typescript
/**
 * Masonry layout token for Pinterest-style waterfall grid
 */
export interface MasonrySectionToken extends SectionToken {
  id: 'section.masonry';

  /** Number of columns */
  columns: ResponsiveConfig<number>;

  /** Gap between items */
  gap: TokenReference;

  /** Item alignment within column */
  itemAlignment: 'start' | 'center' | 'stretch';

  /** Enable CSS masonry (future spec) or JS fallback */
  implementation: 'css-grid' | 'css-columns' | 'js-layout';
}

export const SECTION_MASONRY: MasonrySectionToken = {
  id: 'section.masonry',
  description: 'Pinterest-style waterfall grid layout',
  columns: {
    default: 2,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    '2xl': 6,
  },
  gap: 'atomic.spacing.4',
  itemAlignment: 'start',
  implementation: 'css-columns',
  responsive: { default: {}, md: {}, lg: {} },
  tokenBindings: {},
};
```

### 5.2 Sticky Header/Footer Token

```typescript
/**
 * Sticky positioning token
 */
export interface StickyPositionToken extends SectionToken {
  /** Position type */
  position: 'top' | 'bottom';

  /** Offset from viewport edge */
  offset: TokenReference;

  /** Z-index for stacking */
  zIndex: number;

  /** Background color for overlap visibility */
  backgroundColor: TokenReference;

  /** Shadow when stuck */
  stuckShadow?: TokenReference;
}

export const SECTION_STICKY_HEADER: StickyPositionToken = {
  id: 'section.sticky-header',
  description: 'Header that sticks to viewport top during scroll',
  position: 'top',
  offset: 'atomic.spacing.0',
  zIndex: 100,
  backgroundColor: 'atomic.color.background',
  stuckShadow: 'atomic.shadow.md',
  responsive: { default: {}, md: {} },
  tokenBindings: {},
};

export const SECTION_STICKY_FOOTER: StickyPositionToken = {
  id: 'section.sticky-footer',
  description: 'Footer that sticks to viewport bottom',
  position: 'bottom',
  offset: 'atomic.spacing.0',
  zIndex: 100,
  backgroundColor: 'atomic.color.background',
  stuckShadow: 'atomic.shadow.md',
  responsive: { default: {}, md: {} },
  tokenBindings: {},
};
```

### 5.3 Scroll-Aware Behavior Tokens

```typescript
/**
 * Scroll-collapse header token
 */
export interface ScrollCollapseHeaderToken extends SectionToken {
  id: 'section.scroll-collapse-header';

  /** Full height when expanded */
  expandedHeight: TokenReference;

  /** Compact height when collapsed */
  collapsedHeight: TokenReference;

  /** Scroll threshold to trigger collapse (px) */
  collapseThreshold: number;

  /** Transition duration */
  transitionDuration: string;

  /** Elements to hide when collapsed */
  collapsibleElements?: string[];
}

export const SECTION_SCROLL_COLLAPSE_HEADER: ScrollCollapseHeaderToken = {
  id: 'section.scroll-collapse-header',
  description: 'Header that collapses to compact size on scroll down',
  expandedHeight: 'atomic.spacing.20',
  collapsedHeight: 'atomic.spacing.14',
  collapseThreshold: 100,
  transitionDuration: '200ms',
  collapsibleElements: ['subtitle', 'search-bar'],
  responsive: { default: {}, md: {} },
  tokenBindings: {},
};

/**
 * Scroll-reveal footer token
 */
export interface ScrollRevealFooterToken extends SectionToken {
  id: 'section.scroll-reveal-footer';

  /** Height of footer */
  height: TokenReference;

  /** Scroll direction to trigger reveal */
  revealDirection: 'up' | 'any';

  /** Scroll threshold to trigger reveal (px) */
  revealThreshold: number;

  /** Transition duration */
  transitionDuration: string;
}

export const SECTION_SCROLL_REVEAL_FOOTER: ScrollRevealFooterToken = {
  id: 'section.scroll-reveal-footer',
  description: 'Footer that reveals when scrolling up',
  height: 'atomic.spacing.14',
  revealDirection: 'up',
  revealThreshold: 50,
  transitionDuration: '200ms',
  responsive: { default: {}, md: {} },
  tokenBindings: {},
};
```

### 5.4 Multi-Pane Layout Tokens

```typescript
/**
 * Master-detail (2-pane) layout token
 */
export interface MasterDetailToken extends SectionToken {
  id: 'section.multipane-master-detail';

  /** Master pane width */
  masterWidth: ResponsiveConfig<TokenReference>;

  /** Detail pane width */
  detailWidth: ResponsiveConfig<TokenReference>;

  /** Breakpoint for side-by-side display */
  splitBreakpoint: BreakpointKey;

  /** Divider configuration */
  divider?: {
    width: TokenReference;
    color: TokenReference;
    draggable: boolean;
  };
}

export const SECTION_MULTIPANE_MASTER_DETAIL: MasterDetailToken = {
  id: 'section.multipane-master-detail',
  description: '2-pane master-detail layout for productivity apps',
  masterWidth: {
    default: 'atomic.spacing.full',
    md: 'atomic.spacing.80',
    lg: 'atomic.spacing.96',
  },
  detailWidth: {
    default: 'atomic.spacing.full',
    md: 'atomic.spacing.flex-1',
    lg: 'atomic.spacing.flex-1',
  },
  splitBreakpoint: 'md',
  divider: {
    width: 'atomic.spacing.px',
    color: 'atomic.color.border',
    draggable: true,
  },
  responsive: { default: {}, md: {}, lg: {} },
  tokenBindings: {},
};

/**
 * Three-pane layout token
 */
export interface ThreePaneToken extends SectionToken {
  id: 'section.multipane-three-pane';

  /** Navigation pane width */
  navWidth: ResponsiveConfig<TokenReference>;

  /** List pane width */
  listWidth: ResponsiveConfig<TokenReference>;

  /** Content pane width */
  contentWidth: ResponsiveConfig<TokenReference>;

  /** Breakpoint for full 3-pane display */
  fullBreakpoint: BreakpointKey;
}

export const SECTION_MULTIPANE_THREE_PANE: ThreePaneToken = {
  id: 'section.multipane-three-pane',
  description: '3-pane layout for complex applications (nav, list, content)',
  navWidth: {
    default: 'atomic.spacing.0',
    lg: 'atomic.spacing.64',
    xl: 'atomic.spacing.72',
  },
  listWidth: {
    default: 'atomic.spacing.full',
    md: 'atomic.spacing.80',
    lg: 'atomic.spacing.80',
  },
  contentWidth: {
    default: 'atomic.spacing.full',
    md: 'atomic.spacing.flex-1',
    lg: 'atomic.spacing.flex-1',
  },
  fullBreakpoint: 'lg',
  responsive: { default: {}, md: {}, lg: {}, xl: {} },
  tokenBindings: {},
};
```

### 5.5 Foldable Device Tokens

```typescript
/**
 * Foldable split view token
 */
export interface FoldableSplitToken extends SectionToken {
  id: 'section.foldable-split';

  /** Hinge detection method */
  hingeDetection: 'css-env' | 'js-api';

  /** Content distribution across screens */
  distribution: 'equal' | 'master-detail';

  /** Hinge gap handling */
  hingeGap: TokenReference;

  /** Fallback for non-foldable devices */
  fallbackBehavior: 'stack' | 'side-by-side';
}

export const SECTION_FOLDABLE_SPLIT: FoldableSplitToken = {
  id: 'section.foldable-split',
  description: 'Split content across foldable device screens',
  hingeDetection: 'css-env',
  distribution: 'equal',
  hingeGap: 'env(fold-width, 0px)',
  fallbackBehavior: 'side-by-side',
  responsive: { default: {}, md: {} },
  tokenBindings: {},
};

/**
 * Foldable spanning token
 */
export interface FoldableSpanToken extends SectionToken {
  id: 'section.foldable-span';

  /** Span across fold for content continuity */
  spanContent: boolean;

  /** Content types that should span */
  spannableContent: ('image' | 'video' | 'map' | 'canvas')[];

  /** Handle hinge overlay */
  hingeOverlay: 'none' | 'gradient' | 'shadow';
}

export const SECTION_FOLDABLE_SPAN: FoldableSpanToken = {
  id: 'section.foldable-span',
  description: 'Span content across foldable device fold',
  spanContent: true,
  spannableContent: ['image', 'video', 'map'],
  hingeOverlay: 'shadow',
  responsive: { default: {}, md: {} },
  tokenBindings: {},
};
```

### 5.6 Collapsible Sidebar Token

```typescript
/**
 * Collapsible sidebar token
 */
export interface CollapsibleSidebarToken extends SectionToken {
  id: 'section.collapsible-sidebar';

  /** Expanded width */
  expandedWidth: TokenReference;

  /** Collapsed width (icon-only mode) */
  collapsedWidth: TokenReference;

  /** Position */
  position: 'left' | 'right';

  /** Default state */
  defaultCollapsed: boolean;

  /** Persist state to localStorage */
  persistState: boolean;

  /** Collapse trigger breakpoint */
  autoCollapseBreakpoint?: BreakpointKey;

  /** Transition configuration */
  transition: {
    duration: string;
    easing: string;
  };

  /** Toggle button configuration */
  toggleButton: {
    position: 'top' | 'bottom' | 'middle';
    visible: boolean;
  };
}

export const SECTION_COLLAPSIBLE_SIDEBAR: CollapsibleSidebarToken = {
  id: 'section.collapsible-sidebar',
  description: 'Sidebar with expand/collapse toggle capability',
  expandedWidth: 'atomic.spacing.64',
  collapsedWidth: 'atomic.spacing.16',
  position: 'left',
  defaultCollapsed: false,
  persistState: true,
  autoCollapseBreakpoint: 'md',
  transition: {
    duration: '200ms',
    easing: 'ease-in-out',
  },
  toggleButton: {
    position: 'bottom',
    visible: true,
  },
  responsive: { default: {}, md: {}, lg: {} },
  tokenBindings: {},
};
```

---

## 6. File Structure

| File | Type | Description |
|------|------|-------------|
| `packages/core/src/layout-tokens/types.ts` | Extend | Add MasonrySectionToken, StickyPositionToken, etc. |
| `packages/core/src/layout-tokens/sections-advanced.ts` | New | 10 advanced section pattern tokens |
| `packages/core/src/layout-tokens/scroll-behavior.ts` | New | Scroll detection utilities |
| `packages/core/src/layout-tokens/foldable.ts` | New | Foldable device detection utilities |
| `packages/core/src/layout-tokens/index.ts` | Modify | Export new modules |
| `packages/core/src/layout-css-generator.ts` | Extend | CSS generation for new patterns |

---

## 7. Browser Compatibility

| Feature | Chrome | Safari | Firefox | Edge | Notes |
|---------|--------|--------|---------|------|-------|
| CSS Sticky | 91+ | 13+ | 59+ | 91+ | Full support |
| CSS Columns | All | All | All | All | For masonry fallback |
| CSS Grid Masonry | 117+ (flag) | 17+ (flag) | No | No | Experimental |
| Intersection Observer | 51+ | 12.1+ | 55+ | 79+ | For scroll behaviors |
| Screen Spanning API | No | No | No | 86+ | Edge/Surface only |
| CSS env(fold-*) | No | No | No | 86+ | Edge/Surface only |

### Fallback Strategy

- Masonry: Use CSS columns with `break-inside: avoid` for broad support
- Foldable: Graceful degradation to side-by-side or stacked layout
- Scroll behaviors: Progressive enhancement with Intersection Observer

---

## 8. Reference Documents

- [SPEC-LAYOUT-001](../SPEC-LAYOUT-001/spec.md) - Layout Token System
- [CSS Masonry Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Masonry_layout)
- [CSS Sticky Positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/position#sticky)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [CSS Screen Spanning](https://drafts.csswg.org/css-env-1/#screen-fold-env)
- [Building for Foldable Devices](https://web.dev/articles/building-for-foldable-devices)
