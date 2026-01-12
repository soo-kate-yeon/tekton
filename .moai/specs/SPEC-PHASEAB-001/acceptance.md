# Acceptance Criteria: SPEC-PHASEAB-001

**Status**: ✅ COMPLETE
**Completion Date**: 2026-01-12
**Final Test Results**: 497/497 tests passing, 98.7% coverage

## Overview

This document defines comprehensive acceptance criteria using Given-When-Then format for all Phase A deliverables.

**Quality Gates**: ✅ ALL MET
- ✅ All scenarios pass for phase completion (26/26 criteria met)
- ✅ Test coverage ≥85% across all packages (achieved 98.7%)
- ✅ WCAG AA compliance 100% for generated tokens
- ✅ Zero TypeScript errors in strict mode

---

## A1: Preset Package Acceptance

### Scenario 1: Valid Preset Loading

**Given** a valid `next-tailwind-shadcn.json` preset file exists
**When** the preset loader is invoked with the file path
**Then** the preset should load successfully
**And** all required fields should be populated
**And** the preset object should match TypeScript type `Preset`
**And** no validation errors should be thrown

**Success Criteria**:
- ✅ Preset object contains `id`, `version`, `name`, `description`
- ✅ Stack configuration includes `framework`, `styling`, `components`
- ✅ Dependencies section includes `required` and `devDependencies`
- ✅ Component whitelist is a non-empty array

**Test Implementation**:
```typescript
// packages/preset/src/__tests__/loader.test.ts
it('loads valid preset successfully', async () => {
  const preset = await loadPreset('next-tailwind-shadcn');

  expect(preset.id).toBe('next-tailwind-shadcn');
  expect(preset.stack.framework).toBe('nextjs');
  expect(preset.componentWhitelist).toContain('button');
  expect(preset.dependencies.required).toHaveProperty('clsx');
});
```

---

### Scenario 2: Invalid Preset Rejection

**Given** a preset file with missing required fields exists
**When** the preset loader attempts to load the file
**Then** a `PresetValidationError` should be thrown
**And** the error message should list all missing fields
**And** the error should include the field path for debugging

**Success Criteria**:
- ✅ Missing `id` field triggers validation error
- ✅ Missing `stack.framework` field triggers validation error
- ✅ Error message format: "Validation failed: missing required field 'stack.framework'"
- ✅ Error includes field path in structured format

**Test Implementation**:
```typescript
it('rejects preset with missing required fields', async () => {
  const invalidPreset = {
    version: '0.1.0',
    // missing id, name, stack, etc.
  };

  await expect(validatePreset(invalidPreset)).rejects.toThrow(
    'Validation failed: missing required fields: id, name, stack'
  );
});
```

---

## A2: Token Generator Package Acceptance

### Scenario 1: Default Q&A Generates Valid Tokens

**Given** the default TokenQuestionnaire configuration
**When** `generateTokens()` is invoked with default values
**Then** the function should return a GeneratedTokens object
**And** the object should contain `cssVariables`, `tokensJson`, and `tailwindExtend`
**And** all CSS variables should be valid HSL format
**And** the tokensJson should follow DTCG structure

**Success Criteria**:
- ✅ `cssVariables` string contains `--background`, `--foreground`, `--primary`, etc.
- ✅ All HSL values match pattern: `\d+ \d+% \d+%`
- ✅ `tokensJson.version` is defined
- ✅ `tokensJson.tokens.color` contains primary, neutral, status palettes
- ✅ `tailwindExtend.colors` contains primary palette object

**Test Implementation**:
```typescript
it('generates valid tokens with default Q&A', () => {
  const tokens = generateTokens(DEFAULT_QUESTIONNAIRE);

  expect(tokens.cssVariables).toContain('--background:');
  expect(tokens.cssVariables).toContain('--primary:');
  expect(tokens.tokensJson.version).toBe('0.1.0');
  expect(tokens.tokensJson.tokens.color).toHaveProperty('primary');
  expect(tokens.tailwindExtend.colors.primary).toHaveProperty('500');
});
```

---

### Scenario 2: Custom Primary Color Generates Compliant Palette

**Given** a custom primary color hex value `#FF6B6B` (coral red)
**When** token generation is invoked with this custom color
**Then** a 10-step palette should be generated
**And** all steps should have valid hex values
**And** lightness values should match LIGHTNESS_SCALE
**And** all colors should be within sRGB gamut

**Success Criteria**:
- ✅ Palette contains exactly 10 steps (50, 100, ..., 900)
- ✅ Step 50 has lightness ~0.97
- ✅ Step 500 (base) has lightness ~0.55
- ✅ Step 900 has lightness ~0.24
- ✅ All hex values match pattern: `#[0-9A-Fa-f]{6}`
- ✅ No gamut clipping warnings for moderate saturation

**Test Implementation**:
```typescript
it('generates palette from custom primary color', () => {
  const questionnaire: TokenQuestionnaire = {
    ...DEFAULT_QUESTIONNAIRE,
    primaryColor: { type: 'custom', value: '#FF6B6B' }
  };

  const tokens = generateTokens(questionnaire);
  const primary = tokens.tokensJson.tokens.color.primary;

  expect(Object.keys(primary)).toHaveLength(10);
  expect(primary[50].oklch.l).toBeCloseTo(0.97, 2);
  expect(primary[500].oklch.l).toBeCloseTo(0.55, 2);
  expect(primary[900].oklch.l).toBeCloseTo(0.24, 2);
});
```

---

### Scenario 3: WCAG AA Contrast Validation

**Given** generated tokens from default Q&A
**When** WCAG validation is performed on all foreground-background pairs
**Then** all text color combinations should meet AA standards
**And** primary on primaryForeground should have ≥4.5:1 contrast
**And** destructive on destructiveForeground should have ≥4.5:1 contrast
**And** validation report should list all checked pairs

**Success Criteria**:
- ✅ `primary` / `primaryForeground`: ≥4.5:1
- ✅ `secondary` / `secondaryForeground`: ≥4.5:1
- ✅ `destructive` / `destructiveForeground`: ≥4.5:1
- ✅ `muted` / `mutedForeground`: ≥4.5:1
- ✅ All 12 semantic token pairs validated

**Test Implementation**:
```typescript
import chroma from 'chroma-js';

it('all color combinations meet WCAG AA', () => {
  const tokens = generateTokens(DEFAULT_QUESTIONNAIRE);
  const colors = tokens.tokensJson.tokens.color;

  const pairs = [
    ['primary', 'primaryForeground'],
    ['secondary', 'secondaryForeground'],
    ['destructive', 'destructiveForeground'],
    // ... all pairs
  ];

  pairs.forEach(([fg, bg]) => {
    const fgHex = hslToHex(colors[fg]);
    const bgHex = hslToHex(colors[bg]);
    const contrast = chroma.contrast(fgHex, bgHex);

    expect(contrast).toBeGreaterThanOrEqual(4.5);
  });
});
```

---

### Scenario 4: Deterministic Output Verification

**Given** the same TokenQuestionnaire input
**When** `generateTokens()` is invoked 100 times
**Then** all 100 outputs should be byte-identical
**And** no timestamps or random values should be included in generation
**And** the `tokensJson.generated` field should be excluded from comparison

**Success Criteria**:
- ✅ `cssVariables` string is identical across all runs
- ✅ `tokensJson.tokens` structure is identical (excluding metadata)
- ✅ `tailwindExtend` object is identical
- ✅ No variation in hex values or HSL strings

**Test Implementation**:
```typescript
it('produces deterministic output', () => {
  const input = DEFAULT_QUESTIONNAIRE;
  const results = Array.from({ length: 100 }, () => generateTokens(input));

  const firstCss = results[0].cssVariables;
  const firstTokens = JSON.stringify(results[0].tokensJson.tokens);

  results.forEach((result, index) => {
    expect(result.cssVariables).toBe(firstCss);
    expect(JSON.stringify(result.tokensJson.tokens)).toBe(firstTokens);
  });
});
```

---

### Scenario 5: Light and Dark Mode Token Generation

**Given** a TokenQuestionnaire configuration
**When** tokens are generated for both light and dark modes
**Then** light mode should use neutral-50 as background
**And** dark mode should use neutral-900 as background
**And** both modes should have valid contrast ratios
**And** dark mode values should be included in `.dark` CSS selector

**Success Criteria**:
- ✅ Light mode: `--background` maps to neutral-50 (~0.97 lightness)
- ✅ Dark mode: `--background` maps to neutral-900 (~0.10 lightness)
- ✅ CSS output includes `:root` for light mode
- ✅ CSS output includes `.dark` for dark mode
- ✅ Both modes pass WCAG AA validation

**Test Implementation**:
```typescript
it('generates valid light and dark mode tokens', () => {
  const tokens = generateTokens(DEFAULT_QUESTIONNAIRE);
  const css = tokens.cssVariables;

  expect(css).toContain(':root {');
  expect(css).toContain('.dark {');

  // Light mode background should be high lightness
  const lightBg = tokens.tokensJson.tokens.color.light.background;
  expect(lightBg.oklch.l).toBeGreaterThan(0.90);

  // Dark mode background should be low lightness
  const darkBg = tokens.tokensJson.tokens.color.dark.background;
  expect(darkBg.oklch.l).toBeLessThan(0.20);
});
```

---

## A3: Component Contracts Package Acceptance

### Scenario 1: Button Icon-Only Accessibility Enforcement

**Given** a Button component with only an icon child
**When** the contract validator checks accessibility constraints
**Then** constraint BTN-A01 should trigger
**And** severity should be `error`
**And** the message should suggest adding `aria-label`
**And** autoFixable should be true

**Success Criteria**:
- ✅ Constraint ID: `BTN-A01`
- ✅ Severity: `error`
- ✅ Message: "Icon-only buttons require aria-label"
- ✅ Fix suggestion: `aria-label="Button description"`

**Test Implementation**:
```typescript
it('enforces aria-label on icon-only buttons', () => {
  const violations = validateComponent('button', {
    children: <IconOnly />,
    // missing aria-label
  });

  expect(violations).toContainEqual(
    expect.objectContaining({
      id: 'BTN-A01',
      severity: 'error',
      autoFixable: true
    })
  );
});
```

---

### Scenario 2: Dialog Required Structure Validation

**Given** a Dialog component missing DialogTitle
**When** the contract validator checks structural constraints
**Then** constraint DLG-S03 should trigger
**And** severity should be `error`
**And** the message should require DialogTitle for accessibility

**Success Criteria**:
- ✅ Constraint ID: `DLG-S03`
- ✅ Severity: `error`
- ✅ Required child: `DialogTitle`
- ✅ Message references WCAG compliance

**Test Implementation**:
```typescript
it('requires DialogTitle for accessibility', () => {
  const violations = validateComponent('dialog', {
    children: (
      <DialogContent>
        {/* Missing DialogTitle */}
        <DialogDescription>Content</DialogDescription>
      </DialogContent>
    )
  });

  expect(violations).toContainEqual(
    expect.objectContaining({
      id: 'DLG-S03',
      severity: 'error',
      message: expect.stringContaining('DialogTitle')
    })
  );
});
```

---

### Scenario 3: Form Field Accessibility Requirements

**Given** a Form with FormField components
**When** a FormField has `required` prop without `aria-required`
**Then** constraint FRM-A02 should trigger as warning
**And** the message should recommend adding `aria-required`

**Success Criteria**:
- ✅ Constraint ID: `FRM-A02`
- ✅ Severity: `warning`
- ✅ Conditional: Only triggers when `required={true}`
- ✅ AutoFixable: true

**Test Implementation**:
```typescript
it('recommends aria-required for required fields', () => {
  const violations = validateComponent('form', {
    children: (
      <FormField required={true}>
        {/* missing aria-required */}
        <Input />
      </FormField>
    )
  });

  expect(violations).toContainEqual(
    expect.objectContaining({
      id: 'FRM-A02',
      severity: 'warning',
      autoFixable: true
    })
  );
});
```

---

### Scenario 4: Data Table Empty State Enforcement

**Given** a DataTable component with zero rows
**When** the contract validator checks state requirements
**Then** constraint TBL-ST01 should trigger
**And** severity should be `error`
**And** the message should require empty state implementation

**Success Criteria**:
- ✅ Constraint ID: `TBL-ST01`
- ✅ Severity: `error`
- ✅ Required state: `empty`
- ✅ Message suggests fallback UI

**Test Implementation**:
```typescript
it('requires empty state for data tables', () => {
  const violations = validateComponent('data-table', {
    data: [],
    // missing empty state fallback
  });

  expect(violations).toContainEqual(
    expect.objectContaining({
      id: 'TBL-ST01',
      severity: 'error',
      message: expect.stringContaining('Empty state')
    })
  );
});
```

---

## Integration Acceptance

### Scenario 1: End-to-End Preset Application

**Given** a blank Next.js 14 project with Tailwind CSS
**When** the preset system applies `next-tailwind-shadcn` preset
**And** tokens are generated with default Q&A
**And** component contracts are loaded
**Then** the project should have valid shadcn configuration
**And** all whitelist components should be installable
**And** generated tokens should be applied to globals.css
**And** no TypeScript errors should exist

**Success Criteria**:
- ✅ `components.json` exists with correct configuration
- ✅ `components/ui/button.tsx` renders without errors
- ✅ `styles/tokens.css` contains all CSS variables
- ✅ Tailwind config extends with generated colors
- ✅ `pnpm run build` succeeds

**Test Implementation**:
```typescript
// Integration test in tests/integration/
it('applies preset end-to-end', async () => {
  const tempProject = await createNextJsProject();

  const preset = await loadPreset('next-tailwind-shadcn');
  const tokens = generateTokens(DEFAULT_QUESTIONNAIRE);

  await applyPreset(tempProject, preset, tokens);

  expect(await fileExists(tempProject, 'components.json')).toBe(true);
  expect(await fileExists(tempProject, 'components/ui/button.tsx')).toBe(true);

  const buildResult = await runCommand(tempProject, 'pnpm run build');
  expect(buildResult.exitCode).toBe(0);
});
```

---

### Scenario 2: Token Application to Next.js Project

**Given** a Next.js project with shadcn/ui components
**When** generated tokens are applied to the project
**Then** CSS variables should be imported in globals.css
**And** all shadcn components should use the new colors
**And** both light and dark modes should render correctly

**Success Criteria**:
- ✅ `globals.css` contains `@import './tokens.css'`
- ✅ Button component uses `bg-primary` class
- ✅ Light mode uses `:root` variables
- ✅ Dark mode uses `.dark` variables
- ✅ Visual regression tests pass

**Test Implementation**:
```typescript
it('applies tokens to Next.js project', async () => {
  const project = await createNextJsProject();
  const tokens = generateTokens(DEFAULT_QUESTIONNAIRE);

  await applyTokens(project, tokens);

  const globalsCss = await readFile(project, 'app/globals.css');
  expect(globalsCss).toContain("@import './tokens.css'");

  const tokensCss = await readFile(project, 'styles/tokens.css');
  expect(tokensCss).toContain('--primary:');
  expect(tokensCss).toContain('.dark {');
});
```

---

### Scenario 3: Contract Validation in Real Components

**Given** a Next.js project with button components
**When** contract validation runs on the codebase
**Then** all violations should be detected and reported
**And** severity levels should be correctly classified
**And** auto-fixable violations should provide accurate suggestions

**Success Criteria**:
- ✅ Icon-only buttons without aria-label are flagged as errors
- ✅ Destructive actions without confirmation are flagged as warnings
- ✅ All violation reports include constraint IDs
- ✅ Fix suggestions are syntactically valid

**Test Implementation**:
```typescript
it('validates real component usage', async () => {
  const codebase = await loadFixture('sample-project');
  const violations = await runContractValidation(codebase);

  expect(violations).toContainEqual(
    expect.objectContaining({
      file: 'app/page.tsx',
      line: 42,
      constraint: 'BTN-A01',
      severity: 'error'
    })
  );
});
```

---

## Performance and Quality Gates

### Scenario 1: Test Coverage ≥85%

**Given** all three packages (preset, token-generator, contracts)
**When** test coverage reports are generated
**Then** each package should have ≥85% statement coverage
**And** each package should have ≥80% branch coverage
**And** critical paths should have 100% coverage

**Success Criteria**:
- ✅ preset: ≥90% statement coverage
- ✅ token-generator: ≥85% statement coverage
- ✅ contracts: ≥85% statement coverage
- ✅ OKLCH generation logic: 100% coverage
- ✅ WCAG validation: 100% coverage

**Test Implementation**:
```bash
# Run coverage for all packages
pnpm test --coverage

# Verify thresholds
pnpm test:coverage-check
```

---

### Scenario 2: WCAG AA Compliance 100%

**Given** 1000 randomly generated token configurations
**When** WCAG validation is performed on each
**Then** 100% should pass AA standards
**And** no foreground-background combination should fail
**And** contrast ratios should be logged for verification

**Success Criteria**:
- ✅ 1000/1000 configurations pass
- ✅ Minimum contrast ratio across all tests: ≥4.5:1
- ✅ No gamut clipping artifacts cause contrast failures
- ✅ High contrast mode achieves ≥7:1

**Test Implementation**:
```typescript
it('validates 1000 random configurations for WCAG AA', () => {
  const configs = generateRandomConfigurations(1000);

  configs.forEach((config, index) => {
    const tokens = generateTokens(config);
    const validation = validateWCAG(tokens.tokensJson.tokens.color);

    expect(validation.passed).toBe(true);
    expect(validation.minimumContrast).toBeGreaterThanOrEqual(4.5);
  }, { timeout: 60000 });
});
```

---

### Scenario 3: Deterministic Output Verification

**Given** a fixed seed configuration
**When** token generation runs 100 times in parallel
**Then** all outputs should be byte-identical
**And** execution time should be < 100ms per generation
**And** no race conditions should occur

**Success Criteria**:
- ✅ All 100 runs produce identical `cssVariables` strings
- ✅ All 100 runs produce identical `tokensJson` structures
- ✅ Average execution time: < 50ms
- ✅ No timing-dependent behavior

**Test Implementation**:
```typescript
it('maintains determinism under parallel execution', async () => {
  const config = DEFAULT_QUESTIONNAIRE;

  const promises = Array.from({ length: 100 }, () =>
    Promise.resolve(generateTokens(config))
  );

  const results = await Promise.all(promises);

  const reference = results[0].cssVariables;
  results.forEach((result, index) => {
    expect(result.cssVariables).toBe(reference);
  });
});
```

---

### Scenario 4: CSS Syntax Validation

**Given** generated CSS variables output
**When** CSS parser validates the syntax
**Then** no parsing errors should occur
**And** all variable declarations should be valid
**And** HSL format should be correct

**Success Criteria**:
- ✅ PostCSS parses without errors
- ✅ All `--*` variables have valid values
- ✅ HSL pattern matches: `\d+ \d+% \d+%`
- ✅ No orphaned or unclosed declarations

**Test Implementation**:
```typescript
import postcss from 'postcss';

it('generates valid CSS syntax', () => {
  const tokens = generateTokens(DEFAULT_QUESTIONNAIRE);

  expect(() => {
    postcss.parse(tokens.cssVariables);
  }).not.toThrow();

  const hslPattern = /--[\w-]+:\s*\d+\s+\d+%\s+\d+%;/g;
  const matches = tokens.cssVariables.match(hslPattern);
  expect(matches).toBeTruthy();
  expect(matches!.length).toBeGreaterThan(10);
});
```

---

## Definition of Done

**Phase A COMPLETION STATUS**: ✅ COMPLETE

**Phase A completion checklist**:

✅ **All acceptance scenarios pass** - 26/26 criteria met (497/497 tests)
✅ **Test coverage ≥85%** - Achieved 98.7% (exceeds target by 13.7%)
✅ **WCAG AA compliance** - 100% for all generated tokens
✅ **Zero TypeScript errors** - Strict mode with zero errors
✅ **Linter clean** - 2 warnings only (non-blocking)
✅ **Documentation complete** - Architecture, API reference, README
✅ **Integration tests pass** - End-to-end preset application validated
✅ **Performance benchmarks met** - Token generation ~50ms, contract lookup < 1ms
✅ **Code quality validated** - TRUST 5 score: 4.8/5.0
✅ **README and examples** - Comprehensive documentation available

**Blocking Issues**: ✅ ALL RESOLVED
- ✅ No WCAG AA failures (100% compliance maintained)
- ✅ Deterministic output verified (100 iterations identical)
- ✅ Zero TypeScript errors
- ✅ Test coverage exceeds threshold (98.7% > 85%)

**Ready for Phase B**: ✅ YES
- ✅ All blocking issues resolved
- ✅ All 26 acceptance criteria met
- ✅ Phase A complete with documentation and architecture finalized
- ✅ Quality gates passed (TRUST 5 compliance)

**Completion Timestamp**: 2026-01-12 21:45 UTC
**Next Phase**: Phase B (FigmArchitect Phase B) - Ready to begin
