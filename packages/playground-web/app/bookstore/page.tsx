'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/bookstore/HeroSection';
import { CategoryChips } from '@/components/bookstore/CategoryChips';
import { BookList } from '@/components/bookstore/BookList';

export default function BookstorePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="min-h-screen bg-[--lm-background-canvas] pb-20">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-20 bg-[--lm-background-canvas]/80 backdrop-blur-md border-b border-[--lm-border-default-subtle]">
        <h1 className="text-xl font-[--lm-font-family-serif] font-[--lm-font-weight-bold] text-[--lm-text-primary]">
          Bookstore
        </h1>
        <div className="w-8 h-8 rounded-[--lm-radius-full] bg-[--lm-background-surface-emphasis] flex items-center justify-center">
          <span className="text-sm">🔍</span>
        </div>
      </header>

      <main>
        <HeroSection />
        <CategoryChips selectedId={selectedCategory} onSelect={setSelectedCategory} />
        <BookList category={selectedCategory} />
      </main>

      {/* Bottom Navigation (Mock) */}
      <nav className="fixed bottom-0 left-0 w-full bg-[--lm-background-surface-default] border-t border-[--lm-border-default-subtle] py-3 px-6 flex justify-between items-center z-30">
        <button className="flex flex-col items-center gap-1 text-[--lm-color-neutral-900]">
          <span className="text-xl">🏠</span>
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[--lm-text-secondary]">
          <span className="text-xl">📚</span>
          <span className="text-[10px] font-medium">Library</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[--lm-text-secondary]">
          <span className="text-xl">👤</span>
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>
    </div>
  );
}
