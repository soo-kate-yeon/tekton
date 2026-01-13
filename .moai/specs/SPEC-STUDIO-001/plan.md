# SPEC-STUDIO-001 구현 계획

## 개요

Brand DNA MCP 통합 및 Axis Interpreter 구현을 위한 체계적인 구현 계획입니다. 우선순위 기반 마일스톤과 기술 접근 방식을 정의합니다.

---

## 우선순위 기반 마일스톤

### Primary Goal: 핵심 MCP 통합 및 스키마 정의

**목표:**
Brand DNA 스키마 정의 및 MCP Server Resource 구현을 완료하여 기본적인 읽기/쓰기 기능을 제공합니다.

**구현 항목:**

1. **Brand DNA TypeScript 타입 및 Zod 스키마 정의**
   - 위치: `packages/contracts/src/brand-dna/schema.ts`
   - 내용: `BrandDNASchema`, `BrandAxisSchema` 정의 (REQ-001 구현)
   - 산출물: Zod 스키마, TypeScript 타입, 스키마 검증 함수

2. **MCP Server 프로젝트 초기화**
   - 위치: `packages/studio-mcp/`
   - 패키지 생성: `pnpm create` 사용
   - 의존성 설치:
     - `@anthropic-ai/sdk-typescript: ^1.0.0`
     - `zod: ^3.23.0`
     - `typescript: ^5.9.0`
   - TypeScript 설정: `tsconfig.json` strict mode 활성화

3. **MCP Resource 엔드포인트 구현**
   - 파일: `packages/studio-mcp/src/server.ts`
   - 기능:
     - Resource URI 파싱: `brand-dna://{projectId}/{brandId}`
     - `read()` 메서드: Brand DNA JSON 파일 로드 및 반환 (REQ-003)
     - `write()` 메서드: Brand DNA JSON 파일 저장 (REQ-002)
   - 에러 처리: 404 Not Found, 422 Validation Error

4. **파일 저장/로드 유틸리티**
   - 파일: `packages/studio-mcp/src/storage.ts`
   - 기능:
     - `loadBrandDNA(projectId, brandId)`: JSON 파일 읽기
     - `saveBrandDNA(projectId, brandId, data)`: JSON 파일 쓰기
     - 디렉토리 생성: `.tekton/brand-dna/` 자동 생성
     - 타임스탬프 관리: `updatedAt` 자동 갱신

**우선순위 근거:**
MCP 통합 없이는 Web Studio와 AI Agent가 Brand DNA에 접근할 수 없으므로 최우선 구현 필요.

**성공 지표:**
- Zod 스키마 검증 통과율 100%
- MCP Resource read/write 수동 테스트 성공
- JSON 파일 정상 생성 및 로드 확인

---

### Secondary Goal: Axis Interpreter 엔진 구현

**목표:**
5개 축 값을 구체적인 디자인 토큰으로 변환하는 Axis Interpreter를 구현합니다.

**구현 항목:**

1. **DesignToken 타입 정의**
   - 파일: `packages/contracts/src/brand-dna/design-tokens.ts`
   - 내용:
     ```typescript
     export interface DesignToken {
       spacing?: "generous" | "comfortable" | "compact";
       fontSize?: "large" | "medium" | "small";
       colorTemp?: "cool" | "neutral" | "warm";
       borderRadius?: "sharp" | "moderate" | "round";
       animation?: "subtle" | "standard" | "playful";
       typography?: "casual" | "balanced" | "elegant";
       decoration?: "minimal" | "moderate" | "refined";
       contrast?: "low" | "medium" | "high";
       saturation?: "muted" | "balanced" | "vibrant";
     }
     ```

2. **AxisInterpreter 클래스 구현**
   - 파일: `packages/studio-mcp/src/interpreter/axis-interpreter.ts`
   - 메서드:
     - `interpretAxis(axisName, value)`: 단일 축 값 → 디자인 토큰 변환
     - `interpretBrandDNA(brandDNA)`: 전체 Brand DNA → 통합 디자인 토큰
   - 변환 규칙 (REQ-004 기반):
     - Density: 0~0.3 (generous), 0.3~0.7 (comfortable), 0.7~1.0 (compact)
     - Warmth: 0~0.3 (cool), 0.3~0.7 (neutral), 0.7~1.0 (warm)
     - Playfulness, Sophistication, Energy 동일 패턴 적용

3. **변환 규칙 검증 테스트**
   - 파일: `packages/studio-mcp/tests/axis-interpreter.test.ts`
   - 테스트 케이스:
     - 각 축의 경계값 (0, 0.3, 0.5, 0.7, 1.0) 검증
     - 통합 Brand DNA 변환 결과 일관성 확인
     - Edge case: 모든 축 0.5 → 중립 디자인 토큰

**우선순위 근거:**
MCP 통합 후 실질적인 가치 제공을 위해서는 축 값 해석 기능이 필요하지만, MCP 기능 자체는 Axis Interpreter 없이도 동작 가능하므로 Secondary Goal로 분류.

**성공 지표:**
- 모든 축에 대해 경계값 검증 통과
- 통합 디자인 토큰 생성 성공률 100%
- 단위 테스트 커버리지 ≥90%

---

### Final Goal: 품질 보증 및 문서화

**목표:**
TRUST 5 품질 게이트 준수 및 개발자 가이드 문서 작성을 완료합니다.

**구현 항목:**

1. **통합 테스트 구현**
   - 파일: `packages/studio-mcp/tests/integration/mcp-e2e.test.ts`
   - 시나리오:
     - Brand DNA 생성 → MCP 저장 → MCP 조회 → 데이터 일치 검증
     - 동시 저장 요청 → Race condition 처리 확인
     - 캐시 만료 → 최신 데이터 반영 확인

2. **Linting 및 Formatting 설정**
   - 파일: `packages/studio-mcp/.eslintrc.json`, `packages/studio-mcp/.prettierrc`
   - ESLint 규칙: TypeScript strict, no-console, no-unused-vars
   - Prettier 설정: Semi-colon, single-quote, trailing-comma

3. **보안 감사**
   - 도구: `npm audit`, `pnpm audit`
   - 검사 항목:
     - 의존성 취약점 스캔
     - Zod 스키마 injection 공격 방어 확인
     - 파일 시스템 접근 권한 검증 (`.tekton/brand-dna/` 외부 접근 차단)

4. **개발자 가이드 작성**
   - 파일: `packages/studio-mcp/README.md`
   - 내용:
     - MCP Server 설치 및 실행 방법
     - Brand DNA 스키마 설명
     - Axis Interpreter 사용 예제
     - API 레퍼런스 (Resource URI, 에러 코드)

**우선순위 근거:**
기능 구현 완료 후 품질 검증 및 문서화를 통해 프로덕션 배포 준비.

**성공 지표:**
- 테스트 커버리지 ≥85%
- ESLint 경고 0건
- 보안 취약점 0건 (Critical/High severity)
- README 문서 완성도 ≥90%

---

### Optional Goal: 프리셋 라이브러리 구현

**목표:**
사전 정의된 Brand DNA 프리셋을 제공하여 사용자 경험 향상 (REQ-006 Optional 구현).

**구현 항목:**

1. **프리셋 JSON 파일 생성**
   - 위치: `packages/studio-mcp/presets/`
   - 프리셋 예시:
     - `modern-tech.json`: Density 0.6, Warmth 0.3, Playfulness 0.5, Sophistication 0.7, Energy 0.8
     - `luxury-fashion.json`: Density 0.3, Warmth 0.4, Playfulness 0.2, Sophistication 0.9, Energy 0.4
     - `friendly-casual.json`: Density 0.5, Warmth 0.7, Playfulness 0.8, Sophistication 0.3, Energy 0.6

2. **프리셋 로드 API**
   - 파일: `packages/studio-mcp/src/presets.ts`
   - 함수: `listPresets()` → 프리셋 목록 반환
   - MCP Resource: `brand-dna-preset://list`

**우선순위 근거:**
MVP 기능 완료 후 사용자 편의성 향상을 위한 추가 기능.

**성공 지표:**
- 최소 3개 프리셋 제공
- Web Studio에서 프리셋 선택 가능
- 프리셋 기반 Brand DNA 생성 성공률 100%

---

## 기술 스택 명세

### Core Dependencies

| 패키지 | 버전 | 용도 |
|--------|------|------|
| @anthropic-ai/sdk-typescript | ^1.0.0 | MCP Server 구현 |
| zod | ^3.23.0 | 스키마 검증 |
| typescript | ^5.9.0 | 타입 시스템 |
| node | >=20.0.0 | 런타임 환경 |

### Dev Dependencies

| 패키지 | 버전 | 용도 |
|--------|------|------|
| vitest | ^2.0.0 | 단위 테스트 |
| @typescript-eslint/parser | ^8.0.0 | Linting |
| prettier | ^3.0.0 | 코드 포맷팅 |
| @types/node | ^20.0.0 | Node.js 타입 정의 |

### 설치 명령

```bash
# 모노레포 루트에서 실행
pnpm install

# studio-mcp 패키지 의존성 추가
cd packages/studio-mcp
pnpm add @anthropic-ai/sdk-typescript zod typescript
pnpm add -D vitest @typescript-eslint/parser prettier @types/node
```

---

## 의존성 분석

### Blocking Dependencies

**Phase C (SPEC-PHASEC-003) 완료 필수:**
- **이유**: Brand DNA는 Screen Contract 구조를 참조하여 AI Agent가 Screen 생성 시 일관된 타입 시스템 사용
- **확인 방법**: `packages/contracts/src/definitions/screen/` 디렉토리 존재 및 `ScreenContract` 타입 정의 확인
- **완료 상태**: ✅ Phase C 완료 (2026-01-13 기준)

### Non-Blocking Dependencies

**M2 (프리셋 라이브러리):**
- **이유**: Optional 기능으로 MCP 통합과 독립적
- **구현 시점**: Optional Goal 단계에서 추가

**M4 (Live Preview):**
- **이유**: Web Studio UI 기능으로 MCP Server와 별도 구현 가능
- **구현 시점**: SPEC-STUDIO-002로 분리 예정

---

## 위험 요소 및 완화 전략

### RISK-001: MCP SDK API 변경

**위험 수준:** Medium
**발생 확률:** Low (Anthropic 공식 SDK)
**영향도:** High (전체 MCP 통합 영향)

**완화 전략:**

1. **SDK 버전 고정**
   - `package.json`에 `@anthropic-ai/sdk-typescript: ^1.0.0` 명시
   - Major 버전 업데이트 시 별도 마이그레이션 SPEC 작성

2. **Wrapper 추상화 레이어 구축**
   - 파일: `packages/studio-mcp/src/mcp-wrapper/`
   - 목적: MCP SDK 직접 사용 대신 Wrapper 함수 사용하여 의존성 격리
   - 예시:
     ```typescript
     // packages/studio-mcp/src/mcp-wrapper/resource.ts
     export async function createResource(config: ResourceConfig) {
       // MCP SDK 호출을 감싸서 추상화
       return server.resource(config);
     }
     ```

3. **주요 버전 업데이트 시 회귀 테스트**
   - CI/CD 파이프라인에 버전 업데이트 브랜치 생성
   - 통합 테스트 실행 후 변경 사항 검토

**모니터링:**
- Anthropic SDK GitHub releases 구독
- 분기별 의존성 버전 검토 회의

---

### RISK-002: Axis Interpreter 주관성

**위험 수준:** Medium
**발생 확률:** Medium (디자인 해석 다양성)
**영향도:** Medium (사용자 만족도 영향)

**완화 전략:**

1. **디자이너 협업**
   - 변환 규칙 초안 작성 후 디자이너 검토 요청
   - A/B 테스트: 동일 Brand DNA에 대해 2가지 변환 규칙 비교

2. **Beta 테스트**
   - 초기 사용자 5명에게 Beta 버전 배포
   - 피드백 수집: "이 디자인 토큰이 브랜드 개성을 잘 표현하나요?" (5점 척도)
   - 평균 점수 3.5 미만 시 변환 규칙 재조정

3. **Tier 2 Axes 확장 구조**
   - 현재 5개 축으로 부족한 경우 추가 축 정의 가능하도록 설계
   - `BrandAxisSchema` 확장 가능 구조:
     ```typescript
     export const BrandAxisSchema = z.object({
       // Tier 1 (필수)
       density: z.number().min(0).max(1),
       warmth: z.number().min(0).max(1),
       playfulness: z.number().min(0).max(1),
       sophistication: z.number().min(0).max(1),
       energy: z.number().min(0).max(1),
       // Tier 2 (선택적, 추후 추가 가능)
     }).catchall(z.number().min(0).max(1)); // 동적 축 추가 허용
     ```

**모니터링:**
- Beta 테스트 피드백 주간 검토
- 사용자 만족도 지표 추적 (NPS 점수)

---

### RISK-003: Web Studio 레포지토리 미생성

**위험 수준:** Low
**발생 확률:** Low (기술적 제약 없음)
**영향도:** High (테스트 및 배포 차단)

**완화 전략:**

1. **로컬 개발 환경 우선 구축**
   - MCP Server 로컬 실행: `pnpm --filter studio-mcp dev`
   - Postman/curl로 MCP API 수동 테스트:
     ```bash
     # Brand DNA 저장
     curl -X POST http://localhost:3000/mcp/brand-dna/project-1/brand-1 \
       -H "Content-Type: application/json" \
       -d '{"id":"brand-1","name":"Test Brand","axes":{...}}'

     # Brand DNA 조회
     curl http://localhost:3000/mcp/brand-dna/project-1/brand-1
     ```

2. **GitHub Actions CI/CD 파이프라인 구축**
   - 파일: `packages/studio-mcp/.github/workflows/ci.yml`
   - 작업:
     - Lint 검사
     - 단위 테스트 실행
     - 빌드 검증
     - 배포 (Vercel/Cloudflare Pages)

3. **Mock Web Studio 클라이언트**
   - 파일: `packages/studio-mcp/tests/mock-client.ts`
   - 목적: Web Studio 없이도 MCP API 테스트 가능
   - 기능:
     - Brand DNA 생성 요청 시뮬레이션
     - MCP Resource read/write 호출

**모니터링:**
- Web Studio 레포지토리 생성 일정 확인
- MCP Server 로컬 테스트 완료 여부 추적

---

## 리소스 요구사항

### 개발 인력

**필수 역할:**
- **Backend Developer (1명)**
  - 역할: MCP Server, Axis Interpreter 구현
  - 기술 스택: TypeScript, Node.js, Zod, MCP SDK
  - 예상 공수: 3-5 개 세션 (Primary + Secondary Goal 기준)

**선택 역할:**
- **UI/UX Designer (0.5명, Optional Goal)**
  - 역할: Axis Interpreter 변환 규칙 검토, 프리셋 디자인
  - 예상 공수: 1-2 개 세션

### 개발 환경

**필수 도구:**
- Node.js 20+ 설치
- pnpm 9+ 패키지 매니저
- TypeScript 5.9+ 개발 환경
- Git 버전 관리

**선택 도구:**
- Postman (MCP API 수동 테스트)
- VS Code (TypeScript 개발)
- Docker (배포 환경 시뮬레이션)

### 예상 공수

**Primary Goal (핵심 MCP 통합):**
- 스키마 정의: 1 세션
- MCP Server 구현: 2 세션
- 파일 저장/로드: 1 세션
- 총 예상: 4 세션

**Secondary Goal (Axis Interpreter):**
- DesignToken 타입 정의: 0.5 세션
- AxisInterpreter 구현: 1.5 세션
- 변환 규칙 테스트: 1 세션
- 총 예상: 3 세션

**Final Goal (품질 보증):**
- 통합 테스트: 1.5 세션
- Linting/보안 감사: 0.5 세션
- 문서화: 1 세션
- 총 예상: 3 세션

**Optional Goal (프리셋):**
- 프리셋 생성: 1 세션
- 프리셋 API: 0.5 세션
- 총 예상: 1.5 세션

**전체 예상 공수:**
- 최소 (Primary + Final Goal): 7 세션
- 권장 (Primary + Secondary + Final Goal): 10 세션
- 최대 (모든 Goal 포함): 11.5 세션

---

## 다음 단계

### 즉시 시작 가능한 작업

1. **SPEC-STUDIO-001 승인 대기**
   - 이 SPEC 문서 검토 및 승인 요청
   - 승인 후 `/moai:2-run SPEC-STUDIO-001` 실행

2. **개발 환경 준비**
   - Node.js 20+ 설치 확인
   - pnpm workspace 설정 확인
   - `packages/studio-mcp/` 디렉토리 생성

3. **Phase C 완료 상태 확인**
   - `packages/contracts/src/definitions/screen/` 구조 검토
   - Screen Contract 타입 정의 확인

### 구현 후 작업

1. **SPEC-STUDIO-002 작성 (Web Studio UI)**
   - Brand DNA 편집 UI
   - Live Preview 기능
   - 프리셋 선택 인터페이스

2. **SPEC-PHASEE-005 업데이트**
   - Phase D 완료 상태 반영
   - Phase E 다음 단계 계획

3. **Git 워크플로우**
   - Branch: `feature/SPEC-STUDIO-001`
   - Commit 메시지: `feat(studio-mcp): [SPEC-STUDIO-001] ...`
   - PR 생성 및 코드 리뷰

---

**문서 종료**
