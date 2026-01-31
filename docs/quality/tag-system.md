# TAG 주석 시스템 가이드

**[TAG-Q-001] 모든 요구사항 TAG 주석 포함**

> 작성일: 2026-01-31
> 버전: 1.0.0
> 작성자: SPEC-QUALITY-001 DDD Implementation

## 목차

1. [개요](#개요)
2. [TAG 패턴](#tag-패턴)
3. [19개 요구사항 TAG 목록](#19개-요구사항-tag-목록)
4. [사용 예제](#사용-예제)
5. [검증 스크립트 사용법](#검증-스크립트-사용법)
6. [CI/CD 통합](#cicd-통합)
7. [FAQ](#faq)

---

## 개요

TAG 주석 시스템은 **요구사항-구현 추적성(Traceability)**을 보장하는 시스템입니다.

### 목적

- ✅ 요구사항과 구현 코드 간의 명확한 연결
- ✅ TRUST 5 Trackable Pillar 준수
- ✅ 유지보수성 및 리팩토링 안전성 향상

### 이점

| 항목                | 설명                                     |
| ------------------- | ---------------------------------------- |
| **추적성**          | 코드 변경 시 영향받는 요구사항 즉시 파악 |
| **리팩토링 안전성** | 요구사항 누락 없이 안전한 리팩토링       |
| **자동화**          | 검증 스크립트로 TAG 누락 자동 탐지       |
| **문서화**          | 코드 자체가 요구사항 문서 역할           |

---

## TAG 패턴

### 기본 형식

```
[TAG-{DOMAIN}-{NUMBER}]
```

- **DOMAIN**: 요구사항 도메인 (Q = Quality, U = UI, B = Backend 등)
- **NUMBER**: 3자리 일련번호 (001 ~ 999)

### 예시

- `[TAG-Q-001]`: Quality 도메인, 1번 요구사항
- `[TAG-U-003]`: UI 도메인, 3번 요구사항
- `[TAG-B-012]`: Backend 도메인, 12번 요구사항

---

## 19개 요구사항 TAG 목록

### Ubiquitous Requirements (항상 활성)

| TAG           | 요구사항                                | 설명                                    |
| ------------- | --------------------------------------- | --------------------------------------- |
| **TAG-Q-001** | 모든 요구사항 TAG 주석 포함             | 모든 구현 코드에 해당 요구사항 TAG 추가 |
| **TAG-Q-002** | TypeScript strict mode 오류 없이 컴파일 | 타입 안전성 보장                        |
| **TAG-Q-003** | 테스트 커버리지 95% 이상 유지           | 높은 커버리지로 버그 조기 발견          |
| **TAG-Q-004** | TRUST 5 Framework 5개 Pillar 준수       | 종합 품질 프레임워크 준수               |
| **TAG-Q-005** | CI/CD 파이프라인 품질 게이트 통과       | 자동화된 검증                           |

### Event-Driven Requirements (이벤트 기반)

| TAG           | 요구사항                            | 트리거               |
| ------------- | ----------------------------------- | -------------------- |
| **TAG-Q-006** | 코드 커밋 시 TAG 검증 스크립트 실행 | Git commit           |
| **TAG-Q-007** | TypeScript 컴파일 시 타입 오류 감지 | `tsc --noEmit`       |
| **TAG-Q-008** | 테스트 실행 시 커버리지 리포트 생성 | `pnpm test:coverage` |
| **TAG-Q-009** | PR 생성 시 품질 게이트 자동 검증    | Pull Request         |

### State-Driven Requirements (상태 기반)

| TAG           | 요구사항                                 | 조건                |
| ------------- | ---------------------------------------- | ------------------- |
| **TAG-Q-010** | TAG 주석 누락 시 CI/CD 실패              | TAG 커버리지 < 100% |
| **TAG-Q-011** | TypeScript 타입 오류 존재 시 빌드 실패   | 타입 오류 > 0       |
| **TAG-Q-012** | 테스트 커버리지 95% 미만 시 PR 머지 차단 | 커버리지 < 95%      |
| **TAG-Q-013** | TRUST 5 스코어 90 미만 시 경고 표시      | TRUST 5 < 90/100    |

### Unwanted Behavior (금지 행위)

| TAG           | 금지 행위                             | 이유             |
| ------------- | ------------------------------------- | ---------------- |
| **TAG-Q-014** | TAG 주석 없이 요구사항 코드 구현 금지 | 추적성 파괴      |
| **TAG-Q-015** | 타입 오류 `@ts-ignore`로 회피 금지    | 타입 안전성 우회 |
| **TAG-Q-016** | 테스트 커버리지 목표 낮춤 금지        | 품질 기준 약화   |

### Optional Requirements (선택 요구사항)

| TAG           | 요구사항                            | 우선순위 |
| ------------- | ----------------------------------- | -------- |
| **TAG-Q-017** | TAG 주석 자동 생성 VSCode Extension | Low      |
| **TAG-Q-018** | 품질 메트릭 대시보드 제공           | Medium   |
| **TAG-Q-019** | 타입 정밀화 가이드 문서             | Low      |
| **TAG-Q-020** | tsconfig.json 테스트 파일 제외      | High ✅  |
| **TAG-Q-021** | 검증 스크립트 Worker Threads 활용   | Medium   |

---

## 사용 예제

### 1. 컴포넌트 파일

```typescript
/**
 * @tekton/ui - Button Component
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: 코드 품질 및 추적성을 보장
 * IMPACT: TAG 누락 시 요구사항 추적 불가
 */

export function Button({ children, ...props }: ButtonProps) {
  return <button {...props}>{children}</button>;
}
```

### 2. 유틸리티 파일

```typescript
/**
 * @tekton/ui - Utility Functions
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: 유틸리티 함수가 코드 재사용성을 보장
 * IMPACT: 유틸리티 오류 시 전체 컴포넌트 영향
 */

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

### 3. 타입 선언 파일

```typescript
/**
 * @tekton/ui - vitest-axe Type Declarations
 *
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-015] 타입 오류 @ts-ignore로 회피 금지
 *
 * WHY: vitest-axe의 toHaveNoViolations 메서드 타입이 누락
 * IMPACT: 타입 정의 누락 시 21개 TypeScript 컴파일 오류 발생
 */

declare module 'vitest' {
  interface Assertion<T = any> {
    toHaveNoViolations(): void;
  }
}
```

---

## 검증 스크립트 사용법

### 로컬 검증

```bash
# TAG 검증 실행
pnpm run validate:tags

# 출력 예시:
# ============================================================
# 🏷️  TAG Validation Report
# ============================================================
# Files Analyzed: 34
# ✅ Passed: 34
# ❌ Failed: 0
# 📊 Total TAGs: 102
# 📈 Coverage: 100.00%
```

### 실패 시

```bash
# 출력 예시:
# ❌ Failed Files:
# 1. components/button.tsx
#    Reason: No TAG annotations found (required: at least 1)
#
# 💡 Tip: Add TAG annotations in the format [TAG-Q-XXX]
#    See docs/quality/tag-system.md for details.
```

### 자동 TAG 추가 (컴포넌트만)

```bash
# 일괄 TAG 추가 스크립트 실행
bash .moai/scripts/add-tags.sh
```

---

## CI/CD 통합

### Pre-commit Hook

커밋 전 자동 TAG 검증:

```bash
# .husky/pre-commit
echo "🏷️  Validating TAG annotations..."
pnpm run validate:tags || {
  echo "❌ TAG validation failed."
  exit 1
}
```

### GitHub Actions

```yaml
# .github/workflows/quality-gate.yml
- name: Validate TAG annotations
  run: pnpm run validate:tags
```

---

## FAQ

### Q1: 모든 파일에 TAG를 추가해야 하나요?

**A**: 구현 파일(`.ts`, `.tsx`)에만 추가합니다. 테스트 파일과 타입 선언 파일(`.d.ts`)은 제외됩니다.

**제외 대상**:

- `**/__tests__/**`
- `**/*.test.ts`
- `**/*.test.tsx`
- `node_modules/`
- `dist/`

### Q2: 어떤 TAG를 사용해야 하나요?

**A**: 기본적으로 다음 3개 TAG를 모든 파일에 추가합니다:

- `[TAG-Q-001]`: 모든 요구사항 TAG 주석 포함
- `[TAG-Q-002]`: TypeScript strict mode 오류 없이 컴파일
- `[TAG-Q-004]`: TRUST 5 Framework 5개 Pillar 준수

추가로 파일의 특성에 맞는 TAG를 선택적으로 추가할 수 있습니다.

### Q3: TAG 검증이 실패하면 어떻게 하나요?

**A**:

1. 실패 메시지에서 누락된 파일 확인
2. 해당 파일에 TAG 주석 추가
3. `pnpm validate:tags` 재실행
4. 커밋 진행

### Q4: 성능은 괜찮나요?

**A**:

- **현재**: 34개 파일 검증 < 0.01초
- **목표**: 500개 파일 검증 < 5초
- **Worker Threads**: 대용량 프로젝트에서 병렬 처리 지원 (TAG-Q-021)

### Q5: VSCode Extension이 있나요?

**A**: 현재는 없습니다. TAG-Q-017로 계획 중이며, 선택적 요구사항입니다.

---

## 참조

- [SPEC-QUALITY-001](../../.moai/specs/SPEC-QUALITY-001/spec.md): UI Library Quality Enhancement
- [validate-tags.ts](../../.moai/scripts/validate-tags.ts): TAG 검증 스크립트
- [TRUST 5 Framework](./trust-5-framework.md): 품질 프레임워크 문서

---

**문서 버전**: 1.0.0
**최종 업데이트**: 2026-01-31
**Status**: ✅ Phase 4.1 Complete
