'use client';

import { useEffect } from 'react';

interface MetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: {
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: any; // Updated to accept Lucide icon component
    description: string;
    chartData: Array<{ label: string; value: number }>;
  } | null;
}

export function MetricModal({ isOpen, onClose, metric }: MetricModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !metric) {
    return null;
  }

  const maxValue = Math.max(...metric.chartData.map((d) => d.value));
  const Icon = metric.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" />

      {/* Modal */}
      <div
        className="relative bg-[--lm-background-surface] rounded-[--lm-radius-xl] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[--lm-background-surface] border-b border-[--lm-border-subtle] px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[--lm-radius-md] bg-[--lm-background-emphasis] flex items-center justify-center text-2xl text-[--lm-text-secondary]">
              <Icon size={24} />
            </div>
            <div>
              <h2 className="font-[--lm-font-family-sans] font-[--lm-font-weight-semibold] text-xl text-[--lm-text-primary]">
                {metric.label}
              </h2>
              <p className="text-sm text-[--lm-text-tertiary]">Detailed Analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[--lm-background-hover] flex items-center justify-center text-[--lm-text-secondary] hover:text-[--lm-text-primary] transition-colors duration-[--lm-motion-duration-fast]"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Value */}
          <div className="flex items-end justify-between p-6 bg-[--lm-background-emphasis] rounded-[--lm-radius-lg]">
            <div>
              <p className="text-sm font-[--lm-font-family-sans] text-[--lm-text-tertiary] mb-2">
                Current Value
              </p>
              <p className="text-4xl font-[--lm-font-family-sans] font-[--lm-font-weight-semibold] text-[--lm-text-primary]">
                {metric.value}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[--lm-text-tertiary] mb-1">Change</p>
              <span
                className={`text-2xl font-[--lm-font-family-sans] font-[--lm-font-weight-semibold] ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {metric.change}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-[--lm-font-family-sans] font-[--lm-font-weight-semibold] text-[--lm-text-primary] mb-2">
              About This Metric
            </h3>
            <p className="text-[--lm-text-secondary] leading-relaxed">{metric.description}</p>
          </div>

          {/* Chart */}
          <div>
            <h3 className="font-[--lm-font-family-sans] font-[--lm-font-weight-semibold] text-[--lm-text-primary] mb-4">
              7-Day Trend
            </h3>
            <div className="space-y-3">
              {metric.chartData.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-[--lm-font-family-sans] text-[--lm-text-secondary]">
                      {item.label}
                    </span>
                    <span className="font-[--lm-font-family-mono] font-[--lm-font-weight-medium] text-[--lm-text-primary]">
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                  <div className="relative h-8 bg-[--lm-background-emphasis] rounded-[--lm-radius-sm] overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[--lm-brand-default] to-[--lm-brand-emphasis] transition-all duration-[--lm-motion-duration-complex] rounded-[--lm-radius-sm]"
                      style={{
                        width: `${(item.value / maxValue) * 100}%`,
                        transitionDelay: `${index * 50}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-[--lm-border-subtle]">
            <button className="flex-1 px-4 py-2.5 rounded-[--lm-radius-md] bg-[--lm-brand-default] text-white font-[--lm-font-family-sans] font-[--lm-font-weight-medium] hover:bg-[--lm-brand-emphasis] transition-colors duration-[--lm-motion-duration-fast]">
              View Full Report
            </button>
            <button className="px-4 py-2.5 rounded-[--lm-radius-md] border border-[--lm-border-default] text-[--lm-text-primary] font-[--lm-font-family-sans] font-[--lm-font-weight-medium] hover:bg-[--lm-background-hover] transition-colors duration-[--lm-motion-duration-fast]">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
