# Screen Generation MCP Tools

Claude Code/Desktop을 위한 LLM 통합 도구

## 개요

Screen Generation Pipeline은 Claude와 함께 사용할 수 있는 3개의 MCP (Model Context Protocol) 도구를 제공합니다. 이를 통해 LLM이 자연어 프롬프트에서 직접 화면 정의를 생성하고 검증하며 프로덕션 코드로 변환할 수 있습니다.

**사용 가능한 도구:**

1. **generate_screen** - JSON 화면 정의를 프로덕션 코드로 변환
2. **validate_screen** - 화면 정의 검증 및 오류 체크
3. **list_tokens** - 사용 가능한 레이아웃 토큰 쿼리

## 설치 및 설정

### 1. MCP 서버 설치

```bash
cd packages/mcp-server
npm install
npm run build
```

### 2. Claude Desktop 설정

`claude_desktop_config.json` 파일 설정:

**macOS:**

```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**

```
%APPDATA%\Claude\claude_desktop_config.json
```

**설정 내용:**

```json
{
  "mcpServers": {
    "tekton-screen-generation": {
      "command": "node",
      "args": ["/absolute/path/to/tekton/packages/mcp-server/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

**주의:** `args`의 경로는 절대 경로여야 합니다.

### 3. Claude Code 설정

`.claude/mcp.json` 파일 생성:

```json
{
  "mcpServers": {
    "tekton-screen-generation": {
      "command": "node",
      "args": ["./packages/mcp-server/dist/index.js"]
    }
  }
}
```

### 4. 설치 확인

Claude Desktop 또는 Claude Code에서:

```
@mcp tools
```

다음 도구들이 표시되어야 합니다:

- generate_screen
- validate_screen
- list_tokens

## MCP 도구 사용법

### 1. generate_screen

JSON 화면 정의를 프로덕션 React 컴포넌트로 변환합니다.

**입력 스키마:**

```typescript
interface GenerateScreenInput {
  screenDefinition: ScreenDefinition;
  outputFormat: 'css-in-js' | 'tailwind' | 'react';
  options?: {
    typescript?: boolean; // 기본값: true
    prettier?: boolean; // 기본값: false
    cssFramework?: 'styled-components' | 'emotion'; // css-in-js용
  };
}
```

**출력 스키마:**

```typescript
interface GenerateScreenOutput {
  success: boolean;
  code?: string;
  cssVariables?: string;
  error?: string;
  errors?: string[];
}
```

**Claude 프롬프트 예제:**

```
generate_screen 도구를 사용하여 다음 화면 정의를 React 컴포넌트로 변환해주세요:

{
  "id": "dashboard-screen",
  "name": "Dashboard Overview",
  "shell": "shell.web.dashboard",
  "page": "page.dashboard",
  "sections": [
    {
      "id": "metrics-section",
      "pattern": "section.grid-4",
      "components": [
        {
          "type": "Card",
          "props": { "variant": "elevated" },
          "children": [
            {
              "type": "Heading",
              "props": { "level": 3 },
              "children": ["Total Users"]
            },
            {
              "type": "Text",
              "props": { "size": "large" },
              "children": ["12,453"]
            }
          ]
        }
      ]
    }
  ]
}

출력 형식: react
TypeScript: true
```

**출력 예제:**

```typescript
{
  "success": true,
  "code": "import React from 'react';\nimport { Card, Heading, Text } from '@tekton/components';\n\nexport const DashboardScreen: React.FC = () => {\n  return (\n    <div data-screen-id=\"dashboard-screen\">\n      <div className=\"metrics-section\" data-section-id=\"metrics-section\">\n        <Card variant=\"elevated\">\n          <Heading level={3}>Total Users</Heading>\n          <Text size=\"large\">12,453</Text>\n        </Card>\n      </div>\n    </div>\n  );\n};\n"
}
```

**오류 처리:**

```typescript
{
  "success": false,
  "error": "Screen definition validation failed",
  "errors": [
    "shell: Shell token must match pattern: shell.{platform}.{name}"
  ]
}
```

---

### 2. validate_screen

화면 정의를 검증하고 상세한 오류 및 경고를 반환합니다.

**입력 스키마:**

```typescript
interface ValidateScreenInput {
  screenDefinition: ScreenDefinition;
  strict?: boolean; // 기본값: false (경고를 오류로 처리)
}
```

**출력 스키마:**

```typescript
interface ValidateScreenOutput {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
  summary?: {
    screenId: string;
    sectionsCount: number;
    componentsCount: number;
  };
}
```

**Claude 프롬프트 예제:**

```
validate_screen 도구를 사용하여 다음 화면 정의를 검증해주세요:

{
  "id": "test-screen",
  "name": "Test Screen",
  "shell": "invalid-shell-token",
  "page": "page.dashboard",
  "sections": []
}
```

**출력 예제 (오류):**

```typescript
{
  "valid": false,
  "errors": [
    "shell: Shell token must match pattern: shell.{platform}.{name} (e.g., \"shell.web.dashboard\")",
    "sections: Screen must have at least one section definition"
  ]
}
```

**출력 예제 (경고):**

```typescript
{
  "valid": true,
  "warnings": [
    "Shell token 'shell.web.custom' not found in available shells"
  ],
  "summary": {
    "screenId": "test-screen",
    "sectionsCount": 1,
    "componentsCount": 3
  }
}
```

---

### 3. list_tokens

SPEC-LAYOUT-001의 사용 가능한 레이아웃 토큰을 쿼리합니다.

**입력 스키마:**

```typescript
interface ListTokensInput {
  type?: 'shell' | 'page' | 'section' | 'all'; // 기본값: 'all'
  themeId?: string; // 기본값: 'default'
}
```

**출력 스키마:**

```typescript
interface ListTokensOutput {
  tokens: {
    shells?: string[];
    pages?: string[];
    sections?: string[];
  };
  count: {
    shells: number;
    pages: number;
    sections: number;
    total: number;
  };
}
```

**Claude 프롬프트 예제:**

```
list_tokens 도구를 사용하여 사용 가능한 모든 레이아웃 토큰을 보여주세요.
```

**출력 예제:**

```typescript
{
  "tokens": {
    "shells": [
      "shell.web.dashboard",
      "shell.web.app",
      "shell.mobile.app"
    ],
    "pages": [
      "page.dashboard",
      "page.settings",
      "page.detail"
    ],
    "sections": [
      "section.grid-4",
      "section.grid-3",
      "section.hero",
      "section.split"
    ]
  },
  "count": {
    "shells": 3,
    "pages": 3,
    "sections": 4,
    "total": 10
  }
}
```

**특정 타입만 쿼리:**

```
list_tokens 도구를 사용하여 section 토큰만 보여주세요.
```

```typescript
{
  "tokens": {
    "sections": [
      "section.grid-4",
      "section.grid-3",
      "section.hero",
      "section.split"
    ]
  },
  "count": {
    "shells": 0,
    "pages": 0,
    "sections": 4,
    "total": 4
  }
}
```

## 실전 사용 시나리오

### 시나리오 1: 새 화면 생성

**사용자 프롬프트:**

```
대시보드 화면을 생성해주세요. 4개의 메트릭 카드가 있는 그리드 레이아웃이어야 합니다.
각 카드에는 제목, 값, 배지가 있어야 합니다.
```

**Claude 워크플로우:**

1. **list_tokens 호출** - 사용 가능한 레이아웃 확인
2. **화면 정의 생성** - JSON 구조 작성
3. **validate_screen 호출** - 정의 검증
4. **generate_screen 호출** - React 컴포넌트 생성
5. **결과 제시** - 생성된 코드 표시

**예제 응답:**

```
1. 사용 가능한 레이아웃 토큰을 확인하겠습니다.

[list_tokens 호출]

사용 가능한 토큰:
- Shell: shell.web.dashboard
- Page: page.dashboard
- Section: section.grid-4

2. 화면 정의를 생성하겠습니다.

[JSON 화면 정의 생성]

3. 정의를 검증하겠습니다.

[validate_screen 호출]

✅ 검증 통과

4. React 컴포넌트를 생성하겠습니다.

[generate_screen 호출]

✅ 생성 완료

생성된 컴포넌트:

[생성된 TypeScript 코드]

이 컴포넌트를 src/components/DashboardScreen.tsx에 저장하고
import해서 사용하실 수 있습니다.
```

---

### 시나리오 2: 화면 정의 검증 및 수정

**사용자 프롬프트:**

```
이 화면 정의를 검증해주세요:

{
  "id": "settings",
  "name": "Settings",
  "shell": "shell.web.dashboard",
  "page": "page.settings",
  "sections": [
    {
      "id": "form-section",
      "pattern": "section.form",
      "components": [
        {
          "type": "Input",
          "props": { "placeholder": "Email" }
        }
      ]
    }
  ]
}
```

**Claude 워크플로우:**

1. **validate_screen 호출** - 검증
2. **오류 분석** - 문제점 파악
3. **수정 제안** - 올바른 정의 제공

**예제 응답:**

```
[validate_screen 호출]

검증 결과:

❌ 오류 발견:
- id: Screen ID must be kebab-case (lowercase letters, numbers, hyphens)
  현재: "settings"
  수정: "settings-screen"

수정된 화면 정의:

{
  "id": "settings-screen",
  "name": "Settings",
  "shell": "shell.web.dashboard",
  "page": "page.settings",
  "sections": [...]
}

다시 검증하시겠습니까?
```

---

### 시나리오 3: 다중 출력 형식 생성

**사용자 프롬프트:**

```
이 화면을 styled-components와 Tailwind 두 가지 버전으로 생성해주세요.
```

**Claude 워크플로우:**

1. **validate_screen 호출** - 정의 검증
2. **generate_screen 호출 (CSS-in-JS)** - styled-components 버전
3. **generate_screen 호출 (Tailwind)** - Tailwind 버전
4. **비교 제시** - 두 버전 비교

**예제 응답:**

```
두 가지 버전을 생성하겠습니다.

1. styled-components 버전:

[generate_screen with outputFormat: 'css-in-js', cssFramework: 'styled-components']

2. Tailwind CSS 버전:

[generate_screen with outputFormat: 'tailwind']

비교:

styled-components:
- 장점: 컴포넌트 스코프 스타일, 동적 테마
- 단점: 런타임 오버헤드, 번들 크기 증가

Tailwind:
- 장점: 빠른 개발, 작은 번들 크기 (트리 셰이킹)
- 단점: 클래스 이름 길이, 커스터마이징 제한

프로젝트 요구사항에 따라 선택하시면 됩니다.
```

---

## 고급 사용 패턴

### 반복적 개선

```
Claude: 사용자님, 화면을 개선해보겠습니다.

1. 현재 화면 검증
   [validate_screen 호출]

2. 개선 제안:
   - 반응형 오버라이드 추가
   - 접근성 개선 (ARIA 속성)
   - 메타데이터 추가

3. 개선된 화면 정의 생성

4. 재검증
   [validate_screen 호출]

5. 코드 생성
   [generate_screen 호출]

변경사항:
- 반응형 그리드 (sm: 1열, md: 2열, lg: 4열)
- ARIA labels 추가
- 메타데이터 (author, version) 추가
```

### 오류 디버깅

```
사용자: 생성이 실패했어요.

Claude: 문제를 진단하겠습니다.

1. 화면 정의 검증
   [validate_screen 호출]

   발견된 오류:
   - Shell 토큰 패턴 불일치

2. 사용 가능한 토큰 확인
   [list_tokens with type: 'shell']

   사용 가능한 Shell 토큰:
   - shell.web.dashboard
   - shell.web.app
   - shell.mobile.app

3. 수정 제안:
   현재: "shell.dashboard"
   수정: "shell.web.dashboard"

4. 수정 후 재검증
   [validate_screen 호출]

   ✅ 검증 통과

5. 코드 생성
   [generate_screen 호출]

   ✅ 생성 성공
```

## 제한사항 및 주의사항

### MCP 도구 제한사항

1. **파일 I/O 없음**: MCP 도구는 파일을 직접 읽거나 쓰지 않습니다. Claude가 파일 작업을 수행합니다.

2. **동기 실행**: 각 도구 호출은 순차적으로 실행됩니다.

3. **토큰 제한**: 큰 화면 정의는 Claude의 컨텍스트 윈도우를 초과할 수 있습니다.

### 베스트 프랙티스

**1. 단계별 검증:**

```
1. list_tokens로 토큰 확인
2. validate_screen으로 정의 검증
3. generate_screen으로 코드 생성
```

**2. 명확한 프롬프트:**

```
좋은 예: "4개의 메트릭 카드가 있는 대시보드 화면을 생성해주세요. 각 카드에는 제목, 값, 배지가 있어야 합니다."

나쁜 예: "화면 만들어줘"
```

**3. 오류 처리:**

```
생성 실패 시:
1. validate_screen으로 오류 확인
2. list_tokens로 유효한 토큰 확인
3. 정의 수정 후 재시도
```

## 트러블슈팅

### MCP 서버가 연결되지 않음

**증상:**

```
Error: MCP server not found
```

**해결책:**

1. `claude_desktop_config.json` 경로 확인
2. MCP 서버 빌드 확인 (`npm run build`)
3. Claude Desktop 재시작

### 도구가 표시되지 않음

**증상:**

```
@mcp tools 실행 시 도구 목록이 비어있음
```

**해결책:**

1. `dist/index.js` 파일 존재 확인
2. Node.js 버전 확인 (20.0.0+)
3. 설정 파일 JSON 문법 확인

### 생성 실패

**증상:**

```
{
  "success": false,
  "error": "Token not found"
}
```

**해결책:**

1. `list_tokens` 호출하여 유효한 토큰 확인
2. 화면 정의에서 토큰 ID 수정
3. 테마 ID 확인 (기본값: 'default')

## 추가 자료

- **[API Reference](../core/src/screen-generation/API.md)** - 전체 API 문서
- **[Integration Guide](../core/src/screen-generation/INTEGRATION.md)** - 프로젝트 통합
- **[Phase 1: Schema](../core/src/screen-generation/PHASE-1.md)** - 화면 정의 형식
- **[Phase 2: Resolver](../core/src/screen-generation/PHASE-2.md)** - 해석 과정
- **[Phase 3: Generators](../core/src/screen-generation/PHASE-3.md)** - 코드 생성

## 피드백 및 지원

문제가 발생하거나 제안사항이 있으시면:

1. GitHub Issues: https://github.com/asleep/tekton/issues
2. 문서 개선 제안
3. 새 도구 요청

---

**[SPEC-LAYOUT-002]** [PHASE-4: MCP Integration] [PHASE-5: Documentation]
