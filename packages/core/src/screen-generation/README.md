# Screen Generation Pipeline (SPEC-LAYOUT-002)

JSON 화면 정의를 프로덕션 React 컴포넌트로 변환하는 포괄적인 화면 생성 파이프라인입니다.

## 개요

Screen Generation Pipeline은 선언적 JSON 화면 정의를 여러 CSS 프레임워크(styled-components, Emotion, Tailwind)를 지원하는 프로덕션 React 코드로 변환합니다. SPEC-LAYOUT-001의 레이아웃 토큰 시스템과 통합되어 일관되고 LLM 친화적인 UI 생성을 가능하게 합니다.

**주요 기능:**

- 🎯 **JSON Schema 기반 정의** - TypeScript 타입 안전성과 Zod 런타임 검증
- 🔄 **토큰 리졸버 파이프라인** - 자동 레이아웃 및 컴포넌트 토큰 해석
- 🎨 **다중 CSS 출력 형식** - CSS-in-JS (styled-components, Emotion) 및 Tailwind 지원
- ⚛️ **React 컴포넌트 생성** - TypeScript React 함수형 컴포넌트
- 🤖 **MCP 서버 통합** - Claude Code/Desktop LLM 사용을 위한 3개 도구
- ✅ **85%+ 테스트 커버리지** - TRUST 5 프레임워크 준수

## 빠른 시작

### 기본 사용법

```typescript
import {
  validateScreenDefinition,
  resolveScreen,
  generateReactComponent,
} from '@tekton/core/screen-generation';

// 1. 화면 정의 검증
const screenDef = {
  id: 'dashboard-screen',
  name: 'Dashboard Overview',
  shell: 'shell.web.dashboard',
  page: 'page.dashboard',
  sections: [
    {
      id: 'metrics-section',
      pattern: 'section.grid-4',
      components: [
        {
          type: 'Card',
          props: { variant: 'elevated' },
          children: [
            {
              type: 'Heading',
              props: { level: 3 },
              children: ['Total Users'],
            },
          ],
        },
      ],
    },
  ],
};

const validation = validateScreenDefinition(screenDef);
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
  process.exit(1);
}

// 2. 화면 리졸브 (레이아웃 및 컴포넌트 토큰 해석)
const resolved = await resolveScreen(screenDef);

// 3. React 컴포넌트 생성
const result = generateReactComponent(resolved, {
  format: 'typescript',
  prettier: false,
});

console.log(result.code);
// 프로덕션 React 컴포넌트 출력
```

### CSS-in-JS 생성

```typescript
import { generateStyledComponents } from '@tekton/core/screen-generation';

// styled-components 출력
const styledResult = generateStyledComponents(resolved, 'styled-components', {
  format: 'typescript',
});

// Emotion 출력
const emotionResult = generateStyledComponents(resolved, 'emotion', {
  format: 'typescript',
});
```

### Tailwind CSS 생성

```typescript
import { generateTailwindClasses } from '@tekton/core/screen-generation';

const tailwindResult = generateTailwindClasses(resolved, {
  format: 'typescript',
});

// Tailwind 설정도 함께 생성
import { generateTailwindConfig } from '@tekton/core/screen-generation';
const config = generateTailwindConfig(resolved);
```

## 아키텍처

Screen Generation Pipeline은 4단계로 구성됩니다:

```
┌─────────────────────┐
│  JSON Screen Def    │  화면 정의 (JSON)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Phase 1: Schema    │  JSON Schema & Zod 검증
│  & Validation       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Phase 2: Resolver  │  토큰 해석 파이프라인
│  Pipeline           │  - Shell/Page/Section 레이아웃
│                     │  - 컴포넌트 스키마
│                     │  - 템플릿 변수
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Phase 3: Output    │  코드 생성
│  Generators         │  - CSS-in-JS (styled/emotion)
│                     │  - Tailwind
│                     │  - React Component
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Production Code    │  프로덕션 React 컴포넌트
└─────────────────────┘
```

### SPEC-LAYOUT-001 통합

Screen Generation Pipeline은 SPEC-LAYOUT-001의 레이아웃 토큰 시스템과 긴밀하게 통합됩니다:

- **Shell Tokens**: `shell.web.dashboard`, `shell.mobile.app` - 애플리케이션 레벨 레이아웃
- **Page Tokens**: `page.dashboard`, `page.settings` - 페이지 레벨 레이아웃
- **Section Tokens**: `section.grid-4`, `section.hero` - 섹션 패턴
- **Responsive Tokens**: `sm`, `md`, `lg`, `xl`, `2xl` - 반응형 오버라이드

리졸버 파이프라인이 이러한 토큰을 자동으로 해석하여 완전한 CSS 변수와 스타일을 생성합니다.

## 문서

### 단계별 가이드

각 구현 단계에 대한 상세 문서:

- **[Phase 1: Schema & Validation](./PHASE-1.md)** - TypeScript 인터페이스, JSON Schema, Zod 검증
- **[Phase 2: Resolver Pipeline](./PHASE-2.md)** - 토큰 해석, 레이아웃 리졸버, 컴포넌트 리졸버
- **[Phase 3: Output Generators](./PHASE-3.md)** - CSS-in-JS, Tailwind, React 컴포넌트 생성

### API 및 통합

- **[API Reference](./API.md)** - 모든 공개 API에 대한 완전한 참조
- **[MCP Tools](../../mcp-server/SCREEN-TOOLS.md)** - Claude Code/Desktop 통합 가이드
- **[Integration Guide](./INTEGRATION.md)** - 기존 프로젝트 통합 방법

## 예제

### 대시보드 화면

```json
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
          "slot": "metric-1",
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
            },
            {
              "type": "Badge",
              "props": { "variant": "success" },
              "children": ["+12.5%"]
            }
          ]
        }
      ],
      "responsive": {
        "sm": { "gridColumns": 1 },
        "md": { "gridColumns": 2 },
        "lg": { "gridColumns": 4 }
      }
    }
  ]
}
```

전체 예제는 `examples/` 디렉토리를 참조하세요:

- `dashboard-screen.json` - 지표 그리드가 있는 대시보드
- `settings-screen.json` - 폼 레이아웃이 있는 설정 페이지
- `detail-screen.json` - 상세 정보가 있는 상세 페이지

## 지원 컴포넌트

20가지 컴포넌트 타입 지원 (SPEC-COMPONENT-001-B):

**프리미티브 컴포넌트 (10):**

- Button, Input, Text, Heading, Checkbox
- Radio, Switch, Slider, Badge, Avatar

**조합 컴포넌트 (10):**

- Card, Modal, Tabs, Table, Link
- List, Image, Form, Dropdown, Progress

각 컴포넌트는 완전한 스키마, props 정의, 토큰 바인딩을 포함합니다.

## 품질 메트릭

| 단계                         | 커버리지 | 테스트  | 상태    |
| ---------------------------- | -------- | ------- | ------- |
| Phase 1: Schema & Validation | 92.88%   | ✅ 통과 | ✅ 완료 |
| Phase 2: Resolver Pipeline   | 90.16%   | ✅ 통과 | ✅ 완료 |
| Phase 3: Output Generators   | 91.17%   | ✅ 통과 | ✅ 완료 |
| Phase 4: MCP Integration     | N/A      | ✅ 통과 | ✅ 완료 |

**전체 커버리지**: 85%+ (TRUST 5 요구사항 충족)

## 다음 단계

1. **[Phase 1 문서 읽기](./PHASE-1.md)** - 스키마 정의 및 검증 이해
2. **[API 참조 확인](./API.md)** - 사용 가능한 모든 함수 탐색
3. **[통합 가이드 따라하기](./INTEGRATION.md)** - 프로젝트에 통합
4. **[MCP 도구 사용](../../mcp-server/SCREEN-TOOLS.md)** - Claude와 함께 LLM 생성 사용

## 라이센스

MIT

---

**[SPEC-LAYOUT-002]** [PHASE-5: Documentation]
