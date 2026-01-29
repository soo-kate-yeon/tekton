# SPEC-LAYOUT-004: Implementation Plan

## 구현 계획서

### 1. 개요

| 항목 | 내용 |
|------|------|
| SPEC ID | SPEC-LAYOUT-004 |
| 제목 | Mobile Platform Shell Tokens |
| 우선순위 | HIGH |
| 예상 복잡도 | High |
| 의존성 | SPEC-LAYOUT-001 (완료), SPEC-LAYOUT-003 (권장) |

---

### 2. Milestone 분해

#### Milestone 1: 타입 시스템 확장 (High Complexity)

**목표**: MobileShellToken 및 관련 인터페이스 정의

**태스크**:
| # | 태스크 | 파일 | 예상 시간 |
|---|--------|------|----------|
| 1.1 | MobileShellToken 인터페이스 정의 | `types.ts` | 45분 |
| 1.2 | SafeAreaConfig 인터페이스 정의 | `types.ts` | 30분 |
| 1.3 | SystemUIConfig 인터페이스 정의 | `types.ts` | 30분 |
| 1.4 | KeyboardConfig 인터페이스 정의 | `types.ts` | 30분 |
| 1.5 | BottomTabConfig 인터페이스 정의 | `types.ts` | 30분 |
| 1.6 | TouchTargetConfig 인터페이스 정의 | `types.ts` | 20분 |
| 1.7 | 상수 정의 (TOUCH_TARGET, SAFE_AREA_DEFAULTS) | `types.ts` | 20분 |

**산출물**:
- 6개 주요 인터페이스
- 플랫폼별 상수 정의

---

#### Milestone 2: 6개 모바일 셸 토큰 구현 (High Complexity)

**목표**: shell.mobile.* 네임스페이스의 셸 토큰 구현

**태스크**:
| # | 태스크 | 파일 | 예상 시간 |
|---|--------|------|----------|
| 2.1 | SHELL_MOBILE_APP 구현 | `mobile-shells.ts` | 1시간 |
| 2.2 | SHELL_MOBILE_FULLSCREEN 구현 | `mobile-shells.ts` | 45분 |
| 2.3 | SHELL_MOBILE_MODAL 구현 | `mobile-shells.ts` | 45분 |
| 2.4 | SHELL_MOBILE_TAB 구현 | `mobile-shells.ts` | 1시간 |
| 2.5 | SHELL_MOBILE_DRAWER 구현 | `mobile-shells.ts` | 1시간 |
| 2.6 | SHELL_MOBILE_DETAIL 구현 | `mobile-shells.ts` | 45분 |
| 2.7 | getMobileShellToken() 유틸리티 함수 | `mobile-shells.ts` | 30분 |
| 2.8 | getAllMobileShellTokens() 유틸리티 함수 | `mobile-shells.ts` | 15분 |

**산출물**:
- 6개 MobileShellToken 객체
- 2개 유틸리티 함수

---

#### Milestone 3: SafeArea 유틸리티 구현 (Medium Complexity)

**목표**: SafeArea 계산 및 적용 유틸리티

**태스크**:
| # | 태스크 | 파일 | 예상 시간 |
|---|--------|------|----------|
| 3.1 | getSafeAreaInsets() 함수 | `safe-area.ts` | 1시간 |
| 3.2 | applySafeAreaToLayout() 함수 | `safe-area.ts` | 1시간 |
| 3.3 | detectDeviceType() 함수 | `safe-area.ts` | 45분 |
| 3.4 | useSafeArea() 훅 (React Native) | `safe-area.ts` | 1시간 |
| 3.5 | SafeArea 단위 테스트 | `__tests__/safe-area.test.ts` | 45분 |

**산출물**:
- SafeArea 유틸리티 모듈
- useSafeArea 훅

---

#### Milestone 4: 키보드 처리 유틸리티 구현 (Medium Complexity)

**목표**: 키보드 표시/숨김에 따른 레이아웃 조정

**태스크**:
| # | 태스크 | 파일 | 예상 시간 |
|---|--------|------|----------|
| 4.1 | getKeyboardHeight() 함수 | `keyboard.ts` | 45분 |
| 4.2 | applyKeyboardAvoidance() 함수 | `keyboard.ts` | 1시간 |
| 4.3 | useKeyboardAvoidance() 훅 | `keyboard.ts` | 1시간 |
| 4.4 | 키보드 이벤트 리스너 설정 | `keyboard.ts` | 45분 |
| 4.5 | Keyboard 단위 테스트 | `__tests__/keyboard.test.ts` | 45분 |

**산출물**:
- Keyboard 유틸리티 모듈
- useKeyboardAvoidance 훅

---

#### Milestone 5: 터치 타겟 유틸리티 구현 (Low Complexity)

**목표**: 터치 타겟 크기 검증 및 적용

**태스크**:
| # | 태스크 | 파일 | 예상 시간 |
|---|--------|------|----------|
| 5.1 | validateTouchTarget() 함수 | `touch-target.ts` | 30분 |
| 5.2 | applyMinTouchTarget() 함수 | `touch-target.ts` | 30분 |
| 5.3 | getHitSlop() 함수 | `touch-target.ts` | 30분 |
| 5.4 | Touch Target 단위 테스트 | `__tests__/touch-target.test.ts` | 30분 |

**산출물**:
- Touch Target 유틸리티 모듈

---

#### Milestone 6: 테스트 및 문서화 (Medium Complexity)

**목표**: 통합 테스트 및 문서 업데이트

**태스크**:
| # | 태스크 | 파일 | 예상 시간 |
|---|--------|------|----------|
| 6.1 | 통합 테스트 작성 | `__tests__/integration/` | 2시간 |
| 6.2 | iOS 시뮬레이터 테스트 | Detox/Maestro | 1.5시간 |
| 6.3 | Android 에뮬레이터 테스트 | Detox/Maestro | 1.5시간 |
| 6.4 | API 문서 업데이트 | `docs/` | 1시간 |
| 6.5 | 사용 예제 작성 | `examples/` | 1시간 |

---

### 3. 파일 변경 상세

#### 3.1 types.ts 추가 내용

```typescript
// MobileShellToken 및 관련 타입
export interface MobileShellToken extends ShellToken { ... }
export interface SafeAreaConfig { ... }
export interface SystemUIConfig { ... }
export interface KeyboardConfig { ... }
export interface BottomTabConfig { ... }
export interface TouchTargetConfig { ... }

export const TOUCH_TARGET = { ... };
export const SAFE_AREA_DEFAULTS = { ... };
```

#### 3.2 신규 파일: mobile-shells.ts

```typescript
// 6개 모바일 셸 토큰
export const SHELL_MOBILE_APP: MobileShellToken = { ... };
export const SHELL_MOBILE_FULLSCREEN: MobileShellToken = { ... };
export const SHELL_MOBILE_MODAL: MobileShellToken = { ... };
export const SHELL_MOBILE_TAB: MobileShellToken = { ... };
export const SHELL_MOBILE_DRAWER: MobileShellToken = { ... };
export const SHELL_MOBILE_DETAIL: MobileShellToken = { ... };

// 유틸리티 함수
export function getMobileShellToken(id: string): MobileShellToken | undefined;
export function getAllMobileShellTokens(): MobileShellToken[];
export function getMobileShellsByOS(os: 'ios' | 'android' | 'cross-platform'): MobileShellToken[];
```

#### 3.3 신규 파일: safe-area.ts

```typescript
export function getSafeAreaInsets(): SafeAreaInsets;
export function applySafeAreaToLayout(layout: Layout, config: SafeAreaConfig): Layout;
export function detectDeviceType(): DeviceType;
export function useSafeArea(): SafeAreaInsets;
```

#### 3.4 신규 파일: keyboard.ts

```typescript
export function getKeyboardHeight(): number;
export function applyKeyboardAvoidance(layout: Layout, config: KeyboardConfig): Layout;
export function useKeyboardAvoidance(): KeyboardState;
```

---

### 4. 테스트 전략

#### 4.1 단위 테스트
- 모든 MobileShellToken 속성 검증
- SafeArea 계산 로직 검증
- 키보드 높이 계산 검증
- 터치 타겟 크기 검증

#### 4.2 통합 테스트
- Shell + SafeArea + Keyboard 조합 테스트
- 플랫폼별 동작 검증

#### 4.3 디바이스 테스트 (Detox/Maestro)
- iPhone 14 Pro (다이내믹 아일랜드)
- iPhone SE (비노치)
- Pixel 7 (제스처 네비게이션)
- Galaxy S23 (버튼 네비게이션)

---

### 5. 의존성

#### 5.1 React Native 패키지

```json
{
  "dependencies": {
    "react-native-safe-area-context": "^4.10.0",
    "react-native-keyboard-controller": "^1.12.0"
  },
  "peerDependencies": {
    "react-native": ">=0.72.0"
  }
}
```

#### 5.2 Expo 호환성

```json
{
  "expo": {
    "plugins": [
      "expo-safe-area-context"
    ]
  }
}
```

---

### 6. 위험 요소 및 완화 방안

| 위험 요소 | 영향도 | 완화 방안 |
|----------|--------|----------|
| 디바이스별 SafeArea 차이 | High | 포괄적 디바이스 데이터베이스 구축 |
| 키보드 높이 불일치 (Android 제조사별) | Medium | 폴백 값 제공 및 런타임 측정 |
| React Native 버전 호환성 | Medium | 최소 버전 명시 및 폴리필 |
| Expo vs Bare RN 차이 | Low | 두 환경 모두 테스트 |

---

### 7. 일정 추정

| Milestone | 예상 시간 | 누적 |
|-----------|----------|------|
| M1: 타입 시스템 | 3.75시간 | 3.75시간 |
| M2: 모바일 셸 | 5.75시간 | 9.5시간 |
| M3: SafeArea | 4.5시간 | 14시간 |
| M4: Keyboard | 4.25시간 | 18.25시간 |
| M5: Touch Target | 2시간 | 20.25시간 |
| M6: 테스트/문서화 | 7시간 | 27.25시간 |

**총 예상 시간**: 약 27.25시간 (4-5일 작업)

---

### 8. 성공 기준

- [ ] 6개 모바일 셸 토큰 구현 완료
- [ ] iOS SafeArea 정상 동작 (노치, 다이내믹 아일랜드)
- [ ] Android WindowInsets 정상 동작
- [ ] 키보드 회피 동작 정상
- [ ] 터치 타겟 최소 44pt 검증 통과
- [ ] iOS/Android 시뮬레이터 테스트 통과
- [ ] 테스트 커버리지 80% 이상
