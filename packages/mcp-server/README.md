# @tekton/mcp-server

Tekton MCP Server with Claude Code integration and timestamp-based preview system.

## Overview

MCP (Model Context Protocol) server enabling AI-driven blueprint generation, theme preview, and production code export for the Tekton design system.

**SPEC**: SPEC-MCP-002 - Tekton MCP Server with Timestamp-Based Preview System

## Features

- **🤖 MCP Protocol Integration**: Claude Code native tool registration
- **🎨 Theme Preview**: 13 built-in OKLCH-based themes with CSS variable generation
- **📋 Blueprint Generation**: Natural language → Blueprint JSON with validation
- **💾 Timestamp-based Storage**: Immutable preview URLs with collision detection
- **🚀 Production Export**: JSX, TSX, Vue code generation
- **🌐 Preview Web Server**: HTTP endpoints for theme switching and rendering

## Installation

```bash
pnpm install
```

## Usage

### Start MCP Server

```bash
pnpm start
```

Server runs on `http://localhost:3000` by default.

### MCP Tools

#### 1. Generate Blueprint

**Tool**: `generate-blueprint`

**Input**:
```json
{
  "description": "User profile dashboard with avatar, bio, settings link",
  "layout": "sidebar-left",
  "themeId": "calm-wellness",
  "componentHints": ["Card", "Avatar", "Button"]
}
```

**Output**:
```json
{
  "success": true,
  "blueprint": { "id": "1738123456789", ... },
  "previewUrl": "http://localhost:3000/preview/1738123456789/calm-wellness"
}
```

#### 2. Preview Theme

**Tool**: `preview-theme`

**Input**:
```json
{
  "themeId": "premium-editorial"
}
```

**Output**:
```json
{
  "success": true,
  "theme": {
    "id": "premium-editorial",
    "cssVariables": {
      "--color-primary": "oklch(0.45 0.15 220)",
      ...
    }
  },
  "previewUrl": "http://localhost:3000/preview/1738123456790/premium-editorial"
}
```

#### 3. Export Screen

**Tool**: `export-screen`

**Input**:
```json
{
  "blueprintId": "1738123456789",
  "format": "tsx",
  "outputPath": "src/screens/user-profile.tsx"
}
```

**Output**:
```json
{
  "success": true,
  "code": "export default function UserProfile() { ... }",
  "filePath": "src/screens/user-profile.tsx"
}
```

### HTTP Endpoints

#### Preview Page
```
GET /preview/:timestamp/:themeId
```

Serves HTML with theme CSS variables for SPEC-PLAYGROUND-001.

#### Blueprint API
```
GET /api/blueprints/:timestamp
```

Returns blueprint JSON for rendering.

#### Themes API
```
GET /api/themes
```

Lists all 13 built-in themes.

## Architecture

```
packages/mcp-server/
├── src/
│   ├── server.ts              # MCP Protocol server
│   ├── tools/                 # MCP tool implementations
│   │   ├── generate-blueprint.ts
│   │   ├── preview-theme.ts
│   │   └── export-screen.ts
│   ├── storage/               # Blueprint storage
│   │   ├── blueprint-storage.ts
│   │   └── timestamp-manager.ts
│   ├── web/                   # HTTP endpoints
│   │   ├── preview-routes.ts
│   │   └── api-routes.ts
│   ├── schemas/               # Zod validation
│   │   └── mcp-schemas.ts
│   └── utils/                 # Helper functions
│       └── error-handler.ts
└── __tests__/                 # Test suites
```

## Built-in Themes

1. `calm-wellness` - Serene wellness applications
2. `dynamic-fitness` - Energetic fitness tracking
3. `korean-fintech` - Professional financial services
4. `premium-editorial` - Sophisticated content platforms
5. `playful-kids` - Vibrant children's applications
6. `corporate-blue` - Traditional enterprise software
7. `nature-green` - Environmental and sustainability
8. `sunset-warm` - Warm and inviting experiences
9. `ocean-cool` - Fresh and professional
10. `monochrome-elegant` - Minimalist luxury
11. `vibrant-creative` - Bold creative tools
12. `accessibility-high-contrast` - WCAG AAA compliance
13. `dark-mode-default` - Modern dark theme

## Quality Metrics

- **Test Coverage**: ≥ 85%
- **Blueprint Generation**: < 500ms
- **Theme Preview**: < 100ms
- **TypeScript**: Strict mode compilation
- **Security**: Path traversal protection

## Integration with @tekton/core

All MCP tools reuse `@tekton/core` functions:
- `loadTheme()` - Theme loading
- `createBlueprint()` - Blueprint creation
- `validateBlueprint()` - Schema validation
- `generateCSSVariables()` - CSS variable extraction
- `render()` - Code generation

**Zero code duplication** - Single source of truth maintained.

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[빠른 시작 가이드](./docs/01-quickstart.md)** - 5분 안에 시작하기
- **[사용자 가이드](./docs/02-user-guide.md)** - 상세한 기능 설명과 워크플로우
- **[API 참조](./docs/03-api-reference.md)** - MCP Tools와 HTTP 엔드포인트 상세 문서
- **[아키텍처](./docs/04-architecture.md)** - 시스템 아키텍처와 데이터 흐름
- **[개발자 가이드](./docs/05-developer-guide.md)** - 개발 환경 설정 및 기여 방법
- **[통합 가이드](./docs/06-integration-guide.md)** - SPEC-PLAYGROUND-001 및 Claude Code 통합

### Quick Links

- 📖 [전체 문서 목록](./docs/README.md)
- 🎯 [SPEC-MCP-002](../../.moai/specs/SPEC-MCP-002/spec.md) - 완전한 명세 문서
- 🧪 [테스트 커버리지 리포트](./coverage/) - 87.82% 커버리지

## Development

```bash
# Build
pnpm build

# Tests
pnpm test

# Test with coverage
pnpm test:coverage

# Watch mode
pnpm dev
```

## Contributing

Please see the [Developer Guide](./docs/05-developer-guide.md) for detailed contribution guidelines.

## License

MIT
