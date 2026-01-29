import Link from 'next/link';

export default function NewsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="py-8 border-b border-[--atomic-semantic-border-default-subtle]">
        <div className="text-center">
          <p className="text-sm font-sans font-medium tracking-widest text-[--atomic-color-neutral-500] uppercase mb-2">
            Tuesday, January 28, 2026
          </p>
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight text-[--atomic-color-brand-500]">
            The Atlantic
          </h1>
          <p className="mt-2 font-serif italic text-[--atomic-color-neutral-600]">
            Journalism of no equal.
          </p>
        </div>
      </header>

      {/* App Bar / Navigation */}
      <nav className="py-4 border-b border-[--atomic-semantic-border-default-default] sticky top-0 bg-[--atomic-semantic-background-surface-default] z-10 opacity-95 backdrop-blur">
        <ul className="flex justify-center space-x-6 md:space-x-12 font-sans font-bold text-sm tracking-wide uppercase text-[--atomic-color-neutral-800]">
          {['Politics', 'Technology', 'Culture', 'Business', 'Science', 'Global'].map((item) => (
            <li key={item}>
              <Link href="#" className="hover:text-[--atomic-color-brand-500] transition-colors">
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-12">
        {/* Featured Content (Left Column) */}
        <section className="lg:col-span-8">
          <div className="mb-12">
            <div className="bg-[--atomic-color-neutral-200] aspect-video w-full rounded-sm mb-4 relative overflow-hidden group cursor-pointer">
              {/* Placeholder for real image */}
              <div className="absolute inset-0 flex items-center justify-center text-[--atomic-color-neutral-500]">
                [Featured Image Placeholder]
              </div>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
            </div>
            <span className="text-[--atomic-color-brand-500] font-sans font-bold text-xs tracking-wider uppercase mb-2 block">
              Technology & Society
            </span>
            <Link href="/news/article">
              <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-4 hover:text-[--atomic-color-brand-500] cursor-pointer transition-colors decoration-[--atomic-color-brand-500] hover:underline underline-offset-8">
                The Artificial Mind: When Algorithms Learn to Dream
              </h2>
            </Link>
            <p className="text-xl font-serif text-[--atomic-color-neutral-700] leading-relaxed mb-4">
              New breakthroughs in generative models suggest that machines are engaging in processes
              startlngly similar to human imagination. What does this mean for the future of
              creativity?
            </p>
            <div className="flex items-center text-sm font-sans text-[--atomic-color-neutral-500]">
              <span className="font-bold text-[--atomic-color-neutral-900] mr-2">
                By Sarah Connor
              </span>
              <span>• 8 min read</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[--atomic-semantic-border-default-subtle] pt-8">
            <article>
              <div className="bg-[--atomic-color-neutral-100] aspect-[3/2] w-full rounded-sm mb-3"></div>
              <h3 className="text-2xl font-display font-bold mb-2 leading-snug">
                The Silent Crisis in Modern Architecture
              </h3>
              <p className="text-[--atomic-color-neutral-600] font-serif mb-2 text-sm">
                Why our cities are becoming increasingly hostile to human connection.
              </p>
            </article>
            <article>
              <div className="bg-[--atomic-color-neutral-100] aspect-[3/2] w-full rounded-sm mb-3"></div>
              <h3 className="text-2xl font-display font-bold mb-2 leading-snug">
                Markets Rally as Uncertainty Fades
              </h3>
              <p className="text-[--atomic-color-neutral-600] font-serif mb-2 text-sm">
                Global indices hit record highs amidst new trade agreements.
              </p>
            </article>
          </div>
        </section>

        {/* Sidebar / News List (Right Column) */}
        <aside className="lg:col-span-4 border-l border-[--atomic-semantic-border-default-subtle] lg:pl-8">
          <h3 className="font-sans font-bold text-xs tracking-widest uppercase text-[--atomic-color-neutral-400] mb-6 border-b border-[--atomic-semantic-border-default-subtle] pb-2">
            Latest Headlines
          </h3>
          <div className="space-y-8">
            {[
              {
                category: 'Politics',
                title: 'Senate Passes Historic Climate Bill',
                desc: 'A turning point specifically targeting industrial emissions.',
              },
              {
                category: 'Science',
                title: 'Mars Colony: The First 100 Days',
                desc: 'An exclusive look at the logs from the nascent settlement.',
              },
              {
                category: 'Culture',
                title: 'The Return of Jazz in the Digital Age',
                desc: 'Streaming platforms are seeing a massive resurgence in classic improvisation.',
              },
              {
                category: 'Opinion',
                title: 'Why We Need to Slow Down AI Development',
                desc: 'The case for a strategic pause before we reach singularity.',
              },
              {
                category: 'Health',
                title: 'The End of Insomnia?',
                desc: 'New research points to a genetic switch for sleep regulation.',
              },
            ].map((news, i) => (
              <article key={i} className="group cursor-pointer">
                <span className="text-[--atomic-color-brand-500] font-sans font-bold text-[10px] tracking-wider uppercase mb-1 block">
                  {news.category}
                </span>
                <h4 className="text-xl font-display font-bold leading-snug mb-2 group-hover:text-[--atomic-color-neutral-600] transition-colors">
                  {news.title}
                </h4>
                <p className="text-sm font-serif text-[--atomic-color-neutral-600] leading-relaxed">
                  {news.desc}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-12 p-6 bg-[--atomic-semantic-background-surface-emphasis] rounded-md text-center">
            <h4 className="font-display font-bold text-lg mb-2">Subscribe to The Atlantic</h4>
            <p className="font-serif text-sm text-[--atomic-color-neutral-600] mb-4">
              Get unlimited access to award-winning journalism.
            </p>
            <button className="bg-[--atomic-color-brand-500] text-white font-sans font-bold text-sm px-6 py-3 rounded-full hover:opacity-90 transition-opacity w-full">
              Subscribe Now
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
