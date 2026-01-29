'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { MetricsSummary } from '@/components/dashboard/MetricsSummary';
import { MetricsDetail } from '@/components/dashboard/MetricsDetail';
import { MetricModal } from '@/components/dashboard/MetricModal';

type Metric = {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  description: string;
  chartData: Array<{ label: string; value: number }>;
};

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);

  return (
    <div className="min-h-screen bg-[--lm-background-canvas] flex">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <main
        className="flex-1 transition-all duration-[--lm-motion-duration-moderate] ease-[--lm-motion-easing-emphasized]"
        style={{
          marginLeft: sidebarCollapsed ? '64px' : '240px',
        }}
      >
        {/* Header */}
        <header className="h-16 border-b border-[--lm-border-subtle] bg-[--lm-background-surface] px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="font-[--lm-font-family-sans] font-[--lm-font-weight-semibold] text-xl text-[--lm-text-primary]">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-[--lm-radius-md] text-sm font-[--lm-font-weight-medium] text-[--lm-text-secondary] hover:bg-[--lm-background-hover] transition-colors duration-[--lm-motion-duration-fast]">
              Last 7 days
            </button>
            <button className="px-4 py-2 rounded-[--lm-radius-md] text-sm font-[--lm-font-weight-medium] bg-[--lm-brand-default] text-white hover:bg-[--lm-brand-emphasis] transition-colors duration-[--lm-motion-duration-fast]">
              Export
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 space-y-6">
          {/* Top Row: Metrics Summary */}
          <section>
            <h2 className="font-[--lm-font-family-sans] font-[--lm-font-weight-medium] text-xs uppercase tracking-wider text-[--lm-text-tertiary] mb-4">
              Overview
            </h2>
            <MetricsSummary onMetricClick={setSelectedMetric} />
          </section>

          {/* Bottom Row: Metrics Detail */}
          <section>
            <h2 className="font-[--lm-font-family-sans] font-[--lm-font-weight-medium] text-xs uppercase tracking-wider text-[--lm-text-tertiary] mb-4">
              Detailed Analytics
            </h2>
            <MetricsDetail />
          </section>
        </div>
      </main>

      {/* Metric Modal */}
      <MetricModal
        isOpen={selectedMetric !== null}
        onClose={() => setSelectedMetric(null)}
        metric={selectedMetric}
      />
    </div>
  );
}
