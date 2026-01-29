'use client';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'humanities', label: 'Humanities' },
  { id: 'science', label: 'Science' },
  { id: 'art', label: 'Art & Design' },
  { id: 'business', label: 'Business' },
  { id: 'fiction', label: 'Fiction' },
  { id: 'technology', label: 'Technology' },
];

interface CategoryChipsProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function CategoryChips({ selectedId, onSelect }: CategoryChipsProps) {
  return (
    <div className="w-full sticky top-0 bg-[--lm-background-canvas] z-10 py-4 px-6 border-b border-[--lm-border-default-subtle]/50 backdrop-blur-md bg-[--lm-background-canvas]/80">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {categories.map((category) => {
          const isSelected = selectedId === category.id;
          return (
            <button
              key={category.id}
              onClick={() => onSelect(category.id)}
              className={`
                flex-none px-5 py-2.5 rounded-[--lm-radius-full] text-sm font-[--lm-font-weight-medium] transition-all duration-[--lm-motion-duration-moderate] ease-[--lm-motion-easing-standard] border
                ${
                  isSelected
                    ? 'bg-[--lm-color-neutral-900] text-white border-[--lm-color-neutral-900] shadow-[--lm-elevation-level-1]'
                    : 'bg-[--lm-background-surface-default] text-[--lm-text-secondary] border-[--lm-border-default-subtle] hover:border-[--lm-color-neutral-400] hover:text-[--lm-text-primary]'
                }
              `}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
