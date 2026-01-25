# API 참조 문서 (API Reference)

Tekton MCP Server의 완전한 API 참조 문서입니다.

## 목차

1. [MCP Tools API](#mcp-tools-api)
2. [HTTP Endpoints API](#http-endpoints-api)
3. [스키마 정의](#스키마-정의)
4. [오류 코드](#오류-코드)

---

## MCP Tools API

### generate-blueprint

자연어 설명으로 Blueprint JSON을 생성합니다.

#### 요청 스키마

```typescript
interface GenerateBlueprintInput {
  description: string; // 10-500자, 화면 설명
  layout: LayoutType; // 레이아웃 타입
  themeId: string; // 테마 ID (소문자, 숫자, 하이픈만)
  componentHints?: string[]; // 선택적 컴포넌트 힌트
}

type LayoutType =
  | 'single-column'
  | 'two-column'
  | 'sidebar-left'
  | 'sidebar-right'
  | 'dashboard'
  | 'landing';
```

#### 응답 스키마

```typescript
interface GenerateBlueprintOutput {
  success: boolean;
  blueprint?: {
    id: string; // 타임스탬프 기반 ID (예: "1738123456789")
    name: string; // 블루프린트 이름
    themeId: string; // 적용된 테마 ID
    layout: LayoutType; // 레이아웃 타입
    components: ComponentNode[]; // 컴포넌트 트리
    timestamp: number; // 생성 시각 (밀리초)
  };
  previewUrl?: string; // 미리보기 URL
  error?: string; // 오류 메시지 (실패 시)
}

interface ComponentNode {
  type: string; // 컴포넌트 타입 (예: "Button", "Card")
  props?: Record<string, any>; // 컴포넌트 속성
  children?: (ComponentNode | string)[]; // 자식 요소
  slot?: string; // 레이아웃 슬롯 (예: "main", "sidebar")
}
```

#### 요청 예제

**기본 예제**:

```json
{
  "description": "Simple login form with email, password, and submit button",
  "layout": "single-column",
  "themeId": "calm-wellness"
}
```

**컴포넌트 힌트 포함**:

```json
{
  "description": "User dashboard with profile card, statistics, and activity feed",
  "layout": "sidebar-left",
  "themeId": "korean-fintech",
  "componentHints": ["Card", "Avatar", "Heading", "Text", "Table", "Badge"]
}
```

**복잡한 대시보드**:

```json
{
  "description": "Analytics dashboard with revenue chart, user metrics cards, recent transactions table, and performance indicators",
  "layout": "dashboard",
  "themeId": "corporate-blue",
  "componentHints": ["Card", "Heading", "Table", "Badge", "Progress"]
}
```

#### 응답 예제

**성공 응답**:

```json
{
  "success": true,
  "blueprint": {
    "id": "1738123456789",
    "name": "User Dashboard",
    "themeId": "korean-fintech",
    "layout": "sidebar-left",
    "components": [
      {
        "type": "Card",
        "slot": "main",
        "children": [
          {
            "type": "Avatar",
            "props": { "size": "large" }
          },
          {
            "type": "Heading",
            "props": { "level": 2 },
            "children": ["John Doe"]
          },
          {
            "type": "Text",
            "children": ["Software Engineer at Tekton"]
          }
        ]
      },
      {
        "type": "Card",
        "slot": "sidebar",
        "children": [
          {
            "type": "Heading",
            "props": { "level": 3 },
            "children": ["Statistics"]
          },
          {
            "type": "Badge",
            "props": { "variant": "success" },
            "children": ["Active"]
          }
        ]
      }
    ],
    "timestamp": 1738123456789
  },
  "previewUrl": "http://localhost:3000/preview/1738123456789/korean-fintech"
}
```

**실패 응답**:

```json
{
  "success": false,
  "error": "Theme 'invalid-theme' not found. Available themes: calm-wellness, dynamic-fitness, korean-fintech, ..."
}
```

#### 검증 규칙

- **description**:
  - 최소 길이: 10자
  - 최대 길이: 500자
  - 명확하고 구체적인 설명 권장

- **layout**:
  - 정확히 다음 중 하나: `single-column`, `two-column`, `sidebar-left`, `sidebar-right`, `dashboard`, `landing`

- **themeId**:
  - 정규식: `^[a-z0-9-]+$`
  - 13개 내장 테마 중 하나
  - 경로 탐색 공격 방지

- **componentHints**:
  - 선택적
  - 20개 내장 컴포넌트 중 선택
  - 배열 형태

#### 성능 특성

- **평균 응답 시간**: < 500ms
- **타임스탬프 충돌 확률**: < 0.001%
- **블루프린트 검증 시간**: < 50ms

---

### preview-theme

테마 미리보기 URL을 생성하고 CSS 변수를 반환합니다.

#### 요청 스키마

```typescript
interface PreviewThemeInput {
  themeId: string; // 테마 ID (소문자, 숫자, 하이픈만)
}
```

#### 응답 스키마

```typescript
interface PreviewThemeOutput {
  success: boolean;
  theme?: {
    id: string; // 테마 ID
    name: string; // 테마 표시 이름
    description: string; // 테마 설명
    cssVariables: Record<string, string>; // CSS 변수 맵
  };
  previewUrl?: string; // 미리보기 URL
  error?: string; // 오류 메시지 (실패 시)
}
```

#### 요청 예제

```json
{
  "themeId": "premium-editorial"
}
```

#### 응답 예제

**성공 응답**:

```json
{
  "success": true,
  "theme": {
    "id": "premium-editorial",
    "name": "Premium Editorial",
    "description": "Sophisticated editorial design with high contrast and serif typography",
    "cssVariables": {
      "--color-primary": "oklch(0.45 0.15 220)",
      "--color-secondary": "oklch(0.60 0.12 280)",
      "--color-background": "oklch(0.98 0.02 220)",
      "--color-text": "oklch(0.20 0.05 220)",
      "--color-accent": "oklch(0.55 0.20 20)",
      "--font-family": "Georgia, serif",
      "--font-size-base": "18px",
      "--line-height-base": "1.7",
      "--spacing-unit": "8px",
      "--border-radius": "4px",
      "--shadow-sm": "0 1px 2px rgba(0,0,0,0.05)",
      "--shadow-md": "0 4px 6px rgba(0,0,0,0.1)"
    }
  },
  "previewUrl": "http://localhost:3000/preview/1738123456790/premium-editorial"
}
```

**실패 응답**:

```json
{
  "success": false,
  "error": "Theme 'non-existent' not found. Available themes: calm-wellness, dynamic-fitness, korean-fintech, premium-editorial, playful-kids, corporate-blue, nature-green, sunset-warm, ocean-cool, monochrome-elegant, vibrant-creative, accessibility-high-contrast, dark-mode-default"
}
```

#### CSS 변수 카테고리

**색상 변수** (OKLCH 형식):

- `--color-primary`: 주 색상
- `--color-secondary`: 보조 색상
- `--color-background`: 배경 색상
- `--color-text`: 텍스트 색상
- `--color-accent`: 강조 색상

**타이포그래피**:

- `--font-family`: 폰트 패밀리
- `--font-size-base`: 기본 폰트 크기
- `--line-height-base`: 기본 행간

**간격**:

- `--spacing-unit`: 기본 간격 단위 (8px)
- `--border-radius`: 모서리 둥글기

**그림자**:

- `--shadow-sm`: 작은 그림자
- `--shadow-md`: 중간 그림자
- `--shadow-lg`: 큰 그림자

#### 검증 규칙

- **themeId**:
  - 정규식: `^[a-z0-9-]+$`
  - 13개 내장 테마 중 하나
  - 대소문자 구분

---

### export-screen

생성된 블루프린트를 프로덕션 코드로 내보냅니다.

#### 요청 스키마

```typescript
interface ExportScreenInput {
  blueprintId: string; // 블루프린트 ID (타임스탬프)
  format: ExportFormat; // 출력 형식
  outputPath?: string; // 선택적 저장 경로
}

type ExportFormat = 'jsx' | 'tsx' | 'vue';
```

#### 응답 스키마

```typescript
interface ExportScreenOutput {
  success: boolean;
  code?: string; // 생성된 코드
  filePath?: string; // 저장된 파일 경로
  error?: string; // 오류 메시지 (실패 시)
}
```

#### 요청 예제

**TypeScript React**:

```json
{
  "blueprintId": "1738123456789",
  "format": "tsx",
  "outputPath": "src/screens/UserProfile.tsx"
}
```

**JavaScript React**:

```json
{
  "blueprintId": "1738123456789",
  "format": "jsx",
  "outputPath": "src/components/LoginForm.jsx"
}
```

**Vue 3**:

```json
{
  "blueprintId": "1738123456789",
  "format": "vue",
  "outputPath": "src/views/Dashboard.vue"
}
```

#### 응답 예제

**TSX 성공 응답**:

```json
{
  "success": true,
  "code": "import React from 'react';\nimport { Card, Avatar, Heading, Text } from '@/components';\n\nexport default function UserProfile() {\n  return (\n    <div className=\"container\">\n      <aside className=\"sidebar\">\n        <Card>\n          <Heading level={3}>Navigation</Heading>\n        </Card>\n      </aside>\n      <main className=\"main-content\">\n        <Card>\n          <Avatar size=\"large\" />\n          <Heading level={2}>John Doe</Heading>\n          <Text>Software Engineer</Text>\n        </Card>\n      </main>\n    </div>\n  );\n}",
  "filePath": ".tekton/exports/user-profile.tsx"
}
```

**Vue 성공 응답**:

```json
{
  "success": true,
  "code": "<template>\n  <div class=\"container\">\n    <aside class=\"sidebar\">\n      <Card>\n        <Heading :level=\"3\">Navigation</Heading>\n      </Card>\n    </aside>\n    <main class=\"main-content\">\n      <Card>\n        <Avatar size=\"large\" />\n        <Heading :level=\"2\">John Doe</Heading>\n        <Text>Software Engineer</Text>\n      </Card>\n    </main>\n  </div>\n</template>\n\n<script setup lang=\"ts\">\nimport { Card, Avatar, Heading, Text } from '@/components';\n</script>",
  "filePath": ".tekton/exports/user-profile.vue"
}
```

**실패 응답**:

```json
{
  "success": false,
  "error": "Blueprint '1738123456789' not found in storage"
}
```

#### 형식별 특징

**TSX (TypeScript React)**:

- TypeScript 타입 어노테이션 포함
- React 함수형 컴포넌트
- ESM import 구문
- Props 인터페이스 자동 생성

**JSX (JavaScript React)**:

- 일반 JavaScript
- React 함수형 컴포넌트
- JSDoc 주석 (타입 힌트)

**Vue**:

- Vue 3 Composition API
- `<script setup>` 구문
- TypeScript 지원
- Props 정의 자동 생성

#### 검증 규칙

- **blueprintId**:
  - 타임스탬프 형식 (숫자 문자열)
  - `.tekton/blueprints/{id}/` 디렉토리 존재

- **format**:
  - 정확히 다음 중 하나: `jsx`, `tsx`, `vue`

- **outputPath**:
  - 선택적
  - 상대 또는 절대 경로
  - 기본값: `.tekton/exports/{blueprint-name}.{format}`

---

## HTTP Endpoints API

### GET /preview/:timestamp/:themeId

블루프린트 미리보기 페이지를 제공합니다.

#### 요청

```http
GET /preview/1738123456789/calm-wellness HTTP/1.1
Host: localhost:3000
```

#### 응답

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Access-Control-Allow-Origin: *

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tekton Preview - calm-wellness</title>
  <style>
    :root {
      --color-primary: oklch(0.45 0.15 220);
      --color-secondary: oklch(0.60 0.12 280);
      /* ... 기타 CSS 변수 */
    }
  </style>
</head>
<body>
  <div id="root" data-timestamp="1738123456789" data-theme-id="calm-wellness"></div>
  <script>
    window.__TEKTON_PREVIEW__ = {
      timestamp: 1738123456789,
      themeId: "calm-wellness",
      blueprintUrl: "/api/blueprints/1738123456789"
    };
  </script>
  <!-- SPEC-PLAYGROUND-001 integration script -->
</body>
</html>
```

#### 파라미터

- **timestamp**: 블루프린트 타임스탬프 (숫자)
- **themeId**: 테마 ID (소문자, 숫자, 하이픈만)

#### 오류 응답

**404 Not Found**:

```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "success": false,
  "error": "Blueprint '1738123456789' not found"
}
```

**400 Bad Request**:

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "error": "Invalid theme ID format"
}
```

---

### GET /api/blueprints/:timestamp

블루프린트 JSON을 가져옵니다.

#### 요청

```http
GET /api/blueprints/1738123456789 HTTP/1.1
Host: localhost:3000
Accept: application/json
```

#### 응답

```http
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: *

{
  "success": true,
  "blueprint": {
    "id": "1738123456789",
    "name": "User Dashboard",
    "themeId": "korean-fintech",
    "layout": "sidebar-left",
    "components": [
      {
        "type": "Card",
        "slot": "main",
        "children": [...]
      }
    ],
    "timestamp": 1738123456789
  }
}
```

#### 오류 응답

**404 Not Found**:

```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "success": false,
  "error": "Blueprint not found"
}
```

---

### GET /api/themes

모든 사용 가능한 테마를 나열합니다.

#### 요청

```http
GET /api/themes HTTP/1.1
Host: localhost:3000
Accept: application/json
```

#### 응답

```http
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: *

{
  "success": true,
  "themes": [
    {
      "id": "calm-wellness",
      "name": "Calm Wellness",
      "description": "Serene wellness applications with soft blue tones"
    },
    {
      "id": "dynamic-fitness",
      "name": "Dynamic Fitness",
      "description": "Energetic fitness tracking with vibrant red accents"
    },
    {
      "id": "korean-fintech",
      "name": "Korean Fintech",
      "description": "Professional financial services with trustworthy blue"
    },
    {
      "id": "premium-editorial",
      "name": "Premium Editorial",
      "description": "Sophisticated editorial design with high contrast and serif typography"
    },
    {
      "id": "playful-kids",
      "name": "Playful Kids",
      "description": "Vibrant children's applications with bright colors"
    },
    {
      "id": "corporate-blue",
      "name": "Corporate Blue",
      "description": "Traditional enterprise software with professional blue"
    },
    {
      "id": "nature-green",
      "name": "Nature Green",
      "description": "Environmental and sustainability with green tones"
    },
    {
      "id": "sunset-warm",
      "name": "Sunset Warm",
      "description": "Warm and inviting experiences with orange and yellow"
    },
    {
      "id": "ocean-cool",
      "name": "Ocean Cool",
      "description": "Fresh and professional with teal accents"
    },
    {
      "id": "monochrome-elegant",
      "name": "Monochrome Elegant",
      "description": "Minimalist luxury with black and white"
    },
    {
      "id": "vibrant-creative",
      "name": "Vibrant Creative",
      "description": "Bold creative tools with vivid colors"
    },
    {
      "id": "accessibility-high-contrast",
      "name": "Accessibility High Contrast",
      "description": "WCAG AAA compliant with high contrast"
    },
    {
      "id": "dark-mode-default",
      "name": "Dark Mode Default",
      "description": "Modern dark theme for low-light environments"
    }
  ]
}
```

---

### GET /tools

등록된 MCP Tool 목록을 가져옵니다.

#### 요청

```http
GET /tools HTTP/1.1
Host: localhost:3000
Accept: application/json
```

#### 응답

```http
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: *

{
  "tools": [
    {
      "name": "generate-blueprint",
      "description": "Generate Blueprint JSON from natural language description with theme and layout",
      "inputSchema": {
        "description": { "type": "string" },
        "layout": { "type": "string" },
        "themeId": { "type": "string" },
        "componentHints": { "type": "array", "optional": true }
      }
    },
    {
      "name": "preview-theme",
      "description": "Generate preview URL for theme quality check with CSS variables",
      "inputSchema": {
        "themeId": { "type": "string" }
      }
    },
    {
      "name": "export-screen",
      "description": "Export generated screen to production code (JSX, TSX, Vue)",
      "inputSchema": {
        "blueprintId": { "type": "string" },
        "format": { "type": "string" },
        "outputPath": { "type": "string", "optional": true }
      }
    }
  ]
}
```

---

## 스키마 정의

### ComponentNode

블루프린트의 기본 구성 요소입니다.

```typescript
interface ComponentNode {
  type: string; // 컴포넌트 타입
  props?: Record<string, any>; // 컴포넌트 속성
  children?: (ComponentNode | string)[]; // 자식 요소
  slot?: string; // 레이아웃 슬롯
}
```

**예제**:

```json
{
  "type": "Button",
  "props": {
    "variant": "primary",
    "size": "large",
    "disabled": false
  },
  "children": ["Click Me"],
  "slot": "main"
}
```

### Blueprint

완전한 블루프린트 구조입니다.

```typescript
interface Blueprint {
  id: string; // 고유 ID (타임스탬프)
  name: string; // 블루프린트 이름
  themeId: string; // 테마 ID
  layout: LayoutType; // 레이아웃 타입
  components: ComponentNode[]; // 컴포넌트 트리
  timestamp: number; // 생성 시각 (밀리초)
  metadata?: {
    // 선택적 메타데이터
    author?: string;
    version?: string;
    tags?: string[];
  };
}
```

### Theme

테마 정의입니다.

```typescript
interface Theme {
  id: string; // 테마 ID
  name: string; // 표시 이름
  description: string; // 설명
  cssVariables: Record<string, string>; // CSS 변수 맵
}
```

---

## 오류 코드

### 클라이언트 오류 (4xx)

| 코드 | 이름                 | 설명                  | 해결 방법        |
| ---- | -------------------- | --------------------- | ---------------- |
| 400  | Bad Request          | 잘못된 요청 형식      | 요청 스키마 확인 |
| 404  | Not Found            | 리소스를 찾을 수 없음 | URL 및 ID 확인   |
| 422  | Unprocessable Entity | 검증 실패             | 입력 데이터 검증 |

### 서버 오류 (5xx)

| 코드 | 이름                  | 설명             | 해결 방법      |
| ---- | --------------------- | ---------------- | -------------- |
| 500  | Internal Server Error | 서버 내부 오류   | 서버 로그 확인 |
| 503  | Service Unavailable   | 서비스 이용 불가 | 서버 재시작    |

### 응용 수준 오류

#### INVALID_INPUT

```json
{
  "success": false,
  "error": "Description must be at least 10 characters"
}
```

#### THEME_NOT_FOUND

```json
{
  "success": false,
  "error": "Theme 'invalid-theme' not found. Available themes: calm-wellness, dynamic-fitness, ..."
}
```

#### BLUEPRINT_NOT_FOUND

```json
{
  "success": false,
  "error": "Blueprint '1738123456789' not found in storage"
}
```

#### VALIDATION_FAILED

```json
{
  "success": false,
  "error": "Blueprint validation failed: Invalid component type 'InvalidComponent'"
}
```

#### COLLISION_DETECTED

```json
{
  "success": false,
  "error": "Timestamp collision detected. Retrying with suffix..."
}
```

---

## 레이트 리밋

현재 MVP에서는 레이트 리밋이 적용되지 않습니다. 향후 버전에서 추가될 예정입니다.

**권장 사항**:

- 블루프린트 생성: 초당 최대 10회
- 테마 미리보기: 초당 최대 20회
- 코드 내보내기: 초당 최대 5회

---

## CORS 설정

모든 HTTP 엔드포인트는 CORS를 지원합니다:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

**프로덕션 환경**에서는 특정 도메인으로 제한하는 것을 권장합니다.

---

## 다음 단계

- [아키텍처 문서](./04-architecture.md) - 시스템 아키텍처와 데이터 흐름
- [개발자 가이드](./05-developer-guide.md) - 기여 방법과 테스트 가이드
- [통합 가이드](./06-integration-guide.md) - SPEC-PLAYGROUND-001 통합

---

**참조**: [SPEC-MCP-002](../../.moai/specs/SPEC-MCP-002/spec.md) - 완전한 명세 문서
