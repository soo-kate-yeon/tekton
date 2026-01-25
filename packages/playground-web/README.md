# Tekton Playground Web

Next.js 16 기반 Tekton 디자인 토큰 생성기 Playground 웹 애플리케이션입니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.7+
- **Styling**: Tailwind CSS 3.4+
- **State Management**: @tanstack/react-query 5.x
- **Validation**: Zod 3.23+
- **Backend**: @tekton/core (workspace package)

## 시작하기

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
MCP_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### 개발 서버 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 시작 (포트 3001)
pnpm dev

# 타입 체크
pnpm type-check

# 린트
pnpm lint
```

### 빌드

```bash
# 프로덕션 빌드
pnpm build

# 프로덕션 서버 시작
pnpm start
```

## 디렉토리 구조

```
playground-web/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 루트 레이아웃
│   └── page.tsx            # 홈 페이지
├── components/             # React 컴포넌트
│   ├── theme/              # 테마 관련 컴포넌트
│   ├── layouts/            # 레이아웃 컴포넌트
│   ├── blueprint/          # Blueprint 관련 컴포넌트
│   └── ui/                 # 재사용 가능한 UI 컴포넌트
├── lib/                    # 유틸리티 및 헬퍼
│   ├── mcp-client.ts       # MCP 서버 클라이언트
│   ├── schemas.ts          # Zod 스키마
│   └── utils.ts            # 유틸리티 함수
└── styles/                 # 전역 스타일
    └── globals.css         # 전역 CSS
```

## MCP 서버 연동

이 애플리케이션은 SPEC-MCP-002 MCP 서버와 통신합니다:

- **서버 주소**: `http://localhost:3000`
- **프로토콜**: JSON-RPC over HTTP
- **주요 메서드**:
  - `generate-blueprint`: Blueprint 생성
  - (추가 메서드는 향후 구현)

## 개발 가이드

### 타입 안전성

- Strict TypeScript 모드 활성화
- Zod를 사용한 런타임 검증
- Path aliases 설정 (`@/*`)

### 코드 품질

- ESLint (Next.js 권장 설정)
- Prettier (코드 포맷팅)
- TypeScript strict 모드

### 성능 최적화

- React Server Components 사용
- Next.js 16 App Router 최적화
- Tailwind CSS JIT 컴파일

## 라이선스

MIT
