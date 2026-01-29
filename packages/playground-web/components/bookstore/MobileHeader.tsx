'use client';

import { useState } from 'react';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="md:hidden px-6 py-4 flex items-center justify-between sticky top-0 z-20 bg-[var(--atomic-semantic-background-canvas)]/80 backdrop-blur-md border-b border-[var(--atomic-semantic-border-default-subtle)]">
      {/* Left: Menu Button */}
      <button
        onClick={onMenuClick}
        className="w-11 h-11 flex items-center justify-center text-[var(--atomic-semantic-text-primary)] hover:bg-[var(--atomic-semantic-background-surface-emphasis)]/10 rounded-[var(--atomic-radius-md)] transition-colors"
        aria-label="Open menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Center: Logo */}
      <h1 className="text-lg font-[family-name:var(--font-serif)] font-bold text-[var(--atomic-semantic-text-brand)] tracking-tight">
        Blue Bottle Books
      </h1>

      {/* Right: Search Button */}
      <button
        onClick={() => setSearchOpen(!searchOpen)}
        className="w-11 h-11 flex items-center justify-center text-[var(--atomic-semantic-text-primary)] hover:bg-[var(--atomic-semantic-background-surface-emphasis)]/10 rounded-[var(--atomic-radius-md)] transition-colors"
        aria-label="Search"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </button>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 bg-[var(--atomic-semantic-background-canvas)] border-b border-[var(--atomic-semantic-border-default-subtle)] p-4 shadow-lg">
          <div className="relative">
            <input
              type="text"
              placeholder="Search books..."
              autoFocus
              className="w-full pl-10 pr-4 py-3 rounded-[var(--atomic-radius-full)] bg-[var(--atomic-semantic-background-surface-default)] border border-[var(--atomic-semantic-border-default-subtle)] text-sm focus:outline-none focus:border-[var(--atomic-semantic-text-brand)] transition-colors"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--atomic-semantic-text-secondary)]"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
        </div>
      )}
    </header>
  );
}
