/**
 * @tekton/ui - Dashboard Template
 * SPEC-UI-001 Phase 3: Dashboard Screen Template
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: 대시보드 템플릿이 데이터 시각화를 보장
 * IMPACT: 템플릿 오류 시 대시보드 표시 불가
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/card';
import { Separator } from '../../components/separator';
import type { ScreenTemplate, ScreenTemplateProps } from '../types';
import { DEFAULT_RESPONSIVE_LAYOUT } from '../types';

/**
 * Dashboard Template Component
 */
export function DashboardTemplateComponent({
  children,
  className = '',
  slots = {},
  texts = {},
}: ScreenTemplateProps) {
  const title = texts.title || 'Dashboard';
  const subtitle = texts.subtitle || 'Welcome to your dashboard';

  return (
    <div className={`min-h-screen flex ${className}`}>
      {/* Sidebar */}
      {slots.sidebar && (
        <aside className="w-64 border-r border-[var(--tekton-border-default)] bg-[var(--tekton-bg-card)]">
          {slots.sidebar}
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-[var(--tekton-border-default)] bg-[var(--tekton-bg-background)] p-[var(--tekton-spacing-4)]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-sm text-[var(--tekton-text-muted-foreground)]">{subtitle}</p>
            </div>
            {slots.headerActions && <div>{slots.headerActions}</div>}
          </div>
        </header>

        {/* Content Area */}
        <div className="p-[var(--tekton-spacing-6)] space-y-[var(--tekton-spacing-6)]">
          {/* Metrics Row */}
          {slots.metrics && (
            <div className="grid gap-[var(--tekton-spacing-4)] md:grid-cols-2 lg:grid-cols-4">
              {slots.metrics}
            </div>
          )}

          <Separator />

          {/* Main Content Grid */}
          <div className="grid gap-[var(--tekton-spacing-6)] lg:grid-cols-2">
            {/* Primary Content */}
            {slots.primaryContent && (
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>{texts.primary_title || 'Overview'}</CardTitle>
                  <CardDescription>
                    {texts.primary_description || 'Recent activity and statistics'}
                  </CardDescription>
                </CardHeader>
                <CardContent>{slots.primaryContent}</CardContent>
              </Card>
            )}

            {/* Secondary Content */}
            {slots.secondaryContent && (
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>{texts.secondary_title || 'Recent Activity'}</CardTitle>
                  <CardDescription>
                    {texts.secondary_description || 'Latest updates and notifications'}
                  </CardDescription>
                </CardHeader>
                <CardContent>{slots.secondaryContent}</CardContent>
              </Card>
            )}
          </div>

          {/* Additional Sections */}
          {slots.additionalSections && <div>{slots.additionalSections}</div>}
        </div>
      </main>
      {children}
    </div>
  );
}

/**
 * Dashboard Template Definition
 */
export const DashboardTemplate: ScreenTemplate = {
  id: 'dashboard.overview',
  name: 'Dashboard Overview',
  category: 'dashboard',
  description: 'Standard dashboard layout with sidebar, metrics, and content areas',

  skeleton: {
    shell: 'sidebar-layout',
    page: 'dashboard-page',
    sections: [
      {
        id: 'dashboard-sidebar',
        name: 'Sidebar Navigation',
        slot: 'sidebar',
        required: false,
        Component: () => null,
      },
      {
        id: 'dashboard-content',
        name: 'Dashboard Content',
        slot: 'main',
        required: true,
        Component: DashboardTemplateComponent,
      },
    ],
  },

  layout: {
    type: 'sidebar',
    responsive: DEFAULT_RESPONSIVE_LAYOUT,
  },

  customizable: {
    texts: [
      'title',
      'subtitle',
      'primary_title',
      'primary_description',
      'secondary_title',
      'secondary_description',
    ],
    optional: ['metrics', 'additionalSections'],
    slots: [
      'sidebar',
      'headerActions',
      'metrics',
      'primaryContent',
      'secondaryContent',
      'additionalSections',
    ],
  },

  requiredComponents: ['Card', 'Separator'],

  Component: DashboardTemplateComponent,

  version: '1.0.0',
  created: '2026-01-31',
  updated: '2026-01-31',
  tags: ['dashboard', 'overview', 'analytics'],
};
