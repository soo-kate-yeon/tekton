# 템플릿 아키텍처

Screen Template 시스템의 설계 원칙, 아키텍처 패턴, 확장 전략을 설명합니다.

## 목차

1. [설계 철학](#설계-철학)
2. [아키텍처 개요](#아키텍처-개요)
3. [핵심 컴포넌트](#핵심-컴포넌트)
4. [템플릿 생명주기](#템플릿-생명주기)
5. [확장 패턴](#확장-패턴)
6. [모범 사례](#모범-사례)

---

## 설계 철학

### 핵심 원칙

1. **조합 우선 (Composition over Inheritance)**
   - 템플릿은 슬롯 기반 조합 구조
   - 상속보다 명시적 조합으로 재사용성 확보

2. **테마 독립성 (Theme Agnostic)**
   - CSS Variables 기반으로 모든 테마와 호환
   - 하드코딩된 스타일 금지

3. **타입 안전성 (Type Safety)**
   - TypeScript로 컴파일 타임 검증
   - 슬롯, 레이아웃, 토큰 모두 타입 정의

4. **선언적 메타데이터 (Declarative Metadata)**
   - 템플릿 자체가 자신을 설명
   - 런타임 검색 및 분류 가능

### 설계 목표

| 목표 | 설명 | 달성 방법 |
|------|------|----------|
| 재사용성 | 여러 프로젝트에서 사용 가능 | 슬롯 기반 조합, 테마 독립성 |
| 발견 가능성 | 템플릿 검색 및 선택 용이 | TemplateRegistry, 메타데이터 |
| 확장성 | 새 템플릿 추가 간편 | 표준 인터페이스, 레지스트리 패턴 |
| 유지보수성 | 변경 영향 최소화 | 명확한 계약, 타입 안전성 |
| 성능 | 최소한의 런타임 오버헤드 | 정적 메타데이터, CSS Variables |

---

## 아키텍처 개요

### 시스템 구조

```
┌─────────────────────────────────────────────────────────────┐
│                    Template Consumer                         │
│  (playground-web, 사용자 애플리케이션)                        │
└───────────────────┬─────────────────────────────────────────┘
                    │ imports & uses
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                  TemplateRegistry                            │
│  - register(template)                                        │
│  - get(id)                                                   │
│  - getByCategory(category)                                   │
│  - getAll()                                                  │
└───────────────────┬─────────────────────────────────────────┘
                    │ manages
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                   ScreenTemplate                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Metadata (id, name, category, tags, themes)         │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ Layout (type, maxWidth, padding, gap)               │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ Slots (id, name, required, allowedComponents)       │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ TokenBindings (CSS Variable mappings)               │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ Component (React component implementation)          │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────┬─────────────────────────────────────────┘
                    │ composed of
                    ▼
┌─────────────────────────────────────────────────────────────┐
│              @tekton/ui Components                           │
│  Button, Card, Form, Input, Table, Tabs, etc.               │
└───────────────────┬─────────────────────────────────────────┘
                    │ styled with
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                CSS Variables (--tekton-*)                    │
│  from @tekton/tokens via theme JSON                          │
└─────────────────────────────────────────────────────────────┘
```

### 데이터 흐름

1. **템플릿 등록 (Build Time)**
   ```
   ScreenTemplate → TemplateRegistry.register()
   ```

2. **템플릿 검색 (Runtime)**
   ```
   User Request → TemplateRegistry.get(id) → ScreenTemplate
   ```

3. **템플릿 렌더링 (Runtime)**
   ```
   ScreenTemplate.Component → Slot Injection → CSS Variables → Rendered UI
   ```

---

## 핵심 컴포넌트

### 1. ScreenTemplate 인터페이스

템플릿의 계약(Contract)을 정의합니다.

**책임:**
- 템플릿 식별 및 분류 (메타데이터)
- 레이아웃 구성 방법 정의
- 커스터마이즈 포인트 정의 (슬롯)
- 테마 토큰 바인딩
- React 컴포넌트 구현 제공

**설계 결정:**
- **타입 안전성**: TypeScript 인터페이스로 컴파일 타임 검증
- **선언적**: 메타데이터가 템플릿을 자체 설명
- **불변성**: 한번 정의된 템플릿은 변경 불가 (새 버전 생성)

### 2. TemplateRegistry 싱글톤

템플릿의 중앙 저장소 및 검색 엔진입니다.

**책임:**
- 템플릿 등록 및 저장
- ID 기반 조회
- 카테고리별 필터링
- 전체 템플릿 목록 제공

**구현 패턴:**
```typescript
class TemplateRegistryImpl implements TemplateRegistry {
  private templates: Map<string, ScreenTemplate> = new Map();

  register(template: ScreenTemplate): void {
    if (this.templates.has(template.meta.id)) {
      throw new Error(`Template ${template.meta.id} already registered`);
    }
    this.templates.set(template.meta.id, template);
  }

  get(id: string): ScreenTemplate | undefined {
    return this.templates.get(id);
  }

  getByCategory(category: ScreenCategory): ScreenTemplate[] {
    return Array.from(this.templates.values())
      .filter(t => t.meta.category === category);
  }

  getAll(): ScreenTemplate[] {
    return Array.from(this.templates.values());
  }
}

export const TemplateRegistry = new TemplateRegistryImpl();
```

**설계 결정:**
- **싱글톤**: 전역 단일 인스턴스로 일관성 보장
- **Map 기반**: O(1) 조회 성능
- **불변 반환**: 템플릿 복사본 반환으로 변경 방지

### 3. 템플릿 컴포넌트

실제 UI를 렌더링하는 React 컴포넌트입니다.

**책임:**
- 슬롯 컨텐츠 렌더링
- 레이아웃 구조 구현
- CSS Variables 적용
- 접근성 보장

**구현 패턴:**
```typescript
const LoginTemplateComponent: React.FC<ScreenTemplateProps> = ({
  slots,
  className,
  theme,
}) => {
  return (
    <div
      className={`min-h-screen flex items-center justify-center ${className || ''}`}
      data-theme={theme}
    >
      <Card className="w-full max-w-sm">
        {slots?.branding && (
          <CardHeader className="text-center">
            {slots.branding}
          </CardHeader>
        )}
        <CardContent>
          {/* 기본 로그인 폼 */}
        </CardContent>
        {slots?.footer && (
          <CardFooter className="text-center">
            {slots.footer}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
```

**설계 결정:**
- **함수형 컴포넌트**: Hooks 지원, 간결성
- **조건부 렌더링**: Optional 슬롯 처리
- **CSS Variables**: `data-theme` 속성으로 테마 전환

---

## 템플릿 생명주기

### 1. 정의 (Definition)

개발자가 `ScreenTemplate` 인터페이스를 구현합니다.

```typescript
export const MyTemplate: ScreenTemplate = {
  meta: { /* ... */ },
  layout: { /* ... */ },
  slots: [ /* ... */ ],
  Component: MyTemplateComponent,
};
```

### 2. 등록 (Registration)

템플릿을 `TemplateRegistry`에 등록합니다.

```typescript
import { TemplateRegistry } from '@tekton/ui/templates/registry';
import { MyTemplate } from './my-template';

TemplateRegistry.register(MyTemplate);
```

**등록 시점:**
- 패키지 초기화 시 (예: `packages/ui/src/index.ts`)
- 플러그인 로드 시
- 애플리케이션 부트스트랩 시

### 3. 검색 (Discovery)

사용자가 템플릿을 검색하고 선택합니다.

```typescript
// ID로 검색
const template = TemplateRegistry.get('my-template');

// 카테고리로 검색
const dashboardTemplates = TemplateRegistry.getByCategory('dashboard');

// 전체 조회
const allTemplates = TemplateRegistry.getAll();
```

### 4. 사용 (Usage)

선택한 템플릿을 렌더링합니다.

```typescript
const { Component } = template;

<Component
  slots={{
    header: <MyHeader />,
    content: <MyContent />,
  }}
  className="custom-class"
/>
```

### 5. 업데이트 (Update)

템플릿 변경 시 새 버전을 생성하고 등록합니다.

```typescript
export const MyTemplateV2: ScreenTemplate = {
  meta: {
    id: 'my-template-v2', // 새 ID
    // ...
  },
  // ...
};

TemplateRegistry.register(MyTemplateV2);
```

**버전 관리 전략:**
- ID에 버전 포함 (예: `login-minimal-v2`)
- Breaking Change 시 새 템플릿 생성
- 기존 템플릿은 Deprecated 마킹

---

## 확장 패턴

### 1. 새 템플릿 추가

**단계:**
1. 템플릿 파일 생성: `packages/ui/src/templates/{category}/{name}.tsx`
2. `ScreenTemplate` 인터페이스 구현
3. `TemplateRegistry`에 등록
4. 테스트 작성
5. 문서화

**예시:**
```typescript
// packages/ui/src/templates/dashboard/analytics.tsx
export const AnalyticsDashboardTemplate: ScreenTemplate = {
  meta: {
    id: 'dashboard-analytics',
    name: 'Analytics Dashboard',
    category: 'dashboard',
    description: 'Full-featured analytics dashboard with charts',
    tags: ['dashboard', 'analytics', 'charts'],
    supportedThemes: ['*'],
  },
  layout: {
    type: 'sidebar',
    maxWidth: 'full',
  },
  slots: [
    { id: 'sidebar', name: 'Sidebar', required: true },
    { id: 'header', name: 'Header', required: false },
    { id: 'charts', name: 'Charts Section', required: true },
    { id: 'summary', name: 'Summary Cards', required: false },
  ],
  Component: AnalyticsDashboardComponent,
};
```

### 2. 템플릿 변형 (Variant)

동일 카테고리에서 레이아웃 변형을 제공합니다.

**전략:**
- 기본 템플릿: `login-minimal` (centered, simple)
- 변형 1: `login-split` (split-screen, image)
- 변형 2: `login-full` (full-page background)

**구현:**
```typescript
export const LoginSplitTemplate: ScreenTemplate = {
  meta: {
    id: 'login-split',
    name: 'Split Screen Login',
    category: 'auth',
    description: 'Login form with side image',
    tags: ['auth', 'login', 'split-screen'],
    supportedThemes: ['*'],
  },
  layout: {
    type: 'split', // 변형 포인트
    maxWidth: 'full',
  },
  slots: [
    { id: 'image', name: 'Side Image', required: true }, // 추가 슬롯
    { id: 'branding', name: 'Logo', required: false },
    { id: 'footer', name: 'Footer', required: false },
  ],
  Component: LoginSplitComponent,
};
```

### 3. 슬롯 확장

기존 템플릿에 슬롯을 추가하여 커스터마이즈 포인트를 늘립니다.

**Before:**
```typescript
slots: [
  { id: 'content', name: 'Content', required: true },
]
```

**After:**
```typescript
slots: [
  { id: 'header', name: 'Header', required: false }, // 추가
  { id: 'content', name: 'Content', required: true },
  { id: 'sidebar', name: 'Sidebar', required: false }, // 추가
  { id: 'footer', name: 'Footer', required: false }, // 추가
]
```

**주의사항:**
- Required 슬롯 추가는 Breaking Change
- Optional 슬롯 추가는 Non-Breaking

### 4. 테마별 템플릿

특정 테마에 최적화된 템플릿을 제공합니다.

```typescript
export const LoginLinearTemplate: ScreenTemplate = {
  meta: {
    id: 'login-linear',
    name: 'Linear Style Login',
    category: 'auth',
    description: 'Login optimized for Linear theme',
    tags: ['auth', 'login', 'linear'],
    supportedThemes: ['linear-minimal-v1', 'linear-dark-v1'], // 제한
  },
  tokenBindings: {
    // Linear 테마 특화 토큰 바인딩
    '--login-background': 'var(--tekton-bg-surface-secondary)',
  },
  // ...
};
```

---

## 모범 사례

### 1. 템플릿 설계

**DO:**
- ✅ 명확한 목적을 가진 템플릿 생성
- ✅ 슬롯을 통한 커스터마이즈 제공
- ✅ CSS Variables로 테마 독립성 유지
- ✅ 접근성 고려 (WCAG 2.1 AA)
- ✅ 반응형 레이아웃 구현

**DON'T:**
- ❌ 모든 것을 하나의 템플릿에 넣기
- ❌ 하드코딩된 색상/spacing 사용
- ❌ 불필요한 슬롯 추가
- ❌ 테마 종속적인 구현

### 2. 슬롯 설계

**DO:**
- ✅ 의미 있는 슬롯 ID 사용 (`branding`, `mainContent`)
- ✅ Required/Optional 명확히 구분
- ✅ 슬롯별 기본값 제공 (Optional인 경우)
- ✅ 슬롯 문서화 (목적, 예시)

**DON'T:**
- ❌ 모호한 슬롯 ID (`slot1`, `area`)
- ❌ 모든 슬롯을 Required로 설정
- ❌ 슬롯 용도 미명시

### 3. 레이아웃 설계

**DO:**
- ✅ 표준 레이아웃 타입 사용 (`full`, `centered`, `split`, `sidebar`)
- ✅ CSS Variables로 spacing 정의
- ✅ Breakpoint 고려 (모바일, 태블릿, 데스크톱)
- ✅ Max-width 설정으로 가독성 확보

**DON'T:**
- ❌ 픽셀 단위 하드코딩 (`width: 1200px`)
- ❌ 모바일 미지원 레이아웃
- ❌ 불필요하게 복잡한 레이아웃

### 4. 메타데이터 작성

**DO:**
- ✅ 고유하고 설명적인 ID (`dashboard-analytics-v1`)
- ✅ 명확한 카테고리 분류
- ✅ 검색 가능한 태그 추가
- ✅ 간결하고 정확한 설명

**DON'T:**
- ❌ 모호한 ID (`template1`)
- ❌ 잘못된 카테고리 분류
- ❌ 불필요한 태그 남발
- ❌ 장황한 설명

### 5. 테스트 작성

**DO:**
- ✅ 모든 슬롯 렌더링 테스트
- ✅ Required 슬롯 누락 시 에러 테스트
- ✅ CSS Variables 적용 확인
- ✅ 접근성 테스트 (vitest-axe)
- ✅ 반응형 레이아웃 테스트

**DON'T:**
- ❌ 테스트 없이 템플릿 추가
- ❌ Happy Path만 테스트
- ❌ 접근성 테스트 생략

---

## 아키텍처 결정 기록 (ADR)

### ADR-001: 슬롯 기반 조합 패턴 채택

**Context:**
템플릿 커스터마이즈 방법을 결정해야 함.

**Options:**
1. Props 기반 커스터마이즈
2. 슬롯 기반 조합
3. Render Props 패턴

**Decision:**
슬롯 기반 조합 패턴 채택.

**Rationale:**
- 명시적 커스터마이즈 포인트 정의
- 타입 안전성 확보
- 메타데이터로 슬롯 문서화 가능

---

### ADR-002: CSS Variables 기반 테마 시스템

**Context:**
테마 적용 방법을 결정해야 함.

**Options:**
1. CSS-in-JS (Emotion, Styled-components)
2. CSS Variables
3. Tailwind Variants

**Decision:**
CSS Variables 기반.

**Rationale:**
- 런타임 테마 전환 지원
- 성능 우수 (빌드 타임 처리)
- `@tekton/tokens` 패키지와 일관성

---

### ADR-003: 중앙화된 TemplateRegistry

**Context:**
템플릿 관리 방법을 결정해야 함.

**Options:**
1. 파일 시스템 기반 자동 검색
2. 중앙화된 레지스트리
3. 각 템플릿 독립적 export

**Decision:**
중앙화된 레지스트리.

**Rationale:**
- 런타임 검색 및 필터링 가능
- 템플릿 메타데이터 활용
- 플러그인 시스템과 통합 용이

---

## 향후 계획

### Phase 4

- TAG 주석 추가로 요구사항 추적성 확보
- 타입 시스템 정밀화 (제네릭 타입)
- 추가 템플릿 구현 (Settings, Profile, Analytics)

### Phase 5

- Storybook 기반 템플릿 갤러리
- 템플릿 프리뷰 이미지 생성
- AI 기반 템플릿 추천 시스템
- 사용자 커스텀 템플릿 공유 플랫폼

---

## 참조 문서

- [SPEC-UI-001](../../specs/SPEC-UI-001/spec.md) - 전체 스펙
- [Templates API Reference](../../../packages/ui/docs/templates-api.md) - API 문서
- [Template Testing Guide](../testing/template-testing.md) - 테스트 가이드
- [Design System Principles](./design-system-principles.md) - 디자인 원칙

---

**문서 버전**: 1.0.0
**작성일**: 2026-01-31
**작성자**: soo-kate-yeon
**다음 검토일**: Phase 4 완료 시점
