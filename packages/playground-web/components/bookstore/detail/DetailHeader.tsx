'use client';

import Link from 'next/link';

interface DetailHeaderProps {
  title?: string;
}

export function DetailHeader({ title }: DetailHeaderProps) {
  return (
    <header className="sticky top-0 z-30 px-6 md:px-10 py-4 flex items-center justify-between bg-[var(--atomic-semantic-background-canvas)]/80 backdrop-blur-md border-b border-[var(--atomic-semantic-border-default-subtle)]">
      {/* Back Button */}
      <Link
        href="/bookstore"
        className="w-11 h-11 flex items-center justify-center text-[var(--atomic-semantic-text-primary)] hover:bg-[var(--atomic-semantic-background-surface-emphasis)]/10 rounded-[var(--atomic-radius-md)] transition-colors"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </Link>

      {/* Title (optional) */}
      {title && (
        <h1 className="text-lg font-semibold text-[var(--atomic-semantic-text-primary)]">
          {title}
        </h1>
      )}

      {/* Share Button (placeholder) */}
      <button className="w-11 h-11 flex items-center justify-center text-[var(--atomic-semantic-text-primary)] hover:bg-[var(--atomic-semantic-background-surface-emphasis)]/10 rounded-[var(--atomic-radius-md)] transition-colors">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </button>
    </header>
  );
}
