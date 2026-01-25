# API Migration Guide: Preset → Theme

**Document Version:** 1.0.0
**Generated:** 2026-01-23
**Migration Date:** December 2025
**Breaking Change:** Yes (Major Version)

---

## Table of Contents

1. [Overview](#overview)
2. [Migration Summary](#migration-summary)
3. [Breaking Changes](#breaking-changes)
4. [Migration Steps](#migration-steps)
5. [Code Examples](#code-examples)
6. [Common Patterns](#common-patterns)
7. [Troubleshooting](#troubleshooting)

---

## Overview

### What Changed?

The Tekton Studio MCP project completed a comprehensive API migration from "Preset" terminology to "Theme" terminology. This was a deliberate, breaking change to improve API clarity and align with industry standards.

**Key Changes:**
- All "Preset" types renamed to "Theme" types
- All "presetId" fields renamed to "themeId"
- All "PresetConfig" interfaces renamed to "Theme"
- All function names updated (e.g., `resolvePreset` → `resolveTheme`)
- Configuration property names updated
- Default values changed

### Why This Change?

**Reasons for Migration:**

1. **Industry Alignment**
   - "Theme" is standard terminology in React ecosystem (Material UI, Chakra UI, Ant Design)
   - "Preset" suggests static configurations, not dynamic design systems
   - Clearer distinction between themes (design) and presets (configuration)

2. **Developer Experience**
   - More intuitive API for new users
   - Consistent with design system terminology
   - Better IDE autocomplete suggestions

3. **Future-Proofing**
   - Enables advanced theme features (runtime switching, inheritance)
   - Aligns with CSS Custom Properties standard
   - Prepares for potential multi-theme support

### Migration Impact

**Scope:**
- 50+ files modified
- 1,200+ lines changed
- 87 test cases updated
- All documentation updated

**Effort Estimate:**
- Small projects (< 10 files): 1-2 hours
- Medium projects (10-50 files): 4-6 hours
- Large projects (> 50 files): 8-12 hours

---

## Migration Summary

### High-Level Changes

**Type Name Changes:**

| Old (Preset API) | New (Theme API) |
|------------------|-----------------|
| `PresetConfig` | `Theme` |
| `PresetResolver` | `ThemeResolver` |
| `PresetBinding` | `ThemeBinding` |
| `presetId` | `themeId` |
| `presetTokens` | `tokens` |
| `resolvePreset()` | `resolveTheme()` |

**Blueprint Schema Changes:**

**Before:**
```typescript
interface BlueprintResult {
  blueprintId: string;
  componentName: string;
  presetId?: string;  // OLD
}
```

**After:**
```typescript
interface BlueprintResult {
  blueprintId: string;
  componentName: string;
  themeId?: string;  // NEW
}
```

**Function Signature Changes:**

**Before:**
```typescript
function buildASTFromBlueprint(
  blueprint: BlueprintResult
): ASTBuildResult;
```

**After:**
```typescript
function buildASTFromBlueprint(
  blueprint: BlueprintResult,
  options?: ASTBuildOptions  // NEW: theme options
): ASTBuildResult;
```

---

## Breaking Changes

### 1. Type Definitions

**Breaking Change:** All "Preset" type names replaced with "Theme"

**Before (Old API):**
```typescript
import type { PresetConfig } from '@tekton/component-generator';

interface BlueprintInput {
  presetId?: string;
}

function usePreset(config: PresetConfig): void {
  // ...
}
```

**After (New API):**
```typescript
import type { Theme } from '@tekton/component-generator';

interface BlueprintInput {
  themeId?: string;
}

function useTheme(config: Theme): void {
  // ...
}
```

**Migration Action:**
- Find and replace all "Preset" type references with "Theme"
- Update import statements
- Rename variables and function parameters
- Update type annotations

---

### 2. Blueprint Schema

**Breaking Change:** `presetId` field renamed to `themeId` in blueprint structure

**Before (Old Schema):**
```typescript
const blueprint: BlueprintResult = {
  blueprintId: 'btn-001',
  componentName: 'MyButton',
  presetId: 'minimal-preset',  // OLD
  rootElement: {
    tag: 'button',
    children: [{ type: 'text', value: 'Click' }]
  }
};
```

**After (New Schema):**
```typescript
const blueprint: BlueprintResult = {
  blueprintId: 'btn-001',
  componentName: 'MyButton',
  themeId: 'minimal-theme',  // NEW
  rootElement: {
    tag: 'button',
    children: [{ type: 'text', value: 'Click' }]
  }
};
```

**Migration Action:**
- Update all blueprint JSON/TypeScript objects
- Change `presetId` to `themeId`
- Update theme ID values (e.g., 'minimal-preset' → 'minimal-theme')

---

### 3. Function Names

**Breaking Change:** All preset-related function names updated to theme

**Before (Old Functions):**
```typescript
import { resolvePreset, listPresets } from '@tekton/component-generator';

const preset = resolvePreset('minimal-preset');
const allPresets = listPresets();
```

**After (New Functions):**
```typescript
import { resolveTheme, listThemes } from '@tekton/component-generator';

const theme = resolveTheme('minimal-theme');
const allThemes = listThemes();
```

**Migration Action:**
- Find and replace function calls
- Update import statements
- Rename wrapper functions

---

### 4. Configuration Properties

**Breaking Change:** Configuration object property names changed

**Before (Old Config):**
```typescript
const config = {
  defaultPreset: 'minimal-preset',
  presetPath: './presets',
  enablePresetValidation: true
};
```

**After (New Config):**
```typescript
const config = {
  defaultTheme: 'minimal-theme',
  themePath: './themes',
  enableThemeValidation: true
};
```

**Migration Action:**
- Update configuration files
- Rename all "preset" config keys to "theme"
- Update default values

---

### 5. Generated Output

**Breaking Change:** Output metadata property names changed

**Before (Old Output):**
```typescript
interface ASTBuildResult {
  code: string;
  metadata: {
    appliedPreset?: string;  // OLD
  };
}
```

**After (New Output):**
```typescript
interface ASTBuildResult {
  code: string;
  metadata: {
    appliedTheme?: string;  // NEW
  };
}
```

**Migration Action:**
- Update code that reads output metadata
- Change `appliedPreset` to `appliedTheme`

---

## Migration Steps

### Step 1: Update Import Statements

**Find:**
```typescript
import { PresetConfig, resolvePreset } from '@tekton/component-generator';
```

**Replace with:**
```typescript
import { Theme, resolveTheme } from '@tekton/component-generator';
```

**Automation:**
```bash
# Use sed or similar tool for batch replacement
sed -i 's/PresetConfig/Theme/g' **/*.ts
sed -i 's/resolvePreset/resolveTheme/g' **/*.ts
```

---

### Step 2: Update Type Annotations

**Find:**
```typescript
function getPreset(id: string): PresetConfig {
  return resolvePreset(id);
}
```

**Replace with:**
```typescript
function getTheme(id: string): Theme {
  return resolveTheme(id);
}
```

**Checklist:**
- [ ] Update all function return types
- [ ] Update all function parameter types
- [ ] Update all variable type annotations
- [ ] Update all interface/type definitions

---

### Step 3: Update Blueprint Structures

**Find:**
```json
{
  "blueprintId": "btn-001",
  "componentName": "MyButton",
  "presetId": "minimal-preset",
  "rootElement": { ... }
}
```

**Replace with:**
```json
{
  "blueprintId": "btn-001",
  "componentName": "MyButton",
  "themeId": "minimal-theme",
  "rootElement": { ... }
}
```

**Automation:**
```bash
# JSON files
find . -name "*.json" -exec sed -i 's/"presetId"/"themeId"/g' {} +

# TypeScript files
find . -name "*.ts" -exec sed -i 's/presetId:/themeId:/g' {} +
```

---

### Step 4: Update Function Calls

**Find:**
```typescript
const preset = resolvePreset('minimal-preset');
console.log(preset.presetTokens);
```

**Replace with:**
```typescript
const theme = resolveTheme('minimal-theme');
console.log(theme.tokens);
```

**Checklist:**
- [ ] Update all function call sites
- [ ] Update all property access (e.g., `.presetTokens` → `.tokens`)
- [ ] Update all method calls

---

### Step 5: Update Configuration Files

**Find (config.json):**
```json
{
  "defaultPreset": "minimal-preset",
  "presetPath": "./presets"
}
```

**Replace with:**
```json
{
  "defaultTheme": "minimal-theme",
  "themePath": "./themes"
}
```

---

### Step 6: Update Tests

**Find:**
```typescript
describe('Preset Resolution', () => {
  it('should resolve preset by ID', () => {
    const preset = resolvePreset('test-preset');
    expect(preset.presetId).toBe('test-preset');
  });
});
```

**Replace with:**
```typescript
describe('Theme Resolution', () => {
  it('should resolve theme by ID', () => {
    const theme = resolveTheme('test-theme');
    expect(theme.themeId).toBe('test-theme');
  });
});
```

---

### Step 7: Verify Compilation

**Run TypeScript Compiler:**
```bash
pnpm tsc --noEmit
```

**Expected Result:**
```
✅ TypeScript compilation completed successfully
✅ 0 errors found
```

**If Errors Occur:**
1. Read error messages carefully
2. Look for remaining "Preset" references
3. Check import statements
4. Verify type annotations

---

### Step 8: Run Test Suite

**Run All Tests:**
```bash
pnpm test
```

**Expected Result:**
```
✅ All tests passing
✅ Zero failures
```

**If Tests Fail:**
1. Update test assertions
2. Check for hardcoded "preset" strings
3. Verify test data structures

---

## Code Examples

### Example 1: Basic Theme Usage

**Before (Preset API):**
```typescript
import { PresetConfig, resolvePreset } from '@tekton/component-generator';

function applyPreset(presetId: string): PresetConfig {
  const preset = resolvePreset(presetId);
  console.log('Applying preset:', preset.presetName);
  console.log('Tokens:', preset.presetTokens);
  return preset;
}

// Usage
const myPreset = applyPreset('minimal-preset');
```

**After (Theme API):**
```typescript
import { Theme, resolveTheme } from '@tekton/component-generator';

function applyTheme(themeId: string): Theme {
  const theme = resolveTheme(themeId);
  console.log('Applying theme:', theme.themeName);
  console.log('Tokens:', theme.tokens);
  return theme;
}

// Usage
const myTheme = applyTheme('minimal-theme');
```

---

### Example 2: Component Generation with Theme

**Before (Preset API):**
```typescript
import { buildASTFromBlueprint } from '@tekton/component-generator';

const blueprint = {
  blueprintId: 'btn-001',
  componentName: 'PrimaryButton',
  presetId: 'modern-preset',
  rootElement: {
    tag: 'button',
    children: [{ type: 'text', value: 'Click me' }]
  }
};

const result = buildASTFromBlueprint(blueprint);
console.log(result.code);
```

**After (Theme API):**
```typescript
import { buildASTFromBlueprint } from '@tekton/component-generator';

const blueprint = {
  blueprintId: 'btn-001',
  componentName: 'PrimaryButton',
  themeId: 'modern-theme',
  rootElement: {
    tag: 'button',
    children: [{ type: 'text', value: 'Click me' }]
  }
};

const result = buildASTFromBlueprint(blueprint, {
  themeId: 'modern-theme',  // NEW: explicit theme option
  injectStyles: true
});
console.log(result.code);
```

---

### Example 3: Conditional Theme Application

**Before (Preset API):**
```typescript
function generateComponent(
  blueprint: BlueprintResult,
  usePreset: boolean
): string {
  if (usePreset && blueprint.presetId) {
    const preset = resolvePreset(blueprint.presetId);
    return buildWithPreset(blueprint, preset);
  }
  return buildWithoutPreset(blueprint);
}
```

**After (Theme API):**
```typescript
function generateComponent(
  blueprint: BlueprintResult,
  useTheme: boolean
): string {
  if (useTheme && blueprint.themeId) {
    const theme = resolveTheme(blueprint.themeId);
    return buildWithTheme(blueprint, theme);
  }
  return buildWithoutTheme(blueprint);
}
```

---

### Example 4: Custom Theme Creation

**Before (Preset API):**
```typescript
const customPreset: PresetConfig = {
  presetId: 'custom-001',
  presetName: 'My Custom Preset',
  presetTokens: {
    'color-primary': '#007bff',
    'color-secondary': '#6c757d',
    'font-family': 'Inter, sans-serif'
  }
};

registerPreset(customPreset);
```

**After (Theme API):**
```typescript
const customTheme: Theme = {
  themeId: 'custom-001',
  themeName: 'My Custom Theme',
  tokens: {
    'color-primary': '#007bff',
    'color-secondary': '#6c757d',
    'font-family': 'Inter, sans-serif'
  }
};

registerTheme(customTheme);
```

---

## Common Patterns

### Pattern 1: Theme Validation

**Before:**
```typescript
function validatePreset(presetId: string): boolean {
  try {
    resolvePreset(presetId);
    return true;
  } catch (error) {
    console.error('Invalid preset:', presetId);
    return false;
  }
}
```

**After:**
```typescript
function validateTheme(themeId: string): boolean {
  try {
    resolveTheme(themeId);
    return true;
  } catch (error) {
    console.error('Invalid theme:', themeId);
    return false;
  }
}
```

---

### Pattern 2: Default Theme Fallback

**Before:**
```typescript
const presetId = blueprint.presetId || config.defaultPreset;
const preset = resolvePreset(presetId);
```

**After:**
```typescript
const themeId = blueprint.themeId || config.defaultTheme;
const theme = resolveTheme(themeId);
```

---

### Pattern 3: Theme Token Access

**Before:**
```typescript
const preset = resolvePreset('minimal-preset');
const primaryColor = preset.presetTokens['color-primary'];
const fontFamily = preset.presetTokens['font-family'];
```

**After:**
```typescript
const theme = resolveTheme('minimal-theme');
const primaryColor = theme.tokens['color-primary'];
const fontFamily = theme.tokens['font-family'];
```

---

### Pattern 4: Listing Available Themes

**Before:**
```typescript
import { listPresets } from '@tekton/component-generator';

function showAvailablePresets(): void {
  const presets = listPresets();
  presets.forEach(preset => {
    console.log(`${preset.presetId}: ${preset.presetName}`);
  });
}
```

**After:**
```typescript
import { listThemes } from '@tekton/component-generator';

function showAvailableThemes(): void {
  const themes = listThemes();
  themes.forEach(theme => {
    console.log(`${theme.themeId}: ${theme.themeName}`);
  });
}
```

---

## Troubleshooting

### Issue 1: TypeScript Compilation Errors

**Symptom:**
```
error TS2304: Cannot find name 'PresetConfig'
```

**Cause:** Old "Preset" type still referenced in code

**Solution:**
1. Search for all "Preset" occurrences:
   ```bash
   grep -r "Preset" --include="*.ts" .
   ```
2. Replace with "Theme" equivalent
3. Re-run type checking

---

### Issue 2: Test Failures

**Symptom:**
```
Error: expect(received).toBe(expected)
Expected: "minimal-preset"
Received: undefined
```

**Cause:** Test assertions still checking old `presetId` property

**Solution:**
1. Update test assertions to use `themeId`
2. Update test data to use new theme IDs
3. Re-run tests

---

### Issue 3: Blueprint Validation Failures

**Symptom:**
```
ValidationError: Unknown property 'presetId'
```

**Cause:** Blueprint JSON still uses old `presetId` field

**Solution:**
1. Update blueprint JSON files
2. Change `presetId` to `themeId`
3. Update theme ID values
4. Re-validate blueprints

---

### Issue 4: Runtime Errors (Theme Not Found)

**Symptom:**
```
Error: Theme 'minimal-preset' not found
Did you mean: 'minimal-theme'?
```

**Cause:** Theme ID not updated to new naming convention

**Solution:**
1. Update theme ID to new naming (e.g., 'minimal-preset' → 'minimal-theme')
2. Check built-in theme catalog for available themes
3. Ensure theme ID matches catalog entries

---

### Issue 5: Configuration Not Loaded

**Symptom:**
```
Error: Invalid configuration: 'defaultPreset' is not a valid config key
```

**Cause:** Configuration file still uses old property names

**Solution:**
1. Update config file property names
2. Change `defaultPreset` to `defaultTheme`
3. Change `presetPath` to `themePath`
4. Reload configuration

---

## Backward Compatibility

### No Backward Compatibility

**Important:** This migration provides NO backward compatibility. Old code using "Preset" API will fail immediately.

**Rationale:**
- Clean break enables better future evolution
- Maintaining dual APIs adds complexity burden
- Single-version support simplifies testing and documentation

### Migration Path

**Recommended Approach:**
1. Create migration branch
2. Apply all changes at once
3. Test thoroughly
4. Deploy to all environments simultaneously
5. Update all dependent projects

**Not Recommended:**
- Gradual migration (mixing old and new API)
- Deprecation period with dual API support
- Partial updates (some files old, some new)

---

## Verification Checklist

After completing migration, verify:

**Code:**
- [ ] All TypeScript compilation errors resolved
- [ ] All linter warnings fixed
- [ ] All test cases passing
- [ ] No remaining "Preset" references in code

**Configuration:**
- [ ] Config files updated
- [ ] Default values changed
- [ ] Environment variables updated

**Documentation:**
- [ ] README updated
- [ ] API reference updated
- [ ] Examples updated
- [ ] Comments updated

**Testing:**
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] Edge cases verified

**Deployment:**
- [ ] Build succeeds
- [ ] Runtime errors checked
- [ ] Performance verified
- [ ] Rollback plan prepared

---

## Related Documentation

**Internal:**
- [Implementation State Report](implementation-state-2026-01-23.md)
- [Architecture Diagrams](architecture-diagrams.md)
- [Adapter Pattern Guide](adapter-pattern-guide.md)

**External:**
- [TypeScript Refactoring Guide](https://www.typescriptlang.org/docs/handbook/refactoring-with-typescript.html)
- [Semantic Versioning](https://semver.org/) (for version bump guidance)

---

**Document Metadata:**
- **Version:** 1.0.0
- **Last Updated:** 2026-01-23
- **Maintained by:** workflow-docs agent
- **Scope:** Complete API migration guide

---

**End of API Migration Guide**
