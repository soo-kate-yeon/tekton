'use client';

import { ThemeCard } from './ThemeCard';
import type { Theme } from '@/lib/api/types';

interface ThemeGridProps {
  themes: Theme[];
  isLoading?: boolean;
  onDelete?: (id: number) => void;
}

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-[color:var(--color-card-background)] border border-[color:var(--color-border)]">
      {/* Thumbnail skeleton */}
      <div className="aspect-[4/3] bg-[color:var(--color-muted)] animate-pulse" />

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        <div className="h-6 w-3/4 bg-[color:var(--color-muted)] animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-[color:var(--color-muted)] animate-pulse" />
          <div className="h-4 w-2/3 bg-[color:var(--color-muted)] animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-4 w-12 bg-[color:var(--color-muted)] animate-pulse" />
          <div className="h-4 w-16 bg-[color:var(--color-muted)] animate-pulse" />
          <div className="h-4 w-10 bg-[color:var(--color-muted)] animate-pulse" />
        </div>
        <div className="pt-4 border-t border-[color:var(--color-border)]">
          <div className="h-3 w-24 bg-[color:var(--color-muted)] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function ThemeGrid({ themes, isLoading, onDelete }: ThemeGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (themes.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 border-2 border-dashed border-[color:var(--color-border)]">
          <svg
            className="w-6 h-6 text-[color:var(--color-muted-foreground)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="font-[family-name:var(--heading-font-family,Georgia,serif)] text-xl font-semibold mb-2">
          No themes found
        </h3>
        <p className="text-[color:var(--color-muted-foreground)] max-w-sm mx-auto">
          Try adjusting your filters or create a new theme to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {themes.map((theme) => (
        <ThemeCard key={theme.id} theme={theme} onDelete={onDelete} />
      ))}
    </div>
  );
}
