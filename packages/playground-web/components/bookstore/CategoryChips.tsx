'use client';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'design', label: 'Design' },
  { id: 'tech', label: 'Technology' },
  { id: 'fiction', label: 'Fiction' },
  { id: 'business', label: 'Business' },
  { id: 'art', label: 'Art' },
];

interface CategoryChipsProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function CategoryChips({ selectedId, onSelect }: CategoryChipsProps) {
  return (
    <section className="px-6 md:px-10 mb-6 md:mb-8 overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 md:gap-3 min-w-max pb-1">
        {CATEGORIES.map((category) => {
          const isSelected = selectedId === category.id;
          return (
            <button
              key={category.id}
              onClick={() => onSelect(category.id)}
              className={`
                px-4 md:px-5 py-2.5 md:py-2 rounded-[var(--atomic-radius-full)] text-xs md:text-sm font-medium transition-all duration-200 min-h-[44px] md:min-h-0
                ${
                  isSelected
                    ? 'bg-[var(--atomic-semantic-text-brand)] text-white shadow-md'
                    : 'bg-[var(--atomic-semantic-background-surface-default)] text-[var(--atomic-semantic-text-secondary)] border border-[var(--atomic-semantic-border-default-subtle)] hover:border-[var(--atomic-semantic-border-default-default)] hover:text-[var(--atomic-semantic-text-primary)]'
                }
              `}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
