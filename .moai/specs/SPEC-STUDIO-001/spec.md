---
id: SPEC-STUDIO-001
version: "1.0.0"
status: "completed"
created: "2026-01-13"
updated: "2026-01-13"
completed: "2026-01-13"
author: "asleep"
priority: "HIGH"
---

## HISTORY

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-01-13 | 1.0.0 | asleep | SPEC-STUDIO-001 초기 생성 - Brand DNA MCP Integration |

# SPEC-STUDIO-001: Brand DNA MCP 통합 및 Axis Interpreter

## 개요

Tekton Studio의 Brand DNA를 MCP(Model Context Protocol) 서버로 통합하여 AI Agent가 브랜드 디자인 시스템을 이해하고 활용할 수 있도록 하는 시스템입니다. 5개의 핵심 축(Tier 1 Axes)을 기반으로 브랜드 개성을 정량화하고, 이를 구체적인 디자인 토큰으로 변환하는 Axis Interpreter를 구현합니다.

## ENVIRONMENT (환경 조건)

### 기술 환경

**Tekton 모노레포 구조:**
- TypeScript 5.9+
- Node.js 20+
- pnpm workspace 기반 모노레포
- 패키지 구조: `packages/studio-mcp/`, `packages/contracts/`

**선행 조건:**
- **ENV-001**: Phase C (Screen Contract) 완료
  - `packages/contracts/src/definitions/screen/` 구조 확립
  - Contract validation 시스템 구축 완료
  - Type-safe contract 패턴 검증 완료

**MCP 생태계:**
- @anthropic-ai/sdk-typescript 사용
- MCP Server Resource 기반 CRUD 패턴 지원
- JSON 기반 데이터 저장 및 검색

**도구 체인:**
- Zod 3.23+ 스키마 검증
- TypeScript strict mode 활성화
- Vitest 테스트 프레임워크

### 배포 환경

**Web Studio:**
- 독립 앱으로 배포 예정
- MCP Server와 통신하여 Brand DNA 읽기/쓰기
- 실시간 프리뷰 기능 제공

**AI Agent Context:**
- MCP Resource로 Brand DNA 노출
- Agent는 screen 생성 시 Brand DNA 참조
- Axis Interpreter를 통한 자동 디자인 토큰 적용

---

## ASSUMPTIONS (전제 조건)

### A-001: MCP SDK 리소스 기반 CRUD 패턴 지원 (신뢰도: High)

**전제:**
@anthropic-ai/sdk-typescript의 MCP Server가 리소스 기반 CRUD 패턴을 안정적으로 지원한다.

**근거:**
- Anthropic 공식 SDK 문서에 Resource 패턴 명시
- Context7에서 MCP Server 예제 확인 가능
- 커뮤니티 레퍼런스 구현 다수 존재

**위험 시나리오:**
MCP SDK API가 변경되어 Resource 패턴이 deprecated되거나 breaking change 발생

**완화 전략:**
- MCP SDK 버전 고정 (^1.0.0)
- SDK wrapper 추상화 레이어 구축하여 의존성 격리
- 주요 버전 업데이트 시 마이그레이션 가이드 검토

### A-002: Tier 1 Axes 5개로 80% 디자인 표현 가능 (신뢰도: Medium)

**전제:**
Density, Warmth, Playfulness, Sophistication, Energy 5개 축으로 대부분의 브랜드 개성을 표현할 수 있다.

**근거:**
- UI/UX 디자인 시스템 연구에서 5-7개 핵심 축 사용
- Material Design, Fluent Design 등 주요 디자인 시스템 분석 결과
- 심리학 Big Five Personality Traits 유사 구조

**위험 시나리오:**
특정 브랜드(예: 럭셔리 패션, 금융 보안)에서 5개 축으로 표현 불가능한 개성 요구

**완화 전략:**
- Tier 2 Axes 확장 가능 구조 설계
- 축 추가 시 기존 시스템 영향 최소화 원칙
- Beta 테스트를 통한 축 유효성 검증

### A-003: Web Studio 독립 앱 배포 (신뢰도: High)

**전제:**
Tekton Studio의 Brand DNA 편집기는 별도 웹 앱으로 배포된다.

**근거:**
- Phase E SPEC-PHASEE-005에서 Web Studio 명시
- Vercel 또는 Cloudflare Pages 배포 가능
- 모노레포 구조에서 독립 빌드 가능

**위험 시나리오:**
Web Studio 배포 인프라 미구축으로 MCP Integration 테스트 불가

**완화 전략:**
- 로컬 개발 환경에서 Web Studio + MCP Server 통합 테스트
- GitHub Actions CI/CD 파이프라인 구축
- 배포 실패 시 로컬 개발 모드로 대체 운영

---

## REQUIREMENTS (요구사항)

### REQ-001: Brand DNA JSON 스키마 검증 (Ubiquitous)

**EARS 형식:**
시스템은 **항상** Brand DNA JSON 데이터를 Zod 스키마로 검증해야 한다.

**상세 명세:**
- 모든 Brand DNA 읽기/쓰기 작업 전후 검증 수행
- 축 값은 0.0 ~ 1.0 범위 내 숫자여야 함
- 필수 필드: `id`, `name`, `axes`, `version`, `createdAt`, `updatedAt`
- 검증 실패 시 명확한 에러 메시지 제공 (필드명, 기대값, 실제값)

**테스트 시나리오:**
- 유효한 Brand DNA JSON → 검증 통과
- 축 값 범위 초과 (1.5) → 검증 실패, 에러 메시지 반환
- 필수 필드 누락 (`name` 없음) → 검증 실패

### REQ-002: MCP Brand DNA Save 기능 (Event-Driven)

**EARS 형식:**
**WHEN** Web Studio에서 Brand DNA 저장 요청이 발생하면, **THEN** MCP Server는 JSON 파일로 저장해야 한다.

**상세 명세:**
- Resource URI: `brand-dna://{projectId}/{brandId}`
- 저장 위치: `.tekton/brand-dna/{brandId}.json`
- 저장 시 `updatedAt` 타임스탬프 자동 갱신
- 동일 `brandId` 존재 시 덮어쓰기 (버전 관리 추후 고려)

**테스트 시나리오:**
- 새로운 Brand DNA 저장 → 파일 생성 확인
- 기존 Brand DNA 수정 → `updatedAt` 갱신 확인
- 동시 저장 요청 → Race condition 처리 검증

### REQ-003: MCP Brand DNA Read 기능 (Event-Driven)

**EARS 형식:**
**WHEN** AI Agent가 Brand DNA 조회 요청을 하면, **THEN** MCP Server는 해당 Brand DNA JSON을 반환해야 한다.

**상세 명세:**
- Resource URI: `brand-dna://{projectId}/{brandId}`
- 존재하지 않는 `brandId` 요청 시 404 에러 반환
- 캐싱 전략: 메모리 캐시 (TTL 5분)
- 응답 형식: JSON (Zod 스키마 검증된 데이터)

**테스트 시나리오:**
- 존재하는 Brand DNA 조회 → 데이터 반환
- 존재하지 않는 Brand DNA 조회 → 404 에러
- 캐시 만료 후 재조회 → 최신 데이터 반환

### REQ-004: Axis Interpreter 변환 규칙 (State-Driven)

**EARS 형식:**
**IF** 축 값이 특정 범위에 있으면, **THEN** 해당 디자인 토큰을 적용해야 한다.

**상세 명세:**

**Density (밀도) 축:**
- 0.0 ~ 0.3: `spacing: generous, fontSize: large`
- 0.3 ~ 0.7: `spacing: comfortable, fontSize: medium`
- 0.7 ~ 1.0: `spacing: compact, fontSize: small`

**Warmth (온기) 축:**
- 0.0 ~ 0.3: `colorTemp: cool (blue-toned)`
- 0.3 ~ 0.7: `colorTemp: neutral`
- 0.7 ~ 1.0: `colorTemp: warm (orange-toned)`

**Playfulness (유쾌함) 축:**
- 0.0 ~ 0.3: `borderRadius: sharp (0-4px), animation: subtle`
- 0.3 ~ 0.7: `borderRadius: moderate (4-8px), animation: standard`
- 0.7 ~ 1.0: `borderRadius: round (8-16px), animation: playful`

**Sophistication (세련됨) 축:**
- 0.0 ~ 0.3: `typography: casual, decoration: minimal`
- 0.3 ~ 0.7: `typography: balanced, decoration: moderate`
- 0.7 ~ 1.0: `typography: elegant, decoration: refined`

**Energy (에너지) 축:**
- 0.0 ~ 0.3: `contrast: low, saturation: muted`
- 0.3 ~ 0.7: `contrast: medium, saturation: balanced`
- 0.7 ~ 1.0: `contrast: high, saturation: vibrant`

**테스트 시나리오:**
- Density = 0.5 → `spacing: comfortable, fontSize: medium`
- Warmth = 0.9 → `colorTemp: warm`
- 모든 축 0.5 → 중립적인 디자인 토큰 조합

### REQ-005: 무효한 축 값 거부 (Unwanted)

**EARS 형식:**
시스템은 범위를 벗어난 축 값(0.0 미만, 1.0 초과)을 **허용하지 않아야 한다**.

**상세 명세:**
- Zod 스키마에서 `min(0).max(1)` 검증
- 범위 초과 시 `422 Unprocessable Entity` 에러 반환
- 에러 메시지 예시: `Axis "density" value 1.5 exceeds maximum 1.0`

**테스트 시나리오:**
- Density = -0.1 → 검증 실패
- Warmth = 1.2 → 검증 실패
- 모든 축 0.0 ~ 1.0 → 검증 통과

### REQ-006: 프리셋 라이브러리 (Optional)

**EARS 형식:**
**가능하면**, 시스템은 사전 정의된 Brand DNA 프리셋(예: Modern Tech, Luxury Fashion, Friendly Casual)을 제공해야 한다.

**상세 명세:**
- 최소 3개 프리셋 제공 (MVP 범위)
- 프리셋 구조: `{ name, description, axes, thumbnail? }`
- Web Studio에서 프리셋 선택 → Brand DNA 생성
- 프리셋은 `packages/studio-mcp/presets/` 디렉토리에 JSON으로 저장

**테스트 시나리오:**
- Web Studio에서 "Modern Tech" 프리셋 선택 → Brand DNA 생성 확인
- 프리셋 목록 API 호출 → 3개 이상 프리셋 반환

---

## SPECIFICATIONS (상세 사양)

### Brand DNA 스키마 (TypeScript + Zod)

```typescript
import { z } from "zod";

export const BrandAxisSchema = z.object({
  density: z.number().min(0).max(1).describe("밀도: 0=여유로움, 1=밀집"),
  warmth: z.number().min(0).max(1).describe("온기: 0=차가움, 1=따뜻함"),
  playfulness: z.number().min(0).max(1).describe("유쾌함: 0=진지함, 1=유쾌함"),
  sophistication: z.number().min(0).max(1).describe("세련됨: 0=캐주얼, 1=우아함"),
  energy: z.number().min(0).max(1).describe("에너지: 0=차분함, 1=활기참"),
});

export const BrandDNASchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  axes: BrandAxisSchema,
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type BrandDNA = z.infer<typeof BrandDNASchema>;
export type BrandAxis = z.infer<typeof BrandAxisSchema>;
```

### Axis Interpreter 변환 테이블

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

export class AxisInterpreter {
  static interpretAxis(axisName: keyof BrandAxis, value: number): Partial<DesignToken> {
    // 구현 예시 (REQ-004 기반)
    if (axisName === "density") {
      if (value < 0.3) return { spacing: "generous", fontSize: "large" };
      if (value < 0.7) return { spacing: "comfortable", fontSize: "medium" };
      return { spacing: "compact", fontSize: "small" };
    }
    // ... 다른 축 구현
  }

  static interpretBrandDNA(brandDNA: BrandDNA): DesignToken {
    const tokens: DesignToken = {};
    for (const [axisName, value] of Object.entries(brandDNA.axes)) {
      Object.assign(tokens, this.interpretAxis(axisName as keyof BrandAxis, value));
    }
    return tokens;
  }
}
```

### MCP Server Resource Endpoints

```typescript
// packages/studio-mcp/src/server.ts
import { Server } from "@anthropic-ai/sdk-typescript/mcp";

const server = new Server({
  name: "tekton-studio",
  version: "1.0.0",
});

server.resource({
  uri: "brand-dna://{projectId}/{brandId}",
  name: "Brand DNA",
  description: "브랜드 디자인 시스템의 핵심 개성 정의",
  mimeType: "application/json",

  async read({ uri }) {
    const { projectId, brandId } = parseUri(uri);
    const brandDNA = await loadBrandDNA(projectId, brandId);
    if (!brandDNA) throw new NotFoundError(`Brand DNA ${brandId} not found`);
    return JSON.stringify(BrandDNASchema.parse(brandDNA));
  },

  async write({ uri, content }) {
    const { projectId, brandId } = parseUri(uri);
    const brandDNA = BrandDNASchema.parse(JSON.parse(content));
    await saveBrandDNA(projectId, brandId, brandDNA);
    return { success: true };
  },
});
```

---

## TRACEABILITY (추적성)

### 상위 SPEC 연계

- **SPEC-PHASEE-005**: Phase E 전체 계획 (Phase D는 M3+M4 선택 구현)
- **SPEC-PHASEC-003**: Screen Contract 구조 (Brand DNA가 Screen 생성 시 참조)

### 하위 구현 태스크

- **TASK-001**: Zod 스키마 및 TypeScript 타입 정의 (`packages/contracts/src/brand-dna/`)
- **TASK-002**: Axis Interpreter 엔진 구현 (`packages/studio-mcp/src/interpreter/`)
- **TASK-003**: MCP Server Resource 구현 (`packages/studio-mcp/src/server.ts`)
- **TASK-004**: Brand DNA 파일 저장/로드 로직 (`.tekton/brand-dna/`)
- **TASK-005**: 단위 테스트 및 통합 테스트 (`packages/studio-mcp/tests/`)

### 의존성

**Blocking Dependencies:**
- Phase C (SPEC-PHASEC-003) 완료 필수: Contract 구조 재사용

**Non-Blocking Dependencies:**
- M2 (프리셋 라이브러리): Optional 기능, 추후 구현 가능
- M4 (Live Preview): 별도 구현 가능, Brand DNA 저장/읽기 기능과 독립적

---

## RISKS AND MITIGATION (위험 및 완화)

### RISK-001: MCP SDK API 변경

**위험 수준:** Medium
**발생 확률:** Low (Anthropic 공식 SDK)
**영향도:** High (전체 MCP 통합 영향)

**완화 전략:**
1. SDK 버전 고정 (`@anthropic-ai/sdk-typescript: ^1.0.0`)
2. Wrapper 추상화 레이어 구축 (`packages/studio-mcp/src/mcp-wrapper/`)
3. 주요 버전 업데이트 시 마이그레이션 가이드 검토 및 회귀 테스트

### RISK-002: Axis Interpreter 주관성

**위험 수준:** Medium
**발생 확률:** Medium (디자인 해석 다양성)
**영향도:** Medium (사용자 만족도 영향)

**완화 전략:**
1. 디자이너와 협업하여 변환 규칙 검증
2. Beta 테스트를 통한 실사용 피드백 수집
3. Tier 2 Axes 확장 가능 구조 설계로 유연성 확보

### RISK-003: Web Studio 레포지토리 미생성

**위험 수준:** Low
**발생 확률:** Low (기술적 제약 없음)
**영향도:** High (테스트 및 배포 차단)

**완화 전략:**
1. 로컬 개발 환경에서 MCP Server 테스트 우선 진행
2. Postman/curl로 MCP API 수동 테스트
3. CI/CD 파이프라인 구축 병행 (`packages/studio-mcp/.github/workflows/`)

---

## ACCEPTANCE CRITERIA (인수 조건 요약)

완전한 인수 조건은 `acceptance.md`를 참조하세요.

**핵심 인수 조건:**
1. **AC-001**: Zod 스키마 검증 통과율 100%
2. **AC-002**: Axis Interpreter 정확성 (0, 0.5, 1 값 검증)
3. **AC-003**: MCP 통합 E2E 테스트 통과
4. **AC-004**: TRUST 5 품질 게이트 준수 (테스트 커버리지 ≥85%, Lint 통과, 보안 감사)

---

## REFERENCES (참고 자료)

### 관련 문서

- [SPEC-PHASEE-005](../SPEC-PHASEE-005/spec.md): Phase E 전체 계획
- [SPEC-PHASEC-003](../SPEC-PHASEC-003/spec.md): Screen Contract 구조

### 기술 문서

- [MCP Protocol Specification](https://spec.modelcontextprotocol.io/)
- [Zod Documentation](https://zod.dev/)
- [TypeScript 5.9 Release Notes](https://devblogs.microsoft.com/typescript/)

### 디자인 시스템 참고

- Material Design 3: Theming and Color
- Fluent Design System: Design Tokens
- Big Five Personality Traits (심리학 연구)

---

**문서 종료**
