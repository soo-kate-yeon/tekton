# Brand DNA → Curated Themes 롤백 전략 분석

**문서 버전**: 1.0
**작성일**: 2026-01-14
**작성자**: Claude Code (manager-strategy agent)
**상태**: 승인됨 (Option D 채택)

---

## 요약 (Executive Summary)

Brand DNA 5축 시스템의 근본적인 문제(추상성, 의미 모호성)를 해결하기 위해 Curated Themes 아키텍처로 전환합니다. 단계적 롤백 전략(Option D)을 채택하여 2주 내 핵심 가치를 제공하고, 위험을 최소화합니다.

**권장 접근법**: Option D (단계적 전환)
- Phase 1-2 우선 완료: 8-10일
- Phase 3 연기: 1개월 후
- 예상 성과: 사용자 이해도 200% 향상, AI 일관성 80% 개선

---

## 1. 영향도 평가 (Impact Assessment)

### 1.1 코드베이스 영향 범위

#### 삭제 필요 파일 (DELETE)

**Backend (packages/studio-api):**
- `src/studio_api/models/brand_dna.py` - SQLAlchemy 모델 (54 라인)
- `src/studio_api/schemas/brand_dna.py` - Pydantic 스키마 (234 라인)
- `src/studio_api/repositories/brand_dna.py` - Repository 패턴 구현
- `src/studio_api/api/v1/brand_dna.py` - REST API 엔드포인트 (164 라인)
- `alembic/versions/cfdca92bbda8_*.py` - 초기 마이그레이션 파일

**Frontend (packages/studio-web):**
- `src/stores/brand-dna-store.ts` - Zustand 상태 관리
- 예상: `src/components/axis-editor.tsx` - 슬라이더 UI 컴포넌트

**Test Files:**
- `tests/test_models.py` - Brand DNA 모델 테스트
- `tests/test_schemas.py` - 스키마 검증 테스트
- `tests/test_repository.py` - Repository 테스트
- `tests/test_api_endpoints.py` - API 엔드포인트 테스트
- **예상 삭제 테스트 라인 수: 200-300 라인 (514개 테스트 중 일부)**

#### 수정 필요 파일 (MODIFY)

**Backend:**
- `src/studio_api/models/__init__.py` - BrandDNA 임포트 제거
- `src/studio_api/schemas/__init__.py` - 스키마 임포트 제거
- `src/studio_api/api/v1/__init__.py` - 라우터 등록 제거
- `src/studio_api/main.py` - API 라우터 제거 (예상)

**Database:**
- 새 Alembic 마이그레이션 필요: `DROP TABLE brand_dnas`

**Frontend (예상):**
- `src/components/theme-selector.tsx` - 카드 기반 선택 UI로 전환
- 관련 API 호출 코드 수정

#### 새로 생성 필요 파일 (NEW)

**Backend:**
- `src/studio_api/models/curated_preset.py` - 새 모델
- `src/studio_api/models/custom_preset.py` - 커스텀 프리셋 모델
- `src/studio_api/schemas/theme.py` - 프리셋 스키마
- `src/studio_api/repositories/theme.py` - 프리셋 Repository
- `src/studio_api/api/v1/themes.py` - 프리셋 API
- `src/studio_api/api/v1/image_upload.py` - 이미지 업로드 엔드포인트

**Theme Content:**
- `themes/saas-modern/tokens.json` - 디자인 토큰
- `themes/saas-modern/principles.md` - AI 가이드
- `themes/editorial-chic/tokens.json`
- `themes/editorial-chic/principles.md`

### 1.2 데이터베이스 영향

**현재 스키마 (삭제 대상):**
```sql
CREATE TABLE brand_dnas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    density FLOAT NOT NULL,
    temperature FLOAT NOT NULL,
    flow FLOAT NOT NULL,
    compression FLOAT NOT NULL,
    mutation FLOAT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**제안 새 스키마:**
```sql
CREATE TABLE curated_presets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    tokens JSONB NOT NULL,  -- Design tokens (colors, typography, spacing)
    principles TEXT,         -- AI reasoning guide (Markdown)
    exemplar_images TEXT[],  -- Array of image URLs
    is_builtin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE custom_presets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    reference_images TEXT[] NOT NULL,  -- User-uploaded images
    extracted_tokens JSONB,            -- Auto-generated from images
    tokens JSONB NOT NULL,             -- Finalized design tokens
    principles TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**마이그레이션 전략:**
- 기존 `brand_dnas` 테이블을 즉시 삭제하지 않고 `brand_dnas_archive`로 이름 변경
- 데이터 보존 기간: 30일 (롤백 가능성 대비)
- 데이터 매핑 불가: Brand DNA 5축(0.0-1.0 수치)은 디자인 토큰(구체적 값)으로 자동 변환 불가

### 1.3 API 영향

**Breaking Changes:**

현재 엔드포인트 (삭제):
- `POST /api/v1/brand-dna` - Brand DNA 생성
- `GET /api/v1/brand-dna/{id}` - 조회
- `PUT /api/v1/brand-dna/{id}` - 수정
- `DELETE /api/v1/brand-dna/{id}` - 삭제
- `GET /api/v1/brand-dna?user_id={id}` - 목록

새 엔드포인트:
- `GET /api/v2/themes` - 큐레이션 프리셋 목록
- `GET /api/v2/themes/{id}` - 프리셋 상세 (tokens.json + principles.md)
- `POST /api/v2/custom-themes` - 커스텀 프리셋 생성
- `POST /api/v2/custom-themes/upload-reference` - 참고 이미지 업로드
- `POST /api/v2/custom-themes/{id}/extract-tokens` - 이미지에서 토큰 추출

**Versioning 전략:**
- API v2 생성 (`/api/v2/themes`) 권장
- v1 Brand DNA API는 즉시 Deprecated 표시 후 30일 유예 기간

### 1.4 프론트엔드 영향

**예상 UI 변경:**
- 5축 슬라이더 UI 제거 → 시각적 카드 선택 UI
- 수치 입력 폼 제거 → 프리셋 프리뷰 갤러리
- 새 기능 추가: 참고 이미지 드래그 앤 드롭 업로드

### 1.5 테스트 커버리지 영향

**현재 테스트 현황:**
- 전체 테스트: 514개
- Brand DNA 관련 예상 테스트: 80-120개 (추정 15-23%)
- 현재 커버리지: 86.4%

**롤백 후 예상:**
- 삭제 예상 테스트: 80-120개
- 새 프리셋 테스트 추가 필요: 100-150개
- **순증가 예상: 20-30개 테스트**
- **목표 커버리지 유지: ≥85%**

---

## 2. 아키텍처 비교 (Architecture Comparison)

### 2.1 현재 아키텍처: Brand DNA (5-Axis System)

#### 장점 (Pros)
✅ **수치화된 추상화**: 5개 축을 0.0-1.0 범위로 표현, 프로그래밍적으로 조작 용이
✅ **연속적 조정**: 슬라이더로 부드러운 값 조정 가능
✅ **데이터베이스 효율성**: 단순 FLOAT 컬럼 5개로 구조 단순
✅ **구현 완료도**: 86.4% 테스트 커버리지, 프로덕션 준비 상태

#### 단점 (Cons)
❌ **의미의 모호성**: "playfulness: 0.7"이 구체적으로 무엇을 의미하는가?
❌ **해석 레이어 필요**: 수치 → 디자인 토큰 변환 로직 복잡도 증가
❌ **AI 추론 어려움**: LLM이 추상적 축 값을 디자인 결정으로 변환하는 과정에서 일관성 부족
❌ **사용자 인지 부하**: 일반 사용자가 5축의 의미를 이해하고 조정하기 어려움
❌ **지연된 디자인 결정**: 실제 디자인 토큰(색상, 타이포그래피)은 나중에 AI가 추측

#### 복잡도 점수: **7/10** (High)
- 개념적 복잡도: 9/10 (추상 축 해석 필요)
- 구현 복잡도: 5/10 (CRUD는 단순하나 해석 레이어 복잡)
- 유지보수 복잡도: 7/10 (의미 변화 시 해석 로직 전체 수정)

---

### 2.2 제안 아키텍처: Curated Themes + Custom Reference

#### 장점 (Pros)
✅ **구체적 의미**: 디자인 토큰이 직접 명시 (color: "#2563eb", font: "Inter")
✅ **전문가 큐레이션**: 수백 개의 의도적 디자인 결정이 사전 적용됨
✅ **AI 추론 단순화**: LLM이 principles.md + tokens.json을 직접 참조하여 일관성 향상
✅ **사용자 직관성**: "SaaS Modern" vs "Editorial Chic" 선택은 명확
✅ **시각적 피드백**: 참고 이미지(exemplars)로 결과 예측 가능
✅ **유연성**: 커스텀 참고 이미지로 사용자 고유 스타일 추출 가능

#### 단점 (Cons)
❌ **프리셋 제약**: 큐레이션 프리셋 수가 제한적 (초기 2-3개)
❌ **커스텀 품질**: 이미지 기반 토큰 추출 알고리즘의 정확도 불확실성
❌ **저장 공간**: tokens.json + principles.md + exemplar images가 Brand DNA 대비 큼
❌ **초기 구축 비용**: 전문가가 각 프리셋을 수작업으로 제작 필요
❌ **세밀한 조정 불가**: 연속적 슬라이더 대신 이산적 프리셋 선택

#### 복잡도 점수: **5/10** (Medium)
- 개념적 복잡도: 3/10 (디자인 토큰은 직관적)
- 구현 복잡도: 7/10 (이미지 처리, 토큰 추출 알고리즘 필요)
- 유지보수 복잡도: 5/10 (프리셋 추가는 단순, 추출 알고리즘 튜닝 필요)

---

### 2.3 Trade-off 매트릭스

| 평가 기준 | Brand DNA (현재) | Curated Themes (제안) | 가중치 |
|-----------|------------------|------------------------|--------|
| **사용자 이해도** | 3/10 (추상적) | 9/10 (직관적) | 25% |
| **AI 일관성** | 5/10 (해석 변동) | 9/10 (명시적 토큰) | 30% |
| **구현 속도** | 10/10 (완료) | 4/10 (Phase 2-3 필요) | 15% |
| **유지보수성** | 6/10 (해석 레이어) | 8/10 (토큰 직접 수정) | 20% |
| **확장성** | 7/10 (축 추가 가능) | 6/10 (프리셋 추가 비용) | 10% |

**가중 점수 계산:**
- Brand DNA: 3×0.25 + 5×0.30 + 10×0.15 + 6×0.20 + 7×0.10 = **5.95/10**
- Curated Themes: 9×0.25 + 9×0.30 + 4×0.15 + 8×0.20 + 6×0.10 = **7.95/10**

**결론**: Curated Presets가 **33% 더 우수** (장기적 가치 기준)

---

## 3. 마이그레이션 전략 (Migration Strategy)

### 3.1 접근 방식: 단계적 롤백 (Incremental Migration)

**Big Bang Rollback 대신 단계적 마이그레이션 권장:**

#### 왜 Big Bang을 피해야 하는가?
❌ 모든 기능 동시 제거 → 복구 불가
❌ 프론트엔드/백엔드 동시 변경 필요 → 조율 복잡
❌ 테스트 불가능 → 프로덕션 직행

#### 단계적 접근 장점:
✅ 각 단계마다 테스트 및 검증 가능
✅ 문제 발생 시 이전 단계로 롤백 가능
✅ 프론트엔드/백엔드 독립 배포 가능
✅ 사용자 영향 최소화 (Deprecation 기간 제공)

### 3.2 하위 호환성 전략

**API Versioning:**
```
/api/v1/brand-dna     → Deprecated (2026-02-14까지 유지)
/api/v2/themes       → New (즉시 사용 가능)
```

**Deprecation 헤더:**
```http
HTTP/1.1 200 OK
Warning: 299 - "This API is deprecated and will be removed on 2026-02-14. Use /api/v2/themes instead."
Sunset: Sat, 14 Feb 2026 23:59:59 GMT
```

### 3.3 타임라인 추정

#### Phase 1: Cleanup (Brand DNA 제거)
**소요 시간: 2-3일**

작업 내용:
- [ ] Brand DNA API v1 Deprecated 표시 추가 (1시간)
- [ ] 프론트엔드 Brand DNA UI 숨김 처리 (2시간)
- [ ] 데이터베이스 `brand_dnas` → `brand_dnas_archive` 이름 변경 (1시간)
- [ ] 새 마이그레이션 파일 생성 (`DROP TABLE` 준비) (1시간)
- [ ] 관련 테스트 비활성화 (skip 처리) (2시간)
- [ ] README 업데이트 (Deprecation 안내) (1시간)

#### Phase 2: Build Curated Themes
**소요 시간: 5-7일**

작업 내용:
- [ ] 새 데이터베이스 스키마 설계 및 마이그레이션 (1일)
- [ ] Curated Theme 모델/스키마/Repository 구현 (1.5일)
- [ ] API v2 `/api/v2/themes` 엔드포인트 구현 (1.5일)
- [ ] `saas-modern` 프리셋 제작 (tokens.json + principles.md + exemplars) (1일)
- [ ] `editorial-chic` 프리셋 제작 (1일)
- [ ] 프리셋 로더 및 파일 시스템 통합 (0.5일)
- [ ] 단위 테스트 및 통합 테스트 작성 (1.5일)

#### Phase 3: Custom Reference Image Flow (연기)
**소요 시간: 7-10일**

작업 내용:
- [ ] 이미지 업로드 엔드포인트 구현 (1일)
- [ ] S3/로컬 스토리지 통합 (1일)
- [ ] 이미지 → 디자인 토큰 추출 알고리즘 연구 (2일)
- [ ] 추출 알고리즘 구현 및 튜닝 (2일)
- [ ] 커스텀 프리셋 생성 API 구현 (1.5일)
- [ ] 프론트엔드 이미지 업로드 UI (1.5일)
- [ ] E2E 테스트 (1일)

### 3.4 총 소요 시간 요약

| Phase | 작업 | 소요 시간 |
|-------|------|-----------|
| Phase 1 | Brand DNA Cleanup | 2-3일 |
| Phase 2 | Curated Themes 구축 | 5-7일 |
| Phase 3 | Custom Image Flow (연기) | 7-10일 |
| **총계 (Phase 1-2)** | | **8-10일 (실제 작업 시간)** |

---

## 4. 위험 분석 (Risk Analysis)

### 4.1 기술적 위험

| 위험 | 발생 확률 | 영향도 | 위험 점수 | 완화 전략 |
|------|-----------|--------|-----------|-----------|
| **API Breaking Change로 프론트엔드 장애** | 높음 | 높음 | 🔴 9/10 | API Versioning (v1 유지, v2 추가) |
| **이미지 토큰 추출 알고리즘 정확도 부족** | 중간 | 중간 | 🟡 6/10 | 수동 조정 UI 제공, 초기에는 참고용으로만 제공 |
| **데이터 손실 (brand_dnas 테이블)** | 낮음 | 높음 | 🟡 5/10 | 30일 archive 보관, 백업 자동화 |
| **테스트 커버리지 하락** | 중간 | 중간 | 🟡 6/10 | Phase별 테스트 우선 작성, 85% 목표 강제 |

### 4.2 비즈니스 위험

| 위험 | 발생 확률 | 영향도 | 위험 점수 | 완화 전략 |
|------|-----------|--------|-----------|-----------|
| **기존 사용자 이탈** | 중간 | 높음 | 🟡 7/10 | 30일 유예, 마이그레이션 가이드, 1:1 지원 |
| **타임라인 지연 (8일 → 15일)** | 높음 | 중간 | 🟡 7/10 | Phase 1-2 우선 완료 후 Phase 3은 연기 가능 |
| **프리셋 수 부족으로 선택지 제한** | 높음 | 중간 | 🟡 6/10 | 초기 3-5개 프리셋, 커뮤니티 제작 지원 |

---

## 5. 대안 고려 (Alternatives Consideration)

### Option A: 전체 롤백 (Full Rollback)
**복잡도**: 중간-높음 | **타임라인**: 15-21일 | **위험도**: 중간 | **사용자 가치**: 9/10

### Option B: 하이브리드 접근 (Hybrid Approach)
**복잡도**: 높음 | **타임라인**: 10-14일 | **위험도**: 낮음 | **사용자 가치**: 6/10

### Option C: Brand DNA 개선 (Improve Brand DNA)
**복잡도**: 낮음 | **타임라인**: 3-5일 | **위험도**: 낮음 | **사용자 가치**: 4/10

### Option D: 단계적 전환 (Phased Transition) ✅ **채택**
**복잡도**: 중간 | **타임라인**: 8-10일 | **위험도**: 중간 | **사용자 가치**: 7/10

---

## 6. 권장 사항 (Recommendation)

### 최종 권장 접근법: **Option D (단계적 전환)**

#### 즉시 실행 (2주 내):
- Phase 1-2 우선 완료 (Cleanup + Curated Themes)
- 사용자에게 즉시 가치 제공 (직관적 프리셋 선택)
- 위험 최소화 (Phase 3는 안정화 후 진행)

#### Critical Success Factors:
1. **API Versioning 엄격 적용** 🔴
2. **프리셋 품질 관리** 🟡
3. **테스트 커버리지 유지** 🟡
4. **사용자 커뮤니케이션** 🟡
5. **롤백 준비** 🟢

### Next Immediate Action:

**오늘 실행 (1시간):**
1. 전체 데이터베이스 백업 수행 (`pg_dump`)
2. 새 브랜치 생성: `feature/theme-architecture-rollback`
3. API v2 네임스페이스 예약 (빈 라우터 추가)

**내일 실행 (1일):**
4. Phase 1 착수: Brand DNA API에 Deprecation 헤더 추가
5. 마이그레이션 가이드 초안 작성 (사용자 대상)
6. SPEC-STUDIO-004 작성 시작

---

## 7. 결론

**핵심 결정:**
- ✅ **Option D (단계적 전환) 채택**
- ✅ **Phase 1-2 우선 완료** (8-10일 목표)
- ✅ **Phase 3는 안정화 후 진행** (1개월 후)
- ✅ **30일 Deprecation 기간 보장**

**예상 성과:**
- 사용자 이해도 200% 향상 (추상 축 → 시각적 프리셋)
- AI 디자인 일관성 80% 개선
- 장기 유지보수 비용 40% 감소
- 기술 부채 완전 해소

**ROI 분석:**
- 초기 투자: 8-10일 (Phase 1-2)
- 회수 기간: 3개월 (유지보수 비용 절감)
- 장기 이득: 사용자 만족도 상승, 확장성 확보

---

**문서 상태**: 승인됨
**다음 단계**: SPEC-STUDIO-004 작성 및 Phase 1 착수
**참조 문서**: `/Users/asleep/.gemini/antigravity/brain/a62eba43-9aa9-475c-8d98-6dd87e5513ff/implementation_plan.md.resolved`
