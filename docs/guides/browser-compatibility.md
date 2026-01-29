# Browser Compatibility Matrix

Tekton Responsive Web Enhancement (SPEC-LAYOUT-003) 브라우저 호환성 가이드입니다.

## 목차

1. [개요](#개요)
2. [기능별 호환성](#기능별-호환성)
3. [Fallback 전략](#fallback-전략)
4. [테스팅 가이드](#테스팅-가이드)
5. [알려진 이슈](#알려진-이슈)

---

## 개요

SPEC-LAYOUT-003에서 도입된 반응형 기능의 브라우저 지원 현황입니다.

### 지원 정책

- **Tier 1 (완전 지원)**: 최신 2개 메이저 버전
- **Tier 2 (제한 지원)**: 자동 폴백 제공
- **Tier 3 (미지원)**: 사용 불가

---

## 기능별 호환성

### 1. Media Queries (Viewport Breakpoints)

xl/2xl 브레이크포인트는 표준 CSS Media Queries를 사용합니다.

| Browser          | Min Version | Status  | Notes     |
| ---------------- | ----------- | ------- | --------- |
| Chrome           | All         | ✅ Full | 완전 지원 |
| Safari           | All         | ✅ Full | 완전 지원 |
| Firefox          | All         | ✅ Full | 완전 지원 |
| Edge             | All         | ✅ Full | 완전 지원 |
| Opera            | All         | ✅ Full | 완전 지원 |
| Samsung Internet | All         | ✅ Full | 완전 지원 |

**호환성 점수**: 100%

**사용 예제**:

```css
@media (min-width: 1280px) {
  /* xl breakpoint */
}

@media (min-width: 1536px) {
  /* 2xl breakpoint */
}
```

---

### 2. Container Queries

컴포넌트 중심 반응형 디자인을 위한 최신 CSS 기능입니다.

| Browser          | Min Version | Status  | Fallback | Notes         |
| ---------------- | ----------- | ------- | -------- | ------------- |
| Chrome           | 105+        | ✅ Full | N/A      | 2022-09 출시  |
| Safari           | 16+         | ✅ Full | N/A      | 2022-09 출시  |
| Firefox          | 110+        | ✅ Full | N/A      | 2023-03 출시  |
| Edge             | 105+        | ✅ Full | N/A      | Chromium 기반 |
| Opera            | 91+         | ✅ Full | N/A      | Chromium 기반 |
| Samsung Internet | 20+         | ✅ Full | N/A      |               |

**호환성 점수**: ~95% (글로벌 브라우저 점유율 기준)

**지원 버전 이하**: 자동 Media Query 폴백

**사용 예제**:

```css
/* Modern browsers */
@supports (container-type: inline-size) {
  .card-grid {
    container-type: inline-size;
    container-name: card-grid;
  }

  @container card-grid (min-width: 640px) {
    .card-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

/* Fallback for older browsers */
@supports not (container-type: inline-size) {
  @media (min-width: 1024px) {
    .card-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
```

---

### 3. Orientation Media Queries

디바이스 방향 감지는 CSS Media Queries Level 4 기능입니다.

| Browser          | Min Version | Status  | Notes     |
| ---------------- | ----------- | ------- | --------- |
| Chrome           | All         | ✅ Full | 완전 지원 |
| Safari           | All         | ✅ Full | 완전 지원 |
| Firefox          | All         | ✅ Full | 완전 지원 |
| Edge             | All         | ✅ Full | 완전 지원 |
| Opera            | All         | ✅ Full | 완전 지원 |
| Samsung Internet | All         | ✅ Full | 완전 지원 |

**호환성 점수**: 100%

**사용 예제**:

```css
@media (orientation: portrait) {
  .section {
    grid-template-columns: 1fr;
  }
}

@media (orientation: landscape) {
  .section {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---

### 4. CSS Variables (Custom Properties)

Tekton의 모든 토큰은 CSS Variables를 사용합니다.

| Browser          | Min Version | Status  | Notes                             |
| ---------------- | ----------- | ------- | --------------------------------- |
| Chrome           | 49+         | ✅ Full | 2016-03 출시                      |
| Safari           | 9.1+        | ✅ Full | 2016-03 출시                      |
| Firefox          | 31+         | ✅ Full | 2014-07 출시                      |
| Edge             | 15+         | ✅ Full | 2017-04 출시 (Legacy Edge 미지원) |
| Opera            | 36+         | ✅ Full | 2016-03 출시                      |
| Samsung Internet | 5+          | ✅ Full |                                   |

**호환성 점수**: ~97%

**사용 예제**:

```css
:root {
  --spacing-4: 16px;
  --spacing-8: 32px;
}

.section {
  padding: var(--spacing-4);
}

@media (min-width: 1280px) {
  .section {
    padding: var(--spacing-8);
  }
}
```

---

## Fallback 전략

### Container Queries Fallback

Tekton은 자동으로 Container Queries 미지원 브라우저를 위한 폴백을 생성합니다.

#### Strategy 1: @supports를 활용한 Feature Detection

```typescript
import { generateContainerQueryCSS } from '@tekton/core';

const config: ContainerQueryConfig = {
  name: 'product-grid',
  type: 'inline-size',
  breakpoints: {
    md: { minWidth: 480, css: { 'grid-template-columns': 'repeat(2, 1fr)' } },
    lg: { minWidth: 640, css: { 'grid-template-columns': 'repeat(3, 1fr)' } },
  },
};

const css = generateContainerQueryCSS(config);
```

생성된 CSS:

```css
/* Feature Detection */
@supports (container-type: inline-size) {
  /* Modern browsers: Container Queries */
  .product-grid {
    container-type: inline-size;
    container-name: product-grid;
  }

  @container product-grid (min-width: 480px) {
    .product-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @container product-grid (min-width: 640px) {
    .product-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

/* Fallback for older browsers */
@supports not (container-type: inline-size) {
  /* Viewport Media Queries 사용 */
  @media (min-width: 768px) {
    .product-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .product-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
```

#### Strategy 2: Progressive Enhancement

1. **기본 레이아웃** (모든 브라우저)

```css
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
```

2. **Media Queries** (모든 브라우저)

```css
@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

3. **Container Queries** (Modern browsers only)

```css
@supports (container-type: inline-size) {
  .card-grid {
    container-type: inline-size;
  }

  @container (min-width: 480px) {
    .card-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}
```

---

## 테스팅 가이드

### 1. Browser Testing Matrix

#### Desktop Testing

| Browser | Versions to Test | Priority |
| ------- | ---------------- | -------- |
| Chrome  | Latest, Latest-1 | High     |
| Safari  | Latest, Latest-1 | High     |
| Firefox | Latest, Latest-1 | Medium   |
| Edge    | Latest           | Medium   |

#### Mobile Testing

| Device/Browser   | Versions to Test | Priority |
| ---------------- | ---------------- | -------- |
| iOS Safari       | Latest, Latest-1 | High     |
| Android Chrome   | Latest           | High     |
| Samsung Internet | Latest           | Medium   |

### 2. Responsive Testing Checklist

- [ ] **Breakpoint 전환 확인**
  - [ ] sm (640px)
  - [ ] md (768px)
  - [ ] lg (1024px)
  - [ ] xl (1280px)
  - [ ] 2xl (1536px)

- [ ] **Container Queries 동작 확인**
  - [ ] Chrome 105+ (Container Queries 지원)
  - [ ] Safari 15 (폴백 확인)
  - [ ] Firefox 109 (폴백 확인)

- [ ] **Orientation 전환 확인**
  - [ ] iPad (Portrait ↔ Landscape)
  - [ ] Android Tablet (Portrait ↔ Landscape)

- [ ] **CSS Variables 적용 확인**
  - [ ] DevTools로 변수 값 확인
  - [ ] Dark mode 전환 테스트

### 3. BrowserStack 테스트 설정

```yaml
# browserstack.yml
browsers:
  # Desktop
  - os: Windows
    browser: chrome
    versions: ['latest', 'latest-1']

  - os: OS X
    browser: safari
    versions: ['latest', 'latest-1']

  # Mobile
  - device: iPhone 14 Pro
    os: iOS
    browser: safari
    version: '16'

  - device: Samsung Galaxy S23
    os: Android
    browser: chrome
    version: 'latest'

features:
  - container_queries: true
  - css_variables: true
  - media_queries_level_4: true
```

### 4. Manual Testing Commands

```bash
# Chrome DevTools Device Emulation
# 1. Open DevTools (F12)
# 2. Toggle Device Toolbar (Ctrl+Shift+M)
# 3. Test breakpoints: 640, 768, 1024, 1280, 1536

# Firefox Responsive Design Mode
# 1. Open DevTools (F12)
# 2. Toggle Responsive Design Mode (Ctrl+Shift+M)
# 3. Custom viewport sizes

# Safari Responsive Design Mode
# 1. Enable Develop menu (Preferences → Advanced)
# 2. Develop → Enter Responsive Design Mode
# 3. Test iPad Portrait/Landscape
```

---

## 알려진 이슈

### 1. IE 11 (미지원)

**Status**: ❌ Not Supported

**Reason**:

- CSS Variables 미지원
- Container Queries 미지원
- Modern CSS Grid 제한적 지원

**권장 사항**: IE 11은 지원하지 않습니다. 필요 시 polyfill 고려.

### 2. Safari 15.x (Container Queries 미지원)

**Status**: ⚠️ Fallback Required

**Issue**: Safari 15는 Container Queries를 지원하지 않음

**Solution**: 자동 Media Queries 폴백 제공

```css
/* Safari 15 will use this */
@supports not (container-type: inline-size) {
  @media (min-width: 1024px) {
    .grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
```

### 3. Firefox 109 이하 (Container Queries 미지원)

**Status**: ⚠️ Fallback Required

**Issue**: Firefox 110 미만 버전은 Container Queries 미지원

**Solution**: 자동 폴백 적용됨

---

## Browser Market Share (2026-01 기준)

| Browser          | Desktop | Mobile | Total |
| ---------------- | ------- | ------ | ----- |
| Chrome           | 65%     | 63%    | 64%   |
| Safari           | 15%     | 25%    | 20%   |
| Edge             | 5%      | -      | 3%    |
| Firefox          | 3%      | -      | 2%    |
| Samsung Internet | -       | 7%     | 4%    |
| Others           | 12%     | 5%     | 7%    |

**Container Queries 지원률**: ~95%
**CSS Variables 지원률**: ~97%
**Media Queries 지원률**: 100%

---

## 참고 자료

### Official Specifications

- [CSS Container Queries Module Level 1](https://www.w3.org/TR/css-contain-3/)
- [CSS Media Queries Level 4](https://www.w3.org/TR/mediaqueries-4/)
- [CSS Custom Properties (Variables)](https://www.w3.org/TR/css-variables-1/)

### Browser Support

- [Can I Use: Container Queries](https://caniuse.com/css-container-queries)
- [Can I Use: CSS Variables](https://caniuse.com/css-variables)
- [MDN: @container](https://developer.mozilla.org/en-US/docs/Web/CSS/@container)
- [MDN: @media orientation](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/orientation)

### Polyfills & Tools

- [container-query-polyfill](https://github.com/GoogleChromeLabs/container-query-polyfill) - Google Chrome Labs
- [postcss-container-queries](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-container-queries)

---

## 업데이트 히스토리

| 날짜       | 버전  | 변경 내용                                   |
| ---------- | ----- | ------------------------------------------- |
| 2026-01-29 | 1.0.0 | SPEC-LAYOUT-003 브라우저 호환성 가이드 초안 |

---

**최종 업데이트**: 2026-01-29
**SPEC 버전**: SPEC-LAYOUT-003 v1.0.0
**담당자**: Tekton Documentation Team
