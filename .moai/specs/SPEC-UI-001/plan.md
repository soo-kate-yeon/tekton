---
id: SPEC-UI-001
version: "1.0.0"
status: planned
created: "2026-01-31"
updated: "2026-01-31"
author: soo-kate-yeon
tags: [TAG-001, TAG-002, TAG-003, TAG-004, TAG-005]
---

# SPEC-UI-001: Implementation Plan

## 1. 개요

shadcn-ui Fork & Token Integration을 위한 7일간의 구현 계획입니다.

---

## 2. 마일스톤 (우선순위 기반)

### Phase 1: Project Structure Setup (Day 1-2)

**Primary Goal: 프로젝트 구조 정리 및 shadcn-ui 기반 설정**

| Task | 설명 | 우선순위 | 의존성 |
|------|------|----------|--------|
| T1.1 | 기존 @tekton/ui 백업 및 정리 | P0 | - |
| T1.2 | shadcn-ui 컴포넌트 구조 복사 | P0 | T1.1 |
| T1.3 | Tekton Token CSS Variable 매핑 파일 생성 | P0 | - |
| T1.4 | package.json 의존성 업데이트 | P0 | T1.2 |
| T1.5 | tsconfig.json 및 빌드 설정 | P0 | T1.4 |
| T1.6 | globals.css 및 테마 로더 구조 | P0 | T1.3 |
| T1.7 | linear-minimal-v1.json 테마 연동 | P0 | T1.6 |

**Day 1 산출물:**
- 정리된 `packages/ui/` 디렉토리 구조
- `src/lib/tokens.ts` - Token 매핑
- `src/lib/theme-loader.ts` - 기존 테마 JSON → CSS Variable 변환

**Day 2 산출물:**
- shadcn-ui 유틸리티 (`cn()`, cva 설정)
- 빌드 및 타입 체크 통과

---

### Phase 2: Core Component Tokenization (Day 3-4)

**Primary Goal: 핵심 25개 컴포넌트 토큰화**

#### Day 3: Tier 1 컴포넌트 (15개)

| Task | 컴포넌트 | 우선순위 | Radix 의존성 |
|------|----------|----------|--------------|
| T2.1 | Button | P0 | @radix-ui/react-slot |
| T2.2 | Input | P0 | - |
| T2.3 | Label | P0 | @radix-ui/react-label |
| T2.4 | Card (Header, Content, Footer) | P0 | - |
| T2.5 | Badge | P0 | - |
| T2.6 | Avatar | P0 | @radix-ui/react-avatar |
| T2.7 | Separator | P0 | @radix-ui/react-separator |
| T2.8 | Form (Field, Control, Message) | P0 | react-hook-form |
| T2.9 | Select (Trigger, Content, Item) | P0 | @radix-ui/react-select |
| T2.10 | Checkbox | P0 | @radix-ui/react-checkbox |
| T2.11 | RadioGroup | P0 | @radix-ui/react-radio-group |
| T2.12 | Switch | P0 | @radix-ui/react-switch |
| T2.13 | Textarea | P0 | - |
| T2.14 | Skeleton | P0 | - |
| T2.15 | ScrollArea | P0 | @radix-ui/react-scroll-area |

**Day 3 산출물:**
- 15개 기본 컴포넌트 토큰화 완료
- 각 컴포넌트 기본 테스트

#### Day 4: Tier 2 컴포넌트 (10개)

| Task | 컴포넌트 | 우선순위 | Radix 의존성 |
|------|----------|----------|--------------|
| T2.16 | Dialog (Trigger, Content, Close) | P0 | @radix-ui/react-dialog |
| T2.17 | DropdownMenu (Trigger, Content, Item) | P0 | @radix-ui/react-dropdown-menu |
| T2.18 | Table (Header, Body, Row, Cell) | P0 | - |
| T2.19 | Tabs (List, Trigger, Content) | P0 | @radix-ui/react-tabs |
| T2.20 | Toast (Provider, Viewport, Action) | P0 | @radix-ui/react-toast |
| T2.21 | Tooltip | P1 | @radix-ui/react-tooltip |
| T2.22 | Popover | P1 | @radix-ui/react-popover |
| T2.23 | Sheet | P1 | @radix-ui/react-dialog |
| T2.24 | AlertDialog | P1 | @radix-ui/react-alert-dialog |
| T2.25 | Progress | P1 | @radix-ui/react-progress |

**Day 4 산출물:**
- 10개 복합 컴포넌트 토큰화 완료
- linear-minimal-v1 테마 연동 검증
- 전체 컴포넌트 테스트 85% 커버리지

---

### Phase 3: Screen Template System Foundation (Day 5-7)

**Primary Goal: ScreenTemplate 시스템 및 파일럿 템플릿**

#### Day 5: 화면 구성 컴포넌트 + 타입 시스템

| Task | 설명 | 우선순위 |
|------|------|----------|
| T3.1 | Sidebar 컴포넌트 | P0 |
| T3.2 | NavigationMenu 컴포넌트 | P1 |
| T3.3 | Breadcrumb 컴포넌트 | P1 |
| T3.4 | ScreenTemplate 타입 정의 | P0 |
| T3.5 | TemplateRegistry 구현 | P0 |

#### Day 6: 파일럿 템플릿

| Task | 설명 | 우선순위 |
|------|------|----------|
| T3.6 | LoginTemplate 구현 | P0 |
| T3.7 | DashboardTemplate 구현 | P0 |
| T3.8 | 템플릿 Storybook 문서화 | P1 |

#### Day 7: 통합 및 검증

| Task | 설명 | 우선순위 |
|------|------|----------|
| T3.9 | playground-web 연동 테스트 | P0 |
| T3.10 | 테마 스위칭 검증 | P0 |
| T3.11 | 최종 문서화 | P0 |
| T3.12 | PR 준비 및 리뷰 | P0 |

---

## 3. 기술적 접근 방식

### 3.1 shadcn-ui 컴포넌트 복사 전략

```bash
# shadcn-ui 최신 버전 참조
# https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui

# 복사 대상 (30개 파일)
components/
├── button.tsx      # 직접 복사 후 토큰화
├── input.tsx       # 직접 복사 후 토큰화
├── card.tsx        # 직접 복사 후 토큰화
├── dialog.tsx      # 직접 복사 후 토큰화
└── ...
```

### 3.2 Token 매핑 전략

**Before (shadcn-ui 원본):**
```typescript
const buttonVariants = cva(
  "bg-primary text-primary-foreground hover:bg-primary/90",
  // ...
)
```

**After (Tekton 토큰화):**
```typescript
const buttonVariants = cva(
  "bg-[var(--tekton-bg-primary)] text-[var(--tekton-bg-primary-foreground)] hover:bg-[var(--tekton-bg-primary)]/90",
  // ...
)
```

### 3.3 의존성 관리

```json
{
  "dependencies": {
    // Radix UI Primitives (shadcn-ui 사용 버전)
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-tooltip": "^1.0.7",

    // Utilities
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",

    // Form
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.2",
    "zod": "^3.22.4"
  }
}
```

---

## 4. 리스크 및 대응 방안

| 리스크 | 영향도 | 발생 확률 | 대응 방안 |
|--------|--------|----------|----------|
| shadcn-ui 버전 호환성 이슈 | 높음 | 중간 | 특정 커밋 고정, 점진적 업데이트 |
| Token CSS Variable 성능 | 중간 | 낮음 | 빌드 타임 최적화, CSS Cascade Layers |
| 기존 playground-web 호환성 | 높음 | 중간 | 병렬 컴포넌트 유지, 점진적 마이그레이션 |
| Tailwind 4.0 breaking changes | 중간 | 중간 | 3.4 fallback 준비, 문서화 |
| 테스트 커버리지 미달 | 중간 | 낮음 | Day별 검증 포인트 설정 |

---

## 5. 성공 기준

### Phase 1 완료 기준 (Day 2 종료)
- [ ] `packages/ui/` 구조 정리 완료
- [ ] `tsc --noEmit` 통과
- [ ] Token 매핑 파일 생성
- [ ] linear-minimal-v1.json 테마 로더 연동

### Phase 2 완료 기준 (Day 4 종료)
- [ ] 25개 컴포넌트 토큰화 완료
- [ ] 모든 컴포넌트 TypeScript 오류 0개
- [ ] 테스트 커버리지 85% 이상
- [ ] linear-minimal-v1 테마 적용 검증

### Phase 3 완료 기준 (Day 7 종료)
- [ ] ScreenTemplate 타입 시스템 구현
- [ ] Login, Dashboard 템플릿 구현
- [ ] playground-web 연동 테스트 통과
- [ ] 테마 스위칭 동작 검증
- [ ] PR 생성 및 리뷰 준비

---

## 6. 다음 단계 (Week 2 미리보기)

SPEC-UI-001 완료 후:
- SPEC-UI-002: P0 Screen Templates (Login, Signup, Dashboard Overview, Settings)
- SPEC-UI-003: P1 Screen Templates (User List, User Detail, Analytics)
- Theme Marketplace 프로토타입 연동

---

## 7. 참조

- [SPEC-UI-001/spec.md](./spec.md) - 요구사항 명세
- [SPEC-UI-001/acceptance.md](./acceptance.md) - 수락 기준
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [Radix UI Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction)
