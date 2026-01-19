#!/bin/bash
# Seed 7 Style Archetypes

API="http://localhost:8000/api/v2/presets"

# 1. SaaS Modern (Notion/Linear)
curl -s -X POST "$API" -H "Content-Type: application/json" -d '{
  "name": "SaaS Modern",
  "category": "productivity",
  "description": "Clean, information-dense UI for productivity and SaaS applications",
  "one_line_definition": "정보 밀도 높고, 군더더기 없는 생산성 도구",
  "reference_style": "Notion, Linear",
  "config": {
    "colors": {
      "background": "#FFFFFF",
      "surface": "#F7F7F5",
      "border": "#E5E5E3",
      "text-primary": "#37352F",
      "text-secondary": "#9B9A97",
      "accent": "#2383E2"
    },
    "typography": {
      "font-family": "Inter, -apple-system, sans-serif",
      "font-size-base": "14px",
      "line-height": "1.5",
      "heading-weight": "600"
    },
    "spacing": { "unit": "4px", "page-padding": "96px" },
    "radius": "4px",
    "shadow": "0 1px 2px rgba(0,0,0,0.04)"
  },
  "principles": [
    "밀도: 정보가 빽빽해야 한다. 여백은 구분용으로만 사용.",
    "곡률: 모든 radius는 4px. 예외 없음.",
    "그림자: 극도로 미세하거나 없음. 깊이보다 테두리로 구분.",
    "애니메이션: 150ms 이하. 바운스 효과 금지.",
    "아이콘: Outline 스타일만. Filled는 선택된 상태에만.",
    "버튼: Ghost 또는 Subtle 스타일 우선. Primary 버튼은 드물게."
  ],
  "component_rules": {
    "Button": { "height": "28px", "padding": "0 8px", "font-size": "13px" },
    "Input": { "height": "32px", "border": "1px solid #E5E5E3" },
    "Card": { "border": "1px solid #E5E5E3", "radius": "4px", "shadow": "none" },
    "Modal": { "max-width": "480px", "padding": "24px" }
  },
  "forbidden_patterns": [
    "rounded-xl, rounded-full (버튼에)",
    "shadow-lg, shadow-xl",
    "animate-bounce, animate-pulse",
    "그라데이션 배경"
  ],
  "tags": ["productivity", "saas", "notion", "linear", "clean"]
}'

echo ""

# 2. Dynamic Fitness (Nike)
curl -s -X POST "$API" -H "Content-Type: application/json" -d '{
  "name": "Dynamic Fitness",
  "category": "sports",
  "description": "Bold and dynamic UI with high energy and movement",
  "one_line_definition": "대담하고 역동적이며, 움직임을 느끼게 하는 UI",
  "reference_style": "Nike",
  "config": {
    "colors": {
      "background": "#111111",
      "surface": "#1A1A1A",
      "text-primary": "#FFFFFF",
      "text-secondary": "#8D8D8D",
      "accent": "#FF5000"
    },
    "typography": {
      "font-family": "Helvetica Neue, Futura, sans-serif",
      "font-size-heading": "48px",
      "font-weight-heading": "900",
      "text-transform": "uppercase",
      "letter-spacing": "-0.02em"
    },
    "spacing": { "unit": "8px", "section-gap": "120px" },
    "radius": "0px",
    "shadow": "none"
  },
  "principles": [
    "대담함: 헤딩은 크게. 48px 이상.",
    "곡률: radius 0px. 모든 모서리는 직각.",
    "색상: 어두운 배경 + 강렬한 악센트(오렌지/레드).",
    "타이포: 대문자 우선. 자간은 타이트하게.",
    "여백: 섹션 사이 넉넉하게. 120px 이상.",
    "이미지: 풀 블리드. 테두리/카드 없이 화면 전체.",
    "애니메이션: 빠르고 날카로움. 300ms, ease-out."
  ],
  "component_rules": {
    "Button": { "shape": "직사각형", "text-transform": "uppercase", "size": "large" },
    "Card": { "background": "none", "style": "이미지 + 텍스트 오버레이" },
    "Hero": { "size": "full-screen", "background": "video/image" },
    "Navigation": { "position": "fixed", "background": "transparent → dark on scroll" }
  },
  "forbidden_patterns": [
    "rounded-md, rounded-lg (모든 곳)",
    "밝은 배경 (#FFFFFF)",
    "가는 폰트 (font-weight < 600)",
    "소문자만 사용"
  ],
  "tags": ["sports", "fitness", "nike", "bold", "dark", "athletic"]
}'

echo ""

# 3. Premium Editorial (NYTimes)
curl -s -X POST "$API" -H "Content-Type: application/json" -d '{
  "name": "Premium Editorial",
  "category": "media",
  "description": "Elegant and airy magazine-style UI focused on reading",
  "one_line_definition": "우아하고 공기감 있는, 읽기에 집중하는 매거진 UI",
  "reference_style": "New York Times",
  "config": {
    "colors": {
      "background": "#FAFAFA",
      "surface": "#FFFFFF",
      "text-primary": "#121212",
      "text-secondary": "#666666",
      "accent": "#567B95"
    },
    "typography": {
      "font-family-heading": "Cheltenham, Georgia, serif",
      "font-family-body": "Imperial, Georgia, serif",
      "font-size-heading": "40px",
      "font-size-body": "18px",
      "line-height-body": "1.8"
    },
    "spacing": { "unit": "8px", "content-max-width": "680px", "article-padding": "48px" },
    "radius": "0px",
    "shadow": "none"
  },
  "principles": [
    "여백: 콘텐츠 좌우에 넉넉한 공간. max-width 680px.",
    "타이포: 헤딩은 Serif, 본문도 Serif. 가독성 최우선.",
    "곡률: 0px. 이미지도 직각.",
    "색상: 거의 흑백. 악센트는 차분한 블루/그레이.",
    "밀도: 낮음. 한 화면에 하나의 메시지.",
    "이미지: 풀 너비, 캡션 필수, 사진 작가 크레딧.",
    "애니메이션: 거의 없음. 있어도 페이드만."
  ],
  "component_rules": {
    "Article": { "max-width": "680px", "margin": "auto", "line-height": "1.8" },
    "Image": { "width": "100%", "aspect-ratio": "maintain", "caption": "below" },
    "Heading": { "font-family": "serif", "font-size": "40px", "font-weight": "700" },
    "Quote": { "border-left": "exists", "style": "italic", "indent": "true" }
  },
  "forbidden_patterns": [
    "Sans-serif 헤딩",
    "카드 그리드 레이아웃",
    "버튼 중심 UI",
    "채도 높은 색상"
  ],
  "tags": ["editorial", "magazine", "nytimes", "serif", "reading", "elegant"]
}'

echo ""

# 4. Media Streaming (Netflix/MasterClass)
curl -s -X POST "$API" -H "Content-Type: application/json" -d '{
  "name": "Media Streaming",
  "category": "entertainment",
  "description": "Content-first immersive dark UI with thumbnails as the star",
  "one_line_definition": "콘텐츠 중심, 몰입형 다크 UI. 썸네일이 주인공.",
  "reference_style": "Netflix, MasterClass",
  "config": {
    "colors": {
      "background": "#000000",
      "surface": "#141414",
      "surface-elevated": "#1C1C1C",
      "border": "#2A2A2A",
      "text-primary": "#FFFFFF",
      "text-secondary": "#A3A3A3",
      "accent": "#E50914",
      "progress": "#E50914"
    },
    "typography": {
      "font-family": "-apple-system, BlinkMacSystemFont, Helvetica Neue, sans-serif",
      "font-size-hero": "32px",
      "font-size-title": "16px",
      "font-size-body": "14px",
      "font-weight-hero": "700",
      "line-height": "1.4"
    },
    "spacing": { "unit": "8px", "card-gap": "12px", "section-padding": "16px" },
    "radius": { "thumbnail": "4px", "card": "8px", "button": "4px" },
    "shadow": "none"
  },
  "principles": [
    "배경: 순수 검정(#000000). 콘텐츠가 빛나야 함.",
    "콘텐츠 우선: 썸네일/이미지가 UI의 주인공. 크롬은 최소화.",
    "곡률: 썸네일 4px, 카드 8px. 과도한 둥글림 금지.",
    "Duration Badge: 썸네일 좌하단에 반투명 검정 배경 + 흰 텍스트.",
    "Progress Bar: 카드 하단에 빨간색(#E50914).",
    "애니메이션: 호버 시 스케일 업(1.05) 또는 밝기 증가."
  ],
  "component_rules": {
    "Thumbnail": { "aspect-ratio": "16/9 or 2/3", "radius": "4px", "object-fit": "cover" },
    "Card": { "background": "#141414", "padding": "12px", "radius": "8px" },
    "DurationBadge": { "position": "absolute bottom-left", "background": "rgba(0,0,0,0.7)" },
    "ProgressBar": { "height": "3px", "background": "#E50914" },
    "PlayButton": { "shape": "circle", "background": "white", "icon": "black triangle" }
  },
  "forbidden_patterns": [
    "밝은 배경 (#FFFFFF, #F5F5F5)",
    "rounded-xl, rounded-2xl (과도한 둥글림)",
    "컬러풀한 그라데이션 배경",
    "두꺼운 border (1px 초과)",
    "그림자 (shadow-sm, shadow-md 등)"
  ],
  "tags": ["streaming", "media", "netflix", "dark", "content", "immersive"]
}'

echo ""

# 5. Calm Wellness (Open App)
curl -s -X POST "$API" -H "Content-Type: application/json" -d '{
  "name": "Calm Wellness",
  "category": "wellness",
  "description": "Calm and meditative atmosphere with blur effects and warm gradients",
  "one_line_definition": "차분하고 명상적인 분위기. Blur와 따뜻한 그라데이션이 중심.",
  "reference_style": "Open, Calm, Headspace",
  "config": {
    "colors": {
      "background": "#0A0A0A",
      "surface": "#141414",
      "surface-blur": "rgba(20, 20, 20, 0.7)",
      "text-primary": "#FFFFFF",
      "text-secondary": "#9CA3AF",
      "accent-warm": "#D97706",
      "accent-teal": "#0D9488",
      "category-breathe": "#0D9488",
      "category-move": "#8B5CF6"
    },
    "typography": {
      "font-family": "-apple-system, SF Pro Display, sans-serif",
      "font-size-hero": "28px",
      "font-size-section": "13px",
      "font-weight-hero": "400",
      "letter-spacing-section": "0.05em",
      "text-transform-section": "uppercase"
    },
    "spacing": { "unit": "8px", "card-gap": "8px", "section-gap": "32px" },
    "radius": { "card": "8px", "button": "999px" },
    "effects": { "blur": "blur(40px)", "gradient-overlay": "linear-gradient(transparent, rgba(0,0,0,0.8))" }
  },
  "principles": [
    "배경: 순수 검정 + 따뜻한 톤의 Blur 이미지가 배경.",
    "Blur Effect: 히어로 섹션에서 이미지를 blur(40px)로 배경에 깔기.",
    "따뜻한 색감: 앰버, 골드, 어스톤 계열 이미지.",
    "Section Title: UPPERCASE, letter-spacing 넓게, 작은 폰트(13px).",
    "Category Label: 컬러로 구분 (Teal=Breathe, Purple=Move).",
    "여백: 섹션 사이 넉넉하게 (32px+). 숨 쉴 공간."
  ],
  "component_rules": {
    "Hero": { "size": "full-screen", "background": "blur image", "title-position": "bottom" },
    "SectionHeader": { "text-transform": "uppercase", "font-size": "13px", "letter-spacing": "0.05em" },
    "ProgramCard": { "aspect-ratio": "4/3", "overlay": "title on image", "radius": "8px" },
    "ListItem": { "thumbnail": "64x64 square", "category-label": "colored" },
    "PlayButton": { "shape": "circle", "border": "2px solid white", "background": "transparent" }
  },
  "forbidden_patterns": [
    "밝은 배경 (#FFFFFF)",
    "날카로운 그림자 (drop-shadow)",
    "굵은 폰트 weight (700+)",
    "채도 높은 원색",
    "빽빽한 그리드 (한 줄에 3개 이상)",
    "딱딱한 직각 (radius: 0px)"
  ],
  "tags": ["wellness", "meditation", "calm", "blur", "warm", "mindful"]
}'

echo ""

# 6. Korean Fintech (Toss)
curl -s -X POST "$API" -H "Content-Type: application/json" -d '{
  "name": "Korean Fintech",
  "category": "finance",
  "description": "Friendly and trustworthy financial UI with large radius and card-centered layout",
  "one_line_definition": "친근하고 신뢰감 있는 금융 UI. 큰 Radius와 카드 중심 구성.",
  "reference_style": "Toss",
  "config": {
    "colors": {
      "background": "#F4F4F4",
      "surface": "#FFFFFF",
      "surface-secondary": "#F8F9FA",
      "border": "#E5E8EB",
      "text-primary": "#191F28",
      "text-secondary": "#8B95A1",
      "accent": "#3182F6",
      "accent-light": "#E8F3FF",
      "success": "#00C853",
      "error": "#F04452"
    },
    "typography": {
      "font-family": "Pretendard, -apple-system, sans-serif",
      "font-size-display": "28px",
      "font-size-headline": "20px",
      "font-size-body": "15px",
      "font-weight-bold": "700",
      "line-height": "1.5"
    },
    "spacing": { "unit": "8px", "card-padding": "20px", "section-gap": "12px" },
    "radius": { "card": "16px", "button": "12px", "chip": "8px" },
    "shadow": { "card": "0 2px 8px rgba(0,0,0,0.04)" }
  },
  "principles": [
    "배경: 밝은 그레이(#F4F4F4). 흰색 카드가 떠 보이게.",
    "카드: 흰색 배경, 큰 radius(16px), 얇은 그림자.",
    "Radius: 기본 16px. 버튼 12px, 칩 8px. 날카로운 모서리 금지.",
    "타이포: Pretendard. 숫자는 크고 굵게.",
    "색상: 블루(#3182F6)는 액션/링크에만.",
    "금액 표시: 큰 폰트(28px), 굵게, 단위(원)는 함께.",
    "리스트: 아이콘(왼쪽) + 텍스트(가운데) + 화살표/값(오른쪽)."
  ],
  "component_rules": {
    "Card": { "background": "white", "radius": "16px", "padding": "20px", "shadow": "subtle" },
    "MoneyDisplay": { "font-size": "28px", "font-weight": "700", "color": "#191F28" },
    "ListItem": { "height": "56px", "structure": "icon(40x40) + text + chevron/value" },
    "IconContainer": { "size": "40x40", "radius": "12px", "background": "pastel" },
    "ButtonPrimary": { "background": "#3182F6", "radius": "12px", "height": "56px" },
    "Toggle": { "style": "iOS", "on-color": "#3182F6" }
  },
  "forbidden_patterns": [
    "검은 배경",
    "작은 radius (4px 이하)",
    "border-only 버튼 (Outline 버튼)",
    "bold 아닌 금액 표시",
    "아이콘 없는 리스트 아이템",
    "진한 그림자 (shadow-lg)"
  ],
  "tags": ["fintech", "finance", "toss", "friendly", "cards", "korean"]
}'

echo ""

# 7. Warm Humanist (Pi/Claude)
curl -s -X POST "$API" -H "Content-Type: application/json" -d '{
  "name": "Warm Humanist",
  "category": "conversational",
  "description": "Warm and human-centered conversational UI with serif fonts and cream background",
  "one_line_definition": "따뜻하고 인간적인 대화형 UI. Serif 서체와 크림색 배경.",
  "reference_style": "Pi, Claude",
  "config": {
    "colors": {
      "background": "#FAF9F6",
      "surface": "#FFFFFF",
      "surface-warm": "#F5F0E8",
      "border": "#E8E4DC",
      "text-primary": "#1A1A1A",
      "text-secondary": "#6B6B6B",
      "accent-warm": "#DA7756",
      "button-dark": "#1A1A1A"
    },
    "typography": {
      "font-family-serif": "Tiempos, Georgia, Times New Roman, serif",
      "font-family-sans": "Soehne, -apple-system, sans-serif",
      "font-size-display": "32px",
      "font-size-body": "17px",
      "font-weight-display": "500",
      "line-height-prose": "1.7"
    },
    "spacing": { "unit": "8px", "prose-max-width": "600px", "section-gap": "32px" },
    "radius": { "button": "999px", "input": "16px", "card": "20px", "chat-bubble": "20px" },
    "shadow": "none"
  },
  "principles": [
    "배경: 따뜻한 크림/베이지(#FAF9F6). 순수 흰색 금지.",
    "타이포: 헤딩과 본문에 Serif 사용. 클래식하고 인간적인 느낌.",
    "Prose: 긴 텍스트는 line-height 1.7, max-width 600px.",
    "버튼: pill 모양(radius: 999px). 검정 또는 베이지 배경.",
    "Input: 따뜻한 베이지 배경, 큰 radius(16px).",
    "그림자: 사용 안함. 배경색 차이로 구분.",
    "애니메이션: 부드럽고 느리게. 300ms+, ease-out.",
    "여백: 넉넉하게. 숨 쉴 공간. 중앙 정렬 많이 사용."
  ],
  "component_rules": {
    "Heading": { "font-family": "serif", "font-size": "32px", "font-weight": "500" },
    "BodyText": { "font-family": "serif", "font-size": "17px", "line-height": "1.7", "max-width": "600px" },
    "ButtonPrimary": { "background": "#1A1A1A", "text": "white", "radius": "999px", "height": "52px" },
    "ButtonSecondary": { "background": "#F5F0E8", "text": "#1A1A1A", "radius": "999px" },
    "Input": { "background": "#F5F0E8", "border": "none", "radius": "16px", "padding": "16px" },
    "ChatBubbleAI": { "background": "#F5F0E8", "radius": "20px" },
    "ChatBubbleUser": { "background": "#FFFFFF", "border": "1px #E8E4DC", "radius": "20px" }
  },
  "forbidden_patterns": [
    "순수 흰색 배경 (#FFFFFF 전체)",
    "Sans-serif만 사용",
    "직각 버튼 (radius < 12px)",
    "진한 그림자",
    "채도 높은 원색",
    "복잡한 아이콘",
    "빽빽한 UI 밀도",
    "짧은 line-height (1.5 이하)"
  ],
  "tags": ["conversational", "ai", "claude", "pi", "warm", "humanist", "serif"]
}'

echo ""
echo "✅ All 7 style archetypes seeded!"
