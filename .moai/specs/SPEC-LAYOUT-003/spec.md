---
id: SPEC-LAYOUT-003
version: "1.0.0"
status: completed
created: "2026-01-29"
updated: "2026-01-29"
completed: "2026-01-29"
author: soo-kate-yeon
priority: high
---

## HISTORY

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 1.0.0 | 2026-01-29 | soo-kate-yeon | 초안 작성 |
| 1.0.0 | 2026-01-29 | soo-kate-yeon | 구현 완료 및 검증 통과 |

---

# SPEC-LAYOUT-003: Responsive Web Enhancement

## 1. 개요

### 1.1 목적
기존 레이아웃 토큰 시스템의 반응형 웹 지원을 강화하여 xl/2xl 브레이크포인트 활성화, Container Queries 지원, Portrait/Landscape 방향 처리를 구현합니다.

### 1.2 범위
- xl (1280px+), 2xl (1536px+) 브레이크포인트 활성화
- Container Queries 타입 정의 및 CSS 생성
- 디바이스 방향(Portrait/Landscape) 지원

### 1.3 의존성
- SPEC-LAYOUT-001 (Layout Token System) - 완료됨

### 1.4 제외 항목
- CSS Subgrid (접근성/고급 기능으로 제외)
- Reduced Motion (접근성 기능으로 제외)
- Print Layout (고급 기능으로 제외)

---

## 2. Environment (환경)

```
Current System: SPEC-LAYOUT-001 완료된 4계층 레이아웃 토큰 시스템
  - Shell → Page → Section → Responsive
  - 6개 웹 셸, 8개 페이지 레이아웃, 13개 섹션 패턴

Technology Stack:
  - TypeScript 5.7+
  - CSS Container Queries (Chrome 105+, Safari 16+, Firefox 110+)
  - CSS Media Queries Level 4 (orientation)

Integration Points:
  - packages/core/src/layout-tokens/types.ts
  - packages/core/src/layout-tokens/shells.ts
  - packages/core/src/layout-tokens/pages.ts
  - packages/core/src/layout-tokens/sections.ts
```

---

## 3. Assumptions (가정)

| ID | 가정 | 근거 |
|----|------|------|
| A-001 | xl/2xl 브레이크포인트가 대형 모니터 사용 증가에 따라 필요 | 4K/울트라와이드 모니터 보급률 증가 |
| A-002 | Container Queries가 컴포넌트 중심 반응형 디자인에 필수 | 재사용 가능한 컴포넌트 설계 트렌드 |
| A-003 | Portrait/Landscape 방향이 태블릿 UX에 중요 | 태블릿 사용 시나리오 다양화 |
| A-004 | 브라우저 호환성 기준은 최근 2개 메이저 버전 | 엔터프라이즈 환경 고려 |

---

## 4. Requirements (요구사항)

### 4.1 Ubiquitous Requirements (항상 적용)

| ID | 요구사항 |
|----|----------|
| U-001 | 시스템은 **항상** xl (1280px+), 2xl (1536px+) 브레이크포인트를 모든 레이아웃 토큰에 적용해야 한다 |
| U-002 | 시스템은 **항상** 모바일 퍼스트 접근법을 유지해야 한다 (default → sm → md → lg → xl → 2xl) |
| U-003 | 시스템은 **항상** 토큰 참조 패턴을 사용해야 한다 (예: "atomic.spacing.16") |

### 4.2 Event-Driven Requirements (이벤트 기반)

| ID | 요구사항 |
|----|----------|
| E-001 | **WHEN** Container Query 조건이 변경되면 **THEN** 해당 컨테이너 내 레이아웃을 재계산해야 한다 |
| E-002 | **WHEN** 디바이스 방향이 portrait에서 landscape로 변경되면 **THEN** 방향별 레이아웃 오버라이드를 적용해야 한다 |
| E-003 | **WHEN** 뷰포트 크기가 브레이크포인트를 넘어가면 **THEN** 해당 브레이크포인트의 레이아웃을 적용해야 한다 |

### 4.3 State-Driven Requirements (상태 기반)

| ID | 요구사항 |
|----|----------|
| S-001 | **IF** 컨테이너 너비가 breakpoint 조건을 충족하면 **THEN** 해당 컨테이너 레이아웃을 적용해야 한다 |
| S-002 | **IF** 뷰포트가 xl 이상이면 **THEN** 멀티 컬럼 레이아웃 옵션이 활성화되어야 한다 |
| S-003 | **IF** 디바이스가 landscape 모드이면 **THEN** 가로 최적화 레이아웃을 적용해야 한다 |

### 4.4 Unwanted Behavior (금지 동작)

| ID | 요구사항 |
|----|----------|
| UW-001 | 시스템은 하드코딩된 픽셀 값을 사용하지 **않아야 한다**; 모든 크기는 토큰 참조를 사용 |
| UW-002 | 시스템은 브레이크포인트 간 레이아웃 점프가 발생하지 **않아야 한다** |
| UW-003 | 시스템은 Container Query 미지원 브라우저에서 레이아웃이 깨지지 **않아야 한다** (폴백 제공) |

### 4.5 Optional Requirements (선택적)

| ID | 요구사항 |
|----|----------|
| O-001 | **가능하면** CSS Custom Properties를 통한 런타임 브레이크포인트 조정 제공 |

---

## 5. Technical Specifications (기술 명세)

### 5.1 확장된 ResponsiveConfig

```typescript
/**
 * Enhanced ResponsiveConfig with xl/2xl breakpoints activated
 * @template T - Configuration type being made responsive
 */
export interface ResponsiveConfig<T> {
  /** Default configuration (mobile-first, applies to all screen sizes) */
  default: T;

  /** Small devices override (640px+) */
  sm?: Partial<T>;

  /** Medium devices override (768px+) */
  md?: Partial<T>;

  /** Large devices override (1024px+) */
  lg?: Partial<T>;

  /** Extra large devices override (1280px+) - NOW ACTIVE */
  xl?: Partial<T>;

  /** 2X large devices override (1536px+) - NOW ACTIVE */
  '2xl'?: Partial<T>;
}

/**
 * Breakpoint definitions with pixel values
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,    // 대형 데스크톱
  '2xl': 1536, // 울트라와이드/4K
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;
```

### 5.2 Container Query 지원

```typescript
/**
 * Container Query configuration for component-level responsiveness
 */
export interface ContainerQueryConfig {
  /** Container name for CSS @container rule */
  name: string;

  /** Container type: inline-size (width only) or size (both dimensions) */
  type: 'inline-size' | 'size';

  /** Breakpoints for container queries */
  breakpoints: {
    /** @container (min-width: 320px) */
    sm?: ContainerBreakpointConfig;
    /** @container (min-width: 480px) */
    md?: ContainerBreakpointConfig;
    /** @container (min-width: 640px) */
    lg?: ContainerBreakpointConfig;
    /** @container (min-width: 800px) */
    xl?: ContainerBreakpointConfig;
  };
}

export interface ContainerBreakpointConfig {
  /** Minimum width in pixels */
  minWidth: number;
  /** CSS properties to apply at this breakpoint */
  css: Record<string, string>;
}

/**
 * Container Query breakpoint values (component-level)
 */
export const CONTAINER_BREAKPOINTS = {
  sm: 320,
  md: 480,
  lg: 640,
  xl: 800,
} as const;
```

### 5.3 방향(Orientation) 지원

```typescript
/**
 * Orientation configuration for device rotation handling
 * @template T - Configuration type being made orientation-aware
 */
export interface OrientationConfig<T> {
  /** Portrait mode overrides (height > width) */
  portrait?: Partial<T>;

  /** Landscape mode overrides (width > height) */
  landscape?: Partial<T>;
}

/**
 * Combined Responsive + Orientation Config
 */
export interface FullResponsiveConfig<T> extends ResponsiveConfig<T> {
  /** Orientation-specific overrides */
  orientation?: OrientationConfig<Partial<T>>;
}
```

### 5.4 CSS 생성 확장

```typescript
/**
 * Generate CSS media queries for all breakpoints including xl/2xl
 */
export function generateResponsiveCSS(
  config: ResponsiveConfig<SectionCSS>
): string {
  const cssRules: string[] = [];

  // Default (mobile-first)
  cssRules.push(generateCSSFromConfig(config.default));

  // Breakpoint overrides
  const breakpoints: BreakpointKey[] = ['sm', 'md', 'lg', 'xl', '2xl'];

  for (const bp of breakpoints) {
    const override = config[bp];
    if (override) {
      cssRules.push(`
        @media (min-width: ${BREAKPOINTS[bp]}px) {
          ${generateCSSFromConfig(override)}
        }
      `);
    }
  }

  return cssRules.join('\n');
}

/**
 * Generate CSS container queries
 */
export function generateContainerQueryCSS(
  config: ContainerQueryConfig
): string {
  const rules: string[] = [];

  // Container definition
  rules.push(`container-type: ${config.type};`);
  rules.push(`container-name: ${config.name};`);

  // Container query rules
  for (const [bp, bpConfig] of Object.entries(config.breakpoints)) {
    if (bpConfig) {
      rules.push(`
        @container ${config.name} (min-width: ${bpConfig.minWidth}px) {
          ${Object.entries(bpConfig.css)
            .map(([prop, value]) => `${prop}: ${value};`)
            .join('\n')}
        }
      `);
    }
  }

  return rules.join('\n');
}

/**
 * Generate orientation media queries
 */
export function generateOrientationCSS<T>(
  config: OrientationConfig<T>,
  cssGenerator: (config: Partial<T>) => string
): string {
  const rules: string[] = [];

  if (config.portrait) {
    rules.push(`
      @media (orientation: portrait) {
        ${cssGenerator(config.portrait)}
      }
    `);
  }

  if (config.landscape) {
    rules.push(`
      @media (orientation: landscape) {
        ${cssGenerator(config.landscape)}
      }
    `);
  }

  return rules.join('\n');
}
```

---

## 6. 파일 수정 대상

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `packages/core/src/layout-tokens/types.ts` | 확장 | ContainerQueryConfig, OrientationConfig 타입 추가 |
| `packages/core/src/layout-tokens/responsive.ts` | 신규 | 반응형 유틸리티 함수 |
| `packages/core/src/layout-tokens/shells.ts` | 수정 | 모든 셸에 xl/2xl 설정 추가 |
| `packages/core/src/layout-tokens/pages.ts` | 수정 | 모든 페이지에 xl/2xl 설정 추가 |
| `packages/core/src/layout-tokens/sections.ts` | 수정 | 모든 섹션에 xl/2xl 설정 추가 |
| `packages/core/src/layout-css-generator.ts` | 확장 | Container Query CSS 생성 |

---

## 7. 브라우저 호환성

| 기능 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| Media Queries (xl/2xl) | ✅ All | ✅ All | ✅ All | ✅ All |
| Container Queries | 105+ | 16+ | 110+ | 105+ |
| Orientation Media | ✅ All | ✅ All | ✅ All | ✅ All |

### 폴백 전략
- Container Queries 미지원 시: 뷰포트 기반 Media Query로 폴백
- `@supports (container-type: inline-size)` 활용

---

## 8. 참조 문서

- [SPEC-LAYOUT-001](../SPEC-LAYOUT-001/spec.md) - Layout Token System
- [CSS Container Queries MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- [CSS Media Queries Level 4](https://www.w3.org/TR/mediaqueries-4/)
