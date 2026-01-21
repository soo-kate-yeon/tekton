---
id: SPEC-THEME-BIND-001
document: plan
version: "1.0.0"
created: "2026-01-21"
updated: "2026-01-21"
---

# Implementation Plan: Theme Token Binding

**TAG**: SPEC-THEME-BIND-001

## Executive Summary

This plan outlines the implementation of Theme Token Binding for the Tekton component generation system. The implementation enables generated React components to automatically receive theme-specific design tokens, with Calm Wellness as the default theme.

---

## Milestone Overview

| Milestone | Title | Priority | Dependencies |
|-----------|-------|----------|--------------|
| M1 | Blueprint Schema Extension | Critical | None |
| M2 | TokenResolver Implementation | Critical | M1 |
| M3 | JSXGenerator Theme Integration | High | M2 |
| M4 | renderScreen API Update | High | M3 |
| M5 | Testing and Validation | High | M4 |

---

## Milestone 1: Blueprint Schema Extension

### Objective
Add optional `themeId` field to BlueprintResult schema while maintaining backward compatibility.

### Tasks

**TASK-001**: Update BlueprintResult interface
- File: `packages/component-generator/src/types/knowledge-schema.ts`
- Add `themeId?: string` field to BlueprintResult interface
- Update JSDoc documentation

**TASK-002**: Update BlueprintResultSchema JSON Schema
- File: `packages/component-generator/src/types/knowledge-schema.ts`
- Add `themeId` property to JSON Schema
- Ensure it's optional (not in required array)

**TASK-003**: Update index.ts exports
- File: `packages/component-generator/src/index.ts`
- Verify BlueprintResult export includes new field

### Deliverables
- Modified `knowledge-schema.ts` with themeId field
- Existing tests pass without modification
- TypeScript compilation succeeds

### Acceptance Criteria
- BlueprintResult interface includes `themeId?: string`
- JSON Schema includes themeId property
- Existing blueprints without themeId process successfully

---

## Milestone 2: TokenResolver Implementation

### Objective
Create TokenResolver class to resolve component token bindings for a specific theme.

### Tasks

**TASK-004**: Create theme types definition
- File: `packages/component-generator/src/types/theme-types.ts` (NEW)
- Define ThemeConfig interface matching calm-wellness.json structure
- Define OKLCHColor interface
- Define ResolvedTokens interface

**TASK-005**: Implement TokenResolver class
- File: `packages/component-generator/src/resolvers/token-resolver.ts` (NEW)
- Load theme JSON files from themes directory
- Store themes in Map for quick lookup
- Implement resolveTokens() method
- Implement token-to-CSS-variable mapping

**TASK-006**: Add OKLCH to CSS value conversion
- File: `packages/component-generator/src/resolvers/token-resolver.ts`
- Convert OKLCH color values to CSS oklch() syntax
- Generate RGB fallback values for older browsers

**TASK-007**: Implement fallback logic
- Handle unknown theme IDs (fall back to calm-wellness)
- Handle missing tokens (use fallback values)
- Emit warnings for degraded scenarios

**TASK-008**: Write TokenResolver unit tests
- File: `packages/component-generator/tests/resolvers/token-resolver.test.ts` (NEW)
- Test theme loading
- Test token resolution for calm-wellness
- Test fallback behavior
- Test CSS variable generation

### Deliverables
- New `theme-types.ts` with type definitions
- New `token-resolver.ts` with TokenResolver class
- Unit tests with >= 85% coverage

### Acceptance Criteria
- TokenResolver loads all 13 theme files
- resolveTokens() returns correct CSS variables for calm-wellness
- Unknown themeId falls back to default with warning
- Missing tokens produce fallback values with warning

---

## Milestone 3: JSXGenerator Theme Integration

### Objective
Integrate TokenResolver into JSXGenerator pipeline for theme-aware code generation.

### Tasks

**TASK-009**: Update JSXGenerator constructor
- File: `packages/component-generator/src/generator/jsx-generator.ts`
- Add GeneratorOptions interface with themeId
- Initialize TokenResolver in constructor

**TASK-010**: Update generate() method signature
- Add options parameter for theme override
- Determine effective theme (options > blueprint > default)
- Pass theme context to ASTBuilder

**TASK-011**: Update ASTBuilder for theme context
- File: `packages/component-generator/src/generator/ast-builder.ts`
- Accept theme context in build() method
- Pass context to buildComponentNode()

**TASK-012**: Modify jsx-element-generator for token injection
- File: `packages/component-generator/src/generator/jsx-element-generator.ts`
- Import TokenResolver and COMPONENT_CATALOG
- Look up componentKnowledge for each node
- Resolve tokens using TokenResolver
- Inject style prop with CSS variables

**TASK-013**: Create tokensToStyleObject helper
- Convert ResolvedTokens to React style object
- Map token binding properties to CSS property names
- Handle camelCase conversion (borderRadius -> borderRadius)

**TASK-014**: Update generator tests
- File: `packages/component-generator/tests/generator/jsx-generator.test.ts`
- Add tests for theme option support
- Add tests for token injection
- Verify generated code structure

### Deliverables
- Modified `jsx-generator.ts` with theme support
- Modified `ast-builder.ts` with context passing
- Modified `jsx-element-generator.ts` with token injection
- Updated tests

### Acceptance Criteria
- JSXGenerator accepts theme options
- Generated code includes style props with CSS variables
- Components without token bindings process without error
- Existing generation tests pass

---

## Milestone 4: renderScreen API Update

### Objective
Update renderScreen function to accept theme parameter and report applied theme.

### Tasks

**TASK-015**: Update renderScreen signature
- File: `packages/studio-mcp/src/component/layer3-tools.ts`
- Create RenderScreenOptions interface
- Change second parameter from `string?` to `RenderScreenOptions?`
- Add themeId to options

**TASK-016**: Implement theme resolution logic
- Determine effective theme (options > blueprint > default)
- Validate theme exists in TokenResolver
- Log warning for unknown themes

**TASK-017**: Update return type
- Add `themeApplied?: string` to response
- Report which theme was actually used

**TASK-018**: Update MCP tool registration
- File: `packages/studio-mcp/src/server/index.ts` (if needed)
- Update render-screen tool input schema
- Add themeId parameter documentation

**TASK-019**: Update layer3-tools tests
- Add tests for theme parameter
- Test default theme application
- Test unknown theme fallback

### Deliverables
- Modified `layer3-tools.ts` with theme support
- Updated MCP tool schema
- Updated tests

### Acceptance Criteria
- renderScreen accepts RenderScreenOptions with themeId
- Response includes themeApplied field
- Default theme is "calm-wellness"
- Unknown themeId falls back with warning

---

## Milestone 5: Testing and Validation

### Objective
Comprehensive testing to ensure quality and backward compatibility.

### Tasks

**TASK-020**: Integration test for theme binding
- File: `packages/component-generator/tests/integration/theme-binding.test.ts` (NEW)
- Test full pipeline from Blueprint to generated code
- Test multiple components with different token bindings
- Test nested component token resolution

**TASK-021**: E2E test for LLM workflow
- Test complete flow: get-knowledge-schema -> render-screen with theme
- Verify generated code compiles
- Verify CSS variables present in output

**TASK-022**: Backward compatibility verification
- Run existing test suites
- Test blueprints without themeId
- Verify no breaking changes

**TASK-023**: Theme coverage testing
- Test with multiple themes (not just calm-wellness)
- Verify different themes produce different tokens
- Test theme-specific componentDefaults

**TASK-024**: Code quality validation
- Verify test coverage >= 85%
- Run ESLint and fix any issues
- Run TypeScript strict mode check
- Verify generated code passes tsc --noEmit

### Deliverables
- Integration test file
- E2E test scenarios
- Code coverage report
- All tests passing

### Acceptance Criteria
- Test coverage >= 85% for new code
- All existing tests pass
- Generated code compiles without errors
- ESLint reports no errors
- TypeScript strict mode passes

---

## Technical Approach

### Token Resolution Strategy

1. **Theme Loading**: Load all theme JSON files at TokenResolver initialization
2. **Component Lookup**: Find ComponentKnowledge by name from COMPONENT_CATALOG
3. **Token Mapping**: Map tokenBindings properties to theme colorPalette/typography
4. **CSS Variable Generation**: Create `var(--tekton-{category}-{name})` syntax
5. **Style Injection**: Add style prop to JSX element with resolved tokens

### CSS Variable Naming Convention

```
--tekton-{category}-{role}

Examples:
--tekton-color-primary        -> From colorPalette.primary
--tekton-color-secondary      -> From colorPalette.secondary
--tekton-surface-elevated     -> Derived from neutral + elevation
--tekton-text-primary         -> Contrast color for primary
--tekton-radius-large         -> From componentDefaults.borderRadius
--tekton-shadow-soft          -> From aiContext (calm theme)
```

### Backward Compatibility Approach

1. All new fields are optional
2. Default values applied when fields missing
3. Existing function signatures use optional parameters
4. No changes to existing test fixtures

---

## Risk Mitigation

### Risk 1: Token Binding Mismatch
- **Risk**: ComponentKnowledge token names don't map to theme tokens
- **Mitigation**: Create explicit token mapping table, add fallback values
- **Contingency**: Log warnings and use neutral defaults

### Risk 2: Performance Degradation
- **Risk**: Theme loading slows down generation
- **Mitigation**: Load themes once at initialization, cache in Map
- **Contingency**: Lazy load themes on first access

### Risk 3: Breaking Existing Workflows
- **Risk**: API changes break LLM integrations
- **Mitigation**: Strict backward compatibility, optional parameters
- **Contingency**: Version the API with deprecation warnings

---

## Dependencies

### Internal Dependencies
- SPEC-LAYER1-001: Token definitions (CSS variable format)
- SPEC-LAYER2-001: ComponentKnowledge.tokenBindings interface
- SPEC-LAYER3-MVP-001: JSXGenerator and renderScreen base implementation

### External Dependencies
- Theme JSON files: `/packages/studio-mcp/src/theme/themes/*.json`
- COMPONENT_CATALOG from `@tekton/component-knowledge`

### Development Dependencies
- vitest: Testing framework
- TypeScript 5.9+: Type definitions
- Babel: AST generation (existing)

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Test Coverage | >= 85% |
| TypeScript Errors | 0 |
| ESLint Errors | 0 |
| Generation Time | < 300ms |
| Backward Compatibility | 100% |

---

**END OF PLAN**
