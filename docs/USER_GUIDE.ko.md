# Tekton 시스템 사용자 가이드

> Tekton 디자인 시스템의 완전한 워크플로우 검증 가이드

**버전**: 1.0.0  
**최종 업데이트**: 2026-01-17

---

## 목차

1. [시스템 개요](#1-시스템-개요)
2. [사전 요구사항 및 설정](#2-사전-요구사항-및-설정)
3. [Web View Studio](#3-web-view-studio)
4. [MCP 통합](#4-mcp-통합)
5. [환경 감지](#5-환경-감지)
6. [토큰 및 CSS 매핑](#6-토큰-및-css-매핑)
7. [훅 컴포넌트 설정](#7-훅-컴포넌트-설정)
8. [화면 생성](#8-화면-생성)
9. [End-to-End 검증 체크리스트](#9-end-to-end-검증-체크리스트)
10. [문제 해결](#10-문제-해결)

---

## 1. 시스템 개요

### 아키텍처 다이어그램

```
┌──────────────────────────────────────────────────────────────────┐
│                        TEKTON STUDIO                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│   │  Studio Web     │    │  Studio API     │    │  Studio MCP  │ │
│   │  (Next.js 16)   │◄──►│  (FastAPI)      │◄──►│  (MCP Server)│ │
│   │  - UI Preview   │    │  - Presets CRUD │    │  - Brand DNA │ │
│   │  - Editor       │    │  - PostgreSQL   │    │  - 5-Axis    │ │
│   └────────┬────────┘    └────────┬────────┘    └──────┬───────┘ │
│            │                      │                     │         │
│   ┌────────▼──────────────────────▼─────────────────────▼──────┐ │
│   │              TOKEN CONTRACT (@tekton/token-contract)        │ │
│   │   - CSS 변수 (--tekton-*)   - OKLCH 색 공간                │ │
│   │   - 다크 모드 지원           - Tailwind 통합                │ │
│   └────────┬────────────────────────────────────────────────────┘ │
│            │                                                      │
│   ┌────────▼────────────────────────────────────────────────────┐ │
│   │         HEADLESS COMPONENTS (@tekton/headless-components)    │ │
│   │   - 20개 React 훅 (useButton, useInput, useModal 등)       │ │
│   │   - ARIA 준수 (WCAG AA/AAA)                                │ │
│   └────────┬────────────────────────────────────────────────────┘ │
│            │                                                      │
│   ┌────────▼────────────────────────────────────────────────────┐ │
│   │           ARCHETYPE SYSTEM (@tekton/archetype-system)        │ │
│   │   - 훅 속성 규칙         - 상태-스타일 매핑                  │ │
│   │   - 변형 브랜칭          - 구조 템플릿                      │ │
│   └────────┬────────────────────────────────────────────────────┘ │
│            │                                                      │
│   ┌────────▼────────────────────────────────────────────────────┐ │
│   │                     CLI (@tekton/cli)                        │ │
│   │   - 환경 감지              - 화면 생성기                     │ │
│   │   - 컨트랙트 검증기        - 토큰 주입기                     │ │
│   └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### 패키지 구조

| 패키지 | 목적 | 위치 |
|---------|---------|----------|
| `@tekton/studio-web` | 웹 기반 디자인 스튜디오 UI | `packages/studio-web/` |
| `@tekton/studio-api` | 프리셋 관리 REST API | `packages/studio-api/` |
| `@tekton/studio-mcp` | Brand DNA용 MCP 서버 | `packages/studio-mcp/` |
| `@tekton/token-contract` | 디자인 토큰 → CSS 매핑 | `packages/token-contract/` |
| `@tekton/headless-components` | 스타일 없는 React 훅 | `packages/headless-components/` |
| `@tekton/archetype-system` | 컴포넌트 아키타입 규칙 | `packages/archetype-system/` |
| `@tekton/cli` | 커맨드라인 인터페이스 | `packages/cli/` |
| `@tekton/contracts` | 타입 정의 및 스키마 | `packages/contracts/` |

---

## 2. 사전 요구사항 및 설정

### 시스템 요구사항

- **Node.js**: 22.x LTS 이상
- **pnpm**: 9.x 이상
- **Python**: 3.13+ (Studio API용)
- **PostgreSQL**: 16+ (프리셋 저장용)

### 설치

```bash
# 저장소 복제
git clone https://github.com/your-org/tekton.git
cd tekton

# 모든 의존성 설치
pnpm install

# 모든 패키지 빌드
pnpm build
```

### 환경 구성

각 서비스에 대한 환경 파일 생성:

**Studio API** (`packages/studio-api/.env`):
```env
DATABASE_URL=postgresql://user:password@localhost:5432/tekton
MCP_SERVER_URL=http://localhost:3000
API_HOST=0.0.0.0
API_PORT=8000
```

**Studio MCP** (`packages/studio-mcp/.env`):
```env
STORAGE_PATH=.tekton/brand-dna
MCP_PORT=3000
```

### 모든 서비스 시작

```bash
# 터미널 1: MCP 서버 시작
cd packages/studio-mcp
pnpm install  # 처음인 경우 nodemon 설치
pnpm dev      # 이제 TypeScript 컴파일 + 서버 실행

# 터미널 2: Studio API 시작
cd packages/studio-api
uv sync                                                    # 의존성 설치
uv run uvicorn studio_api.main:app --reload --host 0.0.0.0 --port 8000

# 터미널 3: Studio Web (현재 미구현)
# Studio Web UI는 계획되어 있지만 아직 구현되지 않았습니다
```

**참고**: Studio Web은 현재 개발 중입니다. 핵심 기능(MCP 및 API)은 이것 없이도 작동합니다.

---

## 3. Web View Studio

### 개요

Web View Studio는 다음을 위한 시각적 인터페이스를 제공합니다:
- 큐레이션된 디자인 프리셋 탐색
- 다양한 토큰 구성으로 컴포넌트 미리보기
- 새 프리셋 편집 및 생성
- 디자인 토큰 내보내기

### Studio 접근

1. 모든 서비스 시작 (섹션 2 참조)
2. 브라우저에서 `http://localhost:3001` 열기

### 워크플로우 검증

#### 1단계: Studio Web 로딩 확인

```bash
# Next.js 개발 서버가 실행 중인지 확인
curl http://localhost:3001/api/health

# 예상 응답:
# {"status": "ok", "service": "studio-web"}
```

#### 2단계: API 연결 확인

```bash
# Studio API 헬스 체크
curl http://localhost:8000/api/v2/health

# 예상 응답:
# {"status": "healthy", "database": "connected", "mcp": "connected"}
```

#### 3단계: 프리셋 갤러리 로드

1. 프리셋 갤러리 페이지로 이동
2. API에서 프리셋이 로드되는지 확인
3. 프리셋을 클릭하여 상세 보기
4. 디자인 토큰이 올바르게 표시되는지 확인

#### 4단계: 컴포넌트 미리보기

1. 갤러리에서 프리셋 선택
2. 컴포넌트 미리보기 패널 열기
3. 컴포넌트가 올바른 스타일로 렌더링되는지 확인:
   - 버튼 변형 (primary, secondary, outline)
   - 상태별 입력 필드 (default, focus, error)
   - 배경이 있는 모달 대화상자

### 검증 체크리스트

- [ ] `http://localhost:3001`에서 Studio Web 로드됨
- [ ] API 헬스 체크가 정상 상태 반환
- [ ] 프리셋 갤러리에 사용 가능한 프리셋 표시
- [ ] 프리셋 상세 보기에서 디자인 토큰 표시
- [ ] 컴포넌트 미리보기가 올바르게 렌더링
- [ ] 다크 모드 토글 작동
- [ ] 토큰 변경이 미리보기에 반영

---

## 4. MCP 통합

### 개요

MCP (Model Context Protocol) 서버는 AI 어시스턴트가 다음을 수행할 수 있도록 합니다:
- 컴포넌트 생성을 위한 훅 아키타입 조회
- 4-레이어 아키타입 데이터 액세스 (프롭 규칙, 상태 매핑, 변형, 구조)
- WCAG 레벨, 상태 이름 및 기타 기준으로 아키타입 검색

### 아키타입 시스템 아키텍처

아키타입 시스템은 AI 기반 컴포넌트 생성을 위한 구조화된 데이터를 제공합니다:

| 레이어 | 설명 | 콘텐츠 |
|-------|-------------|---------|
| **레이어 1** | 훅 속성 규칙 | 훅을 prop 객체와 기본 CSS 스타일에 매핑 |
| **레이어 2** | 상태-스타일 매핑 | 컴포넌트 상태에 대한 시각적 피드백 규칙 |
| **레이어 3** | 변형 브랜칭 | 구성에 기반한 조건부 스타일링 |
| **레이어 4** | 구조 템플릿 | HTML/JSX 패턴 및 접근성 규칙 |

### 사용 가능한 MCP 도구

| 도구 | 설명 |
|------|-------------|
| `archetype.list` | 사용 가능한 모든 훅 나열 |
| `archetype.get` | 훅에 대한 완전한 아키타입 가져오기 |
| `archetype.getPropRules` | 레이어 1 (훅 prop 규칙) 가져오기 |
| `archetype.getStateMappings` | 레이어 2 (상태-스타일 매핑) 가져오기 |
| `archetype.getVariants` | 레이어 3 (변형 브랜칭) 가져오기 |
| `archetype.getStructure` | 레이어 4 (구조 템플릿) 가져오기 |
| `archetype.query` | 기준으로 검색 (WCAG 레벨, 상태명 등) |

### 구현 세부사항

#### 패키지 구조

```
packages/studio-mcp/
├── src/
│   ├── index.ts              # 패키지 내보내기
│   ├── archetype/
│   │   └── tools.ts          # ArchetypeTools 클래스
│   ├── server/
│   │   ├── index.ts          # 서버 진입점
│   │   └── mcp-server.ts     # HTTP MCP 서버
│   ├── storage/
│   │   └── storage.ts        # 범용 스토리지 유틸리티
│   └── types/
│       └── design-tokens.ts  # 디자인 토큰 스키마
└── tests/
    ├── archetype/
    │   └── tools.test.ts     # ArchetypeTools 테스트
    ├── storage/
    │   └── storage.test.ts   # 스토리지 테스트
    └── index.test.ts         # 내보내기 테스트
```

#### ArchetypeTools 클래스

`ArchetypeTools` 클래스는 아키타입 데이터에 대한 프로그래밍 방식 액세스를 제공합니다:

```typescript
import { ArchetypeTools, archetypeTools } from '@tekton/studio-mcp';

// 초기화 (@tekton/archetype-system에서 데이터 로드)
await archetypeTools.initialize();

// 사용 가능한 모든 훅 나열
const hookList = await archetypeTools.list();
// { success: true, data: ["useButton", "useTextField", ...] }

// 훅에 대한 완전한 아키타입 가져오기
const archetype = await archetypeTools.get("useButton");
// { success: true, data: { hookName, propRules, stateMappings, variants, structure } }

// 개별 레이어 가져오기
const propRules = await archetypeTools.getPropRules("useButton");
const stateMappings = await archetypeTools.getStateMappings("useButton");
const variants = await archetypeTools.getVariants("useButton");
const structure = await archetypeTools.getStructure("useButton");

// 기준으로 조회
const aaComponents = await archetypeTools.query({ wcagLevel: "AA" });
const buttonComponents = await archetypeTools.query({ propObject: "buttonProps" });
```

#### MCP 서버 구현

MCP 서버는 CORS 지원이 있는 HTTP 기반 구현입니다:

```typescript
import { createMCPServer, TOOLS } from '@tekton/studio-mcp';

// 포트 3000에서 서버 시작
const server = createMCPServer(3000);

// 사용 가능한 엔드포인트:
// GET  /health              - 헬스 체크
// GET  /tools               - 사용 가능한 도구 목록
// POST /tools/:toolName     - 도구 실행
```

**서버 기능:**
- 크로스 오리진 요청을 위한 CORS 활성화
- JSON 요청/응답 형식
- POST 요청을 통한 도구 실행
- 우아한 종료 처리 (SIGINT, SIGTERM)

#### 스토리지 유틸리티

아키타입 데이터 지속을 위한 범용 스토리지 함수:

```typescript
import {
  saveArchetype,
  loadArchetype,
  listArchetypes,
  deleteArchetype,
  archetypeExists
} from '@tekton/studio-mcp';
import { z } from 'zod';

// 스키마 정의
const MySchema = z.object({
  hookName: z.string(),
  version: z.string(),
});

// 스키마 검증과 함께 데이터 저장
await saveArchetype('useButton', myData, MySchema);

// 스키마 검증과 함께 데이터 로드
const data = await loadArchetype('useButton', MySchema);

// 저장된 모든 아키타입 나열
const hooks = await listArchetypes();
// ["useButton", "useTextField", ...]

// 아키타입 존재 확인
const exists = await archetypeExists('useButton');

// 아키타입 삭제
await deleteArchetype('useButton');
```

**스토리지 기능:**
- 저장/로드 시 Zod 스키마 검증
- 자동 디렉토리 생성
- 메타데이터가 포함된 JSON 파일 형식 (hookName, updatedAt)
- 커스텀 스토리지 경로 지원

### 워크플로우 검증

#### 1단계: MCP 서버 확인

```bash
# MCP 서버가 실행 중인지 확인
curl http://localhost:3000/health

# 예상 응답:
# {"status": "ok", "service": "studio-mcp", "tools": ["archetype.list", ...]}
```

#### 2단계: 사용 가능한 훅 나열

```bash
# 모든 사용 가능한 훅 나열
curl -X POST http://localhost:3000/tools/archetype.list

# 예상 응답:
# {"success": true, "data": ["useButton", "useTextField", "useModal", ...]}
```

#### 3단계: 아키타입 데이터 가져오기

```bash
# useButton에 대한 완전한 아키타입 가져오기
curl -X POST http://localhost:3000/tools/archetype.get \
  -H "Content-Type: application/json" \
  -d '{"hookName": "useButton"}'

# 예상: hookName, propRules, stateMappings, variants, structure가 포함된 JSON
```

#### 4단계: 레이어별 데이터 쿼리

```bash
# 레이어 1: 프롭 규칙만 가져오기
curl -X POST http://localhost:3000/tools/archetype.getPropRules \
  -H "Content-Type: application/json" \
  -d '{"hookName": "useButton"}'

# 레이어 2: 상태 매핑 가져오기
curl -X POST http://localhost:3000/tools/archetype.getStateMappings \
  -H "Content-Type: application/json" \
  -d '{"hookName": "useButton"}'
```

#### 5단계: Claude 통합 확인

Claude Code를 MCP 서버를 사용하도록 구성:

```json
// .claude/settings.json
{
  "mcpServers": {
    "tekton-archetype": {
      "command": "node",
      "args": ["packages/studio-mcp/dist/index.js"],
      "env": {
        "STORAGE_PATH": ".tekton/archetypes"
      }
    }
  }
}
```

Claude에서 액세스 확인:
```
> 사용 가능한 훅 아키타입은 무엇입니까?
> useButton에 대한 완전한 아키타입을 보여주세요
> WCAG AA 준수 컴포넌트를 찾아주세요
```

### 검증 체크리스트

- [ ] MCP 서버가 오류 없이 시작됨
- [ ] 헬스 엔드포인트가 도구 목록 반환
- [ ] 훅 목록 조회 작동
- [ ] 아키타입 데이터 가져오기 작동
- [ ] 레이어별 쿼리 작동
- [ ] Claude가 MCP 도구에 액세스 가능
- [ ] 스토리지가 `.tekton/archetypes/`에 유지됨

---

## 5. 환경 감지

### 개요

CLI는 자동으로 프로젝트 환경을 감지하여:
- 적절한 토큰 형식 선택 (CSS 변수 vs StyleSheet)
- 플랫폼별 컴포넌트 코드 생성
- 적절한 빌드 도구 구성

### 지원되는 환경

| 플랫폼 | 프레임워크 | 감지 방법 |
|----------|-----------|------------------|
| Web | Next.js | dependencies에 `next` |
| Web | Vite | dependencies에 `vite` |
| Web | React | dependencies에 `react` |
| Mobile | React Native | dependencies에 `react-native` |
| Mobile | Expo | dependencies에 `expo` |

### 워크플로우 검증

#### 1단계: 현재 환경 확인

```bash
# 프로젝트 루트에서
cd /path/to/your/project

# 환경 감지 실행
npx @tekton/cli detect-env

# 예상 출력:
# Environment Detection Results:
# ├── Platform: web
# ├── Framework: next
# ├── React Native: false
# ├── Expo: false
# ├── Next.js: true
# └── Vite: false
```

#### 2단계: 감지 로직 확인

**Next.js** 프로젝트의 경우:
```json
// package.json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0"
  }
}
```

예상 감지:
```typescript
{
  platform: 'web',
  isWeb: true,
  isReactNative: false,
  framework: 'next',
  hasNext: true
}
```

**React Native** 프로젝트의 경우:
```json
// package.json
{
  "dependencies": {
    "react-native": "^0.75.0",
    "expo": "^52.0.0"
  }
}
```

예상 감지:
```typescript
{
  platform: 'react-native',
  isWeb: false,
  isReactNative: true,
  hasExpo: true
}
```

#### 3단계: 환경 컨트랙트 검증

```bash
# 환경 구성 검증
npx @tekton/cli validate-env --config tekton.config.json
```

### 검증 체크리스트

- [ ] `detect-env` 명령이 성공적으로 실행됨
- [ ] 플랫폼이 올바르게 감지됨 (web/react-native)
- [ ] 프레임워크가 식별됨 (next/vite/react/expo)
- [ ] Next.js 프로젝트에서 감지 작동
- [ ] React Native 프로젝트에서 감지 작동
- [ ] 알 수 없는 프로젝트는 `platform: 'unknown'` 반환

---

## 6. 토큰 및 CSS 매핑

### 개요

토큰 컨트랙트 시스템은 디자인 토큰을 CSS 변수로 매핑합니다:
- 의미론적 명명: `--tekton-{category}-{variant}`
- 지각적 균일성을 위한 OKLCH 색 공간
- 자동 다크 모드 생성

### CSS 변수 명명 규칙

```css
/* 패턴 */
--tekton-{semantic}-{step}

/* 예시 */
--tekton-primary-500      /* 주요 색상, 중간 강도 */
--tekton-neutral-100      /* 중립 색상, 밝음 */
--tekton-spacing-md       /* 중간 간격 */
--tekton-radius-lg        /* 큰 둥근 모서리 */
```

### 토큰 카테고리

| 카테고리 | 예시 | 형식 |
|----------|----------|--------|
| `colors` | `primary-500`, `neutral-100` | OKLCH 값 |
| `spacing` | `xs`, `sm`, `md`, `lg`, `xl` | rem 값 |
| `typography` | `font-size-base`, `line-height-tight` | rem/unitless |
| `borderRadius` | `sm`, `md`, `lg`, `full` | rem 값 |
| `shadows` | `sm`, `md`, `lg`, `xl` | box-shadow |
| `transitions` | `fast`, `normal`, `slow` | duration |
| `breakpoints` | `sm`, `md`, `lg`, `xl` | px 값 |
| `zIndex` | `modal`, `tooltip`, `dropdown` | integers |
| `opacity` | `disabled`, `hover`, `muted` | 0-1 |

### 워크플로우 검증

#### 1단계: 토큰에서 CSS 생성

```bash
# CSS 변수 생성
npx @tekton/cli generate-tokens \
  --preset next-tailwind-shadcn \
  --output ./styles/tokens.css
```

예상 출력 (`styles/tokens.css`):
```css
:root {
  /* Colors - OKLCH 형식 */
  --tekton-primary-500: oklch(0.5 0.15 220);
  --tekton-primary-600: oklch(0.4 0.15 220);
  --tekton-neutral-100: oklch(0.95 0.01 0);
  --tekton-neutral-900: oklch(0.15 0.01 0);

  /* Spacing */
  --tekton-spacing-xs: 0.25rem;
  --tekton-spacing-sm: 0.5rem;
  --tekton-spacing-md: 1rem;
  --tekton-spacing-lg: 1.5rem;

  /* Border Radius */
  --tekton-radius-sm: 0.25rem;
  --tekton-radius-md: 0.5rem;
  --tekton-radius-lg: 1rem;
}
```

#### 2단계: 다크 모드 오버라이드 생성

```bash
# 다크 모드로 생성
npx @tekton/cli generate-tokens \
  --preset next-tailwind-shadcn \
  --dark-mode \
  --output ./styles/tokens.css
```

예상 다크 모드 섹션:
```css
[data-theme="dark"] {
  --tekton-primary-500: oklch(0.6 0.15 220);
  --tekton-neutral-100: oklch(0.15 0.01 0);
  --tekton-neutral-900: oklch(0.95 0.01 0);
}
```

#### 3단계: Tailwind와 통합

`tailwind.config.ts`에 추가:
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: 'var(--tekton-primary-500)',
          600: 'var(--tekton-primary-600)',
        },
        neutral: {
          100: 'var(--tekton-neutral-100)',
          900: 'var(--tekton-neutral-900)',
        },
      },
      spacing: {
        'tekton-xs': 'var(--tekton-spacing-xs)',
        'tekton-sm': 'var(--tekton-spacing-sm)',
        'tekton-md': 'var(--tekton-spacing-md)',
      },
      borderRadius: {
        'tekton-sm': 'var(--tekton-radius-sm)',
        'tekton-md': 'var(--tekton-radius-md)',
      },
    },
  },
};

export default config;
```

#### 4단계: 토큰 사용 확인

```tsx
// Tailwind를 통해 Tekton 토큰을 사용하는 컴포넌트
export function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-primary-500 text-neutral-100 rounded-tekton-md px-tekton-md py-tekton-sm">
      {children}
    </button>
  );
}
```

#### 5단계: React Native StyleSheet 통합

React Native 프로젝트의 경우:

```bash
npx @tekton/cli generate-tokens \
  --preset react-native \
  --format stylesheet \
  --output ./styles/tokens.ts
```

예상 출력 (`styles/tokens.ts`):
```typescript
export const tokens = {
  colors: {
    primary500: 'oklch(0.5 0.15 220)',
    neutral100: 'oklch(0.95 0.01 0)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
};
```

### 검증 체크리스트

- [ ] 토큰 생성이 유효한 CSS 생성
- [ ] OKLCH 색상 형식이 올바름
- [ ] 다크 모드 오버라이드가 올바르게 생성됨
- [ ] CSS 변수가 `--tekton-*` 접두사 사용
- [ ] Tailwind 통합 작동
- [ ] React Native StyleSheet 형식 생성
- [ ] 9개 토큰 카테고리가 모두 존재

---

## 7. 훅 컴포넌트 설정

### 개요

아키타입 시스템은 헤드리스 훅이 디자인 토큰과 어떻게 연결되는지 정의합니다:
- **훅 속성 규칙**: 훅 props를 CSS 속성에 매핑
- **상태-스타일 매핑**: 컴포넌트 상태에 대한 스타일 정의
- **변형 브랜칭**: 컴포넌트 변형 처리
- **구조 템플릿**: 컴포넌트 HTML 구조 정의

### 사용 가능한 헤드리스 훅 (총 20개)

**컴포넌트 계층**:
| 훅 | 목적 | Props |
|------|---------|-------|
| `useButton` | 토글 기능이 있는 버튼 | `buttonProps` |
| `useCheckbox` | 접근성이 있는 체크박스 | `checkboxProps`, `labelProps` |
| `useRadio` | 라디오 버튼 그룹 | `radioProps`, `radioGroupProps` |
| `useToggle` | 토글 스위치 | `toggleProps` |
| `useInput` | 텍스트 입력 | `inputProps`, `labelProps` |
| `useSelect` | Select/Combobox | `selectProps`, `optionProps` |

**오버레이 계층**:
| 훅 | 목적 | Props |
|------|---------|-------|
| `useModal` | 모달 대화상자 | `overlayProps`, `modalProps` |
| `usePopover` | Popover 위치 지정 | `triggerProps`, `popoverProps` |
| `useDropdownMenu` | 드롭다운 메뉴 | `menuProps`, `itemProps` |
| `useTooltip` | 툴팁 | `triggerProps`, `tooltipProps` |
| `useAlert` | 알림 대화상자 | `alertProps` |
| `useSlider` | 범위 슬라이더 | `sliderProps`, `thumbProps` |

**탐색 계층**:
| 훅 | 목적 | Props |
|------|---------|-------|
| `useTabs` | 탭 탐색 | `tabListProps`, `tabProps`, `panelProps` |
| `useBreadcrumb` | 브레드크럼 탐색 | `navProps`, `itemProps` |
| `usePagination` | 페이지네이션 | `paginationProps`, `pageProps` |
| `useRangeCalendar` | 날짜 범위 | `calendarProps`, `cellProps` |
| `useProgress` | 진행 표시줄 | `progressProps`, `fillProps` |

**표시 계층**:
| 훅 | 목적 | Props |
|------|---------|-------|
| `useCard` | 카드 컨테이너 | `cardProps` |
| `useBadge` | 배지 표시 | `badgeProps` |
| `useAvatar` | 아바타 표시 | `avatarProps` |
| `useDivider` | 구분선 | `dividerProps` |

### 훅 속성 규칙 구조

```typescript
interface HookPropRule {
  hookName: string;           // "useButton"
  propObjects: string[];      // ["buttonProps"]
  baseStyles: BaseStyle[];    // CSS 속성 매핑
  requiredCSSVariables: string[];
}

interface BaseStyle {
  propObject: string;
  cssProperties: Record<string, string>;
}
```

### 워크플로우 검증

#### 1단계: 훅 속성 규칙 보기

```bash
# 모든 훅 속성 규칙 나열
npx @tekton/cli list-archetypes

# 예상 출력:
# Available Hook Archetypes:
# ├── useButton (buttonProps)
# ├── useInput (inputProps, labelProps)
# ├── useModal (overlayProps, modalProps)
# └── ... (17 more)
```

#### 2단계: 특정 규칙 검사

```bash
# useButton 세부 정보 가져오기
npx @tekton/cli show-archetype useButton
```

예상 출력:
```yaml
Hook: useButton
PropObjects:
  - buttonProps
BaseStyles:
  buttonProps:
    background-color: var(--tekton-primary-500)
    color: var(--tekton-neutral-100)
    border-radius: var(--tekton-radius-md)
    padding: var(--tekton-spacing-sm) var(--tekton-spacing-md)
    transition: var(--tekton-transition-normal)
RequiredCSSVariables:
  - --tekton-primary-500
  - --tekton-neutral-100
  - --tekton-radius-md
  - --tekton-spacing-sm
  - --tekton-spacing-md
  - --tekton-transition-normal
```

#### 3단계: 훅 속성 규칙 검증

```bash
# 토큰 컨트랙트에 대해 모든 규칙 검증
npx @tekton/cli validate-archetypes

# 예상 출력:
# Validating Hook Prop Rules...
# ✓ useButton: All CSS variables exist in token contract
# ✓ useInput: All CSS variables exist in token contract
# ✓ useModal: All CSS variables exist in token contract
# ...
# Validation complete: 20/20 rules valid
```

#### 4단계: 스타일드 컴포넌트 생성

```bash
# 훅에서 스타일드 컴포넌트 생성
npx @tekton/cli generate-component \
  --hook useButton \
  --variant primary \
  --output ./components/Button.tsx
```

예상 출력 (`components/Button.tsx`):
```tsx
'use client';

import { useButton } from '@tekton/headless-components';
import { forwardRef } from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  isDisabled?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, onPress, isDisabled }, ref) => {
    const { buttonProps } = useButton({
      onPress,
      isDisabled,
    });

    return (
      <button
        {...buttonProps}
        ref={ref}
        style={{
          backgroundColor: 'var(--tekton-primary-500)',
          color: 'var(--tekton-neutral-100)',
          borderRadius: 'var(--tekton-radius-md)',
          padding: 'var(--tekton-spacing-sm) var(--tekton-spacing-md)',
          transition: 'var(--tekton-transition-normal)',
        }}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

#### 5단계: 상태-스타일 매핑 확인

상태-스타일 매핑은 다양한 컴포넌트 상태에 대한 스타일을 정의합니다:

```typescript
// 상태-스타일 매핑 예시
{
  hookName: 'useButton',
  states: {
    default: {
      backgroundColor: 'var(--tekton-primary-500)',
    },
    hover: {
      backgroundColor: 'var(--tekton-primary-600)',
    },
    pressed: {
      backgroundColor: 'var(--tekton-primary-700)',
    },
    disabled: {
      backgroundColor: 'var(--tekton-neutral-300)',
      opacity: 'var(--tekton-opacity-disabled)',
    },
  },
}
```

#### 6단계: 변형 브랜칭 테스트

```bash
# 여러 변형 생성
npx @tekton/cli generate-component \
  --hook useButton \
  --variants primary,secondary,outline \
  --output ./components/
```

### 검증 체크리스트

- [ ] 20개 훅이 모두 나열됨
- [ ] 훅 속성 규칙이 올바르게 로드됨
- [ ] 기본 스타일이 `var(--tekton-*)` 형식 사용
- [ ] 규칙에 하드코딩된 색상 없음
- [ ] CSS 변수 검증 통과
- [ ] 컴포넌트 생성 작동
- [ ] 상태-스타일 매핑이 올바르게 적용됨
- [ ] 변형 브랜칭이 여러 스타일 생성

---

## 8. 화면 생성

### 개요

화면 생성 워크플로우는 완전한 페이지 구조를 생성합니다:
- 환경 인식 코드 생성
- 스켈레톤 기반 레이아웃
- 의도 기반 컴포넌트 제안
- 각 단계에서 컨트랙트 검증

### 화면 의도

| 의도 | 설명 | 제안 컴포넌트 |
|--------|-------------|---------------------|
| `DataList` | 데이터 목록 페이지 | Table, Card, Pagination, Search |
| `DataDetail` | 상세 보기 페이지 | Card, Badge, Button, Tabs |
| `Dashboard` | 대시보드 레이아웃 | Card, Chart, Progress, Badge |
| `Form` | 양식 제출 | Input, Select, Checkbox, Button |
| `Wizard` | 다단계 플로우 | Progress, Button, Card |
| `Auth` | 인증 | Input, Button, Card |
| `Settings` | 설정 페이지 | Toggle, Input, Select, Card |
| `EmptyState` | 빈 상태 | Button, Card |
| `Error` | 오류 페이지 | Button, Card |
| `Custom` | 사용자 정의 레이아웃 | (사용자 지정) |

### 스켈레톤 프리셋

| 프리셋 | 구조 |
|--------|-----------|
| `full-screen` | 콘텐츠만, 크롬 없음 |
| `with-header` | 헤더 + 콘텐츠 |
| `with-sidebar` | 사이드바 + 콘텐츠 |
| `with-header-sidebar` | 헤더 + 사이드바 + 콘텐츠 |
| `with-header-footer` | 헤더 + 콘텐츠 + 푸터 |
| `dashboard` | 헤더 + 사이드바 + 콘텐츠 + 푸터 |

### 워크플로우 검증

#### 1단계: 화면 생성 (대화형 모드)

```bash
npx @tekton/cli create-screen --interactive
```

대화형 프롬프트:
```
? Screen name: UserDashboard
? Environment: web
? Skeleton preset: dashboard
? Screen intent: Dashboard
? Components (auto-suggested): Card, Progress, Badge, Chart
? Output path: src/screens
```

#### 2단계: 화면 생성 (비대화형 모드)

```bash
npx @tekton/cli create-screen \
  --name UserDashboard \
  --environment web \
  --skeleton dashboard \
  --intent Dashboard \
  --components Card,Progress,Badge \
  --path src/screens
```

#### 3단계: 생성된 구조 확인

```bash
tree src/screens/UserDashboard/
```

예상 구조:
```
src/screens/UserDashboard/
├── page.tsx           # 페이지 컴포넌트
├── layout.tsx         # 레이아웃 래퍼
└── components/
    └── index.ts       # 컴포넌트 내보내기
```

#### 4단계: 생성된 파일 검사

**`page.tsx`**:
```tsx
'use client';

import { Card } from '@tekton/headless-components';
import { Progress } from '@tekton/headless-components';
import { Badge } from '@tekton/headless-components';

export default function UserDashboardPage() {
  return (
    <div className="flex flex-col gap-tekton-md p-tekton-lg">
      <section className="grid grid-cols-3 gap-tekton-md">
        <Card>
          <Card.Header>
            <Badge>Active</Badge>
          </Card.Header>
          <Card.Body>
            <Progress value={75} />
          </Card.Body>
        </Card>
      </section>
    </div>
  );
}
```

**`layout.tsx`**:
```tsx
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function UserDashboardLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 border-b">
        {/* Header content */}
      </header>
      <div className="flex flex-1">
        <aside className="w-64 border-r">
          {/* Sidebar content */}
        </aside>
        <main className="flex-1 p-tekton-lg">
          {children}
        </main>
      </div>
      <footer className="h-12 border-t">
        {/* Footer content */}
      </footer>
    </div>
  );
}
```

#### 5단계: 화면 컨트랙트 검증

```bash
npx @tekton/cli validate-screen src/screens/UserDashboard
```

예상 출력:
```
Validating Screen: UserDashboard
├── ✓ Screen name format: PascalCase
├── ✓ Environment: web (valid)
├── ✓ Skeleton: dashboard (valid)
├── ✓ Intent: Dashboard (valid)
├── ✓ Components: Card, Progress, Badge (all exist)
└── ✓ File structure: Complete

Validation passed!
```

#### 6단계: 환경별 생성 테스트

React Native용:
```bash
npx @tekton/cli create-screen \
  --name UserProfile \
  --environment mobile \
  --skeleton with-header \
  --intent DataDetail
```

예상 React Native 구조:
```tsx
// Tailwind 클래스 대신 StyleSheet 사용
import { StyleSheet, View, ScrollView } from 'react-native';
import { tokens } from '@tekton/token-contract';

export default function UserProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Content */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: tokens.spacing.lg,
  },
});
```

### 검증 체크리스트

- [ ] 대화형 모드가 올바르게 프롬프트
- [ ] 화면 이름 검증 (PascalCase)
- [ ] 환경 감지 작동
- [ ] 스켈레톤 프리셋이 올바르게 적용
- [ ] 의도가 적절한 컴포넌트 제안
- [ ] 파일 구조가 올바르게 생성됨
- [ ] 컨트랙트 검증 통과
- [ ] 웹이 Tailwind 클래스 생성
- [ ] 모바일이 StyleSheet 생성
- [ ] 컴포넌트가 헤드리스 라이브러리에서 import됨

---

## 9. End-to-End 검증 체크리스트

완전한 Tekton 시스템이 작동하는지 확인하려면 이 체크리스트를 사용하세요:

### 인프라

- [ ] **Node.js 22+** 설치됨 (`node --version`)
- [ ] **pnpm 9+** 설치됨 (`pnpm --version`)
- [ ] **Python 3.13+** 설치됨 (`python --version`)
- [ ] **PostgreSQL 16+** 실행 중 (`pg_isready`)

### 서비스

- [ ] **Studio MCP**가 `http://localhost:3000`에서 실행 중
- [ ] **Studio API**가 `http://localhost:8000`에서 실행 중
- [ ] **Studio Web**이 `http://localhost:3001`에서 실행 중

### MCP 통합

- [ ] MCP 헬스 체크 통과
- [ ] Brand DNA 생성 작동
- [ ] 축 해석이 토큰 반환
- [ ] CSS 내보내기가 유효한 변수 생성
- [ ] Claude Code가 MCP 도구에 액세스 가능

### 환경 감지

- [ ] Next.js 프로젝트가 올바르게 감지됨
- [ ] React Native 프로젝트가 올바르게 감지됨
- [ ] Vite 프로젝트가 올바르게 감지됨
- [ ] 알 수 없는 프로젝트가 `unknown` 반환

### 토큰 및 CSS 매핑

- [ ] CSS 생성이 유효한 출력 생성
- [ ] OKLCH 색상이 올바르게 형식화됨
- [ ] 다크 모드 오버라이드 작동
- [ ] Tailwind 통합 기능
- [ ] React Native StyleSheet 생성

### 훅 컴포넌트 설정

- [ ] 20개 훅이 모두 사용 가능
- [ ] 훅 속성 규칙 검증
- [ ] 규칙에 하드코딩된 색상 없음
- [ ] 컴포넌트 생성 작동
- [ ] 상태-스타일 매핑 적용

### 화면 생성

- [ ] 대화형 모드 작동
- [ ] 비대화형 모드 작동
- [ ] 모든 스켈레톤 프리셋 생성
- [ ] 모든 의도가 컴포넌트 제안
- [ ] 웹 출력이 Tailwind 사용
- [ ] 모바일 출력이 StyleSheet 사용
- [ ] 컨트랙트 검증 통과

### 통합 플로우

- [ ] Brand DNA → 토큰 생성 → CSS 변수 → 컴포넌트 스타일링
- [ ] 환경 감지 → 플랫폼별 생성
- [ ] 의도 → 컴포넌트 제안 → 화면 생성

---

## 10. 문제 해결

### 일반적인 문제

#### MCP 서버가 시작되지 않음

```bash
# 포트 3000이 사용 중인지 확인
lsof -i :3000

# 기존 프로세스 종료
kill -9 <PID>

# MCP 서버 재시작
cd packages/studio-mcp && pnpm dev
```

#### 데이터베이스 연결 실패

```bash
# PostgreSQL이 실행 중인지 확인
pg_isready -h localhost -p 5432

# 연결 문자열 확인
echo $DATABASE_URL

# 마이그레이션 실행
cd packages/studio-api
alembic upgrade head
```

#### 토큰 생성 실패

```bash
# 프리셋이 존재하는지 확인
ls packages/token-contract/dist/presets/defaults/

# 프리셋 JSON 검증
cat packages/token-contract/dist/presets/defaults/next-tailwind-shadcn.json | jq .
```

#### 훅 검증 오류

```bash
# 하드코딩된 색상 확인
grep -r "rgb\|hsl\|#[0-9a-fA-F]" packages/archetype-system/src/

# CSS 변수가 존재하는지 검증
npx @tekton/cli validate-tokens
```

#### 화면 생성 실패

```bash
# 화면 이름 형식 확인
# PascalCase여야 함: UserDashboard, user-dashboard가 아님

# 환경 확인
npx @tekton/cli detect-env

# 출력 디렉토리가 존재하는지 확인
mkdir -p src/screens
```

### 도움 받기

- **문서화**: `docs/` 디렉토리
- **사양**: `.moai/specs/` 디렉토리
- **이슈**: GitHub Issues
- **MoAI 명령어**: `/moai:9-feedback "your feedback"`

---

## 부록: 빠른 참조

### CLI 명령어

```bash
# 환경
npx @tekton/cli detect-env

# 토큰
npx @tekton/cli generate-tokens --preset <name> --output <path>
npx @tekton/cli validate-tokens

# 아키타입
npx @tekton/cli list-archetypes
npx @tekton/cli show-archetype <hookName>
npx @tekton/cli validate-archetypes

# 컴포넌트
npx @tekton/cli generate-component --hook <name> --output <path>

# 화면
npx @tekton/cli create-screen --interactive
npx @tekton/cli create-screen --name <Name> --skeleton <preset> --intent <type>
npx @tekton/cli validate-screen <path>
```

### API 엔드포인트

```bash
# 헬스 체크
GET /api/v2/health

# 프리셋
GET    /api/v2/presets
POST   /api/v2/presets
GET    /api/v2/presets/{id}
PUT    /api/v2/presets/{id}
DELETE /api/v2/presets/{id}
```

### MCP 도구

```bash
brand-dna.create    # Brand DNA 생성
brand-dna.read      # Brand DNA 읽기
brand-dna.update    # Brand DNA 업데이트
brand-dna.interpret # 축 해석
brand-dna.export-css # CSS 내보내기
```

---

*이 가이드는 Tekton 디자인 시스템 문서의 일부입니다.*
