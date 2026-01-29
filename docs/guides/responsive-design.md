# Responsive Design Guide

Tekton의 반응형 디자인 시스템 완벽 가이드입니다.

## 목차

1. [개요](#개요)
2. [브레이크포인트 시스템](#브레이크포인트-시스템)
3. [Container Queries](#container-queries)
4. [Orientation 지원](#orientation-지원)
5. [레이아웃 토큰 활용](#레이아웃-토큰-활용)
6. [실전 예제](#실전-예제)
7. [모범 사례](#모범-사례)

---

## 개요

SPEC-LAYOUT-003에서 도입된 Enhanced Responsive System은 다음을 제공합니다:

- **확장된 브레이크포인트**: xl (1280px), 2xl (1536px) 대형 모니터 지원
- **Container Queries**: 컴포넌트 중심 반응형 디자인
- **Orientation 지원**: Portrait/Landscape 모드 최적화
- **27개 레이아웃 토큰**: 모든 Shell, Page, Section에 반응형 적용

### 핵심 원칙

1. **Mobile First**: 기본값은 모바일, 점진적 확장
2. **Progressive Enhancement**: 브라우저 기능에 따라 점진적으로 향상
3. **Component-Centric**: Container Queries로 재사용 가능한 컴포넌트
4. **Semantic Tokens**: 의미 있는 토큰 이름 사용

---

## 브레이크포인트 시스템

### 표준 브레이크포인트

```typescript
export const BREAKPOINTS = {
  sm: 640, // 스마트폰 가로 모드
  md: 768, // 태블릿 세로 모드
  lg: 1024, // 태블릿 가로 모드 / 노트북
  xl: 1280, // 데스크톱 / 대형 노트북
  '2xl': 1536, // 울트라와이드 / 4K 모니터
} as const;
```

### 사용 예제

모든 레이아웃 토큰은 다음과 같은 반응형 구조를 따릅니다:

```typescript
interface ResponsiveConfig<T> {
  default: T; // 기본값 (모바일)
  sm?: Partial<T>; // 640px+
  md?: Partial<T>; // 768px+
  lg?: Partial<T>; // 1024px+
  xl?: Partial<T>; // 1280px+  ✨ NEW
  '2xl'?: Partial<T>; // 1536px+ ✨ NEW
}
```

### CSS 생성 예제

```typescript
import { generateResponsiveCSS } from '@tekton/core';

const config: ResponsiveConfig<SectionCSS> = {
  default: {
    padding: 'atomic.spacing.4',
    gridColumns: 1,
  },
  md: {
    padding: 'atomic.spacing.6',
    gridColumns: 2,
  },
  lg: {
    gridColumns: 3,
  },
  xl: {
    padding: 'atomic.spacing.8',
    gridColumns: 4,
  },
  '2xl': {
    gridColumns: 6,
  },
};

const css = generateResponsiveCSS(config);
```

생성된 CSS:

```css
/* Default (모바일) */
.section {
  padding: var(--spacing-4);
  grid-template-columns: repeat(1, 1fr);
}

/* md: 768px+ (태블릿) */
@media (min-width: 768px) {
  .section {
    padding: var(--spacing-6);
    grid-template-columns: repeat(2, 1fr);
  }
}

/* lg: 1024px+ (노트북) */
@media (min-width: 1024px) {
  .section {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* xl: 1280px+ (데스크톱) */
@media (min-width: 1280px) {
  .section {
    padding: var(--spacing-8);
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 2xl: 1536px+ (울트라와이드) */
@media (min-width: 1536px) {
  .section {
    grid-template-columns: repeat(6, 1fr);
  }
}
```

---

## Container Queries

Container Queries는 뷰포트가 아닌 **컨테이너 크기**에 반응하는 CSS입니다.

### 왜 Container Queries인가?

**문제**: 전통적인 Media Queries는 뷰포트 기준

```css
/* 뷰포트가 1024px 이상이면 3-column */
@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**문제점**:

- 사이드바가 있는 페이지에서는 여유 공간이 부족할 수 있음
- 컴포넌트 재사용성 저하

**해결책**: Container Queries로 컨테이너 크기 기준

```css
/* 컨테이너가 640px 이상이면 3-column */
@container (min-width: 640px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Container Query 설정

```typescript
import { ContainerQueryConfig, generateContainerQueryCSS } from '@tekton/core';

const containerConfig: ContainerQueryConfig = {
  name: 'card-grid',
  type: 'inline-size', // 너비만 감지 (권장)
  breakpoints: {
    sm: {
      minWidth: 320,
      css: {
        'grid-template-columns': 'repeat(1, 1fr)',
        gap: 'var(--spacing-4)',
      },
    },
    md: {
      minWidth: 480,
      css: {
        'grid-template-columns': 'repeat(2, 1fr)',
        gap: 'var(--spacing-6)',
      },
    },
    lg: {
      minWidth: 640,
      css: {
        'grid-template-columns': 'repeat(3, 1fr)',
        gap: 'var(--spacing-8)',
      },
    },
    xl: {
      minWidth: 800,
      css: {
        'grid-template-columns': 'repeat(4, 1fr)',
      },
    },
  },
};

const css = generateContainerQueryCSS(containerConfig);
```

생성된 CSS:

```css
.card-grid {
  container-type: inline-size;
  container-name: card-grid;
}

@container card-grid (min-width: 320px) {
  .card-grid {
    grid-template-columns: repeat(1, 1fr);
    gap: var(--spacing-4);
  }
}

@container card-grid (min-width: 480px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-6);
  }
}

@container card-grid (min-width: 640px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-8);
  }
}

@container card-grid (min-width: 800px) {
  .card-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Container Query 브레이크포인트

```typescript
export const CONTAINER_BREAKPOINTS = {
  sm: 320, // 작은 컴포넌트
  md: 480, // 중간 크기 컴포넌트
  lg: 640, // 큰 컴포넌트
  xl: 800, // 매우 큰 컴포넌트
} as const;
```

**뷰포트 vs 컨테이너 브레이크포인트 비교**:

| 타입      | sm  | md  | lg   | xl   | 2xl  |
| --------- | --- | --- | ---- | ---- | ---- |
| Viewport  | 640 | 768 | 1024 | 1280 | 1536 |
| Container | 320 | 480 | 640  | 800  | -    |

---

## Orientation 지원

태블릿 디바이스의 Portrait/Landscape 모드를 지원합니다.

### Orientation 설정

```typescript
import { OrientationConfig, generateOrientationCSS } from '@tekton/core';

const orientationConfig: OrientationConfig<SectionCSS> = {
  portrait: {
    gridColumns: 1,
    padding: 'atomic.spacing.4',
  },
  landscape: {
    gridColumns: 2,
    padding: 'atomic.spacing.6',
  },
};

const css = generateOrientationCSS(orientationConfig, generateCSSFromConfig);
```

생성된 CSS:

```css
@media (orientation: portrait) {
  .section {
    grid-template-columns: repeat(1, 1fr);
    padding: var(--spacing-4);
  }
}

@media (orientation: landscape) {
  .section {
    grid-template-columns: repeat(2, 1fr);
    padding: var(--spacing-6);
  }
}
```

### 통합 반응형 설정

FullResponsiveConfig는 Breakpoints + Orientation을 통합합니다:

```typescript
import { FullResponsiveConfig } from '@tekton/core';

const fullConfig: FullResponsiveConfig<SectionCSS> = {
  // 기본 반응형 설정
  default: { gridColumns: 1 },
  md: { gridColumns: 2 },
  lg: { gridColumns: 3 },
  xl: { gridColumns: 4 },
  '2xl': { gridColumns: 6 },

  // Orientation 오버라이드
  orientation: {
    portrait: {
      gridColumns: 1, // 세로 모드는 항상 1-column
    },
    landscape: {
      padding: 'atomic.spacing.8', // 가로 모드는 더 넓은 패딩
    },
  },
};
```

---

## 레이아웃 토큰 활용

### Shell Tokens (6개)

모든 Shell 토큰이 xl/2xl을 지원합니다:

```typescript
import { shellTokens } from '@tekton/core/layout-tokens';

const appShell = shellTokens.app;
// appShell.xl: { maxWidth: '1440px', padding: '32px' }
// appShell['2xl']: { maxWidth: '1920px', padding: '48px' }
```

### Page Tokens (8개)

```typescript
import { pageTokens } from '@tekton/core/layout-tokens';

const dashboardPage = pageTokens.dashboard;
// dashboardPage.xl: { gridColumns: 4, gap: '32px' }
// dashboardPage['2xl']: { gridColumns: 6, gap: '48px' }
```

### Section Tokens (13개)

```typescript
import { sectionTokens } from '@tekton/core/layout-tokens';

const gridSection = sectionTokens['grid-4col'];
// gridSection.xl: { gridColumns: 4 }
// gridSection['2xl']: { gridColumns: 6 }
```

---

## 실전 예제

### 예제 1: Dashboard 레이아웃

```typescript
import { resolveLayout, generateLayoutCSS } from '@tekton/core';

const dashboardLayout = resolveLayout({
  shellToken: 'app',
  pageToken: 'dashboard',
  sectionToken: 'grid-4col',
});

const css = generateLayoutCSS(dashboardLayout);
```

생성된 CSS는 다음을 포함합니다:

- Mobile (default): 1-column grid
- Tablet (md): 2-column grid
- Desktop (lg): 3-column grid
- Large Desktop (xl): 4-column grid
- Ultra-wide (2xl): 6-column grid

### 예제 2: Card Component with Container Queries

```typescript
const cardGridConfig: ContainerQueryConfig = {
  name: 'product-grid',
  type: 'inline-size',
  breakpoints: {
    sm: { minWidth: 320, css: { 'grid-template-columns': '1fr' } },
    md: { minWidth: 480, css: { 'grid-template-columns': 'repeat(2, 1fr)' } },
    lg: { minWidth: 640, css: { 'grid-template-columns': 'repeat(3, 1fr)' } },
    xl: { minWidth: 800, css: { 'grid-template-columns': 'repeat(4, 1fr)' } },
  },
};

// 이 컴포넌트는 어떤 레이아웃에서든 재사용 가능
// 사이드바, 풀스크린, 모달 등에서 자동으로 조정됨
```

### 예제 3: Tablet-Optimized Content

```typescript
const tabletConfig: FullResponsiveConfig<SectionCSS> = {
  default: {
    padding: 'atomic.spacing.4',
    gridColumns: 1,
  },
  md: {
    padding: 'atomic.spacing.6',
  },
  orientation: {
    portrait: {
      gridColumns: 1,
      gap: 'atomic.spacing.4',
    },
    landscape: {
      gridColumns: 2,
      gap: 'atomic.spacing.6',
    },
  },
};
```

---

## 모범 사례

### 1. Mobile First 접근

**Good**:

```typescript
const config = {
  default: { gridColumns: 1 }, // 모바일 기본
  md: { gridColumns: 2 }, // 점진적 확장
  xl: { gridColumns: 4 },
};
```

**Bad**:

```typescript
const config = {
  default: { gridColumns: 4 }, // 데스크톱 기본 (X)
  sm: { gridColumns: 1 }, // 모바일 축소 (X)
};
```

### 2. Container Queries 활용

**재사용 가능한 컴포넌트**는 Container Queries 사용:

```typescript
// Good: 컨테이너 크기에 반응
const cardGrid = {
  containerName: 'card-grid',
  breakpoints: { /* container breakpoints */ }
};

// Bad: 뷰포트 크기에 의존
@media (min-width: 1024px) {
  .card-grid { /* ... */ }
}
```

### 3. Semantic Token 사용

**Good**:

```typescript
padding: 'atomic.spacing.4';
```

**Bad**:

```typescript
padding: '16px';
```

### 4. Orientation은 선택적으로

모든 레이아웃이 Orientation을 필요로 하지는 않습니다:

```typescript
// Tablet-specific content만 Orientation 사용
const tabletSection = {
  default: {
    /* ... */
  },
  orientation: {
    portrait: {
      /* ... */
    },
  },
};

// Desktop-only content는 Orientation 불필요
const desktopSection = {
  default: {
    /* ... */
  },
  xl: {
    /* ... */
  },
};
```

### 5. Fallback 전략

Container Queries 미지원 브라우저를 위한 폴백:

```typescript
// 자동으로 @supports 폴백 생성
const css = generateContainerQueryCSS(config);

// 생성된 CSS:
// @supports (container-type: inline-size) { /* Container Queries */ }
// @supports not (container-type: inline-size) { /* Media Queries 폴백 */ }
```

---

## 브라우저 호환성

자세한 호환성 정보는 [Browser Compatibility Guide](./browser-compatibility.md)를 참조하세요.

---

## 추가 자료

- [SPEC-LAYOUT-003 Specification](../../.moai/specs/SPEC-LAYOUT-003/spec.md)
- [Layout CSS Generator API](../api/layout-css-generator.md)
- [Layout Tokens Types API](../api/layout-tokens-types.md)
- [Browser Compatibility Matrix](./browser-compatibility.md)

---

**최종 업데이트**: 2026-01-29
**SPEC 버전**: SPEC-LAYOUT-003 v1.0.0
