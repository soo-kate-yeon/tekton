---
id: SPEC-UI-001
version: "1.1.0"
status: in_progress
created: "2026-01-31"
updated: "2026-01-31"
author: soo-kate-yeon
priority: high
lifecycle: spec-anchored
---

## HISTORY

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 1.1.0 | 2026-01-31 | soo-kate-yeon | Phase 3 완료 - 템플릿 시스템 구현 및 품질 검증 |
| 1.0.0 | 2026-01-31 | soo-kate-yeon | 초안 작성 |

---

# SPEC-UI-001: shadcn-ui Fork & Token Integration

## 0. 개요 요약

### 목적

shadcn-ui 컴포넌트를 Tekton Design System으로 Fork하여 `@tekton/tokens`와 완전히 통합된 UI 라이브러리를 구축합니다. 이는 Theme Marketplace의 기반이 되는 핵심 인프라입니다.

### 범위

- Week 1 (7일): shadcn-ui Fork, Token 통합, Screen Template 시스템 기초
- 약 30개 shadcn-ui 컴포넌트를 `@tekton/ui`로 마이그레이션
- Tekton CSS Variable (`--tekton-*`) 기반 스타일링
- Linear Minimal 테마 적용 검증

### 핵심 결과물

| 결과물 | 설명 |
|--------|------|
| `@tekton/ui` 리팩토링 | shadcn-ui 기반 30개 컴포넌트 |
| Token CSS Variables | `--tekton-*` 변수 매핑 (linear-minimal-v1 테마 연동) |
| ScreenTemplate 타입 | 화면 템플릿 타입 시스템 |
| Pilot Templates | Login, Dashboard 템플릿 2개 |

### 의존성

- `@tekton/tokens` - 토큰 타입 정의 (완료)
- `linear-minimal-v1.json` - 기존 테마 파일 활용 (`.moai/themes/generated/`)
- SPEC-STYLED-001 - CSS Variable 전략 (완료)
- SPEC-THEME-BIND-001 - 테마 바인딩 (참조)

---

## 1. Environment (환경)

```
Current System:
  - @tekton/ui: Radix UI 기반 커스텀 컴포넌트 (14 primitives + 6 components)
  - @tekton/tokens: TokenReference 타입 정의 (`var(--tekton-${string})`)
  - 현재 컴포넌트들은 Tailwind 클래스 하드코딩
  - shadcn-ui 패턴과 불일치

Technology Stack:
  - React 18/19 (peer dependency)
  - TypeScript 5.7+
  - Tailwind CSS 4.0
  - Radix UI Primitives
  - class-variance-authority (cva)
  - tailwind-merge

Target Architecture:
  - shadcn-ui 컴포넌트 구조 채택
  - Tekton Token CSS Variable 바인딩
  - Theme-aware 컴포넌트
  - ScreenTemplate 기반 화면 조합
```

---

## 2. Assumptions (가정)

| ID | 가정 | 근거 | 검증 방법 |
|----|------|------|----------|
| A-001 | shadcn-ui 컴포넌트 구조가 Tekton에 적합 | 업계 표준, 커뮤니티 검증, Radix 기반 | 컴포넌트 매핑 분석 |
| A-002 | CSS Variable 기반 테마 시스템이 런타임 변경 지원 | CSS Custom Properties 표준 | 테마 스위칭 테스트 |
| A-003 | 기존 @tekton/ui 사용처가 제한적 | playground-web만 사용 | import 분석 |
| A-004 | 30개 컴포넌트로 MVP 12개 화면 구현 가능 | shadcn-ui 문서 분석 | 화면별 컴포넌트 매핑 |
| A-005 | linear-minimal-v1 테마의 토큰이 CSS Variable로 매핑 가능 | 기존 테마 JSON 구조 분석 | 토큰 매핑 검증 |

---

## 3. Requirements (요구사항)

### 3.1 Ubiquitous Requirements (항상 적용)

| ID | 요구사항 | TAG |
|----|----------|-----|
| U-001 | 시스템은 **항상** `@tekton/tokens`의 TokenReference 타입을 준수해야 한다 | [TAG-001] |
| U-002 | 시스템은 **항상** CSS Variable `--tekton-*` 패턴을 사용해야 한다 | [TAG-002] |
| U-003 | 시스템은 **항상** Radix UI Primitives를 기반으로 접근성을 보장해야 한다 | [TAG-003] |
| U-004 | 시스템은 **항상** TypeScript strict mode에서 컴파일되어야 한다 | [TAG-004] |
| U-005 | 시스템은 **항상** React Server Components와 호환되어야 한다 | [TAG-005] |

### 3.2 Event-Driven Requirements (이벤트 기반)

| ID | 요구사항 | TAG |
|----|----------|-----|
| E-001 | **WHEN** 테마가 변경되면 **THEN** 모든 컴포넌트가 새 테마 토큰으로 즉시 반영되어야 한다 | [TAG-006] |
| E-002 | **WHEN** 컴포넌트가 import되면 **THEN** 필요한 CSS Variable만 로드되어야 한다 | [TAG-007] |
| E-003 | **WHEN** ScreenTemplate이 렌더링되면 **THEN** 포함된 컴포넌트들이 토큰 바인딩을 유지해야 한다 | [TAG-008] |
| E-004 | **WHEN** variant prop이 전달되면 **THEN** 해당 variant의 토큰이 적용되어야 한다 | [TAG-009] |

### 3.3 State-Driven Requirements (상태 기반)

| ID | 요구사항 | TAG |
|----|----------|-----|
| S-001 | **IF** 테마가 'linear-minimal-v1'이면 **THEN** 해당 테마의 토큰이 CSS Variable로 적용되어야 한다 | [TAG-010] |
| S-002 | **IF** 컴포넌트가 disabled 상태이면 **THEN** opacity 토큰이 적용되어야 한다 | [TAG-011] |
| S-003 | **IF** 다크 모드가 활성화되면 **THEN** 다크 테마 토큰이 적용되어야 한다 | [TAG-012] |
| S-004 | **IF** ScreenTemplate이 responsive이면 **THEN** breakpoint별 레이아웃이 적용되어야 한다 | [TAG-013] |

### 3.4 Unwanted Behavior (금지 동작)

| ID | 요구사항 | TAG |
|----|----------|-----|
| UW-001 | 시스템은 하드코딩된 색상값(#hex, rgb())을 사용하지 **않아야 한다** | [TAG-014] |
| UW-002 | 시스템은 하드코딩된 spacing 값(px, rem 직접 지정)을 사용하지 **않아야 한다** | [TAG-015] |
| UW-003 | 시스템은 Radix UI 없이 자체 접근성 구현을 하지 **않아야 한다** | [TAG-016] |
| UW-004 | 시스템은 'use client' 없이 클라이언트 기능을 사용하지 **않아야 한다** | [TAG-017] |

### 3.5 Optional Requirements (선택적)

| ID | 요구사항 | TAG |
|----|----------|-----|
| O-001 | **가능하면** Framer Motion 기반 애니메이션 토큰 제공 | [TAG-018] |
| O-002 | **가능하면** Storybook 문서화 제공 | [TAG-019] |
| O-003 | **가능하면** 컴포넌트별 CSS-in-JS 대안 제공 | [TAG-020] |

---

## 4. Technical Specifications (기술 명세)

### 4.1 컴포넌트 목록 (30개)

#### Tier 1: 필수 기본 컴포넌트 (Day 3-4, 15개)

| 컴포넌트 | shadcn-ui 소스 | Radix 의존성 | 우선순위 |
|----------|---------------|--------------|----------|
| Button | button.tsx | @radix-ui/react-slot | P0 |
| Input | input.tsx | - | P0 |
| Label | label.tsx | @radix-ui/react-label | P0 |
| Card | card.tsx | - | P0 |
| Badge | badge.tsx | - | P0 |
| Avatar | avatar.tsx | @radix-ui/react-avatar | P0 |
| Separator | separator.tsx | @radix-ui/react-separator | P0 |
| Form | form.tsx | react-hook-form | P0 |
| Select | select.tsx | @radix-ui/react-select | P0 |
| Checkbox | checkbox.tsx | @radix-ui/react-checkbox | P0 |
| RadioGroup | radio-group.tsx | @radix-ui/react-radio-group | P0 |
| Switch | switch.tsx | @radix-ui/react-switch | P0 |
| Textarea | textarea.tsx | - | P0 |
| Skeleton | skeleton.tsx | - | P0 |
| ScrollArea | scroll-area.tsx | @radix-ui/react-scroll-area | P0 |

#### Tier 2: 복합 컴포넌트 (Day 3-4, 10개)

| 컴포넌트 | shadcn-ui 소스 | Radix 의존성 | 우선순위 |
|----------|---------------|--------------|----------|
| Dialog | dialog.tsx | @radix-ui/react-dialog | P0 |
| DropdownMenu | dropdown-menu.tsx | @radix-ui/react-dropdown-menu | P0 |
| Table | table.tsx | - | P0 |
| Tabs | tabs.tsx | @radix-ui/react-tabs | P0 |
| Toast | toast.tsx, toaster.tsx | @radix-ui/react-toast | P0 |
| Tooltip | tooltip.tsx | @radix-ui/react-tooltip | P1 |
| Popover | popover.tsx | @radix-ui/react-popover | P1 |
| Sheet | sheet.tsx | @radix-ui/react-dialog | P1 |
| AlertDialog | alert-dialog.tsx | @radix-ui/react-alert-dialog | P1 |
| Progress | progress.tsx | @radix-ui/react-progress | P1 |

#### Tier 3: 화면 구성 컴포넌트 (Day 5-7, 5개)

| 컴포넌트 | 설명 | 우선순위 |
|----------|------|----------|
| Sidebar | 대시보드 사이드바 | P0 |
| NavigationMenu | 상단 네비게이션 | P1 |
| Breadcrumb | 경로 표시 | P1 |
| Command | 명령 팔레트 | P2 |
| Calendar | 날짜 선택기 | P2 |

### 4.2 Token CSS Variable 매핑

```typescript
// packages/ui/src/lib/tokens.ts
export const tokenVars = {
  // Background
  bg: {
    background: 'var(--tekton-bg-background)',
    foreground: 'var(--tekton-bg-foreground)',
    card: 'var(--tekton-bg-card)',
    cardForeground: 'var(--tekton-bg-card-foreground)',
    popover: 'var(--tekton-bg-popover)',
    popoverForeground: 'var(--tekton-bg-popover-foreground)',
    primary: 'var(--tekton-bg-primary)',
    primaryForeground: 'var(--tekton-bg-primary-foreground)',
    secondary: 'var(--tekton-bg-secondary)',
    secondaryForeground: 'var(--tekton-bg-secondary-foreground)',
    muted: 'var(--tekton-bg-muted)',
    mutedForeground: 'var(--tekton-bg-muted-foreground)',
    accent: 'var(--tekton-bg-accent)',
    accentForeground: 'var(--tekton-bg-accent-foreground)',
    destructive: 'var(--tekton-bg-destructive)',
    destructiveForeground: 'var(--tekton-bg-destructive-foreground)',
  },

  // Border
  border: {
    default: 'var(--tekton-border-default)',
    input: 'var(--tekton-border-input)',
    ring: 'var(--tekton-border-ring)',
  },

  // Radius
  radius: {
    sm: 'var(--tekton-radius-sm)',
    md: 'var(--tekton-radius-md)',
    lg: 'var(--tekton-radius-lg)',
    xl: 'var(--tekton-radius-xl)',
    full: 'var(--tekton-radius-full)',
  },

  // Spacing (4px base)
  spacing: {
    0: 'var(--tekton-spacing-0)',
    1: 'var(--tekton-spacing-1)',
    2: 'var(--tekton-spacing-2)',
    3: 'var(--tekton-spacing-3)',
    4: 'var(--tekton-spacing-4)',
    5: 'var(--tekton-spacing-5)',
    6: 'var(--tekton-spacing-6)',
    8: 'var(--tekton-spacing-8)',
    10: 'var(--tekton-spacing-10)',
    12: 'var(--tekton-spacing-12)',
    16: 'var(--tekton-spacing-16)',
  },
} as const;
```

### 4.3 컴포넌트 토큰화 예시

```typescript
// packages/ui/src/components/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles using Tekton tokens
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--tekton-radius-md)] text-sm font-medium ring-offset-[var(--tekton-bg-background)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tekton-border-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--tekton-bg-primary)] text-[var(--tekton-bg-primary-foreground)] hover:bg-[var(--tekton-bg-primary)]/90",
        destructive: "bg-[var(--tekton-bg-destructive)] text-[var(--tekton-bg-destructive-foreground)] hover:bg-[var(--tekton-bg-destructive)]/90",
        outline: "border border-[var(--tekton-border-input)] bg-[var(--tekton-bg-background)] hover:bg-[var(--tekton-bg-accent)] hover:text-[var(--tekton-bg-accent-foreground)]",
        secondary: "bg-[var(--tekton-bg-secondary)] text-[var(--tekton-bg-secondary-foreground)] hover:bg-[var(--tekton-bg-secondary)]/80",
        ghost: "hover:bg-[var(--tekton-bg-accent)] hover:text-[var(--tekton-bg-accent-foreground)]",
        link: "text-[var(--tekton-bg-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-[var(--tekton-spacing-4)] py-[var(--tekton-spacing-2)]",
        sm: "h-9 rounded-[var(--tekton-radius-md)] px-[var(--tekton-spacing-3)]",
        lg: "h-11 rounded-[var(--tekton-radius-md)] px-[var(--tekton-spacing-8)]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### 4.4 ScreenTemplate 타입 시스템

```typescript
// packages/ui/src/templates/types.ts
import type { TokenReference } from '@tekton/tokens';

/**
 * ScreenTemplate 메타데이터
 */
export interface ScreenTemplateMeta {
  /** 고유 ID */
  id: string;
  /** 템플릿 이름 */
  name: string;
  /** 카테고리 (auth, dashboard, content, etc.) */
  category: ScreenCategory;
  /** 설명 */
  description: string;
  /** 미리보기 이미지 URL */
  thumbnail?: string;
  /** 태그 */
  tags: string[];
  /** 지원 테마 */
  supportedThemes: string[];
}

/**
 * 화면 카테고리
 */
export type ScreenCategory =
  | 'auth'        // Login, Signup, Forgot Password
  | 'dashboard'   // Overview, Analytics, Reports
  | 'content'     // List, Detail, Gallery
  | 'form'        // Create, Edit, Settings
  | 'navigation'  // Sidebar, Navbar, Breadcrumb
  | 'feedback'    // Error, Empty, Loading
  | 'marketing';  // Landing, Pricing, Features

/**
 * 템플릿 레이아웃 설정
 */
export interface TemplateLayout {
  /** 레이아웃 타입 */
  type: 'full' | 'centered' | 'split' | 'sidebar';
  /** 최대 너비 */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** 패딩 */
  padding?: TokenReference;
  /** 간격 */
  gap?: TokenReference;
}

/**
 * 템플릿 슬롯
 */
export interface TemplateSlot {
  /** 슬롯 ID */
  id: string;
  /** 슬롯 이름 */
  name: string;
  /** 필수 여부 */
  required: boolean;
  /** 허용 컴포넌트 타입 */
  allowedComponents?: string[];
  /** 기본 컴포넌트 */
  defaultComponent?: React.ComponentType;
}

/**
 * ScreenTemplate 정의
 */
export interface ScreenTemplate {
  /** 메타데이터 */
  meta: ScreenTemplateMeta;
  /** 레이아웃 설정 */
  layout: TemplateLayout;
  /** 슬롯 정의 */
  slots: TemplateSlot[];
  /** 토큰 바인딩 */
  tokenBindings?: Record<string, TokenReference>;
  /** React 컴포넌트 */
  Component: React.ComponentType<ScreenTemplateProps>;
}

/**
 * ScreenTemplate 컴포넌트 Props
 */
export interface ScreenTemplateProps {
  /** 슬롯 컨텐츠 */
  slots?: Record<string, React.ReactNode>;
  /** 커스텀 클래스 */
  className?: string;
  /** 테마 오버라이드 */
  theme?: string;
}

/**
 * 템플릿 레지스트리
 */
export interface TemplateRegistry {
  /** 템플릿 등록 */
  register(template: ScreenTemplate): void;
  /** 템플릿 조회 */
  get(id: string): ScreenTemplate | undefined;
  /** 카테고리별 조회 */
  getByCategory(category: ScreenCategory): ScreenTemplate[];
  /** 전체 조회 */
  getAll(): ScreenTemplate[];
}
```

### 4.5 linear-minimal-v1 테마 연동

기존 테마 파일 `.moai/themes/generated/linear-minimal-v1.json`을 활용합니다.

```typescript
// packages/ui/src/lib/theme-loader.ts
import type { ThemeDefinition } from '@tekton/core';

/**
 * linear-minimal-v1 테마 JSON을 CSS Variables로 변환
 */
export function themeToCSS(theme: ThemeDefinition): string {
  const { tokens } = theme;

  return `
:root, [data-theme="${theme.id}"] {
  /* Semantic tokens from linear-minimal-v1.json */
  --tekton-bg-background: ${oklchToCSS(tokens.semantic.background.surface)};
  --tekton-bg-foreground: ${oklchToCSS(tokens.semantic.text.primary)};
  --tekton-bg-primary: ${oklchToCSS(tokens.atomic.color.brand[500])};
  --tekton-bg-primary-foreground: ${oklchToCSS(tokens.atomic.color.white)};

  /* Spacing from theme */
  ${Object.entries(tokens.atomic.spacing)
    .map(([key, val]) => `--tekton-spacing-${key}: ${val};`)
    .join('\n  ')}

  /* Radius from theme */
  ${Object.entries(tokens.atomic.radius)
    .map(([key, val]) => `--tekton-radius-${key}: ${val};`)
    .join('\n  ')}
}
`;
}

/**
 * OKLCH to CSS 변환 (linear-minimal-v1은 OKLCH 사용)
 */
function oklchToCSS(color: { l: number; c: number; h: number }): string {
  return `oklch(${color.l} ${color.c} ${color.h})`;
}
```

**테마 로딩 흐름:**
```
linear-minimal-v1.json → themeToCSS() → CSS Variables → 컴포넌트 적용
```

---

## 5. 파일 구조

```
packages/ui/
├── src/
│   ├── components/        # shadcn-ui 컴포넌트 (30개)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   ├── sidebar.tsx
│   │   └── ... (기타 컴포넌트)
│   ├── templates/         # 화면 템플릿
│   │   ├── types.ts       # ScreenTemplate 타입
│   │   ├── registry.ts    # 템플릿 레지스트리
│   │   ├── auth/
│   │   │   └── login.tsx  # Login 템플릿
│   │   └── dashboard/
│   │       └── overview.tsx # Dashboard 템플릿
│   ├── lib/
│   │   ├── utils.ts       # cn(), 유틸리티
│   │   ├── tokens.ts      # Token CSS Variable 매핑
│   │   └── theme-loader.ts # 기존 테마 JSON → CSS Variable 변환
│   └── index.ts           # 전체 export
├── styles/
│   └── globals.css        # 기본 스타일 (테마는 JSON에서 동적 로드)
├── package.json
└── tsconfig.json

# 테마 파일 위치 (별도 생성 불필요)
.moai/themes/generated/
└── linear-minimal-v1.json  # 기존 테마 활용
```

---

## 6. 품질 기준

| 항목 | 기준 | 측정 방법 |
|------|------|----------|
| TypeScript 컴파일 | 오류 0개 | `tsc --noEmit` |
| 린트 | 경고 0개 | `eslint src` |
| 테스트 커버리지 | 85% 이상 | `vitest --coverage` |
| 번들 크기 | 컴포넌트당 평균 5KB 미만 | `tsup` 빌드 분석 |
| 접근성 | WCAG 2.1 AA | `axe-core` 테스트 |
| 토큰 준수율 | 100% | 하드코딩 감지 스크립트 |

---

## 7. 참조 문서

- [shadcn/ui GitHub](https://github.com/shadcn-ui/ui)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Linear Design System](https://linear.app/docs/design)
- [SPEC-STYLED-001](../SPEC-STYLED-001/spec.md) - CSS Variable 전략
- [SPEC-THEME-BIND-001](../SPEC-THEME-BIND-001/spec.md) - 테마 바인딩

---

## 8. 구현 진행 상황

### Phase 3: 템플릿 시스템 구현 (완료)

#### 8.1 구현 완료 항목

**템플릿 타입 시스템:**
- ✅ `ScreenTemplate` 인터페이스 정의
- ✅ `TemplateRegistry` 구현
- ✅ `TemplateLayout`, `TemplateSlot` 타입 정의
- ✅ 템플릿 메타데이터 구조 확립

**파일럿 템플릿:**
- ✅ `LoginTemplate` 구현 (`packages/ui/src/templates/auth/login.tsx`)
- ✅ `DashboardTemplate` 구현 (`packages/ui/src/templates/dashboard/overview.tsx`)
- ✅ 템플릿 레지스트리 통합

**테스트 및 검증:**
- ✅ 템플릿 컴포넌트 테스트 497개 작성
- ✅ 테스트 통과율 100% (497/497 passed)
- ✅ 테스트 커버리지 91.72%
- ✅ Vitest 기반 단위 테스트 인프라

#### 8.2 품질 메트릭

| 메트릭 | 목표 | 달성 | 상태 |
|--------|------|------|------|
| 테스트 통과율 | 100% | 100% (497/497) | ✅ |
| 테스트 커버리지 | 85% | 91.72% | ✅ |
| TypeScript 컴파일 | 오류 0개 | 23개 타입 오류 | ⚠️ |
| TAG 주석 준수 | 100% | 부분적 누락 | ❌ |
| TRUST 5 스코어 | 80+ | 71/100 | ⚠️ |

#### 8.3 알려진 이슈 및 개선 계획

**Critical Issues:**

1. **TAG 주석 누락 (U-001 ~ O-003)**
   - 현황: EARS 요구사항에 TAG 주석이 코드에 누락됨
   - 영향: 요구사항 추적성 저하
   - 계획: Phase 4에서 모든 TAG 주석 추가
   - 참조: [improvements.md](./improvements.md#tag-comments)

**Warnings:**

2. **TypeScript 타입 정의 오류 (23개)**
   - 현황: 템플릿 Props 타입 정의 불완전
   - 영향: 타입 안정성 저하
   - 계획: Phase 4에서 타입 시스템 정밀화
   - 참조: [improvements.md](./improvements.md#type-errors)

#### 8.4 다음 단계 (Phase 4)

**우선순위:**
1. TAG 주석 추가 (Critical)
2. TypeScript 타입 오류 해결 (Warning)
3. 추가 템플릿 구현 (Enhancement)
4. 문서화 완성 (Documentation)

**참조 문서:**
- [개선 계획 상세](./improvements.md)
- [템플릿 아키텍처](../../docs/frontend/template-architecture.md)
- [템플릿 테스팅 가이드](../../docs/testing/template-testing.md)
