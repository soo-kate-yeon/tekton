---
id: SPEC-PHASEC-003
version: "1.0.0"
status: "draft"
created: "2026-01-13"
updated: "2026-01-13"
author: "asleep"
priority: "CRITICAL"
---

## HISTORY

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-01-13 | 1.0.0 | asleep | Phase C 초기 SPEC 생성 - 4계층 Screen Contract 아키텍처 |

# SPEC-PHASEC-003: Create Screen Workflow

## 개요

Phase C는 Tekton 디자인 시스템의 핵심 목표인 **"AI 에이전트가 화면을 자율적으로 생성"**할 수 있는 워크플로우를 구현합니다. 단순한 템플릿 복사가 아닌, **"Screen Contract(화면 규약)"** 기반으로 환경, 골격, 역할, 합성의 4계층을 통해 **적응형 화면 생성**을 지원합니다.

### Phase B 의존성 검증

Phase C는 Phase B의 완료된 인프라를 기반으로 합니다:

- ✅ **B1: Monorepo 구조** - `@tekton/preset`, `@tekton/token-generator`, `@tekton/contracts`
- ✅ **B2: CLI 도구** - Framework/Tailwind/shadcn 감지, Token 생성
- ✅ **B3: VS Code Extension** - Command Palette 통합
- ✅ **B4: 템플릿 시스템** - `page.tsx.template`, `layout.tsx.template`

---

## 핵심 아키텍처: 4계층 Screen Contract

```
┌─────────────────────────────────────────────────────────────────┐
│                     Screen Contract                             │
├─────────────────────────────────────────────────────────────────┤
│  Layer 1: Environment (환경 계층)                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Desktop   │  │   Mobile    │  │   Tablet    │              │
│  │  (12-col)   │  │   (4-col)   │  │   (8-col)   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│  Layer 2: Skeleton (골격 계층)                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Layout Preset: FullScreen | WithSidebar | WithHeader   │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────────────────────────┐│    │
│  │  │ Header? │ │Sidebar? │ │         Content             ││    │
│  │  └─────────┘ └─────────┘ └─────────────────────────────┘│    │
│  │  ┌─────────────────────────────────────────────────────┐│    │
│  │  │                     Footer?                         ││    │
│  │  └─────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────┤
│  Layer 3: Intent (역할 계층)                                     │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐        │
│  │ DataList  │ │   Form    │ │ Dashboard │ │  Detail   │        │
│  │ (Table,   │ │ (Input,   │ │ (Card,    │ │ (Section, │        │
│  │  List)    │ │  Select)  │ │  Chart)   │ │  Media)   │        │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘        │
├─────────────────────────────────────────────────────────────────┤
│  Layer 4: Composition (합성 계층)                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Component Assembly + Token Application                 │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │    │
│  │  │ Button  │ │  Card   │ │  Input  │ │  Table  │ ...    │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘        │    │
│  │         ↓ Token Injection (Color, Spacing, Typography)  │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## EARS 요구사항 (Requirements)

### 1. Ubiquitous Requirements (항상 적용되는 요구사항)

**R-U-001: 4계층 Screen Contract 아키텍처**
- 시스템은 **항상** Environment, Skeleton, Intent, Composition 4계층 아키텍처를 따라야 한다
- WHY: 일관된 화면 생성 프로세스 보장
- IMPACT: 아키텍처 준수 누락 시 에이전트 혼란 및 잘못된 화면 생성

**R-U-002: TypeScript + Zod 기반 스키마 검증**
- 시스템은 **항상** TypeScript enum 정의 및 Zod 스키마 검증을 사용해야 한다
- WHY: 타입 안정성 및 런타임 검증 보장
- IMPACT: 검증 누락 시 잘못된 설정으로 인한 화면 생성 실패

**R-U-003: WCAG 2.1 AA 준수 토큰 시스템**
- 시스템은 **항상** 자동 생성된 토큰이 WCAG 2.1 AA 색상 대비 기준을 만족해야 한다
- WHY: 접근성 표준 준수
- IMPACT: 준수 실패 시 법적 및 사용성 문제 발생

### 2. Event-Driven Requirements (이벤트 기반 요구사항)

**R-E-001: CLI 명령어 실행 시 대화형 프롬프트 표시**
- **WHEN** 사용자가 `tekton create screen <name>` 명령 실행
- **THEN** 시스템은 Environment 선택 프롬프트를 표시해야 한다
- **THEN** 시스템은 Skeleton preset 선택 프롬프트를 표시해야 한다
- **THEN** 시스템은 Intent 선택 프롬프트를 표시해야 한다
- **THEN** 시스템은 Component 다중 선택 프롬프트를 표시해야 한다
- WHY: 사용자 친화적 화면 생성 워크플로우 제공
- IMPACT: 프롬프트 누락 시 사용자 혼란 및 잘못된 설정 입력

**R-E-002: Non-Interactive 모드 파라미터 파싱**
- **WHEN** 사용자가 `--env`, `--skeleton`, `--intent`, `--components` 플래그 포함하여 실행
- **THEN** 시스템은 프롬프트 표시 없이 즉시 화면 생성을 시작해야 한다
- WHY: CI/CD 및 자동화 스크립트 지원
- IMPACT: Non-interactive 모드 미지원 시 자동화 불가

**R-E-003: 화면 생성 완료 시 파일 생성 및 확인 메시지**
- **WHEN** 화면 생성 프로세스 완료
- **THEN** 시스템은 `src/screens/<name>/` 디렉토리를 생성해야 한다
- **THEN** 시스템은 `page.tsx`, `layout.tsx`, `components/index.ts` 파일을 생성해야 한다
- **THEN** 시스템은 생성 완료 메시지 및 파일 경로를 표시해야 한다
- WHY: 사용자에게 생성 결과 확인 제공
- IMPACT: 메시지 누락 시 사용자가 생성 여부 확인 불가

### 3. State-Driven Requirements (상태 기반 요구사항)

**R-S-001: Mobile 환경 감지 시 4-column 그리드 적용**
- **IF** Environment가 "mobile"로 설정된 경우
- **THEN** 시스템은 4-column 그리드 시스템(gutter: 12px, margin: 16px)을 적용해야 한다
- **THEN** 시스템은 touch-first 인터랙션 모델을 적용해야 한다
- **THEN** 시스템은 bottom-tabs 네비게이션 패턴을 적용해야 한다
- WHY: 모바일 환경 최적화
- IMPACT: 모바일 환경에서 데스크톱 그리드 적용 시 레이아웃 깨짐

**R-S-002: Desktop 환경 감지 시 12-column 그리드 적용**
- **IF** Environment가 "web" 또는 "responsive"로 설정된 경우
- **THEN** 시스템은 12-column 그리드 시스템(gutter: 24px, margin: 64px)을 적용해야 한다
- **THEN** 시스템은 mouse-first 인터랙션 모델을 적용해야 한다
- **THEN** 시스템은 sidebar 네비게이션 패턴을 적용해야 한다
- WHY: 데스크톱 환경 최적화
- IMPACT: 데스크톱 환경에서 모바일 그리드 적용 시 공간 낭비

**R-S-003: React Native 프로젝트 감지 시 StyleSheet 토큰 생성**
- **IF** `package.json`에 `react-native` 의존성이 존재하는 경우
- **THEN** 시스템은 Tailwind 대신 React Native StyleSheet 기반 토큰을 생성해야 한다
- **THEN** 시스템은 사용자에게 환경 감지 경고 메시지를 표시해야 한다
- WHY: React Native 프레임워크 호환성
- IMPACT: Tailwind 토큰 사용 시 React Native에서 동작 불가

### 4. Optional Requirements (선택적 요구사항)

**R-O-001: AFDS Agent Context 통합 제공**
- **가능하면** 시스템은 `agent-context.json` 파일을 자동 생성해야 한다
- **가능하면** 시스템은 Screen Rules 문서를 에이전트 친화적 Markdown 형식으로 생성해야 한다
- WHY: AI 에이전트 자율 화면 생성 지원
- IMPACT: 미제공 시 에이전트가 규칙을 이해하지 못하고 잘못된 화면 생성

**R-O-002: VS Code Extension 통합 제공**
- **가능하면** 시스템은 VS Code Command Palette에서 "Create Screen" 명령을 제공해야 한다
- **가능하면** 시스템은 Extension이 `agent-context.json`을 참조하도록 구성해야 한다
- WHY: 개발자 경험 향상
- IMPACT: 미제공 시 CLI만 사용 가능하며 IDE 통합 부재

### 5. Unwanted Behaviors (제외 요구사항)

**R-N-001: Intent 미지정 시 Custom Intent로 fallback 금지**
- **IF** 사용자가 Intent 선택 프롬프트에서 아무것도 선택하지 않은 경우
- **THE SYSTEM SHALL NOT** 자동으로 "Custom" Intent로 fallback해서는 안 된다
- **THE SYSTEM SHALL** Intent 선택 프롬프트를 재표시해야 한다
- WHY: 명시적 Intent 선택 강제로 잘못된 화면 생성 방지
- IMPACT: Fallback 허용 시 의도하지 않은 화면 구조 생성

**R-N-002: Contract 검증 실패 시 코드 저장 허용 금지**
- **IF** `@tekton/contracts` 검증에서 위반 감지
- **THE SYSTEM SHALL NOT** 위반된 코드를 파일 시스템에 저장해서는 안 된다
- **THE SYSTEM SHALL** 사용자에게 fixSuggestion을 제안해야 한다
- WHY: 컴포넌트 조합 규칙 준수 강제
- IMPACT: 검증 실패 코드 저장 시 런타임 오류 및 접근성 문제 발생

**R-N-003: 중복 화면 이름 자동 덮어쓰기 금지**
- **IF** `src/screens/<name>/` 디렉토리가 이미 존재하는 경우
- **THE SYSTEM SHALL NOT** 자동으로 기존 디렉토리를 덮어써서는 안 된다
- **THE SYSTEM SHALL** 사용자에게 선택지(덮어쓰기/취소/다른 이름)를 제공해야 한다
- WHY: 의도하지 않은 코드 손실 방지
- IMPACT: 자동 덮어쓰기 시 기존 작업 손실

---

## 계층별 상세 설계

### Layer 1: Environment (환경 계층)

#### Environment Enum 정의

```typescript
export enum Environment {
  Web = 'web',               // Desktop-first web application
  Mobile = 'mobile',         // Mobile app (React Native, Capacitor)
  Tablet = 'tablet',         // Tablet-optimized layout
  Responsive = 'responsive', // Multi-breakpoint (default)
  TV = 'tv',                 // TV/Large screen (10-foot UI)
  Kiosk = 'kiosk',           // Kiosk/Fixed resolution
}
```

#### Grid System 정의

| Environment | Columns | Gutter | Margin | Breakpoint |
|-------------|---------|--------|--------|------------|
| Desktop     | 12      | 24px   | 64px   | ≥1280px    |
| Tablet      | 8       | 16px   | 32px   | 768-1279px |
| Mobile      | 4       | 12px   | 16px   | <768px     |
| TV          | 16      | 48px   | 96px   | ≥1920px    |
| Kiosk       | 6       | 32px   | 48px   | fixed-1080p|

#### Layout Behavior 스키마

```typescript
export const layoutBehaviorSchema = z.object({
  grid: z.object({
    columns: z.number(),
    gutter: z.number(),
    margin: z.number(),
  }),
  navigation: z.enum(['sidebar', 'top-nav', 'bottom-tabs', 'left-rail', 'hamburger']),
  cardLayout: z.enum(['grid', 'stack', 'horizontal-scroll', 'masonry']),
  dataDensity: z.enum(['minimal', 'low', 'medium', 'high']),
  interactionModel: z.enum(['mouse-first', 'touch-first', 'remote-first', 'keyboard-first']),
  focusManagement: z.enum(['default', 'spatial', 'sequential']).optional(),
});
```

### Layer 2: Skeleton (골격 계층)

#### Skeleton Preset 정의

```typescript
export enum SkeletonPreset {
  FullScreen = 'full-screen',       // Content only, no chrome
  WithHeader = 'with-header',       // Header + Content
  WithSidebar = 'with-sidebar',     // Sidebar + Content
  WithHeaderSidebar = 'with-header-sidebar', // Header + Sidebar + Content
  WithHeaderFooter = 'with-header-footer',   // Header + Content + Footer
  Dashboard = 'dashboard',          // Header + Sidebar + Content + Footer (optional)
}
```

#### Skeleton Contract 스키마

```typescript
export const skeletonContractSchema = z.object({
  preset: z.nativeEnum(SkeletonPreset),

  header: z.object({
    enabled: z.boolean(),
    sticky: z.boolean().optional().default(true),
    height: z.enum(['sm', 'md', 'lg']).optional().default('md'),
  }).optional(),

  sidebar: z.object({
    enabled: z.boolean(),
    position: z.enum(['left', 'right']).optional().default('left'),
    width: z.enum(['sm', 'md', 'lg']).optional().default('md'),
    collapsible: z.boolean().optional().default(true),
  }).optional(),

  footer: z.object({
    enabled: z.boolean(),
    sticky: z.boolean().optional().default(false),
  }).optional(),

  content: z.object({
    maxWidth: z.enum(['sm', 'md', 'lg', 'xl', 'full']).optional().default('lg'),
    padding: z.enum(['none', 'sm', 'md', 'lg']).optional().default('md'),
  }),
});
```

### Layer 3: Intent (역할 계층)

#### Intent Enum 정의

```typescript
export enum ScreenIntent {
  // Data Display
  DataList = 'data-list',       // List or Table of items
  DataDetail = 'data-detail',   // Single item detail view
  Dashboard = 'dashboard',      // Overview with multiple widgets

  // User Input
  Form = 'form',                // Data entry/edit form
  Wizard = 'wizard',            // Multi-step form

  // Authentication
  Auth = 'auth',                // Login, Signup, Password Reset

  // Utility
  Settings = 'settings',        // Configuration/preferences
  EmptyState = 'empty-state',   // No data placeholder
  Error = 'error',              // Error page (404, 500)

  // Custom
  Custom = 'custom',            // User-defined composition
}
```

#### Intent → Compound Pattern 매핑

| Intent | Primary Components | Layout Pattern | Recommended Actions |
|--------|-------------------|----------------|---------------------|
| DataList | Table, List, Card Grid | Vertical scroll, pagination | Create, Filter, Sort |
| DataDetail | Card, Section, Media | Single column, tabs | Edit, Delete, Back |
| Dashboard | Card, Chart, Stat | Grid, masonry | Refresh, Filter |
| Form | Input, Select, Textarea | Single column, sections | Submit, Cancel, Reset |
| Wizard | Step, Progress, Form | Single column, navigation | Next, Back, Submit |
| Auth | Input, Button, Link | Centered, minimal | Submit, Forgot Password |
| Settings | Toggle, Select, Section | Single column, grouped | Save, Reset |
| EmptyState | Illustration, Text, Button | Centered | Primary CTA |
| Error | Illustration, Text, Button | Centered | Go Home, Retry |

### Layer 4: Composition (합성 계층)

#### Composition Pipeline

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Screen Config  │ →  │  Template       │ →  │  Token          │
│  (Env, Skel,    │    │  Selection      │    │  Injection      │
│   Intent)       │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ↓                      ↓                      ↓
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Component      │ →  │  Contract       │ →  │  Code           │
│  Assembly       │    │  Validation     │    │  Generation     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## Extended Token System (확장 토큰 시스템)

### Token Preset 스키마

```typescript
export const tokenPresetSchema = z.object({
  // 브랜드 계층 (1~4단계, 확장 가능)
  brand: z.object({
    primary: oklchColorSchema,
    secondary: oklchColorSchema.optional(),
    tertiary: oklchColorSchema.optional(),
    quaternary: oklchColorSchema.optional(),
  }),

  // Semantic Colors (고정, WCAG 자동 검증)
  semantic: z.object({
    success: oklchColorSchema,
    warning: oklchColorSchema,
    error: oklchColorSchema,
    info: oklchColorSchema,
  }),

  // Data Visualization (차트/그래프용)
  dataViz: z.object({
    categorical: z.array(oklchColorSchema).min(6).max(12), // 범주형 데이터
    sequential: z.object({                                  // 연속형 데이터
      start: oklchColorSchema,
      end: oklchColorSchema,
      steps: z.number().min(3).max(9),
    }).optional(),
    diverging: z.object({                                   // 발산형 데이터
      negative: oklchColorSchema,
      neutral: oklchColorSchema,
      positive: oklchColorSchema,
    }).optional(),
  }).optional(),

  // Neutral Scale (Gray 10단계)
  neutral: z.object({
    scale: z.array(oklchColorSchema).length(10), // 50~950 10단계
  }),

  // 밀도/간격/둥글기
  spacing: z.enum(['compact', 'comfortable', 'loose']),
  radius: z.enum(['sharp', 'rounded', 'pill']),
});
```

---

## CLI 명령어 설계

### `tekton create screen <name>` 기본 플로우

```bash
$ tekton create screen UserProfile

? Target environment: (Use arrow keys)
❯ Responsive (recommended)
  Desktop only
  Mobile only

? Screen skeleton: (Use arrow keys)
❯ With Header
  With Sidebar
  Dashboard (Header + Sidebar)
  Full Screen

? Screen intent: (Use arrow keys)
❯ Data Detail (single item view)
  Data List (table/list)
  Form (data entry)
  Dashboard (overview)

? Include components: (select multiple)
◉ Card
◉ Section
◉ Button
◯ Table
◯ Chart

✔ Creating UserProfile screen...

Created:
  src/screens/user-profile/
  ├── page.tsx
  ├── layout.tsx
  ├── components/
  │   └── index.ts
  └── index.ts
```

### Non-Interactive 모드

```bash
$ tekton create screen UserProfile \
  --env responsive \
  --skeleton with-header \
  --intent data-detail \
  --components card,section,button
```

---

## AFDS 통합: Agent Design Context

### Agent Context Export 구조

```typescript
// agent-context.json (자동 생성)
{
  "version": "1.0.0",
  "project": {
    "environment": "responsive",
    "framework": "Next.js",
    "designSystem": "@tekton/default"
  },
  "screenRules": {
    "environments": [...],
    "skeletons": [...],
    "intents": [...],
    "componentContracts": [...]
  },
  "tokens": {
    "colors": {...},
    "spacing": {...},
    "typography": {...}
  }
}
```

### 에이전트 활용 시나리오

1. **에이전트가 ADC 로드**: `tekton` 패키지 설치 시 자동 생성된 `agent-context.json` 참조
2. **화면 생성 요청 해석**: "유저 프로필 화면 만들어줘" → `Intent: DataDetail` 판단
3. **규칙 기반 코드 생성**: Intent에 맞는 Compound Pattern + 토큰 적용
4. **Contract 검증**: 생성된 코드를 `@tekton/contracts`로 검증
5. **자기 교정**: 위반 시 `fixSuggestion` 참조하여 자동 수정

---

## 확장 전략 요약

| 계층 | 확장 방법 | 기존 시스템 연동 |
|------|----------|-----------------|
| Environment | Enum 추가 + Grid 정의 | `tekton.config.json` |
| Skeleton | Preset 추가 + 기본 구성 | `@tekton/preset` |
| Intent | Enum 추가 + Pattern 매핑 | Domain Packs (SaaS, E-commerce) |
| Composition | Component 추가 (자동) | `@tekton/contracts`, `@tekton/token-generator` |

---

## 기술 제약사항 (Constraints)

### 필수 라이브러리 버전

- TypeScript: `^5.3.0`
- Zod: `^3.23.8`
- commander: `^12.x`
- enquirer: `^2.x`
- fs-extra: `^11.x`
- chalk: `^5.x`
- tailwindcss: `^3.x`

### 아키텍처 제약사항

- 4계층 분리 원칙 준수 (Environment → Skeleton → Intent → Composition)
- TypeScript enum + Zod 스키마 조합 사용 (런타임 검증 보장)
- WCAG 2.1 AA 색상 대비 기준 준수 (자동 검증)
- Contract 검증 필수화 (검증 실패 시 코드 저장 차단)

### 성능 제약사항

- 화면 생성 명령 실행 시간: < 3초
- Contract 검증 실행 시간: < 1초
- 토큰 주입 실행 시간: < 500ms

---

## 위험 요소 및 완화 전략

### 높은 위험

**R-001: Intent 분류의 모호성**
- 영향도: HIGH
- 완화 전략: Intent 조합 허용 (`primary` + `secondary`), `Custom` Intent fallback 제공

**R-002: 에이전트의 규칙 무시**
- 영향도: HIGH
- 완화 전략: Contract 검증 필수화, 검증 실패 시 코드 저장 차단 옵션

### 중간 위험

**R-003: 템플릿 경직성**
- 영향도: MEDIUM
- 완화 전략: Override 시스템 구현 (Skeleton Preset 선택 후 개별 속성 수정 허용)

---

## 다음 단계 (Phase D 준비)

Phase C 완료 후:
1. **Phase D: Figma 동기화** - Figma Token 동기화 인터페이스 설계
2. **AFDS 마켓플레이스 출시** - Domain Pack 판매 플랫폼 구축

---

## 참고 문서

- Phase A 완료 보고서: `.moai/docs/phase-a-completion.md`
- Phase B 완료 보고서: `.moai/specs/SPEC-PHASEB-002/M4-completion-report.md`
- AFDS 전략 문서: `AFDS_PLAN.md` (Artifacts)
- 기존 SPEC 문서: `.moai/specs/SPEC-PHASEC-003/spec-antigravity.md`
