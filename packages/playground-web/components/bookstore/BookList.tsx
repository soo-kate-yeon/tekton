'use client';

const books = [
  {
    id: 1,
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    price: '$14.99',
    category: 'science',
    image:
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=200',
    description:
      'The major New York Times bestseller that changes the way we think about thinking.',
  },
  {
    id: 2,
    title: 'Cosmos',
    author: 'Carl Sagan',
    price: '$18.50',
    category: 'science',
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=200',
    description:
      'A classic work of science writing that explores the universe and our place in it.',
  },
  {
    id: 3,
    title: 'The History of Art',
    author: 'E.H. Gombrich',
    price: '$45.00',
    category: 'art',
    image:
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=200',
    description: 'One of the most famous and popular books on art ever written.',
  },
  {
    id: 4,
    title: 'Zero to One',
    author: 'Peter Thiel',
    price: '$12.99',
    category: 'business',
    image:
      'https://images.unsplash.com/photo-1554774853-719586f8c277?auto=format&fit=crop&q=80&w=200',
    description: 'Notes on startups, or how to build the future.',
  },
  {
    id: 5,
    title: 'Atomic Habits',
    author: 'James Clear',
    price: '$16.99',
    category: 'humanities',
    image:
      'https://images.unsplash.com/photo-1555982105-d25af9c5cfaf?auto=format&fit=crop&q=80&w=200',
    description: 'An easy & proven way to build good habits & break bad ones.',
  },
  {
    id: 6,
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    price: '$22.00',
    category: 'humanities',
    image:
      'https://images.unsplash.com/photo-1531297461136-82lw8e8e0c8b?auto=format&fit=crop&q=80&w=200',
    description: 'The exclusive biography of Steve Jobs.',
  },
  {
    id: 7,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    price: '$34.00',
    category: 'technology',
    image:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=200',
    description: 'A Handbook of Agile Software Craftsmanship.',
  },
];

interface BookListProps {
  category: string;
}

export function BookList({ category }: BookListProps) {
  const filteredBooks =
    category === 'all' ? books : books.filter((book) => book.category === category);

  return (
    <div className="px-6 py-4">
      <div className="flex flex-col gap-4">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div
              key={book.id}
              className="flex items-start gap-4 p-4 rounded-[--lm-radius-lg] hover:bg-[--lm-background-surface-default] transition-colors duration-[--lm-motion-duration-moderate] cursor-pointer group border border-transparent hover:border-[--lm-border-default-subtle]"
            >
              <div className="w-20 h-28 flex-none rounded-[--lm-radius-md] overflow-hidden shadow-[--lm-elevation-level-1] bg-gray-100">
                {/* In a real app, use Next.js Image */}
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[--lm-motion-duration-long]"
                />
              </div>

              <div className="flex-1 py-1 min-w-0">
                <h3 className="text-[--lm-text-primary] font-[--lm-font-family-sans] font-[--lm-font-weight-semibold] text-base mb-1 truncate">
                  {book.title}
                </h3>
                <p className="text-[--lm-text-secondary] font-[--lm-font-family-sans] text-sm mb-2">
                  {book.author}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[--lm-text-brand] font-[--lm-font-weight-bold] text-sm">
                    {book.price}
                  </span>
                  <div className="px-2 py-1 bg-[--lm-background-surface-emphasis]/5 rounded-[--lm-radius-sm] text-[10px] uppercase tracking-wider text-[--lm-text-tertiary]">
                    {book.category}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-[--lm-text-tertiary]">
            <p>No books found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
