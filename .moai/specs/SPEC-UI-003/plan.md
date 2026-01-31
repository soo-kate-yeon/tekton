---
id: SPEC-UI-003
document: plan
version: "1.0.0"
created: "2026-01-31"
updated: "2026-01-31"
author: soo-kate-yeon
---

# SPEC-UI-003: WebView Studio MVP - 구현 계획

## 개요

Week 3 (7일) 동안 WebView Studio MVP를 구현합니다. 총 6개 Phase로 나누어 진행하며, 각 Phase는 명확한 결과물과 검증 기준을 가집니다.

---

## 마일스톤 요약

| Phase | 기간 | 주요 결과물 | 우선순위 |
|-------|------|-------------|----------|
| Phase 1 | Day 1 | 프로젝트 설정 및 라우팅 | Primary Goal |
| Phase 2 | Day 2 | Explore 페이지 및 갤러리 | Primary Goal |
| Phase 3 | Day 3 | Editor - Preview Mode | Primary Goal |
| Phase 4 | Day 4 | Editor - Edit Mode + Presets | Primary Goal |
| Phase 5 | Day 5-6 | Auth & License 시스템 | Primary Goal |
| Phase 6 | Day 7 | 품질 검증 및 테스트 | Final Goal |

---

## Phase 1: 프로젝트 설정 및 라우팅 (Day 1)

### 목표

WebView Studio의 기반 구조를 설정하고, 6개 페이지 라우팅을 구현합니다.

### 태스크 목록

| ID | 태스크 | TAG | 완료 기준 |
|----|--------|-----|----------|
| P1-01 | Studio 레이아웃 컴포넌트 생성 | [TAG-UI003-045] | Sidebar + Main Area 구조 |
| P1-02 | 6개 페이지 라우트 생성 | [TAG-UI003-037~042] | 모든 경로 접근 가능 |
| P1-03 | ThemeContext 기본 구조 구현 | [TAG-UI003-053] | Provider 래핑 완료 |
| P1-04 | 타입 정의 (User, Theme, License) | [TAG-UI003-057~058] | TypeScript 컴파일 성공 |
| P1-05 | Studio 전용 CSS 설정 | [TAG-UI003-059] | CSS Variables 기본 적용 |

### 기술적 접근

```
1. Next.js App Router 구조:
   - app/studio/layout.tsx: 공통 레이아웃
   - app/studio/page.tsx: Explore
   - app/studio/template/[id]/page.tsx: Editor Preview
   - app/studio/template/[id]/edit/page.tsx: Editor Edit

2. 레이아웃 구성:
   - Sidebar: 240px 고정 너비
   - Main Content: flex-1
   - Header: 64px 높이
```

### 검증 기준

- [ ] 모든 6개 라우트 접근 가능
- [ ] TypeScript 컴파일 오류 없음
- [ ] CSS Variables 기본 적용 확인
- [ ] Sidebar + Main 레이아웃 렌더링

---

## Phase 2: Explore 페이지 및 갤러리 (Day 2)

### 목표

Midjourney 스타일의 템플릿 갤러리를 구현합니다.

### 태스크 목록

| ID | 태스크 | TAG | 완료 기준 |
|----|--------|-----|----------|
| P2-01 | Sidebar 컴포넌트 구현 | [TAG-UI003-045] | Explore/Account 탭 전환 |
| P2-02 | TemplateGallery 컴포넌트 구현 | [TAG-UI003-046] | 그리드 레이아웃 |
| P2-03 | TemplateCard 컴포넌트 구현 | [TAG-UI003-047] | 카드 클릭 → Editor 이동 |
| P2-04 | 템플릿 목 데이터 생성 | - | 12개 템플릿 데이터 |
| P2-05 | 검색/필터 UI (기본) | - | 카테고리 필터 |

### UI 상세

```typescript
// TemplateCard 구조
interface TemplateCardProps {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  price: number;
  isPurchased: boolean;
  isLiked: boolean;
}

// Sidebar 구조
- Logo (상단)
- Explore 탭 (아이콘 + 텍스트)
- Account 탭 (아이콘 + 텍스트) - 로그인 시만 표시
- 하단: 로그인 버튼 또는 사용자 아바타
```

### 검증 기준

- [ ] 템플릿 그리드 정상 렌더링 (반응형)
- [ ] 카드 클릭 시 Editor 페이지 이동 [TAG-UI003-008]
- [ ] Explore/Account 탭 전환 동작
- [ ] 카테고리 필터 동작

---

## Phase 3: Editor - Preview Mode (Day 3)

### 목표

라이선스 없이 접근 가능한 미리보기 모드를 구현합니다.

### 태스크 목록

| ID | 태스크 | TAG | 완료 기준 |
|----|--------|-----|----------|
| P3-01 | DevicePreview 컴포넌트 구현 | [TAG-UI003-048] | Container 기반 크기 조절 |
| P3-02 | DeviceSwitcher 컴포넌트 구현 | [TAG-UI003-049] | Desktop/Tablet/Mobile 전환 |
| P3-03 | ScreenSelector 컴포넌트 구현 (Preview용) | [TAG-UI003-051] | 2개 화면만 표시 |
| P3-04 | PresetPanel 컴포넌트 구현 (읽기 전용) | [TAG-UI003-050] | 프리셋 선택 UI |
| P3-05 | "Get License" CTA 버튼 구현 | - | 라이선스 안내 표시 |

### Preview Mode 제약사항

```typescript
// Preview Mode에서의 제약 [TAG-UI003-019, TAG-UI003-021]
const PreviewModeConstraints = {
  // 표시되는 화면
  visibleScreens: ['dashboard', 'login'], // 2개만

  // 숨김 처리
  hiddenElements: ['saveButton', 'exportButton'],

  // 비활성화
  disabledFeatures: ['saveSetting', 'exportTheme'],

  // 표시 요소
  visibleCTA: 'Get License', // 라이선스 안내 (결제 시스템 추후 연동)
};
```

### 디바이스 미리보기 구현

```typescript
// Container 기반 (iframe 미사용) [TAG-UI003-028]
<div
  style={{
    width: device === 'desktop' ? '1440px' :
           device === 'tablet' ? '768px' : '375px',
    containerType: 'inline-size',
  }}
>
  <TemplatePreview templateId={id} />
</div>
```

### 검증 기준

- [ ] 2개 화면만 표시 (Dashboard, Login) [TAG-UI003-019]
- [ ] Save/Export 버튼 완전히 숨김 [TAG-UI003-021]
- [ ] 디바이스 스위처 동작 [TAG-UI003-009]
- [ ] "Get License" CTA 정상 동작
- [ ] iframe 미사용 확인 [TAG-UI003-028]

---

## Phase 4: Editor - Edit Mode + Presets (Day 4)

### 목표

라이선스 보유자 전용 편집 모드와 프리셋 시스템을 구현합니다.

### 태스크 목록

| ID | 태스크 | TAG | 완료 기준 |
|----|--------|-----|----------|
| P4-01 | Edit Mode 진입 검증 미들웨어 | [TAG-UI003-018] | 라이선스 확인 후 진입 |
| P4-02 | ScreenSelector 확장 (12개 화면) | [TAG-UI003-051] | 전체 화면 선택 가능 |
| P4-03 | PresetPanel 활성화 (수정 가능) | [TAG-UI003-050] | 프리셋 선택 시 즉시 반영 |
| P4-04 | ActionButtons 구현 (Save/Export) | [TAG-UI003-052] | 버튼 노출 및 동작 |
| P4-05 | 프리셋 데이터 정의 (3x3x3) | [TAG-UI003-055] | 27개 조합 가능 |
| P4-06 | CSS Variables 즉시 적용 로직 | [TAG-UI003-007] | 프리셋 선택 시 즉시 반영 |

### 프리셋 시스템 구현

```typescript
// 3개 카테고리 × 3개 옵션 = 27개 조합
const presetCategories = {
  color: ['Ocean Blue', 'Forest Green', 'Sunset Orange'],
  typography: ['Modern Sans', 'Classic Serif', 'Minimal'],
  spacing: ['Compact', 'Comfortable', 'Spacious'],
};

// 즉시 적용 로직 [TAG-UI003-007]
function applyPreset(presetId: string) {
  const preset = presets.find(p => p.id === presetId);
  if (preset) {
    Object.entries(preset.values).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }
}
```

### Edit Mode vs Preview Mode 비교

| 기능 | Preview Mode | Edit Mode |
|------|-------------|-----------|
| 표시 화면 | 2개 | 12개 |
| 프리셋 선택 | 가능 (체험용) | 가능 (저장 가능) |
| Save 버튼 | 숨김 | 표시 |
| Export 버튼 | 숨김 | 표시 |
| CTA | "Buy Now" | 없음 |

### 검증 기준

- [ ] 라이선스 없이 Edit 페이지 접근 시 리다이렉트 [TAG-UI003-026]
- [ ] 12개 전체 화면 표시 [TAG-UI003-020]
- [ ] 프리셋 선택 시 CSS Variables 즉시 반영 [TAG-UI003-007]
- [ ] Save/Export 버튼 표시 [TAG-UI003-022]
- [ ] 테마 설정 저장 동작 [TAG-UI003-012]
- [ ] MCP JSON 내보내기 동작 [TAG-UI003-013]

---

## Phase 5: Auth & License 시스템 (Day 5-6)

### 목표

Google/GitHub OAuth 로그인과 라이선스 기반 기능 분기를 구현합니다.

> **Note:** 결제 시스템(Paddle)은 추후 별도 SPEC에서 정의됩니다. 현재 라이선스는 외부에서 프로비저닝(관리자 발급)된다고 가정합니다.

### Day 5 태스크 (인증)

| ID | 태스크 | TAG | 완료 기준 |
|----|--------|-----|----------|
| P5-01 | NextAuth.js 5 설정 | [TAG-UI003-056] | Provider 구성 완료 |
| P5-02 | Google OAuth 연동 | [TAG-UI003-014] | 로그인 성공 |
| P5-03 | GitHub OAuth 연동 | [TAG-UI003-014] | 로그인 성공 |
| P5-04 | Login 페이지 UI | [TAG-UI003-041] | 소셜 로그인 버튼 |
| P5-05 | OAuth Callback 처리 | [TAG-UI003-042] | 세션 생성 |
| P5-06 | AuthContext 구현 | [TAG-UI003-054] | 로그인 상태 관리 |

### Day 6 태스크 (라이선스 검증)

| ID | 태스크 | TAG | 완료 기준 |
|----|--------|-----|----------|
| P5-07 | License 데이터 모델 구현 | [TAG-UI003-057] | CRUD 동작 |
| P5-08 | 라이선스 검증 미들웨어 | [TAG-UI003-018] | Edit 진입 제어 |
| P5-09 | Account 페이지 구현 | [TAG-UI003-038] | 라이선스 목록 표시 |
| P5-10 | 좋아요 기능 구현 | - | 토글 동작 |
| P5-11 | 라이선스 입력 UI (임시) | - | 키 입력으로 활성화 |

### 인증 플로우

```
1. /auth/login 접근
   └── Google 또는 GitHub 버튼 클릭
       └── OAuth Provider 리다이렉트
           └── /auth/callback 수신
               └── 세션 생성 + 라이선스 로드
                   └── /studio (또는 이전 페이지) 리다이렉트
```

### 라이선스 검증 플로우

```
1. Edit Mode 접근 시도
   └── 로그인 확인 (미로그인 시 → /auth/login)
       └── 라이선스 보유 확인
           ├── 있음 → Edit Mode 진입
           └── 없음 → Preview Mode + "Get License" CTA

Note: 라이선스 발급은 추후 Paddle 결제 연동 시 자동화 예정
      현재는 관리자가 수동으로 발급하거나, Account에서 키 입력으로 활성화
```

### 검증 기준

- [ ] Google OAuth 로그인 성공
- [ ] GitHub OAuth 로그인 성공
- [ ] 로그인 후 Account 탭 표시 [TAG-UI003-016]
- [ ] 미로그인 시 Account 탭 숨김 [TAG-UI003-015]
- [ ] 라이선스 보유 시 Edit Mode 접근 가능 [TAG-UI003-011]
- [ ] Account 페이지에서 라이선스 목록 확인
- [ ] 라이선스 키 입력으로 활성화 (임시 기능)

---

## Phase 6: 품질 검증 및 테스트 (Day 7)

### 목표

품질 기준을 만족하는지 검증하고, 발견된 이슈를 수정합니다.

### 태스크 목록

| ID | 태스크 | 완료 기준 |
|----|--------|----------|
| P6-01 | TypeScript 컴파일 검증 | 오류 0개 |
| P6-02 | ESLint 검증 | 경고 0개 |
| P6-03 | 단위 테스트 작성 | 커버리지 85%+ |
| P6-04 | 접근성 테스트 (axe-core) | WCAG 2.1 AA |
| P6-05 | Lighthouse 성능 측정 | LCP < 2.5s, CLS < 0.1 |
| P6-06 | 하드코딩 검출 스캔 | 0건 |
| P6-07 | E2E 테스트 (OAuth) | 전체 플로우 통과 |
| P6-08 | 크로스 브라우저 테스트 | Chrome, Firefox, Safari |
| P6-09 | 반응형 테스트 | Desktop, Tablet, Mobile |
| P6-10 | 버그 수정 및 폴리싱 | 발견된 이슈 해결 |

### 테스트 시나리오

```typescript
// 핵심 E2E 시나리오
describe('WebView Studio E2E', () => {
  // 1. 비로그인 사용자 플로우
  test('비로그인 사용자는 Explore만 접근 가능', async () => {
    // Explore 접근 가능
    // Account 탭 숨김
    // Preview Mode만 가능
    // Edit 시도 시 로그인 리다이렉트
  });

  // 2. 로그인 사용자 플로우 (라이선스 없음)
  test('라이선스 없는 사용자는 Preview Mode만 가능', async () => {
    // 로그인 성공
    // Account 탭 표시
    // Preview Mode 접근 가능
    // Edit 시도 시 Checkout 리다이렉트
  });

  // 3. 라이선스 보유 사용자 플로우
  test('라이선스 보유자는 Edit Mode 가능', async () => {
    // Edit Mode 접근 가능
    // 12개 화면 표시
    // Save/Export 버튼 표시
    // 프리셋 변경 및 저장 가능
  });
});
```

### 하드코딩 검출 스크립트

```bash
# 색상 하드코딩 검출
grep -rn "#[0-9a-fA-F]\{3,6\}" packages/playground-web/
grep -rn "rgb\|rgba\|hsl\|hsla" packages/playground-web/

# spacing 하드코딩 검출 (토큰 미사용)
grep -rn "padding:.*px" packages/playground-web/
grep -rn "margin:.*px" packages/playground-web/
```

### 검증 기준

- [ ] TypeScript 오류 0개
- [ ] ESLint 경고 0개
- [ ] 테스트 커버리지 85% 이상
- [ ] WCAG 2.1 AA 통과
- [ ] Lighthouse LCP < 2.5s
- [ ] Lighthouse CLS < 0.1
- [ ] 하드코딩 0건
- [ ] E2E 테스트 통과
- [ ] 크로스 브라우저 정상 동작
- [ ] 반응형 정상 동작

---

## 위험 요소 및 대응 계획

| 위험 요소 | 발생 확률 | 영향도 | 대응 계획 |
|-----------|----------|--------|----------|
| OAuth Provider 연동 지연 | 중간 | 높음 | 목 인증으로 우선 개발 후 연동 |
| CSS Variables 브라우저 호환성 | 낮음 | 중간 | 폴리필 적용 또는 폴백 스타일 |
| Container Queries 지원 | 낮음 | 낮음 | 폴리필 적용 |
| SPEC-UI-001/002 미완료 | 중간 | 높음 | 컴포넌트 스텁으로 병렬 개발 |

---

## 기술 스택 버전

| 기술 | 버전 | 비고 |
|------|------|------|
| Next.js | 15.x | App Router |
| React | 19.x | Server Components |
| TypeScript | 5.7+ | strict mode |
| Tailwind CSS | 4.0 | CSS Variables 연동 |
| NextAuth.js | 5.x | OAuth 인증 |
| Vitest | latest | 단위 테스트 |
| Playwright | latest | E2E 테스트 |

---

## 참조 문서

- [spec.md](./spec.md) - EARS 요구사항 명세
- [acceptance.md](./acceptance.md) - 인수 테스트 시나리오
- [SPEC-UI-001](../SPEC-UI-001/plan.md) - shadcn-ui Fork 계획
- [SPEC-UI-002](../SPEC-UI-002/plan.md) - Screen Templates 계획

---

**다음 단계:** [acceptance.md](./acceptance.md)에서 인수 테스트 시나리오 확인
