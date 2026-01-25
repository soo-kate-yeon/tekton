---
id: SPEC-PLAYGROUND-001
version: "1.0.0"
status: "planned"
created: "2026-01-25"
author: "MoAI-ADK"
priority: "HIGH"
lifecycle: "spec-anchored"
tags: ["SPEC-PLAYGROUND-001", "React", "Next.js", "Playground", "Preview"]
---

## HISTORY
- 2026-01-25 v1.0.0: Initial SPEC creation - Next.js 16 React Playground with Timestamp-Based Preview System

---

# SPEC-PLAYGROUND-001: Next.js 16 React Playground with Timestamp-Based Preview

## Executive Summary

**Purpose**: Build Next.js 16 React playground for live preview of Tekton-generated screens with timestamp-based routing, real-time theme switching, and production-quality layout rendering. Provides visual feedback for AI-generated blueprints with immutable history management.

**Scope**: Create Next.js 16 App Router application with dynamic routing (`/preview/[timestamp]/[themeId]`), ThemeProvider with CSS variable injection, production layout components (Dashboard, Landing, etc.), and MCP client integration for blueprint fetching.

**Priority**: HIGH - Enables visual verification of Claude Code-generated screens with instant theme quality comparison.

**Impact**: Transforms blueprint JSON into visual screens with OKLCH-based theming. Users see production-quality layouts in real-time without manual coding, enabling rapid design iteration and theme selection.

**Differentiators vs Google Stitch**:
- **CSS Variable Theming**: HMR-compatible theming without full page reload
- **Production Layouts**: Real dashboard/landing layouts vs component library demos
- **Immutable History**: Timestamp-based URLs preserve all design iterations
- **OKLCH Color System**: Perceptually uniform color rendering vs RGB approximations
- **Type-Safe Components**: TypeScript with Zod validation prevents runtime errors

---

## ENVIRONMENT

### Current System Context

**Target Technology Stack:**
- **Next.js**: 16+ (App Router with React 19 Server Components)
- **React**: 19 (Server Components, `use` hook, Actions)
- **TypeScript**: 5.7+ (Strict mode)
- **Styling**: CSS Modules + CSS Variables (OKLCH support)
- **State Management**: React Context + Zustand (for client state)
- **Data Fetching**: TanStack Query (React Query v5)
- **Validation**: Zod 3.23+ (Blueprint schema validation)

**Integration Points:**
- **SPEC-MCP-002**: Fetch blueprints and theme data via HTTP endpoints
- **@tekton/core**: Reuse type definitions (Blueprint, Theme, ComponentNode)
- **MCP Server**: Connect to `http://localhost:3000` for preview data

**Deployment Environment:**
- **Development**: Local Next.js dev server (`npm run dev`)
- **Production**: Vercel or self-hosted Node.js server

---

## ASSUMPTIONS

### Technical Assumptions

**A-001: Next.js 16 Stability**
- **Assumption**: Next.js 16 App Router is production-ready with stable Server Components API
- **Confidence**: HIGH
- **Evidence**: Next.js 15 stabilized App Router, version 16 is incremental improvement
- **Risk if Wrong**: Breaking API changes require migration effort
- **Validation**: Next.js 16 release notes review, community feedback monitoring

**A-002: CSS Variable Browser Support**
- **Assumption**: Target browsers support CSS custom properties and `oklch()` color function
- **Confidence**: HIGH
- **Evidence**: 95%+ browser support for CSS variables, modern browsers support `oklch()`
- **Risk if Wrong**: Fallback to hex colors required for older browsers
- **Validation**: Browser compatibility testing (Chrome 111+, Safari 15+, Firefox 113+)

**A-003: Dynamic Route Performance**
- **Assumption**: Dynamic routing with `[timestamp]/[themeId]` achieves < 200ms initial load time
- **Confidence**: MEDIUM
- **Evidence**: Next.js App Router optimizes dynamic routes with automatic code splitting
- **Risk if Wrong**: Slow route resolution degrades UX
- **Validation**: Performance benchmarking with Lighthouse, optimize with streaming SSR if needed

**A-004: HMR with CSS Variables**
- **Assumption**: Hot Module Replacement works correctly with CSS variable theme switching
- **Confidence**: HIGH
- **Evidence**: CSS variable updates trigger browser reflow without full page reload
- **Risk if Wrong**: Manual page refresh required for theme changes
- **Validation**: HMR testing with theme switching, verify CSS variable reactivity

### Business Assumptions

**A-005: Production Layout Value**
- **Assumption**: Users prefer production-quality dashboard/landing layouts over basic component demos
- **Confidence**: HIGH
- **Evidence**: Design system users need realistic context for component evaluation
- **Risk if Wrong**: Simple component library is sufficient, complex layouts over-engineered
- **Validation**: User feedback, comparison with Storybook-style component libraries

**A-006: Timestamp History Usefulness**
- **Assumption**: Preserving all preview iterations via timestamp URLs enables effective design comparison
- **Confidence**: MEDIUM
- **Evidence**: Version control for design decisions aids iteration
- **Risk if Wrong**: Users only care about latest preview, history ignored
- **Validation**: User research, analytics on history URL access patterns

### Integration Assumptions

**A-007: SPEC-MCP-002 API Stability**
- **Assumption**: MCP server provides stable `/api/blueprints/:timestamp` and `/api/themes` endpoints
- **Confidence**: HIGH
- **Evidence**: SPEC-MCP-002 defines clear API contracts
- **Risk if Wrong**: API changes break playground integration
- **Validation**: Contract testing, API versioning strategy

---

## REQUIREMENTS

### Ubiquitous Requirements (Always Active)

**U-001: TypeScript Strict Mode**
- The system **shall** compile without errors in TypeScript strict mode to ensure type safety and prevent runtime errors.
- **Rationale**: Strict mode catches type errors at compile time, improving code reliability.
- **Test Strategy**: `tsc --noEmit` in CI pipeline, zero compilation errors gate.

**U-002: Responsive Design**
- The system **shall** render correctly on desktop (≥1024px), tablet (768-1023px), and mobile (≤767px) viewports.
- **Rationale**: Multi-device support ensures accessibility across all user contexts.
- **Test Strategy**: Responsive design tests with Playwright, visual regression testing.

**U-003: Accessibility Compliance**
- The system **shall** meet WCAG 2.1 AA standards for all rendered components and layouts.
- **Rationale**: Accessibility is non-negotiable for inclusive design systems.
- **Test Strategy**: axe-core automated accessibility tests, manual keyboard navigation testing.

**U-004: CSS Variable Injection**
- The system **shall** inject OKLCH-based theme CSS variables into `:root` element for all preview pages.
- **Rationale**: CSS variables enable dynamic theme switching without JavaScript re-rendering.
- **Test Strategy**: CSS variable presence verification, OKLCH format validation.

**U-005: Blueprint Validation**
- The system **shall** validate fetched blueprint JSON against Zod schema before rendering to prevent malformed data.
- **Rationale**: Runtime validation prevents rendering errors from invalid blueprint structure.
- **Test Strategy**: Zod schema validation tests with valid and invalid blueprints.

### Event-Driven Requirements (Trigger-Response)

**E-001: Preview Page Load**
- **WHEN** user navigates to `/preview/[timestamp]/[themeId]` **THEN** fetch blueprint from MCP server, load theme CSS variables, and render screen with production layout.
- **Rationale**: Preview URLs provide instant visual feedback for AI-generated blueprints.
- **Test Strategy**: End-to-end tests with Playwright, blueprint rendering verification.

**E-002: Theme Switch Request**
- **WHEN** theme ID in URL changes (e.g., `/preview/123/calm-wellness` → `/preview/123/premium-editorial`) **THEN** reload page with new theme CSS variables while preserving blueprint structure.
- **Rationale**: Theme switching enables visual comparison without regenerating blueprints.
- **Test Strategy**: Theme switch tests, CSS variable update verification, layout preservation check.

**E-003: Blueprint Fetch Failure**
- **WHEN** blueprint fetch from MCP server fails (404, network error) **THEN** display error message with retry button and troubleshooting guidance.
- **Rationale**: Clear error messages improve debugging experience for users and developers.
- **Test Strategy**: Network failure simulation, error message clarity verification.

**E-004: Component Rendering**
- **WHEN** blueprint contains component node **THEN** render corresponding React component with props and children as specified in blueprint.
- **Rationale**: Blueprint-to-component mapping enables visual representation of AI-generated designs.
- **Test Strategy**: Component rendering tests for all 20 catalog components.

**E-005: Layout Application**
- **WHEN** blueprint specifies layout type (dashboard, landing, etc.) **THEN** render production-quality layout with correct slot placement.
- **Rationale**: Production layouts provide realistic context for component evaluation.
- **Test Strategy**: Layout rendering tests for all 6 layout types.

### State-Driven Requirements (Conditional Behavior)

**S-001: Loading State Management**
- **IF** blueprint fetch is pending **THEN** display loading skeleton matching layout structure.
- **IF** blueprint fetch succeeds **THEN** render full screen with components.
- **IF** blueprint fetch fails **THEN** display error UI with retry action.
- **Rationale**: Loading states provide feedback during async operations.
- **Test Strategy**: Loading state tests, skeleton UI verification, error state tests.

**S-002: Theme Variable Availability**
- **IF** theme CSS variables are loaded **THEN** apply variables to component styles.
- **IF** theme CSS variables are missing **THEN** use default fallback values without breaking layout.
- **Rationale**: Graceful degradation ensures rendering even with theme loading failures.
- **Test Strategy**: Theme variable availability tests, fallback value verification.

**S-003: Component Catalog Check**
- **IF** blueprint component type exists in catalog **THEN** render corresponding component.
- **IF** blueprint component type unknown **THEN** render placeholder with component type label.
- **Rationale**: Unknown components shouldn't break page rendering, provide visual indication.
- **Test Strategy**: Unknown component handling tests, placeholder rendering verification.

**S-004: Server Component Optimization**
- **IF** route is static (no user interaction) **THEN** use Next.js Server Components for rendering.
- **IF** route requires client interactivity **THEN** use `'use client'` directive for Client Components.
- **Rationale**: Server Components optimize initial page load, Client Components enable interactivity.
- **Test Strategy**: Server/Client component split verification, bundle size analysis.

### Unwanted Behaviors (Prohibited Actions)

**UW-001: No Hardcoded Theme Values**
- The system **shall not** hardcode theme colors or typography, all styling must use CSS variables.
- **Rationale**: Hardcoded values break theme switching and violate design system principles.
- **Test Strategy**: Static analysis for hardcoded color values, CSS variable usage verification.

**UW-002: No Blueprint Mutation**
- The system **shall not** modify fetched blueprint JSON, preserving immutability for timestamp-based history.
- **Rationale**: Blueprint mutation violates immutability contract and breaks history tracking.
- **Test Strategy**: Blueprint immutability tests, object freeze verification.

**UW-003: No Direct MCP Server Modification**
- The system **shall not** send write requests to MCP server, playground is read-only consumer.
- **Rationale**: Separation of concerns ensures playground doesn't corrupt blueprint storage.
- **Test Strategy**: HTTP request monitoring, no POST/PUT/DELETE requests to MCP server.

**UW-004: No Layout Shifts**
- The system **shall not** cause cumulative layout shift (CLS) > 0.1 during theme switching or component rendering.
- **Rationale**: Layout shifts degrade UX and violate Core Web Vitals standards.
- **Test Strategy**: Lighthouse CLS measurement, visual regression testing.

### Optional Requirements (Future Enhancements)

**O-001: Real-Time Collaboration**
- **Where possible**, enable multi-user preview sharing with live cursor tracking.
- **Priority**: DEFERRED to Phase 2
- **Rationale**: Collaboration features valuable for design teams, but not MVP requirement.

**O-002: Design Handoff Export**
- **Where possible**, export Figma plugin-compatible design tokens from previewed screens.
- **Priority**: DEFERRED to Phase 2
- **Rationale**: Design handoff integration valuable, but manual export sufficient for MVP.

**O-003: A/B Testing Mode**
- **Where possible**, enable side-by-side comparison of 2-3 theme variations.
- **Priority**: DEFERRED to Phase 2
- **Rationale**: Visual comparison aids decision-making, but sequential switching acceptable for MVP.

---

## SPECIFICATIONS

### Directory Structure

```
packages/playground-web/
├── app/
│   ├── layout.tsx                    # Root layout with ThemeProvider
│   ├── page.tsx                      # Home page (theme gallery)
│   ├── preview/
│   │   └── [timestamp]/
│   │       └── [themeId]/
│   │           ├── page.tsx          # Preview page (Server Component)
│   │           └── loading.tsx       # Loading skeleton
│   └── api/
│       └── blueprints/
│           └── [timestamp]/
│               └── route.ts          # Proxy to MCP server (optional)
├── components/
│   ├── theme/
│   │   ├── ThemeProvider.tsx         # CSS variable injection
│   │   └── ThemeSwitch.tsx           # Theme switcher UI
│   ├── layouts/
│   │   ├── DashboardLayout.tsx       # Dashboard layout
│   │   ├── LandingLayout.tsx         # Landing page layout
│   │   ├── SidebarLeftLayout.tsx     # Sidebar layouts
│   │   └── index.ts
│   ├── blueprint/
│   │   ├── BlueprintRenderer.tsx     # Blueprint → React component mapper
│   │   └── ComponentResolver.tsx     # Component catalog resolver
│   └── ui/
│       ├── Button.tsx                # All 20 catalog components
│       ├── Card.tsx
│       └── ...
├── lib/
│   ├── mcp-client.ts                 # MCP server HTTP client
│   ├── schemas.ts                    # Zod schemas for Blueprint/Theme
│   └── utils.ts                      # Utility functions
├── styles/
│   ├── globals.css                   # Global styles + CSS variable defaults
│   └── layouts.module.css            # Layout-specific styles
└── package.json
```

### Key Components

#### ThemeProvider

**Purpose**: Inject theme CSS variables into DOM and manage theme state.

**Implementation**:
```tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Theme } from '@tekton/core';

interface ThemeContextValue {
  theme: Theme | null;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  initialTheme
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
}) {
  const [theme, setTheme] = useState<Theme | null>(initialTheme || null);

  useEffect(() => {
    if (!theme) return;

    // Inject CSS variables into :root
    const root = document.documentElement;
    const vars = generateCSSVariables(theme);

    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

#### BlueprintRenderer

**Purpose**: Map Blueprint JSON to React components with layout application.

**Implementation**:
```tsx
import type { Blueprint, ComponentNode } from '@tekton/core';
import { ComponentResolver } from './ComponentResolver';
import * as Layouts from '@/components/layouts';

export function BlueprintRenderer({ blueprint }: { blueprint: Blueprint }) {
  const Layout = Layouts[`${blueprint.layout}Layout`] || Layouts.SingleColumnLayout;

  // Group components by slot
  const slotComponents = groupBySlot(blueprint.components);

  return (
    <Layout>
      {Object.entries(slotComponents).map(([slot, nodes]) => (
        <Layout.Slot key={slot} name={slot}>
          {nodes.map((node, idx) => (
            <ComponentResolver key={idx} node={node} />
          ))}
        </Layout.Slot>
      ))}
    </Layout>
  );
}

function groupBySlot(components: ComponentNode[]) {
  return components.reduce((acc, node) => {
    const slot = node.slot || 'main';
    if (!acc[slot]) acc[slot] = [];
    acc[slot].push(node);
    return acc;
  }, {} as Record<string, ComponentNode[]>);
}
```

#### Preview Page (Server Component)

**Purpose**: Fetch blueprint and theme data server-side, render with streaming.

**Implementation**:
```tsx
// app/preview/[timestamp]/[themeId]/page.tsx
import { loadTheme, generateCSSVariables } from '@tekton/core';
import { fetchBlueprint } from '@/lib/mcp-client';
import { BlueprintRenderer } from '@/components/blueprint/BlueprintRenderer';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

interface PageProps {
  params: Promise<{ timestamp: string; themeId: string }>;
}

export default async function PreviewPage({ params }: PageProps) {
  const { timestamp, themeId } = await params;

  // Fetch data in parallel
  const [blueprint, theme] = await Promise.all([
    fetchBlueprint(timestamp),
    loadTheme(themeId)
  ]);

  if (!blueprint || !theme) {
    return <ErrorUI message="Blueprint or theme not found" />;
  }

  return (
    <ThemeProvider initialTheme={theme}>
      <div className="preview-container">
        <BlueprintRenderer blueprint={blueprint} />
      </div>
    </ThemeProvider>
  );
}
```

### CSS Variable Schema

**Base Variables** (injected by ThemeProvider):
```css
:root {
  /* Colors - OKLCH format */
  --color-primary: oklch(0.5 0.15 220);
  --color-secondary: oklch(0.6 0.12 280);
  --color-accent: oklch(0.7 0.18 140);
  --color-neutral: oklch(0.5 0.02 220);

  /* Typography */
  --font-family: "Inter", sans-serif;
  --font-scale: medium;
  --heading-weight: 700;
  --body-weight: 400;

  /* Spacing */
  --border-radius: 8px;
  --density: comfortable; /* compact | comfortable | spacious */

  /* Contrast */
  --contrast: medium; /* low | medium | high */
}
```

**Component Variables** (derived from base):
```css
:root {
  --button-bg: var(--color-primary);
  --button-text: oklch(1 0 0); /* white */
  --button-hover-bg: oklch(0.45 0.15 220); /* darker primary */

  --card-bg: oklch(0.98 0.01 220);
  --card-border: oklch(0.90 0.02 220);

  --input-border: var(--color-neutral);
  --input-focus-border: var(--color-primary);
}
```

### Data Fetching

**MCP Client**:
```typescript
// lib/mcp-client.ts
import type { Blueprint, Theme } from '@tekton/core';

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3000';

export async function fetchBlueprint(timestamp: string): Promise<Blueprint | null> {
  const res = await fetch(`${MCP_SERVER_URL}/api/blueprints/${timestamp}`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.blueprint;
}

export async function fetchThemes(): Promise<Theme[]> {
  const res = await fetch(`${MCP_SERVER_URL}/api/themes`, {
    next: { revalidate: 3600 }
  });

  if (!res.ok) return [];

  const data = await res.json();
  return data.themes;
}
```

---

## TRACEABILITY

### Requirements to Test Scenarios Mapping

| Requirement ID | Test Scenario ID | Component |
|----------------|------------------|-----------|
| U-001 | AC-001 | TypeScript strict mode compilation |
| U-002 | AC-002 | Responsive design rendering |
| U-003 | AC-003 | WCAG 2.1 AA compliance |
| U-004 | AC-004 | CSS variable injection |
| U-005 | AC-005 | Blueprint validation |
| E-001 | AC-006 | Preview page load |
| E-002 | AC-007 | Theme switch |
| E-003 | AC-008 | Blueprint fetch failure |
| E-004 | AC-009 | Component rendering |
| E-005 | AC-010 | Layout application |
| S-001 | AC-011 | Loading state management |
| S-002 | AC-012 | Theme variable availability |

### SPEC-to-Implementation Tags

- **[SPEC-PLAYGROUND-001]**: All commits related to playground implementation
- **[PLAYGROUND-ROUTING]**: Dynamic routing and page structure
- **[PLAYGROUND-THEME]**: ThemeProvider and CSS variable injection
- **[PLAYGROUND-LAYOUT]**: Production layout components
- **[PLAYGROUND-BLUEPRINT]**: Blueprint rendering and component mapping
- **[PLAYGROUND-MCP]**: MCP client integration

---

## DEPENDENCIES

### Internal Dependencies
- **SPEC-MCP-002**: MCP server for blueprint and theme data
- **@tekton/core**: Type definitions and utility functions

### External Dependencies
- **Next.js**: 16+ (App Router, Server Components)
- **React**: 19 (Server Components, use hook)
- **TypeScript**: 5.7+ (Strict mode)
- **Zod**: 3.23+ (Schema validation)
- **TanStack Query**: 5+ (Data fetching, optional)

### Technical Dependencies
- **Node.js**: 20+ runtime
- **Modern Browsers**: Chrome 111+, Safari 15+, Firefox 113+ (OKLCH support)

---

## RISK ANALYSIS

### High-Risk Areas

**Risk 1: OKLCH Browser Support**
- **Likelihood**: MEDIUM
- **Impact**: HIGH
- **Mitigation**: Provide hex color fallbacks for older browsers, feature detection
- **Contingency**: Convert OKLCH to hex server-side if browser doesn't support

**Risk 2: Dynamic Route Performance**
- **Likelihood**: MEDIUM
- **Impact**: MEDIUM
- **Mitigation**: Streaming SSR, React Suspense, incremental static regeneration
- **Contingency**: Pre-render common routes, implement edge caching

**Risk 3: Blueprint Rendering Errors**
- **Likelihood**: MEDIUM
- **Impact**: HIGH
- **Mitigation**: Zod validation, error boundaries, unknown component placeholders
- **Contingency**: Graceful degradation with error UI and retry mechanism

### Medium-Risk Areas

**Risk 4: Theme Switching Performance**
- **Likelihood**: LOW
- **Impact**: MEDIUM
- **Mitigation**: CSS variable updates only, no full re-render
- **Contingency**: Implement debouncing, optimize CSS variable scope

**Risk 5: MCP Server Dependency**
- **Likelihood**: LOW
- **Impact**: HIGH
- **Mitigation**: Local fallback data, offline mode with cached blueprints
- **Contingency**: Mock MCP server for development, service worker caching

---

## SUCCESS CRITERIA

### Implementation Success Criteria
- Preview pages render correctly for all 6 layout types
- Theme switching completes in < 100ms with CSS variables
- All 20 catalog components render without errors
- TypeScript compiles with zero errors in strict mode
- Blueprint validation catches malformed data

### Quality Success Criteria
- Test coverage ≥ 85% for all new code
- WCAG 2.1 AA compliance verified with axe-core
- Lighthouse score ≥ 90 (Performance, Accessibility, Best Practices)
- Cumulative Layout Shift (CLS) < 0.1
- First Contentful Paint (FCP) < 1.5s

### Integration Success Criteria
- Preview URLs load blueprints from SPEC-MCP-002 server
- Theme CSS variables applied correctly across all components
- Dynamic routing works with timestamp/themeId parameters
- Error states display helpful messages with retry actions

---

## REFERENCES

- [SPEC-MCP-002: MCP Server](../SPEC-MCP-002/spec.md)
- [@tekton/core Package](../../packages/core/)
- [Next.js 16 Documentation](https://nextjs.org/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [TRUST 5 Framework](../../.claude/skills/moai-foundation-core/modules/trust-5-framework.md)

---

**Last Updated**: 2026-01-25
**Status**: Planned
**Next Steps**: /moai:2-run SPEC-PLAYGROUND-001 for DDD implementation
