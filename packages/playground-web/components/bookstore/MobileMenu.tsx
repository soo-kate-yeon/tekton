'use client';

import { useEffect } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 left-0 bottom-0 w-[280px] bg-[var(--atomic-semantic-background-surface-default)] z-50 shadow-2xl md:hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--atomic-semantic-border-default-subtle)]">
          <h2 className="text-xl font-[family-name:var(--font-serif)] font-bold text-[var(--atomic-semantic-text-brand)]">
            Menu
          </h2>
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center text-[var(--atomic-semantic-text-primary)] hover:bg-[var(--atomic-semantic-background-surface-emphasis)]/10 rounded-[var(--atomic-radius-md)] transition-colors"
            aria-label="Close menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-6 space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-[var(--atomic-radius-md)] text-[var(--atomic-semantic-text-primary)] font-medium hover:bg-[var(--atomic-semantic-background-surface-emphasis)]/10 transition-colors">
            New Arrivals
          </button>
          <button className="w-full text-left px-4 py-3 rounded-[var(--atomic-radius-md)] text-[var(--atomic-semantic-text-secondary)] font-medium hover:bg-[var(--atomic-semantic-background-surface-emphasis)]/10 hover:text-[var(--atomic-semantic-text-primary)] transition-colors">
            Bestsellers
          </button>
          <button className="w-full text-left px-4 py-3 rounded-[var(--atomic-radius-md)] text-[var(--atomic-semantic-text-secondary)] font-medium hover:bg-[var(--atomic-semantic-background-surface-emphasis)]/10 hover:text-[var(--atomic-semantic-text-primary)] transition-colors">
            Events
          </button>
          <button className="w-full text-left px-4 py-3 rounded-[var(--atomic-radius-md)] text-[var(--atomic-semantic-text-secondary)] font-medium hover:bg-[var(--atomic-semantic-background-surface-emphasis)]/10 hover:text-[var(--atomic-semantic-text-primary)] transition-colors">
            About Us
          </button>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[var(--atomic-semantic-border-default-subtle)]">
          <button className="w-full px-6 py-3 bg-[var(--atomic-semantic-text-brand)] text-white font-semibold rounded-[var(--atomic-radius-full)] hover:opacity-90 transition-opacity">
            Sign In
          </button>
        </div>
      </div>
    </>
  );
}
