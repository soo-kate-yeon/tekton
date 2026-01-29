'use client';

interface BookListProps {
  category: string;
}

const BOOKS = [
  {
    id: 1,
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    category: 'design',
    price: '$18.99',
    coverColor: 'var(--atomic-color-neutral-200)',
  },
  {
    id: 2,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'tech',
    price: '$24.99',
    coverColor: 'var(--atomic-color-neutral-300)',
  },
  {
    id: 3,
    title: 'Zero to One',
    author: 'Peter Thiel',
    category: 'business',
    price: '$14.99',
    coverColor: 'var(--atomic-color-neutral-100)',
  },
  {
    id: 4,
    title: 'Refactoring',
    author: 'Martin Fowler',
    category: 'tech',
    price: '$32.00',
    coverColor: 'var(--atomic-color-brand-200)',
  },
  {
    id: 5,
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    category: 'business',
    price: '$16.50',
    coverColor: 'var(--atomic-color-neutral-400)',
  },
  {
    id: 6,
    title: 'The Lean Startup',
    author: 'Eric Ries',
    category: 'business',
    price: '$19.99',
    coverColor: 'var(--atomic-color-neutral-200)',
  },
];

export function BookList({ category }: BookListProps) {
  const filteredBooks =
    category === 'all' ? BOOKS : BOOKS.filter((book) => book.category === category);

  return (
    <section className="px-6 md:px-10 pb-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
        {filteredBooks.map((book) => (
          <div key={book.id} className="group cursor-pointer">
            <div
              className="aspect-[2/3] rounded-[var(--atomic-radius-md)] mb-3 md:mb-4 relative overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-300"
              style={{ backgroundColor: book.coverColor }}
            >
              {/* Mock Cover Design */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="text-center opacity-40">
                  <span className="text-3xl md:text-4xl block mb-2">📖</span>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>

            <div className="space-y-0.5 md:space-y-1">
              <h3 className="text-sm md:text-base font-semibold text-[var(--atomic-semantic-text-primary)] line-clamp-1 group-hover:text-[var(--atomic-semantic-text-brand)] transition-colors">
                {book.title}
              </h3>
              <p className="text-xs md:text-sm text-[var(--atomic-semantic-text-secondary)]">
                {book.author}
              </p>
              <p className="text-xs md:text-sm font-medium text-[var(--atomic-semantic-text-primary)]">
                {book.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
