# 빠른 시작 가이드 (Quick Start Guide)

Tekton MCP Server를 5분 안에 시작하세요.

## 개요

Tekton MCP Server는 Claude Code와 통합되어 자연어로 디자인 시스템 화면을 생성하는 MCP Protocol 서버입니다.

**핵심 기능**:

- 🤖 **Claude Code 통합**: MCP Protocol을 통한 AI 기반 블루프린트 생성
- 🎨 **13개 내장 테마**: OKLCH 기반 색상 시스템으로 일관된 디자인
- 📋 **타입 안전 블루프린트**: Zod 스키마 검증으로 오류 방지
- ⏱️ **타임스탬프 기반 히스토리**: 모든 디자인 반복을 불변 URL로 보존
- 🚀 **프로덕션 코드 내보내기**: JSX, TSX, Vue 형식 지원

## 설치

### 전제 조건

- Node.js 20 이상
- pnpm 8 이상
- Claude Code (MCP Protocol 지원)

### 패키지 설치

```bash
# 저장소 클론
git clone https://github.com/your-org/tekton.git
cd tekton

# 의존성 설치
pnpm install

# MCP 서버 빌드
cd packages/mcp-server
pnpm build
```

## 서버 실행

```bash
# 개발 모드 (자동 재빌드)
pnpm dev

# 프로덕션 모드
pnpm start
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## 첫 블루프린트 생성

### Claude Code에서 MCP Tool 사용

Claude Code를 열고 다음과 같이 요청하세요:

```
Use generate-blueprint tool to create a user profile dashboard with:
- Layout: sidebar-left
- Theme: calm-wellness
- Components: Card, Avatar, Button, Text
- Description: User profile with avatar, bio text, and settings button
```

### 응답 예시

```json
{
  "success": true,
  "blueprint": {
    "id": "1738123456789",
    "name": "User Profile Dashboard",
    "themeId": "calm-wellness",
    "layout": "sidebar-left",
    "components": [...]
  },
  "previewUrl": "http://localhost:3000/preview/1738123456789/calm-wellness"
}
```

### 미리보기 확인

브라우저에서 `previewUrl`을 열면 생성된 화면을 볼 수 있습니다.

## 테마 미리보기

다른 테마를 확인하려면:

```
Use preview-theme tool with themeId: premium-editorial
```

응답으로 받은 `previewUrl`에서 테마를 확인할 수 있습니다.

## 코드 내보내기

생성된 블루프린트를 프로덕션 코드로 내보내기:

```
Use export-screen tool with:
- blueprintId: 1738123456789
- format: tsx
- outputPath: src/screens/UserProfile.tsx
```

## 다음 단계

- [사용자 가이드](./02-user-guide.md) - 상세한 사용법과 예제
- [API 참조](./03-api-reference.md) - MCP Tools와 HTTP 엔드포인트 상세 문서
- [아키텍처 문서](./04-architecture.md) - 시스템 구조와 데이터 흐름
- [개발자 가이드](./05-developer-guide.md) - 기여 방법과 테스트 가이드
- [통합 가이드](./06-integration-guide.md) - SPEC-PLAYGROUND-001 연동

## 문제 해결

### 서버가 시작되지 않음

```bash
# 포트가 사용 중인지 확인
lsof -i :3000

# 다른 포트로 시작
PORT=3001 pnpm start
```

### MCP Tool을 찾을 수 없음

1. 서버가 실행 중인지 확인: `http://localhost:3000/tools`
2. Claude Code MCP 설정 확인
3. 서버 재시작: `pnpm start`

### 블루프린트 검증 실패

- `description`은 10-500자 사이여야 함
- `themeId`는 소문자, 숫자, 하이픈만 허용
- `layout`은 지원되는 6가지 중 하나여야 함

## 지원

- GitHub Issues: [tekton/issues](https://github.com/your-org/tekton/issues)
- SPEC 문서: [SPEC-MCP-002](../../.moai/specs/SPEC-MCP-002/spec.md)

---

**다음**: [사용자 가이드](./02-user-guide.md) - 상세한 기능 설명과 사용 예제
