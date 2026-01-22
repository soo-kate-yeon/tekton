# Migration Guide: Theme Token Binding System

## Overview

This guide helps you migrate existing projects to use the Theme Token Binding System introduced in SPEC-THEME-BIND-001. The good news: **no migration is required for existing code to continue working**. This guide focuses on how to adopt the new features gradually.

## Table of Contents

- [Do You Need to Migrate?](#do-you-need-to-migrate)
- [Migration Strategy](#migration-strategy)
- [Step-by-Step Migration](#step-by-step-migration)
- [Testing Your Migration](#testing-your-migration)
- [Common Pitfalls](#common-pitfalls)
- [Rollback Plan](#rollback-plan)

---

## Do You Need to Migrate?

### No Migration Required If...

✅ Your existing blueprints work fine without themes
✅ You don't need centralized design tokens
✅ You're satisfied with hardcoded styling
✅ You have no plans for multi-theme support

**Result**: Your code continues to work unchanged. The default `calm-wellness` theme is applied automatically.

### Consider Migration If...

🎯 You want centralized, maintainable design tokens
🎯 You need to support multiple themes
🎯 You want runtime theme switching
🎯 You're building a design system
🎯 You need consistent styling across components

**Result**: Follow this guide to adopt theme tokens incrementally.

---

## Migration Strategy

### Incremental Adoption (Recommended)

The theme binding system supports gradual adoption:

```
Phase 1: Keep existing code (automatic default theme)
   ↓
Phase 2: Add tokenBindings to new components
   ↓
Phase 3: Migrate high-traffic components
   ↓
Phase 4: Full theme token adoption
```

### Big Bang Migration (Not Recommended)

Migrating all components at once is **not recommended** because:
- Higher risk of regressions
- Difficult to test thoroughly
- No fallback if issues arise

---

## Step-by-Step Migration

### Phase 1: Verify Compatibility

**Goal**: Ensure existing code works with the new system.

#### Step 1.1: Update Dependencies

```bash
# Update to latest version
npm update @tekton/component-generator @tekton/studio-mcp

# Verify versions
npm list @tekton/component-generator
```

**Expected**: Version with theme binding support (1.0.0+)

#### Step 1.2: Run Existing Tests

```bash
npm test
```

**Expected**: All existing tests pass (100% success rate)

#### Step 1.3: Generate Sample Component

Test with an existing blueprint:

```typescript
import { renderScreen } from '@tekton/studio-mcp';

// Use existing blueprint (no modifications)
const result = await renderScreen(existingBlueprint);

console.log('Success:', result.success);
console.log('Theme Applied:', result.themeApplied); // "calm-wellness"
```

**Expected**: Component generates successfully with default theme.

✅ **Checkpoint**: If all tests pass and existing blueprints work, proceed to Phase 2.

---

### Phase 2: Understand Theme Concepts

**Goal**: Learn the theme system before making changes.

#### Step 2.1: Explore Default Theme

Read the default theme configuration:

```bash
cat packages/component-generator/themes/calm-wellness.json
```

Key sections to understand:
- `colorPalette`: Available color tokens
- `typography`: Font and size tokens
- `componentDefaults`: Border radius, spacing tokens

#### Step 2.2: Understand Token Resolution

Theme tokens follow this priority:

```
1. Runtime Override (options.themeId)
2. Blueprint Preference (blueprint.themeId)
3. Default Theme ('calm-wellness')
```

Example:

```typescript
const blueprint = {
  ...baseBlueprint,
  themeId: 'professional-dark'  // Priority 2
};

await renderScreen(blueprint, {
  themeId: 'calm-wellness'  // Priority 1 (highest)
});
// Result: Uses 'calm-wellness'
```

#### Step 2.3: Learn Token Binding Syntax

Token bindings map CSS properties to theme tokens:

```typescript
{
  tokenBindings: {
    backgroundColor: 'color-surface',      // Maps to theme token
    color: 'color-on-surface',
    borderRadius: 'radius-lg',
    padding: 'spacing-4'
  }
}
```

Generates:

```tsx
<Component
  style={{
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-on-surface)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-4)'
  }}
/>
```

✅ **Checkpoint**: Understand theme structure and token binding syntax before proceeding.

---

### Phase 3: Migrate Your First Component

**Goal**: Successfully migrate one simple component as a proof of concept.

#### Step 3.1: Choose a Simple Component

Select a component with:
- Simple structure (single element)
- Few styling properties
- Low risk if something breaks

**Example**: A basic Card component

#### Step 3.2: Identify Hardcoded Values

Before:

```typescript
const blueprint: BlueprintResult = {
  blueprintId: 'card-001',
  recipeName: 'simple-card',
  analysis: { intent: 'Display content', tone: 'calm' },
  structure: {
    componentName: 'Card',
    props: {
      style: {
        backgroundColor: '#f9fafb',  // ❌ Hardcoded
        borderRadius: '0.5rem',      // ❌ Hardcoded
        padding: '1rem',             // ❌ Hardcoded
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'  // ❌ Hardcoded
      }
    }
  }
};
```

#### Step 3.3: Replace with Token Bindings

After:

```typescript
const blueprint: BlueprintResult = {
  blueprintId: 'card-001',
  recipeName: 'simple-card',
  analysis: { intent: 'Display content', tone: 'calm' },
  structure: {
    componentName: 'Card',
    props: {},  // Remove hardcoded styles
    tokenBindings: {  // ✅ Use theme tokens
      backgroundColor: 'color-surface',
      borderRadius: 'radius-lg',
      padding: 'spacing-4',
      boxShadow: 'shadow-md'
    }
  }
};
```

#### Step 3.4: Test the Migrated Component

```typescript
import { renderScreen } from '@tekton/studio-mcp';

const result = await renderScreen(blueprint);

console.log('Generated Code:');
console.log(result.code);

// Verify CSS variables present
expect(result.code).toContain('var(--color-surface)');
expect(result.code).toContain('var(--radius-lg)');
```

#### Step 3.5: Verify Visual Appearance

Generate the component and verify it looks correct:

```bash
npm run generate -- --blueprint card-001 --output ./test-output/
```

Open generated file and verify:
- Component renders correctly
- Styles are applied
- CSS variables resolve to correct values

✅ **Checkpoint**: First component successfully migrated and tested.

---

### Phase 4: Scale to More Components

**Goal**: Migrate additional components systematically.

#### Step 4.1: Create Migration Checklist

For each component to migrate:

- [ ] Identify all hardcoded style values
- [ ] Map each value to corresponding theme token
- [ ] Update blueprint with tokenBindings
- [ ] Remove hardcoded values from props
- [ ] Run component-specific tests
- [ ] Verify visual appearance
- [ ] Document any issues or special cases

#### Step 4.2: Prioritize Components

Migration priority:

1. **High Priority**: New components (adopt from start)
2. **Medium Priority**: Frequently used components (Card, Button, Input)
3. **Low Priority**: Legacy or rarely used components

#### Step 4.3: Batch Migration

Migrate components in small batches:

```
Week 1: Migrate 5 simple components
Week 2: Migrate 5 medium complexity components
Week 3: Migrate 5 complex components
Week 4: Polish and handle edge cases
```

#### Step 4.4: Token Reference Guide

Common mappings:

| Hardcoded Value | Theme Token |
|----------------|-------------|
| `#ffffff` (white) | `color-surface` |
| `#000000` (black) | `color-on-surface` |
| `#6366f1` (brand blue) | `color-primary` |
| `0.5rem` (border radius) | `radius-lg` |
| `1rem` (padding) | `spacing-4` |
| `0 1px 3px rgba(...)` (shadow) | `shadow-md` |

Full token reference: See `themes/calm-wellness.json`

✅ **Checkpoint**: Successfully migrated multiple components with consistent patterns.

---

### Phase 5: Add Custom Theme Support (Optional)

**Goal**: Create custom themes for your project.

#### Step 5.1: Create Custom Theme File

Create `themes/my-brand-theme.json`:

```json
{
  "id": "my-brand-theme",
  "name": "My Brand Theme",
  "description": "Custom theme matching our brand guidelines",
  "version": "1.0.0",
  "brandTone": "professional",
  "colorPalette": {
    "primary": {
      "l": 0.55,
      "c": 0.18,
      "h": 250,
      "description": "Brand primary color"
    },
    "surface": {
      "l": 0.98,
      "c": 0.01,
      "h": 250,
      "description": "Background surface"
    }
  },
  "typography": {
    "fontFamily": {
      "sans": "Your Brand Font, system-ui, sans-serif"
    },
    "scale": {
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem"
    }
  },
  "componentDefaults": {
    "borderRadius": {
      "sm": "0.25rem",
      "md": "0.5rem",
      "lg": "0.75rem"
    },
    "density": "comfortable",
    "contrast": "normal"
  },
  "aiContext": {
    "usageGuidelines": "Use for professional business contexts",
    "colorMood": "Trustworthy and modern",
    "targetAudience": "Enterprise customers"
  }
}
```

#### Step 5.2: Use Custom Theme

```typescript
const result = await renderScreen(blueprint, {
  themeId: 'my-brand-theme'
});
```

#### Step 5.3: Validate Custom Theme

Run validation tests:

```bash
npm test -- --grep "theme"
```

Expected: All theme tests pass with custom theme.

✅ **Checkpoint**: Custom theme created and validated.

---

## Testing Your Migration

### Unit Tests

Test individual components with themes:

```typescript
import { describe, it, expect } from 'vitest';
import { renderScreen } from '@tekton/studio-mcp';

describe('Migrated Card Component', () => {
  it('should generate with theme tokens', async () => {
    const blueprint = createCardBlueprint(); // With tokenBindings

    const result = await renderScreen(blueprint);

    expect(result.success).toBe(true);
    expect(result.code).toContain('var(--color-surface)');
    expect(result.code).not.toContain('#f9fafb'); // No hardcoded colors
  });

  it('should work with different themes', async () => {
    const blueprint = createCardBlueprint();

    const result1 = await renderScreen(blueprint, { themeId: 'calm-wellness' });
    const result2 = await renderScreen(blueprint, { themeId: 'professional-dark' });

    expect(result1.themeApplied).toBe('calm-wellness');
    expect(result2.themeApplied).toBe('professional-dark');
  });
});
```

### Integration Tests

Test complete workflows:

```typescript
describe('Theme Migration Integration', () => {
  it('should generate multi-component layout with consistent theming', async () => {
    const blueprints = [
      createCardBlueprint(),
      createButtonBlueprint(),
      createInputBlueprint()
    ];

    const results = await Promise.all(
      blueprints.map(bp => renderScreen(bp, { themeId: 'calm-wellness' }))
    );

    // All should use same theme
    results.forEach(result => {
      expect(result.themeApplied).toBe('calm-wellness');
      expect(result.code).toContain('var(--color-primary)');
    });
  });
});
```

### Visual Regression Testing

Use Playwright or similar tools:

```typescript
import { test, expect } from '@playwright/test';

test('Card component visual appearance', async ({ page }) => {
  await page.goto('/components/card');

  // Take screenshot
  await expect(page.locator('[data-testid="card"]')).toHaveScreenshot();
});
```

---

## Common Pitfalls

### Pitfall 1: Mixing Hardcoded and Token Styles

❌ **Don't**:

```typescript
{
  props: {
    style: {
      backgroundColor: '#ffffff'  // ❌ Hardcoded
    }
  },
  tokenBindings: {
    borderRadius: 'radius-lg'  // ✅ Token
  }
}
```

✅ **Do**:

```typescript
{
  props: {},  // No hardcoded styles
  tokenBindings: {
    backgroundColor: 'color-surface',  // ✅ Token
    borderRadius: 'radius-lg'          // ✅ Token
  }
}
```

**Why**: Mixing approaches causes inconsistency and defeats the purpose of theme tokens.

---

### Pitfall 2: Using Non-Existent Tokens

❌ **Don't**:

```typescript
{
  tokenBindings: {
    backgroundColor: 'color-brand-blue'  // ❌ Token doesn't exist
  }
}
```

**Result**: Warning emitted, token key used as-is.

✅ **Do**:

```typescript
// First, check theme file for available tokens
// themes/calm-wellness.json

{
  tokenBindings: {
    backgroundColor: 'color-primary'  // ✅ Exists in theme
  }
}
```

**Tip**: Always reference the theme configuration file for available token names.

---

### Pitfall 3: Forgetting Fallback Values

❌ **Don't**:

```typescript
const color = resolver.getTokenValue(tokens, 'color-unknown');
// Returns 'color-unknown' (not useful)
```

✅ **Do**:

```typescript
const color = resolver.getTokenValue(
  tokens,
  'color-unknown',
  '#ffffff'  // ✅ Sensible fallback
);
// Returns '#ffffff' with warning
```

---

### Pitfall 4: Ignoring Warnings

TokenResolver emits warnings for debugging:

```
Warning: Token 'color-brand-blue' not found in theme 'calm-wellness'
```

**Action**: Don't ignore these warnings. They indicate:
- Typo in token name
- Missing token in theme
- Need to add token to theme configuration

---

### Pitfall 5: Cache Issues

If theme changes not reflected:

```typescript
import { TokenResolver } from '@tekton/component-generator';

const resolver = new TokenResolver();

// Clear cache after theme file changes
resolver.clearCache();

// Reload theme
const theme = await resolver.loadTheme('calm-wellness');
```

---

## Rollback Plan

If migration causes issues, you can rollback safely.

### Rollback Strategy

1. **Remove tokenBindings**: Delete tokenBindings field from blueprints
2. **Restore hardcoded values**: Put styles back in props.style
3. **Run tests**: Verify everything works as before

### Example Rollback

Before (migrated):

```typescript
{
  props: {},
  tokenBindings: {
    backgroundColor: 'color-surface'
  }
}
```

After (rolled back):

```typescript
{
  props: {
    style: {
      backgroundColor: '#f9fafb'
    }
  }
}
```

### No Code Changes Required

If you don't want to adopt tokens yet:
- **Do nothing**
- Existing code continues to work
- Default theme applied automatically

---

## Migration Checklist

Use this checklist to track your migration progress:

### Pre-Migration

- [ ] Updated to latest package versions
- [ ] Ran existing tests (all passing)
- [ ] Read theme token documentation
- [ ] Understood theme priority rules

### Phase 1: First Component

- [ ] Selected simple component for migration
- [ ] Identified hardcoded values
- [ ] Replaced with token bindings
- [ ] Tested migrated component
- [ ] Verified visual appearance

### Phase 2: Batch Migration

- [ ] Created migration prioritization list
- [ ] Migrated high-priority components
- [ ] Migrated medium-priority components
- [ ] Migrated low-priority components
- [ ] Updated component documentation

### Phase 3: Custom Themes (Optional)

- [ ] Created custom theme configuration
- [ ] Validated theme JSON structure
- [ ] Tested components with custom theme
- [ ] Documented custom theme usage

### Post-Migration

- [ ] All tests passing
- [ ] Visual regression tests passing
- [ ] Documentation updated
- [ ] Team trained on new system
- [ ] Rollback plan documented

---

## Getting Help

### Resources

- **SPEC Document**: `.moai/specs/SPEC-THEME-BIND-001/spec.md`
- **API Reference**: `.moai/specs/SPEC-THEME-BIND-001/api.md`
- **TokenResolver Docs**: `packages/component-generator/docs/token-resolver.md`
- **Theme Config Guide**: `packages/component-generator/docs/theme-config.md`

### Common Questions

**Q: Do I have to migrate all components at once?**
A: No. You can migrate incrementally. Unmigrated components continue to work.

**Q: What happens if a token doesn't exist?**
A: A warning is emitted and fallback value is used (or token key as-is).

**Q: Can I use both hardcoded styles and tokens?**
A: Technically yes, but not recommended. Choose one approach for consistency.

**Q: How do I create a custom theme?**
A: Create a JSON file in `themes/` directory following `ThemeConfig` interface.

**Q: Can I change themes at runtime?**
A: Yes, pass different `themeId` to `renderScreen` options.

---

## Success Metrics

Track these metrics to measure migration success:

- **Component Coverage**: % of components using token bindings
- **Test Pass Rate**: Should remain 100%
- **Token Usage**: Number of unique tokens referenced
- **Theme Consistency**: Reduction in hardcoded values

**Target Metrics**:
- 80%+ components using tokens
- 100% test pass rate
- < 5% hardcoded values remaining
- 0 theme-related runtime errors

---

**Document Version**: 1.0.0
**Last Updated**: 2026-01-21
**Status**: ✅ Current
**Feedback**: Report issues to tekton-team@example.com
