# SPEC-LAYOUT-001: Implementation Plan

## TAG
- **SPEC-ID**: SPEC-LAYOUT-001
- **Related**: SPEC-COMPONENT-001-A, SPEC-COMPONENT-001-B, SPEC-LAYOUT-002

---

## Overview

This plan outlines the implementation strategy for the Layout Token System, extending Tekton's 3-layer token architecture with a 4th Layout layer.

## Technical Approach

### Architecture Design

**Layer 4 Integration Pattern:**
```
Existing Pipeline:
  Theme → resolveToken() → CSS Variables

Extended Pipeline:
  Theme → resolveToken() → CSS Variables
                ↓
  Layout → resolveLayout() → Layout CSS Variables
                ↓
  Blueprint → createBlueprint() → Screen Structure
```

**Module Dependency Graph:**
```
layout-tokens/types.ts (interfaces)
         ↓
layout-tokens/shells.ts ─────┐
layout-tokens/pages.ts ──────┼→ layout-resolver.ts → layout-css-generator.ts
layout-tokens/sections.ts ───┤
layout-tokens/responsive.ts ─┘
         ↓
layout-validation.ts (Zod schemas)
         ↓
blueprint.ts (createBlueprint extension)
```

---

## Milestones

### Primary Goal: Core Type System

**Tasks:**
1. Define TypeScript interfaces for all layout token types
2. Create Zod schemas for runtime validation
3. Establish file structure and exports

**Deliverables:**
- `layout-tokens/types.ts` - All TypeScript interfaces
- `layout-validation.ts` - Zod schemas
- Unit tests for type validation

**Acceptance Criteria:**
- All interfaces compile in strict mode
- Zod schemas validate sample data correctly
- 100% type coverage

### Secondary Goal: Token Implementations

**Tasks:**
1. Implement 6 shell tokens (app, marketing, auth, dashboard, admin, minimal)
2. Implement 8 page layout tokens (job, resource, dashboard, settings, detail, empty, wizard, onboarding)
3. Implement 12 section pattern tokens (grid-*, split-*, stack-*, sidebar-*, container)
4. Implement 5 responsive tokens (sm, md, lg, xl, 2xl)

**Deliverables:**
- `layout-tokens/shells.ts` - 6 shell definitions
- `layout-tokens/pages.ts` - 8 page layout definitions
- `layout-tokens/sections.ts` - 12 section pattern definitions
- `layout-tokens/responsive.ts` - 5 responsive token definitions
- Comprehensive unit tests for each token type

**Acceptance Criteria:**
- All tokens pass Zod validation
- Token bindings reference valid atomic/semantic tokens
- CSS property values are valid

### Tertiary Goal: Core Functions

**Tasks:**
1. Implement `resolveLayout()` function
2. Implement `generateLayoutCSS()` function
3. Update `createBlueprint()` for layout token support

**Deliverables:**
- `layout-resolver.ts` - Layout resolution logic
- `layout-css-generator.ts` - CSS generation for layouts
- Updated `blueprint.ts` with layoutToken support

**Acceptance Criteria:**
- resolveLayout() returns complete layout configuration
- generateLayoutCSS() produces valid CSS
- createBlueprint() accepts and processes layout tokens

### Final Goal: Integration & Testing

**Tasks:**
1. Integrate with existing token system
2. Update package exports
3. Achieve >=85% test coverage
4. Document migration path

**Deliverables:**
- Updated `index.ts` with all exports
- Test coverage report
- API documentation
- Migration guide

**Acceptance Criteria:**
- All exports accessible from `@tekton/core`
- Test coverage >=85%
- No breaking changes to existing API
- Documentation complete

---

## Task Breakdown

### TASK-001: TypeScript Interface Definitions

**Priority**: High (Primary Goal)

**Description**: Define all TypeScript interfaces for the layout token system.

**Implementation Details:**
```typescript
// layout-tokens/types.ts

// Shell Token Types
export interface ShellToken {
  id: string;
  description: string;
  platform: 'web' | 'mobile' | 'desktop';
  regions: ShellRegion[];
  responsive: ResponsiveConfig<ShellConfig>;
  tokenBindings: TokenBindings;
}

export interface ShellRegion {
  name: string;
  position: 'top' | 'left' | 'right' | 'bottom' | 'center';
  size: TokenReference;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

// Page Layout Token Types
export interface PageLayoutToken {
  id: string;
  description: string;
  purpose: PagePurpose;
  sections: SectionSlot[];
  responsive: ResponsiveConfig<PageConfig>;
  tokenBindings: TokenBindings;
}

// Section Pattern Token Types
export interface SectionPatternToken {
  id: string;
  type: SectionType;
  description: string;
  css: SectionCSS;
  responsive: ResponsiveConfig<SectionCSS>;
  tokenBindings: TokenBindings;
}

// Responsive Token Types
export interface ResponsiveToken {
  id: string;
  minWidth: number;
  maxWidth?: number;
  description: string;
}
```

**Estimated Complexity**: Medium
**Dependencies**: None

---

### TASK-002: Shell Token Implementations

**Priority**: High (Secondary Goal)

**Description**: Implement 6 shell token definitions.

**Implementation Details:**
```typescript
// layout-tokens/shells.ts

export const SHELL_TOKENS: Record<string, ShellToken> = {
  'shell.web.app': {
    id: 'shell.web.app',
    description: 'Standard web application layout with header and sidebar',
    platform: 'web',
    regions: [
      { name: 'header', position: 'top', size: 'atomic.spacing.16' },
      { name: 'sidebar', position: 'left', size: 'atomic.spacing.64', collapsible: true },
      { name: 'main', position: 'center', size: 'auto' },
    ],
    responsive: {
      default: { sidebarVisible: true },
      md: { sidebarVisible: false, sidebarOverlay: true },
    },
    tokenBindings: {
      background: 'semantic.background.default',
      border: 'semantic.border.default',
    },
  },
  // ... 5 more shells
};
```

**Shells to Implement:**
1. `shell.web.app` - Standard app layout
2. `shell.web.marketing` - Marketing pages
3. `shell.web.auth` - Authentication flows
4. `shell.web.dashboard` - Admin dashboards
5. `shell.web.admin` - Admin panels
6. `shell.web.minimal` - Minimal UI

**Estimated Complexity**: Medium
**Dependencies**: TASK-001

---

### TASK-003: Page Layout Token Implementations

**Priority**: High (Secondary Goal)

**Description**: Implement 8 page layout token definitions.

**Implementation Details:**
```typescript
// layout-tokens/pages.ts

export const PAGE_LAYOUT_TOKENS: Record<string, PageLayoutToken> = {
  'page.dashboard': {
    id: 'page.dashboard',
    description: 'Dashboard layout with metrics, charts, and tables',
    purpose: 'dashboard',
    sections: [
      { name: 'metrics', pattern: 'section.grid-4', required: true },
      { name: 'charts', pattern: 'section.grid-2', required: false },
      { name: 'table', pattern: 'section.container', required: false },
    ],
    responsive: {
      default: { columns: 4 },
      lg: { columns: 2 },
      md: { columns: 1 },
    },
    tokenBindings: {
      gap: 'atomic.spacing.6',
      padding: 'atomic.spacing.8',
    },
  },
  // ... 7 more page layouts
};
```

**Pages to Implement:**
1. `page.job` - Task execution
2. `page.resource` - CRUD operations
3. `page.dashboard` - Data overview
4. `page.settings` - Configuration
5. `page.detail` - Item focus
6. `page.empty` - Empty state
7. `page.wizard` - Multi-step flow
8. `page.onboarding` - First-run experience

**Estimated Complexity**: Medium
**Dependencies**: TASK-001

---

### TASK-004: Section Pattern Token Implementations

**Priority**: High (Secondary Goal)

**Description**: Implement 12 section pattern token definitions.

**Implementation Details:**
```typescript
// layout-tokens/sections.ts

export const SECTION_PATTERN_TOKENS: Record<string, SectionPatternToken> = {
  'section.grid-3': {
    id: 'section.grid-3',
    type: 'grid',
    description: '3-column grid layout',
    css: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'atomic.spacing.6',
    },
    responsive: {
      default: { gridTemplateColumns: 'repeat(3, 1fr)' },
      md: { gridTemplateColumns: 'repeat(2, 1fr)' },
      sm: { gridTemplateColumns: '1fr' },
    },
    tokenBindings: {
      gap: 'atomic.spacing.6',
    },
  },
  // ... 11 more section patterns
};
```

**Patterns to Implement:**
1. `section.grid-2` - 2-column grid
2. `section.grid-3` - 3-column grid
3. `section.grid-4` - 4-column grid
4. `section.grid-auto` - Auto-fill grid
5. `section.split-30-70` - 30/70 split
6. `section.split-50-50` - 50/50 split
7. `section.split-70-30` - 70/30 split
8. `section.stack-start` - Top-aligned stack
9. `section.stack-center` - Centered stack
10. `section.stack-end` - Bottom-aligned stack
11. `section.sidebar-left` - Left sidebar
12. `section.sidebar-right` - Right sidebar
13. `section.container` - Centered container

**Estimated Complexity**: Medium
**Dependencies**: TASK-001

---

### TASK-005: Responsive Token Implementations

**Priority**: High (Secondary Goal)

**Description**: Implement 5 responsive breakpoint tokens.

**Implementation Details:**
```typescript
// layout-tokens/responsive.ts

export const RESPONSIVE_TOKENS: Record<string, ResponsiveToken> = {
  'breakpoint.sm': {
    id: 'breakpoint.sm',
    minWidth: 640,
    description: 'Mobile landscape and larger',
  },
  'breakpoint.md': {
    id: 'breakpoint.md',
    minWidth: 768,
    description: 'Tablet and larger',
  },
  'breakpoint.lg': {
    id: 'breakpoint.lg',
    minWidth: 1024,
    description: 'Desktop and larger',
  },
  'breakpoint.xl': {
    id: 'breakpoint.xl',
    minWidth: 1280,
    description: 'Large desktop and larger',
  },
  'breakpoint.2xl': {
    id: 'breakpoint.2xl',
    minWidth: 1536,
    description: 'Wide screen and larger',
  },
};
```

**Estimated Complexity**: Low
**Dependencies**: TASK-001

---

### TASK-006: resolveLayout() Implementation

**Priority**: High (Tertiary Goal)

**Description**: Implement layout token resolution function.

**Implementation Details:**
```typescript
// layout-resolver.ts

export function resolveLayout(layoutId: string): ResolvedLayout {
  const [level, platform, name] = layoutId.split('.');

  // Resolve shell
  const shell = level === 'shell' ? resolveShell(layoutId) : undefined;

  // Resolve page layout
  const page = level === 'page' ? resolvePageLayout(layoutId) : undefined;

  // Resolve all section patterns
  const sections = resolveSections(page?.sections || []);

  // Generate CSS variables
  const cssVariables = generateLayoutVariables(shell, page, sections);

  // Generate media queries
  const mediaQueries = generateMediaQueries(shell, page, sections);

  return {
    shell,
    page,
    sections,
    cssVariables,
    mediaQueries,
  };
}
```

**Estimated Complexity**: High
**Dependencies**: TASK-002, TASK-003, TASK-004, TASK-005

---

### TASK-007: generateLayoutCSS() Integration

**Priority**: High (Tertiary Goal)

**Description**: Implement CSS generation for layout tokens.

**Implementation Details:**
```typescript
// layout-css-generator.ts

export function generateLayoutCSS(layoutTokens: LayoutTokens): string {
  let css = '';

  // Root CSS variables
  css += ':root {\n';
  css += generateShellVariables(layoutTokens.shells);
  css += generatePageVariables(layoutTokens.pages);
  css += generateSectionVariables(layoutTokens.sections);
  css += '}\n\n';

  // Utility classes
  css += generateShellClasses(layoutTokens.shells);
  css += generateSectionClasses(layoutTokens.sections);

  // Media queries
  css += generateResponsiveCSS(layoutTokens);

  return css;
}
```

**Estimated Complexity**: High
**Dependencies**: TASK-006

---

### TASK-008: createBlueprint() Extension

**Priority**: Medium (Tertiary Goal)

**Description**: Update createBlueprint() to support layout tokens.

**Implementation Details:**
```typescript
// blueprint.ts (update)

export interface CreateBlueprintInput {
  name: string;
  description?: string;
  themeId: string;
  layout: LayoutType;
  layoutToken?: string;    // NEW
  pageLayout?: string;     // NEW
  components: ComponentNode[];
}

export function createBlueprint(input: CreateBlueprintInput): Blueprint {
  // Validate layout token if provided
  if (input.layoutToken) {
    validateLayoutToken(input.layoutToken);
  }

  // Resolve layout configuration
  const layoutConfig = input.layoutToken
    ? resolveLayout(input.layoutToken)
    : undefined;

  // Create blueprint with layout
  return {
    id: generateId(),
    name: input.name,
    description: input.description,
    themeId: input.themeId,
    layout: input.layout,
    layoutToken: input.layoutToken,
    layoutConfig,
    components: input.components,
  };
}
```

**Estimated Complexity**: Medium
**Dependencies**: TASK-006

---

### TASK-009: Zod Validation Schemas

**Priority**: High (Primary Goal)

**Description**: Create Zod schemas for all layout token types.

**Implementation Details:**
```typescript
// layout-validation.ts

import { z } from 'zod';

export const ShellRegionSchema = z.object({
  name: z.string().min(1),
  position: z.enum(['top', 'left', 'right', 'bottom', 'center']),
  size: z.string(),
  collapsible: z.boolean().optional(),
  defaultCollapsed: z.boolean().optional(),
});

export const ShellTokenSchema = z.object({
  id: z.string().regex(/^shell\.[a-z]+\.[a-z-]+$/),
  description: z.string(),
  platform: z.enum(['web', 'mobile', 'desktop']),
  regions: z.array(ShellRegionSchema),
  responsive: z.record(z.any()),
  tokenBindings: z.record(z.string()),
});

// ... schemas for PageLayoutToken, SectionPatternToken, ResponsiveToken
```

**Estimated Complexity**: Medium
**Dependencies**: TASK-001

---

### TASK-010: Test Coverage (>=85%)

**Priority**: High (Final Goal)

**Description**: Write comprehensive tests for all layout token modules.

**Test Categories:**
1. Type validation tests
2. Shell token tests
3. Page layout tests
4. Section pattern tests
5. Responsive token tests
6. Layout resolver tests
7. CSS generator tests
8. Blueprint integration tests

**Estimated Complexity**: High
**Dependencies**: TASK-001 through TASK-009

---

## Risks and Mitigation

### Risk 1: Schema Complexity
**Mitigation**: Start with minimal viable schema, iterate based on usage patterns

### Risk 2: Performance Overhead
**Mitigation**: Implement caching for resolved layouts, benchmark critical paths

### Risk 3: Breaking Changes
**Mitigation**: Maintain backward compatibility, use deprecation warnings

### Risk 4: Integration Issues
**Mitigation**: Early integration testing, incremental feature rollout

---

## Architecture Decisions

### Decision 1: Separate Layout Module vs Inline Extension

**Choice**: Separate `layout-tokens/` directory with dedicated modules

**Rationale**:
- Clear separation of concerns
- Easier testing and maintenance
- Independent versioning potential
- Cleaner import paths

### Decision 2: Zod for Validation vs TypeScript Only

**Choice**: Zod runtime validation alongside TypeScript

**Rationale**:
- LLM-generated layouts require runtime validation
- Zod provides detailed error messages
- Consistent with existing SPEC-COMPONENT-001-B pattern

### Decision 3: CSS Variables vs Utility Classes

**Choice**: Both CSS variables AND utility classes

**Rationale**:
- CSS variables for theming flexibility
- Utility classes for rapid prototyping
- Supports multiple styling approaches

---

## Dependencies Summary

```
TASK-001 (Types) ─┬→ TASK-002 (Shells) ──┐
                  ├→ TASK-003 (Pages) ───┤
                  ├→ TASK-004 (Sections) ┼→ TASK-006 (Resolver) → TASK-007 (CSS)
                  ├→ TASK-005 (Responsive)┤         ↓
                  └→ TASK-009 (Zod) ──────┘  TASK-008 (Blueprint)
                                                    ↓
                                             TASK-010 (Tests)
```

---

**Last Updated**: 2026-01-26
**Status**: Planned
