'use client';

import { LayoutDashboard, BarChart3, Users, Settings, ChevronLeft } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: true },
  { icon: BarChart3, label: 'Analytics', href: '/analytics', active: false },
  { icon: Users, label: 'Users', href: '/users', active: false },
  { icon: Settings, label: 'Settings', href: '/settings', active: false },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className="fixed left-0 top-0 h-screen bg-[--lm-background-surface] border-r border-[--lm-border-subtle] transition-all duration-[--lm-motion-duration-moderate] ease-[--lm-motion-easing-emphasized] z-20"
      style={{
        width: collapsed ? '64px' : '240px',
      }}
    >
      {/* Logo / Brand */}
      <div className="h-16 border-b border-[--lm-border-subtle] flex items-center px-4">
        {collapsed ? (
          <div className="w-8 h-8 rounded-[--lm-radius-md] bg-[--lm-brand-default] flex items-center justify-center text-white font-bold text-sm">
            T
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[--lm-radius-md] bg-[--lm-brand-default] flex items-center justify-center text-white font-bold text-sm">
              T
            </div>
            <span className="font-[--lm-font-family-sans] font-[--lm-font-weight-semibold] text-[--lm-text-primary]">
              Tekton
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-2 mt-2">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-[--lm-radius-md] mb-1
              transition-all duration-[--lm-motion-duration-fast]
              ${
                item.active
                  ? 'bg-[--lm-brand-subtle] text-[--lm-brand-default]'
                  : 'text-[--lm-text-secondary] hover:bg-[--lm-background-hover]'
              }
            `}
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!collapsed && (
              <span className="font-[--lm-font-family-sans] font-[--lm-font-weight-medium] text-sm">
                {item.label}
              </span>
            )}
          </a>
        ))}
      </nav>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[--lm-background-surface] border border-[--lm-border-default] shadow-[--lm-elevation-card-default] hover:shadow-[--lm-elevation-card-hover] flex items-center justify-center text-[--lm-text-secondary] hover:text-[--lm-text-primary] transition-all duration-[--lm-motion-duration-fast]"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronLeft
          size={20}
          className={`transition-transform duration-[--lm-motion-duration-moderate] ${
            collapsed ? 'rotate-180' : ''
          }`}
        />
      </button>
    </aside>
  );
}
