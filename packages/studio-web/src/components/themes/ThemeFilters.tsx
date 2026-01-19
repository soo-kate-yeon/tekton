'use client';

import { useState } from 'react';

interface ThemeFiltersProps {
  onCategoryChange: (category: string) => void;
  onTagsChange: (tags: string) => void;
  category?: string;
  tags?: string;
}

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'professional', label: 'Professional' },
  { value: 'creative', label: 'Creative' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'vibrant', label: 'Vibrant' },
  { value: 'custom', label: 'Custom' },
];

export function PresetFilters({
  onCategoryChange,
  onTagsChange,
  category = '',
  tags = '',
}: ThemeFiltersProps) {
  const [localTags, setLocalTags] = useState(tags);

  const handleTagsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onTagsChange(localTags);
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      {/* Category Filters */}
      <nav className="flex items-center" role="tablist" aria-label="Filter by category">
        <div className="flex items-center gap-1 border-b border-[color:var(--color-border)]">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat.value;
            return (
              <button
                key={cat.value}
                role="tab"
                aria-selected={isActive}
                onClick={() => onCategoryChange(cat.value)}
                className={`
                  relative px-4 py-3 text-sm font-medium tracking-wide transition-colors
                  ${isActive
                    ? 'text-[color:var(--color-foreground)]'
                    : 'text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]'
                  }
                `}
              >
                {cat.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[color:var(--color-foreground)]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg
            className="w-4 h-4 text-[color:var(--color-muted-foreground)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by tag..."
          value={localTags}
          onChange={(e) => setLocalTags(e.target.value)}
          onKeyDown={handleTagsKeyDown}
          onBlur={() => onTagsChange(localTags)}
          className="w-full sm:w-56 pl-11 pr-4 py-2.5 text-sm
            bg-[color:var(--color-background)] border border-[color:var(--color-border)]
            placeholder:text-[color:var(--color-muted-foreground)]
            focus:outline-none focus:border-[color:var(--color-foreground)]
            transition-colors"
        />
      </div>
    </div>
  );
}
