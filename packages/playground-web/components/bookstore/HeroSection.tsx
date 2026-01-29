'use client';

const recommendations = [
  {
    id: 1,
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    image:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
    description:
      'Even the smartest among us can feel inept as we fail to figure out which light switch or oven burner to turn on.',
  },
  {
    id: 2,
    title: 'Essays in Love',
    author: 'Alain de Botton',
    image:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1000',
    description: 'A novel about the beginning, end, and middle of a relationship.',
  },
  {
    id: 3,
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    image:
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1000',
    description: 'Explore the history of humanity from the Stone Age to the Silicon Age.',
  },
];

export function HeroSection() {
  return (
    <section className="w-full relative py-8">
      <div className="px-6 mb-4">
        <h2 className="text-[--lm-text-primary] font-[--lm-font-family-sans] font-[--lm-font-weight-medium] text-lg tracking-tight">
          Today's Recommendations
        </h2>
      </div>

      <div
        className="flex gap-4 overflow-x-auto px-6 pb-6 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {recommendations.map((book) => (
          <div key={book.id} className="flex-none w-[85vw] md:w-[600px] snap-center">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[--lm-radius-lg] shadow-[--lm-elevation-level-1] bg-[--lm-background-surface-default] border border-[--lm-border-default-subtle] group cursor-pointer">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-[--lm-motion-duration-long] ease-[--lm-motion-easing-standard] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[--lm-color-neutral-900] to-transparent opacity-60" />
              <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                <span className="inline-block px-2 py-1 mb-2 text-xs font-[--lm-font-weight-medium] bg-white/20 backdrop-blur-sm rounded-[--lm-radius-sm]">
                  Must Read
                </span>
                <h3 className="text-2xl font-[--lm-font-family-display] font-[--lm-font-weight-bold] mb-1 line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-white/80 font-[--lm-font-family-sans] text-sm mb-2">
                  by {book.author}
                </p>
                <p className="text-white/90 font-[--lm-font-family-serif] text-sm line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-[--lm-motion-duration-moderate]">
                  {book.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
