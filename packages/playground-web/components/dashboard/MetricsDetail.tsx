'use client';

import { useState } from 'react';

const detailTabs = [
  { id: 'traffic', label: 'Traffic Sources' },
  { id: 'engagement', label: 'User Engagement' },
  { id: 'performance', label: 'Performance' },
];

const trafficData = [
  { source: 'Organic Search', visitors: '12,345', percentage: 45, color: 'bg-blue-500' },
  { source: 'Direct', visitors: '8,234', percentage: 30, color: 'bg-purple-500' },
  { source: 'Social Media', visitors: '4,123', percentage: 15, color: 'bg-pink-500' },
  { source: 'Referral', visitors: '2,745', percentage: 10, color: 'bg-green-500' },
];

const engagementData = [
  { metric: 'Page Views', value: '45,678', change: '+12.3%', trend: 'up' },
  { metric: 'Bounce Rate', value: '42.5%', change: '-5.2%', trend: 'up' },
  { metric: 'Avg. Time on Page', value: '3m 24s', change: '+18.7%', trend: 'up' },
  { metric: 'Pages per Session', value: '4.2', change: '+7.1%', trend: 'up' },
];

const performanceData = [
  { metric: 'Load Time', value: '1.2s', status: 'good', target: '< 2s' },
  { metric: 'First Contentful Paint', value: '0.8s', status: 'good', target: '< 1s' },
  { metric: 'Time to Interactive', value: '2.1s', status: 'warning', target: '< 2s' },
  { metric: 'Cumulative Layout Shift', value: '0.05', status: 'good', target: '< 0.1' },
];

export function MetricsDetail() {
  const [activeTab, setActiveTab] = useState('traffic');

  return (
    <div className="bg-[--lm-background-surface] border border-[--lm-border-subtle] rounded-[--lm-radius-lg] overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-[--lm-border-subtle] px-6 flex gap-1">
        {detailTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-3 font-[--lm-font-family-sans] font-[--lm-font-weight-medium] text-sm
              border-b-2 transition-all duration-[--lm-motion-duration-fast]
              ${
                activeTab === tab.id
                  ? 'border-[--lm-brand-default] text-[--lm-brand-default]'
                  : 'border-transparent text-[--lm-text-secondary] hover:text-[--lm-text-primary]'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'traffic' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-[--lm-font-family-sans] font-[--lm-font-weight-semibold] text-[--lm-text-primary]">
                Traffic Distribution
              </h3>
              <span className="text-sm text-[--lm-text-tertiary]">Total: 27,447 visitors</span>
            </div>
            {trafficData.map((item) => (
              <div key={item.source} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-[--lm-font-family-sans] font-[--lm-font-weight-medium] text-[--lm-text-primary]">
                    {item.source}
                  </span>
                  <span className="text-sm text-[--lm-text-secondary]">{item.visitors}</span>
                </div>
                <div className="w-full h-2 bg-[--lm-background-emphasis] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all duration-[--lm-motion-duration-complex]`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'engagement' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {engagementData.map((item) => (
              <div
                key={item.metric}
                className="p-4 rounded-[--lm-radius-md] border border-[--lm-border-subtle] hover:border-[--lm-border-default] transition-colors duration-[--lm-motion-duration-fast]"
              >
                <p className="text-xs font-[--lm-font-family-sans] text-[--lm-text-tertiary] mb-2">
                  {item.metric}
                </p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-[--lm-font-family-sans] font-[--lm-font-weight-semibold] text-[--lm-text-primary]">
                    {item.value}
                  </p>
                  <span className="text-sm font-[--lm-font-weight-medium] text-green-600">
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="font-[--lm-font-family-sans] font-[--lm-font-weight-semibold] text-[--lm-text-primary] mb-1">
                Core Web Vitals
              </h3>
              <p className="text-sm text-[--lm-text-tertiary]">
                Performance metrics for optimal user experience
              </p>
            </div>
            {performanceData.map((item) => (
              <div
                key={item.metric}
                className="flex items-center justify-between p-4 rounded-[--lm-radius-md] border border-[--lm-border-subtle]"
              >
                <div className="flex-1">
                  <p className="font-[--lm-font-family-sans] font-[--lm-font-weight-medium] text-sm text-[--lm-text-primary] mb-1">
                    {item.metric}
                  </p>
                  <p className="text-xs text-[--lm-text-tertiary]">Target: {item.target}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-[--lm-font-family-mono] font-[--lm-font-weight-semibold] text-[--lm-text-primary]">
                    {item.value}
                  </span>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      item.status === 'good'
                        ? 'bg-green-500'
                        : item.status === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
