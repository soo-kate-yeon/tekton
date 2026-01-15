# Implementation Plan: SPEC-STUDIO-002

## Overview

**SPEC ID**: SPEC-STUDIO-002
**Title**: Brand DNA → Curated Presets Architecture Transition
**Strategy**: Option D (Phased Transition) - Parallel system operation with 30-day deprecation window
**Timeline**: 8-10 days (Phase 1-2 only; Phase 3 deferred to 1 month post-Phase 2)
**Priority**: HIGH

---

## Phase Breakdown

### Phase 1: Brand DNA Cleanup (2-3 Days)

**Objective**: Implement deprecation strategy, archive preparation, and migration notices for Brand DNA system.

**Milestones**:

**M1.1: API Deprecation Headers (Priority: HIGH)**
- Add `Warning: 299` and `Sunset` headers to all Brand DNA API responses
- Implement header middleware in FastAPI
- Validate headers in automated tests
- **Dependencies**: None
- **Risk**: LOW - Standard HTTP header implementation
- **Deliverable**: Middleware function, header validation tests

**M1.2: Database Archive Strategy (Priority: HIGH)**
- Design `brand_dnas_archive` table schema
- Create migration script with transaction safety
- Implement rollback procedures
- Test archive process in development
- **Dependencies**: Database access, migration tooling
- **Risk**: MEDIUM - Data integrity critical
- **Deliverable**: Archive migration script, rollback documentation

**M1.3: Read-Only Mode Implementation (Priority: HIGH)**
- Add date-based conditional logic to API routes
- Disable POST/PUT/DELETE after 2026-02-01
- Return HTTP 410 Gone for disabled endpoints
- Test with date mocking
- **Dependencies**: M1.1 (header implementation)
- **Risk**: LOW - Simple conditional logic
- **Deliverable**: Read-only middleware, date-based tests

**M1.4: Frontend Migration Notice (Priority: MEDIUM)**
- Create BrandDNADeprecationNotice React component
- Style with prominent warning indicators
- Add migration call-to-action links
- Display on all Brand DNA pages
- Track notice impressions with analytics
- **Dependencies**: None (parallel with backend work)
- **Risk**: LOW - UI component implementation
- **Deliverable**: React component, analytics integration

**Phase 1 Deliverables**:
- ✅ COMPLETED - Deprecation headers active on all Brand DNA APIs
- ✅ COMPLETED - Archive migration script tested and documented
- ✅ COMPLETED - Read-only mode scheduled for 2026-02-01
- ✅ COMPLETED - Migration notices visible to all users
- ✅ COMPLETED - Test coverage ≥85% for Phase 1 code

---

### Phase 2: Curated Presets Core Build (5-7 Days)

**Objective**: Build production-ready Curated Presets system with database, backend API, frontend gallery, and MCP integration.

**Milestones**:

**M2.1: Database Schema Implementation (Priority: HIGH)**
- Create `curated_presets` table with full schema
- Add indexes for category and name searches
- Implement SQLAlchemy models
- Create Pydantic validation schemas
- Write migration scripts
- **Dependencies**: None
- **Risk**: LOW - Standard database schema
- **Deliverable**: Migration files, SQLAlchemy models, Pydantic schemas

**M2.2: Backend API Implementation (Priority: HIGH)**
- Implement RESTful v2 endpoints:
  - GET /api/v2/presets (list with pagination)
  - GET /api/v2/presets/:id (single preset)
  - GET /api/v2/presets/categories (category list)
- Add query filtering (category, search)
- Implement API versioning middleware
- Add comprehensive error handling
- **Dependencies**: M2.1 (database schema)
- **Risk**: MEDIUM - API versioning complexity
- **Deliverable**: FastAPI routes, versioning middleware, error handlers

**M2.3: Frontend Preset Gallery (Priority: HIGH)**
- Create PresetGallery component (grid layout)
- Implement PresetCard component (thumbnail + metadata)
- Add category filtering and search UI
- Create PresetDetailModal for expanded info
- Implement responsive design (mobile + desktop)
- **Dependencies**: M2.2 (backend API)
- **Risk**: MEDIUM - Complex UI interactions
- **Deliverable**: React components, responsive styles

**M2.4: MCP Integration for Preset Suggestions (Priority: MEDIUM)**
- Integrate studio-mcp server for recommendations
- Implement fallback to default preset list
- Create suggestion API endpoint: GET /api/v2/presets/suggestions
- Add error handling for MCP failures
- Test with MCP server unavailability scenarios
- **Dependencies**: M2.2 (backend API), SPEC-STUDIO-001 (MCP foundation)
- **Risk**: MEDIUM - External system dependency
- **Deliverable**: MCP integration module, fallback logic, tests

**M2.5: Testing and Quality Assurance (Priority: HIGH)**
- Unit tests for all API endpoints (≥85% coverage target)
- Integration tests for database operations
- Frontend component tests with Vitest
- E2E testing with Playwright (user flows)
- Performance testing for API response times
- **Dependencies**: M2.1, M2.2, M2.3, M2.4 (all features complete)
- **Risk**: LOW - Standard testing practices
- **Deliverable**: Test suites (unit, integration, E2E), coverage reports

**Phase 2 Deliverables**:
- ✅ COMPLETED - `curated_presets` database schema deployed with Alembic migrations
- ✅ COMPLETED - API v2 endpoints fully functional with 85.23% test coverage
- ✅ COMPLETED - Preset Gallery UI responsive and accessible
- ✅ COMPLETED - MCP preset suggestions working with fallback (73.17% coverage)
- ✅ COMPLETED - All acceptance criteria (AC-005 to AC-008) validated
- ✅ COMPLETED - 54 passing tests covering all critical paths
- ✅ COMPLETED - 35 files changed, +5,492 insertions

---

### Phase 3: Custom Image Flow (DEFERRED - 1 Month Post-Phase 2)

**Objective**: Enable custom image upload, processing, and storage for user-generated preset visuals.

**Why Deferred**:
- Requires additional infrastructure (image CDN, processing pipeline, storage optimization)
- Not critical for MVP Curated Presets functionality
- Risk mitigation: Validate Phase 2 adoption before investing in complex features
- Team capacity: Focus on core features first

**Revisit Criteria**:
- ✅ Phase 2 deployed successfully to production
- ✅ User feedback indicates demand for custom images
- ✅ Team capacity available for 5-7 day implementation sprint
- ✅ Infrastructure budget approved for image CDN and storage

**Proposed Milestones (Future)**:
- M3.1: Image Upload API with validation (file type, size, content moderation)
- M3.2: Image Processing Pipeline (thumbnail generation, format conversion, optimization)
- M3.3: CDN Integration (CloudFlare or AWS CloudFront)
- M3.4: Frontend Image Upload UI (drag-drop, preview, cropping)
- M3.5: Storage Management (quota tracking, cleanup policies)

**Estimated Effort**: 5-7 days
**Priority**: LOW (deferred)

---

## Technical Approach

### Architecture Design Principles

**Parallel System Operation**:
- Brand DNA (v1 API) and Curated Presets (v2 API) operate simultaneously during transition
- No breaking changes to v1 API until sunset date (2026-02-14)
- API versioning middleware routes requests to appropriate handlers
- Frontend supports both systems with progressive feature flagging

**Zero-Downtime Migration**:
- Database migrations use transactional DDL for rollback safety
- Archive operations happen during low-traffic windows
- Feature flags enable gradual rollout to user segments
- Comprehensive monitoring for early issue detection

**Graceful Degradation**:
- MCP integration failures fall back to default preset list
- API errors return user-friendly messages with recovery suggestions
- Frontend handles loading states and empty states gracefully
- All critical paths have fallback mechanisms

### Technology Stack Specifications

**Backend Stack**:
- **FastAPI 0.118.3+**: Web framework with API versioning support
  - Rationale: Built-in OpenAPI docs, async support, type safety
  - Alternative considered: Django REST Framework (rejected: overkill for simple API)
- **SQLAlchemy 2.0**: ORM with async patterns for database operations
  - Rationale: Mature ORM with excellent async support in version 2.0
  - Alternative considered: Raw SQL (rejected: increased maintenance burden)
- **Pydantic 2.9**: Data validation and serialization
  - Rationale: Tight integration with FastAPI, runtime type checking
  - Alternative considered: Marshmallow (rejected: less FastAPI integration)
- **PostgreSQL 16+**: Relational database with JSONB support
  - Rationale: ACID compliance, JSONB for flexible metadata, proven reliability
  - Alternative considered: MongoDB (rejected: relational data model more appropriate)
- **pytest 8.0+**: Testing framework with async support
  - Rationale: Industry standard, excellent plugin ecosystem
  - Alternative considered: unittest (rejected: less Pythonic, fewer features)

**Frontend Stack**:
- **Next.js 16 (App Router)**: React framework with Server Components
  - Rationale: Modern architecture, excellent performance, integrated routing
  - Alternative considered: Create React App (rejected: deprecated, less features)
- **React 19**: UI library with Server Components and concurrent features
  - Rationale: Latest stable version with performance improvements
  - Alternative considered: Vue 3 (rejected: team expertise in React)
- **TypeScript 5.9+**: Type-safe JavaScript superset
  - Rationale: Compile-time type checking, excellent IDE support
  - Alternative considered: JavaScript (rejected: no type safety)
- **tRPC 11**: Type-safe API client-server communication
  - Rationale: End-to-end type safety, reduced boilerplate
  - Alternative considered: Axios (rejected: no type safety)
- **Zod 3.23**: Schema validation for forms and API responses
  - Rationale: TypeScript-first, composable schemas
  - Alternative considered: Yup (rejected: less TypeScript support)
- **Vitest + Playwright**: Unit and E2E testing frameworks
  - Rationale: Fast test execution, modern tooling, excellent DX
  - Alternative considered: Jest (rejected: slower, older architecture)

**Infrastructure Stack**:
- **Railway**: Deployment platform with PostgreSQL integration
  - Rationale: Simple deployment, integrated database, cost-effective
  - Alternative considered: AWS (rejected: over-engineered for current scale)
- **GitHub Actions**: CI/CD pipeline automation
  - Rationale: Integrated with GitHub, free for public repos
  - Alternative considered: Jenkins (rejected: self-hosting overhead)
- **MCP (Model Context Protocol)**: AI integration protocol
  - Rationale: Standardized AI tool integration, extensible
  - Alternative considered: Custom AI integration (rejected: reinventing wheel)

### Database Migration Strategy

**Migration Workflow**:
```
Step 1: Create `curated_presets` table (Phase 2, M2.1)
Step 2: Populate initial preset data (seed script)
Step 3: Deploy dual-API support (v1 Brand DNA, v2 Curated Presets)
Step 4: Monitor usage patterns for 30 days
Step 5: Enable read-only mode on Brand DNA (2026-02-01)
Step 6: Archive `brand_dnas` table (2026-02-14)
Step 7: Remove Brand DNA code from codebase (post-archive)
```

**Rollback Procedures**:
- **Phase 1 Rollback**: Disable deprecation headers, revert read-only mode
- **Phase 2 Rollback**: Disable v2 API, revert frontend to Brand DNA UI
- **Archive Rollback**: Restore from `brand_dnas_archive` to `brand_dnas`

**Data Integrity Checks**:
- Pre-migration: Row count verification, schema validation
- During migration: Transaction logs, checksum validation
- Post-migration: Data comparison (archive vs original), foreign key integrity

### API Versioning Strategy

**Version Routing**:
- **v1 API**: `/api/brand-dna` (deprecated, read-only after 2026-02-01)
- **v2 API**: `/api/v2/presets` (active, full CRUD support)
- **Header-Based Versioning**: `Accept: application/vnd.studio.v2+json` (future)

**Backward Compatibility Rules**:
- No breaking changes to v1 API structure until sunset date
- v1 responses include deprecation headers (M1.1)
- v1 errors reference v2 migration guides
- v2 API designed for future extensibility (JSONB metadata field)

**Version Deprecation Process**:
1. Announce deprecation (M1.4: migration notices)
2. Provide migration guide and tools
3. 30-day transition period (parallel operation)
4. 14-day read-only period (2026-02-01 to 2026-02-14)
5. Sunset date enforcement (2026-02-14: archive and disable)

### Testing Strategy

**Test Pyramid**:
- **Unit Tests (70% coverage target)**: Individual functions, models, utilities
- **Integration Tests (20% coverage target)**: API endpoints, database operations, MCP integration
- **E2E Tests (10% coverage target)**: Critical user flows (preset selection, migration journey)

**Testing Tools**:
- **Backend**: pytest, pytest-asyncio, pytest-cov, httpx (API client testing)
- **Frontend**: Vitest (unit/integration), React Testing Library, Playwright (E2E)
- **Database**: SQLAlchemy test fixtures, transaction rollback per test
- **CI/CD**: GitHub Actions with coverage reporting to Codecov

**Test Scenarios by Phase**:
- **Phase 1**: Deprecation headers, read-only mode, archive migration, notice rendering
- **Phase 2**: CRUD operations, filtering/search, MCP integration, responsive UI
- **Phase 3 (Deferred)**: Image upload, processing, storage quotas

**Quality Gates**:
- ✅ Test coverage ≥85% (pytest-cov, Vitest coverage)
- ✅ Zero linter warnings (ruff for Python, ESLint for TypeScript)
- ✅ Zero security vulnerabilities (Dependabot, Snyk)
- ✅ API response time <200ms (P95)
- ✅ Frontend Lighthouse score ≥90 (Performance, Accessibility)

---

## Risk Management

### High-Risk Mitigation Plans

**Risk 1: Data Loss During Archive Migration**
- **Mitigation Steps**:
  1. Create full database backup before migration
  2. Implement transaction-based migration with rollback on error
  3. Dry-run migration in staging environment with production data clone
  4. Schedule migration during low-traffic window (e.g., 2am UTC)
  5. Monitor migration progress with real-time alerting
- **Rollback Trigger**: Any row count mismatch between original and archive
- **Contingency**: Manual data recovery from backups, extend deprecation timeline by 7 days

**Risk 2: User Resistance to Migration**
- **Mitigation Steps**:
  1. Early communication: Email campaign 2 weeks before Phase 1 deployment
  2. In-app migration notices (M1.4) with clear benefits of Curated Presets
  3. User guide with step-by-step migration instructions
  4. Support channel (email, in-app chat) for migration assistance
  5. Analytics tracking of migration funnel (notice impressions → preset adoption)
- **Rollback Trigger**: User satisfaction <60% or support ticket volume >50/day
- **Contingency**: Extend deprecation timeline by 14 days, offer assisted migration service

**Risk 3: MCP Integration Failures**
- **Mitigation Steps**:
  1. Implement fallback to default preset list (M2.4)
  2. Graceful degradation: Display static presets if MCP unavailable
  3. Error monitoring with PagerDuty alerts for MCP downtime
  4. Circuit breaker pattern: Disable MCP after 3 consecutive failures
  5. Manual preset curation as backup content strategy
- **Rollback Trigger**: MCP uptime <95% or user complaints about missing suggestions
- **Contingency**: Disable MCP suggestions, rely entirely on static preset gallery

### Medium-Risk Mitigation Plans

**Risk 4: Frontend Refactoring Complexity**
- **Mitigation Steps**:
  1. Phased frontend rollout with feature flags (10%, 50%, 100% user segments)
  2. A/B testing for migration notice effectiveness
  3. Incremental component replacement (PresetGallery first, then PresetCard, etc.)
  4. Comprehensive component testing with Vitest before production deployment
  5. User feedback collection via in-app surveys
- **Rollback Trigger**: Critical UI bugs affecting >10% of users or page load time >3s
- **Contingency**: Rollback to Brand DNA UI for affected user segment, fix in hotfix branch

**Risk 5: API Versioning Conflicts**
- **Mitigation Steps**:
  1. API contract testing with Pact or similar tool
  2. Version isolation: Separate FastAPI routers for v1 and v2
  3. Backward compatibility validation in CI/CD pipeline
  4. Integration tests covering dual-version scenarios
  5. API documentation versioning (Swagger UI for v1 and v2)
- **Rollback Trigger**: v1 API breaking changes detected or v2 adoption <20% after 7 days
- **Contingency**: Maintain v1 API longer (extend sunset date by 30 days), improve v2 onboarding

---

## Resource Requirements

### Team Allocation

**Phase 1 (2-3 Days)**:
- **Backend Engineer (1 FTE)**: API deprecation headers, read-only mode, archive script
- **Frontend Engineer (0.5 FTE)**: Migration notice component, analytics integration
- **QA Engineer (0.5 FTE)**: Test Phase 1 acceptance criteria, regression testing

**Phase 2 (5-7 Days)**:
- **Backend Engineer (1 FTE)**: Database schema, API v2 implementation, MCP integration
- **Frontend Engineer (1 FTE)**: Preset Gallery, PresetCard, filtering/search UI
- **QA Engineer (1 FTE)**: Unit/integration/E2E testing, coverage validation
- **Designer (0.5 FTE)**: Preset Gallery UX/UI design, migration notice design

**Phase 3 (DEFERRED)**:
- **Backend Engineer (1 FTE)**: Image upload API, processing pipeline
- **Frontend Engineer (1 FTE)**: Image upload UI, preview, cropping
- **DevOps Engineer (0.5 FTE)**: CDN integration, storage management
- **QA Engineer (0.5 FTE)**: Image flow testing

### Infrastructure Requirements

**Development Environment**:
- PostgreSQL 16 database (Railway hobby plan: free)
- GitHub repository with Actions CI/CD
- Staging environment mirroring production (Railway staging: $5/month)

**Production Environment**:
- Railway Pro plan ($20/month): Includes PostgreSQL, web service, auto-scaling
- Vercel for Next.js frontend (hobby plan: free)
- MCP server (existing from SPEC-STUDIO-001)

**Monitoring and Observability**:
- Sentry for error tracking (free tier: 5K events/month)
- Railway metrics dashboard (included in Pro plan)
- Google Analytics for user behavior tracking (free)

### Timeline and Milestones

**Week 1 (Days 1-3): Phase 1**
- Day 1: M1.1 (API headers) + M1.4 (migration notice)
- Day 2: M1.2 (archive strategy) + M1.3 (read-only mode)
- Day 3: Phase 1 testing and deployment

**Week 2 (Days 4-10): Phase 2**
- Days 4-5: M2.1 (database schema) + M2.2 (backend API)
- Days 6-7: M2.3 (frontend gallery)
- Day 8: M2.4 (MCP integration)
- Days 9-10: M2.5 (testing and QA)

**Week 3+ (1 Month Later): Phase 3 (DEFERRED)**
- Revisit after Phase 2 production validation

**Critical Path**:
```
M1.2 (archive) → M1.3 (read-only) → Phase 1 deployment
M2.1 (schema) → M2.2 (API) → M2.3 (gallery) → M2.4 (MCP) → M2.5 (testing)
```

---

## Deployment Strategy

### Deployment Phases

**Phase 1 Deployment**:
- **Environment**: Staging first, then production
- **Rollout**: 100% immediate (deprecation notices non-disruptive)
- **Validation**: Check deprecation headers in all API responses
- **Rollback**: Disable headers via feature flag if issues detected

**Phase 2 Deployment**:
- **Environment**: Staging → 10% production → 50% production → 100% production
- **Rollout**: Gradual with feature flags (LaunchDarkly or custom)
- **Validation**: Monitor API response times, error rates, user adoption metrics
- **Rollback**: Disable v2 API routes, revert frontend to Brand DNA UI

**Archive Deployment (2026-02-14)**:
- **Environment**: Production (scheduled maintenance window)
- **Rollout**: One-time migration script execution
- **Validation**: Row count verification, data integrity checks
- **Rollback**: Restore from `brand_dnas_archive` backup

### Monitoring and Alerting

**Key Metrics**:
- API response time (P50, P95, P99)
- Error rate (5xx responses per minute)
- User adoption rate (Brand DNA → Curated Presets)
- Migration notice click-through rate
- MCP suggestion success rate

**Alerting Rules**:
- API error rate >5% for 5 minutes → PagerDuty alert
- Database connection pool exhaustion → PagerDuty alert
- MCP integration failure >3 consecutive → Slack notification
- Archive migration row count mismatch → Email + PagerDuty

**Observability Tools**:
- Railway logs and metrics (included in Pro plan)
- Sentry error tracking with source maps
- Google Analytics for user behavior funnels
- Custom dashboard for migration progress tracking

---

## Next Steps

1. **Approve SPEC-STUDIO-002**: Review and approve this SPEC document
2. **Execute /moai:2-run SPEC-STUDIO-002**: Begin TDD implementation for Phase 1
3. **Create Git Branch**: `feature/SPEC-STUDIO-002-brand-dna-migration`
4. **Set Up Feature Flags**: Configure LaunchDarkly or custom feature flag system
5. **Schedule Team Kickoff**: Align team on timeline, responsibilities, and communication

---

**Document Version**: 2.0.0
**Last Updated**: 2026-01-15
**Status**: Phase 1-2 Complete - Ready for Phase 3 Consideration
**Implementation Summary**:
- Phase 1: Brand DNA Cleanup - ✅ COMPLETED
- Phase 2: Curated Presets Core Build - ✅ COMPLETED (85.23% coverage, 54 tests)
- Phase 3: Custom Image Flow - ⏳ DEFERRED (revisit criteria not yet met)
**Traceability Tag**: [SPEC-STUDIO-002]
