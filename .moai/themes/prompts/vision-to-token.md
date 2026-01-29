# Vision-to-Token Analysis Prompt v2.1

> Gemini Vision을 사용해 레퍼런스 스크린샷에서 **Visual DNA**를 추출하는 프롬프트
>
> **주의**: 이 프롬프트는 순수 비주얼 토큰만 추출합니다. 레이아웃/컴포넌트 구성은 코딩 에이전트가 기획에서 별도로 추론합니다.

---

## 관심사 분리

```
🎨 이 프롬프트가 추출하는 것 (Visual DNA)
├── 색상 팔레트
├── 타이포그래피 스타일
├── 간격/밀도
├── 그림자/깊이
├── 모션 특성
├── 모서리 스타일
├── State Layer
└── Effects (blur, gradient, glassmorphism)

📐 별도로 추론되는 것 (Blueprint)
├── Shell 선택 (sidebar, header 등)
├── Page Layout 선택
├── Section Pattern 선택
├── Component 배치
└── Responsive 설정
```

---

## 사용법

1. 레퍼런스 스크린샷 4-8장을 폴더에 모음
2. 이 프롬프트와 함께 Gemini에 전달
3. 결과를 theme-token-schema.json v2.1 형식으로 변환

---

## Phase 1: 무드 & 컨셉 추출 프롬프트

```
당신은 시니어 디자인 시스템 아키텍트입니다.
첨부된 UI 스크린샷들을 분석하여 **Visual DNA**를 추출해주세요.

⚠️ 중요: 레이아웃이나 컴포넌트 구성은 분석하지 마세요. 순수하게 "시각적 스타일"만 분석합니다.

## 분석 항목

### 1. Brand Personality (브랜드 성격)
다음 중 가장 적합한 것을 선택하고 그 이유를 설명하세요:
- professional (전문적, 신뢰감)
- playful (발랄, 친근)
- elegant (우아, 세련)
- bold (대담, 강렬)
- minimal (미니멀, 절제)
- calm (평온, 안정)
- dynamic (역동적, 활기)
- premium (프리미엄, 고급)
- warm (따뜻한, 인간적)

### 2. Visual Atmosphere (시각적 분위기)
- 전체적인 무드를 3-5개 키워드로 표현
- 이 디자인을 보면 떠오르는 감정이나 상황
- 타겟 사용자층 추정

### 3. Color Analysis (색상 분석)
- Primary Color: 가장 눈에 띄는 브랜드 색상 (OKLCH 또는 HEX)
- Secondary Colors: 보조 색상들
- Accent Color: CTA 버튼, 하이라이트 색상
- Neutral Tone: 순수 회색 vs 따뜻한 회색 vs 차가운 회색
- 색상 간 대비 수준 (low/medium/high)

### 4. Typography Feeling (타이포그래피 느낌)
- 헤딩: 굵기, 느낌 (강렬/우아/친근)
- 본문: 가독성 스타일
- 자간: 넓은지 좁은지
- 전체적인 타이포 무드

### 5. Spatial Rhythm (공간 리듬)
- 밀도: compact / comfortable / spacious
- 여백 활용 스타일
- 그리드 느낌

### 6. Shape Language (형태 언어)
- Border Radius: 각진 vs 둥근 vs 완전 둥근 (pill)
- 버튼 스타일: 각진/살짝 둥근/필 형태
- 카드 스타일

### 7. Depth & Surface (깊이와 표면)
- 그림자 사용: 없음/미묘/뚜렷
- Glassmorphism 사용 여부
- 레이어링 스타일
- 그림자 색상 톤 (중성/따뜻함/차가움)

### 8. Effects (시각 효과)
- Blur 사용 여부 및 강도
- Gradient 사용 여부
- Overlay 스타일
- Backdrop filter 사용 여부

### 9. Motion Expectation (예상 모션)
- 전환 속도: 빠름/표준/느긋
- 예상되는 인터랙션 스타일
- 애니메이션 무드

## 출력 형식

위 분석을 바탕으로 다음 JSON 형식으로 출력해주세요:

{
  "designDNA": {
    "brandTone": "calm",
    "moodKeywords": ["serene", "breathable", "mindful", "soft", "organic"],
    "targetEmotion": "사용자가 휴식을 취하며 마음의 평화를 찾는 느낌",
    "visualAtmosphere": "안개 낀 아침의 고요한 숲, 부드러운 빛이 스며드는 느낌"
  },
  "colorAnalysis": {
    "primary": { "l": 0.7, "c": 0.1, "h": 170 },
    "secondary": { "l": 0.6, "c": 0.08, "h": 200 },
    "accent": { "l": 0.65, "c": 0.15, "h": 45 },
    "neutralTone": "warm",
    "contrastLevel": "medium"
  },
  "typographyFeel": {
    "headingWeight": "light-to-regular",
    "bodyReadability": "relaxed",
    "letterSpacingTendency": "slightly-wide",
    "overallMood": "calm-and-approachable"
  },
  "spatialRhythm": {
    "density": "spacious",
    "whitespaceUsage": "generous",
    "breathingRoom": "high"
  },
  "shapeLanguage": {
    "cornerStyle": "very-rounded",
    "buttonShape": "pill",
    "cardStyle": "soft-elevated"
  },
  "depthSurface": {
    "shadowIntensity": "subtle",
    "shadowTone": "warm",
    "layeringStyle": "floating-cards"
  },
  "effects": {
    "useGlassmorphism": true,
    "useBackdropBlur": true,
    "blurIntensity": "medium",
    "useGradient": true,
    "gradientStyle": "soft-diagonal"
  },
  "motionExpectation": {
    "transitionSpeed": "slow-deliberate",
    "easingStyle": "smooth-decelerate",
    "animationMood": "gentle-breathing"
  }
}
```

---

## Phase 2: 정성적 → 정량적 매핑 프롬프트

```
이제 Phase 1에서 추출한 designDNA를 Tekton Theme Token Schema v2.1로 변환해주세요.

## 매핑 규칙

### brandTone → stateLayer
- calm/minimal: hover 0.06, pressed 0.10 (더 미묘하게)
- bold/dynamic: hover 0.10, pressed 0.16 (더 뚜렷하게)
- professional: 기본값 (0.08, 0.12)

### spatialRhythm.density → density.mode
- "compact" → scale: 0.875
- "comfortable" → scale: 1.0
- "spacious" → scale: 1.25

### cornerStyle → border.radius
- "sharp" → lg: "4px"
- "slightly-rounded" → lg: "8px"
- "very-rounded" → lg: "16px"
- "pill" → button radius: "full" (9999px)

### shadowIntensity → elevation.level
- "none" → level.1: "none"
- "subtle" → level.1: "0 2px 8px rgba(0,0,0,0.04)"
- "medium" → level.1: "0 2px 4px rgba(0,0,0,0.1)"
- "strong" → level.1: "0 4px 8px rgba(0,0,0,0.15)"

### shadowTone → elevation.color
- "neutral" → rgba(0,0,0,...)
- "warm" → rgba(120,80,40,...)
- "cool" → rgba(40,60,120,...)

### transitionSpeed → motion.duration
- "instant" → standard: "100ms"
- "quick" → standard: "150ms"
- "normal" → standard: "200ms"
- "slow-deliberate" → standard: "300ms", deliberate: "500ms"

### effects → effects tokens
useGlassmorphism: true일 경우:
```json
{
  "effects": {
    "glassmorphism": {
      "enabled": true,
      "background": "rgba(255, 255, 255, 0.7)",
      "blur": "16px",
      "border": "1px solid rgba(255, 255, 255, 0.2)"
    }
  }
}
```

useGradient: true일 경우:
```json
{
  "effects": {
    "gradient": {
      "primary": "linear-gradient(135deg, oklch(...) 0%, oklch(...) 100%)",
      "surface": "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))"
    }
  }
}
```

## 출력

위 매핑 규칙을 적용하여 완전한 theme-token-schema.json v2.1을 생성해주세요.
@.moai/schemas/theme-token-schema.json 스키마를 준수해야 합니다.

⚠️ layout 섹션은 포함하지 마세요. Visual DNA만 출력합니다.
```

---

## Phase 3: 검증 프롬프트

```
생성된 테마 토큰이 원본 레퍼런스 스크린샷의 느낌을 잘 표현하는지 검증해주세요.

검증 체크리스트:
1. [ ] 색상이 원본과 유사한가?
2. [ ] 여백/밀도가 일치하는가?
3. [ ] 그림자/깊이감이 맞는가?
4. [ ] 모서리 스타일이 일치하는가?
5. [ ] 전체적인 무드가 유지되는가?
6. [ ] Glassmorphism/Gradient 등 효과가 반영되었는가?
7. [ ] 모션 특성이 브랜드 톤과 일치하는가?

불일치하는 부분이 있다면 수정 제안을 해주세요.
```

---

## 실행 예시

### Input
```
폴더: .moai/themes/references/calm-wellness/
├── 01-landing.png      (Calm 앱 랜딩)
├── 02-meditation.png   (명상 화면)
├── 03-player.png       (오디오 플레이어)
└── 04-settings.png     (설정 화면)
```

### Gemini 호출
```bash
# Claude Code에서 MCP 도구로 호출하거나
# 직접 Gemini API 호출

gemini-vision analyze \
  --images ".moai/themes/references/calm-wellness/*.png" \
  --prompt ".moai/themes/prompts/vision-to-token.md" \
  --output ".moai/themes/generated/calm-wellness-v2.json"
```

### Output
완전한 Theme Token Schema v2.1 JSON 파일 (레이아웃 제외)

---

## 폴더 구조 권장사항

레퍼런스 스크린샷 수집 시:

```
references/{theme-name}/
├── _mood.md            # (선택) 수동 무드 설명
├── 01-landing.png      # 첫인상 (색상, 브랜딩)
├── 02-main-feature.png # 핵심 기능 화면
├── 03-detail.png       # 상세/디테일 화면
├── 04-form.png         # 폼/입력 화면
├── 05-list.png         # 리스트/그리드 화면
├── 06-components.png   # 버튼, 카드 등 컴포넌트
└── 07-dark-mode.png    # (있다면) 다크모드
```

**권장 이미지 수**: 4-8장
**권장 해상도**: 1x 또는 2x (너무 크면 토큰 낭비)
**포함해야 할 것**: 색상, 타이포, 간격, 컴포넌트가 잘 보이는 화면

---

## 파이프라인 요약

```
┌─────────────────────────────────────────────────────────────────┐
│  Vision-to-Token Pipeline v2.1                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📁 레퍼런스 스크린샷 (4-8장)                                    │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────────────────────────────────┐                       │
│  │ Phase 1: 무드 & 컨셉 추출            │                       │
│  │ - Brand Personality                 │                       │
│  │ - Color Analysis                    │                       │
│  │ - Typography Feeling                │                       │
│  │ - Spatial Rhythm                    │                       │
│  │ - Shape Language                    │                       │
│  │ - Depth & Surface                   │                       │
│  │ - Effects (NEW!)                    │                       │
│  │ - Motion Expectation                │                       │
│  └─────────────────────────────────────┘                       │
│       │                                                         │
│       ▼ designDNA JSON                                          │
│  ┌─────────────────────────────────────┐                       │
│  │ Phase 2: 정성적 → 정량적 매핑        │                       │
│  │ - brandTone → stateLayer            │                       │
│  │ - density → spacing scale           │                       │
│  │ - cornerStyle → border.radius       │                       │
│  │ - shadowIntensity → elevation       │                       │
│  │ - effects → effects tokens          │                       │
│  └─────────────────────────────────────┘                       │
│       │                                                         │
│       ▼ Theme Token v2.1 (NO LAYOUT)                           │
│  ┌─────────────────────────────────────┐                       │
│  │ Phase 3: 검증                        │                       │
│  │ - 색상/밀도/그림자/모서리 확인        │                       │
│  │ - 전체 무드 유지 확인                 │                       │
│  │ - Effects 반영 확인                  │                       │
│  └─────────────────────────────────────┘                       │
│       │                                                         │
│       ▼                                                         │
│  📄 완성된 Theme Token JSON (Visual DNA Only)                   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  ⚠️ 레이아웃은 별도 파이프라인에서 처리:                         │
│     기획 설명 → generate-blueprint → Blueprint JSON             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

**Version**: 2.1.0
**Last Updated**: 2026-01-27
**Compatible With**: Gemini 1.5 Pro/Flash, Claude Vision
**Schema Version**: theme-token-schema.json v2.1
