---
id: SPEC-LAYOUT-004
version: "1.0.0"
status: completed
created: "2026-01-29"
updated: "2026-01-29"
author: soo-kate-yeon
priority: high
completed: "2026-01-29"
---

## HISTORY

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 1.0.0 | 2026-01-29 | soo-kate-yeon | 초안 작성 |
| 1.0.0 | 2026-01-29 | soo-kate-yeon | 구현 완료 및 검증 |

---

# SPEC-LAYOUT-004: Mobile Platform Shell Tokens

## 0. 구현 상태

### 완료된 마일스톤

| 마일스톤 | 설명 | 상태 | 완료일 |
|---------|------|------|--------|
| M1 | MobileShellToken 타입 정의 | ✅ 완료 | 2026-01-29 |
| M2 | 6개 모바일 셸 토큰 구현 | ✅ 완료 | 2026-01-29 |
| M3 | SafeArea 유틸리티 구현 | ✅ 완료 | 2026-01-29 |
| M4 | 키보드 처리 유틸리티 구현 | ✅ 완료 | 2026-01-29 |
| M5 | 터치 타겟 유틸리티 구현 | ✅ 완료 | 2026-01-29 |
| M6 | 통합 테스트 및 검증 | ✅ 완료 | 2026-01-29 |

### 구현 파일

| 파일 | 라인 수 | 상태 | 설명 |
|------|---------|------|------|
| `types.ts` | 359 | ✅ 완료 | MobileShellToken, SafeAreaConfig 등 타입 정의 |
| `mobile-shells.ts` | 652 | ✅ 완료 | 6개 모바일 셸 토큰 구현 |
| `safe-area.ts` | 380 | ✅ 완료 | SafeArea 유틸리티 함수 |
| `keyboard.ts` | 507 | ✅ 완료 | 키보드 처리 유틸리티 |
| `touch-target.ts` | 192 | ✅ 완료 | 터치 타겟 유틸리티 |

### 테스트 커버리지

| 메트릭 | 값 |
|--------|-----|
| **전체 테스트** | 310개 |
| **테스트 성공률** | 100% (310/310 통과) |
| **코드 커버리지** | 92.77% |
| **테스트 파일** | 5개 |

#### 테스트 파일 상세

| 파일 | 테스트 수 | 상태 |
|------|-----------|------|
| `safe-area.test.ts` | 38 | ✅ 통과 |
| `keyboard.test.ts` | 58 | ✅ 통과 |
| `mobile-integration.test.ts` | 30 | ✅ 통과 |
| `touch-target.test.ts` | 78 | ✅ 통과 |
| `mobile-shells.test.ts` | 106 | ✅ 통과 |

### 품질 검증

| 품질 항목 | 상태 | 비고 |
|----------|------|------|
| TypeScript 컴파일 | ✅ 통과 | 타입 오류 없음 |
| 린트 검사 | ✅ 통과 | ESLint 규칙 준수 |
| 테스트 커버리지 | ✅ 통과 | 92.77% (목표: 85% 이상) |
| 요구사항 충족 | ✅ 통과 | 모든 EARS 요구사항 구현 |
| 문서화 | ✅ 완료 | TSDoc 주석 완비 |

---

## 1. 개요

### 1.1 목적
모바일 플랫폼(iOS/Android)을 위한 전용 Shell Token을 구현하여 SafeArea, 시스템 UI, 키보드 처리, 터치 타겟 등 모바일 특화 레이아웃을 지원합니다.

### 1.2 범위
- iOS SafeArea (노치, 다이내믹 아일랜드, 홈 인디케이터)
- Android System UI (상태바, 네비게이션 바)
- 소프트웨어 키보드 처리
- 터치 타겟 최소 크기 (44x44pt)
- Bottom Tab Navigation
- 6개 모바일 셸 토큰 구현

### 1.3 의존성
- SPEC-LAYOUT-001 (Layout Token System) - 완료됨
- SPEC-LAYOUT-003 (Responsive Web Enhancement) - 권장

### 1.4 제외 항목
- 웹 뷰 레이아웃 (Web Shell 영역)
- Wear OS / watchOS 레이아웃

---

## 2. Environment (환경)

```
Current System:
  - ShellToken.platform이 'web' | 'mobile' | 'desktop' 지원
  - 현재 'web' 플랫폼만 구현됨 (6개 셸)
  - 'mobile' 플랫폼 셸 0개

Technology Stack:
  - React Native 0.75+
  - iOS SafeAreaInsets (iOS 11+)
  - Android WindowInsets (API 28+)
  - Expo (선택적)

Integration Points:
  - packages/core/src/layout-tokens/types.ts (MobileShellToken 추가)
  - packages/core/src/layout-tokens/mobile-shells.ts (신규)
  - packages/core/src/layout-tokens/safe-area.ts (신규)
  - packages/core/src/layout-tokens/keyboard.ts (신규)
```

---

## 3. Assumptions (가정)

| ID | 가정 | 근거 |
|----|------|------|
| A-001 | iOS SafeArea 처리가 노치/다이내믹 아일랜드 디바이스에 필수 | iPhone X 이후 모든 기기에 노치 또는 다이내믹 아일랜드 존재 |
| A-002 | Android System UI 처리가 일관된 UX에 필요 | 제조사별 다른 네비게이션 바 높이 |
| A-003 | 소프트웨어 키보드가 레이아웃에 미치는 영향을 토큰화해야 함 | 입력 폼 UX 개선 필수 |
| A-004 | 44x44pt 최소 터치 타겟이 접근성 필수 요구사항 | Apple/Google HIG 권장사항 |
| A-005 | Bottom Tab이 모바일 앱의 주요 네비게이션 패턴 | 80% 이상의 앱에서 사용 |

---

## 4. Requirements (요구사항)

### 4.1 Ubiquitous Requirements (항상 적용)

| ID | 요구사항 |
|----|----------|
| U-001 | 시스템은 **항상** iOS SafeAreaInsets를 모바일 셸 레이아웃에 반영해야 한다 |
| U-002 | 시스템은 **항상** 터치 타겟에 최소 44x44pt (176x176 CSS pixels @4x)를 적용해야 한다 |
| U-003 | 시스템은 **항상** 플랫폼별 네이티브 UI 가이드라인을 준수해야 한다 |
| U-004 | 시스템은 **항상** 홈 인디케이터 영역을 콘텐츠로 침범하지 않아야 한다 |

### 4.2 Event-Driven Requirements (이벤트 기반)

| ID | 요구사항 |
|----|----------|
| E-001 | **WHEN** 소프트웨어 키보드가 표시되면 **THEN** 메인 콘텐츠 영역을 키보드 높이만큼 축소해야 한다 |
| E-002 | **WHEN** Bottom Tab이 숨겨지면 **THEN** 메인 콘텐츠 영역을 확장해야 한다 |
| E-003 | **WHEN** 상태바 스타일이 변경되면 **THEN** 헤더 배경색을 조정해야 한다 |
| E-004 | **WHEN** SafeArea 값이 변경되면 **THEN** 레이아웃을 즉시 재계산해야 한다 |

### 4.3 State-Driven Requirements (상태 기반)

| ID | 요구사항 |
|----|----------|
| S-001 | **IF** 플랫폼이 'mobile'이고 OS가 'ios'이면 **THEN** SafeArea 토큰을 적용해야 한다 |
| S-002 | **IF** 플랫폼이 'mobile'이고 OS가 'android'이면 **THEN** WindowInsets 토큰을 적용해야 한다 |
| S-003 | **IF** 디바이스가 노치 디바이스이면 **THEN** safe-area-inset-top 최소 44pt를 적용해야 한다 |
| S-004 | **IF** 디바이스가 다이내믹 아일랜드 디바이스이면 **THEN** safe-area-inset-top 최소 59pt를 적용해야 한다 |
| S-005 | **IF** 키보드가 활성화 상태이면 **THEN** keyboard.avoidance 전략을 적용해야 한다 |

### 4.4 Unwanted Behavior (금지 동작)

| ID | 요구사항 |
|----|----------|
| UW-001 | 시스템은 SafeArea를 무시하는 레이아웃을 생성하지 **않아야 한다** |
| UW-002 | 시스템은 44pt 미만의 터치 타겟을 허용하지 **않아야 한다** |
| UW-003 | 시스템은 키보드가 입력 필드를 가리도록 **허용하지 않아야 한다** |
| UW-004 | 시스템은 홈 인디케이터 영역에 인터랙티브 요소를 배치하지 **않아야 한다** |

### 4.5 Optional Requirements (선택적)

| ID | 요구사항 |
|----|----------|
| O-001 | **가능하면** 제스처 네비게이션 감지 및 적응 제공 |
| O-002 | **가능하면** 폴더블 디바이스의 힌지 영역 감지 제공 |

---

## 5. Technical Specifications (기술 명세)

### 5.1 MobileShellToken 인터페이스

```typescript
/**
 * Mobile Shell Token - Extends ShellToken for mobile platforms
 */
export interface MobileShellToken extends ShellToken {
  /** Fixed platform type for mobile shells */
  platform: 'mobile';

  /** Target operating system */
  os: 'ios' | 'android' | 'cross-platform';

  /** Safe area configuration */
  safeArea: SafeAreaConfig;

  /** System UI configuration */
  systemUI: SystemUIConfig;

  /** Keyboard handling configuration */
  keyboard: KeyboardConfig;

  /** Bottom tab configuration (optional) */
  bottomTab?: BottomTabConfig;

  /** Touch target configuration */
  touchTarget: TouchTargetConfig;
}
```

### 5.2 SafeArea 설정

```typescript
/**
 * SafeArea configuration for iOS notch/dynamic island handling
 */
export interface SafeAreaConfig {
  /** Top safe area inset token */
  top: TokenReference;

  /** Bottom safe area inset token */
  bottom: TokenReference;

  /** Left safe area inset token */
  left: TokenReference;

  /** Right safe area inset token */
  right: TokenReference;

  /** Device-specific defaults */
  defaults: SafeAreaDefaults;

  /** Edge behavior */
  edges: SafeAreaEdges;
}

export interface SafeAreaDefaults {
  /** Standard notch device (iPhone X-14) */
  notch: number;              // 44pt

  /** Dynamic Island device (iPhone 14 Pro+) */
  dynamicIsland: number;      // 59pt

  /** Home indicator height */
  homeIndicator: number;      // 34pt

  /** Standard status bar (non-notch) */
  statusBar: number;          // 20pt
}

export interface SafeAreaEdges {
  /** Apply safe area to top edge */
  top: boolean;

  /** Apply safe area to bottom edge */
  bottom: boolean;

  /** Apply safe area to horizontal edges */
  horizontal: boolean;
}
```

### 5.3 시스템 UI 설정

```typescript
/**
 * System UI configuration for status bar and navigation bar
 */
export interface SystemUIConfig {
  /** Status bar configuration */
  statusBar: StatusBarConfig;

  /** Navigation bar configuration (Android) */
  navigationBar: NavigationBarConfig;
}

export interface StatusBarConfig {
  /** Status bar height token */
  height: TokenReference;

  /** Visibility */
  visible: boolean;

  /** Status bar style */
  style: 'light-content' | 'dark-content' | 'auto';

  /** Background color (transparent for edge-to-edge) */
  backgroundColor?: TokenReference;

  /** Translucent mode */
  translucent: boolean;
}

export interface NavigationBarConfig {
  /** Navigation bar height token */
  height: TokenReference;

  /** Display mode */
  mode: 'overlay' | 'inset' | 'hidden';

  /** Navigation bar color */
  backgroundColor?: TokenReference;

  /** Button style (light/dark icons) */
  buttonStyle: 'light' | 'dark' | 'auto';
}
```

### 5.4 키보드 설정

```typescript
/**
 * Keyboard handling configuration
 */
export interface KeyboardConfig {
  /** Keyboard avoidance strategy */
  avoidance: 'padding' | 'resize' | 'position' | 'none';

  /** Behavior when keyboard appears */
  behavior: 'height' | 'position' | 'padding';

  /** Animation configuration */
  animation: KeyboardAnimationConfig;

  /** Keyboard dismiss mode */
  dismissMode: 'on-drag' | 'interactive' | 'none';
}

export interface KeyboardAnimationConfig {
  /** Animation duration in milliseconds */
  duration: number;           // iOS: 250ms, Android: 300ms

  /** Easing function */
  easing: string;             // 'keyboard' | 'easeInOut'

  /** Enable animation */
  enabled: boolean;
}
```

### 5.5 Bottom Tab 설정

```typescript
/**
 * Bottom Tab Navigation configuration
 */
export interface BottomTabConfig {
  /** Tab bar height token */
  height: TokenReference;

  /** Safe area bottom inclusion */
  safeAreaBottom: TokenReference;

  /** Total height (height + safeAreaBottom) */
  totalHeight: TokenReference;

  /** Visibility behavior */
  visibility: 'always' | 'scroll-hide' | 'route-based';

  /** Maximum number of tabs */
  maxItems: number;           // Recommended: 5

  /** Tab item configuration */
  item: BottomTabItemConfig;
}

export interface BottomTabItemConfig {
  /** Minimum touch target size */
  minTouchTarget: TokenReference;

  /** Icon size */
  iconSize: TokenReference;

  /** Label font size */
  labelSize: TokenReference;

  /** Spacing between icon and label */
  spacing: TokenReference;
}
```

### 5.6 터치 타겟 설정

```typescript
/**
 * Touch target configuration for accessibility
 */
export interface TouchTargetConfig {
  /** Minimum touch target size (44x44pt recommended) */
  minSize: TokenReference;

  /** Hit slop (extends touch area beyond visual bounds) */
  hitSlop: HitSlopConfig;
}

export interface HitSlopConfig {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Touch target constants
 */
export const TOUCH_TARGET = {
  /** Apple HIG minimum: 44pt */
  MIN_SIZE_PT: 44,

  /** CSS pixels at 1x scale */
  MIN_SIZE_PX: 44,

  /** CSS pixels at 2x scale */
  MIN_SIZE_2X: 88,

  /** CSS pixels at 3x scale */
  MIN_SIZE_3X: 132,

  /** CSS pixels at 4x scale */
  MIN_SIZE_4X: 176,
} as const;
```

### 5.7 모바일 셸 토큰 정의 (6개)

```typescript
/**
 * Standard mobile app shell with header, main content, and bottom tab
 */
export const SHELL_MOBILE_APP: MobileShellToken = {
  id: 'shell.mobile.app',
  description: 'Standard mobile app layout with header, main content, and bottom tab',
  platform: 'mobile',
  os: 'cross-platform',
  regions: [
    { name: 'header', position: 'top', size: 'atomic.spacing.14', collapsible: false },
    { name: 'main', position: 'center', size: 'atomic.spacing.full', collapsible: false },
    { name: 'bottomTab', position: 'bottom', size: 'atomic.spacing.16', collapsible: true },
  ],
  safeArea: { /* ... */ },
  systemUI: { /* ... */ },
  keyboard: { avoidance: 'padding', behavior: 'height', /* ... */ },
  bottomTab: { height: 'atomic.spacing.16', /* ... */ },
  touchTarget: { minSize: 'atomic.spacing.11', /* 44pt */ },
  responsive: { default: {}, md: {} },
  tokenBindings: { /* ... */ },
};

/**
 * Fullscreen content shell (video, image gallery, etc.)
 */
export const SHELL_MOBILE_FULLSCREEN: MobileShellToken = {
  id: 'shell.mobile.fullscreen',
  description: 'Fullscreen content layout with safe area applied',
  platform: 'mobile',
  os: 'cross-platform',
  regions: [
    { name: 'main', position: 'center', size: 'atomic.spacing.full', collapsible: false },
  ],
  // SafeArea edges all enabled
  safeArea: { edges: { top: true, bottom: true, horizontal: true }, /* ... */ },
  // ...
};

/**
 * Modal/Bottom sheet shell
 */
export const SHELL_MOBILE_MODAL: MobileShellToken = {
  id: 'shell.mobile.modal',
  description: 'Modal or bottom sheet layout with handle and content',
  platform: 'mobile',
  os: 'cross-platform',
  regions: [
    { name: 'handle', position: 'top', size: 'atomic.spacing.6', collapsible: false },
    { name: 'content', position: 'center', size: 'atomic.spacing.full', collapsible: false },
  ],
  // ...
};

/**
 * Tab-based navigation shell
 */
export const SHELL_MOBILE_TAB: MobileShellToken = {
  id: 'shell.mobile.tab',
  description: 'Tab-based navigation with bottom tab bar',
  platform: 'mobile',
  os: 'cross-platform',
  regions: [
    { name: 'main', position: 'center', size: 'atomic.spacing.full', collapsible: false },
    { name: 'bottomTab', position: 'bottom', size: 'atomic.spacing.16', collapsible: false },
  ],
  bottomTab: { visibility: 'always', maxItems: 5, /* ... */ },
  // ...
};

/**
 * Drawer navigation shell
 */
export const SHELL_MOBILE_DRAWER: MobileShellToken = {
  id: 'shell.mobile.drawer',
  description: 'Drawer navigation with slide-out menu',
  platform: 'mobile',
  os: 'cross-platform',
  regions: [
    { name: 'drawer', position: 'left', size: 'atomic.spacing.72', collapsible: true, defaultCollapsed: true },
    { name: 'main', position: 'center', size: 'atomic.spacing.full', collapsible: false },
  ],
  // ...
};

/**
 * Detail view shell with action bar
 */
export const SHELL_MOBILE_DETAIL: MobileShellToken = {
  id: 'shell.mobile.detail',
  description: 'Detail view layout with header and action bar',
  platform: 'mobile',
  os: 'cross-platform',
  regions: [
    { name: 'header', position: 'top', size: 'atomic.spacing.14', collapsible: true },
    { name: 'main', position: 'center', size: 'atomic.spacing.full', collapsible: false },
    { name: 'actionBar', position: 'bottom', size: 'atomic.spacing.14', collapsible: false },
  ],
  // ...
};
```

---

## 6. 파일 구조

| 파일 | 유형 | 설명 |
|------|------|------|
| `packages/core/src/layout-tokens/types.ts` | 확장 | MobileShellToken, SafeAreaConfig 등 타입 추가 |
| `packages/core/src/layout-tokens/mobile-shells.ts` | 신규 | 6개 모바일 셸 토큰 정의 |
| `packages/core/src/layout-tokens/safe-area.ts` | 신규 | SafeArea 유틸리티 함수 |
| `packages/core/src/layout-tokens/keyboard.ts` | 신규 | 키보드 처리 유틸리티 |
| `packages/core/src/layout-tokens/touch-target.ts` | 신규 | 터치 타겟 유틸리티 |
| `packages/core/src/layout-tokens/index.ts` | 수정 | mobile-shells export 추가 |

---

## 7. 플랫폼 호환성

| 기능 | iOS | Android | 비고 |
|------|-----|---------|------|
| SafeArea Insets | 11+ | API 28+ | react-native-safe-area-context |
| 키보드 이벤트 | ✅ | ✅ | react-native-keyboard-controller |
| Status Bar API | ✅ | ✅ | React Native built-in |
| Navigation Bar | N/A | API 21+ | Android 전용 |
| 제스처 네비게이션 | 13+ | 10+ | 감지만 지원 |

---

## 8. 참조 문서

- [SPEC-LAYOUT-001](../SPEC-LAYOUT-001/spec.md) - Layout Token System
- [Apple Human Interface Guidelines - Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- [Material Design - Layout](https://m3.material.io/foundations/layout/understanding-layout)
- [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context)
