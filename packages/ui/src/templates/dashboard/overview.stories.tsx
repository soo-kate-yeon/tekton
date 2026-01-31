/**
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 * [TAG-Q-019] Storybook 문서화 및 접근성 테스트
 */

import type { Meta, StoryObj } from '@storybook/react';
import { DashboardTemplateComponent } from './overview';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/card';
import { Button } from '../../components/button';
import { Badge } from '../../components/badge';

const meta = {
  title: 'Templates/Dashboard/Overview',
  component: DashboardTemplateComponent,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DashboardTemplateComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default dashboard template
 * Accessibility: Semantic HTML structure with proper landmarks
 */
export const Default: Story = {
  args: {},
};

/**
 * With sidebar navigation
 */
export const WithSidebar: Story = {
  args: {
    slots: {
      sidebar: (
        <div className="p-4 space-y-4">
          <div className="font-bold text-lg mb-4">Tekton</div>
          <nav className="space-y-2">
            <a href="#" className="block px-3 py-2 rounded hover:bg-[var(--tekton-bg-accent)]">
              Dashboard
            </a>
            <a href="#" className="block px-3 py-2 rounded hover:bg-[var(--tekton-bg-accent)]">
              Analytics
            </a>
            <a href="#" className="block px-3 py-2 rounded hover:bg-[var(--tekton-bg-accent)]">
              Reports
            </a>
            <a href="#" className="block px-3 py-2 rounded hover:bg-[var(--tekton-bg-accent)]">
              Settings
            </a>
          </nav>
        </div>
      ),
    },
  },
};

/**
 * With metric cards
 */
export const WithMetrics: Story = {
  args: {
    slots: {
      metrics: (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <span className="text-2xl">💰</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231</div>
              <p className="text-xs text-[var(--tekton-bg-muted-foreground)]">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
              <span className="text-2xl">👥</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2,350</div>
              <p className="text-xs text-[var(--tekton-bg-muted-foreground)]">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <span className="text-2xl">📈</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-[var(--tekton-bg-muted-foreground)]">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <span className="text-2xl">👤</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-[var(--tekton-bg-muted-foreground)]">
                +201 since last hour
              </p>
            </CardContent>
          </Card>
        </>
      ),
    },
  },
};

/**
 * Complete dashboard with all features
 */
export const Complete: Story = {
  args: {
    texts: {
      title: 'Analytics Dashboard',
      subtitle: 'Your business overview at a glance',
      primary_title: 'Recent Sales',
      primary_description: 'Latest transactions and revenue',
      secondary_title: 'Activity Feed',
      secondary_description: 'Recent system events',
    },
    slots: {
      sidebar: (
        <div className="p-4 space-y-4">
          <div className="font-bold text-lg mb-4">Tekton</div>
          <nav className="space-y-2">
            <a href="#" className="block px-3 py-2 rounded bg-[var(--tekton-bg-accent)]">
              Dashboard
            </a>
            <a href="#" className="block px-3 py-2 rounded hover:bg-[var(--tekton-bg-accent)]">
              Analytics
            </a>
            <a href="#" className="block px-3 py-2 rounded hover:bg-[var(--tekton-bg-accent)]">
              Reports
            </a>
            <a href="#" className="block px-3 py-2 rounded hover:bg-[var(--tekton-bg-accent)]">
              Settings
            </a>
          </nav>
        </div>
      ),
      headerActions: (
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button>Create Report</Button>
        </div>
      ),
      metrics: (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <span className="text-2xl">💰</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231</div>
              <p className="text-xs text-[var(--tekton-bg-muted-foreground)]">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
              <span className="text-2xl">👥</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2,350</div>
              <p className="text-xs text-[var(--tekton-bg-muted-foreground)]">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <span className="text-2xl">📈</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-[var(--tekton-bg-muted-foreground)]">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <span className="text-2xl">👤</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-[var(--tekton-bg-muted-foreground)]">
                +201 since last hour
              </p>
            </CardContent>
          </Card>
        </>
      ),
      primaryContent: (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[var(--tekton-bg-muted)]" />
                <div>
                  <p className="font-medium">Customer #{i + 1}</p>
                  <p className="text-sm text-[var(--tekton-bg-muted-foreground)]">
                    customer{i + 1}@example.com
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${(Math.random() * 1000).toFixed(2)}</p>
                <Badge variant="secondary">Completed</Badge>
              </div>
            </div>
          ))}
        </div>
      ),
      secondaryContent: (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-[var(--tekton-bg-primary)]" />
              <div className="flex-1">
                <p className="text-sm font-medium">Activity {i + 1}</p>
                <p className="text-sm text-[var(--tekton-bg-muted-foreground)]">{i} minutes ago</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  },
};
