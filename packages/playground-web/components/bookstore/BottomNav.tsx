'use client';

import { useState } from 'react';

export function BottomNav() {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'library', label: 'Library', icon: '📚' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--atomic-semantic-background-surface-default)] border-t border-[var(--atomic-semantic-border-default-subtle)] z-30 safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-[var(--atomic-radius-md)] transition-colors min-w-[44px] min-h-[44px]
              ${
                activeTab === tab.id
                  ? 'text-[var(--atomic-semantic-text-brand)]'
                  : 'text-[var(--atomic-semantic-text-secondary)]'
              }
            `}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
      {/* Safe area spacer for devices with home indicator */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
