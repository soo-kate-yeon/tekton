---
description: Paddle 결제 연동 워크플로우 - 가입부터 Next.js 연동까지
---

# Paddle 결제 연동 워크플로우

한국 1인 개발자가 Paddle을 이용해 글로벌 SaaS 결제를 연동하는 전체 과정입니다.

## 가입 요건

| 요건            | 설명                                                |
| --------------- | --------------------------------------------------- |
| **SaaS 제품**   | 소프트웨어/SaaS여야 함 (교육 플랫폼, 컨설팅 ❌)     |
| **웹사이트**    | 제품 설명, 가격, Terms, Privacy, Refund Policy 필수 |
| **본인 인증**   | 신분증 + 셀피 촬영                                  |
| **사업자 등록** | 한국 사업자등록증 (개인/법인 가능)                  |

> 승인 소요: 1~2주 (보완 시 최대 6주)

---

## Phase 1: Paddle 계정 설정

### 1. 계정 생성

```
https://login.paddle.com/signup
```

### 2. 웹사이트 인증 (필수 페이지)

- ✅ Landing Page (서비스 설명)
- ✅ Pricing Page
- ✅ `/terms` - Terms & Conditions
- ✅ `/privacy` - Privacy Policy
- ✅ `/refund` - Refund Policy
- ✅ Contact 정보

### 3. 본인/사업자 인증

- 신분증 업로드 + 실시간 셀피
- 사업자등록증 (필요시)

### 4. 상품 & 가격 설정

```
Paddle Dashboard → Catalog → Products → Create Product
Paddle Dashboard → Catalog → Prices → Create Price
```

---

## Phase 2: Next.js 연동

### 5. 환경 변수 설정

```bash
# .env.local
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=your_client_token
NEXT_PUBLIC_PADDLE_SELLER_ID=your_seller_id
PADDLE_API_KEY=your_api_key
PADDLE_WEBHOOK_SECRET=your_webhook_secret
```

### 6. Paddle.js 초기화

```tsx
// hooks/usePaddle.ts
'use client';
import { useEffect, useState } from 'react';

export function usePaddle() {
  const [paddle, setPaddle] = useState<typeof window.Paddle | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.onload = () => {
      window.Paddle.Initialize({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
        environment: 'sandbox', // production 배포 시 제거
      });
      setPaddle(window.Paddle);
    };
    document.body.appendChild(script);
  }, []);

  return paddle;
}
```

### 7. 체크아웃 버튼

```tsx
// components/PricingButton.tsx
'use client';
import { usePaddle } from '@/hooks/usePaddle';

interface PricingButtonProps {
  priceId: string;
  userEmail?: string;
}

export function PricingButton({ priceId, userEmail }: PricingButtonProps) {
  const paddle = usePaddle();

  const handleCheckout = () => {
    paddle?.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: userEmail ? { email: userEmail } : undefined,
      settings: {
        displayMode: 'overlay',
        theme: 'dark',
        locale: 'ko',
      },
    });
  };

  return <button onClick={handleCheckout}>구독하기</button>;
}
```

### 8. Webhook 엔드포인트

```ts
// app/api/webhooks/paddle/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('paddle-signature');

  // 서명 검증
  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);

  switch (event.event_type) {
    case 'subscription.created':
      await handleSubscriptionCreated(event.data);
      break;
    case 'subscription.updated':
      await handleSubscriptionUpdated(event.data);
      break;
    case 'subscription.canceled':
      await handleSubscriptionCanceled(event.data);
      break;
    case 'transaction.completed':
      await handleTransactionCompleted(event.data);
      break;
  }

  return NextResponse.json({ received: true });
}

function verifySignature(body: string, signature: string | null): boolean {
  if (!signature) return false;
  const hmac = crypto.createHmac('sha256', process.env.PADDLE_WEBHOOK_SECRET!);
  hmac.update(body);
  return signature === `h1=${hmac.digest('hex')}`;
}
```

---

## Phase 3: 테스트 & 런칭

### 9. Sandbox 테스트

```
Paddle Dashboard → Developer Tools → Sandbox
```

- 테스트 카드: `4242 4242 4242 4242`
- 만료일: 미래 아무 날짜
- CVC: 아무 숫자 3자리

### 10. Production 전환

1. `environment: 'sandbox'` 제거
2. 환경 변수를 Production 키로 변경
3. Webhook URL을 Production URL로 업데이트

---

## 권장 프로젝트 구조

```
app/
├── api/webhooks/paddle/route.ts
├── pricing/page.tsx
└── layout.tsx
components/
├── pricing/
│   ├── PricingCard.tsx
│   └── PricingButton.tsx
└── subscription/
    └── SubscriptionStatus.tsx
hooks/
└── usePaddle.ts
lib/paddle/
├── client.ts
└── server.ts
types/
└── paddle.d.ts
```

---

## 타임라인

| 단계               | 소요 시간    |
| ------------------ | ------------ |
| Paddle 가입 & 승인 | 1~2주        |
| 상품/가격 설정     | 0.5일        |
| Paddle.js 연동     | 1일          |
| Webhook 구현       | 1일          |
| 테스트             | 1~2일        |
| **총 예상**        | **약 2~3주** |
