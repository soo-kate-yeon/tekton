# 사용자 가이드 (User Guide)

Tekton MCP Server의 모든 기능을 활용하는 방법을 배웁니다.

## 목차

1. [MCP Tools 상세 가이드](#mcp-tools-상세-가이드)
2. [테마 시스템](#테마-시스템)
3. [레이아웃 패턴](#레이아웃-패턴)
4. [컴포넌트 카탈로그](#컴포넌트-카탈로그)
5. [워크플로우 예제](#워크플로우-예제)
6. [문제 해결](#문제-해결)

---

## MCP Tools 상세 가이드

### 1. generate-blueprint

자연어 설명으로 블루프린트 JSON을 생성합니다.

#### 입력 파라미터

| 파라미터         | 타입     | 필수 | 설명                    | 제약 조건              |
| ---------------- | -------- | ---- | ----------------------- | ---------------------- |
| `description`    | string   | ✓    | 화면에 대한 자연어 설명 | 10-500자               |
| `layout`         | string   | ✓    | 레이아웃 타입           | 6가지 중 선택          |
| `themeId`        | string   | ✓    | 테마 ID                 | 소문자, 숫자, 하이픈만 |
| `componentHints` | string[] | ✗    | 사용할 컴포넌트 힌트    | 선택적                 |

#### 출력 형식

```typescript
{
  success: boolean;
  blueprint?: {
    id: string;              // 타임스탬프 기반 고유 ID
    name: string;            // 생성된 블루프린트 이름
    themeId: string;         // 적용된 테마 ID
    layout: LayoutType;      // 레이아웃 타입
    components: ComponentNode[];  // 컴포넌트 트리
    timestamp: number;       // 생성 시각 (밀리초)
  };
  previewUrl?: string;       // 미리보기 URL
  error?: string;            // 오류 메시지 (실패 시)
}
```

#### 사용 예제

**기본 사용법**:

```
Claude Code에서:
Use generate-blueprint with:
- description: "Simple login form with email, password, and submit button"
- layout: single-column
- themeId: calm-wellness
```

**고급 사용법** (컴포넌트 힌트 포함):

```
Use generate-blueprint with:
- description: "E-commerce product card with image, title, price, rating, and add to cart button"
- layout: two-column
- themeId: vibrant-creative
- componentHints: ["Card", "Image", "Heading", "Text", "Button", "Badge"]
```

**대시보드 예제**:

```
Use generate-blueprint with:
- description: "Analytics dashboard with sidebar navigation, main chart area, and stats cards showing user metrics"
- layout: dashboard
- themeId: korean-fintech
- componentHints: ["Card", "Heading", "Text", "Table"]
```

#### 오류 처리

| 오류 코드             | 원인                             | 해결 방법                               |
| --------------------- | -------------------------------- | --------------------------------------- |
| `INVALID_DESCRIPTION` | 설명이 10자 미만 또는 500자 초과 | 적절한 길이로 조정                      |
| `INVALID_THEME_ID`    | 존재하지 않는 테마               | `/api/themes`에서 사용 가능한 테마 확인 |
| `INVALID_LAYOUT`      | 지원되지 않는 레이아웃           | 6가지 레이아웃 중 선택                  |
| `VALIDATION_FAILED`   | 블루프린트 검증 실패             | 컴포넌트 구조 확인                      |

---

### 2. preview-theme

테마 품질을 확인하기 위한 미리보기 URL을 생성합니다.

#### 입력 파라미터

| 파라미터  | 타입   | 필수 | 설명               | 제약 조건              |
| --------- | ------ | ---- | ------------------ | ---------------------- |
| `themeId` | string | ✓    | 미리보기할 테마 ID | 소문자, 숫자, 하이픈만 |

#### 출력 형식

```typescript
{
  success: boolean;
  theme?: {
    id: string;
    name: string;
    description: string;
    cssVariables: Record<string, string>;  // CSS 변수 맵
  };
  previewUrl?: string;
  error?: string;
}
```

#### 사용 예제

**단일 테마 미리보기**:

```
Use preview-theme with themeId: premium-editorial
```

**테마 비교 워크플로우**:

```
1. Use preview-theme with themeId: calm-wellness
2. Use preview-theme with themeId: dynamic-fitness
3. Use preview-theme with themeId: korean-fintech

각 previewUrl을 브라우저 탭으로 열어 비교
```

#### CSS 변수 구조

```css
:root {
  /* 색상 변수 (OKLCH 형식) */
  --color-primary: oklch(0.45 0.15 220);
  --color-secondary: oklch(0.6 0.12 280);
  --color-background: oklch(0.98 0.02 220);
  --color-text: oklch(0.2 0.05 220);

  /* 타이포그래피 */
  --font-family: 'Inter', sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.5;

  /* 간격 */
  --spacing-unit: 8px;
  --border-radius: 8px;

  /* 그림자 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

---

### 3. export-screen

생성된 블루프린트를 프로덕션 코드로 내보냅니다.

#### 입력 파라미터

| 파라미터      | 타입   | 필수 | 설명                 | 제약 조건       |
| ------------- | ------ | ---- | -------------------- | --------------- |
| `blueprintId` | string | ✓    | 내보낼 블루프린트 ID | 타임스탬프 형식 |
| `format`      | string | ✓    | 출력 형식            | jsx, tsx, vue   |
| `outputPath`  | string | ✗    | 저장 경로            | 선택적          |

#### 출력 형식

```typescript
{
  success: boolean;
  code?: string;        // 생성된 코드
  filePath?: string;    // 저장된 파일 경로
  error?: string;
}
```

#### 사용 예제

**TypeScript React 내보내기**:

```
Use export-screen with:
- blueprintId: 1738123456789
- format: tsx
- outputPath: src/screens/UserProfile.tsx
```

**JavaScript React 내보내기**:

```
Use export-screen with:
- blueprintId: 1738123456789
- format: jsx
- outputPath: src/components/LoginForm.jsx
```

**Vue 3 내보내기**:

```
Use export-screen with:
- blueprintId: 1738123456789
- format: vue
- outputPath: src/views/Dashboard.vue
```

#### 생성 코드 예제

**TSX 출력**:

```tsx
import React from 'react';
import { Card, Avatar, Text, Button } from '@/components';

export default function UserProfile() {
  return (
    <div className="container">
      <aside className="sidebar">
        <Button variant="primary">Settings</Button>
      </aside>
      <main className="main-content">
        <Card>
          <Avatar size="large" />
          <Text>User bio content</Text>
        </Card>
      </main>
    </div>
  );
}
```

---

## 테마 시스템

Tekton은 13개의 내장 테마를 제공하며, 각 테마는 OKLCH 색상 공간을 기반으로 합니다.

### 13개 내장 테마

| 테마 ID                       | 테마 이름          | 용도              | 특징                    |
| ----------------------------- | ------------------ | ----------------- | ----------------------- |
| `calm-wellness`               | Calm Wellness      | 웰니스/명상 앱    | 부드러운 파란색, 평온함 |
| `dynamic-fitness`             | Dynamic Fitness    | 피트니스 트래킹   | 활기찬 빨간색, 에너지   |
| `korean-fintech`              | Korean Fintech     | 금융 서비스       | 전문적인 파란색, 신뢰감 |
| `premium-editorial`           | Premium Editorial  | 콘텐츠 플랫폼     | 세리프 폰트, 높은 대비  |
| `playful-kids`                | Playful Kids       | 어린이 앱         | 밝은 색상, 큰 요소      |
| `corporate-blue`              | Corporate Blue     | 기업 소프트웨어   | 전통적인 파란색         |
| `nature-green`                | Nature Green       | 환경/지속가능성   | 녹색 기반               |
| `sunset-warm`                 | Sunset Warm        | 따뜻한 경험       | 주황색/노란색           |
| `ocean-cool`                  | Ocean Cool         | 신선하고 전문적   | 청록색                  |
| `monochrome-elegant`          | Monochrome Elegant | 미니멀리즘 럭셔리 | 흑백                    |
| `vibrant-creative`            | Vibrant Creative   | 크리에이티브 툴   | 생동감 있는 색상        |
| `accessibility-high-contrast` | High Contrast      | 접근성 우선       | WCAG AAA 준수           |
| `dark-mode-default`           | Dark Mode          | 다크 테마         | 현대적인 어두운 UI      |

### OKLCH 색상 시스템

OKLCH는 지각적으로 균일한 색상 공간으로, RGB보다 우수한 색상 변환을 제공합니다.

**OKLCH 구조**:

- **L (Lightness)**: 0-1, 밝기
- **C (Chroma)**: 0-0.5, 채도
- **H (Hue)**: 0-360, 색상 각도

**장점**:

- ✅ 지각적으로 균일한 색상 변환
- ✅ 일관된 명도 유지
- ✅ 더 넓은 색상 범위
- ✅ 예측 가능한 그라데이션

---

## 레이아웃 패턴

### 6가지 레이아웃 타입

#### 1. single-column

단일 컬럼 레이아웃, 모바일 우선 디자인에 적합.

```
┌─────────────────┐
│     Header      │
├─────────────────┤
│                 │
│    Content      │
│                 │
├─────────────────┤
│     Footer      │
└─────────────────┘
```

**사용 사례**: 블로그 포스트, 상품 상세, 프로필

#### 2. two-column

2열 레이아웃, 콘텐츠와 보조 정보 분리.

```
┌─────────────────────────┐
│         Header          │
├──────────────┬──────────┤
│              │          │
│   Main       │  Aside   │
│   Content    │          │
│              │          │
├──────────────┴──────────┤
│         Footer          │
└─────────────────────────┘
```

**사용 사례**: 문서, 뉴스 기사, 제품 비교

#### 3. sidebar-left

왼쪽 사이드바 레이아웃, 네비게이션 우선.

```
┌──────────────────────────┐
│         Header           │
├────────┬─────────────────┤
│        │                 │
│ Sidebar│  Main Content   │
│        │                 │
│        │                 │
├────────┴─────────────────┤
│         Footer           │
└──────────────────────────┘
```

**사용 사례**: 관리자 패널, 설정 페이지, 문서 사이트

#### 4. sidebar-right

오른쪽 사이드바 레이아웃, 콘텐츠 우선.

```
┌──────────────────────────┐
│         Header           │
├─────────────────┬────────┤
│                 │        │
│  Main Content   │ Sidebar│
│                 │        │
│                 │        │
├─────────────────┴────────┤
│         Footer           │
└──────────────────────────┘
```

**사용 사례**: 블로그, 뉴스, 위젯이 있는 콘텐츠

#### 5. dashboard

대시보드 레이아웃, 데이터 시각화에 최적화.

```
┌──────────────────────────┐
│         Header           │
├────────┬─────────┬───────┤
│        │         │       │
│ Widget │ Widget  │Widget │
│        │         │       │
├────────┴─────────┴───────┤
│      Large Widget        │
├──────────────────────────┤
│         Footer           │
└──────────────────────────┘
```

**사용 사례**: 분석, 모니터링, 메트릭스

#### 6. landing

랜딩 페이지 레이아웃, 마케팅에 최적화.

```
┌──────────────────────────┐
│        Hero Section      │
├──────────────────────────┤
│     Features Grid        │
├──────────────────────────┤
│    Testimonials          │
├──────────────────────────┤
│         CTA              │
└──────────────────────────┘
```

**사용 사례**: 제품 랜딩, 마케팅 페이지, 프로모션

---

## 컴포넌트 카탈로그

Tekton은 20개의 내장 컴포넌트를 제공합니다.

### 기본 컴포넌트

- **Button**: 클릭 가능한 버튼 (variant: primary, secondary, outline)
- **Text**: 본문 텍스트
- **Heading**: 제목 (h1-h6)
- **Link**: 하이퍼링크
- **Image**: 이미지 컨테이너

### 입력 컴포넌트

- **Input**: 텍스트 입력 필드
- **Checkbox**: 체크박스
- **Radio**: 라디오 버튼
- **Switch**: 토글 스위치
- **Slider**: 범위 슬라이더

### 레이아웃 컴포넌트

- **Card**: 콘텐츠 카드 컨테이너
- **Modal**: 모달 다이얼로그
- **Tabs**: 탭 네비게이션
- **List**: 목록 (ordered/unordered)
- **Form**: 폼 컨테이너

### 데이터 컴포넌트

- **Table**: 데이터 테이블
- **Badge**: 라벨/뱃지
- **Avatar**: 사용자 아바타
- **Progress**: 진행 표시줄
- **Dropdown**: 드롭다운 메뉴

---

## 워크플로우 예제

### 시나리오 1: 사용자 프로필 페이지 만들기

```
1단계: 테마 선택
Use preview-theme with themeId: calm-wellness

2단계: 블루프린트 생성
Use generate-blueprint with:
- description: "User profile page with avatar, name, bio, followers count, and edit button"
- layout: single-column
- themeId: calm-wellness
- componentHints: ["Card", "Avatar", "Heading", "Text", "Button", "Badge"]

3단계: 미리보기 확인
브라우저에서 previewUrl 열기

4단계: 코드 내보내기
Use export-screen with:
- blueprintId: [생성된 ID]
- format: tsx
- outputPath: src/screens/UserProfile.tsx
```

### 시나리오 2: 대시보드 생성

```
1단계: 적합한 테마 선택
Use preview-theme with themeId: korean-fintech

2단계: 대시보드 블루프린트 생성
Use generate-blueprint with:
- description: "Analytics dashboard with sales chart, revenue cards, recent transactions table, and performance metrics"
- layout: dashboard
- themeId: korean-fintech
- componentHints: ["Card", "Heading", "Table", "Text", "Badge"]

3단계: 테마 비교 (선택사항)
URL에서 themeId를 변경하여 다른 테마로 전환:
http://localhost:3000/preview/{timestamp}/corporate-blue

4단계: 최종 코드 내보내기
Use export-screen with:
- blueprintId: [생성된 ID]
- format: tsx
- outputPath: src/screens/Dashboard.tsx
```

### 시나리오 3: 랜딩 페이지 생성

```
1단계: 활기찬 테마 선택
Use preview-theme with themeId: vibrant-creative

2단계: 랜딩 페이지 블루프린트
Use generate-blueprint with:
- description: "Product landing page with hero section, feature cards, testimonials, and call-to-action button"
- layout: landing
- themeId: vibrant-creative
- componentHints: ["Heading", "Text", "Button", "Card", "Image"]

3단계: 코드 내보내기
Use export-screen with:
- blueprintId: [생성된 ID]
- format: tsx
- outputPath: src/pages/Landing.tsx
```

---

## 문제 해결

### 일반적인 문제

#### 1. "Theme not found" 오류

**원인**: 존재하지 않는 테마 ID

**해결**:

```bash
# 사용 가능한 테마 목록 확인
curl http://localhost:3000/api/themes
```

#### 2. "Invalid layout type" 오류

**원인**: 지원되지 않는 레이아웃

**해결**: 다음 중 하나 사용

- single-column
- two-column
- sidebar-left
- sidebar-right
- dashboard
- landing

#### 3. 블루프린트 ID를 찾을 수 없음

**원인**: 타임스탬프가 만료되었거나 잘못됨

**해결**:

```bash
# 저장된 블루프린트 확인
ls -la .tekton/blueprints/
```

#### 4. 미리보기 페이지가 로드되지 않음

**원인**: 서버가 실행 중이 아니거나 CORS 설정 문제

**해결**:

```bash
# 서버 상태 확인
curl http://localhost:3000/tools

# 서버 재시작
pnpm start
```

### 성능 최적화

#### 블루프린트 생성 속도

- ✅ `componentHints` 제공으로 생성 속도 향상
- ✅ 명확하고 구체적인 `description` 작성
- ✅ 적절한 `layout` 선택으로 구조화 개선

#### 미리보기 로딩 속도

- ✅ CSS 변수 캐싱 활성화
- ✅ 컴포넌트 lazy loading 사용
- ✅ 브라우저 캐시 활용

---

## 추가 리소스

- [API 참조](./03-api-reference.md) - 상세한 API 문서
- [아키텍처](./04-architecture.md) - 시스템 아키텍처 이해
- [개발자 가이드](./05-developer-guide.md) - 기여 방법
- [통합 가이드](./06-integration-guide.md) - SPEC-PLAYGROUND-001 통합

---

**다음**: [API 참조](./03-api-reference.md) - MCP Tools와 HTTP 엔드포인트 상세 문서
