# SPEC-UI-001 개선 계획

Phase 3 완료 후 식별된 개선 항목과 해결 로드맵

## 개요

Phase 3 완료 시점의 품질 평가 결과:

| 메트릭 | 목표 | 달성 | 상태 |
|--------|------|------|------|
| 테스트 통과율 | 100% | 100% (497/497) | ✅ |
| 테스트 커버리지 | 85% | 91.72% | ✅ |
| TypeScript 컴파일 | 오류 0개 | 23개 타입 오류 | ⚠️ |
| TAG 주석 준수 | 100% | 부분적 누락 | ❌ |
| TRUST 5 스코어 | 80+ | 71/100 | ⚠️ |

**총평:**
- 기능 구현 완료, 테스트 커버리지 우수
- 요구사항 추적성 및 타입 안정성 개선 필요
- Phase 4에서 품질 강화 집중

---

## Critical Issues

### 1. TAG 주석 누락 (Priority: Critical)

#### 문제 설명

SPEC-UI-001의 EARS 요구사항(U-001 ~ O-003)에 정의된 TAG 주석이 코드에 누락되어 요구사항 추적성이 저하됨.

**영향 범위:**
- 37개 TAG 주석 전체 누락
- 요구사항 → 코드 연결 단절
- 품질 게이트 실패 (TRUST 5 - Trackable 항목)

#### 근본 원인 분석

1. **인식 부족**: TAG 주석의 중요성에 대한 이해 부족
2. **프로세스 미흡**: 구현 시 TAG 주석 추가를 체크리스트화하지 않음
3. **도구 부재**: TAG 주석 검증 자동화 스크립트 부재

#### 해결 로드맵

**Phase 4.1: TAG 주석 일괄 추가 (3일)**

1. **Day 1: Ubiquitous Requirements (U-001 ~ U-005)**

모든 컴포넌트 파일에 TAG 주석 추가:

```typescript
// [TAG-001] TokenReference 타입 준수
import type { TokenReference } from '@tekton/tokens';

// [TAG-002] CSS Variable --tekton-* 패턴 사용
const buttonVariants = cva(
  "bg-[var(--tekton-bg-primary)]", // [TAG-002]
  // ...
);

// [TAG-003] Radix UI Primitives 접근성 보장
import * as RadixButton from '@radix-ui/react-button';

// [TAG-004] TypeScript strict mode 준수
// tsconfig.json: "strict": true

// [TAG-005] React Server Components 호환
"use client"; // 명시적 클라이언트 컴포넌트 표시
```

**대상 파일:**
- `packages/ui/src/components/*.tsx` (30개 컴포넌트)
- `packages/ui/src/templates/**/*.tsx` (템플릿 파일)
- `packages/ui/src/lib/*.ts` (유틸리티)

2. **Day 2: Event-Driven Requirements (E-001 ~ E-004)**

테마 변경 및 이벤트 처리 로직에 TAG 주석:

```typescript
// [TAG-006] 테마 변경 시 즉시 반영
useEffect(() => {
  // CSS Variables 기반이므로 자동 반영
}, [theme]);

// [TAG-007] 필요한 CSS Variable만 로드
import '@tekton/ui/styles/button.css'; // 컴포넌트별 분리

// [TAG-008] ScreenTemplate 토큰 바인딩 유지
export const LoginTemplate: ScreenTemplate = {
  tokenBindings: { /* ... */ }, // [TAG-008]
  // ...
};

// [TAG-009] variant prop 토큰 적용
const buttonVariants = cva("...", {
  variants: {
    variant: {
      primary: "bg-[var(--tekton-bg-primary)]", // [TAG-009]
    },
  },
});
```

3. **Day 3: State-Driven, Unwanted, Optional Requirements**

상태 처리 및 금지 동작 검증:

```typescript
// [TAG-010] linear-minimal-v1 테마 토큰 적용
if (theme === 'linear-minimal-v1') {
  loadThemeCSS(theme); // [TAG-010]
}

// [TAG-011] disabled 상태 opacity 토큰
disabled:opacity-[var(--button-disabled-opacity)] // [TAG-011]

// [TAG-012] 다크 모드 토큰 적용
.dark { /* CSS Variables 자동 전환 */ } // [TAG-012]

// [TAG-013] responsive breakpoint 레이아웃
<div className="sm:flex-col md:flex-row"> {/* [TAG-013] */}

// [TAG-014] 하드코딩 색상 금지 (검증)
// ❌ Bad: background: '#3b82f6'
// ✅ Good: background: 'var(--tekton-bg-primary)' // [TAG-014]

// [TAG-015] 하드코딩 spacing 금지
// ❌ Bad: padding: '1rem'
// ✅ Good: padding: 'var(--tekton-spacing-4)' // [TAG-015]

// [TAG-016] Radix UI 외 자체 접근성 구현 금지
// Radix UI 사용 필수 // [TAG-016]

// [TAG-017] 클라이언트 기능 'use client' 필수
"use client"; // [TAG-017]

// [TAG-018] Framer Motion 애니메이션 (Optional)
// TODO: Phase 5 // [TAG-018]

// [TAG-019] Storybook 문서화 (Optional)
// TODO: Phase 5 // [TAG-019]

// [TAG-020] CSS-in-JS 대안 (Optional)
// TODO: Phase 5 // [TAG-020]
```

**Phase 4.2: 자동화 스크립트 개발 (2일)**

TAG 주석 검증 스크립트:

```bash
#!/bin/bash
# scripts/validate-tags.sh

# 모든 TAG 주석 검색
grep -r "\[TAG-" packages/ui/src/ > tags-found.txt

# 요구사항 TAG 목록
REQUIRED_TAGS=(TAG-001 TAG-002 ... TAG-020)

# 누락된 TAG 보고
for tag in "${REQUIRED_TAGS[@]}"; do
  if ! grep -q "$tag" tags-found.txt; then
    echo "❌ Missing: $tag"
  fi
done
```

**CI/CD 통합:**

```yaml
# .github/workflows/quality.yml
- name: Validate TAG Comments
  run: |
    pnpm validate:tags
    if [ $? -ne 0 ]; then
      echo "TAG comments validation failed"
      exit 1
    fi
```

**Phase 4.3: 문서화 및 프로세스 확립 (1일)**

- TAG 주석 작성 가이드 문서 작성
- PR 체크리스트에 TAG 주석 확인 항목 추가
- 개발팀 교육 자료 준비

**전체 일정:**
- Day 1-3: TAG 주석 일괄 추가
- Day 4-5: 자동화 스크립트 개발
- Day 6: 문서화 및 프로세스 확립
- **총 6일 (1주 내 완료 목표)**

---

## Warning Issues

### 2. TypeScript 타입 정의 오류 (Priority: High)

#### 문제 설명

템플릿 시스템 구현 중 23개 TypeScript 타입 정의 오류 발생.

**오류 분류:**

| 오류 유형 | 개수 | 영향도 |
|-----------|------|--------|
| `ScreenTemplateProps` 타입 불일치 | 12개 | Medium |
| `TokenReference` 타입 미정의 | 6개 | High |
| `React.ComponentType` 제네릭 누락 | 3개 | Low |
| `Record<string, React.ReactNode>` 타입 추론 실패 | 2개 | Low |

**영향 범위:**
- 타입 안정성 저하
- IDE 자동완성 불완전
- 컴파일 경고 23개

#### 근본 원인 분석

1. **템플릿 시스템 급속 구현**: Phase 3 일정 압박으로 타입 정밀화 소홀
2. **TokenReference 타입 진화**: `@tekton/tokens` 패키지 업데이트와 동기화 미흡
3. **제네릭 타입 복잡도**: `ScreenTemplate<TSlots>` 제네릭 도입 고려 부족

#### 해결 로드맵

**Phase 4.4: 타입 시스템 정밀화 (4일)**

1. **Day 1: `ScreenTemplateProps` 타입 강화**

```typescript
// Before: 불완전한 타입
interface ScreenTemplateProps {
  slots?: Record<string, React.ReactNode>;
  className?: string;
  theme?: string;
}

// After: 제네릭 타입으로 슬롯 타입 안전성 확보
interface ScreenTemplateProps<TSlots extends Record<string, boolean> = Record<string, boolean>> {
  /** 슬롯 컨텐츠 (타입 안전) */
  slots?: {
    [K in keyof TSlots]?: TSlots[K] extends true
      ? React.ReactNode // Required slot
      : React.ReactNode | undefined; // Optional slot
  };
  /** 추가 CSS 클래스 */
  className?: string;
  /** 테마 오버라이드 */
  theme?: string;
}

// 사용 예시
type LoginSlots = {
  branding: false; // Optional
  footer: false; // Optional
};

const LoginTemplate: ScreenTemplate<LoginSlots> = {
  // ...
  Component: (props: ScreenTemplateProps<LoginSlots>) => {
    // props.slots?.branding은 타입 안전
  },
};
```

2. **Day 2: `TokenReference` 타입 동기화**

```typescript
// @tekton/tokens 패키지와 정확히 동기화
import type { TokenReference } from '@tekton/tokens';

// 템플릿에서 사용 시 타입 검증
interface TemplateLayout {
  type: 'full' | 'centered' | 'split' | 'sidebar';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: TokenReference; // ✅ 타입 안전
  gap?: TokenReference; // ✅ 타입 안전
}
```

3. **Day 3: `ScreenTemplate` 제네릭 타입 도입**

```typescript
// Before
interface ScreenTemplate {
  meta: ScreenTemplateMeta;
  layout: TemplateLayout;
  slots: TemplateSlot[];
  tokenBindings?: Record<string, TokenReference>;
  Component: React.ComponentType<ScreenTemplateProps>;
}

// After
interface ScreenTemplate<TSlots extends Record<string, boolean> = Record<string, boolean>> {
  meta: ScreenTemplateMeta;
  layout: TemplateLayout;
  slots: TemplateSlot[];
  tokenBindings?: Record<string, TokenReference>;
  Component: React.ComponentType<ScreenTemplateProps<TSlots>>;
}
```

4. **Day 4: 타입 검증 및 문서화**

- 모든 타입 오류 수정 확인
- TypeScript 컴파일 `--noEmit` 통과
- 타입 정의 문서 업데이트 (`docs/types.md`)

**전체 일정:**
- Day 1: ScreenTemplateProps 타입 강화
- Day 2: TokenReference 동기화
- Day 3: ScreenTemplate 제네릭 도입
- Day 4: 타입 검증 및 문서화
- **총 4일**

---

## Enhancement Opportunities

### 3. 테스트 커버리지 향상 (Priority: Medium)

현재 커버리지 91.72%를 95%+로 향상.

**미커버 영역:**
- Edge case 처리 (3.5%)
- 에러 핸들링 (2.8%)
- 타입 가드 함수 (1.98%)

**개선 계획:**
- Phase 4.5에서 추가 테스트 작성 (2일)

---

### 4. Storybook 문서화 (Priority: Low)

Optional Requirement [TAG-019]로 정의됨.

**구현 계획:**
- Phase 5에서 Storybook 설정
- 모든 컴포넌트 및 템플릿 Story 작성
- 인터랙티브 문서화 제공

---

### 5. Framer Motion 애니메이션 (Priority: Low)

Optional Requirement [TAG-018]로 정의됨.

**구현 계획:**
- Phase 5에서 애니메이션 토큰 정의
- 템플릿에 애니메이션 적용 (페이지 전환, 모달 등)

---

## 품질 개선 전략

### TRUST 5 Framework 강화

| Pillar | 현재 상태 | 개선 목표 | 조치 |
|--------|----------|----------|------|
| **Test-first** | ✅ 91.72% | 95%+ | 추가 테스트 작성 |
| **Readable** | ⚠️ 타입 오류 | ✅ 타입 안전 | 타입 정밀화 |
| **Unified** | ✅ 일관성 | ✅ 유지 | 린트 규칙 강화 |
| **Secured** | ✅ 보안 준수 | ✅ 유지 | OWASP 체크 |
| **Trackable** | ❌ TAG 누락 | ✅ 완전 추적 | TAG 주석 추가 |

**목표 TRUST 5 스코어:** 90/100 (현재 71/100 → +19점)

---

## 전체 로드맵 요약

### Phase 4: 품질 강화 (총 13일)

| Week | Focus | Tasks | 예상 일수 |
|------|-------|-------|-----------|
| **Week 1** | TAG 주석 | TAG-001 ~ TAG-020 일괄 추가 | 3일 |
|  | 자동화 | TAG 검증 스크립트 개발 | 2일 |
|  | 프로세스 | 문서화 및 교육 | 1일 |
| **Week 2** | 타입 안전 | ScreenTemplateProps, TokenReference, ScreenTemplate 타입 정밀화 | 4일 |
|  | 테스트 | 커버리지 95%+ 달성 | 2일 |
|  | 검증 | 통합 테스트 및 TRUST 5 재평가 | 1일 |

**총 13일 (약 2.5주)**

---

### Phase 5: 선택적 기능 (총 10일)

| Week | Focus | Tasks | 예상 일수 |
|------|-------|-------|-----------|
| **Week 3** | Storybook | 설정 및 Story 작성 | 5일 |
|  | 애니메이션 | Framer Motion 토큰 및 적용 | 3일 |
|  | 배포 | 문서 사이트 배포 | 2일 |

**총 10일 (약 2주)**

---

## 성공 지표

### Phase 4 완료 기준

- ✅ TAG 주석 100% 추가 완료
- ✅ TypeScript 컴파일 오류 0개
- ✅ 테스트 커버리지 95%+
- ✅ TRUST 5 스코어 90/100+
- ✅ CI/CD 파이프라인 통과

### Phase 5 완료 기준

- ✅ Storybook 문서 사이트 배포
- ✅ 애니메이션 토큰 정의 완료
- ✅ 모든 Optional Requirements 구현

---

## 위험 요소 및 완화 계획

| 위험 | 확률 | 영향 | 완화 전략 |
|------|------|------|----------|
| TAG 주석 추가 시 기능 영향 | Low | Medium | 테스트 병행, PR 리뷰 강화 |
| 타입 정밀화 중 Breaking Change | Medium | High | 버전 관리, 마이그레이션 가이드 |
| 일정 지연 | Medium | Medium | 우선순위 조정, Phase 5 일정 유연화 |
| 팀 리소스 부족 | Low | High | 외부 리뷰어 활용, 페어 프로그래밍 |

---

## 결론

Phase 3에서 템플릿 시스템의 **기능적 완성도**를 달성했으나, **품질 강화**가 필요합니다.

**핵심 개선 사항:**
1. **Critical**: TAG 주석 추가로 요구사항 추적성 확보 (6일)
2. **High**: TypeScript 타입 정밀화로 타입 안전성 강화 (4일)
3. **Medium**: 테스트 커버리지 95%+ 달성 (2일)

**Phase 4 완료 시 예상 결과:**
- TRUST 5 스코어: 71 → 90 (+19점)
- 타입 안전성: 23개 오류 → 0개
- 요구사항 추적성: 불완전 → 완전

**권장 사항:**
- Phase 4 우선 실행 (품질 강화)
- Phase 5는 선택적 실행 (리소스 및 우선순위에 따라)

---

**문서 버전**: 1.0.0
**작성일**: 2026-01-31
**작성자**: soo-kate-yeon
**다음 검토일**: Phase 4 완료 시점
