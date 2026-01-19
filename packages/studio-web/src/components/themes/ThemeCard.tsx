'use client';

import Link from 'next/link';
import type { Theme } from '@/lib/api/types';

interface ThemeCardProps {
  theme: Theme;
  onDelete?: (id: number) => void;
}

function extractColors(config: Record<string, unknown>): string[] {
  const colors: string[] = [];

  if (config.colors && typeof config.colors === 'object') {
    const colorsObj = config.colors as Record<string, unknown>;
    if (colorsObj.primary && typeof colorsObj.primary === 'string') {
      colors.push(colorsObj.primary);
    }
    if (colorsObj.secondary && typeof colorsObj.secondary === 'string') {
      colors.push(colorsObj.secondary);
    }
    if (colorsObj.accent && typeof colorsObj.accent === 'string') {
      colors.push(colorsObj.accent);
    }
    if (colorsObj.neutral && typeof colorsObj.neutral === 'string') {
      colors.push(colorsObj.neutral);
    }
  }

  return colors.slice(0, 5);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ThemeCard({ theme, onDelete }: ThemeCardProps) {
  const colors = extractColors(theme.config);

  return (
    <article className="group relative flex flex-col h-full bg-[color:var(--color-card-background)] border border-[color:var(--color-border)] transition-all duration-300 hover:border-[color:var(--color-foreground,#1a1a1a)]/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      {/* Color Preview Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--color-muted)]">
        {colors.length > 0 ? (
          <div className="absolute inset-0 flex">
            {colors.map((color, index) => (
              <div
                key={index}
                className="flex-1 transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-2 border-dashed border-[color:var(--color-border)] flex items-center justify-center">
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
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-block px-3 py-1 text-[10px] font-medium tracking-[0.1em] uppercase bg-[color:var(--color-card-background)]/90 backdrop-blur-sm text-[color:var(--color-foreground)]">
            {theme.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-6">
        {/* Title */}
        <h3 className="font-[family-name:var(--heading-font-family,Georgia,serif)] text-xl font-semibold leading-tight tracking-tight mb-2 group-hover:text-[color:var(--color-primary)] transition-colors">
          <Link href={`/themes/${theme.id}`} className="after:absolute after:inset-0">
            {theme.name}
          </Link>
        </h3>

        {/* Description */}
        {theme.description && (
          <p className="text-sm text-[color:var(--color-muted-foreground)] leading-relaxed line-clamp-2 mb-4">
            {theme.description}
          </p>
        )}

        {/* Tags */}
        {theme.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {theme.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium tracking-wide text-[color:var(--color-muted-foreground)] before:content-['#']"
              >
                {tag}
              </span>
            ))}
            {theme.tags.length > 3 && (
              <span className="text-[11px] text-[color:var(--color-muted-foreground)]">
                +{theme.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[color:var(--color-border)]">
          <time className="text-xs text-[color:var(--color-muted-foreground)] tracking-wide">
            {formatDate(theme.created_at)}
          </time>

          {onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(theme.id);
              }}
              className="relative z-10 text-xs font-medium text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-destructive)] transition-colors"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
