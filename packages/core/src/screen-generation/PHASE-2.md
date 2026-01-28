# Phase 2: Screen Resolver Pipeline

토큰 해석 및 레이아웃 통합 파이프라인

## 개요

Phase 2는 ScreenDefinition을 ResolvedScreen으로 변환하는 리졸버 파이프라인을 구현합니다. 이 과정에서 모든 토큰 참조를 해석하고, 레이아웃을 통합하며, 컴포넌트 스키마를 로드하여 렌더링 준비가 완료된 화면 구조를 생성합니다.

**커버리지**: 90.16%
**상태**: ✅ 완료
**테스트**: 모두 통과

## 아키텍처

리졸버 파이프라인은 4개의 주요 리졸버로 구성됩니다:

```
┌─────────────────────┐
│  Screen Definition  │
└──────────┬──────────┘
           │
           ├──▶ Token Resolver ────┐
           │    (템플릿 변수)        │
           │                       │
           ├──▶ Layout Resolver ───┤
           │    (Shell/Page/Section)│
           │                       │
           ├──▶ Component Resolver ┤
           │    (스키마 로드)        │
           │                       │
           └──▶ Screen Resolver ───┘
                (오케스트레이션)
                       │
                       ▼
           ┌─────────────────────┐
           │  Resolved Screen    │
           └─────────────────────┘
```

## 1. Token Resolver

템플릿 변수 대체 및 토큰 바인딩 해석을 처리합니다.

### resolveBinding()

단일 토큰 바인딩을 해석합니다.

```typescript
import { resolveBinding } from '@tekton/core/screen-generation';

const context = {
  themeId: 'default',
  availableTokens: ['color.primary.500', 'spacing.4'],
};

// 토큰 참조 해석
const value = resolveBinding('{{color.primary.500}}', context);
// → '#3b82f6' (토큰 시스템에서 해석됨)

// 일반 값은 그대로 반환
const plain = resolveBinding('16px', context);
// → '16px'
```

### resolveBindings()

여러 토큰 바인딩을 한 번에 해석합니다.

```typescript
import { resolveBindings } from '@tekton/core/screen-generation';

const bindings = {
  background: '{{color.primary.500}}',
  padding: '{{spacing.4}}',
  margin: '8px', // 일반 값
};

const resolved = resolveBindings(bindings, context);
// {
//   background: '#3b82f6',
//   padding: '16px',
//   margin: '8px'
// }
```

### substituteTemplateVariables()

객체 내 모든 템플릿 변수를 재귀적으로 대체합니다.

```typescript
import { substituteTemplateVariables } from '@tekton/core/screen-generation';

const obj = {
  style: {
    backgroundColor: '{{color.primary.500}}',
    padding: '{{spacing.4}}',
  },
  text: 'Hello', // 템플릿이 아닌 값은 그대로 유지
};

const result = substituteTemplateVariables(obj, context);
// {
//   style: {
//     backgroundColor: '#3b82f6',
//     padding: '16px'
//   },
//   text: 'Hello'
// }
```

### tokenRefToCSSVar()

토큰 참조를 CSS 변수로 변환합니다.

```typescript
import { tokenRefToCSSVar } from '@tekton/core/screen-generation';

const cssVar = tokenRefToCSSVar('color.primary.500');
// → 'var(--color-primary-500)'

const nested = tokenRefToCSSVar('component.button.primary.background');
// → 'var(--component-button-primary-background)'
```

### 템플릿 변수 추출

문자열에서 모든 템플릿 변수를 추출합니다.

```typescript
import { extractTemplateVariables } from '@tekton/core/screen-generation';

const text = 'Style: {{color.primary.500}} and {{spacing.4}}';
const variables = extractTemplateVariables(text);
// ['color.primary.500', 'spacing.4']
```

## 2. Layout Resolver

SPEC-LAYOUT-001 토큰을 완전한 레이아웃 구조로 해석합니다.

### resolveShell()

Shell 토큰을 해석합니다 (애플리케이션 레벨 레이아웃).

```typescript
import { resolveShell } from '@tekton/core/screen-generation';

const context = {
  themeId: 'default',
};

const shellLayout = await resolveShell('shell.web.dashboard', context);
// {
//   id: 'shell.web.dashboard',
//   type: 'shell',
//   slots: ['header', 'sidebar', 'main', 'footer'],
//   styles: { /* CSS 변수 */ },
//   responsive: { /* 반응형 오버라이드 */ }
// }
```

### resolvePage()

Page 토큰을 해석합니다 (페이지 레벨 레이아웃).

```typescript
import { resolvePage } from '@tekton/core/screen-generation';

const pageLayout = await resolvePage('page.dashboard', context);
// {
//   id: 'page.dashboard',
//   type: 'page',
//   container: {
//     maxWidth: '1280px',
//     padding: '{{spacing.6}}'
//   },
//   sections: []
// }
```

### resolveSection()

Section 토큰을 해석합니다 (섹션 패턴).

```typescript
import { resolveSection } from '@tekton/core/screen-generation';

const sectionLayout = await resolveSection('section.grid-4', context);
// {
//   id: 'section.grid-4',
//   type: 'section',
//   layout: 'grid',
//   slots: ['item-1', 'item-2', 'item-3', 'item-4'],
//   gridConfig: {
//     columns: 4,
//     gap: '{{spacing.4}}'
//   }
// }
```

### parseLayoutType()

레이아웃 토큰에서 레이아웃 타입을 파싱합니다.

```typescript
import { parseLayoutType } from '@tekton/core/screen-generation';

const type = parseLayoutType('shell.web.dashboard');
// 'shell'

const pageType = parseLayoutType('page.dashboard');
// 'page'

const sectionType = parseLayoutType('section.grid-4');
// 'section'
```

## 3. Component Resolver

컴포넌트 스키마를 로드하고 해석합니다.

### resolveComponent()

ComponentDefinition을 완전한 스키마로 해석합니다.

```typescript
import { resolveComponent } from '@tekton/core/screen-generation';

const componentDef = {
  type: 'Button',
  props: { variant: 'primary' },
  children: ['Click me'],
};

const context = {
  themeId: 'default',
};

const resolved = await resolveComponent(componentDef, context);
// {
//   type: 'Button',
//   schema: {
//     props: [
//       { name: 'variant', type: 'string', required: false },
//       { name: 'children', type: 'React.ReactNode', required: true }
//     ],
//     tokenBindings: {
//       primary: {
//         background: '{{component.button.primary.background}}',
//         foreground: '{{component.button.primary.foreground}}'
//       }
//     }
//   },
//   props: { variant: 'primary' },
//   children: ['Click me'],
//   resolvedStyles: {
//     background: '#3b82f6',
//     foreground: '#ffffff'
//   }
// }
```

### resolveChildren()

컴포넌트의 자식들을 재귀적으로 해석합니다.

```typescript
import { resolveChildren } from '@tekton/core/screen-generation';

const children = [
  {
    type: 'Heading',
    props: { level: 2 },
    children: ['Title'],
  },
  {
    type: 'Text',
    props: {},
    children: ['Description'],
  },
];

const resolved = await resolveChildren(children, context);
// [
//   { type: 'Heading', schema: {...}, ... },
//   { type: 'Text', schema: {...}, ... }
// ]
```

### extractComponentTypes()

화면 정의에서 모든 컴포넌트 타입을 추출합니다.

```typescript
import { extractComponentTypes } from '@tekton/core/screen-generation';

const types = extractComponentTypes(screenDef);
// Set { 'Card', 'Heading', 'Text', 'Button' }

// 스키마를 미리 로드하는 데 유용
for (const type of types) {
  await loadComponentSchema(type);
}
```

## 4. Screen Resolver (메인 오케스트레이터)

모든 리졸버를 조정하여 완전한 ResolvedScreen을 생성합니다.

### resolveScreen()

ScreenDefinition을 ResolvedScreen으로 해석하는 메인 함수입니다.

```typescript
import { resolveScreen } from '@tekton/core/screen-generation';

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
        /* ... */
      ],
    },
  ],
};

const resolved = await resolveScreen(screenDef);
// ResolvedScreen {
//   id: 'dashboard-screen',
//   name: 'Dashboard Overview',
//   shell: { /* 해석된 Shell 레이아웃 */ },
//   page: { /* 해석된 Page 레이아웃 */ },
//   sections: [
//     {
//       id: 'metrics-section',
//       layout: { /* 해석된 Section 레이아웃 */ },
//       components: [ /* 해석된 컴포넌트들 */ ],
//       cssVariables: { /* 섹션 CSS 변수 */ }
//     }
//   ],
//   cssVariables: { /* 전역 CSS 변수 */ },
//   componentTree: { /* 계층 구조 */ },
//   themeId: 'default'
// }
```

## ResolvedScreen 인터페이스

리졸버 파이프라인의 출력 타입입니다.

```typescript
interface ResolvedScreen {
  /** 화면 식별자 */
  id: string;

  /** 화면 이름 */
  name: string;

  /** 선택적 설명 */
  description?: string;

  /** 해석된 Shell 레이아웃 */
  shell: ResolvedLayout;

  /** 해석된 Page 레이아웃 */
  page: ResolvedLayout;

  /** 레이아웃 및 컴포넌트가 해석된 섹션들 */
  sections: ResolvedSection[];

  /** 모든 레이아웃의 전역 CSS 변수 */
  cssVariables: Record<string, string>;

  /** 컴포넌트 트리 구조 */
  componentTree: ComponentTree;

  /** 화면 메타데이터 */
  meta?: ScreenMeta;

  /** 해석에 사용된 테마 ID */
  themeId: string;
}
```

## ResolvedSection 인터페이스

레이아웃 및 컴포넌트가 해석된 섹션입니다.

```typescript
interface ResolvedSection {
  /** 섹션 식별자 */
  id: string;

  /** 해석된 섹션 패턴 레이아웃 */
  layout: ResolvedLayout;

  /** 섹션 내 해석된 컴포넌트들 */
  components: ResolvedComponent[];

  /** 섹션 레이아웃에서 생성된 CSS 변수 */
  cssVariables: Record<string, string>;
}
```

## 성능 고려사항

### 캐싱

리졸버 파이프라인은 성능을 위해 캐싱을 사용합니다:

```typescript
import {
  clearBindingCache,
  clearComponentCache,
  clearScreenCache,
} from '@tekton/core/screen-generation';

// 새 테마 로드 시 캐시 클리어
clearBindingCache();
clearComponentCache();
clearScreenCache();
```

**캐싱 전략:**

- **Token Bindings**: 토큰 해석 결과를 캐싱 (themeId별)
- **Component Schemas**: 컴포넌트 스키마를 캐싱 (타입별)
- **Layout Tokens**: 레이아웃 토큰을 캐싱 (토큰 ID별)

### 병렬 해석

독립적인 섹션은 병렬로 해석됩니다:

```typescript
// 내부적으로 resolveScreen()은 Promise.all을 사용
const resolvedSections = await Promise.all(
  screenDef.sections.map(section => resolveSection(section, context))
);
```

### 지연 로딩

컴포넌트 스키마는 필요할 때만 로드됩니다:

```typescript
// 1단계: 사용된 컴포넌트 타입 추출
const types = extractComponentTypes(screenDef);

// 2단계: 스키마만 미리 로드 (병렬)
await Promise.all(Array.from(types).map(type => loadComponentSchema(type)));

// 3단계: 화면 해석
const resolved = await resolveScreen(screenDef);
```

## 에러 처리

### 토큰 미발견

```typescript
try {
  const resolved = await resolveScreen(screenDef);
} catch (error) {
  if (error.message.includes('Token not found')) {
    console.error('Missing token:', error.message);
    // 예: "Token not found: color.custom.500"
  }
}
```

### 순환 참조

```typescript
try {
  const value = resolveBinding('{{color.a}}', context);
} catch (error) {
  if (error.message.includes('Circular reference')) {
    console.error('Circular token reference detected');
    // 토큰 정의 수정 필요
  }
}
```

### 잘못된 레이아웃 토큰

```typescript
try {
  const layout = await resolveShell('invalid-token', context);
} catch (error) {
  console.error('Invalid shell token:', error.message);
  // 사용 가능한 Shell 토큰 확인
}
```

## 사용 예제

### 완전한 해석 워크플로우

```typescript
import {
  validateScreenDefinition,
  resolveScreen,
  getScreenStats,
} from '@tekton/core/screen-generation';

// 1. 화면 정의 검증
const validation = validateScreenDefinition(screenDef);
if (!validation.valid) {
  throw new Error(validation.errors.join(', '));
}

// 2. 화면 해석
const resolved = await resolveScreen(screenDef);

// 3. 통계 확인
const stats = getScreenStats(resolved);
console.log(`Sections: ${stats.sectionCount}`);
console.log(`Components: ${stats.componentCount}`);
console.log(`CSS Variables: ${stats.cssVariableCount}`);
console.log(`Max Depth: ${stats.maxDepth}`);
```

### 커스텀 테마 사용

```typescript
const context = {
  themeId: 'dark',
};

const screenDef = {
  id: 'dashboard-screen',
  name: 'Dashboard',
  shell: 'shell.web.dashboard',
  page: 'page.dashboard',
  themeId: 'dark', // 화면 레벨 테마 오버라이드
  sections: [
    /* ... */
  ],
};

const resolved = await resolveScreen(screenDef);
// 'dark' 테마의 토큰 사용
```

### 부분 해석

특정 섹션만 해석:

```typescript
import { resolveSection, resolveComponent } from '@tekton/core/screen-generation';

const context = { themeId: 'default' };

// 단일 섹션 해석
const section = screenDef.sections[0];
const resolvedSection = {
  id: section.id,
  layout: await resolveSection(section.pattern, context),
  components: await Promise.all(section.components.map(comp => resolveComponent(comp, context))),
  cssVariables: {}, // 레이아웃에서 추출
};
```

## 검증 및 디버깅

### 해석된 화면 검증

```typescript
import { isValidResolvedScreen } from '@tekton/core/screen-generation';

if (isValidResolvedScreen(resolved)) {
  console.log('✅ Resolved screen is valid');
  // 생성 계속 진행
} else {
  console.error('❌ Invalid resolved screen structure');
}
```

### 컴포넌트 트리 검사

```typescript
const tree = resolved.componentTree;

tree.sections.forEach(section => {
  console.log(`Section: ${section.sectionId}`);
  section.components.forEach(comp => {
    console.log(`  - ${comp.type} (slot: ${comp.slot})`);
    if (comp.children) {
      comp.children.forEach(child => {
        console.log(`    - ${child.type}`);
      });
    }
  });
});
```

### CSS 변수 디버깅

```typescript
// 전역 CSS 변수
console.log('Global CSS Variables:');
Object.entries(resolved.cssVariables).forEach(([key, value]) => {
  console.log(`  ${key}: ${value}`);
});

// 섹션별 CSS 변수
resolved.sections.forEach(section => {
  console.log(`\nSection ${section.id} CSS Variables:`);
  Object.entries(section.cssVariables).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
});
```

## 다음 단계

리졸버 파이프라인을 이해했다면:

1. **[Phase 3: Output Generators](./PHASE-3.md)** - 코드 생성 방법 배우기
2. **[API Reference](./API.md)** - 모든 리졸버 함수 탐색
3. **통합 테스트 작성** - 전체 파이프라인 테스트

## 참고

- Token Resolver: `resolver/token-resolver.ts`
- Layout Resolver: `resolver/layout-resolver.ts`
- Component Resolver: `resolver/component-resolver.ts`
- Screen Resolver: `resolver/screen-resolver.ts`

---

**[SPEC-LAYOUT-002]** [PHASE-2] [Coverage: 90.16%]
