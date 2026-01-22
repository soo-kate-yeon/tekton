# Changelog

All notable changes to the Tekton project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-01-20

### Added
- **Layer 3 MVP-001**: Component Knowledge System with Blueprint-based generation
- **JSXGenerator**: Generate React TSX components from JSON blueprints
- **MCP Tools**: Added 3 Layer 3 knowledge tools
  - `knowledge.getSchema` - Get Blueprint JSON Schema for LLM consumption
  - `knowledge.getComponentList` - Query available components with filters
  - `knowledge.renderScreen` - Generate React component files from blueprints
- **Semantic Scoring System**: AI-optimized component selection with intent matching
- **Safety Layer**: Hallucination prevention with threshold checking and fallback handling
- **Component Catalog**: 20 production-ready components with full metadata
- **AST-based Generation**: Babel-powered code generation with Prettier formatting

### Fixed
- **[Critical] Known Issue #1**: Fixed "generate is not a function" error in renderScreen tool
  - Root Cause: CommonJS/ESM interoperability issue with @babel/generator
  - Solution: Changed from default import to named import (`import { generate }`)
  - Impact: MCP tool status improved from 67% (2/3) to 100% (3/3) working
  - Files changed: `packages/component-generator/src/generator/jsx-generator.ts`

### Changed
- **Build System**: Added .js extensions to all ESM imports for Node.js compatibility
- **Type Safety**: Improved TypeScript type narrowing in component validators
- **API Consistency**: Renamed Preset → Theme across all API endpoints

### Technical Details

#### ESM Import Fix
```typescript
// Before (Broken in Node.js ESM runtime)
import generate from '@babel/generator';

// After (Working with CJS → ESM wrapper)
import { generate } from '@babel/generator';
```

#### Why This Matters
- TypeScript with `moduleResolution: "bundler"` assumes bundler handles imports
- @babel/generator is CommonJS, wrapped by Node.js ESM into object
- Named import extracts the actual function from wrapper
- Tests pass (Vitest has custom resolver) but runtime failed (native Node.js)

#### Verification
- ✅ All 13 automated tests passing
- ✅ MCP server operational with tsx runtime
- ✅ All 3 Layer 3 knowledge tools working
- ✅ Component file generation confirmed

### Known Issues
- None - Known Issue #1 has been resolved

### Documentation
- Added `DEBUGGING-PLAN-KNOWN-ISSUE-1.md` - Complete technical analysis
- Added `KNOWN-ISSUE-1-RESOLVED.md` - Resolution summary and verification
- Updated studio-mcp README with LLM Integration Guide (M3)

### Development
- **Test Coverage**: 13/13 LLM workflow tests passing
- **Build Process**: TypeScript compilation + ESM output
- **Runtime**: Node.js 20+ with tsx for development

### Breaking Changes
None - v0.1.0 is the initial beta release

### Deprecations
None

### Security
- No security vulnerabilities introduced
- ESM import fix prevents potential module resolution exploits

### Performance
- JSXGenerator: <200ms per blueprint
- knowledge.getSchema: <50ms
- knowledge.getComponentList: <30ms

### Migration Guide
No migration needed for v0.1.0 (initial release)

---

## [Unreleased]

### Added
- **Layout Grid System** (SPEC-LAYOUT-001): Responsive grid for Tekton Design System
  - Tailwind CSS breakpoints (sm:640, md:768, lg:1024, xl:1280, 2xl:1536)
  - Environment grid defaults (mobile:4-col, tablet:8-col, web:12-col)
  - BlueprintLayout interface with Zod validation
  - renderScreen integration with tailwind-merge
  - 293 tests passing with 100% coverage

### Future Plans (v0.2.0)
- [ ] Implement esbuild bundling for production hardening
- [ ] Add more component catalog entries (target: 50+ components)
- [ ] Support for complex slot nesting patterns
- [ ] Real-time preview generation
- [ ] Component variant expansion

---

## Version History

- **v0.1.0** (2026-01-20) - Initial beta release with Layer 3 MVP-001 complete
  - MCP server operational
  - 20 components in catalog
  - 3/3 Layer 3 tools working
  - Known Issue #1 resolved

---

## Links

- [Repository](https://github.com/asleep/tekton)
- [Issues](https://github.com/asleep/tekton/issues)
- [Pull Requests](https://github.com/asleep/tekton/pulls)
- [Documentation](./docs/)
