---
id: SPEC-PLAYGROUND-001
title: "Next.js 16 React Playground Implementation Plan"
created: "2026-01-25"
tags: ["SPEC-PLAYGROUND-001", "Implementation", "Plan"]
---

# SPEC-PLAYGROUND-001: Implementation Plan

## Overview

**Objective**: Build Next.js 16 React playground with timestamp-based preview routing, CSS variable theming, production layouts, and MCP server integration.

**Approach**: Next.js App Router with Server Components for initial render, Client Components for interactivity. CSS variable-based theming (provided by SPEC-COMPONENT-001) for HMR-compatible theme switching. Blueprint validation with Zod for runtime safety. Component rendering using @tekton/ui reference implementations.

**Estimated Complexity**: Medium - Next.js 16 Server Components are well-documented, CSS variable theming is provided by SPEC-COMPONENT-001, production layout implementation requires careful design.

**Dependencies**:
- **SPEC-COMPONENT-001** (CRITICAL): Provides @tekton/ui components, 3-Layer Token System, and CSS Variables generation. Must be completed before Milestone 3-5.

---

## Implementation Milestones

### Milestone 1: Next.js Project Setup

**Priority**: HIGH (Primary Goal)

**Objective**: Create Next.js 16 project with TypeScript, App Router, and essential dependencies.

**Tasks**:
1. Initialize Next.js 16 project with TypeScript and App Router
2. Configure `tsconfig.json` for strict mode and path aliases
3. Install dependencies:
   - Zod (validation)
   - @tekton/core (workspace) - types, schemas, theme loading
   - @tekton/ui (workspace) - **from SPEC-COMPONENT-001** - UI components
   - TanStack Query (optional) - data fetching
4. Set up ESLint and Prettier for code quality
5. Configure environment variables (MCP_SERVER_URL)
6. Create basic directory structure (app/, components/, lib/, styles/)

**Dependencies**: None (can proceed independently, but @tekton/ui usage starts at Milestone 3)

**Success Criteria**:
- Next.js dev server runs without errors
- TypeScript compiles with zero errors in strict mode
- Environment variables loaded correctly
- ESLint passes with zero warnings

**Test Coverage**: N/A (infrastructure setup)

---

### Milestone 2: Dynamic Routing and Data Fetching

**Priority**: HIGH (Primary Goal)

**Objective**: Implement `/preview/[timestamp]/[themeId]` dynamic routing with blueprint fetching.

**Tasks**:
1. Create `app/preview/[timestamp]/[themeId]/page.tsx` Server Component
2. Implement `fetchBlueprint` function in `lib/mcp-client.ts`
3. Add loading skeleton (`loading.tsx`) for Suspense boundary
4. Implement error boundary (`error.tsx`) for fetch failures
5. Add blueprint validation with Zod schema
6. Configure Next.js caching with `revalidate` option

**Dependencies**: Milestone 1 (Project Setup)

**Technical Approach**:
```tsx
// app/preview/[timestamp]/[themeId]/page.tsx
import { fetchBlueprint } from '@/lib/mcp-client';
import { BlueprintSchema } from '@/lib/schemas';
import { BlueprintRenderer } from '@/components/blueprint/BlueprintRenderer';

interface PageProps {
  params: Promise<{ timestamp: string; themeId: string }>;
}

export default async function PreviewPage({ params }: PageProps) {
  const { timestamp, themeId } = await params;

  const blueprint = await fetchBlueprint(timestamp);

  // Validate blueprint
  const validated = BlueprintSchema.safeParse(blueprint);
  if (!validated.success) {
    throw new Error(`Invalid blueprint: ${validated.error.message}`);
  }

  return <BlueprintRenderer blueprint={validated.data} themeId={themeId} />;
}
```

**Success Criteria**:
- Dynamic routes load correctly with valid timestamp/themeId
- Blueprint fetched from MCP server
- Zod validation catches invalid blueprints
- Loading skeleton displays during fetch
- Error boundary displays on fetch failure

**Test Coverage**: ≥ 85% for data fetching logic

---

### Milestone 3: Theme Integration with SPEC-COMPONENT-001

**Priority**: HIGH (Primary Goal)

**Objective**: Integrate CSS Variables from SPEC-COMPONENT-001's theme system for dynamic theming.

**Dependencies**:
- Milestone 2 (Dynamic Routing)
- **SPEC-COMPONENT-001** (3-Layer Token System, CSS Generation)

**Tasks**:
1. Import `generateThemeCSS` from `@tekton/core` (provided by SPEC-COMPONENT-001)
2. Inject pre-generated CSS Variables from theme into document head
3. Load theme from MCP server using `loadTheme` from `@tekton/core`
4. Add theme switching UI (`ThemeSwitch.tsx`) for URL parameter changes
5. Configure global CSS imports for @tekton/ui base styles

**Technical Approach**:
```tsx
// app/layout.tsx
import { generateThemeCSS } from '@tekton/core';
import '@tekton/ui/styles/tokens.css';  // Base CSS Variables

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* CSS Variables injected server-side or dynamically */}
      </head>
      <body>{children}</body>
    </html>
  );
}

// lib/theme-loader.ts
import { loadTheme, generateThemeCSS } from '@tekton/core';

export function loadThemeCSS(themeId: string): string {
  const theme = loadTheme(themeId);
  return generateThemeCSS(theme);  // Uses SPEC-COMPONENT-001 generator
}
```

**Success Criteria**:
- CSS Variables from SPEC-COMPONENT-001 loaded correctly
- Theme switching updates variables without page reload
- OKLCH colors render correctly in modern browsers
- Fallback values prevent broken layouts on theme load failure

**Test Coverage**: ≥ 85% for theme integration logic

**Note**: ThemeProvider implementation is provided by SPEC-COMPONENT-001's @tekton/ui package.

---

### Milestone 4: Production Layout Components

**Priority**: HIGH (Secondary Goal)

**Objective**: Implement 6 production-quality layout components (dashboard, landing, sidebar-left, sidebar-right, two-column, single-column).

**Tasks**:
1. Create `DashboardLayout.tsx` with header, sidebar, main, footer slots
2. Create `LandingLayout.tsx` with hero, features, cta, footer slots
3. Create `SidebarLeftLayout.tsx` and `SidebarRightLayout.tsx`
4. Create `TwoColumnLayout.tsx` and `SingleColumnLayout.tsx`
5. Implement slot-based component placement with `Layout.Slot` pattern
6. Add responsive breakpoints with CSS Grid/Flexbox
7. Style with CSS Modules and CSS variables

**Dependencies**: Milestone 3 (ThemeProvider)

**Technical Approach**:
```tsx
// components/layouts/DashboardLayout.tsx
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>{/* header slot */}</header>
      <aside className={styles.sidebar}>{/* sidebar slot */}</aside>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>{/* footer slot */}</footer>
    </div>
  );
}

DashboardLayout.Slot = function Slot({
  name,
  children
}: {
  name: string;
  children: React.ReactNode;
}) {
  return <div data-slot={name}>{children}</div>;
};
```

**CSS Module**:
```css
/* DashboardLayout.module.css */
.dashboard {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }

@media (max-width: 768px) {
  .dashboard {
    grid-template-areas:
      "header"
      "main"
      "footer";
    grid-template-columns: 1fr;
  }
  .sidebar { display: none; }
}
```

**Success Criteria**:
- All 6 layouts render correctly on desktop, tablet, mobile
- Slot-based component placement works correctly
- CSS Grid/Flexbox responsive behavior verified
- CSS variables applied to layout styles

**Test Coverage**: ≥ 85% for layout components

---

### Milestone 5: Blueprint Renderer with @tekton/ui Integration

**Priority**: HIGH (Secondary Goal)

**Objective**: Implement BlueprintRenderer that maps blueprint nodes to @tekton/ui components.

**Dependencies**:
- Milestone 4 (Production Layouts)
- **SPEC-COMPONENT-001** (@tekton/ui package with 20 reference components)

**Tasks**:
1. Import all 20 components from `@tekton/ui` (Button, Card, Input, Text, Heading, Image, Link, List, Form, Modal, Tabs, Table, Badge, Avatar, Dropdown, Checkbox, Radio, Switch, Slider, Progress)
2. Implement `ComponentResolver.tsx` for blueprint node → @tekton/ui component mapping
3. Implement `BlueprintRenderer.tsx` for layout + component assembly
4. Add unknown component placeholder handling
5. Validate component props with TypeScript using COMPONENT_SCHEMAS from @tekton/core

**Technical Approach**:
```tsx
// components/blueprint/ComponentResolver.tsx
import type { ComponentNode } from '@tekton/core';
import * as TektonUI from '@tekton/ui';  // Import from SPEC-COMPONENT-001

const COMPONENT_MAP = {
  Button: TektonUI.Button,
  Card: TektonUI.Card,
  Input: TektonUI.Input,
  Text: TektonUI.Text,
  Heading: TektonUI.Heading,
  Image: TektonUI.Image,
  Link: TektonUI.Link,
  List: TektonUI.List,
  Form: TektonUI.Form,
  Modal: TektonUI.Modal,
  Tabs: TektonUI.Tabs,
  Table: TektonUI.Table,
  Badge: TektonUI.Badge,
  Avatar: TektonUI.Avatar,
  Dropdown: TektonUI.Dropdown,
  Checkbox: TektonUI.Checkbox,
  Radio: TektonUI.Radio,
  Switch: TektonUI.Switch,
  Slider: TektonUI.Slider,
  Progress: TektonUI.Progress,
} as const;

export function ComponentResolver({ node }: { node: ComponentNode }) {
  const Component = COMPONENT_MAP[node.type as keyof typeof COMPONENT_MAP];

  if (!Component) {
    return <UnknownComponent type={node.type} />;
  }

  return (
    <Component {...node.props}>
      {node.children?.map((child, idx) =>
        typeof child === 'string' ? child : <ComponentResolver key={idx} node={child} />
      )}
    </Component>
  );
}

function UnknownComponent({ type }: { type: string }) {
  return (
    <div className="border-2 border-dashed border-red-500 p-4 rounded">
      Unknown component: {type}
    </div>
  );
}
```

**Success Criteria**:
- All 20 @tekton/ui components render correctly with props
- BlueprintRenderer maps blueprint nodes to components
- Unknown components render placeholder without crashing
- Component styles use CSS Variables from SPEC-COMPONENT-001

**Test Coverage**: ≥ 85% for component resolver and renderer

**Note**: Component implementations are provided by SPEC-COMPONENT-001. This milestone focuses on integration and rendering logic only.

---

### Milestone 6: Error Handling and Loading States

**Priority**: MEDIUM (Secondary Goal)

**Objective**: Implement comprehensive error handling, loading states, and skeleton UI.

**Tasks**:
1. Create loading skeletons matching layout structure
2. Implement error boundaries with retry mechanism
3. Add network error handling with offline mode indication
4. Create 404 page for invalid timestamps
5. Add error toast notifications (optional)
6. Implement graceful degradation for missing theme variables

**Dependencies**: Milestone 5 (Blueprint Renderer)

**Technical Approach**:
```tsx
// app/preview/[timestamp]/[themeId]/loading.tsx
import { DashboardLayoutSkeleton } from '@/components/skeletons';

export default function Loading() {
  return <DashboardLayoutSkeleton />;
}

// app/preview/[timestamp]/[themeId]/error.tsx
'use client';

export default function Error({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <h2>Failed to load preview</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Retry</button>
    </div>
  );
}
```

**Success Criteria**:
- Loading skeletons match layout structure
- Error boundaries catch and display errors gracefully
- Retry mechanism works for network failures
- 404 page displays for invalid timestamps

**Test Coverage**: ≥ 80% for error handling logic

---

### Milestone 7: Integration Testing and Optimization

**Priority**: MEDIUM (Final Goal)

**Objective**: End-to-end testing, performance optimization, and SPEC-MCP-002 integration verification.

**Tasks**:
1. Write Playwright E2E tests for preview workflow
2. Implement visual regression testing (Percy, Chromatic, or Playwright screenshots)
3. Run Lighthouse audits for performance, accessibility, best practices
4. Optimize bundle size with Next.js code splitting
5. Add `robots.txt` and SEO metadata
6. Test CORS configuration with MCP server
7. Verify integration with SPEC-MCP-002

**Dependencies**: Milestone 6 (Error Handling)

**Success Criteria**:
- All E2E tests pass
- Lighthouse score ≥ 90 (Performance, Accessibility, Best Practices)
- Visual regression tests detect unintended changes
- Bundle size < 200KB for initial route
- CORS allows MCP server requests

**Test Coverage**: ≥ 80% for E2E scenarios

---

## Technical Architecture

### Component Tree

```
app/
├── layout.tsx (Root Layout)
│   └── ThemeProvider (global theme context)
│
├── page.tsx (Home - Theme Gallery)
│
└── preview/[timestamp]/[themeId]/
    ├── page.tsx (Server Component)
    │   ├── fetchBlueprint()
    │   ├── loadTheme()
    │   └── BlueprintRenderer
    │       ├── LayoutComponent (Dashboard, Landing, etc.)
    │       │   └── Layout.Slot
    │       │       └── ComponentResolver
    │       │           └── UI Components (Button, Card, etc.)
    │       └── ThemeProvider (CSS variable injection)
    ├── loading.tsx (Skeleton)
    └── error.tsx (Error Boundary)
```

### Data Flow

```
User navigates to /preview/123/calm-wellness
    ↓
Next.js App Router resolves dynamic route
    ↓
Server Component renders
    ↓
fetchBlueprint(123) → HTTP GET to MCP server
fetchTheme('calm-wellness') → @tekton/core.loadTheme()
    ↓
BlueprintSchema.safeParse(blueprint) → Zod validation
    ↓
ThemeProvider injects CSS variables
    ↓
BlueprintRenderer maps components
    ↓
ComponentResolver renders UI components
    ↓
HTML streamed to client with CSS variables
```

---

## Testing Strategy

### Unit Tests
- **ThemeProvider**: CSS variable injection, theme loading
- **ComponentResolver**: Component mapping, unknown component handling
- **BlueprintRenderer**: Layout assembly, slot placement
- **MCP Client**: HTTP request handling, error states

### Integration Tests
- **Preview Page**: Full page rendering with blueprint and theme
- **Theme Switching**: URL parameter change updates CSS variables
- **Layout Rendering**: All 6 layouts render correctly
- **Component Catalog**: All 20 components render with props

### E2E Tests (Playwright)
- **Preview Workflow**: Navigate to preview URL, verify rendering
- **Theme Switch**: Change theme ID in URL, verify CSS variable update
- **Error Handling**: Simulate network failure, verify error UI
- **Responsive Design**: Test on desktop, tablet, mobile viewports

### Performance Tests
- **Lighthouse**: Performance, Accessibility, Best Practices scores
- **Bundle Size**: Measure initial route bundle size
- **Loading Time**: First Contentful Paint, Largest Contentful Paint
- **CLS**: Cumulative Layout Shift measurement

---

## Risk Mitigation

### OKLCH Browser Support Risk
- **Mitigation**: Feature detection, hex color fallbacks
- **Testing**: Cross-browser testing (Chrome, Safari, Firefox)
- **Contingency**: Server-side OKLCH → Hex conversion

### Dynamic Route Performance Risk
- **Mitigation**: React Suspense, Streaming SSR, ISR caching
- **Testing**: Performance benchmarking with Lighthouse
- **Contingency**: Pre-render common routes, edge caching

### Blueprint Rendering Errors Risk
- **Mitigation**: Zod validation, error boundaries, unknown component placeholders
- **Testing**: Invalid blueprint tests, error boundary verification
- **Contingency**: Graceful degradation with error UI

---

## Deployment Considerations

### Development Mode
- Local dev server: `npm run dev` on `http://localhost:3001`
- MCP server proxy: `http://localhost:3000`
- Hot Module Replacement enabled

### Production Mode
- Vercel deployment with Next.js automatic optimization
- Environment variables: `MCP_SERVER_URL`
- CDN caching for static assets
- ISR for preview pages (1 hour revalidation)

---

## Dependencies

### Internal Dependencies
- **SPEC-COMPONENT-001** (CRITICAL, BLOCKING):
  - @tekton/ui package with 20 reference components
  - 3-Layer Token System (Atomic → Semantic → Component)
  - CSS Variables generation pipeline
  - Component Schemas
  - **Status**: Must be completed before starting Milestone 3

- **@tekton/core**: Base types, theme loading, blueprint schemas
- **SPEC-MCP-002**: MCP server for blueprint fetching

### External Dependencies
- Next.js 16+
- React 19
- Zod
- TanStack Query (optional)

## Implementation Strategy

### Phase 1: Foundation (Can Start Immediately)
1. **Milestone 1-2**: Project setup and dynamic routing
2. **Parallel**: Wait for SPEC-COMPONENT-001 completion

### Phase 2: Integration (After SPEC-COMPONENT-001)
3. **Milestone 3**: Theme integration with @tekton/ui
4. **Milestone 4**: Production layouts (custom implementation)
5. **Milestone 5**: Blueprint renderer with @tekton/ui components

### Phase 3: Polish
6. **Milestone 6-7**: Error handling and testing

## Next Steps

### Immediate Actions
1. ✅ **Dependency Resolution**: SPEC-COMPONENT-001 identified as blocking dependency
2. 🔄 **Development Order**: Start SPEC-COMPONENT-001 first (/moai:2-run SPEC-COMPONENT-001)
3. ⏸️ **SPEC-PLAYGROUND-001**: Begin Milestone 1-2, pause at Milestone 3 until SPEC-COMPONENT-001 completes

### After SPEC-COMPONENT-001 Completion
1. **Verify @tekton/ui**: Ensure all 20 components are available
2. **Implement Milestone 3-5**: Theme integration and component rendering
3. **Test integration**: Verify blueprint → @tekton/ui → rendered preview
4. **Implement Milestone 6-7**: Error handling and optimization

**Recommended Workflow**:
```bash
# Step 1: Complete SPEC-COMPONENT-001 first
/moai:2-run SPEC-COMPONENT-001

# Step 2: After SPEC-COMPONENT-001 is done, start SPEC-PLAYGROUND-001
/moai:2-run SPEC-PLAYGROUND-001
```

**Implementation Branch**: `feature/SPEC-PLAYGROUND-001`

---

**Last Updated**: 2026-01-25
**Status**: Planned (Blocked by SPEC-COMPONENT-001)
**Ready for**: Wait for SPEC-COMPONENT-001 completion, then /moai:2-run SPEC-PLAYGROUND-001

---

## Change Log

### 2026-01-25 - Dependency Resolution
- **Identified**: Component implementation overlap with SPEC-COMPONENT-001
- **Resolved**: Removed duplicate 20 component implementations
- **Changed**: Milestone 3 - Now uses @tekton/ui theme system
- **Changed**: Milestone 5 - Now imports components from @tekton/ui
- **Added**: SPEC-COMPONENT-001 as critical blocking dependency
- **Updated**: Implementation strategy to sequential execution (COMPONENT → PLAYGROUND)
