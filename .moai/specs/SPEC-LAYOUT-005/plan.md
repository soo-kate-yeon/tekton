# SPEC-LAYOUT-005: Implementation Plan

## Implementation Plan

### 1. Overview

| Item | Detail |
|------|--------|
| SPEC ID | SPEC-LAYOUT-005 |
| Title | Advanced Layout Patterns |
| Priority | MEDIUM |
| Estimated Complexity | High |
| Dependencies | SPEC-LAYOUT-001 (Completed), SPEC-LAYOUT-002 (Completed) |

---

### 2. Phase Breakdown

#### Phase 1: HIGH Priority Patterns (Primary Goals)

**Objective**: Implement 4 essential layout patterns with broad use cases

**Patterns**:
| # | Pattern | Token ID | Complexity |
|---|---------|----------|------------|
| 1.1 | Masonry Grid | section.masonry | High |
| 1.2 | Sticky Header | section.sticky-header | Medium |
| 1.3 | Sticky Footer | section.sticky-footer | Medium |
| 1.4 | Collapsible Sidebar | section.collapsible-sidebar | High |

**Tasks**:

| # | Task | File | Priority |
|---|------|------|----------|
| 1.1.1 | Define MasonrySectionToken interface | `types.ts` | High |
| 1.1.2 | Implement SECTION_MASONRY token | `sections-advanced.ts` | High |
| 1.1.3 | Create masonry CSS generator | `layout-css-generator.ts` | High |
| 1.1.4 | Write masonry unit tests | `__tests__/masonry.test.ts` | High |
| 1.2.1 | Define StickyPositionToken interface | `types.ts` | High |
| 1.2.2 | Implement SECTION_STICKY_HEADER token | `sections-advanced.ts` | High |
| 1.2.3 | Create sticky CSS generator | `layout-css-generator.ts` | High |
| 1.2.4 | Write sticky header unit tests | `__tests__/sticky.test.ts` | High |
| 1.3.1 | Implement SECTION_STICKY_FOOTER token | `sections-advanced.ts` | High |
| 1.3.2 | Write sticky footer unit tests | `__tests__/sticky.test.ts` | High |
| 1.4.1 | Define CollapsibleSidebarToken interface | `types.ts` | High |
| 1.4.2 | Implement SECTION_COLLAPSIBLE_SIDEBAR token | `sections-advanced.ts` | High |
| 1.4.3 | Create sidebar state management utilities | `sidebar-state.ts` | High |
| 1.4.4 | Create sidebar CSS generator | `layout-css-generator.ts` | High |
| 1.4.5 | Write collapsible sidebar unit tests | `__tests__/sidebar.test.ts` | High |

**Deliverables**:
- 4 section tokens implemented
- 4 TypeScript interfaces
- CSS generation for all patterns
- Unit tests with 85%+ coverage

---

#### Phase 2: MEDIUM Priority Patterns (Secondary Goals)

**Objective**: Implement 3 scroll-aware and multi-pane patterns

**Patterns**:
| # | Pattern | Token ID | Complexity |
|---|---------|----------|------------|
| 2.1 | Scroll Collapse Header | section.scroll-collapse-header | Medium |
| 2.2 | Scroll Reveal Footer | section.scroll-reveal-footer | Medium |
| 2.3 | Master-Detail Layout | section.multipane-master-detail | High |

**Tasks**:

| # | Task | File | Priority |
|---|------|------|----------|
| 2.1.1 | Define ScrollCollapseHeaderToken interface | `types.ts` | Medium |
| 2.1.2 | Implement SECTION_SCROLL_COLLAPSE_HEADER token | `sections-advanced.ts` | Medium |
| 2.1.3 | Create scroll behavior utilities | `scroll-behavior.ts` | Medium |
| 2.1.4 | Write scroll collapse unit tests | `__tests__/scroll-behavior.test.ts` | Medium |
| 2.2.1 | Define ScrollRevealFooterToken interface | `types.ts` | Medium |
| 2.2.2 | Implement SECTION_SCROLL_REVEAL_FOOTER token | `sections-advanced.ts` | Medium |
| 2.2.3 | Write scroll reveal unit tests | `__tests__/scroll-behavior.test.ts` | Medium |
| 2.3.1 | Define MasterDetailToken interface | `types.ts` | Medium |
| 2.3.2 | Implement SECTION_MULTIPANE_MASTER_DETAIL token | `sections-advanced.ts` | Medium |
| 2.3.3 | Create pane resize utilities | `multipane-utils.ts` | Medium |
| 2.3.4 | Create master-detail CSS generator | `layout-css-generator.ts` | Medium |
| 2.3.5 | Write master-detail unit tests | `__tests__/multipane.test.ts` | Medium |

**Deliverables**:
- 3 section tokens implemented
- Intersection Observer integration
- Draggable divider utility
- Unit tests with 80%+ coverage

---

#### Phase 3: LOW Priority Patterns (Final Goals)

**Objective**: Implement 3 advanced patterns for specialized use cases

**Patterns**:
| # | Pattern | Token ID | Complexity |
|---|---------|----------|------------|
| 3.1 | Three-Pane Layout | section.multipane-three-pane | Medium |
| 3.2 | Foldable Split | section.foldable-split | High |
| 3.3 | Foldable Span | section.foldable-span | Medium |

**Tasks**:

| # | Task | File | Priority |
|---|------|------|----------|
| 3.1.1 | Define ThreePaneToken interface | `types.ts` | Low |
| 3.1.2 | Implement SECTION_MULTIPANE_THREE_PANE token | `sections-advanced.ts` | Low |
| 3.1.3 | Create three-pane CSS generator | `layout-css-generator.ts` | Low |
| 3.1.4 | Write three-pane unit tests | `__tests__/multipane.test.ts` | Low |
| 3.2.1 | Define FoldableSplitToken interface | `types.ts` | Low |
| 3.2.2 | Implement SECTION_FOLDABLE_SPLIT token | `sections-advanced.ts` | Low |
| 3.2.3 | Create foldable detection utilities | `foldable.ts` | Low |
| 3.2.4 | Create foldable CSS generator | `layout-css-generator.ts` | Low |
| 3.2.5 | Write foldable split unit tests | `__tests__/foldable.test.ts` | Low |
| 3.3.1 | Define FoldableSpanToken interface | `types.ts` | Low |
| 3.3.2 | Implement SECTION_FOLDABLE_SPAN token | `sections-advanced.ts` | Low |
| 3.3.3 | Write foldable span unit tests | `__tests__/foldable.test.ts` | Low |

**Deliverables**:
- 3 section tokens implemented
- Foldable device detection utilities
- Graceful fallback for non-foldable devices
- Unit tests with 75%+ coverage

---

### 3. Technical Approach

#### 3.1 Masonry Layout Implementation

**CSS Columns Approach** (Primary - Broad Support):
```css
.masonry-container {
  column-count: var(--masonry-columns, 3);
  column-gap: var(--masonry-gap, 1rem);
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: var(--masonry-gap, 1rem);
}
```

**CSS Grid Masonry Approach** (Future - When Supported):
```css
.masonry-container {
  display: grid;
  grid-template-columns: repeat(var(--masonry-columns, 3), 1fr);
  grid-template-rows: masonry;
  gap: var(--masonry-gap, 1rem);
}
```

**Feature Detection**:
```typescript
function getMasonryImplementation(): 'css-grid' | 'css-columns' | 'js-layout' {
  if (CSS.supports('grid-template-rows', 'masonry')) {
    return 'css-grid';
  }
  return 'css-columns';
}
```

#### 3.2 Sticky Positioning Implementation

**CSS Sticky with Sentinel**:
```typescript
interface StickyConfig {
  position: 'top' | 'bottom';
  offset: string;
  onStuck?: (isStuck: boolean) => void;
}

function setupStickyObserver(element: HTMLElement, config: StickyConfig) {
  const sentinel = document.createElement('div');
  sentinel.className = 'sticky-sentinel';
  element.parentNode?.insertBefore(sentinel, element);

  const observer = new IntersectionObserver(
    ([entry]) => {
      element.classList.toggle('is-stuck', !entry.isIntersecting);
      config.onStuck?.(!entry.isIntersecting);
    },
    { threshold: [0] }
  );

  observer.observe(sentinel);
  return () => observer.disconnect();
}
```

#### 3.3 Scroll Behavior Implementation

**Intersection Observer for Collapse/Reveal**:
```typescript
function setupScrollCollapse(header: HTMLElement, config: ScrollCollapseConfig) {
  let lastScrollY = 0;
  let isCollapsed = false;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const shouldCollapse = currentScrollY > config.collapseThreshold;

    if (shouldCollapse !== isCollapsed) {
      isCollapsed = shouldCollapse;
      header.classList.toggle('is-collapsed', isCollapsed);
      header.style.height = isCollapsed
        ? config.collapsedHeight
        : config.expandedHeight;
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}
```

#### 3.4 Multi-Pane Layout Implementation

**CSS Grid with Draggable Divider**:
```css
.master-detail {
  display: grid;
  grid-template-columns: var(--master-width, 320px) 1px 1fr;
}

.divider {
  cursor: col-resize;
  background: var(--border-color);
}

.divider:hover {
  background: var(--primary-color);
}
```

**Resize Handler**:
```typescript
function setupPaneResize(container: HTMLElement, divider: HTMLElement) {
  let isResizing = false;
  let startX = 0;
  let startWidth = 0;

  divider.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startWidth = parseInt(getComputedStyle(container).getPropertyValue('--master-width'));
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const newWidth = startWidth + (e.clientX - startX);
    container.style.setProperty('--master-width', `${newWidth}px`);
  });

  document.addEventListener('mouseup', () => {
    isResizing = false;
  });
}
```

#### 3.5 Foldable Device Implementation

**CSS Environment Variables**:
```css
.foldable-split {
  display: grid;
  grid-template-columns:
    calc(50% - env(fold-width, 0px) / 2)
    env(fold-width, 0px)
    calc(50% - env(fold-width, 0px) / 2);
}
```

**JavaScript API Detection**:
```typescript
async function detectFoldableDevice(): Promise<FoldableInfo | null> {
  if ('getWindowSegments' in window.visualViewport) {
    const segments = await (window.visualViewport as any).getWindowSegments();
    if (segments.length > 1) {
      return {
        type: 'foldable',
        segments: segments.length,
        foldPosition: segments[0].width,
        foldWidth: segments[1].left - segments[0].right,
      };
    }
  }
  return null;
}
```

#### 3.6 Collapsible Sidebar Implementation

**State Management with localStorage**:
```typescript
const SIDEBAR_STATE_KEY = 'tekton-sidebar-collapsed';

interface SidebarState {
  collapsed: boolean;
  width?: number;
}

function getSidebarState(): SidebarState {
  try {
    const stored = localStorage.getItem(SIDEBAR_STATE_KEY);
    return stored ? JSON.parse(stored) : { collapsed: false };
  } catch {
    return { collapsed: false };
  }
}

function setSidebarState(state: SidebarState): void {
  try {
    localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(state));
  } catch {
    // localStorage not available
  }
}
```

**CSS Transition**:
```css
.collapsible-sidebar {
  width: var(--sidebar-width, 256px);
  transition: width var(--sidebar-transition-duration, 200ms) var(--sidebar-transition-easing, ease-in-out);
}

.collapsible-sidebar.is-collapsed {
  width: var(--sidebar-collapsed-width, 64px);
}
```

---

### 4. File Structure

```
packages/core/src/layout-tokens/
├── types.ts                     # Extend with new token interfaces
├── sections-advanced.ts         # 10 advanced section tokens (NEW)
├── scroll-behavior.ts           # Scroll detection utilities (NEW)
├── foldable.ts                  # Foldable device utilities (NEW)
├── multipane-utils.ts           # Multi-pane resize utilities (NEW)
├── sidebar-state.ts             # Sidebar state management (NEW)
├── index.ts                     # Update exports
└── __tests__/
    ├── masonry.test.ts          # Masonry tests (NEW)
    ├── sticky.test.ts           # Sticky positioning tests (NEW)
    ├── scroll-behavior.test.ts  # Scroll behavior tests (NEW)
    ├── multipane.test.ts        # Multi-pane tests (NEW)
    ├── foldable.test.ts         # Foldable tests (NEW)
    └── sidebar.test.ts          # Sidebar tests (NEW)
```

---

### 5. Dependencies

#### 5.1 Runtime Dependencies

None required - all implementations use native browser APIs:
- CSS Sticky positioning
- CSS Grid / CSS Columns
- Intersection Observer API
- localStorage API
- CSS Custom Properties

#### 5.2 Development Dependencies

```json
{
  "devDependencies": {
    "@testing-library/dom": "^9.3.0",
    "resize-observer-polyfill": "^1.5.1"
  }
}
```

---

### 6. Integration Points

| Integration | Description |
|-------------|-------------|
| Layout Token System | Extends existing SectionToken interface |
| CSS Generator | Adds new pattern-specific CSS generation |
| Theme System | Uses atomic tokens for colors, spacing |
| Responsive Config | Integrates with existing breakpoint system |

---

### 7. Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| CSS Masonry browser support | Medium | Use CSS columns fallback |
| Foldable API limited support | Low | Graceful degradation to standard layout |
| Scroll behavior performance | Medium | Use passive event listeners, throttle updates |
| Layout shift (CLS) | High | Reserve space, use contain: layout |
| localStorage availability | Low | Fallback to in-memory state |

---

### 8. Success Criteria

- [ ] 10 advanced section tokens implemented
- [ ] CSS generation for all patterns
- [ ] Masonry layout working across browsers
- [ ] Sticky positioning with stuck state detection
- [ ] Scroll collapse/reveal smooth animations
- [ ] Multi-pane draggable divider functional
- [ ] Foldable detection with graceful fallback
- [ ] Collapsible sidebar with state persistence
- [ ] Test coverage 80%+ overall
- [ ] No layout shift (CLS = 0) for sticky elements
- [ ] Performance: scroll handlers < 16ms per frame
