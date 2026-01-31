---
id: SPEC-UI-003
version: "1.0.0"
status: planned
created: "2026-01-31"
updated: "2026-01-31"
author: soo-kate-yeon
priority: high
lifecycle: spec-anchored
dependencies:
  - SPEC-UI-001
  - SPEC-UI-002
---

## HISTORY

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 1.0.0 | 2026-01-31 | soo-kate-yeon | 초안 작성 |

---

# SPEC-UI-003: WebView Studio MVP

## 0. 개요 요약

### 목적

WebView Studio는 Tekton Design System의 웹 기반 테마 커스터마이징 및 미리보기 도구입니다. 사용자가 템플릿 갤러리를 탐색하고, 구매 전 미리보기하며, 구매 후 커스터마이징하고, MCP를 통해 IDE/CLI로 설정을 내보낼 수 있는 통합 플랫폼을 제공합니다.

### 범위

- Week 3 (7일): WebView Studio MVP 구현
- Midjourney 스타일 레이아웃 (왼쪽 사이드바 + 메인 갤러리)
- 템플릿 미리보기 및 편집 기능
- Social 로그인 (Google, GitHub OAuth)
- 라이선스 기반 기능 분기 (Preview Mode vs Edit Mode)
- MCP 기반 테마 설정 내보내기

### 핵심 결과물

| 결과물 | 설명 |
|--------|------|
| Explore 페이지 | Midjourney 스타일 템플릿 갤러리 |
| Account 페이지 | 라이선스 관리 및 좋아요 목록 |
| Editor (Preview Mode) | 라이선스 없이 2개 대표 화면 미리보기 |
| Editor (Edit Mode) | 라이선스 보유 시 12개 전체 화면 + 프리셋 커스터마이징 |
| Auth System | Google/GitHub OAuth 소셜 로그인 |
| MCP Export | 테마 설정 JSON 내보내기 |

### 의존성

- SPEC-UI-001 - shadcn-ui Fork & Token Integration (in_progress)
  - 30개 컴포넌트 제공
  - CSS Variable 기반 테마 시스템
- SPEC-UI-002 - P0 Screen Templates (planned)
  - 12개 화면 템플릿
  - ScreenTemplate 인터페이스
- `@tekton/tokens` - 토큰 타입 정의
- `linear-minimal-v1.json` - 기본 테마 파일

---

## 1. Environment (환경)

```
Current System:
  - @tekton/ui: shadcn-ui 기반 30개 컴포넌트 (SPEC-UI-001)
  - @tekton/core: 12개 ScreenTemplate (SPEC-UI-002)
  - CSS Variables: --tekton-* 패턴 기반 테마 시스템
  - 기존 WebView Studio: 없음 (신규 구축)

Technology Stack:
  - Next.js 15 App Router
  - React 19
  - TypeScript 5.7+
  - Tailwind CSS 4.0
  - CSS Variables (실시간 테마 반영)
  - React Context (테마 상태 관리)
  - Container Queries (반응형 미리보기)
  - NextAuth.js 5 (소셜 로그인)

Target Architecture:
  - packages/playground-web/app/studio/ 라우트 구조
  - 테마 프리셋 기반 커스터마이징 (MVP: 3x3x3 = 27 조합)
  - 라이선스 기반 기능 분기
  - MCP 도구 연동 (get-user-theme)
```

---

## 2. Assumptions (가정)

| ID | 가정 | 근거 | 검증 방법 |
|----|------|------|----------|
| A-001 | 사용자는 구매 전 템플릿 미리보기를 원함 | 일반적인 마켓플레이스 UX 패턴 | 사용자 인터뷰 |
| A-002 | 3개 프리셋 옵션으로 MVP 커스터마이징 충분 | 초기 사용자 피드백 수집 후 확장 가능 | A/B 테스트 |
| A-003 | Social 로그인만으로 MVP 인증 충분 | Google/GitHub 계정 보유율 높음 | 등록 전환율 분석 |
| A-004 | CSS Variables로 실시간 테마 반영 가능 | 브라우저 표준 지원 | 성능 테스트 |
| A-005 | Container Queries로 반응형 미리보기 구현 가능 | 모던 브라우저 지원 | 브라우저 호환성 테스트 |
| A-006 | MCP 도구로 IDE/CLI 연동 가능 | SPEC-MCP-002 구현 완료 | MCP 연동 테스트 |

---

## 3. Requirements (요구사항)

### 3.1 Ubiquitous Requirements (항상 적용)

| ID | 요구사항 | TAG |
|----|----------|-----|
| U-001 | 시스템은 **항상** CSS Variables (`--tekton-*`)를 통해 테마를 반영해야 한다 | [TAG-UI003-001] |
| U-002 | 시스템은 **항상** TypeScript strict mode에서 컴파일되어야 한다 | [TAG-UI003-002] |
| U-003 | 시스템은 **항상** WCAG 2.1 AA 접근성 기준을 준수해야 한다 | [TAG-UI003-003] |
| U-004 | 시스템은 **항상** 반응형 레이아웃(Desktop, Tablet, Mobile)을 지원해야 한다 | [TAG-UI003-004] |
| U-005 | 시스템은 **항상** 하드코딩된 색상값 없이 토큰만 사용해야 한다 | [TAG-UI003-005] |
| U-006 | 시스템은 **항상** 사용자 데이터를 암호화하여 저장해야 한다 | [TAG-UI003-006] |

### 3.2 Event-Driven Requirements (이벤트 기반)

| ID | 요구사항 | TAG |
|----|----------|-----|
| E-001 | **WHEN** 프리셋이 선택되면 **THEN** CSS Variables가 즉시 업데이트되어 미리보기에 반영되어야 한다 | [TAG-UI003-007] |
| E-002 | **WHEN** 템플릿 카드가 클릭되면 **THEN** Editor 페이지로 이동해야 한다 | [TAG-UI003-008] |
| E-003 | **WHEN** 디바이스 스위처가 변경되면 **THEN** 미리보기 컨테이너 크기가 해당 디바이스로 변경되어야 한다 | [TAG-UI003-009] |
| E-004 | **WHEN** 사용자가 로그인하면 **THEN** 라이선스 정보가 로드되어야 한다 | [TAG-UI003-010] |
| E-005 | **WHEN** 유효한 라이선스가 확인되면 **THEN** Edit Mode가 활성화되어야 한다 | [TAG-UI003-011] |
| E-006 | **WHEN** Save 버튼이 클릭되면 **THEN** 테마 설정이 User DB에 저장되어야 한다 | [TAG-UI003-012] |
| E-007 | **WHEN** Export 버튼이 클릭되면 **THEN** MCP 형식의 JSON이 생성되어야 한다 | [TAG-UI003-013] |
| E-008 | **WHEN** OAuth 콜백이 수신되면 **THEN** 사용자 세션이 생성되어야 한다 | [TAG-UI003-014] |

### 3.3 State-Driven Requirements (상태 기반)

| ID | 요구사항 | TAG |
|----|----------|-----|
| S-001 | **IF** 사용자가 미로그인 상태이면 **THEN** Explore 탭만 표시해야 한다 | [TAG-UI003-015] |
| S-002 | **IF** 사용자가 로그인 상태이면 **THEN** Explore + Account 탭 모두 표시해야 한다 | [TAG-UI003-016] |
| S-003 | **IF** 템플릿에 라이선스가 없으면 **THEN** Preview Mode로 진입해야 한다 | [TAG-UI003-017] |
| S-004 | **IF** 템플릿에 유효한 라이선스가 있으면 **THEN** Edit Mode로 진입해야 한다 | [TAG-UI003-018] |
| S-005 | **IF** Preview Mode이면 **THEN** Dashboard + Login 2개 화면만 표시해야 한다 | [TAG-UI003-019] |
| S-006 | **IF** Edit Mode이면 **THEN** 12개 전체 화면을 표시해야 한다 | [TAG-UI003-020] |
| S-007 | **IF** Preview Mode이면 **THEN** Save/Export 버튼을 완전히 숨겨야 한다 | [TAG-UI003-021] |
| S-008 | **IF** Edit Mode이면 **THEN** Save/Export 버튼을 표시해야 한다 | [TAG-UI003-022] |
| S-009 | **IF** 미리보기 디바이스가 Desktop이면 **THEN** 컨테이너 너비를 1440px로 설정해야 한다 | [TAG-UI003-023] |
| S-010 | **IF** 미리보기 디바이스가 Tablet이면 **THEN** 컨테이너 너비를 768px로 설정해야 한다 | [TAG-UI003-024] |
| S-011 | **IF** 미리보기 디바이스가 Mobile이면 **THEN** 컨테이너 너비를 375px로 설정해야 한다 | [TAG-UI003-025] |

### 3.4 Unwanted Behavior (금지 동작)

| ID | 요구사항 | TAG |
|----|----------|-----|
| UW-001 | 시스템은 라이선스 없이 Edit Mode 기능을 제공하지 **않아야 한다** | [TAG-UI003-026] |
| UW-002 | 시스템은 하드코딩된 색상값(#hex, rgb())을 사용하지 **않아야 한다** | [TAG-UI003-027] |
| UW-003 | 시스템은 iframe을 사용하여 미리보기를 구현하지 **않아야 한다** | [TAG-UI003-028] |
| UW-004 | 시스템은 사용자 비밀번호를 평문으로 저장하지 **않아야 한다** | [TAG-UI003-029] |
| UW-005 | 시스템은 비로그인 사용자에게 Account 탭을 표시하지 **않아야 한다** | [TAG-UI003-030] |
| UW-006 | 시스템은 Preview Mode에서 Save/Export 버튼을 표시하지 **않아야 한다** | [TAG-UI003-031] |

### 3.5 Optional Requirements (선택적)

| ID | 요구사항 | TAG |
|----|----------|-----|
| O-001 | **가능하면** 커스텀 컬러 피커 제공 (MVP 이후) | [TAG-UI003-032] |
| O-002 | **가능하면** 직접 타이포그래피 선택 제공 (MVP 이후) | [TAG-UI003-033] |
| O-003 | **가능하면** 테마 프리셋 즐겨찾기 기능 제공 | [TAG-UI003-034] |
| O-004 | **가능하면** 테마 미리보기 히스토리 제공 | [TAG-UI003-035] |
| O-005 | **가능하면** 다크 모드 토글 제공 | [TAG-UI003-036] |

---

## 4. Technical Specifications (기술 명세)

### 4.1 페이지 구조 (6개 페이지)

| 경로 | 페이지 | 설명 | 인증 필요 |
|------|--------|------|----------|
| `/studio` | Explore | 템플릿 갤러리 메인 | No |
| `/studio/account` | Account | 라이선스 관리, 좋아요 목록 | Yes |
| `/studio/template/[id]` | Editor (Preview) | 미리보기 모드 (2개 화면) | No |
| `/studio/template/[id]/edit` | Editor (Edit) | 편집 모드 (12개 화면) | Yes + License |
| `/auth/login` | Login | 소셜 로그인 선택 | No |
| `/auth/callback` | OAuth Callback | OAuth 콜백 처리 | No |

> **Note:** 결제 시스템(Paddle)은 추후 별도 SPEC에서 정의 예정입니다. 현재 라이선스는 외부에서 프로비저닝된다고 가정합니다.

### 4.2 레이아웃 구조 (Midjourney 스타일)

```
┌─────────────────────────────────────────────────────────┐
│                     Header (로고 + 검색)                 │
├────────┬────────────────────────────────────────────────┤
│        │                                                │
│  Side  │                                                │
│  bar   │              Main Content Area                 │
│        │                                                │
│ ┌────┐ │         (Explore: 갤러리 그리드)               │
│ │ Ex │ │         (Editor: 미리보기 + 패널)              │
│ │plo │ │                                                │
│ │ re │ │                                                │
│ └────┘ │                                                │
│        │                                                │
│ ┌────┐ │                                                │
│ │ Ac │ │                                                │
│ │cou │ │                                                │
│ │ nt │ │                                                │
│ └────┘ │                                                │
│        │                                                │
└────────┴────────────────────────────────────────────────┘
```

### 4.3 테마 프리셋 시스템 (MVP)

```typescript
// packages/playground-web/lib/presets.ts

export interface ThemePreset {
  id: string;
  name: string;
  category: 'color' | 'typography' | 'spacing';
  values: Record<string, string>;
}

// Color Presets (3개)
export const colorPresets: ThemePreset[] = [
  {
    id: 'color-ocean',
    name: 'Ocean Blue',
    category: 'color',
    values: {
      '--tekton-bg-primary': 'oklch(0.6 0.15 240)',
      '--tekton-bg-primary-foreground': 'oklch(0.98 0 0)',
      // ... 기타 색상 변수
    },
  },
  {
    id: 'color-forest',
    name: 'Forest Green',
    category: 'color',
    values: {
      '--tekton-bg-primary': 'oklch(0.55 0.15 150)',
      '--tekton-bg-primary-foreground': 'oklch(0.98 0 0)',
    },
  },
  {
    id: 'color-sunset',
    name: 'Sunset Orange',
    category: 'color',
    values: {
      '--tekton-bg-primary': 'oklch(0.65 0.2 30)',
      '--tekton-bg-primary-foreground': 'oklch(0.98 0 0)',
    },
  },
];

// Typography Presets (3개)
export const typographyPresets: ThemePreset[] = [
  {
    id: 'typo-modern',
    name: 'Modern Sans',
    category: 'typography',
    values: {
      '--tekton-font-family': 'Inter, sans-serif',
      '--tekton-font-size-base': '16px',
    },
  },
  {
    id: 'typo-classic',
    name: 'Classic Serif',
    category: 'typography',
    values: {
      '--tekton-font-family': 'Georgia, serif',
      '--tekton-font-size-base': '16px',
    },
  },
  {
    id: 'typo-minimal',
    name: 'Minimal',
    category: 'typography',
    values: {
      '--tekton-font-family': 'system-ui, sans-serif',
      '--tekton-font-size-base': '14px',
    },
  },
];

// Spacing Presets (3개)
export const spacingPresets: ThemePreset[] = [
  {
    id: 'spacing-compact',
    name: 'Compact',
    category: 'spacing',
    values: {
      '--tekton-spacing-unit': '4px',
      '--tekton-spacing-scale': '1',
    },
  },
  {
    id: 'spacing-comfortable',
    name: 'Comfortable',
    category: 'spacing',
    values: {
      '--tekton-spacing-unit': '4px',
      '--tekton-spacing-scale': '1.25',
    },
  },
  {
    id: 'spacing-spacious',
    name: 'Spacious',
    category: 'spacing',
    values: {
      '--tekton-spacing-unit': '4px',
      '--tekton-spacing-scale': '1.5',
    },
  },
];
```

### 4.4 테마 상태 관리 (React Context)

```typescript
// packages/playground-web/contexts/ThemeContext.tsx

import { createContext, useContext, useState, useCallback } from 'react';

interface ThemeState {
  colorPreset: string;
  typographyPreset: string;
  spacingPreset: string;
  customOverrides: Record<string, string>;
}

interface ThemeContextValue {
  theme: ThemeState;
  setColorPreset: (id: string) => void;
  setTypographyPreset: (id: string) => void;
  setSpacingPreset: (id: string) => void;
  setCustomOverride: (key: string, value: string) => void;
  applyTheme: () => void;
  exportTheme: () => ThemeConfigJSON;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeState>({
    colorPreset: 'color-ocean',
    typographyPreset: 'typo-modern',
    spacingPreset: 'spacing-comfortable',
    customOverrides: {},
  });

  // CSS Variables 즉시 적용 [TAG-UI003-007]
  const applyTheme = useCallback(() => {
    const root = document.documentElement;
    const allPresets = [
      ...colorPresets.find(p => p.id === theme.colorPreset)?.values ?? {},
      ...typographyPresets.find(p => p.id === theme.typographyPreset)?.values ?? {},
      ...spacingPresets.find(p => p.id === theme.spacingPreset)?.values ?? {},
      ...theme.customOverrides,
    ];

    Object.entries(allPresets).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  // MCP 형식 JSON 내보내기 [TAG-UI003-013]
  const exportTheme = useCallback((): ThemeConfigJSON => {
    return {
      version: '1.0.0',
      presets: {
        color: theme.colorPreset,
        typography: theme.typographyPreset,
        spacing: theme.spacingPreset,
      },
      overrides: theme.customOverrides,
      exportedAt: new Date().toISOString(),
    };
  }, [theme]);

  // ... 나머지 구현
}
```

### 4.5 디바이스 미리보기 (Container-based)

```typescript
// packages/playground-web/components/studio/DevicePreview.tsx

interface DevicePreviewProps {
  device: 'desktop' | 'tablet' | 'mobile';
  children: React.ReactNode;
}

const deviceWidths = {
  desktop: 1440,  // [TAG-UI003-023]
  tablet: 768,    // [TAG-UI003-024]
  mobile: 375,    // [TAG-UI003-025]
};

export function DevicePreview({ device, children }: DevicePreviewProps) {
  const width = deviceWidths[device];

  return (
    <div
      className="device-preview-container"
      style={{
        width: `${width}px`,
        maxWidth: '100%',
        margin: '0 auto',
        // Container query 지원
        containerType: 'inline-size',
      }}
    >
      {children}
    </div>
  );
}
```

### 4.6 사용자 데이터 모델

```typescript
// packages/playground-web/lib/types/user.ts

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  provider: 'google' | 'github';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserData {
  userId: string;

  /** 구매한 템플릿 라이선스 키 배열 */
  licenses: License[];

  /** 좋아요한 템플릿 ID 배열 */
  likedTemplates: string[];

  /** 저장된 테마 설정 배열 */
  savedThemes: SavedTheme[];
}

export interface License {
  id: string;
  templateId: string;
  key: string;
  purchasedAt: Date;
  expiresAt?: Date;
  status: 'active' | 'expired' | 'revoked';
}

export interface SavedTheme {
  id: string;
  templateId: string;
  name: string;
  config: ThemeConfigJSON;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThemeConfigJSON {
  version: string;
  presets: {
    color: string;
    typography: string;
    spacing: string;
  };
  overrides: Record<string, string>;
  exportedAt: string;
}
```

### 4.7 MCP 도구 연동

```typescript
// MCP Tool: get-user-theme
// 사용처: IDE/CLI에서 사용자 테마 설정 조회

interface GetUserThemeRequest {
  userId: string;
  templateId: string;
}

interface GetUserThemeResponse {
  success: boolean;
  theme?: ThemeConfigJSON;
  error?: string;
}

// Web Studio에서 저장 → User DB → MCP 조회 → IDE/CLI 적용
```

### 4.8 인증 시스템 (NextAuth.js 5)

```typescript
// packages/playground-web/lib/auth.ts

import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // 라이선스 정보 로드 [TAG-UI003-010]
      if (session.user) {
        const userData = await loadUserData(token.sub!);
        session.user.licenses = userData.licenses;
        session.user.likedTemplates = userData.likedTemplates;
      }
      return session;
    },
  },
});
```

---

## 5. 파일 구조

```
packages/playground-web/
├── app/
│   ├── studio/
│   │   ├── layout.tsx           # Studio 레이아웃 (사이드바)
│   │   ├── page.tsx             # [TAG-UI003-037] Explore 페이지
│   │   ├── account/
│   │   │   └── page.tsx         # [TAG-UI003-038] Account 페이지
│   │   └── template/
│   │       └── [id]/
│   │           ├── page.tsx     # [TAG-UI003-039] Editor Preview
│   │           └── edit/
│   │               └── page.tsx # [TAG-UI003-040] Editor Edit
│   └── auth/
│       ├── login/
│       │   └── page.tsx         # [TAG-UI003-041] Login 페이지
│       └── callback/
│           └── page.tsx         # [TAG-UI003-042] OAuth Callback
├── components/
│   └── studio/
│       ├── Sidebar.tsx          # [TAG-UI003-045] 사이드바 컴포넌트
│       ├── TemplateGallery.tsx  # [TAG-UI003-046] 템플릿 갤러리
│       ├── TemplateCard.tsx     # [TAG-UI003-047] 템플릿 카드
│       ├── DevicePreview.tsx    # [TAG-UI003-048] 디바이스 미리보기
│       ├── DeviceSwitcher.tsx   # [TAG-UI003-049] 디바이스 스위처
│       ├── PresetPanel.tsx      # [TAG-UI003-050] 프리셋 선택 패널
│       ├── ScreenSelector.tsx   # [TAG-UI003-051] 화면 선택기
│       └── ActionButtons.tsx    # [TAG-UI003-052] Save/Export 버튼
├── contexts/
│   ├── ThemeContext.tsx         # [TAG-UI003-053] 테마 상태 관리
│   └── AuthContext.tsx          # [TAG-UI003-054] 인증 상태 관리
├── lib/
│   ├── presets.ts               # [TAG-UI003-055] 프리셋 정의
│   ├── auth.ts                  # [TAG-UI003-056] NextAuth 설정
│   └── types/
│       ├── user.ts              # [TAG-UI003-057] 사용자 타입
│       └── theme.ts             # [TAG-UI003-058] 테마 타입
└── styles/
    └── studio.css               # [TAG-UI003-059] Studio 전용 스타일
```

---

## 6. 품질 기준

| 항목 | 기준 | 측정 방법 |
|------|------|----------|
| TypeScript 컴파일 | 오류 0개 | `tsc --noEmit` |
| 린트 | 경고 0개 | `eslint src` |
| 테스트 커버리지 | 85% 이상 | `vitest --coverage` |
| 접근성 | WCAG 2.1 AA | `axe-core` 테스트 |
| 성능 (LCP) | 2.5초 이내 | Lighthouse 측정 |
| 성능 (CLS) | 0.1 이하 | Lighthouse 측정 |
| 반응형 | 3개 breakpoint 정상 작동 | 수동 테스트 |
| 하드코딩 검출 | 0건 | 정규식 스캔 |
| OAuth 연동 | Google/GitHub 정상 작동 | E2E 테스트 |
| MCP Export | JSON 형식 유효성 | 스키마 검증 |

---

## 7. 참조 문서

- [SPEC-UI-001](../SPEC-UI-001/spec.md) - shadcn-ui Fork & Token Integration
- [SPEC-UI-002](../SPEC-UI-002/spec.md) - P0 Screen Templates
- [SPEC-MCP-002](../SPEC-MCP-002/spec.md) - MCP 도구 구현
- [Midjourney](https://midjourney.com) - 레이아웃 참조
- [NextAuth.js 5](https://authjs.dev) - 인증 라이브러리

---

## 8. TAG 요약

| TAG ID | 요구사항 요약 |
|--------|-------------|
| [TAG-UI003-001~006] | Ubiquitous: CSS Variables, TypeScript, 접근성, 반응형, 보안 |
| [TAG-UI003-007~014] | Event-Driven: 프리셋 선택, 네비게이션, 디바이스 스위칭, 로그인, 저장, 내보내기 |
| [TAG-UI003-015~025] | State-Driven: 로그인 상태, 라이선스 상태, 모드별 기능, 디바이스별 크기 |
| [TAG-UI003-026~031] | Unwanted: 라이선스 없이 Edit, 하드코딩, iframe, 평문 비밀번호 |
| [TAG-UI003-032~036] | Optional: 커스텀 피커, 즐겨찾기, 히스토리, 다크모드 |
| [TAG-UI003-037~042] | 페이지 구현 (6개) |
| [TAG-UI003-045~059] | 컴포넌트 및 모듈 구현 |

---

**다음 단계:** [plan.md](./plan.md)에서 구현 계획 및 마일스톤 확인
