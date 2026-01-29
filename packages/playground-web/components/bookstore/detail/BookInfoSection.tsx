'use client';

interface BookInfoSectionProps {
  title: string;
  author: string;
  price: string;
  category: string;
  rating: number;
}

export function BookInfoSection({ title, author, price, category, rating }: BookInfoSectionProps) {
  return (
    <section className="px-6 md:px-10 pb-6 md:pb-8">
      <div className="space-y-4">
        {/* Category Badge */}
        <div>
          <span className="inline-block px-3 py-1 text-xs font-medium bg-[var(--atomic-semantic-background-surface-emphasis)]/10 text-[var(--atomic-semantic-text-brand)] rounded-[var(--atomic-radius-full)] border border-[var(--atomic-semantic-border-default-subtle)]">
            {category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-serif)] font-bold text-[var(--atomic-semantic-text-primary)] leading-tight">
          {title}
        </h1>

        {/* Author */}
        <p className="text-lg md:text-xl text-[var(--atomic-semantic-text-secondary)]">
          by {author}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                className="text-[var(--atomic-color-brand-500)]"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-[var(--atomic-semantic-text-secondary)]">
            {rating} out of 5
          </span>
        </div>

        {/* Price */}
        <div className="pt-2">
          <p className="text-3xl md:text-4xl font-bold text-[var(--atomic-semantic-text-brand)]">
            {price}
          </p>
        </div>
      </div>
    </section>
  );
}
