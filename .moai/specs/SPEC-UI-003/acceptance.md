---
id: SPEC-UI-003
document: acceptance
version: "1.0.0"
created: "2026-01-31"
updated: "2026-01-31"
author: soo-kate-yeon
---

# SPEC-UI-003: WebView Studio MVP - 인수 테스트 기준

## 개요

WebView Studio MVP의 인수 테스트 시나리오를 Given-When-Then 형식으로 정의합니다. 각 시나리오는 spec.md의 요구사항 TAG와 연결됩니다.

---

## 1. Explore 페이지 시나리오

### AC-001: 템플릿 갤러리 표시

**관련 TAG:** [TAG-UI003-037], [TAG-UI003-046]

```gherkin
Feature: 템플릿 갤러리 표시
  사용자가 WebView Studio에 접근하면 템플릿 갤러리를 볼 수 있다.

  Scenario: 비로그인 사용자가 Explore 페이지 접근
    Given 사용자가 로그인하지 않은 상태이다
    When 사용자가 "/studio" 페이지에 접근한다
    Then 템플릿 갤러리 그리드가 표시된다
    And 12개의 템플릿 카드가 표시된다
    And 각 카드에 썸네일, 이름, 가격이 표시된다

  Scenario: 템플릿 카드 클릭 시 Editor 이동
    Given 사용자가 Explore 페이지에 있다
    And 템플릿 카드가 표시되어 있다
    When 사용자가 템플릿 카드를 클릭한다
    Then "/studio/template/[id]" 페이지로 이동한다
```

### AC-002: 사이드바 탭 표시

**관련 TAG:** [TAG-UI003-015], [TAG-UI003-016], [TAG-UI003-045]

```gherkin
Feature: 사이드바 탭 표시
  로그인 상태에 따라 사이드바 탭이 다르게 표시된다.

  Scenario: 비로그인 상태 사이드바
    Given 사용자가 로그인하지 않은 상태이다
    When 사용자가 Studio 페이지에 접근한다
    Then Explore 탭만 표시된다
    And Account 탭은 표시되지 않는다
    And 로그인 버튼이 하단에 표시된다

  Scenario: 로그인 상태 사이드바
    Given 사용자가 로그인한 상태이다
    When 사용자가 Studio 페이지에 접근한다
    Then Explore 탭이 표시된다
    And Account 탭이 표시된다
    And 사용자 아바타가 하단에 표시된다
```

---

## 2. Editor - Preview Mode 시나리오

### AC-003: Preview Mode 진입

**관련 TAG:** [TAG-UI003-017], [TAG-UI003-019], [TAG-UI003-039]

```gherkin
Feature: Preview Mode 진입
  라이선스 없는 사용자는 Preview Mode로 진입한다.

  Scenario: 라이선스 없이 Editor 접근
    Given 사용자가 해당 템플릿의 라이선스를 보유하지 않았다
    When 사용자가 "/studio/template/[id]" 페이지에 접근한다
    Then Preview Mode로 진입한다
    And 2개 화면(Dashboard, Login)만 표시된다
    And "Buy Now" 버튼이 표시된다

  Scenario: Preview Mode에서 화면 제한
    Given 사용자가 Preview Mode에 있다
    When 화면 선택기를 확인한다
    Then Dashboard 화면이 선택 가능하다
    And Login 화면이 선택 가능하다
    And 나머지 10개 화면은 표시되지 않는다
```

### AC-004: Preview Mode에서 버튼 숨김

**관련 TAG:** [TAG-UI003-021], [TAG-UI003-031]

```gherkin
Feature: Preview Mode 버튼 숨김
  Preview Mode에서는 Save/Export 버튼이 숨겨진다.

  Scenario: Save 버튼 숨김
    Given 사용자가 Preview Mode에 있다
    When 액션 버튼 영역을 확인한다
    Then Save 버튼이 DOM에 존재하지 않는다

  Scenario: Export 버튼 숨김
    Given 사용자가 Preview Mode에 있다
    When 액션 버튼 영역을 확인한다
    Then Export 버튼이 DOM에 존재하지 않는다

  Scenario: Get License CTA 표시
    Given 사용자가 Preview Mode에 있다
    When 액션 버튼 영역을 확인한다
    Then "Get License" 버튼이 표시된다
    And "Get License" 버튼은 주요 색상으로 강조된다
```

### AC-005: 디바이스 미리보기 전환

**관련 TAG:** [TAG-UI003-009], [TAG-UI003-023], [TAG-UI003-024], [TAG-UI003-025], [TAG-UI003-048], [TAG-UI003-049]

```gherkin
Feature: 디바이스 미리보기 전환
  사용자가 디바이스 스위처로 미리보기 크기를 변경할 수 있다.

  Scenario: Desktop 미리보기
    Given 사용자가 Editor 페이지에 있다
    When 디바이스 스위처에서 "Desktop"을 선택한다
    Then 미리보기 컨테이너 너비가 1440px로 설정된다
    And 템플릿이 Desktop 레이아웃으로 표시된다

  Scenario: Tablet 미리보기
    Given 사용자가 Editor 페이지에 있다
    When 디바이스 스위처에서 "Tablet"을 선택한다
    Then 미리보기 컨테이너 너비가 768px로 설정된다
    And 템플릿이 Tablet 레이아웃으로 표시된다

  Scenario: Mobile 미리보기
    Given 사용자가 Editor 페이지에 있다
    When 디바이스 스위처에서 "Mobile"을 선택한다
    Then 미리보기 컨테이너 너비가 375px로 설정된다
    And 템플릿이 Mobile 레이아웃으로 표시된다

  Scenario: iframe 미사용 확인
    Given 사용자가 Editor 페이지에 있다
    When 미리보기 영역의 DOM을 검사한다
    Then iframe 요소가 존재하지 않는다
    And div 기반 컨테이너로 구현되어 있다
```

---

## 3. Editor - Edit Mode 시나리오

### AC-006: Edit Mode 진입 조건

**관련 TAG:** [TAG-UI003-018], [TAG-UI003-026], [TAG-UI003-040]

```gherkin
Feature: Edit Mode 진입 조건
  유효한 라이선스가 있어야 Edit Mode에 진입할 수 있다.

  Scenario: 라이선스 보유 시 Edit Mode 접근
    Given 사용자가 로그인한 상태이다
    And 해당 템플릿의 유효한 라이선스를 보유하고 있다
    When 사용자가 "/studio/template/[id]/edit" 페이지에 접근한다
    Then Edit Mode로 정상 진입한다
    And 12개 전체 화면이 표시된다

  Scenario: 라이선스 없이 Edit Mode 접근 시도
    Given 사용자가 로그인한 상태이다
    And 해당 템플릿의 라이선스를 보유하지 않았다
    When 사용자가 "/studio/template/[id]/edit" 페이지에 접근한다
    Then Edit Mode에 진입하지 못한다
    And "/studio/template/[id]" (Preview) 페이지로 리다이렉트된다
    And "라이선스가 필요합니다" 메시지가 표시된다

  Scenario: 비로그인 상태로 Edit Mode 접근 시도
    Given 사용자가 로그인하지 않은 상태이다
    When 사용자가 "/studio/template/[id]/edit" 페이지에 접근한다
    Then "/auth/login" 페이지로 리다이렉트된다
    And 로그인 후 원래 페이지로 돌아온다
```

### AC-007: Edit Mode 기능

**관련 TAG:** [TAG-UI003-020], [TAG-UI003-022], [TAG-UI003-051]

```gherkin
Feature: Edit Mode 전체 기능
  Edit Mode에서는 모든 편집 기능을 사용할 수 있다.

  Scenario: 12개 전체 화면 접근
    Given 사용자가 Edit Mode에 있다
    When 화면 선택기를 확인한다
    Then 12개 전체 화면이 선택 가능하다
    And 각 화면을 클릭하면 해당 화면이 미리보기에 표시된다

  Scenario: Save 버튼 표시
    Given 사용자가 Edit Mode에 있다
    When 액션 버튼 영역을 확인한다
    Then Save 버튼이 표시된다
    And Save 버튼이 활성화되어 있다

  Scenario: Export 버튼 표시
    Given 사용자가 Edit Mode에 있다
    When 액션 버튼 영역을 확인한다
    Then Export 버튼이 표시된다
    And Export 버튼이 활성화되어 있다
```

---

## 4. 프리셋 시스템 시나리오

### AC-008: 프리셋 선택 및 즉시 반영

**관련 TAG:** [TAG-UI003-007], [TAG-UI003-050], [TAG-UI003-055]

```gherkin
Feature: 프리셋 선택 및 즉시 반영
  프리셋 선택 시 CSS Variables가 즉시 업데이트되어 미리보기에 반영된다.

  Scenario: 색상 프리셋 선택
    Given 사용자가 Editor 페이지에 있다
    And 현재 색상 프리셋이 "Ocean Blue"이다
    When 사용자가 "Forest Green" 프리셋을 선택한다
    Then CSS Variable "--tekton-bg-primary"가 즉시 업데이트된다
    And 미리보기 영역의 Primary 색상이 녹색으로 변경된다
    And 페이지 새로고침 없이 변경된다

  Scenario: 타이포그래피 프리셋 선택
    Given 사용자가 Editor 페이지에 있다
    And 현재 타이포그래피 프리셋이 "Modern Sans"이다
    When 사용자가 "Classic Serif" 프리셋을 선택한다
    Then CSS Variable "--tekton-font-family"가 즉시 업데이트된다
    And 미리보기 영역의 폰트가 세리프체로 변경된다

  Scenario: 간격 프리셋 선택
    Given 사용자가 Editor 페이지에 있다
    And 현재 간격 프리셋이 "Comfortable"이다
    When 사용자가 "Spacious" 프리셋을 선택한다
    Then CSS Variable "--tekton-spacing-scale"이 즉시 업데이트된다
    And 미리보기 영역의 간격이 넓어진다

  Scenario: 프리셋 조합
    Given 사용자가 Editor 페이지에 있다
    When 색상 "Sunset Orange", 타이포그래피 "Minimal", 간격 "Compact"를 선택한다
    Then 3개 프리셋이 모두 적용된다
    And 미리보기에 조합된 스타일이 표시된다
```

### AC-009: 테마 저장

**관련 TAG:** [TAG-UI003-012], [TAG-UI003-052]

```gherkin
Feature: 테마 저장
  Edit Mode에서 커스터마이징한 테마를 저장할 수 있다.

  Scenario: 테마 저장 성공
    Given 사용자가 Edit Mode에 있다
    And 프리셋을 변경한 상태이다
    When Save 버튼을 클릭한다
    Then 테마 설정이 User DB에 저장된다
    And "저장되었습니다" 성공 메시지가 표시된다
    And 페이지를 새로고침해도 설정이 유지된다

  Scenario: 비로그인 상태 저장 시도
    Given 사용자가 Preview Mode에 있다 (비로그인)
    When Save 버튼이 없다 (숨겨짐)
    Then 저장 기능을 사용할 수 없다
```

### AC-010: MCP Export

**관련 TAG:** [TAG-UI003-013], [TAG-UI003-052]

```gherkin
Feature: MCP Export
  테마 설정을 MCP 형식 JSON으로 내보낼 수 있다.

  Scenario: JSON 내보내기 성공
    Given 사용자가 Edit Mode에 있다
    And 프리셋이 선택된 상태이다
    When Export 버튼을 클릭한다
    Then MCP 형식의 JSON 파일이 다운로드된다
    And JSON에 version 필드가 포함된다
    And JSON에 presets 필드가 포함된다
    And JSON에 overrides 필드가 포함된다
    And JSON에 exportedAt 필드가 포함된다

  Scenario: JSON 형식 검증
    Given Export된 JSON 파일이 있다
    When JSON 스키마를 검증한다
    Then 유효한 ThemeConfigJSON 형식이다
    And IDE/CLI에서 import 가능하다
```

---

## 5. 인증 시나리오

### AC-011: 소셜 로그인

**관련 TAG:** [TAG-UI003-010], [TAG-UI003-014], [TAG-UI003-041], [TAG-UI003-042], [TAG-UI003-056]

```gherkin
Feature: 소셜 로그인
  Google 또는 GitHub으로 로그인할 수 있다.

  Scenario: Google 로그인 성공
    Given 사용자가 Login 페이지에 있다
    When "Google로 로그인" 버튼을 클릭한다
    And Google OAuth 인증을 완료한다
    Then OAuth 콜백이 처리된다
    And 사용자 세션이 생성된다
    And 라이선스 정보가 로드된다
    And 이전 페이지로 리다이렉트된다

  Scenario: GitHub 로그인 성공
    Given 사용자가 Login 페이지에 있다
    When "GitHub로 로그인" 버튼을 클릭한다
    And GitHub OAuth 인증을 완료한다
    Then OAuth 콜백이 처리된다
    And 사용자 세션이 생성된다
    And 라이선스 정보가 로드된다
    And 이전 페이지로 리다이렉트된다

  Scenario: 로그아웃
    Given 사용자가 로그인한 상태이다
    When 로그아웃 버튼을 클릭한다
    Then 세션이 삭제된다
    And Explore 페이지로 이동한다
    And Account 탭이 숨겨진다
```

---

## 6. 라이선스 검증 시나리오

### AC-012: 라이선스 검증 및 활성화

**관련 TAG:** [TAG-UI003-011], [TAG-UI003-018]

> **Note:** 결제 시스템(Paddle)은 추후 별도 SPEC에서 정의됩니다. 현재 라이선스는 외부에서 프로비저닝된다고 가정합니다.

```gherkin
Feature: 라이선스 검증
  유효한 라이선스가 있으면 Edit Mode에 접근할 수 있다.

  Scenario: 라이선스 보유 시 Edit Mode 활성화
    Given 사용자가 로그인한 상태이다
    And 해당 템플릿의 유효한 라이선스를 보유하고 있다
    When 해당 템플릿의 Editor 페이지에 접근한다
    Then Edit Mode로 진입 가능하다
    And 12개 전체 화면이 표시된다

  Scenario: 라이선스 키 입력으로 활성화 (임시)
    Given 사용자가 로그인한 상태이다
    And 라이선스를 보유하지 않았다
    When Account 페이지에서 유효한 라이선스 키를 입력한다
    Then 라이선스가 활성화된다
    And 해당 템플릿의 Edit Mode에 접근 가능하다

  Scenario: Get License CTA 표시
    Given 사용자가 Preview Mode에 있다
    And 라이선스를 보유하지 않았다
    When 액션 버튼 영역을 확인한다
    Then "Get License" 버튼이 표시된다
    And 라이선스 안내 정보가 표시된다
```

---

## 7. Account 페이지 시나리오

### AC-013: Account 페이지 기능

**관련 TAG:** [TAG-UI003-038]

```gherkin
Feature: Account 페이지
  사용자의 라이선스와 좋아요 목록을 관리할 수 있다.

  Scenario: 라이선스 목록 표시
    Given 사용자가 로그인한 상태이다
    And 2개의 라이선스를 보유하고 있다
    When Account 페이지에 접근한다
    Then 2개의 라이선스가 목록에 표시된다
    And 각 라이선스의 템플릿 이름이 표시된다
    And 구매 날짜가 표시된다
    And 상태(active)가 표시된다

  Scenario: 좋아요 템플릿 목록
    Given 사용자가 로그인한 상태이다
    And 3개의 템플릿에 좋아요를 했다
    When Account 페이지에 접근한다
    Then 좋아요 섹션에 3개의 템플릿이 표시된다
    And 각 템플릿 카드를 클릭하면 Editor로 이동한다
```

---

## 8. 품질 기준 시나리오

### AC-014: 하드코딩 금지

**관련 TAG:** [TAG-UI003-005], [TAG-UI003-027]

```gherkin
Feature: 하드코딩 금지
  모든 스타일은 CSS Variables를 통해 적용되어야 한다.

  Scenario: 색상 하드코딩 없음
    Given WebView Studio 소스 코드가 있다
    When 색상 하드코딩 패턴을 검색한다 (#hex, rgb, rgba, hsl)
    Then 0건의 결과가 반환된다
    And 모든 색상은 var(--tekton-*) 형식이다

  Scenario: 간격 하드코딩 없음
    Given WebView Studio 소스 코드가 있다
    When 간격 하드코딩 패턴을 검색한다 (margin: Npx, padding: Npx)
    Then 0건의 결과가 반환된다 (예외: 디바이스 크기 정의)
    And 모든 간격은 토큰을 통해 적용된다
```

### AC-015: 접근성

**관련 TAG:** [TAG-UI003-003], [TAG-UI003-006]

```gherkin
Feature: 접근성 준수
  WCAG 2.1 AA 기준을 충족해야 한다.

  Scenario: axe-core 테스트 통과
    Given WebView Studio 페이지가 렌더링된다
    When axe-core 접근성 테스트를 실행한다
    Then 심각(critical) 위반이 0건이다
    And 중요(serious) 위반이 0건이다

  Scenario: 키보드 네비게이션
    Given 사용자가 Explore 페이지에 있다
    When Tab 키로 네비게이션한다
    Then 모든 인터랙티브 요소에 포커스가 가능하다
    And 포커스 표시가 명확하게 보인다
    And Enter/Space로 활성화 가능하다
```

### AC-016: 반응형 레이아웃

**관련 TAG:** [TAG-UI003-004]

```gherkin
Feature: 반응형 레이아웃
  Desktop, Tablet, Mobile에서 정상 동작해야 한다.

  Scenario: Desktop 레이아웃 (1440px)
    Given 화면 너비가 1440px이다
    When Studio 페이지를 로드한다
    Then 사이드바가 왼쪽에 고정 표시된다
    And 메인 컨텐츠가 넓게 표시된다
    And 갤러리 그리드가 4열로 표시된다

  Scenario: Tablet 레이아웃 (768px)
    Given 화면 너비가 768px이다
    When Studio 페이지를 로드한다
    Then 사이드바가 접히거나 축소된다
    And 갤러리 그리드가 2열로 표시된다

  Scenario: Mobile 레이아웃 (375px)
    Given 화면 너비가 375px이다
    When Studio 페이지를 로드한다
    Then 사이드바가 햄버거 메뉴로 전환된다
    And 갤러리 그리드가 1열로 표시된다
```

---

## 9. 성능 시나리오

### AC-017: 페이지 로드 성능

```gherkin
Feature: 페이지 로드 성능
  Lighthouse 성능 기준을 충족해야 한다.

  Scenario: LCP 2.5초 이내
    Given Lighthouse 감사를 실행한다
    When Explore 페이지를 측정한다
    Then LCP가 2.5초 이내이다

  Scenario: CLS 0.1 이하
    Given Lighthouse 감사를 실행한다
    When Explore 페이지를 측정한다
    Then CLS가 0.1 이하이다

  Scenario: 프리셋 변경 성능
    Given Editor 페이지가 로드되어 있다
    When 프리셋을 변경한다
    Then 100ms 이내에 CSS Variables가 업데이트된다
    And 페이지 리페인트가 발생하지 않는다
```

---

## Definition of Done (완료 정의)

### 기능 완료 기준

- [ ] 모든 6개 페이지가 접근 가능하고 정상 동작한다
- [ ] Preview Mode와 Edit Mode가 라이선스에 따라 올바르게 분기된다
- [ ] 프리셋 선택 시 CSS Variables가 즉시 반영된다
- [ ] Google/GitHub OAuth 로그인이 정상 동작한다
- [ ] 테마 저장 및 MCP Export가 정상 동작한다
- [ ] 디바이스 미리보기가 Container 기반으로 동작한다
- [ ] 라이선스 키 입력으로 Edit Mode 활성화 가능 (임시)

### 품질 완료 기준

- [ ] TypeScript 컴파일 오류 0개
- [ ] ESLint 경고 0개
- [ ] 테스트 커버리지 85% 이상
- [ ] WCAG 2.1 AA 준수 (axe-core 통과)
- [ ] Lighthouse LCP < 2.5s, CLS < 0.1
- [ ] 하드코딩 검출 0건
- [ ] E2E 테스트 전체 통과
- [ ] 크로스 브라우저 테스트 통과 (Chrome, Firefox, Safari)
- [ ] 반응형 테스트 통과 (Desktop, Tablet, Mobile)

---

## 참조 문서

- [spec.md](./spec.md) - EARS 요구사항 명세
- [plan.md](./plan.md) - 구현 계획 및 마일스톤
