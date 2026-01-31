/**
 * @tekton/ui - Templates Module
 * SPEC-UI-001 Phase 3: Screen Template System
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: 템플릿 모듈이 스크린 템플릿 시스템을 통합
 * IMPACT: 모듈 오류 시 템플릿 사용 불가
 */

// Types
export * from './types';

// Registry
export { TemplateRegistry, templateRegistry } from './registry';

// Auth Templates
export { LoginTemplate, LoginTemplateComponent } from './auth/login';

// Dashboard Templates
export { DashboardTemplate, DashboardTemplateComponent } from './dashboard/overview';

// Auto-register templates
import { templateRegistry } from './registry';
import { LoginTemplate } from './auth/login';
import { DashboardTemplate } from './dashboard/overview';

// Register all built-in templates
templateRegistry.registerMany([LoginTemplate, DashboardTemplate]);
