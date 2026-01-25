# Changelog

## [0.1.0] - 2026-01-24

### Added

- Initial release of @tekton/core
- **Theme Module**: Load themes from JSON, generate CSS variables
- **Blueprint Module**: Create and validate screen blueprints
- **Render Module**: Template-based JSX generation

### Architecture

- **742 LOC** total (99.2% reduction from original 89,993 LOC)
- **Zero external dependencies** for code generation
- Template-based rendering instead of Babel AST

### Files Created

| File           | LOC | Purpose                         |
| -------------- | --- | ------------------------------- |
| `types.ts`     | 94  | Core type definitions           |
| `theme.ts`     | 131 | Theme loading & CSS generation  |
| `blueprint.ts` | 169 | Blueprint creation & validation |
| `render.ts`    | 297 | JSX template generation         |
| `index.ts`     | 51  | Public API exports              |

### Removed (from original codebase)

- 13 packages (headless-components, cli, studio-mcp, studio-web, etc.)
- Babel AST infrastructure (@babel/types, @babel/generator)
- Prettier dependency
- Slot registries (GlobalSlotRegistry, LocalSlotRegistry)
- Semantic scoring engine
- Safety protocols (ThresholdChecker, HallucinationChecker, etc.)
- MCP server infrastructure
- Configuration management layers
- Storage abstraction layers

### Testing

- 21 tests passing
- 83% code coverage
- Full pipeline integration test (Theme → Blueprint → Render)
