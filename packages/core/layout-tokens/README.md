# Layout Tokens

**4-Layer Layout Token Architecture for Design System Integration**

Semantic layout tokens that enable consistent, responsive, and maintainable UI layouts across your application.

---

## Overview

### What are Layout Tokens?

Layout Tokens are semantic design system primitives that define reusable layout patterns. They provide a structured approach to creating consistent user interfaces by separating layout concerns into four distinct layers:

```
┌─────────────────────────────────────────────────────────┐
│ Layer 1: Shell Tokens                                  │
│ Application-level frame (header, sidebar, main)        │
└───────────────────┬─────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────┐
│ Layer 2: Page Layout Tokens                            │
│ Screen-purpose layouts (dashboard, settings, detail)   │
└───────────────────┬─────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────┐
│ Layer 3: Section Pattern Tokens                        │
│ Layout primitives (grid, flex, split, stack)           │
└───────────────────┬─────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────┐
│ Layer 4: Responsive Tokens                             │
│ Breakpoint definitions (sm, md, lg, xl, 2xl)           │
└─────────────────────────────────────────────────────────┘
```

### Why Use Layout Tokens?

**Consistency**: Standardized layout patterns across your entire application

**Responsive**: Mobile-first responsive design with breakpoint overrides

**Maintainable**: Change layouts in one place, update everywhere

**Type-Safe**: Full TypeScript support with intelligent autocomplete

**Performance**: Cached resolution and optimized CSS generation (<5ms)

**Design System Integration**: Token references to atomic and semantic tokens

---

## Quick Start

### 1. Create a Blueprint with Layout Token

```typescript
import { createBlueprint } from '@tekton/core/blueprint';

const blueprint = createBlueprint({
  name: 'Dashboard Screen',
  description: 'Admin dashboard with metrics and charts',
  themeId: 'default-theme',
  layout: 'dashboard', // Legacy layout type
  layoutToken: 'page.dashboard', // NEW: Layout token reference
  components: [
    {
      type: 'Card',
      props: { title: 'Metrics' },
      children: [],
    },
  ],
});
```

### 2. Resolve Layout Configuration

```typescript
import { resolveLayout } from '@tekton/core/layout-resolver';

// Resolve page layout
const dashboardLayout = resolveLayout('page.dashboard');

console.log(dashboardLayout.page?.purpose); // 'dashboard'
console.log(dashboardLayout.sections.length); // 3 (metrics, charts, tables)
console.log(dashboardLayout.cssVariables); // CSS custom properties
```

### 3. Generate CSS

```typescript
import { generateAllLayoutCSS } from '@tekton/core/layout-css-generator';

const css = generateAllLayoutCSS({
  includeVariables: true,
  includeClasses: true,
  includeMediaQueries: true,
  indent: '  ',
});

// Output: Complete CSS with utility classes and responsive media queries
console.log(css);
```

---

## Architecture

### 4-Layer Token System

#### Layer 1: Shell Tokens (Application Frame)

Defines the persistent frame structure of your application (header, sidebar, footer, main content area).

**Available Shells (6):**

- `shell.web.app` - Standard web application layout
- `shell.web.marketing` - Marketing and landing page layout
- `shell.web.auth` - Authentication flow layout
- `shell.web.dashboard` - Admin dashboard layout
- `shell.web.admin` - Admin panel layout
- `shell.web.minimal` - Minimal single-content layout

**Example:**

```typescript
import { getShellToken } from '@tekton/core/layout-tokens/shells';

const appShell = getShellToken('shell.web.app');
// {
//   id: 'shell.web.app',
//   platform: 'web',
//   regions: [
//     { name: 'header', position: 'top', size: 'atomic.spacing.16' },
//     { name: 'sidebar', position: 'left', size: 'atomic.spacing.64' },
//     { name: 'main', position: 'center', size: 'atomic.spacing.full' },
//     { name: 'footer', position: 'bottom', size: 'atomic.spacing.12' },
//   ],
//   responsive: { ... },
//   tokenBindings: { ... }
// }
```

#### Layer 2: Page Layout Tokens (Screen Purpose)

Defines page-level layouts optimized for specific use cases and purposes.

**Available Pages (8):**

- `page.job` - Task execution page (forms, actions)
- `page.resource` - CRUD operations page (toolbar, list, detail)
- `page.dashboard` - Data overview page (metrics, charts, tables)
- `page.settings` - Configuration page (grouped forms)
- `page.detail` - Item focus page (hero, content, related)
- `page.empty` - Empty state page (illustration, CTA)
- `page.wizard` - Multi-step flow page (progress, steps, navigation)
- `page.onboarding` - First-run experience page (welcome, steps)

**Example:**

```typescript
import { getPageLayoutToken } from '@tekton/core/layout-tokens/pages';

const dashboardPage = getPageLayoutToken('page.dashboard');
// {
//   id: 'page.dashboard',
//   purpose: 'dashboard',
//   sections: [
//     { name: 'metrics', pattern: 'section.grid-4', required: true },
//     { name: 'charts', pattern: 'section.grid-2', required: false },
//     { name: 'tables', pattern: 'section.container', required: false },
//   ],
//   responsive: { ... },
//   tokenBindings: { ... }
// }
```

#### Layer 3: Section Pattern Tokens (Layout Primitives)

Defines reusable layout primitives (grid, flex, split, stack, container).

**Available Sections (13):**

**Grid Patterns (4):**

- `section.grid-2` - 2-column responsive grid
- `section.grid-3` - 3-column responsive grid
- `section.grid-4` - 4-column responsive grid
- `section.grid-auto` - Auto-fill responsive grid

**Split Patterns (3):**

- `section.split-30-70` - 30/70 sidebar-content layout
- `section.split-50-50` - Equal 50/50 split layout
- `section.split-70-30` - 70/30 content-sidebar layout

**Stack Patterns (3):**

- `section.stack-start` - Vertical stack (top-aligned)
- `section.stack-center` - Vertical stack (center-aligned)
- `section.stack-end` - Vertical stack (bottom-aligned)

**Sidebar Patterns (2):**

- `section.sidebar-left` - Fixed left sidebar
- `section.sidebar-right` - Fixed right sidebar

**Container Pattern (1):**

- `section.container` - Centered max-width container

**Example:**

```typescript
import { getSectionPatternToken } from '@tekton/core/layout-tokens/sections';

const grid3 = getSectionPatternToken('section.grid-3');
// {
//   id: 'section.grid-3',
//   type: 'grid',
//   css: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(3, 1fr)',
//     gap: 'atomic.spacing.4'
//   },
//   responsive: {
//     default: { gridTemplateColumns: 'repeat(1, 1fr)' }, // Mobile: 1 column
//     md: { gridTemplateColumns: 'repeat(2, 1fr)' },      // Tablet: 2 columns
//     lg: { gridTemplateColumns: 'repeat(3, 1fr)' }       // Desktop: 3 columns
//   },
//   tokenBindings: { ... }
// }
```

#### Layer 4: Responsive Tokens (Breakpoints)

Defines viewport breakpoints following Tailwind CSS standards.

**Available Breakpoints (5):**

- `breakpoint.sm` - Small devices (640px+, mobile landscape)
- `breakpoint.md` - Medium devices (768px+, tablets)
- `breakpoint.lg` - Large devices (1024px+, desktops)
- `breakpoint.xl` - Extra large devices (1280px+, large desktops)
- `breakpoint.2xl` - Extra extra large (1536px+, wide screens)

**Example:**

```typescript
import { getBreakpointValue, getBreakpointMediaQuery } from '@tekton/core/layout-tokens/responsive';

const mdWidth = getBreakpointValue('md'); // 768
const mdQuery = getBreakpointMediaQuery('md'); // "@media (min-width: 768px)"
```

---

## API Reference

### Core Functions

#### `resolveLayout(layoutId: string): ResolvedLayout`

Resolves a layout ID to complete configuration with CSS variables.

**Parameters:**

- `layoutId` - Layout token ID (`shell.*.*`, `page.*`, or `section.*`)

**Returns:**

- `ResolvedLayout` - Complete layout configuration

**Performance:** <5ms per call (cached after first call)

**Example:**

```typescript
import { resolveLayout } from '@tekton/core/layout-resolver';

const layout = resolveLayout('page.dashboard');
// {
//   page: PageLayoutToken,
//   sections: [SectionPatternToken, ...],
//   responsive: ResponsiveConfig,
//   cssVariables: { '--atomic-spacing-4': 'atomic.spacing.4', ... }
// }
```

#### `generateLayoutCSS(tokens, options?): string`

Generates CSS from layout tokens.

**Parameters:**

- `tokens` - Array of layout tokens (shells, pages, sections)
- `options` - CSS generation options
  - `includeVariables?: boolean` - Include CSS custom properties (default: true)
  - `includeClasses?: boolean` - Include utility classes (default: true)
  - `includeMediaQueries?: boolean` - Include responsive media queries (default: true)
  - `indent?: string` - Indentation string (default: ' ')

**Returns:**

- `string` - Complete CSS with variables, utilities, and media queries

**Example:**

```typescript
import { generateAllLayoutCSS } from '@tekton/core/layout-css-generator';

const css = generateAllLayoutCSS({
  includeVariables: true,
  includeClasses: true,
  includeMediaQueries: true,
});
```

#### `createBlueprint(input: CreateBlueprintInput): Blueprint`

Creates a blueprint with optional layout token.

**Parameters:**

- `input.name` - Blueprint name
- `input.description?` - Optional description
- `input.themeId` - Theme ID reference
- `input.layout` - Legacy layout type
- `input.layoutToken?` - **NEW:** Layout token ID
- `input.components` - Component tree

**Returns:**

- `Blueprint` - Created blueprint with resolved layoutConfig

**Example:**

```typescript
import { createBlueprint } from '@tekton/core/blueprint';

const blueprint = createBlueprint({
  name: 'Dashboard',
  themeId: 'default-theme',
  layout: 'dashboard',
  layoutToken: 'page.dashboard', // Layout token reference
  components: [],
});
```

### Token Getter Functions

#### Shell Tokens

- `getShellToken(shellId: string): ShellToken | undefined`
- `getAllShellTokens(): ShellToken[]`
- `getShellsByPlatform(platform: 'web' | 'mobile' | 'desktop'): ShellToken[]`

#### Page Layout Tokens

- `getPageLayoutToken(pageId: string): PageLayoutToken | undefined`
- `getAllPageLayoutTokens(): PageLayoutToken[]`
- `getPagesByPurpose(purpose: PagePurpose): PageLayoutToken[]`
- `getPageSections(pageId: string): SectionSlot[]`

#### Section Pattern Tokens

- `getSectionPatternToken(patternId: string): SectionPatternToken | undefined`
- `getAllSectionPatternTokens(): SectionPatternToken[]`
- `getSectionsByType(type: SectionType): SectionPatternToken[]`
- `getSectionCSS(patternId: string): SectionCSS | undefined`

#### Responsive Tokens

- `getResponsiveToken(breakpointId: string): ResponsiveToken | undefined`
- `getAllResponsiveTokens(): ResponsiveToken[]`
- `getBreakpointValue(breakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl'): number`
- `getBreakpointMediaQuery(breakpoint: string): string`
- `sortBreakpointsBySize(breakpoints: ResponsiveToken[]): ResponsiveToken[]`

### Validation Functions

#### `validateCSS(css: string): boolean`

Validates CSS syntax (balanced braces).

**Example:**

```typescript
import { validateCSS } from '@tekton/core/layout-css-generator';

const isValid = validateCSS(css); // true or false
```

#### `validateBlueprint(blueprint: Blueprint): ValidationResult`

Validates blueprint structure.

**Example:**

```typescript
import { validateBlueprint } from '@tekton/core/blueprint';

const result = validateBlueprint(blueprint);
// { valid: true, errors: [] }
```

---

## Usage Examples

### Example 1: Dashboard Page with Layout Token

```typescript
import { createBlueprint } from '@tekton/core/blueprint';
import { resolveLayout } from '@tekton/core/layout-resolver';

// Create dashboard blueprint
const blueprint = createBlueprint({
  name: 'Analytics Dashboard',
  description: 'Real-time analytics and metrics',
  themeId: 'analytics-theme',
  layout: 'dashboard',
  layoutToken: 'page.dashboard',
  components: [
    // Metrics section (uses section.grid-4)
    {
      type: 'Card',
      slot: 'metrics',
      props: { title: 'Total Users', value: '1,234' },
      children: [],
    },
    // Charts section (uses section.grid-2)
    {
      type: 'Chart',
      slot: 'charts',
      props: { type: 'line', data: [] },
      children: [],
    },
    // Tables section (uses section.container)
    {
      type: 'Table',
      slot: 'tables',
      props: { columns: [], rows: [] },
      children: [],
    },
  ],
});

// Resolve layout configuration
const layout = resolveLayout('page.dashboard');
console.log(layout.page?.purpose); // 'dashboard'
console.log(layout.sections.length); // 3
```

### Example 2: Responsive Grid Pattern

```typescript
import { getSectionPatternToken } from '@tekton/core/layout-tokens/sections';

const grid3 = getSectionPatternToken('section.grid-3');

// Mobile: 1 column
console.log(grid3.responsive.default.gridTemplateColumns); // 'repeat(1, 1fr)'

// Tablet: 2 columns
console.log(grid3.responsive.md?.gridTemplateColumns); // 'repeat(2, 1fr)'

// Desktop: 3 columns
console.log(grid3.responsive.lg?.gridTemplateColumns); // 'repeat(3, 1fr)'
```

### Example 3: Generate Complete CSS

```typescript
import { generateAllLayoutCSS } from '@tekton/core/layout-css-generator';
import * as fs from 'fs';

// Generate CSS for all layout tokens
const css = generateAllLayoutCSS({
  includeVariables: true,
  includeClasses: true,
  includeMediaQueries: true,
  indent: '  ',
});

// Write to file
fs.writeFileSync('dist/layout-tokens.css', css);
```

### Example 4: Custom Layout Resolution

```typescript
import { resolveLayout, clearLayoutCache } from '@tekton/core/layout-resolver';

// Resolve multiple layouts
const shellLayout = resolveLayout('shell.web.dashboard');
const pageLayout = resolveLayout('page.dashboard');
const sectionLayout = resolveLayout('section.grid-4');

// Clear cache when layout definitions change
clearLayoutCache();
```

### Example 5: Using Layout Tokens in Components

```tsx
import { resolveLayout } from '@tekton/core/layout-resolver';
import { generateLayoutCSS } from '@tekton/core/layout-css-generator';

function DashboardPage() {
  const layout = resolveLayout('page.dashboard');

  return (
    <div className="page-dashboard">
      {/* Metrics section uses section.grid-4 */}
      <section className="section-grid-4">
        <MetricCard title="Users" value="1,234" />
        <MetricCard title="Revenue" value="$56,789" />
        <MetricCard title="Orders" value="890" />
        <MetricCard title="Conversion" value="3.4%" />
      </section>

      {/* Charts section uses section.grid-2 */}
      <section className="section-grid-2">
        <LineChart data={revenueData} />
        <BarChart data={ordersData} />
      </section>

      {/* Tables section uses section.container */}
      <section className="section-container">
        <DataTable columns={columns} rows={rows} />
      </section>
    </div>
  );
}
```

### Example 6: Responsive Layout Pattern

```typescript
import { getBreakpointValue } from '@tekton/core/layout-tokens/responsive';
import { getSectionPatternToken } from '@tekton/core/layout-tokens/sections';

const section = getSectionPatternToken('section.grid-3');

// Get responsive configurations
const mobileColumns = section.responsive.default.gridTemplateColumns; // 'repeat(1, 1fr)'
const tabletColumns = section.responsive.md?.gridTemplateColumns; // 'repeat(2, 1fr)'
const desktopColumns = section.responsive.lg?.gridTemplateColumns; // 'repeat(3, 1fr)'

// Get breakpoint values
const mdBreakpoint = getBreakpointValue('md'); // 768
const lgBreakpoint = getBreakpointValue('lg'); // 1024
```

---

## Token Definitions

### Shell Tokens (6)

| ID                    | Platform | Description      | Regions                       |
| --------------------- | -------- | ---------------- | ----------------------------- |
| `shell.web.app`       | web      | Standard web app | header, sidebar, main, footer |
| `shell.web.marketing` | web      | Marketing pages  | hero, features, cta, footer   |
| `shell.web.auth`      | web      | Authentication   | logo, main                    |
| `shell.web.dashboard` | web      | Admin dashboard  | header, sidebar, main         |
| `shell.web.admin`     | web      | Admin panel      | header, sidebar, main, footer |
| `shell.web.minimal`   | web      | Minimal layout   | main                          |

### Page Layout Tokens (8)

| ID                | Purpose    | Sections                   | Use Case             |
| ----------------- | ---------- | -------------------------- | -------------------- |
| `page.job`        | job        | header, form, actions      | Task execution forms |
| `page.resource`   | resource   | toolbar, list, detail      | CRUD operations      |
| `page.dashboard`  | dashboard  | metrics, charts, tables    | Data overview        |
| `page.settings`   | settings   | sidebar, content, actions  | Configuration        |
| `page.detail`     | detail     | hero, content, related     | Item focus view      |
| `page.empty`      | empty      | illustration, message, cta | Empty states         |
| `page.wizard`     | wizard     | progress, step, navigation | Multi-step flows     |
| `page.onboarding` | onboarding | welcome, steps, completion | First-run experience |

### Section Pattern Tokens (13)

| ID                      | Type | Columns   | Responsive          | Use Case                    |
| ----------------------- | ---- | --------- | ------------------- | --------------------------- |
| `section.grid-2`        | grid | 2         | 1 → 2               | Comparisons, paired content |
| `section.grid-3`        | grid | 3         | 1 → 2 → 3           | Feature cards, showcases    |
| `section.grid-4`        | grid | 4         | 1 → 2 → 4           | Metrics, dashboards         |
| `section.grid-auto`     | grid | auto-fill | auto                | Dynamic galleries           |
| `section.split-30-70`   | flex | 2         | stack → 30/70       | Sidebar-content             |
| `section.split-50-50`   | flex | 2         | stack → 50/50       | Balanced layouts            |
| `section.split-70-30`   | flex | 2         | stack → 70/30       | Content-sidebar             |
| `section.stack-start`   | flex | 1         | N/A                 | Forms, lists                |
| `section.stack-center`  | flex | 1         | N/A                 | Hero, empty states          |
| `section.stack-end`     | flex | 1         | N/A                 | Action buttons              |
| `section.sidebar-left`  | flex | 2         | stack → sidebar     | Left navigation             |
| `section.sidebar-right` | flex | 2         | stack → sidebar     | Right metadata              |
| `section.container`     | flex | 1         | responsive maxWidth | Articles, forms             |

### Breakpoints (5)

| ID               | Min Width | Target Devices                  |
| ---------------- | --------- | ------------------------------- |
| `breakpoint.sm`  | 640px     | Mobile landscape, small tablets |
| `breakpoint.md`  | 768px     | Tablets portrait                |
| `breakpoint.lg`  | 1024px    | Desktops, laptops               |
| `breakpoint.xl`  | 1280px    | Large desktops                  |
| `breakpoint.2xl` | 1536px    | Wide screens, ultra-wide        |

---

## Migration Guide

### From Legacy Layouts to Layout Tokens

**Before (Legacy Layout):**

```typescript
const blueprint = createBlueprint({
  name: 'Dashboard',
  themeId: 'default',
  layout: 'dashboard', // String-based layout type
  components: [],
});
```

**After (With Layout Tokens):**

```typescript
const blueprint = createBlueprint({
  name: 'Dashboard',
  themeId: 'default',
  layout: 'dashboard', // Still supported for backwards compatibility
  layoutToken: 'page.dashboard', // NEW: Token-based layout
  components: [],
});
```

**Benefits:**

- ✅ Access to responsive configurations
- ✅ Design system token integration
- ✅ CSS generation capabilities
- ✅ Better type safety and autocomplete

### Step-by-Step Migration

1. **Identify Current Layouts**: Review your existing blueprints
2. **Map to Layout Tokens**: Choose appropriate layout tokens
3. **Add layoutToken Field**: Add `layoutToken` property to blueprint creation
4. **Test Responsive Behavior**: Verify layouts at different breakpoints
5. **Generate CSS**: Use `generateLayoutCSS` to output utility classes
6. **Remove Legacy Code**: Gradually phase out legacy layout system

---

## Best Practices

### 1. Use Semantic Layout Tokens

❌ **Don't** use generic layout names:

```typescript
layout: 'two-column'; // Too generic
```

✅ **Do** use purpose-specific tokens:

```typescript
layoutToken: 'page.dashboard'; // Clear intent
```

### 2. Leverage Responsive Configurations

❌ **Don't** create separate layouts for mobile/desktop:

```typescript
const mobileLayout = createBlueprint({ ... });
const desktopLayout = createBlueprint({ ... });
```

✅ **Do** use responsive token overrides:

```typescript
// Layout tokens handle responsive behavior automatically
const layout = resolveLayout('page.dashboard');
// Mobile: 1 column grid
// Tablet: 2 column grid
// Desktop: 4 column grid
```

### 3. Cache Resolution Results

❌ **Don't** resolve layouts repeatedly:

```typescript
function MyComponent() {
  const layout = resolveLayout('page.dashboard'); // ❌ Resolves on every render
  // ...
}
```

✅ **Do** cache resolved layouts:

```typescript
// Layout resolution is automatically cached
// First call: ~5ms
// Subsequent calls: <1ms (from cache)
const layout = resolveLayout('page.dashboard');
```

### 4. Validate Blueprints

✅ **Always** validate blueprints before use:

```typescript
const blueprint = createBlueprint({ ... });
const validation = validateBlueprint(blueprint);

if (!validation.valid) {
  console.error('Blueprint validation errors:', validation.errors);
}
```

### 5. Use Token References

✅ **Do** use token references for spacing, colors, sizes:

```typescript
const section: SectionPatternToken = {
  // ...
  css: {
    gap: 'atomic.spacing.4', // Token reference (not '16px')
    padding: 'atomic.spacing.6', // Maintains design system consistency
  },
};
```

### 6. Generate CSS Once

✅ **Generate CSS at build time** for optimal performance:

```typescript
// build-css.ts
import { generateAllLayoutCSS } from '@tekton/core/layout-css-generator';
import * as fs from 'fs';

const css = generateAllLayoutCSS();
fs.writeFileSync('dist/layout-tokens.css', css);
```

---

## Performance Notes

### Caching and Optimization

**Layout Resolution Caching:**

- First call: ~5ms (token lookup + resolution)
- Cached calls: <1ms (Map lookup)
- Cache invalidation: Manual via `clearLayoutCache()`

**CSS Generation Performance:**

- All tokens: ~10-15ms (6 shells + 8 pages + 13 sections)
- Single token: ~1-2ms
- Validation overhead: <1ms

**Recommendations:**

1. ✅ Generate CSS at build time (not runtime)
2. ✅ Resolve layouts once and cache in component state
3. ✅ Clear cache only when layout definitions change
4. ✅ Use `validateCSS()` in development, skip in production

### Token Reference Resolution

**Performance Characteristics:**

- Token reference lookup: O(1) via Map
- Recursive token traversal: O(n) where n = nested depth
- CSS variable generation: O(k) where k = unique token references
- No circular reference checks (assumed valid input)

---

## TypeScript Support

### Full Type Safety

Layout Tokens provide complete TypeScript definitions for all tokens and functions:

```typescript
import type {
  ShellToken,
  PageLayoutToken,
  SectionPatternToken,
  ResponsiveToken,
  ResolvedLayout,
  SectionType,
  PagePurpose,
} from '@tekton/core/layout-tokens/types';

// Autocomplete and type checking for all APIs
const shell: ShellToken = getShellToken('shell.web.dashboard')!;
const page: PageLayoutToken = getPageLayoutToken('page.dashboard')!;
const section: SectionPatternToken = getSectionPatternToken('section.grid-4')!;
```

### Token Reference Type

```typescript
import type { TokenReference } from '@tekton/core/token-resolver';

// Token references are type-aliased strings
const spacing: TokenReference = 'atomic.spacing.16';
const color: TokenReference = 'semantic.color.primary';
```

---

## Troubleshooting

### Common Issues

**Issue**: Layout token not found

```
Error: Shell token not found: shell.web.custom
```

**Solution**: Verify token ID exists in token definitions. Use getter functions to check available tokens.

**Issue**: Invalid layout token format

```
Error: Invalid layoutToken format: "custom.layout". Must match "shell.*.*", "page.*", or "section.*"
```

**Solution**: Use correct token ID format:

- Shells: `shell.{platform}.{name}`
- Pages: `page.{name}`
- Sections: `section.{pattern}`

**Issue**: CSS validation failed

```
Error: Generated CSS has unbalanced braces
```

**Solution**: Check token definitions for malformed CSS. Use `validateCSS()` to identify issues.

**Issue**: Section pattern not found

```
Error: Section pattern not found: section.custom-grid (referenced by page.dashboard)
```

**Solution**: Ensure all section patterns referenced in page layouts are defined.

---

## Contributing

### Adding New Layout Tokens

**1. Add Token Definition:**

```typescript
// In layout-tokens/shells.ts (or pages.ts, sections.ts)
export const SHELL_WEB_CUSTOM: ShellToken = {
  id: 'shell.web.custom',
  description: 'Custom shell layout',
  platform: 'web',
  regions: [...],
  responsive: {...},
  tokenBindings: {...},
};
```

**2. Register in Token Map:**

```typescript
const SHELL_TOKENS_MAP: Record<string, ShellToken> = {
  // ...
  'shell.web.custom': SHELL_WEB_CUSTOM,
};
```

**3. Add Tests:**

```typescript
describe('SHELL_WEB_CUSTOM', () => {
  it('should have valid structure', () => {
    expect(SHELL_WEB_CUSTOM.id).toBe('shell.web.custom');
    expect(SHELL_WEB_CUSTOM.platform).toBe('web');
  });
});
```

**4. Update Documentation:**

- Add to token definitions table
- Include usage examples
- Document responsive behavior

---

## Related Documentation

- [Blueprint System](../blueprint.ts) - Blueprint creation and validation
- [Layout Resolver](../layout-resolver.ts) - Layout resolution and caching
- [CSS Generator](../layout-css-generator.ts) - CSS generation and formatting
- [Token Resolver](../token-resolver.ts) - Token reference resolution
- [Component Schemas](../component-schemas.ts) - Component type definitions

---

## Version History

- **Phase 10** (2026-01-27): Documentation and final testing
- **Phase 9** (2026-01-26): Blueprint integration with layoutToken support
- **Phase 8** (2026-01-25): CSS generation with responsive media queries
- **Phase 7** (2026-01-24): Layout resolver with caching
- **Phase 6** (2026-01-23): Responsive token definitions
- **Phase 5** (2026-01-22): Section pattern tokens (13 patterns)
- **Phase 4** (2026-01-21): Page layout tokens (8 pages)
- **Phase 3** (2026-01-20): Shell token definitions (6 shells)
- **Phase 1** (2026-01-18): Type definitions and architecture

---

**License**: MIT
**Specification**: [SPEC-LAYOUT-001](../../.moai/specs/SPEC-LAYOUT-001/)
**Author**: Tekton Design System Team
