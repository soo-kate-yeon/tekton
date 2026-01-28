# Phase 1: JSON Schema & Validation

JSON Schema와 Zod를 사용한 타입 안전 화면 정의 시스템

## 개요

Phase 1은 화면 정의의 기반을 제공합니다. TypeScript 인터페이스, JSON Schema Draft 2020-12, 그리고 Zod 런타임 검증을 결합하여 컴파일 타임과 런타임 모두에서 타입 안전성을 보장합니다.

**커버리지**: 92.88%
**상태**: ✅ 완료
**테스트**: 모두 통과

## TypeScript 인터페이스

### ScreenDefinition

화면의 완전한 선언적 사양입니다.

```typescript
interface ScreenDefinition {
  /** 고유 화면 식별자 (kebab-case) */
  id: string;

  /** 사람이 읽을 수 있는 화면 이름 */
  name: string;

  /** 선택적 화면 설명 */
  description?: string;

  /** Shell 토큰 ID (예: "shell.web.dashboard") */
  shell: string;

  /** Page 레이아웃 토큰 ID (예: "page.dashboard") */
  page: string;

  /** 토큰 해석을 위한 테마 ID (기본값: "default") */
  themeId?: string;

  /** 화면을 구성하는 섹션 정의 */
  sections: SectionDefinition[];

  /** 선택적 메타데이터 */
  meta?: ScreenMeta;
}
```

**필드 설명:**

- **id**: 고유 식별자, kebab-case 형식 (예: `dashboard-screen`, `user-profile`)
- **name**: 표시용 이름 (예: `Dashboard Overview`)
- **shell**: SPEC-LAYOUT-001의 Shell 토큰 (애플리케이션 레벨 레이아웃)
- **page**: SPEC-LAYOUT-001의 Page 토큰 (페이지 레벨 레이아웃)
- **sections**: 화면 섹션 배열, 최소 1개 필요

### SectionDefinition

섹션 패턴과 컴포넌트가 있는 레이아웃 섹션입니다.

```typescript
interface SectionDefinition {
  /** 섹션 식별자 (화면 내 고유) */
  id: string;

  /** 섹션 패턴 토큰 ID (예: "section.grid-4") */
  pattern: string;

  /** 이 섹션 내 컴포넌트 */
  components: ComponentDefinition[];

  /** 이 섹션의 반응형 오버라이드 */
  responsive?: ResponsiveOverrides;
}
```

**섹션 패턴 예제:**

- `section.grid-4` - 4열 그리드 레이아웃
- `section.hero` - 히어로 섹션
- `section.split` - 좌우 분할 레이아웃

### ComponentDefinition

컴포넌트 인스턴스를 지정합니다.

```typescript
interface ComponentDefinition {
  /** 20가지 컴포넌트 타입 중 하나 */
  type: ComponentType;

  /** 컴포넌트 props (키-값 쌍) */
  props: Record<string, unknown>;

  /** 자식 컴포넌트 또는 텍스트 콘텐츠 */
  children?: (ComponentDefinition | string)[];

  /** 섹션 내 위치 지정을 위한 레이아웃 슬롯 할당 */
  slot?: string;
}
```

**컴포넌트 타입** (20개 지원):

**프리미티브 (10):**

```typescript
type ComponentType =
  | 'Button'
  | 'Input'
  | 'Text'
  | 'Heading'
  | 'Checkbox'
  | 'Radio'
  | 'Switch'
  | 'Slider'
  | 'Badge'
  | 'Avatar';
```

**조합 (10):**

```typescript
type ComponentType =
  | 'Card'
  | 'Modal'
  | 'Tabs'
  | 'Table'
  | 'Link'
  | 'List'
  | 'Image'
  | 'Form'
  | 'Dropdown'
  | 'Progress';
```

### ResponsiveOverrides

섹션 레벨 반응형 구성입니다.

```typescript
interface ResponsiveOverrides {
  /** 스몰 디바이스 오버라이드 (640px+) */
  sm?: Record<string, unknown>;

  /** 미디엄 디바이스 오버라이드 (768px+) */
  md?: Record<string, unknown>;

  /** 라지 디바이스 오버라이드 (1024px+) */
  lg?: Record<string, unknown>;

  /** 엑스트라 라지 디바이스 오버라이드 (1280px+) */
  xl?: Record<string, unknown>;

  /** 2X 라지 디바이스 오버라이드 (1536px+) */
  '2xl'?: Record<string, unknown>;
}
```

**사용 예제:**

```json
{
  "responsive": {
    "sm": { "gridColumns": 1 },
    "md": { "gridColumns": 2 },
    "lg": { "gridColumns": 4 }
  }
}
```

### ScreenMeta

화면 정의의 선택적 메타데이터입니다.

```typescript
interface ScreenMeta {
  /** 화면 작성자 */
  author?: string;

  /** 생성 타임스탬프 (ISO 8601) */
  createdAt?: string;

  /** 화면 버전 (semver) */
  version?: string;

  /** 분류 태그 */
  tags?: string[];
}
```

## JSON Schema

JSON Schema Draft 2020-12 표준을 사용하여 화면 정의를 검증합니다.

### 토큰 ID 패턴

화면 정의는 엄격한 토큰 ID 패턴을 따릅니다:

**Shell 토큰 패턴:**

```
shell.{platform}.{name}
```

예: `shell.web.dashboard`, `shell.mobile.app`

**Page 토큰 패턴:**

```
page.{name}
```

예: `page.dashboard`, `page.settings`

**Section 토큰 패턴:**

```
section.{name} 또는 section.{name}-{number}
```

예: `section.grid-4`, `section.hero`, `section.split`

**Screen ID 패턴:**

```
kebab-case (소문자, 숫자, 하이픈)
```

예: `dashboard-screen`, `user-profile`, `settings-page`

### Schema 파일

완전한 JSON Schema는 `screen-definition.schema.json`에 있습니다:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://tekton.dev/schemas/screen-definition.json",
  "title": "Screen Definition",
  "description": "Declarative screen specification using layout tokens",
  "type": "object",
  "required": ["id", "name", "shell", "page", "sections"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^[a-z0-9]+(-[a-z0-9]+)*$",
      "description": "Unique screen identifier (kebab-case)"
    }
  }
}
```

## Zod 검증

런타임 검증을 위해 Zod 스키마를 사용합니다. 도움이 되는 오류 메시지를 제공합니다.

### 기본 검증

```typescript
import { validateScreenDefinition } from '@tekton/core/screen-generation';

const result = validateScreenDefinition(screenDef);

if (!result.valid) {
  console.error('Validation errors:', result.errors);
  // 예: ["shell: Shell token must match pattern: shell.{platform}.{name}"]
}
```

### 컨텍스트 기반 검증

추가 검사를 위한 검증 컨텍스트를 제공할 수 있습니다:

```typescript
const context = {
  availableShells: ['shell.web.dashboard', 'shell.mobile.app'],
  availablePages: ['page.dashboard', 'page.settings'],
  availableSections: ['section.grid-4', 'section.hero'],
  availableThemes: ['default', 'dark'],
  strict: true, // 경고를 오류로 처리
};

const result = validateScreenDefinition(screenDef, context);

if (!result.valid) {
  console.error('Errors:', result.errors);
}

if (result.warnings) {
  console.warn('Warnings:', result.warnings);
  // 예: ["Shell token 'shell.web.custom' not found in available shells"]
}
```

### Assertion 검증

잘못된 경우 예외를 발생시킵니다:

```typescript
import { assertValidScreenDefinition } from '@tekton/core/screen-generation';

try {
  assertValidScreenDefinition(screenDef, context);
  // 검증 성공, 계속 진행
} catch (error) {
  console.error('Invalid screen definition:', error.message);
  // 예외 처리
}
```

### 컴포넌트 및 섹션 검증

개별 컴포넌트 및 섹션도 검증할 수 있습니다:

```typescript
import { validateComponent, validateSection } from '@tekton/core/screen-generation';

// 컴포넌트 검증
const componentResult = validateComponent({
  type: 'Button',
  props: { variant: 'primary' },
  children: ['Click me'],
});

// 섹션 검증
const sectionResult = validateSection({
  id: 'hero-section',
  pattern: 'section.hero',
  components: [
    /* ... */
  ],
});
```

### 배치 검증

여러 화면 정의를 한 번에 검증:

```typescript
import { validateScreenDefinitions } from '@tekton/core/screen-generation';

const screens = [screenDef1, screenDef2, screenDef3];
const summary = validateScreenDefinitions(screens, context);

console.log(`Total: ${summary.totalScreens}`);
console.log(`Valid: ${summary.validScreens}`);
console.log(`Invalid: ${summary.invalidScreens}`);

summary.validationResults.forEach(result => {
  if (!result.valid) {
    console.error(`Screen ${result.id}:`, result.errors);
  }
});
```

## 검증 오류 메시지

Zod 검증은 도움이 되는 오류 메시지를 제공합니다:

### 패턴 불일치

```
shell: Shell token must match pattern: shell.{platform}.{name} (e.g., "shell.web.dashboard")
```

### 필수 필드 누락

```
sections: Screen must have at least one section definition
```

### 타입 오류

```
components.0.type: Component type must be one of: Button, Input, Text, ...
```

### 중복 ID

```
Duplicate section IDs found: hero-section, metrics-section
```

## 예제 화면 정의

### 최소 예제

```json
{
  "id": "simple-screen",
  "name": "Simple Screen",
  "shell": "shell.web.dashboard",
  "page": "page.dashboard",
  "sections": [
    {
      "id": "main-section",
      "pattern": "section.hero",
      "components": [
        {
          "type": "Heading",
          "props": { "level": 1 },
          "children": ["Welcome"]
        }
      ]
    }
  ]
}
```

### 완전한 예제

메타데이터 및 반응형 오버라이드가 포함된 완전한 화면 정의:

```json
{
  "id": "dashboard-screen",
  "name": "Dashboard Overview",
  "description": "Main dashboard with metrics grid",
  "shell": "shell.web.dashboard",
  "page": "page.dashboard",
  "themeId": "default",
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
            }
          ]
        }
      ],
      "responsive": {
        "sm": { "gridColumns": 1 },
        "lg": { "gridColumns": 4 }
      }
    }
  ],
  "meta": {
    "author": "Tekton Team",
    "createdAt": "2026-01-28T10:00:00Z",
    "version": "1.0.0",
    "tags": ["dashboard", "analytics"]
  }
}
```

더 많은 예제는 `examples/` 디렉토리를 참조하세요.

## 유틸리티 함수

### 토큰 패턴 검증

```typescript
import {
  isValidShellToken,
  isValidPageToken,
  isValidSectionToken,
} from '@tekton/core/screen-generation';

isValidShellToken('shell.web.dashboard'); // true
isValidPageToken('page.dashboard'); // true
isValidSectionToken('section.grid-4'); // true
```

### 타입 가드

```typescript
import { isComponentDefinition, isScreenDefinition } from '@tekton/core/screen-generation';

if (isComponentDefinition(obj)) {
  // obj는 ComponentDefinition
  console.log(obj.type);
}

if (isScreenDefinition(obj)) {
  // obj는 ScreenDefinition
  console.log(obj.sections);
}
```

### 컴포넌트 타입 추출

화면에서 사용된 모든 컴포넌트 타입 가져오기:

```typescript
import { getUsedComponentTypes } from '@tekton/core/screen-generation';

const types = getUsedComponentTypes(screenDef);
// Set { 'Card', 'Heading', 'Text', 'Badge' }

console.log(`Screen uses ${types.size} different component types`);
```

## 다음 단계

스키마와 검증을 이해했다면:

1. **[Phase 2: Resolver Pipeline](./PHASE-2.md)** - 토큰 해석 방법 배우기
2. **[API Reference](./API.md)** - 모든 검증 함수 탐색
3. **examples/ 디렉토리** - 실제 화면 정의 확인

## 참고

- TypeScript 인터페이스: `types.ts`
- Zod 스키마: `validators.ts`
- JSON Schema: `screen-definition.schema.json`
- 예제: `examples/dashboard-screen.json`

---

**[SPEC-LAYOUT-002]** [PHASE-1] [Coverage: 92.88%]
