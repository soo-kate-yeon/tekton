---
id: SPEC-MCP-002-CLAUDE-CODE-INTEGRATION
title: "Claude Code Integration Guide"
date: "2026-01-25"
version: "2.0.0"
---

# Tekton MCP Server - Claude Code Integration Guide

## 개요

이 문서는 Tekton MCP Server를 Claude Code 데스크탑 앱과 통합하는 방법을 설명합니다.

**SPEC-MCP-002 v2.0.0 기준**:
- ✅ stdio transport 사용
- ✅ 데이터 전용 출력 (previewUrl, filePath 제거)
- ✅ JSON-RPC 2.0 준수
- ✅ 3개 MCP 도구 제공

---

## 설정 방법

### 1. Claude Code 설정 파일 위치

Claude Code는 다음 위치의 설정 파일을 사용합니다:

**macOS/Linux**:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows**:
```
%APPDATA%\Claude\claude_desktop_config.json
```

### 2. MCP 서버 등록

`claude_desktop_config.json` 파일에 다음 내용을 추가하세요:

```json
{
  "mcpServers": {
    "tekton": {
      "command": "node",
      "args": ["/absolute/path/to/tekton/packages/mcp-server/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

**주의사항**:
- `args` 배열의 경로는 **절대 경로**로 지정해야 합니다
- 경로의 `~`는 확장되지 않으므로 전체 경로 사용 (`/Users/username/...`)
- `dist/index.js` 파일이 빌드되어 있어야 합니다

### 3. 빌드 확인

MCP 서버를 등록하기 전에 빌드를 완료하세요:

```bash
cd /path/to/tekton/packages/mcp-server
pnpm build
```

빌드 결과 확인:
```bash
ls -la dist/index.js
# -rw-r--r--  1 user  staff  xxxxx  Jan 25 14:00 dist/index.js
```

### 4. Claude Code 재시작

설정 파일을 변경한 후 Claude Code를 완전히 재시작하세요:

1. Claude Code 종료
2. Claude Code 재실행
3. MCP 패널에서 "tekton" 서버 확인

---

## 도구 확인

### MCP 패널에서 확인

Claude Code를 시작한 후:

1. **MCP 패널 열기**: 좌측 사이드바에서 MCP 아이콘 클릭
2. **서버 확인**: "tekton" 서버가 연결됨 (초록색) 상태인지 확인
3. **도구 목록 확인**: 다음 3개 도구가 표시되어야 함:
   - `generate-blueprint` - Generate a UI blueprint from natural language description
   - `preview-theme` - Preview a Tekton theme and retrieve its design tokens
   - `export-screen` - Export a blueprint to production-ready code (TSX/JSX/Vue)

### 연결 문제 해결

**서버가 빨간색(오프라인) 상태인 경우**:

1. **경로 확인**:
   ```bash
   # 설정 파일의 경로가 올바른지 확인
   cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | grep tekton -A 5
   ```

2. **빌드 확인**:
   ```bash
   # dist/index.js 파일 존재 확인
   ls -la /absolute/path/to/tekton/packages/mcp-server/dist/index.js
   ```

3. **수동 실행 테스트**:
   ```bash
   # 서버가 수동으로 실행되는지 확인
   cd /path/to/tekton/packages/mcp-server
   node dist/index.js
   # 아무것도 출력하지 않으면 정상 (stdin 대기 중)
   # Ctrl+C로 종료
   ```

4. **Claude Code 로그 확인**:
   - macOS: `~/Library/Logs/Claude/`
   - Windows: `%APPDATA%\Claude\Logs\`

---

## 사용 예시

### 예시 1: Blueprint 생성

**자연어 프롬프트**:
```
Create a user dashboard with profile card using calm-wellness theme
```

**Claude Code 동작**:
1. `generate-blueprint` 도구 호출
2. Blueprint JSON 반환
3. 사용자에게 결과 표시

**응답 예시**:
```json
{
  "id": "bp-1738123456789-abc123",
  "name": "User Dashboard",
  "themeId": "calm-wellness",
  "layout": "single-column",
  "components": [
    {
      "type": "Card",
      "slot": "main",
      "children": [...]
    }
  ],
  "timestamp": 1738123456789
}
```

### 예시 2: 테마 미리보기

**자연어 프롬프트**:
```
Show me the premium-editorial theme
```

**Claude Code 동작**:
1. `preview-theme` 도구 호출
2. 테마 메타데이터 및 CSS 변수 반환
3. 사용자에게 결과 표시

**응답 예시**:
```json
{
  "id": "premium-editorial",
  "name": "Premium Editorial",
  "description": "Elegant and airy magazine-style UI focused on reading and typography.",
  "cssVariables": {
    "--color-primary": "oklch(0.2 0 0)",
    "--color-secondary": "oklch(0.98 0 0)",
    "--font-family": "Georgia",
    "--border-radius": "0"
  }
}
```

### 예시 3: 코드 내보내기

**자연어 프롬프트**:
```
Export that dashboard as TypeScript React
```

**Claude Code 동작**:
1. 이전 대화에서 Blueprint 추출
2. `export-screen` 도구 호출 (blueprint 객체 전달)
3. TSX 코드 반환
4. 사용자에게 코드 표시

**응답 예시**:
```tsx
import React from 'react';

export default function UserDashboard(): React.ReactElement {
  return (
    <div className="container mx-auto p-4">
      <div className="card bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        {/* ... */}
      </div>
    </div>
  );
}
```

### 예시 4: 다단계 워크플로우

**자연어 프롬프트**:
```
Show me calm-wellness theme, then create a login page with it, and export as TSX
```

**Claude Code 동작**:
1. `preview-theme` 호출 (calm-wellness)
2. `generate-blueprint` 호출 (login page, calm-wellness theme)
3. `export-screen` 호출 (TSX format)
4. 각 단계 결과를 순차적으로 표시

---

## 통합 테스트 체크리스트

### 기본 기능 테스트

- [ ] MCP 패널에 "tekton" 서버가 표시됨
- [ ] 서버 상태가 "Connected" (초록색)
- [ ] 3개 도구가 모두 표시됨
- [ ] 각 도구의 설명이 명확함

### 도구 호출 테스트

- [ ] "Create a dashboard with calm-wellness theme" → Blueprint 생성 성공
- [ ] "Show me premium-editorial theme" → Theme 데이터 반환 성공
- [ ] "Export as TSX" → TypeScript React 코드 생성 성공
- [ ] 생성된 코드가 구문적으로 올바름 (import, export 포함)

### 에러 처리 테스트

- [ ] "Create dashboard with invalid-theme" → 명확한 에러 메시지
- [ ] 에러 메시지에 사용 가능한 테마 목록 포함
- [ ] 에러 후 다음 요청이 정상 작동 (복구 가능)

### 다단계 워크플로우 테스트

- [ ] Theme 조회 → Blueprint 생성 → 코드 내보내기 (3단계 연속)
- [ ] 각 단계의 출력이 다음 단계의 입력으로 사용됨
- [ ] 전체 워크플로우가 10초 이내 완료

### 데이터 전용 출력 확인 (SPEC-MCP-002 v2.0.0)

- [ ] `generate-blueprint` 출력에 `previewUrl` 필드 **없음**
- [ ] `preview-theme` 출력에 `previewUrl` 필드 **없음**
- [ ] `export-screen` 출력에 `filePath` 필드 **없음**
- [ ] `export-screen`이 파일 시스템에 쓰지 **않음**

---

## 고급 사용법

### 1. 다양한 출력 형식

**TypeScript React (TSX)**:
```
Export the dashboard as TypeScript React component
```

**JavaScript React (JSX)**:
```
Export the dashboard as JavaScript React component
```

**Vue 3 Composition API**:
```
Export the dashboard as Vue 3 component
```

### 2. 레이아웃 변형

**Single Column**:
```
Create a landing page with single-column layout using modern-saas theme
```

**Sidebar Left**:
```
Create an admin panel with sidebar-left layout using tech-startup theme
```

**Header-Footer**:
```
Create a blog layout with header-footer using premium-editorial theme
```

### 3. 컴포넌트 힌트 활용

```
Create a user profile page with Card, Avatar, Button, and Form components using calm-wellness theme
```

Claude Code가 컴포넌트 힌트를 사용하여 더 정확한 Blueprint를 생성합니다.

---

## 문제 해결

### 문제 1: "Server not found" 에러

**원인**: 설정 파일 경로가 잘못되었거나 JSON 형식 오류

**해결**:
```bash
# JSON 형식 검증
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | jq .

# 경로 확인
ls -la /absolute/path/to/tekton/packages/mcp-server/dist/index.js
```

### 문제 2: "Server offline" 상태

**원인**: Node.js 경로가 잘못되었거나 빌드 파일이 없음

**해결**:
```bash
# Node.js 경로 확인
which node
# /usr/local/bin/node 또는 /opt/homebrew/bin/node

# 빌드 재실행
cd /path/to/tekton/packages/mcp-server
pnpm build
```

### 문제 3: 도구가 호출되지 않음

**원인**: 프롬프트가 도구 호출 조건을 충족하지 않음

**해결**:
- 더 명확한 프롬프트 사용 ("Create a...", "Show me...", "Export...")
- 테마 이름을 명시 ("using calm-wellness theme")
- 출력 형식 지정 ("as TSX", "as Vue")

### 문제 4: 에러 메시지 표시

**원인**: 잘못된 테마 ID 또는 입력 데이터

**해결**:
- 에러 메시지에 포함된 사용 가능한 테마 목록 확인
- 올바른 테마 이름으로 재시도
- 최소 입력 요구사항 확인 (description >= 10 characters)

---

## 시스템 요구사항

### 필수 요구사항

- **Claude Code**: v0.45.0 이상 (MCP 지원 버전)
- **Node.js**: v20.0.0 이상
- **운영 체제**: macOS, Linux, Windows

### 권장 요구사항

- **메모리**: 최소 8GB RAM
- **디스크 공간**: 100MB 여유 공간
- **네트워크**: 인터넷 연결 (Claude API 통신용)

---

## 다음 단계

### SPEC-PLAYGROUND-001 통합 (계획 중)

현재 Tekton MCP Server는 **데이터 전용 출력**을 제공합니다. 시각적 프리뷰를 보려면:

1. **React Playground 사용** (SPEC-PLAYGROUND-001):
   - Tekton MCP Server에서 Blueprint 생성
   - React Playground로 Blueprint 전달
   - 실시간 렌더링 확인

2. **코드 내보내기 후 직접 실행**:
   - `export-screen`으로 TSX/JSX/Vue 코드 생성
   - 로컬 프로젝트에 복사
   - `npm run dev`로 실행 및 확인

---

## 참고 자료

### MCP 프로토콜

- [MCP Specification](https://modelcontextprotocol.io/docs/specification)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)
- [JSON-RPC 2.0 Spec](https://www.jsonrpc.org/specification)

### Tekton 문서

- `SPEC-MCP-002/spec.md` - 요구사항 정의
- `SPEC-MCP-002/acceptance.md` - 인수 조건
- `SPEC-MCP-002/HANDOVER.md` - 구현 상세
- `SPEC-MCP-002/PHASE-5-RESULTS.md` - 검증 결과

### 관련 SPEC

- **SPEC-PLAYGROUND-001**: React Playground (시각적 프리뷰)
- **SPEC-THEME-001**: Tekton Theme System
- **SPEC-BLUEPRINT-001**: Blueprint Data Model

---

**작성 일시**: 2026-01-25
**작성자**: manager-quality (MoAI-ADK)
**버전**: 2.0.0 (stdio-based MCP standard)
