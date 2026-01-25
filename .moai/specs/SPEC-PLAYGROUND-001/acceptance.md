---
id: SPEC-PLAYGROUND-001
title: "Next.js React Playground Acceptance Criteria"
created: "2026-01-25"
tags: ["SPEC-PLAYGROUND-001", "Acceptance", "Testing"]
---

# SPEC-PLAYGROUND-001: Acceptance Criteria

## Overview

This document defines the acceptance criteria for SPEC-PLAYGROUND-001 using Given-When-Then format. All scenarios must pass for the implementation to be considered complete.

---

## AC-001: TypeScript Strict Mode Compilation

**Test Scenario**: Verify TypeScript compiles without errors in strict mode.

**Given**:
- Next.js project is set up with TypeScript
- `tsconfig.json` has `strict: true` enabled

**When**:
- Command `tsc --noEmit` is executed

**Then**:
- Exit code is 0 (no errors)
- No type errors reported
- No `any` types in public APIs

**Verification Method**: CI pipeline TypeScript check

---

## AC-002: Responsive Design Rendering

**Test Scenario**: Verify layouts render correctly across all viewport sizes.

**Given**:
- Preview page is loaded with dashboard layout

**When**:
- Viewport width is 1920px (desktop)

**Then**:
- Dashboard layout displays with sidebar, header, main, footer
- Grid layout uses 250px sidebar column

**When**:
- Viewport width is 768px (tablet)

**Then**:
- Dashboard layout adjusts to single column
- Sidebar is hidden or collapsible

**When**:
- Viewport width is 375px (mobile)

**Then**:
- Dashboard layout is vertical stack
- All content remains accessible

**Verification Method**: Playwright responsive design tests

---

## AC-003: WCAG 2.1 AA Compliance

**Test Scenario**: Verify accessibility standards are met.

**Given**:
- Preview page is rendered with all components

**When**:
- axe-core automated accessibility test runs

**Then**:
- Zero critical accessibility violations
- Color contrast ratios ≥ 4.5:1 for normal text
- Color contrast ratios ≥ 3:1 for large text
- All interactive elements have accessible names
- Keyboard navigation works for all controls

**Verification Method**: axe-core integration with Playwright

---

## AC-004: CSS Variable Injection

**Test Scenario**: Verify theme CSS variables are injected correctly.

**Given**:
- Preview page loads with theme `calm-wellness`

**When**:
- Page renders in browser

**Then**:
- `document.documentElement.style` contains `--color-primary`
- `--color-primary` value is in `oklch()` format (e.g., `oklch(0.5 0.15 220)`)
- All theme variables are present: `--color-primary`, `--color-secondary`, `--font-family`, `--border-radius`
- CSS variables are applied to component styles

**Verification Method**: Browser DevTools inspection, automated CSS variable presence check

---

## AC-005: Blueprint Validation

**Test Scenario**: Verify blueprint validation catches invalid data.

**Given**:
- MCP server returns invalid blueprint (missing `themeId` field)

**When**:
- Preview page attempts to render blueprint

**Then**:
- Zod validation fails with error message: `"Invalid blueprint: themeId is required"`
- Error boundary catches validation error
- Error UI displays with retry button
- Page does not crash

**Verification Method**: Unit test with invalid blueprint JSON

---

## AC-006: Preview Page Load

**Test Scenario**: Verify preview page loads blueprint and renders correctly.

**Given**:
- MCP server is running
- Blueprint with timestamp `1738123456789` exists
- Theme `calm-wellness` is available

**When**:
- User navigates to `/preview/1738123456789/calm-wellness`

**Then**:
- Blueprint is fetched from MCP server (`/api/blueprints/1738123456789`)
- Theme CSS variables are loaded
- BlueprintRenderer renders components
- Page displays without errors
- Loading skeleton shows during fetch

**Verification Method**: E2E test with Playwright

---

## AC-007: Theme Switch

**Test Scenario**: Verify theme switching without blueprint regeneration.

**Given**:
- User is viewing `/preview/1738123456789/calm-wellness`

**When**:
- User navigates to `/preview/1738123456789/premium-editorial` (same timestamp, different theme)

**Then**:
- Page reloads with new theme CSS variables
- `--color-primary` changes to `premium-editorial` value
- Blueprint structure remains identical
- Component layout unchanged, only colors/typography updated

**Verification Method**: E2E test comparing CSS variables before/after theme switch

---

## AC-008: Blueprint Fetch Failure

**Test Scenario**: Verify error handling for blueprint fetch failures.

**Given**:
- MCP server is running

**When**:
- User navigates to `/preview/9999999999999/calm-wellness` (non-existent timestamp)

**Then**:
- MCP server returns 404 error
- Error boundary catches fetch failure
- Error UI displays: "Blueprint not found"
- Retry button is present and functional
- Page does not crash

**Verification Method**: E2E test with simulated 404 response

---

## AC-009: Component Rendering

**Test Scenario**: Verify all 20 catalog components render correctly.

**Given**:
- Blueprint contains all 20 component types

**When**:
- Preview page renders blueprint

**Then**:
- Button component renders with props (variant, size, disabled)
- Card component renders with children
- Input component renders with placeholder, value
- All 20 components render without errors
- Component styles use CSS variables (`var(--color-primary)`)

**Verification Method**: Component rendering test suite

---

## AC-010: Layout Application

**Test Scenario**: Verify production layouts render correctly.

**Given**:
- Blueprint specifies `dashboard` layout

**When**:
- Preview page renders

**Then**:
- Dashboard layout renders with header, sidebar, main, footer slots
- Components placed in correct slots based on `node.slot` property
- CSS Grid layout applied correctly
- Responsive breakpoints work (desktop, tablet, mobile)

**When**:
- Blueprint specifies `landing` layout

**Then**:
- Landing layout renders with hero, features, cta, footer slots
- Layout is visually distinct from dashboard

**Verification Method**: Layout rendering tests for all 6 layout types

---

## AC-011: Loading State Management

**Test Scenario**: Verify loading states during async operations.

**Given**:
- User navigates to preview page

**When**:
- Blueprint fetch is in progress

**Then**:
- Loading skeleton displays matching layout structure
- Skeleton includes placeholders for header, main content
- Page does not show blank screen

**When**:
- Blueprint fetch completes successfully

**Then**:
- Loading skeleton is replaced with rendered components
- Transition is smooth without layout shift

**When**:
- Blueprint fetch fails

**Then**:
- Error UI displays with error message and retry button

**Verification Method**: Loading state tests with network throttling

---

## AC-012: Theme Variable Availability

**Test Scenario**: Verify graceful degradation when theme variables are missing.

**Given**:
- Theme loading fails or theme ID is invalid

**When**:
- Preview page attempts to render

**Then**:
- Default fallback CSS variables are used
- Components render with fallback colors/typography
- Page layout remains intact
- Warning message displays: "Theme not found, using defaults"

**Verification Method**: Unit test with missing theme ID

---

## Quality Gates

### Test Coverage
- **Target**: ≥ 85% statement coverage
- **Measurement**: Vitest coverage report
- **Gate**: CI pipeline fails if coverage < 85%

### Performance
- **Lighthouse Performance**: ≥ 90
- **Lighthouse Accessibility**: ≥ 90
- **Lighthouse Best Practices**: ≥ 90
- **First Contentful Paint (FCP)**: < 1.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Measurement**: Lighthouse CI
- **Gate**: CI pipeline fails if any score < 90 or FCP > 1.5s or CLS > 0.1

### Type Safety
- **Target**: Zero TypeScript compilation errors
- **Measurement**: `tsc --noEmit` in strict mode
- **Gate**: CI pipeline fails on type errors

### Accessibility
- **Target**: WCAG 2.1 AA compliance
- **Measurement**: axe-core automated tests
- **Gate**: CI pipeline fails on critical violations

### Bundle Size
- **Target**: Initial route bundle < 200KB (gzipped)
- **Measurement**: Next.js build output
- **Gate**: CI pipeline warning if bundle > 200KB

---

## Definition of Done

Implementation is considered complete when:

1. ✅ All 12 acceptance criteria pass
2. ✅ Test coverage ≥ 85%
3. ✅ Lighthouse scores ≥ 90 (Performance, Accessibility, Best Practices)
4. ✅ Zero TypeScript errors in strict mode
5. ✅ WCAG 2.1 AA compliance verified
6. ✅ All 6 layouts render correctly on desktop, tablet, mobile
7. ✅ All 20 components render with CSS variable theming
8. ✅ Integration with SPEC-MCP-002 verified
9. ✅ Documentation complete (README, deployment guide)
10. ✅ Code review approved

---

## User Acceptance Scenarios

### Scenario 1: Claude Code → Blueprint → Visual Preview

**Given**:
- User opens Claude Code
- SPEC-MCP-002 and SPEC-PLAYGROUND-001 are running

**When**:
- User types: "Create a user dashboard with profile card and activity feed using calm-wellness theme"
- Claude Code invokes `generate-blueprint` MCP tool
- MCP server returns preview URL: `http://localhost:3001/preview/1738123456789/calm-wellness`

**Then**:
- User clicks preview URL
- Next.js playground loads blueprint
- Dashboard layout renders with profile card and activity feed
- `calm-wellness` theme colors and typography applied
- Page loads in < 2 seconds

**Success Metric**: Complete workflow from prompt to visual preview in < 10 seconds

---

### Scenario 2: Theme Quality Comparison

**Given**:
- User has generated a dashboard blueprint

**When**:
- User views `/preview/1738123456789/calm-wellness`
- User compares with `/preview/1738123456789/premium-editorial`
- User compares with `/preview/1738123456789/dynamic-fitness`

**Then**:
- Each theme displays with distinct colors and typography
- Blueprint structure remains identical across all themes
- User can visually compare theme quality
- Theme switching completes in < 1 second

**Success Metric**: User can compare 3 themes in < 30 seconds

---

### Scenario 3: Mobile Responsive Preview

**Given**:
- User has generated a landing page blueprint

**When**:
- User opens preview URL on mobile device (375px width)

**Then**:
- Landing layout adapts to mobile viewport
- Hero section is single column
- Features section stacks vertically
- All content is accessible without horizontal scroll
- Touch targets meet minimum 44x44px size

**Success Metric**: Mobile preview is fully functional without UX degradation

---

### Scenario 4: Accessibility Verification

**Given**:
- User has generated a form blueprint

**When**:
- User navigates preview with keyboard only (Tab, Enter, Escape)

**Then**:
- All interactive elements are focusable
- Focus indicator is clearly visible
- Form inputs have accessible labels
- Error messages are announced by screen readers
- User can complete full workflow without mouse

**Success Metric**: Complete keyboard navigation without accessibility barriers

---

### Scenario 5: Error Recovery

**Given**:
- User navigates to preview URL
- MCP server is temporarily down

**When**:
- Preview page attempts to fetch blueprint

**Then**:
- Loading skeleton displays briefly
- Error message appears: "Failed to connect to preview server"
- Retry button is present
- User clicks retry button
- MCP server comes back online
- Blueprint loads successfully

**Success Metric**: User can recover from network errors without page refresh

---

## Integration Verification Checklist

### SPEC-MCP-002 Integration
- [ ] Blueprint fetch from `/api/blueprints/:timestamp` works
- [ ] Theme fetch from `/api/themes` works (if implemented)
- [ ] CORS headers allow playground origin
- [ ] Error responses handled gracefully
- [ ] Preview URLs from MCP server load correctly

### @tekton/core Integration
- [ ] Type definitions imported correctly (Blueprint, Theme, ComponentNode)
- [ ] `loadTheme` function works in browser context (if applicable)
- [ ] `generateCSSVariables` produces valid CSS
- [ ] No import errors or missing dependencies

### Browser Compatibility
- [ ] Chrome 111+ renders OKLCH colors correctly
- [ ] Safari 15+ renders OKLCH colors correctly
- [ ] Firefox 113+ renders OKLCH colors correctly
- [ ] Older browsers fallback to hex colors (if implemented)

---

**Last Updated**: 2026-01-25
**Status**: Planned
**Related**: SPEC-PLAYGROUND-001/spec.md, SPEC-PLAYGROUND-001/plan.md
