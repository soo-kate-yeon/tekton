'use client';

import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="px-6 md:px-10 pt-6 md:pt-8 pb-8 md:pb-12">
      <div className="relative overflow-hidden rounded-[var(--atomic-radius-lg)] bg-[var(--atomic-color-brand-500)] h-[280px] md:h-[400px] flex items-center shadow-lg">
        {/* Background Pattern/Image Mock */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--atomic-color-brand-900)]/80 to-[var(--atomic-color-brand-500)]/20 z-0"></div>

        <div className="relative z-10 px-6 md:px-12 max-w-2xl text-white">
          <span className="inline-block px-3 py-1 mb-3 md:mb-4 text-[10px] md:text-xs font-medium tracking-wider uppercase border border-white/30 rounded-[var(--atomic-radius-full)] bg-white/10 backdrop-blur-sm">
            Editor's Choice
          </span>
          <h2 className="text-3xl md:text-5xl font-[family-name:var(--font-serif)] font-bold mb-4 md:mb-6 leading-tight">
            The Art of <br /> Minimalism
          </h2>
          <p className="text-sm md:text-lg text-white/90 mb-6 md:mb-8 max-w-lg font-light leading-relaxed">
            Discover how less can be more in design, lifestyle, and thinking.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Link
              href="/bookstore/book/minimalism"
              className="px-6 md:px-8 py-2.5 md:py-3 bg-white text-[var(--atomic-color-brand-500)] font-semibold rounded-[var(--atomic-radius-full)] hover:bg-white/90 transition-colors shadow-md text-sm md:text-base text-center"
            >
              View Collection
            </Link>
            <Link
              href="/bookstore/book/minimalism"
              className="hidden sm:block px-6 md:px-8 py-2.5 md:py-3 bg-[var(--atomic-color-brand-900)]/40 text-white font-medium rounded-[var(--atomic-radius-full)] hover:bg-[var(--atomic-color-brand-900)]/60 transition-colors backdrop-blur-md border border-white/20 text-sm md:text-base text-center"
            >
              Read Abstract
            </Link>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[var(--atomic-color-brand-200)]/20 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}
