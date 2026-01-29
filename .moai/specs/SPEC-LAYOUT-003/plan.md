# SPEC-LAYOUT-003: Implementation Plan

## 구현 계획서

### 1. 개요

| 항목 | 내용 |
|------|------|
| SPEC ID | SPEC-LAYOUT-003 |
| 제목 | Responsive Web Enhancement |
| 우선순위 | HIGH |
| 예상 복잡도 | Medium |
| 의존성 | SPEC-LAYOUT-001 (완료) |

---

### 2. Milestone 분해

#### Milestone 1: xl/2xl 브레이크포인트 활성화 (Low Complexity)

**목표**: 기존 ResponsiveConfig에서 미사용 중인 xl/2xl 브레이크포인트 활성화

**태스크**:
| # | 태스크 | 파일 | 예상 시간 |
|---|--------|------|----------|
| 1.1 | BREAKPOINTS 상수 정의 및 export | `types.ts` | 15분 |
| 1.2 | 모든 ShellToken에 xl/2xl 설정 추가 | `shells.ts` | 30분 |
| 1.3 | 모든 PageLayoutToken에 xl/2xl 설정 추가 | `pages.ts` | 45분 |
| 1.4 | 모든 SectionPatternToken에 xl/2xl 설정 추가 | `sections.ts` | 45분 |
| 1.5 | 단위 테스트 작성 | `__tests__/responsive.test.ts` | 30분 |

**산출물**:
- 6개 ShellToken에 xl/2xl responsive 설정
- 8개 PageLayoutToken에 xl/2xl responsive 설정
- 13개 SectionPatternToken에 xl/2xl responsive 설정

---

#### Milestone 2: Container Queries 지원 (Medium Complexity)

**목표**: 컴포넌트 레벨 반응형을 위한 Container Query 시스템 구현

**태스크**:
| # | 태스크 | 파일 | 예상 시간 |
|---|--------|------|----------|
| 2.1 | ContainerQueryConfig 타입 정의 | `types.ts` | 30분 |
| 2.2 | CONTAINER_BREAKPOINTS 상수 정의 | `types.ts` | 15분 |
| 2.3 | Container Query CSS 생성 함수 | `layout-css-generator.ts` | 1시간 |
| 2.4 | SectionPatternToken에 containerQuery 옵션 추가 | `sections.ts` | 45분 |
| 2.5 | 폴백 CSS 생성 로직 | `layout-css-generator.ts` | 45분 |
| 2.6 | 단위 테스트 및 브라우저 테스트 | `__tests__/container-query.test.ts` | 1시간 |

**산출물**:
- ContainerQueryConfig 인터페이스
- generateContainerQueryCSS() 함수
- @supports 폴백 로직

---

#### Milestone 3: Portrait/Landscape 방향 지원 (Medium Complexity)

**목표**: 디바이스 방향 변경에 대응하는 레이아웃 시스템 구현

**태스크**:
| # | 태스크 | 파일 | 예상 시간 |
|---|--------|------|----------|
| 3.1 | OrientationConfig 타입 정의 | `types.ts` | 20분 |
| 3.2 | FullResponsiveConfig 타입 정의 | `types.ts` | 15분 |
| 3.3 | 방향 감지 유틸리티 함수 | `responsive.ts` (신규) | 45분 |
| 3.4 | Orientation CSS 생성 함수 | `layout-css-generator.ts` | 45분 |
| 3.5 | ShellToken에 orientation 옵션 추가 | `shells.ts` | 30분 |
| 3.6 | 단위 테스트 | `__tests__/orientation.test.ts` | 30분 |

**산출물**:
- OrientationConfig 인터페이스
- generateOrientationCSS() 함수
- 방향 감지 훅/유틸리티

---

#### Milestone 4: 테스트 및 문서화 (Low Complexity)

**목표**: 전체 기능 테스트 및 문서 업데이트

**태스크**:
| # | 태스크 | 파일 | 예상 시간 |
|---|--------|------|----------|
| 4.1 | 통합 테스트 작성 | `__tests__/integration/` | 1시간 |
| 4.2 | 브라우저 호환성 테스트 | Playwright | 1시간 |
| 4.3 | API 문서 업데이트 | `docs/` | 30분 |
| 4.4 | 사용 예제 작성 | `examples/` | 30분 |

---

### 3. 파일 변경 상세

#### 3.1 types.ts 변경사항

```typescript
// 추가할 내용
export const BREAKPOINTS = { ... };
export const CONTAINER_BREAKPOINTS = { ... };
export interface ContainerQueryConfig { ... }
export interface ContainerBreakpointConfig { ... }
export interface OrientationConfig<T> { ... }
export interface FullResponsiveConfig<T> { ... }
```

#### 3.2 shells.ts 변경사항

```typescript
// 각 ShellToken의 responsive에 xl/2xl 추가
export const SHELL_WEB_APP: ShellToken = {
  // ...기존 설정
  responsive: {
    default: { ... },
    md: { ... },
    lg: { ... },
    xl: {                    // 추가
      sidebarWidth: 'atomic.spacing.72',
      headerHeight: 'atomic.spacing.18',
    },
    '2xl': {                 // 추가
      sidebarWidth: 'atomic.spacing.80',
      contentMaxWidth: 'atomic.spacing.320',
    },
  },
};
```

#### 3.3 신규 파일: responsive.ts

```typescript
// packages/core/src/layout-tokens/responsive.ts
export function useOrientation(): 'portrait' | 'landscape';
export function useBreakpoint(): BreakpointKey;
export function useContainerQuery(name: string): ContainerBreakpointConfig | null;
```

---

### 4. 테스트 전략

#### 4.1 단위 테스트
- ResponsiveConfig의 모든 브레이크포인트 검증
- ContainerQueryConfig CSS 생성 검증
- OrientationConfig CSS 생성 검증

#### 4.2 통합 테스트
- Shell + Page + Section 조합 테스트
- 브레이크포인트 전환 시 레이아웃 검증

#### 4.3 브라우저 테스트 (Playwright)
- Chrome, Safari, Firefox에서 Container Query 동작
- 디바이스 회전 시뮬레이션
- xl/2xl 뷰포트 크기 테스트

---

### 5. 위험 요소 및 완화 방안

| 위험 요소 | 영향도 | 완화 방안 |
|----------|--------|----------|
| Container Query 브라우저 미지원 | Medium | @supports 폴백 제공 |
| 기존 레이아웃 깨짐 | High | 점진적 활성화, 기존 default/md/lg 유지 |
| 성능 영향 | Low | CSS 최적화, 불필요한 쿼리 제거 |

---

### 6. 일정 추정

| Milestone | 예상 시간 | 누적 |
|-----------|----------|------|
| M1: xl/2xl 활성화 | 2.75시간 | 2.75시간 |
| M2: Container Queries | 4.75시간 | 7.5시간 |
| M3: Orientation | 3시간 | 10.5시간 |
| M4: 테스트/문서화 | 3시간 | 13.5시간 |

**총 예상 시간**: 약 13.5시간 (2일 작업)

---

### 7. 성공 기준

- [ ] 모든 기존 토큰에 xl/2xl 설정 추가됨
- [ ] Container Query CSS가 올바르게 생성됨
- [ ] Orientation CSS가 올바르게 생성됨
- [ ] 폴백 로직이 미지원 브라우저에서 동작함
- [ ] 모든 테스트 통과 (커버리지 80% 이상)
- [ ] 기존 레이아웃과의 하위 호환성 유지
