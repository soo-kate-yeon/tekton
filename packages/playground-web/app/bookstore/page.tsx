'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/bookstore/HeroSection';
import { CategoryChips } from '@/components/bookstore/CategoryChips';
import { BookList } from '@/components/bookstore/BookList';
import { MobileHeader } from '@/components/bookstore/MobileHeader';
import { MobileMenu } from '@/components/bookstore/MobileMenu';
import { BottomNav } from '@/components/bookstore/BottomNav';

export default function BookstorePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen pb-20 md:pb-10">
      {/* Mobile Header */}
      <MobileHeader onMenuClick={() => setMobileMenuOpen(true)} />

      {/* Desktop Header */}
      <header className="hidden md:flex px-10 py-6 items-center justify-between sticky top-0 z-20 bg-[var(--atomic-semantic-background-canvas)]/80 backdrop-blur-md border-b border-[var(--atomic-semantic-border-default-subtle)]">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-[family-name:var(--font-serif)] font-bold text-[var(--atomic-semantic-text-brand)] tracking-tight">
            Blue Bottle Books
          </h1>
          <nav className="flex items-center gap-6">
            <button className="text-[var(--atomic-semantic-text-primary)] font-medium hover:opacity-70 transition-opacity">
              New Details
            </button>
            <button className="text-[var(--atomic-semantic-text-secondary)] font-medium hover:text-[var(--atomic-semantic-text-primary)] transition-colors">
              Bestsellers
            </button>
            <button className="text-[var(--atomic-semantic-text-secondary)] font-medium hover:text-[var(--atomic-semantic-text-primary)] transition-colors">
              Events
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--atomic-semantic-text-secondary)]">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search books..."
              className="pl-9 pr-4 py-2 rounded-[var(--atomic-radius-full)] bg-[var(--atomic-semantic-background-surface-default)] border border-[var(--atomic-semantic-border-default-subtle)] text-sm focus:outline-none focus:border-[var(--atomic-semantic-border-default-default)] transition-colors w-64"
            />
          </div>
          <button className="w-10 h-10 rounded-[var(--atomic-radius-full)] bg-[var(--atomic-semantic-background-surface-emphasis)] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
            <span className="text-sm">👤</span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main>
        <HeroSection />
        <CategoryChips selectedId={selectedCategory} onSelect={setSelectedCategory} />
        <BookList category={selectedCategory} />
      </main>

      {/* Desktop Footer */}
      <footer className="hidden md:block mt-20 py-10 border-t border-[var(--atomic-semantic-border-default-subtle)] text-center text-[var(--atomic-semantic-text-secondary)] text-sm">
        <p>© 2024 Blue Bottle Books. All rights reserved.</p>
      </footer>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
