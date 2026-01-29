# SPEC-LAYOUT-004: Acceptance Criteria

## 인수 조건

### 1. SafeArea 관련 인수 조건

---

#### AC-001: iOS SafeArea 적용

##### Scenario 1: 노치 디바이스 SafeArea
```gherkin
Given iPhone 14 (노치 디바이스)에서 앱이 실행될 때
When SHELL_MOBILE_APP 셸이 렌더링되면
Then 상단 SafeArea가 최소 44pt로 적용되어야 한다
And 하단 SafeArea가 홈 인디케이터 영역(34pt)을 포함해야 한다
And 콘텐츠가 노치 영역을 침범하지 않아야 한다
```

##### Scenario 2: 다이내믹 아일랜드 디바이스 SafeArea
```gherkin
Given iPhone 14 Pro (다이내믹 아일랜드 디바이스)에서 앱이 실행될 때
When SHELL_MOBILE_APP 셸이 렌더링되면
Then 상단 SafeArea가 최소 59pt로 적용되어야 한다
And 다이내믹 아일랜드 확장 시에도 레이아웃이 유지되어야 한다
```

##### Scenario 3: 비노치 디바이스 (iPhone SE)
```gherkin
Given iPhone SE (비노치 디바이스)에서 앱이 실행될 때
When SHELL_MOBILE_APP 셸이 렌더링되면
Then 상단 SafeArea가 상태바 높이(20pt)로 적용되어야 한다
And 하단 SafeArea가 0pt이어야 한다 (홈 버튼 디바이스)
```

---

#### AC-002: Android System UI 적용

##### Scenario 4: Android 제스처 네비게이션
```gherkin
Given Android 12 제스처 네비게이션 모드에서 앱이 실행될 때
When SHELL_MOBILE_APP 셸이 렌더링되면
Then 하단 네비게이션 바 영역이 WindowInsets로 처리되어야 한다
And 콘텐츠가 네비게이션 제스처 영역을 침범하지 않아야 한다
```

##### Scenario 5: Android 3버튼 네비게이션
```gherkin
Given Android 3버튼 네비게이션 모드에서 앱이 실행될 때
When SHELL_MOBILE_APP 셸이 렌더링되면
Then 하단 네비게이션 바 높이(48dp)가 적용되어야 한다
And 콘텐츠가 네비게이션 바 영역을 침범하지 않아야 한다
```

---

### 2. 키보드 관련 인수 조건

---

#### AC-003: 키보드 회피

##### Scenario 6: 키보드 표시 시 레이아웃 조정
```gherkin
Given 텍스트 입력 필드가 화면 하단에 위치할 때
When 사용자가 입력 필드를 탭하여 키보드가 표시되면
Then 입력 필드가 키보드 위로 이동해야 한다
And 입력 필드가 키보드에 가려지지 않아야 한다
And 레이아웃 조정 애니메이션이 250ms 이내에 완료되어야 한다
```

##### Scenario 7: 키보드 숨김 시 레이아웃 복원
```gherkin
Given 키보드가 표시된 상태에서
When 사용자가 키보드를 닫으면
Then 레이아웃이 원래 상태로 복원되어야 한다
And 스크롤 위치가 유지되어야 한다
```

##### Scenario 8: 다양한 키보드 회피 전략
```gherkin
Given KeyboardConfig.avoidance가 'padding'으로 설정되었을 때
When 키보드가 표시되면
Then 콘텐츠 영역에 padding-bottom이 키보드 높이만큼 추가되어야 한다

Given KeyboardConfig.avoidance가 'resize'로 설정되었을 때
When 키보드가 표시되면
Then 콘텐츠 영역의 높이가 키보드 높이만큼 축소되어야 한다
```

---

### 3. 터치 타겟 관련 인수 조건

---

#### AC-004: 최소 터치 타겟 크기

##### Scenario 9: 버튼 터치 타겟 검증
```gherkin
Given 버튼 컴포넌트가 렌더링될 때
When 버튼의 시각적 크기가 44pt 미만이면
Then TouchTargetConfig의 hitSlop이 자동으로 확장되어야 한다
And 실제 터치 영역이 최소 44x44pt가 되어야 한다
```

##### Scenario 10: 터치 타겟 경고
```gherkin
Given 개발 모드에서 앱이 실행될 때
When 터치 가능한 요소의 크기가 44pt 미만이면
Then 콘솔에 접근성 경고가 표시되어야 한다
And 경고 메시지에 권장 크기가 포함되어야 한다
```

---

### 4. Bottom Tab 관련 인수 조건

---

#### AC-005: Bottom Tab 레이아웃

##### Scenario 11: Bottom Tab 기본 렌더링
```gherkin
Given SHELL_MOBILE_TAB 셸이 사용될 때
When 화면이 렌더링되면
Then Bottom Tab이 화면 하단에 고정되어야 한다
And Bottom Tab 높이가 BottomTabConfig.height로 적용되어야 한다
And SafeArea 하단이 Bottom Tab 아래에 추가되어야 한다
```

##### Scenario 12: Bottom Tab 스크롤 숨김
```gherkin
Given BottomTabConfig.visibility가 'scroll-hide'로 설정되었을 때
When 사용자가 아래로 스크롤하면
Then Bottom Tab이 애니메이션과 함께 숨겨져야 한다
And 메인 콘텐츠 영역이 확장되어야 한다

When 사용자가 위로 스크롤하면
Then Bottom Tab이 애니메이션과 함께 다시 표시되어야 한다
```

##### Scenario 13: Bottom Tab 아이템 터치 타겟
```gherkin
Given Bottom Tab에 5개의 탭 아이템이 있을 때
When 각 탭 아이템의 터치 영역을 확인하면
Then 모든 탭 아이템의 터치 영역이 최소 44x44pt이어야 한다
And 탭 간 터치 영역이 겹치지 않아야 한다
```

---

### 5. 모바일 셸 토큰 관련 인수 조건

---

#### AC-006: 셸 토큰 검증

##### Scenario 14: 모바일 셸 토큰 조회
```gherkin
Given 모바일 셸 토큰이 정의되어 있을 때
When getMobileShellToken('shell.mobile.app')을 호출하면
Then SHELL_MOBILE_APP 토큰이 반환되어야 한다
And 토큰의 platform이 'mobile'이어야 한다
```

##### Scenario 15: 플랫폼별 셸 필터링
```gherkin
Given 6개의 모바일 셸 토큰이 정의되어 있을 때
When getMobileShellsByOS('ios')를 호출하면
Then iOS 전용 또는 cross-platform 셸만 반환되어야 한다
```

##### Scenario 16: 전체 모바일 셸 목록
```gherkin
Given 6개의 모바일 셸 토큰이 정의되어 있을 때
When getAllMobileShellTokens()를 호출하면
Then 6개의 셸 토큰 배열이 반환되어야 한다
And 각 토큰이 MobileShellToken 인터페이스를 준수해야 한다
```

---

### 6. Edge Cases

#### Edge Case 1: 가로 모드에서의 SafeArea
```gherkin
Given 디바이스가 가로 모드(landscape)일 때
When SHELL_MOBILE_APP 셸이 렌더링되면
Then 좌우 SafeArea가 노치/다이내믹 아일랜드 위치에 따라 적용되어야 한다
And 상하 SafeArea가 축소되어야 한다
```

#### Edge Case 2: 키보드와 Bottom Tab 동시 처리
```gherkin
Given Bottom Tab이 표시된 상태에서
When 키보드가 표시되면
Then Bottom Tab이 숨겨지고 키보드 회피가 적용되어야 한다
And 키보드가 숨겨지면 Bottom Tab이 다시 표시되어야 한다
```

#### Edge Case 3: 회전 중 SafeArea 변경
```gherkin
Given 디바이스가 세로 모드일 때
When 디바이스가 가로 모드로 회전하면
Then SafeArea 값이 즉시 재계산되어야 한다
And 레이아웃 전환이 부드럽게 이루어져야 한다
```

#### Edge Case 4: 멀티태스킹 (iPad/Android 분할 화면)
```gherkin
Given iPad 분할 화면 모드에서 앱이 실행될 때
When 앱 창 크기가 변경되면
Then SafeArea가 현재 창 크기에 맞게 재계산되어야 한다
And 레이아웃이 축소된 창에 맞게 조정되어야 한다
```

---

### 7. Quality Gates

| 항목 | 기준 | 측정 방법 |
|------|------|----------|
| 테스트 커버리지 | ≥ 80% | Jest coverage report |
| iOS 디바이스 테스트 | iPhone SE, 14, 14 Pro | Detox/Maestro |
| Android 디바이스 테스트 | API 28+, 제스처/버튼 네비게이션 | Detox/Maestro |
| 터치 타겟 준수 | 100% (44pt 이상) | 자동화된 접근성 검사 |
| SafeArea 정확도 | 모든 디바이스 ±2pt | 시각적 검증 |
| 키보드 회피 지연 | < 300ms | 성능 프로파일링 |

---

### 8. 검증 체크리스트

#### 코드 품질
- [ ] TypeScript strict mode 통과
- [ ] ESLint 에러 없음
- [ ] 모든 인터페이스에 JSDoc 주석

#### 기능 검증 - SafeArea
- [ ] iOS 노치 디바이스 SafeArea 적용
- [ ] iOS 다이내믹 아일랜드 SafeArea 적용
- [ ] iOS 비노치 디바이스 SafeArea 적용
- [ ] Android 제스처 네비게이션 처리
- [ ] Android 3버튼 네비게이션 처리

#### 기능 검증 - 키보드
- [ ] 키보드 표시 시 레이아웃 조정
- [ ] 키보드 숨김 시 레이아웃 복원
- [ ] padding/resize/position 회피 전략

#### 기능 검증 - 터치 타겟
- [ ] 최소 44pt 터치 타겟 검증
- [ ] hitSlop 자동 확장

#### 기능 검증 - Bottom Tab
- [ ] Bottom Tab 기본 렌더링
- [ ] 스크롤 시 숨김/표시
- [ ] SafeArea 통합

#### 기능 검증 - 셸 토큰
- [ ] 6개 모바일 셸 토큰 구현
- [ ] getMobileShellToken() 동작
- [ ] getAllMobileShellTokens() 동작
