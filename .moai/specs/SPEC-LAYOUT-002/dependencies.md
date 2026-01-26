# SPEC-LAYOUT-002 의존성 문서
**SPEC ID**: SPEC-LAYOUT-002
**문서 버전**: 1.0.0
**생성일**: 2026-01-26
**상태**: 계획 (Planned) - SPEC-LAYOUT-001 완료 대기
**우선순위**: HIGH

---

## 📋 목차
1. [개요](#개요)
2. [의존성 분석](#의존성-분석)
3. [블로킹 요소](#블로킹-요소)
4. [준비 상태 체크리스트](#준비-상태-체크리스트)
5. [구현 대기 계획](#구현-대기-계획)

---

## 개요

### SPEC-LAYOUT-002 목적
JSON Schema 기반 화면 정의 시스템을 구축하여, LLM이 자연어 요청으로부터 프로덕션 레디 React 컴포넌트를 생성할 수 있도록 합니다.

### 현재 상태
**상태**: 🔴 **BLOCKED** - SPEC-LAYOUT-001 완료 대기 중

**블로킹 이유**:
SPEC-LAYOUT-002의 Screen Generation Pipeline은 SPEC-LAYOUT-001의 Layout Token System에 전적으로 의존합니다. Layout Token 없이는 화면 구조를 정의하고 해석할 수 없습니다.

---

## 의존성 분석

### 필수 의존성 (CRITICAL)

#### 1. SPEC-LAYOUT-001: Layout Token System 🔴 **REQUIRED**

**의존성 유형**: 필수 (Mandatory)
**블로킹 정도**: 100% - 구현 불가능

**필요한 구성 요소:**

| SPEC-LAYOUT-001 구성 요소 | SPEC-LAYOUT-002 사용처 | 중요도 |
|--------------------------|----------------------|--------|
| Shell 토큰 (6개) | ScreenDefinition.shell 필드 | CRITICAL |
| Page Layout 토큰 (8개) | ScreenDefinition.page 필드 | CRITICAL |
| Section Pattern 토큰 (12개) | SectionDefinition.pattern 필드 | CRITICAL |
| Responsive 토큰 (5개) | ResponsiveOverrides 구성 | HIGH |
| `resolveLayout()` 함수 | Screen Resolver Pipeline - 레이아웃 해석 | CRITICAL |
| `generateLayoutCSS()` 함수 | CSS-in-JS Generator - CSS 생성 | HIGH |
| TypeScript 타입 | ScreenDefinition 타입 정의 | CRITICAL |

**구체적 사용 예시:**

```typescript
// SPEC-LAYOUT-002의 ScreenDefinition이 SPEC-LAYOUT-001 토큰에 의존
interface ScreenDefinition {
  shell: string;           // ← SPEC-LAYOUT-001 Shell 토큰 참조
  page: string;            // ← SPEC-LAYOUT-001 Page Layout 토큰 참조
  sections: SectionDefinition[];  // ← Section Pattern 토큰 사용
}

// Screen Resolver가 Layout Resolver에 의존
function resolveScreen(screen: ScreenDefinition) {
  // SPEC-LAYOUT-001의 resolveLayout() 사용
  const layout = resolveLayout(screen.shell, screen.page);

  // SPEC-LAYOUT-001의 Section Pattern 사용
  const sections = screen.sections.map(s =>
    resolveSection(s.pattern)  // ← Section Pattern 토큰 해석
  );

  // ...
}
```

**블로킹 해제 조건:**
- [x] SPEC-LAYOUT-001 spec.md 작성 완료
- [ ] SPEC-LAYOUT-001 구현 완료
- [ ] SPEC-LAYOUT-001 테스트 커버리지 ≥85%
- [ ] SPEC-LAYOUT-001 `resolveLayout()` 함수 작동
- [ ] SPEC-LAYOUT-001 모든 토큰 구현 완료

---

#### 2. SPEC-COMPONENT-001-B: Component Schemas ✅ **COMPLETED**

**의존성 유형**: 필수 (Mandatory)
**블로킹 정도**: 0% - 이미 완료됨

**필요한 구성 요소:**

| 구성 요소 | 사용처 | 상태 |
|---------|--------|------|
| ComponentSchema (20개) | ComponentDefinition 타입 | ✅ 완료 |
| Token Bindings | Token Resolution | ✅ 완료 |
| Accessibility Requirements | 생성된 컴포넌트 접근성 | ✅ 완료 |
| Props 정의 | ComponentDefinition.props | ✅ 완료 |

**상태**: ✅ **준비 완료** (2026-01-25 완료)

---

### 선택적 의존성 (OPTIONAL)

#### 3. Token Resolver (기존 시스템) ✅ **AVAILABLE**

**의존성 유형**: 선택적 (Optional)
**상태**: ✅ 이미 구현됨

**필요한 구성 요소:**
- `resolveToken()` 함수: 토큰 참조를 CSS 값으로 해석
- Token 캐싱: 성능 최적화

**사용 시기**: Token Binding Resolution 단계

---

#### 4. CSS Generator (기존 시스템) ✅ **AVAILABLE**

**의존성 유형**: 선택적 (Optional)
**상태**: ✅ 이미 구현됨

**필요한 구성 요소:**
- `generateThemeCSS()` 함수: 테마 CSS 변수 생성

**사용 시기**: CSS-in-JS Generator에서 테마 토큰 사용

---

## 블로킹 요소

### 블로킹 요소 #1: SPEC-LAYOUT-001 미완료 🔴

**심각도**: CRITICAL
**영향 범위**: 전체 SPEC-LAYOUT-002 구현 불가능

**구체적 블로킹 사항:**

1. **JSON Schema 정의 불가능**
   - Shell, Page, Section 토큰 ID가 정의되지 않아 enum 값 지정 불가
   - 예시:
```json
{
  "shell": {
    "type": "string",
    "pattern": "^shell\\.[a-z]+\\.[a-z-]+$",
    "enum": [/* SPEC-LAYOUT-001 완료 후 추가 */]
  }
}
```

2. **Screen Resolver 구현 불가능**
   - `resolveLayout()` 함수가 없어 레이아웃 구조 해석 불가
   - Section Pattern 해석 불가

3. **CSS 생성 불가능**
   - Layout CSS 변수가 정의되지 않음
   - Media Query 생성 로직 없음

4. **MCP Tool 테스트 불가능**
   - 실제 레이아웃 토큰 없이 LLM 통합 테스트 불가
   - 예시 프롬프트 검증 불가

**해제 조건:**
- SPEC-LAYOUT-001 구현 완료 및 모든 Success Criteria 충족

---

## 준비 상태 체크리스트

### 현재 준비된 것 ✅

- [x] **SPEC-LAYOUT-002 spec.md 작성 완료**
  - JSON Schema 명세 정의
  - Screen Resolver Pipeline 설계
  - Output Generator 명세
  - MCP 서버 통합 계획

- [x] **SPEC-COMPONENT-001-B 완료**
  - 20개 컴포넌트 스키마 정의
  - Token Bindings 문서화
  - Accessibility Requirements

- [x] **기존 인프라 준비**
  - Token Resolver 시스템 작동
  - CSS Generator 작동
  - Blueprint 시스템 작동

### 대기 중인 것 ⏳

- [ ] **SPEC-LAYOUT-001 구현 완료**
  - Shell 토큰 (6개)
  - Page Layout 토큰 (8개)
  - Section Pattern 토큰 (12개)
  - Responsive 토큰 (5개)
  - `resolveLayout()` 함수
  - `generateLayoutCSS()` 함수

- [ ] **JSON Schema 완성**
  - Shell/Page/Section 토큰 enum 값 추가
  - 실제 토큰 ID로 패턴 검증

- [ ] **Screen Resolver Pipeline 구현**
  - Layout Resolver 통합
  - Component Resolver
  - Token Binding Resolution

- [ ] **Output Generator 구현**
  - CSS-in-JS Generator
  - Tailwind CSS Generator
  - React Component Generator

- [ ] **MCP 서버 통합**
  - `generate_screen` 도구
  - `validate_screen` 도구
  - Claude Desktop/Code 통합

---

## 구현 대기 계획

### 대기 중 수행 가능한 작업

#### 작업 1: JSON Schema 템플릿 준비 (예상: 1일)
**상태**: ✅ 가능 (SPEC-LAYOUT-001 독립적)

**작업 내용:**
- Screen Definition JSON Schema의 기본 구조 작성
- ComponentDefinition 스키마 작성 (SPEC-COMPONENT-001-B 기반)
- 토큰 enum 자리 표시자 추가

**완료 기준:**
- [ ] JSON Schema 파일 생성
- [ ] Zod 스키마 변환 로직 준비
- [ ] 스키마 검증 함수 프레임워크

---

#### 작업 2: Component Resolver 프로토타입 (예상: 2일)
**상태**: ✅ 가능 (SPEC-COMPONENT-001-B 완료)

**작업 내용:**
- ComponentDefinition → ResolvedComponent 변환 로직
- Props 검증 및 기본값 처리
- Children 해석 로직

**완료 기준:**
- [ ] Component Resolver 함수 작성
- [ ] 단위 테스트 (SPEC-COMPONENT-001-B 스키마 사용)
- [ ] 커버리지 ≥85%

---

#### 작업 3: React Component Generator 프레임워크 (예상: 2-3일)
**상태**: ✅ 가능 (레이아웃 독립적)

**작업 내용:**
- React 컴포넌트 코드 생성 로직
- JSX 문자열 빌더
- Props 전파 로직
- TypeScript 타입 생성

**완료 기준:**
- [ ] Generator 함수 작성
- [ ] 단위 테스트 (간단한 컴포넌트)
- [ ] 코드 포맷팅 (Prettier 통합)

---

#### 작업 4: CSS-in-JS Generator 프레임워크 (예상: 2일)
**상태**: ⚠️ 부분 가능 (레이아웃 CSS 제외)

**작업 내용:**
- styled-components 출력 생성
- emotion 출력 생성
- 컴포넌트 스타일 생성 (레이아웃 제외)

**완료 기준:**
- [ ] CSS-in-JS Generator 함수
- [ ] 단위 테스트 (컴포넌트 스타일)

**제한 사항:**
- ❌ 레이아웃 CSS 생성 불가 (SPEC-LAYOUT-001 대기)
- ❌ Media Query 생성 불가

---

#### 작업 5: MCP 서버 프레임워크 (예상: 1일)
**상태**: ✅ 가능 (프레임워크만)

**작업 내용:**
- MCP 서버 기본 구조
- Tool Definition 작성
- 입력 스키마 정의

**완료 기준:**
- [ ] MCP 서버 프로젝트 생성
- [ ] Tool 등록 프레임워크

**제한 사항:**
- ❌ 실제 화면 생성 로직 미구현 (SPEC-LAYOUT-001 대기)

---

### SPEC-LAYOUT-001 완료 후 즉시 실행

#### Phase 1: JSON Schema 완성 (예상: 0.5일)
- Shell/Page/Section 토큰 enum 추가
- 패턴 검증 업데이트

#### Phase 2: Screen Resolver 완성 (예상: 2일)
- Layout Resolver 통합
- Token Binding Resolution
- 전체 파이프라인 연결

#### Phase 3: CSS Generator 완성 (예상: 1일)
- 레이아웃 CSS 생성
- Media Query 생성
- CSS 출력 최적화

#### Phase 4: MCP 도구 완성 (예상: 1일)
- `generate_screen` 로직 구현
- 엔드투엔드 테스트
- LLM 프롬프트 가이드

#### Phase 5: 통합 테스트 및 문서 (예상: 2일)
- 전체 파이프라인 테스트
- LLM 통합 테스트
- 사용자 가이드 작성

**예상 총 소요 시간 (SPEC-LAYOUT-001 완료 후)**: 6.5일

---

## 대기 중 리스크 관리

### 리스크 1: SPEC-LAYOUT-001 지연 🟠 MEDIUM
**가능성**: MEDIUM
**영향도**: HIGH

**완화 전략:**
- SPEC-LAYOUT-001 진행 상황 주간 모니터링
- 대기 중 작업(작업 1-5) 최대한 진행
- SPEC-LAYOUT-001 완료 후 빠른 통합 준비

**대응 계획:**
- SPEC-LAYOUT-001 구현 지원 제공
- 블로킹 해제 후 집중 개발 스프린트

---

### 리스크 2: SPEC-LAYOUT-001 스키마 변경 🟡 MEDIUM
**가능성**: MEDIUM
**영향도**: MEDIUM

**완화 전략:**
- SPEC-LAYOUT-001 스키마 검토 및 피드백
- 유연한 JSON Schema 설계 (확장 가능)
- 버전 관리 전략

**대응 계획:**
- 스키마 변경 시 빠른 JSON Schema 업데이트
- 하위 호환성 유지

---

## 진행 상황 추적

### 주간 체크포인트

#### Week 1 (현재)
- [x] SPEC-LAYOUT-002 spec.md 작성
- [x] 의존성 문서 작성
- [x] SPEC-LAYOUT-001 spec.md 검토
- [ ] 작업 1: JSON Schema 템플릿 (시작 대기)

#### Week 2
- [ ] 작업 2: Component Resolver (SPEC-LAYOUT-001 독립)
- [ ] 작업 3: React Generator (SPEC-LAYOUT-001 독립)
- [ ] SPEC-LAYOUT-001 진행 상황 확인

#### Week 3
- [ ] 작업 4: CSS-in-JS Generator (부분)
- [ ] 작업 5: MCP 서버 프레임워크
- [ ] SPEC-LAYOUT-001 완료 예상

#### Week 4
- [ ] SPEC-LAYOUT-001 완료 후 통합 작업
- [ ] Screen Resolver 완성
- [ ] MCP 도구 완성
- [ ] 엔드투엔드 테스트

---

## 연락처 및 에스컬레이션

### 의존성 블로킹 해제 요청
- **담당자**: TBD
- **에스컬레이션 경로**: Tech Lead → Product Manager

### SPEC-LAYOUT-001 진행 상황 문의
- **담당자**: TBD
- **업데이트 주기**: 주간

### 긴급 블로킹 해제
- **조건**: Critical 비즈니스 요구 사항 발생 시
- **대응**: SPEC-LAYOUT-001 우선순위 상향 조정

---

## 참고 자료

### 내부 문서
- [SPEC-LAYOUT-002 Specification](./spec.md)
- [SPEC-LAYOUT-001 Specification](../SPEC-LAYOUT-001/spec.md)
- [SPEC-LAYOUT-001 Implementation Plan](../SPEC-LAYOUT-001/implementation-plan.md)
- [SPEC-COMPONENT-001-B Implementation Report](../SPEC-COMPONENT-001-B/implementation-report.md)

### 외부 자료
- [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12/json-schema-core.html)
- [Model Context Protocol](https://modelcontextprotocol.io/)

---

**문서 작성자**: Manager-Docs Agent
**최종 업데이트**: 2026-01-26
**다음 리뷰**: SPEC-LAYOUT-001 완료 시

---

*이 문서는 SPEC-LAYOUT-001 완료까지 주간 단위로 업데이트됩니다.*
