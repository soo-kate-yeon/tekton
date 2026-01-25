# Tekton MCP Server 문서

Tekton MCP Server의 포괄적인 문서 모음입니다.

## 📚 문서 목록

### 시작하기

1. **[빠른 시작 가이드](./01-quickstart.md)**
   - 5분 안에 시작하기
   - 설치 및 실행
   - 첫 블루프린트 생성
   - 문제 해결

### 사용자 가이드

2. **[사용자 가이드](./02-user-guide.md)**
   - MCP Tools 상세 설명
   - 13개 테마 시스템
   - 6가지 레이아웃 패턴
   - 20개 컴포넌트 카탈로그
   - 실전 워크플로우 예제
   - 문제 해결 가이드

### API 참조

3. **[API 참조 문서](./03-api-reference.md)**
   - MCP Tools API (generate-blueprint, preview-theme, export-screen)
   - HTTP Endpoints API (/preview, /api/blueprints, /api/themes)
   - 입력/출력 스키마
   - 오류 코드 및 처리

### 아키텍처

4. **[아키텍처 문서](./04-architecture.md)**
   - 시스템 아키텍처 개요
   - 모듈 구조 및 의존성
   - 데이터 흐름 다이어그램
   - @tekton/core 통합
   - 저장소 구조
   - 보안 및 성능

### 개발자 가이드

5. **[개발자 가이드](./05-developer-guide.md)**
   - 개발 환경 설정
   - 코드 구조 상세
   - 테스트 가이드 (87.82% 커버리지)
   - 기여 방법
   - 코딩 규칙
   - 릴리스 프로세스

### 통합 가이드

6. **[통합 가이드](./06-integration-guide.md)**
   - SPEC-PLAYGROUND-001 통합
   - Claude Code 통합
   - @tekton/core 통합
   - 커스텀 통합 패턴
   - 배포 가이드 (Docker, Kubernetes)

---

## 🎯 문서 탐색 가이드

### 처음 사용하는 경우

1. [빠른 시작 가이드](./01-quickstart.md) → 설치 및 첫 실행
2. [사용자 가이드](./02-user-guide.md) → 기능 익히기
3. [API 참조](./03-api-reference.md) → 상세 사용법

### 개발자인 경우

1. [아키텍처 문서](./04-architecture.md) → 시스템 이해
2. [개발자 가이드](./05-developer-guide.md) → 개발 환경 설정
3. [통합 가이드](./06-integration-guide.md) → 통합 방법

### 운영자인 경우

1. [빠른 시작 가이드](./01-quickstart.md) → 설치
2. [통합 가이드](./06-integration-guide.md) → 배포
3. [API 참조](./03-api-reference.md) → 모니터링

---

## 📖 주요 개념

### MCP Protocol

Model Context Protocol - Claude Code와의 AI 통합을 위한 프로토콜

### Blueprint

화면 구조를 정의하는 JSON 객체 (컴포넌트 트리, 레이아웃, 테마)

### Theme

OKLCH 기반 색상 시스템으로 정의된 디자인 테마 (13개 내장)

### Timestamp-based History

타임스탬프 기반 불변 URL로 모든 디자인 반복 보존

---

## 🔗 추가 리소스

### 관련 문서

- [SPEC-MCP-002](../../.moai/specs/SPEC-MCP-002/spec.md) - 완전한 명세 문서
- [SPEC-PLAYGROUND-001](../../.moai/specs/SPEC-PLAYGROUND-001/spec.md) - Playground 명세
- [@tekton/core](../../core/README.md) - 코어 패키지 문서

### 외부 리소스

- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Claude Code Documentation](https://docs.anthropic.com/claude/docs)
- [OKLCH Color Space](https://oklch.com/)

---

## 📊 프로젝트 상태

- **버전**: 0.1.0 (MVP)
- **테스트 커버리지**: 87.82%
- **테스트 통과**: 73/73
- **상태**: 프로덕션 준비 완료

---

## 🤝 기여하기

문서 개선에 기여하려면:

1. GitHub Issues에서 문서 관련 이슈 확인
2. 브랜치 생성: `docs/improve-quickstart-guide`
3. 문서 수정 및 커밋
4. Pull Request 생성

**문서 작성 가이드라인**:

- 명확하고 간결한 설명
- 실용적인 예제 포함
- 한국어로 작성 (기술 용어는 영어 병기)
- Mermaid 다이어그램 활용

---

## 📝 문서 업데이트 내역

- **2026-01-25**: 초기 문서 생성 (6개 문서)
  - 빠른 시작 가이드
  - 사용자 가이드
  - API 참조
  - 아키텍처 문서
  - 개발자 가이드
  - 통합 가이드

---

## 📧 문의

- GitHub Issues: [tekton/issues](https://github.com/your-org/tekton/issues)
- 이메일: support@tekton.dev
- Discord: [Tekton Community](https://discord.gg/tekton)

---

**문서 버전**: 1.0.0
**마지막 업데이트**: 2026-01-25
**언어**: 한국어 (Korean)
