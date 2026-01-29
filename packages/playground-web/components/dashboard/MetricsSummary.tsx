'use client';

const metrics = [
  {
    label: 'Total Revenue',
    value: '$45,231',
    change: '+20.1%',
    trend: 'up' as const,
    icon: '💰',
    description:
      'Total revenue represents the sum of all income generated from sales, subscriptions, and other revenue streams during the selected period. This metric is crucial for understanding overall business performance and growth trajectory.',
    chartData: [
      { label: 'Mon', value: 5234 },
      { label: 'Tue', value: 6123 },
      { label: 'Wed', value: 7456 },
      { label: 'Thu', value: 6789 },
      { label: 'Fri', value: 8234 },
      { label: 'Sat', value: 5678 },
      { label: 'Sun', value: 5717 },
    ],
  },
  {
    label: 'Active Users',
    value: '2,345',
    change: '+12.5%',
    trend: 'up' as const,
    icon: '👤',
    description:
      'Active users metric tracks the number of unique users who have engaged with your platform within the specified timeframe. This includes users who have logged in, performed actions, or interacted with your service in meaningful ways.',
    chartData: [
      { label: 'Mon', value: 2156 },
      { label: 'Tue', value: 2234 },
      { label: 'Wed', value: 2389 },
      { label: 'Thu', value: 2298 },
      { label: 'Fri', value: 2445 },
      { label: 'Sat', value: 2123 },
      { label: 'Sun', value: 2200 },
    ],
  },
  {
    label: 'Conversion Rate',
    value: '3.24%',
    change: '-2.4%',
    trend: 'down' as const,
    icon: '📊',
    description:
      'Conversion rate measures the percentage of visitors who complete a desired action, such as making a purchase, signing up for a newsletter, or completing a form. A higher conversion rate indicates more effective marketing and user experience.',
    chartData: [
      { label: 'Mon', value: 3.45 },
      { label: 'Tue', value: 3.32 },
      { label: 'Wed', value: 3.28 },
      { label: 'Thu', value: 3.15 },
      { label: 'Fri', value: 3.24 },
      { label: 'Sat', value: 3.18 },
      { label: 'Sun', value: 3.24 },
    ],
  },
  {
    label: 'Avg. Session',
    value: '4m 32s',
    change: '+8.2%',
    trend: 'up' as const,
    icon: '⏱️',
    description:
      'Average session duration indicates how long users typically spend on your platform during a single visit. Longer sessions often correlate with higher engagement and interest in your content or services.',
    chartData: [
      { label: 'Mon', value: 245 },
      { label: 'Tue', value: 267 },
      { label: 'Wed', value: 289 },
      { label: 'Thu', value: 256 },
      { label: 'Fri', value: 272 },
      { label: 'Sat', value: 234 },
      { label: 'Sun', value: 251 },
    ],
  },
];

interface MetricsSummaryProps {
  onMetricClick: (metric: (typeof metrics)[0]) => void;
}

export function MetricsSummary({ onMetricClick }: MetricsSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <button
          key={metric.label}
          onClick={() => onMetricClick(metric)}
          className="text-left bg-[--lm-background-surface] border border-[--lm-border-subtle] rounded-[--lm-radius-lg] p-5 hover:shadow-[--lm-elevation-card-hover] hover:border-[--lm-brand-default] transition-all duration-[--lm-motion-duration-moderate] group cursor-pointer"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-[--lm-radius-md] bg-[--lm-background-emphasis] flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-[--lm-motion-duration-fast]">
              {metric.icon}
            </div>
            <span
              className={`text-xs font-[--lm-font-family-sans] font-[--lm-font-weight-medium] px-2 py-1 rounded-[--lm-radius-sm] ${
                metric.trend === 'up' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
              }`}
            >
              {metric.change}
            </span>
          </div>
          <div>
            <p className="text-xs font-[--lm-font-family-sans] font-[--lm-font-weight-regular] text-[--lm-text-tertiary] mb-1">
              {metric.label}
            </p>
            <p className="text-2xl font-[--lm-font-family-sans] font-[--lm-font-weight-semibold] text-[--lm-text-primary]">
              {metric.value}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
